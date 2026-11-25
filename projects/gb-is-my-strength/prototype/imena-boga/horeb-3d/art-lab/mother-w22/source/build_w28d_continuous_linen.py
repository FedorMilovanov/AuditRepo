"""W28d continuous linen garment study. Preserve exact anatomy and animation."""
import bpy,os,json,hashlib,math,bmesh
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from collections import Counter,defaultdict
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
src=Path(os.environ["HOREB_W28C_OUTPUT"]);house=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"]);out=Path(os.environ["HOREB_W28D_OUTPUT"])
assert not out.exists();out.mkdir(parents=True)
asset=src/"w28c-fitted-actor.blend";glb=house/"w28-house.glb"
assert sha(asset)=="de32880c1c4f41fea3d80e165f7f26f4bc5f03700dc7a20272418d54fa242e80"
assert sha(glb)=="fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622"
bpy.ops.wm.open_mainfile(filepath=str(asset),load_ui=False)
scene=bpy.context.scene;rig=bpy.data.objects["MOTHER_PERFORMER__53_BONE_RIG"];body=bpy.data.objects["ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0"]
upper=bpy.data.objects["W28c_upper_sewn_shell"];skirt=bpy.data.objects["Tunic_orig_hand_draped"];belt=bpy.data.objects["W22_hand_woven_waist_tie"]
def boundary(mesh):
 es=Counter(tuple(sorted((p.vertices[j],p.vertices[(j+1)%len(p.vertices)]))) for p in mesh.polygons for j in range(len(p.vertices)))
 adj=defaultdict(set)
 for (i,j),n in es.items():
  assert n<=2
  if n==1:adj[i].add(j);adj[j].add(i)
 assert all(len(x)==2 for x in adj.values())
 remain=set(adj);loops=[]
 while remain:
  start=min(remain);prev=None;cur=start;loop=[]
  while cur in remain:
   remain.remove(cur);loop.append(cur);nxt=min(adj[cur]-({prev} if prev is not None else set()));prev,cur=cur,nxt
  assert cur==start;loops.append(loop)
 return loops
up=[v.co.copy() for v in upper.data.vertices];sk=[v.co.copy() for v in skirt.data.vertices]
loops=boundary(upper.data);assert sorted(map(len,loops))==[34,34,46,64]
waist=next(l for l in loops if len(l)==46);cuffs=[l for l in loops if len(l)==34];neck=next(l for l in loops if len(l)==64)
weights=lambda o,v:{o.vertex_groups[g.group].name:g.weight for g in v.groups}
uw=[weights(upper,v) for v in upper.data.vertices];sw=[weights(skirt,v) for v in skirt.data.vertices]
faces=[tuple(p.vertices) for p in upper.data.polygons]
# Retain original draped skirt to the sash ring (z=.85). Remove only the
# obsolete open top ring, and stitch the two ordered boundaries.
skfaces=[tuple(len(up)+i for i in p.vertices) for p in skirt.data.polygons if max(p.vertices)<288]
top=[len(up)+i for i in range(240,288)]
orig=up+sk[:288];weights_all=uw+sw[:288]
def theta(v):return math.atan2(v.y+.012,v.x)%(2*math.pi)
def ordered(loop):
 # Respect actual boundary adjacency, not polar sorting of irregular anatomy.
 a=list(loop)
 area=sum(orig[a[i]].x*orig[a[(i+1)%len(a)]].y-orig[a[(i+1)%len(a)]].x*orig[a[i]].y for i in range(len(a)))
 if area<0:a.reverse()
 k=min(range(len(a)),key=lambda j:abs(math.atan2(orig[a[j]].y+.012,orig[a[j]].x)))
 return a[k:]+a[:k]
waist=ordered(waist);top=ordered(top)
def fractions(loop):
 dist=[0.]
 for i in range(len(loop)):dist.append(dist[-1]+(orig[loop[(i+1)%len(loop)]]-orig[loop[i]]).length)
 return [x/dist[-1] for x in dist]
wf,tf=fractions(waist),fractions(top)
waist_angles={i:2*math.pi*wf[k]+math.atan2(orig[waist[0]].y+.012,orig[waist[0]].x) for k,i in enumerate(waist)}
i=j=0;bridge=[]
while i<len(waist) or j<len(top):
 a=waist[i%len(waist)];b=top[j%len(top)]
 na=wf[i+1] if i<len(waist) else math.inf
 nb=tf[j+1] if j<len(top) else math.inf
 if na<=nb:bridge.append((a,b,waist[(i+1)%len(waist)]));i+=1
 else:bridge.append((a,b,top[(j+1)%len(top)]));j+=1
