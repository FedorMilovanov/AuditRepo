#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
PROJECT = ROOT / 'projects' / 'gb-is-my-strength'
NEXT = PROJECT / 'NEXT_AGENT_PROMPT.md'
MATRIX = PROJECT / 'verified' / 'MASTER_BUG_MATRIX.md'
OLD_REVERIFY = PROJECT / 'reverify' / 'CURRENT_HEAD_REVERIFY_2026-07-25_7fe46572_auditor-r2.md'
NEW_REVERIFY = PROJECT / 'reverify' / 'CURRENT_HEAD_REVERIFY_2026-07-25_dab31616_auditor-r2.md'
WORKFLOW = ROOT / '.github' / 'workflows' / '_temp-reconcile-current-dab31616.yml'
SELF = Path(__file__).resolve()


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected exactly one match, got {count}')
    return text.replace(old, new, 1)


next_text = '''# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived. Bug status and counters belong to `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary, shared-surface ownership and next execution order.

**Source main:** `dab31616ca77b7833e9d12ad9c80d63a751ed19e`
**Last fully imported exact production witness:** ✅ `8a5352671375fdb01b6c30273c25ec4283a13f69`
**Current production candidate:** ⚠️ `dab31616ca77b7833e9d12ad9c80d63a751ed19e` — PR #293 merged its TTS acceptance recorder, but exact readiness, Pages, run-addressed provenance, witness artifact and downstream repository ledger have not yet been imported into AuditRepo.
**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_dab31616_auditor-r2.md`
**Immutable forensic intake:** `incoming/auditor-brain/2026-07-25-r2/REPORT.md`

## 1) Exact boundary

Source and production remain separate authorities:

- source `main` is `dab31616` after merged PR #293;
- PR #290 fixed manual exact-checkout and replaced the mutable flat SHA object with `deployments/current.json` plus run-addressed evidence;
- PR #293 then persisted TTS acceptance from inside the Pages deploy workflow; the architecture review was valid, and draft PR #297 now owns the corrective move to a downstream, retryable capability-witness ledger;
- the whole Pages artifact is still not bound to the readiness candidate digest; generic/artifact identity remains open in source issue #292 and build-once issue #295;
- PR #283 removed duplicate PDF ownership, but a later physical two-state contract proved the flipped back face still retains 3D transform; PR #286 owns the sole product correction;
- PR #296 is a temporary read-only Genesis 6 transport verifier for issue #287. It is not the final five-route activation PR and must close without merge after verification;
- PR #288 is closed without merge as an obsolete propagation-timing witness; issue #289 is closed as a superseded old-SHA acceptance target, without claiming production success;
- the last fully pinned AuditRepo production authority remains `8a535267` until newer exact run IDs and artifacts are imported;
- this update advances source/orchestration truth only and does not manufacture missing production evidence.

Canonical evidence:

- `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_dab31616_auditor-r2.md`;
- `incoming/auditor-brain/2026-07-25-r2/REPORT.md`.

## 2) Current active pull requests

At this snapshot the active source PRs are:

- **#286 — reversible-card physical PDF product repair**: draft. The front state passes; the flipped back state retained `matrix3d` and lost markers. Final head must publish one generic inner-wrapper print rule for all three card families, remove every `_temp-*` materializer/workflow and pass exact-head front/back PDFs plus the five-route matrix. Do not weaken unrelated screen rules to satisfy a raw `!important` count.
- **#297 — downstream deployment capability-witness ledger**: draft corrective successor to merged #293. It removes repository metadata mutation from the Pages job, downloads the exact successful-run artifact, validates artifact ID/size/digest and report PASS, records a generic envelope with `extensions.tts`, and truthfully limits the claim to a TTS capability witness. Whole-site artifact identity remains #292/#295.
- **#296 — Genesis 6 V3 transport verifier**: temporary read-only PR. It verifies numbered issue #287 payload chunks and must close without merge. A product activation/finalizer lane must still have one explicit owner, reconstruct all 26 chunks, verify the full archive, apply on fresh current main and self-clean every temporary file.

## 3) Shared-surface ownership

- One shared/route surface has one active product owner.
- PR #286 is the sole active print product owner. Do not revive #280, reopen #283 or create another print implementation lane.
- PR #297 owns only the correction of the merged #293 acceptance-ledger projection. It must not claim build-once artifact architecture (#295) or generic provenance completion (#292).
- PR #296 owns transport verification only. It must not become a second Genesis product implementation beside a later activation/finalizer PR.
- Before every lane, refresh `main`, open PRs, changed filenames, active workflows and shared-file intersections.

## 4) CI status semantics

Do not treat every red status as the same defect. Classify it first:

1. **protective failure** — Shared Files Guard rejecting temporary write workflows in a final tree;
2. **product regression** — flipped card inner wrapper remains in 3D flow and active-face markers are `0/0`;
3. **cancelled/superseded run** — a newer head or Pages concurrency cancelled the old run;
4. **stale alert lifecycle** — an old failure issue remains open after a green recovery;
5. **post-publish ledger failure** — repository comment/issue projection failed after Pages may already be healthy; it must not be presented as a deployment failure;
6. **temporary transport verification failure** — chunk/hash/shape failure in #296 blocks the transport lane only and is not proof that the live site regressed.

`notify-on-failure.yml` still lacks a recovery state machine, subscribes to stale IndexNow ownership, does not actually consume route-impact artifacts and may present workflow-name heuristics as root cause. Source issue: #294.

## 5) Active work, in order

1. **Finish source repair #286**
   - fix the product owner, not the test;
   - require front and flipped-back PDFs, atomic outer root, static/untransformed inner wrapper and same-page markers;
   - retain generic `.flip-card`, `.heart-flip-card`, `.error-flip-card` families;
   - remove temporary workflow/materializer and review the exact artifact before merge.

2. **Review and finish corrective ledger #297**
   - deploy remains least-privilege and its result does not depend on repository issue projection;
   - exact artifact metadata/report/SHA/run/attempt are fail-closed;
   - machine marker, idempotency and ambiguity are permanent;
   - claim remains “TTS capability witness”, not whole-site acceptance;
   - no product CSS/JS or unrelated release ownership enters the PR.

3. **Converge release artifact architecture (#295 + #292)**
   - readiness builds and validates one exact candidate under a pinned toolchain;
   - publish whole-artifact digest and generic build/route identity;
   - deploy promotes the same artifact without a second install/build;
   - capability evidence lives under extensions such as `extensions.tts`.

4. **Finish and remove Genesis transport scaffolding (#287/#296)**
   - verify all `000–025` chunks and full archive SHA-256, not a partial subset;
   - close #296 without merge after evidence;
   - create at most one explicit finalizer/activation owner from fresh current main;
   - final product commit contains no transport issue/workflow/temp payload and preserves draft/noindex unless activation is explicitly approved.

5. **Fix CI alert lifecycle (#294)**
   - listen to actual readiness/deploy ownership;
   - open/update on failure and close only on a newer exact success;
   - distinguish cancelled/superseded;
   - quote exact failed jobs/steps and real artifact data;
   - explicitly choose non-blocking or separate-workflow ownership for IndexNow.

6. **Replace shadow-era workflow policy (source issue #64)**
   - derive route coverage from effective route registry;
   - enforce read-only validation and permissions;
   - forbid mutating validation;
   - move from raw numeric ratchets to named semantic capability budgets where needed.

7. **Add Research authority manifest (Research issue #16)**
   - machine-readable IDs, scope, authority, supersedes/applies-to, source grade, rights state and pinned Research SHA;
   - block cycles, duplicate authority, missing overlays, stale site imports and unresolved image rights;
   - consolidate XLVIII + XLIX + L + LI through a deterministic publication compiler or final dossiers.

## 6) Non-negotiable gates

Before source merge:

- exact-head changed-file and ownership refresh;
- Shared Files Guard and control-plane audit for workflow/package changes;
- relevant Native Source/Route Registry/Visual gates;
- focused browser/PDF/transport contract plus broad family regression;
- production-like build when product or release surfaces change;
- no `_temp-*` workflow/materializer in final product scope;
- no unrelated semantic weakening to preserve a numeric count;
- no mutation in a nominally read-only validation step.

After a production-impacting merge:

- exact readiness;
- exact Pages deployment from the same verified artifact identity;
- generic live witness plus capability-specific evidence;
- downstream run-addressed acceptance record that cannot make a successful publish look failed;
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
    '| Source HEAD | `7fe46572e84003f703952ab15a6a82102652a98e` (current source main; PR #290 exact-SHA/run-addressed provenance follow-up merged; active print correction remains PR #286) |',
    '| Source HEAD | `dab31616ca77b7833e9d12ad9c80d63a751ed19e` (current source main; PR #293 TTS acceptance recorder merged; corrective ledger PR #297, print PR #286 and temporary Genesis transport verifier #296 are active) |',
    'source head')
matrix = replace_once(matrix,
    '| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Last fully imported exact production witness remains `8a535267`. Current candidate `7fe46572` has exact-SHA/run-addressed provenance source support, but exact readiness, Pages, live pointer/run object and evidence artifact are not yet imported. Current source is not claimed deployed here. |',
    '| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Last fully imported exact production witness remains `8a535267`. Current candidate `dab31616` includes the merged #293 recorder, but exact readiness, Pages, run-addressed provenance, witness artifact and downstream ledger evidence are not yet imported. Current source is not claimed deployed here. |',
    'deploy')
matrix = replace_once(matrix,
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_7fe46572_auditor-r2.md` |',
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_dab31616_auditor-r2.md` |',
    'reverify')
matrix = replace_once(matrix,
    '⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `7fe46572`; last fully imported exact production witness: `8a535267`; current production candidate requiring evidence import: `7fe46572`; source/orchestration evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_7fe46572_auditor-r2.md`.',
    '⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `dab31616`; last fully imported exact production witness: `8a535267`; current production candidate requiring evidence import: `dab31616`; source/orchestration evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_dab31616_auditor-r2.md`.',
    'authority warning')
matrix = replace_once(matrix,
    '| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records `main@7fe46572`, merged #290, the real product scope of #286, draft #293 boundaries and the fail-closed production-evidence gap. Immutable R2 intake preserves the drift/self-correction evidence. | `7fe46572` source + AuditRepo R2 reconciliation |',
    '| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records `main@dab31616`, merged #293, corrective #297, real print scope #286, temporary Genesis verifier #296 and the fail-closed production-evidence gap. Immutable R2 intake preserves the drift/self-correction evidence. | `dab31616` source + AuditRepo R2 reconciliation |',
    'ssot row')
matrix = replace_once(matrix,
    '| DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING | Draft PR #293 hardcodes a `P1(tts)` issue title, TTS artifact/prose and issue-write mutation into the generic Pages deploy. Acceptance projection must become generic, downstream/retryable, least-privilege and artifact-ID/digest bound. | PR #293 architecture review; source #292/#295 |',
    '| DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING | PR #293 merged its TTS-specific repository recorder inside the generic Pages deploy despite the architecture review. Draft corrective PR #297 removes deploy mutation/permissions, validates exact artifact ID/size/digest/report and records a downstream generic envelope with `extensions.tts`; row stays open until #297 exact-head and post-merge witness pass. | merged #293; corrective PR #297; source #292/#295 |',
    'ledger row')
matrix = replace_once(matrix,
    '| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, run-addressed provenance and live evidence identifiers for current candidate `7fe46572` are imported and reconciled. Superseded 9fc acceptance issue #289 was closed without claiming deployment. | `7fe46572` candidate; evidence import pending |',
    '| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, run-addressed provenance, live artifact and downstream capability-witness identifiers for current candidate `dab31616` are imported. Superseded issue #289 was closed without claiming deployment. | `dab31616` candidate; evidence import pending |',
    'production evidence row')
matrix = replace_once(matrix,
    '| GENESIS6-ACTIVATION-OWNER-GAP | Canonical Genesis 6 MDX/images are landed as intentional draft/noindex content, but no active five-route activation owner exists. Snapshots may not remain independent workstreams. | PR #285 closed/reset; no active activation PR |',
    '| GENESIS6-ACTIVATION-OWNER-GAP | Canonical Genesis 6 MDX/images remain draft/noindex. Issue #287 and temporary PR #296 now own payload transport verification only; they are not a final product activation owner. #296 must close without merge, and at most one fresh-main finalizer/activation lane may consume all 26 verified chunks and self-clean. | issue #287; temporary PR #296; no final product PR yet |',
    'Genesis row')

session_match = re.search(r'^## Session log(?: \(append-only\))?\n', matrix, re.MULTILINE)
if not session_match:
    raise RuntimeError('session header not found')
entry = '\n- **2026-07-25 auditor R2 follow-up (`dab31616`)** — PR #293 merged the in-deploy TTS acceptance recorder; corrective #297 now owns downstream generic capability-witness repair. Temporary Genesis transport verifier #296 is active but is not a final activation owner. Production authority remains fail-closed.\n'
matrix = matrix[:session_match.end()] + entry + matrix[session_match.end():]
MATRIX.write_text(matrix, encoding='utf-8')

reverify = '''# CURRENT HEAD REVERIFY — 2026-07-25 — `dab31616` auditor R2 follow-up

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `dab31616ca77b7833e9d12ad9c80d63a751ed19e`
- AuditRepo authority before this follow-up: branch based on `cede492445acef526f816d04a7cca67c6cf445da`
- Research authority observed: `b654c5375a7b212ff9b42c08bb0193eeaad70746`
- Last fully imported exact production witness: `8a5352671375fdb01b6c30273c25ec4283a13f69`

