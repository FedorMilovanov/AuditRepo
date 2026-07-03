# Current-head reverify — Baptisty root PremiumControls asset path fix

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-03  
**Source failing commit:** `8d0c12e0756c6dd0327a212dba6b8a7bbdc01d3e`  
**Source fix commit:** `932af3f32f9088363f1024affa277b6e7db8257e`  
**Source lane/main:** `lane/visual-baptisty-root-path-fix-2026-07-03` and `main`

---

## 1. Scope

The first Baptisty visual parity fix (`914c7fb1`) made pixel parity pass but introduced root HTML local-reference audit errors because the root page used `../../css/floating-cluster.css` and `../../js/floating-cluster-controller.js` paths. In browser URL resolution those worked, but filesystem/local-reference validation resolves them relative to `baptisty-rossii/index.html` and treated them as missing.

---

## 2. Source changes

Commit `932af3f3`:

- `baptisty-rossii/index.html`: changed root-only PremiumControls asset paths:
  - `../../css/floating-cluster.css` → `../css/floating-cluster.css`
  - `../../js/floating-cluster-controller.js` → `../js/floating-cluster-controller.js`

No visual geometry or source Astro component changed.

---

## 3. Verification

```text
npm run validate:static-publication                               PASS
node scripts/visual-parity-screenshots.js --routes /baptisty-rossii/ --threshold 1.0 PASS
npm run workflows:check                                           PASS
npm run guard:shared-files                                        PASS
```

Targeted pixel result remained green:

```text
/baptisty-rossii/ desktop: diff=0.000%
/baptisty-rossii/ mobile:  diff=0.000%
```

---

## 4. Status

- `NEW-65` remains fixed-current on source main `932af3f3`.
- The temporary root local-reference regression from `914c7fb1` / `8d0c12e0` is fixed-current on `932af3f3`.
