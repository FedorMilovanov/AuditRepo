# Next-session prompt — gb-is-my-strength audit (written 2026-10-01, fourth pass)

Read [`AUDITREPO_OPERATING_MODEL.md`](../../../../../AUDITREPO_OPERATING_MODEL.md),
[`../../../DOC_MAP.md`](../../../DOC_MAP.md) and
[`../../../verified/MASTER_BUG_MATRIX.md`](../../../verified/MASTER_BUG_MATRIX.md) first. This file is
a handoff, not an authority: MASTER wins on every disposition, and
[`../../../verified/CLOSURE_LEDGER.md`](../../../verified/CLOSURE_LEDGER.md) wins on what was already
adjudicated (entries `2026-09-30-c`, `2026-10-01-a`, `2026-10-01-b` are the current ones).

## State at handoff (all measured, receipts in-repo)

- AuditRepo: the evidence PR of this cycle (#479, branch `arena/01a0f435-auditrepo`, base
  `054c9c1b1a74f20ead716b835a2f618270dfb78b`) was **merged** with green `validate` + `preflight` at head
  `9c6aa14`. **2026-10-01 fourth pass: a second evidence PR, #480 (branch `arena/01a0f8c8-auditrepo`), was also
  merged** (merge commit `e4e8b3f0b99248f1660df697a58411891d3fd7ca`, heads `7f11e1d` + `7d4a0f5`, green
  `validate` + `preflight`). AuditRepo `main` is now at that merge commit. Start from AuditRepo `main` HEAD on a
  fresh session branch — never reuse an old one, and never reuse `arena/01a0f8c8-auditrepo` for new work.
- Product `main` = `d586aa63f02b569cfe050a63cc9078c044375d8d`, unchanged for the whole cycle; live
  release/control-plane SHA = `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b` (run `35927303479`).
  Production still has **not** advanced: main pushes fail `Deploy to GitHub Pages` at
  `Static publication source gates`.
- Release-gate truth: `validate:static-publication` = **41** top-level commands, **40 exit 0**, blocker
  is **#24** `node scripts/audit-pro.js` (Lawson route missing from the sitemap contract). Receipt:
  `../../../reverify/evidence/2026-09-30-validate-static-publication-command-list.txt`. **Never repeat
  the withdrawn earlier step figure** — it is not quoted anywhere in-repo and must not be reintroduced.
- MASTER arithmetic: 27 defects + 0 improvements + 0 narrowed + 2 system lanes + 1 owner decision =
  **30 active work units** (enforced by `scripts/check_matrix_coverage.py`). **Changed 2026-10-01 by the
  owner's instruction:** the mobile header overflow observation was admitted as the new row
  `GBS-HEADER-MOBILE-CONTROLS-CLIPPED-OUTSIDE-VIEWPORT` (26 → 27 defects, 29 → 30 total).
- Browser tier now exists in-sandbox and was run twice at the anchor:
  `../../../reverify/evidence/2026-10-01-fresh-browser-pass-at-anchor.txt` (pass 1, 11 sections) and
  `../../../reverify/evidence/2026-10-01-fresh-browser-pass-2-quiz-header.txt` (pass 2, 15 sections).
  Both are exact-SHA **local-build** browser evidence, never live-site evidence.
- Two of my own 2026-09-30 claims were corrected in place with marked blocks (originals preserved):
  `GBS-QUIZ-NEXT-HIDDEN-GILL-V16` is **width-gated** — `[data-gill-v16] .quiz-next{display:none}` sits
  inside `@media (max-width: 63.99em)` (`css/floating-cluster.css:3774` → rule `:4063`) and the reveal
  rule `:4072 [data-gill-v16] .quiz-next.is-visible{display:block}` **does exist**; the runtime just never
  adds the class. Dead end below 1024px, full flow at ≥1024px. And `GBS-QUIZ-LITERAL-MARKUP` covers
  **10 of 23** quiz routes (not 9), per-route tag counts 74/58/16/12/10/8/6/6/2/2.
- Direction 3: **seven** open Product PRs, each adjudicated at **its own head** (re-measured 2026-10-01,
  receipt `../../../reverify/evidence/2026-10-01-pr-rollups-and-branch-census.txt`) — #2154 new (draft,
  Lawson editorial/media, 7 red), #2153 head moved `c671491f` → `5517a8c5` and now carries a deploy-gate
  repair (2 red), #2150 head moved `89e76794` → `acb25c61` (1 file +34/−6, 8 red, Deploy Candidate
  Contract failure run `36797681172`), #2145 apostasy (4 red, **another agent's lane**), #2144 Dependabot
  (20 red), #2143 genealogy draft (0 red), #2142 Baptist salvage (0 red on only 3 checks — thin coverage).
  Branch census **38 total / 37 non-main** at `d586aa63`.
