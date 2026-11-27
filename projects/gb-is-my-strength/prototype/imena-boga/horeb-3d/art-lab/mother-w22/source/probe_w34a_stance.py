"""W34a: measure two-hand reach and screen a facing stance on exact W31f/W28 assets.
Static reach and prop clearance only; does not certify a grasp or a lift."""
import bpy,hashlib,json,math,os
from pathlib import Path
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree
root=Path(os.environ["HOREB_W31F_OUTPUT"]);house=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"]);out=Path(os.environ["HOREB_W34A_OUTPUT"])
actor=root/"w31f-actor.glb";asset=house/"w28-house.glb"
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(actor)=="2a72465f5efb0995926b9641a103365122907174447af1ca61b875366e43eb3b"
assert sha(asset)=="fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622"
bpy.ops.wm.read_factory_settings(use_empty=True);s=bpy.context.scene;s.render.fps=24
# Optional exact candidate from a validated derivative manifest. Keep the
# original actor path and SHA as the reference for the saved pose data.
candidate=globals().get("candidate_asset")
if candidate is not None:
 candidate=Path(candidate)
 cm=json.loads(candidate.with_name("w34f-manifest.json").read_text())
 assert cm["status"]=="ART_HOLD_W34F_CORRECTIVE_MORPH_TRIAL" and cm["source_sha256"]==sha(actor) and sha(candidate)==cm["glb_sha256"]
bpy.ops.import_scene.gltf(filepath=str(candidate or actor),merge_vertices=True)
rig=next(o for o in bpy.data.objects if o.type=="ARMATURE")
meshes=[o for o in bpy.data.objects if o.type=="MESH" and any(m.type=="ARMATURE" and m.object==rig for m in o.modifiers)]
assert len(meshes)==9,[o.name for o in meshes]
if candidate is not None:
 # The glTF importer may use the mesh name instead of the node name
 # when creating a morph-bearing object. Resolve via the actual key
 # and original tunic mesh identity, then retain audit names.
 print("W34F_IMPORTED_MESHES",[(o.name,o.data.name) for o in meshes],flush=True)
 tunic=next(o for o in meshes if o.data.name.startswith("W28e_trunk") or o.name.startswith("W28e_trunk") or o.name=="W28e_tailored_linen")
 assert tunic.data.shape_keys and "W34e_JointPoseCorrective" in tunic.data.shape_keys.key_blocks
 if tunic.name!="W28e_tailored_linen":
  old=bpy.data.objects.get("W28e_tailored_linen")
  if old is not None:
   assert old.type=="EMPTY"
   old.name="W28e_tailored_linen_node"
  tunic.name="W28e_tailored_linen"
  assert tunic.name=="W28e_tailored_linen"
for owner in [rig]+[o.data.shape_keys for o in meshes if o.data.shape_keys]:
 ad=owner.animation_data;t=next(t for t in ad.nla_tracks if t.name=="Mother_GestureTowardsBasket");st=t.strips[0]
 ad.use_nla=False;ad.action=st.action;ad.action_slot=st.action_slot
prior=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(asset))
imported=[o for o in bpy.data.objects if o not in prior]
basket=next(o for o in imported if o.name=="BASKET_OBJECT_ACTION_ANCHOR")
props=[]
for o in imported:
 if o.type!="MESH":continue
 p=o.parent
 while p and p!=basket:p=p.parent
 if p!=basket and not o.name.startswith(("Coarse_work_surface","Domestic_clay_bench","Workshop_wood_support")):continue
 pts=[o.matrix_world@v.co for v in o.data.vertices]
 faces=[tuple(f.vertices) for f in o.data.polygons]
 lo=Vector(tuple(min(v[k] for v in pts) for k in range(3)));hi=Vector(tuple(max(v[k] for v in pts) for k in range(3)))
 props.append((o.name,BVHTree.FromPolygons(pts,faces),lo,hi))
 if o.name=="Basket_thick_lipped_rim":rim=pts
