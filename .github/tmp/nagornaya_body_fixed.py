#!/usr/bin/env python3
from pathlib import Path
import re

AUDIT_BASE = 'f59571e6690e695a7fcf5d1a4da71c33fb6401aa'
PRODUCT_SHA = 'f9d0120718569c510833dba7a3abd68ce2f6a003'
product = Path('_product')
reverify_path = Path('projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-body-subset-duplicate.md')
matrix_path = Path('projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md')
handoff_path = Path('projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md')


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one marker, found {count}')
    return text.replace(old, new, 1)


body_pattern = re.compile(
    r'<body\b[^>]*\bclass\s*=\s*["\'][^"\']*\bnagornaya-page\b[^"\']*\bbg-stone-100\b[^"\']*["\']|'
    r'<body\b[^>]*\bclass\s*=\s*["\'][^"\']*\bbg-stone-100\b[^"\']*\bnagornaya-page\b[^"\']*["\']',
    re.IGNORECASE | re.DOTALL,
)
link_pattern = re.compile(
    r'<link\b[^>]*href=["\'][^"\']*nagornaya-mobile-toc\.css[^"\']*["\'][^>]*>',
    re.IGNORECASE,
)
body_files = []
for path in (product / 'nagornaya').rglob('index.html'):
    text = path.read_text(encoding='utf-8')
    if not body_pattern.search(text):
        continue
    rel = path.relative_to(product).as_posix()
    if not link_pattern.search(text):
        raise SystemExit(f'body source lacks nagornaya-mobile-toc stylesheet link: {rel}')
    body_files.append(rel)
body_files = sorted(set(body_files))
if len(body_files) < 5:
    raise SystemExit(f'expected at least five linked legacy Nagornaya body sources, found {len(body_files)}: {body_files}')

css_path = product / 'css/nagornaya-mobile-toc.css'
css = re.sub(r'/\*.*?\*/', '', css_path.read_text(encoding='utf-8'), flags=re.DOTALL)
rule_pattern = re.compile(r'([^{}]+)\{([^{}]*)\}', re.DOTALL)
matching_rules = []
for match in rule_pattern.finditer(css):
    selectors = ' '.join(match.group(1).split())
    declarations = ' '.join(match.group(2).split())
    if (
        'html.dark body.nagornaya-page .bg-stone-100' in selectors
        and re.search(
            r'background-color\s*:\s*var\(--color-surface-muted\)\s*!important',
            declarations,
            re.IGNORECASE,
        )
    ):
        matching_rules.append({'selectors': selectors, 'declarations': declarations})
if len(matching_rules) != 1:
    raise SystemExit(f'expected one effective body bg-stone-100 dark rule, found {len(matching_rules)}: {matching_rules}')
rule = matching_rules[0]

body_lines = '\n'.join(f'  - `{path}`' for path in body_files)
reverify_path.write_text(
    f'''# CURRENT HEAD REVERIFY — Nagornaya body dark-remap subset

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical finding: `NG-BODY-01`
- Remaining broad owner: `NG-DARK-01`
- Current Product anchor: `{PRODUCT_SHA}`
- AuditRepo base: `{AUDIT_BASE}`
- Current production claim: **none**

## Current source evidence

Exact source scan found **{len(body_files)}** current legacy Nagornaya routes whose `<body>` carries both `nagornaya-page` and `bg-stone-100`, and every file links `css/nagornaya-mobile-toc.css`:

{body_lines}

The linked stylesheet contains the specific selector group `{rule['selectors']}` with `background-color: var(--color-surface-muted) !important`.

This is a deterministic effective-cascade fix for the historical body claim: the dark selector includes `html.dark`, `body.nagornaya-page` and `.bg-stone-100`, uses `!important`, and is loaded by every current legacy body surface. It overrides the lower-specificity Tailwind `.bg-stone-100` light declaration.

## Disposition

`NG-BODY-01` is **FIXED-CURRENT / SOURCE VERIFIED**.

The historical row is stale on the current Product anchor. The dark body remap exists in the dedicated Nagornaya stylesheet; the old statement inspected only `mobile-hotfix.css` and therefore missed the actual owner file.

`NG-DARK-01` is not closed by this transaction because it covers a broader class-remap architecture. Its next current-head reverify must remove the fixed body `bg-stone-100` subset and establish the actual remaining classes before any Product mutation.

## Evidence boundary

- no Product mutation in this AuditRepo transaction;
- current exact-source and effective-cascade verification only;
- no browser, live-production or deployed-SHA claim;
- no disposition for the remaining `NG-DARK-01` classes.

## Canonical arithmetic for the AuditRepo transaction

- Canonical IDs: **358**
- Closed: **212 → 213**
- Open: **146 → 145**
- P0: 0
- P1: **71 → 70**
- P2: 29
- P3: 39
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 213 + 145`.
''',
    encoding='utf-8',
)

