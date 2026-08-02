# Agent Audit Report — data-synchronization / matrix assessment

## Meta
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength (product); **audited object here = AuditRepo canonical docs**
- Agent: arena-sync-assessment
- Date: 2026-08-01
- Audited branch (AuditRepo): arena/019fbded-auditrepo
- Audited SHA (AuditRepo): `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Current HEAD at start (recorded canon): source `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3`;
  last exact production `abf1edba190280e554dfda085bef9fb6594c896d` (per `NEXT_AGENT_PROMPT.md`).
  **Live check (SD-5): actual source main HEAD = `2273b8c9` (PR #730), 14 commits ahead of the
  recorded canon.**
- Environment: Arena sandbox
- Build mode: source (AuditRepo documents; no product build / browser run)
- Browser / device if used: none

> Purpose: **оценка синхронизации данных, багов и матриц** — проверка, что канон
> (`MASTER_BUG_MATRIX.md`, `NEXT_AGENT_PROMPT.md`, `DOC_MAP.md`, `PROJECT_REGISTRY.md`, reverify)
> согласован между собой и внутренне непротиворечив (Single-Writer-Per-Fact, DOC_MAP §1).
> Это governance/data-sync лейн, **не** продукт-баг лейн.

---

## 1. New Findings

### Finding SD-1 — combined slash-ID row `NEW-68/69` in the closed table (RESOLVED: not a counter bug)
- **Category:** AUDITREPO / data-sync (row-shape / ID-naming, not a product bug)
- **Title:** closed table physically holds 166 rows, but the canonical closed counter 165 is
  **correct**; the extra row `NEW-68/69` is invisible to canonical ID counting because of the `/`.
- **Severity:** P3 (cosmetic/ID-shape; **corrected down from the initial P2 "counter drift" framing**)
- **File(s):** `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` closed row `NEW-68/69` (line 130).
- **Evidence:** `evidence/sd1_resolved_canonical.txt` + `evidence/matrix_row_counts.txt`.
- **Analysis:** the project SSOT tool `scripts/check_matrix_coverage.py` reports
  `356 canonical ids, 191 open rows` => 165 closed canonical, which **matches** the claimed counter.
  `UPPER_ID_RE` = `^[A-Z0-9]+(?:-[A-Z0-9]+)+$` rejects the slash, so `NEW-68/69` is not counted.
  `NEW-68` (dist CSP missing `form-action 'self'`) and `NEW-69` (Astro karty routes missing CSP meta)
  are two distinct bugs, both fixed at `14574a9a`, combined into one slash-ID row.
- **Expected:** every fixed bug is a counted canonical closed ID.
- **Actual:** `NEW-68` and `NEW-69` are present only as the combined non-counted row.
- **Confidence:** high (canonical tool output + reverify, reproducible).
- **Verification level:** L1.
- **Suggested repair lane:** verifier picks split (Option A) or rename (Option B) per
  `proposals/proposal-SD-1-closed-counter.md`; counter/total must be reconciled intentionally.
- **Do not mix with:** any other closed-row change.

### Finding SD-2 — AR-006 marked CLOSED but counted inside the open total
- **Category:** AUDITREPO / data-sync
- **Title:** `AR-006` is labelled `✅ CLOSED 2026-07-14` but is listed in the `## 🟣 AUDITREPO (4)`
  open section and is therefore included in the canonical **191 open** total.
- **Severity:** P3 (counter semantics; does not affect product)
- **File(s):** `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` line 427 (row AR-006), line 845 (session log confirms "AR-006 закрыт").
- **Evidence:** `evidence/ar006_closed_but_open_section.txt`.
- **Expected:** a CLOSED bug is not counted in the open total (or is moved to the closed table).
- **Actual:** open total 191 = 96+36+51+4+4 includes AR-006 (closed). If AR-006 is treated closed,
  open would be 190 and AUDITREPO-open 3.