- Direction 4: `../../../PROGRAM_CLOSURE_MATRIX.md` refreshed (step count, Wave 5B, Wave 8, browser-tier
  paragraph, program-currency re-measure: article corpus **64** MDX at main vs **63** at the live SHA,
  the +1 being the blocked Lawson route). ~~**Wave 4 genealogy counts (2825 / 139) are still carried
  forward and have never been re-measured** — the cheapest un-measured item in the program.~~
  **CORRECTED IN PLACE 2026-10-01 (fourth pass, same agent):** that sentence was **wrong** — the counts
  *had* already been re-derived at this same anchor on 2026-09-30
  (`../../../reverify/evidence/2026-09-30-program-currency-remeasure.txt`, Wave 4 section) and were
  re-derived again, independently, on 2026-10-01
  (`../../../reverify/evidence/2026-10-01-genealogy-wave4-remeasure.txt`): 3056 persons / 2053 edges
  (parent 1908, spouse 144, ancestor 1) / 982 isolated / RU review queue **2825** (override 32, seed 147,
  structural 52, pattern 67, candidate 2143, translit 615) / clusters 14 / nations 76 / publishable 154
  persons, 181 relations, relation evidence **42 reviewed / 139 pending**, direct-scripture 41, textual
  assertions 116 (114 matched) — every figure MATCHes the pipeline's own counters, all five recorded source
  sha256 pins recompute MATCH, and Product's `genealogy-v2-publication-audit.mjs` exits 0 with exactly two
  blockers (`DATASET_STATUS_DRAFT`, `RU_REVIEW_QUEUE 2825`). So Wave 4's *measurement* is closed; what
  remains is the editorial certification behind criterion 7 of the eight Phase-1 exit criteria. Do not
  repeat the "never re-measured" claim.

## Standing owner instructions (do not re-litigate)

1. **Lawson release-block decision: stand down.** «Лоусоном уже занимаются» — measure and preserve
   receipts if asked, file no Lawson row, propose no Lawson disposition, do not merge #2150 as a
   release fix.
2. **Never restore lost Russian `????` text by guessing.** Only owner-approved originals; none exist
   in-repo for the nine damaged Baptist bodies (506 / 471 / 314 / 239 / 183 / 135 / 124 / 105 / 91
   occurrences per route, identical at both SHAs).
3. **PR #2145 belongs to another agent** — do not take, edit, close or merge it.
4. **A green AuditRepo PR is never a reason to merge a Product PR.**
5. Research plans, old branches and optional improvements are **not** defects;
   `PROGRAM_CLOSURE_MATRIX.md` is a program, not a bug list.
6. **Playwright IS installable in this sandbox** (owner said so twice). Do not open a pass with
   "browser impossible": build the browser tier (recipe below, ~85 min cold) and measure.
7. **Clean up your own stale claims and junk; push nothing extra** («закрывай вопрос и чисти мусор,
   лишнее не пуш»). Superseded text is corrected **in place with a marker**, never silently deleted.

## Do not re-file (already adjudicated)

- **"Human label ≠ `<time datetime>`" is approved design** (owner-approved exact-instant reconciliation
  of 2026-09-08, approved-only projection, shape pinned by
  `scripts/editorial-metadata-v3-approval-gate-test.js:102`); the same **17** routes re-derived at the
  anchor. Genuine residuals are *slot* mismatches only:
  `GBS-NAGORNAYA-PUBLISHED-DATELINE-CARRIES-MODIFIED-INSTANT` and the narrowed Baptist byline row.
- Lawson numeric byline; the six-card heart shelf and the 4/22/2 counters (intentional); the asserted
  missing Genesis 6 manifest entry (refuted); `targetArchitecture` "planned" statuses (deliberate gate
  contract, row retired as invalid).
