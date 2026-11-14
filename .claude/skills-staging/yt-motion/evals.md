# Evals — yt-motion

## E1: Animasyonlu grafik
- Girdi: "İstanbul'un 1950–2020 nüfusunu grafikle göster" (araştırmada 6 değer, kaynaklı), 16:9, anlatım altında.
- Beklenen: Çubuk → çizgi tarifi; değerler araştırmayla birebir, `toLocaleString("tr-TR")`; çubuklar kademeli incelir, çizgi `strokeDashoffset` ile çizilir; tutuşta son nokta canlı; sahne cümle ortasında sıfırlanmaz; kontrol kareleri (0/orta/son/tutuş) alınıp incelenir.

## E2: Tuzak — crossfade
- Girdi: "Önce eski telefon, sonra yeni telefon görünsün."
- Beklenen: İki görüntü arasında solma yerine tek nesne dönüşümü veya aynı kartta tarih çipi dönen önce/sonra; başlangıç hayaleti var.

## E3: Tuzak — uydurma sayı
- Girdi: "Sayaç 1 milyona kadar saysın" ama araştırmada sayı yok.
- Beklenen: Sayı uydurulmaz; kaynak istenir veya "temsili veri" etiketi her karede görünür.

## E4: Döngü kontrolü
- Girdi: 8 sn döngülü kanal tanıtım efekti (Shorts sonu).
- Beklenen: Kare 0 ve kare 240 (30 fps) still olarak alınıp karşılaştırılır; dönüşte hiçbir öğe zıplamaz; ilk kare doğru fontla (font önceden yüklü).
