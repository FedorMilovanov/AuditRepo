# Agent Audit Report

## Meta

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: Arena Agent (arena.ai Agent Mode)
- Date: 2026-08-18
- Audited branch/ref: `main`
- Audited anchor (SHA / artifact / live snapshot):
  - Product `main` SHA: `485db8c25287fa9bd2f53a5356885f02e4b81f4b`
  - HEAD subject: `Merge pull request #1714: name learning-sheet search input`
  - Live host: `https://gospod-bog.ru` (fetched 2026-08-18)
- Environment: static source tree (codeload zip of `main`) + live HTML title fetch + GitHub HTML commits/branches/pulls pages
- Build mode: source + live
- Browser / device if used: none (no browser runtime; live titles via HTTP GET)
- Scope:
  1. current-check of all active MASTER rows for `gb-is-my-strength`;
  2. collision check vs open Product PRs/branches;
  3. bounded class expansion where MASTER wording understates the current surface.
- Explicit exclusions:
  - no Product code mutation;
  - no Research repo full re-run of `Total cross-repo source audit`;
  - no branch-protection / org settings mutation;
  - no deep browser a11y/runtime interaction pass;
  - `the-legendary-poet` only registry-oriented glance (not this pass’s matrix owner).
- Signal class: Product + control-plane freshness
- Proof state: mixed PASS (confirmed current) / UNPROVEN (Research hard-gate live re-query) / N/A (settings)
- Claim boundary: statements below apply to Product `main` `485db8c…` and live titles fetched the same day; they are not a new terminal `PRODUCT ZERO`
- Preservation boundary: do not reopen closed Product roots `PROD-SOURCE-LINK-ROT-20260817` / `SYS-ATLAS-DRAWER-FOCUS-HANDOFF` without fresh contrary witness
- Semantic owner: AuditRepo evidence for `projects/gb-is-my-strength`
- Overlapping active owner/PR/branch check:
  - Open Product PRs: **0** (`There aren’t any open pull requests` on repo pulls page)
  - Branch `agent/antisovetov-title-suffix-20260818` @ `60ed2034028f36a030d0ba2732b15d74619a01ef` already fixes `AntisovetovPageHead.astro` title suffix — **treat as active owner for D-19**
  - Branch `fix/biografii-recent-heading-20260818` appears **superseded by main** (main already contains the recent-shelf H2/`aria-labelledby` shape and the strengthened biografii parity audit)

> The anchor records what this pass actually inspected. Do not update this report merely because the source repository later moved.

---

## 1. New observations

### Observation `OBS-TITLE-SUFFIX-CLASS-3`

- Title: Short site-name suffix `| Господь Бог` remains on **three** native PageHead sources (not only `D-19`)
- Kind: defect (class residual / MASTER under-statement)
- Suggested impact: low–medium (SEO/brand consistency; user-visible `<title>` / SERP)
- Route(s) / owner(s):
  - `src/components/article-pilots/antisovetov/AntisovetovPageHead.astro` (`D-19`)
  - `src/components/article-pilots/kod-da-vinchi/KodDaVinchiPageHead.astro`
  - `src/components/nagornaya/index/NagornayaIndexPageHead.astro`
- Observed on anchor: Product `main` `485db8c…` + live
- Expected: brand suffix `| Господь Бог — Сила Моя` (matches `SITE_NAME` in `scripts/validate.js` and the majority of other pilot PageHeads)
- Actual source titles:
  - `… | Господь Бог` on the three files above
- Actual live titles (HTTP GET):
  - `https://gospod-bog.ru/articles/20-antisovetov-pastoru/` → `20 антисоветов, как пастору разрушить своё служение | Господь Бог`
  - `https://gospod-bog.ru/articles/kod-da-vinchi/` → `«Код да Винчи»: мифы о Марии Магдалине и Никее | Господь Бог`
  - `https://gospod-bog.ru/nagornaya/` → `Нагорная проповедь — серия из 5 статей | Господь Бог`