assert len(props)==98
center=sum(rim,Vector())/len(rim)
offset=Vector((-.58,-.30,.015))
def sample(frame):
 s.frame_set(frame);bpy.context.view_layer.update()
 bones={n:rig.matrix_world@rig.pose.bones[n].head for n in ("upperarm_l","lowerarm_l","hand_l","upperarm_r","lowerarm_r","hand_r")}
 dg=bpy.context.evaluated_depsgraph_get();geom=[]
 for o in meshes:
  ev=o.evaluated_get(dg);me=ev.to_mesh()
  geom.append((o.name,[ev.matrix_world@v.co for v in me.vertices],[tuple(f.vertices) for f in me.polygons]));ev.to_mesh_clear()
 return bones,geom
bones,geom=sample(1)
def evaluate(yaw,x,y):
 rot=Matrix.Rotation(math.radians(yaw),3,"Z");off=Vector((x,y,.015))
 sides={}
 for side,sign in (("l",1),("r",-1)):
  a,b,c=[rot@bones[f"{n}_{side}"]+off for n in ("upperarm","lowerarm","hand")]
  length=(b-a).length+(c-b).length
  # Different non-crossed near-side sectors of the same rim, separated laterally.
  targets=[v for v in rim if sign*(v.y-center.y)>.085 and v.x<center.x-.17]
  nearest=min(targets,key=lambda v:(v-a).length);dist=(nearest-a).length
  sides[side]={"shoulder":list(a),"target":list(nearest),"arm_length":length,"distance":dist,"reserve":length-dist}
 if min(d["reserve"] for d in sides.values())<.045:return None
 hits=[]
 for name,points,faces in geom:
  pts=[rot@v+off for v in points]
  lo=[min(v[k] for v in pts) for k in range(3)];hi=[max(v[k] for v in pts) for k in range(3)]
  candidates=[(n,t) for n,t,a,b in props if all(lo[k]<=b[k] and hi[k]>=a[k] for k in range(3))]
  if candidates:
   tree=BVHTree.FromPolygons(pts,faces)
   for n,t in candidates:
    pairs=tree.overlap(t)
    if pairs:hits.append([name,n,len(pairs)])
 row={"yaw_deg":yaw,"offset":list(off),"sides":sides,"prop_hits":hits}
 return row
rows=[];tested=0
for yaw in (60,75,90,105,120):
 for x in (-.56,-.52,-.48,-.44,-.40,-.36):
  for y in (-.34,-.26,-.18):
   tested+=1
   row=evaluate(yaw,x,y)
   if row:rows.append(row)