- **Confidence:** high (direct read).
- **Verification level:** L1.
- **Suggested repair lane:** same `AUDITREPO` reconciliation pass as SD-1 (decide disposition: keep in
  open section for traceability but exclude from counter, or move row to closed).
- **Do not mix with:** product fixes.

### Finding SD-9 — data-layer validation on actual HEAD 2273b8c9 (route.json / page-ownership / regions)
- **Category:** AUDITREPO / data-sync (reverify triage on live data, not a product claim)
- **Title:** live data checks on `2273b8c9` classify several Karty data rows as stale-fixed, still-open, or partial.
- **Severity:** P2 (informs the reverify lane)
- **File(s):** `migration/page-ownership.json`, `karty/*/route.json`, `karty/_engine/map-engine.js` @ `2273b8c9`.
- **Evidence:** `evidence/sd9_data_validation.txt`.
- **Verdicts:**
  - **QUAL-P2-03 → STALE/FIXED candidate:** `/karty/*` routes now present in `page-ownership.json` (83 routes incl. all 10 karty).
  - **QUAL-P1-07 → STILL OPEN:** underscore story ids persist (`exile_return`, `first_love`, `jerusalem_church`, `peter_john`, `stephen_philip`, `paul_early`).
  - **QUAL-P2-02 → STILL OPEN:** `nachalo/route.json` still lacks `stories` / `meta.id` / `meta.era` / `meta.stats`.
  - **DATA-P2-01 → PARTIAL:** `avraam` now has `stages[].paths` (8/8), `ishod` has none (0/6).
  - **REG-P1-01 → STILL OPEN:** `shvatim/route.json` has 13 regions, but `map-engine.js` ignores `route.regions`.
- **Confidence:** high (live data inspection).
- **Verification level:** L1.
- **Suggested repair lane:** fold into batched Karty reverify (SD-7); close QUAL-P2-03 with evidence, keep others open.

---

