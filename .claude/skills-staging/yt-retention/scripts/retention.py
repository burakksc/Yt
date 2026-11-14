#!/usr/bin/env python3
"""Kitle elde tutma (audience retention) CSV'sini okuyup kaçakları bulur.

Kullanım:
  python3 -I retention.py elde-tutma.csv --sure 612
  python3 -I retention.py elde-tutma.csv --sure 612 --srt video.srt
  python3 -I retention.py elde-tutma.csv --sure 612 --json

CSV: YouTube Studio > video > Analytics > Etkileşim > Kitle elde tutma > indir.
İlk iki sayısal sütun kullanılır: konum (saniye ya da %0-100) ve izlemeye devam eden %.
Sadece standart kütüphane; ağ erişimi yok.
"""
import argparse, csv, json, re, sys

def oku_csv(yol):
    satirlar = []
    with open(yol, newline="", encoding="utf-8-sig", errors="replace") as f:
        for r in csv.reader(f):
            sayilar = []
            for h in r:
                h = h.strip().replace("%", "").replace(",", ".")
                try:
                    sayilar.append(float(h))
                except ValueError:
                    pass
            if len(sayilar) >= 2:
                satirlar.append((sayilar[0], sayilar[1]))
    return sorted(satirlar)

def oku_srt(yol):
    zaman = re.compile(r"(\d+):(\d+):(\d+)[,.](\d+)\s*-->")
    parcalar, bas = [], None
    with open(yol, encoding="utf-8-sig", errors="replace") as f:
        for satir in f:
            m = zaman.search(satir)
            if m:
                h, dk, sn, ms = map(int, m.groups())
                bas = h * 3600 + dk * 60 + sn + ms / 1000
            elif bas is not None and satir.strip() and not satir.strip().isdigit():
                parcalar.append((bas, satir.strip()))
    return parcalar

def ne_deniyordu(parcalar, bas, bit, pencere=6):
    return " ".join(t for b, t in parcalar if bas - pencere <= b <= bit + 1)[:160]

def analiz(satirlar, sure, kanca_sn=30, ucurum_esik=1.5):
    if len(satirlar) < 5:
        sys.exit("Yetersiz veri: en az 5 nokta gerekli.")
    yuzde_ekseni = max(x for x, _ in satirlar) <= 100.5 and sure
    sn = (lambda x: x / 100 * sure) if yuzde_ekseni else (lambda x: x)
    pts = [(sn(x), y) for x, y in satirlar]
    baslangic = pts[0][1]
    kanca_sonu = min((y for x, y in pts if x <= kanca_sn), default=baslangic)
    kanca_kacak = baslangic - kanca_sonu
    # uçurum: ardışık iki nokta arasında normalleştirilmiş (%/sn * ortalama adım) dik düşüş
    adim = (pts[-1][0] - pts[0][0]) / (len(pts) - 1) or 1
    dususler = []
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        if x0 < kanca_sn:
            continue
        kayip = (y0 - y1) * adim / max(x1 - x0, 1e-9)
        dususler.append((kayip, x0, x1, y0 - y1))
    dususler.sort(reverse=True)
    orta = [p for p in pts if kanca_sn <= p[0] <= pts[-1][0] * 0.9]
    egim = ((orta[0][1] - orta[-1][1]) / (orta[-1][0] - orta[0][0]) * 60) if len(orta) > 2 and orta[-1][0] > orta[0][0] else 0.0
    ucurumlar = [{"bas_sn": round(a), "bit_sn": round(b), "kayip_puan": round(d, 2)}
                 for k, a, b, d in dususler[:5] if k >= ucurum_esik]
    # kayma = orta bölümdeki kayıp, uçurumlar hariç (tempo sorunu)
    if len(orta) > 2 and orta[-1][0] > orta[0][0]:
        ucurum_kaybi = sum(u["kayip_puan"] for u in ucurumlar if orta[0][0] <= u["bas_sn"] <= orta[-1][0])
        egim = (orta[0][1] - orta[-1][1] - ucurum_kaybi) / (orta[-1][0] - orta[0][0]) * 60
    karar = "sağlıklı" if kanca_kacak < 25 else "kaçak" if kanca_kacak < 40 else "ciddi"
    return {"nokta": len(pts), "baslangic": baslangic, "kanca_kacak": round(kanca_kacak, 1),
            "kanca_karar": karar, "ucurumlar": ucurumlar, "kayma_puan_dk": round(egim, 2),
            "son": pts[-1][1], "eksen": "yuzde" if yuzde_ekseni else "saniye"}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("csv"); p.add_argument("--sure", type=float, help="video süresi (sn)")
    p.add_argument("--srt"); p.add_argument("--json", action="store_true")
    a = p.parse_args()
    s = analiz(oku_csv(a.csv), a.sure)
    if a.srt:
        parcalar = oku_srt(a.srt)
        for u in s["ucurumlar"]:
            u["soylenen"] = ne_deniyordu(parcalar, u["bas_sn"], u["bit_sn"])
    if a.json:
        print(json.dumps(s, ensure_ascii=False, indent=1)); return
    print(f"KANCA KAÇAĞI  ilk 30 sn'de {s['kanca_kacak']} puan kayıp  [{s['kanca_karar']}]")
    print("UÇURUMLAR")
    for u in s["ucurumlar"]:
        print(f"  {u['bas_sn']}-{u['bit_sn']} sn  -{u['kayip_puan']}  {u.get('soylenen', '')}")
    if not s["ucurumlar"]:
        print("  yok - kayıp tek tek anlarda değil, genel kaymada")
    print(f"KAYMA  orta bölümde dakikada {s['kayma_puan_dk']} puan")
    print(f"SON  %{s['son']} sona kadar izledi")

if __name__ == "__main__":
    main()
