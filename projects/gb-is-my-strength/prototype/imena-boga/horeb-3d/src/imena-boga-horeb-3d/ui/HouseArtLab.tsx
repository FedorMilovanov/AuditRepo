/** Independent, no-release art lab. It never mounts the game's story state.
 * Assets are glTF with a reproducible Blender source and CC0 map manifest.
 * No procedural building geometry: viewer creates only the lighting and stage.
 */
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
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
type SceneApi={view:(v:View)=>void;roof:(show:boolean)=>void};
export function HouseArtLab(){
 const canvas=useRef<HTMLCanvasElement>(null);
 const api=useRef<SceneApi|null>(null);
 const [view,setView]=useState<View>('courtyard');
 const [roof,setRoof]=useState(true);
 const [status,setStatus]=useState<'loading'|'ready'|'failed'>('loading');
 const [detail,setDetail]=useState('Загружается оригинальная 3D-модель…');
 const [stats,setStats]=useState({meshes:0,triangles:0,bytes:0});
 useEffect(()=>{
  const c=canvas.current;if(!c)return;
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
  function resize(){
   if(disposed||!c)return;
   const w=Math.max(1,c.clientWidth),h=Math.max(1,c.clientHeight);
   camera.aspect=w/h;fitLens();
   activeRenderer.setSize(w,h,false);
  }
  const observer=new ResizeObserver(resize);observer.observe(c);
  resize();
  const render=()=>{
   if(disposed)return;
   activeControls.update();
   if(fitDirty&&basketBounds){
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
   activeRenderer.render(scene,camera);
  };
  activeRenderer.setAnimationLoop(render);
  const loader=new GLTFLoader();
  // Served from a same-origin local art lab. The local asset is not a Product dependency.
  const src=new URL('./artlab/horeb_egypt_house_hero_pilot.glb',window.location.href).href;
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
   const basket=loaded.getObjectByName('BASKET_OBJECT_ACTION_ANCHOR');
   if(basket){basketRoot=basket;basketBounds=new THREE.Box3().setFromObject(basket);}
   fitDirty=true;
   const showRoof=true;
   roofObjs.forEach(o=>o.visible=showRoof);
   api.current={view:mode=>{currentView=mode;setPose(POSES[mode]);},roof:show=>roofObjs.forEach(o=>o.visible=show)};
   const size=Math.round((performance.getEntriesByName(src)[0] as PerformanceResourceTiming|undefined)?.transferSize||0);
   setStats({meshes:meshCount,triangles:Math.round(triangleCount),bytes:size});
   setStatus('ready');setDetail('GLB действительно загружен; модель можно осмотреть вращением и с разных ракурсов.');
  },undefined,error=>{
   if(disposed)return;
   setStatus('failed');
   setDetail('Не удалось загрузить модель: '+String(error).slice(0,220));
  });
  return()=>{
   disposed=true;api.current=null;observer.disconnect();
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
 const choose=(v:View)=>{setView(v);api.current?.view(v);};
 const toggleRoof=()=>{const next=!roof;setRoof(next);api.current?.roof(next);};
 return <main className="wrap" data-testid="house-art-lab">
  <header className="top">
   <div><p className="kicker">HOREB · ORIGINAL HOUSE LOOKDEV</p>
   <div className="brand">Тихий дом у Нила</div></div>
   <span className="status">LOOKDEV ONLY · ART HOLD</span>
  </header>
  <div className="layout house-layout">
   <section className="viewer" aria-label="Трёхмерная художественная лаборатория дома">
    <canvas ref={canvas} data-testid="house-lookdev-canvas" aria-label="Вращаемая 3D-модель глинобитного дома и двора" />
    <div className="corner"><span className="kicker">01 / THE HOUSE · EXODUS 2</span>
     <h1>{TITLES[view]}</h1>
     <p>Авторская художественная модель. Исторический тип жилища условен, конкретный дом семьи Моисея не установлен.</p>
    </div>
    {status!=='ready'&&<div className="loading" data-testid="house-lookdev-status" role="status">
      <div style={{maxWidth:340,padding:20,textAlign:'center'}}>{detail}</div>
    </div>}
    <div className="footerbar"><span>{status==='ready'?'WebGL · настоящий GLB':'Загрузка сцены'}</span>
     <span>Мышь / палец: вращение · Колесо / щипок: приближение</span></div>
   </section>
   <section className="side house-tools" aria-label="Управление сценой">
    <div>
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
       data-testid="house-roof-toggle" disabled={status!=='ready'}
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