### Finding SD-8 — source-verified "still open" Karty cluster on actual HEAD 2273b8c9
- **Category:** AUDITREPO / data-sync (reverify triage, not a product claim)
- **Title:** direct source inspection of `map-engine.js` + `base-geo.svg` on `2273b8c9` confirms several
  Karty P1 rows are STILL OPEN (not fixed by PR #709 / the 14-commit delta).
- **Severity:** P2 (informs the reverify lane; confirms no broad Karty fix landed)
- **File(s):** `karty/_engine/map-engine.js`, `karty/_engine/base-geo.svg` @ `2273b8c9`.
- **Evidence:** `evidence/sd8_verified_still_open.txt`.
- **Confirmed STILL OPEN (keep open):** BASE-P1-01 (6 missing IDs in base-geo.svg), BASE-P1-02
  (opacity 0.5 on me-base-geo persists, line 2884), RIVER-P1-02 (waterRipple def absent, 4 uses),
  RIVER-P1-03 (39 `stroke-linecap="round"`), QUAL-P1-05 (no `{passive:true}` on 5 listeners),
  RIVER-P1-01 (root = RIVER-P1-02).
- **Likely FIXED (browser reverify then close):** QUAL-P1-04 (single gallery delegation via `data.src`).
- **Partial (reverify):** QUAL-P1-06 (timers 58→21 in current file).
- **Confidence:** high (direct source).
- **Verification level:** L1 (source); browser needed for QUAL-P1-04 close.
- **Suggested repair lane:** fold into batched Karty reverify (SD-7); do not close the still-open rows.

---

### Finding SD-7 — large open Karty cluster witnessed on a far-behind SHA (evidence freshness)
- **Category:** AUDITREPO / data-sync (evidence-freshness, not a product claim)
- **Title:** 65 open matrix rows carry witness SHA `32ae0d7d`, which is **607 commits** behind the
  actual source main `2273b8c9` (live `gh api compare` => ahead_by=607).
- **Severity:** P2 (matrix freshness; drives a large batched reverify; no counter change by itself)
- **File(s):** `MASTER_BUG_MATRIX.md` open Karty-cluster rows (families: QUAL 13, ENGINE 7, RIVER 5,
  BASE 4, GATE 3, ASTRO 3, DRAW 3, MAP 2, DATA 2, A11Y 2, + ~30 single).
- **Evidence:** `evidence/sd7_stale_karty_witnesses.txt` (+ `evidence/sd7_supplementary_stale_witnesses.txt`).
- **Analysis:** per SHA-first, none of these 65 rows is repair-ready on current HEAD without a fresh
  reverify. SD-6 already source-verified the map-engine subset on `2273b8c9`
  (ENGINE-P1-21/22/23/28 fixed; MAP-P1-11, ENGINE-P1-26 open); the remaining ~57 need per-row reverify.
  **Supplementary (SD-7b):** 7 more open rows on other stale SHAs (`2ca2af3` x3, `21624a3` x3,
  `30bf3f5c` x1), 658-1105 commits behind current main → combined stale-witness open surface ≈ **72 rows**.
  Additionally **D-19** (Antisovetov PageHead half) is NOT addressed by Wave 8 (`41617252e` changes
  `AntisovetovBody.astro`, not any PageHead/Seo/meta/title file) → remains open; needs reverify on
  `2273b8c9`. Evidence: `evidence/sd7b_d19_antisovetov_open.txt`.
- **Confidence:** high (tool + live API).
- **Verification level:** L1.
- **Suggested repair lane:** one batched Karty reverify lane on `2273b8c9` (after SD-5), reusing SD-6
  dispositions. Do not auto-close. See `proposals/proposal-SD-7-karty-reverify-lane.md`.

---

### Finding SD-6 — map-engine runtime fixes landed on actual HEAD; multiple open rows are candidate fixed-current
- **Category:** AUDITREPO / data-sync (matrix freshness vs new source HEAD; not a product claim, not a closure)
- **Title:** source PR #709 ("map-engine runtime P1 normalization", merge `8bd891b13`, now in actual
  HEAD `2273b8c9`) fixes defects that correspond to several open Karty/map matrix rows, which were
  witnessed on old SHAs (`c2c339708252` / `32ae0d7d`).
