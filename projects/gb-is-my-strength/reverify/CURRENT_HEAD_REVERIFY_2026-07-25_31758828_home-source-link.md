# CURRENT HEAD REVERIFY — 2026-07-25 — `31758828` homepage + source-link contracts

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `31758828fcc53c005a82108c18c63bd1ad268d25`
- Exact imported production authority: `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320`
- AuditRepo authority before reconciliation: `3c806841312145ff0740f934a0fb31802d09e834`
- Date: 2026-07-25

This witness advances source and CI/browser/network truth only. It does not claim readiness, Pages deployment, live publication or whole-release artifact identity for `31758828`.

## Source-link acceptance chain

### Redirect and destination policy

PR #324 merged as `e8e7c39c15642f0ab70999779b9d734c29c70f77` and added explicit redirect-chain handling, per-hop policy, private/reserved-address rejection, DNS pinning, HTTPS-downgrade and loop/overflow blocking, final status/content checks and machine-readable chain evidence.

### Evidence secrecy and immutable workflow dependencies

PR #336 merged as `f65795b21edb568134b37deb91b2e4feca21a41a` and added malformed URL evidence as `invalid-url:sha256:<fingerprint>:bytes:<n>`, full-SHA workflow action pins and permanent source/mutation coverage.

The first manual post-#336 run `30173878517` published artifact `8623705267` (`sha256:fd30eb2b77075da9acf41d2526877a13a291e1b5768262e5801443c194f9b36d`) and exposed a common-mode native adapter failure: 201 checked, 0 pass, 201 warning, 0 hard and zero redirect hops because every request failed before HTTP with `ERR_INVALID_IP_ADDRESS`. That run is diagnostic evidence, not acceptance.

### Native Node acceptance

PR #346 merged as `6c005e49deb39c55ee7aa10bd89687bd82c65c1a` and fixed:

- scalar and `options.all=true` custom DNS lookup callback shapes;
- exact address/family validation before native request creation;
- `systemicTransportFailure` for a corpus where every URL warns before HTTP;
- bounded response-prefix storage instead of false `RESPONSE_TOO_LARGE` hard failures;
- warning classification for 401/403/405/418/429 and transient 5xx;
- permanent runtime and adversarial source coverage.

Clean PR head `e30a9b24c86dd65e3ff0f27677432add70c39ead` passed Source Link Audit `30175072859` and Shared Files Guard `30175072868`. Final scope was exactly the three permanent source-link scripts; no temporary workflow or materializer entered `main`.

### Post-merge real-network evidence

Canonical manual run `30175242133` executed on exact `main@6c005e49`. Artifact `8624053524`, digest `sha256:d20c3b5773560d0c3453b552c538cf1f4f977dd390b6171d85a17b6909bfd3e6`:

- schema version 2;
- audit root `dist`;
- 201 checked;
- 165 pass;
- 31 warning;
- 5 hard;
- 35 redirect hops;
- `systemicTransportFailure=false`;
- no credentials, sensitive query values or fragments in public evidence.

The five stable hard records are CONTENT/RESEARCH issue #352: two Archive.org 404s, Heidelberg→WorldCat HTTP 400, Cambridge HTTP 404 and an expired Grace e-books certificate. SYSTEM issue #303 is closed completed and its policy must not be weakened to hide those sources.

## Homepage browser contract

PR #338 merged as `31758828fcc53c005a82108c18c63bd1ad268d25` and closes R3 finding `HOME-BROWSER-CONTRACT-MISSING` / source issue #299.

### Permanent runtime proof

The production-like Chromium/WebKit contract covers:

- mobile menu open, initial focus, Tab/Shift+Tab trap, Escape, exposed-backdrop click and mobile→desktop resize cleanup;
- exact scroll-lock release and opener/desktop focus restoration;
- persisted `pageshow` / BFCache cleanup without duplicated initialization;
- canonical Ctrl/Meta+K search only, rejecting Alt/Shift combinations, IME composition and editable targets;
- one-time lazy Pagefind initialization, first-activation input focus and Escape closure;
- Hebrew pointer, Enter and Space behavior, translation association, no cloned controls and viewport-safe geometry;
- reading progress, reduced-motion back-to-top and horizontal-overflow checks;
- JavaScript-disabled primary content and noscript navigation.

### Product correction

The pre-runtime lazy-search bootstrap previously accepted broad Ctrl/Meta+K combinations and editable targets. PR #338 added a head-first capture gate requiring exactly one Ctrl/Meta modifier, no Alt/Shift, no IME composition and no editable target before generated search runtime loading.

### Exact-head proof

Final clean head `8d39dab12e1f999b92551f3c80293ce442887537` changed exactly:

- `.github/workflows/interactive-audit.yml`;
- `scripts/home-browser-contract.mjs`;
- `src/components/home/HomeProgressiveEnhancementHead.astro`.

Successful exact-head runs:

- Runtime Interactive Audit `30175417113` — production-like build, Pagefind, Chromium, Chromium no-JS, WebKit and WebKit no-JS;
- Shared Files Guard `30175417105`;
- Native Source Contract `30175417120`;
- Editorial Dateline Contract `30175417093`;
- Print Paper Contract `30175417098`;
- Visual Parity Guard `30175417119`;
- Glossary Contract `30175417096`.

Earlier four-mode PASS artifact `8623983844` has digest `sha256:72b1e97442d0e28bd7560d81e0f71ddf4557421180db49463de9007e18600f2d`.

No visual redesign, content rewrite or search-overlay replacement was introduced. Issue #299 is closed completed.

## Deployment witness correction

AuditRepo’s older operational text said automated replay had not been observed. Exact run `30171194731` disproves that stale statement:

- exact successful deploy resolution passed;
- trusted recorder checkout passed;
- exact-run TTS artifact download passed;
- artifact/report validation and repository witness projection passed.

Historical run `30169981463` remains failure and is not rewritten. Operator comment `5080203496` remains transparent historical recovery evidence; automated replay `30171194731` is a separate later success.

## Current ownership at capture

- Open source PR #348 — exact Genesis 6 Research authority provenance only; draft/noindex remains the safe state.
- Open source CONTENT/RESEARCH issue #352 — five genuine external source replacements.

Refresh source main and owners before every future action.

## Production boundary

Exact imported production authority remains `f5e29998` only:

- readiness `30169126149`;
- deploy `30169443420`;
- Pages deployment `5603663894`;
- Pages artifact `8622641548` (`sha256:38a3a138d9f062e43c0e3ed52666113759d310cb0231e2ee388fc522b25e2b2c`);
- TTS artifact `8622642553` (`sha256:bacb0330c7a2201289eeeb7d2b9b9dc832106eec292cd890afc1c5819e1eec7f`).

No exact readiness, same-artifact Pages promotion or live witness for source `31758828` is imported here. Whole-release identity and build-once promotion remain #292/#295.
