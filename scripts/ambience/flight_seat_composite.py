#!/usr/bin/env python3
"""Night-flight business-class seat (AI still, upscaled 4K, night-graded) brought to life:
city lights twinkle in the windows, own route overlay on the seat screen, gentle cabin-light breathing.
All motion periodic in 60 s.

  /root/.venvs/img/bin/python -I scripts/ambience/flight_seat_composite.py --img projects/flight/seat_s41_4k.png \
      --seconds 40 --out x.mp4 [--audio a.m4a --still s.png]
Coordinates below are in the 1344x768 source image (scaled to 4K automatically).
"""
import argparse
import subprocess

import cv2
import numpy as np

FPS, P = 30, 60.0
WINDOWS = [(101, 353, 70, 98), (607, 336, 48, 82), (806, 340, 48, 78), (237, 188, 34, 14)]  # cx, cy, rx, ry
SCREEN = [(905, 205), (1237, 192), (1245, 435), (910, 430)]  # TL TR BR BL (display area)


def grade(img):
    im = img.astype(np.float32) / 255
    lum = im.max(2, keepdims=True)
    keep = np.clip((lum - 0.75) / 0.25, 0, 1)
    dark = (im ** 1.6) * 0.45
    dark[..., 0] *= 1.15
    return np.clip((dark * (1 - keep) + im * keep * 0.9) * 255, 0, 255)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--img", required=True)
    ap.add_argument("--seconds", type=float, default=40)
    ap.add_argument("--out", required=True)
    ap.add_argument("--audio")
    ap.add_argument("--still")
    ap.add_argument("--crf", type=int, default=16)
    a = ap.parse_args()
    src = cv2.imread(a.img)
    W = 3840
    s = W / 1344
    Hs = src.shape[0]
    top = (Hs - 2160) // 2
    src = src[top:top + 2160]
    oy = -top
    H = 2160
    base = grade(src)

    def P4(x, y):
        return x * s, y * s + oy

    # --- screen: cover the AI gibberish text, draw our route + header ---
    quad = np.float32([P4(*p) for p in SCREEN])
    sw, sh = 1400, 1000
    Hm = cv2.getPerspectiveTransform(np.float32([[0, 0], [sw, 0], [sw, sh], [0, sh]]), quad)
    flat = np.clip(cv2.warpPerspective(base, np.linalg.inv(Hm), (sw, sh)), 0, 255).astype(np.uint8)
    cv2.rectangle(flat, (int(0.70 * sw), int(0.03 * sh)), (int(0.99 * sw), int(0.16 * sh)), (4, 4, 6), -1)
    cv2.rectangle(flat, (int(0.03 * sw), int(0.72 * sh)), (int(0.40 * sw), int(0.98 * sh)), (4, 4, 6), -1)
    ist, tyo = np.array([0.555, 0.40]) * [sw, sh], np.array([0.905, 0.355]) * [sw, sh]
    pts = [(ist + (tyo - ist) * t + np.array([0, -0.10 * sh * np.sin(np.pi * t)])).astype(int) for t in np.linspace(0, 1, 50)]
    k = 20
    cv2.polylines(flat, [np.array(pts[k:], np.int32)], False, (170, 170, 170), 3, cv2.LINE_AA)
    cv2.polylines(flat, [np.array(pts[:k + 1], np.int32)], False, (60, 190, 255), 6, cv2.LINE_AA)
    for p in (pts[0], pts[-1]):
        cv2.circle(flat, tuple(int(v) for v in p), 9, (235, 235, 235), -1, cv2.LINE_AA)
    cv2.circle(flat, tuple(int(v) for v in pts[k]), 14, (60, 190, 255), -1, cv2.LINE_AA)
    f = cv2.FONT_HERSHEY_DUPLEX
    cv2.putText(flat, "ISTANBUL  >  TOKYO", (int(0.06 * sw), int(0.12 * sh)), f, 2.0, (215, 225, 235), 3, cv2.LINE_AA)
    cv2.putText(flat, "Time to destination  6h 42m", (int(0.06 * sw), int(0.83 * sh)), f, 1.5, (190, 200, 210), 2, cv2.LINE_AA)
    cv2.putText(flat, "Altitude 11,280 m   |   Local time 02:14", (int(0.06 * sw), int(0.92 * sh)), f, 1.3, (160, 170, 180), 2, cv2.LINE_AA)
    back = cv2.warpPerspective(flat, Hm, (W, H)).astype(np.float32)
    m = np.zeros((H, W), np.float32)
    cv2.fillPoly(m, [quad.astype(np.int32)], 1.0)
    m = cv2.GaussianBlur(m, (0, 0), 2)[..., None]
    base = base * (1 - m) + back * m

    # --- replace the hazy daylight windows with the night-city view (clean C image) ---
    city = cv2.imread("projects/flight/c_clean.png").astype(np.float32)
    for (cx, cy, rx, ry), (sx0, sy0) in zip(WINDOWS[1:3], ((560, 330), (300, 430))):
        X, Y = P4(cx, cy)
        RX, RY = int(rx * s * 1.12), int(ry * s * 1.08)
        crop = city[sy0:sy0 + 240, sx0:sx0 + 150]
        crop = cv2.resize(crop, (2 * RX, 2 * RY), interpolation=cv2.INTER_CUBIC) * 0.85
        em = np.zeros((2 * RY, 2 * RX), np.float32)
        cv2.ellipse(em, (RX, RY), (int(rx * s * 0.98), int(ry * s * 0.97)), 0, 0, 360, 1.0, -1)
        em = cv2.GaussianBlur(em, (0, 0), 5)[..., None]
        ya, xa = int(Y) - RY, int(X) - RX
        reg = base[ya:ya + 2 * RY, xa:xa + 2 * RX]
        base[ya:ya + 2 * RY, xa:xa + 2 * RX] = reg * (1 - em) + (crop + reg * 0.08) * em
    # --- windows: twinkling city lights (point lights only, smooth), periodic ---
    wm = np.zeros((H, W), np.float32)
    for cx, cy, rx, ry in WINDOWS:
        X, Y = P4(cx, cy)
        cv2.ellipse(wm, (int(X), int(Y)), (int(rx * s), int(ry * s)), 0, 0, 360, 1.0, -1)
    wm = cv2.GaussianBlur(wm, (0, 0), 6)
    ys, xs = np.where(wm > 0.01)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    roi = base[y0:y1, x0:x1].copy()
    lum = roi.max(2)
    pointy = np.clip((lum - cv2.GaussianBlur(lum, (0, 0), 6) - 12) / 40, 0, 1)  # small bright points only
    bright = pointy * wm[y0:y1, x0:x1]
    rng = np.random.default_rng(2)
    h, w = roi.shape[:2]
    ph = cv2.GaussianBlur(rng.uniform(0, 2 * np.pi, (h, w)).astype(np.float32), (0, 0), 1.5) * 3
    fr = np.float32(rng.integers(20, 90)) / P + cv2.GaussianBlur(rng.uniform(0, 30, (h, w)).astype(np.float32), (0, 0), 1.5).round() / P
    # whole-cabin breathing (very slight), periodic
    frames = int(a.seconds * FPS)
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-"]
    if a.audio:
        cmd += ["-i", a.audio, "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "192k", "-shortest"]
    cmd += ["-c:v", "libx264", "-preset", "veryfast", "-crf", str(a.crf), "-pix_fmt", "yuv420p", "-movflags", "+faststart", a.out]
    enc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for fi in range(frames):
        t = fi / FPS
        frame = base.copy()
        tw = 1 + 0.35 * np.sin(2 * np.pi * fr * t + ph) * bright
        frame[y0:y1, x0:x1] = roi * tw[..., None]
        img = np.clip(frame, 0, 255).astype(np.uint8)
        if a.still and fi == 0:
            cv2.imwrite(a.still, img)
        enc.stdin.write(img.tobytes())
        if fi % 300 == 0:
            print(f"frame {fi}/{frames}", flush=True)
    enc.stdin.close()
    enc.wait()
    print("done", a.out)


if __name__ == "__main__":
    main()
