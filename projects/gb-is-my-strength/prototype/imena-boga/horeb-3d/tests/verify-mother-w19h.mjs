// W19H engineering asset integrity only; premium art remains HOLD.
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
const cwd=process.cwd(),root='projects/gb-is-my-strength/prototype/imena-boga/horeb-3d/';
const assets=['public/artlab/horeb_mother_lookdev_w19h.glb','art-lab/mother-w19/source/horeb_mother_lookdev_w19h.blend','art-lab/mother-w19/source/skin-textures/w19h_neutral_skin_from_makehuman_cc0.png'];
for(const rel of assets){
 const p=join(cwd,rel),data=readFileSync(p),meta=JSON.parse(readFileSync(p+'.artifact.json','utf8'));
 assert.equal(meta.schemaVersion,1);assert.equal(meta.path,root+rel);
 assert.equal(meta.sizeBytes,statSync(p).size);
 assert.equal(meta.sha256,createHash('sha256').update(data).digest('hex'));
 assert.match(meta.provenance,/CC0/);assert.match(meta.retention,/HOLD/);
}
const f=readFileSync(join(cwd,assets[0]));
assert.equal(f.toString('ascii',0,4),'glTF');
assert.equal(f.readUInt32LE(4),2);assert.equal(f.readUInt32LE(8),f.length);
assert.equal(f.readUInt32LE(16),0x4E4F534A);
const doc=JSON.parse(f.subarray(20,20+f.readUInt32LE(12)).toString('utf8').trim());
const skin=doc.skins?.find(s=>s.joints.length===53);
assert.ok(skin&&new Set(skin.joints).size===53);
const clips=new Set((doc.animations||[]).map(a=>a.name));
assert.ok(clips.has('Mother_QuietIdle')&&clips.has('Mother_GestureTowardsBasket'));
assert.ok(doc.meshes.length>=6);
const body=doc.meshes.find(m=>m.name==='base');assert.ok(body);
const count=doc.accessors[body.primitives[0].attributes.POSITION].count;
assert.ok(count>=12500&&count<=16000,'Helper geometry leaked');
assert.ok(doc.materials.some(m=>m.name?.includes('W19H_CC0_Adapted_Skin_PBR')));
assert.ok(doc.materials.some(m=>m.normalTexture),'Linen normals lost');
assert.ok(doc.images.length>=3);
assert.ok(doc.meshes.filter(m=>m.primitives.some(p=>p.attributes.JOINTS_0!==undefined)).length>=6);
const s=readFileSync(join(cwd,'art-lab/mother-w19/source/build_mother_lookdev_w19h.py'),'utf8');
assert.match(s,/modifier_apply\(modifier=mask.name\)/);
assert.match(s,/W19H_CC0_Adapted_Skin_PBR/);
assert.match(s,/vert\.co\.y\+=\.006/);
console.log('W19H_ART_HOLD_INTEGRITY_PASS',JSON.stringify({bytes:f.length,bodyVertices:count,joints:53,meshes:doc.meshes.length,clips:[...clips]}));
