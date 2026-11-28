/** W39m: execute the exact production-of-lab playback controller in isolation. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const source=await fs.readFile(new URL('./viewer.mjs',import.meta.url),'utf8');
const start=source.indexOf('function createPlayback('),end=source.indexOf('\nconst $=id=>',start);
assert(start>=0&&end>start);
const createPlayback=vm.runInNewContext(source.slice(start,end)+'\ncreatePlayback');
let checks=0;
function eq(a,b,label){assert.equal(a,b,label);checks++}
function rig({broken=false}={}){
 let t=0,id=0,frames=new Map(),sampled=0,renders=0,playing=false,errors=0;
 const c=createPlayback({duration:4.7,now:()=>t,request:fn=>{frames.set(++id,fn);return id},cancel:i=>frames.delete(i),sample:x=>sampled=x,render:()=>{if(broken)throw Error('test failure');renders++},notify:v=>playing=v,fail:()=>errors++});
 return {c,advance(ms){t+=ms;const q=[...frames.values()];frames.clear();for(const f of q)f(t)},state:()=>({sampled,renders,playing,errors,pending:frames.size})};
}
const a=rig();a.c.seek(0);eq(a.state().pending,1,'initial frame');a.c.invalidate();eq(a.state().pending,1,'coalesced');a.advance(16);eq(a.state().renders,1,'paint');eq(a.state().pending,0,'idle');
a.c.toggle();a.advance(1000);eq(a.state().sampled,1,'slow frame wall-clock');a.advance(3700);eq(a.state().sampled,4.7,'clamped end');eq(a.state().playing,false,'end pause');eq(a.state().pending,0,'end idle');a.c.toggle();eq(a.state().sampled,0,'replay reset');a.advance(250);eq(a.state().sampled,.25,'replay');
a.c.toggle();a.advance(1000);eq(a.state().sampled,.25,'paused position');eq(a.state().pending,0,'pause idle');
a.c.seek(3.5);a.advance(16);eq(a.state().sampled,3.5,'manual seek');a.c.toggle();a.advance(200);eq(a.state().sampled,3.7,'resume');a.c.setHidden(true);eq(a.state().playing,false,'hidden pause');eq(a.state().pending,0,'hidden idle');a.advance(30000);eq(a.state().sampled,3.7,'no hidden jump');a.c.invalidate();eq(a.state().pending,0,'hidden invalidation');a.c.setHidden(false);eq(a.state().pending,1,'return render');a.advance(16);eq(a.state().pending,0,'visible idle');eq(a.state().renders,3,'visibility repaint without invalidation');a.c.toggle();a.advance(1000);eq(a.state().sampled,4.7,'resume to end');a.c.dispose();a.c.invalidate();eq(a.state().pending,0,'disposed no frame');eq(a.state().errors,0,'no error');
const b=rig({broken:true});b.c.toggle();b.advance(100);eq(b.state().errors,1,'render failure');eq(b.state().playing,false,'failure pauses');eq(b.state().pending,0,'failure clears queue');b.c.invalidate();eq(b.state().pending,0,'failure is terminal');
console.log(JSON.stringify({status:'PLAYBACK_CONTROLLER_PASS',checks,limitations:'Deterministic synthetic requestAnimationFrame clock; no DOM, real browser, texture decode or GPU.'}));
