#!/usr/bin/env python3
from pathlib import Path

path = Path('projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md')
text = path.read_text(encoding='utf-8')


def once(old: str, new: str, label: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one match, found {count}')
    text = text.replace(old, new, 1)


once(
    '| Source HEAD | `1bbebc2d9fcfe8a0af7c32e3a6796379927d48b8` (main; Reader R1–R5, special overlay adapters, asset revision repair and pre-merge deploy guard landed) |',
    '| Source HEAD | `2b67ee8f6ee788cb0457b5171e1d99d7afeff5dd` (main; Reader R1–R5, special overlay adapters, revision/deploy guards, readiness linkage and Gill deploy-smoke correction landed) |',
    'source head',
)
once(
    '| Deploy | 🟠 **SOURCE/RELEASE GATES GREEN THROUGH `1bbebc2d` / EXACT DEPLOYED SHA PROOF PENDING.** PR #106 passed static + Chromium/Firefox/WebKit special-overlay evidence; PR #108 restored synchronized asset revisions; PR #109 made revision/workflow checks pre-merge and direct-deploy blocking. |',
    '| Deploy | 🟠 **SOURCE/RELEASE GATES GREEN THROUGH `2b67ee8f` / EXACT DEPLOYED SHA + BLOB PROOF PENDING.** PR #111 restored readiness→Pages linkage. Pages run `29870616511` reached only a stale Gill smoke assertion; PR #115 corrected the test after a full production-like build + complete Gill smoke passed. Keep issue #58 open until the observer records successful Pages and five source/production blob PASS results. |',
    'deploy status',
)
once(
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1bbebc2d.md` |',
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_2b67ee8f_nagornaya-deep-audit.md` |',
    'last reverify',
)
once(
    '⚠️ Старые 2026-07-14/20 deploy-формулировки ниже исторические. Текущий source/release authority — `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1bbebc2d.md`; exact production deployment остаётся отдельным доказательством.',
    '⚠️ Старые 2026-07-14/20/21 deploy-формулировки ниже исторические. Текущий source/release authority — `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_2b67ee8f_nagornaya-deep-audit.md`; exact production deployment остаётся отдельным доказательством.',
    'authority note',
)
once('## ✅ ЗАКРЫТО (118)', '## ✅ ЗАКРЫТО (117)', 'closed heading count')
once(
    '| RUNTIME-HIGHLIGHT-DEDUPE-01 | ✅ **FIXED 2026-07-21.** Старые/новые дубли сохранённых цитат нормализуются по page+text; dialog синхронизирует `aria-hidden`/`inert`. | `779c23c` PR#95 |\n',
    '',
    'stale highlight closure row',
)

prod_row = '| PROD-STALE-DEPLOY-RED | 🟠 **2026-07-21 REVERIFY:** source/release gates green through `1bbebc2d`; special overlays and asset revisions are source-complete, and recurrence is blocked pre-merge. Keep open only for immutable GitHub Pages run/deployment SHA plus production blob witness. | PR#106/#108/#109 verified; deploy witness pending |'
new_rows = '''| PROD-STALE-DEPLOY-RED | 🟠 **2026-07-22 REVERIFY:** source/release gates green through `2b67ee8f`; PR #111 repaired readiness→Pages linkage and PR #115 repaired the final stale Gill deploy-smoke expectation. Keep open only for immutable successful Pages run/head SHA plus five production/source blob PASS results and observer cleanup. | PR#106/#108/#109/#111/#115 verified; deploy witness pending |
| RUNTIME-HIGHLIGHT-DEDUPE-01 | 🟠 **MATRIX CORRECTION 2026-07-22.** The PR #95/`779c23c` closure is not present in current `main`: saved quotes still use unconditional insertion and dialog state lacks the required ARIA lifecycle. Actual fix is prepared and transaction-verified in draft PR #113 but not landed. | current-source negative witness + issue #112 / PR #113 |
| NG-RUNTIME-BAR-ASSET-01 | 🔴 **Нагорная P0 release/runtime.** All five native Part I–V footers reference `nagornaya-bar-extras.js?v=1`, canonical hash is `3c7e0bdd`, and `cache-bust.js` only recognizes eight-hex Astro revisions, so `v=1` bypasses the universal guard. Checked-in shadow HTML omits the asset. Fix regex + 5 Astro refs + 5 shadow/materialized refs; require dist and 360/390 Chromium witness. | verified-source `2b67ee8f`; intake 2026-07-22 |
| NG-PASTORAL-SAFETY-01 | 🔴 **Нагорная P0 pastoral safety.** Part V green verdict says «Полное отсутствие плодов — смертный приговор вере» and directly assigns Matt 7:21 to the reader without operational limits for time, evidence, trauma/illness/disability or weak/hidden fruit. Preserve warning against self-deception but remove omniscient/final-verdict language. | verified-source `NagornayaChast5MainShell.astro`; C92 |
| NG-SOURCE-INTEGRITY-01 | 🟠 **Нагорная P1 source integrity.** Green is TMSJ 12/1 pp. **49–68**, not 49–74; Thomas Jesus Seminar is `tmsj7d.pdf` (7/1, 75–105), while `tmsj7h.pdf` is Nichols (7/2, 213–239). Current prose also promotes individual TMSJ author arguments into institutional TMS verdicts. | verified-source + official TMS PDFs; C51/C60/C61 |
| NG-EPISTEMIC-MODEL-LAYERS-01 | 🟠 **Нагорная P1 methodology/content.** Textual observations, historical reconstruction, literary models, confessional synthesis and pastoral application are not consistently labeled. Root lane groups C43–C94 actions: Beatitudes genre, Aramaic/Q/audience models, Matt 5:18 layers, authorial-intent attribution, steelman alternatives and multi-function discourse. | verified-source; intake report 2026-07-22 |
| NG-SOURCE-REGISTRY-01 | 🟠 **Нагорная P1 citation architecture.** Public sources page claims all links are verified by primary sources but lacks requested/final URL, exact object, title/author/issue/pages, extraction/OCR, supported/not-supported claim, source role/tradition, author-vs-institution and last-checked fields. | verified-source + supplied URL/PDF audit |
| NG-UI-EPISTEMIC-BIAS-01 | 🟠 **Нагорная P1 UI/content interaction.** Red/green check/cross verdict cards and institution-labelled headings visually encode disputed historical/theological synthesis as an answer key; Part V P0 sentence is inside a green verdict. Capture 390/1440 browser baseline before replacing with neutral model/limits/position comparison. | verified-source; browser witness pending; D18/C80/C92 |'''
once(prod_row, new_rows, 'open-lane insertion')

once('| Закрыто (fixed) | 105 |', '| Закрыто (fixed) | 117 |', 'stats closed')
once('| **P0 открыто** | **13** |', '| **P0 открыто** | **15** |', 'stats p0')
once('| P1 открыто | 72 |', '| P1 открыто | 77 |', 'stats p1')
once('| **Всего открыто (матрица)** | **171** |', '| **Всего открыто (матрица)** | **178** |', 'stats total open')
once(
    '## Статистика (обновлено 2026-07-21: PR #97 initial-state/deep-link transaction)',
    '## Статистика (обновлено 2026-07-22: source 2b67ee8f + Nagornaya verified intake)',
    'stats heading',
)
once(
    '| Passes processed | 100+ (reverify 2026-07-21 @ 1a66bd8; PR #97 initial-state/browser witnesses) |',
    '| Passes processed | 100+ (reverify 2026-07-22 @ 2b67ee8f; Nagornaya source/PDF verification added) |',
    'passes row',
)

session_anchor = '''## Session log (append-only)

> Сюда идут per-session заметки о HEAD-переходах и что влито — **чтобы мастхед оставался
> чистым статусом**. Новое — сверху. Детали каждого HEAD — в парном `reverify/` доке.
'''
session_new = session_anchor + '''
- **2026-07-22 — Source HEAD `2b67ee8f`: deploy-smoke repair + verified Nagornaya deep intake.** PR #111 restored readiness→Pages linkage; failed Pages run `29870616511` was isolated to one stale Gill smoke expectation and PR #115 passed the full production-like build/Gill smoke without production UI changes. New verified intake grouped the supplied C43–C94/D18 analysis into technical bar-asset P0, pastoral-safety P0, source-integrity P1, model/source-registry P1 and epistemic-UI P1 lanes. Matrix drift reopened highlight dedupe/ARIA until PR #113 lands. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_2b67ee8f_nagornaya-deep-audit.md` and `incoming/gpt-5-6-nagornaya-deep-audit/2026-07-22/REPORT.md`.
'''
once(session_anchor, session_new, 'session log insertion')

path.write_text(text, encoding='utf-8')
print('matrix patch applied')
