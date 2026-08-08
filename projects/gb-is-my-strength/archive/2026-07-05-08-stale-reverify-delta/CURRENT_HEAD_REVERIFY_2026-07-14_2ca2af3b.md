# Current Head Reverify — 2026-07-14 @ `2ca2af3b`

## Project
- **Project:** gb-is-my-strength / gospod-bog.ru
- **Source repo:** `FedorMilovanov/gb-is-my-strength`
- **Current HEAD SHA:** `2ca2af3b91ace0a94d1537595a8d6e66281c0023`  
  (`merge: Библейский атлас — карта Авраама`, 2026-07-14T13:54Z)
- **Previous canonical HEAD (matrix/NEXT_AGENT):** `b8459bdf` (2026-07-10)
- **Delta:** **+287 commits**, **~300 files** (269 added / 31 modified in compare API)
- **Date:** 2026-07-14
- **Verifier:** arena-auditor-head-reverify (Arena Agent Mode)
- **Witness angles used:** `verified-source` (local sparse+archive checkout), `verified-ci` (GitHub Actions API), historical compare `b8459bdf…2ca2af3b` / `007b67def5…2ca2af3b`
- **Not run this session:** full `strangler:build:production-like` (OOM risk / time), live browser on prod (TLS handshake from sandbox to Pages failed), full `validate:static-publication` end-to-end

## Compared against
- `verified/MASTER_BUG_MATRIX.md` (masthead still claimed GREEN @ `b8459bdf`)
- `NEXT_AGENT_PROMPT.md` (still 2026-07-10 / GREEN)
- `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` (frozen @ `14a49be8` — plan still valid, claims not re-stamped)
- Incoming: genealogy strategy/milestone, atlas deep-audit + DEBT-REGISTER, karty cluster
- Last formal reverify: `CURRENT_HEAD_REVERIFY_2026-07-09_head-2313f36f-149-commit-delta.md`

---

## 0. Executive verdict (one screen)

```text
Source main  = 2ca2af3b  (2026-07-14)
Prod deploy  = STALE / RED
Last GREEN deploy = 007b67def5 @ 2026-07-11T03:46Z (run 29138555390)
Since then: ~277 commits on main, 0 successful deploys
Deploy pipeline since 2026-07-11: ~59 failure + ~25 cancelled of ~85 runs
Readers still see ~2026-07-11 site; main has genealogy atlas v1, heart-series expansion,
mobile-chrome, atlas sheet work, cache-bust churn — NONE of that is on production.

Canonical AuditRepo SSOT (matrix + NEXT_AGENT) was 4 days / 287 commits behind.
This reverify restores HEAD truth and registers deploy-blocking findings.
```

---

## 1. Deploy / release transaction (P0)

### 1.1 Facts (CI API)

