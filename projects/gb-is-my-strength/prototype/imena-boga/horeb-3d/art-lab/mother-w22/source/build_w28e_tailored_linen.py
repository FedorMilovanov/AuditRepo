"""W28d continuous linen garment study. Preserve exact anatomy and animation."""
import bpy,os,json,hashlib,math,bmesh
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from collections import Counter,defaultdict
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
src=Path(os.environ["HOREB_W28C_OUTPUT"]);house=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"]);out=Path(os.environ["HOREB_W28E_OUTPUT"])
assert not out.exists();out.mkdir(parents=True)
asset=src/"w28c-fitted-actor.blend";glb=house/"w28-house.glb"
assert sha(asset)=="de32880c1c4f41fea3d80e165f7f26f4bc5f03700dc7a20272418d54fa242e80"
assert sha(glb)=="fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622"
bpy.ops.wm.open_mainfile(filepath=str(asset),load_ui=False)
scene=bpy.context.scene;rig=bpy.data.objects["MOTHER_PERFORMER__53_BONE_RIG"];body=bpy.data.objects["ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0"]
upper=bpy.data.objects["W28c_upper_sewn_shell"];skirt=bpy.data.objects["Tunic_orig_hand_draped"];belt=bpy.data.objects["W22_hand_woven_waist_tie"]

from mathutils.kdtree import KDTree
from mathutils.geometry import barycentric_transform
def weight_samples(o):
 return [{o.vertex_groups[g.group].name:g.weight for g in v.groups} for v in o.data.vertices]
samples=[v.co.copy() for v in upper.data.vertices]+[v.co.copy() for v in skirt.data.vertices]
sample_weights=weight_samples(upper)+weight_samples(skirt)
kd=KDTree(len(samples))
for i,v in enumerate(samples):kd.insert(v,i)
kd.balance()
mat=upper.data.materials[0]
for o in [upper,skirt]:bpy.data.objects.remove(o,do_unlink=True)
# Independently constructed closed tailoring volumes. Ring sections are
# smooth elliptical envelopes, not copied anatomical vertices.
def tube(name,sections,axis):
 vs=[];fs=[];N=64
 for k,(c,r1,r2) in enumerate(sections):
  for j in range(N):
   a=2*math.pi*j/N
   # Pleat amplitude tapers out around the shoulder/cuff.
   wave=1+(.018*math.sin(9*a)+.012*math.sin(13*a))*(1 if axis==2 and c[2]<.9 else 0)
   v=list(c);u,vaxis=[i for i in range(3) if i!=axis]
   v[u]+=r1*math.cos(a)*wave;v[vaxis]+=r2*math.sin(a)*wave;vs.append(v)
 for k in range(len(sections)-1):
  for j in range(N):fs.append((k*N+j,k*N+(j+1)%N,(k+1)*N+(j+1)%N,(k+1)*N+j))
 fs+=[tuple(reversed(range(N))),tuple(range((len(sections)-1)*N,len(sections)*N))]
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(vs,[],fs);mesh.update()
 bm=bmesh.new();bm.from_mesh(mesh);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(mesh);bm.free()
 o=bpy.data.objects.new(name,mesh);scene.collection.objects.link(o);return o
