# Active Bug Matrix — The Legendary Poet

**Role:** current verified engineering work only.  
**Owner of current source truth:** `FedorMilovanov/TheLegendaryPoet`.  
**Historical matrix:** `../archive/superseded/MASTER_BUG_MATRIX_2026-08-05.md`.  
**Consolidation evidence:** `../verification/2026-08-07-matrix-consolidation/REPORT.md`.  
**Latest current verification:** `../verification/2026-08-12-rating-method-reading-progress-current/REPORT.md`.

This file is intentionally short. Closed, absorbed, stale, invalid and superseded findings do not remain here merely to preserve history. The section/count shape below is retained because AuditRepo's shared validator treats `verified/MASTER_BUG_MATRIX.md` as a machine-readable counter surface.

## ✅ ЗАКРЫТО (0)

Closed history is owned by `CLOSURE_LEDGER.md`, `SYSTEM_THEMES.md`, verification packages and `archive/`; it is not duplicated into the active matrix.

## 🟠 P1 — ОТКРЫТО (1)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-ABUSE-001` | `CONFIRMED-CURRENT / PUBLIC-INTEGRITY / P1` | Community write-integrity and cross-surface reports: caller-controlled `voter_id` remains public uniqueness/rate-limit authority, fresh tabs can bootstrap different UUIDs, and public RPCs do not validate canonical target membership | Put community writes behind a trusted server-side boundary that does not trust caller-rotatable UUIDs; preserve DB uniqueness as defense in depth and add rotated-UUID/concurrent abuse regressions without requiring account registration. |

## 🟡 P2 — ОТКРЫТО (19)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-DELIVERY-001` | `CONFIRMED-CURRENT / DELIVERY-RECONCILIATION / SYSTEMIC / P2` | Outbox retry/validation/cooldown/ACK authority drifts across client/server and simultaneous tabs can lose/rewrite persisted work | Implement typed outcomes, one validation/rate-limit contract, bounded retry/startup replay, authoritative post-success reconciliation and lossless two-tab arbitration with durable ACK cleanup. |
| `TLP-COMM-ORDER-001` | `CONFIRMED-CURRENT / DATA-PRESENTATION / P2` | Helpful/kind ordering operates only on the already-loaded newest-first subset | Make ordering/filtering corpus-truthful with server pagination or explicitly scope UI to loaded rows with matching load-more. |
| `TLP-COMM-A11Y-001` | `CONFIRMED-CURRENT / ACCESSIBILITY / P2` | Mutation result toast lacks live-status semantics; comment sort selection is visual-only | Give mutation outcomes reusable live-status ownership, programmatic sort state and browser accessibility regressions. |
| `TLP-COMM-READSTATE-001` | `CONFIRMED-CURRENT / READ-STATE-TRUTH / P2` | Failed/unresolved reads can render as genuine empty/zero state | Add explicit loading/error/ready-empty/ready-data semantics and preserve already-loaded pages on read failure. |
| `TLP-COMM-TARGET-001` | `CONFIRMED-CURRENT / DATA-INTEGRITY / TARGET-STATE / P2` | Dirty CommunityPanel editor state is not keyed by target and can survive SPA A→B detail navigation | Own editor state by `targetType:targetId` and certify dirty-draft navigation across poet/essay/track details. |
| `TLP-THEME-001` | `CONFIRMED-CURRENT / SYSTEMIC / THEME-OWNERSHIP / P2` | Light-mode token ownership is incomplete; persisted mode applies after first paint, metadata stays dark-owned and preference does not converge across tabs | Move to semantic tokens, prepaint preference application, metadata sync, cross-tab convergence and computed-contrast certification. |
| `TLP-A11Y-RUNTIME-001` | `CONFIRMED-CURRENT / SYSTEMIC / FOCUS-NAV-SEMANTICS / P2` | Command keyboard/listbox ownership, hidden tabbable chrome, same-path focus, keyed immersive replacement, nested main, invisible audio seek focus and mobile fixed-chrome collision share no single interaction authority | Establish one nav/focus/dialog/hidden-chrome contract, reusable visible-focus audio seek and mobile collision owner with Chromium + WebKit regressions. |
| `TLP-DISCOVERY-001` | `CONFIRMED-CURRENT / SYSTEMIC / MACHINE-METADATA-OWNERSHIP / P2` | Sitemap modification clocks/SPA-prerender OG facts drift; every successful main deploy submits the whole sitemap to IndexNow instead of a change set | Define one route/change metadata authority and derive sitemap/prerender/runtime/IndexNow from it with parity/delta tests. |
| `TLP-READER-TEXT-001` | `CONFIRMED-CURRENT / ACCESSIBILITY / SEMANTIC-TEXT / P2` | Animated poem words use CSS-only spacing as sole text layer and poem text is `select-none` | Separate exact canonical selectable text from animation presentation and certify DOM/copy/accessibility semantics. |
| `TLP-AUDIT-004` | `CONFIRMED-CURRENT / AUDIT-HARNESS / FALSE-GREEN / P2` | Current QA has proxy/preview-only gaps across error/theme/hash/community/SEO/cross-tab/consent/audio/analytics/release/redirect/discovery/secondary-data/search/statistics/reading-progress outcomes | Replace proxy checks with exact user/release outcomes, including adversarial rating fixtures and semantic reading-progress geometry. Do not resurrect historical symptom IDs. |
| `TLP-AUTHORING-ID-001` | `CONFIRMED-CURRENT / AUTHORING-RELEASE-CONTRACT / P2` | Scaffold/guide/validators disagree on poet IDs, filenames, required fields and asset/community constraints | Make poet/poem/route/community/asset identity one validated ASCII-kebab release contract with aligned scaffold/guide/CI fixtures. |
| `TLP-AUDIO-SESSION-001` | `CONFIRMED-CURRENT / PERSISTENCE-CONVERGENCE / DATA-LOSS / P2` | Audio session uses whole-snapshot writes without session-key subscription; stale tabs can erase positions/completions despite `/archive` tab-sync promise | Add conflict-safe merge/version semantics, mounted-state subscription and two-page convergence proof. |
| `TLP-ANALYTICS-CONSENT-001` | `CONFIRMED-CURRENT / PRIVACY-CONSENT / STATE-AUTHORITY / P2` | Consent is initially gate-correct but does not converge across tabs; later deny has no active-provider revoke/teardown path | Make consent browser-wide observable state, deny authoritative over initialized providers and certify grant→deny cessation. |
| `TLP-RATING-SOURCE-001` | `CONFIRMED-CURRENT / DATA-PRESENTATION / SOURCE-AUTHORITY / P2` | Reader `/5` and editorial `/10` are distinct, yet static badges lose provenance and editorial score silently tie-breaks reader ranking | Carry source/scale with values, remove editorial inputs from reader-place authority and make unrated rows unranked/separate. |
| `TLP-AUDIO-RELEASE-001` | `CONFIRMED-CURRENT / RELEASE-INTEGRITY / PHYSICAL-ASSET-GATE / P2` | Production check uses warning-tolerant `validate:audio:available`, so one valid old master can mask a missing new `published` master | Make every published release fail closed on physical master/artwork existence, signature and SHA in the exact production gate. |
| `TLP-ROUTE-REDIRECT-001` | `CONFIRMED-CURRENT / HOSTING-CONTRACT / LEGACY-ROUTES / P2` | Legacy redirects exist only in client router; Pages artifact creates no source docs while preview QA assumes a successful initial source response | Use real HTTP redirects or materialized alias documents and test the built/static-host initial source response rather than preview fallback. |
| `TLP-SECONDARY-DATA-001` | `CONFIRMED-CURRENT / FAILURE-CONTAINMENT / PRIMARY-READINESS / P2` | Essay body fetch is catalog-coupled and optional `RelatedEssays` can make PoetDetail route-fatal | Make primary readiness depend only on primary data; isolate catalog/series/RelatedEssays under local failure boundaries and certify asymmetric failures. |
| `TLP-SEARCH-001` | `CONFIRMED-CURRENT / SEARCH-INVENTORY / TEXT-AUTHORITY / P2` | Global search/mobile “all sections” omits poems and several real sections; simple lowercase matching misses `ё/е` equivalence | Derive intended searchable inventory from canonical registries, index poem deep links, align section promise and use a Russian normalizer preserving `й`. |
| `TLP-RATING-METHOD-001` | `CONFIRMED-CURRENT / METHODOLOGY / SAMPLE-SIZE-TRUTH / P2` | `../verification/2026-08-12-rating-method-reading-progress-current/REPORT.md`; current self-derived global prior lets 1×5.0 score ≈4.603 outrank 20×4.5 score ≈4.505 despite explicit claim that one random vote cannot take first place; dimension leaders also have no minimum sample gate | Select a transparent confidence/sample methodology whose code and copy agree, gate rank/highlight claims where needed, and certify sparse adversarial fixtures including 1×5.0 versus 20×4.5. |

