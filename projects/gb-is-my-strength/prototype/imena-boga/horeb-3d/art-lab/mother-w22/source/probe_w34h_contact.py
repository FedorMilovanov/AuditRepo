"""W34h static contact refinement on the actual exported corrective GLB.
Retain shoulders, elbows and stance; no animation, basket movement or physical grip."""
import os,runpy,json,math,hashlib
from pathlib import Path
import bpy
from mathutils import Quaternion,Vector
from mathutils.bvhtree import BVHTree
out=Path(os.environ["HOREB_W34A_OUTPUT"]);root=Path(os.environ["HOREB_W34F_OUTPUT"])
asset=root/"w34f-actor.glb";h=hashlib.sha256(asset.read_bytes()).hexdigest()
assert h=="587c7b0b10d38207a3a305ba71557f8f4ba82abd2ca21fc3389aba5e52009dcf"
os.environ.update(HOREB_W34A_IK="audit",HOREB_W34B_HINGE="1",HOREB_W34A_STANCE_X="-.52",HOREB_W34B_DIAG="0")
ns=runpy.run_path(str(Path(__file__).with_name("probe_w34a_stance.py")),init_globals={"candidate_asset":asset})
rig,body,meshes,good,bones,full,eval_mesh,prop_hits,pad_dist,groups,arm_regions,skinfaces,skinsets,rimtree=[ns[k] for k in ("rig","body","meshes","good","bones","full","eval_mesh","prop_hits","pad_dist","groups","arm_regions","skinfaces","skinsets","rimtree")]
tunic=next(o for o in meshes if o.name=="W28e_tailored_linen")
for n,q in (good[0]["left"]["quats"]|good[0]["right"]["quats"]).items():bones[n].rotation_quaternion=Quaternion(q)
for o in (body,tunic):
 o.data.shape_keys.animation_data_clear();o.data.shape_keys.key_blocks["W34e_JointPoseCorrective"].value=1
bpy.context.view_layer.update()
def clear(a):return not a["prop_hits"] and not a["skin_pairs"] and not any(a["skin_cloth"].values()) and not any(a["cloth_self"].values()) and not any(a["garment_pairs"].values())
initial=full();assert clear(initial)
digits=("thumb","index","middle","ring","pinky")
names=[f"hand_{side}" for side in ("l","r")]+[f"{d}_{i:02d}_{side}" for side in ("l","r") for d in digits for i in (1,2,3)]
base={n:bones[n].rotation_quaternion.copy() for n in names}
# Bounded local joint offsets. Positive and negative directions evaluated
# independently rather than assuming mirrored anatomical axis signs.
refine_path=os.environ.get("HOREB_W34H_REFINE_SOURCE")
refine=json.loads(Path(refine_path).read_text()) if refine_path else None
if refine:assert refine["actor_sha256"]==h and refine["final_clear"]
bounds=[(-24,24)]*3+[(-50,50),(-25,25),(-40,40)]+[(-55,55)]*4
if refine:bounds += [(-25,25),(-25,25)]
def apply(side,v):
 def put(n,q):bones[n].rotation_quaternion=base[n]@q
 n="hand_"+side
 put(n,Quaternion((1,0,0),math.radians(v[0]))@Quaternion((0,1,0),math.radians(v[1]))@Quaternion((0,0,1),math.radians(v[2])))
 put("thumb_01_"+side,Quaternion((0,0,1),math.radians(v[3]))@Quaternion((1,0,0),math.radians(v[4]))@Quaternion((0,1,0),math.radians(v[10] if len(v)>10 else 0)))
 for i in (2,3):put(f"thumb_{i:02d}_{side}",Quaternion((1,0,0),math.radians(v[5]+(v[11] if i==3 and len(v)>11 else 0))))
 for d,f in zip(digits[1:],v[6:]):
  for i,ratio in ((1,.35),(2,.8),(3,1)):
   put(f"{d}_{i:02d}_{side}",Quaternion((1,0,0),math.radians(f*ratio)))
 bpy.context.view_layer.update()
def measure(side,v):
 apply(side,v);pts,fs=eval_mesh(body);hits=prop_hits(pts,fs)
 bt=BVHTree.FromPolygons(pts,fs);region=arm_regions[side]
 at=BVHTree.FromPolygons(pts,[fs[i] for i in region])
 skin={tuple(sorted((region[i],j))) for i,j in at.overlap(bt) if region[i]!=j and not skinsets[region[i]]&skinsets[j]}
 dist=pad_dist(pts,side)
 # Preserve zero intersection. Thumb and at least two opposing fingers
 # matter more than making every digit equally close to the rim.
 fingers=sorted(dist[d] for d in digits[1:])
 cost=2*max(0,dist["thumb"]-3)**2+sum(max(0,x-3)**2 for x in fingers[:2])+.35*sum(max(0,x-3)**2 for x in fingers[2:])+.001*sum(x*x for x in v)
 if refine:
  normals={}
  for d,ids in groups[side].items():
   hits0=[rimtree.find_nearest(pts[i]) for i in ids]
   normals[d]=min(hits0,key=lambda x:x[3])[1]
  dots={d:normals["thumb"].dot(normals[d]) for d in digits[1:]}
  # Prefer opposite rim faces for a nearby finger, not just nearest points
  # on the same side. The proxy does not certify force closure.
  opposing=min(max(0,dots[d]+.6)**2*400+max(0,dist[d]-3)**2 for d in digits[1:])
  cost+=2*max(0,dist["thumb"]-3)**2+opposing
 return {"params":list(v),"pads_mm":dist,"prop_hits":hits,"skin_pairs":len(skin),"cost":cost}
