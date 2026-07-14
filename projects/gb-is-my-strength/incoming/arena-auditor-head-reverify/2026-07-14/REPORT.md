# Agent Work Report — HEAD reverify 2026-07-14

## Meta
- **Project:** gb-is-my-strength
- **Source repo:** FedorMilovanov/gb-is-my-strength
- **Agent:** arena-auditor-head-reverify
- **Date:** 2026-07-14
- **Audited branch:** main
- **Audited SHA:** `2ca2af3b91ace0a94d1537595a8d6e66281c0023`
- **Previous SSOT HEAD:** `b8459bdf` (matrix claimed GREEN deploy)
- **Last GREEN deploy SHA:** `007b67def5` (2026-07-11T03:46Z, run `29138555390`)
- **Current HEAD:** `2ca2af3b` (= audited)
- **Mode:** free-intake + current-head reverify
- **Environment:** Arena sandbox, Node v22.22.3, gh API, sparse source checkout + git archive of legacy HTML
- **Build mode:** source gates only (no strangler production-like build this session)

Canonical reverify document:  
`reverify/CURRENT_HEAD_REVERIFY_2026-07-14_2ca2af3b.md`

---

## 1. New Findings

### PROD-STALE-DEPLOY-RED
- **Title:** Production stuck on 2026-07-11; main cannot deploy
- **Severity:** P0
- **Route/files:** release pipeline; readers see stale site
- **Evidence:** last successful deploy.yml run `29138555390` @ `007b67def5`; HEAD deploy `29338523013` failure on step «Static publication gates»; since 2026-07-11 ≈59 fail + 25 cancel / 85 runs
- **Confidence:** high
- **Witness:** verified-ci
- **Suggested repair lane:** release-unblock (W1)

### DEP-BLOCK-EDITORIAL-REGISTRY
- **Title:** Editorial metadata registry missing 5 eligible article routes
- **Severity:** P0 (blocks IndexNow readiness + contributes to static gates)
- **Route/files:** `data/editorial-metadata.json`; routes:  
  `/articles/dzhon-gill-chast-4-ekzeget/`,  
  `/articles/chto-bibliya-nazyvaet-serdcem/`,  
  `/articles/novoe-serdce/`,  
  `/articles/serdce-i-duh/`,  
  `/articles/serdce-spravochnik/`
- **Evidence:** `node scripts/editorial-metadata-registry.js --check` → exit 1; «Eligible routes: 25 / Registry records: 20»; registry `sourceCommit` still `e6793627…`
- **Confidence:** high
- **Witness:** verified-source
- **Suggested repair lane:** release-unblock / W2 metadata

### DEP-BLOCK-MAPS-VALIDATE
- **Title:** `maps:validate` fails (25 issues) — hub count + nachalo + avraam stats
- **Severity:** P0 (in `validate:static-publication` chain)
- **Route/files:** `karty/index.html`, `src/components/karty/KartyHeroSection.astro`, `karty/nachalo/route.json`, `karty/avraam/route.json`, `scripts/validate-map-routes.js`
- **Evidence:**  
  - 11 route.json maps; hub shows only avraam; stat «на аудите» = **9** but missing links = **10** (nachalo added) → `hasAuditPendingDesign` false → 10 hard errors  
  - nachalo: invalid meta, empty stories, photo src/alt missing  
  - avraam: meta.stats.places 19 ≠ 22 places; stages missing on babylon/mari/paran-region
- **Confidence:** high
- **Witness:** verified-source
- **Suggested repair lane:** karty-atlas + release-unblock

### DEP-BLOCK-CSS-IMPORTANT-CEILING
- **Title:** site.css !important 210 > ceiling 202
- **Severity:** P0 (blocking) / related P2 D-2
- **Route/files:** `css/site.css`, `package.json` script `css:layer:validate`
- **Evidence:** `node scripts/css-layer-validator.js css/site.css --ceiling=202` exit 1; layered 21.2%
- **Confidence:** high
- **Witness:** verified-source

### DEP-BLOCK-AVRAAM-AUDIT
- **Title:** avraam:audit 25/27 — route/HTML place set drift
- **Severity:** P0 (in static chain) / product P2 if gate waived
- **Route/files:** `karty/avraam/route.json`, legacy HTML place list, `scripts/avraam-map-audit.js`
- **Evidence:** route places 22 vs expected 19; extra IDs babylon, mari, paran-region
- **Confidence:** high
- **Witness:** verified-source

### HUB-AUDIT-COUNT-DRIFT
- **Title:** Brittle hub exception depends on exact «на аудите» integer
- **Severity:** P2 (process)
- **Evidence:** `hasAuditPendingDesign()` in validate-map-routes.js requires numeric stat == missingCount; any new map without copy update fails entire deploy
- **Confidence:** high
- **Suggested repair lane:** tooling — derive count from route.json publication statuses

