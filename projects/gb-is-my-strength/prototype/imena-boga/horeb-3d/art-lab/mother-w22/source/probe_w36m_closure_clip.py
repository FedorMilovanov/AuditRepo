"""W36m: append verified articulation and pad correction to W35y, preserve prefix."""
import argparse,copy,hashlib,json,struct
from pathlib import Path
import numpy as np
from probe_w34l_foot_surface import load,world
from probe_w34t_whole_scene import geometry
from probe_w35e_playback import pose,BODY
from probe_w36a_contact_closure import apply_closure
from probe_w36g_pad_compliance import apply_pad

def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);args=p.parse_args()
    root=args.evidence;out=args.output;assert not out.exists()
    f=root/'W35y-bilateral-20261128';r=json.loads((f/'w35y-assembly.json').read_text());src=f/'w35y-approach.glb'
    original,a=load(src,r['sha256']);doc=copy.deepcopy(original)
    raw=src.read_bytes();jl=struct.unpack_from('<I',raw,12)[0];blen,btype=struct.unpack_from('<2I',raw,20+jl)
    assert btype==0x004e4942 and len(doc['buffers'])==1
    payload=bytearray(raw[28+jl:28+jl+blen])[:doc['buffers'][0]['byteLength']]
    def append(v,typ,target=None):
        data=np.asarray(v,dtype='<f4').reshape(-1,{'SCALAR':1,'VEC3':3,'VEC4':4}[typ]);assert np.isfinite(data).all()
        payload.extend(b'\0'*((-len(payload))%4));off=len(payload);payload.extend(data.tobytes())
        vi=len(doc['bufferViews']);view={'buffer':0,'byteOffset':off,'byteLength':data.nbytes}
        if target is not None:view['target']=target
        doc['bufferViews'].append(view)
        i=len(doc['accessors']);doc['accessors'].append({'bufferView':vi,'componentType':5126,'count':len(data),'type':typ,'min':data.min(0).tolist(),'max':data.max(0).tolist()});return i
    end=pose(original,a,2.4);closed,chosen=apply_closure(end,root,1.,r['sha256'])
    g,w=geometry(closed,a,True);target=apply_pad(g,root,1.,r['sha256'])
    names={n['name']:i for i,n in enumerate(doc['nodes'])};anim=doc['animations'][0]
    existing={(ch['target']['node'],ch['target']['path']) for ch in anim['channels']}
    rotations=[]
    times=append([0,2.4,2.9,3.15],'SCALAR')
    for i,(n,old,new) in enumerate(zip(doc['nodes'],end['nodes'],closed['nodes'])):
        if old.get('rotation')==new.get('rotation'):continue
        assert (i,'rotation') not in existing and n.get('rotation')==old.get('rotation')
        assert 'matrix' not in n
        q=np.array(old['rotation']);z=np.array(new['rotation'])
        if q@z<0:z=-z
        si=len(anim['samplers']);anim['samplers'].append({'input':times,'output':append([q,q,z,z],'VEC4'),'interpolation':'LINEAR'})
        anim['channels'].append({'sampler':si,'target':{'node':i,'path':'rotation'}});rotations.append(n['name'])
    assert len(rotations)==4,rotations
    i=names[BODY];n=doc['nodes'][i];mesh=doc['meshes'][n['mesh']];pr=mesh['primitives'][0];at=pr['attributes']
    skin=doc['skins'][n['skin']];ibm=a(skin['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1);jm=np.stack([w[j]@ibm[k] for k,j in enumerate(skin['joints'])])
    v=a(at['POSITION']).astype(float);norm=a(at['NORMAL']).astype(float)
    weights=closed['nodes'][i]['weights']
    for wt,t in zip(weights,pr['targets']):
        if wt:
            v+=wt*a(t['POSITION'])
            if 'NORMAL' in t:norm+=wt*a(t['NORMAL'])
    js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']).astype(float);J=sum(jm[js[:,k]]*ws[:,k,None,None] for k in range(4))
    delta=target[BODY]['v']-g[BODY]['v'];move=np.linalg.norm(delta,axis=1)>1e-10
    local=np.zeros_like(v);mat=J[move,:3,:3];assert np.linalg.cond(mat).max()<2
    local[move]=np.linalg.solve(mat,delta[move,...,None])[...,0]
    tri=g[BODY]['tri'];canon=g[BODY]['canon']
    def gn(pos):
        vv=pos[tri];normal=np.cross(vv[:,1]-vv[:,0],vv[:,2]-vv[:,0]);s=np.zeros((int(canon.max())+1,3))
        for k in range(3):np.add.at(s,canon[tri[:,k]],normal)
        s/=np.maximum(np.linalg.norm(s,axis=1),1e-12)[:,None];return s[canon]
    old=gn(v);new=gn(v+local)
    # Add geometric normal delta to the already morphed authored normal.
    nd=new-old;nd[np.linalg.norm(nd,axis=1)<1e-8]=0
    pr['targets'].append({'POSITION':append(local,'VEC3',34962),'NORMAL':append(nd,'VEC3',34962)})
    mesh['extras']['targetNames'].append('W36m_PadMicrogap');n['weights']=list(n['weights'])+[0.]
    if 'weights' in mesh:mesh['weights']=list(mesh['weights'])+[0.]
    ch=next(c for c in anim['channels'] if c['target']=={'node':i,'path':'weights'})
    sampler=anim['samplers'][ch['sampler']];ot=a(sampler['input']).ravel();ov=a(sampler['output']).reshape(len(ot),-1)
    assert ov.shape[1]==len(weights) and abs(ot[-1]-2.4)<1e-6
    vals=np.column_stack((ov,np.zeros(len(ot))))
    vals=np.vstack((vals,vals[-1],np.r_[ov[-1],1.]))
    sampler['input']=append(np.r_[ot,2.9,3.15],'SCALAR');sampler['output']=append(vals,'SCALAR')
    anim['name']='W36m_BilateralApproachClosure_DIAGNOSTIC';doc['asset']['generator']='HOREB W36m closure extension'
    doc['buffers'][0]['byteLength']=len(payload);payload.extend(b'\0'*((-len(payload))%4))
    jb=json.dumps(doc,separators=(',',':'),ensure_ascii=True).encode();jb+=b' '*((-len(jb))%4)
    packed=struct.pack('<5I',0x46546c67,2,28+len(jb)+len(payload),len(jb),0x4e4f534a)+jb+struct.pack('<2I',len(payload),0x004e4942)+payload
    out.mkdir();path=out/'w36m-approach-closure.glb';path.write_bytes(packed);sha=hashlib.sha256(packed).hexdigest()
    d2,a2=load(path,sha)
    for k in ('skins','scenes','materials'):assert original[k]==d2[k]
    errors=[]
    # Whole geometry prefix, including exact endpoint. Original audited sample times.
    for frame in range(59):
        t=min(frame/24,2.4);g0,_=geometry(pose(original,a,t),a,True);g1,_=geometry(pose(d2,a2,t),a2,True)
        err=max(float(np.max(abs(g0[k]['v']-g1[k]['v']))) for k in g0);errors.append(err)
    assert max(errors)<1e-7
    end_errors={}
    for t,ref in [(2.9,g),(3.15,target)]:
        gg,_=geometry(pose(d2,a2,t),a2,True);e=max(float(np.max(abs(gg[k]['v']-ref[k]['v']))) for k in ref);assert e<1e-7
        end_errors[str(t)]=e
    report={'status':'ART_HOLD_EXTENSION_REIMPORT','sha256':sha,'source_sha256':r['source_sha256'],'approach_sha256':r['sha256'],'bytes':len(packed),'duration_s':3.15,'channels':len(anim['channels']),'keys':r['keys'],'phases_s':[0,2.4,2.9,3.15],'rotations':rotations,'pad_moved_vertices':int(move.sum()),'pad_canonical_vertices':len(set(canon[move])),'prefix_samples':len(errors),'prefix_max_error_m':max(errors),'end_errors_m':end_errors,'limitations':['Diagnostic geometry only; no physical grip or artistic acceptance. Full extension collision/strain audit separate.']}
    (out/'w36m-assembly.json').write_text(json.dumps(report,indent=2));print(json.dumps(report),flush=True)
if __name__=='__main__':main()
