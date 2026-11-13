// Single source-owned contract for the 5 shared section stands.
// The remaining 15 content items are authored in separate Tome/Card systems.
// This test rejects a return to a bright ungrounded floor ring in Station.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "src/scene/stationPedestalGeometry.ts"), "utf8");
const transpiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const mod = { exports: {} };
new Function("module", "exports", transpiled)(mod, mod.exports);
const c = mod.exports.STATION_COLLAR;
assert(Object.isFrozen(c) && c.shaftHeight > 0 && c.bandTubeRadius > 0);
const rel = (c.bandCenterY - c.shaftCenterY) / c.shaftHeight;
assert(Math.abs(rel) <= .5, "Brass band escapes stone shaft's full height");
const radiusAtBand = c.shaftTopRadius + (.5 - rel) *
  (c.shaftBottomRadius - c.shaftTopRadius);
assert(Math.abs(c.bandMajorRadius-radiusAtBand) < c.bandTubeRadius,
  "Metal collar does not intersect actual stone: it is floating");
assert(c.bandTubeRadius < 0.04 && c.bandMajorRadius > 0.5,
  "Collar has become a large luminous decor ring");
const sourceJsx = fs.readFileSync(path.join(root, "src/scene/Stations.tsx"), "utf8");
const start = sourceJsx.indexOf("function Station(");
const end = sourceJsx.indexOf("function BookArt(", start);
assert(start >= 0 && end > start);
function audit(jsx) {
  const s=jsx.slice(start,jsx.indexOf("function BookArt(",start));
  assert(s.includes('STATION_COLLAR.bandMajorRadius') &&
    s.includes('STATION_COLLAR.bandTubeRadius') &&
    s.includes('STATION_COLLAR.shaftTopRadius') &&
    s.includes('STATION_COLLAR.shaftBottomRadius') &&
    s.includes('<meshStandardMaterial ref={trim}') &&
    s.includes('trim.current.color.lerpColors('),
    "Common Station art no longer uses an aimed physical metal collar");
  assert(!s.includes('<ringGeometry') && !s.includes('THREE.AdditiveBlending') &&
    !s.includes('ref={pad}') && !s.includes('toneMapped={false} />\n      </mesh>\n      <mesh rotation-x'),
    "The old additive/unlit ground halo was reintroduced");
  assert(s.includes('registry.add(o)') &&
    s.includes('userData={{ id: item.id }}') &&
    s.includes('onClick={(e) => {') &&
    s.includes('onPointerOver={() => get().xr'),
    "Station hit volume, XR support or item identity was removed");
  assert(s.includes('<Billboard position={[0, 3.95, 0]}'),
    "Shared section title lost its readable public placard");
}
audit(sourceJsx);
function reject(mutated, description) {
  assert.throws(()=>audit(mutated), {name:"AssertionError"},description);
}
reject(sourceJsx.replace(
  '<meshStandardMaterial ref={trim}',
  '<meshBasicMaterial ref={trim}'
), "Unlit common ring incorrectly passed museum material gate");
reject(sourceJsx.replace(
  '<meshStandardMaterial ref={trim}',
  '<ringGeometry args={[1.28, 1.5, 64]} /><meshStandardMaterial ref={trim}'
), "Reintroduced floor ring incorrectly passed");
reject(sourceJsx.replace(
  'userData={{ id: item.id }}','userData={{ id: "missing" }}'
), "Lost section ID incorrectly passed");
console.log("STATION_PHYSICAL_BRASS_PASS "+JSON.stringify({
  radiusAtBand:+radiusAtBand.toFixed(3),
  majorRadius:c.bandMajorRadius,
  tubeRadius:c.bandTubeRadius,
  grounded:true,
  noAdditiveFloorRing:true,
  namedSectionHitTarget:true,
  negativeTests:3
}));
