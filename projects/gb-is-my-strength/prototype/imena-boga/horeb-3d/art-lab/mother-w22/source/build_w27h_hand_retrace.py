"""W27e CPU pose search; never modify baseline assets or claim grip."""
import bpy, json, hashlib, os, math
from pathlib import Path
from mathutils import Vector, Euler
from mathutils.bvhtree import BVHTree
from itertools import product
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
src=Path(os.environ["HOREB_W24_OUTPUT"]);house=Path(os.environ["HOREB_W26C_INPUT"])
out=Path(os.environ["HOREB_HAND_BAKE_OUTPUT"]);assert not out.exists();out.mkdir()
m=json.loads((src/"w24-export-manifest.json").read_text(encoding="utf8"));h=json.loads((house/"w26-study-manifest.json").read_text(encoding="utf8"))
blend=src/"w24-wardrobe-study.blend";glb=house/h["glb_file"]
assert sha(blend)==m["blend_sha256"]=="99a898c365f6955c1a7a242463037eab198aa2e4d16827a4d6fa905c7b046ffe" and m["glb_sha256"]=="f3d9a470cb2371f600cc8b6c58547fd63aebd8c1d025e80ff327926ef2870cbb"
assert sha(glb)==h["glb_sha256"]=="34c1cdc2f005d41f23d0f8c631997ae8029f5536e16066139c422bce5caa234e"
bpy.ops.wm.open_mainfile(filepath=str(blend),load_ui=False)
scene=bpy.context.scene;rig=bpy.data.objects["MOTHER_PERFORMER__53_BONE_RIG"];body=bpy.data.objects["ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0"]
prior=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(glb))
imported=[o for o in bpy.data.objects if o not in prior]
rim=next(o for o in imported if o.name.startswith("Basket_thick_lipped_rim"))
def tree_for(o):
 return BVHTree.FromPolygons([o.matrix_world@v.co for v in o.data.vertices],[tuple(p.vertices) for p in o.data.polygons])
rt=tree_for(rim)
# Include actual basket geometry, not just rim. Separate BVHs keep counts meaningful.
basket=next(o for o in imported if o.name.startswith("BASKET_OBJECT_ACTION_ANCHOR"))
props=[]
for o in imported:
 if o.type!="MESH" or o==rim:continue
 p=o.parent
 while p and p!=basket:p=p.parent
 if p==basket:props.append((o.name,tree_for(o)))
assert props,"Missing basket body"
for tr in rig.animation_data.nla_tracks:tr.mute=tr.name!="Mother_GestureTowardsBasket"
scene.frame_set(60);bpy.context.view_layer.update()
fore=rig.pose.bones["lowerarm_l"];hand=rig.pose.bones["hand_l"]
base_tip=rig.matrix_world@fore.tail
base_rot=hand.rotation_quaternion.copy() if hand.rotation_mode=="QUATERNION" else hand.rotation_euler.to_quaternion()
offset=Vector((-.5,-.30,.015))
groups={g.index:g.name for g in body.vertex_groups}
digits=["thumb","index","middle","ring","pinky"]
prefix=["hand_l"]+[f"{d}_0{i}_l" for d in digits for i in [1,2,3]]
def topology():
 obj=body.evaluated_get(bpy.context.evaluated_depsgraph_get());me=obj.to_mesh()
 tags={}
 for v in me.vertices:
  w={groups.get(g.group,""):g.weight for g in v.groups}
  if sum(w.get(n,0) for n in prefix)<.45:continue
  tags[v.index]=max(["palm"]+digits,key=lambda n:w.get("hand_l",0) if n=="palm" else sum(w.get(f"{n}_0{i}_l",0) for i in [1,2,3]))
 ids=list(tags);index={v:i for i,v in enumerate(ids)}
 faces=[tuple(index[i] for i in p.vertices) for p in me.polygons if all(i in index for i in p.vertices)]
 count=len(me.vertices);obj.to_mesh_clear()
 return ids,faces,[tags[i] for i in ids],count
