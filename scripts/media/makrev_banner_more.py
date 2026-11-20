import cv2, numpy as np, runpy
g = runpy.run_path('/tmp/claude-0/-home-user-Yt/c0ed126b-6344-535b-9708-226fcfc689ac/scratchpad/makrev_base.py')
render, tr, fin, s1, w1, bx0, bx1, by0, by1, TW, TH, VIS, D = [g[k] for k in ('render','tr','fin','s1','w1','bx0','bx1','by0','by1','TW','TH','VIS','D')]
NAVY = np.float32([72, 50, 37]); RED = np.float32([63, 32, 232])
xs = np.arange(TW, dtype=np.float32)[None, :, None]; yy = np.arange(TH, dtype=np.float32)[:, None, None]
out = {}

def object_mask(img):
    """machines are neutral grey/white/black, the floor is warm beige (R > B) -> chroma test"""
    b, gch, r = img[..., 0], img[..., 1], img[..., 2]
    chroma = r - b
    lum = img.mean(2)
    m = ((chroma < 9) | (lum > 215) | (lum < 70)).astype(np.float32)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    return cv2.GaussianBlur(m, (0, 0), 0.8)[..., None]

def blueprint(img, bgcol):
    gray = cv2.cvtColor(np.clip(img, 0, 255).astype(np.uint8), cv2.COLOR_BGR2GRAY)
    e = cv2.Canny(gray, 30, 90).astype(np.float32) / 255
    e = np.maximum(e, cv2.GaussianBlur(e, (0, 0), 1.2) * 0.8)
    bp = np.zeros_like(img) + bgcol
    # grid
    grid = np.zeros(img.shape[:2], np.float32)
    grid[:, ::40] = 0.18; grid[::40, :] = 0.18
    bp += grid[..., None] * 255 * np.float32([1, 0.9, 0.8]) * 0.4
    bp = bp * (1 - e[..., None]) + np.float32([250, 235, 215]) * e[..., None]
    return bp

# kurgu11: design -> reality: the full line twice, left as blueprint, right as the real render
ww = w1 * 0.98
left = render(s1 * 0.98, TW * 0.25 - s1 * 0.98 * (bx0 + bx1) / 2 + 20, 5 - s1 * 0.98 * by0)
right = render(s1 * 0.98, TW * 0.75 - s1 * 0.98 * (bx0 + bx1) / 2 - 20, 5 - s1 * 0.98 * by0)
bp = blueprint(left, np.float32([110, 60, 25]))
a = np.clip((xs - TW / 2) / 60 + 0.5, 0, 1)
img = bp * (1 - a) + right * a
out['kurgu11'] = fin(img)

# kurgu12: one full line, a diagonal sweep turns the blueprint into the real machine
full = render(s1 * 1.05, TW / 2 - s1 * 1.05 * (bx0 + bx1) / 2, 3 - s1 * 1.05 * by0)
bp = blueprint(full, np.float32([110, 60, 25]))
edge = TW * 0.52 - 0.45 * (yy - TH / 2)
a = np.clip((xs - edge) / 40 + 0.5, 0, 1)
img = bp * (1 - a) + full * a
glow = np.exp(-((xs - edge) / 6) ** 2)
img = img + glow * np.float32([255, 230, 200]) * 0.6
out['kurgu12'] = fin(img)

# kurgu13: dark showroom — charcoal background, line cut out, soft spotlights + reflection-free floor glow
full = render(s1 * 1.05, TW / 2 - s1 * 1.05 * (bx0 + bx1) / 2, 3 - s1 * 1.05 * by0)
m = object_mask(full)
bg = np.zeros_like(full) + np.float32([30, 26, 24])
d2 = ((xs - TW / 2) / (w1 * 0.75)) ** 2 + ((yy - 230) / 200) ** 2
bg += np.clip(1 - d2, 0, 1)[..., None] * np.float32([60, 58, 60]) if False else (np.clip(1 - d2, 0, 1) * 70)
shadow = cv2.GaussianBlur(m[..., 0], (0, 0), 14)[..., None]
bg *= 1 - 0.6 * shadow
img = bg * (1 - m) + full * 1.05 * m
rim = np.clip(m - cv2.GaussianBlur(m, (0, 0), 2)[..., None], 0, 1)
img += rim * 60
stripe = np.clip(1 - np.abs(yy - 360) / 2.5, 0, 1) * np.clip(1 - np.abs(xs - TW / 2) / (w1 * 0.6), 0, 1)
img = img * (1 - stripe) + RED * stripe
out['kurgu13'] = fin(img)

# kurgu14: clean white studio — pure white background fading to light grey, line cut out with soft contact shadow
m = object_mask(full)
bg = np.zeros_like(full) + 250 - (yy / TH) * 18
shadow = cv2.GaussianBlur(np.roll(m[..., 0], 8, 0), (0, 0), 10)[..., None]
bg *= 1 - 0.35 * shadow
img = bg * (1 - m) + full * m
band = np.clip((xs - (TW - 260)) / 260, 0, 1) * 0 + 0
lines = np.zeros_like(img)
for k in range(3):
    x0 = 120 + k * 22
    lines += (np.clip(1 - np.abs(xs - x0 - 0.35 * yy) / 3, 0, 1)) * (RED if k == 0 else NAVY) / 255
img = img * (1 - np.clip(lines.max(2, keepdims=True) / 1, 0, 1)) + lines * 255
img2 = img.copy()
for k in range(3):
    x0 = TW - 180 - k * 22
    l = np.clip(1 - np.abs(xs - x0 + 0.35 * (yy - TH)) / 3, 0, 1)
    img2 = img2 * (1 - l) + (RED if k == 0 else NAVY) * l