Source and production remain separate. This document does not claim `dab31616` deployed.

## Delta after `7fe46572`

1. PR #293 merged as `dab31616` and persisted TTS acceptance from inside the Pages deploy workflow.
2. The prior architecture review remains valid: publication and repository-ledger outcomes must be separate, and a TTS witness is not whole-site artifact acceptance.
3. Draft PR #297 is the explicit corrective successor. It removes issue-write/pull-request permissions and recorder calls from deploy, makes the TTS evidence upload fail closed, downloads the exact successful-run artifact in a downstream workflow, validates artifact ID/size/digest plus one PASS report and records a feature-neutral envelope with TTS under `extensions.tts`.
4. Whole Pages artifact identity and build-once promotion remain source issues #292 and #295; #297 correctly lists them as non-goals.
5. PR #286 remains the sole physical reversible-card repair owner.
6. Issue #287 and temporary PR #296 now verify Genesis 6 payload transport. They do not yet constitute a final five-route product activation owner and must not merge temporary verification files.

## Active owners at capture time

- PR #286: reversible-card physical product correction.
- PR #297: corrective downstream TTS capability-witness ledger.
- PR #296: temporary read-only Genesis transport verifier; close without merge.
- Source #292: generic whole-artifact provenance identity.
- Source #294: notifier failure/recovery state machine and current IndexNow ownership.
- Source #295: build once and deploy the exact readiness artifact.
- Research #16: authority/supersession/rights manifest.

## Merge gates

- #286: no temporary files; both physical states and five route families green; no unrelated priority weakening.
- #297: exact artifact metadata/report contract, least-privilege downstream workflow, idempotent marker and truthful TTS-only scope; no claim that #292/#295 are solved.
- #296: complete expected chunk subset/full payload checks, evidence retained, then close without merge.
- Production authority: exact readiness + Pages + run-addressed pointer/provenance + live artifact + downstream witness imported for the same SHA.
'''
if OLD_REVERIFY.exists():
    OLD_REVERIFY.unlink()
if NEW_REVERIFY.exists():
    raise RuntimeError(f'new reverify already exists: {NEW_REVERIFY}')
NEW_REVERIFY.write_text(reverify, encoding='utf-8')

for temp in (SELF, WORKFLOW):
    if temp.exists():
        temp.unlink()

print('CURRENT HEAD DAB31616 RECONCILIATION: PASS')
