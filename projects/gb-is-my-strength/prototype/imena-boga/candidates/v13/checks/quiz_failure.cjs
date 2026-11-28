const {chromium}=require('playwright-core');
const {createServer}=require('node:http');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const server=createServer((req,res)=>{
 try{
 const m=/^\/(atlas|sozvezdie)\/(.*)$/.exec(new URL(req.url,'http://127.0.0.1').pathname);
 if(!m){res.writeHead(404).end();return}
 const base=path.resolve(root,m[1],'dist'),file=path.resolve(base,decodeURIComponent(m[2]||'index.html'));
 if(file!==path.join(base,'index.html')&&!file.startsWith(base+path.sep)){res.writeHead(403).end();return}
 if(!fs.existsSync(file)){res.writeHead(404).end();return}
 const ext=path.extname(file),mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.png':'image/png'};
 res.writeHead(200,{'content-type':mime[ext]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500).end()}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 const results=[];
 try{
  // A failed optional quiz must not break the long-form article.
  const quiz=await browser.newPage({viewport:{width:1440,height:900}});
  await quiz.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,r=>r.abort());
  let quizFailures=0;await quiz.route(/\/assets\/TheologicalQuiz-.*\.js$/,r=>{quizFailures++;return r.abort('failed')});
  await quiz.goto(base+'/atlas/',{waitUntil:'commit',timeout:12000});
  await quiz.locator('h1').first().waitFor({state:'visible',timeout:15000});
  const placeholder=quiz.locator('[aria-label="Богословский тест"][aria-busy="true"]');
  await placeholder.scrollIntoViewIfNeeded();
  await quiz.getByRole('alert').filter({hasText:'Богословский тест'}).waitFor({state:'visible',timeout:10000});
  if(quizFailures<1||await quiz.locator('h1').count()<1)throw Error('Atlas root lost after quiz failure');
  results.push('Atlas optional quiz network failure isolated; article survives');
  await quiz.close();

 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
 console.log(JSON.stringify({status:'PASS',checks:results.length,results},null,2));
})().catch(e=>{console.error(e.stack);process.exitCode=1;server.close()});
