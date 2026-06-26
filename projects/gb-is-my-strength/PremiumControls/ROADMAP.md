# PremiumControls — Roadmap PC-001..PC-006

**Base:** PR #19 `e204104` — Phase 1+2 merged  
**Next:** `lane/premiumcontrols-phase3-2026-06-26`

| ID | Severity | Title | Status |
|---|---|---|---|
| PC-001 | P1 | `PremiumControlAnchor` missing; controls = `position:fixed` | ⬜ OPEN |
| PC-002 | P0 | Heart-series `Krajne` / `Rimlyanam7`: `gb-ember`+`gb-save` without `[data-fc-root]` | ⬜ OPEN |
| PC-003 | P1 | Source hash drift: `ba4a4019` / `efd81d3a` / `58c2ea90` | ⬜ OPEN |
| PC-004 | P1 | CSS duplicate: 3× Astro `<style is:global>` + `css/floating-cluster.css` | ⬜ OPEN |
| PC-005 | P2 | PlayEmber semantics: key `gbx-tts-rate` ≠ `gb:audio:rate` | 🟨 PARTIAL (TTS real, key old) |
| PC-006 | P2 | No route-archetype audit | ⬜ OPEN |

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
