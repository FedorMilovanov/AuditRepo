# CURRENT HEAD RE-VERIFY — Hermeneutics position TRUTH (historical .theme-toggle report) + Gill TOC must drop images
**Date:** 2026-06-27
**Remote source HEAD verified:** `262d073` (fresh clone)
**Reference:** `uploads/gb-floating-cluster-probe-v16 (2).html` + screenshot `uploads/image.png` (1.75× speed pill open, icons jammed against text)

Evidence: **SRC** (fresh remote source), **HIST** (historical geometry still in repo), **REF-HTML**, **OWNER** (explicit instruction).

> Owner complaints this pass:
> 1. After the latest agent run, Hermeneutics control cluster is **too close to the text (впритык)**. Earlier it sat at a **specific historical distance** at breadcrumb level. STOP the trial-and-error ("то близко то далеко, метод тыка"). Take the position **report** from the historical implementation that already existed.
> 2. Gill TOC/chapter lists must NOT have images (baptisty-style mini thumbnails). Only the reference roman numerals with all hover effects, tinted to the series color palette.

---

## FINDING POS-01 — The historical position report EXISTS in `css/site.css` as `.theme-toggle`; the agent ignored it and invented a `calc()` that lands too close to text
**Status:** confirmed-current
**Severity:** HIGH (owner-visible, repeated trial-and-error)
**Evidence:** HIST (css/site.css) + SRC (css/floating-cluster.css) + OWNER + screenshot

### The authoritative historical geometry (still present, HIST — css/site.css)
```css
.theme-toggle{
  position:absolute;                 /* absolute INSIDE article-main (width min(820px,92vw), centered, padding 24px) */
  z-index:var(--z-toast);
  width:44px;height:44px;
  background:0 0;border:none;padding:12px;
  display:flex;align-items:center;justify-content:center;
  top:calc(clamp(24px,3.5vw,44px) - 4px);
  right:max(8.5vw, env(safe-area-inset-right,0px));   /* ← HISTORICAL DISTANCE, desktop */
}
@media (max-width:899px){
  .theme-toggle{
    top:calc(clamp(24px,3.5vw,44px) - 4px);
    right:max(4.5vw, env(safe-area-inset-right,0px)); /* ← HISTORICAL DISTANCE, mobile */
  }
}
```
This is the "хорошее расстояние" the owner remembers: the day/night SVG sat at breadcrumb level (`top: clamp(24,3.5vw,44)-4`) and at `8.5vw` from the viewport edge (mobile `4.5vw`).

### What the agent shipped instead (SRC — css/floating-cluster.css ~line 39)
```css
.gb-floater--hermeneutics {
  top: calc(clamp(24px, 3.5vw, 44px) - 4px);                      /* top: CORRECT, matches history */
  right: max(calc((100vw - min(820px, 92vw)) / 2 - 28px), 16px);  /* SUPERSEDED / FORBIDDEN / WRONG / POS-01 / NEVER re-introduce: invented, lands ~28px off content edge = впритык */
}
```
- The `top` is faithful to history. Good.
- The `right` is a **fabricated `calc()`**: it places the floater ~28px outside the content column's right edge. On wide screens the content column is `820px` centered, so this puts the icons hugging the text block (exactly the screenshot). This is the "метод тыка" the owner is angry about.

### Why the invented formula and the historical one differ
- Historical `.theme-toggle` is `position:absolute` **inside** `article-main` (which is `width:min(820px,92vw); margin:0 auto`). `right:8.5vw` is measured from the article-main box edge → on a 1920px screen the box is ~820px wide and centered, but `8.5vw` (~163px) pushed the control well clear of the 24px text padding → comfortable gap.
- Current `.gb-floater` is `position:fixed` (viewport-relative, same as REF-HTML demo). The agent tried to reconstruct the column edge with a `calc()` and chose `-28px`, which is far too tight.

### CORRECT FIX (take the historical report verbatim — do NOT re-tune)
Replace the invented `right` with the historical distance. Two valid options, prefer Option A (minimal, exact history):

**Option A — reproduce historical viewport-relative distance (recommended):**
```css
.gb-floater--hermeneutics {
  top: calc(clamp(24px, 3.5vw, 44px) - 4px);
  right: max(8.5vw, env(safe-area-inset-right, 0px));
}
@media (max-width: 899px) {
  .gb-floater--hermeneutics {
    right: max(4.5vw, env(safe-area-inset-right, 0px));
  }
}
```
This is byte-for-byte the historical `.theme-toggle` right/top. It restores the exact remembered distance. (Note: the standalone mobile pill rule at css ~46 still overrides mobile to the bottom pill, which is correct and unaffected — this `@media` block only matters where the pill rule is not in force; keep both, the pill wins on the actual mobile floater.)

