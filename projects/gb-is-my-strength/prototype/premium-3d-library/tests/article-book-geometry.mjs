// The Article section's open folio must rest on its stone pedestal.
// This checks real mesh vertices and the source JSX, not just an art screenshot.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import * as THREE from "three";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const original = fs.readFileSync(path.join(root, "src/scene/openBookGeometry.ts"), "utf8");
const transpiled = ts.transpileModule(original, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const m = { exports: {} };
new Function("require", "module", "exports", transpiled)((name) => {
  assert.equal(name, "three");
  return THREE;
}, m, m.exports);
const { ARTICLE_BOOK: p, articleBookCenterY, makeArticlePageGeometry } = m.exports;

assert(Object.isFrozen(p), "The physical book contract is mutable");
// The front lower edge of the inclined wooden board rests on stone,
 // and the leather cover intersects its supporting face by under 10mm.
const theta = p.displayTiltX;
const scale = p.displayScale;
const contact = p.stationArtOriginY + articleBookCenterY() + scale * (
  (p.panelCenterY - p.panelThickness / 2) * Math.cos(theta)
  - p.panelDepth / 2 * Math.sin(theta)
);
assert(Math.abs(contact - p.pedestalTopY) < 1e-8,
  "The sloped board no longer contacts the real stone pedestal");
const boardTopY = p.panelCenterY + p.panelThickness / 2;
const coverBottomY = -p.coverThickness / 2;
assert(Math.abs(boardTopY - coverBottomY) < 0.01,
  "Book covers are floating above or buried inside their wooden board");
const footY = p.braceCenterWorldY - p.braceLength / 2 * Math.cos(p.braceTiltX);
const braceHeadY = p.braceCenterWorldY + p.braceLength / 2 * Math.cos(p.braceTiltX);
const braceHeadZ = p.braceCenterZ + p.braceLength / 2 * Math.sin(p.braceTiltX);
const boardLocalZ = (braceHeadZ - scale * p.panelCenterY * Math.sin(theta))
  / (scale * Math.cos(theta));
const boardUnderBrace = p.stationArtOriginY + articleBookCenterY() + scale * (
  (p.panelCenterY - p.panelThickness / 2) * Math.cos(theta)
  - boardLocalZ * Math.sin(theta)
);
assert(Math.abs(footY - p.pedestalTopY) < 0.03,
  "Rear book supports do not begin on the real stone plinth");
assert(Math.abs(braceHeadY - boardUnderBrace) < 0.05,
  "Rear book supports do not bear the inclined reading board");
assert(Math.hypot(p.braceX,
  p.braceCenterZ - p.braceLength / 2 * Math.sin(p.braceTiltX)) < 0.78,
  "Braces stand outside the actual top of the stone pedestal");
assert(p.coverLeafWidth > p.pageBlockWidth && p.coverDepth > p.pageBlockDepth,
  "The volume of paper protrudes beyond the binding");
assert(p.pageBlockCenterY - p.pageBlockThickness / 2 < p.coverThickness / 2,
  "Page blocks must overlap the actual boards, not float above them");
const blockTop = p.pageBlockCenterY + p.pageBlockThickness / 2;
assert(p.paperSurfaceBaseY > blockTop && p.paperSurfaceBaseY - blockTop < 0.015,
  "Paper surface is not visibly bound to the block");
assert(p.leafCenterX * 2 + p.coverLeafWidth <= 1.55,
  "The book's outer width exceeds its supporting pedestal diameter");
const witnesses = [];
for (const side of [-1, 1]) {
  const geometry = makeArticlePageGeometry(side);
  try {
    const attr = geometry.getAttribute("position");
    const normal = geometry.getAttribute("normal");
    assert(attr.count >= 120 && normal.count === attr.count,
      "Leaf geometry lacks smooth surface tessellation");
    let low = Infinity, high = -Infinity;
    for (let i = 0; i < attr.count; i++) {
      const x = attr.getX(i), y = attr.getY(i), z = attr.getZ(i);
      assert(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z),
        "Non-finite page vertex");
      assert(x * side > 0.035 && x * side < 0.75,
        "Leaf escapes its own book board");
      assert(Math.abs(z) <= p.pageLeafDepth / 2 + 1e-6,
        "Leaf escapes its bound spine length");
      assert(y >= blockTop && y < blockTop + 0.05,
        "Leaf floats too far from its bound page block");
      assert(normal.getY(i) > 0.95, "Paper is standing upright, not an open folio");
      low = Math.min(low, y);
      high = Math.max(high, y);
    }
    assert(high - low > 0.009 && high - low < 0.04,
      "Pages must have a gentle physical crown, not flat or spiky V-wings");
    witnesses.push({ side, vertices: attr.count,
      minY: +low.toFixed(4), maxY: +high.toFixed(4) });
  } finally {
    geometry.dispose();
  }
}
const scene = fs.readFileSync(path.join(root, "src/scene/Stations.tsx"), "utf8");
const art = scene.slice(scene.indexOf("function BookArt("), scene.indexOf("function SeriesArt("));
assert(scene.includes("art.current.position.y = 1.95;") &&
  scene.includes('<group ref={art} position={[0, 1.95, 0]}>') &&
  scene.includes('<mesh position={[0, 1.04, 0]} material={goldMat}>') &&
  scene.includes('<cylinderGeometry args={[0.78, 0.62, 0.1, 40]} />'),
  "Station artwork origin or pedestal dimensions drifted from the actual support");
assert(art.length > 100 && art.includes("articleBookCenterY()") &&
  art.includes("makeArticlePageGeometry(-1)") &&
  art.includes("makeArticlePageGeometry(1)") &&
  art.includes("rotation-x={p.displayTiltX} scale={p.displayScale}") &&
  art.includes("boxGeometry args={[p.panelWidth, p.panelThickness, p.panelDepth]}") &&
  art.includes("p.braceLength") &&
  art.includes("geometry={side < 0 ? left : right}"),
  "Actual Article JSX is disconnected from tested real geometry");
assert(!art.includes("useFrame(") && !art.includes("flips.current") &&
  !art.includes("sheets.current") && !art.includes("pointLight"),
  "Floating pages or independent orbit animation were reintroduced");
console.log("ARTICLE_OPEN_BOOK_CONTACT_PASS " + JSON.stringify({
  worldReadingBoardFrontY: +contact.toFixed(4),
  pedestalTopY: p.pedestalTopY,
  braceFootY: +footY.toFixed(4),
  braceHeadY: +braceHeadY.toFixed(4),
  gapToPaperBlock: +(p.paperSurfaceBaseY - blockTop).toFixed(4),
  leaves: witnesses, detachedSheets: 0,
}));