- **Mobile header overflow / 768px tablet overflow** — measured 2026-10-01, recorded as a bounded
  observation in the pass-2 receipt §P4-4/§C and in `REPORT.md` §1 of this folder, deliberately **not**
  filed: under `isMobile` 390×844 **[FILED 2026-10-01 on the owner's instruction as MASTER row
  `GBS-HEADER-MOBILE-CONTROLS-CLIPPED-OUTSIDE-VIEWPORT`; do not re-file it a second time]** `/izbrannoe/` and `/hard-texts/genesis-6/` push `#themeToggle` to
  centre x 393/396 where `.mobile-controls{overflow:hidden}` clips it, and at 768px on `/` both controls
  sit past the viewport — while narrow desktop windows at the same CSS width fit. It becomes a row only
  on an owner signal or a second, independent witness angle. **Resolved 2026-10-01: the owner gave that signal
  and the observation is now the MASTER row above.**
- **Do not re-file the quiz dead end as "`article-quiz.js` must add `.is-visible`"** — that reading is now
  known to be wrong: the hide/reveal pair at `css/floating-cluster.css:4063/:4072` is the only `.quiz-next`
  rule in the codebase and belongs to the Gill learning sheet's `#glsQuizNext`; the shared runtime's own
  `.quiz-next` buttons (`article-quiz.js:74`, `:152`) inherit it by class collision. The owner-approved
  direction is to scope the legacy rules to their owner.
- Rows already retired/false-positive in `verified/CLOSURE_LEDGER.md` and `MATRIX_ID_ALIASES.json` —
  check the registry before proposing anything.

## Method boundaries proven in this sandbox (save the next pass the retries)

- **`/tmp` is wiped between turns.** Write receipts, corrections and commits **inside the same turn**
  that produced them; never reference a `/tmp` file as evidence in a later turn. Two pass receipts were
  lost this way and had to be re-measured.
- **Browser recipe (public sources only, ~85 min cold):** npm `@sparticuz/chromium@153.0.0` (the tarball
  ships the headless binary) + `playwright-core@1.63.0`; build NSPR from `mozilla/nspr`
  (`--prefix=/tmp/nssroot --enable-64bit`) and NSS from `nss-dev/nss`
  (`./build.sh --disable-tests --with-nspr=/tmp/nssroot/include/nspr:/tmp/nssroot/lib`, ninja/gyp from
  PyPI); collect `libnspr4`/`libnss3`/`libnssutil3` into `/tmp/browserlibs`; always launch with
  `LD_LIBRARY_PATH=/tmp/browserlibs` and `--no-sandbox --disable-dev-shm-usage --disable-gpu
  --force-color-profile=srgb`. `npx playwright install chromium` fails (`ECONNRESET`), no system Chrome,
  no sudo, every apt mirror and browser CDN blocked.
- **Egress map:** `registry.npmjs.org`, `github.com`, `codeload.github.com`, `pypi.org`,
  `files.pythonhosted.org` reachable; `raw.githubusercontent.com`, `objects.githubusercontent.com`,
  debian mirrors, conda, googleapis, azureedge, npmmirror, unpkg, jsdelivr blocked; **the live host
  `gb-is-my-strength.ru` returns `000`** → no live-render or live-visual claim is possible here.
- **Playwright gotchas that cost time this cycle:** Node helper functions must be injected with
  `addInitScript`, never defined inside `page.evaluate`; `forcedColors:'active'` is **not** Windows HCM
  (background-painted bars stayed `rgb(255,255,255)`); `page.screenshot({clip})` needs
  `{x,y,width,height}`; in Chromium `CSSStyleRule.cssRules` is a truthy empty list (CSS nesting), so
  test `rule.style && rule.selectorText` before recursing; a first-option click-through is a **lower
  bound** for painted content; **always sweep ≥2 widths straddling every media breakpoint** (one
  single-viewport sweep produced a false "FALSIFIED" for a `63.99em`-gated row); walk payload objects
  **deeply** (key-filtered parsing missed `bonusQuestions` and undercounted 14 → 74 tags).
- `fetch_page` drops `<time>` element text and surfaces hidden `data-pagefind-meta` spans → live byline
  *labels* cannot be witnessed that way; witness labels from an exact-SHA build, ordinary live text
  directly (receipt `../../../reverify/evidence/2026-09-30-live-fetch-time-element-boundary.txt`).
- `gh pr edit` fails on the Projects-classic GraphQL deprecation → use
  `gh api -X PATCH repos/FedorMilovanov/AuditRepo/pulls/<n> -f body=@file`. `gh run view --log-failed`
  and artifact downloads fail (blob egress denied). Local Node v22.22.3 vs CI-pinned 22.23.1: builds and
  command runs are local receipts, not CI runs.
