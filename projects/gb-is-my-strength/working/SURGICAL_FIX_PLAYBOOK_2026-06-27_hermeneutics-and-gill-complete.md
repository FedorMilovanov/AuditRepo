# SURGICAL FIX PLAYBOOK — Close Hermeneutics + Gill completely (executable by a weak agent)
> **STALE / DO NOT USE AS CURRENT IMPLEMENTATION INSTRUCTION (2026-06-27 reconciliation):** any `calc(... - 28px)` Hermeneutics position shown below is **SUPERSEDED / FORBIDDEN / WRONG / POS-01 / NEVER re-introduce**. Current canonical Hermeneutics position is desktop `right: max(8.5vw, env(safe-area-inset-right, 0px))` and mobile `right: max(4.5vw, env(safe-area-inset-right, 0px))`. Gill v16 is the current base; do not restore legacy `gbs2` as target.

**Date:** 2026-06-27
**Target source HEAD verified against:** `6dc6477`
**Reference (single source of truth):** `uploads/gb-floating-cluster-probe-v16 (2).html`
**Rule:** Copy reference values verbatim. NO self-tuning, NO "measure-and-approximate", NO DALLE matching. The HTML probe wins every conflict.

> This document gives exact files, exact line anchors, exact old→new text, exact order, and exact verification commands. Each step is independently revertible. Do steps strictly in order. Do NOT touch play-expand (`initPlayExpand`, `.gb-ember-expand*`) — owner deferred it.

---

## 0. PRE-FLIGHT (mandatory, 2 min)

```bash
# Always work on the real remote HEAD, never a stale local snapshot.
cd /tmp && rm -rf gbwork
git clone --depth 30 https://$TOKEN@github.com/FedorMilovanov/gb-is-my-strength.git gbwork
cd gbwork && git rev-parse --short HEAD          # expect 6dc6477 or newer
git checkout -b lane/floating-cluster-finish-2026-06-27

# Confirm the three target facts still hold before editing:
grep -n "gb-floater--hermeneutics" css/floating-cluster.css            # ~line 39
grep -n "#content ~ .gb-floater" css/floating-cluster.css              # ~1674,1680,1692 (override to cut)
grep -n "\[data-gill-v16\] .gbs-rail-foot{" css/floating-cluster.css   # ~851 (drift box to fix)
grep -rn "gb-rail-foot" css/ js/ src/ | grep -v gbs-rail-foot          # expect 0 (VR-07 already fixed)
```
If any line number drifted, re-grep — use the grep result, not the number.

---

## PART A — HERMENEUTICS (standalone), desktop + mobile

### A1. Remove the late global override that hijacks standalone position (VR-01/VR-09)
**File:** `css/floating-cluster.css`
**Anchor:** the block starting at the comment `Standalone article floater — position matching legacy .theme-toggle` (around line 1667) through the end of the `top: clamp(48px, 7vw, 100px);` rule (around line 1694).

**DELETE this entire block verbatim:**
```css
/* =========================================================
   Standalone article floater — position matching legacy .theme-toggle
   Legacy: position:absolute, right:max(8.5vw, safe-area), top: near breadcrumb
   Override fixed viewport positioning for content-aligned placement.
   ========================================================= */
.page-wrap ~ .gb-floater,
.page-wrap + .gb-floater,
#content ~ .gb-floater {
  right: max(8.5vw, env(safe-area-inset-right, 0px));
}
@media (max-width: 899px) {
  .page-wrap ~ .gb-floater,
  .page-wrap + .gb-floater,
  #content ~ .gb-floater {
    right: max(4.5vw, env(safe-area-inset-right, 0px));
  }
}

/* =========================================================
   Standalone floater — top aligned with breadcrumb
   .page-wrap padding-top = clamp(48px, 7vw, 100px)
   Floater top matches that + small offset for optical center
   ========================================================= */
.page-wrap ~ .gb-floater,
.page-wrap + .gb-floater,
#content ~ .gb-floater {
  top: clamp(48px, 7vw, 100px);
}
```

