"""Native W28g visual review of exact exported actor in authored house."""
import bpy,os,json,hashlib,math
from pathlib import Path
from mathutils import Vector
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
root=Path(os.environ["HOREB_W28G_OUTPUT"]);house=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"])
m=json.loads((root/"w28g-manifest.json").read_text(encoding="utf8"));h=json.loads((house/"w28-house-manifest.json").read_text(encoding="utf8"))
asset=root/"w28g-actor.glb";source=house/"w28-house.blend"
assert sha(asset)==m["glb_sha256"]
assert sha(source)==h["blend_sha256"]=="2318fe98b8a4334682867551039018461ff062c92dc0f91900e020a84514d737"
audit=json.loads((root/"w28g-native-audit.json").read_text(encoding="utf8"))
assert sha(root/"w28g-native-audit.json")==m["audit_sha256"]
assert audit["house_sha256"]==m["house_sha256"] and all(not c["bad"] for c in audit["clips"])
export=json.loads((root/"w28g-glb-audit.json").read_text(encoding="utf8"))
assert export["actor_sha256"]==m["glb_sha256"] and export["house_sha256"]==m["house_sha256"]
assert len(export["clips"])==2
for c,name,n,step in zip(export["clips"],("Mother_GestureTowardsBasket","Mother_QuietIdle"),(417,144),(.25,1)):
 assert c["name"]==name and not c["bad"] and len(c["rows"])==n
 assert all(abs(r["frame"]-(1+i*step))<1e-6 and not any(r[k] for k in ("prop_hits","skin_cloth","self_pairs","sash_pairs","sash_self_pairs")) for i,r in enumerate(c["rows"]))
gaze=os.environ.get("HOREB_W28L_OUTPUT")
candidate=os.environ.get("HOREB_W28K_OUTPUT")
surface=os.environ.get("HOREB_W28N_OUTPUT")
assert not (gaze and candidate) and not (surface and (not gaze or candidate)), "Choose one visual study; W28n requires W28l provenance"
if candidate:
 candidate=Path(candidate)
 cm=json.loads((candidate/"w28k-material-manifest.json").read_text(encoding="utf8"))
 assert cm["status"]=="ART_HOLD_W28K_MATERIAL_ONLY" and cm["source_sha256"]==m["glb_sha256"]
 assert cm["source_audit_sha256"]==sha(root/"w28g-glb-audit.json")
 assert cm["geometry_animation_binary_unchanged"] is True and cm["house_sha256"]==m["house_sha256"]
 asset=candidate/"w28k-actor.glb"
 assert sha(asset)==cm["glb_sha256"] and asset.stat().st_size==cm["glb_bytes"]
if gaze:
 candidate=Path(gaze)
 gm=json.loads((candidate/"w28l-eye-manifest.json").read_text(encoding="utf8"))
 assert gm["status"]=="ART_HOLD_W28L_GAZE_TRIAL" and gm["source_sha256"]==m["glb_sha256"]
 assert gm["original_geometry_and_bone_animation_unchanged"] is True and gm["house_sha256"]==m["house_sha256"]
 assert gm["bones"]==53 and gm["morph_targets"]==8
 asset=candidate/"w28l-actor.glb"
 assert sha(asset)==gm["glb_sha256"] and asset.stat().st_size==gm["glb_bytes"]
if surface:
 prior_gaze=candidate
 candidate=Path(surface)
 nm=json.loads((candidate/"w28n-eye-manifest.json").read_text(encoding="utf8"))
 assert nm["status"]=="ART_HOLD_W28N_EYE_SURFACE" and nm["source_sha256"]==gm["glb_sha256"]
 assert nm["source_audit_sha256"]==sha(prior_gaze/"w28l-glb-audit.json")
 assert nm["geometry_and_motion_unchanged"] is True and nm["house_sha256"]==m["house_sha256"]
 asset=candidate/"w28n-actor.glb"
 assert sha(asset)==nm["glb_sha256"] and asset.stat().st_size==nm["glb_bytes"]
blink=os.environ.get("HOREB_W28O_OUTPUT")
if blink:
 assert surface and gaze
 candidate=Path(blink)
 bm=json.loads((candidate/"w28o-blink-manifest.json").read_text(encoding="utf8"))
 assert bm["status"]=="ART_HOLD_W28O_BLINK_TRIAL" and bm["source_sha256"]==nm["glb_sha256"]
 assert bm["bone_animation_unchanged"] is True and bm["house_sha256"]==m["house_sha256"]
 asset=candidate/"w28o-actor.glb"
 assert sha(asset)==bm["glb_sha256"] and asset.stat().st_size==bm["glb_bytes"]
