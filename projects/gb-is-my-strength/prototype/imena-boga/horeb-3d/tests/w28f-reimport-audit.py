"""Independent GLB reimport: candidate/house hashes, real skin and basket BVH."""
import bpy,os,json,hashlib,struct,math
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
variants=[v for v in ("w28f","w28g","w28l") if os.environ.get("HOREB_"+v.upper()+"_OUTPUT")]
assert len(variants)==1,"Choose one audit candidate"
variant=variants[0]
root=Path(os.environ["HOREB_"+variant.upper()+"_OUTPUT"]);house=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"])
expected={
 "w28f":("ART_HOLD_W28F_NECKLINE_SASH","be7c3f919d56f3b415d6fdaf707be11663888898408fb425134d6a5699e19e64","w28f-dense-audit.json"),
 "w28g":("ART_HOLD_W28G_HEAD_ARM","a30e66d6b0bf1b973d52869244873ca1be2ad2033b36e4cb397af8e563da4c36","w28g-native-audit.json"),
 "w28l":("ART_HOLD_W28L_GAZE_TRIAL","3e1baf347b9197b2a59da935f15245f2ef289302b72cde22047642e563acc488",None),
}[variant]
m=json.loads((root/("w28l-eye-manifest.json" if variant=="w28l" else variant+"-manifest.json")).read_text(encoding="utf8"))
h=json.loads((house/"w28-house-manifest.json").read_text(encoding="utf8"))
asset=root/(variant+"-actor.glb");glb=house/"w28-house.glb"
assert m["status"]==expected[0]
assert m["source_sha256"]==expected[1]
assert sha(asset)==m["glb_sha256"]
assert sha(glb)==m["house_sha256"]==h["glb_sha256"]=="fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622"
assert asset.stat().st_size==m["glb_bytes"] and glb.stat().st_size==h["bytes"]
if variant=="w28l":
 assert m["glb_sha256"]=="76fa64646830931c7cfc4e5b17524a7fea1f83c315fe1e7168c9dbf526d14c4b"
 assert m["bones"]==53 and m["morph_targets"]==8 and m["original_geometry_and_bone_animation_unchanged"] is True
else:
 assert sha(root/expected[2])==m["audit_sha256"]
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
eyes=None
if variant=="w28l":
 eye_nodes=[n for n in doc["nodes"] if n.get("name")=="W19_CC0_Eyes" and "mesh" in n]
 assert len(eye_nodes)==1
 eye_doc=doc["meshes"][eye_nodes[0]["mesh"]]
 assert len(eye_doc["primitives"][0]["targets"])==8
 eyes=next(o for o in bpy.data.objects if o.type=="MESH" and o.data.name==eye_doc["name"] and o.data.shape_keys)
 assert eyes.parent==rig and eyes.name=="low-poly"
 assert bpy.data.objects["W19_CC0_Eyes"].type=="EMPTY"
 assert [k.name for k in list(eyes.data.shape_keys.key_blocks)[1:]]==eye_doc["extras"]["targetNames"]
 assert len(eyes.data.vertices)==96
 assert all(len(v.groups)==1 and eyes.vertex_groups[v.groups[0].group].name=="head" and abs(v.groups[0].weight-1)<1e-6 for v in eyes.data.vertices)
actor_meshes=[]
excluded=[]
for o in bpy.data.objects:
 if o.type!="MESH":continue
 if o in helpers and o.name not in exported_names:
  excluded.append({"name":o.name,"custom_shape_users":sum(b.custom_shape==o for b in rig.pose.bones)})
  continue
 assert o.name in exported_names or o==eyes,("Unclassified mesh",o.name)
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

clothes=[o for o in actor_meshes if o!=body and o!=eyes and o.name!="W19_CC0_Eyes"]
assert len(clothes)==5,[o.name for o in actor_meshes]
assert any(o.name=="W28e_tailored_linen" for o in clothes)
ad=rig.animation_data
def activate(track):
 strip=track.strips[0]
 ad.use_nla=False;ad.action=strip.action;ad.action_slot=strip.action_slot
 if eyes:
  ka=eyes.data.shape_keys.animation_data
  kt=next(t for t in ka.nla_tracks if t.name==track.name)
  ks=kt.strips[0]
  ka.use_nla=False;ka.action=ks.action;ka.action_slot=ks.action_slot
 return float(strip.action_frame_start),float(strip.action_frame_end)
