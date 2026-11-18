"""Realistic stills for the chocolate Short (Blender 5.3, Cycles CPU). Units: metres. Repeatable.

  ~/.venvs/bpy/bin/python scripts/3d/models/cikolata_scenes.py -- --scene open --out a.png [--res 1 --samples 96]

Scenes: open (split pod with white pulp/beans on a banana leaf), ferment (crate of beans under
banana leaves), roast (roasted beans + nibs on slate), conche (swirling liquid chocolate + steel
roller), bar (glossy bar broken in two on marble). The hook/loop still comes from cacao_scene.py.
"""
import argparse
import math
import random
import sys
import time

import bpy
import bmesh  # noqa: E402  (bmesh needs bpy imported first)
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--scene", required=True, choices=["open", "ferment", "roast", "conche", "bar"])
ap.add_argument("--out", required=True)
ap.add_argument("--res", type=float, default=1.0)
ap.add_argument("--samples", type=int, default=96)
a = ap.parse_args(argv)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
random.seed(7)


# ---------- helpers ----------
def mat(name, color=(0.8, 0.8, 0.8), rough=0.5, coat=0.0, sss=0.0, metal=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Metallic"].default_value = metal
    if sss:
        b.inputs["Subsurface Weight"].default_value = sss
        b.inputs["Subsurface Radius"].default_value = (0.01, 0.006, 0.004)
    return m


def add_bump(m, scale=80.0, strength=0.3, dist=0.002, kind="noise", color_var=0.0):
    n, l = m.node_tree.nodes, m.node_tree.links
    b = n["Principled BSDF"]
    if kind == "voronoi":
        t = n.new("ShaderNodeTexVoronoi")
        out = t.outputs["Distance"]
    else:
        t = n.new("ShaderNodeTexNoise")
        t.inputs["Detail"].default_value = 10
        out = t.outputs["Fac"]
    t.inputs["Scale"].default_value = scale
    bump = n.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = strength
    bump.inputs["Distance"].default_value = dist
    l.new(out, bump.inputs["Height"])
    l.new(bump.outputs["Normal"], b.inputs["Normal"])
    if color_var:
        base = tuple(b.inputs["Base Color"].default_value)
        ramp = n.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].color = tuple(c * (1 - color_var) for c in base[:3]) + (1,)
        ramp.color_ramp.elements[1].color = tuple(min(1, c * (1 + color_var)) for c in base[:3]) + (1,)
        n2 = n.new("ShaderNodeTexNoise")
        n2.inputs["Scale"].default_value = scale / 6
        l.new(n2.outputs["Fac"], ramp.inputs["Fac"])
        l.new(ramp.outputs["Color"], b.inputs["Base Color"])
    return m


def ellipsoid(loc, size, m, rot=(0, 0, 0), seg=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=seg // 2, radius=1, location=loc)
    o = bpy.context.object
    o.scale = size
    o.rotation_euler = rot
    bpy.ops.object.shade_smooth()
    o.data.materials.append(m)
    return o


def bean(loc, m, s=1.0, rot=None):
    rot = rot or (random.uniform(0, 6.3), random.uniform(0, 6.3), random.uniform(0, 6.3))
    return ellipsoid(loc, (0.011 * s, 0.0075 * s, 0.017 * s), m, rot, seg=16)


def banana_leaf(loc, length, width, rot, m):
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=60, y_subdivisions=12, size=2, location=loc)
    o = bpy.context.object
    for v in o.data.vertices:
        x, y, _ = v.co
        w = math.sqrt(max(0.0, 1 - x * x)) ** 0.7
        v.co = Vector((x * length, y * width * w, -0.07 * width * y * y + 0.004 * math.sin(x * 9)))
    o.rotation_euler = rot
    bpy.ops.object.shade_smooth()
    o.data.materials.append(m)
    return o


