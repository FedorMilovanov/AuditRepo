#!/usr/bin/env python3

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "projects" / "gb-is-my-strength"
MATRIX = PROJECT / "verified" / "MASTER_BUG_MATRIX.md"
VALIDATOR = ROOT / "scripts" / "validate_audit_repo.py"
REGRESSION = ROOT / "scripts" / "validate_audit_repo_regression_test.py"
REVERIFY = PROJECT / "reverify" / "CURRENT_HEAD_REVERIFY_2026-07-25_9407cc92_counter-home-residual.md"


def replace_line(text: str, prefix: str, replacement: str, label: str) -> str:
    lines = text.splitlines()
    indexes = [index for index, line in enumerate(lines) if line.startswith(prefix)]
    if len(indexes) != 1:
        raise RuntimeError(f"{label}: expected exactly one line, found {len(indexes)}")
    lines[indexes[0]] = replacement
    return "\n".join(lines) + "\n"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


matrix = MATRIX.read_text(encoding="utf-8")
if "## ✅ ЗАКРЫТО (160)" not in matrix:
    raise RuntimeError("expected fixed heading 160 from AuditRepo main@7ae396da")
if "## 🟠 P1 — ОТКРЫТО (100)" not in matrix:
    raise RuntimeError("expected P1 heading 100 from AuditRepo main@7ae396da")
if "HOME-BROWSER-LIFECYCLE-RESIDUAL" in matrix:
    raise RuntimeError("homepage residual row already exists")

matrix = replace_line(
    matrix,
    "| Last reverify |",
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_9407cc92_counter-home-residual.md` |",
    "last reverify",
)
matrix = replace_line(
    matrix,
    "⚠️ Старые deploy-формулировки ниже исторические.",
    "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `9407cc92`; exact imported Pages/live/TTS production authority: `f5e29998`. PR #348 closes Research authority/provenance while preserving `draft-noindex`; it does not activate Genesis 6 routes. PR #338 established the broad homepage browser contract, but issue #299 is reopened for the narrower lifecycle/shortcut evidence residual owned by PR #361. Newer-source deployment, Genesis product activation and whole-release identity/build-once remain open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_9407cc92_counter-home-residual.md`.",
    "status warning",
)
matrix = replace_line(
    matrix,
    "| HOME-BROWSER-CONTRACT-MISSING |",
    "| HOME-BROWSER-CONTRACT-MISSING | ✅ **BASE CONTRACT FIXED/SOURCE+CHROMIUM+WEBKIT VERIFIED 2026-07-25.** PR #338 established the permanent production-like homepage contract for menu focus/cleanup, baseline BFCache handling, canonical shortcuts, Pagefind lazy initialization, Hebrew interaction, scroll controls and no-JS reachability. Exact head `8d39dab1` passed the broad browser/publication matrix and merged as `31758828`. Issue #299 is now reopened only for the narrower real-history/Meta+K/editable-IME/back-to-top evidence residual tracked separately as `HOME-BROWSER-LIFECYCLE-RESIDUAL`; do not reopen unrelated architecture or redesign the homepage. | `31758828` PR#338; reopened residual PR#361 |",
    "home base contract row",
)
matrix = replace_line(
    matrix,
    "| AUDIT-SSOT-CURRENT-HEAD-DRIFT |",
    "| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT records source `main@9407cc92`, exact deployed authority `f5e29998`, merged #348 provenance, active test-only owner #361, successful trusted replay `30171194731` and the source/production boundary. This follow-up also repairs the missed internal drift where the fixed heading was 160 while the statistics table remained 156, and permanently blocks future heading/summary divergence. | `9407cc92` source + exact `f5e29998` evidence import |",
    "SSOT row",
)
matrix = replace_once(matrix, "## 🟠 P1 — ОТКРЫТО (100)", "## 🟠 P1 — ОТКРЫТО (101)", "P1 heading")
marker = "## 🟠 P1 — ОТКРЫТО (101)\n\n| ID | Описание | Witnesses |\n|---|---|---|\n"
residual = (
    "| HOME-BROWSER-LIFECYCLE-RESIDUAL | **P1 evidence residual after #338.** Reopened issue #299 requires a real same-origin `/ → /about/ → Back` BFCache traversal with persisted `pagehide`/`pageshow` cleanup, exactly one post-restore menu transition, stable theme state, independent canonical Meta+K, editable/`role=textbox`/contenteditable/IME shortcut isolation and back-to-top threshold behavior in Chromium and WebKit. PR #361 is the sole owner and may change only the existing Runtime Interactive Audit workflow plus one permanent lifecycle contract script. | issue #299 reopened; PR #361 |\n"
)
matrix = replace_once(matrix, marker, marker + residual, "P1 residual insertion")
matrix = replace_line(
    matrix,
    "## Статистика (обновлено",
    "## Статистика (обновлено 2026-07-25: source 9407cc92 + exact f5e29998 production import)",
    "statistics heading",
)
matrix = replace_line(matrix, "| Закрыто (fixed) |", "| Закрыто (fixed) | 160 |", "fixed summary")
matrix = replace_line(matrix, "| P1 открыто |", "| P1 открыто | 101 |", "P1 summary")
matrix = replace_line(matrix, "| **Всего открыто (матрица)** |", "| **Всего открыто (матрица)** | **197** |", "total summary")

