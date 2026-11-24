/** W18: genuinely skinned MakeHuman/MPFB artistic performer, no story changes.
 * Load GLB from same-origin (no CDN), validate NLA clips, allow actual camera
 * review of face, garment and animation at 1440 and 390.
 */
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
type Shot='doorway'|'full'|'portrait'|'gesture';
type Clip='Mother_QuietIdle'|'Mother_GestureTowardsBasket';
const SHOTS:Record<Shot,{eye:[number,number,number];target:[number,number,number]}> ={
 doorway:{eye:[.1,1.85,5.3],target:[-.55,1.27,.35]},
 full:{eye:[-1.12,1.60,3.0],target:[-1.12,.90,.30]},
 portrait:{eye:[-1.12,1.53,1.50],target:[-1.12,1.49,.30]},
 gesture:{eye:[-.78,1.59,2.5],target:[-1.12,1.05,.29]},
};
const W22_SHOTS:Record<Shot,{eye:[number,number,number];target:[number,number,number]}>={
 doorway:{eye:[.1,1.85,5.3],target:[-.2,1.16,.26]},
 full:{eye:[-.50,1.65,3.1],target:[-.50,.91,.30]},
 portrait:{eye:[-.50,1.53,1.55],target:[-.50,1.49,.30]},
 gesture:{eye:[-1.7,1.63,3.55],target:[-.055,.93,.27]},
};
const shotLabel:Record<Shot,string>={
 doorway:'Порог дома',full:'Фигура и одежда',portrait:'Лицо вблизи',gesture:'Руки и жест',
};
type Controller={setShot:(v:Shot)=>void;setClip:(v:Clip)=>void;setPause:(v:boolean)=>void;showGesturePeak:()=>void};
type ActorModel = "horeb_mother_rig_pilot.glb" | "horeb_mother_lookdev_w19e.glb" | "horeb_mother_lookdev_w19h.glb" | "horeb_mother_w22_candidate.glb";
export function MotherArtLab({modelName="horeb_mother_rig_pilot.glb",phase="W18"}:{modelName?:ActorModel;phase?:"W18"|"W19"|"W22"}){
 const canvas=useRef<HTMLCanvasElement>(null);
 const controller=useRef<Controller|null>(null);
 const [shot,setShot]=useState<Shot>('full');
 const [clip,setClip]=useState<Clip>('Mother_QuietIdle');
 const [paused,setPaused]=useState(false);
 const [inspectionFrame,setInspectionFrame]=useState<number|null>(null);
 const [ready,setReady]=useState(false);
 const [error,setError]=useState('');
 const [stats,setStats]=useState({bones:0,meshes:0,clips:0,skinned:0});
 useEffect(()=>{
  const el=canvas.current;if(!el)return;
  let destroyed=false;
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x9f9b8e);
  scene.fog=new THREE.Fog(0xb0aa99,24,66);
  const camera=new THREE.PerspectiveCamera(51,1,.07,90);
  const hemi=new THREE.HemisphereLight(0xffe6bb,0x59504c,1.35);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xffe2bb,2.1);
  sun.position.set(-6,12,9);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-12;
  sun.shadow.camera.right=12;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;
  sun.shadow.bias=-.0001;sun.shadow.normalBias=.03;scene.add(sun);
  const fill=new THREE.DirectionalLight(0xc7d4d9,.8);fill.position.set(5,6,-3);scene.add(fill);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(95,95),new THREE.MeshStandardMaterial({color:0xa19177,roughness:1}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-.25;floor.receiveShadow=true;scene.add(floor);
  let renderer:THREE.WebGLRenderer|undefined,controls:OrbitControls|undefined;
  try{
   renderer=new THREE.WebGLRenderer({canvas:el,antialias:true,powerPreference:'high-performance'});
   renderer.outputColorSpace=THREE.SRGBColorSpace;
   renderer.toneMapping=THREE.ACESFilmicToneMapping;
   renderer.toneMappingExposure=1.15;
   renderer.shadowMap.enabled=true;
   renderer.shadowMap.type=THREE.PCFShadowMap;
   renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));
   controls=new OrbitControls(camera,el);
   controls.enableDamping=true;controls.dampingFactor=.09;
   controls.enablePan=false;controls.minDistance=.45;controls.maxDistance=19;
  }catch(e){
   setError('WebGL недоступен: '+String(e));
   return ()=>{renderer?.dispose();};
  }
  const gl=renderer,orbit=controls;
  let actor:THREE.Group|null=null,house:THREE.Group|null=null,mixer:THREE.AnimationMixer|null=null;
  let playing:THREE.AnimationAction|null=null;
  const actions=new Map<string,THREE.AnimationAction>();
  const resourceMeshes=new Set<THREE.Mesh>();
  const garbageMaterials=new Set<THREE.Material>();
  const garbageTextures=new Set<THREE.Texture>();
  const clock=new THREE.Clock();
  let currentShot:Shot='full';
  const isGestureStudy=()=>phase==="W22"&&currentShot==="gesture";
  // An explicit cutaway inspection, not a change to the reconstructed house.
  // Keep the authored basket and physical support at exactly the same transforms.
  const applyHouseVisibility=()=>{
   if(!house)return;
   house.visible=currentShot==="doorway"||isGestureStudy();
   house.traverse(o=>{
    if(!(o as THREE.Mesh).isMesh)return;
    const roof=/^(Roof_|Parapet_)/.test(o.name);
    const study=/^(Basket_|Hand_woven_basket_body$|Coarse_work_surface$|Workshop_wood_support|Folded_linen_by_basket$|Room_floor_earthen$)/.test(o.name);
    o.visible=!roof&&(!isGestureStudy()||study);
   });
   const basket=house.getObjectByName('Basket_thick_lipped_rim');
   const facade=house.getObjectByName('Facade_left_of_open_door');
   el.dataset.basketVisible=String(house.visible&&!!basket?.visible);
   el.dataset.facadeVisible=String(house.visible&&!!facade?.visible);
  };
  const applyLens=()=>{
   // Maintain a minimum horizontal field of view on a narrow canvas;
   // do not move the character or change basket size to fake contact.
   const aspect=Math.max(.25,camera.aspect);
   const base=THREE.MathUtils.degToRad(32);
   camera.fov=isGestureStudy()?THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(base/2)*Math.max(1,1.05/aspect))):51;
   camera.updateProjectionMatrix();
  };
  const setCam=(target:Shot)=>{
   currentShot=target;
   // Deliberately neutral cutaway stage, not a reconstructed outdoor scene.
   (scene.background as THREE.Color).setHex(isGestureStudy()?0x34332e:0x9f9b8e);
   floor.visible=!isGestureStudy();
   applyLens();
   const d=phase==="W22"?W22_SHOTS[target]:SHOTS[target];
   camera.position.set(...d.eye);
   orbit.target.set(...d.target);orbit.update();
   applyHouseVisibility();
  };
  setCam('full');
  const startClip=(name:Clip)=>{
   const next=actions.get(name);
   if(!next)return;
   // A same-action reset cannot crossfade against itself; discard old
   // fade envelopes, and leave the inspection clock explicitly.
   if(!mixer)return;
   const previous=playing;
   mixer.timeScale=1;
   if(previous&&previous!==next)previous.stopFading().fadeOut(.24);
   next.stopFading().reset().setEffectiveTimeScale(1).setEffectiveWeight(1);
   next.clampWhenFinished=false;
   next.setLoop(THREE.LoopRepeat,Infinity);
   if(previous&&previous!==next)next.fadeIn(.24);
   next.play();
   playing=next;
  };
  // The authored gesture holds frames 48-70 at 24 fps; the previous 1.05s
  // browser capture was too early to judge the intended peak pose.
  // Stop cross-fades and sample the true skeletal GLB action deterministically.
  const showGesturePeak=()=>{
   if(!mixer)return;
   const gesture=actions.get('Mother_GestureTowardsBasket');
   if(!gesture)return;
   for(const a of actions.values())a.stop();
   gesture.stopFading().reset().setEffectiveTimeScale(1).setLoop(THREE.LoopRepeat,Infinity);
   gesture.clampWhenFinished=false;
   gesture.setEffectiveWeight(1);
   gesture.play();
   mixer.timeScale=1;
   mixer.setTime(60/24);
   mixer.timeScale=0;
   playing=gesture;
  };
  const load=new GLTFLoader();
  let houseLoaded=false,actorLoaded=false;
  const loaded=()=>{
   if(destroyed||!houseLoaded||!actorLoaded)return;
   controller.current={setShot:setCam,setClip:startClip,
     setPause:p=>{if(mixer)mixer.timeScale=p?0:1;},showGesturePeak};
   startClip('Mother_QuietIdle');
   setReady(true);
  };
  const houseUrl=new URL('./artlab/horeb_egypt_house_hero_pilot.glb',location.href).href;
  const actorUrl=new URL('./artlab/'+modelName,location.href).href;
  load.load(houseUrl,gltf=>{
   if(destroyed)return;
   house=gltf.scene;
   house.traverse(o=>{
    const m=o as THREE.Mesh;
    if(m.isMesh){
     m.castShadow=true;m.receiveShadow=true;
     resourceMeshes.add(m);
    }
    if(/^(Roof_|Parapet_)/.test(o.name))o.visible=false;
   });
   scene.add(house);applyHouseVisibility();
   houseLoaded=true;loaded();
  },undefined,e=>{if(!destroyed)setError('Не загрузился дом: '+String(e))});
  load.load(actorUrl,gltf=>{
   if(destroyed)return;
   actor=gltf.scene;
   actor.name='MPFB_FEMALE_ANIMATED_ACTOR_ART_HOLD';
   actor.position.set(-1.12,.015,.30);
   if(phase==="W22")actor.position.set(-.50,.015,.30);
   let boneCount=0,skinnedCount=0,meshCount=0;
   actor.traverse(o=>{
    const m=o as THREE.Mesh;
    if(m.isMesh){
     m.castShadow=true;m.receiveShadow=true;
     meshCount++;
     resourceMeshes.add(m);
     if((m as THREE.SkinnedMesh).isSkinnedMesh){
      skinnedCount++;
      boneCount=Math.max(boneCount,(m as THREE.SkinnedMesh).skeleton.bones.length);
     }
    }
   });
   if(boneCount<45||gltf.animations.length<2||skinnedCount<2){
    setError('Невалидный персонаж: скелет/анимация не были импортированы.');
    return;
   }
   scene.add(actor);
   mixer=new THREE.AnimationMixer(actor);
   for(const c of gltf.animations)actions.set(c.name,mixer.clipAction(c));
   const needed=['Mother_QuietIdle','Mother_GestureTowardsBasket'];
   if(!needed.every(k=>actions.has(k))){
    setError('В GLB нет обязательных оригинальных анимационных клипов.');
    return;
   }
   setStats({bones:boneCount,meshes:meshCount,clips:gltf.animations.length,skinned:skinnedCount});
   actorLoaded=true;loaded();
  },undefined,e=>{if(!destroyed)setError('Не загрузился актёр: '+String(e))});
  const observer=new ResizeObserver(()=>{
   if(destroyed)return;
   const w=Math.max(1,el.clientWidth),h=Math.max(1,el.clientHeight);
   camera.aspect=w/h;applyLens();gl.setSize(w,h,false);
  });observer.observe(el);
  gl.setAnimationLoop(()=>{
   if(destroyed)return;
   const dt=Math.min(clock.getDelta(),.075);
   if(mixer){
    mixer.update(dt);
    // Runtime witness from the actual Three.js action; independent of React
    // button state and useful when inspecting a slow software renderer.
    if(playing){
     const data=el.dataset;
     data.actionName=playing.getClip().name;
     data.actionTime=playing.time.toFixed(3);
     data.actionWeight=playing.getEffectiveWeight().toFixed(3);
     data.mixerScale=mixer.timeScale.toString();
    }
   }
   orbit.update();gl.render(scene,camera);
  });
  return()=>{
   destroyed=true;controller.current=null;observer.disconnect();
   gl.setAnimationLoop(null);orbit.dispose();
   if(mixer)mixer.stopAllAction();
   for(const m of resourceMeshes){
    m.geometry?.dispose();
    const list=Array.isArray(m.material)?m.material:[m.material];
    for(const material of list){
     if(!material)continue;
     garbageMaterials.add(material);
     for(const key of ['map','normalMap','roughnessMap','metalnessMap','aoMap','emissiveMap']){
      const t=(material as unknown as Record<string,THREE.Texture|undefined>)[key];
      if(t)garbageTextures.add(t);
     }
    }
   }
   floor.geometry.dispose();garbageMaterials.add(floor.material as THREE.Material);
   garbageTextures.forEach(t=>t.dispose());
   garbageMaterials.forEach(m=>m.dispose());
   gl.dispose();
  };
 },[modelName,phase]);
 const choose=(v:Shot)=>{setShot(v);controller.current?.setShot(v)};
 const changeClip=(v:Clip)=>{
  if(!controller.current)return;
  setClip(v);setPaused(false);setInspectionFrame(null);
  controller.current.setClip(v);
 };
 const changePause=()=>{const v=!paused;setPaused(v);if(!v)setInspectionFrame(null);controller.current?.setPause(v)};
 const inspectPeakGesture=()=>{
  if(!controller.current)return;
  setClip('Mother_GestureTowardsBasket');
  setPaused(true);
  setInspectionFrame(60);
  controller.current.showGesturePeak();
 };
 return <main className="wrap" data-testid="mother-art-lab">
  <header className="top">
   <div><p className="kicker">HOREB · {phase} REAL HUMAN ACTOR · ART HOLD</p>
    <div className="brand">Мать Моисея — образ</div></div>
   <span className="status">ANATOMICAL MODEL · SKINNING · GLB CLIPS</span>
  </header>
  <div className="layout">
   <section className="viewer" aria-label="Интерактивная студия анимированного персонажа">
    <canvas ref={canvas} data-testid="mother-art-canvas" aria-label="3D-модель с настоящей костной анимацией" />
    <div className="corner"><p className="kicker">EXODUS 2 · VISUAL RECONSTRUCTION</p>
     <h1>{shotLabel[shot]}</h1>
     {phase==='W22'&&shot==='gesture'&&<span className="study-tag" data-testid="mother-cutaway-label">Изолированный ракурс · стены скрыты</span>}
     <p>Сценический образ. Реальная внешность матери Моисея неизвестна. Материалы и одежда ещё проходят художественную разработку.</p>
    </div>
    {!ready&&<div className="loading" role="status" data-testid="mother-art-status">
     <div style={{maxWidth:380,padding:20,textAlign:'center'}}>{error||'Загрузка настоящего rigged GLB с двумя анимациями…'}</div>
    </div>}
    <div className="footerbar">
     <span>{ready?'Скелет и анимации загружены':'ART HOLD'}</span>
     <span>Мышь/касание: обзор · Выбор жеста справа</span>
    </div>
   </section>
   <aside className="side">
    <div><p className="kicker">АВТОРСКАЯ СТУДИЯ ПЕРСОНАЖА</p>
     <h2>Человек, а не фигура</h2>
     <p>Базовая анатомическая сетка MakeHuman, 53 кости, авторская льняная одежда и реальные ключевые кадры. Качество лица, кожи и ткани пока недостаточно для релиза.</p>
    </div>
    <div><h3>Контрольные ракурсы</h3><div className="choices">
    {(Object.keys(SHOTS) as Shot[]).map(v=><button type="button" key={v}
      data-testid={'mother-shot-'+v} disabled={!ready} aria-pressed={shot===v}
      className={shot===v?'selected':''} onClick={()=>choose(v)}>{shotLabel[v]}</button>)}
    </div></div>
    <div><h3>Реальная костная анимация</h3><div className="choices">
     <button type="button" data-testid="mother-clip-idle" disabled={!ready}
      className={clip==='Mother_QuietIdle'?'selected':''}
      aria-pressed={clip==='Mother_QuietIdle'} onClick={()=>changeClip('Mother_QuietIdle')}>Спокойное ожидание</button>
     <button type="button" data-testid="mother-clip-gesture" disabled={!ready}
      className={clip==='Mother_GestureTowardsBasket'?'selected':''}
      aria-pressed={clip==='Mother_GestureTowardsBasket'}
      onClick={()=>changeClip('Mother_GestureTowardsBasket')}>Жест к корзине</button>
    </div></div>
    <div><button type="button" className={'switch '+(paused?'selected':'')}
     data-testid="mother-animation-pause" disabled={!ready}
     aria-pressed={paused} onClick={changePause}>{paused?'Продолжить движение':'Остановить движение'}</button></div>
    {(phase==='W19'||phase==='W22')&&<div><button type="button" className="switch"
     data-testid="mother-pose-peak" disabled={!ready}
     onClick={inspectPeakGesture}>Показать пик жеста · кадр 60</button>
     {inspectionFrame===60&&<p className="kicker" data-testid="mother-peak-state">Стоп-кадр 60/105 · 24 кадра/с</p>}
    </div>}
    <div className="note">
     <h3>Подтверждено в реальном GLB</h3>
     <div className="kv">
     <span>Костей</span><b data-testid="mother-bones">{stats.bones}</b>
     <span>Анимированных объектов</span><b data-testid="mother-skinned">{stats.skinned}</b>
     <span>Мешей персонажа</span><b>{stats.meshes}</b>
     <span>Анимационных клипов</span><b data-testid="mother-clips">{stats.clips}</b>
     </div>
    </div>
    <div className="note">
     <h3>Художественные ограничения</h3>
     <p><strong>ART HOLD.</strong> Нет утверждённых PBR-текстур кожи, полноценного лица, выразительной мимики и финального костюма. Эта постановка не переносится в игру автоматически.</p>
    </div>
   </aside>
  </div>
 </main>;
}
