---
name: yt-publish
description: Yayın öncesi son kontrol listesi ve yayın kaydı. "Yayına hazır mı", "yayınla", "upload öncesi kontrol" denildiğinde kullan.
metadata:
  version: 1.0.0
---
# YT Publish — Yayın Kontrolü

Bu skill YouTube'a kendisi yükleme YAPMAZ (API anahtarı/OAuth yoksa). Yükleme paketini hazırlar ve kontrol eder.

## Kontrol listesi
- [ ] Final render var: `video/out/<slug>.mp4`; süre ve çözünürlük doğru (`npx remotion` çıktısı veya `ffprobe`).
- [ ] Ses: sessiz boşluk / patlama yok (gerekirse `remotion-markup` → silence-detection).
- [ ] Thumbnail PNG seçili, 1280×720, < 2 MB.
- [ ] Başlık, açıklama, bölümler, etiketler hazır (`yt-seo`). Bölüm zamanları final süreyle uyumlu.
- [ ] Altyazı dosyası (varsa .srt).
- [ ] Telif: müzik/görsel lisansları video notunda yazılı.
- [ ] Remotion lisansı: ekip ≤3 kişi ise ücretsiz; değilse `remotion-license` skill'i.
- [ ] Bitiş ekranı / kart için hedef video seçili.

## Adımlar
1. Kontrol listesini tek tek doğrula (varsayım değil, dosyaya bakarak).
2. Eksikleri listele; hepsi tamamsa yükleme paketini özetle (dosya yolları + kopyala-yapıştır metinler).
3. Kullanıcı yükledikten sonra URL ve yayın tarihini video notuna yaz, `status: yayında`, MOC tablosunu güncelle.
4. 48 saat sonrası için `yt-analytics` hatırlatması öner.

## Öğrenilenler
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-13): ilk sürüm.
