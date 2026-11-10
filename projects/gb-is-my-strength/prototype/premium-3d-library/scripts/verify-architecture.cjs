// Static zero-dependency validation for the local experimental candidate.
// TypeScript is a declared devDependency; npm ci makes the full parser available.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
let ts;
try { ts = require('typescript'); } catch {
  console.error('TypeScript not installed: run npm ci before lab:check.'); process.exit(2);
}
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const walk = (folder) => fs.readdirSync(folder, { withFileTypes: true }).flatMap((d) => {
  const p = path.join(folder, d.name);
  return d.isDirectory() ? walk(p) : /\.(tsx?|jsx?)$/.test(d.name) ? [p] : [];
});
let count = 0;
for (const file of walk(src)) {
  const contents = fs.readFileSync(file, 'utf8');
  const parsed = ts.createSourceFile(file, contents, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  assert.equal(parsed.parseDiagnostics.length, 0, `${file}: ${parsed.parseDiagnostics.map((e) => e.messageText).join(', ')}`);
  for (const node of parsed.statements) {
    if (!ts.isImportDeclaration(node) || !node.moduleSpecifier || !ts.isStringLiteral(node.moduleSpecifier)) continue;
    const spec = node.moduleSpecifier.text;
    if (!spec.startsWith('.')) continue;
    const resolved = path.resolve(path.dirname(file), spec);
    assert.ok(fs.existsSync(resolved) || ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'].some((ext) => fs.existsSync(resolved + ext)), `missing import ${spec} in ${file}`);
  }
  count++;
}
const get = (file) => fs.readFileSync(path.join(src,file), 'utf8');
const world = get('scene/World.tsx');
const architecture = get('scene/Architecture.tsx');
const center = get('scene/Center.tsx');
const app = get('App.tsx');
const entry = get('main.tsx');
// A public ?panel=cabinet request must not statically pull the WebGL app.
// The separate production entry uses real dynamic module boundaries.
assert.match(entry, /await import\(["']\.\/cabinet\/CabinetPanel["']\)/);
assert.match(entry, /await import\(["']\.\/App["']\)/);
assert.doesNotMatch(entry, /import\s+App\s+from\s+["']\.\/App["']/);
assert.doesNotMatch(app, /import CabinetPanel from/);
assert.match(world, /<Architecture\s*\/>/);
assert.match(world, /<AdaptiveResolution\s*\/>/);
assert.doesNotMatch(world, /<Bloom|<Motes|<CloudSea|<Stars|<StainedLight/);
assert.match(center, /titlePage\("left"\)/);
assert.doesNotMatch(center, /orbMat|<Beam/);
assert.match(architecture, /instancedMesh/);
/*
 * The shelves, volumes and carved-wood trim must use one physical unit
 * system. Parse and execute the authored static TypeScript constants, then
 * validate the exact world-space geometry without screenshot manipulation.
 */
const configSource = get('scene/caseworkScale.ts');
const configJS = ts.transpileModule(configSource, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
}}).outputText;
const caseworkModule = { exports: {} };
new Function('module', 'exports', configJS)(
  caseworkModule, caseworkModule.exports,
);
const casework = caseworkModule.exports.CASEWORK;
assert.ok(Object.isFrozen(casework), 'casework scale must be immutable');
assert.equal(casework.bays, 20, 'canonical colonnade/outer bay mismatch');
assert.equal(casework.radius, 15.85);
assert.equal(casework.shelfRows, 12);
assert.equal(casework.booksPerShelf, 38);
const windowBays = 6;
const entranceBays = 1;
const expectedVolumes = (casework.bays - windowBays - entranceBays)
  * casework.shelfRows * casework.booksPerShelf;
assert.equal(expectedVolumes, 5928, 'instancing layout changed');
assert.ok(casework.minVolumeHeight > 0 && casework.minVolumeWidth > 0);
assert.ok(casework.spineBaseAboveShelf + casework.minVolumeHeight
  + casework.volumeHeightVariation < casework.shelfPitch,
  'tallest folio intersects the shelf above it');
assert.ok(casework.minVolumeWidth + casework.volumeWidthVariation
  <= casework.shelfWidth / casework.booksPerShelf,
  'widest folio intersects neighboring book volume');
const highestFolio = casework.firstShelfY + casework.spineBaseAboveShelf
  + (casework.shelfRows - 1) * casework.shelfPitch
  + casework.minVolumeHeight + casework.volumeHeightVariation;
const caseworkTopShelf = casework.firstShelfY
  + casework.shelfRows * casework.shelfPitch;
assert.ok(highestFolio < caseworkTopShelf, 'folio protrudes above casework');
assert.ok(caseworkTopShelf < 7.7, 'upper row collides with carved cornice');
assert.match(architecture, /SHELVES = CASEWORK\.shelfRows/);
assert.match(architecture, /BOOKS = CASEWORK\.booksPerShelf/);
assert.match(architecture, /CASEWORK\.firstShelfY \+ CASEWORK\.spineBaseAboveShelf/);
const craft = get('scene/ArchitecturalPolish.tsx');
assert.match(craft, /CASEWORK\.shelfRows/);
assert.match(craft, /CASEWORK\.shelfPitch/);
assert.match(craft, /CASEWORK\.trimAboveShelf/);

assert.match(app, /isSessionSupported\?\.\("immersive-vr"\)/);
for (const name of ['biografii.webp', 'nagornaya.webp', 'otstuplenie.webp']) {
  assert.ok(fs.statSync(path.join(root, 'public/covers', name)).size > 4096, `${name}: missing cover`);
}
// Provenance and byte-perfect local PBR channels, no external CI dependency.
const floorCrypto = require('node:crypto');
const floorDir = path.join(root, 'src/assets/pbr');
const floorManifest = JSON.parse(fs.readFileSync(path.join(floorDir,
  'floor-tiles078-manifest.json'), 'utf8'));
assert.equal(floorManifest.id, 'ambientcg-tiles078-floor-v1');
assert.equal(floorManifest.source, 'https://ambientcg.com/view?id=Tiles078');
assert.equal(floorManifest.license, 'CC0 1.0');
assert.equal(floorManifest.normal_basis, 'OpenGL +Y');
assert.equal(floorManifest.uv_repeat, 16);
assert.equal(floorManifest.files.length, 6);
assert.equal(floorManifest.source_files.length, 3);
const floorNames = new Set();
let floorBytes = 0;
const floorPlatform = get('scene/Platform.tsx');
for (const name of [
  'useLoader(THREE.TextureLoader, paths)',
  'normalMap={normalMap}', 'roughnessMap={roughnessMap}',
  'colorMap.colorSpace = THREE.SRGBColorSpace',
  'normalMap.colorSpace = THREE.NoColorSpace',
  'roughnessMap.colorSpace = THREE.NoColorSpace'
]) assert.ok(floorPlatform.includes(name), 'PBR floor missing ' + name);
assert.ok(!floorPlatform.includes('floorTexture('), 'Dead Canvas floor still used');
for (const res of [512,1024]) for (const kind of ['color','normal','roughness']) {
  const file = 'floor-tiles078-' + res + '-' + kind + '.webp';
  const desc = floorManifest.files.find(x=>x.file === file);
  assert.ok(desc, 'PBR missing channel ' + file);
  assert.ok(!floorNames.has(file), 'Duplicated floor channel ' + file);
  floorNames.add(file);
  const data = fs.readFileSync(path.join(floorDir,file));
  assert.equal(data.length, desc.bytes, file + ': bytes mismatch');
  assert.equal(data.toString('ascii',0,4), 'RIFF', file + ': RIFF header');
  assert.equal(data.toString('ascii',8,12), 'WEBP', file + ': image MIME');
  assert.equal(floorCrypto.createHash('sha256').update(data).digest('hex'),
     desc.sha256, file + ': hash mismatch');
  assert.ok(floorPlatform.includes(file), file + ': unused/missing import');
  floorBytes += data.length;
}
assert.equal(floorNames.size,6);
assert.ok(floorBytes>200000 && floorBytes<750000,'Floor transfer budget ' + floorBytes);
console.log('PASS: verified CC0 PBR floor 6/6 channels, SHA256, ' + floorBytes + ' bytes.');

console.log(`PASS: ${count} TS/TSX source files parsed, local imports resolved, renderer/VR/3 covers verified.`);
