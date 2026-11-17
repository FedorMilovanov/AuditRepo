/**
 * W11A — the first independent walkable Midian environment (Ex 2:16–17).
 * An artistic world, NOT an archaeological identification of the well.
 */
import * as THREE from 'three';

export type MidianDirection = 'forward'|'backward'|'left'|'right';
export type MidianControl = {
  setExplore:(enabled:boolean)=>void;
  setMovement:(direction:MidianDirection,active:boolean)=>void;
  dispose:()=>void;
};
export const MIDIAN_BOUNDS={x:18,z:22,eye:1.68,speed:3.0} as const;
const hash=(n:number)=>{const v=Math.sin(n*127.19+23.72)*43758.5;return v-Math.floor(v);};
export function midianGround(x:number,z:number):number{
  const ridge=.37*Math.min(1,Math.max(0,(Math.abs(x)-8)/10))**2+
    .31*Math.min(1,Math.max(0,(Math.abs(z)-12)/10))**2;
  const alluvium=.11*Math.sin(x*.16+z*.11)+.065*Math.cos(x*.29-z*.15);
  const runoff=-.11*Math.exp(-Math.pow((x+5.6+.4*Math.sin(z*.16))/1.65,2));
  return alluvium+ridge+runoff;
}
export function midianWalkable(x:number,z:number):boolean{
  if(!Number.isFinite(x)||!Number.isFinite(z)||Math.abs(x)>MIDIAN_BOUNDS.x||
      Math.abs(z)>MIDIAN_BOUNDS.z)return false;
  if(Math.hypot(x,z)<1.72)return false;
  if(Math.abs(x+2.9)<1.9&&Math.abs(z+.35)<1.1)return false;
  return true;
}
export function createMidianWell(canvas:HTMLCanvasElement,reducedMotion:boolean):MidianControl{
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.13;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0xb9b2a6);
  scene.fog=new THREE.FogExp2(0xb7ae9b,.009);
  const camera=new THREE.PerspectiveCamera(56,1,.1,125);
  camera.position.set(9,5.4,12);
  camera.lookAt(0,.6,0);
  scene.add(new THREE.HemisphereLight(0xf8e6cc,0x675b4b,1.9));
  const sun=new THREE.DirectionalLight(0xffddae,2.45);
  sun.position.set(-13,20,-8);
  sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);
  sun.shadow.camera.left=-24;sun.shadow.camera.right=24;
  sun.shadow.camera.top=24;sun.shadow.camera.bottom=-24;
  sun.shadow.normalBias=.04;
  scene.add(sun);
  const mat=(color:number,roughness=.96)=>new THREE.MeshStandardMaterial({color,roughness});
  const stone=[mat(0x938271),mat(0xb3a189),mat(0x8e8273),mat(0xc3aa8d)];
  const clay=[mat(0xa66e52),mat(0xc28e66),mat(0x99654c)];
  const groundGeo=new THREE.PlaneGeometry(56,66,92,100);
  groundGeo.rotateX(-Math.PI/2);
  const attr=groundGeo.getAttribute('position');
  const palette:number[]=[];
  const dry=new THREE.Color(0xb49e82),weathered=new THREE.Color(0x8d7866);
  for(let i=0;i<attr.count;i++){
    const x=attr.getX(i),z=attr.getZ(i);
    attr.setY(i,midianGround(x,z));
    const c=dry.clone().lerp(weathered,Math.min(1,Math.hypot(x,z)/30)*.69);
    c.multiplyScalar(.96+.06*Math.sin(x*.68-z*.29)*Math.cos(z*.4));
    palette.push(c.r,c.g,c.b);
  }
  groundGeo.setAttribute('color',new THREE.Float32BufferAttribute(palette,3));
  groundGeo.computeVertexNormals();
  const ground=new THREE.Mesh(groundGeo,new THREE.MeshStandardMaterial({
    vertexColors:true,roughness:1,side:THREE.DoubleSide,
  }));
  ground.name='midian-ground';
  ground.receiveShadow=true;
  scene.add(ground);
  const boulderGeo=new THREE.DodecahedronGeometry(1,1);
  const rockMat=[mat(0x908172),mat(0xa18d72),mat(0x81796c),mat(0xb49d80)];
  for(let i=0;i<82;i++){
    const a=hash(i*5.7)*Math.PI*2,r=10+hash(i*4.3+18)*19;
    const x=Math.cos(a)*r,z=Math.sin(a)*r*1.3;
    const k=.4+hash(i*1.97+7)*2.0;
    const rock=new THREE.Mesh(boulderGeo,rockMat[i%4]);
    rock.scale.set(k*1.4,k*.54,k*.94);
    rock.position.set(x,midianGround(x,z)+k*.24,z);
    rock.rotation.y=hash(i*.77)*Math.PI*2;
    rock.castShadow=i%4===0;
    rock.receiveShadow=true;
    scene.add(rock);
  }
  const shrubMesh=new THREE.IcosahedronGeometry(1,1),trunkGeo=new THREE.CylinderGeometry(.045,.09,1,6);
  const leafMat=[mat(0x657056),mat(0x778165),mat(0x5a654f)],trunkMat=mat(0x705d49);
  for(let i=0;i<42;i++){
    const a=hash(i*3.19+16)*Math.PI*2,r=5.5+hash(i*4.9+11)*18;
    const x=Math.cos(a)*r,z=Math.sin(a)*r;
    if(Math.hypot(x,z)<4.8)continue;
    const size=.45+hash(i*9.9+4)*.78;
    const trunk=new THREE.Mesh(trunkGeo,trunkMat);
    trunk.scale.y=size;
    trunk.position.set(x,midianGround(x,z)+size*.44,z);
    const crown=new THREE.Mesh(shrubMesh,leafMat[i%3]);
    crown.scale.set(size*.9,size*.51,size*.8);
    crown.position.set(x,midianGround(x,z)+size*1.1,z);
    crown.castShadow=i%4===0;
    scene.add(trunk,crown);
  }
  // Stone wells are known; this size, design and location are purely scenic.
  const well=new THREE.Group();
  well.name='midian-well';
  well.position.y=midianGround(0,0);
  scene.add(well);
  const water=new THREE.Mesh(new THREE.CylinderGeometry(1.02,1.02,.035,52),mat(0x2d484a,.24));
  water.position.y=.2;well.add(water);
  const brickGeo=new THREE.BoxGeometry(.52,.27,.39);
  for(let row=0;row<3;row++)for(let i=0;i<24;i++){
    const a=(i+(row%2)*.5)*Math.PI*2/24;
    const block=new THREE.Mesh(brickGeo,stone[(i+3*row)%4]);
    block.position.set(Math.cos(a)*1.18,.18+row*.275,Math.sin(a)*1.18);
    block.rotation.y=-a;
    block.castShadow=i%3===0;block.receiveShadow=true;well.add(block);
  }
  const copingGeo=new THREE.BoxGeometry(.58,.15,.48);
  for(let i=0;i<24;i++){
    const a=(i+.1)*Math.PI*2/24;
    const block=new THREE.Mesh(copingGeo,stone[(i+1)%4]);
    block.position.set(Math.cos(a)*1.18,.98,Math.sin(a)*1.18);
    block.rotation.y=-a;block.castShadow=i%3===0;well.add(block);
  }
  // Watering trough beside the well: a second physical obstacle.
  const trough=new THREE.Group();trough.name='midian-trough';
  trough.position.set(-2.9,midianGround(-2.9,-.35),-.35);
  scene.add(trough);
  const troughWater=new THREE.Mesh(new THREE.BoxGeometry(2.45,.035,.54),mat(0x668083,.35));
  troughWater.position.y=.19;trough.add(troughWater);
  for(const [x,z,sx,sz] of [[0,-.4,2.9,.28],[0,.4,2.9,.28],[-1.4,0,.28,.9],[1.4,0,.28,.9]]){
    const b=new THREE.Mesh(new THREE.BoxGeometry(sx,.42,sz),stone[1]);
    b.position.set(x,.19,z);b.castShadow=true;trough.add(b);
  }
  // Unlabelled pottery: not an assertion about number of daughters or jars.
  const profile=[new THREE.Vector2(.14,0),new THREE.Vector2(.29,.08),
    new THREE.Vector2(.31,.24),new THREE.Vector2(.23,.43),
    new THREE.Vector2(.18,.59),new THREE.Vector2(.19,.65)];
  const jarGeom=new THREE.LatheGeometry(profile,24);
  for(let i=0;i<5;i++){
    const a=i*1.9+.3,r=2.6+hash(i+21)*1.3;
    const x=Math.cos(a)*r,z=Math.sin(a)*r-1.3;
    const jar=new THREE.Mesh(jarGeom,clay[i%3]);
    jar.scale.setScalar(.8+hash(i*3)*.5);
    jar.position.set(x,midianGround(x,z),z);
    jar.castShadow=true;scene.add(jar);
  }
  const walk={x:5.2,z:7.6,yaw:.62,pitch:-.16};
  const moving:Record<MidianDirection,boolean>={forward:false,backward:false,left:false,right:false};
  let exploring=false,disposed=false,frame=0,last=0,dragId:number|null=null;
  let lastX=0,lastY=0;
  const clear=()=>{for(const k of Object.keys(moving) as MidianDirection[])moving[k]=false;};
  function setExplore(value:boolean){
    if(disposed)return;
    exploring=value;clear();last=0;
    if(value){walk.x=5.2;walk.z=7.6;walk.yaw=.62;walk.pitch=-.16;}
    canvas.dataset.midianMode=value?'walk':'shot';
  }
  function setMovement(d:MidianDirection,value:boolean){moving[d]=exploring&&value;}
  function rotate(dx:number,dy:number){
    if(!exploring)return;
    walk.yaw-=THREE.MathUtils.clamp(dx,-140,140)*.0038;
    walk.pitch=THREE.MathUtils.clamp(walk.pitch-THREE.MathUtils.clamp(dy,-120,120)*.003,-.7,.55);
  }
  function dir(k:string):MidianDirection|null{
    switch(k.toLowerCase()){
      case 'w':case 'arrowup':return 'forward';
      case 's':case 'arrowdown':return 'backward';
      case 'a':case 'arrowleft':return 'left';
      case 'd':case 'arrowright':return 'right';
      default:return null;
    }
  }
  function keyDown(e:KeyboardEvent){
    if(!exploring||e.altKey||e.ctrlKey||e.metaKey)return;
    const d=dir(e.key);if(!d)return;e.preventDefault();moving[d]=true;
  }
  function keyUp(e:KeyboardEvent){
    if(!exploring)return;const d=dir(e.key);if(!d)return;e.preventDefault();moving[d]=false;
  }
  function pointerDown(e:PointerEvent){
    if(!exploring||e.button!==0)return;
    dragId=e.pointerId;lastX=e.clientX;lastY=e.clientY;
    canvas.setPointerCapture(e.pointerId);
  }
  function pointerMove(e:PointerEvent){
    if(!exploring||dragId!==e.pointerId)return;
    rotate(e.clientX-lastX,e.clientY-lastY);
    lastX=e.clientX;lastY=e.clientY;
  }
  function pointerUp(e:PointerEvent){
    if(dragId!==e.pointerId)return;
    dragId=null;
    if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
  }
  function resize(){
    const bounds=canvas.getBoundingClientRect();
    const w=Math.max(1,Math.round(bounds.width)),h=Math.max(1,Math.round(bounds.height));
    renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  }
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
  window.addEventListener('keydown',keyDown);
  window.addEventListener('keyup',keyUp);
  window.addEventListener('blur',clear);
  canvas.addEventListener('pointerdown',pointerDown);
  canvas.addEventListener('pointermove',pointerMove);
  canvas.addEventListener('pointerup',pointerUp);
  canvas.addEventListener('pointercancel',pointerUp);
  function tick(now:number){
    if(disposed)return;
    frame=requestAnimationFrame(tick);
    if(exploring){
      const elapsed=last?Math.min(.05,Math.max(0,(now-last)/1000)):0;
      last=now;
      const forward=Number(moving.forward)-Number(moving.backward);
      const right=Number(moving.right)-Number(moving.left);
      const magnitude=Math.hypot(forward,right);
      if(magnitude>0){
        const step=MIDIAN_BOUNDS.speed*elapsed/magnitude;
        const dx=(-Math.sin(walk.yaw)*forward+Math.cos(walk.yaw)*right)*step;
        const dz=(-Math.cos(walk.yaw)*forward-Math.sin(walk.yaw)*right)*step;
        if(midianWalkable(walk.x+dx,walk.z))walk.x+=dx;
        if(midianWalkable(walk.x,walk.z+dz))walk.z+=dz;
      }
      const y=midianGround(walk.x,walk.z)+MIDIAN_BOUNDS.eye;
      camera.position.set(walk.x,y,walk.z);
      camera.lookAt(walk.x-Math.sin(walk.yaw)*Math.cos(walk.pitch),
        y+Math.sin(walk.pitch),walk.z-Math.cos(walk.yaw)*Math.cos(walk.pitch));
      canvas.dataset.midianX=walk.x.toFixed(3);
      canvas.dataset.midianZ=walk.z.toFixed(3);
      canvas.dataset.midianY=y.toFixed(3);
      canvas.dataset.midianGround=midianGround(walk.x,walk.z).toFixed(3);
      canvas.dataset.midianYaw=walk.yaw.toFixed(3);
    }else{
      last=0;camera.position.set(9,5.4,12);camera.lookAt(0,.6,0);
    }
    if(!document.hidden)renderer.render(scene,camera);
    canvas.dataset.midianRendered='true';
    if(!reducedMotion){ /* No fabricated human action is animated. */ }
  }
  canvas.dataset.midianWorld='well';
  canvas.dataset.midianMode='shot';
  canvas.dataset.midianWellStones='96';
  canvas.dataset.midianObstacle='well,water-trough';
  frame=requestAnimationFrame(tick);
  function dispose(){
    if(disposed)return;
    disposed=true;cancelAnimationFrame(frame);observer.disconnect();clear();
    window.removeEventListener('keydown',keyDown);
    window.removeEventListener('keyup',keyUp);
    window.removeEventListener('blur',clear);
    canvas.removeEventListener('pointerdown',pointerDown);
    canvas.removeEventListener('pointermove',pointerMove);
    canvas.removeEventListener('pointerup',pointerUp);
    canvas.removeEventListener('pointercancel',pointerUp);
    const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();
    scene.traverse(node=>{
      if(!(node instanceof THREE.Mesh))return;
      geometries.add(node.geometry);
      (Array.isArray(node.material)?node.material:[node.material]).forEach(m=>materials.add(m));
    });
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
    renderer.dispose();renderer.forceContextLoss();
    for(const k of Object.keys(canvas.dataset))if(k.startsWith('midian'))delete canvas.dataset[k];
  }
  return {setExplore,setMovement,dispose};
}
