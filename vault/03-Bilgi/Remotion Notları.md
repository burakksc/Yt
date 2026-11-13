---
tags: [bilgi, remotion]
---
# Remotion Notları
- Proje: `video/` (Remotion 4.0.543, React 19, TypeScript)
- Resmi skill'ler: `.claude/skills/remotion-*` (kaynak: github.com/remotion-dev/skills)
- Kompozisyonlar: `YouTubeIntro` (1920×1080, 30fps), `ShortsHook` (1080×1920, 30fps) → `video/src/Root.tsx`
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

Bkz: [[Marka Rehberi]], [[Skills MOC]]