out['kurgu14'] = fin(img2)

sheet = []
for n, v in out.items():
    cv2.imwrite(D + f'makrev-banner-2016x430-{n}.png', v)
    c_ = v.copy(); cv2.line(c_, (0, 366), (TW, 366), (0, 255, 255), 2); cv2.putText(c_, n, (20, 420), 0, 1.0, (0, 0, 200), 2)
    sheet += [c_, np.zeros((16, TW, 3), np.uint8)]
cv2.imwrite(D + 'chk_k4.jpg', np.vstack(sheet))
import cv2, numpy as np, runpy
g = runpy.run_path('/tmp/claude-0/-home-user-Yt/c0ed126b-6344-535b-9708-226fcfc689ac/scratchpad/makrev_base.py')
render, fin, s1, w1, bx0, bx1, by0, TW, TH, D = [g[k] for k in ('render','fin','s1','w1','bx0','bx1','by0','TW','TH','D')]
NAVY = np.float32([72, 50, 37]); RED = np.float32([63, 32, 232])
xs = np.arange(TW, dtype=np.float32)[None, :, None]; yy = np.arange(TH, dtype=np.float32)[:, None, None]
full = render(s1 * 1.05, TW / 2 - s1 * 1.05 * (bx0 + bx1) / 2, 3 - s1 * 1.05 * by0)
floor = np.median(full[:, :300].reshape(-1, 3), 0)  # beige floor colour (left margin)
norm = np.clip(full / floor, 0, 1.4)               # floor -> 1.0, shadows < 1, machines keep shading
# white studio: floor becomes white-grey gradient, shadows and red letters preserved
bgw = 252 - (yy / TH) * 16
white = np.clip(norm * bgw, 0, 255)
for k in range(3):
    l1 = np.clip(1 - np.abs(xs - (120 + k * 22) - 0.35 * yy) / 3, 0, 1)
    l2 = np.clip(1 - np.abs(xs - (TW - 180 - k * 22) + 0.35 * (yy - TH)) / 3, 0, 1)
    col = RED if k == 0 else NAVY
    white = white * (1 - l1) + col * l1
    white = white * (1 - l2) + col * l2
cv2.imwrite(D + 'makrev-banner-2016x430-kurgu13.png', fin(white))
# dark showroom: floor -> charcoal with a soft spotlight; machines lifted via screen of the normalised image
d2 = ((xs - TW / 2) / (w1 * 0.75)) ** 2 + ((yy - 230) / 210) ** 2
bgd = 28 + np.clip(1 - d2, 0, 1) * 60
lum = norm.mean(2, keepdims=True)
obj = np.clip((np.abs(norm - 1).max(2, keepdims=True) - 0.05) / 0.1, 0, 1)  # differs from floor
dark = bgd * np.minimum(norm, 1.0) * (1 - obj) + full * 1.02 * obj
cv2.imwrite(D + 'makrev-banner-2016x430-kurgu14.png', fin(dark))
sheet = []
for n in ('kurgu13', 'kurgu14'):
    c_ = cv2.imread(D + f'makrev-banner-2016x430-{n}.png'); cv2.line(c_, (0, 366), (TW, 366), (0, 255, 255), 2)
    sheet += [c_, np.zeros((16, TW, 3), np.uint8)]
cv2.imwrite(D + 'chk_k5.jpg', np.vstack(sheet))
import cv2, numpy as np, runpy
g = runpy.run_path('/tmp/claude-0/-home-user-Yt/c0ed126b-6344-535b-9708-226fcfc689ac/scratchpad/makrev_base.py')
render, tr, fin, s1, w1, bx0, bx1, by0, by1, TW, TH, VIS, D = [g[k] for k in ('render','tr','fin','s1','w1','bx0','bx1','by0','by1','TW','TH','VIS','D')]
xs = np.arange(TW, dtype=np.float32)[None, :, None]
out = {}
# A: two identical lines side by side (a factory hall with two production lines)
s = (VIS - 10) / (by1 - by0)
wl = (bx1 - bx0) * s
gap = (TW - 2 * wl) / 3
L = render(s, gap - s * bx0, 5 - s * by0)
R = render(s, 2 * gap + wl - s * bx0, 5 - s * by0)
a = np.clip((xs - (gap + wl + gap / 2)) / 80 + 0.5, 0, 1)
out['iki-hat'] = fin(L * (1 - a) + R * a)
# B: same but the second line slightly behind (smaller, higher) -> depth, still original look
s2 = s * 0.82
R2 = render(s2, TW - gap * 0.8 - wl * 0.82 - s2 * bx0, 2 - s2 * by0)
L2 = render(s, gap * 0.8 - s * bx0, 5 - s * by0)
a = np.clip((xs - (gap * 0.8 + wl + 30)) / 80 + 0.5, 0, 1)
out['iki-hat-derinlik'] = fin(L2 * (1 - a) + R2 * a)
sheet = []
for n, v in out.items():
    cv2.imwrite(D + f'makrev-banner-2016x430-{n}.png', v)
    c_ = v.copy(); cv2.line(c_, (0, 366), (TW, 366), (0, 255, 255), 2); cv2.putText(c_, n, (20, 420), 0, 1.0, (0, 0, 200), 2)
    sheet += [c_, np.zeros((16, TW, 3), np.uint8)]
cv2.imwrite(D + 'chk_k7.jpg', np.vstack(sheet))
