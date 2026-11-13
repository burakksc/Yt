#!/usr/bin/env python3
"""Synthesize a light, royalty-free background music bed for explainer videos.

  python3 -I scripts/audio/make_music_bed.py --seconds 55.5 --out video/public/sling/music.mp3 \
      --whoosh 4.5,11,18,25,31.5,38.5,47.5

Pads + plucked arpeggio + soft kick/hat at a given BPM, optional whooshes at scene cuts,
fade in/out. Deterministic for a given --seed.
"""
import argparse
import os
import subprocess
import tempfile
import wave

import numpy as np

SR = 44100
NOTE = {"A": 57, "B": 59, "C": 48, "D": 50, "E": 52, "F": 53, "G": 55}
PROG = [  # (root, minor?) Am – F – C – G
    ("A", True),
    ("F", False),
    ("C", False),
    ("G", False),
]


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def chord(root, minor):
    r = NOTE[root]
    return [r, r + (3 if minor else 4), r + 7]


def lowpass(x, cut):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / np.sqrt(1 + (f / cut) ** 4), len(x))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seconds", type=float, required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--bpm", type=float, default=100)
    ap.add_argument("--whoosh", default="")
    ap.add_argument("--seed", type=int, default=5)
    ap.add_argument("--no-drums", action="store_true", help="pads + arpeggio only (lullaby feel)")
    a = ap.parse_args()
    rng = np.random.default_rng(a.seed)
    n = int(a.seconds * SR)
    t = np.arange(n) / SR
    beat = 60 / a.bpm
    bar = beat * 4
    out = np.zeros((2, n))

    for i, b0 in enumerate(np.arange(0, a.seconds, bar)):
        root, minor = PROG[i % len(PROG)]
        notes = chord(root, minor)
        s0, s1 = int(b0 * SR), min(n, int((b0 + bar) * SR))
        tt = t[s0:s1] - b0
        env = np.minimum(1, tt / 0.4) * np.minimum(1, (bar - tt) / 0.4)
        pad = sum(np.sin(2 * np.pi * hz(m + 12) * tt + k) + 0.3 * np.sin(2 * np.pi * hz(m + 24) * tt * 1.003) for k, m in enumerate(notes))
        bass = np.sin(2 * np.pi * hz(notes[0] - 12) * tt)
        out[:, s0:s1] += (0.05 * pad + 0.10 * bass) * env
        # plucked arpeggio on 8th notes
        arp = notes + [notes[1] + 12]
        for k, e0 in enumerate(np.arange(0, bar, beat / 2)):
            m = arp[k % len(arp)] + 24
            p0 = s0 + int(e0 * SR)
            L = min(int(0.45 * SR), n - p0)
            if L <= 0:
                continue
            pt = np.arange(L) / SR
            pl = np.sin(2 * np.pi * hz(m) * pt) * np.exp(-pt * 7) * 0.07
            pan = 0.5 + 0.35 * np.sin(k)
            out[0, p0:p0 + L] += pl * (1 - pan)
            out[1, p0:p0 + L] += pl * pan
        # kick on 1 and 3, hat on off-beats
        for k in range(0 if a.no_drums else 4):
            p0 = s0 + int(k * beat * SR)
            if k % 2 == 0:
                L = min(int(0.3 * SR), n - p0)
                if L > 0:
                    kt = np.arange(L) / SR
                    out[:, p0:p0 + L] += 0.22 * np.sin(2 * np.pi * (50 + 90 * np.exp(-kt * 30)) * kt) * np.exp(-kt * 9)
            h0 = p0 + int(beat / 2 * SR)
            L = min(int(0.05 * SR), n - h0)
            if L > 0:
                ht = np.arange(L) / SR
                hat = np.diff(rng.standard_normal(L + 1)) * np.exp(-ht * 70) * 0.03
                out[:, h0:h0 + L] += hat

    for w in [float(x) for x in a.whoosh.split(",") if x]:
        L = int(0.6 * SR)
        p0 = max(0, int((w - 0.35) * SR))
        L = min(L, n - p0)
        if L <= 0:
            continue
        wt = np.arange(L) / SR
        noise = lowpass(rng.standard_normal(L), 2500)
        env = np.sin(np.pi * wt / wt[-1]) ** 2
        out[:, p0:p0 + L] += 0.12 * noise / (np.abs(noise).max() + 1e-9) * env

    fade = np.minimum(1, t / 1.0) * np.minimum(1, (a.seconds - t) / 1.5)
    out *= fade
    out /= np.abs(out).max() + 1e-9
    out *= 0.7
    tmp = os.path.join(tempfile.mkdtemp(), "bed.wav")
    with wave.open(tmp, "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes((out.T * 32000).astype("<i2").tobytes())
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-20:TP=-2:LRA=7", "-ar", "44100", "-b:a", "160k", a.out], check=True)
    os.remove(tmp)
    print("written:", a.out)


if __name__ == "__main__":
    main()
