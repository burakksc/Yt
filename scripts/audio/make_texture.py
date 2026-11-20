#!/usr/bin/env python3
"""Synthesised ambience textures (royalty-free, monetisation-safe), non-repeating, any length.

  python3 -I scripts/audio/make_texture.py <kind> --minutes 1 --out x.m4a
kinds:
  wind_glass   winter wind heard through a closed window: low gusts + soft resonant howl
  blizzard     stronger snowstorm wind, whistling gusts, fine snow hiss against glass
  jet_cabin    airliner cruise: smooth low engine roar (brown/pink), faint high air hiss
  cockpit      cockpit at cruise: airflow roar + soft avionics/fan hum + rare gentle chime
  prop         turboprop cruise drone: low steady propeller hum with beating harmonics
"""
import argparse
import subprocess

import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def band(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))


def smooth_env(n, rate, lo, hi, seed):
    """Slow random envelope in [lo,hi]; ~rate changes per second."""
    r = np.random.default_rng(seed)
    k = max(4, int(n / SR * rate) + 3)
    pts = r.uniform(lo, hi, k)
    xs = np.linspace(0, n, k)
    e = np.interp(np.arange(n), xs, pts)
    w = int(SR / max(rate, 0.05))
    c = np.cumsum(np.pad(e, (w // 2, w - w // 2), mode="edge"))  # O(n) moving average
    return (c[w:] - c[:-w])[:n] / w


def movavg(x, w):
    c = np.cumsum(np.pad(x, (w // 2, w - w // 2), mode="edge"))
    return (c[w:] - c[:-w])[:len(x)] / w


def sweep_bandpass(x, centers, q, block=4096):
    """Time-varying band-pass via overlapping FFT blocks (centre follows `centers`)."""
    out = np.zeros_like(x)
    win = np.hanning(block)
    hop = block // 2
    f = np.fft.rfftfreq(block, 1 / SR)
    for s in range(0, len(x) - block, hop):
        c = centers[s + hop]
        bw = c / q
        H = np.exp(-0.5 * ((f - c) / bw) ** 2)
        out[s:s + block] += np.fft.irfft(np.fft.rfft(x[s:s + block] * win) * H, block)
    return out


def make(kind, n):
    t = np.arange(n) / SR
    wn = rng.standard_normal(n)
    if kind in ("wind_glass", "blizzard"):
        strong = kind == "blizzard"
        gust = smooth_env(n, 0.15 if not strong else 0.3, 0.15, 1.0, 1) ** 1.5
        low = band(wn, 60, 500) * gust
        cen = 280 + 450 * smooth_env(n, 0.2, 0, 1, 2) + (300 if strong else 0) * gust
        howl = sweep_bandpass(rng.standard_normal(n), cen, 9 if strong else 7) * gust
        L = low / np.abs(low).max() * 0.5 + howl / np.abs(howl).max() * (0.35 if strong else 0.22)
        if strong:
            hiss = band(rng.standard_normal(n), 3000, 9000) * smooth_env(n, 0.5, 0.0, 1.0, 3) * 0.05
            L = L + hiss
        R = np.roll(L, 300) * 0.9 + 0.1 * L
        return L, R
    if kind == "jet_cabin":
        b = np.cumsum(wn); b -= movavg(b, 2205)
        roar = band(b, 25, 900); roar /= np.abs(roar).max()
        air = band(rng.standard_normal(n), 1500, 7000); air /= np.abs(air).max()
        e = 0.92 + 0.08 * smooth_env(n, 0.1, 0, 1, 4)
        L = (0.7 * roar + 0.06 * air) * e
        return L, np.roll(L, 120)
    if kind == "cockpit":
        b = np.cumsum(wn); b -= movavg(b, 2205)
        roar = band(b, 30, 1500); roar /= np.abs(roar).max()
        air = band(rng.standard_normal(n), 800, 5000); air /= np.abs(air).max()
        fan = 0.04 * np.sin(2 * np.pi * 400 * t) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.3 * t)) + 0.02 * np.sin(2 * np.pi * 800 * t)
        L = 0.6 * roar + 0.12 * air + fan
        for st in rng.uniform(5, n / SR - 3, max(1, int(n / SR / 40))):  # rare soft cabin chime (two tones)
            for k, fq in enumerate((880, 660)):
                s0 = int((st + k * 0.6) * SR); m = int(2.5 * SR); tt = np.arange(m) / SR
                if s0 + m < n:
                    L[s0:s0 + m] += 0.05 * np.sin(2 * np.pi * fq * tt) * np.exp(-tt * 2.2)
        return L, np.roll(L, 90)
    if kind == "prop":
        base = sum(a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) for f, a in ((92, 1.0), (184, 0.45), (93.3, 0.6), (276, 0.2)))
        b = np.cumsum(wn); b -= movavg(b, 2205)
        roar = band(b, 30, 700); roar /= np.abs(roar).max()
        L = 0.25 * base / 2.2 + 0.55 * roar
        return L, np.roll(L, 150)
    if kind == "cabin_hum":  # audible on phone/laptop speakers too: deep roar 20-450 Hz + soft 450-1600 Hz air, no tones
        b = np.cumsum(wn); b -= movavg(b, 4410)
        roar = band(b, 20, 450); roar /= np.abs(roar).max()
        mid = band(rng.standard_normal(n), 450, 1600); mid /= np.abs(mid).max()
        e = 0.9 + 0.1 * smooth_env(n, 0.04, 0, 1, 6)
        L = (roar + 0.10 * mid) * e
        return L, np.roll(L, 240)
    if kind.startswith("sleep_"):  # very soft, sleep-friendly cockpit beds: no tones, no hiss, slow swells
        b = np.cumsum(wn); b -= movavg(b, 4410)
        lo, hi, air = {"sleep_deep": (20, 180, 0.0), "sleep_soft": (25, 350, 0.015), "sleep_warm": (40, 600, 0.0)}[kind]
        roar = band(b, lo, hi); roar /= np.abs(roar).max()
        e = 0.85 + 0.15 * smooth_env(n, 0.05, 0, 1, 5)
        L = roar * e
        if air:
            a2 = band(rng.standard_normal(n), 600, 2500); L = L + air * a2 / np.abs(a2).max()
        return L, np.roll(L, 200)
    raise SystemExit("unknown kind")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("kind")
    ap.add_argument("--minutes", type=float, default=1)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    total = int(a.minutes * 60 * SR)
    blk = 60 * SR
    chunks = []
    pos = 0
    while pos < total:  # 60 s blocks with 2 s crossfades (keeps FFT sizes small)
        n = min(blk + 2 * SR, total - pos + 2 * SR)
        L, R = make(a.kind, n)
        chunks.append(np.stack([L, R], 1))
        pos += blk
    X = 2 * SR
    fi = np.linspace(0, 1, X)[:, None]
    y = chunks[0]
    for c in chunks[1:]:
        y = np.concatenate([y[:-X], y[-X:] * (1 - fi) + c[:X] * fi, c[X:]])
    y = y[:total]
    y = y / (np.abs(y).max() + 1e-9) * 0.8
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-",
                    "-af", f"loudnorm=I={-26 if a.kind.startswith('sleep_') else (-19 if a.kind == 'cabin_hum' else -20)}:TP=-2:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", a.out],
                   input=y.astype(np.float32).tobytes(), check=True)
    print("ok", a.out)


if __name__ == "__main__":
    main()
