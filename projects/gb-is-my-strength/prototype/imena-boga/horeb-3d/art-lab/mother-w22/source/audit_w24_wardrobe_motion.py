import bpy,json,hashlib,os
from pathlib import Path
from mathutils.bvhtree import BVHTree
from mathutils import Vector
project=Path(__file__).resolve().parents[3]
root=Path(os.environ["HOREB_W24_OUTPUT"]).resolve()
old=project/"art-lab/mother-w22/source/horeb_mother_w22_candidate.blend"
new=root/"w24-wardrobe-study.blend"
assert hashlib.sha256(old.read_bytes()).hexdigest()=="e752aa619c5f7d4fcff00efe44d53a6ecfb265a9c23db64d5534af39bf4451eb"
def assess(path):
 bpy.ops.wm.open_mainfile(filepath=str(path),load_ui=False)
 rig=bpy.data.objects["MOTHER_PERFORMER__53_BONE_RIG"]
 scene=bpy.context.scene;tracks=list(rig.animation_data.nla_tracks)
 def geo(name):
  d=bpy.context.evaluated_depsgraph_get()
  obj=bpy.data.objects[name].evaluated_get(d)
  mesh=obj.to_mesh()
  v=[obj.matrix_world@p.co for p in mesh.vertices];f=[tuple(p.vertices) for p in mesh.polygons]
  obj.to_mesh_clear();return v,f
 rows=[]
 for clip,frames in [("Mother_QuietIdle",[1,25,60]),("Mother_GestureTowardsBasket",[1,20,48,60,70,105])]:
  for t in tracks:t.mute=t.name!=clip
  for frame in frames:
   scene.frame_set(frame);bpy.context.view_layer.update()
   v,f=geo("Tunic_orig_hand_draped");tree=BVHTree.FromPolygons(v,f)
   b,bf=geo("W22_hand_woven_waist_tie");b_tree=BVHTree.FromPolygons(b,bf)
   intersections=len(tree.overlap(b_tree))
   nearest=[tree.find_nearest(p) for p in b]
   dist=[n[3] for n in nearest if n[3] is not None]
   signed=[(p-hit).dot(normal) for p,(hit,normal,_,distance) in zip(b,nearest) if hit is not None]
   rows.append(dict(clip=clip,frame=frame,intersecting_face_pairs=intersections,min_clearance_mm=round(min(dist)*1000,3),negative_vertex_count=sum(x<-.001 for x in signed),belt_vertices=len(b)))
 return dict(source=str(path),sha256=hashlib.sha256(path.read_bytes()).hexdigest(),rows=rows)
oldresult=assess(old);newresult=assess(new)
out={"baseline":oldresult,"candidate":newresult}
(root/"wardrobe-motion-audit.json").write_text(json.dumps(out,indent=2),encoding="utf8")
print("W24_BELT_MOTION_AUDIT "+json.dumps(out,separators=(",",":")),flush=True)
