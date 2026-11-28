"""W24 wardrobe/skin geometry study; never overwrite W22."""
from pathlib import Path
import bpy, math, hashlib, json, os
import numpy as np
from mathutils import Vector
P=Path(__file__).resolve().parents[3]
OUT=Path(os.environ.get("HOREB_W24_ART_OUTPUT",str(P/".test-build/w24-wardrobe-study"))).resolve()
SRC=P/"art-lab/mother-w22/source/horeb_mother_w22_candidate.blend"
manifest=json.loads((SRC.parent/"horeb_mother_w22_candidate.manifest.json").read_text(encoding="utf8"))
source_sha=hashlib.sha256(SRC.read_bytes()).hexdigest()
assert source_sha==manifest["blender_source_sha256"]
assert source_sha=="e752aa619c5f7d4fcff00efe44d53a6ecfb265a9c23db64d5534af39bf4451eb", "W24 study is based on exact W22 source"
assert not OUT.exists(), "Choose a new output directory; never overwrite evidence"
OUT.mkdir(parents=True)
bpy.ops.wm.open_mainfile(filepath=str(SRC),load_ui=False)
rig=bpy.data.objects["MOTHER_PERFORMER__53_BONE_RIG"]
body=bpy.data.objects["ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0"]
scene=bpy.context.scene
tracks=list(rig.animation_data.nla_tracks)
assert len(rig.data.bones)==53 and len(body.data.vertices)==19158
for t in tracks:t.mute=t.name!="Mother_QuietIdle"
scene.frame_set(1);bpy.context.view_layer.update()
tunic=bpy.data.objects["Tunic_orig_hand_draped"]
N=48;assert len(tunic.data.vertices)==528
for i,v in enumerate(tunic.data.vertices):
 z=float(v.co.z);a=2*math.pi*(i%N)/N
 waist=math.exp(-((z-.86)/.20)**2);skirt=math.exp(-((z-.39)/.28)**2)
 pleat=(.013+.018*skirt)*math.sin(7*a+2*z)+.008*math.sin(13*a-3*z)
 v.co.x*=1-.10*waist-.055*skirt+pleat
 v.co.y=(v.co.y+.012)*(1-.055*waist+pleat)-.012
# Interpolate the actual tunic skin weights and positions; belt stays outside.
rings=[list(tunic.data.vertices[j*N:(j+1)*N]) for j in range(11)]
ringZ=[sum(v.co.z for v in vs)/N for vs in rings]
def sample(a,z):
 j=next((i for i in range(10) if ringZ[i]<=z<=ringZ[i+1]),0 if z<ringZ[0] else 9)
 t=max(0,min(1,(z-ringZ[j])/(ringZ[j+1]-ringZ[j])))
 k=(a%(2*math.pi))/(2*math.pi)*N;k0=int(k)%N;k1=(k0+1)%N;u=k-int(k)
 v0,v1,v2,v3=rings[j][k0],rings[j][k1],rings[j+1][k0],rings[j+1][k1]
 pos=v0.co.lerp(v1.co,u).lerp(v2.co.lerp(v3.co,u),t)
 w={}
 for v,b in ((v0,(1-t)*(1-u)),(v1,(1-t)*u),(v2,t*(1-u)),(v3,t*u)):
  for g in v.groups:
   n=tunic.vertex_groups[g.group].name;w[n]=w.get(n,0)+b*g.weight
 return pos,w
