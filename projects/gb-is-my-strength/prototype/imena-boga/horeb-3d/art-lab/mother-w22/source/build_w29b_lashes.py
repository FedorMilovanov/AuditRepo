"""W29b: fit original short upper lash strands using pinned CC0 root references to W29a.
No original actor geometry, material or animation channel is modified.
"""
import bpy,hashlib,json,os,struct,copy
from pathlib import Path
import numpy as np
from mathutils import Vector,kdtree
from mathutils.geometry import barycentric_transform
from mathutils.bvhtree import BVHTree
def sha(b):return hashlib.sha256(b).hexdigest()
g=Path(os.environ["HOREB_W28G_OUTPUT"]);s=Path(os.environ["HOREB_W29A_OUTPUT"]);out=Path(os.environ["HOREB_W29B_OUTPUT"])
gm=json.loads((g/"w28g-manifest.json").read_text(encoding="utf8"))
assert sha(Path(bpy.data.filepath).read_bytes())==gm["blend_sha256"]
raw=(s/"w29a-actor.glb").read_bytes();sm=json.loads((s/"w29a-manifest.json").read_text(encoding="utf8"))
assert sha(raw)==sm["glb_sha256"]=="3cd8372200534849bbdb39ccc6d48dedddce21dac0305ef3963be53a016c5e69"
assert sm["geometry_animation_unchanged"] is True
pack=Path(__file__).resolve().parents[2]/"mother-w19/source/makehuman_system_assets/eyelashes/eyelashes01"
asset_pins={"obj":"856119b0bbc200518d6c9a6c6feaf78da0f9421f6616c6e9a64cec9d6411a754","mhclo":"c551dd4c02d76859019dff280998750d3d0e185acf9c17e513529d69c029c1a4","png":"4b69c0fff2648874460e9caf80c31413c444218a5c50afebc425aeaa65484a35"}
for ext,h in asset_pins.items():assert sha((pack/f"eyelashes01.{ext}").read_bytes())==h,ext
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
scales={};rows=[];active=False
for line in (pack/"eyelashes01.mhclo").read_text(encoding="utf8",errors="replace").splitlines():
 w=line.split()
 if not w or w[0].startswith("#"):continue
 if w[0] in ("x_scale","y_scale","z_scale"):scales[w[0]]=(int(w[1]),int(w[2]),float(w[3]))
 elif w[0]=="verts":active=True
 elif active:
  assert len(w) in (1,9),w
  if len(w)==1:rows.append(([int(w[0])]*3,[1.,0.,0.],[0.,0.,0.]))
  else:rows.append((list(map(int,w[:3])),list(map(float,w[3:6])),list(map(float,w[6:]))))
assert len(rows)==250
scale=[]
for k,axis in (("x_scale",0),("y_scale",2),("z_scale",1)):
 i,j,v=scales[k];scale.append(abs(coords[i][axis]-coords[j][axis])/v)
fit=[]
for ids,w,off in rows:
 co=sum((coords[i]*q for i,q in zip(ids,w)),Vector((0,0,0)))+Vector((off[0]*scale[0],-off[2]*scale[2],off[1]*scale[1]))
 fit.append((co.x,co.z,-co.y))
fit=np.array(fit)
skintri=read(p["indices"],1).reshape(-1,3)
bt=BVHTree.FromPolygons([Vector(x) for x in pos],skintri.tolist(),all_triangles=True)
def bvh(x,f):return BVHTree.FromPolygons([Vector(z) for z in x],f.tolist(),all_triangles=True)
ep=next(m["primitives"][0] for m in d["meshes"] if len(m["primitives"][0].get("targets",[]))==8)
ev=read(ep["attributes"]["POSITION"],3);et=read(ep["indices"],1).reshape(-1,3)
eye=bvh(ev,et)
bp=next(m["primitives"][0] for m in d["meshes"] if m["name"]=="W28t_CC0_brows")
bv=read(bp["attributes"]["POSITION"],3);btf=read(bp["indices"],1).reshape(-1,3);bm=[read(t["POSITION"],3) for t in bp["targets"]]
# Use the actual imported blink weights from the pinned W28t audit, not a coarse grid.
audit_path=Path(os.environ["HOREB_W28T_OUTPUT"])/"w28t-brow-audit.json"
audit_bytes=audit_path.read_bytes()
assert sha(audit_bytes)==sm["brow_audit_sha256"]
audit=json.loads(audit_bytes)
assert [len(c["rows"]) for c in audit["clips"]]==[417,144] and all(not c["bad"] for c in audit["clips"])
sample_weights=sorted({round(float(r["blink"][0]),7) for c in audit["clips"] for r in c["rows"]})
assert len(sample_weights)>=19 and sample_weights[0]==0 and sample_weights[-1]==1
samples={(x,x) for x in sample_weights}
# Small extra guard around the nontrivial interpolation weights.
for x in sample_weights:
 if 0<x<1:
  for eps in (-.00005,.00005):samples.add((x+eps,x+eps))
