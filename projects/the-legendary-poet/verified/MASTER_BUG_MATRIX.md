# Active Bug Matrix — The Legendary Poet

**Role:** current verified engineering work only.  
**Owner of current source truth:** `FedorMilovanov/TheLegendaryPoet`.  
**Historical matrix:** `../archive/superseded/MASTER_BUG_MATRIX_2026-08-05.md`.  
**Consolidation evidence:** `../verification/2026-08-07-matrix-consolidation/REPORT.md`.  
**Latest current verification:** `../verification/2026-08-12-cross-surface-runtime-authority-current/REPORT.md`.

This file is intentionally short. Closed, absorbed, stale, invalid and superseded findings do not remain here merely to preserve history. The section/count shape below is retained because AuditRepo's shared validator treats `verified/MASTER_BUG_MATRIX.md` as a machine-readable counter surface.

## ✅ ЗАКРЫТО (0)

Closed history is owned by `CLOSURE_LEDGER.md`, `SYSTEM_THEMES.md`, verification packages and `archive/`; it is not duplicated into the active matrix.

## 🟠 P1 — ОТКРЫТО (1)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-ABUSE-001` | `CONFIRMED-CURRENT / PUBLIC-INTEGRITY / P1` | `../verification/2026-08-11-community-write-integrity-current/REPORT.md`; `../verification/2026-08-12-cross-surface-runtime-authority-current/REPORT.md`; Product `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`: caller-controlled `voter_id` remains the public uniqueness/rate-limit authority, fresh tabs can bootstrap different first-use UUIDs, and public RPCs validate target syntax rather than canonical published target membership | Put community writes behind a trusted server-side boundary that does not trust caller-rotatable UUIDs: server-verified challenge/session/throttle plus canonical-target validation, preserve DB uniqueness as defense in depth, and add rotated-UUID burst plus simultaneous-clean-tab identity regressions without requiring account registration. |

