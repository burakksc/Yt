#!/usr/bin/env python3
"""Prepare one AI-illustrated Short after its images are generated.
  python3 scripts/media/gizem_ai_prepare.py <slug> <CompName>
Reads projects/gizem/ai/<slug>/prompts.json (keys <slug>__<scene_id>), takes the newest seed per key from
projects/gizem/ai/<slug>/imgs/<key>_s<seed>.png (or imgs_fix/), copies to projects/gizem/<slug>/img/<key>.png,
points each scene's img at its key in stories.json, runs gizem_build.py, writes a contact sheet
(video/out/ready/_sheet_<slug>.png is NOT written; sheet goes to the scratchpad path printed)."""
import glob, json, os, re, subprocess, sys
import cv2, numpy as np
slug, comp = sys.argv[1:3]
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(root)
P = json.load(open(f'projects/gizem/ai/{slug}/prompts.json'))
S = json.load(open('projects/gizem/stories.json'))
dst = f'projects/gizem/{slug}/img'; os.makedirs(dst, exist_ok=True)
missing = []
for sc in S[slug]['scenes']:
    key = f"{slug}__{sc['id']}"
    c = glob.glob(f'projects/gizem/ai/{slug}/imgs*/{key}_s*.png')
    if key not in P['items'] or not c:
        missing.append(key); continue
    best = max(c, key=os.path.getmtime)
    cv2.imwrite(f'{dst}/{key}.png', cv2.imread(best))
    sc['img'] = key; sc.pop('fit', None)
if missing:
    print('MISSING', missing); sys.exit(1)
json.dump(S, open('projects/gizem/stories.json', 'w'), indent=1, ensure_ascii=False)
print(subprocess.run(['python3', 'scripts/media/gizem_build.py', slug, dst, comp, 'AI-generated illustration'], capture_output=True, text=True).stdout.strip())
ims = [cv2.resize(cv2.imread(f"{dst}/{sc['img']}.png"), (216, 378)) for sc in S[slug]['scenes']]
out = f'/tmp/claude-0/-home-user-Yt/c0ed126b-6344-535b-9708-226fcfc689ac/scratchpad/strip/sheet_{slug}.png'
cv2.imwrite(out, np.hstack(ims)); print('SHEET', out)
