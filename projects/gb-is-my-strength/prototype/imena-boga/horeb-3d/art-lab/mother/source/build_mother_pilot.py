"""HOREB W18: MakeHuman CC0 anatomical actor + original modest linen costume.
Real weighted 53-bone skeleton, two original skeletal clips. Not Exodus likeness.
Blender 4.5.16 LTS; requires isolated MPFB 2.0.18 (GPL authoring only).
W18 is ART HOLD: placeholder skin, eyes, hair and amateur wardrobe until art review.
"""
import bpy, sys, importlib, os, json, hashlib, math
from mathutils import Vector
from math import sin,cos,pi
ROOT=os.environ.get("HOREB_ART_PIPELINE_ROOT",r"H:\HOREB_ArtPipeline")
SRC=os.path.join(ROOT,"source")
OUT=os.path.join(ROOT,"export")
os.makedirs(SRC,exist_ok=True);os.makedirs(OUT,exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
def get_service(suffix,symbol):
 for name in sys.modules:
  if name.endswith(suffix):
   return getattr(importlib.import_module(name),symbol)
 raise RuntimeError("MPFB extension not loaded: "+suffix)
HumanService=get_service("mpfb.services.humanservice","HumanService")
TargetService=get_service("mpfb.services.targetservice","TargetService")
macros=TargetService.get_default_macro_info_dict()
macros.update(gender=.02,age=.47,weight=.48,muscle=.42,height=.46)
body=HumanService.create_human(macro_detail_dict=macros)
body.name="ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0"
rig=HumanService.add_builtin_rig(body,"game_engine")
rig.name="MOTHER_PERFORMER__53_BONE_RIG"
assert len(rig.data.bones)==53,(len(rig.data.bones), "Expected 53-bone game engine rig")
assert any(m.type=='ARMATURE' for m in body.modifiers)
def mat(name,rgb,rough=.92):
 m=bpy.data.materials.new(name)
 m.use_nodes=True
 p=m.node_tree.nodes.get("Principled BSDF")
 p.inputs["Base Color"].default_value=(*rgb,1)
 p.inputs["Roughness"].default_value=rough
 return m
skin=mat("W18_skin_TEMP_not_art_approved",(.52,.34,.23),.86)
linen=mat("Undyed_rough_linen_TEMP",(.62,.53,.40),.95)
shade=mat("Undyed_linen_shadow",(.54,.45,.34),.94)
trim=mat("Thin_hemline_original",(.43,.32,.23),.95)
dark=mat("Hairline_covered_temporary",(.19,.135,.10),.92)
body.data.materials.clear();body.data.materials.append(skin)
# Cloth panels are weighted to the actual pelvic, spine and arm bones.
def weighted_mesh(name,verts,faces,weights,material,rig=rig):
 mesh=bpy.data.meshes.new(name+"_mesh")
 mesh.from_pydata(verts,[],faces);mesh.update()
 obj=bpy.data.objects.new(name,mesh)
 bpy.context.collection.objects.link(obj)
 obj.data.materials.append(material)
 obj.parent=rig
 groups={}
 for w in weights:
  for b in w:
   if b not in groups:groups[b]=obj.vertex_groups.new(name=b)
 for i,w in enumerate(weights):
  n=sum(v for v in w.values())
  if n<.5:raise ValueError("Unweighted "+name)
  for b,amount in w.items():
   if b not in rig.data.bones:raise ValueError("Unknown bone "+b)
   groups[b].add([i],max(.00001,amount/n),'REPLACE')
 arm=obj.modifiers.new("Real_MPFB_bone_skin","ARMATURE")
 arm.object=rig
 for p in mesh.polygons:p.use_smooth=True
 return obj
# Loose full-length linen tunic with nonidentical folds, physically separate from body.
profiles=[(.155,.37,.26),(.25,.38,.275),(.37,.375,.275),(.53,.36,.27),
 (.72,.335,.248),(.85,.32,.242),(.98,.30,.222),(1.12,.31,.224),
 (1.24,.30,.210),(1.29,.23,.173),(1.32,.148,.120)]
N=48;verts=[];faces=[];weights=[]
for j,(z,rx,ry) in enumerate(profiles):
 for k in range(N):
  angle=k*2*pi/N
  pleat=1+.045*sin(angle*13+z*4)+.018*sin(angle*23-z*8)
  zz=z+.008*sin(angle*6+z*3)
  verts.append((rx*cos(angle)*pleat,ry*sin(angle)*pleat-.012,zz))
  if z<.87:w={"pelvis":1.}
  elif z<1.05:w={"pelvis":.65,"spine_01":.35}
  elif z<1.25:w={"spine_02":.6,"spine_03":.4}
  else:w={"spine_03":1.}
  weights.append(w)
for j in range(len(profiles)-1):
 for k in range(N):
  a=j*N+k;b=j*N+(k+1)%N
  faces.append((a,b,b+N,a+N))
weighted_mesh("Tunic_orig_hand_draped",verts,faces,weights,linen)
# Hem seam bands have their own topology; not a thin invisible shader decal.
def band(name,z,rx,ry,material,bone):
 verts=[];faces=[];weights=[]
 n=64
 for h in [-.012,.012]:
  for k in range(n):
   a=k*2*pi/n
   verts.append(((rx+.01)*cos(a),(ry+.01)*sin(a)-.012,z+h))
   weights.append({bone:1})
 for k in range(n):
  faces.append((k,(k+1)%n,n+(k+1)%n,n+k))
 weighted_mesh(name,verts,faces,weights,material)
band("Stitched_lower_hem",.162,.37,.26,trim,"pelvis")
# Draped linen sleeves are weighted to upper arm and forearm, use the rig's bone basis.
for side in ('l','r'):
 u=rig.data.bones['upperarm_'+side]
 f=rig.data.bones['lowerarm_'+side]
 a=Vector(u.head_local);b=Vector(u.tail_local).lerp(Vector(f.tail_local),.33)
 axis=(b-a).normalized()
 radial=axis.cross(Vector((0,1,0))).normalized()
 other=axis.cross(radial).normalized()
 v=[];fa=[];w=[];count=28;steps=14
 for j in range(steps+1):
  t=j/steps
  centre=a.lerp(b,t)
  radius=.134-.026*t+.007*sin(pi*t)
  for k in range(count):
   angle=k*2*pi/count
   radius2=radius+.003*sin(angle*9+t*8)
   x=centre+(radial*cos(angle)+other*sin(angle))*radius2
   v.append(tuple(x));w.append({'upperarm_'+side:1-.25*t,'lowerarm_'+side:.25*t})
 for j in range(steps):
  for k in range(count):
   a0=j*count+k;b0=j*count+(k+1)%count
   fa.append((a0,b0,b0+count,a0+count))
 weighted_mesh("Linen_sleeve_"+side,v,fa,w,linen if side=='l' else shade)
# W18B: original head scarf remains a proper *dome* around the scalp.
# The earlier straight slab sat behind the head and obscured facial staging.
# This tight cap is deliberately a blockout; author historical linen hair wrapping.
v=[];fa=[];w=[];rows=12;count=40
for j in range(rows+1):
 t=j/rows
 angle=t*pi/2
 rr=sin(angle)
 for k in range(count):
  phi=k*2*pi/count
  v.append((.13*rr*cos(phi),-.015+.112*rr*sin(phi),1.535-.12*(1-cos(angle))))
  w.append({'head':1.})
for j in range(rows):
 for k in range(count):
  a=j*count+k;bb=j*count+(k+1)%count
  fa.append((a,bb,bb+count,a+count))
weighted_mesh("Linen_headwrap_cap_temporary",v,fa,w,shade)
# Removed floating apron/shabby dark surface — do not keep broken materials
# simply because an object was authored. A replacement requires real patterning.
# 2 authentic skeletal animation actions, no magic rotation of mesh groups.
base={'spine_03':(0,0,0),'spine_02':(0,0,0),'head':(0,0,0),
      'upperarm_r':(0,0,0),'lowerarm_r':(0,0,0),
      'upperarm_l':(0,0,0),'lowerarm_l':(0,0,0)}
def action(name,samples):
 rig.animation_data_create()
 rig.animation_data.action=None
 action=bpy.data.actions.new(name)
 rig.animation_data.action=action
 for frame,values in samples:
  for bone,rotation in values.items():
   pb=rig.pose.bones[bone]
   pb.rotation_mode='XYZ'
   pb.rotation_euler=rotation
   pb.keyframe_insert(data_path='rotation_euler',frame=frame)
 rig.animation_data.action=None
 track=rig.animation_data.nla_tracks.new();track.name=name
 strip=track.strips.new(name,1,action)
 strip.action_frame_start=samples[0][0]
 strip.action_frame_end=samples[-1][0]
 return action
idle=action("Mother_QuietIdle",[
 (1,base),
 (36,{**base,'spine_03':(.02,0,.005),'head':(-.025,0,.008)}),
 (72,{**base,'spine_03':(-.012,0,-.004),'head':(.018,-.005,.006)}),
 (108,{**base,'spine_03':(.013,0,.004),'head':(-.016,0,.002)}),
 (144,base)])
gesture=action("Mother_GestureTowardsBasket",[
 (1,base),
 (20,{**base,'upperarm_r':(-.22,-.06,.20),'lowerarm_r':(-.22,0,.12),'head':(-.036,0,-.10)}),
 (48,{**base,'upperarm_r':(-.61,-.11,.37),'lowerarm_r':(-.35,0,.18),'head':(-.07,0,-.10),'spine_03':(.028,0,-.018)}),
 (70,{**base,'upperarm_r':(-.61,-.11,.37),'lowerarm_r':(-.35,0,.18),'head':(-.07,0,-.10),'spine_03':(.028,0,-.018)}),
 (105,base)])
for pb in rig.pose.bones:
 pb.rotation_mode='XYZ'
 pb.rotation_euler=(0,0,0)
bpy.context.scene.frame_start=1
bpy.context.scene.frame_end=144
bpy.context.scene.render.fps=24
bpy.ops.file.pack_all()
blend=os.path.join(SRC,'horeb_mother_rig_pilot.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend,check_existing=False)
bpy.ops.object.select_all(action='DESELECT')
rig.select_set(True);body.select_set(True)
for obj in bpy.data.objects:
 if obj.type=='MESH' and obj.parent==rig:obj.select_set(True)
bpy.context.view_layer.objects.active=rig
glb=os.path.join(OUT,'horeb_mother_rig_pilot.glb')
bpy.ops.export_scene.gltf(filepath=glb,export_format='GLB',
 use_selection=True,export_yup=True,export_animations=True,
 export_animation_mode='NLA_TRACKS',export_materials='EXPORT',export_apply=False)
assert os.stat(glb).st_size>10000
manifest={
 "name":"Mother performer - artistic illustration, not an attested appearance",
 "status":"ART_HOLD","source_mesh":"MakeHuman base geometry CC0; MPFB GPL authoring-only","gender_slider":.02,
 "rig_bones":len(rig.data.bones),"body_vertices":len(body.data.vertices),
 "animations":[idle.name,gesture.name],"garments":"original HOREB loosely fitted linen concept",
 "textures":"TEMP procedural only, not PBR/ART approved",
 "sha256":hashlib.sha256(open(glb,'rb').read()).hexdigest(),
 "bytes":os.stat(glb).st_size
}
with open(os.path.join(OUT,'horeb_mother_rig_pilot.asset.json'),'w',encoding='utf8') as fp:
 json.dump(manifest,fp,ensure_ascii=False,indent=2)
print('W18_MOTHER_GLTF_EXPORTED',glb,manifest['bytes'],manifest['sha256'])
print('W18_ACTOR_RIG',manifest['rig_bones'],'ANIMATIONS',manifest['animations'])
print('W18_SOURCE_BLEND',blend,os.stat(blend).st_size)
