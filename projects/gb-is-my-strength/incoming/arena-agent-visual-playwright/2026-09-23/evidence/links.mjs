import fs from 'fs';import path from 'path';
const root='/tmp/gb/dist';const files=[];
(function w(d){for(const f of fs.readdirSync(d)){const p=path.join(d,f);const s=fs.statSync(p);if(s.isDirectory())w(p);else if(f.endsWith('.html'))files.push(p)}})(root);
const exists=u=>{let p=path.join(root,decodeURIComponent(u));if(fs.existsSync(p)&&fs.statSync(p).isFile())return p;if(fs.existsSync(path.join(p,'index.html')))return path.join(p,'index.html');return null};
const bad={},badAnchor={};const idc={};
const ids=f=>idc[f]??=new Set([...fs.readFileSync(f,'utf8').matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]));
for(const f of files){const s=fs.readFileSync(f,'utf8');const rel='/'+path.relative(root,f).replace(/index\.html$/,'');
 for(const m of s.matchAll(/<(?:a|link)\s[^>]*href="([^"]+)"/g)){let h=m[1].replace(/&amp;/g,'&');
  if(/^(mailto|tel|javascript|data):/.test(h)||/^https?:\/\/(?!gospod-bog\.ru)/.test(h)||h.startsWith('//'))continue;
  h=h.replace(/^https?:\/\/gospod-bog\.ru/,'');
  let [u,frag]=h.split('#');u=u.split('?')[0];
  const target=u===''?f:(u.startsWith('/')?exists(u):exists(path.posix.join(rel,u)));
  if(!target){(bad[u.startsWith('/')?u:path.posix.join(rel,u)]??=new Set()).add(rel);continue}
  if(frag&&target.endsWith('.html')&&!ids(target).has(decodeURIComponent(frag))&&!/^:~:/.test(frag))(badAnchor[h]??=new Set()).add(rel);
 }}
const show=o=>Object.entries(o).map(([k,v])=>`${k}  <- ${[...v].slice(0,4).join(', ')}${v.size>4?' (+'+(v.size-4)+')':''}`);
console.log('FILES',files.length,'\nBROKEN',Object.keys(bad).length);console.log(show(bad).slice(0,40).join('\n'));
console.log('BAD ANCHORS',Object.keys(badAnchor).length);console.log(show(badAnchor).slice(0,40).join('\n'));
