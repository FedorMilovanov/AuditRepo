#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
PROJECT = ROOT / 'projects' / 'gb-is-my-strength'
NEXT = PROJECT / 'NEXT_AGENT_PROMPT.md'
MATRIX = PROJECT / 'verified' / 'MASTER_BUG_MATRIX.md'
OLD_REVERIFY = PROJECT / 'reverify' / 'CURRENT_HEAD_REVERIFY_2026-07-25_dab31616_auditor-r2.md'
NEW_REVERIFY = PROJECT / 'reverify' / 'CURRENT_HEAD_REVERIFY_2026-07-25_e8c41d54_auditor-r2.md'
WORKFLOW = ROOT / '.github' / 'workflows' / '_temp-reconcile-current-e8c41d54.yml'
SELF = Path(__file__).resolve()


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected exactly one match, got {count}')
    return text.replace(old, new, 1)


next_text = '''# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived. Bug status and counters belong to `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary, shared-surface ownership and next execution order.

**Source main:** `e8c41d54512a9c5090dd9d8761a5ee912505c8fc`
**Last fully imported exact production witness:** ✅ `8a5352671375fdb01b6c30273c25ec4283a13f69`
**Current production candidate:** ⚠️ `e8c41d54512a9c5090dd9d8761a5ee912505c8fc` — PR #297 corrected the merged #293 ledger architecture in source, but exact readiness, Pages, run-addressed provenance, TTS witness artifact and downstream ledger result have not yet been imported into AuditRepo.
**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_e8c41d54_auditor-r2.md`
**Immutable forensic intake:** `incoming/auditor-brain/2026-07-25-r2/REPORT.md`

## 1) Exact boundary

Source and production remain separate authorities:

- source `main` is `e8c41d54` after merged corrective PR #297;
- PR #290 fixed manual exact checkout and replaced the mutable flat SHA object with `deployments/current.json` plus run-addressed evidence;
- PR #293 then coupled repository acceptance projection to the Pages deploy; PR #297 has now corrected that source architecture by moving a truthful TTS capability witness to a retryable downstream ledger with exact artifact identity and least privilege;
- whole-site release-candidate identity is still unresolved: the provenance record remains TTS-coupled and readiness/deploy still build different artifacts. Source issues #292 and #295 remain open;
- PR #283 removed duplicate PDF ownership, but a later physical two-state contract found a flipped-back specificity defect. PR #286 remains the sole active product correction owner;
- temporary Genesis transport PR #296 completed its read-only check and closed without merge. Issue #287 remains the transport/finalizer coordination record, but there is no active five-route product activation PR;
- PR #288 is closed without merge as obsolete timing evidence; issue #289 is closed as a superseded old-SHA acceptance target, without claiming deployment success;
- the last fully pinned AuditRepo production authority remains `8a535267` until exact newer run IDs and artifacts are imported;
- this update advances source/orchestration truth only and does not manufacture missing production evidence.

Canonical evidence:

- `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_e8c41d54_auditor-r2.md`;
- `incoming/auditor-brain/2026-07-25-r2/REPORT.md`.

## 2) Current active pull requests

At this snapshot the only active source PR is:

- **#286 — reversible-card physical PDF product repair**: draft, based on current `main@e8c41d54`. It uses generic flipped-state specificity for `.flip-card`, `.heart-flip-card` and `.error-flip-card`, preserves screen rotation and claims guarded physical front/back PASS. Final merge still requires an actually executed exact-head permanent matrix, inspected Print Paper artifact, no temporary files, and a contract that restores the initially visible state rather than forcing front during test cleanup.

There is no active Genesis 6 product PR. A future finalizer/activation must start from fresh current main, verify the complete issue #287 archive, use one owner and self-clean all transport scaffolding. Draft/noindex remains the safe default unless activation is explicitly approved.

## 3) Shared-surface ownership

- One shared/route surface has one active product owner.
- PR #286 is the sole active print product owner. Do not revive #280, reopen #283 or create another print implementation lane.
- The merged #297 ledger is source architecture, not proof of current production. Do not reopen #293 or add a parallel TTS acceptance workflow.
- Source #292 owns generic whole-artifact provenance identity; #295 owns build-once promotion; #294 owns notifier lifecycle; #64 owns workflow-policy migration.
- Issue #287 may coordinate Genesis transport/finalization, but no temporary verifier or snapshot is a product owner.
- Before every lane, refresh `main`, open PRs, changed filenames, active workflows and shared-file intersections.

## 4) CI status semantics

Do not treat every red status as the same defect. Classify it first:

1. **protective failure** — Shared Files Guard rejects temporary write workflows or cross-lane ownership in a final tree;
2. **product regression** — example: flipped card retains 3D transform or physical markers split/disappear;
3. **cancelled/superseded run** — a newer head or concurrency cancelled an old run;
4. **stale alert lifecycle** — an old failure issue remains open after a newer green recovery;
5. **post-publish ledger failure** — downstream repository projection failed after Pages may already be healthy; it must not be presented as a deployment failure;
6. **temporary transport verification failure** — a payload/hash failure blocks that transport lane only and is not proof of a live-site regression.

`notify-on-failure.yml` still lacks a recovery state machine, subscribes to stale IndexNow ownership, does not genuinely consume route-impact artifacts and may present workflow-name heuristics as root cause. Source issue: #294.

## 5) Active work, in order

1. **Finish source repair #286**
   - verify current PR head/body SHA consistency;
   - require executed exact-head front and flipped-back PDFs, atomic outer root, static/flat/untransformed inner wrapper, auto height, no transition and same-page markers;
   - prove `GBPrintPagination.reset()` restores an initially front card and an initially flipped card without test cleanup overwriting the state under test;
   - retain generic card families and screen flip behavior;
   - remove any temporary workflow/materializer and inspect the exact artifact before merge.

2. **Converge release artifact architecture (#295 + #292)**
   - readiness builds and validates one exact candidate under a pinned toolchain;
   - publish whole-artifact digest plus generic build/route/Pagefind/sitemap/feed/core identities;
   - deploy promotes that same artifact without a second install/build;
   - capability evidence remains under extensions such as `extensions.tts`.

3. **Fix CI alert lifecycle (#294)**
   - listen to actual readiness/deploy ownership;
   - open/update on failure and close only on a newer exact success;
   - distinguish cancelled/superseded and post-publish ledger failures;
   - quote exact failed jobs/steps and real artifact data;
   - explicitly choose non-blocking or separate-workflow ownership for IndexNow.

4. **Replace shadow-era workflow policy (#64)**
   - derive route coverage from the effective route registry;
   - separate source, candidate-dist, promotion and live-witness capability classes;
   - enforce read-only validation and least privilege;
   - stop requiring the deploy workflow itself to reinstall, rebuild and rerun route-specific gates;
   - replace raw numeric ratchets with named semantic budgets where appropriate.

5. **Define one Genesis 6 finalizer/activation owner (#287)**
   - reconstruct and verify all declared chunks/full archive from fresh current main;
   - reject unsafe archive paths and ambiguous 3-way application;
   - keep transport evidence outside the final product diff;
   - preserve draft/noindex unless activation is separately approved;
   - no second snapshot/verifier workstream.

6. **Add Research authority manifest (Research #16)**
   - machine-readable IDs, scope, authority, supersedes/applies-to, source grade, rights state and pinned Research SHA;
   - block cycles, duplicate authority, missing overlays, stale site imports and unresolved image rights;
   - consolidate XLVIII + XLIX + L + LI through a deterministic publication compiler or final dossiers.

## 6) Non-negotiable gates

Before source merge:

- exact-head changed-file and ownership refresh;
- Shared Files Guard and control-plane audit for workflow/package changes;
- relevant Native Source/Route Registry/Visual gates;
- focused browser/PDF/content contract plus broad family regression;
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

# Fix malformed table separators introduced by the previous reconciliation.
closed_prefix = '''| ID | Описание | Коммит |
| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records `main@dab31616`, merged #293, corrective #297, real print scope #286, temporary Genesis verifier #296 and the fail-closed production-evidence gap. Immutable R2 intake preserves the drift/self-correction evidence. | `dab31616` source + AuditRepo R2 reconciliation |
| ORCH-DUPLICATE-PRINT-SURFACE-OWNERS | ✅ **FIXED 2026-07-25.** PR #283 became the sole accepted PDF product owner and PR #280 closed without merge. A later physical contract found a separate residual back-face product defect; PR #286 is now the sole correction owner rather than a competing implementation. | PR #283 merged; PR #280 closed; PR #286 sole follow-up |
| AUDITREPO-REPORT-SHA-BYPASS | ✅ **FIXED/AUDITREPO CI VERIFIED 2026-07-25.** SHA-bearing empty report scaffolds no longer bypass content validation. New/modified empty intakes block, historical debt remains visible, strict mode and a black-box temporary-tree regression are permanent. | AuditRepo `6cba8af0`; run `30166440002` |
|---|---|---|
'''
closed_fixed = '''| ID | Описание | Коммит |
|---|---|---|
| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records `main@e8c41d54`, merged corrective #297, sole active print PR #286, closed temporary Genesis verifier #296 and the fail-closed production-evidence gap. Immutable R2 intake preserves the drift/self-correction evidence. | `e8c41d54` source + AuditRepo R2 reconciliation |
| ORCH-DUPLICATE-PRINT-SURFACE-OWNERS | ✅ **FIXED 2026-07-25.** PR #283 became the sole accepted PDF product owner and PR #280 closed without merge. A later physical contract found a separate residual back-face product defect; PR #286 is now the sole correction owner rather than a competing implementation. | PR #283 merged; PR #280 closed; PR #286 sole follow-up |
| AUDITREPO-REPORT-SHA-BYPASS | ✅ **FIXED/AUDITREPO CI VERIFIED 2026-07-25.** SHA-bearing empty report scaffolds no longer bypass content validation. New/modified empty intakes block, historical debt remains visible, strict mode and a black-box temporary-tree regression are permanent. | AuditRepo `6cba8af0`; run `30166440002` |
| DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #297 removed repository mutation and excess permissions from Pages deploy, made the TTS evidence upload fail closed, and moved exact artifact/report validation plus a truthful `extensions.tts` capability witness into a retryable downstream ledger. Whole-site artifact identity remains #292/#295. | `e8c41d54` PR#297; exact head `1ae9c9f5` |
'''
matrix = replace_once(matrix, closed_prefix, closed_fixed, 'closed table separator and row')

p1_prefix = '''| ID | Описание | Witnesses |
| PRINT-REVERSIBLE-BACK-3D-FLOW | Flipped reversible-card outer root remains atomic, but the inner wrapper retains `matrix3d` and the active back-face physical markers disappear (`0/0`). PR #286 must fix one generic product owner and remove temporary materializers before merge. | PR #286 physical PDFs/runs `30165390363`, `30166039373`; R2 intake |
| DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING | PR #293 merged its TTS-specific repository recorder inside the generic Pages deploy despite the architecture review. Draft corrective PR #297 removes deploy mutation/permissions, validates exact artifact ID/size/digest/report and records a downstream generic envelope with `extensions.tts`; row stays open until #297 exact-head and post-merge witness pass. | merged #293; corrective PR #297; source #292/#295 |
| CI-ALERT-NO-RECOVERY-STATE | Failure notifier has no exact-head recovery/superseded state, does not actually download route-impact evidence, guesses causes/routes, misses the real readiness gateway and subscribes to stale IndexNow workflow ownership while deploy swallows IndexNow failures. | source issue #294; R2 intake |
| CI-BUILD-VALIDATION-DUPLICATION | Readiness validates one Node-22.12 production-like dist but uploads no candidate; deploy uses floating Node 22, repeats install/validation/build and publishes a separately produced dist instead of promoting the exact verified artifact. | source issue #295; current readiness/deploy graph |
| DEPLOY-PROVENANCE-TTS-COUPLING | PR #290 fixed exact-checkout and flat-SHA overwrite races with `current.json` plus run-addressed evidence. Remaining record is top-level TTS-specific and not bound to the whole readiness/deployed Pages artifact digest, route/build identity or pinned toolchain. | merged PR #290; open source #292 + #295 |
| CI-WORKFLOW-PROLIFERATION | Control plane expanded from the earlier 19-workflow baseline to roughly 26 permanent workflows with repeated heavy setup/build/test sections. Capability inventory and convergence are required before adding workflows. | current control-plane artifacts; forensic delta 2026-07-25 |
| WORKFLOW-POLICY-SHADOW-ERA | Workflow policy still protects historical shadow/route names and hardcoded dist paths instead of effective-route-registry coverage, capability gates, read-only validation and permission contracts. | existing source issue #64 |
| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, run-addressed provenance, live artifact and downstream capability-witness identifiers for current candidate `dab31616` are imported. Superseded issue #289 was closed without claiming deployment. | `dab31616` candidate; evidence import pending |
|---|---|---|
'''
p1_fixed = '''| ID | Описание | Witnesses |
|---|---|---|
| PRINT-REVERSIBLE-BACK-3D-FLOW | Flipped reversible-card outer root remains atomic, but the inner wrapper retained `matrix3d` and the active back-face physical markers disappeared (`0/0`). PR #286 is the sole generic correction owner; merge requires exact-head permanent front/back evidence and state-restoration proof. | PR #286 physical PDFs/runs `30165390363`, `30166039373`; R2 intake |
| CI-ALERT-NO-RECOVERY-STATE | Failure notifier has no exact-head recovery/superseded state, does not actually download route-impact evidence, guesses causes/routes, misses the real readiness gateway and subscribes to stale IndexNow workflow ownership while deploy swallows IndexNow failures. | source issue #294; R2 intake |
| CI-BUILD-VALIDATION-DUPLICATION | Readiness validates one Node-22.12 production-like dist but uploads no candidate; deploy uses floating Node 22, repeats install/validation/build and publishes a separately produced dist instead of promoting the exact verified artifact. | source issue #295; current readiness/deploy graph |
| DEPLOY-PROVENANCE-TTS-COUPLING | PR #290 fixed exact-checkout and flat-SHA overwrite races with `current.json` plus run-addressed evidence. Remaining record is top-level TTS-specific and not bound to the whole readiness/deployed Pages artifact digest, route/build identity or pinned toolchain. | merged PR #290; open source #292 + #295 |
| CI-WORKFLOW-PROLIFERATION | Control plane expanded from the earlier 19-workflow baseline to roughly 26 permanent workflows with repeated heavy setup/build/test sections. Capability inventory and convergence are required before adding workflows. | current control-plane artifacts; forensic delta 2026-07-25 |
| WORKFLOW-POLICY-SHADOW-ERA | Workflow policy still protects historical shadow/route names and hardcoded dist paths instead of effective-route-registry coverage, capability gates, read-only validation and permission contracts. | existing source issue #64 |
| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, run-addressed provenance, live artifact and downstream capability-witness identifiers for current candidate `e8c41d54` are imported. Superseded issue #289 was closed without claiming deployment. | `e8c41d54` candidate; evidence import pending |
'''
matrix = replace_once(matrix, p1_prefix, p1_fixed, 'P1 table separator and closed row removal')

p2_prefix = '''| ID | Описание | Witnesses |
| GENESIS6-ACTIVATION-OWNER-GAP | Canonical Genesis 6 MDX/images remain draft/noindex. Issue #287 and temporary PR #296 now own payload transport verification only; they are not a final product activation owner. #296 must close without merge, and at most one fresh-main finalizer/activation lane may consume all 26 verified chunks and self-clean. | issue #287; temporary PR #296; no final product PR yet |
| RESEARCH-AUTHORITY-MANIFEST-MISSING | Genesis/Jude/Peter publication still requires manual composition of XLVIII base + XLIX text corrections + L rights decisions + LI precision overlays. Add machine-readable authority/supersession/rights manifest and pinned Research SHA/compiler. | Research issue #16; Research `b654c537` |
|---|---|---|
'''
p2_fixed = '''| ID | Описание | Witnesses |
|---|---|---|
| GENESIS6-ACTIVATION-OWNER-GAP | Canonical Genesis 6 MDX/images remain draft/noindex. Temporary verifier PR #296 completed and closed without merge; issue #287 remains coordination evidence, but no fresh-main five-route product finalizer/activation owner exists. | issue #287; PR #296 closed without merge |
| RESEARCH-AUTHORITY-MANIFEST-MISSING | Genesis/Jude/Peter publication still requires manual composition of XLVIII base + XLIX text corrections + L rights decisions + LI precision overlays. Add machine-readable authority/supersession/rights manifest and pinned Research SHA/compiler. | Research issue #16; Research `b654c537` |
'''
matrix = replace_once(matrix, p2_prefix, p2_fixed, 'P2 table separator')

# Current source/deploy authority and counters.
matrix = replace_once(matrix,
    '| Source HEAD | `dab31616ca77b7833e9d12ad9c80d63a751ed19e` (current source main; PR #293 TTS acceptance recorder merged; corrective ledger PR #297, print PR #286 and temporary Genesis transport verifier #296 are active) |',
    '| Source HEAD | `e8c41d54512a9c5090dd9d8761a5ee912505c8fc` (current source main; corrective capability-witness ledger PR #297 merged; print PR #286 is the only active source PR) |',
    'source head')
matrix = replace_once(matrix,
    '| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Last fully imported exact production witness remains `8a535267`. Current candidate `dab31616` includes the merged #293 recorder, but exact readiness, Pages, run-addressed provenance, witness artifact and downstream ledger evidence are not yet imported. Current source is not claimed deployed here. |',
    '| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Last fully imported exact production witness remains `8a535267`. Current candidate `e8c41d54` has the corrected downstream capability-witness architecture in source, but exact readiness, Pages, run-addressed provenance, witness artifact and ledger result are not yet imported. Current source is not claimed deployed here. |',
    'deploy row')
matrix = replace_once(matrix,
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_dab31616_auditor-r2.md` |',
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_e8c41d54_auditor-r2.md` |',
    'reverify row')
matrix = replace_once(matrix,
    '⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `dab31616`; last fully imported exact production witness: `8a535267`; current production candidate requiring evidence import: `dab31616`; source/orchestration evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_dab31616_auditor-r2.md`.',
    '⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `e8c41d54`; last fully imported exact production witness: `8a535267`; current production candidate requiring evidence import: `e8c41d54`; source/orchestration evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_e8c41d54_auditor-r2.md`.',
    'authority warning')
matrix = replace_once(matrix, '## ✅ ЗАКРЫТО (151)', '## ✅ ЗАКРЫТО (152)', 'closed count')
matrix = replace_once(matrix, '## 🟠 P1 — ОТКРЫТО (102)', '## 🟠 P1 — ОТКРЫТО (101)', 'P1 count')

# Derive summary from canonical section counters after the state transition.
patterns = {
    'closed': r'^## ✅ ЗАКРЫТО \((\d+)\)$',
    'p0': r'^## ✅ P0/P1 — ОТКРЫТО \((\d+)\)$',
    'p1': r'^## 🟠 P1 — ОТКРЫТО \((\d+)\)$',
    'p2': r'^## 🟡 P2 — ОТКРЫТО \((\d+)\)$',
    'p3': r'^## 🟢 P3 — ОТКРЫТО \((\d+)\)$',
    'refactor': r'^## 🔵 P3 — РЕФАКТОРИНГ \((\d+)\)$',
    'auditrepo': r'^## 🟣 AUDITREPO \((\d+)\)$',
}
counts = {}
for key, pattern in patterns.items():
    found = re.findall(pattern, matrix, re.MULTILINE)
    if len(found) != 1:
        raise RuntimeError(f'{key}: expected one counter, got {found}')
    counts[key] = int(found[0])
open_total = counts['p0'] + counts['p1'] + counts['p2'] + counts['p3'] + counts['refactor'] + counts['auditrepo']

stats_pattern = re.compile(
    r'^## Статистика \(обновлено .*?\)\n\n'
    r'\| Категория \| Количество \|\n'
    r'\|---\|---\|\n'
    r'\| Закрыто \(fixed\) \| \d+ \|\n'
    r'\| \*\*P0 открыто\*\* \| \*\*\d+\*\* \|\n'
    r'\| P1 открыто \| \d+ \|\n'
    r'\| P2 открыто \| \d+ \|\n'
    r'\| P3 открыто \| \d+ \|\n'
    r'\| Рефакторинг \| \d+ \|\n'
    r'\| AuditRepo \| \d+ \|\n'
    r'\| \*\*Всего открыто \(матрица\)\*\* \| \*\*\d+\*\* \|',
    re.MULTILINE,
)
stats = f'''## Статистика (обновлено 2026-07-25: source e8c41d54 + auditor R2 reconciliation)

