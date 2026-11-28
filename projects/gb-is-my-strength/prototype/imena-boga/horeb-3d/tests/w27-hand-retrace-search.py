"""W27e CPU pose search; never modify baseline assets or claim grip."""
import bpy, json, hashlib, os, math
from pathlib import Path
from mathutils import Vector, Euler
from mathutils.bvhtree import BVHTree
from itertools import product
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
src=Path(os.environ["HOREB_W24_OUTPUT"]);house=Path(os.environ["HOREB_W26C_INPUT"])
out=Path(os.environ["HOREB_HAND_RETRACE_OUTPUT"]);assert not out.exists();out.mkdir()
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
paths=[]
for params in [(-.025,.055,0,.14),(0,.055,15,.18),(0,.063,-15,.14)]:
 rows=[sample_at(f,*params) for f in range(1,49)]
 bad=[r["frame"] for r in rows if r["rim_pairs"] or r["body_pairs"]]
 result={"params":params,"approach_rows":rows,"bad":bad}
 paths.append(result)
 print("W27F_RETRACE_APPROACH",json.dumps({"params":params,"samples":len(rows),"colliding_frames":bad}),flush=True)
 if not bad:
  dense=[sample_at(f/2,*params) for f in range(2,211)]
  result["dense_rows"]=dense
  result["dense_bad"]=[r["frame"] for r in dense if r["rim_pairs"] or r["body_pairs"]]
  print("W27F_RETRACE_DENSE",json.dumps({"params":params,"samples":len(dense),"colliding_frames":result["dense_bad"]}),flush=True)
  if not result["dense_bad"]:break
(out/"retrace-search.json").write_text(json.dumps({"status":"SAMPLED_RETRACE_NOT_BAKED_NOT_GRIP","source_sha256":sha(blend),"house_sha256":sha(glb),"paths":paths},indent=2),encoding="utf8")
