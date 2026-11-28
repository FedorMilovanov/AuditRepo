"""W38v: bake bounded seam correction as sparse linen morphs.

No change to the skeleton, hands, basket or source binary. This remains a
diagnostic GLB; browser sparse morph loading and runtime cost are unverified.
"""
import argparse,copy,hashlib,json,struct
from pathlib import Path
import numpy as np
from probe_w38l_archive import read_glb
from probe_w34l_foot_surface import load,world
from probe_w34t_whole_scene import geometry
from probe_w35e_playback import pose,TUNIC
from probe_w38u_seam_correct import setup

def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);args=p.parse_args()
 root=args.evidence;out=args.output;assert not out.exists()
 d,a,r,rest,ids=setup(root);folder=root/'W38r-torso-20261128';src=folder/'w38a-handoff.glb'
 q=json.loads((folder/'w38u-constrained-seam.json').read_text());assert q['sha256']==r['sha256'] and q['vertices']==ids.tolist() and len(q['rows'])==17 and all(z['gate'] for z in q['rows'])
 doc=copy.deepcopy(d);raw=read_glb(src);jl=struct.unpack_from('<I',raw,12)[0];blen,btype=struct.unpack_from('<2I',raw,20+jl);assert btype==0x004e4942
 payload=bytearray(raw[28+jl:28+jl+blen])[:doc['buffers'][0]['byteLength']]
 def view(v):
  payload.extend(b'\0'*((-len(payload))%4));off=len(payload);payload.extend(v.tobytes());vi=len(doc['bufferViews']);doc['bufferViews'].append({'buffer':0,'byteOffset':off,'byteLength':v.nbytes});return vi
 def sparse(v):
  x=np.asarray(v,dtype='<f4');assert x.ndim==2 and x.shape[1]==3 and np.isfinite(x).all()
  ii=np.flatnonzero(np.any(x!=0,axis=1));assert len(ii)>0 and len(x)<=65536
  i=len(doc['accessors']);doc['accessors'].append({'componentType':5126,'count':len(x),'type':'VEC3','min':x.min(0).tolist(),'max':x.max(0).tolist(),'sparse':{'count':len(ii),'indices':{'bufferView':view(ii.astype('<u2')),'componentType':5123},'values':{'bufferView':view(x[ii])}}})
  return i,len(ii)
 def scalar(v):
  x=np.asarray(v,dtype='<f4').reshape(-1,1);assert np.isfinite(x).all();i=len(doc['accessors']);doc['accessors'].append({'bufferView':view(x),'componentType':5126,'count':len(x),'type':'SCALAR','min':x.min(0).tolist(),'max':x.max(0).tolist()});return i
 i=next(i for i,n in enumerate(d['nodes']) if n['name']==TUNIC);node=d['nodes'][i];mesh=d['meshes'][node['mesh']];pr=mesh['primitives'][0];at=pr['attributes']
 newnode=doc['nodes'][i];newmesh=doc['meshes'][node['mesh']];newpr=newmesh['primitives'][0]
 skin=d['skins'][node['skin']];ibm=a(skin['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1);js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']).astype(float)
 oldanim=d['animations'][0];anim=doc['animations'][0];ch=next(c for c in anim['channels'] if c['target']=={'node':i,'path':'weights'});s=oldanim['samplers'][ch['sampler']]
 oldtimes=a(s['input']).ravel();old_count=len(pr['targets']);oldvalues=a(s['output']).reshape(len(oldtimes),old_count)
 # All original times retained; no morph active outside the first interval.
 newtimes=np.unique(np.r_[oldtimes,np.array([z['time'] for z in q['rows']],dtype=np.float32)])
 correction=[];index={}
 for k,z in enumerate(q['rows']):
  t=z['time'];delta=np.array(z['correction']['delta_world_m'])
  if np.max(abs(delta))<1e-12:continue
  t=float(np.float32(t));dd=pose(d,a,t);g,w=geometry(dd,a,True);body=g[TUNIC];tri=body['tri'];canon=body['canon']
  jm=np.stack([w[j]@ibm[k] for k,j in enumerate(skin['joints'])]);J=sum(jm[js[ids,k]]*ws[ids,k,None,None] for k in range(4))
  mat=J[:,:3,:3];assert np.linalg.cond(mat).max()<100
  local=np.zeros_like(rest);local[ids]=np.linalg.solve(mat,delta[...,None])[...,0]
  v=a(at['POSITION']).astype(float);norm=a(at['NORMAL']).astype(float)
  for weight,tgt in zip(dd['nodes'][i]['weights'],pr['targets']):
   if weight:
    v+=weight*a(tgt['POSITION'])
    if 'NORMAL' in tgt:norm+=weight*a(tgt['NORMAL'])
  def gn(pos):
   v0=pos[tri];nn=np.cross(v0[:,1]-v0[:,0],v0[:,2]-v0[:,0]);ss=np.zeros((int(canon.max())+1,3))
   for j in range(3):np.add.at(ss,canon[tri[:,j]],nn)
   ss/=np.maximum(np.linalg.norm(ss,axis=1),1e-12)[:,None];return ss[canon]
  old=gn(v);new=gn(v+local);nd=norm+new-old;nd/=np.maximum(np.linalg.norm(nd,axis=1),1e-12)[:,None];nd-=norm;nd[np.linalg.norm(new-old,axis=1)<1e-8]=0
  pa,pc=sparse(local);na,nc=sparse(nd)
  newpr['targets'].append({'POSITION':pa,'NORMAL':na});newmesh['extras']['targetNames'].append(f'W38v_Seam_{k:02d}')
  index[t]=len(correction);correction.append({'time':t,'positions':pc,'normals':nc,'local_max_mm':float(np.linalg.norm(local,axis=1).max()*1000),'delta_world_m':delta.tolist()})
 count=len(correction);assert 0<count<17
 if 'weights' in newmesh:newmesh['weights']=list(newmesh['weights'])+[0.]*count
 newnode['weights']=list(newnode['weights'])+[0.]*count
 values=np.zeros((len(newtimes),old_count+count),float)
 for k,t in enumerate(newtimes):
  values[k,:old_count]=pose(d,a,float(t))['nodes'][i]['weights']
  if float(t) in index:values[k,old_count+index[float(t)]]=1.
 anim['samplers'][ch['sampler']]={'input':scalar(newtimes),'output':scalar(values),'interpolation':'LINEAR'}
 anim['name']='W38v_HandoffTorsoSeam_DIAGNOSTIC';doc['asset']['generator']='HOREB W38v sparse cloth seam correction'
 doc['buffers'][0]['byteLength']=len(payload);payload.extend(b'\0'*((-len(payload))%4))
 jb=json.dumps(doc,separators=(',',':'),ensure_ascii=True).encode();jb+=b' '*((-len(jb))%4)
 packed=struct.pack('<5I',0x46546c67,2,28+len(jb)+len(payload),len(jb),0x4e4f534a)+jb+struct.pack('<2I',len(payload),0x004e4942)+payload
 out.mkdir();path=out/'w38a-handoff.glb';path.write_bytes(packed);sha=hashlib.sha256(packed).hexdigest();nd,na=load(path,sha)
 assert nd['skins']==d['skins'] and nd['scenes']==d['scenes'] and nd['materials']==d['materials']
 rows=[]
 for t in sorted(set([0.,1.,2.,2.3,2.6,3.2]+[float(z) for z in newtimes if 2<=z<=q['rows'][-1]['time']])):
  g,w=geometry(pose(d,a,t),a,True);gg,ww=geometry(pose(nd,na,t),na,True)
  assert all(np.array_equal(w[j],ww[j]) for j in w)
  err=max(float(np.max(abs(g[k]['v']-gg[k]['v']))) for k in g if k!=TUNIC)
  mask=np.ones(len(g[TUNIC]['v']),bool);mask[ids]=False
  other=float(np.max(abs(g[TUNIC]['v'][mask]-gg[TUNIC]['v'][mask])))
  assert err<1e-10 and other<1e-7
  expect=np.array(correction[index[t]]['delta_world_m']) if t in index else np.zeros((4,3))
  delta=gg[TUNIC]['v'][ids]-g[TUNIC]['v'][ids];e=float(np.max(abs(delta-expect)));assert e<1e-7,(t,e)
  rows.append({'time':t,'patch_error_m':e,'other_cloth_error_m':other,'other_mesh_error_m':err})
 report=dict(r,status='ART_HOLD_SPARSE_SEAM_UNVERIFIED_PLAYBACK',sha256=sha,bytes=len(packed),seam_source_sha256=r['sha256'],seam_corrections=correction,seam_reimport=rows,seam_sparse_targets=count)
 report['limitations']=r['limitations']+['Sparse glTF linen corrective targets, independent CPU loader verified, browser runtime not verified. All geometry outside four linen vertices unchanged to numerical precision at sampled keys.']
 (out/'w38a-assembly.json').write_text(json.dumps(report,indent=2));print(json.dumps({'sha256':sha,'bytes':len(packed),'added_bytes':len(packed)-r['bytes'],'sparse_targets':count,'max_patch_error_m':max(z['patch_error_m'] for z in rows),'max_other_cloth_error_m':max(z['other_cloth_error_m'] for z in rows)}),flush=True)
if __name__=='__main__':main()
