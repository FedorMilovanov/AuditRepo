from pathlib import Path
import sys

SOURCE_HEAD = "c8b47201f5b7210d69809c38808bfbda15695dcd"
R6_MERGE = "a43727078d0f39e541a5aad8cd250a90310181a9"
R6_HEAD = "2461198f45033d8cce5f2444a9492d9f8176fa01"
CROSS_BROWSER_HEAD = "da05253bfc37db7b57318492f5576bd929c5c140"
PREVIOUS_REVERIFY = "reverify/CURRENT_HEAD_REVERIFY_2026-07-24_c8b47201_home-reader-gill-webkit.md"
REVERIFY = "reverify/CURRENT_HEAD_REVERIFY_2026-07-24_c8b47201_reader-r6-matrix-closure.md"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new)


project = Path("projects/gb-is-my-strength")
matrix_path = project / "verified" / "MASTER_BUG_MATRIX.md"
next_path = project / "NEXT_AGENT_PROMPT.md"
reverify_path = project / REVERIFY

matrix = matrix_path.read_text()
if "READER-R6-STATE-01" in matrix:
    raise SystemExit("READER-R6-STATE-01 already exists")

matrix = replace_once(
    matrix,
    "| Source HEAD | `20ded750327f79e46efa4e50d4d7cd7171e7d9a1` (current source main; glossary #183, source-aware coverage #186, Bible resolver #185 and fail-closed asset policy #187) |",
    "| Source HEAD | `c8b47201f5b7210d69809c38808bfbda15695dcd` (current source main; ReaderState R6 #191 and all-route Android/WebKit #200 layered on current INDEX, Gill and Nagornaya work) |",
    "matrix source head",
)
matrix = replace_once(
    matrix,
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_20ded750_cache-bust-fail-closed.md` |",
    f"| Last reverify | `{REVERIFY}` |",
    "matrix last reverify",
)
matrix = replace_once(
    matrix,
    "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `20ded750`; last exact production authority: `8a535267`; source/CI evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_20ded750_cache-bust-fail-closed.md`.",
    f"⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `c8b47201`; last exact production authority: `8a535267`; source/CI evidence: `{REVERIFY}`.",
    "matrix authority paragraph",
)
closed_marker = "## ✅ ЗАКРЫТО (143)\n\n| ID | Описание | Коммит |\n|---|---|---|\n"
closed_row = (
    "| READER-R6-STATE-01 | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** PR #191 replaced independent whole-document progress/resume calculations with one bounded `ReaderState`: one scroll+rAF owner, explicit before/active/after phases, canonical section/time/completion state, one persisted key with BookmarkEngine v4 and `gb-series-pos` migration, and shared consumers across Gill/series/book, Hermenevtika and ordinary `/about/`. ReaderState alone publishes `--gb-read-pct`/`--gb-read-active`. Exact head `2461198f`: Shared `30098725861`, Gill reconciliation `30098725874`, Overlay `30098725895`, Glossary `30098725882`, Native Source `30098725918`, Route Registry/engine sweep `30098725866` and Visual `30098725897` succeeded. Issue #59 closed; merge `a4372707`. | `a4372707` PR#191 |\n"
)
matrix = replace_once(
    matrix,
    closed_marker,
    "## ✅ ЗАКРЫТО (144)\n\n| ID | Описание | Коммит |\n|---|---|---|\n" + closed_row,
    "closed counter and R6 row",
)

lines = matrix.splitlines()
reader_browser_index = next(
    (i for i, line in enumerate(lines) if line.startswith("| READER-PUBLIC-SURFACE-BROWSER-01 |")),
    None,
)
if reader_browser_index is None:
    raise SystemExit("READER-PUBLIC-SURFACE-BROWSER-01 row missing")
