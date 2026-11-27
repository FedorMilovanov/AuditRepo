"""W34zg: reconnect W34zf isolated wrist path to full skinned actor (experimental)."""
import argparse,json,math,copy,struct,hashlib
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R
from probe_w34l_foot_surface import load,world
from probe_w34r_static_correction import contacts,deadline,basis,swing,unit
from probe_w34m_reach import solve
from probe_w34t_whole_scene import geometry,merged
def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);p.add_argument('--distance',type=float,required=True);p.add_argument('--refine',action='store_true');p.add_argument('--path-witness',action='store_true');args=p.parse_args();assert not(args.refine and args.path_witness)
    root=args.evidence;out=args.output;assert not out.exists() and 0<=args.distance<=60
    f=root/'W34v-finger-refine-20261127';r=json.loads((f/'w34u-articulation.json').read_text())
    src=f/'w34u-static-actor.glb';d,a=load(src,r['glb_sha256'])
    m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text())
    h,ha=load(root/'W28-house-20261125/w28-house.glb',m['house_sha256'])
    hg,_=geometry(h,ha,drop=m['basket_support']['analytic_settle_delta_m'])
    g,base=geometry(d,a,True);names={n['name']:i for i,n in enumerate(d['nodes'])}
    parent={c:i for i,n in enumerate(d['nodes']) for c in n.get('children',[])}
    targets={}
    for s in ('l','r'):
        q=json.loads((root/f'W34zf-retreat-{s}-20261127/w34zb-reshape.json').read_text())
        assert q['source_sha256']==r['glb_sha256'] and q['approach_meta']['dense_all_clear']
        direction=unit(np.array(q['approach_meta']['selected']['direction'],float))
        targets[s]={names[k]:np.array(v) for k,v in q['best']['joint_world_matrices'].items()}
        for v in targets[s].values():v[:3,3]+=direction*args.distance*.001
    def desc(i):
        yield i
        for c in d['nodes'][i].get('children',[]):yield from desc(c)
    def build(pole_angle,corrective,twist=.65):
        M={i:x.copy() for i,x in base.items()};info={}
        for s in ('l','r'):
            up,low,hand=[names[k+'_'+s] for k in ('upperarm','lowerarm','hand')]
            aa,bb,cc=[M[i][:3,3].copy() for i in (up,low,hand)]
            target=targets[s][hand][:3,3]
            axis=unit(target-aa);pole=bb-aa;pole-=axis*(pole@axis)
            pole=R.from_rotvec(axis*math.radians((pole_angle[s] if isinstance(pole_angle,dict) else pole_angle)*(1 if s=='l' else -1))).apply(unit(pole))
            ss=solve(aa,bb,cc,target,pole);assert ss['reachable']
            elbow=np.array(ss['elbow'])
            def rot(i,Q):
                pivot=M[i][:3,3].copy();T=np.eye(4);T[:3,:3]=Q;T[:3,3]=pivot-Q@pivot
                for c in desc(i):M[c]=T@M[c]
            u,v=bb-aa,cc-bb;du,dv=elbow-aa,target-elbow
            rot(up,basis(du,np.cross(du,dv))@basis(u,np.cross(u,v)).T)
            rot(low,swing(M[hand][:3,3]-M[low][:3,3],dv))
            assert np.linalg.norm(M[hand][:3,3]-target)<1e-7
            # Distribute axial twist before applying remaining wrist rotation.
            ax=unit(dv);Q=targets[s][hand][:3,:3]@np.linalg.inv(M[hand][:3,:3])
            qq=R.from_matrix(Q).as_quat();tw=np.r_[ax*(qq[:3]@ax),qq[3]]
            if np.linalg.norm(tw)>1e-8:
                tw/=np.linalg.norm(tw)
                if tw[3]<0:tw=-tw
                angle=2*math.atan2(tw[:3]@ax,tw[3]);rot(low,R.from_rotvec(ax*angle*(twist[s] if isinstance(twist,dict) else twist)).as_matrix())
            residual=R.from_matrix(targets[s][hand][:3,:3]@np.linalg.inv(M[hand][:3,:3])).magnitude()*180/math.pi
            for i,v in targets[s].items():M[i]=v.copy()
            info[s]={'reserve_mm':ss['reserve_mm'],'elbow_flexion_deg':ss['flexion_deg'],'wrist_residual_deg':float(residual),'wrist_error_mm':float(np.linalg.norm(M[hand][:3,3]-target)*1000)}
        doc=copy.deepcopy(d)
        for i,n in enumerate(doc['nodes']):
            if np.max(abs(M[i]-base[i]))<1e-12:continue
            local=np.linalg.inv(M[parent[i]])@M[i] if i in parent else M[i]
            scale=np.linalg.norm(local[:3,:3],axis=0);rotation=local[:3,:3]/scale
            assert np.max(abs(rotation.T@rotation-np.eye(3)))<1e-5
            old=np.linalg.inv(base[parent[i]])@base[i] if i in parent else base[i]
            assert np.max(abs(old[:3,3]-local[:3,3]))<1e-6,(n['name'],old[:3,3],local[:3,3])
            n.pop('matrix',None);n['translation']=local[:3,3].tolist();n['scale']=scale.tolist();n['rotation']=R.from_matrix(rotation).as_quat().tolist()
        n=next(n for n in doc['nodes'] if n['name']=='W28e_tailored_linen')
        idx=doc['meshes'][n['mesh']]['extras']['targetNames'].index('W34s_LocalSleeveCorrection')
        n['weights'][idx]=float(corrective)
        geo,w=geometry(doc,a,True);err=max(float(np.max(abs(w[i]-M[i]))) for i in w)
        assert err<1e-5
        return doc,geo,info,err
    def audit(geo):
        body=geo['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0'];tunic=geo['W28e_tailored_linen']
        # Assign actual dominant skin/cloth joint region to localize failures.
        for k in ('ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0','W28e_tailored_linen'):
            n=d['nodes'][names[k]];pr=d['meshes'][n['mesh']]['primitives'][0];at=pr['attributes']
            js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=np.array([d['nodes'][i]['name'] for i in d['skins'][n['skin']]['joints']])
            dom=jn[js[np.arange(len(js)),ws.argmax(1)]]
            geo[k]['region']=dom[geo[k]['tri'][:,0]]
        changed={}
        for k,v in geo.items():
            mask=np.linalg.norm(v['v']-g[k]['v'],axis=1)>1e-7
            changed[k]=np.flatnonzero(np.any(mask[v['tri']],axis=1))
        def test(A,B,ids,selfcheck=False):
            if not len(ids):return 0
            return contacts(A,B,ids,selfcheck)['pairs']
        # Changed geometry only; unchanged W34v geometry inherited from W34s/W34x audits.
        aidx=changed['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0'];tidx=changed['W28e_tailored_linen']
        skin_detail=contacts(body,body,aidx,True);cloth_detail=contacts(tunic,tunic,tidx,True)
        skin_self=skin_detail['pairs'];cloth_self=cloth_detail['pairs']
        skin_cloth=test(body,tunic,aidx)
        # Exact additional affected tunic vs unchanged skin triangles; avoid duplicate pairs.
        rest=np.setdiff1d(np.arange(len(body['tri'])),aidx)
        unchanged_body=dict(body,tri=body['tri'][rest],region=body['region'][rest])
        skin_cloth+=test(tunic,unchanged_body,tidx)
        scene={};other={}
        for k,v in geo.items():
            idx=changed[k]
            if not len(idx):continue
            A=dict(v,tri=v['tri'][idx],region=v['region'][idx]);at=A['v'][A['tri']]
            lo=at.min(axis=(0,1));hi=at.max(axis=(0,1))
            for n,b in hg.items():
                if np.any((b['v'].min(0)>hi+1e-8)|(b['v'].max(0)<lo-1e-8)):continue
                bt=b['v'][b['tri']];mask=np.all((bt.min(1)<=hi+1e-8)&(bt.max(1)>=lo-1e-8),axis=1)
                if np.any(mask):
                    B=dict(b,tri=b['tri'][mask],region=b['region'][mask])
                    c=test(A,B,np.arange(len(A['tri'])))
                    if c:scene[k+' / '+n]=c
            for n,b in geo.items():
                if n==k or {n,k}=={'ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0','W28e_tailored_linen'}:continue
                # Avoid double-counting between changed meshes.
                if len(changed[n]) and n<k:continue
                bt=b['v'][b['tri']];mask=np.all((bt.min(1)<=hi+1e-8)&(bt.max(1)>=lo-1e-8),axis=1)
                if np.any(mask):
                    B=dict(b,tri=b['tri'][mask],region=b['region'][mask])
                    c=test(A,B,np.arange(len(A['tri'])))
                    if c:other[k+' / '+n]=c
        return {'skin_regions':skin_detail['source_regions'],'tunic_regions':cloth_detail['source_regions'],'skin_self':skin_self,'tunic_self':cloth_self,'skin_tunic':skin_cloth,'scene':scene,'other_actor':other,'changed_triangles':{k:len(v) for k,v in changed.items()}}
    rows=[];best=None
    def trial(pole,corr,twist):
        nonlocal best
        deadline();doc,geo,info,err=build(pole,corr,twist);au=audit(geo)
        count=sum(au[k] for k in ('skin_self','tunic_self','skin_tunic'))+sum(au['scene'].values())+sum(au['other_actor'].values())
        row={'pole_deg':pole,'twist':twist,'old_sleeve_correction':corr,'arm':info,'matrix_error':err,'audit':au,'crossings':count}
        rows.append(row);print(json.dumps({'pole':pole,'twist':twist,'count':count,'skin':au['skin_self'],'cloth':au['tunic_self'],'skin_cloth':au['skin_tunic'],'scene':au['scene'],'skin_regions':au['skin_regions']}),flush=True)
        if best is None or (bool(au['scene']),count)<(bool(best[0]['audit']['scene']),best[0]['crossings']):best=(row,doc)
    if args.path_witness:
        prior=json.loads((root/'W34zh-arm-refine-0-20261127/w34zg-report.json').read_text())
        assert prior['source_sha256']==r['glb_sha256'] and prior['distance_mm']==0
        row=prior['best'];trial(row['pole_deg'],row['old_sleeve_correction'],row['twist'])
    elif args.refine:
        trial({'l':25,'r':25},1,{'l':.65,'r':.65})
        for side in ('l','r'):
            seed=copy.deepcopy(best[0])
            for angle in (15,35,45):
                pp=dict(seed['pole_deg']);pp[side]=angle
                trial(pp,1,dict(seed['twist']))
        for side in ('l','r'):
            seed=copy.deepcopy(best[0])
            for fraction in (.35,.9):
                tw=dict(seed['twist']);tw[side]=fraction
                trial(dict(seed['pole_deg']),1,tw)
    else:
        for pole in (0,-25,25):
            for corr in (1,0):trial(pole,corr,.65)
    out.mkdir();report={'status':'ART_HOLD_FULL_ARM_RECONNECTION','source_sha256':r['glb_sha256'],'distance_mm':args.distance,'rows':rows,'best':best[0],'limitations':['Changed-triangle proper noncoplanar crossing audit, not containment, swept collision, or visual proof. Static hand targets do not certify grasp. Existing unrelated toe/floor residual not included.']}
    if best[0]['crossings']==0:
        doc=best[1];raw=src.read_bytes();jl=struct.unpack_from('<I',raw,12)[0];binchunk=raw[20+jl:];doc['asset']['generator']='HOREB W34zg full arm diagnostic'
        jb=json.dumps(doc,separators=(',',':'),ensure_ascii=True).encode();jb+=b' '*((-len(jb))%4);packed=struct.pack('<5I',0x46546c67,2,20+len(jb)+len(binchunk),len(jb),0x4e4f534a)+jb+binchunk
        f=out/'w34zg-static-actor.glb';f.write_bytes(packed);report['glb_sha256']=hashlib.sha256(packed).hexdigest();load(f,report['glb_sha256'])
    (out/'w34zg-report.json').write_text(json.dumps(report,indent=2));print(json.dumps({'best':best[0],'glb_sha256':report.get('glb_sha256')}),flush=True)
if __name__=='__main__':main()
