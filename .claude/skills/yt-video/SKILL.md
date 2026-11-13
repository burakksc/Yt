---
name: yt-video
description: Senaryodan Remotion ile video üretme (long-form 16:9 ve Shorts 9:16) - sahne kompozisyonu, animasyon, ses, altyazı, render. "Videoyu yap", "render al", "sahne ekle", "Remotion'da yap", "intro yap" denildiğinde kullan. Resmi remotion-* skill'lerini proje kurallarıyla birleştirir.
metadata:
  version: 1.0.0
---
# YT Video — Remotion ile Üretim

Proje: `video/`. Bu skill bizim **proje kurallarımızdır**; Remotion API detayları için resmi skill'leri yükle:
- Genel yönlendirici: `remotion-best-practices`
- Markup/animasyon/geçiş/ses: `remotion-markup`
- Altyazı: `remotion-captions` · Render: `remotion-render` · Önizleme: `remotion-studio`

## Önce hafıza
- Video notu "3. Senaryo" (sahne tablosu).
- `vault/02-Kanal/Marka Rehberi.md` (renk/font/güvenli alan).
- `vault/03-Bilgi/Remotion Notları.md` (komutlar + **Tuzaklar** — mutlaka oku).

## Proje kuralları
- Her video kendi klasöründe: `video/src/videos/<slug>/` → `index.tsx` (ana bileşen) + `scenes/*.tsx`.
- Tekrar kullanılan parçalar `video/src/components/` (ör. `TitleCard`). Yeni ortak bileşen yazdıysan `Remotion Notları`'na ekle.
- Her video `Root.tsx`'e kendi `<Composition>` JSX düğümüyle eklenir; `id` = PascalCase slug; `defaultProps` inline obje.
- 16:9 → 1920×1080; Shorts → 1080×1920; 30 fps.
- Assetler `video/public/<slug>/` altında, `staticFile()` ile.
- Süreleri saniyeden hesapla: `durationInFrames = sn * fps`. Sihirli kare sayısı yazma.
- Animasyonlar `useCurrentFrame` + `spring/interpolate`; CSS transition/animation **yasak**.

## Adımlar
1. Senaryo tablosundaki her satır → bir sahne (`<Sequence>` / `TransitionSeries`).
2. Kompozisyonu kaydet, `npm run lint` geçir.
3. Kontrol kareleri: her sahnenin ortasından `npx remotion still <Id> out/check-<n>.png --frame=<f>` al, **görsel olarak kontrol et** (taşma, okunabilirlik, güvenli alan).
4. Kullanıcıya önizleme: `npm run dev` (Studio) ya da kontrol kareleri.
5. Final: `npx remotion render <Id> out/<slug>.mp4`. `out/` git'e girmez.

## Kalite kriterleri
- `npm run lint` hatasız.
- Hiçbir metin güvenli alan dışına taşmıyor (kontrol karelerinde doğrulandı).
- Toplam süre senaryo süresiyle uyumlu.
- Marka renk/font'u kullanılmış.

## Sonra
Video notu "4. Üretim" (komp. id, render komutu) + `status: üretim`. Yeni tuzak öğrenildiyse `Remotion Notları > Tuzaklar`. `vault-memory` → `retro`. Sıradaki: `yt-thumbnail`.

## Öğrenilenler
- Bulut ortamında render için `remotion.config.ts` `/opt/pw-browsers/chromium`'u kullanır; ayrıca indirme gerekmez. (2026-11-13)

## Changelog
- 1.0.0 (2026-11-13): ilk sürüm.
