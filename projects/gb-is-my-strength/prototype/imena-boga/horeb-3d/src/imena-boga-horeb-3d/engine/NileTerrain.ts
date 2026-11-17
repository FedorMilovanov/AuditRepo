/**
 * Nile W10B. One deterministic landscape contract for the physical terrain,
 * papyrus placement and pedestrian navigation. Coordinates are purely local
 * artistic units, NOT a claimed geolocation of Exodus 2.
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
export function nileShoreX(z:number):number{
  const localZ=z+8;
  return 1.25-Math.sin(localZ*.34)*.17-Math.sin(localZ*.13)*.22;
}
export function nileGroundY(x:number,z:number):number{
  const distance=Math.max(0,x-nileShoreX(z));
  const localX=x-4.45,localZ=z+8;
  // Wet lip and gentle alluvial rise share precisely the renderer's mesh.
  const relief=.032*Math.sin(localX*1.8+localZ*.7)*Math.min(1,distance);
  const micro=.011*(Math.sin(x*2.8+z*.91)+.55*Math.sin(x*5.4-z*2.3))
    *Math.min(1,distance);
  // The right bank turns into a visibly higher sandy terrace.
  const berm=Math.max(0,Math.min(1,(x-8.2)/1.75));
  const terrace=.47*berm*berm*(3-2*berm);
  return -.14+.12*distance+relief+micro+terrace;
}
export function nilePapyrusRoot(index:number,moment:NileEpisode):PapyrusRoot{
  let z=-16+nileHash(index*2.17+5.1)*24;
  const onBank=index<91;
  let x=onBank?1.32+nileHash(index*1.91+1.35)*1.55
    :-6+nileHash(index*3.13+.75)*1.3;
  // Keep the cradle and a person's approach visible; bank thickets are
  // still dense elsewhere. No relocating the basket into open water.
  if(onBank&&Math.abs(z+2.1)<2.2){
    // Preserve the dense wetland on BOTH sides, not a plant fence through
    // the cradle, reaching servant, or real player's line of sight.
    const sign=z>=-2.1?1:-1;
    z=-2.1+sign*(2.45+nileHash(index*9.31)*.85);
  }
  if(moment==='discovery'&&onBank&&Math.hypot(x-2.1,z+1.85)<1.05)
    x=3.25+nileHash(index*7.19)*.24;
  return {x,z,height:1.85+nileHash(index*4.31+1.1)*1.65,
    sway:(nileHash(index*5.81)-.5)*.13};
}
const FIGURES=[{x:3.05,z:-2.4,r:.82},
 {x:2.08,z:-1.9,r:.78},{x:3.72,z:-1.1,r:.78}] as const;
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
  for(let i=0;i<91;i++){
    const root=nilePapyrusRoot(i,moment);
    if(Math.abs(x-root.x)<.12&&Math.abs(z-root.z)<.12&&
       Math.hypot(x-root.x,z-root.z)<.12)return false;
  }
  return true;
}
