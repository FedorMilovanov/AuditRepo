"""W30e: fit rear drape top edge to the head-cover rim.
Diagnostic uses exact W30d export; no canonical changes.
"""
import bpy,hashlib,json,math,os,struct
import numpy as np
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
root=Path(os.environ["HOREB_W30D_OUTPUT"]);out=Path(os.environ["HOREB_W30E_OUTPUT"])
asset=root/"w30d-actor.glb"
assert hashlib.sha256(asset.read_bytes()).hexdigest()=="8b63fcab7933a8493b6337437f0ae7f17c5ba3e50106d40945687ea1ce8aac6b"
bpy.ops.wm.read_factory_settings(use_empty=True);s=bpy.context.scene;s.render.fps=24
bpy.ops.import_scene.gltf(filepath=str(asset),merge_vertices=True)
rig=next(o for o in bpy.data.objects if o.type=="ARMATURE")
meshes=[o for o in bpy.data.objects if o.type=="MESH" and o.parent==rig];assert len(meshes)==9
drape=next(o for o in meshes if o.data.name.startswith("W22_linen_rear_drape_geo"))
tunic=next(o for o in meshes if o.name=="W28e_tailored_linen")
orig=[v.co.copy() for v in drape.data.vertices];faces=[tuple(p.vertices) for p in drape.data.polygons]
assert len(orig)==325 and len(faces)==576
print("W30E_REST_BOUNDS",[[min(v[k] for v in orig) for k in range(3)],[max(v[k] for v in orig) for k in range(3)]],flush=True)
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
# The 25 upper-edge drape vertices are rigidly head-weighted, as is the cap.
# Read authored GLB rim topology and match back-side arc by lateral coordinate.
raw=asset.read_bytes();n=struct.unpack_from("<I",raw,12)[0];doc=json.loads(raw[20:20+n]);blob=raw[28+n:]
def positions(name):
 p=next(x["primitives"][0] for x in doc["meshes"] if x["name"]==name)
 a=doc["accessors"][p["attributes"]["POSITION"]];v=doc["bufferViews"][a["bufferView"]]
 x=np.frombuffer(blob,dtype="<f4",count=a["count"]*3,offset=v.get("byteOffset",0)+a.get("byteOffset",0)).reshape(-1,3)
 return np.column_stack((x[:,0],-x[:,2],x[:,1])).astype(float)
rim=positions("W22_plain_linen_head_cover_geo")[581:596];rim=rim[np.argsort(rim[:,0])]
upper=positions("W22_linen_rear_drape_geo")[:25]
assert np.all(np.diff(rim[:,0])>0) and np.all(np.diff(upper[:,0])>0) and rim[0,0]<upper[0,0]<upper[-1,0]<rim[-1,0]
targets=np.column_stack((upper[:,0],np.interp(upper[:,0],rim[:,0],rim[:,1]),np.interp(upper[:,0],rim[:,0],rim[:,2])))
dist=np.linalg.norm(targets-upper,axis=1);assert dist.min()>.001
print("W30E_RIM_GAP_MM",float(dist.min()*1000),float(dist.max()*1000),flush=True)
def apply(gap,transition):
 shift=(targets-upper)*(1-gap/dist[:,None])
 for v,p in zip(drape.data.vertices,orig):
  # Interpolate along the original top arc and fade out below it.
  lateral=np.clip(p.x,-.077,.077)
  ztop=np.interp(lateral,upper[:,0],upper[:,2])
  fade=1-smooth(max(0,ztop-p.z)/transition)
  delta=np.array([np.interp(lateral,upper[:,0],shift[:,k]) for k in range(3)])*fade
  v.co=p+Vector(delta.tolist())
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
for gap,transition in [(.0008,.065),(.0015,.065),(.0025,.065),(.0015,.09),(.0025,.09),(.0035,.09),(.0045,.09)]:
 apply(gap,transition);rows=check()
 bad=sum(any(r["pairs"].values()) for r in rows);total=sum(sum(r["pairs"].values()) for r in rows)
 rec={"params":[gap,transition],"bad_samples":bad,"pairs":total,"rows":rows}
 trials.append(rec);print("W30E_TRIAL",rec["params"],bad,total,flush=True)
 if not bad:
  best=rec;break
out.mkdir(parents=True,exist_ok=False)
(out/"w30e-probe.json").write_text(json.dumps({"source_sha256":hashlib.sha256(asset.read_bytes()).hexdigest(),"samples":len(grid),"trials":trials,"winner":best},indent=2))
if best:
 (out/"w30e-drape-delta.json").write_text(json.dumps({"rest":[list(p) for p in orig],"delta":[list(v.co-p) for v,p in zip(drape.data.vertices,orig)]},separators=(",",":")))
 print("W30E_PROBE_PASS",best["params"],flush=True)
else:print("W30E_NO_SAFE_CANDIDATE",flush=True)
