"""W29d feasibility probe: eye forward displacement, clearance, visible aperture.
Diagnostic only. Does not write or modify any actor asset.
"""
import bpy,json,struct,hashlib,os
from pathlib import Path
import numpy as np
from mathutils import Vector
from mathutils.bvhtree import BVHTree
root=Path(os.environ["HOREB_W29C_OUTPUT"]);grip=Path(os.environ["HOREB_W29C_GRIP_SOURCE"])
raw=(root/"w29c-actor.glb").read_bytes()
assert hashlib.sha256(raw).hexdigest()=="0d11d1b64a7b23b60fc1833d82bd938038f43c6369116ed9ac393b7cfa75ea94"
n=struct.unpack_from("<I",raw,12)[0];d=json.loads(raw[20:20+n]);b=raw[28+n:]
def rd(i,k):
 a=d["accessors"][i];v=d["bufferViews"][a["bufferView"]];return np.frombuffer(b,dtype={5126:"<f4",5123:"<u2"}[a["componentType"]],count=a["count"]*k,offset=v.get("byteOffset",0)+a.get("byteOffset",0)).reshape(-1,k).astype(float if a["componentType"]==5126 else int)
def mesh(name):
 p=next(x["primitives"][0] for x in d["meshes"] if x["name"]==name)
 return rd(p["attributes"]["POSITION"],3),rd(p["indices"],1).reshape(-1,3),np.array([rd(t["POSITION"],3) for t in p.get("targets",[])])
body,bt,bm=mesh("base");eye,et,em=mesh("low-poly");brow,brt,brm=mesh("W28t_CC0_brows");lash,lt,lm=mesh("W29b_CC0_lashes")
def tree(v,t):return BVHTree.FromPolygons([Vector(x) for x in v],t.tolist(),all_triangles=True)
def deform(v,m,w):return v+np.tensordot(w,m,axes=1)
a=json.loads((grip/"w28r-glb-audit.json").read_text(encoding="utf8"))
assert a["actor_sha256"]=="40b966d66bd72ef628e572bf2f356d6ff13f7752d021b60bdd6c217bb77b81dc" and all(not c["bad"] for c in a["clips"])
rows=[r for c in a["clips"] for r in c["rows"]];assert len(rows)==561
states={tuple(round(w,7) for w in [*r["blink_weights"],*r["eye_weights"]]) for r in rows}
cache={}
for state in states:
 w=state[:2]
 if w not in cache:cache[w]=(tree(deform(body,bm,w),bt),tree(deform(brow,brm,w),brt),tree(deform(lash,lm,w),lt))
# Orthographic head-local frontal ray samples; compare eye visibility behind actual eyelids.
skin=cache[(0.,0.)][0]
def visible(ev):
 e=tree(ev,et);hits=0;area=0
 for side in (-1,1):
  for xx in np.linspace(.014,.043,48)*side:
   for yy in np.linspace(1.435,1.451,28):
    origin=Vector((xx,yy,.18));direction=Vector((0,0,-1))
    sh,_,_,sd=skin.ray_cast(origin,direction);eh,_,_,ed=e.ray_cast(origin,direction)
    if eh is not None:
     area+=1
     if sh is None or ed<sd:hits+=1
 return [hits,area]
results=[]
for zmm in (0,.5,1,1.5,2,2.5,3,3.5,4,5,6):
 shift=np.array([0,0,zmm/1000])
 overlaps=[0,0,0];bad=0;maxhits=[0,0,0]
 for state in states:
  w=state[:2];ev=deform(eye,em,state[2:])+shift;e=tree(ev,et)
  counts=[len(e.overlap(t)) for t in cache[w]]
  if any(counts):bad+=1
  overlaps=[a+b for a,b in zip(overlaps,counts)];maxhits=[max(a,b) for a,b in zip(maxhits,counts)]
 vis=visible(eye+shift)
 row={"forward_mm":zmm,"bad_states":bad,"max_pairs":maxhits,"sum_pairs":overlaps,"visible_eye_ray_hits":vis[0],"eye_ray_hits":vis[1]}
 print("W29D_EYE_PROBE",json.dumps(row),flush=True);results.append(row)
out=root/"w29d-eye-forward-probe.json"
assert not out.exists();out.write_text(json.dumps({"source_sha256":hashlib.sha256(raw).hexdigest(),"states":len(states),"results":results},indent=2),encoding="utf8")
print("W29D_EYE_PROBE_DONE",len(states),flush=True)
