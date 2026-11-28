"""W28t: fit the pinned MakeHuman CC0 eyebrow proxy to the accepted W28s actor.
No original actor geometry, material or animation channel is modified.
"""
import bpy,hashlib,json,os,struct,copy
from pathlib import Path
import numpy as np
from mathutils import Vector,kdtree
from mathutils.geometry import barycentric_transform
from mathutils.bvhtree import BVHTree
def sha(b):return hashlib.sha256(b).hexdigest()
g=Path(os.environ["HOREB_W28G_OUTPUT"]);s=Path(os.environ["HOREB_W28S_OUTPUT"]);out=Path(os.environ["HOREB_W28T_OUTPUT"])
gm=json.loads((g/"w28g-manifest.json").read_text(encoding="utf8"))
assert sha(Path(bpy.data.filepath).read_bytes())==gm["blend_sha256"]
raw=(s/"w28s-actor.glb").read_bytes();sm=json.loads((s/"w28s-manifest.json").read_text(encoding="utf8"))
assert sha(raw)==sm["glb_sha256"]=="52053a9553e195fd32d413b49509ab9360af2810148c570c73464c25f6b7943d"
assert sm["geometry_animation_unchanged"] is True
pack=Path(__file__).resolve().parents[2]/"mother-w19/source/makehuman_system_assets/eyebrows/eyebrow001"
pins={"obj":"df306727191e5f107b8448304945e2478a880c647cf899c570b6895c5feb0288","mhclo":"ae550e05239cbc78d61bdb326372f869de8b877478d0801b609b729c9cf930ae","png":"9940f7d0b1b223709a19b05156ba6f6e9e4dbdbced02d7574f4d51d72c58967b"}
for ext,h in pins.items():assert sha((pack/f"eyebrow001.{ext}").read_bytes())==h,ext
def decode(b):
 assert struct.unpack_from("<4sII",b)==(b"glTF",2,len(b))
 n,t=struct.unpack_from("<I4s",b,12);assert t==b"JSON"
 m,t=struct.unpack_from("<I4s",b,20+n);assert t==b"BIN\0" and len(b)==28+n+m
 return json.loads(b[20:20+n]),b[28+n:]
def encode(d,b):
 j=json.dumps(d,separators=(",",":"),ensure_ascii=False).encode();j+=b" "*(-len(j)%4);b+=b"\0"*(-len(b)%4)
 return struct.pack("<4sII",b"glTF",2,28+len(j)+len(b))+struct.pack("<I4s",len(j),b"JSON")+j+struct.pack("<I4s",len(b),b"BIN\0")+b
d,b=decode(raw);original=copy.deepcopy(d);payload=bytearray(b)
def read(i,dim):
 a=d["accessors"][i];v=d["bufferViews"][a["bufferView"]];typ={5126:"<f4",5123:"<u2",5121:"u1"}[a["componentType"]]
 assert v.get("byteStride",np.dtype(typ).itemsize*dim)==np.dtype(typ).itemsize*dim
 return np.frombuffer(b,dtype=typ,count=a["count"]*dim,offset=v.get("byteOffset",0)+a.get("byteOffset",0)).reshape(-1,dim).copy()
def view(data,target=None):
 payload.extend(b"\0"*(-len(payload)%4));i=len(d["bufferViews"]);v={"buffer":0,"byteOffset":len(payload),"byteLength":len(data)}
 if target:v["target"]=target
 d["bufferViews"].append(v);payload.extend(data);return i
def append(data,typ,dim,component=5126,target=34962):
 a=np.asarray(data,dtype={5126:"<f4",5123:"<u2"}[component]).reshape(-1,dim);assert np.isfinite(a).all()
 i=view(a.tobytes(),target);j=len(d["accessors"]);d["accessors"].append({"bufferView":i,"componentType":component,"count":len(a),"type":typ,"min":a.min(0).tolist(),"max":a.max(0).tolist()});return j
