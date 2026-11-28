/** W39j sampled fixed-world camera envelopes, exact W39c/W28 source digests.
 * Dimensions in metres after conversion from the independently measured mm bounds.
 * Frame the story, not the entire floor, in the two cutaway views.
 */
import * as THREE from 'three';
export const SHOTS={
 action:{bounds:[[-181,-36,-186],[1226,1567,1339]],direction:[1,.24,.15],margin:.86,cut:true},
 hands:{bounds:[[-181,810,-121],[880,1413,913]],direction:[1,.4,.18],margin:.88,cut:true},
 house:{bounds:[[-3680,-331,-2950],[3680,3765,8531]],direction:[1,.65,1],margin:.88,cut:false}
};
export function corners(bounds){
 const [a,b]=bounds;
 return Array.from({length:8},(_,i)=>new THREE.Vector3(...[0,1,2].map(j=>(i&(1<<j)?b[j]:a[j])*.001)));
}
export function cameraFrame(key,aspect){
 const s=SHOTS[key];
 if(!s||!Number.isFinite(aspect)||aspect<=0)throw Error('Invalid camera frame');
 const [lo,hi]=s.bounds;
 const target=new THREE.Vector3(...lo.map((v,i)=>(v+hi[i])*.0005));
 const direction=new THREE.Vector3(...s.direction).normalize();
 const right=new THREE.Vector3(0,1,0).cross(direction).normalize();
 const up=direction.clone().cross(right).normalize();
 const fov=42,tanV=Math.tan(THREE.MathUtils.degToRad(fov/2)),tanH=tanV*aspect;
 let distance=.5;
 for(const p of corners(s.bounds)){
  const q=p.sub(target);
  distance=Math.max(distance,q.dot(direction)+Math.max(Math.abs(q.dot(right))/(tanH*s.margin),Math.abs(q.dot(up))/(tanV*s.margin),.12));
 }
 distance+=.001;
 const eye=target.clone().addScaledVector(direction,distance);
 return {target,eye,distance,fov,near:.04,far:Math.max(50,distance*4),maxDistance:Math.max(14,distance*2.5)};
}
export function applyFrame(camera,key,aspect){
 const f=cameraFrame(key,aspect);
 camera.aspect=aspect;camera.fov=f.fov;camera.near=f.near;camera.far=f.far;
 camera.position.copy(f.eye);camera.lookAt(f.target);camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
 return f;
}
