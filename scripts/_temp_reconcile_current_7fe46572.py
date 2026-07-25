#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
PROJECT = ROOT / 'projects' / 'gb-is-my-strength'
NEXT = PROJECT / 'NEXT_AGENT_PROMPT.md'
MATRIX = PROJECT / 'verified' / 'MASTER_BUG_MATRIX.md'
REVERIFY = PROJECT / 'reverify' / 'CURRENT_HEAD_REVERIFY_2026-07-25_7fe46572_auditor-r2.md'
WORKFLOW = ROOT / '.github' / 'workflows' / '_temp-reconcile-current-7fe46572.yml'
SELF = Path(__file__).resolve()


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected exactly one match, got {count}')
    return text.replace(old, new, 1)


next_text = '''# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived. Bug status and counters belong to `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary, shared-surface ownership and next execution order.

**Source main:** `7fe46572e84003f703952ab15a6a82102652a98e`
**Last fully imported exact production witness:** ✅ `8a5352671375fdb01b6c30273c25ec4283a13f69`
**Current production candidate:** ⚠️ `7fe46572e84003f703952ab15a6a82102652a98e` — exact-SHA/run-addressed provenance exists in source after PR #290, but exact readiness, Pages, live pointer/run object and evidence artifact have not yet been imported into AuditRepo.
**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_7fe46572_auditor-r2.md`
**Immutable forensic intake:** `incoming/auditor-brain/2026-07-25-r2/REPORT.md`

## 1) Exact boundary

Source and production remain separate authorities:

- source `main` is `7fe46572` after merged PR #290;
- PR #290 fixed the manual-checkout race and replaced the mutable flat SHA object with `deployments/current.json` plus run-addressed evidence;
- the whole Pages artifact is still not bound to the readiness candidate digest; generic/artifact identity remains open in source issue #292 and build-once issue #295;
- PR #283 removed duplicate PDF ownership, but a later physical two-state contract proved the flipped back face still retains 3D transform; PR #286 now owns a real product correction, not evidence-only work;
- PR #288 is closed without merge as an obsolete propagation-timing witness;
- PR #289 is closed as superseded by the newer provenance model/source SHA, without claiming production success;
- the last fully pinned AuditRepo production authority remains `8a535267` until newer exact run IDs and artifacts are imported;
- this update advances source/orchestration truth only and does not manufacture missing production evidence.

Canonical evidence:

- `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_7fe46572_auditor-r2.md`;
- `incoming/auditor-brain/2026-07-25-r2/REPORT.md`.

## 2) Current active pull requests

At this snapshot the active source PRs are:

- **#286 — reversible-card physical PDF product repair**: draft. The front state passes; the flipped back state retained `matrix3d` and lost physical markers. It must publish one generic inner-wrapper print rule, keep all three card families covered, remove every `_temp-*` materializer/workflow and pass exact-head front/back PDFs plus the five-route matrix. Do not weaken unrelated screen rules to satisfy a raw `!important` count.
- **#293 — deployment acceptance ledger**: draft. The goal is valid, but the current recorder hardcodes a `P1(tts)` issue title, TTS artifact/prose and grants the generic deploy workflow issue-write permission. Refactor to a generic, downstream/retryable, least-privilege acceptance envelope with fail-closed artifact ID/digest before merge.

There is no active Genesis 6 activation PR. The canonical Genesis corpus remains intentionally `draft: true` and `noindex: true` until one explicit owner is created for the five-route activation.

## 3) Shared-surface ownership

- One shared/route surface has one active product owner.
- PR #286 is the sole active print product owner. Do not revive #280, reopen #283 or create another print implementation lane.
- PR #293 owns only acceptance-ledger projection; it must not absorb build-once artifact architecture (#295), notifier lifecycle (#294) or generic provenance schema (#292) without an explicit converged SYSTEM plan.
- Do not create another Genesis snapshot. A future activation must use one named activation PR and one owner.
- Before every lane, refresh `main`, open PRs, changed filenames, active workflows and shared-file intersections.

## 4) CI status semantics

Do not treat every red status as the same defect. Classify it first:

1. **protective failure** — for example Shared Files Guard rejecting temporary write workflows in a final tree;
2. **product regression** — current example: flipped card inner wrapper remains in 3D flow and active-face markers are `0/0`;
3. **cancelled/superseded run** — a newer head or Pages concurrency cancelled the old run;
4. **stale alert lifecycle** — an old failure issue remains open after a green recovery;
5. **post-publish ledger failure** — repository comment/issue projection failed after Pages may already be healthy; this must not be presented as a deployment failure.

`notify-on-failure.yml` currently lacks a recovery state machine, subscribes to stale IndexNow ownership, does not actually consume route-impact artifacts and may present workflow-name heuristics as root cause. Source issue: #294.

## 5) Active work, in order

1. **Finish source repair #286**
   - fix the product owner, not the test;
   - require front and flipped-back PDFs, atomic outer root, static/untransformed inner wrapper and same-page markers;
   - retain generic `.flip-card`, `.heart-flip-card`, `.error-flip-card` families;
   - remove temporary workflow/materializer and review exact artifact before merge.

2. **Converge release artifact architecture (#295 + #292)**
   - readiness builds and validates one exact candidate under a pinned toolchain;
   - publish whole-artifact digest and generic build/route identity;
   - deploy promotes the same artifact without a second install/build;
   - capability evidence lives under extensions such as `extensions.tts`.

3. **Refactor or stop #293 before merge**
   - generic machine key, not exact human TTS issue title;
   - downstream/retryable ledger projection with least privilege;
   - prove the evidence artifact exists and record artifact ID/digest;
   - call current proof a TTS capability witness until whole-artifact identity exists.

4. **Fix CI alert lifecycle (#294)**
   - listen to actual readiness/deploy ownership;
   - open/update on failure and close only on a newer exact success;
   - distinguish cancelled/superseded;
   - quote exact failed jobs/steps and real artifact data;
   - explicitly choose non-blocking or separate-workflow ownership for IndexNow.

5. **Replace shadow-era workflow policy (existing source issue #64)**
   - derive route coverage from effective route registry;
   - enforce read-only validation and permissions;
   - forbid mutating validation;
   - move from raw numeric ratchets to named semantic capability budgets where needed.

6. **Resolve Genesis 6 activation ownership**
   - current state is intentionally draft/noindex;
   - activation requires one explicit PR and one owner for all five routes;
   - no standalone snapshot may remain open without a named consumer.

7. **Add Research authority manifest (Research issue #16)**
   - machine-readable IDs, scope, authority, supersedes/applies-to, source grade, rights state and pinned Research SHA;
   - block cycles, duplicate authority, missing overlays, stale site imports and unresolved image rights;
   - consolidate XLVIII + XLIX + L + LI through a deterministic publication compiler or final dossiers.

## 6) Non-negotiable gates

Before source merge:

- exact-head changed-file and ownership refresh;
- Shared Files Guard and control-plane audit for workflow/package changes;
- relevant Native Source/Route Registry/Visual gates;
- focused browser/PDF contract plus broad route-family regression;
- production-like build;
- no `_temp-*` workflow/materializer in final scope;
- no unrelated semantic weakening to preserve a numeric count;
- no mutation in a nominally read-only validation step.

After a production-impacting merge:

- exact readiness;
- exact Pages deployment from the same verified artifact identity;
- generic live witness plus capability-specific evidence;
- run-addressed acceptance record that cannot make a successful publish look failed;
- only then advance production authority in AuditRepo.

## 7) Data hygiene

- `PROJECT_REGISTRY.md` remains static.
- `NEXT_AGENT_PROMPT.md` owns current execution truth.
- `verified/MASTER_BUG_MATRIX.md` owns statuses and counters.
- `reverify/` owns immutable current-head witnesses; `incoming/` owns raw forensic evidence.
- stale failure issues are not evidence of current failure.
- no silent evidence deletion, temporary workflow in a final diff or exact production claim without imported run/artifact evidence.
'''
NEXT.write_text(next_text, encoding='utf-8')

