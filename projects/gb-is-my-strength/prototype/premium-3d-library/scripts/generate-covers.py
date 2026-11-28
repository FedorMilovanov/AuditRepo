"""Deterministic, original placeholder covers for the local 3D library prototype.
The covers are *not* representations of historical manuscripts or licensed art.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from math import sin, cos, pi
import random

BASE = Path(__file__).resolve().parents[1] / 'public' / 'covers'
BASE.mkdir(parents=True, exist_ok=True)
SERIF = '/usr/share/fonts/truetype/noto/NotoSerif-Regular.ttf'
SANS = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
W,H=720,960
specs = [
    ('biografii.webp', ('БИОГРАФИИ', 'СЛУЖИТЕЛЕЙ'), (43,54,50), (207,169,118), 'columns'),
    ('nagornaya.webp', ('НАГОРНАЯ', 'ПРОПОВЕДЬ'), (57,72,68), (210,184,136), 'mountain'),
    ('otstuplenie.webp', ('ИСТОРИЯ', 'И ОТСТУПЛЕНИЕ'), (81,62,54), (213,178,134), 'manuscript'),
]
for name, titles, bg, ink, symbol in specs:
    rng=random.Random(name)
    im=Image.new('RGB',(W,H),bg)
    px=im.load()
    for y in range(H):
        for x in range(W):
            noise=rng.randrange(-10,11)
            edge=(abs(x-W/2)/(W/2)*.7 + abs(y-H/2)/(H/2)*.3)
            k=1.05-.16*edge
            px[x,y]=tuple(int(max(0,min(255,ch*k+noise))) for ch in bg)
    d=ImageDraw.Draw(im)
    for j in [27,34]:
        d.rounded_rectangle((j,j,W-j,H-j),radius=4,outline=ink,width=2 if j==27 else 1)
    # Receding, full-height masonry arch, not a fantasy icon.
    for ix in range(6):
        k=ix*16
        d.arc((148+k,210+k,572-k,665-k),180,360,fill=(*ink,),width=2)
        d.line((148+k,438+k,148+k,710-k),fill=ink,width=2)
        d.line((572-k,438+k,572-k,710-k),fill=ink,width=2)
    if symbol=='columns':
        for x in [255,322,389,456]:
            d.rectangle((x,490,x+19,722),fill=ink)
            d.rectangle((x-12,480,x+32,493),fill=ink)
            d.rectangle((x-12,713,x+32,726),fill=ink)
    elif symbol=='mountain':
        d.line((170,690,260,578,321,641,400,528,540,693),fill=ink,width=7,joint='curve')
        d.line((150,698,558,698),fill=ink,width=3)
        for x in [205,286,388,495]:
            d.ellipse((x,717,x+5,722),fill=ink)
    else:
        d.rounded_rectangle((225,495,497,709), radius=8,outline=ink,width=5)
        for y in range(516,680,23):
            d.line((245,y,473-rng.randrange(0,40),y),fill=ink,width=2)
        d.ellipse((330,683,390,743),outline=ink,width=4)
    serif=ImageFont.truetype(SERIF,55)
    small=ImageFont.truetype(SANS,21)
    d.text((W/2,112),'ГОСПОДЬ БОГ — СИЛА МОЯ',font=small,anchor='mm',fill=ink)
    for i,line in enumerate(titles):
        fs=serif if len(line)<15 else ImageFont.truetype(SERIF,44)
        d.text((W/2,324+i*73),line,font=fs,anchor='mm',fill=(239,223,191))
    d.line((210,782,510,782),fill=ink,width=2)
    d.text((W/2,827),'БОГОСЛОВСКАЯ БИБЛИОТЕКА',font=small,anchor='mm',fill=ink)
    im.save(BASE/name,format='WEBP',quality=85,method=6)
    print(name, (BASE/name).stat().st_size)
