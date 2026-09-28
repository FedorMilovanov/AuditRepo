import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const E=process.argv[2];const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const get=async(s,n,shot)=>{const c=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});await c.addInitScript(x=>localStorage.setItem('gb:font-scale',x),s);const p=await c.newPage();await p.goto(`http://127.0.0.1:8080/nagornaya/chast-${n}/`);await p.waitForTimeout(400);
 const r=await p.evaluate(()=>[...document.querySelectorAll('main p')].filter(p=>p.textContent.length>300&&p.offsetParent).map((p,i)=>(p.dataset.i=i,[parseFloat(getComputedStyle(p).fontSize),(p.className||p.parentElement.className).toString().slice(0,50)])));
 if(shot){const i=await p.evaluate(()=>{const ps=[...document.querySelectorAll('main p')].filter(p=>p.textContent.length>300&&p.offsetParent);const a=ps.findIndex(p=>parseFloat(getComputedStyle(p).fontSize)<=14);const el=ps[a];el.scrollIntoView({block:'center'});el.style.outline='3px solid red';const pr=ps.slice(0,a).reverse().find(q=>parseFloat(getComputedStyle(q).fontSize)>20);if(pr)pr.style.outline='3px solid lime';return a});await p.waitForTimeout(300);await p.screenshot({path:E+'/reader17-nagornaya-mixed-scale.png'})}
 await c.close();return r};
let tot=0,stuck=0;const cls={};
for(const n of [1,2,3,4,5]){const a=await get('1',n),m=await get('1.25',n,n===4);a.forEach(([f,c],i)=>{tot++;if(m[i][0]/f<1.1){stuck++;cls[c]=(cls[c]||0)+1}});}
console.log('Nagornaya long paragraphs',tot,'NOT scaled',stuck);console.log(cls);await b.close();
