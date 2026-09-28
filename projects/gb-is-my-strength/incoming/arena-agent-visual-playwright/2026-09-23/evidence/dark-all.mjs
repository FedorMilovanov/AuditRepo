import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const axe=fs.readFileSync('/tmp/chr/node_modules/axe-core/axe.min.js','utf8');
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,colorScheme:'dark',reducedMotion:'reduce',serviceWorkers:'block'});
await c.addInitScript(()=>{try{localStorage.setItem('gb:reader-preferences:v1',JSON.stringify({theme:'dark'}));localStorage.setItem('theme','dark')}catch(e){}});
const out=[];
for(const r of routes){const p=await c.newPage();try{await p.goto('http://127.0.0.1:8080'+r,{timeout:30000});await p.waitForTimeout(500);await p.addScriptTag({content:axe});
 const x=await p.evaluate(async()=>{const o=await axe.run(document,{runOnly:['color-contrast']});const v=o.violations[0];const d=v?v.nodes.map(n=>({t:n.target.join(' ').slice(0,70),d:n.any[0]?.data})).filter(n=>n.d):[];
  return {dark:document.documentElement.classList.contains('dark'),n:d.length,severe:d.filter(n=>n.d.contrastRatio<3).length,worst:d.sort((a,b)=>a.d.contrastRatio-b.d.contrastRatio).slice(0,3).map(n=>n.d.contrastRatio+' '+n.d.fgColor+'/'+n.d.bgColor+' '+n.t)}});
 out.push({r,...x});}catch(e){out.push({r,err:String(e).slice(0,80)})}await p.close();}
fs.writeFileSync(process.argv[2],JSON.stringify(out,null,1));await b.close();
