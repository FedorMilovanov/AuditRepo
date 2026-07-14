# CURRENT HEAD REVERIFY — 2026-07-14 @ `2ca2af3b`

## Project
- Project: gb-is-my-strength (gospod-bog.ru)
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Current source HEAD SHA: **`2ca2af3b`** (`merge: Библейский атлас — карта Авраама`, 2026-07-14T13:54:18Z)
- Canon HEAD of record (before this reverify): **`b8459bdf`** (2026-07-10, = PR#71)
- Date: 2026-07-14
- Verifier: arena-auditor-meta-governance (Arena.ai Agent Mode)
- Witness angles: `verified-source` + `verified-build-tooling` (local gate reproduction, Node v22.22.3, `npm ci`) + `verified-ci` (GitHub Actions run status via API)

## Why this reverify exists
Owner note: *"много пушей и MERGE был, актуализируй прошлые анализы"*. Confirmed by API:
the source repo was last pushed **2026-07-14T14:03Z** while the AuditRepo canon (matrix
masthead + `NEXT_AGENT_PROMPT.md`) was still frozen at `b8459bdf` / deploy GREEN run
`29065454930` from **2026-07-10**. The prior analyses are therefore **stale**.

### Delta magnitude (`gh api compare b8459bdf...2ca2af3b`)
- **287 commits ahead**, **300 files changed**, `status=ahead`, `behind_by=0`.
- Merged PRs since canon: **#72, #73, #74, #75, #76, #77, #78, #80, #81, #82, #83, #84,
  #85, #86, #87, #88** (mobile-chrome shell + Gill/Hermenevtika readers, TTS RU-voice,
  gill quiz CBM) **plus two non-PR merges**: `0aee6171` (genealogy «Библейский атлас
  родословий» — course, engines, data) and `2ca2af3b` (Авраам map).
- Largest additions: `audit/atlas-preview/*.html` (12 sheet pages, ~1000 lines each) and
  the genealogy build pipeline `scripts/genealogy-build/**`.

---

## 🔴 HEADLINE: production deploy is RED on live HEAD (canon says GREEN — STALE)

Canon masthead: *"Deploy ✅ GREEN — run 29065454930 @ b8459bdf, 0 failed steps."*
**Live truth (2026-07-14):** the last content merges do **not** deploy. Three workflows
fail on `2ca2af3b` (and on the prior merge `0aee6171`):

| Workflow | Failing step | CI run |
|---|---|---|
| Deploy to GitHub Pages | **Static publication gates** | `29338523013` (failure) |
| Metadata & IndexNow Readiness | **Validate registry structure** | `29338522715` (failure) |
| Visual Parity Guard — pixel-diff | Run pixel-diff screenshots | `29338522526` (failure) |

