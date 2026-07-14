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
- **regression (new, deploy-blocking):** REG-VALIDATE-GENEALOGY-TEMPLATE, REG-EDITORIAL-METADATA-MISSING, CACHE-BUST-NO-WRITER (recurred).
- **fixed-current:** CI-INDEXNOW-CHECKER-STALE.
- **still-confirmed:** D-19 (antisovetov), D-4, D-7, TTS-DL-CONSENT (+ all other open P2/P3 not individually re-touched — carried forward, not re-witnessed this pass).
- **needs-manual-check:** Visual Parity pixel-diff failure (needs a Playwright/build run > sandbox budget; likely downstream of the same content delta — flagged, not root-caused here).
- **audit-drift (tooling):** genealogy build templates tripping `validate.js`/`audit-pro.js` because their file walkers do not skip `scripts/` build inputs.

## Notes for verifier
- These are **L2** (source + build-tooling + CI) — strong, but the three regressions touch the
  **release transaction** (SUPER_AUDIT W1) and pipeline/gate config, which is owner-gated per
  `NEXT_AGENT_PROMPT.md` rule 5. I did **not** modify the source repo. Recommend routing A/B/C
  as one release-unblock lane (owner decision), and updating the matrix masthead + counters +
  `NEXT_AGENT_PROMPT.md` HEAD to `2ca2af3b` with deploy=RED.
- Full command evidence: `../incoming/arena-auditor-meta-governance/2026-07-14/evidence/live-source-reverify-2026-07-14.txt` and `canon-open-bugs-reverify-2026-07-14.txt`.
