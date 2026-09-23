import http from 'http';import fs from 'fs';import path from 'path';
const root='/tmp/gb/dist';const T={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.xml':'application/xml','.avif':'image/avif','.jpg':'image/jpeg','.ico':'image/x-icon','.wasm':'application/wasm'};
http.createServer((q,r)=>{let u=decodeURIComponent(q.url.split('?')[0]);let p=path.join(root,u);
 if(fs.existsSync(p)&&fs.statSync(p).isDirectory()){if(!u.endsWith('/')){r.writeHead(301,{Location:u+'/'});return r.end()}p=path.join(p,'index.html')}
 if(fs.existsSync(p)&&fs.statSync(p).isFile()){r.writeHead(200,{'Content-Type':T[path.extname(p)]||'application/octet-stream'});return fs.createReadStream(p).pipe(r)}
 r.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});fs.createReadStream(path.join(root,'404.html')).pipe(r)}).listen(8090,'0.0.0.0');
