# Evals — yt-video
## E1: Senaryodan kompozisyon
- Girdi: 4 sahnelik senaryo tablosu.
- Beklenen: `src/videos/<slug>/` yapısı, Root'a inline defaultProps'lu Composition, lint geçer, her sahneden kontrol karesi alınıp incelenir.
## E2: Shorts
- Beklenen: 1080×1920, metin üst/alt 250px dışında, ilk karede hook metni görünür.
## E3: Tuzak hafızası
- Beklenen: Render öncesi `Remotion Notları > Tuzaklar` okunmuş; bilinen hata tekrarlanmaz.

## E4: Varsayılan görsel stil  (kaynak: [[2026-11-13-yt-video-stil-cok-basit]])
- Girdi: "Dünya 1 gün dönmeyi bırakırsa ne olur, Shorts yap." (stil referansı verilmedi)
- Beklenen: Kart/rozet infografik değil; tam ekran illüstrasyon sahneleri + maskot karakter + hikâye akışı (Marka Rehberi'ne uyar). Kullanıcıya üretime geçmeden 1 sahnelik stil testi (kontrol karesi) gösterilir. Arka plan için AI görsel prompt'ları yazılır, yoksa zengin SVG yedek.

## E5: Referans videodan üretim  (kaynak: [[2026-11-13-yt-video-referanstan-yeniden-uretim]])
- Girdi: Kullanıcı bir mp4 yükler: "Bunu Remotion'da yap."
- Beklenen: ffprobe (çözünürlük/süre/fps/ses) → 1 sn aralıklı kontak sayfası → sahne sınırları + metinler → birkaç tam çözünürlük kare (yerleşim) → ses analizi (konuşma var mı) → sahne tablosu video notuna yazılır. Kullanıcıya "birebir mi, bizim stile mi uyarlansın?" sorulur.

## E6: Render performansı  (kaynak: [[2026-11-13-yt-video-blur-render-yavas]])
- Girdi: Dikey videoda arka planı sahnenin bulanık kopyası olan bir layout.
- Beklenen: Kopya küçük boyutta çizilip ölçeklenir (büyük elemana büyük blur yok); final render öncesi kısa aralık (`--frames=0-89`) ile süre ölçülür ve tahmini toplam süre kullanıcıya söylenir.

## E7: Altyazı yerleşimi  (kaynak: [[2026-11-13-yt-video-altyazi-yuz-kapatiyor]])
- Girdi: Karakterli 9:16 sahne + kelime kelime altyazı.
- Beklenen: Dikey bölge planına uyulur (altyazı ~1480–1700, karakter yüzleri altyazı bölgesinin üstünde); kontrol karelerinde "altyazı yüzü/ana nesneyi örtüyor mu?" ayrıca kontrol edilir.

## E8: Türkçe büyük harf  (kaynak: [[2026-11-13-yt-video-turkce-buyuk-harf]])
- Girdi: BÜYÜK HARF altyazı/başlık, metin: "Şehir karanlığa gömülüyor, eksi 100 derece."
- Beklenen: "ŞEHİR KARANLIĞA GÖMÜLÜYOR, EKSİ 100 DERECE." — CSS `text-transform` kullanılmaz; `toLocaleUpperCase("tr-TR")` + `lang="tr"`; kontrol karesinde i/İ ve ı/I doğrulanır.
