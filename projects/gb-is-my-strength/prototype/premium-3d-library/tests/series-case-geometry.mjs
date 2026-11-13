// Source-owned contact and style contract for the Series bookcase.
// Fails when any volume floats, intersects a shelf, escapes its oak frame,
// or a neon orbit is reintroduced instead of a real grounded structure.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, "src", file), "utf8");
const tsCode = ts.transpileModule(read("scene/seriesCaseGeometry.ts"), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const m = { exports: {} };
new Function("module", "exports", tsCode)(m, m.exports);
const { SERIES_CASE: c, SERIES_VOLUMES: vols, seriesShelfTop } = m.exports;
assert(Object.isFrozen(c) && Object.isFrozen(vols));
assert.equal(vols.length, 7, "All seven bound volumes must remain authored");
assert.equal(vols.filter(v=>v.row===0).length, 4);
assert.equal(vols.filter(v=>v.row===1).length, 3);
assert(new Set(vols.map(v=>v.id)).size===7);
assert(new Set(vols.map(v=>v.roman)).size===7);
assert(vols.every(Object.isFrozen));

const supportBottomWorld = c.stationArtOriginY + c.bottomShelfCenterY
  - c.bottomShelfThickness/2;
assert(Math.abs(supportBottomWorld - c.stonePedestalTopY) < 1e-9,
  "Bookcase base no longer rests on its actual stone pedestal");
const railBottomWorld = c.stationArtOriginY + c.sideRailCenterY
  - c.sideRailHeight/2;
assert(Math.abs(railBottomWorld - c.stonePedestalTopY) < 1e-9,
  "Wooden side uprights float above or intersect the pedestal");
assert(c.sideRailCenterY + c.sideRailHeight/2 >=
  c.crownCenterY + c.crownThickness/2 - .03, "Frame fails to bear crown");
assert(Math.hypot(c.shelfWidth/2, c.shelfDepth/2) - 0.78 < 0.20,
  "Shelf overhang far beyond the real pedestal rim");
assert(c.shelfWidth > 2*(c.sideRailX+c.sideRailWidth/2),
  "The sides protrude outside the structural shelf");
const innerLimit = c.sideRailX - c.sideRailWidth/2;
const contacts = [];
for (const v of vols) {
  assert(v.row===0 || v.row===1);
  assert(v.width>0.22 && v.width<0.55 && v.height>0.7 && v.height<1.2);
  assert(Math.abs(v.x)+v.width/2 < innerLimit-0.02,
    "A volume intersects its physical side frame: "+v.id);
  const foot = seriesShelfTop(v.row);
  const above = v.row===0
    ? c.upperShelfCenterY - c.upperShelfThickness/2
    : c.crownCenterY - c.crownThickness/2;
  const clearance = above - (foot+v.height);
  assert(clearance>0.018 && clearance<0.15,
    "A volume protrudes into the next shelf or sits with an exaggerated gap: "+v.id);
  contacts.push({id:v.id,row:v.row,x:v.x,foot:+foot.toFixed(3),
    head:+(foot+v.height).toFixed(3),clearance:+clearance.toFixed(3)});
}
for (const row of [0,1]) {
  const sorted=vols.filter(v=>v.row===row).sort((a,b)=>a.x-b.x);
  for (let i=1;i<sorted.length;i++) {
    const gap=sorted[i].x-sorted[i].width/2 -
      (sorted[i-1].x+sorted[i-1].width/2);
    assert(gap>0.015 && gap<0.16,
      "Volumes intersect or are unnaturally spaced: "+sorted[i-1].id+"/"+sorted[i].id);
  }
}
const cabinet=read("scene/SeriesCase.tsx");
const station=read("scene/Stations.tsx");
for (const ref of [
  "seriesShelfTop(v.row) + v.height / 2",
  "position={[0, y, 0]} material={wood}",
  "C.sideRailHeight",
  "spineTextures[i]",
  "V.map((v, i)",
]) assert(cabinet.includes(ref), "The rendered case is detached from its authored geometry: "+ref);
assert(!cabinet.includes("useFrame(") && !cabinet.includes("torusGeometry") &&
  !cabinet.includes("AdditiveBlending") && !cabinet.includes("rotation.y") &&
  !cabinet.includes("<pointLight"),
  "Series display is not a stationary, grounded museum exhibit");
assert(station.includes('series: SeriesCase,') &&
  station.includes('import { SeriesCase } from "./SeriesCase";') &&
  station.includes('<group ref={art} position={[0, 1.95, 0]}>') &&
  station.includes('<cylinderGeometry args={[0.78, 0.62, 0.1, 40]} />'),
  "Actual public section station is detached from the real case contract");
console.log("SERIES_CASE_GEOMETRY_PASS "+JSON.stringify({
  pedestalTop:c.stonePedestalTopY,
  shelfBottomWorld:supportBottomWorld,
  railBottomWorld,
  sevenIndexedVolumes:true,
  independentOrbitMeshes:0,
  contacts
}));
