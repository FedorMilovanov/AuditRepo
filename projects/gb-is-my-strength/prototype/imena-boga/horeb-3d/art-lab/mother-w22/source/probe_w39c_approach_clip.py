"""W39c: prepend the verified right-hand approach to W38v.

The W38v body, basket and seam animation is preserved after the new prefix.
Dense approach correctives are diagnostic, not a production GPU budget.
"""
import argparse,copy,hashlib,json,struct,subprocess,sys,tempfile
from pathlib import Path
import numpy as np
from probe_w38l_archive import read_glb
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry
from probe_w35e_playback import pose,BODY,TUNIC
from probe_w39b_approach_path import states,options

def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);args=p.parse_args()
 root=args.evidence;out=args.output;assert not out.exists()
 f=root/'W38v-seam-20261128';r=json.loads((f/'w38a-assembly.json').read_text());src=f/'w38a-handoff.glb';d,a=load(src,r['sha256'])
 witness=json.loads((root/'W39b-approach-path-20261128.json').read_text())
 assert witness['source_sha256']==r['sha256'] and witness['boundary_gate'] and all(z['gate'] for z in witness['samples'])
 assert [z['offset_mm'] for z in witness['samples']]==states()
 doc=copy.deepcopy(d);raw=read_glb(src);jl=struct.unpack_from('<I',raw,12)[0];blen,btype=struct.unpack_from('<2I',raw,20+jl);assert btype==0x004e4942
 payload=bytearray(raw[28+jl:28+jl+blen])[:doc['buffers'][0]['byteLength']]
 def append(v,typ,target=None):
  data=np.asarray(v,dtype='<f4').reshape(-1,{'SCALAR':1,'VEC3':3,'VEC4':4}[typ]);assert np.isfinite(data).all()
  payload.extend(b'\0'*((-len(payload))%4));off=len(payload);payload.extend(data.tobytes())
  vi=len(doc['bufferViews']);view={'buffer':0,'byteOffset':off,'byteLength':data.nbytes}
  if target is not None:view['target']=target
  doc['bufferViews'].append(view)
  i=len(doc['accessors']);doc['accessors'].append({'bufferView':vi,'componentType':5126,'count':len(data),'type':typ,'min':data.min(0).tolist(),'max':data.max(0).tolist()});return i
 anim=doc['animations'][0];oldanim=d['animations'][0];channels={(c['target']['node'],c['target']['path']):c['sampler'] for c in oldanim['channels']}
 def update(i,field,ts,vs,typ):
  ts=np.asarray(ts,dtype=np.float32);assert np.all(np.diff(ts)>0)
  new={'input':append(ts,'SCALAR'),'output':append(vs,typ),'interpolation':'LINEAR'}
  if (i,field) in channels:anim['samplers'][channels[i,field]]=new
  else:
   k=len(anim['samplers']);anim['samplers'].append(new);anim['channels'].append({'sampler':k,'target':{'node':i,'path':field}})
 def track(i,field,default):
  if (i,field) not in channels:return np.array([0.,r['duration_s']]),np.tile(d['nodes'][i].get(field,default),(2,1))
  s=oldanim['samplers'][channels[i,field]];t=a(s['input']).ravel();v=a(s['output']).reshape(len(t),-1)
  assert t[0]==0.
  return t,v
 shift=1.5
 # Ease the descent and lateral approach separately; shared corner is at .6s.
 def inv(s):
  if s in (0,1):return s
  lo,hi=0.,1.
  for _ in range(40):
   u=(lo+hi)/2
   if u*u*(3-2*u)<s:lo=u
   else:hi=u
  return (lo+hi)/2
 times=np.array([.6*inv(i/4) for i in range(4)]+[.6+.9*inv(i/6) for i in range(6)],dtype=np.float32)
 assert len(times)==10 and times[0]==0 and times[-1]<shift
 samples=[];docs=[];deltas={BODY:[],TUNIC:[]}
 with tempfile.TemporaryDirectory(prefix='w39c-keys-',dir=root) as tmp:
  for i,offset in enumerate(states()[:-1]):
   ff=Path(tmp)/str(i);proc=subprocess.run([sys.executable,str(Path(__file__).with_name('probe_w34zg_arm_reconnect.py')),str(root),str(ff)]+options(offset)+['--handoff-key-export'],capture_output=True,text=True,timeout=30)
   assert proc.returncode==0,(i,proc.stderr[-1500:])
   report=json.loads((ff/'handoff-key.json').read_text());sha=report['export']['sha256'];dd,aa=load(ff/'handoff-key.glb',sha)
   assert report['actor_source_sha256']==r['source_sha256']
   assert report['bind_strain'][BODY]['severe']==report['bind_strain'][TUNIC]['new']==0
   assert not any(report['reimport_audit'][k] for k in ('skin_self','tunic_self','skin_tunic','scene','other_actor'))
   for name in deltas:
    n=next(n for n in dd['nodes'] if n['name']==name);mesh=dd['meshes'][n['mesh']];t=mesh['primitives'][0]['targets'][-1]
    assert mesh['extras']['targetNames'][-1]=='W34zx_StaticDQCorrective' and n['weights'][-1]==1
    deltas[name].append({k:aa(v).copy() for k,v in t.items()})
   docs.append(dd);samples.append({'offset_mm':offset,'seconds':float(times[i]),'stance_mm':80.,'static_sha256':sha,'reimport_error_m':max(report['export']['reimport_error_m'].values())});print('KEY',offset,sha[:8],flush=True)
  actor_count=len(docs[0]['nodes']);assert actor_count==len(d['nodes'])-1
  for i,n in enumerate(doc['nodes']):
   seq=[z['nodes'][i] for z in docs] if i<actor_count else None
   for field,default,typ in [('translation',[0,0,0],'VEC3'),('rotation',[0,0,0,1],'VEC4'),('scale',[1,1,1],'VEC3')]:
    ts,vs=track(i,field,default)
    pre=np.array([z.get(field,default) for z in seq],float) if seq else np.tile(vs[0],(10,1))
    if field=='rotation':
     pre/=np.linalg.norm(pre,axis=1)[:,None]
     diff=np.minimum(np.linalg.norm(pre-vs[0],axis=1),np.linalg.norm(pre+vs[0],axis=1)).max()
    else:diff=np.max(abs(pre-vs[0]))
    if (i,field) not in channels and diff<1e-7:continue
    assert 'matrix' not in n
    vals=np.concatenate([pre,vs],axis=0)
    if field=='rotation':
     for j in range(1,len(vals)):
      if vals[j]@vals[j-1]<0:vals[j]*=-1
    update(i,field,np.r_[times,ts+shift],vals,typ)
    n[field]=vals[0].tolist()
   if n.get('name') in deltas:
    name=n['name'];mesh=doc['meshes'][n['mesh']];pr=mesh['primitives'][0]
    base=seq[0]['weights'][:-1];assert all(z['weights'][:-1]==base for z in seq)
    old_count=len(pr['targets'])
    for j,delta in enumerate(deltas[name]):
     pr['targets'].append({k:append(v,'VEC3',34962) for k,v in delta.items()})
     mesh['extras']['targetNames'].append(f'W39c_Approach_{j:02d}')
    if 'weights' in mesh:mesh['weights']=list(mesh['weights'])+[0.]*10
    ts,vs=track(i,'weights',[]);assert vs.shape[1]==old_count
    pre=np.column_stack((np.tile(base,(10,1)),np.zeros((10,old_count-len(base))),np.eye(10)))
    later=np.pad(vs,((0,0),(0,10)))
    vals=np.concatenate([pre,later]);n['weights']=vals[0].tolist()
    update(i,'weights',np.r_[times,ts+shift],vals,'SCALAR')
  anim['name']='W39c_ApproachTiltHandoff_DIAGNOSTIC';doc['asset']['generator']='HOREB W39c approach performance'
  doc['buffers'][0]['byteLength']=len(payload);payload.extend(b'\0'*((-len(payload))%4))
  jb=json.dumps(doc,separators=(',',':'),ensure_ascii=True).encode();jb+=b' '*((-len(jb))%4)
  packed=struct.pack('<5I',0x46546c67,2,28+len(jb)+len(payload),len(jb),0x4e4f534a)+jb+struct.pack('<2I',len(payload),0x004e4942)+payload
  path=Path(tmp)/'handoff.glb';path.write_bytes(packed);sha=hashlib.sha256(packed).hexdigest();nd,na=load(path,sha)
  suffix=[]
  for t in (0.,.325,.65,1.,1.55,1.9,2.,2.045682,2.1,2.6,3.2):
   g,w=geometry(pose(d,a,t),a,True);gg,ww=geometry(pose(nd,na,t+shift),na,True)
   err=max(float(np.max(abs(g[k]['v']-gg[k]['v']))) for k in g)
   berr=float(np.max(abs(w[r['basket_track_node']]-ww[r['basket_track_node']])))
   assert err<1e-6 and berr<1e-6,(t,err,berr);suffix.append({'time':t+shift,'error_m':err,'basket_error':berr})
  for j,s in enumerate(samples):
   dd,aa=load(Path(tmp)/str(j)/'handoff-key.glb',s['static_sha256']);ref,_=geometry(dd,aa,True)
   g,w=geometry(pose(nd,na,float(times[j])),na,True)
   e=max(float(np.max(abs(g[k]['v']-ref[k]['v']))) for k in ref)
   assert e<1e-6,(j,e);s['clip_key_error_m']=e
  out.mkdir();path.rename(out/'w38a-handoff.glb')
  report=dict(r,status='ART_HOLD_APPROACH_CLIP_UNVERIFIED_PLAYBACK',sha256=sha,bytes=len(packed),channels=len(anim['channels']),duration_s=r['duration_s']+shift,approach_source_sha256=r['sha256'],approach_duration_s=shift,approach_keys=samples,approach_suffix=suffix,keys=[dict(z,phase='approach') for z in samples]+[dict(z,seconds=z['seconds']+shift) for z in r['keys']])
  report['limitations']=r['limitations']+['Preceding 1.5s right-hand approach with stationary basket, parked left hand and fixed feet. Prior phase timing shifted; source-relative metadata kept for reconstruction. Intermediate playback and artistic review pending.']
  (out/'w38a-assembly.json').write_text(json.dumps(report,indent=2));print('SUMMARY',json.dumps({'sha256':sha,'bytes':len(packed),'channels':len(anim['channels']),'duration_s':report['duration_s'],'max_key_error_m':max(z['clip_key_error_m'] for z in samples),'suffix_error_m':max(z['error_m'] for z in suffix)}),flush=True)
if __name__=='__main__':main()
