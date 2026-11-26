"""W28n: physically scaled iris/sclera study, retaining the verified W28l motion."""
import copy, hashlib, json, math, os, struct, zlib
from pathlib import Path

def sha(b): return hashlib.sha256(b).hexdigest()
def decode(raw):
    magic,version,total=struct.unpack_from("<4sII",raw)
    assert (magic,version,total)==(b"glTF",2,len(raw))
    n,t=struct.unpack_from("<I4s",raw,12)
    assert t==b"JSON"
    d=json.loads(raw[20:20+n])
    m,t=struct.unpack_from("<I4s",raw,20+n)
    assert t==b"BIN\0" and 28+n+m==len(raw)
    return d,raw[28+n:]
def encode(d,b):
    j=json.dumps(d,ensure_ascii=False,separators=(",",":")).encode()
    j+=b" "*(-len(j)%4);b+=b"\0"*(-len(b)%4)
    return struct.pack("<4sII",b"glTF",2,28+len(j)+len(b))+struct.pack("<I4s",len(j),b"JSON")+j+struct.pack("<I4s",len(b),b"BIN\0")+b
def read_vec(d,b,index,dim):
    a=d["accessors"][index];v=d["bufferViews"][a["bufferView"]]
    assert a["componentType"]==5126 and v.get("byteStride",dim*4)==dim*4
    return list(struct.iter_unpack("<"+"f"*dim,b[v.get("byteOffset",0)+a.get("byteOffset",0):v.get("byteOffset",0)+a.get("byteOffset",0)+a["count"]*dim*4]))
def png(radius):
    # Original radial texture; no painted highlights, which should come from lighting.
    n=512;raw=bytearray()
    def lerp(a,b,t):return tuple(x+(y-x)*t for x,y in zip(a,b))
    def smooth(a,b,x):
        t=max(0,min(1,(x-a)/(b-a)));return t*t*(3-2*t)
    for y in range(n):
        raw.append(0)
        for x in range(n):
            dx=(2*(x+.5)/n-1)*radius
            dy=(2*(y+.5)/n-1)*radius
            r=math.hypot(dx,dy)*1000;theta=math.atan2(dy,dx)
            # 4.9 mm iris radius, 1.75 mm pupil radius (study values).
            sclera=lerp((210,204,193),(174,153,147),smooth(6.0,11.8,r))
            wave=(math.sin(49*theta+1.6*math.sin(5*theta)+r*1.8)+.4*math.sin(83*theta-r*3))*.5
            iris=(92+22*wave,56+14*wave,32+8*wave)
            iris=lerp(iris,(51,33,25),smooth(4.25,4.95,r)*.85)
            color=lerp(iris,sclera,smooth(4.70,5.05,r))
            color=lerp((13,11,10),color,smooth(1.68,1.86,r))
            raw.extend(max(0,min(255,round(c))) for c in color)
    def chunk(t,b):return struct.pack(">I",len(b))+t+b+struct.pack(">I",zlib.crc32(t+b)&0xffffffff)
    return b"\x89PNG\r\n\x1a\n"+chunk(b"IHDR",struct.pack(">IIBBBBB",n,n,8,2,0,0,0))+chunk(b"IDAT",zlib.compress(raw,9))+chunk(b"IEND",b"")

root=Path(os.environ["HOREB_W28L_OUTPUT"])
out=Path(os.environ["HOREB_W28N_OUTPUT"])
source=(root/"w28l-actor.glb").read_bytes()
m=json.loads((root/"w28l-eye-manifest.json").read_text(encoding="utf8"))
a=json.loads((root/"w28l-glb-audit.json").read_text(encoding="utf8"))
assert sha(source)==m["glb_sha256"]==a["actor_sha256"]=="76fa64646830931c7cfc4e5b17524a7fea1f83c315fe1e7168c9dbf526d14c4b"
assert a["house_sha256"]==m["house_sha256"] and a["actor_meshes"]==7 and a["props"]==98
for c,name,n,step in zip(a["clips"],("Mother_GestureTowardsBasket","Mother_QuietIdle"),(417,144),(.25,1)):
    assert c["name"]==name and not c["bad"] and len(c["rows"])==n
    assert all(abs(r["frame"]-(1+i*step))<1e-6 and not any(r[k] for k in ("prop_hits","skin_cloth","self_pairs","sash_pairs","sash_self_pairs","eye_face_pairs","eye_face_pairs_neutral")) for i,r in enumerate(c["rows"]))
