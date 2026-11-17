---
tags: [skill-feedback]
skill: yt-video
date: 2026-11-17
type: hata
severity: orta
status: açık
---
# Feedback: yt-video — render süresi yanlış tahmin, ilerleme görünmüyordu
**Görev:** `IstanbulAlti` (137 sn, 1080p) render.
**Ne oldu:** 60 karelik testi (giriş sahnesi, hafif) tüm videoya uygulayıp "~3 dk", sonra "15–20 dk" dedim; gerçek ~30 dk sürdü. Render `--log=error` ile başlatıldığı için ilerleme yüzdesi görülemedi; kullanıcı iki kez durumu sordu.
**Kök neden:** Süre ölçümü tek (en hafif) sahneden yapıldı; ağır sahneler (çok sayıda gradyan/glow, sütun ormanı) çok daha yavaş. İlerleme çıktısı kapatılmıştı.
**Önerilen değişiklik:** yt-video adım 5'e: "Süreyi **en ağır sahneden** ve en hafiften birer kısa aralıkla ölç, ortalamayı kullan; tahmini aralık olarak söyle. Uzun render'ı `--log=info` (ilerleme açık) ile arka planda başlat ve çıktıyı dosyaya yaz ki ilerleme sorulunca yüzde verilebilsin."
**Kanıt:** Bu oturum: test 60 kare/22 sn; tam render 13:23'te bitti (~30 dk).
