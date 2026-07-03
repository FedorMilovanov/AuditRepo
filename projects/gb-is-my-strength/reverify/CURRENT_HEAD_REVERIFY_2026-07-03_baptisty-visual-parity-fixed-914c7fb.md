# Current-head reverify — `/baptisty-rossii/` visual parity fixed

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-03  
**Source main before fix:** `d5c65647d57cf3bc83b6543cb58135cdd279013f`  
**Source fix commit:** `914c7fb11e51e25937e0afc0ef79118c7a246394`  
**Source lane/main:** `lane/visual-baptisty-parity-2026-07-03` and `main`

---

## 1. Scope

Close `NEW-65` / `VIS-BAPTISTY-PARITY`: the pixel guard for `/baptisty-rossii/` failed because legacy root and production-like dist differed by 72.5px in the GBS2 rail footer.

---

## 2. Root cause

Production-like dist (strict-native Astro) had the current Baptisty PremiumControls footer in `.gbs2-rfoot`:

- `data-fc-root data-fc-mode="series-lite" data-fc-variant="baptisty"`
- `gb-ember` Play control
- `gb-save` Save control
- `floating-cluster.css`
- `floating-cluster-controller.js`

The root legacy baseline `baptisty-rossii/index.html` was stale and still had the old pre-PremiumControls footer. Browser evidence showed:

```text
legacy .gbs2-rfoot height = 31.5px
dist   .gbs2-rfoot height = 104px
delta = 72.5px
```

This shifted all subsequent content and produced the Pass 37 visual diff.

---

## 3. Source changes

Commit `914c7fb1`:

- Synced root `baptisty-rossii/index.html` to the dist-owned/current PremiumControls footer contract.
- Added root `floating-cluster.css` stylesheet link.
- Added root `floating-cluster-controller.js` script.
- Added source lane report: `docs/refactor-2026/lanes/visual-baptisty-parity-2026-07-03.md`.

No PremiumControls CSS/JS geometry changed. No Astro component source changed.

---

## 4. Verification

```text
npm run strangler:build:production-like                           PASS
node scripts/visual-parity-screenshots.js --routes /baptisty-rossii/ --threshold 1.0  PASS
npm run owner:ui-guard                                             PASS
npm run audit:premium-controls                                     PASS (87/87)
npm run baptisty-rossii:visual-parity:audit                        PASS
npm run validate:strict                                            PASS (0 errors, 2 pre-existing warnings)
npm run guard:shared-files                                         PASS
```

Pixel result after fix:

```text
/baptisty-rossii/ desktop: diff=0.000% (legacy 1280x12956 vs dist 1280x12956)
/baptisty-rossii/ mobile:  diff=0.000% (legacy 391x10656 vs dist 391x10656)
```

---

## 5. Status

`NEW-65` / `VIS-BAPTISTY-PARITY`: **fixed-current on source main `914c7fb1` by local W3 pixel evidence**.

Remote GitHub Actions should be observed separately for final workflow status.
