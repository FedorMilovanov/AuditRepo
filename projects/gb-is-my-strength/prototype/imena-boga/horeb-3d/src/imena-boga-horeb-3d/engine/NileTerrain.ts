/**
 * Nile W10E. One continuous, deterministic riparian model shared by rendered
 * terrain, wetland vegetation, water and grounded pedestrian collisions.
 * Coordinates are purely local artistic units, NOT a historical geolocation.
 * Reeds form natural thickets; none are planted mid-channel.
 */
export type NileEpisode = 'basket' | 'discovery';
export type PapyrusRoot = Readonly<{x:number;z:number;height:number;sway:number}>;
export const NILE_WALK = Object.freeze({
  minZ:-20,maxZ:9,maxX:9.45,shoreClearance:.27,
  startX:7.1,startZ:1.6,startYaw:1.06,startPitch:-.2,
  eyeHeight:1.64,speed:3.0,
});
export const NILE_CRADLE=Object.freeze({x:.73,z:-2.1,r:.61});
export const nileHash=(n:number)=>{
  const v=Math.sin(n*127.1)*43758.5453;
  return v-Math.floor(v);
};
// Two broad meanders with soft embayments: no noisy or discontinuous
// displacement. The river mesh and walk limit depend on the same function.
export function nileShoreX(z:number):number{
  const q=z+8;
  const broad=.16*Math.sin(q*.31)+.16*Math.sin(q*.135);
  const channelCut=.19*Math.exp(-Math.pow((z+7.3)/2.5,2));
  const sandPoint=.14*Math.exp(-Math.pow((z-3.1)/2.8,2));
  return 1.25-broad+channelCut-sandPoint;
}
export function nileGroundY(x:number,z:number):number{
  const d=Math.max(0,x-nileShoreX(z));
  const wetToDry=Math.min(1,d/2.6);
  const floodSlope=.114+.014*Math.sin(z*.19);
  // Broad alluvial ridges, physically sampled by the same mesh and walker.
  const lowRidges=(.046*Math.sin(z*.23+x*.20)+
    .025*Math.cos(z*.41-x*.31))*wetToDry;
  // Frequencies stay below the mobile terrain mesh sampling rate.
  const soilTexture=.012*(Math.sin(x*1.26+z*.72)+
    .48*Math.sin(x*2.12-z*.63))*wetToDry;
  // A shallow rainwater runnel, not a constructed road or canal.
  const runnelCenter=5.45+.25*Math.sin(z*.22);
  const runnel=-.052*Math.exp(-Math.pow((d-runnelCenter)/.81,2))*wetToDry;
  const berm=Math.max(0,Math.min(1,(x-8.2)/1.75));
  const terrace=.47*berm*berm*(3-2*berm);
  return -.14+floodSlope*d+lowRidges+soilTexture+runnel+terrace;
}
// Five deterministic shoreline patches replace the old uniform picket-fence
// distribution. A central opening frames both the basket and the discovery.
const BANK_PATCH_CENTERS=[-14.2,-10.2,-6.45,2.65,6.55] as const;
export function nilePapyrusRoot(index:number,moment:NileEpisode):PapyrusRoot{
  const onBank=index<91;
  let x:number,z:number;
  if(onBank){
    const patch=BANK_PATCH_CENTERS[index%BANK_PATCH_CENTERS.length];
    z=patch+(nileHash(index*2.17+5.1)-.5)*2.8;
    // Papyrus roots grow on the waterlogged lip, not in open mid-channel.
    x=nileShoreX(z)+.13+nileHash(index*1.91+1.35)*2.03;
    if(Math.abs(z-NILE_CRADLE.z)<2.2){
      const side=z>=NILE_CRADLE.z?1:-1;
      z=NILE_CRADLE.z+side*(2.38+.18*nileHash(index*9.31));
      x=nileShoreX(z)+.13+nileHash(index*1.91+1.35)*2.03;
    }
    if(moment==='discovery'&&Math.hypot(x-2.1,z+1.85)<1.05)
      x=nileShoreX(z)+2.15+nileHash(index*7.19)*.24;
  }else{
    // Thirteen water-growing roots stay within a metre of actual shallows.
    z=-16+nileHash(index*2.17+5.1)*24;
    x=nileShoreX(z)-.16-nileHash(index*3.13+.75)*.84;
  }
  return {x,z,height:1.85+nileHash(index*4.31+1.1)*1.55,
    sway:(nileHash(index*5.81)-.5)*.13};
}
const FIGURES=[{x:3.05,z:-2.4,r:.82},
 {x:2.08,z:-1.9,r:.78},{x:3.72,z:-1.1,r:.78}] as const;
// Cache the very same seeded roots used by the renderer. Do not recompute
// ninety-one trigonometric/expensive coast samples on every camera movement.
const BANK_ROOTS:Readonly<Record<NileEpisode,readonly PapyrusRoot[]>>={
  basket:Array.from({length:91},(_,i)=>nilePapyrusRoot(i,'basket')),
  discovery:Array.from({length:91},(_,i)=>nilePapyrusRoot(i,'discovery')),
};
export function nileCanWalk(x:number,z:number,moment:NileEpisode):boolean{
  if(!Number.isFinite(x)||!Number.isFinite(z)||
    z<NILE_WALK.minZ||z>NILE_WALK.maxZ||x>NILE_WALK.maxX||
    x<nileShoreX(z)+NILE_WALK.shoreClearance)return false;
  if(Math.hypot(x-NILE_CRADLE.x,z-NILE_CRADLE.z)<NILE_CRADLE.r)
    return false;
  if(moment==='discovery'&&FIGURES.some(f=>Math.hypot(x-f.x,z-f.z)<f.r))
    return false;
  // The physical roots are real, rather than just decorative instances.
  // Simple cylinders are narrow; their canopies remain pass-through.
  for(const root of BANK_ROOTS[moment]){
    const dx=x-root.x,dz=z-root.z;
    if(Math.abs(dx)<.12&&Math.abs(dz)<.12&&dx*dx+dz*dz<.0144)
      return false;
  }
  return true;
}
