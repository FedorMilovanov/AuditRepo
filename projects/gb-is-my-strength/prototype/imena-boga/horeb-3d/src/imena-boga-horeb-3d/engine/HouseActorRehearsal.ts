import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export type ActorPhase='off'|'loading'|'idle'|'performing'|'complete'|'failed';
export const HOUSE_ACTOR_PROFILES={
 canonical:{file:'horeb_mother_w22_candidate.glb',offset:[-.50,.015,.30],metric:'wrist-vertex',limit:.025},
 w28:{file:'w28-actor.glb',offset:[-.58,.015,.30],metric:'middle-skin-vertex',limit:.010},
 w28e:{file:'w28e-actor.glb',offset:[-.58,.015,.30],metric:'middle-skin-vertex',limit:.010},
 w28f:{file:'w28f-actor.glb',offset:[-.58,.015,.30],metric:'middle-skin-vertex',limit:.010},
 w28g:{file:'w28g-actor.glb',offset:[-.58,.015,.30],metric:'middle-skin-vertex',limit:.010},
} as const;
export type HouseActorProfile=typeof HOUSE_ACTOR_PROFILES[keyof typeof HOUSE_ACTOR_PROFILES];
const IDLE='Mother_QuietIdle',GESTURE='Mother_GestureTowardsBasket';
// Wrist proximity is a rehearsal witness, not a gripping or skin-contact proof.
const MIN_HOLD=.5;
function release(root:THREE.Object3D){
 const geos=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>(),skeletons=new Set<THREE.Skeleton>();
 root.traverse(o=>{
  const m=o as THREE.Mesh;if(!m.isMesh)return;
  geos.add(m.geometry);
  if((m as THREE.SkinnedMesh).isSkinnedMesh)skeletons.add((m as THREE.SkinnedMesh).skeleton);
  for(const mat of Array.isArray(m.material)?m.material:[m.material]){
   materials.add(mat);
   for(const v of Object.values(mat))if(v instanceof THREE.Texture)textures.add(v);
  }
 });
 skeletons.forEach(x=>x.dispose());geos.forEach(x=>x.dispose());materials.forEach(x=>x.dispose());textures.forEach(x=>x.dispose());
 root.removeFromParent();
}
/** Isolated, opt-in rehearsal. Actual rig and rim remain in the same scene.
 * No invented action or claim of an approved character/child performance. */
