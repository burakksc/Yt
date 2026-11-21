---
skill: yt-shorts
tarih: 2026-11-21
tür: retro
---
# Gizem Shorts 2 (Svalbard, Yamantau, Star Dust, Flight 19) — gerçek görselle üretim
- İyi giden: 4 Short'un hepsi AI'sız, gerçek fotoğraf/haritayla yapıldı (Openverse `source=flickr` → `live.staticflickr.com/..._b.jpg` her zaman indi). Ekranda görsel başına kredi satırı + açıklamada link listesi.
- Commons: API ve çoğu upload 429; standart genişlikte thumb (`/thumb/.../960px-...`) açıklayıcı User-Agent ile 4 sn arayla bazen 200 dönüyor. Commons'ta tek olan görseller (ör. Lancastrian, Tupungato, Flight 19 haritası) bu yolla alındı.
- Araç/uçak konusunda gerçek tekil nesnenin (Star Dust G-AGWH) fotoğrafı yoksa: **aynı tip** gerçek fotoğraf + kredi satırında "same type" yaz. Yer fotoğrafı yoksa (Yamantau): bölge manzarası + "illustrative (not X)" etiketi.
- Süre: Kokoro am_michael 0.92 hızda ~2.1 kelime/sn; 7 sahne + 0.75 sn ara → **≤110 kelime** ≤60 sn veriyor. Hook ≤8 sn tut.
- Paralel ajan render'ları Chrome OOM yaptı → `npx remotion render ... --concurrency=2`.
- Kare haritayı `contain` modunda altyazı kesiyor → yatay pad'le (≤1500 px genişlik ki `contain` kalsın).
- Ortak scratchpad başka ajanlarla paylaşılıyor: yardımcı scriptleri kendine özel alt klasöre koy (dosya ezildi).
