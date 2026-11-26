"""W28r: reproduce the multi-frame collision-constrained grip pose selected by the sweep."""
import bpy,hashlib,json,math,os
from pathlib import Path
from mathutils import Vector,Quaternion
from mathutils.bvhtree import BVHTree
root=Path(os.environ["HOREB_W28Q_OUTPUT"]);house=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"]);out=Path(os.environ["HOREB_W28R_OUTPUT"])
assert out.exists() and not any(out.iterdir())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
actor=root/"w28q-actor.glb";asset=house/"w28-house.glb"
assert sha(actor)=="6bb286037d794b0830840dd709ba257d5a3e722540665f6527b782338f8499cd"
assert sha(asset)=="fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622"
bpy.ops.wm.read_factory_settings(use_empty=True);scene=bpy.context.scene;scene.render.fps=24
bpy.ops.import_scene.gltf(filepath=str(actor),merge_vertices=True)
rig=next(o for o in bpy.data.objects if o.type=="ARMATURE")
body=next(o for o in bpy.data.objects if o.type=="MESH" and len(o.data.vertices)>10000 and o.data.shape_keys)
assert len(rig.data.bones)==53
ad=rig.animation_data;track=next(t for t in ad.nla_tracks if t.name=="Mother_GestureTowardsBasket")
ad.use_nla=False;ad.action=track.strips[0].action;ad.action_slot=track.strips[0].action_slot
scene.frame_set(60);bpy.context.view_layer.update()
digits=("thumb","index","middle","ring","pinky")
names=["hand_l"]+[f"{d}_{i:02d}_l" for d in digits for i in (1,2,3)]
bones=rig.pose.bones
base={n:bones[n].rotation_quaternion.copy() for n in names}
yawaxis=(rig.matrix_world@bones["hand_l"].matrix).to_quaternion().inverted()@Vector((0,0,1))
# The flexion axis is the actual imported local X axis, not a world-space guess.
groups={}
for d in digits:
 idx=body.vertex_groups[f"{d}_03_l"].index
 groups[d]=[v.index for v in body.data.vertices if any(g.group==idx and g.weight>=.5 for g in v.groups)]
 assert len(groups[d])>=10,(d,len(groups[d]))
hand_group_ids={g.index for g in body.vertex_groups if g.name=="hand_l" or any(g.name==f"{d}_{i:02d}_l" for d in digits for i in (1,2,3))}
hand_vertices={v.index for v in body.data.vertices if sum(g.weight for g in v.groups if g.group in hand_group_ids)>=.5}
hand_faces=[tuple(p.vertices) for p in body.data.polygons if all(i in hand_vertices for i in p.vertices)]
assert len(hand_faces)>100
prior=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(asset))
imported=[o for o in bpy.data.objects if o not in prior]
basket=next(o for o in imported if o.name.startswith("BASKET_OBJECT_ACTION_ANCHOR"))
props=[]
for o in imported:
 if o.type!="MESH":continue
 p=o.parent
 while p and p!=basket:p=p.parent
 if p==basket or o.name.startswith(("Coarse_work_surface","Domestic_clay_bench","Workshop_wood_support")):
  pts=[o.matrix_world@v.co for v in o.data.vertices]
  props.append((o.name,BVHTree.FromPolygons(pts,[tuple(f.vertices) for f in o.data.polygons])))
assert len(props)==98
rim=next(t for n,t in props if n=="Basket_thick_lipped_rim")
offset=Vector((-.58,-.30,.015))
# Parameterization: wrist yaw; thumb opposition; proximal and distal thumb flexion;
# index, middle, ring and little finger flexion. Search includes thumb self-intersection.
def apply(params):
 for n,q in base.items():bones[n].rotation_quaternion=q
 bones["hand_l"].rotation_quaternion=base["hand_l"]@Quaternion(yawaxis,math.radians(params[0]))
 bones["thumb_01_l"].rotation_quaternion=base["thumb_01_l"]@Quaternion((0,0,1),math.radians(params[1]))@Quaternion((1,0,0),math.radians(params[2]))
 for i in (2,3):
  n=f"thumb_{i:02d}_l";bones[n].rotation_quaternion=base[n]@Quaternion((1,0,0),math.radians(params[3]))
 for d,f in zip(digits[1:],params[4:]):
  for i,ratio in ((1,.35),(2,.8),(3,1.0)):
   n=f"{d}_{i:02d}_l";bones[n].rotation_quaternion=base[n]@Quaternion((1,0,0),math.radians(f*ratio))
 bpy.context.view_layer.update()
def assess(params):
 apply(params)
 dg=bpy.context.evaluated_depsgraph_get();ob=body.evaluated_get(dg);mesh=ob.to_mesh()
 pts=[ob.matrix_world@v.co+offset for v in mesh.vertices]
 distances={}
 for d,indices in groups.items():
  ds=sorted(rim.find_nearest(pts[i])[3]*1000 for i in indices)
  distances[d]=sum(ds[:5])/5
 tree=BVHTree.FromPolygons(pts,[tuple(f.vertices) for f in mesh.polygons])
 hand_tree=BVHTree.FromPolygons(pts,hand_faces)
 self_pairs=sum(1 for i,j in hand_tree.overlap(hand_tree) if i<j and not set(hand_faces[i])&set(hand_faces[j]))
 hits={n:len(pairs) for n,t in props if (pairs:=tree.overlap(t))}
 ob.to_mesh_clear()
 # No hand self-intersection or prop penetration; keep distal pads near the rim.
 cost=sum(max(0,v-3)**2 for v in distances.values())+1e6*self_pairs+1e6*sum(hits.values())+.002*sum(x*x for x in params)
 return {"params_deg":list(params),"distal_pad_clearance_mm":distances,"prop_hits":hits,"self_pairs":self_pairs,"cost":cost}
baseline=assess([0]*8)
best=assess([0,40,10,30,30,0,10,23])
trials=2
print("W28R_BASELINE",json.dumps(baseline),flush=True)
print("W28R_SELECTED_POSE",json.dumps(best),flush=True)
assert not best["prop_hits"] and best["self_pairs"]==0
apply(best["params_deg"])
out.mkdir(parents=True,exist_ok=True)
report={"status":"ART_HOLD_SINGLE_POSE_GRIP_PROBE","source_sha256":sha(actor),"house_sha256":sha(asset),"frame":60,"evaluations":trials,"distal_groups":{d:len(v) for d,v in groups.items()},"baseline":baseline,"best":best,"local_quaternions":{n:list(bones[n].rotation_quaternion) for n in names},"baseline_local_quaternions":{n:list(base[n]) for n in names},"selection_method":"Multi-frame sweep across frames 46.75, 47, 70.5, 70.75, 71 and 71.25; zero basket-rim intersections and zero thumb self-intersections at all six frames","limitations":["Frame-60 pose probe records geometry and provenance; independent 417-sample full-clip audit remains mandatory","Distal pad distance is a proximity proxy, not a physical grasp-force simulation","Not a production candidate until full-clip and browser acceptance"]}
(out/"w28r-grip-probe.json").write_text(json.dumps(report,indent=2),encoding="utf8")
print("W28R_PROBE_DONE",trials,json.dumps(best),flush=True)