matrix = MATRIX.read_text(encoding='utf-8')
matrix = replace_once(matrix,
    '| Source HEAD | `d94b54889e4f5f0330adaf2b9947e59af4aee7e4` (current source main; merged PDF convergence PR #283 after the TTS/deploy/editorial sequence; duplicate print ownership removed) |',
    '| Source HEAD | `7fe46572e84003f703952ab15a6a82102652a98e` (current source main; PR #290 exact-SHA/run-addressed provenance follow-up merged; active print correction remains PR #286) |',
    'source head row')
matrix = replace_once(matrix,
    '| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Last fully imported exact production witness remains `8a535267`; newer candidate `ddcf7153` has permanent post-deploy TTS verification in source, but exact readiness/Pages/live-artifact IDs are not yet imported into AuditRepo. Current source `d94b5488` is not claimed deployed here. |',
    '| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Last fully imported exact production witness remains `8a535267`. Current candidate `7fe46572` has exact-SHA/run-addressed provenance source support, but exact readiness, Pages, live pointer/run object and evidence artifact are not yet imported. Current source is not claimed deployed here. |',
    'deploy row')
matrix = replace_once(matrix,
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_d94b5488_multiagent-convergence.md` |',
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_7fe46572_auditor-r2.md` |',
    'reverify row')
