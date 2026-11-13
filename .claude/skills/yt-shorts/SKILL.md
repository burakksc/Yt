---
name: yt-shorts
description: Long-form videodan veya sıfırdan YouTube Shorts (9:16, ≤60 sn) üretme - en iyi anları seçme, dikey yeniden düzen, altyazı. "Shorts yap", "kısa video", "dikey versiyon", "reels/tiktok" denildiğinde kullan.
metadata:
  version: 1.0.0
---
# YT Shorts

## Önce hafıza
- Kaynak video notu (senaryo + analiz: hangi bölüm en çok izlendi?), `Marka Rehberi` (Shorts vurgu rengi), `Hook Kalıpları`.

## Adımlar
1. Kaynaktan 2–3 aday an seç: kendi başına anlaşılır, tek fikir, güçlü ilk cümle.
2. Her aday için mini senaryo (`yt-script` Shorts yapısı).
3. Remotion: `video/src/videos/<slug>/shorts/<n>.tsx`, 1080×1920, `ShortsHook` bileşeniyle açılış. Long-form sahne bileşenlerini yeniden kullan, yeniden yazma.
4. Altyazı: `remotion-captions` skill'i; büyük, kelime-kelime vurgulu, üst/alt 250px dışında.
5. Kontrol kareleri al (ilk kare = hook mu?) → render.

## Kalite kriterleri
- İlk karede hook metni okunur.
- ≤ 60 sn; son cümle başa döngü yapıyor.
- Altyazılar güvenli alanda.

## Sonra
Kaynak video notuna "Shorts" alt başlığıyla link + kendi video notu (`format: short`). `vault-memory` → `retro`.

## Öğrenilenler
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-13): ilk sürüm.
