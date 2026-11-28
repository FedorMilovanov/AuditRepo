"""W31f: repair lash/skin clearance across continuous equal-eye blink samples.
Remove only proven unsafe symmetric ribbon pairs; preserve all remaining geometry and motion.
"""
import bpy,copy,hashlib,json,os,struct
from pathlib import Path
import numpy as np
from mathutils import Vector
from mathutils.bvhtree import BVHTree
def sha(x):return hashlib.sha256(x).hexdigest()
root=Path(os.environ["HOREB_W31D_SOURCE"]);out=Path(os.environ["HOREB_W31F_OUTPUT"])
raw=(root/"w31d-actor.glb").read_bytes()
m=json.loads((root/"w31d-manifest.json").read_text())
audit_bytes=(root/"w31e-blend-audit.json").read_bytes();audit=json.loads(audit_bytes)
assert sha(raw)==m["glb_sha256"]==audit["actor_sha256"]=="4b87b59ac8c7c61968ef7c9a00f23939f21e53558d8f74072fde5e5b495e9db8"
assert len(audit["rows"])==160 and len(audit["bad"])==5
assert all(r["facial_bad"] and not any(r[k] for k in ("prop_hits","skin_cloth","self_pairs","sash_pairs","sash_self_pairs","head_linen_bad","hand_self_pairs","right_skin_pairs")) for r in audit["bad"])
def decode(raw):
 n,t=struct.unpack_from("<I4s",raw,12);assert t==b"JSON"
 z,t=struct.unpack_from("<I4s",raw,20+n);assert t==b"BIN\0" and len(raw)==28+n+z
 return json.loads(raw[20:20+n]),raw[28+n:]
def encode(d,b):
 j=json.dumps(d,separators=(",",":"),ensure_ascii=False).encode();j+=b" "*(-len(j)%4);b+=b"\0"*(-len(b)%4)
 return struct.pack("<4sII",b"glTF",2,28+len(j)+len(b))+struct.pack("<I4s",len(j),b"JSON")+j+struct.pack("<I4s",len(b),b"BIN\0")+b
d,b=decode(raw);original=copy.deepcopy(d);payload=bytearray(b)
def read(i,k):
 a=d["accessors"][i];v=d["bufferViews"][a["bufferView"]];typ={5126:"<f4",5123:"<u2",5125:"<u4",5121:"u1"}[a["componentType"]]
 assert v.get("byteStride",np.dtype(typ).itemsize*k)==np.dtype(typ).itemsize*k
 return np.frombuffer(b,dtype=typ,count=a["count"]*k,offset=v.get("byteOffset",0)+a.get("byteOffset",0)).reshape(-1,k).copy()
def mesh(name):
 p=next(x["primitives"][0] for x in d["meshes"] if x["name"]==name)
 return p,read(p["attributes"]["POSITION"],3),read(p["indices"],1).reshape(-1,3),[read(t["POSITION"],3) for t in p.get("targets",[])]
lp,l,lt,lm=mesh("W29b_CC0_lashes");bp,s,st,sm=mesh(d["meshes"][0]["name"]);_,br,brt,brm=mesh("W28t_CC0_brows")
ep=next(x["primitives"][0] for x in d["meshes"] if len(x["primitives"][0].get("targets",[]))==8);eye=read(ep["attributes"]["POSITION"],3);et=read(ep["indices"],1).reshape(-1,3);em=[read(t["POSITION"],3) for t in ep["targets"]]
assert l.shape==(220,3) and lt.shape==(132,3) and len(lm)==len(sm)==len(brm)==2 and len(s)==14517
def tree(x,f):return BVHTree.FromPolygons([Vector(v) for v in x],f.tolist(),all_triangles=True)
# Localize body triangles by conservative union of all blink-corner bounds.
# Non-selected triangles cannot enter the expanded lash AABB in this linear model.
corners=np.array([s,s+sm[0],s+sm[1],s+sm[0]+sm[1]])
ll=np.min([l,l+lm[0],l+lm[1],l+lm[0]+lm[1]],axis=(0,1))-.003
lh=np.max([l,l+lm[0],l+lm[1],l+lm[0]+lm[1]],axis=(0,1))+.003
lo=corners.min(0)[st].min(1);hi=corners.max(0)[st].max(1)
selected=st[np.all((hi>=ll)&(lo<=lh),axis=1)]
ids=np.unique(selected);remap=np.full(len(s),-1);remap[ids]=np.arange(len(ids));sf=remap[selected]
# Include exact observed mixed weights, all former discrete clip weights, and a dense grid.
weights=sorted(set(np.linspace(0,1,201).tolist()+[float(r["blink_weights"][0]) for r in audit["rows"]]))
prior=json.loads((root/"w31d-glb-audit.json").read_text());weights=sorted(set(weights+[float(r["blink_weights"][0]) for c in prior["clips"] for r in c["rows"]]))
# Dense neutral-gaze blink guards plus all observed coupled gaze/blink states
# from the separate clips and the failed transition audit.
specs={(w,w,(0.,)*8) for w in weights}
specs.update((a,c,(0.,)*8) for a,c in ((1.,0.),(0.,1.)))
specs.update((float(r["blink_weights"][0]),float(r["blink_weights"][1]),tuple(r["eye_weights"])) for r in [*audit["rows"],*[r for c in prior["clips"] for r in c["rows"]]])
body_cache={};eye_cache={};states=[]
for a,c,e in sorted(specs):
 if (a,c) not in body_cache:body_cache[a,c]=(tree(s[ids]+a*sm[0][ids]+c*sm[1][ids],sf),tree(br+a*brm[0]+c*brm[1],brt))
 if e not in eye_cache:eye_cache[e]=tree(eye+sum((w*x for w,x in zip(e,em)),np.zeros_like(eye)),et)
 states.append((a,c,*body_cache[a,c],eye_cache[e]))
