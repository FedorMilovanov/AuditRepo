"""Deterministic original PBR material tiles for the 3D architectural lab.

Requires Pillow and NumPy at authoring time only. No external image assets.
"""
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / 'src' / 'assets' / 'pbr'
ROOT.mkdir(parents=True, exist_ok=True)
N = 768
Y, X = np.mgrid[0:N, 0:N].astype(np.float32) / N
rng = np.random.default_rng(1197)

def periodic_noise(scales):
    out = np.zeros((N,N), dtype=np.float32)
    for k, amp in scales:
        for _ in range(5):
            kx = int(rng.integers(-k,k+1)); ky = int(rng.integers(-k,k+1))
            if kx == ky == 0: kx = 1
            out += amp * np.sin(2*np.pi*(kx*X+ky*Y)+rng.uniform(0,2*np.pi))/5
    return out

def normal_map(height,strength):
    dx = (np.roll(height,-1,1)-np.roll(height,1,1))*strength
    dy = (np.roll(height,-1,0)-np.roll(height,1,0))*strength
    n = np.stack((-dx,-dy,np.ones_like(dx)),axis=-1)
    n/=np.maximum(np.linalg.norm(n,axis=-1,keepdims=True),1e-6)
    return np.uint8(np.clip((n*.5+.5)*255,0,255))

def save(name, rgb, height,strength):
    Image.fromarray(np.uint8(np.clip(rgb,0,255)),'RGB').save(ROOT/f'{name}-color.webp',quality=88,method=6)
    Image.fromarray(normal_map(height,strength),'RGB').save(ROOT/f'{name}-normal.webp',lossless=True,method=6)

cloud=periodic_noise([(2,.85),(5,.42),(13,.20),(45,.075)])
veins=periodic_noise([(3,.32),(9,.07)])
traces=np.power(np.clip(1-np.abs(np.sin(2*np.pi*(2*X+Y+.12*cloud+.09*veins))),0,1),15)
pores=periodic_noise([(45,.3),(78,.1)])
height=cloud*.32-traces*.28+pores*.12
light=cloud*5.2-traces*5+pores*1.9
save('limestone',np.stack((201+light,192+light*.92,175+light*.82),axis=-1),height,6.7)
wave=periodic_noise([(2,.55),(6,.26),(17,.14)])
grain=.6*np.sin(2*np.pi*(46*X+.11*np.sin(2*np.pi*(2*Y+wave*.20))))
grain+=.25*np.sin(2*np.pi*(91*X+.07*np.sin(2*np.pi*5*Y)))
grain+=periodic_noise([(10,.18),(38,.06)])
base=grain*12.2+wave*6.3
save('oak',np.stack((110+base,76+base*.82,51+base*.64),axis=-1),grain*.55+wave*.2,4.8)