def leaf_mat():
    m = mat("M_BananaLeaf", (0.07, 0.24, 0.04), 0.45, sss=0.05)
    n, l = m.node_tree.nodes, m.node_tree.links
    w = n.new("ShaderNodeTexWave")
    w.wave_type = "BANDS"
    w.bands_direction = "Y"
    w.inputs["Scale"].default_value = 60
    bump = n.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.25
    l.new(w.outputs["Fac"], bump.inputs["Height"])
    l.new(bump.outputs["Normal"], n["Principled BSDF"].inputs["Normal"])
    return m


def wood_mat():
    m = mat("M_Wood", (0.25, 0.14, 0.07), 0.7)
    n, l = m.node_tree.nodes, m.node_tree.links
    w = n.new("ShaderNodeTexNoise")
    w.inputs["Scale"].default_value = 3
    w.inputs["Detail"].default_value = 10
    w.inputs["Roughness"].default_value = 0.6
    mp = n.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (2, 60, 2)  # long grain along Y
    tc = n.new("ShaderNodeTexCoord")
    l.new(tc.outputs["Object"], mp.inputs["Vector"])
    l.new(mp.outputs["Vector"], w.inputs["Vector"])
    r = n.new("ShaderNodeValToRGB")
    r.color_ramp.elements[0].position = 0.3
    r.color_ramp.elements[0].color = (0.07, 0.035, 0.018, 1)
    r.color_ramp.elements[1].position = 0.75
    r.color_ramp.elements[1].color = (0.32, 0.18, 0.09, 1)
    l.new(w.outputs["Fac"], r.inputs["Fac"])
    l.new(r.outputs["Color"], n["Principled BSDF"].inputs["Base Color"])
    bump = n.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.12
    l.new(w.outputs["Fac"], bump.inputs["Height"])
    l.new(bump.outputs["Normal"], n["Principled BSDF"].inputs["Normal"])
    return m


def plane(loc, size, m, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc, rotation=rot)
    o = bpy.context.object
    o.scale = (size[0], size[1], 1)
    o.data.materials.append(m)
    return o


def setup(cam_loc, target, lens=60, fstop=2.8, sun_rot=(50, -30, -40), sun=4.0, fill=20, world=(0.02, 0.02, 0.02), focus=None):
    w = bpy.data.worlds.new("W")
    scene.world = w
    w.use_nodes = True
    w.node_tree.nodes["Background"].inputs["Color"].default_value = (*world, 1)
    bpy.ops.object.light_add(type="SUN", rotation=tuple(math.radians(x) for x in sun_rot))
    s = bpy.context.object
    s.data.energy = sun
    s.data.angle = math.radians(8)
    s.data.color = (1.0, 0.86, 0.68)
    bpy.ops.object.light_add(type="AREA", location=(-0.7, -0.8, 0.9))
    f = bpy.context.object
    f.data.energy = fill
    f.data.size = 1.5
    f.data.color = (0.75, 0.85, 1.0)
    f.rotation_euler = (math.radians(55), 0, math.radians(-40))
    bpy.ops.object.camera_add(location=cam_loc)
    c = bpy.context.object
    c.data.lens = lens
    c.data.dof.use_dof = True
    c.data.dof.aperture_fstop = fstop
    t = Vector(target)
    c.data.dof.focus_distance = (t - c.location).length if focus is None else focus
    c.rotation_euler = (t - c.location).to_track_quat("-Z", "Y").to_euler()
    scene.camera = c


# ---------- scenes ----------
def half_pod(name, shell, inner):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=48, radius=1)
    o = bpy.context.object
    o.name = name
    for v in o.data.vertices:
        vx, vy, vz = v.co
        th = math.atan2(vy, vx)
        taper = (1 - abs(vz) ** (1.5 if vz < 0 else 2.6)) ** (0.75 if vz < 0 else 0.5)
        r = 0.07 * taper * (1 + 0.06 * math.cos(10 * th))
        rr = math.hypot(vx, vy)
        v.co = Vector((r * vx / rr if rr > 1e-6 else 0, r * vy / rr if rr > 1e-6 else 0, 0.12 * vz))
    bm = bmesh.new()
    bm.from_mesh(o.data)
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, 0), plane_no=(0, 1, 0), clear_outer=True)
    bm.to_mesh(o.data)
    bm.free()
    sol = o.modifiers.new("shell", "SOLIDIFY")
    sol.thickness = 0.012
    sol.material_offset = 1
    o.data.materials.append(shell)
    o.data.materials.append(inner)
    bpy.ops.object.shade_smooth()
    return o


