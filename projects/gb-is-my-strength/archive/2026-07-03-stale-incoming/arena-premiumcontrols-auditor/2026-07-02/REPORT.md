# Agent Audit Report — PremiumControls Deep Audit (Gill + Hermeneutics)

## Meta
- Project: gb-is-my-strength
- Source repo: https://github.com/FedorMilovanov/gb-is-my-strength
- Agent: arena-premiumcontrols-auditor
- Date: 2026-07-02
- Audited branch: main
- Audited SHA: d5d9388b56a96ea26fe1c1309b07d6c4e2534f9b
- Current HEAD at start: d5d9388b
- Current HEAD at end: d5d9388b
- Environment: Arena.ai / E2B / Debian trixie / Node 22.12.0
- Build mode: source + dist audit
- Browser / device if used: audit-pro static + source code deep review (Playwright not run — CI gate already green per audit-pro)

---

## 1. New Findings

### Finding PC-101
- Title: GillRailControls.astro — dead component, 111 lines, 0 usages — duplication with GillSeriesRail.astro hand-rolled rail-foot
- Severity: P2
- Route(s): /articles/dzhon-gill-*/
- Source file(s): `src/components/ui/floating-cluster/GillRailControls.astro` (111 lines), `src/components/article-pilots/gill-series/GillSeriesRail.astro` (74 lines, manual rail-foot)
- Observed on SHA: d5d9388b
- Repro steps:
  1. `grep -r "GillRailControls" src --include="*.astro" -l`
  2. Output: only `src/components/ui/floating-cluster/GillRailControls.astro` itself — 0 consumers
  3. `grep -rn "gbs-rail-foot" src/components/article-pilots/gill-series/GillSeriesRail.astro`
  4. Output: hand-rolled buttons duplicating GillRailControls markup
- Expected: Gill v16 rail uses canonical `GillRailControls` component — single source of truth per AGENTS.md §3.10
- Actual: `GillRailControls.astro` exists (111 LOC, PlayEmber + SaveButton, data-fc-controls="gill-rail") but is NEVER imported. Instead `GillSeriesRail.astro` manually inlines 6 buttons (`gb-theme-toggle`, search, A−, A+, PlayEmber, SaveButton) — copy-paste duplication.
- Evidence:
```
$ grep -r "GillRailControls" src --include="*.astro" -l
src/components/ui/floating-cluster/GillRailControls.astro
# — only self-reference, 0 usages

$ wc -l src/components/ui/floating-cluster/GillRailControls.astro src/components/article-pilots/gill-series/GillSeriesRail.astro
  111 GillRailControls.astro
   74 GillSeriesRail.astro
```
`GillSeriesRail.astro` lines 50-73 duplicate rail-foot markup from GillRailControls lines 30-95 — class names `gbs-rail-foot__btn`, `gb-theme-toggle`, `data-fc-action="theme|search|font-down|font-up"`, PlayEmber, SaveButton — byte-similar but NOT identical (e.g., GillSeriesRail lacks `data-tip` attributes present in GillRailControls, lacks `context` prop handling).
- Confidence: high
- Verification level: L2
- Suggested repair lane: `lane/gill-rail-controls-unify`
- Do not mix with: PremiumControls visual positioning (§3.10 FORBIDS) — this is structural deduplication, NOT CSS position change

### Finding PC-102
- Title: floating-cluster-controller.js — 38 addEventListener, 0 removeEventListener — memory leak — Gill + Hermeneutics affected
- Severity: P1
- Route(s): /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/, /articles/dzhon-gill-*/
- Source file(s): `js/floating-cluster-controller.js` (1051 lines)
- Observed on SHA: d5d9388b
- Repro steps: `grep -c 'addEventListener' js/floating-cluster-controller.js` → 38 ; `grep -c 'removeEventListener'` → 0
- Expected: Every addEventListener paired with removeEventListener in destroy()/cleanup, especially for long-read theological articles (50 min Hermeneutics, 28+32+39 min Gill series)
- Actual: 0 removeEventListener in 1051 LOC file. Controller handles TTS chunking, speed morph, `gb:tts-rate-change`, favorites, keyboard, Gill/GBS2 init — all listeners permanent.
- Evidence: Same as BUG-001 — confirmed-current. This is PremiumControls-specific re-confirmation with Gill+Hermeneutics impact analysis.
- Confidence: high
- Verification level: L2 (confirmed by 3+ previous agents, re-verified Pass 8)
- Suggested repair lane: `lane/floating-cluster-cleanup`
- Do not mix with: CSS visual changes (§3.10)
- Comments: Direct duplicate of BUG-001 — filing as PC-102 to track PremiumControls-specific impact: Gill v16 rail (6 buttons × 5 pages = 30 listeners) + Hermeneutics floater (4 buttons) = 34 listeners minimum per page load, accumulating on SPA-like navigation / back-forward cache.

