---
skill: yt-video
tarih: 2026-11-19
tür: kullanıcı düzeltmesi
---
# Uzun videoyu parçalı gönderme; tek parça 4K
- Kullanıcı: "daha basit bir birleştirme... çalışmıyor" → "tek parça 4k istiyorum".
- Ders: 1 saatlik ambiyansı **tek dosya <400 MiB** teslim et: periyodik 60 sn döngü → x265 slow crf ~32 (kapalı GOP) → 60× stream copy + AAC 96k. Parça+birleştirme son çare.
- Ses: "uğultu" istenmiyor → fire ambience `--roar 0`.
- AI tablo yüzleri (kedi) bozuk olabilir → son karede yüzlere yakından bak.
- Ses (kullanıcı tek tek dinleyip seçti): **cızırtı/tıslama (2.5–9 kHz gürültü) "ıslık" gibi duyuluyor → kaldır** (`--hiss 0`); odun patlamaları az olsun (`--pops 0.12`); uğultu yok (`--roar 0`). Kalan: çıtırtı + az patlama + çok kısık piyano. Ses AAC 128k.
- Kullanıcı bir ses şikâyet edince: katmanları ayrı 20 sn'lik mp3'ler halinde gönder, kullanıcı seçsin (`video/out/cozy/sesler/`).
