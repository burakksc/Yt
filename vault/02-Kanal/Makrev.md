# Makrev web sitesi (kullanıcının şirketi)
- Feeding Systems bandı: `.ust-bg` → yükseklik 366 px, `background-position: top center`, ölçekleme YOK → görsel **2016×430** olmalı (mevcut banner ölçüsü), önemli içerik üst 366 px ve orta ~1300 px içinde.
- 2026-11-20: 4.414729881390129.jpg (5000×3000, besleme hattı) → `video/out/makrev/makrev-banner-2016x430-tum-hat.jpg` ve `-yakin.jpg` üretildi.
- "Hepsi sığmıyor, yeniden kurgula" → **yeni kurgu**: dikey kayma (shear y' = y − 0.47x; dikeyler dik kalır, çapraz hat yataylaşır) + bağımsız hazneyi sağ boşluğa taşıma → tüm hat 366 px'e daha büyük sığdı (`makrev-banner-2016x430-yeni-kurgu.jpg`).