**Why:** This block uses `#content ~ .gb-floater` (id+class specificity = 0,1,1,0) which BEATS `.gb-floater--hermeneutics` (0,0,1,0). As long as it exists, the correct content-column anchor at css line ~39-42 never applies. Deleting it lets the component-scoped anchor win.

**Do NOT** keep a "scoped" remnant. The component anchor already supplies both `top` and `right`:
```css
.gb-floater--hermeneutics {
  top: calc(clamp(24px, 3.5vw, 44px) - 4px);
  right: max(calc((100vw - min(820px, 92vw)) / 2 - 28px), 16px); /* SUPERSEDED / FORBIDDEN / WRONG / POS-01 / NEVER re-introduce */
}
```
This is correct and reference-faithful (breadcrumb-level, content-column edge). Leave it as-is.

**Mobile note:** the mobile pill rules at css ~46-70 (`@media (max-width:899px){ .gb-floater{ bottom:..., border-radius:24px, ...}}`) are CORRECT and reference-faithful (horizontal bottom pill, rounded contour). Do NOT touch them. Deleting the override's `@media` sub-rule above is safe because the standalone mobile pill is defined separately.

### A2. Rebuild so the built page emits the modifier class (VR-09 root)
The committed `articles/.../germenevtiki/index.html` currently ships `class="gb-floater"` (NO `--hermeneutics`) because it was never rebuilt after the component change. Source is already correct:
- `src/components/ui/floating-cluster/SingleArticleCluster.astro` line ~48: `class={`gb-floater gb-floater--${variant}`}`
- `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro`: `variant="hermeneutics"`

**Action:** run the production-like strangler build and COMMIT the regenerated dist/static HTML so the live page gets `gb-floater--hermeneutics`:
```bash
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run strangler:build:production-like
```
> SANDBOX WARNING: this build is OOM-killed in the Arena sandbox (astro check + full render exceed memory, exit 137). Run it in CI or a fuller environment. Verify after build:
```bash
grep -o 'gb-floater[a-z-]*' articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html | sort -u
# MUST now include: gb-floater  AND  gb-floater--hermeneutics
```
If the build cannot run, A1 alone still helps but the page will only be fully correct after a real rebuild. Both are required for "closed".

### A3. Verify Hermeneutics
```bash
# 1. override gone
grep -c "#content ~ .gb-floater" css/floating-cluster.css      # expect 0
# 2. anchor intact
grep -n "gb-floater--hermeneutics" css/floating-cluster.css    # expect the anchor block
# 3. built page has modifier (after A2 rebuild)
grep -o 'gb-floater--hermeneutics' articles/.../germenevtiki/index.html
```
BROWSER-PENDING: visually confirm icons sit at breadcrumb level, at the content-column right edge, day/night SVG where the old `#themeToggle` was. Mobile: horizontal rounded pill bottom-center.

---

## PART B — GILL: fix the drift box, then unify all 5 parts onto the v16 template

### B1. Fix Gill desktop footer drift box (VR-02)
**File:** `css/floating-cluster.css`, line ~851.
**REPLACE:**
```css
[data-gill-v16] .gbs-rail-foot{
  margin-top:auto;
  display:flex;flex-direction:row;align-items:center;
  justify-content:center;
  gap:4px;
  padding:10px 8px;
  border-top:1px solid rgba(255,255,255,.08);
  border-radius:12px;
  background:rgba(255,255,255,.03);
  width:100%;
}
```
**WITH (reference-exact values from probe `.gbs-rail-foot`):**
```css
[data-gill-v16] .gbs-rail-foot{
  margin-top:auto;
  display:flex;flex-direction:row;align-items:center;
  justify-content:space-between;
  gap:0;
  padding-top:12px;
  border-top:1px solid rgba(255,255,255,.08);
  width:100%;
}
```
**Why:** reference footer is a full-width `space-between` row with `gap:0` and no rounded box/background. The drift turned it into a centered pill box. This is the owner's "footer looks wrong" surface. Use reference values verbatim — do not invent spacing.

