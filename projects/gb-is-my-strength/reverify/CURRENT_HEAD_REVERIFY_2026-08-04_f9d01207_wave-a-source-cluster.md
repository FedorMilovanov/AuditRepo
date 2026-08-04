# CURRENT HEAD REVERIFY — Wave A source cluster @ exact Product `f9d01207`

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Product anchor: `f9d0120718569c510833dba7a3abd68ce2f6a003` (exact current `main`)
- AuditRepo base: `850429a299a6118db85811602fdb661b81b2296f`
- Mode: **Wave A reverification** (no Product mutation in this lane)
- Product mutation: **none**
- Browser/live-production claim: **none**
- TTS scope: **excluded**
- Disposition that changes canonical counts: `NG-CSS-01` → DUPLICATE/MERGED into open root `NG-DARK-01`

## Purpose

Re-verify a coherent cluster of open findings against the exact current Product head so that
the canonical matrix reflects actual current-source truth and only genuinely-repairable residuals
remain open. One row is closed as an architecture-level duplicate; the remainder are re-confirmed
as CONFIRMED-CURRENT with exact line evidence so no future agent wastes a repair lane on a
claim that is already false or already owned by another root.

## Closed this wave

### `NG-CSS-01` → ✅ DUPLICATE / MERGED INTO `NG-DARK-01` (P1)

Original claim (2026-07-14): `nagornaya/tw.min.css` has **0** `html.dark` selectors in its
34 KB Tailwind output for Nagornaya; all dark remaps live *only* on `!important` hacks in
`mobile-hotfix.css`; architectural cause `NG-DARK-01`.

Current exact-source witness at `f9d01207`:

- `nagornaya/tw.min.css` = **34,079 bytes**, **0** `html.dark` selectors — core claim intact;
- the current dark body/utility remap for `.bg-stone-100`/`.bg-stone-50` is served by
  `css/nagornaya-mobile-toc.css`
  (`html.dark body.nagornaya-page .bg-stone-100,html.dark body.nagornaya-page .bg-stone-50{background-color:var(--color-surface-muted)!important}`),
  **not** `mobile-hotfix.css` — the original file attribution is therefore stale;
- `css/mobile-hotfix.css` still carries 67 `!important` declarations (dark/utility hacks).

Disposition rationale: the row is the *architecture-level* statement of the exact defect already
owned by open root `NG-DARK-01` (Tailwind output without dark variants ⇒ dark coverage must be
supplied externally). It has no independently repairable surface distinct from `NG-DARK-01`.
Closing it as DUPLICATE/MERGED into `NG-DARK-01` keeps one repair owner, matching the already
closed precedent rows `NG-VIS-07`, `NG-VIS-08`, `NG-DARK-04`, `NG-DARK-05`. The correction notes
that the current dark-remap owner file is `nagornaya-mobile-toc.css`, superseding the 07-14
"exclusively mobile-hotfix.css" wording.

`NG-DARK-01` itself is **not** closed by this transaction and remains under its active
native-dist authority lane.

## Re-confirmed CONFIRMED-CURRENT (no count change)

| ID | Sev | Exact current evidence |
|---|---|---|
| `CI-WORKFLOW-PROLIFERATION` | P1 | `.github/workflows/` now contains **42** workflows (worse than the "roughly 26" baseline); capability/convergence still required before adding more. |
| `S-SEC-01` | P1 | `js/enhancements.js` FAQ JSON-LD builder still uses a blacklist sanitizer (removes `script,style,iframe,object,embed,link,meta,base,form,input,button,svg,math`, `on*` attrs, `javascript:` hrefs) — allowlist not adopted. |
| `QUAL-P1-05` | P1 | `karty/_engine/map-engine.js:2776` `canvas.addEventListener('wheel',...)` still lacks `{passive:true}`; no passive-touch sweep. |
| `QUAL-P1-06` | P1 | `karty/_engine/map-engine.js` still contains **24** `setTimeout`/`requestAnimationFrame` sites without a demonstrated lifecycle cleanup owner. |
| `MAP-P1-12` | P1 | compass is still created inside the pan/zoom group at `translate(50, 80)` (`map-engine.js:1183-1184`), i.e. map-space rather than screen-overlay. |
| `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` | P3 | `@keyframes fx-breathe` declared **2×** in `css/site.css` (still current; separate agent branch `agent/remove-dead-fx-breathe-20260802` is the active owner). |
| `AUDIT-CSS-GBFLOATER-DUP-MEDIA` | P3 | `.gb-floater` and `html.dark .gb-floater` are byte-duplicated across two `@media (max-width:899px)` blocks (`css/floating-cluster.css` ≈112/668 and ≈128/685). |
| `AR-IDX-04` | P3 | `src/components/home/HomePageChrome.astro` nav link to `/izbrannoe/` still lacks `h-nav-fav`; only legacy `index.html:109` has it. |
| `AR-IDX-05` | P3 | `version: 1778943682` still hardcoded across many Astro page-head/Chrome components (Home, Articles, About, Biografii, Nagornaya, KodDaVinchi, Krajne…). |
| `AR-IDX-06` | P3 | `<div class="h-reading-progress" id="hReadingProgress">` still server-rendered on Home/Articles/HardTexts/Nagornaya-seriya/Pastor/Biografii while `readingProgress.enabled:false`. |
| `AR-IDX-08` | P3 | 13 inline `style=` occurrences in `src/components/home/**` remain instead of CSS classes. |
| `AR-IDX-09` | P3 | `js/search.js` command-palette keydown still fires on `(metaKey||ctrlKey)&&k` with no `altKey`/`shiftKey` guard. |
| `NEW-HARDTEXTS-CSP-MISSING-HFCDN` | P3 | `hard-texts/index.html` CSP `connect-src` includes `https://huggingface.co` but still omits `*.aws.cdn.hf.co`. |
| `D-1` | P3 | `deploy.yml` uses `concurrency.group: pages`, `indexnow.yml` uses `metadata-indexnow-diagnostics-${{ github.ref }}` — groups still disjoint. |
| `NG-SERIYA-01` | P3 | `nagornaya/seriya/index.html` `<body class="nagornaya-page nagornaya-series-page">` still carries no `bg-stone-100`/`data-chapter`. |
| `D-4` | P3 | magic z-index values still present (`floating-cluster.css:2928/3003/3281/3326/3546/4424` = `2102/9999/2147483000/2147483000/2147483100/2147483000`, `mobile-hotfix.css:129` = `2102`). Premise partially resolved: `--z-*` tokens are now defined in `css/site.css :root` (AR-IDX-CSS-01 closed), so the residual is only the hardcoded values; surface is PremiumControls/frozen. |
| `AUDIT-P2-WORKFLOWS-CHECK-GAP` | P2 | `scripts/check-workflows.js` (Workflow Policy v2) is capability-based and read-only but still regex-driven; no explicit `if:`/`\|\| failure` topology check added. |

## Canonical arithmetic for the AuditRepo transaction

- Canonical IDs: **358**
- Closed: **213 → 214**
- Open: **145 → 144**
- P0: 0
- P1: **70 → 69**
- P2: 29
- P3: 39
- Refactoring: 4
- AuditRepo: 3

Total remains `358 = 214 + 144`.

## Evidence boundary

- exact Product `f9d0120718569c510833dba7a3abd68ce2f6a003`;
- direct current-source inspection (grep/line evidence above);
- no Product mutation;
- no browser, computed-style, deployed-SHA or live-production claim;
- no TTS inspection or modification;
- `NG-DARK-01` and its native-dist authority lane (AuditRepo PR #152) are untouched.
