import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {bindBasket,attachAction,morphBudget,PHASES} from './scene.mjs';
import {bindCpuMorphs} from './cpu-morphs.mjs';
const $=id=>document.getElementById(id);
const canvas=$('scene'),status=$('status'),time=$('time'),play=$('play');
let renderer,orbit,scene,actor,house,performanceClip,frame=0,stopped=false,playing=false,t=0,last=0,dirty=true;
const disposables=new Set();
function fail(e){stopped=true;playing=false;cancelAnimationFrame(frame);status.hidden=false;status.textContent='Ошибка просмотра: '+String(e.message||e);for(const e of document.querySelectorAll('button,input'))e.disabled=true;}
function dispose(){stopped=true;cancelAnimationFrame(frame);orbit?.dispose();performanceClip?.dispose();scene?.traverse(o=>{if(o.isMesh){disposables.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){disposables.add(m);for(const v of Object.values(m))if(v?.isTexture)disposables.add(v);}}});for(const o of disposables){if(o.isTexture)o.image?.close?.();o.dispose?.()}renderer?.dispose();}
const shots={
 action:{eye:[2.7,1.8,2.1],target:[.35,.86,.75],cut:true},
 hands:{eye:[1.55,1.42,1.5],target:[.35,1.04,.52],cut:true},
 house:{eye:[5.6,3.8,5.4],target:[.2,1.05,.2],cut:false}
};
function setShot(key){
 const s=shots[key];camera.position.set(...s.eye);orbit.target.set(...s.target);orbit.update();
 house.traverse(o=>{if(o.isMesh)o.visible=!s.cut||/^(Basket_|Hand_woven_basket_body$|Coarse_work_surface$|Workshop_wood_support|Folded_linen_by_basket$|Room_floor_earthen$|Domestic_clay_bench$)/.test(o.name)});
 // The anchor owns every woven detail, including any non-prefix name.
 basket.anchor.traverse(o=>{o.visible=true});
 for(const b of document.querySelectorAll('[data-shot]'))b.setAttribute('aria-pressed',String(b.dataset.shot===key));
 canvas.dataset.shot=key;dirty=true;
}
let camera,basket,clip,cpuMorphs;
function sync(t0){
 t=performanceClip.sample(t0);cpuMorphs?.update();time.value=String(t);
 $('clock').textContent=t.toFixed(2).replace('.',',')+' / 4,70 с';
 $('phase').textContent=PHASES.filter(p=>p[0]<=t+1e-8).at(-1)[1];
 canvas.dataset.time=String(t);dirty=true;
}
function setPlaying(v){playing=v;play.textContent=v?'Пауза':'Воспроизвести';play.setAttribute('aria-pressed',String(v));last=0;}
async function main(){
 const response=await fetch('/manifest.json');if(!response.ok)throw Error('Manifest unavailable');
 const manifest=await response.json();
 if(manifest.actor.sha256!=='17028ece670f5a496ce0568f26be765fed7a618b84cdd62861269fc8d911998c')throw Error('Wrong asset revision');
 renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.shadowMap.type=THREE.PCFShadowMap;
 scene=new THREE.Scene();scene.background=new THREE.Color(0x302a22);
 camera=new THREE.PerspectiveCamera(42,1,.04,50);
 orbit=new OrbitControls(camera,canvas);orbit.enableDamping=false;orbit.enablePan=true;orbit.minDistance=.5;orbit.maxDistance=14;orbit.addEventListener('change',()=>dirty=true);
 scene.add(new THREE.HemisphereLight(0xffefd7,0x645649,1.75));
 const sun=new THREE.DirectionalLight(0xffdfb1,2.3);sun.position.set(-3,6,4);sun.castShadow=true;
 sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-4,right:4,top:4,bottom:-4,near:.1,far:16});sun.shadow.normalBias=.018;scene.add(sun);
 const fill=new THREE.DirectionalLight(0xc9d9e8,.65);fill.position.set(4,3,-3);scene.add(fill);
 const loader=new GLTFLoader();
 // Sequential decode limits overlapping allocation peaks.
 const h=await loader.loadAsync('/assets/house.glb');house=h.scene;scene.add(house);
 const a=await loader.loadAsync('/assets/actor.glb');actor=a.scene;scene.add(actor);
 if(a.animations.length!==1)throw Error('Expected one action');
 actor.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(o.isSkinnedMesh)o.frustumCulled=false}});
 house.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
 const caps=renderer.capabilities,nativeBudget=morphBudget(actor,caps.maxTextureSize);
 const mode=new URLSearchParams(location.search).get('morph')==='native'?'native':'hybrid';
 if(mode==='hybrid')cpuMorphs=bindCpuMorphs(actor);
 basket=bindBasket(house,actor,manifest.settleDeltaM);clip=a.animations[0];performanceClip=attachAction(actor,clip,basket);cpuMorphs?.update();
 const budget=morphBudget(actor,caps.maxTextureSize);
 canvas.dataset.morphMode=mode;canvas.dataset.estimatedMorphGpuBytes=String(budget.estimatedGpuBytes);
 canvas.dataset.nativeMorphGpuBytes=String(nativeBudget.estimatedGpuBytes);
 const layers=renderer.getContext().getParameter(renderer.getContext().MAX_ARRAY_TEXTURE_LAYERS);
 if(budget.rows.some(r=>r.count>layers))throw Error('GPU array texture layer limit below morph count');
 $('metrics').textContent='GLB: '+((manifest.actor.bytes+manifest.house.bytes)/1048576).toFixed(1)+' МиБ · оценка GPU-текстур морфов: '+(budget.estimatedGpuBytes/1048576).toFixed(1)+' МиБ · '+basket.meshCount+' элементов корзины';
 $('metrics').textContent+=' | '+mode;
 const resize=()=>{const {width,height}=canvas.getBoundingClientRect();renderer.setSize(Math.max(1,width),Math.max(1,height),false);camera.aspect=width/Math.max(1,height);camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(21))*Math.max(1,1.1/camera.aspect)));camera.updateProjectionMatrix();dirty=true};
 new ResizeObserver(resize).observe(canvas);resize();setShot('action');sync(0);
 for(const b of document.querySelectorAll('[data-shot]'))b.addEventListener('click',()=>setShot(b.dataset.shot));
 play.addEventListener('click',()=>{if(!playing&&t>=clip.duration-1e-5)sync(0);setPlaying(!playing)});
 $('reset').addEventListener('click',()=>{setPlaying(false);sync(0)});
 time.addEventListener('input',()=>{setPlaying(false);sync(Number(time.value))});
 $('shadow').addEventListener('click',e=>{renderer.shadowMap.enabled=!renderer.shadowMap.enabled;e.currentTarget.setAttribute('aria-pressed',String(renderer.shadowMap.enabled));scene.traverse(o=>{if(o.isMesh)for(const m of Array.isArray(o.material)?o.material:[o.material])m.needsUpdate=true});dirty=true});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail(Error('WebGL context lost'))});
 function loop(now){
   if(stopped)return;
   try{
    if(playing){if(last)sync(Math.min(clip.duration,t+Math.min(.075,(now-last)/1000)));last=now;if(t>=clip.duration-1e-6)setPlaying(false)}
    if(dirty){renderer.render(scene,camera);dirty=false;canvas.dataset.drawCalls=String(renderer.info.render.calls);canvas.dataset.triangles=String(renderer.info.render.triangles);if(cpuMorphs)canvas.dataset.morphUpdates=String(cpuMorphs.stats().updates);}
    frame=requestAnimationFrame(loop);
   }catch(e){fail(e)}
 }
 renderer.render(scene,camera);canvas.dataset.ready='true';status.hidden=true;
 for(const e of document.querySelectorAll('button,input'))e.disabled=false;
 canvas.dataset.basketMeshes=String(basket.meshCount);frame=requestAnimationFrame(loop);
}
window.addEventListener('pagehide',dispose,{once:true});main().catch(fail);
