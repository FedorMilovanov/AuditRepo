"""W34f: append exact W34e corrective morphs to pinned W31f GLB.
Original binary prefix unchanged; extend only body weight channels."""
import copy,hashlib,json,os,struct
from pathlib import Path
import numpy as np
from scipy.spatial import cKDTree
def sha(x):return hashlib.sha256(x).hexdigest()
root=Path(os.environ["HOREB_W31F_OUTPUT"]);probe=Path(os.environ["HOREB_W34E_OUTPUT"]);out=Path(os.environ["HOREB_W34F_OUTPUT"])
raw=(root/"w31f-actor.glb").read_bytes()
assert sha(raw)=="2a72465f5efb0995926b9641a103365122907174447af1ca61b875366e43eb3b"
pb=(probe/"w34e-corrective-deltas.json").read_bytes();report=json.loads(pb)
assert report["source_actor_sha256"]==sha(raw) and report["status"]=="ART_HOLD_NATIVE_MORPH_STATIC_ONLY"
assert not report["audit"]["skin_pairs"] and not report["audit"]["prop_hits"]
def decode(raw):
 assert struct.unpack_from("<4sII",raw)==(b"glTF",2,len(raw))
 n,t=struct.unpack_from("<I4s",raw,12);assert t==b"JSON"
 z,t=struct.unpack_from("<I4s",raw,20+n);assert t==b"BIN\0" and len(raw)==28+n+z
 return json.loads(raw[20:20+n]),raw[28+n:]
def encode(d,b):
 j=json.dumps(d,separators=(",",":"),ensure_ascii=False).encode();j+=b" "*(-len(j)%4);b+=b"\0"*(-len(b)%4)
 return struct.pack("<4sII",b"glTF",2,28+len(j)+len(b))+struct.pack("<I4s",len(j),b"JSON")+j+struct.pack("<I4s",len(b),b"BIN\0")+b
d,b=decode(raw);original=copy.deepcopy(d);payload=bytearray(b)
def read(i,k):
 a=d["accessors"][i];v=d["bufferViews"][a["bufferView"]];typ={5126:"<f4",5123:"<u2",5125:"<u4",5121:"u1"}[a["componentType"]]
 assert not a.get("sparse") and not a.get("normalized") and v.get("byteStride",np.dtype(typ).itemsize*k)==np.dtype(typ).itemsize*k
 return np.frombuffer(b,dtype=typ,count=a["count"]*k,offset=v.get("byteOffset",0)+a.get("byteOffset",0)).reshape(-1,k).copy()
def append(a,kind,target=None):
 a=np.asarray(a,dtype="<f4");assert np.isfinite(a).all();payload.extend(b"\0"*(-len(payload)%4))
 v={"buffer":0,"byteOffset":len(payload),"byteLength":a.nbytes}
 if target:v["target"]=target
 vi=len(d["bufferViews"]);d["bufferViews"].append(v);payload.extend(a.tobytes())
 ai=len(d["accessors"]);d["accessors"].append({"bufferView":vi,"componentType":5126,"count":len(a),"type":kind,"min":a.min(0).reshape(-1).tolist(),"max":a.max(0).reshape(-1).tolist()});return ai
def normals(x,tri):
 # Weld only exact rest-position duplicates for area-weighted normals,
 # preserving the original exported normals via a delta.
 _,ids=np.unique(x,axis=0,return_inverse=True)
 f=np.cross(x[tri[:,1]]-x[tri[:,0]],x[tri[:,2]]-x[tri[:,0]])
 accum=np.zeros((ids.max()+1,3))
 for i in range(3):np.add.at(accum,ids[tri[:,i]],f)
 a=accum[ids];n=np.linalg.norm(a,axis=1);assert np.all(n>1e-12)
 return a/n[:,None]