matrix = replace_once(matrix,
    '⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `d94b5488`; last fully imported exact production witness: `8a535267`; newer production candidate requiring evidence import: `ddcf7153`; source/orchestration evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_d94b5488_multiagent-convergence.md`.',
    '⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `7fe46572`; last fully imported exact production witness: `8a535267`; current production candidate requiring evidence import: `7fe46572`; source/orchestration evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_7fe46572_auditor-r2.md`.',
    'authority warning')
matrix = replace_once(matrix, '## ✅ ЗАКРЫТО (150)', '## ✅ ЗАКРЫТО (151)', 'closed counter')
matrix = replace_once(matrix,
    '| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/SOURCE GOVERNANCE VERIFIED 2026-07-25.** AuditRepo no longer points agents at `184d7ed1` and obsolete map-first PR ownership. `NEXT_AGENT_PROMPT.md`, matrix masthead and immutable reverify/convergence reports now own `main@d94b5488`, current PR boundaries and the explicit production-evidence gap. | `d94b5488` source + current AuditRepo convergence PR |',
    '| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records `main@7fe46572`, merged #290, the real product scope of #286, draft #293 boundaries and the fail-closed production-evidence gap. Immutable R2 intake preserves the drift/self-correction evidence. | `7fe46572` source + AuditRepo R2 reconciliation |',
    'ssot closed row')
matrix = replace_once(matrix,
    '| ORCH-DUPLICATE-PRINT-SURFACE-OWNERS | ✅ **FIXED 2026-07-25.** PR #283 became the sole PDF product owner and merged as `d94b5488`; PR #280 was closed without merge as superseded. Test-only PR #286 owns only the missing physical front/back evidence and changes no product CSS/JS. | PR #283 merged; PR #280 closed; PR #286 bounded |',
    '| ORCH-DUPLICATE-PRINT-SURFACE-OWNERS | ✅ **FIXED 2026-07-25.** PR #283 became the sole accepted PDF product owner and PR #280 closed without merge. A later physical contract found a separate residual back-face product defect; PR #286 is now the sole correction owner rather than a competing implementation. | PR #283 merged; PR #280 closed; PR #286 sole follow-up |',
    'print ownership row')
closed_anchor = '| ORCH-DUPLICATE-PRINT-SURFACE-OWNERS | ✅ **FIXED 2026-07-25.** PR #283 became the sole accepted PDF product owner and PR #280 closed without merge. A later physical contract found a separate residual back-face product defect; PR #286 is now the sole correction owner rather than a competing implementation. | PR #283 merged; PR #280 closed; PR #286 sole follow-up |\n'
matrix = replace_once(matrix, closed_anchor, closed_anchor +
    '| AUDITREPO-REPORT-SHA-BYPASS | ✅ **FIXED/AUDITREPO CI VERIFIED 2026-07-25.** SHA-bearing empty report scaffolds no longer bypass content validation. New/modified empty intakes block, historical debt remains visible, strict mode and a black-box temporary-tree regression are permanent. | AuditRepo `6cba8af0`; run `30166440002` |\n',
    'insert AuditRepo validator closure')
