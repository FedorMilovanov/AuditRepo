"""Independent GLB reimport: candidate/house hashes, real skin and basket BVH."""
import bpy,os,json,hashlib,struct,math
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
root=Path(os.environ["HOREB_W28_ACTOR_OUTPUT"]);house=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"])
m=json.loads((root/"w28-actor-manifest.json").read_text(encoding="utf8"))
h=json.loads((house/"w28-house-manifest.json").read_text(encoding="utf8"))
asset=root/"w28-actor.glb";glb=house/"w28-house.glb"
assert sha(asset)==m["glb_sha256"]=="e8101ec691c52a5ce3549f0825e925688ecb15ba76ebc8ca2937c6e13d24662a"
assert sha(glb)==h["glb_sha256"]=="fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622"
assert asset.stat().st_size==m["glb_bytes"] and glb.stat().st_size==h["bytes"]
assert sha(root/"w28-baked-full-audit.json")==m["audit_sha256"]
assert m["sample_count"]==417 and m["placement_three"]==[-.58,.015,.30]
assert m["table_left_x"]==-.005 and m["left_leg_delta_x"]==.39
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
assert len(actor_meshes)==9
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

groups={g.index:g.name for g in body.vertex_groups}
digits=["thumb","index","middle","ring","pinky"]
names=["hand_l"]+[f"{d}_0{i}_l" for d in digits for i in [1,2,3]]
obj=body.evaluated_get(bpy.context.evaluated_depsgraph_get());me=obj.to_mesh()
tags={}
for v in me.vertices:
 w={groups.get(g.group,""):g.weight for g in v.groups}
 if sum(w.get(n,0) for n in names)<.45:continue
 tags[v.index]=max(["palm"]+digits,key=lambda n:w.get("hand_l",0) if n=="palm" else sum(w.get(f"{n}_0{i}_l",0) for i in [1,2,3]))
obj.to_mesh_clear();assert len(tags)>1000
clothes=[o for o in actor_meshes if o.name.startswith(("Linen_sleeve","Stitched_lower_hem","Tunic_","W22_"))]
assert len(clothes)==7
def audit(track,n):
 for t in tracks:t.mute=t!=track
 strip=track.strips[0];start,end=strip.frame_start,strip.frame_end
 rows=[]
 for j in range(n):
  f=start+(end-start)*j/(n-1)
  scene.frame_set(math.floor(f),subframe=f-math.floor(f));bpy.context.view_layer.update()
  dg=bpy.context.evaluated_depsgraph_get();trees={}
  for o in [body]+clothes:
   obj=o.evaluated_get(dg);me=obj.to_mesh()
   vs=[obj.matrix_world@v.co+offset for v in me.vertices]
   trees[o.name]=BVHTree.FromPolygons(vs,[tuple(p.vertices) for p in me.polygons])
   if o==body:
    near={k:[] for k in ["palm"]+digits}
    for i,k in tags.items():
     _,_,_,distance=rim.find_nearest(vs[i])
     if distance is not None:near[k].append(distance*1000)
    nearest={k:round(min(v),3) if v else None for k,v in near.items()}
   obj.to_mesh_clear()
  hits=[]
  for o in clothes:
   count=len(trees[body.name].overlap(trees[o.name]))
   if count:hits.append({"mesh":o.name,"pairs":count})
  seams=[]
  for i,a in enumerate(clothes):
   for b in clothes[i+1:]:
    count=len(trees[a.name].overlap(trees[b.name]))
    if count:seams.append({"a":a.name,"b":b.name,"pairs":count})
  wrist=(rig.matrix_world@rig.pose.bones["hand_l"].head)+offset
  _,_,_,wd=rim.find_nearest(wrist)
  rows.append({"frame":f,"body_cloth":hits,"cloth_cloth_diagnostic":seams,"nearest_skin_mm":nearest,"wrist_surface_mm":round(wd*1000,3)})
 bad=[r["frame"] for r in rows if r["body_cloth"]]
 peak=[r for r in rows if 48<=r["frame"]<=70]
 print("W28_SELF_CLIP",json.dumps({"clip":track.name,"samples":n,"body_cloth_bad":len(bad),"first_hit":next((r for r in rows if r["body_cloth"]),None),"peak_skin_max_mm":{k:max(r["nearest_skin_mm"][k] for r in peak) for k in ["palm"]+digits},"peak_wrist_max_mm":max(r["wrist_surface_mm"] for r in peak)}),flush=True)
 return {"name":track.name,"rows":rows,"bad":bad}
idle=next(t for t in tracks if t.name=="Mother_QuietIdle")
results=[audit(gesture,105),audit(idle,144)]
out=root/"w28-self-audit.json";assert not out.exists()
out.write_text(json.dumps({"status":"EXPORTED_SKIN_CLOTH_DIAGNOSTIC_NOT_GRIP","actor_sha256":sha(asset),"house_sha256":sha(glb),"clips":results},indent=2),encoding="utf8")
print("W28_SELF_AUDIT_COMPLETE",flush=True)
