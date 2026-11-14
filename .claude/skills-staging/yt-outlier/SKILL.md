---
name: yt-outlier
description: Nişimizde ŞU AN neyin işe yaradığını bulma - rakip kanalların videolarını ham izlenmeye göre değil, her kanalın KENDİ medyanını kaç kat geçtiğine göre sıralama, ortak yapıyı ve hook kalıbını adlandırma, bize uyarlanabilir 3 fikre çevirme. "Nişte ne tutuyor", "viral videolar", "rakipler ne yapıyor", "outlier bul", "bu video neden patladı", "fikir havuzu için araştır", "swipe file" denildiğinde kullan. yt-idea'dan önce veya onunla birlikte çalışır.
metadata:
  version: 1.0.0
---
# YT Outlier — Kanal Medyanına Göre Başarı Avı

Ham izlenme kanal büyüklüğünü ölçer, fikri değil. Bu skill **"bu video kendi kanalının normalini kaç kat geçti?"** sorusunu sorar; o soru videonun kendisi hakkındadır.

## Önce hafıza
- `vault/02-Kanal/Kanal Kimliği.md`, `Hedef Kitle.md` — niş ve kitle.
- `vault/03-Bilgi/Hook Kalıpları.md` — kalıp adları (bulunan başlıkları bunlara eşleyeceğiz).
- `vault/00-Inbox/Fikir Havuzu.md` ve `vault/01-Videolar/Videolar MOC.md` — zaten yapılan/bekleyen fikirler.
- Varsa önceki tarama: `vault/03-Bilgi/Rakip Kanallar.md` (yoksa bu skill oluşturur).

## Adımlar
1. **Kanal listesi:** nişimizden 5–10 kanal (kullanıcıdan al veya `Rakip Kanallar` notundan). Farklı büyüklükte olsun; küçük kanalın 10x'i büyük kanalın 1.2x'inden daha öğreticidir.
2. **Veri topla — indirme yok, sadece metadata.** Bu bulut ortamında youtube.com engelli: komutu kullanıcıya ver, kendi bilgisayarında çalıştırsın (`yt-dlp` skill'i kuralları geçerli):
   ```bash
   mkdir -p arastirma/outlier
   yt-dlp --flat-playlist --playlist-end 30 --print "%(id)s\t%(title)s\t%(duration)s\t%(view_count)s" \
     "https://www.youtube.com/@KANAL/videos" > arastirma/outlier/KANAL.tsv
   ```
   Sadece herkese açık liste; giriş yapılmış oturum/çerez **kullanılmaz**. Veri gelmezse sahte sayı üretme, durumu söyle.
3. **Hesapla:** `python3 -I .claude/skills/yt-outlier/scripts/outlier.py arastirma/outlier/*.tsv --min 2.0 --atla-son 2`
   - Long-form ve Shorts **ayrı** çalıştırılır (`--shorts`); karışırsa medyan anlamsızlaşır.
   - Kanal başına <4 video → betik kanalı atlar ve söyler.
   - En yeni 2 video atlanır (henüz izlenme toplamadılar).
4. **Oku:** ilk 5 outlier için: kat sayısı, başlık, eşlenen hook kalıbı (`Hook Kalıpları` adlarıyla; yoksa yeni kalıp öner). Kalıp eşlemesi **başlık hakkında bir yargıdır**, videonun neden tuttuğunun kanıtı değildir — bunu çıktıda açıkça söyle.
5. **Ortak yapı:** 5 videonun paylaştığı **tek** yapısal şeyi yaz (ör. "hepsi sayı + zaman sınırı", "hepsi 'ya … olursa' senaryosu").
6. **Uyarlama:** bize uygun 3 fikir — her biri tek cümlelik vaat (yt-idea formatı), bizim görsel stilimizle (illüstrasyon + maskot, Remotion) üretilebilir mi notuyla. Kopya değil: aynı **yapı**, bizim konumuz ve açımız.

## Kalite kriterleri
- Sıralama ham izlenmeye değil kanal medyanına göre; her satırda kat sayısı ve kaynak URL var.
- Long-form ve Shorts karıştırılmamış; <4 videolu kanallar atlandığı söylenmiş.
- Kalıp eşlemesi "yargı" olarak işaretli; uydurma neden-sonuç yok.
- Uyarlanan fikirler rakip başlığın çevirisi/kopyası değil; tek cümlelik vaat formatında.
- youtube.com erişimi yoksa sahte veri yok.

## Sonra
- `vault/03-Bilgi/Rakip Kanallar.md` (yoksa oluştur, [[Bilgi MOC]]'a ekle): kanal listesi + tarih + ilk 5 outlier tablosu.
- 3 fikir → `vault/00-Inbox/Fikir Havuzu.md` (kaynak: outlier URL + kat).
- Yeni kalıp bulunduysa `Hook Kalıpları` tablosuna satır.
- `vault-memory` → `retro`. Sıradaki: `yt-idea` (puanlama) veya `yt-research`.

## Öğrenilenler
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-14): ilk sürüm (staging). "Kanal medyanına göre kat" ölçütü ve "kalıp eşlemesi yargıdır" uyarısı Jakeschincariol/youtube-agent-skill `yt-viral` (MIT) fikrinden öğrenildi (SkillSpector statik: 0 bulgu). Metin ve `scripts/outlier.py` bizim (yt-dlp skill'imize ve bulut ağ kısıtına göre) sıfırdan yazıldı. — kaynak: [[Skill Araştırması 2026-11]]
