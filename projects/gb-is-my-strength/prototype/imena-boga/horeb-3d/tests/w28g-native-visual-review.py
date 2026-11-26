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
candidate=os.environ.get("HOREB_W28K_OUTPUT")
if candidate:
 candidate=Path(candidate)
 cm=json.loads((candidate/"w28k-material-manifest.json").read_text(encoding="utf8"))
 assert cm["status"]=="ART_HOLD_W28K_MATERIAL_ONLY" and cm["source_sha256"]==m["glb_sha256"]
 assert cm["source_audit_sha256"]==sha(root/"w28g-glb-audit.json")
 assert cm["geometry_animation_binary_unchanged"] is True and cm["house_sha256"]==m["house_sha256"]
 asset=candidate/"w28k-actor.glb"
 assert sha(asset)==cm["glb_sha256"] and asset.stat().st_size==cm["glb_bytes"]
out=(candidate or root)/"visual-review";assert not out.exists();out.mkdir()
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
scene.frame_set(60);bpy.context.view_layer.update()
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
if candidate: views=[v for v in views if v[0] in ("whole-peak","face-peak")]
for name,frame,eye,target,lens in views:
 scene.frame_set(frame);bpy.context.view_layer.update()
 cam.location=eye;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat("-Z","Y").to_euler();cam.data.lens=lens
 scene.render.filepath=str(out/(name+".png"))
 bpy.ops.render.render(write_still=True)
 print("W28G_VISUAL",name,sha(out/(name+".png")),flush=True)
