"""Independent GLB reimport: candidate/house hashes, real skin and basket BVH."""
import bpy,os,json,hashlib,struct,math
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
variants=[v for v in ("w28f","w28g","w28l","w28o","w28q","w28r","w29c","w30b","w30c","w30d","w30e","w31a","w31d") if os.environ.get("HOREB_"+v.upper()+"_OUTPUT")]
assert len(variants)==1,"Choose one audit candidate"
variant=variants[0]
root=Path(os.environ["HOREB_"+variant.upper()+"_OUTPUT"]);house=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"])
expected={
 "w28f":("ART_HOLD_W28F_NECKLINE_SASH","be7c3f919d56f3b415d6fdaf707be11663888898408fb425134d6a5699e19e64","w28f-dense-audit.json"),
 "w28g":("ART_HOLD_W28G_HEAD_ARM","a30e66d6b0bf1b973d52869244873ca1be2ad2033b36e4cb397af8e563da4c36","w28g-native-audit.json"),
 "w28l":("ART_HOLD_W28L_GAZE_TRIAL","3e1baf347b9197b2a59da935f15245f2ef289302b72cde22047642e563acc488",None),
 "w28o":("ART_HOLD_W28O_BLINK_TRIAL","70cd23b9029efcd1357a9211ce7ab651d8b816438f20ad0c198fdbf7bd042741",None),
 "w28q":("ART_HOLD_W28Q_SHOULDER_TRIAL","a4c2bad8ee870766717151369ce3de6cda2fdaddc17bf14e43741d4c79397f74",None),
 "w28r":("ART_HOLD_W28R_GRIP_MOTION_TRIAL","6bb286037d794b0830840dd709ba257d5a3e722540665f6527b782338f8499cd",None),
 "w29c":("ART_HOLD_W29C_LOSSLESS_COMPACT_TRIAL","8f11fc78285d4aece03b94554967f4deb3ad191b6a01055784f6a08e16a2c8d1",None),
 "w30b":("ART_HOLD_W30B_DRAPE_TRIAL","85c24882620b35154ac9e333c6d37406b457d4d3b05aa07fbc024812b5f0ac35",None),
 "w30c":("ART_HOLD_W30C_DRAPE_SHAPE_TRIAL","cff945d163c95bd7673e3a5405f55b45168b764eaa412fa7b8b81714f9da6668",None),
 "w30d":("ART_HOLD_W30D_TUNIC_SHAPE_TRIAL","d5b1dc8af5e2dc0156be33b03f78b4c2d91baf2e3c7ea2646e8b8803f965e442",None),
 "w30e":("ART_HOLD_W30E_HEAD_JOIN_TRIAL","8b63fcab7933a8493b6337437f0ae7f17c5ba3e50106d40945687ea1ce8aac6b",None),
 "w31a":("ART_HOLD_W31A_IDLE_MOTION_TRIAL","af19f098d2eac791453745181bde30ca51df8565bbec946b5dd8b68cec9b0669",None),
 "w31d":("ART_HOLD_W31D_FREE_ARM_TRIAL","8c03caab4aa8d4871883ff5d8a71ee15f556abf226c0789c0dbe368c65be6113",None),
}[variant]
m=json.loads((root/{"w28l":"w28l-eye-manifest.json","w28o":"w28o-blink-manifest.json"}.get(variant,variant+"-manifest.json")).read_text(encoding="utf8"))
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
elif variant in ("w28o","w28q"):
 assert m["glb_sha256"]==("a4c2bad8ee870766717151369ce3de6cda2fdaddc17bf14e43741d4c79397f74" if variant=="w28o" else "6bb286037d794b0830840dd709ba257d5a3e722540665f6527b782338f8499cd")
 if variant=="w28q":
  assert m["facial_animation_unchanged"] is True and m["params_mm"]==[24,16] and m["garment_mapped_vertices"]==18390 and m["changed_vertices"]==1925
  assert sha(root/"w28q-shoulder-probe.json")==m["coarse_probe_sha256"] and sha(root/"w28q-shoulder-delta.json")==m["delta_sha256"]
 assert m["bone_animation_unchanged"] is True and m["mapped_vertices"]==14517
 assert m["events"]=={"Mother_QuietIdle":[34,110],"Mother_GestureTowardsBasket":[12,91]}
 assert len(m["blink_morphs"])==2 and all(t["vertices"]==115 for t in m["blink_morphs"])
