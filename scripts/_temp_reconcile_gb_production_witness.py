#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "projects/gb-is-my-strength"
PROMPT = PROJECT / "NEXT_AGENT_PROMPT.md"
MATRIX = PROJECT / "verified/MASTER_BUG_MATRIX.md"
REVERIFY = PROJECT / "reverify/CURRENT_HEAD_REVERIFY_2026-07-22_942a79eb_production-witness.md"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one anchor, found {count}")
    return text.replace(old, new, 1)


prompt = PROMPT.read_text(encoding="utf-8")
prompt = replace_once(
    prompt,
    "> **Актуально на 2026-07-22. Source `main`: `2b67ee8f6ee788cb0457b5171e1d99d7afeff5dd`.**\n"
    "> PR #98, #101–#104, #106, #108, #109, #111 и #115 влиты.\n"
    "> Source/release gates после исправления Gill smoke снова готовы к linked readiness → Pages,\n"
    "> но **exact successful deployed SHA + production blob proof всё ещё pending**.\n"
    "> Не объявлять production-deploy подтверждённым без автоматического witness в issue #58.\n"
    ">\n"
    "> Авторитет по точечным статусам: `verified/MASTER_BUG_MATRIX.md`.\n"
    "> Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_2b67ee8f_nagornaya-deep-audit.md`.\n",
    "> **Актуально на 2026-07-22. Source `main`: `942a79eb6d9bd7542e47470260dd3bbd69d533d8`.**\n"
    "> PR #119, #123, #125, #128 и #131 завершили release-транзакцию после Reader R5/special overlays.\n"
    "> **Production подтверждена:** Pages run `29910271842` успешно развернул exact readiness-verified\n"
    "> SHA `a0c9c025b05eccfce0ab4818da250d05d1b65da0`; observer записал PASS для пяти\n"
    "> критических source/live blob. Issue #58 закрыта, временный observer удалён PR #131.\n"
    ">\n"
    "> Авторитет по точечным статусам: `verified/MASTER_BUG_MATRIX.md`.\n"
    "> Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_942a79eb_production-witness.md`.\n",
    "prompt masthead",
)
prompt = prompt.replace("# expect 2b67ee8f… or newer", "# expect 942a79eb… or newer", 1)
prompt = replace_once(
    prompt,
    "### Deploy repair — PR #108/#109/#111/#115\n\n"
    "- PR #108 (`869558cd`): 62 stale sources / 113 revision mismatches reconciled;\n"
    "- PR #109 (`1bbebc2d`): read-only revisions + workflow policy block every PR and direct deploy;\n"
    "- PR #111 (`372eba5b`): readiness workflow name correctly linked to Pages deploy, protected regression test;\n"
    "- failed Pages run `29870616511` reached only stale Gill mobile smoke assertion;\n"
    "- PR #115 (`2b67ee8f`) corrected that assertion; complete production-like build + Gill smoke passed;\n"
    "- production UI/runtime was not changed by #115;\n"
    "- exact successful Pages/blob witness remains required.\n\n"
    "## Current mandatory boundary — finish production witness\n\n"
    "Issue #58 is source-complete but must stay open until the observer records:\n\n"
    "1. successful `Metadata & IndexNow Readiness`;\n"
    "2. successful `Deploy to GitHub Pages` with immutable run ID/head SHA;\n"
    "3. PASS for source-vs-production SHA-256 of `site-utils.js`, `site.js`, floating cluster,\n"
    "   MapEngine and committed MindMap app;\n"
    "4. cleanup of temporary observer/trigger through PR #110.\n\n"
    "Do not merge another functional `main` change before this evidence, otherwise the comparison target becomes ambiguous.\n",
    "### Production release closure — PR #119/#123/#125/#128/#131\n\n"
    "- PR #119 (`41f78f43`) made readiness observe every `scripts/**` correction;\n"
    "- PR #123 (`a6a78304`) aligned the Gill frosted-bar audit with the canonical `.80/.78 + blur` contract;\n"
    "- PR #125 (`e4cf04ab`) established one automatic owner: every `main` push → readiness → Pages;\n"
    "- automatic deploy checks out exact `workflow_run.head_sha`, never moving `main`;\n"
    "- Pages run `29907735891` then exposed one final SW baseline drift, fixed by PR #128 (`a0c9c025`);\n"
    "- Pages run `29910271842` succeeded for exact `a0c9c025` through all publication/runtime/SW/deploy stages;\n"
    "- observer recorded PASS for `site-utils.js`, `site.js`, floating cluster, MapEngine and committed MindMap app;\n"
    "- issue #58 closed completed; PR #131 (`942a79eb`) removed the temporary observer and trigger.\n\n"
    "## Current mandatory boundary — land isolated prepared P0 fixes\n\n"
    "1. Revalidate and merge PR #126 (`NG-RUNTIME-BAR-ASSET-01`) from current main.\n"
    "2. Revalidate and merge PR #120 (highlights dedupe/ARIA), then close issue #112.\n"
    "3. Recreate the verified pastoral-safety artifact as a clean separate PR.\n"
    "4. Only then proceed to source-integrity P1 and Reader R6; do not combine these lanes.\n",
    "production closure block",
)
prompt = prompt.replace("Prepared but not landed — highlights / issue #112 / PR #113", "Prepared but not landed — highlights / issue #112 / PR #120", 1)
prompt = prompt.replace("The real implementation is in draft PR #113:", "The clean rebuilt implementation is in draft PR #120:", 1)
prompt = prompt.replace(
    "Before merge: rebuild a clean branch from current main, materialize only permanent files/generated\nrevisions, rerun final guards, then merge and close issue #112. Do not resurrect temporary patchers.",
    "PR #120 has already been rebuilt cleanly and synchronized with the release fixes. Revalidate from current\n`main`, merge only the permanent runtime/test/generated-revision diff, then close issue #112.",
    1,
)
prompt = prompt.replace(
    "Prepare an isolated technical PR now, but do not merge before production witness. Required:\nrevision regex hardening, five Astro refs, five shadow refs/regeneration, permanent source contract,\nproduction-like dist + 360/390 Chromium runtime witness.",
    "Clean draft PR #126 already implements this technical P0 and passed source, adversarial, production-like\nand Chromium checks. It is now synchronized with the v191 SW baseline; refresh from `942a79eb`, rerun\nstandard CI, then merge before other Nagornaya content or UI work.",
    1,
)
PROMPT.write_text(prompt, encoding="utf-8")

