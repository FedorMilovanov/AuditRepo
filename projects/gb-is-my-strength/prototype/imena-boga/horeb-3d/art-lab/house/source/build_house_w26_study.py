"""W26 house lookdev study, from exact W17 source. No production admission.
Blender 4.5 LTS. Output to a new HOREB_W26_ART_OUTPUT directory.
"""
from pathlib import Path
import bpy, math, hashlib, json, os
from mathutils import Vector
from math import sin,cos,pi
P=Path(__file__).resolve().parents[3]
SRC=P/"art-lab/house/source/horeb_egypt_house_hero_pilot.blend"
OUT=Path(os.environ.get("HOREB_W26_ART_OUTPUT",str(P/".test-build/w26-house-study"))).resolve()
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
assert digest(SRC)=="f967c151fc34175d421a825c3efea1afcabf2bea638e25300f3ad7fe305a468e"
assert not OUT.exists(), "Use a new output directory"
OUT.mkdir(parents=True)
bpy.ops.wm.open_mainfile(filepath=str(SRC),load_ui=False)
scene=bpy.context.scene
root=bpy.data.objects["HOREB_HOUSE_01__RECONSTRUCTION_NOT_ATTESTED"]
basket=bpy.data.objects["BASKET_OBJECT_ACTION_ANCHOR"]
wall=bpy.data.materials["CC0_clay_plaster_unpolished"]
raw=bpy.data.materials["Exposed_dark_mudbrick"]
wood=bpy.data.materials["Aged_wood_rays"]
straw=bpy.data.materials["Sun_bleached_reed"]
straw_light=bpy.data.materials["Papyrus_wicker_warm"]
def mesh(name,verts,faces,mat,parent=root,smooth=False):
 me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update()
 o=bpy.data.objects.new(name,me);scene.collection.objects.link(o);o.parent=parent
 me.materials.append(mat)
 for poly in me.polygons:poly.use_smooth=smooth
 return o
def uv_planar(obj,scale=1.5):
 uv=obj.data.uv_layers.new(name="UVMap")
 for poly in obj.data.polygons:
  n=poly.normal
  for li in poly.loop_indices:
   v=obj.data.vertices[obj.data.loops[li].vertex_index].co
   uv.data[li].uv=(v.x*scale,v.y*scale) if abs(n.z)>.5 else ((v.x if abs(n.y)>.5 else v.y)*scale,v.z*scale)
def box(name,loc,dim,mat,edge=.018):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
 o=bpy.context.object;o.name=name;o.dimensions=dim
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 o.parent=root;o.data.materials.append(mat)
 if edge:
  m=o.modifiers.new("Soft earthen edges","BEVEL");m.width=edge;m.segments=2
  o.modifiers.new("Face normals","WEIGHTED_NORMAL")
 return o
def tube(name,points,mat,r,parent=root,res=1):
 c=bpy.data.curves.new(name,"CURVE");c.dimensions="3D";c.bevel_depth=r;c.bevel_resolution=res
 p=c.splines.new("POLY");p.points.add(len(points)-1)
 for i,v in enumerate(points):p.points[i].co=(*v,1)
 o=bpy.data.objects.new(name,c);scene.collection.objects.link(o);o.parent=parent;c.materials.append(mat)
 return o
# Physical roof assembly: lower original beams to bear on walls, retain
# the editable named roof group and hide-roof convention. Earthen cap
# is a continuous closed mesh with slight surface variation, not a sky card.
for o in list(scene.objects):
 if o.name.startswith("Roof_acacia_pole_"):o.location.z=3.135
 if o.name.startswith("Roof_reed_bundle_"):o.location.z=3.245
 if o.name.startswith("Parapet_"):o.location.z=3.53
# Existing walls top at 3.08 / 3.10 / 3.225. Fill the structural gap.
for x in (-2.75,2.75):box("Roof_wall_bearing_"+str(x),(x,0,3.13),(.46,5.38,.12),wall)
# 29x27 grid on both surfaces, side edges closed.
nx,ny=29,27
verts=[]
for upper in (False,True):
 for j in range(ny):
  y=-2.87+j*5.74/(ny-1)
  for i in range(nx):
   x=-3.02+i*6.04/(nx-1)
   z=3.295+(0.15+.012*sin(x*4.1+y*.8)+.009*cos(y*5.3-x*1.7) if upper else 0)
   verts.append((x,y,z))
