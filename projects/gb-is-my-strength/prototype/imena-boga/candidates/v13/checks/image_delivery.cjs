const {webkit,chromium}=require('playwright-core');
const {createServer}=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../sozvezdie/dist');
const mimes={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg'};
const server=createServer((req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1').pathname;
  const file=path.resolve(root,decodeURIComponent(url.slice(1)||'index.html'));
  if(file!==path.join(root,'index.html')&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
  if(!fs.existsSync(file)){res.writeHead(404).end();return}
  res.writeHead(200,{'content-type':mimes[path.extname(file)]||'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500).end()}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const uri='http://127.0.0.1:'+server.address().port+'/';
 const results=[];
 try{
  for(const [name,type,opts] of [['chromium',chromium,{executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'}],['webkit',webkit,{}]]){
   const browser=await type.launch({headless:true,...opts});
   try{
    for(const width of [390,1440]){
     const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
     const responseCodes={};
     page.on('response',r=>{if(r.url().includes('/images/'))responseCodes[new URL(r.url()).pathname]=r.status()});
     await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,r=>r.abort());
     await page.goto(uri,{waitUntil:'domcontentloaded'});
     const img=page.locator('img[data-sinai-backdrop]');
     await img.waitFor({state:'attached'});
     await img.evaluate(async el=>el.decode());
     const info=await img.evaluate(el=>({src:el.src,currentSrc:el.currentSrc,naturalWidth:el.naturalWidth,naturalHeight:el.naturalHeight,complete:el.complete,
      bounds:{w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height}}));
     if(!info.currentSrc.endsWith('/images/sinai-dawn.webp')||info.naturalWidth!==1672||info.naturalHeight!==941||responseCodes['/images/sinai-dawn.webp']!==200)throw Error(JSON.stringify({name,width,info,responseCodes}));
     results.push({engine:name,width,naturalWidth:info.naturalWidth,decodedWebp:true,HTTP200:true});
     await page.close();
    }
   }finally{await browser.close()}
  }
 }finally{await new Promise(resolve=>server.close(resolve))}
 console.log(JSON.stringify({status:'PASS',scenarios:results.length,results},null,2));
})().catch(e=>{console.error(e.stack);server.close();process.exitCode=1});