**Option B — if a content-column anchor is truly desired,** the offset must be tuned to match `8.5vw`-equivalent spacing, NOT `-28px`. Option A is safer and is what the owner asked for ("откати ровно туда, где было"). Use A.

### Verify
```bash
grep -n "gb-floater--hermeneutics" css/floating-cluster.css
# right must be: max(8.5vw, env(safe-area-inset-right,0px))  (desktop)
# NOT a calc((100vw - min(820px,92vw))/2 - ...) expression
```
BROWSER-PENDING: confirm icons sit at breadcrumb level with the historical comfortable gap, not hugging text.

---

## FINDING TOC-01 — Gill TOC images: the v16 template (gill-context) is ALREADY image-free; legacy parts still carry baptisty-style mini-thumbnails
**Status:** confirmed-current
**Severity:** MEDIUM (owner-visible quality)
**Evidence:** SRC + OWNER

- **gill-context (TEMPLATE, correct):** `toc-item` = `toc-item__num` (roman I–V) + `toc-item__info` (title + meta) + `toc-item__chevron`. **No `<img>`, no thumbnails.** Roman numerals styled with full hover effects, tinted to series accent (`css ~1072-1472`: `transform:scale(1.15)`, `color:var(--gb-accent-gold-bright)`).
- **gill-part1/2/3/spravochnik (LEGACY, wrong):** use `gbs2-thumb` `<img>` mini-thumbnails in the `gbs2-parts` list (baptisty-style). This is what the owner wants gone.

### Resolution
Migrating the parts onto the gill-context template (Playbook PART B3) **automatically removes the thumbnails**, because the template's series/part lists are image-free roman-numeral rows by design. No separate work needed — but it must be an explicit acceptance check:
```bash
# After migration, NO gill page may contain gbs2-thumb or <img> inside series/part TOC lists:
for p in dzhon-gill-istoricheskiy-kontekst dzhon-gill-chast-1-chelovek dzhon-gill-chast-2-uchenyi dzhon-gill-chast-3-nasledie dzhon-gill-spravochnik; do
  echo "$p: thumb=$(grep -c gbs2-thumb articles/$p/index.html)"   # expect 0 for all
done
```
**Owner rule to encode:** Gill series/part navigation = reference roman numerals only, tinted to the series palette, with hover effects. NO mini images (that pattern belongs to baptisty, not Gill).

---

## STATUS LEDGER UPDATE (vs prior passes)

| ID | Prior | Now @ 262d073 | Note |
|---|---|---|---|
| VR-01 (global override) | confirmed-current | **FIXED** | `#content ~ .gb-floater` block deleted (0 hits) — agent applied playbook A1 |
| VR-02 (Gill footer drift) | confirmed-current | **FIXED** | footer now reference-exact (commit d6a23ca) — RE-VERIFY values still hold |
| VR-07 (huge icons typo) | FIXED | **still FIXED** | 0 typo leftovers |
| VR-09 (source↔built desync) | confirmed-current | **FIXED** | built page now ships `gb-floater--hermeneutics` |
| **POS-01 (position too close / invented calc)** | n/a | **NEW, confirmed-current, HIGH** | agent invented `right:calc(... -28px)` instead of historical `right:max(8.5vw,...)` |
| **TOC-01 (Gill TOC images)** | n/a | **NEW, confirmed-current, MEDIUM** | parts carry baptisty-style `gbs2-thumb`; template is image-free |
| VR-08 (Gill family split) | confirmed-current | **still confirmed-current** | parts still legacy gbs2 world; migration pending |

---

## What the agent did WELL (honesty)
- Applied the playbook: deleted the global override (VR-01), fixed the Gill footer (VR-02), rebuilt so the Hermeneutics modifier ships (VR-09). Real, verifiable progress.
## What the agent did WRONG (the remaining anger)
- For Hermeneutics `right`, it kept inventing a `calc()` instead of copying the historical `.theme-toggle` distance that was sitting in `css/site.css` the whole time. This is the "метод тыка" to stop. POS-01 fix = paste the historical values.

## Anti-recurrence (to be encoded in source repo — see companion edit)
1. Hermeneutics standalone position = historical `.theme-toggle` geometry in `css/site.css`: `top:calc(clamp(24px,3.5vw,44px)-4px)`, desktop `right:max(8.5vw,env(...))`, mobile `right:max(4.5vw,env(...))`. NEVER invent a new `calc()`.
2. Gill series/part TOC = roman numerals only, series-tinted, hover effects. NO images.
3. The reference HTML probe is the ONLY visual source of truth; DALLE screenshots must never override it.
4. Source fix without a production-like rebuild is NOT done; the built article HTML must be regenerated and committed.