matrix = replace_once(matrix, '## 🟠 P1 — ОТКРЫТО (100)', '## 🟠 P1 — ОТКРЫТО (102)', 'P1 counter')
open_header = '| ID | Описание | Witnesses |\n'
first_open = matrix.find(open_header, matrix.find('## 🟠 P1'))
if first_open < 0:
    raise RuntimeError('P1 table header not found')
insert_at = first_open + len(open_header)
new_p1 = (
    '| PRINT-REVERSIBLE-BACK-3D-FLOW | Flipped reversible-card outer root remains atomic, but the inner wrapper retains `matrix3d` and the active back-face physical markers disappear (`0/0`). PR #286 must fix one generic product owner and remove temporary materializers before merge. | PR #286 physical PDFs/runs `30165390363`, `30166039373`; R2 intake |\n'
    '| DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING | Draft PR #293 hardcodes a `P1(tts)` issue title, TTS artifact/prose and issue-write mutation into the generic Pages deploy. Acceptance projection must become generic, downstream/retryable, least-privilege and artifact-ID/digest bound. | PR #293 architecture review; source #292/#295 |\n'
)
matrix = matrix[:insert_at] + new_p1 + matrix[insert_at:]
matrix = replace_once(matrix,
    '| DEPLOY-PROVENANCE-TTS-COUPLING | PR #284 uses generic deployment-provenance naming/path but its schema and ownership are TTS-specific. Generic repository/commit/workflow/artifact/build/routes/assets identity must be separated from `extensions.tts` before merge. | open draft PR #284 |',
    '| DEPLOY-PROVENANCE-TTS-COUPLING | PR #290 fixed exact-checkout and flat-SHA overwrite races with `current.json` plus run-addressed evidence. Remaining record is top-level TTS-specific and not bound to the whole readiness/deployed Pages artifact digest, route/build identity or pinned toolchain. | merged PR #290; open source #292 + #295 |',
    'provenance row')
matrix = replace_once(matrix,
    '| CI-ALERT-NO-RECOVERY-STATE | Failure notifier has no exact-head recovery/superseded state, can leave stale failure issues open after green recovery, does not reliably download diagnostic artifacts and may present workflow-name heuristics as root cause. | forensic delta 2026-07-25; notify-on-failure lifecycle |',
    '| CI-ALERT-NO-RECOVERY-STATE | Failure notifier has no exact-head recovery/superseded state, does not actually download route-impact evidence, guesses causes/routes, misses the real readiness gateway and subscribes to stale IndexNow workflow ownership while deploy swallows IndexNow failures. | source issue #294; R2 intake |',
    'notifier row')
matrix = replace_once(matrix,
    '| CI-BUILD-VALIDATION-DUPLICATION | Readiness and deploy repeat dependency installation, production-like build and overlapping full/light validation instead of promoting one verified immutable artifact. | workflow/control-plane forensic 2026-07-25 |',
    '| CI-BUILD-VALIDATION-DUPLICATION | Readiness validates one Node-22.12 production-like dist but uploads no candidate; deploy uses floating Node 22, repeats install/validation/build and publishes a separately produced dist instead of promoting the exact verified artifact. | source issue #295; current readiness/deploy graph |',
    'build duplication row')
matrix = replace_once(matrix,
    '| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, deployment and live-contract artifact identifiers for newer candidate `ddcf7153` are imported and reconciled. | `ddcf7153` production candidate; evidence import pending |',
    '| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, run-addressed provenance and live evidence identifiers for current candidate `7fe46572` are imported and reconciled. Superseded 9fc acceptance issue #289 was closed without claiming deployment. | `7fe46572` candidate; evidence import pending |',
    'production evidence row')

# Add Research P2 row to the first P2 open table and ratchet its counter.
p2_match = re.search(r'##[^\n]*P2[^\n]*ОТКРЫТО \((\d+)\)', matrix)
if not p2_match:
    raise RuntimeError('P2 open header not found')
p2_old = p2_match.group(0)
p2_new = p2_old.replace(f'({p2_match.group(1)})', f'({int(p2_match.group(1)) + 1})')
matrix = matrix[:p2_match.start()] + p2_new + matrix[p2_match.end():]
p2_header_pos = matrix.find(open_header, p2_match.start())
if p2_header_pos < 0:
    raise RuntimeError('P2 table header not found')
