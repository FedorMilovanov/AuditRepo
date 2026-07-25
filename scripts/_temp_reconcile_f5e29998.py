#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
PROJECT = ROOT / 'projects' / 'gb-is-my-strength'
NEXT = PROJECT / 'NEXT_AGENT_PROMPT.md'
MATRIX = PROJECT / 'verified' / 'MASTER_BUG_MATRIX.md'
REVERIFY = PROJECT / 'reverify' / 'CURRENT_HEAD_REVERIFY_2026-07-25_f5e29998_auditor-r4.md'
TEMP_WORKFLOW = ROOT / '.github' / 'workflows' / '_temp-reconcile-f5e29998.yml'
SELF = Path(__file__).resolve()

SOURCE = 'f5e29998c5b42cc9e4e7c917b1e1c1072aa52320'
SOURCE_SHORT = 'f5e29998'
PREVIOUS = 'e8c41d54512a9c5090dd9d8761a5ee912505c8fc'
LAST_PROD = '8a5352671375fdb01b6c30273c25ec4283a13f69'

NEXT_TEXT = f'''# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived. Bug status and counters belong to `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary, shared-surface ownership and next execution order.

**Source main:** `{SOURCE}`
**Last fully imported exact production witness:** ✅ `{LAST_PROD}`
**Current production candidate:** ⚠️ `{SOURCE}` — PR #286 merged after complete exact-head Chromium/WebKit/PDF proof, but exact readiness, Pages, run-addressed provenance, TTS witness artifact and downstream ledger result for the merge SHA have not yet been imported into AuditRepo.
**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f5e29998_auditor-r4.md`
**Immutable deep-audit intake:** `incoming/auditor-brain/2026-07-25-r3/REPORT.md`

## 1) Exact boundary

Source and production remain separate authorities:

- source `main` is `{SOURCE_SHORT}` after merged print PR #286;
- PR #286 fixed the reversible-card flipped-back print defect through generic selector specificity, without adding priority flags or weakening an unrelated screen rule;
- exact PR head `4dc1e155b990660687c568ded5541c10768d5d1c` passed the complete permanent workflow matrix, including physical front/back PDFs, raster audit, Chromium/WebKit public-surface traversal and state restoration;
- PR #297 remains the accepted source architecture for downstream TTS capability-witness recording; whole-site release identity is still unresolved because provenance remains capability-coupled and readiness/deploy still build separate artifacts;
- source issues #292 and #295 own generic whole-artifact provenance and build-once promotion; #294 owns failure/recovery lifecycle;
- R3 hardening issues #298–#303 own product goldens, homepage runtime testing, shared series capabilities, privileged Actions/pinning, deterministic fonts and redirect-chain enforcement;
- issue #287 remains a temporary Genesis transport coordination record, not an active product owner;
- the last fully pinned AuditRepo production authority remains `{LAST_PROD}` until exact newer run IDs and artifacts are imported;
- this update advances source/CI truth only and does not manufacture deployment evidence.

Canonical evidence:

- `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f5e29998_auditor-r4.md`;
- `incoming/auditor-brain/2026-07-25-r3/REPORT.md`.

## 2) Current active pull requests

At this snapshot there are **no open source pull requests**.

PR #286 is merged and no longer owns an active lane. Do not reopen #280/#283/#286 or create another print implementation branch unless a new exact regression is reproduced.

There is no active Genesis 6 product PR. A future finalizer/activation must start from fresh current main, verify the complete issue #287 archive, use one owner and self-clean all transport scaffolding. Draft/noindex remains the safe default unless activation is explicitly approved.

## 3) Shared-surface ownership

- One shared/route surface has one active product owner.
- The reversible-card print defect is source-closed through merged #286; permanent Print Paper contracts now own regression detection.
- The merged #297 ledger is source architecture, not proof of current production. Do not reopen #293 or add a parallel TTS acceptance workflow.
- Source #292 owns generic whole-artifact provenance identity; #295 owns build-once promotion; #294 owns notifier lifecycle; #64 owns workflow-policy migration.
- Issues #298–#303 are separate R3 hardening contracts and must not be absorbed into unrelated route-specific lanes.
- Issue #287 may coordinate Genesis transport/finalization, but no temporary verifier or snapshot is a product owner.
- Before every lane, refresh `main`, open PRs, changed filenames, active workflows and shared-file intersections.

## 4) CI status semantics

Do not treat every red status as the same defect. Classify it first:

1. **protective failure** — Shared Files Guard rejects temporary write workflows or cross-lane ownership in a final tree;
2. **product regression** — a permanent browser/PDF/runtime contract fails on the exact head;
3. **cancelled/superseded run** — a newer head or concurrency cancelled an old run;
4. **stale alert lifecycle** — an old failure issue remains open after a newer green recovery;
5. **post-publish ledger failure** — downstream repository projection failed after Pages may already be healthy; it must not be presented as a deployment failure;
6. **temporary transport verification failure** — a payload/hash failure blocks that transport lane only and is not proof of a live-site regression.

`notify-on-failure.yml` still lacks a recovery state machine, does not genuinely consume route-impact artifacts and may present workflow-name heuristics as root cause. Source issue: #294.

## 5) Active work, in order

1. **Import or establish exact production evidence for `{SOURCE_SHORT}`**
   - require readiness, Pages, run-addressed provenance, live report artifact and downstream ledger for the same merge SHA;
   - distinguish a missing ledger target from a failed deployment;
   - do not advance production authority from source CI alone.

2. **Converge release artifact architecture (#295 + #292)**
   - readiness builds and validates one exact candidate under a pinned toolchain;
   - publish whole-artifact digest plus generic build/route/Pagefind/sitemap/feed/core identities;
   - deploy promotes that same artifact without a second install/build;
   - capability evidence remains under extensions such as `extensions.tts`.

3. **Fix CI alert lifecycle (#294)**
   - listen to the actual readiness/deploy/ledger ownership graph;
   - open/update on failure and close only on a newer exact success;
   - distinguish cancelled/superseded and post-publish ledger failures;
   - quote exact failed jobs/steps and real artifact data.

4. **Harden the control plane (#301 + #64)**
   - inventory every write permission, OIDC/deployment surface and persisted credential;
   - pin privileged third-party Actions by full commit SHA;
   - derive workflow capability policy from the effective registry rather than shadow-era route names;
   - keep validation read-only and least-privilege.

5. **Add product-level browser and visual barriers (#298 + #299 + #300)**
   - owner-approved immutable product goldens separate from legacy↔dist parity;
   - permanent Chromium/WebKit homepage interaction contract;
   - require every `surface: series` route to consume the shared reader capability interface or an explicit machine-readable exception.

6. **Make external inputs deterministic (#302 + #303)**
   - fail-closed font manifest with format/size/SHA verification;
   - enforce source-link policy on every redirect hop, including private/local/plain-HTTP/error destinations.

7. **Define one Genesis 6 finalizer/activation owner (#287)**
   - reconstruct and verify all declared chunks/full archive from fresh current main;
   - reject unsafe archive paths and ambiguous 3-way application;
   - keep transport evidence outside the final product diff;
   - preserve draft/noindex unless activation is separately approved.

8. **Add Research authority manifest (Research #16)**
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
NEXT.write_text(NEXT_TEXT, encoding='utf-8')

matrix = MATRIX.read_text(encoding='utf-8')

def replace_once(old: str, new: str, label: str) -> None:
    global matrix
    count = matrix.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected exactly one match, got {count}')
    matrix = matrix.replace(old, new, 1)

replace_once(
    f'| Source HEAD | `{PREVIOUS}` (current source main; corrective capability-witness ledger PR #297 merged; print PR #286 is the only active source PR) |',
    f'| Source HEAD | `{SOURCE}` (current source main; print PR #286 merged after complete exact-head physical PDF and cross-browser proof; no source PR is open) |',
    'source head row',
)
replace_once(
    '| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Last fully imported exact production witness remains `8a535267`. Current candidate `e8c41d54` has the corrected downstream capability-witness architecture in source, but exact readiness, Pages, run-addressed provenance, witness artifact and ledger result are not yet imported. Current source is not claimed deployed here. |',
    '| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Last fully imported exact production witness remains `8a535267`. Current candidate `f5e29998` includes merged print repair #286, but exact readiness, Pages, run-addressed provenance, witness artifact and downstream ledger result for this merge SHA are not yet imported. Current source is not claimed deployed here. |',
    'deploy row',
)
replace_once(
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_e8c41d54_auditor-r2.md` |',
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f5e29998_auditor-r4.md` |',
    'last reverify row',
)
replace_once(
    '⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `e8c41d54`; last fully imported exact production witness: `8a535267`; current production candidate requiring evidence import: `e8c41d54`; source/orchestration evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_e8c41d54_auditor-r2.md`.',
    '⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `f5e29998`; last fully imported exact production witness: `8a535267`; current production candidate requiring evidence import: `f5e29998`; source/orchestration evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f5e29998_auditor-r4.md`.',
    'historical authority note',
)
replace_once('## ✅ ЗАКРЫТО (152)', '## ✅ ЗАКРЫТО (153)', 'closed counter')
replace_once(
    '| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records `main@e8c41d54`, merged corrective #297, sole active print PR #286, closed temporary Genesis verifier #296 and the fail-closed production-evidence gap. Immutable R2 intake preserves the drift/self-correction evidence. | `e8c41d54` source + AuditRepo R2 reconciliation |',
    '| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records `main@f5e29998`, merged print repair #286, no open source PR and the fail-closed production-evidence gap. Immutable R2/R3 intakes preserve the drift and self-correction evidence. | `f5e29998` source + AuditRepo R4 reconciliation |',
    'ssot closed row',
)
replace_once(
    '| ORCH-DUPLICATE-PRINT-SURFACE-OWNERS | ✅ **FIXED 2026-07-25.** PR #283 became the sole accepted PDF product owner and PR #280 closed without merge. A later physical contract found a separate residual back-face product defect; PR #286 is now the sole correction owner rather than a competing implementation. | `d94b5488` |',
    '| ORCH-DUPLICATE-PRINT-SURFACE-OWNERS | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #283 became the sole accepted PDF owner, PR #280 closed without merge, and sole follow-up #286 merged as `f5e29998` after exact physical front/back proof. No competing print lane remains. | `f5e29998` |',
    'print ownership closed row',
)
closed_anchor = '| DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #297 removed repository mutation and excess permissions from Pages deploy, made the TTS evidence upload fail closed, and moved exact artifact/report validation plus a truthful `extensions.tts` capability witness into a retryable downstream ledger. Whole-site artifact identity remains #292/#295. | `e8c41d54` PR#297; exact head `1ae9c9f5` |'
print_closed = '| PRINT-REVERSIBLE-BACK-3D-FLOW | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #286 corrected flipped-state selector specificity for all three reversible-card families without adding `!important` or weakening unrelated screen behavior. Exact head `4dc1e155` passed Print Paper run `30168130026`, physical front/back same-page markers, full flattened inner-state/restoration checks, raster audit, Chromium/WebKit route registry and the complete permanent workflow matrix; merged as `f5e29998`. Production deployment remains separately unclaimed. | `f5e29998` PR#286 |'
if print_closed in matrix:
    raise RuntimeError('print closed row already exists')
replace_once(closed_anchor, closed_anchor + '\n' + print_closed, 'insert print closed row')
replace_once('## 🟠 P1 — ОТКРЫТО (102)', '## 🟠 P1 — ОТКРЫТО (101)', 'P1 counter')
replace_once(
    '| PRINT-REVERSIBLE-BACK-3D-FLOW | Flipped reversible-card outer root remains atomic, but the inner wrapper retained `matrix3d` and the active back-face physical markers disappeared (`0/0`). PR #286 is the sole generic correction owner; merge requires exact-head permanent front/back evidence and state-restoration proof. | PR #286 physical PDFs/runs `30165390363`, `30166039373`; R2 intake |\n',
    '',
    'remove open print row',
)
replace_once(
    '| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, run-addressed provenance, live artifact and downstream capability-witness identifiers for current candidate `e8c41d54` are imported. Superseded issue #289 was closed without claiming deployment. | `incoming/auditor-brain/2026-07-25-r2/REPORT.md`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_e8c41d54_auditor-r2.md` |',
    '| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, run-addressed provenance, live artifact and downstream capability-witness identifiers for current candidate `f5e29998` are imported. Source CI and merged PR evidence do not prove deployment. | `incoming/auditor-brain/2026-07-25-r3/REPORT.md`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f5e29998_auditor-r4.md` |',
    'production evidence gap row',
)
matrix, n = re.subn(r'^## Статистика \(обновлено .*?\)$', '## Статистика (обновлено 2026-07-25: source f5e29998 + print source closure)', matrix, count=1, flags=re.MULTILINE)
if n != 1:
    raise RuntimeError(f'statistics heading: expected one replacement, got {n}')
replace_once('| Закрыто (fixed) | 152 |', '| Закрыто (fixed) | 153 |', 'stats closed')
replace_once('| P1 открыто | 102 |', '| P1 открыто | 101 |', 'stats P1')
replace_once('| **Всего открыто (матрица)** | **198** |', '| **Всего открыто (матрица)** | **197** |', 'stats total')
session_header = '## Session log (append-only)\n'
session_entry = '\n- **2026-07-25 auditor R4 (`f5e29998`)** — merged #286 closes `PRINT-REVERSIBLE-BACK-3D-FLOW` at source+CI level after exact physical front/back, state-restoration, raster and Chromium/WebKit proof. No source PR remains open. Production authority stays fail-closed at `8a535267` pending exact readiness/Pages/provenance/live-artifact/downstream-ledger import for `f5e29998`.\n'
replace_once(session_header, session_header + session_entry, 'session entry')
MATRIX.write_text(matrix, encoding='utf-8')

REVERIFY.write_text(f'''# CURRENT HEAD REVERIFY — 2026-07-25 — `{SOURCE_SHORT}` auditor R4

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `{SOURCE}`
- Source parent: `{PREVIOUS}`
- AuditRepo authority before this reconciliation: `0f478880de4e0bcc61fdf95248faf9e4d827d914`
- Research authority observed: `b654c5375a7b212ff9b42c08bb0193eeaad70746`
- Last fully imported exact production witness: `{LAST_PROD}`

