# Active Bug Matrix — The Legendary Poet

**Role:** current verified engineering work only.  
**Owner of current source truth:** `FedorMilovanov/TheLegendaryPoet`.  
**Historical matrix:** `../archive/superseded/MASTER_BUG_MATRIX_2026-08-05.md`.  
**Consolidation evidence:** `../verification/2026-08-07-matrix-consolidation/REPORT.md`.  
**Latest current verification:** `../reverify/REVERIFY_81b98ca_2026-09-10_rating-method-closure.md`.  
**Closure history:** `CLOSURE_LEDGER.md`.  
**Latest integrity audit:** `../verification/2026-09-06-ssot-matrix-integrity-audit/REPORT.md`.  
**Latest full-row currency check:** `../reverify/REVERIFY_cf78d58_2026-09-08_active-row-currency.md` — the prior 18-row surface was rechecked against the exact Product source promoted by Hall #466 and then bound to resulting `main@cf78d58f0bef479e77a0265dd14111bc7d0c44db` by identical tested/resulting tree identity. `TLP-RATING-URLSTATE-001` and `TLP-AUDIO-COMPLETION-001` were retired there. The subsequent bounded Product #468 transaction changed only the reduced-motion root and closed `TLP-A11Y-MOTION-001`; Product #470 then changed only the reading-progress root and closed `TLP-READING-PROGRESS-001`; Product #472 changed only the bounded HOME-media root and closed `TLP-HOME-MEDIA-PERF-001`; Product #476 changed only the bounded secondary-data containment root and closed `TLP-SECONDARY-DATA-001`; Product #479 changed only the bounded rating-source authority root and closed `TLP-RATING-SOURCE-001`; Product #481 changed only the bounded authoring identity/registry/portrait release-contract root and closed `TLP-AUTHORING-ID-001`; Product #483 changed only the bounded audio-session persistence/convergence root and closed `TLP-AUDIO-SESSION-001`; Product #485 plus residual #487 then closed the bounded canonical Search inventory/deep-link/text-authority root `TLP-SEARCH-001`, each Product transaction with tested=resulting tree proof. Product #489 then closed the bounded reader rating-methodology/sample-size root `TLP-RATING-METHOD-001`, also with tested=resulting tree proof. The remaining 7 roots are not reclassified by these bounded waves.

This file is intentionally short. Closed, absorbed, stale, invalid and superseded findings do not remain here merely to preserve history.

## ✅ ЗАКРЫТО (0)

No closed row is retained in this matrix. Solved roots leave the active surface in the same wave that closes them; their durable provenance lives in `CLOSURE_LEDGER.md`, `SYSTEM_THEMES.md` and the verification packages.

