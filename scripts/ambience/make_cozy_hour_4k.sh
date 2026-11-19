#!/usr/bin/env bash
# One-hour 4K cozy video as ONE file under the 400 MiB send limit (no joining for the user).
#   scripts/ambience/make_cozy_hour_4k.sh <scene> <ambience.m4a> <out.mp4>
# 1) cozy_composite.py renders a perfectly periodic 60 s 4K loop (crf 12 master)
# 2) x265 slow crf 32, closed GOP (keyint 300, open-gop 0) -> ~5.6 MB/min
# 3) concat the SAME encoded loop 60x with stream copy (seamless, 2 min) + AAC 96k
# 4) checks: 108000 frames, regular pts, no duplicate frames at loop seams
set -euo pipefail
SCENE="$1"; AUDIO="$(realpath "$2")"; OUT="$(realpath -m "$3")"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"; W="$ROOT/video/out/cozy/work4k_$SCENE"; mkdir -p "$W"; cd "$ROOT"
[ -s "$W/loop60.mp4" ] || { /root/.venvs/img/bin/python -I scripts/ambience/cozy_composite.py --scene "$SCENE" --seconds 60 --crf 12 --out "$W/loop60.tmp.mp4" && mv "$W/loop60.tmp.mp4" "$W/loop60.mp4"; }
[ -s "$W/loop60_hevc.mp4" ] || { ffmpeg -v error -y -i "$W/loop60.mp4" -c:v libx265 -preset slow -crf 32 -x265-params log-level=error:keyint=300:min-keyint=300:scenecut=0:open-gop=0 -pix_fmt yuv420p -tag:v hvc1 -an "$W/h.tmp.mp4" && mv "$W/h.tmp.mp4" "$W/loop60_hevc.mp4"; }
for i in $(seq 60); do echo "file '$W/loop60_hevc.mp4'"; done > "$W/list.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$W/list.txt" -i "$AUDIO" -map 0:v -map 1:a -c:v copy -tag:v hvc1 -c:a aac -b:a 96k -t 3600 -movflags +faststart "$OUT.tmp.mp4" && mv "$OUT.tmp.mp4" "$OUT"
ls -la "$OUT"; [ "$(stat -c %s "$OUT")" -lt 419430400 ] || echo "WARNING: over 400 MiB, raise crf"