def scene_open():
    plane((0, 0, 0), (2, 2), wood_mat())
    leaf = leaf_mat()
    banana_leaf((0.0, 0.0, 0.003), 0.36, 0.2, (0, 0, math.radians(-8)), leaf)
    shell = mat("M_PodShell", (0.75, 0.32, 0.03), 0.5, coat=0.1)
    add_bump(shell, 120, 0.3, color_var=0.35)
    inner = mat("M_PodInner", (0.92, 0.84, 0.68), 0.6, sss=0.2)
    pulp = mat("M_Pulp", (0.96, 0.95, 0.9), 0.2, sss=0.4)
    add_bump(pulp, 200, 0.08)
    for side, (x, y, rz) in enumerate([(-0.085, 0.03, 96), (0.075, -0.02, 84)]):
        o = half_pod(f"SM_PodHalf{side}", shell, inner)
        o.rotation_euler = (math.radians(90), 0, math.radians(rz))  # cut face up
        o.location = (x, y, 0.07)
        bpy.context.view_layer.update()
        if side == 1:  # the half that holds the white pulp-covered bean mass
            for row in range(8):
                lz = -0.085 + row * 0.024
                rad = 0.07 * max(0.0, 1 - abs(lz / 0.12) ** 2) ** 0.5
                for col in range(-2, 3):
                    lx = col * rad * 0.3
                    if abs(lx) > rad * 0.8:
                        continue
                    p = o.matrix_world @ Vector((lx, -0.004, lz + random.uniform(-0.003, 0.003)))
                    ellipsoid(tuple(p), (0.012, 0.016, 0.01), pulp, (0, 0, math.radians(rz + random.uniform(-12, 12))), seg=20)
    for i in range(3):
        bean((0.17 + random.uniform(-0.02, 0.03), -0.13 + random.uniform(-0.02, 0.02), 0.01), pulp, 1.25)
    setup((0.03, -0.36, 0.44), (0.0, -0.01, 0.06), lens=48, fstop=3.2, sun_rot=(48, -25, -60), sun=4.5, world=(0.015, 0.012, 0.01))


def scene_ferment():
    plane((0, 0, 0), (3, 3), mat("M_Ground", (0.12, 0.08, 0.05), 0.95))
    wood = wood_mat()
    # crate: 4 plank walls
    W, D, H = 0.5, 0.36, 0.16
    for (lx, ly, sx, sy) in [(0, -D / 2, W, 0.02), (0, D / 2, W, 0.02), (-W / 2, 0, 0.02, D), (W / 2, 0, 0.02, D)]:
        for p in range(3):
            bpy.ops.mesh.primitive_cube_add(size=1, location=(lx, ly, 0.03 + p * 0.052))
            o = bpy.context.object
            o.scale = (sx, sy, 0.048)
            bev = o.modifiers.new("b", "BEVEL")
            bev.width = 0.003
            o.data.materials.append(wood)
    beanm = mat("M_FermentBean", (0.36, 0.17, 0.12), 0.45, sss=0.1)
    add_bump(beanm, 220, 0.15, color_var=0.3)
    pale = mat("M_PaleBean", (0.62, 0.48, 0.38), 0.35, sss=0.2)
    for i in range(520):
        x = random.uniform(-W / 2 + 0.02, W / 2 - 0.02)
        y = random.uniform(-D / 2 + 0.02, D / 2 - 0.02)
        z = 0.125 + random.uniform(0, 0.03)
        bean((x, y, z), beanm if random.random() > 0.25 else pale, 1.0)
    leaf = leaf_mat()
    banana_leaf((0.2, 0.1, 0.165), 0.3, 0.1, (math.radians(4), math.radians(-6), math.radians(35)), leaf)
    banana_leaf((-0.05, 0.16, 0.17), 0.34, 0.1, (0, math.radians(5), math.radians(-10)), leaf)
    banana_leaf((-0.3, 0.05, 0.1), 0.3, 0.1, (math.radians(-20), 0, math.radians(80)), leaf)
    setup((0.12, -0.62, 0.52), (0.0, -0.02, 0.13), lens=45, fstop=3.5, sun_rot=(42, -10, -55), sun=4.2, world=(0.02, 0.025, 0.015))


