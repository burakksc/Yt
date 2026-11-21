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
