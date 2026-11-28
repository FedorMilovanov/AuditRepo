"""W38c: visual sheet directly from the exported handoff clip and house."""
import argparse,hashlib,json
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry
from probe_w35e_playback import pose
from probe_w35f_depth_review import prepare,render

def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);args=p.parse_args()
    root=args.evidence;f=root/'W38a-handoff-20261128';r=json.loads((f/'w38a-assembly.json').read_text())
    d,a=load(f/'w38a-handoff.glb',r['sha256'])
    h,ha=load(root/'W28-house-20261125/w28-house.glb',r['house_sha256'])
    hg,_=geometry(h,ha,drop=r['settle_delta_m'])
    names={n['name']:i for i,n in enumerate(d['nodes'])}
    times=(0.,1.,2.,2.6,3.2);W,H=320,245
    sheet=Image.new('RGB',(W*len(times),2*(H+20)),(25,28,32));draw=ImageDraw.Draw(sheet)
    for col,t in enumerate(times):
        g,w=geometry(pose(d,a,t),a,True);M=w[r['basket_track_node']]
        scene={k:dict(z,v=z['v']@M[:3,:3].T+M[:3,3]) if z['basket'] else z for k,z in hg.items()}
        prepared=prepare(g,scene)
        views=[('Whole staging',[.35,.86,.75],[1.5,.75,1.3],1.9),
               ('Hands and basket',[.35,1.02,.58],[.25,.25,1.],1.12)]
        for row,(label,target,view,span) in enumerate(views):
            y=row*(H+20);draw.text((col*W+8,y+3),f'{t:.2f}s | {label}',fill=(230,230,230))
            sheet.paste(render(prepared,target,view,span,W,H),(col*W,y+20))
    path=f/'w38c-review.jpg';assert not path.exists();sheet.save(path,quality=85)
    report={'clip_sha256':r['sha256'],'jpeg_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'bytes':path.stat().st_size,'times':times,'limitations':'Faceted static CPU depth-buffer review; not beauty render or runtime animation acceptance.'}
    (f/'w38c-review.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
if __name__=='__main__':main()
