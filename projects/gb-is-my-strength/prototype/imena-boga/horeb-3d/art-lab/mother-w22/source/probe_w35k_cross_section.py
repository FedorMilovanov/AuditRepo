"""W35k: cross-section access and oriented skin contact pairs.
Rigid hand-only feasibility; does not certify grip or whole actor."""
import argparse,json,math
from pathlib import Path
import numpy as np
from scipy.spatial import cKDTree
from scipy.spatial.transform import Rotation as R
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry,merged,point_triangle_min
from probe_w34r_static_correction import contacts,deadline,swing
from probe_w35i_rim_contact import normals,closest

def unit(v):
    return v/np.maximum(np.linalg.norm(v,axis=-1,keepdims=True),1e-12)

def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);p.add_argument('--side',choices=('l','r'),required=True);args=p.parse_args()
    root=args.evidence;out=args.output;assert not out.exists();side=args.side
    m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text())
    h,ha=load(root/'W28-house-20261125/w28-house.glb',m['house_sha256'])
    hg,_=geometry(h,ha,drop=m['basket_support']['analytic_settle_delta_m'])
    rim=hg['Basket_thick_lipped_rim'];rt=rim['v'][rim['tri']];rc=rt.mean(1);rn=unit(normals(rim['v'],rim['tri']))
    basket=merged([v for v in hg.values() if v['basket']]);bt=basket['v'][basket['tri']]
    other=merged([v for k,v in hg.items() if v['basket'] and k!='Basket_thick_lipped_rim']);ot=other['v'][other['tri']]
    oc=ot.mean(1);orr=np.linalg.norm(ot-oc[:,None],axis=2).max(1);tree=cKDTree(oc)
    def gap(point):
        _,i=tree.query(point,workers=1)
        ub=point_triangle_min(point,ot[i:i+1]);jj=np.array(tree.query_ball_point(point,ub+orr.max()+1e-10,workers=1),int)
        jj=jj[np.linalg.norm(oc[jj]-point,axis=1)-orr[jj]<=ub+1e-10]
        return point_triangle_min(point,ot[jj])
    x=.08 if side=='l' else .62
    # Surface accessibility for an idealized fingertip sphere, centered
    # 7mm beyond the rim. Exact distance to adjacent basket triangles.
    sector=np.flatnonzero((abs(rc[:,0]-x)<.11)&(rc[:,2]>.26))
    access=np.array([gap(rc[i]+.007*rn[i]) for i in sector])
    accessible=sector[access>=.007]
    destinations=rc[accessible]+.0015*rn[accessible]
    dot=rn[accessible]@rn[accessible].T
    span=np.linalg.norm(destinations[:,None]-destinations[None,:],axis=2)
    pairs=np.argwhere((dot<=-.75)&(span>=.035)&(span<=.095))
    # Prefer physically local pairs at a common rim section, but permit
    # up to 95mm span in order to test the actual anatomy.
    radial=unit(np.column_stack(((rc[accessible,0]-.35)/.474,np.zeros(len(accessible)),(rc[accessible,2]-.26)/.325)))
    def target_group(i):
        n=rn[accessible[i]]
        if n[1]>.55:return 'top'
        if n[1]<-.55:return 'bottom'
        return 'outer' if n@radial[i]>0 else 'inner'
    from collections import Counter
    access_counts=dict(Counter(target_group(i) for i in range(len(accessible))))
    pair_counts=dict(Counter(target_group(i)+'/'+target_group(j) for i,j in pairs))
    print(json.dumps({'side':side,'sector_faces':len(sector),'accessible_faces':len(accessible),'access_by_surface':access_counts,'opposed_pairs':len(pairs),'pairs_by_surface':pair_counts}),flush=True)
    # Exact current endpoint plus a more open prior hand shape.
    shapes=[]
    for label,folder,report,file in [('current','W35c-static-160-0-20261127','w34zx-export.json','w34zx-static-actor.glb'),('open','W34s-sleeve-correction-20261127','w34s-report.json','w34s-static-actor.glb')]:
        f=root/folder;r=json.loads((f/report).read_text());sha=r['export']['sha256'] if label=='current' else r['glb_sha256']
        d,a=load(f/file,sha);g,w=geometry(d,a,True);body=g['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0']
        names={n['name']:i for i,n in enumerate(d['nodes'])}
        node=d['nodes'][names['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0']];at=d['meshes'][node['mesh']]['primitives'][0]['attributes']
        js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=np.array([d['nodes'][i]['name'] for i in d['skins'][node['skin']]['joints']])
        dom=jn[js[np.arange(len(js)),ws.argmax(1)]]
        handmask=np.array([n.endswith('_'+side) and n.startswith(('hand_','thumb_','index_','middle_','ring_','pinky_')) for n in jn])
        mask=np.sum(ws*handmask[js],axis=1)>.999
        ids=np.flatnonzero(mask);faces=np.flatnonzero(np.all(mask[body['tri']],axis=1));tri=body['tri'][faces]
        _,first=np.unique(body['canon'][ids],return_index=True);unique=ids[first]
        vn=np.zeros((int(body['canon'].max())+1,3));fn=normals(body['v'],body['tri'])
        for k in range(3):np.add.at(vn,body['canon'][body['tri'][:,k]],fn)
        vn=unit(vn[body['canon']])
        volume=np.sum(np.einsum('ij,ij->i',body['v'][body['tri'][:,0]],fn))/6;vn*=np.sign(volume)
        wrist=w[names['hand_'+side]][:3,3];shoulder=w[names['upperarm_'+side]][:3,3];elbow=w[names['lowerarm_'+side]][:3,3]
        length=np.linalg.norm(shoulder-elbow)+np.linalg.norm(elbow-wrist)
        if label=='open':shoulder=shoulder+[0,0,.160]
        # Distal and middle phalanx skin, sampled evenly over exported
        # canonical vertices. Pair normals must face each other.
        def sample(digit,n=30):
            sel=unique[np.array([z.startswith(digit+'_') and not z.startswith(digit+'_01') for z in dom[unique]])]
            assert len(sel)>0
            return sel[np.linspace(0,len(sel)-1,min(n,len(sel))).astype(int)]
        th=sample('thumb');su=np.concatenate([sample(k,24) for k in ('index','middle','ring')])
        vec=body['v'][su][None]-body['v'][th][:,None];lengths=np.linalg.norm(vec,axis=2);ax=unit(vec)
        # Interior facing skin: thumb normal along the thumb->finger direction,
        # finger normal oppositely. Relaxed threshold to admit oblique surfaces.
        td=np.sum(vn[th][:,None]*ax,axis=2);sd=-np.sum(vn[su][None]*ax,axis=2)
        handpairs=np.argwhere((td>.35)&(sd>.35)&(lengths>=.035)&(lengths<=.095))
        # Sample hand pairs by facing score. Keep different skin vertices.
        handpairs=sorted(handpairs.tolist(),key=lambda z:-(td[tuple(z)]+sd[tuple(z)]))[:100]
        ranked=[];fit=0;reached=0
        # Elliptical rim tube proxy for ranking only, with actual triangle checks below.
        alpha=np.linspace(0,2*np.pi,121);line=np.column_stack((.35+.474*np.cos(alpha),np.full(121,1.147),.26+.325*np.sin(alpha)));seg=line[1:]-line[:-1];stree=cKDTree((line[1:]+line[:-1])/2)
        def tube(q):
            _,j=stree.query(q,k=4,workers=1);v=q[:,None]-line[j];e=seg[j];t=np.clip(np.sum(v*e,axis=2)/np.sum(e*e,axis=2),0,1)
            return np.sqrt(np.min(np.sum((v-t[:,:,None]*e)**2,axis=2),axis=1))
        proxy_points=body['v'][unique[::6]]
        for i,j in handpairs:
            deadline();vv=vec[i,j];l=lengths[i,j]
            choices=[(int(k),int(z)) for k,z in pairs[abs(span[pairs[:,0],pairs[:,1]]-l)<.0025]]
            # Pick best geometric matches across all contact surface categories.
            choices=sorted(choices,key=lambda z:abs(span[z]-l)+.01*abs((destinations[z[0],0]+destinations[z[1],0])/2-x))[:12]
            for k,z in choices:
                dest=destinations[z]-destinations[k];axis=unit(dest)
                q0=swing(vv,dest);mid=(destinations[k]+destinations[z])/2;origin=(body['v'][th[i]]+body['v'][su[j]])/2
                # Rotate around pair axis to align both actual skin normals with
                # the inward-facing desired normals. Solve optimal roll directly.
                a0=q0@vn[th[i]];b0=q0@vn[su[j]]
                A=-rn[accessible[k]];B=-rn[accessible[z]]
                aa=a0-axis*(a0@axis);bb=b0-axis*(b0@axis)
                num=np.cross(axis,aa)@A+np.cross(axis,bb)@B;den=aa@A+bb@B
                roll=math.atan2(num,den)
                for off in (-15,0,15):
                    fit+=1;rot=R.from_rotvec(axis*(roll+math.radians(off))).as_matrix()@q0
                    shift=mid-rot@origin;wr=rot@wrist+shift
                    facing1=float((rot@vn[th[i]])@rn[accessible[k]]);facing2=float((rot@vn[su[j]])@rn[accessible[z]])
                    if max(facing1,facing2)>-.5:continue
                    reserve=(length-np.linalg.norm(wr-shoulder))*1000
                    if reserve<5 or wr[2]<mid[2]-.015:continue
                    reached+=1
                    # score exact skin-normal alignment + conservative tube proxy.
                    td0=tube(proxy_points@rot.T+shift)*1000;pen=np.maximum(0,26-td0)
                    cost=float(np.mean(pen**2)+.4*np.max(pen)**2+5*(2+facing1+facing2))
                    ranked.append((cost,rot,shift,wr,reserve,int(th[i]),int(su[j]),int(accessible[k]),int(accessible[z]),facing1,facing2))
        ranked.sort(key=lambda q:q[0]);checked=[]
        for cost,rot,shift,wr,reserve,i,j,k,z,fa,fb in ranked[:16]:
            deadline();v=body['v'].copy();v[ids]=v[ids]@rot.T+shift
            hand=dict(body,v=v,tri=tri,region=body['region'][faces]);hv=v[tri];lo=hv.min(axis=(0,1));hi=hv.max(axis=(0,1))
            keep=np.all((bt.min(1)<=hi+1e-8)&(bt.max(1)>=lo-1e-8),axis=1)
            prop=dict(basket,tri=basket['tri'][keep],region=basket['region'][keep])
            audit=contacts(hand,prop,np.arange(len(tri)))
            row={'crossings':audit['pairs'],'by_mesh':audit['target_regions'],'proxy_score':cost,'wrist':wr.tolist(),'reserve_mm':reserve,'skin_vertices':[i,j],'digit':str(dom[j]),'rim_faces':[k,z],'skin_facing_dots':[fa,fb],'opposition_dot':float(rn[k]@rn[z]),'rotation':rot.tolist(),'translation':shift.tolist()}
            exact=[]
            for vertex in (i,j):
                distance,point,fi=closest(v[vertex],rt)
                exact.append({'vertex':vertex,'gap_mm':distance*1000,'normal':rn[fi].tolist(),'skin_facing_dot':float((rot@vn[vertex])@rn[fi])})
            exact_dot=float(np.dot(exact[0]['normal'],exact[1]['normal']))
            row['exact_contact']={'contacts':exact,'opposition_dot':exact_dot,'passes':bool(audit['pairs']==0 and reserve>=5 and exact_dot<=-.75 and all(q['gap_mm']<=3 and q['skin_facing_dot']<=-.5 for q in exact))}
            checked.append(row)
        shape={'label':label,'source_sha256':sha,'hand_pairs':len(handpairs),'orientations':fit,'reachable_facing':reached,'exact_checked':len(checked),'best':min(checked,key=lambda q:q['crossings']) if checked else None,'rows':checked}
        shapes.append(shape);print(json.dumps({k:v for k,v in shape.items() if k!='rows'}),flush=True)
    report={'status':'ART_HOLD_CROSS_SECTION_SCREEN','side':side,'sector_faces':len(sector),'accessible_faces':len(accessible),'access_by_surface':access_counts,'opposed_target_pairs':len(pairs),'pairs_by_surface':pair_counts,'shapes':shapes,'limitations':['7mm sphere center clearance to other basket triangle surfaces, not solid containment. Bounded rigid hand search using facing skin points. No arm or wrist-transition solve, full skin or dynamic clearance. Negative screen not global impossibility.']}
    out.write_text(json.dumps(report,indent=2))
if __name__=='__main__':main()