export function createHouseActorRehearsal(scene:THREE.Scene,house:THREE.Group,canvas:HTMLCanvasElement,onPhase:(v:ActorPhase)=>void,profile:HouseActorProfile=HOUSE_ACTOR_PROFILES.canonical){
 let phase:ActorPhase='off',actor:THREE.Group|null=null,mixer:THREE.AnimationMixer|null=null,idle:THREE.AnimationAction|null=null,gesture:THREE.AnimationAction|null=null,wrist:THREE.Object3D|null=null;
 let generation=0,disposed=false,min=Infinity,max=0,hold=0,previousSample:number|null=null;
 let skinSamples:{mesh:THREE.SkinnedMesh;indices:number[]}|null=null;
 const samplePos=new THREE.Vector3();
 function locateMiddleSkin(root:THREE.Group):{mesh:THREE.SkinnedMesh;indices:number[]}|null{
  let found:{mesh:THREE.SkinnedMesh;indices:number[]}|null=null;
  root.traverse(o=>{
   const mesh=o as THREE.SkinnedMesh;
   if(!mesh.isSkinnedMesh||!mesh.name.startsWith('ANATOMICAL_ADULT_WOMAN'))return;
   const indices:number[]=[],si=mesh.geometry.getAttribute('skinIndex'),sw=mesh.geometry.getAttribute('skinWeight');
   const groups=mesh.skeleton.bones.map(b=>b.name==='hand_l'?0:/^(thumb|index|middle|ring|pinky)_0[123]_l$/.test(b.name)?['thumb','index','middle','ring','pinky'].indexOf(b.name.split('_')[0])+1:-1);
   for(let i=0;i<si.count;i++){
    const sums=[0,0,0,0,0,0];
    for(let k=0;k<4;k++){
     const g=groups[si.getComponent(i,k)];
     if(g>=0)sums[g]+=sw.getComponent(i,k);
    }
    if(sums.reduce((a,b)=>a+b,0)>=.45&&sums.indexOf(Math.max(...sums))===3)indices.push(i);
   }
   if(indices.length)found={mesh,indices};
  });
  return found;
 }
 const rimPoints:THREE.Vector3[]=[];
 const rim=house.getObjectByName('Basket_thick_lipped_rim');
 rim?.updateWorldMatrix(true,true);
 rim?.traverse(o=>{
  const m=o as THREE.Mesh;if(!m.isMesh)return;
  const p=m.geometry.getAttribute('position');
  for(let i=0;i<p.count;i++)rimPoints.push(new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(m.matrixWorld));
 });
 const report=(next:ActorPhase)=>{
  phase=next;canvas.dataset.houseActorPhase=next;if(!disposed)onPhase(next);
 };
 function resetContact(){
  min=Infinity;max=0;hold=0;previousSample=null;
  for(const k of ['houseActorContactMm','houseActorWorstMm','houseActorHoldSeconds','houseActorTime','houseActorFrameExtent'])delete canvas.dataset[k];
 }
 function sample(time:number,camera:THREE.PerspectiveCamera){
  if(!wrist||!rimPoints.length)return;
  wrist.updateWorldMatrix(true,false);
  let d2=Infinity;
  if(profile.metric==='middle-skin-vertex'){
   if(!skinSamples||!actor)return;
   actor.updateWorldMatrix(true,true);
   for(const i of skinSamples.indices){
    skinSamples.mesh.getVertexPosition(i,samplePos).applyMatrix4(skinSamples.mesh.matrixWorld);
    for(const p of rimPoints)d2=Math.min(d2,samplePos.distanceToSquared(p));
   }
  }else{
   wrist.getWorldPosition(samplePos);
   for(const p of rimPoints)d2=Math.min(d2,samplePos.distanceToSquared(p));
  }
  const distance=Math.sqrt(d2);
  min=Math.min(min,distance);max=Math.max(max,distance);
  if(distance<profile.limit&&previousSample!==null)hold+=Math.max(0,time-previousSample);
  else if(distance>=profile.limit)hold=0;
  previousSample=distance<profile.limit?time:null;
  canvas.dataset.houseActorContactMm=(min*1000).toFixed(2);
  canvas.dataset.houseActorWorstMm=(max*1000).toFixed(2);
  canvas.dataset.houseActorHoldSeconds=hold.toFixed(3);
  if(actor&&time>=2.3&&!canvas.dataset.houseActorFrameExtent){
   actor.updateWorldMatrix(true,true);
   const box=new THREE.Box3().setFromObject(actor,true);
   for(const p of rimPoints)box.expandByPoint(p);
   let extent=0,valid=true;
   for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){
    const v=new THREE.Vector3(x,y,z).project(camera);
    extent=Math.max(extent,Math.abs(v.x),Math.abs(v.y));valid=valid&&v.z>=-1&&v.z<=1;
   }
   canvas.dataset.houseActorFrameExtent=valid?extent.toFixed(4):'outside';
  }
 }
 function finished(e:{action:THREE.AnimationAction}){
  if(phase!=='performing'||e.action!==gesture)return;
  gesture?.stop();idle?.reset().play();
  report(max<profile.limit&&hold>=MIN_HOLD?'complete':'failed');
 }
 function cancel(){
  if(phase!=='performing')return;
  gesture?.stop();idle?.reset().play();resetContact();report('idle');
 }
 function clear(){
  generation++;
  if(mixer){mixer.removeEventListener('finished',finished);mixer.stopAllAction();if(actor)mixer.uncacheRoot(actor);}
  if(actor)release(actor);
  actor=null;mixer=null;idle=null;gesture=null;wrist=null;skinSamples=null;
  resetContact();for(const k of ['houseActorBones','houseActorSkinned','houseActorContactMetric','houseActorSkinSamples'])delete canvas.dataset[k];
  report('off');
 }
 async function enable(){
  if(disposed||phase!=='off')return;
  const token=++generation;report('loading');
  try{
   const gltf=await new GLTFLoader().loadAsync(new URL('./artlab/'+profile.file,location.href).href);
   if(disposed||token!==generation){release(gltf.scene);return;}
   actor=gltf.scene;actor.position.set(profile.offset[0],profile.offset[1],profile.offset[2]);actor.name='HOUSE_MOTHER_REHEARSAL_ART_HOLD';
   let bones=0,skinned=0;
   actor.traverse(o=>{
    const m=o as THREE.SkinnedMesh;
    if(m.isMesh){m.castShadow=true;m.receiveShadow=true;}
    if(m.isSkinnedMesh){skinned++;bones=Math.max(bones,m.skeleton.bones.length);}
   });
   const a=gltf.animations.find(x=>x.name===IDLE),b=gltf.animations.find(x=>x.name===GESTURE);
   wrist=actor.getObjectByName('hand_l')||null;
   if(bones!==53||skinned<2||!a||!b||!wrist||!rimPoints.length)throw Error('Rig or rim contract failed');
   if(profile.metric==='middle-skin-vertex'){
    skinSamples=locateMiddleSkin(actor);
    if(!skinSamples)throw Error('Missing weighted middle finger surface');
    canvas.dataset.houseActorSkinSamples=String(skinSamples.indices.length);
   }
   canvas.dataset.houseActorContactMetric=profile.metric;
   scene.add(actor);mixer=new THREE.AnimationMixer(actor);idle=mixer.clipAction(a);gesture=mixer.clipAction(b);
   mixer.addEventListener('finished',finished);idle.play();
   canvas.dataset.houseActorBones=String(bones);canvas.dataset.houseActorSkinned=String(skinned);report('idle');
  }catch{if(token===generation&&!disposed){clear();report('failed');}}
 }
 function perform(){
  if(!gesture||!idle||!mixer||!['idle','complete'].includes(phase))return false;
  resetContact();
  idle.stop();gesture.reset().setEffectiveWeight(1).setEffectiveTimeScale(1).setLoop(THREE.LoopOnce,1);
  gesture.clampWhenFinished=true;gesture.play();report('performing');return true;
 }
 function tick(dt:number,camera:THREE.PerspectiveCamera){
  if(disposed||!mixer||document.hidden)return;
  mixer.update(Math.min(.075,Math.max(0,dt)));
  if(phase==='performing'&&gesture){
   canvas.dataset.houseActorTime=gesture.time.toFixed(3);
   if(gesture.time>=48/24&&gesture.time<=70/24)sample(gesture.time,camera);
  }
 }
 return {enable,clear,cancel,perform,tick,phase:()=>phase,present:()=>!!actor&&!!mixer,dispose:()=>{disposed=true;clear();delete canvas.dataset.houseActorPhase;}};
}
