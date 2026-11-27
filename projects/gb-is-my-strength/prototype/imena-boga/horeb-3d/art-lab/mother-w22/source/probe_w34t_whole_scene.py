"""W34t independent static whole-scene surface witness for W34s."""
import argparse,hashlib,json
from pathlib import Path
import numpy as np
from probe_w34l_foot_surface import load,world
from probe_w34r_static_correction import contacts,crossings,deadline

def geometry(doc,acc,actor=False,drop=0):
    w=world(doc,doc['nodes']);out={}
    if actor:
        skin=doc['skins'][0];ibm=acc(skin['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1)
        jm=np.stack([w[i]@ibm[k] for k,i in enumerate(skin['joints'])])
    else:
        anchor=next(i for i,n in enumerate(doc['nodes']) if n['name']=='BASKET_OBJECT_ACTION_ANCHOR')
        def desc(i):
            yield i
            for c in doc['nodes'][i].get('children',[]):yield from desc(c)
        basket=set(desc(anchor))
    for i,n in enumerate(doc['nodes']):
        if 'mesh' not in n:continue
        vs=[];ts=[];cs=[];off=0;coff=0
        for pr in doc['meshes'][n['mesh']]['primitives']:
            at=pr['attributes'];rest=acc(at['POSITION']).astype(float);v=rest.copy()
            if actor:
                mesh=doc['meshes'][n['mesh']]
                for wt,t in zip(n.get('weights',mesh.get('weights',[])),pr.get('targets',[])):
                    if wt:v+=wt*acc(t['POSITION'])
                js=acc(at['JOINTS_0']);ws=acc(at['WEIGHTS_0']).astype(float)
                canon=np.unique(np.column_stack((np.round(rest,7),js,np.round(ws,7),np.round(v,7))),axis=0,return_inverse=True)[1]
                hom=np.column_stack((v,np.ones(len(v))))
                pts=sum(np.einsum('nij,nj->ni',jm[js[:,k]],hom)*ws[:,k,None] for k in range(4))[:,:3]
            else:
                pts=(np.column_stack((v,np.ones(len(v))))@w[i].T)[:,:3]
                if i in basket:pts[:,1]+=drop
                canon=np.arange(len(v))
            tri=acc(pr['indices']).reshape(-1,3)
            vs.append(pts);ts.append(tri+off);cs.append(canon+coff);off+=len(v);coff+=int(canon.max())+1
        name=n['name'];v=np.concatenate(vs);tri=np.concatenate(ts);c=np.concatenate(cs)
        assert name not in out
        out[name]={'v':v,'tri':tri,'canon':c,'region':np.full(len(tri),name,dtype=object)}
        if not actor:out[name]['basket']=i in basket
    return out,w
def merged(geo):
    vs=[];ts=[];rs=[];off=0
    for g in geo:
        vs.append(g['v']);ts.append(g['tri']+off);rs.append(g['region']);off+=len(g['v'])
    return {'v':np.concatenate(vs),'tri':np.concatenate(ts),'canon':np.arange(off),'region':np.concatenate(rs)}
def allcross(a,b,selfcheck=False):return contacts(a,b,np.arange(len(a['tri'])),selfcheck)
def point_triangle_min(p,tri):
    a,b,c=tri[:,0],tri[:,1],tri[:,2];u=b-a;v=c-a;w=p-a
    n=np.cross(u,v);nn=np.einsum('ij,ij->i',n,n)
    d=np.einsum('ij,ij->i',w,n);valid=nn>1e-20
    normaldist=np.divide(d*d,nn,out=np.full_like(nn,np.inf),where=valid)
    projection=w-n*np.divide(d,nn,out=np.zeros_like(nn),where=valid)[:,None]
    uu=np.einsum('ij,ij->i',u,u);uv=np.einsum('ij,ij->i',u,v);vv=np.einsum('ij,ij->i',v,v)
    wu=np.einsum('ij,ij->i',projection,u);wv=np.einsum('ij,ij->i',projection,v)
    s=np.divide(vv*wu-uv*wv,nn,out=np.zeros_like(nn),where=valid)
    t=np.divide(uu*wv-uv*wu,nn,out=np.zeros_like(nn),where=valid)
    result=np.where(valid&(s>=0)&(t>=0)&(s+t<=1),normaldist,np.inf)
    for x,y in ((a,b),(b,c),(c,a)):
        d=y-x;q=p-x;dd=np.einsum('ij,ij->i',d,d)
        f=np.clip(np.divide(np.einsum('ij,ij->i',q,d),dd,out=np.zeros_like(dd),where=dd>1e-20),0,1)
        e=q-d*f[:,None];result=np.minimum(result,np.einsum('ij,ij->i',e,e))
    return float(np.sqrt(result.min()))
def main():
    parser=argparse.ArgumentParser();parser.add_argument('evidence',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args()
    root=args.evidence;out=args.output;assert not out.exists()
    # Smoke-test proper noncoplanar crossing, separation and excluded coplanarity.
    a=np.array([[[0.,0.,0.],[1,0,0],[0,1,0]]]);b=np.array([[[.25,.25,-1],[.25,.25,1],[.5,.25,1]]])
    assert crossings(a,b)[0] and not crossings(a,b+3)[0] and not crossings(a,a)[0]
    assert abs(point_triangle_min(np.array([.25,.25,1]),a)-1)<1e-12
    rr=json.loads((root/'W34r-static-correction-20261127/w34r-report.json').read_text())
    sr=json.loads((root/'W34s-sleeve-correction-20261127/w34s-report.json').read_text())
    mr=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text())
    assert sr['source_glb_sha256']==rr['static_glb_sha256'] and mr['house_sha256']==rr['house_sha256']
    h,ha=load(root/'W28-house-20261125/w28-house.glb',rr['house_sha256'])
    hg,_=geometry(h,ha,drop=mr['basket_support']['analytic_settle_delta_m'])
    basket=[g for g in hg.values() if g['basket']];assert len(basket)==92
    floor_names={'Room_floor_earthen','Courtyard_earthen_ground'}
    floors=[hg[n] for n in floor_names]
    props=[g for n,g in hg.items() if not g['basket'] and n.startswith(('Coarse_work_surface','Workshop_wood_support','Domestic_clay_bench'))]
    room=[g for n,g in hg.items() if not g['basket'] and n not in floor_names and not n.startswith(('Coarse_work_surface','Workshop_wood_support','Domestic_clay_bench'))]
    assert len(basket)+len(floors)+len(props)+len(room)==len(hg) and len(props)==6
    groups={k:merged(v) for k,v in [('basket',basket),('furniture',props),('floor',floors),('room',room)]}
    results={}
    for mode,path,sha in [('before',root/'W34r-static-correction-20261127/w34r-static-actor.glb',rr['static_glb_sha256']),('after',root/'W34s-sleeve-correction-20261127/w34s-static-actor.glb',sr['glb_sha256'])]:
        deadline();d,da=load(path,sha);g,w=geometry(d,da,actor=True)
        assert len(g)==9
        actor=merged(g.values());body=g['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0'];tunic=g['W28e_tailored_linen']
        clothes={n:v for n,v in g.items() if n not in ('ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0','W19_CC0_Eyes','W28t_CC0_brows','W29b_CC0_lashes')}
        at=actor['v'][actor['tri']];lo,hi=at.min(axis=1),at.max(axis=1)
        amin,amax=lo.min(axis=0),hi.max(axis=0)
        def broadphase(v):
            # Reject triangle pairs only when the exact triangle AABBs cannot overlap.
            if np.any((v['v'].min(axis=0)>amax+1e-8)|(v['v'].max(axis=0)<amin-1e-8)):return {'pairs':0,'source_regions':{},'target_regions':{},'face_ids':[]}
            bt=v['v'][v['tri']];blo,bhi=bt.min(axis=1),bt.max(axis=1)
            ai=np.flatnonzero(np.all((lo<=bhi.max(axis=0)+1e-8)&(hi>=blo.min(axis=0)-1e-8),axis=1))
            bi=np.flatnonzero(np.all((blo<=hi.max(axis=0)+1e-8)&(bhi>=lo.min(axis=0)-1e-8),axis=1))
            if not len(ai) or not len(bi):return {'pairs':0,'source_regions':{},'target_regions':{},'face_ids':[]}
            a2=dict(actor,tri=actor['tri'][ai],region=actor['region'][ai])
            b2=dict(v,tri=v['tri'][bi],region=v['region'][bi])
            return allcross(a2,b2)
        def scene_group(items):
            result={'pairs':0,'source_regions':{},'target_regions':{},'face_ids':[]}
            for v in items:
                q=broadphase(v)
                result['pairs']+=q['pairs']
                for key in ('source_regions','target_regions'):
                    for name,count in q[key].items():result[key][name]=result[key].get(name,0)+count
            return result
        r={'scene':{k:scene_group(v) for k,v in [('basket',basket),('furniture',props),('floor',floors),('room',room)]},'body_self':allcross(body,body,True),'tunic_self':allcross(tunic,tunic,True),
           'body_clothes':{n:allcross(body,v) for n,v in clothes.items()}}
        # Body and garment counts are broad proper crossing witnesses, including fixed pre-existing areas.
        results[mode]=r
        print(mode,json.dumps({'scene':{k:v['pairs'] for k,v in r['scene'].items()},'body_self':r['body_self']['pairs'],'tunic_self':r['tunic_self']['pairs'],'body_clothes':{k:v['pairs'] for k,v in r['body_clothes'].items()}}),flush=True)
        if mode=='after':
            names={n['name']:i for i,n in enumerate(d['nodes'])};n=d['nodes'][names['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0']]
            pr=d['meshes'][n['mesh']]['primitives'][0];js=da(pr['attributes']['JOINTS_0']);ws=da(pr['attributes']['WEIGHTS_0'])
            skin=d['skins'][0];tri=groups['basket']['v'][groups['basket']['tri']]
            r['palm_surface_mm']={}
            def p(name):return w[names[name]][:3,3]
            for s,sign in [('l',1),('r',-1)]:
                hand=p('hand_'+s);f=p('middle_01_'+s)-hand;f/=np.linalg.norm(f)
                t=p('index_01_'+s)-p('pinky_01_'+s);t-=f*np.dot(f,t);t/=np.linalg.norm(t);normal=np.cross(f,t)
                # Coordinate conversion glTF to Blender is proper rotation; mirrored sign preserved.
                local=(body['v']-hand)@np.column_stack((f,t,normal))
                jid=skin['joints'].index(names['hand_'+s])
                keep=(np.sum(ws*(js==jid),axis=1)>=.55)&(local[:,0]>.025)&(local[:,0]<.065)&(abs(local[:,1])<.022)
                ids=np.flatnonzero(keep);assert len(ids)>=8
                ids=ids[np.argsort(sign*local[ids,2])[:16]]
                gaps=[point_triangle_min(body['v'][i],tri)*1000 for i in ids]
                r['palm_surface_mm'][s]={'selected_vertices':len(ids),'minimum':min(gaps),'mean':float(np.mean(gaps))}
    out.mkdir()
    result={'status':'ART_HOLD_WHOLE_SCENE_SURFACE_WITNESS','inventory':{k:len(v) for k,v in [('basket',basket),('furniture',props),('floor',floors),('room',room)]},'results':results,'limitations':['Proper noncoplanar triangle crossing only, shared vertices excluded for self checks. Does not detect containment, coplanar contacts, dynamic penetration or force closure. Foot-floor contact separate. Palm vertices selected independently; nearest triangle distance is not a grip.']}
    (out/'w34t-report.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps({'inventory':result['inventory'],'palm_surface_mm':results['after']['palm_surface_mm'],'after_scene':{k:{'pairs':v['pairs'],'source_regions':v['source_regions'],'target_regions':v['target_regions']} for k,v in results['after']['scene'].items()}}),flush=True)
if __name__=='__main__':main()
