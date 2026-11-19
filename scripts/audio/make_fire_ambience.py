#!/usr/bin/env python3
"""Long fireplace ambience: crackling fire (dominant) + very quiet piano + faint winter wind.

  python3 -I scripts/audio/make_fire_ambience.py --minutes 60 --out video/out/cozy/noel_ambience.m4a [--no-piano]

All synthesized (royalty-free, monetization-safe), non-repeating, rendered in 30 s blocks.
- fire bed: brown noise, low-passed, slowly breathing (the "roar")
- crackles: Poisson clicks (2-25 ms band-passed noise bursts), bursty, random pan
- pops: rarer, louder, longer, lower (wood snapping)
- piano: sparse soft notes from a pentatonic scale, additive harmonics + decay + small room
  reverb, mixed ~22 dB under the fire
- wind: very faint low-passed noise swells (snow outside)
"""
import argparse
import os
import subprocess
import tempfile
import wave

import numpy as np

SR = 44100
RNG = np.random.default_rng(23)


def fft_filter(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))


def burst(ms, lo, hi):
    n = max(8, int(SR * ms / 1000))
    t = np.arange(n) / SR
    s = fft_filter(RNG.standard_normal(n), lo, hi)
    return s * np.exp(-t / (ms / 1000 / 3)) / (np.abs(s).max() + 1e-9)


