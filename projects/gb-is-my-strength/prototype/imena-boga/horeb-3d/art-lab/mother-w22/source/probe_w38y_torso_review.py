"""W38y: actual torso performance comparison, CPU diagnostic review."""
import argparse,hashlib,json
from pathlib import Path
from PIL import Image,ImageDraw
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry
from probe_w35e_playback import pose
from probe_w35f_depth_review import prepare,render

def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);args=p.parse_args()
 root=args.evidence;f=root/'W38v-seam-20261128';r=json.loads((f/'w38a-assembly.json').read_text());d,a=load(f/'w38a-handoff.glb',r['sha256'])
 old=root/'W38i-gaze-20261128';q=json.loads((old/'w38a-assembly.json').read_text());o,oa=load(old/'w38a-handoff.glb',q['sha256'])
 h,ha=load(root/'W28-house-20261125/w28-house.glb',r['house_sha256']);hg,_=geometry(h,ha,drop=r['settle_delta_m'])
 W,H=360,265;times=(2.,2.6,3.2);sheet=Image.new('RGB',(3*W,2*(H+20)),(25,28,32));draw=ImageDraw.Draw(sheet)
 for col,t in enumerate(times):
  for row,(dd,aa,label) in enumerate(((o,oa,'Gaze baseline'),(d,a,'Torso performance'))):
   g,w=geometry(pose(dd,aa,t),aa,True);M=w[r['basket_track_node']]
   scene={k:dict(z,v=z['v']@M[:3,:3].T+M[:3,3]) if z['basket'] else z for k,z in hg.items()}
   y=row*(H+20);draw.text((col*W+8,y+3),f'{label} {t:.2f}s',fill=(230,230,230))
   sheet.paste(render(prepare(g,scene),[.35,.86,.75],[1.,.2,.15],1.9,W,H),(col*W,y+20))
 path=f/'w38y-review.jpg';assert not path.exists();sheet.save(path,quality=85)
 report={'sha256':r['sha256'],'baseline_sha256':q['sha256'],'jpeg_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'times':times,'limitations':'Untextured CPU depth-buffer static side comparison; no continuous visual or runtime acceptance.'}
 (f/'w38y-review.json').write_text(json.dumps(report,indent=2));print(json.dumps(report),flush=True)
if __name__=='__main__':main()
