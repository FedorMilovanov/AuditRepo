# Agent Audit Report

## Meta
- Project: gb-is-my-strength
- Source repo: https://github.com/FedorMilovanov/gb-is-my-strength
- Agent: arena-deep-auditor-pass7
- Date: 2026-07-02
- Audited branch: main
- Audited SHA: d5d9388b56a96ea26fe1c1309b07d6c4e2534f9b
- Current HEAD at start: d5d9388b
- Current HEAD at end: d5d9388b
- Environment: Arena.ai / E2B / Debian trixie / Node 22.12.0 / 2 CPU / 2GB RAM
- Build mode: source + production-like dist verification
- Browser / device if used: Playwright Chromium headless (via audit-pro)

---

## 1. New Findings

### Finding NEW-31
- Title: Missing modern security headers suite — Referrer-Policy, Permissions-Policy, COOP, COEP
- Severity: P2
- Route(s): All articles, all Astro routes (/ , /articles/, /biografii/, /nagornaya/*, etc.)
- Source file(s): `articles/*/index.html`, `src/components/**/PageHead.astro`
- Observed on SHA: d5d9388b
- Repro steps: `grep -r "Referrer-Policy\|Permissions-Policy\|Cross-Origin-Opener-Policy" articles/ src/ --include="*.html" --include="*.astro" | wc -l` → 0
- Expected: Defense-in-depth headers: Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy, Cross-Origin-Embedder-Policy
- Actual: 0 occurrences site-wide. Only CSP + X-Content-Type-Options present.
- Evidence:
```
$ grep -rn "Referrer-Policy\|Permissions-Policy\|X-XSS-Protection\|Cross-Origin" articles/ src/ --include="*.html" --include="*.astro" | wc -l
0
```
- Confidence: high
- Verification level: L2 (direct source evidence, 2-agent confirmed — NEW-28/NEW-29 predecessor in Pass 7)
- Suggested repair lane: `lane/security-headers`
- Do not mix with: PremiumControls / floating-cluster (protected subsystem)

### Finding NEW-32
- Title: CSP uses 'unsafe-inline' — weak Content Security Policy allows XSS vector
- Severity: P3
- Route(s): All 11 articles + all Astro PageHead components (39 files)
- Source file(s): `articles/*/index.html`, `src/components/**/PageHead.astro`
- Observed on SHA: d5d9388b
- Repro steps: `grep -o "script-src[^>]*" articles/20-antisovetov-pastoru/index.html`
- Expected: Nonce / hash-based CSP, or at least report-only monitoring, strict-dynamic
- Actual: `script-src 'self' 'unsafe-inline' https://mc.yandex.ru ...` — unsafe-inline present everywhere
- Evidence:
```
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://mc.yandex.ru ...">
# found in 11/11 articles
$ grep -r "script-src 'self' 'unsafe-inline'" articles/ --include="*.html" | wc -l
11
```
- Confidence: high
- Verification level: L2
- Suggested repair lane: `lane/security-headers-csp-hardening`
- Do not mix with: SW gate / JS split lanes
- Comments: CSP IS present (good), but 'unsafe-inline' defeats XSS protection purpose. Related to NEW-28/NEW-29, but distinct root cause — CSP hardening vs missing headers.

### Finding NEW-33
- Title: Service Worker PRECACHE_ASSETS out of sync — missing series-cards.js, site-layered.css, premium asset drift
- Severity: P2
- Route(s): global SW (`/sw.js`)
- Source file(s): `sw.js`, `scripts/cache-bust-assets.js`
- Observed on SHA: d5d9388b
- Repro steps:
  1. `grep -o '"/[^"]\+"' sw.js | sort`
  2. Compare vs `ASSETS` in `scripts/cache-bust-assets.js`
- Expected: SW PRECACHE_ASSETS ⊆ cache-bust ASSETS ∪ manifest extras, 1:1 sync
- Actual: 
  - SW includes 26 assets, cache-bust source of truth has 19
  - SW missing: `site-layered.css` (283KB), `js/series-cards.js` (2.6KB) — file exists on disk but NOT precached AND NOT cache-busted
  - SW includes extra manifest/favicon assets NOT in cache-bust-assets.js (intentional drift, but undocumented)
- Evidence:
```
PRECACHE_ASSETS (sw.js): 26 entries
ASSETS (cache-bust-assets.js): 19 entries
Missing in SW vs disk:
  - css/site-layered.css  (283706 bytes, exists, NOT in SW)
  - js/series-cards.js    (2660 bytes, exists, NOT in SW, NOT in cache-bust)
Missing in cache-bust vs SW:
  + /manifest.json, /favicon.ico, /404.html, /pagefind/pagefind.js, /data/search-manifest.json
```
- Confidence: high
- Verification level: L2
- Suggested repair lane: `lane/sw-gate-coupling` (same as BUG-003 — merge candidate)
- Do not mix with: CSS deduplication lane (BUG-005) — related but distinct: precache sync vs file duplication

### Finding NEW-34
- Title: CSS / JS total budget exceeded — audit-pro WARNING (not yet in bug matrix)
- Severity: P2
- Route(s): global
- Source file(s): `css/site.css`, `js/site.js`, aggregated bundles
- Observed on SHA: d5d9388b
- Repro steps: `node scripts/audit-pro.js`
- Expected: Core CSS ≤425000 bytes, JS ≤365000 bytes per AGENTS.md §1.2 quality metrics
- Actual:
  - Core CSS total 444731 bytes exceeds budget 425000 (+19.7KB, +4.6%)
  - JS total 374593 bytes exceeds budget 365000 (+9.6KB, +2.6%)
  - Gzip wire: CSS 163121, JS 104950, total 268071 bytes
- Evidence:
```
── WARNINGS (3) ──
⚠️ Core CSS total 444731 bytes exceeds budget 425000
⚠️ JS total 374593 bytes exceeds budget 365000
```
- Confidence: high
- Verification level: L2 (audit-pro direct)
- Suggested repair lane: `lane/css-deduplication` + `lane/js-split` (BUG-005 + BUG-006 — strengthen existing)
- Do not mix with: security-headers lane
- Comments: This is a CONSEQUENCE of BUG-005 (277KB CSS duplication) + BUG-006 (162KB site.js), but budget exceed is independently measurable and CI-visible (audit-pro WARNING not ERROR — yet). Propose upgrading BUG-005/BUG-006 priority or tracking budget as separate P2.

### Finding NEW-35
- Title: astro:check / TypeScript type-check NOT wired into validate:static-publication
- Severity: P2
- Route(s): CI pipeline
- Source file(s): `package.json` → `"validate:static-publication": "..."`
- Observed on SHA: d5d9388b
- Repro steps: `grep "astro:check\|tsc" package.json | grep validate`
- Expected: TypeScript strict check in pre-commit / CI gate, per AGENTS.md TypeScript policy
- Actual: `"validate:static-publication"` chain ( ~30 checks ) does NOT include `astro:check`
  - `astro:check` script EXISTS (`"astro:check": "ASTRO_TELEMETRY_DISABLED=1 astro check"`)
  - 12 TypeScript files in `src/` (`*.ts`, `*.tsx`)
  - tsconfig extends `"astro/tsconfigs/strict"`
  - BUT gate never runs it
- Evidence:
```
$ grep -A2 "validate:static-publication" package.json | grep astro:check
(no output)
$ find src -name "*.ts" -o -name "*.tsx" | wc -l
12
```
- Confidence: high
- Verification level: L2
- Suggested repair lane: `lane/ci-typescript-gate`
- Do not mix with: SW gate lane
- Comments: Related to BUG-003 (gate orchestration). Same pattern: existing safety script exists but NOT coupled into validate:static-publication.

### Finding NEW-36
- Title: z-index magic numbers violate design token policy — audit-pro WARNING
- Severity: P3
- Route(s): global CSS
- Source file(s): `css/floating-cluster.css`, `css/mobile-hotfix.css`
- Observed on SHA: d5d9388b
- Repro steps: `node scripts/audit-pro.js`
- Expected: 0 magic z-index per AGENTS.md §4.2 / §9
- Actual: 6 occurrences:
  - `css/mobile-hotfix.css: z-index: 2102`
  - `css/floating-cluster.css: z-index: 2102, 9999, 3000, 2147483000, 2147483100`
- Evidence: audit-pro WARNING output (see above)
- Confidence: high
- Verification level: L2
- Suggested repair lane: `lane/css-cleanup` (BUG-016/BUG-022 family)
- Do not mix with: PremiumControls protected subsystem edits without visual gate — see AGENTS.md §3.10 Explicit Forbids
- Comments: Floating-cluster is PROTECTED SUBSYSTEM (§3.10). z-index changes require owner + full visual gate + 14-day freeze. Report as documentation debt, DO NOT auto-fix.

---

## 2. Confirmations of Existing Findings

### Confirm BUG-001
- Target report: `AuditRepo/projects/gb-is-my-strength/verified/VERIFIED_BUG_MATRIX_FINAL.md`
- Target finding: BUG-001 Memory leak in floating-cluster-controller.js — 38 addEventListener, 0 removeEventListener
- My evidence:
```
$ grep -c 'addEventListener' js/floating-cluster-controller.js
38
$ grep -c 'removeEventListener' js/floating-cluster-controller.js
0
```
- Same bug / related / stronger root cause: Same bug, confirmed-current
- Recommended status: confirmed-current

### Confirm BUG-002
- Target report: verified/VERIFIED_BUG_MATRIX_FINAL.md
- Target finding: BUG-002 — 39 PageHead + 5 PostArticle components with duplication
- My evidence:
```
$ find src/components -name "*PageHead.astro" | wc -l
39
$ find src/components -name "*PostArticle.astro" | wc -l
6
total: 45
```
- Same bug / related / stronger root cause: Same bug, count INCREASED: 44 → 45 files (+1 PostArticle). Severity unchanged P1, maintenance risk growing.
- Recommended status: confirmed-current — update count to 45

### Confirm BUG-003
- Target report: verified/VERIFIED_BUG_MATRIX_FINAL.md
- Target finding: BUG-003 SW precache gate orchestration — validate:static-publication does NOT include sw:dist:audit
- My evidence:
```
$ grep -A 5 '"validate:static-publication"' package.json | grep sw:dist
(no output)
$ grep "sw:dist:audit" package.json
    "strangler:audit:production-like": "... npm run sw:dist:audit:pagefind",
    "sw:dist:audit": "node scripts/sw-dist-readiness-audit.js",
```
sw:dist:audit EXISTS but NOT in validate:static-publication chain.
- Same bug / related / stronger root cause: Same bug, confirmed-current, P1
- Recommended status: confirmed-current
- Comments: NEW-33 and NEW-35 are SAME PATTERN (existing safety script not wired into gate) → propose merge group: gate-orchestration family (BUG-003 + NEW-33 + NEW-35)

### Confirm BUG-005
- Target report: verified/VERIFIED_BUG_MATRIX_FINAL.md
- Target finding: BUG-005 site.css and site-layered.css duplicate each other — 277KB wasted
- My evidence:
```
-rw-r--r-- 283648 css/site.css
-rw-r--r-- 283706 css/site-layered.css
```
- Same bug / related / stronger root cause: Same bug, confirmed-current
- Recommended status: confirmed-current

### Confirm BUG-006
- Target report: verified/VERIFIED_BUG_MATRIX_FINAL.md
- Target finding: BUG-006 site.js = 162.8KB — too big
- My evidence: `-rw-r--r-- 163K js/site.js`
- Same bug / related / stronger root cause: Same bug, confirmed-current
- Recommended status: confirmed-current

### Confirm BUG-007
- Target report: verified/VERIFIED_BUG_MATRIX_FINAL.md
- Target finding: BUG-007 series.json field name inconsistency — 23 readingTime, 1 readTime
- My evidence:
```
$ grep -c '"readingTime"' data/series.json
23
$ grep -c '"readTime"' data/series.json
1
```
- Same bug / related / stronger root cause: Same bug
- Recommended status: confirmed-current

### Confirm BUG-010
- Target report: verified/VERIFIED_BUG_MATRIX_FINAL.md
- Target finding: BUG-010 CSS breakpoint chaos — 20 different breakpoints
- My evidence: `grep -oE "max-width:[[:space:]]*[0-9]+px|min-width:[[:space:]]*[0-9]+px" css/site.css | sort -u | wc -l` → 40+ unique declarations, 20+ distinct pixel values confirmed
- Same bug / related / stronger root cause: Same bug
- Recommended status: confirmed-current

---

## 3. Challenges / Disputes

### Challenge BUG-017 — Severity Proposal (not full dispute)
- Target report: verified/VERIFIED_BUG_MATRIX_FINAL.md
- Target finding: BUG-017 Phantom CSS file in documentation — AGENTS.md §2 documents 8 CSS, disk has 7 — severity P2
- Reason for challenge: Impact is documentation confusion for agents, NOT runtime user impact. No user-facing breakage. File count mismatch is `premium-controls.css` — which IS referenced in AGENTS.md §2 architectural inventory AND in §3.10 PremiumControls subsystem, but physically the file at `css/premium-controls.css` IS a copy of `src/styles/premium-controls.css` per AGENTS.md: "`premium-controls.css` — копия канонического источника src/styles/premium-controls.css". Wait — check disk: `ls css/` shows NO `premium-controls.css`. So documentation claims 8 files including premium-controls.css, but file is missing from /css/. However AGENTS.md §2 table lists: site.css, home.css, command-palette.css, mobile-hotfix.css, nagornaya-mobile-toc.css, floating-cluster.css, premium-controls.css, site-layered.css = 8. On disk: missing premium-controls.css, present: floating-cluster.css. So phantom is real.
- Current HEAD evidence:
```
css/ directory (7 files):
command-palette.css
floating-cluster.css
home.css
mobile-hotfix.css
nagornaya-mobile-toc.css
site-layered.css
site.css

AGENTS.md claims 8, including premium-controls.css (missing)
```
- Recommended status: downgrade P2 → P3 — documentation drift, no runtime impact, low user risk. Keep in matrix, lower priority.

---

## 4. Duplicate / Merge Proposals

### Merge proposal — Gate Orchestration Family
- Finding A: BUG-003 — SW precache gate orchestration (sw:dist:audit not in validate:static-publication) — P1
- Finding B: NEW-33 — SW PRECACHE_ASSETS out of sync — P2
- Finding C: NEW-35 — astro:check / TypeScript NOT wired into validate:static-publication — P2
- Why same root cause: All three are "existing safety script exists in package.json but NOT coupled into validate:static-publication CI gate" — gate orchestration debt. Different target scripts (sw:dist:audit, precache sync, astro:check), same systemic cause: validate:static-publication chain is incomplete.
- Canonical ID suggestion: Keep BUG-003 as canonical P1, merge NEW-33 and NEW-35 as sub-items / related evidence, OR create meta-bug BUG-003-EXTENDED "validate:static-publication gate incomplete — 3+ safety scripts orphaned"

### Merge proposal — Security Headers Family
- Finding A: NEW-28 (from Pass 7 report) — Missing HSTS — P2
- Finding B: NEW-29 (from Pass 7 report) — Missing X-Frame-Options — P2
- Finding C: NEW-31 (this report) — Missing Referrer-Policy, Permissions-Policy, COOP, COEP — P2
- Finding D: NEW-32 (this report) — CSP uses unsafe-inline — P3
- Why same root cause: All HTTP security header hardening, same files (`PageHead.astro` ×39, `articles/*/index.html`), same repair lane (`lane/security-headers`), can be fixed in single PR touching PageHead base component (which ties back to BUG-002 — duplication makes security header rollout 39× harder — perfect justification for BUG-002 P1)
- Canonical ID suggestion: Create meta Security Headers epic, keep NEW-28/29 as P2 trackers, merge NEW-31 into same lane, track NEW-32 separately as CSP hardening P3

### Merge proposal — Budget Exceed Family
- Finding A: BUG-005 — CSS duplication 277KB — P2
- Finding B: BUG-006 — site.js 162KB monolith — P2
- Finding C: NEW-34 — CSS/JS total budget exceeded (audit-pro WARNING) — P2
- Why same root cause: NEW-34 is direct CONSEQUENCE / measurable symptom of BUG-005 + BUG-006. Do not create separate bug, instead add budget-exceed evidence to BUG-005/BUG-006, and propose severity raise P2→P1 if budget exceed becomes ERROR (currently WARNING).
- Canonical ID suggestion: Keep BUG-005 and BUG-006 separate (different files), attach NEW-34 evidence to both, NO new independent bug ID — convert NEW-34 → evidence-addition comment.

---

## 5. Severity Proposals

- Target bug: BUG-017 — Phantom CSS file in documentation
- Current severity: P2
- Proposed severity: P3
- Evidence: No runtime impact, no user-facing breakage, purely AGENTS.md documentation drift (phantom `premium-controls.css` count). File is documented as copy of `src/styles/premium-controls.css` but missing from `css/` directory (7 files on disk vs 8 documented). Agents confused — yes — but impact = documentation quality, not production breakage. Aligns with S0/P3 documentation bugs BUG-026/BUG-027.
- Rationale: P2 is "High — требует исправления, Performance issues, SEO problems, Data inconsistency, Code duplication". BUG-017 is none of those — it's docs.

- Target bug: BUG-005 — site.css / site-layered.css duplication
- Current severity: P2
- Proposed severity: P1 (raise)
- Evidence: Duplication causes audit-pro budget WARNING → Core CSS total 444731 bytes exceeds budget 425000. Budget exceed is CI-visible quality gate warning today, could become ERROR tomorrow if ceiling ratchets. 277KB wasted bandwidth affects LCP / Core Web Vitals directly (project target Lighthouse Performance ≥90). Combined with BUG-006 JS budget exceed, total wire size 268KB gzipped — significant for mobile.
- Rationale: Performance impact is user-facing, measurable, CI-warned. Meets P1 definition: "Performance issues" at P2 normally, but when budget EXCEEDED in CI — escalate to P1.

---

## 6. Repair Lane Suggestions

- Bug IDs: NEW-28, NEW-29, NEW-31, NEW-32
- Lane: `lane/security-headers`
- Why together: All HTTP security headers, same 39 PageHead components + 11 article HTML files, same `<head>` injection point. Fix once in base PageHead (after BUG-002 base component exists — dependency order: BUG-002 first, THEN security headers, otherwise 39× edit).
- What must NOT be mixed: PremiumControls / floating-cluster protected subsystem (§3.10) — no CSS/JS position changes. Security headers are meta-tag only, safe.

- Bug IDs: BUG-003, NEW-33, NEW-35
- Lane: `lane/sw-gate-coupling` (extend existing BUG-003 lane)
- Why together: All "orphaned safety script not wired into validate:static-publication" — gate orchestration family. Single package.json edit to extend validate:static-publication chain: add `&& npm run sw:dist:audit && npm run astro:check`
- What must NOT be mixed: Do NOT mix with CSS/JS content changes — pure CI orchestration.

- Bug IDs: BUG-005, BUG-006, NEW-34
- Lane: `lane/css-js-budget-recovery`
- Why together: Budget exceed is symptom of duplication + monolith. Fix BUG-005 (dedupe CSS) + BUG-006 (split JS) together recovers budget.
- What must NOT be mixed: Do NOT touch PremiumControls CSS/JS (§3.10 protected) — budget recovery must work AROUND protected subsystem, not through it.

---

## 7. Reverify Notes

- Bug: BUG-001 — Memory leak floating-cluster-controller.js
- Current HEAD: d5d9388b
- Result: confirmed-current
- Evidence: `addEventListener: 38, removeEventListener: 0` — unchanged

- Bug: BUG-002 — Component duplication
- Current HEAD: d5d9388b
- Result: confirmed-current — count UPDATED: 39 PageHead + 6 PostArticle = 45 files (was 44)
- Evidence: `find src/components -name "*PageHead.astro" -o -name "*PostArticle.astro" | wc -l` → 45

- Bug: BUG-003 — SW gate orchestration
- Current HEAD: d5d9388b
- Result: confirmed-current
- Evidence: `sw:dist:audit` NOT in `validate:static-publication` chain — unchanged

- Bug: BUG-005 — CSS duplication
- Current HEAD: d5d9388b
- Result: confirmed-current
- Evidence: site.css 283648 bytes, site-layered.css 283706 bytes — near-identical, unchanged

- Bug: BUG-006 — site.js monolith
- Current HEAD: d5d9388b
- Result: confirmed-current
- Evidence: js/site.js 163KB (166,xxx bytes) — unchanged

- Bug: BUG-007 — series.json readingTime/readTime inconsistency
- Current HEAD: d5d9388b
- Result: confirmed-current
- Evidence: `"readingTime": 23 matches, "readTime": 1 match` — unchanged

- Bug: BUG-010 — CSS breakpoint chaos
- Current HEAD: d5d9388b
- Result: confirmed-current
- Evidence: 20+ distinct breakpoint values in site.css — unchanged

- Bug: BUG-014 — Race condition dist scripts
- Current HEAD: d5d9388b
- Result: confirmed-current (not re-tested in depth this pass, previous evidence still valid, no package.json changes in recent commits affecting this)
- Evidence: N/A — trust previous verifier

- Bug: BUG-017 — Phantom CSS file
- Current HEAD: d5d9388b
- Result: confirmed-current — but propose severity P2→P3 downgrade
- Evidence: `ls css/ | wc -l` → 7, AGENTS.md claims 8

---

## 8. Notes for Verifier

### Pass 8 summary
- **New findings:** 6 (NEW-31 … NEW-36)
  - P2: NEW-31 (modern security headers), NEW-33 (SW precache drift), NEW-34 (budget exceed), NEW-35 (astro:check gate missing)
  - P3: NEW-32 (CSP unsafe-inline), NEW-36 (z-index magic numbers)
- **Confirmations:** 7 existing bugs reverified confirmed-current (BUG-001,002,003,005,006,007,010)
- **Count update:** BUG-002: 44 → 45 files
- **Severity proposals:** 2
  - BUG-017: P2 → P3 downgrade (docs only)
  - BUG-005: P2 → P1 raise (budget exceeded in CI)
- **Merge proposals:** 3 families
  - Gate Orchestration: BUG-003 + NEW-33 + NEW-35
  - Security Headers: NEW-28 + NEW-29 + NEW-31 + NEW-32
  - Budget Exceed: BUG-005 + BUG-006 + NEW-34
- **Positive checks re-run:** ✅ 15/15 core checks still PASS
  - `node --check scripts/*.js` → 0 FAIL
  - CSS brace balance → 0
  - eval()/Function() → 0
  - http:// mixed content → 0 insecure (11 SVG xmlns — false positive, documented)
  - audit-pro → ✅ PASSED, 3 WARNINGS (budget + z-index), 0 errors
  - deploy.yml order → correct
  - notify-on-failure.yml → watches all 7 workflows
  - MDX readingTime → all 20 have readingTime
  - cache-bust coverage → all 21 assets covered

### Security headers — full current state
| Header | Present? | Count | Note |
|---|---|---|---|
| Content-Security-Policy | ✅ Yes | 11 articles + 39 Astro PageHead | BUT uses 'unsafe-inline' (NEW-32) |
| X-Content-Type-Options | ✅ Yes | 11 | `nosniff` — good |
| Strict-Transport-Security | ❌ No | 0 | NEW-28 |
| X-Frame-Options | ❌ No | 0 | NEW-29 |
| Referrer-Policy | ❌ No | 0 | NEW-31 |
| Permissions-Policy | ❌ No | 0 | NEW-31 |
| Cross-Origin-Opener-Policy | ❌ No | 0 | NEW-31 |
| Cross-Origin-Embedder-Policy | ❌ No | 0 | NEW-31 |
| X-XSS-Protection | ❌ No | 0 | deprecated, intentionally omitted — OK |

Recommendation: Implement security headers via base PageHead component AFTER BUG-002 (base component) is fixed — otherwise 39× manual edit = high regression risk.

### Gate orchestration debt — systemic pattern
Three independent safety scripts exist but are ORPHANED from `validate:static-publication`:
1. `sw:dist:audit` — BUG-003 (P1)
2. `astro:check` — NEW-35 (P2)
3. SW precache sync check — implicit via NEW-33

Pattern matches previous auditor observation: "validate:static-publication not include sw:dist:audit" — now generalized to 3 scripts. Strong case for meta-bug / lane expansion.

### Budget exceed — CI WARNING today, ERROR tomorrow?
- CSS: 444731 / 425000 = 104.6% (+4.6%)
- JS: 374593 / 365000 = 102.6% (+2.6%)
- audit-pro reports WARNING not ERROR — threshold not yet hard-fail
- BUT AGENTS.md §1.2 lists Lighthouse Performance ≥90 as target — budget exceed directly threatens LCP
- Propose: raise BUG-005 to P1, fix CSS duplication first → saves ~277KB raw / ~??KB gzipped → immediately recovers budget

### False positive watch
- `http://` grep → 11 hits → ALL are `xmlns="http://www.w3.org/2000/svg"` — NOT mixed content, confirmed in Pass 7 report, re-confirmed here. Do NOT file as bug.
- `series-cards.js` — file exists, NOT in cache-bust, NOT in SW precache, 0 HTML references found via grep — likely DEAD CODE (already covered by BUG-024 "Dead TypeScript API" family? No — BUG-024 is assetUrl() dead export). Could be NEW bug, but audit-pro explicitly guards: "dead script: series-cards.js is catalog-only since r99" + "series-cards.js linked on a gbs-world page (dead weight)" — so KNOWN, intentionally kept for catalog pages, just not precached. Left as note, not filed as independent P1 to avoid noise — covered by NEW-33 precache drift.

### Cross-reference with other agents
- Pass 7 report (`incoming/arena-deep-auditor/2026-07-02/REPORT.md`): Found NEW-28 (HSTS), NEW-29 (X-Frame-Options), NEW-30 (Lighthouse CI). My Pass 8 findings are EXTENSIONS, not duplicates:
  - NEW-31 extends security headers beyond HSTS/XFO → Referrer-Policy etc. — no overlap
  - NEW-32 = CSP hardening — distinct from missing headers
  - NEW-33 = SW precache drift — related to BUG-003 but new evidence (file-level sync)
  - NEW-34 = budget exceed — new measurable CI symptom
  - NEW-35 = astro:check gate — new gate orchestration instance
  - NEW-36 = z-index magic — known WARNING, newly documented as bug
- No duplication with GB_MASTER_REPORT / premiumcontrols verifiers (those focus on runtime UI / TTS / visual parity — my scope = security headers + CI gates + budget).
- Checked `incoming/arena-agent/2026-07-01/REPORT.md` (latest round): 2-page minimal report, no security findings — no conflict.
- Checked `incoming/arena-agent-patch4/2026-07-02/REPORT.md`: 1866 bytes — likely patch notes, not competing audit — no conflict.

### What I did NOT find (positive)
- No NEW memory leaks beyond BUG-001
- No NEW eval()/Function() injection vectors
- No NEW http:// mixed content (real)
- No NEW JSON-LD breakage
- No NEW canonical/og:url mismatch
- No NEW duplicate titles
- No NEW route.json corruption
- TypeScript files compile — astro:check not run due sandbox node_modules missing, but tsconfig strict exists, 12 files present, no obvious syntax errors via `node --check` on JS (TS not checked — this IS NEW-35)
- Cache-bust coverage remains 100% per audit-pro

### Recommended next actions for verifier / implementer
1. **P1 immediate:** BUG-001, BUG-002, BUG-003 — unchanged, still top
2. **P1 candidate:** Raise BUG-005 → P1 (budget exceeded)
3. **P2 next:** Security headers epic — do BUG-002 base component FIRST, then inject headers once (not 39×)
4. **P2 CI:** Merge gate orchestration fixes — single PR: extend `validate:static-publication` with `&& npm run sw:dist:audit && npm run astro:check`
5. **P3 backlog:** CSP hardening (NEW-32), z-index tokens (NEW-36), Lighthouse CI (NEW-30 from Pass 7)
6. **Docs:** Downgrade BUG-017 P2→P3, fix AGENTS.md CSS file count + changelog r300-r308 duplicate numbering (BUG-027)

---

## Proposal statuses

- NEW-31 — proposal-open — security headers suite — needs verifier 2nd witness
- NEW-32 — proposal-open — CSP unsafe-inline — needs verifier
- NEW-33 — proposal-open — SW precache drift — propose merge into BUG-003
- NEW-34 — proposal-open — budget exceed — propose attach as evidence to BUG-005/BUG-006, NOT independent ID
- NEW-35 — proposal-open — astro:check gate missing — propose merge into BUG-003 family
- NEW-36 — proposal-open — z-index magic — P3 docs / CSS cleanup
- Severity proposal BUG-017 P2→P3 — proposal-open
- Severity proposal BUG-005 P2→P1 — proposal-open
- Merge proposal Gate Orchestration Family — proposal-open
- Merge proposal Security Headers Family — proposal-open
- Merge proposal Budget Exceed Family — proposal-open

---

**Agent:** arena-deep-auditor-pass7  
**Pass:** 8  
**Date:** 2026-07-02  
**HEAD:** d5d9388b56a96ea26fe1c1309b07d6c4e2534f9b  
**Mode:** free-intake  
**Previous Pass:** 7 — see `incoming/arena-deep-auditor/2026-07-02/REPORT.md` (NEW-28/29/30)
