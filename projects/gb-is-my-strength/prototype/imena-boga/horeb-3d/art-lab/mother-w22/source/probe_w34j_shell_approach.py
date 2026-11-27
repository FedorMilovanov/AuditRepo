"""W34j: intentional palm support on the sloping basket shell.
Alternative choreography feasibility, not a physical lift or new animation."""
import os,runpy,json,math,hashlib
from pathlib import Path
import bpy
from mathutils import Vector,Matrix,Quaternion
out=Path(os.environ["HOREB_W34A_OUTPUT"]);root=Path(os.environ["HOREB_W34F_OUTPUT"])
# Fail before the imported probe can write any existing evidence.
actor_pole=os.environ.get("HOREB_W34K_ACTOR_POLE")=="1"
foot_witness=os.environ.get("HOREB_W34L_FOOT_WITNESS")
room_audit=os.environ.get("HOREB_W34N_ROOM_AUDIT")=="1"
if actor_pole or foot_witness or room_audit:
 assert os.environ.get("HOREB_W34J_LONG_SIDE")=="1" and os.environ.get("HOREB_W34J_LEAN")=="1"
 assert not any((out/name).exists() for name in ("w34j-shell-approach.json","w34a-stance.json","w34a-static-full.json")), "Use a fresh evidence directory"
asset=root/"w34f-actor.glb";h=hashlib.sha256(asset.read_bytes()).hexdigest()
assert h=="587c7b0b10d38207a3a305ba71557f8f4ba82abd2ca21fc3389aba5e52009dcf"
grounded={}
if foot_witness:
 witness_bytes=Path(foot_witness).read_bytes()
 witness=json.loads(witness_bytes)
 assert witness["status"]=="ART_HOLD_FOOT_SURFACE_WITNESS"
 assert witness["actor_sha256"]==h
 assert witness["house_sha256"]==hashlib.sha256((Path(os.environ["HOREB_W28_HOUSE_OUTPUT"])/"w28-house.glb").read_bytes()).hexdigest()
 assert abs(witness["frame_time_s"]-1/24)<1e-6 and max(witness["shoulder_reference_errors_mm"])<.1
 for row in witness["rows"]:
  if row["yaw_deg"]!=180:continue
  trial=row["grounded_trial"];before=row["offset"];after=trial["offset"]
  assert before[:2]==after[:2] and abs(before[2]-.015)<1e-7
  assert abs((before[2]-after[2])*1000-min(f["minimum_gap_mm"] for f in row["feet"].values()))<.001
  assert set(trial["feet"])=={"l","r"}
  assert all(f["below_floor_vertices"]==0 and f["within_2mm_vertices"]>0 and abs(f["minimum_gap_mm"])<.5 for f in trial["feet"].values())
  grounded[(row["yaw_deg"],*before[:2])]=after[2]
 assert set(grounded)=={(180,.35,-.96),(180,.35,-1.04)}
