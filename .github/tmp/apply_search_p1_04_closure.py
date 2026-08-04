#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path.cwd()
MATRIX = ROOT / 'projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md'
NEXT = ROOT / 'projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md'
REVERIFY_REL = 'projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-08-04_3fba1890_scripture-occurrence-search-closure.md'
REVERIFY = ROOT / REVERIFY_REL

PRODUCT_S1 = '5fc06fc0c4a9a7c60f849619129890df70089b57'
PRODUCT_S2_HEAD = '5f3962cec5e2c39a133fa56fb0661ac344df972a'
PRODUCT_MERGE = '3fba1890c23bd30d748f4d948a8919625d0ddf47'
AUDIT_BASE = '75cfcd54e080c3a07da7775f4082f399ae2a034b'

OLD_P103 = "| SEARCH-P1-03 | ✅ **FIXED-CURRENT / SOURCE+PAGEFIND+CHROMIUM+CI VERIFIED 2026-08-04.** Product PR #890 closed only the misleading exact-Bible S0: public wording now says `Ссылки` / `Ссылки в материалах`, the UI no longer promises a word/full-Scripture search, and the four public suggestions (`Иер 17:9`, `Рим 7:14–25`, `1 Тим 3`, `Тит 1`) are parsed by the canonical 66-book resolver and required to own exact `data/search-manifest.json` records. Old unsupported suggestions and labels are permanently forbidden. Exact head `0c20368ff0e4f90c992784530d15c9c7d722e0dd` passed executor run `30931175556` job `92065964404`: bounded clean diff, production-like build, strict Pagefind inventory, real browser discovery queries, SW deploy-switch audits and full `validate:static-publication`; squash merge `83875378a31436e235f1296f13d22c816b2945df`. `SEARCH-P1-04`, `SEARCH-P2-07` and `SEARCH-P2-08` remain open. No production deployment or TTS/Vosk claim. | `83875378` PR#890; run `30931175556` |"
NEW_P103 = OLD_P103.replace('`SEARCH-P1-04`, `SEARCH-P2-07` and `SEARCH-P2-08` remain open.', '`SEARCH-P2-07` and `SEARCH-P2-08` remain open.')

OPEN_ROW = "| SEARCH-P1-04 | 🆕 **Search Scripture P1:** сайт содержит значительно больше видимых библейских ссылок, чем структурно знает поиск: dist-scan извлёк ~1026 parseable visible Bible refs, но search-manifest имеет только 16 scripture items, Pagefind meta — 30 entries, canonical corpus покрывает только 151 extracted refs. Нет единой матрицы `BibleRef → pages/anchors/context/topics`. No Product mutation/browser/production claim. | `incoming/search-deep-audit-2026-08-04/PASS3_SCRIPTURE_SEARCH.md`; `SCRIPTURE_SEARCH_PROBE.json`; reverify `CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_search-scripture-current.md` |"

CLOSED_ROW = "| SEARCH-P1-04 | ✅ **FIXED-CURRENT / SOURCE+PAGEFIND+CHROMIUM+CI VERIFIED 2026-08-04.** Product S1 PR #895 / merge `5fc06fc0c4a9a7c60f849619129890df70089b57` introduced the deterministic source-owned Scripture occurrence index. Its exact contract, which supersedes the inaccurate `296/1492/73/154` prose in that merge message, records **980 canonical references, 2355 visible-source occurrences across 73 indexed routes and 148 curated-text records**; production-like dist witnessed occurrences on 59 routes while preserving anchors, context, provenance and `canonicalText: null` where text authority is absent. Product S2 PR #899 / exact head `5f3962cec5e2c39a133fa56fb0661ac344df972a` renders exact occurrence results before Pagefind, lazy-loads the index once, preserves metadata/Pagefind fallback plus preview/keyboard/Enter navigation, and synchronizes search revision `f48e4610 → 6061911b` with SW cache v196. Self-clean executor run `30942911632`, job `92105570343`, and permanent exact-head Scripture index/runtime, Shared Files, Node, Metadata, Search policy, Native Source and publication checks passed before squash merge `3fba1890c23bd30d748f4d948a8919625d0ddf47`. `SEARCH-P2-07` and `SEARCH-P2-08` remain open. No production deployment or TTS/Vosk claim. | `5fc06fc0` PR#895 + `3fba1890` PR#899; runs `30939693713`, `30942911632`, `30943911786` |"

