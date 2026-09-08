# The Legendary Poet — active-row currency preflight

Date: 2026-09-08  
Audit issue: #408  
AuditRepo base: `fcb41578c377b5f58b16a81231100f3e02704de5`  
Product merge target under test: PR #466, exact head `196893531faa214a180e6f73fe0a0ce9fa613336`  
Product base at this preflight: `060103d081485074bbf59e1bf16a2bae1a5d6e29`

## Status of this document

This is a **pre-merge currency witness**, not terminal reconciliation. Product #466 is still running its final exact-head Hall offline certification. No future Product merge SHA is asserted here. Terminal AuditRepo reconciliation must update this evidence against the real resulting Product `main` after CAS merge.

## Product #466 preflight

At this checkpoint the PR is Ready, mergeable and `behind=0` against `main@060103d…`; submitted reviews = 0 and review threads = 0.

Exact-head terminal success already observed:

- CI #3904;
- Project Contracts #1015;
- Hall web runtime proof #14, including production `/hall` Chromium/Android/iPhone-WebKit evidence;
- Hall greybox #351;
- Site route integrity #1910;
- Articles catalog #1602;
- Yesenin Part I browser acceptance #1146;
- Brand deep reference/motion #1927;
- Manual Browser QA #2963, including fresh-process iPhone Safari.

### Exact Hall web evidence

Hall web artifact `10070020628`, name `hall-web-runtime-proof-196893531faa214a180e6f73fe0a0ce9fa613336`, digest `sha256:89d9c51a34fff086f9ef64d96a3ac27e93495a5c6bd6c8a24cf216b96e80e764` was independently unpacked during this audit.

- embedded tested head = exact `196893531faa214a180e6f73fe0a0ce9fa613336`;
- every one of the 8 manifest-listed evidence SHA-256 values recomputed successfully;
- authority = H3 / R1 / `L0-minimal-runtime` / UV0;
- application/documentary texture sources = 0; renderer texture baseline = 1;
- isolated proof build = 539,795 B total / 536,071 B JS / 1,871 B CSS;
- Chromium desktop = WebGL, 19 draw calls, 210 triangles, 28.8 ms first frame;
- iPhone WebKit = WebGL, 15 draw calls, 162 triangles, 113 ms first frame;
- forced no-WebGL fallback is explicit on Chromium and WebKit;
- a real Chromium `WEBGL_lose_context` transition is recorded as `webgl-context-lost` semantic fallback;
- reduced-motion evidence remains WebGL and advances by deterministic cut rather than animated interpolation.

The production Hall runtime source was additionally read on the same head: it validates H3/R1/L0/UV0 JSON authority, lazy-imports the exact bare `three` specifier, uses a Hall-only Vite adapter exposing a narrow `three/src/Three.js` surface, creates only neutral documentary-excluded proxies, removes resize/context-loss listeners before renderer disposal and keeps guided-camera/fallback semantics explicit.

### Exact Hall offline still-stage evidence

Hall offline run #200 uploaded its pre-walkthrough artifact before the long render:

- artifact `10070550189`;
- name `hall-pushkin-offline-stills-196893531faa214a180e6f73fe0a0ce9fa613336`;
- digest `sha256:1225871efb1146000d3ff7460484e7ec7bb6369d9139ae7404f66de33c8ce9a8`;
- embedded tested head = exact `196893531faa214a180e6f73fe0a0ce9fa613336`;
- H3 layout/mesh fingerprints, R1, L0, exact documentary source/derivative hashes and all 10 stills are present;
- raw/optimized Khronos = 0 errors / 0 warnings;
- measured offline budget remains explicitly non-production: raw GLB 12,541,228 B; optimized GLB 12,520,580 B; 196 triangles; documentary compressed bytes dominate transfer and decoded documentary texture residency is ~62.7 MB;
- the 5×2 contact sheet was manually inspected and no geometry/composition break was observed.

The canonical offline GLB still reports info-level unused UV attributes. This is **not** a regression of Product #444/#447: that merged contract explicitly scoped UV pruning to the visual-remediation candidate (`candidateOnly=true`, `canonicalGeneratorMayChange=false`). The canonical offline artifact remains a non-shipping evidence asset with 0 Khronos errors/warnings and is not consumed by #466 production WebGL.

Still pending at this checkpoint:

