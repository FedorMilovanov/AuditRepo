/** W15 — самостоятельный художественный ИГРОВОЙ пролог, а не музейный кадр.
 * Topology and villagers deliberately hypothetical. No geolocation claims.
 * Source boundary: Exodus 1:22 and 2:1–10.
 */
import * as THREE from 'three';
import {NILE_VILLAGE_HOUSES,NILE_VILLAGE_STEPS,NILE_VILLAGE_START,NILE_VILLAGE_APPROACHES,NILE_VILLAGE_PEOPLE,NILE_VILLAGE_TABLE,
 nileVillageCanWalk,beginNileVillageAction,advanceNileVillageAction,cancelNileVillageAction,
 restartNileVillageQuest,initialNileVillageQuest,type NileVillageQuest} from '../data/nileVillageQuest';
export type VillageDirection='forward'|'backward'|'left'|'right';
export type NileVillageController={
 start:()=>void;stop:()=>void;setDirection:(dir:VillageDirection,on:boolean)=>void;
 beginAction:(revision:number,step:number)=>boolean;restart:()=>void;
 getPosition:()=>{x:number;z:number};
 dispose:()=>void;
};
const rand=(n:number)=>{const v=Math.sin(n*41.73+2.1)*31217.53;return v-Math.floor(v);};
const height=(x:number,z:number)=>-.06+.045*Math.sin(x*.34+z*.16)+.027*Math.cos(z*.39-x*.13);
export function createNileVillage3D(
 canvas:HTMLCanvasElement,reducedMotion:boolean,
 onPosition:(x:number,z:number,yaw:number)=>void,
 onQuest:(quest:NileVillageQuest)=>void,
 initialQuest:NileVillageQuest=initialNileVillageQuest(),
 initialPosition?:{x:number;z:number},
):NileVillageController{
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.18;
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
 const scene=new THREE.Scene();
 scene.background=new THREE.Color(0xc3b3a0);
 scene.fog=new THREE.FogExp2(0xcab9a4,.011);
 const skyGeo=new THREE.SphereGeometry(90,32,16);
 const skyPos=skyGeo.getAttribute('position'),skyColors:number[]=[];
 for(let i=0;i<skyPos.count;i++){
   const t=THREE.MathUtils.clamp((skyPos.getY(i)/90+.23)/1.08,0,1);
   const c=new THREE.Color(0xe1b58c).lerp(new THREE.Color(0x96adbd),t);
   skyColors.push(c.r,c.g,c.b);
 }
 skyGeo.setAttribute('color',new THREE.Float32BufferAttribute(skyColors,3));
 scene.add(new THREE.Mesh(skyGeo,new THREE.MeshBasicMaterial({
   vertexColors:true,side:THREE.BackSide,depthWrite:false,fog:false
 })));
 const camera=new THREE.PerspectiveCamera(64,1,.08,115);
 scene.add(new THREE.HemisphereLight(0xffe9cc,0x645e51,2.05));
 const sun=new THREE.DirectionalLight(0xffd8a2,2.45);
 sun.position.set(-8,14,-9);scene.add(sun);
 const mat=(hex:number,roughness=.96)=>new THREE.MeshStandardMaterial({color:hex,roughness});
 const plaster=[mat(0xb9a080),mat(0xc3a887),mat(0xa98e70),mat(0xc1a47e)];
 const clay=mat(0x81624b),roof=mat(0x8e785e),wood=mat(0x5b4936),cloth=mat(0xb5a18a);
 const sedgeMat=mat(0x626f42),reedTip=mat(0x95854a);
 const skin=mat(0xb69176),dark=mat(0x42362b);
 const groundGeo=new THREE.PlaneGeometry(27,60,30,62);
 groundGeo.rotateX(-Math.PI/2);
 const pos=groundGeo.getAttribute('position');
 const colors:number[]=[];
 for(let i=0;i<pos.count;i++){
   const x=pos.getX(i)+5.5,z=pos.getZ(i)-5;
   pos.setY(i,height(x,z));
   const varCol=.90+.11*rand(i*2.93);
   const wet=Math.max(0,Math.min(1,(x+7.1)/7.3));
   const c=new THREE.Color(0x97896f).lerp(new THREE.Color(0xc1a47d),wet);
   c.multiplyScalar(varCol);colors.push(c.r,c.g,c.b);
 }
 groundGeo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
 groundGeo.computeVertexNormals();
 // Original procedural, periodic fine soil + plaster texture. Cheap and
 // reusable: no tile network request, no external image rights or geography.
 function makeGrainTexture(bricks:boolean):THREE.DataTexture{
   const size=128,pixels=new Uint8Array(size*size*4);
   for(let y=0;y<size;y++)for(let x=0;x<size;x++){
     const wave=Math.sin(x*.53+y*.24)*3+Math.cos(x*.16-y*.39)*4;
     const grain=(rand(x*59+y*373)-.5)*24;
     let v=231+wave+grain;
     if(bricks){
       const row=Math.floor(y/20),mortar=y%20<1||((x+(row%2)*13)%29)<1;
       if(mortar)v-=24;
       else v+=3;
     }
     v=THREE.MathUtils.clamp(v,187,255);
     const i=(y*size+x)*4;
     pixels[i]=Math.round(v);pixels[i+1]=Math.round(v);
     pixels[i+2]=Math.round(v);pixels[i+3]=255;
   }
   const tex=new THREE.DataTexture(pixels,size,size,THREE.RGBAFormat);
   tex.colorSpace=THREE.SRGBColorSpace;
   tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
   tex.repeat.set(bricks?2:9,bricks?2:15);
   tex.generateMipmaps=true;tex.minFilter=THREE.LinearMipmapLinearFilter;
   tex.magFilter=THREE.LinearFilter;tex.needsUpdate=true;return tex;
 }
 const soilTexture=makeGrainTexture(false),brickTexture=makeGrainTexture(true);
 plaster.forEach(m=>{m.map=brickTexture;m.bumpMap=brickTexture;m.bumpScale=.013;});
 const ground=new THREE.Mesh(groundGeo,new THREE.MeshStandardMaterial({
   vertexColors:true,roughness:1,side:THREE.DoubleSide,
   map:soilTexture,bumpMap:soilTexture,bumpScale:.022,
 }));
 ground.position.set(5.5,0,-5);ground.name='nile-village-walkable-soil';scene.add(ground);
 const water=new THREE.Mesh(new THREE.PlaneGeometry(19,59),mat(0x537077,.42));
 water.rotation.x=-Math.PI/2;water.position.set(-16.8,-.205,-5);
 water.name='nile-village-water';scene.add(water);
 const farbank=new THREE.Mesh(new THREE.PlaneGeometry(16,60),mat(0x9e9274));
 farbank.rotation.x=-Math.PI/2;farbank.position.set(-33.2,-.19,-5);scene.add(farbank);
 // An irregular chain of subtly compacted patches leads from the houses to the reeds.
 const trailMat=new THREE.MeshStandardMaterial({color:0xd2b38a,transparent:true,opacity:.23,roughness:1,depthWrite:false});
 const track=[[4,17],[4.2,12],[5.8,8],[5.7,3],[3,-2],[.8,-6],[-2.6,-10.8],[-5.4,-16]];
 for(let i=0;i<track.length-1;i++){
   const [ax,az]=track[i],[bx,bz]=track[i+1],n=11;
   for(let k=0;k<=n;k++){
     const t=k/n,x=ax+(bx-ax)*t,z=az+(bz-az)*t;
     const flat=new THREE.Mesh(new THREE.CircleGeometry(.72+.11*rand(i*17+k),9),trailMat);
     flat.rotation.x=-Math.PI/2;flat.position.set(x,height(x,z)+.018,z);
     flat.scale.set(1.2,.81,1);scene.add(flat);
   }
 }
 // Mudbrick village: several distinct low houses, flat beams, door recesses,
 // courtyard storage jars and cloth shade. Architecture is NOT a claimed site.
 const boxes=(w:number,h:number,d:number,m:THREE.Material,x:number,y:number,z:number,parent:THREE.Object3D=scene)=>{
   const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
   mesh.position.set(x,y,z);parent.add(mesh);return mesh;
 };
 NILE_VILLAGE_HOUSES.forEach((h,i)=>{
   const base=height(h.x,h.z);
   boxes(h.w,h.h,h.d,plaster[i%plaster.length],h.x,base+h.h/2,h.z);
   boxes(h.w+.21,.18,h.d+.21,roof,h.x,base+h.h+.04,h.z);
   // Dark doorway facing the central open street.
   const facing=h.x>5?-1:1;
   const doorX=h.x+facing*(h.w/2+.016);
   boxes(.045,1.93,.94,dark,doorX,base+.965,h.z+.23);
   boxes(.11,.19,1.06,wood,doorX,base+2.05,h.z+.23);
   boxes(.075,.62,.48,wood,doorX,base+2.68,h.z-.83);
   // A shaded small courtyard gives readable architectural hierarchy.
   const awningX=h.x+(h.x>5?-1:1)*(h.w/2+.72);
   boxes(1.35,.10,h.d*.65,cloth,awningX,base+2.19,h.z);
   for(let k of [-1,1]){
     const pillar=new THREE.Mesh(new THREE.CylinderGeometry(.055,.07,2.16,7),wood);
     pillar.position.set(awningX+(h.x>5?-.5:.5),base+1.08,h.z+k*h.d*.28);scene.add(pillar);
   }
   // Roof line beams, variation in facade and a jar in the courtyard.
   for(let k=0;k<3;k++)boxes(h.w+.17,.09,.07,wood,h.x,base+h.h+.18,h.z-h.d*.3+k*h.d*.3);
   const jarX=h.x+(h.x>5?-(h.w/2+1):(h.w/2+1));
   const jarZ=h.z+h.d*.26;
   const jar=new THREE.Mesh(new THREE.LatheGeometry([
     new THREE.Vector2(.20,0),new THREE.Vector2(.30,.08),
     new THREE.Vector2(.37,.39),new THREE.Vector2(.32,.72),
     new THREE.Vector2(.18,.88)],9),clay);
   jar.position.set(jarX,height(jarX,jarZ),jarZ);scene.add(jar);
 });
 // Low retaining walls and household objects. None blocks the player's trail.
 for(const [x,z,w] of [[-1,19,2.7],[10,10,1.8],[11,-9,2.3]]){
   boxes(w,.68,.28,clay,x,height(x,z)+.34,z);
 }
 const tableX=NILE_VILLAGE_TABLE.x,tableZ=NILE_VILLAGE_TABLE.z-1;
 boxes(1.6,.13,.82,wood,tableX,height(tableX,tableZ)+.78,tableZ+1);
 for(const x of [5.37,6.63])for(const z of [3.3,4.68])
   boxes(.11,.78,.11,wood,x,height(x,z)+.39,z);
 // Papyrus reeds by the actual bank. Small dense region screens the cradle.
 const stemCount=170,rays=8;
 const stems=new THREE.InstancedMesh(new THREE.CylinderGeometry(.012,.025,1,5),sedgeMat,stemCount);
 const umbel=new THREE.InstancedMesh(new THREE.CylinderGeometry(.0028,.004,1,3),sedgeMat,stemCount*rays);
 const seedHeads=new THREE.InstancedMesh(new THREE.SphereGeometry(.012,5,4),reedTip,stemCount*rays);
 const tmp=new THREE.Object3D(),up=new THREE.Vector3(0,1,0);
 const source=new THREE.Vector3(),tip=new THREE.Vector3();
 const patches=[-23.7,-17,-8.5,1.7,8.8];
 for(let i=0;i<stemCount;i++){
   const anchor=patches[i%patches.length];
   let z=anchor+(rand(i*4.11)-.5)*4.4;
   let x=-7.12+rand(i*8.17)*1.6;
   if(Math.abs(z+16.1)<1.45&&x> -6.45)x=-6.75-rand(i*2.4)*.18;
   const h=1.35+rand(i*1.55)*1.56,y=height(x,z);
   tmp.position.set(x,y+h*.5,z);tmp.rotation.set(.025*rand(i),0,.036*rand(i+3));
   tmp.scale.set(1,h,1);tmp.updateMatrix();stems.setMatrixAt(i,tmp.matrix);
   source.set(x,y+h,z);
   for(let j=0;j<rays;j++){
     const a=j*2*Math.PI/rays+rand(i*3)*.35;
     const radius=.28+.21*rand(i*17+j*3);
     tip.set(x+Math.cos(a)*radius,y+h-.20-rand(j+i*11)*.17,
       z+Math.sin(a)*radius);
     const delta=tip.clone().sub(source),idx=i*rays+j;
     tmp.position.copy(source).add(tip).multiplyScalar(.5);
     tmp.quaternion.setFromUnitVectors(up,delta.clone().normalize());
     tmp.scale.set(1,delta.length(),1);tmp.updateMatrix();umbel.setMatrixAt(idx,tmp.matrix);
     tmp.position.copy(tip);tmp.quaternion.identity();
     tmp.scale.setScalar(.65+rand(idx)*.6);tmp.updateMatrix();
     seedHeads.setMatrixAt(idx,tmp.matrix);
   }
 }
 for(const mesh of [stems,umbel,seedHeads])mesh.instanceMatrix.needsUpdate=true;
 scene.add(stems,umbel,seedHeads);
 // Simplified original human silhouettes. Dialogue and exact historical dress
 // are not asserted. A family member, town messenger and sister are distinct.
 const figures:THREE.Group[]=[];
 NILE_VILLAGE_PEOPLE.forEach(({x,z,color:c},i)=>{
   const group=new THREE.Group();
   group.position.set(x,height(x,z),z);group.name=['anonymous-townsperson','mother-silhouette','household-helper','sister-silhouette'][i];
   const dress=mat(c);
   const gown=new THREE.Mesh(new THREE.CylinderGeometry(.19,.39,i===3?1.04:1.17,12),dress);
   gown.position.y=i===3?.54:.63;group.add(gown);
   const head=new THREE.Mesh(new THREE.SphereGeometry(i===3?.18:.215,12,9),skin);
   head.position.y=i===3?1.32:1.53;group.add(head);
   const hair=new THREE.Mesh(new THREE.SphereGeometry(.219,12,8,0,Math.PI*2,0,Math.PI*.52),dark);
   hair.position.copy(head.position);hair.position.y+=.065;group.add(hair);
   for(const sign of [-1,1]){
     const arm=new THREE.Mesh(new THREE.CylinderGeometry(.08,.11,.83,7),dress);
     arm.position.set(sign*.28,1.05,.02);arm.rotation.z=sign*.26;group.add(arm);
   }
   group.rotation.y=i===3?.8:-.6;scene.add(group);figures.push(group);
 });
 const weave=mat(0x826342),sealing=mat(0x3c3029),bundle=mat(0xe7d4b9);
 sealing.transparent=true;bundle.transparent=true;
 function createCradle(){
   const g=new THREE.Group();
   const boat=new THREE.Mesh(new THREE.SphereGeometry(1,16,10,0,Math.PI*2,Math.PI*.48,Math.PI*.52),weave);
   boat.scale.set(.49,.27,.32);boat.position.y=.24;g.add(boat);
   const rim=new THREE.Mesh(new THREE.TorusGeometry(.48,.035,5,24),weave);
   rim.rotation.x=Math.PI/2;rim.scale.set(1,.68,1);rim.position.y=.25;g.add(rim);
   const pitch=new THREE.Mesh(new THREE.TorusGeometry(.50,.038,5,30),sealing);
   pitch.rotation.x=Math.PI/2;pitch.scale.set(1,.68,1);pitch.position.y=.14;
   g.add(pitch);pitch.name='waterproof-pitch';
   const wrapped=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),bundle);
   wrapped.scale.set(.31,.14,.20);wrapped.position.y=.29;wrapped.name='wrapped-infant';
   g.add(wrapped);return g;
 }
 // One world prop for the entire chapter; camera attachment is an explicit
 // first-person carry proxy, NOT a rigged hand/child performance or ART pass.
 const basket=createCradle();basket.name='nile-story-basket';scene.add(basket);scene.add(camera);
 const tablePosition=new THREE.Vector3(tableX,height(tableX,tableZ)+.89,tableZ+1);
 const carriedPosition=new THREE.Vector3(.32,-.52,-1.10);
 const riverPosition=new THREE.Vector3(-6.25,height(-6.25,-16.7)+.02,-16.7);
 const riverRotation=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),.48);
 const pitch=basket.getObjectByName('waterproof-pitch')!;
 const baby=basket.getObjectByName('wrapped-infant')!;
 const identity=new THREE.Quaternion();
 const transferStart=new THREE.Vector3(),transferEnd=new THREE.Vector3();
 const transferRotationStart=new THREE.Quaternion(),transferRotationEnd=new THREE.Quaternion();
 let transferring=false;
 const basketWitness=(mode:string)=>{
  canvas.dataset.villageBasketMode=mode;
  canvas.dataset.villageBasketId=basket.uuid;
  let count=0;scene.traverse(o=>{if(o.name==='nile-story-basket')count++;});
  canvas.dataset.villageBasketInstances=String(count);
 };
 const applyBasket=(step:number)=>{
  transferring=false;
  pitch.visible=step>=3;sealing.opacity=1;sealing.depthWrite=true;
  baby.visible=step>=4;bundle.opacity=1;bundle.depthWrite=true;
  const carried=step===4,bank=step>=5;
  (carried?camera:scene).add(basket);
  basket.position.copy(carried?carriedPosition:bank?riverPosition:tablePosition);
  basket.quaternion.copy(bank?riverRotation:identity);
  basket.scale.setScalar(1);
  basketWitness(carried?'carried':bank?'bank':'table');
 };
 // A physical, world-space destination marker for the CURRENT meaningful act.
 const marker=new THREE.Mesh(new THREE.RingGeometry(.43,.55,36),
   new THREE.MeshBasicMaterial({color:0xd7af6a,transparent:true,opacity:.86,side:THREE.DoubleSide,depthWrite:false}));
 marker.rotation.x=-Math.PI/2;scene.add(marker);
 let quest=cancelNileVillageAction(initialQuest),active=false,disposed=false,dragPointer:number|null=null,px=0,py=0,last=0,frame=0;
 const movement:Record<VillageDirection,boolean>={forward:false,backward:false,left:false,right:false};
 const walk:{x:number;z:number;yaw:number;pitch:number}={...NILE_VILLAGE_START};
 if(initialPosition&&nileVillageCanWalk(initialPosition.x,initialPosition.z)){
  walk.x=initialPosition.x;walk.z=initialPosition.z;
 }
 const publishQuest=()=>{
  canvas.dataset.villageStep=String(quest.step);
  canvas.dataset.villageAction=quest.pending?NILE_VILLAGE_STEPS[quest.step].id:'idle';
  onQuest(quest);
 };
 const applyCommitted=()=>{
  const target=NILE_VILLAGE_STEPS[quest.step];
  marker.visible=!!target;
  const approach=NILE_VILLAGE_APPROACHES[quest.step];
  if(target&&approach)marker.position.set(approach.x,height(approach.x,approach.z)+.11,approach.z);
  applyBasket(quest.step);basket.visible=active||quest.step!==4;
  publishQuest();
 };
 applyCommitted();
 const setDirection=(dir:VillageDirection,on:boolean)=>{movement[dir]=active&&!quest.pending&&on;};
 const clearMovement=()=>{for(const d of Object.keys(movement) as VillageDirection[])movement[d]=false;};
 const getPosition=()=>({x:walk.x,z:walk.z});
 const syncWalkCamera=()=>{
  camera.position.set(walk.x,height(walk.x,walk.z)+1.69,walk.z);
  camera.rotation.set(walk.pitch,walk.yaw,0,'YXZ');
  camera.updateMatrixWorld(true);
 };
 const start=()=>{
  if(disposed||active)return;
  active=true;clearMovement();last=0;basket.visible=true;
  canvas.dataset.villageMode='walk';syncWalkCamera();onPosition(walk.x,walk.z,walk.yaw);
 };
 const abortAction=()=>{
  const cancelled=cancelNileVillageAction(quest);
  if(cancelled===quest)return;
  quest=cancelled;applyCommitted();
 };
 const stop=()=>{
  active=false;clearMovement();dragPointer=null;abortAction();
  basket.visible=quest.step!==4;onPosition(walk.x,walk.z,walk.yaw);canvas.dataset.villageMode='preview';
 };
 const restart=()=>{
  if(disposed)return;
  clearMovement();dragPointer=null;
  Object.assign(walk,NILE_VILLAGE_START);quest=restartNileVillageQuest(quest);
  last=0;applyCommitted();syncWalkCamera();onPosition(walk.x,walk.z,walk.yaw);
 };
 const beginAction=(revision:number,step:number)=>{
  if(disposed||!active||document.hidden)return false;
  const next=beginNileVillageAction(quest,revision,step,walk.x,walk.z,reducedMotion);
  if(next===quest)return false;
  quest=next;clearMovement();dragPointer=null;last=0;
  if(step===2){pitch.visible=true;sealing.opacity=0;sealing.depthWrite=false;}
  if(step===3||step===4){
   syncWalkCamera();scene.updateMatrixWorld(true);
   basket.getWorldPosition(transferStart);basket.getWorldQuaternion(transferRotationStart);
   if(step===3){
    transferEnd.copy(carriedPosition);camera.localToWorld(transferEnd);
    camera.getWorldQuaternion(transferRotationEnd);
    baby.visible=true;bundle.opacity=0;bundle.depthWrite=false;
   }else{transferEnd.copy(riverPosition);transferRotationEnd.copy(riverRotation);}
   scene.attach(basket);transferring=true;basketWitness('transfer');
  }
  publishQuest();return true;
 };
 const advanceAction=(seconds:number)=>{
  if(!quest.pending)return;
  const before=quest.pending;
  quest=advanceNileVillageAction(quest,seconds);
  const p=quest.pending?quest.pending.elapsed/before.duration:1;
  const eased=p*p*(3-2*p);
  if(before.step===2)sealing.opacity=eased;
  if(before.step===3){bundle.opacity=Math.min(1,p*2.5);bundle.depthWrite=bundle.opacity>=1;}
  if(transferring){
   basket.position.lerpVectors(transferStart,transferEnd,eased);
   if(!reducedMotion)basket.position.y+=.12*Math.sin(Math.PI*eased);
   basket.quaternion.copy(transferRotationStart).slerp(transferRotationEnd,eased);
  }
  if(!quest.pending)applyCommitted();
 };
 const onVisibility=()=>{if(document.hidden){clearMovement();dragPointer=null;abortAction();last=0;}};
 const keyToDir=(key:string):VillageDirection|null=>({
   w:'forward',arrowup:'forward',s:'backward',arrowdown:'backward',
   a:'left',arrowleft:'left',d:'right',arrowright:'right'
 } as Record<string,VillageDirection>)[key.toLowerCase()]||null;
 const keyDown=(e:KeyboardEvent)=>{
   if(!active||quest.pending||e.altKey||e.ctrlKey||e.metaKey||
    (e.target instanceof HTMLElement&&e.target.matches('input,textarea,select,[contenteditable=true]')))return;
   const dir=keyToDir(e.key);if(dir){e.preventDefault();movement[dir]=true;}
 };
 const keyUp=(e:KeyboardEvent)=>{const dir=keyToDir(e.key);if(dir){movement[dir]=false;}};
 const pointerDown=(e:PointerEvent)=>{
   if(!active||quest.pending||e.button!==0||dragPointer!==null||
     (e.pointerType==='touch'&&!e.isPrimary))return;
   dragPointer=e.pointerId;px=e.clientX;py=e.clientY;canvas.setPointerCapture(e.pointerId);
 };
 const pointerMove=(e:PointerEvent)=>{
   if(!active||quest.pending||dragPointer!==e.pointerId)return;
   walk.yaw-=THREE.MathUtils.clamp(e.clientX-px,-135,135)*.0037;
   walk.pitch=THREE.MathUtils.clamp(walk.pitch-(e.clientY-py)*.003,-.75,.55);
   px=e.clientX;py=e.clientY;
 };
 const pointerUp=(e:PointerEvent)=>{
   if(e.pointerId!==dragPointer)return;dragPointer=null;
   if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
 };
 const resize=()=>{if(disposed)return;
   const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);
   camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
 };
 const resizer=new ResizeObserver(resize);resizer.observe(canvas);resize();
 window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);
 window.addEventListener('blur',clearMovement);document.addEventListener('visibilitychange',onVisibility);
 canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointermove',pointerMove);
 canvas.addEventListener('pointerup',pointerUp);canvas.addEventListener('pointercancel',pointerUp);canvas.addEventListener('lostpointercapture',pointerUp);
 let lastNotice=0;
 const render=(now:number)=>{
   if(disposed)return;frame=requestAnimationFrame(render);
   const seconds=last?Math.max(0,(now-last)/1000):0;last=now;
   const elapsed=Math.min(.045,seconds);
   if(active){
     const f=Number(movement.forward)-Number(movement.backward),r=Number(movement.right)-Number(movement.left);
     const speed=2.85*elapsed/Math.max(1,Math.hypot(f,r));
     const dx=(-Math.sin(walk.yaw)*f+Math.cos(walk.yaw)*r)*speed;
     const dz=(-Math.cos(walk.yaw)*f-Math.sin(walk.yaw)*r)*speed;
     // Axis-separated conservative collision, avoids tunnelling through houses.
     if(nileVillageCanWalk(walk.x+dx,walk.z))walk.x+=dx;
     if(nileVillageCanWalk(walk.x,walk.z+dz))walk.z+=dz;
     syncWalkCamera();
     if(!document.hidden)advanceAction(seconds);
     if(now-lastNotice>160){lastNotice=now;onPosition(walk.x,walk.z,walk.yaw);}
   }else{
     camera.position.set(3.9,height(3.9,18)+1.85,18);
     camera.lookAt(4.2,1.5,3);
   }
   if(marker.visible)marker.material instanceof THREE.MeshBasicMaterial &&
     (marker.material.opacity=.69+(reducedMotion?0:.14*Math.sin(now*.002)));
   if(!reducedMotion&&active)figures.forEach((g,i)=>{g.rotation.y=(i===3?.8:-.6)+.045*Math.sin(now*.00065+i);});
   canvas.dataset.villageX=walk.x.toFixed(3);canvas.dataset.villageZ=walk.z.toFixed(3);
   canvas.dataset.villageYaw=walk.yaw.toFixed(4);
   canvas.dataset.villageRendered='true';
   renderer.render(scene,camera);
 };
 canvas.dataset.villageMode='preview';canvas.dataset.villageScene='mudbrick-homes-to-reeds';
 frame=requestAnimationFrame(render);
 return {start,stop,setDirection,beginAction,restart,getPosition,dispose:()=>{
   disposed=true;cancelAnimationFrame(frame);
   window.removeEventListener('keydown',keyDown);window.removeEventListener('keyup',keyUp);
   window.removeEventListener('blur',clearMovement);document.removeEventListener('visibilitychange',onVisibility);
   canvas.removeEventListener('pointerdown',pointerDown);canvas.removeEventListener('pointermove',pointerMove);
   canvas.removeEventListener('pointerup',pointerUp);canvas.removeEventListener('pointercancel',pointerUp);canvas.removeEventListener('lostpointercapture',pointerUp);
   resizer.disconnect();
   const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();
   scene.traverse(obj=>{
     const mesh=obj as THREE.Mesh;
     if(mesh.isMesh){geometries.add(mesh.geometry);
       const mats=Array.isArray(mesh.material)?mesh.material:[mesh.material];
       mats.forEach(m=>materials.add(m));}
   });
   geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
   soilTexture.dispose();brickTexture.dispose();
   renderer.dispose();renderer.forceContextLoss();
   delete canvas.dataset.villageMode;delete canvas.dataset.villageRendered;
   delete canvas.dataset.villageX;delete canvas.dataset.villageZ;delete canvas.dataset.villageYaw;
   delete canvas.dataset.villageStep;delete canvas.dataset.villageScene;delete canvas.dataset.villageAction;
   delete canvas.dataset.villageBasketMode;delete canvas.dataset.villageBasketInstances;delete canvas.dataset.villageBasketId;
 }} satisfies NileVillageController;
}
