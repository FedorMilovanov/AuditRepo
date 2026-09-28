import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const E=process.argv[2];
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const c=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block',isMobile:true,hasTouch:true,permissions:['clipboard-read','clipboard-write']});
await c.addInitScript(()=>{window.__tts=[];const s=window.speechSynthesis;if(s){const o=s.speak.bind(s);s.speak=u=>{window.__tts.push((u.text||'').slice(0,80));try{o(u)}catch(e){}}}
 navigator.share=async d=>{window.__share=d};});
for(const r of ['/articles/lot-i-sodom/','/articles/dzhon-gill-chast-1-chelovek/','/nagornaya/chast-1/','/articles/20-antisovetov-pastoru/']){
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,100)));await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(600);
 const ctr=await p.evaluate(()=>[...document.querySelectorAll('button,a')].filter(e=>e.getBoundingClientRect().width>0&&/слуша|озвуч|читать вслух|tts|подел|share/i.test((e.getAttribute('aria-label')||'')+' '+e.textContent)).map(e=>(e.getAttribute('aria-label')||e.textContent.trim()).slice(0,40)));
 const o={r,ctr,errs};
 const t=p.locator('button:visible').filter({has:p.locator('xpath=.')}).locator('xpath=self::*[contains(translate(@aria-label,"СЛУШАТЬ","слушать"),"слуша") or contains(@aria-label,"вслух") or contains(@aria-label,"Озвуч")]').first();
 if(await t.count()){await t.click().catch(e=>o.ttsClick=e.message.slice(0,60));await p.waitForTimeout(1200);o.tts=await p.evaluate(()=>({spoken:window.__tts,speaking:speechSynthesis.speaking,ui:[...document.querySelectorAll('[class*=tts],[data-gb-tts],[aria-label*="ауза"],[aria-label*="становить"]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.getAttribute('aria-label')||e.className.toString()).slice(0,40)).slice(0,5)}));
  await p.screenshot({path:`${E}/tts-${r.split('/').filter(Boolean).pop()}.png`});}
 const s=p.locator('button:visible[aria-label*="одел"]').first();
 if(await s.count()){await s.click().catch(e=>o.shareClick=e.message.slice(0,60));await p.waitForTimeout(700);o.share=await p.evaluate(async()=>({navShare:window.__share||null,sheet:[...document.querySelectorAll('[role=dialog],[class*=share]')].filter(e=>e.getBoundingClientRect().height>0).map(e=>e.className.toString().slice(0,40)).slice(0,3),clip:await navigator.clipboard.readText().catch(()=>null)}));}
 console.log(JSON.stringify(o));await p.close();}
await b.close();
