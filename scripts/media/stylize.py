#!/usr/bin/env python3
"""Turn a source image into original line-art illustrations (3 styles).

  /root/.venvs/img/bin/python -I scripts/media/stylize.py <in.jpg> <out_dir>

Styles
  A  "ink + flat colour": edge-preserving smoothing, colour quantisation (k-means), XDoG ink lines
  B  "clean line art": XDoG ink lines only, on warm paper
  C  "soft storybook": heavier abstraction (mean-shift), fewer colours, thin sepia lines, paper grain
"""
import os
import sys

import cv2
import numpy as np


def xdog(gray, sigma=0.9, k=1.6, p=19.0, eps=0.012, phi=60.0):
    g1 = cv2.GaussianBlur(gray, (0, 0), sigma)
    g2 = cv2.GaussianBlur(gray, (0, 0), sigma * k)
    d = (1 + p) * g1 - p * g2
    e = np.where(d >= eps, 1.0, 1.0 + np.tanh(phi * (d - eps)))
    return np.clip(e, 0, 1)


def quantize(img, k, seed=1):
    z = img.reshape(-1, 3).astype(np.float32)
    rng = np.random.default_rng(seed)
    sample = z[rng.choice(len(z), size=min(60000, len(z)), replace=False)]
    crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.5)
    _, _, centers = cv2.kmeans(sample, k, None, crit, 3, cv2.KMEANS_PP_CENTERS)
    d = ((z[:, None, :] - centers[None, :, :]) ** 2).sum(-1)
    return centers[d.argmin(1)].reshape(img.shape).astype(np.uint8)


def paper(h, w, tone=(236, 226, 206), seed=2):
    rng = np.random.default_rng(seed)
    n = cv2.GaussianBlur(rng.standard_normal((h, w)).astype(np.float32), (0, 0), 1.2) * 6
    base = np.ones((h, w, 3), np.float32) * np.array(tone[::-1], np.float32)
    return np.clip(base + n[..., None], 0, 255)


def main():
    src, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    img = cv2.imread(src)
    h, w = img.shape[:2]
    scale = 1920 / w
    img = cv2.resize(img, (1920, int(h * scale)), interpolation=cv2.INTER_AREA)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255

    # A — ink + flat colour
    smooth = img
    for _ in range(3):
        smooth = cv2.bilateralFilter(smooth, 9, 60, 9)
    flat = quantize(smooth, 14)
    flat = cv2.medianBlur(flat, 5)
    lines = xdog(cv2.GaussianBlur(gray, (0, 0), 0.6), sigma=1.0, p=22, eps=0.015)
    lines = cv2.morphologyEx((lines * 255).astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8)).astype(np.float32) / 255
    a = flat.astype(np.float32) * (0.25 + 0.75 * lines[..., None])
    cv2.imwrite(os.path.join(out, "A_ink_flat.jpg"), np.clip(a, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 94])

    # B — clean line art on paper
    l2 = xdog(cv2.GaussianBlur(gray, (0, 0), 0.8), sigma=1.1, p=26, eps=0.02, phi=80)
    pap = paper(*l2.shape)
    ink = np.array([40, 34, 30], np.float32)  # BGR dark warm ink
    b = pap * l2[..., None] + ink * (1 - l2[..., None])
    cv2.imwrite(os.path.join(out, "B_line_art.jpg"), np.clip(b, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 94])

    # C — soft storybook
    ms = cv2.pyrMeanShiftFiltering(img, 14, 36, maxLevel=2)
    soft = quantize(ms, 9, seed=3)
    soft = cv2.GaussianBlur(soft, (0, 0), 1.2)
    l3 = xdog(cv2.GaussianBlur(gray, (0, 0), 1.4), sigma=1.4, p=18, eps=0.02)
    sepia = np.array([60, 80, 110], np.float32)
    c = soft.astype(np.float32) * l3[..., None] + sepia * (1 - l3[..., None]) * 0.9 + soft.astype(np.float32) * (1 - l3[..., None]) * 0.1
    grain = paper(*l3.shape, tone=(128, 128, 128)) - 128
    c = c * 0.92 + paper(*l3.shape) * 0.08 + grain * 0.6
    cv2.imwrite(os.path.join(out, "C_storybook.jpg"), np.clip(c, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 94])
    print("ok", img.shape)


if __name__ == "__main__":
    main()