assert len(a["clips"])==2
d,b=decode(source);original=copy.deepcopy(d);payload=bytearray(b)
eye=next(mesh for mesh in d["meshes"] if mesh["name"]=="low-poly")
assert len(eye["primitives"])==1
p=eye["primitives"][0];assert len(p["targets"])==8
old_uv=p["attributes"]["TEXCOORD_0"];old_mat=p["material"]
pos=read_vec(d,b,p["attributes"]["POSITION"],3)
assert len(pos)==96
fits=m["eye_fits"];assert len(fits)==2
centers={f["eye"]:f["center"] for f in fits}
radius=max(f["radius_mm"] for f in fits)/1000
assert .011<radius<.013
uv=[]
for x,y,z in pos:
    cx,cy,cz=centers["positive_x" if x>0 else "negative_x"]
    u=.5+(x-cx)/(2*radius);v=.5-(y-cy)/(2*radius)
    assert -.001<=u<=1.001 and -.001<=v<=1.001
    uv.append((max(0,min(1,u)),max(0,min(1,v))))
def append(data,target=None):
    payload.extend(b"\0"*(-len(payload)%4))
    i=len(d["bufferViews"]);v={"buffer":0,"byteOffset":len(payload),"byteLength":len(data)}
    if target:v["target"]=target
    d["bufferViews"].append(v);payload.extend(data);return i
view=append(b"".join(struct.pack("<2f",*v) for v in uv),34962)
uv_index=len(d["accessors"])
d["accessors"].append({"bufferView":view,"componentType":5126,"count":len(uv),"type":"VEC2","min":[min(v[i] for v in uv) for i in (0,1)],"max":[max(v[i] for v in uv) for i in (0,1)]})
p["attributes"]["TEXCOORD_0"]=uv_index
texbytes=png(radius)
image_view=append(texbytes)
im=len(d["images"]);d["images"].append({"name":"W28n_original_iris_sclera","bufferView":image_view,"mimeType":"image/png"})
sampler=len(d["samplers"]);d["samplers"].append({"magFilter":9729,"minFilter":9987,"wrapS":33071,"wrapT":33071})
tex=len(d["textures"]);d["textures"].append({"sampler":sampler,"source":im})
mat=copy.deepcopy(d["materials"][old_mat])
assert mat["alphaMode"]=="BLEND"
mat["name"]="W28n_opaque_brown_eye_study";mat["alphaMode"]="OPAQUE";mat["doubleSided"]=False
mat["pbrMetallicRoughness"]["baseColorTexture"]={"index":tex}
mat["pbrMetallicRoughness"]["roughnessFactor"]=.28
p["material"]=len(d["materials"]);d["materials"].append(mat)
d["buffers"][0]["byteLength"]=len(payload)
result=encode(d,bytes(payload))
r,rb=decode(result);assert rb[:len(b)]==b
q=next(mesh for mesh in r["meshes"] if mesh["name"]=="low-poly")["primitives"][0]
q["attributes"]["TEXCOORD_0"]=old_uv;q["material"]=old_mat
for key in ("accessors","bufferViews","images","samplers","textures","materials"):
    r[key]=r[key][:len(original[key])]
r["buffers"]=original["buffers"]
assert r==original
report={"status":"ART_HOLD_W28N_EYE_SURFACE","source_sha256":sha(source),"glb_sha256":sha(result),"glb_bytes":len(result),"house_sha256":m["house_sha256"],"source_audit_sha256":sha((root/"w28l-glb-audit.json").read_bytes()),"geometry_and_motion_unchanged":True,"iris_radius_mm":4.9,"pupil_radius_mm":1.75,"eye_radius_mm":radius*1000,"texture_sha256":sha(texbytes)}
if out.exists():
    assert (out/"w28n-actor.glb").read_bytes()==result
    assert json.loads((out/"w28n-eye-manifest.json").read_text(encoding="utf8"))==report
    print("W28N_REPRODUCIBLE",sha(result))
else:
    out.mkdir(parents=True)
    (out/"w28n-actor.glb").write_bytes(result)
    (out/"w28n-eye-manifest.json").write_text(json.dumps(report,indent=2),encoding="utf8")
    print("W28N_EYE_SURFACE_PASS",sha(result),len(result))
