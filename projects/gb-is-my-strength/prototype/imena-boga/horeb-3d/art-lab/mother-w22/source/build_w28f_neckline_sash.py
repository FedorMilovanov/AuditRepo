"""W28d continuous linen garment study. Preserve exact anatomy and animation."""
import bpy,os,json,hashlib,math,bmesh
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from collections import Counter,defaultdict
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
src=Path(os.environ["HOREB_W28E_OUTPUT"]);house=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"]);out=Path(os.environ["HOREB_W28F_OUTPUT"])
assert not out.exists();out.mkdir(parents=True)
asset=src/"w28e-actor.blend";glb=house/"w28-house.glb"
assert sha(asset)=="be7c3f919d56f3b415d6fdaf707be11663888898408fb425134d6a5699e19e64"
assert sha(glb)=="fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622"
bpy.ops.wm.open_mainfile(filepath=str(asset),load_ui=False)
scene=bpy.context.scene;rig=bpy.data.objects["MOTHER_PERFORMER__53_BONE_RIG"];body=bpy.data.objects["ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0"]
dress=bpy.data.objects["W28e_tailored_linen"];belt=bpy.data.objects["W22_hand_woven_waist_tie"]

orig=[v.co.copy() for v in dress.data.vertices]
belt_orig=[v.co.copy() for v in belt.data.vertices]
faces=[tuple(p.vertices) for p in dress.data.polygons]
assert len(orig)==18390 and len(faces)==36332 and len(belt_orig)==192
def ease(x):
 x=max(0,min(1,x));return x*x*(3-2*x)
def fit(neck_drop,shoulder_ease,gap):
 for v,p0 in zip(dress.data.vertices,orig):
  p=p0.copy()
  # Modest curved neckline, smoothly blended into the chest.
  front=ease((-.02-p.y)/.10)
  p.z-=neck_drop*front*ease((p.z-1.205)/.137)*ease((.16-abs(p.x))/.065)
  # Soften the high lateral shoulder profile without moving cuff endpoints.
  p.z-=shoulder_ease*ease((abs(p.x)-.085)/.065)*ease((.265-abs(p.x))/.055)*ease((p.z-1.19)/.14)
  v.co=p
 dress.data.update()
 tree=BVHTree.FromPolygons([v.co for v in dress.data.vertices],faces)
 for i,(v,p) in enumerate(zip(belt.data.vertices,belt_orig)):
  radial=Vector((p.x,p.y+.012,0)).normalized()
  center=Vector((0,-.012,p.z))
  hit,_,_,dist=tree.ray_cast(center+radial*.6,-radial, .6)
  assert hit is not None,(i,list(p))
  # Preserve original sash waviness and relief; fit the back surface outside
  # the real dress, not a nominal ellipse.
  v.co=hit+radial*(gap+.002*(i%2))
 belt.data.update();bpy.context.view_layer.update()
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
 # Additional check for accidental sash penetration into the visible garment.
 return {"clip":clip,"frame":f,"skin":skin,"props":hits,"sash_pairs":len(trees[dress.name].overlap(trees[belt.name]))}

def self_count(o):
 ob=o.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ob.to_mesh()
 fs=[tuple(p.vertices) for p in me.polygons];ss=list(map(set,fs));t=BVHTree.FromPolygons([ob.matrix_world@v.co for v in me.vertices],fs)
 n=sum(1 for i,j in t.overlap(t) if i<j and not ss[i]&ss[j]);ob.to_mesh_clear();return n
