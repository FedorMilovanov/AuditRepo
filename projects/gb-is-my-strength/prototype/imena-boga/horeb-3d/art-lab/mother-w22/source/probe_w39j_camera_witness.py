"""W39j: measure shot envelopes from exact W39c animated geometry.
No browser, no asset rewrite. Fixed-world envelopes for stable cameras.
"""
import argparse,json
from pathlib import Path
import numpy as np
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry
from probe_w35e_playback import pose,BODY

def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);args=p.parse_args()
 root=args.evidence;f=root/'W39c-approach-20261128';r=json.loads((f/'w38a-assembly.json').read_text());d,a=load(f/'w38a-handoff.glb',r['sha256'])
 h,ha=load(root/'W28-house-20261125/w28-house.glb',r['house_sha256']);hg,_=geometry(h,ha,drop=r['settle_delta_m'])
 audit=json.loads((f/'w39d-playback.json').read_text());assert audit['sha256']==r['sha256']
 times=sorted(set([0.,.6,1.5,2.5,3.5,4.7]+[z['row']['seconds'] for z in audit['samples']]+[min(4.7,float(z['seconds'])) for z in r['keys']]))
 table=np.concatenate([m['v'] for k,m in hg.items() if k=='Coarse_work_surface' or k.startswith('Workshop_wood_support')])
 fixed=np.concatenate([m['v'] for m in hg.values() if not m['basket']])
 names={n['name']:i for i,n in enumerate(d['nodes'])}
 # Fully hand/forearm weighted vertices select the interaction, not the head.
 n=d['nodes'][names[BODY]];at=d['meshes'][n['mesh']]['primitives'][0]['attributes']
 js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=np.array([d['nodes'][i]['name'] for i in d['skins'][n['skin']]['joints']])
 valid=np.array([k.startswith(('lowerarm_','hand_','thumb_','index_','middle_','ring_','pinky_')) for k in jn])
 ids=np.flatnonzero(np.sum(ws*valid[js],axis=1)>.999);assert len(ids)>1000
 bounds={k:[] for k in ('action','hands','house')}
 rows=[]
 def box(v):return [v.min(0).tolist(),v.max(0).tolist()]
 for t in times:
  g,w=geometry(pose(d,a,t),a,True);M=w[r['basket_track_node']]
  actor=np.concatenate([z['v'] for z in g.values()]);basket=np.concatenate([z['v']@M[:3,:3].T+M[:3,3] for z in hg.values() if z['basket']])
  points={'action':np.concatenate([actor,basket,table]),'hands':np.concatenate([g[BODY]['v'][ids],basket]),'house':np.concatenate([actor,basket,fixed])}
  row={'time':t,'bounds':{k:box(v) for k,v in points.items()}}
  rows.append(row)
  for k,v in row['bounds'].items():bounds[k].extend(v)
 env={}
 for k,v in bounds.items():
  b=np.asarray(v);pad=.03 if k!='house' else .08
  env[k]=[np.floor((b.min(0)-pad)*1000).astype(int).tolist(),np.ceil((b.max(0)+pad)*1000).astype(int).tolist()]
 out=f/'w39j-camera-witness.json';assert not out.exists()
 out.write_text(json.dumps({'status':'ART_HOLD_CAMERA_ENVELOPE','actorSha256':r['sha256'],'houseSha256':r['house_sha256'],'times':len(times),'handVertices':len(ids),'envelopeMm':env,'rows':rows,'limitations':'Sampled AABBs with explicit margin; no continuous swept or occlusion proof.'},indent=2))
 print(json.dumps({'times':len(times),'handVertices':len(ids),'envelopeMm':env}),flush=True)
if __name__=='__main__':main()