ids,faces,tags,vertex_count=topology()
def geometry():
 obj=body.evaluated_get(bpy.context.evaluated_depsgraph_get());me=obj.to_mesh()
 assert len(me.vertices)==vertex_count
 vs=[obj.matrix_world@me.vertices[i].co+offset for i in ids]
 obj.to_mesh_clear();return vs,faces,tags
def assess():
 vs,faces,tags=geometry();tree=BVHTree.FromPolygons(vs,faces)
 overlap=len(tree.overlap(rt))
 other=sum(len(tree.overlap(t)) for _,t in props)
 ds={d:[] for d in ["palm"]+digits}
 for v,tag in zip(vs,tags):
  hit,n,_,dist=rt.find_nearest(v)
  if dist is not None:ds[tag].append(dist*1000)
 return dict(rim_pairs=overlap,body_pairs=other,nearest={k:round(min(v),3) for k,v in ds.items() if v})
baseline=assess();print("W27E_BASELINE",json.dumps(baseline),flush=True)
target=bpy.data.objects.new("W27e_pose_search_target",None);scene.collection.objects.link(target)
target.location=base_tip
ik=fore.constraints.new("IK");ik.target=target;ik.chain_count=2;ik.use_stretch=False
hand.rotation_mode="QUATERNION"
def trial(dx,dy,dz,rx,ry,rz):
 target.location=base_tip+Vector((dx,dy,dz))
 hand.rotation_quaternion=base_rot@Euler(tuple(math.radians(a) for a in (rx,ry,rz))).to_quaternion()
 bpy.context.view_layer.update()
 r=assess();r["offset_mm"]=[round(a*1000,2) for a in (dx,dy,dz)];r["wrist_deg"]=[rx,ry,rz]
 return r



def ease(u):
 u=max(0,min(1,u));return u*u*(3-2*u)
neutral=base_rot.copy()
def sample_at(t,dx,dz,angle,height):
 global base_tip,base_rot
 # Authored approach, stationary peak, then exact reversed approach.
 f=t if t<=48 else 48 if t<=70 else 48-(t-70)*47/35
 ik.influence=0
 scene.frame_set(int(f),subframe=f-int(f));bpy.context.view_layer.update()
 base_tip=rig.matrix_world@fore.tail;base_rot=neutral.copy()
 hand.rotation_quaternion=base_rot
 w=ease((f-1)/19)
 lift=height*ease((f-1)/13) if f<14 else height if f<=42 else height*(1-ease((f-42)/6))
 ik.influence=1 if w>0 else 0
 r=trial(dx*w,0,dz*w+lift,0,angle*w,0)
 r["frame"]=t;r["source_frame"]=round(f,5)
 return r

witness=Path(os.environ["HOREB_HAND_RETRACE_INPUT"])/"retrace-search.json"
record=json.loads(witness.read_text(encoding="utf8"))
assert record["source_sha256"]==sha(blend) and record["house_sha256"]==sha(glb)
path=record["paths"][0];params=path["params"]
assert params==[-.025,.055,0,.14]
frames=[j/2 for j in range(2,211)]
assert [r["frame"] for r in path["dense_rows"]]==frames
assert all(type(r[k]) is int and r[k]==0 for r in path["dense_rows"] for k in ["rim_pairs","body_pairs"])
assert not path["bad"] and not path["dense_bad"]
# Only the four originally animated channels are baked. Preserve idle rig modes.
names=["upperarm_l","lowerarm_l","head","spine_03"]
modes={n:rig.pose.bones[n].rotation_mode for n in names}
samples=[];tips=[]
for t in frames:
 r=sample_at(t,*params)
 assert r["rim_pairs"]==r["body_pairs"]==0,(t,r)
 pose={}
 for n in names:
  b=rig.pose.bones[n]
  local=rig.convert_space(pose_bone=b,matrix=b.matrix.copy(),from_space="POSE",to_space="LOCAL")
  pose[n]=local.to_quaternion().normalized()
 samples.append(pose);tips.append((rig.matrix_world@fore.tail).copy())
