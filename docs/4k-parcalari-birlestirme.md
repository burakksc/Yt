# Cozy Alley 4K — 19 parçayı birleştirme

Dosyalar: `cozy_alley_rain_4k_60dk.mp4.001` … `.019` (hepsi aynı klasörde olmalı).
Sonuç: `cozy_alley_rain_4k_60dk.mp4` — 7.376.040.751 bayt (≈6,87 GB), 3840×2160, 1 saat.

## Windows (en kolay: 7-Zip, ücretsiz)
1. `.001` dosyasına sağ tık → **7-Zip → Combine files…** (Dosyaları birleştir) → OK.

## Windows (ek program olmadan)
Klasörde adres çubuğuna `cmd` yazıp Enter, sonra:
```
copy /b cozy_alley_rain_4k_60dk.mp4.0* cozy_alley_rain_4k_60dk.mp4
```

## Mac / Linux
Terminalde klasöre gidip:
```
cat cozy_alley_rain_4k_60dk.mp4.0* > cozy_alley_rain_4k_60dk.mp4
```

## Kontrol (isteğe bağlı)
Boyut tam 7.376.040.751 bayt olmalı. SHA-256:
`87aa64599a7ce550c035c22c850025724e32dfb8a2074780a03d90b3e7e916b8`
(Windows: `certutil -hashfile cozy_alley_rain_4k_60dk.mp4 SHA256`)

Birleşen dosyayı YouTube'a yükle; parçaları sonra silebilirsin.
