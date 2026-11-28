"""Independent glTF first-frame foot/floor witness for W34j staging.
No Blender, runtime replacement, biomechanical balance or continuous-motion proof.
Uses exact exported LBS and triangle surface samples; only leg-chain vertices.
"""
import argparse, hashlib, json, math, struct
from pathlib import Path
import numpy as np

def load(path, expected):
    if path.exists():raw=path.read_bytes()
    else:
        from probe_w38l_archive import archived_bytes
        raw=archived_bytes(path)
    assert hashlib.sha256(raw).hexdigest()==expected
    magic,version,total,jlen,jtype=struct.unpack_from('<5I',raw)
    assert (magic,version,total,jtype)==(0x46546c67,2,len(raw),0x4e4f534a)
    doc=json.loads(raw[20:20+jlen])
    blen,btype=struct.unpack_from('<2I',raw,20+jlen)
    assert btype==0x004e4942
    buf=raw[28+jlen:28+jlen+blen]
    def acc(i):
        a=doc['accessors'][i]
        # Restricted sparse glTF morph support: implicit zero VEC3 float32
        # base, tightly packed unsigned indices and float32 values.
        if 'sparse' in a:
            assert 'bufferView' not in a and a.get('byteOffset',0)==0
            assert a['type']=='VEC3' and a['componentType']==5126 and not a.get('normalized')
            s=a['sparse'];assert 0<s['count']<=a['count']
            si=s['indices'];sv=s['values'];iv=doc['bufferViews'][si['bufferView']];vv=doc['bufferViews'][sv['bufferView']]
            dt=np.dtype({5121:'u1',5123:'<u2',5125:'<u4'}[si['componentType']])
            assert iv['buffer']==vv['buffer']==0 and 'byteStride' not in iv and 'byteStride' not in vv
            io=si.get('byteOffset',0);vo=sv.get('byteOffset',0)
            assert io>=0 and vo>=0 and io+s['count']*dt.itemsize<=iv['byteLength'] and vo+s['count']*12<=vv['byteLength']
            idx=np.frombuffer(buf,dtype=dt,count=s['count'],offset=iv.get('byteOffset',0)+io).astype(np.int64)
            assert idx[0]>=0 and idx[-1]<a['count'] and np.all(np.diff(idx)>0)
            values=np.frombuffer(buf,dtype='<f4',count=s['count']*3,offset=vv.get('byteOffset',0)+vo).reshape(-1,3)
            assert np.isfinite(values).all()
            result=np.zeros((a['count'],3),dtype='<f4');result[idx]=values
            return result
        v=doc['bufferViews'][a['bufferView']]
        assert v['buffer']==0
        dt=np.dtype({5121:'u1',5123:'<u2',5125:'<u4',5126:'<f4'}[a['componentType']])
        dim={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}[a['type']]
        result=np.ndarray((a['count'],dim),dtype=dt,buffer=buf,
            offset=v.get('byteOffset',0)+a.get('byteOffset',0),
            strides=(v.get('byteStride',dim*dt.itemsize),dt.itemsize))
        if a.get('normalized'):result=result.astype(float)/np.iinfo(dt).max
        return result
    return doc,acc

def matrix(n):
    if 'matrix' in n:return np.array(n['matrix']).reshape(4,4).T
    q=np.array(n.get('rotation',[0,0,0,1]),dtype=float)
    q/=np.linalg.norm(q);x,y,z,w=q
    m=np.eye(4)
    m[:3,:3]=np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],
        [2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],
        [2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])*np.array(n.get('scale',[1,1,1]))
    m[:3,3]=n.get('translation',[0,0,0])
    return m

def world(doc,nodes):
    result={}
    def visit(i,parent):
        assert i not in result
        result[i]=parent@matrix(nodes[i])
        for child in nodes[i].get('children',[]):visit(child,result[i])
    for i in doc['scenes'][doc.get('scene',0)]['nodes']:visit(i,np.eye(4))
    return result

def place(points,yaw,x,y,z):
    t=math.radians(yaw);c,s=math.cos(t),math.sin(t)
    return points@np.array([[c,0,s],[0,1,0],[-s,0,c]]).T+np.array([x,z,-y])

