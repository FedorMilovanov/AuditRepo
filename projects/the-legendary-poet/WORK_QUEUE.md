# Optional Work Queue — the-legendary-poet

Эта очередь показывает owner-selected направления. Перед любой source mutation нужно заново проверить актуальный source owner, open PRs и применимое evidence.

## Current selection — bug closure marathon

Owner-selected operating order:

`VERIFY → one root cause → one owner/agent → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → next bug`.

Current verified engineering matrix: [`verified/MASTER_BUG_MATRIX.md`](verified/MASTER_BUG_MATRIX.md).

### 1. Product #335 / TLP-DEPS-001 — remove dead Lenis dependency

- Status: `verified-current / repair-ready / P3`.
- Scope: exactly `package.json` + `package-lock.json` unless new evidence disproves the bounded graph.
- Important prior verification: the naive npm 10.9.2 lock-only operation caused unrelated metadata churn and was rejected; the accepted repair must remain structure-preserving and minimal.
- Required closure: deterministic manifest/lock diff, package install validation, native-scroll/browser runtime guards, full check/build, exact-head PR evidence, merge, then AuditRepo closure and row removal.
- This does **not** reopen the closed P1 native-scroll defect.

### 2. Product #340 / TLP-AUDIT-003 — harden literal-source runtime guards

- Status: `verified-current candidate / selected-for-bounded-repair / P3`.
- Scope: highest-risk app-shell/document-scroll source-literal guards only; no broad validator rewrite.
- Repair direction: behavior tests where executable; bounded AST/semantic/structural evidence where source structure is necessary; mutation cases must show equivalent syntax passes and materially forbidden behavior fails.
- Required closure: app-shell, interaction runtime, browser runtime, full check/build and exact-head PR evidence; Browser QA only if implementation touches runtime behavior rather than test harness alone.
- Do not create a Product architecture lane unless implementation proves architecture ownership is actually required.

### 3. New bug hunting — only after current rows close

Run a fresh current-head verification pass instead of replaying the historical matrix. Prioritize surfaces where user-visible regressions can escape static contracts:

- longform article layout and responsive geometry;
- popovers/tooltips/lightbox/focus/scroll ownership;
- Android Chrome, desktop WebKit and process-isolated iPhone Safari;
- route transitions, NotFound and restoration;
- archive/community failure states;
- audio/session chrome;
- production build/budget regressions.

A new finding enters `verified/MASTER_BUG_MATRIX.md` only after current-head reproduction and root-cause evidence. Duplicate symptoms are clustered under one root cause.

## Closed current-scope families

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
