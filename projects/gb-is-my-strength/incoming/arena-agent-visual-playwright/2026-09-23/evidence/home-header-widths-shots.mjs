import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
for(const [w,h] of [[820,1180],[844,390]]){const p=await b.newPage({viewport:{width:w,height:h}});await p.goto('http://127.0.0.1:8080/');await p.waitForTimeout(600);await p.screenshot({path:`${process.argv[2]}/home-${w}x${h}-header.png`,clip:{x:0,y:0,width:w,height:110}});await p.close()}
await b.close();
