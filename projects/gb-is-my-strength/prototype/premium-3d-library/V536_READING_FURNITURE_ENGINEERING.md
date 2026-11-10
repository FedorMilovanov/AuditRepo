# V5.36 — physical reading-furniture geometry (single existing Draft PR #545)

**Baseline:** V5.35 `2401bd3903c869cd994e220d6c64d7983d48c51e`, whose exact-head GitHub CI is verified **Preflight SUCCESS and Validate SUCCESS**. See the actual V5.35 log: **11 suites / 57 browser cases PASS** (run 42908871960). The candidate described here is strictly LAB/ART HOLD; no Product, main, merge, public preview or release.

## Reproduced defects in the actual renderer and authored geometry

1. The `c-about` lectern presented its page as a near-vertical plate disconnected from the wooden writing board. In the prior source a default XY `planeGeometry` was placed without an X rotation inside a board group, so its normal was **perpendicular** to the board normal. Chrome desktop/WebKit touch screenshots captured the defective public sitemap approach.
2. The first local fix simply laid the page flat, but a screenshot exposed an additional defect: the entire board had the wrong tilt sign and the page faced away from the approaching reader. **That trial was rejected**, not promoted as accepted evidence.
3. The central book's front cover penetrated the solid tabletop by about **38.9 mm** (`1.95 - .09*cos(.35) - .8*sin(.35) = 1.5911m`, against table height `1.63m`). Its rear wooden supports intersected the book.

## Accepted, physically verified changes

- `src/scene/readingGeometry.ts` is a single immutable source of truth (metres/radians) consumed by the real `Center.tsx`, `Dressing.tsx` and independent analytical regression.
- The centre volume is raised to **2.00m** world Y, preserving the original table and book dimensions, camera, station IDs, lighting and ownership. Support centre Y adjusted to **1.84m** while retaining two solid wooden supports.
- Exact transformed-geometry witness: **book-front / tabletop clearance 0.0111382m** and **minimum support-top / book-underside clearance 0.0116956m**. The normals of page and reading board coincide (dot product 1.0). The lectern board slope and page now face the approaching visitor (positive front-facing normal).
- `tests/reading-furniture-geometry.mjs` uses real Three.js transformations, coordinates from the runtime source, and negative fixtures for the old book collision, the old support overlap, perpendicular page orientation and reader-away tilt. No snapshot hacks.
- `tests/reading-furniture-browser.py` uses actual public intro + site-map navigation to the real `c-about` stop. Chromium + Windows Playwright WebKit × 1440×900 and emulated 390×844 — **4/4 PASS locally**, with source-owned real screenshot captures of both the centre and lectern. No JS/HTTP errors, no overflow, DOM title visible, WebGL2 present.
- Previous source-owned browser matrix **11 suites / 57 cases** grows to **12 suites / 61 cases**, with fail-closed validation for the four exact engine/viewport combinations and both required screenshot witnesses. Local test contract and TS/Vite build passed.

## Actual evidence / provenance

[Machine-readable PNG+WebP SHA-256 ledger](evidence/reading-v536-evidence.json) records the exact baseline `2401bd3`, source screenshots, lossless conversion and decoded RGB equality. All six files are **real headless browser captures**, not design concept or generated composition:

- [Chrome desktop lectern BEFORE](evidence/reading-v536-chromium-1440x900-lectern-before.webp) / [AFTER](evidence/reading-v536-chromium-1440x900-lectern-after.webp)
- [WebKit 390px lectern BEFORE](evidence/reading-v536-webkit-390x844-lectern-before.webp) / [AFTER](evidence/reading-v536-webkit-390x844-lectern-after.webp)
- [Chrome desktop central book BEFORE](evidence/reading-v536-chromium-1440x900-central-before.webp) / [AFTER](evidence/reading-v536-chromium-1440x900-central-after.webp)

Technical evidence is **not** an artistic signature. Current full hall remains schematic and does not meet the concept's photorealistic intent. Further licensed GLB/PBR source work and owner side-by-side acceptance are required.

## Hard release gates (UNCHANGED)

1. **New exact-head** Workflow Preflight SUCCESS and **Validate 12/12 suites, 61/61 public browser cases SUCCESS**. Historic V5.35 57/57 cannot certify V5.36.
2. Genuine physical iOS Safari/Android/XR, long-session GPU frame-time/VRAM/thermal assessment, owner visual art acceptance and reduced-motion assistive-tech acceptance.
3. Separate Product-owned publication rights, real canonical catalog, Reader/Library account migration and independent reviewed Product promotion PR.

**No merge, Product deployment, additional branch, route rewrite or credentials touched. Keep LAB / Draft / ART HOLD.**
