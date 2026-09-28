import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
import * as pdfjs from '/tmp/chr/node_modules/pdfjs-dist/legacy/build/pdf.mjs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const p=await b.newPage();
for(const [r,needle] of [['/articles/serdce-i-telo/','Рим. 6:12'],['/articles/tma-na-serdce/','Быт. 1:31; 3:16'],['/articles/dzhon-gill-chast-4-ekzeget/','Macritchie'],['/articles/podrostok-za-kadrom-dvoynaya-zhizn/','Контакты ниже'],['/articles/lot-i-sodom/','Лота легко']]){
await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(800);
const onScreen=await p.evaluate(n=>document.body.innerText.replace(/\s+/g,' ').includes(n),needle);
const buf=await p.pdf({format:'A4'});const doc=await pdfjs.getDocument({data:new Uint8Array(buf),verbosity:0}).promise;let t='';
for(let i=1;i<=doc.numPages;i++){const c=await (await doc.getPage(i)).getTextContent();t+=c.items.map(x=>x.str).join(' ')}
console.log(r.padEnd(46),'pages',String(doc.numPages).padStart(3),'screen',onScreen,'PDF',t.replace(/\s+/g,' ').includes(needle),'SDG',/Soli Deo Gloria/i.test(t));}
await b.close();
