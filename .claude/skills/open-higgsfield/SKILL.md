---
name: open-higgsfield
description: OpenHiggsfield AI studio (github.com/wide-trace/open-higgsfield) ile AI görsel/video üretimi — 38 model (Seedance 2.x, Kling, Wan, Flux, Ideogram, Recraft, LTX, MiniMax, PixVerse, Grok, Qwen…), kullanıcının Higgsfield platform anahtarıyla (id:secret). Studio'yu kurmak/çalıştırmak, API ile programatik üretim yapmak ve üretilen görsel/klipleri Remotion videolarımıza (AI arka plan, b-roll) bağlamak için kullan. "Higgsfield", "OpenHiggsfield", "Seedance", "Kling", "AI video üret", "AI arka plan üret" denildiğinde.
metadata:
  version: 1.0.0
  source_repo: https://github.com/wide-trace/open-higgsfield (@ b16a0ef, lisans dosyası yok — kodu projeye kopyalama)
---
# OpenHiggsfield — AI görsel/video stüdyosu

Açık kaynak, kendi barındırılan bir Higgsfield alternatifi: tek prompt kutusu, 38 model (8 görsel, 30 video), galeri. Next.js 16 uygulaması. **Üretim ücretlidir** ve kullanıcının kendi platform anahtarıyla yapılır.

## Önce hafıza
- `vault/02-Kanal/Marka Rehberi.md` (görsel stil), ilgili video notu ve varsa prompt notu (ör. `Eksi100 Hikaye - Gorsel Promptlari`).
- `vault/03-Bilgi/` içinde Higgsfield/AI görsel notları.

## Kurallar (pazarlıksız)
1. **Anahtar:** Platform anahtarı `id:secret` formatında. Sohbete yazdırma, koda/commit'e koyma. Bulut oturumunda `request_credential` (header `Authorization`, prefix `Key`) kullan; yerelde studio'nun "Add key" penceresi (httpOnly cookie).
2. **Maliyet:** Her üretim para harcar. Toplu üretimden önce kaç istek, hangi model, hangi süre/çözünürlük olduğunu kullanıcıya söyle ve onay al. Deneme için önce tek, düşük çözünürlüklü istek.
3. **Uydurma yok:** Bir üretimin bittiğini, ancak durum `completed` olup çıktı URL'si indirildiğinde ve `ffprobe` ile doğrulandığında söyle.
4. **İçerik:** Gerçek kişilerin benzerini, marka/logo taklidini, telifli karakterleri üretme. NSFW/başarısız sonuçları gizleme, raporla.

## A) Studio'yu çalıştırmak (kullanıcının bilgisayarında)
```bash
git clone https://github.com/wide-trace/open-higgsfield.git tools/open-higgsfield
cd tools/open-higgsfield && pnpm install && pnpm dev   # http://localhost:3000
```
Ortam değişkenleri: `HF_API_BASE_URL` (üretim API kökü, sadece sunucu), `OPEN_HIGGSFIELD_READ_WRITE_TOKEN` (yükleme için Vercel Blob token'ı; görsel referans yüklemek gerekmiyorsa boş kalabilir). Barındırılan sürüm: openhiggsfield.ai.
`tools/` klasörünü repoya commit etme (`.gitignore`'a ekle) — sadece yerel kopya.

## B) API ile programatik üretim (studio'nun kullandığı sözleşme)
- Kimlik doğrulama: `Authorization: Key <id:secret>`
- Gönder: `POST {HF_API_BASE_URL}/{model-path}` gövde = modelin girdileri (ör. `prompt`, `aspect_ratio`, görüntüden-videoda `image_urls`, süre/çözünürlük). Yanıt: `request_id`, `status`, `status_url`, `cancel_url`.
- Durum: `GET {HF_API_BASE_URL}/requests/{request_id}/status` → `status`; bitince `images[].url` (görsel) veya `video.url` (video); hata varsa `error`.
- Model yolları studio'nun kataloğunda: `src/generation/catalog/*.ts` (ör. `kling-video/v2.6/pro/text-to-video`, `minimax/h3/text-to-video`, `wan/v2.7/text-to-video`, `recraft/v4.1/text-to-image`, `ideogram/v4.0`). **Model yolunu ve ayar adlarını tahmin etme**: katalogdan oku; çalışan sürüm farklıysa API hata gövdesine bak.
- Yoklama: birkaç saniye arayla; zaman aşımında isteği körlemesine yeniden gönderme (çift ücret), önce durumu sorgula.
- CDN URL'leri kalıcı değildir → sonucu hemen indir.

## C) Remotion videolarımıza bağlamak
1. Prompt'u video notundaki sahne tablosundan ve `Marka Rehberi` stilinden yaz (insan yok, yazı yok, 9:16 ya da 16:9, alt-orta boş — karakter ve altyazı bizden).
2. Görsel → `video/public/<slug>/bg/<sahne>.png` (Eksi100Hikaye gibi `getStaticFiles()` ile otomatik algılanan yuvaya). Video klip → `video/public/<slug>/clips/<sahne>.mp4`, Remotion'da `<Video>` (`@remotion/media`).
3. Çözünürlük: 9:16 Shorts için 1080×1920 ve üstü; 4K hedefinde en yüksek çözünürlüğü seç.
4. `npx remotion still` ile kontrol karesi al ve bak: stil tutarlılığı, altyazı alanı boş mu, istenmeyen yazı/logo var mı.
5. Video notuna: model, prompt, ayarlar, request_id, maliyet tahmini, dosya yolu.

## Kalite kriterleri
- Anahtar hiçbir yerde açık metin değil; maliyet onayı alınmış.
- Her çıktı indirildi, doğrulandı, doğru yuvaya kondu, nota yazıldı.
- Model yolları katalogdan alındı, uydurulmadı.

## Sonra
`vault-memory` → `retro`. Sıradaki: `yt-video` (render).

## Öğrenilenler
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-14): ilk sürüm — kaynak: repo README + `src/generation/{platform,credentials,actions}.ts`, `catalog/`.
