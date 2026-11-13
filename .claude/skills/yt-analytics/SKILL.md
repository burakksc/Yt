---
name: yt-analytics
description: Yayınlanmış videonun performansını analiz edip dersleri hafızaya ve skill'lere aktarma (CTR, retention, izlenme). "Analiz", "nasıl gitti", "istatistik", "performans" denildiğinde kullan.
metadata:
  version: 1.0.0
---
# YT Analytics — Performans → Ders

Veri kaynağı: kullanıcının YouTube Studio'dan verdiği sayılar/ekran görüntüleri (API bağlı değilse).

## Adımlar
1. Video notundaki analiz tablosunu (48 saat / 7 gün / 28 gün) doldur.
2. Kanal ortalamasıyla karşılaştır (önceki video notlarından hesapla).
3. Teşhis:
   - CTR düşük → başlık/thumbnail sorunu → `yt-thumbnail` / `yt-seo` feedback'i.
   - İlk 30 sn düşüşü yüksek → hook sorunu → `yt-script` feedback'i + `Hook Kalıpları` tablosuna sonuç yaz.
   - Orta kısımda düşüş → tempo/görsel → `yt-video` feedback'i.
4. **Her teşhis için** `vault/04-Skills/feedback/` altına `_Templates/Skill-Feedback.md` ile bir feedback notu yaz (kanıt = metrik). Bu, skill'leri veriyle eğitir.
5. `status: analiz`.

## Kalite kriterleri
- Her sonuç bir metriğe dayanıyor; tahmin "tahmin" olarak işaretli.
- En az bir eyleme dönük feedback notu üretilmiş.

## Öğrenilenler
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-13): ilk sürüm.