- Reproduction or inspection steps:
  1. `rg -n "<title>.*\\| Господь Бог</title>" src -g'*.astro'`
  2. confirm full-suffix majority nearby (`| Господь Бог — Сила Моя`)
  3. GET live routes and read `<title>`
- Evidence type: `verified-source` + `verified-live`
- Evidence:
  - source short-suffix set size on `*.astro` = **3** (complete sweep)
  - `scripts/validate.js` defines `SITE_NAME = 'Господь Бог — Сила Моя'` and strips both full and short suffixes when comparing title↔og:title — short form is tolerated by harness, not preferred brand
  - owner branch for antisovetov only: tip diff is a 1-line title fix to full suffix; **kod-da-vinchi and nagornaya remain unowned**
- Confidence: high
- Limitations of this method: no SERP/browser tab screenshot; no claim about social card rendering beyond `<title>`
- Possible mechanism: pilot heads copied an older short brand fragment; validate harness accepts short suffix as strip variant, so CI does not fail closed on brand truncation
- Related existing findings: `D-19`
- Applicability: current main + current live
- What this evidence does **not** prove: that short suffix breaks routing, rights, or build; that every legacy `dist`/feed item must be rewritten in the same lane

### Observation `OBS-HTML-BTN-TYPE-BROADER`

- Title: Missing `type="button"` on JS-driven chrome controls is broader than MASTER’s HardTexts-only residual
- Kind: defect residual (MASTER under-statement)
- Suggested impact: low (form-default submit risk inside forms; consistency/a11y hygiene)
- Route(s) / owner(s):
  - `src/components/hard-texts/HardTextsPageChrome.astro` — `themeToggle`, `hMobileMenuBtn`, `hScrollTop` (**MASTER-named**)
  - `src/components/about/AboutPageChrome.astro` — `themeToggle` (**MASTER said Home/About/Nagornaya partial fix verified; About still missing**)
  - `src/components/pastor-series/PastorSeriesPageChrome.astro` — `themeToggle`, `hMobileMenuBtn`, `hScrollTop`
- Observed on anchor: Product `main` `485db8c…`
- Expected: interactive non-submit buttons set `type="button"` (as already done in `src/components/ui/Header.astro`, `ArticlesPageChrome.astro`, `src/pages/biografii/index.astro`, root `index.html` samples)
- Actual: listed chrome buttons omit `type`
- Evidence type: `verified-source`
- Evidence: full `*.astro` sweep of `<button>` without `type=`; ID-bearing interactive subset listed above
- Confidence: high
- Limitations: no browser proof of accidental submit (depends on ancestor `<form>`); FAQ accordion buttons also omit `type` but are a separate lower-priority cluster
- Possible mechanism: partial migration of chrome components; MASTER residual text froze an older “HardTexts-only” boundary
- Related existing findings: `HTML-BTN-TYPE`
- What this evidence does **not** prove: a current user-visible production incident

### Observation `OBS-BIOGRAFII-BRANCH-SUPERSEDED`

- Title: `fix/biografii-recent-heading-20260818` looks already absorbed by `main`
- Kind: process / collision note
- Suggested impact: low (stale branch hygiene)
- Observed:
  - main `BiografiiRecentSection.astro` already has `aria-labelledby="biografiiRecentTitle"` + `<h2 id="biografiiRecentTitle">` and no duplicate shelf `aria-label`
  - main `scripts/biografii-visual-parity-audit.js` already contains the branch’s heading guards
- Evidence type: `verified-source` + branch tip diff compare
- Confidence: medium-high (did not byte-compare every branch commit parent graph beyond tip diffs)
- Recommendation: do not open a competing biografii heading lane; branch can be retired after owner confirms no unique residual

---

## 2. Confirmations and extensions

### Confirm or extend `D-19`

