"""W30a: soften the authored head linen and rear drape on W29d.
This is a silhouette study, not a cloth simulation or production acceptance.
"""
import copy,hashlib,json,math,os,struct
from pathlib import Path
import numpy as np
def sha(x):return hashlib.sha256(x).hexdigest()
root=Path(os.environ["HOREB_W29D_OUTPUT"]);out=Path(os.environ["HOREB_W30A_OUTPUT"])
raw=(root/"w29d-actor.glb").read_bytes();m=json.loads((root/"w29d-manifest.json").read_text())
assert sha(raw)==m["glb_sha256"]=="18cb0e76a90a272df9a080c0145f8d3465e3ab13e817c52f7deb291cfe655c44"
assert m["all_geometry_animation_unchanged"] is True
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
 a=d["accessors"][i];v=d["bufferViews"][a["bufferView"]];typ={5126:"<f4",5123:"<u2",5125:"<u4"}[a["componentType"]]
 assert v.get("byteStride",np.dtype(typ).itemsize*k)==np.dtype(typ).itemsize*k
 return np.frombuffer(b,dtype=typ,count=a["count"]*k,offset=v.get("byteOffset",0)+a.get("byteOffset",0)).reshape(-1,k).copy()
def smooth(x):
 t=np.clip(x,0,1);return t*t*(3-2*t)
def normals(x,tri):
 face=np.cross(x[tri[:,1]]-x[tri[:,0]],x[tri[:,2]]-x[tri[:,0]])
 accum=np.zeros_like(x)
 for i in range(3):np.add.at(accum,tri[:,i],face)
 norm=np.linalg.norm(accum,axis=1);assert np.all(norm>1e-12)
 return accum/norm[:,None]
changed={};reports=[]
def update(i,data):
 a=d["accessors"][i];v=d["bufferViews"][a["bufferView"]];assert a["componentType"]==5126 and a.get("byteOffset",0)==0
 assert sum(x["bufferView"]==a["bufferView"] for x in d["accessors"])==1
 data=np.asarray(data,dtype="<f4");assert len(data)==a["count"] and data.nbytes==v["byteLength"] and np.isfinite(data).all()
 o=v.get("byteOffset",0);payload[o:o+data.nbytes]=data.tobytes()
 if "min" in a:a["min"]=data.min(0).tolist()
 if "max" in a:a["max"]=data.max(0).tolist()
 changed[a["bufferView"]]=i
for name,count in (("W22_plain_linen_head_cover_geo",624),("W22_linen_rear_drape_geo",325)):
 p=next(x["primitives"][0] for x in d["meshes"] if x["name"]==name);attrs=p["attributes"]
 x=read(attrs["POSITION"],3).astype(float);n=read(attrs["NORMAL"],3).astype(float);tri=read(p["indices"],1).reshape(-1,3)
 assert len(x)==count and not p.get("targets")
 a,y,z=x.T;v=x.copy()
 if count==624:
  # Folds run from the crown toward the sides; no periodic high-frequency noise.
  zz=z-.026;angle=np.arctan2(zz,a);r=np.hypot(a/.101,zz/.107)
  rim=smooth((r-.55)/.43);crown=smooth(r/.65)
  wave=.5+.5*np.cos(5*angle+.38*np.sin(2*angle)+.9*(1-r))
  # The two garments have an existing clearance seam in the rear quadrant.
  # Preserve its original positions, rather than asking the audit to excuse overlap.
  free=smooth((np.sin(angle)-.05)/.60)
  rad=.0032*wave*crown*free
  v[:,0]+=rad*np.cos(angle);v[:,2]+=rad*np.sin(angle)
  # Lift the central forehead edge slightly, lower side edges, leave rear attachment alone.
  front=smooth((np.sin(angle)-.10)/.80)
  side=smooth((np.abs(np.cos(angle))-.45)/.45)
  v[:,1]+=rim*free*(.003*front-.004*side*(.35+.65*wave))
 else:
  # Broad longitudinal folds grow away from the head attachment.
  t=smooth((1.395-y)/.19);u=np.clip(a/.122,-1,1)
  wave=.5+.5*np.cos(3*math.pi*u+.42*np.sin(3*t))
  v[:,2]-=.007*t*wave
  v[:,1]+=.003*t*(1-u*u)*np.cos(2*math.pi*u)
 delta=v-x;dn=normals(v,tri)-normals(x,tri);nn=n+dn
 nn/=np.linalg.norm(nn,axis=1)[:,None];nn[np.linalg.norm(dn,axis=1)<1e-12]=n[np.linalg.norm(dn,axis=1)<1e-12]
 update(attrs["POSITION"],v);update(attrs["NORMAL"],nn)
 reports.append({"mesh":name,"vertices":count,"changed_vertices":int((np.linalg.norm(delta,axis=1)>1e-7).sum()),"max_delta_mm":float(np.linalg.norm(delta,axis=1).max()*1000)})
res=encode(d,bytes(payload));q,qb=decode(res)
assert len(changed)==4
for i,v in enumerate(original["bufferViews"]):
 o=v.get("byteOffset",0);l=v["byteLength"]
 if i not in changed:assert b[o:o+l]==qb[o:o+l]
for i in changed.values():q["accessors"][i]=original["accessors"][i]
assert q==original
report={"status":"ART_HOLD_W30A_HEAD_LINEN_TRIAL","source_sha256":sha(raw),"house_sha256":m["house_sha256"],"glb_sha256":sha(res),"glb_bytes":len(res),"unchanged_views":len(d["bufferViews"])-4,"only_head_linen_positions_normals_changed":True,"changes":reports}
if out.exists():
 assert (out/"w30a-actor.glb").read_bytes()==res and json.loads((out/"w30a-manifest.json").read_text())==report
 print("W30A_REPRO_PASS",sha(res),flush=True)
else:
 out.mkdir(parents=True);(out/"w30a-actor.glb").write_bytes(res);(out/"w30a-manifest.json").write_text(json.dumps(report,indent=2),encoding="utf8")
 print("W30A_SHAPE_PASS",json.dumps(report),flush=True)