def scene_roast():
    slate = mat("M_Slate", (0.05, 0.05, 0.055), 0.65)
    add_bump(slate, 30, 0.2, color_var=0.25)
    plane((0, 0, 0), (2, 2), slate)
    roasted = mat("M_RoastBean", (0.16, 0.07, 0.035), 0.42, coat=0.15)
    add_bump(roasted, 260, 0.25, color_var=0.3)
    # heap of whole roasted beans
    for i in range(170):
        r = abs(random.gauss(0, 0.06))
        ang = random.uniform(0, 6.283)
        h = max(0.0, 0.07 - r * 0.9)
        bean((-0.06 + r * math.cos(ang), 0.04 + r * math.sin(ang), 0.008 + random.uniform(0, h)), roasted)
    # cracked nibs: irregular ico spheres
    nib = mat("M_Nib", (0.13, 0.055, 0.03), 0.55)
    add_bump(nib, 300, 0.4)
    for i in range(110):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=1, location=(0.09 + random.gauss(0, 0.045), -0.08 + random.gauss(0, 0.035), 0.004))
        o = bpy.context.object
        for v in o.data.vertices:
            v.co *= random.uniform(0.6, 1.3)
        s = random.uniform(0.003, 0.0065)
        o.scale = (s, s * random.uniform(0.6, 1.2), s * 0.6)
        o.rotation_euler = (random.uniform(0, 6), random.uniform(0, 6), random.uniform(0, 6))
        o.data.materials.append(nib)
    # a few husk flakes
    husk = mat("M_Husk", (0.35, 0.22, 0.13), 0.8)
    for i in range(14):
        ellipsoid((0.15 + random.gauss(0, 0.05), -0.02 + random.gauss(0, 0.05), 0.002), (0.008, 0.006, 0.0008), husk, (0, 0, random.uniform(0, 6)), seg=12)
    setup((0.04, -0.4, 0.33), (0.01, -0.01, 0.02), lens=55, fstop=2.6, sun_rot=(38, -20, -70), sun=5.0, fill=12, world=(0.01, 0.008, 0.006))


def scene_conche():
    choc = mat("M_LiquidChoc", (0.11, 0.045, 0.02), 0.12, coat=0.6)
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=260, y_subdivisions=260, size=1.2, location=(0, 0, 0.0))
    o = bpy.context.object
    for v in o.data.vertices:
        x, y, _ = v.co
        r = math.hypot(x, y)
        th = math.atan2(y, x)
        z = 0.006 * math.sin(28 * r - 3 * th) * math.exp(-r * 2.2) + 0.002 * math.sin(60 * r + th * 5)
        # wave pushed ahead of the roller
        z += 0.018 * math.exp(-((x - 0.02) ** 2) / 0.004) * math.exp(-((y + 0.05) ** 2) / 0.05)
        v.co.z = z
    bpy.ops.object.shade_smooth()
    o.data.materials.append(choc)
    steel = mat("M_Steel", (0.75, 0.75, 0.76), 0.22, metal=1.0)
    bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=0.055, depth=0.5, location=(-0.12, 0.08, 0.03), rotation=(math.radians(90), 0, math.radians(12)))
    roller = bpy.context.object
    bpy.ops.object.shade_smooth()
    roller.data.materials.append(steel)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.6, minor_radius=0.03, location=(0, 0, 0.02))
    bpy.ops.object.shade_smooth()
    bpy.context.object.data.materials.append(steel)
    setup((0.06, -0.58, 0.4), (0.0, 0.02, 0.0), lens=38, fstop=3.2, sun_rot=(35, -15, -30), sun=3.5, fill=35, world=(0.03, 0.025, 0.02))


