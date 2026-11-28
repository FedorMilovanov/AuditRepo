"""W28d native seam integrity diagnostic, including nonadjacent cloth face overlap."""
import bpy,os,json,hashlib,math
from pathlib import Path
from mathutils.bvhtree import BVHTree
from mathutils import Vector
from collections import Counter,defaultdict
root=Path(os.environ["HOREB_W28D_OUTPUT"])
asset=root/"w28d-actor.blend"
assert hashlib.sha256(asset.read_bytes()).hexdigest()=="8e4fedd6bf610ce4049ce97e512e2d2ecd1c8073ee5f1934541a3dc0a7879236"
bpy.ops.wm.open_mainfile(filepath=str(asset),load_ui=False)
scene=bpy.context.scene;rig=bpy.data.objects["MOTHER_PERFORMER__53_BONE_RIG"];dress=bpy.data.objects["W28d_continuous_linen"]
m=dress.data;faces=[tuple(p.vertices) for p in m.polygons];sets=[set(f) for f in faces]
edges=Counter(tuple(sorted((f[j],f[(j+1)%len(f)]))) for f in faces for j in range(len(f)))
assert max(edges.values())==2 and min(edges.values())==1
adj=defaultdict(set)
for i,j in edges:adj[i].add(j);adj[j].add(i)
seen={0};q=[0]
while q:
 for j in adj[q.pop()]:
  if j not in seen:seen.add(j);q.append(j)
assert len(seen)==len(m.vertices)
ad=rig.animation_data;tracks=list(ad.nla_tracks)
rows=[]
for name,fs in [("Mother_GestureTowardsBasket",range(1,106)),("Mother_QuietIdle",range(1,145))]:
 s=next(t.strips[0] for t in tracks if t.name==name);ad.use_nla=False;ad.action=s.action;ad.action_slot=s.action_slot
 for f in fs:
  scene.frame_set(f);bpy.context.view_layer.update()
  dg=bpy.context.evaluated_depsgraph_get();ob=dress.evaluated_get(dg);me=ob.to_mesh()
  assert len(me.polygons)==len(faces)
  vs=[ob.matrix_world@v.co for v in me.vertices];tree=BVHTree.FromPolygons(vs,faces)
  pairs=[(i,j) for i,j in tree.overlap(tree) if i<j and not sets[i]&sets[j]]
  rows.append({"clip":name,"frame":f,"nonadjacent_face_pairs":len(pairs),"first_pairs":pairs[:10]})
  ob.to_mesh_clear()
bad=[r for r in rows if r["nonadjacent_face_pairs"]]
out=root/"w28d-seam-integrity.json";assert not out.exists()
out.write_text(json.dumps({"status":"NONADJACENT_FACE_OVERLAP_DIAGNOSTIC","vertices":len(m.vertices),"faces":len(faces),"connected_components":1,"rows":rows},indent=2),encoding="utf8")
print("W28D_SEAM",json.dumps({"vertices":len(m.vertices),"faces":len(faces),"samples":len(rows),"bad":len(bad),"first":next(iter(bad),None),"max_pairs":max(r["nonadjacent_face_pairs"] for r in rows)}),flush=True)