| Категория | Количество |
|---|---|
| Закрыто (fixed) | {counts['closed']} |
| **P0 открыто** | **{counts['p0']}** |
| P1 открыто | {counts['p1']} |
| P2 открыто | {counts['p2']} |
| P3 открыто | {counts['p3']} |
| Рефакторинг | {counts['refactor']} |
| AuditRepo | {counts['auditrepo']} |
| **Всего открыто (матрица)** | **{open_total}** |'''
matrix, substitutions = stats_pattern.subn(stats, matrix, count=1)
if substitutions != 1:
    raise RuntimeError(f'statistics table replacement count: {substitutions}')

session_match = re.search(r'^## Session log(?: \(append-only\))?\n', matrix, re.MULTILINE)
if not session_match:
    raise RuntimeError('session log header not found')
entry = '\n- **2026-07-25 auditor R2 correction (`e8c41d54`)** — merged #297 closes the source acceptance-ledger coupling while whole-artifact/build-once issues #292/#295 remain. PR #296 closed without merge; #286 is the only active source PR. Fixed malformed table separators and recalculated summary counters from canonical section counts. Production authority remains fail-closed.\n'
matrix = matrix[:session_match.end()] + entry + matrix[session_match.end():]
MATRIX.write_text(matrix, encoding='utf-8')

reverify = '''# CURRENT HEAD REVERIFY — 2026-07-25 — `e8c41d54` auditor R2 correction

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `e8c41d54512a9c5090dd9d8761a5ee912505c8fc`
- AuditRepo authority before this transaction: `0fa085ea252e824367530e94df0e23b255fae112`
- Research authority observed: `b654c5375a7b212ff9b42c08bb0193eeaad70746`
- Last fully imported exact production witness: `8a5352671375fdb01b6c30273c25ec4283a13f69`

