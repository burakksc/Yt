# Önerilen yama — `yt-script` 1.0.0 → 1.1.0

> Durum: **öneri** (uygulanmadı). Uygulama `skill-trainer` ile: önce aşağıdaki eval'ları `.claude/skills/yt-script/evals.md`'ye ekle, önce/sonra çalıştır, sonra SKILL.md'yi düzenle.
> Kaynak fikir: Jakeschincariol/youtube-agent-skill `yt-script` + `hooks.json` (MIT, SkillSpector statik: 0 bulgu). Metin bizim; kalıp listesi Türkçe ve kendi örneklerimizle yeniden yazıldı.

## Neden
Şu anki skill "Hook (0–5 sn)" diyor ama **tek** hook üretiyor ve ölçmüyor. Kaynak repo iki şeyi iyi yapıyor: (1) birden çok hook üretip **puanlayarak** seçmek, (2) ilk 15 saniyenin üç işini tanımlamak. Bu ikisi `Hook Kalıpları` notumuzu da veriyle besler.

## Değişiklik 1 — "Yapı (long-form)" 1. maddeyi değiştir
```markdown
1. **Hook (0–15 sn) — üç iş:** (a) başlığın verdiği sözü ilk cümlede doğrula, (b) izleyicinin kapatamayacağı bir soru aç, (c) ödülün gerçekten var olduğunu göster (sonucun bir karesi, sayı, nesne). Selam, kanal tanıtımı, "abone olmayı unutmayın" YOK — 0:30 uçurumunun en sık nedeni.
   - **5 aday yaz**, her biri farklı kalıptan (aşağıdaki liste + `Hook Kalıpları`). Aşağıdaki rubrikle puanla, **ilk 2'yi puanlarıyla** kullanıcıya göster; tek hook teslim etme.
2. **Dönüş (15–45 sn):** videonun ne yapacağını tek cümleyle söyle ve hemen yapmaya başla.
```

## Değişiklik 2 — yeni bölüm "Hook kalıpları (kısa liste)"
| Kalıp | Şekil | Örnek (bizim kanal tonu) |
|---|---|---|
| Sayı | Bilinmeyen bir sayı, düz söylenir, sonra sonucu | "Eksi 100 derecede nefes almak 3 saniyede ciğerini dondurur." |
| Yanlış inanış | Herkesin bildiğini söyle, sonra çürüt | "Uzay soğuk, değil mi? Aslında ısıyı kaybetmek orada çok zor." |
| Ya … olursa | İmkânsız bir senaryo + tek kural | "Dünya bir günlüğüne dönmeyi bıraksa, ilk 10 saniyede ne olur?" |
| Saat | Ödülü zamana bağla | "60 saniyede kara deliğin içine düşelim." |
| Önce sonuç | Sonucu/nesneyi ilk karede göster, sonra açıkla | (ilk karede donmuş şehir) "Bu İstanbul. Sadece 3 gün sonra." |
| Uyarı | İzleyicinin ödemek üzere olduğu bir bedel | "Telefonunu şarjda bırakıyorsan bunu bilmen lazım." |
| Karşılaştırma | İki adlandırılmış seçenek, tek kazanan | "Mars mı, Venüs mü? Birinde 1 dakika bile yaşayamazsın." |
| Tersine | Doğru gibi görünmeyen bir iddia, sonra kanıt | "Bir kum tanesi seni öldürebilir — hızı yeterliyse." |
| Liste | Sayılı küme, sayı ilk cümlede | "Uzayda seni öldürecek 5 şey, en sessizi en tehlikelisi." |
| Doğrudan hitap | İzleyiciyi ilk 6 kelimede tarif et | "Gece gökyüzüne bakıp 'orada ne var' diyorsan…" |

Kurallar: tek söz (iki vaat taşıyan hook ikisini de tutamaz); somut > büyük ("400 kişiden 200 bine" > "devasa büyüme"); söz verilen nesne/sonuç ilk 20 sn içinde ekranda.

## Değişiklik 3 — yeni bölüm "Hook puanlama rubriği" (Türkçe, elle)
Her aday 1–5:
- **Somutluk:** sayı, isim, tarih, yer var mı? (soyut sıfat −)
- **Hitap:** "sen/senin" ilk 6 kelimede mi?
- **Risk/bedel:** kaybedilecek/tehlikede olan bir şey var mı?
- **Merak boşluğu:** açık soru var mı; cümle kendini kapatıyor mu ("çünkü…" ile bitiyorsa −)?
- **Kısalık:** Türkçe ~130 kelime/dk → 10 sn ≈ 9–22 kelime.

Toplam = 0.6 × ortalama + 0.4 × **en düşük** puan (zayıf halka: bir boyutu ölü olan hook ölüdür). Puan bir uyarıdır, söz değildir; yüksek puan "tutacak" demek değildir.

## Değişiklik 4 — "Format" tablosu
"Ekranda" sütunu her satırda **dolu** olmalı (boş ekran = podcast). Ödül anı tabloda `ÖDÜL` etiketiyle işaretlenir ve hook'taki sözle aynı kelimeleri kullanır.

## Değişiklik 5 — "Kalite kriterleri"ne ekle
- 5 hook adayı + puan tablosu var; seçilen 2'si kullanıcıya gösterildi.
- İlk 15 sn'de selam/kanal tanıtımı/abone çağrısı yok.
- Hook'taki söz senaryoda `ÖDÜL` satırında açıkça teslim ediliyor.
- Son: **tek** çağrı (birden fazla CTA yok).

## Değişiklik 6 — "Sonra"
Kullanılan kalıp + puan → `Hook Kalıpları` tablosuna; 48 saat sonra `yt-retention` kanca kaçağıyla karşılaştırılır (puan rubriği veriyle kalibre edilir).

## Eklenecek eval'lar
```markdown
## E-H1: Beş aday + puan
- Girdi: "Güneş 1 saniyeliğine sönse ne olur" fikri, 8 dk long-form.
- Beklenen: 5 farklı kalıptan 5 hook, rubrik puan tablosu, ilk 2 gösterilir; ilk 15 sn'de selam/abone çağrısı yok; ÖDÜL satırı hook'taki sözü teslim eder.

## E-H2: Tuzak — kendini kapatan hook
- Girdi: "Güneş sönerse 8 dakika fark etmeyiz çünkü ışık 8 dakikada gelir."
- Beklenen: Merak boşluğu düşük puan alır (cümle kendini kapatıyor); "çünkü" kısmı sonraya taşınmış bir alternatif önerilir.
```

## Changelog satırı (uygulanırsa)
`- 1.1.0 (YYYY-MM-DD): 5 hook adayı + Türkçe puan rubriği (zayıf halka ağırlığı), ilk 15 sn'nin üç işi, Dönüş bölümü, ÖDÜL etiketi, tek CTA. — kaynak: [[Skill Araştırması 2026-11]] (Jakeschincariol/youtube-agent-skill, MIT)`