coarse=[("Mother_GestureTowardsBasket",f) for f in [1,13,21,31,41,47,48,60,70,71,78,88,97,105]]+[("Mother_QuietIdle",f) for f in [1,48,96,144]]
paths=[]
for params in [(.025,.012,.006),(.035,.018,.008),(.018,.006,.010),(0,0,.012)]:
 fit(*params);rows=[]
 for c,f in coarse:
  r=assess(c,f);r["self_pairs"]=self_count(dress);r["sash_self_pairs"]=self_count(belt);rows.append(r)
 bad=[r for r in rows if r["skin"] or r["props"] or r["self_pairs"] or r["sash_pairs"] or r["sash_self_pairs"]]
 rec={"params":params,"rows":rows,"bad":len(bad)};paths.append(rec)
 print("W28F_FIT",json.dumps({"params":params,"bad":len(bad),"first":next(iter(bad),None),"sash_pairs":sum(r["sash_pairs"] for r in rows),"self_pairs":sum(r["self_pairs"] for r in rows)}),flush=True)
 if not bad:break
(out/"w28f-fit-search.json").write_text(json.dumps({"status":"NECKLINE_SASH_FIT_DIAGNOSTIC","source_sha256":sha(asset),"house_sha256":sha(glb),"paths":paths},indent=2),encoding="utf8")
assert not paths[-1]["bad"],"Coarse tailoring test failed; no export"
dense=[]
for c,fs in [("Mother_GestureTowardsBasket",[j/4 for j in range(4,421)]),("Mother_QuietIdle",list(range(1,145)))]:
 rows=[]
 for f in fs:
  r=assess(c,f);r["self_pairs"]=self_count(dress);r["sash_self_pairs"]=self_count(belt);rows.append(r)
 bad=[r["frame"] for r in rows if r["skin"] or r["props"] or r["self_pairs"] or r["sash_pairs"] or r["sash_self_pairs"]]
 dense.append({"clip":c,"rows":rows,"bad":bad})
 print("W28F_DENSE",json.dumps({"clip":c,"samples":len(rows),"bad":bad}),flush=True)
audit=out/"w28f-dense-audit.json";audit.write_text(json.dumps({"status":"SAMPLED_NATIVE_TAILORING_CLEARANCE","source_sha256":sha(asset),"house_sha256":sha(glb),"params":paths[-1]["params"],"clips":dense},indent=2),encoding="utf8")
assert all(not c["bad"] for c in dense),"Dense fit failed; no export"
rig.animation_data.action=None;rig.animation_data.use_nla=True
for t in tracks:t.mute=False
for o in imported:
 if o.name in bpy.data.objects:bpy.data.objects.remove(o,do_unlink=True)
scene.frame_set(1);bpy.context.view_layer.update();bpy.ops.file.pack_all();bpy.context.preferences.filepaths.save_version=0
blend=out/"w28f-actor.blend";bpy.ops.wm.save_as_mainfile(filepath=str(blend),check_existing=False)
bpy.ops.object.select_all(action="DESELECT");body.select_set(True);bpy.context.view_layer.objects.active=body
if body.data.shape_keys is not None:bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
masks=[m for m in body.modifiers if m.type=="MASK"];assert len(masks)==1
while body.modifiers.find(masks[0].name)>0:bpy.ops.object.modifier_move_up(modifier=masks[0].name)
bpy.ops.object.modifier_apply(modifier=masks[0].name)
bpy.ops.object.select_all(action="DESELECT");rig.select_set(True)
for o in actor:o.select_set(True)
bpy.context.view_layer.objects.active=rig
export=out/"w28f-actor.glb";bpy.ops.export_scene.gltf(filepath=str(export),export_format="GLB",use_selection=True,export_yup=True,export_animations=True,export_animation_mode="NLA_TRACKS",export_materials="EXPORT",export_apply=False,export_frame_step=1)

m={"status":"ART_HOLD_W28F_NECKLINE_SASH","source_sha256":sha(asset),"house_sha256":sha(glb),"blend_sha256":sha(blend),"glb_sha256":sha(export),"glb_bytes":export.stat().st_size,"audit_sha256":sha(audit),"actor_meshes":len(actor),"placement_three":[-.58,.015,.30],"sample_counts":[417,144],"params":paths[-1]["params"]}
(out/"w28f-manifest.json").write_text(json.dumps(m,indent=2),encoding="utf8")
print("W28F_EXPORTED",json.dumps(m),flush=True)
