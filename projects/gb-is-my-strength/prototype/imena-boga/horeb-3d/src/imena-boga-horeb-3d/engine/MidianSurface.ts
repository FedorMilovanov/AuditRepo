/** W13C original procedural material: no imported assets, photographs or
 * asserted Midian archaeology. Pure, seamlessly periodic multi-scale noise. */
import * as THREE from 'three';
export const MIDIAN_SOIL=Object.freeze({size:256,repeatX:9,repeatZ:10,bumpScale:.045});
const hash=(x:number,y:number,seed:number):number=>{
  let n=Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(seed,2246822519);
  n=Math.imul(n^(n>>>13),1274126177);
  return ((n^(n>>>16))>>>0)/4294967295;
};
const wrap=(i:number,n:number)=>((i%n)+n)%n;
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
function noise(u:number,v:number,cells:number,seed:number):number{
  const x=u*cells,z=v*cells,ix=Math.floor(x),iz=Math.floor(z);
  const sx=x-ix,sz=z-iz;
  const tx=sx*sx*(3-2*sx),tz=sz*sz*(3-2*sz);
  const x0=wrap(ix,cells),x1=wrap(ix+1,cells);
  const z0=wrap(iz,cells),z1=wrap(iz+1,cells);
  return mix(mix(hash(x0,z0,seed),hash(x1,z0,seed),tx),
    mix(hash(x0,z1,seed),hash(x1,z1,seed),tx),tz);
}
export function midianSurfaceValue(u:number,v:number):number{
  if(!Number.isFinite(u)||!Number.isFinite(v))return 0;
  // Periodic lattice at all octaves: 0 and 1 agree at both UV borders.
  const coarse=noise(u,v,4,21),medium=noise(u,v,16,87),
    small=noise(u,v,48,37),grain=noise(u,v,96,53);
  return Math.max(-1,Math.min(1,
    2*(.38*coarse+.28*medium+.20*small+.14*grain-.5)));
}
export function makeMidianSoilTexture():THREE.DataTexture{
  const {size,repeatX,repeatZ}=MIDIAN_SOIL;
  const bytes=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const v=midianSurfaceValue(x/size,y/size);
    // Near-neutral albedo multiplier (physical soil colours stay authored
    // in shared W13A ecological vertex colours). Bump derives from same data.
    const lum=Math.max(175,Math.min(255,226+v*75));
    const i=4*(y*size+x);
    bytes[i]=Math.round(lum);
    bytes[i+1]=Math.round(Math.min(255,lum+1));
    bytes[i+2]=Math.round(Math.min(255,lum+4));
    bytes[i+3]=255;
  }
  const texture=new THREE.DataTexture(bytes,size,size,THREE.RGBAFormat);
  texture.name='midian-original-seamless-soil';
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.wrapS=THREE.RepeatWrapping;
  texture.wrapT=THREE.RepeatWrapping;
  texture.repeat.set(repeatX,repeatZ);
  texture.magFilter=THREE.LinearFilter;
  texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps=true;
  texture.anisotropy=2;
  texture.needsUpdate=true;
  return texture;
}
