import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:2,colorScheme:'dark',reducedMotion:'reduce'});
await c.addInitScript(()=>{localStorage.setItem('gb:reader-preferences:v1',JSON.stringify({theme:'dark'}));localStorage.setItem('theme','dark')});
const E=process.argv[2];
for(const [r,sel,name] of [['/articles/diotrefy-nashego-vremeni/','#gill-search-p-210','diotrefy-dark-invisible-text'],['/nagornaya/chast-4/','.ng-claim-card','nagornaya-ch4-dark-claim-card'],['/journal/dossiers/g3/','.kicker','g3-dossier-dark-kicker']]){
const p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(800);
const el=p.locator(sel).first();await el.scrollIntoViewIfNeeded();await p.waitForTimeout(300);
const info=await el.evaluate(e=>{let a=e,bgs=[];while(a){const s=getComputedStyle(a);if(s.backgroundColor!=='rgba(0, 0, 0, 0)'){bgs.push(a.tagName+'.'+a.className.toString().slice(0,40)+' '+s.backgroundColor);break}a=a.parentElement}return {text:e.textContent.trim().slice(0,90),color:getComputedStyle(e).color,bg:bgs[0],parentHtml:e.parentElement.outerHTML.slice(0,200)}});
console.log(r,JSON.stringify(info));
const bx=await el.boundingBox();await p.screenshot({path:`${E}/${name}.png`,clip:{x:0,y:Math.max(0,bx.y-60),width:390,height:Math.min(500,bx.height+140)}});await p.close();}
await b.close();
