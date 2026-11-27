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
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);p.add_argument('--distance',type=float,required=True);p.add_argument('--refine',action='store_true');p.add_argument('--path-witness',action='store_true');p.add_argument('--dq',action='store_true');p.add_argument('--smooth',action='store_true');p.add_argument('--guarded-smooth',action='store_true');p.add_argument('--weight-trial',action='store_true');p.add_argument('--combined',action='store_true');p.add_argument('--shared-reference',action='store_true');p.add_argument('--topology-witness',action='store_true');p.add_argument('--upper-twist',action='store_true');p.add_argument('--upper-combined',action='store_true');p.add_argument('--separate',action='store_true');p.add_argument('--stance-mm',type=float);p.add_argument('--stance-dq-only',action='store_true');p.add_argument('--export-diagnostic',action='store_true');p.add_argument('--digit-area-factor',type=float);args=p.parse_args();assert args.digit_area_factor is None or (args.stance_mm==160 and args.stance_dq_only and not args.export_diagnostic and 1<args.digit_area_factor<=2);assert not args.stance_dq_only or args.stance_mm is not None;assert not args.export_diagnostic or (args.stance_mm==160 and args.stance_dq_only);assert sum((args.refine,args.path_witness,args.dq,args.smooth,args.guarded_smooth,args.weight_trial,args.combined,args.shared_reference,args.topology_witness,args.upper_twist,args.upper_combined,args.separate,args.stance_mm is not None))<=1
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
    def build(pole_angle,corrective,twist=.65,upper_twist=None,shift=None):
        M={i:x.copy() for i,x in base.items()};info={}
        if shift is not None:
            for v in M.values():v[:3,3]+=shift
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
            if upper_twist is not None:
                # Twist the upper arm along its own axis, then cancel at the elbow.
                # All descendant matrices except upper arm must remain unchanged.
                saved={i:M[i].copy() for i in desc(low)}
                q=R.from_rotvec(unit(du)*math.radians(upper_twist[s])).as_matrix()
                rot(up,q);rot(low,q.T)
                assert max(np.max(abs(M[i]-v)) for i,v in saved.items())<1e-6
                assert np.linalg.norm(M[low][:3,3]-elbow)<1e-7
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
            expected=old[:3,3]+(shift if shift is not None and i not in parent else 0)
            assert np.max(abs(expected-local[:3,3]))<1e-6,(n['name'],expected,local[:3,3])
            n.pop('matrix',None);n['translation']=local[:3,3].tolist();n['scale']=scale.tolist();n['rotation']=R.from_matrix(rotation).as_quat().tolist()
        n=next(n for n in doc['nodes'] if n['name']=='W28e_tailored_linen')
        idx=doc['meshes'][n['mesh']]['extras']['targetNames'].index('W34s_LocalSleeveCorrection')
        n['weights'][idx]=float(corrective)
        geo,w=geometry(doc,a,True);err=max(float(np.max(abs(w[i]-M[i]))) for i in w)
        assert err<1e-5
        return doc,geo,info,err
    def audit(geo,shift=None):
        body=geo['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0'];tunic=geo['W28e_tailored_linen']
        # Assign actual dominant skin/cloth joint region to localize failures.
        for k in ('ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0','W28e_tailored_linen'):
            n=d['nodes'][names[k]];pr=d['meshes'][n['mesh']]['primitives'][0];at=pr['attributes']
            js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=np.array([d['nodes'][i]['name'] for i in d['skins'][n['skin']]['joints']])
            dom=jn[js[np.arange(len(js)),ws.argmax(1)]]
            geo[k]['region']=dom[geo[k]['tri'][:,0]]
        changed={}
        for k,v in geo.items():
            mask=np.linalg.norm(v['v']-g[k]['v']-(shift if shift is not None else 0),axis=1)>1e-7
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
    def dq_geometry(doc,geo,amount,weight_gamma=1.,weight_smooth=0):
        from scipy.sparse import coo_matrix
        # Dual quaternion blend of the same joint matrices. Preserve digit-weighted
        # regions and all geometry outside the arm transition, including the feet.
        w=world(doc,doc['nodes']);skin=doc['skins'][0]
        ibm=a(skin['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1)
        J=np.stack([w[i]@ibm[k] for k,i in enumerate(skin['joints'])])
        rot=J[:,:3,:3]
        assert np.max(abs(np.einsum('nji,njk->nik',rot,rot)-np.eye(3)))<1e-5
        assert np.min(np.linalg.det(rot))>.99999
        qr=R.from_matrix(rot).as_quat()
        def mul(q,r):
            v,s=q[...,:3],q[...,3:];u,t=r[...,:3],r[...,3:]
            return np.concatenate((s*u+t*v+np.cross(v,u),s*t-np.sum(v*u,axis=-1,keepdims=True)),axis=-1)
        qd=.5*mul(np.column_stack((J[:,:3,3],np.zeros(len(J)))),qr)
        jnames=np.array([doc['nodes'][i]['name'] for i in skin['joints']])
        arm=np.array([n.startswith(('clavicle_','upperarm_','lowerarm_')) for n in jnames])
        digit=np.array([n.startswith(('thumb_','index_','middle_','ring_','pinky_')) for n in jnames])
        out={k:dict(v) for k,v in geo.items()};metrics={}
        for k,blend in zip(('ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0','W28e_tailored_linen'),amount):
            n=doc['nodes'][names[k]];mesh=doc['meshes'][n['mesh']];pr=mesh['primitives'][0];at=pr['attributes']
            v=a(at['POSITION']).astype(float)
            for weight,t in zip(n.get('weights',mesh.get('weights',[])),pr.get('targets',[])):
                if weight:v+=weight*a(t['POSITION'])
            js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']).astype(float)
            assert np.max(abs(ws.sum(1)-1))<1e-5
            original=ws.copy()
            if weight_gamma!=1. or weight_smooth:
                # Alter only existing arm influence slots. Preserve normalized weights,
                # digit-influenced vertices, and non-arm weights exactly.
                allowed=np.isin(jnames[js], [name for name in jnames if name.startswith(('clavicle_','upperarm_','lowerarm_','hand_'))])
                eligible=(np.sum(original*digit[js],axis=1)<1e-9)&(np.sum((original>1e-6)&allowed,axis=1)>=2)
                total=np.sum(original*allowed,axis=1)
                if weight_gamma!=1.:
                    power=np.where(allowed,original**weight_gamma,0)
                    power*=np.divide(total,power.sum(1),out=np.zeros_like(total),where=power.sum(1)>0)[:,None]
                    ws=np.where(eligible[:,None]&allowed,power,original)
                if weight_smooth:
                    # Smooth weights on welded geometry while retaining four original slots.
                    _,first,canon=np.unique(geo[k]['canon'],return_index=True,return_inverse=True)
                    tri=canon[geo[k]['tri']]
                    edges=np.sort(np.concatenate((tri[:,[0,1]],tri[:,[1,2]],tri[:,[2,0]])),axis=1)
                    edges=np.unique(edges[edges[:,0]!=edges[:,1]],axis=0);i,j=edges.T
                    adj=coo_matrix((np.ones(len(i)*2),(np.r_[i,j],np.r_[j,i])),shape=(len(first),len(first))).tocsr()
                    degree=np.asarray(adj.sum(1)).ravel()
                    dense=np.zeros((len(ws),len(jnames)))
                    np.add.at(dense,(np.arange(len(ws))[:,None],js),ws)
                    for _ in range(weight_smooth):
                        avg=(adj@dense[first])/np.maximum(degree,1)[:,None]
                        proposal=.65*ws+.35*avg[canon[:,None],js]
                        proposal=np.where(allowed&(original>1e-8),proposal,0.)
                        proposal*=np.divide(total,proposal.sum(1),out=np.zeros_like(total),where=proposal.sum(1)>0)[:,None]
                        ws=np.where(eligible[:,None]&allowed,proposal,original)
                        dense.fill(0);np.add.at(dense,(np.arange(len(ws))[:,None],js),ws)
                assert np.max(abs(ws.sum(1)-1))<1e-5 and ws.min()>=0
                assert np.max(abs(ws[~eligible]-original[~eligible]))==0
                assert np.max(abs((ws-original)[~allowed]))==0
            q=qr[js];r=qd[js];ref=q[np.arange(len(q)),ws.argmax(1)]
            sign=np.where(np.sum(q*ref[:,None],axis=-1)<0,-1.,1.)
            real=np.sum(q*(ws*sign)[...,None],axis=1)
            dual=np.sum(r*(ws*sign)[...,None],axis=1)
            norm=np.linalg.norm(real,axis=1);assert norm.min()>.1
            real/=norm[:,None];dual/=norm[:,None]
            dual-=real*np.sum(real*dual,axis=1)[:,None]
            conj=real.copy();conj[:,:3]*=-1
            pos=R.from_quat(real).apply(v)+2*mul(dual,conj)[:,:3]
            base_pos=geo[k]['v'];alpha=np.minimum(1,np.sum(ws*arm[js],axis=1)*2)*blend
            alpha[np.sum(ws*digit[js],axis=1)>1e-9]=0
            # One-joint identity witness: DQS and LBS are identical there.
            assert np.max(abs(pos[original.max(1)>.999999]-base_pos[original.max(1)>.999999]))<1e-5
            delta=(pos-base_pos)*alpha[:,None];out[k]['v']=base_pos+delta
            metrics[k]={'max_delta_mm':float(np.linalg.norm(delta,axis=1).max()*1000),'moved_vertices':int(np.sum(np.linalg.norm(delta,axis=1)>1e-7)),'changed_weight_vertices':int(np.sum(np.max(abs(ws-original),axis=1)>1e-7)),'max_weight_delta':float(np.max(abs(ws-original)))}
            assert np.max(abs(delta[alpha==0]))==0
        return out,metrics
    def smooth_skin(doc,geo,iterations,cap,guarded=False,reference=None):
        from scipy.sparse import coo_matrix
        k='ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0';b=geo[k]
        node=doc['nodes'][names[k]];pr=doc['meshes'][node['mesh']]['primitives'][0];at=pr['attributes']
        js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=np.array([doc['nodes'][i]['name'] for i in doc['skins'][node['skin']]['joints']])
        arm=np.array([n.startswith(('clavicle_','upperarm_','lowerarm_','hand_')) for n in jn])
        digits=np.array([n.startswith(('thumb_','index_','middle_','ring_','pinky_')) for n in jn])
        allowed=(np.sum(ws*arm[js],axis=1)>.05)&(np.sum(ws*digits[js],axis=1)<1e-9)
        active=np.flatnonzero(np.any(allowed[b['tri']],axis=1))
        detail=contacts(b,b,active,True)
        if not detail['pairs']:
            return {key:dict(v) for key,v in geo.items()},{'unique_vertices':0,'max_delta_mm':0.,'edge_ratio_min':1.,'edge_ratio_max':1.,'normal_reversals':0}
        _,first,canon=np.unique(b['canon'],return_index=True,return_inverse=True)
        p=b['v'][first];ct=canon[b['tri']]
        assert np.max(abs(p[canon]-b['v']))<1e-6
        edges=np.sort(np.concatenate((ct[:,[0,1]],ct[:,[1,2]],ct[:,[2,0]])),axis=1);edges=edges[edges[:,0]!=edges[:,1]]
        edges,count=np.unique(edges,axis=0,return_counts=True)
        i,j=edges.T
        adj=coo_matrix((np.ones(len(i)*2),(np.r_[i,j],np.r_[j,i])),shape=(len(p),len(p))).tocsr()
        degree=np.asarray(adj.sum(1)).ravel()
        seeds=np.unique(ct[detail['face_ids']])
        dist=np.full(len(p),99);dist[seeds]=0
        for ring in range(1,4):
            reach=adj@(dist==ring-1).astype(float)>0
            dist[(dist==99)&reach]=ring
        strength=np.choose(np.minimum(dist,4),[1.,.8,.5,.2,0.])
        prohibited=np.unique(np.r_[canon[~allowed],edges[count==1].ravel()])
        strength[prohibited]=0
        q=p.copy()
        reference_positions=p if reference is None else reference[k]['v'][first]
        if reference is not None:
            assert np.array_equal(reference[k]['tri'],b['tri'])
            assert np.max(abs(reference_positions[canon]-reference[k]['v']))<1e-6
        p_edges=np.linalg.norm(reference_positions[j]-reference_positions[i],axis=1)
        p_tri=reference_positions[ct];p_norm=np.cross(p_tri[:,1]-p_tri[:,0],p_tri[:,2]-p_tri[:,0])
        norm0=np.linalg.norm(p_norm,axis=1)
        def violations(v):
            lengths=np.linalg.norm(v[j]-v[i],axis=1)
            bad_edges=(p_edges>1e-9)&((lengths<p_edges*.5-1e-12)|(lengths>p_edges*2+1e-12))
            t=v[ct];n=np.cross(t[:,1]-t[:,0],t[:,2]-t[:,0])
            nl=np.linalg.norm(n,axis=1)
            bad_faces=(norm0>1e-12)&((np.sum(n*p_norm,axis=1)<.1*nl*norm0)|(nl<.1*norm0))
            return np.unique(np.r_[edges[bad_edges].ravel(),ct[bad_faces].ravel()])
        if guarded:assert not len(violations(q)), 'Initial geometry violates common reference gate'
        for _ in range(iterations):
            proposal=q+((adj@q)/np.maximum(degree,1)[:,None]-q)*strength[:,None]*.45
            delta=proposal-p;length=np.linalg.norm(delta,axis=1)
            proposal=p+delta*np.minimum(1,cap/np.maximum(length,1e-12))[:,None]
            if guarded:
                # Reject local changes that introduce face reversal or excessive edge strain.
                # All quality bounds are relative to the original DQS pose, not each step.
                for backtrack in range(14):
                    bad=violations(proposal)
                    if not len(bad):break
                    proposal[bad]=(proposal[bad]+q[bad])*.5
                if len(violations(proposal)):proposal=q.copy()
                assert not len(violations(proposal))
            q=proposal
        delta=q-p;assert np.max(abs(delta[prohibited]))==0
        result={key:dict(v) for key,v in geo.items()};result[k]['v']=q[canon]
        # Check edge changes and triangle normal reversals relative to the DQS pose.
        old=p[edges[:,1]]-p[edges[:,0]];new=q[edges[:,1]]-q[edges[:,0]]
        changed=(strength[edges[:,0]]>0)|(strength[edges[:,1]]>0)
        lengths=np.linalg.norm(old,axis=1);ratios=np.linalg.norm(new[changed],axis=1)/np.maximum(lengths[changed],1e-9)
        a0=p[ct];a1=q[ct];n0=np.cross(a0[:,1]-a0[:,0],a0[:,2]-a0[:,0]);n1=np.cross(a1[:,1]-a1[:,0],a1[:,2]-a1[:,0])
        valid=(np.linalg.norm(n0,axis=1)>1e-12)&(np.linalg.norm(n1,axis=1)>1e-12)
        flipped=int(np.sum(valid&(np.sum(n0*n1,axis=1)<0)))
        return result,{'unique_vertices':int(np.sum(np.linalg.norm(delta,axis=1)>1e-7)),'max_delta_mm':float(np.linalg.norm(delta,axis=1).max()*1000),'edge_ratio_min':float(ratios.min()),'edge_ratio_max':float(ratios.max()),'normal_reversals':flipped}
    def quality_relative(reference,candidate):
        result={}
        for k in ('ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0','W28e_tailored_linen'):
            t=reference[k]['tri'];a0=reference[k]['v'][t];a1=candidate[k]['v'][t]
            n0=np.cross(a0[:,1]-a0[:,0],a0[:,2]-a0[:,0]);n1=np.cross(a1[:,1]-a1[:,0],a1[:,2]-a1[:,0])
            l0=np.linalg.norm(n0,axis=1);l1=np.linalg.norm(n1,axis=1);valid=l0>1e-12
            e0=np.linalg.norm(a0[:,[1,2,0]]-a0,axis=2);e1=np.linalg.norm(a1[:,[1,2,0]]-a1,axis=2)
            ratio=e1[e0>1e-9]/e0[e0>1e-9]
            result[k]={'relative_normal_reversals':int(np.sum(valid&(np.sum(n0*n1,axis=1)<0))),
                       'area_below_tenth':int(np.sum(valid&(l1<.1*l0))),
                       'edge_min':float(ratio.min()),'edge_max':float(ratio.max())}
        return result
    def quality_gate(q,au):
        return all(v['relative_normal_reversals']==0 and v['area_below_tenth']==0 and v['edge_min']>=.5 and v['edge_max']<=2 for v in q.values()) and not au['scene'] and not au['other_actor']
    rows=[];best=None
    def trial(pole,corr,twist):
        nonlocal best
        deadline();doc,geo,info,err=build(pole,corr,twist);au=audit(geo)
        count=sum(au[k] for k in ('skin_self','tunic_self','skin_tunic'))+sum(au['scene'].values())+sum(au['other_actor'].values())
        row={'pole_deg':pole,'twist':twist,'old_sleeve_correction':corr,'arm':info,'matrix_error':err,'audit':au,'crossings':count}
        rows.append(row);print(json.dumps({'pole':pole,'twist':twist,'count':count,'skin':au['skin_self'],'cloth':au['tunic_self'],'skin_cloth':au['skin_tunic'],'scene':au['scene'],'skin_regions':au['skin_regions']}),flush=True)
        if best is None or (bool(au['scene']),count)<(bool(best[0]['audit']['scene']),best[0]['crossings']):best=(row,doc)
    if args.stance_mm is not None:
        assert 0<=args.stance_mm<=160
        shift=np.array([0.,0.,args.stance_mm/1000])
        prior=json.loads((root/'W34zh-arm-refine-0-20261127/w34zg-report.json').read_text())
        seed=prior['best']
        doc,geo,info,err=build(seed['pole_deg'],seed['old_sleeve_correction'],seed['twist'],{'l':30,'r':-30},shift)
        dq0,_=dq_geometry(doc,geo,(1.,1.))
        key='ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0'
        def full_scene(candidate):
            actor=merged(candidate.values());at=actor['v'][actor['tri']]
            lo=at.min(axis=1);hi=at.max(axis=1);amin=lo.min(0);amax=hi.max(0)
            groups={'floor':[],'basket':[],'room':[]}
            for k,v in hg.items():
                if np.any((v['v'].min(0)>amax+1e-8)|(v['v'].max(0)<amin-1e-8)):continue
                kind='floor' if k in ('Room_floor_earthen','Courtyard_earthen_ground') else 'basket' if v['basket'] else 'room'
                groups[kind].append(v)
            result={}
            for kind,items in groups.items():
                if not items:result[kind]=0;continue
                prop=merged(items);bt=prop['v'][prop['tri']]
                mask=np.all((bt.min(1)<=amax+1e-8)&(bt.max(1)>=amin-1e-8),axis=1)
                prop=dict(prop,tri=prop['tri'][mask],region=prop['region'][mask])
                if not len(prop['tri']):result[kind]=0;continue
                bt=prop['v'][prop['tri']]
                active=np.flatnonzero(np.all((lo<=bt.max(axis=(0,1))+1e-8)&(hi>=bt.min(axis=(0,1))-1e-8),axis=1))
                result[kind]=contacts(actor,prop,active)['pairs']
            # Check every near-floor foot vertex against actual floor triangles by
            # vertical barycentric interpolation, not a nominal plane.
            floors=merged([hg[k] for k in ('Room_floor_earthen','Courtyard_earthen_ground')])
            ft=floors['v'][floors['tri']];xz=ft[:,:,[0,2]]
            u=xz[:,1]-xz[:,0];v=xz[:,2]-xz[:,0];den=u[:,0]*v[:,1]-u[:,1]*v[:,0]
            valid=abs(den)>1e-12
            points=candidate[key]['v'];points=points[points[:,1]<.015]
            gaps=[]
            for point in points:
                q=point[[0,2]]-xz[:,0]
                s=np.divide(q[:,0]*v[:,1]-q[:,1]*v[:,0],den,out=np.zeros_like(den),where=valid)
                t=np.divide(u[:,0]*q[:,1]-u[:,1]*q[:,0],den,out=np.zeros_like(den),where=valid)
                ok=valid&(s>=-1e-8)&(t>=-1e-8)&(s+t<=1+1e-8)
                heights=ft[:,0,1]+s*(ft[:,1,1]-ft[:,0,1])+t*(ft[:,2,1]-ft[:,0,1])
                ok&=heights<point[1]+.05
                if np.any(ok):gaps.append(float(point[1]-heights[ok].max()))
            result['near_floor_vertices']=len(points);result['floor_ray_matches']=len(gaps)
            result['min_floor_gap_mm']=min(gaps)*1000 if gaps else None
            result['below_floor_half_mm']=sum(v<-.0005 for v in gaps)
            return result
        digit_meta=None
        if args.digit_area_factor is not None:
            b=dq0[key];tri=b['tri'];canon=b['canon'];q=b['v'].copy()
            delta=np.zeros_like(q);witness=[]
            node=d['nodes'][names[key]];mesh=d['meshes'][node['mesh']];pr=mesh['primitives'][0];at=pr['attributes']
            rest=a(at['POSITION']).astype(float)
            for weight,t in zip(node.get('weights',mesh.get('weights',[])),pr.get('targets',[])):
                if weight:rest+=weight*a(t['POSITION'])
            def ratio(fi,points):
                vv=points[tri[fi]];rr=rest[tri[fi]]
                return float(np.linalg.norm(np.cross(vv[1]-vv[0],vv[2]-vv[0]))/np.linalg.norm(np.cross(rr[1]-rr[0],rr[2]-rr[0])))
            selected=[]
            for fi in (5715,16988):
                ids=tri[fi];vv=q[ids];pairs=((0,1),(1,2),(2,0))
                i,j=min(pairs,key=lambda ij:np.linalg.norm(vv[ij[1]]-vv[ij[0]]))
                edge=vv[j]-vv[i];correction=.5*(args.digit_area_factor-1)*edge
                ii=np.flatnonzero(canon==canon[ids[i]]);jj=np.flatnonzero(canon==canon[ids[j]])
                assert not set(selected)&set(np.r_[ii,jj]);selected.extend(np.r_[ii,jj].tolist())
                delta[ii]-=correction;delta[jj]+=correction
                witness.append({'face':fi,'canonical_edge':[int(canon[ids[i]]),int(canon[ids[j]])],'original_edge_mm':float(np.linalg.norm(edge)*1000),'area_ratio_before':ratio(fi,q)})
            q+=delta
            for rec in witness:rec['area_ratio_after']=ratio(rec['face'],q)
            corrected={k:dict(v) for k,v in dq0.items()};corrected[key]['v']=q
            digit_meta={'factor':args.digit_area_factor,'unique_vertices':len(set(canon[selected].tolist())),'max_delta_mm':float(np.linalg.norm(delta,axis=1).max()*1000),'faces':witness}
            configs=[('digit_area',corrected)]
        else:configs=[('dq',dq0)]
        if not args.stance_dq_only:configs.append(('guarded',smooth_skin(doc,dq0,6,.006,True)[0]))
        def bind_strain(candidate):
            from collections import Counter
            out={}
            for k in (key,'W28e_tailored_linen'):
                n=d['nodes'][names[k]];mesh=d['meshes'][n['mesh']];pr=mesh['primitives'][0];at=pr['attributes']
                v=a(at['POSITION']).astype(float)
                for weight,t in zip(n.get('weights',mesh.get('weights',[])),pr.get('targets',[])):
                    if weight:v+=weight*a(t['POSITION'])
                js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=np.array([d['nodes'][i]['name'] for i in d['skins'][n['skin']]['joints']])
                dom=jn[js[np.arange(len(js)),ws.argmax(1)]];tri=candidate[k]['tri']
                def area(vv):
                    t=vv[tri];return np.linalg.norm(np.cross(t[:,1]-t[:,0],t[:,2]-t[:,0]),axis=1)
                a0=area(v);a1=area(candidate[k]['v']);old=(a0>1e-12)&(area(g[k]['v'])<.1*a0)
                bad=(a0>1e-12)&(a1<.1*a0)
                out[k]={'severe':int(bad.sum()),'new':int((bad&~old).sum()),'regions':dict(Counter(dom[tri[bad,0]].tolist())),'face_ids':np.flatnonzero(bad).tolist()}
            return out
        for label,candidate in configs:
            deadline();au=audit(candidate,shift);q=quality_relative(dq0,candidate);scene=full_scene(candidate)
            count=sum(au[k] for k in ('skin_self','tunic_self','skin_tunic'))+sum(au['other_actor'].values())
            gate=quality_gate(q,au) and scene['basket']==scene['room']==scene['below_floor_half_mm']==0 and scene['floor_ray_matches']==scene['near_floor_vertices'] and scene['near_floor_vertices']>0
            strain=bind_strain(candidate)
            if digit_meta is not None:gate=gate and strain[key]['new']==0 and strain['W28e_tailored_linen']['new']==0
            row={'method':label,'stance_mm':args.stance_mm,'crossings':count,'quality_gate':bool(gate),'full_scene':scene,'quality':q,'bind_strain':strain,'audit':au,'arm':info,'matrix_error':err}
            if digit_meta is not None:row['digit_area']=digit_meta
            rows.append(row);print(json.dumps(row),flush=True)
            if best is None or (not gate,count)<(not best[0]['quality_gate'],best[0]['crossings']):best=(row,doc)
        if args.stance_mm==0:assert rows[0]['crossings']=={0:69,30:81,60:95}[int(args.distance)]
        if args.export_diagnostic:
            from probe_w34zx_static_export import export_static
            assert rows[0]['quality_gate'] and rows[0]['crossings']==0
            out.mkdir()
            ex,loaded=export_static(src,doc,a,dq0,out/'w34zx-static-actor.glb')
            au=audit(loaded,shift);scene=full_scene(loaded)
            assert not any(au[k] for k in ('skin_self','tunic_self','skin_tunic','scene','other_actor'))
            assert scene['basket']==scene['room']==scene['below_floor_half_mm']==0
            assert bind_strain(loaded)==rows[0]['bind_strain']
            report={'status':'ART_HOLD_STATIC_DQ_DIAGNOSTIC','source_sha256':r['glb_sha256'],'distance_mm':args.distance,'stance_mm':args.stance_mm,'export':ex,'reimport_audit':au,'full_scene':scene,'bind_strain':bind_strain(loaded),'limitations':['Static pose-specific morph only. No animation, physical grip or visual acceptance. Two digit-region and six inherited cloth faces severely compressed. Existing unrelated toe/floor residual not waived.']}
            (out/'w34zx-export.json').write_text(json.dumps(report,indent=2))
            print(json.dumps(report),flush=True);return
    elif args.separate:
        from probe_w34zt_separation import separate_skin
        prior=json.loads((root/'W34zh-arm-refine-0-20261127/w34zg-report.json').read_text())
        seed=prior['best'];doc,geo,info,err=build(seed['pole_deg'],seed['old_sleeve_correction'],seed['twist'],{'l':30,'r':-30})
        dq0,_=dq_geometry(doc,geo,(1.,1.));start,_=smooth_skin(doc,dq0,6,.006,True)
        key='ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0';n=d['nodes'][names[key]];pr=d['meshes'][n['mesh']]['primitives'][0];at=pr['attributes']
        rest=a(at['POSITION']).astype(float)
        for weight,t in zip(n.get('weights',d['meshes'][n['mesh']].get('weights',[])),pr.get('targets',[])):
            if weight:rest+=weight*a(t['POSITION'])
        js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=np.array([d['nodes'][i]['name'] for i in d['skins'][n['skin']]['joints']])
        arm=np.array([name.startswith(('clavicle_','upperarm_','lowerarm_','hand_')) for name in jn])
        digits=np.array([name.startswith(('thumb_','index_','middle_','ring_','pinky_')) for name in jn])
        allowed=(np.sum(ws*arm[js],axis=1)>.05)&(np.sum(ws*digits[js],axis=1)<1e-9)
        tri=start[key]['tri']
        def areas(v):
            t=v[tri];return np.linalg.norm(np.cross(t[:,1]-t[:,0],t[:,2]-t[:,0]),axis=1)
        ar=areas(rest);old=(ar>1e-12)&(areas(start[key]['v'])<.1*ar)
        for steps,cap,gain in ((0,0,0),(3,.003,0),(6,.005,.35),(10,.007,.5)):
            deadline();candidate={k:dict(v) for k,v in start.items()};history=[]
            if steps:candidate[key],history=separate_skin(start[key],rest,allowed,dq0[key],steps,cap,gain)
            au=audit(candidate);q=quality_relative(dq0,candidate);gate=quality_gate(q,au)
            severe=(ar>1e-12)&(areas(candidate[key]['v'])<.1*ar)
            gate=gate and not np.any(severe&~old)
            count=sum(au[k] for k in ('skin_self','tunic_self','skin_tunic'))+sum(au['scene'].values())+sum(au['other_actor'].values())
            row={'steps':steps,'cap_mm':cap*1000,'edge_gain':gain,'crossings':count,'quality_gate':bool(gate),'severe_skin_faces':int(severe.sum()),'new_severe_skin_faces':int((severe&~old).sum()),'quality':q,'audit':au,'history':history}
            rows.append(row);print(json.dumps({'steps':steps,'crossings':count,'gate':bool(gate),'severe':int(severe.sum()),'history':history}),flush=True)
            if best is None or (not gate,count)<(not best[0]['quality_gate'],best[0]['crossings']):best=(row,doc)
        assert rows[0]['crossings']=={0:44,30:57,60:74}[int(args.distance)]
    elif args.upper_combined:
        from collections import Counter
        prior=json.loads((root/'W34zh-arm-refine-0-20261127/w34zg-report.json').read_text())
        seed=prior['best'];doc,geo,info,err=build(seed['pole_deg'],seed['old_sleeve_correction'],seed['twist'])
        baseline,_=dq_geometry(doc,geo,(1.,1.))
        # Same shoulder axial compensation and correction settings in all poses.
        doc2,geo2,info2,err2=build(seed['pole_deg'],seed['old_sleeve_correction'],seed['twist'],{'l':30,'r':-30})
        dq2,_=dq_geometry(doc2,geo2,(1.,1.))
        weighted,_=dq_geometry(doc2,geo2,(1.,1.),1.,1)
        def strain_witness(candidate):
            result={}
            for k in ('ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0','W28e_tailored_linen'):
                n=d['nodes'][names[k]];pr=d['meshes'][n['mesh']]['primitives'][0];at=pr['attributes']
                v=a(at['POSITION']).astype(float)
                for weight,t in zip(n.get('weights',d['meshes'][n['mesh']].get('weights',[])),pr.get('targets',[])):
                    if weight:v+=weight*a(t['POSITION'])
                js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=np.array([d['nodes'][i]['name'] for i in d['skins'][n['skin']]['joints']])
                dom=jn[js[np.arange(len(js)),ws.argmax(1)]];tri=candidate[k]['tri'];p0=v[tri];p1=candidate[k]['v'][tri]
                area=lambda p:np.linalg.norm(np.cross(p[:,1]-p[:,0],p[:,2]-p[:,0]),axis=1)
                a0=area(p0);a1=area(p1);previous=area(g[k]['v'][tri])
                severe=(a0>1e-12)&(a1<.1*a0);old=(a0>1e-12)&(previous<.1*a0)
                region=dom[tri[:,0]]
                result[k]={'severe_area_faces':int(severe.sum()),'already_severe_in_previous_static':int((severe&old).sum()),
                           'new_severe_vs_previous_static':int((severe&~old).sum()),'previous_static_severe':int(old.sum()),
                           'regions':dict(Counter(region[severe].tolist())),'face_ids':np.flatnonzero(severe).tolist()}
            return result
        configs=[('prior_combined',baseline,doc,6,.006,True),('twist_dq',dq2,doc2,0,0,False),('twist_guarded',dq2,doc2,6,.006,False),('twist_weight',weighted,doc2,0,0,False),('twist_combined',weighted,doc2,6,.006,False)]
        for label,source,pose,iterations,cap,prior_mode in configs:
            deadline()
            ref=baseline if prior_mode else dq2
            if prior_mode:source=dq_geometry(doc,geo,(1.,1.),1.,1)[0]
            candidate=source if not iterations else smooth_skin(pose,source,iterations,cap,True,ref)[0]
            au=audit(candidate);q=quality_relative(ref,candidate);gate=quality_gate(q,au);absolute=strain_witness(candidate)
            count=sum(au[k] for k in ('skin_self','tunic_self','skin_tunic'))+sum(au['scene'].values())+sum(au['other_actor'].values())
            row={'method':label,'crossings':count,'quality_gate_relative_to_own_dq':gate,'quality':q,'absolute_strain':absolute,'audit':au}
            rows.append(row);print(json.dumps({'method':label,'crossings':count,'gate':gate,'strain':{k:{kk:vv for kk,vv in v.items() if kk!='face_ids'} for k,v in absolute.items()},'scene':au['scene']}),flush=True)
            if best is None or (not gate,count)<(not best[0]['quality_gate_relative_to_own_dq'],best[0]['crossings']):best=(row,pose)
        assert rows[0]['crossings']=={0:56,30:87,60:99}[int(args.distance)]
        assert rows[1]['crossings']=={0:69,30:81,60:95}[int(args.distance)]
    elif args.upper_twist:
        prior=json.loads((root/'W34zh-arm-refine-0-20261127/w34zg-report.json').read_text())
        seed=prior['best']
        # A common set of offsets for all three sampled wrist positions.
        for l,r0 in [(0,0),(-15,15),(15,-15),(-30,30),(30,-30),(-30,0),(0,30),(30,0),(0,-30)]:
            deadline();doc,geo,info,err=build(seed['pole_deg'],seed['old_sleeve_correction'],seed['twist'],{'l':l,'r':r0})
            gg,_=dq_geometry(doc,geo,(1.,1.));au=audit(gg)
            count=sum(au[k] for k in ('skin_self','tunic_self','skin_tunic'))+sum(au['scene'].values())+sum(au['other_actor'].values())
            strain={}
            for k in ('ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0','W28e_tailored_linen'):
                n=d['nodes'][names[k]];pr=d['meshes'][n['mesh']]['primitives'][0]
                v=a(pr['attributes']['POSITION']).astype(float)
                for weight,t in zip(n.get('weights',d['meshes'][n['mesh']].get('weights',[])),pr.get('targets',[])):
                    if weight:v+=weight*a(t['POSITION'])
                tri=gg[k]['tri'];p0=v[tri];p1=gg[k]['v'][tri]
                e0=np.linalg.norm(p0[:,[1,2,0]]-p0,axis=2);e1=np.linalg.norm(p1[:,[1,2,0]]-p1,axis=2)
                ratio=e1[e0>1e-9]/e0[e0>1e-9]
                n0=np.linalg.norm(np.cross(p0[:,1]-p0[:,0],p0[:,2]-p0[:,0]),axis=1)
                n1=np.linalg.norm(np.cross(p1[:,1]-p1[:,0],p1[:,2]-p1[:,0]),axis=1)
                strain[k]={'edge_ratio_quantiles':np.quantile(ratio,[0,.01,.5,.99,1]).tolist(),
                           'area_below_tenth':int(np.sum((n0>1e-12)&(n1<.1*n0)))}
            row={'upper_twist_deg':{'l':l,'r':r0},'crossings':count,'audit':au,'bind_relative_strain':strain,'arm':info,'matrix_error':err}
            rows.append(row);print(json.dumps({'upper_twist_deg':row['upper_twist_deg'],'crossings':count,'skin':au['skin_self'],'cloth':au['skin_tunic'],'scene':au['scene'],'strain':strain}),flush=True)
            if best is None or (bool(au['scene']),count)<(bool(best[0]['audit']['scene']),best[0]['crossings']):best=(row,doc)
        assert rows[0]['crossings']=={0:80,30:107,60:128}[int(args.distance)]
    elif args.topology_witness:
        from scipy.sparse import coo_matrix
        from scipy.sparse.csgraph import connected_components
        from collections import Counter
        prior=json.loads((root/'W34zh-arm-refine-0-20261127/w34zg-report.json').read_text())
        seed=prior['best'];doc,geo,info,err=build(seed['pole_deg'],seed['old_sleeve_correction'],seed['twist'])
        baseline,_=dq_geometry(doc,geo,(1.,1.))
        weighted,_=dq_geometry(doc,geo,(1.,1.),1.,1)
        combined,_=smooth_skin(doc,weighted,6,.006,True,baseline)
        key='ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0';b=g[key]
        node=d['nodes'][names[key]];pr=d['meshes'][node['mesh']]['primitives'][0];at=pr['attributes']
        rest=a(at['POSITION']).astype(float);js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']).astype(float)
        jnames=np.array([d['nodes'][i]['name'] for i in d['skins'][node['skin']]['joints']])
        dom=jnames[js[np.arange(len(js)),ws.argmax(1)]]
        arm=np.array([n.startswith(('clavicle_','upperarm_','lowerarm_','hand_','thumb_','index_','middle_','ring_','pinky_')) for n in jnames])
        active=np.flatnonzero(np.any((np.sum(ws*arm[js],axis=1)>1e-9)[b['tri']],axis=1))
        tri=b['tri'];_,first,canon=np.unique(b['canon'],return_index=True,return_inverse=True)
        ct=canon[tri]
        edges=np.sort(np.concatenate((ct[:,[0,1]],ct[:,[1,2]],ct[:,[2,0]])),axis=1)
        e,count=np.unique(edges,axis=0,return_counts=True)
        unique_faces,face_count=np.unique(np.sort(ct,axis=1),axis=0,return_counts=True)
        i,j=e.T;adj=coo_matrix((np.ones(len(i)*2),(np.r_[i,j],np.r_[j,i])),shape=(len(first),len(first))).tocsr()
        num,labels=connected_components(adj,directed=False)
        topology={'export_vertices':len(rest),'canonical_vertices':len(first),'faces':len(tri),'components':int(num),'component_sizes':sorted(np.bincount(labels).tolist(),reverse=True)[:12],
                  'boundary_edges':int(np.sum(count==1)),'nonmanifold_edges':int(np.sum(count>2)),'duplicate_canonical_faces':int(np.sum(face_count-1)),
                  'zero_area_rest_faces':int(np.sum(np.linalg.norm(np.cross(rest[tri[:,1]]-rest[tri[:,0]],rest[tri[:,2]]-rest[tri[:,0]]),axis=1)<1e-12))}
        regions=dom[tri[:,0]];states={}
        rest_morph=rest.copy()
        mesh=d['meshes'][node['mesh']]
        for wt,t in zip(node.get('weights',mesh.get('weights',[])),pr.get('targets',[])):
            if wt:rest_morph+=wt*a(t['POSITION'])
        for label,v in [('bind',rest),('bind_morph',rest_morph),('previous_static',b['v']),('linear',geo[key]['v']),('dq',baseline[key]['v']),('combined',combined[key]['v'])]:
            deadline();part=dict(b,v=v,region=regions)
            detail=contacts(part,part,active,True,include_pairs=True)
            pairs={tuple(sorted(q)) for q in detail['pair_ids']}
            assert len(pairs)==detail['pairs']
            states[label]={'pairs':pairs,'regions':detail['source_regions']}
        pairs=states['combined']['pairs'];bind=states['bind']['pairs'];bm=states['bind_morph']['pairs'];previous=states['previous_static']['pairs']
        local=[]
        # A two-edge topological neighborhood is a diagnostic of local folding,
        # not proof that a proper intersection is harmless.
        nbr=[set(adj.indices[adj.indptr[i]:adj.indptr[i+1]]) for i in range(len(first))]
        for i,j in sorted(pairs):
            vi=set(ct[i]);vj=set(ct[j]);near=set().union(*(nbr[k] for k in vi))
            near2=set().union(*(nbr[k] for k in near)) if near else set()
            local.append({'faces':[i,j],'region_pair':sorted([str(regions[i]),str(regions[j])]),
                          'within_one_edge':bool(near&vj),'within_two_edges':bool((near|near2)&vj),
                          'rest_centroid_separation_mm':float(np.linalg.norm(rest[tri[i]].mean(0)-rest[tri[j]].mean(0))*1000),
                          'in_bind':(i,j) in bind,'in_bind_morph':(i,j) in bm,'in_previous_static':(i,j) in previous})
        result={'status':'ART_HOLD_TOPOLOGY_WITNESS','distance_mm':args.distance,'source_sha256':r['glb_sha256'],'topology':topology,
                'active_triangles':len(active),'state_counts':{k:len(v['pairs']) for k,v in states.items()},
                'combined_in_bind':len(pairs&bind),'combined_in_bind_morph':len(pairs&bm),'combined_in_previous_static':len(pairs&previous),
                'combined_within_one_edge':sum(q['within_one_edge'] for q in local),'combined_within_two_edges':sum(q['within_two_edges'] for q in local),
                'region_pairs':dict(Counter('/'.join(q['region_pair']) for q in local)),'residual_pairs':local,
                'limitations':['Canonical weld includes position, original weights and morph state. Proper noncoplanar intersections exclude shared canonical vertices, not all topology defects. Local fold neighborhood is not a waiver.']}
        out.mkdir();(out/'w34zq-topology.json').write_text(json.dumps(result,indent=2))
        print(json.dumps({k:v for k,v in result.items() if k!='residual_pairs'}),flush=True);return
    elif args.combined or args.shared_reference:
        prior=json.loads((root/'W34zh-arm-refine-0-20261127/w34zg-report.json').read_text())
        seed=prior['best'];doc,geo,info,err=build(seed['pole_deg'],seed['old_sleeve_correction'],seed['twist'])
        baseline,_=dq_geometry(doc,geo,(1.,1.))
        weighted,_=dq_geometry(doc,geo,(1.,1.),1.,1)
        for label,source,iterations,cap in [('dq',baseline,0,0),('guarded',baseline,6,.006),('weight',weighted,0,0),('combined2',weighted,2,.002),('combined4',weighted,4,.004),('combined6',weighted,6,.006)]:
            deadline()
            candidate=source if not iterations else smooth_skin(doc,source,iterations,cap,True,baseline if args.shared_reference else None)[0]
            au=audit(candidate);q=quality_relative(baseline,candidate)
            count=sum(au[k] for k in ('skin_self','tunic_self','skin_tunic'))+sum(au['scene'].values())+sum(au['other_actor'].values())
            gate=quality_gate(q,au)
            row={'method':label,'iterations':iterations,'cap_mm':cap*1000,'quality':q,'quality_gate':gate,'crossings':count,'audit':au}
            rows.append(row);print(json.dumps({'method':label,'crossings':count,'quality_gate':gate,'quality':q}),flush=True)
            if best is None or (not gate,count)<(not best[0]['quality_gate'],best[0]['crossings']):best=(row,doc)
        assert rows[0]['crossings']=={0:80,30:107,60:128}[int(args.distance)]
    elif args.weight_trial:
        prior=json.loads((root/'W34zh-arm-refine-0-20261127/w34zg-report.json').read_text())
        seed=prior['best'];doc,geo,info,err=build(seed['pole_deg'],seed['old_sleeve_correction'],seed['twist'])
        baseline,_=dq_geometry(doc,geo,(1.,1.))
        for gamma,steps in ((1.,0),(.7,0),(1.4,0),(1.,1),(1.,3),(.7,2)):
            deadline();gg,metrics=dq_geometry(doc,geo,(1.,1.),gamma,steps);au=audit(gg)
            quality=quality_relative(baseline,gg)
            count=sum(au[k] for k in ('skin_self','tunic_self','skin_tunic'))+sum(au['scene'].values())+sum(au['other_actor'].values())
            gate=quality_gate(quality,au)
            row={'gamma':gamma,'smooth_steps':steps,'delta':metrics,'quality':quality,'quality_gate':gate,'audit':au,'crossings':count}
            rows.append(row);print(json.dumps(row),flush=True)
            if best is None or (not gate,count)<(not best[0]['quality_gate'],best[0]['crossings']):best=(row,doc)
        assert rows[0]['crossings']=={0:80,30:107,60:128}[int(args.distance)]
    elif args.smooth or args.guarded_smooth:
        prior=json.loads((root/'W34zh-arm-refine-0-20261127/w34zg-report.json').read_text())
        seed=prior['best'];doc,geo,info,err=build(seed['pole_deg'],seed['old_sleeve_correction'],seed['twist'])
        gg,metrics=dq_geometry(doc,geo,(1.,1.))
        for iterations,cap in ((0,0),(2,.002),(4,.004),(6,.006),(8,.008)):
            deadline()
            if iterations:result,sm=smooth_skin(doc,gg,iterations,cap,args.guarded_smooth)
            else:result,sm=gg,{'unique_vertices':0,'max_delta_mm':0,'edge_ratio_min':1,'edge_ratio_max':1,'normal_reversals':0}
            au=audit(result)
            count=sum(au[k] for k in ('skin_self','tunic_self','skin_tunic'))+sum(au['scene'].values())+sum(au['other_actor'].values())
            row={'iterations':iterations,'cap_mm':cap*1000,'correction':sm,'arm':info,'audit':au,'crossings':count}
            rows.append(row);print(json.dumps(row),flush=True)
            if best is None or (bool(au['scene']),count)<(bool(best[0]['audit']['scene']),best[0]['crossings']):best=(row,doc)
        assert rows[0]['crossings']=={0:80,30:107,60:128}[int(args.distance)]
        if args.guarded_smooth:
            assert all(row['correction']['normal_reversals']==0 for row in rows)
            # Tiny edges below the explicit 1e-9m tolerance are not strain-certified.
        else:
            # Collision-minimizing rows are diagnostic, not accepted geometry.
            for row in rows:row['quality_gate_failed']=bool(row['correction']['normal_reversals'] or row['correction']['edge_ratio_min']<.5 or row['correction']['edge_ratio_max']>2)

    elif args.dq:
        prior=json.loads((root/'W34zh-arm-refine-0-20261127/w34zg-report.json').read_text())
        assert prior['source_sha256']==r['glb_sha256']
        seed=prior['best'];doc,geo,info,err=build(seed['pole_deg'],seed['old_sleeve_correction'],seed['twist'])
        for amount in ((0.,0.),(.5,0.),(1.,0.),(.5,.5),(1.,1.)):
            deadline();gg,metrics=dq_geometry(doc,geo,amount);au=audit(gg)
            count=sum(au[k] for k in ('skin_self','tunic_self','skin_tunic'))+sum(au['scene'].values())+sum(au['other_actor'].values())
            row={'dq_blend':amount,'delta':metrics,'arm':info,'matrix_error':err,'audit':au,'crossings':count}
            rows.append(row);print(json.dumps(row),flush=True)
            if best is None or (bool(au['scene']),count)<(bool(best[0]['audit']['scene']),best[0]['crossings']):best=(row,doc)
        assert rows[0]['crossings']=={0:97,30:126,60:164}[int(args.distance)]
    elif args.path_witness:
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
    out.mkdir();report={'status':'ART_HOLD_FULL_ARM_RECONNECTION','source_sha256':r['glb_sha256'],'distance_mm':args.distance,'dq_trial':args.dq,'smooth_trial':args.smooth,'guarded_smooth_trial':args.guarded_smooth,'weight_trial':args.weight_trial,'combined_trial':args.combined,'shared_reference_trial':args.shared_reference,'upper_twist_trial':args.upper_twist,'upper_combined_trial':args.upper_combined,'separation_trial':args.separate,'stance_mm':args.stance_mm,'rows':rows,'best':best[0],'limitations':['Changed-triangle proper noncoplanar crossing audit, not containment, swept collision, or visual proof. Static hand targets do not certify grasp. Existing unrelated toe/floor residual not included.']}
    if best[0]['crossings']==0 and not (args.dq or args.smooth or args.guarded_smooth or args.weight_trial or args.combined or args.shared_reference or args.upper_twist or args.upper_combined or args.separate or args.stance_mm is not None):
        doc=best[1];raw=src.read_bytes();jl=struct.unpack_from('<I',raw,12)[0];binchunk=raw[20+jl:];doc['asset']['generator']='HOREB W34zg full arm diagnostic'
        jb=json.dumps(doc,separators=(',',':'),ensure_ascii=True).encode();jb+=b' '*((-len(jb))%4);packed=struct.pack('<5I',0x46546c67,2,20+len(jb)+len(binchunk),len(jb),0x4e4f534a)+jb+binchunk
        f=out/'w34zg-static-actor.glb';f.write_bytes(packed);report['glb_sha256']=hashlib.sha256(packed).hexdigest();load(f,report['glb_sha256'])
    (out/'w34zg-report.json').write_text(json.dumps(report,indent=2));print(json.dumps({'best':best[0],'glb_sha256':report.get('glb_sha256')}),flush=True)
if __name__=='__main__':main()
