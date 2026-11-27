---
status: üretim
tarih: 2026-11-27
format: short 9:16, ~35 sn, EN ekran yazısı, seslendirme yok
---
# How Ottomans Painted on Water — Ebru (Short)
Kullanıcı isteği (2026-11-27): Pilates ile birlikte ikinci video, ebru. Talep ölçümü: ebru ortanca ~194K.

## Araştırma
- UNESCO Somut Olmayan Kültürel Miras, 2014 (ich.unesco.org/en/RL/00644): kitreyle koyulaştırılmış su, öd (ox gall) katılmış doğal boyalar yüzer, desen kâğıda alınır.
- İstanbul'da ilk ebru atölyeleri 1562–1575 (Nedim Sönmez'e atıfla); "Türk kâğıdı" ilk yazılı kayıt 1586.
- Fırça: at kılı + gül dalı (birden çok kaynak). Kalem/biz ile desen (lale vb.).
- Sahteciliğe karşı resmi belgelerde ebru: birden çok kaynak (tarih aralığı 15.–19. yy tartışmalı) → videoda tarih verilmedi.
- Kaynaklar: ich.unesco.org/en/RL/ebru-turkish-art-of-marbling-00644 · istanbultarihi.ist/631-ebru-in-istanbul · paper.gatech.edu/index.php/artifact/turkish-ebru-marbled-paper

## Üretim
- Komp. `EbruShort` → `video/src/videos/ebru/` (`scenes.json` prompt'lar). Aynı akış: `scripts/ai/wan_scenes.py` → ffmpeg 1080×1920 → `public/ebru/<id>.mp4`.
- Müzik: `make_music_bed.py --seconds 35 --bpm 72 --no-drums --whoosh 5,10,15,20,25,30 --seed 21`.
- Durum: kurgu + müzik hazır, 7 klip kota bekliyor.

## Kota planı (ücretsiz ZeroGPU ≈ 4 sahne/gün)
Gün 1: Pilates s5–s7 + Ebru e1 · Gün 2: e2–e5 · Gün 3: e6–e7 → iki video biter.
