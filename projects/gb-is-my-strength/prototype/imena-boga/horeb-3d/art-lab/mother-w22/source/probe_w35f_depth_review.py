"""CPU-only orthographic depth-buffer review of the actual W35d animation."""
import argparse,hashlib,json
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw
from numba import njit
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry
from probe_w35e_playback import pose

@njit(cache=False)
def raster(tri,color,width,height):
    rgb=np.zeros((height,width,3),np.uint8)
    rgb[:,:,0]=35;rgb[:,:,1]=39;rgb[:,:,2]=44
    depth=np.full((height,width),np.inf)
    for i in range(len(tri)):
        a,b,c=tri[i,0],tri[i,1],tri[i,2]
        ux=b[0]-a[0];uy=b[1]-a[1];vx=c[0]-a[0];vy=c[1]-a[1]
        den=ux*vy-uy*vx
        if abs(den)<1e-10:continue
        xmin=max(0,int(np.floor(min(a[0],b[0],c[0]))));xmax=min(width-1,int(np.ceil(max(a[0],b[0],c[0]))))
        ymin=max(0,int(np.floor(min(a[1],b[1],c[1]))));ymax=min(height-1,int(np.ceil(max(a[1],b[1],c[1]))))
        for y in range(ymin,ymax+1):
            for x in range(xmin,xmax+1):
                dx=x+.5-a[0];dy=y+.5-a[1]
                u=(dx*vy-dy*vx)/den;v=(ux*dy-uy*dx)/den
                if u<0 or v<0 or u+v>1:continue
                z=a[2]+u*(b[2]-a[2])+v*(c[2]-a[2])
                if z<depth[y,x]:
                    depth[y,x]=z;rgb[y,x]=color[i]
    return rgb
def unit(v):
    v=np.asarray(v,float);return v/np.linalg.norm(v)
def prepare(g,hg):
    tr=[];colors=[]
    for name,m in list(g.items())+[(k,v) for k,v in hg.items() if v['basket'] or k.startswith(('Coarse_work_surface','Workshop_wood_support','Domestic_clay_bench'))]:
        tri=m['v'][m['tri']]
        low=name.lower()
        if name.startswith('ANATOMICAL'):base=(201,153,119)
        elif 'linen' in low or 'hem' in low:base=(190,174,143)
        elif 'eye' in low:base=(214,208,186)
        elif 'lash' in low or 'brow' in low:base=(62,41,27)
        elif m.get('basket',False):
            base=(161,119,70) if 'rim' in low else (150,102,56)
        else:base=(108,78,52)
        n=np.cross(tri[:,1]-tri[:,0],tri[:,2]-tri[:,0]);n/=np.maximum(np.linalg.norm(n,axis=1),1e-12)[:,None]
        light=.55+.43*np.abs(n@unit([.4,.8,.55]))
        tr.append(tri);colors.append(np.clip(np.array(base)*light[:,None],0,255).astype(np.uint8))
    return np.concatenate(tr),np.concatenate(colors)
def render(prepared,target,view,span,width,height):
    tri,col=prepared;f=-unit(view);right=unit(np.cross(f,[0,1,0]));up=np.cross(right,f)
    q=tri-np.array(target)
    proj=np.stack((q@right,-q@up,q@f),axis=-1)
    proj[:,:,:2]*=height/span;proj[:,:,:2]+=[width/2,height/2]
    ok=(proj[:,:,0].max(1)>=0)&(proj[:,:,0].min(1)<width)&(proj[:,:,1].max(1)>=0)&(proj[:,:,1].min(1)<height)
    return Image.fromarray(raster(np.ascontiguousarray(proj[ok]),np.ascontiguousarray(col[ok]),width,height))
def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);args=p.parse_args()
    root=args.evidence;folder=root/'W35d-approach-20261127';r=json.loads((folder/'w35d-assembly.json').read_text())
    d,a=load(folder/'w35d-approach.glb',r['sha256'])
    m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text());h,ha=load(root/'W28-house-20261125/w28-house.glb',m['house_sha256'])
    hg,_=geometry(h,ha,drop=m['basket_support']['analytic_settle_delta_m'])
    names={n['name']:i for i,n in enumerate(d['nodes'])}
    W,H=480,320;sheet=Image.new('RGB',(W*2,H*3+60),(25,28,32));draw=ImageDraw.Draw(sheet)
    for col,t in enumerate((0.,1.5)):
        g,w=geometry(pose(d,a,t),a,True);prepared=prepare(g,hg)
        rows=[('Whole staging',[.35,.86,.75],[1.5,.75,1.3],1.9)]
        for s,sign in [('l',-1),('r',1)]:
            wrist=w[names['hand_'+s]][:3,3];knuckle=w[names['middle_01_'+s]][:3,3]
            target=(wrist+knuckle)*.5
            rows.append((s.upper()+' hand',target,[sign,.75,.7],.28))
        for row,(label,target,view,span) in enumerate(rows):
            y=row*(H+20)
            draw.text((col*W+8,y+3),f'{t:.2f}s | {label}',fill=(230,230,230))
            sheet.paste(render(prepared,target,view,span,W,H),(col*W,y+20))
    path=folder/'w35f-depth-review.jpg';assert not path.exists();sheet.save(path,quality=88)
    print(json.dumps({'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'bytes':path.stat().st_size,'clip_sha256':r['sha256'],'image':str(path),'limitations':'Untextured orthographic CPU depth-buffer review, not final beauty or physical grip validation.'}),flush=True)
if __name__=='__main__':main()
