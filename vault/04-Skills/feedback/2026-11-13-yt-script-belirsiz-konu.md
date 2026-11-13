---
tags: [skill-feedback]
skill: yt-script
date: 2026-11-13
type: kullanıcı-düzeltmesi
severity: yüksek
status: açık
---
# Feedback: yt-script — belirsiz konuyu sormadan yanlış anlamı seçtim
**Görev:** "Sling bağlama methodlarıyla ilgili video oluştur, tüm yöntemleri anlat."

**Ne oldu:** "Sling" kelimesini vinç/yük kaldırma (rigging) olarak yorumlayıp tam video ürettim. Kullanıcı: "Bebek için sling bağlama… o sling bu sling değil… anne bebek ile ilgili sling", "Dur çok yanlış oldu". Render iptal edildi, iş boşa gitti.

**Kök neden:** Birden çok anlamı olan konu terimi (sling = yük askısı / bebek taşıma sargısı) için yorum sessizce seçildi. Kanal bağlamı (Marka Rehberi/Kanal Kimliği boş) yön vermiyordu. karpathy-guidelines "birden fazla yorum varsa sor" diyor; uygulanmadı.

**Önerilen değişiklik:** yt-script (ve yt-idea) başına: "Konu terimi birden fazla anlama gelebiliyorsa (ör. sling, mouse, crane…) senaryodan önce tek cümleyle hangisi olduğunu sor; kanal kimliği/geçmiş videolar netleştirmiyorsa varsayma." + eval vakası.

**Kanıt:** Kullanıcı mesajları (2026-11-13); iptal edilen `SlingBaglama` (rigging) kompozisyonu.
