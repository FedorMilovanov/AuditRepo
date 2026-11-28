"""W34zt local triangle-separation diagnostic. Not a production mesh solver."""
import numpy as np
from scipy.sparse import coo_matrix
from probe_w34r_static_correction import contacts,deadline

def separate_skin(b,rest,allowed,reference,steps,cap,edge_gain):
    _,first,canon=np.unique(b['canon'],return_index=True,return_inverse=True)
    ct=canon[b['tri']]
    p=b['v'][first].copy();q=p.copy();r=rest[first];ref=reference['v'][first]
    assert np.max(abs(p[canon]-b['v']))<1e-6
    edges=np.sort(np.concatenate((ct[:,[0,1]],ct[:,[1,2]],ct[:,[2,0]])),axis=1)
    edges,count=np.unique(edges[edges[:,0]!=edges[:,1]],axis=0,return_counts=True)
    i,j=edges.T
    adj=coo_matrix((np.ones(len(i)*2),(np.r_[i,j],np.r_[j,i])),shape=(len(p),len(p))).tocsr()
    degree=np.asarray(adj.sum(1)).ravel()
    forbidden=np.unique(np.r_[canon[~allowed],edges[count==1].ravel()])
    permitted=np.ones(len(p),bool);permitted[forbidden]=False
    active=np.flatnonzero(np.any(permitted[ct],axis=1))
    # Reference gate is relative to the same uncorrected DQS pose.
    re=np.linalg.norm(ref[j]-ref[i],axis=1);rest_e=np.linalg.norm(r[j]-r[i],axis=1)
    def normals(v):
        t=v[ct];return np.cross(t[:,1]-t[:,0],t[:,2]-t[:,0])
    rn=normals(ref);rl=np.linalg.norm(rn,axis=1)
    pn=normals(p);pl=np.linalg.norm(pn,axis=1)
    rest_area=np.linalg.norm(normals(r),axis=1)
    def bad(v):
        ee=np.linalg.norm(v[j]-v[i],axis=1);n=normals(v);nl=np.linalg.norm(n,axis=1)
        be=(re>1e-9)&((ee<.5*re-1e-12)|(ee>2*re+1e-12))
        bf=(rl>1e-12)&((np.sum(n*rn,axis=1)<.1*nl*rl)|(nl<.1*rl))
        # Also do not newly collapse a face relative to bind. Existing collapsed
        # faces may improve but not lose more than 1% of their starting area.
        absolute=(rest_area>1e-12)&(nl<np.minimum(.1*rest_area,.99*pl))
        return np.unique(np.r_[edges[be].ravel(),ct[bf|absolute].ravel()])
    assert not len(bad(q))
    history=[]
    for step in range(steps):
        deadline();detail=contacts(dict(b,v=q[canon]),dict(b,v=q[canon]),active,True,include_pairs=True)
        if not detail['pairs']:break
        pairs=np.asarray(detail['pair_ids'],int);aa=ct[pairs[:,0]];bb=ct[pairs[:,1]]
        av=q[aa];bv=q[bb]
        ea=av[:,[1,2,0]]-av;eb=bv[:,[1,2,0]]-bv
        na=np.cross(ea[:,0],ea[:,1]);nb=np.cross(eb[:,0],eb[:,1])
        axes=np.concatenate((na[:,None],nb[:,None],np.cross(ea[:,:,None],eb[:,None,:]).reshape(-1,9,3)),axis=1)
        lengths=np.linalg.norm(axes,axis=2);valid=lengths>1e-12
        axes/=np.maximum(lengths,1e-12)[...,None]
        ap=np.einsum('pvc,pac->pva',av,axes);bp=np.einsum('pvc,pac->pva',bv,axes)
        positive=ap.max(1)-bp.min(1);negative=bp.max(1)-ap.min(1)
        depth=np.minimum(positive,negative);depth[~valid]=np.inf
        index=depth.argmin(1);rows=np.arange(len(pairs))
        sign=np.where(positive[rows,index]<=negative[rows,index],1.,-1.)
        direction=axes[rows,index]*sign[:,None]
        # Shift A opposite direction and B along direction, sharing the
        # displacement only among permitted vertices. Jacobi accumulation.
        amount=np.clip(depth[rows,index]+.00018,.00018,.002)
        movea=permitted[aa];moveb=permitted[bb]
        a_any=movea.any(1);b_any=moveb.any(1)
        wa=np.where(b_any,.5,1.)*a_any;wb=np.where(a_any,.5,1.)*b_any
        delta=np.zeros_like(q);hits=np.zeros(len(q))
        for faces,movable,motion in ((aa,movea,-direction*(amount*wa)[:,None]),(bb,moveb,direction*(amount*wb)[:,None])):
            np.add.at(delta,faces.ravel(),(motion[:,None]*movable[...,None]).reshape(-1,3))
            np.add.at(hits,faces.ravel(),movable.ravel().astype(float))
        delta/=np.maximum(hits,1)[:,None]
        # Spread to one ring, preserving protected digit vertices.
        near=(adj@(hits>0).astype(float))>0
        delta+=.25*(adj@delta)/np.maximum(degree,1)[:,None]
        region=(hits>0)|near
        # Restore heavily shortened bind edges locally with a bounded edge
        # projection. Do not force all posed edges to their bind lengths.
        vec=q[j]-q[i];length=np.linalg.norm(vec,axis=1)
        target=np.clip(length,.65*rest_e,1.5*rest_e)
        need=(region[i]|region[j])&(rest_e>1e-8)&(length>1e-8)
        fix=vec*np.divide(target-length,length,out=np.zeros_like(length),where=need)[:,None]
        ed=np.zeros_like(q);eh=np.zeros(len(q))
        for idx,other,direction0 in ((i,j,-fix),(j,i,fix)):
            use=need&permitted[idx]
            factor=np.where(permitted[other],.5,1.)
            np.add.at(ed,idx,direction0*(use*factor)[:,None]);np.add.at(eh,idx,use.astype(float))
        delta+=edge_gain*ed/np.maximum(eh,1)[:,None]
        delta[~permitted]=0
        proposal=q+delta*.8;diff=proposal-p
        proposal=p+diff*np.minimum(1,cap/np.maximum(np.linalg.norm(diff,axis=1),1e-12))[:,None]
        for _ in range(14):
            blocked=bad(proposal)
            if not len(blocked):break
            proposal[blocked]=(proposal[blocked]+q[blocked])*.5
        if len(bad(proposal)):proposal=q.copy()
        assert not len(bad(proposal))
        q=proposal
        history.append({'step':step+1,'before_pairs':detail['pairs'],'max_move_mm':float(np.linalg.norm(q-p,axis=1).max()*1000)})
    assert np.max(abs(q[forbidden]-p[forbidden]))==0
    return dict(b,v=q[canon]),history
