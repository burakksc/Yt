---
tags: [kanal, marka, remotion]
status: taslak
---
# Marka Rehberi
Remotion kompozisyonları bu değerleri kullanır (`video/src/Root.tsx` → `defaultProps`).

| Token | Değer | Not |
|---|---|---|
| Arka plan | `#0b0b0f` | koyu |
| Vurgu (long-form) | `#ff3b30` | kırmızı |
| Vurgu (Shorts) | `#ffcc00` | sarı |
| Font | Inter / sans-serif | Türkçe karakter desteği şart |

## Görsel stil (2026-11-13, kullanıcı tercihi)
- **Tam ekran, detaylı 2D illüstrasyon + hikâye anlatımı.** Düz infografik / kart+rozet stili **istenmiyor** ("çok basit").
- Referans hissiyat: soğuk mavi palet + sıcak turuncu pencere ışıkları, atmosferik derinlik, iç ve dış mekân sahneleri, ifadeli karakter. (İlham: @guyheadlamp "Absolute Zero" — stil ilhamı, **kopya değil**.)
- Arka planlar: AI görsel (prompt'ları biz yazarız) + Remotion animasyon katmanı. Prompt şablonu: [[Eksi100 Hikaye - Gorsel Promptlari]]
- Altyazı: büyük, kalın, BÜYÜK HARF, kelime kelime sarı vurgu, y≈1480 (karakter yüzlerinin altında, Shorts arayüzünün üstünde).
- Üstte HUD: `❄ -100°C` + hikâye saati.

## Maskot
- Çubuk vücut, yuvarlak beyaz yüz, **teal ushanka (kulaklıklı kürk şapka)**, **hardal sarısı uzun atkı**, kırmızı eldiven.
- Bilerek @guyheadlamp karakterinden (bere + kırmızı atkı + kafa lambası) farklı tutuldu.
- Kod: `video/src/videos/eksi-100-hikaye/Character.tsx` (pozlar: stand/walk/hug/phone/shiver/reach; ruh hâli: neutral/worried/shocked/relieved; `frost` 0–1).

Kurallar:
- Başlık min 84px (1080 genişlikte), destek metni min 44px — bkz. [[Remotion Notları]]
- Shorts: önemli içerik üst/alt 250px'e girmesin (UI kaplıyor)

Bkz: [[Kanal Kimliği]]
