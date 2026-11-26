"""W32d material-only house trial using existing CC0 clay plaster.
No geometry, UV, node, prop, collision, or animation changes."""
import copy,hashlib,io,json,os,struct
from pathlib import Path
import numpy as np
from PIL import Image
def sha(x):return hashlib.sha256(x).hexdigest()
def decode(raw):
 assert struct.unpack_from("<4sII",raw)==(b"glTF",2,len(raw))
 n,t=struct.unpack_from("<I4s",raw,12);assert t==b"JSON"
 z,t=struct.unpack_from("<I4s",raw,20+n);assert t==b"BIN\0" and len(raw)==28+n+z
 return json.loads(raw[20:20+n]),raw[28+n:]
def encode(j,b):
 q=json.dumps(j,separators=(",",":"),ensure_ascii=False).encode();q+=b" "*(-len(q)%4);b+=b"\0"*(-len(b)%4)
 return struct.pack("<4sII",b"glTF",2,28+len(q)+len(b))+struct.pack("<I4s",len(q),b"JSON")+q+struct.pack("<I4s",len(b),b"BIN\0")+b
root=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"]);out=Path(os.environ["HOREB_W32D_HOUSE_OUTPUT"])
raw=(root/"w28-house.glb").read_bytes()
assert sha(raw)=="fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622"
d,b=decode(raw);original=copy.deepcopy(d)
material=next(i for i,m in enumerate(d["materials"]) if m["name"]=="CC0_clay_plaster_unpolished")
m=d["materials"][material];assert abs(m["normalTexture"]["scale"]-.45)<1e-6
texture=m["pbrMetallicRoughness"]["baseColorTexture"]["index"];im=d["textures"][texture]["source"]
view=d["images"][im]["bufferView"];bv=d["bufferViews"][view];assert d["images"][im]["mimeType"]=="image/jpeg"
assert not any(a.get("bufferView")==view for a in d["accessors"])
assert sum(x.get("bufferView")==view for x in d["images"])==1
start=bv.get("byteOffset",0);end=start+bv["byteLength"];padded_end=(end+3)//4*4
source=b[start:end];a=np.asarray(Image.open(io.BytesIO(source)).convert("RGB"),dtype=np.float64)
assert a.shape==(1024,1024,3)
# Retain the source's actual texture detail, boost low source contrast, lighten
# clay moderately, and introduce low-amplitude periodic broad trowel variation.
# Fourier integer frequencies make the variation tileable at the existing UVs.
n=a.shape[0];y,x=np.mgrid[0:n,0:n]/n;rng=np.random.default_rng(3214)
field=np.zeros((n,n))
for low,high,amp in ((2,5,4.0),(6,12,2.2),(15,30,.9)):
 layer=np.zeros_like(field)
 for k in range(10):
  fx,fy=rng.integers(low,high+1,size=2)*rng.choice([-1,1],size=2)
  layer+=np.cos(2*np.pi*(fx*x+fy*y)+rng.uniform(0,2*np.pi))
 field+=layer/layer.std()*amp
mean=a.mean(axis=(0,1));new=np.clip(np.rint(mean+[13,14,16]+1.85*(a-mean)+field[...,None]),0,255).astype(np.uint8)
img=Image.fromarray(new);buf=io.BytesIO();img.save(buf,format="JPEG",quality=92,subsampling=0,optimize=False);replacement=buf.getvalue()
# Shift only the trailing buffer offsets; every other view must remain identical.
pad=replacement+b"\0"*(-len(replacement)%4);delta=len(pad)-(padded_end-start)
assert all(i==view or v.get("byteOffset",0)+v["byteLength"]<=start or v.get("byteOffset",0)>=padded_end for i,v in enumerate(d["bufferViews"]))
data=b[:start]+pad+b[padded_end:]
bv["byteLength"]=len(replacement)
for i,v in enumerate(d["bufferViews"]):
 if i!=view and v.get("byteOffset",0)>=padded_end:v["byteOffset"]=v.get("byteOffset",0)+delta
m["normalTexture"]["scale"]=.8;d["buffers"][0]["byteLength"]=len(data)
res=encode(d,data);q,qb=decode(res)
for i,v in enumerate(original["bufferViews"]):
 if i!=view:
  o=v.get("byteOffset",0);o2=q["bufferViews"][i].get("byteOffset",0)
  assert b[o:o+v["byteLength"]]==qb[o2:o2+v["byteLength"]]
q["bufferViews"]=original["bufferViews"];q["buffers"]=original["buffers"];q["materials"][material]=original["materials"][material]
assert q==original
report={"status":"ART_HOLD_W32D_PLASTER_TRIAL","source_sha256":sha(raw),"glb_sha256":sha(res),"bytes":len(res),"changed_image_view":view,"material_index":material,"material_name":m["name"],"normal_scale":.8,"source_texture_sha256":sha(source),"texture_sha256":sha(replacement),"unchanged_views":len(d["bufferViews"])-1,"geometry_and_other_materials_unchanged":True,"source_rgb_mean":mean.tolist(),"candidate_rgb_mean":new.mean((0,1)).tolist(),"source_rgb_std":a.std((0,1)).tolist(),"candidate_rgb_std":new.std((0,1)).tolist()}
if out.exists():
 assert (out/"w32d-house.glb").read_bytes()==res and json.loads((out/"w32d-house-manifest.json").read_text())==report
 print("W32D_REPRO_PASS",sha(res),flush=True)
else:
 out.mkdir(parents=True);(out/"w32d-house.glb").write_bytes(res);(out/"w32d-house-manifest.json").write_text(json.dumps(report,indent=2))
 print("W32D_MATERIAL_PASS",json.dumps(report),flush=True)