def feasible(r):return not r["prop_hits"] and not r["skin_pairs"]
def contact_geometry(side):
 pts,fs=eval_mesh(body);r={}
 for d,ids in groups[side].items():
  hits=sorted((rimtree.find_nearest(pts[i])[3],i) for i in ids)[:5]
  loc,n,_,dist=rimtree.find_nearest(pts[hits[0][1]])
  r[d]={"closest_mm":dist*1000,"mean5_mm":sum(x[0] for x in hits)*200,"rim_point":list(loc),"rim_normal":list(n),"skin_point":list(pts[hits[0][1]])}
 thumb=Vector(r["thumb"]["rim_normal"])
 r["thumb_opposition_dots"]={d:thumb.dot(Vector(r[d]["rim_normal"])) for d in digits[1:]}
 return r
replay=os.environ.get("HOREB_W34I_REPLAY")
if replay:
 q=json.loads(Path(replay).read_text());assert q["actor_sha256"]==h and q["final_clear"]
 for side in ("l","r"):apply(side,q["sides"][side]["best"]["params"])
 assert clear(full())
 if os.environ.get("HOREB_W34I_SUPPORT")=="1":
  # Small forearm adjustments around the accepted pose, coupled with
  # wrist/thumb orientation. Corrective is NOT presumed safe away from
  # its original pose: every accepted improvement must pass full().
  fore={side:bones["lowerarm_"+side].rotation_quaternion.copy() for side in ("l","r")}
  def apply_support(side,v):
   n="lowerarm_"+side
   delta=Quaternion((1,0,0),math.radians(v[12]))@Quaternion((0,1,0),math.radians(v[13]))@Quaternion((0,0,1),math.radians(v[14]))
   bones[n].rotation_quaternion=fore[side]@delta
   bpy.context.view_layer.update()
   apply(side,v[:12])
  def assess_support(side,v):
   apply_support(side,v)
   geo=contact_geometry(side)
   thumb=geo["thumb"]["mean5_mm"]
   # Surface-normal and gap proxy: favour actual nearby underside
   # support and an opposed thumb on a different face of the rim.
   fs=[geo[d] for d in digits[1:]]
   support=sorted(max(0,x["mean5_mm"]-3)**2+150*max(0,x["rim_normal"][2]+.35)**2 for x in fs)
   opp=min(300*max(0,geo["thumb_opposition_dots"][d]+.6)**2+max(0,geo[d]["mean5_mm"]-3)**2 for d in digits[1:])
   cost=3*max(0,thumb-3)**2+sum(support[:2])+.25*sum(support[2:])+opp+.05*sum(x*x for x in v[12:])
   return {"params":list(v),"geometry":geo,"cost":cost}
  stats={}
  for side in ("l","r"):
   v=q["sides"][side]["best"]["params"]+[0,0,0];assert len(v)==15
   initial=assess_support(side,v);best=initial;count=1;valid=1
   # No more than 60 bounded local trials per hand.
   for step in (4,2):
    for i in (12,13,14,0,1,2,3,4,5,10,11,6,7,8,9):
     winner=best
     for sign in (-1,1):
      w=best["params"].copy();lo,hi=((-6,6) if i>=12 else bounds[i] if i<len(bounds) else (-25,25))
      w[i]=max(lo,min(hi,w[i]+sign*step))
      if w==best["params"]:continue
      trial=assess_support(side,w);count+=1
      if trial["cost"]>=winner["cost"]:continue
      audit=full()
      if clear(audit):winner=trial;valid+=1
     best=winner
    print("W34I_SUPPORT_STEP",side,step,json.dumps({"cost":best["cost"],"thumb_mm":best["geometry"]["thumb"]["mean5_mm"]}),flush=True)
   apply_support(side,best["params"])
   stats[side]={"initial":initial,"best":best,"evaluations":count,"accepted_improvements":valid-1}
  audit=full();assert clear(audit)
  final={"status":"ART_HOLD_STATIC_SUPPORT_PROXY","actor_sha256":h,"source_report_sha256":hashlib.sha256(Path(replay).read_bytes()).hexdigest(),"sides":stats,"final_audit":audit,"final_clear":True,"quats":{n:list(bones[n].rotation_quaternion) for n in names+["lowerarm_l","lowerarm_r"]},"limitations":["Static pose only; nearest rim normals are not force closure or verified load bearing. Small forearm rotations were independently checked with the fixed corrective; not a new animation."]}
  (out/"w34i-support.json").write_text(json.dumps(final,indent=2))
  print("W34I_SUPPORT_PASS",json.dumps({side:{"evaluations":r["evaluations"],"accepted":r["accepted_improvements"],"cost":r["best"]["cost"],"gaps_mm":{d:r["best"]["geometry"][d]["mean5_mm"] for d in digits},"opposition":r["best"]["geometry"]["thumb_opposition_dots"],"normal_z":{d:r["best"]["geometry"][d]["rim_normal"][2] for d in digits}} for side,r in stats.items()}),flush=True)
 # Snapshot evaluated geometry before rendering (no animation re-evaluation).
 scene=bpy.context.scene
 rot,off,basket=ns["rot"],ns["off"],ns["basket"]
 transform=rot.to_4x4();transform.translation=off
 for o in list(scene.objects):o.hide_render=True
 for o in list(scene.objects):
  p=o.parent
  while p and p!=basket:p=p.parent
  if p==basket and o.type=="MESH":o.hide_render=False
 for o in meshes:
  ev=o.evaluated_get(bpy.context.evaluated_depsgraph_get())
  m=bpy.data.meshes.new_from_object(ev)
  c=bpy.data.objects.new("W34i_review_"+o.name,m);scene.collection.objects.link(c);c.matrix_world=transform@ev.matrix_world
 scene.render.engine="BLENDER_WORKBENCH"
 scene.render.resolution_x=720;scene.render.resolution_y=480;scene.render.resolution_percentage=100
 scene.display.shading.light="STUDIO";scene.display.shading.color_type="MATERIAL";scene.display.shading.show_cavity=True;scene.display.shading.cavity_type="BOTH";scene.display.shading.show_shadows=True
 cam=bpy.data.objects.new("W34i_camera",bpy.data.cameras.new("W34i_camera"));scene.collection.objects.link(cam);scene.camera=cam;cam.data.type="ORTHO";cam.data.ortho_scale=.34
 geo={side:contact_geometry(side) for side in ("l","r")}
 for side,sign in (("l",1),("r",-1)):
  center=sum((Vector(geo[side][d]["skin_point"]) for d in digits),Vector())/5
  for label,direction in (("top",Vector((-.38,sign*.40,.85))),("inside",Vector((.65,sign*.25,.45)))):
   cam.location=center+direction.normalized()*.8;cam.rotation_euler=(center-cam.location).to_track_quat("-Z","Y").to_euler()
   scene.render.filepath=str(out/f"w34i-{side}-{label}.png");bpy.ops.render.render(write_still=True)
 (out/"w34i-visual-contact.json").write_text(json.dumps(geo,indent=2))
 print("W34I_RENDER_PASS",flush=True)
 raise SystemExit(0)
