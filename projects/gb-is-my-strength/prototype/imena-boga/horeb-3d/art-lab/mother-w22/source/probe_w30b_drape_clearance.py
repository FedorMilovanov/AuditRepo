"""W30b: compare local drape tailoring against the actual animated tunic.
Diagnostic uses exact W30a export; no canonical changes.
"""
import bpy,hashlib,json,math,os
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
root=Path(os.environ["HOREB_W30A_OUTPUT"]);out=Path(os.environ["HOREB_W30B_OUTPUT"])
asset=root/"w30a-actor.glb"
assert hashlib.sha256(asset.read_bytes()).hexdigest()=="85c24882620b35154ac9e333c6d37406b457d4d3b05aa07fbc024812b5f0ac35"
bpy.ops.wm.read_factory_settings(use_empty=True);s=bpy.context.scene;s.render.fps=24
bpy.ops.import_scene.gltf(filepath=str(asset),merge_vertices=True)
rig=next(o for o in bpy.data.objects if o.type=="ARMATURE")
meshes=[o for o in bpy.data.objects if o.type=="MESH" and o.parent==rig];assert len(meshes)==9
drape=next(o for o in meshes if o.data.name.startswith("W22_linen_rear_drape_geo"))
tunic=next(o for o in meshes if o.name=="W28e_tailored_linen")
orig=[v.co.copy() for v in drape.data.vertices];faces=[tuple(p.vertices) for p in drape.data.polygons]
assert len(orig)==325 and len(faces)==576
print("W30B_REST_BOUNDS",[[min(v[k] for v in orig) for k in range(3)],[max(v[k] for v in orig) for k in range(3)]],flush=True)
assert min(v.z for v in orig)>1.16 and max(v.z for v in orig)<1.43 and min(v.y for v in orig)>.05
def activate(o,name):
 ad=o.animation_data;t=next(t for t in ad.nla_tracks if t.name==name);st=t.strips[0]
 ad.use_nla=False;ad.action=st.action;ad.action_slot=st.action_slot
def tree(o,dg):
 ob=o.evaluated_get(dg);me=ob.to_mesh();fs=[tuple(p.vertices) for p in me.polygons]
 t=BVHTree.FromPolygons([ob.matrix_world@v.co for v in me.vertices],fs);ob.to_mesh_clear();return t
def smooth(x):
 x=max(0.,min(1.,x));return x*x*(3-2*x)
grid=[("Mother_GestureTowardsBasket",f) for f in (1,12,12.75,21,31,41,47,60,71,82.75,91,105)]+[("Mother_QuietIdle",f) for f in (1,34,48,96,110,144)]
# Cache the posed collision partners. Only the drape is edited between candidates.
cache=[]
for name,f in grid:
 activate(rig,name)
 for o in meshes:
  if o.data.shape_keys:activate(o.data.shape_keys,name)
 lo=math.floor(f);s.frame_set(lo,subframe=f-lo);bpy.context.view_layer.update()
 dg=bpy.context.evaluated_depsgraph_get();cache.append({o.name:tree(o,dg) for o in meshes if o!=drape})
sets=list(map(set,faces))
def apply(back,lift):
 for v,p in zip(drape.data.vertices,orig):
  t=smooth((1.397-p.z)/.195)
  v.co=p+Vector((0,back*t,lift*t))
 drape.data.update();bpy.context.view_layer.update()
def check():
 rows=[]
 for (name,f),partners in zip(grid,cache):
  activate(rig,name)
  for o in meshes:
   if o.data.shape_keys:activate(o.data.shape_keys,name)
  lo=math.floor(f);s.frame_set(lo,subframe=f-lo);bpy.context.view_layer.update()
  dt=tree(drape,bpy.context.evaluated_depsgraph_get())
  pairs={k:len(dt.overlap(t)) for k,t in partners.items()}
  pairs["self"]=sum(1 for i,j in dt.overlap(dt) if i<j and not sets[i]&sets[j])
  rows.append({"clip":name,"frame":f,"pairs":pairs})
 return rows
trials=[];best=None
for back,lift in [(0,0),(.015,0),(.030,0),(.045,0),(.060,0),(.015,.020),(.025,.025),(.035,.025),(.045,.025),(.055,.025),(.025,.045),(.035,.045),(.045,.045),(.060,.045),(.040,.065)]:
 apply(back,lift);rows=check()
 bad=sum(any(r["pairs"].values()) for r in rows);total=sum(sum(r["pairs"].values()) for r in rows)
 rec={"back_mm":back*1000,"lift_mm":lift*1000,"bad_samples":bad,"pairs":total,"rows":rows}
 trials.append(rec);print("W30B_TRIAL",back,lift,bad,total,flush=True)
 if not bad and (back or lift):
  best=rec;break
out.mkdir(parents=True,exist_ok=False)
(out/"w30b-probe.json").write_text(json.dumps({"source_sha256":hashlib.sha256(asset.read_bytes()).hexdigest(),"samples":len(grid),"trials":trials,"winner":best},indent=2))
if best:
 (out/"w30b-drape-delta.json").write_text(json.dumps({"rest":[list(p) for p in orig],"delta":[list(v.co-p) for v,p in zip(drape.data.vertices,orig)]},separators=(",",":")))
 print("W30B_PROBE_PASS",best["back_mm"],best["lift_mm"],flush=True)
else:print("W30B_NO_SAFE_CANDIDATE",flush=True)
