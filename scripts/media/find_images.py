#!/usr/bin/env python3
"""Find commercially usable images (Openverse) and build a numbered contact sheet.

  python3 -I scripts/media/find_images.py --q "cozy fireplace" --n 12 --out <dir>

Only licenses that allow commercial use are requested (CC0, PDM, BY, BY-SA).
Writes <dir>/candidates.json (id, title, creator, license, url, landing page) and
<dir>/sheet.jpg (numbered thumbnails) so the user can pick by number.
"""
import argparse
import json
import os
import subprocess
import urllib.parse
import urllib.request

UA = {"User-Agent": "yt-studio-media-finder/1.0"}


def get(url, path=None):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    if path:
        open(path, "wb").write(data)
    return data


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--q", required=True)
    ap.add_argument("--n", type=int, default=12)
    ap.add_argument("--out", required=True)
    ap.add_argument("--aspect", default="wide")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    params = {
        "q": a.q,
        "license": "cc0,pdm,by,by-sa",
        "page_size": str(min(20, a.n * 2)),
        "aspect_ratio": a.aspect,
        "size": "large",
        "mature": "false",
    }
    res = json.loads(get("https://api.openverse.org/v1/images/?" + urllib.parse.urlencode(params)))
    picks = []
    for r in res.get("results", []):
        if len(picks) >= a.n:
            break
        idx = len(picks) + 1
        thumb = os.path.join(a.out, f"t{idx:02d}.jpg")
        try:
            try:
                get(r.get("thumbnail") or r["url"], thumb)
            except Exception:  # noqa: BLE001  thumbnail proxy failed → try the original
                get(r["url"], thumb)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", thumb, "-vf",
                            f"scale=480:270:force_original_aspect_ratio=increase,crop=480:270,drawbox=x=0:y=0:w=64:h=48:color=black@0.7:t=fill,drawtext=text='{idx}':x=16:y=8:fontsize=34:fontcolor=white",
                            thumb + ".png"], check=True)
        except Exception as e:  # noqa: BLE001
            print("skip", r.get("id"), e)
            continue
        picks.append({
            "n": idx,
            "id": r["id"],
            "title": r.get("title"),
            "creator": r.get("creator"),
            "license": f"{r.get('license')} {r.get('license_version') or ''}".strip(),
            "license_url": r.get("license_url"),
            "url": r["url"],
            "landing": r.get("foreign_landing_url"),
            "size": [r.get("width"), r.get("height")],
            "source": r.get("source"),
        })
    json.dump(picks, open(os.path.join(a.out, "candidates.json"), "w"), indent=1, ensure_ascii=False)
    ins = sum([["-i", os.path.join(a.out, f"t{p['n']:02d}.jpg.png")] for p in picks], [])
    cols = 4
    rows = (len(picks) + cols - 1) // cols
    layout = "|".join(f"{(i % cols) * 480}_{(i // cols) * 270}" for i in range(len(picks)))
    subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex",
                    f"xstack=inputs={len(picks)}:layout={layout}:fill=black", os.path.join(a.out, "sheet.jpg")], check=True)
    for p in picks:
        print(p["n"], p["license"], p["size"], p["source"], "|", (p["title"] or "")[:60], "|", p["creator"])


if __name__ == "__main__":
    main()
