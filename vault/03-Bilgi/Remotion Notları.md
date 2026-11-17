---
tags: [bilgi, remotion]
---
# Remotion Notları
- Proje: `video/` (Remotion 4.0.543, React 19, TypeScript)
- Resmi skill'ler: `.claude/skills/remotion-*` (kaynak: github.com/remotion-dev/skills)
- Kompozisyonlar: `YouTubeIntro` (1920×1080, 30fps), `ShortsHook` (1080×1920, 30fps) → `video/src/Root.tsx`
- Video: `Eksi100` (1080×1920, 53 sn) → `video/src/videos/eksi-100/` — dikey Shorts şablonu: bulanık arka plan + başlık + 16:9 sahne kartı + rozet + metin
- Bileşen: `TitleCard` → `video/src/components/TitleCard.tsx`

## Komutlar
```bash
cd video
npm run dev                 # Remotion Studio (önizleme)
npm run render:intro        # out/intro.mp4
npm run render:short        # out/short.mp4
npx remotion still <Id> out/x.png --frame=45   # tek kare (thumbnail / kontrol)
npm run lint                # eslint + tsc
```

## Tuzaklar (öğrenildikçe eklenir)
- Bulut ortamında headless shell indirilemeyebilir → `remotion.config.ts` önceden kurulu Chromium'u (`/opt/pw-browsers/chromium`) otomatik kullanıyor. (2026-11-13)
- `defaultProps` `<Composition>` üzerinde **inline obje** olmalı (Studio düzenleyebilsin diye).
- Prop tipleri `type` ile yazılır, `interface` değil.
- **Bulanık arka plan pahalı:** Sahneyi 3414px genişlikte ikinci kez çizip `filter: blur(40px)` uygulamak render'ı ciddi yavaşlatır (53 sn'lik Shorts > 10 dk). Çözüm (Eksi100'de uygulandı): kopyayı 1/4 boyutta çizip `scale(4.3)` + `blur(10px)`. Bu makinede (4 çekirdek) ~0,45 sn/kare. (2026-11-13)
- Sahneleri 1920×1080 SVG koordinatında çizip `preserveAspectRatio="xMidYMid slice"` ile karta ölçeklemek iyi çalışıyor; aynı sahne hem karta hem bulanık arka plana konabiliyor.
- **Türkçe büyük harf:** CSS `textTransform: uppercase` "i"yi "I" yapar (ŞEHIR ❌). `text.toLocaleUpperCase("tr-TR")` + kökte `lang="tr"` kullan (ŞEHİR ✅). Kullanıcı düzeltmesi. (2026-11-13)
- **3D (three.js):** `@remotion/three` + `three` + `@react-three/fiber` kurulu. Bu makinede GPU yok → `remotion.config.ts` içinde `Config.setChromiumOpenGlRenderer("swangle")` (angle/swiftshader/egl/vulkan çalışmadı). ~0,6 sn/kare (1080×1920, gölgeli). `TubeGeometry`'yi `g.scale()` ile yassılaştırma — eğriyi de taşır. Animasyon sadece `useCurrentFrame()` ile, `useFrame()` yasak. Stil testi: `video/src/videos/test-3d/` (2026-11-14)
- **Seslendirme (TR) seçenekleri:** Piper `tr_TR-dfki-medium` tek TR sesi, veri lisansı **CC BY-NC-SA 4.0 (ticari yasak)** → monetize kanalda yayında kullanılamaz. Denendi ve **bırakıldı**, kurulum silindi. Bkz. [[Lisans ve Para Kazanma Kuralları]]. (2026-11-17)
- Rastgelelik için `Math.random()` değil `random(seed)` (her karede aynı sonuç).
- Ses üretimi: `ffmpeg -f lavfi -i anoisesrc=color=brown...` ile rüzgar/ambiyans koddan üretilebiliyor; telifsiz.

Bkz: [[Marka Rehberi]], [[Skills MOC]]
