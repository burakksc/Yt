---
name: yt-retention
description: YouTube Studio "Kitle elde tutma" (audience retention) dışa aktarımını okuyup izleyicinin tam olarak hangi saniyede, ne söylenirken ayrıldığını bulma; kanca kaçağı / uçurum / kayma teşhisi ve tek bir düzeltme önerisi. "İzleyici nerede bırakıyor", "retention kötü", "elde tutma grafiği", "izlenme süresi düşük", "tempo sorunu var mı", "retention CSV" denildiğinde veya yt-analytics retention verisiyle karşılaştığında kullan.
metadata:
  version: 1.0.0
---
# YT Retention — Elde Tutma Grafiğini Okuma

`yt-analytics`'in derin dalışıdır: o genel metrikleri (CTR, izlenme) tablolar, bu skill tek bir videonun **elde tutma eğrisini saniye saniye** okur ve senaryodaki/kurgudaki suçlu anı bulur.

## Önce hafıza
- Video notu: "3. Senaryo" (sahne tablosu + süreler), "4. Üretim" (komp. id), "7. Yayın sonrası analiz".
- `vault/03-Bilgi/Hook Kalıpları.md` — bu videoda hangi kalıp kullanıldı?
- Önceki videoların retention dersleri: `grep -ril "kanca kaçağı\|uçurum" vault/01-Videolar vault/04-Skills/feedback`.

## Veri
- Kullanıcıdan: Studio → video → Analytics → Etkileşim → Kitle elde tutma grafiği → indir (CSV). Ekran görüntüsü verirse noktaları tablo olarak çıkar ve **"tahmini veri"** diye işaretle.
- Metin: videonun altyazısı. Yoksa `whisper-transcribe` ile final render'dan `.srt` üret (ses bizim, kaynak MP4: `video/out/<slug>.mp4`).

## Adımlar
1. Çalıştır: `python3 -I .claude/skills/yt-retention/scripts/retention.py <csv> --sure <sn> --srt <srt>` (süre: `ffprobe` ile final MP4'ten).
2. Üç ayrı sorunu ayrı ayrı adlandır (karıştırma — düzeltmeleri farklıdır):
   - **Kanca kaçağı** (ilk 30 sn kayıp): <25 puan sağlıklı, 25–40 kaçak, >40 ciddi. Düzeltme hep **senaryonun ilk 15 saniyesi**dir, kurgu değil → `yt-script`.
   - **Uçurum** (tek bir anda dik düşüş): bir *an*dır — işaretsiz konu değişimi, uzun hazırlık, sponsor/CTA, görsel durgunluk. Script'in `soylenen` çıktısını senaryo tablosundaki sahneyle eşleştir (sahne no + "Ekranda" sütunu).
   - **Kayma** (ortadaki düzenli kanama, dk başına puan): tempo sorunudur; düzeltme **kesmek**tir, yeniden yazmak değil → `yt-video` (sahne kısaltma, görsel değişim sıklığı).
3. **Tek en büyük kaçağı** seç ve ona tek somut değişiklik öner (hangi sahne, ne değişecek). Beş maddelik liste verme; kullanıcı isterse kalanları sırala.
4. Kanca sağlıklı ve kayma düzse açıkça söyle: "Video iyi; sorun paketleme" → `yt-thumbnail` / `yt-seo`.
5. Uzun videoysa: uçurum sahneleri iyi Shorts adayı **değildir**; en yüksek tutulan bölümleri `yt-shorts`'a aday olarak not et.

## Kalite kriterleri
- Her teşhis CSV'deki bir sayıya ve saniyeye dayanıyor; ekran görüntüsünden okunan değerler "tahmini" işaretli.
- Her uçurum senaryo tablosundaki bir sahneye eşlenmiş (sahne no + söylenen cümle).
- Çıktı **tek** ana düzeltme içeriyor; kanca/uçurum/kayma birbirine karıştırılmamış.
- Kanca sorunu kurguya, kayma sorunu yeniden yazmaya yönlendirilmemiş.

## Sonra
- Video notu "7. Yayın sonrası analiz" altına "Elde tutma" alt başlığı: kanca kaçağı, ilk 3 uçurum (sn + sahne), kayma.
- `Hook Kalıpları` tablosunda bu videonun kalıbının "Sonuç (retention @30s)" sütununu doldur.
- Teşhis başına `vault/04-Skills/feedback/` notu (`_Templates/Skill-Feedback.md`, kanıt = saniye + puan) → ilgili skill: `yt-script` (kanca), `yt-video` (kayma/uçurum).
- `vault-memory` → `retro`.

## Öğrenilenler
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-14): ilk sürüm (staging). Kanca kaçağı / uçurum / kayma ayrımı ve "tek düzeltme" ilkesi Jakeschincariol/youtube-agent-skill `yt-retention` (MIT) fikrinden öğrenilip Türkçe, vault ve Remotion sahne tablosuna göre yeniden yazıldı; `scripts/retention.py` sıfırdan bizim yazdığımız stdlib betiği (kod kopyalanmadı). SkillSpector statik tarama: 0 bulgu. — kaynak: [[Skill Araştırması 2026-11]]
