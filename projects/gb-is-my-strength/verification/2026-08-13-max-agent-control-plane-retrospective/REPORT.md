# MAX retrospective — agents, checks and control plane

- Date: 2026-08-13
- Disposition: `verified-current-control-plane`
- Mutation boundary: AuditRepo evidence/admission only; no Product mutation

## 1. Scope and exact anchors

This is a one-time causal review, not a new general Product audit and not a
request to mirror every future Product commit into AuditRepo.

- Product: `FedorMilovanov/gb-is-my-strength`
  - `main`: `64bb04bda2b228ef23c20214199b67b987c1eb94`
  - tree: `ecff634b31252cd2bed2f9906e2ad4c3056cbd41`
  - parents: `74f11005f6c44e6989fa72661b4bd9965368230b` and exact PR #1667 head
    `9db654c0df67812a660dfee8585726b69b6251dc`
- AuditRepo: `FedorMilovanov/AuditRepo`
  - `main`: `0d9b9b8ad2398c6852e85de55bcf8423eef0b114`
  - tree: `60d73e0639b79c842b4c9e9db1c08345af1ec8ba`
  - parent: `c8151d6cdc1109a9b86348eb8ce3863fd62e893c`
- Primary history window: Product and AuditRepo work from 2026-08-10 through
  the anchors above. Older commits are cited only when they establish a
  recurring causal class.
- Excluded: TheLegendaryPoet was not opened or changed. No workflow was rerun,
  no Product branch/PR/issue was created, and no Product claim below authorizes
  a Product mutation.

Three independent read-only lanes reviewed Product history, CI/oracle behavior,
and AuditRepo governance. The MAX disposition below admits only current,
reproducible residuals; historical mistakes remain evidence, not active rows.

## 2. What the marathon accomplished

Product closure is real and remains terminal at the anchor above:

- final Deploy `31636750081`, attempt 1, was successful;
- Node Toolchain `31636750010`, attempt 2, recovered on the same SHA/tree;
- Metadata `31636750134`, Shared Files Guard `31636749988`, Source Authority
  `31636750093`, and Deployment Witness Ledger `31638307040` succeeded;
- Product census reached 0 open PRs, 0 open issues, 0 open `ci-failure` issues,
  and 0 queued/in-progress `main` workflows;
- no new current Product defect was proved by this retrospective.

The work also produced durable Product guards for reader projection fidelity,
Atlas breakpoint/focus behavior, Search overlay ownership, Shared Files Guard
lifecycle applicability, Gill exercisability and exact HDRC diagnostics.

The problem is not that this work was useless. The problem is that the route to
the valid end state contained avoidable repair loops, false claims of terminal
state, and control-plane work that was larger than the decisions it recorded.

## 3. Quantitative work-amplification signal

Using commit timestamps from `2026-08-10T00:00:00+03:00` through the exact
Product anchor:

- Product contains 87 commits in the reachable graph and 60 first-parent
  commits;
- 25 subjects are `chore(terminal)` and 7 are `chore(cache)`: 32/87, or about
  37%, are proof/automation transport rather than direct user-facing work;
- the V07/V12 closeout subchain from `63dc417d…` through `498595b2…` contains
  25 first-parent commits, changes 16 files by +146/-92, creates four temporary
  workflows and deletes all four before closure;
- in the wider chain from the preceding Atlas merge through `498595b2…`, 33
  first-parent commits landed in roughly 3h39m;
- on current AuditRepo `main`, 40 commits since the same time boundary touch
  the gb project, repository tools, workflows or operating contracts; 22 of
  those subjects contain `terminal`.

Counts alone do not prove waste. The causal evidence below does: several of the
extra transactions repaired omissions or red signals introduced by the
preceding proof/control-plane transaction itself.

## 4. Incident and repair matrix

