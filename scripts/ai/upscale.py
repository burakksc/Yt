#!/usr/bin/env python3
"""4x AI upscale with Real-ESRGAN (RRDBNet, BSD-3; weights ai-forever/Real-ESRGAN on HF), CPU, tiled.

  ~/.venvs/sd/bin/python scripts/ai/upscale.py in.png out.png [--width 3840]

Output is resized (Lanczos) to --width keeping aspect, e.g. 1344x768 -> 5376x3072 -> 3840x2194, then
centre-cropped to 16:9 when --crop169 is given.
"""
import argparse

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from huggingface_hub import hf_hub_download
from PIL import Image


class RDB(nn.Module):
    def __init__(self, nf=64, gc=32):
        super().__init__()
        self.conv1 = nn.Conv2d(nf, gc, 3, 1, 1)
        self.conv2 = nn.Conv2d(nf + gc, gc, 3, 1, 1)
        self.conv3 = nn.Conv2d(nf + 2 * gc, gc, 3, 1, 1)
        self.conv4 = nn.Conv2d(nf + 3 * gc, gc, 3, 1, 1)
        self.conv5 = nn.Conv2d(nf + 4 * gc, nf, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(0.2, True)

    def forward(self, x):
        x1 = self.lrelu(self.conv1(x))
        x2 = self.lrelu(self.conv2(torch.cat((x, x1), 1)))
        x3 = self.lrelu(self.conv3(torch.cat((x, x1, x2), 1)))
        x4 = self.lrelu(self.conv4(torch.cat((x, x1, x2, x3), 1)))
        x5 = self.conv5(torch.cat((x, x1, x2, x3, x4), 1))
        return x5 * 0.2 + x


class RRDB(nn.Module):
    def __init__(self, nf, gc=32):
        super().__init__()
        self.rdb1, self.rdb2, self.rdb3 = RDB(nf, gc), RDB(nf, gc), RDB(nf, gc)

    def forward(self, x):
        return self.rdb3(self.rdb2(self.rdb1(x))) * 0.2 + x


class RRDBNet(nn.Module):
    def __init__(self, nf=64, nb=23, gc=32):
        super().__init__()
        self.conv_first = nn.Conv2d(3, nf, 3, 1, 1)
        self.body = nn.Sequential(*[RRDB(nf, gc) for _ in range(nb)])
        self.conv_body = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_up1 = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_up2 = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_hr = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_last = nn.Conv2d(nf, 3, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(0.2, True)

    def forward(self, x):
        f = self.conv_first(x)
        f = f + self.conv_body(self.body(f))
        f = self.lrelu(self.conv_up1(F.interpolate(f, scale_factor=2, mode="nearest")))
        f = self.lrelu(self.conv_up2(F.interpolate(f, scale_factor=2, mode="nearest")))
        return self.conv_last(self.lrelu(self.conv_hr(f)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inp")
    ap.add_argument("out")
    ap.add_argument("--width", type=int, default=3840)
    ap.add_argument("--crop169", action="store_true")
    ap.add_argument("--tile", type=int, default=192)
    a = ap.parse_args()
    torch.set_grad_enabled(False)
    net = RRDBNet()
    sd = torch.load(hf_hub_download("ai-forever/Real-ESRGAN", "RealESRGAN_x4.pth"), map_location="cpu")
    sd = sd.get("params_ema", sd.get("params", sd))
    net.load_state_dict(sd, strict=True)
    net.eval()
    img = np.asarray(Image.open(a.inp).convert("RGB")).astype(np.float32) / 255
    h, w = img.shape[:2]
    out = np.zeros((h * 4, w * 4, 3), np.float32)
    pad, t = 12, a.tile
    x = torch.from_numpy(img).permute(2, 0, 1)[None]
    for y0 in range(0, h, t):
        for x0 in range(0, w, t):
            ys, xs = max(0, y0 - pad), max(0, x0 - pad)
            ye, xe = min(h, y0 + t + pad), min(w, x0 + t + pad)
            o = net(x[:, :, ys:ye, xs:xe]).clamp(0, 1)[0].permute(1, 2, 0).numpy()
            cy, cx = (y0 - ys) * 4, (x0 - xs) * 4
            th, tw = min(t, h - y0) * 4, min(t, w - x0) * 4
            out[y0 * 4:y0 * 4 + th, x0 * 4:x0 * 4 + tw] = o[cy:cy + th, cx:cx + tw]
        print(f"row {y0}/{h}", flush=True)
    im = Image.fromarray((out * 255).round().astype(np.uint8))
    nh = round(im.height * a.width / im.width)
    im = im.resize((a.width, nh), Image.LANCZOS)
    if a.crop169:
        th = a.width * 9 // 16
        top = (im.height - th) // 2
        im = im.crop((0, top, a.width, top + th))
    im.save(a.out)
    print("saved", a.out, im.size)


if __name__ == "__main__":
    main()
