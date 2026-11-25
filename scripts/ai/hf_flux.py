#!/usr/bin/env python3
"""Generate images with the FLUX.1-schnell HF Space (Apache-2.0, commercial OK).
Usage: hf_flux.py <out_dir> <name> "<prompt>" [seed] [w] [h]
Auth: the proxy injects the Hugging Face token; no key needed here."""
import sys, shutil, os
from gradio_client import Client
out, name, prompt = sys.argv[1:4]
seed = int(sys.argv[4]) if len(sys.argv) > 4 else 0
w = int(sys.argv[5]) if len(sys.argv) > 5 else 768
h = int(sys.argv[6]) if len(sys.argv) > 6 else 1344
c = Client("https://black-forest-labs-flux-1-schnell.hf.space")
path, used = c.predict(prompt=prompt, seed=seed, randomize_seed=False, width=w, height=h, num_inference_steps=4, api_name="/infer")
os.makedirs(out, exist_ok=True)
shutil.copy(path, f"{out}/{name}_s{seed}.png")
print("ok", name, seed)