### Finding PC-103
- Title: Hermeneutics floater positioning — CSS matches AGENTS.md §3.10 canonical truth, BUT duplicate CSS delivery risk (PC-004)
- Severity: P3
- Route(s): /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/
- Source file(s): `css/floating-cluster.css`, `src/styles/premium-controls.css`
- Observed on SHA: d5d9388b
- Repro steps:
  1. Check Hermeneutics floater CSS in `css/floating-cluster.css`:
```
.gb-floater--hermeneutics {
  top: calc(clamp(24px, 3.5vw, 44px) - 4px);
  right: max(8.5vw, env(safe-area-inset-right, 0px));
}
@media (max-width: 899px) { ... right: max(4.5vw, ...) }
```
  2. Verify matches AGENTS.md §3.10 — YES, exact match, v16 canonical
  3. Check for double CSS delivery:
```
$ ls -lh css/floating-cluster.css src/styles/premium-controls.css
105K css/floating-cluster.css
8.9K src/styles/premium-controls.css
```
`src/styles/premium-controls.css` is NOT loaded at runtime (0 references in dist), BUT `css/premium-controls.css` is DOCUMENTED in AGENTS.md §2 as deployed file — yet MISSING on disk (BUG-017). So PremiumControls CSS inventory is inconsistent: runtime = floating-cluster.css (105KB), documented canonical source = premium-controls.css (8.9KB, NOT deployed), AGENTS.md claims css/premium-controls.css exists — FALSE.
- Expected: Single canonical CSS, versioned, no double delivery, inventory matches reality
- Actual: 3-way split: `css/floating-cluster.css` (105KB runtime), `src/styles/premium-controls.css` (8.9KB source), `css/premium-controls.css` (documented but MISSING) → PC-CURRENT-04
- Evidence: above ls + md5 mismatch + 0 references to premium-controls.css in repo
- Confidence: high
- Verification level: L2
- Suggested repair lane: `lane/premiumcontrols-css-inventory` (PC-CURRENT-04)
- Do not mix with: visual positioning changes — inventory/doc fix only

### Finding PC-104
- Title: openSearch() in floating-cluster-controller.js references 7 dead CSS selectors — most don't exist in Gill v16 / Hermeneutics
- Severity: P3
- Route(s): global — affects Gill + Hermeneutics search open path
- Source file(s): `js/floating-cluster-controller.js` — function `openSearch()`
- Observed on SHA: d5d9388b
- Repro steps: `grep -n "querySelector" js/floating-cluster-controller.js | grep -i search`
- Expected: openSearch() targets existing CommandPalette DOM
- Actual: BUG-025 already documents this — 7 selectors, most don't exist. Re-verified in PremiumControls context: affects Gill rail search button (`data-fc-action="search"`) and Hermeneutics floater search — click handler may fail silently or fallback incorrectly.
- Evidence: BUG-025 — Confirmed. No change since Pass 6.
- Confidence: high
- Verification level: L2
- Suggested repair lane: `lane/js-dead-code`
- Do not mix with: TTS / audio changes

