import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const p=await b.newPage({viewport:{width:1440,height:900}});await p.goto('http://127.0.0.1:8080/articles/20-antisovetov-pastoru/');await p.waitForTimeout(1000);
const inner=p.locator('.map-trigger[data-tip="19"]');await inner.scrollIntoViewIfNeeded();await inner.click();await p.waitForTimeout(700);
const vis=await p.evaluate(()=>[...document.querySelectorAll('[role=tooltip],[class*=tip]:not(.map-trigger),[role=dialog]')].filter(e=>{const b=e.getBoundingClientRect();return b.height>20&&getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).opacity!=='0'}).map(e=>(e.className.toString().slice(0,30))+': '+e.textContent.trim().slice(0,70)));
console.log('after click inner(19):',JSON.stringify(vis,null,1));
await p.screenshot({path:'/tmp/aud/tip_nested.png'});await b.close();
