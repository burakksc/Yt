#!/usr/bin/env python3
"""Narration with Kokoro-82M (Apache-2.0, local, CPU). Channel voices: am_michael, bm_lewis.

  ~/.venvs/tts/bin/python -I scripts/tts/kokoro_say.py --voice am_michael --lang en --text "..." --out a.wav
  ~/.venvs/tts/bin/python -I scripts/tts/kokoro_say.py --voice bm_lewis --lang tr --text-file s.txt --out b.wav

Turkish is not an official Kokoro language: text -> espeak-ng Turkish phonemes -> Kokoro.
Fixes for symbols the model lacks/handles badly: ɫ->l, ʏ->y, ɯ->ə (Whisper check: 100% words correct).
Setup: python3.12 -m venv ~/.venvs/tts; pip install torch (cpu index) "kokoro>=0.9" soundfile
"""
import argparse

import numpy as np
import soundfile as sf
from kokoro import KPipeline

REPO = "hexgrad/Kokoro-82M"


def turkish_phonemes(text):
    import espeakng_loader
    from phonemizer import phonemize
    from phonemizer.backend.espeak.wrapper import EspeakWrapper

    EspeakWrapper.set_library(espeakng_loader.get_library_path())
    EspeakWrapper.set_data_path(espeakng_loader.get_data_path())
    ph = phonemize(text, language="tr", backend="espeak", with_stress=True, preserve_punctuation=True, strip=True)
    return ph.replace("ɫ", "l").replace("ʏ", "y").replace("ɯ", "ə")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="am_michael")
    ap.add_argument("--lang", choices=["en", "tr"], default="en")
    ap.add_argument("--text")
    ap.add_argument("--text-file")
    ap.add_argument("--speed", type=float, default=0.92)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    text = a.text or open(a.text_file, encoding="utf-8").read()
    pipe = KPipeline(lang_code="b" if a.voice.startswith("b") else "a", repo_id=REPO)
    if a.lang == "tr":
        chunks = [r.audio for r in pipe.generate_from_tokens(turkish_phonemes(text), voice=a.voice, speed=a.speed)]
    else:
        chunks = [r.audio for r in pipe(text, voice=a.voice, speed=a.speed)]
    audio = np.concatenate([np.asarray(c) for c in chunks])
    sf.write(a.out, audio, 24000)
    print(f"{a.out}: {len(audio) / 24000:.1f}s")


if __name__ == "__main__":
    main()
