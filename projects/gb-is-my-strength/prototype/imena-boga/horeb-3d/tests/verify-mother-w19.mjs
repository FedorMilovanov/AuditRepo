// W19 ART-HOLD integrity gate. Never infer premium visual acceptance from this test.
// Source and asset provenance are contractual: no silent reappearance of MakeHuman
// helper faces, loss of 53-bone rig, broken animations or orphaned CC0 references.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,statSync} from 'node:fs';
import {join,relative} from 'node:path';
const root=process.cwd();
const prefix='projects/gb-is-my-strength/prototype/imena-boga/horeb-3d/';
const glb='public/artlab/horeb_mother_lookdev_w19e.glb';
const blend='art-lab/mother-w19/source/horeb_mother_lookdev_w19e.blend';
const required=[
 glb,blend,
 'art-lab/mother-w19/source/cloth-textures/rough_linen_nor_gl_1k.jpg',
 'art-lab/mother-w19/source/cloth-textures/rough_linen_rough_1k.jpg',
 'art-lab/mother-w19/source/makehuman_system_assets/skins/young_caucasian_female/young_lightskinned_female_diffuse.png',
 'art-lab/mother-w19/source/makehuman_system_assets/eyes/materials/brown_eye.png',
 'art-lab/mother-w19/source/makehuman_system_assets/eyebrows/eyebrow001/eyebrow001.png',
 'art-lab/mother-w19/source/makehuman_system_assets/eyelashes/eyelashes01/eyelashes01.png'
];
for(const rel of required){
 const file=join(root,rel);
 const blob=readFileSync(file);
 const meta=JSON.parse(readFileSync(file+'.artifact.json','utf8'));
 assert.equal(meta.schemaVersion,1);
 assert.equal(meta.path,prefix+rel);
 assert.equal(meta.sizeBytes,statSync(file).size,'Size mismatch '+rel);
 assert.equal(meta.sha256,createHash('sha256').update(blob).digest('hex'),'Digest '+rel);
 assert.match(meta.retention,/HOLD/);
 assert.match(meta.provenance,/CC0/);
}
const roughMd5={
 'rough_linen_nor_gl_1k.jpg':'3350269a2e9c472aa406bd3cc1eaf2c8',
 'rough_linen_rough_1k.jpg':'a380b24cc43cff88c39510305ebf0020',
};
for(const [name,md5] of Object.entries(roughMd5)){
 const p=join(root,'art-lab/mother-w19/source/cloth-textures',name);
 assert.equal(createHash('md5').update(readFileSync(p)).digest('hex'),md5);
}
const file=readFileSync(join(root,glb));
assert.equal(file.toString('ascii',0,4),'glTF');
assert.equal(file.readUInt32LE(4),2);
assert.equal(file.readUInt32LE(8),file.length);
const jsonLen=file.readUInt32LE(12),jsonType=file.readUInt32LE(16);
assert.equal(jsonType,0x4E4F534A);
const doc=JSON.parse(file.subarray(20,20+jsonLen).toString('utf8').trim());
assert.equal(doc.asset.version,'2.0');
assert.ok(doc.images?.length>=4,'CC0 skin/eyes/linen images missing');
assert.ok(doc.textures?.length>=4,'CC0 texture references absent');
assert.ok(doc.meshes?.length>=8,'W19 mesh/body/garments/face missing');
assert.ok(doc.skins.some(s=>s.joints.length===53),'53-joint rig lost');
const skin=doc.skins.find(s=>s.joints.length===53);
assert.equal(new Set(skin.joints).size,53);
const clips=new Set(doc.animations.map(a=>a.name));
assert.ok(clips.has('Mother_QuietIdle'));
assert.ok(clips.has('Mother_GestureTowardsBasket'));
const bodyMesh=doc.meshes.find(m=>m.name==='base');
assert.ok(bodyMesh,'Anatomical MakeHuman base mesh missing');
const bodyPrim=bodyMesh.primitives[0];
const bodyVertices=doc.accessors[bodyPrim.attributes.POSITION].count;
assert.ok(bodyVertices>=12500 && bodyVertices<=16000,'MakeHuman helpers may have leaked into export: '+bodyVertices);
const materials=doc.materials||[];
assert.ok(materials.some(m=>m.normalTexture),'Real woven linen normal texture missing');
assert.ok(materials.some(m=>m.pbrMetallicRoughness?.baseColorTexture),'Skin/eye image colors missing');
const activeSkinMeshes=doc.meshes.filter(m=>m.primitives.some(p=>p.attributes.JOINTS_0!==undefined&&p.attributes.WEIGHTS_0!==undefined));
assert.ok(activeSkinMeshes.length>=6);
const sourceScript=readFileSync(join(root,'art-lab/mother-w19/source/build_mother_lookdev_w19e.py'),'utf8');
assert.match(sourceScript,/modifier_apply\(modifier=mask.name\)/);
assert.match(sourceScript,/shape_key_remove\(all=True,apply_mix=True\)/);
assert.match(sourceScript,/bpy\.ops\.wm\.save_as_mainfile\(/);
console.log('W19_VERIFIED_ART_HOLD_ASSET',JSON.stringify({
 glbBytes:file.length,bodyVertices,joints:skin.joints.length,meshes:doc.meshes.length,
 skins:doc.skins.length,clips:[...clips],images:doc.images.length,
 textures:doc.textures.length,verifiedBinaries:required.length,
 art:'HOLD',
}));
