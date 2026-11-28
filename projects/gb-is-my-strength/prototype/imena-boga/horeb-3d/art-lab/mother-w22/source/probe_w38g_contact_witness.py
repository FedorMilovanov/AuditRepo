"""W38g: contact facing witness at the actual refined clip, no physical claim."""
import argparse,json
from pathlib import Path
import numpy as np
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry
from probe_w35e_playback import pose,BODY
from probe_w35i_rim_contact import normals,closest
def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('--time',type=float,required=True);args=p.parse_args()
 root=args.evidence;f=root/'W38e-wrist-20261128';r=json.loads((f/'w38a-assembly.json').read_text());d,a=load(f/'w38a-handoff.glb',r['sha256']);d=pose(d,a,args.time);g,w=geometry(d,a,True);body=g[BODY]
 h,ha=load(root/'W28-house-20261125/w28-house.glb',r['house_sha256']);hg,_=geometry(h,ha,drop=r['settle_delta_m']);M=w[r['basket_track_node']]
 n=next(n for n in d['nodes'] if n['name']==BODY);at=d['meshes'][n['mesh']]['primitives'][0]['attributes'];js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=np.array([d['nodes'][i]['name'] for i in d['skins'][n['skin']]['joints']])
 dom=jn[js[np.arange(len(js)),ws.argmax(1)]];_,first=np.unique(body['canon'],return_index=True)
 fn=normals(body['v'],body['tri']);vn=np.zeros((int(body['canon'].max())+1,3))
 for k in range(3):np.add.at(vn,body['canon'][body['tri'][:,k]],fn)
 vn=vn[body['canon']];vn/=np.maximum(np.linalg.norm(vn,axis=1),1e-12)[:,None];vn*=np.sign(np.sum(np.einsum('ij,ij->i',body['v'][body['tri'][:,0]],fn)))
 results={}
 for side,mesh in [('r','Basket_thick_lipped_rim'),('l','Basket_W26_closed_woven_base')]:
  obj=hg[mesh];v=obj['v']@M[:3,:3].T+M[:3,3];t=v[obj['tri']];rn=normals(v,obj['tri']);rn/=np.maximum(np.linalg.norm(rn,axis=1),1e-12)[:,None]
  if side=='l':
   keep=rn@M[:3,1]<-.8;t=t[keep];rn=rn[keep]
  else:
   rn*=np.sign(np.sum(np.einsum('ij,ij->i',v[obj['tri'][:,0]],normals(v,obj['tri']))))
  valid=np.array([k.endswith('_'+side) and k.startswith(('hand_','thumb_','index_','middle_','ring_','pinky_')) for k in jn]);ids=first[np.sum(ws[first]*valid[js[first]],axis=1)>.999]
  rows=[]
  for i in ids:
   x=body['v'][i]
   if np.any((x<t.min(axis=(0,1))-.012)|(x>t.max(axis=(0,1))+.012)):continue
   gap,point,j=closest(x,t);dot=float(vn[i]@rn[j]);signed=float((x-point)@rn[j])
   if gap<=.012 and dot<-.5 and signed>=0:rows.append({'digit':str(dom[i]).split('_')[0],'vertex':int(i),'gap_mm':gap*1000,'normal':rn[j].tolist(),'point':point.tolist()})
  groups={k:{'min_gap_mm':min((z['gap_mm'] for z in rows if z['digit']==k),default=None),'facing_within_5mm':sum(z['digit']==k and z['gap_mm']<=5 for z in rows)} for k in ('hand','thumb','index','middle','ring','pinky')}
  pairs=[]
  if side=='r':
   for th in [z for z in rows if z['digit']=='thumb']:
    for ix in [z for z in rows if z['digit'] in ('index','middle','ring','pinky')]:
     dot=float(np.dot(th['normal'],ix['normal']));sep=float(np.linalg.norm(np.array(th['point'])-ix['point'])*1000)
     if dot<=-.75 and sep<=70:pairs.append({'thumb':th,'support':ix,'dot':dot,'max_gap_mm':max(th['gap_mm'],ix['gap_mm'])})
  results[side]={'groups':groups,'best_opposed_pair':min(pairs,key=lambda z:z['max_gap_mm']) if pairs else None,'opposed_pairs_within_1mm':sum(z['max_gap_mm']<=1 for z in pairs),'facing_vertices_within_5mm':sum(z['gap_mm']<=5 for z in rows)}
 print(json.dumps({'time':args.time,'sha256':r['sha256'],'results':results,'limitations':['Vertex-to-surface distances and facing normals only; not force closure, solid containment or continuous contact.']}))
if __name__=='__main__':main()