- **Severity:** P2 (matrix freshness; drives reverify work, does not by itself change counters)
- **File(s):** `karty/_engine/map-engine.js` (in PR #709); matrix rows ASTRO-P1-02, ENGINE-P1-21/22/23/26/28, MAP-P1-11/14/15.
- **Evidence:** `evidence/sd6_mapengine_fixes_candidates.txt` (diff + PR-text correspondence map),
  upgraded by `evidence/sd6_verified_on_2273b8c9.txt` (direct source inspection of `map-engine.js` @ `2273b8c9`).
- **Source-verified on 2273b8c9 (revert-close candidates):** ASTRO-P1-02, ENGINE-P1-21/22/23/28, MAP-P1-14/15.
- **Still OPEN on 2273b8c9 (do NOT close):** MAP-P1-11 (scale bar still `cfg.W0 / view.w`),
  ENGINE-P1-26 (no search-outside-story click handler in engine).
- **Correspondence (direct):** ASTRO-P1-02 (getStageColor normalize), ENGINE-P1-22 (distanceKm/kmPerUnit),
  ENGINE-P1-23 (removed circle:nth-child(3)), MAP-P1-15 (single me-ruler-btn), MAP-P1-14 (me-base-css lease).
  **Candidate (PR text):** ENGINE-P1-21 (letterboxing), MAP-P1-11 (scale bar), ENGINE-P1-28 (photo owner), ENGINE-P1-26 (marker identity).
- **Expected:** open rows reflect the current source state.
- **Actual:** these rows are open but their fix has likely landed on actual HEAD `2273b8c9` (which the
  canon has not yet recorded — see SD-5).
- **Confidence:** medium-high (source diff + PR text; needs reverify, not auto-close).
- **Verification level:** L1 (source-level witness, no live browser run in this lane).
- **Suggested repair lane:** after SD-5 authority sync, run one reverify pass of this cluster on
  `2273b8c9` (verified-source/browser); close only non-reproducing rows, per SHA-first rule. Do not
  close on PR description alone. See `proposals/proposal-SD-6-mapengine-reverify.md`.

---

### Finding SD-5 — AuditRepo canonical source HEAD is stale vs actual source repo (authority drift)
- **Category:** AUDITREPO / data-sync (authority-only HEAD drift, not a product bug)
- **Title:** AuditRepo canon records source main = `efaf2a51` (PR #669/#691 era), but the actual
  source repo `FedorMilovanov/gb-is-my-strength` main HEAD is `2273b8c9` (PR #730), **14 commits ahead**.
- **Severity:** P1 for authority freshness (any current-HEAD reverify / repair-order built on the
  stale recorded HEAD is untrustworthy); P3 as a bug-class (data-sync).
- **File(s):** `NEXT_AGENT_PROMPT.md`, `verified/MASTER_BUG_MATRIX.md` masthead (both say `efaf2a51`);
  actual source = `2273b8c9`.
- **Evidence:** `evidence/sd5_source_head_drift.txt` (live `gh api .../compare/efaf2a51...2273b8c9`
  => `status=ahead, ahead_by=14`, full 14-commit delta, source PR up to #730).
- **Expected:** recorded source HEAD == actual source main HEAD.
- **Actual:** recorded `efaf2a51` vs actual `2273b8c9` (delta: Wave 8/10/11 Antisovetov/diotrophes
  content, map-engine ownership #709, a11y/WebKit scene closure #728, resume-toast fix #730, etc.).
- **Confidence:** high (live API evidence).
- **Verification level:** L1.
- **Suggested repair lane:** verifier-owned authority-only synchronization pass (per project rule)
  to advance the recorded source HEAD to `2273b8c9` with a paired reverify, BEFORE any product
  reverify/repair uses a "current HEAD" claim. This is the same lane that last synced `efaf2a51`.
- **Do not mix with:** SD-1/SD-2/SD-3 (matrix/registry); SD-4 must be re-targeted to `2273b8c9`.

---

### Finding SD-4 — open bug with archive-only evidence (`AUDIT-P3-OG-LCP-MISMATCH`)
- **Category:** AUDITREPO / data-sync (evidence-freshness risk, not a product-bug claim)
- **Title:** the only open bug with archive-only evidence is `AUDIT-P3-OG-LCP-MISMATCH`
  (4 routes: `og:image` ≠ LCP image), whose evidence dates to 2026-07-05 archive and a 2026-07-09
  reverify note "needs-live-recheck". No fresh witness on/after 2026-07-09.
- **Severity:** P3 (evidence-freshness; no product claim)
- **File(s):** matrix line 370; evidence
  `archive/2026-07-05-incoming-consolidated/arena-agent-audit-1-1/2026-07-05/REPORT.md`;
  reverify `..._2026-07-09_head-2313f36f-149-commit-delta.md:34`.
- **Evidence:** `evidence/sd4_archive_only_open_bugs.txt` (from `check_matrix_coverage.py` `archivedOnlyIds`).
- **Recommended action:** verifier schedules a fresh reverify of `AUDIT-P3-OG-LCP-MISMATCH` on the
  ACTUAL current source HEAD **`2273b8c9`** (not the stale recorded `efaf2a51`, see SD-5) before any
  closure/repair; do not close or repair from archived 2026-07-05 evidence alone.
  See `proposals/proposal-SD-4-archive-only-evidence.md`.
- **Confidence:** high (tool output + reverify note).
- **Verification level:** L1.

---

### Finding SD-3 — unregistered `RIGHT-*` evidence IDs flagged by matrix coverage checker
- **Category:** AUDITREPO / data-sync (evidence-registry hygiene, not a product bug)
- **Title:** `check_matrix_coverage.py` fails-closed on two unregistered evidence IDs —
  `RIGHT-4Q204-OPEN-SCHEMATIC` and `RIGHT-P72-TEXT-LINK-ONLY` — referenced in reverify.
- **Severity:** P3 (governance/registry; no product impact)
- **File(s):** `reverify/CURRENT_HEAD_REVERIFY_2026-07-26_9407cc92_genesis-b594-production.md:27`;
  missing registry entries in `verified/MATRIX_ID_ALIASES.json`.
- **Evidence:** `evidence/sd3_unregistered_rights_ids.txt` (exact checker output).
- **Nature:** the two IDs are **Research rights-decisions** (`RIGHT-*`), pinned by Genesis-6
  provenance (Research commit `9bba3d45`, rights for Articles 6–9) — not bug IDs. They do not belong
  in the bug matrix, but the hardened coverage checker correctly flags them because no registry
  disposition exists.
- **Confidence:** high (project tool output, reproducible).
- **Verification level:** L1.
- **Suggested repair lane:** verifier/implementation adds two `informational` registry records
  (with non-empty reason) to clear the diagnostic; do NOT add to matrix or `ignoredTokens`.
  See `proposals/proposal-SD-3-rights-ids-registry.md`.

---

## 2. Confirmations of Existing Findings
None in scope — this lane is a fresh data-sync sweep, not a re-audit of prior product findings.

---

## 3. Challenges / Disputes
None.

---

## 4. Duplicate / Merge Proposals
None.

---

## 5. Severity Proposals
- Target bug: SD-1 → proposed severity **P3** (row-shape / ID-naming; corrected down from the initial
  P2 "counter drift" framing after running canonical tooling). Current: unregistered.
- Target bug: SD-2 → proposed severity **P3** (counter semantics). Current: unregistered.
- Target bug: SD-3 → proposed severity **P3** (registry/evidence hygiene). Current: unregistered.
- Target bug: SD-4 → proposed severity **P3** (evidence-freshness). Current: unregistered.
- Target bug: SD-5 → proposed severity **P1** for authority freshness (blocking trusted current-HEAD
  reverifies) / P3 as bug-class. Current: unregistered.
- Target bug: SD-6 → proposed severity **P2** (matrix freshness; reverify-driving). Current: unregistered.
- Target bug: SD-7 → proposed severity **P2** (matrix freshness; 65-row batched reverify). Current: unregistered.
- Target bug: SD-8 → proposed severity **P2** (reverify triage; confirms still-open Karty cluster). Current: unregistered.
- Target bug: SD-9 → proposed severity **P2** (data-layer triage; 1 stale-fixed, 3 still-open, 1 partial). Current: unregistered.

---

## 6. Repair Lane Suggestions
- Bug IDs: SD-1, SD-2, SD-3, SD-4
- Lane: `AUDITREPO-matrix-counter-reconcile` (single governance pass) — SD-1 + SD-2 (canonical
  counters 165/191 in `MASTER_BUG_MATRIX.md` + propagated to `NEXT_AGENT_PROMPT.md`).
- Lane: `AUDITREPO-evidence-registry-reconcile` — SD-3 (add two `informational` registry records)
  + SD-4 (schedule fresh reverify of `AUDIT-P3-OG-LCP-MISMATCH`).
- Lane: `source-authority-sync-2273b8c9` — SD-5 (advance recorded source HEAD to `2273b8c9` + paired
  reverify) then SD-6 (reverify map-engine candidate rows on that HEAD) and SD-7 (batched Karty reverify
  lane for the 65 `32ae0d7d`-witnessed rows) + SD-8 (keep confirmed-still-open cluster, close only QUAL-P1-04).
- Why together: all four are data-sync / evidence-hygiene fixes in the same canonical layer; none
  touches product code.
- What must NOT be mixed: no product/source repo changes; no Research/Drive changes; no
  PremiumControls owner-zone changes; no reclassification of any product bug severity; no
  counter/total edit without an explicit verifier decision.

---

## 7. Reverify Notes
Not applicable (this lane is the initial assessment, not a recheck of a prior finding).

---

## 8. Notes for Verifier

### Coverage-checker pass (this lane, same date) — SD-3
- Running the project's own `scripts/check_matrix_coverage.py` yields exactly **2 problems**, both
  UNREGISTERED-EVIDENCE for `RIGHT-4Q204-OPEN-SCHEMATIC` and `RIGHT-P72-TEXT-LINK-ONLY` at
  `reverify/CURRENT_HEAD_REVERIFY_2026-07-26_9407cc92_genesis-b594-production.md:27`. These are
  Research rights-decisions (not bugs). This is precisely the scenario the 2026-08-01 control-plane
  audit designed the hardened checker to catch; it now fires with exact file:line.
  Recommended: two `informational` registry records with reason (do not fabricate bugs).
- Other coverage stats are consistent: 356 canonical ids / 191 open rows; registry 52
  (11 aliases, 7 informational, 30 retired, 4 false-positive); direct witnesses 10; archived-only 2.
  No additional unregistered IDs beyond SD-3.

### Source-delta pass (this lane, same date) — SD-5/SD-6 + remaining commits clean
- SD-5: recorded source HEAD `efaf2a51` is stale; actual source main = `2273b8c9` (14 commits ahead).
- SD-6: PR #709 (map-engine runtime normalization) fixes map-engine defects matching open rows
  ASTRO-P1-02, ENGINE-P1-21/22/23/26/28, MAP-P1-11/14/15 (verified via `map-engine.js` diff);
  schedule reverify, do NOT auto-close.
- Remaining delta commits introduced no additional open-matrix-row overlaps:
  - a11y #728 (`6d49d75ce`): adds test coverage, zero product mutation.
  - indexnow.yml change: only adds Antisovetov Wave 8 contract step (not D-1 / BUG-SEO-001).
  - resume-toast #730 (`2273b8c93`): RESUME-TOAST-STALE-NAG already closed; no open row.
  - antisovetov Wave 8 (`41617252e`): content/source boundaries; D-19 antisovetov PageHead half
    remains open (not addressed).

### Continuation pass (this lane, same date) — refined conclusions
- **SD-1 resolved:** closed counter 165 is **correct** per canonical tooling
  (`check_matrix_coverage.py`: 356 canonical ids, 191 open => 165 closed). The only mismatch is the
  combined slash-ID row `NEW-68/69` (two distinct fixed bugs, invisible to canonical ID counting).
  Severity corrected P2 → P3. Options in `proposals/proposal-SD-1-closed-counter.md`.
- **SD-2 confirmed as the unique case + counter consequence:** a full-section sweep found AR-006 is
  the only genuine closed-but-listed-in-open-section row. Concretely, AUDITREPO(4) includes closed
  AR-006, so the canonical open total 191 counts one CLOSED item; if treated closed, open → 190.
  Disposition options in `proposals/proposal-SD-2-ar006-counting.md` + `evidence/sd2_resolved_ar006.txt`.
- **SD-4 added:** `AUDIT-P3-OG-LCP-MISMATCH` is the only open bug with archive-only evidence;
  recommend a fresh reverify on the ACTUAL current source HEAD `2273b8c9` (see SD-5; do not close/repair
  from 2026-07-05 archive).
  See `proposals/proposal-SD-4-archive-only-evidence.md`.
- **Coverage deep-dive (clean):** registry invariants all hold (alias targets resolve; no non-alias↔canonical
  overlap; all reasons filled). Every one of the 191 open IDs has evidence / direct witness / archived
  evidence — no ORPHAN-CLAIM. `R-003` archive-only is fine (refactoring backlog). Evidence:
  `evidence/coverage_deep_dive.txt`.
- **SD-2 wording false-positives confirmed:** all other closed-marked rows in open sections are false
  positives on wording (MAP-P1-19, TTS-DL-NO-TABLOCK, D-19 partial). Evidence:
  `evidence/sd1_alias_rows_and_options.txt`.
- **Cross-section duplicate IDs (D-1/2/3/4/7/8/19/21/22) are benign:** each appears in an open
  section plus the non-counting HISTORICAL AUDITOR LOG section; they do not inflate counters.
  Evidence: `evidence/cross_section_id_check.txt`.

- **What is synchronized (no action needed):**
  - Open section counts match their headers: P0=0, P1=96, P2=36, P3=51, Refactoring=4, AuditRepo=4.
  - Open total 191 = arithmetic sum of section headers.
  - Recorded HEAD/deploy authority internally consistent across docs: `efaf2a51…` / production
    `abf1edba…` match in `NEXT_AGENT_PROMPT.md`, matrix masthead, matrix session log and the referenced
    reverify `reverify/CURRENT_HEAD_REVERIFY_2026-08-01_efaf2a51_source-vs-production.md` (file exists).
    ⚠️ But the recorded HEAD `efaf2a51` is stale vs the actual source main `2273b8c9` (see SD-5).
  - All files referenced by `DOC_MAP.md` and `PROJECT_REGISTRY.md` exist:
    `verified/MASTER_BUG_MATRIX.md`, `NEXT_AGENT_PROMPT.md`,
    `verified/SUPER_AUDIT_2026-07-06_14a49be8.md`, `README.md`, `PremiumControls/README.md`,
    `projects/the-legendary-poet/README.md`,
    `projects/the-legendary-poet/incoming/gpt-5-6-source-library/2026-07-30/REPORT.md`.
  - `NEXT_AGENT_PROMPT.md` "AuditRepo synchronization: authority-only projection" and matrix
    masthead agree on `source != production` and on 165/191.
- **Needs verifier disposition (L1 → L2):**
  - SD-1: decide split `NEW-68`+`NEW-69` (closed→167) vs rename to one slash-free ID (closed→166);
    reconcile header, `## Статистика` and `NEXT_AGENT_PROMPT.md` accordingly. Closed counter 165 is
    currently correct, so any change here is a deliberate canonical decision.
  - SD-2: decide AR-006 counting semantics (keep visible + exclude from counter → open 190, or move
    row to closed). Applies to `## Статистика` and `NEXT_AGENT_PROMPT.md`.
  - SD-3: add two `informational` registry records for `RIGHT-*` (or an accepted disposition).
  - SD-4: schedule fresh reverify of `AUDIT-P3-OG-LCP-MISMATCH` on the actual source HEAD `2273b8c9`
    (after SD-5 authority sync).
  - SD-5: advance recorded source HEAD to `2273b8c9` + paired reverify (authority-only sync).
  - SD-6: reverify map-engine candidate rows on `2273b8c9`; close only non-reproducing (SHA-first).
    Source-verified on `2273b8c9`: FIXED candidates ASTRO-P1-02, ENGINE-P1-21/22/23/28, MAP-P1-14/15;
    STILL OPEN MAP-P1-11, ENGINE-P1-26. See `proposals/proposal-SD-6-mapengine-reverify.md`.
  - SD-7: batched Karty reverify lane for the 65 rows witnessed on `32ae0d7d` (607 commits behind
    `2273b8c9`). See `proposals/proposal-SD-7-karty-reverify-lane.md`.
- **Boundary:** this lane changed no canonical matrix row, status, severity, counter, source repo
  file, Research/Drive data or production evidence. Per README "Freedom with Evidence" an agent must
  NOT directly change canonical status in the verified ledger; hence only an intake report + proposals.
