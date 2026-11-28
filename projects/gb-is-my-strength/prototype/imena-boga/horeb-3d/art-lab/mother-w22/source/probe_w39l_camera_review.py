"""W39l CPU perspective contact sheet using actual Three camera matrices' poses.
Diagnostic flat shading, not WebGL/material approval.
"""
import argparse,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry
from probe_w35e_playback import pose
from probe_w35f_depth_review import raster,unit

def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);args=p.parse_args()
 root=args.evidence;f=root/'W39c-approach-20261128';r=json.loads((f/'w38a-assembly.json').read_text());d,a=load(f/'w38a-handoff.glb',r['sha256'])
 h,ha=load(root/'W28-house-20261125/w28-house.glb',r['house_sha256']);hg,_=geometry(h,ha,drop=r['settle_delta_m'])
 q=json.loads((f/'w39k-camera-report.json').read_text());assert q['actorSha256']==r['sha256']
 sheet=Image.new('RGB',(960,440),(26,26,26));draw=ImageDraw.Draw(sheet);rows=[]
 for col,key in enumerate(('action','hands','house')):
  for row,(width,height,t) in enumerate(((1200,576,1.5),(366,439,4.7))):
   cam=next(x for x in q['rows'] if x['key']==key and x['width']==width and x['height']==height)
   g,w=geometry(pose(d,a,t),a,True);M=w[r['basket_track_node']]
   scene={}
   for k,z in hg.items():
    if z['basket']:scene[k]=dict(z,v=z['v']@M[:3,:3].T+M[:3,3])
    elif key=='house' or k.startswith(('Coarse_work_surface','Workshop_wood_support','Domestic_clay_bench','Folded_linen_by_basket','Room_floor_earthen')):scene[k]=z
   tri=[];colors=[]
   for name,z in list(g.items())+list(scene.items()):
    tt=z['v'][z['tri']];low=name.lower()
    if name.startswith('ANATOMICAL'):base=(201,153,119)
    elif 'linen' in low or 'hem' in low:base=(190,174,143)
    elif 'eye' in low:base=(214,208,186)
    elif 'lash' in low or 'brow' in low:base=(62,41,27)
    elif z.get('basket',False):base=(161,119,70) if 'rim' in low else (150,102,56)
    elif any(x in low for x in ('floor','ground','earth','wall','clay','plaster')):base=(159,131,99)
    elif any(x in low for x in ('wood','roof','beam','surface')):base=(115,83,56)
    else:base=(133,106,82)
    n=np.cross(tt[:,1]-tt[:,0],tt[:,2]-tt[:,0]);n/=np.maximum(np.linalg.norm(n,axis=1),1e-12)[:,None]
    light=.55+.43*np.abs(n@unit([.4,.8,.55]))
    tri.append(tt);colors.append(np.clip(np.array(base)*light[:,None],0,255).astype(np.uint8))
   tri=np.concatenate(tri);colors=np.concatenate(colors)
   eye=np.array(cam['eye']);direction=unit(np.array(cam['target'])-eye);right=unit(np.cross(direction,[0,1,0]));up=np.cross(right,direction)
   v=tri-eye;depth=v@direction
   # Only triangles fully in front of near plane; diagnostic near clipping.
   valid=(depth>cam['near']).all(1);near_omitted=int((~valid).sum());v=v[valid];depth=depth[valid];colors=colors[valid]
   W,H=(310,149) if row==0 else (185,222)
   tan=np.tan(np.radians(cam['fov']/2));x=(v@right)/depth/(tan*width/height);y=(v@up)/depth/tan
   proj=np.stack(((x+1)*W/2,(1-y)*H/2,-1/depth),axis=-1)
   ok=(proj[:,:,0].max(1)>=0)&(proj[:,:,0].min(1)<W)&(proj[:,:,1].max(1)>=0)&(proj[:,:,1].min(1)<H)
   im=Image.fromarray(raster(np.ascontiguousarray(proj[ok]),np.ascontiguousarray(colors[ok]),W,H))
   x0=col*320+(320-W)//2;y0=20 if row==0 else 203
   draw.text((col*320+8,y0-16),f'{key} | {width}x{height} | {t:.1f}s',fill=(230,230,230));sheet.paste(im,(x0,y0))
   rows.append({'key':key,'width':width,'height':height,'time':t,'near_plane_omitted_triangles':near_omitted})
 out=f/'w39l-camera-review.jpg';assert not out.exists();sheet.save(out,quality=87)
 report={'status':'ART_HOLD_CAMERA_CPU_REVIEW','actorSha256':r['sha256'],'jpegSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'rows':rows,'limitations':'Flat shaded CPU perspective approximation, not GPU rendering, texture/material, transparency, shadows or browser visual acceptance.'}
 (f/'w39l-camera-review.json').write_text(json.dumps(report,indent=2));print(json.dumps(report),flush=True)
if __name__=='__main__':main()
