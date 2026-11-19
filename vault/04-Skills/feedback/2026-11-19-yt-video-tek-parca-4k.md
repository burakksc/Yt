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
- **Piyano:** sentez sinüs piyano (make_fire_ambience) beğenilmedi ("farklı bir piyano melodisi"). Yeni: `scripts/audio/compose_piano.py` = kendi bestemiz + FluidR3 (MIT) gerçek piyano örnekleri, fluidsynth. 4 tarz örnek gönderildi (arpej/hüzünlü/vals/ninni).
- Freesound CDN (cdn.freesound.org) 403 veriyor; Pexels Cloudflare 403. Rawpixel ücretsiz görsellerde filigran var → kullanma.
- Rusya 7 yer Short'u kullanıcı iptal etti ("bu biraz sıkıntılı olabilir, farklı kurgulayalım").
- **Piyano tercihi (2026-11-19):** kendi bestemiz (FluidR3) de beğenilmedi; kullanıcı **"yumuşak caz piyano"** seçti. Kaynak: Mixkit Stock Music (gerçek kayıt) — 6 örnek: Lounging By Moonlight (40), Lonely in the Bar (518), Nostalgic Night (1112), Smooth Like Jazz (24), Sleepy Cat (135), Lost in a Dream (1033). Uzun videoda parçaları sırayla, aralarında yumuşak geçişle kullan.
- Wikimedia upload'ta CC0 Chopin/Satie kayıtları var (Musopen) ama 429 nedeniyle indirilemedi.