def check(track,n):
 start,end=activate(track)
 rows=[]
 for j in range(n):
  f=start+(end-start)*j/(n-1)
  scene.frame_set(math.floor(f),subframe=f-math.floor(f));bpy.context.view_layer.update()
  hits=[];skin=[];self_pairs=0;sash_self_pairs=0;dg=bpy.context.evaluated_depsgraph_get();trees={}
  for o in actor_meshes:
   obj=o.evaluated_get(dg);me=obj.to_mesh()
   if not me.polygons:obj.to_mesh_clear();continue
   fs=[tuple(p.vertices) for p in me.polygons]
   tree=BVHTree.FromPolygons([obj.matrix_world@v.co+offset for v in me.vertices],fs)
   if o.name in ("W28e_tailored_linen","W22_hand_woven_waist_tie"):
    ss=list(map(set,fs));count=sum(1 for i,j in tree.overlap(tree) if i<j and not ss[i]&ss[j])
    if o.name=="W28e_tailored_linen":self_pairs=count
    else:sash_self_pairs=count
   obj.to_mesh_clear()
   trees[o.name]=tree
   for name,t in props:
    count=len(tree.overlap(t))
    if count:hits.append({"actor_mesh":o.name,"prop":name,"pairs":count})
  for o in clothes:
   count=len(trees[body.name].overlap(trees[o.name]))
   if count:skin.append({"mesh":o.name,"pairs":count})
  sash_pairs=len(trees["W28e_tailored_linen"].overlap(trees["W22_hand_woven_waist_tie"]))
  wrist=rig.matrix_world@rig.pose.bones["hand_l"].head
  row={"frame":f,"prop_hits":hits,"skin_cloth":skin,"self_pairs":self_pairs,"sash_pairs":sash_pairs,"sash_self_pairs":sash_self_pairs,"wrist":[round(v,6) for v in wrist]}
  if eyes:
   keys=eyes.data.shape_keys
   weights=[k.value for k in list(keys.key_blocks)[1:]]
   assert len(weights)==8 and all(-1e-6<=w<=1+1e-6 for w in weights)
   row["eye_weights"]=weights
   # Eye and eyelid contact is intentional; compare with zero morphs at same pose.
   actual=len(trees[body.name].overlap(trees[eyes.name]))
   ka=keys.animation_data;action=ka.action;slot=ka.action_slot
   ka.action=None
   for k in list(keys.key_blocks)[1:]:k.value=0
   bpy.context.view_layer.update()
   eo=eyes.evaluated_get(bpy.context.evaluated_depsgraph_get());em=eo.to_mesh()
   baseline=BVHTree.FromPolygons([eo.matrix_world@v.co+offset for v in em.vertices],[tuple(p.vertices) for p in em.polygons])
   eo.to_mesh_clear()
   row["eye_face_pairs"]=actual
   row["eye_face_pairs_neutral"]=len(trees[body.name].overlap(baseline))
   ka.action=action;ka.action_slot=slot
  rows.append(row)
 assert all(abs(r["frame"]-(1+i*(.25 if track==gesture else 1)))<1e-6 for i,r in enumerate(rows))
 if eyes:
  if track==gesture:
   expected=next(a["peak_frame_60"] for a in m["animations"] if a["name"]==track.name)
   assert max(abs(a-b) for a,b in zip(rows[236]["eye_weights"],expected))<.0001
  else:assert all(max(abs(w) for w in r["eye_weights"])<1e-6 for r in rows)
 bad=[r["frame"] for r in rows if r["prop_hits"] or r["skin_cloth"] or r["self_pairs"] or r["sash_pairs"] or r["sash_self_pairs"]]
 if track==gesture:
  assert (Vector(rows[0]["wrist"])-Vector((.40878424,-.15502822,.94349938))).length<.001,rows[0]
  assert (Vector(rows[236]["wrist"])-Vector((.4070375,.0368253,1.1945803))).length<.001,rows[236]
 print(variant.upper()+"_REIMPORT_CLIP",json.dumps({"name":track.name,"samples":len(rows),"bad":bad,"first_hit":next((r for r in rows if r["prop_hits"] or r["skin_cloth"] or r["self_pairs"] or r["sash_pairs"] or r["sash_self_pairs"]),None)}),flush=True)
 return {"name":track.name,"rows":rows,"bad":bad}
idle=next(t for t in tracks if t.name=="Mother_QuietIdle")
results=[check(gesture,417),check(idle,144)]
out=root/(variant+"-glb-audit.json");assert not out.exists()
out.write_text(json.dumps({"status":variant.upper()+"_EXPORTED_SKIN_PROP_SAMPLED_CLEARANCE","actor_sha256":sha(asset),"house_sha256":sha(glb),"actor_meshes":len(actor_meshes),"props":len(props),"excluded_importer_helpers":excluded,"clips":results},indent=2),encoding="utf8")
assert all(not r["bad"] for r in results),"Exported garment failed clearance"
print(variant.upper()+"_EXPORTED_PAIR_PASS",flush=True)
