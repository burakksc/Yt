---
name: whisper-transcribe
description: Whisper ile yerel transkripsiyon (Türkçe dahil) — seslendirme/video kaydından kelime zamanlı metin, SRT/VTT altyazı ve Remotion caption JSON'u üretmek, WordCaptions'ı gerçek ses zamanlamasına bağlamak, video araştırması için dökümü çıkarmak. "Transkript", "altyazı çıkar", "deşifre", "whisper", "sesi yazıya dök", "kelime zamanlaması" denildiğinde kullan.
metadata:
  version: 1.0.0
---
# Whisper — yerel transkripsiyon

## Önce hafıza
- İlgili video notu (seslendirme dosyaları nerede, dil, hedef altyazı biçimi).
- `vault/03-Bilgi/Remotion Notları.md` (caption tuzakları, Türkçe büyük harf kuralı).

## Yol seçimi
| Durum | Araç |
|---|---|
| Varsayılan, CPU yeter (Mac/PC) | `openai-whisper` (Python CLI) |
| Hız/bellek önemli | `faster-whisper` veya whisper.cpp (`@remotion/install-whisper-cpp`) |
| Remotion içinde GPU ile | `remotion-captions` skill'i → `transcribe-captions.md` (`@remotion/whisper-webgpu`) |
Model boyutu: Türkçe için en az `small`; kalite önemliyse `medium`/`large-v3`. `tiny`/`base` Türkçede hatalı.

## Ortam notu
Bu bulut ortamında model indirme adresleri (openaipublic.azureedge.net, huggingface.co) **engelli** → transkripsiyonu kullanıcının bilgisayarında çalıştır ya da kullanıcıdan host izni iste. Model yoksa sessizce başka sağlayıcıya (bulut API) geçme; söyle.

## openai-whisper adımları
```bash
pip install -U openai-whisper          # ffmpeg PATH'te olmalı
whisper voice.mp3 --language tr --model small \
  --word_timestamps True --output_format all --output_dir transcripts/
```
Çıktılar: `.txt`, `.srt`, `.vtt`, `.json` (segment + kelime zamanları).

## Remotion'a bağlama
1. `.json` → Remotion `Caption[]` biçimine çevir: her kelime için `{text, startMs, endMs, timestampMs, confidence}` (bkz. `@remotion/captions`). Kelime metninin başındaki boşluğu koru (Remotion caption kuralı).
2. `WordCaptions` şu an zamanlamayı metin uzunluğundan tahmin ediyor; gerçek ses varsa kelime zamanlarını kullan ve sahne geçişlerini/`wordStartFrame` cue'larını bu zamanlara göre ayarla.
3. Ekranda **Türkçe büyük harf**: `toLocaleUpperCase("tr-TR")`.
4. Transkripti senaryoyla karşılaştır: farklı kelimeler varsa (özel isimler, sayılar) düzelt; ekrana yanlış kelime yazma.

## Kalite kriterleri
- Dil açıkça `tr` verildi, model ≥ small.
- Özel isimler/sayılar senaryoyla karşılaştırılıp düzeltildi.
- Altyazı zamanları ses ile ±150 ms içinde (kontrol karesi + dinleme).
- Transkript dosyası video notuna linklendi.

## Sonra
`vault-memory` → `retro`. Sıradaki: `yt-video` (render).

## Öğrenilenler
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-14): ilk sürüm — kullanıcı isteği ("whisper ekle"); hazır upstream skill yoktu.
