---
name: yt-script-edit
description: Yazılmış bir YouTube senaryosunu (seslendirme metni) yayın kalitesine getiren odaklı düzeltme turları - kulakla anlaşılırlık, kanal sesi, "e yani?", kanıt, somutluk, merak/duygu, izleyiciyi kaçıran sürtünme; Türkçe "yapay zekâ kokusu" temizliği ve izleyici paneli puanlaması. "Senaryoyu düzelt", "metni parlat", "seslendirme metnini gözden geçir", "çok yapay duruyor", "AI yazmış gibi", "senaryoyu sıkılaştır", "şu cümleyi düzelt" denildiğinde veya yt-script taslağı bittikten sonra, seslendirmeden (voicestudio) önce kullan.
metadata:
  version: 1.0.0
---
# YT Script Edit — Senaryo Düzeltme Turları

`yt-script` taslağı **yazar**, bu skill onu **düzeltir**. Mesajı değiştirmez; her değişikliğin bir gerekçesi vardır. Metin **kulak** için yazılır: okunmayacak, seslendirilecek.

## Önce hafıza
- Video notu: "2. Araştırma" (kaynaklar — kanıt turu için), "3. Senaryo" (tablo).
- `vault/02-Kanal/Kanal Kimliği.md` — ton, hitap (sen/siz), yasak kelimeler.
- `vault/03-Bilgi/Hook Kalıpları.md`.
- Önceki düzeltmeler: `grep -ril "yt-script-edit\|yapay duruyor" vault/04-Skills/feedback`.

## Önce mod seç
- **A — Boş/şablon kokan taslak:** turların hepsi; gerekirse araştırmadaki olgulardan yeniden kur.
- **B — Gerçek bir sesi olan metin (kullanıcı yazdı):** turların hepsi ama kullanıcının kelimelerini ve argümanını **koru**, sadece onar.
- **C — Nokta düzeltme ("şu cümleyi düzelt"):** turları ATLA. Sadece istenen satır + gerekli minimum çevresi; değişen satırları gerekçeyle döndür, gerisine dokunma.

## Turlar (A/B modunda sırayla; her turdan sonra öncekiler bozuldu mu bak)
1. **Kulakla anlaşılırlık:** cümle ≤ ~20 kelime; tek nefeste söylenebilir mi? Uzun yan cümle, belirsiz "bu/o" göndermesi, art arda isim tamlaması ("veri analiz süreci yönetimi") yok. Sayıları söylenişine göre yaz ("3,2 milyon" → "üç virgül iki milyon" gerekiyorsa seslendirme notu).
2. **Kanal sesi:** Kanal Kimliği'ndeki ton ve hitap baştan sona aynı; resmî/gündelik kayması yok.
3. **"E yani?":** her olgu izleyicinin hayatına bir köprüyle bağlanıyor mu ("…yani sen bunu …"). Köprüsüz olgu = liste okumak.
4. **Kanıtla:** her olgusal iddia "2. Araştırma"daki bir kaynağa eşleniyor; eşlenmeyen iddia ya çıkar ya `[KAYNAK GEREK]` ile işaretlenir — **uydurma kaynak/sayı yok**. Araştırma sadece benzerlik gösteriyorsa "…dır" değil "…gibi görünüyor".
5. **Somutluk:** soyut sıfat yerine sayı, isim, yer, tarih ("çok soğuk" → "eksi 89 derece, Vostok"). Bir rakip kanal bu cümleyi değiştirmeden kullanabiliyorsa yeniden yaz; farklılaştırıcı yoksa `[GEREK: bizim açımız]`.
6. **Merak ve duygu:** her bölüm sonunda açık döngü var mı; tempo düşen paragrafta bir soru/sürpriz/maskot tepkisi var mı.
7. **Sürtünme (izleyiciyi kaçıran an):** uzun hazırlık, işaretsiz konu değişimi, erken abone/CTA, tekrar eden özet. Bunlar elde tutma uçurumu üretir (`yt-retention`); kes veya sona taşı. Tek CTA.

