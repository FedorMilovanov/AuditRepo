"""Independent GLB reimport: candidate/house hashes, real skin and basket BVH."""
import bpy,os,json,hashlib,struct,math
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
root=Path(os.environ["HOREB_W28E_OUTPUT"]);house=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"])
m=json.loads((root/"w28e-manifest.json").read_text(encoding="utf8"))
h=json.loads((house/"w28-house-manifest.json").read_text(encoding="utf8"))
asset=root/"w28e-actor.glb";glb=house/"w28-house.glb"
assert m["status"]=="ART_HOLD_W28E_TAILORED_LINEN"
assert m["source_sha256"]=="de32880c1c4f41fea3d80e165f7f26f4bc5f03700dc7a20272418d54fa242e80"
assert sha(asset)==m["glb_sha256"]
assert sha(glb)==m["house_sha256"]==h["glb_sha256"]=="fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622"
assert asset.stat().st_size==m["glb_bytes"] and glb.stat().st_size==h["bytes"]
assert sha(root/"w28e-dense-audit.json")==m["audit_sha256"]
assert m["sample_counts"]==[417,144] and m["placement_three"]==[-.58,.015,.30]
assert m["actor_meshes"]==7
blob=asset.read_bytes();magic,version,size=struct.unpack_from("<4sII",blob);assert magic==b"glTF" and version==2 and size==len(blob)
doc=json.loads(blob[20:20+struct.unpack_from("<I",blob,12)[0]])
assert len(doc["skins"][0]["joints"])==53
clips={a["name"]:a for a in doc["animations"]};assert set(clips)=={"Mother_QuietIdle","Mother_GestureTowardsBasket"}
bpy.ops.wm.read_factory_settings(use_empty=True);scene=bpy.context.scene;scene.render.fps=24;scene.render.fps_base=1
bpy.ops.import_scene.gltf(filepath=str(asset),merge_vertices=True)
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
# Exclude only verified importer-created bone display geometry, never an
# actual GLB mesh. Fail on unexpected objects instead of silently ignoring them.
helpers={b.custom_shape for b in rig.pose.bones if b.custom_shape is not None}
exported_names={n.get("name") for n in doc["nodes"] if "mesh" in n}
actor_meshes=[]
excluded=[]
for o in bpy.data.objects:
 if o.type!="MESH":continue
 if o in helpers and o.name not in exported_names:
  excluded.append({"name":o.name,"custom_shape_users":sum(b.custom_shape==o for b in rig.pose.bones)})
  continue
 assert o.name in exported_names,("Unclassified mesh",o.name)
 actor_meshes.append(o)
assert len(actor_meshes)==7
print("W28_EXCLUDED_HELPERS",json.dumps(excluded),flush=True)
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

for o in imported:
 if o.type=="MESH" and o.name.startswith(("Coarse_work_surface","Domestic_clay_bench","Workshop_wood_support")):
  props.append((o.name,BVHTree.FromPolygons([o.matrix_world@v.co for v in o.data.vertices],[tuple(p.vertices) for p in o.data.polygons])))
assert len(props)==98,len(props)

offset=Vector((-.58,-.30,.015))
def bounds(o):
 vs=[o.matrix_world@v.co for v in o.data.vertices]
 return [[min(v[k] for v in vs) for k in range(3)],[max(v[k] for v in vs) for k in range(3)]]
table=next(o for o in imported if o.name=="Coarse_work_surface")
base=next(o for o in imported if o.name=="Basket_W26_closed_woven_base")
tb,bb=bounds(table),bounds(base)
assert abs(tb[0][0]+.005)<.001 and abs(tb[1][0]-1.195)<.001
assert bb[0][0]-tb[0][0]>.039
assert all(tb[0][k]<=bb[0][k] and tb[1][k]>=bb[1][k] for k in (0,1))

clothes=[o for o in actor_meshes if o!=body and o.name!="W19_CC0_Eyes"]
assert len(clothes)==5,[o.name for o in actor_meshes]
assert any(o.name=="W28e_tailored_linen" for o in clothes)
ad=rig.animation_data
def activate(track):
 strip=track.strips[0]
 ad.use_nla=False;ad.action=strip.action;ad.action_slot=strip.action_slot
 return float(strip.action_frame_start),float(strip.action_frame_end)

start,end=activate(gesture)
scene.frame_set(60);bpy.context.view_layer.update()
o=next(o for o in actor_meshes if o.name=="W28e_tailored_linen")
ob=o.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ob.to_mesh()
vs=[ob.matrix_world@v.co for v in me.vertices];fs=[tuple(p.vertices) for p in me.polygons];ss=list(map(set,fs));t=BVHTree.FromPolygons(vs,fs)
pairs=[(i,j) for i,j in t.overlap(t) if i<j and not ss[i]&ss[j]]
print("W28E_EXPORT_PEAK_PAIRS",json.dumps({"verts":len(vs),"faces":len(fs),"pairs":[{"faces":[i,j],"rest":[[list(o.data.vertices[k].co) for k in fs[m]] for m in [i,j]],"deformed":[[list(vs[k]) for k in fs[m]] for m in [i,j]],"nearest_vertex_dist":min((vs[a]-vs[b]).length for a in fs[i] for b in fs[j])} for i,j in pairs]}),flush=True)
ob.to_mesh_clear()