Last GREEN deploy of record remains `b8459bdf` → **production is stale-locked at the
2026-07-10 HEAD**; genealogy/atlas + mobile-reader work (PR#72–#88) is **not live**.
(CI blob-log download was throttling out; root causes below were reproduced **locally**
against a fresh clone of `2ca2af3b`, which is stronger evidence than log scraping.)

### Root cause A — `validate:strict` chokes on genealogy build templates (deploy blocker)
- **`REG-VALIDATE-GENEALOGY-TEMPLATE` (new, P1 deploy-blocking regression)**
- `node scripts/validate.js --strict` → **EXIT 1**, 2 errors:
  ```
  ❌ [scripts/genealogy-build/atlas-template.html] inline <script> syntax error (#1): Unexpected token ';'
  ❌ [scripts/genealogy-build/interactive-template.html] inline <script> syntax error (#1): Unexpected token ';'
  ```
- Mechanism (witness triad): the two files are **build-time templates** with placeholders
  substituted at build (`build-atlas.mjs:156` → `tpl.replace('/*__ATLAS__*/', JSON.stringify(scene))`;
  same for `/*__GRAPH__*/`). As raw source, `const ATLAS=/*__ATLAS__*/;` reduces to
  `const ATLAS=;` → genuinely invalid JS. They are **never served** (only consumed by the
  build). But `validate.js` `walkHtmlFiles()` (line 467) recurses from repo ROOT with a
  skip-set (`.git,node_modules,dist,build,...`) that **does not exclude `scripts/`**, so it
  lint-checks build inputs as if they were pages.
- `validate:strict` is inside `validate:all` → `validate:static-publication` → the deploy
  job's *Static publication gates* step (`deploy.yml:97`). One EXIT 1 fails the whole deploy.
- **Repair options** (owner/impl decision, release-transaction lane): (a) add `scripts/` (or
  specifically `scripts/genealogy-build/`) to the `validate.js` walk skip-set; or (b) skip
  `<script>` bodies containing build placeholders (`/*__…__*/`); or (c) move templates to a
  `*.tpl.html`/`_build-tools/` name the walkers already ignore. Same drift also trips
  `audit-pro.js` (lang/canonical/charset/inline-script on the same 2 files — its `skipDirs`
  ignores `audit/` but not `scripts/`).

### Root cause B — 5 new routes missing editorial-metadata records (readiness blocker)
- **`REG-EDITORIAL-METADATA-MISSING` (new, P1 deploy-blocking regression)**
- `node scripts/editorial-metadata-registry.js --check` → 5 errors (Eligible 25 / Records 20):
  ```
  /articles/dzhon-gill-chast-4-ekzeget/: metadata record missing
  /articles/chto-bibliya-nazyvaet-serdcem/: metadata record missing
  /articles/novoe-serdce/: metadata record missing
  /articles/serdce-i-duh/: metadata record missing
  /articles/serdce-spravochnik/: metadata record missing
  ```
- Mechanism: new content (Gill Part IV + «Сердце» series articles landed 2026-07-13/14) was
  published without appending records to the editorial-metadata registry. This is the
  *Validate registry structure* step in `Metadata & IndexNow Readiness` → and because
  `deploy.yml` deploys via `workflow_run` on that workflow's `conclusion == 'success'`, a red
  readiness workflow also blocks the content-push deploy path.
- Repair: add the 5 editorial-metadata records (dates/author) for the new routes.

### Root cause C — site-wide cache-bust drift (audit-pro, systemic — predicted 2026-07-11)
- **`CACHE-BUST-NO-WRITER` (confirms the owner's 2026-07-11 follow-up prediction)**
- `audit-pro.js` reports **114 errors**; the dominant class is `Cache-bust mismatch` across
  `nagornaya/**`, `rodosloviye/`, `pastor-series/`, `karty/` (`?v=` hashes stale vs source).
- Reproduced fix: `node scripts/cache-bust.js --write` regenerates **82 files** and drops
  cache-bust mismatches to **0**. No workflow runs `cache-bust --write`+commit (indexnow &
  editorial-metadata only *check*; deploy's cache-bust step is a no-op "skip if IndexNow did
  it"), so every concurrent asset-touching push leaves main red for everyone — exactly the
  systemic finding logged on 2026-07-11 (`9fce2bc`). It has **recurred**.

### Also failing in the audit-pro cluster (all in the static-publication chain)
- Base-path leaks in **new** files: `docs/ATLAS-CONTRACT-2026-07-10.md`,
  `scripts/genealogy-build/README.md` (contain `AuditRepo/projects/gb-is-my-strength/…`).
- Orphan images: 38 files / ~1605 KB in `/images/` (incl. `atlas-*-scene-1200w.webp`).
- Forbidden JS: `js/nagornaya-bar-extras.js` not in `ALLOWED_JS` allowlist (`audit-pro.js:52`).
- Oversized raw images; a `css/site.css !important` ratchet regression.

---

## 🔬 SECOND-PASS DEEPENING (2026-07-14, real production-like build + wider gate sweep)

> Owner: *"анализируй глубже"*. This pass added a **real artifact witness** (`strangler:build:production-like`
> completed, 58 pages / dist produced, `npm run …` EXIT 0) and swept the full `audit-pro`/`css:layer`
> gate surface. Source HEAD re-confirmed unchanged at `2ca2af3b`; Node v22.22.3 (≥ SANDBOX 22.12 req).

### W2 artifact witness strengthens Root cause A (it is a TOOLING-scope bug, not a real defect)
- The production-like build emits **0 files** from `scripts/genealogy-build/` into `dist/`
  (`find dist -path '*genealogy-build*'` = 0), and the real atlas page `dist/rodosloviye/index.html`
  builds with **8 inline scripts, 0 syntax errors**. So `validate.js`/`audit-pro.js` failing on the
  two build templates is confirmed **audit-drift**, not a served defect.
- **Proven fix (Root cause A):** replicating the walker with `scripts/genealogy-build` skipped →
  inline-script errors drop from 2 to **0**. **Proven fix (Root cause C):** `cache-bust.js --write`
  → mismatches **0** (82 files touched). Both fixes verified locally.
- Correction to the count above: on this fresh clone `audit-pro.js` = **114→ (cache-bust now 103
  mismatches)**; the number is volatile per concurrent asset pushes — the *class* is stable.

### Three ADDITIONAL deploy blockers found this pass (all in `validate:static-publication`)
- **`GATE-CSS-IMPORTANT-RATCHET` (new, P2 deploy-blocking).** `css/site.css` now has **210
  `!important` > ceiling 200** (`audit-pro.js` `IMPORTANT_CEIL`) — AND the separate gate
  `npm run css:layer:validate` (`--ceiling=202`) also fails: `❌ !important count 210 exceeds
  ceiling 202`. A genuine regression from the atlas/mobile-reader CSS work (not tooling drift).
  Repair: refactor the added rules into `@layer`/higher specificity, or (owner-gated) raise ceiling.
- **`AUDIT-ATLAS-DOC-PATH-LEAK` (new, P3 deploy-blocking).** `audit-pro.js` §14 fails on repository
  base-path leaks in two **new** atlas files: `docs/ATLAS-CONTRACT-2026-07-10.md` and
  `scripts/genealogy-build/README.md` (both embed `AuditRepo/projects/gb-is-my-strength/…`).
  Repair: replace with a repo-relative or generic reference (same class as D-7).
- **`AUDIT-FORBIDDEN-JS-NAGORNAYA` (new, P3 — allowlist gap, NOT dead code).** `audit-pro.js`
  flags `js/nagornaya-bar-extras.js` as a forbidden JS file, but it is **genuinely used** by all 5
  `nagornaya/chast-*` pages (confirmed in `dist/nagornaya/chast-*/index.html` and the
  `NagornayaChast*PageFooter.astro` sources). So the file is legitimate — the fix is to add it to
  `ALLOWED_JS` (`audit-pro.js:52`), not to delete it. (Distinguished from a false positive: the
  gate is correctly *firing*, the *allowlist* is stale.)

### Nuance logged (avoid a false positive on orphan images)
- The 38 "orphan" images include `atlas-*-scene-1200w.webp`, which **are** referenced — but only
  by `audit/atlas-preview/*.html`, a directory `audit-pro.js` deliberately excludes from its walk
  (`skipDirs` has `audit`). So they read as orphaned to the walker while being real preview assets.
  Not raised as a standalone bug; noted for the verifier as measurement scope, not waste.

### Deploy-blocker inventory (consolidated — 6 distinct classes)
| # | ID | Class | Gate | Fix proven? |
|---|---|---|---|---|
| A | REG-VALIDATE-GENEALOGY-TEMPLATE | tooling scope | validate:strict | ✅ skip `scripts/genealogy-build` → 0 |
| B | REG-EDITORIAL-METADATA-MISSING | content/registry | editorial-metadata --check | add 5 records |
| C | CACHE-BUST-NO-WRITER | systemic pipeline | audit-pro cache-bust | ✅ `cache-bust --write` → 0 |
| D | GATE-CSS-IMPORTANT-RATCHET | real CSS regression | audit-pro + css:layer | refactor / owner ceiling |
| E | AUDIT-ATLAS-DOC-PATH-LEAK | doc hygiene | audit-pro §14 | strip repo path (×2 files) |
| F | AUDIT-FORBIDDEN-JS-NAGORNAYA | allowlist gap | audit-pro ALLOWED_JS | register js file |

All six are in the **source repo** (owner-gated release transaction W1); I did **not** modify source.

### 🟣 AR-CI-RED — AuditRepo's OWN CI was red on `main` (concurrent-agent governance defect) — FIXED
- On sync, `origin/main` was **581 commits ahead** (concurrent agents' atlas verification work) but
  had **broken `validate_audit_repo.py`** — i.e. AuditRepo's own CI (`auditrepo-validate.yml`) was red:
  1. stray root `DEBT-REGISTER.md` (not in `ALLOWED_ROOT_MD`);
  2. intake `claude-atlas-deep-audit/2026-07-10/` missing required `README.md`/`REPORT.md`
     (had `ATLAS_DEEP_AUDIT_AND_MASTER_PLAN.md` + `DEBT-REGISTER.md` but neither named right);
  3. intake `claude-genealogy-atlas-strategy/2026-07-14-milestone-atlas-v1/` — invalid date-folder
     name (regex allows only `YYYY-MM-DD[-rN]`).
- **Repaired minimally & non-destructively** (respecting CLEANUP §7 — no intake content deleted):
  (1) `git mv DEBT-REGISTER.md → working/DEBT-REGISTER.md` (root-hygiene, outside any intake);
  (2) **added** an index `README.md` to the 2026-07-10 intake pointing at its existing files;
  (3) `git mv …/2026-07-14-milestone-atlas-v1 → …/2026-07-14-r1` + a preservation note + index
  `README.md` (original label retained in `MILESTONE.md` title). After: **both validators PASS**.
- Lesson for concurrent agents: run `python3 scripts/validate_audit_repo.py` **before** pushing —
  root MD files and intake folder naming are the two easiest ways to turn `main` CI red for everyone.

---

## 🎨 THIRD-PASS DEEPENING — CSS + JS deep-dive (2026-07-14)

> Owner: *"досконально проверить и углубить исследования по CSS и еще JS"*. Ran real AST parsers
> from the repo's own `node_modules` (`postcss@8.5.16`, `css-tree`, `acorn`) + `node --check`.
> Full evidence: `../incoming/arena-auditor-meta-governance/2026-07-14/evidence/css-js-deep-audit-2026-07-14.txt`.

### 🔴 AUDIT-CSS-SITECSS-STRUCT-CORRUPTION (new, P1) — structural corruption invisible to all gates
Two independent parsers fail on `css/site.css`:
- `postcss`: `40:16304 Unknown word .bottom-bar,.btoc-link,.flip-card-inner,.h-article-card,.quiz-option`
- `css-tree`: **9 parse errors** (offsets 179799, 180014, 201874, 201914, 203062, 277864, +3)

Five malformed rules (browsers drop them via error-recovery):
1. `@media (prefers-reduced-motion:reduce){.bottom-bar,.btoc-link,.flip-card-inner,.h-article-card,.quiz-option}`
   — a **selector list with NO declaration block**, immediately followed by the next `@media`.
   **Impact: reduce-motion users get zero motion suppression for these 5 component classes (a11y).**
2. `...;.ehrman-block,.info-box,.quote-box}@media(forced-colors...)` — dangling selector list, no `{}`.
3. `...,.resume-reading-title,@supports (animation-timeline:scroll()){...}` — list broken by `@supports` (trailing comma).
4. `@media (hover:hover) and (pointer:fine){html.dark }` — empty rule (no declarations).
5. `.gbx-backlinks__maplink:rgba(122,46,46,0.08);gbx-backlinks__maplink:hover{...` — malformed declaration (no property).

**Why gates miss it:** `audit-pro.js` checks only brace-balance (which *passes* — braces are balanced;
the corruption is structural, not brace-level); `validate.js` does no structural CSS parsing;
`css-layer-validator.js` only counts `!important`. This is the **same blind spot** that let the
historical `CSS-PARSE-CORRUPTION-SITECSS` (PR#42) ship. **Pre-existing** (present in `b8459bdf`;
`site.css` is `+0/-0` in the delta — only its `?v=` hash changed).

### AUDIT-CSS-NO-STRUCTURAL-PARSE (new, P3) — the gate gap itself
No CSS gate runs a real parser. Fix is cheap: add `postcss`/`css-tree` `parse()` with an
`onParseError`→fatal step to `audit-pro.js` (both libs are already installed). Closes the whole class.

### AUDIT-CSS-DEAD-KEYFRAMES-TOKENS (new, P3) — minor hygiene
- `@keyframes fx-breathe` is defined **twice in the same `site.css`** (first def is dead).
- 33 `--custom-props` defined but never used (`--label`, `--ghost`, `--docked`, `--tg`, `--vk`, `--wa`, …).
- **No false positive on vars:** all "50 undefined" `var()` refs have a fallback, are JS-runtime-set
  (`--mouse-x`, `--scroll-pct`, `--gbs2-*`), or are defined in `@layer base` (`--z-*` tokens exist).

### JS deep-dive — mostly healthy; reverify confirmations
- All 15 `js/*.js` pass `node --check` (0 syntax errors); 0 `debugger`, 0 TODO/FIXME, 1 `console.log`
  (behind a `debug` flag — legit).
- **BUG-PERF-001 reverify:** addEventListener **349** / removeEventListener **25** (was 339/25 → grew
  +10 with the atlas/nagornaya work). Still-confirmed, marginally worse. Leaders: site.js 196/13,
  enhancements.js 48/1, nagornaya-mobile-toc.js 26/0, search.js 22/0.
- **XSS surface (28 innerHTML sinks): sound, no new bug.** Data-derived writes route through `tt()`
  (HTML-escape) or the FAQ builder's script/attr stripper. Only `site.js:451` (`titleText` from
  `.textContent`, low risk) and `bibleRefs .btip` (curated `#bibleRefs` JSON, by-design raw like
  glossary D-21) are unescaped.
- **NEW-HIGHLIGHTS-NO-REINIT-GUARD reverify — still-confirmed:** `highlights.js` IIFE has no
  `_initialized` guard (contrast `bookmark-engine.js`'s `window.BookmarkEngine._initialized`).
- **NF-VOSK-DEAD-SPLITSENTENCES reverify — still-confirmed:** `vosk-tts-core.js:413/446` exports
  `splitSentences`, but the controller uses its own `splitTtsChunks` (`floating-cluster-controller.js:487`).

---

## Status changes vs canon (matrix reverify)

| Bug ID | Previous status | Current status | Evidence angle |
|---|---|---|---|
| CI-INDEXNOW-CHECKER-STALE | P2 OPEN | **fixed-current** → move to ЗАКРЫТО @ `3a43cada` (PR#70) | verified-source + tool: `check-workflows.js:157` now requires `contents: read`; `node scripts/check-workflows.js` → ✅ passed |
| D-19 (antisovetov half) | P2 OPEN | **still-confirmed** (open) | verified-source: `validate.js` still flags `20-antisovetov-pastoru` `<title>`≠`og:title`; rimlyanam-7 half correctly no longer flagged |
| D-4 (magic z-index) | P3 OPEN | **still-confirmed** (lines drifted) | `floating-cluster.css:2833/2908/3199/3244/3464/4337`, `mobile-hotfix.css:129` |
| D-7 (path-leak comment) | P3 OPEN | **still-confirmed** | `PremiumControlAnchor.astro:3` still `// See: AuditRepo/projects/...` |
| TTS-DL-CONSENT | P1 OPEN | **still-confirmed** | `floating-cluster-controller.js:369-409` warm/ensureLoaded path unchanged |
| Deploy status (masthead) | GREEN @ b8459bdf | **regression: RED @ 2ca2af3b** | 3 CI workflows failing + local repro (Root causes A/B/C) |

## Buckets
- **regression (new, deploy-blocking):** REG-VALIDATE-GENEALOGY-TEMPLATE, REG-EDITORIAL-METADATA-MISSING, CACHE-BUST-NO-WRITER (recurred), GATE-CSS-IMPORTANT-RATCHET, AUDIT-ATLAS-DOC-PATH-LEAK, AUDIT-FORBIDDEN-JS-NAGORNAYA.
- **new (3rd pass, deep CSS/JS — not deploy-blocking but real):** AUDIT-CSS-SITECSS-STRUCT-CORRUPTION (P1, a11y + gate blind spot), AUDIT-CSS-NO-STRUCTURAL-PARSE (P3 gate gap), AUDIT-CSS-DEAD-KEYFRAMES-TOKENS (P3 hygiene). BUG-PERF-001 re-measured 349/25.
- **fixed-current (this pass, in AuditRepo):** AR-CI-RED (AuditRepo's own `validate_audit_repo.py` restored to PASS after 3 concurrent-agent violations).
- **fixed-current (source, prior pass):** CI-INDEXNOW-CHECKER-STALE.
- **still-confirmed:** D-19 (antisovetov), D-4, D-7, TTS-DL-CONSENT, TTS-DL-UNZIP-SYNC, NF-VOSK-DEAD-SPLITSENTENCES, NEW-HARDTEXTS-CSP-MISSING-HFCDN, D-8 (+ all other open P2/P3 carried forward, not re-witnessed this pass).
- **needs-manual-check:** Visual Parity pixel-diff failure (needs a full Playwright screenshot run; the production-like build itself succeeds, so this is likely a baseline delta from the atlas/mobile-reader visual changes — flagged, not root-caused here).
- **audit-drift (tooling):** genealogy build templates tripping `validate.js`/`audit-pro.js` because their file walkers do not skip `scripts/` build inputs (Root cause A); `atlas-*-scene` images read as orphans because the walker skips `audit/` where they're referenced.

## Notes for verifier
- These are **L2** (source + build-tooling + CI) — strong, but the three regressions touch the
  **release transaction** (SUPER_AUDIT W1) and pipeline/gate config, which is owner-gated per
  `NEXT_AGENT_PROMPT.md` rule 5. I did **not** modify the source repo. Recommend routing A/B/C
  as one release-unblock lane (owner decision), and updating the matrix masthead + counters +
  `NEXT_AGENT_PROMPT.md` HEAD to `2ca2af3b` with deploy=RED.
- Full command evidence: `../incoming/arena-auditor-meta-governance/2026-07-14/evidence/live-source-reverify-2026-07-14.txt` and `canon-open-bugs-reverify-2026-07-14.txt`.
