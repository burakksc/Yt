#!/usr/bin/env bash
# Queue a Gizem Short render in the ordered heavy queue; log to /tmp/yt-render-logs/<slug>.log (last line DONE when finished)
slug="$1"; comp="$2"
mkdir -p /tmp/yt-render-logs; : > /tmp/yt-render-logs/$slug.log
nohup "$(cd "$(dirname "$0")" && pwd)/heavy.sh" "$slug" bash -c "cd /home/user/Yt/video && npx remotion render $comp out/gizem-$slug-en.mp4 --log=error --concurrency=4 >> /tmp/yt-render-logs/$slug.log 2>&1; echo DONE >> /tmp/yt-render-logs/$slug.log" >/dev/null 2>&1 &
