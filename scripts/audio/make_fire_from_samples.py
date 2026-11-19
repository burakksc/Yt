#!/usr/bin/env python3
"""Long fireplace bed from short REAL recordings (e.g. Mixkit SFX Free License clips), non-repeating.

  python3 -I scripts/audio/make_fire_from_samples.py --src a.mp3 [b.mp3 ...] --minutes 60 --out fire.m4a [--bed other.m4a --bed-gain 1]

Granular re-sequencing: random 3-8 s slices from the sources, random start, gain +-2 dB, 1 s equal-power
crossfades, occasional L/R swap -> no audible loop. Optional --bed (e.g. quiet piano/city from
make_fire_ambience.py --fire 0) is mixed underneath. Loudness-normalised to -18 LUFS, AAC 192k.
"""
import argparse
import os
import subprocess
import tempfile

import numpy as np

SR = 44100


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", nargs="+", required=True)
    ap.add_argument("--minutes", type=float, default=1)
    ap.add_argument("--out", required=True)
    ap.add_argument("--bed")
    ap.add_argument("--bed-gain", type=float, default=1.0)
    ap.add_argument("--trim", type=float, default=0.5, help="seconds cut from each source start/end (fades)")
    ap.add_argument("--seed", type=int, default=11)
    a = ap.parse_args()
    rng = np.random.default_rng(a.seed)
    srcs = []
    for p in a.src:
        x = load(p)
        k = int(a.trim * SR)
        x = x[k:len(x) - k]
        srcs.append(x / (np.sqrt((x ** 2).mean()) + 1e-9))  # equal loudness per source
    total = int(a.minutes * 60 * SR)
    X = int(1.0 * SR)
    fade_in = np.sin(np.linspace(0, np.pi / 2, X))[:, None]
    fade_out = np.cos(np.linspace(0, np.pi / 2, X))[:, None]
    tmp = os.path.join(tempfile.mkdtemp(), "f.f32")
    out = open(tmp, "wb")
    written = 0
    tail = None
    while written < total:
        s = srcs[rng.integers(len(srcs))]
        L = min(len(s), int(rng.uniform(3, 8) * SR) + X)
        st = rng.integers(0, len(s) - L + 1)
        g = (s[st:st + L] * 10 ** (rng.uniform(-2, 2) / 20)).copy()
        if rng.random() < 0.5:
            g = g[:, ::-1]
        if tail is not None:
            g[:X] = g[:X] * fade_in + tail * fade_out
        body = g[:-X]
        tail = g[-X:]
        out.write(body.astype(np.float32).tobytes())
        written += len(body)
    out.close()
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    part = a.out + ".part.m4a"
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", tmp]
    if a.bed:
        cmd += ["-i", a.bed, "-filter_complex",
                f"[0:a]atrim=0:{total / SR},volume=0.25[f];[1:a]volume={a.bed_gain}[b];[f][b]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-18:TP=-1.5:LRA=11[o]",
                "-map", "[o]"]
    else:
        cmd += ["-af", f"atrim=0:{total / SR},loudnorm=I=-18:TP=-1.5:LRA=11"]
    cmd += ["-ar", "48000", "-c:a", "aac", "-b:a", "192k", part]
    subprocess.run(cmd, check=True)
    os.replace(part, a.out)
    os.remove(tmp)
    print("ok", a.out)


if __name__ == "__main__":
    main()
