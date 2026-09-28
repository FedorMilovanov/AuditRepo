import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});const p=await b.newPage({viewport:{width:768,height:500}});
await p.goto('http://127.0.0.1:8080/');await p.waitForTimeout(600);await p.screenshot({path:process.argv[2]+'/home-768-header-overflow.png',clip:{x:0,y:0,width:768,height:120}});await b.close();
