---
name: retro
description: Her iş/görev bitiminde kısa retrospektif - ne iyi gitti, ne kötü gitti, kullanıcı neyi düzeltti - ve bunu skill'leri eğitecek feedback notlarına dönüştürme. Bir skill kullanılarak yapılan her işin sonunda, kullanıcı bir çıktıyı düzelttiğinde veya "bunu bir daha yapma / hep böyle yap" dediğinde kullan.
metadata:
  version: 1.0.0
---
# Retro — Dersleri Yakala

Eğitim döngüsünün **veri toplama** adımı. Skill'ler ancak buradan gelen veriyle gelişir.

```
iş (yt-* skill) → retro → vault/04-Skills/feedback/*.md → skill-trainer → SKILL.md güncellenir
```

## Ne zaman
- Bir skill ile yapılan iş bittiğinde (otomatik, kısa).
- Kullanıcı bir çıktıyı düzelttiğinde → **her zaman** (en değerli veri).
- Kullanıcı "hep böyle yap / bir daha yapma" dediğinde → **her zaman**, `type: kullanıcı-düzeltmesi`, `severity: yüksek`.
- Skill'siz yapılan bir iş tekrar ettiğinde → `type: eksik`, `skill: (yok)` (skill-forge için sinyal).

## Adımlar
1. Kendine 4 soru (cevaplar kısa):
   - Hangi skill(ler) kullanıldı?
   - Kullanıcı neyi düzeltti / neye itiraz etti?
   - Nerede tahmin ettim, takıldım, tekrar denedim?
   - Skill'deki hangi talimat bunu önlerdi?
2. Sadece **uygulanabilir** dersler için feedback yaz. "Daha dikkatli ol" gibi genel ders yazma; "Shorts altyazısında üst 250px kullanma" gibi somut kural yaz.
3. Her ders için `vault/_Templates/Skill-Feedback.md` → `vault/04-Skills/feedback/YYYY-MM-DD-<skill>-<kısa-konu>.md`.
   - Kanıt alanı zorunlu: dosya yolu, komut çıktısı veya kullanıcı alıntısı.
4. Başarılar da yazılır (`type: başarı`) — skill-trainer neyin korunması gerektiğini bilsin. Ama sadece yeni/öğretici olanları.
5. Günlüğe tek satır: "retro: N feedback (skill-a, skill-b)".
6. Aynı skill için **3+ açık feedback** veya **1 yüksek önem** varsa kullanıcıya `skill-trainer` çalıştırmayı öner (ya da kullanıcı izin verdiyse çalıştır).

## Kurallar
- Feedback yazmak zorunlu değil: ders yoksa "retro: ders yok" yeter. Gürültü üretme.
- Kullanıcıyı suçlayan veya belirsiz not yok.

## Öğrenilenler
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-13): ilk sürüm.
