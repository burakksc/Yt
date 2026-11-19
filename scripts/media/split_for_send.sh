#!/usr/bin/env bash
# Split a big video into 380 MiB parts + Windows/Mac join scripts (zipped) + SHA-256.
#   scripts/media/split_for_send.sh <video.mp4> <out_dir>
set -euo pipefail
F="$(realpath "$1")"; D="$2"; mkdir -p "$D"; N="$(basename "$F")"
( cd "$(dirname "$F")" && sha256sum "$N" ) > "$D/$N.sha256"
split -b 380M -d -a 3 --numeric-suffixes=1 "$F" "$D/$N."
P=$(cd "$D" && ls "$N".[0-9][0-9][0-9] | tr '\n' '+' | sed 's/+$//')
printf '@echo off\r\ncd /d "%%~dp0"\r\necho Birlestiriliyor...\r\ncopy /b %s "%s"\r\nif errorlevel 1 (echo HATA: tum parcalar bu dosyayla ayni klasorde olmali.) else (echo TAMAM: %s hazir.)\r\ncertutil -hashfile "%s" SHA256\r\necho Yukaridaki kod bununla ayni olmali:\r\ntype "%s.sha256"\r\npause\r\n' "$P" "$N" "$N" "$N" "$N" > "$D/birlestir-windows.bat"
printf '#!/bin/bash\ncd "$(dirname "$0")"\ncat %s.[0-9][0-9][0-9] > "%s" && shasum -a 256 "%s" && cat "%s.sha256"\nread -p "Kapatmak icin Enter"\n' "$N" "$N" "$N" "$N" > "$D/birlestir-mac.command"
chmod +x "$D/birlestir-mac.command"
( cd "$D" && python3 -c "import zipfile,sys;z=zipfile.ZipFile('birlestir-$N.zip','w');[z.write(x) for x in ('birlestir-windows.bat','birlestir-mac.command','$N.sha256')];z.close()" )
ls -la "$D"
