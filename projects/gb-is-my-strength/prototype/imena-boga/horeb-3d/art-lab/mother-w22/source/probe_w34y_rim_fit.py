"""W34y: rigid hand-fit feasibility at actual rim, not a solved whole-body pose."""
import argparse,json,math,time
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R
from scipy.spatial import cKDTree
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry,merged,point_triangle_min
from probe_w34r_static_correction import contacts,deadline,swing
def main():
    parser=argparse.ArgumentParser();parser.add_argument('evidence',type=Path);parser.add_argument('output',type=Path);parser.add_argument('--reverse',action='store_true');parser.add_argument('--shape',choices=('x','v','s'),default='x');parser.add_argument('--radial',action='store_true');args=parser.parse_args()
    root=args.evidence;out=args.output;assert not out.exists()
    folder=root/'W34x-asymmetric-thumb-20261127';r=json.loads((folder/'w34u-articulation.json').read_text());witness=json.loads((folder/'w34x-contact-direction.json').read_text())
    m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text())
    d,a=load(folder/'w34u-static-actor.glb',r['glb_sha256']);h,ha=load(root/'W28-house-20261125/w28-house.glb',m['house_sha256'])
    g,w=geometry(d,a,True);hg,_=geometry(h,ha,drop=m['basket_support']['analytic_settle_delta_m'])
    witness_body=g['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0']
    source_sha=r['glb_sha256']
    if args.shape=='v':
        f=root/'W34v-finger-refine-20261127';source_sha=json.loads((f/'w34u-articulation.json').read_text())['glb_sha256']
        d,a=load(f/'w34u-static-actor.glb',source_sha);g,w=geometry(d,a,True)
    elif args.shape=='s':
        f=root/'W34s-sleeve-correction-20261127';source_sha=json.loads((f/'w34s-report.json').read_text())['glb_sha256']
        d,a=load(f/'w34s-static-actor.glb',source_sha);g,w=geometry(d,a,True)
    body=g['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0']
    assert np.array_equal(body['tri'],witness_body['tri']) and len(body['v'])==len(witness_body['v'])
    names={n['name']:i for i,n in enumerate(d['nodes'])}
    node=d['nodes'][names['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0']];pr=d['meshes'][node['mesh']]['primitives'][0];js=a(pr['attributes']['JOINTS_0']);ws=a(pr['attributes']['WEIGHTS_0']);skin=d['skins'][0]
    rim=hg['Basket_thick_lipped_rim'];rt=rim['v'][rim['tri']];rc=rt.mean(1)
    rn=np.cross(rt[:,1]-rt[:,0],rt[:,2]-rt[:,0]);rn/=np.maximum(np.linalg.norm(rn,axis=1),1e-12)[:,None]
    # Check outward winding on the highest and lowest faces; fail if inverted.
    assert rn[np.argmax(rc[:,1]),1]>.8 and rn[np.argmin(rc[:,1]),1]<-.8
    basket=merged([v for v in hg.values() if v['basket']]);bt=basket['v'][basket['tri']]
    tree=cKDTree(rc)
    def p(n):return w[names[n]][:3,3]
    results={}
    for s,x in [('l',.08),('r',.62)]:
        deadline()
        a0,b0,wrist=[p(k+'_'+s) for k in ('upperarm','lowerarm','hand')]
        l1=np.linalg.norm(b0-a0);l2=np.linalg.norm(wrist-b0)
        pad={}
        for digit,rec in witness['direction_witness'][s]['pads'].items():
            pad[digit]=np.array(rec['closest_point'])+np.array(rec['separation_direction'])*rec['gap_mm']/1000
        # Both selected skin witness points are real vertices, not joint centers.
        for digit,point in pad.items():
            ds=np.linalg.norm(witness_body['v']-point,axis=1);idx=int(ds.argmin());assert ds[idx]<1e-6
            pad[digit]=body['v'][idx].copy()
        jids=[k for k,i in enumerate(skin['joints']) if d['nodes'][i]['name']=='hand_'+s or d['nodes'][i]['name'].endswith('_'+s) and d['nodes'][i]['name'].startswith(('thumb_','index_','middle_','ring_','pinky_'))]
        ids=np.flatnonzero(np.sum(ws*np.isin(js,jids),axis=1)>.999)
        included=np.zeros(len(body['v']),bool);included[ids]=True
        face_ids=np.flatnonzero(np.all(included[body['tri']],axis=1));assert len(face_ids)>1000
        hand=dict(body,tri=body['tri'][face_ids],region=body['region'][face_ids])
        area=(abs(rc[:,0]-x)<.13)&(rc[:,2]>.26)
        tops=np.flatnonzero(area&(rn[:,1]>.55))
        bottoms=np.flatnonzero(area&(rn[:,1]<-.55))
        if args.radial:
            radial=rc-np.array([.35,0,.26]);radial[:,1]=0
            radial/=np.maximum(np.linalg.norm(radial,axis=1),1e-12)[:,None]
            alignment=np.sum(radial*rn,axis=1)
            tops=np.flatnonzero(area&(alignment>.65)&(abs(rn[:,1])<.6))
            bottoms=np.flatnonzero(area&(alignment<-.65)&(abs(rn[:,1])<.6))
        if args.reverse:tops,bottoms=bottoms,tops
        attempts=0;reachable=0;ranked=[];pair_counts={}
        for digit in ('index','middle'):
            v=pad[digit]-pad['thumb'];span=np.linalg.norm(v)
            t=rc[tops]+.0015*rn[tops];b=rc[bottoms]+.0015*rn[bottoms]
            dif=b[None]-t[:,None];dist=np.linalg.norm(dif,axis=2)
            ndot=rn[tops]@rn[bottoms].T
            pair=np.argwhere((abs(dist-span)<.003)&(ndot<-.65))
            pair_counts[digit]=len(pair)
            if not len(pair):continue
            # Preserve diversity by taking at most one pair per top face and per digit.
            score=abs(dist-span)+.05*abs((t[:,None,0]+b[None,:,0])/2-x)
            ordered=sorted(pair.tolist(),key=lambda z:score[tuple(z)])
            seen=set()
            for i,j in ordered:
                if i in seen:continue
                seen.add(i)
                if len(seen)>24:break
                dest=b[j]-t[i];axis=dest/np.linalg.norm(dest);rot0=swing(v,dest)
                midpoint=(t[i]+b[j])/2;origin=(pad[digit]+pad['thumb'])/2
                for angle in range(0,360,30):
                    attempts+=1
                    rot=R.from_rotvec(axis*math.radians(angle)).as_matrix()@rot0
                    shift=midpoint-rot@origin;wr=rot@wrist+shift
                    distance=np.linalg.norm(wr-a0)
                    if not abs(l1-l2)+.005<distance<l1+l2-.005:continue
                    if args.radial:
                        if wr[1]<midpoint[1]+.025 or wr[2]<midpoint[2]-.03:continue
                    elif wr[2]<midpoint[2]+.025:continue
                    reachable+=1
                    # A cheap ranking proxy only; exact collisions on finalists.
                    other=np.stack([rot@pad[k]+shift for k in ('middle','ring','pinky') if k!=digit])
                    gaps=tree.query(other,workers=1)[0]
                    target_error=abs(np.linalg.norm(dest)-span)/2
                    cost=float(gaps.sum()+target_error+.02*(abs(wr[0]-x)))
                    ranked.append((cost,rot,shift,wr,digit,int(tops[i]),int(bottoms[j]),float(distance),target_error))
        ranked.sort(key=lambda q:q[0]);checked=[]
        for cost,rot,shift,wr,digit,ti,bi,distance,err in ranked[:32] if args.radial else ranked[:16]:
            deadline();vv=body['v'].copy();vv[ids]=vv[ids]@rot.T+shift
            q=dict(hand,v=vv)
            hv=vv[q['tri']];lo,hi=hv.min(axis=(0,1)),hv.max(axis=(0,1))
            keep=np.all((bt.min(1)<=hi+1e-8)&(bt.max(1)>=lo-1e-8),axis=1)
            prop=dict(basket,tri=basket['tri'][keep],region=basket['region'][keep])
            audit=contacts(q,prop,np.arange(len(q['tri'])))
            row={'digit':digit,'wrist_glTF':wr.tolist(),'arm_reserve_mm':float((l1+l2-distance)*1000),'target_pair_normal_dot':float(rn[ti]@rn[bi]),'pair_fit_error_mm':err*1000,'rigid_hand_crossings':audit['pairs'],'ranking_proxy':cost,'rotation':rot.tolist(),'translation':shift.tolist(),'target_thumb':rc[ti].tolist(),'target_finger':rc[bi].tolist()}
            checked.append(row)
        clear=[q for q in checked if q['rigid_hand_crossings']==0]
        results[s]={'pair_counts':pair_counts,'tested_orientations':attempts,'reach_and_approach_candidates':reachable,'exact_checked':len(checked),'rigid_hand_clear':len(clear),'best_by_crossings':min(checked,key=lambda q:q['rigid_hand_crossings']) if checked else None,'rows':checked,'hand_faces':len(face_ids)}
        print(json.dumps({s:{k:v for k,v in results[s].items() if k!='rows'}}),flush=True)
    out.mkdir();report={'status':'ART_HOLD_RIM_RIGID_FIT','source_sha256':source_sha,'shape':args.shape,'reverse':args.reverse,'radial':args.radial,'results':results,'limitations':['Rigid transformed fully hand-weighted skin subset, no wrist transition, arm IK, cloth, room or dynamic clearance. Candidate pair uses opposite vertical-facing actual rim triangles, no physical force claim. Ranking proxy uses nearest rim triangle centers, not exact distance. Only finalists have proper crossing checks. Negative result is not proof of global impossibility.']}
    (out/'w34y-rim-fit.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
if __name__=='__main__':main()
