---
tags: [skill-feedback]
skill: yt-publish
date: 2026-11-17
type: kullanıcı-düzeltmesi
severity: yüksek
status: açık
---
# Feedback: yt-publish — ticari lisans kontrolü zorunlu
**Görev:** İstanbul videosu için Piper TR sesi denendi.
**Ne oldu:** Piper'ın tek TR sesi CC BY-NC-SA (ticari yasak). Kullanıcı: "Kanalın tamamen para kazanmaya uyumlu olması gerekiyor."
**Kök neden:** yt-publish'in telif maddesi sadece müzik/görsel diyor; ses (TTS) modeli lisansı ve NC lisanslar açıkça yok. Ayrıca araç seçimi sırasında (yt-video / ses) lisans en başta kontrol edilmedi — deneme sonrası fark edildi.
**Önerilen değişiklik:** yt-publish kontrol listesine: "Ses/müzik/görsel/font/AI aracı lisansları [[Lisans ve Para Kazanma Kuralları]]'na uygun; NC yok; AI içerik açıklaması gerekiyorsa işaretlendi." + yt-video'ya: "Yeni bir araç/model seçmeden ÖNCE lisansını kontrol et."
**Kanıt:** Piper MODEL_CARD (dfki dataset: CC BY-NC-SA 4.0), kullanıcı mesajı 2026-11-17.
