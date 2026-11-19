#!/usr/bin/env python3
"""4K cozy room compositor (numpy/OpenCV -> ffmpeg pipe). Replaces the old SVG-warp fire.

  /root/.venvs/img/bin/python -I scripts/ambience/cozy_composite.py --scene noel --seconds 40 --out preview.mp4 [--audio a.m4a]

Layers on top of an AI-upscaled 4K still:
  - REAL fire footage (Mixkit Free License clip, 10 s seamless loop) inside the firebox mask
  - room light driven by the fire clip's brightness (warm light map, screen-like add)
  - candles: brightness flicker + soft halo only (no geometry warping)
  - 3-layer snowfall clipped to the window-pane mask
All motion is periodic in 60 s (integer cycles), so a 60 s render loops seamlessly.
"""
import argparse
import subprocess

import cv2
import numpy as np

FPS = 30
P = 60.0  # loop period (s)
SCENES = {
    "noel": dict(
        base="video/public/cozy-noel/room4k.png",
        mask="video/public/cozy-noel/window_mask.png",  # 1080p alpha mask, upscaled here
        fire="video/public/cozy-noel/fire_loop_stab.mp4",  # Mixkit 2707 stabilised, 225 f = 8 laps / 60 s
        fire_box=(2245, 1176, 310, 244),  # x, y, w, h in 4K px
        fire_arch=(2400, 1300, 160, 130),  # ellipse centre/radii for the arched top of the opening
        fire_light=(2400, 1330),
        windows=[(1010, 300, 520, 930, 1.0), (3770, 260, 70, 1000, 1.0)],  # x, y, w, h, density
        candles_src=[(732, 182, 9), (757, 183, 6), (717, 195, 6), (933, 191, 8), (945, 179, 7), (891, 253, 6),
                     (648, 184, 6), (679, 499, 8), (577, 532, 7), (614, 534, 7), (251, 519, 6), (1298, 599, 7),
                     (1303, 655, 8), (1254, 660, 7), (1232, 663, 6)],
        src_to_4k=(3840 / 1344, -17),
    ),
    # NYC-B: modern linear gas fireplace. Painted flames removed (nycB_4k_nofire.png); real flames-over-black
    # (Mixkit 52304, Free License) are SCREEN-blended onto the glowing bed, sheared to follow its perspective.
    "nycB": dict(
        base="video/public/cozy-nyc/nycB_4k_nofire.png",
        mask="video/public/cozy-nyc/nycB_mask.png",
        mask_squash=True,
        topline="video/public/cozy-nyc/nycB_topline.npy",  # glass starts below the black top frame (per column)  # 1080p mask was a non-uniform resize of the 1344x768 source
        fire="video/public/cozy-nyc/flames_B.mp4",  # 300 f = 6 laps / 60 s
        fire_mode="screen",
        fire_box=(3098, 1251, 435, 200),
        fire_shear=40,  # bed drops 40 px from left to right
        fire_clip=[(3098, 1246), (3533, 1246), (3533, 1476), (3098, 1436)],
        fire_light=(3320, 1400),
        light_gain=0.8,
        windows=[(20, 110, 2860, 1460, 0.55)],
        candles_src=[],
        src_to_4k=(3840 / 1344, -17),
    ),
}


