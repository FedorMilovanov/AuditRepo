# SSOT / current-backlog integrity audit — the-legendary-poet

Date: 2026-09-06
Scope: AuditRepo control plane for `projects/the-legendary-poet/**` only.
Product mutation: **none**.

## Anchors

- AuditRepo base: `main` `29450bf8dc3baa69289be770e3fbb64a1728dcee`.
- Product source verified live during this audit: `FedorMilovanov/TheLegendaryPoet@main` `57353dcee63123e8e2a86fa83bc964ffa5f29303` (2026-09-05).
- Open Product PRs at audit time: `#430` (research — Presidential Library locator) and `#425` (editorial — Benislavskaya longform). Neither owns an active engineering root.
- Open Product issues at audit time: `#200` (editorial article request).
- Open AuditRepo PRs at audit time: `#342`, `#341`, `#337`, `#334`, `#328` — all scoped to `gb-is-my-strength`. **No concurrent owner overlap with this project.**

Source facts were read from the source repository, not from AuditRepo prose.

## Method

1. Read the repository rules (`AUDITREPO_OPERATING_MODEL.md`, `CLEANUP_RETENTION_POLICY.md`, `CONCURRENT_EDIT_PROTOCOL.md`) and the project authorities named by `DOC_MAP.md`.
2. Reconciled MASTER headings, the summary table and the total against the actual rows.
3. Traced every closed root printed in MASTER back to a merged Product commit, checked that the merge is an ancestor of current Product `main`, and checked that the closure is recorded in `CLOSURE_LEDGER.md`.
4. Re-checked a representative sample of active rows directly against current Product `main` to separate *current* from *merely historical*.
5. Checked WORK_QUEUE, README, DOC_MAP and SYSTEM_THEMES for duplicated volatile facts and stale pointers.

## Findings

### F1 — MASTER retained a closed-root block (the specific audited question)

MASTER carried `## ✅ ЗАКРЫТО (3)` with `TLP-THEME-001`, `TLP-A11Y-CONTRAST-001` and `TLP-READER-TEXT-001`.

Rule side. `AUDITREPO_OPERATING_MODEL.md` lists `closed-by-fix` under "Не держать в MASTER" and states "Solved or obsolete means removed from MASTER". `CLEANUP_RETENTION_POLICY.md` requires removing `fixed` rows at the end of every wave. MASTER's own lifecycle rule says the same. The block was therefore rule-violating **on its face** — but the instruction was to prove the disposition, not to delete on sight.

Evidence side — all three are genuinely closed by merged Product work that is live on current Product `main`:

| Root | Product PR | Squash merge | Ancestor of `main` `57353dce`? | Permanent guard present on `main` |
|---|---|---|---|---|
| `TLP-THEME-001` | #426 | `9bf116e61f365c413f67278c21229cdee4727c94` | yes (main is 3 commits ahead, 0 behind) | `qa/theme-contrast.spec.mjs` |
| `TLP-A11Y-CONTRAST-001` | #426 | same | yes | `qa/theme-contrast.spec.mjs` |
| `TLP-READER-TEXT-001` | #427 | `96644f9d4f7ba5f1bef8f1ff0d8a8642eb990ad1` | yes (main is 2 commits ahead, 0 behind) | `qa/reader-text.spec.mjs` |

Both closure packages already declared the terminal outcome: `2026-08-20-theme-contrast-closure/REPORT.md` says "Both rows are terminally closed and removed from the active matrix", and `2026-08-24-reader-text-closure/REPORT.md` says `CLOSED-BY-FIX`.

Blocking defect found while proving it. The block's own sentence — "Closed roots are durable in `CLOSURE_LEDGER.md`" — was **false**. The ledger's last entry was `2026-08-19`; it contained no entry for the theme/contrast wave, the reader-text wave, **or** the six community roots closed by Product #422 on 2026-08-20. Removing the block first would have destroyed the only compact record of three closure waves.

Disposition: append the three missing ledger entries **first**, then retire the block. The `ЗАКРЫТО` heading itself is retained at `(0)` with an empty table because `scripts/validate_audit_repo.py` requires that counter to exist for matrices still on the legacy severity schema; migrating TLP to the compact `CURRENT DEFECTS / SYSTEM VERIFICATION LANES` schema would be a documentation transaction far larger than the decision it records.

### F2 — three closure waves were missing from the closure ledger

Independently of F1, `CLOSURE_LEDGER.md` had no entry for:

- 2026-08-20 — six community roots closed by Product #422 (`ccd5f4c614de…`);
- 2026-08-20 — `TLP-THEME-001` / `TLP-A11Y-CONTRAST-001` closed by Product #426;
- 2026-08-24 — `TLP-READER-TEXT-001` closed by Product #427.

