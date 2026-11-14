---
name: yt-motion
description: Remotion'da "premium" hareket tasarımı tarifleri - bir nesnenin başka bir nesneye dönüşmesi (morph), animasyonlu grafik/sayaç (değerler birebir), kinetik tipografi, maskeli başlık, kart yığını; hareket-tut-dön zamanlaması, başlangıç hayaleti, kademeli gecikme ve kare-kesin kontrol. "Grafiği animasyonla göster", "sayı sayarak artsın", "şık geçiş", "motion graphics", "kinetik yazı", "premium görünsün", "bu sahne çok statik", "veri animasyonu" denildiğinde kullan. yt-video sahne üretirken çağırır.
metadata:
  version: 1.0.0
---
# YT Motion — Remotion'da Hareket Tarifleri

`yt-video` sahnenin **ne** olduğunu, bu skill sahnedeki hareketin **nasıl** pahalı görüneceğini söyler. Remotion API'si için `remotion-markup` (animasyon/geçiş) ve `remotion-best-practices`'i yükle; burası tarif ve kontrol listesidir.

## Önce hafıza
- `vault/02-Kanal/Marka Rehberi.md` — renk rolleri (zemin, yüzey, mürekkep, soluk, vurgu, 2. vurgu) ve font. Rehberde olmayan renk/font kullanma.
- `vault/03-Bilgi/Remotion Notları.md` → **Tuzaklar** (Türkçe büyük harf, blur maliyeti, `random(seed)`).
- Video notu "2. Araştırma" — ekrandaki her sayı/tarih/isim buradan gelir.

## Altın kurallar
1. **Tek nesne şekil değiştirir; solup yerine başkası gelmez.** Çubuk → çizgi, kart → pencere, buton → oynatıcı, sayı → grafik. İki görüntü arasında crossfade ucuz görünür.
2. **Başlangıç hayaleti:** dönüşen nesnenin çıktığı yerde soluk bir kontur/kesikli çizgi kalsın; göz hareketi takip etsin.
3. **Bir vuruş kademeli:** satırlar/harfler/çubuklar sırayla başlar (`delay = i * 3–5 kare`); hepsi birlikte hareket ederse slayt geçişi gibi okunur.
4. **Tutuşta hayat:** bitmiş durumda küçük bir şey canlı kalır (ilerleme çubuğu, ışık süpürmesi, imleç, hafif nefes ölçeği) — donmuş tutuş ölü görünür.
5. **Değerler kutsal:** grafik/sayaçtaki sayılar araştırmadaki değerlerle **karakter karakter** aynı. Yuvarlama, uydurma, "örnek" değer yok; örnek veri ise her karede görünür "temsili veri" etiketi.
6. **Tek saat:** her şey `useCurrentFrame()`'den türetilir (`interpolate`, `spring`, `Easing`). CSS animasyon/transition, `setTimeout`, `Math.random()` yasak (yt-video kuralı).
7. **Ölçekle, yeniden çizme:** efekti sabit 1920×1080 koordinatta tasarla, farklı en-boy oranına `scale`/SVG `viewBox` ile taşı (köşede küçük kalmasın).

## Zamanlama kalıbı (saniyeden kare: `sn * fps`)
| Faz | Döngülü (8 sn) | Anlatım altında (tek sefer) |
|---|---|---|
| Hareket | 0–2.2 sn, cubic in-out; erken 0–0.8 / orta 0.8–1.4 / geç 1.4–2.2 | Cümlenin anahtar kelimesinde başlar, ~1.4 sn |
| Tutuş | 2.2–6.6 sn (asıl bakılan yer) | Sahne sonuna kadar; asla cümle ortasında sıfırlanmaz |
| Dönüş | 6.6–8.0 sn, her şey yerine **kayarak** döner | Yok |
| Kontrol | kare 0 ≡ kare 8 sn (birebir) | Son kare = bitmiş durum |

Seslendirme varsa (voicestudio/whisper zaman damgaları) hareket başlangıcını kelime zamanına bağla; Shorts kesiminde 8 sn döngü yavaş kalır → sadece hareketi (~1.4 sn) kullan.

