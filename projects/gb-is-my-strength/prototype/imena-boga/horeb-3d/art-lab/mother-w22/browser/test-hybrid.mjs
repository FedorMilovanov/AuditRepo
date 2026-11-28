/** W39i independent native-vs-hybrid comparison of every body/linen vertex. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {performance} from 'node:perf_hooks';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {bindBasket,attachAction,morphBudget} from './scene.mjs';
import {bindCpuMorphs} from './cpu-morphs.mjs';
import {makeServer,verifyAssets} from './serve.mjs';
const root=process.env.HOREB_EVIDENCE_ROOT;
if(!root)throw Error('Missing evidence root');
globalThis.self=globalThis;
globalThis.ProgressEvent??=class extends Event{constructor(type,props){super(type);Object.assign(this,props)}};
globalThis.createImageBitmap=async blob=>{assert(blob.size>0);return {width:1,height:1,close(){}}};
const assets=await verifyAssets(root),loader=new GLTFLoader();
async function load(file){const b=await fs.readFile(file);return loader.parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'')}
const h=await load(assets.house.file),a=await load(assets.actor.file);
const basket=bindBasket(h.scene,a.scene,-.011000039951334027);
const names=['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0','W28e_tailored_linen'];
const meshes=names.map(n=>a.scene.getObjectByName(n)),vector=new THREE.Vector3();
const nativeBudget=morphBudget(a.scene,4096);
const native=attachAction(a.scene,a.animations[0],basket);
const times=[0,.317,.6,.958,1.5,2.185,2.5,3.5,3.522841,3.545682,3.591364,3.637046,3.682728,4.1,4.7,0,3.55];
const refs=[];
function getWorld(mesh,index){
 return mesh.getVertexPosition(index,vector).applyMatrix4(mesh.matrixWorld);
}
for(const t of times){
 native.sample(t);
 refs.push(meshes.map(mesh=>{
  const g=mesh.geometry,base=g.attributes.normal.array,targets=g.morphAttributes.normal,weights=mesh.morphTargetInfluences.slice(),active=weights.map((w,i)=>w!==0?i:-1).filter(i=>i>=0);
  const position=new Float64Array(g.attributes.position.count*3),normal=new Float64Array(base.length);
  for(let i=0;i<position.length/3;i++)getWorld(mesh,i).toArray(position,i*3);
  for(let j=0;j<normal.length;j++){let v=base[j];for(const k of active)v+=targets[k].array[j]*weights[k];normal[j]=v}
  return {position,normal,weights};
 }));
}
native.dispose();
const hybrid=bindCpuMorphs(a.scene),clip=attachAction(a.scene,a.animations[0],basket);
const budget=morphBudget(a.scene,4096);
assert.equal(budget.estimatedGpuBytes,143360); // remaining facial morph arrays
let maxPositionError=0,maxNormalError=0,vertices=0,maxWeightsError=0;
for(let k=0;k<times.length;k++){
 clip.sample(times[k]);hybrid.update();
 for(let j=0;j<meshes.length;j++){
  const mesh=meshes[j],ref=refs[k][j],g=mesh.geometry;
  assert.equal(Object.keys(g.morphAttributes).length,0);
  for(let i=0;i<ref.position.length/3;i++){
   getWorld(mesh,i);const n=i*3;
   const err=Math.hypot(vector.x-ref.position[n],vector.y-ref.position[n+1],vector.z-ref.position[n+2]);
   maxPositionError=Math.max(maxPositionError,err);vertices++;
  }
  for(let i=0;i<ref.normal.length;i++)maxNormalError=Math.max(maxNormalError,Math.abs(ref.normal[i]-g.attributes.normal.array[i]));
  for(let i=0;i<ref.weights.length;i++)maxWeightsError=Math.max(maxWeightsError,Math.abs(ref.weights[i]-mesh.morphTargetInfluences[i]));
 }
}
assert(maxPositionError<2e-7,String(maxPositionError));
assert(maxNormalError<3e-7,String(maxNormalError));
assert.equal(maxWeightsError,0);
const before=hybrid.stats();assert.equal(hybrid.update().changed,0);assert.deepEqual(before,hybrid.stats());
const timings=[];
for(let i=0;i<=113;i++){
 clip.sample(Math.min(4.7,i/24));
 const start=performance.now();hybrid.update();timings.push(performance.now()-start);
}
timings.sort((a,b)=>a-b);
const stats=hybrid.stats();
clip.dispose();
const server=await makeServer(root);
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
try{const res=await fetch('http://127.0.0.1:'+server.address().port+'/cpu-morphs.mjs');assert.equal(res.status,200);assert((await res.text()).includes('bindCpuMorphs'))}finally{await new Promise(r=>server.close(r))}
const report={status:'ART_HOLD_HYBRID_MORPH_MATH_PASS',actorSha256:assets.actor.sha256,houseSha256:assets.house.sha256,threeRevision:THREE.REVISION,poses:times.length,vertices,maxPositionErrorM:maxPositionError,maxLocalNormalComponentError:maxNormalError,maxWeightsError,nativeBudget,budget,stats,timingMs:{samples:timings.length,median:timings[Math.floor(timings.length/2)],p95:timings[Math.floor(timings.length*.95)],max:timings.at(-1)},limitations:['Node native vs hybrid CPU evaluation; fake bitmaps; no real texture decode, GPU rendering, driver measurement, mobile FPS, or artistic acceptance. CPU target arrays remain retained.']};
const file=path.join(root,'W39c-approach-20261128/w39i-hybrid-report.json');await fs.writeFile(file,JSON.stringify(report,null,2),{flag:'wx'});console.log(JSON.stringify(report));
