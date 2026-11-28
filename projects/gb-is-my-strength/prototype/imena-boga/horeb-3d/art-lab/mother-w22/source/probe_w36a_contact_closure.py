"""W36a: small articulated closure from the audited W35y endpoint.
No asset writes; exact changed-region crossing checks, not a physical grip solver.
"""
import argparse,copy,json,math
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry,merged
from probe_w34r_static_correction import contacts,deadline
from probe_w35i_rim_contact import closest,normals
from probe_w35e_playback import pose,BODY,TUNIC

def read_report(root,name):
    individual=root/name
    if individual.exists():return json.loads(individual.read_text())
    aggregate=json.loads((root/'W36a-f-closure-20261128/w36a-f-closure.json').read_text())
    return aggregate['reports'][name]

def apply_closure(doc,root,fraction,sha):
    """Apply four independently verified local joint rotations to endpoint only."""
    from scipy.spatial.transform import Slerp
    assert 0<=fraction<=1
    d=dict(doc,nodes=copy.deepcopy(doc['nodes']))
    names={n['name']:n for n in d['nodes']}
    chosen={}
    for side in ('l','r'):
        report=read_report(root,f'W36d-closure-{side}-20261128.json')
        assert report['source_sha256']==sha and report['best']['gate']
        q=report['best'];chosen[side]=[c['vertex'] for c in q['contacts']]
        for name,value in q['rotations'].items():
            node=names[name];old=node['rotation'];new=value['local_rotation']
            node['rotation']=Slerp([0.,1.],R.from_quat([old,new]))([fraction]).as_quat()[0].tolist()
    return d,chosen

