"""W28q constrained shoulder tailoring probe. Never replace the canonical actor."""
import bpy, hashlib, json, math, os
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
root=Path(os.environ["HOREB_W28G_OUTPUT"])
out=Path(os.environ["HOREB_W28Q_OUTPUT"])
assert not out.exists()
m=json.loads((root/"w28g-manifest.json").read_text(encoding="utf8"))
assert hashlib.sha256(Path(bpy.data.filepath).read_bytes()).hexdigest()==m["blend_sha256"]
scene=bpy.context.scene
rig=next(o for o in bpy.data.objects if o.type=="ARMATURE")
body=bpy.data.objects["ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0"]
dress=bpy.data.objects["W28e_tailored_linen"]
belt=bpy.data.objects["W22_hand_woven_waist_tie"]
orig=[v.co.copy() for v in dress.data.vertices]
assert len(orig)==18390 and len(dress.data.polygons)==36332
ad=rig.animation_data
tracks={t.name:t.strips[0] for t in ad.nla_tracks}
def smooth(x):
 x=max(0.,min(1.,x));return x*x*(3-2*x)
def shape(drop,depth):
 count=0;maxdelta=0
 for v,p in zip(dress.data.vertices,orig):
  x,y,z=p
  # Taper off at the neck, arm opening and waist; shoulder and upper torso only.
  band=smooth((abs(x)-.075)/.075)*smooth((.275-abs(x))/.055)
  upper=smooth((z-1.165)/.115)
  q=p.copy();q.z-=drop*band*upper
  q.y-=depth*band*upper*max(-1,min(1,(y+.02)/.12))
  delta=(q-p).length
  if delta>1e-7:count+=1;maxdelta=max(maxdelta,delta)
  v.co=q
 dress.data.update();bpy.context.view_layer.update()
 return count,maxdelta
def tree(o,dg):
 ob=o.evaluated_get(dg);mesh=ob.to_mesh()
 fs=[tuple(p.vertices) for p in mesh.polygons]
 t=BVHTree.FromPolygons([ob.matrix_world@v.co for v in mesh.vertices],fs)
 ob.to_mesh_clear()
 return t,fs
def check(name,f):
 a=tracks[name];ad.use_nla=False;ad.action=a.action;ad.action_slot=a.action_slot
 scene.frame_set(f);bpy.context.view_layer.update()
 dg=bpy.context.evaluated_depsgraph_get()
 dt,faces=tree(dress,dg);bt,_=tree(body,dg);st,_=tree(belt,dg)
 sets=list(map(set,faces))
 return {"clip":name,"frame":f,"skin":len(dt.overlap(bt)),"sash":len(dt.overlap(st)),"self":sum(1 for i,j in dt.overlap(dt) if i<j and not sets[i]&sets[j])}
grid=[("Mother_GestureTowardsBasket",f) for f in (1,13,21,31,41,47,48,60,70,71,78,88,97,105)]+[("Mother_QuietIdle",f) for f in (1,48,96,144)]
results=[];winner=None
for drop,depth in ((.036,.024),(.024,.016),(.012,.008),(0.,0.)):
 n,delta=shape(drop,depth);rows=[check(name,f) for name,f in grid]
 bad=[r for r in rows if r["skin"] or r["sash"] or r["self"]]
 result={"drop_mm":drop*1000,"depth_mm":depth*1000,"changed_vertices":n,"max_delta_mm":delta*1000,"bad_count":len(bad),"rows":rows}
 results.append(result)
 print("W28Q_SHOULDER",json.dumps({k:v for k,v in result.items() if k!="rows"}),flush=True)
 if not bad and drop>0:
  winner=result;break
 if not bad:break
out.mkdir(parents=True)
(out/"w28q-shoulder-probe.json").write_text(json.dumps({"status":"ART_HOLD_COARSE_SHOULDER_PROBE","source_blend_sha256":m["blend_sha256"],"samples_per_candidate":len(grid),"trials":results,"winner":winner},indent=2),encoding="utf8")
if winner:
 # Keep a compact native delta for later exact GLB transfer, not another full repository or BLEND.
 delta=[list(v.co-p) for v,p in zip(dress.data.vertices,orig)]
 (out/"w28q-shoulder-delta.json").write_text(json.dumps(delta,separators=(",",":")),encoding="utf8")
 print("W28Q_COARSE_PASS",winner["drop_mm"],winner["depth_mm"],flush=True)
else:print("W28Q_NO_SAFE_NONZERO_CANDIDATE",flush=True)