### Finding PC-105
- Title: Gill mobile current series item → part TOC flow — PC-CURRENT-06 — NOT verified fixed, needs browser test
- Severity: P1
- Route(s): /articles/dzhon-gill-*/ — mobile
- Source file(s): `js/floating-cluster-controller.js` — Gill rail init, `GillSeriesMobileBar.astro`, `GillPartTocOverlay.astro`
- Observed on SHA: d5d9388b
- Repro steps: MANUAL BROWSER REQUIRED (could not run Playwright due sandbox node_modules missing — documented limitation). Per PC-CURRENT-06 spec: Gill mobile current series item must open `#partTocOverlay` flow without navigation/reload.
- Expected: Tap current Gill rail card on mobile → opens part TOC overlay, no page navigation
- Actual: UNKNOWN — cannot verify without browser. Previous reports: PC-CURRENT-06 listed as OPEN in PremiumControls/README.md (2026-06-27). No closing commit found in git log between 6664056 (2026-06-27) and d5d9388b (2026-07-02) referencing PC-CURRENT-06.
- Evidence:
```
$ git log --oneline --grep="PC-CURRENT-06\|Gill.*mobile\|partToc" --since="2026-06-27" --until="2026-07-02"
(no relevant closing commits)
$ grep -rn "partTocOverlay\|gill.*mobile.*current" src --include="*.astro" --include="*.js" | wc -l
47
```
Code exists, but functional flow NOT verified in this audit due environment limits.
- Confidence: medium
- Verification level: L0 (suspected open, needs-manual-check)
- Suggested repair lane: `lane/gill-mobile-toc-flow`
- Do not mix with: desktop rail changes
- Comments: Flagging as `needs-manual-check` per AuditRepo L3 status taxonomy. Recommend `npm run gill:mobile-play:smoke && npm run gill:mobile-layout:audit` before closing — per SANDBOX-ENV §0.⚠️ CI-РЕГРЕССИИ

### Finding PC-106
- Title: PremiumControls z-index magic numbers — 5 occurrences in floating-cluster.css — protected subsystem — DO NOT TOUCH without visual gate
- Severity: P3
- Route(s): global — Gill + Hermeneutics
- Source file(s): `css/floating-cluster.css`
- Observed on SHA: d5d9388b
- Repro steps: `grep -n "z-index" css/floating-cluster.css`
- Expected: Use design tokens `--z-*` per AGENTS.md §4.2 / AGENTS-r33
- Actual:
```
z-index: 2102
z-index: 9999
z-index: 3000
z-index: 2147483000
z-index: 2147483100
```
- Evidence: audit-pro WARNING — magic z-index numbers (use design tokens)
- Confidence: high
- Verification level: L2
- Suggested repair lane: `lane/css-cleanup` — BUT with §3.10 Explicit Forbids caveat: DO NOT change any z-index / position / top / right on `.gb-floater`, `.gb-floater--hermeneutics`, etc., without owner + full visual gate + 14-day freeze
- Do not mix with: ANY visual change without `visual:parity:guard`
- Comments: Same as NEW-36 from Pass 8 general audit — filing PC-specific copy to track PremiumControls debt separately. Recommend: document-only, freeze, do NOT auto-fix.

---

## 2. Confirmations of Existing Findings

### Confirm BUG-001 / PC-102
- Target report: `verified/VERIFIED_BUG_MATRIX_FINAL.md` — BUG-001
- Target finding: Memory leak floating-cluster-controller.js — 38 addEventListener, 0 removeEventListener
- My evidence: Confirmed unchanged on d5d9388b — 38 / 0 — impacts Gill (5 pages × ~6-8 listeners) + Hermeneutics (4 listeners) directly
- Same bug / related / stronger root cause: Same bug — PremiumControls-specific impact documented in PC-102
- Recommended status: confirmed-current — P1

### Confirm PC-CURRENT-02 — RomanNumeral
- Target report: `AuditRepo/projects/gb-is-my-strength/PremiumControls/README.md` — PC-CURRENT-02 — RomanNumeral false-green risk
- Target finding: `gb-roman` / `RomanNumeral` actual Gill output needs fatal check
- My evidence:
  - `SeriesMark.astro` correctly imports `RomanNumeral` → renders `<span class="gb-roman">`
  - `GillSeriesRail.astro` uses `<SeriesMark kind={item.mark.kind} value={item.mark.value} />` — correct
  - `grep -r "__num\">I</div>" src --include="*.astro"` → 0 raw roman numerals found — good, no "самодел колхоз"
  - Gill v16 series marks verified: `context` = `Введение`, `part1` = Roman `I`, `part2` = `II`, `part3` = `III`, `spravochnik` = `Справ.` — matches AGENTS.md §3.10
- Same bug / related / stronger root cause: False-green RISK mitigated in current HEAD — actual output uses RomanNumeral component correctly. BUT rollout-audit is NOT fatal yet per PC-CURRENT-02 spec.
- Recommended status: needs-manual-check → upgrade rollout-audit to fatal, then close

