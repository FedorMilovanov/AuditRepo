const {chromium}=require('playwright-core');
const {createServer}=require('node:http');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer((req,res)=>{
 try{
  const route=new URL(req.url||'/','http://127.0.0.1').pathname;
  const match=/^\/(atlas|sozvezdie)\/(.*)$/.exec(route);
  if(!match){res.writeHead(404).end();return}
  const base=path.resolve(root,match[1],'dist');
  const filename=path.resolve(base,decodeURIComponent(match[2]||'index.html'));
  if(filename!==path.join(base,'index.html')&&!filename.startsWith(base+path.sep)){res.writeHead(403).end();return}
  if(!fs.existsSync(filename)){res.writeHead(404).end();return}
  res.writeHead(200,{'content-type':MIME[path.extname(filename)]||'application/octet-stream'});
  fs.createReadStream(filename).pipe(res);
 }catch(e){res.writeHead(500).end()}
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 const results=[];
 try{
  const atlas=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  await atlas.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,r=>r.abort());
  const requests=[],errors=[];atlas.on('request',r=>{if(r.url().startsWith(origin))requests.push(r.url())});
  atlas.on('pageerror',e=>errors.push(e.message));
  await atlas.goto(origin+'/atlas/',{waitUntil:'load'});
  await atlas.locator('h1').first().waitFor({state:'visible'});
  await atlas.waitForTimeout(350);
  if(requests.some(x=>x.includes('TheologicalQuiz-')))throw Error('Atlas optional quiz downloaded at initial load');
  results.push('Atlas primary modal is eager, optional quiz absent on initial load');
  const trigger=atlas.locator('button[title*="Нажмите"]').first();
  await trigger.focus();
  await trigger.click();
  await atlas.getByRole('dialog').first().waitFor({state:'visible',timeout:10000});
  if(requests.some(x=>x.includes('DivineNameModal-')))throw Error('Primary modal incorrectly split into deferred JS');
  // Modal intentionally schedules focus after first paint (40ms). Wait for the
  // accessibility invariant rather than measuring before that effect runs.
  await atlas.waitForFunction(()=>!!document.querySelector('[role="dialog"]')?.contains(document.activeElement),null,{timeout:2500});
  await atlas.keyboard.press('Escape');
  await atlas.getByRole('dialog').first().waitFor({state:'hidden'});
  results.push('Atlas primary modal opens with focus and Escape without extra module request');
  const placeholder=atlas.locator('[aria-label="Богословский тест"][aria-busy="true"]');
  if(await placeholder.count()===0)throw Error('Quiz placeholder absent (eager or early loading)');
  await placeholder.scrollIntoViewIfNeeded();
  await atlas.waitForResponse(r=>r.url().includes('TheologicalQuiz-') && r.status()===200,{timeout:10000});
  results.push('Atlas quiz module fetched only when near viewport');
  if(errors.length)throw Error('Atlas runtime errors '+JSON.stringify(errors));
  await atlas.close();

  const reader=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await reader.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,r=>r.abort());
  const reqB=[],errB=[];reader.on('request',r=>{if(r.url().startsWith(origin))reqB.push(r.url())});
  reader.on('pageerror',e=>errB.push(e.message));
  await reader.goto(origin+'/sozvezdie/',{waitUntil:'load'});
  await reader.locator('h1').first().waitFor({state:'visible'});
  if(reqB.some(x=>x.includes('MobileIndex-')))throw Error('Core MobileIndex incorrectly split into deferred JS');
  results.push('Reader mobile index is part of core app without split request');
  // Navigate through existing grid CTA; reading state should trigger on entering articles.
  await reader.locator('#sozvezdie').scrollIntoViewIfNeeded();
  await reader.locator('#sozvezdie button[aria-label*="Эль Шадда"]').first().click();
  await reader.getByRole('button',{name:'Открыть список имён'}).waitFor({state:'visible',timeout:10000});
  await reader.getByRole('button',{name:'Открыть список имён'}).click();
  await reader.getByRole('dialog',{name:'Указатель библейских выражений'}).waitFor({state:'visible'});
  await reader.keyboard.press('Escape');
  await reader.getByRole('dialog',{name:'Указатель библейских выражений'}).waitFor({state:'hidden'});
  if(errB.length)throw Error('Reader runtime errors '+JSON.stringify(errB));
  results.push('Reader mobile index opens immediately in article and closes with Escape');
  await reader.close();
 }finally{await browser.close();await new Promise(r=>server.close(r))}
 console.log(JSON.stringify({status:'PASS',checks:results.length,results},null,2));
})().catch(e=>{console.error(e.stack);process.exitCode=1;server.close()});