print("W31F_GUARD_STATES",len(states),flush=True)
local_faces=np.array([[0,1,2],[1,3,2],[2,3,4]])
assert np.array_equal(lt,np.concatenate([local_faces+5*i for i in range(44)]))
def safe(v,ds,faces):
 for a,c,skin,brow,eyes in states:
  t=tree(v+a*ds[0]+c*ds[1],faces)
  if t.overlap(skin) or t.overlap(brow):return False
  if t.overlap(eyes):return False
 return True

bad_ids=[i for i in range(44) if not safe(l[i*5:i*5+5],[x[i*5:i*5+5] for x in lm],local_faces)]
assert bad_ids==[4,5,8,9],bad_ids
keep=[i for i in range(44) if i not in bad_ids]
iv=np.array([5*i+k for i in keep for k in range(5)])
v=l[iv];morph=[x[iv] for x in lm];tri=np.concatenate([local_faces+5*i for i in range(len(keep))])
assert len(v)==200 and len(tri)==120 and safe(v,morph,tri)
sets=list(map(set,tri))
for a,c,skin,brow,eyes in states:
 t=tree(v+a*morph[0]+c*morph[1],tri)
 assert not any(i<j and not sets[i]&sets[j] for i,j in t.overlap(t))
# Compact just the lash accessors in their original buffer ranges. Zero the
# vacated bytes, preserve the original GLB allocation and all other views.
changed=set();acc=set()
def compact(i,k,x):
 a=d["accessors"][i];bv=d["bufferViews"][a["bufferView"]];old=read(i,k)
 x=np.asarray(x,dtype=old.dtype).reshape(-1,k)
 assert a.get("byteOffset",0)==0 and bv["byteLength"]==old.nbytes and sum(t["bufferView"]==a["bufferView"] for t in d["accessors"])==1
 o=bv.get("byteOffset",0);payload[o:o+old.nbytes]=x.tobytes()+bytes(old.nbytes-x.nbytes)
 a["count"]=len(x);bv["byteLength"]=x.nbytes
 if "min" in a:a["min"]=x.min(0).tolist()
 if "max" in a:a["max"]=x.max(0).tolist()
 changed.add(a["bufferView"]);acc.add(i)
for name,i in lp["attributes"].items():
 k=4 if name in ("JOINTS_0","WEIGHTS_0") else 3
 assert name in ("JOINTS_0","WEIGHTS_0","POSITION","NORMAL")
 compact(i,k,read(i,k)[iv])
for t in lp["targets"]:
 for name,i in t.items():assert name in ("POSITION","NORMAL");compact(i,3,read(i,3)[iv])
compact(lp["indices"],1,tri.reshape(-1,1))
res=encode(d,bytes(payload));q,qb=decode(res)
for i in acc:q["accessors"][i]=original["accessors"][i]
for i in changed:q["bufferViews"][i]=original["bufferViews"][i]
assert q==original and len(changed)==9
for i,bv in enumerate(original["bufferViews"]):
 o=bv.get("byteOffset",0);end=o+bv["byteLength"]
 if i not in changed:assert qb[o:end]==b[o:end]
report={"status":"ART_HOLD_W31F_LASH_CLEARANCE_TRIAL","source_sha256":sha(raw),"house_sha256":m["house_sha256"],"glb_sha256":sha(res),"glb_bytes":len(res),"source_blend_audit_sha256":sha(audit_bytes),"only_lash_topology_subset_changed":True,"sample_states":len(states),"skin_region_triangles":len(sf),"removed_strands":bad_ids,"strands":40,"vertices":200,"triangles":120,"unchanged_views":len(d["bufferViews"])-9}
if out.exists():
 assert (out/"w31f-actor.glb").read_bytes()==res and json.loads((out/"w31f-manifest.json").read_text())==report
 print("W31F_REPRO_PASS",sha(res),flush=True)
else:
 out.mkdir(parents=True);(out/"w31f-actor.glb").write_bytes(res);(out/"w31f-manifest.json").write_text(json.dumps(report,indent=2))
 print("W31F_LASH_TRIAL_PASS",json.dumps(report),flush=True)
