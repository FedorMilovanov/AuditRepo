/** W39k: actual Three camera matrices vs independent sampled geometry bounds. */
import * as THREE from 'three';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {SHOTS,applyFrame,corners} from './camera.mjs';
import {makeServer,verifyAssets} from './serve.mjs';
const root=process.env.HOREB_EVIDENCE_ROOT;
if(!root)throw Error('Missing evidence root');
const assets=await verifyAssets(root);
const folder=path.join(root,'W39c-approach-20261128');
const witness=JSON.parse(await fs.readFile(path.join(folder,'w39j-camera-witness.json'),'utf8'));
assert.equal(witness.actorSha256,assets.actor.sha256);assert.equal(witness.houseSha256,assets.house.sha256);
const oldShots={action:{eye:[2.7,1.8,2.1],target:[.35,.86,.75]},hands:{eye:[1.55,1.42,1.5],target:[.35,1.04,.52]},house:{eye:[5.6,3.8,5.4],target:[.2,1.05,.2]}};
const dimensions=[[1200,576],[1366,600],[768,520],[366,439],[296,300],[300,600]];
const rows=[];let checks=0,oldClipped=0;
for(const key of Object.keys(SHOTS)){
 assert.deepEqual(SHOTS[key].bounds,witness.envelopeMm[key]);
 for(const [width,height] of dimensions){
  const aspect=width/height,camera=new THREE.PerspectiveCamera();
  const f=applyFrame(camera,key,aspect);
  const old=new THREE.PerspectiveCamera(THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(21))*Math.max(1,1.1/aspect))),aspect,.04,50);
  old.position.set(...oldShots[key].eye);old.lookAt(...oldShots[key].target);old.updateMatrixWorld(true);
  let max=0,oldMax=0,oldBad=0;
  for(const z of witness.rows){
   const b=z.bounds[key].map(v=>v.map(x=>x*1000));
   for(const p of corners(b)){
    const q=p.clone().project(camera),o=p.clone().project(old);
    assert([q.x,q.y,q.z].every(Number.isFinite));
    const ndc=Math.max(Math.abs(q.x),Math.abs(q.y));max=Math.max(max,ndc);
    assert(ndc<=SHOTS[key].margin+1e-8&&q.z>=-1&&q.z<=1,key+' '+width+' '+ndc);
    const prev=Math.max(Math.abs(o.x),Math.abs(o.y));oldMax=Math.max(oldMax,prev);
    if(prev>1||o.z < -1||o.z>1)oldBad++;
    checks++;
   }
  }
  oldClipped+=oldBad;
  rows.push({key,width,height,distance:f.distance,maxNdc:max,oldMaxNdc:oldMax,oldClippedCorners:oldBad,eye:f.eye.toArray(),target:f.target.toArray(),fov:f.fov,near:f.near,far:f.far});
 }
}
assert(checks===61*3*6*8);
const server=await makeServer(root);
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
try{const res=await fetch('http://127.0.0.1:'+server.address().port+'/camera.mjs');assert.equal(res.status,200);assert((await res.text()).includes('cameraFrame'))}finally{await new Promise(r=>server.close(r))}
const result={status:'ART_HOLD_CAMERA_MATH_PASS',actorSha256:assets.actor.sha256,houseSha256:assets.house.sha256,checks,oldClipped,rows,limitations:'Projected sampled axis-aligned bounding boxes, not full visibility/occlusion, GPU browser, or continuous swept proof.'};
await fs.writeFile(path.join(folder,'w39k-camera-report.json'),JSON.stringify(result,null,2),{flag:'wx'});
console.log(JSON.stringify({checks,oldClipped,rows:rows.map(r=>({shot:r.key,width:r.width,height:r.height,maxNdc:r.maxNdc,oldMaxNdc:r.oldMaxNdc,oldClippedCorners:r.oldClippedCorners}))}));
