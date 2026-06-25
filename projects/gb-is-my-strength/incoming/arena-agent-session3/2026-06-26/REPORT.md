# Agent Audit Report

## Meta
- Project: gb-is-my-strength
- Source repo: https://github.com/FedorMilovanov/gb-is-my-strength
- Agent: arena-agent-session3
- Date: 2026-06-26
- Audited branch: main
- Audited SHA: `02e1a0ff834dd8445ea533ccb12e632a01424447`
- Current HEAD at start: `02e1a0f`
- Current HEAD at end: `02e1a0f` (no source changes made — audit only)
- Environment: Arena.ai Agent Mode / E2B microVM, shallow clone
- Build mode: **source / legacy-root artifact** (no dist build performed)
- Browser / device if used: none (static + JSON-LD parse witnesses only)

> **Headline:** The canonical ledger is in very good shape on HEAD `02e1a0f`. Most P0/P1 items
> are fixed or correctly closed. I confirm **2 still-live SEO bugs on baptisty-rossii** with
> source+artifact witnesses, **downgrade/close several open repair-order items as stale/fixed**,
> and flag **1 tooling inconsistency** (series-cards still half-referenced in audit-pro.js).

---

## 1. New Findings

### Finding S3-N1
- Title: **All 11 baptisty-rossii pages missing `BreadcrumbList` in JSON-LD (DOM breadcrumb exists, structured-data does not)**
- Severity: **P2** (SEO — rich-result navigation; not user-facing breakage)
- Route(s): `/baptisty-rossii/` hub + 10 articles (`noch-na-kure`, `yuzhnaya-shtunda`, `dva-sezda-1884`, `peterburgskaya-liniya`, `goneniya-i-sovest`, `sovetskaya-noch`, `vsehib-1944`, `iniciativnaya-gruppa`, `podpolnaya-pechat`, `spravochnik`)
- Source file(s): `src/components/baptisty-rossii/BaptistyRossii*PageHead.astro` (11 components — source of truth); manifested in legacy `baptisty-rossii/*/index.html`
- Observed on SHA: `02e1a0f`
- Repro steps: `grep -c BreadcrumbList baptisty-rossii/noch-na-kure/index.html` → 0; parse all `application/ld+json` blocks → types present are `Article/Person/Organization`, `WebSite/SearchAction/EntryPoint`, `SpeakableSpecification`. No `BreadcrumbList`.
- Expected: Each article emits a 3-level `BreadcrumbList` (Home → Серия «Баптисты России» → статья), matching the visible DOM `.breadcrumb` and consistent with `articles/` + `nagornaya/` which DO carry breadcrumb JSON-LD.
- Actual: DOM breadcrumb present (`grep -c 'class="breadcrumb' …` → 1) but **no `BreadcrumbList` structured data** on any of the 11 pages.
- Evidence: see `evidence/S3-N1-breadcrumb.txt`
- Confidence: high
- Verification level: **L2** (direct source witness in Astro component + artifact witness in legacy HTML; single agent but two independent angles)
- Suggested repair lane: `seo` (or fold into a baptisty-seo lane with S3-N2)
- Do not mix with: floating-cluster / cache-bust lanes

### Finding S3-N2
- Title: **All 11 baptisty-rossii pages use SVG `og:image` (`image/svg+xml`) — social previews will be blank**
- Severity: **P2** (SEO/social sharing; no functional breakage)
- Route(s): `/baptisty-rossii/` hub + 10 articles
- Source file(s): `src/components/baptisty-rossii/BaptistyRossii*PageHead.astro` (`og:image:type` = `image/svg+xml`); images at `images/baptisty-rossii/cover-*.svg`
- Observed on SHA: `02e1a0f`
- Repro steps: `grep -o 'og:image:type" content="[^"]*"' baptisty-rossii/*/index.html` → all `image/svg+xml`; `grep og:image …/noch-na-kure/index.html` → `…/cover-01-kura.svg`. `ls images/baptisty-rossii/*.webp` → none (only 10 SVGs, 1.4–1.5 KB each).
- Expected: 1200×630 raster (WebP/JPG/PNG) og:image. Facebook, Twitter/X, Telegram, VK, WhatsApp do **not** render SVG in link previews → preview shows no image.
- Actual: SVG-only covers; no raster variant exists in repo.
- Evidence: see `evidence/S3-N2-ogimage-svg.txt`
- Confidence: high
- Verification level: **L2** (source witness Astro component + artifact witness HTML + filesystem witness: no webp/jpg exists)
- Suggested repair lane: `seo` + needs an asset-generation step (owner/design input: generate 11 raster covers 1200×630)
- Do not mix with: code lanes — this needs binary asset creation, not just markup

