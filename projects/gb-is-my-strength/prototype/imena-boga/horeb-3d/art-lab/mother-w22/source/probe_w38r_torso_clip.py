"""W38r: preserve W38i through 2s, append torso-acting lateral phase.

Diagnostic dense morph targets. Original GLB BIN prefix remains intact;
never retire W38i while its archived predecessors depend on it.
"""
import argparse,copy,hashlib,json,struct,subprocess,sys,tempfile
from pathlib import Path
import numpy as np
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry
from probe_w35e_playback import pose,BODY,TUNIC

def opts(mm):
 u=(80-mm)/80;tp=3*u*u*(3-2*u)
 return ['--distance','0','--open-grip','--multidigit','--underside','20','--asymmetric','--retreat-direction','out','--park-area-ramp','--distributed-spine','--torso-dq','--torso-cloth-ramp','--asymmetric-path','--retreat-pole','-45','--retreat-upper','15','--handoff-retreat',str(mm),'--torso-pitch',str(tp),'--head-pitch',str(-5-u),'--head-yaw',str(5*u),'--handoff-key-export']
def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);args=p.parse_args()
 root=args.evidence;out=args.output;assert not out.exists()
 f=root/'W38i-gaze-20261128';r=json.loads((f/'w38a-assembly.json').read_text());src=f/'w38a-handoff.glb';d,a=load(src,r['sha256'])
 doc=copy.deepcopy(d);raw=src.read_bytes();jl=struct.unpack_from('<I',raw,12)[0];blen,btype=struct.unpack_from('<2I',raw,20+jl);assert btype==0x004e4942
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
 def old_prefix(i,field,default):
  if (i,field) not in channels:return np.array([0.,2.]),np.tile(d['nodes'][i].get(field,default),(2,1))
  s=oldanim['samplers'][channels[i,field]];t=a(s['input']).ravel();v=a(s['output']).reshape(len(t),-1)
  assert np.any(t==2.) and t[0]==0.
  return t[t<=2.],v[t<=2.]
 times=np.asarray([z['seconds'] for z in r['keys'][17:]],dtype=np.float32)
 assert len(times)==16 and times[0]>2 and abs(times[-1]-3.2)<1e-6
 samples=[];docs=[];deltas={BODY:[],TUNIC:[]}
 with tempfile.TemporaryDirectory(prefix='w38r-keys-',dir=root) as tmp:
  for i,mm in enumerate(range(75,-1,-5)):
   ff=Path(tmp)/str(i);proc=subprocess.run([sys.executable,str(Path(__file__).with_name('probe_w34zg_arm_reconnect.py')),str(root),str(ff)]+opts(mm),capture_output=True,text=True,timeout=30)
   assert proc.returncode==0,(i,proc.stderr[-1500:])
   report=json.loads((ff/'handoff-key.json').read_text());sha=report['export']['sha256'];dd,aa=load(ff/'handoff-key.glb',sha)
   assert report['actor_source_sha256']==r['source_sha256']
   assert report['bind_strain'][BODY]['severe']==report['bind_strain'][TUNIC]['new']==0
   assert not any(report['reimport_audit'][k] for k in ('skin_self','tunic_self','skin_tunic','scene','other_actor'))
   for name in deltas:
    n=next(n for n in dd['nodes'] if n['name']==name);mesh=dd['meshes'][n['mesh']];t=mesh['primitives'][0]['targets'][-1]
    assert mesh['extras']['targetNames'][-1]=='W34zx_StaticDQCorrective' and n['weights'][-1]==1
    deltas[name].append({k:aa(v).copy() for k,v in t.items()})
   docs.append(dd);samples.append({'distance_mm':mm,'seconds':float(times[i]),'static_sha256':sha,'reimport_error_m':max(report['export']['reimport_error_m'].values()),'torso_correction':report['row']['torso_cloth_correction']});print('KEY',mm,sha[:8],flush=True)
  actor_count=len(docs[0]['nodes']);assert actor_count==len(d['nodes'])-1
  changed=[];old_poses=[pose(d,a,float(t)) for t in times]
  for i in range(actor_count):
   n=doc['nodes'][i];seq=[z['nodes'][i] for z in docs];assert all(z.get('name')==n.get('name') for z in seq)
   for field,default,typ in [('translation',[0,0,0],'VEC3'),('rotation',[0,0,0,1],'VEC4'),('scale',[1,1,1],'VEC3')]:
    vals=np.array([z.get(field,default) for z in seq],float)
    old=np.array([z['nodes'][i].get(field,default) for z in old_poses])
    if field=='rotation':
     vals/=np.linalg.norm(vals,axis=1)[:,None]
     old/=np.linalg.norm(old,axis=1)[:,None]
     delta=np.minimum(np.linalg.norm(vals-old,axis=1),np.linalg.norm(vals+old,axis=1)).max()
    else:delta=np.max(abs(vals-old))
    if delta<1e-7:continue
    assert 'matrix' not in n
    ts,vs=old_prefix(i,field,default);vs=np.concatenate([vs,vals],axis=0)
    if field=='rotation':
     for j in range(len(ts),len(vs)):
      if vs[j]@vs[j-1]<0:vs[j]*=-1
    update(i,field,np.r_[ts,times],vs,typ);changed.append([n['name'],field])
   if n.get('name') in deltas:
    name=n['name'];mesh=doc['meshes'][n['mesh']];pr=mesh['primitives'][0]
    base=seq[0]['weights'][:-1];assert all(z['weights'][:-1]==base for z in seq)
    old_count=len(pr['targets']);assert old_count==len(base)+33
    for j,delta in enumerate(deltas[name]):
     pr['targets'].append({k:append(v,'VEC3',34962) for k,v in delta.items()})
     mesh['extras']['targetNames'].append(f'W38r_Acting_{j:02d}')
    if 'weights' in mesh:mesh['weights']=list(mesh['weights'])+[0.]*16
    n['weights']=list(n['weights'])+[0.]*16
    ts,vs=old_prefix(i,'weights',[]);assert vs.shape[1]==old_count
    prior=np.pad(vs,((0,0),(0,16)))
    later=np.column_stack((np.tile(base,(16,1)),np.zeros((16,33)),np.eye(16)))
    update(i,'weights',np.r_[ts,times],np.concatenate([prior,later]),'SCALAR');changed.append([name,'weights'])
  anim['name']='W38r_HandoffWithTorso_DIAGNOSTIC';doc['asset']['generator']='HOREB W38r torso performance'
  doc['buffers'][0]['byteLength']=len(payload);payload.extend(b'\0'*((-len(payload))%4))
  jb=json.dumps(doc,separators=(',',':'),ensure_ascii=True).encode();jb+=b' '*((-len(jb))%4)
  packed=struct.pack('<5I',0x46546c67,2,28+len(jb)+len(payload),len(jb),0x4e4f534a)+jb+struct.pack('<2I',len(payload),0x004e4942)+payload
  path=Path(tmp)/'handoff.glb';path.write_bytes(packed);sha=hashlib.sha256(packed).hexdigest();nd,na=load(path,sha)
  prefix=[]
  for t in (0.,.325,.65,1.,1.55,1.9,2.):
   g,w=geometry(pose(d,a,t),a,True);gg,ww=geometry(pose(nd,na,t),na,True)
   err=max(float(np.max(abs(g[k]['v']-gg[k]['v']))) for k in g)
   basket_err=float(np.max(abs(w[r['basket_track_node']]-ww[r['basket_track_node']])));print('PREFIX',t,err,basket_err,flush=True)
   assert err<1e-6 and basket_err==0,(t,err,basket_err);prefix.append({'time':t,'error_m':err,'basket_error':basket_err})
  for j,s in enumerate(samples):
   dd,aa=load(Path(tmp)/str(j)/'handoff-key.glb',s['static_sha256']);ref,_=geometry(dd,aa,True)
   g,w=geometry(pose(nd,na,float(times[j])),na,True)
   e=max(float(np.max(abs(g[k]['v']-ref[k]['v']))) for k in ref)
   assert e<1e-6,(j,e);s['clip_key_error_m']=e
  out.mkdir();path.rename(out/'w38a-handoff.glb')
  report=dict(r,status='ART_HOLD_TORSO_CLIP_UNVERIFIED_PLAYBACK',sha256=sha,bytes=len(packed),channels=len(anim['channels']),torso_source_sha256=r['sha256'],torso_keys=samples,torso_prefix=prefix,torso_changed_tracks=changed)
  report['limitations']=r['limitations']+['Torso performance replaces only lateral phase after 2s. Original seam key retained. New 16 pose-specific morphs per body/tunic. Exact static keys only; intermediate interpolation and visual review pending.']
  (out/'w38a-assembly.json').write_text(json.dumps(report,indent=2));print('SUMMARY',json.dumps({'sha256':sha,'bytes':len(packed),'channels':len(anim['channels']),'tracks':changed,'max_key_error_m':max(z['clip_key_error_m'] for z in samples),'prefix_error_m':max(z['error_m'] for z in prefix)}),flush=True)
if __name__=='__main__':main()
