---
name: yt-fikirden-videoya
description: Kullanıcı bir video fikri verdiğinde HEMEN ön çalışmayı yapar (araştırma, senaryo, görsel planı, yayın metni taslağı, kuyruğa alma). "şu konuda video yap", "fikrim var", "şunu da ekle", "sıradaki video" denildiğinde kullan.
metadata:
  version: 1.0.0
---
# Fikirden videoya (pratik çalışma mantığı)

Kural: Kullanıcı fikri verince **sormadan** ön çalışmayı başlat; tek onay noktası senaryo + görsel planı. Ağır işler (görsel üretimi, render) kuyruğa girer, kullanıcıyı bekletmez.

## Adımlar (aynı mesaj içinde, hafif işler)
1. **Araştırma (5 dk):** 3–5 güvenilir kaynak; sayıları ve tarihleri doğrula; tek kaynaklı iddiayı "reportedly" yap; efsane/komplo kısmını açıkça ayır. Kaynakları vault'a yaz (`vault/01-Videolar/<tarih> <konu>.md`).
2. **Senaryo (EN):** 6–8 sahne, toplam ≤ ~110 kelime (Kokoro am_michael ≈ 2.1 kelime/sn → ≤ 60 sn). Kendi cümlelerimiz; ilk cümle kanca; son cümle soru/döngü. Başlık yanıltıcı olmasın.
3. **Görsel planı:** her sahne için tek cümlelik AI illüstrasyon (kısa prompt, yüzsüz figür, yazı/logo yok, gerçek kişi benzerliği yok; trajedide saygılı). Stil: `projects/gizem/ai/prompts.json` içindeki stil satırı.
4. **Yayın metni taslağı:** başlık, linksiz açıklama (özet + `Sources:` + Kokoro notu (açıklamada "Images" satırı YOK) + linksiz footer), hashtag satırı, etiket satırı (`#`siz, virgülle), Studio ayarı, risk özeti.
5. **Kullanıcıya TEK mesaj:** senaryo (sahne sahne anlatım + görsel) + başlık. "Onay / değişiklik" iste. Başka soru sorma.

## Onaydan sonra (otomatik)
6. `projects/gizem/stories.json[slug]` + prompts → `projects/gizem/ai/<slug>/prompts.json`.
7. Ses: `kokoro_say.py --voice am_michael --lang en` (sahne başına .wav, `video/public/gizem/<slug>/en/`).
8. Kuyruk: `scripts/queue/heavy.sh <slug> ...` ile görsel üretimi → kontrol sayfası (contact sheet) → kötüleri `seeds:[2,3]` ile yenile → `gizem_build.py` → render (kuyruk).
9. Kare şeridi + ses kontrolü → `video/out/ready/<slug>.mp4` (sıkıştırılmış) + `.txt` → kullanıcıya hemen gönder (3 parça: başlık, açıklama, hashtag+etiket + Studio + risk).

## Sıra
`scripts/queue/order.txt` kullanıcının sırasıdır; yeni fikri listenin sonuna ekle (kullanıcı öncelik söylemedikçe).
Aynı anda tek ağır iş. Disk < 1.5 GB ise kullanıcıya haber ver.