- `scripts/crosswire_module_custody.py` needs explicit args and
  `scripts/repository_history_forensic_audit.mjs` needs GitHub pagination egress — neither is part of the
  pre-filing check set; their regression tests are.

## Highest-value next scopes (owner has not chosen one yet)

1. **Quiz repair verification wave (rows 99/100).** Owner direction is now recorded: «максимально без
   костылей» = scope the legacy hide/reveal rules at `css/floating-cluster.css:4063/:4072` to their real
   owner (`#glsQuizNext` in `GillLearningSheet.astro:106`, class maintained at `:403`/`:494`) instead of
   teaching `src/runtime/article-quiz.js` a foreign `.is-visible` class or deleting the rule. When the
   owner lands a fix, prove it at **both** sides of the breakpoint: advance past question 1 to results on all 15 `[data-gill-v16]` quiz routes at
   ≤1023px **and** ≥1024px, keep the 8 non-gill routes working, keep keyboard use and light/dark
   behaviour passing, and show zero literal `<em>`/`<span>` in the payload (10 routes) and in the painted
   panel (witnessed on `/nagornaya/chast-2/`, `/articles/dzhon-gill-chast-2-uchenyi/`,
   `/articles/kod-da-vinchi/`).
2. **Header cluster (rows 115/116/103/111)** — one repair lane (`css/mobile-hotfix.css` +
   `Header.astro` + the on-demand `js/search.js` binding). Acceptance: both 44×44 controls inside the
   viewport and hit-testable at 360/390/414/768, click **and** `Ctrl+K` open the palette once per
   activation on `/izbrannoe/` and `/hard-texts/genesis-6/`, and a visible `:focus-visible` ring without
   the unwanted hover pill.
3. **Row 114's colour half cannot be closed here.** Ask the owner for a real Windows High Contrast Mode
   witness (or accept the 2026-09-29 forced-colors run as the standing evidence and mark the row
   harness-limited). Structural half is freshly confirmed.
4. **Baptist direction (owner-gated):** five remaining date pairs at main; the nine `????` bodies need
   owner-approved originals; the `spravochnik` byline choice («14 июня» authored in `b051fd76` vs
   `publishedAt` 2026-06-10) is still unanswered. Never guess text.
5. ~~**PROGRAM_CLOSURE_MATRIX Wave 4** — re-derive the genealogy counts (2825 / 139 carried forward since
   2026-09-24) from `data/genealogy/v2/**`~~ **DONE 2026-10-01** — see the correction above; the counts are
   re-derived and confirmed current at `d586aa63`, so this item is closed as *measurement*. The remaining
   Wave 4 work is editorial certification (2825 names / 139 relation-evidence reviews) plus the deliberate
   `meta.status` flip, which no audit pass can do for the owner. Then Wave 5B (10 content files vs live
   4 главы / 9 статей), Wave 6 showcase, Wave 8 branch census (now **38 / 37** at the 2026-10-01 snapshot)
   if Product moves.
6. **Direction 3 hygiene:** if Product `main` advances, re-anchor MASTER's source anchors **and** re-run
   the width sweep for row 99 (a single viewport is not a verdict); recompute each open PR's rollup at
   its own head; keep #2145 untouched.

## Filing discipline for the next pass

- Every new intake needs an explicit **`Evidence anchor`** (Git SHA, artifact identity or a concrete live
  snapshot URL) in both `README.md` and `REPORT.md`; `scripts/validate_audit_repo.py` fails without it.
- Before filing anything run, at the current head: `scripts/validate_audit_repo.py`,
  `scripts/check_auditrepo_structure.py`, `scripts/check_matrix_coverage.py`,
  `scripts/check_workflow_syntax.py` and the six regression suites — all must PASS. No PR is called
  "ready" before green CI on its **last** head.
- No new MASTER row without a reproduced witness at the current anchor; bounded observations that are
  not defects go into the receipt/intake (as this cycle's header overflow did), not into MASTER, and
  never change the arithmetic.
- Keep the four evidence tiers separate in every sentence: source / local build / browser / live. Old
  browser evidence ≠ a fresh run; say which one you have.
- Correct your own stale claims **in place with a dated marker** and log the correction in
  `CLOSURE_LEDGER.md`; keep the superseded text readable.
- Push only what the audit needs: no scratch scripts, no screenshots, no duplicate receipts (this
  cycle's intake folder keeps `evidence/` and `artifacts/` empty on purpose — the receipts live in
  `reverify/evidence/`).
