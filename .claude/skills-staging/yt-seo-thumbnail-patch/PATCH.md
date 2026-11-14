# Önerilen yama — `yt-seo` 1.0.0 → 1.1.0 ve `yt-thumbnail` 1.0.0 → 1.1.0 ("paket" kuralı)

> Durum: **öneri** (uygulanmadı). `skill-trainer` ile uygula (eval önce, sonra SKILL.md).
> Kaynak fikir: Jakeschincariol/youtube-agent-skill `yt-package`, `yt-seo`, `yt-chapters` (MIT, SkillSpector statik: 0 bulgu). Metin bizim, Türkçe kanal ve Remotion `<Still>` akışımıza göre yeniden yazıldı.

## Neden
Başlık `yt-seo`'da, thumbnail metni `yt-thumbnail`'da ayrı yazılıyor. Kaynak repo ikisini **tek birim** sayıyor: ayrı yazılınca thumbnail başlığı tekrar ediyor ve tıklama yüzeyinin yarısı aynı şeyi iki kez söylüyor. Ayrıca karakter sınırlarını iki farklı ekranda (masaüstü/mobil) ayrı kontrol ediyor ve bölüm (chapter) kurallarını "uyulmazsa sessizce çalışmaz" diye vurguluyor.

## `yt-thumbnail` değişiklikleri
1. "Adımlar" 1. madde: "3 konsept yaz" → **"Başlık adaylarıyla eşli 3 konsept yaz: her konsept = (başlık, thumbnail metni, görsel, duygu). Thumbnail metni başlıktaki hiçbir anahtar kelimeyi tekrar etmez — aynı söz, farklı kelimeler."**
2. "Kurallar": "En fazla 3–4 kelime" → **"En fazla 3 kelime"** (akış boyutunda 4. kelime gri lekeye dönüşür). Türkçe uzun kelimeler (ör. "GÖRÜNMEYENLER") tek başına sığmıyorsa 2 kelimeye in.
3. Büyük harf: `toLocaleUpperCase("tr-TR")` (yt-video kuralı) thumbnail için de geçerli — maddeyi buraya da ekle.
4. Kalite kriterine ekle: "**Paket testi:** başlık + thumbnail yan yana 168×94 ve 320×180 önizlemede birlikte okunuyor; ikisi birlikte tek bir merak boşluğu açıyor."

## `yt-seo` değişiklikleri
1. "Başlık" maddesi:
   - **10 aday yaz, 3'ünü göster**; her birinin yanında tek somut sorun (kesiliyor / thumbnail'ı tekrar ediyor / belirsiz).
   - Karakter: **≤60** masaüstü aramada kesilme sınırı, **≤40** mobil ana sayfada konu kaybolma riski — ikisini ayrı raporla (Türkçe ekler uzun: önemli kelime ilk 40 karakterde).
   - Sayı, isim veya tarih her sıfattan iyidir. En fazla **2 TAMAMEN BÜYÜK** kelime (fazlası spam gibi okunur).
2. Yeni madde **"Sorgu testi":** bu videonun kazanması gereken 3 gerçek Türkçe arama sorgusunu yaz; başlık + açıklamanın ilk 2 satırı bu sorguların kelimelerini içermiyorsa sorun açıklamada değil **başlıkta**dır.
3. "Etiketler": "8–15, geniş → dar" → **"Etiketler zayıf sinyaldir; ayırt etme için kullan: yazım varyantları (Türkçe karakterli/karaktersiz: 'karadelik', 'kara delik'), İngilizce terim, kısaltmalar. ≤15. Alakasız etiket doldurma kullanım koşullarına aykırı."**
4. "Bölümler": mevcut kurala ekle → "Kurallardan biri bozulursa YouTube bölümleri **sessizce** göstermez: ilk satır `00:00`, ≥3 bölüm, her biri ≥10 sn. Bölüm başlıkları konu kelimesi değil o bölümün **sözü**, 3–5 kelime. Beş kelimeyle adlandırılamayan bölüm ya iki bölümdür ya dolgudur → `yt-video`'ya not."
5. Abone akışına yönelik (arama değil) bir videoda bunu söyle ve eforu SEO yerine pakete (başlık+thumbnail) harca.

## Eklenecek eval'lar
```markdown
## E-P1 (yt-thumbnail): Tekrar eden paket
- Girdi: Başlık "Kara Delikler Neden Görünmez?", thumbnail metni "GÖRÜNMEZ KARA DELİK".
- Beklenen: Tekrar tespit edilir; alternatif thumbnail metni başlık kelimelerini kullanmaz (ör. "IŞIK BİLE KAÇAMAZ"→ ≤3 kelimeye indirilir: "IŞIK KAÇAMAZ"), İ/I doğru.

## E-S1 (yt-seo): Mobil kesilme + sorgu testi
- Girdi: 58 karakterlik başlık, ana kelime 45. karakterden sonra.
- Beklenen: ≤60 geçer ama ≤40 uyarısı verilir; ana kelime başa alınmış bir alternatif; 3 sorgu yazılır ve başlık/açıklama ilk 2 satırla karşılaştırılır.

## E-S2 (yt-seo): Geçersiz bölüm listesi
- Girdi: Bölümler 00:05'ten başlıyor, bir bölüm 7 sn.
- Beklenen: Liste geçersiz ilan edilir (sessizce çalışmaz), düzeltilmiş liste 00:00 ile başlar, tüm bölümler ≥10 sn.
```

## Changelog satırları (uygulanırsa)
- yt-thumbnail: `1.1.0: başlık+thumbnail tek paket, ≤3 kelime, tr-TR büyük harf, paket testi — kaynak: [[Skill Araştırması 2026-11]]`
- yt-seo: `1.1.0: 10→3 başlık, 60/40 kesilme, sorgu testi, etiket = ayırt etme, sessiz bölüm kuralları — kaynak: [[Skill Araştırması 2026-11]]`
