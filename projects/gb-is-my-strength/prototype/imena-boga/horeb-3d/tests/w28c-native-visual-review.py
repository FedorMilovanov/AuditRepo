"""Native W28c visual review of exact exported actor in authored house."""
import bpy,os,json,hashlib,math
from pathlib import Path
from mathutils import Vector
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
root=Path(os.environ["HOREB_W28C_OUTPUT"]);house=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"])
m=json.loads((root/"w28c-manifest.json").read_text(encoding="utf8"));h=json.loads((house/"w28-house-manifest.json").read_text(encoding="utf8"))
asset=root/"w28c-fitted-actor.glb";source=house/"w28-house.blend"
assert sha(asset)==m["glb_sha256"]=="23681ee1effa2e27cdf05c575bb99124042634e9ed335f7b24abf0ead93b6fb5"
assert sha(source)==h["blend_sha256"]=="2318fe98b8a4334682867551039018461ff062c92dc0f91900e020a84514d737"
audit=json.loads((root/"w28c-glb-audit.json").read_text(encoding="utf8"))
assert audit["actor_sha256"]==sha(asset) and all(not c["bad"] for c in audit["clips"])
out=root/"visual-review";assert not out.exists();out.mkdir()
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
camera_data=bpy.data.cameras.new("W28c_review_camera");cam=bpy.data.objects.new("W28c_review_camera",camera_data);scene.collection.objects.link(cam);scene.camera=cam
for name,eye,target,lens in [
 ("whole",(-.25,-2.05,1.63),(-.14,-.13,.94),30),
 ("shoulders",(-.85,-1.65,1.49),(-.44,-.32,1.19),44)]:
 cam.location=eye;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat("-Z","Y").to_euler();cam.data.lens=lens
 scene.render.filepath=str(out/(name+".png"))
 bpy.ops.render.render(write_still=True)
 print("W28C_VISUAL",name,sha(out/(name+".png")),flush=True)
