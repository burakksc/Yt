# Yt — YouTube üretim stüdyosu

Dil: Kullanıcıyla **Türkçe** konuş. Kod yorumları ve commit mesajları İngilizce olabilir.

## 1. Hafıza: `vault/` (Obsidian)
Kalıcı hafızamız `vault/`. Oturumlar arası her şey burada.
- **Her oturumun başında:** `vault-memory` skill'ine göre bağlam yükle (`vault/Home.md` + son günlükler + ilgili notlar).
- **Her işin sonunda:** `vault-memory` ile iz bırak, sonra `retro` ile ders çıkar.
- Kullanıcı bir tercih/kural söylerse ("hep böyle yap") → hemen vault'a yaz + `retro` feedback'i.
- Sağlık kontrolü: `node scripts/vault-check.mjs`

## Kanal kuralı: para kazanmaya uyum
Kanal (Interestingly Cozy) **tamamen monetizasyona uyumlu** olmalı: ticari kullanıma izin vermeyen (NC) ses modeli, müzik, görsel, font veya araç **kullanma**. Yeni araç/model seçmeden önce lisansını kontrol et → `vault/02-Kanal/Lisans ve Para Kazanma Kuralları.md`.

## 2. Video: `video/` (Remotion 4)
- Önizleme `cd video && npm run dev`, kontrol `npm run lint`, tek kare `npx remotion still <Id> out/x.png --frame=N`, render `npx remotion render <Id> out/x.mp4`.
- Proje kuralları `yt-video` skill'inde; Remotion API'si için resmi `remotion-*` skill'leri (`remotion-best-practices` yönlendirici).
- Görsel bir şey ürettiğinde render edip kareye **bakarak** doğrula.

## 3. Skill'ler: `.claude/skills/`
Her iş adımının bir skill'i var — işe başlamadan uygun skill'i yükle.

| İş | Skill |
|---|---|
| Hafıza oku/yaz | `vault-memory` |
| Fikir | `yt-idea` |
| Araştırma | `yt-research` |
| Senaryo | `yt-script` |
| Remotion üretim/render | `yt-video` |
| Thumbnail | `yt-thumbnail` |
| Başlık/açıklama/etiket | `yt-seo` |
| Shorts | `yt-shorts` |
| Yayın kontrolü | `yt-publish` |
| Performans analizi | `yt-analytics` |
| AI görsel/video üretimi (Higgsfield, 38 model) | `open-higgsfield` |
| Karakterden 1 dk AI film (Story Studio) | `higgsfield-story-studio` |
| Ses → metin / altyazı (Whisper) | `whisper-transcribe` |
| Video/altyazı/metadata indirme, araştırma | `yt-dlp` |
| 3D model/sahne (Blender → GLB → Remotion three.js) | `yt-3d` |

### Skill'leri eğiten skill'ler
- `retro` — her işten sonra dersleri `vault/04-Skills/feedback/` altına yazar.
- `skill-trainer` — feedback'leri okuyup skill'leri günceller (regresyon eval + önce/sonra test + versiyon/changelog).
- `skill-forge` — skill'i olmayan tekrar eden işler için yeni skill üretir.
- Durum: `node scripts/skills-report.mjs`

### Dış (upstream) skill'ler
- `remotion-*` — Remotion resmi skill'leri.
- `karpathy-guidelines` — kod yazarken/düzenlerken: önce düşün, en basit çözüm, cerrahi değişiklik, doğrulanabilir hedef. **Video/kod üzerinde her değişiklikte uygula.**
- `superpowers` (obra) — geliştirme iş akışı: brainstorming, writing-plans, executing-plans, systematic-debugging, test-driven-development, verification-before-completion, subagent-driven-development…
- Matt Pocock skill'leri — grill-me/grilling (fikri sorgulama), handoff, teach, to-spec, implement, prototype, diagnosing-bugs, tdd, triage…
- UI-UX Pro Max — `design`, `brand`, `banner-design` (kanal kapağı), `design-system`, `ui-styling`, `slides`, `ui-ux-pro-max`.
- ECC'den seçme 6 skill — `content-engine`, `video-editing`, `brand-voice`, `brand-discovery`, `market-research`, `manim-video`.
- `voicestudio` (debpalash/VoiceStudio) — yerel, ücretsiz TTS/ses klonlama/dublaj (646 dil, Türkçe dahil). VoiceStudio uygulaması bir bilgisayarda çalışıyor olmalı (`localhost:3900`). Seslendirme: sahne metinleri → `public/<video>/voice/<sahne>.mp3`.
- `ffmpeg-skill` (kajisho5, MIT) — 42 yerel FFmpeg aracı: kes, birleştir, yeniden çerçevele, sessizlik sil, loudness, platform export, kontrol. `python3 .claude/skills/ffmpeg-skill/scripts/<araç>.py`.
- HyperFrames (heygen-com/hyperframes, Apache-2.0) — HTML→video, 9 skill: `hyperframes`, `hyperframes-cli`, `hyperframes-registry` (~450 hazır blok), `media-use`, `reverse-any-video`, `remotion-to-hyperframes`, `style-sampling`, `slideshow`, `figma`. **Videolarımızın ana motoru Remotion'dur**; HyperFrames ek kaynak (hazır bloklar, video tersine mühendislik). Telemetri kapalı (`.claude/settings.json`).
- Blender (EL4CTEO/blender-skills, MIT) — 23 `blender-*` skill (core, sculpting, rigging, materyal, simülasyon, export, asset-qa…). Blender 5.3 burada `bpy` modülü + `scripts/3d/blender` köprüsüyle çalışır: `source scripts/3d/env.sh`. Kurulum: `scripts/3d/setup.sh`.
- **Kullanıcı tercihi (2026-11-15):** Gerektiğinde superpowers kullan — yeni/çok adımlı işte `brainstorming` → `writing-plans` → `executing-plans`; hata ayıklamada `systematic-debugging`; "bitti" demeden önce `verification-before-completion`; bağımsız paralel işler için `dispatching-parallel-agents`. Küçük, tek adımlı işlerde zorlama.
- **Öncelik:** YouTube işlerinde önce bizim `yt-*` skill'lerimiz; dış skill'ler destekleyici. `retro` her zaman bizimki (Matt Pocock'un retro'su bilerek kurulmadı).
- Kaynaklar: `.claude/skills/EXTERNAL_SKILLS_SOURCES.txt`

Kurallar:
- Dış skill'ler (`remotion-*`, `karpathy-guidelines`) upstream'den gelir; **elle düzenleme**. Remotion dersleri `yt-video`'ya veya `vault/03-Bilgi/Remotion Notları.md`'ye.
- Skill'i olmayan bir işi ikinci kez yapıyorsan → `skill-forge` öner.
- Yeni skill eklenince bu tabloyu güncelle.

## Git
- `video/out/`, `node_modules/` commit edilmez. Vault notları commit edilir (hafıza = git geçmişi).
