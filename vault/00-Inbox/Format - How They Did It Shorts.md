# Format isteği: "How They Did It" tarzı Shorts (2026-11-24)

Kullanıcı bu tarz videolar istiyor: https://youtube.com/shorts/rm58VUp5QD8
- Referans: kanal "HowTheyDidIt!", başlık "How Ancient Romans Gathered Deep Sea Materials #shorts".
- Bu ortamdan YouTube video indirme engelli (bot kontrolü); sadece oEmbed başlığı + kapak (i.ytimg.com) alınabildi. Video izlenemedi.
- Görsel dil (kapaktan): 9:16, fotogerçekçi AI sahne, sinematik ışık, tarihî "nasıl yapılırdı" konusu.
- Darboğaz: AI video üretimi (Veo/Kling/Seedance). Bu ortamda GPU yok; kullanıcı API anahtarı vermek istemiyor.
- Önerilen yollar: (A) kullanıcı Flow'da bizim hazır prompt'larımızla klip üretir, gerisi bizde; (B) tamamen bizde: Commons tabloları/fotoğrafları + 2.5D parallax + Remotion (AI yok).
- Riskler: AI sahnede tarihî yanlış (kapaktaki cam dalış çanı Roma için uydurma) → araştırma şart; YouTube "sentetik içerik" kutusu; seri üretilmiş AI içerik politikası → her bölümde özgün araştırma + kurgu.
- Karar: kullanıcıda (bekliyor).

## Test (2026-11-24)
- **3D (ücretsiz):** `TestDiver` (1080×1920, 5 sn) → `video/src/videos/test-diver/`. Su altı: kostik doku (canvas'ta üretilip bulanıklaştırılmış), ışık huzmeleri (additive koni), sis, balık sürüsü, kabarcık, deniz çayırı, iple tekneye bağlı dalgıç. Render ~1 dk / 5 sn. Zayıf nokta: insan figürü "tahta manken" gibi.
- **Wan 2.2 (ücretsiz HF Space):** ağ izni eklendi (`zerogpu-aoti-wan2-2-fp8da-aoti-faster.hf.space`, `black-forest-labs-flux-1-schnell.hf.space`). Anonim ZeroGPU kotası bu bulut IP'sinde dolu → **ücretsiz HF hesabı token'ı** gerekiyor. Betik: FLUX.1-schnell (ilk kare) → Wan 2.2 I2V (5 sn).
- **Wan 2.2 testi BAŞARILI (2026-11-24):** Kullanıcı ücretsiz HF hesabı açtı; token iki Space host'una ağ sırrı olarak kaydedildi (proxy ekliyor, kod token görmez). FLUX.1-schnell (576×1024) → Wan 2.2 I2V 5 sn, toplam ~1 dk. Çıktı 480×832 16 fps → ffmpeg lanczos ile 1080×1920 30 fps. Sonuç fotogerçekçi: tekne, ip, ışık huzmeleri, kabarcık, dalgıç doğal hareket. Betik: `scripts/ai/wan_test_diver.py`. Kalan: ücretsiz ZeroGPU günlük kotası (sahne sayısını sınırlar), çözünürlük düşük (yükseltme gerekli).
- **Kullanıcı onayı (2026-11-24):** Wan 2.2 dalgıç klibi için "güzel olmuş video". → Bu format için varsayılan yol: araştırma → FLUX ilk kare → Wan 2.2 I2V → ffmpeg 1080×1920 → Remotion (Türkçe yazı + sentez müzik). Prosedürel 3D insan kullanılmaz.
