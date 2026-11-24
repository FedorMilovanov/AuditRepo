// W22 isolated-candidate contact gate: compare the REAL skinned wrist joints to the real
// basket rim in the separate house GLB at the authored peak gesture.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
const root=process.cwd();
function parseGLB(file){
 const b=readFileSync(join(root,file));
 assert.equal(b.toString('ascii',0,4),'glTF');
 assert.equal(b.readUInt32LE(4),2);
 const size=b.readUInt32LE(12),type=b.readUInt32LE(16);
 assert.equal(type,0x4e4f534a);
 const doc=JSON.parse(b.subarray(20,20+size).toString('utf8').trim());
 const offset=20+size;
 assert.equal(b.readUInt32LE(offset+4),0x004e4942);
 return {doc,bytes:b.subarray(offset+8,offset+8+b.readUInt32LE(offset))};
}
function values(asset,index){
 const a=asset.doc.accessors[index],v=asset.doc.bufferViews[a.bufferView];
 const dim={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type],size={5126:4,5125:4,5123:2,5121:1}[a.componentType];
 assert.ok(dim&&size,'Unsupported accessor');
 const offset=(v.byteOffset||0)+(a.byteOffset||0),stride=v.byteStride||dim*size;
 const out=[];
 for(let i=0;i<a.count;i++){
  const row=[];
  for(let j=0;j<dim;j++){
   const at=offset+i*stride+j*size;
   row.push(a.componentType===5126?asset.bytes.readFloatLE(at):
    a.componentType===5125?asset.bytes.readUInt32LE(at):
    a.componentType===5123?asset.bytes.readUInt16LE(at):asset.bytes.readUInt8(at));
  }
  out.push(row);
 }
 return out;
}
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,b)=>a.map((x,i)=>x*b[i]);
const distance=(a,b)=>Math.hypot(...sub(a,b));
const qmul=(a,b)=>[
 a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1],
 a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0],
 a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3],
 a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]
];
function rotate(q,v){
 const t=qmul(q,[...v,0]);
 return qmul(t,[-q[0],-q[1],-q[2],q[3]]).slice(0,3);
}
function qslerp(a,b,u){
 let dot=a.reduce((acc,x,i)=>acc+x*b[i],0);
 if(dot<0){b=b.map(x=>-x);dot=-dot;}
 if(dot>.9995){
  const q=a.map((x,i)=>x*(1-u)+b[i]*u),norm=Math.hypot(...q);
  return q.map(x=>x/norm);
 }
 const omega=Math.acos(Math.max(-1,Math.min(1,dot))),denom=Math.sin(omega);
 return a.map((x,i)=>x*Math.sin((1-u)*omega)/denom+b[i]*Math.sin(u*omega)/denom);
}
function transforms(asset,clipName,seconds){
 const doc=asset.doc,nodes=doc.nodes;
 const p=nodes.map(n=>({
  translation:n.translation||[0,0,0],
  rotation:n.rotation||[0,0,0,1],
  scale:n.scale||[1,1,1]
 }));
 const anim=doc.animations?.find(a=>a.name===clipName);
 if(clipName)assert.ok(anim,'Missing authored skeletal clip');
 const memoAccessors=new Map();
 const read=i=>{
  if(!memoAccessors.has(i))memoAccessors.set(i,values(asset,i));
  return memoAccessors.get(i);
 };
 for(const channel of anim?.channels||[]){
  const s=anim.samplers[channel.sampler],t=read(s.input).map(x=>x[0]),v=read(s.output);
  const interpolation=s.interpolation||'LINEAR';
  assert.ok(interpolation==='LINEAR'||interpolation==='STEP','Unsupported GLB interpolation: '+interpolation);
  let value;
  if(seconds<=t[0])value=v[0];
  else if(seconds>=t[t.length-1])value=v[v.length-1];
  else {
   let i=0;while(i<t.length-2&&t[i+1]<seconds)i++;
   const u=(seconds-t[i])/(t[i+1]-t[i]);
   value=interpolation==='STEP'?v[i]:channel.target.path==='rotation'?qslerp(v[i],v[i+1],u):
    v[i].map((x,k)=>x*(1-u)+v[i+1][k]*u);
  }
  p[channel.target.node][channel.target.path]=value;
 }
 const parents=new Map();
 nodes.forEach((n,i)=>(n.children||[]).forEach(child=>parents.set(child,i)));
 const cache=new Map();
 function world(i){
  if(cache.has(i))return cache.get(i);
  const n=p[i],parent=parents.has(i)?world(parents.get(i)):null;
  const w=parent?{
   translation:add(parent.translation,rotate(parent.rotation,mul(parent.scale,n.translation))),
   rotation:qmul(parent.rotation,n.rotation),
   scale:mul(parent.scale,n.scale)
  }:n;
  cache.set(i,w);return w;
 }
 return {world,name:n=>nodes.findIndex(x=>x.name===n)};
}
const actor=parseGLB('public/artlab/horeb_mother_w22_candidate.glb');
const room=parseGLB('public/artlab/horeb_egypt_house_hero_pilot.glb');
const actorSource=readFileSync('src/imena-boga-horeb-3d/ui/MotherArtLab.tsx','utf8');
const manifest=JSON.parse(readFileSync('art-lab/mother-w22/source/horeb_mother_w22_candidate.manifest.json','utf8'));
assert.equal(manifest.status,'ART_HOLD_W22_EARLY_CANDIDATE');
const offset=manifest.staged_actor_offset_three;
assert.deepEqual(offset,[-.5,.015,.30]);
assert.match(actorSource,/if\(phase==="W22"\)actor\.position\.set\(-\.50,\.015,\.30\)/,
 'The W22 rig spatial test must match the actual separate viewer placement');
