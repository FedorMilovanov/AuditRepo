// Focused real-browser check of the exported gaze channels, not a substitute for scene QA.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const puppeteer=require('puppeteer-core');
const dir=process.env.HOREB_W28L_OUTPUT;
if(!dir)throw Error('HOREB_W28L_OUTPUT required');
const m=JSON.parse(fs.readFileSync(path.join(dir,'w28l-eye-manifest.json'),'utf8'));
const bytes=fs.readFileSync(path.join(dir,'w28l-actor.glb'));
if(m.status!=='ART_HOLD_W28L_GAZE_TRIAL'||m.glb_sha256!=='76fa64646830931c7cfc4e5b17524a7fea1f83c315fe1e7168c9dbf526d14c4b'||crypto.createHash('sha256').update(bytes).digest('hex')!==m.glb_sha256||bytes.length!==m.glb_bytes)throw Error('Wrong gaze asset');
const expected=m.animations.find(a=>a.name==='Mother_GestureTowardsBasket').peak_frame_60;
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
   if(new URL(r.url()).pathname==='/artlab/w28l-actor.glb'){hits++;return r.respond({status:200,contentType:'model/gltf-binary',body:bytes});}
   return r.continue();
  });
  await page.goto((process.env.HOREB_ARTLAB_BASE_URL||'http://127.0.0.1:5194')+'/artlab.html',{waitUntil:'domcontentloaded'});
  const result=await page.evaluate(async(expected)=>{
   const THREE=await import('/node_modules/three/build/three.module.js');
   const {GLTFLoader}=await import('/node_modules/three/examples/jsm/loaders/GLTFLoader.js');
   const gltf=await new GLTFLoader().loadAsync('/artlab/w28l-actor.glb');
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
   mixer.stopAllAction();mixer.uncacheRoot(gltf.scene);
   return {peak,quiet,replay,meshCount:meshes.length,bones:53,errors};
  },expected);
  if(hits!==1||errors.length)throw Error('Unexpected asset requests or JS errors '+JSON.stringify({hits,errors}));
  console.log('W28L_REAL_CHROMIUM_GAZE_PASS',JSON.stringify(result));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
