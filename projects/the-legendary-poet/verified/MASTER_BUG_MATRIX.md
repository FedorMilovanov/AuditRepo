# Active Bug Matrix — The Legendary Poet

**Role:** current verified engineering work only.  
**Owner of current source truth:** `FedorMilovanov/TheLegendaryPoet`.  
**Historical matrix:** `../archive/superseded/MASTER_BUG_MATRIX_2026-08-05.md`.  
**Consolidation evidence:** `../verification/2026-08-07-matrix-consolidation/REPORT.md`.  
**Latest current verification:** `../verification/2026-08-12-primary-readiness-search-authority-current/REPORT.md`.

This file is intentionally short. Closed, absorbed, stale, invalid and superseded findings do not remain here merely to preserve history. The section/count shape below is retained because AuditRepo's shared validator treats `verified/MASTER_BUG_MATRIX.md` as a machine-readable counter surface.

## ✅ ЗАКРЫТО (0)

Closed history is owned by `CLOSURE_LEDGER.md`, `SYSTEM_THEMES.md`, verification packages and `archive/`; it is not duplicated into the active matrix.

## 🟠 P1 — ОТКРЫТО (1)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-ABUSE-001` | `CONFIRMED-CURRENT / PUBLIC-INTEGRITY / P1` | `../verification/2026-08-11-community-write-integrity-current/REPORT.md`; `../verification/2026-08-12-cross-surface-runtime-authority-current/REPORT.md`; caller-controlled `voter_id` remains public uniqueness/rate-limit authority, fresh tabs can bootstrap different first-use UUIDs, and public RPCs validate target syntax rather than canonical published target membership | Put community writes behind a trusted server-side boundary that does not trust caller-rotatable UUIDs: server-verified challenge/session/throttle plus canonical-target validation, preserve DB uniqueness as defense in depth, and add rotated-UUID burst plus simultaneous-clean-tab identity regressions without requiring account registration. |

