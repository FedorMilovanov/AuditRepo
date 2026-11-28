/** Loopback-only isolated lab server. No production build or model copies. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const here=path.dirname(fileURLToPath(import.meta.url));
const vendor=path.resolve(here,'../../../node_modules/three');
const specs={
 actor:{relative:'W39c-approach-20261128/w38a-handoff.glb',sha256:'17028ece670f5a496ce0568f26be765fed7a618b84cdd62861269fc8d911998c',bytes:58122448},
 house:{relative:'W28-house-20261125/w28-house.glb',sha256:'fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622',bytes:7748636}
};
export async function verifyAssets(root){
 const out={};
 for(const [name,s] of Object.entries(specs)){
  const file=path.resolve(root,s.relative),stat=await fs.promises.stat(file);
  if(stat.size!==s.bytes)throw Error('Wrong '+name+' size');
  const hash=createHash('sha256');for await(const chunk of fs.createReadStream(file))hash.update(chunk);
  if(hash.digest('hex')!==s.sha256)throw Error('Wrong '+name+' digest');
  out[name]={file,sha256:s.sha256,bytes:s.bytes};
 }
 return out;
}
export async function makeServer(root){
 const assets=await verifyAssets(root);
 const manifest=JSON.stringify({actor:{sha256:assets.actor.sha256,bytes:assets.actor.bytes},house:{sha256:assets.house.sha256,bytes:assets.house.bytes},settleDeltaM:-.011000039951334027,duration:4.7});
 return http.createServer((req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return}
  // Reject arbitrary host names (DNS rebinding), not just remote bind.
  if(!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(req.headers.host||'')){res.writeHead(403);res.end();return}
  const url=new URL(req.url,'http://127.0.0.1'),pathname=url.pathname;
  if(pathname==='/manifest.json'){res.writeHead(200,{'Content-Type':'application/json','Content-Length':Buffer.byteLength(manifest)});res.end(req.method==='HEAD'?undefined:manifest);return}
  let file,type;
  if(pathname==='/'){file=path.join(here,'index.html');type='text/html; charset=utf-8'}
  else if(['/scene.mjs','/viewer.mjs','/cpu-morphs.mjs','/camera.mjs'].includes(pathname)){file=path.join(here,pathname.slice(1));type='text/javascript; charset=utf-8'}
  else if(pathname==='/assets/actor.glb'||pathname==='/assets/house.glb'){file=assets[pathname.includes('actor')?'actor':'house'].file;type='model/gltf-binary'}
  else if(/^\/vendor\/three\/(?:build|examples\/jsm)\/[A-Za-z0-9_./-]+\.js$/.test(pathname)){
   file=path.resolve(vendor,pathname.slice('/vendor/three/'.length));type='text/javascript; charset=utf-8';
   if(!file.startsWith(vendor+path.sep)){res.writeHead(404);res.end();return}
  }
  if(!file){res.writeHead(404);res.end();return}
  fs.stat(file,(err,stat)=>{
   if(err||!stat.isFile()){res.writeHead(404);res.end();return}
   res.writeHead(200,{'Content-Type':type,'Content-Length':stat.size});
   if(req.method==='HEAD'){res.end();return}
   const stream=fs.createReadStream(file);stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
  });
 });
}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
 const root=process.env.HOREB_EVIDENCE_ROOT;if(!root)throw Error('Set HOREB_EVIDENCE_ROOT to the exact local evidence directory');
 const port=Number(process.env.HOREB_W39_PORT||5197);if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Invalid port');
 const server=await makeServer(root);server.listen(port,'127.0.0.1',()=>console.log('HOREB lab http://127.0.0.1:'+port));
 for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>server.close());
}