name="W34e_JointPoseCorrective";stats={}
for mi,node,record in ((0,53,"base"),(6,59,"W28e_tailored_linen")):
 m=d["meshes"][mi];assert d["nodes"][node]["mesh"]==mi
 p=m["primitives"][0];attrs=p["attributes"];x=read(attrs["POSITION"],3).astype(float);n=read(attrs["NORMAL"],3).astype(float);tri=read(p["indices"],1).reshape(-1,3)
 joints=read(attrs["JOINTS_0"],4);weights=read(attrs["WEIGHTS_0"],4)
 names=[d["nodes"][i]["name"] for i in d["skins"][d["nodes"][node]["skin"]]["joints"]]
 local=x[:,[0,2,1]].copy();local[:,1]*=-1
 rows=report["records"][record]["rows"];tree=cKDTree(local);dp=np.zeros_like(x);assigned={};max_error=0.;max_weight_error=0.
 for r in rows:
  rest=np.array(r["rest"]);wanted=dict(r["weights"]);hits=tree.query_ball_point(rest,1e-6);matched=[]
  for i in hits:
   have={names[int(j)]:float(w) for j,w in zip(joints[i],weights[i]) if w>0}
   err=max(abs(have.get(k,0)-wanted.get(k,0)) for k in set(have)|set(wanted))
   if err>1e-5:continue
   max_weight_error=max(max_weight_error,err);max_error=max(max_error,float(np.linalg.norm(local[i]-rest)))
   delta=np.array(r["delta"])[[0,2,1]];delta[2]*=-1
   if i in assigned:assert np.linalg.norm(dp[i]-delta)<1e-6
   dp[i]=delta;assigned[i]=True;matched.append(i)
  assert matched,(record,r["vertex"],len(hits),wanted)
 assert len(assigned)>=len(rows)
 v=x+dp;dn=normals(v,tri)-normals(x,tri);nn=n+dn
 nn/=np.linalg.norm(nn,axis=1)[:,None];nd=nn-n;nd[np.linalg.norm(dn,axis=1)<1e-12]=0
 p.setdefault("targets",[]).append({"POSITION":append(dp,"VEC3",34962),"NORMAL":append(nd,"VEC3",34962)})
 m.setdefault("weights",[]).append(0);m.setdefault("extras",{}).setdefault("targetNames",[]).append(name)
 assert "weights" not in d["nodes"][node]
 stats[record]={"native_rows":len(rows),"mapped_glb_vertices":len(assigned),"position_error_mm":max_error*1000,"weight_error":max_weight_error,"max_delta_mm":float(np.linalg.norm(dp,axis=1).max()*1000)}
# Weight samplers 160 are shared with brows and lashes: clone for body only.
for a in d["animations"]:
 c=next(c for c in a["channels"] if c["target"]=={"node":53,"path":"weights"})
 old=a["samplers"][c["sampler"]];assert old.get("interpolation","LINEAR")=="LINEAR"
 w=read(old["output"],1).reshape(-1,2);assert len(w)==d["accessors"][old["input"]]["count"]
 new=np.column_stack((w,np.zeros(len(w)))).reshape(-1,1)
 i=append(new,"SCALAR");c["sampler"]=len(a["samplers"]);a["samplers"].append({**old,"output":i})
 # Tunic has no old weight channel: use exact same timestamps, all zero.
 i=append(np.zeros((len(w),1)),"SCALAR");a["channels"].append({"sampler":len(a["samplers"]),"target":{"node":59,"path":"weights"}});a["samplers"].append({**old,"output":i})
d["buffers"][0]["byteLength"]=len(payload);res=encode(d,bytes(payload));q,qb=decode(res)
assert qb[:len(b)]==b
# Reverse only explicit additions and prove the entire original metadata restored.
for mi in (0,6):q["meshes"][mi]=original["meshes"][mi]
for a,o in zip(q["animations"],original["animations"]):
 c=next(c for c in a["channels"] if c["target"]=={"node":53,"path":"weights"})
 c["sampler"]=next(c for c in o["channels"] if c["target"]=={"node":53,"path":"weights"})["sampler"]
 a["channels"].pop();a["samplers"]=a["samplers"][:-2]
q["accessors"]=q["accessors"][:len(original["accessors"])];q["bufferViews"]=q["bufferViews"][:len(original["bufferViews"])];q["buffers"]=original["buffers"];assert q==original
manifest={"status":"ART_HOLD_W34F_CORRECTIVE_MORPH_TRIAL","source_sha256":sha(raw),"probe_sha256":sha(pb),"glb_sha256":sha(res),"glb_bytes":len(res),"original_binary_prefix_unchanged":True,"original_metadata_restorable":True,"stats":stats,"limitations":["Static correction only; no new animation or grasp.","Native reimport and runtime validation required."]}
out.mkdir(parents=True,exist_ok=True);asset=out/"w34f-actor.glb";mp=out/"w34f-manifest.json"
if asset.exists():assert asset.read_bytes()==res and json.loads(mp.read_text())==manifest
else:asset.write_bytes(res);mp.write_text(json.dumps(manifest,indent=2))
print("W34F_TRANSFER",json.dumps(manifest),flush=True)
