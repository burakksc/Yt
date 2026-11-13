#!/usr/bin/env python3
"""Generate a long, non-repeating rainy-city ambience track.

Layers
  - heavy rain (ffmpeg noise generators, stereo, slowly varying intensity)
  - distant thunder rolls at random intervals
  - distant cars passing on a wet road (stereo pan + slight doppler), rare faint horns

Usage
  python3 -I scripts/ambience/make_rain_ambience.py --minutes 60 --out video/out/cozy/ambience.m4a

Everything is synthesized (no samples, no copyright issues). Deterministic for a given --seed.
"""
import argparse
import os
import subprocess
import tempfile
import wave

import numpy as np

SR = 44100


# ---------- small DSP helpers (FFT filtering, no scipy needed) ----------

def fft_filter(x, lo=None, hi=None, order=4):
    """Smooth Butterworth-like band filter applied in the frequency domain."""
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    g = np.ones_like(f)
    if hi:
        g *= 1 / np.sqrt(1 + (f / hi) ** (2 * order))
    if lo:
        g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-6)) ** (2 * order))
    return np.fft.irfft(X * g, n)


def brown(n, rng):
    b = np.cumsum(rng.standard_normal(n))
    b = fft_filter(b, lo=15)
    return b / (np.abs(b).max() + 1e-9)


def norm(x):
    return x / (np.abs(x).max() + 1e-9)


def pan(mono, p):
    """p in [-1, 1] (array or scalar), equal-power."""
    a = (np.asarray(p) + 1) * np.pi / 4
    return np.stack([mono * np.cos(a), mono * np.sin(a)])


# ---------- events ----------

def thunder(rng):
    dur = rng.uniform(11, 17)
    n = int(dur * SR)
    t = np.arange(n) / SR
    env = np.zeros(n)
    for _ in range(rng.integers(3, 7)):
        on = rng.uniform(0, 3.0)
        att = rng.uniform(0.15, 0.7)
        tau = rng.uniform(1.2, 4.0)
        amp = rng.uniform(0.4, 1.0)
        tt = t - on
        e = np.where(tt < 0, 0, np.where(tt < att, tt / att, np.exp(-(tt - att) / tau)))
        env += amp * e
    env = norm(env) * np.clip(1.2 - t / dur, 0, 1)
    chans = []
    for _ in range(2):
        r = fft_filter(brown(n, rng), hi=rng.uniform(140, 220), order=3)
        crackle = fft_filter(rng.standard_normal(n), lo=250, hi=1200) * 0.08
        chans.append(norm(r + crackle) * env)
    st = np.stack(chans)
    p = rng.uniform(-0.5, 0.5)
    return st * np.array([[np.cos((p + 1) * np.pi / 4)], [np.sin((p + 1) * np.pi / 4)]]) * 1.4


def car(rng):
    dur = rng.uniform(6, 10)
    n = int(dur * SR)
    t = np.arange(n) / SR
    tc = dur / 2
    sigma = rng.uniform(1.0, 1.8)
    env = np.exp(-0.5 * ((t - tc) / sigma) ** 2)
    # wet tire swoosh
    hiss = fft_filter(rng.standard_normal(n), lo=700, hi=rng.uniform(3500, 6000), order=2)
    # engine with a little doppler drop as it passes
    f0 = rng.uniform(55, 95)
    f = f0 * (1 + 0.05 * np.tanh(-(t - tc) / 0.7))
    ph = 2 * np.pi * np.cumsum(f) / SR
    engine = np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.25 * np.sin(3 * ph)
    rumble = fft_filter(brown(n, rng), hi=180)
    mono = norm(hiss) * 0.9 + norm(engine) * 0.25 + rumble * 0.35
    mono = fft_filter(mono, hi=rng.uniform(2200, 3800), order=2)  # distance
    mono = norm(mono) * env
    d = rng.choice([-1, 1])
    p = d * np.tanh((t - tc) / (sigma * 1.2)) * 0.85
    return pan(mono, p)


def horn(rng):
    dur = rng.uniform(0.35, 0.7)
    n = int(dur * SR)
    t = np.arange(n) / SR
    f1, f2 = rng.uniform(380, 420), rng.uniform(470, 510)
    sq = np.sign(np.sin(2 * np.pi * f1 * t)) + np.sign(np.sin(2 * np.pi * f2 * t))
    mono = fft_filter(sq, hi=1500, order=2)
    env = np.minimum(1, t / 0.03) * np.minimum(1, (dur - t) / 0.08)
    reps = rng.integers(1, 3)
    mono = norm(mono) * env
    if reps == 2:
        gap = np.zeros(int(0.18 * SR))
        mono = np.concatenate([mono, gap, mono])
    return pan(mono, rng.uniform(-0.7, 0.7))


