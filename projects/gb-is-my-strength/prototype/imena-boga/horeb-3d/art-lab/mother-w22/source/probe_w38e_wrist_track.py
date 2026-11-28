"""W38e: refine only the right wrist track, preserve original keys.

Sub-millimeter local translation is an explicit diagnostic relaxation of
rigid bone length; not a new bind pose or physical constraint solver.
"""
import argparse,copy,hashlib,json,struct
from probe_w38l_archive import read_glb
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R
from probe_w34l_foot_surface import load,world
from probe_w34t_whole_scene import geometry
from probe_w35e_playback import pose,BODY

def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);args=p.parse_args()
 root=args.evidence;out=args.output;assert not out.exists()
 f=root/'W38a-handoff-20261128';r=json.loads((f/'w38a-assembly.json').read_text());src=f/'w38a-handoff.glb';d,a=load(src,r['sha256'])
 of=root/'W36m-closure-20261128';q=json.loads((of/'w36m-assembly.json').read_text());od,oa=load(of/'w36m-approach-closure.glb',q['sha256']);od=pose(od,oa,q['duration_s']);ow=world(od,od['nodes'])
 i=next(i for i,n in enumerate(d['nodes']) if n['name']=='hand_r');oi=next(i for i,n in enumerate(od['nodes']) if n['name']=='hand_r')
 parent=next(j for j,n in enumerate(d['nodes']) if i in n.get('children',[]))
 anim=d['animations'][0];ch=next(c for c in anim['channels'] if c['target']=={'node':i,'path':'rotation'})
 oldtimes=a(anim['samplers'][ch['sampler']]['input']).ravel().astype(float)
 assert len(oldtimes)==33 and oldtimes[16]==2.
 # Use eight subdivisions in every tilt interval; retain the exact old
 # float32 key times and all lateral samples.
 times=np.array([t for j in range(16) for t in np.linspace(oldtimes[j],oldtimes[j+1],9)[:-1]]+list(oldtimes[16:]),dtype=np.float32)
 assert np.all(np.diff(times)>0)
 tr=[];qr=[];deltas=[];angles=[]
 for t in times:
  dd=pose(d,a,float(t));w=world(dd,dd['nodes']);n=dd['nodes'][i];old=np.array(n['translation']);rot=R.from_quat(n['rotation'])
  if t in oldtimes:
   new=old;newq=rot.as_quat()
  else:
   local=np.linalg.inv(w[parent])@w[r['basket_track_node']]@ow[oi];new=local[:3,3];newq=R.from_matrix(local[:3,:3]).as_quat()
  tr.append(new);qr.append(newq);deltas.append(float(np.linalg.norm(new-old)*1000));angles.append(float(np.degrees((rot.inv()*R.from_quat(newq)).magnitude())))
 assert max(deltas)<.25 and max(angles)<.05
 qr=np.array(qr)
 for j in range(1,len(qr)):
  if qr[j]@qr[j-1]<0:qr[j]*=-1
 doc=copy.deepcopy(d);raw=read_glb(src);jl=struct.unpack_from('<I',raw,12)[0];blen,btype=struct.unpack_from('<2I',raw,20+jl);assert btype==0x004e4942
 payload=bytearray(raw[28+jl:28+jl+blen])[:doc['buffers'][0]['byteLength']]
 def append(v,typ):
  data=np.asarray(v,dtype='<f4').reshape(-1,{'SCALAR':1,'VEC3':3,'VEC4':4}[typ]);assert np.isfinite(data).all()
  payload.extend(b'\0'*((-len(payload))%4));off=len(payload);payload.extend(data.tobytes())
  vi=len(doc['bufferViews']);doc['bufferViews'].append({'buffer':0,'byteOffset':off,'byteLength':data.nbytes})
  j=len(doc['accessors']);doc['accessors'].append({'bufferView':vi,'componentType':5126,'count':len(data),'type':typ,'min':data.min(0).tolist(),'max':data.max(0).tolist()});return j
 anim=doc['animations'][0];tid=append(times,'SCALAR')
 anim['samplers'][ch['sampler']]={'input':tid,'output':append(qr,'VEC4'),'interpolation':'LINEAR'}
 j=len(anim['samplers']);anim['samplers'].append({'input':tid,'output':append(tr,'VEC3'),'interpolation':'LINEAR'});anim['channels'].append({'sampler':j,'target':{'node':i,'path':'translation'}})
 anim['name']='W38e_TiltAndLateralHandoff_WristRefined_DIAGNOSTIC';doc['asset']['generator']='HOREB W38e bounded wrist refinement'
 doc['buffers'][0]['byteLength']=len(payload);payload.extend(b'\0'*((-len(payload))%4))
 jb=json.dumps(doc,separators=(',',':'),ensure_ascii=True).encode();jb+=b' '*((-len(jb))%4)
 packed=struct.pack('<5I',0x46546c67,2,28+len(jb)+len(payload),len(jb),0x4e4f534a)+jb+struct.pack('<2I',len(payload),0x004e4942)+payload
 out.mkdir();path=out/'w38a-handoff.glb';path.write_bytes(packed);sha=hashlib.sha256(packed).hexdigest();nd,na=load(path,sha)
 assert all(nd[k]==d[k] for k in ('skins','scenes','materials','meshes','nodes'))
 # Exact key and lateral geometry preservation; also sample each lateral midpoint.
 keyerr=[];lateralerr=[]
 for t in list(oldtimes)+[(x+y)/2 for x,y in zip(oldtimes[16:],oldtimes[17:])]:
  g,w=geometry(pose(d,a,t),a,True);gg,ww=geometry(pose(nd,na,t),na,True)
  e=max(float(np.max(abs(g[k]['v']-gg[k]['v']))) for k in g)
  assert e<1e-7
  assert np.array_equal(w[r['basket_track_node']],ww[r['basket_track_node']])
  (keyerr if t in oldtimes else lateralerr).append(e)
 report=dict(r,status='ART_HOLD_WRIST_REFINED_UNVERIFIED_PLAYBACK',sha256=sha,bytes=len(packed),channels=len(anim['channels']),source_clip_sha256=r['sha256'],wrist_track_keys=len(times),max_local_translation_delta_mm=max(deltas),max_local_rotation_delta_deg=max(angles),original_key_max_error_m=max(keyerr),lateral_midpoint_max_error_m=max(lateralerr),wrist_track_times_s=times.tolist())
 report['limitations']=r['limitations']+['Right wrist local translation varies by <=0.25mm as diagnostic correction; exact rigid bone length not maintained. No change to other tracks or bind pose.']
 (out/'w38a-assembly.json').write_text(json.dumps(report,indent=2));print(json.dumps({k:v for k,v in report.items() if k not in ('keys','wrist_track_times_s')}),flush=True)
if __name__=='__main__':main()
