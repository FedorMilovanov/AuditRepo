"""Bake exact sampled DQS geometry into isolated static glTF morph targets."""
from pathlib import Path
import copy,hashlib,json,struct
import numpy as np
from probe_w34l_foot_surface import load,world
from probe_w34t_whole_scene import geometry

def export_static(src,doc,acc,target,filename):
    doc2=copy.deepcopy(doc)
    raw=Path(src).read_bytes();jl=struct.unpack_from('<I',raw,12)[0];blen,btype=struct.unpack_from('<2I',raw,20+jl)
    assert btype==0x004e4942 and len(doc2['buffers'])==1 and not doc2.get('animations')
    payload=bytearray(raw[28+jl:28+jl+blen]);payload=payload[:doc2['buffers'][0]['byteLength']]
    def append(v):
        data=np.asarray(v,dtype='<f4');assert data.ndim==2 and data.shape[1]==3 and np.isfinite(data).all()
        payload.extend(b'\0'*((-len(payload))%4));offset=len(payload);payload.extend(data.tobytes())
        vi=len(doc2['bufferViews']);doc2['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':data.nbytes,'target':34962})
        ai=len(doc2['accessors']);doc2['accessors'].append({'bufferView':vi,'componentType':5126,'count':len(data),'type':'VEC3','min':data.min(0).tolist(),'max':data.max(0).tolist()})
        return ai
    w=world(doc,doc['nodes']);skin=doc['skins'][0];ibm=acc(skin['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1)
    jm=np.stack([w[i]@ibm[k] for k,i in enumerate(skin['joints'])])
    metrics={}
    for k in ('ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0','W28e_tailored_linen'):
        n=next(n for n in doc2['nodes'] if n['name']==k);mesh=doc2['meshes'][n['mesh']];assert len(mesh['primitives'])==1
        assert sum(x.get('mesh')==n['mesh'] for x in doc2['nodes'])==1
        pr=mesh['primitives'][0];at=pr['attributes']
        v=acc(at['POSITION']).astype(float);norm=acc(at['NORMAL']).astype(float)
        weights=list(n.get('weights',mesh.get('weights',[])));targets=pr.get('targets',[])
        assert len(weights)==len(targets)
        for wt,t in zip(weights,targets):
            if wt:
                v+=wt*acc(t['POSITION'])
                if 'NORMAL' in t:norm+=wt*acc(t['NORMAL'])
        js=acc(at['JOINTS_0']);ws=acc(at['WEIGHTS_0']).astype(float)
        J=sum(jm[js[:,i]]*ws[:,i,None,None] for i in range(4))
        posed=np.einsum('nij,nj->ni',J,np.column_stack((v,np.ones(len(v)))))[:,:3]
        delta_world=target[k]['v']-posed;move=np.linalg.norm(delta_world,axis=1)>1e-10
        local=np.zeros_like(v)
        mat=J[move,:3,:3]
        assert len(mat)>0 and np.linalg.cond(mat).max()<100
        local[move]=np.linalg.solve(mat,delta_world[move,...,None])[...,0]
        tri=target[k]['tri'];canon=target[k]['canon']
        def gn(pos):
            vv=pos[tri];normal=np.cross(vv[:,1]-vv[:,0],vv[:,2]-vv[:,0]);s=np.zeros((int(canon.max())+1,3))
            for i in range(3):np.add.at(s,canon[tri[:,i]],normal)
            s/=np.maximum(np.linalg.norm(s,axis=1),1e-12)[:,None]
            return s[canon]
        old=gn(v);new=gn(v+local)
        corrected=norm+new-old;corrected/=np.maximum(np.linalg.norm(corrected,axis=1),1e-12)[:,None]
        nd=corrected-norm;nd[np.linalg.norm(new-old,axis=1)<1e-8]=0
        pr.setdefault('targets',[]).append({'POSITION':append(local),'NORMAL':append(nd)})
        mesh.setdefault('extras',{}).setdefault('targetNames',[]).append('W34zx_StaticDQCorrective')
        assert len(mesh['extras']['targetNames'])==len(pr['targets'])
        if 'weights' in mesh:mesh['weights']=list(mesh['weights'])+[0.]
        n['weights']=weights+[1.]
        metrics[k]={'moved_vertices':int(move.sum()),'local_delta_max_mm':float(np.linalg.norm(local,axis=1).max()*1000),'max_inverse_condition':float(np.linalg.cond(mat).max())}
    doc2['buffers'][0]['byteLength']=len(payload);payload.extend(b'\0'*((-len(payload))%4))
    doc2['asset']['generator']='HOREB W34zx isolated static DQS diagnostic'
    jb=json.dumps(doc2,separators=(',',':'),ensure_ascii=True).encode();jb+=b' '*((-len(jb))%4)
    packed=struct.pack('<5I',0x46546c67,2,28+len(jb)+len(payload),len(jb),0x4e4f534a)+jb+struct.pack('<2I',len(payload),0x004e4942)+payload
    filename.write_bytes(packed);sha=hashlib.sha256(packed).hexdigest()
    d2,a2=load(filename,sha);g2,_=geometry(d2,a2,True)
    error={k:float(np.max(abs(v['v']-target[k]['v']))) for k,v in g2.items()}
    assert max(error.values())<1e-6
    return {'sha256':sha,'reimport_error_m':error,'morphs':metrics},g2
