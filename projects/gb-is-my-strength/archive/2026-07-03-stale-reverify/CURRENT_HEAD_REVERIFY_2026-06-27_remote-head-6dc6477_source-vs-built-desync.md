# CURRENT HEAD RE-VERIFY — Remote HEAD 6dc6477: agent fixes landed, but source↔built desync keeps Hermeneutics regression live
**Date:** 2026-06-27
**Remote source HEAD verified:** `6dc6477` (`github.com/FedorMilovanov/gb-is-my-strength`, fresh `--depth 30` clone)
**Reference (owner-approved):** `uploads/gb-floating-cluster-probe-v16 (2).html`
**Local snapshot compared:** `/home/user/repo` (now STALE vs remote)

Evidence labels: **REF-HTML**, **SRC** (fresh remote source), **BUILT** (committed `articles/*/index.html` in the same remote tree), **BUILD-ATTEMPT** (production build run in sandbox).

> Why this pass: owner said "там агент ещё что-то запушил, улучшаемся потихоньку". Confirmed — the agent pushed a substantial wave of fixes. Per verifier rules, prior local-snapshot ledgers must NOT be canonized; this pass re-verifies against the actual remote HEAD.

---

## TL;DR — corrected truth at remote HEAD 6dc6477

1. **VR-07 (.gb-rail-foot typo) — FIXED. Status flips: confirmed-current → FIXED/STALE.**
   The typo'd dead rules were removed from `GillRailControls.astro` (commit `8f42c9f` "cleanup(P3): single source of truth") and the footer ember/save shrink rules now live in canonical `css/floating-cluster.css` with the **correct** `[data-gill-v16] .gbs-rail-foot .gb-ember{--ember-size:32px}` / `.gbs-rail-foot .gb-save{width:32px}` selectors. `grep -rn "gb-rail-foot" | grep -v gbs-rail-foot` = **0 hits**. The "huge crooked icons" mechanism is removed *at source*.

2. **White circles around Play/Save — ROOT CAUSE IDENTIFIED + REVERTED by the agent.**
   Commit `08432bf` ("REVERT R9 regression") explicitly states the agent caused it by **matching DALLE screenshots instead of the HTML probe**: it had added `.gb-floater .gb-ember{48px, white bg, gold ring}`. Reverted back to reference (transparent, 36px, no white circle). This is a clean, self-documented confession of the regression source.

3. **NEW CRITICAL — VR-09: source↔built DESYNC keeps the Hermeneutics position regression LIVE in production even though source is fixed.**
   - SRC fixed: `SingleArticleCluster.astro:48` emits `class="gb-floater gb-floater--${variant}"`; `HermenevtikaBody.astro` calls `variant="hermeneutics"`; `css/floating-cluster.css:41` anchors `.gb-floater--hermeneutics` to the **content-column edge** `right: max(calc((100vw - min(820px,92vw))/2 - 28px), 16px)`.
   - BUILT still ships `class="gb-floater"` — **no `--hermeneutics` modifier** — in `articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html`. The committed markup was never rebuilt after the component change.
   - Therefore the fixed anchor **does not apply** to the live page, and positioning falls back to the **un-deleted late global override** `#content ~ .gb-floater { right:max(8.5vw,...); top:clamp(48px,7vw,100px) }` (css lines ~1672–1694), which is a higher-specificity ID selector anyway.
   - Net: owner still sees "значки уехали вбок", because the production HTML is stale relative to the source fix.

4. **VR-08 (Gill family split) — STILL confirmed-current.** Only `dzhon-gill-istoricheskiy-kontekst` BUILT carries `gbs-rail-foot` (×8); Parts 1/2/3/Spravochnik still ship `gbs2-rail`. Unchanged.

---

## VR-09 — Source fixed, build stale: the regression the owner sees is a deploy-pipeline gap, not a source bug
**Status:** confirmed-current (production-affecting)
**Severity:** HIGH
**Evidence:** SRC + BUILT + commit forensics

### Forensic proof the built markup was never regenerated
The "fix" commits (`2b82368`, `08432bf`, `dbc48c9`) that touch `articles/*/index.html` changed **only 2 lines per file**, and those 2 lines are pure cache-bust query bumps, e.g.:
```
-<link rel="stylesheet" href="../../css/floating-cluster.css?v=2bc9c6e2">
+<link rel="stylesheet" href="../../css/floating-cluster.css?v=673001ae">
```
No floater markup was re-emitted. So the position fixes were delivered **via the CSS file only**, while the HTML keeps the old `class="gb-floater"` (no modifier). The CSS-side `.gb-floater--hermeneutics` rule has nothing to attach to in the built page.

### Specificity trap (independent of desync)
Even if the page is rebuilt to emit `gb-floater--hermeneutics`:
- `.gb-floater--hermeneutics` = 1 class (0,0,1,0)
- `#content ~ .gb-floater` = 1 id + 1 class (0,1,1,0) → **wins**

So the late global override at css ~1672–1694 must be **removed or hard-scoped** for the content-column anchor to take effect, regardless of rebuild. This is the same surface flagged earlier as VR-01 and it is **still present** at remote HEAD.

