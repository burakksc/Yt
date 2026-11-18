"""Realistic cacao pod on a trunk (Blender 5.3, Cycles CPU). Units: metres.

  ~/.venvs/bpy/bin/python scripts/3d/models/cacao_scene.py -- --out a.png [--res 0.5 --samples 64 --glb x.glb]

Builds the scene from scratch (repeatable), renders one portrait still, optionally exports a GLB
(clay/real-time version). Pod: 10 ribs, pointed tip, yellow->orange->red gradient, noise bumps.
"""
import argparse
import math
import sys
import time

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--out", required=True)
ap.add_argument("--res", type=float, default=1.0)
ap.add_argument("--samples", type=int, default=64)
ap.add_argument("--glb")
a = ap.parse_args(argv)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    return m, m.node_tree.nodes, m.node_tree.links


# ---------- pod ----------
def make_pod(name, loc, rot, scale, colors):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=64, radius=1)
    pod = bpy.context.object
    pod.name = name
    for v in pod.data.vertices:
        x, y, z = v.co
        th = math.atan2(y, x)
        r = math.hypot(x, y)
        zz = z
        taper = (1 - abs(zz) ** (1.5 if zz < 0 else 2.6)) ** (0.75 if zz < 0 else 0.5)
        taper *= 0.88 + 0.12 * zz
        rib = 1 + 0.06 * math.cos(10 * th) + 0.012 * math.cos(20 * th)
        r2 = 0.075 * taper * rib
        v.co = Vector((r2 * math.cos(th) if r > 1e-6 else 0, r2 * math.sin(th) if r > 1e-6 else 0, 0.125 * zz))
    bpy.ops.object.shade_smooth()
    pod.location = loc
    pod.rotation_euler = rot
    pod.scale = (scale, scale, scale)
    m, n, l = mat("M_" + name)
    bsdf = n["Principled BSDF"]
    tc = n.new("ShaderNodeTexCoord")
    sep = n.new("ShaderNodeSeparateXYZ")
    l.new(tc.outputs["Object"], sep.inputs[0])
    mr = n.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = -0.13
    mr.inputs["From Max"].default_value = 0.13
    l.new(sep.outputs["Z"], mr.inputs["Value"])
    noise = n.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 18
    noise.inputs["Detail"].default_value = 8
    add = n.new("ShaderNodeMath")
    add.operation = "ADD"
    mul = n.new("ShaderNodeMath")
    mul.operation = "MULTIPLY"
    mul.inputs[1].default_value = 0.45
    l.new(noise.outputs["Fac"], mul.inputs[0])
    l.new(mr.outputs["Result"], add.inputs[0])
    l.new(mul.outputs[0], add.inputs[1])
    ramp = n.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.15
    ramp.color_ramp.elements[0].color = colors[0]
    ramp.color_ramp.elements[1].position = 0.95
    ramp.color_ramp.elements[1].color = colors[2]
    e = ramp.color_ramp.elements.new(0.5)
    e.color = colors[1]
    l.new(add.outputs[0], ramp.inputs["Fac"])
    l.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.5
    bsdf.inputs["Coat Weight"].default_value = 0.15
    bump_n = n.new("ShaderNodeTexNoise")
    bump_n.inputs["Scale"].default_value = 140
    bump_n.inputs["Detail"].default_value = 10
    vor = n.new("ShaderNodeTexVoronoi")
    vor.inputs["Scale"].default_value = 60
    mix = n.new("ShaderNodeMath")
    mix.operation = "ADD"
    l.new(bump_n.outputs["Fac"], mix.inputs[0])
    l.new(vor.outputs["Distance"], mix.inputs[1])
    bump = n.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.35
    bump.inputs["Distance"].default_value = 0.002
    l.new(mix.outputs[0], bump.inputs["Height"])
    l.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    pod.data.materials.append(m)
    return pod


RIPE = [(0.16, 0.025, 0.008, 1), (0.62, 0.11, 0.015, 1), (0.85, 0.42, 0.015, 1)]
UNRIPE = [(0.06, 0.12, 0.02, 1), (0.25, 0.4, 0.06, 1), (0.55, 0.62, 0.15, 1)]
pod = make_pod("SM_CacaoPod", (0.13, -0.01, 1.04), (math.radians(6), math.radians(18), math.radians(-25)), 1.0, RIPE)
pod2 = make_pod("SM_CacaoPodUnripe", (0.1, 0.02, 0.6), (math.radians(-6), math.radians(14), math.radians(40)), 0.78, UNRIPE)