def ground_heights(points,room):
    # Vertical rays in glTF Y-up, from a fixed low ceiling above the feet.
    # All room meshes are considered, not just a nominal y=0 plane.
    heights=np.full(len(points),-np.inf);names=np.full(len(points),'',dtype=object)
    xz=points[:,[0,2]]
    for name,vertices,tri in room:
        lo,hi=vertices.min(axis=0),vertices.max(axis=0)
        if lo[1]>.25 or not np.any(np.all((xz>=lo[[0,2]]-1e-8)&(xz<=hi[[0,2]]+1e-8),axis=1)):continue
        a,b,c=vertices[tri[:,0]],vertices[tri[:,1]],vertices[tri[:,2]]
        ab=b-a;ac=c-a;det=ab[:,0]*ac[:,2]-ab[:,2]*ac[:,0]
        good=np.abs(det)>1e-12
        a,ab,ac,det=a[good],ab[good],ac[good],det[good]
        for i,(x,z) in enumerate(xz):
            if not (lo[0]-1e-8<=x<=hi[0]+1e-8 and lo[2]-1e-8<=z<=hi[2]+1e-8):continue
            u=((x-a[:,0])*ac[:,2]-(z-a[:,2])*ac[:,0])/det
            v=(ab[:,0]*(z-a[:,2])-ab[:,2]*(x-a[:,0]))/det
            h=a[:,1]+u*ab[:,1]+v*ac[:,1]
            valid=(u>=-1e-7)&(v>=-1e-7)&(u+v<=1+1e-7)&(h<=.25)
            if np.any(valid):
                top=float(h[valid].max())
                if top>heights[i]:heights[i]=top;names[i]=name
    assert np.isfinite(heights).all(),'Missing foot floor witness'
    return heights,names

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('evidence',type=Path);parser.add_argument('output',type=Path)
    args=parser.parse_args();root=args.evidence
    assert not args.output.exists()
    ah='587c7b0b10d38207a3a305ba71557f8f4ba82abd2ca21fc3389aba5e52009dcf'
    hh='fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622'
    a,aa=load(root/'W34f-corrective-glb-20261127/w34f-actor.glb',ah)
    h,ha=load(root/'W28-house-20261125/w28-house.glb',hh)
    ref=json.loads((root/'W34j-lean-20261127/w34a-dual-ik.json').read_text())
    j=json.loads((root/'W34j-lean-20261127/w34j-shell-approach.json').read_text())
    assert j['actor_sha256']==ah and ref['house_sha256']==hh
    nodes=[dict(n) for n in a['nodes']]
    anim=next(x for x in a['animations'] if x['name']=='Mother_GestureTowardsBasket')
    times=[]
    for c in anim['channels']:
        t=c['target'];s=anim['samplers'][c['sampler']]
        times.append(float(aa(s['input'])[0,0]))
        v=aa(s['output'])
        if t['path']=='weights':
            n=nodes[t['node']];width=len(a['meshes'][n['mesh']]['primitives'][0]['targets'])
            n['weights']=v.reshape(-1,width)[0].tolist()
        else:nodes[t['node']][t['path']]=v[0].tolist()
    assert max(abs(t-1/24) for t in times)<1e-6
    aw=world(a,nodes);hw=world(h,h['nodes'])
    byname={n['name']:i for i,n in enumerate(nodes)}
    # Cross-witness actual Blender first-frame shoulder anchors.
    errors=[]
    for side in ('l','r'):
        p=place(aw[byname['upperarm_'+side]][:3,3][None,:],90,*ref['stance']['offset'])[0]
        b=np.array(ref['stance']['sides'][side]['shoulder'])
        errors.append(float(np.linalg.norm(p-np.array([b[0],b[2],-b[1]]))*1000))
    assert max(errors)<.1,errors
    node=nodes[byname['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0']]
    pr=a['meshes'][node['mesh']]['primitives'][0];attrs=pr['attributes']
    v=aa(attrs['POSITION']).astype(float)
    assert abs(node['weights'][2])<1e-8
    for weight,target in zip(node['weights'],pr['targets']):
        if weight:v+=weight*aa(target['POSITION'])
    joints=aa(attrs['JOINTS_0']);weights=aa(attrs['WEIGHTS_0']).astype(float)
    assert np.max(abs(weights.sum(axis=1)-1))<1e-5
    skin=a['skins'][node['skin']]
    ibm=aa(skin['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1)
    jm=np.stack([aw[k]@ibm[i] for i,k in enumerate(skin['joints'])])
    hom=np.column_stack((v,np.ones(len(v))))
    evaluated=sum(np.einsum('nij,nj->ni',jm[joints[:,k]],hom)*weights[:,k,None] for k in range(4))[:,:3]
    foot={}
    for side in ('l','r'):
        ids=[skin['joints'].index(byname[n+'_'+side]) for n in ('foot','ball')]
        # Exclude vertices with any spine/arm influence: W34j changes only these bones.
        leg=[skin['joints'].index(byname[n+'_'+side]) for n in ('thigh','calf','foot','ball')]
        keep=(np.sum(weights*np.isin(joints,ids),axis=1)>.95)&(np.sum(weights*~np.isin(joints,leg),axis=1)<1e-8)
        f=np.unique(np.round(evaluated[keep],8),axis=0);assert len(f)>30
        foot[side]=f
    room=[]
    for i,n in enumerate(h['nodes']):
        if 'mesh' not in n:continue
        for pr in h['meshes'][n['mesh']]['primitives']:
            assert pr.get('mode',4)==4
            pp=ha(pr['attributes']['POSITION']);tri=ha(pr['indices']).reshape(-1,3)
            vertices=(np.column_stack((pp,np.ones(len(pp))))@hw[i].T)[:,:3]
            room.append((n['name'],vertices,tri))
    tabletop=max(float(v[:,1].max()) for n,v,t in room if n=='Coarse_work_surface')
    assert abs(tabletop-.840)<.001,tabletop
    rows=[]
    for yaw,x,y,z in [(90,*ref['stance']['offset']),(180,.35,-.96,.015),(180,.35,-1.04,.015)]:
        row={'yaw_deg':yaw,'offset':[x,y,z],'feet':{}}
        for side,f in foot.items():
            pp=place(f,yaw,x,y,z)
            ground,names=ground_heights(pp,room)
            gaps=(pp[:,1]-ground)*1000
            k=int(np.argmin(gaps))
            row['feet'][side]={'vertices':len(f),'minimum_gap_mm':float(gaps[k]),
                'below_floor_vertices':int(np.sum(gaps<-.5)),'within_2mm_vertices':int(np.sum(abs(gaps)<=2)),
                'surface_names':sorted(set(names)),'lowest_witness_gltf':pp[k].tolist(),
                'surface_y_m':float(ground[k]),'min_vertex_y_m':float(pp[:,1].min())}
        # Re-evaluate the exact vertical placement on the actual triangles.
        # Lower only until the first foot contact; do not average two soles.
        drop=min(v['minimum_gap_mm'] for v in row['feet'].values())/1000
        grounded={'offset':[x,y,z-drop],'feet':{}}
        for side,f in foot.items():
            pp=place(f,yaw,x,y,z-drop)
            surface,names=ground_heights(pp,room)
            gaps=(pp[:,1]-surface)*1000
            grounded['feet'][side]={
                'minimum_gap_mm':float(gaps.min()),
                'below_floor_vertices':int(np.sum(gaps<-.5)),
                'within_2mm_vertices':int(np.sum(abs(gaps)<=2)),
                'surface_names':sorted(set(names))}
        row['grounded_trial']=grounded
        rows.append(row)
    report={'status':'ART_HOLD_FOOT_SURFACE_WITNESS','actor_sha256':ah,'house_sha256':hh,
        'frame_time_s':times[0],'shoulder_reference_errors_mm':errors,'tabletop_m':tabletop,'rows':rows,
        'limitations':['First-frame GLB linear skinning; selected foot/ball vertices only, no full body room or balance check. Rays are sampled points, not exact intersection; W34j upper-body changes do not affect selected leg-only vertices. No new pose or grip.']}
    args.output.parent.mkdir(exist_ok=True,parents=True)
    with args.output.open('x',encoding='utf-8') as f:json.dump(report,f,indent=2)
    print(json.dumps(report,indent=2))

if __name__=='__main__':main()
