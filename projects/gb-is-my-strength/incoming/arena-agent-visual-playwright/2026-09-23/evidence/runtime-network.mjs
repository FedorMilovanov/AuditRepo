import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const c=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
const bad={},broken={},errs={};
for(const r of routes){const p=await c.newPage();
 p.on('response',x=>{const u=x.url();if(u.startsWith('http://127.0.0.1:8080')&&x.status()>=400)(bad[u.slice(21)]??=new Set()).add(r)});
 p.on('pageerror',e=>(errs[e.message.slice(0,120)]??=new Set()).add(r));
 await p.goto('http://127.0.0.1:8080'+r).catch(()=>{});
 await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}});await p.waitForTimeout(500);
 const bi=await p.evaluate(()=>[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.getAttribute('src')&&!i.src.startsWith('https://gospod-bog.ru')&&i.getBoundingClientRect().width>0).map(i=>i.getAttribute('src')));
 for(const s of bi)(broken[s]??=new Set()).add(r);await p.close()}
const S=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k,[...v]]));
fs.writeFileSync(process.argv[2],JSON.stringify({http4xx:S(bad),brokenImages:S(broken),pageErrors:S(errs)},null,1));
for(const [n,o] of [['4xx',bad],['brokenImg',broken],['pageerror',errs]]){console.log(n,Object.keys(o).length);for(const [k,v] of Object.entries(o).slice(0,10))console.log('  ',k.slice(0,100),v.size,[...v].slice(0,2).join(' '))}
await b.close();
