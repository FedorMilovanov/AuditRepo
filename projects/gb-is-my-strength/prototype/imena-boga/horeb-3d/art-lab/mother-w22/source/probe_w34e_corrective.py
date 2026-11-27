"""W34e: invert linear skinning for a localized static corrective morph.
Verify the actual evaluated mesh reproduces the W34d post-skin target.
No change to the original GLB, no accepted grasp or clip."""
import os,runpy,json,math,hashlib
from pathlib import Path
import numpy as np
import bpy
from mathutils import Vector,Matrix
os.environ["HOREB_W34D_FOCUSED"]="1"
ns=runpy.run_path(str(Path(__file__).with_name("probe_w34d_local.py")))
rig,body,tunic,meshes,good,bones,full,eval_mesh,mask,seeds0,pose=[ns[k] for k in ("rig","body","tunic","meshes","good","bones","full","eval_mesh","mask","seeds0","pose")]
out=Path(os.environ["HOREB_W34A_OUTPUT"])
pose(good[0])
assert full()["skin_pairs"]==118
objects=(body,tunic)
def local(o):
 ev=o.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh()
 a=np.array([list(v.co) for v in me.vertices],dtype=np.float64);ev.to_mesh_clear();return a
before={o.name:local(o) for o in objects}
targets={}
for o in objects:
 g=o.vertex_groups.new(name="W34e_local_target")
 for i,v in mask(o,seeds0[o.name],4).items():g.add([i],v,"REPLACE")
 m=o.modifiers.new(name="W34e_local_target",type="SMOOTH");m.vertex_group=g.name;m.factor=.5;m.iterations=20
 bpy.context.view_layer.update()
 targets[o.name]=local(o)
 o.modifiers.remove(m);o.vertex_groups.remove(g)
bpy.context.view_layer.update()
keys={};records={}
for o in objects:
 a=before[o.name];target=targets[o.name];delta=target-a
 idx=np.flatnonzero(np.linalg.norm(delta,axis=1)>1e-8)
 assert len(idx)>0
 # Linear blend of the exact deform bones in mesh-local coordinates.
 assert len([m for m in o.modifiers if m.type=="ARMATURE" and m.object==rig])==1
 ar=next(m for m in o.modifiers if m.type=="ARMATURE" and m.object==rig)
 assert not ar.use_deform_preserve_volume and ar.use_vertex_groups and not ar.use_bone_envelopes
 mat={}
 for g in o.vertex_groups:
  b=rig.pose.bones.get(g.name)
  if b and b.bone.use_deform:
   t=o.matrix_world.inverted()@rig.matrix_world@b.matrix@b.bone.matrix_local.inverted()@rig.matrix_world.inverted()@o.matrix_world
   mat[g.index]=np.array(t.to_3x3(),dtype=np.float64)
 if not o.data.shape_keys:o.shape_key_add(name="Basis",from_mix=False)
 basis=o.data.shape_keys.key_blocks[0]
 key=o.shape_key_add(name="W34e_JointPoseCorrective",from_mix=False);key.value=0
 rows=[];conds=[]
 for i in idx:
  v=o.data.vertices[int(i)];terms=[(g.weight,mat[g.group]) for g in v.groups if g.group in mat and g.weight>0]
  assert terms,(o.name,int(i))
  M=sum(w*m for w,m in terms)/sum(w for w,m in terms)
  conds.append(float(np.linalg.cond(M)));assert conds[-1]<30
  d=np.linalg.solve(M,delta[i])
  key.data[int(i)].co=basis.data[int(i)].co+Vector(d)
  rows.append({"vertex":int(i),"rest":list(basis.data[int(i)].co),"delta":d.tolist(),"weights":[[o.vertex_groups[g.group].name,float(g.weight)] for g in v.groups if g.group in mat and g.weight>0]})
 keys[o.name]=key
 records[o.name]={"changed":len(rows),"max_condition":max(conds),"max_rest_delta_mm":max(np.linalg.norm(r["delta"])*1000 for r in rows),"rows":rows}
