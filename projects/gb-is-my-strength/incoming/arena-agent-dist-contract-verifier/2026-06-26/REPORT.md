# Agent Audit Report — dist-contract release-gate verification

## Meta
- Project: gb-is-my-strength
- Source repo: `https://github.com/FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent-dist-contract-verifier`
- Date: 2026-06-26
- Audited branch: `main`
- Audited SHA: `02e1a0f`
- Current HEAD at start: `02e1a0f`
- Current HEAD at end: `02e1a0f`
- Environment: Arena.ai Agent Mode; default Node `v20.20.2`; Astro build executed with `npx -y node@22` (`v22.23.1`)
- Build mode: source + production-like dist (`astro build` under Node 22, `copy-legacy-to-dist.js --omit-build-only`, `astro-cache-bust-postbuild.js`, Pagefind)
- Browser / device if used: none; this pass uses source/build/dist/network evidence

---

## Executive Summary

Current `gb-is-my-strength` HEAD `02e1a0f` still has **release-gate and production-like artifact issues** after the previous repair sessions.

### New / net-new current-head findings in this intake

| Temp ID | Severity | Title | Main evidence |
|---|---:|---|---|
| `N-2026-06-26-01` | P0 | `seo-audit.js` FAQPage detector is whitespace-fragile and falsely fails `validate:static-publication` | `01-validate...log`, `02-seo-faq...log` |
| `N-2026-06-26-02` | P0 | Root `/rodosloviye/` is `noindex` while listed in sitemap/baseline; root contract and audit-pro fail | `03-audit-pro...log`, `04-root-contract...log` |
| `N-2026-06-26-03` | P0 | `audit-pro.js` SW precache expectation is stale after cleanup; it still requires removed/non-precached files | `03-audit-pro...log` |
| `N-2026-06-26-04` | P1 | Production-like dist `/karty/ishod/` has invalid JSON-LD; current deploy gates miss it | `08-dist-jsonld...log` |
| `N-2026-06-26-05` | P1 | Production-like dist `/karty/avraam/` drops baseline word count 594 → 23; dist contract fails | `07-dist-contract...log` |

### Existing finding confirmed / strengthened

| Existing ID | Result | Evidence |
|---|---|---|
| `P1-5` | confirmed-current, stronger root cause | Matrix uses `strict-native-app` 13 times but `.modes` does not define it; route profiles also mismatch matrix for 15 routes (`05-migration...log`). |

### Non-finding

`source-link-audit --root dist` passed hard-check on this run. It produced warnings only; no hard 404 was confirmed in this pass. See `09-source-link-audit-dist-02e1a0f.log`.

---

## 1. New Findings

### Finding `N-2026-06-26-01`

- Title: `seo-audit.js` FAQPage detector is whitespace-fragile and falsely fails `validate:static-publication`
- Severity: **P0** — release-gate blocker / tooling false positive
- Route(s): `/articles/20-antisovetov-pastoru/`, `/articles/krajne-li-isporcheno-serdce/`
- Source file(s): `scripts/seo-audit.js`, affected article HTML files
- Observed on SHA: `02e1a0f`
- Repro steps:
  1. Run `npm run validate:static-publication:light`.
  2. Observe failure in `npm run seo-audit`.
  3. Grep affected pages and inspect `scripts/seo-audit.js` predicate.
- Expected: if visible FAQ markup exists and the JSON-LD graph contains `FAQPage`, SEO audit should pass.
- Actual: `seo-audit.js` only checks exact string `"@type": "FAQPage"`, but production HTML uses compact JSON `"@type":"FAQPage"`. Audit fails despite valid FAQPage JSON-LD.
- Evidence:
  - `evidence/01-validate-static-publication-light-02e1a0f.log`:
    ```text
    ❌ articles/20-antisovetov-pastoru/index.html: visible FAQ without FAQPage JSON-LD
    ❌ articles/krajne-li-isporcheno-serdce/index.html: visible FAQ without FAQPage JSON-LD
    SEO audit failed: 2 errors, 0 warnings.
    ```
  - `evidence/02-seo-faq-false-positive-02e1a0f.log`:
    ```text
    hasCompact: true,
    hasSeoAuditLiteral: false,
    faqMarkup: true
    ```
  - `scripts/seo-audit.js` contains:
    ```js
    if (!html.includes('"@type": "FAQPage"')) err(file, 'visible FAQ without FAQPage JSON-LD');
    ```