def periodic_noise(t, seed, n=6):
    """Smooth, P-periodic flicker in ~[0,1] from a few integer-frequency sines."""
    rng = np.random.default_rng(seed)
    v = 0.0
    for k in range(n):
        f = rng.integers(3, 60) / P * (1 + k)  # Hz, integer cycles per P
        v += np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) / (k + 1)
    return 0.5 + 0.5 * v / 1.8


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--scene", default="noel")
    ap.add_argument("--seconds", type=float, default=40)
    ap.add_argument("--out", required=True)
    ap.add_argument("--audio")
    ap.add_argument("--crf", type=int, default=18)
    a = ap.parse_args()
    S = SCENES[a.scene]
    base = cv2.imread(S["base"]).astype(np.float32)
    H, W = base.shape[:2]

    # --- fire clip frames (already cropped to the box size) ---
    cap = cv2.VideoCapture(S["fire"])
    fire = []
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        fire.append(fr.astype(np.float32))
    fx, fy, fw, fh = S["fire_box"]
    yy, xx = np.mgrid[0:fh, 0:fw]
    acx, acy, arx, ary = S.get("fire_arch", (0, -10**6, 1, 1))
    gx, gy = xx + fx, yy + fy
    inside = ((gy >= acy) | (((gx - acx) / arx) ** 2 + ((gy - acy) / ary) ** 2 <= 1)).astype(np.float32)
    top = np.clip(yy / 70.0, 0, 1) ** 1.5  # soft fade into the dark top of the opening (no hard rectangle)
    side = np.clip(np.minimum(xx, fw - 1 - xx) / 14.0, 0, 1)
    fmask = (cv2.GaussianBlur(inside, (0, 0), 3) * top * side)[..., None]
    screen = S.get("fire_mode") == "screen"
    if screen:
        sh = S.get("fire_shear", 0)
        fh2 = fh + sh
        mapx = np.tile(np.arange(fw, dtype=np.float32), (fh2, 1))
        mapy = (np.arange(fh2, dtype=np.float32)[:, None] - sh * np.arange(fw, dtype=np.float32)[None, :] / fw)
        fire = [cv2.remap(f, mapx, mapy.astype(np.float32), cv2.INTER_LINEAR, borderValue=0) for f in fire]
        clip = np.zeros((H, W), np.float32)
        cv2.fillPoly(clip, [np.array(S["fire_clip"], np.int32)], 1.0)
        clip = cv2.GaussianBlur(clip, (0, 0), 3)[fy:fy + fh2, fx:fx + fw][..., None]
        fh = fh2
    fire_luma = np.array([f.mean() for f in fire])
    fl_mean = fire_luma.mean()

    # --- light maps ---
    Y, X = np.mgrid[0:H, 0:W].astype(np.float32)
    lx, ly = S["fire_light"]
    d2 = (X - lx) ** 2 + ((Y - ly) * 1.3) ** 2
    room_light = (np.exp(-d2 / (2 * 900.0 ** 2)) * 0.6 + np.exp(-d2 / (2 * 350.0 ** 2)) * 0.4)[..., None] * np.array([40, 95, 190], np.float32)  # BGR warm
    sx, oy = S["src_to_4k"]
    candles = []
    for i, (cx, cy, r) in enumerate(S["candles_src"]):
        X0, Y0, R = cx * sx, cy * sx + oy, r * sx
        hs = int(R * 9)
        x0, y0 = int(X0 - hs), int(Y0 - hs)
        py, px = np.mgrid[0:2 * hs, 0:2 * hs].astype(np.float32)
        halo = np.exp(-(((px - hs) ** 2 + (py - hs) ** 2) / (2 * (R * 3.2) ** 2)))[..., None] * np.array([60, 140, 230], np.float32)
        core = np.exp(-(((px - hs) ** 2 + ((py - hs + R * 0.4) * 0.7) ** 2) / (2 * (R * 0.9) ** 2)))[..., None]
        candles.append((x0, y0, halo, core, 100 + i))

    # --- snow (periodic): particles per window ---
    wm = cv2.imread(S["mask"], cv2.IMREAD_UNCHANGED)[..., 3]
    if S.get("mask_squash"):
        sy = wm.shape[0] / (H + 34)  # 4K = uniform x2.857 scale of the source, cropped 17 px top/bottom
        M = np.float32([[wm.shape[1] / W, 0, 0], [0, sy, 17 * sy]])
        wmask = cv2.warpAffine(wm, M, (W, H), flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP).astype(np.float32) / 255
    else:
        wmask = cv2.resize(wm, (W, H), interpolation=cv2.INTER_LINEAR).astype(np.float32) / 255
    if S.get("topline"):
        tl = np.load(S["topline"])
        wmask[np.arange(H)[:, None] < tl[None, :W]] = 0
    rng = np.random.default_rng(5)
    flakes = []
    layers = [(170, (2.2, 3.6), (40, 70), 0.55, 0), (70, (4.5, 7.0), (90, 140), 0.75, 1), (22, (9, 14), (170, 240), 0.85, 3)]
    for (wx, wy, ww, wh, dens) in S["windows"]:
        span = wh + 60
        for (n, sz, sp, op, blur) in layers:
            m = max(4, int(n * ww / 520 * dens))
            for _ in range(m):
                k = max(1, round(rng.uniform(*sp) * P / span))  # integer laps per period
                flakes.append(dict(wx=wx, wy=wy, ww=ww, span=span, x=rng.uniform(0, ww), y=rng.uniform(0, span),
                                   v=k * span / P, s=rng.uniform(*sz), o=op * rng.uniform(0.6, 1.0), blur=blur,
                                   fs=rng.integers(1, 5) / P, ph=rng.uniform(0, 6.28), amp=6 + 8 * blur,
                                   drift=rng.integers(-2, 3) * ww / P))

    frames = int(a.seconds * FPS)
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-"]
    if a.audio:
        cmd += ["-i", a.audio, "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "192k", "-shortest"]
    cmd += ["-c:v", "libx264", "-preset", "veryfast", "-crf", str(a.crf), "-pix_fmt", "yuv420p", "-movflags", "+faststart", a.out]
    enc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    snow_layer = np.zeros((H, W), np.float32)
    for fi in range(frames):
        t = fi / FPS
        img = base.copy()
        # fire
        f = fire[fi % len(fire)]
        roi = img[fy:fy + fh, fx:fx + fw]
        if screen:
            fl = f * clip / 255
            img[fy:fy + fh, fx:fx + fw] = 255 - (255 - roi) * (1 - fl)
        else:
            img[fy:fy + fh, fx:fx + fw] = roi * (1 - fmask) + f * 0.92 * fmask
        lum = fire_luma[fi % len(fire)] / fl_mean
        img += room_light * S.get("light_gain", 1.0) * (0.08 + 0.10 * (lum - 0.85))
        # candles
        for (x0, y0, halo, core, seed) in candles:
            fl = periodic_noise(t, seed)
            h, w = halo.shape[:2]
            r = img[y0:y0 + h, x0:x0 + w]
            r += halo[: r.shape[0], : r.shape[1]] * (0.10 + 0.22 * fl)
            r *= 1 + core[: r.shape[0], : r.shape[1]] * (0.10 * (fl - 0.5))
        # snow
        snow_layer[:] = 0
        for p in flakes:
            y = p["wy"] + (p["y"] + p["v"] * t) % p["span"] - 30
            x = p["wx"] + (p["x"] + p["drift"] * t + p["amp"] * np.sin(2 * np.pi * p["fs"] * t + p["ph"])) % p["ww"]
            cv2.circle(snow_layer, (int(x), int(y)), max(1, int(p["s"] / 2)), p["o"], -1, lineType=cv2.LINE_AA)
        sl = cv2.GaussianBlur(snow_layer, (0, 0), 1.2)
        img += (sl * wmask)[..., None] * 235
        enc.stdin.write(np.clip(img, 0, 255).astype(np.uint8).tobytes())
        if fi % 150 == 0:
            print(f"frame {fi}/{frames}", flush=True)
    enc.stdin.close()
    enc.wait()
    print("done", a.out)


if __name__ == "__main__":
    main()