assert.match(actorSource,/house\.visible=currentShot==="doorway"\|\|isGestureStudy\(\)/,
 'The W22 gesture shot must show the actual basket scene');
assert.match(actorSource,/Basket_\|Hand_woven_basket_body/,
 'The cutaway must retain the real basket geometry');
const basket=transforms(room);
const rimNode=basket.name('Basket_thick_lipped_rim');
assert.ok(rimNode>=0,'The actual CC0/reference basket rim must exist');
const mesh=room.doc.meshes[room.doc.nodes[rimNode].mesh];
const local=values(room,mesh.primitives[0].attributes.POSITION);
const rimTransform=basket.world(rimNode);
const rim=local.map(v=>add(rimTransform.translation,
 rotate(rimTransform.rotation,mul(rimTransform.scale,v))));
function sample(frame){
 const obj=transforms(actor,'Mother_GestureTowardsBasket',frame/24);
 const result={};
 for(const bone of ['hand_l','hand_r']){
  const id=obj.name(bone);
  assert.ok(id>=0,'Missing named wrist bone '+bone);
  const wrist=add(obj.world(id).translation,offset);
  result[bone]=Math.min(...rim.map(v=>distance(v,wrist)));
 }
 return result;
}
const idle=sample(1),peak=sample(60);
assert.ok(peak.hand_l <.12,'W22 left wrist misses the physical basket rim: '+peak.hand_l);
assert.ok(idle.hand_l>.13,'W22 rest pose must remain visibly distinct from gesture: '+idle.hand_l);
assert.ok(peak.hand_r>.30,'W22 must measure the intended left-hand gesture: '+peak.hand_r);
assert.ok(actor.doc.animations.some(a=>a.name==='Mother_GestureTowardsBasket'));
assert.ok(actor.doc.nodes.some(n=>n.name==='W22_plain_linen_head_cover'));
assert.ok(actor.doc.nodes.some(n=>n.name==='W22_hand_woven_waist_tie'));
console.log('W22_EXPORTED_GLTF_REAL_RIM_CONTACT_PASS',JSON.stringify({
 offset,frame:60,fps:24,rest:idle,peak,
 threshold:.12,contact:true,basketShownInGestureShot:true,
 separateArtHoldCandidate:true
}));
