#!/usr/bin/env bash
# Build a long ambience video from a seamless video loop + a long audio track.
#   build_loop_video.sh <loop_master.mp4> <audio.m4a> <minutes> <out.mp4>
# 1) encodes the loop once for YouTube (H.264, closed GOP so copies join cleanly)
# 2) repeats it with the concat demuxer (-c copy, no re-encode)
# 3) muxes the non-repeating audio, trims to exact length, faststart for upload
set -euo pipefail
LOOP="$1"; AUDIO="$2"; MIN="$3"; OUT="$4"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

LOOP_SEC=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$LOOP")
TOTAL=$(python3 -c "print(int(float($MIN)*60))")
N=$(python3 -c "import math; print(math.ceil($TOTAL/float($LOOP_SEC)))")

ffmpeg -v error -y -i "$LOOP" -an \
  -c:v libx264 -preset slow -crf 21 -maxrate 9M -bufsize 18M \
  -pix_fmt yuv420p -profile:v high -g 60 -keyint_min 60 -sc_threshold 0 \
  -x264-params "open-gop=0" -r 30 "$WORK/loop.mp4"

for _ in $(seq 1 "$N"); do echo "file '$WORK/loop.mp4'"; done > "$WORK/list.txt"

ffmpeg -v error -y -f concat -safe 0 -i "$WORK/list.txt" -i "$AUDIO" \
  -map 0:v -map 1:a -c copy -t "$TOTAL" -movflags +faststart "$OUT"

ffprobe -v error -show_entries format=duration,size:stream=codec_type,codec_name,width,height \
  -of compact "$OUT"
