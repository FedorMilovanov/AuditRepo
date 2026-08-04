# Current Head Reverify — search / Scripture current state

## Project
- Project: `gb-is-my-strength` / `gospod-bog.ru`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Current HEAD SHA: `f9d0120718569c510833dba7a3abd68ce2f6a003`
- Date: 2026-08-04
- Verifier: Arena agent

## Compared against
- verified ledger: `verified/MASTER_BUG_MATRIX.md`
- prior closed search rows: `SEARCH-SCRIPTURE-BROKEN`, `SEARCH-MANIFEST-QUALITY`, `HOME-SEARCH-ICON-LAZY-MISSING`
- incoming reports reviewed/created:
  - `incoming/search-deep-audit-2026-08-04/REPORT.md`
  - `incoming/search-deep-audit-2026-08-04/PASS2_DEEPENING.md`
  - `incoming/search-deep-audit-2026-08-04/PASS3_SCRIPTURE_SEARCH.md`
  - raw artifacts `PASS2_PROBE.json`, `SCRIPTURE_SEARCH_PROBE.json`

## Gates / probes

Product source was cloned at exact `f9d0120718569c510833dba7a3abd68ce2f6a003`; production-like dist was built locally in `/tmp/gb-is-my-strength`.

Passed:

```text
npm ci
node scripts/search-manifest-policy-normalizer-test.js
node scripts/search-index-policy-contract-test.js
npm run strangler:build:production-like
npm run pagefind:build:dist
node scripts/dist-publication-audit.js --require-pagefind --forbid-dev
node scripts/sw-dist-readiness-audit.js --require-pagefind
node scripts/search-index-policy-inventory.js
npm run home:visual-parity:audit
npm run karty:visual-parity:audit
npm run konfessii:visual-parity:audit
npm run maps:validate
node scripts/bible-reference-contract.mjs --strict
node scripts/reference-system-inventory.js
custom Pagefind query probes
custom search route-surface scans
custom Scripture occurrence/corpus probes
```

Environment limitations:

- Sandbox has no `pwsh`/PowerShell runtime; equivalent Node/bash probes were used.
- Playwright browser install failed due sandbox network/TLS restrictions; no same-turn Chromium pixel witness is claimed.
- Direct `curl https://gospod-bog.ru` failed with TLS from sandbox; no same-SHA production claim is made.

## Status changes

| Bug ID | Previous status | Current status | Evidence |
|---|---|---|---|
| SEARCH-P1-01 | absent from matrix | confirmed-open | Four public/indexable/searchManifest routes lack global command-palette assets: `/karty/avraam/`, `/karty/ishod/`, `/konfessii/russkij-baptizm/`, `/map/`; see `PASS2_DEEPENING.md` and `PASS2_PROBE.json`. |
| SEARCH-P1-03 | absent from matrix | confirmed-open | Dedicated `Писание` tab uses metadata/Pagefind filter, not exact Bible resolver; exact reference suggestions create false positives/empty states; see `PASS3_SCRIPTURE_SEARCH.md`. |
| SEARCH-P1-04 | absent from matrix | confirmed-open | Built HTML exposes ~1026 parseable visible Bible refs, while only 16 manifest scripture items and 30 Pagefind scripture-meta entries exist; see `SCRIPTURE_SEARCH_PROBE.json`. |
| SEARCH-P2-07 | absent from matrix | confirmed-open | Canonical Bible registry has 66 books but only 300 canonical records; 24 book files missing; 197 warnings under strict contract. |
| SEARCH-P2-08 | absent from matrix | confirmed-open | Legacy `data/verses.json` has 94 refs; 51 lack canonical records and 38 differ from canonical records. |

## Buckets

### still-confirmed

- `SEARCH-SCRIPTURE-BROKEN` remains closed for its historical fix scope: it added Pagefind-first routing, abbreviations and a first layer of scripture metadata.
- New findings are second-order/current-scope defects: exact-reference precision, exhaustive site-occurrence coverage and global search surface consistency.

### fixed-current

- No new source fix is claimed in this AuditRepo-only verification lane.

### stale-on-current-head

- None claimed.

### regression

- No regression against the exact historical closure is claimed; this is a narrowed higher-standard audit of the current implementation.

### needs-manual-check

- `/karty/` and `/konfessii/` visible search affordance: jsdom post-init found no visible trigger after shared search init, but browser witness is still required before promoting beyond discoverability note.
- Real-browser visual/pixel click-through remains pending due sandbox browser install failure.

## Count impact

Canonical matrix update in this lane:

```text
P1: 70 -> 73
P2: 29 -> 31
P3: unchanged 39
Refactoring: unchanged 4
AuditRepo: unchanged 3
Total open: 145 -> 150
Closed: unchanged 213
Total IDs: 358 -> 363
```

## Repair direction

- Product repair plan is captured in `working/SEARCH_SCRIPTURE_REPAIR_PLAN_2026-08-04.md`.
- First repair should not attempt a full Bible corpus; it should make the UI truthful and generate a site-occurrence Scripture index.
