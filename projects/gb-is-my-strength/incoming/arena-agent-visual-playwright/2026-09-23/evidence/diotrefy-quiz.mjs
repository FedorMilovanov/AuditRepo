import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const p=await (await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block'})).newPage();
await p.goto('http://127.0.0.1:8080/articles/diotrefy-nashego-vremeni/');await p.waitForTimeout(500);
console.log(await p.evaluate(()=>{const w=document.querySelector('#quiz');return {text:w.innerText.slice(0,700),inputs:w.querySelectorAll('input,button,details,label').length,kids:[...w.children].map(c=>c.tagName+'.'+c.className).slice(0,15)}}));
await p.locator('#quiz').scrollIntoViewIfNeeded();await p.locator('#quiz').screenshot({path:process.argv[2]+'/diotrefy-quiz-light.png'});await b.close();