matrix = MATRIX.read_text(encoding="utf-8")
matrix = replace_once(
    matrix,
    "| Source HEAD | `2b67ee8f6ee788cb0457b5171e1d99d7afeff5dd` (main; Reader R1–R5, special overlay adapters, revision/deploy guards, readiness linkage and Gill deploy-smoke correction landed) |\n"
    "| Deploy | 🟠 **SOURCE/RELEASE GATES GREEN THROUGH `2b67ee8f` / EXACT DEPLOYED SHA + BLOB PROOF PENDING.** PR #111 restored readiness→Pages linkage. Pages run `29870616511` reached only a stale Gill smoke assertion; PR #115 corrected the test after a full production-like build + complete Gill smoke passed. Keep issue #58 open until the observer records successful Pages and five source/production blob PASS results. |\n",
    "| Source HEAD | `942a79eb6d9bd7542e47470260dd3bbd69d533d8` (main; single-owner exact-SHA deploy topology, v191 SW baseline and witness cleanup landed) |\n"
    "| Deploy | ✅ **PRODUCTION VERIFIED.** Pages run `29910271842` successfully deployed exact readiness-verified SHA `a0c9c025b05eccfce0ab4818da250d05d1b65da0`; every publication/runtime/SW/Pages step passed and the observer recorded five source/live SHA-256 PASS results. Issue #58 closed; observer/trigger removed by PR #131 (`942a79eb`). |\n",
    "matrix masthead",
)
matrix = matrix.replace(
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_2b67ee8f_nagornaya-deep-audit.md` |",
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_942a79eb_production-witness.md` |",
    1,
)
matrix = matrix.replace(
    "⚠️ Старые 2026-07-14/20/21 deploy-формулировки ниже исторические. Текущий source/release authority — `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_2b67ee8f_nagornaya-deep-audit.md`; exact production deployment остаётся отдельным доказательством.",
    "⚠️ Старые 2026-07-14/20/21 deploy-формулировки ниже исторические. Текущий authority — `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_942a79eb_production-witness.md`; exact production deployment доказана run `29910271842` на `a0c9c025`.",
    1,
)
matrix = matrix.replace("## ✅ ЗАКРЫТО (117)", "## ✅ ЗАКРЫТО (118)", 1)
closed_anchor = "| ID | Описание | Коммит |\n|---|---|---|\n"
closed_row = "| PROD-STALE-DEPLOY-RED | ✅ **FIXED/VERIFIED 2026-07-22.** PR #125 removed competing direct Pages ownership and pinned automatic deploy checkout to exact readiness `head_sha`; PR #128 synchronized the v191 SW baseline. Pages run `29910271842` succeeded for exact `a0c9c025`; observer recorded PASS for five critical source/live blobs; issue #58 closed and PR #131 removed witness infrastructure. | `e4cf04ab` PR#125 + `a0c9c025` PR#128 + `942a79eb` PR#131 |\n"
if closed_row not in matrix:
    matrix = replace_once(matrix, closed_anchor, closed_anchor + closed_row, "closed table anchor")
