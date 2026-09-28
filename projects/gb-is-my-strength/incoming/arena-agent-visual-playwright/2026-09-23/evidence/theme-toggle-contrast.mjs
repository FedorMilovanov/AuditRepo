import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});const c=await b.newContext({viewport:{width:1280,height:800},serviceWorkers:'block'});
const bad=[];let n=0;
for(const r of routes){const p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r).catch(()=>{});await p.waitForTimeout(400);
 const t=p.locator('.theme-toggle:visible').first();if(await t.count()){n++;const box=await t.boundingBox();
  const buf=await p.screenshot({clip:box});const {data,w}=await p.evaluate(async b64=>{const i=new Image();i.src='data:image/png;base64,'+b64;await i.decode();const cv=document.createElement('canvas');cv.width=i.width;cv.height=i.height;const x=cv.getContext('2d');x.drawImage(i,0,0);return {data:[...x.getImageData(0,0,i.width,i.height).data],w:i.width}},buf.toString('base64'));
  const L=[];for(let k=0;k<data.length;k+=4){const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};L.push(.2126*f(data[k])+.7152*f(data[k+1])+.0722*f(data[k+2]))}L.sort((a,b)=>a-b);
  const lo=L[Math.floor(L.length*.02)],hi=L[Math.floor(L.length*.98)];const cr=(hi+.05)/(lo+.05);if(cr<3)bad.push(r+' '+cr.toFixed(2))}
 await p.close()}
console.log('theme-toggle visible on',n,'routes; icon/background contrast <3:1 on',bad.length);console.log(bad.join('\n'));await b.close();
