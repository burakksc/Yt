#!/usr/bin/env bash
# One command: 4K (3840x2160) 1-hour Cozy Alley Rain video.
#   scripts/ambience/make_cozy_4k.sh            # 60 minutes
#   scripts/ambience/make_cozy_4k.sh 180        # 3 hours
# Requirements: Node 20+, ffmpeg, python3 with numpy.
# For real 4K detail, put the ORIGINAL high-res photo (16:9, ideally 3840x2160)
# at video/public/cozy-alley/alley.png first. Rain/steam/lights are vector and always sharp.
set -euo pipefail
MIN="${1:-60}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT_DIR="$ROOT/video/out/cozy"
mkdir -p "$OUT_DIR"

for c in node npx ffmpeg ffprobe python3; do
  command -v "$c" >/dev/null || { echo "Missing: $c (install it first)"; exit 1; }
done
python3 -c "import numpy" 2>/dev/null || { echo "Missing numpy: pip3 install numpy"; exit 1; }

W=$(ffprobe -v error -show_entries stream=width -of csv=p=0 "$ROOT/video/public/cozy-alley/alley.png")
if [ "$W" -lt 3000 ]; then
  echo "WARNING: alley.png is only ${W}px wide; the photo will look soft in 4K."
  echo "         Replace it with the original high-res image for best results."
fi

cd "$ROOT/video"
[ -d node_modules ] || npm install

echo "[1/3] Rendering 60 s seamless loop in 4K…"
npx remotion render CozyAlleyLoop "$OUT_DIR/loop_4k.mp4" --scale=2 --crf=12 --jpeg-quality=95

echo "[2/3] Generating ${MIN}-minute ambience audio…"
AUDIO="$OUT_DIR/ambience_${MIN}m.m4a"
[ -f "$AUDIO" ] || python3 -I "$ROOT/scripts/ambience/make_rain_ambience.py" --minutes "$MIN" --out "$AUDIO"

echo "[3/3] Building final video…"
CRF=18 MAXRATE=45M BUFSIZE=90M "$ROOT/scripts/ambience/build_loop_video.sh" \
  "$OUT_DIR/loop_4k.mp4" "$AUDIO" "$MIN" "$OUT_DIR/cozy_alley_rain_4k_${MIN}dk.mp4"
echo "Done: $OUT_DIR/cozy_alley_rain_4k_${MIN}dk.mp4"
