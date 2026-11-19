"""Night business-class cabin (wide-body, window suites) for the airplane sleep video — Cycles still + window mask.

  source scripts/3d/env.sh
  ~/.venvs/bpy/bin/python scripts/3d/models/business_cabin.py -- --out projects/business/render.png [--res 0.5 --samples 64 --mask]

Units: metres. Y = forward along the cabin, X = left(-)/right(+), Z = up, floor at z=0.
Layout: staggered single window suites on the left (privacy shell, lie-flat seat, side console with
reading lamp, footwell + sleeping IFE screen), centre suites on the right, aisle between, overhead bins
with warm cove LEDs, dim blue night mood lighting, oval windows showing a moonlit night sky.
--mask renders a second image: window panes white, everything else black (for animating the view later).
"""
import argparse
import math
import sys

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--out", required=True)
ap.add_argument("--res", type=float, default=0.5)
ap.add_argument("--samples", type=int, default=64)
ap.add_argument("--mask", action="store_true")
a = ap.parse_args(argv)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
R = 2.85  # fuselage inner radius
ZC = 1.55  # fuselage axis height above floor
PITCH = 1.95  # suite pitch
ROWS = 7


# ---------------- materials ----------------
def mat(name, color, rough=0.6, metal=0.0, emit=None, strength=0.0, sheen=0.0, noise=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if sheen:
        b.inputs["Sheen Weight"].default_value = sheen
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1)
        b.inputs["Emission Strength"].default_value = strength
    if noise:
        tex = nt.nodes.new("ShaderNodeTexNoise")
        tex.inputs["Scale"].default_value = 180
        tex.inputs["Detail"].default_value = 6
        ramp = nt.nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].color = (*[c * (1 - noise) for c in color], 1)
        ramp.color_ramp.elements[1].color = (*[min(1, c * (1 + noise)) for c in color], 1)
        nt.links.new(tex.outputs["Fac"], ramp.inputs["Fac"])
        nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    return m


M = dict(
    shell=mat("M_shell", (0.62, 0.56, 0.48), 0.45),
    shell_in=mat("M_shell_inner", (0.30, 0.27, 0.24), 0.6),
    wood=mat("M_wood", (0.20, 0.11, 0.06), 0.35, noise=0.25),
    leather=mat("M_leather", (0.07, 0.07, 0.08), 0.42),
    cushion=mat("M_cushion", (0.11, 0.12, 0.15), 0.8, sheen=0.3, noise=0.15),
    pillow=mat("M_pillow", (0.85, 0.84, 0.80), 0.9, sheen=0.4),
    blanket=mat("M_blanket", (0.32, 0.30, 0.34), 0.95, sheen=0.5, noise=0.2),
    wall=mat("M_wall", (0.80, 0.79, 0.76), 0.55),
    bins=mat("M_bins", (0.85, 0.84, 0.82), 0.4),
    carpet=mat("M_carpet", (0.06, 0.07, 0.11), 0.95, noise=0.35),
    bezel=mat("M_bezel", (0.88, 0.87, 0.85), 0.35),
    pane=mat("M_pane", (0.0, 0.0, 0.0), 1.0, emit=(0.18, 0.26, 0.5), strength=0.9),
    screen=mat("M_screen", (0.0, 0.0, 0.0), 0.2, emit=(0.05, 0.10, 0.25), strength=0.12),
    cove=mat("M_cove", (0, 0, 0), 1, emit=(1.0, 0.62, 0.32), strength=3.0),
    mood=mat("M_mood", (0, 0, 0), 1, emit=(0.35, 0.30, 0.85), strength=0.25),
    lampshade=mat("M_lamp", (0, 0, 0), 1, emit=(1.0, 0.72, 0.42), strength=12.0),
    metal=mat("M_metal", (0.55, 0.52, 0.48), 0.3, metal=1.0),
)


def obj(name, m, bevel=0.0, seg=3):
    o = bpy.context.active_object
    o.name = name
    o.data.materials.append(m)
    if bevel:
        bm = o.modifiers.new("bev", "BEVEL")
        bm.width = bevel
        bm.segments = seg
        bm.limit_method = "ANGLE"
    bpy.ops.object.shade_smooth()
    return o


def box(name, m, loc, size, bevel=0.012, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot)
    o = bpy.context.active_object
    o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    return obj(name, m, bevel)


def soft(name, m, loc, size, rot=(0, 0, 0), lvl=3):
    """pillow / folded blanket: subdivided box, slightly puffed"""
    o = box(name, m, loc, size, bevel=0, rot=rot)
    s = o.modifiers.new("sub", "SUBSURF")
    s.levels = s.render_levels = lvl
    return o


# ---------------- fuselage ----------------
bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=R, depth=ROWS * PITCH + 8, location=(0, (ROWS * PITCH) / 2 - 2, ZC),
                                    rotation=(math.radians(90), 0, 0), end_fill_type="NOTHING")
