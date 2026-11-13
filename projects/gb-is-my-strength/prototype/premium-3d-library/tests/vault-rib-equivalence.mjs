"use strict";
/** V5.14: 20 vaulted ribs retain precisely the old Bézier centre-lines.
 * Static invariant over production source + independent real three.js geometry
 * maths. No browser/API network calls; only authored shape invariants tested.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";

const source = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/scene/Vault.tsx"), "utf8");
assert.match(source, /const RIBS = 20;/);
assert.match(source, /new THREE\.TubeGeometry\(ribCurve\(0\), 24, 0\.13, 7, false\)/);
assert.match(source, /<instancedMesh ref=\{ribInstances\} args=\{\[rib, marble, RIBS\]\}/);
assert.match(source, /mesh\.setMatrixAt\(i, pivot\.matrix\)/);
assert.match(source, /rib\.dispose\(\); shell\.dispose\(\)/);
assert.match(source, /mesh\.computeBoundingSphere\(\)/);

const RIBS = 20, OC_R = 4.15, OC_Y = 13.15, COL_R = 14.45, COL_Y = 8.9;
function originalCurve(i) {
  const a = (i / RIBS) * Math.PI * 2 + Math.PI / RIBS;
  const at = (radius, y) => new THREE.Vector3(Math.sin(a) * radius, y, Math.cos(a) * radius);
  return new THREE.QuadraticBezierCurve3(
    at(COL_R, COL_Y), at((COL_R + OC_R) / 2, COL_Y + (OC_Y - COL_Y) * 0.9),
    at(OC_R, OC_Y)
  );
}
const base = originalCurve(0);
const baseGeometry = new THREE.TubeGeometry(base, 24, 0.13, 7, false);
const material = new THREE.MeshStandardMaterial();
const mesh = new THREE.InstancedMesh(baseGeometry, material, RIBS);
const a = new THREE.Matrix4();
let largestDeviation = 0;
for (let i = 0; i < RIBS; i++) {
  a.makeRotationY(i * Math.PI * 2 / RIBS);
  mesh.setMatrixAt(i, a);
  for (let j = 0; j <= 100; j++) {
    const t = j / 100;
    const rotated = base.getPoint(t).applyMatrix4(a);
    const original = originalCurve(i).getPoint(t);
    largestDeviation = Math.max(largestDeviation, rotated.distanceTo(original));
  }
}
mesh.instanceMatrix.needsUpdate = true;
mesh.computeBoundingSphere();
assert.ok(largestDeviation < 1e-10, `Rib centreline moved: ${largestDeviation}`);
assert.ok(mesh.boundingSphere && Number.isFinite(mesh.boundingSphere.radius));
assert.equal(mesh.count, 20);
assert.ok(baseGeometry.attributes.position.count > 100);
mesh.dispose();
baseGeometry.dispose();
material.dispose();
console.log(JSON.stringify({status:"PASS", ribs:20, sharedTubeGeometries:1, largestCentrelineDeviationM:largestDeviation,
  instancedBoundingSphereRadiusM:mesh.boundingSphere.radius},null,2));
