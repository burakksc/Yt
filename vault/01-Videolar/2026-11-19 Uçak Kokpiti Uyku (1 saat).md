---
tür: cozy-uyku (1 saat)
durum: ses seçildi, görsel bekliyor
---
# Uçak kokpiti uyku videosu
- **Ses (kullanıcı seçimi):** `make_texture.py sleep_deep` = "çok derin yumuşak". Kahverengi gürültü 20–180 Hz, yavaş dalgalanma, -26 LUFS. İkaz tonu yok, cızırtı yok.
- Reddedilenler: Mixkit 1590/1574 (gerçek kayıt), sentez yolcu kabini, sentez kokpit + ikaz tonu ("4 olmaz, çok yoğun; uyku için").
- Sıradaki: kokpit görseli için seçenekler (gece uçuşu, gösterge ışıkları, camdan bulutlar/yıldızlar), 40 sn önizleme, sonra 1 saat.
- Görsel seçenekleri (2026-11-19): `projects/kokpit/ai_A/B/C.png` (SDXL) + gerçek CC0 (rawpixel filigranlı, düşük çöz.) → sayfa `video/out/kokpit-secenekler.jpg`.
- **Yön değişti (2026-11-19):** kokpit değil → yolcu kabini, "3D render". Referans: Dream Airlines "Best Sleep Ever [DARK CABIN]" (pencere kenarı POV, karanlık kabin, dışarıda şehir ışıkları/yıldızlar, motor, yanda uçuş haritası). Kopyalamadan kendi tasarımımız.
- Uygulama: `scripts/3d/models/window_seat.py` (Blender, film_transparent → gökyüzü sonradan) + `scripts/ambience/flight_composite.py` (yıldız, samanyolu, 60 sn periyodik akan bulut, motor strobu, NASA Blue Marble ile İstanbul→Tokyo harita ekranı).
- Ses: sleep_deep uğultu + piyano **4 = Mixkit "Silent Descent"** (kullanıcı "4 iyi"), çok kısık.
- Business class 3D koridor görünümü (`business_cabin.py`) stil testi olarak kaldı.
