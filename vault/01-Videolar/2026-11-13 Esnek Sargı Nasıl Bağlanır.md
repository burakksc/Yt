---
tags: [video, shorts, ebelik, anne-bebek, ogretici]
status: üretim
format: short
publish_date:
youtube_url:
remotion_comp: EsnekSargi
skills_used: [yt-research, yt-script, yt-video]
---
# Esnek Sargı Nasıl Bağlanır? — cep çapraz bağlama (Shorts, 65,5 sn)

## 1. Fikir
- Kullanıcı: "Sadece kumaş slingi bağlamayı anlatır mısın" → **sorduk** (ders: [[2026-11-13-yt-script-belirsiz-konu]]): cevap **esnek sargı**, **adım adım öğretici**.
- Önceki genel video: [[2026-11-13 Bebek Slingi Bağlama Yöntemleri]].

## 2. Araştırma
Sıra (kaynaklar uyumlu): ortayı bele/göğse → arkada çaprazla → karşı omuzlardan öne → sarkan uçları yatay bandın altından geçir → önde çaprazla, arkada (çift) düğüm → bebeği çapraz bantlardan geçir (M) → bantları dizden dize yay → cebi bebeğin sırtına, küçük/uyuyan bebekte enseye kadar çek. Esnek sargı **sadece önde** taşıma; yüz açık; sarkarsa yeniden bağla.
- [Baby on the Move — stretchy wrap guide](https://www.babyonthemove.co.nz/guide-to-using-a-stretchy-wrap)
- [Wise Baby Choices — front wrap cross carry](https://wisebabychoices.com/blog/basic-front-wrap-cross-carry-knit-stretch-wraps/)
- [NCT — PWCC newborn](https://lancashireinfantfeeding-admin.nct.org.uk/node/115)
- [Aeroflow — knit wraps](https://aeroflowbreastpumps.com/care-guides/how-to-use-knit-wraps)

## 4. Üretim
- Kompozisyon `EsnekSargi` → `video/src/videos/esnek-sargi/` (`story.ts` metin + cue kelimeleri, `wrap.tsx` sargı durum modeli, `index.tsx` sahneler).
- Sargı tek bir **durum modeli** (`WrapState`: band, drapes, tucked, frontX, waist, baby, babyIn, spread, pocketUp…) — her sahne bir önceki adımın bittiği yerden başlar; her geçiş caption cue kelimesinde başlar.
- Annenin **arka görünümü** eklendi (`Person view="back"`): sırtta çapraz ve çift düğüm adımları için, "dönme" animasyonuyla.
- Kontrol karesinde yakalanan hata: çapraz bantlar bebeğin **başının üstünden** geçiyordu (yanlış + "yüz açık" mesajıyla çelişki) → bantlar başın yanından inip aşağıda çaprazlanacak şekilde düzeltildi.

Bkz: [[Videolar MOC]]