def schedule(total_s, rng):
    ev = []
    t = rng.uniform(35, 70)
    while t < total_s - 20:
        ev.append((t, "thunder", rng.uniform(0.55, 0.9)))
        t += rng.uniform(120, 330)
    t = rng.uniform(5, 15)
    while t < total_s - 12:
        ev.append((t, "car", rng.uniform(0.18, 0.34)))
        t += max(8.0, rng.exponential(28))
    t = rng.uniform(200, 420)
    while t < total_s - 5:
        ev.append((t, "horn", rng.uniform(0.025, 0.05)))
        t += rng.uniform(300, 720)
    return sorted(ev)


def write_events(path, total_s, seed):
    rng = np.random.default_rng(seed)
    ev = schedule(total_s, rng)
    makers = {"thunder": thunder, "car": car, "horn": horn}
    rendered = []
    for start, kind, gain in ev:
        sig = makers[kind](rng) * gain
        rendered.append((int(start * SR), sig))
    total = int(total_s * SR)
    chunk = 30 * SR
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        i = 0
        for c0 in range(0, total, chunk):
            c1 = min(total, c0 + chunk)
            buf = np.zeros((2, c1 - c0))
            while i < len(rendered) and rendered[i][0] + rendered[i][1].shape[1] < c0:
                i += 1
            for s0, sig in rendered[i:]:
                if s0 >= c1:
                    break
                a, b = max(c0, s0), min(c1, s0 + sig.shape[1])
                if a < b:
                    buf[:, a - c0:b - c0] += sig[:, a - s0:b - s0]
            pcm = (np.clip(buf, -1, 1) * 32000).astype("<i2").T.tobytes()
            w.writeframes(pcm)
    counts = {k: sum(1 for e in ev if e[1] == k) for k in makers}
    return counts


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--minutes", type=float, default=60)
    ap.add_argument("--out", required=True)
    ap.add_argument("--seed", type=int, default=7)
    args = ap.parse_args()
    total = args.minutes * 60
    tmp = tempfile.mkdtemp()
    events = os.path.join(tmp, "events.wav")
    counts = write_events(events, total, args.seed)
    print("events:", counts)

    d = f"duration={total}:sample_rate=44100"
    rain = (
        # rain hiss (stereo, independent seeds)
        f"anoisesrc=color=pink:amplitude=0.7:seed=11:{d},highpass=f=300,lowpass=f=9000[hl];"
        f"anoisesrc=color=pink:amplitude=0.7:seed=12:{d},highpass=f=300,lowpass=f=9000[hr];"
        "[hl][hr]join=inputs=2:channel_layout=stereo[hiss];"
        # heavy body of the rain hitting the street
        f"anoisesrc=color=brown:amplitude=0.8:seed=21:{d},lowpass=f=900,highpass=f=110[bl];"
        f"anoisesrc=color=brown:amplitude=0.8:seed=22:{d},lowpass=f=900,highpass=f=110[br];"
        "[bl][br]join=inputs=2:channel_layout=stereo[body];"
        # droplets / patter on metal and puddles
        f"anoisesrc=color=velvet:amplitude=0.9:density=0.02:seed=31:{d},highpass=f=1500,lowpass=f=7000[dl];"
        f"anoisesrc=color=velvet:amplitude=0.9:density=0.02:seed=32:{d},highpass=f=1500,lowpass=f=7000[dr];"
        "[dl][dr]join=inputs=2:channel_layout=stereo[drops];"
        "[hiss][body][drops]amix=inputs=3:weights=1 0.5 0.35:normalize=0,"
        "volume='0.82+0.10*sin(2*PI*t/173)+0.06*sin(2*PI*t/41)':eval=frame[rain];"
    )
    fc = rain + "[1:a]volume=2.2[ev];[rain][ev]amix=inputs=2:weights=1 1:normalize=0,volume=-1.7dB,alimiter=limit=0.89:attack=5:release=200[out]"
    cmd = [
        "ffmpeg", "-v", "error", "-y",
        "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
        "-i", events,
        "-filter_complex", fc.replace("[1:a]", "[1:a]"),
        "-map", "[out]", "-t", str(total), "-ar", "44100",
        "-c:a", "aac", "-b:a", "192k", args.out,
    ]
    subprocess.run(cmd, check=True)
    os.remove(events)
    print("written:", args.out)


if __name__ == "__main__":
    main()