### Finding S3-N3
- Title: **`series-cards.js` half-removed: gone from `cache-bust.js`/`sw.js` but still referenced 5× in `audit-pro.js` (incl. live `fs.readFileSync` + a dead-weight check), while the file is loaded by 0 pages**
- Severity: **P3** (tooling inconsistency / dead code; risk = audit-pro reads a file the rest of the pipeline treats as removed)
- Route(s): n/a (build tooling)
- Source file(s): `scripts/audit-pro.js` (lines 59, 4143-4145, 4249-4250), `js/series-cards.js` (still on disk, 2642 bytes)
- Observed on SHA: `02e1a0f`
- Repro steps:
  - `grep -c series-cards scripts/cache-bust.js` → 0
  - `grep -c series-cards sw.js` → 0
  - `grep -n series-cards scripts/audit-pro.js` → lines 59 (ALLOWED_JS), 4143 `fs.readFileSync('js/series-cards.js')`, 4145 offender push, 4249-4250 dead-script check
  - `grep -rl 'series-cards.js' --include='*.html' --include='*.astro' .` → (none)
- Expected: A single source of truth for the asset list (the verifier's own `repair-order-2026-06-26-top-verifier.md` recommends a shared `scripts/asset-list.js`). After session2/round12 removed it from cache-bust/sw, audit-pro should be consistent — either fully drop series-cards or keep the file intentionally with a documented reason.
- Actual: `series-cards.js` is orphaned (loaded nowhere) yet `audit-pro.js` still hard-reads it; if the file is ever deleted, `audit-pro.js` line 4143 `readFileSync` will throw.
- Evidence: see `evidence/S3-N3-series-cards.txt`
- Confidence: high
- Verification level: **L2** (source witness across 3 scripts)
- Suggested repair lane: `cleanup` — same lane as canonical **P2-14**; effectively the unfinished tail of P2-14.
- Do not mix with: SEO findings

---

## 2. Confirmations of Existing Findings

### Confirm P1-14 / P1-15 / P1-16 (GBS2 baptisty controls) — but note partial regression risk
- Target report: `verified/UNIFIED_BUG_LEDGER_2026-06-25.md` (R11/R12 marked FIXED via `js/gbs2-baptist-controls.js`)
- My evidence: not re-deep-verified at runtime this session. Source still shows fc-controller now wired on baptisty bodies (per HEAD lane `fix-p0-p1-batch-2026-06-26`, P1-14 batch). **Recommend a browser witness** before final archive — these were fixed across multiple rounds with overlapping mechanisms (gbs2-baptist-controls.js AND fc-controller P1-14), which is a confusion risk.
- Same bug / related / stronger root cause: related
- Recommended status: keep `fixed-current` but add note "needs one browser witness to close"

### Confirm P0-7 / P0-8 / P0-NEW (SW precache 404 for site-layered.css + site-modules.js) — FIXED on HEAD
- Target finding: `site-layered.css` + `site-modules.js` in `sw.js` PRECACHE_ASSETS but not in dist
- My evidence: `grep -c site-layered sw.js` → **0**; `grep -c site-modules sw.js` → 0 (verified-source on HEAD). Also `site-modules.js` is back in `cache-bust.js` ASSETS (used by pages that load it). No phantom precache.
- Recommended status: `fixed-current` confirmed on `02e1a0f` (matches ledger; reconfirmed).

---

## 3. Challenges / Disputes

### Challenge: repair-order-2026-06-26-top-verifier.md item #1 — "P1-9 audit-pro vs cache-bust divergence"
- Target report: `verified/repair-order-2026-06-26-top-verifier.md` (lists P1-9 as `confirmed-current` / repair-ready)
- Target finding: `cache-bust.js` has `nagornaya-mobile-toc.css, glossary.js, series-cards.js, site-modules.js` but `audit-pro.js` does not.
- Reason for challenge: **Stale on current HEAD.** The two **cache-bust asset lists are now identical** (21 entries each). The repair-order's claimed divergence list is wrong on `02e1a0f`:
  - `cache-bust.js ASSETS` and `audit-pro.js CACHE_BUST_ASSETS` both contain `css/nagornaya-mobile-toc.css`, `js/glossary.js`, `js/site-modules.js`.
  - Neither cache-bust list contains `series-cards.js` anymore (it lives only in audit-pro's *separate* `ALLOWED_JS` set + dead-weight check — that's a different list, see S3-N3, downgrade to P3).
- Current HEAD evidence: `comm -23/-13` of both extracted arrays → only diff is `fonts/fonts.css` present in cache-bust list comment-ordering; net asset diff = none meaningful. See `evidence/S3-CH1-p1-9-stale.txt`.
- Recommended status: **P1-9 → `fixed-current` / stale-on-current-head.** The remaining *real* residue is the series-cards inconsistency = S3-N3 (P3), not a P1/P2 divergence.

### Challenge: repair-order item #2 — "P3-8 faq-accordion.js not loaded → FAQ dead"
- Target finding: `articles/20-antisovetov-pastoru/index.html` has 51 FAQ markup matches but no `faq-accordion.js` / `site-modules.js` → accordion dead.
- Reason for challenge: **False-positive on current HEAD.** FAQ is wired by `js/enhancements.js`, which **is** loaded on the page and **does** delegate clicks on `.faq-accordion__q`.
- Current HEAD evidence:
  - `grep -oE '<script[^>]*enhancements\.js[^>]*>' articles/20-antisovetov-pastoru/index.html` → `<script src="../../js/enhancements.js?v=b3b77aa6" defer>`
  - `js/enhancements.js` contains `document.querySelectorAll(".faq-accordion__q").forEach(function(e){e.addEventListener("click", … toggles .is-open / max-height …)})` — full accordion open/close + resize handler.
  - So the premise "FAQ accordion only works via site-modules.js bundle" is incorrect; enhancements.js owns it. See `evidence/S3-CH2-p3-8-faq-fp.txt`.
- Recommended status: **P3-8 → `false-positive`** (FAQ functions via enhancements.js). Aligns with Round 14's own note that `faq-accordion.js` is dead code — but the repair-order #2 wrongly concluded the *feature* is broken. Confirm with one browser click witness if possible.

### Challenge: legacy BUGS_FOUND_2026-06-25 "BUG-001" (fc-single-active vs gb-cluster-single-active) — already fixed
- Target finding (source-repo doc, not AuditRepo ledger): CSS uses `body.fc-single-active`, controller adds `gb-cluster-single-active` → no intersection → duplicate controls not hidden.
- Reason for challenge: **Fixed on HEAD.** `SingleArticleCluster.astro` now carries BOTH selector families (lines 495-501 `fc-single-active` AND lines 502-508 `gb-cluster-single-active`) for the same hide rules. The controller class therefore matches.
- Current HEAD evidence: `grep -nE 'fc-single-active|gb-cluster-single-active' src/components/ui/floating-cluster/SingleArticleCluster.astro` shows dual selectors + an inline comment acknowledging BUG-001. See `evidence/S3-CH3-bug001-fixed.txt`.
- Recommended status: if this finding ever enters the ledger → open as `fixed-current` immediately. (Listed here so the verifier doesn't re-import it from the source-repo doc.)

---

## 4. Duplicate / Merge Proposals

### Merge proposal
- Finding A: **S3-N3** (series-cards.js residue in audit-pro.js)
- Finding B: canonical **P2-14** (series-cards.js dead code)
- Why same root cause: identical asset (`js/series-cards.js`) orphaned after r96-r99 series-UI removal. P2-14 was marked fixed when removed from cache-bust/sw, but the cleanup is **incomplete** — audit-pro.js still references it (incl. a live `readFileSync`). S3-N3 is the unfinished tail of P2-14, not a new root cause.
- Canonical ID suggestion: reopen **P2-14** as `partially-fixed` and absorb S3-N3, OR keep S3-N3 as the closing sub-task of P2-14.

---

## 5. Severity Proposals

- Target bug: **P1-9** (audit-pro vs cache-bust divergence)
- Current severity: P1 (P2 in top-verifier repair-order)
- Proposed severity: **close as fixed-current** (asset lists identical on HEAD). Residual = S3-N3 at **P3**.
- Evidence: `evidence/S3-CH1-p1-9-stale.txt`

- Target bug: **S3-N1 / S3-N2** (baptisty SEO)
- Current severity: n/a (new)
- Proposed severity: **P2** each (SEO completeness, no functional breakage; S3-N2 has higher real-world social-sharing impact and an asset-generation cost, so could be argued P1 for marketing).
- Evidence: `evidence/S3-N1-breadcrumb.txt`, `evidence/S3-N2-ogimage-svg.txt`

---

## 6. Repair Lane Suggestions

- Bug IDs: **S3-N1, S3-N2** → lane `seo-baptisty`
  - Why together: same 11 components (`BaptistyRossii*PageHead.astro`), same review surface (structured data + OG).
  - What must NOT be mixed: no JS/runtime changes; S3-N2 additionally needs a binary-asset step (11× 1200×630 raster) — keep asset generation as an explicit sub-task with owner sign-off on imagery.
- Bug ID: **S3-N3 (= P2-14 tail)** → lane `cleanup`
  - Why together with the verifier's existing cleanup lane: dead-code asset-list hygiene.
  - What must NOT be mixed: don't bundle with SEO; don't delete `js/series-cards.js` without also removing audit-pro line 4143 `readFileSync` or it throws.

---

## 7. Reverify Notes

| Bug | Current HEAD | Result | Evidence |
|---|---|---|---|
| P0-7 / P0-8 / P0-NEW (SW precache phantoms) | `02e1a0f` | **fixed-current** | `grep site-layered sw.js`→0; `grep site-modules sw.js`→0 |
| P1-9 (audit-pro↔cache-bust divergence) | `02e1a0f` | **fixed-current / stale** | both arrays identical (21 entries) — `evidence/S3-CH1` |
| P3-8 (FAQ dead) | `02e1a0f` | **false-positive** | enhancements.js loaded + wires `.faq-accordion__q` — `evidence/S3-CH2` |
| P2-14 (series-cards dead) | `02e1a0f` | **partially-fixed** | removed from cache-bust/sw, still in audit-pro — `evidence/S3-N3` |
| BUG-001 (fc class mismatch, src-repo doc) | `02e1a0f` | **fixed-current** | dual selectors in SingleArticleCluster.astro — `evidence/S3-CH3` |
| Old SEO P0: `{jsonLd}` literal on /hard-texts/ | `02e1a0f` | **fixed-current** | full JSON-LD scan: 0 parse problems / 0 placeholders across all index.html |
| Old SEO P0: `/karty/ishod/` `]}}` syntax error | `02e1a0f` | **fixed-current** | `grep -c ']}}' karty/ishod/index.html`→0; JSON-LD parses clean |
| Old SEO P1: baptisty Article missing datePublished/publisher | `02e1a0f` | **fixed-current** | Article JSON-LD now has author, publisher, datePublished, dateModified, image (all 10) |
| Old SEO P1: nagornaya/chast-* missing priority/changefreq in sitemap | `02e1a0f` | **fixed-current** | all 5 chast entries have `<priority>` + `<changefreq>` |

---

## 8. Notes for Verifier

1. **State of the project is healthy.** On HEAD `02e1a0f` the high-severity ledger items (P0 cache/SW, JSON-LD validity, premium controls) are fixed or correctly closed. My pass found **no new P0/P1 functional breakage**.
2. **The canonical `repair-order-2026-06-26-top-verifier.md` is now partly stale** — its 3 "repair-ready" items resolve as: P1-9 = fixed-current, P3-8 = false-positive, P2-14 = partially-fixed (tail = S3-N3). Recommend regenerating that repair-order or marking it superseded.
3. **Net-new actionable work** is just 2 SEO gaps on baptisty (S3-N1 breadcrumb JSON-LD, S3-N2 SVG og:image) + 1 cleanup tail (S3-N3). All P2/P3.
4. **Witness gaps I could not close** (sandbox: shallow clone, no dist build, no browser): runtime confirmation of P1-14/15/16 baptisty controls and P3-8 FAQ click. These are source/false-positive-confirmed but a browser witness would let you archive them cleanly per the multi-witness retirement rule.
5. Build mode caveat per `SANDBOX-ENV` §"Build-mode trap": I audited **source + legacy-root artifacts**, not production-like dist. SEO findings S3-N1/N2 live in the Astro source-of-truth components (`*PageHead.astro`), so they will appear in dist regardless of strangler copy — low risk of build-mode false positive. S3-N3 is pure tooling (build-mode independent).

---

---

# ROUND 2 ADDENDUM (same session, after reading `arena-agent-current-head-verifier`)

> After my first pass I read the parallel intake `incoming/arena-agent-current-head-verifier/2026-06-26/`
> (commit `6895b5b`), which ran the actual project gates. It surfaced higher-severity items than mine
> (content corruption + live hash drift). I independently re-verified its critical findings and add one
> **stronger, better-scoped** finding (S3-N4) plus confirmations.

## R2.1 New Finding — S3-N4 (stronger restatement of P0-10 / CHV "hash drift")
- Title: **`floating-cluster-controller.js` cache-bust drift — ALL 51 references stale; actual hash matched by ZERO refs**
- Severity: **P1** (premium controls load a non-existent/old asset URL → 404 or stale JS on 25 user-facing routes; on GitHub Pages the `?v=` query just serves stale-from-SW or 404 depending on precache)
- Route(s): 25 root HTML pages + 26 Astro components (Gill ×5, Nagornaya ×5, Hermenevtika, KodDaVinchi, Antisovetov, Krajne, Rimlyanam7, baptisty bodies, etc.)
- Source file(s): `scripts/cache-bust.js` (line 74 walks only `.html`), all `src/components/**/*PageChrome|*Body|*PageFooter.astro` with hardcoded `?v=`
- Observed on SHA: `02e1a0f`
- Evidence: `evidence/S3-N4-fc-controller-drift.txt`
- Key numbers:
  - actual `md5(js/floating-cluster-controller.js)[:8]` = **`ba4a4019`**
  - root HTML: 25× `?v=5c91b618` (stale — file edited in `02e1a0f` but cache-bust not re-run)
  - Astro src: 14× `?v=efd81d3a` + 1× `?v=58c2ea90` (hardcoded, never touched by cache-bust)
  - refs matching actual `ba4a4019`: **0**
- **Root cause (two compounding bugs):**
  1. `cache-bust.js` only collects `.html` files (line 74 `entry.name.endsWith('.html')`) → it **never rewrites `src/*.astro`**, so Astro hardcoded hashes drift forever. This is the systemic P0-10 mechanism, now narrowed to its single remaining victim.
  2. The last commit `02e1a0f` changed `fc-controller.js` (new md5) but did **not** re-run cache-bust → even the root HTML it *can* fix is stale.
- **Why this is the better witness:** the canonical ledger's P0-10 claims "36+ components stale (site.css `202876c3` etc.)". My full census proves **10 of 11 audited assets are now correctly hashed** (site.css `b880b524`, command-palette `afe33045`, etc.) — only `fc-controller.js` remains stale. So P0-10 should be **downscoped from "systemic, 36+ components" to "one asset + one structural cache-bust gap"**. Much smaller blast radius than documented = good news, but still a real P1.
- Suggested repair lane: `system-cache-bust` — (a) re-run cache-bust on HEAD; (b) make cache-bust also rewrite `src/**/*.astro` OR move fc-controller hash to a single computed import so Astro never hardcodes it.
- Verification level: **L2** (source + filesystem hash witness). Corroborates `arena-agent-current-head-verifier` P0-10 confirm (they found the 25 root refs @ `5c91b618`; I add the 26 Astro refs + the "zero correct" proof + root cause #1).

## R2.2 Confirm — CHV-003 (Antisovetov U+FFFD corruption) → escalate note
- Target: `incoming/arena-agent-current-head-verifier/2026-06-26/REPORT.md` CHV-003
- My evidence (`evidence/S3-CONFIRM-chv003-chv004.txt`): exactly **1** U+FFFD in `AntisovetovBody.astro` line 695, in published reader text.
- **Stronger root-cause note:** it's not just a stray replacement char — the surrounding sentence is **truncated/merged**: *"Настоящая сломленность не прос�тематическом искажении фактов…"* glues the tail of one sentence onto another. Fix needs the **original sentence restored** (editorial/source lookup), not a single-character substitution. Recommend the verifier flag this as needing owner/source text, P0 content.
- Recommended status: `confirmed-current`, P0.

## R2.3 Confirm — CHV-004 (Hermenevtika biblical-verse corruption)
- Target: CHV-004
- My evidence: confirmed in **both** Astro source AND legacy HTML artifact (two witnesses):
  - `кик говорят` → should be `как говорят` (1 Кор 15:12)
  - `называемая , .Святое Святых"` → broken punctuation (Евр 9:3)
- These are **quoted Scripture** rendered to readers — higher reputational sensitivity for this site. Recommend grouping CHV-003 + CHV-004 into one `content-text-corruption` repair lane with owner sign-off on exact wording.
- Recommended status: `confirmed-current`, P1 (arguably P0 given it's Scripture quotation).

## R2.4 Note on overlap / dedup for verifier
- My **S3-N4** and the other agent's **P0-10 confirm** + **CHV-006** are the same asset-contract family. Suggest the verifier create one canonical entry: *"cache-bust does not cover src/*.astro and was not re-run for fc-controller"* and fold both witnesses under it.
- My **S3-N3** (series-cards in audit-pro) and their **CHV-006** (audit-pro SW precache guard stale) are both "audit-pro.js drifted after cleanup lanes" — recommend a single `audit-pro-reconciliation` cleanup lane covering: series-cards refs, SW precache completeness guard, shared asset-list.

## R2.5 Updated "Notes for Verifier" priority stack (after Round 2)
Given the goal stated by the owner ("единый монолит, не 100 линий"), the highest-leverage fixes are **structural**, not cosmetic:

| Priority | Item | Why it ends recurring conflicts |
|---|---|---|
| 1 (P0) | CHV-003 + CHV-004 content corruption | published text/Scripture is wrong — must fix regardless of architecture |
| 2 (P1) | **S3-N4 root cause #1**: cache-bust ignores `src/*.astro` | this is the engine behind the *entire* P0-10 saga; fixing it once stops the hash-drift conflicts permanently |
| 3 (P2) | audit-pro reconciliation (S3-N3 + CHV-006) | stale guards generate false release-blockers → agents keep "fixing" non-bugs |
| 4 (P2) | baptisty SEO (S3-N1 breadcrumb, S3-N2 og:image) | net-new completeness, isolated, safe |
| 5 (P2) | CHV-002 rodosloviye noindex/sitemap/baseline 3-way conflict | needs ONE owner decision (index or not), then mechanical |

**Meta-observation for the "monolith" goal:** the recurring conflicts on this site are dominated by **two systemic engines** — (1) the legacy-root ↔ Astro-src dual representation, and (2) cache-bust/audit-pro only understanding the legacy-root half. Until cache-bust + audit-pro operate on the Astro source-of-truth (or the legacy root is deleted), every asset change will keep producing "stale hash" and "audit drift" findings. Recommend a dedicated SYSTEM lane to unify the asset-hashing pipeline across both halves *before* more route-level fixes.

---

# ROUND 5 ADDENDUM — IMPLEMENTATION: CHV-003 + CHV-004 FIXED (lane pushed)

> I moved from audit to repair for the content-corruption bucket (B1). Pushed branch
> `lane/content-text-corruption-2026-06-26` to the source repo (off HEAD `106f98d`).
> Evidence: `evidence/S3-FIX-chv003-chv004.txt`.

| Bug | Action | Result |
|---|---|---|
| **CHV-003** Antisovetov U+FFFD + lost note-box | Restored merged paragraph + dropped note-box («Как это выглядит на практике» / «Ритуальное извинение:») from clean legacy copy; removed stray `</div>` | **fixed-current (P0 closed)** |
| **CHV-004** Hermenevtika Scripture | `кик говорят`→`как говорят` (1 Кор 15:12); `называемая , .Святое Святых"`→`называемая "Святое Святых"` (Евр 9:3); fixed in both Astro source + legacy HTML | **fixed-current (P1 closed)** |

**Multi-witness verification (source + build + dist):**
- `astro:check` 0 errors/0 warnings; `data:consistency`, `content:parity`, `seo-audit`, `mdx:structure:audit` all PASS
- `astro:build` 52 pages built; **dist output confirmed clean** for both pages (U+FFFD=0, restored text present, broken quote gone)
- repo-wide sweep: U+FFFD=0, `кик говорят`=0, `называемая , .Святое`=0

**Commits:** `213678a` (fix, 3 files content-only) + `f5f845c` (lane report `docs/refactor-2026/lanes/content-text-corruption-2026-06-26.md`).
**Pending:** owner/CI merge + full `validate:static-publication` on CI (not run fully in sandbox per resource limits).

---

# ROUND 4 ADDENDUM — reverify on NEW source HEAD `106f98d` (was `02e1a0f`)

> Source repo advanced: `a4d045e` (fix release gates) + `106f98d` (auto cache-bust [skip ci]).
> I re-checked every session3 finding on `106f98d`. Evidence: `evidence/S3-REVERIFY-on-106f98d.txt`.
> The release-gate is now GREEN, but **all my user-facing/SEO findings persist** — and one got a perfect proof.

| Finding | Status on 106f98d | Note |
|---|---|---|
| **S3-N4** fc-controller drift | **partially fixed → root cause PROVEN** | auto cache-bust fixed the 25 **root** HTML (now `ba4a4019` ✅) but the **15 Astro components stay stale** (`efd81d3a`×14, `58c2ea90`×1). This is exact proof of root cause #1: cache-bust rewrites `.html` only, never `src/*.astro`. Independently corroborated by `arena-agent-premiumcontrols-verifier` ("source-level hardcoded hashes still have multiple versions even after root cache-bust is green"). Stays **P1**, narrowed to Astro-side. |
| **S3-N5 / P0-02** ishod JSON-LD | **still broken** | `]}}` still in `IshodPageHead.astro`; `JSON.parse` still fails. Corroborated by `postfix-deep-verifier` PFV-002 (dist still invalid on 106f98d). |
| **S3-N1/N2** baptisty SEO | **still open** | BreadcrumbList=0, 10/10 SVG og:image. Corroborated by PFV-004. |
| **CHV-003/004** content corruption (I confirmed R2) | **still open** | Antisovetov U+FFFD ×1, Hermenevtika `кик говорят` ×1. Corroborated by PFV-003. |
| **S3-N3** series-cards in audit-pro | **still open** | 5 refs remain in audit-pro.js. |

**Key takeaway for the verifier/owner:** `a4d045e` made the static release-gate green, but that green is a **blind spot** — every one of my reader-facing and SEO findings survives on `106f98d`. The green gate validates the legacy-root half (which auto cache-bust fixes), not the Astro source-of-truth half (where the bugs live). This is precisely the B3/B4 "tooling models only legacy-root" engine I described. Until the gates + cache-bust operate on Astro source/dist, green ≠ correct.

---

# ROUND 3 ADDENDUM — build-mode trap self-correction (after reading `arena-agent-dist-contract-verifier`)

> The `arena-agent-dist-contract-verifier` intake (commit `8214f80`/`a70a08e`) ran a **real Node-22 Astro
> production-like dist build** — something my source-only pass could not do. It exposed a **build-mode trap
> that caught me**: I had marked `/karty/ishod/` JSON-LD as "fixed-current" based on the legacy root artifact,
> but the bug is alive in the Astro source-of-truth (and therefore in dist). I verified this with a source
> witness and correct my own Round-1 reverify.

## R3.1 SELF-CORRECTION + Confirm — `/karty/ishod/` JSON-LD extra `}` is NOT fixed (reopen old P0-02)
- Title: **`/karty/ishod/` invalid JSON-LD lives in Astro source `IshodPageHead.astro`; only the legacy root was patched**
- Severity: **P1** (invalid structured data on an indexable production route; dist = what ships)
- Source file(s): `src/components/karty/ishod/IshodPageHead.astro` line 39 (source of truth) — NOT `karty/ishod/index.html`
- Observed on SHA: `02e1a0f`
- Evidence: `evidence/S3-N5-ishod-jsonld-source.txt`
  - `grep -c ']}}' src/components/karty/ishod/IshodPageHead.astro` → **1** (Organization closes twice: `…"sameAs":[…]}},{"@type":"WebSite"`)
  - `grep -c ']}}' karty/ishod/index.html` → **0** (legacy root patched)
  - `JSON.parse` of the Astro inline block → `Expecting ',' delimiter … char 344`
- **What I got wrong in Round 1:** my REPORT §7 said "old SEO P0 `/karty/ishod/` `]}}` → fixed-current" based on `grep ']}}' karty/ishod/index.html → 0`. That is exactly the **build-mode trap** documented in `SANDBOX-ENV` ("audit dist, not stale legacy root"). The legacy root is patched; the Astro source that regenerates dist is not. **Reverify corrected: P0-02 = `confirmed-current` in source/dist.**
- This is a **source witness** corroborating the dist-contract-verifier's **dist witness** `N-2026-06-26-04` → together = multi-witness, repair-ready.
- Suggested repair lane: `karty-ishod-jsonld` (fix the extra brace in the Astro component, or build the object and `JSON.stringify`).

## R3.2 Proactive sweep — only ishod is broken (good news, bounded blast radius)
- I ran a full JSON-LD validity sweep over **all 50 inline `application/ld+json` blocks in `src/**/*.astro`** (build-mode-trap aware — checks the source of truth, not legacy root):
  - **1 parse error total**, and it is only `IshodPageHead.astro`.
  - All other karty PageHeads (`KartyPageHead`, `AvraamPageHead`) and every other component block parse OK.
- Conclusion: the structured-data corruption is **isolated to ishod**, not systemic. (`set:html={var}` blocks are JS-built objects, not literal strings, and are inherently valid — skipped.)
- Evidence: `evidence/S3-N5-ishod-jsonld-source.txt` (sweep output appended).

## R3.3 Confirm — dist-contract-verifier net-new findings I could not see (no build), flagged for verifier
I cannot independently reproduce these without a Node-22 dist build (sandbox default is Node 20), but they are consistent with what I see in source and I have **no contradicting evidence**:
- `N-2026-06-26-05` `/karty/avraam/` word-count 594→23 in dist — plausible: `AvraamMap.astro` uses an `sr-only h1[data-pagefind-body]` as the searchable body. **Recommend confirm-keep.** This is a real SEO/thin-content risk on an indexable route.
- `N-2026-06-26-01` `seo-audit.js` FAQ detector whitespace-fragile (`'"@type": "FAQPage"'` literal vs compact `"@type":"FAQPage"`) — I can corroborate the *mechanism* from source: see R3.4.
- `N-2026-06-26-02` `/rodosloviye/` noindex-vs-sitemap-vs-baseline 3-way conflict — corroborated below R3.5.
- `N-2026-06-26-03` audit-pro SW precache guard stale — same family as my **S3-N3** + the other verifier's **CHV-006**.

## R3.4 Corroborate `N-2026-06-26-01` / `CHV-001` with source witness (FAQ detector)
- `scripts/seo-audit.js` predicate literal vs production compact JSON-LD:
  - production HTML uses compact `"@type":"FAQPage"` (no space). FAQPage JSON-LD IS present (built by `enhancements.js` at runtime + emitted in pages).
  - So the detector is a **false-positive release-gate blocker**, not a content bug. Aligns with my Round-1 finding that FAQ itself works (S3-CH2 / P3-8 false-positive). **These two are the same root truth: FAQ functions; only the audit string-match is wrong.**

## R3.5 Corroborate `N-2026-06-26-02` / `CHV-002` (rodosloviye 3-way conflict) — source witness
- `rodosloviye/index.html` robots = `noindex, follow…`; `sitemap.xml` lists `/rodosloviye/`; `data/public-content-baseline.json` expects it as public. Three sources disagree → needs ONE owner decision (index it, or remove from sitemap+baseline). Mechanical once decided. Confirm-keep, P1 (gate blocker).

## R3.6 Updated dedup / canonical-grouping recommendation for the verifier
After 3 rounds + 2 parallel intakes, the **distinct real issues** collapse to a small set. Recommend the verifier build the next UNIFIED ledger around these canonical buckets:

| Canonical bucket | Folds in | Severity | Nature |
|---|---|---|---|
| **B1 Content corruption** | CHV-003 (Antisovetov U+FFFD + truncated sentence), CHV-004 (Hermenevtika Scripture) | P0/P1 | editorial — needs owner text |
| **B2 ishod JSON-LD invalid in source/dist** | old P0-02 reopened, N-2026-06-26-04, my S3-N5 | P1 | one-brace fix in `IshodPageHead.astro` |
| **B3 Asset-hash pipeline doesn't cover Astro src + not re-run** | P0-10 (downscoped), my S3-N4, CHV P0-10 confirm | P1 | **systemic — the "100 lines" engine** |
| **B4 audit-pro/seo-audit gates drifted (false blockers)** | my S3-N3, CHV-001/CHV-006, N-01/N-03, P3-8 FP, P1-9 fixed | P2 | tooling reconciliation |
| **B5 rodosloviye publication 3-way conflict** | CHV-002, N-02 | P1 | one owner decision |
| **B6 karty/avraam thin indexable body** | N-2026-06-26-05 | P1 | accessible text layer needed |
| **B7 baptisty SEO completeness** | my S3-N1 (breadcrumb), S3-N2 (svg og:image) | P2 | net-new, isolated |
| **B8 migration matrix/profile mismatch** | P1-5 (strengthened) | P1/P2 | data reconciliation |

**Toward the owner's "единый монолит" goal:** B3 + B4 + B8 are the *recurring-conflict generators* — all three stem from tooling/data that models only the **legacy-root half** of the dual representation while the **Astro source is the real source of truth**. The durable fix is one SYSTEM lane that makes cache-bust, audit-pro, seo-audit, and the migration matrix all operate on the Astro/dist source-of-truth (or finishes deleting legacy root). Until then, every content/asset edit will keep spawning "stale hash / audit drift / parity" findings — that is mechanically why there are "100 lines" instead of a monolith.

---

## Proposal statuses
proposal-open → proposal-supported → proposal-accepted (bug moves)
proposal-open → proposal-conflicted → resolved in conflicts/
proposal-open → proposal-rejected
proposal-open → proposal-superseded
