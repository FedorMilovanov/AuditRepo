# Current HEAD Reverify — 2026-06-25 — SHA 03e01a0

**Verifier:** arena-agent-2
**Source repo:** `FedorMilovanov/gb-is-my-strength`
**Current HEAD SHA:** `03e01a0` (chore: auto-update meta, cache-bust [skip ci]) — fresh clone
**Previous reverify:** `d19baf0` (the existing `CURRENT_HEAD_REVERIFY_2026-06-25_d19baf0.md`)
**Date:** 2026-06-25
**Method:** fresh source clone + deterministic checks (node repro, grep, file-hash compare).
Captures fix commits `c1bd605` (PS-01+P0-10+PS-06+PS-07+P0-7+P0-8) and `8f2b29e`
(V2-1..V2-4 + sw.js path-quoting) that landed AFTER the previous reverify.

---

## Executive summary

**9 of the tracked P0/P1 bugs are now FIXED-CURRENT on this HEAD.** One critical
implementation-vs-ledger discrepancy found: **V2-2/NEW-3 (nagornaya font) is marked
FIXED in the ledger but is NOT fixed in source.** P0-10 (hash bomb) is 90% resolved
and downgrades to a narrow residual.

---

## FIXED-CURRENT (proven on 03e01a0)

| Bug | Check | Result |
|---|---|---|
| **PS-01** `qs is not defined` | `})();` now at line 594 (end), `initTocPopups` at 420 (inside IIFE); node repro: no crash, `__gbCluster` created, click delegation bound | ✅ FIXED |
| **P0-7 / P0-8** cache-bust site-layered/site-modules | `grep` cache-bust.js ASSETS: both now present (1 each) | ✅ FIXED |
| **PS-07** duplicate `gbsTheme`/`gbsSearch` IDs | `GillRailControls.astro`: 0 hits | ✅ FIXED |
| **V2-1** Gill TOC↔body anchors | rendered HTML part1 & part3: **0 broken** (was 2 + 5) | ✅ FIXED |
| **V2-3** Avraam skip-link | skip-link `href="#stage"`; `id="stage"` exists | ✅ FIXED |
| **V2-4** feed.xml weekdays | 0 occurrences of `Sat, 31 May` / `Thu, 01 May` | ✅ FIXED |
| **NEW-2** sw-register toast logic | `r()` now `(!e\|\|e!==a)&&document.body.appendChild(a)` (correct form) | ✅ FIXED |
| **PS-04** krajne/rimlyanam ownership | both now load `floating-cluster-controller.js` + have `.gb-ember`/`.gb-save` | ✅ FIXED |
| **arena-agent-6 P0** sw.js syntax error | `node --check` PASSES; quote correct; PRECACHE parses (29 assets); fix = commit `8f2b29e` path-quoting | ✅ FIXED |
| **PS-06** Hermeneutics readTime 35 vs 50 | fixed in Astro source (`HermenevtikaBody.astro:44` → `50`); root legacy HTML still `35` | ✅ FIXED for production dist (root legacy stale) |

---

## 🚨 STILL OPEN — implementation discrepancy

### V2-2 / NEW-3 — Nagornaya font buttons STILL DEAD (ledger wrongly says FIXED)

**Ledger claim (`UNIFIED_BUG_LEDGER`):**
> ✅ FIXED — data-fontsize="down/up" added to all 6 Nagornaya pages (chast-1..5 + index). JS selector now matches.

**Actual state on HEAD `03e01a0` (deterministic):**

```
nagornaya/chast-1: data-fontsize=0 | nagFontDec/Inc=2
nagornaya/chast-2: data-fontsize=0 | nagFontDec/Inc=2
nagornaya/chast-3: data-fontsize=0 | nagFontDec/Inc=2
nagornaya/chast-4: data-fontsize=0 | nagFontDec/Inc=2
nagornaya/chast-5: data-fontsize=0 | nagFontDec/Inc=2
nagornaya/index:   data-fontsize=0 | nagFontDec/Inc=0
```

**ALL 5 nagornaya articles still use the OLD markup** (`id="nagFontDec"`/`id="nagFontInc"`,
`.nag-fontsize-btn`) and have **zero** `data-fontsize` attributes. The JS
(`nagornaya-mobile-toc.js`) still listens for `[data-fontsize="down/up"], .nag-fontsize-down/up`.
→ selector mismatch persists → **A−/A+ buttons remain dead on all 5 pages.**

The fix described in the ledger was either never applied, applied to an unmerged branch,
or reverted by the subsequent rebase (`30b2031 [rebase] fix: P1-13 gbs2-theme + V2-1 TOC +
V2-4 feed [conflict resolved]` — note V2-2 is conspicuously absent from that rebase list).

**Recommended action:** reopen V2-2/NEW-3 to `confirmed-current` (P1). The original
2-line JS-side fix (add `#nagFontDec`/`#nagFontInc` to the selector) is documented in
`working/NEW3-NEW5-FIX-DIRECTIONS-2026-06-25.md` and is still valid.

---

## 📉 DOWNGRADE — P0-10 hash bomb → narrow residual (P1)

**Original claim:** ALL 36+ Astro components have stale hardcoded `?v=` hashes.

**Actual state on HEAD — file-hash comparison across all `src/**/*.astro`:**

```
css/site.css:                    real=b880b524 | stale=0  correct=36  ✅
css/command-palette.css:         real=afe33045 | stale=0  correct=35  ✅
js/site.js:                      real=133dfac1 | stale=0  correct=47  ✅
js/search.js:                    real=c9d65577 | stale=0  correct=37  ✅
js/floating-cluster-controller:  real=58c2ea90 | stale=14 correct=1   ❌ (efd81d3a)
```

The systemic cache-busting fix WORKED for 4 of 5 assets — site.css, command-palette.css,
site.js, search.js are all now correct in every Astro component.

**Only `floating-cluster-controller.js` remains stale in 14 components** (`efd81d3a`
vs real `58c2ea90`). Root cause: the file content changed when the **PS-01 fix** moved
`})();` (bumping the hash), but the Astro-component hash wasn't re-busted afterward.

**Recommended action:** downgrade P0-10 from "systemic, 36+ components, P0" to
**residual P1: 1 asset, 14 components, `floating-cluster-controller.js?…efd81d3a→58c2ea90`**.
This is a single targeted re-run of the cache-bust-on-Astro step (or a 14-file sed).

---

## Net ledger impact for the final verifier

Compared to the pre-`d19baf0` ledger (60 bugs), at `03e01a0`:
- **+9 closures** fixed-current (PS-01, P0-7, P0-8, PS-07, V2-1, V2-3, V2-4, NEW-2, PS-04)
  + the arena-agent-6 P0 (sw.js) + PS-06 (production).
- **−1 reopen** (V2-2/NEW-3: ledger says fixed, actually not).
- **P0-10 downgrade** P0 → P1 residual (still open, narrower).

The headline is NOT the count — it is the **V2-2 discrepancy**: an implementation agent
logged it FIXED without verifying, and the dead nagornaya font controls would have been
shipped. Every "FIXED" entry in the ledger should be re-confirmed against source before
declaring repair-done.

## Reproduction (deterministic, no browser)
All checks above are `node`/`grep`/`git` commands runnable on a fresh clone at `03e01a0`;
the PS-01 node repro and the file-hash sweep are fully scripted and self-contained.
