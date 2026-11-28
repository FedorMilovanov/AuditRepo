// W18: structural proof of a real female actor GLB with anatomical skin
// and animated 53-bone game rig. Artistic realism is a separate human gate.
import {readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const base=process.cwd();
const file=join(base,'public/artlab/horeb_mother_rig_pilot.glb');
const b=readFileSync(file);
const manifest=JSON.parse(readFileSync(file+'.artifact.json','utf8'));
assert.equal(b.toString('ascii',0,4),'glTF','Binary GLB marker');
assert.equal(b.readUInt32LE(4),2,'glTF version');
assert.equal(b.readUInt32LE(8),b.length,'GLB length matches bytes');
let offset=12;
const chunks=[];
while(offset<b.length){
 const len=b.readUInt32LE(offset),kind=b.readUInt32LE(offset+4);
 assert.ok(len>=0&&len<=b.length-offset-8,'Chunk length inside GLB');
 chunks.push({kind,bytes:b.subarray(offset+8,offset+8+len)});
 offset+=len+8;
}
assert.equal(offset,b.length);
assert.equal(chunks[0].kind,0x4e4f534a);
const gltf=JSON.parse(chunks[0].bytes.toString('utf8').trim());
assert.ok(Array.isArray(gltf.skins)&&gltf.skins.some(s=>s.joints.length===53),'One 53-bone skinned human');
const skin=gltf.skins.find(s=>s.joints.length===53);
assert.equal(new Set(skin.joints).size,53);
for(const index of skin.joints)assert.ok(gltf.nodes[index],'Valid skin joint node '+index);
const names=new Set(gltf.animations.map(a=>a.name));
assert.ok(names.has('Mother_QuietIdle'));
assert.ok(names.has('Mother_GestureTowardsBasket'));
for(const animation of gltf.animations){
 assert.ok(animation.channels.length>0,'No empty animation channels');
 assert.ok(animation.samplers.length>0,'No empty animation samplers');
}
const skinnedMeshes=(gltf.meshes||[]).filter(mesh=>mesh.primitives.some(p=>
 p.attributes?.JOINTS_0!==undefined && p.attributes?.WEIGHTS_0!==undefined));
assert.ok(skinnedMeshes.length>=4,'Actual skinned body and garments');
assert.ok(gltf.materials?.length>=3);
assert.equal(manifest.schemaVersion,1);
assert.equal(manifest.sizeBytes,b.length);
assert.equal(manifest.sha256,createHash('sha256').update(b).digest('hex'));
assert.ok(manifest.path.endsWith('public/artlab/horeb_mother_rig_pilot.glb'));
assert.ok(manifest.provenance.includes('CC0')&&manifest.provenance.includes('GPL'));
assert.ok(manifest.retention.toUpperCase().includes('HOLD'));
const blend=join(base,'art-lab/mother/source/horeb_mother_rig_pilot.blend');
const side=JSON.parse(readFileSync(blend+'.artifact.json','utf8'));
assert.equal(side.sizeBytes,statSync(blend).size);
assert.equal(side.sha256,createHash('sha256').update(readFileSync(blend)).digest('hex'));
console.log('W18_GLTF_STATIC_GATE_PASS',JSON.stringify({
 bones:skin.joints.length,skinnedMeshes:skinnedMeshes.length,
 clips:[...names],glbBytes:b.length,blendBytes:side.sizeBytes}));