- Confidence: high
- Verification level: L2 by direct source + command evidence on current HEAD
- Suggested repair lane: `lane/release-gate-seo-audit-faq-jsonld-2026-06-26`
- Do not mix with: visual changes or FAQ content rewrites
- Suggested fix: parse JSON-LD blocks or use whitespace-tolerant regex `/"@type"\s*:\s*"FAQPage"/`.

---

### Finding `N-2026-06-26-02`

- Title: Root `/rodosloviye/` is `noindex` while sitemap/baseline list it as public; root contract and audit-pro fail
- Severity: **P0** — release-gate blocker in source/root audit layer
- Route(s): `/rodosloviye/`
- Source file(s): `rodosloviye/index.html`, `sitemap.xml`, `data/public-content-baseline.json`, `scripts/audit-pro.js`, URL contract reports
- Observed on SHA: `02e1a0f`
- Repro steps:
  1. Run `node scripts/cache-bust.js` then `node scripts/audit-pro.js`.
  2. Run `npm run contract:compare`.
  3. Inspect root `rodosloviye/index.html` robots meta and sitemap/baseline.
- Expected: a URL listed in sitemap and public baseline should be indexable in the audited root layer, or the root-layer audit must intentionally ignore stale fallback HTML.
- Actual:
  - root `rodosloviye/index.html` has `noindex, follow`;
  - `sitemap.xml` lists `https://gospod-bog.ru/rodosloviye/`;
  - `data/public-content-baseline.json` expects `rodosloviye/index.html` as public URL;
  - root contract extractor omits it, causing missing baseline URL.
- Evidence:
  - `evidence/03-audit-pro-after-cache-bust-02e1a0f.log`:
    ```text
    ❌ sitemap.xml lists pages marked noindex:
      - rodosloviye/index.html — robots="noindex, follow, max-snippet:-1, max-image-preview:large" but listed in sitemap
    ❌ Unexpected noindex:
      - rodosloviye/index.html: robots="noindex, follow, max-snippet:-1, max-image-preview:large"
    ```
  - `evidence/04-root-contract-rodosloviye-02e1a0f.log`:
    ```text
    ❌ URL contract compare failed (1 error(s))
      - missing baseline URL: https://gospod-bog.ru/rodosloviye/ (rodosloviye/index.html)
    ```
- Confidence: high
- Verification level: L2 by direct source + audit/contract evidence on current HEAD
- Suggested repair lane: `lane/release-gate-rodosloviye-root-contract-2026-06-26`
- Do not mix with: React genealogy visual refactor
- Suggested fix options:
  1. If `/rodosloviye/` is intended public: change root fallback `rodosloviye/index.html` robots to `index, follow...` and rerun cache-bust/contract.
  2. If root fallback is intentionally stale: change audits/contract extraction to use production-like dist, not root, for this route. This is higher-risk.

---

### Finding `N-2026-06-26-03`

- Title: `audit-pro.js` SW precache expectation is stale after cleanup; it still requires files absent from `sw.js`
- Severity: **P0** — release-gate blocker after `cache-bust`
- Route(s): global Service Worker / audit tooling
- Source file(s): `scripts/audit-pro.js`, `sw.js`, `scripts/cache-bust.js`, `js/series-cards.js`, `js/site-modules.js`, `css/site-layered.css`
- Observed on SHA: `02e1a0f`
- Repro steps:
  1. Run `node scripts/cache-bust.js`.
  2. Run `node scripts/audit-pro.js`.
  3. Inspect reported SW precache errors.
- Expected: after session2 cleanup (`series-cards.js` removed from SW precache and cache-bust ASSETS), audit-pro should agree with the current SW/cache-bust policy.
- Actual: `audit-pro.js` still fails with:
  ```text
  ❌ sw.js PRECACHE_ASSETS missing live files:
    - /css/site-layered.css
    - /js/series-cards.js
    - /js/site-modules.js
  ```
  even though current `sw.js` PRECACHE_ASSETS does not include these three paths.
- Evidence:
  - `evidence/03-audit-pro-after-cache-bust-02e1a0f.log` contains the residual three-file error after cache-bust.
  - Latest AuditRepo session2 report says P2-14 removed `/js/series-cards.js` from `sw.js` and `cache-bust.js`, so this is a post-cleanup audit contract drift, not the original dead-code bug alone.