## 🟡 P2 — ОТКРЫТО (18)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-DELIVERY-001` | `CONFIRMED-CURRENT / DELIVERY-RECONCILIATION / SYSTEMIC / P2` | Community delivery/reconciliation reports; outbox lacks complete retry ownership, validation/cooldown semantics drift client↔server, local ACK state can outlive remote truth, and simultaneous tabs can lose/rewrite one persisted envelope | Implement typed transient/permanent outcomes, one validation/rate-limit contract, bounded retry/startup replay, authoritative post-success reconciliation, lossless two-tab arbitration, durable ACK cleanup and cross-tab invalidation; add failure/concurrency regressions. |
| `TLP-COMM-ORDER-001` | `CONFIRMED-CURRENT / DATA-PRESENTATION / P2` | Backend pages newest-first while default `Полезные` and kind filters operate only on the already-loaded subset | Make helpful ordering/filtering corpus-truthful with server-supported stable pagination, or explicitly scope UI to loaded rows and provide matching load-more. |
| `TLP-COMM-A11Y-001` | `CONFIRMED-CURRENT / ACCESSIBILITY / P2` | Mutation result `ActionToast` lacks live-status semantics; comment sort selection is visual-only | Give mutation outcomes a reusable live-status owner, expose sort selection programmatically and certify all mutation families in Chromium + WebKit. |
| `TLP-COMM-READSTATE-001` | `CONFIRMED-CURRENT / READ-STATE-TRUTH / P2` | Failed/unresolved community reads can render as genuine empty/zero state | Give consumers explicit loading/error/ready-empty/ready-data semantics; preserve loaded pages on failure and never coerce unavailable data to zero. |
| `TLP-COMM-TARGET-001` | `CONFIRMED-CURRENT / DATA-INTEGRITY / TARGET-STATE / P2` | Page-level CommunityPanel editor state is not owned by `targetType:targetId`; dirty A state can survive SPA navigation to B | Key/reset/prompt editor state by target identity and add poet→poet, essay→essay and track→track dirty-draft regressions. |
| `TLP-THEME-001` | `CONFIRMED-CURRENT / SYSTEMIC / THEME-OWNERSHIP / P2` | Light mode has incomplete semantic token ownership; persisted mode applies after first paint, metadata stays dark-owned and preference does not converge across tabs | Move to semantic theme tokens, prepaint preference application, metadata sync, cross-tab convergence and computed-contrast browser certification. |
| `TLP-A11Y-RUNTIME-001` | `CONFIRMED-CURRENT / SYSTEMIC / FOCUS-NAV-SEMANTICS / P2` | Command keyboard/listbox ownership, hidden tabbable chrome, same-path focus, keyed immersive replacement, nested main, invisible audio seek focus and mobile fixed-chrome collision share no single interaction authority | Establish canonical nav/focus/dialog/hidden-chrome semantics, reusable visible-focus audio seek, one mobile bottom-chrome collision owner and Chromium + WebKit keyboard/geometry regressions. |
| `TLP-DISCOVERY-001` | `CONFIRMED-CURRENT / SYSTEMIC / MACHINE-METADATA-OWNERSHIP / P2` | `../verification/2026-08-12-cross-surface-runtime-authority-current/REPORT.md`; `../verification/2026-08-12-release-hosting-discovery-current/REPORT.md`; sitemap modification clocks/SPA-prerender OG facts drift, and every successful main deploy submits the whole sitemap to IndexNow rather than a change set | Define one route/change metadata authority for lastmod/social facts and changed/deleted/redirected URLs; derive sitemap/prerender/runtime/IndexNow from it and certify parity/delta behavior. |
| `TLP-READER-TEXT-001` | `CONFIRMED-CURRENT / ACCESSIBILITY / SEMANTIC-TEXT / P2` | Animated poem words use CSS-only spacing as the sole text layer and core poem text is `select-none`, so canonical DOM text/selection is lost | Separate canonical text semantics from animation presentation; preserve exact selectable/copyable source text and certify DOM extraction/accessibility. |
| `TLP-AUDIT-004` | `CONFIRMED-CURRENT / AUDIT-HARNESS / FALSE-GREEN / P2` | Current QA has proxy/preview-only gaps across error copy, light mode, hash/focus, community poison, SEO parity, two-writer state, consent revocation, audio focus/mobile geometry, analytics settlement, strict audio release, Pages redirects, IndexNow deltas, secondary-data containment and search inventory | Replace proxy checks with exact user/release outcomes, including asymmetric primary/secondary failures, promised search inventory/poem deep links and Russian normalization fixtures. Do not resurrect historical symptom IDs. |
| `TLP-AUTHORING-ID-001` | `CONFIRMED-CURRENT / AUTHORING-RELEASE-CONTRACT / P2` | Scaffold/guide/validators disagree on poet IDs, filenames, fields and asset/community constraints; Cyrillic-derived IDs can render in one layer and fail another | Make poet/poem/route/community/asset identity one validated release contract with deterministic ASCII-kebab transliteration and aligned scaffold/guide/CI fixtures. |
| `TLP-AUDIO-SESSION-001` | `CONFIRMED-CURRENT / PERSISTENCE-CONVERGENCE / DATA-LOSS / P2` | `/archive` promises tab sync, but audio session uses whole-snapshot writes and Provider does not subscribe to the session key; stale tabs can erase positions/completions | Add conflict-safe cross-document merge/version semantics, mounted-state subscription and two-page convergence regressions while preserving single audible playback ownership. |
| `TLP-ANALYTICS-CONSENT-001` | `CONFIRMED-CURRENT / PRIVACY-CONSENT / STATE-AUTHORITY / P2` | First analytics startup is consent-gated, but consent does not converge across tabs and later deny has no teardown/revoke path for initialized providers | Make consent browser-wide observable state, make deny authoritative over active providers, represent blocked-storage truth honestly and certify two-tab grant→deny cessation. |
| `TLP-RATING-SOURCE-001` | `CONFIRMED-CURRENT / DATA-PRESENTATION / SOURCE-AUTHORITY / P2` | Reader `/5` and editorial `/10` are distinct in `/ratings`, but static badges lose source/scale and editorial score silently tie-breaks default reader ranking, including zero-vote rows | Carry source/scale with values, remove editorial inputs from reader-place authority, make unrated rows unranked/separate and certify editorial changes cannot move reader places. |
| `TLP-AUDIO-RELEASE-001` | `CONFIRMED-CURRENT / RELEASE-INTEGRITY / PHYSICAL-ASSET-GATE / P2` | `../verification/2026-08-12-release-hosting-discovery-current/REPORT.md`; production `check:content` uses `validate:audio:available --allow-missing`, so one valid old master can mask a missing new `published` master | Make every `published` release fail closed on physical master/artwork existence, signature and SHA in the exact production gate; reserve missing-asset tolerance for non-published lifecycle only. |
| `TLP-ROUTE-REDIRECT-001` | `CONFIRMED-CURRENT / HOSTING-CONTRACT / LEGACY-ROUTES / P2` | `../verification/2026-08-12-release-hosting-discovery-current/REPORT.md`; legacy redirects exist only in client router, prerender creates no source docs, while Vite-preview QA expects `<400` before client replacement | Use real host/edge redirects or materialized legacy alias documents with explicit canonical/refresh/client semantics, and test the built/static-host initial source response. |
| `TLP-SECONDARY-DATA-001` | `CONFIRMED-CURRENT / FAILURE-CONTAINMENT / PRIMARY-READINESS / P2` | `../verification/2026-08-12-primary-readiness-search-authority-current/REPORT.md`; essay body fetch is `Promise.all`-coupled to catalog, and PoetDetail `RelatedEssays` directly `use()`s the optional catalog, so secondary catalog failure can replace otherwise available primary content | Make primary route readiness depend only on primary data; isolate catalog/series/RelatedEssays under local loading/error boundaries and certify body-200+catalog-503 plus poet-detail catalog-failure cases. |
| `TLP-SEARCH-001` | `CONFIRMED-CURRENT / SEARCH-INVENTORY / TEXT-AUTHORITY / P2` | `../verification/2026-08-12-primary-readiness-search-authority-current/REPORT.md`; `Поиск по сайту` / mobile `все разделы` indexes poets/essays/tracks but no poems and omits Archive/Privacy/Editorial Policy; simple lowercase matching misses `ё/е` equivalence | Derive intended item/section inventory from canonical registries, index poem deep links, align “all sections” with actual coverage and use one Russian normalizer with explicit `ё→е` equivalence while preserving `й`. |

