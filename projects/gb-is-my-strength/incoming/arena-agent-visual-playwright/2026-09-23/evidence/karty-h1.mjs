import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
for(const w of [320,360,390,430]){const p=await b.newPage({viewport:{width:w,height:800}});await p.goto('http://127.0.0.1:8080/karty/');await p.waitForTimeout(500);
console.log(w,JSON.stringify(await p.evaluate(()=>{const h=document.querySelector('h1');const cs=getComputedStyle(h);const r=document.createRange();r.selectNodeContents(h);const lines=[...r.getClientRects()].length;
return {fs:cs.fontSize,ff:cs.fontFamily.slice(0,60),wb:cs.wordBreak,ow:cs.overflowWrap,hy:cs.hyphens,w:Math.round(h.getBoundingClientRect().width),lines,loaded:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family).slice(0,6)}})));await p.close()}
await b.close();
