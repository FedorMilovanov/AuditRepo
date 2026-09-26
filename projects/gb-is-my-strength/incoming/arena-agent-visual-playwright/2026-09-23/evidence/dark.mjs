import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const axe=fs.readFileSync('/tmp/chr/node_modules/axe-core/axe.min.js','utf8');
const R=['/','/articles/','/articles/20-antisovetov-pastoru/','/articles/serdce-i-telo/','/articles/dzhon-gill-chast-1-chelovek/','/articles/lot-i-sodom/','/articles/kod-da-vinchi/','/nagornaya/','/nagornaya/chast-1/','/baptisty-rossii/','/baptisty-rossii/noch-na-kure/','/hard-texts/','/hard-texts/genesis-6/','/biografii/','/about/','/izbrannoe/','/rodosloviye/','/journal/','/podrostok-za-kadrom/','/pastor-series/'];
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,colorScheme:'dark',reducedMotion:'reduce',serviceWorkers:'block'});
await ctx.addInitScript(()=>{try{localStorage.setItem('gb:reader-preferences:v1',JSON.stringify({theme:'dark'}));localStorage.setItem('theme','dark')}catch(e){}});
for(const r of R){const p=await ctx.newPage();await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(900);
 await p.addScriptTag({content:axe});
 const res=await p.evaluate(async()=>{const o=await axe.run(document,{runOnly:['color-contrast']});const v=o.violations[0];
  const light=[...document.querySelectorAll('main *,article *, body > div *')].filter(e=>{const s=getComputedStyle(e);const b=e.getBoundingClientRect();if(b.width<120||b.height<40||b.top>3000)return false;const m=s.backgroundColor.match(/\d+(\.\d+)?/g);if(!m)return false;const [r,g,bb,a=1]=m.map(Number);return a>0.9&&(r+g+bb)/3>225}).slice(0,4).map(e=>e.tagName+'.'+e.className.toString().slice(0,40)+' '+getComputedStyle(e).backgroundColor);
  const darkText=[...document.querySelectorAll('p,li,h1,h2,h3')].filter(e=>{const b=e.getBoundingClientRect();if(!b.height||b.top>3000)return false;const m=getComputedStyle(e).color.match(/\d+/g).map(Number);return (m[0]+m[1]+m[2])/3<60}).slice(0,3).map(e=>e.tagName+'.'+e.className.toString().slice(0,30)+':'+e.textContent.trim().slice(0,25));
  return {theme:document.documentElement.className+' '+(document.documentElement.dataset.theme||''),bg:getComputedStyle(document.body).backgroundColor,contrastNodes:v?v.nodes.length:0,worst:v?v.nodes.map(n=>n.any[0].data).filter(Boolean).sort((a,b)=>a.contrastRatio-b.contrastRatio).slice(0,2).map(d=>d.contrastRatio+' '+d.fgColor+'/'+d.bgColor):[],worstSel:v?v.nodes.slice(0,2).map(n=>n.target.join(' ').slice(0,60)):[],light,darkText}});
 console.log(r,JSON.stringify(res));await p.screenshot({path:`/tmp/aud/dark/${r.replace(/\//g,'_')||'_'}.png`});await p.close();}
await b.close();