for k in keys.values():k.value=1
bpy.context.view_layer.update()
for o in objects:
 err=np.linalg.norm(local(o)-targets[o.name],axis=1)*1000
 records[o.name]["max_target_error_mm"]=float(err.max())
 assert err.max()<.025,(o.name,float(err.max()))
result=full()
print("W34E_MORPH",json.dumps({"audit":result,"records":{n:{k:v for k,v in x.items() if k!="rows"} for n,x in records.items()}}),flush=True)
assert not result["skin_pairs"] and not result["prop_hits"] and not any(result["skin_cloth"].values()) and not any(result["cloth_self"].values()) and not any(result["garment_pairs"].values())
for k in keys.values():k.value=0
bpy.context.view_layer.update()
assert full()["skin_pairs"]==118
for o in objects:assert np.max(np.linalg.norm(local(o)-before[o.name],axis=1))*1000<.001
# Save exact rest-space correction payload, not a duplicate actor asset.
report={"status":"ART_HOLD_NATIVE_MORPH_STATIC_ONLY","source_actor_sha256":hashlib.sha256((Path(os.environ["HOREB_W31F_OUTPUT"])/"w31f-actor.glb").read_bytes()).hexdigest(),"pose":good[0],"records":records,"audit":result,"limitations":["Blender shape-key replay at one static pose; no glTF export/reimport or animation validation.","No grip contact, lift, carry or artistic acceptance."]}
(out/"w34e-corrective-deltas.json").write_text(json.dumps(report,indent=2))
# Geometry-only same-camera review of actual evaluated meshes, not a mockup.
scene=bpy.context.scene
for o in list(scene.objects):o.hide_render=True
rot=ns["ns"]["rot"];off=ns["ns"]["off"]
transform=rot.to_4x4();transform.translation=off
scene.render.engine="BLENDER_WORKBENCH"
scene.render.resolution_x=720;scene.render.resolution_y=480;scene.render.resolution_percentage=100
scene.display.shading.light="STUDIO";scene.display.shading.color_type="MATERIAL";scene.display.shading.show_cavity=True
scene.display.shading.cavity_type="BOTH";scene.display.shading.show_shadows=True
scene.display.shading.background_type="WORLD"
cam=bpy.data.objects.new("W34e_review_camera",bpy.data.cameras.new("W34e_review_camera"));scene.collection.objects.link(cam);scene.camera=cam
cam.data.type="ORTHO";cam.data.ortho_scale=1.05
cam.location=Vector((.85,-1.30,1.66));target=Vector((-.20,-.26,1.19));cam.rotation_euler=(target-cam.location).to_track_quat("-Z","Y").to_euler()
basket=ns["ns"]["basket"]
for o in list(scene.objects):
 p=o.parent
 while p and p!=basket:p=p.parent
 if p==basket and o.type=="MESH":o.hide_render=False
for value,label in ((0,"uncorrected"),(1,"corrected")):
 pose(good[0])
 for k in keys.values():k.value=value
 bpy.context.view_layer.update()
 check=full()
 assert check["skin_pairs"]==(118 if value==0 else 0),("visual pose drift",label,check["skin_pairs"])
 for o in objects:
  err=np.linalg.norm(local(o)-(before[o.name] if value==0 else targets[o.name]),axis=1)*1000
  assert err.max()<.025,("visual target drift",label,o.name,float(err.max()))
 copies=[]
 for o in meshes:
  ev=o.evaluated_get(bpy.context.evaluated_depsgraph_get())
  m=bpy.data.meshes.new_from_object(ev)
  c=bpy.data.objects.new("W34e_review_"+o.name,m);scene.collection.objects.link(c);c.matrix_world=transform@ev.matrix_world;copies.append(c)
 scene.render.filepath=str(out/("w34e-"+label+".png"));bpy.ops.render.render(write_still=True)
 for c in copies:
  m=c.data;bpy.data.objects.remove(c,do_unlink=True);bpy.data.meshes.remove(m)
print("W34E_VISUAL_RENDERED",flush=True)
