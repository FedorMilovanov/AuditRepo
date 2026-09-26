import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const SP=`*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}`;
for(const mode of ['320','spacing']){
const c=await b.newContext({viewport:{width:320,height:640},isMobile:true,hasTouch:true,serviceWorkers:'block',reducedMotion:'reduce'});
let bad=0;
for(const r of routes){const p=await c.newPage();try{await p.goto('http://127.0.0.1:8080'+r,{timeout:30000});await p.waitForTimeout(400);
 if(mode==='spacing'){await p.addStyleTag({content:SP});await p.waitForTimeout(200);}
 const m=await p.evaluate(()=>{const W=document.documentElement.clientWidth;
  const over=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);if(s.position==='fixed'||s.display==='none'||s.visibility==='hidden')return false;if(e.closest('pre,code,table,.table-scroll,[class*=scroll],svg,canvas,[aria-hidden=true],.sr-only'))return false;const b=e.getBoundingClientRect();return b.width>0&&b.right>W+4&&b.left<W&&e.children.length===0&&e.textContent.trim().length>1}).slice(0,3).map(e=>e.tagName+'.'+e.className.toString().slice(0,28)+'«'+e.textContent.trim().slice(0,18)+'» r='+Math.round(e.getBoundingClientRect().right));
  const clip=mode=>0;
  const clipped=[...document.querySelectorAll('button,a,h1,h2,h3,span,p')].filter(e=>{const s=getComputedStyle(e);return (s.overflow==='hidden'||s.overflowX==='hidden')&&s.textOverflow!=='ellipsis'&&e.scrollWidth>e.clientWidth+3&&e.clientWidth>0&&e.textContent.trim().length>2&&!e.closest('.sr-only,[aria-hidden=true]')}).slice(0,3).map(e=>e.tagName+'.'+e.className.toString().slice(0,28)+'«'+e.textContent.trim().slice(0,18)+'» '+e.scrollWidth+'>'+e.clientWidth);
  return {sw:document.documentElement.scrollWidth,W,over,clipped}});
 if(m.sw>m.W+1||m.over.length||m.clipped.length){bad++;console.log(mode,r,JSON.stringify(m))}}catch(e){console.log('ERR',r)}await p.close();}
console.log('== mode',mode,'routes with issues',bad,'/',routes.length);await c.close();}
await b.close();