os.environ.update(HOREB_W34A_IK="audit",HOREB_W34B_HINGE="1",HOREB_W34A_STANCE_X="-.52",HOREB_W34B_DIAG="0")
ns=runpy.run_path(str(Path(__file__).with_name("probe_w34a_stance.py")),init_globals={"candidate_asset":asset})
rig,body,meshes,bones,full,eval_mesh,solve,props,safe,p,groups=[ns[k] for k in ("rig","body","meshes","bones","full","eval_mesh","solve","props","safe","p","groups")]
g=eval_mesh.__globals__
# W34n: keep the original 98 props (and basket ray trees) unchanged.
# Audit all remaining imported meshes separately, including floor contacts.
room_inventory=[]
floor_names={"Room_floor_earthen","Courtyard_earthen_ground"}
if room_audit:
 from mathutils.bvhtree import BVHTree
 prop_names={n for n,_,_,_ in props}
 scene_meshes=[o for o in ns["imported"] if o.type=="MESH"]
 assert len(prop_names)==len(props)==98
 assert len({o.name for o in scene_meshes})==len(scene_meshes)
 assert prop_names<={o.name for o in scene_meshes}
 for o in scene_meshes:
  if o.name in prop_names:continue
  # Exact world-space bounds, not a local-space box or object origin.
  pts=[o.matrix_world@v.co for v in o.data.vertices]
  assert pts and len(o.data.polygons)>0,o.name
  lo=tuple(min(v[k] for v in pts) for k in range(3));hi=tuple(max(v[k] for v in pts) for k in range(3))
  room_inventory.append({"object":o,"lo":lo,"hi":hi,"tree":None})
 assert len(room_inventory)+len(props)==len(scene_meshes)
 assert floor_names<={r["object"].name for r in room_inventory}
 original_full=full
 def full():
  a=original_full()
  a["room_surface_hits"]=[];a["floor_surface_hits"]=[]
  for o in meshes:
   pts,faces=eval_mesh(o)
   lo=tuple(min(v[k] for v in pts) for k in range(3));hi=tuple(max(v[k] for v in pts) for k in range(3))
   candidates=[r for r in room_inventory if all(lo[k]<=r["hi"][k] and hi[k]>=r["lo"][k] for k in range(3))]
   if not candidates:continue
   tree=BVHTree.FromPolygons(pts,faces)
   for r in candidates:
    obj=r["object"]
    if r["tree"] is None:
     r["tree"]=BVHTree.FromPolygons([obj.matrix_world@v.co for v in obj.data.vertices],[tuple(f.vertices) for f in obj.data.polygons])
    pairs=tree.overlap(r["tree"])
    if pairs:
     key="floor_surface_hits" if obj.name in floor_names else "room_surface_hits"
     a[key].append([o.name,obj.name,len(pairs)])
  return a
tunic=next(o for o in meshes if o.name=="W28e_tailored_linen")
for o in (body,tunic):
 o.data.shape_keys.animation_data_clear()
 o.data.shape_keys.key_blocks["W34e_JointPoseCorrective"].value=0
bpy.context.scene.frame_set(1);bpy.context.view_layer.update()
base={b.name:b.rotation_quaternion.copy() for b in bones}
def reset():
 for n,q in base.items():bones[n].rotation_quaternion=q
 bpy.context.view_layer.update()
def basis(f,t):
 f=f.normalized();t=(t-f*t.dot(f)).normalized()
 return Matrix((f,t,f.cross(t))).transposed()
shell=next(t for n,t,a,b in props if n=="Hand_woven_basket_body")
# Table and base are measured in the same actual Blender world coordinates.
base_prop=next((a,b) for n,t,a,b in props if n=="Basket_W26_closed_woven_base")
table=next((a,b) for n,t,a,b in props if n=="Coarse_work_surface")
gap=(base_prop[0].z-table[1].z)*1000
assert 10<gap<12,gap
def hand_basis(side):
 f=p("middle_01_"+side)-p("hand_"+side)
 t=p("index_01_"+side)-p("pinky_01_"+side)
 return basis(f,t)
# Select actual surface vertices on the palm face, well inside the wrist/
# finger-base span. The palm sign follows the prior mirrored hand basis.
landmarks={}
for side,sign in (("l",1),("r",-1)):
 B=hand_basis(side);w=p("hand_"+side);pts,fs=eval_mesh(body)
 gid=body.vertex_groups["hand_"+side].index
 candidates=[]
 for v in body.data.vertices:
  if not any(x.group==gid and x.weight>=.55 for x in v.groups):continue
  q=B.transposed()@(pts[v.index]-w)
  if .025<q.x<.065 and abs(q.y)<.022:candidates.append((-sign*q.z,v.index,q))
 assert len(candidates)>=8,(side,len(candidates))
 top=sorted(candidates,key=lambda x:-x[0])[:min(16,len(candidates))]
 landmarks[side]={"ids":[x[1] for x in top],"local":sum((x[2] for x in top),Vector())/len(top)}
