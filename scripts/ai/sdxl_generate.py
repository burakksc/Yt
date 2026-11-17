#!/usr/bin/env python3
"""Local, key-free image generation with SDXL base + SDXL-Lightning 4-step UNet (CPU).

  ~/.venvs/sd/bin/python scripts/ai/sdxl_generate.py --prompt "..." --out a.png [--w 1344 --h 768 --seed 1 --n 1]

Licence: CreativeML Open RAIL++-M (commercial use allowed). Run scripts/ai/setup_sdxl.sh first.
"""
import argparse
import time

import torch
from diffusers import EulerDiscreteScheduler, StableDiffusionXLPipeline, UNet2DConditionModel
from huggingface_hub import hf_hub_download
from safetensors.torch import load_file

BASE = "stabilityai/stable-diffusion-xl-base-1.0"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--w", type=int, default=1344)
    ap.add_argument("--h", type=int, default=768)
    ap.add_argument("--seed", type=int, default=1)
    ap.add_argument("--n", type=int, default=1, help="images with consecutive seeds; out gets _sN suffix")
    a = ap.parse_args()
    torch.set_num_threads(torch.get_num_threads())
    unet = UNet2DConditionModel.from_config(BASE, subfolder="unet")
    unet.load_state_dict(load_file(hf_hub_download("ByteDance/SDXL-Lightning", "sdxl_lightning_4step_unet.safetensors")))
    pipe = StableDiffusionXLPipeline.from_pretrained(BASE, unet=unet, torch_dtype=torch.float32, variant="fp16")
    pipe.scheduler = EulerDiscreteScheduler.from_config(pipe.scheduler.config, timestep_spacing="trailing")
    for i in range(a.n):
        t = time.time()
        g = torch.Generator().manual_seed(a.seed + i)
        img = pipe(a.prompt, negative_prompt=None, num_inference_steps=4, guidance_scale=0,
                   width=a.w, height=a.h, generator=g).images[0]
        out = a.out if a.n == 1 else a.out.replace(".png", f"_s{a.seed + i}.png")
        img.save(out)
        print(f"saved {out} in {time.time() - t:.0f}s")


if __name__ == "__main__":
    main()