## Tarif menüsü
| Tarif | Ne zaman | Kilit ayrıntı |
|---|---|---|
| Çubuk → çizgi | Zaman içindeki değişim | Çubuklar soldan sağa incelir, çizgi aynı tepelerden **çizilerek** gelir (`strokeDashoffset`), son nokta vurgu rengi + değer etiketi |
| Sayaç | Tek çarpıcı sayı | `interpolate` + `Math.round`, `toLocaleString("tr-TR")` (binlik nokta), birim sabit; son değerde küçük ölçek vuruşu |
| Önce/sonra | Bir şeyin değişimi | Aynı kart, tarih çipi döner; iki ayrı kart değil |
| Maskeli başlık | Bölüm/seri adı | Harfler maskeden kademeli yükselir; `toLocaleUpperCase("tr-TR")` |
| Kart yığını | 3 örnek/olgu sırayla | Yaylı (`spring`) yığın, öndeki kart çıkarken arkadaki bir vuruş sonra öne gelir |
| Işaretleyici çağrı | Görüntüde bir şeyi adlandırma | Daire kendini çizer, sonra etiket; illüstrasyon üstünde maskotla birlikte |
| Izgara kırılması | "Hepsi aynı… biri hariç" | Eşit hücreler, eşit boşluk; tek hücre desenden ayrılır |
| Odak (cam) | Uzun metinde tek satır | Diğer satırlar soluklaşır + hafif blur (küçük elemanda; büyük blur yasak) |

Varsayılan görsel stilimiz (illüstrasyon + maskot) ile birleştir: tarif sahnenin **içinde** bir olay olsun (maskot grafiği tutar, sayaç maskotun tabelasında döner), tek başına infografik kart değil.

## Adımlar
1. Sahne başına tarif seç (menüden ≤1 ana hareket) ve video notunun "3. Senaryo" tablosuna `Hareket:` olarak yaz.
2. Bileşeni `video/src/videos/<slug>/scenes/` altında yaz; tekrar kullanılabilir olursa `video/src/components/` (ör. `BarToLine`, `Counter`) ve `Remotion Notları`'na ekle.
3. Fontu ilk kareden önce yükle (`@remotion/google-fonts` `loadFont()` veya `staticFile` + `delayRender`): ilk kare yedek fontla çizilmesin.
4. **Kare-kesin kontrol:** `npx remotion still <Id> out/m-<n>.png --frame=<f>` ile şu anları al ve **bak**: 0, hareket ortası, hareket sonu, tutuş ortası, (döngüde) son kare.
   - Hareket: ilk üç kare birbirinden farklı mı? (aynıysa bir parça çalışmıyor)
   - Döngü: kare 0 ve son kare aynı mı?
   - Tutuş ortası tek başına anlamı anlatıyor mu (thumbnail/duraklatma testi)?
   - Metin kutusundan taşıyor mu, Türkçe harfler doğru mu, sayılar araştırmayla aynı mı?
5. `npm run lint`, sonra kısa aralık render ile süre ölç (yt-video adım 5).

## Kalite kriterleri
- Her hareketli sahnede ≥1 "tek nesne dönüşümü"; crossfade ile değişen içerik yok.
- Kademeli gecikme var; tutuşta küçük bir canlı öğe var.
- Ekrandaki her sayı/tarih/isim video notundaki kaynakla birebir; temsili veri etiketli.
- Kontrol kareleri alındı ve incelendi (0 / orta / son / tutuş / döngü sonu).
- CSS animasyonu, `Math.random()`, büyük elemana büyük blur yok; renk ve font Marka Rehberi'nden.

## Sonra
Yeni ortak bileşen → `Remotion Notları` (ad + ne işe yarar). Yeni tuzak → `Remotion Notları > Tuzaklar`. Video notu "4. Üretim"e kullanılan tarifler. `vault-memory` → `retro`.

## Öğrenilenler
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-14): ilk sürüm (staging). "Tek nesne şekil değiştirir", başlangıç hayaleti, kademeli vuruş, canlı tutuş, hareket/tutuş/dönüş saati ve kare-kesin kontrol anları charlie947/motion-graphics-skills (`motion-effects`, `animated-chart`, `vox-explainer`; MIT — GitHub meta verisi) fikirlerinden öğrenildi. Kaynak HTML + `window.seek()` + HyperFrames dışa aktarımı kullanıyor; burada tamamen Remotion (`useCurrentFrame`, `remotion still`), Marka Rehberi ve illüstrasyon+maskot stilimize göre yeniden yazıldı, metin kopyalanmadı. SkillSpector statik: yalnız MEDIUM (sabitlenmemiş `npx` atıfları). — kaynak: [[Skill Araştırması 2026-11]]
