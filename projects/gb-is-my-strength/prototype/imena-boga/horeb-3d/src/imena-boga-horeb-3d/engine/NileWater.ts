/**
 * W10C — restrained Nile shallows.
 *
 * Not a claim to reproduce an exact historical Nile flood season or river
 * location. The visual law is shared by the procedural mesh and tests.
 * Shallows are sediment-tinted, the deep channel stays muted teal, and tiny
 * waves dampen as they meet the reconstructed physical shore.
 */
import { nileShoreX } from './NileTerrain.js';

export const NILE_WATER_LEVEL=-.13;

export function nileWaterNearshore(x:number,z:number):number{
  if(!Number.isFinite(x)||!Number.isFinite(z))return 0;
  const waterSide=Math.max(0,nileShoreX(z)-x);
  // A smooth blend rather than a hard graphic stripe across the river.
  const t=Math.max(0,Math.min(1,(3.6-waterSide)/3.6));
  return t*t*(3-2*t);
}

export function nileWaterHeight(x:number,z:number,nowMs:number,reducedMotion:boolean):number{
  if(!Number.isFinite(x)||!Number.isFinite(z))return NILE_WATER_LEVEL;
  const nearshore=nileWaterNearshore(x,z);
  if(reducedMotion||!Number.isFinite(nowMs))return NILE_WATER_LEVEL;
  const coastDamping=Math.min(1,Math.max(0,(nileShoreX(z)-x)/1.3));
  const t=nowMs*.001;
  const broad=.006*Math.sin(z*.48+x*.73+t*.5);
  const fine=.003*Math.sin(x*1.75-z*1.12-t*.78);
  const cross=.0018*Math.cos(z*1.75+x*.86+t*.35);
  return NILE_WATER_LEVEL+(broad+fine+cross)*coastDamping*(1-.14*nearshore);
}

export function nileWaterMottle(x:number,z:number):number{
  // Static, low-frequency sediment variation: not travelling stripes.
  const a=Math.sin(z*.28+x*.34),b=Math.sin(z*.84-x*.48);
  return 1+.035*a+.013*b;
}
