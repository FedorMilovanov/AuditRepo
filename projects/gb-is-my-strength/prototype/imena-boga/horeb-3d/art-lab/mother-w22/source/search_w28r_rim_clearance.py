"""Sweep the W28q-derived hand pose against the authored basket rim at six collision-prone gesture samples. The full 417-sample, 98-prop clearance gate remains tests/w28f-reimport-audit.py."""
import bpy,os,math,json,itertools
from pathlib import Path
from mathutils import Quaternion,Vector
from mathutils.bvhtree import BVHTree
root=Path(os.environ['HOREB_W28Q_OUTPUT']);house=Path(os.environ['HOREB_W28_HOUSE_OUTPUT'])
bpy.ops.wm.read_factory_settings(use_empty=True);s=bpy.context.scene;s.render.fps=24
bpy.ops.import_scene.gltf(filepath=str(root/'w28q-actor.glb'),merge_vertices=True)
rig=next(o for o in bpy.data.objects if o.type=='ARMATURE');body=next(o for o in bpy.data.objects if o.type=='MESH' and o.name=='base');bones=rig.pose.bones
track=next(t for t in rig.animation_data.nla_tracks if t.name=='Mother_GestureTowardsBasket');rig.animation_data.use_nla=False;rig.animation_data.action=track.strips[0].action;rig.animation_data.action_slot=track.strips[0].action_slot
prior=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(house/'w28-house.glb'));imp=[o for o in bpy.data.objects if o not in prior]
rimobj=next(o for o in imp if o.name=='Basket_thick_lipped_rim');rimpts=[rimobj.matrix_world@v.co for v in rimobj.data.vertices];rim=BVHTree.FromPolygons(rimpts,[tuple(p.vertices) for p in rimobj.data.polygons])
off=Vector((-.58,-.30,.015));digits=('thumb','index','middle','ring','pinky')
allids={g.index for g in body.vertex_groups if g.name=='hand_l' or any(g.name==f'{d}_{i:02d}_l' for d in digits for i in (1,2,3))}
handverts={v.index for v in body.data.vertices if sum(g.weight for g in v.groups if g.group in allids)>=.5};faces=[tuple(p.vertices) for p in body.data.polygons if all(i in handverts for i in p.vertices)]
distal={d:[v.index for v in body.data.vertices if any(g.group==body.vertex_groups[f'{d}_03_l'].index and g.weight>=.5 for g in v.groups)] for d in digits}
s.frame_set(60);bpy.context.view_layer.update()
names=['hand_l']+[f'{d}_{i:02d}_l' for d in digits for i in (1,2,3)]
base={n:bones[n].rotation_quaternion.copy() for n in names}
yawaxis=(rig.matrix_world@bones['hand_l'].matrix).to_quaternion().inverted()@Vector((0,0,1))
def make_delta(params):
 for n,q in base.items():bones[n].rotation_quaternion=q
 bones['hand_l'].rotation_quaternion=base['hand_l']@Quaternion(yawaxis,math.radians(params[0]))
 bones['thumb_01_l'].rotation_quaternion=base['thumb_01_l']@Quaternion((0,0,1),math.radians(params[1]))@Quaternion((1,0,0),math.radians(params[2]))
 for i in (2,3):
  n=f'thumb_{i:02d}_l';bones[n].rotation_quaternion=base[n]@Quaternion((1,0,0),math.radians(params[3]))
 for d,f in zip(digits[1:],params[4:]):
  for i,ratio in ((1,.35),(2,.8),(3,1.0)):
   n=f'{d}_{i:02d}_l';bones[n].rotation_quaternion=base[n]@Quaternion((1,0,0),math.radians(f*ratio))
 return {n:(base[n].inverted()@bones[n].rotation_quaternion).normalized() for n in names}
def assess(delta,frame):
 lo=math.floor(frame);s.frame_set(lo,subframe=frame-lo)
 for n,q in delta.items():bones[n].rotation_quaternion=(bones[n].rotation_quaternion@q).normalized()
 bpy.context.view_layer.update();ob=body.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ob.to_mesh();pts=[ob.matrix_world@v.co+off for v in me.vertices]
 tree=BVHTree.FromPolygons(pts,[tuple(p.vertices) for p in me.polygons]);hits=len(tree.overlap(rim))
 ht=BVHTree.FromPolygons(pts,faces);selfhits=sum(1 for i,j in ht.overlap(ht) if i<j and not set(faces[i])&set(faces[j]))
 d={x:sum(sorted(rim.find_nearest(pts[i])[3]*1000 for i in distal[x])[:5])/5 for x in digits}
 ob.to_mesh_clear()
 return {'frame':frame,'rim_hits':hits,'self_hits':selfhits,'clearance':d}
frames=(46.75,47.,70.5,70.75,71.,71.25)
res=[]
for yaw in (-20,-10,0,10,20):
 for a in (40,50,60,70):
  for p in (0,10,20,30):
   for d in (10,20,30,40):
    params=[yaw,a,p,d,30,0,10,23];delta=make_delta(params);tests=[assess(delta,f) for f in frames]
    total=sum(x['rim_hits'] for x in tests);selftotal=sum(x['self_hits'] for x in tests)
    maxthumb=max(x['clearance']['thumb'] for x in tests)
    score=total*1e6+selftotal*1e6+sum(max(0,x['clearance']['thumb']-8)**2 for x in tests)+.002*sum(v*v for v in params)
    res.append((score,params,total,selftotal,tests))
good=[x for x in res if x[2]==0 and x[3]==0]
print('SEARCH',len(res),'ZERO_RIM_SELF',len(good),flush=True)
for x in sorted(good,key=lambda z:z[0])[:15]:
 print('SAFE',json.dumps({'params':x[1],'score':round(x[0],3),'tests':x[4]}),flush=True)
print('BEST_ANY',json.dumps({'params':min(res,key=lambda z:z[0])[1],'rim':min(res,key=lambda z:z[0])[2],'self':min(res,key=lambda z:z[0])[3]}),flush=True)
