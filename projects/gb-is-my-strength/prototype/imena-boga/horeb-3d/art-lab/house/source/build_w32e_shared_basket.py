"""Extract the authored W28 basket without rebuilding or rescaling its mesh."""
import copy,hashlib,json,os,struct
from pathlib import Path
def sha(x):return hashlib.sha256(x).hexdigest()
root=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"]);out=Path(os.environ["HOREB_W32E_BASKET_OUTPUT"])
raw=(root/"w28-house.glb").read_bytes()
assert sha(raw)=="fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622"
n=struct.unpack_from("<I",raw,12)[0];d=json.loads(raw[20:20+n]);b=raw[28+n:]
assert struct.unpack_from("<4sII",raw)==(b"glTF",2,len(raw)) and struct.unpack_from("<I4s",raw,20+n)==(len(b),b"BIN\0")
assert not d.get("extensionsUsed")
i=next(i for i,x in enumerate(d["nodes"]) if x.get("name")=="BASKET_OBJECT_ACTION_ANCHOR")
root_node=d["nodes"][i];children=root_node["children"]
assert len(children)==92 and set(root_node)=={"name","children"}
assert all(set(d["nodes"][k])=={"name","mesh"} for k in children)
q={"asset":copy.deepcopy(d["asset"]),"scene":0,"scenes":[{"nodes":[0]}],"nodes":[{"name":"BASKET_OBJECT_ACTION_ANCHOR","children":list(range(1,93)),"translation":[-.35,-.851,-.26]}],"buffers":[{"byteLength":0}]}
maps={};payload=bytearray()
def take(kind,i):
 m=maps.setdefault(kind,{})
 if i in m:return m[i]
 arr=q.setdefault(kind,[]);j=len(arr);m[i]=j;x=copy.deepcopy(d[kind][i]);arr.append(x)
 if kind=="meshes":
  for p in x["primitives"]:
   assert set(p)<= {"attributes","indices","material","mode"}
   p["attributes"]={a:take("accessors",v) for a,v in p["attributes"].items()}
   p["indices"]=take("accessors",p["indices"]);p["material"]=take("materials",p["material"])
 elif kind=="accessors":
  assert not x.get("sparse");x["bufferView"]=take("bufferViews",x["bufferView"])
 elif kind=="materials":
  assert x["name"] in ("Papyrus_wicker_warm","Sun_bleached_reed","Aged_wood_rays"),x["name"]
  for a in (x,x["pbrMetallicRoughness"]):
   for k,v in a.items():
    if k.endswith("Texture"):v["index"]=take("textures",v["index"])
 elif kind=="textures":
  x["source"]=take("images",x["source"])
  if "sampler" in x:x["sampler"]=take("samplers",x["sampler"])
 elif kind=="images":x["bufferView"]=take("bufferViews",x["bufferView"])
 elif kind=="bufferViews":
  assert x["buffer"]==0;start=x.get("byteOffset",0)
  payload.extend(b"\0"*(-len(payload)%4));x["byteOffset"]=len(payload);payload.extend(b[start:start+x["byteLength"]])
 elif kind!="samplers":raise AssertionError(kind)
 return j
for k in children:
 node=copy.deepcopy(d["nodes"][k]);node["mesh"]=take("meshes",node["mesh"]);q["nodes"].append(node)
# Exact byte and JSON comparison after reversing references.
for kind,m in maps.items():
 for i,j in m.items():
  a=d[kind][i];c=copy.deepcopy(q[kind][j])
  if kind=="bufferViews":
   assert b[a.get("byteOffset",0):a.get("byteOffset",0)+a["byteLength"]]==payload[c["byteOffset"]:c["byteOffset"]+c["byteLength"]]
   c["byteOffset"]=a.get("byteOffset",0)
   if "byteOffset" not in a:c.pop("byteOffset")
  elif kind=="meshes":
   for ap,cp in zip(a["primitives"],c["primitives"]):
    assert cp["attributes"]=={k:maps["accessors"][v] for k,v in ap["attributes"].items()}
    assert cp["indices"]==maps["accessors"][ap["indices"]] and cp["material"]==maps["materials"][ap["material"]]
   c["primitives"]=a["primitives"]
  elif kind=="accessors":
   assert c["bufferView"]==maps["bufferViews"][a["bufferView"]];c["bufferView"]=a["bufferView"]
  elif kind=="materials":
   for aa,cc in ((a,c),(a["pbrMetallicRoughness"],c["pbrMetallicRoughness"])):
    for k,v in aa.items():
     if k.endswith("Texture"):
      assert cc[k]["index"]==maps["textures"][v["index"]];cc[k]["index"]=v["index"]
  elif kind=="textures":
   assert c["source"]==maps["images"][a["source"]];c["source"]=a["source"]
   if "sampler" in a:assert c["sampler"]==maps["samplers"][a["sampler"]];c["sampler"]=a["sampler"]
  elif kind=="images":
   assert c["bufferView"]==maps["bufferViews"][a["bufferView"]];c["bufferView"]=a["bufferView"]
  assert c==a,(kind,i)
pos=[d["accessors"][p["attributes"]["POSITION"]] for k in children for p in d["meshes"][d["nodes"][k]["mesh"]]["primitives"]]
lo=[min(x["min"][k] for x in pos) for k in range(3)];hi=[max(x["max"][k] for x in pos) for k in range(3)]
assert all(abs(a-b)<.00001 for a,b in zip(lo,[-.15,.851,-.091]))
assert all(abs(a-b)<.00003 for a,b in zip(hi,[.849981,1.182727,.611]))
payload.extend(b"\0"*(-len(payload)%4));q["buffers"][0]["byteLength"]=len(payload)
js=json.dumps(q,separators=(",",":"),ensure_ascii=False).encode();js+=b" "*(-len(js)%4)
res=struct.pack("<4sII",b"glTF",2,28+len(js)+len(payload))+struct.pack("<I4s",len(js),b"JSON")+js+struct.pack("<I4s",len(payload),b"BIN\0")+payload
report={"status":"ART_HOLD_W32E_SHARED_BASKET","source_sha256":sha(raw),"glb_sha256":sha(res),"bytes":len(res),"meshes":92,"identical_views":len(maps["bufferViews"]),"source_bounds":[lo,hi],"root_translation":[-.35,-.851,-.26],"scale":1,"materials":[m["name"] for m in q["materials"]]}
if out.exists():
 assert (out/"w32e-basket.glb").read_bytes()==res and json.loads((out/"w32e-basket-manifest.json").read_text())==report
 print("W32E_REPRO_PASS",sha(res),flush=True)
else:
 out.mkdir(parents=True);(out/"w32e-basket.glb").write_bytes(res);(out/"w32e-basket-manifest.json").write_text(json.dumps(report,indent=2))
 print("W32E_BASKET_PASS",json.dumps(report),flush=True)
