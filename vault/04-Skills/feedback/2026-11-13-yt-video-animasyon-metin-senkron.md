---
tags: [skill-feedback]
skill: yt-video
date: 2026-11-13
type: hata
severity: orta
status: açık
---
# Feedback: yt-video — animasyon adımları metinle eşleşmedi
**Görev:** `SlingBaglama` açı sahnesi (seslendirmesiz, kelime vurgulu ekran yazısı).

**Ne oldu:** Animasyon 60° → 45° → 30° → 22° gidiyordu, metin ise sadece 60° ve 30°'den bahsediyordu. Kontrol karesinde altyazı "30 DERECEDE TAMAMINI" derken ekranda 41° görünüyordu. Animasyon 60°→30°→22° yapılıp metnin kelime zamanlamasına göre (≈%35 / %60) hizalandı.

**Kök neden:** Skill'de "ekrandaki sayı/gösterge, o anda okunan kelimeyle aynı olmalı" kuralı yok; sahne animasyonu metinden bağımsız tasarlandı.

**Önerilen değişiklik:** yt-video kurallarına: "Metinde sayı/adım geçen sahnelerde animasyon anahtar karelerini metnin kelime zamanlamasına bağla; metinde olmayan ara adım gösterme. Kontrol karesini o kelimenin ekranda olduğu kareden al."

**Kanıt:** `out/sling/sheet2.png` (41° + "30 DERECEDE") ve düzeltilmiş `sheet3.png`.
