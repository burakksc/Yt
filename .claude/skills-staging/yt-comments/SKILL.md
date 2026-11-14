---
name: yt-comments
description: Yayınlanmış videonun yorumlarını dörde ayırma (soru / düzeltme / övgü / trol), kanal sesimizle kısa yanıt taslakları yazma, hangi yorumun sabitleneceğini seçme ve tekrar eden soruları yeni video fikrine çevirme. "Yorumlara cevap yaz", "yorumları değerlendir", "yorum bölümü", "şu yorumu nasıl yanıtlayayım", "hangi yorumu sabitleyeyim", "izleyiciler ne soruyor" denildiğinde kullan.
metadata:
  version: 1.0.0
---
# YT Comments — Yorum Triyajı ve Yanıt

Yorum bölümü bir angajman yüzeyidir: ilk saatlerdeki yanıtlar bir dizinin sohbete dönüşüp dönüşmeyeceğini belirler. Bu skill **yanıtları yazar, göndermez** — kullanıcı kopyalayıp yapıştırır.

## Önce hafıza
- `vault/02-Kanal/Kanal Kimliği.md` — ton, hitap (sen/siz), emoji kullanımı.
- İlgili video notu: senaryo + araştırma (kaynaklar) — düzeltme yorumlarını kontrol etmek için.
- `vault/00-Inbox/Fikir Havuzu.md` — tekrar eden sorular buraya gidecek.

## Veri
- Kullanıcı yorumları yapıştırır (ya da Studio'dan dışa aktarır). Toplu kullanıcı verisi toplama; kullanıcı adlarını vault'a **yazma** — sadece yorumun özü.

## Adımlar
1. **Önce triyaj, sonra yazı.** Her yorumu tek kovaya koy ve kova sayılarını söyle:
   1. **Soru** → yanıtla. Tekrar edenleri say; 3+ kez sorulan = video fikri adayı.
   2. **Düzeltme** → video notundaki "2. Araştırma" kaynaklarıyla kontrol et. Haklıysa açıkça kabul et ve teşekkür et; kontrol edemiyorsan tartışma, "bakacağız" de. Doğrulanan hata → video notuna "Hata/Düzeltme" + sabit yorum veya açıklama düzeltmesi önerisi.
   3. **Övgü** → birkaçına, yorumdan **somut bir şeyi** anarak kısa yanıt. Hepsine aynı "teşekkürler!" yazma (otomatik görünür).
   4. **Trol / kışkırtma / spam** → yanıt yok. Sadece "yanıtlanmadı" diye listele; ne kadar hak edilmiş olursa olsun laf sokan cevap yazılmaz.
2. **Yanıt kuralları:** ≤30 kelime; ilk cümle sorunun cevabı; geri soru sadece gerçekten merak ediliyorsa; emoji sadece Kanal Kimliği'nde varsa; **yapmaya karar vermediğimiz bir videoyu vaat etme** ("belki ileride" bile değil, açıkça "not aldık").
3. **Türkçe kontrol:** hitap tutarlı (sen/siz), i/İ-ı/I doğru, argo kanal tonunda değilse yok.
4. **Sabitle + kalp:** sabitlenecek **tek** yorumu seç: en çok kişinin aklındaki soru (en tatlı yorum değil) + gerekçesi. Kalp için cömert bir liste (bedava ve görünür).

## Kalite kriterleri
- Önce kova sayıları verilmiş; her yorum tek kovada.
- Yanıtlar ≤30 kelime, ilk cümle cevap, aynı kalıp tekrar etmiyor.
- Trol yorumlarına yanıt taslağı yok.
- Düzeltmeler kaynağa bakılarak kabul/ret edilmiş; kontrol edilemeyen olgu tartışılmamış.
- Hiçbir yanıt kararlaştırılmamış bir video sözü vermiyor.
- Vault'a kullanıcı adı / kişisel veri yazılmamış.

## Sonra
- Video notuna "Yorumlar" alt başlığı: tarih, kova sayıları, sabitlenen yorumun özü, doğrulanan düzeltmeler.
- 3+ tekrar eden soru → `Fikir Havuzu` (kaynak: video notu linki + kaç kez soruldu).
- Doğrulanan olgu hatası → `yt-research` için feedback notu (`vault/04-Skills/feedback/`).
- `vault-memory` → `retro`.

## Öğrenilenler
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-14): ilk sürüm (staging). Dört kova triyajı, ≤30 kelime yanıt ve "en çok sorulan soruyu sabitle" ilkesi Jakeschincariol/youtube-agent-skill `yt-comment` (MIT) fikrinden öğrenilip Türkçe kanalımıza, vault akışına (Fikir Havuzu, araştırma kaynaklı düzeltme kontrolü) ve kişisel veri kuralına göre yeniden yazıldı. SkillSpector statik: 0 bulgu. — kaynak: [[Skill Araştırması 2026-11]]