o=bpy.data.objects["ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0"];ks=o.data.shape_keys.key_blocks
coords=[v.co.copy() for v in ks[0].data]
for k in list(ks)[1:]:
 for i,v in enumerate(k.data):coords[i]+=(v.co-ks[0].data[i].co)*k.value
tree=kdtree.KDTree(len(coords))
for i,c in enumerate(coords):tree.insert(c,i)
tree.balance()
p=d["meshes"][0]["primitives"][0];attr=p["attributes"]
pos=read(attr["POSITION"],3);normal=read(attr["NORMAL"],3);joints=read(attr["JOINTS_0"],4);weights=read(attr["WEIGHTS_0"],4)
matches=[tree.find(Vector((x,-z,y))) for x,y,z in pos]
assert len(pos)==14517 and max(t[2] for t in matches)<1e-6
lookup={}
for i,t in enumerate(matches):lookup.setdefault(t[1],i)
head=d["skins"][0]["joints"].index(next(i for i,n in enumerate(d["nodes"]) if n.get("name")=="head"))
targets=[read(t["POSITION"],3) for t in p["targets"]]
# Fit the authored barycentric proxy to the exact shaped mesh.
scales={};rows=[];active=False
for line in (pack/"eyebrow001.mhclo").read_text(encoding="utf8",errors="replace").splitlines():
 w=line.split()
 if not w or w[0].startswith("#"):continue
 if w[0] in ("x_scale","y_scale","z_scale"):scales[w[0]]=(int(w[1]),int(w[2]),float(w[3]))
 elif w[0]=="verts":active=True
 elif active:
  assert len(w) in (1,9),w
  if len(w)==1:rows.append(([int(w[0])]*3,[1.,0.,0.],[0.,0.,0.]))
  else:rows.append((list(map(int,w[:3])),list(map(float,w[3:6])),list(map(float,w[6:]))))
assert len(rows)==124
scale=[]
for k,axis in (("x_scale",0),("y_scale",2),("z_scale",1)):
 i,j,v=scales[k];scale.append(abs(coords[i][axis]-coords[j][axis])/v)
fitted=[];morph=[[],[]];max_nonhead=0
for ids,w,off in rows:
 assert abs(sum(w)-1)<.001 and all(i in lookup for i in ids)
 ix=[lookup[i] for i in ids]
 # Explicitly verify the proxy is entirely attached to the head before rigid weighting.
 nonhead=max(sum(float(v) for j,v in zip(joints[i],weights[i]) if j!=head) for i in ix)
 max_nonhead=max(max_nonhead,nonhead);assert nonhead<.001,(ids,nonhead)
 co=sum((coords[i]*q for i,q in zip(ids,w)),Vector((0,0,0)))
 co+=Vector((off[0]*scale[0],-off[2]*scale[2],off[1]*scale[1]))
 fitted.append((co.x,co.z,-co.y))
 for k,t in enumerate(targets):morph[k].append(sum((t[i]*q for i,q in zip(ix,w)),np.zeros(3)))
fitted=np.array(fitted);morph=np.array(morph)
assert np.all(np.abs(fitted[:,0])<.08) and np.all((fitted[:,1]>1.43)&(fitted[:,1]<1.52))
uv=[];faces=[];pairs={};order=[]
for line in (pack/"eyebrow001.obj").read_text(encoding="utf8",errors="replace").splitlines():
 w=line.split()
 if not w:continue
 if w[0]=="vt":uv.append((float(w[1]),1-float(w[2])))
 if w[0]=="f":
  f=[]
  for token in w[1:]:
   vi,ui=map(int,token.split("/")[:2]);key=(vi-1,ui-1)
   if key not in pairs:pairs[key]=len(order);order.append(key)
   f.append(pairs[key])
  for i in range(1,len(f)-1):faces.append((f[0],f[i],f[i+1]))
