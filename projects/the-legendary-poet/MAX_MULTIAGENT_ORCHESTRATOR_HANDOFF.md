# MAX Multiagent Orchestrator Handoff — The Legendary Poet

Date: 2026-08-12

This document is a **brain/orchestrator handoff**, not a second bug matrix. The only active root authority remains `verified/MASTER_BUG_MATRIX.md` on current AuditRepo `main`.

## 0. Mission

Run The Legendary Poet repair program as a continuously updated multiagent system:

- MAX is the **brain**: reads current truth, builds dependency/conflict graph, decides wave composition, writes bounded worker prompts, receives reports, reviews evidence, chooses the next work, and owns AuditRepo control-plane updates.
- Worker agents are **bounded executors**: one coherent root family per task, minimal Product edits, exact tests, concise report back to MAX.
- Workers do **not** independently redefine priorities, duplicate roots, rewrite the MASTER matrix, or start adjacent refactors because they noticed them.
- Product repairs happen in `FedorMilovanov/TheLegendaryPoet`; durable audit truth lives in `FedorMilovanov/AuditRepo`.

## 1. Freshness rule — mandatory before every wave

Never trust the SHA/count in this document as permanently current.

At the start of every orchestration cycle:

1. read current `FedorMilovanov/TheLegendaryPoet@main` SHA;
2. compare it with the last known audited Product head;
3. read current AuditRepo `projects/the-legendary-poet/verified/MASTER_BUG_MATRIX.md`;
4. read current `WORK_QUEUE.md` and latest verification reports referenced by README/MASTER;
5. search Product for open PRs/issues already owning the same root;
6. collapse duplicate symptoms before assigning work.

Product head verified during this handoff: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.

At handoff time the current active matrix contained **30 roots = 1 P1 + 21 P2 + 8 P3**. Re-read it; parallel agents can move it.

## 2. Current active roots at handoff

### P1

- `TLP-COMM-ABUSE-001`

### P2

- `TLP-COMM-DELIVERY-001`
- `TLP-COMM-ORDER-001`
- `TLP-COMM-A11Y-001`
- `TLP-COMM-READSTATE-001`
- `TLP-COMM-TARGET-001`
- `TLP-THEME-001`
- `TLP-A11Y-RUNTIME-001`
- `TLP-A11Y-CONTRAST-001`
- `TLP-DISCOVERY-001`
- `TLP-READER-TEXT-001`
- `TLP-AUDIT-004`
- `TLP-AUTHORING-ID-001`
- `TLP-AUDIO-SESSION-001`
- `TLP-ANALYTICS-CONSENT-001`
- `TLP-RATING-SOURCE-001`
- `TLP-AUDIO-RELEASE-001`
- `TLP-ROUTE-REDIRECT-001`
- `TLP-SECONDARY-DATA-001`
- `TLP-SEARCH-001`
- `TLP-RATING-METHOD-001`
- `TLP-RATING-URLSTATE-001`

### P3

- `TLP-ANALYTICS-ROUTE-001`
- `TLP-READING-PROGRESS-001`
- `TLP-AUDIO-COMPLETION-001`
- `TLP-HOME-MEDIA-PERF-001`
- `TLP-A11Y-MOTION-001`
- `TLP-A11Y-STATUS-001`
- `TLP-COMM-TEXT-001`
- `TLP-SHELL-NOISE-001`

The exact evidence and terminal outcome for each root must be read from the current MASTER, not reconstructed from memory.

## 3. Critical negative evidence — do not waste agents reopening these without a new witness

Current audits have explicitly bounded or retracted these claims:

- Breadcrumb current-page semantics are correct (`aria-current="page"`).
- Shared `useDialogSurface` / `overlayRuntime` provides real topmost Tab containment and stack-aware Escape for registered modal surfaces.
- Current community schema source enables RLS, revokes base-table access and public views omit `voter_id`; do not claim a source-level public voter-id/base-table leak. Deployed Supabase state is a separate external evidence boundary.
- Current inspected comment rendering uses React escaped string content; no raw-HTML/XSS path was established.
- Community form labels/help and RatingStars keyboard radiogroup semantics were rechecked as correct.
- Shared external-link hygiene sampled in the audit is not a current root.
- ArticleImage shared dialog ownership and TrackReleaseCard interactive nesting were rechecked as correct.
- Sampled published essay images explicitly classify `kind`; missing-kind fallback is authoring hardening, not proof current images are mislabeled.
- No current future-dated published release witness was established.
- Audio master-version identity is a latent invariant; no current replacement-corruption witness was established.
- `AudioPlayerProvider` above lower ErrorBoundaries is resilience topology only until a normal current provider-level throw is reproduced.
- Do not call ordinary modal Tab escape a bug; the real runtime issues are narrower focus lifecycle/hidden chrome/hash/collection/overlay exceptions in `TLP-A11Y-RUNTIME-001`.

## 4. Root-family conflict map

MAX should assign workers by **edit footprint**, not by row count.

