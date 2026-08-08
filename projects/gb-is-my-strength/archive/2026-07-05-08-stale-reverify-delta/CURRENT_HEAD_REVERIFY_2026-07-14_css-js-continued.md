# CURRENT HEAD REVERIFY — 2026-07-14 @ `21624a3` — CSS/JS continued (pass 6)

## Project
- Project: gb-is-my-strength (gospod-bog.ru)
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Current source HEAD: `21624a3` (was `2ca2af3b`; +40 commits this window)
- Date: 2026-07-14
- Verifier: arena-auditor-meta-governance (Arena.ai Agent Mode)
- Witnesses: `verified-source` (postcss@8.5.16 + css-tree + acorn) + `verified-tooling` (ran `engine:contracts`), Node v22.22.3

> Continued CSS/JS deep-dive, aligned to the current `main` (`abb49d8`). No overlap re-litigated with
> parallel agents; this doc reverifies my earlier CSS/JS findings on the new source HEAD and lands the
> two that are still open. Evidence:
> `../incoming/arena-auditor-meta-governance/2026-07-14/evidence/css-js-continued-pass6-2026-07-14.txt`.

## Status changes vs canon

| Bug ID | Previous | Current @ `21624a3` | Evidence |
|---|---|---|---|
| AUDIT-CSS-SITECSS-STRUCT-CORRUPTION | P1 open | **fixed-current** | postcss + css-tree parse site.css with 0 errors; broken reduced-motion cluster gone (concurrent fix @ `912ffe3`) |
| AUDIT-CSS-FLOATCLUSTER-COMMENT-CORRUPTION | P3 open | **fixed-current** | floating-cluster.css re-laid (+406/−39); `/* ===` banner opener restored; css-tree = 0 bogus selectors; `.mobile-bottom-bar` parses correctly |
| AUDIT-CSS-NO-STRUCTURAL-PARSE | P3 open | **resolved** | a concurrent agent implemented exactly the recommendation: `check-engine-contracts.js:135-140` runs `css-tree.parse({onParseError})` over 6 CSS files as a live gate (`npm run engine:contracts` — all ✅) |
| AUDIT-CSS-GBFLOATER-DUP-MEDIA | (new) | **open** | `.gb-floater` + `html.dark .gb-floater` byte-identical in two `@media(max-width:899px)` blocks (lines 112≡665 [450 chars], 128≡682 [116 chars]) — postcss AST diff |
| AUDIT-JS-ESCAPER-DUP-X5 | (new) | **open** | `site.js` `tt()` ×3 + `highlights.js` `h()` + `search.js` `F()` = 5 escaper copies; `site-utils.js` has none (D-21 drift class) |
| AUDIT-CSS-DEAD-KEYFRAMES-TOKENS | P3 open | **still-open** | `@keyframes fx-breathe` still ×2 in site.css |

## Still-open findings (detail)

### AUDIT-CSS-GBFLOATER-DUP-MEDIA (P3)
`floating-cluster.css` defines `.gb-floater` and `html.dark .gb-floater` **identically twice**, each
inside its own `@media (max-width:899px)` block (lines 112 ≡ 665, 128 ≡ 682; postcss AST confirms
byte-identical bodies). The second block duplicates the first — dead. Other AST-flagged "dup selectors"
are legitimate overrides (different bodies) — no false positive raised. Fix: merge the two media blocks
(also trims NEW-CSS-BUDGET-01).

### AUDIT-JS-ESCAPER-DUP-X5 (P3)
`js/site.js` still defines `function tt()` **three times** (two `.replace()` chains + one `/[&<>"]/g`
lookup-table variant — same output, different code), plus `h()` in `highlights.js` and `F()` in
`search.js` = **5 copies**. `js/site-utils.js` (the shared-util home) has none, so every file rolls its
own. This is the exact class that produced **D-21** (glossary escaping drift). Fix: hoist one escaper
into `SiteUtils`, dedupe 5 → 1.

## Clean this pass (recorded so nobody re-chases)
- New `css/series-samizdat.css` (added in delta, 12KB): postcss + css-tree = 0 errors.
- All 10 CSS files: css-tree 0 structural errors (site.css + floating-cluster now clean).
- `!important` density: mobile-hotfix 142/123 rules, nagornaya-mobile-toc 134/138, floating-cluster
  506/989 — extreme but these are the ratcheted files (audit-pro tracks their ceilings). Not raised.
- JS: `vosk splitSentences` still dead-exported, `highlights.js` still no re-init guard — both already
  tracked (NF-VOSK-DEAD-SPLITSENTENCES / NEW-HIGHLIGHTS-NO-REINIT-GUARD), not re-raised.

## Buckets
- **fixed-current / resolved:** AUDIT-CSS-SITECSS-STRUCT-CORRUPTION, AUDIT-CSS-FLOATCLUSTER-COMMENT-CORRUPTION, AUDIT-CSS-NO-STRUCTURAL-PARSE.
- **still-open (landed):** AUDIT-CSS-GBFLOATER-DUP-MEDIA, AUDIT-JS-ESCAPER-DUP-X5, AUDIT-CSS-DEAD-KEYFRAMES-TOKENS.
- **clean (no bug):** series-samizdat.css, CSS structural health, !important-ratchet files.

## Notes for verifier
- Net matrix P3-open change = +2 new − 2 fixed = 0 (headers/stats unchanged).
- Source repo NOT modified. The two open items are cheap dedup wins (merge 2 media blocks; hoist 1 escaper).
- Recommend eventually wiring `check_matrix_coverage.py` + `engine:contracts` CSS-AST parity into AuditRepo/source CI (the corruption class is now gated in source — keep it that way).
