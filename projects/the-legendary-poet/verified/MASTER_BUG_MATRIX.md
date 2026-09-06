# Active Bug Matrix — The Legendary Poet

**Role:** current verified engineering work only.  
**Owner of current source truth:** `FedorMilovanov/TheLegendaryPoet`.  
**Historical matrix:** `../archive/superseded/MASTER_BUG_MATRIX_2026-08-05.md`.  
**Consolidation evidence:** `../verification/2026-08-07-matrix-consolidation/REPORT.md`.  
**Latest current verification:** `../verification/2026-08-24-reader-text-closure/REPORT.md`.  
**Closure history:** `CLOSURE_LEDGER.md`.  
**Latest integrity audit:** `../verification/2026-09-06-ssot-matrix-integrity-audit/REPORT.md`.  
**Latest currency check (all rows):** `../reverify/REVERIFY_57353dc_2026-09-06_active-row-currency.md` — 21/21 still-confirmed at Product `57353dc`.

This file is intentionally short. Closed, absorbed, stale, invalid and superseded findings do not remain here merely to preserve history.

## ✅ ЗАКРЫТО (0)

No closed row is retained in this matrix. Solved roots leave the active surface in the same wave that closes them; their durable provenance lives in `CLOSURE_LEDGER.md`, `SYSTEM_THEMES.md` and the verification packages.

