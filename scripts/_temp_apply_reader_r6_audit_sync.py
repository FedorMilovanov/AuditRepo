from pathlib import Path
import sys

SOURCE_HEAD = "c8b47201f5b7210d69809c38808bfbda15695dcd"
R6_MERGE = "a43727078d0f39e541a5aad8cd250a90310181a9"
R6_HEAD = "2461198f45033d8cce5f2444a9492d9f8176fa01"
CROSS_BROWSER_HEAD = "da05253bfc37db7b57318492f5576bd929c5c140"
REVERIFY = "reverify/CURRENT_HEAD_REVERIFY_2026-07-24_c8b47201_reader-r6-cross-browser.md"


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
    "| Source HEAD | `c8b47201f5b7210d69809c38808bfbda15695dcd` (current source main; ReaderState R6 #191 and all-route Android/WebKit #200 layered on the current INDEX, Gill and Nagornaya work) |",
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
    "| READER-R6-STATE-01 | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** PR #191 replaced independent whole-document progress/resume calculations with one bounded `ReaderState`: one scroll+rAF owner, explicit before/active/after phases, canonical section/time/completion state, one persisted key with BookmarkEngine v4 and `gb-series-pos` migration, and shared consumers across Gill/series/book, Hermenevtika and ordinary `/about/`. The canonical service alone publishes `--gb-read-pct`/`--gb-read-active`. Exact head `2461198f`: Shared `30098725861`, Gill reconciliation `30098725874`, Overlay `30098725895`, Glossary `30098725882`, Native Source `30098725918`, Route Registry/engine sweep `30098725866` and Visual `30098725897` succeeded. Issue #59 closed; merge `a4372707`. | `a4372707` PR#191 |\n"
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
    "| READER-PUBLIC-SURFACE-BROWSER-01 | ✅ **FIXED/EXTENDED SOURCE+CI VERIFIED 2026-07-24.** PR #145 established the registry-derived Chromium breadth matrix for all 75 public routes at 320/390/1440 and closed the initial Nagornaya mobile failure with 3428/3428 PASS. PR #200 then added permanent all-route touch/browser coverage: Android Chromium 360/430 and iPhone/desktop WebKit 320/390/1440, with exact head `da05253b`, Shared `30098798681`, Route Registry `30098798531`, Android 1828/1828 and WebKit 2660/2660 PASS. Product HTML/Astro/CSS/runtime/content were unchanged by #200. | `f9439ef3` PR#145 + `c8b47201` PR#200 |"
)
matrix = "\n".join(lines).rstrip() + "\n"

session = f"""

### 2026-07-24 — Reader R6 and all-route Android/WebKit closure (`c8b47201`)

- PR #191 squash-merged ReaderState R6 as `{R6_MERGE}`; issue #59 closed completed.
- Exact PR head `{R6_HEAD}` passed Shared Files, Gill reconciliation, Overlay, Glossary, Native Source, Route Registry/engine sweep and Visual Parity.
- PR #200 merged as `{SOURCE_HEAD}` and extended all 75 public routes to Android Chromium plus iPhone/desktop WebKit without changing product surfaces; exact head `{CROSS_BROWSER_HEAD}` passed 1828/1828 Android and 2660/2660 WebKit assertions.
- `main@{SOURCE_HEAD}` is a descendant of R6; the only post-R6 files are `.github/workflows/route-registry-validators.yml` and `scripts/public-surface-cross-browser-matrix.mjs`.
- Closed count `143 → 144`; canonical open counts remain P0/P1 `4`, P1 `94`, P2 `35`, P3 `51`, refactoring `4`, AuditRepo `4` — total open `192`.
- Last exact production authority remains `8a535267`; this reconciliation advances source/CI truth and records live route availability, but does not invent a new exact Pages run.
"""
matrix += session.lstrip("\n")
matrix_path.write_text(matrix)