### Family A — Community integrity / convergence

Roots: `COMM-ABUSE`, `COMM-DELIVERY`, `COMM-ORDER`, `COMM-A11Y`, `COMM-READSTATE`, `COMM-TARGET`, `COMM-TEXT`.

Likely shared files: community store/identity/target stores/hooks/components and `docs/community-schema.sql`.

Rule: do not run several implementation agents simultaneously against the same community store/SQL core. Prefer one community integrator for P1 + delivery authority, then downstream presentation/a11y/text agents after the core branch lands or rebases.

### Family B — Global accessibility / theme

Roots: `THEME`, `A11Y-RUNTIME`, `A11Y-CONTRAST`, `READER-TEXT`, `A11Y-MOTION`, `A11Y-STATUS`.

Likely shared files: `index.css`, App shell, dialog/focus hooks, navigation components, poem text, controls.

Rule: separate **runtime focus semantics** from **visual token/motion work** when possible. Any agent touching global CSS must declare that footprint so MAX avoids concurrent token conflicts.

### Family C — Discovery / hosting / SEO

Roots: `DISCOVERY`, `ROUTE-REDIRECT`.

Likely shared files: `useSeo.ts`, prerender/sitemap/IndexNow scripts, route contract, deploy workflow, static output validators.

Rule: one discovery/hosting integrator should own static-vs-runtime metadata and legacy source-path hosting semantics so fixes do not create a third authority.

### Family D — Audio

Roots: `AUDIO-SESSION`, `AUDIO-RELEASE`, `AUDIO-COMPLETION` plus audio manifestations inside `A11Y-RUNTIME`.

Likely shared files: audio provider/session store/player components/release validators.

Rule: preferably one audio integrator, or strict sub-branches with declared file ownership.

### Family E — Ratings

Roots: `RATING-SOURCE`, `RATING-METHOD`, `RATING-URLSTATE`.

Likely shared file: `RatingsPage.tsx` and rating aggregation/presentation helpers.

Rule: use one ratings integrator; source provenance, statistical method and URL state can easily collide in the same component.

### Family F — Data / authoring / search

Roots: `AUTHORING-ID`, `SECONDARY-DATA`, `SEARCH`.

These can often run in parallel if file footprints are proven disjoint, but search inventory and authoring ID contracts both touch canonical data identity, so MAX must inspect before scheduling.

### Family G — Analytics/privacy

Roots: `ANALYTICS-CONSENT`, `ANALYTICS-ROUTE`.

Keep UI consent lifecycle and pageview lifecycle under one semantic analytics owner unless the code is clearly disjoint.

### Family H — Performance / shell

Roots: `HOME-MEDIA-PERF`, `SHELL-NOISE`, `READING-PROGRESS`.

Usually lower-conflict and suitable for parallel work after higher-risk core lanes are occupied.

### Family Q — QA harness

Root: `AUDIT-004`.

This is cross-cutting. Do not let a QA worker “fix” every product root. Its job is to convert known false-greens into exact regressions and certify workers' outcomes. Product-specific tests should ideally land with the owning root; the QA integrator closes remaining harness gaps after those changes stabilize.

## 5. Recommended rolling worker pool

Use a rolling pool rather than launching 30 independent agents.

Suggested first wave, after fresh conflict inspection:

1. **Community Integrator** — `COMM-ABUSE` + the server/client authority portion of `COMM-DELIVERY`.
2. **Accessibility Runtime Integrator** — `A11Y-RUNTIME` only; focus/hash/dialog/hidden-chrome/collection lifecycle, no broad CSS redesign.
3. **Discovery/Hosting Integrator** — `DISCOVERY` + `ROUTE-REDIRECT`.
4. **Audio Integrator** — `AUDIO-SESSION` + `AUDIO-RELEASE` + `AUDIO-COMPLETION`, if the file overlap supports one coherent branch.
5. **Ratings Integrator** — three ratings roots in one branch or sequential subcommits.
6. **Independent Verifier / QA Agent** — read-only against the workers' exact heads first; converts acceptance criteria into regressions, does not compete for implementation ownership.

As soon as a worker reports, MAX reviews it, updates the conflict graph and assigns the next eligible family. Keep the pool continuously busy, but never trade file-authority safety for agent count.

## 6. Worker prompt contract

Every worker prompt MAX generates must include all of the following:

- Product repository and exact current base SHA.
- Exact root ID(s) owned by the worker.
- Link/path to current MASTER row and relevant verification reports.
- Explicit **out of scope** roots and negative findings.
- Expected file footprint, or instruction to report it before writing if uncertain.
- Requirement to search open Product issues/PRs for competing ownership.
- Requirement to reproduce/verify current behavior before editing.
- Minimal root-cause fix, not symptom patches across unrelated files.
- Permanent regression tests for the exact failure mode.
- Relevant targeted tests plus repository-wide gates required by repo rules.
- Browser QA when the root is user/runtime behavior.
- No AuditRepo MASTER/README/WORK_QUEUE edits by workers unless MAX explicitly delegates one serialized audit-scribe task.
- Final report format shown below.

