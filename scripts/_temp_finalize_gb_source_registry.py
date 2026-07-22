#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "projects/gb-is-my-strength"
NEXT = PROJECT / "NEXT_AGENT_PROMPT.md"
MATRIX = PROJECT / "verified/MASTER_BUG_MATRIX.md"
REVERIFY = PROJECT / "reverify/CURRENT_HEAD_REVERIFY_2026-07-22_6c4106ae_source-registry-production.md"

TARGET = "6c4106aecd35a3c95b09b041332d653f581ceb92"
PREMERGE = "e9d23d041cf05b58a0719cfda829b44a54b0552d"
HARD = "0a4491184376442923270c412614392717949a18"
SHARED = "29950458595"
VISUAL = "29950458386"
NATIVE = "29950458319"
READINESS = "29950459817"
PAGES = "29951046722"
OBSERVER = "29950695954"
ARTIFACT = "8542524012"
REGISTRY_SHA = "d105f6a309de866550118a4fa7dcd8c8ec9cb8c3f0f68d23dd0c944a8845b4c2"
LIVE_SHA = "b430cdc33e6245e2dc024e8c8802bb5e487bc19a862aee2601c122c72df3f561"
ETAG = '"6a611d07-132af"'
LAST_MODIFIED = "Wed, 22 Jul 2026 19:41:59 GMT"


def sub_once(text, pattern, replacement, label, flags=0):
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return updated


next_text = NEXT.read_text(encoding="utf-8")
header = f'''> **Актуально на 2026-07-22. Source `main`: `{TARGET}`.**
> PR #151 (`{HARD[:8]}`) отдельно зафиксировал native visual ownership `/hard-texts/` без изменения UI;
> PR #149 (`{TARGET[:8]}`) закрыл source-role registry и argument-layer architecture Нагорной.
> **Production подтверждена для exact SHA `{TARGET[:8]}…`:** readiness `{READINESS}` → Pages `{PAGES}`;
> exact main checks Shared Files `{SHARED}`, Visual Parity `{VISUAL}`, Native Source `{NATIVE}` — success.
> Pre-merge exact head `{PREMERGE[:8]}…`: Route Registry/browser `29949641685`, **3428/3428 PASS**;
> `/nagornaya/istochniki/` — 33/33 browser contracts и 0.000% desktop/mobile pixel diff.
> Live/registry witness: AuditRepo run `{OBSERVER}`, artifact `{ARTIFACT}` — registry 3 sources/6 claims, live 8/8 required and 2/2 stale markers absent.
>
> Авторитет по точечным статусам: `verified/MASTER_BUG_MATRIX.md`.
> Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_6c4106ae_source-registry-production.md`.'''
next_text = sub_once(
    next_text,
    r"> \*\*Актуально на 2026-07-22\. Source `main`:[\s\S]*?> Current reverify: `reverify/[^`]+`\.",
    header,
    "next header",
)
next_text = sub_once(next_text, r"# expect [0-9a-f]{8}… or newer", "# expect 6c4106ae… or newer", "next expected sha")
next_text = next_text.replace(
    "- `/articles/` и `/baptisty-rossii/` имеют explicit native ownership; retired legacy HTML не является их render owner;",
    "- `/articles/`, `/baptisty-rossii/` и `/hard-texts/` имеют explicit native ownership; retired legacy HTML не является их render owner;\n- Hard Texts ownership исправлен отдельно PR #151 после fresh 2.496% screenshot witness; причина и реальные guards синхронизированы в profile/policy;",
    1,
)
production = f'''- текущая граница — exact `{TARGET[:8]}…`: readiness `{READINESS}`, Pages `{PAGES}`, все deploy/Pages/IndexNow stages green;
- exact registry blob содержит 3 verified TMSJ sources, 6 claims, author/institution boundaries и neutral Green alternative; SHA-256 `{REGISTRY_SHA}`;
- live origin после cache-buster содержит все три exact PDF/page rows и bounded attribution; 8/8 required, 2/2 stale absent;
- immutable witness — AuditRepo run `{OBSERVER}`, artifact `{ARTIFACT}`, live SHA-256 `{LIVE_SHA}`.'''
next_text = sub_once(
    next_text,
    r"- текущая граница — exact `[^`]+`:[\s\S]*?- immutable witness — AuditRepo run `[^`]+`, artifact `[^`]+`, live SHA-256 `[^`]+`\.",
    production,
    "next production",
)
boundary = '''## Current mandatory boundary

1. Issue #153: build the neutral comparison UI from the landed claim registry; preserve the exact 0.000% sources-page baseline and confessional series position.
2. Issue #146: replace remaining `routeType=unknown` / misnamed series-hub semantics explicitly, without creating another engine.
3. Reader R6 / issue #59 remains an independent state-platform lane.
4. Do not combine epistemic UI, route semantics and ReaderState in one PR.

## Highlights hardening'''
next_text = sub_once(next_text, r"## Current mandatory boundary[\s\S]*?## Highlights hardening", boundary, "next boundary")
architecture = f'''### P1 source-role and argument-layer architecture — LANDED PR #149 (`{TARGET[:8]}`)

- canonical `data/nagornaya/source-registry.json` + JSON Schema own the Green/Thomas/Nichols pilot metadata;
- verified PDF records require requested/resolved URL, exact object, pages, extraction method and last-checked date;
- claim records label historical reconstruction, literary model and doctrinal synthesis, plus alternative, series position, confidence and change condition;
- author-level articles cannot be promoted to institutional doctrine; `doesNotSupport` conflicts fail adversarial tests;
- native sources page derives pilot rows from registry IDs without duplicating URLs/titles or changing visible output;
- final PR head `{PREMERGE[:8]}` passed 3428/3428 browser contracts; sources route 33/33 and 0.000% desktop/mobile.

### P1 neutral comparison UI — ACTIVE ISSUE #153

- consume registry/claim data or a typed projection; no second claim SSOT;
- distinguish observation → reconstruction → model → doctrine → application visibly;
- preserve a clear confessional series position while representing alternatives before the conclusion;
- keep Reader R6 and route semantics out of this UI PR.

Reusable contract:

```text
claim | layer | primary evidence | alternative | series position | confidence | limits | change condition
```

The detailed C43–C94 checklist remains evidence intake; do not inflate the canonical matrix with every sentence-level action.

## Reader R6'''
next_text = sub_once(next_text, r"### P1 architecture — argument/source transparency[\s\S]*?## Reader R6", architecture, "next architecture")
NEXT.write_text(next_text, encoding="utf-8")

