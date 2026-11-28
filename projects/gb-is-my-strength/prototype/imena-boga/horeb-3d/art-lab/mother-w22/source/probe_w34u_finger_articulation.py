"""W34u finger articulation trial on isolated W34s actor; no approved clip change."""
import argparse,hashlib,json,math,struct,time,copy
from pathlib import Path
import numpy as np
from scipy.spatial import cKDTree
from scipy.spatial.transform import Rotation as R
from probe_w34l_foot_surface import load,world
from probe_w34r_static_correction import contacts,deadline
from probe_w34t_whole_scene import geometry,merged,point_triangle_min
def unit(x):
    return x/np.linalg.norm(x)
def main():
    parser=argparse.ArgumentParser();parser.add_argument('evidence',type=Path);parser.add_argument('output',type=Path);parser.add_argument('--refine',action='store_true');parser.add_argument('--thumb-trial',action='store_true');parser.add_argument('--asymmetric-thumb',action='store_true');args=parser.parse_args();assert sum((args.refine,args.thumb_trial,args.asymmetric_thumb))<=1
    root=args.evidence;out=args.output;assert not out.exists()
    src=root/'W34s-sleeve-correction-20261127/w34s-static-actor.glb'
    sr=json.loads((src.parent/'w34s-report.json').read_text())
    mr=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text())
    d,a=load(src,sr['glb_sha256']);h,ha=load(root/'W28-house-20261125/w28-house.glb',mr['house_sha256'])
    g,base=geometry(d,a,True);hg,_=geometry(h,ha,drop=mr['basket_support']['analytic_settle_delta_m'])
    body=g['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0'];basket=merged([v for v in hg.values() if v['basket']])
    tri=basket['v'][basket['tri']];center=tri.mean(axis=1);radius=np.linalg.norm(tri-center[:,None],axis=2).max(1)
    # Exact nearest surface via an upper bound from nearest triangle center.
    tree=cKDTree(center);rad=radius.max()
    def nearest(p):
        _,i=tree.query(p,workers=1)
        ub=point_triangle_min(p,tri[i:i+1])
        ids=tree.query_ball_point(p,ub+rad+1e-10,workers=1)
        ids=np.asarray(ids,dtype=int);ids=ids[np.linalg.norm(center[ids]-p,axis=1)-radius[ids]<=ub+1e-10]
        return point_triangle_min(p,tri[ids])*1000
    names={n['name']:i for i,n in enumerate(d['nodes'])}
    skin=d['skins'][0];ibm=a(skin['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1)
    node=d['nodes'][names['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0']]
    mesh=d['meshes'][node['mesh']];pr=mesh['primitives'][0];at=pr['attributes']
    v=a(at['POSITION']).astype(float)
    for wt,t in zip(node.get('weights',mesh.get('weights',[])),pr.get('targets',[])):
        if wt:v+=wt*a(t['POSITION'])
    hom=np.column_stack((v,np.ones(len(v))));js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']).astype(float)
    digits=('thumb','index','middle','ring','pinky')
    sides=('l','r');frames={};pads={};affected=np.zeros(len(v),bool)
    def p(n):return base[names[n]][:3,3].copy()
    for side,sign in [('l',1),('r',-1)]:
        hand=p('hand_'+side);f=unit(p('middle_01_'+side)-hand)
        t=p('index_01_'+side)-p('pinky_01_'+side);t=unit(t-f*np.dot(f,t))
        n=np.cross(f,t)*sign;frames[side]=(f,t,n,sign)
        for digit in digits:
            allj=[skin['joints'].index(names[f'{digit}_{k:02d}_{side}']) for k in (1,2,3)]
            affected|=np.sum(ws*np.isin(js,allj),axis=1)>1e-9
            jid=allj[-1];ids=np.flatnonzero(np.sum(ws*(js==jid),axis=1)>=.55)
            axis=unit(base[names[digit+'_03_'+side]][:3,1])
            q=(body['v'][ids]-p(digit+'_03_'+side))@axis
            distal=ids[np.argsort(q)[-max(4,len(ids)//4):]]
            # Fixed pad samples, deduplicated and evenly spaced by distance along distal axis.
            distal=distal[np.linspace(0,len(distal)-1,min(12,len(distal))).astype(int)]
            pads[(side,digit)]=distal
    active=np.flatnonzero(np.any(affected[body['tri']],axis=1))
    # Only hand-region triangles can change; compare to the entire skin and basket.
    def desc(i):
        yield i
        for c in d['nodes'][i].get('children',[]):yield from desc(c)
    def make(curl,thumb):
        M={i:x.copy() for i,x in base.items()}
        def rot(n,axis,angle):
            i=names[n];pivot=M[i][:3,3].copy();Q=R.from_rotvec(unit(axis)*math.radians(angle)).as_matrix()
            T=np.eye(4);T[:3,:3]=Q;T[:3,3]=pivot-Q@pivot
            for k in desc(i):M[k]=T@M[k]
        for s in sides:
            f,t,n,sign=frames[s]
            for digit in digits[1:]:
                # Flexion axis is perpendicular to the actual phalanx and toward palm face.
                for k,frac in ((1,1.),(2,.65),(3,.30)):
                    name=f'{digit}_{k:02d}_{s}';axis=unit(M[names[name]][:3,1])
                    pivot_axis=np.cross(axis,-n)
                    if np.linalg.norm(pivot_axis)>1e-6:rot(name,pivot_axis,(curl[digit] if isinstance(curl,dict) else curl)*frac)
            # Thumb opposition turns the first phalanx inward toward middle finger,
            # with a small distal flexion toward the palm. No translation.
            name='thumb_01_'+s;axis=unit(M[names[name]][:3,1]);target=unit(M[names['middle_02_'+s]][:3,3]-M[names[name]][:3,3])
            cfg=thumb[s] if isinstance(thumb,dict) and 'l' in thumb else thumb
            if isinstance(cfg,dict):
                # Independent abduction and palmar rotation; retain the joint center.
                axis0=np.cross(axis,t)
                if np.linalg.norm(axis0)>1e-6:rot(name,axis0,cfg['spread'])
                axis=unit(M[names[name]][:3,1])
                target=unit(target*(1-cfg['palmar_bias'])-n*cfg['palmar_bias'])
                angles=(cfg['base'],cfg['middle'],cfg['tip'])
            else:angles=(cfg,.65*cfg,.35*cfg)
            pivot_axis=np.cross(axis,target)
            if np.linalg.norm(pivot_axis)>1e-6:rot(name,pivot_axis,angles[0])
            for k,frac in ((2,angles[1]),(3,angles[2])):
                name=f'thumb_{k:02d}_{s}';axis=unit(M[names[name]][:3,1]);pivot_axis=np.cross(axis,-n)
                if np.linalg.norm(pivot_axis)>1e-6:rot(name,pivot_axis,frac)
        jm=np.stack([M[i]@ibm[k] for k,i in enumerate(skin['joints'])])
        q=sum(np.einsum('nij,nj->ni',jm[js[:,k]],hom)*ws[:,k,None] for k in range(4))[:,:3]
        assert np.max(abs(q[~affected]-body['v'][~affected]))<1e-8
        return M,q
    # Crop basket triangles using the union of hand-region extents with a conservative 18cm margin.
    v0=body['v'][body['tri'][active]];lo=v0.min(axis=(0,1))-.18;hi=v0.max(axis=(0,1))+.18
    keep=np.all((tri.min(1)<=hi)&(tri.max(1)>=lo),axis=1)
    basket=dict(basket,tri=basket['tri'][keep],region=basket['region'][keep])
    rows=[];best=None
    def trial(curl,thumb):
        nonlocal best
        deadline();M,q=make(curl,thumb);b=dict(body,v=q)
        assert np.all(q[body['tri'][active]]>=lo-1e-8) and np.all(q[body['tri'][active]]<=hi+1e-8)
        gaps={}
        for (s,digit),ids in pads.items():
            ds=[nearest(p) for p in q[ids]]
            gaps.setdefault(s,{})[digit]={'min_mm':min(ds),'mean_mm':float(np.mean(ds))}
        selfhit=contacts(b,b,active,True)['pairs'];prop=contacts(b,basket,active)['pairs']
        score=sum(gaps[s][digit]['mean_mm'] for s in sides for digit in digits)
        row={'curl_deg':curl,'thumb_opposition_deg':thumb,'hand_self_crossings':selfhit,'hand_basket_crossings':prop,'pad_gaps_mm':gaps,'sum_mean_pad_gaps_mm':score}
        rows.append(row);print(json.dumps({k:row[k] for k in ('curl_deg','thumb_opposition_deg','hand_self_crossings','hand_basket_crossings','sum_mean_pad_gaps_mm')}),flush=True)
        if selfhit==0 and prop==0 and (best is None or score<best[0]['sum_mean_pad_gaps_mm']):best=(row,M)
        return row
    trial(0,0)
    if args.asymmetric_thumb:
        curl={'index':20,'middle':17,'ring':21,'pinky':30}
        seed={'base':25,'middle':9.75,'tip':5.25,'spread':30,'palmar_bias':.8}
        row=trial(curl,{'l':dict(seed),'r':dict(seed)})
        assert abs(row['sum_mean_pad_gaps_mm']-65.95303498558094)<.001
        for key,options in [('base',(26,27,28,29)),('spread',(32,34,36)),('middle',(11,12,13)),('tip',(7,9,11)),('palmar_bias',(.7,.75,.85,.9))]:
            seed=copy.deepcopy(best[0]['thumb_opposition_deg'])
            for option in options:
                cfg=copy.deepcopy(seed);cfg['r'][key]=option
                trial(curl,cfg)
    elif args.thumb_trial:
        curl={'index':20,'middle':17,'ring':21,'pinky':30}
        seed={'base':15,'middle':9.75,'tip':5.25,'spread':0,'palmar_bias':0}
        row=trial(curl,seed)
        assert abs(row['sum_mean_pad_gaps_mm']-138.49772437606023)<.001
        # Search independently; all accepted poses must preserve the previous crossing gate.
        for key,options in [('palmar_bias',(.15,.3,.45,.6,.8,1.)),('spread',(-20,-10,10,20,30)),('base',(10,20,25,30,35)),('middle',(0,5,15,20,30)),('tip',(0,10,15,20,30))]:
            seed=dict(best[0]['thumb_opposition_deg'])
            for option in options:
                trial(curl,dict(seed,**{key:option}))
    elif args.refine:
        trial(dict.fromkeys(digits[1:],15),15)
        assert isinstance(best[0]['curl_deg'],dict)
        # Coordinate-wise refinement, preserving zero-crossing acceptance at every step.
        for digit,choices in [('thumb',(20,25,30,35,40)),('index',(20,25,30)),('middle',(16,17,18)),('ring',(18,21,24)),('pinky',(20,25,30))]:
            seed,seedM=best
            for angle in choices:
                c=dict(seed['curl_deg']);t=seed['thumb_opposition_deg']
                if digit=='thumb':t=angle
                else:c[digit]=angle
                trial(c,t)
    else:
        for curl,thumb in [(15,15),(30,25),(45,35),(60,45),(35,50)]:trial(curl,thumb)
    assert rows[0]['hand_self_crossings']==0 and rows[0]['hand_basket_crossings']==0
    out.mkdir();result={'status':'ART_HOLD_FINGER_ARTICULATION_TRIAL','source_sha256':sr['glb_sha256'],'rows':rows,'selected':best[0] if best else None,'limitations':['Sampled distal-pad proximity, proper noncoplanar hand-region surface crossings only. Not force closure, visual acceptance or continuous motion. No canonical asset or clip altered.']}
    if best and best[0]['sum_mean_pad_gaps_mm']<rows[0]['sum_mean_pad_gaps_mm']:
        selected,M=best;doc2=copy.deepcopy(d)
        parent={c:i for i,n in enumerate(d['nodes']) for c in n.get('children',[])}
        for i,n in enumerate(doc2['nodes']):
            if not any(n['name'].startswith(digit+'_') for digit in digits):continue
            local=np.linalg.inv(M[parent[i]])@M[i];scale=np.linalg.norm(local[:3,:3],axis=0);rotation=local[:3,:3]/scale
            assert np.max(abs(rotation.T@rotation-np.eye(3)))<1e-5
            n.pop('matrix',None);n['translation']=local[:3,3].tolist();n['scale']=scale.tolist();n['rotation']=R.from_matrix(rotation).as_quat().tolist()
        raw=src.read_bytes();jl=struct.unpack_from('<I',raw,12)[0];binchunk=raw[20+jl:]
        doc2['asset']['generator']='HOREB W34u isolated finger articulation trial'
        jb=json.dumps(doc2,separators=(',',':'),ensure_ascii=True).encode();jb+=b' '*((-len(jb))%4)
        packed=struct.pack('<5I',0x46546c67,2,20+len(jb)+len(binchunk),len(jb),0x4e4f534a)+jb+binchunk
        f=out/'w34u-static-actor.glb';f.write_bytes(packed);sha=hashlib.sha256(packed).hexdigest()
        d2,a2=load(f,sha);g2,M2=geometry(d2,a2,True)
        err=max(float(np.max(abs(M2[i]-M[i]))) for i in M);assert err<1e-5
        result.update(glb_sha256=sha,reimport_matrix_error=err)
    (out/'w34u-articulation.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps({'selected':result['selected'],'glb_sha256':result.get('glb_sha256')}),flush=True)
if __name__=='__main__':main()