- Confidence: high
- Verification level: L2 by direct command evidence on current HEAD
- Suggested repair lane: `lane/release-gate-audit-pro-sw-contract-sync-2026-06-26`
- Do not mix with: SW runtime strategy changes or deletion of source assets without owner decision
- Suggested fix: update the specific audit-pro SW expected-live-files contract to derive from current `PRECACHE_ASSETS` or a single canonical SW asset list, not from stale hardcoded expectations.

---

### Finding `N-2026-06-26-04`

- Title: Production-like dist `/karty/ishod/` has invalid JSON-LD; current deploy gates miss it
- Severity: **P1** — SEO structured-data break + gate gap on indexable production route
- Route(s): `/karty/ishod/`
- Source file(s): `src/components/karty/ishod/IshodPageHead.astro`; production artifact `dist/karty/ishod/index.html`
- Observed on SHA: `02e1a0f`
- Repro steps:
  1. Build production-like dist with Node 22 Astro build + legacy copy + postbuild cache-bust + Pagefind.
  2. Parse all dist JSON-LD blocks with `JSON.parse`.
- Expected: every `<script type="application/ld+json">` in production-like dist should parse as JSON.
- Actual: `/karty/ishod/` JSON-LD block has an extra `}` after the Organization node: `..."sameAs":[...]}},{"@type":"WebSite"...`.
- Evidence:
  - `evidence/08-dist-jsonld-parse-02e1a0f.log`:
    ```text
    JSON-LD errors: 1
    dist/karty/ishod/index.html block 1: Expected ',' or ']' after array element in JSON at position 344
    SNIP={"@context":"https://schema.org","@graph":[{"@type":"Organization", ... "sameAs":[...]}},{"@type":"WebSite"...
    ```
  - `evidence/06-production-like-dist-build-02e1a0f.log` proves the artifact was built production-like.
- Confidence: high
- Verification level: L2 by production-like artifact parse on current HEAD
- Suggested repair lane: `lane/karty-ishod-jsonld-dist-2026-06-26`
- Do not mix with: visual/map-engine changes
- Suggested fix:
  1. Fix extra brace in `src/components/karty/ishod/IshodPageHead.astro` or replace string JSON-LD with object + `JSON.stringify`.
  2. Add a dist JSON-LD parse check to `dist-publication-audit.js` or a dedicated `dist:jsonld:audit` gate. Current root `seo-audit.js` is insufficient because it does not validate production-like dist.

---

### Finding `N-2026-06-26-05`

- Title: Production-like dist `/karty/avraam/` drops baseline word count 594 → 23; dist contract fails
- Severity: **P1** — production-like content/SEO contract regression on an indexable app route
- Route(s): `/karty/avraam/`
- Source file(s): `src/components/karty/avraam/AvraamMap.astro`, `data/public-content-baseline.json`, `scripts/compare-url-contract.js`
- Observed on SHA: `02e1a0f`
- Repro steps:
  1. Build production-like dist.
  2. Run `npm run contract:extract:dist && npm run contract:compare:dist`.
- Expected: indexable production-like route should meet baseline word floor or have an intentional app-route exception encoded in the contract.
- Actual: dist contract fails:
  ```text
  word-count drop: https://gospod-bog.ru/karty/avraam/ 594 → 23 (floor 427)
  ```
  Current Astro component uses an `sr-only` `h1 data-pagefind-body` as the searchable body, so the indexable page has very thin static content compared to the old baseline.
- Evidence:
  - `evidence/07-dist-contract-avraam-02e1a0f.log`.
- Confidence: high
- Verification level: L2 by production-like dist contract evidence on current HEAD
- Suggested repair lane: `lane/karty-avraam-accessible-indexable-body-2026-06-26`
- Do not mix with: map engine visual/runtime refactor
- Suggested fix options:
  1. Preferred: add an accessible/indexable textual layer for the map (summary, route stages, places, chronology, archaeology, usage notes) under `data-pagefind-body`, visually hidden only if necessary but semantically real; target >= baseline floor.
  2. Alternative: if owner decides app routes should be thin, encode a deliberate exception in `data/public-content-baseline.json` / contract. This is SEO-weaker and should be explicit.

---

## 2. Confirmations of Existing Findings

### Confirm / strengthen `P1-5` — migration matrix/profile conflict