- Hall Pushkin offline exhibit #200 — source/Blender/still/GLB/Khronos/Meshopt/budget/contact-sheet steps are green; 24-second walkthrough render is still running, followed by ffprobe/final evidence validation/upload;
- aggregate Merge certification #58 — web-runtime same-head wait is green, visual-remediation is correctly N/A, and the only active wait is the exact-head offline Hall result.

No merge is admissible until those exact-head gates are terminal-success and the final base/head/review race is rechecked.

## Row-by-row currency result

The current active matrix contained 18 rows before this wave. This preflight independently rechecked their source-side currency instead of inheriting the 2026-09-06 denominator by assumption.

### P1

| ID | Preflight verdict | Current evidence |
|---|---|---|
| `TLP-COMM-ABUSE-001` | **REMAINS ACTIVE — external/live terminal gate** | Cloudflare Worker/D1 source authority is present and browser remote mode still fails closed unless both API URL and Turnstile/human-proof configuration exist. Repository source cannot prove production Worker/D1 health, secrets, Turnstile policy or adversarial behavior. Keep active until deployed `/health` readiness plus live rejection/idempotency/concurrency/rotated-identity evidence exists. |

### P2

| ID | Preflight verdict | Current evidence |
|---|---|---|
| `TLP-A11Y-RUNTIME-001` | **REMAINS ACTIVE, NARROWED** | Product #460 closed Command Palette dialog-level Enter capture and strengthened deep-link restoration. The matrix row is broader: visible seek focus, hidden/fixed chrome, collection-mutation handoff, citation destination ownership and overlay stacking remain independent acceptance requirements. Do not close the systemic row from the #460 subset. |
| `TLP-DISCOVERY-001` | **REMAINS ACTIVE** | `indexnow.yml` still regenerates/submits the full canonical URL set after every successful deploy. Sitemap/runtime/not-found/redirect metadata are still not one change-aware route-state authority. |
| `TLP-AUDIT-004` | **REMAINS ACTIVE, NARROWED** | Several manifestations now have exact browser contracts (#435 shell singleton, #437 live status, #438 URL state, #439 completion, #460 command/deep-link/blocked-storage consent). The meta-root still covers unresolved proxy-vs-release outcomes across consent revocation, redirects/discovery, secondary failure containment, rating methodology/source, search, progress, home media and motion. |
| `TLP-AUTHORING-ID-001` | **REMAINS ACTIVE** | `scripts/new-poet.ts` still permits arbitrary Unicode letters in generated IDs, derives a default ID only from surname, writes a camel-like filename from that ID and leaves canonical registry insertion manual. This remains weaker/different from the guide's Latin filename, canonical registration, field/media/provenance release expectations. |
| `TLP-AUDIO-SESSION-001` | **REMAINS ACTIVE** | `audioSessionStore.ts` v2 still implements `read -> clone whole snapshot -> mutate -> localStorage.setItem`. There is no conflict-safe merge/version protocol or session-key storage subscription, so independent tab writes can erase positions/completions. |
| `TLP-ANALYTICS-CONSENT-001` | **REMAINS ACTIVE, NARROWED** | #460 added same-tab authority when localStorage is blocked. Current `analytics.ts` still has no cross-tab consent convergence and no teardown/revocation of already started GA/Метрика when consent becomes denied. `AnalyticsConsentBanner` disappears once a choice exists and `/privacy` offers deletion of site data rather than a reopenable in-app editor. |
| `TLP-RATING-SOURCE-001` | **REMAINS ACTIVE** | Default reader ranking still uses editorial `poet.rating` as the final tie-break after reader score/vote count. Reader `/5` and editorial `/10` are shown separately in some table cells but source authority is still not fully separated from reader placement semantics. |
| `TLP-ROUTE-REDIRECT-001` | **REMAINS ACTIVE** | Route contract still declares five legacy aliases and App handles them through client-side `<Navigate>`. No current source evidence materializes host-level/static initial redirects for GitHub Pages. |
| `TLP-SECONDARY-DATA-001` | **REMAINS ACTIVE** | `PoetDetailPage` renders `RelatedEssays` in the primary route tree; `RelatedEssays` directly `use()`s `getBrowserEssayCatalog(location.key)` without a local failure boundary. An optional essay-catalog failure can therefore still fail the primary poet route. `EssayPage` also directly consumes the catalog for series navigation. |
| `TLP-SEARCH-001` | **REMAINS ACTIVE** | `commandItems.ts` builds command inventory from base sections + poets + essay search index + tracks. Poems and article-section deep links are absent; the claimed global/all-section search inventory remains incomplete. |
| `TLP-RATING-METHOD-001` | **REMAINS ACTIVE** | `RatingsPage` still uses fixed `PRIOR_WEIGHT = 5` and a self-derived current global mean for Bayesian-style adjustment. Dimension leaders accept any rated row without a sample gate, while reader copy makes an explicit sparse-vote protection claim. |
| `TLP-RATING-URLSTATE-001` | **RETIRE — CLOSED BY VERIFIED PRODUCT #438** | Merged #438 introduced `useRatingsUrlState`, URL-canonical read/sanitize semantics, transactional updates and direct-load/Back/Forward/reset browser coverage across Chromium/Android/iPhone. The old mount-only local-state defect is no longer current. |

### P3

| ID | Preflight verdict | Current evidence |
|---|---|---|
| `TLP-ANALYTICS-ROUTE-001` | **REMAINS ACTIVE** | `AnalyticsRouteTracker` keys the effect on both `location.pathname` and `location.search`, builds page path from pathname+search and sends on those changes. Same-route search/filter URL mutations therefore remain page-view authority rather than an intentionally classified analytics event. |
| `TLP-READING-PROGRESS-001` | **REMAINS ACTIVE** | `ReadingProgress` CSS path uses `animation-timeline: scroll(root)` and JS fallback uses `document.documentElement.scrollHeight`. `EssayPage` already has an explicit `articleRef`, but progress does not consume it; sources/community/footer can extend the displayed reading denominator. |
| `TLP-AUDIO-COMPLETION-001` | **RETIRE — CLOSED BY VERIFIED PRODUCT #439** | Merged #439 removed the `>=97%` timeupdate completion heuristic. Categorical completion is owned by native `ended`; browser regression proves seek-to-97% stays incomplete and a real native end persists completion. |
| `TLP-HOME-MEDIA-PERF-001` | **REMAINS ACTIVE** | Home still renders six hero portrait windows and `HeroPoetWindow` passes `loading="eager"` for all six. Only the first two get high fetch priority; the critical request set and responsive transfer budget remain undefined. |
| `TLP-A11Y-MOTION-001` | **REMAINS ACTIVE** | Framer respects user reduced motion, but persistent utility animation remains unconditional: PoetCard rating star uses `animate-pulse`; audio mini-player uses playing `animate-pulse` and busy `animate-spin` without a reduced-motion utility guard. |

## New truthful denominator if Product #466 merges without changing these sources

Two rows are conclusively stale-after-fix and have already been removed from the Draft active matrix in this audit wave:

- `TLP-RATING-URLSTATE-001`;
- `TLP-AUDIO-COMPLETION-001`.

All other 16 rows remain current or externally gated on the evidence above.

Current Draft denominator, subject only to terminal Hall #466 resulting-main verification:

- P1: **1**;
- P2: **11**;
- P3: **4**;
- total active engineering roots: **16**.

This is not permission to bulk-close systemic rows. Each remaining root retains the lifecycle `VERIFY -> one root cause -> bounded Product repair -> exact-head evidence -> merge -> AuditRepo closure`.

## Suggested autonomous repair order after reconciliation

The next source-side work should favor bounded roots with direct behavioral proof before the broader systemic roots:

1. `TLP-A11Y-MOTION-001` — one cross-layer reduced-motion policy with computed-animation browser proof; Product #467 is registered but may not start until #466 is merged;
2. `TLP-READING-PROGRESS-001` — explicit article boundary and 100%-at-article-end browser proof;
3. `TLP-SECONDARY-DATA-001` — local containment of optional catalog/series/related-essay failures;
4. `TLP-AUDIO-SESSION-001` — conflict-safe versioned per-field/per-track merge protocol plus two-tab convergence witness.

The P1 community row is not an autonomous source-only closure and must not be simulated with another validator.

## Terminal reconciliation still required

After Product #466 is genuinely merged:

1. resolve the exact resulting Product `main` SHA;
2. re-run the final currency assertions against that SHA;
3. retain this pre-merge report as chronology and add a terminal sibling report bound to the resulting main;
4. update `verified/MASTER_BUG_MATRIX.md` only to replace pre-merge qualifiers with the final verification report/current Product identity;
5. append durable closure/provenance to `verified/CLOSURE_LEDGER.md` for #438/#439 and the verified Hall #465/#466 transaction;
6. run AuditRepo `validate` + `preflight` on the exact final audit head;
7. merge only with current-base and review debt clean.
