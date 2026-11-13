---
tags: [bilgi, ambiyans, remotion, ses]
---
# Ambiyans videoları (uzun döngü + tekrarsız ses)
**Özet:** Uzun (1–10 saat) ambiyans videosunda görüntüyü kısa **kusursuz döngü** olarak render et, sesi **tekrarsız ve tam uzunlukta** ayrı üret, sonra ffmpeg ile `-c copy` birleştir. 1 saati Remotion'da render etmek saatler sürer; döngü yöntemiyle ~10 dk.

## Kurallar
- Döngü uzunluğu L kare ise her hareketin periyodu L'yi tam bölmeli: `sin(2π·k·f/L)` (k tam sayı), parçacıklar `(y0 + f·k·H/L) mod H`, rastgele olaylar `cycle = floor((f+shift)/P) mod (L/P)`.
- Döngüyü doğrula: kare L-1 → 0 farkı, ardışık kare farkına eşit olmalı.
- Ses döngü yapılmaz (kulak tekrarı hemen fark eder); olaylar (gök gürültüsü, araba) rastgele zamanlı. Görsel şimşek kullanılacaksa sesle senkron olmalı → döngülü videoda **görsel şimşek yok**, gök gürültüsü "uzak" tutulur.
- Olay seslerinin duyulup duyulmadığını **ölç**: ilgili frekans bandında medyana göre dB (gök gürültüsü 30–150 Hz ≥ +8 dB, araba 800–3000 Hz ≥ +3 dB).
- Ambiyans için hedef ~-18 LUFS, limiter ile.
- Kodlama: kapalı GOP (`-g 60 -sc_threshold 0 open-gop=0`) → kopyalar sorunsuz birleşir.

Araçlar: `scripts/ambience/make_rain_ambience.py`, `scripts/ambience/build_loop_video.sh`. Örnek: [[2026-11-13 Cozy Alley Rain 1 Saat]]

Bkz: [[Bilgi MOC]], [[Remotion Notları]]
