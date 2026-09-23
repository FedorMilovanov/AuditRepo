import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
for(const r of ['/nagornaya/chast-1/','/nagornaya/chast-3/','/nagornaya/','/articles/serdce-i-telo/']){
const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];p.on('pageerror',e=>errs.push(String(e).slice(0,160)));
await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(900);
const seq=[];for(let i=0;i<40;i++){await p.keyboard.press('Tab');seq.push(await p.evaluate(()=>{const e=document.activeElement;return (e.getAttribute('aria-label')||e.innerText||e.tagName).trim().slice(0,18)}))}
const tabbable=await p.evaluate(()=>[...document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')].filter(e=>e.tabIndex>=0&&!e.disabled&&e.getClientRects().length).length);
const loop=seq.slice(20);const trapped=new Set(loop).size<=7&&loop.every(x=>/Скорость|Остановить/.test(x));
console.log(r,'tabbable',tabbable,'unique-in-40',new Set(seq).size,'TRAPPED',trapped,'errs',errs.join('|'));
if(trapped){
 const info=await p.evaluate(()=>{const e=document.activeElement;const w=e.closest('[class]');const all=[...document.querySelectorAll('*')].filter(x=>x.getAttribute&&x.getAttribute('onkeydown'));return {wrap:e.parentElement.outerHTML.slice(0,260),inlineKD:all.length}});
 console.log('   ',JSON.stringify(info));
 await p.keyboard.press('Shift+Tab');for(let i=0;i<8;i++)await p.keyboard.press('Shift+Tab');console.log('   shift-tab lands',await p.evaluate(()=>(document.activeElement.getAttribute('aria-label')||document.activeElement.innerText||'').slice(0,20)));
 await p.keyboard.press('Escape');await p.keyboard.press('Tab');console.log('   after Esc+Tab',await p.evaluate(()=>(document.activeElement.getAttribute('aria-label')||document.activeElement.innerText||'').slice(0,20)));
}
await p.close();}
await b.close();
