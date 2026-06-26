# CURRENT HEAD RE-VERIFY — Mobile surgical-embed contract + Gill rail sizing typo regression
**Date:** 2026-06-27
**Verifier pass:** floating-cluster v16 — mobile contract + Gill rail "huge crooked icons" root cause
**Reference (owner-approved):** `uploads/gb-floating-cluster-probe-v16 (2).html`
**Plan doc (source-of-truth for this department):** `docs/refactor-2026/FLOATING_CLUSTER_V16_FULL_SITE_PLAN.md`
**Lane:** `docs/refactor-2026/lanes/system-floating-cluster-v16-pilot-gill-hermeneutics-2026-06-25.md`

Evidence labels used: **REF-HTML** (reference probe), **SRC** (current source), **BUILT** (current dist/static HTML in repo). Browser-witness still pending for some rendered measurements (flagged BROWSER-PENDING).

> Owner directive driving this pass:
> - Mobile must match reference **1-в-1** (icons-bottom bar, TOC, roman numerals, blocks) — **no self-tuning / "measure-and-approximate"**, surgical insertion only.
> - Keep the **shared rounded outline/frame** ("округлённый контур") where the controls sit, exactly as reference.
> - Ideal pair to perfect first: **Hermeneutics (single)** + **Gill Part 1 (series)**.
> - History note from owner: a Gill page **almost** had the desktop "5 icons at the bottom" footer done — "just needed to compress them a bit". This pass identifies that page and why it looks wrong.

---

## TL;DR (what is now proven)

1. **VR-07 (NEW, high, confirmed-current, SRC):** `GillRailControls.astro` contains a **dead-selector typo**: it scopes the footer ember/save sizing rules with `.gb-rail-foot` (no `s`) while the real container class is `.gbs-rail-foot` (with `s`). The 7 affected rules never match the DOM, so:
   - `gb-ember` stays at base **36px** instead of footer **32px**;
   - `gb-save` stays at base **40px** instead of footer **32px**;
   - → Save (and ember) visibly protrude from the 32px button row = the owner's **"огромные кривые значки в Гилле"**. This is reproducible from source alone.

2. **VR-08 (NEW, confirmed-current, BUILT):** Only `dzhon-gill-istoricheskiy-kontekst` ships the reference `gbs-rail-foot` 6-control footer; Parts 1/2/3/Spravochnik ship the **older `gbs2-rail` world**. The "almost-done desktop 5-icons page" the owner remembers **is the historical-context page** — and it is *also* the page the owner dislikes ("другой блок серии, отдельные римские сверху") because it diverges structurally from the other 4. So the same divergence is simultaneously the "best" footer and the "wrong" block.

3. **Mobile contract drift (confirmed-current, REF vs BUILT):** Reference mobile is a **single rounded bottom-bar** = `TOC | section | gold-line progress | % | [theme search play]` with **Save removed** (Save lives inside the Part-TOC sheet). Current Gill mobile ships the **old `gbs2-bbar` + `gbs2-sheet`** world (roman numeral + % + tabbed "Части серии / Оглавление части"). These are two different mobile systems coexisting.

---

## VR-07 — Gill rail footer sizing rules are dead due to `.gb-rail-foot` vs `.gbs-rail-foot` typo
**Status:** confirmed-current
**Severity:** HIGH (direct cause of "huge crooked icons" complaint)
**Evidence:** SRC + REF-HTML
**Fix risk:** LOW (one file, 7 lines, pure class rename)

### Reference contract (REF-HTML)
- `.gbs-rail-foot__btn { width:32px; height:32px; ... }`
- `.gb-ember { --ember-size:36px }` (base) **but** `.gbs-rail-foot .gb-ember { --ember-size:32px }` shrinks it inside the rail.
- `.gb-save { width:40px; height:40px }` (base, standalone Hermeneutics) **but** in the rail the Save button carries **both** classes: `<button class="gbs-rail-foot__btn gb-save">`, so it inherits the 32px footer-button box.
- Net: in the reference footer, every control optically sits in a **32px row** → tidy single-line `space-between` strip.

### Source truth (SRC) — `src/components/ui/floating-cluster/GillRailControls.astro`
- Footer container is `.gbs-rail-foot` (correct).
- Buttons correctly carry `gbs-rail-foot__btn`.
- Save is rendered via `<SaveButton class="gbs-rail-foot__btn" />`, producing `class="gb-save ... gbs-rail-foot__btn"` (good — same dual-class intent as reference).
- **BUT** the scoped shrink rules are written against the wrong selector:

```css
/* GillRailControls.astro — lines ~197-221, ALL using .gb-rail-foot (NO s) */
.gb-rail-foot .gb-ember,
.gb-rail-foot .gbs-rail-ember { --ember-size: 32px; ... }
.gb-rail-foot .gb-ember__ring-track { ... }
.gb-rail-foot .gb-ember__ring-progress { ... }
.gb-rail-foot .gb-save { width: 32px; height: 32px; }
.gb-rail-foot .gb-save svg { width: 17px; ... }
.gb-rail-foot .gb-ember[data-tip]::after { ... }
```

