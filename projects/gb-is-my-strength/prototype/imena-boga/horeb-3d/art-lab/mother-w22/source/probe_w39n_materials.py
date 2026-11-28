"""W39n: decode the exact embedded house/actor images and inspect PBR base colors.

A texture/material swatch sheet, not a 3D render. Source GLBs are read-only.
"""
import argparse,hashlib,io,json,struct
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw,ImageOps

SPECS=[
 ('actor','W39c-approach-20261128/w38a-handoff.glb','17028ece670f5a496ce0568f26be765fed7a618b84cdd62861269fc8d911998c'),
 ('house','W28-house-20261125/w28-house.glb','fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622')
]
def sha(b):return hashlib.sha256(b).hexdigest()
def linear(x):return np.where(x<=.04045,x/12.92,((x+.055)/1.055)**2.4)
def srgb(x):return np.where(x<=.0031308,12.92*x,1.055*np.maximum(x,0)**(1/2.4)-.055)
def u8(x):return np.clip(np.round(x*255),0,255).astype(np.uint8)
def inspect(root,kind,rel,expected):
 raw=(root/rel).read_bytes();assert sha(raw)==expected
 magic,version,total,jlen,jtype=struct.unpack_from('<5I',raw);assert (magic,version,total,jtype)==(0x46546c67,2,len(raw),0x4e4f534a)
 d=json.loads(raw[20:20+jlen]);blen,btype=struct.unpack_from('<2I',raw,20+jlen);assert btype==0x004e4942
 buf=memoryview(raw)[28+jlen:28+jlen+blen];assert len(buf)==blen
 images=[];thumbs=[];decoded_pixels=0
 for i,im in enumerate(d.get('images',[])):
  assert 'uri' not in im
  v=d['bufferViews'][im['bufferView']];off=v.get('byteOffset',0);end=off+v['byteLength'];assert v['buffer']==0 and 0<=off<end<=len(buf)
  blob=bytes(buf[off:end])
  with Image.open(io.BytesIO(blob)) as p:
   fmt=p.format;size=p.size;mode=p.mode
   assert fmt in ('PNG','JPEG') and im['mimeType']=={'PNG':'image/png','JPEG':'image/jpeg'}[fmt]
   assert 0<min(size)<=max(size)<=4096
   decoded_pixels+=size[0]*size[1];assert decoded_pixels<=64*1024*1024
   p.load()
   rgba=p.convert('RGBA');rgba.thumbnail((240,120),Image.Resampling.LANCZOS);thumbs.append(rgba.copy())
  images.append({'index':i,'name':im.get('name'),'mime':im['mimeType'],'format':fmt,'width':size[0],'height':size[1],'mode':mode,'bytes':len(blob),'sha256':sha(blob)})
 mats=[];swatches=[]
 for i,m in enumerate(d['materials']):
  p=m.get('pbrMetallicRoughness',{});factor=np.array(p.get('baseColorFactor',[1,1,1,1]),float);assert factor.shape==(4,) and np.all((0<=factor)&(factor<=1))
  refs={}
  for k,info in [('baseColor',p.get('baseColorTexture')),('metalRough',p.get('metallicRoughnessTexture')),('normal',m.get('normalTexture')),('occlusion',m.get('occlusionTexture')),('emissive',m.get('emissiveTexture'))]:
   if info is not None:
    tex=d['textures'][info['index']];idx=tex['source'];assert 0<=idx<len(images);refs[k]=idx
  # Apply glTF linear baseColorFactor to the sRGB texel samples, not to
  # raw gamma-coded channel values. No lighting, normals or BRDF here.
  if 'baseColor' in refs:orig=thumbs[refs['baseColor']]
  else:orig=Image.new('RGBA',(240,120),(255,255,255,255))
  pix=np.asarray(orig,dtype=float)/255
  rgb=srgb(linear(pix[:,:,:3])*factor[:3]);alpha=pix[:,:,3]*factor[3]
  effective=Image.fromarray(np.dstack((u8(rgb),u8(alpha))),'RGBA')
  swatches.append(effective)
  mats.append({'index':i,'name':m.get('name'),'baseColorFactor':factor.tolist(),'metallic':p.get('metallicFactor',1),'roughness':p.get('roughnessFactor',1),'alphaMode':m.get('alphaMode','OPAQUE'),'refs':refs,'effectiveThumbnailMedianSrgb':np.median(u8(rgb).reshape(-1,3),axis=0).tolist()})
 return {'kind':kind,'sha256':expected,'images':images,'materials':mats,'decodedPixels':decoded_pixels},swatches
def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);args=p.parse_args()
 root=args.evidence;folder=root/'W39c-approach-20261128'
 out=folder/'w39n-material-swatches.jpg';report=folder/'w39n-material-report.json';assert not out.exists() and not report.exists()
 allrows=[];swatches=[]
 for kind,rel,expected in SPECS:
  result,images=inspect(root,kind,rel,expected);allrows.append(result);swatches.extend((kind,m,img) for m,img in zip(result['materials'],images))
 W,H=300,146;sheet=Image.new('RGB',(3*W,((len(swatches)+2)//3)*H),(32,30,27));draw=ImageDraw.Draw(sheet)
 for k,(kind,m,img) in enumerate(swatches):
  x=(k%3)*W;y=(k//3)*H
  name=m['name'] or str(m['index'])
  draw.text((x+8,y+5),f'{kind} | {name[:38]}',fill=(239,231,214))
  tile=Image.new('RGB',(W-16,108),(87,82,74));a=ImageOps.contain(img,(W-16,108),Image.Resampling.LANCZOS)
  tile.paste(a,((tile.width-a.width)//2,(tile.height-a.height)//2),a)
  sheet.paste(tile,(x+8,y+23))
  draw.text((x+8,y+132),f'{"texture" if "baseColor" in m["refs"] else "constant"} | roughness {m["roughness"]:.2f} | {m["alphaMode"]}',fill=(198,189,172))
 sheet.save(out,quality=88)
 result={'status':'ART_HOLD_EMBEDDED_MATERIAL_DECODE_PASS','assets':allrows,'imageCount':sum(len(z['images']) for z in allrows),'materialCount':len(swatches),'baseColorTextured':sum('baseColor' in m['refs'] for z in allrows for m in z['materials']),'jpegSha256':sha(out.read_bytes()),'limitations':'PIL decoded embedded PNG/JPEG, base-color texture and linear factor swatches only. No WebGL, UV mapping, texture filtering, alpha shader, PBR lighting, normal map shading or artistic approval.'}
 report.write_text(json.dumps(result,indent=2))
 print(json.dumps({k:v for k,v in result.items() if k!='assets'}),flush=True)
if __name__=='__main__':main()
