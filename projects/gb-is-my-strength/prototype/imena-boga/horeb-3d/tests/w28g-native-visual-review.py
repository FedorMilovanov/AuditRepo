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
shoulder=os.environ.get("HOREB_W28Q_OUTPUT")
if shoulder:
 assert blink and surface and gaze
 candidate=Path(shoulder)
 qm=json.loads((candidate/"w28q-manifest.json").read_text(encoding="utf8"))
 assert qm["status"]=="ART_HOLD_W28Q_SHOULDER_TRIAL" and qm["source_sha256"]==bm["glb_sha256"]
 assert qm["facial_animation_unchanged"] is True and qm["bone_animation_unchanged"] is True
 assert qm["house_sha256"]==m["house_sha256"] and qm["params_mm"]==[24,16]
 asset=candidate/"w28q-actor.glb"
 assert sha(asset)==qm["glb_sha256"] and asset.stat().st_size==qm["glb_bytes"]
grip=os.environ.get("HOREB_W28R_OUTPUT")
if grip:
 assert shoulder
 candidate=Path(grip)
 rm=json.loads((candidate/"w28r-manifest.json").read_text(encoding="utf8"))
 assert rm["status"]=="ART_HOLD_W28R_GRIP_MOTION_TRIAL" and rm["source_sha256"]==qm["glb_sha256"]
 assert rm["facial_animation_unchanged"] is True and rm["geometry_unchanged"] is True and rm["non_target_bone_channels_unchanged"] is True
 assert rm["house_sha256"]==m["house_sha256"] and len(rm["changed_rotation_channels"])==12
 assert rm["probe_sha256"]==sha(candidate/"w28r-grip-probe.json")
 asset=candidate/"w28r-actor.glb"
 assert sha(asset)==rm["glb_sha256"]=="40b966d66bd72ef628e572bf2f356d6ff13f7752d021b60bdd6c217bb77b81dc" and asset.stat().st_size==rm["glb_bytes"]
linen=os.environ.get("HOREB_W28S_OUTPUT")
if linen:
 assert grip
 prior_grip=candidate
 candidate=Path(linen)
 lm=json.loads((candidate/"w28s-manifest.json").read_text(encoding="utf8"))
 assert lm["status"]=="ART_HOLD_W28S_LINEN_TRIAL" and lm["source_sha256"]==rm["glb_sha256"]
 assert lm["source_audit_sha256"]==sha(prior_grip/"w28r-glb-audit.json")
 assert lm["geometry_animation_unchanged"] is True and lm["source_samples"]==561
 assert lm["house_sha256"]==m["house_sha256"] and len(lm["material_changes"])==3
 asset=candidate/"w28s-actor.glb"
 assert sha(asset)==lm["glb_sha256"]=="52053a9553e195fd32d413b49509ab9360af2810148c570c73464c25f6b7943d" and asset.stat().st_size==lm["glb_bytes"]
brows=os.environ.get("HOREB_W28T_OUTPUT")
if brows:
 assert linen
 candidate=Path(brows)
 tm=json.loads((candidate/"w28t-manifest.json").read_text(encoding="utf8"))
 assert tm["status"]=="ART_HOLD_W28T_BROW_TRIAL" and tm["source_sha256"]==lm["glb_sha256"]
 assert tm["existing_actor_unchanged"] is True and tm["rest_skin_overlap_pairs"]==0
 assert tm["house_sha256"]==m["house_sha256"] and tm["conform_trials"][-1]["overlap_pairs"]==[0]*5
 asset=candidate/"w28t-actor.glb"
 assert sha(asset)==tm["glb_sha256"]=="689c81ae948f6ba0dca8f338b9a06dcd9f604bee525edea1499ff21c9dac6cb3" and asset.stat().st_size==tm["glb_bytes"]
skin=os.environ.get("HOREB_W29A_OUTPUT")
if skin:
 assert brows
 prior_brows=candidate
 candidate=Path(skin)
 sk=json.loads((candidate/"w29a-manifest.json").read_text(encoding="utf8"))
 assert sk["status"]=="ART_HOLD_W29A_SKIN_DETAIL_TRIAL" and sk["source_sha256"]==tm["glb_sha256"]
 assert sk["brow_audit_sha256"]==sha(prior_brows/"w28t-brow-audit.json")
 assert sk["geometry_animation_unchanged"] is True and sk["roughness_unchanged"] is True
 assert sk["house_sha256"]==m["house_sha256"] and sk["source_samples"]==561
 asset=candidate/"w29a-actor.glb"
 assert sha(asset)==sk["glb_sha256"]=="3cd8372200534849bbdb39ccc6d48dedddce21dac0305ef3963be53a016c5e69" and asset.stat().st_size==sk["glb_bytes"]
