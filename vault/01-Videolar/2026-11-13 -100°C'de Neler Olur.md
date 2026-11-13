---
tags: [video, shorts, ne-olurdu-serisi]
status: üretim
format: short
publish_date:
youtube_url:
remotion_comp: Eksi100
skills_used: [yt-video, retro, vault-memory]
---
# -100°C'de Neler Olur? (Shorts)

Kaynak: Kullanıcının Claude chat'te ürettiği 53 sn'lik video (576×1024), Remotion'da koddan yeniden kuruldu.

## 1. Fikir
- Vaat: "Dünya -100°C olsaydı 8 şeye ne olurdu — 50 saniyede."
- Seri: **"Ne olurdu?"** (son sahnede CTA: "bir sonraki 'ne olurdu?' için takip et")

## 2. Araştırma
- Rekor: **-89,2°C**, Vostok İstasyonu, Antarktika, 21 Temmuz 1983 (standart hava sıcaklığı ölçümü). Yüksek güven.
- Not: Uydu ölçümleriyle Doğu Antarktika platosunda yüzey (kar yüzeyi) sıcaklığı ~-98°C civarı tespit edildi (2018). "Henüz hiç ölçülmedi" ifadesi **hava sıcaklığı** için doğru; yorumlarda itiraz gelirse bu ayrım kullanılır.

## 3. Senaryo (sahne tablosu)
| # | Süre | Rozet | Metin | Ekranda |
|---|---|---|---|---|
| 0 | 0–4 | SICAKLIK DÜŞÜYOR | Dünya -100°C olsaydı ne olurdu? | Şehir, 18°→-100° sayaç, termometre, kırağı |
| 1 | 4–10 | 1 · İNSAN | Açıktaki cilt saniyeler içinde donar. Dakikalar içinde hipotermi başlar. | Figür yürür → buzlanır → buz bloğu |
| 2 | 10–16 | 2 · SU | Borular patlar, göller ve denizler katılaşır. | Göl soldan sağa donar, boru buzlanıp patlar |
| 3 | 16–21 | 3 · ELEKTRONİK | Piller çöker, telefonlar ve bilgisayarlar kapanır. | Batarya %100→72→21→0, ekran kararır |
| 4 | 21–27 | 4 · ARAÇLAR | Yağ koyulaşır, yakıt jelleşir, lastikler kırılganlaşır. | Çalışan araba buzlanır, lastik çatlar |
| 5 | 27–33 | 5 · ELEKTRİK | Kablolar kopar, şehir karanlığa gömülür. | Kablolar buzlanır, kopar, ışıklar söner |
| 6 | 33–38 | 6 · YAPILAR | Beton ve çelik çatlar, binalar zarar görür. | Bina buzlanır, saçak buzu, çatlaklar |
| 7 | 38–43 | 7 · DOĞA | Bitkiler ölür, tarım biter. | Yeşil çayır → donmuş, güneş solar |
| 8 | 43–48 | 8 · HAVA | Nefesin çıkar çıkmaz buz kristallerine dönüşür. | Nefes → buz kristali |
| 9 | 48–53 | SON | Takip et, bir sonraki "ne olurdu?" için. | Rekor -89,2°C vs -100°C? |

## 4. Üretim (Remotion)
- Kompozisyon: `Eksi100` (1080×1920, 30 fps, 1590 kare = 53 sn)
- Kod: `video/src/videos/eksi-100/` → `index.tsx` (layout + zaman çizelgesi `SCENES`), `scenes/*.tsx` (her sahne SVG)
- Metinler `Root.tsx` → `defaultProps.captions` (Studio'dan düzenlenebilir)
- Ses: `video/public/eksi-100/wind.mp3` — ffmpeg ile üretilmiş rüzgar (kahverengi gürültü + lowpass + 0,25 Hz tremolo), orijinalle aynı seviye (~-32 dB ort.)
- Font: Inter (`@remotion/google-fonts`)
- Render: `cd video && npx remotion render Eksi100 out/eksi-100.mp4`

## 5. Thumbnail & Başlık
- (yapılacak)

## 6. SEO
- (yapılacak)

## v2 — Hikâyeli versiyon (kullanıcı v1'i "çok basit" buldu)
- Kompozisyon: `Eksi100Hikaye` (1080×1920, 52 sn, 8 sahne) → `video/src/videos/eksi-100-hikaye/`
- Konsept: "-100°C — KAÇ SAAT DAYANIRSIN?" Karakterin bir günü: pencere → kapı (nefes buza dönüşür) → araba (akü/yağ) → elektrik kopar → borular patlar → telefon ölür → soba → gerçek rekor -89,2°C + soru CTA.
- Senaryo/anlatım metni: `story.ts` (her sahnede `narration`, `clock`, `sec`).
- Arka planlar: AI görselleri bekleniyor → [[Eksi100 Hikaye - Gorsel Promptlari]]. Gelene kadar zengin SVG çizimler.
- Seslendirme: Türkçe AI ses seçildi. ElevenLabs anahtarı verilmedi; yerel TTS (Piper) modelleri engelli adreste. **Bekliyor:** `public/eksi-100-hikaye/voice/<sahne>.mp3` gelince otomatik eklenir.
- Ses efektleri koddan: `sfx/crack.mp3`, `zap.mp3`, `fire.mp3` (ffmpeg).
- Ortam: bu repo için kişisel "Yt" cloud ortamı oluşturuldu (setup: `video/` npm install).

## Dersler
- Bkz. [[2026-11-13-yt-video-stil-cok-basit]], [[2026-11-13-yt-video-referanstan-yeniden-uretim]], [[2026-11-13-yt-video-blur-render-yavas]]

Bkz: [[Videolar MOC]], [[Remotion Notları]]
