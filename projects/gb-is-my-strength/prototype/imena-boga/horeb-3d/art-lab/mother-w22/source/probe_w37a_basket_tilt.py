"""W37a: contact-preserving basket tilt/slide layout screen, not action animation."""
import argparse,json,math
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry,merged
from probe_w34r_static_correction import contacts,deadline

def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);p.add_argument('--settled',action='store_true');args=p.parse_args()
 root=args.evidence;out=args.output;assert not out.exists()
 m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text());h,ha=load(root/'W28-house-20261125/w28-house.glb',m['house_sha256']);hg,_=geometry(h,ha,drop=m['basket_support']['analytic_settle_delta_m'])
 basket=merged([z for z in hg.values() if z['basket']]);table=hg['Coarse_work_surface'];base=hg['Basket_W26_closed_woven_base']
 low=base['v'].min(0);high=base['v'].max(0);tl=table['v'].min(0);th=table['v'].max(0)
 pivot=np.array([.35,th[1],low[2]])
 def transform(angle,slide):
  q=R.from_rotvec(np.array([-math.radians(angle),0,0])).as_matrix();s=pivot-q@pivot+[0,0,slide]
  if args.settled:
   # The base bevel makes the AABB corner a false pivot. Settle the
   # actual transformed lowest basket vertex to a 10um numerical gap.
   s[1]+=th[1]+.00001-(basket['v']@q.T+s)[:,1].min()
  return q,s
 rows=[]
 for angle in (0,10,15,20,25):
  for slide in (0,.08,.14,.18):
   deadline();q,s=transform(angle,slide);v=basket['v']@q.T+s;bb=dict(basket,v=v)
   near=v[(v[:,0]>=tl[0])&(v[:,0]<=th[0])&(v[:,2]>=tl[2])&(v[:,2]<=th[2])]
   z=base['v']@q.T+s
   # Count approximate table-support vertices, not load or stability.
   lowbase=z[:,1].min();floor_pen=max(0.,th[1]-near[:,1].min())
   possible=np.flatnonzero((z[:,1]<=th[1]+.0001)&(z[:,0]>=tl[0])&(z[:,0]<=th[0])&(z[:,2]>=tl[2])&(z[:,2]<=th[2]))
   # Space under front bottom vertices: closest to front of original base and below 1mm above original bottom.
   front=base['v'][(base['v'][:,1]<low[1]+.001)&(base['v'][:,2]>high[2]-.03)]
   front=front@q.T+s
   collisions={}
   for name,g in hg.items():
    if g['basket']:continue
    if np.any((g['v'].max(0)<v.min(0)-1e-8)|(g['v'].min(0)>v.max(0)+1e-8)):continue
    bt=g['v'][g['tri']];mask=np.all((bt.min(1)<=v.max(0)+1e-8)&(bt.max(1)>=v.min(0)-1e-8),axis=1)
    if mask.any():
     hit=contacts(bb,dict(g,tri=g['tri'][mask],region=g['region'][mask]),np.arange(len(bb['tri'])))['pairs']
     if hit:collisions[name]=hit
   row={'angle_deg':angle,'slide_mm':slide*1000,'rotation':q.tolist(),'translation':s.tolist(),'base_support_vertices':len(possible),'min_base_height_mm':float((lowbase-th[1])*1000),'table_penetration_proxy_mm':float(floor_pen*1000),'front_underside_clearance_mm':[float((front[:,1].min()-th[1])*1000),float((front[:,1].max()-th[1])*1000)],'front_base_z_range': [float(front[:,2].min()),float(front[:,2].max())],'crossings':collisions,'gate':bool(not collisions and floor_pen<1e-6 and len(possible)>0)}
   rows.append(row);print(json.dumps(row),flush=True)
 result={'status':'ART_HOLD_TILTED_SUPPORT_LAYOUT','house_sha256':m['house_sha256'],'settled':args.settled,'numerical_gap_mm':.01 if args.settled else None,'table_bounds':[tl.tolist(),th.tolist()],'base_bounds':[low.tolist(),high.tolist()],'pivot':pivot.tolist(),'rows':rows,'limitations':['Rigid basket hypothetical static layouts, not an animation or physical stability certificate. Proper crossings exclude coplanar contact; support vertex count is only geometric witness. No actor evaluated.']}
 out.write_text(json.dumps(result,indent=2));print('SUMMARY',json.dumps({'samples':len(rows),'passes':sum(z['gate'] for z in rows)}))
if __name__=='__main__':main()