fus = obj("SM_fuselage", M["wall"])
fus.data.flip_normals() if hasattr(fus.data, "flip_normals") else None
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, (ROWS * PITCH) / 2 - 2, 0))
fl = bpy.context.active_object
fl.scale = (2 * R, ROWS * PITCH + 8, 1)
obj("SM_floor", M["carpet"])
# far end bulkhead (soft wall with a warm galley glow)
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, ROWS * PITCH + 1.6, ZC), rotation=(math.radians(90), 0, 0))
bh = bpy.context.active_object
bh.scale = (2 * R, 2 * R, 1)
obj("SM_bulkhead", M["wall"])
# rear bulkhead with a softly lit galley curtain
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -4.2, ZC), rotation=(math.radians(90), 0, 0))
rb = bpy.context.active_object
rb.scale = (2 * R, 2 * R, 1)
obj("SM_bulkhead_rear", M["wall"])
curtain = mat("M_curtain", (0.25, 0.2, 0.18), 0.9, emit=(1.0, 0.7, 0.45), strength=0.15)
box("SM_curtain", curtain, (0, -4.15, 1.05), (1.0, 0.02, 2.0), bevel=0)
# overhead bins (left over windows, right over centre) + cove LED strips
L = ROWS * PITCH + 6
for side, x in ((-1, -1.95), (1, 1.95)):
    box(f"SM_bins_{side}", M["bins"], (x, L / 2 - 3, 2.12), (0.75, L, 0.42), bevel=0.06)
    box(f"SM_cove_{side}", M["cove"], (x - side * 0.36, L / 2 - 3, 1.89), (0.03, L, 0.015), bevel=0)
# centre ceiling night mood strip
box("SM_mood", M["mood"], (0, L / 2 - 3, 2.6), (0.06, L, 0.01), bevel=0)


# ---------------- windows (left wall) ----------------
def wall_x(z):
    return -math.sqrt(max(R * R - (z - ZC) ** 2, 0))


panes = []
for i in range(ROWS * 2 + 4):
    y = -1.5 + i * PITCH / 2
    z = 1.28
    x = wall_x(z) + 0.035
    tilt = math.atan2(z - ZC, -x)  # follow the wall normal
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=1, depth=0.05, location=(x, y, z), rotation=(0, math.radians(90) + tilt, 0))
    bz = bpy.context.active_object
    bz.scale = (0.21, 0.13, 1)  # oval: tall in z after rotation
    bpy.ops.object.transform_apply(scale=True)
    obj(f"SM_bezel_{i}", M["bezel"], bevel=0.01)
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=1, depth=0.01, location=(x + 0.03, y, z), rotation=(0, math.radians(90) + tilt, 0))
    pn = bpy.context.active_object
    pn.scale = (0.17, 0.095, 1)
    bpy.ops.object.transform_apply(scale=True)
    panes.append(obj(f"SM_pane_{i}", M["pane"]))


