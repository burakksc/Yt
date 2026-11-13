---
tags: [skill-feedback]
skill: yt-video
date: 2026-11-13
type: kullanıcı-düzeltmesi
severity: yüksek
status: uygulandı
---
# Feedback: yt-video — Türkçe büyük harfte i → I hatası
**Görev:** `Eksi100Hikaye` altyazıları (BÜYÜK HARF).

**Ne oldu:** Kullanıcı: "Videodaki I ları İ olarak düzeltmen lazım." Altyazılar CSS `textTransform: "uppercase"` ile büyütülmüştü; tarayıcı varsayılan (İngilizce) kuralı uyguladı: "şehir" → "ŞEHIR", "eksi" → "EKSI" (doğrusu ŞEHİR, EKSİ).

**Kök neden:** Skill'de Türkçe metin/locale kuralı yok.

**Önerilen değişiklik:** Kurallara: "Türkçe metni büyük harfe çevirirken CSS `text-transform` kullanma; `str.toLocaleUpperCase('tr-TR')` kullan ve kök elemana `lang="tr"` ver. Kontrol karelerinde i/İ, ı/I harflerini ayrıca kontrol et." + eval vakası.

**Kanıt:** Kullanıcı mesajı (2026-11-13); düzeltme `video/src/videos/eksi-100-hikaye/index.tsx` (`toLocaleUpperCase("tr-TR")`, `lang="tr"`).

**Uygulandı:** yt-video v1.2.0 (2026-11-13). Eval: E8 yeni sürümle geçer (eski sürümde bu kural yoktu); E1–E7 etkilenmedi (yalnızca ekleme). Küçük kural eklemesi olduğu için alt-ajan çalıştırılmadı, zihinsel yürütme.
