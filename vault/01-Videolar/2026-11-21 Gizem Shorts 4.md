---
tür: shorts (EN, Michael)
durum: render bitti (2026-11-21)
composition: GizemAntikythera / GizemBaalbek (video/src/videos/gizem, veri projects/gizem/stories.json)
---
# Gizem Shorts 4 (2026-11-21): Antikythera + Baalbek
Metinler: [[2026-11-21 Gizem Shorts 4 - Metinler]] · Önceki: [[2026-11-20 Gizem Shorts]]

## Yapılan
- `antikythera` (GizemAntikythera, ~59.1 s) ve `baalbek` (GizemBaalbek, ~59.0 s), 8'er sahne, Kokoro am_michael (0.92).
- İlk metinler ~180 kelime → 75 s çıktı. **Kokoro am_michael ≈ 2.1 kelime/sn**; 0.75 s sahne boşluğu × 8 = 6 s → 60 s Shorts için **≤ ~112 kelime**.
- Görseller hepsi gerçek fotoğraf (Openverse → Flickr). Commons orijinal URL'leri 429 verdi; Flickr staticflickr sorunsuz. Openverse `page_size` > 20 → 401 (anahtarsız).
- Baalbek hook başlığı "biggest stone ever cut" → "biggest stone of antiquity" (Guinness ifadesi; abartı yok).

## Kaynaklar (doğrulanmış)
- Antikythera: UCL haber 2021-03 (Freeth ve ark., Scientific Reports 11:5821); 82 parça, 30 dişli; 1901 sünger dalgıçları; batık ~MÖ 60; 2005 X-ışını BT; Saros 223 ay; Olimpiyat 4 yıllık döngü (Jones / ISAW, history.com). "1000+ yıl benzeri yok" yaygın akademik çerçeve.
- Baalbek: Smithsonian, archaeology.org (2014/12 & Mar-Apr 2015), Guinness "Largest megalith from antiquity": 2014 blok 19.6 × 6 × ≥5.5 m, ~1,650 t (DAI + Lübnan); Hamile Kadın Taşı ~1,000 t; trilithon ~800 t/blok; ocak ~800 m, hafif yukarıda; Jüpiter Tapınağı Nero döneminde (~MS 60) tamamlandı; 6 sütun ~20 m. Ana görüş: Roma mühendisliği (rampa, silindir, kaldıraç, ırgat); kusur yüzünden bırakılmış olabilir. Sözde-bilim iddiası yok.

## Lisans
- Ses: Kokoro-82M (Apache-2.0). Font/çizim: mevcut bileşen.
- Antikythera: Tilemahos Efthimiadis (CC BY 2.0, Flickr) ×7 (3'ü müzedeki replika), Weekend Wayfarers (CC BY 2.0).
- Baalbek: Lodo27 (CC BY-SA 2.0) ×4, Arian Zwegers (CC BY 2.0), Eusebius@Commons (CC BY 2.0), Following Hadrian (CC BY-SA 2.0), isawnyu (CC BY 2.0).
- Linkler: Metinler notundaki açıklamalarda.

## Render
- `video/out/gizem-antikythera-en.mp4` 59.1 s, `video/out/gizem-baalbek-en.mp4` 59.1 s; kareler ve ses (-27.7 dB ortalama) kontrol edildi.
- Sorun: paralel ajanlarla disk %100 doldu → Chrome "ran out of memory or disk space". `npm cache clean --force` (~650 MB) + `--concurrency=2` ile çözüldü. Ders: render öncesi `df -h /` kontrol et.
