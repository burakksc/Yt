---
tür: shorts (EN, Michael)
durum: render
composition: GizemSentinel / GizemSnakeIsland / GizemMetro2 / GizemDerinkuyu / GizemFlannan / GizemMaryCeleste (video/src/videos/gizem, veri projects/gizem/stories.json)
---
# Gizem Shorts 3 (2026-11-21): yasak/kayıp yerler ve gizemler
Metinler: [[2026-11-21 Gizem Shorts 3 - Metinler]] · Önceki: [[2026-11-20 Gizem Shorts]] · Paralel: [[2026-11-21 Gizem Shorts 4]]

## Yapılan
| Slug | Composition | Süre | Görsel sayısı |
|---|---|---|---|
| sentinel | GizemSentinel | ~58.7 s | 8 (havadan/uydu, kabile üyesi YOK) |
| snakeisland | GizemSnakeIsland | ~57.9 s | 8 |
| metro2 | GizemMetro2 | ~54.9 s | 8 |
| derinkuyu | GizemDerinkuyu | ~56.6 s | 8 |
| flannan | GizemFlannan | (bkz. Metinler) | 7 |
| maryceleste | GizemMaryCeleste | (bkz. Metinler) | 4 + 1861 tablosundan 2 kırpma |

- 8'er sahne, Kokoro am_michael (0.92). Kelime bütçesi: 8 sahnede ≤ ~115 kelime → ~57–59 s.
- Sentinel: saygılı dil, kabile üyesi fotoğrafı yok; yalnız uçaktan/uydudan ada görünümleri.
- Metro-2: her cümle "reportedly / is said to / never officially confirmed" ile.
- Flannan: "yarım kalmış yemek / devrik sandalye" Gibson'ın 1912 şiirinden, günlük kayıtları sonradan uydurma → videoda "resmî raporda yok" diye düzeltildi. Muirhead raporu: batı iskelesinde fırtına hasarı → dev dalga.
- Mary Celeste: araç/gemi için AI görsel YOK; 1861 "Amazon" tablosu (kamu malı) + kırpmalar, Gibraltar, deniz, Conan Doyle portresi (LoC, CC0).

## Kaynaklar (arama ile doğrulandı)
- Sentinel: ~60 km²; nüfus bilinmiyor (onlarca–birkaç yüz); 1956 kabile rezervi; 2004 tsunami sonrası helikoptere ok; 2006 iki balıkçı, 2018 ABD'li misyoner öldürüldü; "eyes-on, hands-off".
- Snake Island: São Paulo kıyısından ~33 km, ~43 ha; 2008 çalışması 2.000–4.000 yılan; sadece burada yaşar; Kritik tehlikede; deniz feneri 1909, 1920'lerde otomatik; bekçi ailesi efsanesi kanıtsız; sadece Donanma + izinli bilim insanı.
- Metro-2: FSB/Metro yönetimi ne doğruluyor ne yalanlıyor; D-6 kod adı söylentisi; ABD Savunma Bakanlığı raporunda diyagram; Bunker 42 ~65 m (müze).
- Derinkuyu: 1963 ev tadilatında duvar; ~85 m; "18 kat" bazı sayımlara göre; ~20.000 kişi + hayvan; ~yarım ton döner taş kapılar; Bizans döneminde (780–1180) genişletildi.
- Flannan: Eilean Mòr, Lewis'in 32 km batısı; 15 Ara Archtor ışığı yanmıyor gördü; Hesperus 26 Ara; Ducat, Marshall, MacArthur; bir takım muşamba içeride.
- Mary Celeste: 4 Ara 1872 (Britannica 5 Ara), Azorlar'ın ~400 mil doğusu; 1.701 varil alkol; 6 aylık erzak; filika yok; 10 kişi; Cebelitarık soruşturması; Conan Doyle 1884 "J. Habakuk Jephson's Statement".

## Lisans (hepsi ticari kullanıma uygun; tam linkler Metinler notunda)
- Ses: Kokoro-82M (Apache-2.0).
- Sentinel: PJeganathan (CC BY-SA 4.0) ×6, Medici82 (CC BY-SA 4.0), DLR_next (Public Domain Mark).
- Snake Island: Marinha do Brasil (CC BY-SA 2.0) ×3, Prefeitura de Itanhaém (CC BY 2.5), Nayeryouakim (CC BY-SA 4.0), Otavio A. Marques (CC BY 4.0) ×3.
- Metro-2: Moskova Hükümeti basın servisi (CC BY 4.0) ×2, ikhou (CC BY-SA 2.0), Trondheim byarkiv (CC BY 2.0) ×2, Phuketian.S, M1key.me, greg westfall (CC BY 2.0).
- Derinkuyu: Nevit Dilmen (CC BY-SA 3.0) ×6, Ali Weheda (CC BY-SA 2.0), Edgardo W. Olivera (CC BY 2.0).
- Flannan: Chris Downer / geograph (CC BY-SA 2.0) ×7.
- Mary Celeste: 1861 Amazon tablosu (kamu malı), kanu101 & M McBey (CC BY 2.0), LoC/Arnold Genthe (CC0).

## Teknik dersler
- Commons API ve orijinal dosyalar 429; **upload.wikimedia.org /thumb/ URL'leri curl ile çalışıyor (önbellekte olan boyutlar: çoğu zaman 960/1280/1920 veya 500/330/250)**. Python urllib aynı URL'de 429 alıyor → curl kullan.
- Openverse thumb proxy (`/thumb/?full_size=true`) Wikimedia için çoğunlukla 424.
- Scratchpad paylaşımlı: paralel ajanlar aynı `tools/` dosya adlarını ezdi → her ajan kendi alt klasörünü kullanmalı.
- Paralel render'larda rspack önbellek kilidi çakışıyor → `--bundle-cache=false`. Yük ~22 iken bir Shorts render'ı 30+ dk sürdü; render'ı `nohup setsid` ile başlat (arka plan görev limiti 30 dk).
