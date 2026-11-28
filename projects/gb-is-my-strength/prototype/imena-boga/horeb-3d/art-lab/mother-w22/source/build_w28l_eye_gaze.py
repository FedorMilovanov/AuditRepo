"""W28l experimental eye gaze: append only eye morphs to the verified W28g GLB."""
import bpy
import copy, hashlib, json, math, os, struct
from pathlib import Path
import numpy as np
from mathutils import Vector

def sha(b): return hashlib.sha256(b).hexdigest()
def glb(path):
    raw=path.read_bytes()
    magic,version,total=struct.unpack_from("<4sII",raw)
    assert (magic,version,total)==(b"glTF",2,len(raw))
    n,t=struct.unpack_from("<I4s",raw,12)
    assert t==b"JSON"
    d=json.loads(raw[20:20+n])
    m,t=struct.unpack_from("<I4s",raw,20+n)
    assert t==b"BIN\0" and 28+n+m==len(raw)
    return raw,d,raw[28+n:]
def read(d,b,index,dim):
    a=d["accessors"][index];v=d["bufferViews"][a["bufferView"]]
    assert a["componentType"]==5126 and "sparse" not in a
    assert v.get("byteStride",dim*4)==dim*4
    return np.frombuffer(b,dtype="<f4",count=a["count"]*dim,offset=v.get("byteOffset",0)+a.get("byteOffset",0)).reshape(-1,dim).astype(float)
def encode(d,b):
    j=json.dumps(d,ensure_ascii=False,separators=(",",":")).encode()
    j+=b" "*(-len(j)%4);b+=b"\0"*(-len(b)%4)
    return struct.pack("<4sII",b"glTF",2,28+len(j)+len(b))+struct.pack("<I4s",len(j),b"JSON")+j+struct.pack("<I4s",len(b),b"BIN\0")+b

root=Path(os.environ["HOREB_W28G_OUTPUT"])
house=Path(os.environ["HOREB_W28_HOUSE_OUTPUT"])
out=Path(os.environ["HOREB_W28L_OUTPUT"])
m=json.loads((root/"w28g-manifest.json").read_text(encoding="utf8"))
raw,d,b=glb(root/"w28g-actor.glb")
assert sha(raw)==m["glb_sha256"]=="3e1baf347b9197b2a59da935f15245f2ef289302b72cde22047642e563acc488"
assert sha((root/"w28g-actor.blend").read_bytes())==m["blend_sha256"]
h,hd,hb=glb(house/"w28-house.glb")
assert sha(h)==m["house_sha256"]
original=copy.deepcopy(d);payload=bytearray(b)
assert len(d["skins"])==1 and len(d["skins"][0]["joints"])==53
eye_node=next(i for i,n in enumerate(d["nodes"]) if n.get("name")=="W19_CC0_Eyes")
eye=d["meshes"][d["nodes"][eye_node]["mesh"]]
assert len(eye["primitives"])==1 and "weights" not in eye
p=eye["primitives"][0]
assert "targets" not in p
pos=read(d,b,p["attributes"]["POSITION"],3)
normal=read(d,b,p["attributes"]["NORMAL"],3)
assert len(pos)==96 and len(normal)==96
rim_id=next(i for i,n in enumerate(hd["nodes"]) if n.get("name")=="Basket_thick_lipped_rim")
rim_node=hd["nodes"][rim_id]
parents={child:i for i,n in enumerate(hd["nodes"]) for child in n.get("children",[])}
ancestor=rim_id
while True:
    assert not any(k in hd["nodes"][ancestor] for k in ("matrix","rotation","translation","scale")), "World-space rim contract changed"
    if ancestor not in parents:break
    ancestor=parents[ancestor]
assert ancestor in hd["scenes"][hd.get("scene",0)]["nodes"]
rim=hd["meshes"][rim_node["mesh"]]["primitives"][0]
rpos=read(hd,hb,rim["attributes"]["POSITION"],3)
target=(rpos.min(axis=0)+rpos.max(axis=0))/2
offset=np.array(m["placement_three"])
# Work in glTF rest coordinates. Convert to/from Blender coordinates for head pose.
def bl(v): return Vector((float(v[0]),-float(v[2]),float(v[1])))
def gl(v): return np.array([v.x,v.z,-v.y])
def unit(v):return v/np.linalg.norm(v)
def rot(axis,ang):
    x,y,z=unit(np.array(axis,dtype=float)); c=math.cos(ang);s=math.sin(ang);t=1-c
    return np.array([[c+x*x*t,x*y*t-z*s,x*z*t+y*s],[y*x*t+z*s,c+y*y*t,y*z*t-x*s],[z*x*t-y*s,z*y*t+x*s,c+z*z*t]])
def append(a,typ,dim,target=None):
    a=np.asarray(a,dtype="<f4").reshape(-1,dim)
    assert np.isfinite(a).all()
    payload.extend(b"\0"*(-len(payload)%4))
    i=len(d["bufferViews"]);view={"buffer":0,"byteOffset":len(payload),"byteLength":a.nbytes}
    if target:view["target"]=target
    d["bufferViews"].append(view);payload.extend(a.tobytes())
    j=len(d["accessors"])
    d["accessors"].append({"bufferView":i,"componentType":5126,"count":len(a),"type":typ,"min":a.min(axis=0).tolist(),"max":a.max(axis=0).tolist()})
    return j

