"""W26b: daylight and domestic detail, on an exact verified W26a study.
No asset admission. Blender 4.5, CPU Cycles.
"""
from pathlib import Path
from mathutils import Vector
import bpy, math, os, json, hashlib
from math import sin, cos, pi
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
SRC=Path(os.environ["HOREB_W26_INPUT"]).resolve()
OUT=Path(os.environ["HOREB_W26B_OUTPUT"]).resolve()
m=json.loads((SRC/"w26-study-manifest.json").read_text(encoding="utf8"))
base=SRC/"w26-house-study.blend";glb0=SRC/"w26-house-study.glb"
assert m["status"]=="ART_HOLD_W26_HOUSE_STUDY"
assert sha(base)==m["blend_sha256"] and sha(glb0)==m["glb_sha256"]
assert m["glb_sha256"]=="c546269099b2b5de3c4e831279222483f4827f07d6820e42706ca4001b95e4a9"
assert not OUT.exists()
OUT.mkdir(parents=True)
bpy.ops.wm.open_mainfile(filepath=str(base),load_ui=False)
scene=bpy.context.scene
root=bpy.data.objects["HOREB_HOUSE_01__RECONSTRUCTION_NOT_ATTESTED"]
def mat(name,color,rough):
 m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes["Principled BSDF"]
 p.inputs["Base Color"].default_value=(*color,1);p.inputs["Roughness"].default_value=rough
 return m
linen=bpy.data.materials["Handwoven_linen"]
linen_shadow=bpy.data.materials["Linen_hazy_shadow"]
wood=bpy.data.materials["Aged_wood_rays"]
straw=bpy.data.materials["Sun_bleached_reed"]
# A restrained folded cloth with continuous sculpted layers, replacing
# the white rectangular block adjacent to the basket. Keep tabletop clear.
old=bpy.data.objects["Folded_linen_by_basket"]
bpy.data.objects.remove(old,do_unlink=True)
def mesh(name,verts,faces,material,smooth=True):
 me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update()
 o=bpy.data.objects.new(name,me);scene.collection.objects.link(o);o.parent=root
 me.materials.append(material)
 for p in me.polygons:p.use_smooth=smooth
 return o
for layer in range(3):
 v=[];f=[];nx=21;ny=25
 # Left end of bench; basket ellipse starts at x=-.15 at rim.
 for j in range(ny):
  t=j/(ny-1)
  for i in range(nx):
   u=i/(nx-1)
   x=-.285+.185*u+.006*sin(t*pi*3+layer)
   y=-.52+.29*t+.006*cos(u*pi*3+layer)
   z=.849+layer*.012+.008*sin(u*pi)+.004*cos(t*pi*4+layer)+.008*(abs(2*u-1)**5)
   v.append((x,y,z))
 for j in range(ny-1):
  for i in range(nx-1):
   a=j*nx+i;f.append((a,a+1,a+nx+1,a+nx))
 cloth=mesh("W26b_folded_linen_layer_"+str(layer),v,f,linen if layer!=1 else linen_shadow)
 so=cloth.modifiers.new("Real fabric thickness","SOLIDIFY");so.thickness=.0024
# Shallow clay preparation bowl with rolled rim, not an invented attested artifact.
clay=mat("W26b_smoke_darkened_clay",(.23,.115,.062),.89)
def bowl(name,cx,cy,z,profile,material):
 v=[];f=[];n=64
 for h,r in profile:
  for k in range(n):
   a=2*pi*k/n
   rr=r*(1+.01*sin(3*a)+.005*cos(7*a))
   v.append((cx+rr*cos(a),cy+rr*sin(a),z+h))
 for i in range(len(profile)-1):
  for k in range(n):
   a=i*n+k;b=i*n+(k+1)%n;f.append((a,b,b+n,a+n))
 for level,sign in [(0,-1),(len(profile)-1,1)]:
  c=len(v);v.append((cx,cy,z+profile[level][0]))
  for k in range(n):
   face=(c,level*n+k,level*n+(k+1)%n);f.append(face if sign>0 else face[::-1])
 return mesh(name,v,f,material)