def piano_note(freq, dur=6.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for h, amp in ((1, 1.0), (2, 0.45), (3, 0.22), (4, 0.12), (5, 0.06)):
        det = 1 + RNG.uniform(-0.0008, 0.0008)
        s += amp * np.sin(2 * np.pi * freq * h * det * t) * np.exp(-t * (0.6 + 0.5 * h))
    s *= np.minimum(1, t / 0.006)
    return s / np.abs(s).max()


def reverb(x):
    y = x.copy()
    for d, g in ((0.031, 0.5), (0.047, 0.42), (0.071, 0.35), (0.113, 0.28), (0.173, 0.2)):
        k = int(d * SR)
        y[k:] += g * x[:-k]
    return y


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--minutes", type=float, default=60)
    ap.add_argument("--out", required=True)
    ap.add_argument("--no-piano", action="store_true")
    ap.add_argument("--city", type=float, default=0.0, help="distant city hum level (0 = none, ~1 = subtle)")
    ap.add_argument("--fire", type=float, default=1.0, help="fire level (0 = no fireplace)")
    a = ap.parse_args()
    total = int(a.minutes * 60 * SR)
    block = 30 * SR
    tmp = os.path.join(tempfile.mkdtemp(), "fire.wav")
    w = wave.open(tmp, "wb")
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    # piano schedule (whole file): a soft note every 3.5-9 s, C major pentatonic, mid register
    scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]
    piano_events = []
    if not a.no_piano:
        t = 2.0
        while t < total / SR:
            f = scale[RNG.integers(len(scale))]
            piano_events.append((t, f, RNG.uniform(0.5, 1.0)))
            if RNG.random() < 0.35:  # gentle two-note chord
                piano_events.append((t + 0.02, f * (1.5 if f < 400 else 0.75), RNG.uniform(0.3, 0.6)))
            t += RNG.uniform(3.5, 9.0)
    carry = np.zeros((2, 10 * SR))
    pos = 0
    phase = RNG.uniform(0, 6, 4)
    while pos < total:
        n = min(block, total - pos)
        tt = (pos + np.arange(n)) / SR
        # fire roar: brown noise (cumsum), DC-removed, band-limited
        bn = np.cumsum(RNG.standard_normal(n))
        bn -= np.convolve(bn, np.ones(4410) / 4410, mode="same")
        roar = fft_filter(bn, 30, 700)
        roar /= np.abs(roar).max() + 1e-9
        breathe = 0.65 + 0.2 * np.sin(2 * np.pi * tt / 7.3 + phase[0]) + 0.15 * np.sin(2 * np.pi * tt / 2.9 + phase[1])
        hiss = fft_filter(RNG.standard_normal(n), 2500, 9000)
        hiss /= np.abs(hiss).max() + 1e-9
        L = (0.28 * roar * breathe + 0.025 * hiss) * a.fire
        R = (0.28 * np.roll(roar, 37) * breathe + 0.025 * np.roll(hiss, 91)) * a.fire
        # crackles: bursty Poisson process
        rate = 7 * (0.6 + 0.4 * np.sin(2 * np.pi * tt[:: SR // 10] / 11 + phase[2]) ** 2)
        for k, r in enumerate(rate):
            for _ in range(RNG.poisson(r / 10)):
                at = k * (SR // 10) + RNG.integers(SR // 10)
                b = burst(RNG.uniform(2, 22), 1500, RNG.uniform(5000, 11000)) * RNG.lognormal(-1.6, 0.6) * a.fire
                pan = RNG.uniform(-0.5, 0.5)
                e = min(len(b), n - at)
                if e > 0:
                    L[at:at + e] += b[:e] * (1 - pan) * 0.5
                    R[at:at + e] += b[:e] * (1 + pan) * 0.5
        for _ in range(RNG.poisson(0.35 * n / SR)):  # wood pops / snaps
            at = RNG.integers(n)
            b = burst(RNG.uniform(30, 90), 400, 3500) * RNG.uniform(0.35, 0.8) * a.fire
            pan = RNG.uniform(-0.4, 0.4)
            e = min(len(b), n - at)
            L[at:at + e] += b[:e] * (1 - pan) * 0.5
            R[at:at + e] += b[:e] * (1 + pan) * 0.5
        # faint wind outside
        wind = fft_filter(RNG.standard_normal(n), 80, 600)
        wind = wind / (np.abs(wind).max() + 1e-9) * (0.5 + 0.5 * np.sin(2 * np.pi * tt / 17 + phase[3]))
        L += 0.02 * wind
        R += 0.02 * np.roll(wind, 200)
        if a.city:
            # distant city: low traffic rumble + occasional far car passes (heard through glass)
            hum = fft_filter(RNG.standard_normal(n), 35, 260)
            hum = hum / (np.abs(hum).max() + 1e-9) * (0.7 + 0.3 * np.sin(2 * np.pi * tt / 23 + phase[2]))
            L += 0.05 * a.city * hum
            R += 0.05 * a.city * np.roll(hum, 400)
            for _ in range(RNG.poisson(n / SR / 12)):
                at = RNG.integers(n)
                dur = int(RNG.uniform(5, 9) * SR)
                env = np.sin(np.linspace(0, np.pi, dur)) ** 2
                car = fft_filter(RNG.standard_normal(dur), 60, 900) * env
                car = car / (np.abs(car).max() + 1e-9) * 0.035 * a.city
                pan = np.linspace(-0.6, 0.6, dur) * RNG.choice([-1, 1])
                e = min(dur, n - at)
                L[at:at + e] += car[:e] * (1 - pan[:e]) * 0.5
                R[at:at + e] += car[:e] * (1 + pan[:e]) * 0.5
        out = np.stack([L, R])
        # piano (quiet), with carry-over of tails into the next block
        CAR = carry.shape[1]
        m = min(n, CAR)
        out[:, :m] += carry[:, :m]
        nc = np.zeros((2, CAR))
        if n < CAR:
            nc[:, : CAR - n] = carry[:, n:]
        carry = nc
        for (st, f, v) in piano_events:
            s0 = int(st * SR) - pos
            if 0 <= s0 < n:
                note = reverb(piano_note(f)) * v * 0.022
                pan = RNG.uniform(-0.3, 0.3)
                buf = np.zeros((2, n + len(note)))
                buf[0, s0:s0 + len(note)] += note * (1 - pan)
                buf[1, s0:s0 + len(note)] += note * (1 + pan)
                out += buf[:, :n]
                tail = buf[:, n:]
                carry[:, : tail.shape[1]] += tail
        out = np.tanh(out * 1.4) / 1.4
        w.writeframes((np.clip(out.T, -1, 1) * 30000).astype("<i2").tobytes())
        pos += n
    w.close()
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    part = a.out + ".part.m4a"  # written fully, then renamed (safe if the machine restarts)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-18:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", part], check=True)
    os.replace(part, a.out)
    os.remove(tmp)
    print("ok", a.out, a.minutes, "min")


if __name__ == "__main__":
    main()