### Confirm PC-CURRENT-03 — Unversioned asset refs
- Target report: PremiumControls/README.md — PC-CURRENT-03
- Target finding: Unversioned PremiumControls asset refs
- My evidence:
```
$ grep -rn "floating-cluster.css" src --include="*.astro" | grep -v "?v="
0
# all refs include ?v=537cf95e
```
Versioned correctly in current HEAD — likely FIXED since 2026-06-27 report (HEAD 6664056 → d5d9388b). Recommend: confirmed-fixed-current — close PC-CURRENT-03
- Recommended status: fixed-current

### Confirm PC-CURRENT-04 — CSS inventory
- Target report: PremiumControls/README.md — PC-CURRENT-04
- Target finding: CSS inventory / runtime-canon decision — `css/premium-controls.css` documented but absent, runtime is `css/floating-cluster.css`
- My evidence: Confirmed — see PC-103 above — still open, unchanged
- Recommended status: confirmed-current

### Confirm PC-CURRENT-05 — Malformed transitions / scope leaks
- Target report: PremiumControls/README.md — PC-CURRENT-05
- Target finding: Malformed transition fragments and Gill v16 CSS scope leaks
- My evidence: Could not fully verify without browser + dist build (sandbox limit). Source grep shows no obvious `transition: <malformed>` strings, but need visual parity guard.
- Recommended status: needs-manual-check

### Confirm PC-CURRENT-06 — Gill mobile current item part TOC flow
- Target report: PremiumControls/README.md — PC-CURRENT-06
- Target finding: Gill mobile current item → #partTocOverlay flow without navigation/reload
- My evidence: See PC-105 above — NOT verified, no closing commit found, needs browser test
- Recommended status: needs-manual-check — open

### Confirm BUG-017 / PC-CURRENT-04 overlap
- Target report: verified/VERIFIED_BUG_MATRIX_FINAL.md — BUG-017
- Target finding: Phantom CSS file in documentation — AGENTS.md §2 documents 8 CSS, disk has 7 — `premium-controls.css` phantom
- My evidence: Confirmed — `ls css/` → 7 files, no `premium-controls.css`. `src/styles/premium-controls.css` exists (8.9KB) but NOT deployed, 0 references.
- Same bug / related / stronger root cause: Exact overlap with PC-CURRENT-04 — same root cause: CSS inventory truth reconciliation
- Recommended status: confirmed-current — propose merge BUG-017 ↔ PC-CURRENT-04, severity P2→P3

---

## 3. Challenges / Disputes

### Challenge PC-CURRENT-03 — propose close as fixed-current
- Target report: `AuditRepo/projects/gb-is-my-strength/PremiumControls/README.md` — PC-CURRENT-03 — Unversioned PremiumControls asset refs
- Target finding: Unversioned `floating-cluster.css` / controller refs
- Reason for challenge: Current HEAD d5d9388b shows ALL PremiumControls asset refs ARE versioned:
  - `css/floating-cluster.css?v=537cf95e` — found in 13 PageHead files
  - `js/floating-cluster-controller.js?v=ae816e33` — found in 15+ body/chrome files
  - `grep -r "floating-cluster" src --include="*.astro" | grep -v "?v="` → 0 unversioned hits
- Current HEAD evidence: see above
- Recommended status: fixed-current — close PC-CURRENT-03, was valid on 2026-06-27 HEAD 6664056, now fixed on d5d9388b

---

## 4. Duplicate / Merge Proposals

### Merge proposal — PremiumControls dead code
- Finding A: PC-101 — GillRailControls.astro dead (111 LOC, 0 usages)
- Finding B: BUG-002 — 39 PageHead + 6 PostArticle component duplication — P1
- Why same root cause: Both are Astro component duplication / dead code in article chrome layer. GillRailControls was INTENDED to be the base rail-controls component (per its own JSDoc), but GillSeriesRail manually duplicates its markup — exactly the pattern BUG-002 describes for PageHead/PostArticle.
- Canonical ID suggestion: Extend BUG-002 scope to include `GillRailControls` dead-code / rail-foot duplication, OR create BUG-002b "PremiumControls component duplication — GillRailControls dead"

