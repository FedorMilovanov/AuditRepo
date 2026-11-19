# V5.34 — fail-closed catalog and recoverable visit history

Status: experimental AuditRepo Draft PR #545, **not Product/main**, no deployment, Reader migration or merge. The previous V5.33 engineering baseline was exact-head 9 suites / 47 cases PASS; this candidate requires **10 suites / 53 cases PASS on its own SHA**.

## Two primary defects reproduced

1. In `src/catalog/adapter.ts`, testing only `pagefindPolicy !== 'exclude'` admitted both absent pagefind policy and the unexpected string `random`, with zero errors. Actual transpiled adapter returned a public catalog entry for both malformed cases. This is a lab data-admission defect, **not proof any Product route was exposed**: this adapter has no active Product callers.
2. In `src/store.ts`, `gb-hall-seen` was cast directly to string-array without runtime validation. Real Chrome 390×844 with saved `{}` or `null` threw errors when the sitemap opened, producing a blank page; valid `[]` was fine.

## Source-owned repairs

- Catalog policy now checks all four required flags against explicit allowed enums **before** deciding admission/exclusion. Legitimate `pagefindPolicy` values `include` and `metadata-only` remain valid; `exclude` denies. Invalid/missing flags produce an error and reject route.
- `src/visited.ts` contains a pure bounded JSON decoder, current-ID projection and non-destructive append. Object/null/bad element/oversize JSON cannot crash the map. Known IDs are rendered; valid IDs from older editions are retained in the storage record.
- `src/store.ts` shows a safe UI state for damaged history while preserving the original raw localStorage value exactly. Later user interactions refuse to overwrite bad data and show a warning; valid legacy records merge a new visit ID without losing old entries. **No IndexedDB cabinet contents or Product account records touched.**
- `tests/visited.cjs` is mandatory via `lab:check`; it tests bad JSON, bounded parsing, historical ID preservation, repeated ID deduplication, safe append and no-overwrite behavior. Existing catalog unit tests now cover invalid/missing flags.
- `tests/visited-persistence-browser.py` adds 6 true-browser cases: Chromium and WebKit × wrong object / null / mixed array. Both intro sitemap and in-play map must open without JS/HTTP errors, with original raw key preserved. Real 390×844 screenshots are required.
- `scripts/run-browser-regression.py` and `tests/browser-runner-contract.py` now enforce 10 suites / **53** cases on the new SHA. No skip, waiver, injected application state or reduced old requirements.

## Non-waivable remaining release gates

Exact-head GitHub Preflight SUCCESS and Validate **53/53 PASS** with actual Chromium/WebKit PNG review required. Old V5.33 47/47 does not certify this SHA. Photorealistic art direction, real physical iPhone/Android/XR, sustained GPU budgets, reduced-motion art, capability-first 2D loading, Product canonical catalog/Reader and editorial rights remain HARD OPEN. Preserve Draft / LAB / ART HOLD, no Production deployment.
