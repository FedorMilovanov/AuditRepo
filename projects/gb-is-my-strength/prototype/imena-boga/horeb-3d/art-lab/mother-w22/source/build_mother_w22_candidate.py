"""W22 standalone rigged lookdev candidate. ART HOLD, not historical likeness.
Reads W19H editable .blend, never modifies W19H, builds original sewn linen
and bakes an actual two-bone IK hand gesture into a new GLB/NLA action.
"""
from pathlib import Path
import bpy, math, hashlib, json
from mathutils import Vector, Quaternion
ROOT=Path(__file__).resolve().parents[3]
SOURCE=ROOT/'art-lab/mother-w19/source/horeb_mother_lookdev_w19h.blend'
OUT=ROOT/'art-lab/mother-w22/source'
ASSET=ROOT/'public/artlab/horeb_mother_w22_candidate.glb'
source_sha=hashlib.sha256(SOURCE.read_bytes()).hexdigest()
assert source_sha=='1286f8d50129d7e37110fe9abaee600e60ca235504af1d8144e4a2a6445537c9'
bpy.ops.wm.open_mainfile(filepath=str(SOURCE),load_ui=False)
rig=bpy.data.objects['MOTHER_PERFORMER__53_BONE_RIG']
body=bpy.data.objects['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0']
assert len(rig.data.bones)==53 and len(body.data.vertices)==19158
scene=bpy.context.scene
cloth=bpy.data.materials['Original_W19H_WovenLinen_CC0_Normal']
shade=bpy.data.materials['Original_W19H_ShadedLinen_CC0_Normal']
hem=bpy.data.materials['Original_W19H_Hem_CC0_Normal']
for m,color in [(cloth,(.37,.27,.175,1)),(shade,(.33,.24,.155,1)),(hem,(.265,.19,.115,1))]:
 m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=color
skin=bpy.data.materials['W19H_CC0_Adapted_Skin_PBR']
bs=skin.node_tree.nodes['Principled BSDF']
bs.inputs['Roughness'].default_value=.72
if 'Subsurface Weight' in bs.inputs: bs.inputs['Subsurface Weight'].default_value=.035
tunic=bpy.data.objects['Tunic_orig_hand_draped']
for v in tunic.data.vertices:
 z=v.co.z
 sx=.84+.065*max(0,(z-1.05)/.28)+.09*max(0,(.52-z)/.38)
 sx*=1-.17*min(1,max(0,(z-1.05)/.22))
 v.co.x*=sx
 v.co.y*=.92
 if z<.60:v.co.z+=.005*math.sin(17*math.atan2(v.co.y,v.co.x)+z*7)
