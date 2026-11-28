"""W34s local sleeve correction of the static trial, preserving rest asset."""
from pathlib import Path
import argparse,hashlib,json,math,struct,time,copy
import numpy as np
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components
from probe_w34l_foot_surface import load,world
from probe_w34r_static_correction import contacts,deadline

def main():
    parser=argparse.ArgumentParser();parser.add_argument('source',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args()
    src=args.source/'w34r-static-actor.glb';report=json.loads((args.source/'w34r-report.json').read_text())
    out=args.output;assert not out.exists()
    doc,acc=load(src,report['static_glb_sha256'])
    skin=doc['skins'][0];M=world(doc,doc['nodes']);ibm=acc(skin['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1)
    jm=np.stack([M[i]@ibm[k] for k,i in enumerate(skin['joints'])])
    jointnames=np.array([doc['nodes'][i]['name'] for i in skin['joints']])
    arm=np.array([n.startswith(('clavicle_','upperarm_','lowerarm_','hand_','thumb_','index_','middle_','ring_','pinky_')) for n in jointnames])
    templates={}
    for n in doc['nodes']:
        if n['name'] not in ('ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0','W28e_tailored_linen'):continue
        mesh=doc['meshes'][n['mesh']];pr=mesh['primitives'][0];at=pr['attributes']
        rest=acc(at['POSITION']).astype(float);v=rest.copy()
        norms=acc(at['NORMAL']).astype(float).copy()
        weights=n['weights'];targetnames=mesh['extras']['targetNames'];idx=targetnames.index('W34e_JointPoseCorrective');assert weights[idx]==0
        for wt,t in zip(weights,pr['targets']):
            if wt:
                v+=wt*acc(t['POSITION'])
                if 'NORMAL' in t:norms+=wt*acc(t['NORMAL'])
        js=acc(at['JOINTS_0']);ws=acc(at['WEIGHTS_0']).astype(float);tri=acc(pr['indices']).reshape(-1,3)
        sig=np.column_stack((np.round(rest,7),js,np.round(ws,7),np.round(v,7)))
        _,first,canon=np.unique(sig,axis=0,return_index=True,return_inverse=True)
        av=np.sum(ws*arm[js],axis=1)>.1;active=np.flatnonzero(np.any(av[tri],axis=1))
        dom=jointnames[js[np.arange(len(js)),ws.argmax(1)]]
        J=sum(jm[js[:,k]]*ws[:,k,None,None] for k in range(4))
        posed=np.einsum('nij,nj->ni',J,np.column_stack((v,np.ones(len(v)))))[:,:3]
        templates[n['name']]=dict(v=posed,rest=v,authored_normals=norms,tri=tri,canon=canon,first=first,active=active,region=dom[tri[:,0]],J=J,pr=pr,mesh=n['mesh'],idx=idx,node=n)
    a=templates['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0'];b=templates['W28e_tailored_linen']
    before=contacts(b,b,b['active'],True)
    base_skin=contacts(a,b,a['active'])
    assert before['pairs']==report['selected']['tunic_self']['pairs'] and base_skin['pairs']==report['selected']['arm_skin_tunic']['pairs'],(before['pairs'],base_skin['pairs'])
    first,canon=b['first'],b['canon'];p=b['v'][first];ct=canon[b['tri']]
    assert np.max(abs(p[canon]-b['v']))<1e-6
    edges=np.sort(np.concatenate([ct[:,[0,1]],ct[:,[1,2]],ct[:,[2,0]]]),axis=1)
    edges=edges[edges[:,0]!=edges[:,1]]
    uniq,counts=np.unique(edges,axis=0,return_counts=True)
    boundary=np.unique(uniq[counts==1])
    i,j=uniq.T
    adjacency=coo_matrix((np.ones(len(i)*2),(np.r_[i,j],np.r_[j,i])),shape=(len(p),len(p))).tocsr()
    deg=np.asarray(adjacency.sum(1)).ravel()
    affected=np.unique(ct[before['face_ids']])
    dist=np.full(len(p),99);dist[affected]=0
    for ring in range(1,4):
        reached=(adjacency@(dist==ring-1).astype(float))>0
        dist[(dist==99)&reached]=ring
    strength=np.choose(np.minimum(dist,4),[1.,.8,.5,.2,0.])
    strength[boundary]=0
    # Keep rigidly supported border and uninvolved geometry fixed.
    assert np.any(strength>0)
    rows=[];best=None
    for iterations,step,cap in ((2,.3,.003),(4,.4,.005),(6,.5,.008),(8,.6,.012)):
        deadline();q=p.copy()
        for _ in range(iterations):
            mean=(adjacency@q)/np.maximum(deg,1)[:,None]
            q+=(mean-q)*strength[:,None]*step
            delta=q-p;length=np.linalg.norm(delta,axis=1)
            q=p+delta*np.minimum(1,cap/np.maximum(length,1e-12))[:,None]
        candidate=dict(b,v=q[canon])
        tc=contacts(candidate,candidate,b['active'],True);sk=contacts(a,candidate,a['active'])
        d=np.linalg.norm(q-p,axis=1)
        row={'iterations':iterations,'step':step,'cap_mm':cap*1000,'tunic_pairs':tc['pairs'],'arm_skin_tunic_pairs':sk['pairs'],'changed_vertices':int(np.sum(d>1e-6)),'max_displacement_mm':float(d.max()*1000)}
        rows.append(row);print(json.dumps(row),flush=True)
        if tc['pairs']<before['pairs'] and sk['pairs']<=base_skin['pairs']:
            if best is None or (row['tunic_pairs'],row['max_displacement_mm'])<(best[0]['tunic_pairs'],best[0]['max_displacement_mm']):best=(row,q)
    assert best is not None,'No nonregressing candidate'
    selected,q=best;delta_world=q[canon]-b['v'];J=b['J'][:,:3,:3]
    assert np.linalg.cond(J).max()<100
    delta=np.linalg.solve(J,delta_world[...,None])[...,0]
    assert np.max(abs(np.einsum('nij,nj->ni',J,delta)-delta_world))<1e-8
    # Update existing dormant corrective target, with original position and normal data preserved elsewhere.
    # Area-weighted geometric normal difference is added to authored normals, not a global replacement.
    def geom_normals(v):
        t=b['tri'];n=np.cross(v[t[:,1]]-v[t[:,0]],v[t[:,2]]-v[t[:,0]])
        c=canon[t];s=np.zeros((len(p),3))
        for k in range(3):np.add.at(s,c[:,k],n)
        s/=np.maximum(np.linalg.norm(s,axis=1),1e-12)[:,None]
        return s[canon]
    old=geom_normals(b['rest']);new=geom_normals(b['rest']+delta)
    norm=b['authored_normals'];corrected=norm+(new-old)
    corrected/=np.maximum(np.linalg.norm(corrected,axis=1),1e-12)[:,None]
    nd=corrected-norm
    nd[np.linalg.norm(new-old,axis=1)<1e-8]=0
    raw=src.read_bytes();jl=struct.unpack_from('<I',raw,12)[0];binchunk=bytearray(raw[20+jl:]);doc2=copy.deepcopy(doc)
    target=b['pr']['targets'][b['idx']]
    def set_acc(i,vals):
        a=doc2['accessors'][i];v=doc2['bufferViews'][a['bufferView']]
        assert a['componentType']==5126 and a['type']=='VEC3' and a['count']==len(vals) and 'sparse' not in a
        dest=np.ndarray((len(vals),3),dtype='<f4',buffer=binchunk,offset=8+v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',12),4))
        dest[:]=vals
        if 'min'in a:a['min']=dest.min(0).tolist()
        if 'max'in a:a['max']=dest.max(0).tolist()
    set_acc(target['POSITION'],delta);set_acc(target['NORMAL'],nd)
    n=next(n for n in doc2['nodes'] if n['name']==b['node']['name']);n['weights'][b['idx']]=1.
    doc2['meshes'][b['mesh']]['extras']['targetNames'][b['idx']]='W34s_LocalSleeveCorrection'
    doc2['asset']['generator']='HOREB W34s isolated static sleeve correction'
    jb=json.dumps(doc2,separators=(',',':'),ensure_ascii=True).encode();jb+=b' '*((-len(jb))%4)
    packed=struct.pack('<5I',0x46546c67,2,20+len(jb)+len(binchunk),len(jb),0x4e4f534a)+jb+binchunk
    out.mkdir();glb=out/'w34s-static-actor.glb';glb.write_bytes(packed);sha=hashlib.sha256(packed).hexdigest()
    d,ra=load(glb,sha);rp=ra(target['POSITION']).astype(float)
    vv=b['v']+np.einsum('nij,nj->ni',J,rp);err=float(np.max(abs(vv-q[canon])))
    assert err<1e-6
    final=contacts(dict(b,v=vv),dict(b,v=vv),b['active'],True);finalskin=contacts(a,dict(b,v=vv),a['active'])
    assert final['pairs']==selected['tunic_pairs'] and finalskin['pairs']==selected['arm_skin_tunic_pairs']
    result={'status':'ART_HOLD_LOCAL_SLEEVE_CORRECTION','source_glb_sha256':report['static_glb_sha256'],'glb_sha256':sha,'baseline_tunic_pairs':before['pairs'],'baseline_arm_skin_tunic_pairs':base_skin['pairs'],'selected':selected,'trials':rows,'reimport_position_max_error_m':err,'limitations':['Local smoothing of a static experimental pose only. No full-body/prop/room clearance, visual acceptance or animation proof. Surface crossings omit coplanar contacts and shared vertices.']}
    (out/'w34s-report.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result),flush=True)
if __name__=='__main__':main()
