"""W35i exact rim surface and containment witness on retained W35c endpoint."""
import argparse,json
from pathlib import Path
import numpy as np
from scipy.spatial import cKDTree
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry
from probe_w34r_static_correction import deadline

def normals(v,tri):
    t=v[tri];return np.cross(t[:,1]-t[:,0],t[:,2]-t[:,0])
def topology(v,tri):
    _,first,idx=np.unique(np.round(v,8),axis=0,return_index=True,return_inverse=True)
    t=idx[tri];edges=np.concatenate((t[:,[0,1]],t[:,[1,2]],t[:,[2,0]]))
    _,ei,c=np.unique(np.sort(edges,axis=1),axis=0,return_inverse=True,return_counts=True)
    balance=np.bincount(ei,weights=np.where(edges[:,0]<edges[:,1],1,-1))
    volume=float(np.sum(np.einsum('ij,ij->i',v[tri[:,0]],normals(v,tri)))/6)
    return {'vertices':len(first),'faces':len(tri),'boundary_edges':int(np.sum(c==1)),'nonmanifold_edges':int(np.sum(c>2)),'inconsistent_edges':int(np.sum(balance!=0)),'signed_volume_m3':volume}
def closest(p,t):
    a=t[:,0];ab=t[:,1]-a;ac=t[:,2]-a
    n=np.cross(ab,ac);nn=np.sum(n*n,axis=1)
    proj=p-n*np.divide(np.sum((p-a)*n,axis=1),nn,out=np.zeros(len(t)),where=nn>1e-20)[:,None]
    x=proj-a
    u=np.sum(ab*ab,axis=1);v=np.sum(ac*ac,axis=1);w=np.sum(ab*ac,axis=1);den=u*v-w*w
    s=np.divide(v*np.sum(x*ab,axis=1)-w*np.sum(x*ac,axis=1),den,out=np.zeros(len(t)),where=den>1e-20)
    r=np.divide(u*np.sum(x*ac,axis=1)-w*np.sum(x*ab,axis=1),den,out=np.zeros(len(t)),where=den>1e-20)
    candidates=[proj];valid=[(den>1e-20)&(s>=0)&(r>=0)&(s+r<=1)]
    for i,j in ((0,1),(1,2),(2,0)):
        e=t[:,j]-t[:,i];q=np.sum(e*e,axis=1)
        z=np.clip(np.divide(np.sum((p-t[:,i])*e,axis=1),q,out=np.zeros(len(t)),where=q>1e-20),0,1)
        candidates.append(t[:,i]+z[:,None]*e);valid.append(np.ones(len(t),bool))
    pp=np.stack(candidates,axis=1);ds=np.sum((pp-p)**2,axis=2);ds[~np.stack(valid,axis=1)]=np.inf
    i,j=np.unravel_index(ds.argmin(),ds.shape)
    return float(np.sqrt(ds[i,j])),pp[i,j],i
def winding(p,t):
    q=t-p;a,b,c=q[:,0],q[:,1],q[:,2];la,lb,lc=(np.linalg.norm(x,axis=1) for x in (a,b,c))
    det=np.einsum('ij,ij->i',a,np.cross(b,c))
    den=la*lb*lc+np.sum(a*b,axis=1)*lc+np.sum(b*c,axis=1)*la+np.sum(c*a,axis=1)*lb
    return float(np.sum(2*np.arctan2(det,den))/(4*np.pi))
