"""W28b clothing fit search on native rig, preserving the animation and basket."""
import bpy,os,json,hashlib,math
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
root=Path(os.environ["HOREB_W28_ACTOR_OUTPUT"]);house=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"])
asset=root/"w28-actor.blend";glb=house/"w28-house.glb"
assert sha(asset)=="b6a59c757e50c43d542c01daea3b04afc25e41335d031b01cfcd8afd12115e74"
assert sha(glb)=="fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622"
bpy.ops.wm.open_mainfile(filepath=str(asset),load_ui=False)
scene=bpy.context.scene;rig=bpy.data.objects["MOTHER_PERFORMER__53_BONE_RIG"]
body=bpy.data.objects["ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0"]
actor=[o for o in bpy.data.objects if o.type=="MESH" and (o==body or o.parent==rig)]
assert len(actor)==9
clothes=[o for o in actor if o!=body and o.name!="W19_CC0_Eyes"]
assert len(clothes)==7
fit_names=["Linen_sleeve_l","Linen_sleeve_r","Tunic_orig_hand_draped","Stitched_lower_hem","W22_hand_woven_waist_tie"]
orig={n:[v.co.copy() for v in bpy.data.objects[n].data.vertices] for n in fit_names}
assert len(orig["Linen_sleeve_l"])==len(orig["Linen_sleeve_r"])==420
assert len(orig["Tunic_orig_hand_draped"])==528
prior=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(glb))
imported=[o for o in bpy.data.objects if o not in prior]
basket=next(o for o in imported if o.name.startswith("BASKET_OBJECT_ACTION_ANCHOR"))
props=[]
for o in imported:
 if o.type!="MESH":continue
 p=o.parent
 while p and p!=basket:p=p.parent
 if p==basket or o.name.startswith(("Coarse_work_surface","Domestic_clay_bench","Workshop_wood_support")):
  props.append((o.name,BVHTree.FromPolygons([o.matrix_world@v.co for v in o.data.vertices],[tuple(p.vertices) for p in o.data.polygons])))
assert len(props)==98
offset=Vector((-.58,-.30,.015))
tracks=list(rig.animation_data.nla_tracks)
def geometry(o,dg):
 obj=o.evaluated_get(dg);me=obj.to_mesh()
 vs=[obj.matrix_world@v.co+offset for v in me.vertices];faces=[tuple(p.vertices) for p in me.polygons]
 obj.to_mesh_clear()
 return vs,faces
def fit(sleeve_mm,tunic_mm):
 for n in fit_names:
  o=bpy.data.objects[n];src=orig[n]
  for i,v in enumerate(o.data.vertices):
   p=src[i].copy()
   if n.startswith("Linen_sleeve"):
    j=i//28;center=sum(src[j*28:(j+1)*28],Vector())/28
    radial=p-center
    if radial.length>1e-6:p+=radial.normalized()*sleeve_mm/1000
   else:
    radial=Vector((p.x,p.y+.012,0))
    if radial.length>1e-6:p+=radial.normalized()*tunic_mm/1000
   v.co=p
  o.data.update()
 bpy.context.view_layer.update()
def assess(clip,f,detail=False):
 ad=rig.animation_data;strip=next(t.strips[0] for t in tracks if t.name==clip)
 if ad.action!=strip.action:
  ad.use_nla=False;ad.action=strip.action;ad.action_slot=strip.action_slot
 scene.frame_set(math.floor(f),subframe=f-math.floor(f));bpy.context.view_layer.update()
 dg=bpy.context.evaluated_depsgraph_get()
 geo={o.name:geometry(o,dg) for o in actor}
 trees={n:BVHTree.FromPolygons(v,faces) for n,(v,faces) in geo.items()}
 skin=trees[body.name];hits=[];prop_hits=[]
 for o in clothes:
  pairs=trees[o.name].overlap(skin)
  if pairs:
   h={"mesh":o.name,"pairs":len(pairs)}
   if detail:
    vs,faces=geo[o.name];ids={idx for a,b in pairs for idx in faces[a]}
    h["bounds"]=[[round(min(vs[i][k] for i in ids),4) for k in range(3)],[round(max(vs[i][k] for i in ids),4) for k in range(3)]]
    h["indices_range"]=[min(ids),max(ids)]
    if o.name=="W28c_upper_sewn_shell":h["indices"]=sorted(ids)
   hits.append(h)
 for n,t in trees.items():
  for name,p in props:
   c=len(t.overlap(p))
   if c:prop_hits.append({"mesh":n,"prop":name,"pairs":c})
 return {"clip":clip,"frame":f,"skin_cloth":hits,"prop_hits":prop_hits}