Most recently retired from here: `TLP-RATING-METHOD-001` (Product #489, verification 2026-09-10), `TLP-SEARCH-001` (Product #485 + residual #487, verification 2026-09-10), `TLP-AUDIO-SESSION-001` (Product #483, verification 2026-09-10), `TLP-AUTHORING-ID-001` (Product #481, verification 2026-09-10), `TLP-RATING-SOURCE-001` (Product #479, verification 2026-09-10), `TLP-SECONDARY-DATA-001` (Product #476, verification 2026-09-09), `TLP-HOME-MEDIA-PERF-001` (Product #472, verification 2026-09-09), `TLP-READING-PROGRESS-001` (Product #470, verification 2026-09-09), `TLP-A11Y-MOTION-001` (Product #468, verification 2026-09-08), `TLP-RATING-URLSTATE-001` (Product #438, verification 2026-09-08), `TLP-AUDIO-COMPLETION-001` (Product #439, verification 2026-09-08), `TLP-A11Y-STATUS-001` (Product #437, verification 2026-09-06), `TLP-SHELL-NOISE-001` (Product #435, verification 2026-09-06), `TLP-AUDIO-RELEASE-001` (Product #433, verification 2026-09-06), `TLP-THEME-001` and `TLP-A11Y-CONTRAST-001` (Product #426, ledger entry 2026-08-20), and `TLP-READER-TEXT-001` (Product #427, ledger entry 2026-08-24).

## 🟠 P1 — ОТКРЫТО (1)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-ABUSE-001` | `SOURCE-REPAIRED / LIVE-PROOF-PENDING / PUBLIC-INTEGRITY / P1` | Product #420 merged the trusted Cloudflare Worker/D1 authority boundary and Product #422 merged the reconciled client/runtime contract. Source/build gates include fail-closed target authority, signed anonymous actors, network-abuse hashing/budgets and Worker bundle validation. **Reachability condition (live witness 2026-09-06 at Product `57353dc`):** `/ratings` renders `Сейчас показаны данные этого браузера; общий backend не подключён`, which is emitted only when `remoteEnabled` is `false`, so the public abuse surface is unreachable on the deployed build and this row is the release gate that binds when the shared backend is enabled — not a claim of a currently exploitable live exposure. **Terminal production evidence is still absent:** source inspection and dry-run do not prove that the intended D1 schema, required secrets, Turnstile policy, Worker deployment, public client activation and adversarial behavior are live. Closure boundary: `../verification/2026-08-20-community-reconciliation-closure/REPORT.md`; current source currency: `../reverify/REVERIFY_cf78d58_2026-09-08_active-row-currency.md`. | Deploy and activate the intended Worker + D1 contour; prove `/health` reports ready database/target/writes authority and run live adversarial concurrency, duplicate/idempotency, target-rejection and rotated-identity checks without mandatory registration. |

## 🟡 P2 — ОТКРЫТО (5)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-A11Y-RUNTIME-001` | `CONFIRMED-CURRENT / SYSTEMIC / FOCUS-NAV-SEMANTICS / P2` | Product #460 repaired Command Palette Enter ownership and strengthened lazy deep-link restoration, but the systemic root remains: hidden/fixed chrome, visible audio seek focus, collection-mutation handoff, citation destination focus and environment-aware overlay ownership still lack one interaction authority. | One nav/focus/dialog/hash/hidden-chrome/collection-mutation contract, visible seek focus, stable focus handoffs, citation destination ownership and environment-aware overlay stacking with Chromium + WebKit proof. |
| `TLP-DISCOVERY-001` | `CONFIRMED-CURRENT / SYSTEMIC / MACHINE-METADATA-OWNERSHIP / P2` | Sitemap/OG/change facts drift; IndexNow still submits the whole canonical inventory after each successful deploy; static 404 and hydrated/error head states have incompatible canonical/OG/schema ownership. | One route/change metadata state machine for ready/noindex/not-found/loading/error/redirect states deriving sitemap/prerender/runtime/IndexNow with parity/delta proof. |
| `TLP-AUDIT-004` | `CONFIRMED-CURRENT / AUDIT-HARNESS / FALSE-GREEN / P2` | Exact outcome coverage has improved materially (#435 shell singleton, #437 live status, #438 URL state, #439 native completion, #460 command/deep-link/blocked-storage consent, #468 computed reduced-motion behavior, #470 article-bounded reading progress, #472 browser-owned HOME media lifecycle/budgets, #476 secondary-data failure containment, #479 reader-vs-editorial rating-source authority, #481 authoring identity/registry/portrait release authority, #483 conflict-safe audio-session convergence, #485/#487 canonical Search inventory/deep-link/text authority), but proxy/preview gaps remain across consent revocation, analytics lifecycle, redirects/discovery and systemic focus. | Replace remaining proxy checks with exact user/release outcomes, including UI-driven consent revoke, non-text contrast, Unicode/comment whitespace fidelity and release/hosting behavior where source-only checks can false-green. |
| `TLP-ANALYTICS-CONSENT-001` | `CONFIRMED-CURRENT / PRIVACY-CONSENT / STATE-AUTHORITY / P2` | #460 makes granted/denied consent truthful in the current tab even when localStorage is blocked. The remaining root is still current: consent does not converge across tabs, later deny has no active-provider revocation after analytics start, and normal UI exposes the choice only while unset; PrivacyPage has no reopenable in-app editor. | Browser-wide observable consent, persistent/reopenable reader control, authoritative provider revoke/enable semantics and complete UI-driven grant→deny→re-grant regression. |
| `TLP-ROUTE-REDIRECT-001` | `CONFIRMED-CURRENT / HOSTING-CONTRACT / LEGACY-ROUTES / P2` | Measured live 2026-08-19: all 5 declared aliases answer HTTP 404; current source still owns those aliases through client-side `<Navigate>`. The 404 body boots the SPA so humans can eventually reach the target, while crawlers see 404 + noindex,follow. `vercel.json` remains a non-GitHub-Pages rewrite config. | Real host redirects or materialized alias documents; test built/static-host initial responses and final canonical semantics; retire inert hosting configs or document why they stay. |

## 🟢 P3 — ОТКРЫТО (1)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-ANALYTICS-ROUTE-001` | `CONFIRMED-CURRENT / ANALYTICS-DATA-QUALITY / ROUTE-LIFECYCLE / P3` | `AnalyticsRouteTracker` still keys page-view emission on both `location.pathname` and `location.search` and emits pathname+search; same-route query/filter mutations remain page-view authority and emission is not bound to settled semantic route metadata. | Emit from settled semantic route navigation; classify same-route search/filter state intentionally and prevent per-keystroke page-view series. |

## Summary

| Категория | Количество |
|---|---:|
| Закрыто (fixed) | 0 |
| **P0 открыто** | **0** |
| P1 открыто | 1 |
| P2 открыто | 5 |
| P3 открыто | 1 |
| Рефакторинг | 0 |
| AuditRepo | 0 |
| **Всего открыто (матрица)** | **7** |

Current architecture selection: **none**. Historical Hall #369 remains terminally closed. Product #465/#466 is now a separately completed bounded production-web transaction; documentary rights, human offline approval and full-museum scale-out remain outside the active engineering matrix unless a new verified software root is established.

## Explicitly outside this matrix

- Production Cloudflare/D1 secret values and deployment-console state are external evidence boundaries. Source-side authority is merged, while `TLP-COMM-ABUSE-001` deliberately remains active until `/health` readiness and live adversarial behavior are directly proved.
- Current canonical poet portrait origin is not inferred; future portrait provenance is owned by the authoring release contract while Product #270 owns longform visual provenance.
- Current sampled published essay image blocks explicitly classify `kind`; missing-kind→archive remains fail-closed authoring/audit hardening, not a current mislabel claim.
- Community form labels/help, RatingStars keyboard radiogroup semantics, shared external-link hygiene, Breadcrumb current semantics, ArticleImage dialog ownership and TrackReleaseCard interactive nesting were rechecked as correct; do not reopen them.
- No current stored-comment raw-HTML/XSS path was established in inspected rendering; React renders comment text as escaped string content.
- No current future-dated published release, current master-replacement corruption witness, or current onClick-only MagneticButton usage was established.
- `AudioPlayerProvider` sits above lower ErrorBoundaries, but no normal current provider-level render throw witness was established; topology alone is not promoted.
- Legacy redirect finding is source/platform-contract confirmed; terminal closure still requires the initial static-host response contract, not merely client-side navigation behavior.
- Hall documentary rights, human `offlineVisualApproval` and full-museum scale-out are owner/legal/product-roadmap boundaries and are not silently converted into engineering bugs here.

## Lifecycle rule

`VERIFY → one root cause → one owner → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → remove from this matrix.`

A row leaves this file when closed, absorbed, invalid, stale, parked or converted into an owner decision. Durable evidence stays in the closure ledger, system themes, verification report or archive.