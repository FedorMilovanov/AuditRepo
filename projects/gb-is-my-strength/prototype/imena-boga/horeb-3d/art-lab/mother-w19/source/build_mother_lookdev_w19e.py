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
# Original HOREB linen surface tuned using independently MD5-verified
# Poly Haven rough_linen CC0 normal/roughness maps, NOT modern blue diffuse.
def woven_linen_material(name,albedo):
 m=mat(name,albedo,.96)
 tree=m.node_tree
 nodes=tree.nodes;links=tree.links
 bs=nodes.get("Principled BSDF")
 texbase=os.path.join(ROOT,"source","cloth-textures")
 normal_path=os.path.join(texbase,"rough_linen_nor_gl_1k.jpg")
 rough_path=os.path.join(texbase,"rough_linen_rough_1k.jpg")
 assert os.path.isfile(normal_path) and os.path.isfile(rough_path)
 t=nodes.new("ShaderNodeTexImage")
 t.name="VerifiedCC0RoughLinenNormal"
 t.image=bpy.data.images.load(normal_path,check_existing=True)
 t.image.colorspace_settings.name="Non-Color"
 t.interpolation="Linear"
 normal=nodes.new("ShaderNodeNormalMap")
 normal.inputs["Strength"].default_value=.29
 links.new(t.outputs["Color"],normal.inputs["Color"])
 links.new(normal.outputs["Normal"],bs.inputs["Normal"])
 r=nodes.new("ShaderNodeTexImage")
 r.name="VerifiedCC0RoughLinenRoughness"
 r.image=bpy.data.images.load(rough_path,check_existing=True)
 r.image.colorspace_settings.name="Non-Color"
 links.new(r.outputs["Color"],bs.inputs["Roughness"])
 return m
# W19: verified CC0 MakeHuman system assets from original official archive.
PACK=os.environ.get("HOREB_MAKEHUMAN_PACK",os.path.join(ROOT,"source","makehuman_system_assets"))
skin_mhmat=os.path.join(PACK,"skins","young_caucasian_female","young_caucasian_female.mhmat")
assert os.path.isfile(skin_mhmat),("W19 CC0 skin missing",skin_mhmat)
HumanService.set_character_skin(skin_mhmat,body,skin_type="GAMEENGINE")
assert body.data.materials and any(node.type=="TEX_IMAGE" for m in body.data.materials if m.use_nodes for node in m.node_tree.nodes),"W19 skin texture must be a real image"
w19_assets=[]
for kind,rel in [
 ("Eyes","eyes/low-poly/low-poly.mhclo"),
 ("Eyebrows","eyebrows/eyebrow001/eyebrow001.mhclo"),
 ("Eyelashes","eyelashes/eyelashes01/eyelashes01.mhclo"),
]:
 file=os.path.join(PACK,*rel.split("/"))
 assert os.path.isfile(file),file
 item=HumanService.add_mhclo_asset(file,body,asset_type=kind,subdiv_levels=0,material_type="GAMEENGINE")
 assert item and item.type=="MESH",(kind,item)
 item.name="W19_CC0_"+kind
 w19_assets.append(item)
 print("W19B_REAL_BODY_ASSET",kind,item.name,len(item.data.vertices),
       [mod.type for mod in item.modifiers])

