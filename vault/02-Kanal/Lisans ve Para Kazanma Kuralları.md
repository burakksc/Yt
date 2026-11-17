---
tags: [kanal, lisans, monetizasyon]
updated: 2026-11-17
---
# Lisans ve para kazanma kuralları (Interestingly Cozy)
**Kullanıcı kuralı (2026-11-17):** "Kanalın tamamen para kazanmaya uyumlu olması gerekiyor." → Her video, yayından önce bu listeden geçer. Ticari kullanıma izin vermeyen (NC / non-commercial) hiçbir şey kullanılmaz.

## Bileşen bileşen
| Bileşen | Uygun ✅ | Kullanma ❌ |
|---|---|---|
| **Seslendirme** | Kendi sesimiz; ticari kullanıma izin veren ücretli TTS (Google Cloud TTS, Azure Speech resmi API, ElevenLabs **ücretli** plan, OpenAI TTS) — her birinin güncel şartları kullanımdan önce okunup nota yazılır | Piper `tr_TR-dfki-medium` (CC BY-NC-SA), Meta MMS-TTS (NC), Coqui XTTS (CPML, NC), ElevenLabs ücretsiz plan, `edge-tts` (resmi olmayan uç nokta) |
| **Müzik / ses efekti** | Kendi koddan ürettiğimiz (`make_music_bed.py`, `make_rain_ambience.py`); YouTube Ses Kitaplığı (atıf istiyorsa açıklamaya yaz); satın alınmış ticari lisans | İnternetten indirilen şarkılar, "royalty free" yazan ama lisansı belirsiz parçalar, başka videolardan kesitler |
| **Görsel** | Koddan çizdiğimiz (Remotion/SVG/three.js); kendi ürettiğimiz AI görseller (aracın şartları ticari kullanıma izin veriyorsa: Flow/Nano Banana, Higgsfield ücretli plan — kullanımdan önce kontrol) | Google Görseller'den alınanlar, başka kanalların kareleri, referans ekran görüntüleri (sadece ilham) |
| **Yazı tipi** | Google Fonts (OFL): Inter, Nunito | Lisansı belirsiz fontlar |
| **Bilgi / metin** | Bilgiler kaynaktan, **cümleler bizim**; kaynaklar açıklamada | Makaleden paragraf kopyalamak, Wikipedia metnini aynen okumak |
| **Araçlar** | Remotion: ekip ≤ 3 kişi ücretsiz (büyürsek lisans al → `remotion-license`); ffmpeg, Blender: ücretsiz/ticari serbest | — |

## YouTube politikaları (lisans dışı ama para kazanmayı etkiler)
- **Özgün içerik:** Tekrarlayan, seri üretim gibi görünen içerik ("inauthentic / repetitious content") para kazanmadan çıkarılabilir. Ambiyans videolarında her videonun kendi görseli, sesi, başlığı olsun; aynı döngüyü farklı başlıkla tekrar yükleme.
- **AI açıklaması:** Gerçekçi görünen sentetik/değiştirilmiş içerikte (ör. gerçek yer gibi duran AI görüntü) YouTube Studio'daki "değiştirilmiş veya sentetik içerik" kutusu işaretlenir. Yapay zekâ sesi kullanırsak açıklamada belirtilir.
- **Doğruluk:** Efsaneler "efsane" diye etiketlenir (yanıltıcı içerik riskine karşı).

## Uygulama
- Her video notuna "Lisans" satırı: ses / müzik / görsel / font kaynağı + lisansı.
- `yt-publish` kontrol listesine eklenecek (feedback yazıldı).

Bkz: [[Kanal Kimliği]], [[Marka Rehberi]]
