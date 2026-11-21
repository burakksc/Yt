#!/usr/bin/env bash
# Ordered heavy-job queue (memory-safe: one SDXL/render job at a time).
# Usage: scripts/queue/heavy.sh <slug> <command...>
# Among all waiting jobs, the slug that comes first in scripts/queue/order.txt runs first (FIFO within a slug).
slug="$1"; shift
dir=/tmp/yt-q; mkdir -p "$dir"
here="$(cd "$(dirname "$0")" && pwd)"
pr=$(grep -nx "$slug" "$here/order.txt" | cut -d: -f1); pr=$(printf '%03d' "${pr:-999}")
name="${pr}_$(date +%s%N)_$$"
touch "$dir/$name"; trap 'rm -f "$dir/$name"' EXIT
exec 9>/tmp/yt-heavy.lock
while true; do
  first=$(ls "$dir" | sort | head -1)
  if [ "$first" = "$name" ] && flock -n 9; then break; fi
  sleep 4
done
rm -f "$dir/$name"
"$@"
