"""W38i: append an authored gaze performance to the verified W38e handoff."""
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
 f=root/'W38e-wrist-20261128';r=json.loads((f/'w38a-assembly.json').read_text());src=f/'w38a-handoff.glb';d,a=load(src,r['sha256'])
 i=next(i for i,n in enumerate(d['nodes']) if n['name']=='head');parent=next(j for j,n in enumerate(d['nodes']) if i in n.get('children',[]))
 anim=d['animations'][0];assert not any(c['target']['node']==i for c in anim['channels'])
 # Follow the upper rim first, then redirect attention to the lower support.
 # Smooth eased angle samples give visible gaze without touching hand tracks.
 keys=np.array([[0,0,0],[.65,-4,-5],[1.55,-4,-5],[2.,-5,0],[2.65,-6,5],[3.2,-4,4]],float)
 times=np.array(sorted(set(np.linspace(0,3.2,33).tolist()+keys[:,0].tolist())),dtype=np.float32)
 times=np.unique(times);qr=[];maxangle=0
 for t in times:
  j=min(len(keys)-2,max(0,int(np.searchsorted(keys[:,0],float(t),side='right')-1)))
  u=np.clip((float(t)-keys[j,0])/(keys[j+1,0]-keys[j,0]),0,1);u=u*u*(3-2*u)
  pitch,yaw=(1-u)*keys[j,1:]+u*keys[j+1,1:]
  dd=pose(d,a,float(t));w=world(dd,dd['nodes']);P=w[parent][:3,:3]
  Q=R.from_euler('yx',[yaw,pitch],degrees=True).as_matrix()
  old=R.from_quat(dd['nodes'][i]['rotation']).as_matrix()
  qr.append(R.from_matrix(P.T@Q@P@old).as_quat());maxangle=max(maxangle,float(R.from_matrix(Q).magnitude()))
 qr=np.array(qr)
 for j in range(1,len(qr)):
  if qr[j]@qr[j-1]<0:qr[j]*=-1
 doc=copy.deepcopy(d);raw=read_glb(src);jl=struct.unpack_from('<I',raw,12)[0];blen,btype=struct.unpack_from('<2I',raw,20+jl);assert btype==0x004e4942
 payload=bytearray(raw[28+jl:28+jl+blen])[:doc['buffers'][0]['byteLength']]
 def append(v,typ):
  data=np.asarray(v,dtype='<f4').reshape(-1,1 if typ=='SCALAR' else 4);off=len(payload);assert off%4==0
  payload.extend(data.tobytes());vi=len(doc['bufferViews']);doc['bufferViews'].append({'buffer':0,'byteOffset':off,'byteLength':data.nbytes})
  j=len(doc['accessors']);doc['accessors'].append({'bufferView':vi,'componentType':5126,'count':len(data),'type':typ,'min':data.min(0).tolist(),'max':data.max(0).tolist()});return j
 anim=doc['animations'][0];j=len(anim['samplers']);anim['samplers'].append({'input':append(times,'SCALAR'),'output':append(qr,'VEC4'),'interpolation':'LINEAR'});anim['channels'].append({'sampler':j,'target':{'node':i,'path':'rotation'}})
 anim['name']='W38i_HandoffWithGaze_DIAGNOSTIC';doc['asset']['generator']='HOREB W38i gaze performance'
 doc['buffers'][0]['byteLength']=len(payload);payload.extend(b'\0'*((-len(payload))%4))
 jb=json.dumps(doc,separators=(',',':'),ensure_ascii=True).encode();jb+=b' '*((-len(jb))%4)
 packed=struct.pack('<5I',0x46546c67,2,28+len(jb)+len(payload),len(jb),0x4e4f534a)+jb+struct.pack('<2I',len(payload),0x004e4942)+payload
 out.mkdir();path=out/'w38a-handoff.glb';path.write_bytes(packed);sha=hashlib.sha256(packed).hexdigest();nd,na=load(path,sha)
 assert all(nd[k]==d[k] for k in ('skins','scenes','materials','meshes','nodes'))
 # Independent reimport: every non-head joint and basket matrix unchanged,
 # and every fully hand-weighted vertex unchanged.
 node=next(n for n in d['nodes'] if n['name']==BODY);at=d['meshes'][node['mesh']]['primitives'][0]['attributes']
 js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=[d['nodes'][i]['name'] for i in d['skins'][node['skin']]['joints']]
 valid=np.array([k.startswith(('hand_','thumb_','index_','middle_','ring_','pinky_')) for k in jn]);ids=np.flatnonzero(np.sum(ws*valid[js],axis=1)>.999)
 err=[]
 for t in (0.,.325,.65,1.1,1.55,2.,2.325,2.65,2.925,3.2):
  g,w=geometry(pose(d,a,t),a,True);gg,ww=geometry(pose(nd,na,t),na,True)
  e=max(float(np.max(abs(w[k]-ww[k]))) for k in w if k!=i)
  he=float(np.max(abs(g[BODY]['v'][ids]-gg[BODY]['v'][ids])))
  assert max(e,he)<1e-10
  err.append({'time':t,'non_head_matrix_error':e,'hand_vertex_error_m':he})
 report=dict(r,status='ART_HOLD_GAZE_UNVERIFIED_PLAYBACK',sha256=sha,bytes=len(packed),channels=len(anim['channels']),gaze_source_sha256=r['sha256'],gaze_keys=keys.tolist(),gaze_track_count=len(times),gaze_max_angle_deg=float(np.degrees(maxangle)),gaze_preservation=err)
 report['limitations']=r['limitations']+['Authored head-only performance; torso, feet and basket tracks unchanged. Gaze is not eye tracking.']
 (out/'w38a-assembly.json').write_text(json.dumps(report,indent=2));print(json.dumps({k:v for k,v in report.items() if k not in ('keys','wrist_track_times_s','gaze_preservation')}),flush=True)
if __name__=='__main__':main()