| Class | Exact evidence | What the agent/check got wrong | Repair and current status |
|---|---|---|---|
| Structural surrogate treated as semantics | Product `0d5586e2d0d19ebceeb75b52920b85ba388615eb` balanced CSS braces after closing 151 blocks; `a1c6d0076c044b789b62738f0c04ed23db4e0acf` later found about 19 parsable rules versus 1222. | A narrow numeric invariant was promoted to whole-file correctness. | Historical false proof. The permanent lesson is a positive semantic/preservation witness, not another MASTER row. |
| Target removal without preservation proof | Product `6f21bdcdabdeaeb33e2072fa70dec263ca64335f` proved `grep fc-=0`; `a335aaa605181c697a00282310f22ef7e2d8b5c0` found class attributes stripped from 1580+ elements. | The mutation target was verified, but unaffected semantics were not. | Historical false proof. Broad edits must name and test a preservation boundary. |
| One witness dimension overclaimed as universal authority | Full-shadow route `4f940b34ed15c0155a91448494351cafee5f7794` guaranteed visual parity by construction; `23bd2c722da5ce56aba167a85fd8670d1d6ebee3` restored native route, Pagefind, app-asset and deploy ownership. | Pixel equivalence was treated as proof of runtime/search/publication correctness. | Closed. Witnesses are dimension-scoped under the current multi-witness model. |
| Parallel file isolation without semantic ownership | `84cd7da0354fb5515a532c16ca72d2f1a44381c0` recorded four regressions after parallel work: fixed positioning, footnote targets, tooltip close and detached pointer lifecycle. | Non-overlapping file lists did not prevent collision in a shared behavior owner. | Closed manifestations; semantic-owner declaration remains policy/template work below. |
| Gill false green | `69b1fad83e7d1a008fd9155d3bad3545ebd0ac1f` printed success when scrollspy was not exercisable, yielding 35 route×viewport false greens. | `UNPROVEN` was counted as `PASS`. | Closed by fail-closed exercise accounting; later Gill evidence reached 1701/1701 and final production readiness 24/24/24. |
| Reader exact-head regression merged before terminal check | PR #1566 head `5f6c7f91…`; exact-head run `31428093335` started before merge but failed after merge with missing projected head metadata. | The repair proved auxiliary-text removal, not exact metadata preservation; GitHub did not enforce waiting for the final-head check. | Final repair `ccfa22a47297b552aa1e934a7f63df524c110c2b` checks five exact source→dist values. Product guard exists; admission enforcement is unresolved. |
| Atlas harness false red, then legitimate Product red | PR #1563 head `64a108cc…`; run `31427747532` first expected a hidden `#atlasReset`, then later runs exposed the real `680` versus `980/981` breakpoint/focus mismatch. | The first oracle targeted the wrong accessible control; the width matrix omitted the actual CSS boundary. | Repair chain ends at `8c192a9d212a576ef50227a5ee0071898f47128e`; current contract covers 390/680/681/980/981/1440 and transitions. |
| “Terminal” proof did not cover the permanent graph | PR #1598 merge `498595b2144d32ce13578dc184a61b635159a0af` removed four temporary workflows. Its immediate `main` push produced Reader `31443803996`, Atlas `31443804115`, Search Modal `31443804053`, and Runtime `31443804049` failures while Deploy was green. | A green temporary trace and one lane were overclaimed as repository-terminal proof. | Product manifestations were repaired. The lesson is to query the permanent applicable graph; temporary writers are not proof of closure. |
| Search locator mistaken for semantics | Runtime job `93636289188` found the correct `Иер 17:9` content in title+snippet but expected an exact title. | A convenient locator became the semantic oracle. | PR #1594 / merge `1b920e6212494e24a624ea9323835dc6b4287c1a` fixed the harness without Product behavior mutation. |
| Search overlay semantic collision | Search Modal job `93633719172` showed the first Escape on `/karty/avraam/` did not close Search because Map intro still owned the overlay stack. | File-level lanes did not coordinate the shared overlay lifecycle; single-surface controls were also mislabelled as tabs. | PR #1637 / merge `d18ce559e166837380550c5cfd91db5687a3628f`; exact-head Search, Runtime and Overlay checks succeeded. |
| Shared Files post-close false red | Runs `31513382848` and `31507781363` attempted to fetch a deleted synthetic `refs/pull/*/merge`. | A closed-PR lifecycle event was treated as applicable after its authority ref ceased to exist. | PR #1667 makes explicitly closed PR events N/A before checkout while open/unknown events remain fail-closed. Current guard is sufficient. |
| Broad Gill workflow rewrite dropped preserved invariants | Commit `8e5bbd530bea89fbcacb24dc114bc5dbeb99e131` rewrote the candidate workflow and dropped the real canonical npm install and editorial freeze evidence. `ddf2c144…` and `5c99e9d…` restored them after Node/Shared failures. | A large mirrored workflow replacement had no explicit preservation manifest; assertions survived while their setup/evidence producers did not. | Final #1664 head `d42420bc…` was green. Future broad workflow edits need producer/assertion/artifact parity checks. |
| Gill transport signal misattributed, then over-narrowed | Same-tree Deploy attempts changed generic certificate counts 4→2→1. #1668 classified exact `hdrc.yandex.net` cert failure, then production `31621730184` honestly failed on `ERR_ABORTED`; #1669 bounded both observed outcomes. | First, external transport was mixed with Product layout truth; then one observed error string was mistaken for the whole admitted external outcome set. | Candidate `31625050462` and production `31626546011` succeeded with retained diagnostics. The exact tuple remains narrow and other failures fatal. |
| Node same-tree false red | PR Node `31635257654` succeeded on tree `ecff634b…`. Main run `31636750010` attempt 1 failed only while downloading actionlint: `UND_ERR_SOCKET`, remote `github.com:443`, zero bytes read; attempt 2 on the same SHA/tree succeeded. | Integrity was pinned/checksummed, but blocking lint still had an unclassified external availability dependency. | Product tree is exonerated. Offline/bootstrap hardening is a parked control-plane candidate, not a Product defect. |
| AuditRepo MASTER semantic rewrite violated machine schema | Direct-main `8ad804a3d91eed59f0a3c27499b48de8af000da6`; Validate `31638759143` failed because required legacy counters/headings were removed before compact support existed. | The agent checked semantic content but did not run the repository validator before publication. | `c8151d6cdc1109a9b86348eb8ce3863fd62e893c` added/restored compact schema; Validate `31640357261` succeeded. The schema guard is now covered by regressions. |
| AuditRepo invalid workflow bypassed the green validator | Deleted `_temp-reconcile-production-closure-main.yml` had a `run: |` at line 28 and de-indented Python triple-quoted content from line 42. The workflow accumulated 2422 run records: 2419 failures, 0 successes; sampled runs `31638758160` and `31640356466` had zero jobs. | No current AuditRepo check parses `.github/workflows/**/*.{yml,yaml}`. A post-push validator cannot start on a syntactically invalid workflow, and the separate green validator never inspected it. | The instance was deleted by `0d9b9b8…`; the class remains open as `SYS-AUDITREPO-WORKFLOW-PREFLIGHT`. |
| AuditRepo “strict” history is not strict over summary debt | Deep Audit `31296347805` failed on missing PR #3 archive ref and also reported two unexplained remote refs. Current `repository_history_forensic_audit.mjs --strict` exits on explicit `problems`, but non-zero `unexplainedRemoteBranches`, `manualReviewCandidates`, and `inaccessibleClosedHeads` are only summary counters in the weekly workflow. | The word `strict` overclaimed the enforced invariant; ordinary validation runs the stronger zero assertion only on selected changed paths. | Current defect and strict-semantics repair are one bounded root: `SYS-AUDITREPO-HISTORY-FORENSIC-DRIFT`. |
| Written merge policy is not GitHub enforcement | Live API on 2026-08-12/13: Product and AuditRepo `main` both report `protected:false`; rulesets are `[]`. Product #1563 merged 9 seconds after its future-failing check started; #1566 also merged before its exact-head result. AuditRepo `8ad804a3…` landed before validator rejection. | Agents could follow or bypass a text rule; GitHub did not require terminal applicable checks. | This is not a Product bug. `SYS-MAIN-ADMISSION-ENFORCEMENT` requires an owner decision on required automation versus explicitly accepted risk. |

