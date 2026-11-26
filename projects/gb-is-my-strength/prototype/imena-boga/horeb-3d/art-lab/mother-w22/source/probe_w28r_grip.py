"""W28r: constrained single-pose grip feasibility probe, not approved animation."""
import bpy,hashlib,json,math,os
from pathlib import Path
from mathutils import Vector,Quaternion
from mathutils.bvhtree import BVHTree
root=Path(os.environ["HOREB_W28Q_OUTPUT"]);house=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"]);out=Path(os.environ["HOREB_W28R_OUTPUT"])
assert not out.exists()
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
# Parameterization: wrist yaw; thumb basal opposition and flexion; four digit flexions.
# A single pose cannot establish collision safety over a clip.
def apply(params):
 for n,q in base.items():bones[n].rotation_quaternion=q
 bones["hand_l"].rotation_quaternion=base["hand_l"]@Quaternion(yawaxis,math.radians(params[0]))
 bones["thumb_01_l"].rotation_quaternion=base["thumb_01_l"]@Quaternion((0,0,1),math.radians(params[1]))@Quaternion((1,0,0),math.radians(params[2]))
 for i in (2,3):
  n=f"thumb_{i:02d}_l";bones[n].rotation_quaternion=base[n]@Quaternion((1,0,0),math.radians(params[2]*.7))
 for d,f in zip(digits[1:],params[3:]):
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
 hits={n:len(pairs) for n,t in props if (pairs:=tree.overlap(t))}
 ob.to_mesh_clear()
 # Aim for 2-5 mm clearance at multiple distal pads; reject any penetration.
 cost=sum(max(0,v-3)**2 for v in distances.values())+10000*sum(hits.values())+.005*sum(x*x for x in params)
 return {"params_deg":list(params),"distal_pad_clearance_mm":distances,"prop_hits":hits,"cost":cost}
baseline=assess([0]*7);best=baseline;trials=1
print("W28R_BASELINE",json.dumps(baseline),flush=True)
# Coarse wrist orientation search, followed by bounded coordinate descent.
for yaw in (-60,-45,-30,-15,15,30,45,60):
 candidate=assess([yaw,0,0,0,0,0,0]);trials+=1
 if candidate["cost"]<best["cost"]:best=candidate
bounds=[(-60,60),(-35,35),(-20,45)]+[(-20,45)]*4
for step in (20,10,5):
 for i,(lo,hi) in enumerate(bounds):
  start=best["params_deg"][:]
  for direction in (-1,1):
   p=start[:];p[i]=max(lo,min(hi,p[i]+direction*step))
   if p[i]==start[i]:continue
   candidate=assess(p);trials+=1
   if candidate["cost"]<best["cost"]:best=candidate
 print("W28R_STEP",step,json.dumps(best),flush=True)
assert not best["prop_hits"]
apply(best["params_deg"])
out.mkdir(parents=True)
report={"status":"ART_HOLD_SINGLE_POSE_GRIP_PROBE","source_sha256":sha(actor),"house_sha256":sha(asset),"frame":60,"evaluations":trials,"distal_groups":{d:len(v) for d,v in groups.items()},"baseline":baseline,"best":best,"local_quaternions":{n:list(bones[n].rotation_quaternion) for n in names},"baseline_local_quaternions":{n:list(base[n]) for n in names},"limitations":["Only body versus 98 props, at frame 60","No finger self-collision or opposing-side contact proof","Not a complete animation or production candidate"]}
(out/"w28r-grip-probe.json").write_text(json.dumps(report,indent=2),encoding="utf8")
print("W28R_PROBE_DONE",trials,json.dumps(best),flush=True)
