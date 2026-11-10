// Independent source-owned physical clearance proof for both reading objects.
// A structural regression must fail even if a screenshot hides interpenetration.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import * as THREE from "three";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, "src", relative), "utf8");
const config = ts.transpileModule(read("scene/readingGeometry.ts"), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const m = { exports: {} };
new Function("module", "exports", config)(m, m.exports);
const R = m.exports.READING_GEOMETRY;
assert(Object.isFrozen(R), "Reading geometry must be immutable");

const center = read("scene/Center.tsx");
const dressing = read("scene/Dressing.tsx");
const expected = [
  "position={[0, R.bookCenterY, R.bookCenterZ]} rotation-x={R.bookTiltX}",
  "position={[0, R.coverLocalY, 0]}",
  "R.coverThickness, R.coverDepth",
  "position={[x, R.supportCenterY, R.supportCenterZ]} rotation-x={R.supportTiltX}",
  "R.supportHeight, R.supportDepth",
  "[2.06, R.tableTopY], [0, R.tableTopY]",
];
for (const part of expected) {
  assert(center.includes(part), "Actual central JSX not wired to physical contract: " + part);
}
assert.equal(dressing.split("rotation={[R.lecternFacingTiltX, 0, 0]}").length - 1, 2,
  "Both the wooden board and the page group must face the visitor.");
assert(dressing.includes('rotation-x={R.lecternPageRotationX}'),
  "The actual lectern text page is not aligned by the shared physical contract.");

function assess(g) {
  const belowCover = g.coverLocalY - g.coverThickness / 2;
  // The extreme front lower edge must clear the actual horizontal tabletop.
  const coverFrontY = g.bookCenterY + belowCover * Math.cos(g.bookTiltX)
    - g.coverDepth / 2 * Math.sin(g.bookTiltX);
  assert(coverFrontY >= g.tableTopY + 0.008,
    "Central book front cover penetrates or scrapes the tabletop: " + coverFrontY);

  // Work in the actual Three.js book-local frame, not a loose world-space AABB.
  const book = new THREE.Matrix4().makeRotationX(g.bookTiltX);
  book.setPosition(new THREE.Vector3(0, g.bookCenterY, g.bookCenterZ));
  const bookInverse = book.clone().invert();
  const support = new THREE.Matrix4().makeRotationX(g.supportTiltX);
  support.setPosition(new THREE.Vector3(0, g.supportCenterY, g.supportCenterZ));
  let leastClearance = Infinity;
  for (const x of [-0.07, 0.07]) {
    for (const z of [-g.supportDepth / 2, g.supportDepth / 2]) {
      const top = new THREE.Vector3(x, g.supportHeight / 2, z)
        .applyMatrix4(support).applyMatrix4(bookInverse);
      assert(Math.abs(top.x) < 1.15 && Math.abs(top.z) < g.coverDepth / 2,
        "Support moved outside the original book footprint.");
      leastClearance = Math.min(leastClearance, belowCover - top.y);
    }
  }
  assert(leastClearance >= 0.008, "Wooden support pierces the book: " + leastClearance);
  // PlaneGeometry defaults to an XY plane, with normal +Z; page on a
  // horizontal XZ book needs a local -90 degree X rotation (+Y normal).
  const boardNormal = new THREE.Vector3(0, 1, 0);
  const pageNormal = new THREE.Vector3(0, 0, 1).applyAxisAngle(
    new THREE.Vector3(1, 0, 0), g.lecternPageRotationX);
  assert(boardNormal.dot(pageNormal) >= 0.999999,
    "Lectern text plane is not flush with the physical horizontal page.");
  const visitorNormal = pageNormal.clone().applyAxisAngle(
    new THREE.Vector3(1, 0, 0), g.lecternFacingTiltX);
  assert(visitorNormal.z >= 0.55,
    "Lectern reading surface is facing away from the visitor.");

  return { coverFrontY, tabletopClearance: coverFrontY - g.tableTopY,
    supportMinimumClearance: leastClearance, pageNormalDot: boardNormal.dot(pageNormal) };
}
const real = assess(R);
assert.throws(() => assess({ ...R, bookCenterY: 1.95 }), /tabletop/);
assert.throws(() => assess({ ...R, supportCenterY: 1.87 }), /support/);
assert.throws(() => assess({ ...R, lecternPageRotationX: 0 }), /text plane/);
assert.throws(() => assess({ ...R, lecternFacingTiltX: -0.62 }), /away from the visitor/);
console.log("READING_GEOMETRY_PASS " + JSON.stringify(real));
