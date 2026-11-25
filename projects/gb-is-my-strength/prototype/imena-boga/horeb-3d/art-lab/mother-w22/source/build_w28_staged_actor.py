"""W28 native staging/IK retarget search; no asset changes."""
import bpy,os,json,hashlib,math
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
root=Path(os.environ["HOREB_HAND_BAKE_OUTPUT"]);house=Path(os.environ["HOREB_W26C_INPUT"])
asset=root/"w27h-hand-retrace.blend";glb=house/"w26c-house-study.glb"
assert sha(asset)=="89ee48385a14dca631bc4bcb84a135f8e094b328aa9243700fc1eb0c249bba8b"
assert sha(glb)=="34c1cdc2f005d41f23d0f8c631997ae8029f5536e16066139c422bce5caa234e"
bpy.ops.wm.open_mainfile(filepath=str(asset),load_ui=False)
scene=bpy.context.scene;rig=bpy.data.objects["MOTHER_PERFORMER__53_BONE_RIG"]
body=bpy.data.objects["ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0"]
meshes=[o for o in bpy.data.objects if o.type=="MESH" and (o==body or o.parent==rig)]
assert len(meshes)==9,[o.name for o in meshes]
prior=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(glb))
imported=[o for o in bpy.data.objects if o not in prior]
basket=next(o for o in imported if o.name.startswith("BASKET_OBJECT_ACTION_ANCHOR"))
# Proposed smaller table: keep its right edge and top height, move the
# left edge to x=-0.005 (40 mm support margin under the basket base).
# Shift its two left legs to x=.14. The basket itself is unchanged.
props=[]
for o in imported:
 if o.type!="MESH":continue
 p=o.parent
 while p and p!=basket:p=p.parent
 if p!=basket and not o.name.startswith(("Coarse_work_surface","Domestic_clay_bench","Workshop_wood_support")):continue
 vs=[o.matrix_world@v.co for v in o.data.vertices]
 if o.name.startswith("Coarse_work_surface"):
  for v in vs:v.x=-.005+(v.x+.475)*(1.195+.005)/1.67
 if o.name.startswith("Workshop_wood_support") and max(v.x for v in vs)<0:
  for v in vs:v.x+=.39
 props.append((o.name,BVHTree.FromPolygons(vs,[tuple(p.vertices) for p in o.data.polygons])))
assert len(props)==98,len(props)
for t in rig.animation_data.nla_tracks:t.mute=t.name!="Mother_GestureTowardsBasket"
fore=rig.pose.bones["lowerarm_l"];hand=rig.pose.bones["hand_l"]
offset=Vector((-.5,-.30,.015));base=rig.matrix_world.copy()
target=bpy.data.objects.new("W28_staging_target",None);scene.collection.objects.link(target)
ik=fore.constraints.new("IK");ik.target=target;ik.chain_count=2;ik.use_stretch=False;ik.influence=0
def assess():
 hits=[];dg=bpy.context.evaluated_depsgraph_get()
 for o in meshes:
  obj=o.evaluated_get(dg);me=obj.to_mesh()
  if not me.polygons:obj.to_mesh_clear();continue
  tree=BVHTree.FromPolygons([obj.matrix_world@v.co+offset for v in me.vertices],[tuple(p.vertices) for p in me.polygons]);obj.to_mesh_clear()
  for n,t in props:
   c=len(tree.overlap(t))
   if c:hits.append({"mesh":o.name,"prop":n,"pairs":c})
 return hits
neutral=hand.rotation_quaternion.copy() if hand.rotation_mode=="QUATERNION" else hand.rotation_euler.copy()
def trial(f,dx,dy):
 ik.influence=0;rig.matrix_world=base
 if hand.rotation_mode=="QUATERNION":hand.rotation_quaternion=neutral
 else:hand.rotation_euler=neutral
 scene.frame_set(math.floor(f),subframe=f-math.floor(f));bpy.context.view_layer.update()
 tip=(rig.matrix_world@fore.tail).copy();orientation=(rig.matrix_world@hand.matrix).to_quaternion()
 # Only retarget during the extended approach; allow the resting hand to
 # follow the displaced torso. A smooth weight preserves the rest pose.
 u=max(0,min(1,(f-1)/19,(105-f)/19));w=u*u*(3-2*u)
 moved=base.copy();delta=Vector((dx,dy,0));moved.translation+=delta;rig.matrix_world=moved
 target.location=tip+delta*(1-w);ik.influence=1 if w>0 and delta.length>0 else 0
 bpy.context.view_layer.update()
 if w>0 and delta.length>0:
  mat=hand.matrix.copy();mat=orientation.to_matrix().to_4x4();mat=rig.matrix_world.inverted()@mat
  mat.translation=hand.matrix.translation
  q=rig.convert_space(pose_bone=hand,matrix=mat,from_space="POSE",to_space="LOCAL").to_quaternion()
  if hand.rotation_mode=="QUATERNION":hand.rotation_quaternion=q
  else:hand.rotation_euler=q.to_euler(hand.rotation_mode)
  bpy.context.view_layer.update()
 error=((rig.matrix_world@fore.tail)-target.location).length*1000 if w>0 else 0
 return {"frame":f,"retarget_error_mm":round(error,3),"hits":assess()}


