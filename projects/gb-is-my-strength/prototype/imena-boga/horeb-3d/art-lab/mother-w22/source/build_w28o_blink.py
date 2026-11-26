"""W28o blink feasibility study using external MPFB 2.0.18 expression targets.
No MPFB code or target files are redistributed. Keep ART HOLD pending asset licensing and visual QA.
"""
import bpy, gzip, hashlib, json, math, os, struct
from pathlib import Path
import numpy as np
from mathutils import Vector,kdtree
def sha(b):return hashlib.sha256(b).hexdigest()
def decode(raw):
 n,t=struct.unpack_from("<I4s",raw,12);assert t==b"JSON"
 m,t=struct.unpack_from("<I4s",raw,20+n);assert t==b"BIN\0" and len(raw)==28+n+m
 assert struct.unpack_from("<4sII",raw)==(b"glTF",2,len(raw))
 return json.loads(raw[20:20+n]),raw[28+n:]
def encode(d,b):
 j=json.dumps(d,separators=(",",":"),ensure_ascii=False).encode();j+=b" "*(-len(j)%4);b+=b"\0"*(-len(b)%4)
 return struct.pack("<4sII",b"glTF",2,28+len(j)+len(b))+struct.pack("<I4s",len(j),b"JSON")+j+struct.pack("<I4s",len(b),b"BIN\0")+b
root=Path(os.environ["HOREB_W28N_OUTPUT"]);out=Path(os.environ["HOREB_W28O_OUTPUT"])
mpfb=Path(os.environ["HOREB_MPFB_ROOT"]);targetdir=mpfb/"data/targets/expression/units"
assert 'version = "2.0.18"' in (mpfb/"blender_manifest.toml").read_text(encoding="utf8")
m=json.loads((root/"w28n-eye-manifest.json").read_text(encoding="utf8"));raw=(root/"w28n-actor.glb").read_bytes()
assert sha(raw)==m["glb_sha256"]=="70cd23b9029efcd1357a9211ce7ab651d8b816438f20ad0c198fdbf7bd042741"
assert m["geometry_and_motion_unchanged"] is True
gm=json.loads((Path(os.environ["HOREB_W28G_OUTPUT"])/"w28g-manifest.json").read_text(encoding="utf8"))
assert sha(Path(bpy.data.filepath).read_bytes())==gm["blend_sha256"]
d,b=decode(raw);original=json.loads(json.dumps(d));payload=bytearray(b)
def read(i,dim,ctype=5126):
 a=d["accessors"][i];v=d["bufferViews"][a["bufferView"]];typ={5126:"<f4",5123:"<u2"}[ctype]
 assert a["componentType"]==ctype and v.get("byteStride",np.dtype(typ).itemsize*dim)==np.dtype(typ).itemsize*dim
 return np.frombuffer(b,dtype=typ,count=a["count"]*dim,offset=v.get("byteOffset",0)+a.get("byteOffset",0)).reshape(-1,dim).copy()
def append(a,typ,dim,target=None):
 a=np.asarray(a,dtype="<f4").reshape(-1,dim);assert np.isfinite(a).all()
 payload.extend(b"\0"*(-len(payload)%4));i=len(d["bufferViews"])
 v={"buffer":0,"byteOffset":len(payload),"byteLength":a.nbytes}
 if target:v["target"]=target
 d["bufferViews"].append(v);payload.extend(a.tobytes());j=len(d["accessors"])
 d["accessors"].append({"bufferView":i,"componentType":5126,"count":len(a),"type":typ,"min":a.min(0).tolist(),"max":a.max(0).tolist()})
 return j
node=next(i for i,n in enumerate(d["nodes"]) if n.get("name")=="ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0")
mesh=d["meshes"][d["nodes"][node]["mesh"]];assert len(mesh["primitives"])==1 and "weights" not in mesh
p=mesh["primitives"][0];assert "targets" not in p
pos=read(p["attributes"]["POSITION"],3).astype(float);tri=read(p["indices"],1,5123).reshape(-1,3)
assert len(pos)==14517 and len(tri)==26756
o=bpy.data.objects["ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0"];ks=o.data.shape_keys.key_blocks
coords=[v.co.copy() for v in ks[0].data]
for k in list(ks)[1:]:
 for i,v in enumerate(k.data):coords[i]+=(v.co-ks[0].data[i].co)*k.value
