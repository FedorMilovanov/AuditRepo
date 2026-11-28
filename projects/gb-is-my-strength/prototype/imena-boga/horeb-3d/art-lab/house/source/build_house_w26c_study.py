"""W26c: original packed material maps, from the verified W26b study."""
import bpy, numpy as np, json, os, hashlib
from pathlib import Path
from mathutils import Vector
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
src=Path(os.environ["HOREB_W26B_INPUT"])
out=Path(os.environ["HOREB_W26C_OUTPUT"])
m=json.loads((src/"w26-study-manifest.json").read_text(encoding="utf8"))
assert m["glb_sha256"]=="f1149204b64e8d92c5cdaec4290121792d50f615e0aeb37f5136dc5d1e21fac2"
assert sha(src/"w26b-house-study.blend")==m["blend_sha256"]
assert sha(src/m["glb_file"])==m["glb_sha256"]
assert not out.exists();out.mkdir(parents=True)
bpy.ops.wm.open_mainfile(filepath=str(src/"w26b-house-study.blend"),load_ui=False)
N=512
u,v=np.meshgrid(np.arange(N,dtype=np.float32)/N,np.arange(N,dtype=np.float32)/N)
t=2*np.pi
def wave(a,b):return np.sin(t*(a*u+b*v))
wood=.51+.19*np.sin(t*18*v+.8*wave(2,1))+.065*wave(4,31)+.03*wave(11,87)
reed=.55+.14*wave(0,27)+.06*wave(3,63)+.025*wave(7,111)
linen=.5+.13*wave(45,0)*wave(0,45)+.085*(wave(45,0)+wave(0,45))
maps=[]
def image(name,data,cs):
 im=bpy.data.images.new(name,width=N,height=N,alpha=False)
 im.colorspace_settings.name=cs
 rgba=np.ones((N,N,4),dtype=np.float32);rgba[:,:,:3]=np.clip(data,0,1)
 im.pixels.foreach_set(rgba.ravel());im.update()
 im.filepath_raw=str(out/(name+".png"));im.file_format="PNG";im.save();im.pack()
 maps.append({"name":name,"sha256":sha(Path(im.filepath_raw))})
 return im
specs=[
 ("Aged_wood_rays",wood,(.085,.048,.022),(.38,.22,.105),.88),
 ("Sun_bleached_reed",reed,(.22,.135,.052),(.57,.40,.19),.85),
 ("Papyrus_wicker_warm",reed,(.27,.165,.065),(.67,.49,.25),.83),
 ("Handwoven_linen",linen,(.39,.33,.24),(.72,.65,.49),.94),
 ("Linen_hazy_shadow",linen,(.27,.23,.17),(.57,.50,.37),.94)]
for name,h,dark,light,rough in specs:
 mat=bpy.data.materials[name];n=mat.node_tree.nodes;l=mat.node_tree.links;bs=n.get("Principled BSDF")
 for socket in ("Base Color","Normal","Roughness"):
  for link in list(bs.inputs[socket].links):l.remove(link)
 tex=n.new("ShaderNodeTexImage")
 tex.image=image("W26c_"+name+"_color",np.array(dark)+(np.array(light)-np.array(dark))*h[:,:,None],"sRGB")
 normal=np.stack((-(np.roll(h,-1,1)-np.roll(h,1,1))*1.5,-(np.roll(h,-1,0)-np.roll(h,1,0))*1.5,np.ones_like(h)),axis=-1)
 normal/=np.linalg.norm(normal,axis=-1,keepdims=True)
 nt=n.new("ShaderNodeTexImage");nt.image=image("W26c_"+name+"_normal",normal*.5+.5,"Non-Color")
 nm=n.new("ShaderNodeNormalMap");nm.inputs["Strength"].default_value=.65
 l.new(tex.outputs["Color"],bs.inputs["Base Color"]);l.new(nt.outputs["Color"],nm.inputs["Color"]);l.new(nm.outputs["Normal"],bs.inputs["Normal"])
 bs.inputs["Roughness"].default_value=rough
target={s[0] for s in specs};rebuilt=[]
for o in bpy.context.scene.objects:
 if o.type!="MESH" or not any(a and a.name in target for a in o.data.materials):continue
 uv=o.data.uv_layers.active
 if uv and len(uv.data):
  xs=[l.uv.x for l in uv.data];ys=[l.uv.y for l in uv.data]
  if max(xs)-min(xs)>1e-5 and max(ys)-min(ys)>1e-5:continue
 if not uv:uv=o.data.uv_layers.new(name="UVMap")
 rebuilt.append(o.name);coords=[v.co for v in o.data.vertices]
 ext=[max(v[i] for v in coords)-min(v[i] for v in coords) for i in range(3)]
 for poly in o.data.polygons:
  axes=sorted(range(3),key=lambda i:abs(poly.normal[i]))[:2]
  a,b=sorted(axes,key=lambda i:ext[i],reverse=True)
  for li in poly.loop_indices:
   v=coords[o.data.loops[li].vertex_index]
   uv.data[li].uv=(v[a]*2,v[b]*3)
scene=bpy.context.scene;scene.view_settings.exposure=.25;scene.cycles.device="CPU";scene.cycles.samples=24
rim=bpy.data.objects["Basket_thick_lipped_rim"]
assert hashlib.sha256(repr([(round(v.co.x,6),round(v.co.y,6),round(v.co.z,6)) for v in rim.data.vertices]).encode()).hexdigest()==m["rim_vertex_hash"]
root=bpy.data.objects["HOREB_HOUSE_01__RECONSTRUCTION_NOT_ATTESTED"]
bpy.context.preferences.filepaths.save_version=0;bpy.ops.file.pack_all()
blend=out/"w26c-house-study.blend";bpy.ops.wm.save_as_mainfile(filepath=str(blend),check_existing=False)
bpy.ops.object.select_all(action="DESELECT")
for o in scene.objects:o.select_set(o.type in ("MESH","EMPTY"))
bpy.context.view_layer.objects.active=root
glb=out/"w26c-house-study.glb"
bpy.ops.export_scene.gltf(filepath=str(glb),export_format="GLB",export_yup=True,export_apply=True,export_animations=False,use_selection=True,export_materials="EXPORT")
record={"status":"ART_HOLD_W26_HOUSE_STUDY","revision":"W26c","baseline_glb_sha256":m["glb_sha256"],"blend_sha256":sha(blend),"glb_sha256":sha(glb),"glb_file":glb.name,"bytes":glb.stat().st_size,"rim_vertex_hash":m["rim_vertex_hash"],"maps":maps,"uv_rebuilt":rebuilt,"license":"Original analytical textures and existing CC0 textures"}
(out/"w26-study-manifest.json").write_text(json.dumps(record,indent=2),encoding="utf8")
print("W26C_EXPORT",record["glb_sha256"],record["bytes"],"maps",len(maps),"uv",len(rebuilt),flush=True)
cam=scene.camera
for name,eye,target,lens in [("room",(-1.35,-1.65,1.69),(.7,.55,1.05),29),("basket",(1.16,-1.10,1.65),(.35,-.26,1.05),47)]:
 cam.location=eye;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat("-Z","Y").to_euler();cam.data.lens=lens
 scene.render.filepath=str(out/("w26c-"+name+".png"));bpy.ops.render.render(write_still=True);print("W26C_RENDER "+name,flush=True)
