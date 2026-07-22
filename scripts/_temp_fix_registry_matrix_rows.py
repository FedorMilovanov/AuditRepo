#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / 'projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md'
text = path.read_text(encoding='utf-8')

hard_row = '| CI-HARD-TEXTS-NATIVE-VISUAL-OWNERSHIP-01 | ✅ **FIXED/VERIFIED 2026-07-22.** Fresh screenshots exposed a 2.496% mobile legacy-vs-dist difference because retired legacy HTML omitted the current six-card «Материалы серии» section. PR #151 declared explicit native ownership with route-specific source/component, data-consistency and all-route browser guards; tolerance stayed 0.5%; product UI unchanged. | `0a449118` PR#151 |'
closed_rows = hard_row + '\n' + '| NG-SOURCE-REGISTRY-01 | ✅ **FIXED/VERIFIED 2026-07-22.** PR #149 added the canonical source registry + JSON Schema for Green/Thomas/Nichols, exact PDF/page/extraction/last-checked metadata, supports/doesNotSupport and author/editorial/institution levels. Native source rows derive from registry IDs; exact live/registry witness passed. | `6c4106ae` PR#149 |' + '\n' + '| NG-EPISTEMIC-MODEL-LAYERS-01 | ✅ **FIXED/VERIFIED 2026-07-22.** Claim records now distinguish historical reconstruction, literary model and doctrinal synthesis and record primary evidence, alternative, series position, confidence and change condition. Author→institution promotion and conflicting evidence fail adversarial tests. | `6c4106ae` PR#149 |'

if text.count(hard_row) != 1:
    raise SystemExit(f'hard row count: {text.count(hard_row)}')
if '| NG-SOURCE-REGISTRY-01 | ✅ **FIXED/VERIFIED 2026-07-22.' in text:
    raise SystemExit('closed registry row already present')
text = text.replace(hard_row, closed_rows, 1)

open_model = '| NG-EPISTEMIC-MODEL-LAYERS-01 | 🟠 **Нагорная P1 methodology/content.** Textual observations, historical reconstruction, literary models, confessional synthesis and pastoral application are not consistently labeled. Root lane groups C43–C94 actions: Beatitudes genre, Aramaic/Q/audience models, Matt 5:18 layers, authorial-intent attribution, steelman alternatives and multi-function discourse. | verified-source; intake report 2026-07-22 |\n'
open_registry = '| NG-SOURCE-REGISTRY-01 | 🟠 **Нагорная P1 citation architecture.** Public sources page claims all links are verified by primary sources but lacks requested/final URL, exact object, title/author/issue/pages, extraction/OCR, supported/not-supported claim, source role/tradition, author-vs-institution and last-checked fields. | verified-source + supplied URL/PDF audit |\n'
for label, row in [('model', open_model), ('registry', open_registry)]:
    if text.count(row) != 1:
        raise SystemExit(f'open {label} row count: {text.count(row)}')
    text = text.replace(row, '', 1)

path.write_text(text.rstrip() + '\n', encoding='utf-8')
print('fixed registry/model matrix rows')
