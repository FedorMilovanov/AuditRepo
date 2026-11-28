"""W35x: bounded local area restoration for the two new sleeve strain faces."""
import numpy as np

def correct(mesh,rest):
    tri=mesh['tri'];canon=mesh['canon'];v=mesh['v'];_,first,idx=np.unique(canon,return_index=True,return_inverse=True)
    ct=idx[tri];p=v[first].copy();q=p.copy();r=rest[first]
    assert np.max(abs(p[idx]-v))<1e-6
    def normal(points):
        t=points[ct];return np.cross(t[:,1]-t[:,0],t[:,2]-t[:,0])
    nr=normal(r);n0=normal(p);ar=np.linalg.norm(nr,axis=1);a0=np.linalg.norm(n0,axis=1)
    edges=np.sort(np.concatenate((ct[:,[0,1]],ct[:,[1,2]],ct[:,[2,0]])),axis=1)
    edges,counts=np.unique(edges[edges[:,0]!=edges[:,1]],axis=0,return_counts=True)
    boundary=set(edges[counts==1].ravel().tolist())
    es=np.linalg.norm(p[edges[:,1]]-p[edges[:,0]],axis=1)
    target=(2999,21276);history=[]
    # Correct only the target faces, with a continuous ramp above the
    # diagnostic threshold to avoid discontinuities at the onset of strain.
    for fi in target:
        ids=ct[fi];vv=q[ids];a=np.linalg.norm(np.cross(vv[1]-vv[0],vv[2]-vv[0]))
        if a>=.14*ar[fi]:continue
        assert a>1e-14 and ar[fi]>1e-12
        pairs=[(i,j) for i,j in ((0,1),(1,2),(2,0)) if ids[i] not in boundary and ids[j] not in boundary]
        assert pairs
        i,j=min(pairs,key=lambda ij:np.linalg.norm(vv[ij[1]]-vv[ij[0]]))
        factor=min(2.,.14*ar[fi]/a)
        delta=.5*(factor-1)*(vv[j]-vv[i])
        q[ids[i]]-=delta;q[ids[j]]+=delta
        history.append({'face':fi,'before_ratio':float(a/ar[fi]),'factor':float(factor),'vertices':[int(ids[i]),int(ids[j])]})
    n1=normal(q);a1=np.linalg.norm(n1,axis=1);en=np.linalg.norm(q[edges[:,1]]-q[edges[:,0]],axis=1)
    ratios=en[es>1e-9]/es[es>1e-9]
    changed=np.linalg.norm(q-p,axis=1)>1e-10
    incident=np.any(changed[ct],axis=1)
    cosine=np.sum(n0*n1,axis=1)/np.maximum(a0*a1,1e-30)
    assert np.all(cosine[incident&(a0>1e-12)]>.1), 'normal gate'
    assert np.all(a1[incident&(a0>1e-12)]>=.1*a0[incident&(a0>1e-12)]), 'relative area gate'
    assert ratios.min()>=.5 and ratios.max()<=2.00001, 'edge gate'
    assert not np.any((ar>1e-12)&(a1<.1*ar)&(a0>=.1*ar)), 'new severe faces'
    for z in history:z['after_ratio']=float(a1[z['face']]/ar[z['face']])
    return dict(mesh,v=q[idx]),{'faces':history,'changed_canonical_vertices':int(changed.sum()),'max_move_mm':float(np.linalg.norm(q-p,axis=1).max()*1000),'edge_ratio_range':[float(ratios.min()),float(ratios.max())],'min_changed_normal_cosine':float(cosine[incident&(a0>1e-12)].min()) if np.any(incident&(a0>1e-12)) else 1.}