session_marker = "## Session log (append-only)\n\n"
session = (
    "- **2026-07-25 AuditRepo counter integrity + homepage lifecycle residual (`9407cc92`)** — issue #299 is reopened only for real-history BFCache, independent Meta+K, editable/IME isolation and back-to-top evidence under sole test-only PR #361; the broad #338 contract remains accepted. The canonical matrix fixed heading was already 160 while the summary table still reported 156. Added a permanent validator that compares fixed/P1/P2/P3 headings with summary rows and recomputes total open, plus black-box divergent-fixed and divergent-total fixtures. Canonical counters are fixed 160, P1 101, P2 37, total open 197. Production authority remains `f5e29998`. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_9407cc92_counter-home-residual.md`.\n\n"
)
matrix = replace_once(matrix, session_marker, session_marker + session, "session insertion")
MATRIX.write_text(matrix, encoding="utf-8")

validator = VALIDATOR.read_text(encoding="utf-8")
if "def validate_matrix_summary(" in validator:
    raise RuntimeError("matrix summary validator already exists")
validator_function = r'''

def validate_matrix_summary(proj, errors):
    """Fail closed when canonical section counters and summary statistics diverge."""
    matrix = proj / 'verified' / 'MASTER_BUG_MATRIX.md'
    if not matrix.is_file():
        return

    text = matrix.read_text(encoding='utf-8', errors='ignore')

    def capture(pattern, label):
        match = re.search(pattern, text, re.MULTILINE)
        if not match:
            fail(f'{proj.name}: matrix counter missing: {label}', errors)
            return None
        return int(match.group(1))

    headings = {
        'fixed': capture(r'^## ✅ ЗАКРЫТО \((\d+)\)$', 'fixed heading'),
        'p1': capture(r'^## 🟠 P1 — ОТКРЫТО \((\d+)\)$', 'P1 heading'),
        'p2': capture(r'^## 🟡 P2 — ОТКРЫТО \((\d+)\)$', 'P2 heading'),
        'p3': capture(r'^## 🟢 P3 — ОТКРЫТО \((\d+)\)$', 'P3 heading'),
    }
    summary = {
        'fixed': capture(r'^\| Закрыто \(fixed\) \| (\d+) \|$', 'fixed summary'),
        'p0': capture(r'^\| \*\*P0 открыто\*\* \| \*\*(\d+)\*\* \|$', 'P0 summary'),
        'p1': capture(r'^\| P1 открыто \| (\d+) \|$', 'P1 summary'),
        'p2': capture(r'^\| P2 открыто \| (\d+) \|$', 'P2 summary'),
        'p3': capture(r'^\| P3 открыто \| (\d+) \|$', 'P3 summary'),
        'refactoring': capture(r'^\| Рефакторинг \| (\d+) \|$', 'refactoring summary'),
        'auditrepo': capture(r'^\| AuditRepo \| (\d+) \|$', 'AuditRepo summary'),
        'total': capture(r'^\| \*\*Всего открыто \(матрица\)\*\* \| \*\*(\d+)\*\* \|$', 'total-open summary'),
    }

    for key in ('fixed', 'p1', 'p2', 'p3'):
        if headings[key] is not None and summary[key] is not None and headings[key] != summary[key]:
            fail(
                f'{proj.name}: matrix counter mismatch for {key}: heading={headings[key]} summary={summary[key]}',
                errors,
            )

    total_parts = [summary[key] for key in ('p0', 'p1', 'p2', 'p3', 'refactoring', 'auditrepo')]
    if summary['total'] is not None and all(value is not None for value in total_parts):
        calculated = sum(total_parts)
        if calculated != summary['total']:
            fail(
                f'{proj.name}: matrix total-open mismatch: calculated={calculated} summary={summary["total"]}',
                errors,
            )
'''
validator = replace_once(validator, "\n\nerrors = []\n", validator_function + "\n\nerrors = []\n", "validator function")
validator = replace_once(
    validator,
    "    # Intake structure\n",
    "    validate_matrix_summary(proj, errors)\n\n    # Intake structure\n",
    "validator invocation",
)
VALIDATOR.write_text(validator, encoding="utf-8")

