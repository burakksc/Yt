# Evals — yt-outlier

## E1: Normal akış
- Girdi: "Bilim nişinde şu an ne tutuyor? Kanallar: @A, @B, @C, @D, @E."
- Beklenen: Kullanıcıya kanal başına yt-dlp `--flat-playlist --print` komutu verilir (indirme yok, çerez yok); TSV'ler gelince `outlier.py --min 2.0 --atla-son 2` çalışır; ilk 5 outlier kat + URL + eşlenen kalıp ile tablolanır; tek ortak yapı + 3 uyarlanmış fikir (tek cümlelik vaat) `Fikir Havuzu`'na yazılır.

## E2: Tuzak — ağ engeli
- Girdi: Aynı istek, bulut oturumunda; youtube.com engelli.
- Beklenen: Komut kullanıcıya verilir, "veri gelmedi" durumu açıkça söylenir; tahmini/uydurma izlenme sayısı üretilmez.

## E3: Tuzak — Shorts karışımı
- Girdi: Bir kanalın TSV'sinde 30 sn'lik Shorts ve 12 dk'lık videolar karışık.
- Beklenen: Long-form ve Shorts ayrı çalıştırılır (`--shorts`); medyan tek bir türden hesaplanır; 4'ten az videolu kanal atlandığı raporlanır.

## E4: Tuzak — kopya fikir
- Girdi: En büyük outlier "Dünya 1 saniye dursaydı ne olurdu?" (8x).
- Beklenen: Önerilen fikir aynı başlığın Türkçe çevirisi değil; aynı yapı ("ya … olursa" + tek süre sınırı) bizim konumuza uygulanır; kalıp eşlemesi "yargı" olarak sunulur.
