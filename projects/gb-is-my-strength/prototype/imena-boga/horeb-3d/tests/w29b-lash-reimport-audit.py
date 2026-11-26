"""Independent W29b eyelash overlay audit after GLB import.
This is a focused supplement to the W28r full actor audit, not a new full-actor clearance certificate.
"""
import bpy,os,json,hashlib,math
from pathlib import Path
from mathutils.bvhtree import BVHTree
root=Path(os.environ["HOREB_W29B_OUTPUT"]);base=Path(os.environ["HOREB_W29A_OUTPUT"])
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
m=json.loads((root/"w29b-manifest.json").read_text(encoding="utf8"))
assert sha(root/"w29b-actor.glb")==m["glb_sha256"]=="8f11fc78285d4aece03b94554967f4deb3ad191b6a01055784f6a08e16a2c8d1"
assert sha(base/"w29a-actor.glb")==m["source_sha256"] and m["existing_actor_unchanged"] is True
assert m["strand_count"]==44 and len(m["trials"])==55 and all(t["overlap_pairs"]==[0]*4 for t in m["trials"])
compact=os.environ.get("HOREB_W29C_OUTPUT")
asset=root/"w29b-actor.glb"
if compact:
 prior=root
 root=Path(compact)
 cm=json.loads((root/"w29c-manifest.json").read_text(encoding="utf8"))
 assert cm["status"]=="ART_HOLD_W29C_LOSSLESS_COMPACT_TRIAL" and cm["source_sha256"]==m["glb_sha256"]
 assert cm["source_lash_audit_sha256"]==sha(prior/"w29b-lash-audit.json")
 assert cm["accessors_byte_identical"]==305 and cm["active_material_graphs_identical"]==9 and cm["all_other_json_identical_after_remap"] is True
 asset=root/"w29c-actor.glb"
 assert sha(asset)==cm["glb_sha256"]=="0d11d1b64a7b23b60fc1833d82bd938038f43c6369116ed9ac393b7cfa75ea94" and asset.stat().st_size==cm["glb_bytes"]

bpy.ops.wm.read_factory_settings(use_empty=True);s=bpy.context.scene;s.render.fps=24
bpy.ops.import_scene.gltf(filepath=str(asset),merge_vertices=True)
rig=next(o for o in bpy.data.objects if o.type=="ARMATURE");assert len(rig.data.bones)==53
meshes=[o for o in bpy.data.objects if o.type=="MESH" and o.parent==rig]
assert len(meshes)==9,[(o.name,o.data.name) for o in meshes]
body=next(o for o in meshes if o.data.shape_keys and "blink_left" in o.data.shape_keys.key_blocks and len(o.data.vertices)>10000)
brow=next(o for o in meshes if o.data.name.startswith("W28t_CC0_brows"))
lash=next(o for o in meshes if o.data.name.startswith("W29b_CC0_lashes"))
eyes=next(o for o in meshes if o.data.shape_keys and len(o.data.shape_keys.key_blocks)==9)
cover=next(o for o in meshes if o.name=="W22_plain_linen_head_cover")
assert len(brow.data.polygons)==3072 and len(brow.data.vertices)>1500
assert [k.name for k in brow.data.shape_keys.key_blocks]==["Basis","blink_left","blink_right"]
assert len(lash.data.polygons)==132 and len(lash.data.vertices)==220
assert [k.name for k in lash.data.shape_keys.key_blocks]==["Basis","blink_left","blink_right"]
faces=[tuple(p.vertices) for p in lash.data.polygons];sets=list(map(set,faces))
def action(data,name):
 ad=data.animation_data;t=next(t for t in ad.nla_tracks if t.name==name)
 ad.use_nla=False;ad.action=t.strips[0].action;ad.action_slot=t.strips[0].action_slot
def tree(o,dg):
 ob=o.evaluated_get(dg);me=ob.to_mesh();pts=[ob.matrix_world@v.co for v in me.vertices]
 t=BVHTree.FromPolygons(pts,[tuple(p.vertices) for p in me.polygons]);ob.to_mesh_clear();return t
results=[]
for name,count,step in (("Mother_GestureTowardsBasket",417,.25),("Mother_QuietIdle",144,1)):
 for o in (rig,body.data.shape_keys,brow.data.shape_keys,lash.data.shape_keys,eyes.data.shape_keys):action(o,name)
 rows=[]
 for i in range(count):
  f=1+i*step;lo=math.floor(f);s.frame_set(lo,subframe=f-lo);bpy.context.view_layer.update()
  bw=[brow.data.shape_keys.key_blocks[k].value for k in ("blink_left","blink_right")]
  sw=[body.data.shape_keys.key_blocks[k].value for k in ("blink_left","blink_right")]
  assert max(abs(a-b) for a,b in zip(bw,sw))<1e-6
  lw=[lash.data.shape_keys.key_blocks[k].value for k in ("blink_left","blink_right")]
  assert max(abs(a-b) for a,b in zip(lw,sw))<1e-6
  dg=bpy.context.evaluated_depsgraph_get();bt=tree(lash,dg)
  hits={k:len(bt.overlap(tree(o,dg))) for k,o in (("skin",body),("eyes",eyes),("head_cover",cover),("brows",brow))}
  hits["self"]=sum(1 for i,j in bt.overlap(bt) if i<j and not sets[i]&sets[j])
  rows.append({"frame":f,"blink":bw,"overlap_pairs":hits})
 bad=[r for r in rows if any(r["overlap_pairs"].values())]
 results.append({"name":name,"rows":rows,"bad":bad})
 print("W29B_REIMPORT",name,len(rows),"bad",len(bad),"max",{k:max(r["overlap_pairs"][k] for r in rows) for k in ("skin","eyes","head_cover","brows","self")},flush=True)
report={"status":"ART_HOLD_W29B_FOCUSED_LASH_AUDIT","actor_sha256":m["glb_sha256"],"source_sha256":m["source_sha256"],"clips":results}
if compact:
 prior_audit=json.loads((prior/"w29b-lash-audit.json").read_text(encoding="utf8"))
 assert results==prior_audit["clips"],"Compact import differs from original sampled clip"
 report.update({"status":"ART_HOLD_W29C_FOCUSED_LASH_AUDIT","actor_sha256":cm["glb_sha256"],"source_sha256":cm["source_sha256"],"source_rows_identical":True})
p=root/("w29c-lash-audit.json" if compact else "w29b-lash-audit.json");assert not p.exists();p.write_text(json.dumps(report,indent=2),encoding="utf8")
assert all(not c["bad"] for c in results),"Eyelash overlap detected"
print("W29B_FOCUSED_AUDIT_PASS",sum(len(c["rows"]) for c in results),flush=True)