safe=[r for r in rows if not r["prop_hits"]]
safe.sort(key=lambda r:(-min(x["reserve"] for x in r["sides"].values()),abs(r["yaw_deg"]-90),abs(r["offset"][1]+.26)))
print("W34A_STANCE",json.dumps({"tested":tested,"reach_candidates":len(rows),"prop_clear":len(safe),"best":safe[:3]}),flush=True)
out.mkdir(exist_ok=True,parents=True)
report={"status":"ART_HOLD_STATIC_STANCE_SCREEN","actor_sha256":sha(actor),"house_sha256":sha(asset),"frame":1,"tested":tested,"reach_candidates":len(rows),"prop_clear":len(safe),"rows":rows,"best":safe[:3],"limitations":["Static entry pose only; collision check against 98 basket and support meshes, not room or animation path.","Reach to separate rim sectors is necessary, not sufficient for a grasp. No finger orientation, force, grip or lift claim."]}
(out/"w34a-stance.json").write_text(json.dumps(report,indent=2))
assert safe,"No static stance passed this screen"
# Optional second screen: solve the actual two-bone arms and measure pads.
# Does not change the accepted clip or emit a replacement GLB.
if os.environ.get("HOREB_W34A_IK") in ("1","audit"):
 from mathutils import Quaternion
 preferred=float(os.environ.get("HOREB_W34A_STANCE_X","-.36"))
 best=next(r for r in safe if r["yaw_deg"]==90 and abs(r["offset"][0]-preferred)<.0001 and abs(r["offset"][1]+.26)<.0001)
 rot=Matrix.Rotation(math.radians(best["yaw_deg"]),3,"Z");inv=rot.transposed();off=Vector(best["offset"])
 bones=rig.pose.bones
 body=next(o for o in meshes if any(g.name=="index_03_l" for g in o.vertex_groups) and len(o.data.vertices)>10000)
 s.frame_set(1);bpy.context.view_layer.update()
 allnames=[f"{n}_{side}" for side in ("l","r") for n in ("upperarm","lowerarm","hand")]
 baseline={n:bones[n].rotation_quaternion.copy() for n in allnames}
 def p(n):return rot@(rig.matrix_world@bones[n].head)+off
 def rotate(n,delta):
  q=(rig.matrix_world@bones[n].matrix).to_quaternion()
  actor_delta=(inv@delta.to_matrix()@rot).to_quaternion()
  bones[n].rotation_quaternion=bones[n].rotation_quaternion@(q.inverted()@actor_delta@q)
  bpy.context.view_layer.update()
 def solve(side,wrist,facing,transverse,elbow_out,pole_world=None):
  sign=1 if side=="l" else -1
  up,low,hand=[f"{n}_{side}" for n in ("upperarm","lowerarm","hand")]
  a,b,c=p(up),p(low),p(hand);l1=(b-a).length;l2=(c-b).length
  delta=wrist-a;d=delta.length
  if not abs(l1-l2)+.005<d<l1+l2-.005:return False
  axis=delta.normalized()
  # The legacy pole is world-relative for the original yaw=90 approach.
  # Alternate staging may supply its own world-space direction.
  pole=Vector((-.20,sign*elbow_out,-1)) if pole_world is None else Vector(pole_world)
  pole=pole-axis*pole.dot(axis)
  if pole.length<1e-8:return False
  pole=pole.normalized()
  along=(l1*l1-l2*l2+d*d)/(2*d)
  elbow=a+axis*along+pole*math.sqrt(max(0,l1*l1-along*along))
  hinge=os.environ.get("HOREB_W34B_HINGE")=="1"
  def basis(f,t):
   f=f.normalized();t=(t-f*t.dot(f)).normalized()
   return Matrix((f,t,f.cross(t))).transposed()
  if hinge:
   u,v=b-a,c-b;du,dv=elbow-a,wrist-elbow
   # Rotate the upper arm's entire original bending plane to the
   # target bending plane, retaining its anatomical hinge orientation.
   n=u.cross(v);dn=du.cross(dv)
   rotate(up,(basis(du,dn)@basis(u,n).transposed()).to_quaternion())
  else:rotate(up,(b-a).rotation_difference(elbow-a))
  b,c=p(low),p(hand)
  rotate(low,(c-b).rotation_difference(wrist-b))
  if (p(hand)-wrist).length>.0001:return False
  forward=p("middle_01_"+side)-p(hand)
  lateral=p("index_01_"+side)-p("pinky_01_"+side)
  if hinge:
   # Swing/twist decomposition around the actual forearm direction.
   # Share axial orientation with forearm pronation, not wrist flexion.
   axis=(p(hand)-p(low)).normalized()
   desired=(basis(facing,transverse)@basis(forward,lateral).transposed()).to_quaternion()
   twist=Quaternion((desired.w,*(axis*Vector((desired.x,desired.y,desired.z)).dot(axis))))
   if twist.magnitude>1e-8:
    twist.normalize()
    if twist.w<0:twist.negate()
    portion=float(os.environ.get("HOREB_W34B_PRONATION",".65"))
    angle=2*math.atan2(Vector((twist.x,twist.y,twist.z)).dot(axis),twist.w)
    rotate(low,Quaternion(axis,angle*portion))
   forward=p("middle_01_"+side)-p(hand)
   lateral=p("index_01_"+side)-p("pinky_01_"+side)
  rotate(hand,(basis(facing,transverse)@basis(forward,lateral).transposed()).to_quaternion())
  if (p(hand)-wrist).length>.0001:return False
  return True
 digits=("thumb","index","middle","ring","pinky")
 groups={}
 for side in ("l","r"):
  groups[side]={}
  for digit in digits:
   idx=body.vertex_groups[f"{digit}_03_{side}"].index
   groups[side][digit]=[v.index for v in body.data.vertices if any(g.group==idx and g.weight>=.5 for g in v.groups)]
   assert len(groups[side][digit])>=10
 rimtree=next(t for n,t,a,b in props if n=="Basket_thick_lipped_rim")
 def eval_mesh(o):
  ev=o.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh()
  pts=[rot@(ev.matrix_world@v.co)+off for v in me.vertices]
  fs=[tuple(f.vertices) for f in me.polygons];ev.to_mesh_clear()
  return pts,fs
 def prop_hits(pts,faces):
  lo=[min(v[k] for v in pts) for k in range(3)];hi=[max(v[k] for v in pts) for k in range(3)]
  candidates=[(n,t) for n,t,a,b in props if all(lo[k]<=b[k] and hi[k]>=a[k] for k in range(3))]
  if not candidates:return []
  tree=BVHTree.FromPolygons(pts,faces)
  return [[n,len(pairs)] for n,t in candidates if (pairs:=tree.overlap(t))]
 def pad_dist(pts,side):
  return {d:sum(sorted(rimtree.find_nearest(pts[i])[3]*1000 for i in ids)[:5])/5 for d,ids in groups[side].items()}
 hinge=os.environ.get("HOREB_W34B_HINGE")=="1"
 if hinge:
  # Score the actual evaluated arm and tunic, before choosing finalists.
  skinfaces=[tuple(f.vertices) for f in body.data.polygons]
  skinids=[];canon={}
  for v in body.data.vertices:
   sig=(tuple(v.co),tuple(tuple(k.data[v.index].co) for k in body.data.shape_keys.key_blocks),tuple(sorted((g.group,float(g.weight)) for g in v.groups if g.weight!=0)))
   skinids.append(canon.setdefault(sig,len(canon)))
  skinsets=[{skinids[k] for k in f} for f in skinfaces]
  tunic=next(o for o in meshes if o.name=="W28e_tailored_linen")
  arm_regions={}
  for side in ("l","r"):
   names={f"{n}_{side}" for n in ("clavicle","upperarm","lowerarm","hand")}|{f"{d}_{i:02d}_{side}" for d in digits for i in (1,2,3)}
   ids={g.index for g in body.vertex_groups if g.name in names}
   vs={v.index for v in body.data.vertices if sum(g.weight for g in v.groups if g.group in ids)>.1}
   arm_regions[side]=[i for i,f in enumerate(skinfaces) if any(k in vs for k in f)]
  def side_score(pts,faces,side):
   bt=BVHTree.FromPolygons(pts,faces);region=arm_regions[side]
   at=BVHTree.FromPolygons(pts,[faces[i] for i in region])
   sk={tuple(sorted((region[i],j))) for i,j in at.overlap(bt) if region[i]!=j and not skinsets[region[i]]&skinsets[j]}
   tp,tf=eval_mesh(tunic);tt=BVHTree.FromPolygons(tp,tf);sets=list(map(set,tf))
   return [len(sk),len(bt.overlap(tt)),sum(1 for i,j in tt.overlap(tt) if i<j and not sets[i]&sets[j])]
 if os.environ["HOREB_W34A_IK"]=="1":
  candidates={}
  for side in ("l","r"):
   sign=1 if side=="l" else -1
   target=Vector(best["sides"][side]["target"]);rows=[]
   for dx in (.055,.080,.105):
    for dz in (.035,.055,.075):
     for dip in (.20,.40,.65):
      for pole in (.35,.75):
       for n,q in baseline.items():bones[n].rotation_quaternion=q
       bpy.context.view_layer.update()
       wrist=target+Vector((-dx,sign*.015,dz))
       palm=math.radians(float(os.environ.get("HOREB_W34B_PALM_DEG","0")))
       transverse=Vector((0,-sign*math.cos(palm),math.sin(palm)))
       if not solve(side,wrist,Vector((1,-sign*.10,-dip)),transverse,pole):continue
       pts,faces=eval_mesh(body);hits=prop_hits(pts,faces);dist=pad_dist(pts,side)
       row={"side":side,"wrist":list(wrist),"dx":dx,"dz":dz,"dip":dip,"pole":pole,"palm_deg":math.degrees(palm),"distances_mm":dist,"prop_hits":hits,"quats":{n:list(bones[n].rotation_quaternion) for n in allnames if n.endswith("_"+side)}}
       if not hits:
        if hinge:row["side_audit"]=side_score(pts,faces,side)
        rows.append(row)
   rows.sort(key=lambda r:(sum(r.get("side_audit",[])),sum(max(0,d-3)**2 for d in r["distances_mm"].values())))
   candidates[side]=rows[:8]
   print("W34A_IK_SIDE",side,"clear",len(rows),"best",json.dumps(rows[:1]),flush=True)
 if os.environ["HOREB_W34A_IK"]=="1":
  # Test combined poses against props for all 9 meshes. The subsequent
  # full screen checks both arm skin and clothing overlaps.
  combined=[]
  for left in candidates["l"][:4]:
   for right in candidates["r"][:4]:
    for n,q in (left["quats"]|right["quats"]).items():bones[n].rotation_quaternion=Quaternion(q)
    bpy.context.view_layer.update()
    hits=[]
    for o in meshes:
     pts,faces=eval_mesh(o)
     hits.extend([[o.name,n,c] for n,c in prop_hits(pts,faces)])
    combined.append({"left":left,"right":right,"prop_hits":hits})
  good=[r for r in combined if not r["prop_hits"]]
  report2={"status":"ART_HOLD_STATIC_IK_PROBE","actor_sha256":sha(actor),"house_sha256":sha(asset),"stance":best,"individual":candidates,"combined":combined,"combined_prop_clear":len(good),"limitations":["Static sampled arm IK and 98-prop surface overlap only. No new clip or lift.","Pad distance is proximity, not a physical grasp. Skin self-overlap and clothing clearance remain mandatory."]}
  (out/"w34a-dual-ik.json").write_text(json.dumps(report2,indent=2))
  print("W34A_DUAL_IK",json.dumps({"combined":len(combined),"prop_clear":len(good),"best":good[:1]}),flush=True)

 else:
  report2=json.loads((out/"w34a-dual-ik.json").read_text())
  assert report2["actor_sha256"]==sha(actor) and report2["house_sha256"]==sha(asset) and report2["stance"]==best
  good=[r for r in report2["combined"] if not r["prop_hits"]]
 # Full static candidate screen: both arm skin regions, clothing and garment
 # self-contact, using the same source topology rule as the accepted audit.
 arm_names=set(allnames)|{f"{n}_{side}" for side in ("l","r") for n in ("clavicle",)}|{f"{d}_{i:02d}_{side}" for side in ("l","r") for d in digits for i in (1,2,3)}
 ids={g.index for g in body.vertex_groups if g.name in arm_names}
 verts={v.index for v in body.data.vertices if sum(g.weight for g in v.groups if g.group in ids)>.1}
 faces=[tuple(f.vertices) for f in body.data.polygons]
 region=[i for i,f in enumerate(faces) if any(k in verts for k in f)]
 canonical={};ci=[]
 for v in body.data.vertices:
  sig=(tuple(v.co),tuple(tuple(k.data[v.index].co) for k in body.data.shape_keys.key_blocks),tuple(sorted((g.group,float(g.weight)) for g in v.groups if g.weight!=0)))
  ci.append(canonical.setdefault(sig,len(canonical)))
 face_sets=[{ci[k] for k in f} for f in faces]
 clothes=[o for o in meshes if o!=body and not any(k in o.name.lower() for k in ("eye","brow","lash","low-poly"))]
 assert len(clothes)==5,[o.name for o in meshes]
 def full():
  trees={};allpts={};allfaces={};hits=[]
  for o in meshes:
   pts,fs=eval_mesh(o);trees[o.name]=BVHTree.FromPolygons(pts,fs);allpts[o.name]=pts;allfaces[o.name]=fs
   hits.extend([[o.name,n,c] for n,c in prop_hits(pts,fs)])
  arm=BVHTree.FromPolygons(allpts[body.name],[faces[i] for i in region])
  skin=set(tuple(sorted((region[i],j))) for i,j in arm.overlap(trees[body.name]) if region[i]!=j and not face_sets[region[i]]&face_sets[j])
  cloth={o.name:len(trees[body.name].overlap(trees[o.name])) for o in clothes}
  selfpairs={}
  for o in clothes:
   fs=list(map(set,allfaces[o.name]));tree=trees[o.name]
   selfpairs[o.name]=sum(1 for i,j in tree.overlap(tree) if i<j and not fs[i]&fs[j])
  # Same dress/sash and head linen pairs checked by the accepted W31f audit.
  pair={}
  for i,o in enumerate(clothes):
   for t in clothes[i+1:]:
    if any(n in ("W22_plain_linen_head_cover","W22_linen_rear_drape") for n in (o.name,t.name)) or set((o.name,t.name))=={"W28e_tailored_linen","W22_hand_woven_waist_tie"}:
     pair[o.name+"|"+t.name]=len(trees[o.name].overlap(trees[t.name]))
  result={"prop_hits":hits,"skin_pairs":len(skin),"skin_cloth":cloth,"cloth_self":selfpairs,"garment_pairs":pair}
  if os.environ.get("HOREB_W34B_DIAG")=="1":
   from collections import Counter
   def label(fi):
    weights={}
    for vi in faces[fi]:
     for g in body.data.vertices[vi].groups:
      weights[g.group]=weights.get(g.group,0)+g.weight
    return body.vertex_groups[max(weights,key=weights.get)].name
   result["skin_regions"]=dict(Counter("|".join(sorted((label(i),label(j)))) for i,j in skin))
  return result
 for n,q in baseline.items():bones[n].rotation_quaternion=q
 bpy.context.view_layer.update()
 initial=full();print("W34A_STATIC_BASE",json.dumps(initial),flush=True)
 checked=[]
 for row in good:
  for n,q in (row["left"]["quats"]|row["right"]["quats"]).items():bones[n].rotation_quaternion=Quaternion(q)
  bpy.context.view_layer.update()
  result=full();checked.append({"pose":row,"audit":result})
 def clear(r):
  a=r["audit"]
  return not a["prop_hits"] and not a["skin_pairs"] and not any(a["skin_cloth"].values()) and not any(a["cloth_self"].values()) and not any(a["garment_pairs"].values())
 cleared=[r for r in checked if clear(r)]
 (out/"w34a-static-full.json").write_text(json.dumps({"status":"ART_HOLD_STATIC_IK_SCREEN","actor_sha256":sha(actor),"house_sha256":sha(asset),"baseline":initial,"checked":checked,"clear_count":len(cleared)},indent=2))
 print("W34A_STATIC_FULL",json.dumps({"checked":len(checked),"clear":len(cleared),"first":checked[0]["audit"] if checked else None}),flush=True)

 if os.environ.get("HOREB_W34B_DIAG")=="1" and checked:
  # Isolate the source of residual overlap without changing vertices or rig.
  bestrow=min(checked,key=lambda r:r["audit"]["skin_pairs"]+sum(r["audit"]["skin_cloth"].values())+sum(r["audit"]["cloth_self"].values()))
  goal=bestrow["pose"]["left"]["quats"]|bestrow["pose"]["right"]["quats"]
  trials=[]
  for factor in (0,.25,.5,.75,1):
   for n,q in goal.items():bones[n].rotation_quaternion=baseline[n].slerp(Quaternion(q),factor) if n.startswith("hand_") else Quaternion(q)
   bpy.context.view_layer.update()
   pts,fs=eval_mesh(body);a=full()
   trials.append({"wrist_factor":factor,"audit":a,"pads_mm":{side:pad_dist(pts,side) for side in ("l","r")}})
  (out/"w34b-wrist-diagnostic.json").write_text(json.dumps({"best":bestrow,"trials":trials},indent=2))
  print("W34B_WRIST_DIAG",json.dumps([{"factor":r["wrist_factor"],"skin":r["audit"]["skin_pairs"],"regions":r["audit"].get("skin_regions"),"cloth":sum(r["audit"]["skin_cloth"].values()),"self":sum(r["audit"]["cloth_self"].values()),"prop":len(r["audit"]["prop_hits"])} for r in trials]),flush=True)