Source and production remain separate. This document does not claim `{SOURCE_SHORT}` deployed.

## Source delta

1. PR #286 merged as `{SOURCE_SHORT}` and closes the reversible-card flipped-back print defect at source+CI level.
2. Root cause was selector specificity, not a missing priority flag: the screen flipped selector outranked the earlier generic print selector.
3. The final fix added explicit generic flipped-state print selectors for `.flip-card`, `.heart-flip-card` and `.error-flip-card` without increasing the `!important` budget or weakening an unrelated screen rule.
4. No source pull request remains open at capture time.

## Exact-head proof before merge

PR head: `4dc1e155b990660687c568ded5541c10768d5d1c`.

All observed permanent workflows completed successfully:

- Print Paper Contract `30168130026`;
- Shared Files Guard `30168130065`;
- Visual Parity Guard `30168130027`;
- Route Registry Validators `30168130081`;
- Gill pre-v16 submenu `30168130030`;
- TTS Download Consent `30168130037`;
- Native Source Contract `30168130034`;
- Gill Final Source Reconciliation `30168130053`;
- Overlay Runtime Browser `30168130025`;
- Glossary Contract `30168130032`;
- Editorial Dateline Contract `30168130043`.

The Print Paper job proved production-like build, five-route atomic/keep-with-next behavior, front and flipped-back physical PDFs, same-page markers, raster audit and cleanup/state restoration. Route Registry completed Chromium and WebKit public-surface traversal.

