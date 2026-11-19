"""Dark-cabin window-seat POV (night flight sleep video) — Cycles render with a TRANSPARENT sky,
so the animated outside view (stars / clouds / city lights) is composited behind it later.

  source scripts/3d/env.sh
  ~/.venvs/bpy/bin/python scripts/3d/models/window_seat.py -- --out projects/flight/cabin.png [--res 0.5 --samples 64]

Writes cabin.png (RGBA: alpha = 0 where the sky is seen through the window) and cabin.json
(screen corner pixels for the in-flight map, window bbox). Units metres; plane flies toward +Y,
we sit on the left side looking out (-X).
"""
import argparse
import json
import math
import sys

import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--out", required=True)
ap.add_argument("--res", type=float, default=0.5)
ap.add_argument("--samples", type=int, default=64)
a = ap.parse_args(argv)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def mat(name, color, rough=0.6, metal=0.0, emit=None, strength=0.0, coat=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if coat:
        b.inputs["Coat Weight"].default_value = coat
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1)
        b.inputs["Emission Strength"].default_value = strength
    return m


M = dict(
    panel=mat("M_panel", (0.13, 0.13, 0.14), 0.55),
    reveal=mat("M_reveal", (0.16, 0.16, 0.17), 0.5),
    shade=mat("M_shade", (0.10, 0.10, 0.11), 0.6),
    housing=mat("M_housing", (0.05, 0.05, 0.055), 0.4),
    screen=mat("M_screen", (0.0, 0.0, 0.0), 0.5, emit=(0.02, 0.03, 0.05), strength=1.0),
    cowl=mat("M_cowl", (0.03, 0.07, 0.25), 0.35, coat=0.6),
    lip=mat("M_lip", (0.7, 0.7, 0.72), 0.25, metal=1.0),
    wing=mat("M_wing", (0.35, 0.36, 0.38), 0.45),
    ledge=mat("M_ledge", (0.09, 0.09, 0.1), 0.5),
)


def finish(o, m, bevel=0.0, seg=4):
    o.data.materials.append(m)
    if bevel:
        b = o.modifiers.new("bev", "BEVEL")
        b.width = bevel
        b.segments = seg
    bpy.ops.object.shade_smooth()
    return o


def cube(name, loc, size, m, bevel=0.0, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    return finish(o, m, bevel)


# --- side wall with a big rounded window (787-style), cut with a boolean ---
WX = -0.62  # wall plane x
WIN = dict(y=0.12, z=1.18, w=0.30, h=0.50)
wall = cube("SM_wall", (WX - 0.06, 0.4, 1.2), (0.12, 3.2, 2.0), M["panel"])
cut = cube("cutter", (WX - 0.06, WIN["y"], WIN["z"]), (0.6, WIN["w"], WIN["h"]), M["panel"])
bv = cut.modifiers.new("round", "BEVEL")
bv.width = 0.12
bv.segments = 16
bv.affect = "EDGES"
bpy.context.view_layer.objects.active = cut
bpy.ops.object.modifier_apply(modifier="round")
bo = wall.modifiers.new("hole", "BOOLEAN")
bo.object = cut
bo.operation = "DIFFERENCE"
bpy.context.view_layer.objects.active = wall
bpy.ops.object.modifier_apply(modifier="hole")
cut.hide_render = True
cut.hide_viewport = True
# window reveal (slightly lighter plastic tunnel) — a second, thinner wall with a slightly bigger hole
rv = cube("SM_reveal", (WX - 0.005, 0.4, 1.2), (0.01, 3.2, 2.0), M["reveal"])
cut2 = cube("cutter2", (WX, WIN["y"], WIN["z"]), (0.2, WIN["w"] + 0.07, WIN["h"] + 0.07), M["panel"])
bv2 = cut2.modifiers.new("round", "BEVEL")
bv2.width = 0.15
bv2.segments = 16
bpy.context.view_layer.objects.active = cut2
bpy.ops.object.modifier_apply(modifier="round")
b2 = rv.modifiers.new("hole", "BOOLEAN")
b2.object = cut2
b2.operation = "DIFFERENCE"
bpy.context.view_layer.objects.active = rv
bpy.ops.object.modifier_apply(modifier="hole")
cut2.hide_render = True
cut2.hide_viewport = True
# window shade pulled 15% down (realism)
cube("SM_shade", (WX - 0.09, WIN["y"], WIN["z"] + WIN["h"] / 2 - 0.035), (0.008, WIN["w"] - 0.01, 0.07), M["shade"], bevel=0.004)
# side ledge / armrest under the window
cube("SM_ledge", (WX + 0.12, 0.35, 0.72), (0.26, 1.6, 0.06), M["ledge"], bevel=0.02)
cube("SM_ledgebody", (WX + 0.12, 0.35, 0.36), (0.24, 1.6, 0.66), M["panel"], bevel=0.02)

# --- in-flight screen on the suite wall, angled toward us (map composited later) ---
SCR = dict(c=Vector((-0.42, 0.78, 0.98)), w=0.44, h=0.27, yaw=math.radians(28))
cube("SM_screenhousing", SCR["c"], (0.48, 0.035, 0.31), M["housing"], bevel=0.012, rot=(0, 0, SCR["yaw"]))
scr = cube("SM_screen", SCR["c"] - Vector((math.sin(-SCR["yaw"]) * 0.0, 0.019, 0)), (SCR["w"], 0.004, SCR["h"]), M["screen"],
           rot=(0, 0, SCR["yaw"]))
cube("SM_suitewall", (-0.30, 0.86, 0.8), (1.2, 0.06, 1.6), M["panel"], bevel=0.03, rot=(0, 0, SCR["yaw"]))

# --- outside: engine nacelle + a bit of wing (static relative to us) ---
bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=1.2, depth=3.6, location=(-7.2, 3.2, -1.45), rotation=(math.radians(90), 0, 0))
eng = finish(bpy.context.active_object, M["cowl"], bevel=0.25, seg=6)
eng.name = "SM_engine"
bpy.ops.mesh.primitive_torus_add(major_radius=1.18, minor_radius=0.08, location=(-7.2, 5.0, -1.45), rotation=(math.radians(90), 0, 0))
finish(bpy.context.active_object, M["lip"])
bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=1.1, depth=0.1, location=(-7.2, 5.02, -1.45), rotation=(math.radians(90), 0, 0))
finish(bpy.context.active_object, mat("M_intake", (0.01, 0.01, 0.012), 0.6))

