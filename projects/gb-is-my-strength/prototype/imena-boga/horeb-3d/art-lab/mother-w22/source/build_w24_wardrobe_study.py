"""W24 wardrobe/skin geometry study; never overwrite W22."""
from pathlib import Path
import bpy, math, hashlib, json, os
import numpy as np
from mathutils import Vector
P=Path(__file__).resolve().parents[3]
OUT=Path(os.environ["HOREB_W24_OUTPUT"]).resolve()
assert not OUT.exists(), "Use a new evidence directory"
OUT.mkdir(parents=True)
SRC=P/"art-lab/mother-w22/source/horeb_mother_w22_candidate.blend"
manifest=json.loads((SRC.parent/"horeb_mother_w22_candidate.manifest.json").read_text(encoding="utf8"))
assert hashlib.sha256(SRC.read_bytes()).hexdigest()==manifest["blender_source_sha256"]
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
scene.frame_set(1);bpy.context.view_layer.update()
bpy.context.preferences.filepaths.save_version=0;bpy.ops.file.pack_all()
for t in tracks:t.mute=False
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/"w24-wardrobe-study.blend"),check_existing=False)
# Exact same W22 Cycles CPU camera/light setup; independent comparison.
probe=(P/"tests/w22-blender-art-probe.py").read_text(encoding="utf8")
render=probe[probe.index('scene.render.engine = "CYCLES"'):probe.index("manifest = {",probe.index('scene.render.engine = "CYCLES"'))]
render=render.replace("w22-native-","w24-native-")
exec(render,globals())
print("W24_WARDROBE_LOCAL_REVIEW_READY",flush=True)