## Merge result

- Merge commit: `{SOURCE}`
- PR: #286
- Final source scope: four permanent print/CSS contract files plus generated `site.css` revision synchronization across canonical consumers.
- No `_temp-*` workflow or materializer remains in the merged product tree.

## Production evidence boundary

At capture time the PR discussion contains the three auditor handoff comments but no downstream `deployment-capability-witness` ledger record for `{SOURCE}`. No exact readiness/Pages/live artifact IDs for the merge SHA have been imported into AuditRepo.

Therefore:

- `PRINT-REVERSIBLE-BACK-3D-FLOW` is source+CI closed;
- `AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP` remains open and moves to `{SOURCE_SHORT}`;
- production authority remains `{LAST_PROD}`.

## Current systemic owners

- #292: generic whole-artifact deployment provenance;
- #295: build once and promote the exact readiness artifact;
- #294: factual, recovery-aware failure lifecycle;
- #301: complete workflow write-permission model and full-SHA Action pinning;
- #298/#299/#300: product goldens, homepage browser runtime contract and shared series capabilities;
- #302/#303: deterministic fonts and redirect-hop source policy;
- #64: workflow policy migration;
- #287: Genesis transport/finalizer coordination only;
- Research #16: authority/supersession/rights manifest.

## Next acceptance gates

1. Import exact readiness, Pages, run-addressed provenance, live report artifact and downstream ledger for `{SOURCE}` if they exist.
2. Do not treat missing repository conversation targeting as a failed deployment; the artifact/run remain the durable witness.
3. Keep whole-site artifact identity and build-once promotion open until #292/#295 land.
4. Preserve permanent print contracts as the regression owner; do not reopen an implementation lane without a reproduced exact failure.
''', encoding='utf-8')

for temp in (TEMP_WORKFLOW, SELF):
    if temp.exists():
        temp.unlink()

print('F5E29998 RECONCILIATION: PASS')