## 7. Worker report format — mandatory

Every worker must return a compact machine-readable-ish report:

```text
ROOTS: <IDs>
BASE_HEAD: <sha>
FINAL_HEAD_OR_BRANCH: <sha/branch>
PR: <number/url or none>
STATUS: fixed | partial | blocked | invalidated | absorbed
REPRO_BEFORE: <exact witness>
ROOT_CAUSE: <one paragraph>
FILES_CHANGED: <paths>
TESTS_ADDED_OR_CHANGED: <paths>
TESTS_RUN: <commands + pass/fail>
BROWSER_QA: <projects/journeys + pass/fail/not-run>
CONFLICT_FOOTPRINT: <files/root families likely to collide>
UNRESOLVED: <remaining scope>
NEW_FINDINGS: <candidates only; do not self-promote to MASTER>
NEGATIVE_FINDINGS: <things explicitly disproved>
RECOMMENDED_NEXT: <one bounded action>
```

MAX must treat `NEW_FINDINGS` as candidates requiring independent verification before matrix promotion.

## 8. Merge protocol

MAX owns merge order.

For each candidate PR/branch:

1. re-read Product `main`;
2. check whether another worker merged overlapping files;
3. rebase/update branch if needed;
4. run targeted tests on the rebased exact head;
5. run required repository-wide gates;
6. run behavior-specific browser QA where warranted;
7. inspect diff for accidental adjacent refactors;
8. merge one conflicting family at a time;
9. verify resulting Product `main` exact SHA;
10. only then update AuditRepo closure/evidence and remove/absorb the root from MASTER.

A green worker branch is not closure evidence after another overlapping merge until it is reverified on the resulting `main`.

## 9. AuditRepo write ownership

To avoid the race already observed during this audit:

- **MAX is the default sole control-plane writer.**
- Workers report; MAX updates `MASTER_BUG_MATRIX.md`, `WORK_QUEUE.md`, project `README.md`, closure ledger and verification packages.
- If MAX delegates AuditRepo writing, delegate it to exactly one audit-scribe agent at a time.
- Before every `update_file`, fetch the latest blob SHA; never overwrite a parallel agent's newer control plane.
- Historical reports are append-only evidence. Active MASTER remains compact.

## 10. Promotion / closure discipline

Promote a new root only when all are true:

- current source witness exists;
- mechanism is distinct from existing rows;
- user/release impact is concrete;
- owner/fix seam is materially different;
- not already owned by an open Product issue/PR;
- not contradicted by full-file or runtime evidence.

Close a root only on exact resulting Product `main`, with permanent regression evidence. Remove closed roots from active MASTER; preserve evidence in verification/closure history.

## 11. What MAX should produce immediately

After reading current Product/AuditRepo state, MAX should output:

1. a current dependency/conflict graph of all still-open roots;
2. a prioritized repair order with rationale (integrity/security/data-loss first, then correctness/a11y/release, then P3 polish/performance);
3. the exact first worker pool and why those branches are non-conflicting enough;
4. **ready-to-paste worker prompts** for each selected agent;
5. an audit/merge scribe plan;
6. a reporting/turnaround loop: when report A returns, what MAX checks and which next worker is launched;
7. stop conditions for each root and the whole program.

MAX should think deeply before dispatching. The goal is not maximum simultaneous agents; it is maximum safe throughput with one coherent source of truth.

## 12. Ready-made MAX kickoff instruction

Use the following as the first instruction to the MAX brain:

> You are the orchestration brain for The Legendary Poet engineering repair marathon. Read `FedorMilovanov/TheLegendaryPoet` current `main` and `FedorMilovanov/AuditRepo/projects/the-legendary-poet/verified/MASTER_BUG_MATRIX.md`, `WORK_QUEUE.md`, README and latest verification reports before deciding anything. Treat current repository state as authoritative over this handoff. Build a dependency/file-conflict graph for every active root, collapse duplicates, preserve negative findings, and design a rolling multiagent repair pool. You do not blindly code every root yourself: you create precise bounded prompts for worker agents, receive their reports, challenge weak evidence, decide merge order, and continuously dispatch the next safe task. Only you (or one explicitly delegated audit scribe) update the AuditRepo control plane. Product workers must own exact root IDs, verify current behavior before editing, make root-cause fixes, add exact regressions, run required gates/browser QA, and report base/final SHA, files, tests, conflicts and unresolved scope. Never accept a worker's green branch as closure after overlapping merges until exact resulting `main` is reverified. Start by giving me: current source/audit heads, active root inventory, conflict graph, prioritized waves, then ready-to-paste prompts for the first 5–6 workers and one verifier. After each worker report, act as the brain again: review, merge/reject/reassign, update the graph and issue the next prompts. Keep the system continuously moving until the active matrix is empty or only explicit owner/external-evidence blocks remain.
