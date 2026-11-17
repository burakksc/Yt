#!/usr/bin/env bash
# Local, key-free image generation: SDXL base (Stability AI) + SDXL-Lightning 4-step UNet (ByteDance).
# Licence: CreativeML Open RAIL++-M (commercial use allowed, with use-based restrictions).
# CPU only. Installs into ~/.venvs/sd and caches models in ~/.cache/huggingface.
set -euo pipefail
VENV="$HOME/.venvs/sd"
[ -x "$VENV/bin/python" ] || python3 -m venv "$VENV"
"$VENV/bin/pip" install -q --index-url https://download.pytorch.org/whl/cpu torch
"$VENV/bin/pip" install -q diffusers transformers accelerate safetensors huggingface_hub pillow
"$VENV/bin/python" - <<'EOF'
from huggingface_hub import snapshot_download, hf_hub_download
snapshot_download("stabilityai/stable-diffusion-xl-base-1.0",
    allow_patterns=["model_index.json", "scheduler/*", "text_encoder/*fp16.safetensors", "text_encoder/config.json",
                    "text_encoder_2/*fp16.safetensors", "text_encoder_2/config.json", "tokenizer/*", "tokenizer_2/*",
                    "vae/*fp16.safetensors", "vae/config.json", "unet/config.json", "LICENSE.md"])
hf_hub_download("ByteDance/SDXL-Lightning", "sdxl_lightning_4step_unet.safetensors")
print("models ready")
EOF
