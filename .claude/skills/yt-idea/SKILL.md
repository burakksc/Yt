---
name: yt-idea
description: YouTube video fikri üretme ve puanlama. "Video fikri", "ne çeksek", "konu bul", "fikir değerlendir" denildiğinde kullan. Çıktı vault'ta yeni video notu olur.
metadata:
  version: 1.0.0
---
# YT Idea — Fikir Üretme ve Seçme

## Önce hafıza
- `vault/02-Kanal/Kanal Kimliği.md`, `Hedef Kitle.md` oku. Boşsa önce kullanıcıyla 3 soruda doldur (niş, kitle, ton) ve kaydet.
- `vault/01-Videolar/Videolar MOC.md` → daha önce yapılanları tekrar önerme.
- `vault/00-Inbox/` → bekleyen fikirleri değerlendirmeye kat.

## Adımlar
1. 8–10 aday üret. Her aday: **tek cümlelik vaat** ("İzleyici bu videodan sonra X yapabilecek / Y'yi öğrenecek").
2. Her adayı puanla (1–5):
   - **Merak** (başlık tek başına tıklatır mı?)
   - **Kitle uyumu** ([[Hedef Kitle]] ile)
   - **Üretilebilirlik** (Remotion + mevcut asset ile yapılabilir mi?)
   - **Arama/trend** (insanlar bunu arıyor mu?)
   - **Shorts potansiyeli**
3. Toplam puana göre tablo. İlk 3 için 2'şer başlık adayı.
4. Kullanıcı seçer (sormadan seçme; öneriyi belirt).
5. Seçilen için `vault/_Templates/Video.md` → `vault/01-Videolar/YYYY-MM-DD <Kısa Başlık>.md`, `status: fikir`, "1. Fikir" bölümünü doldur. [[Videolar MOC]] tablosuna satır ekle.
6. Seçilmeyen iyi adaylar → `00-Inbox/Fikir Havuzu.md`'ye ekle.

## Kalite kriterleri
- Her vaat somut ve tek cümle; "X hakkında video" gibi konu-değil-vaat cümleleri yok.
- Puan tablosu var, gerekçeler kısa.
- Daha önce yapılmış konu tekrar önerilmemiş.

## Sonra
`vault-memory` (iz bırak) → `retro`. Sıradaki skill: `yt-research`.

## Öğrenilenler
<!-- skill-trainer günceller -->
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-13): ilk sürüm.
