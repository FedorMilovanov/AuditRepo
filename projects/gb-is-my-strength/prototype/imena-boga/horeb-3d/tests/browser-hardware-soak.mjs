// Optional local NVIDIA GPU soak. Not part of per-commit CI:
//   HOREB_BROWSER_PATH=... HOREB_SOAK_SAMPLES=18 node tests/browser-hardware-soak.mjs
// Temperature/VRAM hard stops; genuine Chrome WebGL + nvidia-smi readings.
// Samples are ~6s each; 18 samples cover 108s over all eight zones.
// This does not replace physical-device, 15-minute or frametime-P95 acceptance.
import puppeteer from 'puppeteer-core';
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

function gpu(){
 try{
  const csv=execFileSync('nvidia-smi',['--query-gpu=temperature.gpu,memory.used,memory.total,utilization.gpu,power.draw','--format=csv,noheader,nounits'],{encoding:'utf8',timeout:3500}).trim();
  const vals=csv.split(',').map(s=>Number.parseFloat(s.trim()));
  if(vals.some(v=>!Number.isFinite(v)))return {error:csv};
  return {tempC:vals[0],vramMiB:vals[1],totalMiB:vals[2],gpuPct:vals[3],watt:vals[4]};
 }catch(e){return {error:String(e)}}
}
const executables = [process.env.HOREB_BROWSER_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome',
  '/usr/bin/chromium'].filter(Boolean);
const executablePath = executables.find(existsSync);
if (!executablePath) throw new Error('Hardware soak requires installed Chrome/Chromium');
const args = process.env.HOREB_NO_SANDBOX === '1' ? ['--no-sandbox'] : [];
const browser=await puppeteer.launch({executablePath,headless:true,args});
const page=await browser.newPage();
await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
const base=(process.env.HOREB_BASE_URL||'http://127.0.0.1:5173').replace(/\/$/,'');
await page.goto(base+'/?e2e',{waitUntil:'domcontentloaded'});
await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>/Начать|Продолжить/.test(b.textContent))?.click());
await page.waitForFunction(()=>window.__horeb?.world,{timeout:45000});
const renderer=await page.evaluate(()=>{const gl=window.__horeb.world.renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');return ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'UNKNOWN'});
console.log('SUSTAINED_RENDERER',renderer);
if (!/NVIDIA/i.test(renderer) || /SwiftShader/i.test(renderer)) {
  await browser.close();
  throw new Error('This is NVIDIA hardware evidence; unsupported/SwiftShader renderer: '+renderer);
}
const records=[];
const N=Number(process.env.HOREB_SOAK_SAMPLES || 18);
if (!Number.isInteger(N) || N<8 || N>150) {
  await browser.close();
  throw new Error('HOREB_SOAK_SAMPLES must be an integer in [8,150]');
}
const MAX_TEMP_C=Number(process.env.HOREB_SOAK_MAX_TEMP_C || 79);
if (!Number.isFinite(MAX_TEMP_C) || MAX_TEMP_C < 45 || MAX_TEMP_C > 85) {
  await browser.close();
  throw new Error('HOREB_SOAK_MAX_TEMP_C must be a finite safe threshold (45..85°C)');
}
for(let i=0;i<N;i++){
 const zone=i%8;
 await page.evaluate(z=>window.__horeb.world.teleportZone(z),zone);
 await new Promise(resolve=>setTimeout(resolve,5000));
 const browserSample=await page.evaluate(async()=>{
  const w=window.__horeb.world,begin=w.renderer.info.render.frame;
  const t0=performance.now();
  await new Promise(r=>setTimeout(r,1000));
  const elapsed=performance.now()-t0;
  return {fpsMeasured:Math.round((w.renderer.info.render.frame-begin)*1000/elapsed),
   fpsReported:w.fps,calls:w.renderer.info.render.calls,triangles:w.renderer.info.render.triangles,
   textures:w.renderer.info.memory.textures,geometries:w.renderer.info.memory.geometries,
   contextLost:w.renderer.getContext().isContextLost(),zone:window.__horeb.state().zone,quality:w.settings.quality,
   canvasCount:document.querySelectorAll('canvas').length};
 });
 const hardware=gpu();
 const entry={sample:i+1,sec:Math.round((i+1)*6),requestedZone:zone,...browserSample,...hardware};records.push(entry);
 console.log('SUSTAINED_SAMPLE',JSON.stringify(entry));
 if(hardware.error){console.error('SUSTAINED_ABORT_GPU_QUERY',hardware.error);break}
 if(hardware.tempC>=MAX_TEMP_C||hardware.vramMiB>=11000||browserSample.contextLost||
  browserSample.canvasCount!==1||browserSample.zone!==zone||browserSample.quality!=='high'||errors.length){
  console.error('SUSTAINED_ABORT_SAFETY_OR_CONTEXT',JSON.stringify(entry));break;
 }
}
const complete=records.length===N&&!errors.length &&
  records.every(x=>!x.contextLost&&x.tempC<MAX_TEMP_C&&x.vramMiB<11000&&
    x.zone===x.requestedZone&&x.quality==='high'&&x.fpsMeasured>=45);
const result={renderer,complete,seconds:records.length*6,expectedSeconds:N*6,errors,records,minMeasuredFps:Math.min(...records.map(x=>x.fpsMeasured)),maxTempC:Math.max(...records.map(x=>x.tempC)),maxVRAMMiB:Math.max(...records.map(x=>x.vramMiB)),
limits:{temperatureAbortC:MAX_TEMP_C,zoneSeconds:6,
  note:'Whole-device nvidia-smi VRAM includes other processes; measurement is not the application allocation. Camera-only high mode, no physical WASD traversal. Not mobile, frame-time p95 or a 15-minute soak.'}};
const dir=path.join(process.cwd(),'.test-build');mkdirSync(dir,{recursive:true});writeFileSync(path.join(dir,'rtx-latest-soak.json'),JSON.stringify(result,null,2)+'\n','utf8');
console.log('SUSTAINED_SUMMARY',JSON.stringify({complete,seconds:result.seconds,minMeasuredFps:result.minMeasuredFps,maxTempC:result.maxTempC,maxVRAMMiB:result.maxVRAMMiB,errors:errors.length}));
await browser.close();if(!complete)process.exitCode=1;