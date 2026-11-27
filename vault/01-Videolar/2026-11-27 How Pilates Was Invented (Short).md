---
status: üretim
tarih: 2026-11-27
format: short 9:16, ~35 sn, EN ekran yazısı, seslendirme yok
---
# How Pilates Was Invented (Short)
Kullanıcı isteği: "Pilates nasıl bulundu" videosu, AI hareketli görsel yöntemiyle (FLUX → Wan 2.2).

## Araştırma
- Belgeli: 1883 Almanya doğumlu, hastalıklı çocuk (astım, raşitizm, romatizmal ateş — çok tekrarlanıyor, birincil belge zayıf); WWI'da İngiltere'de "enemy alien" olarak gözaltı (Lancaster → 1915 Knockaloe, Man Adası); 1926 New York, 939 8th Ave stüdyo; yöntemin adı "Contrology"; dansçılar müşteri.
- Belgesiz: hastane yataklarına yay bağlama (Knockaloe vakfı: kanıt yok) → videoda "THE STORY GOES…". 1918 grip efsanesi → kullanılmadı.
- Kaynaklar: en.wikipedia.org/wiki/Joseph_Pilates · nationalgeographic.com/premium/article/exercise-prisoner-war-camp-pilates · knockaloe.im/profile_428812.html · popsci.com/health/how-pilates-started/

## Üretim
- Komp. `PilatesShort` → `video/src/videos/pilates/` (`scenes.json` = prompt'lar). Üretim: `python3 -I scripts/ai/wan_scenes.py video/src/videos/pilates/scenes.json video/public/pilates/raw` (yapılanları atlar) → ffmpeg 1080×1920 30 fps → `public/pilates/<id>.mp4`.
- Müzik: `make_music_bed.py --seconds 35 --bpm 84 --whoosh 5,10,15,20,25,30 --seed 11`.
- Durum: s1–s4 hazır (önizleme 20 sn gönderildi). s5–s7 bekliyor: **ücretsiz ZeroGPU günlük kotası ~4 sahnede doldu** (her sahne ~58 sn GPU).
- Yayında: "değiştirilmiş veya sentetik içerik" işaretlenecek; ekranda "AI reconstruction" etiketi var.
