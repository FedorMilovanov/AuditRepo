"""W29d eye material trial on compact W29c: preserve all mesh and animation bytes."""
import copy,hashlib,io,json,os,struct
from pathlib import Path
import numpy as np
from PIL import Image
def sha(x):return hashlib.sha256(x).hexdigest()
def decode(raw):
 assert struct.unpack_from("<4sII",raw)==(b"glTF",2,len(raw))
 n,t=struct.unpack_from("<I4s",raw,12);assert t==b"JSON"
 m,t=struct.unpack_from("<I4s",raw,20+n);assert t==b"BIN\0" and len(raw)==28+n+m
 return json.loads(raw[20:20+n]),raw[28+n:]
def encode(d,b):
 j=json.dumps(d,separators=(",",":"),ensure_ascii=False).encode();j+=b" "*(-len(j)%4);b+=b"\0"*(-len(b)%4)
 return struct.pack("<4sII",b"glTF",2,28+len(j)+len(b))+struct.pack("<I4s",len(j),b"JSON")+j+struct.pack("<I4s",len(b),b"BIN\0")+b
root=Path(os.environ["HOREB_W29C_OUTPUT"]);out=Path(os.environ["HOREB_W29D_OUTPUT"])
raw=(root/"w29c-actor.glb").read_bytes();m=json.loads((root/"w29c-manifest.json").read_text())
ab=(root/"w29c-glb-audit.json").read_bytes();a=json.loads(ab)
assert sha(raw)==m["glb_sha256"]==a["actor_sha256"]=="0d11d1b64a7b23b60fc1833d82bd938038f43c6369116ed9ac393b7cfa75ea94"
assert a["house_sha256"]==m["house_sha256"] and a["actor_meshes"]==9 and a["props"]==98
assert len(a["clips"])==2 and all(not c["bad"] and len(c["rows"])==count and all(not r["facial_bad"] and not any(r[k] for k in ("prop_hits","skin_cloth","self_pairs","sash_pairs","sash_self_pairs","hand_self_pairs","eye_face_pairs","eye_face_pairs_neutral")) for r in c["rows"]) for c,count in zip(a["clips"],(417,144)))
nroot=Path(os.environ["HOREB_W28N_OUTPUT"]);nm=json.loads((nroot/"w28n-eye-manifest.json").read_text())
assert nm["glb_sha256"]=="70cd23b9029efcd1357a9211ce7ab651d8b816438f20ad0c198fdbf7bd042741"
radius=float(nm["eye_radius_mm"]);assert 11<radius<13
d,b=decode(raw);original=copy.deepcopy(d)
p=next(x["primitives"][0] for x in d["meshes"] if x["name"]=="low-poly")
mi=p["material"];mat=d["materials"][mi];assert mat["name"]=="W28n_opaque_brown_eye_study"
assert sum(p["material"]==mi for mesh in d["meshes"] for p in mesh["primitives"])==1
tex=mat["pbrMetallicRoughness"]["baseColorTexture"]["index"];im=d["textures"][tex]["source"];iv=d["images"][im]["bufferView"]
assert sum(t["source"]==im for t in d["textures"])==1 and all(a["bufferView"]!=iv for a in d["accessors"])
def vb(doc,blob,i):
 v=doc["bufferViews"][i];o=v.get("byteOffset",0);return blob[o:o+v["byteLength"]]
assert sha(vb(d,b,iv))==nm["texture_sha256"]
# Physically sized pupil and iris, lighter warm brown fibers and neutral off-white sclera.
# No baked specular highlight or emissive color.
n=512
x,y=np.meshgrid((2*(np.arange(n)+.5)/n-1)*radius,(2*(np.arange(n)+.5)/n-1)*radius)
r=np.hypot(x,y);theta=np.arctan2(y,x)
def smooth(lo,hi,x):
 t=np.clip((x-lo)/(hi-lo),0,1);return t*t*(3-2*t)
def lerp(a,b,t):return np.array(a)*(1-t[...,None])+np.array(b)*t[...,None]
sclera=lerp((235,230,220),(201,179,174),smooth(5.5,11.8,r))
wave=.60*np.sin(49*theta+1.6*np.sin(5*theta)+r*1.8)+.22*np.sin(83*theta-r*3)+.18*np.sin(27*theta+r*4)
collarette=np.exp(-((r-2.7)/.40)**2)
iris=np.stack((121+25*wave+14*collarette,82+18*wave+9*collarette,48+11*wave+5*collarette),axis=-1)
iris=lerp(iris,(69,48,35),smooth(4.2,4.95,r)*.8)
color=lerp(iris,sclera,smooth(4.70,5.05,r))
color=lerp((14,12,11),color,smooth(1.48,1.66,r))
bio=io.BytesIO();Image.fromarray(np.uint8(np.clip(np.rint(color),0,255)),"RGB").save(bio,format="PNG",compress_level=9);png=bio.getvalue()
d["images"][im]["name"]="W29d_original_brown_eye"
mat["name"]="W29d_warm_brown_eye";mat["pbrMetallicRoughness"]["roughnessFactor"]=.22
payload=bytearray()
for i,v in enumerate(d["bufferViews"]):
 data=png if i==iv else vb(original,b,i)
 payload.extend(b"\0"*(-len(payload)%4));v["byteOffset"]=len(payload);v["byteLength"]=len(data);payload.extend(data)
d["buffers"][0]["byteLength"]=len(payload)
res=encode(d,bytes(payload));q,qb=decode(res)
assert vb(q,qb,iv)==png
for i in range(len(d["bufferViews"])):
 if i!=iv:assert vb(q,qb,i)==vb(original,b,i)
q["images"][im]=original["images"][im];q["materials"][mi]=original["materials"][mi]
q["bufferViews"]=original["bufferViews"];q["buffers"]=original["buffers"];assert q==original
report={"status":"ART_HOLD_W29D_EYE_LOOKDEV","source_sha256":sha(raw),"source_pair_audit_sha256":sha(ab),"house_sha256":m["house_sha256"],"glb_sha256":sha(res),"glb_bytes":len(res),"all_geometry_animation_unchanged":True,"unchanged_views":len(d["bufferViews"])-1,"source_samples":561,"iris_radius_mm":4.9,"pupil_radius_mm":1.57,"roughness":.22,"texture_sha256":sha(png)}
if out.exists():
 assert (out/"w29d-actor.glb").read_bytes()==res and json.loads((out/"w29d-manifest.json").read_text())==report
 print("W29D_REPRO_PASS",sha(res),flush=True)
else:
 out.mkdir(parents=True);(out/"w29d-actor.glb").write_bytes(res);(out/"w29d-manifest.json").write_text(json.dumps(report,indent=2),encoding="utf8")
 print("W29D_EYE_PASS",json.dumps(report),flush=True)
