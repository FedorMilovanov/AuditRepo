// Observe sequential focus and native keyboard activation. No DOM focus/scroll writes.
import assert from 'node:assert/strict';

const direction={confidence:'Shift+Tab',answer:'Shift+Tab',next:'Tab',source:'Tab'};
const firstDirection='Tab';
const limit=24;

function readFocus({selector,label,geometry=false}){
  const norm=s=>String(s??'').replace(/\s+/gu,' ').trim();
  const el=[...document.querySelectorAll(selector)].find(x=>label===null||norm(x.textContent)===label);
  const focus=document.activeElement,sheet=document.querySelector('#gillLearningOverlay');
  const tag=x=>x?.id||x?.dataset?.conf||x?.classList?.[0]||x?.tagName||null;
  const toast=document.querySelector('.gbs2-resume.gbs2-on');
  const sample={ageMs:Math.round(performance.now()),focus:tag(focus),inSheet:sheet?.contains(focus)??false,
    focusHidden:focus?.hidden??false,found:!!el&&focus===el,toastOn:!!toast};
  if(!geometry||!el)return sample;
  const b=el.getBoundingClientRect(),cx=b.left+b.width/2,cy=b.top+b.height/2;
  const center=document.elementFromPoint(cx,cy);
  const points=[[cx,cy],...[.2,.8].flatMap(i=>[.25,.75].map(j=>[b.x+b.width*i,b.y+b.height*j]))];
  const tray=el.closest('.toc-sheet__body');
  const options=[...document.querySelectorAll('#glsQuizOptions button')];
  return {...sample,enabled:!el.disabled,hidden:el.hidden,center:[cx,cy],hitCount:points.filter(([x,y])=>el.contains(document.elementFromPoint(x,y))).length,
    covered:!!center?.closest('.gbs2-resume.gbs2-on'),topNode:tag(center),scrollTop:tray?.scrollTop??null,
    scrollRoom:tray?tray.scrollHeight-tray.clientHeight-tray.scrollTop:null,
    options:[options.filter(b=>!b.disabled).length,options.length],
    toastZ:toast?getComputedStyle(toast).zIndex:null,sheetZ:sheet?getComputedStyle(sheet).zIndex:null};
}

export async function keyAction(page,row,{step,selector,label=null,question,ordinal}){
  const context={selector,label};
  const before=await page.evaluate(readFocus,{...context,geometry:true});
  assert.ok(before.enabled&&!before.hidden, `${step}: expected an enabled control`);
  const key=step==='confidence'&&ordinal===1?firstDirection:direction[step];
  const log={step,selector,label,question,ordinal,key,before,tabs:[]};
  row.keyActions.push(log);
  let sample=before;
  for(let i=0;!sample.found&&i<limit;i++){
    await page.keyboard.press(key);
    sample=await page.evaluate(readFocus,context);
    log.tabs.push(sample);
  }
  assert.ok(sample.found,`${step}: not reached within ${limit} ${key} (focus=${sample.focus})`);
  log.enter=await page.evaluate(readFocus,{...context,geometry:true});
  assert.ok(log.enter.found&&log.enter.inSheet&&log.enter.enabled&&!log.enter.hidden);
  await page.keyboard.press('Enter');
  log.after=await page.evaluate(readFocus,{...context,geometry:step==='confidence'});
  if(step==='confidence'){
    assert.ok(log.enter.options[0]===0&&log.after.options?.[0]>0&&log.after.options[0]===log.after.options[1],
      'trusted confidence key should unlock the authored answer controls');
  }
}
