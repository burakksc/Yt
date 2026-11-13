---
name: skill-forge
description: Yeni skill oluşturma - tekrar eden ama skill'i olmayan işler için proje standardında SKILL.md + evals.md + vault kaydı üretir. "Yeni skill yap", "bunu skill'e çevir", "bu işi otomatikleştir", "skill oluştur" denildiğinde veya retro/skill-trainer `skill: (yok)` sinyali verdiğinde kullan.
metadata:
  version: 1.0.0
---
# Skill Forge — Yeni Skill Üret

## Ne zaman yeni skill?
- Aynı tür iş **2+ kez** skill'siz yapıldı (vault'ta `skill: (yok)` feedback'leri), veya kullanıcı açıkça istedi.
- Mevcut bir skill'e bir bölüm eklemek yetiyorsa yeni skill AÇMA → `skill-trainer` ile mevcut skill'i genişlet.

## Adımlar
1. **Kanıt topla:** ilgili günlük/feedback/video notlarından bu işin geçmişte nasıl yapıldığını çıkar (adımlar, takılınan yerler, kullanıcı düzeltmeleri).
2. **Ad:** kebab-case; YouTube işi ise `yt-` öneki. Mevcut skill'lerle çakışmasın: `ls .claude/skills`.
3. **description:** ne yapar + ne zaman kullanılır + tetikleyici Türkçe ifadeler (kullanıcının gerçekte kullandığı kelimeler). Description, skill'in doğru anda yüklenmesini sağlayan tek şeydir — en çok özeni bu alır.
4. **SKILL.md** — bu iskeleti kullan:
   ```markdown
   ---
   name: <ad>
   description: <ne + ne zaman + tetikleyiciler>
   metadata:
     version: 1.0.0
   ---
   # <Başlık>
   ## Önce hafıza
   (hangi vault notları okunur)
   ## Adımlar
   (numaralı, somut, doğrulanabilir)
   ## Kalite kriterleri
   (eval'ların kontrol edeceği maddeler)
   ## Sonra
   (vault'a ne yazılır → vault-memory → retro; sıradaki skill)
   ## Öğrenilenler
   - (henüz yok)
   ## Changelog
   - 1.0.0 (YYYY-MM-DD): ilk sürüm — kaynak: <feedback/notlar>
   ```
5. **evals.md:** en az 2 vaka (normal akış + bilinen bir tuzak). Kanıttaki gerçek durumlardan türet.
6. **Hızlı test:** bir alt-ajana yeni SKILL.md + E1 girdisini ver, plan iste; kalite kriterlerine göre değerlendir; gerekirse düzelt.
7. **Kaydet:**
   - `vault/04-Skills/<ad>.md` notu (amaç, tarih, kaynak).
   - `vault/04-Skills/Skills MOC.md` tablosuna ekle.
   - `CLAUDE.md` içindeki skill listesine ekle.
   - Kaynak `skill: (yok)` feedback'lerini `status: uygulandı` yap.

Gelişmiş ihtiyaçlar (description tetikleme optimizasyonu, varyans analizli benchmark) için `anthropic-skills:skill-creator` skill'i mevcutsa onu da kullan.

## Öğrenilenler
- (henüz yok)

## Changelog
- 1.0.0 (2026-11-13): ilk sürüm.