assert len(uv)==126 and len(order)==126 and len(faces)==192
idx=np.array([v for v,u in order]);tri=np.array(faces);v=fitted[idx];uv=np.array([uv[u] for i,u in order])
skintri=read(p["indices"],1).reshape(-1,3)
bt=BVHTree.FromPolygons([Vector(x) for x in pos],skintri.tolist(),all_triangles=True)
# Subdivide the authored decal before projecting onto the actual shaped skin.
# Preserve original UVs and use shared edge midpoints within each UV island.
for _ in range(2):
 vv=list(v);uu=list(uv);edges={};ff=[]
 def mid(a,b):
  key=tuple(sorted((int(a),int(b))))
  if key not in edges:
   edges[key]=len(vv);vv.append((v[a]+v[b])*.5);uu.append((uv[a]+uv[b])*.5)
  return edges[key]
 for va,vb,vc in tri:
  ab,bc,ca=mid(va,vb),mid(vb,vc),mid(vc,va)
  ff.extend(((va,ab,ca),(ab,vb,bc),(ca,bc,vc),(ab,bc,ca)))
 v=np.array(vv);uv=np.array(uu);tri=np.array(ff)
surface=[];directions=[];fitted_targets=[[],[]];project_dist=[]
for x in v:
 h,n,i,dist=bt.find_nearest(Vector(x));assert h is not None and dist<.003
 ids=skintri[i];pa,pb,pc=[Vector(pos[k]) for k in ids]
 bary=barycentric_transform(h,pa,pb,pc,Vector((1,0,0)),Vector((0,1,0)),Vector((0,0,1)))
 assert min(bary)>-.0001 and max(bary)<1.0001
 assert all(sum(float(z) for j,z in zip(joints[k],weights[k]) if j!=head)<.001 for k in ids)
 sn=sum((Vector(normal[k])*q for k,q in zip(ids,bary)),Vector((0,0,0))).normalized()
 assert sn.dot(n)>.5
 surface.append(tuple(h));directions.append(tuple(sn));project_dist.append(dist*1000)
 for k,t in enumerate(targets):fitted_targets[k].append(sum((t[i]*q for i,q in zip(ids,bary)),np.zeros(3)))
surface=np.array(surface);directions=np.array(directions);morph=np.array(fitted_targets)
# Check neutral and all corners of the two eyelid morph weights independently.
# Full animated audit still required; no collisions are excused for transparent pixels.
tests=[];chosen=None
skin_trees=[]
for wl,wr in ((0,0),(1,0),(0,1),(1,1),(.5,.5)):
 sp=pos+wl*targets[0]+wr*targets[1]
 skin_trees.append((wl,wr,BVHTree.FromPolygons([Vector(x) for x in sp],skintri.tolist(),all_triangles=True)))
for offset in (.00025,.0004,.0006,.0008,.001,.0013,.0016):
 vv=surface+directions*offset
 counts=[]
 for wl,wr,st in skin_trees:
  xx=vv+wl*morph[0]+wr*morph[1]
  ft=BVHTree.FromPolygons([Vector(x) for x in xx],tri.tolist(),all_triangles=True)
  counts.append(len(st.overlap(ft)))
 tests.append({"offset_mm":offset*1000,"overlap_pairs":counts})
 if not any(counts):v=vv;chosen=offset;break
print("W28T_CONFORM_TESTS",json.dumps(tests),flush=True)
assert chosen is not None,"No safe conforming eyebrow offset"
def normals(x):
 face=np.cross(x[tri[:,1]]-x[tri[:,0]],x[tri[:,2]]-x[tri[:,0]])
 accum=np.zeros_like(x)
 for i in range(3):np.add.at(accum,tri[:,i],face)
 n=np.linalg.norm(accum,axis=1);assert np.all(n>1e-10)
 return accum/n[:,None]
