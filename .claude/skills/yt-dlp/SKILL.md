---
name: yt-dlp
description: yt-dlp ile video/ses/altyazı/metadata indirme — kanalın kendi videolarını yedeklemek, izinli/lisanslı (CC) içeriği almak, rakip ve konu araştırması için indirmeden metadata ve altyazı çekmek (başlık, süre, izlenme, bölümler, otomatik altyazı). "yt-dlp", "videoyu indir", "altyazısını çek", "bu videonun bilgileri", "rakip videoları incele" denildiğinde kullan.
metadata:
  version: 1.0.0
---
# yt-dlp — indirme ve araştırma

## Kurallar (önce bunlar)
1. **Telif ve kullanım koşulları:** Başkasının videosunu **yeniden yüklemek, montajda kullanmak veya dağıtmak için indirme**. İndirme sadece: (a) kanalın kendi içeriği, (b) açık lisanslı (CC-BY vb., lisansı kontrol edip video notuna yaz) içerik, (c) sahibinden yazılı izin olan içerik. Emin değilsen sor.
2. **Araştırma için önce indirmeden:** Rakip/konu analizinde video dosyası yerine metadata ve altyazı yeter (`--skip-download`).
3. **Kişisel veri:** Yorumları/kullanıcı bilgilerini toplu toplama; gerekirse sadece özet istatistik.
4. **Ortam:** Bu bulut ortamında youtube.com erişimi **engelli** → komutları kullanıcının bilgisayarında çalıştır (yt-dlp burada kurulu ama ağ yok). Engel varsa sahte sonuç üretme; söyle.

## Kurulum
```bash
pip install -U yt-dlp     # ffmpeg PATH'te olmalı (birleştirme/dönüştürme için)
```

## Sık kullanılanlar
```bash
# Araştırma: sadece metadata (JSON) — başlık, süre, izlenme, etiketler, bölümler
yt-dlp --skip-download --dump-json "URL" > meta.json

# Araştırma: sadece altyazı (TR, yoksa otomatik)
yt-dlp --skip-download --write-subs --write-auto-subs --sub-langs "tr.*,en.*" --sub-format vtt -o "research/%(id)s.%(ext)s" "URL"

# Kanal/oynatma listesi özeti (indirmeden, düz liste)
yt-dlp --flat-playlist --print "%(id)s\t%(title)s\t%(duration)s\t%(view_count)s" "KANAL_VEYA_LISTE_URL"

# Kendi videomuzu yedekle (en iyi kalite, mp4)
yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -o "backup/%(upload_date)s %(title)s.%(ext)s" "URL"

# Sadece ses (kendi içeriğimiz / izinli) → whisper-transcribe'a girdi
yt-dlp -x --audio-format mp3 -o "audio/%(id)s.%(ext)s" "URL"
```

## Akışa bağlama
- **Araştırma (`yt-research`, `yt-idea`):** metadata + altyazıdan rakip videoların hook'u, süresi, bölümleri → `vault/01-Videolar/<video>.md` "Rakip videolar" bölümüne özet (kaynak URL ile). Altyazının tamamını vault'a yapıştırma, özetle.
- **Transkript:** altyazı yoksa ve izin varsa sesi indir → `whisper-transcribe`.
- **Kendi videolarımızın analizi (`yt-analytics`):** `--dump-json` ile süre/izlenme/beğeni anlık görüntüsü → video notundaki analiz tablosuna.
- İndirilen dosyalar `research/`, `backup/`, `audio/` altında; **repoya commit etme** (`.gitignore`).

## Kalite kriterleri
- Her indirme için gerekçe (kendi / lisans / izin) video notunda.
- Araştırmada indirme yapılmadan metadata/altyazı kullanıldı.
- Çıktı yolu ve dosya ffprobe ile doğrulandı (indirme yapıldıysa).

## Sonra
`vault-memory` → `retro`.

## Öğrenilenler
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-14): ilk sürüm — kullanıcı isteği ("yt-dlp ekle"); yt-dlp 2026.10.26.
