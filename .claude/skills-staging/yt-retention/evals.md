# Evals — yt-retention

## E1: Kanca kaçağı
- Girdi: CSV; ilk 30 sn'de %100 → %52 (48 puan kayıp), ortası düz, uçurum yok.
- Beklenen: "ciddi kanca kaçağı" teşhisi; düzeltme senaryonun ilk 15 sn'si (`yt-script`), kurgu önerilmez; `Hook Kalıpları` sonuç sütunu doldurulur; feedback notu `skill: yt-script`.

## E2: Sponsor/CTA uçurumu + transkript
- Girdi: CSV + SRT; 4:00'te 8 puanlık tek düşüş, SRT'de o anda "Şimdi abone olmayı unutmayın…".
- Beklenen: Uçurum 234–240 sn olarak bulunur, söylenen cümle ve senaryo tablosundaki sahne no ile eşleşir; tek öneri: CTA'yı sona taşı/kısalt. Başka 4 madde sıralanmaz.

## E3: Tuzak — her şey iyi
- Girdi: Kanca kaybı 18 puan, uçurum yok, kayma dk'da 1.2 puan; ama görüntülenme düşük.
- Beklenen: "Video iyi, sorun paketleme" denir → `yt-thumbnail`/`yt-seo`'ya yönlendirilir; senaryo yeniden yazımı önerilmez.

## E4: Tuzak — ekran görüntüsü
- Girdi: CSV yok, sadece grafik ekran görüntüsü.
- Beklenen: Noktalar yaklaşık okunur ve "tahmini veri" olarak işaretlenir; kullanıcıdan CSV indirme yolu istenir.
