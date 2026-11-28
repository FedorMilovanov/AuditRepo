"""W37c: isolated hand support under a tilted basket, exact finalist crossings."""
import argparse,json,math
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R
from scipy.spatial import cKDTree
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry,merged,point_triangle_min
from probe_w34r_static_correction import contacts,deadline
from probe_w35e_playback import pose,BODY
from probe_w35i_rim_contact import normals

def unit(v):return v/max(np.linalg.norm(v),1e-12)

def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);p.add_argument('--angle',type=int,choices=(10,15,20,25),required=True);args=p.parse_args()
 root=args.evidence;out=args.output;assert not out.exists()
 layout_file=root/'W37b-settled-layout-20261128.json'
 layout=json.loads(layout_file.read_text()) if layout_file.exists() else json.loads((root/'W37a-f-underside-20261128/w37a-f-underside.json').read_text())['settled_layout']
 f=root/'W36m-closure-20261128';r=json.loads((f/'w36m-assembly.json').read_text());d,a=load(f/'w36m-approach-closure.glb',r['sha256']);d=pose(d,a,3.15);g,w=geometry(d,a,True);body=g[BODY]
 m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text());h,ha=load(root/'W28-house-20261125/w28-house.glb',m['house_sha256']);hg,_=geometry(h,ha,drop=m['basket_support']['analytic_settle_delta_m']);assert m['house_sha256']==layout['house_sha256']
 basket=merged([z for z in hg.values() if z['basket']]);table=hg['Coarse_work_surface'];base=hg['Basket_W26_closed_woven_base'];tl=table['v'].min(0);th=table['v'].max(0);by=base['v'][:,1].min()
 names={n['name']:i for i,n in enumerate(d['nodes'])};n=d['nodes'][names[BODY]];at=d['meshes'][n['mesh']]['primitives'][0]['attributes'];js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=np.array([d['nodes'][i]['name'] for i in d['skins'][n['skin']]['joints']]);dom=jn[js[np.arange(len(js)),ws.argmax(1)]]
 hm=np.array([n.endswith('_l') and n.startswith(('hand_','thumb_','index_','middle_','ring_','pinky_')) for n in jn])
 mask=np.sum(ws*hm[js],axis=1)>.999;ids=np.flatnonzero(mask);faces=np.flatnonzero(np.all(mask[body['tri']],axis=1));_,first=np.unique(body['canon'][ids],return_index=True);unique=ids[first]
 wrist=w[names['hand_l']][:3,3];shoulder=w[names['upperarm_l']][:3,3];elbow=w[names['lowerarm_l']][:3,3];length=np.linalg.norm(wrist-elbow)+np.linalg.norm(elbow-shoulder)
 fw=unit(w[names['middle_01_l']][:3,3]-wrist);ac=w[names['index_01_l']][:3,3]-w[names['pinky_01_l']][:3,3];ac=unit(ac-fw*(ac@fw));frame=np.column_stack((fw,ac,np.cross(fw,ac)))
 full=body['v'][unique]-wrist
 # Anatomical palm orientation inferred from joint frame only; both signs tested.
 ranked=[];count=0
 for lay in layout['rows']:
  if not lay['gate'] or lay['angle_deg']!=args.angle or lay['slide_mm'] not in (80,140,180):continue
  Q=np.array(lay['rotation']);S=np.array(lay['translation'])
  for yaw in (-25,0,25):
   for pitch in (-15,0,15):
    for sign in (-1,1):
     fwd=unit(R.from_euler('y',yaw,degrees=True).apply([0,0,-1.]));fwd=unit(fwd*math.cos(math.radians(pitch))+np.array([0,1,0])*math.sin(math.radians(pitch)))
     across=unit(np.cross([0,1,0],fwd))*sign
     # orientation in local basket frame, then rotate along with tilted base
     rot=Q@np.column_stack((fwd,across,np.cross(fwd,across)))@frame.T
     pp=full@rot.T
     for x in (.12,.18,.24,.28):
      for z in (.48,.51,.54,.57,.60):
       for y in (.78,.80,.815,.83):
        origin=Q@np.array([x,y,z])+S;count+=1
        reserve=(length-np.linalg.norm(origin-shoulder))*1000
        if reserve<8:continue
        v=pp+origin;local=(v-S)@Q
        # Approximate closed-base footprint; conservatively forbid positive plane penetration.
        radial=((local[:,0]-.35)/.315)**2+((local[:,2]-.26)/.205)**2
        inside=radial<.88
        if inside.sum()<12:continue
        table_mask=(v[:,0]>=tl[0])&(v[:,0]<=th[0])&(v[:,2]>=tl[2])&(v[:,2]<=th[2])
        tpen=max(0.,th[1]-v[table_mask,1].min()) if table_mask.any() else 0
        pen=max(0.,local[inside,1].max()-by)
        gap=(by-local[inside,1])*1000
        near=np.count_nonzero((gap>=0)&(gap<=12))
        if tpen>.001 or pen>.002:continue
        score=500*(tpen*1000)**2+200*(pen*1000)**2+max(0.,float(gap.min()))**2+200/(1+near)
        ranked.append((float(score),rot,origin-rot@wrist,lay,reserve,sign,yaw,pitch,int(near)))
 ranked.sort(key=lambda z:z[0]);rows=[]
 for score,rot,shift,lay,reserve,sign,yaw,pitch,near in ranked[:16]:
  deadline();Q=np.array(lay['rotation']);S=np.array(lay['translation']);bv=basket['v']@Q.T+S;bb=dict(basket,v=bv)
  v=body['v'].copy();v[ids]=v[ids]@rot.T+shift
  hand=dict(body,v=v,tri=body['tri'][faces],region=body['region'][faces]);tt=v[hand['tri']];lo=tt.min(axis=(0,1));hi=tt.max(axis=(0,1))
  def hit(obj):
   bt=obj['v'][obj['tri']];keep=np.all((bt.min(1)<=hi+1e-8)&(bt.max(1)>=lo-1e-8),axis=1)
   return contacts(hand,dict(obj,tri=obj['tri'][keep],region=obj['region'][keep]),np.arange(len(faces))) if keep.any() else {'pairs':0,'target_regions':{}}
  bh=hit(bb);other={}
  for name,obj in hg.items():
   if obj['basket'] or np.any((obj['v'].max(0)<lo)|(obj['v'].min(0)>hi)):continue
   n=hit(obj)['pairs']
   if n:other[name]=n
  support={}
  if not bh['pairs'] and not other:
   basev=base['v']@Q.T+S;bt=basev[base['tri']];bn=normals(basev,base['tri']);bn/=np.maximum(np.linalg.norm(bn,axis=1),1e-12)[:,None]
   # Only downward-facing base triangles, not side wall contacts.
   bottom=bt[(bn@Q[:,1])<-.8];assert len(bottom)
   for digit in ('hand','thumb','index','middle','ring','pinky'):
    sel=unique[np.array([z.startswith(digit+'_') for z in dom[unique]])]
    ds=np.array([point_triangle_min(v[j],bottom)*1000 for j in sel])
    support[digit]={'min_gap_mm':float(ds.min()),'vertices_within_5mm':int(np.sum(ds<=5))}
  rows.append({'score':score,'angle_deg':lay['angle_deg'],'slide_mm':lay['slide_mm'],'basket_rotation':lay['rotation'],'basket_translation':lay['translation'],'rotation':rot.tolist(),'translation':shift.tolist(),'reserve_mm':reserve,'palm_sign':sign,'yaw_deg':yaw,'pitch_deg':pitch,'proxy_near_count':near,'basket_crossings':bh['pairs'],'basket_regions':bh['target_regions'],'other':other,'support':support,'gate':bool(not bh['pairs'] and not other)})
 best=min(rows,key=lambda z:(not z['gate'],z['basket_crossings']+sum(z['other'].values()),-sum(v['vertices_within_5mm'] for v in z['support'].values()),z['score'])) if rows else None
 result={'status':'ART_HOLD_UNDERSIDE_RIGID_SCREEN','source_sha256':r['sha256'],'angle_deg':args.angle,'candidates':count,'proxy_eligible':len(ranked),'rows':rows,'best':best,'limitations':['Rigid isolated left hand; exact proper crossing only. Base vertex gaps not face contact or force proof. Table pose hypothetical. No full actor or animation.']}
 out.write_text(json.dumps(result,indent=2));print(json.dumps({'candidates':count,'eligible':len(ranked),'exact':len(rows),'passes':sum(z['gate'] for z in rows),'best':best}),flush=True)
if __name__=='__main__':main()
