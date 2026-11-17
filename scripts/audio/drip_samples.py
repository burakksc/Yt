#!/usr/bin/env python3
"""Render a reel of synthesized water-drop variants (A–F) so the user can pick one.

  python3 -I scripts/audio/drip_samples.py --out video/out/sfx/damla-ornekleri.m4a

Physics-inspired: a real drop that hits water traps an air bubble whose ring-down has a
RISING pitch (Minnaert resonance as the bubble shrinks/rises) — the classic "plink".
Each variant: ~5 s, 3–4 drops, cave/room reverb; 1 s silence between variants.
"""
import argparse
import os
import subprocess
import tempfile
import wave

import numpy as np

SR = 48000
RNG = np.random.default_rng(3)


def lp(x, hi, order=4):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / np.sqrt(1 + (f / hi) ** (2 * order)), len(x))


def hp(x, lo, order=2):
    X = np.fft.rfft(x)
    f = np.maximum(np.fft.rfftfreq(len(x), 1 / SR), 1e-6)
    return np.fft.irfft(X / np.sqrt(1 + (lo / f) ** (2 * order)), len(x))


def bubble(f0, rise=0.9, decay=55, dur=0.18):
    """Bubble 'plink': damped sine with exponentially rising frequency."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f0 * (1 + rise * (1 - np.exp(-t * 60)))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * decay)
    s[: int(0.0015 * SR)] *= np.linspace(0, 1, int(0.0015 * SR))
    return s


def impact(dur=0.03, hi=6000):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return lp(RNG.standard_normal(n), hi) * np.exp(-t * 180)


def splash(dur=0.25):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return hp(lp(RNG.standard_normal(n), 7000), 1500) * np.exp(-t * 25) * 0.25


def metal(f0=1400, dur=1.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f0 * r * t) * np.exp(-t * d) for r, a, d in [(1, 1, 5), (2.76, 0.5, 8), (5.4, 0.25, 12), (8.9, 0.12, 18)])
    return add(s * 0.5, impact() * 0.3)


def add(*sigs):
    """Sum signals of different lengths (zero-padded)."""
    n = max(len(x) for x in sigs)
    out = np.zeros(n)
    for x in sigs:
        out[: len(x)] += x
    return out


def reverb(x, seconds, wet, damp=3.0, hi=5000):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = lp(RNG.standard_normal(n), hi) * np.exp(-t * damp)
    ir[: int(0.012 * SR)] = 0  # pre-delay
    ir /= np.sqrt((ir ** 2).sum())
    N = len(x) + n
    y = np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)
    out = np.zeros(N)
    out[: len(x)] += x * (1 - wet)
    out += y * wet * 3
    return out


def place(events, total):
    buf = np.zeros(int(total * SR))
    for at, sig, g in events:
        i = int(at * SR)
        L = min(len(sig), len(buf) - i)
        buf[i : i + L] += sig[:L] * g
    return buf


def variants():
    v = {}
    # A: classic cave plink (rising bubble), medium reverb
    v["A"] = reverb(place([(0.3, add(bubble(1300), impact() * 0.3), 1), (1.7, add(bubble(1550), impact() * 0.3), 0.8), (3.4, add(bubble(1200), impact() * 0.3), 0.9)], 4.5), 2.5, 0.45)
    # B: deep 'bloop' — big drop into a pool
    v["B"] = reverb(place([(0.3, add(bubble(520, rise=1.2, decay=28, dur=0.35), impact(0.04, 2500) * 0.4), 1), (2.0, bubble(600, rise=1.1, decay=30, dur=0.35), 0.8), (3.5, bubble(480, rise=1.3, decay=26, dur=0.4), 0.9)], 4.5), 2.0, 0.35)
    # C: drop on wet stone — tiny tick + splash, no pitch
    v["C"] = reverb(place([(0.3, add(impact(0.02, 9000), splash()), 1), (1.2, add(impact(0.02, 8000), splash()), 0.7), (2.6, add(impact(0.02, 9000), splash()), 0.9), (3.7, add(impact(0.02, 7000), splash()), 0.6)], 4.5), 1.6, 0.4, damp=4)
    # D: drip onto a metal pipe / bucket
    v["D"] = reverb(place([(0.3, metal(1450), 0.8), (2.0, metal(1420), 0.6), (3.6, metal(1480), 0.7)], 5.0), 1.5, 0.3)
    # E: distant drips in a huge cistern — soft, long echo, irregular
    ev = [(t, bubble(RNG.uniform(1100, 2000)), RNG.uniform(0.25, 0.5)) for t in np.sort(RNG.uniform(0.2, 4.2, 8))]
    v["E"] = reverb(lp(place(ev, 4.8), 3500), 4.5, 0.7, damp=1.3, hi=3500)
    # F: cistern close-up — plink + ripple slosh + quiet water bed
    bed = lp(RNG.standard_normal(int(4.8 * SR)), 900) * 0.04
    v["F"] = reverb(add(place([(0.4, add(bubble(1250), splash() * 0.6), 1), (1.9, add(bubble(1400), splash() * 0.5), 0.8), (3.3, add(bubble(1150), splash() * 0.6), 0.9)], 4.8), bed), 3.0, 0.5, damp=2.2)
    return v


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    v = variants()
    gap = np.zeros(int(1.2 * SR))
    parts, marks, t = [], [], 0.0
    for k, sig in v.items():
        sig = sig / (np.abs(sig).max() + 1e-9) * 0.8
        marks.append((k, t))
        parts += [sig, gap]
        t += (len(sig) + len(gap)) / SR
    mono = np.concatenate(parts)
    # light stereo width: tiny delay on the right channel
    d = int(0.012 * SR)
    st = np.stack([mono, np.concatenate([np.zeros(d), mono[:-d]])])
    tmp = os.path.join(tempfile.mkdtemp(), "reel.wav")
    with wave.open(tmp, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st.T * 32767).astype("<i2").tobytes())
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-20:TP=-2", "-c:a", "aac", "-b:a", "192k", a.out], check=True)
    for k, s in marks:
        print(f"{k} {int(s // 60)}:{s % 60:04.1f}")


if __name__ == "__main__":
    main()