close=os.environ.get("HOREB_VISUAL_FACE_CLOSE")=="1"
out=(candidate or root)/("visual-face-close" if close else "visual-review");assert not out.exists();out.mkdir()
bpy.ops.wm.open_mainfile(filepath=str(source),load_ui=False)
scene=bpy.context.scene;scene.render.fps=24;scene.render.fps_base=1
prior=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(asset))
imported=[o for o in bpy.data.objects if o not in prior]
rig=next(o for o in imported if o.type=="ARMATURE")
helpers={b.custom_shape for b in rig.pose.bones if b.custom_shape}
for o in imported:
 if o in helpers:o.hide_render=True
 elif o.parent not in imported:
  mat=o.matrix_world.copy();mat.translation+=Vector((-.58,-.30,.015));o.matrix_world=mat
ad=rig.animation_data;track=next(t for t in ad.nla_tracks if t.name=="Mother_GestureTowardsBasket")
ad.use_nla=False;ad.action=track.strips[0].action;ad.action_slot=track.strips[0].action_slot
if gaze:
 eyes=next(o for o in imported if o.type=="MESH" and o.data.shape_keys and len(o.data.shape_keys.key_blocks)==9)
 keys=eyes.data.shape_keys
 ka=keys.animation_data;kt=next(t for t in ka.nla_tracks if t.name=="Mother_GestureTowardsBasket")
 ka.use_nla=False;ka.action=kt.strips[0].action;ka.action_slot=kt.strips[0].action_slot
if blink:
 body=next(o for o in imported if o.type=="MESH" and o.data.shape_keys and "blink_left" in o.data.shape_keys.key_blocks)
 bk=body.data.shape_keys;ba=bk.animation_data;bt=next(t for t in ba.nla_tracks if t.name=="Mother_GestureTowardsBasket")
 ba.use_nla=False;ba.action=bt.strips[0].action;ba.action_slot=bt.strips[0].action_slot
scene.frame_set(60);bpy.context.view_layer.update()
if gaze:
 expected=next(a["peak_frame_60"] for a in gm["animations"] if a["name"]=="Mother_GestureTowardsBasket")
 actual=[k.value for k in list(keys.key_blocks)[1:]]
 assert len(actual)==8 and max(abs(x-y) for x,y in zip(actual,expected))<.0001
 print("W28L_MORPH_REIMPORT_PASS",actual,flush=True)
w=rig.matrix_world@rig.pose.bones["hand_l"].head
assert (w-Vector((-.1729625,-.2631747,1.2095803))).length<.002,tuple(w)
scene.render.engine="CYCLES";scene.cycles.device="CPU";scene.cycles.samples=16;scene.cycles.use_denoising=True
scene.render.resolution_percentage=100;scene.render.resolution_x=720;scene.render.resolution_y=540
scene.render.image_settings.file_format="PNG"
camera_data=bpy.data.cameras.new("W28g_review_camera");cam=bpy.data.objects.new("W28g_review_camera",camera_data);scene.collection.objects.link(cam);scene.camera=cam
views=[
 ("whole-peak",60,(-.25,-2.05,1.63),(-.14,-.13,.94),30),
 ("face-before",1,(-.85,-1.65,1.49),(-.44,-.32,1.30),62),
 ("face-peak",60,(-.85,-1.65,1.49),(-.44,-.32,1.30),62),
 ("hand-peak",60,(.18,-1.25,1.70),(-.12,-.25,1.19),64),
]
if gaze: views=[v for v in views if v[0] in ("face-before","face-peak")]
elif candidate: views=[v for v in views if v[0] in ("whole-peak","face-peak")]
if close:views=[("frontal-peak",60,None,None,82),("threequarter-peak",60,None,None,82)]
if blink:
 assert close
 views=[("blink-open-before",10,None,None,82),("blink-closed",12,None,None,82),("blink-open-after",16,None,None,82)]
for name,frame,eye,target,lens in views:
 scene.frame_set(frame);bpy.context.view_layer.update()
 if blink:
  expected_blink=1 if frame==12 else 0
  assert all(abs(bk.key_blocks[k].value-expected_blink)<.0001 for k in ("blink_left","blink_right"))
 if close:
  head=rig.pose.bones["head"]
  transform=rig.matrix_world@head.matrix@head.bone.matrix_local.inverted()
  focus=transform@Vector((0,-.102479,1.424))
  front=(transform.to_3x3()@Vector((0,-1,0))).normalized()
  up=(transform.to_3x3()@Vector((0,0,1))).normalized()
  side=(transform.to_3x3()@Vector((1,0,0))).normalized()
  direction=(front+(.40*side if name.startswith("threequarter") else Vector((0,0,0)))).normalized()
  eye=focus+direction*.66+up*.025;target=focus
 cam.location=eye;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat("-Z","Y").to_euler();cam.data.lens=lens
 scene.render.filepath=str(out/(name+".png"))
 bpy.ops.render.render(write_still=True)
 print("W28G_VISUAL",name,sha(out/(name+".png")),flush=True)
