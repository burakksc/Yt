#!/usr/bin/env bash
# Install the 3D toolchain for this project (idempotent).
#   - Blender as a Python module (bpy 5.3) in ~/.venvs/bpy  → used by scripts/3d/blender
#   - Remotion three.js packages are in video/package.json (npm install)
# On a desktop machine you can instead install Blender 5.3 from blender.org; env.sh prefers it.
set -euo pipefail
PY="${PYTHON:-python3}"
if [ ! -x "$HOME/.venvs/bpy/bin/python" ]; then
  "$PY" -m venv "$HOME/.venvs/bpy"
fi
"$HOME/.venvs/bpy/bin/pip" install -q "bpy==5.3.0" numpy
"$HOME/.venvs/bpy/bin/python" -c "import bpy; print('bpy', bpy.app.version_string)"
