import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const c=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
const out=[];
for(const r of routes){const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(300);
 if(!await p.locator('.quiz-wrapper, #quizLaunch, .gb-quiz-host').count()){await p.close();continue}
 const rec={r,issues:[],q:0,errs};
 const l=p.locator('#quizLaunch');
 if(await l.count()){ if(!await l.isVisible()) rec.issues.push('launch-not-visible'); await l.scrollIntoViewIfNeeded().catch(()=>{}); await l.click({timeout:3000}).catch(e=>rec.issues.push('launch-click-fail'));}
 for(let i=0;i<40;i++){
  const opt=p.locator('.quiz-wrapper:visible .quiz-option');const n=await opt.count();if(!n)break;rec.q++;
  const qt=await p.locator('.quiz-wrapper:visible #quizQuestion').textContent().catch(()=>'');
  await opt.nth(i%n).click({timeout:3000}).catch(()=>rec.issues.push('opt-click-fail q'+rec.q));
  const s=await p.evaluate(()=>{const _w=[...document.querySelectorAll('.quiz-wrapper')].find(x=>!x.hidden);const wrongBg=_w.querySelector('.quiz-option.is-incorrect')?getComputedStyle(_w.querySelector('.quiz-option.is-incorrect')).borderColor:null;const w=[...document.querySelectorAll('.quiz-wrapper')].find(x=>!x.hidden);return {correct:w.querySelectorAll('.quiz-option.is-correct').length,fb:!!w.querySelector('.quiz-feedback'),txt:w.innerText,src:[...w.querySelectorAll('.quiz-feedback a')].map(a=>a.getAttribute('href')),focus:document.activeElement?.className,live:!!w.closest('[aria-live]')||!!w.querySelector('[aria-live],[role=status]')}});
  if(s.correct!==1) rec.issues.push(`q${rec.q}: is-correct=${s.correct}`);
  if(!s.fb) rec.issues.push(`q${rec.q}: no-feedback`);
  if(/<\/?(em|span|strong|i|b)\b/.test(s.txt)) rec.issues.push(`q${rec.q}: literal-markup`);
  for(const h of s.src){ if(h?.startsWith('#')&&!await p.$(`[id="${h.slice(1)}"]`)) rec.issues.push(`q${rec.q}: dead sourceRef ${h}`);}
  if(i===0) rec.live=s.live, rec.focusAfter=s.focus;
  const nx=p.locator('.quiz-wrapper:visible .quiz-next');if(!await nx.count()){rec.issues.push(`q${rec.q}: no-next`);break}
  if(!await nx.isVisible()){rec.issues.push(`STUCK q${rec.q}: .quiz-next display:none`);rec.stuck=true;break}
  await nx.click({timeout:3000});await p.waitForTimeout(80);
 }
 const res=await p.evaluate(()=>{const w=[...document.querySelectorAll('.quiz-wrapper')].find(x=>!x.hidden);return w?{t:w.querySelector('.quiz-progress')?.textContent,title:w.querySelector('#quizQuestion')?.textContent,desc:w.querySelector('.quiz-result-copy')?.textContent||'' ,focus:document.activeElement?.tagName+'.'+document.activeElement?.className}:null});
 rec.result=res; if(rec.stuck){} else if(!res||!/Результат/.test(res.t||'')) rec.issues.push('no-result'); else if(!res.desc.trim()) rec.issues.push('empty-result-desc');
 if(res && /^\d+ из \d+$/.test(res.title||'')) rec.issues.push('result-title-fallback');
 if(errs.length) rec.issues.push('pageerror:'+errs[0].slice(0,80));
 out.push(rec);console.log(r.padEnd(60),'q='+rec.q,'live='+rec.live,'focus='+rec.focusAfter,'| '+rec.issues.join('; ').slice(0,300),'| result:',res?.title?.slice(0,40),'/',res?.focus);
 await p.close();}
fs.writeFileSync(process.argv[2],JSON.stringify(out,null,1));await b.close();