def scene_bar():
    marble = mat("M_Marble", (0.85, 0.84, 0.82), 0.25)
    n, l = marble.node_tree.nodes, marble.node_tree.links
    w = n.new("ShaderNodeTexWave")
    w.inputs["Scale"].default_value = 3
    w.inputs["Distortion"].default_value = 12
    w.inputs["Detail"].default_value = 8
    r = n.new("ShaderNodeValToRGB")
    r.color_ramp.elements[0].position = 0.0
    r.color_ramp.elements[0].color = (0.45, 0.45, 0.47, 1)
    r.color_ramp.elements[1].position = 0.08
    r.color_ramp.elements[1].color = (0.88, 0.87, 0.85, 1)
    l.new(w.outputs["Fac"], r.inputs["Fac"])
    l.new(r.outputs["Color"], n["Principled BSDF"].inputs["Base Color"])
    plane((0, 0, 0), (2, 2), marble)
    dark = mat("M_DarkChoc", (0.075, 0.032, 0.017), 0.18, coat=0.35)
    add_bump(dark, 600, 0.03)
    cols, rows, sq, gap = 4, 3, 0.035, 0.004
    for half, (dx, rz, tilt) in enumerate([(-0.012, 6, 0), (0.035, -10, 4)]):
        for c in range(cols // 2):
            for rr in range(rows):
                cx = (c + half * 2 - (cols - 1) / 2) * (sq + gap)
                cy = (rr - (rows - 1) / 2) * (sq + gap)
                bpy.ops.mesh.primitive_cube_add(size=1, location=(cx, cy, 0.012))
                o = bpy.context.object
                o.scale = (sq, sq, 0.012)
                bev = o.modifiers.new("b", "BEVEL")
                bev.width = 0.004
                bev.segments = 4
                o.data.materials.append(dark)
                bpy.ops.object.shade_smooth()
                o.select_set(True)
        base_x = (half * 2 - (cols - 1) / 2 + 0.5) * (sq + gap)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(base_x, 0, 0.004))
        b = bpy.context.object
        b.scale = (2 * (sq + gap), rows * (sq + gap), 0.008)
        b.data.materials.append(dark)
        # group the half under an empty and pose it
        bpy.ops.object.empty_add(location=(base_x, 0, 0))
        e = bpy.context.object
        for ob in list(scene.objects):
            if ob.type == "MESH" and ob.parent is None and ob.name.startswith("Cube") and abs(ob.location.x - base_x) < 2.1 * (sq + gap) and "done" not in ob:
                ob.parent = e
                ob.matrix_parent_inverse = e.matrix_world.inverted()
                ob["done"] = 1
        e.location.x += dx
        e.rotation_euler = (0, math.radians(tilt), math.radians(rz))
    for i in range(10):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=random.uniform(0.002, 0.005), location=(0.012 + random.gauss(0, 0.02), random.gauss(0, 0.04), 0.002))
        bpy.context.object.data.materials.append(dark)
    setup((0.06, -0.32, 0.22), (0.01, 0.0, 0.01), lens=60, fstop=3.0, sun_rot=(40, -20, -50), sun=4.0, fill=30, world=(0.05, 0.045, 0.04))


{"open": scene_open, "ferment": scene_ferment, "roast": scene_roast, "conche": scene_conche, "bar": scene_bar}[a.scene]()

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
print(f"rendered {a.scene} -> {a.out} in {time.time() - t:.1f}s")