matrix = MATRIX.read_text(encoding="utf-8")
masthead = f'''| Source HEAD | `{TARGET}` (main; Hard Texts native visual ownership plus Nagornaya source-role registry/argument layers landed) |
| Deploy | ✅ **PRODUCTION VERIFIED @ `{TARGET[:8]}`.** Exact main checks: Shared `{SHARED}`, Visual `{VISUAL}`, Native `{NATIVE}`, readiness `{READINESS}`; readiness created Pages `{PAGES}` for the same SHA. Pre-merge Route Registry/browser `29949641685` recorded 3428/3428 PASS and `/nagornaya/istochniki/` 33/33. AuditRepo witness `{OBSERVER}` / artifact `{ARTIFACT}` verified registry 3 sources/6 claims and live HTTP 200 with 8/8 required, 2/2 stale absent; live SHA-256 `{LIVE_SHA}`. |
| Системный бэклог | `SUPER_AUDIT_2026-07-06_14a49be8.md` — волны W1–W10, **вне счётчиков матрицы**; W1 still empirically blocking |
| Консолидация | 2026-07-05 (из монолита → `archive/2026-07-04-stale-matrix/MASTER_BUG_MATRIX_FULL_2026-07-03.md`) |
| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_6c4106ae_source-registry-production.md` |

⚠️ Старые deploy-формулировки ниже исторические. Текущий authority — `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_6c4106ae_source-registry-production.md`; exact production deployment доказана readiness `{READINESS}` → Pages `{PAGES}` на `{TARGET[:8]}`, live/registry witness `{OBSERVER}`.'''
matrix = sub_once(
    matrix,
    r"\| Source HEAD \|[\s\S]*?⚠️ Старые deploy-формулировки[^\n]+",
    masthead,
    "matrix masthead",
)
matrix = matrix.replace("## ✅ ЗАКРЫТО (124)", "## ✅ ЗАКРЫТО (127)", 1)
anchor = "| CI-VISUAL-PARITY-ROUTE-POLICY-01 | ✅ **FIXED/VERIFIED 2026-07-22.** PR #148 made screenshot capture diagnostic and route policy authoritative: blocking `legacy-diff` remains baseline+0.5%; explicit `native-contract` requires a reason, real unique guard files and profile/policy agreement. `/articles/` and `/baptisty-rossii/` declare native ownership; `/karty/` retains reviewed legacy raster baseline. Fake guards and ordinary regressions fail. Exact main pixel gate and production deploy are green. | `aeae401d` PR#148 |"
rows = anchor + f'''
| CI-HARD-TEXTS-NATIVE-VISUAL-OWNERSHIP-01 | ✅ **FIXED/VERIFIED 2026-07-22.** Fresh screenshots exposed a 2.496% mobile legacy-vs-dist difference because retired legacy HTML omitted the current six-card «Материалы серии» section. PR #151 declared explicit native ownership with route-specific source/component, data-consistency and all-route browser guards; tolerance stayed 0.5%; product UI unchanged. | `{HARD[:8]}` PR#151 |
| NG-SOURCE-REGISTRY-01 | ✅ **FIXED/VERIFIED 2026-07-22.** PR #149 added the canonical source registry + JSON Schema for Green/Thomas/Nichols, exact PDF/page/extraction/last-checked metadata, supports/doesNotSupport and author/editorial/institution levels. Native source rows derive from registry IDs; exact live/registry witness passed. | `{TARGET[:8]}` PR#149 |
| NG-EPISTEMIC-MODEL-LAYERS-01 | ✅ **FIXED/VERIFIED 2026-07-22.** Claim records now distinguish historical reconstruction, literary model and doctrinal synthesis and record primary evidence, alternative, series position, confidence and change condition. Author→institution promotion and conflicting evidence fail adversarial tests. | `{TARGET[:8]}` PR#149 |'''
if anchor not in matrix:
    raise SystemExit("matrix closed anchor missing")