Timing matters: #1563 and #1566 were not knowingly merged after a terminal red.
They were merged while exact-head checks were still running; those same-head
runs became red afterward. The defect is missing enforcement/waiting, not proven
intentional disregard of an already-terminal failure.

## 5. Failure taxonomy

The recurring mechanisms are smaller than the symptom list:

1. **Claim-boundary failure** — a check proved one property, while the agent
   claimed the whole feature, file or repository was correct.
2. **Preservation failure** — the target mutation was proved, but invariants
   outside the target were not enumerated or tested.
3. **Oracle applicability failure** — a harness tested a hidden/wrong control,
   over-specific locator, unavailable PR ref, or non-exercised state.
4. **Semantic-owner collision** — file allowlists did not represent shared
   runtime owners such as overlay/focus/lifecycle behavior.
5. **Control-plane amplification** — temporary writers and terminal-proof
   workflows created more commits, races and failure surfaces than the
   underlying decision required.
6. **Bootstrap/transport coupling** — a blocking check depended on a fresh
   external download even when the semantic tree was unchanged.
7. **Admission gap** — policy asked for exact-head green but repository settings
   did not enforce waiting for it.
8. **Layer-confused zero** — Product zero, ordinary AuditRepo validation green,
   and full AuditRepo governance green were treated as one state.

