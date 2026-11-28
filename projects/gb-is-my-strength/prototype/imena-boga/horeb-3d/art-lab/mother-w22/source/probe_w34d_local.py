"""W34d: isolated post-skin local smoothing screen, no GLB or source edits."""
import os,runpy,json
from pathlib import Path
from mathutils import Quaternion
from mathutils.bvhtree import BVHTree
import bpy
os.environ.update(HOREB_W34A_IK="audit",HOREB_W34B_HINGE="1",HOREB_W34A_STANCE_X="-.52",HOREB_W34B_DIAG="1")
ns=runpy.run_path(str(Path(__file__).with_name("probe_w34a_stance.py")))
rig,body,meshes,good,bones,full,eval_mesh,region,face_sets,pad_dist=[ns[k] for k in ("rig","body","meshes","good","bones","full","eval_mesh","region","face_sets","pad_dist")]
tunic=next(o for o in meshes if o.name=="W28e_tailored_linen")
def score(a):return sum([a["skin_pairs"],*a["skin_cloth"].values(),*a["cloth_self"].values(),*a["garment_pairs"].values()])+1000000*len(a["prop_hits"])
def pose(row):
 for n,q in (row["left"]["quats"]|row["right"]["quats"]).items():bones[n].rotation_quaternion=Quaternion(q)
 bpy.context.view_layer.update()
pose(good[0])
initial=full();assert initial["skin_pairs"]==118 and sum(initial["cloth_self"].values())==4
def seeds(o):
 pts,fs=eval_mesh(o);t=BVHTree.FromPolygons(pts,fs)
 if o==body:
  at=BVHTree.FromPolygons(pts,[fs[i] for i in region])
  pairs={(region[i],j) for i,j in at.overlap(t) if region[i]!=j and not face_sets[region[i]]&face_sets[j]}
 else:
  sets=list(map(set,fs));pairs={(i,j) for i,j in t.overlap(t) if i<j and not sets[i]&sets[j]}
 return {v for i,j in pairs for f in (fs[i],fs[j]) for v in f}
def mask(o,seed,rings):
 # Exact duplicate positions with matching original weights share graph nodes,
 # sharing the mask; actual posed seam separation is measured separately.
 key={};ids=[]
 for v in o.data.vertices:
  k=(tuple(v.co),tuple(sorted((g.group,float(g.weight)) for g in v.groups if g.weight!=0)))
  ids.append(key.setdefault(k,len(key)))
 adj=[set() for _ in key]
 for ed in o.data.edges:
  a,b=[ids[v] for v in ed.vertices];adj[a].add(b);adj[b].add(a)
 distance={ids[v]:0 for v in seed};front=set(distance)
 for i in range(1,rings+1):
  front={v for u in front for v in adj[u] if v not in distance}
  distance.update({v:i for v in front})
 weights={v:1-distance[k]/(rings+1) for v,k in enumerate(ids) if k in distance}
 return weights
seeds0={o.name:seeds(o) for o in (body,tunic)}
print("W34D_SEEDS",[(k,len(v)) for k,v in seeds0.items()],flush=True)
rows=[]
focused=os.environ.get("HOREB_W34D_FOCUSED")=="1"
original_pts={o.name:eval_mesh(o)[0] for o in (body,tunic)}
def measure(o):
 pts,fs=eval_mesh(o);base=original_pts[o.name]
 ds=[(a-b).length*1000 for a,b in zip(pts,base)]
 same={}
 for v in o.data.vertices:
  k=(tuple(v.co),tuple(sorted((g.group,float(g.weight)) for g in v.groups if g.weight!=0 and g.group<original_group_counts[o.name])))
  same.setdefault(k,[]).append(v.index)
 seams=[(pts[i]-pts[ids[0]]).length*1000 for ids in same.values() for i in ids[1:] if (base[i]-base[ids[0]]).length<1e-6]
 changed=sorted(d for d in ds if d>.0001)
 return {"changed":len(changed),"max_mm":max(ds),"p95_mm":changed[min(len(changed)-1,int(.95*len(changed)))] if changed else 0,"max_coincident_seam_gap_mm":max(seams,default=0)}
original_group_counts={o.name:len(o.vertex_groups) for o in (body,tunic)}
for rings in ((4,) if focused else (2,4,6)):
 groups={};mods={}
 for o in (body,tunic):
  w=mask(o,seeds0[o.name],rings)
  g=o.vertex_groups.new(name="W34d_local_test")
  for i,v in w.items():g.add([i],v,"REPLACE")
  groups[o.name]=g
  m=o.modifiers.new(name="W34d_local_test",type="SMOOTH");m.vertex_group=g.name;mods[o.name]=m
 for repeat in ((20,) if focused else (2,5,10,20)):
  for o in (body,tunic):
   mods[o.name].factor=.5;mods[o.name].iterations=repeat
  bpy.context.view_layer.update()
  a=full();pts,fs=eval_mesh(body)
  row={"rings":rings,"iterations":repeat,"affected":{k:len(mask(o,seeds0[k],rings)) for k,o in ((body.name,body),(tunic.name,tunic))},"audit":a,"pads_mm":{side:pad_dist(pts,side) for side in ("l","r")},"score":score(a)}
  row["displacement"]={o.name:measure(o) for o in (body,tunic)}
  rows.append(row);print("W34D_LOCAL",json.dumps({"rings":rings,"iterations":repeat,"score":row["score"],"skin":a["skin_pairs"],"cloth":sum(a["skin_cloth"].values()),"self":sum(a["cloth_self"].values()),"props":len(a["prop_hits"])}),flush=True)
 for o in (body,tunic):
  o.modifiers.remove(mods[o.name]);o.vertex_groups.remove(groups[o.name])
 bpy.context.view_layer.update()
assert full()==initial
out=Path(os.environ["HOREB_W34A_OUTPUT"])
(out/("w34d-focused-screen.json" if focused else "w34d-local-screen.json")).write_text(json.dumps({"status":"ART_HOLD_LOCAL_POST_SKIN_SCREEN","initial":initial,"rows":rows,"limitations":["Blender-only post-skin smoothing. No accepted asset changes; local displacement and visual quality not yet verified."]},indent=2))
print("W34D_BEST",json.dumps(min(rows,key=lambda r:r["score"])),flush=True)