samples.update(((1,0),(0,1)))
states=[]
for wl,wr in sorted(samples):
 states.append((wl,wr,bvh(pos+wl*targets[0]+wr*targets[1],skintri),bvh(bv+wl*bm[0]+wr*bm[1],btf)))
# Upper lid root row, selected from the authored CC0 proxy, not the protruding tips.
root_indices=[0,1,2,3,4,5,6,7,8,18,19,20,21,24,27,30,31,32,33,43]
def root_options(x):
 x=Vector(x);near=bt.find_nearest_range(x,.0011)
 options=[]
 for h,n,k,dist in sorted(near,key=lambda q:(q[3],q[2])):
  if n.z<-.2:continue
  ids=skintri[k];a,b,c=[Vector(pos[j]) for j in ids]
  bary=np.array(barycentric_transform(h,a,b,c,Vector((1,0,0)),Vector((0,1,0)),Vector((0,0,1))))
  if np.min(bary)<-.0001 or any(sum(float(z) for j,z in zip(joints[k],weights[k]) if j!=head)>.001 for k in ids):continue
  if any(np.linalg.norm(bary@pos[ids]-ob@pos[oi])<.00015 for oi,ob in options):continue
  options.append((ids,bary))
  if len(options)>=5:break
 return options
def strand(anchor,w,offset,length,lift,side):
 ids,bary=anchor
 pts=pos[ids]+w[0]*targets[0][ids]+w[1]*targets[1][ids]
 p=bary@pts
 n=np.cross(pts[1]-pts[0],pts[2]-pts[0]);n/=np.linalg.norm(n)
 # Short tapered ribbons curve outward, following the actual lid surface.
 if n[2]<-.65:return None
 own=w[0] if side==1 else w[1]
 front=np.array([.10*side,lift*(1-own)-.16*own,1.])
 direction=front+1.15*n;direction/=np.linalg.norm(direction)
 tangent=np.cross(direction,np.array([0.,1.,0.]));tangent/=np.linalg.norm(tangent)
 q=p+n*offset
 mid=q+direction*length*.55
 tip=q+direction*length+np.array([.00012*side,.00025,0])
 width=.000075
 return np.array([q-tangent*width,q+tangent*width,mid-tangent*width*.55,mid+tangent*width*.55,tip])
local_faces=np.array([[0,1,2],[1,3,2],[2,3,4]])
accepted=[];allv=[];allm=[[],[]];faces=[]
# Greedy symmetric pair selection. Require independent sample safety; no exceptions for overlaps.
root_candidates=[]
ordered=sorted(root_indices,key=lambda k:fit[k,0])
for i,j in zip(ordered,ordered[1:]):
 for t in (0.,.3333333333,.6666666667):
  root_candidates.append((i,j,t,(1-t)*fit[i]+t*fit[j],(1-t)*fit[i+125]+t*fit[j+125]))
root_candidates.append((ordered[-1],ordered[-1],0.,fit[ordered[-1]],fit[ordered[-1]+125]))
for i,j,t,left,right in root_candidates:
 if accepted and min(abs(left[0]-q["x"]) for q in accepted)<.00065:continue
 anchors=[root_options(left),root_options(right)]
 if any(not a for a in anchors):continue
 picked=None
 for length in (.0022,.0017,.0012):
  for offset in (.00015,.00025,.0004,.0006,.00085):
   for lift in (.25,.05,-.10,-.3):
    pair=[]
    for options,side in zip(anchors,(1,-1)):
     found=None
     for a in options:
      vs=[strand(a,w,offset,length,lift,side) for w in ((0,0),(1,0),(0,1))]
      if any(x is None for x in vs):continue
      base=vs[0];dp=[vs[1]-base,vs[2]-base]
      if np.max(np.abs(dp[1 if side==1 else 0]))>1e-8:continue
      good=True
      for wl,wr,st,br in states:
       ft=bvh(base+wl*dp[0]+wr*dp[1],local_faces)
       if ft.overlap(st) or ft.overlap(eye) or ft.overlap(br):good=False;break
      if good:
       # Also reject intersections with previously accepted strands at every state.
       if allv:
        for wl,wr,st,br in states:
         existing=bvh(np.array(allv)+wl*np.array(allm[0])+wr*np.array(allm[1]),np.array(faces))
         if existing.overlap(bvh(base+wl*dp[0]+wr*dp[1],local_faces)):good=False;break
      if good:found=(base,dp);break
     if found is None:break
     pair.append(found)
    if len(pair)==2:picked=(length,offset,lift,pair);break
   if picked:break
  if picked:break
 if not picked:continue
 length,offset,lift,pair=picked
 accepted.append({"source_indices":[i,j],"interpolation":t,"x":float(left[0]),"length_mm":length*1000,"offset_mm":offset*1000,"lift":lift})
 for base,dp in pair:
  j=len(allv);allv.extend(base);faces.extend(local_faces+j)
  for k in range(2):allm[k].extend(dp[k])