- Target report/finding: MASTER `D-19`
- Evidence angle added: source + live + owner-branch collision
- My evidence anchor: Product `main` `485db8c…`; live `/articles/20-antisovetov-pastoru/`; branch `agent/antisovetov-title-suffix-20260818` @ `60ed203…`
- Result: **same symptom still current on main/live**
- Mechanism support: single hardcoded `<title>… | Господь Бог</title>` in `AntisovetovPageHead.astro` line 16; og/site_name already use full brand
- Current applicability: **current-confirmed-for-work on main**, but **repair owner already exists on branch** — AuditRepo/Product agents must **not** dual-implement
- Suggested disposition: keep `D-19` until branch merges; optionally widen wording or add sibling IDs for kod-da-vinchi + nagornaya (see `OBS-TITLE-SUFFIX-CLASS-3`)
- Why not stale/invalid: main + live still wrong; only the feature branch is fixed

### Confirm or extend `HTML-BTN-TYPE`

- Result: **current residual confirmed** on HardTexts chrome
- Extension: About + PastorSeries chrome still missing `type` on the same control class; MASTER note “Partial fix verified for Home/About/Nagornaya” is **over-broad for About**
- Suggested disposition: keep residual; broaden boundary text on next consolidation wave

### Confirm or extend `AR-IDX-JS-02`

- Result: **current residual confirmed** (multi-writer theme surface)
- Evidence angle added: source mechanism across three writers
- Exact witnesses on `485db8c…`:
  1. `js/enhancements.js` — `localStorage.setItem(window.SiteUtils&&SiteUtils.themeKey?SiteUtils.themeKey:"theme", dark?"dark":"light")`
  2. `js/site.js` — `themeKey:"theme"` plus `localStorage.setItem(r.themeKey, …)` / `setItem(SiteUtils.themeKey, …)` and a literal `localStorage.setItem('theme', theme)`
  3. `js/reader-preferences.js` — canonical `STORAGE_KEY = 'gb:reader-preferences:v1'` **and intentional compatibility bridge** `safeSet('theme', state.theme === 'dark' ? 'dark' : 'light')` inside `persist()`
- Interpretation:
  - canonical owner exists (`gb:reader-preferences:v1`)
  - legacy key `theme` is still actively written by legacy runtime **and** by the canonical owner as a bridge
  - residual remains real; fix is “single writer + explicit bridge policy”, not “delete key reads only”
- Suggested disposition: keep `AR-IDX-JS-02`; next repair should inventory all writers before deleting bridges (risk: unconverted toggles)

### Confirm or extend `D-2`

- Result: **current residual confirmed**
- Evidence:
  - `package.json` script: `"css:layer:validate": "node scripts/css-layer-validator.js css/site.css --ceiling=200"`
  - validator CLI accepts a **single** `<css-file>` (`Usage: … <css-file> [--ceiling=N]`)
  - `css/home.css` has `@layer` order + named blocks (size ~113KB) but is not in the npm script invocation
  - `css/floating-cluster.css` has `@layer components {…}` **without** a preceding `@layer order` declaration (size ~227KB) and is not validated by the script
- Suggested disposition: keep residual; any fix should either expand npm script targets or teach validator multi-file entry while setting explicit ceilings per file
- What this does not prove: that home/floating currently violate layer contracts (only that the hard gate does not look)

### Confirm or extend `SYS-RESEARCH-SOURCE-AUDIT-HARD-GATE`

- Result: **not re-litigated**; no independent Research workflow re-query in this environment (API rate-limit / no Actions access)
- Freshness: MASTER already marks terminal `PRODUCT ZERO` as **STALE** for this reason — this pass **agrees** that no new terminal CURRENT attestation is justified from Product-only evidence
- Collision: MASTER names Research branch `agent/source-audit-lock-recovery-20260817` as owner — this pass does **not** touch it

### Confirm or extend `SYS-MAIN-ADMISSION-ENFORCEMENT`