## 🟢 P3 — ОТКРЫТО (2)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-ANALYTICS-ROUTE-001` | `CONFIRMED-CURRENT / ANALYTICS-DATA-QUALITY / ROUTE-LIFECYCLE / P3` | Analytics can emit a new path with previous document title before destination SEO settles | Emit page views from settled route lifecycle and certify delayed-route path/title truth. |
| `TLP-READING-PROGRESS-001` | `CONFIRMED-CURRENT / READER-SEMANTICS / PROGRESS-BOUNDARY / P3` | `../verification/2026-08-12-rating-method-reading-progress-current/REPORT.md`; CSS `scroll(root)` and JS document-height fallback measure the whole page, so sources/community/footer extend “reading” beyond the actual article | Define progress from explicit article start/end boundaries, preserve efficient animation where possible and certify ~100% at article end even with a long post-article tail. |

## Summary

| Категория | Количество |
|---|---:|
| Закрыто (fixed) | 0 |
| **P0 открыто** | **0** |
| P1 открыто | 1 |
| P2 открыто | 19 |
| P3 открыто | 2 |
| Рефакторинг | 0 |
| AuditRepo | 0 |
| **Всего открыто (матрица)** | **22** |

Current architecture selection: **none**. Hall #369 remains terminally closed and historical/frozen safety authority, not a current Product lane.

## Explicitly outside this matrix

- Production Supabase variable values are deployment-side evidence and were not readable from repository source; that boundary is not another bug row.
- Canonical poet portraits lack generic provenance kind/source/credit fields, but current evidence does not prove deployed portrait bytes are reconstructions; absence alone is not promoted. Product #270 owns longform visual provenance.
- `publishedAt` does not enforce `<= today`; no current future-dated published release was found, so it is not promoted.
- Legacy redirect finding is source/platform-contract confirmed, not a claim that each live custom-domain response was directly observed.
- Privacy detail copy, reader-visible update labels and future full-body search remain product/editorial choices unless a stronger contract is selected.
- Research/source-acquisition/editorial work and Hall/W0–W7 historical closures are not current engineering rows merely because long-term work remains.
- W3 community scaling remains closed; current community roots are different mechanisms.

## Lifecycle rule

`VERIFY → one root cause → one owner → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → remove from this matrix.`

A row leaves this file when closed, absorbed, invalid, stale, parked or converted into an owner decision. Durable evidence stays in the closure ledger, system themes, verification report or archive.
