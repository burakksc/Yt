#!/usr/bin/env python3
"""Night-flight window-seat sleep video compositor (4K): Blender cabin plate (RGBA, sky transparent)
+ our own in-flight map on the seat screen + an animated outside view (stars, milky way, moonlit cloud
deck drifting past, faint anti-collision strobe on the engine). All motion periodic in 60 s.

  /root/.venvs/img/bin/python -I scripts/ambience/flight_composite.py --cabin projects/flight/cabin4k.png \
      --seconds 40 --out x.mp4 [--audio a.m4a --still frame.png]
"""
import argparse
import subprocess

import cv2
import numpy as np

FPS = 30
P = 60.0


def tile_noise(h, w, octaves, seed, base=4):
    """Fractal noise that tiles horizontally (integer x-frequencies), values ~0..1."""
    rng = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        f = base * 2 ** o
        gh, gw = max(2, int(f * h / w) + 2), f
        g = rng.standard_normal((gh, gw)).astype(np.float32)
        g = np.concatenate([g, g[:, :1]], 1)  # wrap for tiling
        up = cv2.resize(g, (w + w // gw, h), interpolation=cv2.INTER_CUBIC)[:, :w]
        out += amp * up
        tot += amp
        amp *= 0.5
    out /= tot
    return (out - out.min()) / (out.max() - out.min() + 1e-9)


def periodic_field(n, sigma, seed):
    """n x n noise, periodic in both axes (FFT low-pass), 0..1"""
    rng = np.random.default_rng(seed)
    F = np.fft.fft2(rng.standard_normal((n, n)))
    k = np.fft.fftfreq(n)
    K2 = k[:, None] ** 2 + k[None, :] ** 2
    f = np.real(np.fft.ifft2(F * np.exp(-K2 * (n / sigma) ** 2 / 2)))
    return ((f - f.min()) / (f.max() - f.min())).astype(np.float32)


def city_map(n=4096, seed=7):
    """Top-down night city lights, tileable in x and y: street grid dots, arterials, dark parks/river."""
    rng = np.random.default_rng(seed)
    dens = periodic_field(n, 6, seed) * 0.7 + periodic_field(n, 20, seed + 1) * 0.3
    dens = np.clip((dens - 0.38) * 2.4, 0, 1)
    river = np.abs(periodic_field(n, 3, seed + 2) - 0.5) < 0.012
    dens[river] = 0
    m = np.zeros((n, n, 3), np.float32)
    sod, wht = np.array([40, 150, 255], np.float32), np.array([215, 225, 245], np.float32)
    sp = 22
    for axis in (0, 1):
        for line in range(0, n, sp):
            jit = (line * 7919) % 5 - 2
            idx = np.arange(0, n, 5)
            keep = rng.random(len(idx)) < dens[(line + jit) % n, idx] if axis == 0 else rng.random(len(idx)) < dens[idx, (line + jit) % n]
            col = np.where(rng.random(len(idx))[:, None] < 0.72, sod, wht) * rng.uniform(0.5, 1.0, (len(idx), 1))
            if axis == 0:
                m[(line + jit) % n, idx[keep]] = col[keep]
            else:
                m[idx[keep], (line + jit) % n] = col[keep]
    for i in range(5):  # arterial roads / highways: continuous brighter orange lines, periodic
        y0 = rng.integers(0, n)
        sl = rng.choice([0, 0.5, -0.5, 0.25])
        xs = np.arange(n)
        ys = (y0 + sl * xs).astype(int) % n
        m[ys, xs] = np.maximum(m[ys, xs], sod * 0.6 * dens[ys, xs][:, None])
    glow = cv2.GaussianBlur(m, (0, 0), 6)
    m = cv2.GaussianBlur(m, (0, 0), 1.0) * 3.0 + glow * 6.0
    return np.clip(m, 0, 255)


def screen_map(w, h):
    """Our own flight map (NASA Blue Marble, public domain) Istanbul -> Tokyo."""
    world = cv2.imread("video/public/rusya-gizli/img/world.jpg")  # 3840x1920 equirectangular
    ppd = 3840 / 360
    lon0, lon1, lat0, lat1 = 20, 150, 62, 20
    crop = world[int((90 - lat0) * ppd):int((90 - lat1) * ppd), int((lon0 + 180) * ppd):int((lon1 + 180) * ppd)]
    m = cv2.resize(crop, (w, h), interpolation=cv2.INTER_AREA).astype(np.float32) * 0.55
    m = (m * np.array([1.15, 0.95, 0.8])).clip(0, 255)  # night tint

    def xy(lat, lon):
        return int((lon - lon0) / (lon1 - lon0) * w), int((lat0 - lat) / (lat0 - lat1) * h)

    a, b = (41.0, 28.98), (35.68, 139.69)  # Istanbul, Tokyo
    pts = []
    for t in np.linspace(0, 1, 60):  # simple bowed arc (great-circle look)
        lat = a[0] + (b[0] - a[0]) * t + 9 * np.sin(np.pi * t)
        lon = a[1] + (b[1] - a[1]) * t
        pts.append(xy(lat, lon))
    img = m.astype(np.uint8)
    k = 24  # progress: ~40 % of the way (over Central Asia)
    cv2.polylines(img, [np.array(pts[k:], np.int32)], False, (200, 200, 200), max(1, w // 400), cv2.LINE_AA)
    cv2.polylines(img, [np.array(pts[:k + 1], np.int32)], False, (80, 200, 255), max(2, w // 260), cv2.LINE_AA)
    for p in (pts[0], pts[-1]):
        cv2.circle(img, p, max(3, w // 160), (255, 255, 255), -1, cv2.LINE_AA)
    px, py = pts[k]
    cv2.circle(img, (px, py), max(5, w // 90), (80, 200, 255), -1, cv2.LINE_AA)
    f = cv2.FONT_HERSHEY_SIMPLEX
    s = w / 900
    cv2.putText(img, "Istanbul", (pts[0][0] - int(60 * s), pts[0][1] + int(40 * s)), f, 0.9 * s, (230, 230, 230), max(1, int(2 * s)), cv2.LINE_AA)
    cv2.putText(img, "Tokyo", (pts[-1][0] - int(110 * s), pts[-1][1] + int(40 * s)), f, 0.9 * s, (230, 230, 230), max(1, int(2 * s)), cv2.LINE_AA)
    cv2.rectangle(img, (0, 0), (w, int(70 * s)), (20, 14, 10), -1)
    cv2.putText(img, "Istanbul  >  Tokyo     |     Over Central Asia     |     Local time 02:14", (int(20 * s), int(46 * s)), f, 0.8 * s,
                (210, 220, 230), max(1, int(2 * s)), cv2.LINE_AA)
    return img


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cabin", required=True)
    ap.add_argument("--seconds", type=float, default=40)
    ap.add_argument("--out", required=True)
    ap.add_argument("--audio")
    ap.add_argument("--still")
    ap.add_argument("--crf", type=int, default=16)
    ap.add_argument("--ground", default="city", choices=["city", "clouds"])
    a = ap.parse_args()
    cab = cv2.imread(a.cabin, cv2.IMREAD_UNCHANGED).astype(np.float32)
    H, W = cab.shape[:2]
    rgb, alpha = cab[..., :3], cab[..., 3:] / 255
    # window opening = clearly transparent pixels only (denoiser leaves alpha ~0.9 halos on the bezel)
    tr = (alpha[..., 0] < 0.5).astype(np.uint8)
    k = int(0.04 * W) | 1
    win_open = cv2.morphologyEx(tr, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    rgb[(tr > 0) & (win_open == 0)] = (11, 11, 12)  # stray see-through slivers in the wall -> dark plastic
    alpha = 1 - cv2.GaussianBlur(win_open.astype(np.float32), (0, 0), 1.2)[..., None]
    # --- in-flight map warped onto the seat screen ---
    sm = cv2.imread(a.cabin.replace(".png", "_screenmask.png"), 0)
    _, b = cv2.threshold(sm, 128, 255, 0)
    cs, _ = cv2.findContours(b, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    c = max(cs, key=cv2.contourArea)
    quad = cv2.approxPolyDP(c, 0.02 * cv2.arcLength(c, True), True).reshape(-1, 2).astype(np.float32)
    if len(quad) == 4:
        s = quad.sum(1)
        d = np.diff(quad, axis=1).ravel()
        tl, br, tr, bl = quad[np.argmin(s)], quad[np.argmax(s)], quad[np.argmin(d)], quad[np.argmax(d)]
        mw, mh = 1200, 740
        mp = screen_map(mw, mh).astype(np.float32)
        Hm = cv2.getPerspectiveTransform(np.float32([[0, 0], [mw, 0], [mw, mh], [0, mh]]), np.float32([tl, tr, br, bl]))
        warped = cv2.warpPerspective(mp, Hm, (W, H))
        mk = cv2.GaussianBlur((b > 0).astype(np.float32), (0, 0), 1.0)[..., None]
        rgb = rgb * (1 - mk) + warped * 0.85 * mk
        # soft glow of the screen on the surroundings
        glow = cv2.GaussianBlur(warped * mk, (0, 0), 60) * 0.25
        rgb = rgb + glow
    # --- outside: only the window region needs per-frame work ---
    ys, xs = np.where(alpha[..., 0] < 0.99)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    h, w = y1 - y0, x1 - x0
    hor = int(0.42 * h)  # horizon inside the window bbox
    yy = np.arange(h, dtype=np.float32)[:, None]
    sky = np.zeros((h, w, 3), np.float32)
    top, mid = np.array([18, 8, 4], np.float32), np.array([60, 32, 20], np.float32)  # BGR: deep navy -> faint horizon glow
    tsky = np.clip(yy / max(hor, 1), 0, 1)[..., None]
    sky[:] = top * (1 - tsky) + mid * tsky
    rng = np.random.default_rng(3)
    n_st = int(w * hor / 900)
    st_x, st_y = rng.uniform(0, w, n_st), rng.uniform(0, hor * 0.95, n_st)
    st_b, st_f, st_p = rng.uniform(60, 255, n_st) ** 1.0, rng.integers(1, 6, n_st) / P, rng.uniform(0, 6.28, n_st)
    milky = tile_noise(h, w, 5, 9, base=3)
    band = np.exp(-((np.arange(w)[None, :] - 0.35 * w - (yy - 0.2 * h) * 0.6) / (0.18 * w)) ** 2)
    sky += (milky ** 2 * band * (yy < hor))[..., None] * np.array([40, 34, 30], np.float32)
    # city lights below (perspective ground plane, tileable map scrolled one tile per 60 s)
    city = city_map() if a.ground == "city" else None
    if city is not None:
        N = city.shape[0]
        city_small = cv2.GaussianBlur(city, (0, 0), 2.5)  # pre-filter for far rows (less shimmer)
        SS = 2  # supersample the ground
        rr = (np.arange((h - hor) * SS, dtype=np.float32) / SS + 1.5)[:, None]  # rows below the horizon
        xx = (np.arange(w * SS, dtype=np.float32) / SS - w / 2)[None, :]
        HC, FOC = 2600.0, 1900.0 * w / 740  # camera altitude (map px), focal (px)
        gx0 = xx * HC / rr / 2.0
        gy = np.broadcast_to(FOC * HC / rr / 2.0, gx0.shape)
        mapy = np.mod(gy, N).astype(np.float32)
        far = np.clip(1 - rr / (0.12 * (h - hor)), 0, 1)  # use the blurred map near the horizon
        haze = np.clip(rr / SS / (0.10 * h), 0, 1) ** 0.8
        dome = (np.exp(-np.arange(h - hor, dtype=np.float32) / (0.05 * h))[:, None, None] * np.array([20, 45, 80], np.float32))  # warm city glow at the horizon
        sky += np.concatenate([np.exp(-(hor - np.arange(hor, dtype=np.float32)) / (0.05 * h))[:, None, None] * np.array([12, 28, 50], np.float32), np.zeros((h - hor, 1, 3), np.float32)])
    # cloud deck tile (twice the window width, tiles horizontally), moonlit tops
    cw = 2 * w
    cl = tile_noise(h - hor, cw, 6, 4, base=6)
    cl2 = tile_noise(h - hor, cw, 4, 5, base=3)
    dens = np.clip((0.6 * cl + 0.4 * cl2 - 0.42) * 2.6, 0, 1) ** 1.3
    persp = np.linspace(0.35, 1.0, h - hor, dtype=np.float32)[:, None]
    cloud_rgb = (dens * persp)[..., None] * np.array([62, 60, 58], np.float32) + 3
    fade = np.clip((np.arange(h - hor) / (0.06 * h)), 0, 1)[:, None, None]  # haze into the horizon
    frames = int(a.seconds * FPS)
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-"]
    if a.audio:
        cmd += ["-i", a.audio, "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "192k", "-shortest"]
    cmd += ["-c:v", "libx264", "-preset", "veryfast", "-crf", str(a.crf), "-pix_fmt", "yuv420p", "-movflags", "+faststart", a.out]
    enc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    base = rgb.copy()
    win_a = alpha[y0:y1, x0:x1]
    # pixels of the engine = opaque pixels inside the window opening's convex hull
    cs2, _ = cv2.findContours(win_open, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    hull = np.zeros((H, W), np.uint8)
    cv2.fillPoly(hull, [cv2.convexHull(max(cs2, key=cv2.contourArea))], 1)
    eng_mask = cv2.GaussianBlur(((hull > 0) & (win_open == 0)).astype(np.float32), (0, 0), 2)[y0:y1, x0:x1, None]
    star_layer = np.zeros((h, w), np.float32)
    for fi in range(frames):
        t = fi / FPS
        out = sky.copy()
        star_layer[:] = 0
        tw = 0.75 + 0.25 * np.sin(2 * np.pi * st_f * t + st_p)
        for x, y, bb, k in zip(st_x.astype(int), st_y.astype(int), st_b, tw):
            star_layer[y, x] = bb * k
        out += cv2.GaussianBlur(star_layer, (0, 0), 1.1)[..., None] * 2.2
        if city is not None:
            mapx = np.mod(gx0 + (t / P) * N, N).astype(np.float32)  # one tile per 60 s
            near = cv2.remap(city, mapx, mapy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)
            farc = cv2.remap(city_small, mapx, mapy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)
            g = near * (1 - far[..., None]) + farc * far[..., None]
            g = cv2.resize(g, (w, h - hor), interpolation=cv2.INTER_AREA)
            lower = out[hor:]
            hz = haze[::SS][: h - hor, :1, None]
            out[hor:] = lower * 0.15 + g * (0.5 + 1.9 * hz) + dome
        else:
            off = int(round((t / P) * cw)) % cw  # one full tile per 60 s, moving left (we fly forward = right)
            sl = np.roll(cloud_rgb, -off, axis=1)[:, :w]
            lower = out[hor:]
            out[hor:] = lower * (1 - fade) + (lower * 0.3 + sl) * fade
        # anti-collision strobe: two quick white flashes every 1.5 s, lights the lower window (engine area)
        ph = (t % 1.5)
        flash = 1.0 if ph < 0.05 or 0.12 < ph < 0.17 else 0.0
        frame = base.copy()
        win = frame[y0:y1, x0:x1]
        win[:] = win * win_a + out * (1 - win_a)
        if flash:
            g = np.exp(-((np.arange(h)[:, None] - h) ** 2) / (2 * (0.35 * h) ** 2))
            win += g[..., None] * 22 * eng_mask  # faint strobe light on the engine
        img = np.clip(frame, 0, 255).astype(np.uint8)
        if a.still and fi == 0:
            cv2.imwrite(a.still, img)
        enc.stdin.write(img.tobytes())
        if fi % 150 == 0:
            print(f"frame {fi}/{frames}", flush=True)
    enc.stdin.close()
    enc.wait()
    print("done", a.out)


if __name__ == "__main__":
    main()