### B2. Confirm footer button sizing is reference-faithful (VR-07 regression-guard)
Already fixed at HEAD 6dc6477, but VERIFY it stays correct after B1:
```bash
grep -n "\[data-gill-v16\] .gbs-rail-foot .gb-ember{" css/floating-cluster.css   # --ember-size:32px
grep -n "\[data-gill-v16\] .gbs-rail-foot .gb-save{"  css/floating-cluster.css   # width:32px;height:32px
grep -rn "gb-rail-foot" css/ js/ src/ | grep -v gbs-rail-foot                    # MUST be 0
```
If any of these are missing/typo'd again → STOP, that is the "huge crooked icons" regression returning.

### B3. Unify Parts 1/2/3/Spravochnik onto the gill-context v16 template (VR-08)
**The template is already implemented and reference-correct in:**
`src/components/article-pilots/gill-context/GillContextPageChrome.astro`
It provides, in this exact structure:
1. `<div class="gbs2-world" data-gill-v16="context">` wrapper (the `data-gill-v16` attribute is what activates all the v16 CSS — parts currently LACK it).
2. Desktop `<aside class="gbs-rail">` with `gbs-rail-card` roman-numeral cards (I–V) + `gbs-rail-foot` 6-control footer.
3. Mobile `<div class="mobile-bottom-bar">`: `mobile-toc-btn | mobile-btoc-section | mobile-btoc-progress-track(gold line) | mobile-btoc-pct | mobile-icon-row(theme/search/play)` — **Save NOT here**.
4. `<div class="toc-overlay" id="seriesTocOverlay">` → `toc-sheet` with `toc-item` roman list (series nav).
5. `<div class="toc-overlay" id="partTocOverlay">` → `toc-sheet` with `toc-part-item` list + `toc-sheet__actions` containing `gb-save` (Save lives here on mobile) + share + print.

**Parts currently use the LEGACY world** (`GillPart1PageChrome.astro` etc.):
- `gbs2-mobile-head` + `gbs2-bbar` + `gbs2-sheet` (tabbed "Части/Оглавление") — this is the "другой блок, отдельные римские" the owner dislikes.

**Surgical migration recipe per part (do Part 1 first, get owner sign-off, THEN 2/3/spravochnik):**

For `src/components/article-pilots/gill-part1/GillPart1PageChrome.astro`:
1. Change wrapper to carry the v16 attribute and template structure: replace the legacy `gbs2-world`/`gbs2-rail` shell with the gill-context shell.
   - Use `data-gill-v16="part1"` (any non-empty value; CSS selector is attribute-presence `[data-gill-v16]`).
2. Copy the gill-context desktop `<aside class="gbs-rail">` block, then **substitute part-1 data**: mark `Часть I. Человек` card `is-current` + `aria-current="page"`, set the `gbs-rail-now` label to part 1, set rail-foot unchanged (it is series-global).
3. Copy the gill-context `mobile-bottom-bar` block verbatim (it is series-global except `mobile-btoc-section` text = current part short label).
4. Copy both `toc-overlay` popups. In `#seriesTocOverlay` mark Part I (`Часть I. Человек`) `is-current`. In `#partTocOverlay` REPLACE the part-TOC `toc-part-item` list with Part 1's actual chapter anchors (from the existing `gbs2-toc` list already in the legacy file — reuse those `href="#..."` + titles, re-rendered as `toc-part-item`).
5. DELETE the legacy `gbs2-mobile-head`, `gbs2-bbar`, `gbs2-sheet` markup from the part file.
6. Keep `GillRailControls` only as the source of the `gbs-rail-foot` controls if the context template references it; gill-context inlines the footer, so prefer inlining identically for parity.

