---
tags: [skill-feedback]
skill: yt-video
date: 2026-11-17
type: kullanıcı-düzeltmesi
severity: yüksek
status: açık
---
# Feedback: yt-video — cozy videolarda çizim (SVG) arka plan olmaz
**Görev:** Kış şömine cozy videosu (Flow görseli olmadan, tamamen koddan çizim).
**Ne oldu:** Kullanıcı: "Gönderdiğin şömine görseli çizim gibi, çok kötü… o olmaz."
**Kök neden:** Cozy/uyku formatının referansları (Cozy Vesper, kütüphane penceresi, Cozy Alley) **fotogerçekçi AI görsel** üzerine animasyon. Görsel yokken kodla "geçici" çizim yapmak beklentiyi karşılamıyor; kullanıcıya önce görsel istemek gerekirdi.
**Önerilen değişiklik:** yt-video (ve ileride yt-ambience): "Cozy/ambiyans videolarında arka plan **her zaman fotogerçekçi görsel** (kullanıcının Flow/Nano Banana çıktısı veya ticari lisanslı bir görsel API'si). Görsel yoksa üretime başlama; prompt'u ver, görseli iste. Kod çizimi sadece bilgi/animasyon videolarında."
**Kanıt:** Kullanıcı mesajları 2026-11-17; `video/src/videos/cozy-fireplace/` (reddedildi).
