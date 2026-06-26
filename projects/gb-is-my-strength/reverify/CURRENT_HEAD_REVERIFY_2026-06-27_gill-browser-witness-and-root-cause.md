# CURRENT HEAD RE-VERIFY — Gill browser-witness bugs + DOUBLE root cause (data-gill-v16 build desync + parts not migrated)
**Date:** 2026-06-27
**Remote source HEAD verified:** `1a288da` (fresh clone)
**Evidence:** **OWNER-SHOT** (8 screenshots 2026-06-27), **SRC** (fresh source), **BUILT** (committed article HTML), **CSS**.

> Owner this pass (browser-witness on screenshots):
> - Hermeneutics: position STILL too close (older near distance). [Re-check below — actually FIXED in source now.]
> - Gill: "жуткие баги много где".
> - Historical-context: "забагованная, с непонятным блоком сверху".
> - Mobile TOC roman numerals: "не референс, самодел колхоз".
> - Mini-images still present in TOC.

---

## GOOD NEWS FIRST — agent applied POS-01 correctly (HONEST credit)
Commit `f372505` "fix(POS-01): restore EXACT historical .theme-toggle position". Source now:
```css
.gb-floater--hermeneutics {
  top: calc(clamp(24px, 3.5vw, 44px) - 4px);
  right: max(8.5vw, env(safe-area-inset-right, 0px));      /* desktop — historical */
}
@media (max-width: 899px){
  .gb-floater--hermeneutics { right: max(4.5vw, env(safe-area-inset-right, 0px)); }  /* mobile — historical */
}
```
This is byte-exact to the legacy `.theme-toggle` in `css/site.css`. Built page carries `gb-floater--hermeneutics`. **POS-01 = FIXED at source + build.** If the owner still sees "close" it is either (a) browser/CDN cache of old CSS, or (b) looking at a not-yet-redeployed production. BROWSER-PENDING after cache-bust + deploy. NO further position change needed — DO NOT re-tune.

---

## THE DOUBLE ROOT CAUSE OF ALL REMAINING GILL BUGS

### ROOT-1 — `data-gill-v16` attribute MISSING in BUILT HTML → every v16 CSS rule is dead
- SRC: `GillContextPageChrome.astro` line 22 = `<div class="gbs2-world" data-gill-v16="context">`. Correct.
- BUILT: `articles/dzhon-gill-istoricheskiy-kontekst/index.html` ships `<div class="gbs2-world">` — **NO `data-gill-v16`**. Census: `v16=0` on ALL 5 gill built pages.
- ALL roman-numeral styling is scoped under `[data-gill-v16]`:
  - `[data-gill-v16] .gbs-rail-card__num { color: var(--gb-accent-gold) }` (css 807)
  - `[data-gill-v16] .toc-item__num { ... }` (css 1090, 1474)
  - There is **NO unscoped fallback** for these numerals.
- **Therefore:** in the built page the numerals fall back to inheriting the parent `<a>` color = `--color-link #1f4ea3` = **BLUE**. This is exactly the "синие римские, самодел" in screenshots `011026`.
- Same desync explains the "непонятный блок сверху": built context has raw scaffolding like `<div style="margin-top:50px">` and `gbs-rail-back` without the v16 layout rules applying → unstyled/odd top block.

**FIX-1:** rebuild + commit production-like dist so `data-gill-v16` reaches the built HTML. (Sandbox cannot run full build — OOM exit 137. Must run in CI.) Verify:
```bash
for p in dzhon-gill-istoricheskiy-kontekst ...; do grep -c data-gill-v16 articles/$p/index.html; done   # expect >=1
```

### ROOT-2 — Parts 1/2/3/spravochnik NOT migrated; still legacy gbs2 world + mini-images
BUILT census @ `1a288da`:
| page | data-gill-v16 | gbs2-thumb (mini-img) | gbs2-bbar (legacy mobile) | mobile-bottom-bar (v16) | toc-overlay (v16) |
|---|---|---|---|---|---|
| istoricheskiy-kontekst | 0* | 0 | 0 | 1 | 2 |
| chast-1-chelovek | 0 | **1** | **1** | 0 | 0 |
| chast-2-uchenyi | 0 | **1** | **1** | 0 | 0 |
| chast-3-nasledie | 0 | **1** | **1** | 0 | 0 |
| spravochnik | 0 | **1** | **1** | 0 | 0 |
(*context built is stale, see ROOT-1)