Source and production remain separate. This document does not claim `e8c41d54` deployed.

## Source delta after `dab31616`

1. PR #297 merged as `e8c41d54` and corrects the architecture introduced by #293.
2. Pages deploy no longer mutates repository issues or carries issue/PR write permission for acceptance projection.
3. A separate retryable `Deployment Witness Ledger` consumes only successful same-repository main deploys, downloads the exact triggering-run TTS artifact, requires one non-expired artifact with ID/size/SHA-256 digest, parses one matching PASS report and records a generic envelope with TTS under `extensions.tts`.
4. The claim is explicitly limited to `TTS capability witness accepted`; whole Pages artifact identity and build-once promotion remain source issues #292 and #295.
5. PR #286 remains the sole active source PR and sole physical reversible-card correction owner.
6. Temporary Genesis transport PR #296 completed its read-only verification and closed without merge. Issue #287 remains coordination evidence; no active five-route product finalizer exists.

## AuditRepo self-corrections in this transaction

- moved `DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING` from open P1 to source-fixed/closed after #297;
- kept the post-merge production witness gap open;
- fixed Markdown table separators that had been inserted after new rows instead of immediately after headers;
- recalculated the summary from canonical section counters: closed 152, P0 0, P1 101, P2 37, P3 51, refactoring 4, AuditRepo 4, total open 197.