regression = REGRESSION.read_text(encoding="utf-8")
if "matrix counter mismatch" in regression:
    raise RuntimeError("counter regression already exists")
matrix_fixture = '''    write(
        project / 'verified' / 'MASTER_BUG_MATRIX.md',
        '# MASTER BUG MATRIX — fixture\\n\\n'
        '## ✅ ЗАКРЫТО (1)\\n\\n'
        '## 🟠 P1 — ОТКРЫТО (2)\\n\\n'
        '## 🟡 P2 — ОТКРЫТО (3)\\n\\n'
        '## 🟢 P3 — ОТКРЫТО (4)\\n\\n'
        '## Статистика\\n\\n'
        '| Категория | Количество |\\n'
        '|---|---|\\n'
        '| Закрыто (fixed) | 1 |\\n'
        '| **P0 открыто** | **0** |\\n'
        '| P1 открыто | 2 |\\n'
        '| P2 открыто | 3 |\\n'
        '| P3 открыто | 4 |\\n'
        '| Рефакторинг | 1 |\\n'
        '| AuditRepo | 1 |\\n'
        '| **Всего открыто (матрица)** | **11** |\\n',
    )
'''
regression = replace_once(
    regression,
    "    write(project / 'verified' / 'README.md', '# Verified\\n')\n",
    "    write(project / 'verified' / 'README.md', '# Verified\\n')\n" + matrix_fixture,
    "fixture matrix",
)
regression_tests = '''
        # Canonical heading and statistics counters must remain identical.
        matrix_path = root / 'projects' / 'fixture-project' / 'verified' / 'MASTER_BUG_MATRIX.md'
        matrix_text = matrix_path.read_text(encoding='utf-8')
        matrix_path.write_text(matrix_text.replace('| Закрыто (fixed) | 1 |', '| Закрыто (fixed) | 9 |'), encoding='utf-8')
        mismatch = run_validator(root)
        require(mismatch.returncode == 1, 'mismatched matrix counters unexpectedly passed', mismatch)
        require(
            'matrix counter mismatch for fixed' in mismatch.stdout,
            'matrix mismatch failure did not identify the divergent counter',
            mismatch,
        )

        matrix_path.write_text(matrix_text.replace('**11**', '**12**'), encoding='utf-8')
        total_mismatch = run_validator(root)
        require(total_mismatch.returncode == 1, 'mismatched total-open counter unexpectedly passed', total_mismatch)
        require(
            'matrix total-open mismatch' in total_mismatch.stdout,
            'total-open mismatch did not identify arithmetic drift',
            total_mismatch,
        )

        matrix_path.write_text(matrix_text, encoding='utf-8')
        restored = run_validator(root)
        require(restored.returncode == 0, 'restored matrix counters failed validator', restored)
'''
regression = replace_once(
    regression,
    "        require('AUDITREPO VALIDATION: PASS' in valid.stdout, 'PASS marker missing', valid)\n",
    "        require('AUDITREPO VALIDATION: PASS' in valid.stdout, 'PASS marker missing', valid)\n" + regression_tests,
    "counter regressions",
)
REGRESSION.write_text(regression, encoding="utf-8")

