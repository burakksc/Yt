#!/usr/bin/env python3
"""Cut a single character out of a plain studio background (GrabCut seeded by a centre rect).
  /root/.venvs/img/bin/python -I scripts/media/cutout.py in.png out.png"""
import sys

import cv2
import numpy as np

src, out = sys.argv[1], sys.argv[2]
img = cv2.imread(src)
h, w = img.shape[:2]
bg, fg = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
if "--tight" in sys.argv:
    # grey studio backdrops: low-saturation bright pixels start as probable background,
    # image border is certain background; enclosed holes (white shirt) are filled afterwards
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    mask = np.full((h, w), cv2.GC_PR_FGD, np.uint8)
    mask[(hsv[..., 1] < 28) & (hsv[..., 2] > 140)] = cv2.GC_PR_BGD
    b = max(4, int(w * 0.03))
    mask[:b], mask[-b:], mask[:, :b], mask[:, -b:] = cv2.GC_BGD, cv2.GC_BGD, cv2.GC_BGD, cv2.GC_BGD
    cv2.grabCut(img, mask, None, bg, fg, 8, cv2.GC_INIT_WITH_MASK)
else:
    mask = np.zeros((h, w), np.uint8)
    rect = (int(w * 0.04), int(h * 0.01), int(w * 0.92), int(h * 0.98))
    cv2.grabCut(img, mask, rect, bg, fg, 8, cv2.GC_INIT_WITH_RECT)
alpha = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
# keep the biggest blob (the character), fill holes, soften the edge
n, lab, stats, _ = cv2.connectedComponentsWithStats(alpha)
if n > 1:
    big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    alpha = np.where(lab == big, 255, 0).astype(np.uint8)
alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
# fill enclosed holes
ff = alpha.copy()
cv2.floodFill(ff, np.zeros((h + 2, w + 2), np.uint8), (0, 0), 255)
alpha = alpha | cv2.bitwise_not(ff)
alpha = cv2.GaussianBlur(alpha, (0, 0), 1.2)
ys, xs = np.where(alpha > 10)
y0, y1, x0, x1 = max(0, ys.min() - 4), min(h, ys.max() + 4), max(0, xs.min() - 4), min(w, xs.max() + 4)
rgba = np.dstack([img, alpha])[y0:y1, x0:x1]
cv2.imwrite(out, rgba)
print(out, rgba.shape)
