---
tags: [kanal, lisans, kural, yayın]
updated: 2026-11-21
---
# Güvenli yayın standardı (kullanıcı kuralı, 2026-11-21)
Kullanıcı: "Bundan sonra oluşturacağın videoları ve açıklamalarını bana **mutlaka %100 yasal olarak güvenli, paylaşmaya hazır** gönder. Herhangi bir riskle karşılaşmak istemiyorum."
Not: %100 garanti verilemez (hukuki tavsiye değil); hedef = bilinen tüm riskleri kapatmak, kalan riski açıkça yazmak.

## KARAR (kullanıcı, 2026-11-21): yeni videolar yapay görselle
Kullanıcı: "tüm videoları yapay görsellerle yapalım, en azından lisans riski olmasın."
Uygulama kuralları:
- **Tarz:** tutarlı, **stilize illüstrasyon** (fotogerçekçi DEĞİL) → yanıltıcı içerik ve "gerçek sanıldı" riskini düşürür; kanal kimliği tek tip olur.
- **Gerçek yer/olay/nesne:** gerçek fotoğraf gibi görünen AI görsel yok; "illustration" tarzı + açıklamada "AI-generated illustrations, not photographs".
- **Araç:** yerel SDXL (CreativeML OpenRAIL++-M, ticari kullanım serbest). Üretim parametrelerini (model, prompt) vault'a kaydet. Gerçek kişi/marka/logo promptu yok; ünlü kişi benzerliği yok.
- **Araç/araba:** AI kalite sorunu (kullanıcı: "saçma") → bu konular kamu malı fotoğraf veya kodla çizim.
- **Kamu malı (NASA/NOAA/LoC) görsel de serbest:** lisans riski AI ile aynı seviyede sıfır; gerçek veri/harita/uzay görüntüsü için bunlar tercih.
- Studio: sentetik içerik kutusu **Evet** (gerçekçi görünüyorsa), açıklamada AI notu.
- **Kullanıcı (2026-11-21): İSTİSNA YOK, hepsi AI** (Human Computers, Mary Celeste dahil). Gerçek kişi anlatılan videolarda: **yüzsüz/silüet/arkadan, genel dönem karakterleri**; isimli gerçek kişinin yüz benzerliği çizilmez. Gemi/araç: sade stilize illüstrasyon (detay hatası yoksa), kalite kötüyse kullanıcıya göster.
- Eski (gerçek foto atıflı) videolar kalır; istenirse sonra AI/PD'ye çevrilir.
- Kalan riskler (AI ağırlıklı kanal = YouTube "özgün olmayan içerik" gözlemi): her videoya özgün anlatım/senaryo, farklı yapı; aynı şablonla toplu üretme.

## Görsel kaynak sırası (sıkı)
1. **Kamu malı / CC0** (NASA, ESA/Hubble, NOAA, Library of Congress, Smithsonian Open Access, Met/Rijksmuseum/Europeana Open Access, Commons "Public domain"/CC0) → atıf riski ~0.
2. **CC BY** → tam atıf (sahne/zaman — eser adı, yazar, lisans, site).
3. **CC BY-SA** → sadece 1–2 bulunamazsa; değiştirilmiş hali SA ile; tam atıf.
4. Soyut/"ne olurdu" sahnesi: kodla çizim veya **etiketli** AI illüstrasyon. Gerçek yer/olay/nesne/araç anlatırken AI görsel **yok**.
- NC / ND / "izinle" / belirsiz / filigranlı / Google Görseller / başka kanal karesi: **yok**. Lisansı doğrulanamayan görsel kullanılmaz.
- Lisansı indirme anında `meta.json`'a kaydet; Flickr "lisans aklama" şüphesine karşı: yüklenme geçmişi tek seferlik/profesyonel stok görünüyorsa kullanma.
- Kişi yüzü/logo/marka içeren görselde (özellikle tanınabilir kişi) ek dikkat; gerekirse kullanma.

## Teslim paketi (her video için, hazır yapıştırılabilir)
1. Video (karelere bakarak doğrulanmış).
2. **Başlık** — yanıltıcı değil, videonun söylediğini aşmaz.
3. **Açıklama** — özet, `Sources:`, `Images (by scene)` (linksiz: `--nolinks`, kanal doğrulanana kadar), AI notu, footer (linksiz).
4. **Hashtag/etiketler**.
5. **YouTube Studio ayarları:** sentetik içerik kutusu (Evet/Hayır + neden), çocuklara özel (Hayır), yaş sınırı (Hayır), lisans: Standart YouTube.
6. **Risk özeti:** her görsel/ses için lisans satırı + "kalan risk" (yoksa "belirlenen risk yok").

## Linkler
Kanal telefon doğrulanana kadar açıklamada `https://` yok; atıf: eser adı + yazar + lisans + site (+ Flickr foto ID / Commons dosya adı).

## Yayın öncesi kapı
[[Yayın Öncesi Kontrol Listesi]] tamamen ✅ olmadan "hazır" denmez. Bkz: [[Lisans ve Para Kazanma Kuralları]]

## Short yerleşimi (kullanıcı, 2026-11-21)
- Kanal logosu: sağ altta, 120 px, üstte 1760 / sağ kenardan 70 px (`video/src/components/Watermark.tsx`).
- "AI-generated illustration" etiketi: sol altta, 15 px, top 1816 / sol 64 px (`videos/gizem/index.tsx`).
- Tüm yeni Short'lar bu yerleşimle çıkar. **Biten videolar yeniden render EDİLMEZ** (kullanıcı: "yeniden render yok").

## Teslim sırası (kullanıcı, 2026-11-21)
Her video hazır olur olmaz, sıradakini beklemeden DİREKT gönder (video + başlık + linksiz açıklama + hashtag/etiket + Studio ayarı + risk özeti).

## Açıklama: "Images" satırı YOK (kullanıcı, 2026-11-21)
AI illüstrasyonlu videolarda açıklamaya "Images: All images ... AI-generated illustrations" satırı **konmaz**. Kalanlar: özet, Sources, "Narration: AI voice (Kokoro TTS).", linksiz footer, hashtag. (Video içindeki küçük "AI-generated illustration" etiketi ve Studio sentetik kutusu kuralları geçerli.) Gerçek fotoğraf kullanılırsa atıf satırları yine zorunlu.

## Etiket/hashtag teslimi (kullanıcı, 2026-11-21)
Ayrı **hashtag satırı/bloğu VERME** (kullanıcı yazdıklarımı Studio'daki Tags alanına yapıştırıyor). Sadece **Etiketler (Tags)**: `#`siz, küçük harf, virgülle ayrılmış, tek satır, tek kod bloğu (≤500 karakter). Açıklamadaki standart footer olduğu gibi kalır.

## Logo (kullanıcı, 2026-11-21): KALDIRILDI
Short'larda kanal logosu watermark'ı YOK ("logoyu kaldıralım"). `Watermark.tsx` no-op. Yukarıdaki "Short yerleşimi" bölümündeki logo satırı geçersiz; sadece sol alttaki küçük "AI-generated illustration" etiketi kalır.

## Yabancı kelime okunuşu (kullanıcı, 2026-11-22)
"Türkiye" Kokoro'da `[Türkiye](/tˈɜɹkiːjɛ/)` fonem işaretiyle okutulur (kullanıcı seçimi A). Ekran yazısı büyük harfte "TÜRKİYE" (WordCaptions + başlık düzeltmesi). Yeni yabancı yer adlarında önce okunuş örneklerini kullanıcıya dinlet.