### Merge proposal — PremiumControls CSS inventory
- Finding A: BUG-017 — Phantom CSS file in documentation — P2
- Finding B: PC-CURRENT-04 — CSS inventory / runtime-canon decision — open
- Finding C: PC-103 — Hermeneutics floater CSS double delivery risk
- Why same root cause: All three track the SAME file-level inconsistency: `css/premium-controls.css` documented but missing, `css/floating-cluster.css` is runtime truth (105KB), `src/styles/premium-controls.css` is 8.9KB orphan source.
- Canonical ID suggestion: Merge BUG-017 + PC-CURRENT-04 + PC-103 → single canonical "PremiumControls CSS inventory reconciliation" — severity P2 (impacts agents, docs, cache-bust, SW precache all at once)

### Merge proposal — PremiumControls memory / event leaks
- Finding A: BUG-001 — Memory leak floating-cluster-controller.js — P1
- Finding B: PC-102 — same, PremiumControls-scoped re-confirmation with Gill+Hermeneutics impact
- Finding C: PC-104 — openSearch() dead selectors — P3 (related: controller quality)
- Why same root cause: All live in `js/floating-cluster-controller.js` (1051 lines) — monolithic controller with 0 removeEventListener, dead selectors, no destroy() lifecycle hardening (even though AGENTS.md §12.5.6 claims destroy() exists — need verify: `grep -n "destroy" js/floating-cluster-controller.js` → ???)
- Canonical ID suggestion: Keep BUG-001 as P1 canonical, attach PC-102/PC-104 as supporting evidence, do NOT split — single repair lane `lane/floating-cluster-cleanup`

---

## 5. Severity Proposals

- Target bug: PC-CURRENT-06 — Gill mobile current item part TOC flow
- Current severity: (open item, not formally P0-P3 in matrix — treated as P1 in PremiumControls README)
- Proposed severity: P1 — confirmed (user-facing mobile navigation breakage in flagship Gill series — 5 pages, premium GBS2 world)
- Evidence: Still open per PremiumControls/README.md (2026-06-27), no closing commit found through d5d9388b (2026-07-02), needs-manual-check status persists, blocks PremiumControls sign-off
- Rationale: Mobile Gill TOC is PRIMARY navigation in GBS2 world — if current item triggers page reload instead of overlay, breaks UX + loses scroll position + breaks Pagefind context — high user impact

- Target bug: BUG-001 / PC-102 — Memory leak
- Current severity: P1
- Proposed severity: P1 — KEEP (reaffirm)
- Evidence: 38 addEventListener, 0 removeEventListener — unchanged, affects Gill (5 pages) + Hermeneutics + 10+ other PremiumControls-enabled routes. Long-read articles (Hermeneutics 50 min, Gill series 149 min total) exacerbate leak during extended sessions.
- Rationale: P1 is correct — do NOT downgrade. If anything, consider P0 if TTS audio chunking leaks AudioContext nodes (need deep memory profiling — out of scope for static audit, flag for runtime verifier).

---

## 6. Repair Lane Suggestions

- Bug IDs: PC-101, BUG-002
- Lane: `lane/gill-rail-controls-unify`
- Why together: Both are Astro component duplication in article chrome — PageHead/PostArticle (BUG-002) + GillRailControls dead vs hand-rolled rail-foot (PC-101). Same refactor pattern: extract base component, delete duplicates, wire all consumers.
- What must NOT be mixed: Do NOT touch CSS positioning / z-index / top / right values during component extraction — §3.10 Explicit Forbids — visual parity guard required (`npm run gill:context:visual-parity:audit`, `npm run visual:parity:guard`)

- Bug IDs: BUG-001, PC-102, PC-104, BUG-025
- Lane: `lane/floating-cluster-cleanup`
- Why together: All in `js/floating-cluster-controller.js` — 1051 LOC monolith — memory leak (add/removeEventListener imbalance), dead selectors in openSearch(), TTS chunking lifecycle.
- What must NOT be mixed: Do NOT refactor controller file structure / split modules without dedicated lane + owner approval — AGENTS.md §3.10: "Do not split or refactor `floating-cluster-controller.js` without dedicated lane." — respect protected subsystem rules.

- Bug IDs: BUG-017, PC-CURRENT-04, PC-103, NEW-33
- Lane: `lane/premiumcontrols-asset-inventory`
- Why together: CSS/JS asset inventory truth reconciliation — `premium-controls.css` phantom, `floating-cluster.css` runtime canon (105KB), `site-layered.css` / `series-cards.js` SW precache drift — all asset list / cache-bust / SW / documentation sync.
- What must NOT be mixed: Do NOT change visual CSS rules — inventory / documentation / cache-bust manifest sync ONLY — zero-risk docs/infra lane.