mesh=bpy.data.meshes.new("W28d_continuous_linen_geo");mesh.from_pydata(orig,[],faces+skfaces+bridge);mesh.update()
dress=bpy.data.objects.new("W28d_continuous_linen",mesh);scene.collection.objects.link(dress);dress.parent=rig
mesh.materials.append(upper.data.materials[0]);uv=mesh.uv_layers.new(name="W28d_linen")
for p in mesh.polygons:
 p.use_smooth=True
 for j in p.loop_indices:
  v=mesh.vertices[mesh.loops[j].vertex_index].co
  uv.data[j].uv=(v.x*7+v.y*3+3,v.z*7)
groups={}
for i,ww in enumerate(weights_all):
 for n,w in ww.items():
  if n not in groups:groups[n]=dress.vertex_groups.new(name=n)
  groups[n].add([i],w,"REPLACE")
mod=dress.modifiers.new("Original_deform_weights","ARMATURE");mod.object=rig
for o in [upper,skirt]:bpy.data.objects.remove(o,do_unlink=True)
# Recalculate normals on the connected mesh and verify topology.
bm=bmesh.new();bm.from_mesh(mesh);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(mesh);bm.free();mesh.update()
assert sorted(map(len,boundary(mesh)))==[34,34,48,64]
# Smooth the cuffs toward an evenly spaced plane perpendicular to the
# upperarm; keep the anatomical skin weights on every boundary vertex.
cuff_targets={}
for l in cuffs:
 center=sum((orig[i] for i in l),Vector())/len(l)
 axis=(rig.data.bones["upperarm_l" if center.x>0 else "upperarm_r"].tail_local-rig.data.bones["upperarm_l" if center.x>0 else "upperarm_r"].head_local).normalized()
 for i in l:
  v=orig[i];rad=v-center;plane=rad-axis*rad.dot(axis)
  cuff_targets[i]=center+plane
# Edge graph used for local smoothing of cuff rim and its adjacent ring.
neighbors=defaultdict(set)
for e in mesh.edges:
 a,b=e.vertices;neighbors[a].add(b);neighbors[b].add(a)
belt_orig=[v.co.copy() for v in belt.data.vertices]
def ease(x):
 x=max(0,min(1,x));return x*x*(3-2*x)
def shape(waist_x,waist_y,chest_ease,cuff_blend):
 for i,v in enumerate(mesh.vertices):
  p=orig[i].copy()
  if i<len(up):
   # Smoothly flare lower torso toward the waist rather than leaving a
   # separate skin-tight top. Chest ease uses a broad elliptical envelope.
   a=waist_angles.get(i,theta(p));low=1 if i in waist_angles else ease((1.10-p.z)/.20)
   tx=waist_x*math.cos(a);ty=-.012+waist_y*math.sin(a)
   p.x=p.x*(1-low)+tx*low;p.y=p.y*(1-low)+ty*low
   c=ease((p.z-.98)/.10)*ease((1.32-p.z)/.13)*ease((.20-abs(p.x))/.065)
   # Flatten separate breast contours through a smooth modest fabric front.
   if p.y<-.012:
    target=-.012-(.173+chest_ease)*math.sqrt(max(0,1-(p.x/.255)**2))
    p.y=min(p.y,p.y*(1-c)+target*c)
   else:
    target=-.012+.13*math.sqrt(max(0,1-(p.x/.255)**2))
    p.y=max(p.y,p.y*(1-c)+target*c)
   if i in cuff_targets:p=p.lerp(cuff_targets[i],cuff_blend)
  v.co=p
 mesh.update();bpy.context.view_layer.update()
 # Belt remains at the authored sash position; it is a separate sewn layer.
 for v,p in zip(belt.data.vertices,belt_orig):v.co=p
 belt.data.update()
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
actor=[o for o in bpy.data.objects if o.type=="MESH" and (o==body or o.parent==rig)]
assert len(actor)==7,[o.name for o in actor]
clothes=[o for o in actor if o!=body and o.name!="W19_CC0_Eyes"]
tracks=list(rig.animation_data.nla_tracks);offset=Vector((-.58,-.30,.015))
def assess(clip,f):
 ad=rig.animation_data;s=next(t.strips[0] for t in tracks if t.name==clip)
 if ad.action!=s.action:ad.use_nla=False;ad.action=s.action;ad.action_slot=s.action_slot
 scene.frame_set(math.floor(f),subframe=f-math.floor(f));bpy.context.view_layer.update()
 w=rig.matrix_world@rig.pose.bones["hand_l"].head
 if clip=="Mother_GestureTowardsBasket" and f==60:assert (w-Vector((.4070375,.0368253,1.1945803))).length<.0001
 dg=bpy.context.evaluated_depsgraph_get();trees={}
 for o in actor:
  ob=o.evaluated_get(dg);me=ob.to_mesh()
  trees[o.name]=BVHTree.FromPolygons([ob.matrix_world@v.co+offset for v in me.vertices],[tuple(p.vertices) for p in me.polygons]);ob.to_mesh_clear()
 skin=[];hits=[]
 for o in clothes:
  n=len(trees[body.name].overlap(trees[o.name]))
  if n:skin.append([o.name,n])
 for name,t in trees.items():
  for prop,bvh in props:
   n=len(t.overlap(bvh))
   if n:hits.append([name,prop,n])
 return {"clip":clip,"frame":f,"skin":skin,"props":hits}
