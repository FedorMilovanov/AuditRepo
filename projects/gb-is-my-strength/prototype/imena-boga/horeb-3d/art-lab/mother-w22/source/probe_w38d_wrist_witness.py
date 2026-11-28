"""W38d: diagnose basket-relative right hand error on exported interpolation."""
import argparse,json
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R
from probe_w34l_foot_surface import load,world
from probe_w34t_whole_scene import geometry,merged
from probe_w34r_static_correction import contacts
from probe_w35e_playback import pose,BODY

def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('--time',type=float,required=True);args=p.parse_args()
 root=args.evidence;f=root/'W38a-handoff-20261128';r=json.loads((f/'w38a-assembly.json').read_text())
 d,a=load(f/'w38a-handoff.glb',r['sha256']);d=pose(d,a,args.time);g,w=geometry(d,a,True)
 m=root/'W36m-closure-20261128';q=json.loads((m/'w36m-assembly.json').read_text());o,oa=load(m/'w36m-approach-closure.glb',q['sha256']);o=pose(o,oa,q['duration_s']);ow=world(o,o['nodes'])
 h,ha=load(root/'W28-house-20261125/w28-house.glb',r['house_sha256']);hg,_=geometry(h,ha,drop=r['settle_delta_m'])
 T=w[r['basket_track_node']];b=merged([dict(z,v=z['v']@T[:3,:3].T+T[:3,3]) for z in hg.values() if z['basket']])
 names={n['name']:i for i,n in enumerate(d['nodes'])};on={n['name']:i for i,n in enumerate(o['nodes'])}
 key='hand_r';i=names[key];target=T@ow[on[key]];parent=next(j for j,n in enumerate(d['nodes']) if i in n.get('children',[]))
 local=np.linalg.inv(w[parent])@target
 delta=local[:3,3]-np.array(d['nodes'][i]['translation']);angle=float(np.degrees(R.from_matrix(w[i][:3,:3].T@target[:3,:3]).magnitude()))
 def check(g):
  body=g[BODY];at=body['v'][body['tri']];lo=b['v'].min(0);hi=b['v'].max(0)
  active=np.flatnonzero(np.all((at.min(1)<=hi+1e-8)&(at.max(1)>=lo-1e-8),axis=1))
  return contacts(body,b,active,include_pairs=True)
 before=check(g)
 # Diagnostic constraint only: tiny local wrist translation and rotation
 # to match the actual basket track, never silently change rest bone length.
 d['nodes'][i]['translation']=local[:3,3].tolist();d['nodes'][i]['rotation']=R.from_matrix(local[:3,:3]).as_quat().tolist()
 gg,ww=geometry(d,a,True);after=check(gg)
 out={'time':args.time,'wrist_world_error_mm':float(np.linalg.norm(w[i][:3,3]-target[:3,3])*1000),'local_translation_delta_mm':float(np.linalg.norm(delta)*1000),'rotation_error_deg':angle,'before':before,'after':after,'max_body_vertex_move_mm':float(np.linalg.norm(g[BODY]['v']-gg[BODY]['v'],axis=1).max()*1000),'limitations':['Diagnostic wrist constraint applied in memory; no full actor or export acceptance.']}
 print(json.dumps(out),flush=True)
if __name__=='__main__':main()
