"""Transfer measured W30b/W30c drape and W30d tunic corrections to exact source GLBs."""
import copy,hashlib,json,os,struct
from pathlib import Path
import numpy as np
def sha(x):return hashlib.sha256(x).hexdigest()
# Reuse the same verified transfer for all three garment studies.
tunic=bool(os.environ.get("HOREB_W30D_OUTPUT"))
shape=bool(os.environ.get("HOREB_W30C_OUTPUT")) and not tunic
variant="w30d" if tunic else "w30c" if shape else "w30b"
source="w30c" if tunic else "w30b" if shape else "w30a"
root=Path(os.environ["HOREB_"+source.upper()+"_OUTPUT"]);out=Path(os.environ["HOREB_"+variant.upper()+"_OUTPUT"])
raw=(root/(source+"-actor.glb")).read_bytes();m=json.loads((root/(source+"-manifest.json")).read_text())
assert sha(raw)==m["glb_sha256"]==("d5b1dc8af5e2dc0156be33b03f78b4c2d91baf2e3c7ea2646e8b8803f965e442" if tunic else "cff945d163c95bd7673e3a5405f55b45168b764eaa412fa7b8b81714f9da6668" if shape else "85c24882620b35154ac9e333c6d37406b457d4d3b05aa07fbc024812b5f0ac35")
assert m["only_drape_positions_normals_changed" if shape or tunic else "only_head_linen_positions_normals_changed"] is True
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
def normals(x,tri):
 face=np.cross(x[tri[:,1]]-x[tri[:,0]],x[tri[:,2]]-x[tri[:,0]])
 accum=np.zeros_like(x)
 for i in range(3):np.add.at(accum,tri[:,i],face)
 norm=np.linalg.norm(accum,axis=1);assert np.all(norm>1e-12)
 return accum/norm[:,None]
changed={}
def update(i,data):
 a=d["accessors"][i];v=d["bufferViews"][a["bufferView"]];assert a["componentType"]==5126 and a.get("byteOffset",0)==0
 assert sum(x["bufferView"]==a["bufferView"] for x in d["accessors"])==1
 data=np.asarray(data,dtype="<f4");assert len(data)==a["count"] and data.nbytes==v["byteLength"] and np.isfinite(data).all()
 o=v.get("byteOffset",0);payload[o:o+data.nbytes]=data.tobytes()
 if "min" in a:a["min"]=data.min(0).tolist()
 if "max" in a:a["max"]=data.max(0).tolist()
 changed[a["bufferView"]]=i
probe_bytes=(out/(variant+"-probe.json")).read_bytes();probe=json.loads(probe_bytes);win=probe["winner"]
assert probe["source_sha256"]==sha(raw) and probe["samples"]==18 and len(win["rows"])==18
assert win["bad_samples"]==win["pairs"]==0
if tunic:
 assert win["params"]==[.10,.008,0,0] and len(probe["baseline"])==18
 assert all(not any(n for k,n in r["pairs"].items() if k!="Stitched_lower_hem") and r["pairs"]["Stitched_lower_hem"]==base["pairs"]["Stitched_lower_hem"] and r["frame"]==base["frame"] and r["clip"]==base["clip"] for r,base in zip(win["rows"],probe["baseline"]))
elif shape:assert win["params"]==[.70,.88,.014,.006,.003]
else:assert win["back_mm"]==30 and win["lift_mm"]==0
if not tunic:assert all(not any(r["pairs"].values()) for r in win["rows"])
delta_bytes=(out/(variant+("-tunic-delta.json" if tunic else "-drape-delta.json"))).read_bytes();data=json.loads(delta_bytes)
p=next(x["primitives"][0] for x in d["meshes"] if x["name"]==("W28e_trunk" if tunic else "W22_linen_rear_drape_geo"));attrs=p["attributes"]
x=read(attrs["POSITION"],3).astype(float);n=read(attrs["NORMAL"],3).astype(float);tri=read(p["indices"],1).reshape(-1,3)
rest=np.array(data["rest"]);delta=np.array(data["delta"])
count=18390 if tunic else 325
assert x.shape==rest.shape==delta.shape==(count,3) and tri.shape==((36332 if tunic else 576),3)
local=x[:,[0,2,1]].copy();local[:,1]*=-1
if tunic:
 from scipy.spatial import cKDTree
 dist,ids=cKDTree(rest).query(local)
 assert len(set(ids))==count and dist.max()<1e-6
else:
 dist=np.linalg.norm(local[:,None,:]-rest[None,:,:],axis=2);ids=dist.argmin(1)
 assert len(set(ids))==count and dist.min(1).max()<1e-6
if tunic:
 assert np.linalg.norm(delta,axis=1).max()<.040 and np.isfinite(delta).all()
 assert not np.any(delta[rest[:,2]<=.24]) and not np.any(delta[rest[:,2]>=.825])
elif shape:
 assert np.linalg.norm(delta,axis=1).max()<.040 and np.isfinite(delta).all()
else:
 assert np.max(np.abs(delta[:,[0,2]]))<1e-7 and delta[:,1].min()>=-1e-7 and delta[:,1].max()<.030001
dp=delta[ids][:,[0,2,1]].copy();dp[:,2]*=-1
v=x+dp;dn=normals(v,tri)-normals(x,tri);nn=n+dn
nn/=np.linalg.norm(nn,axis=1)[:,None];nn[np.linalg.norm(dn,axis=1)<1e-12]=n[np.linalg.norm(dn,axis=1)<1e-12]
update(attrs["POSITION"],v);update(attrs["NORMAL"],nn)
res=encode(d,bytes(payload));q,qb=decode(res)
assert len(changed)==2
for i,bv in enumerate(original["bufferViews"]):
 o=bv.get("byteOffset",0);l=bv["byteLength"]
 if i not in changed:assert b[o:o+l]==qb[o:o+l]
for i in changed.values():q["accessors"][i]=original["accessors"][i]
assert q==original
report={"status":"ART_HOLD_W30D_TUNIC_SHAPE_TRIAL" if tunic else "ART_HOLD_W30C_DRAPE_SHAPE_TRIAL" if shape else "ART_HOLD_W30B_DRAPE_TRIAL","source_sha256":sha(raw),"house_sha256":m["house_sha256"],"glb_sha256":sha(res),"glb_bytes":len(res),"unchanged_views":len(d["bufferViews"])-2,("only_tunic_positions_normals_changed" if tunic else "only_drape_positions_normals_changed"):True,"probe_sha256":sha(probe_bytes),"delta_sha256":sha(delta_bytes),"coarse_samples":18,"max_delta_mm":float(np.linalg.norm(dp,axis=1).max()*1000),"changed_vertices":int((np.linalg.norm(dp,axis=1)>1e-7).sum())}
asset=out/(variant+"-actor.glb");manifest=out/(variant+"-manifest.json")
if asset.exists():
 assert asset.read_bytes()==res and json.loads(manifest.read_text())==report
 print(variant.upper()+"_REPRO_PASS",sha(res),flush=True)
else:
 asset.write_bytes(res);manifest.write_text(json.dumps(report,indent=2))
 print(variant.upper()+"_TRANSFER_PASS",json.dumps(report),flush=True)