norm=normals(v)
# Diagnostic rest-fit distance and overlap: no claim of clear animated geometry yet.
ft=BVHTree.FromPolygons([Vector(x) for x in v],tri.tolist(),all_triangles=True)
dist=[bt.find_nearest(Vector(x))[3]*1000 for x in v]
overlap=len(bt.overlap(ft));print("W28T_FIT",min(dist),max(dist),overlap,"blink_delta_mm",np.max(np.linalg.norm(morph,axis=-1))*1000,flush=True)
png=(pack/"eyebrow001.png").read_bytes();im=len(d["images"]);d["images"].append({"name":"CC0_eyebrow001","bufferView":view(png),"mimeType":"image/png"})
sam=len(d["samplers"]);d["samplers"].append({"magFilter":9729,"minFilter":9987,"wrapS":33071,"wrapT":33071})
tex=len(d["textures"]);d["textures"].append({"sampler":sam,"source":im})
mat=len(d["materials"]);d["materials"].append({"name":"W28t_CC0_eyebrow","doubleSided":True,"alphaMode":"BLEND","pbrMetallicRoughness":{"baseColorTexture":{"index":tex},"metallicFactor":0,"roughnessFactor":.88}})
j=np.zeros((len(v),4),dtype=np.uint16);j[:,0]=head;w=np.zeros((len(v),4));w[:,0]=1
pr={"attributes":{"POSITION":append(v,"VEC3",3),"NORMAL":append(norm,"VEC3",3),"TEXCOORD_0":append(uv,"VEC2",2),"JOINTS_0":append(j,"VEC4",4,5123),"WEIGHTS_0":append(w,"VEC4",4)},"indices":append(tri.reshape(-1),"SCALAR",1,5123,34963),"material":mat}
# Keep brow morphs coupled to the original blink channels when source fit vertices move.
morph_stats=[]
if np.max(np.abs(morph))>1e-9:
 pr["targets"]=[]
 for q in morph:
  dp=q;pr["targets"].append({"POSITION":append(dp,"VEC3",3),"NORMAL":append(normals(v+dp)-norm,"VEC3",3)})
  morph_stats.append(float(np.max(np.linalg.norm(dp,axis=1))*1000))
mesh=len(d["meshes"]);newmesh={"name":"W28t_CC0_brows","primitives":[pr]}
if morph_stats:newmesh.update({"weights":[0,0],"extras":{"targetNames":["blink_left","blink_right"]}})
d["meshes"].append(newmesh);node=len(d["nodes"]);d["nodes"].append({"name":"W28t_CC0_brows","mesh":mesh,"skin":0})
parent=next(i for i,n in enumerate(d["nodes"]) if 53 in n.get("children",[]));d["nodes"][parent]["children"].append(node)
if morph_stats:
 for a in d["animations"]:
  c=next(c for c in a["channels"] if c["target"]=={"node":53,"path":"weights"})
  a["channels"].append({"sampler":c["sampler"],"target":{"node":node,"path":"weights"}})
d["buffers"][0]["byteLength"]=len(payload);result=encode(d,bytes(payload))
r,rb=decode(result);assert rb[:len(b)]==b
r["nodes"][parent]["children"].pop();r["nodes"].pop();r["meshes"].pop()
if morph_stats:
 for a in r["animations"]:a["channels"].pop()
for k in ("accessors","bufferViews","images","samplers","textures","materials"):r[k]=r[k][:len(original[k])]
r["buffers"]=original["buffers"];assert r==original
report={"status":"ART_HOLD_W28T_BROW_TRIAL","source_sha256":sha(raw),"glb_sha256":sha(result),"glb_bytes":len(result),"source_asset_sha256":pins,"house_sha256":sm["house_sha256"],"existing_actor_unchanged":True,"vertices":len(v),"triangles":len(tri),"max_nonhead_weight":max_nonhead,"rest_skin_overlap_pairs":overlap,"rest_clearance_mm":[min(dist),max(dist)],"blink_morph_max_mm":morph_stats,"surface_projection_max_mm":max(project_dist),"conform_offset_mm":chosen*1000,"conform_trials":tests}
if out.exists():
 assert (out/"w28t-actor.glb").read_bytes()==result and json.loads((out/"w28t-manifest.json").read_text())==report
 print("W28T_REPRODUCIBLE",sha(result))
else:
 out.mkdir(parents=True);(out/"w28t-actor.glb").write_bytes(result);(out/"w28t-manifest.json").write_text(json.dumps(report,indent=2),encoding="utf8")
 print("W28T_BROW_PASS",sha(result),len(result),report,flush=True)