def garment(extra,cut):
 sections=[(.12,.34,.253,-.012),(.18,.35,.25,-.012),(.36,.32,.235,-.012),(.56,.285,.222,-.012),(.75,.265,.215,-.012),(.87,.244,.207,-.012),(.95,.206,.174,-.045),(1.03,.191,.166,-.047),(1.13,.205,.166,-.045),(1.22,.215,.141,-.025),(1.27,.195,.121,-.017),(1.31,.155,.112,-.020),(1.345,.106,.110,-.035),(1.39,.10,.10,-.035)]
 trunk=tube("W28e_trunk",[[(0,y,z),rx+extra,ry+extra] for z,rx,ry,y in sections],2)
 # Sleeve volume follows the original sloping upper arm without copying skin.
 sleeves=[]
 for sign in [-1,1]:
  ss=[]
  for x,z,ry,rz in [(.105,1.235,.108,.117),(.15,1.222,.105,.119),(.20,1.177,.092,.114),(.255,1.123,.078,.105),(.31,1.065,.072,.090)]:
   ss.append(((sign*x,-.019,z),ry+extra*.4,rz+extra*.4))
  sleeves.append(tube("W28e_sleeve",ss,0))
 bpy.ops.object.select_all(action="DESELECT");trunk.select_set(True)
 bpy.context.view_layer.objects.active=trunk
 # Exact solid union before remeshing avoids the interior surfaces of
 # intersecting separate closed meshes.
 for sleeve in sleeves:
  mod=trunk.modifiers.new("Tailoring_union","BOOLEAN");mod.operation="UNION";mod.solver="EXACT";mod.object=sleeve
  bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(sleeve,do_unlink=True)
 trunk.data.remesh_voxel_size=.012;trunk.data.remesh_voxel_adaptivity=0
 bpy.ops.object.voxel_remesh()
 bm=bmesh.new();bm.from_mesh(trunk.data)
 for co,no,outer in [((0,0,.153),(0,0,1),False),((0,0,1.342),(0,0,1),True),((cut,0,0),(1,0,0),True),((-cut,0,0),(-1,0,0),True)]:
  # Cuff planes only above the waist. Skirt is wider than sleeve opening.
  geo=list(bm.verts)+list(bm.edges)+list(bm.faces)
  if abs(no[0])>.5:geo=[g for g in geo if (g.co.z if isinstance(g,bmesh.types.BMVert) else min(v.co.z for v in g.verts))>.94]
  bmesh.ops.bisect_plane(bm,geom=geo,dist=1e-6,plane_co=co,plane_no=no,clear_outer=outer,clear_inner=not outer)
 bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.00035)
 # Weld the measured near-duplicate rear seam only. The two crossing
 # edges are within 0.98 mm; preserve all other parts of the garment.
 rear=[v for v in bm.verts if abs(v.co.x)<.003 and .207<v.co.y<.217 and .660<v.co.z<.680]
 bmesh.ops.remove_doubles(bm,verts=rear,dist=.0011)
 bmesh.ops.dissolve_degenerate(bm,edges=list(bm.edges),dist=.00015)
 bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(trunk.data);bm.free();trunk.data.update()
 trunk.name="W28e_tailored_linen";trunk.parent=rig
 trunk.data.materials.append(mat)
 uv=trunk.data.uv_layers.new(name="W28e_linen")
 for p in trunk.data.polygons:
  p.use_smooth=True
  for j in p.loop_indices:
   v=trunk.data.vertices[trunk.data.loops[j].vertex_index].co;uv.data[j].uv=(math.atan2(v.y+.02,v.x)*.8,v.z*7)
 groups={}
 for v in trunk.data.vertices:
  ww=defaultdict(float);total=0
  for co,i,d in kd.find_n(v.co,4):
   w=1/max(.004,d)**2;total+=w
   for n,a in sample_weights[i].items():ww[n]+=a*w
  ww=sorted(ww.items(),key=lambda x:x[1],reverse=True)[:4];total=sum(w for n,w in ww)
  for n,w in ww:
   if n not in groups:groups[n]=trunk.vertex_groups.new(name=n)
   groups[n].add([v.index],w/total,"REPLACE")
 mod=trunk.modifiers.new("Tailored_deform_weights","ARMATURE");mod.object=rig
 return trunk
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
actor=[]

clothes=[]
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

def topo(o):
 es=Counter(tuple(sorted((p.vertices[j],p.vertices[(j+1)%len(p.vertices)]))) for p in o.data.polygons for j in range(len(p.vertices)))
 bd=defaultdict(set);adj=defaultdict(set)
 for (i,j),n in es.items():
  adj[i].add(j);adj[j].add(i)
  if n==1:bd[i].add(j);bd[j].add(i)
 def comps(a):
  remain=set(a);out=[]
  while remain:
   seen={remain.pop()};q=list(seen)
   while q:
    for k in a[q.pop()]:
     if k in remain:remain.remove(k);seen.add(k);q.append(k)
   out.append(seen)
  return out
 loops=comps(bd)
 return {"verts":len(o.data.vertices),"faces":len(o.data.polygons),"components":len(comps(adj)),"loops":[len(x) for x in loops],"nonmanifold_edges":sum(n>2 for n in es.values()),"irregular_boundary":sum(len(x)!=2 for x in bd.values())}
def self_count(o):
 ob=o.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ob.to_mesh()
 fs=[tuple(p.vertices) for p in me.polygons];ss=list(map(set,fs));t=BVHTree.FromPolygons([ob.matrix_world@v.co for v in me.vertices],fs)
 n=sum(1 for i,j in t.overlap(t) if i<j and not ss[i]&ss[j]);ob.to_mesh_clear();return n

