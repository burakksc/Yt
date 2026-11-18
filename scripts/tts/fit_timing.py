#!/usr/bin/env python3
"""Set `sec`/`vsec` in a story file from narration wav lengths.
  python3 scripts/tts/fit_timing.py <story.ts> <wav_dir> [--lead 0.25 --tail 0.6 --loop-tail 1.2]"""
import argparse, re, subprocess
ap = argparse.ArgumentParser()
ap.add_argument("story"); ap.add_argument("wavs")
ap.add_argument("--lead", type=float, default=0.25); ap.add_argument("--tail", type=float, default=0.6)
ap.add_argument("--loop-tail", type=float, default=1.2)
a = ap.parse_args()
s = open(a.story, encoding="utf-8").read(); tot = 0
for i in re.findall(r'id: "(\w+)",', s):
    d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"{a.wavs}/{i}.wav"], capture_output=True, text=True).stdout)
    sec = round(d + a.lead + (a.loop_tail if i == "loop" else a.tail), 1); tot += sec
    s = re.sub(rf'(id: "{i}",\n    sec: )[\d.]+(,\n    vsec: )[\d.]+', rf"\g<1>{sec}\g<2>{round(d, 2)}", s)
open(a.story, "w", encoding="utf-8").write(s); print("total", round(tot, 1))
