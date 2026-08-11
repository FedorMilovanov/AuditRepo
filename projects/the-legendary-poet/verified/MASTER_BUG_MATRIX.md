# Active Bug Matrix — The Legendary Poet

**Role:** current verified engineering work only.  
**Owner of current source truth:** `FedorMilovanov/TheLegendaryPoet`.  
**Historical matrix:** `../archive/superseded/MASTER_BUG_MATRIX_2026-08-05.md`.  
**Consolidation evidence:** `../verification/2026-08-07-matrix-consolidation/REPORT.md`.  
**Latest current verification:** `../verification/2026-08-12-urlstate-hash-focus-current/REPORT.md`.

This file is intentionally short. Closed, absorbed, stale, invalid and superseded findings do not remain here merely to preserve history. The section/count shape below is retained because AuditRepo's shared validator treats `verified/MASTER_BUG_MATRIX.md` as a machine-readable counter surface.

## ✅ ЗАКРЫТО (0)

Closed history is owned by `CLOSURE_LEDGER.md`, `SYSTEM_THEMES.md`, verification packages and `archive/`.

## 🟠 P1 — ОТКРЫТО (1)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-ABUSE-001` | `CONFIRMED-CURRENT / PUBLIC-INTEGRITY / P1` | Caller-controlled community identity remains public uniqueness/rate-limit authority; fresh tabs can bootstrap different UUIDs and target membership is not server-canonical | Put writes behind trusted server-side anti-abuse/target authority; retain DB uniqueness defense and adversarial concurrency/rotated-ID proof without mandatory registration. |

## 🟡 P2 — ОТКРЫТО (20)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-DELIVERY-001` | `CONFIRMED-CURRENT / DELIVERY-RECONCILIATION / SYSTEMIC / P2` | Retry/validation/cooldown/ACK authority drifts client↔server; local/server moderation truth and multi-tab persisted work can diverge | Typed outcomes, aligned validation/rate limits, bounded retry/startup replay, server-authoritative ACK reconciliation and lossless multi-tab arbitration. |
| `TLP-COMM-ORDER-001` | `CONFIRMED-CURRENT / DATA-PRESENTATION / P2` | Helpful/kind ordering covers only loaded newest-first subset | Server-supported corpus ordering/filtering or explicitly scoped loaded-row semantics with matching pagination. |
| `TLP-COMM-A11Y-001` | `CONFIRMED-CURRENT / ACCESSIBILITY / P2` | Mutation outcomes lack reusable live-status semantics; sort state partly visual-only | Reusable live-status owner, programmatic state and cross-browser accessibility proof. |
| `TLP-COMM-READSTATE-001` | `CONFIRMED-CURRENT / READ-STATE-TRUTH / P2` | Failed/unresolved reads can appear as genuine empty/zero | Explicit loading/error/ready-empty/ready-data states; preserve prior loaded data on failure. |
| `TLP-COMM-TARGET-001` | `CONFIRMED-CURRENT / DATA-INTEGRITY / TARGET-STATE / P2` | Dirty editor state can survive detail A→B while mutation closures now target B | Key/reset/prompt state by target identity and certify dirty-draft navigation. |
| `TLP-THEME-001` | `CONFIRMED-CURRENT / SYSTEMIC / THEME-OWNERSHIP / P2` | Light token ownership incomplete; prepaint/chrome/cross-tab theme state drift | Semantic tokens, prepaint apply, metadata sync, cross-tab convergence and contrast certification. |
| `TLP-A11Y-RUNTIME-001` | `CONFIRMED-CURRENT / SYSTEMIC / FOCUS-NAV-SEMANTICS / P2` | Command/listbox focus, hidden tabbable chrome, same-path/immersive focus, nested main, invisible audio seek, mobile fixed chrome, scroll-only anchors and disappearing ScrollToTop focus lack one interaction authority | One nav/focus/dialog/hash/hidden-chrome contract, visible seek focus, stable focus handoffs and delayed-target settlement with Chromium + WebKit proof. |
| `TLP-DISCOVERY-001` | `CONFIRMED-CURRENT / SYSTEMIC / MACHINE-METADATA-OWNERSHIP / P2` | Sitemap/OG modification facts drift and IndexNow submits whole inventory per deploy | One route/change metadata authority deriving sitemap/prerender/runtime/IndexNow with parity/delta proof. |
| `TLP-READER-TEXT-001` | `CONFIRMED-CURRENT / ACCESSIBILITY / SEMANTIC-TEXT / P2` | Animated poem words are sole DOM text with CSS-only spacing and `select-none` | Exact canonical selectable text layer separated from visual animation; DOM/copy/a11y proof. |
| `TLP-AUDIT-004` | `CONFIRMED-CURRENT / AUDIT-HARNESS / FALSE-GREEN / P2` | QA still has proxy/preview gaps across theme/hash/community/SEO/cross-tab/consent/audio/analytics/release/redirect/discovery/secondary/search/statistics/progress/URL-state behavior | Replace with exact outcome regressions including Back/Forward URL parity and hash+viewport+focus settlement. |
| `TLP-AUTHORING-ID-001` | `CONFIRMED-CURRENT / AUTHORING-RELEASE-CONTRACT / P2` | Scaffold/guide/validators disagree on IDs/files/required fields/assets/community constraints | One validated ASCII-kebab producer/consumer identity contract with aligned guide/scaffold/CI fixtures. |
| `TLP-AUDIO-SESSION-001` | `CONFIRMED-CURRENT / PERSISTENCE-CONVERGENCE / DATA-LOSS / P2` | Whole-snapshot session writes can erase cross-tab progress/completion despite tab-sync promise | Conflict-safe merge/version semantics, session-key subscription and two-page convergence proof. |
| `TLP-ANALYTICS-CONSENT-001` | `CONFIRMED-CURRENT / PRIVACY-CONSENT / STATE-AUTHORITY / P2` | Consent initially gates correctly but later cross-tab deny has no active-provider revocation | Browser-wide observable consent, authoritative revoke/disable and grant→deny cessation proof. |
| `TLP-RATING-SOURCE-001` | `CONFIRMED-CURRENT / DATA-PRESENTATION / SOURCE-AUTHORITY / P2` | Reader `/5` vs editorial `/10` provenance is lost on badges and editorial score tie-breaks reader ranking | Carry source/scale, remove editorial authority from reader places and separate unrated rows. |
| `TLP-AUDIO-RELEASE-001` | `CONFIRMED-CURRENT / RELEASE-INTEGRITY / PHYSICAL-ASSET-GATE / P2` | Warning-tolerant production audio check can allow a missing new `published` master when another master is valid | Every published release fails closed on physical asset/signature/SHA in exact production gate. |
| `TLP-ROUTE-REDIRECT-001` | `CONFIRMED-CURRENT / HOSTING-CONTRACT / LEGACY-ROUTES / P2` | Client-only redirects have no Pages source docs while preview QA assumes successful initial response | Real host redirects or materialized aliases; test built/static-host initial responses and final canonical semantics. |
| `TLP-SECONDARY-DATA-001` | `CONFIRMED-CURRENT / FAILURE-CONTAINMENT / PRIMARY-READINESS / P2` | Essay primary body and PoetDetail can be made route-fatal by optional essay catalog | Primary readiness only from primary data; local containment for catalog/series/RelatedEssays with asymmetric failure tests. |
| `TLP-SEARCH-001` | `CONFIRMED-CURRENT / SEARCH-INVENTORY / TEXT-AUTHORITY / P2` | Global search/mobile “all sections” omits poems/sections and lacks `ё/е` equivalence | Canonical searchable inventory, poem deep links, truthful section coverage and shared Russian normalization preserving `й`. |
| `TLP-RATING-METHOD-001` | `CONFIRMED-CURRENT / METHODOLOGY / SAMPLE-SIZE-TRUTH / P2` | Self-derived prior lets 1×5.0 outrank 20×4.5 despite explicit one-vote protection claim; dimension leaders also lack sample gate | Transparent confidence/sample methodology with copy/code agreement and adversarial sparse-sample regressions. |
| `TLP-RATING-URLSTATE-001` | `CONFIRMED-CURRENT / URL-STATE / BIDIRECTIONAL-AUTHORITY / P2` | `../verification/2026-08-12-urlstate-hash-focus-current/REPORT.md`; `/ratings` copies query/tag/sort/rated params into local state only at mount then writes state→URL, so Back/Forward or same-component URL navigation can diverge from visible filters | Choose URL as one canonical filter state, sanitize on read, preserve compact replace semantics and certify direct query load, clean-navigation reset and Back/Forward parity. |