elif variant=="w28r":
 assert m["glb_sha256"]=="40b966d66bd72ef628e572bf2f356d6ff13f7752d021b60bdd6c217bb77b81dc"
 assert m["facial_animation_unchanged"] is True and m["geometry_unchanged"] is True and m["non_target_bone_channels_unchanged"] is True and len(m["changed_bone_names"])==12
 assert m["envelope_frames"]==[35,48,71,90] and len(m["changed_rotation_channels"])==12
 assert m["peak_quaternion_error"]<.0002 and m["import_mapping_error"]<.0002
 assert sha(root/"w28r-grip-probe.json")==m["probe_sha256"]
 probe=json.loads((root/"w28r-grip-probe.json").read_text(encoding="utf8"))
 assert probe["source_sha256"]==m["source_sha256"] and probe["house_sha256"]==m["house_sha256"] and not probe["best"]["prop_hits"] and probe["best"]["self_pairs"]==0
 # The source morph schedule is unchanged and checked sample by sample below.
 m["events"]={"Mother_QuietIdle":[34,110],"Mother_GestureTowardsBasket":[12,91]}
elif variant in ("w29c","w30b","w30c","w30d","w30e","w31a","w31d"):
 if variant=="w29c":
  assert m["glb_sha256"]=="0d11d1b64a7b23b60fc1833d82bd938038f43c6369116ed9ac393b7cfa75ea94"
  assert m["all_other_json_identical_after_remap"] is True and m["accessors_byte_identical"]==305 and m["active_material_graphs_identical"]==9
  fa=json.loads((root/"w29c-lash-audit.json").read_text(encoding="utf8"))
  assert fa["actor_sha256"]==m["glb_sha256"] and fa["source_rows_identical"] is True
  assert [len(c["rows"]) for c in fa["clips"]]==[417,144] and all(not c["bad"] for c in fa["clips"])
 elif variant=="w31d":
  assert m["glb_sha256"]=="4b87b59ac8c7c61968ef7c9a00f23939f21e53558d8f74072fde5e5b495e9db8"
  assert m["geometry_idle_and_non_target_channels_unchanged"] is True and m["gesture_samples"]==105 and m["loop_endpoints_preserved"] is True
  assert [x["name"] for x in m["changes"]]==["clavicle_r","upperarm_r","lowerarm_r","hand_r"]
  source=Path(os.environ["HOREB_W31D_SOURCE"])
  assert sha(source/"w31a-actor.glb")==m["source_sha256"]
  assert sha(source/"w31a-glb-audit.json")==m["source_pair_audit_sha256"]
  source_audit=json.loads((source/"w31a-glb-audit.json").read_text(encoding="utf8"))
  assert source_audit["actor_sha256"]==m["source_sha256"] and source_audit["house_sha256"]==m["house_sha256"]
  assert [len(c["rows"]) for c in source_audit["clips"]]==[417,144] and all(not c["bad"] for c in source_audit["clips"])
 elif variant=="w31a":
  assert m["glb_sha256"]=="8c03caab4aa8d4871883ff5d8a71ee15f556abf226c0789c0dbe368c65be6113"
  assert m["geometry_gesture_and_other_channels_unchanged"] is True and m["idle_samples"]==144 and m["loop_endpoints_preserved"] is True
  assert [x["name"] for x in m["changes"]]==["spine_02","spine_01","clavicle_l","clavicle_r"]
  source=Path(os.environ["HOREB_W31A_SOURCE"])
  assert sha(source/"w30e-actor.glb")==m["source_sha256"]
  assert sha(source/"w30e-glb-audit.json")==m["source_pair_audit_sha256"]
  source_audit=json.loads((source/"w30e-glb-audit.json").read_text(encoding="utf8"))
  assert source_audit["actor_sha256"]==m["source_sha256"] and source_audit["house_sha256"]==m["house_sha256"]
  assert [len(c["rows"]) for c in source_audit["clips"]]==[417,144] and all(not c["bad"] for c in source_audit["clips"])
 else:
  assert m["glb_sha256"]==("af19f098d2eac791453745181bde30ca51df8565bbec946b5dd8b68cec9b0669" if variant=="w30e" else "8b63fcab7933a8493b6337437f0ae7f17c5ba3e50106d40945687ea1ce8aac6b" if variant=="w30d" else "d5b1dc8af5e2dc0156be33b03f78b4c2d91baf2e3c7ea2646e8b8803f965e442" if variant=="w30c" else "cff945d163c95bd7673e3a5405f55b45168b764eaa412fa7b8b81714f9da6668")
  assert m["only_tunic_positions_normals_changed" if variant=="w30d" else "only_drape_positions_normals_changed"] is True and m["unchanged_views"]==309 and m["coarse_samples"]==18
  assert sha(root/(variant+"-probe.json"))==m["probe_sha256"] and sha(root/(variant+("-tunic-delta.json" if variant=="w30d" else "-drape-delta.json")))==m["delta_sha256"]
  pr=json.loads((root/(variant+"-probe.json")).read_text(encoding="utf8"));win=pr["winner"]
  assert len(win["rows"])==18
  if variant=="w30d":
   assert len(pr["baseline"])==18 and all(not any(n for k,n in r["pairs"].items() if k!="Stitched_lower_hem") and r["pairs"]["Stitched_lower_hem"]==b["pairs"]["Stitched_lower_hem"] for r,b in zip(win["rows"],pr["baseline"]))
  else:assert all(not any(r["pairs"].values()) for r in win["rows"])
 grip_root=Path(os.environ["HOREB_W29C_GRIP_SOURCE"])
 gm=json.loads((grip_root/"w28r-manifest.json").read_text(encoding="utf8"))
 assert sha(grip_root/"w28r-actor.glb")==gm["glb_sha256"]=="40b966d66bd72ef628e572bf2f356d6ff13f7752d021b60bdd6c217bb77b81dc"
 assert sha(grip_root/"w28r-grip-probe.json")==gm["probe_sha256"]
 probe=json.loads((grip_root/"w28r-grip-probe.json").read_text(encoding="utf8"))
 m["events"]={"Mother_QuietIdle":[34,110],"Mother_GestureTowardsBasket":[12,91]}
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
blink_keys=None
if variant in ("w28l","w28o","w28q","w28r","w29c","w30b","w30c","w30d","w30e","w31a","w31d"):
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
if variant in ("w28o","w28q","w28r","w29c","w30b","w30c","w30d","w30e","w31a","w31d"):
 assert body.name=="base" and body.parent==rig
 assert bpy.data.objects["ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0"].type=="EMPTY"
 blink_keys=body.data.shape_keys
 assert [k.name for k in blink_keys.key_blocks]==["Basis","blink_left","blink_right"]