print("W34J_PALM",json.dumps({s:{"vertices":len(x["ids"]),"local":list(x["local"])} for s,x in landmarks.items()}),flush=True)
rows=[]
long_side=os.environ.get("HOREB_W34J_LONG_SIDE")=="1"
lean_trial=os.environ.get("HOREB_W34J_LEAN")=="1"
assert not lean_trial or long_side
if long_side:
 # Face the long edge of the tabletop from the south, rather than
 # standing at its short end. Keep the original table/basket fixed.
 placements=[(180,.35,y,lean) for y in (-.96,-1.04) for lean in (12,18)] if lean_trial else [(180,.35,y,0) for y in (-.88,-.96,-1.04)]
else:
 placements=[(90,x,-.26,0) for x in (-.44,-.40,-.36)]
# Three intentionally separated shell sectors, not a repeated near-rim sweep.
# In each sector use the actual outward shell normal and a tangent direction.
basket_trees=[(n,t) for n,t,a,b in props if not n.startswith(("Coarse_work_surface","Domestic_clay_bench","Workshop_wood_support"))]
assert len(basket_trees)==92
def setup(lean):
 reset()
 if lean:
  for n in ("spine_01","spine_02"):
   ns["rotate"](n,Quaternion((1,0,0),math.radians(-lean/2)))
for yaw,sx,sy,lean in placements:
 g["rot"]=Matrix.Rotation(math.radians(yaw),3,"Z");g["inv"]=g["rot"].transposed()
 stance_z=grounded[(yaw,sx,sy)] if foot_witness else .015
 g["off"]=Vector((sx,sy,stance_z))
 setup(lean)
 neutral=full()
 neutral_room={k:neutral[k] for k in ("room_surface_hits","floor_surface_hits")} if room_audit else {}
 if not long_side:assert not neutral["prop_hits"]
 for lateral,z in ((.17,1.015),(.22,1.055),(.27,1.095)):
  for direction in ((-1,) if lean_trial else (-1,1)):
   setup(lean);targets={};ok=True;reason=None
   for side,sign in (("l",1),("r",-1)):
    if long_side:
     ray=Vector((0,1,0));origin=Vector((.35-sign*lateral,-1.3,z))
    else:
     ray=Vector((1,0,0));origin=Vector((-.8,-.26+sign*lateral,z))
    hit,n,fi,dist=shell.ray_cast(origin,ray,2)
    if hit is None:ok=False;reason={"side":side,"kind":"no_shell_ray_hit"};break
    if n.dot(ray)>0:n=-n
    normal=-n
    f=Vector((0,0,direction));f=(f-normal*f.dot(normal)).normalized()
    t=(-sign*normal).cross(f)
    desired=basis(f,t)
    # Aim palm center outside the shell; not a point buried in the wicker.
    outer=hit
    if lean_trial:
     hits=[(q[3],q[0],name) for name,tree in basket_trees if (q:=tree.ray_cast(origin,ray,2))[0] is not None]
     if hits:outer=min(hits,key=lambda x:x[0])[1]
    target=outer+n*(.012 if lean_trial else .008)
    wrist=target-desired@landmarks[side]["local"]
    shoulder,elbow,oldw=[p(n+"_"+side) for n in ("upperarm","lowerarm","hand")]
    reach=(elbow-shoulder).length+(oldw-elbow).length
    distance=(wrist-shoulder).length
    pole=Matrix.Rotation(math.radians(yaw-90),3,"Z")@Vector((-.20,sign*.50,-1)) if actor_pole else None
    if not solve(side,wrist,f,t,.50,pole_world=pole):
     ok=False;reason={"side":side,"kind":"ik_failed","distance_mm":distance*1000,"arm_length_mm":reach*1000,"wrist":list(wrist),"shell_point":list(hit)};break
    targets[side]={"shell_point":list(hit),"shell_normal":list(n),"wrist":list(wrist)}
    if pole is not None:targets[side]["elbow_pole_world"]=list(pole)
   if not ok:
    rows.append({"stance_x":sx,"stance_y":sy,"stance_z":stance_z,"yaw_deg":yaw,"neutral_prop_hits":neutral["prop_hits"],**neutral_room,"lean_deg":lean,"lateral":lateral,"height":z,"direction":direction,"reachable":False,"reason":reason});continue
   pts,fs=eval_mesh(body)
   for side in ("l","r"):
    vals=[shell.find_nearest(pts[i]) for i in landmarks[side]["ids"]]
    targets[side]["palm_mean_mm"]=sum(q[3] for q in vals)*1000/len(vals)
    targets[side]["palm_min_mm"]=min(q[3] for q in vals)*1000
    if lean_trial:
     gaps=[min(tree.find_nearest(pts[i])[3] for _,tree in basket_trees) for i in landmarks[side]["ids"]]
     targets[side]["palm_wicker_mean_mm"]=sum(gaps)*1000/len(gaps)
     targets[side]["palm_wicker_min_mm"]=min(gaps)*1000
    targets[side]["palm_normal_dot"]=float((-1 if side=="l" else 1)*(hand_basis(side).col[2]).dot(Vector(targets[side]["shell_normal"])))
   a=full()
   row={"stance_x":sx,"stance_y":sy,"stance_z":stance_z,"yaw_deg":yaw,"neutral_prop_hits":neutral["prop_hits"],**neutral_room,"lean_deg":lean,"lateral":lateral,"height":z,"direction":direction,"reachable":True,"targets":targets,"audit":a,"quats":{n:list(bones[n].rotation_quaternion) for n in ("spine_01","spine_02","upperarm_l","lowerarm_l","hand_l","upperarm_r","lowerarm_r","hand_r")}}
   rows.append(row)