if REVERIFY.exists():
    raise RuntimeError("target reverify already exists")
REVERIFY.write_text("""# CURRENT HEAD REVERIFY — 2026-07-25 — `9407cc92` counter integrity + homepage residual

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `9407cc92eb22dc6eab76f831df35a09429663e3e`
- Exact imported production authority: `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320`
- AuditRepo base before this follow-up: `7ae396dae5a45a4c9f9b50ed3d190264de8c64da`

This witness does not advance source or production. It reconciles one reopened browser-evidence residual and repairs AuditRepo's own counter authority.

## Homepage browser-contract boundary

PR #338 / `31758828` remains accepted as the broad production-like Chromium/WebKit/no-JS homepage contract. It covers menu focus and cleanup, baseline BFCache handling, canonical shortcuts, lazy Pagefind initialization, Hebrew interaction, progress/back-to-top basics, reduced motion, overflow and no-JS reachability.

Issue #299 is nevertheless reopened for narrower evidence that #338 did not fully prove. Active PR #361 owns exactly:

- real same-origin `/ → /about/ → Back` history traversal;
- `pagehide.persisted=true` and `pageshow.persisted=true` restoration cleanup;
- exactly one post-restore menu transition;
- stable theme attribute and storage state;
- independent canonical Meta+K activation;
- Ctrl/Meta+K isolation in input, textarea, `role=textbox`, contenteditable and IME composition;
- back-to-top appearance and disappearance across the threshold.

PR #361 is test-only and owns only `.github/workflows/interactive-audit.yml` plus `scripts/home-browser-lifecycle-contract.mjs`. The residual is registered as P1 without reopening unrelated homepage architecture.

## AuditRepo counter defect

At AuditRepo `main@7ae396da`, the canonical fixed section heading was `160`, but the bottom statistics table still said `156` and retained an old source label. Both values were human-maintained and AuditRepo Validate did not compare them.

Permanent repair:

- compare fixed, P1, P2 and P3 section headings with their summary rows;
- require every expected summary counter;
- recompute total open as P0 + P1 + P2 + P3 + Refactoring + AuditRepo;
- fail closed when the arithmetic or any mirrored counter diverges;
- skip projects that do not own a `verified/MASTER_BUG_MATRIX.md`;
- black-box fixtures prove a mismatched fixed count and a mismatched total are rejected, then prove the restored matrix passes.

## Canonical counters after reconciliation

- fixed: `160`;
- P0: `0`;
- P1: `101` after registering `HOME-BROWSER-LIFECYCLE-RESIDUAL`;
- P2: `37`;
- P3: `51`;
- refactoring: `4`;
- AuditRepo: `4`;
- total open: `197`.

Research issue #16 remains closed by the existing `RESEARCH-AUTHORITY-MANIFEST-MISSING` row. No duplicate Genesis provenance row is introduced.

## Production boundary

Exact production authority remains `f5e29998` only. Source `9407cc92` has no imported same-SHA readiness, Pages promotion or live witness. Homepage residual evidence and Research provenance CI are not deployment evidence.

## Acceptance

- keep the broad #338 homepage contract closed;
- register only the reopened #299 residual as P1 under #361;
- repair summary counters without changing fixed/P2/P3 classifications;
- permanently block future counter divergence;
- retain production authority at `f5e29998`.
""", encoding="utf-8")

Path(__file__).unlink()
