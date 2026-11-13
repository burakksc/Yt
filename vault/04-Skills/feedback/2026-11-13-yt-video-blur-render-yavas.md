---
tags: [skill-feedback]
skill: yt-video
date: 2026-11-13
type: hata
severity: orta
status: uygulandı
---
# Feedback: yt-video — bulanık arka plan render'ı yavaşlatıyor
**Görev:** `Eksi100` (53 sn, 1080×1920) tam render.

**Ne oldu:** Render 10 dakikayı aştı. Her karede sahne SVG'si iki kez çiziliyor; biri 3414×1920 boyutunda ve üstüne `blur(40px)` uygulanıyor.

**Kök neden:** Skill'de render performansı için kural yok.

**Önerilen değişiklik:** yt-video kurallarına: "Dikey videoda bulanık arka plan kopyası küçük çizilip ölçeklenir (ör. %25 boyut + `scale(4)` + küçük blur); büyük elemana büyük blur yasak. Final render öncesi `--frames=0-90` ile kısa bir süre ölçümü yap."

**Kanıt:** Bu oturumdaki render süresi (>600 sn zaman aşımı).

**Kodda denenen çözüm:** Arka plan kopyası 1/4 boyutta (854×480) çizilip `scale(4.3)` + `blur(10px)` yapıldı → 4 çekirdekte ~0,45 sn/kare (53 sn video ≈ 12 dk). Görsel fark yok. Skill'e henüz işlenmedi (skill-trainer bekliyor).

**Uygulandı:** yt-video v1.1.0 (2026-11-13). Eval: eski 3/7 → yeni 7/7.