centers=[];targets=[];names=[];stats=[]
# Positive yaw moves the forward vector toward +X; positive pitch moves toward +Y.
yaw=math.radians(6);pitch=math.radians(4)
for side,mask in (("positive_x",pos[:,0]>0),("negative_x",pos[:,0]<0)):
    q=pos[mask];assert len(q)==48
    mean=q.mean(axis=0);v=q-mean
    fit=np.linalg.lstsq(np.c_[2*v,np.ones(len(v))],np.sum(v*v,axis=1),rcond=None)[0]
    center=mean+fit[:3];radius=np.linalg.norm(q-center,axis=1)
    assert .006<float(radius.mean())<.025 and float(radius.std())<.004,(center,radius)
    centers.append(center)
    report={"eye":side,"center":center.tolist(),"radius_mm":float(radius.mean()*1000),"fit_std_mm":float(radius.std()*1000)}
    for name,axis,ang in (("yaw_positive",(0,1,0),yaw),("yaw_negative",(0,1,0),-yaw),("pitch_positive",(-1,0,0),pitch),("pitch_negative",(-1,0,0),-pitch)):
        r=rot(axis,ang);dp=np.zeros_like(pos);dn=np.zeros_like(normal)
        dp[mask]=(q-center)@r.T+center-q;dn[mask]=normal[mask]@r.T-normal[mask]
        displacement=float(np.linalg.norm(dp,axis=1).max())
        assert displacement<.003
        report[name+"_max_mm"]=displacement*1000
        targets.append({"POSITION":append(dp,"VEC3",3,34962),"NORMAL":append(dn,"VEC3",3,34962)})
        names.append(side+"_"+name)
    stats.append(report)
p["targets"]=targets;eye["weights"]=[0.0]*8;eye.setdefault("extras",{})["targetNames"]=names

rig=next(o for o in bpy.data.objects if o.type=="ARMATURE")
assert len(rig.data.bones)==53
scene=bpy.context.scene;scene.render.fps=24;scene.render.fps_base=1
ad=rig.animation_data
def smooth(x):
    x=max(0,min(1,x));return x*x*(3-2*x)
anim_stats=[]
for anim in d["animations"]:
    name=anim["name"]
    track=next(t for t in ad.nla_tracks if t.name==name)
    strip=track.strips[0]
    ad.use_nla=False;ad.action=strip.action;ad.action_slot=strip.action_slot
    original_times=read(original,b,anim["samplers"][0]["input"],1).ravel()
    count=105 if name=="Mother_GestureTowardsBasket" else 144
    assert abs(original_times[0]-1/24)<1e-5 and abs(original_times[-1]-count/24)<1e-5
    times=np.arange(1,count+1,dtype=float)/24
    ti=append(times,"SCALAR",1)
    rows=[]
    for t in times:
        frame=float(t*24);f=round(frame)
        assert abs(frame-f)<.001
        scene.frame_set(f);bpy.context.view_layer.update()
        head=rig.pose.bones["head"]
        transform=rig.matrix_world@head.matrix@head.bone.matrix_local.inverted()@rig.matrix_world.inverted()
        rest_target=gl(transform.inverted()@bl(target-offset))
        envelope=smooth((f-5)/15)*smooth((104-f)/18) if name=="Mother_GestureTowardsBasket" else 0
        weights=[]
        for center in centers:
            direction=unit(rest_target-center)
            a=math.atan2(direction[0],direction[2])
            c=math.atan2(direction[1],math.hypot(direction[0],direction[2]))
            aa=max(-1,min(1,a/yaw))*envelope
            cc=max(-1,min(1,c/pitch))*envelope
            weights.extend([max(0,aa),max(0,-aa),max(0,cc),max(0,-cc)])
        rows.append(weights)
    weights=np.asarray(rows)
    assert weights.shape==(len(times),8) and np.isfinite(weights).all()
    if name=="Mother_GestureTowardsBasket":assert weights.max()>.1
    i=len(anim["samplers"])
    anim["samplers"].append({"input":ti,"output":append(weights.reshape(-1),"SCALAR",1),"interpolation":"LINEAR"})
    anim["channels"].append({"sampler":i,"target":{"node":eye_node,"path":"weights"}})
    anim_stats.append({"name":name,"frames":len(times),"max_weight":weights.max(axis=0).tolist(),"peak_frame_60":weights[59].tolist()})
d["buffers"][0]["byteLength"]=len(payload)
result=encode(d,bytes(payload))
# Reverse only the explicit additions; prove the original mesh and bone animation stayed exact.
check=copy.deepcopy(d)
ce=check["meshes"][check["nodes"][eye_node]["mesh"]]
ce["primitives"][0].pop("targets");ce.pop("weights")
ce["extras"].pop("targetNames")
if "extras" not in original["meshes"][check["nodes"][eye_node]["mesh"]]:ce.pop("extras")
for a in check["animations"]:
    a["samplers"].pop();a["channels"].pop()
for k in ("accessors","bufferViews"):check[k]=check[k][:len(original[k])]
check["buffers"]=original["buffers"]
assert check==original and bytes(payload[:len(b)])==b
if out.exists():
    assert (out/"w28l-actor.glb").read_bytes()==result,"Non-reproducible GLB"
    previous=json.loads((out/"w28l-eye-manifest.json").read_text(encoding="utf8"))
    assert previous["glb_sha256"]==sha(result)
    print("W28L_REPRODUCIBLE",sha(result),flush=True)
else:
    out.mkdir(parents=True)
    (out/"w28l-actor.glb").write_bytes(result)
    (out/"w28l-eye-manifest.json").write_text(json.dumps({"status":"ART_HOLD_W28L_GAZE_TRIAL","source_sha256":sha(raw),"glb_sha256":sha(result),"glb_bytes":len(result),"house_sha256":sha(h),"bones":53,"morph_targets":8,"original_geometry_and_bone_animation_unchanged":True,"eye_target_world_three":target.tolist(),"eye_fits":stats,"animations":anim_stats},indent=2),encoding="utf8")
print("W28L_GAZE_TRIAL",json.dumps(stats),json.dumps(anim_stats),sha(result),flush=True)
