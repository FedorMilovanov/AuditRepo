"""W35d: diagnostic stationary-basket approach, seven exact keys."""
import argparse,copy,hashlib,json,struct,subprocess,sys,tempfile
from pathlib import Path
import numpy as np
from probe_w34l_foot_surface import load

def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);args=p.parse_args()
    root=args.evidence;out=args.output;assert not out.exists()
    f=root/'W34v-finger-refine-20261127';r=json.loads((f/'w34u-articulation.json').read_text())
    src=f/'w34u-static-actor.glb';original,oa=load(src,r['glb_sha256'])
    raw=src.read_bytes();jl=struct.unpack_from('<I',raw,12)[0];blen,btype=struct.unpack_from('<2I',raw,20+jl)
    assert btype==0x004e4942 and len(original['buffers'])==1 and not original.get('animations')
    payload=bytearray(raw[28+jl:28+jl+blen])[:original['buffers'][0]['byteLength']]
    docs=[];samples=[];deltas={};keys=list(range(60,-1,-10))
    names=('ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0','W28e_tailored_linen')
    with tempfile.TemporaryDirectory(prefix='w35d-keys-',dir=root) as tmp:
        for distance in keys:
            f=root/f'W35c-static-160-{distance}-20261127' if distance in (0,60) else Path(tmp)/str(distance)
            if distance not in (0,60):
                proc=subprocess.run([sys.executable,str(Path(__file__).with_name('probe_w34zg_arm_reconnect.py')),str(root),str(f),'--distance',str(distance),'--stance-mm','160','--stance-dq-only','--digit-area-factor','1.75','--export-diagnostic'],capture_output=True,text=True,timeout=30)
                assert proc.returncode==0,proc.stderr[-1500:]
            report=json.loads((f/'w34zx-export.json').read_text());sha=report['export']['sha256']
            d,a=load(f/'w34zx-static-actor.glb',sha);assert report['digit_area']['factor']==1.75
            assert not any(report['reimport_audit'][k] for k in ('skin_self','tunic_self','skin_tunic','scene','other_actor'))
            assert report['bind_strain'][names[0]]['severe']==0
            assert all(d[k]==original[k] for k in ('skins','scenes','materials'))
            for name in names:
                n=next(n for n in d['nodes'] if n['name']==name);mesh=d['meshes'][n['mesh']];t=mesh['primitives'][0]['targets'][-1]
                assert mesh['extras']['targetNames'][-1]=='W34zx_StaticDQCorrective' and n['weights'][-1]==1
                deltas.setdefault(name,[]).append({k:a(v).copy() for k,v in t.items()})
            docs.append(d);samples.append({'distance_mm':distance,'static_sha256':sha})
            print('KEY',distance,flush=True)
    doc=copy.deepcopy(original);doc['nodes']=copy.deepcopy(docs[0]['nodes'])
    def append(v,typ,target=None):
        data=np.asarray(v,dtype='<f4').reshape(-1,{'SCALAR':1,'VEC3':3,'VEC4':4}[typ]);assert np.isfinite(data).all()
        payload.extend(b'\0'*((-len(payload))%4));off=len(payload);payload.extend(data.tobytes())
        vi=len(doc['bufferViews']);view={'buffer':0,'byteOffset':off,'byteLength':data.nbytes}
        if target is not None:view['target']=target
        doc['bufferViews'].append(view)
        i=len(doc['accessors']);doc['accessors'].append({'bufferView':vi,'componentType':5126,'count':len(data),'type':typ,'min':data.min(0).tolist(),'max':data.max(0).tolist()});return i
    duration=1.5;times=np.linspace(0,duration,len(keys));time_id=append(times,'SCALAR')
    animation={'name':'W35d_ApproachStationaryBasket_DIAGNOSTIC','samplers':[],'channels':[]}
    def channel(node,path,values,typ):
        output=append(values,typ);i=len(animation['samplers']);animation['samplers'].append({'input':time_id,'output':output,'interpolation':'LINEAR'})
        animation['channels'].append({'sampler':i,'target':{'node':node,'path':path}})
    for i,n in enumerate(doc['nodes']):
        seq=[d['nodes'][i] for d in docs]
        assert all(z.get('name')==n.get('name') for z in seq)
        for field in ('translation','rotation','scale'):
            default=[0,0,0,1] if field=='rotation' else [1,1,1] if field=='scale' else [0,0,0]
            vals=np.array([z.get(field,default) for z in seq],float)
            if field=='rotation':
                vals/=np.linalg.norm(vals,axis=1)[:,None]
                for j in range(1,len(vals)):
                    if vals[j]@vals[j-1]<0:vals[j]*=-1
            if np.max(abs(vals-vals[0]))>1e-7:
                assert 'matrix' not in n
                n[field]=vals[0].tolist();channel(i,field,vals,'VEC4' if field=='rotation' else 'VEC3')
        if n.get('name') in names:
            mesh=doc['meshes'][n['mesh']];pr=mesh['primitives'][0];base_weights=seq[0]['weights'][:-1]
            assert all(z['weights'][:-1]==base_weights for z in seq)
            for k,delta in enumerate(deltas[n['name']]):
                pr.setdefault('targets',[]).append({name:append(value,'VEC3',34962) for name,value in delta.items()})
                mesh.setdefault('extras',{}).setdefault('targetNames',[]).append(f'W35d_DQ_{keys[k]:02d}mm')
            if 'weights' in mesh:mesh['weights']=list(mesh['weights'])+[0.]*len(keys)
            values=np.column_stack((np.tile(base_weights,(len(keys),1)),np.eye(len(keys))))
            n['weights']=values[0].tolist();channel(i,'weights',values,'SCALAR')
    assert len(animation['channels'])>2
    doc['animations']=[animation];doc['asset']['generator']='HOREB W35d diagnostic approach'
    doc['buffers'][0]['byteLength']=len(payload);payload.extend(b'\0'*((-len(payload))%4))
    jb=json.dumps(doc,separators=(',',':'),ensure_ascii=True).encode();jb+=b' '*((-len(jb))%4)
    packed=struct.pack('<5I',0x46546c67,2,28+len(jb)+len(payload),len(jb),0x4e4f534a)+jb+struct.pack('<2I',len(payload),0x004e4942)+payload
    out.mkdir();path=out/'w35d-approach.glb';path.write_bytes(packed);sha=hashlib.sha256(packed).hexdigest();load(path,sha)
    report={'status':'ART_HOLD_UNVERIFIED_INTERPOLATION','source_sha256':r['glb_sha256'],'sha256':sha,'bytes':len(packed),'duration_s':duration,'keys':samples,'channels':len(animation['channels']),'limitations':['Diagnostic clip only; no basket lift, grip, artistic or runtime acceptance. Intermediate interpolation requires independent verification.']}
    (out/'w35d-assembly.json').write_text(json.dumps(report,indent=2));print(json.dumps(report),flush=True)
if __name__=='__main__':main()