matrix = matrix.replace(anchor, rows, 1)
matrix = sub_once(matrix, r"^\| NG-EPISTEMIC-MODEL-LAYERS-01 \|.*\n", "", "remove model open", re.M)
matrix = sub_once(matrix, r"^\| NG-SOURCE-REGISTRY-01 \|.*\n", "", "remove registry open", re.M)
matrix = sub_once(
    matrix,
    r"^\| NG-UI-EPISTEMIC-BIAS-01 \|.*$",
    "| NG-UI-EPISTEMIC-BIAS-01 | 🟠 **Нагорная P1 UI/content interaction — issue #153.** Registry/model layers landed, and the sources route now has a retained 3428/3428 all-route witness plus 0.000% desktop/mobile pixel baseline. Build one registry-driven neutral model/evidence/alternative/position/limits comparison while preserving the explicit confessional conclusion. | PR#149 baseline + issue#153; D18/C80/C92 |",
    "update UI open",
    re.M,
)
matrix = matrix.replace("## 🟠 P1 — ОТКРЫТО (215)", "## 🟠 P1 — ОТКРЫТО (213)", 1)
session = f'''

### 2026-07-22 — Hard Texts visual ownership and Nagornaya registry production closure

- PR #151 squash-merged as `{HARD}` after fresh screenshots proved the strict-native Hard Texts landing intentionally renders the current six-card Materials section absent from retired legacy HTML; global tolerance remained 0.5%.
- PR #149 squash-merged as `{TARGET}`; issue #142 closed. Canonical registry/schema, three exact TMSJ sources, six claim/boundary records, native derivation and adversarial tests landed.
- Final PR head `{PREMERGE}`: Shared `29949641691`, Route/browser `29949641685`, Native `29949641690`, Visual `29949641802` — success; 3428/3428 overall, sources route 33/33 and 0.000% desktop/mobile.
- Exact main: Shared `{SHARED}`, Visual `{VISUAL}`, Native `{NATIVE}`, readiness `{READINESS}`; Pages `{PAGES}` deployed the same SHA.
- AuditRepo witness `{OBSERVER}`, artifact `{ARTIFACT}`: registry SHA-256 `{REGISTRY_SHA}`, live HTTP 200, 8/8 required, 2/2 stale absent, live SHA-256 `{LIVE_SHA}`, ETag `{ETAG}`, Last-Modified `{LAST_MODIFIED}`.
- Closed count 124 → 127; open P1 count 215 → 213. Next isolated lanes: issue #153 neutral comparison UI, issue #146 route semantics, Reader R6 #59.
'''
if "### 2026-07-22 — Hard Texts visual ownership and Nagornaya registry production closure" in matrix:
    raise SystemExit("matrix session already present")
