"""Compare actual W28/W28c GLB motion channels independently of Blender."""
import json,struct,hashlib,math,os
from pathlib import Path
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def load(path):
 b=path.read_bytes();assert struct.unpack_from("<4sII",b)==(b"glTF",2,len(b))
 n,kind=struct.unpack_from("<I4s",b,12);assert kind==b"JSON"
 d=json.loads(b[20:20+n]);m,kind=struct.unpack_from("<I4s",b,20+n);assert kind==b"BIN\0"
 raw=b[28+n:28+n+m]
 def read(i):
  a=d["accessors"][i];v=d["bufferViews"][a["bufferView"]];assert v.get("buffer",0)==0 and "sparse" not in a
  count={"SCALAR":1,"VEC2":2,"VEC3":3,"VEC4":4,"MAT4":16}[a["type"]]
  fmt={5126:"f",5125:"I",5123:"H",5121:"B"}[a["componentType"]]
  size=struct.calcsize("<"+fmt*count);stride=v.get("byteStride",size)
  off=v.get("byteOffset",0)+a.get("byteOffset",0)
  return [struct.unpack_from("<"+fmt*count,raw,off+j*stride) for j in range(a["count"])]
 clips={}
 for a in d["animations"]:
  channels={}
  for c in a["channels"]:
   k=(d["nodes"][c["target"]["node"]]["name"],c["target"]["path"]);assert k not in channels
   s=a["samplers"][c["sampler"]];channels[k]=(read(s["input"]),read(s["output"]),s.get("interpolation","LINEAR"))
  clips[a["name"]]=channels
 skin=d["skins"][0]
 return d,clips,read,[d["nodes"][i]["name"] for i in skin["joints"]]
old=Path(os.environ["HOREB_W28_ACTOR_OUTPUT"])/"w28-actor.glb";root=Path(os.environ["HOREB_W28E_OUTPUT"]);new=root/"w28e-actor.glb"
assert sha(old)=="e8101ec691c52a5ce3549f0825e925688ecb15ba76ebc8ca2937c6e13d24662a"
assert sha(new)==json.loads((root/"w28e-manifest.json").read_text(encoding="utf8"))["glb_sha256"]
da,a,ra,ja=load(old);db,b,rb,jb=load(new);assert ja==jb and len(ja)==53
assert set(a)==set(b)
rows=[]
for clip in a:
 assert set(a[clip])==set(b[clip]),(clip,set(a[clip])^set(b[clip]))
 for key,(times,vals,interp) in a[clip].items():
  t2,v2,i2=b[clip][key];assert len(times)==len(t2) and len(vals)==len(v2) and interp==i2
  terr=max(abs(x[0]-y[0]) for x,y in zip(times,t2))
  if key[1]=="rotation":
   err=max(min(max(abs(x-y) for x,y in zip(v,w)),max(abs(x+y) for x,y in zip(v,w))) for v,w in zip(vals,v2))
  else:err=max(max(abs(x-y) for x,y in zip(v,w)) for v,w in zip(vals,v2))
  assert terr<1e-6 and err<1e-5,(clip,key,terr,err)
  rows.append({"clip":clip,"target":list(key),"keys":len(times),"max_time_error":terr,"max_value_error":err})
report={"status":"EXPORTED_MOTION_CHANNEL_EQUIVALENCE","baseline_sha256":sha(old),"candidate_sha256":sha(new),"bones":len(ja),"channels":rows}
p=root/"w28e-motion-equivalence.json";assert not p.exists();p.write_text(json.dumps(report,indent=2),encoding="utf8")
print("W28E_MOTION_EQUIVALENCE",json.dumps({"clips":len(a),"channels":len(rows),"keys":sum(r["keys"] for r in rows),"max_value_error":max(r["max_value_error"] for r in rows),"max_time_error":max(r["max_time_error"] for r in rows)}))