lines[reader_browser_index] = (
    "| READER-PUBLIC-SURFACE-BROWSER-01 | ✅ **FIXED/EXTENDED SOURCE+CI VERIFIED 2026-07-24.** PR #145 established the registry-derived Chromium breadth matrix for all 75 public routes at 320/390/1440 and closed the initial Nagornaya mobile failure with 3428/3428 PASS. PR #200 then added permanent all-route touch/browser coverage: Android Chromium 360/430 and iPhone/desktop WebKit 320/390/1440, with exact head `da05253b`, Shared `30098798681`, Route Registry `30098798531`, Android 1828/1828 and WebKit 2660/2660 PASS. Product HTML/Astro/CSS/runtime/content/data were unchanged by #200. | `f9439ef3` PR#145 + `c8b47201` PR#200 |"
)
matrix = "\n".join(lines).rstrip() + "\n"

session = f"""
### 2026-07-24 — Reader R6 canonical closure and cross-browser extension (`c8b47201`)

- PR #191 squash-merged ReaderState R6 as `{R6_MERGE}`; issue #59 closed completed.
- Exact R6 head `{R6_HEAD}` passed Shared Files, Gill reconciliation, Overlay, Glossary, Native Source, Route Registry/engine sweep and Visual Parity.
- PR #200 merged as `{SOURCE_HEAD}` and extended all 75 public routes to Android Chromium plus iPhone/desktop WebKit without changing product surfaces; exact head `{CROSS_BROWSER_HEAD}` passed 1828/1828 Android and 2660/2660 WebKit assertions.
- `READER-R6-STATE-01` is added as a closed canonical row; `READER-PUBLIC-SURFACE-BROWSER-01` is extended rather than duplicated.
- Closed count `143 → 144`; canonical open counts remain P0/P1 `4`, P1 `94`, P2 `35`, P3 `51`, refactoring `4`, AuditRepo `4` — total open `192`.
- Last exact production authority remains `8a535267`; this reconciliation advances source/CI truth only.
"""
matrix += "\n" + session
matrix_path.write_text(matrix)

next_text = next_path.read_text()
next_text = replace_once(
    next_text,
    f"**Current source reverify:** `{PREVIOUS_REVERIFY}`",
    f"**Current source reverify:** `{REVERIFY}`",
    "next current reverify",
)
next_text = replace_once(
    next_text,
    f"Canonical source evidence: `{PREVIOUS_REVERIFY}`.",
    f"Canonical source evidence: `{REVERIFY}`.",
    "next canonical evidence",
)
next_text = replace_once(
    next_text,
    "- Reader R6 PR #191 introduced one canonical ReaderState transaction for progress, resume, bookmarks and reading consumers, including migration from legacy keys.",
    "- `READER-R6-STATE-01` — Reader R6 PR #191 introduced one canonical ReaderState transaction for progress, resume, bookmarks and reading consumers, including migration from legacy keys.",
    "next R6 completed lane",
)
next_text = replace_once(
    next_text,
    "- Browser PR #200 added permanent all-route touch/scroll audits for Android Chromium and iPhone/desktop WebKit. Exact artifacts recorded **1828/1828 Chromium PASS** and **2660/2660 WebKit PASS** over all 75 production routes.",
    "- `READER-PUBLIC-SURFACE-BROWSER-01` — Browser PR #200 extended the existing all-route row with permanent touch/scroll audits for Android Chromium and iPhone/desktop WebKit. Exact artifacts recorded **1828/1828 Chromium PASS** and **2660/2660 WebKit PASS** over all 75 production routes.",
    "next browser completed lane",
)
next_path.write_text(next_text)

reverify_path.parent.mkdir(parents=True, exist_ok=True)
if reverify_path.exists():
    raise SystemExit(f"reverify already exists: {reverify_path}")
