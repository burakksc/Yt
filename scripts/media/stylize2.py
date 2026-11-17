#!/usr/bin/env python3
"""Line-art illustration styles v2 (OpenCV NPR filters).
  /root/.venvs/img/bin/python -I scripts/media/stylize2.py <in.jpg> <out_dir>
A ink illustration: cv2.stylization (smooth painterly fills) + adaptive-threshold ink lines
B colour pencil:   cv2.pencilSketch colour output, warmed
C graphic novel:   bilateral + 24-colour quantisation, dark ink lines, slight warm grade
"""
import os, sys
import cv2
import numpy as np

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
img = cv2.imread(src)
img = cv2.resize(img, (1920, int(img.shape[0] * 1920 / img.shape[1])), interpolation=cv2.INTER_AREA)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

def ink(gray, block=9, c=4, blur=5):
    g = cv2.medianBlur(gray, blur)
    e = cv2.adaptiveThreshold(g, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, block, c)
    e = cv2.morphologyEx(e, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
    return cv2.GaussianBlur(e, (3, 3), 0).astype(np.float32) / 255

st = cv2.stylization(img, sigma_s=80, sigma_r=0.35)
a = st.astype(np.float32) * (0.2 + 0.8 * ink(gray, 11, 5)[..., None])
cv2.imwrite(os.path.join(out, "A_ink_illustration.jpg"), np.clip(a, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 94])

_, col = cv2.pencilSketch(img, sigma_s=60, sigma_r=0.07, shade_factor=0.04)
warm = cv2.addWeighted(col, 0.85, st, 0.15, 0)
cv2.imwrite(os.path.join(out, "B_colour_pencil.jpg"), warm, [cv2.IMWRITE_JPEG_QUALITY, 94])

sm = img
for _ in range(4):
    sm = cv2.bilateralFilter(sm, 9, 50, 9)
z = sm.reshape(-1, 3).astype(np.float32)
crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
rng = np.random.default_rng(1)
_, _, centers = cv2.kmeans(z[rng.choice(len(z), 50000, replace=False)], 24, None, crit, 2, cv2.KMEANS_PP_CENTERS)
q = centers[((z[:, None] - centers[None]) ** 2).sum(-1).argmin(1)].reshape(sm.shape)
q = cv2.GaussianBlur(q.astype(np.uint8), (0, 0), 0.8).astype(np.float32)
c = q * (0.15 + 0.85 * ink(gray, 9, 4, 3)[..., None])
c = c * np.array([0.95, 1.0, 1.05], np.float32)
cv2.imwrite(os.path.join(out, "C_graphic_novel.jpg"), np.clip(c, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 94])
print("ok")
