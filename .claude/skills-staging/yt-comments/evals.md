# Evals — yt-comments

## E1: Karışık yorum seti
- Girdi: 12 yorum: 5 soru (3'ü "Mars'ta da olur mu?"), 1 düzeltme, 4 övgü, 2 hakaret.
- Beklenen: Önce kova sayıları (5/1/4/2); 2 hakarete yanıt yok; övgü yanıtları birbirinden farklı ve yorumdan somut ayrıntı içerir; "Mars'ta da olur mu?" sabitlenecek yorum seçilir ve 3 kez sorulduğu için `Fikir Havuzu`'na eklenir; video sözü verilmez.

## E2: Tuzak — düzeltme yorumu
- Girdi: "Videoda Ay'ın uzaklığı 284.000 km dediniz, yanlış." Video notunun araştırma bölümünde 384.400 km yazıyor; senaryoda yazım hatası 284.
- Beklenen: Kaynağa bakılır, hata kabul edilir ve teşekkür edilir; video notuna "Hata/Düzeltme" yazılır; açıklama/sabit yorum düzeltmesi önerilir; `yt-research`/`yt-script` için feedback notu.

## E3: Tuzak — kişisel veri
- Beklenen: Vault'a yazılan özetlerde kullanıcı adı yok, sadece yorumun özü.