p2_insert = p2_header_pos + len(open_header)
matrix = matrix[:p2_insert] + (
    '| RESEARCH-AUTHORITY-MANIFEST-MISSING | Genesis/Jude/Peter publication still requires manual composition of XLVIII base + XLIX text corrections + L rights decisions + LI precision overlays. Add machine-readable authority/supersession/rights manifest and pinned Research SHA/compiler. | Research issue #16; Research `b654c537` |\n'
) + matrix[p2_insert:]

session = '## Session log\n'
if session not in matrix:
    raise RuntimeError('Session log header not found')
matrix = matrix.replace(session, session + '\n- **2026-07-25 auditor R2 (`7fe46572`)** — corrected premature print-success claim; recorded real flipped-back 3D/PDF defect, merged AuditRepo report-validator fix `6cba8af0`, updated #290 provenance residual, #293 acceptance-ledger coupling, #294 notifier and #295 build-once architecture; production authority remains fail-closed.\n', 1)
MATRIX.write_text(matrix, encoding='utf-8')

reverify = '''# CURRENT HEAD REVERIFY — 2026-07-25 — `7fe46572` auditor R2

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `7fe46572e84003f703952ab15a6a82102652a98e`
- AuditRepo authority before this reconciliation: `cede492445acef526f816d04a7cca67c6cf445da`
- Research authority observed: `b654c5375a7b212ff9b42c08bb0193eeaad70746`
- Last fully imported exact production witness: `8a5352671375fdb01b6c30273c25ec4283a13f69`

Source and production remain separate. This document does not claim `7fe46572` deployed.

## Source delta since the previous d94b5488 witness

1. PR #284 merged an initial deployment provenance implementation as `9fcfb6c2`.
2. PR #290 merged as `7fe46572`, fixed manual exact-checkout and replaced a mutable flat SHA object with `deployments/current.json` plus run-addressed evidence.
3. The remaining provenance record is still top-level TTS-specific and lacks whole release-candidate artifact digest/build/route identity; source issues #292 and #295 remain open.
4. Physical print PR #286 proved that PR #283 did not fully fix the flipped reversible-card state: the outer root is atomic but the inner wrapper retains `matrix3d`; active-face markers are absent (`0/0`).
5. Temporary production witness PR #288 was closed without merge because it polled during propagation and served previous revisions.
6. Draft PR #293 proposes a durable acceptance ledger but currently couples the generic Pages deploy to a TTS issue title/artifact/prose and issue-write side effects.

## Auditor self-correction

The earlier broad statement that reversible cards were fully intact in both physical states was not supported by the test matrix at that time. Broad green semantic/raster CI was real but incomplete. The exact correction and evidence are preserved in:

`../incoming/auditor-brain/2026-07-25-r2/REPORT.md`

## AuditRepo control-plane correction

AuditRepo report validation had a control-flow bug: the empty-report check was nested under the missing-SHA branch. PR #49 fixed it and merged as `6cba8af0e5e8d7396d236a1f57558b2ff7e5db3e`; exact run `30166440002` passed structure, changed-intake ratchet, black-box regression, matrix diagnostics and repository-history forensic.

## Active owners at capture time

- PR #286: sole reversible-card physical product correction owner.
- PR #293: draft acceptance-ledger projection; requires generic/least-privilege refactor before merge.
- Source #292: generic whole-artifact provenance identity.
- Source #294: notifier failure/recovery state machine and real IndexNow ownership.
- Source #295: build once and deploy the exact readiness artifact.
- Research #16: machine-readable authority/supersession/rights manifest.

## Merge gates

- #286: no temporary files; both physical states and five route families green; no unrelated priority weakening.
- #293: no TTS-specific generic issue-title contract; fail-closed artifact identity; downstream/retryable ledger side effect.
- Production authority: exact readiness + Pages + run-addressed pointer/evidence + live artifact imported for the same SHA.
'''
if REVERIFY.exists():
    raise RuntimeError(f'reverify already exists: {REVERIFY}')
REVERIFY.write_text(reverify, encoding='utf-8')

# The final branch must contain no one-shot materializer/control-plane files.
for temp in (SELF, WORKFLOW):
    if temp.exists():
        temp.unlink()

print('CURRENT HEAD RECONCILIATION: PASS')
print(NEXT)
print(MATRIX)
print(REVERIFY)
