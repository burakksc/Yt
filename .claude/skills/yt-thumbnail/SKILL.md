---
name: yt-thumbnail
description: YouTube thumbnail tasarlama ve Remotion Still ile PNG üretme, başlık+thumbnail uyumu, A/B varyantları. "Thumbnail", "kapak görseli", "küçük resim" denildiğinde kullan.
metadata:
  version: 1.0.0
---
# YT Thumbnail

## Önce hafıza
- Video notu (vaat, başlık adayları), `Marka Rehberi`, önceki videoların "Yayın sonrası analiz" CTR'ları (hangi stil tuttu?).

## Kurallar
- 1280×720 `<Still>` (Remotion): `video/src/videos/<slug>/Thumbnail.tsx`, Root'a `<Still id="<Slug>Thumb" …/>`.
- **En fazla 3–4 kelime** metin; başlığı tekrar etme, tamamla.
- Tek odak noktası; yüksek kontrast; küçük boyutta (168×94) okunur olmalı.
- Sağ alt köşe süre etiketinin altında kalır → oraya önemli şey koyma.

## Adımlar
1. 3 konsept yaz (metin + görsel fikir + duygu).
2. Her biri için bir `<Still>` varyantı (aynı bileşen, farklı `defaultProps`).
3. `npx remotion still <Id> out/thumb-<v>.png` ile üret; ayrıca küçük önizleme kontrolü: aynı PNG'yi 168px genişlikte görüntüleyip okunabilirliği değerlendir.
4. Kullanıcıya varyantları göster, seçimi kaydet.

## Kalite kriterleri
- Metin ≤ 4 kelime, küçük boyutta okunuyor.
- Başlık + thumbnail birlikte merak boşluğu yaratıyor, aynı şeyi söylemiyor.

## Sonra
Video notu "5. Thumbnail & Başlık" + seçilen varyant + `status: thumbnail`. `vault-memory` → `retro`. Sıradaki: `yt-seo`.

## Öğrenilenler
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-13): ilk sürüm.
