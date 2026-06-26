# CURRENT HEAD REVERIFY — visual regression autopsy (floating-cluster / Gill / hermeneutics)
Date: 2026-06-26
Verifier: Arena agent
Scope: current HEAD source truth only (source-witness reverify)
Routes/families examined:
- Hermeneutics single article chrome
- Gill series pages (context + parts + spravochnik)
Reference:
- `/home/user/uploads/gb-floating-cluster-probe-v16 (2).html`

## Verdict
The user’s visual complaint is materially justified. Current HEAD contains several source-level divergences from the owner reference HTML, and at least two of them are explicit regression-style overrides rather than unavoidable adaptation.

## Evidence labels
- **REF-HTML** = direct reference HTML witness
- **SRC** = current source witness

---

## Finding VR-01 — Hermeneutics standalone cluster is anchored by a later CSS override block, not by the component-local v16 geometry contract
Status: confirmed-current
Severity: high visual regression
Evidence: REF-HTML + SRC

### REF-HTML contract
Reference standalone floater:
- `.gb-floater { position: fixed; top:max(20px,...); right:max(20px,...); ... }`
- no later global override that rebinds the floater to `.page-wrap` / `#content` sibling heuristics

### SRC truth
`src/components/ui/floating-cluster/SingleArticleCluster.astro` defines the intended hermeneutics anchor:
- `.gb-floater--hermeneutics { top: calc(clamp(24px, 3.5vw, 44px) - 4px); right: max(8.5vw, env(...)); }`

However `css/floating-cluster.css` later injects a separate global override block:
- `.page-wrap ~ .gb-floater, .page-wrap + .gb-floater, #content ~ .gb-floater { right: max(8.5vw, ...); }`
- same selector family then forces `top: clamp(48px, 7vw, 100px);`

### Why this matters
This creates two competing geometries:
1. component-local hermeneutics anchor (breadcrumb-level contract)
2. late global sibling-based override (top aligned to `.page-wrap` padding heuristic)

The late global block is broader and not hermeneutics-specific. It is exactly the kind of drift that can move the standalone cluster away from the earlier breadcrumb-level placement the user remembers.

### Regression interpretation
Current source no longer has a single source of truth for hermeneutics placement. The late override block is a plausible direct cause of the “значки вдалеке справа / не на уровне с хлебными крошками” complaint.

---

## Finding VR-02 — Gill reference footer layout was regressed in the global legacy CSS copy to a boxed, centered strip instead of the reference `space-between` row
Status: confirmed-current
Severity: high visual regression
Evidence: REF-HTML + SRC

### REF-HTML contract
Reference HTML `gbs-rail-foot`:
- `justify-content: space-between;`
- `gap: 0;`
- `padding-top: 12px;`
- no extra rounded sub-container background
- button color baseline `#a8957f`

### SRC truth
`src/components/ui/floating-cluster/GillRailControls.astro` matches the reference correctly in its own component-local style block:
- `justify-content: space-between;`
- `gap: 0;`
- `padding-top: 12px;`
- no rounded box background

But `css/floating-cluster.css` contains a second Gill-specific copy under `[data-gill-v16] .gbs-rail-foot` with different styling:
- `justify-content: center;`
- `gap: 4px;`
- `padding: 10px 8px;`
- `border-radius: 12px;`
- `background: rgba(255,255,255,.03);`
- button color drift to `#c4a882`

### Why this matters
That copied block visually compresses and reboxes the rail footer, producing the “уродливые / огромные / кривые значки” style complaint risk even if button dimensions remain nominally 32×32.

### Regression interpretation
This is not a neutral adaptation. It directly departs from the owner reference and overrides a correct component-level implementation with a different, more decorative strip.

---

## Finding VR-03 — Gill context page is structurally divergent from Gill parts; user complaint about “другой блок серии / отдельные римские сверху” is source-true
Status: confirmed-current
Severity: high UX inconsistency
Evidence: SRC

### Current source split
`src/components/article-pilots/gill-context/GillContextPageChrome.astro`
- custom v16-like rail markup
- custom v16-like overlays
- custom part TOC block
- no shared `gbs2-rail` series shell used by parts 1/2/3/spravochnik

`src/components/article-pilots/gill-part1/GillPart1PageChrome.astro`
`src/components/article-pilots/gill-part2/GillPart2PageChrome.astro`
`src/components/article-pilots/gill-part3/GillPart3PageChrome.astro`
`src/components/article-pilots/gill-spravochnik/GillSpravochnikPageChrome.astro`
- all use the older `gbs2-rail` family shell
- include `gbs2-parts`, `gbs2-current`, `gbs2-sheet`, `gbs2-bbar`
- share one family visual grammar distinct from Gill context

### Why this matters
The Gill family is currently split into:
1. context page with one series-navigation architecture
2. parts/spravochnik with another architecture