- Parts still use `gbs2-rail` + `gbs2-bbar` + `gbs2-sheet` (18 refs in part1 source) + `gbs2-thumb` mini-thumbnails (5 in part1). This is the "другой блок / колхоз / мини-картинки на месте".
- The v16 template (`GillContextPageChrome.astro`) is image-free roman-numeral rows + `mobile-bottom-bar` + `toc-overlay` with reference `toc-item__num`/`toc-part-item__num`.

**FIX-2:** migrate parts 1/2/3/spravochnik onto the gill-context template (Playbook PART B3). This single migration removes mini-images, the legacy bbar/sheet, AND gives reference roman numerals — all at once.

---

## AGENT MISFIRE — GILL-A was patched as a SYMPTOM, not cured
Commit `3e47723` "fix(GILL-A): prevent vertical text" added:
```css
.gbs2-mobile-title { overflow: hidden; }
.gbs2-mobile-title b, .gbs2-mobile-title span { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; }
```
- This stops the vertical letter-stacking (good as a stopgap) BUT it does it **on the legacy `gbs2-mobile-head`** — i.e. it preserves the very legacy structure that must be replaced. It treats the symptom while keeping the disease.
- Correct cure = ROOT-2 migration (the v16 template has no `gbs2-mobile-head`; it uses `mobile-bottom-bar`, which cannot collapse the title vertically because there is no title-squeeze layout).
- KEEP the ellipsis patch only as defensive CSS; it is harmless, but it is NOT the fix.

---

## BUG LEDGER (browser-witness, this pass)
| ID | Bug (screenshot) | Status | Root |
|---|---|---|---|
| GILL-A | Rail title "ДЖОН ГИЛЛ…" stacks vertically per letter (011145/011112) | symptom-patched (3e47723); true cure = ROOT-2 | legacy gbs2-mobile-head title squeezed to 0 width |
| GILL-B | Footer controls stretched full-width with huge gaps | OPEN | legacy rail container width broken; cured by ROOT-1+ROOT-2 |
| GILL-C | Roman numerals BLUE not series-gold (011026) | OPEN | ROOT-1: `[data-gill-v16]` missing in built → numerals inherit link color |
| GILL-D | Mobile TOC = legacy tabbed gbs2-sheet, not v16 toc-overlay roman (011150/011153) | OPEN | ROOT-2: parts not migrated |
| GILL-E | Mini-images (gbs2-thumb) in TOC lists | OPEN | ROOT-2: parts not migrated |
| GILL-F | Context "strange block on top" (`margin-top:50px` scaffold) (011026) | OPEN | ROOT-1 (dead v16 layout) + raw context scaffolding |
| POS-01 | Hermeneutics position | FIXED (f372505) | historical 8.5vw/4.5vw restored |

---

## EXACT NEXT STEPS (ordered)
1. **FIX-1 (rebuild):** run `strangler:build:production-like`, COMMIT regenerated `articles/dzhon-gill-*/index.html` so `data-gill-v16` ships. This alone fixes GILL-C and most of GILL-F on the already-migrated context page. (CI only — sandbox OOM.)
2. **FIX-2 (migrate parts):** port Parts 1/2/3/spravochnik onto `GillContextPageChrome.astro` structure (image-free roman rows, `mobile-bottom-bar`, two `toc-overlay`, `toc-sheet__actions` with Save). Removes GILL-A/B/D/E in one move.
3. **Context scaffolding cleanup:** remove the `<div style="margin-top:50px">` hack and any raw back-button placement in `GillContextPageChrome.astro`; rely on v16 layout CSS.
4. Rebuild, cache-bust, `owner:ui-guard`, `validate:static-publication`, push.

## ANTI-RECURRENCE (encode in source repo)
- v16 Gill styling is scoped under `[data-gill-v16]`; ANY built page missing this attribute renders unstyled (blue numerals). A guard must assert every gill built page contains `data-gill-v16`.
- Source fix without production-like rebuild is NOT done (build-trap).
- Do not patch symptoms on the legacy `gbs2-*` world for Gill parts; migrate to the gill-context v16 template instead.
- Gill TOC = roman numerals only, series-gold, hover effects. No mini-images (that's a baptisty pattern).
