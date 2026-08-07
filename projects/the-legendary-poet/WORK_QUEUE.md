# Optional Work Queue — the-legendary-poet

Эта очередь показывает owner-selected направления. Перед любой source mutation нужно заново проверить актуальный source owner, open PRs и применимое evidence.

## Current selection — fresh current-head verification

Owner-selected operating order:

`VERIFY → one root cause → one owner/agent → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → next bug`.

Current verified engineering matrix: [`verified/MASTER_BUG_MATRIX.md`](verified/MASTER_BUG_MATRIX.md).

Current verified engineering rows: **0**.

### 1. New bug hunting — only from current-head evidence

Run a fresh current-head verification pass instead of replaying the historical matrix. Prioritize surfaces where user-visible regressions can escape static contracts:

- longform article layout and responsive geometry;
- popovers/tooltips/lightbox/focus/scroll ownership;
- Android Chrome, desktop WebKit and process-isolated iPhone Safari;
- route transitions, NotFound and restoration;
- archive/community failure states;
- audio/session chrome;
- production build/budget regressions.

A new finding enters `verified/MASTER_BUG_MATRIX.md` only after current-head reproduction and root-cause evidence. Duplicate symptoms are clustered under one root cause.

Do not reopen #335, #340, W0–W7, the native-scroll repair or canonical poet authority merely because a fresh audit touches adjacent code.

## Closed current-scope families

### TLP-DEPS-001 / Product #335 — dead Lenis install dependency

Closed by Product PR #348, exact tested head `43527c7a7932f17fcba599ff4df270c243ba69a6`, squash merge `3a8d5fe3a6f729e8a583a3a8c7e6881ec31b5214`.

- The residual direct `lenis` dependency and lock entry were removed after runtime scrolling had already returned to native browser ownership.
- The repair stayed bounded to package-manager ownership; it did not reopen scroll runtime, routes, validators or content.
- Exact-head Product evidence recorded CI, project contracts, route audit, brand/content publication gates and Manual Browser QA 4/4.
- Current Product `main` after the concurrent essay-performance merge preserves both changes: new browser-data scripts are present while Lenis remains absent.
- Detailed AuditRepo evidence: `verification/2026-08-07-lenis-dependency-closure/REPORT.md`.

Future scroll or dependency findings require independent current reproduction; this closure is not a blanket claim that no future scrolling or package defect can exist.

### TLP-AUDIT-003 / Product #340 — semantic runtime guard hardening

Closed by Product PR #345, exact tested head `c7b1c9e8dfe26028d1d52852f3e1db20ba2b6407`, squash merge `b6f731263211208a31de1e36ed7830d7a46ffa87`.

- High-risk app-shell/document-scroll guards now use a bounded TypeScript-AST semantic helper instead of relying on exact source spelling for the selected contracts.
- Mutation coverage accepts equivalent passive/focus syntax and rejects alternate wheel interception, `preventDefault`, global-scroller ownership and unsafe option values.
- Pre-merge review caught and repaired two harness defects: object-spread precedence now follows JavaScript last-write-wins semantics, and const resolution now respects lexical shadowing.
- Product runtime behavior was not changed to satisfy the validator.
- Exact-head evidence: full CI/check/build/typecheck/SEO, Project contracts, route integrity, brand audit and Manual Browser QA 4/4 across Chromium/Android, desktop WebKit and fresh-process iPhone Safari.

Future concrete harness defects are reverified independently; this closure does not convert the system theme into a promise that no future validator bug can exist.

### W0–W7 architecture/runtime

Closed and protected by permanent regression witnesses. Historical rows are preserved under `archive/superseded/` and do not remain active backlog.

### Mayakovsky media candidate family

Closed for current Product scope:

- exact originals and hashes: `30/30`;
- accepted active: `5` — C03, C08, C10, C11, C16;
- verified reserve: `1` — C15;
- explicitly excluded: `24`;
- unresolved: `0`;
- source issue #77: closed as completed;
- source merge: `dd2df7be196d81d5212b43a08616f782af2fecf6`.

Previous C01–C07 reports remain historical evidence, not an automatic backlog.

## Conditional candidate lanes

### Materially new media evidence

Reopen one bounded candidate only for materially new evidence such as:

- primary museum/archive exact-object record;
- inspectable early-publication page;
- explicit permission or licence;
- jurisdiction-specific rights evidence;
- changed editorial need for reserve C15 or an excluded candidate.

A Commons metadata change, derivative mirror, visual resemblance or repetition of an old caption is not enough.

### Release-specific live witness

Use only for a significant release, DNS/hosting change or concrete production incident when live evidence is needed for a decision. It is not continuous monitoring and not a standing requirement after every commit.

## Editorial / research boundary

Open source issues for archive acquisition, documentary research, long-form authoring, visual-rights review and myth ledgers remain legitimate work but are not engineering bug rows by default. They should be selected as editorial/research projects on their own evidence and publication gates.

## Adding a lane

A useful entry needs:

- concrete question;
- evidence source;
- expected user/system benefit;
- first narrow verification;
- one current owner;
- possible outcomes including repair, park, accepted-risk, owner-decision or no action.

Do not copy a global source HEAD, every workflow run or the historical matrix into this file.
