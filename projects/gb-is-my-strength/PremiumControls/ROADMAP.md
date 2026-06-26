# PremiumControls — Roadmap PC-001..PC-006

**Base:** PR #19 `e204104` — Phase 1+2 merged  
**Next:** `lane/premiumcontrols-phase3-2026-06-26`

| ID | Severity | Title | Status |
|---|---|---|---|
| PC-001 | P1 | `PremiumControlAnchor` extraction / adoption | ✅ SOURCE-LANDED / verify rollout completeness |
| PC-002 | P0 | Heart-series `Krajne` / `Rimlyanam7`: `gb-ember`+`gb-save` wiring | ✅ FIXED on current HEAD |
| PC-003 | P1 | Source hash drift / asset-version parity | 🟨 MOSTLY FIXED, keep parity watch |
| PC-004 | P1 | CSS duplicate cleanup / canonical CSS source | ✅ SOURCE-LANDED / verify cross-route parity |
| PC-005 | P2 | PlayEmber semantics: canonical key/event/ARIA/reference UI | 🟨 ADVANCED — major fixes landed, residual parity/review remains |
| PC-006 | P2 | Route-archetype / rollout audit | ✅ SCRIPT EXISTS; integrate into canonical barrier if desired |

---

## PC-002 — Heart-series wiring — P0 — DO FIRST

Files:
- `src/components/article-pilots/krajne/KrajneBody.astro`
- `src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro`

Change: wrap `gbs2-rfoot` controls with
```html
<div data-fc-root data-fc-mode="series-lite" data-fc-variant="heart">
  <!-- existing gb-ember + gb-save buttons -->
</div>
```

Accept: Play opens speed panel, Save toggles, no dead controls.

---

## PC-005 — PlayEmber semantics — P2

File: `js/floating-cluster-controller.js`

- [ ] storage canonical: `gb:audio:rate`, read alias `gbx-tts-rate`
- [ ] dispatch: `gb:tts-rate-change`
- [ ] remove any remaining "Озвучка ещё не подключена" idle toast
- [ ] ARIA: `aria-haspopup/aria-expanded/aria-controls` coherent
- [ ] Speed morph UI matches `spec/playember-speed-morph.md`

---

## PC-003 — Asset hash unification — P1

- [ ] Create `src/lib/asset-version.js` or Astro helper component
- [ ] Remove hardcoded `?v=xxx` from 36 PageHead components
- [ ] fc-controller / premium-controls.css linked via helper
- [ ] `cache-bust.js` = safety net only

Current drift:
```
js/floating-cluster-controller.js actual: ba4a4019
  source refs: 25× ba4a4019, 14× efd81d3a, 1× 58c2ea90
css/floating-cluster.css actual: f4bddc5b
  source refs: f4bddc5b + ccc70580
```

---

## PC-001 + PC-004 — Anchor + canonical CSS — P1

- [ ] `src/components/ui/premium-controls/PremiumControlAnchor.astro`
- [ ] `src/styles/premium-controls.css` — single canonical source
- [ ] build → `public/css/premium-controls.css`
- [ ] Remove `.gb-*` duplicates from:
  - `SingleArticleCluster.astro`
  - `SeriesLiteCluster.astro`
  - `GillRailControls.astro`
- [ ] Desktop single-anchor: control at breadcrumb-level, top delta ≤ 8px
- [ ] No viewport-right drift

---

## PC-006 — Route audit — P2

- [ ] `scripts/premium-controls-rollout-audit.js`
- Check:
  - allowed routes have expected root
  - forbidden app/landing routes: 0× `gb-ember` / `gb-save`
  - every `[data-fc-action]` inside `[data-fc-root]` / `[data-fc-controls]`
  - no stale asset hashes
- [ ] `package.json`: `"audit:premium-controls": "node scripts/premium-controls-rollout-audit.js"`
- [ ] CI gate

---

## Phase 3 acceptance

- [ ] Krajne / Rimlyanam7 controls alive
- [ ] PlayEmber speed morph matches reference screenshots
- [ ] `gb:audio:rate` canonical, legacy alias read
- [ ] No "Озвучка ещё не подключена" toast anywhere
- [ ] Asset hashes unified in source
- [ ] `PremiumControlAnchor` exists, CSS canonical
- [ ] Route audit green
- [ ] `npm run validate:all` green
- [ ] All `[data-fc-action]` clickable site-wide

---

Mark done with ✅ when merged to main.


---

## Current-head reverify note (2026-06-27)

This roadmap was originally written against the PR #19 / Phase 1+2 baseline.
Current source HEAD moved substantially beyond that baseline.

Verified on current source HEAD during this pass:
- `src/components/ui/premium-controls/PremiumControlAnchor.astro` exists
- `scripts/premium-controls-rollout-audit.js` exists
- `KrajneBody.astro` and `Rimlyanam7Body.astro` now contain `data-fc-root data-fc-mode="series-lite"`
- `js/floating-cluster-controller.js` now reads canonical `gb:audio:rate` first, keeps legacy `gbx-tts-rate` fallback, and exposes `aria-controls` / `aria-expanded` wiring
- old toast wording "Озвучка ещё не подключена" is no longer current-head runtime truth for the PlayEmber path

Interpretation:
- PC-001 / PC-002 / PC-004 / PC-006 are no longer safe to describe as simply OPEN.
- Remaining real concerns are now mostly current-head parity / rollout / barrier-integration / naming-cleanup questions, not first-order absence.
- Runtime naming is still transitional (`floating-cluster-controller.js` remains the active file), so architectural canonicalization is not fully complete.


Additional source-history note: commit `99a7acfd` explicitly records the v2.1 merge/release point that claimed closure of PC-001..PC-006, followed by later stabilization commits (`6c5b83a3`, `2be8c0ed`, `9e06173b`, `8f42c9f8`, `f372505f`, `3e477231`). Treat roadmap status through those later pushes, not only the PR #19 snapshot.
