"""W34c offline volume-preserving skinning experiment. No asset mutation."""
import os,runpy,json,math
from pathlib import Path
from mathutils import Quaternion
# Reuse exact W34b stance, pose replay and full clearance checker.
os.environ["HOREB_W34A_IK"]="audit"
os.environ["HOREB_W34B_HINGE"]="1"
os.environ["HOREB_W34A_STANCE_X"]="-.52"
os.environ["HOREB_W34B_DIAG"]="1"
ns=runpy.run_path(str(Path(__file__).with_name("probe_w34a_stance.py")))
rig,body,meshes,good,bones,baseline,full= [ns[k] for k in ("rig","body","meshes","good","bones","baseline","full")]
import bpy
tunic=next(o for o in meshes if o.name=="W28e_tailored_linen")
def modifier(o):return next(m for m in o.modifiers if m.type=="ARMATURE" and m.object==rig)
bm,tm=modifier(body),modifier(tunic)
assert not bm.use_deform_preserve_volume and not tm.use_deform_preserve_volume
def score(a):return sum([a["skin_pairs"],*a["skin_cloth"].values(),*a["cloth_self"].values(),*a["garment_pairs"].values()])+1000000*len(a["prop_hits"])
rows=[]
for i,row in enumerate(good):
 for n,q in (row["left"]["quats"]|row["right"]["quats"]).items():bones[n].rotation_quaternion=Quaternion(q)
 for b,t in ((False,False),(True,False),(False,True),(True,True)):
  bm.use_deform_preserve_volume=b;tm.use_deform_preserve_volume=t
  bpy.context.view_layer.update()
  a=full();rows.append({"pose_index":i,"body_dq":b,"tunic_dq":t,"audit":a,"score":score(a)})
for mode in ((False,False),(True,False),(False,True),(True,True)):
 subset=[r for r in rows if (r["body_dq"],r["tunic_dq"])==mode];best=min(subset,key=lambda r:r["score"])
 print("W34C_DQ",json.dumps({"mode":mode,"count":len(subset),"clear":sum(r["score"]==0 for r in subset),"best":best}),flush=True)
out=Path(os.environ["HOREB_W34A_OUTPUT"])
(out/"w34c-volume-screen.json").write_text(json.dumps({"status":"ART_HOLD_OFFLINE_DQ_SCREEN","rows":rows,"limitations":["Blender preserve-volume is not the glTF linear skinning runtime.","No export, motion, grasp or asset changes."]},indent=2))
bm.use_deform_preserve_volume=False;tm.use_deform_preserve_volume=False
