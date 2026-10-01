# Agent Audit Report — PROGRAM Wave 4 genealogy re-derivation + Direction 3 / Wave 8 rollups at the unchanged anchor

## Meta

- Project: gb-is-my-strength
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: arena-incompleteness-auditor
- Date: 2026-10-01 (fourth pass of the day, same session date; passes 1–2 are `REPORT.md`)
- Audited branch/ref: `main`
- **Evidence anchor:** Product `main` `d586aa63f02b569cfe050a63cc9078c044375d8d` (re-verified this pass by `gh api repos/FedorMilovanov/gb-is-my-strength/commits/main`; shallow local clone of exactly that SHA, `git rev-parse HEAD` = `d586aa63f02b569cfe050a63cc9078c044375d8d`, git blob SHAs of every genealogy file read are recorded in the receipt); live release `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b` (run `35927303479`, unreachable from this sandbox); AuditRepo session branch `arena/01a0f8c8-auditrepo`
- Environment: Arena sandbox (Linux x86_64, no sudo/apt), Node v22.22.3, Python 3.11, authenticated `gh` 2.23.0; npm/GitHub/PyPI reachable; `raw.githubusercontent.com`, debian mirrors and browser CDNs blocked; live host unreachable (`curl https://gb-is-my-strength.ru` → `000`); `/tmp` does not survive between turns
- Build mode: none this pass — no build, no browser, no dist
- Browser / device if used: **none**. No browser ran in this pass: Product `main` did not move, so no MASTER source anchor needed re-anchoring, and no Product repair exists to verify (the quiz/header repair wave is still waiting on the owner's fix). The 2026-10-01 passes 1–2 receipts remain the fresh-browser evidence for this anchor.
- Scope: PROGRAM Wave 4 (genealogy editorial corpus), Direction 3 (open Product PR rollups at each PR's own head), Wave 8 (branch census), MASTER row `GBS-NAGORNAYA-MENU-ICON-MISSING-FORCED-COLORS` (evidence boundary)
- Explicit exclusions: no Product mutation; no Product PR taken/edited/closed/merged; Lawson release-block lane under owner-directed stand-down (measured only, no disposition proposed); PR #2145 is another agent's lane and was only read through the API. (At the time of writing these lines no new MASTER row was filed; the owner's mid-pass decision then admitted one — see §4b.)
- Signal class: Product (program measurement) + audit-harness (one stale handoff claim corrected)
- Proof state: PASS — every re-derived figure matched the pipeline's own counters and Product's own audit scripts exited 0 with exactly the two expected blockers
- Claim boundary: source/byte access + authenticated API facts + local script execution. **Not** a build, **not** a browser run, **not** live-site evidence, **not** a CI run (local Node 22.22.3 vs CI-pinned 22.23.1)

> The anchor records what this pass actually inspected. Do not update this report merely because the source repository later moved.

---

## 1. Wave 4 — the genealogy counts are confirmed current, not merely carried forward

**Why this pass existed.** The 2026-10-01 handoff listed Wave 4 as "the cheapest un-measured item in the
program" and stated that the 2825 / 139 figures were "carried forward … and never re-measured". That
statement is wrong, and this pass settles the underlying question directly: are the numbers still true at
the current anchor?

**Method (deliberately independent).** Every counter was recomputed from the data files
(`persons.json`, `edges.json`, `publishable/*.json`, `groups.json`, `spine.json`,
`edge-annotations.json`) **without reading the pipeline's own counters**; `meta.json` / `VALIDATION.md`
were used only as a cross-check column. Then Product's own sanctioned scripts were re-run locally, and
every recorded source sha256 pin was recomputed.

**Result — raw layer.** persons 3056 (0 duplicate ids), edges 2053 (parent 1908 / spouse 144 / ancestor 1),
broken edge refs 0, parent-graph cycles 0, isolated persons 982, `ruNamed` 3056 (100 %), RU review queue
**2825** = 3056 − (override 32 + seed 147 + structural 52), tier table override 32 / seed 147 / structural 52
/ pattern 67 / candidate 2143 / translit 615 / none 0, clusters 14, nations 76 (25 with a known progenitor),
messianic spine 76 nodes, edge annotations 42 (all `parent`). Every value MATCHes `meta.json` and
`VALIDATION.md`.

**Result — publishable layer.** 154 persons (0 absent from the raw corpus, 0 with `ru.review != false`, so
the fail-closed policy holds), 181 relations (parent 171 / spouse 9 / legal-parent 1), relation evidence
**42 reviewed / 139 pending**, provenanceClass 139 curated-source-derived / 41 direct-scripture-qualified /
1 editorial-qualified, directScripture 41, textual assertions 116 (114 matched to a publishable relation,
2 without, 55 reviewed crosswalks), diagnostics externalRefs 65 / childIndexConflicts 1 /
asymmetricSpouses 2 / orphanAnnotations 0. Every value MATCHes `publishable/meta.json`.

**Result — integrity.** All five sha256 pins recorded in `publishable/meta.json`
(`data/genealogy/genealogy.json`, `persons.json`, `gospel-sequences.json`, `edge-annotations.json`,
`meta.json`) recompute MATCH, so the committed inputs are pinned exactly as recorded.

**Result — Product's own witnesses (local Node 22.22.3).**

| Script | Exit | What it says at `d586aa63` |
|---|---:|---|
| `genealogy-v2-publication-audit.mjs` | 0 | `draft-blocked`; blockers exactly `DATASET_STATUS_DRAFT` + `RU_REVIEW_QUEUE 2825`; every other evidence array empty (genderMismatches, publicationEvidenceIssues, inputProvenanceIssues, gospelProjectionIssues, prospective soft/unmatched/collisions, heuristicMappings, fuzzyMappings, genericCuratedViews, nationsViewIssues, spine/relation provenance, interpretation wording, Matthew/Luke layout, runtimeRawV2Refs); `runtimeGuard` ok |
| `… --strict-publish` | 1 | same two blockers, fail-closed by design |
| `genealogy-v2-ru-review-report.mjs` | 0 | total 2825; byTier 67 / 507 / 22 / 811 / 803 / 615; policy `autoApproves: false` |
| `genealogy-v2-relation-review-report.mjs` | 0 | total 139; byTier 59 / 59 / 12 / 9; byKind parent 130 / spouse 9 |
| `genealogy-v2-publishable-audit.mjs` | 0 | `publishable-projection-ok`; 154 / 181 / 42 / 139 / 41 / 116 (114/2/55) |
| `genealogy-runtime-data-boundary.mjs` | 0 | ok; 19 runtime files, `rawV2References` 0, only `src/pages/rodosloviye/index.astro` imports publishable v2 |
| `genealogy-publishable-runtime-contract.mjs` | 0 | parity ok; 154 persons, 181 runtime relation evidence, 159 materialized + 12 evidence-only parent relations |

**Consequence for the eight Phase-1 exit criteria** (`scripts/genealogy-build/README.md`): criteria 1–6
and 8 are machine-met at this anchor; only criterion 7 — the deliberate `meta.status` flip *after* editorial
certification — plus the certification itself (2825 names, 139 relation-evidence reviews) remain. That is
exactly what the audit's two blockers encode, so the program row's debt statement is now evidence-backed
rather than carried forward.

**Correction applied in place.** The handoff's "never re-measured" sentence and its "re-derive Wave 4"
next-scope item are marked superseded with dated markers in
`incoming/arena-incompleteness-auditor/2026-10-01/NEXT_SESSION_PROMPT.md` (originals kept readable), and
`PROGRAM_CLOSURE_MATRIX.md` Wave 4 / Wave 8 plus the fourth-pass paragraph now carry the fresh numbers.
`CLOSURE_LEDGER.md` entry `2026-10-01-c` records the same.

## 2. Direction 3 — seven open PRs, each rolled up at its own head

Product `main` did **not** move (`d586aa63…`), but the PR landscape did: **#2154 is new** and **#2153 and
#2150 both moved heads**, so the third-pass rollup was stale in three places.

| PR | Head (this pass) | Draft | Size | Red at head | Notes |
|---|---|---|---|---:|---|
| #2154 | `870beb89` | yes | 7 commits, 5 files, +240/−255 | **7** | new; Lawson editorial/media lane (`content/lawson-editorial-cover-20261001`); body says #2150 owns search/index/sitemap/feed |
| #2153 | `5517a8c5` | no | 6 commits, 9 files, +372/−10 | **2** | head moved off docs-only `c671491f`; now a deploy-gate repair ("native-article carriers"); red = `validate-release`, `public-surface-browser-matrix` |
| #2150 | `acb25c61` | no | 2 commits, 1 file, +34/−6 | **8** | head moved off `89e76794` (was 417 files, 11 red); `Deploy Candidate Contract` failure run `36797681172` |
| #2145 | `994b8735` | no | 1 commit, 1 file, +320/−0 | **4** | another agent's lane — read only, never touched |
| #2144 | `892977fd` | no | 1 commit, +220/−164 | **20** | Dependabot, incl. `npm-audit` |
| #2143 | `acd4ace4` | yes | 3 commits, +163/−42 | **0** | 15 check runs: 14 success / 1 skipped |
| #2142 | `71a4f529` | no | 1 commit, +161/−0 | **0** | only **2 workflow runs / 3 checks** exist at that head → thin coverage, not a broad green |

Release path on `main` (control-plane facts): last successful `Deploy to GitHub Pages` run `35927303479`
at `d0e04a9c`; every main push since `23bd8567` fails, latest `36772631762` at `d586aa63`. Production has
**not** advanced. `Deploy Candidate Contract` succeeded twice on #2153's heads (`36785965603` at `e3d51f23`,
`36789419998` at `5517a8c5`) and failed on #2150's and #2154's current heads.

**Discipline applied.** #2153 now proposes the very release-gate repair that the owner-directed stand-down
covers («Лоусоном уже занимаются»). This pass therefore records its measurement and proposes **no**
disposition for it or for #2150, merges nothing, and edits nothing in Product. One Product-side fact is
flagged for the owner without being touched: PR #2150's body still quotes the **withdrawn** "47/48 steps"
figure for `validate:static-publication`; AuditRepo's corrected figure (41 top-level commands, 40 exit 0,
1 fails at command #24 `node scripts/audit-pro.js`) is the one of record.

## 3. Wave 8 — branch census

Paginated branches endpoint at `d586aa63`: **38 total / 37 non-main** (supersedes the 37/36 dated
snapshot; delta +1 = `content/lawson-editorial-cover-20261001`, head `870beb89`). Seven of them are open
PR heads; four are Lawson-active (`fix/lawson-premium-polish-20260930`,
`publication/lawson-release-hardening-20260930` = #2150's head, `publication/steven-lawson-final-20260930`
and its `-tmp` twin, both at `f7d617d0`, as are `noop`/`noop2`). Counted only: nothing classified,
retired or deleted, and the Lawson branches are not worked.

## 4. MASTER row 114 — explicit harness-limited boundary

`GBS-NAGORNAYA-MENU-ICON-MISSING-FORCED-COLORS` now carries a dated **harness-limited** designation for
its colour-override half: Playwright's `forcedColors:'active'` maps backgrounds instead of repainting them,
so the three `.bar` divs still compute `rgb(255,255,255)` on all eight `/nagornaya/**` pages and no
blanking is observable in this sandbox. That half keeps its 2026-09-29 forced-colors evidence
(`../reverify/2026-09-29-current-nagornaya-forced-colors-menu.md`,
`../reverify/evidence/2026-09-29-forced-colors-all-nagornaya-routes.json`) until the owner supplies a real
Windows High Contrast Mode witness or screenshot. The structural half is freshly confirmed at `d586aa63`.
The row stays OPEN with a stated evidence boundary — not upgraded, not closed, not withdrawn.

## 4b. Owner decisions received during this pass and applied

Four decisions were put to the owner mid-pass and answered:

| Decision | Answer | What this pass did with it |
|---|---|---|
| Mobile header overflow — file as a MASTER row? | **Yes, file it** | Admitted `GBS-HEADER-MOBILE-CONTROLS-CLIPPED-OUTSIDE-VIEWPORT` from the already-witnessed 2026-10-01 browser observation. **MASTER arithmetic 29 → 30 work units (26 → 27 defects)**, enforced by `scripts/check_matrix_coverage.py`. |
| Row 114 colour half | **Accept harness-limited** | The 2026-09-29 forced-colors evidence stands; the row keeps the explicit harness-limited designation printed in §4 above. |
| Quiz repair direction (rows 99/100) | **«Сделай максимально без костылей»** | Source inspection at `d586aa63` identifies the contract's real owner — see below. |
| `spravochnik` byline | **Keep «14 июня»** | Recorded in PROGRAM and in the Baptist byline row; the remaining work is reconciling registry/JSON-LD `datePublished` 2026-06-10 *to* the visible label, not overwriting it. |

**Quiz repair — why "least crutch" points at scoping, not at the runtime.** The two rules that create the dead end
(`css/floating-cluster.css:4063 [data-gill-v16] .quiz-next{display:none}` and `:4072 … .is-visible{display:block}`,
inside `@media (max-width: 63.99em)`) are the **only** rules in the codebase that target `.quiz-next`. The element
that actually maintains the `.is-visible` class is a *different* component's button:
`GillLearningSheet.astro:106` `<button type="button" class="quiz-next" id="glsQuizNext">Следующий вопрос</button>`,
whose own script adds the class at `:494` and removes it at `:403`; `GillSeriesChrome.astro:51` renders that sheet
inside the same `[data-gill-v16]` wrapper. The shared runtime `src/runtime/article-quiz.js` creates its own
`.quiz-next` buttons at `:74` (`again`) and `:152` (`next`) and never adds `.is-visible`. So below 1024px both
components' buttons are hidden by one rule, but only one component is wired to reveal itself. Teaching
`article-quiz.js` to add a class owned by another component, or force-visible overrides, would be the crutch;
deleting the rule outright would break the learning sheet's own hide-until-answered state. The recorded repair
direction is therefore to **scope the two legacy rules to their owner** (e.g. `[data-gill-v16] #glsQuizNext`),
leaving the shared quiz button to its own runtime — with the 8 non-gill quiz routes as the working control.

**New MASTER row filed (owner-instructed).** `GBS-HEADER-MOBILE-CONTROLS-CLIPPED-OUTSIDE-VIEWPORT`, admitted from
the fresh browser witness at `d586aa63` (receipt §P4-4, §P4-4b, §P6-5, §C): under `isMobile` 390×844 the shared
header cluster overflows the viewport on `/izbrannoe/` and `/hard-texts/genesis-6/` (theme-toggle centres x 392.8
and 396 of a 390px viewport, clipped by `.mobile-controls{overflow:hidden}`; on `/izbrannoe/` the search control's
centre is clipped past the container edge at `right=358`), and at 768px both controls sit beyond the viewport on
`/` and `/izbrannoe/` while `/hard-texts/genesis-6/` fits. Plain desktop windows at the same CSS widths fit, which
scopes the defect to the mobile header variant. The 12px overlap stays in its own row
`GBS-HEADER-SEARCH-THEME-TARGET-OVERLAP`.

## 5. What this pass deliberately did **not** do

- **No browser run.** Product `main` did not move, so no source anchor needed re-anchoring, and no
  width sweep was required for row 99 (that sweep belongs to a repair-verification wave, and there is no
  repair yet). The 2026-10-01 passes 1–2 receipts remain this anchor's fresh-browser evidence.
- **No editorial certification.** Nothing here approves a single RU name or relation; the 2825 / 139 debt
  is measured, not reduced.
- **No live claim.** The live host is unreachable (`curl` → `000`), so `/rodoslaviye/` and the live byline
  surfaces were not re-read; all Wave 4 statements are source-level at the exact SHA.
- ~~**No new MASTER row, no arithmetic change** (29 active work units: 26 defects + 2 system lanes + 1 owner
  decision)~~ **Superseded later in the same pass:** after the owner's decisions, one MASTER row **was** admitted
  (`GBS-HEADER-MOBILE-CONTROLS-CLIPPED-OUTSIDE-VIEWPORT`) from the already-witnessed observation, so arithmetic
  became **30 active work units (27 defects + 2 system lanes + 1 owner decision)**. Still no Product mutation, no
  Product PR action, no Lawson disposition, no #2145 contact.
- **No claim that #2153's deploy-gate repair works.** Its body's local results are recorded as claims at
  the named run IDs; the two red checks at its head are API facts.

## 6. Owner decisions still outstanding (unchanged by this pass)

1. Quiz repair (rows 99/100): retire the legacy hidden-state rule or teach the runtime the `.is-visible`
   contract — then a repair-verification wave at both sides of 1024px.
2. Header cluster (rows 115/116/103/111): one repair lane; and whether the mobile header overflow
   observation becomes a row (needs an owner signal or a second independent witness).
3. Row 114 colour half: a real Windows HCM witness/screenshot, or acceptance of the 2026-09-29 evidence
   with the harness-limited designation now printed in MASTER.
4. Baptist direction: the nine `????` bodies need owner-approved originals (never guessed text); the
   `spravochnik` byline choice («14 июня» authored in `b051fd76` vs `publishedAt` 2026-06-10) is still
   unanswered; five date pairs remain at main.
5. Lawson / release-block: stand-down remains in force; #2150 and #2153 are measured, not dispositioned.

## 7. Files

- `../../../reverify/evidence/2026-10-01-genealogy-wave4-remeasure.txt` — Wave 4 derivation, integrity
  pins, Product script witnesses, Phase-1 exit-criteria status.
- `../../../reverify/evidence/2026-10-01-pr-rollups-and-branch-census.txt` — Direction 3 rollups at each
  PR's own head, release-path runs, Wave 8 census.
- `../../../PROGRAM_CLOSURE_MATRIX.md` — Wave 4 / Wave 8 rows and the 2026-10-01 fourth-pass paragraph.
- `../../../verified/MASTER_BUG_MATRIX.md` — row 114 harness-limited designation; owner-decision row
  refreshed with the seven current heads; a dated `Current state` banner; no arithmetic change.
- `../../../verified/CLOSURE_LEDGER.md` — entry `2026-10-01-c`.
- `NEXT_SESSION_PROMPT.md` — the two stale claims corrected in place with dated markers.

## Status boundary

An intake report may use `raw`, `candidate`, `reproduced-by-agent` and explicit evidence labels. Durable
classifications belong to a verifier synthesis or an accepted ledger decision. This pass changed no
disposition: it confirmed two program measurements, refreshed a PR/branch census, and printed one evidence
boundary — all logged in `CLOSURE_LEDGER.md` entry `2026-10-01-c`.
