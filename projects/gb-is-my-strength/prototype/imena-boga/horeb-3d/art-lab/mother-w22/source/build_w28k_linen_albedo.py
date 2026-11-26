"""W28k: original, deterministic linen albedo study; no geometry mutation."""
import copy, hashlib, json, math, os, struct, zlib
from pathlib import Path

def sha(b): return hashlib.sha256(b).hexdigest()
def decode(b):
    magic,version,size=struct.unpack_from("<4sII",b)
    assert (magic,version,size)==(b"glTF",2,len(b))
    n,tag=struct.unpack_from("<I4s",b,12)
    assert tag==b"JSON"
    d=json.loads(b[20:20+n])
    m,tag=struct.unpack_from("<I4s",b,20+n)
    assert tag==b"BIN\x00" and 28+n+m==len(b)
    return d,b[28+n:]
def encode(d,payload):
    j=json.dumps(d,separators=(",",":"),ensure_ascii=False).encode()
    j+=b" "*(-len(j)%4); payload+=b"\x00"*(-len(payload)%4)
    return struct.pack("<4sII",b"glTF",2,28+len(j)+len(payload))+struct.pack("<I4s",len(j),b"JSON")+j+struct.pack("<I4s",len(payload),b"BIN\x00")+payload
def png():
    # Seamless low-contrast warp and weft. UVs and normal/roughness maps unchanged.
    n=256; tau=math.tau
    raw=bytearray()
    for y in range(n):
        raw.append(0)
        v=y/n
        for x in range(n):
            u=x/n
            warp=math.cos(tau*16*u)
            weft=math.cos(tau*16*v)
            inter=math.cos(tau*8*u)*math.cos(tau*8*v)
            slow=math.sin(tau*(3*u+2*v))*.5+math.cos(tau*(2*u-3*v))*.5
            c=round(239+4*warp+4*weft+3*inter+4*slow)
            raw.extend((c,c,c))
    def chunk(t,b): return struct.pack(">I",len(b))+t+b+struct.pack(">I",zlib.crc32(t+b)&0xffffffff)
    return b"\x89PNG\r\n\x1a\n"+chunk(b"IHDR",struct.pack(">IIBBBBB",n,n,8,2,0,0,0))+chunk(b"IDAT",zlib.compress(raw,9))+chunk(b"IEND",b"")

root=Path(os.environ["HOREB_W28G_OUTPUT"])
out=Path(os.environ["HOREB_W28K_OUTPUT"])
source=(root/"w28g-actor.glb").read_bytes()
manifest=json.loads((root/"w28g-manifest.json").read_text(encoding="utf8"))
audit=json.loads((root/"w28g-glb-audit.json").read_text(encoding="utf8"))
assert sha(source)==manifest["glb_sha256"]==audit["actor_sha256"]=="3e1baf347b9197b2a59da935f15245f2ef289302b72cde22047642e563acc488"
assert audit["house_sha256"]==manifest["house_sha256"] and audit["actor_meshes"]==7 and audit["props"]==98
assert len(audit["clips"])==2
for c,name,n,step in zip(audit["clips"],("Mother_GestureTowardsBasket","Mother_QuietIdle"),(417,144),(.25,1)):
    assert c["name"]==name and not c["bad"] and len(c["rows"])==n
    assert all(abs(r["frame"]-(1+i*step))<1e-6 and not any(r[k] for k in ("prop_hits","skin_cloth","self_pairs","sash_pairs","sash_self_pairs")) for i,r in enumerate(c["rows"]))
d,b=decode(source); original=copy.deepcopy(d)
assert len(d["buffers"])==1 and d["buffers"][0]["byteLength"]<=len(b)
mesh=next(m for m in d["meshes"] if m["name"]=="W28e_trunk")
assert len(mesh["primitives"])==1 and "TEXCOORD_0" in mesh["primitives"][0]["attributes"]
p=mesh["primitives"][0]; oldmat=p["material"]
mat=copy.deepcopy(d["materials"][oldmat])
assert mat["name"]=="Original_W19H_WovenLinen_CC0_Normal" and "baseColorTexture" not in mat["pbrMetallicRoughness"]
albedo=png()
view=len(d["bufferViews"]); d["bufferViews"].append({"buffer":0,"byteOffset":len(b),"byteLength":len(albedo)})
im=len(d["images"]);d["images"].append({"name":"W28k_original_linen_albedo","bufferView":view,"mimeType":"image/png"})
sampler=len(d.setdefault("samplers",[]));d["samplers"].append({"magFilter":9729,"minFilter":9987,"wrapS":10497,"wrapT":10497})
tex=len(d["textures"]);d["textures"].append({"sampler":sampler,"source":im})
mat["name"]="W28k_original_linen_albedo_study"
mat["pbrMetallicRoughness"]["baseColorTexture"]={"index":tex}
p["material"]=len(d["materials"]);d["materials"].append(mat)
d["buffers"][0]["byteLength"]=len(b)+len(albedo)
result=encode(d,b+albedo)
r,rb=decode(result)
assert rb[:len(b)]==b and rb[len(b):len(b)+len(albedo)]==albedo
# Reverse only explicitly allowed changes; every other JSON field must match.
m=next(m for m in r["meshes"] if m["name"]=="W28e_trunk")
assert m["primitives"][0]["material"]==len(original["materials"])
m["primitives"][0]["material"]=oldmat
for k in ("bufferViews","images","samplers","textures","materials"):
    assert len(r[k])==len(original.get(k,[]))+1
    r[k].pop()
    if k not in original:del r[k]
r["buffers"][0]["byteLength"]=original["buffers"][0]["byteLength"]
assert r==original,"Unexpected nonmaterial change"
out.mkdir(parents=True,exist_ok=False)
(out/"w28k-actor.glb").write_bytes(result)
(out/"w28k-material-manifest.json").write_text(json.dumps({"status":"ART_HOLD_W28K_MATERIAL_ONLY","source_sha256":sha(source),"glb_sha256":sha(result),"glb_bytes":len(result),"albedo_sha256":sha(albedo),"geometry_animation_binary_unchanged":True,"source_clearance_samples":561,"source_audit_sha256":sha((root/"w28g-glb-audit.json").read_bytes()),"house_sha256":manifest["house_sha256"],"material":"W28k_original_linen_albedo_study"},indent=2),encoding="utf8")
print("W28K_MATERIAL_ONLY_PASS",len(source),len(result),sha(result))