overlays=[]
if variant in ("w29c","w30b","w30c","w30d","w30e","w31a","w31d"):
 overlays=[next(o for o in bpy.data.objects if o.type=="MESH" and o.data.name.startswith(name)) for name in ("W28t_CC0_brows","W29b_CC0_lashes")]
 assert all(o.parent==rig and [k.name for k in o.data.shape_keys.key_blocks]==["Basis","blink_left","blink_right"] for o in overlays)
# GLB UV seams can split geometrically identical vertices. Recognize shared
# topology only when rest, every morph target and nonzero skin weights agree exactly.
def overlay_topology(o):
 keys=o.data.shape_keys.key_blocks
 canonical={};ids=[]
 for v in o.data.vertices:
  signature=(tuple(v.co),tuple(tuple(k.data[v.index].co) for k in keys),tuple(sorted((g.group,float(g.weight)) for g in v.groups if g.weight!=0)))
  ids.append(canonical.setdefault(signature,len(canonical)))
 return ids
overlay_ids={o.name:overlay_topology(o) for o in overlays}
actor_meshes=[]
excluded=[]
for o in bpy.data.objects:
 if o.type!="MESH":continue
 if o in helpers and o.name not in exported_names:
  excluded.append({"name":o.name,"custom_shape_users":sum(b.custom_shape==o for b in rig.pose.bones)})
  continue
 assert o.name in exported_names or o==eyes or (blink_keys and o==body) or o in overlays,("Unclassified mesh",o.name)
 actor_meshes.append(o)
