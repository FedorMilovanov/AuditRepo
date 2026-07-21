from pathlib import Path

matrix_path = Path('projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md')
text = matrix_path.read_text(encoding='utf-8')


def once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one match, found {count}')
    return source.replace(old, new, 1)


text = once(
    text,
    '| Source HEAD | `43d8672f59128de816cfd47c638c132a73d71599` (main; PR #98 maps, PR #101 Reader R1, PR #102 Reader R3, PR #103 Reader R4 and PR #104 Reader R5 landed) |',
    '| Source HEAD | `1bbebc2d9fcfe8a0af7c32e3a6796379927d48b8` (main; Reader R1–R5, special overlay adapters, asset revision repair and pre-merge deploy guard landed) |',
    'source head',
)
text = once(
    text,
    '| Deploy | 🟠 **SOURCE/RELEASE GATES GREEN THROUGH `43d8672f` / EXACT DEPLOYED SHA PROOF PENDING.** PR #104 passed Shared Files Guard, Route Registry Validators, Native Source Contract, Astro, production-like dist, native output, workflow policy, clean-tree and Chromium/Firefox/WebKit overlay matrix. |',
    '| Deploy | 🟠 **SOURCE/RELEASE GATES GREEN THROUGH `1bbebc2d` / EXACT DEPLOYED SHA PROOF PENDING.** PR #106 passed static + Chromium/Firefox/WebKit special-overlay evidence; PR #108 restored synchronized asset revisions; PR #109 made revision/workflow checks pre-merge and direct-deploy blocking. |',
    'deploy row',
)
text = once(
    text,
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_43d8672f.md` |',
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1bbebc2d.md` |',
    'reverify pointer',
)
text = once(
    text,
    'Текущий source/release authority — `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_43d8672f.md`;',
    'Текущий source/release authority — `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1bbebc2d.md`;',
    'authority pointer',
)
text = once(text, '## ✅ ЗАКРЫТО (115)', '## ✅ ЗАКРЫТО (118)', 'closed count')
text = once(
    text,
    '| READER-R5-OVERLAY-RUNTIME-01 |',
    '| CI-ASSET-REVISION-PREMERGE-01 | ✅ **FIXED 2026-07-21.** Every PR now runs read-only cache-bust and workflow-policy contracts in Shared Files Guard; direct/manual deploy treats stale revisions as blocking instead of swallowing failure. | `1bbebc2d` PR#109 |\n'
    '| DEPLOY-CACHE-BUST-RECONCILE-01 | ✅ **FIXED 2026-07-21.** 62 stale HTML/Astro/helper sources and 113 publication mismatches were regenerated through explicit `--write`, then proved idempotent; special-overlay runtime blobs remained unchanged. | `869558cd` PR#108 |\n'
    '| SPECIAL-OVERLAY-ADAPTERS-01 | ✅ **FIXED 2026-07-21.** MapEngine, MindMap3D/built launcher, image viewer and mobile fallbacks use canonical OverlayRuntime ownership; zero forbidden direct production writers; foreign-owner/double-destroy/fallback/built witnesses and Chromium/Firefox/WebKit matrix green. | `39f6c3ac` PR#106 |\n'
    '| READER-R5-OVERLAY-RUNTIME-01 |',
    'closed rows',
)
text = once(
    text,
    '| PROD-STALE-DEPLOY-RED | 🟠 **2026-07-21 REVERIFY:** source/release gates green at `ffdba149` after PR #98/#101, including cross-engine Chromium and engine:sweep 98/98. Keep open only as exact deployed-SHA witness task. | verified-source + verified-pr-gates; deploy witness pending |',
    '| PROD-STALE-DEPLOY-RED | 🟠 **2026-07-21 REVERIFY:** source/release gates green through `1bbebc2d`; special overlays and asset revisions are source-complete, and recurrence is blocked pre-merge. Keep open only for immutable GitHub Pages run/deployment SHA plus production blob witness. | PR#106/#108/#109 verified; deploy witness pending |',
    'deploy witness row',
)

session = '''\n\n### 2026-07-21 — Special overlays and deploy revision hardening (`1bbebc2d`)\n\n- PR #106 (`39f6c3ac`) completed canonical special-surface overlay ownership with zero forbidden direct writers and Chromium/Firefox/WebKit evidence.\n- PR #108 (`869558cd`) reconciled 62 generated source files / 113 stale revision mismatches without changing runtime blobs.\n- PR #109 (`1bbebc2d`) added read-only revision + workflow-policy checks to every PR and made direct deploy strict.\n- Source/release gates are green. Exact Pages deployment SHA remains unverified; `PROD-STALE-DEPLOY-RED` and issue #58 remain open only for that witness.\n'''
if '### 2026-07-21 — Special overlays and deploy revision hardening (`1bbebc2d`)' in text:
    raise SystemExit('session already exists')
text = text.rstrip() + session
matrix_path.write_text(text, encoding='utf-8')
