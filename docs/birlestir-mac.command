#!/bin/bash
cd "$(dirname "$0")"
echo "Parcalar birlestiriliyor..."
cat cozy_alley_rain_4k_60dk.mp4.0{01..19} > cozy_alley_rain_4k_60dk.mp4 && echo "TAMAM: cozy_alley_rain_4k_60dk.mp4 hazir." || echo "HATA: 19 parca bu dosyayla ayni klasorde olmali."
read -p "Kapatmak icin Enter"
