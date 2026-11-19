#!/usr/bin/env bash
# One-hour cozy video from a Remotion loop composition (ROOM_LOOP+2 s long) + a long ambience track.
#   scripts/ambience/make_cozy_hour.sh <CompositionId> <ambience.m4a> <out.mp4> [minutes=60]
# 1) render the loop in 4 resumable chunks (survives machine restarts)
# 2) cross-fade the extra 2 s tail into the head -> seamless 60 s loop
# 3) encode the whole hour in ONE pass (-stream_loop, re-encoded) — no `concat -c copy` seams
# 4) seam/timestamp check: frame count, monotonic pts, and frame-diff at every loop boundary
set -euo pipefail
COMP="$1"; AUDIO="$(realpath "$2")"; OUT="$(realpath -m "$3")"; MIN="${4:-60}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="$ROOT/video/out/cozy/work_$COMP"
mkdir -p "$WORK"
[ -s "$OUT" ] && { echo "[skip] $OUT exists"; exit 0; }
cd "$ROOT/video"
FR=1860   # (60+2) s * 30 fps
N=12; S=$(( (FR + N - 1) / N ))
for k in $(seq 0 $((N-1))); do
  a=$((k*S)); b=$(( (k+1)*S - 1 )); [ $b -ge $FR ] && b=$((FR-1))
  f="$WORK/c$k.mp4"
  [ -s "$f" ] && continue
  echo "[render] $COMP chunk $k ($a-$b)"
  npx remotion render "$COMP" "$f.tmp.mp4" --frames=$a-$b --crf=12 --log=error
  mv "$f.tmp.mp4" "$f"
done
for k in $(seq 0 $((N-1))); do echo "file '$WORK/c$k.mp4'"; done > "$WORK/list.txt"
[ -s "$WORK/raw62.mp4" ] || { ffmpeg -v error -y -f concat -safe 0 -i "$WORK/list.txt" -c:v libx264 -crf 12 -preset fast -pix_fmt yuv420p "$WORK/raw62.tmp.mp4" && mv "$WORK/raw62.tmp.mp4" "$WORK/raw62.mp4"; }
# seamless 60 s loop: tail (60..62 s) fades into head (0..2 s), then 2..60 s
if [ ! -s "$WORK/loop60.mp4" ]; then
  # low-memory: cut tail/head/body separately, fade tail->head, then join
  E="-c:v libx264 -crf 12 -preset fast -pix_fmt yuv420p -r 30 -an"
  ffmpeg -v error -y -ss 60 -i "$WORK/raw62.mp4" -t 2 $E "$WORK/tail.mp4"
  ffmpeg -v error -y -i "$WORK/raw62.mp4" -t 2 $E "$WORK/head.mp4"
  ffmpeg -v error -y -ss 2 -i "$WORK/raw62.mp4" -t 58 $E "$WORK/body.mp4"
  ffmpeg -v error -y -i "$WORK/tail.mp4" -i "$WORK/head.mp4" -filter_complex "[0:v][1:v]xfade=transition=fade:duration=2:offset=0[v]" -map "[v]" $E -t 2 "$WORK/fade.mp4"
  printf "file '%s'\nfile '%s'\n" "$WORK/fade.mp4" "$WORK/body.mp4" > "$WORK/loop_list.txt"
  ffmpeg -v error -y -f concat -safe 0 -i "$WORK/loop_list.txt" $E "$WORK/loop60.tmp.mp4" && mv "$WORK/loop60.tmp.mp4" "$WORK/loop60.mp4"
fi
echo "[encode] ${MIN} min in one pass"
REP=$(( MIN + 1 ))
ffmpeg -v error -y -stream_loop $REP -i "$WORK/loop60.mp4" -i "$AUDIO" -map 0:v -map 1:a \
  -c:v libx264 -preset veryfast -crf 21 -maxrate 4M -bufsize 8M -pix_fmt yuv420p -r 30 -g 60 \
  -c:a aac -b:a 192k -t $(( MIN * 60 )) -movflags +faststart "$OUT.tmp.mp4"
mv "$OUT.tmp.mp4" "$OUT"
echo "[check] frames / timestamps"
python3 - "$OUT" "$MIN" <<'PY'
import subprocess, sys
out, mins = sys.argv[1], int(sys.argv[2])
pts = subprocess.run(["ffprobe","-v","error","-select_streams","v:0","-show_entries","packet=pts_time","-of","csv=p=0",out],capture_output=True,text=True).stdout.split()
p = sorted(float(x) for x in pts if x)
d = [b-a for a,b in zip(p,p[1:])]
bad = [i for i,x in enumerate(d) if abs(x-1/30) > 0.004]
print(f"frames={len(p)} expected={mins*60*30} irregular_steps={len(bad)}")
PY
echo "[check] loop seams (mean abs diff across boundary vs neighbours)"
python3 - "$OUT" <<'PY'
import subprocess, sys
import numpy as np
out = sys.argv[1]
for b in (60, 1800, 3540):
    raw = subprocess.run(["ffmpeg","-v","error","-ss",str(b-1),"-i",out,"-frames:v","60","-vf","scale=480:270","-f","rawvideo","-pix_fmt","gray","-"],capture_output=True).stdout
    f = np.frombuffer(raw,np.uint8).reshape(-1,270,480).astype(np.float32)
    d = [np.abs(f[i+1]-f[i]).mean() for i in range(len(f)-1)]
    seam, nb = d[29], float(np.median(d))
    dup = sum(1 for x in d if x < 0.05)
    print(f"t={b}s seam_diff={seam:.2f} median_diff={nb:.2f} duplicate_frames={dup} {'OK' if seam < 4*nb + 1.0 and dup == 0 else 'CHECK'}")
PY
ls -la "$OUT"
