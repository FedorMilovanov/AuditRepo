"""Compare right-arm skin overlap on exact W31a/W31d imports.
Only pairs without shared topology count; baseline contact is retained in the report.
"""
import bpy,hashlib,json,math,os
from pathlib import Path
from mathutils.bvhtree import BVHTree
base=Path(os.environ["HOREB_W31D_SOURCE"]);root=Path(os.environ["HOREB_W31D_OUTPUT"])
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
assets=[base/"w31a-actor.glb",root/"w31d-actor.glb"]
assert [sha(p) for p in assets]==["8c03caab4aa8d4871883ff5d8a71ee15f556abf226c0789c0dbe368c65be6113","4b87b59ac8c7c61968ef7c9a00f23939f21e53558d8f74072fde5e5b495e9db8"]
frames=[1+i*.25 for i in range(417)]
def check(asset):
 bpy.ops.wm.read_factory_settings(use_empty=True);s=bpy.context.scene;s.render.fps=24
 bpy.ops.import_scene.gltf(filepath=str(asset),merge_vertices=True)
 rig=next(o for o in bpy.data.objects if o.type=="ARMATURE")
 body=next(o for o in bpy.data.objects if o.type=="MESH" and len(o.data.vertices)>10000 and any(g.name=="index_03_l" for g in o.vertex_groups))
 def activate(owner):
  ad=owner.animation_data;t=next(t for t in ad.nla_tracks if t.name=="Mother_GestureTowardsBasket");st=t.strips[0]
  ad.use_nla=False;ad.action=st.action;ad.action_slot=st.action_slot
 activate(rig);activate(body.data.shape_keys)
 names={"clavicle_r","upperarm_r","lowerarm_r","hand_r"}|{f"{d}_{i:02d}_r" for d in ("thumb","index","middle","ring","pinky") for i in (1,2,3)}
 groups={g.index for g in body.vertex_groups if g.name in names}
 ids={v.index for v in body.data.vertices if sum(g.weight for g in v.groups if g.group in groups)>.1}
 faces=[tuple(p.vertices) for p in body.data.polygons]
 region=[i for i,f in enumerate(faces) if any(k in ids for k in f)]
 assert len(region)>100
 # Recognize coincident source vertices only when every morph and skin signature agrees.
 keys=body.data.shape_keys.key_blocks
 canonical={};ci=[]
 for v in body.data.vertices:
  sig=(tuple(v.co),tuple(tuple(k.data[v.index].co) for k in keys),tuple(sorted((g.group,float(g.weight)) for g in v.groups if g.weight!=0)))
  ci.append(canonical.setdefault(sig,len(canonical)))
 sets=[{ci[k] for k in f} for f in faces]
 rows=[]
 for f in frames:
  lo=math.floor(f);s.frame_set(lo,subframe=f-lo);bpy.context.view_layer.update()
  obj=body.evaluated_get(bpy.context.evaluated_depsgraph_get());me=obj.to_mesh();pts=[v.co.copy() for v in me.vertices]
  alltree=BVHTree.FromPolygons(pts,faces);arm=BVHTree.FromPolygons(pts,[faces[i] for i in region])
  pairs=set()
  for i,j in arm.overlap(alltree):
   a=region[i]
   if a!=j and not sets[a]&sets[j]:pairs.add(tuple(sorted((a,j))))
  obj.to_mesh_clear()
  rows.append({"frame":f,"pairs":sorted(pairs)})
 print("W31D_RIGHT_SKIN",asset.name,len(region),sum(bool(r["pairs"]) for r in rows),flush=True)
 return rows
before=check(assets[0]);after=check(assets[1])
reg=[{"frame":b["frame"],"new_pairs":sorted(set(map(tuple,b["pairs"]))-set(map(tuple,a["pairs"])))} for a,b in zip(before,after)]
reg=[r for r in reg if r["new_pairs"]]
report={"source_sha256":sha(assets[0]),"actor_sha256":sha(assets[1]),"source_rows":before,"candidate_rows":after,"regressions":reg}
out=root/"w31d-right-skin-audit.json";assert not out.exists();out.write_text(json.dumps(report,indent=2),encoding="utf8")
print("W31D_RIGHT_SKIN_RESULT",len(after),"new_bad_samples",len(reg),flush=True)
assert not reg,"New right-arm visible-skin overlaps"
