"""W39e: actual exported approach, tilt and handoff, diagnostic side/close views."""
import argparse,hashlib,json
from pathlib import Path
from PIL import Image,ImageDraw
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry
from probe_w35e_playback import pose
from probe_w35f_depth_review import prepare,render
def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);args=p.parse_args()
 root=args.evidence;f=root/'W39c-approach-20261128';r=json.loads((f/'w38a-assembly.json').read_text());d,a=load(f/'w38a-handoff.glb',r['sha256'])
 h,ha=load(root/'W28-house-20261125/w28-house.glb',r['house_sha256']);hg,_=geometry(h,ha,drop=r['settle_delta_m'])
 W,H=300,230;times=(0.,.6,1.5,2.5,3.5,4.7);sheet=Image.new('RGB',(3*W,4*(H+20)),(25,28,32));draw=ImageDraw.Draw(sheet)
 i=next(i for i,n in enumerate(d['nodes']) if n['name']=='hand_r')
 for k,t in enumerate(times):
  g,w=geometry(pose(d,a,t),a,True);M=w[r['basket_track_node']]
  scene={n:dict(z,v=z['v']@M[:3,:3].T+M[:3,3]) if z['basket'] else z for n,z in hg.items()}
  prepared=prepare(g,scene);x=(k%3)*W;y=(k//3)*2*(H+20)
  for j,(label,target,view,span) in enumerate([('Side',[.35,.86,.75],[1.,.2,.15],1.9),('Right hand',w[i][:3,3],[.75,.65,1.],.34)]):
   yy=y+j*(H+20);draw.text((x+8,yy+3),f'{t:.2f}s | {label}',fill=(230,230,230));sheet.paste(render(prepared,target,view,span,W,H),(x,yy+20))
 path=f/'w39e-review.jpg';assert not path.exists();sheet.save(path,quality=85)
 report={'sha256':r['sha256'],'jpeg_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'times':times,'limitations':'Untextured CPU depth-buffer static review; no continuous visual or runtime acceptance.'}
 (f/'w39e-review.json').write_text(json.dumps(report,indent=2));print(json.dumps(report),flush=True)
if __name__=='__main__':main()
