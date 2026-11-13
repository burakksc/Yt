---
name: vault-memory
description: Ortak hafıza (Obsidian vault) okuma/yazma. Her oturumun başında bağlam yüklemek, iş bitince not/günlük güncellemek, Inbox'ı işlemek, "hatırla", "not al", "hafızaya yaz", "daha önce ne konuşmuştuk" denildiğinde kullan.
metadata:
  version: 1.0.0
---
# Vault Memory — Ortak Hafıza

Hafıza `vault/` klasöründe, Obsidian uyumlu markdown. Giriş noktası: `vault/Home.md`.

## Ne zaman
- **Oturum başı (her zaman):** bağlam yükle.
- **İş bitince (her zaman):** iz bırak.
- Kullanıcı "hatırla / not al / unutma / daha önce…" dediğinde.

## Oturum başı: bağlam yükleme
1. `vault/Home.md` oku.
2. Son 3 günlük notu oku: `ls vault/05-Gunluk | sort | tail -3`.
3. İşle ilgili MOC'u ve notları oku (video ise `01-Videolar/`, kanal ise `02-Kanal/`).
4. İlgili skill'in `vault/04-Skills/<skill>.md` notundaki açık feedback'lere bak (`grep -l "status: açık" vault/04-Skills/feedback/*`).
5. Kullanıcıya bağlamı tekrar anlatma; sadece kullan.

## İş bitince: iz bırakma
1. Bugünün günlüğü `vault/05-Gunluk/YYYY-MM-DD.md` yoksa `_Templates/Gunluk.md`'den oluştur; "Yapılanlar"a tek satır + wikilink ekle.
2. Video ile ilgiliyse video notunun `status:` alanını ve ilgili bölümünü güncelle; [[Videolar MOC]] tablosunu güncelle.
3. Kalıcı bir bilgi öğrenildiyse `03-Bilgi/` altına atomik not aç veya mevcut nota ekle (önce `grep -ril` ile ara, kopya açma).
4. Bir karar alındıysa `06-Kararlar/` altına `_Templates/Karar.md` ile kayıt + [[Kararlar MOC]] güncelle.
5. Ardından `retro` skill'ini çalıştır (skill'leri eğiten geri bildirim için).

## Yazım kuralları
- Bir not = bir fikir. Başlık = dosya adı. Türkçe karakter serbest.
- Linkler `[[Not Adı]]` (kısa link). Her yeni not en az bir MOC'a veya nota bağlanır — yetim not yok.
- Frontmatter: en az `tags:`. Videolarda `status:`.
- Tarihler `YYYY-MM-DD`.
- Silme yok: eskiyen not `99-Arsiv/`'e taşınır.
- Sır/şifre/API anahtarı vault'a **asla** yazılmaz.

## Inbox işleme
`00-Inbox/` içindeki her notu: doğru klasöre taşı, MOC'a bağla, gereksizse arşivle.

## Kontrol (yetim not ve kırık link)
```bash
node scripts/vault-check.mjs
```

## Öğrenilenler
<!-- skill-trainer bu bölümü feedback'lere göre günceller. Elle silme. -->
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-13): ilk sürüm.