# --- lights: very dim warm cabin spill, faint moonlight outside ---
bpy.ops.object.light_add(type="AREA", location=(0.6, 0.4, 2.3))
L1 = bpy.context.active_object
L1.data.energy = 6
L1.data.size = 1.2
L1.data.color = (1.0, 0.75, 0.55)
bpy.ops.object.light_add(type="SUN", location=(0, 0, 10), rotation=(math.radians(60), 0, math.radians(-120)))
L2 = bpy.context.active_object
L2.data.energy = 0.6
L2.data.color = (0.6, 0.7, 1.0)
bpy.ops.object.light_add(type="POINT", location=(0.2, 0.5, 1.5))  # soft glow
L3 = bpy.context.active_object
L3.data.energy = 0.0
L3.data.color = (0.5, 0.65, 1.0)

# --- camera: sitting in the window seat ---
bpy.ops.object.camera_add(location=(-0.12, -0.18, 1.16))
cam = bpy.context.active_object
cam.data.lens = 18
tgt = Vector((-1.0, 0.55, 1.0))
cam.rotation_euler = (tgt - cam.location).to_track_quat("-Z", "Y").to_euler()
scene.camera = cam

w = bpy.data.worlds.new("W")
scene.world = w
w.use_nodes = True
w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.01, 0.012, 0.02, 1)
scene.render.film_transparent = True
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = a.samples
scene.cycles.use_denoising = True
scene.render.resolution_x = int(3840 * a.res)
scene.render.resolution_y = int(2160 * a.res)
scene.view_settings.view_transform = "AgX"
scene.view_settings.exposure = 0.0
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.filepath = a.out
bpy.ops.render.render(write_still=True)

# screen mask render (screen only, white) -> corners are found from the mask image later
for o in scene.objects:
    if o.type in ("MESH", "LIGHT") and o.name != "SM_screen":
        o.hide_render = True
white = mat("M_white", (0, 0, 0), 1, emit=(1, 1, 1), strength=5)
scr.data.materials.clear()
scr.data.materials.append(white)
scene.cycles.samples = 4
scene.cycles.use_denoising = False
scene.render.film_transparent = False
w.node_tree.nodes["Background"].inputs["Color"].default_value = (0, 0, 0, 1)
scene.view_settings.view_transform = "Standard"
scene.render.filepath = a.out.replace(".png", "_screenmask.png")
bpy.ops.render.render(write_still=True)
print("saved", a.out)
