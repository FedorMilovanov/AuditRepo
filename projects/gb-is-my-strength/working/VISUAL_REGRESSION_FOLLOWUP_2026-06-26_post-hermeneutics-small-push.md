# Visual regression follow-up after small push — Hermeneutics improved but far from resolved
Date: 2026-06-26
Verifier: Arena agent
Scope: source audit after user-reported small push
Reference: `/home/user/uploads/gb-floating-cluster-probe-v16 (2).html`

## Summary
A small source improvement appears to have landed for Hermeneutics intent at the component level, but the overall system remains structurally regression-prone and still materially diverges from the reference in multiple places.

The biggest current truth is:
- **component-local Hermeneutics intent is now closer to the reference**,
- **but global legacy CSS still contains later override drift**,
- **Gill family still remains split and visually inconsistent**,
- **legacy shells / bookmark toast / old GBS2 stack still coexist with premium controls**.

---

## 1. What likely improved in Hermeneutics
### Source witness
`src/components/ui/floating-cluster/SingleArticleCluster.astro`
contains an explicit, owner-aware Hermeneutics variant:
- `.gb-floater--hermeneutics { top: calc(clamp(24px, 3.5vw, 44px) - 4px); right: max(8.5vw, ...); }`
- comments explicitly say it should preserve the old breadcrumb-level anchor.

### Interpretation
This does look like a targeted move toward the intended placement contract.
So yes: **there was a meaningful source-side improvement attempt**.

---

## 2. Why that still does not solve the emergency
### Confirmed-current blocker
`css/floating-cluster.css` still contains a later global standalone override block:
- `.page-wrap ~ .gb-floater, .page-wrap + .gb-floater, #content ~ .gb-floater { right: max(8.5vw, ...); }`
- later same selector family forces `top: clamp(48px, 7vw, 100px);`

### Why this is bad
That means Hermeneutics still does **not** have a single uncontested placement source of truth.
Even if the component was improved, the global CSS artifact remains capable of dragging the floater away again.

### Verifier conclusion
Hermeneutics is **closer than before** at source intent level, but **not safely fixed**.

---

## 3. Gill footer still diverges from reference in the legacy CSS copy
### Reference contract
`gbs-rail-foot` in the reference:
- `justify-content: space-between`
- `gap: 0`
- `padding-top: 12px`
- no extra rounded footer box

### Correct component source
`src/components/ui/floating-cluster/GillRailControls.astro`
- still matches the reference correctly.

### Drifted global copy still present
`css/floating-cluster.css` under `[data-gill-v16] .gbs-rail-foot` still uses:
- `justify-content:center`
- `gap:4px`
- `padding:10px 8px`
- `border-radius:12px`
- `background:rgba(255,255,255,.03)`

### Conclusion
The Gill control strip is still vulnerable to the same ugly non-reference look.
This is still a **confirmed-current visual regression vector**.

---

## 4. Gill context vs Gill parts are still architecturally split
### Current source truth
- `GillContextPageChrome.astro` = custom `[data-gill-v16]` world
- `GillPart1/2/3/SpravochnikPageChrome.astro` = older `gbs2-rail` family shell with legacy mobile sheet / bbar

### Why this matters
The user’s complaint about:
- different block in historical Gill,
- separate Roman numeral treatment,
- non-unified family quality,
remains fully source-true.

There has been **no family unification yet**.

---

## 5. Old shells are still present and can contaminate visual truth
### Evidence
Multiple current files still contain:
- `bookmark-toast`
- `gbs2-rail`
- `gbs2-sheet`
- `gbs2-bbar`

Examples:
- `HermenevtikaBody.astro` still contains `bookmark-toast`
- Gill parts still contain `bookmark-toast` and full `gbs2-*` legacy stack

### Interpretation
Even where premium controls exist, old chrome still survives nearby.
That greatly increases risk of:
- duplicate affordances,
- visual contamination,
- “white circles / weird blocks / different bars” complaints,
- future regression reintroduction.

---

## 6. Play-expand code is still sitting inside the shared CSS/runtime and remains a risk surface even if not touched
The user explicitly said not to work on play expand yet.
Current source still contains:
- large speed-expand CSS in `css/floating-cluster.css`
- `initPlayExpand()` logic in `js/floating-cluster-controller.js`

Even if untouched, this increases complexity in the same shared file set that controls the emergency visual surfaces.

Verifier note: not claiming this is the immediate visible bug, only that it remains part of the instability surface.

---

## 7. Narrowed truth after the small push
### Improved
- Hermeneutics component-level anchor intent looks more owner-aware and closer to the reference than the raw default fixed corner positioning.

### Still unresolved / unsafe
- global late `.gb-floater` override remains live;
- Gill footer global copy still departs from reference;
- Gill context still uses different family architecture;
- old `gbs2-*` and toast shells still coexist;
- merged CSS remains too drift-prone to treat as stable final truth.

---

## 8. Recommended repair strategy (audit recommendation, not implementation)
### Phase A — Stabilize Hermeneutics first
1. Remove or hard-scope away the late `.page-wrap ~ .gb-floater` / `#content ~ .gb-floater` override block from shared CSS.
2. Make Hermeneutics placement depend only on the dedicated `.gb-floater--hermeneutics` contract.
3. Reverify in browser against breadcrumb level, not just source.

### Phase B — Restore Gill footer to reference
1. Replace the drifted `[data-gill-v16] .gbs-rail-foot` block in `css/floating-cluster.css` with exact reference values already present in `GillRailControls.astro`.
2. Ensure visible route surfaces actually use that truth instead of the boxed centered strip.

### Phase C — Unify Gill family
1. Choose a single final series-block architecture for all 5 Gill pages.
2. Historical context must stop being its own design island.
3. Remove “different Roman block / separate top block” split.

### Phase D — Remove coexisting legacy contamination
1. Audit whether `bookmark-toast`, `gbs2-bbar`, `gbs2-sheet`, legacy rail fragments should remain on premiumized pages.
2. Where premium controls replace old behavior, old shells should not still visually coexist.

---

## Bottom line
There was likely a **real but small improvement** for Hermeneutics. But the emergency is not over. Current HEAD still contains enough global override drift, duplicated shells, and cross-family inconsistency that the user’s “still far from ideal, still many bugs/regressions/non-reference behaviors” assessment is justified.
