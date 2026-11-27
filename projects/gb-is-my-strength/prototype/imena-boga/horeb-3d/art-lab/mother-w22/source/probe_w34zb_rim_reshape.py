"""W34zb: reshape an isolated rigid hand around rim. Not a full-body pose."""
import argparse,json,math
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R
from scipy.spatial import cKDTree
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry,merged,point_triangle_min
from probe_w34r_static_correction import contacts,deadline
def unit(x):
    return x/np.linalg.norm(x)
def main():
    parser=argparse.ArgumentParser();parser.add_argument('evidence',type=Path);parser.add_argument('output',type=Path);parser.add_argument('--side',choices=('l','r'),required=True);parser.add_argument('--coupled',action='store_true');parser.add_argument('--fine',action='store_true');args=parser.parse_args();assert not(args.fine and not args.coupled)
    root=args.evidence;out=args.output;assert not out.exists();side=args.side
    f=root/'W34v-finger-refine-20261127';r=json.loads((f/'w34u-articulation.json').read_text())
    fit=json.loads((root/'W34za-rim-radial-v-20261127/w34y-rim-fit.json').read_text())
    assert fit['source_sha256']==r['glb_sha256']
    candidate=fit['results'][side]['best_by_crossings']
    mr=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text())
    d,a=load(f/'w34u-static-actor.glb',r['glb_sha256']);h,ha=load(root/'W28-house-20261125/w28-house.glb',mr['house_sha256'])
    g,w=geometry(d,a,True);hg,_=geometry(h,ha,drop=mr['basket_support']['analytic_settle_delta_m'])
    body=g['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0'];names={n['name']:i for i,n in enumerate(d['nodes'])}
    skin=d['skins'][0];ibm=a(skin['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1)
    n=d['nodes'][names['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0']];mesh=d['meshes'][n['mesh']];pr=mesh['primitives'][0];at=pr['attributes']
    v=a(at['POSITION']).astype(float)
    for wt,t in zip(n.get('weights',mesh.get('weights',[])),pr.get('targets',[])):
        if wt:v+=wt*a(t['POSITION'])
    js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']).astype(float)
    digits=('thumb','index','middle','ring','pinky')
    jids=[k for k,i in enumerate(skin['joints']) if d['nodes'][i]['name']=='hand_'+side or d['nodes'][i]['name'].endswith('_'+side) and d['nodes'][i]['name'].startswith(tuple(k+'_' for k in digits))]
    mask=np.sum(ws*np.isin(js,jids),axis=1)>.999
    ids=np.flatnonzero(mask);faces=np.flatnonzero(np.all(mask[body['tri']],axis=1));assert len(faces)==fit['results'][side]['hand_faces']
    # Remap to compact hand-only skin geometry.
    remap=np.full(len(v),-1);remap[ids]=np.arange(len(ids));tri=remap[body['tri'][faces]]
    hom=np.column_stack((v[ids],np.ones(len(ids))));js=js[ids];ws=ws[ids]
    tags=[]
    jnames=[d['nodes'][i]['name'] for i in skin['joints']]
    for face in tri:
        weights=np.bincount(js[face].ravel(),weights=ws[face].ravel(),minlength=len(jnames))
        tags.append(jnames[weights.argmax()].split('_')[0])
    template={'tri':tri,'canon':body['canon'][ids],'region':np.asarray(tags)}
    basket=merged([v for v in hg.values() if v['basket']]);bt=basket['v'][basket['tri']]
    rim=hg['Basket_thick_lipped_rim'];rt=rim['v'][rim['tri']];rc=rt.mean(1)
    rn=np.cross(rt[:,1]-rt[:,0],rt[:,2]-rt[:,0]);rn/=np.maximum(np.linalg.norm(rn,axis=1),1e-12)[:,None]
    rad=np.linalg.norm(rt-rc[:,None],axis=2).max(1);tree=cKDTree(rc)
    T=np.eye(4);T[:3,:3]=np.array(candidate['rotation']);T[:3,3]=candidate['translation']
    def descendants(i):
        yield i
        for c in d['nodes'][i].get('children',[]):yield from descendants(c)
    base={i:x.copy() for i,x in w.items()}
    for i in descendants(names['hand_'+side]):base[i]=T@base[i]
    def p(k):return base[names[k]][:3,3]
    fwd=unit(p('middle_01_'+side)-p('hand_'+side));lat=p('index_01_'+side)-p('pinky_01_'+side);lat=unit(lat-fwd*np.dot(lat,fwd));normal=np.cross(fwd,lat)*(1 if side=='l' else -1)
    pads={}
    for digit in digits:
        jid=skin['joints'].index(names[digit+'_03_'+side]);sel=np.flatnonzero(np.sum(ws*(js==jid),axis=1)>=.55)
        axis=unit(w[names[digit+'_03_'+side]][:3,1])
        q=(body['v'][ids[sel]]-w[names[digit+'_03_'+side]][:3,3])@axis
        sel=sel[np.argsort(q)[-max(4,len(sel)//4):]]
        pads[digit]=sel[np.linspace(0,len(sel)-1,min(6,len(sel))).astype(int)]
    def nearest(point):
        _,i=tree.query(point,workers=1)
        ub=point_triangle_min(point,rt[i:i+1]);jj=np.asarray(tree.query_ball_point(point,ub+rad.max()+1e-10,workers=1),int)
        jj=jj[np.linalg.norm(rc[jj]-point,axis=1)-rad[jj]<=ub+1e-10]
        ds=np.array([point_triangle_min(point,rt[k:k+1]) for k in jj])
        best=ds.argmin();return ds[best]*1000,rn[jj[best]]
    def distance_only(point):
        _,i=tree.query(point,workers=1)
        ub=point_triangle_min(point,rt[i:i+1]);jj=np.asarray(tree.query_ball_point(point,ub+rad.max()+1e-10,workers=1),int)
        jj=jj[np.linalg.norm(rc[jj]-point,axis=1)-rad[jj]<=ub+1e-10]
        return point_triangle_min(point,rt[jj])*1000
    def make(params):
        M={i:x.copy() for i,x in base.items()}
        for digit,values in params.items():
            if digit=='wrist':continue
            for joint,angle in zip((1,2,3),values[:3]):
                i=names[f'{digit}_{joint:02d}_{side}'];axis=unit(M[i][:3,1]);rotaxis=np.cross(axis,-normal)
                if np.linalg.norm(rotaxis)<1e-8:continue
                Q=R.from_rotvec(unit(rotaxis)*math.radians(angle)).as_matrix()
                pivot=M[i][:3,3].copy();t=np.eye(4);t[:3,:3]=Q;t[:3,3]=pivot-Q@pivot
                for c in descendants(i):M[c]=t@M[c]
            if values[3]:
                i=names[f'{digit}_01_{side}'];Q=R.from_rotvec(normal*math.radians(values[3])).as_matrix()
                pivot=M[i][:3,3].copy();t=np.eye(4);t[:3,:3]=Q;t[:3,3]=pivot-Q@pivot
                for c in descendants(i):M[c]=t@M[c]
        if 'wrist' in params:
            values=params['wrist'];Q=R.from_euler('xyz',values[3:],degrees=True).as_matrix()
            pivot=M[names['hand_'+side]][:3,3].copy()
            t=np.eye(4);t[:3,:3]=Q;t[:3,3]=pivot-Q@pivot+np.array(values[:3])*.001
            for i in descendants(names['hand_'+side]):M[i]=t@M[i]
        jm=np.stack([M[i]@ibm[k] for k,i in enumerate(skin['joints'])])
        q=sum(np.einsum('nij,nj->ni',jm[js[:,k]],hom)*ws[:,k,None] for k in range(4))[:,:3]
        return M,q
    def trial(params,detail=False):
        deadline();M,q=make(params);hand=dict(template,v=q)
        lo=q.min(0);hi=q.max(0);keep=np.all((bt.min(1)<=hi+1e-8)&(bt.max(1)>=lo-1e-8),axis=1)
        prop=dict(basket,tri=basket['tri'][keep],region=basket['region'][keep])
        collision=contacts(hand,prop,np.arange(len(tri)));crossings=collision['pairs']
        selfhit=contacts(hand,hand,np.arange(len(tri)),True)['pairs']
        # Cheap distance tie-breaker, exact pad/normal witness only on finalists.
        gap=float(sum(tree.query(q[pads[k]],workers=1)[0].mean() for k in digits)*1000)
        row={'params':{k:list(v) for k,v in params.items()},'basket_crossings':crossings,'self_crossings':selfhit,'gap_proxy_mm':gap,'by_digit':collision['source_regions'],'by_basket_mesh':collision['target_regions']}
        if args.coupled:
            row['thumb_min_mm']=min(distance_only(x) for x in q[pads['thumb']])
            row['support_min_mm']=min(distance_only(x) for k in ('index','middle') for x in q[pads[k]])
            wr=M[names['hand_'+side]][:3,3]
            shoulder=w[names['upperarm_'+side]][:3,3];elbow=w[names['lowerarm_'+side]][:3,3]
            lengths=np.linalg.norm(elbow-shoulder)+np.linalg.norm(w[names['hand_'+side]][:3,3]-elbow)
            row['arm_reserve_mm']=float((lengths-np.linalg.norm(wr-shoulder))*1000)
        if detail:
            near={k:min((nearest(x) for x in q[ii]),key=lambda v:v[0]) for k,ii in pads.items()}
            row['rim_pad_min_mm']={k:float(v[0]) for k,v in near.items()}
            row['thumb_rim_normal_dots']={k:float(near['thumb'][1]@v[1]) for k,v in near.items() if k!='thumb'}
            row['joint_world_matrices']={d['nodes'][i]['name']:M[i].tolist() for i in descendants(names['hand_'+side])}
        return row
    params={k:[0,0,0,0] for k in digits}
    initial=trial(params,True)
    # Exact exported LBS should reproduce the rigid subset count (tiny residual weights may differ).
    assert abs(initial['basket_crossings']-candidate['rigid_hand_crossings'])<=2,(initial['basket_crossings'],candidate['rigid_hand_crossings'])
    best=initial;tested=1
    def rank(row):return (row['self_crossings']>0,row['basket_crossings']+row['self_crossings'],row['gap_proxy_mm'])
    if args.coupled:
        prior=json.loads((root/f'W34zb-rim-reshape-{side}-20261127/w34zb-reshape.json').read_text())
        params={k:v.copy() for k,v in prior['best']['params'].items()};params['wrist']=[0]*6
        initial=trial(params,True);assert initial['basket_crossings']==prior['best']['basket_crossings']
        best=initial;tested=1
        if args.fine:
            prior2=json.loads((root/f'W34zc-coupled-rim-{side}-20261127/w34zb-reshape.json').read_text())
            initial=trial(prior2['best']['params'],True)
            assert initial['basket_crossings']==prior2['best']['basket_crossings']
            best=initial;tested=1
            print(json.dumps({'localized':initial['by_digit'],'basket':initial['basket_crossings']}),flush=True)
        # Reject any self-crossing or loss of the near-contact gate before minimizing crossings.
        def rank(row):
            return (row['self_crossings']>0,row['arm_reserve_mm']<5,row['thumb_min_mm']>8 or row['support_min_mm']>15,row['basket_crossings'],row['gap_proxy_mm'])
        def tune(key,joint,offsets,limit):
            nonlocal best,tested
            seed={k:v.copy() for k,v in best['params'].items()}
            for step in offsets:
                pp={k:v.copy() for k,v in seed.items()};pp[key][joint]=float(np.clip(pp[key][joint]+step,*limit))
                if pp==seed:continue
                row=trial(pp);tested+=1
                if rank(row)<rank(best):best=row
        for phase in ((3,4) if args.fine else (1,2)):
            for k in (1,2,0,3,4,5):
                tune('wrist',k,(-8,-4,4,8) if phase==1 else (-4,-2,2,4) if phase in (2,3) else (-2,-1,1,2),(-24,24) if k<3 else (-20,20))
            print(json.dumps({'phase':phase,'stage':'wrist','tested':tested,'basket':best['basket_crossings'],'self':best['self_crossings'],'thumb_mm':best['thumb_min_mm'],'support_mm':best['support_min_mm']}),flush=True)
            order=('middle','index','ring','pinky','thumb')
            if args.fine:
                order=sorted(order,key=lambda digit:-best['by_digit'].get(digit,0))
            for digit in order:
                if args.fine and not best['by_digit'].get(digit,0):continue
                for j in (0,1,2,3):
                    tune(digit,j,(-12,12) if phase==1 else (-6,6) if phase in (2,3) else (-3,3),(-45,45) if j<3 else (-24,24))
            print(json.dumps({'phase':phase,'stage':'digits','tested':tested,'basket':best['basket_crossings'],'self':best['self_crossings'],'thumb_mm':best['thumb_min_mm'],'support_mm':best['support_min_mm']}),flush=True)
    else:
        for digit in ('middle','index','ring','pinky'):
            for joint,angles in ((0,(-30,-15,15,30)),(1,(-40,-20,20,40)),(2,(-30,30)),(3,(-15,15))):
                seed={k:v.copy() for k,v in best['params'].items()}
                for angle in angles:
                    pp={k:v.copy() for k,v in seed.items()};pp[digit][joint]=angle
                    row=trial(pp);tested+=1
                    if rank(row)<rank(best):best=row
            print(json.dumps({'digit':digit,'tested':tested,'basket':best['basket_crossings'],'self':best['self_crossings']}),flush=True)
    best=trial(best['params'],True)
    out.mkdir();report={'status':'ART_HOLD_RIM_HAND_RESHAPE','source_sha256':r['glb_sha256'],'side':side,'coupled':args.coupled,'fine':args.fine,'tested':tested+1,'initial':initial,'best':best,'limitations':['Fully hand-weighted subset only; wrist transition and arm/cloth/scene not solved. Rim triangle normal proxy, no force closure. No exported actor or animation.']}
    (out/'w34zb-reshape.json').write_text(json.dumps(report,indent=2))
    print(json.dumps({'side':side,'tested':tested+1,'initial':initial['basket_crossings'],'best':{k:v for k,v in best.items() if k!='joint_world_matrices'}}),flush=True)
if __name__=='__main__':main()
