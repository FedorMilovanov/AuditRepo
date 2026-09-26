import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
for(const u of ['/nope','/articles/nope/','/articles/kod-da-vinchi/nope/deeper']){
 const p=await b.newPage({viewport:{width:390,height:844}});const bad=[];
 p.on('response',s=>{if(s.status()>=400&&!s.url().endsWith(u))bad.push(s.status()+' '+s.url().replace('http://127.0.0.1:8090',''))});
 const r=await p.goto('http://127.0.0.1:8090'+u);await p.waitForTimeout(800);
 const st=await p.evaluate(()=>({title:document.title,bg:getComputedStyle(document.body).backgroundColor,font:getComputedStyle(document.body).fontFamily.slice(0,30),sheets:document.styleSheets.length}));
 console.log(u,r.status(),JSON.stringify(st),'\n   bad:',bad.join(' | '));
 await p.screenshot({path:`/tmp/aud/404${u.replace(/\//g,'_')}.png`});await p.close();}
await b.close();
