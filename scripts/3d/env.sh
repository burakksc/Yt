# Source before Blender work:  source scripts/3d/env.sh
# Uses a real Blender if one is installed, otherwise the bpy-module shim
# (pip install bpy==5.3.0 into ~/.venvs/bpy — see scripts/3d/setup.sh).
_here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if command -v blender >/dev/null 2>&1 && ! blender --version 2>/dev/null | grep -q shim; then
  export BLENDER_EXE="$(command -v blender)"
else
  export BLENDER_EXE="$_here/blender"
fi
export BLENDER_SKILLS="$(cd "$_here/../../.claude/skills" && pwd)"
