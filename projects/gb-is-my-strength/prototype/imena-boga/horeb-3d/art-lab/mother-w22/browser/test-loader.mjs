/** W39 loader/math/loopback contract test. No browser, image decoding or GPU. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {bindBasket,attachAction,morphBudget} from './scene.mjs';
import {makeServer,verifyAssets} from './serve.mjs';
const root=process.env.HOREB_EVIDENCE_ROOT;
if(!root)throw Error('Missing HOREB_EVIDENCE_ROOT');
// Node lacks browser image decoders: stub only the bitmap object. Geometry,
// sparse accessors, animation and skinning use the real installed GLTFLoader.
globalThis.self=globalThis;
globalThis.ProgressEvent??=class extends Event{constructor(type,props){super(type);Object.assign(this,props)}};
let bitmaps=0;
globalThis.createImageBitmap=async blob=>{assert(blob.size>0);bitmaps++;return {width:1,height:1,close(){}}};
const assets=await verifyAssets(root);
const witness=JSON.parse(await fs.readFile(path.join(root,'W39c-approach-20261128/w39g-browser-witness.json'),'utf8'));
assert.equal(witness.actor_sha256,assets.actor.sha256);assert.equal(witness.house_sha256,assets.house.sha256);
const loader=new GLTFLoader();
async function load(file){const b=await fs.readFile(file);return loader.parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'')}
const h=await load(assets.house.file),a=await load(assets.actor.file);
assert.equal(a.animations.length,1);
const basket=bindBasket(h.scene,a.scene,-.011000039951334027),clip=attachAction(a.scene,a.animations[0],basket);
const vector=new THREE.Vector3();let maxActor=0,maxBasket=0,maxTrack=0,actorCount=0,basketCount=0;
function compare(root,values,isActor){
 for(const [name,rows] of Object.entries(values)){
  const mesh=root.getObjectByName(name);assert(mesh?.isMesh,'Missing '+name);
  for(const sample of rows){
   mesh.getVertexPosition(sample.index,vector).applyMatrix4(mesh.matrixWorld);
   const err=vector.distanceTo(new THREE.Vector3(...sample.xyz));
   if(isActor){maxActor=Math.max(err,maxActor);actorCount++}else{maxBasket=Math.max(err,maxBasket);basketCount++}
   assert(err<2e-6,name+' '+sample.index+' '+err);
  }
 }
}
// Include backwards seeks from the clamped end, not just forward playback.
for(const row of [...witness.rows,witness.rows[0],witness.rows[3]]){
 clip.sample(row.time);h.scene.updateMatrixWorld(true);a.scene.updateMatrixWorld(true);
 compare(a.scene,row.actor,true);compare(h.scene,row.basket,false);
 const err=Math.max(...basket.track.matrixWorld.elements.map((x,i)=>Math.abs(x-row.track[i])));maxTrack=Math.max(err,maxTrack);assert(err<2e-6);
}
const budget=morphBudget(a.scene,4096);assert(budget.rows.some(r=>r.count===74));assert(budget.rows.some(r=>r.count===62));
assert.equal(basket.meshCount,92);clip.dispose();
const server=await makeServer(root);
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
let checks=0;
try{
 const base='http://127.0.0.1:'+server.address().port;
 for(const [route,expected] of [['/',200],['/viewer.mjs',200],['/scene.mjs',200],['/manifest.json',200],['/vendor/three/build/three.module.js',200],['/vendor/three/examples/jsm/loaders/GLTFLoader.js',200],['/assets/actor.glb',200],['/assets/house.glb',200],['/package.json',404],['/assets/other.glb',404]]){
  const res=await fetch(base+route,{method:'HEAD'});assert.equal(res.status,expected,route);checks++;
  if(route==='/assets/actor.glb')assert.equal(Number(res.headers.get('content-length')),assets.actor.bytes);
  if(route==='/assets/house.glb')assert.equal(Number(res.headers.get('content-length')),assets.house.bytes);
 }
 const forbidden=await new Promise((resolve,reject)=>{const req=http.request(base+'/',{headers:{host:'example.invalid'}},res=>{res.resume();resolve(res.statusCode)});req.on('error',reject);req.end()});assert.equal(forbidden,403);checks++;
 const manifest=await (await fetch(base+'/manifest.json')).json();assert.equal(manifest.actor.sha256,assets.actor.sha256);assert(!JSON.stringify(manifest).includes(assets.actor.file));checks++;
 const post=await fetch(base+'/',{method:'POST'});assert.equal(post.status,405);checks++;
}finally{await new Promise(resolve=>server.close(resolve))}
const report={status:'ART_HOLD_LOADER_MATH_PASS',actorSha256:assets.actor.sha256,houseSha256:assets.house.sha256,threeRevision:THREE.REVISION,poses:witness.rows.length+2,actorCount,basketCount,maxActorErrorM:maxActor,maxBasketErrorM:maxBasket,maxTrackError:maxTrack,bitmapStubs:bitmaps,httpChecks:checks,budget,limitations:['Real Three.js GLTFLoader, sparse accessor and AnimationMixer CPU evaluation; fake image bitmaps, no texture decode, no WebGL, no browser or visual approval.']};
const file=path.join(root,'W39c-approach-20261128/w39g-loader-report.json');await fs.writeFile(file,JSON.stringify(report,null,2),{flag:'wx'});console.log(JSON.stringify(report));
