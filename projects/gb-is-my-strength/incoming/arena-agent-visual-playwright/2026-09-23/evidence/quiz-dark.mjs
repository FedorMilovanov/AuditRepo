import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n').filter(r=>/articles|nagornaya|baptisty|hard-texts|podrostok/.test(r));
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const c=await b.newContext({viewport:{width:390,height:844},colorScheme:'dark',serviceWorkers:'block',reducedMotion:'reduce'});
await c.addInitScript(()=>{localStorage.setItem('gb:reader-preferences:v1',JSON.stringify({theme:'dark'}));localStorage.setItem('theme','dark')});
const lum=s=>{const m=s.match(/[\d.]+/g).map(Number);return m[0]*.299+m[1]*.587+m[2]*.114};
const st=p=>p.evaluate(()=>{const w=[...document.querySelectorAll('.quiz-wrapper')].find(x=>x.getBoundingClientRect().height>0);if(!w)return null;const q=w.querySelector('#quizQuestion,h2,h3,p');return {bg:getComputedStyle(w).backgroundColor,fg:getComputedStyle(q||w).color,h:Math.round(w.getBoundingClientRect().height)}});
let n=0,bad=[];
for(const r of routes){const p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(400);
 if(!await p.locator('.quiz-wrapper').count()){await p.close();continue}
 let s=await st(p),how='inline';
 if(!s){const l=p.locator('#quizLaunch:visible, .quiz-launch:visible').first();if(await l.count()){await l.scrollIntoViewIfNeeded().catch(()=>{});await l.click({timeout:4000}).catch(()=>{});await p.waitForTimeout(600);s=await st(p);how='launched'}}
 n++;const broken=s&&lum(s.bg)>180&&lum(s.fg)>180;if(broken)bad.push(r);
 console.log((s?(broken?'BROKEN':'ok    '):'NOTSHOWN'),how.padEnd(8),r.padEnd(56),JSON.stringify(s));
 if(broken&&bad.length===1||r.includes('chast-2')&&broken){const w=p.locator('.quiz-wrapper').filter({has:p.locator('*')});const vis=await p.$$('.quiz-wrapper');for(const e of vis){if((await e.boundingBox())?.height){await e.scrollIntoViewIfNeeded();await e.screenshot({path:process.argv[2]+'/quiz-dark-'+r.split('/').filter(Boolean).pop()+'.png'});break}}}
 await p.close();}
console.log('QUIZ ROUTES',n,'BROKEN',bad.length);await b.close();
