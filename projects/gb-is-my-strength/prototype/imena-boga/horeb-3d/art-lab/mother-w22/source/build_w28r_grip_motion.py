"""W28r motion trial: transfer verified imported finger pose into exact GLB channels.
Validate coordinate conversion against imported source pose before writing any candidate.
"""
import bpy,hashlib,json,math,os,struct,bisect
from pathlib import Path
from mathutils import Quaternion,Matrix,Vector
import numpy as np
def sha(b):return hashlib.sha256(b).hexdigest()
root=Path(os.environ["HOREB_W28Q_OUTPUT"]);out=Path(os.environ["HOREB_W28R_OUTPUT"])
raw=(root/"w28q-actor.glb").read_bytes();probe=json.loads((out/"w28r-grip-probe.json").read_text(encoding="utf8"))
assert sha(raw)==probe["source_sha256"]=="6bb286037d794b0830840dd709ba257d5a3e722540665f6527b782338f8499cd"
assert probe["frame"]==60 and not probe["best"]["prop_hits"]
def decode(b):
 assert struct.unpack_from("<4sII",b)==(b"glTF",2,len(b))
 n,t=struct.unpack_from("<I4s",b,12);assert t==b"JSON"
 z,t=struct.unpack_from("<I4s",b,20+n);assert t==b"BIN\0" and len(b)==28+n+z
 return json.loads(b[20:20+n]),b[28+n:]
def encode(d,b):
 j=json.dumps(d,separators=(",",":"),ensure_ascii=False).encode();j+=b" "*(-len(j)%4);b+=b"\0"*(-len(b)%4)
 return struct.pack("<4sII",b"glTF",2,28+len(j)+len(b))+struct.pack("<I4s",len(j),b"JSON")+j+struct.pack("<I4s",len(b),b"BIN\0")+b
d,b=decode(raw);original=json.loads(json.dumps(d));payload=bytearray(b)
def read(i,dim):
 a=d["accessors"][i];v=d["bufferViews"][a["bufferView"]]
 assert a["componentType"]==5126 and v.get("byteStride",dim*4)==dim*4 and not a.get("sparse")
 return np.frombuffer(b,dtype="<f4",count=a["count"]*dim,offset=v.get("byteOffset",0)+a.get("byteOffset",0)).reshape(-1,dim).copy()
def add(data,typ,dim):
 a=np.asarray(data,dtype="<f4").reshape(-1,dim);assert np.isfinite(a).all()
 payload.extend(b"\0"*(-len(payload)%4));i=len(d["bufferViews"])
 d["bufferViews"].append({"buffer":0,"byteOffset":len(payload),"byteLength":a.nbytes});payload.extend(a.tobytes())
 j=len(d["accessors"]);d["accessors"].append({"bufferView":i,"componentType":5126,"count":len(a),"type":typ,"min":a.min(0).tolist(),"max":a.max(0).tolist()});return j
def qxy(a):return Quaternion((float(a[3]),float(a[0]),float(a[1]),float(a[2]))).normalized()
# mathutils Quaternion subtraction is not guaranteed on all Blender builds.
def qerror(q,r):return min(math.sqrt(sum((a-b)**2 for a,b in zip(q,r))),math.sqrt(sum((a+b)**2 for a,b in zip(q,r))))
nodes=d["nodes"];parents={c:i for i,n in enumerate(nodes) for c in n.get("children",[])}
anim=next(a for a in d["animations"] if a["name"]=="Mother_GestureTowardsBasket")
rotations={c["target"]["node"]:c for c in anim["channels"] if c["target"]["path"]=="rotation"}
def sampler(c):
 s=anim["samplers"][c["sampler"]];mode=s.get("interpolation","LINEAR");assert mode in ("LINEAR","STEP")
 ts=read(s["input"],1).ravel();qs=[qxy(v) for v in read(s["output"],4)]
 assert len(ts)==len(qs) and all(a<b for a,b in zip(ts,ts[1:]))
 if mode=="STEP":assert all(qerror(qs[0],q)<1e-7 for q in qs),"Nonconstant STEP channel"
 return ts,qs
data={i:sampler(c) for i,c in rotations.items()}
def interp(ts,qs,t):
 if t<=ts[0]:return qs[0].copy()
 if t>=ts[-1]:return qs[-1].copy()
 j=bisect.bisect_right(ts,t);return qs[j-1].slerp(qs[j],float((t-ts[j-1])/(ts[j]-ts[j-1])))
def local(i,t=None):
 n=nodes[i]
 if "matrix" in n:
  assert i not in rotations
  return Matrix(n["matrix"]).transposed().to_quaternion().normalized()
 return interp(*data[i],t) if t is not None and i in data else qxy(n.get("rotation",[0,0,0,1]))
def global_q(i,t=None):
 q=local(i,t)
 while i in parents:
  i=parents[i];q=local(i,t)@q
 return q.normalized()
