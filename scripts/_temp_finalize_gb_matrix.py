#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
project = ROOT / "projects/gb-is-my-strength"
matrix_path = project / "verified/MASTER_BUG_MATRIX.md"

matrix = matrix_path.read_text(encoding="utf-8")

def replace_once(old: str, new: str) -> None:
    global matrix
    count = matrix.count(old)
    if count != 1:
        raise SystemExit(f"expected one matrix occurrence, got {count}: {old[:120]!r}")
    matrix = matrix.replace(old, new, 1)

replace_once(
    "| Source HEAD | `2599844b2ea0962f728824564ed6fa6ef9592270` (main; Nagornaya technical, highlights, pastoral and source-integrity lanes landed) |",
    "| Source HEAD | `aeae401d782d769dad582395f2045fa79c020f42` (main; all-route browser closure and route-owned visual parity policy landed after Nagornaya technical/highlights/pastoral/source-integrity lanes) |",
)
replace_once(
    "| Deploy | ✅ **PRODUCTION VERIFIED.** Pages run `29910271842` successfully deployed exact readiness-verified SHA `a0c9c025b05eccfce0ab4818da250d05d1b65da0`; every publication/runtime/SW/Pages step passed and the observer recorded five source/live SHA-256 PASS results. Issue #58 closed; observer/trigger removed by PR #131 (`942a79eb`). |",
    "| Deploy | ✅ **PRODUCTION VERIFIED @ `aeae401d`.** Exact main checks passed: Shared Files `29938007239`, Visual Parity `29938007421`, Native Source `29938007246`, readiness `29938007259`; readiness created Pages `29938389078` for the same SHA. Pre-merge Route Registry/browser run `29937357579` recorded 3428/3428 PASS. AuditRepo witness `29938751151` / artifact `8537627473` verified live HTTP 200, 7/7 required markers, 2/2 stale markers absent, live SHA-256 `b430cdc33e6245e2dc024e8c8802bb5e487bc19a862aee2601c122c72df3f561`. |",
)
replace_once(
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_2599844b_source-integrity.md` |",
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_aeae401d_reader-browser-visual-policy-production.md` |",
)
replace_once(
    "⚠️ Старые 2026-07-14/20/21 deploy-формулировки ниже исторические. Текущий authority — `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_942a79eb_production-witness.md`; exact production deployment доказана run `29910271842` на `a0c9c025`.",
    "⚠️ Старые deploy-формулировки ниже исторические. Текущий authority — `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_aeae401d_reader-browser-visual-policy-production.md`; exact production deployment доказана readiness `29938007259` → Pages `29938389078` на `aeae401d`, live-origin witness `29938751151`.",
)
replace_once("## ✅ ЗАКРЫТО (122)", "## ✅ ЗАКРЫТО (124)")

anchor = "| NG-SOURCE-INTEGRITY-01 | ✅ **FIXED 2026-07-22.** Green corrected to 49–68; Thomas and Nichols linked to exact official `tmsj7d.pdf` / `tmsj7h.pdf`; negative object regression added; source-verification claim bounded; Part IV separates Green's argument, venue and series synthesis. Issue #140 closed; full publication and Native Source green. | `2599844b` PR#141 |"
rows = """
| READER-PUBLIC-SURFACE-BROWSER-01 | ✅ **FIXED/VERIFIED 2026-07-22.** PR #145 added a registry-derived Chromium breadth matrix for all 75 public production routes at 320/390/1440 and closed the only initial failure: the native Nagornaya 320px bar/speed-sheet/heading/glossary cluster. Final PR head recorded **3428/3428 PASS**, with permanent failure diagnostics and regressions. | `f9439ef3` PR#145 |
| CI-VISUAL-PARITY-ROUTE-POLICY-01 | ✅ **FIXED/VERIFIED 2026-07-22.** PR #148 made screenshot capture diagnostic and route policy authoritative: blocking `legacy-diff` remains baseline+0.5%; explicit `native-contract` requires a reason, real unique guard files and profile/policy agreement. `/articles/` and `/baptisty-rossii/` declare native ownership; `/karty/` retains reviewed legacy raster baseline. Fake guards and ordinary regressions fail. Exact main pixel gate and production deploy are green. | `aeae401d` PR#148 |"""
if rows.strip() not in matrix:
    replace_once(anchor, anchor + rows)

session = """

### 2026-07-22 — all-route browser and visual-policy production closure

- PR #145 squash-merged as `f9439ef303601e1dc68b5c40ff4d0e1ec8db6a3e`; final head `ebc298b3` passed Shared Files `29925122651`, Native Source `29925122656` and Route Registry/browser `29925123418`, with 3428/3428 contracts PASS across 75 routes × 3 viewports.
- PR #148 squash-merged as final source `aeae401d782d769dad582395f2045fa79c020f42`; exact PR-head checks: Shared `29937354573`, Visual `29937351115`, Native `29937351111`, Route/browser `29937357579` — success.
- Exact main checks passed: Shared `29938007239`, Visual `29938007421`, Native `29938007246`, readiness `29938007259`; Pages `29938389078` deployed the same SHA.
- Live-origin witness: AuditRepo run `29938751151`, artifact `8537627473`; HTTP 200, 7/7 required markers, 2/2 forbidden stale markers absent, SHA-256 `b430cdc33e6245e2dc024e8c8802bb5e487bc19a862aee2601c122c72df3f561`, ETag `"6a60f46c-132af"`, Last-Modified `Wed, 22 Jul 2026 16:48:44 GMT`.
- Closed count 122 → 124. Next isolated boundaries: issue #142 source-role registry, issue #146 route semantics, then Reader R6 issue #59.
"""
if "### 2026-07-22 — all-route browser and visual-policy production closure" not in matrix:
    matrix = matrix.rstrip() + session

matrix_path.write_text(matrix, encoding="utf-8")
assert "## ✅ ЗАКРЫТО (124)" in matrix
assert matrix.count("READER-PUBLIC-SURFACE-BROWSER-01") == 1
assert matrix.count("CI-VISUAL-PARITY-ROUTE-POLICY-01") == 1
print("FINALIZE_GB_MATRIX=PASS")
