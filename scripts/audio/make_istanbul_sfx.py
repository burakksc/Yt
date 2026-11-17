#!/usr/bin/env python3
"""Synthesized ambient soundtrack for "Istanbul beneath Istanbul" (no voice).

  python3 -I scripts/audio/make_istanbul_sfx.py --story video/src/videos/istanbul-alti/story.ts \
      --out video/public/istanbul-alti/soundtrack.m4a [--drips assets/sfx/drips_suikinkutsu_enkoji.m4a]

Everything is generated (royalty-free, monetization-safe). Scene timings are read from story.ts
(`id: "…"` + `sec: N`). Layers: low underground drone, cave wind, door creaks / stone-door rumbles at
scene starts, water drips (cistern), servo whirr (robot camera), muffled market murmur, chain rattle,
wood creaks + water lapping (harbor), soft heartbeat-like pulse on legend reveals, all through a
cave reverb.
"""
import argparse
import os
import re
import subprocess
import tempfile
import wave

import numpy as np

SR = 44100
RNG = np.random.default_rng(17)


def lp(x, hi, order=4):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / np.sqrt(1 + (f / hi) ** (2 * order)), len(x))


def bp(x, lo, hi, order=3):
    X = np.fft.rfft(x)
    f = np.maximum(np.fft.rfftfreq(len(x), 1 / SR), 1e-6)
    g = 1 / np.sqrt(1 + (f / hi) ** (2 * order)) / np.sqrt(1 + (lo / f) ** (2 * order))
    return np.fft.irfft(X * g, len(x))


def norm(x):
    return x / (np.abs(x).max() + 1e-9)


def env_ad(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-3)) * np.exp(-np.maximum(0, t - a) / d)


# ---------- events ----------

def creak(dur=1.6, pitch=180):
    """Wooden/iron door creak: a stick-slip pulse train with wandering pitch through formants."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = pitch * (1 + 0.35 * np.sin(2 * np.pi * 0.7 * t) + 0.15 * RNG.standard_normal(n).cumsum() / np.sqrt(n))
    ph = np.cumsum(f) / SR
    pulses = (np.diff(np.floor(ph), prepend=0) > 0).astype(float)
    pulses += 0.15 * RNG.standard_normal(n)
    sig = sum(bp(pulses, fc * 0.8, fc * 1.2, 2) for fc in (700, 1500, 2600))
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 0.6
    return norm(sig) * e


def stone_rumble(dur=2.4):
    n = int(dur * SR)
    noise = lp(RNG.standard_normal(n), 220)
    grit = bp(RNG.standard_normal(n), 300, 1200) * 0.25 * (RNG.random(n) < 0.02)
    t = np.arange(n) / SR
    e = np.minimum(1, t / 0.25) * np.minimum(1, (dur - t) / 0.6)
    return norm(noise + grit) * e


def thud(dur=1.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * (45 + 60 * np.exp(-t * 12)) * t) * np.exp(-t * 5)
    s += lp(RNG.standard_normal(n), 400) * np.exp(-t * 18) * 0.5
    return norm(s)


def drip(pitch=None):
    pitch = pitch or RNG.uniform(900, 1700)
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = pitch * (1 + 1.5 * np.exp(-t * 40))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 22)


def servo(dur=4.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 320 + 40 * np.sin(2 * np.pi * 0.5 * t)
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.4 + 0.3 * bp(RNG.standard_normal(n), 2000, 5000)
    s = lp(s, 2500)
    e = np.minimum(1, t / 0.3) * np.minimum(1, (dur - t) / 0.4)
    beeps = np.zeros(n)
    for k in np.arange(0.5, dur, 1.0):
        i0 = int(k * SR)
        L = int(0.06 * SR)
        if i0 + L < n:
            beeps[i0:i0 + L] = np.sin(2 * np.pi * 1800 * np.arange(L) / SR) * 0.5
    return norm(s) * e * 0.6 + beeps


def murmur(dur=6.0):
    """Muffled crowd/market heard through stone: many band-limited voice-like noises."""
    n = int(dur * SR)
    out = np.zeros(n)
    for _ in range(14):
        f0 = RNG.uniform(110, 230)
        t = np.arange(n) / SR
        syll = (np.sin(2 * np.pi * RNG.uniform(2.5, 5) * t + RNG.uniform(0, 6)) > 0.2).astype(float)
        syll = lp(syll, 12)
        out += bp(RNG.standard_normal(n), f0 * 2, f0 * 5) * syll
    out = lp(out, 700)
    t = np.arange(n) / SR
    return norm(out) * np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 1.5)


def chains(dur=2.5):
    n = int(dur * SR)
    out = np.zeros(n)
    for k in np.sort(RNG.uniform(0, dur - 0.2, 26)):
        i0 = int(k * SR)
        L = int(0.12 * SR)
        tt = np.arange(L) / SR
        ring = sum(np.sin(2 * np.pi * fr * tt) for fr in RNG.uniform(1800, 5200, 3)) * np.exp(-tt * 45)
        out[i0:i0 + L] += ring * RNG.uniform(0.3, 1)
    return norm(out)


def wood_creak_long(dur=3.0):
    return creak(dur, pitch=90) * 0.8


def lapping(dur=10.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = bp(RNG.standard_normal(n), 200, 1400) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.35 * t)) ** 2
    return norm(s) * np.minimum(1, t / 1.5) * np.minimum(1, (dur - t) / 1.5)


def still_water(dur=14.0):
    """Calm water in a stone basin + faint pump-like hum (no drips): several slowly
    modulated noise bands so it never sounds like a loop."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for lo, hi, rate, ph in ((250, 700, 0.11, 0.0), (600, 1600, 0.17, 1.3), (1400, 3200, 0.23, 2.1)):
        mod = 0.55 + 0.45 * np.sin(2 * np.pi * rate * t + ph) * np.sin(2 * np.pi * rate * 0.37 * t + ph * 2)
        s += norm(bp(RNG.standard_normal(n), lo, hi)) * mod * (0.9 if lo < 500 else 0.5)
    hum = np.sin(2 * np.pi * 50 * t) * 0.6 + np.sin(2 * np.pi * 100 * t) * 0.25 + lp(RNG.standard_normal(n), 120) * 3
    s = norm(s) + norm(hum) * 0.18
    return norm(s) * np.minimum(1, t / 1.5) * np.minimum(1, (dur - t) / 1.5)


