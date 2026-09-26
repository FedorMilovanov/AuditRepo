import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const R=['/','/articles/','/articles/kod-da-vinchi/','/articles/dzhon-gill-chast-1-chelovek/','/articles/serdce-i-telo/','/nagornaya/chast-1/','/baptisty-rossii/','/hard-texts/genesis-6/','/karty/','/karty/pavel/','/konfessii/','/rodosloviye/','/izbrannoe/','/about/','/biografii/','/map/','/journal/','/app/'];
const out={};
for(const r of R){const p=await b.newPage({viewport:{width:1440,height:900}});await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(800);
 const res={noFocus:[],hidden:[],trap:false,skip:null};const seen=new Map();
 for(let i=0;i<40;i++){await p.keyboard.press('Tab');
  const f=await p.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return null;const s=getComputedStyle(e);const b=e.getBoundingClientRect();
   const ring=(s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>0)||s.boxShadow!=='none';
   const vis=b.width>0&&b.height>0&&s.visibility!=='hidden'&&s.opacity!=='0';
   const onscreen=b.bottom>0&&b.top<innerHeight&&b.right>0&&b.left<innerWidth;
   return {k:(e.getAttribute('aria-label')||e.innerText||e.getAttribute('href')||e.tagName).trim().slice(0,40),ring,vis,onscreen,tag:e.tagName,cls:e.className.toString().slice(0,30)}});
  if(!f)continue; if(i===0)res.skip=f.k;
  const key=f.k+f.cls;seen.set(key,(seen.get(key)||0)+1);if(seen.get(key)>3)res.trap=true;
  if(!f.ring)res.noFocus.push(f.k);if(!f.vis||!f.onscreen)res.hidden.push(f.k+(f.vis?' [offscreen]':' [invisible]'));}
 res.noFocus=[...new Set(res.noFocus)].slice(0,6);res.hidden=[...new Set(res.hidden)].slice(0,6);out[r]=res;
 console.log(r,JSON.stringify(res));await p.close();}
fs.writeFileSync('/tmp/aud/kbd.json',JSON.stringify(out,null,1));await b.close();
