import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const p=await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:3});await p.goto('http://127.0.0.1:8080/');await p.waitForTimeout(800);
const sel='button[aria-label="Поиск по всему сайту"]';
const st=async()=>p.evaluate(s=>{const e=document.querySelector(s);const c=getComputedStyle(e);return {border:c.borderColor+' '+c.borderWidth+' '+c.borderStyle,outline:c.outlineStyle,bg:c.backgroundColor}},sel);
console.log('unfocused',JSON.stringify(await st()));
const box=await p.locator(sel).boundingBox();const clip={x:box.x-10,y:box.y-10,width:box.width+80,height:box.height+20};
await p.screenshot({path:'/tmp/aud/kbd_s0.png',clip});
for(let i=0;i<12;i++){await p.keyboard.press('Tab');if(await p.evaluate(s=>document.activeElement.matches(s),sel))break}
console.log('focused',JSON.stringify(await st()));await p.screenshot({path:'/tmp/aud/kbd_s1.png',clip});
await b.close();
