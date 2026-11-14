---
tags: [bilgi, skill, güvenlik]
tarih: 2026-11-14
---
# Skill Araştırması 2026-11

GitHub'da kanala yarayacak yüksek yıldızlı agent-skill repoları arandı, **NVIDIA SkillSpector** ile güvenlik taramasından geçirildi, geçenlerden fikir alınıp **kendi** skill taslaklarımız yazıldı (kopya değil, yeniden yazım). Taslaklar etkin değil: `.claude/skills-staging/`.

## Yöntem
- Arama: `gh api -X GET search/repositories … sort=stars` (YouTube, SEO, senaryo/hook, kurgu, altyazı, TTS, motion, fact-check, analitik). Kurulu olanlar (remotion, superpowers, mattpocock, ECC, ui-ux-pro-max, hyperframes, ffmpeg-skill, voicestudio, blender) atlandı.
- Klonlama: her repo kendi boş klasörüne, `--depth 1 --filter=blob:limit=1m` + sparse checkout (sadece metin/kod uzantıları: md, py, js/ts, sh, json, yaml, html…). Büyük medya ve uzantısız dosyalar (ör. `LICENSE`) çekilmedi → lisanslar GitHub meta verisinden.
- **SkillSpector v2.12.0** (NVIDIA/SkillSpector @ c816150), Python 3.12 venv, **`--no-llm` = yalnız statik mod** (LLM API anahtarı kullanılmadı; semantik analizörler kapalı). OSV.dev bu ortamdan 403 → bağımlılık CVE kontrolü **çevrimdışı statik yedek** ile.
- Aday repolardaki hiçbir betik çalıştırılmadı; içerikleri veri olarak okundu.
- Kural: repo bütününde HIGH/CRITICAL yoksa "geçti". Çok skill'li bir koleksiyonda repo kalırsa, sadece **tek tek taranıp 0 HIGH/CRITICAL** çıkan skill'lerden fikir alındı (`--recursive`).
- Kendi taslaklarımız da tarandı: hepsi SAFE (yalnız `yt-motion`'da 1 MEDIUM: `npx remotion` sürüm sabitlenmemiş atfı).

## Adaylar
| Repo | ★ | Lisans | Ne sunuyor | SkillSpector (statik) | Karar |
|---|---|---|---|---|---|
| Jakeschincariol/youtube-agent-skill | 5.860 | MIT | 11 YouTube skill'i: 21 hook formülü + puanlayıcı, başlık+thumbnail paket lint, retention CSV okuyucu, outlier avı, yorum triyajı, chapters, Shorts seçimi | **SAFE, 0 bulgu** (skor 0) | **Yeniden yaz** → `yt-retention`, `yt-outlier`, `yt-comments` + yamalar (`yt-script`, `yt-seo`/`yt-thumbnail`, `yt-shorts`) |
| charlie947/motion-graphics-skills | 673 | MIT | 15 HTML/HyperFrames motion skill'i: 16 premium efekt tarifi, animasyonlu grafik, Vox tarzı explainer | CAUTION, max **MEDIUM** (19: sabitlenmemiş `npx skills/hyperframes`, "without asking") | **Yeniden yaz** → `yt-motion` (Remotion'a uyarlandı) |
| coreyhaines31/marketingskills | 60.231 | MIT | 53 pazarlama skill'i (copywriting, copy-editing, psikoloji, SEO, CRO…) | Repo: **CRITICAL** (6 CRITICAL / 87 HIGH: ad-creative şablonunda "Arsenic", tools/SETUP.md kimlik bilgisi, sync script…). `--recursive`: 25 skill 0 bulgu; `copywriting`, `copy-editing` 0 bulgu | **Kısmi yeniden yaz** → `yt-script-edit` (yalnız 0 bulgulu `copy-editing`/`copywriting`'den). Kalanı atla |
| remotion-dev/skills (kurulu) | — | (Remotion lisansı) | Resmi Remotion skill'leri | **CRITICAL** etiketi (12 HIGH = mapbox TECHNIQUE.md'de "access token" dokümanı; 93 MEDIUM `npx remotion`); elle inceleme: kullanıcı Mapbox token'ı isteyen doküman → yanlış pozitif | Zaten kurulu; değişiklik yok (aşağıda) |
| AgriciDaniel/claude-youtube | 768 | MIT | Kanal denetimi, video SEO, retention senaryosu, thumbnail CTR, YouTube API | **CRITICAL** (10 HIGH: `curl … \| bash` kurulum, `youtube_auth.py` OAuth credentials.json okuma, SKILL.md'de `~/.claude/settings.json` düzenleme talimatı) | **Atla** — kimlik bilgisi/kurulum riski; fikirleri Jakeschincariol ile örtüşüyor |
| ScrapeCreators/social-media-research-skills | 6.436 | MIT | 13 sosyal medya araştırma skill'i (outlier, yorum madenciliği, rakip analizi) | CAUTION, 1 HIGH (AR2 "without caveats" — elle bakınca yanlış pozitif: "…caveats olmadan ortalama alma" uyarısı), 2 MEDIUM dış API | **Atla** — ücretli ScrapeCreators API anahtarı gerekiyor; kurala göre HIGH var |
| mvanhorn/last30days-skill | 67.600 | MIT | Reddit/X/YouTube/HN'de son 30 gün araştırması | **CRITICAL** (674 HIGH: Chrome çerez okuma `chrome_cookies.py`, keychain/env anahtar toplama, `info_stealer` YARA eşleşmesi) | **Atla** — tarayıcı çerezi/anahtar erişimi; bizim kural (çerez kullanma) ile çelişir |
| Vincentwei1021/video-shotcraft | 19.299 | Apache-2.0 | Remotion ile sinematik ürün promosu | **CRITICAL** (1 CRITICAL taint: `os.getenv`→istek, `publish/upload_post.py`; 12 HIGH; kapsam %84) | **Atla** |
| Vincentwei1021/video-talkcraft | 2.320 | NOASSERTION | Seslendirme odaklı motion stüdyosu | **CRITICAL** (54 HIGH: `sfx-samples.js` obfuscated kod, TTS betiğinde kimlik bilgisi, env toplama) | **Atla** — lisans belirsiz + bulgular |
| nateherkai/herk-edit-kit | 2.833 | NOASSERTION | Reels/Shorts kurgu kiti (30 skill) | **CRITICAL** (50 HIGH: gizli talimat yorumları, obfuscated HTML, `setup.mjs`/`kie.mjs` kimlik bilgisi) | **Atla** — lisans belirsiz + bulgular |
| bangtutorial/bang-motion | 2.144 | MIT | Tarayıcı motion graphics (opener, kinetik tipografi) | HIGH (37× AE1: referans dosyalar tam analiz edilemedi, kapsam **%56,7**) | **Atla** — tarama tamamlanamadı |
| petar-nauka/fact-check-skill | 83 | MIT | Doğruluk kontrolü / dezenformasyon | **CRITICAL** (1 CRITICAL "arsenic" örnek metni, 4 HIGH: "Output Rules", "don't judge", test subprocess) | **Atla** — muhtemelen yanlış pozitif ama kurala göre geçemedi; fact-check ihtiyacı `yt-script-edit` kanıt turu + `yt-research` ile karşılandı |
| OpenMontageInc/OpenMontage | 80.375 | AGPL-3.0 | Ajan tabanlı video üretim sistemi | Taranmadı | **Atla** — skill değil tam sistem, ~78 MB, AGPL; 12 repo sınırı |

Not: Statik mod kelime/desen eşleştiriyor; "arsenic", "access token", "without caveats" gibi yanlış pozitifler çok. Yine de kuralı gevşetmedik: HIGH/CRITICAL olan repodan fikir almadık (marketingskills'te yalnız tek tek temiz çıkan skill'ler).

## remotion-dev/skills güncelleme durumu
- Kurulu: `7e541aa` (v4.0.543). Uzak `main` HEAD'i de **`7e541aa`** (2026-11-11 "Update template") → **yeni commit yok, yeni skill yok.**
- `diff -rq` (kurulu ↔ güncel): SKILL.md/referanslarda fark **yok**. Tek fark: upstream'de her skill'de `agents/openai.yaml` var (Codex/OpenAI arayüz meta verisi: görünen ad, ikon, varsayılan prompt) — Claude Code için gereksiz, bilerek kurulmamış.
- 13 skill aynı: best-practices, captions, create, docs, interactivity, license, maps, markup, multimedia, render, saas, studio, upgrade. Kurulu dosyalara dokunulmadı.

## Staging taslakları (`.claude/skills-staging/`)
| Klasör | Tür | Özet |
|---|---|---|
| `yt-retention/` | Yeni skill + `scripts/retention.py` + evals (4) | Elde tutma CSV → kanca kaçağı / uçurum / kayma, SRT ile "o an ne söyleniyordu", tek düzeltme. Betik bizim (stdlib), sentetik veriyle test edildi |
| `yt-outlier/` | Yeni skill + `scripts/outlier.py` + evals (4) | Rakip videoları kanal medyanına göre kat ile sıralama (yt-dlp metadata, kullanıcının bilgisayarında), ortak yapı, 3 uyarlanmış fikir |
| `yt-comments/` | Yeni skill + evals (3) | Dört kova triyaj, ≤30 kelime yanıt, sabitlenecek yorum, tekrar eden soru → Fikir Havuzu |
| `yt-motion/` | Yeni skill + evals (4) | Remotion'da morph, başlangıç hayaleti, kademeli vuruş, hareket/tutuş/dönüş saati, birebir değerli grafik, kare-kesin kontrol |
| `yt-script-edit/` | Yeni skill + evals (4) | Mod seçimi (A/B/C), 7 odaklı tur, Türkçe AI-kokusu listesi, izleyici paneli |
| `yt-script-patch/PATCH.md` | Yama önerisi | 5 hook adayı + Türkçe puan rubriği, ilk 15 sn'nin 3 işi, ÖDÜL etiketi, tek CTA |
| `yt-seo-thumbnail-patch/PATCH.md` | Yama önerisi | Başlık+thumbnail tek paket, ≤3 kelime, 60/40 karakter, sorgu testi, etiket = ayırt etme, sessiz bölüm kuralları |
| `yt-shorts-patch/PATCH.md` | Yama önerisi | 3 koşullu an seçimi, yeni ilk cümle, döngü noktası, kırpma notu |

Etkinleştirme önerisi: yeni skill'ler `skill-forge` adım 6–7 (hızlı test + vault kaydı + CLAUDE.md tablosu) ile; yamalar `skill-trainer` ile (önce eval, sonra önce/sonra testi). Etkinleşince `node scripts/skills-report.mjs`.

## Bulgular / dersler
- En iyi kaynak, en sade repo çıktı: Jakeschincariol (32 KB, 0 bulgu, API anahtarı yok).
- Yüksek yıldız ≠ güvenli: en çok yıldızlı iki aday (last30days 67k, marketingskills 60k) repo düzeyinde CRITICAL.
- Kimlik bilgisi/çerez okuyan, `curl | bash` kuran veya obfuscated JS taşıyan repolar elendi.

Bkz: [[Hook Kalıpları]], [[Remotion Notları]], [[YouTube Temelleri]]

[[Bilgi MOC]]
