# Optional Work Queue — the-legendary-poet

Эта очередь показывает owner-selected направления. Перед любой source mutation нужно заново проверить актуальный source owner, open PRs и применимое evidence.

## Current selection — TLP-AUDIO-001 / Product #356

Owner-selected operating order:

`VERIFY → one root cause → one owner/agent → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → next bug`.

Current verified engineering matrix: [`verified/MASTER_BUG_MATRIX.md`](verified/MASTER_BUG_MATRIX.md).

Current verified engineering rows: **1** — one P3 concurrency root.

### 1. Repair Product #356 — deterministic cross-tab audio arbitration

Current Product anchor: `main@67d614bc186b52c408ad6cef4c84cf57d4e78a45`.

Bounded repair target:

- preserve the persistent one-audio-engine-per-tab design;
- preserve BroadcastChannel + storage fallback;
- give `playing` claims a deterministic total order so simultaneous starts leave exactly one winner rather than allowing both tabs to pause;
- use the existing claim metadata (`timestamp`, `instanceId`) or an equivalent explicit claim structure rather than sleeps/debounces;
- make newer claims beat stale claims and use a stable tie-break for equal timestamps;
- keep duplicate/self delivery idempotent;
- add deterministic arbitration tests and, where practical, a two-page browser witness that proves both transports use the same rule.

Do not mix this lane with music catalog editorial changes, audio assets, player visual redesign, or unrelated persistence cleanup.

After Product repair merges and the resulting current main is reverified, remove `TLP-AUDIO-001` from the active matrix and return this queue to fresh current-head bug hunting.

## Closed current-scope families

### TLP-RESILIENCE-001 / Product #351 — browser essay payload recovery

Closed by Product PR #353, exact tested head `c72ca2bd54b9a3ed18b116e2530e17691517054d`, squash merge `67d614bc186b52c408ad6cef4c84cf57d4e78a45`.

- Rejected browser payloads no longer cause permanent same-document poisoning or automatic same-visit retry loops: retry eligibility is bound to a genuinely new React Router navigation key.
- Home localizes catalog failure to the research-count statistic while Hero/static content remains available.
- Articles catalog acceptance passed 18/18 across Chromium/Android/iPhone and proves no automatic request #2 before navigation, later SPA recovery, successful payload caching and `documentRequests === 1`.
- Full Product CI/build/route and Manual Browser QA 4/4 passed on the exact tested head.
- The old one-off WebKit reveal flake did not reproduce and no timing workaround was added.
- Detailed evidence: `verification/2026-08-07-essay-browser-resilience/REPORT.md` and `verification/2026-08-07-essay-browser-resilience/CLOSURE.md`.

Future payload failures require independent current reproduction; this closure does not assert that every future network or Suspense defect is impossible.

### TLP-DEPS-001 / Product #335 — dead Lenis install dependency

Closed by Product PR #348, exact tested head `43527c7a7932f17fcba599ff4df270c243ba69a6`, squash merge `3a8d5fe3a6f729e8a583a3a8c7e6881ec31b5214`.

- The residual direct `lenis` dependency and lock entry were removed after runtime scrolling had already returned to native browser ownership.
- The repair stayed bounded to package-manager ownership; it did not reopen scroll runtime, routes, validators or content.
- Exact-head Product evidence recorded CI, project contracts, route audit, brand/content publication gates and Manual Browser QA 4/4.
- Current Product source preserves generated browser-data scripts while Lenis remains absent.
- Detailed AuditRepo evidence: `verification/2026-08-07-lenis-dependency-closure/REPORT.md`.

### TLP-AUDIT-003 / Product #340 — semantic runtime guard hardening

Closed by Product PR #345, exact tested head `c7b1c9e8dfe26028d1d52852f3e1db20ba2b6407`, squash merge `b6f731263211208a31de1e36ed7830d7a46ffa87`.

Future concrete harness defects are reverified independently.

### W0–W7 architecture/runtime

Closed and protected by permanent regression witnesses. Historical rows are preserved under `archive/superseded/` and do not remain active backlog.

### Mayakovsky media candidate family

Closed for current Product scope: 5 active, 1 verified reserve, 24 terminal exclusions, 0 unresolved.

## Conditional candidate lanes

### Fresh current-head verification

Resume only after the selected Product #356 lifecycle closes. New findings require independent current-head reproduction and root-cause evidence; do not replay historical rows.

### Materially new media evidence

Reopen one bounded candidate only for materially new evidence such as a primary exact-object record, inspectable early-publication page, explicit permission/licence, jurisdiction-specific rights evidence or changed editorial need.

### Release-specific live witness

Use only for a significant release, DNS/hosting change or concrete production incident when live evidence is needed for a decision.

## Editorial / research boundary

Open source issues for archive acquisition, documentary research, long-form authoring, visual-rights review and myth ledgers remain legitimate work but are not engineering bug rows by default.

## Adding a lane

A useful entry needs concrete question, evidence source, expected benefit, first narrow verification, one owner and explicit possible dispositions. Do not copy the historical matrix into this file.