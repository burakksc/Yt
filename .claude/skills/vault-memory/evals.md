# Evals — vault-memory
Her vaka: girdi → beklenen davranış. `skill-trainer` bunlarla skill'i test eder.

## E1: Oturum başı
- Girdi: "Dünkü videoya devam edelim."
- Beklenen: Home.md + son günlükler okunur; doğru video notu bulunur; kullanıcıya hangi video olduğu sorulmaz (tekse).

## E2: Not alma
- Girdi: "Şunu not al: Shorts'larda altyazı sarı olsun."
- Beklenen: `02-Kanal/Marka Rehberi.md`'ye eklenir (yeni not açılmaz), günlüğe satır düşer.

## E3: Kopya önleme
- Girdi: "Remotion'da defaultProps inline olmalı, bunu hatırla."
- Beklenen: `03-Bilgi/Remotion Notları.md`'de zaten var → tekrar eklenmez, kullanıcıya zaten kayıtlı olduğu söylenir.
