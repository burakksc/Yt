# style FIRST (CLIP truncates at 77 tokens). one SDXL-Lightning load, generate prompts sequentially (one image at a time). usage: sdxl_batch.py prompts.json outdir
import json,sys,time,os,torch
from diffusers import EulerDiscreteScheduler, StableDiffusionXLPipeline, UNet2DConditionModel
from huggingface_hub import hf_hub_download
from safetensors.torch import load_file
B="stabilityai/stable-diffusion-xl-base-1.0"; P=json.load(open(sys.argv[1])); out=sys.argv[2]
unet=UNet2DConditionModel.from_config(B,subfolder="unet"); unet.load_state_dict(load_file(hf_hub_download("ByteDance/SDXL-Lightning","sdxl_lightning_4step_unet.safetensors"))); unet.to(torch.bfloat16)
pipe=StableDiffusionXLPipeline.from_pretrained(B,unet=unet,torch_dtype=torch.bfloat16,variant="fp16"); pipe.enable_attention_slicing()
pipe.scheduler=EulerDiscreteScheduler.from_config(pipe.scheduler.config,timestep_spacing="trailing")
for k,v in P["items"].items():
    for seed in v.get("seeds",[1]):
        f=f"{out}/{k}_s{seed}.png"
        if os.path.exists(f): continue
        t=time.time(); img=pipe(P["style"]+", "+v["prompt"],num_inference_steps=4,guidance_scale=0,width=P["w"],height=P["h"],generator=torch.Generator().manual_seed(seed)).images[0]
        img.save(f); print("saved",f,round(time.time()-t),flush=True)
print("ALLDONE",flush=True)
