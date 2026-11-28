"""W38k: compare actual gaze and baseline close-up at authored beats."""
import argparse,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry
from probe_w35e_playback import pose
from probe_w35f_depth_review import prepare,render
def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);args=p.parse_args()
 root=args.evidence;f=root/'W38i-gaze-20261128';r=json.loads((f/'w38a-assembly.json').read_text());d,a=load(f/'w38a-handoff.glb',r['sha256'])
 old=root/'W38e-wrist-20261128';q=json.loads((old/'w38a-assembly.json').read_text());o,oa=load(old/'w38a-handoff.glb',q['sha256'])
 h,ha=load(root/'W28-house-20261125/w28-house.glb',r['house_sha256']);hg,_=geometry(h,ha,drop=r['settle_delta_m'])
 i=next(i for i,n in enumerate(d['nodes']) if n['name']=='head')
 W,H=360,265;times=(.65,2.,2.65);sheet=Image.new('RGB',(3*W,2*(H+20)),(25,28,32));draw=ImageDraw.Draw(sheet)
 for col,t in enumerate(times):
  for row,(dd,aa,label) in enumerate(((o,oa,'Baseline'),(d,a,'Gaze'))):
   g,w=geometry(pose(dd,aa,t),aa,True);M=w[r['basket_track_node']]
   scene={k:dict(z,v=z['v']@M[:3,:3].T+M[:3,3]) if z['basket'] else z for k,z in hg.items()}
   target=w[i][:3,3]+[0,.045,0];prepared=prepare(g,scene);y=row*(H+20)
   draw.text((col*W+8,y+3),f'{label} {t:.2f}s',fill=(230,230,230));sheet.paste(render(prepared,target,[.8,.12,-1],.43,W,H),(col*W,y+20))
 path=f/'w38k-gaze-review.jpg';assert not path.exists();sheet.save(path,quality=86)
 report={'sha256':r['sha256'],'baseline_sha256':q['sha256'],'jpeg_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'times':times,'limitations':'Untextured CPU depth-buffer static close-ups, not eye tracking or beauty/runtime approval.'}
 (f/'w38k-gaze-review.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
if __name__=='__main__':main()
