"""Transfer the measured native shoulder correction to the exact W28o export.
Only garment position/normal accessors change; facial morphs and skeletal animation remain exact.
"""
import bpy,hashlib,json,os,struct
from pathlib import Path
import numpy as np
from mathutils import Vector,kdtree
def sha(b):return hashlib.sha256(b).hexdigest()
g=Path(os.environ["HOREB_W28G_OUTPUT"]);o=Path(os.environ["HOREB_W28O_OUTPUT"]);q=Path(os.environ["HOREB_W28Q_OUTPUT"])
gm=json.loads((g/"w28g-manifest.json").read_text(encoding="utf8"));om=json.loads((o/"w28o-blink-manifest.json").read_text(encoding="utf8"))
raw=(o/"w28o-actor.glb").read_bytes()
assert sha(raw)==om["glb_sha256"]=="a4c2bad8ee870766717151369ce3de6cda2fdaddc17bf14e43741d4c79397f74"
assert sha(Path(bpy.data.filepath).read_bytes())==gm["blend_sha256"]
audit=json.loads((o/"w28o-glb-audit.json").read_text(encoding="utf8"))
assert audit["actor_sha256"]==sha(raw) and audit["house_sha256"]==om["house_sha256"]
assert len(audit["clips"])==2 and [len(c["rows"]) for c in audit["clips"]]==[417,144] and all(not c["bad"] for c in audit["clips"])
probe=json.loads((q/"w28q-shoulder-probe.json").read_text(encoding="utf8"));win=probe["winner"]
assert probe["source_blend_sha256"]==gm["blend_sha256"] and probe["samples_per_candidate"]==18
assert win["drop_mm"]==24 and win["depth_mm"]==16 and win["bad_count"]==0 and len(win["rows"])==18
assert all(not (r["skin"] or r["sash"] or r["self"]) for r in win["rows"])
delta=np.array(json.loads((q/"w28q-shoulder-delta.json").read_text(encoding="utf8")),dtype=float)
assert delta.shape==(18390,3) and np.isfinite(delta).all()
assert (np.linalg.norm(delta,axis=1)>1e-7).sum()==win["changed_vertices"]
assert abs(np.linalg.norm(delta,axis=1).max()*1000-win["max_delta_mm"])<.001
def decode(b):
 magic,version,total=struct.unpack_from("<4sII",b);assert (magic,version,total)==(b"glTF",2,len(b))
 n,t=struct.unpack_from("<I4s",b,12);assert t==b"JSON"
 z,t=struct.unpack_from("<I4s",b,20+n);assert t==b"BIN\0" and len(b)==28+n+z
 return json.loads(b[20:20+n]),b[28+n:]
def encode(d,b):
 j=json.dumps(d,separators=(",",":"),ensure_ascii=False).encode();j+=b" "*(-len(j)%4);b+=b"\0"*(-len(b)%4)
 return struct.pack("<4sII",b"glTF",2,28+len(j)+len(b))+struct.pack("<I4s",len(j),b"JSON")+j+struct.pack("<I4s",len(b),b"BIN\0")+b
d,b=decode(raw);original=json.loads(json.dumps(d));payload=bytearray(b)
p=next(m for m in d["meshes"] if m["name"]=="W28e_trunk")["primitives"][0]
old={k:p["attributes"][k] for k in ("POSITION","NORMAL")}
def read(i,dim,ctype=5126):
 a=d["accessors"][i];v=d["bufferViews"][a["bufferView"]];typ={5126:"<f4",5123:"<u2"}[ctype]
 assert a["componentType"]==ctype and v.get("byteStride",np.dtype(typ).itemsize*dim)==np.dtype(typ).itemsize*dim
 return np.frombuffer(b,dtype=typ,count=a["count"]*dim,offset=v.get("byteOffset",0)+a.get("byteOffset",0)).reshape(-1,dim).copy()
pos=read(old["POSITION"],3).astype(float);nor=read(old["NORMAL"],3).astype(float);tri=read(p["indices"],1,5123).reshape(-1,3)
assert pos.shape==(18390,3) and tri.shape==(36332,3)
dress=bpy.data.objects["W28e_tailored_linen"]
tree=kdtree.KDTree(len(dress.data.vertices))
for v in dress.data.vertices:tree.insert(v.co,v.index)
tree.balance()
matches=[tree.find(Vector((x,-z,y))) for x,y,z in pos]
assert max(t[2] for t in matches)<1e-6
ids=np.array([t[1] for t in matches]);assert len(set(ids))==18390
dp=delta[ids][:,[0,2,1]];dp[:,2]*=-1
newpos=pos+dp
def normals(x):
 face=np.cross(x[tri[:,1]]-x[tri[:,0]],x[tri[:,2]]-x[tri[:,0]])
 accum=np.zeros_like(x)
 for i in range(3):np.add.at(accum,tri[:,i],face)
 norm=np.linalg.norm(accum,axis=1);assert np.all(norm>1e-12)
 return accum/norm[:,None]
dn=normals(newpos)-normals(pos);newnor=nor+dn;newnor/=np.linalg.norm(newnor,axis=1)[:,None]
affected=np.linalg.norm(dn,axis=1)>1e-10;newnor[~affected]=nor[~affected]
def append(data):
 a=np.asarray(data,dtype="<f4");assert np.isfinite(a).all()
 payload.extend(b"\0"*(-len(payload)%4));i=len(d["bufferViews"])
 d["bufferViews"].append({"buffer":0,"byteOffset":len(payload),"byteLength":a.nbytes,"target":34962});payload.extend(a.tobytes())
 j=len(d["accessors"]);d["accessors"].append({"bufferView":i,"componentType":5126,"count":len(a),"type":"VEC3","min":a.min(0).tolist(),"max":a.max(0).tolist()});return j
p["attributes"]["POSITION"]=append(newpos);p["attributes"]["NORMAL"]=append(newnor)
d["buffers"][0]["byteLength"]=len(payload);result=encode(d,bytes(payload))
r,rb=decode(result);assert rb[:len(b)]==b
rp=next(m for m in r["meshes"] if m["name"]=="W28e_trunk")["primitives"][0]
rp["attributes"].update(old)
for k in ("accessors","bufferViews"):r[k]=r[k][:len(original[k])]
r["buffers"]=original["buffers"];assert r==original
report={"status":"ART_HOLD_W28Q_SHOULDER_TRIAL","source_sha256":sha(raw),"glb_sha256":sha(result),"glb_bytes":len(result),"house_sha256":om["house_sha256"],"bone_animation_unchanged":True,"facial_animation_unchanged":True,"mapped_vertices":om["mapped_vertices"],"events":om["events"],"blink_morphs":om["blink_morphs"],"garment_mapped_vertices":len(ids),"changed_vertices":win["changed_vertices"],"params_mm":[24,16],"coarse_probe_sha256":sha((q/"w28q-shoulder-probe.json").read_bytes()),"delta_sha256":sha((q/"w28q-shoulder-delta.json").read_bytes())}
asset=q/"w28q-actor.glb";manifest=q/"w28q-manifest.json"
if asset.exists():
 assert asset.read_bytes()==result and json.loads(manifest.read_text(encoding="utf8"))==report
 print("W28Q_REPRODUCIBLE",sha(result),flush=True)
else:
 asset.write_bytes(result);manifest.write_text(json.dumps(report,indent=2),encoding="utf8")
 print("W28Q_EXACT_TRANSFER_PASS",sha(result),len(result),len(ids),win["changed_vertices"],flush=True)
