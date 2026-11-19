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

## Malzeme bulma (kullanıcı veri vermiyor — 2026-11-17)
- `scripts/media/find_commons.py --q "<arama>" --n 8 --out <klasör>` → Wikimedia Commons; sadece kamu malı / CC0 / CC BY / CC BY-SA; `candidates.json` (atıf metni hazır) + numaralı `sheet.jpg`.
- `scripts/media/find_images.py` → Openverse (güvenilmez: 401/424/500 hataları sık).
- Ağ: commons.wikimedia.org, upload.wikimedia.org, **thumb.wikimedia.org** (önizlemeler), api.openverse.org. Wikimedia önizleme genişliği standart olmalı (500 ✓, 480 ✗ → HTTP 400). Paylaşımlı IP'de 429 → bekle-tekrar dene.
- Sonuç: tarihî konular için **kamu malı tablolar çok iyi** (Aivazovsky, Ziem, Duchetti 1570 haritası…). Cozy için Commons fotoğrafları **yetersiz** (belgesel/ışıksız şömineler) → serbest stok (Pexels/Pixabay) veya AI gerekir.

Araçlar: `scripts/ambience/make_rain_ambience.py`, `scripts/ambience/build_loop_video.sh`. Örnek: [[2026-11-13 Cozy Alley Rain 1 Saat]]

Bkz: [[Bilgi MOC]], [[Remotion Notları]]

## 2026-11-19 — Cozy oda videoları (Noel, New York B/F)
- Görsel: SDXL fotogerçekçi oda (projects/cozy-noel, projects/cozy-nyc) → `CozyRoom` (video/src/videos/cozy-room): gerçek alev pikselleri SVG displacement ile dalgalanıyor, mumlar titriyor, pencere camı maskesiyle (geometrik çıta/kemer maskesi) 3 katman kar.
- Ses: `scripts/audio/make_fire_ambience.py` (çıtırtı + alçak piyano + rüzgâr, `--city` şehir uğultusu, `--fire 0` şöminesiz). Kullanıcı şömine sesini beğendi.
- Üretim: `scripts/ambience/cozy_pipeline.sh` → `make_cozy_hour.sh` (12 parça render, düşük bellekli döngü geçişi, 1 saat tek geçişte veryfast kodlama, ardışık kare eklem kontrolü) → `scripts/media/split_for_send.sh` (380 MiB parça + .bat/.command + sha256).
- **Ders:** bulut makinesi oturum boşta kalınca uyuyor/yeniden başlıyor → uzun işler sadece aktif turda ilerliyor; işleri kısa, devam ettirilebilir adımlara böl ve turda bekleyerek takip et.
- Sonuç: Noel 1,03 GB, NY-B 1,8 GB, NY-F 1,2 GB; 108.000 kare, eklemlerde tekrar kare yok.

## 2026-11-19 — Yeni 4K cozy hattı (Cozy Vesper kalitesi)
- Eski SVG-warp ateş **reddedildi** ("komedi"). Yerine: `scripts/ambience/cozy_composite.py`, yani Real-ESRGAN 4K oda + **gerçek ateş videosu** (Mixkit Free License, atıfsız, ticari OK) şömine maskesine + ateşe bağlı oda ışığı + sadece parlaklık/hale mum titremesi + pencere maskeli kar. Hareketlerin hepsi 60 sn periyodik.
- Mixkit 2707 klibinde kamera yavaşça zoom yapıyordu, bu yüzden döngüde kütükler çift göründü. ORB + affine ile frame 0'a **stabilize** et, sonra 1 sn çapraz geçiş yap; 225 kare = 60 sn'de 8 tur.
- Ses: kullanıcı uğultuyu istemedi → `make_fire_ambience.py --roar 0` (sadece çıtırtı + kısık piyano).
- **Teslim: tek parça.** Kullanıcı parça/birleştirme istemiyor ("çalışmıyor"). `make_cozy_hour_4k.sh` şunu yapıyor: döngüyü bir kez x265 slow crf 32 kapalı GOP ile kodla, sonra 60× stream-copy concat + AAC 96k. Çıktı 1 saat 4K ≈ 367 MB (<400 MiB). Döngü geçişindeki fark, iç keyframe sıçramasıyla aynı (0.67 vs 0.64); kopya kare yok.
- Önce 40 sn önizleme → onay → 1 saat (kural).
- **Teslim linki (2026-11-19):** Kullanıcı büyük dosyayı uygulamadan indiremedi. Çözüm: videoyu `teslim/` klasörüne koy (git LFS, `teslim/*.mp4`), dala push et, kullanıcıya GitHub linkini ver: `https://github.com/burakksc/Yt/raw/<dal>/teslim/<dosya>.mp4`. Ortama `lfs.github.com` eklendi. LFS kotasını izle; yüklenen eski videoları sonra sil.
