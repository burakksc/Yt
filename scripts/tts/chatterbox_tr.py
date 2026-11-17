#!/usr/bin/env python3
"""Turkish narration: Chatterbox Multilingual (MIT) cloned from our Kokoro "am_michael" voice.

  ~/.venvs/cb/bin/python -I scripts/tts/chatterbox_tr.py --text-file s.txt --out a.wav

Setup (CPU torch first, otherwise pip pulls ~2.5 GB of CUDA libs):
  python3.12 -m venv ~/.venvs/cb
  ~/.venvs/cb/bin/pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu torch==2.6.0 torchaudio==2.6.0
  ~/.venvs/cb/bin/pip install --no-cache-dir chatterbox-tts
cfg_weight=0 keeps the voice but drops the English accent of the reference. Outputs carry an inaudible
Perth watermark. CPU speed: ~1-2 s per generated token step (a 12 s sentence takes ~5-10 min).
"""
import argparse
import os

import torch
import torchaudio
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

REF = os.path.join(os.path.dirname(__file__), "../../assets/voice/michael_ref.wav")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--text")
    ap.add_argument("--text-file")
    ap.add_argument("--out", required=True)
    ap.add_argument("--seed", type=int, default=7)
    a = ap.parse_args()
    text = a.text or open(a.text_file, encoding="utf-8").read()
    m = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
    torch.manual_seed(a.seed)
    wav = m.generate(text, language_id="tr", audio_prompt_path=REF, cfg_weight=0.0, exaggeration=0.45)
    torchaudio.save(a.out, wav, m.sr)
    print(f"{a.out}: {wav.shape[-1] / m.sr:.1f}s")


if __name__ == "__main__":
    main()
