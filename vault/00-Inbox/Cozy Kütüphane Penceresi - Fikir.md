---
tags: [fikir, cozy, ambiyans, referans]
date: 2026-11-14
status: fikir
---
# Fikir: Yağmurlu kütüphane penceresi + piyano (cozy, uzun video)

## Referans (kullanıcının TV'de izlediği bir video — sadece ilham, kopya değil)
- İç mekân: koyu ahşap kitaplıklar, eski deri ciltli kitaplar, yanan mum, buharı tüten çay fincanı, açık kitap, sarmaşık/bitki.
- Kemerli pencereden dışarısı: yağmur altında labirent gibi budanmış çit bahçesi, çakıl yol, sisli ağaçların önünde eski bir malikâne.
- Ses: **piyano** (yavaş, sakin) + yağmur.
- Kullanıcı yorumu: "Bu da güzel bir görsel cozy videolar için, arkada da piyano çalıyor." (2026-11-14)

## Bizim versiyonumuz (Cozy Alley tekniğiyle — bkz. [[Ambiyans Videoları]])
1. **Görsel:** Flow / Nano Banana ile özgün görsel (aşağıdaki prompt), 16:9, mümkünse 4K.
2. **Döngü animasyonu (Remotion, 60 sn kusursuz):** camda yağmur damlaları + dışarıda yağmur çizgileri, mum alevi titremesi + sıcak ışık, çaydan buhar, sisin yavaş kayması, kitap sayfasının hafif kıpırdaması, çok yavaş kamera nefesi.
3. **Ses (1 saat, tekrarsız):** yağmur + cama vuran damlalar + çok uzak gök gürültüsü (mevcut `make_rain_ambience.py`) + **piyano**.
   - Piyano: sentezle yapılan piyano yapay duyulur. Seçenekler: (a) YouTube Ses Kitaplığı / telifsiz lisanslı piyano parçaları (lisansı nota yaz), (b) kullanıcının kendi kaydı, (c) ücretli AI müzik (lisansı ticari kullanıma uygun olmalı). Karar kullanıcıda.
4. Birleştirme: `scripts/ambience/build_loop_video.sh` (4K için `make_cozy_4k.sh` mantığı).

## Flow prompt (özgün görsel için)
> Cozy old library window seat on a rainy day, view through a tall arched window onto a formal hedge-maze garden with a gravel path leading to a weathered stone manor, misty forest behind, soft gray rain light. Inside: dark wooden bookshelves full of old leather-bound books, a lit candle, a steaming cup of tea on a stack of books, an open book on the wooden desk, small potted plant. Warm candle light inside, cool green-gray light outside, cinematic, photorealistic, highly detailed, no people, no text, 16:9

Bkz: [[Videolar MOC]], [[2026-11-13 Cozy Alley Rain 1 Saat]]