reverify_path.write_text(f"""# CURRENT HEAD REVERIFY — 2026-07-24 — Reader R6 matrix closure

## Authority boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact current source `main`: `{SOURCE_HEAD}`
- Reader R6 merge: `{R6_MERGE}` — PR #191, issue #59 closed
- Exact verified R6 PR head: `{R6_HEAD}`
- Exact verified all-route cross-browser PR head: `{CROSS_BROWSER_HEAD}` — PR #200
- Last exact production authority remains `8a5352671375fdb01b6c30273c25ec4283a13f69`
- This document advances source/CI and canonical-matrix truth only; it does not claim a new exact Pages deployment.

This closure is additive to `{PREVIOUS_REVERIFY}`, which already records the complete homepage/Gill/Nagornaya/Reader/WebKit merge chain and artifact digests. That immutable witness is not rewritten.

## Closed canonical row

`READER-R6-STATE-01`

PR #191 established one bounded ReaderState transaction across standalone articles, flat series, books and ordinary reading pages:

1. one scroll+rAF geometry owner;
2. article-bounded progress excluding related/footer content;
3. explicit `before-content`, `active-section` and `after-content` phases;
4. canonical active section, remaining estimate and completion;
5. one `gb:reader-state:v1:<site>:<path>` snapshot with BookmarkEngine v4 and `gb-series-pos` migration;
6. shared consumers in BookmarkEngine, Hermenevtika mobile bar, ReaderRail and series/book chrome;
7. sole publication of `--gb-read-pct` and `--gb-read-active` by ReaderState;
8. permanent engine sweep for Gill, three-level book, Hermenevtika and `/about/`.

## Exact R6 evidence

| Contract | Run | Result |
|---|---:|---|
| Shared Files Guard | `30098725861` | success |
| Gill Final Source Reconciliation | `30098725874` | success |
| Overlay Runtime Browser | `30098725895` | success |
| Glossary Contract | `30098725882` | success |
| Native Source Contract | `30098725918` | success |
| Route Registry Validators | `30098725866` | Audit Pro, ReaderState engine sweep, 75 public routes, semantics and Nagornaya UI success |
| Visual Parity Guard | `30098725897` | current INDEX progressive enhancement and route policy success |

Final R6 scope: 61 permanent files, zero temporary workflows/materializers and zero unresolved review threads.

## Existing browser row extension

`READER-PUBLIC-SURFACE-BROWSER-01` is extended, not duplicated. PR #200 added two system files on top of R6:

- `.github/workflows/route-registry-validators.yml`
- `scripts/public-surface-cross-browser-matrix.mjs`

Exact evidence:

| Contract | Run | Result |
|---|---:|---|
| Shared Files Guard | `30098798681` | success |
| Route Registry Validators | `30098798531` | success |
| Android Chromium | same Route Registry run | 75 routes, 1828/1828 PASS |
| iPhone/desktop WebKit | same Route Registry run | 75 routes, 2660/2660 PASS |

Current `main@{SOURCE_HEAD}` is a descendant of `{R6_MERGE}`. PR #200 changed no product HTML, Astro components, CSS, runtime JavaScript, content or data.

## Counter transition

- Canonical IDs: `335 → 336`
- Closed canonical rows: `143 → 144`
- Canonical open rows: unchanged at `192`
- P0/P1 open: `4`
- P1 open: `94`
- P2 open: `35`
- P3 open: `51`
- Refactoring: `4`
- AuditRepo: `4`

Reader R6 had been scheduled in the operational/system backlog outside open matrix counters, so no open severity bucket is decremented.

## Production boundary

The last exact production authority stays `8a535267`. Exact source and PR-CI evidence must not be substituted for an unobserved current readiness→Pages pair. A later deployment reconciliation may advance production only with exact SHA, readiness run, Pages run and live marker/hash witness.
""")

sys.path.insert(0, str(Path("scripts").resolve()))
from matrix_coverage_lib import parse_matrix
rows, open_ids, closed_rows = parse_matrix(matrix_path.read_text())
if len(rows) != 336 or len(open_ids) != 192 or len(closed_rows) != 144:
    raise SystemExit(
        f"canonical count mismatch: ids={len(rows)} open={len(open_ids)} closed={len(closed_rows)}"
    )

print(f"updated {matrix_path}")
print(f"updated {next_path}")
print(f"created {reverify_path}")
print("canonical counts: 336 ids / 144 closed / 192 open")