matrix = matrix_path.read_text(encoding='utf-8')
handoff = handoff_path.read_text(encoding='utf-8')
open_row = '| NG-BODY-01 | 🆕 **Нагорная P1:** `bg-stone-100` на `<body>` не ремапится в dark — body фон остаётся светло-серым `#f5f5f4` в тёмной теме. `.bg-stone-100` (0,1,0) > `body` (0,0,1). `mobile-hotfix.css` ремапит `bg-stone-50` но **НЕ `bg-stone-100`**. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` | arena-auditor cycle 3 |\n'
closed_row = f'| NG-BODY-01 | ✅ **FIXED-CURRENT / SOURCE VERIFIED 2026-08-04.** Exact Product `{PRODUCT_SHA}` has the effective dark selector `html.dark body.nagornaya-page .bg-stone-100` with `background-color: var(--color-surface-muted) !important` in linked `css/nagornaya-mobile-toc.css`. A fail-closed scan found the stylesheet on every current legacy Nagornaya body surface. The historical row inspected only `mobile-hotfix.css` and missed the actual owner file. Broad `NG-DARK-01` remains open but must exclude this fixed subset. No browser or live-production claim. | `f9d01207` source |\n'

matrix = replace_once(matrix, '| Source verification anchor | `f9d0120718569c510833dba7a3abd68ce2f6a003` (exact Product footer-version scan: overstated `NG-VIS-12` merged into still-open owner `NG-SEO-01`; no Product mutation, source-fix or production claim). |', '| Source verification anchor | `f9d0120718569c510833dba7a3abd68ce2f6a003` (exact Product effective-cascade verification: `NG-BODY-01` is fixed-current; broad `NG-DARK-01` remains open pending current-residual narrowing; no browser or live-production claim). |', 'matrix source anchor')
matrix = replace_once(matrix, '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-version-row.md` |', '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-body-subset-duplicate.md` |', 'matrix reverify')
matrix = replace_once(matrix, '## ✅ ЗАКРЫТО (212)', '## ✅ ЗАКРЫТО (213)', 'closed heading')
matrix = replace_once(matrix, '| ID | Описание | Коммит |\n|---|---|---|\n| NG-VIS-12 |', '| ID | Описание | Коммит |\n|---|---|---|\n' + closed_row + '| NG-VIS-12 |', 'closed insertion')
matrix = replace_once(matrix, open_row, '', 'open row')
matrix = replace_once(matrix, '## 🟠 P1 — ОТКРЫТО (71)', '## 🟠 P1 — ОТКРЫТО (70)', 'P1 heading')
matrix = replace_once(matrix, '## Статистика (обновлено 2026-08-04: disposition anchor `f9d01207`; last exact production `abf1edba`; 358 canonical = 212 closed + 146 open)', '## Статистика (обновлено 2026-08-04: disposition anchor `f9d01207`; last exact production `abf1edba`; 358 canonical = 213 closed + 145 open)', 'stats')
matrix = replace_once(matrix, '| Закрыто (fixed) | 212 |', '| Закрыто (fixed) | 213 |', 'fixed summary')
matrix = replace_once(matrix, '| P1 открыто | 71 |', '| P1 открыто | 70 |', 'P1 summary')
matrix = replace_once(matrix, '| **Всего открыто (матрица)** | **146** |', '| **Всего открыто (матрица)** | **145** |', 'open summary')

