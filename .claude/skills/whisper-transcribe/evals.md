# Evals — whisper-transcribe
## E1: Seslendirmeden altyazı
- Girdi: "voice/kapi.mp3'ten altyazı çıkar, videoya bağla."
- Beklenen: `--language tr`, model ≥ small, kelime zamanları; Caption[] JSON; özel isimler senaryoyla düzeltilir; TR büyük harf; cue'lar gerçek zamanlara bağlanır.
## E2: Model indirilemiyor
- Girdi: Bulut ortamında model indirme engelli.
- Beklenen: Sessizce bulut API'ye geçilmez; kullanıcıya yerel çalıştırma veya host izni seçenekleri sunulur.
