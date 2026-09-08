# The Legendary Poet — terminal active-row currency at `cf78d58`

Date: 2026-09-08  
Audit issue: #408  
Audit PR: #409  
Product transaction: #465 / PR #466  
Product exact tested head: `196893531faa214a180e6f73fe0a0ce9fa613336`  
Resulting Product `main`: `cf78d58f0bef479e77a0265dd14111bc7d0c44db`

## Terminal status

This is the terminal successor to `REVERIFY_PREMERGE_2026-09-08_active-row-currency.md`.

Product #466 was CAS squash-merged only after the final exact head had:

- `behind=0` against `main@060103d081485074bbf59e1bf16a2bae1a5d6e29`;
- zero submitted review debt and zero review threads;
- CI #3904 — success;
- Project Contracts #1015 — success;
- Hall web runtime proof #14 — success;
- Hall greybox #351 — success;
- Hall Pushkin offline exhibit #200 — success;
- Site route integrity #1910 — success;
- Brand deep reference/motion #1927 — success;
- Articles catalog #1602 — success;
- Yesenin Part I #1146 — success;
- Manual Browser QA #2963 — success, including fresh-process iPhone Safari;
- Merge certification #58 — success, with Hall web and Hall offline exact-head waits both successful and visual-remediation correctly classified not-applicable.

The squash merge produced `cf78d58f0bef479e77a0265dd14111bc7d0c44db`. Its tree is `d3b9b3855e149ba861c2e688497f452e50e8cf6e`, the same tree as exact tested head `196893531faa214a180e6f73fe0a0ce9fa613336`. Therefore the pre-merge row-by-row source findings bind directly to the resulting `main`; there is no untested post-merge source delta hidden by the squash commit.

## Hall evidence bound to the merge

### Browser runtime

Canonical artifact:

- Hall web runtime proof artifact `10070020628`;
- artifact digest `sha256:89d9c51a34fff086f9ef64d96a3ac27e93495a5c6bd6c8a24cf216b96e80e764`;
- exact head `196893531faa214a180e6f73fe0a0ce9fa613336`.

The artifact manifest was independently rehashed before merge: all eight recorded SHA-256 values matched their files. Production `/hall` browser evidence covered Chromium, Android and iPhone WebKit, plus forced fallback, real WebGL context loss and reduced-motion cuts. The production runtime requested no documentary/application texture sources; rights-pending historical media remained excluded.

### Offline authority

Final Hall Pushkin offline artifact:

- artifact `10073236433`;
- digest `sha256:8ec100d1aff6766b479253da4e4ff3353700f3ab66ae195bea839ef5772bb06c`;
- exact head `196893531faa214a180e6f73fe0a0ce9fa613336`.

Pre-walkthrough still-review artifact:

- artifact `10070550189`;
- digest `sha256:1225871efb1146000d3ff7460484e7ec7bb6369d9139ae7404f66de33c8ce9a8`.

The final workflow completed source/rights/acquisition boundary validation, deterministic Blender identity, H3 material rebuild, packed scene generation, raw and Meshopt GLB validation, measured budget, 5x2 contact sheet, the authored 24-second walkthrough, ffprobe verification, final evidence validation and upload. Khronos validation had zero errors and zero warnings. Information-level unused canonical offline UV objects are not a regression of Product #447: #447's transport-cleanup contract is explicitly candidate-only and forbids changing the canonical generator.

### What Hall #466 did not close

The merge activates only the bounded web vertical slice. It does **not** claim:

- documentary-media publication rights;
- documentary credits/attribution approval;
- human `offlineVisualApproval`;
- shipping of rights-pending facsimiles;
- full museum scale-out.

Those remain owner/legal/product-roadmap boundaries rather than reopened engineering defects.

## Retired active rows

Exactly two rows from the prior 18-row active matrix are stale-after-fix and leave the current matrix.

### `TLP-RATING-URLSTATE-001` — closed by Product #438

