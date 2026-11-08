const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');const assert=require('node:assert/strict');
(async()=>{
  const source=fs.readFileSync(path.join(__dirname,'../src/catalog/adapter.ts'),'utf8');
  const {outputText,diagnostics}=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022},reportDiagnostics:true});
  assert.equal(diagnostics?.length,0);
  const m=await import('data:text/javascript;base64,'+Buffer.from(outputText).toString('base64'));
  const policy={version:1,routes:{
    '/articles/demo/':{indexPolicy:'index',pagefindPolicy:'include',searchManifestPolicy:'include',sitemapPolicy:'include',librarySection:'Богословие',topicCategory:'Тема',contentKind:'article'},
    '/personal/':{indexPolicy:'noindex',pagefindPolicy:'exclude',searchManifestPolicy:'exclude',sitemapPolicy:'exclude',librarySection:'Моё',topicCategory:'Личное',contentKind:'account'},
    '/draft/':{indexPolicy:'index',pagefindPolicy:'exclude',searchManifestPolicy:'exclude',sitemapPolicy:'exclude',librarySection:'Черновики',topicCategory:'Черновики',contentKind:'article'}
  }};
  const rows=[{path:'/articles/demo/',title:'Проверенный пример',stableId:'doc-1'},
    {path:'/personal/',title:'Кабинет',stableId:'personal'},
    {path:'/draft/',title:'Черновик',stableId:'draft'}];
  let r=m.projectCatalog(policy,rows);assert.equal(r.entries.length,1);assert.equal(r.excluded,2);assert.equal(r.errors.length,0);
  assert.equal(m.findPublishedContent(r.entries,'doc-1')?.path,'/articles/demo/');assert.equal(m.findPublishedContent(r.entries,'draft'),null);
  r=m.projectCatalog(policy,[...rows,rows[0]]);assert.equal(r.errors.length,1);assert.equal(r.entries.length,1);
  r=m.projectCatalog(policy,[{path:'//evil.com/',title:'Evil',stableId:'foo'}]);assert.equal(r.entries.length,0);assert.equal(r.errors.length,1);
  r=m.projectCatalog(policy,[{path:'/articles/%2e%2e/',title:'Bypass',stableId:'foo'}]);assert.equal(r.entries.length,0);
  r=m.projectCatalog(policy,[{path:'/articles/demo/',title:'Missing ID'}]);assert.equal(r.entries.length,0);
  r=m.projectCatalog({version:1,routes:{}},rows);assert.equal(r.entries.length,0);
  assert.equal(m.projectCatalog({},rows).errors.length,1);
  console.log('PASS: canonical catalog projection, noindex/no-metadata fail-closed, stable ID, duplicates, route validation');
})().catch(e=>{console.error(e);process.exitCode=1});
