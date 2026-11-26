"""W29c: lossless compaction of the pinned W29b actor.
Remove only unreachable material/texture/image/sampler resources. Keep all accessors
and verify their byte payloads, active material graphs, and all other JSON fields.
"""
import copy,hashlib,json,os,struct
from pathlib import Path
def sha(b):return hashlib.sha256(b).hexdigest()
def decode(raw):
 assert struct.unpack_from("<4sII",raw)==(b"glTF",2,len(raw))
 n,t=struct.unpack_from("<I4s",raw,12);assert t==b"JSON"
 m,t=struct.unpack_from("<I4s",raw,20+n);assert t==b"BIN\0" and len(raw)==28+n+m
 return json.loads(raw[20:20+n]),raw[28+n:]
def encode(d,b):
 j=json.dumps(d,separators=(",",":"),ensure_ascii=False).encode();j+=b" "*(-len(j)%4);b+=b"\0"*(-len(b)%4)
 return struct.pack("<4sII",b"glTF",2,28+len(j)+len(b))+struct.pack("<I4s",len(j),b"JSON")+j+struct.pack("<I4s",len(b),b"BIN\0")+b
root=Path(os.environ["HOREB_W29B_OUTPUT"]);out=Path(os.environ["HOREB_W29C_OUTPUT"])
raw=(root/"w29b-actor.glb").read_bytes()
m=json.loads((root/"w29b-manifest.json").read_text(encoding="utf8"))
ab=(root/"w29b-lash-audit.json").read_bytes();audit=json.loads(ab)
assert sha(raw)==m["glb_sha256"]==audit["actor_sha256"]=="8f11fc78285d4aece03b94554967f4deb3ad191b6a01055784f6a08e16a2c8d1"
assert len(audit["clips"])==2 and all(not c["bad"] and len(c["rows"])==count and all(r["frame"]==1+i*step and not any(r["overlap_pairs"].values()) for i,r in enumerate(c["rows"])) for c,count,step in zip(audit["clips"],(417,144),(.25,1)))
d,b=decode(raw);original=copy.deepcopy(d)
assert set(d)=={"asset","scene","scenes","nodes","animations","materials","meshes","textures","images","skins","accessors","bufferViews","samplers","buffers"}
assert len(d["buffers"])==1 and all("sparse" not in a for a in d["accessors"])
def texture_infos(mat):
 # Fail closed on unfamiliar material features rather than silently pruning resources.
 assert set(mat)<= {"name","doubleSided","alphaMode","alphaCutoff","pbrMetallicRoughness","normalTexture","occlusionTexture","emissiveTexture","emissiveFactor"}
 p=mat.get("pbrMetallicRoughness",{})
 assert set(p)<= {"baseColorFactor","baseColorTexture","metallicFactor","roughnessFactor","metallicRoughnessTexture"}
 for container,keys in ((mat,("normalTexture","occlusionTexture","emissiveTexture")),(p,("baseColorTexture","metallicRoughnessTexture"))):
  for key in keys:
   if key in container:
    info=container[key];assert set(info)<= {"index","texCoord","scale","strength"};yield info
def primitives(doc):
 for mesh in doc["meshes"]:
  for p in mesh["primitives"]:
   assert "material" in p and "extensions" not in p
   yield p
def compact(key,keep):
 keep=sorted(keep);old=d[key];mapping={i:j for j,i in enumerate(keep)}
 d[key]=[old[i] for i in keep];return mapping
mm=compact("materials",{p["material"] for p in primitives(d)})
for p in primitives(d):p["material"]=mm[p["material"]]
tm=compact("textures",{t["index"] for mat in d["materials"] for t in texture_infos(mat)})
for mat in d["materials"]:
 for t in texture_infos(mat):t["index"]=tm[t["index"]]
assert all(set(t)<= {"name","source","sampler"} for t in d["textures"])
im=compact("images",{t["source"] for t in d["textures"]})
sm=compact("samplers",{t["sampler"] for t in d["textures"] if "sampler" in t})
for t in d["textures"]:
 t["source"]=im[t["source"]]
 if "sampler" in t:t["sampler"]=sm[t["sampler"]]