assert len(actor_meshes)==(9 if overlays else 7)
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

clothes=[o for o in actor_meshes if o!=body and o!=eyes and o.name!="W19_CC0_Eyes" and o not in overlays]
assert len(clothes)==5,[o.name for o in actor_meshes]
assert any(o.name=="W28e_tailored_linen" for o in clothes)
ad=rig.animation_data
hand_faces=None
if variant in ("w28r","w29c","w30b","w30c","w30d","w30e","w31a","w31d"):
 digits=("thumb","index","middle","ring","pinky")
 names={"hand_l"}|{f"{d}_{i:02d}_l" for d in digits for i in (1,2,3)}
 groups={g.index for g in body.vertex_groups if g.name in names}
 hand_ids={v.index for v in body.data.vertices if sum(g.weight for g in v.groups if g.group in groups)>=.5}
 hand_faces=[tuple(p.vertices) for p in body.data.polygons if all(i in hand_ids for i in p.vertices)]
 hand_sets=list(map(set,hand_faces))
 assert len(hand_faces)>100
 distal={}
 for digit in digits:
  idx=body.vertex_groups[f"{digit}_03_l"].index
  distal[digit]=[v.index for v in body.data.vertices if any(g.group==idx and g.weight>=.5 for g in v.groups)]
 assert {d:len(v) for d,v in distal.items()}==probe["distal_groups"]
def activate(track):
 strip=track.strips[0]
 ad.use_nla=False;ad.action=strip.action;ad.action_slot=strip.action_slot
 if eyes:
  ka=eyes.data.shape_keys.animation_data
  kt=next(t for t in ka.nla_tracks if t.name==track.name)
  ks=kt.strips[0]
  ka.use_nla=False;ka.action=ks.action;ka.action_slot=ks.action_slot
 if blink_keys:
  ba=blink_keys.animation_data;bt=next(t for t in ba.nla_tracks if t.name==track.name)
  bs=bt.strips[0];ba.use_nla=False;ba.action=bs.action;ba.action_slot=bs.action_slot
 for overlay in overlays:
  ka=overlay.data.shape_keys.animation_data;kt=next(t for t in ka.nla_tracks if t.name==track.name);ks=kt.strips[0]
  ka.use_nla=False;ka.action=ks.action;ka.action_slot=ks.action_slot
 return float(strip.action_frame_start),float(strip.action_frame_end)