print("W27H_CAPTURED",len(samples),flush=True)
fore.constraints.remove(ik);bpy.data.objects.remove(target,do_unlink=True)
tracks=rig.animation_data.nla_tracks;old=tracks.get("Mother_GestureTowardsBasket")
assert old and tracks.get("Mother_QuietIdle")
prior_action=old.strips[0].action;tracks.remove(old);prior_action.name="W24_reference_gesture_not_exported"
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
for t,tip in zip(frames,tips):
 scene.frame_set(int(t),subframe=t-int(t));bpy.context.view_layer.update()
 r=assess();r["frame"]=t;r["wrist_deviation_mm"]=round(((rig.matrix_world@fore.tail)-tip).length*1000,5);rows.append(r)
bad=[r["frame"] for r in rows if r["rim_pairs"] or r["body_pairs"]]
worst=max(r["wrist_deviation_mm"] for r in rows)
audit={"status":"BAKED_HAND_SAMPLED_CLEARANCE_NOT_GRIP","source_sha256":sha(blend),"house_sha256":sha(glb),"witness_sha256":sha(witness),"rows":rows,"colliding_frames":bad,"max_wrist_deviation_mm":worst}
(out/"baked-audit.json").write_text(json.dumps(audit,indent=2),encoding="utf8")
print("W27H_BAKED_AUDIT",json.dumps({"samples":len(rows),"colliding_frames":bad,"max_wrist_deviation_mm":worst}),flush=True)
assert not bad and worst<.1,"Baked motion failed; no candidate saved"
# Quarter-frame checks after IK removal, before accepting even the local candidate.
extra=[]
for j in range(4,421):
 t=j/4;scene.frame_set(int(t),subframe=t-int(t));bpy.context.view_layer.update()
 r=assess();r["frame"]=t;extra.append(r)
bad4=[r["frame"] for r in extra if r["rim_pairs"] or r["body_pairs"]]
(out/"quarter-frame-audit.json").write_text(json.dumps({"rows":extra,"colliding_frames":bad4},indent=2),encoding="utf8")
print("W27H_QUARTER_FRAME",json.dumps({"samples":len(extra),"colliding_frames":bad4}),flush=True)
assert not bad4,"Quarter-frame collision; no candidate saved"
for o in imported:
 if o.name in bpy.data.objects:bpy.data.objects.remove(o,do_unlink=True)
for tr in tracks:tr.mute=False
scene.frame_set(1);bpy.context.view_layer.update()
bpy.ops.file.pack_all();bpy.context.preferences.filepaths.save_version=0
candidate=out/"w27h-hand-retrace.blend";bpy.ops.wm.save_as_mainfile(filepath=str(candidate),check_existing=False)
assert len(rig.data.bones)==53
bpy.ops.object.select_all(action="DESELECT");body.select_set(True);bpy.context.view_layer.objects.active=body
if body.data.shape_keys is not None:bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
masks=[m for m in body.modifiers if m.type=="MASK"];assert len(masks)==1
while body.modifiers.find(masks[0].name)>0:bpy.ops.object.modifier_move_up(modifier=masks[0].name)
bpy.ops.object.modifier_apply(modifier=masks[0].name)
bpy.ops.object.select_all(action="DESELECT");rig.select_set(True);body.select_set(True)
for obj in bpy.data.objects:
 if obj.type=="MESH" and obj.parent==rig:obj.select_set(True)
bpy.context.view_layer.objects.active=rig
asset=out/"w27h-hand-retrace.glb"
bpy.ops.export_scene.gltf(filepath=str(asset),export_format="GLB",use_selection=True,export_yup=True,export_animations=True,export_animation_mode="NLA_TRACKS",export_materials="EXPORT",export_apply=False,export_frame_step=1)
manifest={"status":"ART_HOLD_W27H_HAND_RETRACE","source_sha256":sha(blend),"house_sha256":sha(glb),"blend_sha256":sha(candidate),"glb_sha256":sha(asset),"glb_bytes":asset.stat().st_size,"audit_sha256":sha(out/"baked-audit.json"),"quarter_audit_sha256":sha(out/"quarter-frame-audit.json"),"sample_count":len(rows),"quarter_sample_count":len(extra),"colliding_frames":bad,"max_wrist_deviation_mm":worst}
(out/"w27h-manifest.json").write_text(json.dumps(manifest,indent=2),encoding="utf8")
print("W27H_EXPORTED",json.dumps(manifest),flush=True)
