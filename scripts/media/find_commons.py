#!/usr/bin/env python3
"""Search Wikimedia Commons for commercially usable images and build a numbered contact sheet.

  python3 -I scripts/media/find_commons.py --q "Constantinople painting" --n 12 --out <dir> [--min-width 1600]

Keeps only licenses that allow commercial use: Public domain, CC0, CC BY, CC BY-SA
(NC/ND are rejected). Writes candidates.json (title, author, license, attribution, file URL,
page URL, size) and sheet.jpg with numbers so the user can choose.
"""
import argparse
import html
import json
import os
import re
import subprocess
import urllib.error
import urllib.parse
import urllib.request

UA = {"User-Agent": "YtStudioMediaFinder/1.0 (non-commercial research script; python-urllib)"}
API = "https://commons.wikimedia.org/w/api.php"
OK = re.compile(r"^(public domain|pd|cc0|cc[- ]by(-sa)?( \d\.\d)?)", re.I)


def get(url, path=None, tries=5):
    import time

    for k in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                data = r.read()
            break
        except urllib.error.HTTPError as e:
            if e.code != 429 or k == tries - 1:
                raise
            time.sleep(int(e.headers.get("Retry-After") or 2 * (k + 1)) + 1)
    time.sleep(0.6)  # be polite to Wikimedia
    if path:
        open(path, "wb").write(data)
    return data


def strip(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--q", required=True)
    ap.add_argument("--n", type=int, default=12)
    ap.add_argument("--out", required=True)
    ap.add_argument("--min-width", type=int, default=1600)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    params = {
        "action": "query", "format": "json", "generator": "search", "gsrnamespace": "6",
        "gsrsearch": f"{a.q} filetype:bitmap", "gsrlimit": "50",
        "prop": "imageinfo", "iiprop": "url|size|extmetadata", "iiurlwidth": "500",
    }
    data = json.loads(get(API + "?" + urllib.parse.urlencode(params)))
    pages = sorted(data.get("query", {}).get("pages", {}).values(), key=lambda p: p.get("index", 0))
    picks = []
    for p in pages:
        if len(picks) >= a.n:
            break
        ii = (p.get("imageinfo") or [{}])[0]
        md = ii.get("extmetadata", {})
        lic = strip(md.get("LicenseShortName", {}).get("value"))
        if not OK.match(lic) or re.search(r"\bNC\b|\bND\b", lic):
            continue
        if (ii.get("width") or 0) < a.min_width or (ii.get("width") or 0) < (ii.get("height") or 1):
            continue
        idx = len(picks) + 1
        t = os.path.join(a.out, f"t{idx:02d}.jpg")
        try:
            get(ii["thumburl"], t)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", t, "-vf",
                            f"scale=480:270:force_original_aspect_ratio=increase,crop=480:270,drawbox=x=0:y=0:w=64:h=48:color=black@0.7:t=fill,drawtext=text='{idx}':x=16:y=8:fontsize=34:fontcolor=white",
                            t + ".png"], check=True)
        except Exception as e:  # noqa: BLE001
            print("skip", p.get("title"), e)
            continue
        author = strip(md.get("Artist", {}).get("value"))[:80]
        picks.append({
            "n": idx, "title": p.get("title"), "author": author, "license": lic,
            "attribution": f"{p.get('title','').replace('File:','')} — {author} — {lic} — via Wikimedia Commons",
            "url": ii.get("url"), "page": ii.get("descriptionurl"), "size": [ii.get("width"), ii.get("height")],
            "desc": strip(md.get("ImageDescription", {}).get("value"))[:200],
        })
    json.dump(picks, open(os.path.join(a.out, "candidates.json"), "w"), indent=1, ensure_ascii=False)
    if len(picks) == 1:
        subprocess.run(["cp", os.path.join(a.out, "t01.jpg.png"), os.path.join(a.out, "sheet.jpg")], check=True)
    elif picks:
        ins = sum([["-i", os.path.join(a.out, f"t{p['n']:02d}.jpg.png")] for p in picks], [])
        cols = 4
        layout = "|".join(f"{(i % cols) * 480}_{(i // cols) * 270}" for i in range(len(picks)))
        subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex",
                        f"xstack=inputs={len(picks)}:layout={layout}:fill=black", os.path.join(a.out, "sheet.jpg")], check=True)
    for p in picks:
        print(p["n"], p["license"], p["size"], "|", p["title"][:70], "|", p["author"][:40])


if __name__ == "__main__":
    main()
