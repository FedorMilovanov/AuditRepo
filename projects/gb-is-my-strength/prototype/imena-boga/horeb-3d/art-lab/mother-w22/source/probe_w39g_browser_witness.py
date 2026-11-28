"""Independent CPU vertex witnesses for W39 browser composition."""
import argparse,json
from pathlib import Path
import numpy as np
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry
from probe_w35e_playback import pose,BODY,TUNIC
def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);args=p.parse_args()
 root=args.evidence;f=root/'W39c-approach-20261128';r=json.loads((f/'w38a-assembly.json').read_text());d,a=load(f/'w38a-handoff.glb',r['sha256'])
 h,ha=load(root/'W28-house-20261125/w28-house.glb',r['house_sha256']);hg,_=geometry(h,ha,drop=r['settle_delta_m'])
 rows=[]
 for t in (0.,.6,1.5,2.5,3.5,3.545682,4.1,4.7):
  g,w=geometry(pose(d,a,t),a,True);M=w[r['basket_track_node']]
  result={}
  for k,z in g.items():
   ids=sorted(set([0,len(z['v'])//2,len(z['v'])-1]+([2950,2123] if k==BODY else [11127,11136,11140,11141] if k==TUNIC else [])))
   result[k]=[{'index':i,'xyz':z['v'][i].tolist()} for i in ids]
  basket={}
  for k,z in hg.items():
   if not z['basket']:continue
   ids=sorted(set([0,len(z['v'])-1]))
   basket[k]=[{'index':i,'xyz':(z['v'][i]@M[:3,:3].T+M[:3,3]).tolist()} for i in ids]
  rows.append({'time':t,'actor':result,'basket':basket,'track':M.T.ravel().tolist()})
 out=f/'w39g-browser-witness.json';assert not out.exists();out.write_text(json.dumps({'actor_sha256':r['sha256'],'house_sha256':r['house_sha256'],'rows':rows},separators=(',',':')))
 print('CPU_WITNESS',len(rows),sum(len(z['basket']) for z in rows),out.stat().st_size)
if __name__=='__main__':main()
