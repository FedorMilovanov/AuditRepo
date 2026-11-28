const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const ignored=new Set(['node_modules','dist','.git','.cache','__pycache__']);
const manifest='PROGRESSION_MANIFEST.json';
function walk(dir=''){
  const results=[];
  for(const name of fs.readdirSync(path.join(root,dir)).sort()){
    if(ignored.has(name)||name===manifest||name.endsWith('.pyc'))continue;
    const rel=path.join(dir,name),abs=path.join(root,rel);
    const stat=fs.lstatSync(abs);
    if(stat.isSymbolicLink())throw new Error('Unsafe symlink: '+rel);
    if(stat.isDirectory())results.push(...walk(rel));
    else if(stat.isFile())results.push(rel.split(path.sep).join('/'));
  }
  return results;
}
const files={};
for(const name of walk()){
  const data=fs.readFileSync(path.join(root,name));
  files[name]={sha256:crypto.createHash('sha256').update(data).digest('hex'),bytes:data.length};
}
const output={name:'GBSM Premium 3D Library Lab V4',date:'2026-11-08',
  boundary:'isolated local experiment; no Product / AuditRepo writes',
  source:'interactive-3d-card-cover(1).zip',
  caveats:['full Vite build not confirmed','WebGL FPS/real GPU not confirmed','persistent IndexedDB / multi-tab browser test not confirmed','no Product reader/sync integration'], files};
fs.writeFileSync(path.join(root,manifest),JSON.stringify(output,null,2)+'\n');
console.log(`PASS: manifest hashes ${Object.keys(files).length} retained files`);
