# Yt

YouTube video üretim stüdyosu: **Obsidian vault hafıza** + **Remotion** + **kendini eğiten Claude skill'leri**.

```
vault/            Obsidian vault — ortak hafıza (Home.md'den başla)
video/            Remotion projesi (YouTubeIntro 16:9, ShortsHook 9:16)
.claude/skills/   Skill'ler: resmi remotion-* + yt-* iş skill'leri + eğitim skill'leri
scripts/          skills-report.mjs, vault-check.mjs
CLAUDE.md         Claude'un her oturumda okuduğu kurallar
```

## Başlangıç
```bash
cd video && npm install && npm run dev     # Remotion Studio
```
Vault: Obsidian → "Open folder as vault" → `vault/`.

## Üretim hattı
`yt-idea → yt-research → yt-script → yt-video → yt-thumbnail → yt-seo → (yt-shorts) → yt-publish → yt-analytics`

## Eğitim döngüsü
`iş → retro → vault/04-Skills/feedback → skill-trainer → SKILL.md v+1` · tekrar eden skill'siz iş → `skill-forge`