## 🟡 P2 — ОТКРЫТО (11)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-DELIVERY-001` | `CONFIRMED-CURRENT / DELIVERY-RECONCILIATION / SYSTEMIC / P2` | `../verification/2026-08-11-community-delivery-ranking-a11y-current/REPORT.md`; `../verification/2026-08-11-community-reconciliation-readstate-current/REPORT.md`; `../verification/2026-08-12-cross-surface-runtime-authority-current/REPORT.md`; outbox stops on first failed RPC, lacks complete retry/replay ownership, can admit a client-valid/server-invalid Unicode comment, concurrent tabs can duplicate-send/rewrite one persisted envelope, exact comment idempotency is checked after server rate-limit, successful ACK cleanup can fall back to memory while old storage survives, and remote mutation invalidation is not cross-document | Implement typed transient/permanent delivery outcomes, one client/server validation contract, non-blocking permanent-failure handling, bounded retry/backoff/startup replay, aligned rate-limit/idempotency ordering, honest local/queued/published acknowledgement, authoritative post-success local retirement/moderation reconciliation, lossless two-tab mutation/flush arbitration, durable ACK cleanup and cross-tab remote invalidation. Add Unicode-poison, duplicate-flush, storage-fails-at-ACK, hidden-after-publish and simultaneous-offline-two-tab regressions. `TLP-COMM-ACK-001` and delivery/reconciliation symptoms are absorbed here. |
| `TLP-COMM-ORDER-001` | `CONFIRMED-CURRENT / DATA-PRESENTATION / P2` | `../verification/2026-08-11-community-delivery-ranking-a11y-current/REPORT.md`; backend pages newest-first while default UI `Полезные` and kind filters sort/filter only the already-loaded subset | Make helpful ordering and active kind filtering corpus-truthful with server-supported stable sort/filter pagination, or explicitly scope the UI to loaded rows and provide direct filtered load-more; add an older-high-helpful multi-page browser regression. |
| `TLP-COMM-A11Y-001` | `CONFIRMED-CURRENT / ACCESSIBILITY / P2` | `../verification/2026-08-11-community-delivery-ranking-a11y-current/REPORT.md`; rating/comment/helpful result messages use `ActionToast` without live-region/status semantics; comment sort selection is visual-only | Give mutation results a reusable live-status owner, expose sort selection programmatically, preserve native keyboard behavior, and add Chromium + WebKit accessibility regression proof for all three mutation families and sort state. |
| `TLP-COMM-READSTATE-001` | `CONFIRMED-CURRENT / READ-STATE-TRUTH / P2` | `../verification/2026-08-11-community-reconciliation-readstate-current/REPORT.md`; `CommunityPanel` can render an unavailable first comment page as `Комментариев пока нет`, while `PoetCommunitySummary` maps unresolved/failed summary reads to real-looking `0 оценок / 0 мнений` | Give all community consumers explicit loading/error/ready-empty/ready-data semantics; never coerce unresolved or failed remote reads to zero/empty; preserve loaded pages on pagination failure and add Chromium + WebKit cases for summary failure, initial-comments failure, partial aggregate/comments failure and genuine ready-empty. |
| `TLP-COMM-TARGET-001` | `CONFIRMED-CURRENT / DATA-INTEGRITY / TARGET-STATE / P2` | `../verification/2026-08-12-cross-surface-runtime-authority-current/REPORT.md`; page-level poet/article/track `CommunityPanel` editors are not keyed by `targetType:targetId`; dirty rating/comment state can survive natural SPA A→B detail navigation while mutation closures already point at target B | Make target identity explicit editor ownership: key/reset/prompt state on `targetType:targetId` change and add View-Transitions browser regressions for poet→poet, essay→essay and track→track dirty drafts so A's unsent data can never be submitted to B. |
| `TLP-THEME-001` | `CONFIRMED-CURRENT / SYSTEMIC / THEME-OWNERSHIP / P2` | `../verification/2026-08-12-cross-surface-runtime-authority-current/REPORT.md`; light mode globally recolors common white text while only whitelisting selected dark surface literals, leaving current `/ratings`, Command Palette, audio/community/error/consent custom dark surfaces capable of dark-on-dark output; persisted theme also applies after first paint and document chrome metadata remains dark-owned | Replace literal-color conversion with semantic document/surface/text tokens, apply persisted theme before first paint, synchronize relevant browser metadata and certify representative routes/overlays/audio/community surfaces in light mode with computed contrast assertions. |
| `TLP-A11Y-RUNTIME-001` | `CONFIRMED-CURRENT / SYSTEMIC / FOCUS-NAV-SEMANTICS / P2` | `../verification/2026-08-12-cross-surface-runtime-authority-current/REPORT.md`; Command Palette has competing DOM-focus/`activeIndex` Enter authority, hidden reading chrome remains tabbable offscreen, `/essays/:slug` loses the persistent `Статьи` current state, same-path command navigation can lose focus, immersive Next/Previous replaces focused keyed dialog DOM, and policy pages nest a second `<main>` inside the app-shell main | Establish one interaction semantics contract: canonical section mapping + `aria-current`, focus-aware/inert hidden chrome, one Command Palette keyboard/listbox model that never hijacks ordinary controls, explicit same-path focus handoff, focus recovery after keyed modal replacement, one main landmark, and Chromium + WebKit keyboard regressions. |
| `TLP-DISCOVERY-001` | `CONFIRMED-CURRENT / SYSTEMIC / MACHINE-METADATA-OWNERSHIP / P2` | `../verification/2026-08-12-cross-surface-runtime-authority-current/REPORT.md`; sitemap poet lastmod lacks an own poet-record clock and can both miss real poet edits and advance broad routes on unrelated child changes; prerender removes root `1200x630` OG dimensions for route artwork while SPA `useSeo()` leaves those dimensions behind | Define one route metadata authority for modification clocks and social-image facts; derive sitemap/prerender/runtime from it and add direct-vs-SPA canonical/robots/OG parity plus truthful lastmod regressions. |
| `TLP-READER-TEXT-001` | `CONFIRMED-CURRENT / ACCESSIBILITY / SEMANTIC-TEXT / P2` | `../verification/2026-08-12-cross-surface-runtime-authority-current/REPORT.md`; `InteractivePoemText` uses sibling animated word spans with CSS-only spacing as the sole semantic text layer and marks the core poem container `select-none`, so DOM text does not preserve canonical word spaces and selection-based reader tools have no canonical text owner | Separate canonical poem text semantics from animated presentation, preserve exact source text for selection/copy/assistive extraction, hide presentation-only spans appropriately, and add DOM text/copy plus accessibility-engine browser regression proof. |
| `TLP-AUDIT-004` | `CONFIRMED-CURRENT / AUDIT-HARNESS / FALSE-GREEN / P2` | `../verification/2026-08-12-cross-surface-runtime-authority-current/REPORT.md`; current QA misses the current ErrorBoundary copy, certifies routes only in dark mode, self-scrolls or under-specifies hash/focus outcomes, calls only sanitizer-malformed state `poison-safe`, and validates prerender presence without SPA head parity | Replace stale/proxy checks with exact current user outcomes: semantic ErrorBoundary detection, light-theme contrast coverage, app-owned hash viewport/focus proof, permanent server-rejection queue proof and direct-vs-SPA SEO parity. Do not reopen historical symptom IDs; fix the current class-level guard. |
| `TLP-AUTHORING-ID-001` | `CONFIRMED-CURRENT / AUTHORING-RELEASE-CONTRACT / P2` | `../verification/2026-08-12-cross-surface-runtime-authority-current/REPORT.md`; documented `new-poet` scaffolding can derive Cyrillic/noncanonical ids and asset paths that render through authoring/router layers but violate the ASCII community target contract, after which UI misdiagnoses the failure as blocked browser storage | Make poet/poem/route/community/asset identity one validated release contract with deterministic ASCII-kebab transliteration, align scaffold and guide output, report the real validation cause, and add a Cyrillic-author fixture that passes the full identity/asset/community preflight. |

