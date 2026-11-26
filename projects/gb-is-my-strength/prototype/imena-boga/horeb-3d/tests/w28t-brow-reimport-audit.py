"""Independent W28t eyebrow overlay audit after GLB import.
This is a focused supplement to the W28r full actor audit, not a new full-actor clearance certificate.
"""
import bpy,os,json,hashlib,math
from pathlib import Path
from mathutils.bvhtree import BVHTree
root=Path(os.environ["HOREB_W28T_OUTPUT"]);base=Path(os.environ["HOREB_W28S_OUTPUT"])
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
m=json.loads((root/"w28t-manifest.json").read_text(encoding="utf8"))
assert sha(root/"w28t-actor.glb")==m["glb_sha256"]=="689c81ae948f6ba0dca8f338b9a06dcd9f604bee525edea1499ff21c9dac6cb3"
assert sha(base/"w28s-actor.glb")==m["source_sha256"] and m["existing_actor_unchanged"] is True
assert m["rest_skin_overlap_pairs"]==0 and m["conform_trials"][-1]["overlap_pairs"]==[0]*5
bpy.ops.wm.read_factory_settings(use_empty=True);s=bpy.context.scene;s.render.fps=24
bpy.ops.import_scene.gltf(filepath=str(root/"w28t-actor.glb"),merge_vertices=True)
rig=next(o for o in bpy.data.objects if o.type=="ARMATURE");assert len(rig.data.bones)==53
meshes=[o for o in bpy.data.objects if o.type=="MESH" and o.parent==rig]
assert len(meshes)==8,[(o.name,o.data.name) for o in meshes]
body=next(o for o in meshes if o.data.shape_keys and "blink_left" in o.data.shape_keys.key_blocks and len(o.data.vertices)>10000)
brow=next(o for o in meshes if o.data.name.startswith("W28t_CC0_brows"))
eyes=next(o for o in meshes if o.data.shape_keys and len(o.data.shape_keys.key_blocks)==9)
cover=next(o for o in meshes if o.name=="W22_plain_linen_head_cover")
assert len(brow.data.polygons)==3072 and len(brow.data.vertices)>1500
assert [k.name for k in brow.data.shape_keys.key_blocks]==["Basis","blink_left","blink_right"]
def action(data,name):
 ad=data.animation_data;t=next(t for t in ad.nla_tracks if t.name==name)
 ad.use_nla=False;ad.action=t.strips[0].action;ad.action_slot=t.strips[0].action_slot
def tree(o,dg):
 ob=o.evaluated_get(dg);me=ob.to_mesh();pts=[ob.matrix_world@v.co for v in me.vertices]
 t=BVHTree.FromPolygons(pts,[tuple(p.vertices) for p in me.polygons]);ob.to_mesh_clear();return t
results=[]
for name,count,step in (("Mother_GestureTowardsBasket",417,.25),("Mother_QuietIdle",144,1)):
 for o in (rig,body.data.shape_keys,brow.data.shape_keys,eyes.data.shape_keys):action(o,name)
 rows=[]
 for i in range(count):
  f=1+i*step;lo=math.floor(f);s.frame_set(lo,subframe=f-lo);bpy.context.view_layer.update()
  bw=[brow.data.shape_keys.key_blocks[k].value for k in ("blink_left","blink_right")]
  sw=[body.data.shape_keys.key_blocks[k].value for k in ("blink_left","blink_right")]
  assert max(abs(a-b) for a,b in zip(bw,sw))<1e-6
  dg=bpy.context.evaluated_depsgraph_get();bt=tree(brow,dg)
  hits={k:len(bt.overlap(tree(o,dg))) for k,o in (("skin",body),("eyes",eyes),("head_cover",cover))}
  rows.append({"frame":f,"blink":bw,"overlap_pairs":hits})
 bad=[r for r in rows if any(r["overlap_pairs"].values())]
 results.append({"name":name,"rows":rows,"bad":bad})
 print("W28T_REIMPORT",name,len(rows),"bad",len(bad),"max",{k:max(r["overlap_pairs"][k] for r in rows) for k in ("skin","eyes","head_cover")},flush=True)
report={"status":"ART_HOLD_W28T_FOCUSED_BROW_AUDIT","actor_sha256":m["glb_sha256"],"source_sha256":m["source_sha256"],"clips":results}
p=root/"w28t-brow-audit.json";assert not p.exists();p.write_text(json.dumps(report,indent=2),encoding="utf8")
assert all(not c["bad"] for c in results),"Eyebrow overlap detected"
print("W28T_FOCUSED_AUDIT_PASS",sum(len(c["rows"]) for c in results),flush=True)