tree=kdtree.KDTree(len(coords))
for i,c in enumerate(coords):tree.insert(c,i)
tree.balance()
matches=[tree.find(Vector((x,-z,y))) for x,y,z in pos]
assert max(t[2] for t in matches)<1e-6
ids=np.array([t[1] for t in matches]);scale=float(o["MPFB_GEN_scale_factor"]);assert abs(scale-.1)<1e-6
presets=("african","asian","caucasian")
weights=np.array([float(o["MPFB_HUM_"+a]) for a in presets]);weights/=weights.sum()
# Verify source mesh identity and per-vertex normals by pooling UV seam duplicates.
def normals(x):
 face=np.cross(x[tri[:,1]]-x[tri[:,0]],x[tri[:,2]]-x[tri[:,0]])
 accum=np.zeros((len(coords),3))
 for i in range(3):np.add.at(accum,ids[tri[:,i]],face)
 v=accum[ids];length=np.linalg.norm(v,axis=1)
 return np.divide(v,length[:,None],out=np.zeros_like(v),where=length[:,None]>1e-12)
base_normals=normals(pos);targets=[];stats=[];sources={}
for side in ("left","right"):
 full=np.zeros((len(coords),3))
 for folder,w in zip(presets,weights):
  f=targetdir/folder/f"eye-{side}-closure.target.gz";sources[str(f.relative_to(mpfb))]=sha(f.read_bytes())
  seen=set()
  for line in gzip.open(f,"rt"):
   if not line.strip() or line.startswith("#"):continue
   i,x,y,z=line.split();i=int(i);assert 0<=i<len(coords) and i not in seen;seen.add(i)
   full[i]+=np.array([float(x),float(y),float(z)])*scale*w
 dp=full[ids];affected=np.linalg.norm(dp,axis=1)>1e-9
 assert 100<=affected.sum()<=150
 assert np.max(np.linalg.norm(dp,axis=1))<.015
 assert np.all((pos[affected,1]>1.40)&(pos[affected,1]<1.48)&(np.abs(pos[affected,0])<.065))
 dn=normals(pos+dp)-base_normals
 targets.append({"POSITION":append(dp,"VEC3",3,34962),"NORMAL":append(dn,"VEC3",3,34962)})
 stats.append({"side":side,"vertices":int(affected.sum()),"max_delta_mm":float(np.max(np.linalg.norm(dp,axis=1))*1000)})
p["targets"]=targets;mesh["weights"]=[0,0];mesh.setdefault("extras",{})["targetNames"]=["blink_left","blink_right"]
events={"Mother_QuietIdle":[34,110],"Mother_GestureTowardsBasket":[12,91]}
def blink(frame,center):
 # 2 frames closing, 1-frame full closure, 3 frames opening.
 x=frame-center
 if x< -2 or x>4:return 0.
 if x<0:t=(x+2)/2
 elif x<=1:return 1.
 else:t=(4-x)/3
 return t*t*(3-2*t)
for a in d["animations"]:
 name=a["name"];count=144 if name=="Mother_QuietIdle" else 105
 frames=np.arange(1,count+1);t=append(frames/24,"SCALAR",1)
 vals=np.array([[max(blink(f,c) for c in events[name])]*2 for f in frames])
 assert vals[0].max()==vals[-1].max()==0 and vals.max()==1
 i=len(a["samplers"]);a["samplers"].append({"input":t,"output":append(vals.reshape(-1),"SCALAR",1),"interpolation":"LINEAR"})
 a["channels"].append({"sampler":i,"target":{"node":node,"path":"weights"}})
d["buffers"][0]["byteLength"]=len(payload);result=encode(d,bytes(payload))
q,rb=decode(result);assert rb[:len(b)]==b
qm=q["meshes"][q["nodes"][node]["mesh"]];qm["primitives"][0].pop("targets");qm.pop("weights");qm["extras"].pop("targetNames")
if "extras" not in original["meshes"][q["nodes"][node]["mesh"]]:qm.pop("extras")
for a in q["animations"]:a["samplers"].pop();a["channels"].pop()
for k in ("accessors","bufferViews"):q[k]=q[k][:len(original[k])]
q["buffers"]=original["buffers"];assert q==original
report={"status":"ART_HOLD_W28O_BLINK_TRIAL","source_sha256":sha(raw),"glb_sha256":sha(result),"glb_bytes":len(result),"house_sha256":m["house_sha256"],"source_blend_sha256":gm["blend_sha256"],"mpfb_version":"2.0.18","external_asset_hashes":sources,"asset_license_review":"Required before distribution","mapped_vertices":len(pos),"blink_morphs":stats,"events":events,"bone_animation_unchanged":True}
if out.exists():
 assert (out/"w28o-actor.glb").read_bytes()==result and json.loads((out/"w28o-blink-manifest.json").read_text())==report
 print("W28O_REPRODUCIBLE",sha(result))
else:
 out.mkdir(parents=True);(out/"w28o-actor.glb").write_bytes(result);(out/"w28o-blink-manifest.json").write_text(json.dumps(report,indent=2),encoding="utf8")
 print("W28O_BLINK_PASS",sha(result),json.dumps(stats),len(result))