## 6. Current MAX admissions

Only four current work units are admitted. They are also the only active rows
in `verified/MASTER_BUG_MATRIX.md`.

### `SYS-AUDITREPO-HISTORY-FORENSIC-DRIFT` — current defect

Base-state facts on AuditRepo `0d9b9b8…`:

- `closed-unmerged-pr-dispositions.json` says PR #3 is archived at
  `archive/forensic-pr-3-vosk-tts-report-2026-07-24`;
- that live branch is absent;
- the closed PR head `07891373c6c9f488842a9a66e6cfde857ca74bce` remains
  accessible, both introduced paths exist on `main`, and the added REPORT blob
  is byte-identical to current `main`;
- current strict mode does not itself fail all non-zero summary debt.

A fresh 2026-08-13 live inventory found six current orphan refs, rather than
the two printed by the older 2026-08-09 Deep Audit. Each contains either unique
branch-only evidence or a mixed stale/current transaction and therefore must
not be whole-merged or deleted blindly.

| Source ref | Exact SHA | Verified preservation ref |
|---|---|---|
| `arena/019fe0b5-auditrepo` | `11ab74f3c396c2f17539cd9b770c91c3b1e89b6f` | `archive/forensic-arena-019fe0b5-auditrepo-2026-08-13` |
| `arena/019fe0c4-auditrepo` | `9239885f8ba8dfc84a4125339bc408c899b495c5` | `archive/forensic-arena-019fe0c4-auditrepo-2026-08-13` |
| `audit/gb-control-reconciliation-bc786-20260809` | `08692b0eadea72ea10d50ed97faa6e6ec837d5e9` | `archive/forensic-gb-control-reconciliation-bc786-20260809` |
| `audit/tlp-hall-001-material-chain` | `70cf0c4f3c860afd877fb4010eb9c26a2d7120ed` | `archive/forensic-tlp-hall-001-material-chain-20260809` |
| `audit/tlp-hall-001-material-chain-current` | `efb906714a670335d1d050ecf88bba562abab45e` | `archive/forensic-tlp-hall-001-material-chain-current-20260809` |
| `audit/tlp-hall-material-chain-20260809` | `cbc19abd10c322d5811d8d884212f82b4f252833` | `archive/forensic-tlp-hall-material-chain-20260809` |