lashes=os.environ.get("HOREB_W29B_OUTPUT")
if lashes:
 assert skin
 candidate=Path(lashes)
 lm2=json.loads((candidate/"w29b-manifest.json").read_text(encoding="utf8"))
 assert lm2["status"]=="ART_HOLD_W29B_LASH_TRIAL" and lm2["source_sha256"]==sk["glb_sha256"]
 assert lm2["existing_actor_unchanged"] is True and lm2["strand_count"]==44 and all(t["overlap_pairs"]==[0]*4 for t in lm2["trials"])
 asset=candidate/"w29b-actor.glb"
 assert sha(asset)==lm2["glb_sha256"]=="8f11fc78285d4aece03b94554967f4deb3ad191b6a01055784f6a08e16a2c8d1" and asset.stat().st_size==lm2["glb_bytes"]
compact=os.environ.get("HOREB_W29C_OUTPUT")
if compact:
 assert lashes
 prior_lashes=candidate
 candidate=Path(compact)
 cm=json.loads((candidate/"w29c-manifest.json").read_text(encoding="utf8"))
 assert cm["status"]=="ART_HOLD_W29C_LOSSLESS_COMPACT_TRIAL" and cm["source_sha256"]==lm2["glb_sha256"]
 assert cm["source_lash_audit_sha256"]==sha(prior_lashes/"w29b-lash-audit.json")
 assert cm["all_other_json_identical_after_remap"] is True and cm["active_material_graphs_identical"]==9
 asset=candidate/"w29c-actor.glb"
 assert sha(asset)==cm["glb_sha256"]=="0d11d1b64a7b23b60fc1833d82bd938038f43c6369116ed9ac393b7cfa75ea94" and asset.stat().st_size==cm["glb_bytes"]
eye_lookdev=os.environ.get("HOREB_W29D_OUTPUT")
if eye_lookdev:
 assert compact
 prior_compact=candidate
 candidate=Path(eye_lookdev)
 dm=json.loads((candidate/"w29d-manifest.json").read_text(encoding="utf8"))
 assert dm["status"]=="ART_HOLD_W29D_EYE_LOOKDEV" and dm["source_sha256"]==cm["glb_sha256"]
 assert dm["source_pair_audit_sha256"]==sha(prior_compact/"w29c-glb-audit.json")
 assert dm["all_geometry_animation_unchanged"] is True and dm["source_samples"]==561 and dm["unchanged_views"]==310
 asset=candidate/"w29d-actor.glb"
 assert sha(asset)==dm["glb_sha256"]=="18cb0e76a90a272df9a080c0145f8d3465e3ab13e817c52f7deb291cfe655c44" and asset.stat().st_size==dm["glb_bytes"]
head_linen=os.environ.get("HOREB_W30A_OUTPUT")
head_compare=os.environ.get("HOREB_VISUAL_HEAD_LINEN_COMPARE")=="1"
if head_linen:
 assert eye_lookdev and head_compare
 candidate=Path(head_linen)
 hm=json.loads((candidate/"w30a-manifest.json").read_text(encoding="utf8"))
 assert hm["status"]=="ART_HOLD_W30A_HEAD_LINEN_TRIAL" and hm["source_sha256"]==dm["glb_sha256"]
 assert hm["only_head_linen_positions_normals_changed"] is True and hm["unchanged_views"]==307
 asset=candidate/"w30a-actor.glb"
 assert sha(asset)==hm["glb_sha256"]=="85c24882620b35154ac9e333c6d37406b457d4d3b05aa07fbc024812b5f0ac35"
drape=os.environ.get("HOREB_W30B_OUTPUT")
drape_compare=os.environ.get("HOREB_VISUAL_DRAPE_COMPARE")=="1"
if drape:
 assert head_linen and drape_compare
 candidate=Path(drape)
 bm2=json.loads((candidate/"w30b-manifest.json").read_text(encoding="utf8"))
 assert bm2["status"]=="ART_HOLD_W30B_DRAPE_TRIAL" and bm2["source_sha256"]==hm["glb_sha256"]
 assert bm2["only_drape_positions_normals_changed"] is True and bm2["unchanged_views"]==309
 assert bm2["probe_sha256"]==sha(candidate/"w30b-probe.json") and bm2["delta_sha256"]==sha(candidate/"w30b-drape-delta.json")
 asset=candidate/"w30b-actor.glb"
 assert sha(asset)==bm2["glb_sha256"]=="cff945d163c95bd7673e3a5405f55b45168b764eaa412fa7b8b81714f9da6668"
