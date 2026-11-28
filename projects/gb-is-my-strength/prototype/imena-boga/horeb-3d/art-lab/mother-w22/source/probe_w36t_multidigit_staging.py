"""W36t: multi-digit rim staging screen. Rigid isolated hand, not a rig or grasp."""
import argparse,json,math,hashlib
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R
from scipy.spatial import cKDTree
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry,merged,point_triangle_min
from probe_w34r_static_correction import contacts,deadline
from probe_w35e_playback import pose,BODY
from probe_w35i_rim_contact import normals

def unit(v):return v/np.maximum(np.linalg.norm(v,axis=-1,keepdims=True),1e-12)

def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);p.add_argument('--shape',choices=('W36m','-15.0','-22.5','-30.0'),required=True);p.add_argument('--local',action='store_true');args=p.parse_args();assert not args.local or args.shape=='W36m'
 root=args.evidence;out=args.output;assert not out.exists()
 f=root/'W36m-closure-20261128';r=json.loads((f/'w36m-assembly.json').read_text());d,a=load(f/'w36m-approach-closure.glb',r['sha256']);d=pose(d,a,3.15);g,w=geometry(d,a,True)
 rr=json.loads((root/'W36q-s-wrap-20261128/w36q-s-wrap.json').read_text());assert rr['source_sha256']==r['sha256']
 m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text());h,ha=load(root/'W28-house-20261125/w28-house.glb',m['house_sha256']);hg,_=geometry(h,ha,drop=m['basket_support']['analytic_settle_delta_m'])
 basket=merged([z for z in hg.values() if z['basket']]);bt=basket['v'][basket['tri']];bc=bt.mean(1);br=np.linalg.norm(bt-bc[:,None],axis=2).max(1);tree=cKDTree(bc)
 def nearest(pt):
  _,j=tree.query(pt,workers=1);ub=point_triangle_min(pt,bt[j:j+1]);jj=np.array(tree.query_ball_point(pt,ub+br.max()+1e-10,workers=1),int)
  jj=jj[np.linalg.norm(bc[jj]-pt,axis=1)-br[jj]<=ub+1e-10]
  return point_triangle_min(pt,bt[jj])
 names={n['name']:i for i,n in enumerate(d['nodes'])};n=d['nodes'][names[BODY]];at=d['meshes'][n['mesh']]['primitives'][0]['attributes']
 js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=np.array([d['nodes'][i]['name'] for i in d['skins'][n['skin']]['joints']])
 dom=jn[js[np.arange(len(js)),ws.argmax(1)]]
 hm=np.array([n.endswith('_l') and n.startswith(('hand_','thumb_','index_','middle_','ring_','pinky_')) for n in jn])
 mask=np.sum(ws*hm[js],axis=1)>.999
 ids=np.flatnonzero(mask);faces=np.flatnonzero(np.all(mask[g[BODY]['tri']],axis=1));_,first=np.unique(g[BODY]['canon'][ids],return_index=True);unique=ids[first]
 wrist=w[names['hand_l']][:3,3];shoulder=w[names['upperarm_l']][:3,3];elbow=w[names['lowerarm_l']][:3,3];length=np.linalg.norm(wrist-elbow)+np.linalg.norm(elbow-shoulder)
 shapes=[('W36m',{})]+[(str(v['angles_deg']['middle']),v['rotations']) for v in rr['reverse_screen']['rows'] if len(v['angles_deg'])==3 and v['gate']]
 # Actual ellipse from source. Proxy only, exact triangle audit for finalists.
 def tube(v):
  x=(v[...,0]-.35)/.474;z=(v[...,2]-.26)/.325;s=np.sqrt(x*x+z*z)
  grad=np.sqrt((x/.474)**2+(z/.325)**2)/np.maximum(s,1e-9)
  radial=(s-1)/np.maximum(grad,1e-9)
  return np.sqrt(radial**2+(v[...,1]-1.147)**2)
 rows=[];count=0
 shapes=[z for z in shapes if z[0]==args.shape];assert len(shapes)==1,shapes
 import copy
 for label,rots in shapes:
  doc=dict(d,nodes=copy.deepcopy(d['nodes']))
  for k,v in rots.items():doc['nodes'][names[k]]['rotation']=v
  gg,ww=geometry(doc,a,True);body=gg[BODY]
  p0=ww[names['hand_l']][:3,3]
  forward=unit(ww[names['middle_01_l']][:3,3]-p0)
  across=ww[names['index_01_l']][:3,3]-ww[names['pinky_01_l']][:3,3];across=unit(across-forward*(across@forward))
  frame=np.column_stack((forward,across,np.cross(forward,across)))
  full=body['v'][unique]-p0;proxy=full[::5]
  digits=('thumb','index','middle','ring','pinky')
  groups=[]
  for digit in digits:
   sel=unique[np.array([z.startswith(digit+'_') and not z.startswith(digit+'_01') for z in dom[unique]])]
   assert len(sel)
   groups.append(body['v'][sel[::max(1,len(sel)//30)]]-p0)
  allpoints=np.concatenate([proxy]+groups);sizes=[len(proxy)]+[len(z) for z in groups]
  splits=np.cumsum(sizes)
  ranked=[]
  for sector in (() if args.local else (110,125,140,155)):
   th=math.radians(sector);center=np.array([.35+.474*math.cos(th),1.147,.26+.325*math.sin(th)])
   radial=unit(np.array([math.cos(th)/.474,0,math.sin(th)/.325]));tangent=unit(np.cross([0,1,0],radial));up=np.array([0,1,0])
   # Wrist outside basket, knuckle line along rim; search pitch and axial roll.
   for pitch in (-45,-25,-5,15,35,55):
    fwd=-radial*math.cos(math.radians(pitch))+up*math.sin(math.radians(pitch))
    for sign in (-1,1):
     for roll in (-30,0,30):
      acc=R.from_rotvec(fwd*math.radians(roll)).apply(tangent*sign)
      rot=np.column_stack((fwd,acc,np.cross(fwd,acc)))@frame.T
      assert np.linalg.det(rot)>.99999
      pts=allpoints@rot.T
      offsets=np.array([center+radial*x+up*y+tangent*z for x in (.035,.055,.075,.095,.115) for y in (-.03,-.01,.01,.03,.05) for z in (-.02,0,.02)])
      reserve=(length-np.linalg.norm(offsets-shoulder,axis=1))*1000
      dist=tube(pts[None]+offsets[:,None])*1000-26
      pen=np.maximum(0,-dist[:,:splits[0]])
      gap=np.stack([np.min(np.abs(dist[:,splits[i]:splits[i+1]]),axis=1) for i in range(5)],axis=1)
      cost=1.5*pen.max(1)**2+2*np.mean(pen**2,axis=1)+np.mean(gap**2,axis=1)+.3*np.max(gap,axis=1)**2
      cost[reserve<8]=np.inf;count+=len(offsets)
      for k in np.argsort(cost)[:2]:
       if np.isfinite(cost[k]):ranked.append((float(cost[k]),rot,offsets[k]-rot@p0,float(reserve[k]),sector,pitch,roll,sign,gap[k].tolist()))
  if args.local:
   f0=root/'W36t-shape-0-20261128.json'
   prior=json.loads(f0.read_text()) if f0.exists() else json.loads((root/'W36t-w-multidigit-20261128/w36t-w-multidigit.json').read_text())['screens'][0]
   assert prior['source_sha256']==r['sha256']
   seeds=sorted(prior['rows'],key=lambda z:(z['crossings'],z['score']))[:4]
   ranked=[];count=0
   for seed in seeds:
    rot=np.array(seed['rotation']);shift=np.array(seed['translation']);origin=rot@p0+shift
    th=math.radians(seed['sector_deg']);radial=unit(np.array([math.cos(th)/.474,0,math.sin(th)/.325]));tangent=unit(np.cross([0,1,0],radial));up=np.array([0,1,0])
    # Small local translation grid, rank with ALL unique hand vertices.
    pp=full@rot.T+origin;gp=np.concatenate(groups)@rot.T+origin
    limits=np.cumsum([len(z) for z in groups]);candidates=[]
    for dx in (-.006,0,.006,.012):
     for dy in (-.006,0,.006,.012,.018):
      for dz in (-.006,0,.006):
       off=radial*dx+up*dy+tangent*dz;reserve=(length-np.linalg.norm(origin+off-shoulder))*1000
       count+=1
       if reserve<8:continue
       dist=tube(pp+off)*1000-26
       gaps=tube(gp+off)*1000-26
       gap=[float(np.min(np.abs(z))) for z in np.split(gaps,limits[:-1])]
       # Strongly penalize estimated penetration; proxy is not a certificate.
       pen=max(0.,-float(dist.min()));score=100*pen**2+float(np.mean(np.square(gap)))+.3*max(gap)**2
       candidates.append((score,rot,shift+off,reserve,seed['sector_deg'],seed['pitch_deg'],seed['roll_deg'],seed['across_sign'],gap))
    ranked.extend(sorted(candidates,key=lambda z:z[0])[:4])
  ranked.sort(key=lambda z:z[0]);checked=[]
  for cost,rot,shift,reserve,sector,pitch,roll,sign,gap in ranked[:16]:
   deadline();v=body['v'].copy();v[ids]=v[ids]@rot.T+shift
   hand=dict(body,v=v,tri=body['tri'][faces],region=body['region'][faces]);tt=v[hand['tri']];lo=tt.min(axis=(0,1));hi=tt.max(axis=(0,1))
   keep=np.all((bt.min(1)<=hi+1e-8)&(bt.max(1)>=lo-1e-8),axis=1)
   hit=contacts(hand,dict(basket,tri=basket['tri'][keep],region=basket['region'][keep]),np.arange(len(faces))) if keep.any() else {'pairs':0,'target_regions':{}}
   exact={}
   for digit in digits:
    sel=unique[np.array([z.startswith(digit+'_') and not z.startswith(digit+'_01') for z in dom[unique]])]
    if hit['pairs']==0:exact[digit]=min(nearest(v[i])*1000 for i in sel)
    else:exact[digit]=None
   checked.append({'shape':label,'score':cost,'crossings':hit['pairs'],'by_mesh':hit['target_regions'],'gaps_mm':exact,'proxy_gaps_mm':gap,'reserve_mm':reserve,'sector_deg':sector,'pitch_deg':pitch,'roll_deg':roll,'across_sign':sign,'rotation':rot.tolist(),'translation':shift.tolist()})
  rows.extend(checked)
  print(json.dumps({'shape':label,'checked':len(checked),'best':min(checked,key=lambda z:(z['crossings'],max(z['gaps_mm'].values()) if z['crossings']==0 else z['score']))}),flush=True)
 result={'status':'ART_HOLD_MULTIDIGIT_RIGID_SCREEN','source_sha256':r['sha256'],'shape':args.shape,'local':args.local,'candidates':count,'rows':rows,'limitations':['Rigid fully hand-weighted subset, exact proper intersections with basket only. Tube proxy ranking; no arm connection, containment, contact orientation, or physical support.']}
 out.write_text(json.dumps(result,indent=2));print('SUMMARY',json.dumps({'candidates':count,'exact':len(rows),'clear':sum(z['crossings']==0 for z in rows),'best':min(rows,key=lambda z:(z['crossings'],max(z['gaps_mm'].values()) if z['crossings']==0 else z['score']))}),flush=True)
if __name__=='__main__':main()
