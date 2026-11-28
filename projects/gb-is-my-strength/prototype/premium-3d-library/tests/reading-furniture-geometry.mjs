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
assert(dressing.includes('position={[0, R.lecternPageCenterY, 0.03]}'),
  "Lectern page must use the canonical reading height.");
const data = read("data.ts");
assert(data.includes('R.lecternApproachDistance') &&
  data.includes('Math.atan2(R.lecternPageCenterY - EYE, dist)'),
  "Public navigation must calculate the downward sightline from real reading geometry.");
const approachPitch=Math.atan2(R.lecternPageCenterY-1.65,R.lecternApproachDistance);
assert(approachPitch < -0.15 && approachPitch > -0.4,
  "Reading sightline should aim at the actual page, not the upper bookcase.");
assert(R.lecternApproachDistance > 1.5,
  "Reading viewpoint must not clip into the physical lectern.");

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
// The chair must have a *real* matching collision volume, while the removed
// Article bench must leave no invisible blocker on the visitor's path.
const dataJS = ts.transpileModule(data, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const dataModule = { exports: {} };
const requireData = (name) => {
  assert.equal(name, "./scene/readingGeometry");
  return { READING_GEOMETRY: R };
};
new Function("require", "module", "exports", "document", dataJS)(
  requireData, dataModule, dataModule.exports, { baseURI: "https://example.invalid/" });
const D = dataModule.exports;
assert(Object.isFrozen(D.ARTICLE_CHAIR_PLACEMENT),
  "Art furniture placement must be immutable");
for (const field of ["ringRadius", "offsetX", "offsetZ", "localYaw"]) {
  assert(dressing.includes("ARTICLE_CHAIR_PLACEMENT." + field),
    "Rendered chair disconnected from shared collision placement: " + field);
}
assert(dressing.includes("SECTION_BENCH_RING_RADIUS"),
  "Other section benches no longer use the shared radius");
assert(read("scene/Player.tsx").includes("for (const [ox, oz, or] of OBSTACLES)"),
  "Player movement does not honor the canonical obstacle list");
const chair = D.ARTICLE_CHAIR_PLACEMENT;
const [chairX, chairZ] = D.articleChairXZ();
const chairOutline = Math.hypot(0.42422, 0.41731); // verified original glTF bbox
assert(chair.collisionRadius > chairOutline + 0.01,
  "Chair collision does not enclose the real 0.85 × 0.77 m mesh");
const near = (obstacle, x, z) =>
  Math.hypot(obstacle[0] - x, obstacle[1] - z) < 0.001;
const realCollider = D.OBSTACLES.filter((o) => near(o, chairX, chairZ));
assert.equal(realCollider.length, 1, "Art chair must have exactly one collision volume");
assert.equal(realCollider[0][2], chair.collisionRadius,
  "Chair and collision use a different physical footprint");
const article = D.byId("articles");
const a = article.angle * Math.PI / 180;
const ghostX = Math.sin(a) * D.SECTION_BENCH_RING_RADIUS;
const ghostZ = Math.cos(a) * D.SECTION_BENCH_RING_RADIUS;
assert(!D.OBSTACLES.some((o) => near(o, ghostX, ghostZ)),
  "Old Article bench collision remains after that bench was replaced");
const wallClearance = D.WALK_RADIUS - Math.hypot(chairX, chairZ)
  - chair.collisionRadius - D.PLAYER_COLLISION_RADIUS;
assert(wallClearance > 1.0,
  "Furniture blocks pedestrian passage between chair and outer wall");
const [articleX, articleZ] = D.itemPos(article);
const stationPassage = Math.hypot(chairX - articleX, chairZ - articleZ)
  - chair.collisionRadius - 1.05 - 2 * D.PLAYER_COLLISION_RADIUS;
assert(stationPassage > 0.35,
  "Chair collides with walkable two-sided clearance at the Article station");
const furnitureProof = { x: +chairX.toFixed(3), z: +chairZ.toFixed(3),
  collisionRadius: chair.collisionRadius,
  wallClearance: +wallClearance.toFixed(3),
  stationPassage: +stationPassage.toFixed(3), ghostRemoved: true };
// A collision can be locally correct yet strand another exhibit. Verify the
// entire visitor floor is connected from SPAWN to every actual approachPose.
// The 22cm grid is finer than the 35cm player radius; diagonal moves cannot
// cut through solid corners. This is a navigation topology gate, not art QA.
const step = 0.22;
const side = Math.ceil(2 * D.WALK_RADIUS / step) + 3;
const half = (side - 1) / 2;
const xy = (n) => (n - half) * step;
const walkableAt = (x, z) =>
  Math.hypot(x, z) <= D.WALK_RADIUS - 0.05 &&
  D.OBSTACLES.every(([ox, oz, radius]) =>
    Math.hypot(x - ox, z - oz) >= radius + D.PLAYER_COLLISION_RADIUS + 0.01);
const walkable = new Uint8Array(side * side);
for (let z = 0; z < side; z++) for (let x = 0; x < side; x++) {
  if (walkableAt(xy(x), xy(z))) walkable[z * side + x] = 1;
}
const closestCell = (x, z) => {
  const ix = Math.round(x / step + half), iz = Math.round(z / step + half);
  if (ix < 0 || iz < 0 || ix >= side || iz >= side) return -1;
  for (let radius = 0; radius <= 2; radius++) {
    for (let dx = -radius; dx <= radius; dx++)
      for (let dz = -radius; dz <= radius; dz++) {
        const a = ix + dx, b = iz + dz;
        if (a >= 0 && b >= 0 && a < side && b < side && walkable[b * side + a])
          return b * side + a;
      }
  }
  return -1;
};
assert(walkableAt(D.SPAWN.x, D.SPAWN.z), "Real initial spawn is blocked");
const start = closestCell(D.SPAWN.x, D.SPAWN.z);
assert(start >= 0 && walkable[start], "Spawn has no walkable grid cell");
const moves = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
const reachableFromSpawn = (available) => {
  const queue = new Int32Array(side * side), visited = new Uint8Array(side * side);
  let readIndex = 0, writeIndex = 0;
  assert(available[start], "Probe blocked the real spawn");
  queue[writeIndex++] = start; visited[start] = 1;
  while (readIndex < writeIndex) {
    const index = queue[readIndex++], x = index % side, z = (index - x) / side;
    for (const [dx, dz] of moves) {
      const nx = x + dx, nz = z + dz;
      if (nx < 0 || nz < 0 || nx >= side || nz >= side) continue;
      const next = nz * side + nx;
      if (!available[next] || visited[next]) continue;
      if (dx !== 0 && dz !== 0 &&
        (!available[z * side + nx] || !available[nz * side + x])) continue;
      visited[next] = 1; queue[writeIndex++] = next;
    }
  }
  return { visited, reachableCells: writeIndex };
};
const { visited, reachableCells } = reachableFromSpawn(walkable);
for (const exhibit of D.ITEMS) {
  const approach = D.approachPose(exhibit);
  assert(walkableAt(approach.x, approach.z),
    `Target viewpoint intersects real collider: ${exhibit.id}`);
  const cell = closestCell(approach.x, approach.z);
  assert(cell >= 0 && visited[cell],
    `No continuous walkable path from SPAWN to ${exhibit.id}`);
  const cx = cell % side, cz = (cell - cx) / side;
  assert(Math.hypot(xy(cx) - approach.x, xy(cz) - approach.z) <=
    step * Math.SQRT2 / 2 + 0.02,
    `Arrival to ${exhibit.id} snaps too far from the actual approach pose`);
}
// Negative fixture: surround one still-walkable approach with an artificial
// closed barrier. The same BFS must detect isolation, even though the target
// itself is not colliding with any obstacle. Never apply this to scene data.
const target = D.approachPose(D.byId("articles"));
const targetCell = closestCell(target.x, target.z);
assert(targetCell >= 0 && walkable[targetCell], "Route negative fixture target not walkable");
const enclosed = walkable.slice();
for (let z = 0; z < side; z++) for (let x = 0; x < side; x++) {
  const distance = Math.hypot(xy(x) - target.x, xy(z) - target.z);
  if (distance >= 0.75 && distance <= 1.25) enclosed[z * side + x] = 0;
}
assert(enclosed[targetCell], "Negative fixture must preserve the destination cell");
const blocked = reachableFromSpawn(enclosed);
assert(!blocked.visited[targetCell],
  "BFS incorrectly accepts an intact destination cut off by a closed barrier");
console.log("HALL_ROUTE_NEGATIVE_PASS " + JSON.stringify({
  fixture: "closed-barrier-around-articles", targetStillWalkable: true,
  disconnectedTargetDetected: true,
}));
console.log("HALL_ROUTE_TOPOLOGY_PASS " + JSON.stringify({
  reachableExhibits: D.ITEMS.length, reachableCells,
  gridStepMetres: step, diagonalCornerCutting: false,
}));
console.log("FURNITURE_COLLISION_PASS " + JSON.stringify(furnitureProof));
console.log("READING_GEOMETRY_PASS " + JSON.stringify(real));
