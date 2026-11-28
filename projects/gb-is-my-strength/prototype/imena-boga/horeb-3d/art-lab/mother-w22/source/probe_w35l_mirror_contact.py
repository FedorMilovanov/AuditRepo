"""W35l: mirror a collision-free oriented left hand using actual right anatomy."""
import argparse,json
from pathlib import Path
import numpy as np
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry,merged
from probe_w34r_static_correction import contacts,deadline
from probe_w35i_rim_contact import normals,closest
def unit(v):return v/np.maximum(np.linalg.norm(v,axis=-1,keepdims=True),1e-12)
def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);args=p.parse_args()
 root=args.evidence;out=args.output;assert not out.exists()
 left=json.loads((root/'W35k-cross-section-l-20261127.json').read_text())
 f=root/'W34s-sleeve-correction-20261127';r=json.loads((f/'w34s-report.json').read_text());d,a=load(f/'w34s-static-actor.glb',r['glb_sha256']);g,w=geometry(d,a,True)
 m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text());h,ha=load(root/'W28-house-20261125/w28-house.glb',m['house_sha256']);hg,_=geometry(h,ha,drop=m['basket_support']['analytic_settle_delta_m'])
 body=g['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0'];names={n['name']:i for i,n in enumerate(d['nodes'])}
 node=d['nodes'][names['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0']];at=d['meshes'][node['mesh']]['primitives'][0]['attributes']
 js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=np.array([d['nodes'][i]['name'] for i in d['skins'][node['skin']]['joints']]);dom=jn[js[np.arange(len(js)),ws.argmax(1)]]
 fn=normals(body['v'],body['tri']);vn=np.zeros((int(body['canon'].max())+1,3))
 for k in range(3):np.add.at(vn,body['canon'][body['tri'][:,k]],fn)
 vn=unit(vn[body['canon']]);vn*=np.sign(np.sum(np.einsum('ij,ij->i',body['v'][body['tri'][:,0]],fn)))
 rim=hg['Basket_thick_lipped_rim'];rt=rim['v'][rim['tri']];rn=unit(normals(rim['v'],rim['tri']))
 basket=merged([v for v in hg.values() if v['basket']]);bt=basket['v'][basket['tri']]
 pref=('hand_','thumb_','index_','middle_','ring_','pinky_')
 jj=np.array([n.endswith('_r') and n.startswith(pref) for n in jn])
 mask=np.sum(ws*jj[js],axis=1)>.999;ids=np.flatnonzero(mask);faces=np.flatnonzero(np.all(mask[body['tri']],axis=1))
 wr=w[names['hand_r']][:3,3];sh=w[names['upperarm_r']][:3,3];el=w[names['lowerarm_r']][:3,3];length=np.linalg.norm(sh-el)+np.linalg.norm(el-wr);sh=sh+[0,0,.160]
 F=np.diag([-1.,1.,1.]);keys=[n[:-1] for n in names if n.startswith(pref) and n.endswith('_l') and n[:-1]+'r' in names]
 P=np.stack([w[names[k+'r']][:3,3] for k in keys]);Q=np.stack([F@w[names[k+'l']][:3,3] for k in keys])
 U,S,Vt=np.linalg.svd((P-P.mean(0)).T@(Q-Q.mean(0)));K=Vt.T@np.diag([1,1,np.linalg.det(Vt.T@U.T)])@U.T;D=Q.mean(0)-K@P.mean(0)
 align=np.linalg.norm(P@K.T+D-Q,axis=1)*1000
 def evaluate(rot,shift,pair):
  deadline();v=body['v'].copy();v[ids]=v[ids]@rot.T+shift
  hand=dict(body,v=v,tri=body['tri'][faces],region=body['region'][faces]);hv=v[hand['tri']];lo=hv.min(axis=(0,1));hi=hv.max(axis=(0,1))
  keep=np.all((bt.min(1)<=hi+1e-8)&(bt.max(1)>=lo-1e-8),axis=1)
  audit=contacts(hand,dict(basket,tri=basket['tri'][keep],region=basket['region'][keep]),np.arange(len(hand['tri'])))
  rr=[]
  for i in pair:
   dist,point,k=closest(v[i],rt);rr.append({'vertex':int(i),'joint':str(dom[i]),'gap_mm':dist*1000,'normal':rn[k].tolist(),'skin_facing_dot':float((rot@vn[i])@rn[k])})
  dot=float(np.dot(rr[0]['normal'],rr[1]['normal']));reserve=float((length-np.linalg.norm(rot@wr+shift-sh))*1000)
  return {'crossings':audit['pairs'],'by_mesh':audit['target_regions'],'contacts':rr,'opposition_dot':dot,'angle_deg':float(np.degrees(np.arccos(np.clip(dot,-1,1)))),'reserve_mm':reserve,'passes':bool(audit['pairs']==0 and reserve>=5 and dot<=-.75 and all(q['gap_mm']<=3 and q['skin_facing_dot']<=-.5 for q in rr)),'rotation':rot.tolist(),'translation':shift.tolist()}
 clear=[q for q in left['shapes'][1]['rows'] if q['crossings']==0];assert clear
 rows=[]
 for q in clear:
  rot=np.array(q['rotation']);shift=np.array(q['translation']);match=[]
  for i in q['skin_vertices']:
   region=ids[dom[ids]==str(dom[i])[:-1]+'r'];assert len(region)
   match.append(int(region[np.argmin(np.linalg.norm(body['v'][region]@K.T+D-F@body['v'][i],axis=1))]))
  rr=F@rot@F@K;ss=F@(rot@F@D+shift)+[.7,0,0]
  assert np.linalg.det(rr)>.99999
  for delta in ([0,0,0],[0,.002,0],[0,0,.002],[0,.002,.002],[.002,0,0],[-.002,0,0],[0,.004,0],[0,0,.004]):
   row=evaluate(rr,ss+delta,match);row['left_source_pair']=q['skin_vertices'];row['delta_mm']=(np.array(delta)*1000).tolist();rows.append(row)
 result={'status':'ART_HOLD_RIGID_CONTACT_WITNESS','source_sha256':r['glb_sha256'],'mirror_alignment_max_mm':float(align.max()),'mirror_alignment_rms_mm':float(np.sqrt(np.mean(align**2))),'right':rows,'limitations':['Rigid fully hand-weighted subset, no full actor or containment. Geometric opposed proximity, not physical grip.']}
 out.write_text(json.dumps(result,indent=2));print(json.dumps({'checked':len(rows),'passes':sum(q['passes'] for q in rows),'alignment_mm':float(align.max()),'best':min(rows,key=lambda q:(not q['passes'],q['crossings']))}),flush=True)
if __name__=='__main__':main()