- The DOM never contains `gb-rail-foot`; it contains `gbs-rail-foot`. `grep -rn "gb-rail-foot" css/ js/ src/ | grep -v gbs-rail-foot` returns **7 hits, all in this one file**.

### Consequence
- `gb-ember` renders at base 36px; `gb-save` renders at base 40px.
- In a `space-between` row of 32px buttons, the 36px ember and 40px save **break the baseline grid** and look oversized / misaligned = "огромные кривые значки".
- Tooltip-positioning rule for the ember is also dead (cosmetic, secondary).

### Fix (surgical, deferred to implementation pass per owner "plan-push" choice)
- Rename `.gb-rail-foot` → `.gbs-rail-foot` on all 7 lines in `GillRailControls.astro`.
- Verify no other stylesheet *intentionally* relies on `gb-rail-foot` (grep already shows none).
- Re-run owner:ui-guard / css:layer:validate after the rename.
- **BROWSER-PENDING:** confirm rendered footer is a clean 32px single row in built Gill page after rename.

---

## VR-08 — Gill historical-context is the only page on the v16 `gbs-rail-foot` footer; Parts 1/2/3/spravochnik still ship the legacy `gbs2-rail` world
**Status:** confirmed-current
**Severity:** HIGH (UX inconsistency + owner's "другой блок серии")
**Evidence:** BUILT

### Built-HTML census (`grep -o` per page)
| Built page | footer markers found |
|---|---|
| `dzhon-gill-istoricheskiy-kontekst/index.html` | `gbs-rail-foot` ×8 (reference v16 footer) |
| `dzhon-gill-chast-1-chelovek/index.html` | `gbs2-rail` (legacy world) |
| `dzhon-gill-chast-2-uchenyi/index.html` | `gbs2-rail` |
| `dzhon-gill-chast-3-nasledie/index.html` | `gbs2-rail` |
| `dzhon-gill-spravochnik/index.html` | `gbs2-rail` |

- The historical-context page's built footer is the exact reference 6-control row:
  `Theme | Search | A− | A+ | PlayEmber(32px) | Save` (verified in built HTML).
- This is the "almost-done desktop 5-icons" page the owner remembers. It is closest to reference **but** because only it is migrated, it reads as a *different block* next to the 4 legacy-world parts → exactly the owner's complaint "отдельные римские сверху, другой блок серии".

### Interpretation
- The historical-context divergence is **not the bug to delete** — it is the **target architecture** that the other 4 parts must converge onto (owner: "Блоки во всех 5 частей должны быть одинаковые, топовые, с заголовками, как в Часть 1 / Часть 2").
- Resolution direction: unify all 5 Gill pages on the **historical-context v16 series block + `gbs-rail-foot` footer**, not the reverse.

---

## MOBILE CONTRACT — exact reference spec to surgically reproduce (REF-HTML)

This is the precise mobile contract the owner wants **1-в-1**, captured from the reference probe so the implementation pass does **not** improvise.

### 1. Bottom bar — the "rounded outline frame" the owner wants kept
`.mobile-bottom-bar` (REF-HTML):
```css
.mobile-bottom-bar{
  position:absolute;left:6px;right:6px;bottom:6px;
  display:flex;align-items:center;justify-content:space-between;gap:4px;
  padding:6px 8px;border-radius:20px;                 /* ← the rounded contour to KEEP */
  background:rgba(253,252,249,.96);
  border:1px solid var(--gb-border);
  backdrop-filter:blur(14px) saturate(160%);
  box-shadow:0 8px 24px rgba(0,0,0,.10);
  font-size:11.5px; box-sizing:border-box;
}
html.dark .mobile-bottom-bar{background:rgba(22,26,33,.96);border-color:rgba(255,255,255,.08)}
```
Contents order (REF-HTML, v16): **TOC button | section label | gold-line progress | % | icon-row(theme? search? play)** — and crucially **Save is NOT in the bottom bar** (v15/v16 comment: "Save REMOVED from bottom-bar — now in TOC popup").

### 2. Progress is a gold LINE, not dots (v16 change)
```css
.mobile-btoc-progress-track{ flex:1 1 auto;max-width:80px;height:2.5px;border-radius:99px;
  background:color-mix(in srgb,var(--gb-accent-gold) 22%,transparent);overflow:hidden;margin:0 4px; }
.mobile-btoc-progress-fill{ height:100%;
  background:linear-gradient(90deg,var(--gb-accent-gold-bright),var(--gb-accent-gold));
  border-radius:99px;box-shadow:0 0 6px rgba(216,170,109,.55); }
```

### 3. Mobile icon sizes (compressed for narrow screens)
```css
.mobile-icon-row{display:flex;align-items:center;gap:3px;margin-left:auto;flex-shrink:0}
.mobile-icon-row .gb-ember{--ember-size:34px}
.mobile-icon-row .gb-icon{--icon-size:30px;--icon-radius:50%}
.mobile-icon-row .gb-icon svg{width:15px;height:15px}
```

### 4. TOC sheet popup — where Save lives on mobile + roman numerals
- `.toc-overlay` / `.toc-sheet` bottom sheet (rounded `22px 22px 14px 14px`, handle, scroll bar).
- `.toc-item` (series list) uses big italic serif numerals `.toc-item__num{font-size:24px;font-style:italic;color:gold}` — **these are the roman numerals the owner wants preserved**.
- `.toc-part-item` (part list) is the compact variant with `.toc-part-item__num` (14px italic).
- Part-TOC contains the Save action (`.toc-action-btn` family) — this is the v16 home for Save on mobile.

### 5. Current Gill mobile (BUILT) — what's actually shipped
- `gbs2-mobile-head` (cover + title + `GillRailControls context="mobile"`).
- `gbs2-bbar` button: `RomanNumeral II` + `%` + section → opens `gbs2-sheet`.
- `gbs2-sheet`: tabbed dialog "Части серии / Оглавление части" with `gbs2-sheet-part` list.
- = **legacy mobile world**, NOT the reference `mobile-bottom-bar` + `toc-sheet`.

### Surgical-embed principle (per plan doc §"Не сносить уникальность" + ЗАДАЧА 4)
- The plan doc explicitly mandates **surgical addition, not wholesale replacement** for unique surfaces (Nagornaya keeps its sidebar/Tailwind/SVG; only Play+Save are inserted).
- For Gill mobile the owner wants the **reference look 1-в-1** AND the rounded frame kept — so the implementation pass must port the reference `mobile-bottom-bar` + `toc-sheet` markup/CSS while preserving `gbs2-*` markers that `owner:ui-guard` checks (plan §4: "gbs2-* маркеры Гилла не трогать"). This is the tension the next pass must resolve carefully, NOT by self-tuning sizes.

---

## Ordered, risk-ranked repair plan (for the implementation pass)

**Pilot pair to perfect first (owner choice):** Hermeneutics (single) + Gill Part 1 (series).

### Phase 0 — trivial, isolated, do first
- **VR-07 fix:** rename `.gb-rail-foot` → `.gbs-rail-foot` (7 lines) in `GillRailControls.astro`.
  - Risk: LOW. Single file, pure selector correction, restores reference 32px footer row.

### Phase 1 — Hermeneutics standalone position rollback (no approximation)
- Remove / hard-scope the late global override in `css/floating-cluster.css`:
  `.page-wrap ~ .gb-floater, .page-wrap + .gb-floater, #content ~ .gb-floater { right:...; top:clamp(48px,7vw,100px); }`
  so the component-local `.gb-floater--hermeneutics` breadcrumb-level anchor wins.
  - Risk: MEDIUM (selector is global; must confirm it doesn't anchor other routes). BROWSER-PENDING witness required.

### Phase 2 — Gill desktop footer fidelity
- After VR-07, verify `gbs-rail-foot` row matches reference exactly.
- Remove the drifted `[data-gill-v16] .gbs-rail-foot` boxed/centered copy in global `css/floating-cluster.css` (justify-content:center; rounded box bg) that fights the component-level `space-between`.
  - Risk: MEDIUM.

### Phase 3 — Gill mobile reference port (surgical)
- Port reference `mobile-bottom-bar` (rounded contour) + gold-line progress + `toc-sheet` (with roman numerals + Save-in-Part-TOC) onto Part 1 first.
- Keep `gbs2-*` markers required by `owner:ui-guard`.
- NO size self-tuning — copy reference values verbatim.
  - Risk: HIGH (largest surface). Do on pilot Part 1 only, witness, then propagate.

### Phase 4 — Gill family unification
- Migrate Parts 1/2/3/Spravochnik onto the historical-context v16 series block + footer so all 5 share one block with headings.
  - Risk: HIGH. Only after pilot pair is owner-approved.

### Explicitly DEFERRED
- Play-expand ("раздвижение") — owner: "пока этим не занимайся, пока не вернём всё остальное". `initPlayExpand()` + speed CSS remain live but untouched.

---

## Claims narrowed / honesty notes
- The "huge crooked icons" complaint is now **upgraded from medium/speculative to a confirmed-current HIGH source bug (VR-07)** with an exact mechanism — not approximate.
- The "different series block / roman numerals" complaint is **source/built-true (VR-08)**, but the historical-context block is the **target**, not the defect — wording must not imply deleting it.
- Save's halo-less contract remains intact in source; white-circle complaint is still attributed to composed/legacy surfaces, NOT to Save losing its design (unchanged from prior pass; BROWSER-PENDING for exact rendered halo state).
- Mobile findings are REF-vs-BUILT structural; exact rendered mobile measurements remain BROWSER-PENDING.
