#!/usr/bin/env python3
"""Inpaint (remove/replace) a masked region with SDXL base + Lightning 4-step UNet (CPU, bf16).

  ~/.venvs/sd/bin/python scripts/ai/sdxl_inpaint.py --img in.png --mask m.png --prompt "..." --out o.png [--strength 0.99 --seed 1]
mask: white = repaint. Image size kept (multiple of 8). Licence: CreativeML Open RAIL++-M.
"""
import argparse

import torch
from diffusers import EulerDiscreteScheduler, StableDiffusionXLInpaintPipeline, UNet2DConditionModel
from huggingface_hub import hf_hub_download
from PIL import Image
from safetensors.torch import load_file

BASE = "stabilityai/stable-diffusion-xl-base-1.0"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--img", required=True)
    ap.add_argument("--mask", required=True)
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--strength", type=float, default=0.99)
    ap.add_argument("--seed", type=int, default=1)
    a = ap.parse_args()
    dtype = torch.bfloat16
    unet = UNet2DConditionModel.from_config(BASE, subfolder="unet")
    unet.load_state_dict(load_file(hf_hub_download("ByteDance/SDXL-Lightning", "sdxl_lightning_4step_unet.safetensors")))
    unet.to(dtype)
    pipe = StableDiffusionXLInpaintPipeline.from_pretrained(BASE, unet=unet, torch_dtype=dtype, variant="fp16")
    pipe.enable_attention_slicing()
    pipe.scheduler = EulerDiscreteScheduler.from_config(pipe.scheduler.config, timestep_spacing="trailing")
    img = Image.open(a.img).convert("RGB")
    m = Image.open(a.mask).convert("L")
    w, h = img.size
    out = pipe(a.prompt, image=img, mask_image=m, num_inference_steps=4, guidance_scale=0, strength=a.strength,
               width=w, height=h, generator=torch.Generator().manual_seed(a.seed)).images[0]
    # keep untouched pixels exactly: blend by a feathered mask
    from PIL import ImageFilter
    fm = m.filter(ImageFilter.GaussianBlur(6))
    Image.composite(out, img, fm).save(a.out)
    print("saved", a.out)


if __name__ == "__main__":
    main()
