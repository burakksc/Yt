---
tags: [moc, skills]
---
# Skills MOC
Skill dosyaları: `.claude/skills/<ad>/SKILL.md` (+ `evals.md` = test seti). Bu klasör skill'lerin **hafızası**: neden var, ne öğrendi.
Durum raporu: `node scripts/skills-report.mjs`

## Eğitim döngüsü
```
iş (yt-*) ──► retro ──► feedback/*.md ──► skill-trainer ──► SKILL.md v+1
                              │                 │
                              └─ skill:(yok) ──►└─► skill-forge ──► yeni skill
yt-analytics (gerçek metrikler) ──► feedback/*.md
```
1. [[retro]] her işten sonra dersleri `feedback/` altına yazar (kanıtlı).
2. [[yt-analytics]] gerçek YouTube metriklerinden feedback üretir.
3. [[skill-trainer]] feedback → regresyon eval → minimal düzenleme → önce/sonra eval → versiyon + changelog.
4. [[skill-forge]] skill'i olmayan tekrar eden işler için yeni skill üretir.

## İş skill'leri (üretim hattı)
| Sıra | Skill | Ne yapar |
|---|---|---|
| 0 | [[vault-memory]] | Hafızayı oku / yaz (her oturum) |
| 1 | [[yt-idea]] | Fikir üret, puanla, video notu aç |
| 2 | [[yt-research]] | Kaynaklı araştırma, rakip analizi |
| 3 | [[yt-script]] | Hook + sahne tablosu senaryo |
| 4 | [[yt-video]] | Remotion ile üretim + render |
| 5 | [[yt-thumbnail]] | Remotion Still ile thumbnail varyantları |
| 6 | [[yt-seo]] | Başlık, açıklama, bölümler, etiketler |
| 7 | [[yt-shorts]] | Dikey kısa versiyonlar |
| 8 | [[yt-publish]] | Yayın kontrol listesi |
| 9 | [[yt-analytics]] | Metrik → ders → feedback |
| + | [[open-higgsfield]] | OpenHiggsfield ile AI görsel/video (Higgsfield anahtarı, ücretli) |
| + | [[whisper-transcribe]] | Whisper ile TR transkript, SRT/VTT, Remotion caption JSON |
| + | [[yt-dlp]] | Metadata/altyazı ile araştırma, kendi videolarımızı yedekleme (telif kuralları) |
| + | [[higgsfield-story-studio]] | Story Studio: karakter → 6 sahne → MP4 (fal/Higgsfield, ücretli) |

## Eğitim (meta) skill'leri
| Skill | Ne yapar |
|---|---|
| [[retro]] | Dersleri feedback'e çevirir |
| [[skill-trainer]] | Feedback ile skill'leri eğitir |
| [[skill-forge]] | Yeni skill üretir |

## Resmi Remotion skill'leri (düzenlenmez)
`remotion-best-practices` (yönlendirici), `remotion-create`, `remotion-markup`, `remotion-captions`, `remotion-render`, `remotion-studio`, `remotion-interactivity`, `remotion-multimedia`, `remotion-maps`, `remotion-docs`, `remotion-upgrade`, `remotion-saas`, `remotion-license` — kaynak: github.com/remotion-dev/skills, v4.0.543.
Güncelleme: `remotion-upgrade` skill'i veya `npx skills add remotion-dev/skills`.

## Dış skill'ler (düzenlenmez)
- `karpathy-guidelines` — kaynak: github.com/multica-ai/andrej-karpathy-skills (MIT, forrestchang; Karpathy'nin LLM kodlama hataları gözlemlerinden). Kod yazarken 4 ilke: önce düşün / basitlik / cerrahi değişiklik / doğrulanabilir hedef. Eklendi: 2026-11-13.

- 2026-11-13: 54 dış skill eklendi — superpowers (15), mattpocock (26), ui-ux-pro-max (7), ECC'den seçme 6 (314'ten; YouTube ile ilgili olanlar). Atlananlar ve gerekçeler: `.claude/skills/EXTERNAL_SKILLS_SOURCES.txt`. Güvenlik taraması yapıldı: superpowers brainstorming sunucusu uzak logo yüklüyor → `SUPERPOWERS_DISABLE_TELEMETRY=1` (`.claude/settings.json`); ui-ux `design` script'leri sadece verilirse Gemini vb. API anahtarı kullanır.
- 2026-11-14: `voicestudio` eklendi (debpalash/VoiceStudio, AGPL-3.0, ★110k). Yerel ElevenLabs alternatifi; **seslendirme sorununu anahtarsız çözebilir** ama uygulamanın kullanıcının bilgisayarında (ya da erişilebilir bir sunucuda) çalışması gerekir. Bu bulut ortamında model indirme (huggingface) engelli.
- 2026-11-14: HyperFrames (9 skill, Apache-2.0, ★84k) + ffmpeg-skill (kajisho5, MIT, 42 araç) eklendi. HyperFrames `media-use` script'lerinde PostHog telemetrisi vardı → kapatıldı. HyperFrames'in kendi repo-geliştirici skill'leri (`.claude/skills/*`) ve 450 registry bloğu skill olarak eklenmedi (registry `hyperframes-registry` ile CLI'dan kurulur).
- **Çakışma kuralı:** Dış skill bizimkiyle aynı isimdeyse kurulmaz (ör. mattpocock `retro`). YouTube işlerinde `yt-*` önceliklidir.

## Eğitim günlüğü
| Tarih | Skill | Versiyon | Ne öğrendi | Eval |
|---|---|---|---|---|
| 2026-11-13 | (tümü) | 1.0.0 | İlk sürüm | — |
| 2026-11-13 | [[yt-video]] | 1.1.0 | Stil varsayılanı, 9:16 bölge planı, referans video analizi, render hızı, altyazı-yüz kontrolü (4 feedback) | 3/7 → 7/7 |
| 2026-11-13 | [[yt-video]] | 1.2.0 | Türkçe büyük harf (İ/I) kuralı — kullanıcı düzeltmesi | E8 ✅ |

Bağlantılar: [[Home]]