import numpy as np
dress=garment(0,.265)
info=topo(dress)
assert info["components"]==1 and len(info["loops"])==4 and not info["nonmanifold_edges"] and not info["irregular_boundary"],info
actor=[o for o in bpy.data.objects if o.type=="MESH" and (o==body or o.parent==rig)];clothes=[o for o in actor if o!=body and o.name!="W19_CC0_Eyes"]
groups=list(dress.vertex_groups);count=len(dress.data.vertices)
original=np.zeros((count,len(groups)),dtype=np.float64)
for v in dress.data.vertices:
 for g in v.groups:original[v.index,g.group]=g.weight
edges=np.asarray([tuple(e.vertices) for e in dress.data.edges],dtype=np.int64);a=np.concatenate((edges[:,0],edges[:,1]));b=np.concatenate((edges[:,1],edges[:,0]))
degree=np.bincount(a,minlength=count)[:,None]
coords=np.asarray([tuple(v.co) for v in dress.data.vertices])
mask=(coords[:,2]>.96)[:,None]
def set_weights(w):
 # glTF supports 4 weights in the existing contract. Maintain normalized,
 # deterministic groups after every trial.
 order=np.argsort(w,axis=1)[:,-4:]
 vals=np.take_along_axis(w,order,axis=1);vals/=vals.sum(axis=1)[:,None]
 for g in groups:g.remove(list(range(count)))
 for i in range(count):
  for j,value in zip(order[i],vals[i]):
   if value>1e-6:groups[int(j)].add([i],float(value),"REPLACE")
 bpy.context.view_layer.update()
def smooth_weights(n):
 w=original.copy()
 for _ in range(n):
  accum=np.zeros_like(w);np.add.at(accum,a,w[b]);av=accum/np.maximum(1,degree)
  w=np.where(mask,.45*w+.55*av,w)
 set_weights(w)

smooth_weights(80)
rows=[]
for clip,fs in [("Mother_GestureTowardsBasket",[j/4 for j in range(4,421)]),("Mother_QuietIdle",list(range(1,145)))]:
 rs=[]
 for f in fs:
  r=assess(clip,f);r["self_pairs"]=self_count(dress);rs.append(r)
 bad=[r["frame"] for r in rs if r["skin"] or r["props"] or r["self_pairs"]]
 rows.append({"clip":clip,"rows":rs,"bad":bad})
 print("W28E_DENSE",json.dumps({"clip":clip,"samples":len(rs),"bad":bad,"max_self":max(r["self_pairs"] for r in rs)}),flush=True)
audit=out/"w28e-dense-audit.json";audit.write_text(json.dumps({"status":"SAMPLED_NATIVE_CLOTH_CLEARANCE","actor_sha256":sha(asset),"house_sha256":sha(glb),"topology":info,"clips":rows},indent=2),encoding="utf8")
assert all(not r["bad"] for r in rows),"Dense check failed; do not export"
rig.animation_data.action=None;rig.animation_data.use_nla=True
for t in tracks:t.mute=False
for o in imported:
 if o.name in bpy.data.objects:bpy.data.objects.remove(o,do_unlink=True)
scene.frame_set(1);bpy.context.view_layer.update();bpy.ops.file.pack_all();bpy.context.preferences.filepaths.save_version=0
blend=out/"w28e-actor.blend";bpy.ops.wm.save_as_mainfile(filepath=str(blend),check_existing=False)
bpy.ops.object.select_all(action="DESELECT");body.select_set(True);bpy.context.view_layer.objects.active=body
if body.data.shape_keys is not None:bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
masks=[m for m in body.modifiers if m.type=="MASK"];assert len(masks)==1
while body.modifiers.find(masks[0].name)>0:bpy.ops.object.modifier_move_up(modifier=masks[0].name)
bpy.ops.object.modifier_apply(modifier=masks[0].name)
bpy.ops.object.select_all(action="DESELECT");rig.select_set(True)
for o in actor:o.select_set(True)
bpy.context.view_layer.objects.active=rig
export=out/"w28e-actor.glb";bpy.ops.export_scene.gltf(filepath=str(export),export_format="GLB",use_selection=True,export_yup=True,export_animations=True,export_animation_mode="NLA_TRACKS",export_materials="EXPORT",export_apply=False,export_frame_step=1)

m={"status":"ART_HOLD_W28E_TAILORED_LINEN","source_sha256":sha(asset),"house_sha256":sha(glb),"blend_sha256":sha(blend),"glb_sha256":sha(export),"glb_bytes":export.stat().st_size,"audit_sha256":sha(audit),"actor_meshes":len(actor),"placement_three":[-.58,.015,.30],"sample_counts":[417,144],"topology":info}
(out/"w28e-manifest.json").write_text(json.dumps(m,indent=2),encoding="utf8")
print("W28E_EXPORTED",json.dumps(m),flush=True)
