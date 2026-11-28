const {chromium,webkit}=require('playwright-core');
const {createServer}=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const M={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
const server=createServer((req,res)=>{
 try{
  const part=/^\/(atlas|sozvezdie)\/(.*)$/.exec(new URL(req.url,'http://127.0.0.1').pathname);
  if(!part){res.writeHead(404).end();return}
  const dir=path.resolve(root,part[1],'dist'),file=path.resolve(dir,decodeURIComponent(part[2]||'index.html'));
  if(file!==path.join(dir,'index.html')&&!file.startsWith(dir+path.sep)){res.writeHead(403).end();return}
  if(!fs.existsSync(file)){res.writeHead(404).end();return}
  res.writeHead(200,{'content-type':M[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
 }catch(err){res.writeHead(500).end()}
});
const fonts={
 atlas:[["Playfair Display","Бог"],["Cormorant Garamond","Бог"],["Lora Variable","Имена"],["Inter","Поиск"],["Noto Serif Hebrew","אֱלֹהִים"],["Noto Serif","λόγος ἀγάπη"]],
 sozvezdie:[["Cormorant Garamond","Бог"],["EB Garamond","Имена"],["Frank Ruhl Libre","אֱלֹהִים"],["Inter","Поиск"],["Noto Serif Hebrew","יהוה"]]
};
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const results=[];
 try{
  for(const [engine,browserType,opts] of [['chromium',chromium,{executablePath:process.env.CHROMIUM_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'}],['webkit',webkit,{}]]){
   const browser=await browserType.launch({headless:true,...opts});
   try{
    for(const app of ['atlas','sozvezdie']){
     const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
     const extern=[],failed=[],loaded=[];
     page.on('request',r=>{if(/fonts\.(googleapis|gstatic)\.com/.test(r.url()))extern.push(r.url())});
     page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failed.push(r.url())});
     page.on('pageerror',e=>failed.push(e.message));
     await page.goto(base+'/'+app+'/',{waitUntil:'domcontentloaded',timeout:30000});
     await page.locator('h1').first().waitFor({state:'visible'});
     for(const [family,sample] of fonts[app]){
      const found=await page.evaluate(async args=>{
        const res=await document.fonts.load('500 24px "'+args.family+'"',args.sample);
        return res.some(f=>f.family===args.family&&f.status==='loaded');
      },{family,sample});
      if(!found)throw Error('Font missing: '+engine+'/'+app+'/'+family);
      loaded.push(family);
     }
     await page.evaluate(()=>document.fonts.ready);
     const state=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,computed:getComputedStyle(document.body).fontFamily,css:[...document.styleSheets].length}));
     if(extern.length||failed.length||state.scroll>state.viewport+1)throw Error(JSON.stringify({engine,app,extern,failed,state}));
     results.push({engine,app,fontsLoaded:loaded.length,externalGoogleRequests:extern.length,localFailures:failed.length,overflow:state.scroll-state.viewport,computedBodyFont:state.computed});
     await page.close();
    }
   }finally{await browser.close()}
  }
 }finally{await new Promise(r=>server.close(r))}
 console.log(JSON.stringify({status:'PASS',results},null,2));
})().catch(e=>{console.error(e.stack);server.close();process.exitCode=1});
