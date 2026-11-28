"""W36g: bounded compliant-pad contact screen on verified W36f endpoint.
No asset writes; proximity is not force closure.
"""
import argparse,json
from pathlib import Path
import numpy as np
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry,merged
from probe_w34r_static_correction import contacts,deadline
from probe_w35i_rim_contact import closest,normals
from probe_w35e_playback import pose,BODY
from probe_w36a_contact_closure import apply_closure

def pad_report(root):
    p=root/'W36j-independent-pad-20261128.json'
    if p.exists():return json.loads(p.read_text())
    return json.loads((root/'W36g-l-pad-20261128/w36g-l-pad.json').read_text())['reports'][p.name]

def apply_pad(g,root,fraction,sha):
    """Apply the seven verified world-space deltas at the fixed closure endpoint."""
    assert 0<=fraction<=1
    r=pad_report(root);assert r['source_sha256']==sha and r['best']['gate'] and r['independent']
    body=g[BODY];v=body['v'].copy();canon=body['canon'];seen=set()
    for row in r['triangle_witness']['correction']:
        i=row['canonical_vertex'];j=int(canon[i]);assert j not in seen;seen.add(j)
        delta=np.array(row['delta_m']);assert np.linalg.norm(delta)<.0005
        v[canon==j]+=fraction*delta
    assert len(seen)==7
    return dict(g,**{BODY:dict(body,v=v)})