assert all(set(x)<= {"name","bufferView","mimeType"} for x in d["images"])
accessor_views={a["bufferView"] for a in d["accessors"]}
all_image_views={x["bufferView"] for x in original["images"]}
assert not accessor_views&all_image_views and accessor_views|all_image_views==set(range(len(original["bufferViews"])))
vm=compact("bufferViews",accessor_views|{x["bufferView"] for x in d["images"]})
for a in d["accessors"]:a["bufferView"]=vm[a["bufferView"]]
for x in d["images"]:x["bufferView"]=vm[x["bufferView"]]
def viewbytes(doc,blob,i):
 v=doc["bufferViews"][i];assert v["buffer"]==0
 start=v.get("byteOffset",0);return blob[start:start+v["byteLength"]]
payload=bytearray()
for old,new in vm.items():
 v=d["bufferViews"][new];payload.extend(b"\0"*(-len(payload)%4));v["byteOffset"]=len(payload);payload.extend(viewbytes(original,b,old))
d["buffers"][0]["byteLength"]=len(payload)
res=encode(d,bytes(payload));q,qb=decode(res)
# Verify full byte identity of each retained buffer view, including all animation data.
for old,new in vm.items():
 assert viewbytes(original,b,old)==viewbytes(q,qb,new)
 a=copy.deepcopy(original["bufferViews"][old]);z=copy.deepcopy(q["bufferViews"][new]);a.pop("byteOffset",None);z.pop("byteOffset",None);assert a==z
# Resolve every active material graph to content hashes and sampler settings.
def material_graph(doc,blob,p):
 mat=copy.deepcopy(doc["materials"][p["material"]])
 for t in texture_infos(mat):
  tex=copy.deepcopy(doc["textures"][t.pop("index")])
  img=copy.deepcopy(doc["images"][tex.pop("source")]);img["sha256"]=sha(viewbytes(doc,blob,img.pop("bufferView")))
  if "sampler" in tex:tex["sampler"]=doc["samplers"][tex["sampler"]]
  t["resolved"]={**tex,"image":img}
 return mat
assert [material_graph(original,b,p) for p in primitives(original)]==[material_graph(q,qb,p) for p in primitives(q)]
# Reverse remapped indices and restore original resource arrays before comparing every other field.
rev_m={v:k for k,v in mm.items()};rev_v={v:k for k,v in vm.items()}
for p in primitives(q):p["material"]=rev_m[p["material"]]
for a in q["accessors"]:a["bufferView"]=rev_v[a["bufferView"]]
for key in ("materials","textures","images","samplers","bufferViews","buffers"):q[key]=original[key]
assert q==original
removed=[{"name":x.get("name"),"bytes":len(viewbytes(original,b,x["bufferView"]))} for i,x in enumerate(original["images"]) if i not in im]
report={"status":"ART_HOLD_W29C_LOSSLESS_COMPACT_TRIAL","source_sha256":sha(raw),"source_lash_audit_sha256":sha(ab),"house_sha256":m["house_sha256"],"glb_sha256":sha(res),"glb_bytes":len(res),"source_bytes":len(raw),"saved_bytes":len(raw)-len(res),"removed_images":removed,"accessors_byte_identical":len(original["accessors"]),"retained_views_byte_identical":len(vm),"active_material_graphs_identical":len(list(primitives(original))),"all_other_json_identical_after_remap":True}
if out.exists():
 assert (out/"w29c-actor.glb").read_bytes()==res and json.loads((out/"w29c-manifest.json").read_text())==report
 print("W29C_REPRO_PASS",sha(res),flush=True)
else:
 out.mkdir(parents=True);(out/"w29c-actor.glb").write_bytes(res);(out/"w29c-manifest.json").write_text(json.dumps(report,indent=2),encoding="utf8")
 print("W29C_LOSSLESS_PASS",json.dumps(report),flush=True)
