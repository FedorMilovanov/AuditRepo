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

  // Missing, null or unknown publication flags MUST NOT be treated as
  // permission to expose a route. Previously pagefindPolicy !== 'exclude'
  // accidentally admitted both missing and arbitrary strings.
  const validPolicy=policy.routes['/articles/demo/'];
  const single=[rows[0]];
  for (const [key,bad] of [
    ['pagefindPolicy',undefined], ['pagefindPolicy',null],
    ['pagefindPolicy','bogus'], ['indexPolicy',undefined],
    ['indexPolicy','public'], ['searchManifestPolicy',undefined],
    ['searchManifestPolicy','random'], ['sitemapPolicy',undefined],
    ['sitemapPolicy','random'],
  ]) {
    const altered={...validPolicy,[key]:bad};
    const result=m.projectCatalog({
      version:1,routes:{'/articles/demo/':altered}
    },single);
    assert.equal(result.entries.length,0,key+' admitted invalid value');
    assert.equal(result.errors.length,1,key+' did not report invalid policy');
  }
  const metadataOnly=m.projectCatalog({
    version:1,routes:{'/articles/demo/':{...validPolicy,pagefindPolicy:'metadata-only'}}
  },single);
  assert.equal(metadataOnly.entries.length,1,
    'Valid metadata-only policy must remain a permitted enum value');

  // Transpile the *real* scene data module, not a duplicated geometric
  // fixture. The test supplies only the base URL needed for demo cover paths.
  const dataSource=fs.readFileSync(path.join(__dirname,'../src/data.ts'),'utf8');
  const dataJS=ts.transpileModule(dataSource,{compilerOptions:{
    module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022
  }}).outputText;
  const previousDocument=global.document;
  global.document={baseURI:'https://gb-library-test.invalid/'};
  let scene;
  try {
    scene=await import('data:text/javascript;base64,'+Buffer.from(dataJS).toString('base64'));
  } finally {
    if(previousDocument===undefined)delete global.document;
    else global.document=previousDocument;
  }
  const sections=scene.ITEMS.filter(it=>it.kind==='section');
  assert.equal(sections.length,5);
  const [cx,cz,cr]=scene.OBSTACLES[0];
  assert.equal(cr,scene.CENTER_OBSTACLE_RADIUS);
  for(const it of sections) {
    const pos=scene.approachPose(it);
    const innerDistance=Math.hypot(pos.x-cx,pos.z-cz);
    assert.ok(innerDistance >= cr+scene.PLAYER_COLLISION_RADIUS+0.14,
      it.id+': 3D fly-to overlaps central obstacle / would snap after tween');
    const [ix,iz]=scene.itemPos(it);
    const actualStandoff=Math.hypot(ix-pos.x,iz-pos.z);
    assert.ok(Math.abs(actualStandoff-scene.sectionApproachDistance(it))<0.001,
      it.id+': plaque frustum uses a distance different from the real view');
    for(const [ox,oz,radius] of scene.OBSTACLES) {
      assert.ok(Math.hypot(pos.x-ox,pos.z-oz) >= radius+scene.PLAYER_COLLISION_RADIUS-0.001,
        it.id+': section fly-to ends inside another collision obstacle');
    }
  }

  console.log('PASS: canonical catalog projection, noindex/no-metadata fail-closed, stable ID, duplicates, route validation');
})().catch(e=>{console.error(e);process.exitCode=1});
