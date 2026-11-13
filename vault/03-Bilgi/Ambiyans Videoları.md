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

## Teslim (dosya boyutu)
- Sohbete dosya gönderme sınırı **~400 MiB** (500 MiB yazsa da 472 MiB reddedildi). 1 saat 1080p bu sınıra ancak ~0,78 Mbps video + 96k ses ile sığar (376 MiB) — yağmur biraz yumuşar ama kabul edilebilir.
- Kalite sürümleri (bu ortamda, `video/out/cozy/`): 3,4 GB (crf 21), 1,5 GB (crf 25, 3,2 Mbps), 376 MB (teslim edilen).
- En iyi kalite için: kullanıcı kendi bilgisayarında `build_loop_video.sh` çalıştırır (döngü + ses dosyaları ile), ya da bulut depolama bağlantısı kullanılır.
- Döngü geçişi kontrolü sıkıştırılmış dosyada yapılırken **anahtar kare sıçramasıyla karıştırma**: geçişteki fark, döngü ortasındaki bir anahtar karedeki farkla karşılaştırılmalı.

## 4K
- `scripts/ambience/make_cozy_4k.sh [dakika]` — tek komut: döngüyü `--scale=2` ile 3840×2160 render eder, sesi üretir, birleştirir (crf 18, ≤45 Mbps). 1 saat ≈ 10–11 GB. Bu ortamda 2 sn'lik testle doğrulandı (3840×2160 + ses).
- Vektör katmanlar (yağmur, buhar, ışık) 4K'da keskin; **fotoğrafın netliği kaynak görsele bağlı** → orijinal yüksek çözünürlüklü görsel `video/public/cozy-alley/alley.png` olarak konmalı (`objectFit: cover`, 16:9).
- 10 GB'lık dosya sohbetten gönderilemez (~400 MB sınır) → 4K kullanıcının kendi bilgisayarında üretilir.

Araçlar: `scripts/ambience/make_rain_ambience.py`, `scripts/ambience/build_loop_video.sh`. Örnek: [[2026-11-13 Cozy Alley Rain 1 Saat]]

Bkz: [[Bilgi MOC]], [[Remotion Notları]]