SESSION_ENTRY = """### 2026-08-04 — Scripture occurrence search P1 closure

- Closed `SEARCH-P1-04` from Product S1 PR #895 / merge `5fc06fc0c4a9a7c60f849619129890df70089b57` and S2 PR #899 / merge `3fba1890c23bd30d748f4d948a8919625d0ddf47`.
- The authoritative generated contract supersedes the inaccurate S1 merge prose and records **980 canonical references, 2355 visible-source occurrences, 73 indexed routes and 148 curated-text records**; production-like dist witnessed occurrences on 59 routes.
- Exact-reference queries now render occurrence results before Pagefind, lazy-load the canonical index once, preserve fallback/preview/keyboard/Enter behavior and synchronize search revision `6061911b` with SW cache v196.
- Self-clean executor `30942911632` / job `92105570343` and permanent exact-head runtime `30943911786` / job `92108964307` passed; the Product diff contained 63 inventoried files and no temporary or TTS/Vosk path.
- `SEARCH-P2-07` and `SEARCH-P2-08` remain open. No production deployment claim.
- Canonical arithmetic: total remains **371**; closed `221 → 222`, open `150 → 149`, P1 `71 → 70`.

"""


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one exact match, got {count}')
    if old == new:
        raise SystemExit(f'{label}: replacement is identical')
    return text.replace(old, new, 1)


