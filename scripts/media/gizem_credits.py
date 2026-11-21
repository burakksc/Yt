#!/usr/bin/env python3
"""Per-scene image credits for a Gizem Short's YouTube description.

Usage: /root/.venvs/img/bin/python scripts/media/gizem_credits.py <slug> [pad_seconds]

For every scene (in order) prints:
  0:12 Scene title — "Image title" by Author, CC BY 2.0, <URL>
Scene start times come from the narration wavs (video/public/gizem/<slug>/en/<id>.wav)
plus a per-scene pad (default: spread so the total matches the rendered mp4).
Image -> source is found by matching projects/gizem/<slug>/img/<img>.jpg against the
candidates in projects/gizem/<slug>/cand/dl/ (meta.json: key -> openverse record).
"""
import glob
import json
import os
import subprocess
import sys

import cv2
import numpy as np

NOLINKS = "--nolinks" in sys.argv
sys.argv = [a for a in sys.argv if a != "--nolinks"]
slug = sys.argv[1]
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
story = json.load(open(f"{root}/projects/gizem/stories.json"))[slug]


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]))


vsec = [dur(f"{root}/video/public/gizem/{slug}/en/{s['id']}.wav") for s in story["scenes"]]
mp4 = f"{root}/video/out/gizem-{slug}-en.mp4"
if len(sys.argv) > 2:
    pad = float(sys.argv[2])
elif os.path.exists(mp4):
    pad = (dur(mp4) - sum(vsec)) / len(vsec)
else:
    pad = 0.8


def thumb(p):
    im = cv2.imread(p, 0)
    return None if im is None else cv2.resize(im, (32, 32)).astype(float)


meta = {}
cands = {}
for mp in glob.glob(f"{root}/projects/gizem/{slug}/cand/**/meta.json", recursive=True):
    d = os.path.dirname(mp)
    m = json.load(open(mp))
    for k, v in (m.items() if isinstance(m, dict) else enumerate(m)):
        f = os.path.join(d, f"{k}.jpg")
        if os.path.exists(f):
            meta[f] = v
            cands[f] = thumb(f)

LIC = {"by": "CC BY", "by-sa": "CC BY-SA", "cc0": "CC0", "pdm": "Public Domain"}
t = 0.0
for s, v in zip(story["scenes"], vsec):
    img = f"{root}/projects/gizem/{slug}/img/{s['img']}.jpg"
    a = thumb(img)
    best, err = None, 1e9
    for f, b in cands.items():
        if a is not None and b is not None:
            e = np.abs(a - b).mean()
            if e < err:
                best, err = f, e
    ts = f"{int(t // 60)}:{int(t % 60):02d}"
    if best is not None and err < 6:
        r = meta[best]
        lic = LIC.get(r["license"], r["license"].upper())
        ver = f" {r['license_version']}" if r.get("license_version") and r["license"] not in ("cc0", "pdm") else ""
        url = r["foreign_landing_url"]
        if NOLINKS:  # unverified channels cannot post links: name site + photo id instead
            site = "Flickr" if "flickr" in url else "Wikimedia Commons" if "wikimedia" in url else url.split("/")[2]
            pid = url.rstrip("/").split("/")[-1]
            tail = f"via {site} (photo ID {pid})" if site == "Flickr" else f"via {site}"
        else:
            tail = url
        print(f"{ts} {s['title']} — \"{r['title']}\" by {r['creator']}, {lic}{ver}, {tail}")
    else:
        print(f"{ts} {s['title']} — [no source match for {s['img']}.jpg — check manually]")
    t += v + pad