- Target report: `verified/UNIFIED_BUG_LEDGER_2026-06-25.md` and latest session2 remaining-open list
- Target finding: `P1-5 — page-ownership vs route-migration-matrix conflict`
- My evidence: `evidence/05-migration-matrix-profile-mismatch-02e1a0f.log`
- Same bug / related / stronger root cause: **same family, stronger root cause.** Current official checks say green, but an independent consistency probe finds:
  ```text
  Invalid route modes: 13
   - /karty/avraam/: strict-native-app
   - /karty/early-church/: strict-native-app
   ...
   - /rodosloviye/: strict-native-app
  Profile/matrix mismatches: 15
   - /articles/: profile=native-main-with-legacy-chrome, matrix=strict-native
   - /biografii/: profile=native-main-with-legacy-chrome, matrix=strict-native
   - /karty/avraam/: profile=legacy-shadow-app, matrix=strict-native-app
   ...
  ```
- Important nuance: `npm run migration:metadata:check:strict` passes before the independent probe. Therefore the bug is not only data drift; it is also a **guard blind spot**.
- Recommended status: `confirmed-current`; keep/open as P1 or split into:
  1. data alignment bug (`matrix/profiles disagree`), and
  2. tooling bug (`strict matrix/profile checks do not validate mode enum or profile/matrix equality`).

### Confirm existing Baptisty SEO/structured-data issues (`BUG-026`, Baptisty SVG OG, missing Article dates)

- Target reports:
  - `incoming/arena-agent-toc/2026-06-25/full-bug-audit-rounds-1-3-2026-06-25.md` (`BUG-026`)
  - `incoming/arena-agent-verifier-2/2026-06-25/independent-verification-and-new-bugs-2026-06-25.md` (Baptisty `og:image` SVG issue)
- Target findings:
  - All 10 `baptisty-rossii/*` article pages lack `BreadcrumbList` JSON-LD.
  - All 10 article pages have `Article` JSON-LD without `datePublished`/`dateModified`.
  - All 10 article pages use SVG social image; 11 total Baptisty pages have SVG `og:image` (including hub).
- My evidence: `evidence/12-baptisty-dist-structured-data-og-02e1a0f.log`
- Production-like dist result on current HEAD:
  ```text
  TOTAL { pages: 10, missingDates: 10, missingBreadcrumbList: 10, svgOg: 10 }
  ```
  Earlier full-site summary from the same probe found `svg og = 11` when including the Baptisty hub.
- Recommended status: `confirmed-current` for the 10 article-page structured-data issues. Treat WebP/JPG OG generation as a separate repair lane because it may need image assets/owner visual approval.

---

## 3. Challenges / Disputes

### Challenge / refine previous `P1-9` and `P2-14` status

- Target report: `incoming/arena-agent-session2/2026-06-26/REPORT.md`
- Target finding:
  - `P1-9` — audit-pro CACHE_BUST_ASSETS hardcoded lie
  - `P2-14` — `series-cards.js` in SW precache but never loaded
- Reason for challenge/refinement:
  - The **original** session2 fix appears applied for `series-cards.js` removal from `sw.js`/`cache-bust.js`.
  - However, current `audit-pro.js` still fails after cache-bust because a different stale SW-expected-live-files contract still demands `/js/series-cards.js`, `/js/site-modules.js`, `/css/site-layered.css`.
- Current HEAD evidence: `evidence/03-audit-pro-after-cache-bust-02e1a0f.log`
- Recommended status:
  - original `P2-14`: likely `fixed-current` in its SW/cache-bust part;
  - original `P1-9`: partially fixed in CACHE_BUST_ASSETS sync sense;
  - open a new/residual bug `N-2026-06-26-03` for audit-pro SW expected-files drift.

---

## 4. Duplicate / Merge Proposals

### Merge proposal: `N-2026-06-26-02` and root contract symptoms

- Finding A: `N-2026-06-26-02` root `/rodosloviye/` noindex
- Finding B: root `contract:compare` missing baseline URL for `/rodosloviye/`
- Why same root cause: contract extractor omits `/rodosloviye/` because root HTML says `noindex`, while sitemap/baseline still list it.
- Canonical ID suggestion: `RODOSLOVIYE-ROOT-NOINDEX-CONTRACT-02e1a0f`

### Merge proposal: `N-2026-06-26-04` and dist JSON-LD audit gap

- Finding A: `/karty/ishod/` invalid JSON-LD in dist
- Finding B: deploy/dist publication gates do not parse dist JSON-LD
- Why same root cause: string-authored JSON-LD in Astro head can break production artifact without being caught by root-only `seo-audit.js`.
- Canonical ID suggestion: keep route bug and add subtask/gate bug: `DIST-JSONLD-AUDIT-GAP`.

