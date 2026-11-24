"""W27c native skin/rim audit. Diagnostic only, never grip approval."""
import bpy,json,hashlib,os
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
repo=Path(__file__).resolve().parents[1]
out=Path(os.environ["HOREB_HAND_AUDIT_OUTPUT"]).resolve()
assert not out.exists(), "Use a new output directory"
out.mkdir(parents=True)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def assess(source,house,label):
 bpy.ops.wm.open_mainfile(filepath=str(source),load_ui=False)
 rig=bpy.data.objects["MOTHER_PERFORMER__53_BONE_RIG"]
 body=bpy.data.objects["ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0"]
 scene=bpy.context.scene
 prior=set(bpy.data.objects)
 bpy.ops.import_scene.gltf(filepath=str(house))
 rim=next(o for o in bpy.data.objects if o not in prior and o.name.startswith("Basket_thick_lipped_rim"))
 assert rim.type=="MESH"
 rimv=[rim.matrix_world@v.co for v in rim.data.vertices]
 rimf=[tuple(p.vertices) for p in rim.data.polygons]
 rt=BVHTree.FromPolygons(rimv,rimf)
 assert len(rimv)>0
 groups={g.index:g.name for g in body.vertex_groups}
 digits=["thumb","index","middle","ring","pinky"]
 prefixes=["hand_l"]+[f"{d}_0{i}_l" for d in digits for i in [1,2,3]]
 offset=Vector((-.5,-.30,.015))
 tracks=list(rig.animation_data.nla_tracks)
 for track in tracks:track.mute=track.name!="Mother_GestureTowardsBasket"
 rows=[]
 for frame in [1,20,48,54,60,66,70,90,104]:
  scene.frame_set(frame);bpy.context.view_layer.update()
  obj=body.evaluated_get(bpy.context.evaluated_depsgraph_get());me=obj.to_mesh()
  verts=[obj.matrix_world@v.co+offset for v in me.vertices]
  tags={}
  for v in me.vertices:
   w={groups.get(g.group,""):g.weight for g in v.groups}
   if sum(w.get(n,0) for n in prefixes)<.45:continue
   digit=max(["palm"]+digits,key=lambda n:w.get("hand_l",0) if n=="palm" else sum(w.get(f"{n}_0{i}_l",0) for i in [1,2,3]))
   tags[v.index]=digit
  assert len(tags)>100, len(tags)
  faces=[tuple(p.vertices) for p in me.polygons if all(i in tags for i in p.vertices)]
  assert len(faces)>0
  tree=BVHTree.FromPolygons(verts,faces)
  counts={}
  for digit in ["palm"]+digits:
   indices=[i for i,n in tags.items() if n==digit]
   nearest=[rt.find_nearest(verts[i]) for i in indices]
   ds=[q[3] for q in nearest if q[3] is not None]
   counts[digit]={"vertices":len(indices),"min_surface_sample_mm":round(min(ds)*1000,3) if ds else None,"within_3mm":sum(d<=.003 for d in ds)}
  rows.append({"frame":frame,"hand_vertices":len(tags),"hand_face_count":len(faces),"rim_intersecting_face_pairs":len(tree.overlap(rt)),"regions":counts})
  obj.to_mesh_clear()
 record={"label":label,"source_sha256":sha(source),"house_sha256":sha(house),"status":"DIAGNOSTIC_NOT_GRIP_PROOF","rows":rows}
 (out/(label+".json")).write_text(json.dumps(record,indent=2),encoding="utf8")
 print("HAND_SURFACE_PEAK "+json.dumps({"label":label,**next(r for r in rows if r["frame"]==60)},separators=(",",":")),flush=True)
old=repo/"art-lab/mother-w22/source/horeb_mother_w22_candidate.blend"
assert sha(old)=="e752aa619c5f7d4fcff00efe44d53a6ecfb265a9c23db64d5534af39bf4451eb"
assess(old,repo/"public/artlab/horeb_egypt_house_hero_pilot.glb","W22-W17")
if os.environ.get("HOREB_W24_OUTPUT") or os.environ.get("HOREB_W26C_INPUT"):
 w24=Path(os.environ["HOREB_W24_OUTPUT"]).resolve()
 w26=Path(os.environ["HOREB_W26C_INPUT"]).resolve()
 m=json.loads((w24/"w24-export-manifest.json").read_text(encoding="utf8"))
 h=json.loads((w26/"w26-study-manifest.json").read_text(encoding="utf8"))
 assert m["glb_sha256"]=="f3d9a470cb2371f600cc8b6c58547fd63aebd8c1d025e80ff327926ef2870cbb"
 assert h["glb_sha256"]=="34c1cdc2f005d41f23d0f8c631997ae8029f5536e16066139c422bce5caa234e"
 assert sha(w24/"w24-wardrobe-study.blend")==m["blend_sha256"]
 assert sha(w24/"w24-wardrobe-study.glb")==m["glb_sha256"]
 assert sha(w26/h["glb_file"])==h["glb_sha256"]
 assess(w24/"w24-wardrobe-study.blend",w26/h["glb_file"],"W24-W26c")
print("W27C_NATIVE_HAND_AUDIT_COMPLETE",flush=True)
