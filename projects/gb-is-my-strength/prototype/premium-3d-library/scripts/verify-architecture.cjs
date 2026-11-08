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
assert.match(world, /<Architecture\s*\/>/);
assert.match(world, /<AdaptiveResolution\s*\/>/);
assert.doesNotMatch(world, /<Bloom|<Motes|<CloudSea|<Stars|<StainedLight/);
assert.match(center, /titlePage\("left"\)/);
assert.doesNotMatch(center, /orbMat|<Beam/);
assert.match(architecture, /instancedMesh/);
assert.match(app, /isSessionSupported\?\.\("immersive-vr"\)/);
for (const name of ['biografii.webp', 'nagornaya.webp', 'otstuplenie.webp']) {
  assert.ok(fs.statSync(path.join(root, 'public/covers', name)).size > 4096, `${name}: missing cover`);
}
console.log(`PASS: ${count} TS/TSX source files parsed, local imports resolved, renderer/VR/3 covers verified.`);
