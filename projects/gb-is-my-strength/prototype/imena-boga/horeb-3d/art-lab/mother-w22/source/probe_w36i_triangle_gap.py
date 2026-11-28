"""Exact triangle-pair distance witness for bounded contact neighborhoods."""
import numpy as np
from scipy.spatial import cKDTree
from probe_w35i_rim_contact import normals

def point_face(p,t):
    a=t[:,0];ab=t[:,1]-a;ac=t[:,2]-a;n=np.cross(ab,ac);nn=np.sum(n*n,axis=1)
    w=p-a;d=np.sum(w*n,axis=1)
    proj=p-n*np.divide(d,nn,out=np.zeros_like(d),where=nn>1e-20)[:,None]
    x=proj-a;u=np.sum(ab*ab,axis=1);v=np.sum(ac*ac,axis=1);w0=np.sum(ab*ac,axis=1)
    s=np.divide(v*np.sum(x*ab,axis=1)-w0*np.sum(x*ac,axis=1),nn,out=np.zeros_like(d),where=nn>1e-20)
    r=np.divide(u*np.sum(x*ac,axis=1)-w0*np.sum(x*ab,axis=1),nn,out=np.zeros_like(d),where=nn>1e-20)
    best=np.where((nn>1e-20)&(s>=0)&(r>=0)&(s+r<=1),np.sum((proj-p)**2,axis=1),np.inf)
    for i,j in ((0,1),(1,2),(2,0)):
        e=t[:,j]-t[:,i];ee=np.sum(e*e,axis=1)
        z=np.clip(np.divide(np.sum((p-t[:,i])*e,axis=1),ee,out=np.zeros_like(d),where=ee>1e-20),0,1)
        best=np.minimum(best,np.sum((t[:,i]+z[:,None]*e-p)**2,axis=1))
    return best

def segment_interior(p,q,u,v):
    # Interior solution only; boundary cases covered by point-face tests.
    a=q-p;b=v-u;w=p-u
    aa=np.sum(a*a,axis=1);bb=np.sum(b*b,axis=1);ab=np.sum(a*b,axis=1)
    aw=np.sum(a*w,axis=1);bw=np.sum(b*w,axis=1);den=aa*bb-ab*ab
    s=np.divide(ab*bw-bb*aw,den,out=np.zeros_like(den),where=den>1e-24)
    t=np.divide(aa*bw-ab*aw,den,out=np.zeros_like(den),where=den>1e-24)
    d=w+s[:,None]*a-t[:,None]*b
    return np.where((den>1e-24)&(s>=0)&(s<=1)&(t>=0)&(t<=1),np.sum(d*d,axis=1),np.inf)

def pair_distance(a,b):
    d=np.full(len(a),np.inf)
    for i in range(3):d=np.minimum(d,np.minimum(point_face(a[:,i],b),point_face(b[:,i],a)))
    for i,j in ((0,1),(1,2),(2,0)):
        for k,l in ((0,1),(1,2),(2,0)):d=np.minimum(d,segment_interior(a[:,i],a[:,j],b[:,k],b[:,l]))
    return np.sqrt(np.maximum(d,0))

def contact_witness(body,basket,patches,limit=.0015):
    """Minimum separated-triangle gap within each patch and facing-normal witness.
    Assumes no proper triangle crossing; not a containment or signed-distance test.
    """
    t=body['v'][body['tri']];b=basket['v'][basket['tri']]
    c=b.mean(1);r=np.linalg.norm(b-c[:,None],axis=2).max(1);tree=cKDTree(c);bmin=b.min(1);bmax=b.max(1)
    bn=normals(basket['v'],basket['tri']);bn/=np.maximum(np.linalg.norm(bn,axis=1),1e-12)[:,None]
    sn=normals(body['v'],body['tri']);sn/=np.maximum(np.linalg.norm(sn,axis=1),1e-12)[:,None]
    rows={}
    for side,digit,vertex,rec in patches:
        # Use full incident triangles for every local patch vertex.
        _,first,idx=np.unique(body['canon'],return_index=True,return_inverse=True)
        mask=np.zeros(len(first),bool);mask[[v[0] for v in rec]]=True
        ids=np.flatnonzero(np.any(mask[idx[body['tri']]],axis=1))
        ii=[];jj=[]
        for i in ids:
            x=t[i];center=x.mean(0);rad=np.linalg.norm(x-center,axis=1).max()
            k=np.asarray(tree.query_ball_point(center,rad+r.max()+limit,workers=1),int)
            if not len(k):continue
            k=k[np.linalg.norm(c[k]-center,axis=1)<=rad+r[k]+limit]
            dist=np.maximum(0,np.maximum(bmin[k]-x.max(0),x.min(0)-bmax[k]))
            k=k[np.linalg.norm(dist,axis=1)<=limit+1e-10]
            ii.extend([i]*len(k));jj.extend(k.tolist())
        ii=np.array(ii,int);jj=np.array(jj,int);assert len(ii)>0
        dist=pair_distance(t[ii],b[jj]);facing=np.sum(sn[ii]*bn[jj],axis=1)
        def witness(k):
            return {'distance_mm':float(dist[k]*1000),'skin_face':int(ii[k]),'basket_face':int(jj[k]),'basket_mesh':str(basket['region'][jj[k]]),'normal_dot':float(facing[k]),'rim_normal':bn[jj[k]].tolist()}
        near=np.flatnonzero((dist<=limit)&(facing<-.5))
        rows[side+'_'+digit]={'tested_pairs':len(ii),'minimum':witness(int(dist.argmin())),'minimum_facing':witness(int(near[np.argmin(dist[near])])) if len(near) else None}
    return rows

def self_test():
    a=np.array([[[0.,0.,0.],[1,0,0],[0,1,0]]])
    assert abs(pair_distance(a,a+[0,0,.2])[0]-.2)<1e-10
    # Skew segments with interior closest points, no endpoints closest.
    d=segment_interior(np.array([[-1.,0,0]]),np.array([[1.,0,0]]),np.array([[0.,-1,.3]]),np.array([[0.,1,.3]]))
    assert abs(d[0]-.09)<1e-12