def clear(a):return not a["prop_hits"] and not a.get("room_surface_hits") and not a.get("floor_surface_hits") and not a["skin_pairs"] and not any(a["skin_cloth"].values()) and not any(a["cloth_self"].values()) and not any(a["garment_pairs"].values())
reachable=[r for r in rows if r["reachable"]]
propclear=[r for r in reachable if not r["audit"]["prop_hits"]]
accepted=[r for r in propclear if clear(r["audit"])]
roomclear=[r for r in propclear if not r["audit"]["room_surface_hits"]] if room_audit else None
def rank(r):
 a=r["audit"];score=100000*len(a["prop_hits"])+a["skin_pairs"]+sum(a["skin_cloth"].values())+sum(a["cloth_self"].values())+sum(a["garment_pairs"].values())+sum(t["palm_mean_mm"] for t in r["targets"].values())
 return (len(a["prop_hits"]),len(a["room_surface_hits"]),len(a["floor_surface_hits"]),score) if room_audit else score
best=sorted(reachable,key=rank)[:3]
report={"room_audit_enabled":room_audit,"additional_room_meshes":len(room_inventory) if room_audit else None,"prop_and_nonfloor_room_clear":len(roomclear) if room_audit else None,"foot_witness_sha256":hashlib.sha256(witness_bytes).hexdigest() if foot_witness else None,"actor_relative_elbow_pole":actor_pole,"long_side":long_side,"lean_trial":lean_trial,"status":"ART_HOLD_SHELL_PALM_APPROACH","actor_sha256":h,"table_base_gap_mm":gap,"tested":len(rows),"reachable":len(reachable),"prop_clear":len(propclear),"fully_clear":len(accepted),"best":best,"rows":rows,"limitations":["Static shell approach only, corrective morphs disabled for the new pose. No lift, contact forces, finger closure or continuous path proof.","Room audit, when enabled, is sampled surface overlap only; floor hits may include intended contact and require review. No solid containment, balance or trajectory proof. When disabled, the 98-prop result excludes the remaining room."]}
(out/"w34j-shell-approach.json").write_text(json.dumps(report,indent=2))
print("W34J_SHELL",json.dumps({k:report[k] for k in ("tested","reachable","prop_clear","fully_clear","table_base_gap_mm","best")}),flush=True)
# Test a tabletop tip geometry only: a pivot around a far-side bottom
# support, then a vertical correction to keep the true lowest vertex at
# the tabletop. Does not move the real prop or pretend hands follow.
basket=ns["basket"];basket_meshes=[]
for o in bpy.data.objects:
 if o.type!="MESH":continue
 parent=o.parent
 while parent and parent!=basket:parent=parent.parent
 if parent==basket:basket_meshes.append(o)