for side in ('l','r'):
 o=bpy.data.objects['Linen_sleeve_'+side]
 u=rig.data.bones['upperarm_'+side]
 f=rig.data.bones['lowerarm_'+side]
 start=u.head_local.copy();end=u.tail_local.lerp(f.tail_local,.33)
 for i,v in enumerate(o.data.vertices):
  t=(i//28)/14
  centre=start.lerp(end,t)
  v.co=centre+(v.co-centre)*(.70+.10*t)
for v in bpy.data.objects['Stitched_lower_hem'].data.vertices:
 v.co.x*=.925;v.co.y*=.92

def skinned(name,verts,faces,weights,mat):
 mesh=bpy.data.meshes.new(name+'_geo')
 mesh.from_pydata(verts,[],faces);mesh.update()
 uv=mesh.uv_layers.new(name='W22_LinenUV')
 for poly in mesh.polygons:
  for li in poly.loop_indices:
   co=mesh.vertices[mesh.loops[li].vertex_index].co
   uv.data[li].uv=(co.x*7+co.y*3+3,co.z*7)
 obj=bpy.data.objects.new(name,mesh)
 bpy.context.collection.objects.link(obj)
 obj.parent=rig;obj.data.materials.append(mat)
 groups={}
 for w in weights:
  for bone in w:
   if bone not in groups:groups[bone]=obj.vertex_groups.new(name=bone)
 for i,w in enumerate(weights):
  assert sum(w.values())>.99
  for bone,weight in w.items():groups[bone].add([i],weight/sum(w.values()),'REPLACE')
 modifier=obj.modifiers.new('Original_W22_skinning','ARMATURE')
 modifier.object=rig
 for poly in mesh.polygons:poly.use_smooth=True
 return obj

# Belt is a woven, narrow linen sash: no metal parts or modern decoration.
N=64;verts=[];faces=[];weights=[]
for j,z in enumerate([.856,.876,.896]):
 for k in range(N):
  a=2*math.pi*k/N
  rr=1+.022*math.sin(11*a)+.016*math.cos(19*a)
  verts.append(( .269*rr*math.cos(a),.218*rr*math.sin(a)-.012,z+.005*math.sin(3*a)))
  weights.append({'pelvis':1})
for j in range(2):
 for k in range(N):faces.append((j*N+k,j*N+(k+1)%N,(j+1)*N+(k+1)%N,(j+1)*N+k))
skinned('W22_hand_woven_waist_tie',verts,faces,weights,hem)
# Plain head linen, interpretive art, NOT an attested Exodus-era likeness.
verts=[];faces=[];weights=[];N=48;R=12
for j in range(R+1):
 t=.035+(math.pi/2-.035)*j/R
 for k in range(N):
  a=2*math.pi*k/N
  front=max(0,-math.sin(a))
  verts.append((.101*math.sin(t)*math.cos(a),
                -.026+.107*math.sin(t)*math.sin(a),
                1.414+.142*math.cos(t)+.073*front*math.sin(t)**2))
  weights.append({'head':1})
for j in range(R):
 for k in range(N):faces.append((j*N+k,j*N+(k+1)%N,(j+1)*N+(k+1)%N,(j+1)*N+k))
skinned('W22_plain_linen_head_cover',verts,faces,weights,shade)
verts=[];faces=[];weights=[];cols=25;rows=12
for j in range(rows+1):
 t=j/rows
 for k in range(cols):
  x=2*k/(cols-1)-1
  verts.append((.110*x*(1+.11*t),
                .073+.064*t+.012*math.cos(math.pi*x),
                1.41-.245*t+.025*(1-x*x)*t))
  weights.append({'head':1-t*.7,'neck_01':t*.7})
for j in range(rows):
 for k in range(cols-1):faces.append((j*cols+k,j*cols+k+1,(j+1)*cols+k+1,(j+1)*cols+k))
skinned('W22_linen_rear_drape',verts,faces,weights,cloth)

# Real two-bone IK to world rim when staged at Three actor offset (-0.5,.015,.3).
# World basket rim edge (-.15,1.159,.26) maps to Blender rig (.35,.04,1.144).
tracks=rig.animation_data.nla_tracks
assert set(t.name for t in tracks)=={'Mother_QuietIdle','Mother_GestureTowardsBasket'}
old=tracks.get('Mother_GestureTowardsBasket')
tracks.remove(old)
for t in tracks:t.mute=True
rig.animation_data.action=None
for bone in rig.pose.bones:
 bone.rotation_mode='XYZ'
 bone.rotation_euler=(0,0,0)
scene.frame_set(1)
fore=rig.pose.bones['lowerarm_l']
upper=rig.pose.bones['upperarm_l']
start=fore.tail.copy()
contact=Vector((.35,.04,1.144))
target=bpy.data.objects.new('W22_Contact_IK_Temporary',None)
bpy.context.collection.objects.link(target);target.location=contact
ik=fore.constraints.new('IK');ik.target=target;ik.chain_count=2;ik.use_stretch=False
samples=[]
for frame,pct in [(1,0),(20,.36),(48,1),(70,1),(105,0)]:
 target.location=start.lerp(contact,pct)
 scene.frame_set(frame)
 bpy.context.view_layer.update()
 qs={}
 for bone in [upper,fore]:
  local=rig.convert_space(pose_bone=bone,matrix=bone.matrix.copy(),from_space='POSE',to_space='LOCAL')
  qs[bone.name]=Quaternion((1,0,0,0)) if pct==0 else local.to_quaternion()
 if frame==48:assert (fore.tail-contact).length<.015, (fore.tail,contact)
 samples.append((frame,pct,qs))
fore.constraints.remove(ik)
bpy.data.objects.remove(target,do_unlink=True)
prior=bpy.data.actions.get('Mother_GestureTowardsBasket')
if prior:prior.name='W19H_ReferenceAction_NotExported'
action=bpy.data.actions.new('Mother_GestureTowardsBasket')
rig.animation_data.action=action
for frame,pct,quats in samples:
 scene.frame_set(frame)
 for bone in [upper,fore]:
  bone.rotation_mode='QUATERNION'
  bone.rotation_quaternion=quats[bone.name]
  bone.keyframe_insert(data_path='rotation_quaternion',frame=frame)
 for name,euler in [('head',(-.08*pct,0,.03*pct)),
                    ('spine_03',(.024*pct,0,-.016*pct))]:
  bone=rig.pose.bones[name];bone.rotation_mode='XYZ'
  bone.rotation_euler=euler
  bone.keyframe_insert(data_path='rotation_euler',frame=frame)
rig.animation_data.action=None
track=tracks.new();track.name='Mother_GestureTowardsBasket'
strip=track.strips.new('Mother_GestureTowardsBasket',1,action)
strip.action_frame_start=1;strip.action_frame_end=105
for t in tracks:t.mute=False
scene.frame_set(60)
bpy.context.view_layer.update()
actual=fore.tail.copy()
print('W22_IK_CONTACT_POSE',tuple(round(v,4) for v in actual),
      'distance',round((actual-contact).length,5),flush=True)
assert (actual-contact).length<.025,'Baked action lost contact'
# Return to a neutral saved pose: NLA still exports both independent tracks.
scene.frame_set(1)
for bone in (upper,fore):
 bone.rotation_mode='QUATERNION'
 bone.rotation_quaternion=Quaternion((1,0,0,0))
for bone_name in ('head','spine_03'):
 rig.pose.bones[bone_name].rotation_euler=(0,0,0)
bpy.context.view_layer.update()
# Source preserves original anatomical mesh and shape keys, rig and cloth UVs.
OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.file.pack_all()
bpy.context.preferences.filepaths.save_version=0
blend=OUT/'horeb_mother_w22_candidate.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(blend),check_existing=False)
bpy.ops.object.select_all(action='DESELECT')
body.select_set(True);bpy.context.view_layer.objects.active=body
if body.data.shape_keys is not None:bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
masks=[m for m in body.modifiers if m.type=='MASK']
assert len(masks)==1
while body.modifiers.find(masks[0].name)>0:
 bpy.ops.object.modifier_move_up(modifier=masks[0].name)
bpy.ops.object.modifier_apply(modifier=masks[0].name)
assert len(body.data.vertices)<18900
bpy.ops.object.select_all(action='DESELECT')
rig.select_set(True);body.select_set(True)
for obj in bpy.data.objects:
 if obj.type=='MESH' and obj.parent==rig:obj.select_set(True)
bpy.context.view_layer.objects.active=rig
ASSET.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(ASSET),export_format='GLB',
 use_selection=True,export_yup=True,export_animations=True,
 export_animation_mode='NLA_TRACKS',export_materials='EXPORT',export_apply=False)
assert ASSET.stat().st_size>2000000
manifest={
 'status':'ART_HOLD_W22_EARLY_CANDIDATE',
 'source_w19h_sha256':source_sha,
 'blender_source_sha256':hashlib.sha256(blend.read_bytes()).hexdigest(),
 'blender_bytes':blend.stat().st_size,
 'glb_sha256':hashlib.sha256(ASSET.read_bytes()).hexdigest(),
 'glb_bytes':ASSET.stat().st_size,
 'bones':len(rig.data.bones),'clips':['Mother_QuietIdle','Mother_GestureTowardsBasket'],
 'staged_actor_offset_three':[-.50,.015,.30],
 'contact_target_world_three':[-.15,1.159,.26],
 'contact_target_local_blender':[.35,.04,1.144],
 'limitations':'ART HOLD; independent spatial and browser visual review; not an attested likeness; DO NOT integrate W15'}
(OUT/'horeb_mother_w22_candidate.manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf8')
print('W22_CANDIDATE_EXPORTED_ART_HOLD',json.dumps(manifest),flush=True)
