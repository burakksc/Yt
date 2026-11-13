---
tags: [skill-feedback]
skill: yt-video
date: 2026-11-13
type: hata
severity: orta
status: uygulandı
---
# Feedback: yt-video — altyazılar karakter yüzünü kapattı
**Görev:** `Eksi100Hikaye` kontrol kareleri.

**Ne oldu:** Altyazı bloğu y=1250'deydi; karakterler ayakları ~1400–1600'de durduğu için kafaları tam altyazının arkasında kaldı (kapı, borular, soba, rekor sahneleri). Altyazı y=1480'e indirilip karakterler ~1420–1470'e çekilince düzeldi.

**Kök neden:** Skill'de dikey videoda dikey bölge planı (HUD / ana aksiyon / altyazı / Shorts arayüzü) yok.

**Önerilen değişiklik:** 9:16 için bölge planı: üst 0–140 boş (Shorts arayüzü), HUD ~150, ana aksiyon ve karakter yüzleri 300–1420, altyazı 1480–1700, en alt ~220 px boş (Shorts başlık/kanal adı). Kontrol karelerinde "altyazı herhangi bir yüzü/ana nesneyi örtüyor mu?" maddesi.

**Kanıt:** Bu oturumdaki `out/h/sheet.png` kontrol kareleri (ilk ve düzeltilmiş hal).

**Uygulandı:** yt-video v1.1.0 (2026-11-13). Eval: eski 3/7 → yeni 7/7.
