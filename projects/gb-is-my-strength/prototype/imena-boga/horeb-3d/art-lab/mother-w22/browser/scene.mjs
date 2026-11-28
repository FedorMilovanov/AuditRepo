/** W39 browser composition: same coordinate system as independent CPU audit. */
import * as THREE from 'three';
export const TRACK='HOREB_W38_BasketFromSettledWorld';
export const ANCHOR='BASKET_OBJECT_ACTION_ANCHOR';
export const PHASES=[[0,'Подведение руки'],[1.5,'Наклон корзины'],[3.5,'Боковой перехват']];
export function bindBasket(house,actor,settle){
  house.updateMatrixWorld(true);actor.updateMatrixWorld(true);
  const anchor=house.getObjectByName(ANCHOR),track=actor.getObjectByName(TRACK);
  if(!anchor?.parent||!track)throw Error('Missing basket anchor or animation track');
  let meshCount=0;anchor.traverse(o=>{if(o.isMesh)meshCount++});
  if(meshCount!==92)throw Error('Wrong basket subtree: '+meshCount);
  if(!Number.isFinite(settle)||Math.abs(settle+.011000039951334027)>1e-10)throw Error('Unexpected settle offset');
  const original=anchor.matrixWorld.clone(),settled=new THREE.Matrix4().makeTranslation(0,settle,0).multiply(original);
  const inv=new THREE.Matrix4();
  anchor.matrixAutoUpdate=false;
  const sync=()=>{
    actor.updateMatrixWorld(true);
    anchor.parent.updateWorldMatrix(true,false);
    anchor.matrix.copy(inv.copy(anchor.parent.matrixWorld).invert().multiply(track.matrixWorld).multiply(settled));
    anchor.updateMatrixWorld(true);
  };
  sync();return {anchor,track,sync,settled,meshCount};
}
export function attachAction(actor,clip,basket){
  if(Math.abs(clip.duration-4.7)>1e-5)throw Error('Unexpected clip duration '+clip.duration);
  const mixer=new THREE.AnimationMixer(actor);
  const action=mixer.clipAction(clip).setLoop(THREE.LoopOnce,1);
  action.clampWhenFinished=true;
  const sample=(t)=>{
    const time=THREE.MathUtils.clamp(t,0,clip.duration);
    // Reset so seeking back from the clamped end is deterministic.
    action.reset().play();
    mixer.setTime(time);
    basket.sync();
    return time;
  };
  sample(0);
  return {mixer,action,sample,dispose(){mixer.stopAllAction();mixer.uncacheRoot(actor)}};
}
export function morphBudget(root,maxTextureSize=4096){
  const rows=[];root.traverse(o=>{
    if(!o.isMesh)return;
    const g=o.geometry,m=g.morphAttributes;
    const count=(m.position||m.normal||m.color||[]).length;
    if(!count)return;
    const stride=m.color?3:m.normal?2:1,vertices=g.attributes.position.count;
    const width=Math.min(vertices*stride,maxTextureSize),height=Math.ceil(vertices*stride/width);
    rows.push({name:o.name,vertices,count,estimatedGpuBytes:width*height*16*count});
  });
  return {rows,estimatedGpuBytes:rows.reduce((s,r)=>s+r.estimatedGpuBytes,0)};
}