open_row = "| PROD-STALE-DEPLOY-RED | 🟠 **2026-07-22 REVERIFY:** source/release gates green through `2b67ee8f`; PR #111 repaired readiness→Pages linkage and PR #115 repaired the final stale Gill deploy-smoke expectation. Keep open only for immutable successful Pages run/head SHA plus five production/source blob PASS results and observer cleanup. | PR#106/#108/#109/#111/#115 verified; deploy witness pending |\n"
matrix = replace_once(matrix, open_row, "", "remove open deploy row")
matrix = matrix.replace(
    "Actual fix is prepared and transaction-verified in draft PR #113 but not landed. | current-source negative witness + issue #112 / PR #113 |",
    "Clean fix is prepared and transaction-verified in draft PR #120 but not landed. | current-source negative witness + issue #112 / PR #120 |",
    1,
)
matrix = matrix.replace(
    "Fix regex + 5 Astro refs + 5 shadow/materialized refs; require dist and 360/390 Chromium witness. | verified-source `2b67ee8f`; intake 2026-07-22 |",
    "Clean draft PR #126 implements regex hardening, five Astro refs, five shadow refs, permanent contracts and Chromium witnesses; synchronized with v191 baseline, still requires current-main revalidation and merge. | PR #126 verified/prepared; not landed |",
    1,
)
log = """

### 2026-07-22 — exact production witness and cleanup

- Source release sequence: PR #119 `41f78f43` → PR #123 `a6a78304` → PR #125 `e4cf04ab` → PR #128 `a0c9c025` → PR #131 `942a79eb`.
- PR #125 made readiness the only automatic owner for every `main` push and deploy checkout exact `workflow_run.head_sha`.
- Pages run `29910271842` succeeded for exact readiness-verified `a0c9c025`; all publication, Astro, Pagefind, schema, Gill, runtime, content, SW, upload, Pages and IndexNow steps passed.
- Observer recorded PASS for five critical source/live SHA-256 comparisons; issue #58 closed completed.
- PR #131 removed the temporary observer and trigger. Next isolated lanes: PR #126, PR #120, clean pastoral-safety PR, then source-integrity/Reader R6.
"""
if "### 2026-07-22 — exact production witness and cleanup" not in matrix:
    matrix = matrix.rstrip() + log + "\n"
MATRIX.write_text(matrix, encoding="utf-8")

REVERIFY.write_text(
    """# CURRENT HEAD REVERIFY — 2026-07-22 — production witness\n\n"
    "## Authority\n\n"
    "- Source `main`: `942a79eb6d9bd7542e47470260dd3bbd69d533d8`.\n"
    "- Exact deployed source SHA: `a0c9c025b05eccfce0ab4818da250d05d1b65da0`.\n"
    "- Pages run: `29910271842` — success.\n"
    "- Issue #58: closed completed after production evidence.\n\n"
    "## Verified release chain\n\n"
    "1. PR #119 (`41f78f43`) made readiness observe all `scripts/**`.\n"
    "2. PR #123 (`a6a78304`) corrected the stale Gill frosted-bar audit.\n"
    "3. PR #125 (`e4cf04ab`) removed competing automatic Pages ownership and pinned deploy checkout to readiness `head_sha`.\n"
    "4. Pages run `29907735891` exposed only a stale SW cache baseline.\n"
    "5. PR #128 (`a0c9c025`) synchronized baseline v191 without changing `sw.js`.\n"
    "6. Pages run `29910271842` passed all 30 workflow stages and deployed exact `a0c9c025`.\n"
    "7. Observer recorded PASS for `js/site-utils.js`, `js/site.js`, `js/floating-cluster-controller.js`, `karty/_engine/map-engine.js`, and `konfessii/russkij-baptizm/_app/index.html`.\n"
    "8. PR #131 (`942a79eb`) removed only the temporary observer and trigger.\n\n"
    "## Current boundary\n\n"
    "Production is no longer pending. Proceed through isolated lanes only:\n\n"
    "1. technical Nagornaya bar asset contract — PR #126;\n"
    "2. highlights dedupe/ARIA — PR #120, then close #112;\n"
    "3. pastoral-safety wording — fresh owner-reviewable PR from verified artifact;\n"
    "4. source-integrity/argument registry P1;\n"
    "5. Reader R6 / issue #59, separate from Nagornaya work.\n\n"
    "Do not merge these lanes into one PR and do not reopen issue #58 without a fresh negative production witness.\n"
    """,
    encoding="utf-8",
)

print("reconciled production witness SSOT")
