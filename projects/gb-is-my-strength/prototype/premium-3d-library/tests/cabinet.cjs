const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');const assert=require('node:assert/strict');
(async()=>{
  const source=fs.readFileSync(path.join(__dirname,'../src/cabinet/engine.ts'),'utf8');
  const {outputText, diagnostics}=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022},reportDiagnostics:true});
  assert.equal(diagnostics?.length,0);
  const m=await import('data:text/javascript;base64,'+Buffer.from(outputText).toString('base64'));
  const t={contentId:'article-1',path:'/articles/kak-hranit-serdce/',title:'Как хранить сердце',anchor:'section-1'};
  const at='2026-11-08T16:20:00.000Z';let state=structuredClone(m.EMPTY_VAULT);
  let r=m.addBookmark(state,{id:'b1',target:t,at});assert.equal(r.ok,true);state=r.state;
  assert.equal(m.addBookmark(state,{id:'b2',target:t,at}).ok,false);
  for(const p of ['javascript:alert(1)','https://evil.example/','//evil.example/','/articles/../evil/','/articles/x/?test=1','/articles/x/#a']){
    assert.equal(m.normalizeTarget({...t,path:p}),null,`unsafe path ${p}`);
  }
  assert.equal(m.targetUrl(t),'https://gospod-bog.ru/articles/kak-hranit-serdce/#section-1');
  r=m.addQuote(state,{id:'q1',target:t,at,exact:'Точное выражение',prefix:'Начало ',suffix:' конец',attribution:'Редакторская выписка',note:'Мой комментарий'});assert.equal(r.ok,true);state=r.state;
  assert.equal(m.addQuote(state,{id:'q2',target:t,at,exact:'Точное выражение',attribution:'Атрибуция'}).ok,false);
  assert.equal(m.addQuote(state,{id:'q2',target:t,at,exact:'Нет источника',attribution:''}).ok,false);
  r=m.createCollection(state,{id:'c1',title:'Сердце',at});assert.equal(r.ok,true);state=r.state;
  assert.equal(m.createCollection(state,{id:'c2',title:'сердце',at}).ok,false);
  r=m.attachToCollection(state,'c1','b1');assert.equal(r.ok,true);state=r.state;
  assert.equal(m.attachToCollection(state,'c1','b1').ok,false);
  state=m.attachToCollection(state,'c1','q1').state;
  const serial=m.exportVault(state);let parsed=m.parseVault(serial);assert.equal(parsed.ok,true);assert.deepEqual(parsed.state,state);
  assert.equal(m.parseVault('not-json').ok,false);
  assert.equal(m.parseVault(JSON.stringify({...state,schemaVersion:99})).ok,false);
  assert.equal(m.parseVault(JSON.stringify({...state,records:[...state.records,state.records[0]]})).ok,false);
  assert.equal(m.parseVault(JSON.stringify({...state,records:[{...state.records[0],target:{...t,path:'https://attacker.example/'}}]})).ok,false);
  assert.equal(m.parseVault(JSON.stringify({...state,collections:[{...state.collections[0],recordIds:['missing'] }]})).ok,false);
  state=m.deleteRecord(state,'b1').state;assert.equal(state.records.length,1);assert.deepEqual(state.collections[0].recordIds,['q1']);
  state=m.deleteCollection(state,'c1').state;assert.equal(state.records.length,1);assert.equal(state.collections.length,0);
  assert.deepEqual(m.resolveQuote('а Точное выражение конец', {exact:'Точное выражение',prefix:'а ',suffix:' конец'}),{status:'found',start:2,end:18});
  assert.deepEqual(m.resolveQuote('😀xx😀xx',{exact:'xx',prefix:'',suffix:''}),{status:'ambiguous'});
  assert.deepEqual(m.resolveQuote('😀xx😀xx',{exact:'xx',prefix:'😀',suffix:'😀'}),{status:'found',start:1,end:3});
  assert.deepEqual(m.resolveQuote('abc',{exact:'not-present',prefix:'',suffix:''}),{status:'unresolved'});
  assert.deepEqual(m.resolveQuote('aaa',{exact:'aa',prefix:'',suffix:''}),{status:'ambiguous'});
  assert.equal(m.addQuote(state,{id:'too-short',target:t,at,exact:'а ',attribution:'Источник'}).ok,false);
  assert.equal(m.parseVault(JSON.stringify({...m.EMPTY_VAULT,records:Array(301).fill({})})).ok,false);
  console.log('PASS: cabinet URL boundary, dedup, private excerpts, collections, cascade delete, validation, Unicode anchors, export/import');
})().catch(e=>{console.error(e);process.exitCode=1});
