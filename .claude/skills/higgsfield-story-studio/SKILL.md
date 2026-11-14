---
name: higgsfield-story-studio
description: OpenHiggsfield Story Studio (github.com/thehiggsfieldai/OpenHiggsfield, MIT) — karakter seç/yükle, 1 dakikalık hikâye yaz, 6 sahne + anlatım + maliyet tahmini al, fal veya Higgsfield anahtarıyla sahneleri üretip MP4'e birleştir. Kurulum (Docker veya yerel), kullanım ve çıkan film/kliplerin kanal videolarımıza bağlanması için kullan. "Story Studio", "OpenHiggsfield hikâye", "karakterden film", "AI ile 1 dakikalık film" denildiğinde.
metadata:
  version: 1.0.0
  source_repo: https://github.com/thehiggsfieldai/OpenHiggsfield (@ a950796, MIT)
---
# OpenHiggsfield Story Studio — karakterden 1 dakikalık film

Kendi barındırılan stüdyo: **karakter → hikâye → 6 sahne + anlatım yönergeleri → maliyet tahmini → üretim → birleştirilmiş MP4**. Higgsfield.ai ile bağlantılı değildir. Üretim kullanıcının fal veya Higgsfield hesabıyla, **ücretli** yapılır.

## Ne zaman bu, ne zaman bizim Remotion hattımız?
| İhtiyaç | Seç |
|---|---|
| Gerçekçi/sinematik AI video klipleri, karakterli kısa film | Story Studio |
| Doğru bilgi, adım adım eğitim, diyagram, metinle birebir senkron, sıfır üretim maliyeti | Remotion (`yt-video`) |
| İkisi birden | Story Studio klipleri → Remotion'da altyazı/HUD/marka katmanı ile birleştir |
Kanalın eğitim videolarında (ör. bebek sargısı) **adımların doğruluğu** önemli: AI video modelleri bağlama adımlarını yanlış çizebilir → doğruluk gereken sahnelerde Remotion kullan.

## Kurallar
1. **Anahtarlar:** fal/Higgsfield anahtarları stüdyonun içindeki **Connections** ekranına girilir (sunucuda şifreli saklanır). Frontend koduna, `.env`'e, sohbete, commit'e koyma.
2. **Maliyet:** Stüdyonun gösterdiği tahmin fatura değildir. Üretimden önce kullanıcıya tahmini ve sahne sayısını söyle, onay al.
3. **Karakterler:** Hazır 50 karakter proje varlığıdır; kod lisansı (MIT) üçüncü taraf isim/marka/benzerlik hakkı vermez. Gerçek kişi yüklemesi → sadece kişinin izni varsa.
4. **Uydurma yok:** Film bitti demeden önce MP4'ü indir, `ffprobe` ile süre/çözünürlük/ses doğrula.

## Kurulum (kullanıcının bilgisayarı veya sunucusu)
### Docker (önerilen)
```sh
git clone https://github.com/thehiggsfieldai/OpenHiggsfield.git tools/openhiggsfield-story
cd tools/openhiggsfield-story && cp .env.example .env
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"   # → BETTER_AUTH_SECRET
# .env: BETTER_AUTH_SECRET, PUBLIC_ORIGIN; giriş için RESEND_API_KEY + EMAIL_FROM;
#       SIGNUP_EMAILS (davetli e-postalar) veya ALLOW_SIGNUP=true
docker compose up --build -d     # http://localhost:3000
```
Veri klasörünün (şifreleme anahtarı dahil) yedeğini al; veri klasörü başına tek uygulama süreci.
### Yerel geliştirme
Node 24+ ve PATH'te FFmpeg (gerekirse `FFMPEG_PATH`).
```sh
npm ci && npm ci --prefix apps/story-studio
npm run dev                                   # sunucu
npm --prefix apps/story-studio run dev        # arayüz → http://127.0.0.1:5193 (localhost test girişi)
```
`tools/` klasörünü repoya commit etme.

## Akış
1. Giriş yap → **Connections**'a fal veya Higgsfield bağlantısı ekle.
2. Karakter seç (50 hazır) ya da görsel yükle.
3. 1 dakikalık hikâyeyi yaz — senaryoyu `yt-script` ile hazırla (hook ilk 3 sn, 6 sahneye bölünebilir yapı).
4. 6 sahne, anlatım yönergeleri ve maliyet tahminini gözden geçir; düzelt.
5. Onaydan sonra üret; sahne bazında ilerlemeyi izle; birleştirilmiş MP4'ü indir.

## Kanal videolarımıza bağlamak
- Film/klipleri `video/public/<slug>/clips/` altına koy; Remotion'da `<Video>` (`@remotion/media`) ile sahnelere yerleştir, üstüne bizim `WordCaptions`, HUD ve marka katmanımızı ekle.
- 9:16 Shorts gerekiyorsa üretim oranını baştan dikey seç; sonradan kırpmak kompozisyonu bozar.
- Anlatım sesi: model sesi tutarsız olabilir → gerekirse `voicestudio` ile Türkçe seslendirme üret ve üstüne koy.
- Video notuna: karakter, sahne promptları, sağlayıcı/model, tahmini ve gerçek maliyet, dosya yolları.

## Kalite kriterleri
- Anahtarlar sadece Connections'ta; maliyet onayı alınmış.
- Doğruluk gerektiren eğitim adımları AI klibe bırakılmamış (ya da kontrol edilip düzeltilmiş).
- MP4 doğrulandı, nota yazıldı.

## Sonra
`vault-memory` → `retro`. Sıradaki: `yt-video` (Remotion katmanı) veya `yt-seo`.

## Öğrenilenler
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-14): ilk sürüm — kaynak: repo README, `.env.example`.
