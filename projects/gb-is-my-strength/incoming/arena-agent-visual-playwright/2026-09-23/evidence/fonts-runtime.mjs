import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const c=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});const out={};
for(const r of routes){const p=await c.newPage();const unused=[];p.on('console',m=>{if(/preloaded using link preload but not used/.test(m.text()))unused.push(m.text().match(/fonts\/[^ ']+/)?.[0])});
 await p.goto('http://127.0.0.1:8080'+r).catch(()=>{});await p.waitForTimeout(3500);
 const d=await p.evaluate(async()=>{await document.fonts.ready;const faces=[...document.fonts];const declared=[...new Set(faces.map(f=>f.family.replace(/"/g,'')))];
  const want=new Set();for(const e of [document.querySelector('h1'),document.querySelector('main p'),document.body].filter(Boolean)){want.add(getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g,'').trim())}
  const missing=[...want].filter(f=>!/^(Georgia|serif|sans-serif|system-ui|-apple-system|Times New Roman|Arial|inherit)$/i.test(f)&&!declared.includes(f));
  return {declared:declared.length,missing,want:[...want]}});
 d.unusedPreload=[...new Set(unused)];if(d.missing.length||d.unusedPreload.length)out[r]=d;await p.close()}
fs.writeFileSync(process.argv[2],JSON.stringify(out,null,1));
console.log('routes with issues',Object.keys(out).length);for(const [r,d] of Object.entries(out))console.log(r.padEnd(50),'declared',d.declared,'missing',JSON.stringify(d.missing),'unusedPreload',d.unusedPreload.length);
await b.close();
