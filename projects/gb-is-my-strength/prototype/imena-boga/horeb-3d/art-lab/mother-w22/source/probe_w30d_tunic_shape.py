"""W30d: tailored skirt silhouette and broad longitudinal folds.
Diagnostic uses exact W30c export; no canonical changes.
"""
import bpy,hashlib,json,math,os
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
root=Path(os.environ["HOREB_W30C_OUTPUT"]);out=Path(os.environ["HOREB_W30D_OUTPUT"])
asset=root/"w30c-actor.glb"
assert hashlib.sha256(asset.read_bytes()).hexdigest()=="d5b1dc8af5e2dc0156be33b03f78b4c2d91baf2e3c7ea2646e8b8803f965e442"
bpy.ops.wm.read_factory_settings(use_empty=True);s=bpy.context.scene;s.render.fps=24
bpy.ops.import_scene.gltf(filepath=str(asset),merge_vertices=True)
rig=next(o for o in bpy.data.objects if o.type=="ARMATURE")
meshes=[o for o in bpy.data.objects if o.type=="MESH" and o.parent==rig];assert len(meshes)==9
tunic=next(o for o in meshes if o.name=="W28e_tailored_linen")
orig=[v.co.copy() for v in tunic.data.vertices];faces=[tuple(p.vertices) for p in tunic.data.polygons]
assert len(orig)==18390 and len(faces)==36332
print("W30D_REST_BOUNDS",[[min(v[k] for v in orig) for k in range(3)],[max(v[k] for v in orig) for k in range(3)]],flush=True)
assert .15<min(v.z for v in orig)<.16 and 1.33<max(v.z for v in orig)<1.35
def activate(o,name):
 ad=o.animation_data;t=next(t for t in ad.nla_tracks if t.name==name);st=t.strips[0]
 ad.use_nla=False;ad.action=st.action;ad.action_slot=st.action_slot
def tree(o,dg):
 ob=o.evaluated_get(dg);me=ob.to_mesh();fs=[tuple(p.vertices) for p in me.polygons]
 t=BVHTree.FromPolygons([ob.matrix_world@v.co for v in me.vertices],fs);ob.to_mesh_clear();return t
def smooth(x):
 x=max(0.,min(1.,x));return x*x*(3-2*x)
grid=[("Mother_GestureTowardsBasket",f) for f in (1,12,12.75,21,31,41,47,60,71,82.75,91,105)]+[("Mother_QuietIdle",f) for f in (1,34,48,96,110,144)]
# Cache the posed collision partners. Only the tunic is edited between candidates.
cache=[]
for name,f in grid:
 activate(rig,name)
 for o in meshes:
  if o.data.shape_keys:activate(o.data.shape_keys,name)
 lo=math.floor(f);s.frame_set(lo,subframe=f-lo);bpy.context.view_layer.update()
 dg=bpy.context.evaluated_depsgraph_get();cache.append({o.name:tree(o,dg) for o in meshes if o!=tunic})
sets=list(map(set,faces))
def apply(taper,fold,drop,depth):
 for v,p in zip(tunic.data.vertices,orig):
  x,y,z=p
  # Preserve the sash zone exactly. Shape skirt volume below it.
  skirt=smooth((.825-z)/.20)*smooth((z-.24)/.16)
  theta=math.atan2((y+.008)/.22,x/.30)
  ripple=.5+.5*math.cos(7*theta+.55*math.sin(5*z)+.27*math.sin(3*theta))
  q=p.copy()
  q.x=x*(1-taper*skirt)+fold*skirt*ripple*math.cos(theta)
  q.y=y*(1-.65*taper*skirt)+fold*skirt*ripple*math.sin(theta)
  # Upper shoulder tunic, away from neckline and arm apertures.
  band=smooth((abs(x)-.085)/.075)*smooth((.25-abs(x))/.06)*smooth((z-1.17)/.11)*smooth((1.32-z)/.045)
  q.z-=drop*band
  q.y-=depth*band*max(-1,min(1,(y+.02)/.12))
  v.co=q
 tunic.data.update();bpy.context.view_layer.update()
def check():
 rows=[]
 for (name,f),partners in zip(grid,cache):
  activate(rig,name)
  for o in meshes:
   if o.data.shape_keys:activate(o.data.shape_keys,name)
  lo=math.floor(f);s.frame_set(lo,subframe=f-lo);bpy.context.view_layer.update()
  dt=tree(tunic,bpy.context.evaluated_depsgraph_get())
  pairs={k:len(dt.overlap(t)) for k,t in partners.items()}
  pairs["self"]=sum(1 for i,j in dt.overlap(dt) if i<j and not sets[i]&sets[j])
  rows.append({"clip":name,"frame":f,"pairs":pairs})
 return rows
# The existing stitched hem intentionally contacts the dress. Require exact
# preservation of its contact counts in every sample, not a general waiver.
apply(0,0,0,0);baseline=check()
assert all(not any(n for k,n in r["pairs"].items() if k!="Stitched_lower_hem") for r in baseline)
trials=[];best=None
for taper,fold,drop,depth in [(.15,.012,.008,.004),(.12,.010,.004,.002),(.10,.008,0,0),(.07,.006,0,0),(.04,.004,0,0)]:
 apply(taper,fold,drop,depth);rows=check()
 bad=sum(any(n for k,n in r["pairs"].items() if k!="Stitched_lower_hem") or r["pairs"]["Stitched_lower_hem"]!=b["pairs"]["Stitched_lower_hem"] for r,b in zip(rows,baseline))
 total=sum(sum(n for k,n in r["pairs"].items() if k!="Stitched_lower_hem") for r in rows)
 rec={"params":[taper,fold,drop,depth],"bad_samples":bad,"pairs":total,"rows":rows}
 trials.append(rec);print("W30D_TRIAL",rec["params"],bad,total,flush=True)
 if not bad:
  best=rec;break
out.mkdir(parents=True,exist_ok=False)
(out/"w30d-probe.json").write_text(json.dumps({"source_sha256":hashlib.sha256(asset.read_bytes()).hexdigest(),"samples":len(grid),"baseline":baseline,"trials":trials,"winner":best},indent=2))
if best:
 (out/"w30d-tunic-delta.json").write_text(json.dumps({"rest":[list(p) for p in orig],"delta":[list(v.co-p) for v,p in zip(tunic.data.vertices,orig)]},separators=(",",":")))
 print("W30D_PROBE_PASS",best["params"],flush=True)
else:print("W30D_NO_SAFE_CANDIDATE",flush=True)
