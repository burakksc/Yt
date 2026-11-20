#!/usr/bin/env python3
"""Add/refresh one mystery Short in video/src/videos/gizem/stories.ts + Root.tsx.
  python3 scripts/media/gizem_build.py <slug> <image_dir> <CompName> [credit-for-all-images]
Needs: projects/gizem/stories.json[slug], narration wavs in video/public/gizem/<slug>/en/<id>.wav."""
import json, os, subprocess, sys
from PIL import Image
slug, imgdir, comp = sys.argv[1:4]
credit = sys.argv[4] if len(sys.argv) > 4 else None
S = json.load(open('projects/gizem/stories.json'))
st = S[slug]
d = f'video/public/gizem/{slug}/img'; os.makedirs(d, exist_ok=True)
for sc in st['scenes']:
    src = [f for f in os.listdir(imgdir) if f.split('.')[0] == sc['img']][0]
    im = Image.open(os.path.join(imgdir, src)).convert('RGB'); im.save(f'{d}/{sc["img"]}.jpg', quality=92)
    w, h = im.size
    if w >= h * 0.9 and max(w, h) < 1500: sc['fit'] = 'contain'
    else: sc.pop('fit', None)
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'video/public/gizem/{slug}/en/{sc["id"]}.wav'], capture_output=True, text=True).stdout)
    sc['vsec'] = round(dur, 2); sc['sec'] = round(dur + 0.75 + (3.2 if sc.get('sfx') else 0), 2)
st['credits'] = {s['img']: credit for s in st['scenes']} if credit else {}
p = 'video/src/videos/gizem/stories.ts'; s = open(p).read()
key = 'STORIES: Record<string, MyStory> = '; i = s.index(key) + len(key); j = s.index('};\nexport const gzFrames')
data = json.loads(s[i:j + 1]); data[slug] = st
open(p, 'w').write(s[:i] + json.dumps(data, indent=1, ensure_ascii=False) + s[j + 1:])
r = open('video/src/Root.tsx').read()
if f'id="{comp}"' not in r:
    r = r.replace('      <Composition\n        id="GizemBloop"', f'''      <Composition
        id="{comp}"
        component={{GizemShort}}
        defaultProps={{{{ slug: "{slug}" }}}}
        durationInFrames={{gzFrames("{slug}")}}
        fps={{30}}
        width={{1080}}
        height={{1920}}
      />
      <Composition
        id="GizemBloop"''', 1)
    open('video/src/Root.tsx', 'w').write(r)
print(slug, round(sum(x['sec'] for x in st['scenes']), 1), 's')