# ---------- trunk + stem ----------
bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=0.085, depth=3.0, location=(-0.02, 0.06, 1.2))
trunk = bpy.context.object
trunk.name = "SM_Trunk"
bpy.ops.object.shade_smooth()
m, n, l = mat("M_Bark")
bsdf = n["Principled BSDF"]
tex = n.new("ShaderNodeTexVoronoi")
tex.feature = "DISTANCE_TO_EDGE"
tex.inputs["Scale"].default_value = 7
mapn = n.new("ShaderNodeMapping")
mapn.inputs["Scale"].default_value = (9, 9, 2.2)  # elongated bark plates
tc = n.new("ShaderNodeTexCoord")
l.new(tc.outputs["Object"], mapn.inputs["Vector"])
warp = n.new("ShaderNodeTexNoise")
warp.inputs["Scale"].default_value = 4
warp.inputs["Detail"].default_value = 4
wv = n.new("ShaderNodeVectorMath")
wv.operation = "MULTIPLY_ADD"
wv.inputs[1].default_value = (0.35, 0.35, 0.35)
l.new(warp.outputs["Color"], wv.inputs[0])
l.new(mapn.outputs["Vector"], wv.inputs[2])
l.new(mapn.outputs["Vector"], warp.inputs["Vector"])
l.new(wv.outputs["Vector"], tex.inputs["Vector"])
ramp = n.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].color = (0.015, 0.01, 0.008, 1)
ramp.color_ramp.elements[0].position = 0.0
ramp.color_ramp.elements[1].color = (0.2, 0.15, 0.1, 1)
ramp.color_ramp.elements[1].position = 0.12
l.new(tex.outputs["Distance"], ramp.inputs["Fac"])
lich = n.new("ShaderNodeTexNoise")
lich.inputs["Scale"].default_value = 30
lich.inputs["Detail"].default_value = 6
lr = n.new("ShaderNodeValToRGB")
lr.color_ramp.elements[0].position = 0.55
lr.color_ramp.elements[0].color = (0, 0, 0, 1)
lr.color_ramp.elements[1].position = 0.62
lr.color_ramp.elements[1].color = (1, 1, 1, 1)
l.new(lich.outputs["Fac"], lr.inputs["Fac"])
mixc = n.new("ShaderNodeMix")
mixc.data_type = "RGBA"
mixc.inputs["B"].default_value = (0.32, 0.36, 0.25, 1)
l.new(lr.outputs["Color"], mixc.inputs["Factor"])
l.new(ramp.outputs["Color"], mixc.inputs["A"])
l.new(mixc.outputs["Result"], bsdf.inputs["Base Color"])
bsdf.inputs["Roughness"].default_value = 0.9
bump = n.new("ShaderNodeBump")
bump.inputs["Strength"].default_value = 1.0
bump.inputs["Distance"].default_value = 0.006
l.new(tex.outputs["Distance"], bump.inputs["Height"])
l.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
trunk.data.materials.append(m)

bpy.context.view_layer.update()


def stem_between(a_, b_, r=0.009):
    d = b_ - a_
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=r, depth=d.length, location=(a_ + b_) / 2)
    st = bpy.context.object
    st.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
    st.data.materials.append(bpy.data.materials["M_Bark"])
    return st


for p_ in (pod, pod2):
    top = p_.matrix_world @ Vector((0, 0, 0.122))
    root = Vector((trunk.location.x, trunk.location.y, top.z + 0.03))
    root += (top - root).normalized() * 0.07 * Vector((1, 1, 0)).length / 1.4142
    stem_between(root, top + (top - root).normalized() * 0.006)

# ---------- leaves (background, out of focus) ----------
m, n, l = mat("M_Leaf")
n["Principled BSDF"].inputs["Base Color"].default_value = (0.05, 0.22, 0.04, 1)
n["Principled BSDF"].inputs["Roughness"].default_value = 0.5
import random
random.seed(4)
LEAVES = [(0.55, 1.1, 1.45, 30), (-0.6, 1.2, 1.25, -40), (0.4, 1.4, 0.75, 70)]
LEAVES += [(random.uniform(-1.6, 1.6), random.uniform(1.2, 3.5), random.uniform(0.2, 2.4), random.uniform(-90, 90)) for _ in range(40)]
for i, (x, y, z, rz) in enumerate(LEAVES):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=1, location=(x, y, z))
    leaf = bpy.context.object
    leaf.name = f"SM_Leaf{i}"
    leaf.scale = (0.32, 0.11, 0.012)
    leaf.rotation_euler = (math.radians(70), math.radians(15), math.radians(rz))
    leaf.data.materials.append(bpy.data.materials["M_Leaf"])
m, n, l = mat("M_Glint")
em = n.new("ShaderNodeEmission")
em.inputs["Color"].default_value = (1.0, 0.85, 0.55, 1)
em.inputs["Strength"].default_value = 6
l.new(em.outputs[0], n["Material Output"].inputs["Surface"])
for i in range(14):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=0.018, location=(random.uniform(-1.4, 1.6), random.uniform(5, 7), random.uniform(0.6, 2.6)))
    bpy.context.object.data.materials.append(bpy.data.materials["M_Glint"])

# ---------- world, lights, camera ----------
world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.02, 0.045, 0.02, 1)
bg.inputs["Strength"].default_value = 1.0

bpy.ops.object.light_add(type="SUN", rotation=(math.radians(55), math.radians(-35), math.radians(-40)))
sun = bpy.context.object
sun.data.energy = 4.5
sun.data.angle = math.radians(6)
sun.data.color = (1.0, 0.86, 0.66)
bpy.ops.object.light_add(type="AREA", location=(-0.6, -0.9, 1.3))
fill = bpy.context.object
fill.data.energy = 25
fill.data.size = 1.2
fill.data.color = (0.7, 0.85, 1.0)
fill.rotation_euler = (math.radians(75), 0, math.radians(-35))

bpy.ops.object.camera_add(location=(0.3, -1.15, 0.9))
cam = bpy.context.object
cam.data.lens = 55
cam.data.dof.use_dof = True
cam.data.dof.focus_object = pod
cam.data.dof.aperture_fstop = 1.6
direction = Vector((0.06, 0, 0.92)) - cam.location
cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
scene.camera = cam

# ---------- render ----------
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = a.samples
scene.cycles.use_denoising = True
scene.render.resolution_x = int(1080 * a.res)
scene.render.resolution_y = int(1920 * a.res)
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Punchy"
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = a.out
t = time.time()
bpy.ops.render.render(write_still=True)
print(f"rendered {a.out} in {time.time() - t:.1f}s")
if a.glb:
    bpy.ops.export_scene.gltf(filepath=a.glb, export_format="GLB", use_selection=False, export_cameras=False, export_lights=False)
    print("glb", a.glb)
