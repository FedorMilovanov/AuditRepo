"""W29a: restore restrained source skin detail to W28t, without changing geometry."""
import copy,hashlib,io,json,os,struct
from pathlib import Path
import numpy as np
from PIL import Image,ImageFilter
def sha(x):return hashlib.sha256(x).hexdigest()
def decode(b):
 assert struct.unpack_from("<4sII",b)==(b"glTF",2,len(b))
 n,t=struct.unpack_from("<I4s",b,12);assert t==b"JSON"
 z,t=struct.unpack_from("<I4s",b,20+n);assert t==b"BIN\0" and len(b)==28+n+z
 return json.loads(b[20:20+n]),b[28+n:]
def encode(d,b):
 j=json.dumps(d,separators=(",",":"),ensure_ascii=False).encode();j+=b" "*(-len(j)%4);b+=b"\0"*(-len(b)%4)
 return struct.pack("<4sII",b"glTF",2,28+len(j)+len(b))+struct.pack("<I4s",len(j),b"JSON")+j+struct.pack("<I4s",len(b),b"BIN\0")+b
root=Path(os.environ["HOREB_W28T_OUTPUT"]);out=Path(os.environ["HOREB_W29A_OUTPUT"])
raw=(root/"w28t-actor.glb").read_bytes()
m=json.loads((root/"w28t-manifest.json").read_text(encoding="utf8"));audit=(root/"w28t-brow-audit.json").read_bytes();a=json.loads(audit)
assert sha(raw)==m["glb_sha256"]==a["actor_sha256"]=="689c81ae948f6ba0dca8f338b9a06dcd9f604bee525edea1499ff21c9dac6cb3"
assert len(a["clips"])==2 and all(not c["bad"] and len(c["rows"])==count and all(not any(r["overlap_pairs"].values()) and r["frame"]==1+i*step for i,r in enumerate(c["rows"])) for c,count,step in zip(a["clips"],(417,144),(.25,1)))
source=Path(__file__).resolve().parents[2]/"mother-w19/source/makehuman_system_assets/skins/young_caucasian_female/young_lightskinned_female_diffuse.png"
source_bytes=source.read_bytes()
assert sha(source_bytes)=="b2a6ac8cd4f9febdb447368e29c76cd68410bb66e46d9dcfa2d5f75126eea8fc"
d,b=decode(raw);original=copy.deepcopy(d);payload=bytearray(b)
p=d["meshes"][0]["primitives"][0];old=p["material"];assert old==0
mat=copy.deepcopy(d["materials"][old]);pbr=mat["pbrMetallicRoughness"];t=d["textures"][pbr["baseColorTexture"]["index"]]
v=d["bufferViews"][d["images"][t["source"]]["bufferView"]];start=v.get("byteOffset",0)
base=Image.open(io.BytesIO(b[start:start+v["byteLength"]])).convert("RGB")
src=Image.open(io.BytesIO(source_bytes)).convert("RGB")
assert base.size==src.size==(2048,2048)
x=np.asarray(src,dtype=np.float32);y=np.asarray(base,dtype=np.float32)
# Preserve established complexion. Restore bounded original UV-aligned local detail;
# do not interpret pigmentation as geometry or manufacture a normal map from it.
blur=np.asarray(src.filter(ImageFilter.GaussianBlur(24)),dtype=np.float32)
detail=np.clip(x-blur,-45,45)
broad=np.clip(blur-np.median(blur.reshape(-1,3),axis=0),-35,35)
z=np.uint8(np.clip(np.rint(y+.66*detail+.28*broad),0,255))
def stats(a):return np.percentile(a.reshape(-1,3),[1,10,50,90,99],axis=0).round(2).tolist()
def append_png(img,name):
 bio=io.BytesIO();img.save(bio,format="PNG",compress_level=6);png=bio.getvalue()
 payload.extend(b"\0"*(-len(payload)%4));i=len(d["bufferViews"])
 d["bufferViews"].append({"buffer":0,"byteOffset":len(payload),"byteLength":len(png)});payload.extend(png)
 j=len(d["images"]);d["images"].append({"name":name,"mimeType":"image/png","bufferView":i})
 k=len(d["textures"]);d["textures"].append({**t,"source":j})
 return k,sha(png)
tex,h=append_png(Image.fromarray(z,"RGB"),"W29a_CC0_skin_detail")
pbr["baseColorTexture"]["index"]=tex
# Keep roughness unchanged for an isolated comparison.
mat["name"]="W29a_CC0_skin_detail_study"
p["material"]=len(d["materials"]);d["materials"].append(mat)
d["buffers"][0]["byteLength"]=len(payload);res=encode(d,bytes(payload))
r,rb=decode(res);assert rb[:len(b)]==b
r["meshes"][0]["primitives"][0]["material"]=old
for k in ("bufferViews","images","textures","materials"):r[k]=r[k][:len(original[k])]
r["buffers"]=original["buffers"];assert r==original
report={"status":"ART_HOLD_W29A_SKIN_DETAIL_TRIAL","source_sha256":sha(raw),"brow_audit_sha256":sha(audit),"source_skin_sha256":sha(source_bytes),"house_sha256":m["house_sha256"],"glb_sha256":sha(res),"glb_bytes":len(res),"geometry_animation_unchanged":True,"texture_sha256":h,"source_samples":561,"base_percentiles":stats(y),"candidate_percentiles":stats(z),"detail_gain":.66,"broad_gain":.28,"roughness_unchanged":True}
if out.exists():
 assert (out/"w29a-actor.glb").read_bytes()==res and json.loads((out/"w29a-manifest.json").read_text())==report
 print("W29A_REPRO_PASS",sha(res),flush=True)
else:
 out.mkdir(parents=True);(out/"w29a-actor.glb").write_bytes(res);(out/"w29a-manifest.json").write_text(json.dumps(report,indent=2),encoding="utf8")
 print("W29A_SKIN_PASS",json.dumps(report),flush=True)
