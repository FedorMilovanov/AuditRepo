"""W28s: deterministic woven linen material study on accepted W28r.
Only new texture bytes and garment material references are allowed to change.
"""
import copy, hashlib, json, math, os, struct
from pathlib import Path
import numpy as np
from PIL import Image
from io import BytesIO

def sha(b):return hashlib.sha256(b).hexdigest()
def decode(b):
    assert struct.unpack_from("<4sII",b)==(b"glTF",2,len(b))
    n,t=struct.unpack_from("<I4s",b,12);assert t==b"JSON"
    m,t=struct.unpack_from("<I4s",b,20+n);assert t==b"BIN\0" and len(b)==28+n+m
    return json.loads(b[20:20+n]),b[28+n:]
def encode(d,b):
    j=json.dumps(d,separators=(",",":"),ensure_ascii=False).encode()
    j+=b" "*(-len(j)%4);b+=b"\0"*(-len(b)%4)
    return struct.pack("<4sII",b"glTF",2,28+len(j)+len(b))+struct.pack("<I4s",len(j),b"JSON")+j+struct.pack("<I4s",len(b),b"BIN\0")+b

root=Path(os.environ["HOREB_W28R_OUTPUT"]);out=Path(os.environ["HOREB_W28S_OUTPUT"])
raw=(root/"w28r-actor.glb").read_bytes();m=json.loads((root/"w28r-manifest.json").read_text(encoding="utf8"))
ab=(root/"w28r-glb-audit.json").read_bytes();a=json.loads(ab)
assert sha(raw)==m["glb_sha256"]==a["actor_sha256"]=="40b966d66bd72ef628e572bf2f356d6ff13f7752d021b60bdd6c217bb77b81dc"
assert a["house_sha256"]==m["house_sha256"] and a["props"]==98 and a["actor_meshes"]==7
assert len(a["clips"])==2
for c,name,count,step in zip(a["clips"],("Mother_GestureTowardsBasket","Mother_QuietIdle"),(417,144),(.25,1)):
    assert c["name"]==name and len(c["rows"])==count and not c["bad"]
    assert all(abs(r["frame"]-(1+i*step))<1e-6 and not any(r[k] for k in ("prop_hits","skin_cloth","self_pairs","sash_pairs","sash_self_pairs","hand_self_pairs","eye_face_pairs")) for i,r in enumerate(c["rows"]))
d,b=decode(raw);orig=copy.deepcopy(d);payload=bytearray(b)
# Existing UV tile spans approximately 140 mm. 80 warp/weft threads per tile.
# A low-frequency periodic dye variation is deliberately subordinate to thread detail.
n=512;tau=2*math.pi
u,v=np.meshgrid((np.arange(n)+.5)/n,(np.arange(n)+.5)/n)
warp=np.cos(tau*80*u+.22*np.sin(tau*3*v))
weft=np.cos(tau*80*v+.17*np.sin(tau*5*u))
over=np.cos(tau*40*u)*np.cos(tau*40*v)
dye=4*np.sin(tau*(3*u+2*v))+3*np.cos(tau*(2*u-3*v))+2*np.sin(tau*(7*u+v))
gray=235+7*warp+6*weft+4*over+dye
rgb=np.uint8(np.clip(np.stack((gray+1,gray,gray-2),axis=-1),0,255).round())
buf=BytesIO();Image.fromarray(rgb,"RGB").save(buf,format="PNG",compress_level=9);png=buf.getvalue()
payload.extend(b"\0"*(-len(payload)%4));view=len(d["bufferViews"])
d["bufferViews"].append({"buffer":0,"byteOffset":len(payload),"byteLength":len(png)});payload.extend(png)
im=len(d["images"]);d["images"].append({"name":"W28s_woven_linen_original","bufferView":view,"mimeType":"image/png"})
sam=len(d["samplers"]);d["samplers"].append({"magFilter":9729,"minFilter":9987,"wrapS":10497,"wrapT":10497})
tex=len(d["textures"]);d["textures"].append({"sampler":sam,"source":im})
names={"W28e_trunk","W22_linen_rear_drape_geo","W22_plain_linen_head_cover_geo"}
changes=[];material_map={}
for mesh in d["meshes"]:
    if mesh["name"] not in names:continue
    assert len(mesh["primitives"])==1
    p=mesh["primitives"][0];old=p["material"]
    assert old in (3,4) and "TEXCOORD_0" in p["attributes"]
    if old not in material_map:
        mat=copy.deepcopy(d["materials"][old])
        assert "baseColorTexture" not in mat["pbrMetallicRoughness"]
        mat["name"]="W28s_linen_"+("tunic_drape" if old==3 else "head_cover")
        mat["pbrMetallicRoughness"]["baseColorTexture"]={"index":tex}
        mat["normalTexture"]["scale"]=.78
        material_map[old]=len(d["materials"]);d["materials"].append(mat)
    p["material"]=material_map[old];changes.append({"mesh":mesh["name"],"old":old,"new":p["material"]})
assert {c["mesh"] for c in changes}==names
d["buffers"][0]["byteLength"]=len(payload)
result=encode(d,bytes(payload))
r,rb=decode(result);assert rb[:len(b)]==b
for c in changes:
    next(x for x in r["meshes"] if x["name"]==c["mesh"])["primitives"][0]["material"]=c["old"]
for k in ("bufferViews","images","samplers","textures","materials"):r[k]=r[k][:len(orig[k])]
r["buffers"]=orig["buffers"];assert r==orig
report={"status":"ART_HOLD_W28S_LINEN_TRIAL","source_sha256":sha(raw),"source_audit_sha256":sha(ab),"house_sha256":m["house_sha256"],"glb_sha256":sha(result),"glb_bytes":len(result),"geometry_animation_unchanged":True,"source_samples":561,"texture_sha256":sha(png),"threads_per_uv_tile":80,"material_changes":changes,"normal_scale":.78}
if out.exists():
    assert (out/"w28s-actor.glb").read_bytes()==result and json.loads((out/"w28s-manifest.json").read_text())==report
    print("W28S_REPRODUCIBLE",sha(result))
else:
    out.mkdir(parents=True);(out/"w28s-actor.glb").write_bytes(result);(out/"w28s-manifest.json").write_text(json.dumps(report,indent=2),encoding="utf8")
    print("W28S_MATERIAL_PASS",sha(result),len(result),len(changes))