| Fact | Value | Witness |
|---|---|---|
| HEAD | `2ca2af3b` | `gh api …/commits/main` |
| Deploy run @ HEAD | `29338523013` **failure** | Actions API |
| Failed step | **Static publication gates** (`npm run validate:static-publication`) — step 7; all build/deploy steps skipped | job steps JSON |
| Sibling fails @ HEAD | Visual Parity Guard `29338522526` fail; Metadata & IndexNow Readiness `29338522715` fail on **Validate registry structure** | Actions API |
| Last success deploy | `29138555390` @ `007b67def5` 2026-07-11T03:46 | workflow deploy.yml success list |
| First failure after green | ~`4506c3d7ce` 2026-07-11T08:26 (mobile Gill polish #82) | deploy history |
| Since 2026-07-11 | **1 success / 59 failure / 25 cancelled** (n≈85) | jq over deploy runs |

### 1.2 Confirmed deploy-blocking defects (source gates, exit=1)

Run on checkout `2ca2af3b` (sparse + `git archive` of legacy HTML trees so root mirrors exist):

| ID (new) | Gate | Exit | Root cause (evidence) |
|---|---|---|---|
| **DEP-BLOCK-EDITORIAL-REGISTRY** | `node scripts/editorial-metadata-registry.js --check` | **1** | Eligible routes **25**, registry records **20**. Missing: `/articles/dzhon-gill-chast-4-ekzeget/`, `/articles/chto-bibliya-nazyvaet-serdcem/`, `/articles/novoe-serdce/`, `/articles/serdce-i-duh/`, `/articles/serdce-spravochnik/`. Registry `sourceCommit` still `e6793627…` (native-source-contract era). **This is the IndexNow readiness hard fail** (`indexnow.yml` step «Validate registry structure»). |
| **DEP-BLOCK-CSS-IMPORTANT-CEILING** | `css:layer:validate` (`site.css --ceiling=202`) | **1** | `!important count 210 exceeds ceiling 202`. Layered ratio still ~21.2% (warning, target ≥80%). Related to open **D-2** / budget class. |
| **DEP-BLOCK-MAPS-VALIDATE** | `maps:validate` → `validate-map-routes.js` | **1** | **25 issues**, three clusters: (A) hub audit-pending count **9 ≠ 10 missing** after `nachalo` added (exception `hasAuditPendingDesign` requires exact count match → falls through to 10× «missing clickable route card»); (B) `karty/nachalo/route.json` incomplete (meta.id/era/viewport, stories empty, photos without src/alt, stage undefined); (C) avraam meta.stats drift (places 19≠22, scientific_variants 45≠46) + stage-less places babylon/mari/paran-region; shoftim stats 13≠12. |
| **DEP-BLOCK-AVRAAM-AUDIT** | `avraam:audit` | **1** | 25/27: route places 22 vs HTML/legacy expectation 19; new IDs `babylon,mari,paran-region` not in HTML place set. |

**Not deploy-blocking on full tree (after legacy HTML present):**
- `route:profiles:check --strict` ✅
- `page-ownership:check` ✅
- `maps:publication-status` ✅
- `gill:series:data:consistency:audit` ✅
- `mdx:structure:audit` ✅
- `tokens:check` ✅
- `editorial:lint` (root-html) ✅

**Sparse-checkout false alarms (do not promote):**
- `content:guard` / route-profile «legacy reference not found» without `articles/`+`baptisty-rossii/` trees — artifact of incomplete checkout, not product bug.

### 1.3 Why prod is stale (lifecycle)

1. Content + atlas + mobile-chrome land on `main` without registry/meta/hub-stat co-updates.
2. `validate:static-publication` fails early → no Pages artifact → no deploy.
3. Concurrent `cancel-in-progress: true` on **both** `deploy.yml` and `indexnow.yml` (still true @ HEAD) cancels in-flight runs when next push arrives — amplifies red window (**SEO-CANON-P0-01 / D-1 still OPEN**, verified-source).
4. Cache-bust commits (`9fce2bc`, `13dc077`, `bdbaaa8`, …) intended to «unblock deploy» cannot pass if maps/editorial/css gates stay red.

### 1.4 Recommended unblock order (implementation, not done here)

1. `node scripts/editorial-metadata-registry.js --write` (or approved freeze workflow) → include 5 missing routes → commit registry.  
2. Hub: bump «на аудите» **9 → 10** (or add `nachalo` to featured/audit list consistently) in **both** `karty/index.html` and Astro `KartyHeroSection`.  
3. Either complete `nachalo/route.json` to schema **or** exclude draft routes from `validate-map-routes` live set until ready.  
4. Sync `avraam` meta.stats + HTML place IDs with route.json (or document extra places as non-featured waypoints and teach audit).  
5. `css:layer:validate`: raise ceiling with justification **or** remove 8+ `!important` from `site.css`.  
6. One PR: gates green → deploy green → only then more content.

---

## 2. What landed since `b8459bdf` (product delta)

| Stream | Highlights | On prod? |
|---|---|---|
| **Genealogy / «Библейский атлас родословий»** | AGENTS §13 locked; `scripts/genealogy-build/*`; `data/genealogy/v2/*` (table of nations 70, atlas-interactive.html, interactive trees); owner-confirmed milestone 2026-07-14 (`0aee617` → merge) | **No** |
| **Karty / Atlas sheets** | Sheet engine, nachalo prologue map, avraam enrichment (+babylon/mari/paran), river/LOD/geometry marathons (AuditRepo verification screenshots 07-11…12) | **No** (prod still old avraam-era) |
| **Heart series content** | Many new MDX (`serdce-i-yazyk`, `serdce-i-telo`, `kak-hranit-serdce`, `serdce-ne-v-odinochku`, …); pilots for chto-bibliya / novoe-serdce / serdce-i-duh / serdce-spravochnik | **No** |
| **Gill** | Part IV already at `b8459bdf`; later mobile reader, CBM quiz, speed-rail, chrome adapters | Partial at last green only |
| **Mobile chrome** | Shared shell, Gill/Hermenevtika adapters, page engine Back·Home·Search (PR#80–#87) | **No** (post-green) |
| **TTS** | Russian skip English originals + glossary (PR#78) etc. | Only if in `007b67` tree |

AuditRepo main **did** receive: genealogy intakes (07-11 + milestone 07-14), atlas DEBT/verification screenshots, matrix session log 07-11 — but **did not** update SSOT HEAD/deploy until this reverify.

---

## 3. Matrix bug status recheck (sample)

| Bug ID | Previous | Current assessment @ `2ca2af3b` | Notes |
|---|---|---|---|
| D-1 / SEO-CANON-P0-01 concurrency | OPEN | **still-confirmed** | `cancel-in-progress: true` in deploy.yml:50-52 **and** indexnow.yml:30-32 |
| D-2 css-layer-validator | OPEN | **still-confirmed + worsened** | ceiling breach 210>202 is now **blocking deploy** |
| D-19 title≠og | OPEN (half) | **still-confirmed** (antisovetov); rimlyanam half closed 07-11 | no new evidence of full close |
| D-21 glossary dual-render / XSS surface | OPEN | **still-confirmed** | 55 `<em>` in glossary.json; Favorites still has safePath (D-22 stay closed) |
| D-22 Favorites scheme | CLOSED | **fixed-current** | `safePath = /^\\/(?!\\/)/` present |
| CI-INDEXNOW-CHECKER-STALE | OPEN (PR-only) | **partially mitigated** | check-workflows now requires `contents: read` for indexnow; **new** fail is editorial registry, not contents:write |
| BUG-PERF-001 listeners | OPEN | **needs-manual-check** | not re-counted this pass |
| TTS-DL-CONSENT | OPEN | **needs-manual-check** | owner decision; code path not re-traced |
| KARTY-Q-BUG-P0 | CLOSED | **fixed-current** (assume; map-engine not re-browsered) | do not reopen without browser fail |
| SEO-CANON-P0-03 date loop / P0-05 SW unversioned precache / P1-30 SWR HTML | OPEN in SUPER_AUDIT | **still-likely** | SW still `gb-v189-lazy-precache-20260705`; BaseLayout still `version: Date.now()` |
| AR-001/004/005 | OPEN | **still-confirmed** | tooling automation backlog |

---

## 4. New findings to promote into matrix

### P0 — release
1. **PROD-STALE-DEPLOY-RED** — production not updated since `007b67def5` (2026-07-11); HEAD `2ca2af3b` cannot deploy.  
2. **DEP-BLOCK-EDITORIAL-REGISTRY** — 5 eligible routes missing from `data/editorial-metadata.json`.  
3. **DEP-BLOCK-MAPS-VALIDATE** — hub 9≠10 + nachalo schema + avraam stats.  
4. **DEP-BLOCK-CSS-IMPORTANT-CEILING** — site.css 210 > 202.  
5. **DEP-BLOCK-AVRAAM-AUDIT** — place-count / ID set mismatch (22 vs 19).

### P1 / process
6. **SSOT-HEAD-DRIFT-4D** — matrix + NEXT_AGENT claimed GREEN @ `b8459bdf` while main + deploy diverged (this reverify closes the *documentation* half).  
7. **HUB-AUDIT-COUNT-DRIFT** — design exception in `validate-map-routes.js` is brittle (exact integer match); adding a map without bumping «на аудите» fails the whole static chain.

### Genealogy / atlas (track, not all repair-ready)
8. Milestone v1 **implemented** in source (see `incoming/claude-genealogy-atlas-strategy/2026-07-14-milestone-atlas-v1/`) — status upgrade from strategy proposal to **shipped-in-main / not-on-prod**.  
9. Atlas DEBT-REGISTER still open: D-1, D-3, D-4, D-5, D-7, D-9…D-14 (separate long-running track).

---

## 5. SUPER_AUDIT waves — freshness note

W0 hygiene done historically. **W1 (release transaction) is now empirically on fire** — not theoretical. Until W1 gates pass, shipping genealogy/heart/atlas to readers is impossible regardless of content quality.

W2–W10 claims remain directionally valid; individual OPEN rows need per-ID reverify after deploy is green again. Do **not** bulk-close SUPER_AUDIT items from this pass.

---

## 6. Environment notes

- Arena sandbox: Node v22.22.3, 3.8 GiB RAM, no full production-like build this session.  
- `gh run view --log-failed` / Actions log zip download returned EOF (receiver); failure localization via job step names + local gate reproduction.  
- Live `https://gospod-bog.ru` TLS from sandbox: `SSL_ERROR_SYSCALL` (cannot browser-witness prod HTML here). DNS resolves to GitHub Pages IPs.  
- Local AuditRepo session was **42 commits behind** `origin/main` at start; merged before writing this file.

---

## 7. Buckets summary

### still-confirmed
D-1, D-2 (+blocking), D-19 (partial), D-21, SUPER_AUDIT W1 cluster, AR-* tooling

### fixed-current (reconfirmed)
D-22; check-workflows indexnow `contents: read` (CI-INDEXNOW-CHECKER-STALE no longer the active IndexNow fail mode)

### regression / new blocking
PROD-STALE-DEPLOY-RED, DEP-BLOCK-* quintet, HUB-AUDIT-COUNT-DRIFT

### needs-manual-check
BUG-PERF-001, TTS-DL-*, full browser MAP-*, PremiumControls freeze zone (untouched)

### documentation fixed by this reverify
SSOT HEAD/deploy stamps in matrix + NEXT_AGENT (paired commit)

---

## 8. Commands log (representative)

```bash
gh api repos/FedorMilovanov/gb-is-my-strength/commits/main
gh api repos/.../compare/b8459bdf...2ca2af3b91ac   # ahead_by 287
gh api repos/.../actions/workflows/deploy.yml/runs
gh api repos/.../actions/runs/29338523013/jobs      # Static publication gates fail
git clone --depth=1 --filter=blob:none ... gb-src @ 2ca2af3b
node scripts/editorial-metadata-registry.js --check   # exit 1, 5 missing
node scripts/css-layer-validator.js css/site.css --ceiling=202  # exit 1, 210
node scripts/validate-map-routes.js                   # exit 1, 25 issues
node scripts/avraam-map-audit.js                      # exit 1, 25/27
node scripts/check-route-profiles.js --strict         # exit 0 (with legacy trees)
node scripts/check-page-ownership.js                  # exit 0
npm run gill:series:data:consistency:audit            # exit 0
```

Full command trail: `incoming/arena-auditor-head-reverify/2026-07-14/commands.log` + REPORT.md.
