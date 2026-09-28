import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const E=process.argv[2];const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'});
const hid=[];let shot=false;
for(const r of routes){const p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r).catch(()=>{});await p.waitForTimeout(900);
 const d=await p.evaluate(()=>{const bar=document.querySelector('.mcp-icon')?.closest('[class*=mcp]:not(.mcp-icon)')||document.querySelector('.mcp-icon')?.parentElement;if(!bar)return null;const R=document.querySelector('.mcp-icon').getBoundingClientRect();return {top:Math.round(R.top),bar:String(bar.className).slice(0,40),scrollY}});
 if(d&&d.top<0){hid.push(r+' top='+d.top);if(!shot){shot=true;await p.screenshot({path:E+'/mcp-hidden-at-top-'+r.split('/').filter(Boolean).join('-')+'.png',clip:{x:0,y:0,width:390,height:160}})}}
 await p.close()}
console.log('mobile top chrome off-screen at scrollY=0:',hid.length,JSON.stringify(hid));await b.close();
