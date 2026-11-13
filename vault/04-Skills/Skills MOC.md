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

## Eğitim günlüğü
| Tarih | Skill | Versiyon | Ne öğrendi | Eval |
|---|---|---|---|---|
| 2026-11-13 | (tümü) | 1.0.0 | İlk sürüm | — |
| 2026-11-13 | [[yt-video]] | 1.1.0 | Stil varsayılanı, 9:16 bölge planı, referans video analizi, render hızı, altyazı-yüz kontrolü (4 feedback) | 3/7 → 7/7 |
| 2026-11-13 | [[yt-video]] | 1.2.0 | Türkçe büyük harf (İ/I) kuralı — kullanıcı düzeltmesi | E8 ✅ |

Bağlantılar: [[Home]]
