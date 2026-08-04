# Witness matrix — Search / Scripture findings

**Date:** 2026-08-04  
**Product source anchor:** `f9d0120718569c510833dba7a3abd68ce2f6a003`  
**Matrix rows:** `SEARCH-P1-01`, `SEARCH-P1-03`, `SEARCH-P1-04`, `SEARCH-P2-07`, `SEARCH-P2-08`  
**Primary evidence:** `incoming/search-deep-audit-2026-08-04/` and `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_search-scripture-current.md`

| Bug ID | W1 Source | W2 Artifact / dist | W3 Browser | W4 History / prior row | Current status | Notes |
|---|---|---|---|---|---|---|
| `SEARCH-P1-01` | yes — static route scan over production-like `dist/**/*.html` and route policy inventory | yes — `PASS2_PROBE.json`; `search-index-policy-inventory` says affected routes are index/searchManifest include | partial/no — jsdom harness only; no real Chromium due sandbox browser install/network failure | yes — compared against closed Home/search and search lazy rows; not a duplicate | confirmed-current | Repair needs a Product decision: global command palette on all public searchable routes or explicit local-only exceptions. |
| `SEARCH-P1-03` | yes — `js/search.js` scope logic, hard-coded suggestions, resolver/corpus inspection | yes — Pagefind query probes and Scripture-scope model in `SCRIPTURE_SEARCH_PROBE.json` | partial/no — Pagefind API + jsdom model, not real browser | yes — distinguishes from closed `SEARCH-SCRIPTURE-BROKEN` historical scope | confirmed-current | Root defect is not “search does not work at all”; root is false exact-reference promise and no exact resolver. |
| `SEARCH-P1-04` | yes — built public HTML reference extraction and manifest/Pagefind metadata comparison | yes — `SCRIPTURE_SEARCH_PROBE.json` reports ~1026 parseable visible refs vs 16 manifest scripture items / 30 Pagefind meta entries | not required for count; browser witness needed for final Product repair | yes — broader than `SEARCH-MANIFEST-QUALITY`; current site-occurrence matrix missing | confirmed-current | This is the structural “no BibleRef → occurrence graph” finding. |
| `SEARCH-P2-07` | yes — `data/bible/books.json`, `data/bible/**`, `src/lib/bible-reference-core.mjs` | yes — `node scripts/bible-reference-contract.mjs --strict` and `SCRIPTURE_SEARCH_PROBE.json` | n/a | yes — tracked as corpus-governance debt, not runtime breakage | confirmed-current | Sparse corpus is acceptable for tooltip MVP, not for full Bible search claim. |
| `SEARCH-P2-08` | yes — `data/verses.json` vs canonical resolver | yes — 94 legacy refs / 51 no canonical / 38 text drift in `SCRIPTURE_SEARCH_PROBE.json` | n/a | yes — authority-drift class consistent with existing source/content governance rows | confirmed-current | Fix should project or retire legacy verses before using them for public search suggestions. |
| `SEARCH-P2-09` | yes — Home JSON-LD declares `/?q={search_term_string}` while runtime owners do not read `location.search` / `URLSearchParams` | yes — `PASS4_CONTRACT_PROBE.json` | partial/no — source/dist contract observable; browser query witness needed for closure | yes — related to closed Home SearchAction metadata row, but current defect is unimplemented target behavior | confirmed-current | Either implement `?q=` hydration or remove/narrow SearchAction. |
| `SEARCH-P2-10` | yes — generated search markup in `js/search.js` has mixed listbox/button pattern without combobox active-descendant model | yes — `PASS4_CONTRACT_PROBE.json` | partial/no — keyboard behavior modeled previously; browser a11y-tree witness needed for closure | yes — no current duplicate found in matrix | confirmed-current | Choose combobox/listbox or command-menu pattern and guard it. |
| `SEARCH-P2-11` | yes — `js/search.js` and CSS show input-scoped Tab trap, no shared close button, and search z-index below other floating layers | yes — `PASS5_PREMIUM_NATIVE_PROBE.json` | no — browser top-layer/focus-trap witness required for closure | yes — distinct from `SEARCH-P2-10`; this is modal/top-layer behavior rather than result-list semantics | confirmed-current | Repair with true top-layer modal, dialog-level focus trap and visible close. |
| `SEARCH-P2-12` | yes — `css/command-palette.css` shared control sizing/focus styles inspected | yes — `PASS5_PREMIUM_NATIVE_PROBE.json` | no — mobile/coarse-pointer witness required for closure | yes — no current duplicate found in matrix | confirmed-current | Repair shared 44px hitboxes and focus-visible rules for premium search controls. |

## Witness limitations

- No same-SHA production witness is claimed. Sandbox TLS fetches to `gospod-bog.ru` failed.
- No real Chromium pixel/interaction witness is claimed. Playwright browser download failed in sandbox; `apt-get` browser install also failed.
- The current witness set is sufficient for AuditRepo backlog promotion because the defects are source/dist/data-contract observable; Product closure will require real browser/prod-like witnesses.

## Closure witness requirements

| Bug ID | Required closure witnesses |
|---|---|
| `SEARCH-P1-01` | Source guard for route global-search policy; production-like dist scan; Chromium open/close shortcut and click witness for affected routes or explicit owner exceptions. |
| `SEARCH-P1-03` | Exact-reference parser/index source test; UI contract test for suggestions; Chromium interaction witness for `Ин 3:16`, `Мф 5:3`, `Рим 8:28`, `Иер 17:9` states. |
| `SEARCH-P1-04` | Generated occurrence index with extractor coverage report; mutation fixture for visible refs; dist/public artifact comparison; at least one browser preview test. |
| `SEARCH-P2-07` | Either UI copy narrowed away from “full Bible search” or corpus coverage expanded with rights/source metadata and gates. |
| `SEARCH-P2-08` | Legacy verse projection/retirement; no public suggestion using unreconciled legacy-only text; authority drift gate. |
