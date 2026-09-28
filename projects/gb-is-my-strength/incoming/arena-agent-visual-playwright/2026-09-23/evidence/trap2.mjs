import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
for(const r of ['/nagornaya/chast-2/','/nagornaya/chast-4/','/nagornaya/chast-5/','/nagornaya/istochniki/','/nagornaya/nakhodki/','/nagornaya/seriya/','/articles/lot-i-sodom/','/articles/kod-da-vinchi/','/hard-texts/genesis-6/','/baptisty-rossii/noch-na-kure/']){
const p=await b.newPage({viewport:{width:1440,height:900}});await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(900);
const seq=[];for(let i=0;i<45;i++){await p.keyboard.press('Tab');seq.push(await p.evaluate(()=>{const e=document.activeElement;return (e.getAttribute('aria-label')||e.innerText||e.tagName).trim().slice(0,18)}))}
const tail=seq.slice(25);console.log(r.padEnd(32),'uniq',new Set(seq).size,'TRAP',tail.every(x=>/Скорость|Остановить/.test(x)));await p.close();}
await b.close();