def main() -> None:
    matrix = MATRIX.read_text(encoding='utf-8')

    matrix = replace_once(
        matrix,
        '| Source verification anchor | `83875378a31436e235f1296f13d22c816b2945df` (Product closure wave: `NG-DARK-01` merged as `7118ad80`; truthful Scripture-suggestion S0 `SEARCH-P1-03` merged as `83875378`; separate WebKit TOC nondeterminism remains open; no production or TTS claim). |',
        '| Source verification anchor | `3fba1890c23bd30d748f4d948a8919625d0ddf47` (Product Scripture occurrence search closure: S1 source-owned index `5fc06fc0`; S2 exact-reference-first runtime `3fba1890`; sparse-corpus and legacy-authority rows remain open; no production or TTS/Vosk claim). |',
        'source verification anchor',
    )
    matrix = replace_once(
        matrix,
        '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_83875378_product-wave-closures.md` (Product PR #887/#890 closure reconciliation and separate WebKit TOC CI finding). |',
        '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_3fba1890_scripture-occurrence-search-closure.md` (Product PR #895/#899 source-index and exact-runtime closure; P2 authority/corpus debts remain open). |',
        'last reverify',
    )
    matrix = replace_once(matrix, '## ✅ ЗАКРЫТО (221)', '## ✅ ЗАКРЫТО (222)', 'closed heading')
    matrix = replace_once(matrix, OLD_P103, NEW_P103 + '\n' + CLOSED_ROW, 'SEARCH-P1-03 insertion anchor')
    matrix = replace_once(matrix, OPEN_ROW + '\n', '', 'open SEARCH-P1-04 row')
    matrix = replace_once(matrix, '## 🟠 P1 — ОТКРЫТО (71)', '## 🟠 P1 — ОТКРЫТО (70)', 'P1 heading')
    matrix = replace_once(
        matrix,
        '## Статистика (обновлено 2026-08-04: disposition anchor `83875378`; last exact production `abf1edba`; 371 canonical = 221 closed + 150 open)',
        '## Статистика (обновлено 2026-08-04: disposition anchor `3fba1890`; last exact production `abf1edba`; 371 canonical = 222 closed + 149 open)',
        'statistics heading',
    )
    matrix = replace_once(matrix, '| Закрыто (fixed) | 221 |', '| Закрыто (fixed) | 222 |', 'closed statistics')
    matrix = replace_once(matrix, '| P1 открыто | 71 |', '| P1 открыто | 70 |', 'P1 statistics')
    matrix = replace_once(matrix, '| **Всего открыто (матрица)** | **150** |', '| **Всего открыто (матрица)** | **149** |', 'open statistics')
    matrix = replace_once(matrix, '## Session log (append-only)\n\n', '## Session log (append-only)\n\n' + SESSION_ENTRY, 'session log insertion')

    if matrix.count('| SEARCH-P1-04 |') != 1:
        raise SystemExit('SEARCH-P1-04 must exist exactly once after closure')
    if '## ✅ ЗАКРЫТО (222)' not in matrix or '## 🟠 P1 — ОТКРЫТО (70)' not in matrix:
        raise SystemExit('matrix heading arithmetic missing')
    if '371 canonical = 222 closed + 149 open' not in matrix:
        raise SystemExit('statistics arithmetic missing')
    MATRIX.write_text(matrix, encoding='utf-8')

    next_text = f"""# NEXT AGENT PROMPT — gb-is-my-strength

## Exact authority

- AuditRepo rollback/base before this transaction: `{AUDIT_BASE}`.
- Current Product source/disposition anchor: `{PRODUCT_MERGE}` (PR #899).
- Product S1 index merge: `{PRODUCT_S1}` (PR #895).
- Product S2 exact head: `{PRODUCT_S2_HEAD}`; squash merge: `{PRODUCT_MERGE}`.
- Last exact production authority is unchanged: release/control SHA `abf1edba190280e554dfda085bef9fb6594c896d`, deploy run `30669840189` attempt `1`. Do not treat the Product source anchor as deployed.
- Canonical reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_3fba1890_scripture-occurrence-search-closure.md`.

## Canonical matrix

- **371 total = 222 closed + 149 open**.
- Open severity counts: P0 `0`, P1 `70`, P2 `33`, P3 `39`, refactoring `4`, AuditRepo `3`.
- `SEARCH-P1-04` is closed by the paired S1/S2 Product evidence.
- `SEARCH-P2-07` remains open: the corpus is sparse and cannot be truthfully closed without an authoritative/licensed source plus rights/provenance.
- `SEARCH-P2-08` remains open: legacy `data/verses.json` and canonical `data/bible/**` still have an authority boundary to reconcile.

## Product evidence retained

- Generated source-owned index: **980 references, 2355 occurrences, 73 indexed routes, 148 curated-text records**; production-like dist witnessed occurrences on 59 routes.
- S1 exact run `30939693713`, job `92094634725`.
- S2 self-clean executor run `30942911632`, job `92105570343`.
- Permanent exact-head runtime run `30943911786`, job `92108964307`.
- Final Product diff: 63 inventoried files, no temporary or TTS/Vosk paths.

## Next bounded search lanes

1. `SEARCH-P2-08`: remove or permanently quarantine the legacy verse authority only after exact consumer inventory; do not project disputed legacy text into the canonical corpus.
2. `SEARCH-P2-09`: implement the advertised `/?q={{search_term_string}}` SearchAction target as a real search-open/query state.
3. `SEARCH-P2-10`, `SEARCH-P2-11`, `SEARCH-P2-12`: complete AT/modal/touch contracts with browser evidence and without weakening existing keyboard/fallback behavior.
4. `SEARCH-P1-01`: extend the unified command palette to the remaining searchable app/tool routes.
5. Search P3 polish rows.

No active Product mutation lane is owned by this AuditRepo closure transaction. Re-read live Product `main` and source-owner blobs before opening the next lane.
"""
    NEXT.write_text(next_text, encoding='utf-8')

    reverify = f"""# Current-head reverify — Scripture occurrence search closure

**Date:** 2026-08-04  
**AuditRepo base:** `{AUDIT_BASE}`  
**Product S1 merge:** `{PRODUCT_S1}` (PR #895)  
**Product S2 exact head:** `{PRODUCT_S2_HEAD}`  
**Product S2 merge:** `{PRODUCT_MERGE}` (PR #899)

## Disposition

`SEARCH-P1-04` is **FIXED-CURRENT / SOURCE+PAGEFIND+CHROMIUM+CI VERIFIED**.

The former audit observation (~1026 visible references versus tiny manifest/corpus samples) is superseded by a deterministic source-owned occurrence contract and a runtime that consumes it before Pagefind.

## S1 — canonical source-owned index

- Exact Product run `30939693713`, job `92094634725`.
- Authoritative generated counts: **980 canonical references, 2355 visible-source occurrences, 73 indexed routes and 148 curated-text records**.
- The `296/1492/73/154` prose in the S1 squash message is inaccurate and is not authoritative; the committed JSON plus permanent contract are authoritative.
- Production-like dist witnessed indexed occurrences on 59 routes.
- Anchors, route context and source provenance are preserved. `canonicalText` remains `null` where the repository has no governed text authority.
- Import graph, props, attributes, expressions and unrelated data modules are not treated as visible occurrences.

## S2 — exact-reference-first runtime

- Self-clean executor run `30942911632`, job `92105570343` passed source/index/cache, production-like build, Pagefind, Chromium exact-first, index-failure fallback, preview, keyboard/Enter navigation, SW deploy-switch and the full static-publication barrier.
- Permanent exact-head runtime run `30943911786`, job `92108964307` passed on `{PRODUCT_S2_HEAD}`.
- Exact queries render the `Точные вхождения` group before Pagefind, lazy-load the canonical index once and fall back to metadata/Pagefind without inventing exact results.
- Search revision moved `f48e4610 → 6061911b`; SW cache moved to v196.
- Final Product diff contained **63 inventoried files**: seven permanent runtime/SW owners plus 56 versioned search references. Temporary workflow/helper files and TTS/Vosk paths were absent.

## Boundaries retained

- `SEARCH-P2-07` remains open: 66-book registry coverage is not equivalent to a complete authoritative/licensed verse corpus.
- `SEARCH-P2-08` remains open: legacy `data/verses.json` authority still requires removal/quarantine or governed reconciliation; disputed legacy text must not be copied into `data/bible/**`.
- No production deployment is claimed. Last exact production authority remains `abf1edba190280e554dfda085bef9fb6594c896d`, run `30669840189` attempt `1`.
- No TTS/Vosk disposition is claimed.

## SSOT arithmetic

Total canonical IDs remain **371**. This one row moves from P1 open to closed:

- closed: `221 → 222`
- open: `150 → 149`
- P1: `71 → 70`
- P2/P3/refactoring/AuditRepo unchanged
"""
    REVERIFY.parent.mkdir(parents=True, exist_ok=True)
    if REVERIFY.exists():
        raise SystemExit(f'reverify already exists: {REVERIFY_REL}')
    REVERIFY.write_text(reverify, encoding='utf-8')

    print('Prepared SEARCH-P1-04 closure: 371 = 222 closed + 149 open; P1 = 70.')


if __name__ == '__main__':
    main()