handoff = replace_once(handoff, '**AuditRepo base before this handoff:** `17c84848808b63a1910b0d50c8e2553aac0ee4e4`', f'**AuditRepo base before this handoff:** `{AUDIT_BASE}`', 'handoff base')
handoff = replace_once(handoff, '**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-version-row.md`', '**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-body-subset-duplicate.md`', 'handoff reverify')
handoff = replace_once(handoff, '**Canonical matrix:** **358 IDs = 212 closed + 146 open**.', '**Canonical matrix:** **358 IDs = 213 closed + 145 open**.', 'handoff arithmetic')
handoff = replace_once(handoff, 'Source movement does **not** change canonical AuditRepo counts by itself. AuditRepo PRs #132, #136–#141 and #143–#147 are merged; PR #142 was closed unmerged after its exact-row gate disproved an incorrect duplicate mapping. AuditRepo PR #149 classifies overstated `NG-VIS-12` and merges it into still-open `NG-SEO-01` after an exact Product source scan; it makes no Product mutation, source-fix or production claim.', 'Source movement does **not** change canonical AuditRepo counts by itself. AuditRepo PRs #132, #136–#141, #143–#147 and #149 are merged; PR #142 was closed unmerged after its exact-row gate disproved an incorrect duplicate mapping. AuditRepo PR #150 closes `NG-BODY-01` as fixed-current after exact effective-cascade source verification; it makes no Product mutation, browser or live-production claim.', 'handoff movement')
handoff = replace_once(handoff, '- Product `main@f9d0120718569c510833dba7a3abd68ce2f6a003` remains source authority; `NG-DARK-01`, `NG-INLINE-01` and `NG-SEO-01` remain open current root owners.', '- Product `main@f9d0120718569c510833dba7a3abd68ce2f6a003` remains source authority. `NG-BODY-01` is fixed-current; `NG-DARK-01` remains open only for a freshly narrowed residual. `NG-INLINE-01` and `NG-SEO-01` remain open current root owners.', 'handoff Product')
handoff = replace_once(handoff, '- PR #148 (`audit/tts-deep-current-head-2026-08-04`) is a disjoint one-file incoming TTS evidence lane.\n- PR #149 (`verify/nagornaya-version-row-disposition-20260804`) is the active canonical disposition lane for `NG-VIS-12`; its final diff is bounded to the matrix, this handoff and the paired reverify document.', '- PR #148 (`audit/tts-deep-current-head-2026-08-04`) is a disjoint one-file incoming TTS evidence lane.\n- PR #150 (`verify/nagornaya-body-subset-duplicate-20260804`) is the active canonical fixed-current lane for `NG-BODY-01`; its final diff is bounded to the matrix, this handoff and the paired reverify document.', 'handoff owners')
handoff = replace_once(handoff, '- P1: 71', '- P1: 70', 'handoff P1')
handoff = replace_once(handoff, '- Total open: 146', '- Total open: 145', 'handoff open')
handoff = replace_once(handoff, '- Closed: 212', '- Closed: 213', 'handoff closed')
handoff = replace_once(handoff, '1. Merge AuditRepo PR #149 only after validator, matrix coverage and repository-history forensic checks pass on its exact final head; preserve disjoint PR #148.\n2. Keep `NG-SEO-01` open for its exact 1–3 stale / 4–5 absent version residual plus title/Pagefind drift; do not recreate `NG-VIS-12`. Keep `NG-INLINE-01` and `NG-DARK-01` open independently.', '1. Merge AuditRepo PR #150 only after validator, matrix coverage and repository-history forensic checks pass on its exact final head; preserve disjoint PR #148.\n2. Reverify and narrow `NG-DARK-01` against current CSS before any Product mutation; exclude fixed `NG-BODY-01` and do not recreate it. Keep `NG-INLINE-01` and `NG-SEO-01` open independently.', 'handoff next')

if matrix.count('| NG-BODY-01 |') != 1 or matrix.count('| NG-DARK-01 |') != 1:
    raise SystemExit('body/root cardinality failure')
if '## ✅ ЗАКРЫТО (213)' not in matrix or '## 🟠 P1 — ОТКРЫТО (70)' not in matrix:
    raise SystemExit('heading failure')
if '**358 IDs = 213 closed + 145 open**' not in handoff:
    raise SystemExit('handoff arithmetic failure')

matrix_path.write_text(matrix, encoding='utf-8')
handoff_path.write_text(handoff, encoding='utf-8')