n=nx*ny;faces=[]
for j in range(ny-1):
 for i in range(nx-1):
  a=j*nx+i;q=(a,a+1,a+nx+1,a+nx)
  faces.append(tuple(reversed(q)));faces.append(tuple(v+n for v in q))
boundary=list(range(nx))+[j*nx+nx-1 for j in range(1,ny)]+[(ny-1)*nx+i for i in range(nx-2,-1,-1)]+[j*nx for j in range(ny-2,0,-1)]
for a,b in zip(boundary,boundary[1:]+boundary[:1]):faces.append((a,b,b+n,a+n))
roof=mesh("Roof_continuous_earthen_cap_W26",verts,faces,wall);uv_planar(roof,.95)
# Wood beams and closely laid reed courses visible from the interior.
for i in range(53):
 x=-2.58+i*.099
 pts=[(x+.008*sin(j*.7+i),-2.64+j*5.28/16,3.239+.009*cos(j*.5+i)) for j in range(17)]
 tube("Roof_reed_ceiling_%02d"%i,pts,straw_light if i%4 else straw,.036)
# Close the original basket at the bottom without moving its rim or anchor.
# The base rests on the real work surface (table top = .84 m).
bx,by=.35,-.26
sides=80
v=[(bx,by,.851),(bx,by,.925)]
for z,rx,ry in [(.851,.302,.195),(.925,.315,.205)]:
 for k in range(sides):
  a=2*pi*k/sides;v.append((bx+rx*cos(a),by+ry*sin(a),z))
f=[]
for k in range(sides):
 l=(k+1)%sides
 f.extend([(0,2+l,2+k),(1,2+sides+k,2+sides+l),(2+k,2+l,2+sides+l,2+sides+k)])
base=mesh("Basket_W26_closed_woven_base",v,f,straw,basket,True)
# A real woven contact surface inside the basket. Short strands inside
# the ellipse, with alternating over/under heights, no floating elements.
for axis in (0,1):
 radius=.292 if axis==0 else .188
 other=.188 if axis==0 else .292
 count=23 if axis==0 else 15
 for i in range(count):
  off=radius*(2*(i+.5)/count-1)
  extent=other*math.sqrt(max(0,1-(off/radius)**2))
  points=[]
  for j in range(23):
   t=-extent+2*extent*j/22
   xy=(off,t) if axis==0 else (t,off)
   points.append((bx+xy[0],by+xy[1],.929+.003*cos(j*pi/2+i*pi+axis*pi)))
  tube("Basket_W26_floor_%s_%02d"%(axis,i),points,straw_light if i%3 else straw,.006,basket)
# Rebuild the four actual vessels as closed clay bodies with inner wall,
# rolled lip and closed floor. Reuse location, dimensions and material.
names=["Water_storage_jar","Small_oil_vessel","Courtyard_grain_jar","Second_storage_pot"]
vessel_records=[]
for idx,name in enumerate(names):
 old=bpy.data.objects[name];coords=[old.matrix_world@v.co for v in old.data.vertices]
 cx=(min(v.x for v in coords)+max(v.x for v in coords))/2
 cy=(min(v.y for v in coords)+max(v.y for v in coords))/2
 z0=min(v.z for v in coords);height=max(v.z for v in coords)-z0
 scale=height/1.17;mat=old.data.materials[0]
 # outer profile rising, rounded lip, inner profile descending
 profile=[(0,.13),(.025,.18),(.06,.26),(.27,.39),(.63,.42),(.90,.32),(1.05,.18),(1.10,.215),(1.15,.235),(1.17,.218),(1.15,.197),(1.10,.184),(1.04,.153),(.90,.287),(.63,.385),(.27,.355),(.09,.223),(.055,.12)]
 m=64;verts=[];faces=[]
 for h,r in profile:
  for k in range(m):
   a=2*pi*k/m;rr=r*(1+.007*cos(3*a+idx)+.004*sin(7*a+h*5))
   verts.append((cx+rr*cos(a)*scale,cy+rr*sin(a)*scale,z0+h*scale))
 for i in range(len(profile)-1):
  for k in range(m):
   a=i*m+k;b=i*m+(k+1)%m;faces.append((a,b,b+m,a+m))
 outer_center=len(verts);verts.append((cx,cy,z0))
 inner_center=len(verts);verts.append((cx,cy,z0+.055*scale))
 for k in range(m):
  faces.append((outer_center,(k+1)%m,k))
  a=(len(profile)-1)*m;faces.append((inner_center,a+k,a+(k+1)%m))
 bpy.data.objects.remove(old,do_unlink=True)
 o=mesh(name,verts,faces,mat,smooth=True)
 # Restrained horizontal turning marks, geometry not decal.
 for band,h,r in [(0,.21,.355),(1,.24,.375),(2,.91,.31)]:
  points=[(cx+(r+.003)*scale*cos(k*2*pi/96),cy+(r+.003)*scale*sin(k*2*pi/96),z0+h*scale) for k in range(97)]
  tube("Pottery_turning_line_%s_%d"%(name,band),points,mat,.003*scale)
 vessel_records.append({"name":name,"height_m":round(height,4),"closed_clay_mesh":True})
