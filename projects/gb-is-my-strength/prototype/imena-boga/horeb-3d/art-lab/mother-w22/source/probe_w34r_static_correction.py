"""W34r static joint correction trial on exact GLBs. CPU only, not ART acceptance."""
from pathlib import Path
import argparse,sys,time,json,math,hashlib,struct,copy
import numpy as np
from scipy.spatial.transform import Rotation as R
from scipy.spatial import cKDTree
from probe_w34l_foot_surface import load,world
START=time.monotonic()
def deadline():
    if time.monotonic()-START>25:raise TimeoutError("bounded single-thread diagnostic")
def unit(v):
    n=np.linalg.norm(v);assert n>1e-9;return v/n
def basis(f,t):
    f=unit(f);t=unit(t-f*np.dot(t,f));return np.column_stack((f,t,np.cross(f,t)))
def swing(u,v):
    u,v=unit(u),unit(v);c=np.cross(u,v);n=np.linalg.norm(c);d=np.clip(u@v,-1,1)
    if n<1e-8:
        assert d>0;return np.eye(3)
    return R.from_rotvec(c/n*math.atan2(n,d)).as_matrix()
def crossings(a,b):
    # Non-coplanar segment/triangle crossings, inclusive edge barycentrics.
    hit=np.zeros(len(a),bool)
    for first,second in ((a,b),(b,a)):
        e1=second[:,1]-second[:,0];e2=second[:,2]-second[:,0]
        for k in range(3):
            start=first[:,k];d=first[:,(k+1)%3]-start
            q=np.cross(d,e2);det=np.einsum('ij,ij->i',e1,q)
            ok=np.abs(det)>1e-13;inv=np.divide(1,det,out=np.zeros_like(det),where=ok)
            t=start-second[:,0];u=np.einsum('ij,ij->i',t,q)*inv
            cross=np.cross(t,e1);v=np.einsum('ij,ij->i',d,cross)*inv
            s=np.einsum('ij,ij->i',e2,cross)*inv
            hit|=ok&(u>=-1e-7)&(v>=-1e-7)&(u+v<=1+1e-7)&(s>1e-6)&(s<1-1e-6)
    return hit
def contacts(A,B,active,selfcheck=False):
    av,af,ac=A['v'],A['tri'],A['canon']
    bv,bf,bc=B['v'],B['tri'],B['canon']
    a=av[af];b=bv[bf];ac=ac[af];bc=bc[bf]
    ca=a.mean(1);cb=b.mean(1);ar=np.linalg.norm(a-ca[:,None],axis=2).max(1);br=np.linalg.norm(b-cb[:,None],axis=2).max(1)
    alo=a.min(1);ahi=a.max(1);blo=b.min(1);bhi=b.max(1)
    total=0;loc={};target_loc={};face_ids=set()
    mask=np.zeros(len(a),bool);mask[active]=True
    for low,high in zip((-1,.006,.02,.06),(.006,.02,.06,np.inf)):
        ids=np.flatnonzero((br>low)&(br<=high))
        if not len(ids):continue
        tree=cKDTree(cb[ids]);rad=br[ids].max()
        for start in range(0,len(active),512):
            deadline();ii=active[start:start+512];neigh=tree.query_ball_point(ca[ii],ar[ii]+rad+1e-8,workers=1)
            lens=np.array([len(v) for v in neigh]);ia=np.repeat(ii,lens)
            if not len(ia):continue
            ib=ids[np.concatenate(neigh).astype(int)]
            keep=np.all((alo[ia]<=bhi[ib]+1e-8)&(blo[ib]<=ahi[ia]+1e-8),axis=1)
            ia,ib=ia[keep],ib[keep]
            if selfcheck:
                keep=((~mask[ib])|(ia<ib))&~np.any(ac[ia,:,None]==bc[ib,None,:],axis=(1,2))
                ia,ib=ia[keep],ib[keep]
            if not len(ia):continue
            hit=crossings(a[ia],b[ib]);total+=int(hit.sum())
            if selfcheck:face_ids.update(ia[hit].tolist());face_ids.update(ib[hit].tolist())
            for tag in A['region'][ia[hit]]:
                loc[tag]=loc.get(tag,0)+1
            for tag in B['region'][ib[hit]]:target_loc[tag]=target_loc.get(tag,0)+1
    return {'pairs':total,'source_regions':loc,'target_regions':target_loc,'face_ids':sorted(face_ids)}
