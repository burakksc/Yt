---
tags: [skill]
skill: yt-video
version: 1.1.0
---
# yt-video
**Dosya:** `.claude/skills/yt-video/SKILL.md` · **Test seti:** `.claude/skills/yt-video/evals.md`

Senaryodan Remotion ile video üretme (long-form 16:9 ve Shorts 9:16) - sahne kompozisyonu, animasyon, ses, altyazı, render. "Videoyu yap", "render al", "sahne ekle", "Remotion'da yap", "intro yap" denildiğinde kullan. Resmi remotion-* skill'lerini proje kurallarıyla birleştirir.

## Eğitim geçmişi
| Tarih | Versiyon | Değişiklik | Kaynak feedback | Eval |
|---|---|---|---|---|
| 2026-11-13 | 1.0.0 | İlk sürüm | — | — |
| 2026-11-13 | 1.1.0 | Görsel stil varsayılanı (illüstrasyon+hikâye+maskot, hibrit AI arka plan, stil testi); 9:16 bölge planı; referans video analizi; render süre ölçümü + blur optimizasyonu; altyazı-yüz kontrolü | [[2026-11-13-yt-video-stil-cok-basit]], [[2026-11-13-yt-video-referanstan-yeniden-uretim]], [[2026-11-13-yt-video-blur-render-yavas]], [[2026-11-13-yt-video-altyazi-yuz-kapatiyor]] | eski 3/7 → yeni 7/7 (alt-ajan, E1–E7) |

## Açık gözlemler (sonraki eğitim adayları)
Eval sırasında alt-ajanın fark ettiği, henüz feedback'e dayanmayan boşluklar — gerçek bir sorun yaşanırsa feedback'e dönüşür:
- Ses/müzik seviyesi için kalite kriteri yok.
- `yt-shorts` ile görev paylaşımı yazılı değil.
- Referans mp4'ün nereye kaydedileceği belirsiz.

Bkz: [[Skills MOC]]