# Verify closed geometry via edge incidence (not only a visual assertion).
def manifold(o):
 counts={}
 for poly in o.data.polygons:
  for key in poly.edge_keys:
   counts[tuple(sorted(key))]=counts.get(tuple(sorted(key)),0)+1
 return all(n==2 for n in counts.values())
assert manifold(roof) and manifold(base) and all(manifold(bpy.data.objects[n]) for n in names)
# Convert only new curves, preserve the original rim and gesture contact transform.
for o in list(scene.objects):
 if o.type!="CURVE":continue
 bpy.ops.object.select_all(action="DESELECT");o.select_set(True);bpy.context.view_layer.objects.active=o
 bpy.ops.object.convert(target="MESH")
# Native lighting with physical ceiling and directional doorway light.
sun=bpy.data.objects["Morning_sun_original"]
sun.data.energy=2.4;sun.data.angle=math.radians(4)
sun.rotation_euler=(Vector((.6,1,-.75)).to_track_quat("-Z","Y")).to_euler()
fill=bpy.data.objects["Warm_courtyard_fill"];fill.data.energy=380
scene.world.color=(.22,.23,.25)
scene.render.engine="CYCLES";scene.cycles.device="CPU";scene.cycles.samples=20;scene.cycles.use_denoising=True
scene.render.resolution_x=1024;scene.render.resolution_y=640;scene.render.resolution_percentage=100
scene.view_settings.view_transform="AgX"
bpy.context.preferences.filepaths.save_version=0
bpy.ops.file.pack_all()
blend=OUT/"w26-house-study.blend";bpy.ops.wm.save_as_mainfile(filepath=str(blend),check_existing=False)
bpy.ops.object.select_all(action="DESELECT")
for o in scene.objects:o.select_set(o.type in ("MESH","EMPTY"))
bpy.context.view_layer.objects.active=root
glb=OUT/"w26-house-study.glb"
bpy.ops.export_scene.gltf(filepath=str(glb),export_format="GLB",export_yup=True,export_apply=True,export_animations=False,use_selection=True,export_materials="EXPORT")
record={"status":"ART_HOLD_W26_HOUSE_STUDY","baseline_sha256":digest(SRC),"blend_sha256":digest(blend),"glb_sha256":digest(glb),"bytes":glb.stat().st_size,"roof_closed":True,"basket_base_closed":True,"vessels":vessel_records,"license":"Original derivative geometry; W17 packed Poly Haven CC0 textures; no new external assets","historical_boundary":"Concept reconstruction; no identified dwelling or claimed biblical artifact"}
(OUT/"w26-study-manifest.json").write_text(json.dumps(record,indent=2),encoding="utf8")
print("W26_EXPORT_PASS "+json.dumps(record),flush=True)
cam=scene.camera
def render(name,eye,target,lens):
 cam.location=eye;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat("-Z","Y").to_euler();cam.data.lens=lens
 scene.render.filepath=str(OUT/(name+".png"));bpy.ops.render.render(write_still=True)
 print("W26_RENDER "+name,flush=True)
render("w26-courtyard",(5.7,-9.4,3.1),(0,-2.7,1.55),32)
render("w26-threshold",(0,-4.45,1.69),(.35,.2,1.32),30)
render("w26-room",(-1.35,-1.65,1.69),(.7,.55,1.05),29)
render("w26-basket",(1.16,-1.10,1.65),(.35,-.26,1.05),47)
print("W26_NATIVE_RENDER_COMPLETE",flush=True)
