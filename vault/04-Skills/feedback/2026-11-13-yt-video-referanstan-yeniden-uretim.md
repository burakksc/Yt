---
tags: [skill-feedback]
skill: yt-video
date: 2026-11-13
type: eksik
severity: orta
status: açık
---
# Feedback: yt-video — referans videodan yeniden üretim
**Görev:** Kullanıcı başka bir araçta (Claude chat) ürettiği bir mp4'ü Remotion'da koddan yeniden yaptırmak istedi.

**Ne oldu:** Skill sadece "senaryodan video" akışını tarif ediyor; referans videonun analizi için adım yok. Elle şu yapıldı ve iyi çalıştı:
1. `ffprobe` ile çözünürlük/süre/fps/ses.
2. `ffmpeg -vf "fps=1,scale=288:-1,tile=6x2"` ile 1 sn aralıklı kontak sayfaları → sahne sınırları ve metinler okundu.
3. Birkaç kare tam çözünürlükte → layout ölçüleri (başlık/kart/rozet y konumları oran olarak).
4. `volumedetect` + `showspectrumpic` → ses türü (konuşma yok, rüzgar ambiyansı).
5. Senaryo tablosu referanstan çıkarıldı, sonra yeniden üretim + aynı anlardan kontrol kareleriyle karşılaştırma.

**Kök neden:** yt-video'da "referans video → sahne tablosu" girişi yok.

**Önerilen değişiklik:** yt-video'ya "Girdi bir referans video ise" bölümü ekle: yukarıdaki 5 adım + "çıkan sahne tablosunu video notuna yaz, sonra normal akış".

**Kanıt:** Video notu [[2026-11-13 -100°C'de Neler Olur]] (sahne tablosu referanstan çıkarıldı), komutlar bu oturumda.
