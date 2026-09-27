import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const E=process.argv[2];
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const res=[];
for(const [r,mob] of [['/articles/lot-i-sodom/',true],['/articles/lot-i-sodom/',false],['/nagornaya/chast-1/',true],['/',false],['/articles/kod-da-vinchi/',false]]){
 const c=await b.newContext({viewport:mob?{width:390,height:844}:{width:1366,height:900},forcedColors:'active',isMobile:mob,hasTouch:mob});const p=await c.newPage();
 await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(700);await p.evaluate(()=>document.activeElement.blur());
 let none=0,tot=0;const ex=[];
 for(let i=0;i<25;i++){await p.keyboard.press('Tab');await p.waitForTimeout(60);const d=await p.evaluate(()=>{const a=document.activeElement;if(!a||a===document.body)return null;const s=getComputedStyle(a);const R=a.getBoundingClientRect();if(R.width<2)return null;
  const ow=parseFloat(s.outlineWidth)||0;const vis=s.outlineStyle!=='none'&&ow>0;const border=parseFloat(s.borderTopWidth)>0&&s.borderTopStyle!=='none';return {vis,border,k:a.tagName+'.'+String(a.className).split(' ')[0]+' "'+(a.getAttribute('aria-label')||a.textContent.trim()).slice(0,20)+'"',o:s.outlineStyle+' '+s.outlineWidth}});
  if(!d)continue;tot++;if(!d.vis){none++;if(ex.length<4)ex.push(d.k+' outline='+d.o+(d.border?' (has border)':''))}}
 res.push({r,mob,tot,noOutline:none,ex});console.log(mob?'m':'d',r,'focused',tot,'no outline in FC',none,JSON.stringify(ex));await c.close()}
await b.close();