def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);p.add_argument('--actual-basket',action='store_true');p.add_argument('--triangle-witness',action='store_true');p.add_argument('--independent',action='store_true');args=p.parse_args();assert not args.independent or (args.actual_basket and args.triangle_witness);assert not args.triangle_witness or args.actual_basket
    root=args.evidence;out=args.output;assert not out.exists()
    f=root/'W35y-bilateral-20261128';r=json.loads((f/'w35y-assembly.json').read_text());d,a=load(f/'w35y-approach.glb',r['sha256']);d,chosen=apply_closure(pose(d,a,2.4),root,1.,r['sha256'])
    g,w=geometry(d,a,True);body=g[BODY];v=body['v'];tri=body['tri']
    m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text());h,ha=load(root/'W28-house-20261125/w28-house.glb',m['house_sha256']);hg,_=geometry(h,ha,drop=m['basket_support']['analytic_settle_delta_m'])
    rim=hg['Basket_thick_lipped_rim'];rt=rim['v'][rim['tri']];rn=normals(rim['v'],rim['tri']);rn/=np.maximum(np.linalg.norm(rn,axis=1),1e-12)[:,None]
    basket=merged([z for z in hg.values() if z['basket']]);bt=basket['v'][basket['tri']]
    from scipy.spatial import cKDTree
    bc=bt.mean(1);br=np.linalg.norm(bt-bc[:,None],axis=2).max(1);tree=cKDTree(bc)
    bn=normals(basket['v'],basket['tri']);bn/=np.maximum(np.linalg.norm(bn,axis=1),1e-12)[:,None]
    def nearest_basket(point):
        _,j=tree.query(point,workers=1)
        ub,_,_=closest(point,bt[j:j+1]);jj=np.array(tree.query_ball_point(point,ub+br.max()+1e-10,workers=1),int)
        jj=jj[np.linalg.norm(bc[jj]-point,axis=1)-br[jj]<=ub+1e-10]
        gap,near,k=closest(point,bt[jj]);return gap,near,int(jj[k])
    _,first,idx=np.unique(body['canon'],return_index=True,return_inverse=True);q=v[first];ct=idx[tri]
    assert np.max(abs(q[idx]-v))<1e-6
    edges=np.unique(np.sort(np.concatenate((ct[:,[0,1]],ct[:,[1,2]],ct[:,[2,0]])),axis=1),axis=0)
    lengths=np.linalg.norm(q[edges[:,1]]-q[edges[:,0]],axis=1);nz=lengths>1e-9
    n0=normals(q,ct);a0=np.linalg.norm(n0,axis=1)
    sn,sa=load(root/'W34s-sleeve-correction-20261127/w34s-static-actor.glb',r['source_sha256']);n=next(n for n in sn['nodes'] if n['name']==BODY);mesh=sn['meshes'][n['mesh']];pr=mesh['primitives'][0];rest=sa(pr['attributes']['POSITION']).astype(float)
    for wt,t in zip(n.get('weights',mesh.get('weights',[])),pr.get('targets',[])):
        if wt:rest+=wt*sa(t['POSITION'])
    ar=np.linalg.norm(normals(rest,tri),axis=1)
    # Restrict patch to fully hand-weighted vertices on the same digit.
    node=next(n for n in d['nodes'] if n['name']==BODY);at=d['meshes'][node['mesh']]['primitives'][0]['attributes'];js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=np.array([d['nodes'][i]['name'] for i in d['skins'][node['skin']]['joints']])
    patches=[]
    for side,ids in chosen.items():
        for digit,i in zip(('thumb','index'),ids):
            valid=np.array([name.startswith(digit+'_') and name.endswith('_'+side) for name in jn])
            dist=np.linalg.norm(q-q[idx[i]],axis=1)
            mask=(np.sum(ws[first]*valid[js[first]],axis=1)>.999)&(dist<.012)
            assert mask[idx[i]]
            rec=[]
            for j in np.flatnonzero(mask):
                gap,point,k=closest(q[j],rt);signed=float((q[j]-point)@rn[k])
                if args.actual_basket:
                    gap,point,k=nearest_basket(q[j]);signed=float((q[j]-point)@bn[k])
                if signed>0 and gap>1e-9:rec.append((j,float(dist[j]),gap,point-q[j]))
            patches.append((side,digit,i,rec))
    def evaluate(radius,target,fraction,with_geometry=False):
        deadline();delta=np.zeros_like(q)
        for side,digit,i,rec in patches:
            rad,targ,fac=(.003,.0002,.5) if args.independent and digit=='index' else (radius,target,fraction)
            for j,dist,gap,vec in rec:
                if dist>=rad:continue
                t=dist/rad;weight=(1-t*t)**2
                move=min(.0008,max(0,gap-targ))*weight*fac
                delta[j]=vec/gap*move
        qq=q+delta;vv=qq[idx];changed=np.linalg.norm(delta,axis=1)>1e-10;active=np.flatnonzero(np.any(changed[ct],axis=1))
        assert len(active)>0
        n1=normals(qq,ct);a1=np.linalg.norm(n1,axis=1);cos=np.sum(n0*n1,axis=1)/np.maximum(a0*a1,1e-30)
        ratios=np.linalg.norm(qq[edges[:,1]]-qq[edges[:,0]],axis=1)[nz]/lengths[nz]
        severe=np.flatnonzero((ar>1e-12)&(a1<.1*ar)).tolist()
        geo=dict(body,v=vv);skin=contacts(geo,geo,active,True)['pairs']
        aa=dict(geo,tri=tri[active],region=body['region'][active]);at=vv[aa['tri']];lo=at.min(axis=(0,1));hi=at.max(axis=(0,1))
        def hit(obj,detail=False):
            tt=obj['v'][obj['tri']];mask=np.all((tt.min(1)<=hi+1e-8)&(tt.max(1)>=lo-1e-8),axis=1)
            result=contacts(aa,dict(obj,tri=obj['tri'][mask],region=obj['region'][mask]),np.arange(len(active))) if mask.any() else {'pairs':0,'target_regions':{}}
            return result if detail else result['pairs']
        bd=hit(basket,True);bh=bd['pairs'];other={}
        for name,obj in list(g.items())+[(k,z) for k,z in hg.items() if not z['basket']]:
            if name==BODY or np.any((obj['v'].max(0)<lo)|(obj['v'].min(0)>hi)):continue
            val=hit(obj)
            if val:other[name]=val
        gaps={}
        for side,digit,i,_ in patches:
            dist,point,k=closest(vv[i],rt);actual,near,j=nearest_basket(vv[i])
            gaps[side+'_'+digit]={'gap_mm':dist*1000,'signed_mm':float((vv[i]-point)@rn[k]*1000),'actual_basket_gap_mm':actual*1000,'actual_mesh':str(basket['region'][j]),'actual_normal':bn[j].tolist(),'actual_signed_mm':float((vv[i]-near)@bn[j]*1000)}
        mincos=float(cos[active].min());gate=skin==bh==0 and not other and not severe and mincos>.5 and ratios.min()>=.5 and ratios.max()<=2 and all(z['signed_mm']>=0 for z in gaps.values())
        result={'radius_mm':radius*1000,'target_mm':target*1000,'fraction':fraction,'changed_vertices':int(changed.sum()),'max_move_mm':float(np.linalg.norm(delta,axis=1).max()*1000),'min_normal_cosine':mincos,'edge_ratio_range':[float(ratios.min()),float(ratios.max())],'skin_crossings':skin,'basket_crossings':bh,'basket_regions':bd['target_regions'],'other':other,'severe_skin':severe,'gaps':gaps,'max_gap_mm':max(z['gap_mm'] for z in gaps.values()),'max_actual_gap_mm':max(z['actual_basket_gap_mm'] for z in gaps.values()),'gate':bool(gate)}
        return (result,geo,delta) if with_geometry else result
    rows=[]
    for rad in ((.003,.004,.006) if args.actual_basket else (.004,.006,.008)):
        for target in ((.00003,.00008,.00015) if args.independent else (.00005,.0002) if args.actual_basket else (.00005,.00015)):
            for fraction in ((.75,1.) if args.independent else (.25,.5,.75,1.) if args.actual_basket else (.5,1.)):
                row=evaluate(rad,target,fraction);rows.append(row);print(json.dumps(row),flush=True)
    best=min(rows,key=lambda z:(not z['gate'],max(z['gaps'][k]['actual_basket_gap_mm'] for k in ('l_thumb','r_thumb')) if args.independent else z['max_actual_gap_mm'] if args.actual_basket else z['max_gap_mm']))
    witness=None
    if args.triangle_witness:
        from probe_w36i_triangle_gap import contact_witness,self_test
        self_test()
        assert best['gate']
        check,geo,delta=evaluate(best['radius_mm']/1000,best['target_mm']/1000,best['fraction'],True)
        assert check==best
        witness={'before':contact_witness(body,basket,patches),'after':contact_witness(geo,basket,patches)}
        witness['correction']=[{'canonical_vertex':int(first[i]),'delta_m':delta[i].tolist()} for i in np.flatnonzero(np.linalg.norm(delta,axis=1)>1e-10)]
    out.write_text(json.dumps({'triangle_witness':witness,'status':'ART_HOLD_PAD_COMPLIANCE_SCREEN','source_sha256':r['sha256'],'actual_basket_mode':args.actual_basket,'independent':args.independent,'rows':rows,'best':best,'limitations':['Local geometry deformation screen, not elastic material or force simulation. No exact contact or swept proof. No export.']},indent=2))
    print('BEST',json.dumps(best),flush=True)
if __name__=='__main__':main()