results={};params={}
for side in ("l","r"):
 v=(refine["sides"][side]["best"]["params"]+[0,0]) if refine else [0]*10
 initial_side=measure(side,v);assert feasible(initial_side)
 best=initial_side;trials=1;valid=1
 # Coupled opposition/flexion screen centered on previous result.
 if refine:
  for a in (-16,-8,0,8,16):
   for b in (-12,0,12):
    w=v.copy();w[3]=max(-50,min(50,w[3]+a));w[4]=max(-25,min(25,w[4]+b))
    q=measure(side,w);trials+=1
    if feasible(q):
     valid+=1
     if q["cost"]<best["cost"]:best=q
 # Coarse to fine coordinate descent, each accepted step remains surface-clear.
 for step in ((12,6,3,1) if refine else (16,8,4,2)):
  for i in ((3,4,5,10,11,0,1,2,6,7,8,9) if refine else (0,1,2,3,4,5,6,7,8,9)):
   choices=[best]
   for sign in (-1,1):
    w=best["params"].copy();w[i]=max(bounds[i][0],min(bounds[i][1],w[i]+step*sign))
    if w==best["params"]:continue
    q=measure(side,w);trials+=1
    if feasible(q):choices.append(q);valid+=1
   best=min(choices,key=lambda r:r["cost"])
  print("W34H_STEP",side,step,json.dumps({"cost":best["cost"],"pads_mm":best["pads_mm"]}),flush=True)
 params[side]=best["params"];apply(side,params[side])
 results[side]={"initial":initial_side,"best":best,"evaluations":trials,"clear_evaluations":valid}
 # retain left result while evaluating right; full audit follows.
for side in ("l","r"):apply(side,params[side])
result=full();geometry={side:contact_geometry(side) for side in ("l","r")}
report={"status":"ART_HOLD_STATIC_CONTACT_SCREEN","actor_sha256":h,"initial_audit":initial,"final_audit":result,"final_clear":clear(result),"sides":results,"contact_geometry":geometry,"quats":{n:list(bones[n].rotation_quaternion) for n in names},"limitations":["Static surface distance to basket rim, not grasp force or continuous collision.","Only hand and digit local rotations varied. No new clip or canonical asset."]}
report["refine_source_sha256"]=hashlib.sha256(Path(refine_path).read_bytes()).hexdigest() if refine else None
(out/"w34h-contact.json").write_text(json.dumps(report,indent=2))
print("W34H_CONTACT",json.dumps({"clear":clear(result),"sides":results,"opposition":{s:geometry[s]["thumb_opposition_dots"] for s in ("l","r")},"audit":result}),flush=True)