matrix = matrix.rstrip() + session + "\n"
MATRIX.write_text(matrix, encoding="utf-8")

reverify = f'''# CURRENT HEAD REVERIFY — 2026-07-22 — source registry production

## Authority

- Source `main`: `{TARGET}`.
- Hard Texts visual ownership: PR #151 / `{HARD}`; issue #150 closed.
- Nagornaya source-role and argument-layer registry: PR #149 / `{TARGET}`; issue #142 closed.
- Next UI lane: issue #153; route semantics #146 and Reader R6 #59 remain separate.

## Exact pre-merge evidence

- PR head: `{PREMERGE}`.
- Shared Files Guard `29949641691`: registry/source adversarial tests and actionlint passed.
- Route Registry/browser `29949641685`: 3428/3428 contracts PASS across 75 public routes × 3 viewports.
- `/nagornaya/istochniki/`: 33/33 contracts PASS at 320, 390 and 1440; HTTP 200, no overflow/page errors/asset/a11y/native-isolation failures.
- Native Source `29949641690`: Astro check, production-like build, native output, metadata/workflow coherence and clean-tree passed.
- Visual `29949641802`: `/nagornaya/istochniki/` 0.000% desktop / 0.000% mobile.

## Registry contract

- Three verified sources: Green `tmsj12d.pdf` 49–68; Thomas `tmsj7d.pdf` 75–105; Nichols `tmsj7h.pdf` 213–239.
- Six claims: three supported author-level arguments and three unsupported institution-level attribution boundaries.
- Claims record layer, primary evidence, alternative, series position, confidence and change condition.
- Negative tests reject Thomas→Nichols object mutation, author→institution promotion, conflicting `doesNotSupport`, incomplete verified PDF metadata, unknown schema fields and native hard-coding.
- Exact registry SHA-256: `{REGISTRY_SHA}`.

## Exact production evidence

- Shared Files Guard `{SHARED}`: success.
- Visual Parity `{VISUAL}`: success.
- Native Source `{NATIVE}`: success.
- Readiness `{READINESS}`: success for exact `{TARGET}`.
- Pages `{PAGES}`: success for the same SHA.
- AuditRepo observer `{OBSERVER}`, artifact `{ARTIFACT}`.
- Live `/nagornaya/istochniki/`: HTTP 200; 8/8 required markers; 2/2 stale markers absent.
- Live SHA-256: `{LIVE_SHA}`.
- ETag: `{ETAG}`; Last-Modified: `{LAST_MODIFIED}`.

## Next boundary

1. Issue #153: registry-driven neutral comparison UI with before/after screenshots and preserved confessional position.
2. Issue #146: explicit route semantics cleanup without a new engine.
3. Reader R6 / issue #59 as an independent state-platform lane.
4. Do not combine UI, route semantics and ReaderState.
'''
REVERIFY.write_text(reverify, encoding="utf-8")
print("finalized source registry SSOT")
