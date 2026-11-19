#!/usr/bin/env bash
# Resumable pipeline for the three 1-hour cozy videos (re-run after a machine restart; finished steps are skipped).
set -uo pipefail
cd "$(dirname "$0")/../.."
O=video/out/cozy
[ -s $O/noel_ambience_60m.m4a ] || python3 -I scripts/audio/make_fire_ambience.py --minutes 60 --out $O/noel_ambience_60m.m4a
scripts/ambience/make_cozy_hour.sh CozyNoel $O/noel_ambience_60m.m4a $O/cozy-noel-library-1h.mp4 >> $O/noel_hour.log 2>&1
[ -s $O/nycB_ambience_60m.m4a ] || python3 -I scripts/audio/make_fire_ambience.py --minutes 60 --city 1 --out $O/nycB_ambience_60m.m4a
scripts/ambience/make_cozy_hour.sh CozyNycB $O/nycB_ambience_60m.m4a $O/cozy-newyork-B-1h.mp4 >> $O/nycB_hour.log 2>&1
[ -s $O/nycF_ambience_60m.m4a ] || python3 -I scripts/audio/make_fire_ambience.py --minutes 60 --fire 0 --city 1.4 --out $O/nycF_ambience_60m.m4a
scripts/ambience/make_cozy_hour.sh CozyNycF $O/nycF_ambience_60m.m4a $O/cozy-newyork-F-1h.mp4 >> $O/nycF_hour.log 2>&1
echo PIPELINE_DONE >> $O/pipeline.log