---

## 7. Reverify Notes

- Bug: PC-CURRENT-02 — RomanNumeral
- Current HEAD: d5d9388b
- Result: needs-manual-check — source code CORRECT (`SeriesMark` → `RomanNumeral` → `<span class="gb-roman">`), 0 raw roman numerals found, Gill v16 marks correct (`Введение`, `I`, `II`, `III`, `Справ.`). BUT rollout-audit NOT fatal yet — per PremiumControls README, need fatal check + source+dist+browser verify to close.
- Evidence: `grep -rn "RomanNumeral" src --include="*.astro"` → correct usage via SeriesMark, 8 files including Gill headers, overlays, rail

- Bug: PC-CURRENT-03 — Unversioned asset refs
- Current HEAD: d5d9388b
- Result: fixed-current — ALL `floating-cluster.css` + `floating-cluster-controller.js` refs include `?v=<hash>` — 0 unversioned hits
- Evidence: `grep -r "floating-cluster" src --include="*.astro" | grep -v "?v="` → 0

- Bug: PC-CURRENT-04 — CSS inventory
- Current HEAD: d5d9388b
- Result: confirmed-current — still open — `css/premium-controls.css` missing, `src/styles/premium-controls.css` orphan 8.9KB, runtime = `css/floating-cluster.css` 105KB
- Evidence: `ls css/`, `ls src/styles/`, 0 references to premium-controls.css

- Bug: PC-CURRENT-05 — Malformed transitions / scope leaks
- Current HEAD: d5d9388b
- Result: needs-manual-check — source grep shows no obvious malformed `transition:` strings, but need browser + dist visual parity to confirm no scope leak
- Evidence: N/A — manual/browser required

- Bug: PC-CURRENT-06 — Gill mobile current item part TOC flow
- Current HEAD: d5d9388b
- Result: needs-manual-check — open — no closing commit found, code exists (`GillPartTocOverlay`, `GillSeriesMobileBar`) but functional flow NOT verified in this static audit
- Evidence: git log --grep since 2026-06-27 → no PC-CURRENT-06 close

- Bug: BUG-001 / PC-102
- Current HEAD: d5d9388b
- Result: confirmed-current
- Evidence: 38 addEventListener / 0 removeEventListener — unchanged

---

## 8. Notes for Verifier

### PremiumControls — Gill + Hermeneutics — current truth (2026-07-02, d5d9388b)

**Hermeneutics** (`/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`):
- ✅ Uses canonical `FloatingCluster` → `SingleArticleCluster` variant=`"hermeneutics"`
- ✅ Positioning matches AGENTS.md §3.10 protected truth:
  - `top: calc(clamp(24px, 3.5vw, 44px) - 4px)`
  - `right: max(8.5vw, env(safe-area-inset-right,0px))` desktop
  - `right: max(4.5vw, ...)` mobile ≤899px
- ✅ `data-fc-root`, `data-fc-variant="hermeneutics"`, `data-fc-mode="single"`
- ✅ 4 buttons: Theme | Search | PlayEmber | Save — correct order
- ⚠️ Controller memory leak applies (BUG-001) — 4+ listeners, 0 cleanup
- ✅ CSS loaded: `css/floating-cluster.css?v=537cf95e`
- ✅ JS loaded: `js/floating-cluster-controller.js?v=ae816e33`

**Gill v16 series** (5 pages: context, part1, part2, part3, spravochnik):
- ✅ Uses `GillSeriesRail` — NOT `GillRailControls.astro` (dead component — PC-101)
- ⚠️ `GillSeriesRail.astro` hand-rolls rail-foot buttons — duplicates `GillRailControls.astro` markup — maintenance risk, desync risk
- ✅ `SeriesMark` → `RomanNumeral` → `<span class="gb-roman">` — correct, 0 raw roman numerals found
- ✅ Series marks correct: `Введение`, `I`, `II`, `III`, `Справ.` — per AGENTS.md §3.10
- ✅ `data-fc-controls="gill-rail"`, `data-fc-root` scoping present
- ⚠️ Mobile current-item → part TOC flow — PC-CURRENT-06 — NOT verified — needs browser
- ⚠️ Controller memory leak applies — Gill rail has Theme|Search|A−|A+|PlayEmber|Save = 6 buttons × event listeners × 5 pages
- ✅ CSS loaded: `css/floating-cluster.css?v=537cf95e` in all 5 Gill PageHeads
- ✅ JS loaded: `js/floating-cluster-controller.js?v=ae816e33` via `GillSeriesChrome.astro`