## Active owners at capture time

- PR #286: reversible-card physical product correction.
- Source #292: generic whole-artifact provenance identity.
- Source #294: notifier failure/recovery state machine and current IndexNow ownership.
- Source #295: build once and deploy the exact readiness artifact.
- Source #64: capability/registry workflow policy migration.
- Source #287: Genesis transport/finalizer coordination; no active product PR.
- Research #16: authority/supersession/rights manifest.

## Merge and production gates

- #286: executed exact-head permanent workflows, front/back physical artifact, true initial-state restoration, no temporary files and no unrelated semantic weakening.
- Production authority: exact readiness + Pages + run-addressed pointer/provenance + live TTS artifact + downstream ledger evidence imported for the same SHA.
- #292/#295 remain open until the whole promoted Pages artifact is the exact readiness candidate by digest.
'''
if OLD_REVERIFY.exists():
    OLD_REVERIFY.unlink()
if NEW_REVERIFY.exists():
    raise RuntimeError(f'new reverify already exists: {NEW_REVERIFY}')
NEW_REVERIFY.write_text(reverify, encoding='utf-8')

for temp in (SELF, WORKFLOW):
    if temp.exists():
        temp.unlink()

print('CURRENT HEAD E8C41D54 RECONCILIATION: PASS')
print(counts)
print({'open_total': open_total})
