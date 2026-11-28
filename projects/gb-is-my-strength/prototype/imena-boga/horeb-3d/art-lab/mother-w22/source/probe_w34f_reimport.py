"""Reimport actual W34f GLB and replay the exact static pose with both morphs."""
import os,runpy,json,hashlib
from pathlib import Path
import bpy
from mathutils import Quaternion
# Replay the existing checker through its explicit candidate import seam.
root=Path(os.environ["HOREB_W31F_OUTPUT"]);out=Path(os.environ["HOREB_W34F_OUTPUT"]);probe=Path(os.environ["HOREB_W34E_OUTPUT"])
asset=out/"w34f-actor.glb";m=json.loads((out/"w34f-manifest.json").read_text())
assert hashlib.sha256(asset.read_bytes()).hexdigest()==m["glb_sha256"]
os.environ.update(HOREB_W34A_IK="audit",HOREB_W34B_HINGE="1",HOREB_W34A_STANCE_X="-.52",HOREB_W34B_DIAG="0")
ns=runpy.run_path(str(Path(__file__).with_name("probe_w34a_stance.py")),init_globals={"candidate_asset":asset})
rig,body,meshes,good,bones,full,eval_mesh=[ns[k] for k in ("rig","body","meshes","good","bones","full","eval_mesh")]
tunic=next(o for o in meshes if o.name=="W28e_tailored_linen")
for n,q in (good[0]["left"]["quats"]|good[0]["right"]["quats"]).items():bones[n].rotation_quaternion=Quaternion(q)
bpy.context.view_layer.update()
keys=[]
for o in (body,tunic):
 k=o.data.shape_keys.key_blocks["W34e_JointPoseCorrective"];assert abs(k.value)<1e-8
 # Detach weight animation only for the manual static pose test.
 o.data.shape_keys.animation_data_clear();keys.append(k)
bpy.context.view_layer.update()
base=full();assert base["skin_pairs"]==118 and sum(base["cloth_self"].values())==4
for k in keys:k.value=1
bpy.context.view_layer.update();result=full()
assert not result["skin_pairs"] and not result["prop_hits"] and not any(result["skin_cloth"].values()) and not any(result["cloth_self"].values()) and not any(result["garment_pairs"].values()),result
for k in keys:k.value=0
bpy.context.view_layer.update();assert full()==base
(out/"w34f-static-reimport.json").write_text(json.dumps({"glb_sha256":m["glb_sha256"],"baseline":base,"corrected":result,"weight_zero_restored":True},indent=2))
print("W34F_REIMPORT_PASS",json.dumps(result),flush=True)