def pulse(dur=2.0):
    n = int(dur * SR)
    out = np.zeros(n)
    for k in (0.0, 0.32, 1.0, 1.32):
        i0 = int(k * SR)
        L = int(0.25 * SR)
        if i0 + L < n:
            tt = np.arange(L) / SR
            out[i0:i0 + L] += np.sin(2 * np.pi * 55 * tt) * np.exp(-tt * 14)
    return norm(out)


def whoosh_down(dur=5.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = RNG.standard_normal(n)
    # sweep a low-pass from bright to dark by blending two filtered versions
    bright, dark = lp(s, 2500), lp(s, 200)
    k = np.clip(t / dur, 0, 1)
    out = bright * (1 - k) + dark * k
    return norm(out) * np.sin(np.pi * k) ** 1.5


def reverb(x, seconds=2.2, wet=0.35):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = RNG.standard_normal(n) * np.exp(-t * 3.2)
    ir = lp(ir, 3500)
    ir[0] = 0
    ir /= np.abs(ir).sum() / 30
    N = len(x) + n
    y = np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)[: len(x)]
    return x * (1 - wet) + norm(y) * np.abs(x).max() * wet


def load_mono(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         check=True, capture_output=True).stdout
    x = np.frombuffer(raw, np.float32).astype(np.float64)
    return x / (np.abs(x).max() + 1e-9)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--story", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--drips", help="recorded drip file; replaces synth drips in cistern/hagia/galata")
    ap.add_argument("--no-drips", action="store_true", help="no drips at all: still water in the cistern instead")
    a = ap.parse_args()
    rec = load_mono(a.drips) if a.drips else None
    rec_pos = [0]

    def drips(at, dur, gain, synth):
        """Real recording (consecutive, looping slices) if given, else the synth fallback."""
        if a.no_drips:
            if dur > 10:  # the cistern: calm water bed instead of drips
                put(still_water(dur), at, gain * 0.5, -0.2)
                put(still_water(dur), at + 0.02, gain * 0.4, 0.3)
            return
        if rec is None:
            synth()
            return
        L = int(dur * SR)
        idx = (rec_pos[0] + np.arange(L)) % len(rec)
        rec_pos[0] = (rec_pos[0] + L) % len(rec)
        tt = np.arange(L) / SR
        seg = rec[idx] * np.minimum(1, tt / 0.3) * np.minimum(1, (dur - tt) / 0.6)
        put(seg, at, gain, -0.25)
        put(np.roll(seg, int(0.013 * SR)), at, gain * 0.8, 0.35)
    src = open(a.story, encoding="utf-8").read()
    ids = re.findall(r'id: "([a-z]+)",\s*\n\s*sec: ([0-9.]+)', src)
    scenes = [(i, float(s)) for i, s in ids]
    total = sum(s for _, s in scenes)
    n = int(total * SR)
    mix = np.zeros((2, n))

    def put(sig, at, gain=1.0, pan=0.0):
        i0 = int(at * SR)
        L = min(len(sig), n - i0)
        if L <= 0:
            return
        ang = (pan + 1) * np.pi / 4
        mix[0, i0:i0 + L] += sig[:L] * gain * np.cos(ang)
        mix[1, i0:i0 + L] += sig[:L] * gain * np.sin(ang)

    # beds: underground drone + cave wind across the whole video
    t = np.arange(n) / SR
    drone = np.sin(2 * np.pi * 41 * t) + 0.6 * np.sin(2 * np.pi * 61.5 * t) + 0.3 * np.sin(2 * np.pi * 82 * t)
    drone *= 0.6 + 0.4 * np.sin(2 * np.pi * t / 17)
    wind_l = lp(RNG.standard_normal(n), 500) * (0.5 + 0.5 * np.sin(2 * np.pi * t / 9))
    wind_r = lp(RNG.standard_normal(n), 500) * (0.5 + 0.5 * np.sin(2 * np.pi * t / 11 + 1))
    mix[0] += norm(drone) * 0.10 + norm(wind_l) * 0.07
    mix[1] += norm(drone) * 0.10 + norm(wind_r) * 0.07

    start = 0.0
    for sid, sec in scenes:
        if sid == "intro":
            put(whoosh_down(), start + 3.5, 0.35)
            put(thud(), start + 9.0, 0.5)
        elif sid == "cistern":
            put(creak(1.8, 160), start + 0.2, 0.32, -0.3)
            drips(start + 0.8, sec - 1.0, 0.55, lambda st=start, sc=sec: [
                put(drip(), st + 1 + k * 1.3 + RNG.uniform(-0.3, 0.3), 0.22, RNG.uniform(-0.8, 0.8))
                for k in range(int(sc / 1.3))])
            put(lapping(sec - 1), start + 0.5, 0.08)
        elif sid == "map":
            for k in range(10):
                put(drip(2200 + k * 60), start + 0.6 + k * 0.6, 0.06, RNG.uniform(-0.5, 0.5))
        elif sid == "hagia":
            put(stone_rumble(2.2), start + 0.1, 0.45)
            put(servo(4.8), start + 1.0, 0.18, 0.1)
            drips(start + 5.5, 7.5, 0.4, lambda st=start: [
                put(drip(), st + 6 + k * 1.4, 0.18, RNG.uniform(-0.6, 0.6)) for k in range(5)])
        elif sid == "legend":
            put(pulse(), start + 1.0, 0.35)
            put(pulse(), start + 9.0, 0.3)
        elif sid == "bazaar":
            put(murmur(sec - 1), start + 0.3, 0.16)
            put(creak(2.2, 140), start + 2.0, 0.35, 0.2)
        elif sid == "galata":
            put(stone_rumble(2.0), start + 0.2, 0.35)
            put(wood_creak_long(2.4), start + 6.5, 0.18, -0.4)
            drips(start + 6.5, 5.5, 0.35, lambda st=start: [put(drip(), st + 7 + k * 1.2, 0.15) for k in range(4)])
        elif sid == "anemas":
            put(creak(2.6, 120), start + 1.0, 0.38, -0.1)
            put(thud(), start + 3.8, 0.45)
            put(chains(3.0), start + 6.0, 0.2, 0.4)
        elif sid == "yenikapi":
            put(whoosh_down(6), start + 0.3, 0.2)
            put(lapping(sec - 2), start + 1.5, 0.16)
            put(wood_creak_long(3.0), start + 4.0, 0.22, 0.5)
            put(wood_creak_long(2.6), start + 7.5, 0.18, -0.5)
            put(pulse(), start + 8.2, 0.3)
        elif sid == "truth":
            put(whoosh_down(7), start + 3.0, 0.18)
        elif sid == "outro":
            put(thud(), start + 0.2, 0.3)
        start += sec

    mix = np.stack([reverb(mix[0]), reverb(mix[1])])
    fade = np.minimum(1, t / 1.5) * np.minimum(1, (total - t) / 2.5)
    mix *= fade
    mix /= np.abs(mix).max() + 1e-9
    tmp = os.path.join(tempfile.mkdtemp(), "mix.wav")
    with wave.open(tmp, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mix.T * 0.9 * 32767).astype("<i2").tobytes())
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-18:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", a.out], check=True)
    os.remove(tmp)
    print("scenes:", len(scenes), "total:", total, "s ->", a.out)


if __name__ == "__main__":
    main()