def main():
    parser=argparse.ArgumentParser();parser.add_argument('evidence',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args()
    root=args.evidence;out=args.output;assert not out.exists()
    ah='587c7b0b10d38207a3a305ba71557f8f4ba82abd2ca21fc3389aba5e52009dcf'
    hh='fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622'
    doc,acc=load(root/'W34f-corrective-glb-20261127/w34f-actor.glb',ah)
    j=json.loads((root/'W34j-lean-20261127/w34j-shell-approach.json').read_text())
    wpath=root/'W34l-foot-surface-20261127/w34l-foot-surface-v2.json'
    w=json.loads(wpath.read_text());m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text())
    assert m['actor_sha256']==j['actor_sha256']==ah and m['house_sha256']==w['house_sha256']==hh
    assert m['foot_witness_sha256']==hashlib.sha256(wpath.read_bytes()).hexdigest()
    z=next(r['grounded_trial']['offset'][2] for r in w['rows'] if r['yaw_deg']==180 and r['offset'][1]==-.96)
    drop=m['basket_support']['analytic_settle_delta_m']
    nodes=[dict(n) for n in doc['nodes']]
    anim=next(x for x in doc['animations'] if x['name']=='Mother_GestureTowardsBasket')
    for ch in anim['channels']:
        t=ch['target'];s=anim['samplers'][ch['sampler']]
        assert abs(float(acc(s['input'])[0,0])-1/24)<1e-6
        v=acc(s['output'])
        if t['path']=='weights':
            n=nodes[t['node']];width=len(doc['meshes'][n['mesh']]['primitives'][0]['targets'])
            n['weights']=v.reshape(-1,width)[0].tolist()
        else:nodes[t['node']][t['path']]=v[0].tolist()
    C=np.array([[1,0,0],[0,0,-1],[0,1,0.]])
    P=np.eye(4);P[:3,:3]=np.diag([-1.,-1.,1.])@C;P[:3,3]=[.35,-.96,z]
    base={i:P@v for i,v in world(doc,nodes).items()}
    names={n['name']:i for i,n in enumerate(nodes)}
    def descendants(i):
        yield i
        for c in nodes[i].get('children',[]):yield from descendants(c)
    skin=doc['skins'][0];ibm=acc(skin['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1)
    jointnames=np.array([nodes[i]['name'] for i in skin['joints']])
    arm=np.array([n.startswith(('clavicle_','upperarm_','lowerarm_','hand_','thumb_','index_','middle_','ring_','pinky_')) for n in jointnames])
    templates={}
    for i,n in enumerate(nodes):
        if n['name'] not in ('ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0','W28e_tailored_linen'):continue
        mesh=doc['meshes'][n['mesh']];assert len(mesh['primitives'])==1
        pr=mesh['primitives'][0];at=pr['attributes'];rest=acc(at['POSITION']).astype(float);v=rest.copy()
        weights=list(n.get('weights',mesh.get('weights',[])));targetnames=mesh.get('extras',{}).get('targetNames',[])
        assert len(weights)==len(pr['targets'])==len(targetnames)
        for k,(wt,t) in enumerate(zip(weights,pr['targets'])):
            if targetnames[k]=='W34e_JointPoseCorrective':wt=0;weights[k]=0
            if wt:v+=wt*acc(t['POSITION'])
        n['weights']=weights
        js=acc(at['JOINTS_0']);ws=acc(at['WEIGHTS_0']).astype(float);assert np.max(abs(ws.sum(1)-1))<1e-5
        tri=acc(pr['indices']).reshape(-1,3)
        sig=np.column_stack((np.round(rest,7),js,np.round(ws,7),np.round(v,7)))
        canon=np.unique(sig,axis=0,return_inverse=True)[1]
        av=np.sum(ws*arm[js],axis=1)>.1;active=np.flatnonzero(np.any(av[tri],axis=1))
        dom=jointnames[js[np.arange(len(js)),ws.argmax(1)]]
        # Label by dominant vertex nearest first vertex; diagnostic localization only.
        templates[n['name']]={'hom':np.column_stack((v,np.ones(len(v)))),'js':js,'ws':ws,'tri':tri,'canon':canon,'active':active,'region':dom[tri[:,0]]}
    assert len(templates)==2
    body,tunic=templates.values()
    def pose(row,reference,portion):
        M={i:v.copy() for i,v in base.items()}
        def p(n):return M[names[n]][:3,3].copy()
        def apply(n,rot):
            pivot=p(n);T=np.eye(4);T[:3,:3]=rot;T[:3,3]=pivot-rot@pivot
            for i in descendants(names[n]):M[i]=T@M[i]
        for n in ('spine_01','spine_02'):apply(n,R.from_euler('x',-row['lean_deg']/2,degrees=True).as_matrix())
        errors={}
        for s,sign in [('l',1),('r',-1)]:
            up,low,hand=[n+'_'+s for n in ('upperarm','lowerarm','hand')]
            a0,b0,c0=map(p,(up,low,hand));target=np.array(row['targets'][s]['wrist'])+[0,0,drop]
            elbow=np.array(reference['grounded_settled_basket']['sides'][s]['elbow'])
            u,v=b0-a0,c0-b0;du,dv=elbow-a0,target-elbow
            apply(up,basis(du,np.cross(du,dv))@basis(u,np.cross(u,v)).T)
            apply(low,swing(p(hand)-p(low),target-p(low)))
            n=-np.array(row['targets'][s]['shell_normal']);f=np.array([0.,0.,-1.]);f=unit(f-n*np.dot(f,n));t=np.cross(-sign*n,f)
            def hb():return basis(p('middle_01_'+s)-p(hand),p('index_01_'+s)-p('pinky_01_'+s))
            desired=basis(f,t);axis=unit(p(hand)-p(low))
            q=R.from_matrix(desired@hb().T).as_quat();twist=np.r_[axis*np.dot(q[:3],axis),q[3]]
            if np.linalg.norm(twist)>1e-8:
                twist/=np.linalg.norm(twist)
                if twist[3]<0:twist=-twist
                angle=2*math.atan2(twist[:3]@axis,twist[3])
                apply(low,R.from_rotvec(axis*angle*portion).as_matrix())
            residual=R.from_matrix(desired@hb().T).magnitude()*180/math.pi
            apply(hand,desired@hb().T)
            errors[s]={'wrist_error_mm':float(np.linalg.norm(p(hand)-target)*1000),'elbow_error_mm':float(np.linalg.norm(p(low)-elbow)*1000),'basis_error':float(np.max(abs(hb()-desired))),'wrist_rotation_deg':float(residual)}
            assert max(errors[s][k] for k in ('wrist_error_mm','elbow_error_mm','basis_error'))<.01
        jm=np.stack([M[i]@ibm[k] for k,i in enumerate(skin['joints'])])
        result=[]
        for t in (body,tunic):
            v=sum(np.einsum('nij,nj->ni',jm[t['js'][:,k]],t['hom'])*t['ws'][:,k,None] for k in range(4))[:,:3]
            result.append(dict(t,v=v))
        return M,errors,result
    rows=[];best=None
    for lean,height in ((18,1.055),(12,1.095)):
        row=next(r for r in j['rows'] if r['stance_y']==-.96 and r['lean_deg']==lean and r['height']==height)
        ref=next(r for r in m['rows'] if r['stance_y']==-.96 and r['lean_deg']==lean and r['height']==height)
        for portion in (.65,.35,.9):
            deadline();M,err,(a,b)=pose(row,ref,portion)
            result={'lean_deg':lean,'reference_height_m':height,'pronation_fraction':portion,'witness':err}
            result['skin_self']=contacts(a,a,a['active'],True)
            result['arm_skin_tunic']=contacts(a,b,a['active'])
            result['tunic_self']=contacts(b,b,b['active'],True)
            result['sum_proper_crossings']=sum(result[k]['pairs'] for k in ('skin_self','arm_skin_tunic','tunic_self'))
            rows.append(result)
            print(json.dumps({k:result[k] for k in ('lean_deg','reference_height_m','pronation_fraction','sum_proper_crossings')},ensure_ascii=True),flush=True)
            if best is None or result['sum_proper_crossings']<best[0]['sum_proper_crossings']:best=(result,M)
    assert len(rows)==6
    # Export an isolated static actor pose using original GLB mesh, materials, skin and morphs.
    # Preserve the binary chunk verbatim; only node transforms and animation metadata change.
    result,M=best;doc2=copy.deepcopy(doc);doc2.pop('animations',None)
    parent={c:i for i,n in enumerate(nodes) for c in n.get('children',[])}
    back=np.eye(4);back[:3,:3]=C.T
    for i,n in enumerate(nodes):
        v=np.linalg.inv(M[parent[i]])@M[i] if i in parent else back@M[i]
        scale=np.linalg.norm(v[:3,:3],axis=0);rot=v[:3,:3]/scale
        assert np.linalg.det(rot)>.999 and np.max(abs(rot.T@rot-np.eye(3)))<1e-5
        d=doc2['nodes'][i];d.pop('matrix',None)
        d['translation']=v[:3,3].tolist();d['scale']=scale.tolist();d['rotation']=R.from_matrix(rot).as_quat().tolist()
        if 'weights' in n:d['weights']=n['weights']
    doc2['asset']['generator']='HOREB W34r isolated static diagnostic pose'
    raw=(root/'W34f-corrective-glb-20261127/w34f-actor.glb').read_bytes();jlen=struct.unpack_from('<I',raw,12)[0];binchunk=raw[20+jlen:]
    jb=json.dumps(doc2,separators=(',',':'),ensure_ascii=True).encode();jb+=b' '*((-len(jb))%4)
    packed=struct.pack('<5I',0x46546c67,2,20+len(jb)+len(binchunk),len(jb),0x4e4f534a)+jb+binchunk
    out.mkdir()
    glb=out/'w34r-static-actor.glb';glb.write_bytes(packed);sha=hashlib.sha256(packed).hexdigest()
    reread,ra=load(glb,sha);rw=world(reread,reread['nodes'])
    maxerr=max(float(np.max(abs(rw[i]-back@M[i]))) for i in rw)
    assert maxerr<1e-5,maxerr
    report={'status':'ART_HOLD_STATIC_CORRECTION_TRIAL','actor_sha256':ah,'house_sha256':hh,'static_glb_sha256':sha,'reimport_matrix_max_error':maxerr,'rows':rows,'selected':result,'seconds':time.monotonic()-START,
    'limitations':['Proper noncoplanar surface crossing witness, excludes shared canonical vertices; not Blender BVH counts, solid penetration, all body regions, prop/room collision or force closure. Static derivative only, no animation. Visual review required.']}
    (out/'w34r-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps({'selected':result,'sha':sha,'matrix_error':maxerr,'seconds':report['seconds']}),flush=True)
if __name__=='__main__':main()