All six archive refs were created and read back at the exact SHA. The source
refs were intentionally retained: preservation was proved before any cleanup,
and this transaction does not use deletion as a substitute for disposition.
The separate TheLegendaryPoet repository was not opened or changed.

Bounded implementation in this transaction:

1. classify PR #3 as `superseded` through landed commit `1b12007f…`; the exact
   REPORT blob landed byte-identically, while the mutable README head is not
   current merge authority;
2. reconcile non-archive source refs only while a distinct `archive/*` ref
   resolves to the same exact SHA, and print the pair in the forensic report;
3. make strict mode fail on every non-zero or malformed declared summary
   invariant;
4. add regressions for zero, each non-zero counter, invalid counters, exact-SHA
   archive pairing and archive mismatch;
5. require configured landed commits to be ancestors of current `origin/main`;
6. obtain exact-head and then natural Deep Audit success with zero required
   counters.

### `SYS-AUDITREPO-WORKFLOW-PREFLIGHT` — verified necessary improvement

Bounded implementation in this transaction:

- a separate always-created PR/push workflow, independent of the workflow it
  checks;
- a checked-in, pinned/reviewed YAML parser source with licence/checksum
  manifest, or another deterministic offline parser already controlled by the
  repository; no runtime `curl`, GitHub Release or unpinned `pip` bootstrap;
- parse every workflow, require one mapping document and a non-empty `jobs`
  mapping, and report file/line/column;
- use YAML composition/BaseLoader semantics so the `on` key is not converted by
  YAML 1.1 object construction;
- regression fixtures for a valid quoted heredoc, the exact de-indented heredoc
  failure, multiple documents, and missing/empty jobs;
- in the same deterministic preflight, require external `uses:` references to
  be full immutable SHAs (local `./` actions allowed; container digest policy
  explicit).

Retirement requires a malformed-workflow PR to create a real failing preflight
job, a valid fixture PR to pass, and admission settings to block absent/failing
preflight.

### `SYS-AUDITREPO-POLICY-MIGRATION` — verified necessary improvement

On base `0d9b9b8…`, the compact/admission model was implemented in part, but
active authoring sources still taught earlier rules:

- `verified/README.md` calls MASTER a transitional monolith with hundreds of
  closed rows;
- `verified/CLOSURE_LEDGER.md` says historical closed rows still remain in
  MASTER;
- `WORK_QUEUE.md` retains a stale snapshot of seven V07/V12/V13/V14/FINAL-ZERO
  active rows;
- `verified/SYSTEM_THEMES.md` still labels historical roots `active-work`;
- `BUG_MATRIX_TEMPLATE.md` uses the old P0/P1/P2 shape;
- `WITNESS_MATRIX_TEMPLATE.md` exposes only W1–W4 while the live protocol has
  W1–W6;
- `scaffold_project.py` does not create a canonical compact MASTER;
- report/repair templates do not consistently require signal class, proof
  state, claim boundary, preservation boundary and semantic owner.

This transaction aligns those active sources and their scaffold/regression
fixtures. Its black-box regression creates a new project with `legacy/`, a
canonical zero MASTER, proportional W1–W6 metadata and the four-state proof
model, then runs the canonical repository validator without manual schema
repair. Retirement still requires exact-head validation after publication.

### `SYS-MAIN-ADMISSION-ENFORCEMENT` — owner decision

Choose one explicit state for each repository:

1. enforce PR-only admission with required always-created checks and a documented
   emergency bypass/rollback actor; or
2. explicitly accept and document post-push red risk.

For AuditRepo, the minimum enforceable set is Workflow Preflight plus AuditRepo
Validate. For Product, path-filtered checks cannot all be made required because
an expected absent check would block unrelated PRs; a stable umbrella admission
check must represent applicability and final-head terminal state.