**CRITICAL guard (plan doc §4):** `owner:ui-guard` checks for `gbs2-*` markers on Gill. Before deleting `gbs2-bbar`/`gbs2-sheet`, run `npm run owner:ui-guard` (or whatever the guard script is) and read what it actually requires. If it hard-requires `gbs2-*` ids, either (a) the guard is stale and must be updated in the same lane with justification, or (b) keep the ids as aliases. DO NOT silently delete guarded markers without resolving the guard. (gill-context already dropped them and presumably passes — confirm by diffing how context satisfies the guard.)

### B4. Verify Gill
```bash
# All 5 gill pages must carry data-gill-v16 in source:
for f in gill-context gill-part1 gill-part2 gill-part3 gill-spravochnik; do
  echo -n "$f: "; grep -c "data-gill-v16" src/components/article-pilots/$f/*PageChrome.astro
done
# After rebuild, all 5 BUILT pages must ship gbs-rail-foot and the v16 mobile world, none should ship gbs2-bbar:
for p in dzhon-gill-istoricheskiy-kontekst dzhon-gill-chast-1-chelovek dzhon-gill-chast-2-uchenyi dzhon-gill-chast-3-nasledie dzhon-gill-spravochnik; do
  echo "$p: foot=$(grep -c gbs-rail-foot articles/$p/index.html) mbar=$(grep -c mobile-bottom-bar articles/$p/index.html) legacy=$(grep -c gbs2-bbar articles/$p/index.html)"
done
# Expect: foot>=1, mbar>=1, legacy=0 for ALL five.
```

---

## PART C — FULL VERIFICATION GATE (before commit/merge/push)

```bash
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH
npm run guard:shared-files
npm run data:consistency
npm run gill:reading-time:audit
npm run astro:check               # may OOM in sandbox; run in CI
npm run validate:static-publication
node scripts/audit-pro.js
# owner ui-guard for gill markers:
npm run owner:ui-guard 2>/dev/null || echo "find the exact guard script name in package.json"
```
All must pass. Then update cache-bust (`scripts/cache-bust.js` runs in build) and commit with a lane report per `docs/refactor-2026/lanes/TEMPLATE.md`.

---

## ORDER OF EXECUTION (strict)
1. A1 — delete global override (low risk, immediate).
2. B1 — fix Gill footer drift box (low risk).
3. B2 — verify footer sizing still correct (no-op if clean).
4. A2 — production rebuild + commit dist (so Hermeneutics modifier ships).
5. B3 — migrate Part 1 only → owner review → then Parts 2/3/spravochnik.
6. C — full gate, cache-bust, lane report, push.

## DO-NOT-TOUCH list (owner-deferred / guarded)
- Play-expand: `initPlayExpand()` in `js/floating-cluster-controller.js`, `.gb-ember-expand*` + speed CSS. Leave entirely.
- `gb-save` halo contract: it is intentionally halo-less (no `::before`). Do NOT add a halo or circle. White circles were an R9/DALLE deviation already reverted in `08432bf`.
- Nagornaya: surgical Play+Save only, keep Tailwind sidebar / SVG / `nagornaya-mobile-toc.js` (plan doc §F / ЗАДАЧА 4).
- baptisty-rossii: placeholder/raw family; do not treat as finished premium target.

## EVIDENCE BASIS
- Reference contract: `uploads/gb-floating-cluster-probe-v16 (2).html` (mobile-bottom-bar, toc-sheet, gbs-rail-foot, gb-save dual-class).
- Source truth @ 6dc6477: gill-context already implements the v16 desktop+mobile template correctly; parts 1/2/3/spravochnik still on legacy gbs2-* world; standalone override block still present at css ~1667-1694; gill footer drift box at css ~851; VR-07 typo already fixed (0 leftovers).
- Build-trap: production artifact is the strangler build; committed article HTML is stale relative to source (Hermeneutics modifier class missing in built page).
