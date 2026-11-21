---
tür: video
seri: Then vs Now
dil: en
durum: render
tarih: 2026-11-21
---
# Then vs Now Shorts (4 adet)
Metinler: [[2026-11-21 Then vs Now - Metinler]] · Bileşen: `GizemShort` (değişiklik yok; açılış sahnesi başlığı "Then vs Now")

| Slug | Composition | Süre | mp4 |
|---|---|---|---|
| day1900 | GizemDay1900 | ~52 s | `video/out/gizem-day1900-en.mp4` |
| knockerup | GizemKnockerUp | ~44 s | `video/out/gizem-knockerup-en.mp4` |
| lector | GizemLector | ~58.6 s | `video/out/gizem-lector-en.mp4` |
| humancomputers | GizemHumanComputers | ~56.4 s | `video/out/gizem-humancomputers-en.mp4` |

## Üretim
- Görseller: `projects/gizem/<slug>/img/` (kaynak) + `cand/dl/meta.json` (başlık/yazar/lisans/URL → `scripts/media/gizem_credits.py`).
- Anlatım: Kokoro-82M `am_michael`, hız 0.92 → `video/public/gizem/<slug>/en/<sahne>.wav`.
- Build: `python3 scripts/media/gizem_build.py <slug> projects/gizem/<slug>/img <Comp>`, ardından ekran kredileri stories.ts `credits`.
- Render: `--concurrency=2` (paylaşılan CPU; ~1.5 saat/Short).

## Doğrulanan rakamlar (bölge: ABD, 1900)
- Doğumda yaşam beklentisi 47.3 (CDC/NCHS); bugün ~77-79.
- Elektrikli ev < %5 (Smil / IEEE Spectrum).
- Haftalık çalışma ~58.5 sa (HSUS Ba4575), imalatta ~60 (EH.Net) → metinde "nearly sixty".
- Tam banyolu ev 1940'ta bile ~%55 (Census) → metinde "usually an outhouse".
- Knocker-up: Britanya/İrlanda sanayi kasabaları; Mary Smith (East End, bezelye üfleci, haftada 6 peni); Hollanda'da "porder". "Kim uyandırdı?" → çoğu gece çalışıp gündüz uyurdu (temkinli).
- Lector: Havana 1865 başlangıç; işçiler ücret öder ve oylardı; Tampa'da 1931 grevi sonrası yasak; Montecristo adı "often said" (belgesiz gelenek), Romeo y Julieta → Shakespeare.
- Annie Jump Cannon ~350.000 yıldız; Glenn sözü "reportedly" (NASA biyografisi).

## Lisanslar
Hepsi kamu malı / CC0 / CC BY-SA (NC/ND yok). CC BY-SA: kerosen lambası (4.0), porder2 IISG (2.0), çalar saat (4.0), Ybor kartpostal (4.0), lector kürsüsü (3.0). Porder (Nationaal Archief): "No known copyright restrictions" (Flickr Commons). Ayrıntılı sahne-sahne liste Metinler notunda.

## Sorunlar / dersler
- Commons API 429 → HTML arama sayfası + File: sayfası; upload.wikimedia için curl + yeniden deneme döngüsü (urllib takıldı).
- loc.gov, images-api.nasa.gov, archive.org, wikidata engelli → Commons kopyaları kullanıldı.
- İlk metinler uzundu (day1900 ~74 s) → kısaltıldı; humancomputers/lector ikinci kez kısaltıldı (≤60 s).
- Disk ~%96 dolu; gereksiz ham görseller silindi.
