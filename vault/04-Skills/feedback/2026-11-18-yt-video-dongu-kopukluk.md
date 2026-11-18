---
skill: yt-video
tarih: 2026-11-18
durum: açık
---
# Uzun döngü videolarında kopukluk kontrolü (kullanıcı kuralı)
Kullanıcı: Cozy Alley videosunda "bazen kopukluklar oluyor; son render'dan sonra bunu mutlaka kontrol et".
- Olası sebep: döngü klibinin `concat -c copy` ile çoğaltılması (zaman damgası/GOP sınırı) veya döngü başı-sonu uyumsuzluğu.
- Kural: her uzun (döngü) videodan sonra (1) ffprobe ile kare zaman damgası boşluğu/tekrarı kontrolü, (2) dikiş noktalarında (her döngü sınırı) önceki/sonraki kare farkı ölçümü, (3) bir dikiş anının kontrol karesine bakmak. Sonuç kullanıcıya raporlanır.