out=Path(os.environ["HOREB_W28_ACTOR_OUTPUT"]);assert not out.exists();out.mkdir(parents=True)
witness=root/"w28-compact-table-dense.json";record=json.loads(witness.read_text(encoding="utf8"))
assert record["actor_sha256"]==sha(asset) and record["house_sha256"]==sha(glb)
p=record["paths"][0];assert p["delta"]==[-.08,0,0] and not p["bad"] and not p["quarter_bad"]
assert [r["frame"] for r in p["quarter_rows"]]==[j/4 for j in range(4,421)]
assert all(not r["hits"] for r in p["quarter_rows"])
names=["upperarm_l","lowerarm_l","head","spine_03","hand_l"]
modes={n:rig.pose.bones[n].rotation_mode for n in names}
frames=[j/2 for j in range(2,211)]
samples=[];tips=[]
for t in frames:
 r=trial(t,-.08,0)
 assert not r["hits"],(t,r)
 pose={}
 for n in names:
  b=rig.pose.bones[n]
  local=rig.convert_space(pose_bone=b,matrix=b.matrix.copy(),from_space="POSE",to_space="LOCAL")
  pose[n]=local.to_quaternion().normalized()
 samples.append(pose);tips.append((rig.matrix_world@fore.tail).copy())
print("W28_CAPTURED",len(samples),flush=True)
fore.constraints.remove(ik);bpy.data.objects.remove(target,do_unlink=True)
rig.matrix_world=base
# Placement is external to the actor asset. Its runtime offset will be -.58,-.30,.015.
offset.x-=.08
tracks=rig.animation_data.nla_tracks;old=tracks.get("Mother_GestureTowardsBasket")
assert old and tracks.get("Mother_QuietIdle")
prior_action=old.strips[0].action;tracks.remove(old);prior_action.name="W27h_reference_gesture_not_exported"
for tr in tracks:tr.mute=True
action=bpy.data.actions.new("Mother_GestureTowardsBasket");rig.animation_data.action=action
previous={}
for t,pose in zip(frames,samples):
 for n,q in pose.items():
  b=rig.pose.bones[n];b.rotation_mode=modes[n]
  if modes[n]=="QUATERNION":
   if n in previous and q.dot(previous[n])<0:q.negate()
   b.rotation_quaternion=q;previous[n]=q.copy();prop="rotation_quaternion"
  else:
   e=q.to_euler(modes[n],previous[n]) if n in previous else q.to_euler(modes[n])
   b.rotation_euler=e;previous[n]=e.copy();prop="rotation_euler"
  b.keyframe_insert(data_path=prop,frame=t,group=n)
for layer in action.layers:
 for strip in layer.strips:
  for slot in action.slots:
   bag=strip.channelbag(slot)
   if bag:
    for curve in bag.fcurves:
     for key in curve.keyframe_points:key.interpolation="LINEAR"
rig.animation_data.action=None
track=tracks.new();track.name="Mother_GestureTowardsBasket"
strip=track.strips.new("Mother_GestureTowardsBasket",1,action);strip.action_frame_start=1;strip.action_frame_end=105
for tr in tracks:tr.mute=tr!=track
rows=[]
for j in range(4,421):
 t=j/4;scene.frame_set(math.floor(t),subframe=t-math.floor(t));bpy.context.view_layer.update()
 r={"frame":t,"hits":assess()}
 if j%2==0:
  actual=(rig.matrix_world@fore.tail)+Vector((-.08,0,0))
  r["wrist_deviation_mm"]=round((actual-tips[j//2-2]).length*1000,5)
 rows.append(r)
bad=[r["frame"] for r in rows if r["hits"]]
worst=max(r.get("wrist_deviation_mm",0) for r in rows)
(out/"w28-baked-full-audit.json").write_text(json.dumps({"rows":rows,"bad":bad,"max_wrist_deviation_mm":worst},indent=2),encoding="utf8")
print("W28_BAKED_FULL",json.dumps({"samples":len(rows),"bad":bad,"worst_mm":worst}),flush=True)
assert not bad and worst<.1
for o in imported:
 if o.name in bpy.data.objects:bpy.data.objects.remove(o,do_unlink=True)
for tr in tracks:tr.mute=False
scene.frame_set(1);bpy.context.view_layer.update()
bpy.ops.file.pack_all();bpy.context.preferences.filepaths.save_version=0
candidate=out/"w28-actor.blend";bpy.ops.wm.save_as_mainfile(filepath=str(candidate),check_existing=False)
bpy.ops.object.select_all(action="DESELECT");body.select_set(True);bpy.context.view_layer.objects.active=body
if body.data.shape_keys is not None:bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
masks=[m for m in body.modifiers if m.type=="MASK"];assert len(masks)==1
while body.modifiers.find(masks[0].name)>0:bpy.ops.object.modifier_move_up(modifier=masks[0].name)
bpy.ops.object.modifier_apply(modifier=masks[0].name)
bpy.ops.object.select_all(action="DESELECT");rig.select_set(True);body.select_set(True)
for obj in bpy.data.objects:
 if obj.type=="MESH" and obj.parent==rig:obj.select_set(True)
bpy.context.view_layer.objects.active=rig
export=out/"w28-actor.glb"
bpy.ops.export_scene.gltf(filepath=str(export),export_format="GLB",use_selection=True,export_yup=True,export_animations=True,export_animation_mode="NLA_TRACKS",export_materials="EXPORT",export_apply=False,export_frame_step=1)
manifest={"status":"ART_HOLD_W28_STAGED_ACTOR","source_sha256":sha(asset),"house_source_sha256":sha(glb),"glb_sha256":sha(export),"glb_bytes":export.stat().st_size,"blend_sha256":sha(candidate),"audit_sha256":sha(out/"w28-baked-full-audit.json"),"sample_count":417,"placement_three":[-.58,.015,.30],"table_left_x":-.005,"left_leg_delta_x":.39}
(out/"w28-actor-manifest.json").write_text(json.dumps(manifest,indent=2),encoding="utf8")
print("W28_ACTOR_EXPORTED",json.dumps(manifest),flush=True)