## 🟢 P3 — ОТКРЫТО (2)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-ANALYTICS-ROUTE-001` | `CONFIRMED-CURRENT / ANALYTICS-DATA-QUALITY / ROUTE-LIFECYCLE / P3` | New URL can be emitted with previous title before destination SEO settles | Emit from settled route lifecycle and certify delayed-route path/title truth. |
| `TLP-READING-PROGRESS-001` | `CONFIRMED-CURRENT / READER-SEMANTICS / PROGRESS-BOUNDARY / P3` | Root scroll/document height extends reading progress through sources/community/footer | Own progress by explicit article boundaries and prove 100% at article end despite long post-article tail. |

## Summary

| Категория | Количество |
|---|---:|
| Закрыто (fixed) | 0 |
| **P0 открыто** | **0** |
| P1 открыто | 1 |
| P2 открыто | 20 |
| P3 открыто | 2 |
| Рефакторинг | 0 |
| AuditRepo | 0 |
| **Всего открыто (матрица)** | **23** |

Current architecture selection: **none**. Hall #369 remains terminally closed and historical/frozen safety authority, not a current Product lane.

## Explicitly outside this matrix

- Deployment-side Supabase variable values are an evidence boundary, not another bug row.
- Canonical poet portraits lack generic provenance fields, but current evidence does not prove deployed portrait bytes are reconstructions; Product #270 owns longform visual provenance.
- No current future-dated published release was found; the permissive date guard alone is not promoted.
- Legacy redirect finding is source/platform-contract confirmed, not direct observation of every live custom-domain response.
- Research/editorial work, Hall and W0–W7 historical closures are not current engineering rows merely because long-term work remains.

## Lifecycle rule

`VERIFY → one root cause → one owner → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → remove from this matrix.`

A row leaves this file when closed, absorbed, invalid, stale, parked or converted into an owner decision. Durable evidence stays in the closure ledger, system themes, verification report or archive.