def check(track,n):
 start,end=activate(track)
 rows=[]
 for j in range(n):
  f=start+(end-start)*j/(n-1)
  scene.frame_set(math.floor(f),subframe=f-math.floor(f));bpy.context.view_layer.update()
  hits=[];skin=[];self_pairs=0;sash_self_pairs=0;dg=bpy.context.evaluated_depsgraph_get();trees={};hand_extra={};overlay_positions={}
  for o in actor_meshes:
   obj=o.evaluated_get(dg);me=obj.to_mesh()
   if not me.polygons:obj.to_mesh_clear();continue
   fs=[tuple(p.vertices) for p in me.polygons]
   pts=[obj.matrix_world@v.co+offset for v in me.vertices]
   tree=BVHTree.FromPolygons(pts,fs)
   if o in overlays:overlay_positions[o.name]=pts
   if hand_faces is not None and o==body:
    ht=BVHTree.FromPolygons(pts,hand_faces)
    hand_extra["hand_self_pairs"]=sum(1 for i,j in ht.overlap(ht) if i<j and not hand_sets[i]&hand_sets[j])
    if track==gesture and abs(f-60)<1e-6:
     hand_extra["distal_pad_clearance_mm"]={d:sum(sorted(rim.find_nearest(pts[i])[3]*1000 for i in indices)[:5])/5 for d,indices in distal.items()}
     assert all(abs(v-probe["best"]["distal_pad_clearance_mm"][d])<.02 for d,v in hand_extra["distal_pad_clearance_mm"].items())
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
  if blink_keys:
   bw=[k.value for k in list(blink_keys.key_blocks)[1:]]
   assert len(bw)==2 and abs(bw[0]-bw[1])<1e-6 and all(-1e-6<=w<=1+1e-6 for w in bw)
   row["blink_weights"]=bw
  if overlays:
   facial={}
   for o in overlays:
    ow=[k.value for k in list(o.data.shape_keys.key_blocks)[1:]]
    assert max(abs(a-b) for a,b in zip(ow,bw))<1e-6
    facial[o.name]={other.name:len(trees[o.name].overlap(trees[other.name])) for other in [body,eyes,*clothes] }
   facial["overlay_pair"]=len(trees[overlays[0].name].overlap(trees[overlays[1].name]))
   for o in overlays:
    fs=[set(p.vertices) for p in o.data.polygons];ids=overlay_ids[o.name];pts=overlay_positions[o.name]
    count=0;seams=0
    for i,j in trees[o.name].overlap(trees[o.name]):
     if i>=j or fs[i]&fs[j]:continue
     a={ids[k]:k for k in fs[i]};b={ids[k]:k for k in fs[j]};shared=set(a)&set(b)
     # Do not discard proximity or coincident faces. Only an exact shared
     # edge with opposite-side third vertices is a legitimate seam contact.
     if len(shared)==2 and len(a)==len(b)==3:
      u,v=sorted(shared)
      if pts[a[u]]==pts[b[u]] and pts[a[v]]==pts[b[v]]:
       edge=pts[a[v]]-pts[a[u]]
       av=pts[a[next(iter(set(a)-shared))]]-pts[a[u]]
       bv=pts[b[next(iter(set(b)-shared))]]-pts[b[u]]
       if edge.length>0 and edge.cross(av).dot(edge.cross(bv))<0:
        seams+=1;continue
     count+=1
    facial[o.name]["self"]=count
    row.setdefault("facial_uv_seam_contacts",{})[o.name]=seams
   row["facial_pairs"]=facial
   row["facial_bad"]=bool(facial["overlay_pair"] or any(any(facial[o.name].values()) for o in overlays))
  if variant in ("w30b","w30c","w30d","w30e","w31a","w31d"):
   head_linen=[o for o in clothes if o.name in ("W22_plain_linen_head_cover","W22_linen_rear_drape")]
   assert len(head_linen)==2
   garment={}
   for o in head_linen:
    t=trees[o.name];fs=[set(p.vertices) for p in o.data.polygons]
    garment[o.name+"|self"]=sum(1 for i,j in t.overlap(t) if i<j and not fs[i]&fs[j])
    for other in clothes:
     if o==other:continue
     k="|".join(sorted((o.name,other.name)))
     if k not in garment:garment[k]=len(t.overlap(trees[other.name]))
   row["head_linen_pairs"]=garment
   row["head_linen_bad"]=any(garment.values()) or bool(row["eye_face_pairs"] or row["eye_face_pairs_neutral"])
  row.update(hand_extra)
  rows.append(row)
 assert all(abs(r["frame"]-(1+i*(.25 if track==gesture else 1)))<1e-6 for i,r in enumerate(rows))
 if eyes:
  if track==gesture:
   expected=([1,0,0,.5701439025971043,1,0,0,.5513946836384895] if blink_keys else next(a["peak_frame_60"] for a in m["animations"] if a["name"]==track.name))
   assert max(abs(a-b) for a,b in zip(rows[236]["eye_weights"],expected))<.0001
  else:assert all(max(abs(w) for w in r["eye_weights"])<1e-6 for r in rows)
 if blink_keys:
  events=m["events"][track.name]
  def blink_at(frame):
   def pulse(center):
    x=frame-center
    if x < -2 or x > 4:return 0.
    if x <= 0:t=(x+2)/2
    elif x <= 1:return 1.
    else:t=(4-x)/3
    return t*t*(3-2*t)
   return max(pulse(c) for c in events)
  for r in rows:
   f=r["frame"];lo=math.floor(f);t=f-lo
   expected=(1-t)*blink_at(lo)+t*blink_at(lo+1)
   assert abs(r["blink_weights"][0]-expected)<.0001,(f,r["blink_weights"],expected)
 bad=[r["frame"] for r in rows if r["prop_hits"] or r["skin_cloth"] or r["self_pairs"] or r["sash_pairs"] or r["sash_self_pairs"] or r.get("hand_self_pairs",0) or r.get("facial_bad",False) or r.get("head_linen_bad",False)]
 if track==gesture:
  assert (Vector(rows[0]["wrist"])-Vector((.40878424,-.15502822,.94349938))).length<.001,rows[0]
  assert (Vector(rows[236]["wrist"])-Vector((.4070375,.0368253,1.1945803))).length<.001,rows[236]
 print(variant.upper()+"_REIMPORT_CLIP",json.dumps({"name":track.name,"samples":len(rows),"bad":bad,"first_hit":next((r for r in rows if r["prop_hits"] or r["skin_cloth"] or r["self_pairs"] or r["sash_pairs"] or r["sash_self_pairs"] or r.get("hand_self_pairs",0) or r.get("facial_bad",False) or r.get("head_linen_bad",False)),None)}),flush=True)
 return {"name":track.name,"rows":rows,"bad":bad}