## 🟢 P3 — ОТКРЫТО (0)

No verified-current P3 engineering rows.

## Summary

| Категория | Количество |
|---|---:|
| Закрыто (fixed) | 0 |
| **P0 открыто** | **0** |
| P1 открыто | 1 |
| P2 открыто | 11 |
| P3 открыто | 0 |
| Рефакторинг | 0 |
| AuditRepo | 0 |
| **Всего открыто (матрица)** | **12** |

Current architecture selection: **none**. Hall #369 is terminally closed and remains historical/frozen safety authority, not a current Product lane or defect row; see `../WORK_QUEUE.md` and its terminal Hall closure evidence.

## Explicitly outside this matrix

- Production Supabase variable values are deployment-side state and were not readable from repository source during the 2026-08-11/12 audit. The deploy workflow injects them optionally and the UI exposes local-vs-shared mode; inability to prove their current values is an evidence boundary, not an additional active defect row.
- Privacy wording around the pseudonymous community browser UUID/local queue, reader-visible article update labels and broader Command Palette coverage remain product/editorial transparency or polish unless a stronger required contract is selected; they are not additional engineering rows in this wave.
- Research/source-acquisition/editorial issues such as long-form authoring, archive acquisition, visual-rights review and myth ledgers are not engineering bugs merely because they remain open in the Product issue tracker.
- The Mayakovsky C01–C30 media family is closed for the current Product scope: 5 active, 1 verified reserve, 24 terminal exclusions, 0 unresolved.
- W0–W7 architecture/runtime waves, W6 ref retirement, native-scroll repair, canonical poet authority, historical semantic audit-harness hardening, Lenis install-dependency cleanup, browser-payload resilience, deterministic audio cross-tab arbitration, precision-safe audio logical ordering and personal-archive cross-tab convergence are historical closure evidence, not current backlog. New `TLP-AUDIT-004` is based on distinct current false-green witnesses and does not resurrect the old symptom rows.
- W3 community-scaling remains closed. The active community rows concern write authority, delivery/reconciliation, corpus ordering, read-state truth, target editor ownership and accessibility semantics rather than the closed target-read/pagination/persistence-scaling root.

## Lifecycle rule

`VERIFY → one root cause → one owner → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → remove from this matrix.`

A row leaves this file when it is closed, absorbed, invalid, stale, parked or converted into an owner decision. Durable evidence stays in the closure ledger, system themes, verification report or archive.