linen=woven_linen_material("Original_W19E_WovenLinen_CC0_Normal",(.64,.55,.45))
shade=woven_linen_material("Original_W19E_ShadedLinen_CC0_Normal",(.55,.47,.36))
trim=woven_linen_material("Original_W19E_Hem_CC0_Normal",(.47,.38,.28))
# Construct author materials AFTER MPFB assets; service removes unlinked material datablocks.
# Cloth panels are weighted to the actual pelvic, spine and arm bones.
def weighted_mesh(name,verts,faces,weights,material,rig=rig):
 mesh=bpy.data.meshes.new(name+"_mesh")
 mesh.from_pydata(verts,[],faces);mesh.update()
 # Author actual UVs for clothing, rather than relying on glTF generated
 # coordinates (which can change mapping across export).
 uv=mesh.uv_layers.new(name="W19E_WovenTextileUV")
 for poly in mesh.polygons:
  for li in poly.loop_indices:
   v=mesh.vertices[mesh.loops[li].vertex_index].co
   uv.data[li].uv=(v.x*4.0+v.y*1.1+3.0,v.z*4.8+v.y*.7)
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
# The previous W18 cloth cap was a geometric floating object. W19 removes it
# instead of retaining false 'historical' realism. Hair from official CC0 pack.
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
# W19C: the MakeHuman base mesh has invisible HELPER geometry. glTF will NOT
# export Blender's viewport-only MASK modifier. Bake it into the exported mesh;
# preserve the rebuildable source script as the authoritative editable origin.
helper_masks=[m for m in body.modifiers if m.type=='MASK']
assert len(helper_masks)==1,('Expected one MakeHuman helper mask',len(helper_masks))
prior_vertices=len(body.data.vertices)
bpy.ops.object.select_all(action='DESELECT')
body.select_set(True)
bpy.context.view_layer.objects.active=body
# Save full EDITABLE authoring scene before producing reduced export mesh.
bpy.ops.file.pack_all()
blend=os.path.join(SRC,'horeb_mother_lookdev_w19e.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend,check_existing=False)
# Blender 4.5 cannot apply a MASK on a mesh with shape keys. The .blend keeps
# original shape keys, while the W19C runtime export uses a helper-free copy.
if body.data.shape_keys is not None:
 bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
mask=next(m for m in body.modifiers if m.type=='MASK')
while body.modifiers.find(mask.name)>0:
 bpy.ops.object.modifier_move_up(modifier=mask.name)
bpy.ops.object.modifier_apply(modifier=mask.name)
print('W19C_BAKED_MAKEHUMAN_HELPERS',prior_vertices,len(body.data.vertices))
assert len(body.data.vertices)<prior_vertices-250,'Helper geometry was not removed; ART HOLD'
assert any(m.type=='ARMATURE' for m in body.modifiers),'Skinned rig lost during mask bake'
bpy.ops.object.select_all(action='DESELECT')
rig.select_set(True);body.select_set(True)
for obj in bpy.data.objects:
 if obj.type=='MESH' and obj.parent==rig:obj.select_set(True)
for obj in w19_assets:
 obj.select_set(True)
bpy.context.view_layer.objects.active=rig
glb=os.path.join(OUT,'horeb_mother_lookdev_w19e.glb')
bpy.ops.export_scene.gltf(filepath=glb,export_format='GLB',
 use_selection=True,export_yup=True,export_animations=True,
 export_animation_mode='NLA_TRACKS',export_materials='EXPORT',export_apply=False)
assert os.stat(glb).st_size>10000
manifest={
 "name":"Mother performer - artistic illustration, not an attested appearance",
 "status":"ART_HOLD","source_mesh":"MakeHuman anatomical UV skin CC0; MPFB GPL3 is offline authoring software","gender_slider":.02,
 "rig_bones":len(rig.data.bones),"body_vertices":len(body.data.vertices), "helper_vertices_removed":prior_vertices-len(body.data.vertices),
 "animations":[idle.name,gesture.name],"garments":"original HOREB linen geometry with CC0 normal/roughness UV",
 "textures":"MakeHuman CC0 diffuse skin, eyes/eyebrows/eyelashes; Poly Haven rough_linen CC0 normal+roughness, NOT premium approved",
 "sha256":hashlib.sha256(open(glb,'rb').read()).hexdigest(),
 "bytes":os.stat(glb).st_size
}
with open(os.path.join(OUT,'horeb_mother_lookdev_w19e.asset.json'),'w',encoding='utf8') as fp:
 json.dump(manifest,fp,ensure_ascii=False,indent=2)
print('W19_MOTHER_GLTF_EXPORTED',glb,manifest['bytes'],manifest['sha256'])
print('W19_ACTOR_RIG',manifest['rig_bones'],'ANIMATIONS',manifest['animations'])
print('W19_SOURCE_BLEND',blend,os.stat(blend).st_size)