# Located on the low bench, not in the player approach or on basket.
bowl("W26b_small_clay_preparation_bowl",-1.52,.86,.598,[(0,.055),(.014,.079),(.045,.11),(.08,.13),(.092,.128),(.094,.118),(.08,.109),(.038,.079),(.019,.045)],clay)
# Roof blocks direct sunlight. A rectangular portal source at the open
# threshold approximates reflected daylight from the yard; no invisible
# unmotivated point source inside the room. World uses an explicit node.
world=scene.world
world.use_nodes=True
bg=world.node_tree.nodes.get("Background")
bg.inputs["Color"].default_value=(.74,.82,1,1)
bg.inputs["Strength"].default_value=.42
sun=bpy.data.objects["Morning_sun_original"];sun.data.energy=2.2
sun.data.angle=math.radians(7)
fill=bpy.data.objects["Warm_courtyard_fill"];fill.data.energy=260
def aim(o,target):o.rotation_euler=(Vector(target)-o.location).to_track_quat("-Z","Y").to_euler()
bpy.ops.object.light_add(type="AREA",location=(0,-2.22,1.84))
portal=bpy.context.object;portal.name="W26b_daylight_from_open_threshold";portal.data.shape="RECTANGLE"
portal.data.size=1.13;portal.data.size_y=1.85;portal.data.energy=180;portal.data.color=(1,.89,.72)
aim(portal,(.20,.8,1.02))
scene.render.engine="CYCLES";scene.cycles.device="CPU";scene.cycles.samples=24;scene.cycles.use_denoising=True
scene.render.resolution_x=1024;scene.render.resolution_y=640;scene.render.resolution_percentage=100
scene.view_settings.view_transform="AgX";scene.view_settings.exposure=.65
# Preserve original rim coordinates and topology; don't silently move grip target.
rim=bpy.data.objects["Basket_thick_lipped_rim"]
rim_hash=hashlib.sha256(repr([(round(v.co.x,6),round(v.co.y,6),round(v.co.z,6)) for v in rim.data.vertices]).encode()).hexdigest()
bpy.context.preferences.filepaths.save_version=0;bpy.ops.file.pack_all()
blend=OUT/"w26b-house-study.blend";bpy.ops.wm.save_as_mainfile(filepath=str(blend),check_existing=False)
bpy.ops.object.select_all(action="DESELECT")
for o in scene.objects:o.select_set(o.type in ("MESH","EMPTY"))
bpy.context.view_layer.objects.active=root
glb=OUT/"w26b-house-study.glb"
bpy.ops.export_scene.gltf(filepath=str(glb),export_format="GLB",export_yup=True,export_apply=True,export_animations=False,use_selection=True,export_materials="EXPORT")
record={"status":"ART_HOLD_W26_HOUSE_STUDY","revision":"W26b","baseline_glb_sha256":m["glb_sha256"],"baseline_blend_sha256":m["blend_sha256"],"blend_sha256":sha(blend),"glb_sha256":sha(glb),"glb_file":glb.name,"bytes":glb.stat().st_size,"rim_vertex_hash":rim_hash,"license":"Original geometry, existing CC0 textures; no new external assets","limitations":"Native portal light is not included in GLB. Viewer lighting separately evaluated. Not an attested house."}
(OUT/"w26-study-manifest.json").write_text(json.dumps(record,indent=2),encoding="utf8")
print("W26B_EXPORT "+json.dumps(record),flush=True)
cam=scene.camera
for name,eye,target,lens in [
 ("threshold",(0,-4.45,1.69),(.35,.2,1.32),30),
 ("room",(-1.35,-1.65,1.69),(.7,.55,1.05),29),
 ("basket",(1.16,-1.10,1.65),(.35,-.26,1.05),47)]:
 cam.location=eye;aim(cam,target);cam.data.lens=lens
 scene.render.filepath=str(OUT/("w26b-"+name+".png"));bpy.ops.render.render(write_still=True)
 print("W26B_RENDER "+name,flush=True)
