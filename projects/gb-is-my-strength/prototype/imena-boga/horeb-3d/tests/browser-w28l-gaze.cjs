// Focused real-browser check of the exported gaze channels, not a substitute for scene QA.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const puppeteer=require('puppeteer-core');
const blink=Boolean(process.env.HOREB_W28O_OUTPUT);
if(blink&&process.env.HOREB_W28L_OUTPUT)throw Error('Choose one facial study');
const dir=process.env.HOREB_W28O_OUTPUT||process.env.HOREB_W28L_OUTPUT;
if(!dir)throw Error('A facial study output is required');
const variant=blink?'w28o':'w28l';
const assetName=variant+'-actor.glb';
const m=JSON.parse(fs.readFileSync(path.join(dir,blink?'w28o-blink-manifest.json':'w28l-eye-manifest.json'),'utf8'));
const bytes=fs.readFileSync(path.join(dir,assetName));
const status=blink?'ART_HOLD_W28O_BLINK_TRIAL':'ART_HOLD_W28L_GAZE_TRIAL';
const hash=blink?'a4c2bad8ee870766717151369ce3de6cda2fdaddc17bf14e43741d4c79397f74':'76fa64646830931c7cfc4e5b17524a7fea1f83c315fe1e7168c9dbf526d14c4b';
if(m.status!==status||m.glb_sha256!==hash||crypto.createHash('sha256').update(bytes).digest('hex')!==hash||bytes.length!==m.glb_bytes)throw Error('Wrong facial asset');
const expected=blink?[1,0,0,.5701439025971043,1,0,0,.5513946836384895]:m.animations.find(a=>a.name==='Mother_GestureTowardsBasket').peak_frame_60;
if(blink&&JSON.stringify(m.events)!==JSON.stringify({Mother_QuietIdle:[34,110],Mother_GestureTowardsBasket:[12,91]}))throw Error('Wrong blink schedule');
const chrome=[process.env.HOREB_BROWSER_PATH,'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe','/usr/bin/google-chrome','/usr/bin/chromium'].find(x=>x&&fs.existsSync(x));
if(!chrome)throw Error('Actual Chromium required');
(async()=>{
 const browser=await puppeteer.launch({executablePath:chrome,headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader',...(process.env.HOREB_NO_SANDBOX==='1'?['--no-sandbox']:[])]});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.setRequestInterception(true);
  let hits=0;
  page.on('request',r=>{
   if(new URL(r.url()).pathname==='/artlab/'+assetName){hits++;return r.respond({status:200,contentType:'model/gltf-binary',body:bytes});}
   return r.continue();
  });
  await page.goto((process.env.HOREB_ARTLAB_BASE_URL||'http://127.0.0.1:5194')+'/artlab.html',{waitUntil:'domcontentloaded'});
  const result=await page.evaluate(async({expected,blink,assetName})=>{
   const THREE=await import('/node_modules/three/build/three.module.js');
   const {GLTFLoader}=await import('/node_modules/three/examples/jsm/loaders/GLTFLoader.js');
   const gltf=await new GLTFLoader().loadAsync('/artlab/'+assetName);
   const meshes=[];gltf.scene.traverse(o=>{if(o.isSkinnedMesh)meshes.push(o)});
   if(meshes.length!==7||meshes.some(o=>o.skeleton.bones.length!==53))throw Error('Wrong skinned mesh contract');
   const eyes=meshes.find(o=>o.morphTargetInfluences?.length===8);
   if(!eyes)throw Error('Missing eye morphs');
   const gesture=gltf.animations.find(a=>a.name==='Mother_GestureTowardsBasket');
   const idle=gltf.animations.find(a=>a.name==='Mother_QuietIdle');
   if(!gesture||!idle)throw Error('Missing clips');
   const mixer=new THREE.AnimationMixer(gltf.scene);
   const ga=mixer.clipAction(gesture),ia=mixer.clipAction(idle);
   const errors=[];
   const weights=()=>Array.from(eyes.morphTargetInfluences);
   const near=(a,b)=>a.length===b.length&&a.every((x,i)=>Math.abs(x-b[i])<1e-4);
   ga.reset().play();mixer.setTime(60/24);const peak=weights();
   if(!near(peak,expected))throw Error('Peak mismatch '+JSON.stringify(peak));
   ga.stop();ia.reset().play();mixer.setTime(60/24);const quiet=weights();
   if(!near(quiet,new Array(8).fill(0)))throw Error('Stale gaze in idle');
   ia.stop();ga.reset().play();mixer.setTime(60/24);const replay=weights();
   if(!near(replay,expected))throw Error('Replay gaze mismatch');
   let blinkSamples=0;
   if(blink){
    const body=meshes.find(o=>o.morphTargetInfluences?.length===2);
    if(!body||body.morphTargetDictionary.blink_left!==0||body.morphTargetDictionary.blink_right!==1)throw Error('Missing eyelid targets');
    const pulse=(f,c)=>{const x=f-c;if(x< -2||x>4)return 0;if(x>=0&&x<=1)return 1;const t=x<0?(x+2)/2:(4-x)/3;return t*t*(3-2*t)};
    for(const [action,other,centers,last,step] of [[ga,ia,[12,91],105,.25],[ia,ga,[34,110],144,1]]){
     other.stop();action.reset().setLoop(THREE.LoopOnce,1);action.clampWhenFinished=true;action.play();
     for(let f=1;f<=last;f+=step){
      mixer.setTime(f/24);
      const lo=Math.floor(f),t=f-lo;
      const val=(1-t)*Math.max(...centers.map(c=>pulse(lo,c)))+t*Math.max(...centers.map(c=>pulse(lo+1,c)));
      if(!near(Array.from(body.morphTargetInfluences),[val,val]))throw Error('Blink mismatch '+f+' '+body.morphTargetInfluences);
      blinkSamples++;
     }
    }
    if(blinkSamples!==561)throw Error('Wrong coverage');
   }
   mixer.stopAllAction();mixer.uncacheRoot(gltf.scene);
   return {peak,quiet,replay,blinkSamples,meshCount:meshes.length,bones:53,errors};
  },{expected,blink,assetName});
  if(hits!==1||errors.length)throw Error('Unexpected asset requests or JS errors '+JSON.stringify({hits,errors}));
  console.log(variant.toUpperCase()+'_REAL_CHROMIUM_FACIAL_PASS',JSON.stringify(result));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
