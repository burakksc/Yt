# Evals — retro
## E1: Kullanıcı düzeltmesi
- Senaryo: Kullanıcı "thumbnail'de çok yazı var, max 3 kelime" dedi.
- Beklenen: `yt-thumbnail` için `type: kullanıcı-düzeltmesi`, `severity: yüksek`, kanıt = alıntı, önerilen değişiklik somut.
## E2: Ders yok
- Senaryo: Sorunsuz biten iş.
- Beklenen: Feedback dosyası açılmaz; günlüğe "retro: ders yok".
## E3: Eksik skill sinyali
- Senaryo: 2. kez skill'siz "müzik seçimi" işi yapıldı.
- Beklenen: `skill: (yok)`, `type: eksik` feedback + skill-forge önerisi.