This decision concerns automation, not manual approval of every small bug.

### PR #305 admission feedback — live negative control

The first natural exact-head admission run supplied new control-plane evidence
without changing Product:

- AuditRepo PR #305 head `84b08d6cdd304b5ecd39246b5de0abbab27241d2`,
  tree `bdf190e236a364c12a7c1803df8c6883abb0a103`;
- Workflow Preflight `31648775397` passed, proving the new YAML/immutable-pin
  barrier created and completed a real job;
- AuditRepo Validate `31648775252` failed in `Validate retirement result
  history`, while structure, workflow preflight, repository rules, validator,
  scaffold and ref-retirement regressions all passed first.

The forensic artifact proved that the validator checked a PR merge ref after
`actions/checkout` with `fetch-depth: 2`. Old, valid landed commits therefore
appeared not to be ancestors of `origin/main`, and ten old main-ancestor refs
appeared to be orphan branches. The same report correctly classified all six
new exact-SHA archive/source pairs and the open PR head. This is a shallow-clone
oracle defect, not Product drift and not ten newly discovered semantic branches.

The bounded follow-up switches the strict-history workflow to full history,
adds an offline mutation fixture that rejects any strict-history workflow with
a shallow or missing fetch depth, and prevents diagnostic artifact upload from
adding a second misleading failure after an earlier semantic stop. Retirement
requires a fresh natural exact-head Validate run with zero inaccessible,
manual-review and unexplained counters; no rerun of `31648775252` is evidence
for the changed head.

## 7. Parked candidates — not active MASTER work

These are evidence-backed but lower-priority control-plane improvements. They
must not reopen Product or become automatic repair lanes without a fresh gate.

- actionlint offline/bootstrap contract: cold-cache lint without a release
  download; checksum corruption and semantic lint failures remain hard red;
- Gill scope independence: immutable six-route manifest so deleting a route
  cannot shrink both `ROUTES.length` and `EXPECTED_CASES` into a false green;
- Gill one-to-one console/resource attribution: two generic console errors plus
  one structured failure must leave one unmatched fatal error;
- diagnostic artifact sentinel: an early semantic failure must not gain a second
  misleading `if-no-files-found` upload failure;
- semantic-owner declaration/lease for shared behavior surfaces;
- same-tree contradiction automation and explicit `PASS / FAIL / UNPROVEN / N/A`
  reporting where it provides more value than manual triage.

## 8. Closed evidence — do not return to backlog

Do not create active rows merely to preserve these lessons:

- CSS brace/regex/full-shadow wrong turns;
- repaired Reader, Atlas, Search, Shared Files and Gill manifestations;
- closed transport/successor branches;
- the deleted invalid temporary workflow as an instance;
- old closed MASTER rows;
- Node run `31636750010` as a Product defect.

The evidence remains in this report, prior verification documents and Git
history. A future recurrence must pass current admission again.

## 9. Anti-overclaim contract for future agents

Before mutation or closure, record:

1. signal class: Product / harness / control-plane / environment / historical;
2. exact SHA/tree/event and whether the witness applies;
3. proof state: `PASS`, `FAIL`, `UNPROVEN` or `N/A`;
4. exact claim boundary — what the witness proves and what it does not;
5. semantic owner and overlapping active work;
6. target invariant and preservation invariants;
7. required final-head checks and whether GitHub actually enforces them;
8. production evidence only when claiming production;
9. retirement condition for any new workflow, writer, branch or matrix row.

Final status must be layer-specific:

```text
PRODUCT: GREEN / ZERO / TERMINAL at 64bb04b…
AUDITREPO ORDINARY VALIDATOR: GREEN at 0d9b9b8…
AUDITREPO GOVERNANCE/HISTORY: NOT ZERO
CURRENT AUDITREPO/CONTROL-PLANE WORK UNITS: 4
NO CURRENT PRODUCT MUTATION AUTHORIZED
```