# Author a continuous upper garment shell from CC0 anatomical topology and
# original deform weights, with neck/cuff/waist openings. This is a fitting
# study, not approved fabric draping. Keep the original lower skirt and sash.
from collections import Counter,defaultdict
for t in tracks:t.mute=True
scene.frame_set(1);bpy.context.view_layer.update()
visible=body.vertex_groups["body"].index
valid={v.index for v in body.data.vertices if any(g.group==visible and g.weight>.5 for g in v.groups)}
mods=[(m,m.show_viewport) for m in body.modifiers]
for m,_ in mods:m.show_viewport=False
bpy.context.view_layer.update()
ob=body.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ob.to_mesh()
assert len(me.vertices)==len(body.data.vertices)
coords=[v.co.copy() for v in me.vertices]
ob.to_mesh_clear()
for m,show in mods:m.show_viewport=show
cuff=float(os.environ['W28C_CUFF_CUT'])
assert .24<=cuff<=.294
def eligible(i):
 v=coords[i]
 return i in valid and .89<=v.z<=1.445 and abs(v.x)<=cuff and not(abs(v.x)<.091 and v.z>1.351)
faces=[tuple(f.vertices) for f in body.data.polygons if all(eligible(i) for i in f.vertices)]
# Keep the largest face-connected component. Do not silently include
# separate anatomical helper islands.
adj=defaultdict(list)
for j,f in enumerate(faces):
 for i in f:adj[i].append(j)
remaining=set(range(len(faces)));components=[]
while remaining:
 seen={remaining.pop()};q=list(seen)
 while q:
  j=q.pop()
  for i in faces[j]:
   for k in adj[i]:
    if k in remaining:remaining.remove(k);seen.add(k);q.append(k)
 components.append(seen)
faces=[faces[j] for j in sorted(max(components,key=len))]
ids=sorted(set(i for f in faces for i in f));ix={v:i for i,v in enumerate(ids)}
faces=[tuple(ix[i] for i in f) for f in faces]
verts=[coords[i] for i in ids]
edges=Counter(tuple(sorted((f[j],f[(j+1)%len(f)]))) for f in faces for j in range(len(f)))
boundary=defaultdict(set)
for (i,j),n in edges.items():
 if n==1:boundary[i].add(j);boundary[j].add(i)
loops=[];remaining=set(boundary)
while remaining:
 seen={remaining.pop()};q=list(seen)
 while q:
  for k in boundary[q.pop()]:
   if k in remaining:remaining.remove(k);seen.add(k);q.append(k)
 loops.append(seen)
print("W28C_CUT",json.dumps({"vertices":len(verts),"faces":len(faces),"components":sorted(map(len,components),reverse=True),"boundary_components":[{"vertices":len(v),"bounds":[[round(min(verts[i][k] for i in v),4) for k in range(3)],[round(max(verts[i][k] for i in v),4) for k in range(3)]],"max_degree":max(len(boundary[i]) for i in v)} for v in loops]}),flush=True)
assert len(verts)>600 and len(faces)>500
assert len(loops)==4 and all(len(boundary[i])==2 for i in boundary),"Upper garment requires four closed openings"
# Use the original fabric/UV and exact anatomical skin weights.
tunic=bpy.data.objects["Tunic_orig_hand_draped"]
material=tunic.data.materials[0]
mesh=bpy.data.meshes.new("W28c_upper_sewn_shell_geo");mesh.from_pydata(verts,[],faces);mesh.update()
shell=bpy.data.objects.new("W28c_upper_sewn_shell",mesh);scene.collection.objects.link(shell);shell.parent=rig
mesh.materials.append(material)
uv=mesh.uv_layers.new(name="W28c_linen")
for f in mesh.polygons:
 f.use_smooth=True
 for j in f.loop_indices:
  v=mesh.vertices[mesh.loops[j].vertex_index].co;uv.data[j].uv=(v.x*7+v.y*3+3,v.z*7)