belt=bpy.data.objects["W22_hand_woven_waist_tie"]
for i,v in enumerate(belt.data.vertices):
 a=2*math.pi*(i%64)/64;z=.852+.020*(i//64)+.004*math.sin(a*3)
 pos,w=sample(a,z)
 v.co=pos+Vector((math.cos(a),math.sin(a),0))*.011;v.co.z=z
 old_indices=[g.group for g in v.groups]
 for g in old_indices:belt.vertex_groups[g].remove([i])
 for n,weight in w.items():
  if weight<.00001:continue
  group=belt.vertex_groups.get(n) or belt.vertex_groups.new(name=n)
  group.add([i],weight/sum(w.values()),'REPLACE')
hem=bpy.data.objects["Stitched_lower_hem"]
for i,v in enumerate(hem.data.vertices):
 a=2*math.pi*(i%64)/64;z=.155+.017*(i//64)
 pos,w=sample(a,z);v.co=pos+Vector((math.cos(a),math.sin(a),0))*.006;v.co.z=z
hood=bpy.data.objects["W22_plain_linen_head_cover"]
for i,v in enumerate(hood.data.vertices):
 t=(i//48)/12;a=2*math.pi*(i%48)/48
 radial=Vector((v.co.x,v.co.y+.026,0))
 if radial.length>.0001:
  v.co+=radial.normalized()*(.0018*math.sin(5*a+2*t)+.0012*math.sin(9*a-2*t))*t*t
 v.co.z+=.006*math.sin(4*a+.4)*t*t
drape=bpy.data.objects["W22_linen_rear_drape"]
for i,v in enumerate(drape.data.vertices):
 t=(i//25)/12;x=2*(i%25)/24-1
 v.co.y+=t*(.008*math.cos(3*math.pi*x)+.003*math.sin(7*math.pi*x))
 v.co.z+=.008*math.cos(2*math.pi*x)*t*t
# Bake a local experimental derivative of the existing CC0 image.
skin=bpy.data.materials["W19H_CC0_Adapted_Skin_PBR"]
bs=skin.node_tree.nodes["Principled BSDF"]
node=next(n for n in skin.node_tree.nodes if n.type=="TEX_IMAGE")
src=node.image
pixels=np.empty(len(src.pixels),dtype=np.float32)
src.pixels.foreach_get(pixels);pixels=pixels.reshape(-1,4)
pixels[:,:3]*=np.array([.76,.59,.47],dtype=np.float32)
np.clip(pixels,0,1,out=pixels)
img=bpy.data.images.new("W24_tonal_derivative_CC0",width=src.size[0],height=src.size[1],alpha=True)
img.colorspace_settings.name=src.colorspace_settings.name
img.pixels.foreach_set(pixels.ravel())
img.filepath_raw=str(OUT/"w24-skin-tone-cc0-study.png");img.file_format="PNG";img.save();img.pack()
node.image=img;bs.inputs["Roughness"].default_value=.68
for name,color in [
 ("Original_W19H_WovenLinen_CC0_Normal",(.245,.188,.126,1)),
 ("Original_W19H_ShadedLinen_CC0_Normal",(.207,.153,.098,1)),
 ("Original_W19H_Hem_CC0_Normal",(.132,.088,.052,1))]:
 m=bpy.data.materials[name];m.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value=color
 for n in m.node_tree.nodes:
  if n.type=="NORMAL_MAP":n.inputs["Strength"].default_value=.55
# Native geometric acceptance across both actual NLA clips.
from mathutils.bvhtree import BVHTree
def evaluated_geometry(name):
 obj=bpy.data.objects[name].evaluated_get(bpy.context.evaluated_depsgraph_get())
 mesh=obj.to_mesh()
 try:
  return [obj.matrix_world@v.co for v in mesh.vertices],[tuple(p.vertices) for p in mesh.polygons]
 finally:
  obj.to_mesh_clear()
rows=[]
for clip,frames in [("Mother_QuietIdle",[1,25,60]),("Mother_GestureTowardsBasket",[1,20,48,60,70,105])]:
 for t in tracks:t.mute=t.name!=clip
 for frame in frames:
  scene.frame_set(frame);bpy.context.view_layer.update()
  v,f=evaluated_geometry("Tunic_orig_hand_draped");tree=BVHTree.FromPolygons(v,f)
  b,bf=evaluated_geometry("W22_hand_woven_waist_tie")
  intersections=len(tree.overlap(BVHTree.FromPolygons(b,bf)))
  nearest=[tree.find_nearest(p) for p in b]
  clearance=min(n[3] for n in nearest)
  assert intersections==0 and clearance>.003,(clip,frame,intersections,clearance)
  rows.append({"clip":clip,"frame":frame,"intersecting_face_pairs":intersections,"min_clearance_mm":round(clearance*1000,3)})
scene.frame_set(1);bpy.context.view_layer.update()
bpy.context.preferences.filepaths.save_version=0;bpy.ops.file.pack_all()
for t in tracks:t.mute=False
blend=OUT/"w24-wardrobe-study.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend),check_existing=False)
# Export from the saved editable file, keeping anatomy intact in the native source.
bpy.ops.object.select_all(action="DESELECT")
body.select_set(True);bpy.context.view_layer.objects.active=body
if body.data.shape_keys is not None:bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
masks=[m for m in body.modifiers if m.type=="MASK"]
assert len(masks)==1
while body.modifiers.find(masks[0].name)>0:bpy.ops.object.modifier_move_up(modifier=masks[0].name)
bpy.ops.object.modifier_apply(modifier=masks[0].name)
assert len(body.data.vertices)==13380
bpy.ops.object.select_all(action="DESELECT")
rig.select_set(True);body.select_set(True)
for obj in bpy.data.objects:
 if obj.type=="MESH" and obj.parent==rig:obj.select_set(True)
bpy.context.view_layer.objects.active=rig
glb=OUT/"w24-wardrobe-study.glb"
bpy.ops.export_scene.gltf(filepath=str(glb),export_format="GLB",use_selection=True,export_yup=True,export_animations=True,export_animation_mode="NLA_TRACKS",export_materials="EXPORT",export_apply=False)
assert glb.stat().st_size>2000000
data={"status":"ART_HOLD_LOCAL_W24_WARDROBE","baseline_sha256":source_sha,"blend_sha256":hashlib.sha256(blend.read_bytes()).hexdigest(),"glb_sha256":hashlib.sha256(glb.read_bytes()).hexdigest(),"glb_bytes":glb.stat().st_size,"bones":53,"clips":sorted(t.name for t in tracks),"belt_motion_audit":rows,"limits":"Not an approved historical likeness; no automatic W15 integration"}
(OUT/"w24-study-manifest.json").write_text(json.dumps(data,indent=2)+"\n",encoding="utf8")
print("W24_REPRODUCIBLE_STUDY_PASS "+json.dumps(data),flush=True)
