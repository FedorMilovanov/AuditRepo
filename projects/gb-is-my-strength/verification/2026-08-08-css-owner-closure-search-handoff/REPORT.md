# GB CSS owner closure + next-wave handoff — 2026-08-08

## Result

`AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` is closed by Product `#1205` and must be removed from MASTER.

Product anchor after closure:

`21b437cb79f7b74a4ad3c68e21ffad2edd8ce458`

MASTER effect:

- active work units: **10 → 9**;
- direct current defects: **0**;
- verified necessary improvements: **4 → 3**;
- system lanes: **2**;
- owner decisions: **4**.

---

## Product #1205 — exact closure

PR: `#1205` — `cleanup(css): remove duplicate shared presentation owners`

Final exact head:

`55c20a3f5ed5b299e600193fdbb450f30b232aaf`

Merged Product commit:

`21b437cb79f7b74a4ad3c68e21ffad2edd8ce458`

### Source result

`css/site.css`:

- the earlier dead scale-only `fx-breathe` duplicate is removed;
- the later scale+opacity `fx-breathe` remains canonical.

`css/floating-cluster.css`:

- the earlier standalone mobile `.gb-floater` owner remains;
- its `html.dark .gb-floater` owner remains;
- legacy `body.fc-single-active .article-main` and current `body.gb-cluster-single-active .article-main` padding remain;
- the later repeated standalone/dark/padding block is removed;
- unique `series-lite` mobile rules remain.

No temporary writer/workflow/script survives in the final tree.

### Projection boundary

Net diff against pre-merge Product `main@76ad2f3ff814c088eb429d5ec0edd35d5bbe27b0` contained 64 files, but only two semantic source owners:

- `css/site.css`;
- `css/floating-cluster.css`.

The remaining files were deterministic current-owner asset revision projections (`404.html`, active Astro PageHead/Chrome owners and `src/lib/asset-version.js`). Canonical hashes became:

- `css/site.css` → `d1015157`;
- `css/floating-cluster.css` → `85a1bfb6`.

The 52 `reference-only` HTML snapshots remained preserved.

### Successor-chain disposition

The branch/PR chain did not represent three competing Product states:

- `#1200` — transaction/evidence vehicle, closed unmerged;
- `#1202` — same exact final SHA, closed unmerged after Shared Files rejected only the noncanonical `cleanup/` protected-file branch prefix;
- `#1205` — same exact final SHA on allowed `fix/` namespace and the only merge vehicle.

All three referenced exact final SHA `55c20a3f...`; no Product byte changed to repair the branch-policy failure.

### Exact-head CI

On `55c20a3f...`, the effective latest runs were terminal SUCCESS, including:

- Shared Files Guard `31230554836` / run `9942`;
- Visual Parity `31230554775`;
- Runtime Interactive `31230554811`;
- Source Authority `31230554872`;
- Route Registry `31230554878`;
- Deploy Candidate `31230554880`;
- Home SearchAction, Search Modal, Search Manifest, Native Source, Content Source Truth, Print, Avraam, TTS, Glossary, Scripture occurrence and the other triggered exact-head contracts.

Older Shared Files failures (`9939` / `9940` / `9941`) belong to the predecessor/branch-policy history; current run `9942` passed the actual shared/system diff under the allowed branch namespace.

### Strangler control-plane witness

Shared Files artifact `repository-control-plane-audit-31230554836` is bound to exact head `55c20a3f...` and reports unchanged retirement readiness:

- public indexes: `53 / 53`;
- native shadows: `52`;
- ledger entries: `53`;
- classification-clear references: `52`;
- unknown reference decisions: `0`;
- dependency records: `35`;
- mechanical repoints: `16`;
- obsolete/remove-or-repoint: `3`;
- dependency owner decisions: `7`;
- unknown dependency impacts: `0`;
- integrity / inventory / parity problems: `0`;
- blocker total: **26**;
- `deletionReady=false`;
- `physicalMoveAuthorized=false`;
- verdict `NOT_YET_SAFE_TO_MOVE_OR_DELETE`.

CSS cleanup therefore did not create hidden Strangler debt and does not authorize legacy deletion.

---

## Next improvement audit — SEARCH-P3-02

Fresh exact-source audit shows this is more specific than the older “Pagefind 10 / fallback 12” wording.

### Path A — Pagefind

Current `js/search.js` calls Pagefind, then immediately truncates raw search hits with:

`i.results.slice(0,10)`

Only those first ten entries are hydrated with `data()`, deduplicated by URL and then transformed/filter-grouped by current scope.

Consequence: the cap occurs **before** deduplication and scope handling. Relevant hits beyond the first ten are unreachable even when duplicate/scope filtering leaves fewer than ten visible rows.

### Path B — manifest fallback

Fallback search evaluates/ranks the current manifest first, then applies `.slice(0,12)` before rendering. This is a direct visible cap with no continuation.

### Path C — exact Scripture occurrences

Exact Scripture mode deduplicates occurrences, then applies `n.slice(0,12)` for rendering. The status text does use the full occurrence count (`occurrences.length + " вх."`), so the interface can explicitly tell the user there are more matches while offering no way to reach them.

### Existing guard gap

The existing `Search Modal Contract` is valuable and should be extended rather than replaced. It currently proves combobox/listbox semantics, focus wrapping, target geometry, modal layering, cross-browser behavior and no runtime errors, but it does not assert total-result truthfulness or continuation.

### Positive repair boundary

One bounded Search owner should:

1. keep one canonical result state with `total`, `visibleCount` and current scope;
2. avoid Pagefind truncation before dedupe/scope selection;
3. provide deterministic continuation (`Показать ещё`, pagination, or equivalent) for Pagefind, fallback and exact Scripture paths;
4. keep keyboard/listbox behavior stable as items are appended;
5. expose truthful status text (`shown / total` or equivalent);
6. extend existing `scripts/search-modal-browser-contract.mjs` with >10 Pagefind, >12 fallback and >12 Scripture fixtures/mutations;
7. add no new permanent workflow.

This should not reopen already-closed global Ctrl/Meta+K ownership (`AR-IDX-09`).

---

## AR-IDX-05 — exact current boundary

Fresh source audit confirms that the repository already has the correct per-asset hashes:

- `ASSET_VERSIONS['css/enhancements-runtime.css'] = '97a3e924'`;
- `ASSET_VERSIONS['css/highlights-runtime.css'] = '9f42844a'`.

But current runtime loaders bypass those per-asset authorities:

- `js/enhancements.js` loads `/css/enhancements-runtime.css?v=` from generic `window.SITE_CONFIG.version`;
- `js/highlights.js` loads `/css/highlights-runtime.css?v=` from the same generic field;
- `BaseLayout.astro` seeds `runtimeConfig.version` from `ASSET_VERSIONS['js/glossary.js']`.

So two unrelated runtime CSS assets are cache-versioned by the glossary JS hash even though their own canonical hashes already exist. This is a semantic authority mismatch, not a need for another versioning system.

The future bounded repair should make runtime CSS loaders consume their own canonical per-asset revisions (or equivalent explicit injected asset map) and remove the misleading generic bridge when no longer needed.

---

## Next order

After this closure:

1. `SEARCH-P3-02` — highest direct user-visible value, one existing Search owner/guard family;
2. `AR-IDX-05` — small positive cache-authority correction now that exact consumers are known;
3. `AUDIT-JS-ESCAPER-DUP-X5` — broader shared-JS migration, only with loader/context equivalence proof;
4. system lanes/owner decisions remain independent and are not folded into these implementation waves.
