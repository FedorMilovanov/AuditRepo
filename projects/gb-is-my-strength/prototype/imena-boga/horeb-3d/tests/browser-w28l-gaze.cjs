// Focused real-browser check of the exported gaze channels, not a substitute for scene QA.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const puppeteer=require('puppeteer-core');
const corrective=Boolean(process.env.HOREB_W34F_OUTPUT);
const compact=Boolean(process.env.HOREB_W29C_OUTPUT);
const lash=corrective||compact||Boolean(process.env.HOREB_W29B_OUTPUT);
const brow=lash||Boolean(process.env.HOREB_W28T_OUTPUT);
const blink=brow||Boolean(process.env.HOREB_W28O_OUTPUT);
if([process.env.HOREB_W34F_OUTPUT,process.env.HOREB_W29C_OUTPUT,process.env.HOREB_W29B_OUTPUT,process.env.HOREB_W28T_OUTPUT,process.env.HOREB_W28O_OUTPUT,process.env.HOREB_W28L_OUTPUT].filter(Boolean).length!==1)throw Error('Choose one facial study');
const dir=process.env.HOREB_W34F_OUTPUT||process.env.HOREB_W29C_OUTPUT||process.env.HOREB_W29B_OUTPUT||process.env.HOREB_W28T_OUTPUT||process.env.HOREB_W28O_OUTPUT||process.env.HOREB_W28L_OUTPUT;
if(!dir)throw Error('A facial study output is required');
const variant=corrective?'w34f':compact?'w29c':lash?'w29b':brow?'w28t':blink?'w28o':'w28l';
const assetName=variant+'-actor.glb';
const m=JSON.parse(fs.readFileSync(path.join(dir,corrective?'w34f-manifest.json':compact?'w29c-manifest.json':lash?'w29b-manifest.json':brow?'w28t-manifest.json':blink?'w28o-blink-manifest.json':'w28l-eye-manifest.json'),'utf8'));
const bytes=fs.readFileSync(path.join(dir,assetName));
const status=corrective?'ART_HOLD_W34F_CORRECTIVE_MORPH_TRIAL':compact?'ART_HOLD_W29C_LOSSLESS_COMPACT_TRIAL':lash?'ART_HOLD_W29B_LASH_TRIAL':brow?'ART_HOLD_W28T_BROW_TRIAL':blink?'ART_HOLD_W28O_BLINK_TRIAL':'ART_HOLD_W28L_GAZE_TRIAL';
const hash=corrective?'587c7b0b10d38207a3a305ba71557f8f4ba82abd2ca21fc3389aba5e52009dcf':compact?'0d11d1b64a7b23b60fc1833d82bd938038f43c6369116ed9ac393b7cfa75ea94':lash?'8f11fc78285d4aece03b94554967f4deb3ad191b6a01055784f6a08e16a2c8d1':brow?'689c81ae948f6ba0dca8f338b9a06dcd9f604bee525edea1499ff21c9dac6cb3':blink?'a4c2bad8ee870766717151369ce3de6cda2fdaddc17bf14e43741d4c79397f74':'76fa64646830931c7cfc4e5b17524a7fea1f83c315fe1e7168c9dbf526d14c4b';
if(m.status!==status||m.glb_sha256!==hash||crypto.createHash('sha256').update(bytes).digest('hex')!==hash||bytes.length!==m.glb_bytes)throw Error('Wrong facial asset');
const expected=blink?[1,0,0,.5701439025971043,1,0,0,.5513946836384895]:m.animations.find(a=>a.name==='Mother_GestureTowardsBasket').peak_frame_60;
if(blink&&!brow&&JSON.stringify(m.events)!==JSON.stringify({Mother_QuietIdle:[34,110],Mother_GestureTowardsBasket:[12,91]}))throw Error('Wrong blink schedule');
let sourceBytes=null;
if(corrective){
 const sourceDir=process.env.HOREB_W31F_OUTPUT;
 if(!sourceDir)throw Error('Exact W31f control required');
 sourceBytes=fs.readFileSync(path.join(sourceDir,'w31f-actor.glb'));
 const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
 if(digest(sourceBytes)!=='2a72465f5efb0995926b9641a103365122907174447af1ca61b875366e43eb3b'||m.source_sha256!==digest(sourceBytes))throw Error('Wrong control');
 const a=JSON.parse(fs.readFileSync(path.join(dir,'w34f-static-reimport.json'),'utf8'));
 if(a.glb_sha256!==hash||a.weight_zero_restored!==true||a.baseline.skin_pairs!==118||a.corrected.skin_pairs!==0||a.corrected.prop_hits.length||Object.values(a.corrected.skin_cloth).some(Boolean)||Object.values(a.corrected.cloth_self).some(Boolean)||Object.values(a.corrected.garment_pairs).some(Boolean))throw Error('Missing static reimport proof');
}
if(brow&&!corrective){
 const a=JSON.parse(fs.readFileSync(path.join(dir,compact?'w29c-lash-audit.json':lash?'w29b-lash-audit.json':'w28t-brow-audit.json'),'utf8'));
 if((compact?(m.all_other_json_identical_after_remap!==true||a.source_rows_identical!==true):m.existing_actor_unchanged!==true)||a.actor_sha256!==hash||a.source_sha256!==m.source_sha256||a.clips.length!==2)throw Error('Wrong brow provenance');
 for(const [i,count,step,name] of [[0,417,.25,'Mother_GestureTowardsBasket'],[1,144,1,'Mother_QuietIdle']]){
  const c=a.clips[i];
  if(c.name!==name||c.bad.length||c.rows.length!==count||!c.rows.every((r,j)=>r.frame===1+j*step&&(lash?['skin','eyes','head_cover','brows','self']:['skin','eyes','head_cover']).every(k=>r.overlap_pairs[k]===0)))throw Error('Missing brow audit');
 }
}
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
   if(sourceBytes&&new URL(r.url()).pathname==='/artlab/w31f-actor.glb'){hits++;return r.respond({status:200,contentType:'model/gltf-binary',body:sourceBytes});}
   return r.continue();
  });
  await page.goto((process.env.HOREB_ARTLAB_BASE_URL||'http://127.0.0.1:5194')+'/artlab.html',{waitUntil:'domcontentloaded'});
  const result=await page.evaluate(async({expected,blink,brow,lash,assetName,corrective})=>{
   const THREE=await import('/node_modules/three/build/three.module.js');
   const {GLTFLoader}=await import('/node_modules/three/examples/jsm/loaders/GLTFLoader.js');
   const gltf=await new GLTFLoader().loadAsync('/artlab/'+assetName);
   const source=corrective?await new GLTFLoader().loadAsync('/artlab/w31f-actor.glb'):null;
   const meshes=[];gltf.scene.traverse(o=>{if(o.isSkinnedMesh)meshes.push(o)});
   if(meshes.length!==(lash?9:brow?8:7)||meshes.some(o=>o.skeleton.bones.length!==53))throw Error('Wrong skinned mesh contract');
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
   let blinkSamples=0,comparisonSamples=0,vertexSamples=0,correctiveStats=null;
   const originalMeshes=[];
   if(source)source.scene.traverse(o=>{if(o.isSkinnedMesh)originalMeshes.push(o)});
   const controlMixer=source?new THREE.AnimationMixer(source.scene):null;
   const correctionName='W34e_JointPoseCorrective';
   const tune=corrective?meshes.find(o=>o.morphTargetDictionary?.[correctionName]===0):null;
   if(corrective&&(!tune||tune.geometry.attributes.position.count!==18390||tune.morphTargetInfluences.length!==1))throw Error('Missing tunic correction');
   const comparePose=()=>{
    gltf.scene.updateMatrixWorld(true);source.scene.updateMatrixWorld(true);
    for(const mesh of meshes){
     const ref=originalMeshes.find(o=>o.name===mesh.name);
     if(!ref||mesh.geometry.attributes.position.count!==ref.geometry.attributes.position.count)throw Error('Mesh identity drift '+mesh.name);
     for(let i=0;i<53;i++){
      const a=mesh.skeleton.bones[i],b=ref.skeleton.bones[i];
      if(a.name!==b.name||!near(a.matrixWorld.elements,b.matrixWorld.elements))throw Error('Bone drift '+a.name);
     }
     if(!near(mesh.matrixWorld.elements,ref.matrixWorld.elements))throw Error('Mesh transform drift');
     const w=Array.from(mesh.morphTargetInfluences||[]),r=Array.from(ref.morphTargetInfluences||[]);
     if(mesh.morphTargetDictionary?.[correctionName]!==undefined){
      if(w.pop()!==0)throw Error('Nonzero corrective in existing clip');
     }
     if(!near(w,r))throw Error('Legacy morph drift '+mesh.name);
    }
    comparisonSamples++;
   };
   const compareVertices=()=>{
    const a=new THREE.Vector3(),b=new THREE.Vector3();
    for(const mesh of meshes){
     const ref=originalMeshes.find(o=>o.name===mesh.name);
     for(let i=0;i<mesh.geometry.attributes.position.count;i++){
      mesh.getVertexPosition(i,a);ref.getVertexPosition(i,b);
      if(a.distanceTo(b)>1e-6)throw Error('Legacy skinned vertex drift '+mesh.name+' '+i);
      vertexSamples++;
     }
    }
   };
   if(blink){
    const body=meshes.find(o=>o.morphTargetInfluences?.length===(corrective?3:2)&&o.geometry.attributes.position.count>10000);
    const overlay=brow?meshes.find(o=>o.name==='W28t_CC0_brows'):null;
    if(brow&&(!overlay||overlay.morphTargetDictionary?.blink_left!==0||overlay.morphTargetDictionary?.blink_right!==1||!overlay.material.map||!overlay.material.transparent))throw Error('Missing brow overlay contract');
    const lashes=lash?meshes.find(o=>o.name==='W29b_CC0_lashes'):null;
    if(lash&&(!lashes||lashes.geometry.attributes.position.count!==(corrective?200:220)||lashes.material.transparent||lashes.morphTargetDictionary?.blink_left!==0||lashes.morphTargetDictionary?.blink_right!==1))throw Error('Missing eyelash contract');
    if(!body||body.morphTargetDictionary.blink_left!==0||body.morphTargetDictionary.blink_right!==1)throw Error('Missing eyelid targets');
    if(corrective&&body.morphTargetDictionary[correctionName]!==2)throw Error('Missing body corrective');
    const pulse=(f,c)=>{const x=f-c;if(x< -2||x>4)return 0;if(x>=0&&x<=1)return 1;const t=x<0?(x+2)/2:(4-x)/3;return t*t*(3-2*t)};
    for(const [action,other,centers,last,step] of [[ga,ia,[12,91],105,.25],[ia,ga,[34,110],144,1]]){
     other.stop();action.reset().setLoop(THREE.LoopOnce,1);action.clampWhenFinished=true;action.play();
     if(controlMixer){
      controlMixer.stopAllAction();
      const clip=source.animations.find(c=>c.name===action.getClip().name);
      if(!clip)throw Error('Control clip absent');
      const ca=controlMixer.clipAction(clip).reset().setLoop(THREE.LoopOnce,1);ca.clampWhenFinished=true;ca.play();
     }
     for(let f=1;f<=last;f+=step){
      mixer.setTime(f/24);
      const lo=Math.floor(f),t=f-lo;
      const val=(1-t)*Math.max(...centers.map(c=>pulse(lo,c)))+t*Math.max(...centers.map(c=>pulse(lo+1,c)));
      if(!near(Array.from(body.morphTargetInfluences),corrective?[val,val,0]:[val,val]))throw Error('Blink mismatch '+f+' '+body.morphTargetInfluences);
      if(overlay&&!near(Array.from(overlay.morphTargetInfluences),[val,val]))throw Error('Brow desync '+f);
      if(lashes&&!near(Array.from(lashes.morphTargetInfluences),[val,val]))throw Error('Lash desync '+f);
      if(corrective){controlMixer.setTime(f/24);comparePose();if([1,12,34,60,91,105,110,144].includes(f))compareVertices();}
      blinkSamples++;
     }
    }
    if(blinkSamples!==561)throw Error('Wrong coverage');
    if(corrective){
     mixer.stopAllAction();controlMixer.stopAllAction();
     gltf.scene.updateMatrixWorld(true);source.scene.updateMatrixWorld(true);
     correctiveStats={};
     for(const [mesh,index,count] of [[body,2,792],[tune,0,204]]){
      const v=new THREE.Vector3(),w=new THREE.Vector3(),base=[];
      mesh.morphTargetInfluences[index]=0;
      for(let i=0;i<mesh.geometry.attributes.position.count;i++)base.push(mesh.getVertexPosition(i,new THREE.Vector3()));
      mesh.morphTargetInfluences[index]=1;
      let changed=0,maxDelta=0,maxError=0;
      const attr=mesh.geometry.morphAttributes.position[index];
      const na=mesh.geometry.morphAttributes.normal[index];
      if(!attr||!na||attr.count!==base.length||na.count!==base.length)throw Error('Malformed corrective attributes');
      for(let i=0;i<base.length;i++){
       mesh.getVertexPosition(i,v);
       w.fromBufferAttribute(attr,i);
       if(w.length()>1e-8)changed++;
       maxDelta=Math.max(maxDelta,v.distanceTo(base[i]));
      }
      if(changed!==count||maxDelta<.005||maxDelta>.04)throw Error('Wrong corrective activation '+mesh.name+' '+changed+' '+maxDelta);
      mesh.morphTargetInfluences[index]=0;
      for(let i=0;i<base.length;i++)maxError=Math.max(maxError,mesh.getVertexPosition(i,v).distanceTo(base[i]));
      if(maxError>1e-7)throw Error('Corrective zero did not restore geometry');
      correctiveStats[mesh.name]={changed,maxDeltaMm:maxDelta*1000,restoreErrorMm:maxError*1000};
     }
     if(comparisonSamples!==561||vertexSamples<100000)throw Error('Wrong comparison coverage');
    }
   }
   mixer.stopAllAction();mixer.uncacheRoot(gltf.scene);
   return {peak,quiet,replay,blinkSamples,browSamples:brow?blinkSamples:0,lashSamples:lash?blinkSamples:0,meshCount:meshes.length,bones:53,comparisonSamples,vertexSamples,correctiveStats,errors};
  },{expected,blink,brow,lash,assetName,corrective});
  if(hits!==(corrective?2:1)||errors.length)throw Error('Unexpected asset requests or JS errors '+JSON.stringify({hits,errors}));
  console.log(variant.toUpperCase()+'_REAL_CHROMIUM_FACIAL_PASS',JSON.stringify(result));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
