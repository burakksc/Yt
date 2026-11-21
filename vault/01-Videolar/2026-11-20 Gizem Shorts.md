---
tür: shorts (EN, Michael)
durum: render
composition: GizemBloop / GizemTaos / GizemWow / GizemVoynich (video/src/videos/gizem, veri projects/gizem/stories.json)
---
# Gizem Shorts (2026-11-20)
- Kullanıcı seçti: Bloop, Taos Hum, Wow! sinyali, Voynich. Altyazı küçük (58 px, kullanıcı: "anlatım var, altyazı küçük olabilir").
- Görseller: NOAA Bloop kaydı + spektrogram (PD), Bloop harita (Nojhan CC BY-SA 3.0), Taos fotoğrafları (Doug Kerr CC BY-SA 2.0), Wow çıktısı (Big Ear/NAAPO, Commons PD), Voynich sayfaları (PD). Flickr/Commons 429 → buz/okyanus/teleskop sahneleri SDXL.
- Kullanıcı Taos'u **3D render tarzında** istedi → projects/gizem/taos3d (SDXL "3D render").
- Sıradaki istekler: ağaç reçinesi hayatta kalma videosu (kullanıcı fikirleri yazacak), deniz altı ilginç olaylar araştırması, dönmeyen uzay araçları videosu.
- Eklenenler: Voyager & New Horizons (NASA PD), Pine Resin (SDXL; Commons 429), Engine HP (SDXL), Yonaguni (SDXL). Build: scripts/media/gizem_build.py <slug> <imgdir> <Comp>.
- Sıradaki: "simple bilgiler" serisi (EN): ör. arabaya yağ nasıl doldurulur (motor soğuk olmalı vb.).
- Kullanıcı (2026-11-21): araba videoları (Engine HP, Engine Oil) 'olmamış, saçma sapan görseller' → SDXL araba/motor görselleri kötü. Araba konularında AI görsel KULLANMA; gerçek fotoğraf (Commons/CC) ya da gerçek video bul.

## Gizem Shorts 2 (2026-11-21): Svalbard, Yamantau, Star Dust, Bermuda/Flight 19
- Kompozisyonlar: `GizemSvalbard` (56.8 sn), `GizemYamantau` (58.9 sn), `GizemStardust` (58.4 sn), `GizemBermuda` (57.9 sn). Çıktı: `video/out/gizem-<slug>-en.mp4`. Veri: `projects/gizem/stories.json`, görseller `projects/gizem/<slug>/img/`, ekranda görsel başına kredi satırı (`stories.ts` credits).
- Metinler (başlık/açıklama/etiket): [[2026-11-21 Gizem Shorts 2 - Metinler]].
- **Görsel lisansları:** hepsi gerçek fotoğraf/harita, AI yok. Flickr CC BY 2.0 / CC BY-SA 2.0 (the tinz, Dag Endresen, Christopher Michel, Kitty Terwolbeck, CIAT, JIRCAS, Aleksandr Zykov, Pawel Maryanov, Borya, archer10, John Brighenti, alonso_inostrosa, Jorge Lascar, mrbill, formulanone, Aztlek, Armchair Aviator, Eric Friedebach, milan.boers, luke_wes), Flickr kamu malı (Smithsonian NASM PBM Mariner, aeroman3 PBM-3), Commons: Lancastrian VH742 (RuthAS, CC BY 3.0), Mount Tupungato (Diode, CC BY-SA 3.0), Flight 19 haritası (Merikanto, CC BY-SA 4.0).
- Yamantau: tesisin fotoğrafı yok → Güney Urallar manzaraları + "illustrative" etiketli başka bir Soğuk Savaş sığınağı tüneli. Amaç doğrulanmadı diye anlatımda açıkça söylendi.
- Star Dust: gerçek Star Dust (G-AGWH) fotoğrafı bulunamadı → aynı tip Lancastrian (VH742) fotoğrafı, kredi satırında "same type" yazıyor.
- Bermuda: twist = Coast Guard + Lloyd's: bölge diğer yoğun deniz alanlarından daha tehlikeli değil.
- Kaynaklar: NordGen/Crop Trust/regjeringen (Svalbard), Congressional Record 1997 + NYT 1996 + RFE/RL (Yamantau), Arjantin Hava Kuvvetleri 2000 + NOVA (Star Dust), NHHC H-Gram 057-4 + NARA + NOAA (Flight 19).
- Teknik dersler: Commons API 429 (upload.wikimedia thumb'ları ara sıra 200 dönüyor, 4 sn arayla denenebilir); Openverse `source=flickr` + `live.staticflickr.com/..._b.jpg` sorunsuz. Kokoro 0.92 hızda ~2.1 kelime/sn → 7 sahne için ≤110 kelime hedefle (≤60 sn). Paralel render'larda Chrome OOM → `--concurrency=2`. Kare (kare-ish) haritayı pad'leyerek yatay yap, yoksa altyazıyla çakışıyor.
