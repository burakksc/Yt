---
tags: [video, shorts, ebelik, anne-bebek]
status: üretim
format: short
publish_date:
youtube_url:
remotion_comp: BebekSling
skills_used: [yt-research, yt-script, yt-video, karpathy-guidelines]
---
# Bebek Slingi Bağlama Yöntemleri (Shorts, 57,5 sn) — ebe anlatıyor

## 1. Fikir
- Kullanıcı: "Annelerin bebeklerini bağlamada kullandıkları sling bağlama yöntemleri", "ebelik üzerinden git, anne ve çocuk temalı".
- Vaat: "Bebeğini güvenle taşımanın 5 yolu — ebe adım adım anlatıyor."
- Önceki yanlış yorum: [[2026-11-13 Sling Bağlama Yöntemleri]] (iptal).

## 2. Araştırma
| Bilgi | Kaynak | Güven |
|---|---|---|
| TICKS: Sıkı, görüş alanında, öpülecek yükseklikte, çene göğüsten uzak (2 parmak), sırt destekli | UK Consortium of Sling Manufacturers & Retailers; [NHS Fife](https://www.nhsfife.org/services/all-services/patient-advice/the-ticks-rule-for-safe-babywearing/), [babywearing.github.io](https://babywearing.github.io/static-md/safety.html) | yüksek |
| M pozisyonu (dizler kalçadan yukarıda), ilk ~6 ay içe dönük | [International Hip Dysplasia Institute](https://hipdysplasia.org/baby-wearing/) | yüksek |
| Taşıyıcı türleri: halkalı sling, esnek/dokuma sargı, mei tai, tokalı (SSC); halkalı sling ön/kalça taşıma için | [Ergobaby rehberi](https://ergobaby.com/blog/post/types-of-baby-carriers-and-how-to-wear-them), [Lamaze/BWI](https://lamaze.org/Giving-Birth-with-Confidence/GBWC-Post/babywearing-basics-and-safety-tips) | orta-yüksek |
| 0–3 ay için sargılar önerilir; tokalı taşıyıcı yenidoğana uygun olmayabilir (modele göre) | [Omega Pediatrics](https://www.omegapediatrics.com/baby-carriers-get-the-best-foryou-and-baby/) | orta |
| Sırt taşıma yaşı | **güvenilir kaynak bulunamadı** → videoda yaş verilmedi; "baş-boyun kontrolü + üretici talimatı + ilk denemeler yardımla" denildi | — |

## 3. Senaryo
`video/src/videos/bebek-sling/story.ts` — giriş → halkalı sling → esnek sargı → dokuma sargı (ön çapraz) → sırt bağlama → mei tai → TICKS kontrol listesi → M pozisyonu + kapanış. Seslendirme yok; ekran yazısı + ninni tarzı müzik.
- Her adım kartı/animasyon, adımın **kelimesi altyazıda göründüğü karede** başlar (`wordStartFrame`) — [[2026-11-13-yt-video-animasyon-metin-senkron]] dersinin uygulaması.
- Son sahnede not: "Genel bilgilendirmedir. Prematüre ya da özel durumlarda ebene/doktoruna danış."

## 4. Üretim
- Kompozisyon `BebekSling` (1080×1920, 30 fps). Yeni karakterler: anne, bebek (M pozisyonu bacaklar), ebe (önlük + bone + steteskop) → `people.tsx`. Taşıyıcı çizimleri adım adım oluşur.
- Stil: pastel bebek odası (mint/şeftali/krem), Nunito yazı tipi.
- Müzik: `scripts/audio/make_music_bed.py --bpm 76 --no-drums` (ninni hissi), telifsiz.

Bkz: [[Videolar MOC]], [[Marka Rehberi]]
