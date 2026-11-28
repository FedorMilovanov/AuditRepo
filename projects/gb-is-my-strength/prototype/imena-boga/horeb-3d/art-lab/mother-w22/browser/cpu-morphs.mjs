/** W39i: hybrid morph evaluator. Keep original GLB and native skeletal skinning.
 * Only body/linen corrective targets move from GPU texture arrays to CPU
 * preblend; small facial morph sets remain native. No lossy compression.
 */
import * as THREE from 'three';
const TARGETS=new Map([
 ['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0',62],
 ['W28e_tailored_linen',74]
]);
function packed(attribute,count){
 if(!attribute||attribute.isInterleavedBufferAttribute||attribute.normalized||attribute.itemSize!==3||attribute.count!==count||!(attribute.array instanceof Float32Array))throw Error('Unsupported corrective attribute');
 return attribute.array;
}
export function bindCpuMorphs(root){
 const meshes=[];root.traverse(o=>{if(o.isMesh)meshes.push(o)});
 // Validate all candidates before touching any geometry.
 const plans=[...TARGETS].map(([name,count])=>{
  const matches=meshes.filter(o=>o.name===name);
  if(matches.length!==1)throw Error('Missing unique corrective mesh '+name);
  const mesh=matches[0],g=mesh.geometry,vertexCount=g.attributes.position.count;
  if(!mesh.isSkinnedMesh||meshes.filter(o=>o.geometry===g).length!==1||!g.morphTargetsRelative||g.morphAttributes.color||mesh.morphTargetInfluences?.length!==count)throw Error('Unexpected corrective contract '+name);
  const channels=['position','normal'].map(key=>{
   const attrs=g.morphAttributes[key];
   if(attrs?.length!==count)throw Error('Wrong '+key+' targets '+name);
   const base=packed(g.attributes[key],vertexCount).slice();
   return {key,base,targets:attrs.map(a=>packed(a,vertexCount)),output:new THREE.BufferAttribute(base.slice(),3).setUsage(THREE.DynamicDrawUsage)};
  });
  return {mesh,g,channels,count,vertexCount,previous:new Float64Array(count).fill(NaN)};
 });
 let uploads=0,updates=0,maxActive=0;
 for(const p of plans){
  for(const c of p.channels)p.g.setAttribute(c.key,c.output);
  // Preserve influences and dictionary: AnimationMixer still writes the
  // original weight tracks. No GPU morph shader/array allocation on these meshes.
  p.g.morphAttributes={};
 }
 function update(){
  let changed=0,active=0;
  for(const p of plans){
   const weights=p.mesh.morphTargetInfluences;
   if(weights.length!==p.count||!weights.every(Number.isFinite))throw Error('Invalid morph weights');
   const indices=[];for(let i=0;i<weights.length;i++)if(weights[i]!==0)indices.push(i);
   active+=indices.length;
   if(weights.every((v,i)=>v===p.previous[i]))continue;
   for(const c of p.channels){
    const dst=c.output.array,base=c.base,targets=c.targets;
    // Accumulate in JS double, round only at output (Float32).
    // For ordinary glTF LINEAR interpolation only a few weights are active.
    for(let j=0;j<dst.length;j++){
     let value=base[j];
     for(const i of indices)value+=targets[i][j]*weights[i];
     dst[j]=value;
    }
    c.output.needsUpdate=true;uploads+=dst.byteLength;
   }
   p.previous.set(weights);changed++;
  }
  maxActive=Math.max(maxActive,active);updates+=changed;
  return {changed,active};
 }
 return {update,stats:()=>({meshes:plans.length,updates,uploads,maxActive,
  dynamicBufferBytes:plans.reduce((s,p)=>s+p.channels.reduce((n,c)=>n+c.output.array.byteLength,0),0),
  retainedCpuTargetBytes:plans.reduce((s,p)=>s+p.channels.reduce((n,c)=>n+c.targets.reduce((m,t)=>m+t.byteLength,0),0),0)})};
}
