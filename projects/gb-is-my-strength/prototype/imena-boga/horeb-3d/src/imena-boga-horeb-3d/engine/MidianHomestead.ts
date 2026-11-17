/**
 * W12A pilot: a distinct, fully three-dimensional Midian household space.
 * Exodus 2:18–21 gives a family encounter but not the plan or fabric of a
 * dwelling. This is an original artistic encampment, NOT an excavated site.
 */
import * as THREE from 'three';
import type { MidianControl,MidianDirection } from './MidianWell.js';

export const HOMESTEAD_WALK=Object.freeze({
  maxX:18,maxZ:22,eye:1.68,speed:3.1,startX:0,startZ:10,
});
export const HOMESTEAD_STRUCTURE=Object.freeze({
  halfWidth:3.1,back:-3.0,front:3.0,doorHalfWidth:1.42,
  hearthX:-5.35,hearthZ:1.45,hearthRadius:.94,
});
const hash=(n:number)=>{const v=Math.sin(n*137.19+17.2)*47358.34;return v-Math.floor(v);};
export function homesteadGround(x:number,z:number):number{
  const outer=Math.min(1,Math.max(0,(Math.hypot(x,z)-9.8)/11));
  const slope=.045*Math.sin(x*.23+z*.13)+.048*Math.cos(z*.25-x*.1);
  const softened=slope*(.55+.45*outer);
  const terrace=.34*outer*outer;
  return softened+terrace-.065*Math.exp(-Math.pow((z-4.2)/2.8,2));
}
export function homesteadWalkable(x:number,z:number):boolean{
  if(!Number.isFinite(x)||!Number.isFinite(z)||Math.abs(x)>HOMESTEAD_WALK.maxX||
    Math.abs(z)>HOMESTEAD_WALK.maxZ)return false;
  const h=HOMESTEAD_STRUCTURE,margin=.18;
  // Canvas and supports form perimeter obstacles. Front doorway is open,
  // so the player can enter the REAL rendered interior without a teleport.
  if(Math.abs(Math.abs(x)-h.halfWidth)<margin&&z>h.back-margin&&z<h.front+margin)
    return false;
  if(Math.abs(z-h.back)<margin&&Math.abs(x)<h.halfWidth+margin)return false;
  if(Math.abs(z-h.front)<margin&&Math.abs(x)<h.halfWidth+margin&&
    Math.abs(x)>h.doorHalfWidth)return false;
  if(Math.hypot(x-h.hearthX,z-h.hearthZ)<h.hearthRadius)return false;
  if(Math.hypot(x-4.4,z+.85)<.67)return false;
  return true;
}
export function createMidianHomestead(canvas:HTMLCanvasElement,reducedMotion:boolean):MidianControl{
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(1.5,window.devicePixelRatio||1));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.07;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0xb5ada0);
  scene.fog=new THREE.FogExp2(0xb9b0a2,.010);
  const camera=new THREE.PerspectiveCamera(56,1,.08,130);
  scene.add(new THREE.HemisphereLight(0xf6e6d0,0x6a6255,1.82));
  const sun=new THREE.DirectionalLight(0xffdab1,2.08);
  sun.position.set(-10,18,13);
  sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
  sun.shadow.camera.left=-24;sun.shadow.camera.right=24;
  sun.shadow.camera.top=24;sun.shadow.camera.bottom=-24;
  sun.shadow.normalBias=.045;scene.add(sun);
  const mat=(color:number,roughness=1)=>new THREE.MeshStandardMaterial({color,roughness,metalness:0});
  const desert=new THREE.PlaneGeometry(64,64,96,96);
  desert.rotateX(-Math.PI/2);
  const attr=desert.getAttribute('position'),colors:number[]=[];
  const sand=new THREE.Color(0xb9a488),stoneTint=new THREE.Color(0x8c7868);
  for(let i=0;i<attr.count;i++){
    const x=attr.getX(i),z=attr.getZ(i);
    attr.setY(i,homesteadGround(x,z));
    const value=Math.min(1,Math.hypot(x,z)/34);
    const col=sand.clone().lerp(stoneTint,value*.63);
    col.multiplyScalar(.96+.045*Math.sin(x*.79+z*.37)*Math.cos(z*.26));
    colors.push(col.r,col.g,col.b);
  }
  desert.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  desert.computeVertexNormals();
  const floor=new THREE.Mesh(desert,new THREE.MeshStandardMaterial({
    vertexColors:true,roughness:1,side:THREE.DoubleSide,
  }));
  floor.name='midian-homestead-physical-ground';floor.receiveShadow=true;scene.add(floor);

  // A continuous mesh horizon with varying physical crest heights, 360°.
  const vertices:number[]=[],triangles:number[]=[],hue:number[]=[];
  const c0=new THREE.Color(0x897b6e),c1=new THREE.Color(0xb9a995);
  const steps=120;
  for(let i=0;i<=steps;i++){
    const a=2*Math.PI*i/steps;
    const crest=3.1+3.3*Math.sin(a*4.6+.12)**2+
      2.8*Math.sin(a*8.2+1.3)**2+1.1*Math.sin(a*20.1)**2;
    for(let row=0;row<3;row++){
      const t=row/2,r=48-t*4;
      vertices.push(Math.sin(a)*r,row===0?-4:row===1?crest*.43:crest,Math.cos(a)*r);
      const c=c0.clone().lerp(c1,t*.60);
      hue.push(c.r,c.g,c.b);
    }
    if(i)for(let row=0;row<2;row++){
      const x=(i-1)*3+row,y=i*3+row;
      triangles.push(x,y,x+1,x+1,y,y+1);
    }
  }
  const ridge=new THREE.BufferGeometry();
  ridge.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  ridge.setAttribute('color',new THREE.Float32BufferAttribute(hue,3));
  ridge.setIndex(triangles);ridge.computeVertexNormals();
  const distant=new THREE.Mesh(ridge,new THREE.MeshStandardMaterial({
    vertexColors:true,roughness:1,side:THREE.DoubleSide,
  }));
  distant.name='midian-homestead-geometric-distant-hills';scene.add(distant);

  // Structural frame, actual posts and gently sagging fabric roof.
  const support=mat(0x665744),rope=mat(0xa38b6b),cloth=new THREE.MeshStandardMaterial({
    vertexColors:true,color:0xb7a08b,roughness:1,side:THREE.DoubleSide,
  });
  const pivot=new THREE.Group();
  pivot.name='midian-homestead-3d-shelter';
  scene.add(pivot);
  const h=HOMESTEAD_STRUCTURE;
  function timber(x:number,z:number,height:number,radius:number){
    const g=new THREE.CylinderGeometry(radius*.88,radius,height,9);
    const post=new THREE.Mesh(g,support);
    post.position.set(x,homesteadGround(x,z)+height*.5,z);
    post.castShadow=true;post.name='shelter-structural-post';pivot.add(post);
  }
  for(const z of [-2.85,2.85]){
    for(const x of [-2.95,2.95])timber(x,z,1.52,.105);
    timber(0,z,3.05,.125);
  }
  function beam(from:THREE.Vector3,to:THREE.Vector3,r:number,material:THREE.Material,name:string){
    const delta=to.clone().sub(from);
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),8),material);
    mesh.position.copy(from).add(to).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());
    mesh.name=name;mesh.castShadow=true;pivot.add(mesh);
  }
  beam(new THREE.Vector3(0,3.08,-2.85),new THREE.Vector3(0,3.08,2.85),
    .064,support,'shelter-ridge-beam');
  // Two 24×16 fabric surfaces: actual curvature and draped side seams.
  for(const side of [-1,1]){
    const g=new THREE.PlaneGeometry(1,1,24,16);
    const p=g.getAttribute('position');const vertexColor:number[]=[];
    for(let i=0;i<p.count;i++){
      const u=p.getX(i)+.5,v=p.getY(i)+.5;
      const x=side*u*3.07;
      const z=-2.95+v*5.9;
      const sag=.17*Math.sin(Math.PI*u)*Math.sin(Math.PI*v);
      const ripple=.034*Math.sin(u*32+v*11)+.017*Math.cos(u*17-v*19);
      const y=3.07-u*1.80-sag+ripple;
      p.setXYZ(i,x,y+homesteadGround(x,z),z);
      const c=.93+.06*Math.sin(u*19+v*5)+.045*Math.cos(u*42-v*7);
      vertexColor.push(c,c*.98,c*.945);
    }
    g.setAttribute('color',new THREE.Float32BufferAttribute(vertexColor,3));
    g.computeVertexNormals();
    const fabric=new THREE.Mesh(g,cloth);
    fabric.castShadow=true;fabric.receiveShadow=true;
    fabric.name='midian-shelter-woven-3d-roof';
    pivot.add(fabric);
    // The actual perimeter below the eaves is made of 3D cloth, not an
    // invisible full-height walking barrier behind roof geometry.
    const sideGeo=new THREE.PlaneGeometry(1,1,18,10);
    const sidePos=sideGeo.getAttribute('position'),sideColors:number[]=[];
    for(let i=0;i<sidePos.count;i++){
      const u=sidePos.getX(i)+.5,v=sidePos.getY(i)+.5;
      const z=-2.95+5.9*u;
      const x=side*(3.065+.025*Math.sin(u*21)*Math.sin(Math.PI*v));
      sidePos.setXYZ(i,x,homesteadGround(x,z)+.055+v*1.31,z);
      const shade=.91+.09*Math.sin(u*11+v*3)*Math.cos(u*19-v*5);
      sideColors.push(shade,shade*.986,shade*.956);
    }
    sideGeo.setAttribute('color',new THREE.Float32BufferAttribute(sideColors,3));
    sideGeo.computeVertexNormals();
    const sideCloth=new THREE.Mesh(sideGeo,cloth);
    sideCloth.name='midian-shelter-real-cloth-sidewall';
    sideCloth.castShadow=true;sideCloth.receiveShadow=true;
    pivot.add(sideCloth);
    const x=side*3.06;
    beam(new THREE.Vector3(x,1.37+homesteadGround(x,-2.85),-2.85),
      new THREE.Vector3(x,1.37+homesteadGround(x,2.85),2.85),
      .04,rope,'shelter-edge-cord');
  }
  // Rear fabric is solid; front remains genuinely open for walking.
  const rear=new THREE.Mesh(new THREE.PlaneGeometry(5.92,1.46,12,8),
    new THREE.MeshStandardMaterial({color:0x9d866e,roughness:1,side:THREE.DoubleSide}));
  rear.position.set(0,homesteadGround(0,-2.97)+.73,-2.97);
  rear.receiveShadow=true;rear.name='shelter-rear-cloth';pivot.add(rear);
  // A filled triangular upper gable joins the roof rather than leaving an
  // impossible gap above a solid lower back wall.
  const rearBase=homesteadGround(0,-2.98);
  const gable=new THREE.BufferGeometry();
  gable.setAttribute('position',new THREE.Float32BufferAttribute([
    -2.96,1.46+rearBase,-2.985,
     2.96,1.46+rearBase,-2.985,
     0,3.035+rearBase,-2.985,
  ],3));
  gable.computeVertexNormals();
  const endCloth=new THREE.Mesh(gable,new THREE.MeshStandardMaterial({
    color:0x9d866e,roughness:1,side:THREE.DoubleSide,
  }));
  endCloth.castShadow=true;endCloth.receiveShadow=true;
  endCloth.name='shelter-solid-rear-gable';
  pivot.add(endCloth);
  for(const x of [-2.95,2.95]){
    beam(new THREE.Vector3(x,1.46+homesteadGround(x,2.85),2.85),
      new THREE.Vector3(x*1.32,homesteadGround(x*1.32,5.23)+.08,5.23),
      .021,rope,'shelter-real-tension-rope');
  }
  // A woven floor mat, relief from meshes rather than an image overlay.
  const matGeo=new THREE.PlaneGeometry(4.6,3.3,12,10);
  matGeo.rotateX(-Math.PI/2);
  matGeo.translate(0,homesteadGround(0,0)+.027,-.38);
  const matFloor=new THREE.Mesh(matGeo,mat(0x897057));
  matFloor.name='shelter-3d-floor-mat';matFloor.receiveShadow=true;
  pivot.add(matFloor);

  // Hearth and storing vessels: actual 3D but not a staged invented meal.
  const hearthMat=[mat(0x7a6a59),mat(0x9e8970),mat(0x8b7964)];
  const rockGeo=new THREE.DodecahedronGeometry(1,1);
  const cx=h.hearthX,cz=h.hearthZ;
  const ash=new THREE.Mesh(new THREE.CylinderGeometry(.67,.67,.028,32),
    mat(0x554d42));
  ash.position.set(cx,homesteadGround(cx,cz)+.035,cz);
  ash.name='shelter-inactive-ash-hearth';scene.add(ash);
  for(let i=0;i<14;i++){
    const a=i*Math.PI*2/14,r=.78+(hash(i*.81)-.5)*.13;
    const x=cx+Math.sin(a)*r,z=cz+Math.cos(a)*r;
    const stone=new THREE.Mesh(rockGeo,hearthMat[i%3]);
    stone.scale.set(.18+hash(i*3)*.1,.14+hash(i*2)*.06,.16+hash(i+1)*.11);
    stone.position.set(x,homesteadGround(x,z)+.08,z);
    stone.rotation.y=i*.78;stone.castShadow=i%2===0;scene.add(stone);
  }
  const jarProfile=[new THREE.Vector2(.16,0),new THREE.Vector2(.30,.09),
    new THREE.Vector2(.29,.35),new THREE.Vector2(.20,.50),
    new THREE.Vector2(.19,.62)];
  const jarGeo=new THREE.LatheGeometry(jarProfile,28),jarMat=mat(0xa17352);
  for(const [i,x,z] of [[0,4.35,-.85],[1,4.72,-1.53],[2,4.0,-1.71]]){
    const jar=new THREE.Mesh(jarGeo,jarMat);
    jar.position.set(x,homesteadGround(x,z),z);
    jar.scale.setScalar(.86+hash(i*3)*.21);
    jar.name='homestead-clay-storage-vessel';
    jar.castShadow=true;scene.add(jar);
  }
  // Sparse large stones beyond approach lines.
  const natural=mat(0x9a8872);
  const scatter=new THREE.InstancedMesh(rockGeo,natural,64);
  const transform=new THREE.Object3D();
  let count=0;
  for(let i=0;i<64;i++){
    const a=hash(i*7.1)*Math.PI*2,r=12+hash(i*6.2+3)*18;
    const x=Math.sin(a)*r,z=Math.cos(a)*r;
    const size=.44+hash(i*2.14)*1.28;
    transform.position.set(x,homesteadGround(x,z)+size*.18,z);
    transform.rotation.set(.12*hash(i*2.5),a,.14*hash(i*.71));
    transform.scale.set(size*1.5,size*.34,size*.78);
    transform.updateMatrix();scatter.setMatrixAt(count++,transform.matrix);
  }
  scatter.instanceMatrix.needsUpdate=true;
  scatter.name='homestead-instanced-natural-stone';
  scene.add(scatter);

  const walk={x:HOMESTEAD_WALK.startX,z:HOMESTEAD_WALK.startZ,yaw:0,pitch:-.08};
  let exploring=false,disposed=false,last=0,frame=0,dragId:number|null=null,lastX=0,lastY=0;
  const moving:Record<MidianDirection,boolean>={forward:false,backward:false,left:false,right:false};
  const reset=()=>{for(const k of Object.keys(moving) as MidianDirection[])moving[k]=false;};
  const key=(k:string):MidianDirection|null=>{
    switch(k.toLowerCase()){
      case 'w':case 'arrowup':return 'forward';
      case 's':case 'arrowdown':return 'backward';
      case 'a':case 'arrowleft':return 'left';
      case 'd':case 'arrowright':return 'right';
      default:return null;
    }
  };
  const keyDown=(e:KeyboardEvent)=>{
    if(!exploring||e.altKey||e.ctrlKey||e.metaKey)return;
    const d=key(e.key);if(!d)return;e.preventDefault();moving[d]=true;
  };
  const keyUp=(e:KeyboardEvent)=>{
    if(!exploring)return;const d=key(e.key);if(!d)return;e.preventDefault();moving[d]=false;
  };
  function setExplore(on:boolean){
    if(disposed)return;
    exploring=on;reset();last=0;
    if(on){walk.x=HOMESTEAD_WALK.startX;walk.z=HOMESTEAD_WALK.startZ;walk.yaw=0;walk.pitch=-.08;}
    canvas.dataset.midianMode=on?'walk':'shot';
  }
  function setMovement(d:MidianDirection,on:boolean){moving[d]=on&&exploring;}
  function turn(dx:number,dy:number){
    if(!exploring)return;
    walk.yaw-=THREE.MathUtils.clamp(dx,-140,140)*.0038;
    walk.pitch=THREE.MathUtils.clamp(walk.pitch-THREE.MathUtils.clamp(dy,-120,120)*.003,-.68,.55);
  }
  function pointerDown(e:PointerEvent){
    if(!exploring||e.button!==0)return;
    dragId=e.pointerId;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);
  }
  function pointerMove(e:PointerEvent){
    if(dragId!==e.pointerId||!exploring)return;
    turn(e.clientX-lastX,e.clientY-lastY);lastX=e.clientX;lastY=e.clientY;
  }
  function pointerUp(e:PointerEvent){
    if(dragId!==e.pointerId)return;
    dragId=null;
    if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
  }
  const resize=()=>{
    const b=canvas.getBoundingClientRect();
    const w=Math.max(1,Math.round(b.width)),h=Math.max(1,Math.round(b.height));
    renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  };
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
  window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);
  window.addEventListener('blur',reset);
  canvas.addEventListener('pointerdown',pointerDown);
  canvas.addEventListener('pointermove',pointerMove);
  canvas.addEventListener('pointerup',pointerUp);
  canvas.addEventListener('pointercancel',pointerUp);
  function render(now:number){
    if(disposed)return;
    frame=requestAnimationFrame(render);
    if(exploring){
      const dt=last?Math.min(.05,Math.max(0,(now-last)/1000)):0;
      last=now;
      const f=Number(moving.forward)-Number(moving.backward);
      const s=Number(moving.right)-Number(moving.left);
      const mag=Math.hypot(f,s);
      if(mag>0){
        const step=HOMESTEAD_WALK.speed*dt/mag;
        const dx=(-Math.sin(walk.yaw)*f+Math.cos(walk.yaw)*s)*step;
        const dz=(-Math.cos(walk.yaw)*f-Math.sin(walk.yaw)*s)*step;
        if(homesteadWalkable(walk.x+dx,walk.z))walk.x+=dx;
        if(homesteadWalkable(walk.x,walk.z+dz))walk.z+=dz;
      }
      const y=homesteadGround(walk.x,walk.z)+HOMESTEAD_WALK.eye;
      camera.position.set(walk.x,y,walk.z);
      camera.lookAt(walk.x-Math.sin(walk.yaw)*Math.cos(walk.pitch),
        y+Math.sin(walk.pitch),walk.z-Math.cos(walk.yaw)*Math.cos(walk.pitch));
      canvas.dataset.midianX=walk.x.toFixed(3);
      canvas.dataset.midianZ=walk.z.toFixed(3);
      canvas.dataset.midianY=y.toFixed(3);
      canvas.dataset.midianGround=homesteadGround(walk.x,walk.z).toFixed(3);
      canvas.dataset.midianYaw=walk.yaw.toFixed(3);
    }else{
      last=0;camera.position.set(9.7,6.3,12.1);
      camera.lookAt(0,1.25,0);
    }
    if(!document.hidden)renderer.render(scene,camera);
    canvas.dataset.midianRendered='true';
    if(reducedMotion){ /* Static authored landscape; no artificial motion. */ }
  }
  canvas.dataset.midianWorld='homestead';
  canvas.dataset.midianMode='shot';
  const countMesh=(name:string)=>{
    let count=0;
    scene.traverse(node=>{if(node.name===name&&node instanceof THREE.Mesh)count++;});
    return count;
  };
  canvas.dataset.homesteadShelter='3d-woven-fabric-and-posts';
  canvas.dataset.homesteadDoor='walkable';
  canvas.dataset.homesteadHills='1';
  canvas.dataset.homesteadRoofPanels=String(countMesh('midian-shelter-woven-3d-roof'));
  canvas.dataset.homesteadSidePanels=String(countMesh('midian-shelter-real-cloth-sidewall'));
  canvas.dataset.homesteadPosts=String(countMesh('shelter-structural-post'));
  canvas.dataset.homesteadRearGables=String(countMesh('shelter-solid-rear-gable'));
  frame=requestAnimationFrame(render);
  function dispose(){
    if(disposed)return;disposed=true;cancelAnimationFrame(frame);observer.disconnect();reset();
    window.removeEventListener('keydown',keyDown);
    window.removeEventListener('keyup',keyUp);window.removeEventListener('blur',reset);
    canvas.removeEventListener('pointerdown',pointerDown);
    canvas.removeEventListener('pointermove',pointerMove);
    canvas.removeEventListener('pointerup',pointerUp);
    canvas.removeEventListener('pointercancel',pointerUp);
    const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();
    scene.traverse(o=>{
      if(!(o instanceof THREE.Mesh))return;
      geometries.add(o.geometry);
      for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);
    });
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
    renderer.dispose();renderer.forceContextLoss();
    for(const name of Object.keys(canvas.dataset))if(name.startsWith('midian')||name.startsWith('homestead'))delete canvas.dataset[name];
  }
  return {setExplore,setMovement,dispose};
}