### Build-trap context (BUILD-ATTEMPT)
- Production artifact = strangler build (`astro build` + `copy-legacy-to-dist.js`), NOT raw `astro build` over legacy files.
- Sandbox cannot run the full build: `astro check` and full page render were **OOM-killed (exit 137)** even with `--max-old-space-size=3072`. vite asset phase succeeded; per-page render exhausted memory. So a full local rebuild-to-verify is not feasible in this sandbox — the source-vs-built proof stands on code reading + commit forensics, which is conclusive.
- Known build warning reproduced again: `../images/og-karty-1200x630.webp ... didn't resolve at build time` (confirmed-current, unchanged).

### Required fix sequence (for implementation pass)
1. Remove / hard-scope the late global `.page-wrap ~ .gb-floater, #content ~ .gb-floater` block (css ~1668–1694) so `.gb-floater--hermeneutics` wins.
2. Rebuild and commit the **production-like strangler dist** so `articles/.../germenevtiki/index.html` emits `gb-floater--hermeneutics` (cannot be done reliably in this sandbox due to OOM — must run in CI / fuller env).
3. BROWSER-PENDING witness of rendered Hermeneutics position after both.

---

## Status ledger updates (verifier honesty)

| ID | Prior status | New status at HEAD 6dc6477 | Note |
|---|---|---|---|
| VR-01 (late global `.gb-floater` override) | confirmed-current | **still confirmed-current** | block remains at css ~1672–1694; higher specificity than hermeneutics anchor |
| VR-02 (Gill footer drift `[data-gill-v16] .gbs-rail-foot` boxed/centered) | confirmed-current | **STILL confirmed-current** | re-read at css line 851 (single occurrence, no dup): `justify-content:center; gap:4px; padding:10px 8px; border-radius:12px; background:rgba(255,255,255,.03)` vs REF `justify-content:space-between; gap:0; padding-top:12px; no box bg` |
| VR-03 / VR-08 (Gill family split) | confirmed-current | **still confirmed-current** | only context on `gbs-rail-foot`; parts on `gbs2-rail` |
| VR-04 (white circles around Play/Save) | partially confirmed | **ROOT-CAUSED + FIXED** | R9 DALLE-driven deviation, reverted in `08432bf` |
| VR-07 (.gb-rail-foot typo → huge icons) | confirmed-current (HIGH) | **FIXED / STALE** | removed in `8f42c9f`, rules moved to canonical CSS with correct selector; 0 leftover typos |
| VR-09 (source↔built desync, Hermeneutics) | n/a | **NEW, confirmed-current, HIGH** | production HTML never rebuilt; CSS fix can't attach |

---

## Agent push autopsy (history forensics, fresh remote log)

Recent commits, newest first:
- `6dc6477` chore: auto-update meta, cache-bust [skip ci]
- `dbc48c9` fix(critical): position controls at content-column edge + TTS Russian-only + pause fix
- `2b82368` fix(critical): restore breadcrumb-level positioning + mobile pill + fc-single-active
- `08432bf` fix(visual): REVERT R9 regression — transparent Play/Save, 36px, no white circles
- `8f42c9f` cleanup(P3): remove CSS duplication + dead links — single source of truth  ← **fixed VR-07**
- `9e06173` fix(ui): pixel-match reference — 48px Play with gold ring protrusion  ← **introduced the white-circle R9 deviation later reverted**
- `b29d4a5` fix(ui): speed-pill closer to reference

Pattern observed (matches owner's frustration narrative):
- The agent oscillated: `9e06173` deviated toward DALLE (48px gold-ring → white circles), then `08432bf` reverted to the HTML probe. This back-and-forth is the "играется и выдумывает своё" the owner complained about. The author identity on these is `arena-agent-deep-verifier-editor`.
- Lesson to encode (already partly in plan doc / protection docs): **the HTML probe is the single source of truth for standalone controls; DALLE screenshots must not override it.**

---

## VR-02 re-confirmed at remote HEAD (css line 851, single occurrence)
Canonical `[data-gill-v16] .gbs-rail-foot` at HEAD 6dc6477:
```css
[data-gill-v16] .gbs-rail-foot{
  margin-top:auto; display:flex;flex-direction:row;align-items:center;
  justify-content:center;        /* REF: space-between */
  gap:4px;                       /* REF: 0 */
  padding:10px 8px;              /* REF: padding-top:12px */
  border-top:1px solid rgba(255,255,255,.08);
  border-radius:12px;            /* REF: none */
  background:rgba(255,255,255,.03);  /* REF: none */
  width:100%;
}
```
→ Renders the Gill-context footer as a centered rounded box with bg, not the reference full-width `space-between` row. Applies to context (which has `data-gill-v16`). NOTE: appears **once** (line 851) — an earlier suspicion of duplication was a grep artifact; there is no duplicate. `css/floating-cluster.css` is 2033 lines — large merged drift-prone artifact (consistent with VR-06).

## Open items for next pass
1. ~~Re-verify VR-02~~ DONE above — VR-02 still live at css line 851.
2. Confirm whether `[data-gill-v16]`-scoping of the footer shrink rules creates a latent risk for Parts 1/2/3/spravochnik if/when they migrate to `gbs-rail-foot` without `data-gill-v16` (they currently lack it).
3. BROWSER-PENDING: rendered Hermeneutics position + Gill footer + mobile bottom-bar after a real production-like rebuild (not possible in this OOM-limited sandbox).
4. Mobile reference port (mobile-bottom-bar + toc-sheet + Save-in-Part-TOC) remains unstarted in source — owner wants it 1-в-1, rounded contour kept.
