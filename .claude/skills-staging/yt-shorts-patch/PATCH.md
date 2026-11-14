# Önerilen yama — `yt-shorts` 1.0.0 → 1.1.0

> Durum: **öneri** (uygulanmadı). `skill-trainer` ile uygula.
> Kaynak fikir: Jakeschincariol/youtube-agent-skill `yt-shorts` (MIT, SkillSpector statik: 0 bulgu). Metin bizim; Remotion 9:16 bölge planımıza (yt-video) bağlandı.

## Neden
Mevcut 1. adım "kendi başına anlaşılır, tek fikir, güçlü ilk cümle" diyor ama ölçütü yok ve uzun videonun ilk cümlesini olduğu gibi kullanmaya açık. Kaynak repo net bir 3 koşullu seçim ve **yeni ilk cümle** kuralı veriyor.

## Değişiklik 1 — "Adımlar" 1. maddeyi değiştir
```markdown
1. Kaynak senaryodan/transkriptten 20–55 sn'lik aralıklar seç; üç koşulun **hepsi** doğru olmalı:
   (a) tam bir düşünceyle açılıyor (önceki dakikaya ihtiyaç duymuyor),
   (b) içinde bir **dönüş** var (iddia → onu karmaşıklaştıran/kanıtlayan şey),
   (c) bir cümleyle bitiyor, sönerek değil.
   En iyi 5 adayı zaman kodu + ilk cümleyle listele (kullanıcı transkripti okumadan eleyebilsin). `yt-retention` verisi varsa yüksek tutulan bölümleri öne al; uçurum anlarını alma.
```

## Değişiklik 2 — "Adımlar" 2. maddeye ekle
- **Yeni ilk cümle yaz:** uzun videodaki cümle bu izleyicinin bilmediği bağlamı varsayar. Yeni cümleyi `yt-script` hook rubriğiyle puanla.
- **İlk 2 sn ekran metni:** konuşulan cümleden **farklı** kelimeler (ShortsHook bileşeni), `toLocaleUpperCase("tr-TR")`.
- **Döngü noktası:** son cümle, ilk cümlenin cevapladığı şeyi kurar.
- **Kırpma notu:** 16:9 sahne yeniden kullanılıyorsa 9:16'da ne kesiliyor, önemli mi? (yt-video 9:16 bölge planı: ana aksiyon y=300–1420, altyazı 1480–1700.)

## Değişiklik 3 — "Kalite kriterleri"ne ekle
- Her Short için üç seçim koşulu yazılı olarak işaretlenmiş.
- İlk cümle uzun videodakinden farklı ve puanlanmış; ekran metni konuşmayı tekrar etmiyor.

## Eklenecek eval
```markdown
## E-S1: Bağlam bağımlı açılış
- Girdi: Aday aralık "Bu yüzden de, az önce dediğim gibi, sıcaklık düşüyor…" ile başlıyor.
- Beklenen: (a) koşulu başarısız sayılır veya yeni ilk cümle yazılır; ekran metni farklı kelimeler; son cümle döngü kurar.
```