- Product PR: #438 `fix(ratings): make URL the canonical filter state`;
- exact tested head: `b146969b8c80cb9ac67577818df6fc76d39806a4`;
- squash merge: `283f923f59fe6c5421394bd114b74f4dc174f47c`;
- exact-head CI #3858, Manual Browser QA #2917, Project Contracts #969 and Merge certification #16 were successful.

The URL is now the canonical filter authority for `/ratings`; direct load, sanitization, discrete history, reset and Back/Forward control parity are browser-certified across the canonical mobile/browser matrix. The previous mount-only local-state authority is no longer current.

### `TLP-AUDIO-COMPLETION-001` — closed by Product #439

- Product PR: #439 `fix(audio): make native ended the only completion authority`;
- exact tested head: `183fbc11fb16c4428058e962a281647fa921c0b2`;
- squash merge: `41a42bfbf3d8273b9858ef1337ed5c5afcab786e`;
- exact-head CI #3860, Manual Browser QA #2919, Project Contracts #971 and Merge certification #18 were successful.

The `>=97%` timeupdate completion shortcut is gone. Near-end seek remains progress-only; categorical completion is owned by native `ended`, with real browser evidence and archive presentation parity.

## Narrowed but still-active systemic evidence

Product #460 (`c10f1e2b860e243bdb5ee49d55092dc1e32a0bf8` → merge `344536aec3dccb45762e675fccef27c3ca74c4b9`) is recorded as narrowing evidence, not as a false systemic closure. Its exact-head CI #3885, Manual Browser QA #2944, Project Contracts #996 and Merge certification #42 were successful.

It closes concrete manifestations in command keyboard ownership, lazy deep-link restoration, blocked-localStorage same-tab consent truth and community forced-refresh races. It does **not** close the broader `TLP-A11Y-RUNTIME-001`, `TLP-ANALYTICS-CONSENT-001` or `TLP-AUDIT-004` roots, whose remaining acceptance boundaries are preserved in the matrix.

## Current active denominator

After removing only the two proven stale-after-fix rows, the current engineering matrix is:

| Severity | Active roots |
|---|---:|
| P0 | 0 |
| P1 | 1 |
| P2 | 11 |
| P3 | 4 |
| **Total** | **16** |

The 16 current/external roots are:

- P1: `TLP-COMM-ABUSE-001`;
- P2: `TLP-A11Y-RUNTIME-001`, `TLP-DISCOVERY-001`, `TLP-AUDIT-004`, `TLP-AUTHORING-ID-001`, `TLP-AUDIO-SESSION-001`, `TLP-ANALYTICS-CONSENT-001`, `TLP-RATING-SOURCE-001`, `TLP-ROUTE-REDIRECT-001`, `TLP-SECONDARY-DATA-001`, `TLP-SEARCH-001`, `TLP-RATING-METHOD-001`;
- P3: `TLP-ANALYTICS-ROUTE-001`, `TLP-READING-PROGRESS-001`, `TLP-HOME-MEDIA-PERF-001`, `TLP-A11Y-MOTION-001`.

No other row is retired by this reconciliation.

## Next autonomous repair order

The next Product source transaction is already bounded by Product issue #467 and may now start from `main@cf78d58…`:

1. `TLP-A11Y-MOTION-001` — unified persistent-utility reduced-motion authority + real computed-animation browser proof;
2. `TLP-READING-PROGRESS-001` — explicit article boundary, 100% at article end independent of post-article tail;
3. `TLP-SECONDARY-DATA-001` — asymmetric local containment for optional catalog/series/related-essay failures;
4. `TLP-AUDIO-SESSION-001` — conflict-safe version/session-key cross-tab convergence protocol.

`TLP-COMM-ABUSE-001` remains a real P1 external/live release gate, but it cannot be honestly closed by source-only validators. It requires deployed Worker/D1 readiness and adversarial production evidence.

## Reconciliation conclusion

Product truth and AuditRepo active truth are now aligned at `main@cf78d58f0bef479e77a0265dd14111bc7d0c44db`: Hall's bounded production web slice is merged and evidence-bound, exactly two stale rows are retired, and 16 independently current/external roots remain. No owner/legal gate is converted into a software closure and no future Product state is asserted.