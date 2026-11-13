---
tags: [video, shorts, egitim, is-guvenligi]
status: üretim
format: short
publish_date:
youtube_url:
remotion_comp: SlingBaglama
skills_used: [yt-research, yt-script, yt-video, karpathy-guidelines]
---
# Sling Bağlama Yöntemleri (Shorts, ~55 sn)

## 1. Fikir
- Kullanıcı isteği: "Sling bağlama yöntemleriyle ilgili ~1 dk video, tüm yöntemleri anlat." Yeni proje / yeni seri (eğitim, iş güvenliği).
- Vaat: "5 yöntem + 1 altın kural — 1 dakikada."

## 2. Araştırma (kaynaklı)
| İddia | Değer | Kaynak | Güven |
|---|---|---|---|
| Boğma (choker) kapasitesi | dik kapasitenin ~%75 (tel halat), sentetikte ~%80; boğma açısı ≥120° | [open-exam-prep NCCER](https://open-exam-prep.com/study-guides/nccer-rigger/slings-and-hitches/choker-hitch-reductions), üretici katalogları | orta-yüksek |
| Sepet (basket) | kollar dikse 2× (D/d şartıyla); 60°→%170, 45°→%140, 30°→%100 | Crosby/üretici katalogları, [ASME B30.9 özet](https://open-exam-prep.com/study-guides/nccco-rigger-level-1/technical-asme/asme-b30-slings-and-hooks) | orta-yüksek |
| Açı ve kol gerilmesi | 60° → 1,155 (kol başı %58), 45° → 1,414 (%71), 30° → 2,0 (%100) | [US Cargo Control](https://www.uscargocontrol.com/blogs/blog/calculating-sling-angles), [Becht](https://becht.com/becht-blog/entry/sling-angles-do-matter/) | yüksek (trigonometri) |
| 30° altı | önerilmez / mühendislik onayı olmadan yapılmaz | aynı kaynaklar | yüksek |
| 3–4 kollu bridle | yükü 2 kol taşıyormuş gibi hesapla (sektör pratiği) | [HHI Lifting](https://www.hhilifting.com/en/news/post/multi-leg-chain-sling-configurations-how-leg-count-affects-load-distribution), OSHA safe sling use | orta (ASME'de zorunlu mu tartışmalı → videoda "hesapla" denildi, "standart der ki" denmedi) |
| Çift sarım boğma | tam çevre teması, demet/boru kaymaz (nitel) | genel rigging pratiği | orta |

Not: Her slingin kendi etiketi/üretici tablosu esastır — açıklamaya yazılmalı.

## 3. Senaryo
`video/src/videos/sling/story.ts` — 8 sahne: giriş → dikey → boğma → sepet → çift sarım → çok kollu → açı kuralı → güvenlik + CTA. Seslendirme yok; ekran yazısı (kelime vurgulu) + müzik.

## 4. Üretim
- Kompozisyon `SlingBaglama` (1080×1920, 30 fps, 55,5 sn). Sahneler `scenes.tsx`, yazılar `story.ts`.
- Maskot "worker" kıyafetiyle (baret + reflektörlü yelek) — `Character` bileşenine `outfit` prop'u eklendi.
- Ortak bileşen: `video/src/components/WordCaptions.tsx` (TR büyük harf güvenli).
- Müzik: `scripts/audio/make_music_bed.py` (sentez, telifsiz, sahne geçişlerinde whoosh) → `public/sling/music.mp3`, -20 LUFS.
- Kontrol karelerinde düzeltilenler: sepet etiketleri rozet altında kalıyordu; açı sahnesinde 45° adımı metinde yoktu → animasyon metne senkronlandı (60°→30°→22°); kanca başlığa değiyordu.

Bkz: [[Videolar MOC]], [[Marka Rehberi]]
