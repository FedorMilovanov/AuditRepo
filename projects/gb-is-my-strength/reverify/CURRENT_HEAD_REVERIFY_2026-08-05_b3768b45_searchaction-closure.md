# Current-Head Reverify — Home SearchAction Closure

- Project: `gb-is-my-strength`
- Date: 2026-08-05
- AuditRepo base incorporated: `9a195d08b2b07d615df822ced11ad49f350c14ff`
- Product PR: #968
- Product exact tested head: `ca045325458df820cf98f746e15bb7ab051ef826`
- Product squash merge/current source: `b3768b45de4f9b5abcc39236ee94b7cfe6c55281`
- Product merge parent: `c159526e272812371be614a2fa95e0b149fbbe20`
- Production authority retained: `38b257030afb7cfa8a7b1128f8c86539fd36dec0` / Pages run `30960174778` (not changed or re-claimed here)

## Question

Does the advertised WebSite `SearchAction` target `/?q={search_term_string}` now enter a real, canonical search state on current merged Product source?

## Finding

### `SEARCH-P2-09`

**Result: FIXED-CURRENT / MERGED-SOURCE + CHROMIUM/WEBKIT + CI VERIFIED.**

Product PR #968 adds a bounded adapter in the existing Home route owner. It reads only `q`, collapses repeated whitespace, trims and caps the value at 160 characters, no-ops for absent or blank input, opens search through the existing `gb:openSearch` event and enters the query through the existing canonical input event. It does not create a second search implementation and does not own ranking, Pagefind/fallback, rendering, history, navigation or modal behavior.

## Exact Product tree

Merged-main compare `c159526e272812371be614a2fa95e0b149fbbe20...b3768b45de4f9b5abcc39236ee94b7cfe6c55281` is exactly one commit with three files:

1. `.github/workflows/home-search-action-contract.yml`;
2. `scripts/home-search-action-browser-contract.mjs`;
3. `src/pages/index.astro`.

No `js/search.js`, ranking, search-manifest, Scripture corpus, CSS, cache-revision, service-worker or generated-HTML mutation is included.

## Exact-head workflow evidence

All 12 pull-request workflow groups completed successfully on `ca045325458df820cf98f746e15bb7ab051ef826`:

- Home SearchAction Contract — run `30988019819`;
- Runtime Interactive Audit — `30988019839`;
- Visual Parity Guard — `30988019825`;
- Route Registry Validators — `30988019865`;
- Native Source Contract — `30988019822`;
- Deploy Candidate Contract — `30988019895`;
- Shared Files Guard — `30988019850`;
- Metadata & IndexNow Readiness — `30988019823`;
- Search Manifest Policy — `30988019841`;
- Scripture Occurrence Index Contract — `30988019835`;
- Glossary Contract — `30988019874`;
- Node Toolchain Contract — `30988019851`.

The permanent browser contract passed Chromium and WebKit on desktop and mobile. It verified repeated-space Cyrillic query normalization, exactly one canonical dialog, matching-result presence without backend rank coupling, input focus, truthful trigger/dialog ARIA, retained URL query, blank/unrelated query no-op behavior, horizontal geometry, no page/console errors and a clean read-only tree. The deterministic Scripture source index remained unchanged.

## Boundary

This closure is current merged-source and exact-head CI authority. It does **not** claim a new Pages deployment or change the retained production authority. `SEARCH-P2-07`, `SEARCH-P2-10`, `SEARCH-P2-11`, `SEARCH-P2-12`, `SEARCH-P1-01` and search P3 polish remain independent.

## Canonical action

Move exactly `SEARCH-P2-09` from P2 open to closed. Arithmetic becomes **371 = 226 closed + 145 open**, P2 **29**.