assert len(accepted)>=12,("Insufficient safe symmetric upper-lid roots",len(accepted))
v=np.array(allv);morph=np.array(allm);tri=np.array(faces);sets=list(map(set,tri));final_checks=[]
for wl,wr,st,br in states:
 ft=bvh(v+wl*morph[0]+wr*morph[1],tri)
 counts=[len(ft.overlap(st)),len(ft.overlap(eye)),len(ft.overlap(br)),sum(1 for i,j in ft.overlap(ft) if i<j and not sets[i]&sets[j])]
 final_checks.append({"blink":[wl,wr],"overlap_pairs":counts})
assert not any(any(t["overlap_pairs"]) for t in final_checks),final_checks
print("W29B_STRANDS",json.dumps(accepted),flush=True)
maxgap=max(np.diff([q["x"] for q in accepted]))*1000
print("W29B_ROOT_GAP_MM",maxgap,flush=True)
def normals(x):
 face=np.cross(x[tri[:,1]]-x[tri[:,0]],x[tri[:,2]]-x[tri[:,0]])
 accum=np.zeros_like(x)
 for i in range(3):np.add.at(accum,tri[:,i],face)
 n=np.linalg.norm(accum,axis=1);assert np.all(n>1e-12)
 return accum/n[:,None]
norm=normals(v)
mat=len(d["materials"]);d["materials"].append({"name":"W29b_short_upper_lashes","doubleSided":True,"pbrMetallicRoughness":{"baseColorFactor":[.065,.038,.025,1],"metallicFactor":0,"roughnessFactor":.9}})
j=np.zeros((len(v),4),dtype=np.uint16);j[:,0]=head;w=np.zeros((len(v),4));w[:,0]=1
pr={"attributes":{"POSITION":append(v,"VEC3",3),"NORMAL":append(norm,"VEC3",3),"JOINTS_0":append(j,"VEC4",4,5123),"WEIGHTS_0":append(w,"VEC4",4)},"indices":append(tri.reshape(-1),"SCALAR",1,5123,34963),"material":mat,"targets":[]}
for dp in morph:pr["targets"].append({"POSITION":append(dp,"VEC3",3),"NORMAL":append(normals(v+dp)-norm,"VEC3",3)})
mesh=len(d["meshes"]);d["meshes"].append({"name":"W29b_CC0_lashes","primitives":[pr],"weights":[0,0],"extras":{"targetNames":["blink_left","blink_right"]}})
node=len(d["nodes"]);d["nodes"].append({"name":"W29b_CC0_lashes","mesh":mesh,"skin":0})
parent=next(i for i,n in enumerate(d["nodes"]) if 53 in n.get("children",[]));d["nodes"][parent]["children"].append(node)
for a in d["animations"]:
 c=next(c for c in a["channels"] if c["target"]=={"node":53,"path":"weights"})
 a["channels"].append({"sampler":c["sampler"],"target":{"node":node,"path":"weights"}})
d["buffers"][0]["byteLength"]=len(payload);result=encode(d,bytes(payload))
r,rb=decode(result);assert rb[:len(b)]==b
r["nodes"][parent]["children"].pop();r["nodes"].pop();r["meshes"].pop()
for a in r["animations"]:a["channels"].pop()
for k in ("accessors","bufferViews","images","samplers","textures","materials"):r[k]=r[k][:len(original[k])]
r["buffers"]=original["buffers"];assert r==original
report={"status":"ART_HOLD_W29B_LASH_TRIAL","source_sha256":sha(raw),"glb_sha256":sha(result),"glb_bytes":len(result),"house_sha256":sm["house_sha256"],"existing_actor_unchanged":True,"vertices":len(v),"triangles":len(tri),"source_asset_sha256":asset_pins,"strand_count":2*len(accepted),"max_root_gap_mm":float(maxgap),"sample_weights":sample_weights,"source_brow_audit_sha256":sha(audit_bytes),"roots":accepted,"trials":final_checks,"blink_morph_max_mm":[float(np.linalg.norm(t,axis=1).max()*1000) for t in morph]}
if out.exists():
 assert (out/"w29b-actor.glb").read_bytes()==result and json.loads((out/"w29b-manifest.json").read_text())==report
 print("W29B_REPRO_PASS",sha(result))
else:
 out.mkdir(parents=True);(out/"w29b-actor.glb").write_bytes(result);(out/"w29b-manifest.json").write_text(json.dumps(report,indent=2),encoding="utf8")
 print("W29B_LASH_PASS",sha(result),len(result),len(accepted),flush=True)
