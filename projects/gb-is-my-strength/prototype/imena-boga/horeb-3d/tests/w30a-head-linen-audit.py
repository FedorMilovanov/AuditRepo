"""Focused W30a head linen import comparison, not full scene acceptance."""
import bpy,hashlib,json,math,os
from pathlib import Path
from mathutils.bvhtree import BVHTree
root=Path(os.environ["HOREB_W30A_OUTPUT"]);base=Path(os.environ["HOREB_W29D_OUTPUT"])
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
m=json.loads((root/"w30a-manifest.json").read_text())
assert sha(root/"w30a-actor.glb")==m["glb_sha256"]=="85c24882620b35154ac9e333c6d37406b457d4d3b05aa07fbc024812b5f0ac35"
assert sha(base/"w29d-actor.glb")==m["source_sha256"]
grid=[("Mother_GestureTowardsBasket",f) for f in (1,12,12.75,21,41,47,60,71,82.75,91,105)]+[("Mother_QuietIdle",f) for f in (1,34,48,96,110,144)]
def audit(asset):
 bpy.ops.wm.read_factory_settings(use_empty=True);s=bpy.context.scene;s.render.fps=24
 bpy.ops.import_scene.gltf(filepath=str(asset),merge_vertices=True)
 rig=next(o for o in bpy.data.objects if o.type=="ARMATURE")
 meshes=[o for o in bpy.data.objects if o.type=="MESH" and o.parent==rig]
 assert len(meshes)==9 and len(rig.data.bones)==53
 hood=next(o for o in meshes if o.data.name.startswith("W22_plain_linen_head_cover_geo"))
 drape=next(o for o in meshes if o.data.name.startswith("W22_linen_rear_drape_geo"))
 def activate(o,name):
  ad=o.animation_data;t=next(t for t in ad.nla_tracks if t.name==name);st=t.strips[0]
  ad.use_nla=False;ad.action=st.action;ad.action_slot=st.action_slot
 def tree(o,dg):
  ob=o.evaluated_get(dg);me=ob.to_mesh()
  faces=[tuple(p.vertices) for p in me.polygons]
  pts=[ob.matrix_world@v.co for v in me.vertices]
  t=BVHTree.FromPolygons(pts,faces);ob.to_mesh_clear()
  return t,faces
 rows=[];prev=None
 for name,f in grid:
  if prev!=name:
   activate(rig,name)
   for o in meshes:
    if o.data.shape_keys:activate(o.data.shape_keys,name)
   prev=name
  lo=math.floor(f);s.frame_set(lo,subframe=f-lo);bpy.context.view_layer.update()
  dg=bpy.context.evaluated_depsgraph_get();trees={o.name:tree(o,dg) for o in meshes}
  pairs={}
  for o in (hood,drape):
   t,faces=trees[o.name];sets=list(map(set,faces))
   pairs[o.name+"|self"]=sum(1 for i,j in t.overlap(t) if i<j and not sets[i]&sets[j])
   for other in meshes:
    if other==o or (o==drape and other==hood):continue
    pairs[o.name+"|"+other.name]=len(t.overlap(trees[other.name][0]))
  rows.append({"clip":name,"frame":f,"pairs":pairs})
 print("W30A_FOCUS",asset.name,len(rows),flush=True)
 return rows
before=audit(base/"w29d-actor.glb");after=audit(root/"w30a-actor.glb")
regressions=[]
for a,b in zip(before,after):
 assert a["clip"]==b["clip"] and a["frame"]==b["frame"] and a["pairs"].keys()==b["pairs"].keys()
 for k,n in b["pairs"].items():
  if n>a["pairs"][k]:regressions.append({"clip":b["clip"],"frame":b["frame"],"pair":k,"before":a["pairs"][k],"after":n})
report={"status":"ART_HOLD_W30A_FOCUSED_HEAD_LINEN_COMPARISON","actor_sha256":m["glb_sha256"],"source_sha256":m["source_sha256"],"source_rows":before,"candidate_rows":after,"regressions":regressions}
p=root/"w30a-head-linen-audit.json";assert not p.exists();p.write_text(json.dumps(report,indent=2),encoding="utf8")
print("W30A_FOCUS_RESULT",json.dumps({"samples":len(after),"regressions":regressions,"baseline_nonzero":sorted({k for row in before for k,v in row["pairs"].items() if v}),"candidate_nonzero":sorted({k for row in after for k,v in row["pairs"].items() if v})}),flush=True)
assert not regressions,"Candidate increases sampled garment intersections"