Most recently retired from here: `TLP-THEME-001` and `TLP-A11Y-CONTRAST-001` (Product #426, ledger entry 2026-08-20) and `TLP-READER-TEXT-001` (Product #427, ledger entry 2026-08-24).

## 🟠 P1 — ОТКРЫТО (1)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-ABUSE-001` | `SOURCE-REPAIRED / LIVE-PROOF-PENDING / PUBLIC-INTEGRITY / P1` | Product #420 merged the trusted Cloudflare Worker/D1 authority boundary and Product #422 merged the reconciled client/runtime contract. Source/build gates include fail-closed target authority, signed anonymous actors, network-abuse hashing/budgets and Worker bundle validation. **Reachability condition (live witness 2026-09-06 at Product `57353dc`):** `/ratings` renders `Сейчас показаны данные этого браузера; общий backend не подключён`, which is emitted only when `remoteEnabled` is `false`, so the public abuse surface is unreachable on the deployed build and this row is the release gate that binds when the shared backend is enabled — not a claim of a currently exploitable live exposure. **Terminal production evidence is still absent:** source inspection and dry-run do not prove that the intended D1 schema, required secrets, Turnstile policy, Worker deployment, public client activation and adversarial behavior are live. Closure boundary: `../verification/2026-08-20-community-reconciliation-closure/REPORT.md`; current reachability witness: `../reverify/REVERIFY_57353dc_2026-09-06_active-row-currency.md`. | Deploy and activate the intended Worker + D1 contour; prove `/health` reports ready database/target/writes authority and run live adversarial concurrency, duplicate/idempotency, target-rejection and rotated-identity checks without mandatory registration. |

## 🟡 P2 — ОТКРЫТО (13)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-A11Y-RUNTIME-001` | `CONFIRMED-CURRENT / SYSTEMIC / FOCUS-NAV-SEMANTICS / P2` | Command/listbox focus, hidden tabbable chrome, same-path/immersive focus, invisible audio seek, mobile fixed chrome, scroll-only anchors, disappearing controls, archive row removal and citation destination focus lack one interaction authority; configured consent can sit above registered aria-modal dialogs outside the overlay stack | One nav/focus/dialog/hash/hidden-chrome/collection-mutation contract, visible seek focus, stable focus handoffs, citation destination ownership and environment-aware overlay stacking with Chromium + WebKit proof. |
| `TLP-DISCOVERY-001` | `CONFIRMED-CURRENT / SYSTEMIC / MACHINE-METADATA-OWNERSHIP / P2` | Sitemap/OG/change facts drift; IndexNow submits whole inventory per deploy; static 404 and hydrated/error head states have incompatible canonical/OG/schema ownership | One route/change metadata state machine for ready/noindex/not-found/loading/error/redirect states deriving sitemap/prerender/runtime/IndexNow with parity/delta proof. |
| `TLP-AUDIT-004` | `CONFIRMED-CURRENT / AUDIT-HARNESS / FALSE-GREEN / P2` | QA has proxy/preview gaps across theme/hash/community/SEO/cross-tab/consent/audio/analytics/release/redirect/discovery/secondary/search/statistics/progress/URL-state/completion/home-media/focus/contrast/SQL privilege/motion/media-kind/status/comment-text/shell-singleton behavior | Replace proxy checks with exact user/release outcomes, including UI-driven consent revoke, non-text contrast, Unicode/comment whitespace fidelity and persistent-shell singleton assertions. |
| `TLP-AUTHORING-ID-001` | `CONFIRMED-CURRENT / AUTHORING-RELEASE-CONTRACT / P2` | Scaffold/guide/validators disagree on IDs/files/required fields/assets/community constraints; canonical portrait existence/provenance and authority registration are not one producer gate | One validated producer/consumer release contract covering ASCII-kebab identity, canonical registration, editorial fields, portrait existence/provenance and aligned guide/scaffold/CI fixtures. |
| `TLP-AUDIO-SESSION-001` | `CONFIRMED-CURRENT / PERSISTENCE-CONVERGENCE / DATA-LOSS / P2` | Whole-snapshot session writes can erase cross-tab progress/completion despite tab-sync promise | Conflict-safe merge/version semantics, session-key subscription and two-page convergence proof. |
| `TLP-ANALYTICS-CONSENT-001` | `CONFIRMED-CURRENT / PRIVACY-CONSENT / STATE-AUTHORITY / P2` | Consent initially gates correctly but does not converge across tabs, later deny has no active-provider revocation, and normal UI exposes the choice only while consent is unset; PrivacyPage offers no in-app editor beyond deleting site data | Browser-wide observable consent, persistent/reopenable reader control, authoritative provider revoke/enable semantics and complete UI-driven grant→deny→re-grant regression. |
| `TLP-RATING-SOURCE-001` | `CONFIRMED-CURRENT / DATA-PRESENTATION / SOURCE-AUTHORITY / P2` | Reader `/5` vs editorial `/10` provenance is lost on badges and editorial score tie-breaks reader ranking | Carry source/scale, remove editorial authority from reader places and separate unrated rows. |
| `TLP-AUDIO-RELEASE-001` | `CONFIRMED-CURRENT / RELEASE-INTEGRITY / PHYSICAL-ASSET-GATE / P2` | Warning-tolerant production audio check can allow a missing new `published` master when another master is valid | Every published release fails closed on physical asset/signature/SHA in exact production gate. |
| `TLP-ROUTE-REDIRECT-001` | `CONFIRMED-CURRENT / HOSTING-CONTRACT / LEGACY-ROUTES / P2` | Measured live 2026-08-19: all 5 declared aliases answer HTTP 404; the 404 body boots the SPA so humans still reach the target, crawlers get 404 + noindex,follow. `vercel.json` and `public/_redirects` are inert under GitHub Pages | Real host redirects or materialized alias documents; test built/static-host initial responses and final canonical semantics; retire the two inert hosting configs or document why they stay. |
| `TLP-SECONDARY-DATA-001` | `CONFIRMED-CURRENT / FAILURE-CONTAINMENT / PRIMARY-READINESS / P2` | Essay primary body and PoetDetail can be made route-fatal by optional essay catalog | Primary readiness only from primary data; local containment for catalog/series/RelatedEssays with asymmetric failure tests. |
| `TLP-SEARCH-001` | `CONFIRMED-CURRENT / SEARCH-INVENTORY / TEXT-AUTHORITY / P2` | Global search/mobile “all sections” omits poems/sections and lacks `ё/е` equivalence | Canonical searchable inventory, poem deep links, truthful section coverage and shared Russian normalization preserving `й`. |
| `TLP-RATING-METHOD-001` | `CONFIRMED-CURRENT / METHODOLOGY / SAMPLE-SIZE-TRUTH / P2` | Self-derived prior lets 1×5.0 outrank 20×4.5 despite explicit one-vote protection claim; dimension leaders also lack sample gate | Transparent confidence/sample methodology with copy/code agreement and adversarial sparse-sample regressions. |
| `TLP-RATING-URLSTATE-001` | `CONFIRMED-CURRENT / URL-STATE / BIDIRECTIONAL-AUTHORITY / P2` | `/ratings` copies query/tag/sort/rated params into local state only at mount then writes state→URL | URL as canonical filter state, sanitize on read and certify direct query load, clean-navigation reset and Back/Forward parity. |

## 🟢 P3 — ОТКРЫТО (7)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-ANALYTICS-ROUTE-001` | `CONFIRMED-CURRENT / ANALYTICS-DATA-QUALITY / ROUTE-LIFECYCLE / P3` | Raw location mutation owns page-view truth: destination path can emit before SEO settles and same-route query/filter keystrokes are also classified as page views | Emit from settled semantic route navigation; classify same-route search/filter state intentionally and prevent per-keystroke page-view series. |
| `TLP-READING-PROGRESS-001` | `CONFIRMED-CURRENT / READER-SEMANTICS / PROGRESS-BOUNDARY / P3` | Root scroll/document height extends reading progress through sources/community/footer | Own progress by explicit article boundaries and prove 100% at article end despite long post-article tail. |
| `TLP-AUDIO-COMPLETION-001` | `CONFIRMED-CURRENT / AUDIO-SEMANTICS / COMPLETION-TRUTH / P3` | Any timeupdate at >=97% persists categorical completion, including seek-to-97%, while Archive renders 100% and `Прослушано полностью` | Align producer and reader semantics or rename the 97% heuristic; certify seek-to-97% vs native ended behavior. |
| `TLP-HOME-MEDIA-PERF-001` | `CONFIRMED-CURRENT / PERFORMANCE / INITIAL-MEDIA / P3` | All six Home hero portraits are eager, current files total 880,330 bytes, no responsive `srcset` is supplied, and build budgets cover JS/CSS rather than initial raster transfer | Define critical hero request set, defer noncritical portraits, ship responsive candidates and add mobile/desktop initial-media request+byte budgets. |
| `TLP-A11Y-MOTION-001` | `CONFIRMED-CURRENT / ACCESSIBILITY / REDUCED-MOTION / P3` | Framer/Tilt/View Transitions honor reduced motion, but utility CSS animations do not: PoetCard has perpetual decorative pulse and audio surfaces use unguarded pulse/spin | One motion-policy contract across Framer/JS/CSS utilities; suppress non-essential persistent motion under reduce, preserve state meaning and add computed-animation regressions. |
| `TLP-A11Y-STATUS-001` | `CONFIRMED-CURRENT / ACCESSIBILITY / STATUS-MESSAGES / P3` | `/poets` dynamically updates visible result count/zero-state during search/filter interaction without role/status/live semantics, unlike Music archive | Stable polite status semantics for meaningful result/pending/empty changes while keeping focus in controls; avoid duplicate chatter and certify with accessibility-engine/browser proof. |
| `TLP-SHELL-NOISE-001` | `CONFIRMED-CURRENT / SHELL / VISUAL-PERFORMANCE / P3` | Shell noise is owned both by `index.html` and React `SiteLayout`, leaving two fixed full-screen feTurbulence layers at z100 after mount | Give preboot/runtime noise one owner or deterministic handoff so exactly one active layer remains after hydration/navigation, with singleton browser proof. |

## Summary

| Категория | Количество |
|---|---:|
| Закрыто (fixed) | 0 |
| **P0 открыто** | **0** |
| P1 открыто | 1 |
| P2 открыто | 13 |
| P3 открыто | 7 |
| Рефакторинг | 0 |
| AuditRepo | 0 |
| **Всего открыто (матрица)** | **21** |

Current architecture selection: **none**. Hall #369 remains terminally closed and historical/frozen safety authority, not a current Product lane.

## Explicitly outside this matrix

- Production Cloudflare/D1 secret values and deployment-console state are external evidence boundaries. Source-side authority is merged, while `TLP-COMM-ABUSE-001` deliberately remains active until `/health` readiness and live adversarial behavior are directly proved.
- Current canonical poet portrait origin is not inferred; future portrait provenance is owned by the authoring release contract while Product #270 owns longform visual provenance.
- Current sampled published essay image blocks explicitly classify `kind`; missing-kind→archive remains fail-closed authoring/audit hardening, not a current mislabel claim.
- Community form labels/help, RatingStars keyboard radiogroup semantics, shared external-link hygiene, Breadcrumb current semantics, ArticleImage dialog ownership and TrackReleaseCard interactive nesting were rechecked as correct; do not reopen them.
- No current stored-comment raw-HTML/XSS path was established in inspected rendering; React renders comment text as escaped string content.
- No current future-dated published release, current master-replacement corruption witness, or current onClick-only MagneticButton usage was established.
- `AudioPlayerProvider` sits above lower ErrorBoundaries, but no normal current provider-level render throw witness was established; topology alone is not promoted.
- Legacy redirect finding is source/platform-contract confirmed, not direct observation of every live custom-domain response.

## Lifecycle rule

`VERIFY → one root cause → one owner → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → remove from this matrix.`

A row leaves this file when closed, absorbed, invalid, stale, parked or converted into an owner decision. Durable evidence stays in the closure ledger, system themes, verification report or archive.
