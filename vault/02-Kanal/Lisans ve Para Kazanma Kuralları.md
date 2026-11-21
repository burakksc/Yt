---
tags: [kanal, lisans, monetizasyon]
updated: 2026-11-17
---
# Lisans ve para kazanma kuralları (Interestingly Cozy)
**Kullanıcı kuralı (2026-11-17, tekrar vurgulandı):** "Kesinlikle para kazanmayı engelleyecek bir içerik olmasın, videolarımızın hiçbirinde."

**Kullanıcı kuralı (2026-11-17):** "Kanalın tamamen para kazanmaya uyumlu olması gerekiyor." → Her video, yayından önce bu listeden geçer. Ticari kullanıma izin vermeyen (NC / non-commercial) hiçbir şey kullanılmaz.

## Bileşen bileşen
| Bileşen | Uygun ✅ | Kullanma ❌ |
|---|---|---|
| **Seslendirme** | Kendi sesimiz; **Kokoro-82M yerel TTS (Apache-2.0) — kanal sesleri am_michael, bm_lewis**; ticari kullanıma izin veren ücretli TTS (Google Cloud TTS, Azure Speech resmi API, ElevenLabs **ücretli** plan, OpenAI TTS) — her birinin güncel şartları kullanımdan önce okunup nota yazılır | Piper `tr_TR-dfki-medium` (CC BY-NC-SA), Meta MMS-TTS (NC), Coqui XTTS (CPML, NC), ElevenLabs ücretsiz plan, `edge-tts` (resmi olmayan uç nokta) |
| **Müzik / ses efekti** | Kendi koddan ürettiğimiz; Wikimedia Commons kamu malı / CC0 / CC BY(-SA) kayıtlar (atıf açıklamaya) (`make_music_bed.py`, `make_rain_ambience.py`); YouTube Ses Kitaplığı (atıf istiyorsa açıklamaya yaz); satın alınmış ticari lisans | İnternetten indirilen şarkılar, "royalty free" yazan ama lisansı belirsiz parçalar, başka videolardan kesitler |
| **Görsel** | Koddan çizdiğimiz (Remotion/SVG/three.js); kendi ürettiğimiz AI görseller (aracın şartları ticari kullanıma izin veriyorsa: Flow/Nano Banana, Higgsfield ücretli plan — kullanımdan önce kontrol) | Google Görseller'den alınanlar, başka kanalların kareleri, referans ekran görüntüleri (sadece ilham) |
| **Yazı tipi** | Google Fonts (OFL): Inter, Nunito | Lisansı belirsiz fontlar |
| **Bilgi / metin** | Bilgiler kaynaktan, **cümleler bizim**; kaynaklar açıklamada | Makaleden paragraf kopyalamak, Wikipedia metnini aynen okumak |
| **Araçlar** | Remotion: ekip ≤ 3 kişi ücretsiz (büyürsek lisans al → `remotion-license`); ffmpeg, Blender: ücretsiz/ticari serbest | — |

## YouTube politikaları (lisans dışı ama para kazanmayı etkiler)
- **Özgün içerik:** Tekrarlayan, seri üretim gibi görünen içerik ("inauthentic / repetitious content") para kazanmadan çıkarılabilir. Ambiyans videolarında her videonun kendi görseli, sesi, başlığı olsun; aynı döngüyü farklı başlıkla tekrar yükleme.
- **AI açıklaması:** Gerçekçi görünen sentetik/değiştirilmiş içerikte (ör. gerçek yer gibi duran AI görüntü) YouTube Studio'daki "değiştirilmiş veya sentetik içerik" kutusu işaretlenir. Yapay zekâ sesi kullanırsak açıklamada belirtilir.
- **Doğruluk:** Efsaneler "efsane" diye etiketlenir (yanıltıcı içerik riskine karşı).

## Mevcut videoların denetimi (2026-11-17)
| Video | Görüntü | Ses | Font | Durum / yapılacak |
|---|---|---|---|---|
| Istanbul Beneath Istanbul (`IstanbulAlti`) | koddan | sentez | Inter (OFL) | ✅ Temiz. Kafatası çizgi film tarzı (şiddet/korku içeriği değil). James Bond sadece isim olarak geçiyor, görüntü yok ✅ |
| -100°C hikâye (`Eksi100Hikaye`) | koddan | sentez (rüzgâr, efekt) | Inter | ✅ Temiz. Seslendirme yok. |
| -100°C v1 (`Eksi100`) | koddan | sentez | Inter | ⚠️ v2 ile aynı konu → **ikisini birden yükleme** (tekrarlı içerik) |
| Bebek Slingi / Esnek Sargı | koddan | sentez müzik | Nunito (OFL) | ✅ Sağlık/bebek konusu: kaynaklı genel bilgi + "ebene/doktoruna danış" notu var (YouTube tıbbi yanlış bilgi politikasına uygun). |
| Cozy Alley Rain 1 saat | **kullanıcının Google Flow (Nano Banana) görseli** + kod efektleri | sentez | — | ⚠️ (1) Görsel AI: Flow/Google üretken AI şartlarında ticari kullanım iznini kullanıcı teyit etmeli. (2) Gerçekçi görünen AI sahne → YouTube Studio'da **"değiştirilmiş veya sentetik içerik"** kutusu işaretlenecek. (3) Uzun döngü videolarını seri üretme; her biri farklı görsel+ses olsun. |
| Kanal logosu | kullanıcının görseli (AI'a benziyor) | — | — | ⚠️ Hangi araçla yapıldıysa ticari kullanım şartı teyit edilmeli. |
| Sling (rigging), Test3D | — | — | — | Yayınlanmayacak (iptal / test). |

## Uygulama
- Her video notuna "Lisans" satırı: ses / müzik / görsel / font kaynağı + lisansı.
- `yt-publish` kontrol listesine eklenecek (feedback yazıldı).

Bkz: [[Kanal Kimliği]], [[Marka Rehberi]]

## Kural: her görsel/alıntıya referans (kullanıcı, 2026-11-21)
Kullanılan **her görsel ve her alıntı** için kaynak ver: videoda kare altı kredi (yazar · lisans · site), açıklamada "Images:" listesi (yazar, başlık, lisans, link) + "Sources:" (bilgi/alıntı kaynakları), kullanıcıya sunarken de aynı referanslar.

**Ek (2026-11-21):** Açıklamada her görsel için **hangi sahnede/karede kullanıldığı + kimden olduğu** yazılır: `<sahne/zaman> — <görsel adı>, by <yazar>, <lisans>, <URL>`.
