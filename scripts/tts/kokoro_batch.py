#!/usr/bin/env python3
"""Batch Kokoro (am_michael, EN): one model load for many sentences.
  ~/.venvs/tts/bin/python -I scripts/tts/kokoro_batch.py tts.json out_root   # keys "<slug>/<id>" -> <out_root>/<slug>/en/<id>.wav"""
import json, os, sys
import numpy as np, soundfile as sf
from kokoro import KPipeline
items = json.load(open(sys.argv[1])); root = sys.argv[2]
pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
for k, text in items.items():
    slug, sid = k.split("/"); out = f"{root}/{slug}/en/{sid}.wav"
    if os.path.exists(out): continue
    os.makedirs(os.path.dirname(out), exist_ok=True)
    audio = np.concatenate([np.asarray(r.audio) for r in pipe(text, voice="am_michael", speed=0.92)])
    sf.write(out, audio, 24000); print(k, round(len(audio)/24000,2), flush=True)
print("TTSALLDONE", flush=True)