idle=next(t for t in tracks if t.name=="Mother_QuietIdle")
results=[check(gesture,417),check(idle,144)]
if variant=="w31a":
 # Independent replay of the untouched gesture must reproduce the source evidence.
 prior=source_audit["clips"][0];actual=results[0]
 assert prior["name"]==actual["name"] and prior["bad"]==actual["bad"]
 assert len(prior["rows"])==len(actual["rows"])==417
 for a,b in zip(prior["rows"],actual["rows"]):
  assert a==b,("Gesture replay differs",a["frame"])
 print("W31A_GESTURE_REPLAY_IDENTICAL",len(actual["rows"]),flush=True)

if variant=="w31d":
 assert results[1]==source_audit["clips"][1],"Idle replay differs"
 for a,b in zip(results[0]["rows"],source_audit["clips"][0]["rows"]):
  assert a["frame"]==b["frame"] and (Vector(a["wrist"])-Vector(b["wrist"])).length<1e-6
 print("W31D_IDLE_REPLAY_IDENTICAL_AND_LEFT_WRIST_PASS",144,417,flush=True)
out=root/(variant+"-glb-audit.json");assert not out.exists()
out.write_text(json.dumps({"status":variant.upper()+"_EXPORTED_SKIN_PROP_SAMPLED_CLEARANCE","actor_sha256":sha(asset),"house_sha256":sha(glb),"actor_meshes":len(actor_meshes),"props":len(props),"excluded_importer_helpers":excluded,"clips":results},indent=2),encoding="utf8")
assert all(not r["bad"] for r in results),"Exported garment failed clearance"
print(variant.upper()+"_EXPORTED_PAIR_PASS",flush=True)
