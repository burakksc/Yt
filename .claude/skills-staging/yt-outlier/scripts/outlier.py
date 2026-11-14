#!/usr/bin/env python3
"""Nişteki "kendi kanalını geçen" videoları bulur: izlenme / kanal medyanı.

Girdi: kanal başına bir TSV (dosya adı = kanal adı), yt-dlp ile kullanıcının bilgisayarında:
  yt-dlp --flat-playlist --playlist-end 30 \
    --print "%(id)s\t%(title)s\t%(duration)s\t%(view_count)s" \
    "https://www.youtube.com/@KANAL/videos" > arastirma/outlier/KANAL.tsv

Kullanım:
  python3 -I outlier.py arastirma/outlier/*.tsv --min 2.0 [--shorts] [--atla-son 2] [--json]

--shorts      : sadece <=60 sn videolar (varsayılan: sadece >60 sn; ikisi karıştırılmaz)
--atla-son N  : her kanalın en yeni N videosunu atla (henüz izlenme toplamadılar)
Sadece standart kütüphane; ağ erişimi yok.
"""
import argparse, json, os, statistics

def oku(yol):
    satirlar = []
    with open(yol, encoding="utf-8", errors="replace") as f:
        for s in f:
            p = s.rstrip("\n").split("\t")
            if len(p) < 4:
                continue
            vid, baslik, sure, izl = p[0], p[1], p[2], p[3]
            try:
                izl = int(float(izl)); sure = float(sure) if sure not in ("NA", "") else None
            except ValueError:
                continue
            satirlar.append({"id": vid, "baslik": baslik, "sure": sure, "izlenme": izl})
    return satirlar

def main():
    a = argparse.ArgumentParser()
    a.add_argument("dosyalar", nargs="+"); a.add_argument("--min", type=float, default=2.0)
    a.add_argument("--shorts", action="store_true"); a.add_argument("--atla-son", type=int, default=0)
    a.add_argument("--json", action="store_true")
    o = a.parse_args()
    sonuc, atlanan = [], []
    for yol in o.dosyalar:
        kanal = os.path.splitext(os.path.basename(yol))[0]
        v = oku(yol)[o.atla_son:]  # flat-playlist en yeniden eskiye sıralar
        v = [x for x in v if x["sure"] is not None and ((x["sure"] <= 60) == o.shorts)]
        if len(v) < 4:
            atlanan.append(f"{kanal} ({len(v)} video; en az 4 gerekli)"); continue
        med = statistics.median(x["izlenme"] for x in v) or 1
        for x in v:
            k = x["izlenme"] / med
            if k >= o.min:
                sonuc.append({**x, "kanal": kanal, "medyan": int(med), "kat": round(k, 1),
                              "url": f"https://www.youtube.com/watch?v={x['id']}"})
    sonuc.sort(key=lambda x: x["kat"], reverse=True)
    if o.json:
        print(json.dumps({"outlier": sonuc, "atlanan": atlanan}, ensure_ascii=False, indent=1)); return
    for x in sonuc[:20]:
        print(f"{x['kat']:>5}x  {x['kanal'][:18]:<18} {x['izlenme']:>9,}  {x['baslik'][:70]}")
    for s in atlanan:
        print("ATLANDI:", s)

if __name__ == "__main__":
    main()
