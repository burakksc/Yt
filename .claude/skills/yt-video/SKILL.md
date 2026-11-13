---
name: yt-video
description: Senaryodan Remotion ile video üretme (long-form 16:9 ve Shorts 9:16) - sahne kompozisyonu, animasyon, ses, altyazı, render. "Videoyu yap", "render al", "sahne ekle", "Remotion'da yap", "intro yap" denildiğinde kullan. Resmi remotion-* skill'lerini proje kurallarıyla birleştirir.
metadata:
  version: 1.1.0
---
# YT Video — Remotion ile Üretim

Proje: `video/`. Bu skill bizim **proje kurallarımızdır**; Remotion API detayları için resmi skill'leri yükle:
- Genel yönlendirici: `remotion-best-practices`
- Markup/animasyon/geçiş/ses: `remotion-markup`
- Altyazı: `remotion-captions` · Render: `remotion-render` · Önizleme: `remotion-studio`

## Önce hafıza
- Video notu "3. Senaryo" (sahne tablosu).
- `vault/02-Kanal/Marka Rehberi.md` (renk/font/güvenli alan, **görsel stil ve maskot**).
- `vault/03-Bilgi/Remotion Notları.md` (komutlar + **Tuzaklar** — mutlaka oku).

## Proje kuralları
- Her video kendi klasöründe: `video/src/videos/<slug>/` → `index.tsx` (ana bileşen) + `scenes/*.tsx`.
- Tekrar kullanılan parçalar `video/src/components/` (ör. `TitleCard`). Yeni ortak bileşen yazdıysan `Remotion Notları`'na ekle.
- Her video `Root.tsx`'e kendi `<Composition>` JSX düğümüyle eklenir; `id` = PascalCase slug; `defaultProps` inline obje.
- 16:9 → 1920×1080; Shorts → 1080×1920; 30 fps.
- Assetler `video/public/<slug>/` altında, `staticFile()` ile.
- Süreleri saniyeden hesapla: `durationInFrames = sn * fps`. Sihirli kare sayısı yazma.
- Animasyonlar `useCurrentFrame` + `spring/interpolate`; CSS transition/animation **yasak**.

## Görsel stil (kullanıcı tercihi — varsayılan)
- **Tam ekran, katmanlı illüstrasyon + hikâye + maskot karakter.** Kart/rozet/ikon infografik stili kullanıcı tarafından "çok basit" diye reddedildi; açıkça istenmedikçe kullanma.
- Arka plan hibrit: AI görsel (`public/<slug>/bg/<sahne>.png`, prompt'ları biz yazıp video notuna koyarız) + üstte kodla animasyon (karakter, kar, ışık, kamera). Görsel yoksa zengin SVG yedek çizim; dosya gelince `getStaticFiles()` ile otomatik devreye girer. Örnek: `video/src/videos/eksi-100-hikaye/`.
- Yeni bir video tipinde (yeni seri, yeni format veya Marka Rehberi'nde olmayan bir görsel dil) tam üretime geçmeden önce **1 sahnelik stil testi** (kontrol karesi) göster, onay al. Mevcut serinin yeni bölümünde gerekmez.

## 9:16 dikey bölge planı (1080×1920)
| Bölge | y (px) |
|---|---|
| Boş (Shorts üst arayüzü) | 0–140 |
| HUD (sıcaklık/saat vb.) | ~150 |
| Ana aksiyon, karakter yüzleri | 300–1420 |
| Altyazı | 1480–1700 |
| Boş (Shorts başlık/kanal adı) | son ~220 |

## Girdi bir referans video ise
1. `ffprobe` → çözünürlük, süre, fps, ses.
2. `ffmpeg -i ref.mp4 -vf "fps=1,scale=288:-1,tile=6x2" sheet_%02d.png` → kontak sayfaları; sahne sınırlarını ve metinleri çıkar.
3. Birkaç kareyi tam çözünürlükte al → yerleşim ölçüleri (oran olarak).
4. Ses: `volumedetect` + `showspectrumpic` → konuşma mı, müzik mi, ambiyans mı.
5. Sahne tablosunu video notuna yaz; kullanıcıya **"birebir mi, bizim stile mi uyarlansın?"** diye sor (referans genelde içerik içindir, stil için değil).

## Adımlar
1. Senaryo tablosundaki her satır → bir sahne (`<Sequence>` / `TransitionSeries`).
2. Kompozisyonu kaydet, `npm run lint` geçir.
3. Kontrol kareleri: her sahnenin ortasından `npx remotion still <Id> out/check-<n>.png --frame=<f>` al, **görsel olarak kontrol et** (taşma, okunabilirlik, güvenli alan, **altyazı bir yüzü/ana nesneyi örtüyor mu**).
4. Kullanıcıya önizleme: `npm run dev` (Studio) ya da kontrol kareleri.
5. Süre ölçümü: `npx remotion render <Id> out/speed.mp4 --frames=0-89` → kare başı süreyi ölç, toplam render süresini kullanıcıya söyle. Çok yavaşsa önce optimize et (büyük elemana büyük `blur` yok: bulanık kopyayı küçük çizip `scale` ile büyüt).
6. Final: `npx remotion render <Id> out/<slug>.mp4` (uzunsa arka planda). `out/` git'e girmez. Bitince MP4'ü kullanıcıya gönder.

## Kalite kriterleri
- `npm run lint` hatasız.
- Hiçbir metin güvenli alan dışına taşmıyor (kontrol karelerinde doğrulandı).
- Toplam süre senaryo süresiyle uyumlu.
- Marka renk/font'u ve görsel stili (illüstrasyon + maskot) kullanılmış.
- 9:16'da altyazı hiçbir yüzü/ana nesneyi örtmüyor.

## Sonra
Video notu "4. Üretim" (komp. id, render komutu) + `status: üretim`. Yeni tuzak öğrenildiyse `Remotion Notları > Tuzaklar`. `vault-memory` → `retro`. Sıradaki: `yt-thumbnail`.

## Öğrenilenler
- Bulut ortamında render için `remotion.config.ts` `/opt/pw-browsers/chromium`'u kullanır; ayrıca indirme gerekmez. (2026-11-13)

## Changelog
- 1.1.0 (2026-11-13): Görsel stil varsayılanı (illüstrasyon+hikâye+maskot, hibrit AI arka plan, stil testi), 9:16 bölge planı, referans video analizi akışı, render süre ölçümü ve blur optimizasyonu, altyazı-yüz kontrolü. Eval E4–E7 eklendi. — kaynak: [[2026-11-13-yt-video-stil-cok-basit]], [[2026-11-13-yt-video-referanstan-yeniden-uretim]], [[2026-11-13-yt-video-blur-render-yavas]], [[2026-11-13-yt-video-altyazi-yuz-kapatiyor]]
- 1.0.0 (2026-11-13): ilk sürüm.
