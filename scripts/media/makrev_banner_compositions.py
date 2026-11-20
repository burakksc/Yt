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