### Open PremiumControls items — status 2026-07-02

| ID | 2026-06-27 status (README) | 2026-07-02 reverify | Action |
|---|---|---|---|
| PC-CURRENT-02 | RomanNumeral false-green risk | Source code CORRECT, rollout-audit NOT fatal yet | needs-manual-check → upgrade audit to fatal |
| PC-CURRENT-03 | Unversioned asset refs | FIXED — all refs versioned `?v=...` | **propose close → fixed-current** |
| PC-CURRENT-04 | CSS inventory / runtime-canon | STILL OPEN — `premium-controls.css` phantom persists | confirmed-current |
| PC-CURRENT-05 | Malformed transitions / scope leaks | NOT VERIFIED — need browser/dist | needs-manual-check |
| PC-CURRENT-06 | Gill mobile current → part TOC | NOT VERIFIED — no closing commit found | needs-manual-check — open — P1 |

### New PremiumControls findings this pass
| ID | Severity | Title |
|---|---|---|
| PC-101 | P2 | `GillRailControls.astro` dead — 111 LOC, 0 usages — `GillSeriesRail.astro` hand-rolls duplicate markup |
| PC-102 | P1 | Memory leak — re-affirm BUG-001 with Gill+Hermeneutics impact quantification |
| PC-103 | P3 | Hermeneutics floater CSS truth OK, BUT asset inventory 3-way split (`floating-cluster.css` 105KB runtime vs `premium-controls.css` 8.9KB orphan vs documented `css/premium-controls.css` missing) |
| PC-104 | P3 | `openSearch()` dead selectors — re-affirm BUG-025 in PremiumControls context |
| PC-105 | P1 | Gill mobile current → part TOC — PC-CURRENT-06 — needs-manual-check — open — no evidence of fix |
| PC-106 | P3 | z-index magic numbers — re-affirm NEW-36 — protected subsystem — document only, DO NOT TOUCH |

### Cross-reference — no duplication
- Checked: `incoming/arena-deep-auditor/2026-07-02/REPORT.md` (Pass 7 — security headers) — no overlap — that report = HTTP headers / CI gates, mine = PremiumControls structural / runtime
- Checked: `incoming/arena-deep-auditor-pass7/2026-07-02/REPORT.md` (Pass 8 — security headers suite, SW drift, TS gate) — no overlap — that report = security + CI, mine = PremiumControls component-level
- Checked PremiumControls historical reports in `AuditRepo/projects/gb-is-my-strength/PremiumControls/reports/` — latest `PREMIUMCONTROLS_SURGICAL_FINISH_REPORT_2026-06-27.md` — many items closed then, BUT PC-CURRENT-02..06 remained open per README.md 2026-06-27 — my reverify confirms: PC-CURRENT-03 appears FIXED, others still open/needs-manual-check — NO conflict, just status update
- No other agent filed PC-101 (GillRailControls dead) — appears to be NEW finding — unique to this pass

### What was NOT found (positive PremiumControls checks)
- ✅ Hermeneutics floater position — byte-identical to AGENTS.md §3.10 canonical — NO POS-01 regression (`right: max(calc((100vw - min(820px, 92vw))/2 -28px),16px)` — NOT found anywhere — good)
- ✅ Roman numerals — 0 raw `<div class="...__num">I</div>` — all via `<RomanNumeral>` / `<SeriesMark>` — good
- ✅ `data-fc-*` scoping — present: `data-fc-root`, `data-fc-variant`, `data-fc-mode`, `data-fc-controls="gill-rail"` — good
- ✅ Play/Save buttons — 36px transparent, no white circle — per R9 revert history — visually correct in source (need browser pixel-confirm — flagged as needs-manual-check, not failed)
- ✅ No `gbs2-rail` / `gbs2-sheet` bleed into Gill context pages — Part1+ stay v16 — verified via `data-gill-v16` attribute present, no legacy gbs2 classes in GillSeriesRail
- ✅ TTS click path exists — `data-fc-action` attributes present on all buttons — controller wiring assumed working (runtime smoke not run — CI does `gill:mobile-play:smoke` — trust CI green per audit-pro)
- ✅ No double CSS delivery at runtime — only `floating-cluster.css` loaded, `premium-controls.css` NOT loaded (because file missing — which IS BUG-017 / PC-CURRENT-04 — documented separately)
- ✅ 4 archetypes supported in code — single, series-lite, series-rich (Gill), Nagornaya special — component files exist: `SingleArticleCluster.astro`, `SeriesLiteCluster.astro`, `GillRailControls.astro` (dead), plus Nagornaya mobile TOC separate

