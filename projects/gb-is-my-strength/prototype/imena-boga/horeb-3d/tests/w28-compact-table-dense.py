"""W28 native staging/IK retarget search; no asset changes."""
import bpy,os,json,hashlib,math
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
root=Path(os.environ["HOREB_HAND_BAKE_OUTPUT"]);house=Path(os.environ["HOREB_W26C_INPUT"])
asset=root/"w27h-hand-retrace.blend";glb=house/"w26c-house-study.glb"
assert sha(asset)=="89ee48385a14dca631bc4bcb84a135f8e094b328aa9243700fc1eb0c249bba8b"
assert sha(glb)=="34c1cdc2f005d41f23d0f8c631997ae8029f5536e16066139c422bce5caa234e"
bpy.ops.wm.open_mainfile(filepath=str(asset),load_ui=False)
scene=bpy.context.scene;rig=bpy.data.objects["MOTHER_PERFORMER__53_BONE_RIG"]
body=bpy.data.objects["ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0"]
meshes=[o for o in bpy.data.objects if o.type=="MESH" and (o==body or o.parent==rig)]
assert len(meshes)==9,[o.name for o in meshes]
prior=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(glb))
imported=[o for o in bpy.data.objects if o not in prior]
basket=next(o for o in imported if o.name.startswith("BASKET_OBJECT_ACTION_ANCHOR"))
# Proposed smaller table: keep its right edge and top height, move the
# left edge to x=-0.005 (40 mm support margin under the basket base).
# Shift its two left legs to x=.14. The basket itself is unchanged.
props=[]
for o in imported:
 if o.type!="MESH":continue
 p=o.parent
 while p and p!=basket:p=p.parent
 if p!=basket and not o.name.startswith(("Coarse_work_surface","Domestic_clay_bench","Workshop_wood_support")):continue
 vs=[o.matrix_world@v.co for v in o.data.vertices]
 if o.name.startswith("Coarse_work_surface"):
  for v in vs:v.x=-.005+(v.x+.475)*(1.195+.005)/1.67
 if o.name.startswith("Workshop_wood_support") and max(v.x for v in vs)<0:
  for v in vs:v.x+=.39
 props.append((o.name,BVHTree.FromPolygons(vs,[tuple(p.vertices) for p in o.data.polygons])))
assert len(props)==98,len(props)
for t in rig.animation_data.nla_tracks:t.mute=t.name!="Mother_GestureTowardsBasket"
fore=rig.pose.bones["lowerarm_l"];hand=rig.pose.bones["hand_l"]
offset=Vector((-.5,-.30,.015));base=rig.matrix_world.copy()
target=bpy.data.objects.new("W28_staging_target",None);scene.collection.objects.link(target)
ik=fore.constraints.new("IK");ik.target=target;ik.chain_count=2;ik.use_stretch=False;ik.influence=0
def assess():
 hits=[];dg=bpy.context.evaluated_depsgraph_get()
 for o in meshes:
  obj=o.evaluated_get(dg);me=obj.to_mesh()
  if not me.polygons:obj.to_mesh_clear();continue
  tree=BVHTree.FromPolygons([obj.matrix_world@v.co+offset for v in me.vertices],[tuple(p.vertices) for p in me.polygons]);obj.to_mesh_clear()
  for n,t in props:
   c=len(tree.overlap(t))
   if c:hits.append({"mesh":o.name,"prop":n,"pairs":c})
 return hits
neutral=hand.rotation_quaternion.copy() if hand.rotation_mode=="QUATERNION" else hand.rotation_euler.copy()
def trial(f,dx,dy):
 ik.influence=0;rig.matrix_world=base
 if hand.rotation_mode=="QUATERNION":hand.rotation_quaternion=neutral
 else:hand.rotation_euler=neutral
 scene.frame_set(math.floor(f),subframe=f-math.floor(f));bpy.context.view_layer.update()
 tip=(rig.matrix_world@fore.tail).copy();orientation=(rig.matrix_world@hand.matrix).to_quaternion()
 # Only retarget during the extended approach; allow the resting hand to
 # follow the displaced torso. A smooth weight preserves the rest pose.
 u=max(0,min(1,(f-1)/19,(105-f)/19));w=u*u*(3-2*u)
 moved=base.copy();delta=Vector((dx,dy,0));moved.translation+=delta;rig.matrix_world=moved
 target.location=tip+delta*(1-w);ik.influence=1 if w>0 and delta.length>0 else 0
 bpy.context.view_layer.update()
 if w>0 and delta.length>0:
  mat=hand.matrix.copy();mat=orientation.to_matrix().to_4x4();mat=rig.matrix_world.inverted()@mat
  mat.translation=hand.matrix.translation
  q=rig.convert_space(pose_bone=hand,matrix=mat,from_space="POSE",to_space="LOCAL").to_quaternion()
  if hand.rotation_mode=="QUATERNION":hand.rotation_quaternion=q
  else:hand.rotation_euler=q.to_euler(hand.rotation_mode)
  bpy.context.view_layer.update()
 error=((rig.matrix_world@fore.tail)-target.location).length*1000 if w>0 else 0
 return {"frame":f,"retarget_error_mm":round(error,3),"hits":assess()}

paths=[]
for dx,dy in [(-.08,0),(-.12,0),(-.16,0),(-.18,0),(-.12,-.08),(-.12,.08),(-.18,-.08)]:
 rows=[trial(j/2,dx,dy) for j in range(2,211)]
 bad=[r["frame"] for r in rows if r["hits"]]
 peak=max(r["retarget_error_mm"] for r in rows if 48<=r["frame"]<=70)
 result={"delta":[dx,dy,0],"rows":rows,"bad":bad,"max_peak_error_mm":peak}
 paths.append(result)
 print("W28_DENSE",json.dumps({"delta":result["delta"],"samples":len(rows),"bad":bad,"peak_mm":peak}),flush=True)
 if not bad and peak<.1:
  extra=[trial(j/4,dx,dy) for j in range(4,421)]
  bad4=[r["frame"] for r in extra if r["hits"]]
  peak4=max(r["retarget_error_mm"] for r in extra if 48<=r["frame"]<=70)
  result["quarter_rows"]=extra;result["quarter_bad"]=bad4;result["quarter_peak_mm"]=peak4
  print("W28_QUARTER",json.dumps({"delta":result["delta"],"samples":len(extra),"bad":bad4,"peak_mm":peak4}),flush=True)
  if not bad4 and peak4<.1:break
out=root/"w28-compact-table-dense.json";assert not out.exists();out.write_text(json.dumps({"status":"NATIVE_COMPACT_TABLE_DENSE_DIAGNOSTIC","actor_sha256":sha(asset),"house_sha256":sha(glb),"paths":paths},indent=2),encoding="utf8")