### GENEALOGY-ATLAS-V1-SHIPPED-NOT-PROD
- **Title:** Genealogy card atlas v1 in main, not on production
- **Severity:** P1 product delivery (blocked by deploy red, not a code defect per se)
- **Evidence:** AGENTS §13; `data/genealogy/v2/build/atlas-interactive.html`; milestone intake 2026-07-14; merge `0aee617`/`2ca2af3b`
- **Confidence:** high
- **Note:** not a «bug» in atlas code — delivery risk

---

## 2. Confirmations of Existing Findings

### Confirm D-1 / SEO-CANON-P0-01
- **Target:** SUPER_AUDIT + matrix D-1
- **My evidence:** both workflows still `cancel-in-progress: true` @ HEAD
- **Recommended status:** confirmed-current

### Confirm D-2
- **My evidence:** ceiling now breached (210>202) — escalates from quality warning to deploy blocker
- **Recommended status:** confirmed-current; severity raise to P0 while blocking (or keep P2 with linked DEP-BLOCK-CSS)

### Confirm D-21
- **My evidence:** glossary.json still contains 55 `<em>`; dual-render class remains W5 work
- **Recommended status:** confirmed-current

### Confirm CI-INDEXNOW-CHECKER-STALE (partial)
- **My evidence:** check-workflows.js now asserts `contents: read` for indexnow (PR#70 path) — old write-requirement gone
- **But:** IndexNow readiness still red for **different** reason (editorial registry)
- **Recommended status:** stale-on-current-head for «contents:write» formulation; replace with DEP-BLOCK-EDITORIAL-REGISTRY

---

## 3. Challenges / Disputes

### Challenge «Prod = main, gates green» (NEXT_AGENT / matrix masthead pre-reverify)
- **Reason:** false as of 2026-07-14
- **Evidence:** deploy history + HEAD run failure
- **Recommended status:** documentation superseded by this reverify

### Challenge bulk-closing SUPER_AUDIT from content merges
- **Reason:** 287 commits did not execute W1–W10; many OPEN systemic items still present (Date.now version, SW v189, IndexNow || true)
- **Recommended status:** keep SUPER_AUDIT OPEN; reverify per wave after deploy green

---

## 4. Duplicate / Merge Proposals

- Merge **DEP-BLOCK-CSS-IMPORTANT-CEILING** as *instance of* **D-2** (same subsystem) with deploy-blocking flag.  
- Merge **HUB-AUDIT-COUNT-DRIFT** under **DEP-BLOCK-MAPS-VALIDATE** as mechanism witness.  
- **PROD-STALE-DEPLOY-RED** is the user-visible umbrella; DEP-BLOCK-* are mechanisms.

---

## 5. Severity Proposals

| Target | Current | Proposed | Why |
|---|---|---|---|
| D-2 | P2 | P0 while 210>202 blocks deploy; else P2 | ceiling is hard fail |
| CI-INDEXNOW-CHECKER-STALE | P2 | close/supersede | wrong root cause now |
| PROD-STALE-DEPLOY-RED | — | P0 | readers + SEO |

---

## 6. Repair Lane Suggestions

### Lane R-UNBLOCK-2026-07-14 (single PR preferred)
1. Editorial registry write for 5 routes  
2. Hub stat 9→10 (+ nachalo decision)  
3. nachalo schema or exclude-from-live-validate  
4. avraam stats/HTML sync  
5. css ceiling or reduce !important  
6. Confirm `validate:static-publication` green → deploy green  

**Must NOT mix:** PremiumControls visual polish, glossary data mass-edit, Bible corpus rewrite.

### Lane R-GENEALOGY-DELIVERY
After unblock: ensure genealogy assets are in publication allowlist / ownership / sitemap if intended public; else keep under audit/preview paths.

### Lane R-W1 (SUPER_AUDIT)
Concurrency groups, deterministic build id, IndexNow asserts — after emergency unblock.

---

## 7. Reverify Notes

| Bug / claim | Result | Evidence |
|---|---|---|
| Matrix HEAD `b8459bdf` GREEN | **stale** | HEAD `2ca2af3b`; last green `007b67def5` |
| D-22 fixed | **fixed-current** | safePath in Favorites.astro |
| D-1 concurrency | **confirmed-current** | workflow YAML |
| Genealogy strategy open | **implemented-in-main** | milestone intake + AGENTS §13 |
| PremiumControls freeze | **untouched** | no PC edits this pass |

---

## 8. Notes for Verifier

1. Promote DEP-BLOCK-* + PROD-STALE into MASTER_BUG_MATRIX open tables; bump deploy line to RED.  
2. Do not treat AuditRepo genealogy milestone as «prod shipped».  
3. DEBT-REGISTER atlas debts remain open — separate from deploy unblock.  
4. Full browser/prod witness still needed once deploy is green (sandbox TLS to Pages failed).  
5. Session also merged local arena branch with origin/main (42 commits) before writing SSOT updates.
