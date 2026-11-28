"""W31a: subtle idle chest and shoulder motion. Preserve the entire gesture clip."""
import copy,hashlib,json,math,os,struct
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R,Slerp
def sha(x):return hashlib.sha256(x).hexdigest()
root=Path(os.environ["HOREB_W30E_OUTPUT"]);out=Path(os.environ["HOREB_W31A_OUTPUT"])
raw=(root/"w30e-actor.glb").read_bytes();m=json.loads((root/"w30e-manifest.json").read_text())
audit_bytes=(root/"w30e-glb-audit.json").read_bytes();audit=json.loads(audit_bytes)
assert sha(raw)==m["glb_sha256"]==audit["actor_sha256"]=="af19f098d2eac791453745181bde30ca51df8565bbec946b5dd8b68cec9b0669"
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
 x=np.asarray(x,dtype="<f4");assert x.shape==(144,4) and np.isfinite(x).all()
 payload.extend(b"\0"*(-len(payload)%4));v=len(d["bufferViews"]);d["bufferViews"].append({"buffer":0,"byteOffset":len(payload),"byteLength":x.nbytes});payload.extend(x.tobytes())
 i=len(d["accessors"]);d["accessors"].append({"bufferView":v,"componentType":5126,"count":len(x),"type":"VEC4","min":x.min(0).tolist(),"max":x.max(0).tolist()});return i
nodes=d["nodes"];names={n["name"]:i for i,n in enumerate(nodes) if "name" in n};parents={c:i for i,n in enumerate(nodes) for c in n.get("children",[])}
anim=next(a for a in d["animations"] if a["name"]=="Mother_QuietIdle")
channels={c["target"]["node"]:c for c in anim["channels"] if c["target"]["path"]=="rotation"}
times_accessor=anim["samplers"][channels[names["spine_03"]]["sampler"]]["input"]
times=read(times_accessor,1).ravel().astype(float);assert len(times)==144 and np.max(np.abs(times*24-np.arange(1,145)))<.0001
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
# One gentle breath over the six-second loop. Small shoulder rise and chest
# pitch, with a separate balanced torso turn; no pelvis/root/foot displacement.
phase=np.linspace(0,2*np.pi,144);breath=(1-np.cos(phase))/2
sway=np.sin(phase)*(1-np.cos(phase))/2
changes=[]
for name,axis,ang in (("spine_02",[1,0,0],.65*breath),("spine_01",[0,1,0],.48*sway),("clavicle_l",[0,0,1],.75*breath),("clavicle_r",[0,0,1],-.75*breath)):
 i=names[name];c=channels[i];old=c["sampler"];s=anim["samplers"][old]
 base=rot[i];assert len(read(s["output"],4))==2 and np.max((base[0].inv()*base).magnitude())<1e-6
 # Verify the clavicle's lateral direction instead of assuming anatomical sign.
 if name.startswith("clavicle"):
  arm=names["upperarm_"+name[-1]];assert parents[arm]==i
  direction=global_q(i,0).apply(nodes[arm]["translation"])
  ang=np.abs(ang)*np.sign(direction[0]);assert abs(direction[0])>.01
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
report={"status":"ART_HOLD_W31A_IDLE_MOTION_TRIAL","source_sha256":sha(raw),"source_pair_audit_sha256":sha(audit_bytes),"house_sha256":m["house_sha256"],"glb_sha256":sha(res),"glb_bytes":len(res),"geometry_gesture_and_other_channels_unchanged":True,"idle_samples":144,"changes":changes,"loop_endpoints_preserved":True}
if out.exists():
 assert (out/"w31a-actor.glb").read_bytes()==res and json.loads((out/"w31a-manifest.json").read_text())==report
 print("W31A_REPRO_PASS",sha(res),flush=True)
else:
 out.mkdir(parents=True);(out/"w31a-actor.glb").write_bytes(res);(out/"w31a-manifest.json").write_text(json.dumps(report,indent=2))
 print("W31A_IDLE_PASS",json.dumps(report),flush=True)