coarse=[("Mother_GestureTowardsBasket",f) for f in [1,13,21,31,41,48,60,70,78,88,97,105]]+[("Mother_QuietIdle",f) for f in [1,48,96,144]]
paths=[]
for params in [(.238,.205,.018,.45),(.238,.205,.018,.2),(.225,.19,.012,.2),(.218,.18,.008,0),(.238,.205,.018,0)]:
 shape(*params);rows=[assess(c,f) for c,f in coarse]
 bad=[r for r in rows if r["skin"] or r["props"]]
 rec={"params":params,"coarse":rows,"bad":len(bad)};paths.append(rec)
 print("W28D_FIT",json.dumps({"params":params,"bad":len(bad),"first":next(iter(bad),None)}),flush=True)
 if bad:continue
 dense=[]
 for c,fs in [("Mother_GestureTowardsBasket",[j/4 for j in range(4,421)]),("Mother_QuietIdle",list(range(1,145)))]:
  rs=[assess(c,f) for f in fs];b=[r["frame"] for r in rs if r["skin"] or r["props"]];dense.append({"clip":c,"rows":rs,"bad":b})
  print("W28D_DENSE",json.dumps({"clip":c,"samples":len(rs),"bad":b}),flush=True)
 rec["dense"]=dense
 if all(not x["bad"] for x in dense):break
report={"status":"W28D_SEAM_FIT_STUDY","source_sha256":sha(asset),"house_sha256":sha(glb),"verts":len(mesh.vertices),"faces":len(mesh.polygons),"boundary_sizes":sorted(map(len,boundary(mesh))),"paths":paths}
(out/"w28d-fit.json").write_text(json.dumps(report,indent=2),encoding="utf8")
assert paths[-1].get("dense") and all(not x["bad"] for x in paths[-1]["dense"]),"No accepted candidate"
rig.animation_data.action=None;rig.animation_data.use_nla=True
for t in tracks:t.mute=False
for o in imported:
 if o.name in bpy.data.objects:bpy.data.objects.remove(o,do_unlink=True)
scene.frame_set(1);bpy.context.view_layer.update();bpy.ops.file.pack_all();bpy.context.preferences.filepaths.save_version=0
blend=out/"w28d-actor.blend";bpy.ops.wm.save_as_mainfile(filepath=str(blend),check_existing=False)
bpy.ops.object.select_all(action="DESELECT");body.select_set(True);bpy.context.view_layer.objects.active=body
if body.data.shape_keys is not None:bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
masks=[m for m in body.modifiers if m.type=="MASK"];assert len(masks)==1
while body.modifiers.find(masks[0].name)>0:bpy.ops.object.modifier_move_up(modifier=masks[0].name)
bpy.ops.object.modifier_apply(modifier=masks[0].name)
bpy.ops.object.select_all(action="DESELECT");rig.select_set(True)
for o in actor:o.select_set(True)
bpy.context.view_layer.objects.active=rig
export=out/"w28d-actor.glb";bpy.ops.export_scene.gltf(filepath=str(export),export_format="GLB",use_selection=True,export_yup=True,export_animations=True,export_animation_mode="NLA_TRACKS",export_materials="EXPORT",export_apply=False,export_frame_step=1)
m={"status":"ART_HOLD_W28D_CONTINUOUS_LINEN","source_sha256":sha(asset),"house_sha256":sha(glb),"blend_sha256":sha(blend),"glb_sha256":sha(export),"glb_bytes":export.stat().st_size,"audit_sha256":sha(out/"w28d-fit.json"),"params":paths[-1]["params"],"actor_meshes":len(actor),"placement_three":[-.58,.015,.30],"sample_counts":[417,144]}
(out/"w28d-manifest.json").write_text(json.dumps(m,indent=2),encoding="utf8")
print("W28D_EXPORTED",json.dumps(m),flush=True)