## 🟢 P3 — ОТКРЫТО (1)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-ANALYTICS-ROUTE-001` | `CONFIRMED-CURRENT / ANALYTICS-DATA-QUALITY / ROUTE-LIFECYCLE / P3` | Analytics reacts outside route Suspense and can send new path with previous document title before destination SEO settles | Emit page views from settled destination lifecycle, define error-view behavior, preserve intentional same-path query tracking and certify delayed-route path/title settlement. |

## Summary

| Категория | Количество |
|---|---:|
| Закрыто (fixed) | 0 |
| **P0 открыто** | **0** |
| P1 открыто | 1 |
| P2 открыто | 18 |
| P3 открыто | 1 |
| Рефакторинг | 0 |
| AuditRepo | 0 |
| **Всего открыто (матрица)** | **20** |

Current architecture selection: **none**. Hall #369 is terminally closed and remains historical/frozen safety authority, not a current Product lane or defect row; see `../WORK_QUEUE.md`.

## Explicitly outside this matrix

- Production Supabase variable values are deployment-side evidence and were not readable from repository source; that boundary is not another bug row.
- Canonical poet portraits have no generic provenance kind/source/credit contract, but current evidence does not prove deployed `/images/<poet>.jpg` are reconstructed/generated assets; absence alone is not promoted. Product #270 separately owns longform visual provenance.
- `publishedAt` validates syntax/lifecycle consistency but not `<= today`; no current future-dated published release was found, so it is not promoted.
- Legacy redirect finding is source/platform-contract confirmed, not a claim that this audit directly observed each live custom-domain response.
- Privacy wording around pseudonymous community identity/outbox, reader-visible article update labels and any future full-body search remain product/editorial choices unless a stronger contract is selected.
- Research/source-acquisition/editorial issues are not engineering bugs merely because they remain open in Product.
- Hall and historical W0–W7 closures remain historical authority; active roots above are distinct current mechanisms.
- W3 community-scaling remains closed; current community roots concern write/delivery/order/read/target/a11y authority rather than the closed scaling root.

## Lifecycle rule

`VERIFY → one root cause → one owner → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → remove from this matrix.`

A row leaves this file when closed, absorbed, invalid, stale, parked or converted into an owner decision. Durable evidence stays in the closure ledger, system themes, verification report or archive.