That exactly matches the user’s complaint that historical Gill has a different block and the family is not visually unified.

---

## Finding VR-04 — White-circle complaint is not imaginary: current source still gives Play a visible hover/focus halo by design, while Save is intentionally halo-less; current merged surfaces likely make this feel like “white circles around play/save”
Status: partially confirmed-current / needs browser witness for exact visible rendering state
Severity: medium
Evidence: REF-HTML + SRC

### REF-HTML contract
- `.gb-icon::before` = halo ring
- `.gb-ember::before` = halo ring
- `.gb-save` intentionally has **no** `::before`
- save active state = gold fill + bounce, no halo

### SRC truth
Current source preserves this same split in:
- `SaveButton.astro`
- `PlayEmber.astro`
- `SingleArticleCluster.astro`
- `css/floating-cluster.css`

### Important nuance
So source does **not** show a simple bug where Save accidentally inherited the halo from `.gb-icon`.

However, current repo also has multiple duplicated CSS copies, Gill-specific overrides, and older route shells coexisting. The user’s “white circles around play and bookmark” complaint therefore likely comes from one of these runtime combinations:
- old shell background / border / rail box causing controls to read as white discs
- focus / active / backdrop styling from surrounding shell
- duplicate control instances with different visible surface

### Verifier position
The broad claim “save implementation lost its halo-less contract in source” is **not supported** by current source. The stricter truthful claim is:
- save source contract is still halo-less,
- but current composed route surfaces are visually inconsistent enough that the user’s perceived white-circle complaint remains credible and needs browser-level screenshot witness for the exact manifestation.

---

## Finding VR-05 — Reference-order footer control contract exists in component source, but current Gill family mixes two systems, increasing risk of visible inconsistency
Status: confirmed-current architectural concern
Severity: medium
Evidence: REF-HTML + SRC

Reference order:
- Theme | Search | A− | A+ | Play | Save

Current truth:
- `GillRailControls.astro` follows this order correctly
- Gill context hardcodes a v16-like footer in-page
- Gill part pages use older `gbs2-*` family shells and append `GillRailControls`
- mobile and desktop surfaces are duplicated across old/new systems

This increases the risk that the user is seeing mixed controls rather than a single owner-approved cluster family.

---

## Finding VR-06 — `css/floating-cluster.css` is carrying a large drifted copy of the reference instead of a minimal faithful extraction; this itself is a regression vector
Status: confirmed-current
Severity: medium-high
Evidence: SRC

The CSS file contains:
- base component styles
- a long `[data-gill-v16]` copy
- malformed / noisy copied fragments such as prefixed transition lines
- broad global rules like `[data-tip]::after { display:none !important; }`
- late standalone position overrides
- unrelated speed-expand code

This is not a tight canonical stylesheet. It is a drift-prone merged artifact where local component truth and legacy CSS copy can disagree.

That is a credible root-cause class for repeated visual regressions.

---

## Narrowed truth / anti-overstatement notes
1. I do **not** confirm from source alone that Save currently has the wrong filled-state logic. Source still matches the reference’s halo-less saved-bookmark concept.
2. I **do** confirm that Gill footer layout has diverged from reference in the global CSS copy.
3. I **do** confirm that Hermeneutics positioning is currently governed by conflicting rules, including a later heuristic override block.
4. I **do** confirm that Gill context is structurally inconsistent with the other Gill pages.

---

## Most likely source-level root causes
1. **Late global override drift** in `css/floating-cluster.css` for standalone floater positioning.
2. **Drifted copied Gill v16 block** in `css/floating-cluster.css` overriding the correct component-level `GillRailControls` contract.
3. **Family split** between custom Gill-context chrome and old `gbs2-*` parts chrome.
4. **Too many coexisting UI systems** (standalone cluster, Gill v16 copy, old gbs2 rail/sheet/bar, speed-expand experiments).

---

## Surgical fix direction implied by the evidence
Not implementing here; verifier recommendation only.

1. Remove / neutralize the late sibling-based `.gb-floater` top/right override block from `css/floating-cluster.css`, or strictly scope it away from hermeneutics.
2. Restore `[data-gill-v16] .gbs-rail-foot` in `css/floating-cluster.css` to the exact reference values already present in `GillRailControls.astro`.
3. Unify Gill context with the same family-level series block strategy used by the intended final Gill pages, instead of maintaining a separate architecture.
4. Re-run browser witness after each change, route by route:
   - hermeneutics single article
   - Gill context
   - Gill part 1
   - Gill part 2
   - Gill part 3
   - Gill spravochnik

---

## Bottom line
The visual complaint is not just subjective frustration. Current HEAD source contains real reference drift and competing layout systems. The strongest confirmed-current defects are:
- hermeneutics floater placement override drift,
- Gill footer layout regression in legacy CSS copy,
- Gill context family-shell inconsistency versus the other four Gill pages.