Nine closed roots therefore had no compact closure record in the file that DOC_MAP names as their owner. Repaired by append-only entries; no existing entry was rewritten.

### F3 — counts and headings

Internally consistent and left unchanged at 21 open rows:

| Section | Heading | Actual rows | Summary table |
|---|---:|---:|---:|
| P1 | 1 | 1 | 1 |
| P2 | 13 | 13 | 13 |
| P3 | 7 | 7 | 7 |
| Total open | — | 21 | 21 |

The arithmetic also reconciles against the closure chain: 30 (closeout anchor) − 6 (#422) − 2 (#426) − 1 (#427) = 21. Only the closed counter moved, `3 → 0`.

### F4 — the same volatile count was duplicated and stale in two other current-authority files

`CLEANUP_RETENTION_POLICY.md` forbids duplicating one volatile fact across several current-authority files.

- Project `README.md` printed "Текущий счётчик: **24 rows — 1 P1 + 16 P2 + 7 P3**" — a snapshot from before #426/#427, wrong by three rows and by category.
- `DOC_MAP.md` described the audit-marathon closeout as "30 Product roots remain repair-pending" in the present tense, wrong by nine roots.

Both now defer to MASTER instead of restating a number. README's active-root subject list also still advertised theme, contrast and semantic reader text as open; corrected.

### F5 — system themes no longer mapped cleanly onto active roots

All ten themes were marked `absorbed/closed`, while three of them still have current active roots in their territory:

| Theme | Contradicting active root | Correct reading |
|---|---|---|
| `ST-TLP-COMMUNITY-OWNERSHIP` | `TLP-COMM-ABUSE-001` | the persisted/target-state mechanism is closed; production activation of the trusted Worker/D1 boundary is an external evidence boundary |
| `ST-TLP-ROUTE-AUTHORITY` | `TLP-ROUTE-REDIRECT-001`, `TLP-DISCOVERY-001` | the in-repository route contract is closed; the static-host redirect contract and the machine-metadata state machine were never inside that mechanism |
| `ST-TLP-AUDIT-HARNESS` | `TLP-AUDIT-004` | PR #345 closed the *selected* manifestations; the later waves re-established the false-green class independently |

The themes were not reopened — that would falsify closed mechanisms. Each now carries an explicit `Current residual` line, plus a framing rule that `absorbed/closed` closes the named mechanism, not a subject area.

### F6 — a genuine shared mechanism exists but is below the collapse threshold

`TLP-AUDIO-SESSION-001` and `TLP-ANALYTICS-CONSENT-001` share one mechanism: independent `localStorage` owners with mount-time reads and whole-snapshot writes, and no shared cross-tab convergence contract. The third symptom in that class (stored theme preference) was closed by #426.

The operating model collapses symptoms when one mechanism explains **at least three** current symptoms. Two remain, and each carries substantial independent scope (conflict-safe merge/version semantics and data loss for audio; provider revoke/enable semantics and a reopenable reader control for consent). Collapsing them now would hide two distinct terminal outcomes behind one row.

Disposition: recorded as a new `candidate` theme `ST-TLP-BROWSER-STATE-CONVERGENCE` with an explicit promotion trigger. **No MASTER row was merged or removed.**

Also checked and rejected as collapse candidates: the three ratings rows (provenance/scale, statistical method, URL-state authority — three mechanisms in one component, grouped only by file footprint), the three audio rows (persistence, completion semantics, physical release gating) and the three accessibility rows (focus/nav lifecycle, motion policy, status messages).

### F7 — no already-repaired Product work is incorrectly open

Every Product PR merged after the audit-marathon anchor `d59cceccb0c4…` was inspected: `#417`, `#420`, `#422`, `#423`, `#424`, `#426`, `#427`, `#428`, `#429`. The engineering repairs among them (#420, #422, #426, #427) are exactly the ones already reflected in the matrix; `#417`/`#423` are editorial/research, `#424` is a transitive dependency bump, and `#428`/`#429` are stale-ref maintenance. Nothing merged after #427 touches an active row.

### F8 — active rows are current, not merely historical

Eleven of the twenty-one rows were re-verified directly against Product `main` `57353dce`:

| Row | Current witness at `57353dce` |
|---|---|
| `TLP-SHELL-NOISE-001` | `index.html:92` and `src/App.tsx:125` (inside `function SiteLayout()`) both render `.noise-bg`; no singleton assertion exists in `qa/` |
| `TLP-HOME-MEDIA-PERF-001` | `HeroPoetWindow.tsx:123` still `loading="eager"` for all six; the six portrait files still total exactly **880,330 bytes**, matching the 2026-08-12 witness byte-for-byte |
| `TLP-ROUTE-REDIRECT-001` | `route-contract.json` still declares the same 5 aliases; `public/_redirects` is only `/*  /index.html  200` and `vercel.json` only a rewrite — both inert under GitHub Pages |
| `TLP-A11Y-MOTION-001` | reduced-motion blocks in `src/index.css` cover named utilities only; `PoetCard.tsx:41` keeps an unguarded `animate-pulse`, and 18 `animate-pulse`/`animate-spin` usages remain |
| `TLP-AUDIO-COMPLETION-001` | `AudioPlayerProvider.tsx:575` still persists completion at `currentTime / duration >= 0.97` |
| `TLP-RATING-URLSTATE-001` | `RatingsPage.tsx:83-85` still seeds `tag`/`rated`/`query` from `searchParams` in `useState` initialisers (mount-only) |
| `TLP-READING-PROGRESS-001` | `ReadingProgress.tsx:24` still derives progress from `document.documentElement.scrollHeight` |
| `TLP-A11Y-STATUS-001` | `PoetsPage.tsx` has no `role="status"` / `aria-live` |
| `TLP-AUDIO-RELEASE-001` | `validate-audio-assets.ts:82,104,107` still routes a missing master to `warnings` under `allowMissing`; only `errors` exit non-zero |
| `TLP-SECONDARY-DATA-001` | `EssayPage.tsx:26` still resolves the optional essay catalog with `use(...)` at component top level |
| `TLP-DISCOVERY-001` | `submit-indexnow.mjs` still submits the whole `sitemap.xml` URL list per deploy |

No active row was found stale, invalid or historical-only. No row was removed on suspicion.

### F9 — is any owner decision disguised as a confirmed defect?

`TLP-COMM-ABUSE-001` is the only candidate, and the answer is **no — but the row understated its condition**. The row is honestly labelled `SOURCE-REPAIRED / LIVE-PROOF-PENDING`, and two independent authorities (the 2026-08-20 closure report and the 2026-08-19 reverify) explicitly decided it stays open. However the row's evidence column omitted the measured fact that the shipped production build folds `remoteEnabled` to `false`, so the public abuse surface is currently unreachable. Without that clause the row reads as a live exploitable exposure.

Disposition: severity and status unchanged (still P1, still active). The reachability condition and its reverify pointer were added so the row reads as what it is — a release gate that binds when the shared backend is enabled.

No other row converts an owner choice into a defect claim. Where a row offers alternatives (`retire the inert hosting configs or document why they stay`; `align the semantics or rename the 97% heuristic`), the underlying defect is separately measured, and the genuinely optional product decisions already live in `WORK_QUEUE.md`.

### F10 — WORK_QUEUE does not duplicate MASTER

The queue explicitly refuses to copy active IDs or counts, and its references to `TLP-SEARCH-001` / `TLP-ANALYTICS-CONSENT-001` are ownership pointers that keep owner-choice items *out* of MASTER. One stale phrase — "against the unchanged Product head" — was corrected, since Product `main` has advanced through verified repairs; the sentence now says so without copying a Product SHA.

### F11 — DOC_MAP authorities

Fact ownership rows are correct. The map was missing pointers to the three most recent closure packages and to this audit; added. The stale count in the audit-marathon note was corrected (F4).

## Transaction

One consolidation transaction, in dependency order:

1. `verified/CLOSURE_LEDGER.md` — appended the three missing closure waves, then this wave. Append-only; no prior entry altered.
2. `verified/MASTER_BUG_MATRIX.md` — retired the closed-root block (`ЗАКРЫТО 3 → 0`, summary `3 → 0`), added closure/integrity pointers, added the reachability condition to the P1 row. Open rows, IDs, severities and the total of 21 are untouched.
3. `verified/SYSTEM_THEMES.md` — theme-status framing rule, three `Current residual` lines, one new `candidate` theme.
4. `README.md` — removed the stale duplicated counter, corrected the active-subject list, added the three closure pointers and this report.
5. `DOC_MAP.md` — removed the stale root count, added current-authority pointers.
6. `WORK_QUEUE.md` — corrected the "unchanged Product head" phrase.
7. this report.

Explicitly **not** done:

- no raw intake under `incoming/` was rewritten;
- no historical/archive document was edited;
- no `gb-is-my-strength`, root workflow, script or branch-retirement file was touched;
- no historical biography was added to MASTER;
- no row was collapsed, reclassified, reopened or deleted without merged evidence.

## Validators

`scripts/check_auditrepo_structure.py`, `scripts/validate_audit_repo.py`, `scripts/validate_audit_repo_regression_test.py`, `scripts/matrix_coverage_regression_test.py` and `scripts/check_matrix_coverage.py` were run on the resulting tree after syncing with current AuditRepo `main`.

## Live evidence

Not required. This wave changed no live-dependent claim; the one live-dependent row (`TLP-COMM-ABUSE-001`) retains its existing measured boundary and was not re-measured.