# ---------------- suites ----------------
def suite(x0, y0, mirror=1, lamp_on=True, window=True, idx=0):
    """x0 = suite centre, y0 = seat back. mirror=-1 flips the console side."""
    g = []
    # privacy shell: back wall + aisle-side wall with a curved top, wood capping
    g.append(box(f"SM_shellback_{idx}", M["shell"], (x0, y0 - 0.08, 0.6), (1.05, 0.08, 1.2), bevel=0.03))
    g.append(box(f"SM_shellside_{idx}", M["shell"], (x0 + mirror * 0.52, y0 + 0.75, 0.55), (0.07, 1.65, 1.1), bevel=0.03))
    g.append(box(f"SM_cap_{idx}", M["wood"], (x0 + mirror * 0.52, y0 + 0.75, 1.115), (0.09, 1.65, 0.03), bevel=0.01))
    # seat: cushion, backrest (reclined for sleep), headrest
    g.append(box(f"SM_cushion_{idx}", M["cushion"], (x0 - mirror * 0.08, y0 + 0.45, 0.47), (0.56, 0.62, 0.12), bevel=0.04))
    g.append(box(f"SM_back_{idx}", M["leather"], (x0 - mirror * 0.08, y0 + 0.08, 0.82), (0.56, 0.12, 0.72), bevel=0.05,
                 rot=(math.radians(-22), 0, 0)))
    g.append(box(f"SM_head_{idx}", M["cushion"], (x0 - mirror * 0.08, y0 - 0.05, 1.22), (0.44, 0.1, 0.2), bevel=0.04,
                 rot=(math.radians(-22), 0, 0)))
    g.append(box(f"SM_base_{idx}", M["shell_in"], (x0 - mirror * 0.08, y0 + 0.45, 0.2), (0.5, 0.6, 0.4), bevel=0.02))
    # footwell / ottoman + front wall with the sleeping screen
    g.append(box(f"SM_otto_{idx}", M["cushion"], (x0 - mirror * 0.08, y0 + 1.35, 0.42), (0.46, 0.36, 0.1), bevel=0.03))
    g.append(box(f"SM_front_{idx}", M["shell"], (x0, y0 + 1.6, 0.55), (1.05, 0.08, 1.1), bevel=0.03))
    g.append(box(f"SM_scr_{idx}", M["screen"], (x0 - mirror * 0.08, y0 + 1.555, 0.86), (0.46, 0.01, 0.28), bevel=0.004))
    # side console (window side) with wood top + reading lamp
    cx = x0 - mirror * 0.43
    g.append(box(f"SM_console_{idx}", M["shell"], (cx, y0 + 0.65, 0.33), (0.26, 1.2, 0.66), bevel=0.02))
    g.append(box(f"SM_ctop_{idx}", M["wood"], (cx, y0 + 0.65, 0.675), (0.28, 1.22, 0.025), bevel=0.008))
    bpy.ops.mesh.primitive_cylinder_add(radius=0.012, depth=0.34, location=(cx, y0 + 0.2, 0.86))
    g.append(obj(f"SM_lampstem_{idx}", M["metal"]))
    bpy.ops.mesh.primitive_cone_add(radius1=0.06, radius2=0.03, depth=0.07, location=(cx, y0 + 0.2, 1.05))
    g.append(obj(f"SM_lampshade_{idx}", M["lampshade"] if lamp_on else M["metal"]))
    if lamp_on:
        bpy.ops.object.light_add(type="POINT", location=(cx, y0 + 0.2, 1.0))
        lt = bpy.context.active_object
        lt.data.energy = 6
        lt.data.color = (1.0, 0.7, 0.42)
        lt.data.shadow_soft_size = 0.04
    # bedding: pillow on the headrest, folded blanket on the cushion (made-up for sleep)
    g.append(soft(f"SM_pillow_{idx}", M["pillow"], (x0 - mirror * 0.08, y0 + 0.24, 1.0), (0.44, 0.14, 0.3), rot=(math.radians(-22), 0, 0)))
    g.append(soft(f"SM_blanket_{idx}", M["blanket"], (x0 - mirror * 0.08, y0 + 0.62, 0.58), (0.54, 0.5, 0.09), rot=(0, 0, math.radians(4))))
    g.append(soft(f"SM_blanket2_{idx}", M["blanket"], (x0 - mirror * 0.08, y0 + 0.92, 0.51), (0.56, 0.08, 0.16)))
    return g


for r in range(ROWS):
    y = r * PITCH
    stag = 0.0 if r % 2 == 0 else 0.25  # staggered layout
    suite(-1.72 + stag, y, mirror=-1, lamp_on=r in (1, 3, 4), idx=r)  # window suites, console at window side
    suite(1.15, y + 0.6, mirror=1, lamp_on=r in (0, 2, 5), idx=100 + r)  # centre/right suites

# ---------------- world, camera, render ----------------
w = bpy.data.worlds.new("W")
scene.world = w
w.use_nodes = True
w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.004, 0.005, 0.012, 1)
w.node_tree.nodes["Background"].inputs["Strength"].default_value = 1.0
bpy.ops.object.camera_add(location=(0.2, 9.6, 1.42))
cam = bpy.context.active_object
cam.data.lens = 24
cam.data.dof.use_dof = True
cam.data.dof.focus_distance = 4.5
cam.data.dof.aperture_fstop = 4.0
target = Vector((-1.7, 4.6, 0.8))
cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
scene.camera = cam
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = a.samples
scene.cycles.use_denoising = True
scene.render.resolution_x = int(3840 * a.res)
scene.render.resolution_y = int(2160 * a.res)
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"
scene.view_settings.exposure = 0.1
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = a.out
bpy.ops.render.render(write_still=True)
print("saved", a.out)

if a.mask:
    black = mat("M_black", (0, 0, 0), 1)
    white = mat("M_white", (0, 0, 0), 1, emit=(1, 1, 1), strength=1)
    for o in scene.objects:
        if o.type == "MESH":
            o.data.materials.clear()
            o.data.materials.append(white if o.name.startswith("SM_pane_") else black)
        if o.type == "LIGHT":
            o.hide_render = True
    w.node_tree.nodes["Background"].inputs["Color"].default_value = (0, 0, 0, 1)
    scene.cycles.samples = 4
    scene.cycles.use_denoising = False
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"
    scene.view_settings.exposure = 0
    cam.data.dof.use_dof = False
    scene.render.filepath = a.out.replace(".png", "_mask.png")
    bpy.ops.render.render(write_still=True)
    print("saved mask")