- Result: left as **owner-decision** (no settings witness collected beyond MASTER’s prior evidence pointers)
- This pass adds no Product defect and does not authorize settings mutation

---

## 3. Disproved / not admitted

| Claim | Disposition | Why |
|---|---|---|
| Need new competing Product PR for `D-19` title | **reject / collision** | Branch `agent/antisovetov-title-suffix-20260818` already owns the one-line fix |
| Biografii recent heading still broken on main | **not admitted as current defect** | main source + audit script already match the intended H2/`aria-labelledby` shape |
| Terminal `PRODUCT ZERO: CURRENT` | **still STALE** | Research hard-gate lane still open in MASTER; this pass did not clear it |
| Optional polish from older 2026-07-17 incoming as automatic MASTER rows | **not promoted** | no new necessity proof beyond existing residuals |

---

## 4. MASTER hygiene notes (for consolidation owner)

Observed doc nits (non-Product):

1. Header says **Active work units = 6** and **Narrowed residuals = 3**, but the residuals table heading says **NARROWED RESIDUALS — 4** while listing **3** rows. Counts should be reconciled on next consolidation (`3` residuals + `1` defect + `1` system lane + `1` owner decision = `6`).
2. `HTML-BTN-TYPE` boundary text understates current source surface (About/PastorSeries).
3. `D-19` boundary is accurate for antisovetov file, but brand-suffix class has two additional native heads without MASTER rows or owner branches.

Per operating model this pass **does not** edit `MASTER_BUG_MATRIX.md` from a parallel agent without a consolidation mandate; evidence is deposited for the matrix owner.

---

## 5. Collision / handoff map

| Surface | Owner now | Other agents must |
|---|---|---|
| Antisovetov `<title>` suffix | Branch `agent/antisovetov-title-suffix-20260818` | not open parallel PR |
| Kod-da-vinchi + Nagornaya title suffix | **unowned** on Product | may take as narrow follow-up after/with D-19 policy |
| HTML button `type` residuals | unowned | single chrome pass preferred over per-file thrash |
| Theme multi-writer | unowned | coordinate with reader-preferences owner |
| css layer validate breadth | unowned | harness-only lane |
| Research source-audit hard gate | Research branch named in MASTER | do not duplicate |
| Main admission enforcement | human owner decision | no workflow pretend-protection |

---

## 6. Recommended next actions (priority)

1. **Merge or refresh** `agent/antisovetov-title-suffix-20260818` onto current main; then current-check live title; only then drop `D-19`.
2. **Same-class follow-up** (new tiny lane or extend the title branch): full suffix on `KodDaVinchiPageHead.astro` + `NagornayaIndexPageHead.astro` (+ regenerate affected publication titles if dist is committed separately).
3. **HTML-BTN-TYPE** one pass across HardTexts/About/PastorSeries chrome (and decide on FAQ accordion cluster → Work Queue vs residual).
4. **AR-IDX-JS-02** design note before code: keep explicit bridge in `reader-preferences.persist` until legacy toggles are gone; stop *independent* writers in `enhancements.js`/`site.js` first.
5. **D-2** expand `css:layer:validate` to `home.css` and `floating-cluster.css` with per-file ceilings; floating-cluster likely needs an order declaration or an intentional unlayered policy exception.
6. Do **not** re-issue terminal ZERO until Research lane closes and cross-repo reconciliation is fresh.

---

## 7. Proof labels used

`verified-source`, `verified-live`, `current-confirmed-for-work`, `collision-owner-exists`, `stale-terminal-attestation-unchanged`, `not-admitted`

---

## 8. Minimum useful contribution of this pass

- Reconfirmed four Product-facing MASTER residuals/defects on a fresh main SHA after #1714.
- Prevented duplicate `D-19` implementation via owner-branch witness.
- Widened title-suffix and button-type class understanding with source completeness sweeps.
- Kept control-plane STALE posture honest without false ZERO.
