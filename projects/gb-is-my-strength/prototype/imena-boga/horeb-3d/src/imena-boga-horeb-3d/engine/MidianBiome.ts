/** W13A / physically neutral art habitat, no historic coordinates or
 * claimed Exodus-era vegetation species. One continuum for soil and plants. */
export const MIDIAN_NATURE=Object.freeze({scrubSeeds:124,pebbleSeeds:440});
export function midianWadiCenter(z:number):number{return -5.6-.4*Math.sin(z*.16);}
export function midianHabitat(x:number,z:number):{wash:number;scree:number;grain:number}{
  const wash=Math.exp(-Math.pow((x-midianWadiCenter(z))/3,2));
  const r=Math.hypot(x,z);
  const scree=Math.max(0,Math.min(1,(r-8)/28+.09*Math.sin(x*.32-z*.21)));
  const grain=.5+.5*Math.sin(x*.57+z*.24)*Math.cos(z*.47-x*.19);
  return {wash,scree,grain};
}
