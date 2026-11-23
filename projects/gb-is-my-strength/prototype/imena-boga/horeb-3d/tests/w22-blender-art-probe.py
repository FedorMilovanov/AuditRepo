"""HOREB W22 — genuine native .blend CPU render probe, never art approval.
Run with isolated Blender 4.5.16 / bpy 4.5.16 on CI. No MPFB import needed:
the editable W19H .blend is already packed and contains the skinned rig.
"""
from __future__ import annotations
import bpy
import hashlib
import json
import os
from pathlib import Path
from mathutils import Vector

PROJECT = Path(__file__).resolve().parents[1]
SOURCE = PROJECT / "art-lab/mother-w22/source/horeb_mother_w22_candidate.blend"
OUT = Path(os.environ.get("HOREB_W22_ART_OUTPUT", str(PROJECT / ".test-build/w22-native-blender")))
OUT.mkdir(parents=True, exist_ok=True)
assert SOURCE.is_file(), SOURCE
manifest = json.loads((PROJECT / "art-lab/mother-w22/source/horeb_mother_w22_candidate.manifest.json").read_text(encoding="utf8"))
assert manifest["status"] == "ART_HOLD_W22_EARLY_CANDIDATE"
assert hashlib.sha256(SOURCE.read_bytes()).hexdigest() == manifest["blender_source_sha256"]
assert (PROJECT / "public/artlab/horeb_mother_w22_candidate.glb").is_file()
source_sha = hashlib.sha256(SOURCE.read_bytes()).hexdigest()
print("W22_NATIVE_BLEND_SOURCE_SHA", source_sha, flush=True)

# Native Blender source, not the triangulated runtime glTF. Never save over it.
bpy.ops.wm.open_mainfile(filepath=str(SOURCE), load_ui=False)
rig = bpy.data.objects.get("MOTHER_PERFORMER__53_BONE_RIG")
body = bpy.data.objects.get("ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0")
assert rig is not None and rig.type == "ARMATURE"
assert body is not None and body.type == "MESH"
assert len(rig.data.bones) == 53, len(rig.data.bones)
assert any(m.type == "ARMATURE" and m.object == rig for m in body.modifiers)
assert len(body.data.vertices) == 19158, len(body.data.vertices)
tracks = list(rig.animation_data.nla_tracks)
track_names = {t.name for t in tracks}
assert {"Mother_QuietIdle", "Mother_GestureTowardsBasket"} <= track_names, track_names

scene = bpy.context.scene
# W22b regression gates inspect the actual EDITABLE native scene, not only
# GLB animation transforms. Early W22 passed glTF contact but saved the rest
# pose with an extended arm and a linen hood floating above the scalp.
for track in tracks:
    track.mute = track.name != "Mother_QuietIdle"
scene.frame_set(1)
bpy.context.view_layer.update()
neutral_wrist = rig.pose.bones["lowerarm_l"].tail.copy()
assert neutral_wrist.z < 1.02 and neutral_wrist.y < -.07, (
    "W22 idle native arm is still raised", tuple(neutral_wrist))

def evaluated_top(object_name):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    obj = bpy.data.objects[object_name].evaluated_get(depsgraph)
    mesh = obj.to_mesh()
    try:
        return max((obj.matrix_world @ v.co).z for v in mesh.vertices)
    finally:
        obj.to_mesh_clear()

scalp_top = evaluated_top(body.name)
hood_top = evaluated_top("W22_plain_linen_head_cover")
assert abs(hood_top - scalp_top) < .035, (
    "W22 linen cover floats above anatomical scalp", scalp_top, hood_top)
print("W22_NATIVE_REST_AND_HEAD_COVER_PASS", {
    "wrist": [round(float(v), 4) for v in neutral_wrist],
    "scalp_top": round(scalp_top, 4),
    "hood_top": round(hood_top, 4),
}, flush=True)
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = 12
scene.render.resolution_x = 640
scene.render.resolution_y = 640
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.film_transparent = False
scene.render.threads_mode = "FIXED"
scene.render.threads = 4
scene.view_settings.view_transform = "AgX"
scene.world = bpy.data.worlds.new("W22_StudioNeutralWorld")
scene.world.use_nodes = True
background = scene.world.node_tree.nodes.get("Background")
background.inputs["Color"].default_value = (.20, .18, .16, 1)
background.inputs["Strength"].default_value = .72

# Neutral authored scene lighting (never added to the stored original .blend).
def area_light(name, location, strength, size):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = strength
    data.shape = "DISK"
    data.size = size
    light = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(light)
    light.location = location
    direction = Vector((0, 0, 1.05)) - light.location
    light.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return light

area_light("W22_Key_Area", (1.2, -2.0, 3.4), 480, 3.0)
area_light("W22_Fill_Area", (-1.8, -1.3, 2.2), 220, 2.6)
area_light("W22_Rim_Area", (.4, 1.5, 3.4), 350, 2.1)
cam_data = bpy.data.cameras.new("W22_ReviewCamera")
cam = bpy.data.objects.new("W22_ReviewCamera", cam_data)
bpy.context.collection.objects.link(cam)
scene.camera = cam

def configure_camera(position, target, focal_mm):
    cam.location = position
    cam.rotation_euler = (Vector(target)-cam.location).to_track_quat("-Z", "Y").to_euler()
    cam_data.type = "PERSP"
    cam_data.lens = focal_mm
    cam_data.clip_start = .03
    cam_data.clip_end = 100

views = [
    ("w22-native-full", "Mother_QuietIdle", 1, (0, -3.55, 1.68), (0, 0, .87), 46),
    ("w22-native-face", "Mother_QuietIdle", 1, (0, -1.48, 1.48), (0, 0, 1.47), 54),
    ("w22-native-gesture-frame60", "Mother_GestureTowardsBasket", 60,
     (.55, -2.9, 1.65), (0, 0, .98), 48),
]
renders = []
for title, active_track, frame, eye, target, focal in views:
    for track in tracks:
        track.mute = track.name != active_track
    scene.frame_set(frame)
    bpy.context.view_layer.update()
    configure_camera(eye, target, focal)
    scene.render.filepath = str(OUT / (title + ".png"))
    bpy.ops.render.render(write_still=True)
    image = OUT / (title + ".png")
    assert image.is_file() and image.stat().st_size > 2000, image
    renders.append({"file": image.name, "bytes": image.stat().st_size,
                    "sha256": hashlib.sha256(image.read_bytes()).hexdigest(),
                    "clip": active_track, "frame": frame})
    print("W22_NATIVE_RENDER", title, image.stat().st_size, flush=True)

manifest = {
    "status": "ART_HOLD_NATIVE_SOURCE_PROBE_ONLY",
    "source_sha256": source_sha,
    "source_vertices": len(body.data.vertices),
    "rig_bones": len(rig.data.bones),
    "nla_tracks": sorted(track_names),
    "render_engine": "CYCLES_CPU",
    "renders": renders,
    "limits": "Native render proves read/geometry only, not realism, historical appearance, "
              "rigged mesh export quality or permission to integrate with W15.",
}
(OUT / "w22-blender-source-probe.json").write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf8")
print("W22_NATIVE_BLENDER_PROBE_PASS_ART_HOLD", json.dumps(
    {"rig":manifest["rig_bones"],"renders":[x["file"] for x in renders]}), flush=True)
