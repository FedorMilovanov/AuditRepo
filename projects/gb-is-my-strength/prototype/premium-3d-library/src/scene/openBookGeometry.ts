import * as THREE from "three";

/** Authored contact geometry for the physical Article-section book (metres).
 * Stations.tsx sets the artwork group at 1.95m. The stone pedestal's actual
 * top is 1.09m. An inclined hardwood reading board and two structural
 * braces physically support the folio; nothing floats or orbits.
 */
export const ARTICLE_BOOK = Object.freeze({
  stationArtOriginY: 1.95,
  pedestalTopY: 1.09,
  displayScale: 1.3,
  displayTiltX: 0.56,
  panelCenterY: -0.082,
  panelThickness: 0.095,
  panelWidth: 1.53,
  panelDepth: 1.16,
  braceCenterWorldY: 1.49,
  braceCenterZ: -0.425,
  braceTiltX: -0.512,
  braceLength: 0.92,
  braceX: 0.37,
  coverThickness: 0.07,
  coverLeafWidth: 0.73,
  coverDepth: 1.08,
  leafCenterX: 0.365,
  pageBlockWidth: 0.67,
  pageBlockDepth: 0.99,
  pageBlockThickness: 0.09,
  pageBlockCenterY: 0.077,
  pageLeafWidth: 0.63,
  pageLeafDepth: 0.96,
  paperSurfaceBaseY: 0.132,
  paperCrownY: 0.014,
  paperGutterRiseY: 0.009,
  pageSegmentsX: 18,
  pageSegmentsZ: 8,
});

/** The sloped wooden reading board actually touches the stone pedestal
 * at its forward lower edge; two real rear braces bear its raised end. */
export function articleBookCenterY(): number {
  const p = ARTICLE_BOOK;
  const forwardUnderBoard = p.displayScale * (
    (p.panelCenterY - p.panelThickness / 2) * Math.cos(p.displayTiltX)
    - p.panelDepth / 2 * Math.sin(p.displayTiltX)
  );
  return p.pedestalTopY - p.stationArtOriginY - forwardUnderBoard;
}

/** A bound, gently curved leaf on each side of the book's spine.
 * A single shared material is owned/disposed by BookArt; each geometry is
 * owned/disposed by the same component. No physics-less plane animation.
 */
export function makeArticlePageGeometry(side: -1 | 1): THREE.PlaneGeometry {
  const p = ARTICLE_BOOK;
  const geometry = new THREE.PlaneGeometry(
    p.pageLeafWidth, p.pageLeafDepth, p.pageSegmentsX, p.pageSegmentsZ,
  );
  // PlaneGeometry begins in XY. Rotate it to XZ before curving toward +Y.
  geometry.rotateX(-Math.PI / 2);
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i++) {
    const x = side * p.leafCenterX + position.getX(i);
    const t = THREE.MathUtils.clamp(
      (Math.abs(x) - (p.leafCenterX - p.pageLeafWidth / 2))
        / p.pageLeafWidth, 0, 1,
    );
    const y = p.paperSurfaceBaseY
      + p.paperCrownY * Math.sin(Math.PI * t)
      + p.paperGutterRiseY * (1 - t);
    position.setXYZ(i, x, y, position.getZ(i));
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}