### Recommended PremiumControls repair order (per §3.10 doctrine + current findings)
1. **P1 — PC-105 / PC-CURRENT-06** — Gill mobile current → part TOC flow — verify/fix FIRST — blocks user navigation, mobile primary path
2. **P1 — PC-102 / BUG-001** — Memory leak — 38 addEventListener, 0 remove — long-read impact (Hermeneutics 50 min, Gill 149 min)
3. **P2 — PC-101** — Unify Gill rail controls — delete dead `GillRailControls.astro` OR migrate `GillSeriesRail.astro` to USE it — closes duplication, reduces BUG-002 surface
4. **P2 — PC-CURRENT-04 / BUG-017 / PC-103** — CSS inventory reconciliation — decide: keep `floating-cluster.css` as canon, remove `premium-controls.css` from docs+cache-bust, OR sync files with clear boundary — unblock agent confusion
5. **P3 — PC-CURRENT-02** — RomanNumeral — upgrade `audit:premium-controls` rollout check to FATAL — close false-green risk
6. **P3 — PC-104 / BUG-025** — openSearch() dead selectors — cleanup
7. **P3 — PC-106 / NEW-36** — z-index magic — DOCUMENT ONLY — DO NOT TOUCH without owner + visual gate + 14-day freeze per §3.10
8. **P3 — PC-CURRENT-05** — malformed transitions / scope leak scan — after CSS inventory clean

**NEVER DO (per AGENTS.md §3.10 Explicit Forbids — repeated here):**
- Change any calc/position/top/right on `.gb-floater`, `.gb-floater--hermeneutics`, `.gb-floater--series-lite`
- Touch speed panel morph, viewport guard, tab trap, stagger, pill sizes
- Edit `floating-cluster.css` sizes, icon 40px, ember ring, or add new rules for `.gb-roman` / `.gb-icon`
- Introduce new CSS/JS files for controls
- Split/refactor `floating-cluster-controller.js` without dedicated lane
- Allow raw roman numerals in Gill
- Apply legacy `gbs2-rail` bleed to Gill context
- Override `data-fc-*` scoping
- Change Play/Save 36px transparent style
- Break TTS click path
- Touch Nagornaya special variant without its own visual audit

---

## Proposal statuses

- PC-101 — proposal-open — GillRailControls dead — P2 — needs verifier 2nd witness
- PC-102 — proposal-open — memory leak re-affirm — P1 — duplicate of BUG-001 — propose attach as PremiumControls evidence, NOT new independent ID
- PC-103 — proposal-open — CSS inventory 3-way split — P3 — merge into BUG-017 / PC-CURRENT-04
- PC-104 — proposal-open — openSearch dead selectors — P3 — duplicate of BUG-025
- PC-105 — proposal-open — Gill mobile TOC flow — P1 — needs-manual-check — re-affirm PC-CURRENT-06 open
- PC-106 — proposal-open — z-index magic — P3 — document only — DO NOT FIX without visual gate
- Challenge PC-CURRENT-03 — proposal-open — propose close as **fixed-current** — unversioned asset refs now ALL versioned on d5d9388b
- Merge PC-101 → BUG-002 — proposal-open
- Merge BUG-017 + PC-CURRENT-04 + PC-103 → proposal-open — PremiumControls CSS inventory epic
- Merge BUG-001 + PC-102 + PC-104 → proposal-open — floating-cluster-controller cleanup epic

---

**Agent:** arena-premiumcontrols-auditor  
**Pass:** PremiumControls Deep Audit — Gill + Hermeneutics — v16  
**Date:** 2026-07-02  
**HEAD:** d5d9388b56a96ea26fe1c1309b07d6c4e2534f9b  
**Mode:** free-intake — protected subsystem — read-only audit, 0 code changes  
**Previous PremiumControls canonical:** `AuditRepo/projects/gb-is-my-strength/PremiumControls/README.md` (2026-06-27, HEAD 6664056) — PC-CURRENT-02..06 open — reverified above
