const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');
const root=path.resolve(__dirname,'..');
function build(rel){
 const raw=fs.readFileSync(path.join(root,rel),'utf8');
 const r=ts.transpileModule(raw,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022},reportDiagnostics:true});
 if(r.diagnostics?.length)throw new Error('TypeScript diagnostics in '+rel);
 return r.outputText;
}
let storage=build('src/cabinet/storage.ts').replace(/^import\s+\{[^}]+\}\s+from\s+['"]\.\/engine['"];?\s*/m,'');
if(/from ['"]\.\/engine/.test(storage))throw new Error('Storage import was not removed');
const embedded=build('src/cabinet/engine.ts')+'\n'+storage;
const source=fs.readFileSync(path.join(root,'preview/cabinet-template.html'),'utf8');
if(!source.includes('/*__ENGINE__*/'))throw new Error('Missing template injection marker');
const out=source.replace('/*__ENGINE__*/',embedded);
fs.writeFileSync(path.join(root,'preview/cabinet.html'),out);
console.log('PASS: standalone personal cabinet preview compiled from canonical TS engines');
