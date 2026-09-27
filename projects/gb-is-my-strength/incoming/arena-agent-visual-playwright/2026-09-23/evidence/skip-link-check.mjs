import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const E=process.argv[2];
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const res={};
for(const r of ['/articles/lot-i-sodom/','/','/articles/','/nagornaya/chast-1/','/articles/dzhon-gill-chast-1-chelovek/','/baptisty-rossii/','/rodosloviye/']){
for(const [v,vp] of [['d',{width:1366,height:900}],['m',{width:390,height:844}]]){
const p=await b.newPage({viewport:vp});await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(500);await p.evaluate(()=>document.activeElement.blur());
await p.keyboard.press('Tab');await p.waitForTimeout(900);
const d=await p.evaluate(()=>{const a=document.activeElement,R=a.getBoundingClientRect(),s=getComputedStyle(a);const cov=document.elementFromPoint(Math.max(1,R.left+R.width/2),Math.max(1,Math.min(innerHeight-1,R.top+R.height/2)));
 return {isSkip:a.classList.contains('skip-link'),txt:a.textContent.trim().slice(0,22),top:Math.round(R.top),bottom:Math.round(R.bottom),tr:s.transform,z:s.zIndex,pos:s.position,coveredBy:cov&&cov!==a&&!a.contains(cov)?cov.tagName+'.'+String(cov.className).slice(0,30):null}});
res[v+' '+r]=d;console.log(v,r.padEnd(40),JSON.stringify(d));
if(r==='/articles/lot-i-sodom/')await p.screenshot({path:`${E}/skip-link-focused-${v}.png`,clip:{x:0,y:0,width:vp.width,height:110}});
await p.close()}}
await b.close();
