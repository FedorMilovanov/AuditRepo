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

/* A confessional collection must depict church documents, never the
 * Decalogue tablets I–X or a glowing orbit. Execute the real TS metadata
 * and verify distinct historical traditions, dates and source-owned atlas. */
const stationSource = get('scene/Stations.tsx');
const confessionSource = get('scene/ConfessionArchive.tsx');
const confessionMetadata = get('scene/confessionDocuments.ts');
const metadataJs = ts.transpileModule(confessionMetadata, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
}}).outputText;
const metadataModule = { exports: {} };
new Function('module','exports',metadataJs)(metadataModule,metadataModule.exports);
const confessions = metadataModule.exports.CONFESSION_DOCUMENTS;
assert.equal(confessions.length, 4, 'Archive must include four distinct documentary traditions');
assert.deepEqual(confessions.map((x) => x.date), ['1530','1563','1646','1677/1689']);
assert.equal(new Set(confessions.map((x) => x.tradition)).size, 4);
for (const document of confessions) {
  assert(document.lines.length >= 2 && document.lines.length <= 3);
  assert(document.lines.every((line) => line.length > 6 && !/^([IVX ]+)$/.test(line)));
}
assert.match(stationSource, /creeds: ConfessionArchive/);
assert.match(stationSource, /art\.current\.position\.y = 1\.95;/);
const documentPlinthTop=1.04+0.1/2;
const archiveSupportBottom=1.95-0.745-0.24/2;
const archiveSupportTop=1.95-0.745+0.24/2;
const lowerShelfBottom=1.95-0.615-0.045/2;
assert(Math.abs(archiveSupportBottom-documentPlinthTop)<0.012,
  'Archival display is floating above its physical stone plinth');
assert(archiveSupportTop>=lowerShelfBottom,
  'Archival display lacks contact with its wooden shelf');

