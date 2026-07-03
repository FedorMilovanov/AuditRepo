# Agent Audit Report

## Meta
- Project: gb-is-my-strength
- Source repo:
- Agent: arena-agent-6
- Date: 2026-06-25
- Audited branch:
- Audited SHA:
- Current HEAD at start:
- Current HEAD at end:
- Environment:
- Build mode: source / dist / production-like dist
- Browser / device if used:

---

## 1. New Findings

### Finding <temp-id>
- Title:
- Severity: P0 / P1 / P2 / P3
- Route(s):
- Source file(s):
- Observed on SHA:
- Repro steps:
- Expected:
- Actual:
- Evidence: (command + output)
- Confidence: high / medium / low
- Verification level: L0 (one agent) / L2 (two agents or direct evidence)
- Suggested repair lane:
- Do not mix with:

---

## 2. Confirmations of Existing Findings

### Confirm <target-id>
- Target report: incoming/<agent>/<date>/REPORT.md
- Target finding:
- My evidence:
- Same bug / related / stronger root cause:
- Recommended status:

---

## 3. Challenges / Disputes

### Challenge <target-id>
- Target report: incoming/<agent>/<date>/REPORT.md
- Target finding:
- Reason for challenge:
- Current HEAD evidence:
- Recommended status: disputed / stale-on-current-head / false-positive / downgrade

---

## 4. Duplicate / Merge Proposals

### Merge proposal
- Finding A:
- Finding B:
- Why same root cause:
- Canonical ID suggestion:

---

## 5. Severity Proposals

- Target bug:
- Current severity:
- Proposed severity:
- Evidence:

---

## 6. Repair Lane Suggestions

- Bug IDs:
- Lane:
- Why together:
- What must NOT be mixed:

---

## 7. Reverify Notes

- Bug:
- Current HEAD:
- Result: confirmed-current / stale / fixed / disputed
- Evidence:

---

## 8. Notes for Verifier

---

## Proposal statuses

proposal-open → proposal-supported → proposal-accepted (bug moves)
proposal-open → proposal-conflicted → resolved in conflicts/
proposal-open → proposal-rejected
proposal-open → proposal-superseded

---

## ADDENDUM — Deep Verification (Round 2)

### V2-2 STRENGTHENED: Exact selector mismatch proof
- `nagornaya-mobile-toc.js` queries: `[data-fontsize="down"]`, `.nag-fontsize-down`
- HTML has: `id="nagFontDec"`, `class="nag-fontsize-btn"`
- **Neither JS selector matches the HTML markup** — buttons are 100% dead
- Evidence: `evidence/v2-2-selector-mismatch.log`

### P1-17 CONFIRMED: BaseLayout CSS vs JS asymmetry
- CSS: `<link rel="stylesheet" href="/css/site.css" />` — NO `?v=HASH`
- JS: `scriptTag('js/site.js')` → `<script src="/js/site.js?v=133dfac1">` — WITH hash
- `scriptTag()` uses `md5short()` for cache-busting, but no equivalent for CSS
- Evidence: `evidence/p1-17-css-no-hash.log`

### P1-9 CONFIRMED: audit-pro.js CACHE_BUST_ASSETS diverged
- 4 assets in cache-bust.js but NOT in audit-pro.js
- 2 assets in audit-pro.js but NOT in cache-bust.js
- 6 total divergences
- Evidence: `evidence/p1-9-audit-pro-divergence.log`

### P2-17 CONFIRMED: MapEngine global pollution
- `map-engine.js` line 2633: `window.MapEngine = MapEngine`
- Used by `avraam-app.js` for route validation and loading

### P3-8 CONFIRMED: faq-accordion.js not loaded
- Antisovetov page has FAQ accordion HTML (50 references)
- No `<script>` tag loads `faq-accordion.js`
- The accordion is non-functional

### P2-14 CONFIRMED: series-cards.js dead code
- `series-cards.js` is in SW precache (malformed)
- NOT loaded by any HTML page or Astro component
- Dead code that wastes precache space

### NEGATIVES (not bugs)
- SW cacheFirst fallback is CORRECT behavior (offline resilience only)
- JSON-LD structured data is well-formed across all checked pages
- Gill Part2 TOC anchors all correct
- No duplicate Yandex.Metrika found on checked pages
- cache-bust.js regex correctly handles hash replacement without doubling

---

## ADDENDUM — Production Verification (Round 3)

### Source-Production Drift — MAJOR PATTERN
Multiple findings are SOURCE-REPO-ONLY bugs that don't affect production:

| Bug | Source Repo | Production | Impact |
|-----|------------|------------|--------|
| NEW-01 (sw.js syntax) | ❌ BROKEN | ✅ OK | Source only |
| V2-2 (Nagornaya fonts) | ❌ No data-fontsize | ✅ Has data-fontsize | Source only |
| P1-17 (CSS no hash) | ❌ No ?v= in BaseLayout | ✅ Has ?v= (cache-bust.js) | Source only |

**Root cause:** Production uses strangler build (copy-legacy-to-dist.js) which:
1. Generates its own sw.js (correct version)
2. Adds data-fontsize attributes to Nagornaya buttons
3. cache-bust.js adds CSS hashes to root HTML

**Implication:** These bugs only matter if someone builds from source (npm run build). Production is currently protected by the strangler pipeline.

### P1-17 DOWNGRADED to P3
- About/ and all article pages use legacy root HTML (shadow-wrap), not Astro BaseLayout
- cache-bust.js correctly adds CSS hashes to root HTML
- Only /karty/ uses Astro directly — P1-17 would only affect karty pages
- If more pages migrate to native Astro, P1-17 becomes relevant again

### Production Health Check
All production routes return HTTP 200:
- Homepage: 200 (62KB)
- Gill Part1: 200 (146KB)
- Baptisty: 200 (27KB)
- Nagornaya: 200 (41KB)
- Avraam: 200 (7KB)
- 404 page: 404 (8KB) ✅
- sitemap.xml: 200 (15KB)
- feed.xml: 200 (17KB)
- robots.txt: 200 (2KB)
- manifest.json: 200 (1.4KB)

### Production CSS/JS Cache-Bust
All production CSS and JS files have correct ?v=HASH:
- css/site.css?v=b880b524 ✅
- js/site.js?v=133dfac1 ✅
- js/floating-cluster-controller.js?v=58c2ea90 (production-computed hash, different from source)