next_text = next_path.read_text()
next_text = replace_once(
    next_text,
    "**Source main:** `20ded750327f79e46efa4e50d4d7cd7171e7d9a1`",
    f"**Source main:** `{SOURCE_HEAD}`",
    "next source head",
)
next_text = replace_once(
    next_text,
    "**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_20ded750_cache-bust-fail-closed.md`",
    f"**Current source reverify:** `{REVERIFY}`",
    "next reverify",
)
next_text = replace_once(
    next_text,
    "- source `main` is `20ded750`;",
    "- source `main` is `c8b47201`;",
    "next source boundary",
)
next_text = replace_once(
    next_text,
    "- homepage PRs #181/#182, Gill PRs #156/#174, glossary PR #183, Bible PR #185, content-coverage PR #186, audit corpus PR #169, map keyboard PR #173, cancellable TTS PR #177 and fail-closed revision PR #187 are source/CI verified, but this AuditRepo update does not claim a new exact Pages deployment.",
    "- current INDEX/home work (#181/#182/#193/#195/#196), Gill reconciliation (#156/#174/#192), Nagornaya 320px fixes (#197/#199), glossary #183, Bible #185, content coverage #186, fail-closed revisions #187, ReaderState R6 #191 and all-route Android/WebKit #200 are source/CI verified, but this AuditRepo update does not claim a new exact Pages deployment.",
    "next merged authority list",
)
next_text = replace_once(
    next_text,
    "Canonical evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_20ded750_cache-bust-fail-closed.md`.",
    f"Canonical evidence: `{REVERIFY}`.",
    "next evidence path",
)
completed_marker = "- `CACHE-BUST-NO-WRITER` — closed by PR #187 as an obsolete unsafe prescription: general workflow writers are forbidden, stale revisions fail closed before merge/deploy, and the single glossary autofix exception is permanently constrained and mutation-tested.\n"
completed_addition = completed_marker + (
    "- `READER-R6-STATE-01` — closed by PR #191: one bounded ReaderState owns progress, active section, remaining time, completion, CSS publication, persistence and legacy resume migration across article/series/book/page reading surfaces.\n"
    "- `READER-PUBLIC-SURFACE-BROWSER-01` — extended by PR #200: every production route now has permanent Android Chromium and iPhone/desktop WebKit touch coverage in addition to the existing Chromium breadth matrix.\n"
)
next_text = replace_once(next_text, completed_marker, completed_addition, "next completed lanes")
concurrent_old = """- source PR #178 is superseded by merged Bible PR #185 and must not be merged from its stale branch;
- source PR #136 and #130 — isolated documentation link repairs;
- glossary PR #183, Bible PR #185, Research PR #7 and AuditRepo Gill PR #27 are merged; refresh their resulting `main` state rather than reopening the retired branches.
"""
concurrent_new = """- no source pull requests were open at this reverify; refresh the PR list before starting any new lane;
- AuditRepo PR #36 is merged and owns the additive Gill lossless/site-main closure document; preserve it when rebasing this SSOT;
- retired source branches #178/#136/#130 and merged glossary/Bible/Gill branches must not be reopened from stale heads.
"""
next_text = replace_once(next_text, concurrent_old, concurrent_new, "next concurrent boundaries")
active_old = """2. **Reader R6 / issue #59**
   - unify progress, resume, bookmarks and notes only after shared-runtime overlap with PR #161 is resolved;
   - books remain `surface=series` + `seriesShape=book`, not a second engine.

3. Continue verified P0/P1 order from `MASTER_BUG_MATRIX.md`, refreshing active PR intersections before every lane.
"""
active_new = """2. Continue verified P0/P1 order from `MASTER_BUG_MATRIX.md`, refreshing source `main` and active PR intersections before every lane.

Reader R6 / issue #59 is complete and must not be reopened without current-head counter-evidence.
"""
next_text = replace_once(next_text, active_old, active_new, "next active order")
next_path.write_text(next_text)

reverify_path.parent.mkdir(parents=True, exist_ok=True)
if reverify_path.exists():
    raise SystemExit(f"reverify already exists: {reverify_path}")
reverify_path.write_text(f"""# CURRENT HEAD REVERIFY — 2026-07-24 — Reader R6 + all-route cross-browser

## Authority boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Current source `main`: `{SOURCE_HEAD}` — PR #200
- Reader R6 merge: `{R6_MERGE}` — PR #191, issue #59 closed
- Exact verified R6 PR head: `{R6_HEAD}`
- Exact verified cross-browser PR head: `{CROSS_BROWSER_HEAD}`
- Last exact production authority remains `8a5352671375fdb01b6c30273c25ec4283a13f69`
- This document advances source/CI truth only. Live homepage, `/about/` and Gill Part I were reachable after the R6 merge, but no new exact readiness→Pages run is claimed here.

## Closed canonical row

`READER-R6-STATE-01`

PR #191 replaced independent document-progress implementations with one shared transaction:

1. `js/reader-state.js` owns the only scroll+rAF measurement loop.
2. Progress is bounded to the reading article rather than footer/related content.
3. `before-content`, `active-section` and `after-content` prevent false first/last heading state.
4. Active section, remaining time, completion and canonical percentage derive from the same geometry.
5. Persistence uses `gb:reader-state:v1:<site>:<path>` and migrates BookmarkEngine v4 plus `gb-series-pos`.
6. BookmarkEngine, Hermenevtika, ReaderRail and series/book chrome consume `gb:reader-state-change` instead of owning formulas.
7. ReaderState alone publishes `--gb-read-pct` and `--gb-read-active` on every reading surface.
8. Permanent Chromium matrix covers Gill flat series, a three-level book, Hermenevtika standalone article and ordinary `/about/`.

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

The final PR contained 61 permanent files, zero temporary workflows/materializers and zero unresolved review threads.

## Current-main descendant evidence

`main@{SOURCE_HEAD}` is ahead of `{R6_MERGE}` by the PR #200 cross-browser layer only:

- `.github/workflows/route-registry-validators.yml`
- `scripts/public-surface-cross-browser-matrix.mjs`

PR #200 exact-head evidence:

| Contract | Run | Result |
|---|---:|---|
| Shared Files Guard | `30098798681` | success |
| Route Registry Validators | `30098798531` | success |
| Android Chromium matrix | same Route Registry run | 75 routes, 1828/1828 PASS |
| WebKit matrix | same Route Registry run | 75 routes, 2660/2660 PASS |

PR #200 did not change HTML, Astro components, CSS, runtime JavaScript, content or data. It strengthens the witness for the existing `READER-PUBLIC-SURFACE-BROWSER-01` row without creating a duplicate canonical finding.

## Counter transition

- Closed canonical rows: `143 → 144`
- Canonical open rows: unchanged at `192`
- P0/P1 open: `4`
- P1 open: `94`
- P2 open: `35`
- P3 open: `51`
- Refactoring: `4`
- AuditRepo: `4`
- Canonical IDs after reconciliation: `336`

Reader R6 had been scheduled only in `NEXT_AGENT_PROMPT.md` / system backlog, explicitly outside open matrix counters. Therefore no open severity bucket is decremented.

## Production boundary

The last exact production authority stays `8a535267`. Source and PR-CI evidence are exact; live route availability is a useful witness but is not substituted for a missing exact readiness→Pages pair. A later deploy reconciliation may advance production authority only with the exact SHA and run IDs.
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