assert.match(stationSource, /import \{ ConfessionArchive \} from "\.\/ConfessionArchive"/);
assert.doesNotMatch(stationSource, /tabletTextures\(|tabletGeometry\(|function CreedsArt/);
const textureSource = get('textures.ts');
assert.doesNotMatch(textureSource, /export function tabletTextures\(/);
for (const sign of [
  'name="confession-archive"',
  'canvasTex(1024, 512',
  'atlasPlanes()',
  'new THREE.MeshStandardMaterial',
  'roughness: 0.88, metalness: 0',
  'atlas.dispose();',
  'planes.forEach((geometry) => geometry.dispose());',
]) assert(confessionSource.includes(sign),'Physical archival exhibit missing '+sign);
// Check executable implementation, not comments describing removed effects.
const archiveImplementation = confessionSource
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');
assert.doesNotMatch(archiveImplementation,
  /\buseFrame\s*\(|\bemissive(?:Map|Intensity)?\s*[:=]|<Beam|<torusGeometry|Math\.random\s*\(/,
  'Confessions must not recreate glowing tablets or moving orbits');

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
// The main visitor focal point must be physically joinered furniture, not
// the accidental vertical 4.2m-wide decorative hoop from the V5.32 centre.
assert.match(center, /function lathedLecternPedestal\(/);
assert.match(center, /new THREE\.LatheGeometry\(/);
assert.match(center, /const flutes = Math\.sin\(Math\.atan2\(z, x\) \* 24\)/);
assert.match(center, /geom\.computeVertexNormals\(\)/);
assert.match(center, /function bevelledReadingTabletop\(/);
assert.match(center, /pedestal\.dispose\(\)/);
assert.match(center, /tabletop\.dispose\(\)/);
assert.match(center, /geometry=\{pedestal\}/);
assert.match(center, /geometry=\{tabletop\}/);
assert.match(center, /rotation-x=\{Math\.PI \/ 2\} material=\{goldMat\}/);
assert.doesNotMatch(center, /cylinderGeometry args=\{\[1\.02, 1\.35, 1\.38/);
assert.doesNotMatch(center, /cylinderGeometry args=\{\[2\.15, 2\.05, 0\.14/);
assert.match(center, /titlePage\("right"\)/);

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

/* Raised spine accents: verify the REAL selection function and geometry,
 * so the optional gilding cannot float, intersect the next volume, repeat
 * uniformly across rows, or become thousands of individually drawn meshes. */
const gildingSource = get('scene/spineDetail.ts');
const gildingJS = ts.transpileModule(gildingSource, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
}}).outputText;
const gildingModule = { exports: {} };
new Function('module','exports',gildingJS)(gildingModule,gildingModule.exports);
const detail = gildingModule.exports.SPINE_DETAIL;
const gildedVolume = gildingModule.exports.gildedVolume;
assert(Object.isFrozen(detail));
assert.equal(detail.bandsPerVolume, 2);
assert(detail.bandWidth > .55 && detail.bandWidth < 1);
assert(detail.heightOffset + detail.bandHeight / 2 < .5,
  'Gold bands overlap upper or lower page edges');
assert(detail.faceOffset + detail.bandDepth / 2 > -.5
  && detail.faceOffset + detail.bandDepth / 2 < -.48,
  'Spine band is floating or buried inside the book cover');
assert(detail.faceOffset - detail.bandDepth / 2 < -.515,
  'Raised band fails to protrude from the visible spine');
let gildedCount = 0, minGildedShelf = Infinity, maxGildedShelf = 0;
for (let bay = 1; bay < casework.bays; bay++) {
  if ([7,8,9,10,11,12].includes(bay)) continue;
  for (let row = 0; row < casework.shelfRows; row++) {
    let inShelf = 0;
    for (let book = 0; book < casework.booksPerShelf; book++) {
      if (gildedVolume(bay, row, book)) { gildedCount++; inShelf++; }
    }
    minGildedShelf = Math.min(minGildedShelf, inShelf);
    maxGildedShelf = Math.max(maxGildedShelf, inShelf);
  }
}
assert(minGildedShelf >= 3 && maxGildedShelf <= 4,
  'A cabinet shelf has missing/overdense bands');
assert(gildedCount >= 450 && gildedCount <= 650,
  'Gilded details dominate the original neutral book collection');
assert.equal(architecture.includes('name="gilded-spine-bands"'), true);
for (const token of [
  'gildedVolume(bay, level, b)',
  'worldBand.multiplyMatrices(object.matrix, band.matrix)',
  'bands.setMatrixAt(bandIndex++, worldBand)',
  'bands.count = bandIndex',
  'bandGeometry.dispose(); bandMaterial.dispose()',
]) assert(architecture.includes(token), 'Actual instanced gilding contract missing: '+token);
assert.equal(gildedCount * detail.bandsPerVolume <=
  13 * casework.shelfRows * Math.ceil(casework.booksPerShelf/detail.cadence)
  * detail.bandsPerVolume, true);

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

// Fail-closed directional grain / licensed asset provenance contract.
const caseworkManifest=JSON.parse(fs.readFileSync(path.join(floorDir,'wood049-manifest.json'),'utf8'));
assert.equal(caseworkManifest.id,'ambientcg-wood049-casework-v1');
assert.equal(caseworkManifest.source,'https://ambientcg.com/view?id=Wood049');
assert.equal(caseworkManifest.license,'CC0 1.0');
assert.equal(caseworkManifest.normal_basis,'OpenGL +Y');
assert.equal(caseworkManifest.derived_files.length,6);
assert.equal(caseworkManifest.source_files.length,3);
const caseworkOwner=get('scene/CaseworkWood.tsx');
for (const clause of ['CaseworkContext','useLoader(THREE.TextureLoader',
  'material.dispose()','albedo.colorSpace = THREE.SRGBColorSpace',
  'normal.colorSpace = THREE.NoColorSpace','roughness.colorSpace = THREE.NoColorSpace',
  'uv.setXY(i, v, 1 - u)','return useContext(CaseworkContext) ?? wood']) {
  assert.ok(caseworkOwner.includes(clause),'Missing directional oak contract '+clause);
}
// Texture swaps must not suspend/re-mount the entire cabinet ensemble.
const materialBoundary = caseworkOwner.indexOf('<CaseworkContext.Provider value={material}>');
const stableChildren = caseworkOwner.indexOf('{children}', materialBoundary);
const localSuspense = caseworkOwner.indexOf('<Suspense fallback={null}>', stableChildren);
assert.ok(materialBoundary > 0 && stableChildren > materialBoundary && localSuspense > stableChildren,
  'Casework geometry was placed inside a suspending material loader');
for (const clause of [
  'const material = useMemo(() => new THREE.MeshStandardMaterial({',
  '<CaseworkMaps key={quality} quality={quality} material={material} />',
  'material.map = albedo;', 'material.normalMap = normal;',
  'material.roughnessMap = roughness;', 'material.needsUpdate = true;',
]) assert.ok(caseworkOwner.includes(clause), 'Unstable casework map/material contract ' + clause);

// The support column must remain behind the framed content, unlike the old
// 0m front-intersecting post. Local Z faces the visitor; full-front radius
// also includes the rear bracket, rather than hiding its visual overlap.
const cardSource = get('scene/Cards.tsx');
const postMatch = cardSource.match(/<mesh position=\{\[0, 1\.0, (-?\d+(?:\.\d+)?)\]\} material=\{goldMat\}>\s*<cylinderGeometry args=\{\[0\.05, 0\.07, 1\.8, 12\]\}/);
const bracketMatch = cardSource.match(/<mesh position=\{\[0, 1\.87, (-?\d+(?:\.\d+)?)\]\} material=\{goldMat\}>\s*<boxGeometry args=\{\[0\.34, 0\.12, 0\.18\]\}/);
assert.ok(postMatch && bracketMatch, 'Card rear post and bracket missing from source');
const rearFace = zFront => zFront < -0.04;
assert.ok(!rearFace(0 + 0.07), 'Negative fixture: old post does not overlap text');
assert.ok(rearFace(Number(postMatch[1]) + 0.07), 'Card post protrudes through lettering');
assert.ok(rearFace(Number(bracketMatch[1]) + 0.18/2), 'Card bracket protrudes through lettering');
assert.ok(world.includes('<CaseworkWoodProvider>'));
assert.ok(architecture.includes('woodHorizontalRef'));
assert.ok(architecture.includes('woodVerticalRef'));
assert.ok(architecture.includes('verticalGrainBoxGeometry'));
assert.ok(craft.includes('oakUprights'));
assert.ok(craft.includes('verticalGrainBoxGeometry'));
assert.ok(craft.includes('wood.map = oakMap'),'Shared original furniture altered');
assert.ok(craft.includes('wood.normalMap = oakNormal'),'Original furniture normals altered');
let caseworkBytes=0;
const caseworkNames=new Set();
for (const res of [512,1024]) for (const ch of ['color','normal','roughness']) {
  const name='wood049-'+res+'-'+ch+'.webp';
  const item=caseworkManifest.derived_files.find(x=>x.file===name);
  assert.ok(item,'Missing asset manifest '+name);
  assert.ok(!caseworkNames.has(name),'Duplicate asset '+name);
  caseworkNames.add(name);
  const buf=fs.readFileSync(path.join(floorDir,name));
  assert.equal(buf.length,item.bytes,name+' length drift');
  assert.equal(buf.toString('ascii',0,4),'RIFF',name+' RIFF missing');
  assert.equal(buf.toString('ascii',8,12),'WEBP',name+' WebP missing');
  assert.equal(floorCrypto.createHash('sha256').update(buf).digest('hex'),item.sha256,
   name+' sha mismatch');
  assert.ok(caseworkOwner.includes(name),name+' unused source');
  caseworkBytes+=buf.length;
}
assert.equal(caseworkNames.size,6);
assert.ok(caseworkBytes>200000 && caseworkBytes<600000,
 'PBR oak budget exceeded '+caseworkBytes);
console.log('PASS: CC0 oak PBR 6/6 SHA256, shared wood context, UV grain directions.');

// The short-landscape hint is optional. Never hide Cardboard's mandatory
// headset instructions, and never leave a collapsed desktop hint in 480px.
// On phone portrait it belongs to the right of the movement joystick.
const hudCss=fs.readFileSync(path.join(src,'index.css'),'utf8');
const hudSource=get('ui/Overlay.tsx');
assert.ok(hudSource.includes('data-gb-help data-gb-hint-mode={mode}'),
  'Explicit Cardboard-vs-desktop hint mode not rendered');
assert.match(hudCss, /\[data-gb-help\]\[data-gb-hint-mode="desktop"\]/,
  'Touch help CSS must be restricted to desktop navigation mode');
assert.match(hudCss, /\(max-width: 600px\)/,
  'Narrow landscape help suppression missing');
assert.match(hudCss, /\(orientation: portrait\) and \(max-width: 480px\)/,
  'Portrait reading-page help layout missing');
assert.match(hudCss, /left: 10rem !important;/);
const helpLine=hudSource.split('\n').find(line=>line.includes('data-gb-help data-gb-hint-mode={mode}'));
assert.ok(helpLine && !helpLine.includes('-translate-x-1/2'),
  'Mobile hint must not keep a Tailwind translation after intrinsic centering');
assert.ok(hudCss.includes('[data-gb-help] { left: 0; right: 0; margin-inline: auto; }'),
  'Default help centering must use intrinsic margins');
assert.ok(hudCss.includes('margin-inline: 0;'),
  'Portrait chip must reset margins to remain right of 128px joystick');
const minimapSource=hudSource.slice(hudSource.indexOf('function Minimap()'),hudSource.indexOf('function Joystick()'));
assert.ok(minimapSource.includes('&& screenAllowsMap;'),
  'Minimap display condition must unmount hidden Canvas');
for (const clause of [
  'const [screenAllowsMap, setScreenAllowsMap] = useState(',
  'window.matchMedia("(min-width: 640px)")',
  'window.matchMedia("(pointer: coarse) and (orientation: landscape) and (max-height: 430px)")',
  'wide.addEventListener("change", sync);',
  'shortTouch.addEventListener("change", sync);',
  'wide.removeEventListener("change", sync);',
  'shortTouch.removeEventListener("change", sync);',
]) assert.ok(minimapSource.includes(clause), 'Minimap responsive lifecycle missing '+clause);

console.log(`PASS: ${count} TS/TSX source files parsed, local imports resolved, renderer/VR/3 covers verified.`);