## Türkçe "yapay zekâ kokusu" — yazma / ayıkla
- Kalıp açılışlar: "Günümüzün hızla değişen dünyasında", "Hiç düşündünüz mü…?" (her videoda), "Gelin birlikte keşfedelim", "Hazırsanız başlayalım", "Bu videoda … konuşacağız".
- Karşıtlık gösterisi: "Bu sadece X değil, aynı zamanda Y" / "X değil, Y" — Y'yi gerekçesiyle doğrudan söyle.
- Kendi sorup cevaplama: "Sonuç mu? Şaşırtıcı." — doğrudan söyle (izleyicinin gerçek sorusu hariç).
- Olumsuzlama listeleri ve virgüllü yığma ("…üstelik, ayrıca, hatta…").
- Boş yoğunlaştırıcılar: "inanılmaz", "muazzam", "kesinlikle", "gerçekten çok" → yerine olgu.
- Her paragrafta üçlü liste; her bölümün "Kısacası…" ile bitmesi.
- Eş anlamlı kelimeyle yamamak yeni koku üretir: olgudan yeniden yaz.

## İzleyici paneli (A/B modunda son kapı)
3–4 persona her biri 1–10 puan + somut eleştiri:
- **Hedef izleyici** (Hedef Kitle notundan): "Bana mı konuşuyor, sıkıldığım an var mı?"
- **Şüpheci izleyici:** "Hangi iddiaya inanmadım, kaynağı nerede?"
- **Kurgu editörü:** "Hangi cümle ekranda görselsiz kalıyor, hangi sahne uzun?"
- **YouTube stratejisti:** "İlk 15 sn başlığın sözünü doğruluyor mu, ödül teslim ediliyor mu?"
En düşük puanlı alanı önce düzelt, yeniden puanla; hedef: herkes ≥7, ortalama ≥8. Puanlar yargıdır, metrik değil — `yt-retention` verisi gelince kalibre edilir.

## Adımlar
1. Modu seç ve söyle.
2. Turları uygula; senaryo tablosunu (Süre / Seslendirme / Ekranda) koru, sadece "Seslendirme" ve gerekirse "Ekranda" değişir.
3. Değişiklik listesi: `#satır | eski | yeni | tur/gerekçe` (C modunda sadece bu).
4. Süreyi yeniden hesapla (Türkçe ~130 kelime/dk); hedefle ±%10.
5. Panel puan tablosu + kalan `[KAYNAK GEREK]` / `[GEREK: …]` işaretleri kullanıcıya.

## Kalite kriterleri
- Mod açıkça seçilmiş; C modunda istenmeyen satırlara dokunulmamış.
- Araştırmada olmayan hiçbir olgu eklenmemiş; eşlenemeyenler işaretli.
- Yukarıdaki kokulardan hiçbiri final metinde yok (arama ile kontrol edildi).
- Her cümle tek nefeste söylenebilir; süre hedefle ±%10.
- Değişikliklerin her biri gerekçeli; panel puanları ve en zayıf alan raporlanmış.

## Sonra
Video notu "3. Senaryo" güncellenir + "Düzeltme" alt başlığına değişiklik özeti ve panel puanları. Kullanıcı bir düzeltmeyi geri aldıysa → `retro` feedback'i (`skill: yt-script-edit`). Sıradaki: seslendirme (`voicestudio`) → `yt-video`.

## Öğrenilenler
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-14): ilk sürüm (staging). Mod seçimi (yeniden kur / sesi koru / nokta düzeltme), sıralı odaklı turlar, "e yani?" ve kanıt turları, AI-kokusu listesi ve uzman paneli puanlama fikri coreyhaines31/marketingskills `copy-editing` + `copywriting` (MIT; bu iki skill tek tek SkillSpector statik taramada 0 bulgu, repo bütünü başka skill'lerden dolayı HIGH/CRITICAL) yaklaşımından öğrenildi. Pazarlama sayfası yerine Türkçe seslendirme metnine, vault araştırma kaynaklarına ve yt-retention geri beslemesine göre sıfırdan yeniden yazıldı; Türkçe koku listesi bizim. — kaynak: [[Skill Araştırması 2026-11]]