def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);p.add_argument('--side',choices=('l','r'),required=True);p.add_argument('--witness',action='store_true');p.add_argument('--fine',action='store_true');args=p.parse_args();assert not args.fine or args.witness
    root=args.evidence;out=args.output;assert not out.exists();side=args.side
    f=root/'W35y-bilateral-20261128';r=json.loads((f/'w35y-assembly.json').read_text());d,a=load(f/'w35y-approach.glb',r['sha256']);d=pose(d,a,2.4);g,w=geometry(d,a,True)
    m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text());h,ha=load(root/'W28-house-20261125/w28-house.glb',m['house_sha256']);hg,_=geometry(h,ha,drop=m['basket_support']['analytic_settle_delta_m'])
    rim=hg['Basket_thick_lipped_rim'];rt=rim['v'][rim['tri']];rn=normals(rim['v'],rim['tri']);rn/=np.maximum(np.linalg.norm(rn,axis=1),1e-12)[:,None]
    basket=merged([v for v in hg.values() if v['basket']]);bt=basket['v'][basket['tri']]
    b=g[BODY];names={n['name']:i for i,n in enumerate(d['nodes'])};parent={j:i for i,n in enumerate(d['nodes']) for j in n.get('children',[])}
    sn,sa=load(root/'W34s-sleeve-correction-20261127/w34s-static-actor.glb',r['source_sha256']);n=next(n for n in sn['nodes'] if n['name']==BODY);mesh=sn['meshes'][n['mesh']];pr=mesh['primitives'][0];rest=sa(pr['attributes']['POSITION']).astype(float)
    for wt,t in zip(n.get('weights',mesh.get('weights',[])),pr.get('targets',[])):
        if wt:rest+=wt*sa(t['POSITION'])
    tri=b['tri']
    def area(v):
        q=v[tri];return np.linalg.norm(np.cross(q[:,1]-q[:,0],q[:,2]-q[:,0]),axis=1)
    ar=area(rest);before=area(b['v'])
    ids=[10270,9261] if side=='l' else [3037,2028]
    if args.witness:
        witness=read_report(root,'W36b-contact-witness-20261128.json')
        assert witness['source_sha256']==r['sha256']
        pair=witness['results'][side]['best_opposed_pair'];ids=[pair['thumb']['vertex'],pair['support']['vertex']]
    def plan(j,i):
        point=b['v'][i];dist,near,k=closest(point,rt)
        target=near+(point-near)*(.00015/dist)
        pivot=w[j][:3,3];u=point-pivot;v=target-pivot
        axis=np.cross(u,v);angle=math.atan2(np.linalg.norm(axis),u@v)
        assert angle<math.radians(15)
        return axis/max(np.linalg.norm(axis),1e-12)*angle
    def trial(tj,ij,factor,index_factor=None):
        if index_factor is None:index_factor=factor
        deadline();doc=dict(d,nodes=copy.deepcopy(d['nodes']));rotations={}
        for digit,idx,vertex in [('thumb',tj,ids[0]),('index',ij,ids[1])]:
            name=f'{digit}_{idx:02d}_{side}';j=names[name];vec=plan(j,vertex)*(factor if digit=='thumb' else index_factor)
            P=w[parent[j]][:3,:3];assert np.max(abs(P.T@P-np.eye(3)))<1e-5
            old=R.from_quat(doc['nodes'][j]['rotation']).as_matrix()
            doc['nodes'][j]['rotation']=R.from_matrix(P.T@R.from_rotvec(vec).as_matrix()@P@old).as_quat().tolist()
            rotations[name]={'angle_deg':float(np.linalg.norm(vec)*180/math.pi),'local_rotation':doc['nodes'][j]['rotation']}
        gg,_=geometry(doc,a,True);v=gg[BODY];delta=np.linalg.norm(v['v']-b['v'],axis=1);active=np.flatnonzero(np.any((delta>1e-8)[tri],axis=1))
        assert len(active)>0 and all(np.max(abs(gg[k]['v']-g[k]['v']))<1e-8 for k in g if k!=BODY)
        selfhit=contacts(v,v,active,True)['pairs']
        aa=dict(v,tri=tri[active],region=v['region'][active]);at=aa['v'][aa['tri']];lo=at.min(axis=(0,1));hi=at.max(axis=(0,1))
        keep=np.all((bt.min(1)<=hi+1e-8)&(bt.max(1)>=lo-1e-8),axis=1)
        basket_hit=contacts(aa,dict(basket,tri=basket['tri'][keep],region=basket['region'][keep]),np.arange(len(active)))['pairs'] if keep.any() else 0
        other={}
        for name,obj in list(gg.items())+[(k,z) for k,z in hg.items() if not z['basket']]:
            if name==BODY:continue
            if np.any((obj['v'].max(0)<lo)|(obj['v'].min(0)>hi)):continue
            tt=obj['v'][obj['tri']];mask=np.all((tt.min(1)<=hi+1e-8)&(tt.max(1)>=lo-1e-8),axis=1)
            if mask.any():
                n=contacts(aa,dict(obj,tri=obj['tri'][mask],region=obj['region'][mask]),np.arange(len(active)))['pairs']
                if n:other[name]=n
        after=area(v['v']);severe=np.flatnonzero((ar>1e-12)&(after<.1*ar)).tolist()
        vn=np.zeros((int(v['canon'].max())+1,3));fn=normals(v['v'],tri)
        for k in range(3):np.add.at(vn,v['canon'][tri[:,k]],fn)
        vn=vn[v['canon']];vn/=np.maximum(np.linalg.norm(vn,axis=1),1e-12)[:,None];vn*=np.sign(np.sum(np.einsum('ij,ij->i',v['v'][tri[:,0]],fn)))
        cs=[]
        for i in ids:
            dist,point,k=closest(v['v'][i],rt);cs.append({'vertex':i,'gap_mm':dist*1000,'signed_gap_mm':float((v['v'][i]-point)@rn[k]*1000),'rim_normal':rn[k].tolist(),'skin_facing_dot':float(vn[i]@rn[k])})
        dot=float(np.dot(cs[0]['rim_normal'],cs[1]['rim_normal']))
        gate=selfhit==basket_hit==0 and not other and not severe and dot<=-.75 and all(c['signed_gap_mm']>=0 and c['skin_facing_dot']<=-.5 for c in cs)
        return {'thumb_joint':tj,'index_joint':ij,'fraction':factor,'index_fraction':index_factor,'rotations':rotations,'crossings':{'skin':selfhit,'basket':basket_hit,'other':other},'severe_skin':severe,'contacts':cs,'opposition_dot':dot,'gate':bool(gate),'max_gap_mm':max(c['gap_mm'] for c in cs),'max_vertex_delta_mm':float(delta.max()*1000)}
    rows=[]
    configs=[(tj,ij,factor,factor) for tj,ij in [(3,2),(2,2),(1,1),(3,1),(2,1),(1,2)] for factor in (.7,1.)]
    if args.witness:
        configs=[(tj,ij,ft,fi) for tj,ij in [(3,2),(2,2),(1,1)] for ft,fi in [(.25,.25),(.5,.25),(.5,.5),(.75,.35),(1.,0.),(.75,.75)]]
    if args.fine:
        prior=read_report(root,f'W36c-closure-{side}-20261128.json')
        assert prior['source_sha256']==r['sha256']
        q=prior['best'];assert q['gate']
        configs=[(q['thumb_joint'],q['index_joint'],ft,fi) for ft in (.75,.9,1.05,1.2) for fi in ((.75,.9,1.05,1.2) if side=='l' else (.35,.5,.65,.8))]
    for tj,ij,ft,fi in configs:
        q=trial(tj,ij,ft,fi);rows.append(q)
        print(json.dumps({k:q[k] for k in ('thumb_joint','index_joint','fraction','index_fraction','crossings','severe_skin','max_gap_mm','gate')}),flush=True)
    best=min(rows,key=lambda q:(not q['gate'],q['max_gap_mm']))
    out.write_text(json.dumps({'status':'ART_HOLD_CLOSURE_SCREEN','source_sha256':r['sha256'],'side':side,'witness_mode':args.witness,'fine':args.fine,'rows':rows,'best':best,'limitations':['Sampled changed-region proper crossings and tracked point signed gaps only; no solid containment, swept clearance or load-bearing proof.']},indent=2))
    print('BEST',json.dumps(best),flush=True)
if __name__=='__main__':main()
