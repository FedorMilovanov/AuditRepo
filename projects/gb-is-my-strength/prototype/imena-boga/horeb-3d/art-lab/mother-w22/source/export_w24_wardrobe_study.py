import bpy,json,hashlib,os
from pathlib import Path
root=Path(os.environ["HOREB_W24_OUTPUT"]).resolve()
src=root/"w24-wardrobe-study.blend"
out=root/"w24-wardrobe-study.glb"
assert not out.exists(), "Never overwrite an existing export"
bpy.ops.wm.open_mainfile(filepath=str(src),load_ui=False)
rig=bpy.data.objects["MOTHER_PERFORMER__53_BONE_RIG"]
body=bpy.data.objects["ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0"]
assert len(rig.data.bones)==53 and len(body.data.vertices)==19158
assert {t.name for t in rig.animation_data.nla_tracks}=={"Mother_QuietIdle","Mother_GestureTowardsBasket"}
bpy.ops.object.select_all(action="DESELECT")
body.select_set(True);bpy.context.view_layer.objects.active=body
if body.data.shape_keys is not None:bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
masks=[m for m in body.modifiers if m.type=="MASK"]
assert len(masks)==1
while body.modifiers.find(masks[0].name)>0:bpy.ops.object.modifier_move_up(modifier=masks[0].name)
bpy.ops.object.modifier_apply(modifier=masks[0].name)
assert len(body.data.vertices)<18900
bpy.ops.object.select_all(action="DESELECT")
rig.select_set(True);body.select_set(True)
for obj in bpy.data.objects:
 if obj.type=="MESH" and obj.parent==rig:obj.select_set(True)
bpy.context.view_layer.objects.active=rig
bpy.ops.export_scene.gltf(filepath=str(out),export_format="GLB",use_selection=True,export_yup=True,export_animations=True,export_animation_mode="NLA_TRACKS",export_materials="EXPORT",export_apply=False)
assert out.stat().st_size>2000000
data={"status":"ART_HOLD_LOCAL_W24_WARDROBE","blend_sha256":hashlib.sha256(src.read_bytes()).hexdigest(),"glb_sha256":hashlib.sha256(out.read_bytes()).hexdigest(),"glb_bytes":out.stat().st_size,"bones":53,"body_vertices_after_helper_mask":len(body.data.vertices),"clips":["Mother_QuietIdle","Mother_GestureTowardsBasket"]}
(root/"w24-export-manifest.json").write_text(json.dumps(data,indent=2),encoding="utf8")
print("W24_WARDROBE_EXPORT "+json.dumps(data),flush=True)