bone_groups={}
for i,src in enumerate(ids):
 weights={body.vertex_groups[g.group].name:g.weight for g in body.data.vertices[src].groups if body.vertex_groups[g.group].name in rig.data.bones and g.weight>1e-6}
 total=sum(weights.values());assert total>.95
 for n,w in weights.items():
  if n not in bone_groups:bone_groups[n]=shell.vertex_groups.new(name=n)
  bone_groups[n].add([i],w/total,"REPLACE")
mod=shell.modifiers.new("W28c_anatomical_skinning","ARMATURE");mod.object=rig
# Cut the closed cylindrical tunic at the waist; preserve exact lower mesh,
# skin weights and UV. The upper shell overlaps under the sash.
import bmesh
bm=bmesh.new();bm.from_mesh(tunic.data)
bmesh.ops.delete(bm,geom=[v for v in bm.verts if v.index>=7*48],context="VERTS")
bm.to_mesh(tunic.data);bm.free();tunic.data.update()
for name in ["Linen_sleeve_l","Linen_sleeve_r"]:bpy.data.objects.remove(bpy.data.objects[name],do_unlink=True)
actor=[o for o in bpy.data.objects if o.type=="MESH" and (o==body or o.parent==rig)]
clothes=[o for o in actor if o!=body and o.name!="W19_CC0_Eyes"]
assert len(actor)==8
normals=[v.normal.copy() for v in mesh.vertices]
# Shape variations use real surface normals; no removal of skin faces.
def shape(mm):
 for v,p,n in zip(mesh.vertices,verts,normals):v.co=p+n*mm/1000
 mesh.update();bpy.context.view_layer.update()




out=Path(os.environ["W28C_CUT_OUTPUT"]);assert not out.exists();out.mkdir(parents=True)
base_frames=[("Mother_GestureTowardsBasket",f) for f in [1,13,21,31,41,48,54,60,66,70,78,88,97,105]]+[("Mother_QuietIdle",f) for f in [1,48,96,144]]
paths=[]
for mm in [18,24,21,15]:
 shape(mm)
 rows=[assess(c,f) for c,f in base_frames]
 skin=sum(h["pairs"] for r in rows for h in r["skin_cloth"]);prop=sum(h["pairs"] for r in rows for h in r["prop_hits"])
 result={"offset_mm":mm,"skin_pairs":skin,"prop_pairs":prop,"rows":rows};paths.append(result)
 print("W28C_CUFF",json.dumps({"cut":cuff,"offset_mm":mm,"skin_pairs":skin,"prop_pairs":prop}),flush=True)
 if skin or prop:continue
 dense=[]
 for clip,fs in [("Mother_GestureTowardsBasket",[j/4 for j in range(4,421)]),("Mother_QuietIdle",list(range(1,145)))]:
  rs=[assess(clip,f) for f in fs]
  bad=[r["frame"] for r in rs if r["skin_cloth"] or r["prop_hits"]]
  dense.append({"clip":clip,"rows":rs,"bad":bad})
  print("W28C_DENSE",json.dumps({"cut":cuff,"offset_mm":mm,"clip":clip,"samples":len(rs),"bad":bad}),flush=True)
  if clip=="Mother_GestureTowardsBasket":
   w=(rig.matrix_world@rig.pose.bones["hand_l"].head)
   assert (w-Vector((.40878424,-.15502822,.94349938))).length<.0001
   assess(clip,60);w=(rig.matrix_world@rig.pose.bones["hand_l"].head)
   assert (w-Vector((.4070375,.0368253,1.1945803))).length<.0001
 result["dense"]=dense
 if all(not r["bad"] for r in dense):
  break
(out/"cut-audit.json").write_text(json.dumps({"status":"W28C_FIT_DIAGNOSTIC","actor_sha256":sha(asset),"house_sha256":sha(glb),"cuff":cuff,"paths":paths},indent=2),encoding="utf8")
