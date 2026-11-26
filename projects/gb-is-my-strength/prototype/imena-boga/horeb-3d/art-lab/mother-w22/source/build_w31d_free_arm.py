"""W31d: counterbalance the reaching gesture with a subtle free-arm motion."""
import copy,hashlib,json,math,os,struct
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R,Slerp
def sha(x):return hashlib.sha256(x).hexdigest()
root=Path(os.environ["HOREB_W31A_OUTPUT"]);out=Path(os.environ["HOREB_W31D_OUTPUT"])
raw=(root/"w31a-actor.glb").read_bytes();m=json.loads((root/"w31a-manifest.json").read_text())
audit_bytes=(root/"w31a-glb-audit.json").read_bytes();audit=json.loads(audit_bytes)
assert sha(raw)==m["glb_sha256"]==audit["actor_sha256"]=="8c03caab4aa8d4871883ff5d8a71ee15f556abf226c0789c0dbe368c65be6113"
assert audit["house_sha256"]==m["house_sha256"] and [len(c["rows"]) for c in audit["clips"]]==[417,144] and all(not c["bad"] for c in audit["clips"])
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
 a=d["accessors"][i];v=d["bufferViews"][a["bufferView"]]
 assert a["componentType"]==5126 and v.get("byteStride",4*k)==4*k and not a.get("sparse")
 return np.frombuffer(b,dtype="<f4",count=a["count"]*k,offset=v.get("byteOffset",0)+a.get("byteOffset",0)).reshape(-1,k).copy()
def add(x):
 x=np.asarray(x,dtype="<f4");assert x.shape==(105,4) and np.isfinite(x).all()
 payload.extend(b"\0"*(-len(payload)%4));v=len(d["bufferViews"]);d["bufferViews"].append({"buffer":0,"byteOffset":len(payload),"byteLength":x.nbytes});payload.extend(x.tobytes())
 i=len(d["accessors"]);d["accessors"].append({"bufferView":v,"componentType":5126,"count":len(x),"type":"VEC4","min":x.min(0).tolist(),"max":x.max(0).tolist()});return i
nodes=d["nodes"];names={n["name"]:i for i,n in enumerate(nodes) if "name" in n};parents={c:i for i,n in enumerate(nodes) for c in n.get("children",[])}
anim=next(a for a in d["animations"] if a["name"]=="Mother_GestureTowardsBasket")
channels={c["target"]["node"]:c for c in anim["channels"] if c["target"]["path"]=="rotation"}
times_accessor=anim["samplers"][channels[names["spine_03"]]["sampler"]]["input"]
times=read(times_accessor,1).ravel().astype(float);assert len(times)==105 and np.max(np.abs(times*24-np.arange(1,106)))<.0001
rot={}
for i,c in channels.items():
 s=anim["samplers"][c["sampler"]];t=read(s["input"],1).ravel().astype(float);v=read(s["output"],4)
 assert s.get("interpolation","LINEAR") in ("LINEAR","STEP") and len(v)==len(t)
 rr=R.from_quat(v)
 if s.get("interpolation")=="STEP":assert np.max((rr[0].inv()*rr).magnitude())<1e-6
 rot[i]=Slerp(t,rr)(np.clip(times,t[0],t[-1]))
def local(i,k):
 if i in rot:return rot[i][k]
 n=nodes[i]
 if "matrix" in n:return R.from_matrix(np.asarray(n["matrix"]).reshape(4,4).T[:3,:3])
 return R.from_quat(n.get("rotation",[0,0,0,1]))
def global_q(i,k):
 q=local(i,k)
 while i in parents:i=parents[i];q=local(i,k)*q
 return q
# Soft preparation, sustained counterbalance and release. Right arm only.
# Keep the first and last source poses, and the complete left-hand chain.
frames=times*24
def smooth(x):
 x=np.clip(x,0,1);return x*x*(3-2*x)
env=smooth((frames-8)/38)*smooth((103-frames)/24)
changes=[]
for name,axis,ang in (("clavicle_r",[0,0,1],-.45*env),("upperarm_r",[1,0,0],-2.5*env),("lowerarm_r",[1,0,0],-4.5*env),("hand_r",[1,0,0],1.5*env)):
 i=names[name];c=channels[i];old=c["sampler"];s=anim["samplers"][old]
 base=rot[i];assert len(read(s["output"],4))==2 and np.max((base[0].inv()*base).magnitude())<1e-6
 vals=[]
 for k,a in enumerate(ang):
  local_axis=global_q(i,k).inv().apply(axis)
  q=base[k]*R.from_rotvec(local_axis*math.radians(float(a)))
  x=q.as_quat()
  if vals and np.dot(vals[-1],x)<0:x=-x
  vals.append(x)
 # Preserve exact source quaternion bytes at clip boundaries.
 source=read(s["output"],4);vals[0]=source[0];vals[-1]=source[-1]
 assert np.linalg.norm(vals[0]-vals[-1])<1e-6
 c["sampler"]=len(anim["samplers"]);anim["samplers"].append({"input":times_accessor,"output":add(vals),"interpolation":"LINEAR"})
 changes.append({"name":name,"node":i,"old_sampler":old,"new_sampler":c["sampler"],"peak_degrees":float(np.max(np.abs(ang)))})
d["buffers"][0]["byteLength"]=len(payload);res=encode(d,bytes(payload));q,qb=decode(res)
assert qb[:len(b)]==b
qa=next(a for a in q["animations"] if a["name"]==anim["name"])
for c in qa["channels"]:
 for change in changes:
  if c["target"]=={"node":change["node"],"path":"rotation"}:c["sampler"]=change["old_sampler"]
qa["samplers"]=qa["samplers"][:-len(changes)]
for k in ("accessors","bufferViews"):q[k]=q[k][:len(original[k])]
q["buffers"]=original["buffers"];assert q==original
report={"status":"ART_HOLD_W31D_FREE_ARM_TRIAL","source_sha256":sha(raw),"source_pair_audit_sha256":sha(audit_bytes),"house_sha256":m["house_sha256"],"glb_sha256":sha(res),"glb_bytes":len(res),"geometry_idle_and_non_target_channels_unchanged":True,"gesture_samples":105,"changes":changes,"loop_endpoints_preserved":True}
if out.exists():
 assert (out/"w31d-actor.glb").read_bytes()==res and json.loads((out/"w31d-manifest.json").read_text())==report
 print("W31D_REPRO_PASS",sha(res),flush=True)
else:
 out.mkdir(parents=True);(out/"w31d-actor.glb").write_bytes(res);(out/"w31d-manifest.json").write_text(json.dumps(report,indent=2))
 print("W31D_FREE_ARM_PASS",json.dumps(report),flush=True)
