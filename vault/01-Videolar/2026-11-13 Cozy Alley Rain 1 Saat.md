---
tags: [video, ambiyans, uzun]
status: üretim
format: long
publish_date:
youtube_url:
remotion_comp: CozyAlleyLoop
skills_used: [yt-video]
---
# Cozy Alley Rain — 1 saat (yağmur, gök gürültüsü, uzak trafik)

## 1. Fikir
- Kullanıcının Google Flow (Nano Banana) ile ürettiği New York ara sokak fotoğrafı → hareketli, "backstreet ama cozy" 1 saatlik ambiyans videosu.
- İstek: yoğun yağmur sesi, arada gök gürültüsü, uzaktan araba sesleri; döngü (loop) olabilir.

## 4. Üretim
- **Görüntü:** Remotion `CozyAlleyLoop` (1920×1080, 30 fps, **60 sn kusursuz döngü**) → `video/src/videos/cozy-alley/index.tsx`
  - Katmanlar: 3 katman yağmur (lamba yakınında sıcak ışık alır), su birikintisi halkaları, rögardan buhar, lamba titremesi, uzak kırmızı neon, yerde lamba yansıması, çok yavaş kamera "nefesi", sıcak ton + vinyet.
  - Döngü kuralı: her animasyonun periyodu 1800 kareye tam bölünür. Kontrol: kare 1799→0 farkı (1,914) ≈ ardışık kare farkı (1,919) ✅
  - Kaynak görsel: ekran görüntüsünden kırpıldı (1220×680 → 1920×1080 büyütme). **Orijinal yüksek çözünürlüklü görsel gelirse** `video/public/cozy-alley/alley.png` değiştirilip yeniden render edilir.
- **Ses:** `scripts/ambience/make_rain_ambience.py` — tamamen sentez, telifsiz, **tekrarsız 60 dk**: yağmur (pembe+kahverengi+velvet gürültü, yavaş yoğunluk dalgası), 17 gök gürültüsü, 122 uzak araba geçişi (stereo pan + doppler), 7 çok uzak korna. -18 LUFS.
  - Seviye ayarı ölçümle yapıldı: ilk denemede gök gürültüsü/arabalar yağmurda kayboluyordu (+2 dB) → yağmur bas katmanı kısıldı → gök gürültüsü +11 dB, arabalar +4–7 dB.
- **Birleştirme:** `scripts/ambience/build_loop_video.sh <loop> <ses> 60 <çıktı>` (döngü bir kez H.264 kodlanır, 60 kez `-c copy` ile eklenir, ses eklenir).

## Teslim
- Kullanıcıya gönderilen: `cozy_alley_rain_1saat.mp4` — 60:00, 1920×1080, 376 MB (~0,78 Mbps video + 96k AAC). Sohbet sınırı nedeniyle düşük bit hızı.
- Daha kaliteli sürümler bu oturumun ortamında: 1,5 GB (3,2 Mbps) ve 3,4 GB. Ortam silinince kaybolur; kod + script'ler repoda, yeniden üretilebilir.
- Döngü geçişi doğrulandı: 1800. saniyedeki geçiş = sıradan anahtar kare farkı (4,27 vs 4,21), atlama yok.

Bkz: [[Videolar MOC]], [[Ambiyans Videoları]]