def main():
    parser=argparse.ArgumentParser();parser.add_argument('evidence',type=Path);parser.add_argument('output',type=Path);parser.add_argument('--bilateral',action='store_true');parser.add_argument('--closure',action='store_true');parser.add_argument('--pad',action='store_true');args=parser.parse_args();assert not args.pad or args.closure;assert not args.closure or args.bilateral
    root=args.evidence;out=args.output;assert not out.exists()
    if args.bilateral:
        from probe_w35e_playback import pose
        f=root/'W35y-bilateral-20261128';r=json.loads((f/'w35y-assembly.json').read_text());sha=r['sha256']
        d,a=load(f/'w35y-approach.glb',sha);d=pose(d,a,r['duration_s'])
        if args.closure:
            from probe_w36a_contact_closure import apply_closure
            d,_=apply_closure(d,root,1.,sha)
    else:
        f=root/'W35c-static-160-0-20261127';r=json.loads((f/'w34zx-export.json').read_text());sha=r['export']['sha256'];d,a=load(f/'w34zx-static-actor.glb',sha)
    g,_=geometry(d,a,True)
    if args.pad:
        from probe_w36g_pad_compliance import apply_pad
        g=apply_pad(g,root,1.,sha)
    m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text());h,ha=load(root/'W28-house-20261125/w28-house.glb',m['house_sha256'])
    hg,_=geometry(h,ha,drop=m['basket_support']['analytic_settle_delta_m'])
    rim=hg['Basket_thick_lipped_rim'];t=rim['v'][rim['tri']];top=topology(rim['v'],rim['tri'])
    print('RIM_TOPOLOGY',json.dumps(top),flush=True)
    # Close only the measured open seam in a diagnostic copy, not the asset.
    rv,idx=np.unique(rim['v'],axis=0,return_inverse=True)
    ct=idx[rim['tri']];edges=np.concatenate((ct[:,[0,1]],ct[:,[1,2]],ct[:,[2,0]]))
    _,ei,c=np.unique(np.sort(edges,axis=1),axis=0,return_inverse=True,return_counts=True)
    boundary=edges[c[ei]==1];assert len(boundary)==20
    ids=np.unique(boundary);assert len(ids)==20
    # The tube end loops can straddle the nominal Z plane. Derive them
    # from boundary connectivity, not a coordinate split.
    from scipy.sparse import coo_matrix
    from scipy.sparse.csgraph import connected_components
    ren={int(k):i for i,k in enumerate(ids)}
    ee=np.array([[ren[int(i)],ren[int(j)]] for i,j in boundary])
    i,j=ee.T;adj=coo_matrix((np.ones(len(i)*2),(np.r_[i,j],np.r_[j,i])),shape=(20,20)).tocsr()
    count,labels=connected_components(adj,directed=False)
    assert count==2 and np.all(np.bincount(labels)==10),labels.tolist()
    low=ids[labels==0];high=ids[labels==1]
    dist,match=cKDTree(rv[high]).query(rv[low],workers=1)
    assert len(set(match.tolist()))==10 and dist.max()<.002
    paired=dict(zip(low.tolist(),high[match].tolist()))
    bridge=[]
    for i,j in boundary:
        if i not in paired:continue
        ii,jj=paired[i],paired[j]
        assert np.any(np.all(boundary==[jj,ii],axis=1))
        bridge.extend(([j,i,ii],[j,ii,jj]))
    bridge=np.array(bridge);assert len(bridge)==20
    closed_faces=np.concatenate((ct,bridge));closed_top=topology(rv,closed_faces)
    assert closed_top['boundary_edges']==closed_top['nonmanifold_edges']==closed_top['inconsistent_edges']==0
    closed_t=rv[closed_faces];bridge_t=rv[bridge]
    top['containment_closure']={'added_triangles':len(bridge),'gap_min_mm':float(dist.min()*1000),'gap_max_mm':float(dist.max()*1000),'topology':closed_top}
    print('SEAM_CLOSURE',json.dumps(top['containment_closure']),flush=True)
    rn=normals(rim['v'],rim['tri']);rn/=np.maximum(np.linalg.norm(rn,axis=1),1e-12)[:,None];rn*=np.sign(top['signed_volume_m3'])
    cent=t.mean(1);rad=np.linalg.norm(t-cent[:,None],axis=2).max(1);tree=cKDTree(cent)
    b=g['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0'];node=next(n for n in d['nodes'] if n['name']=='ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0');at=d['meshes'][node['mesh']]['primitives'][0]['attributes']
    js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=np.array([d['nodes'][i]['name'] for i in d['skins'][node['skin']]['joints']])
    dom=jn[js[np.arange(len(js)),ws.argmax(1)]];norm=normals(b['v'],b['tri']);vn=np.zeros((int(b['canon'].max())+1,3))
    for k in range(3):np.add.at(vn,b['canon'][b['tri'][:,k]],norm)
    vn=vn[b['canon']];vn/=np.maximum(np.linalg.norm(vn,axis=1),1e-12)[:,None]
    body_volume=float(np.sum(np.einsum('ij,ij->i',b['v'][b['tri'][:,0]],norm))/6);vn*=np.sign(body_volume)
    _,first=np.unique(b['canon'],return_index=True)
    results={}
    for side in ('l','r'):
        hand=np.array([n.endswith('_'+side) and n.startswith(('hand_','thumb_','index_','middle_','ring_','pinky_')) for n in jn])
        ids=first[np.sum(ws[first]*hand[js[first]],axis=1)>.999]
        # All potentially interior points lie in the exact rim AABB. For
        # contact search, expand it by 12mm, then exact triangle distance.
        pp=b['v'][ids];box=np.all((pp>=t.min(axis=(0,1))-.012)&(pp<=t.max(axis=(0,1))+.012),axis=1);near=ids[box]
        rows=[];inside=[]
        for i in near:
            deadline();p=b['v'][i];_,j=tree.query(p,workers=1)
            ub,_,_=closest(p,t[j:j+1]);jj=np.array(tree.query_ball_point(p,ub+rad.max()+1e-10,workers=1),int)
            jj=jj[np.linalg.norm(cent[jj]-p,axis=1)-rad[jj]<=ub+1e-10]
            distance,point,k=closest(p,t[jj]);face=jj[k]
            if np.all((p>=t.min(axis=(0,1)))&(p<=t.max(axis=(0,1)))):
                wind=winding(p,closed_t)
                if abs(wind)>.5 and distance>1e-7:inside.append({'vertex':int(i),'joint':str(dom[i]),'depth_mm':distance*1000,'winding':wind})
            if distance<=.012:
                rows.append({'vertex':int(i),'digit':str(dom[i]).split('_')[0],'joint':str(dom[i]),'gap_mm':distance*1000,'skin_rim_normal_dot':float(vn[i]@rn[face]),'point':point.tolist(),'normal':rn[face].tolist()})
        facing=[x for x in rows if x['skin_rim_normal_dot']<-.5]
        pairs=[];same_section=[]
        for th in [x for x in facing if x['digit']=='thumb']:
            for su in [x for x in facing if x['digit'] in ('index','middle','ring','pinky')]:
                dot=float(np.dot(th['normal'],su['normal']));sep=float(np.linalg.norm(np.array(th['point'])-su['point'])*1000)
                if sep<=70:
                    pair={'thumb':th,'support':su,'dot':dot,'separation_mm':sep,'max_gap_mm':max(th['gap_mm'],su['gap_mm']),'angle_deg':float(np.degrees(np.arccos(np.clip(dot,-1,1))))}
                    same_section.append(pair)
                    if dot<=-.75:pairs.append(pair)
        pairs.sort(key=lambda q:q['max_gap_mm'])
        result={'min_vertex_distance_to_closure_mm':min(closest(v,bridge_t)[0] for v in b['v'][ids])*1000,'unique_hand_vertices':len(ids),'aabb_candidates':len(near),'inside_vertices':inside,'within_12mm':len(rows),'facing_within_3mm':sum(x['gap_mm']<=3 for x in facing),
                'by_digit':{digit:{'min_gap_mm':min((x['gap_mm'] for x in rows if x['digit']==digit),default=None),'facing_min_gap_mm':min((x['gap_mm'] for x in facing if x['digit']==digit),default=None)} for digit in ('thumb','index','middle','ring','pinky','hand')},
                'opposed_facing_pairs_within_3mm':sum(q['max_gap_mm']<=3 for q in pairs),'best_opposed_pair':pairs[0] if pairs else None,'opposed_pairs_within_1mm':sum(q['max_gap_mm']<=1 for q in pairs),'opposed_pairs_within_half_mm':sum(q['max_gap_mm']<=.5 for q in pairs),'same_section_facing_pairs':len(same_section),
                'largest_angle_within_12mm':min(same_section,key=lambda q:q['dot']) if same_section else None,
                'largest_angle_within_5mm':min((q for q in same_section if q['max_gap_mm']<=5),key=lambda q:q['dot'],default=None)}
        results[side]=result;print(side,json.dumps(result),flush=True)
    out.write_text(json.dumps({'status':'ART_HOLD_RIM_CONTACT_WITNESS','source_sha256':sha,'closure':args.closure,'pad':args.pad,'rim_topology':top,'body_signed_volume_m3':body_volume,'results':results,'limitations':['Vertex containment for seam-bridged diagnostic rim only, exact original distances, not swept volume, coplanar contact or complete basket solid containment. Facing normal opposition is not proof of load-bearing grip.']},indent=2))
if __name__=='__main__':main()
