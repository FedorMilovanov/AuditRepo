"""Independent GLB reimport: candidate/house hashes, real skin and basket BVH."""
import bpy,os,json,hashlib,struct,math
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
root=Path(os.environ["HOREB_HAND_BAKE_OUTPUT"]);house=Path(os.environ["HOREB_W26C_INPUT"])
m=json.loads((root/"w27h-manifest.json").read_text(encoding="utf8"))
asset=root/"w27h-hand-retrace.glb";glb=house/"w26c-house-study.glb"
assert sha(asset)==m["glb_sha256"] and asset.stat().st_size==m["glb_bytes"]
assert sha(glb)==m["house_sha256"]=="34c1cdc2f005d41f23d0f8c631997ae8029f5536e16066139c422bce5caa234e"
assert sha(root/"baked-audit.json")==m["audit_sha256"]
assert sha(root/"quarter-frame-audit.json")==m["quarter_audit_sha256"]
assert m["sample_count"]==209 and m["quarter_sample_count"]==417 and not m["colliding_frames"]
blob=asset.read_bytes();magic,version,size=struct.unpack_from("<4sII",blob);assert magic==b"glTF" and version==2 and size==len(blob)
doc=json.loads(blob[20:20+struct.unpack_from("<I",blob,12)[0]])
assert len(doc["skins"][0]["joints"])==53
clips={a["name"]:a for a in doc["animations"]};assert set(clips)=={"Mother_QuietIdle","Mother_GestureTowardsBasket"}
bpy.ops.wm.read_factory_settings(use_empty=True);scene=bpy.context.scene;scene.render.fps=24;scene.render.fps_base=1
bpy.ops.import_scene.gltf(filepath=str(asset))
rig=next(o for o in bpy.data.objects if o.type=="ARMATURE")
assert len(rig.data.bones)==53
assert rig.animation_data
body=next(o for o in bpy.data.objects if o.type=="MESH" and any(g.name=="index_03_l" for g in o.vertex_groups) and len(o.data.vertices)>10000)
tracks=list(rig.animation_data.nla_tracks)
print("W27H_REIMPORT_RIG",json.dumps({"rig":rig.name,"body":body.name,"tracks":[{"name":t.name,"strips":[{"name":x.name,"start":x.frame_start,"end":x.frame_end,"action":x.action.name} for x in t.strips]} for t in tracks]}),flush=True)
gesture=next(t for t in tracks if "Mother_GestureTowardsBasket" in t.name or any("Mother_GestureTowardsBasket" in x.action.name for x in t.strips))
assert len(gesture.strips)==1
strip=gesture.strips[0]
start,end=float(strip.frame_start),float(strip.frame_end)
assert abs((end-start)-104)<1.01,(start,end)
rig.animation_data.action=None
for t in tracks:t.mute=t!=gesture
prior=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(glb))
imported=[o for o in bpy.data.objects if o not in prior]
basket=next(o for o in imported if o.name.startswith("BASKET_OBJECT_ACTION_ANCHOR"))
props=[]
for o in imported:
 if o.type!="MESH":continue
 p=o.parent
 while p and p!=basket:p=p.parent
 if p==basket:
  props.append((o.name,BVHTree.FromPolygons([o.matrix_world@v.co for v in o.data.vertices],[tuple(p.vertices) for p in o.data.polygons])))
assert len(props)>60
rim=next(tree for name,tree in props if name.startswith("Basket_thick_lipped_rim"))
groups={g.index:g.name for g in body.vertex_groups}
digits=["thumb","index","middle","ring","pinky"]
prefix=["hand_l"]+[f"{d}_0{i}_l" for d in digits for i in [1,2,3]]
obj=body.evaluated_get(bpy.context.evaluated_depsgraph_get());me=obj.to_mesh()
ids=[v.index for v in me.vertices if sum(g.weight for g in v.groups if groups.get(g.group,"") in prefix)>=.45]
assert len(ids)>1000
ix={v:i for i,v in enumerate(ids)}
faces=[tuple(ix[i] for i in p.vertices) for p in me.polygons if all(i in ix for i in p.vertices)]
obj.to_mesh_clear();assert len(faces)>1000
offset=Vector((-.5,-.30,.015))
rows=[]
for j in range(417):
 f=start+(end-start)*j/416
 scene.frame_set(math.floor(f),subframe=f-math.floor(f));bpy.context.view_layer.update()
 obj=body.evaluated_get(bpy.context.evaluated_depsgraph_get());me=obj.to_mesh()
 vs=[obj.matrix_world@me.vertices[i].co+offset for i in ids]
 tree=BVHTree.FromPolygons(vs,faces);obj.to_mesh_clear()
 pairs=sum(len(tree.overlap(t)) for _,t in props)
 rows.append({"relative_frame":j/4+1,"imported_frame":f,"basket_pairs":pairs,"rim_pairs":len(tree.overlap(rim))})
bad=[r["relative_frame"] for r in rows if r["basket_pairs"]]
result={"status":"REIMPORTED_GLB_SAMPLED_CLEARANCE_NOT_GRIP","glb_sha256":sha(asset),"house_sha256":sha(glb),"rows":rows,"colliding_frames":bad,"hand_vertices":len(ids),"hand_faces":len(faces)}
out=root/"glb-reimport-audit.json";assert not out.exists();out.write_text(json.dumps(result,indent=2),encoding="utf8")
print("W27H_GLB_REIMPORT",json.dumps({"samples":len(rows),"bad":bad,"hand_vertices":len(ids),"faces":len(faces)}),flush=True)
assert not bad,"Exported animation has collisions"
