import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {bindBasket,attachAction,morphBudget,PHASES} from './scene.mjs';
import {bindCpuMorphs} from './cpu-morphs.mjs';
import {SHOTS,applyFrame} from './camera.mjs';
function createPlayback({duration,now,request,cancel,sample,render,notify,fail}) {
 let time=0,playing=false,disposed=false,hidden=false,pending=null,dirty=false,start=0,origin=0;
 function schedule(){if(!disposed&&!hidden&&pending===null&&(dirty||playing))pending=request(tick)}
 function halt(){if(pending!==null){cancel(pending);pending=null}}
 function changed(value){if(playing!==value){playing=value;notify(value)}}
 function tick(stamp){
  pending=null;if(disposed||hidden)return;
  try{
   if(playing){
    const next=Math.max(time,Math.min(duration,origin+Math.max(0,stamp-start)/1000));
    if(next!==time){time=next;sample(time);dirty=true}
    if(time>=duration)changed(false);
   }
   if(dirty){dirty=false;render()}
   schedule();
  }catch(e){dispose();fail(e)}
 }
 function invalidate(){if(!disposed){dirty=true;schedule()}}
 function seek(value){
  if(disposed||!Number.isFinite(value))return;
  changed(false);time=Math.max(0,Math.min(duration,value));sample(time);invalidate()
 }
 function toggle(){
  if(disposed||hidden)return;
  if(playing){changed(false);return}
  if(time>=duration)seek(0);
  origin=time;start=now();changed(true);schedule()
 }
 function setHidden(value){
  if(disposed||hidden===value)return;
  hidden=value;
  if(hidden){changed(false);halt();dirty=true}
  else {dirty=true;schedule()}
 }
 function dispose(){disposed=true;halt();changed(false);dirty=false}
 return {invalidate,seek,toggle,setHidden,dispose};
}
const $=id=>document.getElementById(id);
const canvas=$('scene'),status=$('status'),time=$('time'),play=$('play');
let renderer,orbit,scene,actor,house,performanceClip,playback,t=0;
function invalidate(){playback?.invalidate()}
const disposables=new Set();
function fail(e){playback?.dispose();status.hidden=false;status.textContent='Ошибка просмотра: '+String(e.message||e);for(const e of document.querySelectorAll('button,input'))e.disabled=true;}
function dispose(){playback?.dispose();orbit?.dispose();performanceClip?.dispose();scene?.traverse(o=>{if(o.isMesh){disposables.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){disposables.add(m);for(const v of Object.values(m))if(v?.isTexture)disposables.add(v);}}});for(const o of disposables){if(o.isTexture)o.image?.close?.();o.dispose?.()}renderer?.dispose();}
let currentShot=null,manualCamera=false;
function refit(){
 const f=applyFrame(camera,currentShot,camera.aspect);
 orbit.maxDistance=f.maxDistance;orbit.target.copy(f.target);orbit.update();
 canvas.dataset.cameraDistance=String(f.distance);
 invalidate();
}
function setShot(key){
 const s=SHOTS[key];currentShot=key;manualCamera=false;refit();
 house.traverse(o=>{if(o.isMesh)o.visible=!s.cut||/^(Basket_|Hand_woven_basket_body$|Coarse_work_surface$|Workshop_wood_support|Folded_linen_by_basket$|Room_floor_earthen$|Domestic_clay_bench$)/.test(o.name)});
 // The anchor owns every woven detail, including any non-prefix name.
 basket.anchor.traverse(o=>{o.visible=true});
 for(const b of document.querySelectorAll('[data-shot]'))b.setAttribute('aria-pressed',String(b.dataset.shot===key));
 canvas.dataset.shot=key;invalidate();
}
let camera,basket,clip,cpuMorphs;
function sync(t0){
 t=performanceClip.sample(t0);cpuMorphs?.update();time.value=String(t);
 $('clock').textContent=t.toFixed(2).replace('.',',')+' / 4,70 с';
 $('phase').textContent=PHASES.filter(p=>p[0]<=t+1e-8).at(-1)[1];
 canvas.dataset.time=String(t);
}
function setPlaying(v){play.textContent=v?'Пауза':'Воспроизвести';play.setAttribute('aria-pressed',String(v));}
async function main(){
 const response=await fetch('/manifest.json');if(!response.ok)throw Error('Manifest unavailable');
 const manifest=await response.json();
 if(manifest.actor.sha256!=='17028ece670f5a496ce0568f26be765fed7a618b84cdd62861269fc8d911998c')throw Error('Wrong asset revision');
 renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.shadowMap.type=THREE.PCFShadowMap;
 scene=new THREE.Scene();scene.background=new THREE.Color(0x302a22);
 camera=new THREE.PerspectiveCamera(42,1,.04,50);
 orbit=new OrbitControls(camera,canvas);orbit.enableDamping=false;orbit.enablePan=true;orbit.minDistance=.5;orbit.maxDistance=14;orbit.addEventListener('change',invalidate);orbit.addEventListener('start',()=>manualCamera=true);
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
 const resize=()=>{const {width,height}=canvas.getBoundingClientRect();if(width<1||height<1)return;renderer.setSize(width,height,false);camera.aspect=width/height;
 if(currentShot&&!manualCamera)refit();else camera.updateProjectionMatrix();invalidate()};
 const observer=new ResizeObserver(resize);observer.observe(canvas);window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});resize();setShot('action');sync(0);
 for(const b of document.querySelectorAll('[data-shot]'))b.addEventListener('click',()=>setShot(b.dataset.shot));
 play.addEventListener('click',()=>playback.toggle());
 $('reset').addEventListener('click',()=>playback.seek(0));
 time.addEventListener('input',()=>playback.seek(Number(time.value)));
 $('shadow').addEventListener('click',e=>{renderer.shadowMap.enabled=!renderer.shadowMap.enabled;e.currentTarget.setAttribute('aria-pressed',String(renderer.shadowMap.enabled));scene.traverse(o=>{if(o.isMesh)for(const m of Array.isArray(o.material)?o.material:[o.material])m.needsUpdate=true});invalidate()});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail(Error('WebGL context lost'))});
 function paint(){
  renderer.render(scene,camera);
  canvas.dataset.drawCalls=String(renderer.info.render.calls);
  canvas.dataset.triangles=String(renderer.info.render.triangles);
  if(cpuMorphs)canvas.dataset.morphUpdates=String(cpuMorphs.stats().updates);
 }
 playback=createPlayback({duration:clip.duration,now:()=>performance.now(),request:fn=>requestAnimationFrame(fn),cancel:id=>cancelAnimationFrame(id),sample:sync,render:paint,notify:setPlaying,fail});
 document.addEventListener('visibilitychange',()=>playback.setHidden(document.hidden));
 playback.setHidden(document.hidden);
 paint();canvas.dataset.ready='true';status.hidden=true;
 for(const e of document.querySelectorAll('button,input'))e.disabled=false;
 canvas.dataset.basketMeshes=String(basket.meshCount);

}
window.addEventListener('pagehide',dispose,{once:true});main().catch(fail);