---

## 5. Severity Proposals

- `N-2026-06-26-01`: P0 because it blocks `validate:static-publication` at `seo-audit` before any release checks can proceed. It is a tooling false-positive, but release-blocking.
- `N-2026-06-26-02`: P0 because it blocks `audit-pro` and root URL contract on current HEAD.
- `N-2026-06-26-03`: P0 because `audit-pro` still fails after `cache-bust`, blocking the standard release barrier.
- `N-2026-06-26-04`: P1 because it affects one public indexable route's structured data and reveals a production-gate gap.
- `N-2026-06-26-05`: P1 because it is a production-like dist contract/content regression on an indexable flagship app route.

---

## 6. Repair Lane Suggestions

### Lane A — `release-gate-recovery-02e1a0f`

- Bug IDs: `N-2026-06-26-01`, `N-2026-06-26-02`, `N-2026-06-26-03`
- Why together: all three currently block source/root release gates (`validate:static-publication`, `audit-pro`, `contract:compare`).
- What must NOT be mixed: no visual page redesigns, no MapEngine work, no broad content changes.
- Minimal done criteria:
  - `npm run validate:static-publication:light` passes past `seo-audit`;
  - `node scripts/cache-bust.js && node scripts/audit-pro.js` has 0 errors;
  - `npm run contract:compare` no longer misses `/rodosloviye/`.

### Lane B — `dist-artifact-seo-contract-02e1a0f`

- Bug IDs: `N-2026-06-26-04`, `N-2026-06-26-05`
- Why together: both are production-like dist artifact issues not caught by root-only checks.
- What must NOT be mixed: no app visual redesign.
- Minimal done criteria:
  - production-like dist JSON-LD parse = 0 errors;
  - `contract:compare:dist` passes or has an explicit owner-approved app-route exception;
  - `dist-publication-audit` or an added dist JSON-LD audit catches future recurrence.

### Lane C — `migration-metadata-contract-hardening-02e1a0f`

- Bug IDs: existing `P1-5` strengthened by this intake
- Why together: data alignment + guard hardening.
- Done criteria:
  - every route mode in `migration/route-migration-matrix.json` is defined in `.modes`;
  - route profiles agree with matrix for routes they cover, or deviations are explicit and documented;
  - `migration:metadata:check:strict` fails on undefined mode or profile/matrix mismatch.

---

## 7. Reverify Notes

- Bug: `source-link-audit` hard errors
  - Current HEAD: `02e1a0f`
  - Result: no hard source-link error reproduced in this run; warnings only.
  - Evidence: `evidence/09-source-link-audit-dist-02e1a0f.log`

- Bug: previous `P1-9` / `P2-14` repair completion
  - Current HEAD: `02e1a0f`
  - Result: original cache-bust/SW parts partly fixed, but residual audit-pro SW expected-files drift remains as `N-2026-06-26-03`.
  - Evidence: `evidence/03-audit-pro-after-cache-bust-02e1a0f.log`

- Bug: `P1-5` migration metadata conflict
  - Current HEAD: `02e1a0f`
  - Result: confirmed-current with stronger evidence and guard blind spot.
  - Evidence: `evidence/05-migration-matrix-profile-mismatch-02e1a0f.log`

---

## 8. Notes for Verifier

1. This intake intentionally does not edit canonical `verified/` ledgers. Please promote/downgrade/archive according to Multi-witness protocol.
2. `N-2026-06-26-01` is not a content SEO bug; the pages already contain `FAQPage`. It is a **release-blocking audit false-positive**.
3. `N-2026-06-26-03` should not be collapsed back into old `P2-14` without nuance: session2 removed `series-cards.js` from SW/cache-bust, but `audit-pro` still expects it. That is a residual audit contract drift.
4. The production-like dist was built explicitly through the strangler path, not plain `astro build` only. See `evidence/06-production-like-dist-build-02e1a0f.log`.
5. The current default sandbox Node is 20; Node 22 was used for Astro build. This matches AuditRepo's build-mode warning.
6. AuditRepo structure check passed, but `validate_audit_repo.py` fails on pre-existing repository issues outside this intake (root `SANDBOX-ENV-2026-06-21.md` and older intake folders without README). See `evidence/11-auditrepo-validation.log`. This new intake itself has README/REPORT/evidence and follows the scaffolded structure.
