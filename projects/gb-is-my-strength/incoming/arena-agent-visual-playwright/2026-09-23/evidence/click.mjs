import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const B='http://127.0.0.1:8080';
const log=(...a)=>console.log(...a);
async function page(vp,mobile){const c=await b.newContext({viewport:vp,isMobile:mobile,hasTouch:mobile,serviceWorkers:'block'});const p=await c.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(String(e).slice(0,150)));return p;}
// 1 home search
let p=await page({width:1440,height:900},false);
await p.goto(B+'/');await p.waitForTimeout(800);
await p.locator('.h-hero-search, a:has(.h-hero-search__placeholder)').first().click();await p.waitForTimeout(1200);
const inp=p.locator('input:visible').first();log('search input',await inp.count(), await inp.getAttribute('aria-label'));await inp.fill('сердце');await p.waitForTimeout(1500);await p.keyboard.press('Enter');await p.waitForTimeout(2500);
log('home search -> url',p.url().replace(B,''),'results',await p.locator('[class*=result] a, .pagefind-ui__result').count(),'dialog',await p.locator('[role=dialog]:visible').count());
await p.screenshot({path:'/tmp/aud/c_search.png'});
await p.keyboard.press('Escape');await p.waitForTimeout(300);log('after esc dialogs',await p.locator('[role=dialog]:visible').count(),'focus',await p.evaluate(()=>document.activeElement?.outerHTML.slice(0,80)));
// theme toggle
const th=p.locator('[aria-label*="тем" i],[aria-label*="Тём" i],[data-theme-toggle]').first();
const before=await p.evaluate(()=>document.documentElement.dataset.theme||document.documentElement.className);
if(await th.count()){await th.click();await p.waitForTimeout(400);}
log('theme',before,'->',await p.evaluate(()=>document.documentElement.dataset.theme||document.documentElement.className),'errs',p.errs);
await p.screenshot({path:'/tmp/aud/c_home_dark.png'});
// 2 mobile article controls
p=await page({width:390,height:844},true);
await p.goto(B+'/articles/chto-bibliya-nazyvaet-serdcem/');await p.waitForTimeout(1000);
for(const name of ['Справка','Закладк','Настройк','Поделит','Озвуч|Слушать|Воспроиз']){
 const l=p.locator('button:visible,a:visible').filter({has:p.locator('xpath=.'),}).filter({hasText:undefined});
 const loc=p.locator(`button:visible`).filter({hasText:new RegExp(name,'i')}).or(p.locator(`button:visible[aria-label]`).and(p.locator(`[aria-label*="${name.split('|')[0]}" i]`))).first();
 if(!await loc.count()){log('mobile ctrl',name,'NOT FOUND');continue;}
 const lab=await loc.getAttribute('aria-label')||await loc.innerText();
 try{await loc.click({timeout:3000});}catch(e){log('mobile ctrl',name,'CLICK FAIL',String(e).split('\n')[0].slice(0,160));continue;}
 await p.waitForTimeout(700);
 const st=await p.evaluate(()=>({dlg:[...document.querySelectorAll('[role=dialog],dialog,[aria-modal=true]')].filter(e=>e.getBoundingClientRect().height>0&&getComputedStyle(e).visibility!='hidden').map(e=>e.getAttribute('aria-label')||e.className.toString().slice(0,30)),exp:[...document.querySelectorAll('[aria-expanded=true]')].map(e=>e.getAttribute('aria-label')||e.className.toString().slice(0,20)),toast:document.querySelector('[role=status]')?.textContent.trim().slice(0,60)}));
 log('mobile ctrl',name,'«'+lab.trim().slice(0,30)+'»',JSON.stringify(st));
 await p.screenshot({path:`/tmp/aud/c_m_${name.slice(0,4)}.png`});
 await p.keyboard.press('Escape');await p.waitForTimeout(400);
}
log('article errs',p.errs);
// 3 mobile menu on home
p=await page({width:390,height:844},true);await p.goto(B+'/');await p.waitForTimeout(800);
const mb=p.locator('button[aria-label*="еню" i]:visible').first();log('menu btn',await mb.count());
if(await mb.count()){await mb.click();await p.waitForTimeout(600);await p.screenshot({path:'/tmp/aud/c_m_menu.png'});
 const links=await p.locator('.h-mobile-nav a:visible, [class*=mobile-nav] a:visible').evaluateAll(a=>a.map(x=>x.getAttribute('href')));log('menu links',links.length,links.join(' '));
 await p.keyboard.press('Escape');await p.waitForTimeout(400);log('menu after esc visible',await p.locator('.h-mobile-nav:visible').count());}
// 4 avraam map start
p=await page({width:1440,height:900},false);await p.goto(B+'/karty/avraam/');await p.waitForTimeout(1500);
await p.getByText('Начать изучение').click();await p.waitForTimeout(1200);await p.screenshot({path:'/tmp/aud/c_avraam.png'});
const mk=p.locator('.me-marker, [data-place-id]').first();log('markers',await p.locator('.me-marker, [data-place-id]').count());
if(await mk.count()){await mk.click({force:true});await p.waitForTimeout(900);await p.screenshot({path:'/tmp/aud/c_avraam_panel.png'});log('panel open',await p.locator('.me-panel:visible').count());}
log('map errs',p.errs);
await b.close();
