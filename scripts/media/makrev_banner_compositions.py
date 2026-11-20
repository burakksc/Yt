import cv2, numpy as np
D = '/tmp/claude-0/-home-user-Yt/c0ed126b-6344-535b-9708-226fcfc689ac/scratchpad/makrev/'
src = cv2.imread(D + 'nohopper.jpg').astype(np.float32)
P = 3000
pad = cv2.copyMakeBorder(src, P, P, P, P, cv2.BORDER_REPLICATE)
sm = cv2.GaussianBlur(cv2.resize(pad, None, fx=0.1, fy=0.1, interpolation=cv2.INTER_AREA), (0, 0), 40)
blur = cv2.resize(sm, (pad.shape[1], pad.shape[0]), interpolation=cv2.INTER_CUBIC)
ins = np.zeros((pad.shape[0] // 10, pad.shape[1] // 10), np.float32)
ins[P // 10:-P // 10, P // 10:-P // 10] = 1
w = np.clip((cv2.GaussianBlur(ins, (0, 0), 30) - 0.5) * 2, 0, 1)
w = cv2.resize(w, (pad.shape[1], pad.shape[0]))[..., None]
ext = pad * w + blur * (1 - w)
TW, TH, VIS = 2016, 430, 366
M = cv2.getRotationMatrix2D((2500 + P, 1500 + P), 12, 1.0)
M3 = np.vstack([M, [0, 0, 1]])


def render(s, tx, ty, W=TW, H=TH, K=2):
    S = np.float32([[K * s, 0, K * tx], [0, K * s, K * ty], [0, 0, 1]])
    o = cv2.warpAffine(ext, (S @ M3)[:2], (K * W, K * H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE)
    return cv2.resize(o, (W, H), interpolation=cv2.INTER_AREA)


def tr(p):
    return cv2.transform((np.float32(p) * 4 + P)[None], M)[0]


pts = tr([[245, 88], [400, 80], [1195, 505], [1185, 585], [680, 630], [185, 395], [125, 155], [205, 150]])
bx0, by0 = pts.min(0)
bx1, by1 = pts.max(0)
s1 = (VIS - 10) / (by1 - by0)
w1 = (bx1 - bx0) * s1


def fin(o):
    o = cv2.addWeighted(o, 1.5, cv2.GaussianBlur(o, (0, 0), 1.0), -0.5, 0)
    return np.clip(o + np.random.default_rng(1).normal(0, 0.6, o.shape), 0, 255).astype(np.uint8)


def rmask(w_, h_, r):
    m = np.zeros((h_, w_), np.uint8)
    cv2.rectangle(m, (r, 0), (w_ - r, h_), 255, -1)
    cv2.rectangle(m, (0, r), (w_, h_ - r), 255, -1)
    for cx, cy in ((r, r), (w_ - r, r), (r, h_ - r), (w_ - r, h_ - r)):
        cv2.circle(m, (cx, cy), r, 255, -1)
    return cv2.GaussianBlur(m.astype(np.float32) / 255, (0, 0), 0.8)[..., None]


def tile_on(img, x, y, tile, r=18, b=4):
    h, w_ = tile.shape[:2]
    sh = np.zeros(img.shape[:2], np.float32)
    cv2.rectangle(sh, (x + 6, y + 10), (x + w_ + 6, y + h + 10), 1, -1)
    sh = cv2.GaussianBlur(sh, (0, 0), 12)[..., None]
    img *= 1 - 0.3 * sh
    fm = rmask(w_ + 2 * b, h + 2 * b, r + b)
    reg = img[y - b:y + h + b, x - b:x + w_ + b]
    reg[:] = reg * (1 - fm) + 246 * fm
    m = rmask(w_, h, r)
    reg = img[y:y + h, x:x + w_]
    reg[:] = reg * (1 - m) + tile * m


# kurgu5: full line left + three framed detail tiles
base = render(s1, 25 - s1 * bx0, 5 - s1 * by0)
tw_, th_ = 300, 300
y0 = 33
x = int(25 + w1 + 70)
gap = (TW - x - 30 - 3 * tw_) // 2
for (vx, vy, z) in [(430, 500, 2.6), (560, 330, 2.6), (1105, 505, 2.2)]:
    c = tr([[vx, vy]])[0]
    s = s1 * z
    tile = render(s, tw_ / 2 - s * c[0], th_ / 2 - s * c[1], W=tw_, H=th_)
    tile_on(base, x, y0, tile)
    x += tw_ + gap
k5 = fin(base)

# kurgu6: full line centred + two round magnifier callouts
base = render(s1, TW / 2 - s1 * (bx0 + bx1) / 2, 5 - s1 * by0)
R = 160


def callout(base, cxo, cyo, vx, vy, z):
    c = tr([[vx, vy]])[0]
    s = s1 * z
    tile = render(s, R - s * c[0], R - s * c[1], W=2 * R, H=2 * R)
    m = np.zeros((2 * R, 2 * R), np.float32)
    cv2.circle(m, (R, R), R - 2, 1, -1)
    m = cv2.GaussianBlur(m, (0, 0), 1)[..., None]
    px = int(TW / 2 - s1 * (bx0 + bx1) / 2 + s1 * c[0])
    py = int(5 - s1 * by0 + s1 * c[1])
    cv2.line(base, (px, py), (cxo, cyo), (245, 245, 245), 3, cv2.LINE_AA)
    cv2.circle(base, (px, py), 10, (245, 245, 245), 3, cv2.LINE_AA)
    sh = np.zeros(base.shape[:2], np.float32)
    cv2.circle(sh, (cxo + 6, cyo + 10), R + 4, 1, -1)
    sh = cv2.GaussianBlur(sh, (0, 0), 12)[..., None]
    base *= 1 - 0.3 * sh
    cv2.circle(base, (cxo, cyo), R + 5, (246, 246, 246), -1, cv2.LINE_AA)
    reg = base[cyo - R:cyo + R, cxo - R:cxo + R]
    reg[:] = reg * (1 - m) + tile * m


callout(base, 220, 183, 560, 560, 3.0)
callout(base, TW - 220, 183, 1150, 470, 2.8)
k6 = fin(base)
sheet = []
for n, v in (('kurgu5', k5), ('kurgu6', k6)):
    cv2.imwrite(D + f'makrev-banner-2016x430-{n}.png', v)
    c_ = v.copy()
    cv2.line(c_, (0, 366), (TW, 366), (0, 0, 255), 2)
    cv2.putText(c_, n, (20, 420), 0, 1.0, (0, 0, 200), 2)
    sheet += [c_, np.zeros((16, TW, 3), np.uint8)]
cv2.imwrite(D + 'chk_k2.jpg', np.vstack(sheet))

# ================= more compositions =================
NAVY = np.float32([72, 50, 37])   # BGR, site header colour
RED = np.float32([63, 32, 232])   # BGR, logo red
xs = np.arange(TW, dtype=np.float32)[None, :, None]
yy = np.arange(TH, dtype=np.float32)[:, None, None]
out = {}

# kurgu7: navy diagonal panel on the left with a red accent stripe + close-up inside; full line on beige right
full_r = render(s1, TW - 30 - w1 - s1 * bx0, 5 - s1 * by0)
c = tr([[430, 520]])[0]; s = s1 * 2.3
close = render(s, 380 - s * c[0], 210 - s * c[1])
close = close * 0.55 + NAVY * 0.45  # tinted into the brand colour
edge = 980 - 0.35 * yy  # diagonal boundary
a = np.clip((edge - xs) / 2.0, 0, 1)
img = full_r * (1 - a) + close * a
stripe = np.clip(1 - np.abs(xs - (edge + 14)) / 6, 0, 1)
img = img * (1 - stripe) + RED * stripe
out['kurgu7'] = fin(img)

# kurgu8: full navy background (like the site header) with the line on a soft beige spotlight
full_c = render(s1, TW / 2 - s1 * (bx0 + bx1) / 2, 5 - s1 * by0)
d2 = ((xs - TW / 2) / (w1 * 0.62)) ** 2 + ((yy - 185) / 240) ** 2
spot = np.clip(1.25 - d2, 0, 1) ** 1.2
img = full_c * spot + (NAVY * 0.9 + full_c * 0.1) * (1 - spot)
line = np.clip(1 - np.abs(yy - 362) / 2.5, 0, 1) * np.clip(1 - np.abs(xs - TW / 2) / (w1 * 0.55), 0, 1)
img = img * (1 - line) + RED * line
out['kurgu8'] = fin(img)

# kurgu9: film strip — wide first frame with the full line, then three narrow frames with details
img = np.zeros((TH, TW, 3), np.float32) + np.float32([238, 238, 238])
fw0 = int(w1 + 50)
frames = [(20, fw0)]
rest = TW - 20 - fw0 - 20 - 3 * 16
fwn = rest // 3
x = 20 + fw0 + 16
for k in range(3):
    frames.append((x, fwn)); x += fwn + 16
fh = 330; fy = 18
for k, (fx, fw) in enumerate(frames):
    if k == 0:
        t = render(s1 * 0.97, fw / 2 - s1 * 0.97 * (bx0 + bx1) / 2, fh / 2 - s1 * 0.97 * (by0 + by1) / 2, W=fw, H=fh)
    else:
        vx, vy, z = [(330, 470, 3.0), (640, 330, 2.8), (1105, 505, 2.4)][k - 1]
        cc = tr([[vx, vy]])[0]; ss = s1 * z
        t = render(ss, fw / 2 - ss * cc[0], fh / 2 - ss * cc[1], W=fw, H=fh)
    img[fy:fy + fh, fx:fx + fw] = t
    img[fy + fh:fy + fh + 6, fx:fx + fw] = RED if k == 0 else NAVY
out['kurgu9'] = fin(img)

# kurgu10: full line left + three hexagon detail tiles (industrial look)
img = render(s1, 25 - s1 * bx0, 5 - s1 * by0)
Rh = 150
cxs = [int(25 + w1 + 70 + Rh + k * (2 * Rh * 0.95 + 18)) for k in range(3)]
cys = [175, 200, 175]
for k, (vx, vy, z) in enumerate([(430, 500, 2.6), (640, 330, 2.6), (1105, 505, 2.2)]):
    cx0, cy0 = cxs[k], cys[k]
    hexp = np.int32([[cx0 + Rh * np.cos(np.pi / 3 * i), cy0 + Rh * np.sin(np.pi / 3 * i)] for i in range(6)])
    m = np.zeros((TH, TW), np.float32); cv2.fillPoly(m, [hexp], 1)
    mo = np.zeros((TH, TW), np.float32); cv2.fillPoly(mo, [np.int32([[cx0 + (Rh + 6) * np.cos(np.pi / 3 * i), cy0 + (Rh + 6) * np.sin(np.pi / 3 * i)] for i in range(6)])], 1)
    sh = cv2.GaussianBlur(np.roll(np.roll(mo, 10, 0), 6, 1), (0, 0), 12)[..., None]
    img *= 1 - 0.3 * sh
    mo = cv2.GaussianBlur(mo, (0, 0), 0.8)[..., None]
    img = img * (1 - mo) + 246 * mo
    cc = tr([[vx, vy]])[0]; ss = s1 * z
    t = render(ss, cx0 - ss * cc[0], cy0 - ss * cc[1])
    m = cv2.GaussianBlur(m, (0, 0), 0.8)[..., None]
    img = img * (1 - m) + t * m
out['kurgu10'] = fin(img)

sheet = []
for n, v in out.items():
    cv2.imwrite(D + f'makrev-banner-2016x430-{n}.png', v)
    c_ = v.copy(); cv2.line(c_, (0, 366), (TW, 366), (0, 255, 255), 2); cv2.putText(c_, n, (20, 420), 0, 1.0, (0, 0, 200), 2)
    sheet += [c_, np.zeros((16, TW, 3), np.uint8)]
cv2.imwrite(D + 'chk_k3.jpg', np.vstack(sheet))
