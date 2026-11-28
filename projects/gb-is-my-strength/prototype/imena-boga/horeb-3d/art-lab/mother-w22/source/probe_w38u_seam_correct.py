"""W38t: constrained seam cloth correction on actual interpolated geometry."""
import argparse,json
from pathlib import Path
import numpy as np
from scipy.optimize import minimize
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry
from probe_w35e_playback import pose,TUNIC

FACES=(10890,10891)
def setup(root):
    f=root/'W38r-torso-20261128';r=json.loads((f/'w38a-assembly.json').read_text())
    d,a=load(f/'w38a-handoff.glb',r['sha256'])
    src=root/'W34s-sleeve-correction-20261127';s=json.loads((src/'w34s-report.json').read_text());sd,sa=load(src/'w34s-static-actor.glb',s['glb_sha256'])
    n=next(n for n in sd['nodes'] if n['name']==TUNIC);m=sd['meshes'][n['mesh']];pr=m['primitives'][0];at=pr['attributes']
    rest=sa(at['POSITION']).astype(float)
    for weight,target in zip(n.get('weights',m.get('weights',[])),pr.get('targets',[])):
        if weight:rest+=weight*sa(target['POSITION'])
    g,_=geometry(pose(d,a,2.),a,True);b=g[TUNIC];ids=np.unique(b['tri'][list(FACES)])
    assert ids.tolist()==[11127,11136,11140,11141]
    assert np.isin(b['canon'],b['canon'][ids]).sum()==4
    js=sa(at['JOINTS_0']);ws=sa(at['WEIGHTS_0']);jn=np.array([sd['nodes'][i]['name'] for i in sd['skins'][n['skin']]['joints']])
    valid=np.array([k=='pelvis' or k.startswith('spine_') for k in jn]);other=np.array([k=='upperarm_l' for k in jn])
    assert np.sum(ws[ids]*valid[js[ids]],axis=1).min()>.85
    assert np.sum(ws[ids]*(valid|other)[js[ids]],axis=1).min()>.999
    return d,a,r,rest,ids

def solve(mesh,rest,ids,target=.12):
    v=mesh['v'];tri=mesh['tri'];canon=mesh['canon']
    _,first,idx=np.unique(canon,return_index=True,return_inverse=True)
    ct=idx[tri];chosen=idx[ids];assert len(np.unique(chosen))==4
    edges=np.sort(np.concatenate((ct[:,[0,1]],ct[:,[1,2]],ct[:,[2,0]])),axis=1);edges,cnt=np.unique(edges[edges[:,0]!=edges[:,1]],axis=0,return_counts=True)
    assert not np.isin(chosen,edges[cnt==1]).any()
    incident=np.flatnonzero(np.isin(ct,chosen).any(1));e=edges[np.isin(edges,chosen).any(1)]
    subset=np.unique(np.r_[ct[incident].ravel(),e.ravel()]);i0=np.searchsorted(subset,chosen)
    p=v[first[subset]].copy()*1000;restp=rest[first[subset]]*1000
    tt=np.searchsorted(subset,ct[incident]);ee=np.searchsorted(subset,e)
    def normals(q):
        z=q[tt];return np.cross(z[:,1]-z[:,0],z[:,2]-z[:,0])
    def lens(q):return np.linalg.norm(q[ee[:,1]]-q[ee[:,0]],axis=1)
    n0=normals(p);a0=np.linalg.norm(n0,axis=1);ar=np.linalg.norm(normals(restp),axis=1);l0=lens(p)
    assert np.all(a0>1e-8) and np.all(ar>1e-8) and np.all(l0>1e-8)
    is_target=np.isin(incident,FACES)
    lower=np.where(a0>=.1*ar,.1005*ar,.1*a0);lower=np.maximum(lower,.1*a0)
    lower[is_target]=target*ar[is_target]
    def points(x):
        q=p.copy();q[i0]+=x.reshape(4,3);return q
    def constraints(x):
        q=points(x);n=normals(q);aa=np.linalg.norm(n,axis=1);ll=lens(q)
        cos=np.sum(n*n0,axis=1)/(aa*a0+1e-20)
        return np.r_[(aa-lower)/ar,cos-.15,ll/l0-.5,2.-ll/l0,4.-np.sum(x.reshape(4,3)**2,axis=1)]
    x=np.zeros(12)
    if constraints(x).min()<-1e-8:
        sol=minimize(lambda x:float(x@x),x,method='SLSQP',bounds=[(-2,2)]*12,constraints=[{'type':'ineq','fun':constraints}],options={'maxiter':160,'ftol':1e-10})
        assert sol.success and constraints(sol.x).min()>-1e-7,(sol.message,float(constraints(sol.x).min()))
        x=sol.x
    q=points(x);vv=v.copy();vv[ids]+=x.reshape(4,3)/1000
    aa=np.linalg.norm(normals(q),axis=1);cos=np.sum(normals(q)*n0,axis=1)/(aa*a0+1e-20);ratio=lens(q)/l0
    return dict(mesh,v=vv),{'before_ratio':(a0[is_target]/ar[is_target]).tolist(),'after_ratio':(aa[is_target]/ar[is_target]).tolist(),'max_move_mm':float(np.linalg.norm(x.reshape(4,3),axis=1).max()),'edge_ratio_range':[float(ratio.min()),float(ratio.max())],'min_normal_cosine':float(cos.min()),'delta_world_m':(x.reshape(4,3)/1000).tolist()}

def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);args=p.parse_args()
    d,a,r,rest,ids=setup(args.evidence);f=args.evidence/'W38r-torso-20261128'
    out=f/'w38u-constrained-seam.json';assert not out.exists()
    # Endpoint is deliberately unchanged, with adaptive margin rising inside interval.
    times=np.linspace(2.,r['torso_keys'][0]['seconds'],17)
    rows=[]
    for i,t in enumerate(times):
        g,w=geometry(pose(d,a,float(t)),a,True)
        target=.100001+.019999*min(1.,i/2,(16-i)/2)
        try:
            gg,q=solve(g[TUNIC],rest,ids,target)
            if i in (0,16):assert q['max_move_mm']<1e-8
            rows.append({'time':float(t),'gate':True,'target':target,'correction':q});print(i,q['max_move_mm'],q['after_ratio'],flush=True)
        except AssertionError as e:
            rows.append({'time':float(t),'gate':False,'error':str(e)});print('REJECT',i,str(e),flush=True)
    out.write_text(json.dumps({'status':'ART_HOLD_CONSTRAINED_SEAM','sha256':r['sha256'],'vertices':ids.tolist(),'rows':rows},indent=2))
if __name__=='__main__':main()
