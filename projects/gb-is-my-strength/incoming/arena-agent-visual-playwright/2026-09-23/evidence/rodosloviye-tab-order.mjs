import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const p=await b.newPage({viewport:{width:390,height:844}});await p.goto('http://127.0.0.1:8080/rodosloviye/');await p.waitForTimeout(800);await p.evaluate(()=>document.activeElement.blur());
for(let i=0;i<4;i++){await p.keyboard.press('Tab');await p.waitForTimeout(600);console.log(i+1,await p.evaluate(()=>{const a=document.activeElement,R=a.getBoundingClientRect();return a.outerHTML.slice(0,160)+' | rect '+[R.left,R.top,R.width,R.height].map(Math.round)}))}
await b.close();