assert not drape_compare or (head_compare and head_linen)
assert not head_compare or eye_lookdev
close=os.environ.get("HOREB_VISUAL_FACE_CLOSE")=="1"
shoulder_compare=os.environ.get("HOREB_VISUAL_SHOULDER_COMPARE")=="1"
grip_compare=os.environ.get("HOREB_VISUAL_GRIP_COMPARE")=="1"
linen_compare=os.environ.get("HOREB_VISUAL_LINEN_COMPARE")=="1"
brow_compare=os.environ.get("HOREB_VISUAL_BROW_COMPARE")=="1"
assert sum((close,shoulder_compare,grip_compare,linen_compare,brow_compare))<=1
assert not shoulder or shoulder_compare or grip_compare or linen_compare or brow_compare
assert not grip or grip_compare or linen_compare or brow_compare
assert not linen or linen_compare or brow_compare
assert not brows or brow_compare
assert not skin or brow_compare
assert not lashes or brow_compare
assert not compact or brow_compare
assert not eye_lookdev or brow_compare
out=(candidate or root)/("visual-drape" if drape_compare else "visual-head-linen" if head_compare else "visual-brows" if brow_compare else "visual-linen" if linen_compare else "visual-grip" if grip_compare else "visual-shoulder" if shoulder_compare else "visual-face-close" if close else "visual-review");assert not out.exists();out.mkdir()
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
 body=next(o for o in imported if o.type=="MESH" and o.data.shape_keys and "blink_left" in o.data.shape_keys.key_blocks and len(o.data.vertices)>10000)
 bk=body.data.shape_keys;ba=bk.animation_data;bt=next(t for t in ba.nla_tracks if t.name=="Mother_GestureTowardsBasket")
 ba.use_nla=False;ba.action=bt.strips[0].action;ba.action_slot=bt.strips[0].action_slot
if brows:
 brow=next(o for o in imported if o.type=="MESH" and o.data.name.startswith("W28t_CC0_brows"))
 brk=brow.data.shape_keys;bra=brk.animation_data;brt=next(t for t in bra.nla_tracks if t.name=="Mother_GestureTowardsBasket")
 bra.use_nla=False;bra.action=brt.strips[0].action;bra.action_slot=brt.strips[0].action_slot
if lashes:
 lash=next(o for o in imported if o.type=="MESH" and o.data.name.startswith("W29b_CC0_lashes"))
 lk=lash.data.shape_keys;la=lk.animation_data;lt=next(t for t in la.nla_tracks if t.name=="Mother_GestureTowardsBasket")
 la.use_nla=False;la.action=lt.strips[0].action;la.action_slot=lt.strips[0].action_slot
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
if blink and not shoulder_compare and not grip_compare and not linen_compare and not brow_compare:
 assert close
 views=[("blink-open-before",10,None,None,82),("blink-closed",12,None,None,82),("blink-open-after",16,None,None,82)]
if shoulder_compare:
 assert blink
 views=[("whole-peak",60,(-.25,-2.05,1.63),(-.14,-.13,.94),30),("upper-peak",60,(-.85,-1.65,1.49),(-.44,-.32,1.23),49)]
if grip_compare:
 assert shoulder
 views=[("grip-peak",60,(-.36,-.82,1.58),(-.12,-.34,1.19),75)]
if linen_compare:
 assert grip
 views=[("whole-peak",60,(-.25,-2.05,1.63),(-.14,-.13,.94),30),("upper-peak",60,(-.85,-1.65,1.49),(-.44,-.32,1.23),49)]
if brow_compare:
 assert linen
 views=[("frontal-peak",60,None,None,82),("frontal-blink",12,None,None,82)]
if head_compare:
 assert brow_compare
 scene.cycles.samples=8;scene.render.resolution_x=480;scene.render.resolution_y=360
 views=[("frontal-peak",60,None,None,56),("threequarter-peak",60,None,None,56)]
if drape_compare:
 views=[("side-peak",60,None,None,56),("rear-peak",60,None,None,56)]
for name,frame,eye,target,lens in views:
 scene.frame_set(frame);bpy.context.view_layer.update()
 if blink:
  expected_blink=1 if frame==12 else 0
  assert all(abs(bk.key_blocks[k].value-expected_blink)<.0001 for k in ("blink_left","blink_right"))
 if brows:
  assert max(abs(brk.key_blocks[k].value-bk.key_blocks[k].value) for k in ("blink_left","blink_right"))<1e-6
 if lashes:
  assert max(abs(lk.key_blocks[k].value-bk.key_blocks[k].value) for k in ("blink_left","blink_right"))<1e-6
 if close or brow_compare:
  head=rig.pose.bones["head"]
  transform=rig.matrix_world@head.matrix@head.bone.matrix_local.inverted()
  focus=transform@Vector((0,-.102479,1.424))
  front=(transform.to_3x3()@Vector((0,-1,0))).normalized()
  up=(transform.to_3x3()@Vector((0,0,1))).normalized()
  side=(transform.to_3x3()@Vector((1,0,0))).normalized()
  direction=(front+((.85 if head_compare else .40)*side if name.startswith("threequarter") else Vector((0,0,0)))).normalized()
  eye=focus+direction*.66+up*.025;target=focus
  if drape_compare:
   focus=transform@Vector((0,.015,1.33))
   direction=(side-.7*front if name=="side-peak" else -front+.38*side).normalized()
   eye=focus+direction*.80+up*.04;target=focus
 cam.location=eye;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat("-Z","Y").to_euler();cam.data.lens=lens
 scene.render.filepath=str(out/(name+".png"))
 bpy.ops.render.render(write_still=True)
 print("W28G_VISUAL",name,sha(out/(name+".png")),flush=True)
