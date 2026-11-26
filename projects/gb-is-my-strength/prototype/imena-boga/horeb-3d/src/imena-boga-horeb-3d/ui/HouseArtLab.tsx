/** Independent, no-release art lab. It never mounts the game's story state.
 * Assets are glTF with a reproducible Blender source and CC0 map manifest.
 * No procedural building geometry: viewer creates only the lighting and stage.
 */
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createHouseActorRehearsal,HOUSE_ACTOR_PROFILES,type ActorPhase} from '../engine/HouseActorRehearsal';
type View='courtyard'|'threshold'|'room'|'basket';
type CameraPose={eye:readonly [number,number,number]; target:readonly [number,number,number]};
const POSES:Record<View,CameraPose>={
 courtyard:{eye:[9,6.2,12.4],target:[0,1.45,0.2]},
 threshold:{eye:[0,2.30,8.15],target:[0,1.48,-1.1]},
 room:{eye:[-1.35,1.69,1.65],target:[.7,1.05,-.55]},
 basket:{eye:[1.12,1.72,1.13],target:[.35,1.02,.26]},
};
const TITLES:Record<View,string>={
 courtyard:'Двор и дом',
 threshold:'От порога',
 room:'Внутри жилища',
 basket:'Подготовка корзины',
};
type WalkKey='w'|'a'|'s'|'d'|'q'|'e';
type SceneApi={view:(v:View)=>void;roof:(show:boolean)=>void;walk:(on:boolean)=>void;move:(key:WalkKey,on:boolean)=>void;clear:()=>void;inspect:()=>boolean;closeInspect:()=>void;toggleActor:()=>void;performActor:()=>void};
export function HouseArtLab(){
 // Dev-only exact paired rehearsal; distinct URLs fail closed without the
 // explicitly supplied candidate files. Never substitute canonical binaries.
 const study=import.meta.env.DEV?new URLSearchParams(location.search).get('study'):null;
 const w28=study==='w28'||study==='w28e'||study==='w28f'||study==='w28g'||study==='w28o'||study==='w28q';
 const actorProfile=study==='w28q'?HOUSE_ACTOR_PROFILES.w28q:study==='w28o'?HOUSE_ACTOR_PROFILES.w28o:study==='w28g'?HOUSE_ACTOR_PROFILES.w28g:study==='w28f'?HOUSE_ACTOR_PROFILES.w28f:study==='w28e'?HOUSE_ACTOR_PROFILES.w28e:w28?HOUSE_ACTOR_PROFILES.w28:HOUSE_ACTOR_PROFILES.canonical;
 const canvas=useRef<HTMLCanvasElement>(null);
 const api=useRef<SceneApi|null>(null);
 const [view,setView]=useState<View>('courtyard');
 const [roof,setRoof]=useState(true);
 const [walking,setWalking]=useState(false);
 const [canInspect,setCanInspect]=useState(false);
 const [inspected,setInspected]=useState(false);
 const [actorPhase,setActorPhase]=useState<ActorPhase>('off');
 const [observationReady,setObservationReady]=useState(false);
 const inspectClose=useRef<HTMLButtonElement>(null);
 const focusRestore=useRef(false);
 useEffect(()=>{
  if(inspected){focusRestore.current=true;inspectClose.current?.focus();}
  else if(focusRestore.current){focusRestore.current=false;canvas.current?.focus({preventScroll:true});}
 },[inspected]);
 const [status,setStatus]=useState<'loading'|'ready'|'failed'>('loading');
 const [detail,setDetail]=useState('Загружается оригинальная 3D-модель…');
 const [stats,setStats]=useState({meshes:0,triangles:0,bytes:0});
 useEffect(()=>{
  const element=canvas.current;if(!element)return;
  const c:HTMLCanvasElement=element;
  let disposed=false,loaded:THREE.Group|null=null;
  const objectsToDispose:THREE.Object3D[]=[];
  let renderer:THREE.WebGLRenderer|undefined;
  let controls:OrbitControls|undefined;
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0xaaa89b);
  scene.fog=new THREE.Fog(0xb1ac99,32,95);
  const camera=new THREE.PerspectiveCamera(53,1,.06,140);
  const hemi=new THREE.HemisphereLight(0xfff4e1,0x736b61,1.05);
  scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xffe3bc,2.55);
  sun.position.set(-12,19,7);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);
  sun.shadow.camera.left=-22;sun.shadow.camera.right=22;
  sun.shadow.camera.top=22;sun.shadow.camera.bottom=-22;
  sun.shadow.bias=-.0002;sun.shadow.normalBias=.04;
  scene.add(sun);
  const ambient=new THREE.DirectionalLight(0xd1d9df,.25);
  ambient.position.set(6,6,-10);scene.add(ambient);
  // Real-time approximation of daylight reflected through the open door.
  // Native Cycles uses a rectangular area source; glTF excludes lights.
  const doorway=new THREE.SpotLight(0xffe4bf,32,8,.77,.7,2);
  doorway.position.set(0,1.84,2.22);doorway.target.position.set(.2,1.02,-.8);
  doorway.castShadow=true;doorway.shadow.mapSize.set(1024,1024);
  doorway.shadow.bias=-.00035;doorway.shadow.normalBias=.02;
  scene.add(doorway,doorway.target);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(180,180),
   new THREE.MeshStandardMaterial({color:0xb1a086,roughness:1}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-.32;floor.receiveShadow=true;
  scene.add(floor);objectsToDispose.push(floor);
  let currentView:View='courtyard';
  let basketBounds:THREE.Box3|null=null;
  let basketRoot:THREE.Object3D|null=null;
  let fitDirty=true;
  let rehearsal:ReturnType<typeof createHouseActorRehearsal>|null=null,actorClock=0;
  let observerReady=false;
  const observationTarget=new THREE.Vector3(-.10,.95,.27);
  const observationPoint=new THREE.Vector3(0,.018,2.02);
  const observationMark=new THREE.Mesh(new THREE.RingGeometry(.22,.245,48),new THREE.MeshBasicMaterial({color:0xd4b77e,transparent:true,opacity:.85,side:THREE.DoubleSide}));
  observationMark.rotation.x=-Math.PI/2;observationMark.position.copy(observationPoint);observationMark.visible=false;scene.add(observationMark);objectsToDispose.push(observationMark);
  // Laboratory-only walk mode. Collider footprints are derived from the
  // loaded named authored meshes, not guessed from a second house model.
  const obstacles:THREE.Box3[]=[];
  const keys=new Set<WalkKey>();
  let walking=false,walkX=0,walkZ=7.2,yaw=0,pitch=-.09,lastFrame=0,blocked=false;
  const radius=.26;
  const observing=()=>rehearsal?.phase()==='performing';
  function observationAvailable(){
   return walking&&!inspecting&&!observing()&&!!rehearsal?.present()&&Math.hypot(walkX-observationPoint.x,walkZ-observationPoint.z)<.28;
  }
  function updateObservation(){
   const ready=observationAvailable();
   if(ready!==observerReady){observerReady=ready;setObservationReady(ready);}
   observationMark.visible=walking&&!inspecting&&!observing()&&!!rehearsal?.present();
   c.dataset.houseObservationReady=String(ready);
  }
  function walkLens(){
   // Preserve natural perspective. A portrait device uses a cinema aperture
   // within its existing canvas rather than a fisheye or moved player.
   const aspect=Math.max(1,c.clientWidth)/Math.max(1,c.clientHeight);
   camera.aspect=observing()&&aspect<1.35?Math.max(1,c.clientWidth)/Math.max(1,Math.floor(Math.max(1,c.clientWidth)/1.35)):aspect;
   camera.fov=65;camera.updateProjectionMatrix();
  }
  let inspecting=false,inspectReady=false,probeTime=0;
  const inspectTarget=new THREE.Vector3(),inspectDirection=new THREE.Vector3();
  const inspectRay=new THREE.Raycaster();
  const inspectObstacles:THREE.Mesh[]=[];
  function inspectAvailable(){
   if(!walking||observing()||!basketBounds||!basketRoot)return false;
   basketBounds.getCenter(inspectTarget);inspectTarget.y=basketBounds.max.y-.035;
   inspectDirection.copy(inspectTarget).sub(camera.position);
   const distance=inspectDirection.length();
   if(distance>2.0||distance<.08)return false;
   // Facing the object and an unobstructed segment to its opening.
   if(camera.getWorldDirection(new THREE.Vector3()).dot(inspectDirection.clone().normalize())<.52)return false;
   inspectRay.set(camera.position,inspectDirection.normalize());inspectRay.far=distance-.025;
   return inspectRay.intersectObjects(inspectObstacles,false).length===0;
  }
  function updateInspectReady(ready:boolean){
   if(ready===inspectReady)return;
   inspectReady=ready;setCanInspect(ready);c.dataset.houseInspectReady=String(ready);
  }
  function inspect(){
   if(inspecting||!inspectAvailable())return false;
   clear();inspecting=true;setInspected(true);c.dataset.houseInspected='true';return true;
  }
  function closeInspect(){
   clear();inspecting=false;setInspected(false);c.dataset.houseInspected='false';
  }
  const walkable=(x:number,z:number)=>{
   if(!Number.isFinite(x)||!Number.isFinite(z)||Math.abs(x)>3.12||z>8.3||z< -2.05)return false;
   if(rehearsal?.present()&&Math.hypot(x-actorProfile.offset[0],z-actorProfile.offset[2])<radius+.31)return false;
   return !obstacles.some(b=>{
    const dx=x-THREE.MathUtils.clamp(x,b.min.x,b.max.x);
    const dz=z-THREE.MathUtils.clamp(z,b.min.z,b.max.z);
    return dx*dx+dz*dz<radius*radius;
   });
  };
  const walkCamera=()=>{
   const ground=walkZ>2.95?-.11:-.005;
   camera.position.set(walkX,ground+1.69,walkZ);
   camera.rotation.set(pitch,yaw,0,'YXZ');
   camera.updateMatrixWorld(true);
   c.dataset.houseWalkX=walkX.toFixed(3);c.dataset.houseWalkZ=walkZ.toFixed(3);
   c.dataset.houseWalkPitch=pitch.toFixed(3);c.dataset.houseWalkYaw=yaw.toFixed(3);c.dataset.houseWalkBlocked=String(blocked);
   c.dataset.houseWalkRegion=walkZ<2.24?'room':walkZ>3.10?'yard':'threshold';
  };
  let pointer:number|null=null,px=0,py=0;
  const releaseLook=()=>{
   if(pointer!==null&&c.hasPointerCapture(pointer))c.releasePointerCapture(pointer);
   pointer=null;
  };
  const clear=()=>{keys.clear();releaseLook();};
  const lookStart=(event:PointerEvent)=>{
   if(!walking||inspecting||observing()||pointer!==null||event.button!==0)return;
   pointer=event.pointerId;px=event.clientX;py=event.clientY;c.setPointerCapture(pointer);
  };
  const lookMove=(event:PointerEvent)=>{
   if(!walking||inspecting||observing()||event.pointerId!==pointer)return;
   yaw-=(event.clientX-px)*.004;
   pitch=THREE.MathUtils.clamp(pitch-(event.clientY-py)*.004,-1.16,.65);
   px=event.clientX;py=event.clientY;
  };
  const lookEnd=(event:PointerEvent)=>{if(pointer===event.pointerId)releaseLook();};
  const move=(key:WalkKey,on:boolean)=>{if(!on)keys.delete(key);else if(walking&&!inspecting&&!observing()&&!document.hidden)keys.add(key);};
  const getKey=(event:KeyboardEvent):WalkKey|undefined=>{
   if(event.altKey||event.ctrlKey||event.metaKey)return;
   const key=event.key.toLowerCase();
   if(['w','a','s','d','q','e'].includes(key))return key as WalkKey;
   return ({arrowup:'w',arrowdown:'s',arrowleft:'q',arrowright:'e'} as Record<string,WalkKey>)[key];
  };
  const keyDown=(event:KeyboardEvent)=>{
   if(!walking||event.target instanceof HTMLElement&&event.target.matches('input,textarea,select,[contenteditable=true]'))return;
   if(event.key==='Escape'&&inspecting){event.preventDefault();closeInspect();return;}
   if(event.key.toLowerCase()==='f'&&!event.repeat){event.preventDefault();inspect();return;}
   const key=getKey(event);if(key){event.preventDefault();move(key,true);}
  };
  const keyUp=(event:KeyboardEvent)=>{const key=getKey(event);if(key&&walking){event.preventDefault();move(key,false);}};
  const visibility=()=>{if(document.hidden){clear();lastFrame=0;actorClock=0;rehearsal?.cancel();}};
  function walkFrame(now:number){
   const dt=lastFrame?Math.min(.05,Math.max(0,(now-lastFrame)/1000)):0;lastFrame=now;
   if(document.hidden||inspecting)return;
   if(observing()){walkCamera();updateObservation();return;}
   yaw+=((keys.has('q')?1:0)-(keys.has('e')?1:0))*1.7*dt;
   const f=(keys.has('w')?1:0)-(keys.has('s')?1:0),side=(keys.has('d')?1:0)-(keys.has('a')?1:0);
   const norm=Math.max(1,Math.hypot(f,side));
   const dx=(-Math.sin(yaw)*f+Math.cos(yaw)*side)*1.75*dt/norm;
   const dz=(-Math.cos(yaw)*f-Math.sin(yaw)*side)*1.75*dt/norm;
   blocked=false;
   if(walkable(walkX+dx,walkZ))walkX+=dx;else blocked=true;
   if(walkable(walkX,walkZ+dz))walkZ+=dz;else blocked=true;
   walkCamera();
   if(now-probeTime>100){probeTime=now;updateInspectReady(inspectAvailable());updateObservation();}
  }
  function setWalk(on:boolean){
   if(on&&rehearsal?.phase()==='loading')return;
   clear();closeInspect();rehearsal?.cancel();updateInspectReady(false);walking=on;lastFrame=0;blocked=false;
   activeControls.enabled=!on;
   c.dataset.houseWalk=String(on);
   if(on){delete c.dataset.basketFrameExtent;delete c.dataset.basketBlockedRays;delete c.dataset.basketBlockers;delete c.dataset.houseView;}
   if(on){walkX=0;walkZ=7.2;yaw=0;pitch=-.09;roofObjs.forEach(o=>o.visible=true);walkLens();walkCamera();c.focus({preventScroll:true});}
   else{setPose(POSES[currentView]);activeControls.update();}
   updateObservation();
  }
  function fitLens(){
   const horizontal=THREE.MathUtils.degToRad(currentView==='basket'?60:48);
   const adaptive=THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(horizontal/2)/Math.max(camera.aspect,.28)));
   camera.fov=Math.min(90,Math.max(currentView==='basket'?57:53,adaptive));camera.updateProjectionMatrix();fitDirty=true;
  }
  function setPose(p:CameraPose){
   camera.position.set(...p.eye);fitLens();
   if(controls){
     controls.target.set(...p.target);
     controls.update();
   }else camera.lookAt(...p.target);
  }
  const roofObjs:THREE.Object3D[]=[];
  try{
   renderer=new THREE.WebGLRenderer({canvas:c,antialias:true,powerPreference:'high-performance'});
   renderer.outputColorSpace=THREE.SRGBColorSpace;
   renderer.toneMapping=THREE.ACESFilmicToneMapping;
   renderer.toneMappingExposure=1.15;
   renderer.shadowMap.enabled=true;
   renderer.shadowMap.type=THREE.PCFShadowMap;
   renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
   controls=new OrbitControls(camera,c);
   controls.enableDamping=true;
   controls.dampingFactor=.085;
   controls.enablePan=false;
   controls.minDistance=.55;
   controls.maxDistance=28;
   controls.maxPolarAngle=Math.PI*.51;
   setPose(POSES.courtyard);
  }catch(err){
   setStatus('failed');setDetail('WebGL недоступен на этом устройстве.');
   return ()=>{renderer?.dispose();};
  }
  const activeRenderer=renderer;
  const activeControls=controls;
  c.addEventListener('pointerdown',lookStart);c.addEventListener('pointermove',lookMove);c.addEventListener('pointerup',lookEnd);c.addEventListener('pointercancel',lookEnd);c.addEventListener('lostpointercapture',lookEnd);
  window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);
  window.addEventListener('blur',clear);document.addEventListener('visibilitychange',visibility);

  function resize(){
   if(disposed||!c)return;
   const w=Math.max(1,c.clientWidth),h=Math.max(1,c.clientHeight);
   camera.aspect=w/h;if(walking)walkLens();else fitLens();
   activeRenderer.setSize(w,h,false);
  }
  const observer=new ResizeObserver(resize);observer.observe(c);
  resize();
  const render=(now:number)=>{
   if(disposed)return;
   const actorDt=actorClock?(now-actorClock)/1000:0;actorClock=now;
   rehearsal?.tick(actorDt,camera);
   if(walking)walkFrame(now);else activeControls.update();
   if(!walking&&fitDirty&&basketBounds){
    camera.updateMatrixWorld(true);
    let extent=0,depthOk=true;
    const v=new THREE.Vector3();
    for(const x of [basketBounds.min.x,basketBounds.max.x])
     for(const y of [basketBounds.min.y,basketBounds.max.y])
      for(const z of [basketBounds.min.z,basketBounds.max.z]){
       v.set(x,y,z).project(camera);
       extent=Math.max(extent,Math.abs(v.x),Math.abs(v.y));
       depthOk=depthOk&&v.z>=-1&&v.z<=1;
      }
    c.dataset.basketFrameExtent=depthOk?extent.toFixed(4):'outside';
    // Test actual line of sight to the opening, not just a bounding box
    // that could be completely hidden behind a wall or hanging linen.
    if(currentView==='basket'&&loaded&&basketRoot){
     const obstacles:THREE.Mesh[]=[];
     loaded.traverseVisible(o=>{
      if(!(o as THREE.Mesh).isMesh)return;
      let parent:THREE.Object3D|null=o;
      while(parent&&parent!==basketRoot)parent=parent.parent;
      if(!parent)obstacles.push(o as THREE.Mesh);
     });
     const ray=new THREE.Raycaster(),target=new THREE.Vector3();
     let blocked=0;const blockers=new Set<string>();
     for(const [u,w] of [[.5,.5],[.25,.5],[.75,.5],[.5,.25],[.5,.75]]){
      target.set(THREE.MathUtils.lerp(basketBounds.min.x,basketBounds.max.x,u),
       basketBounds.max.y-.04,THREE.MathUtils.lerp(basketBounds.min.z,basketBounds.max.z,w));
      const direction=target.clone().sub(camera.position);
      ray.set(camera.position,direction.clone().normalize());ray.far=Math.max(0,direction.length()-.015);
      const hits=ray.intersectObjects(obstacles,false);
      if(hits.length){blocked++;blockers.add(hits[0].object.name);}
     }
     c.dataset.basketBlockedRays=String(blocked);
     c.dataset.basketBlockers=Array.from(blockers).join(',');
    }else {delete c.dataset.basketBlockedRays;delete c.dataset.basketBlockers;}
    c.dataset.houseView=currentView;fitDirty=false;
   }
   const width=Math.max(1,c.clientWidth),height=Math.max(1,c.clientHeight);
   if(observing()&&width/height<1.35){
    const aperture=Math.max(1,Math.floor(width/1.35)),bottom=Math.floor((height-aperture)/2);
    activeRenderer.setScissorTest(false);
    activeRenderer.setViewport(0,0,width,height);
    activeRenderer.setClearColor(0x17130f,1);activeRenderer.clear(true,true,true);
    activeRenderer.setViewport(0,bottom,width,aperture);
    activeRenderer.setScissor(0,bottom,width,aperture);activeRenderer.setScissorTest(true);
    // The integer viewport has a slightly different aspect than its nominal ratio.
    if(camera.aspect!==width/aperture){camera.aspect=width/aperture;camera.updateProjectionMatrix();}
    c.dataset.houseActorAperture=width+'x'+aperture;
    activeRenderer.render(scene,camera);
    activeRenderer.setScissorTest(false);
    activeRenderer.setViewport(0,0,width,height);
   }else{
    if(observing())c.dataset.houseActorAperture=width+'x'+height;
    activeRenderer.render(scene,camera);
   }
  };
  activeRenderer.setAnimationLoop(render);
  const loader=new GLTFLoader();
  // Served from a same-origin local art lab. The local asset is not a Product dependency.
  const src=new URL('./artlab/'+(w28?'w28-house.glb':'horeb_egypt_house_hero_pilot.glb'),window.location.href).href;
  loader.load(src,gltf=>{
   if(disposed){gltf.scene.traverse(o=>{const m=o as THREE.Mesh;if(m.isMesh){m.geometry?.dispose();}});return;}
   loaded=gltf.scene;loaded.name='HOREB_ORIGINAL_HOUSE_PILOT';
   let meshCount=0,triangleCount=0;
   loaded.traverse(o=>{
    if(o.name.startsWith('Roof_')||o.name.startsWith('Parapet_'))roofObjs.push(o);
    const m=o as THREE.Mesh;
    if(!m.isMesh)return;
    m.castShadow=true;m.receiveShadow=true;meshCount++;
    const geom=m.geometry;
    triangleCount+=(geom.index?geom.index.count:geom.getAttribute('position')?.count||0)/3;
   });
   scene.add(loaded);loaded.updateMatrixWorld(true);
   loaded.traverse(o=>{
    const m=o as THREE.Mesh;if(!m.isMesh)return;
    if(!/^(Back_wall_thick|West_wall|East_wall|Facade_left_of_open_door|Facade_right_of_open_door|Doorframe_|Yard_west_wall|Yard_east_wall|Yard_entrance_|Domestic_clay_bench|Coarse_work_surface|Water_storage_jar|Small_oil_vessel|Courtyard_grain_jar|Second_storage_pot)/.test(o.name))return;
    const b=new THREE.Box3().setFromObject(m);
    if(!b.isEmpty())obstacles.push(b);
   });
   c.dataset.houseWalkColliders=String(obstacles.length);
   const basket=loaded.getObjectByName('BASKET_OBJECT_ACTION_ANCHOR');
   if(basket){
    basketRoot=basket;basketBounds=new THREE.Box3().setFromObject(basket);
    loaded.traverse(o=>{
     if(!(o as THREE.Mesh).isMesh)return;
     let parent:THREE.Object3D|null=o;
     while(parent&&parent!==basket)parent=parent.parent;
     if(!parent)inspectObstacles.push(o as THREE.Mesh);
    });
   }
   fitDirty=true;
   const showRoof=true;
   roofObjs.forEach(o=>o.visible=showRoof);
   rehearsal=createHouseActorRehearsal(scene,loaded,c,next=>{setActorPhase(next);if(walking)walkLens();if(next!=='performing')delete c.dataset.houseActorAperture;updateObservation();},actorProfile);
   api.current={view:mode=>{currentView=mode;if(walking)setWalk(false);setPose(POSES[mode]);},roof:show=>roofObjs.forEach(o=>o.visible=show),walk:setWalk,move,clear,inspect,closeInspect,
    toggleActor:()=>{
     if(!rehearsal)return;
     if(rehearsal.phase()==='off'){
      // Enable only outside walk mode: never spawn into the player's footprint.
      if(!walking)void rehearsal.enable();
     }else rehearsal.clear();
    },
    performActor:()=>{
     if(!observationAvailable())return;
     if(rehearsal?.perform()){
      clear();updateInspectReady(false);
      // Intentional director look from the player's existing coordinates.
      // No position change and no wall/roof cutaway.
      const d=observationTarget.clone().sub(camera.position);
      yaw=Math.atan2(-d.x,-d.z);pitch=Math.atan2(d.y,Math.hypot(d.x,d.z));
      walkLens();walkCamera();c.focus({preventScroll:true});
     }
    }};
   const size=Math.round((performance.getEntriesByName(src)[0] as PerformanceResourceTiming|undefined)?.transferSize||0);
   setStats({meshes:meshCount,triangles:Math.round(triangleCount),bytes:size});
   setStatus('ready');setDetail('GLB действительно загружен; модель можно осмотреть вращением и с разных ракурсов.');
  },undefined,error=>{
   if(disposed)return;
   setStatus('failed');
   setDetail('Не удалось загрузить модель: '+String(error).slice(0,220));
  });
  return()=>{
   disposed=true;api.current=null;observer.disconnect();clear();rehearsal?.dispose();
   c.removeEventListener('pointerdown',lookStart);c.removeEventListener('pointermove',lookMove);c.removeEventListener('pointerup',lookEnd);c.removeEventListener('pointercancel',lookEnd);c.removeEventListener('lostpointercapture',lookEnd);
   window.removeEventListener('keydown',keyDown);window.removeEventListener('keyup',keyUp);window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',visibility);
   for(const key of ['houseWalk','houseWalkX','houseWalkZ','houseWalkYaw','houseWalkPitch','houseWalkBlocked','houseWalkRegion','houseWalkColliders','houseInspectReady','houseInspected','houseObservationReady','houseActorAperture'])delete c.dataset[key];
   activeRenderer.setAnimationLoop(null);activeControls.dispose();
   const geos=new Set<THREE.BufferGeometry>(),mats=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();
   if(loaded)loaded.traverse(o=>{
    const m=o as THREE.Mesh;if(!m.isMesh)return;
    geos.add(m.geometry);
    (Array.isArray(m.material)?m.material:[m.material]).forEach(material=>{
     mats.add(material);
     for(const k of ['map','normalMap','roughnessMap','aoMap','metalnessMap']){
      const tex=(material as unknown as Record<string,THREE.Texture|undefined>)[k];
      if(tex)textures.add(tex);
     }
    });
   });
   for(const o of objectsToDispose){
    const m=o as THREE.Mesh;geos.add(m.geometry);mats.add(m.material as THREE.Material);
   }
   geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
   delete c.dataset.basketFrameExtent;delete c.dataset.houseView;delete c.dataset.basketBlockedRays;delete c.dataset.basketBlockers;
   doorway.shadow.dispose();sun.shadow.dispose();activeRenderer.dispose();
  };
 },[]);
 const choose=(v:View)=>{setWalking(false);setView(v);api.current?.view(v);};
 const toggleWalk=()=>{const on=!walking;if(on&&actorPhase==='loading')return;if(on)setRoof(true);setWalking(on);api.current?.walk(on);};
 const toggleRoof=()=>{const next=!roof;setRoof(next);api.current?.roof(next);};
 return <main className="wrap" data-testid="house-art-lab">
  <header className="top">
   <div><p className="kicker">HOREB · ORIGINAL HOUSE LOOKDEV</p>
   <div className="brand">Тихий дом у Нила</div></div>
   <span className="status">LOOKDEV ONLY · ART HOLD</span>
  </header>
  <div className="layout house-layout">
    <section className={'viewer'+(walking?' house-walking':'')} aria-label="Трёхмерная художественная лаборатория дома">
    <canvas ref={canvas} data-testid="house-lookdev-canvas" tabIndex={0} aria-label={walking?"Прогулка по дому: WASD, поворот Q/E":"Вращаемая 3D-модель глинобитного дома и двора"} />
    <div className="corner" hidden={actorPhase==='performing'}><span className="kicker">01 / THE HOUSE · EXODUS 2</span>
     <h1>{walking?'Прогулка по жилищу':TITLES[view]}</h1>
     <p>Авторская художественная модель. Исторический тип жилища условен, конкретный дом семьи Моисея не установлен.</p>
    </div>
    {status!=='ready'&&<div className="loading" data-testid="house-lookdev-status" role="status">
      <div style={{maxWidth:340,padding:20,textAlign:'center'}}>{detail}</div>
    </div>}
    {walking&&!inspected&&actorPhase==='performing'&&<div className="house-actor-caption" role="status">Репетиция жеста · позиция игрока сохранена</div>}
    {walking&&!inspected&&actorPhase!=='performing'&&<div className="house-walk-hud">
     <div className="house-walk-objective">{canInspect?'Корзина рядом · осмотреть':'Найдите стол с корзиной'}</div>
     <button type="button" data-testid="house-inspect-basket" disabled={!canInspect||inspected} onClick={()=>api.current?.inspect()}>Осмотреть · F</button>
     {actorPhase!=='off'&&<button type="button" data-testid="house-actor-perform" disabled={!observationReady||!['idle','complete'].includes(actorPhase)} onClick={()=>api.current?.performActor()}>{actorPhase==='complete'?'Повторить жест':'Наблюдать жест'}</button>}
     {actorPhase!=='off'&&!observationReady&&<span className="house-walk-objective">Для жеста встаньте на отметку у входа</span>}
     {actorPhase==='complete'&&<span role="status" className="house-walk-objective">Жест завершён</span>}
     {actorPhase==='failed'&&<span role="status" className="house-walk-objective">Репетиция не прошла проверку</span>}
    </div>}
     {walking&&!inspected&&actorPhase!=='performing'&&<div className="house-walk-pad" aria-label="Управление прогулкой">
      {([['q','↶','Повернуть налево'],['w','↑','Вперёд'],['e','↷','Повернуть направо'],['a','←','Влево'],['s','↓','Назад'],['d','→','Вправо']] as const).map(([key,label,aria])=><button key={key} type="button" data-testid={'house-walk-'+key} aria-label={aria}
       onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId);api.current?.move(key,true);}}
       onPointerUp={()=>api.current?.move(key,false)} onPointerCancel={()=>api.current?.move(key,false)} onLostPointerCapture={()=>api.current?.move(key,false)}
       onKeyDown={event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();api.current?.move(key,true);}}}
       onKeyUp={event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();api.current?.move(key,false);}}} onBlur={()=>api.current?.move(key,false)}>{label}</button>)}
     </div>}
    {walking&&inspected&&<section className="house-inspection" role="region" aria-label="Корзина из тростника" data-testid="house-basket-inspection">
     <span className="kicker">Исход 2:3</span><h2>Корзина из тростника</h2>
     <p>«взяла корзинку из тростника и осмолила ее асфальтом и смолою»</p>
     <p>Форма, плетение и обстановка — художественная реконструкция, не сохранившийся библейский предмет.</p>
     <button type="button" ref={inspectClose} data-testid="house-inspect-close" onClick={()=>api.current?.closeInspect()}>Продолжить прогулку</button>
    </section>}
    <div className="footerbar"><span>{status==='ready'?'WebGL · настоящий GLB':'Загрузка сцены'}</span>
     <span className="house-desktop-hint">{walking?'WASD — идти · мышь — обзор':'Мышь: вращение · Колесо: приближение'}</span>
     <span className="house-touch-hint">{walking?'Стрелки — идти · свайп — обзор':'Палец: вращение · Щипок: приближение'}</span></div>
   </section>
   <section className="side house-tools" aria-label="Управление сценой">
    <div>
     <h3>Исследование пространства</h3>
     <button type="button" className={'switch '+(walking?'selected':'')} data-testid="house-walk-toggle" disabled={status!=='ready'||actorPhase==='loading'} aria-pressed={walking} onClick={toggleWalk}>{walking?'Закончить прогулку':'Войти во двор и дом'}</button>
     <h3>Репетиция персонажа · ART HOLD</h3>
     <button type="button" className="switch" data-testid="house-actor-toggle" disabled={status!=='ready'||walking||actorPhase==='loading'} aria-pressed={actorPhase!=='off'} onClick={()=>api.current?.toggleActor()}>{actorPhase==='off'?'Показать персонажа':actorPhase==='loading'?'Загрузка персонажа…':'Убрать персонажа'}</button>
     <p className="house-actor-note">{w28?'Экспериментальная пара '+(study==='w28q'?'W28q':study==='w28o'?'W28o':study==='w28g'?'W28g':study==='w28f'?'W28f':study==='w28e'?'W28e':'W28')+'. Измерение поверхности пальца, не захват.':'Экспериментальный образ W22. Только жест к корзине, не утверждённая постановка.'}</p>
     <h3>Режиссёрские точки зрения</h3>
     <div className="choices">
     {(Object.keys(POSES) as View[]).map(key=><button key={key}
       data-testid={'house-view-'+key} type="button" disabled={status!=='ready'}
       className={view===key?'selected':''} aria-pressed={view===key}
       onClick={()=>choose(key)}>{TITLES[key]}</button>)}
     </div>
    </div>
    <div>
     <h3>Геометрия и кровля</h3>
     <button className={'switch '+(roof?'selected':'')} type="button"
       data-testid="house-roof-toggle" disabled={status!=='ready'||walking}
       onClick={toggleRoof}>Кровля: {roof?'показана':'скрыта для осмотра'}</button>
    </div>
   </section>
   <aside className="side house-info">
    <div><p className="kicker">ART DIRECTION / EXPERIMENTAL</p>
     <h2>Среда как рассказ</h2>
     <p>Первая авторская модель вместо домов, создаваемых прямо из BoxGeometry. Важны глубина порога, тёплая фактура глины, следы быта и свободный путь в дом.</p>
    </div>
    <div className="note">
     <h3>Проверенные факты пилота</h3>
     <div className="kv"><span>Мешей</span><b data-testid="house-meshes">{stats.meshes}</b>
     <span>Треугольников</span><b data-testid="house-triangles">{stats.triangles}</b>
     <span>Данные</span><b>оригинальная геометрия + CC0 PBR</b></div>
    </div>
    <div className="note">
     <h3>Статус</h3>
     <p><strong>Это не готовая игра.</strong> Модель дома доступна для художественной проверки, но ещё нет утверждённого персонажа матери, анимированных действий и финального размещения в первой главе.</p>
     <p>Свидетельства об архитектуре: <a href="https://www.ucl.ac.uk/museums-static/digitalegypt/3d/houses.html">UCL Digital Egypt</a>.
      Материалы: <a href="https://polyhaven.com/a/clay_plaster">Poly Haven CC0</a>.</p>
    </div>
   </aside>
  </div>
 </main>;
}
