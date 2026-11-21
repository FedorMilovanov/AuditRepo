# HOREB original 3D asset authoring pilot, 2026-11-21.
# Modelling is a first scene study and is NOT a verified dwelling of Moses.
# Third-party textures: Poly Haven clay_plaster + sand_01, CC0, recorded in asset manifest.
# Blender 4.5 LTS: open editable .blend + exported named GLB, Y-up conversion.
import bpy, math, random, os, json, hashlib
from mathutils import Vector
from math import sin, cos, pi
random.seed(18402)
BASE=os.environ.get("HOREB_ART_PIPELINE_ROOT",os.path.abspath(os.path.join(os.path.dirname(__file__),"..")))
TEX=os.path.join(BASE,"source","textures")
EXPORT=os.path.join(BASE,"export")
os.makedirs(EXPORT,exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for c in list(bpy.data.collections):
    if c.name != "Collection": bpy.data.collections.remove(c)
scene=bpy.context.scene
scene.unit_settings.system='METRIC'
scene.unit_settings.scale_length=1.0
scene.render.engine='BLENDER_EEVEE_NEXT'
scene.render.resolution_x=1280
scene.render.resolution_y=720
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.film_transparent=False
scene.world.color=(0.21,0.20,0.17)
root=bpy.data.objects.new("HOREB_HOUSE_01__RECONSTRUCTION_NOT_ATTESTED",None)
scene.collection.objects.link(root)
# Named and editable objects; collision geometry is derived separately by engineering.
def solid(name,rgba,rough=0.92,metal=0):
    mat=bpy.data.materials.new(name)
    mat.use_nodes=True
    p=mat.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value=(*rgba,1)
    p.inputs["Roughness"].default_value=rough
    p.inputs["Metallic"].default_value=metal
    return mat
def pbr(name,tbase,roughfile,tint):
    mat=solid(name,tint)
    n=mat.node_tree.nodes
    p=n.get("Principled BSDF")
    diff=n.new("ShaderNodeTexImage")
    diff.label="CC0 Poly Haven: "+tbase
    diff.image=bpy.data.images.load(os.path.join(TEX,tbase),check_existing=True)
    mat.node_tree.links.new(diff.outputs["Color"],p.inputs["Base Color"])
    if roughfile:
        rough=n.new("ShaderNodeTexImage")
        rough.image=bpy.data.images.load(os.path.join(TEX,roughfile),check_existing=True)
        rough.image.colorspace_settings.name="Non-Color"
        mat.node_tree.links.new(rough.outputs["Color"],p.inputs["Roughness"])
    if tbase.startswith("clay_plaster"):
        tex_n=n.new("ShaderNodeTexImage")
        tex_n.image=bpy.data.images.load(os.path.join(TEX,"clay_plaster_nor_gl_1k.jpg"),check_existing=True)
        tex_n.image.colorspace_settings.name="Non-Color"
        normal_map=n.new("ShaderNodeNormalMap")
        normal_map.inputs["Strength"].default_value=.45
        mat.node_tree.links.new(tex_n.outputs["Color"],normal_map.inputs["Color"])
        mat.node_tree.links.new(normal_map.outputs["Normal"],p.inputs["Normal"])
    return mat
wall=pbr("CC0_clay_plaster_unpolished","clay_plaster_diff_1k.jpg","clay_plaster_rough_1k.jpg",(0.79,0.64,0.48))
sand=pbr("CC0_sand_01_courtyard","sand_01_diff_1k.jpg","sand_01_rough_1k.jpg",(0.65,0.59,0.49))
raw=solid("Exposed_dark_mudbrick",(0.34,0.23,0.15))
straw=solid("Sun_bleached_reed",(0.58,0.43,0.23))
straw_light=solid("Papyrus_wicker_warm",(0.74,0.57,0.32))
wood=solid("Aged_wood_rays",(0.27,0.19,0.11))
cloth=solid("Handwoven_linen",(0.72,0.64,0.50))
cloth_shade=solid("Linen_hazy_shadow",(0.55,0.46,0.36))
terracotta=solid("Fired_clay_ceramic",(0.40,0.225,0.11),.78)
stone=solid("Wear_and_stone_floor",(0.49,0.40,0.28))
pitch=solid("Dark_pitch_concept_only",(0.075,0.059,0.041),.66)
def adopt(obj,mat,parent=root):
    if parent:obj.parent=parent
    if mat:obj.data.materials.append(mat)
    return obj
def bevel(obj,w=.04,s=2):
    mod=obj.modifiers.new("Soften_informal_edges","BEVEL")
    mod.width=w;mod.segments=s
    mod.affect='EDGES'
    mod2=obj.modifiers.new("Weighted_face_normals","WEIGHTED_NORMAL")
def box(name,pos,scale,mat,edge=.025,uv_repeat=1):
    bpy.ops.mesh.primitive_cube_add(size=1,location=pos)
    o=bpy.context.object;o.name=name;o.dimensions=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    adopt(o,mat)
    if edge:bevel(o,edge)
    if uv_repeat!=1 and o.data.uv_layers:
        for uv in o.data.uv_layers.active.data:
            uv.uv.x*=uv_repeat;uv.uv.y*=uv_repeat
    return o
def wire(name,points,mat,thickness=.012,res=3):
    crv=bpy.data.curves.new(name,'CURVE');crv.dimensions='3D'
    crv.resolution_u=12;crv.bevel_depth=thickness;crv.bevel_resolution=res
    poly=crv.splines.new('POLY');poly.points.add(len(points)-1)
    for i,v in enumerate(points):poly.points[i].co=(v[0],v[1],v[2],1)
    ob=bpy.data.objects.new(name,crv);scene.collection.objects.link(ob);adopt(ob,mat)
    return ob
def mesh(name,vertices,faces,mat):
    me=bpy.data.meshes.new(name);me.from_pydata(vertices,[],faces);me.update()
    ob=bpy.data.objects.new(name,me);scene.collection.objects.link(ob);adopt(ob,mat)
    return ob
# Flat-roofed ancient-Egyptian-inspired enclosed room, opening to a lived-in yard.
# Exposed roof beams are visible; no invented inscriptions or modern amenities.
box("Room_floor_earthen",(0,0,-.115),(5.65,5.30,.22),wall,.035,2)
box("Courtyard_earthen_ground",(0,-5.15,-.18),(7.2,6.60,.14),sand,.01,3)
box("Back_wall_thick",(0,2.56,1.61),(5.73,.43,3.23),wall,.09,2)
box("West_wall",( -2.75,.05,1.54),(.47,5.38,3.08),wall,.09,2)
box("East_wall",( 2.75,.05,1.54),(.47,5.38,3.08),wall,.09,2)
# Front entry gap (open, physically passable; not a dark fake rectangle).
box("Facade_left_of_open_door",(-1.81,-2.53,1.55),(1.89,.43,3.10),wall,.06,2)
box("Facade_right_of_open_door",(1.66,-2.53,1.55),(2.18,.43,3.10),wall,.06,2)
box("Door_lintel_only",(0,-2.52,2.78),(1.47,.52,.45),wall,.045)
box("Doorframe_east_jamb",(.67,-2.78,1.18),(.14,.15,2.37),wood,.025)
box("Doorframe_west_jamb",(-.67,-2.78,1.18),(.14,.15,2.37),wood,.025)
box("Threshold_worn",(-.01,-2.78,.025),(1.55,.63,.09),stone,.03)
# Courtyard low perimeter, intentionally interrupted near entrance.
box("Yard_west_wall",(-3.42,-5.10,.65),(.35,5.8,1.3),wall,.06,2)
box("Yard_east_wall",(3.42,-5.10,.65),(.35,5.8,1.3),wall,.06,2)
box("Yard_entrance_west",(-2.12,-8.02,.64),(2.46,.35,1.28),wall,.04,2)
box("Yard_entrance_east",(2.16,-8.02,.64),(2.36,.35,1.28),wall,.04,2)
# Uneven earth roof / parapet, three open strips of cooling airflow.
for yy in [-2.06,-1.1,-.14,.82,1.78]:
    box("Roof_acacia_pole_%s"%yy,(0,yy,3.36),(6.10,.11,.14),wood,.025)
for i,xx in enumerate([-2.30,-1.7,-1.10,-.50,.10,.70,1.3,1.90]):
    box("Roof_reed_bundle_%02d"%i,(xx,.14,3.44),(.21,4.25,.11),straw,.018)
for xx in [-2.65,2.65]:
    box("Parapet_cap_%.0f"%xx,(xx,0,3.22),(.42,5.22,.31),wall,.07)
box("Parapet_back",(0,2.63,3.25),(5.55,.37,.28),wall,.055)
# Hand-set raw brick patches in three eroded wall zones.
for group,(gx,gy,gz,axis) in enumerate([
 (-1.65,-2.79,.60,'front'),(-1.8,2.30,1.3,'back'),(2.49,.9,.65,'side')]):
    for row in range(4):
        for col in range(7):
            x=gx+col*.195+(.09 if row%2 else 0) if axis!='side' else gx
            y=gy if axis!='side' else gy+(col-3)*.20
            z=gz+row*.14+random.uniform(-.016,.02)
            w=.18+random.uniform(-.024,.022)
            box("Exposed_hand_formed_brick_%d_%d_%d"%(group,row,col),(x,y,z),
               ((w,.06,.117) if axis!='side' else (.06,w,.117)),raw,.015)
# Organic timber shade and floor mats — authorable separate objects.
for i,xx in enumerate([-2,-1,0,1,2]):
    box("Courtyard_pergola_rib_%02d"%i,(xx,-3.94,2.55),(.095,2.54,.12),wood,.02)
for i in range(24):
    y=-3.12-i*.071
    wire("Courtyard_light_reed_%02d"%i,[(-2.05,y,2.63),(2.05,y,2.63)],straw_light if i%3 else straw,.014,1)
# Household bench, display niche and shelf, not modern furnishings.
box("Domestic_clay_bench",(-1.52,.86,.30),(1.25,.62,.59),raw,.06)
box("Niche_wall_recess_shadow",(1.70,2.302,1.56),(.94,.04,.54),raw,.02)
box("Niche_embedded_shelf",(1.72,2.18,1.28),(1.03,.23,.10),wood,.025)
box("Coarse_work_surface",(.36,-.25,.78),(1.67,.81,.12),wood,.035)
for xx in [-.25,.96]:
    for yy in [-.53,.03]:
        box("Workshop_wood_support",(xx,yy,.39),(.13,.13,.77),wood,.022)
# Pottery vessels: handmade lathe profiles, not generic spheres.
def pottery(name,x,y,z,scale,profile,mat):
    verts=[];faces=[];n=40
    for h,r in profile:
        for k in range(n):
            a=2*pi*k/n
            verts.append((x+r*cos(a)*scale,y+r*sin(a)*scale,z+h*scale))
    for i in range(len(profile)-1):
        for k in range(n):faces.append((i*n+k,i*n+(k+1)%n,(i+1)*n+(k+1)%n,(i+1)*n+k))
    ob=mesh(name,verts,faces,mat)
    for p in ob.data.polygons:p.use_smooth=True
    return ob
vase_profile=[(0,.14),(.06,.26),(.27,.39),(.63,.42),(.90,.32),(1.05,.18),(1.11,.23),(1.17,.23)]
pottery("Water_storage_jar",1.65,1.23,.02,.98,vase_profile,terracotta)
pottery("Small_oil_vessel",-1.92,-1.15,-.06,.52,vase_profile,terracotta)
pottery("Courtyard_grain_jar",2.1,-5.5,-.10,1.21,vase_profile,terracotta)
pottery("Second_storage_pot",-2.3,-6.55,-.13,.87,vase_profile,raw)
# Woven mat: alternating strips and tiny cross strands, save as a mesh component.
for i in range(24):
    y=.45+i*.049
    box("Floor_reed_mat_warp_%02d"%i,(-.72,y,-.005),(1.25,.033,.009),
        straw_light if i%4 else straw,.002)
for i in range(25):
    x=-1.32+i*.05
    box("Floor_reed_mat_weft_%02d"%i,(x,1.04,.002),(.014,1.19,.010),
        straw if i%3 else straw_light,.002)
# Cloth on two rope lines with sculptural folds; physically visible from inside.
for i,(x0,y0,width) in enumerate([(-2.25,1.53,1.12),(1.62,-1.58,.72)]):
    rows=19;cols=15;verts=[];faces=[]
    for row in range(rows+1):
        t=row/rows
        for col in range(cols+1):
            u=col/cols
            x=x0+width*(u-.5)
            z=2.14-1.43*t+.032*sin(u*4*pi)*sin(t*pi)
            y=y0+.13*sin(u*2*pi)*t+ .09*cos(2*pi*t)*u
            verts.append((x,y,z))
    for row in range(rows):
        for col in range(cols):
            a=row*(cols+1)+col
            faces.append((a,a+1,a+cols+2,a+cols+1))
    fabric=mesh("Hanging_linen_fabric_%02d"%i,verts,faces,cloth if i==0 else cloth_shade)
    for poly in fabric.data.polygons:poly.use_smooth=True
    wire("Fabric_hanging_rope_%02d"%i,[(x0-width*.56,y0,2.17),(x0+width*.56,y0,2.17)],wood,.018)
# Hand-shaped papyrus basket on the work surface. Egg-elliptic topology,
# separate named object group allows next animation/holding stage.
basket_group=bpy.data.objects.new("BASKET_OBJECT_ACTION_ANCHOR",None)
scene.collection.objects.link(basket_group)
basket_group.parent=root
bx,by,bz=.35,-.26,.855
def shell_basket():
    sides=40;levels=14;verts=[];faces=[]
    for j in range(levels+1):
        t=j/levels
        rx=.315+.155*t-.02*sin(t*pi)
        ry=.205+.12*t-.01*sin(t*pi)
        z=bz+.07+.23*t
        for k in range(sides):
            a=2*pi*k/sides
            verts.append((bx+rx*cos(a),by+ry*sin(a),z))
    for j in range(levels):
        for k in range(sides):
            f=j*sides+k;nextk=j*sides+(k+1)%sides
            faces.append((f,nextk,nextk+sides,f+sides))
    ob=mesh("Hand_woven_basket_body",verts,faces,straw)
    ob.parent=basket_group
    for p in ob.data.polygons:p.use_smooth=True
    for j in range(13):
        t=(j+.5)/13
        rx=.315+.155*t-.02*sin(t*pi)
        ry=.205+.12*t-.01*sin(t*pi)
        z=bz+.07+.23*t
        pts=[]
        for k in range(97):
            a=2*pi*k/96
            pts.append((bx+rx*cos(a),by+ry*sin(a),z+ .006*sin(17*a+3*t)))
        w=wire("Basket_weft_%02d"%j,pts,straw_light if j%3 else wood,.007,1)
        w.parent=basket_group
    for k in range(38):
        a=2*pi*k/38
        pts=[]
        for j in range(16):
            t=j/15;rx=.315+.155*t-.02*sin(t*pi);ry=.205+.12*t-.01*sin(t*pi)
            pts.append((bx+(rx+.009)*cos(a),by+(ry+.009)*sin(a),bz+.07+.23*t))
        w=wire("Basket_warp_%02d"%k,pts,straw_light if k%2 else straw,.006,1)
        w.parent=basket_group
    rim=[]
    for k in range(121):
        a=2*pi*k/120
        rim.append((bx+.474*cos(a),by+.325*sin(a),bz+.303))
    w=wire("Basket_thick_lipped_rim",rim,straw_light,.026,3)
    w.parent=basket_group
shell_basket()
# A folded linen piece as a distinct NOT-YET-ANIMATED material object (no infant model).
box("Folded_linen_by_basket",(.01,-.20,.95),(.23,.32,.08),cloth,.019)
# Light, staging, shots; lights/camera are in editable .blend but excluded from GLB.
def aim(obj,target):
    direction=Vector(target)-obj.location
    obj.rotation_euler=direction.to_track_quat('-Z','Y').to_euler()
bpy.ops.object.light_add(type='SUN',location=(-5,-5,13))
sun=bpy.context.object;sun.name="Morning_sun_original";sun.data.energy=1.5
sun.data.angle=math.radians(8);sun.rotation_euler=(.22,-.48,-.72)
bpy.ops.object.light_add(type='AREA',location=(1,-7.4,4.8))
fill=bpy.context.object;fill.name="Warm_courtyard_fill";fill.data.energy=950
fill.data.shape='DISK';fill.data.size=6.5;aim(fill,(0,-1.5,1.2))
bpy.ops.object.camera_add(location=(7.2,-10.0,5.6))
camera=bpy.context.object;camera.name="ART_HERO_FRONT_COURTYARD"
camera.data.type='PERSP';camera.data.lens=36;aim(camera,(0,-1.9,1.25))
scene.camera=camera
# Curves for wicker and rope must be converted to real triangle mesh in GLB.
for curve_obj in list(scene.objects):
    if curve_obj.type != 'CURVE':
        continue
    bpy.ops.object.select_all(action='DESELECT')
    curve_obj.select_set(True)
    bpy.context.view_layer.objects.active=curve_obj
    bpy.ops.object.convert(target='MESH')
# For independent reproducibility, the GLB must open in other 3D engines.
# Export only meshes + named action marker, never lights/cameras/render-only helpers.
for o in bpy.context.selected_objects:o.select_set(False)
for o in scene.objects:
    o.select_set(o.type in ('MESH','EMPTY') and o!=sun and o!=fill and o!=camera)
bpy.context.view_layer.objects.active=root
blend=os.path.join(BASE,"source","horeb_egypt_house_hero_pilot.blend")
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=blend,check_existing=False)
glb=os.path.join(EXPORT,"horeb_egypt_house_hero_pilot.glb")
bpy.ops.export_scene.gltf(filepath=glb,export_format='GLB',
 export_yup=True,export_apply=True,export_animations=False,
 use_selection=True,export_materials='EXPORT')
manifest={"status":"ART_PILOT_HOLD","title":"Egyptian-inspired mudbrick room & courtyard, not an attested residence",
 "license":"original_geometry_plus_CC0_PolyHaven_textures","original_scene":blend,
 "preview_only":True,
 "source_textures":[{"slug":"clay_plaster","url":"https://polyhaven.com/a/clay_plaster",
 "license":"CC0","author":"Amal Kumar"},{"slug":"sand_01",
 "url":"https://polyhaven.com/a/sand_01","license":"CC0"}],
 "external_game_asset_ip":"none","sha256":hashlib.sha256(open(glb,'rb').read()).hexdigest(),
 "bytes":os.stat(glb).st_size,"named_objects":sum(1 for o in scene.objects if o.type=='MESH')}
with open(os.path.join(EXPORT,"horeb_egypt_house_hero_pilot.asset.json"),'w',encoding='utf8') as f:
    json.dump(manifest,f,ensure_ascii=False,indent=2)
print("HOUSE_PILOT_EXPORTED",glb,os.stat(glb).st_size,manifest["sha256"])
print("AUTHORING_SOURCE",blend,os.stat(blend).st_size)
