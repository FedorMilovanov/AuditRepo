# Current HEAD Reverify — 2026-06-25 — SHA d19baf0

## Meta
- Project: gb-is-my-strength
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Current HEAD SHA: **`d19baf0`** ("Merge: CSS + old controls removed from Astro source") — fresh clone
- Previous audited SHA: `fb8e4922`
- Date: 2026-06-25
- Verifier: `arena-agent-verifier-2`
- Method: fresh clone + source grep + **jsdom execution** of shipped controller (DOMContentLoaded fired) + Python date/anchor checks

> Unique value of this doc: prior docs (`working/PS-01-FIX-VALIDATED`, `working/NEW3-NEW5-FIX-DIRECTIONS`) proposed/validated patches against an EARLIER SHA. This is the first **SHA-aware confirmation of what is actually merged and live at the current source HEAD `d19baf0`** — which fixes landed and which bugs are still open.

## Compared against
- `verified/UNIFIED_BUG_LEDGER_2026-06-25.md` (+ Amendments V2-1..V2-4)
- `verification/CONFLICT_REGISTRY_2026-06-25.md` (C-01..C-10)
- fix proposals: `working/PS-01-FIX-VALIDATED`, `working/NEW3-NEW5-FIX-DIRECTIONS`, `incoming/arena-agent-toc/.../fixes-applied`

---

## Status changes at SHA d19baf0

| Bug ID | Previous | Current @ d19baf0 | Evidence (2 witnesses) |
|---|---|---|---|
| **PS-01** (`qs is not defined`) | confirmed P0 (23 routes) | ✅ **FIXED** | (src) `})();` now at line **567** EOF; `initTocPopups/initActionHandlers/initPlayExpand` inside IIFE. (jsdom) DOMContentLoaded fired → no error, `themeWorks:true`, `__gbCluster`=object |
| **PS-02 / PS-03 / P0-1** (dead theme/save) | symptoms of PS-01 | ✅ **FIXED** via PS-01 | jsdom: theme toggle binds & toggles `html.dark` |
| **PS-07** (dup `gbsTheme`/`gbsSearch`) | confirmed P1 | ✅ **FIXED** | `grep -rn gbsTheme\|gbsSearch src/`=0; generated gill-part1 has 0 `id="gbsTheme"` |
| **PS-10** (controller cache-bust drift) | confirmed S0 | ✅ **FIXED** | real md5=`efd81d3a`; src + generated HTML both `?v=efd81d3a` |
| **V2-1** (Gill TOC anchors) | confirmed P1 | ❌ **STILL OPEN** | generated HTML: part1 `#sec-early-years`,`#sec-gill-spirituality`; part3 5 broken (`#sec-legacy-main`,`#sec-rome-proverbs`,`#sec-wesley`,`#sec-coffee-house-polity`,`#sec-evaluations-map`) |
| **V2-2 / NEW-3** (Nagornaya font A−/A+) | confirmed P1 | ❌ **STILL OPEN** | markup `#nagFontDec`/`.nag-fontsize-btn`; JS listens `[data-fontsize]`/`.nag-fontsize-down/up` (0 matches). Fix DOCUMENTED, NOT APPLIED |
| **V2-3 / NEW-4** (Avraam skip-link) | confirmed P1 a11y | ❌ **STILL OPEN** | `karty/avraam/index.html`: `href="#svg-map"` + `class="avraam-skip"`; no `id="svg-map"` |
| **V2-4 / NEW-5** (feed weekdays) | confirmed P2 | ❌ **STILL OPEN** | 9 wrong: `Sat,31 May`→Sun ×3, `Thu,01 May`→Fri ×6. Fix DOCUMENTED, NOT APPLIED |
| **PS-06** (Hermeneutics readTime 35 vs 50) | confirmed P1 | ❌ **STILL OPEN** | generated hermenevtika: `data-pagefind-meta="readTime" hidden="">35`; visible 50 |
| **R-06 / NEW-2** (ember CSS on 15 pages) | confirmed | ❌ **STILL OPEN** | nagornaya/chast-1 + baptisty/dva-sezda: 4 ember sub-SVGs, `floating-cluster.css` NOT linked, `site.css` doesn't hide sub-SVGs, no `data-fc-root` |
| **P0-2** (`floating-cluster.css` empty) | false positive | ✅ stays **FALSE POSITIVE** | still 1869 lines / 68KB |

---

## Summary
- **fixed-current @ d19baf0:** PS-01 (+PS-02/PS-03/P0-1), PS-07, PS-10.
- **still-open @ d19baf0:** V2-1, V2-2/NEW-3, V2-3/NEW-4, V2-4/NEW-5, PS-06, R-06/NEW-2.
- **⚠ key finding:** NEW-3 and NEW-5 had "fix-validated"/"fix-directions" docs, but the fixes are **not applied** to source HEAD. Implementation lane must actually apply them.
- **regression:** none.

## Recommended next actions
1. Retire PS-01 / PS-07 / PS-10 → `archive/fixed/` with tag `fixed-current @ d19baf0` (per BUG_RETIREMENT_PROTOCOL; do not delete from verified).
2. Implementation lane: APPLY V2-2/NEW-3 (font selector) and V2-4/NEW-5 (feed weekdays) — still live.
3. Content lane: V2-1 (TOC anchors), PS-06 (readTime), V2-3 (skip-link).
4. R-06: link `floating-cluster.css` + `data-fc-root` on nagornaya/baptisty, OR strip premium ember until migrated.
