"""W36q: bounded finger-wrap feasibility at actual W36m endpoint."""
import argparse,copy,json,math
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R
from probe_w34l_foot_surface import load,world
from probe_w34t_whole_scene import geometry,merged
from probe_w34r_static_correction import contacts,deadline
from probe_w35e_playback import pose,BODY

def unit(v):
    return v/max(np.linalg.norm(v),1e-12)

def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);p.add_argument('--reverse',action='store_true');args=p.parse_args()
    root=args.evidence;out=args.output;assert not out.exists()
    f=root/'W36m-closure-20261128';r=json.loads((f/'w36m-assembly.json').read_text());d,a=load(f/'w36m-approach-closure.glb',r['sha256']);d=pose(d,a,3.15);g,w=geometry(d,a,True)
    wit=json.loads((f/'w36p-final-witness.json').read_text());assert wit['source_sha256']==r['sha256']
    m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text());h,ha=load(root/'W28-house-20261125/w28-house.glb',m['house_sha256']);hg,_=geometry(h,ha,drop=m['basket_support']['analytic_settle_delta_m'])
    basket=merged([z for z in hg.values() if z['basket']]);bt=basket['v'][basket['tri']];b=g[BODY];tri=b['tri']
    names={n['name']:i for i,n in enumerate(d['nodes'])};parent={j:i for i,n in enumerate(d['nodes']) for j in n.get('children',[])}
    sn,sa=load(root/'W34s-sleeve-correction-20261127/w34s-static-actor.glb',r['source_sha256']);n=next(n for n in sn['nodes'] if n['name']==BODY);mesh=sn['meshes'][n['mesh']];pr=mesh['primitives'][0];rest=sa(pr['attributes']['POSITION']).astype(float)
    for wt,t in zip(n.get('weights',mesh.get('weights',[])),pr.get('targets',[])):
        if wt:rest+=wt*sa(t['POSITION'])
    def norm(v):
        q=v[tri];return np.cross(q[:,1]-q[:,0],q[:,2]-q[:,0])
    nr=norm(rest);ar=np.linalg.norm(nr,axis=1);n0=norm(b['v']);a0=np.linalg.norm(n0,axis=1)
    protected=[]
    for side in ('l','r'):
        pair=wit['triangle_witness']['opposition'][side]['best_opposed_pair']
        for k in ('thumb','index'):protected.extend(tri[pair[k]['skin_face']])
    protected=np.unique(protected)
    def trial(angles):
        deadline();doc=dict(d,nodes=copy.deepcopy(d['nodes']));M={i:z.copy() for i,z in w.items()}
        def descendants(i):
            yield i
            for j in d['nodes'][i].get('children',[]):yield from descendants(j)
        def pos(name):return M[names[name]][:3,3]
        rotations={}
        for side,sign in [('l',1),('r',-1)]:
            f=unit(pos('middle_01_'+side)-pos('hand_'+side));t=pos('index_01_'+side)-pos('pinky_01_'+side);t=unit(t-f*(f@t));normal=np.cross(f,t)*sign
            for digit in ('middle','ring','pinky'):
                value=angles.get(digit,0)
                if value==0:continue
                for k,frac in ((1,1.),(2,.65),(3,.30)):
                    name=f'{digit}_{k:02d}_{side}';i=names[name];axis=unit(M[i][:3,1]);ax=unit(np.cross(axis,-normal))
                    Q=R.from_rotvec(ax*math.radians(value*frac)).as_matrix()
                    P=M[parent[i]][:3,:3];old=R.from_quat(doc['nodes'][i]['rotation']).as_matrix()
                    doc['nodes'][i]['rotation']=R.from_matrix(P.T@Q@P@old).as_quat().tolist()
                    pivot=M[i][:3,3].copy();T=np.eye(4);T[:3,:3]=Q;T[:3,3]=pivot-Q@pivot
                    for j in descendants(i):M[j]=T@M[j]
                    rotations[name]=doc['nodes'][i]['rotation']
        gg,_=geometry(doc,a,True);v=gg[BODY];delta=np.linalg.norm(v['v']-b['v'],axis=1);active=np.flatnonzero(np.any((delta>1e-8)[tri],axis=1))
        if not len(active):raise AssertionError('no changed faces')
        assert all(np.max(abs(gg[k]['v']-g[k]['v']))<1e-8 for k in g if k!=BODY)
        selfhit=contacts(v,v,active,True)['pairs'];aa=dict(v,tri=tri[active],region=v['region'][active]);at=v['v'][aa['tri']];lo=at.min(axis=(0,1));hi=at.max(axis=(0,1))
        def hit(obj):
            tt=obj['v'][obj['tri']];mask=np.all((tt.min(1)<=hi+1e-8)&(tt.max(1)>=lo-1e-8),axis=1)
            if not mask.any():return {'pairs':0,'target_regions':{}}
            return contacts(aa,dict(obj,tri=obj['tri'][mask],region=obj['region'][mask]),np.arange(len(active)))
        bh=hit(basket);other={}
        for name,obj in list(gg.items())+[(k,z) for k,z in hg.items() if not z['basket']]:
            if name==BODY or np.any((obj['v'].max(0)<lo)|(obj['v'].min(0)>hi)):continue
            val=hit(obj)['pairs']
            if val:other[name]=val
        nn=norm(v['v']);an=np.linalg.norm(nn,axis=1);cos=np.sum(n0[active]*nn[active],axis=1)/np.maximum(a0[active]*an[active],1e-30)
        severe=np.flatnonzero((ar>1e-12)&(an<.1*ar)).tolist()
        pd=float(delta[protected].max()*1000)
        gate=selfhit==bh['pairs']==0 and not other and not severe and pd<.00001 and cos.min()>.1
        return {'angles_deg':angles,'skin_crossings':selfhit,'basket_crossings':bh['pairs'],'basket_regions':bh['target_regions'],'other':other,'severe_skin':severe,'protected_contact_delta_mm':pd,'min_normal_cosine':float(cos.min()),'max_delta_mm':float(delta.max()*1000),'gate':bool(gate),'rotations':rotations}
    rows=[]
    for digit in ('middle','ring','pinky'):
        for angle in ((-5,-10,-20,-30) if args.reverse else (5,10,20,30)):
            row=trial({digit:angle});rows.append(row)
            print(json.dumps({k:v for k,v in row.items() if k!='rotations'}),flush=True)
    best={digit:max((row['angles_deg'][digit] for row in rows if row['gate'] and digit in row['angles_deg']),key=abs,default=0) for digit in ('middle','ring','pinky')}
    for scale in (.5,.75,1.):
        if not any(best.values()):break
        row=trial({k:v*scale for k,v in best.items()});rows.append(row)
        print(json.dumps({k:v for k,v in row.items() if k!='rotations'}),flush=True)
    result={'status':'ART_HOLD_WRAP_SCREEN','source_sha256':r['sha256'],'reverse':args.reverse,'rows':rows,'independent_limits_deg':best,'protected_vertices':protected.tolist(),'limitations':['Sampled geometry only, not a physical grasp, swept clearance or visual acceptance.']}
    out.write_text(json.dumps(result,indent=2));print('SUMMARY',json.dumps({'samples':len(rows),'passes':sum(z['gate'] for z in rows),'limits':best}),flush=True)
if __name__=='__main__':main()