bpy.ops.wm.read_factory_settings(use_empty=True);scene=bpy.context.scene;scene.render.fps=24
bpy.ops.import_scene.gltf(filepath=str(root/"w28q-actor.glb"),merge_vertices=True)
rig=next(o for o in bpy.data.objects if o.type=="ARMATURE");ad=rig.animation_data;track=next(t for t in ad.nla_tracks if t.name==anim["name"])
ad.use_nla=False;ad.action=track.strips[0].action;ad.action_slot=track.strips[0].action_slot
scene.frame_set(60);bpy.context.view_layer.update()
C=Quaternion((1,0,0),math.pi/2)
# glTF (x,y,z) -> Blender (x,-z,y); +90 degrees about X.
names={n["name"]:i for i,n in enumerate(nodes) if "name" in n}
deltas={};expect={};mapping_error=0.
for name,val in probe["local_quaternions"].items():
 p=rig.pose.bones[name];base=Quaternion(probe["baseline_local_quaternions"][name]).normalized();best=Quaternion(val).normalized()
 assert qerror(p.rotation_quaternion.normalized(),base)<1e-5,(name,"probe base mismatch")
 i=names[name];assert i in rotations
 k=(C@global_q(i)).inverted()@(rig.matrix_world@p.bone.matrix_local).to_quaternion()
 predicted=C@global_q(i,60/24)@k
 err=qerror(predicted.normalized(),(rig.matrix_world@p.matrix).to_quaternion().normalized())
 assert err<.0002,(name,"import rotation mapping",err)
 mapping_error=max(mapping_error,err)
 delta=(base.inverted()@best).normalized()
 if qerror(delta,Quaternion())>1e-6:
  deltas[i]=(k@delta@k.inverted()).normalized()
  expect[name]=list(best)
assert deltas
def ease(x):
 x=max(0.,min(1.,x));return x*x*(3-2*x)
def envelope(f):return ease((f-35)/13)*ease((90-f)/19)
changes=[]
for i,delta in deltas.items():
 c=rotations[i];ts,qs=data[i]
 assert all(abs(float(t)*24-round(float(t)*24))<1e-4 for t in ts),(nodes[i]["name"],"noninteger source time")
 assert ts[0]>=-1e-6 and ts[-1]<=105/24+1e-5
 # Union original knot times with full integer samples. Unchanged outside the envelope.
 frames=sorted(set(range(1,106))|{round(float(t)*24) for t in ts})
 times=np.array(frames,dtype=float)/24
 vals=[]
 for f,t in zip(frames,times):
  q=interp(ts,qs,t)@Quaternion().slerp(delta,envelope(f));q.normalize()
  if vals and sum(a*b for a,b in zip(vals[-1],(q.x,q.y,q.z,q.w)))<0:q.negate()
  vals.append((q.x,q.y,q.z,q.w))
 old=c["sampler"];c["sampler"]=len(anim["samplers"])
 anim["samplers"].append({"input":add(times,"SCALAR",1),"output":add(vals,"VEC4",4),"interpolation":"LINEAR"})
 changes.append({"node":i,"name":nodes[i]["name"],"old_sampler":old,"new_sampler":c["sampler"]})
d["buffers"][0]["byteLength"]=len(payload);result=encode(d,bytes(payload))
check,rb=decode(result);assert rb[:len(b)]==b
a=next(a for a in check["animations"] if a["name"]==anim["name"])
for c in a["channels"]:
 for x in changes:
  if c["target"]["node"]==x["node"] and c["target"]["path"]=="rotation":c["sampler"]=x["old_sampler"]
a["samplers"]=a["samplers"][:-len(changes)]
for k in ("accessors","bufferViews"):check[k]=check[k][:len(original[k])]
check["buffers"]=original["buffers"];assert check==original
asset=out/"w28r-actor.glb";manifest=out/"w28r-manifest.json"
assert not asset.exists() and not manifest.exists()
asset.write_bytes(result)
# Verify real reimport against the optimized Blender quaternions.
bpy.ops.wm.read_factory_settings(use_empty=True);scene=bpy.context.scene;scene.render.fps=24
bpy.ops.import_scene.gltf(filepath=str(asset),merge_vertices=True)
rig=next(o for o in bpy.data.objects if o.type=="ARMATURE");ad=rig.animation_data;track=next(t for t in ad.nla_tracks if t.name==anim["name"])
ad.use_nla=False;ad.action=track.strips[0].action;ad.action_slot=track.strips[0].action_slot
scene.frame_set(60);bpy.context.view_layer.update()
peak_error=max(qerror(rig.pose.bones[n].rotation_quaternion.normalized(),Quaternion(q).normalized()) for n,q in expect.items())
assert peak_error<.0002,peak_error
report={"status":"ART_HOLD_W28R_GRIP_MOTION_TRIAL","source_sha256":sha(raw),"glb_sha256":sha(result),"glb_bytes":len(result),"house_sha256":probe["house_sha256"],"probe_sha256":sha((out/"w28r-grip-probe.json").read_bytes()),"changed_rotation_channels":changes,"envelope_frames":[35,48,71,90],"peak_quaternion_error":peak_error,"import_mapping_error":mapping_error,"facial_animation_unchanged":True,"geometry_unchanged":True,"non_target_bone_channels_unchanged":True,"changed_bone_names":[x["name"] for x in changes]}
manifest.write_text(json.dumps(report,indent=2),encoding="utf8")
print("W28R_MOTION_REIMPORT_PASS",sha(result),len(changes),peak_error,mapping_error,flush=True)