assert len(basket_meshes)==92
verts=[o.matrix_world@v.co for o in basket_meshes for v in o.data.vertices]
floor=table[1].z;bottom=min(v.z for v in verts)
base_pts=[v for v in verts if v.z<bottom+.002]
pivot=max(base_pts,key=lambda v:v.x).copy()
near_x=min(v.x for v in base_pts)
tip=[]
for angle in (0,4,8,12,16):
 R=Matrix.Rotation(math.radians(angle),3,"Y")
 pp=[pivot+R@(v-pivot) for v in verts]
 settle=floor-min(v.z for v in pp)
 near_pts=[pivot+R@(v-pivot)+Vector((0,0,settle)) for v in base_pts if v.x<near_x+.025]
 tip.append({"angle_deg":angle,"settle_mm":settle*1000,"near_base_clearance_min_mm":min(v.z-floor for v in near_pts)*1000,"near_base_clearance_max_mm":max(v.z-floor for v in near_pts)*1000,"pivot":list(pivot)})
report["table_tip_geometry"]=tip
report["table_tip_limitations"]="Analytic rigid tilt settled on tabletop; not tested with actor, grip, support stability, infant or animation."
(out/"w34j-shell-approach.json").write_text(json.dumps(report,indent=2))
print("W34J_FAILURES",json.dumps([r["reason"] for r in rows if not r["reachable"]]),flush=True)
print("W34J_TIP",json.dumps(tip),flush=True)


if os.environ.get("HOREB_W34J_RENDER")=="1":
 assert lean_trial and best
 row=best[0]
 g["rot"]=Matrix.Rotation(math.radians(row["yaw_deg"]),3,"Z");g["inv"]=g["rot"].transposed()
 g["off"]=Vector((row["stance_x"],row["stance_y"],row["stance_z"]))
 reset()
 for n,q in row["quats"].items():bones[n].rotation_quaternion=Quaternion(q)
 bpy.context.view_layer.update()
 assert full()==row["audit"]
 scene=bpy.context.scene
 transform=g["rot"].to_4x4();transform.translation=g["off"]
 for o in list(scene.objects):o.hide_render=True
 for o in basket_meshes:o.hide_render=False
 for o in bpy.data.objects:
  if o.type=="MESH" and o.name.startswith(("Coarse_work_surface","Workshop_wood_support")):o.hide_render=False
 for o in meshes:
  ev=o.evaluated_get(bpy.context.evaluated_depsgraph_get());m=bpy.data.meshes.new_from_object(ev)
  c=bpy.data.objects.new("W34j_review_"+o.name,m);scene.collection.objects.link(c);c.matrix_world=transform@ev.matrix_world
 scene.render.engine="BLENDER_WORKBENCH";scene.render.resolution_x=720;scene.render.resolution_y=480;scene.render.resolution_percentage=100
 scene.display.shading.light="STUDIO";scene.display.shading.color_type="MATERIAL";scene.display.shading.show_cavity=True;scene.display.shading.cavity_type="BOTH";scene.display.shading.show_shadows=True
 cam=bpy.data.objects.new("W34j_camera",bpy.data.cameras.new("W34j_camera"));scene.collection.objects.link(cam);scene.camera=cam;cam.data.type="ORTHO"
 for label,location,target,size in (("whole",(1.65,-2.05,1.95),(.35,-.60,.91),1.85),("hands",(1.25,-1.45,1.62),(.35,-.48,1.09),.82)):
  cam.location=Vector(location);cam.rotation_euler=(Vector(target)-cam.location).to_track_quat("-Z","Y").to_euler();cam.data.ortho_scale=size
  scene.render.filepath=str(out/f"w34j-{label}.png");bpy.ops.render.render(write_still=True)
 print("W34J_RENDER_PASS",flush=True)
