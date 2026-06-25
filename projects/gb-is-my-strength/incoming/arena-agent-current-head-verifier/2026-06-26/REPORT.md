# Agent Audit Report — current HEAD verifier

## Meta
- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent-current-head-verifier`
- Date: `2026-06-26`
- Audited branch: `main`
- Audited SHA: `02e1a0ff`
- Current HEAD at start: `02e1a0ff docs: lane report cleanup-double-css-dead-files-2026-06-26`
- Current HEAD at end: `02e1a0ff docs: lane report cleanup-double-css-dead-files-2026-06-26`
- Environment: Arena sandbox, Node `v20.20.2`, npm `10.8.2`
- Build mode: `source/static checks` + later `production-like dist` after installing Node `v22.12.0` under `/tmp`
- Browser / device if used: none in this pass
- Evidence bundle: `evidence/current-head-evidence-2026-06-26.md`

---

## Executive summary

Current source HEAD is **not release-clean** under existing project gates. A later Node 22 production-like build also succeeded, but revealed a dist contract regression on `/karty/avraam/`:

- `npm run validate:all` exits non-zero due to `seo-audit` FAQPage detection.
- `node scripts/audit-pro.js` exits non-zero: 28 errors, mostly stale `floating-cluster-controller.js` hashes, plus `/rodosloviye/` noindex/sitemap conflict and SW precache completeness drift.
- `npm run content:guard` exits non-zero because `/rodosloviye/` is in public baseline while currently noindex/missing from current public extraction.
- Direct source grep confirms **real content corruption** in Antisovetov and Hermeneutics source layers.
- `strangler:build:production-like` succeeds, but `contract:compare:dist` fails with `/karty/avraam/` word-count collapse.

Important nuance: several failures are **tooling/audit drift** after cleanup lanes, not necessarily user-facing production bugs. They still block release gates and must be reconciled.

---

## 1. New Findings

### Finding `CHV-001`

- Title: `seo-audit.js` falsely fails valid minified `FAQPage` JSON-LD
- Severity: P1 (release-gate tooling blocker)
- Route(s):
  - `/articles/20-antisovetov-pastoru/`
  - `/articles/krajne-li-isporcheno-serdce/`
- Source file(s):
  - `scripts/seo-audit.js`
  - `articles/20-antisovetov-pastoru/index.html`
  - `articles/krajne-li-isporcheno-serdce/index.html`
- Observed on SHA: `02e1a0ff`
- Repro steps:
  1. Run `npm run validate:all`
  2. Compare `seo-audit.js` detector with actual HTML JSON-LD.
- Expected:
  - Valid minified JSON-LD with `"@type":"FAQPage"` should pass.
- Actual:
  - `seo-audit.js` requires exact string `"@type": "FAQPage"` with spaces, so minified valid JSON-LD is treated as missing.
- Evidence:
  ```text
  npm run validate:all
  ❌ articles/20-antisovetov-pastoru/index.html: visible FAQ without FAQPage JSON-LD
  ❌ articles/krajne-li-isporcheno-serdce/index.html: visible FAQ without FAQPage JSON-LD
  ```
  Detector in `scripts/seo-audit.js`:
  ```js
  if (!html.includes('"@type": "FAQPage"')) err(file, 'visible FAQ without FAQPage JSON-LD');
  ```
  Direct regex evidence on current HTML:
  ```text
  articles/20-antisovetov-pastoru/index.html
    contains exact old needle: False
    regex FAQPage count: 1
  articles/krajne-li-isporcheno-serdce/index.html
    contains exact old needle: False
    regex FAQPage count: 1
  ```
- Confidence: high
- Verification level: `verified-source` / `reproduced-by-agent`
- Suggested repair lane: `lane/system-seo-audit-jsonld-parser`
- Do not mix with: editorial/content FAQ rewrites; this is a detector bug.
- Comments: Prefer parsing JSON-LD blocks or at least using `/"@type"\s*:\s*"FAQPage"/`.

---

### Finding `CHV-002`

- Title: `/rodosloviye/` is simultaneously noindex, in sitemap, and in public baseline
- Severity: P0/P1 (publication contract + SEO consistency blocker)
- Route(s): `/rodosloviye/`
- Source file(s):
  - `rodosloviye/index.html`
  - `sitemap.xml`
  - `data/public-content-baseline.json`
- Observed on SHA: `02e1a0ff`
- Repro steps:
  1. Run `node scripts/audit-pro.js`.
  2. Run `npm run content:guard`.
  3. Grep route in HTML/sitemap/baseline.
- Expected:
  - Either route is indexable and in sitemap/baseline, or route is noindex and excluded from public search/indexing surfaces.
- Actual:
  - `rodosloviye/index.html` contains `robots="noindex, follow..."`.
  - `sitemap.xml` still lists `https://gospod-bog.ru/rodosloviye/`.
  - `data/public-content-baseline.json` still contains `rodosloviye/index.html`.
  - `content:guard` reports missing public URL.
- Evidence:
  ```text
  audit-pro:
  ❌ sitemap.xml lists pages marked noindex:
    - rodosloviye/index.html — robots="noindex, follow, max-snippet:-1, max-image-preview:large" but listed in sitemap
  ❌ Unexpected noindex:
    - rodosloviye/index.html: robots="noindex, follow, max-snippet:-1, max-image-preview:large"
  ```
  ```text
  npm run content:guard
  ❌ Public content baseline failed:
    - missing URL: https://gospod-bog.ru/rodosloviye/ (rodosloviye/index.html)
  ```
- Confidence: high
- Verification level: `verified-source` / `reproduced-by-agent`
- Suggested repair lane: `lane/seo-rodosloviye-publication-status`
- Do not mix with: React genealogy feature work unless owner chooses to make the page indexable.
- Comments: Decision needed: **indexable with substantial static text**, or **noindex and remove from sitemap/public baseline/search surfaces**.

---

### Finding `CHV-003`

- Title: Public Antisovetov source contains U+FFFD corrupted sentence
- Severity: P0 (public content corruption)
- Route(s): `/articles/20-antisovetov-pastoru/`
- Source file(s): `src/components/article-pilots/antisovetov/AntisovetovBody.astro`
- Observed on SHA: `02e1a0ff`
- Repro steps:
  ```bash
  grep -R $'�' -n src articles baptisty-rossii nagornaya karty hard-texts map about index.html
  ```
- Expected:
  - No replacement character in reader-facing text.
- Actual:
  - One source occurrence in Antisovetov body:
  ```text
  Настоящая сломленность не прос�тематическом искажении фактов перед общиной.
  ```
- Evidence:
  ```text
  src/components/article-pilots/antisovetov/AntisovetovBody.astro:695:<p ...>... Настоящая сломленность не прос�тематическом искажении фактов перед общиной. ...</p>
  ```
- Confidence: high
- Verification level: `verified-source` + `verified-production-like-dist` / `reproduced-by-agent`
- Suggested repair lane: `lane/content-public-text-corruption-2026-06-26`
- Do not mix with: large editorial rewrite of Antisovetov.
- Comments: This matches prior source-repo audit branch finding `BUG-B1`; this intake confirms it on current `main` **and in production-like `dist`**.

---

### Finding `CHV-004`

- Title: Hermeneutics verse/tooltip text corpus contains reader-facing Russian corruption
- Severity: P1 (biblical text/runtime corpus corruption)
- Route(s): `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- Source file(s):
  - `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro`
  - `articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html`
- Observed on SHA: `02e1a0ff`
- Repro steps:
  ```bash
  grep -R 'кик говорят\|называемая , \.Святое' -n src articles ...
  ```
- Expected:
  - Verse/reference text should be grammatically correct and usable by tooltip/runtime layer.
- Actual:
  - `кик говорят некоторые между вами` should be `как говорят некоторые между вами`.
  - `скиния, называемая , .Святое Святых"` is broken punctuation/text.
- Evidence:
  ```text
  src/components/article-pilots/hermenevtika/HermenevtikaBody.astro:360:
  "1 Коринфянам 15:12–14": "Если же о Христе проповедуется, что Он восстал из мёртвых, - кик говорят некоторые между вами..."
  ```
  ```text
  src/components/article-pilots/hermenevtika/HermenevtikaBody.astro:309:
  ... А за второй завесой скиния, называемая , .Святое Святых", имеющая ...
  ```
  Same patterns also found in legacy article HTML.
- Confidence: high
- Verification level: `verified-source` + `verified-production-like-dist` / `reproduced-by-agent`
- Suggested repair lane: `lane/content-public-text-corruption-2026-06-26`
- Do not mix with: full Hermeneutics editorial rewrite.
- Comments: This is a targeted textual repair, not a theological/source-policy change. Production-like `dist` grep also confirms both strings after build.

---

### Finding `CHV-005`

- Title: MDX source has systematic inline-note/glossary concatenation defects
- Severity: P2 (migration-risk content debt)
- Route(s): future MDX-native article routes
- Source file(s):
  - `src/content/articles/dzhon-gill-chast-1-chelovek.mdx`
  - `src/content/articles/dzhon-gill-chast-3-nasledie.mdx`
  - `src/content/articles/krajne-li-isporcheno-serdce.mdx`
- Observed on SHA: `02e1a0ff`
- Repro steps:
  ```bash
  grep -R 'баптистовОсобые\|супралапсарианскойСупра\|КархемишеБитва\|катехизисРеформатский' -n src/content/articles
  ```
- Expected:
  - MDX prose should not glue main text and glossary/inline explanation without punctuation/spacing.
- Actual:
  - Confirmed source patterns:
  ```text
  Особых баптистовОсобые...
  супралапсарианскойСупралапсарианство...
  КархемишеБитва...
  Гейдельбергский катехизисРеформатский...
  ```
- Evidence: see `evidence/current-head-evidence-2026-06-26.md`, section `MDX concatenation debt evidence`.
- Confidence: high for source debt; medium for current public impact (not browser-verified in this pass)
- Verification level: `verified-source` / `reproduced-by-agent`
- Suggested repair lane: `lane/mdx-concatenation-cleanup-2026-06-26`
- Do not mix with: route layout/component refactor.
- Comments: Treat as migration blocker before any MDX body becomes source-of-truth.

---

### Finding `CHV-006`

- Title: `audit-pro.js` SW precache completeness guard is stale after cleanup lanes and now blocks release with false errors
- Severity: P1 (release-gate drift)
- Route(s): all SW-enabled pages indirectly
- Source file(s):
  - `scripts/audit-pro.js`
  - `sw.js`
  - `scripts/cache-bust.js`
- Observed on SHA: `02e1a0ff`
- Repro steps:
  1. Run `node scripts/audit-pro.js`.
  2. Inspect `sw.js` and current asset lists.
- Expected:
  - SW precache guard should require only shipped/runtime assets, not every root `css/*.css` and `js/*.js` file.
- Actual:
  - `sw.js` intentionally no longer precaches `/css/site-layered.css`, `/js/series-cards.js`, `/js/site-modules.js` after cleanup/dead-asset lanes.
  - `audit-pro.js` still reports them as missing live files:
  ```text
  ❌ sw.js PRECACHE_ASSETS missing live files:
    - /css/site-layered.css
    - /js/series-cards.js
    - /js/site-modules.js
  ```
- Evidence:
  - `sw.js` current `PRECACHE_ASSETS` does not include those three assets.
  - `scripts/audit-pro.js` G61 still scans root css/js files and demands all as SW precache entries.
  - `scripts/cache-bust.js` still includes `site-layered.css` and `site-modules.js` comments from an older interpretation: `BUG P0-7/P0-8: в SW precache, не было в cache-bust`.
- Confidence: high
- Verification level: `verified-source` / `reproduced-by-agent`
- Suggested repair lane: `lane/system-asset-contract-reconciliation-2026-06-26`
- Do not mix with: deleting files before owner decision (`series-cards.js`, `site-modules.js`) unless repair lane explicitly covers dead asset retirement.
- Comments: This supersedes the older repair direction “put all root assets into SW”. Current project seems to have moved toward “do not precache non-shipped/dead assets”. The guard must be updated to a canonical shipped-assets list.

---

### Finding `CHV-007`

- Title: Production-like `dist` for `/karty/avraam/` collapses public text from baseline 594 words to ~23–36 words while staying indexable
- Severity: P0/P1 (production artifact content/SEO regression; deploy-readiness gap)
- Route(s): `/karty/avraam/`
- Source/artifact file(s):
  - `karty/avraam/index.html`
  - `src/pages/karty/avraam/index.astro`
  - `src/components/karty/avraam/AvraamMap.astro`
  - `dist/karty/avraam/index.html`
  - `scripts/dist-publication-audit.js` / deploy gate coverage indirectly
- Observed on SHA: `02e1a0ff` after successful `npm run strangler:build:production-like` under Node `v22.12.0`
- Repro steps:
  ```bash
  export PATH="/tmp/node-v22.12.0-linux-x64/bin:$PATH"
  npm ci --no-audit --no-fund
  npm run strangler:build:production-like
  npm run contract:extract:dist
  npm run contract:compare:dist
  ```
- Expected:
  - Production-like `dist` should preserve the public baseline word count/content contract for indexable `/karty/avraam/`, or the route should be deliberately marked app/noindex/search-excluded.
- Actual:
  - Build succeeds and `dist-publication-audit.js --forbid-dev` passes.
  - `page-ownership:dist:production-like` passes.
  - `dist:css-parity` passes.
  - But `contract:compare:dist` fails:
  ```text
  ❌ URL contract compare failed (1 error)
    - word-count drop: https://gospod-bog.ru/karty/avraam/ 594 → 23 (floor 427)
  ```
  - Direct probe shows:
  ```text
  karty/avraam/index.html       words: 963 bytes: 170403 robots: index, follow
  dist/karty/avraam/index.html  words: 36  bytes: 6363   robots: index, follow data-pagefind-body: true
  ```
- Evidence: `evidence/production-like-dist-evidence-2026-06-26.md`, sections `contract:compare:dist` and `karty/avraam word-count probe`.
- Confidence: high
- Verification level: `verified-production-like-dist` / `reproduced-by-agent`
- Suggested repair lane: `lane/karty-avraam-dist-content-contract-2026-06-26`
- Do not mix with: Avraam visual redesign, MapEngine refactor, route.json data changes.
- Comments:
  - This is especially important because `dist-publication-audit.js` says `/karty/avraam/` is indexable and canonical, but it does not catch the text collapse.
  - The route appears to have been converted from a 170KB standalone legacy HTML app to a minimal native app shell with only sr-only summary. That may be intended for app runtime, but then search/indexing and public baseline contract need explicit adjustment.

---

## 2. Confirmations of Existing Findings

### Confirm `P0-10 / PS-10 family`

- Target report: `verified/UNIFIED_BUG_LEDGER_2026-06-25.md`
- Target finding: systemic stale hardcoded asset hashes / cache-busting broken for Astro-owned pages
- My evidence:
  ```text
  node scripts/audit-pro.js
  ❌ Cache-bust mismatch: articles/20-antisovetov-pastoru/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
  ... repeated for 25 pages ...
  ```
  Direct hash witness:
  ```text
  md5(js/floating-cluster-controller.js)[:8] = ba4a4019
  grep finds 25 HTML refs to ?v=5c91b618
  ```
- Same bug / related / stronger root cause:
  - Same root family: asset hash drift after `floating-cluster-controller.js` changes.
  - Current evidence narrows concrete blast radius to **25 root HTML references** for the fc controller.
- Recommended status: `confirmed-current` for the fc-controller hash drift subset; verifier should reconcile against already-fixed/pending P0-10 notes.

---

### Confirm `P0-NEW / P0-7 / P0-8 evolution`

- Target report: `verified/UNIFIED_BUG_LEDGER_2026-06-25.md`, later Round 9-14 amendments
- Target finding: `site-layered.css` and `site-modules.js` SW precache 404 / cache-bust asymmetry
- My evidence:
  - Current `sw.js` no longer precaches `site-layered.css` or `site-modules.js`.
  - Current `audit-pro.js` still demands them as missing SW precache entries.
- Same bug / related / stronger root cause:
  - The original SW 404 bug appears fixed in source by removing those assets from SW precache.
  - Remaining bug is now **audit drift**, captured as `CHV-006`.
- Recommended status: original SW 404 should be `fixed-current` after verifier confirms with production-like dist; current active issue should be `audit-drift`.

---

## 3. Challenges / Disputes

### Challenge `repair-order-2026-06-26-top-verifier.md / P3-8 FAQ accordion`

- Target report: `verified/repair-order-2026-06-26-top-verifier.md`
- Target finding: `P3-8: faq-accordion.js not loaded` with recommendation to add `site-modules.js`
- Reason for challenge:
  - Current `js/enhancements.js` contains FAQ-related logic and likely already owns FAQ JSON-LD/accordion behavior.
  - `js/site-modules.js` is not loaded anywhere and previous ledgers already flagged `faq-accordion.js` as likely dead/duplicate code.
  - Adding `site-modules.js` to pages may reintroduce the very dead bundle / SW asset confusion that cleanup lanes tried to remove.
- Current HEAD evidence:
  ```text
  grep -o "faq-accordion__q" js/enhancements.js | wc -l → 2
  grep -o "aria-expanded" js/enhancements.js | wc -l → 4
  grep -R "site-modules.js" HTML/Astro → no production page loads it
  ```
- Recommended status: `disputed`; needs Playwright browser click witness before implementation. Do **not** add `site-modules.js` solely from source absence of `faq-accordion.js`.

---

### Challenge older “put non-shipped assets into SW/cache-bust” repair direction

- Target report: older sections of `UNIFIED_BUG_LEDGER_2026-06-25.md` and `repair-order-unified-2026-06-25.md`
- Target finding: P0-7/P0-8/P1-18 suggestions to add `site-layered.css` and `site-modules.js` to cache-bust/SW lists
- Reason for challenge:
  - Current cleanup direction has removed `site-layered.css` and `site-modules.js` from SW precache.
  - These assets are not runtime-loaded by current production pages.
  - Current active problem is that `audit-pro` still treats all root assets as shipped.
- Current HEAD evidence:
  - `sw.js` no longer lists them.
  - `audit-pro.js` fails because it expects them.
- Recommended status: `superseded`; canonical repair should be **single shipped asset contract**, not unconditional inclusion of all root files in SW.

---

## 4. Duplicate / Merge Proposals

### Merge proposal: `CHV-003` + prior source-repo `BUG-B1`

- Finding A: `CHV-003` Antisovetov U+FFFD corrupted sentence
- Finding B: source-repo branch audit `audit/svg-pilot-bug-research-2026-06-25.md / BUG-B1`
- Why same root cause: same source file and same corrupted phrase.
- Canonical ID suggestion: `CONTENT-P0-ANTISOVETOV-UFFFD-2026-06-26`

### Merge proposal: `CHV-004` + prior source-repo `BUG-B2`

- Finding A: `CHV-004` Hermeneutics verse corpus corruption
- Finding B: source-repo branch audit `BUG-B2`
- Why same root cause: same embedded runtime verse/reference corpus.
- Canonical ID suggestion: `CONTENT-P1-HERMENEUTICS-VERSE-CORPUS-2026-06-26`

### Merge proposal: `CHV-006` + P0-NEW/P0-7/P0-8 residuals

- Finding A: `CHV-006` stale SW completeness guard
- Finding B: older P0-NEW/P0-7/P0-8 family after source fix
- Why same root cause: asset shipped/unshipped contract moved, but guards still disagree.
- Canonical ID suggestion: `TOOLING-P1-SHIPPED-ASSET-CONTRACT-DRIFT-2026-06-26`

---

## 5. Severity Proposals

- Target bug: `CHV-003`
  - Current severity: new P0 proposal
  - Proposed severity: P0
  - Evidence: reader-facing U+FFFD in Astro source; only one occurrence but high-visibility article.

- Target bug: `CHV-001`
  - Current severity: new P1 proposal
  - Proposed severity: P1
  - Evidence: `validate:all` is red, but root cause is audit detector not public page content.

- Target bug: `CHV-006`
  - Current severity: new P1 proposal
  - Proposed severity: P1
  - Evidence: `audit-pro` red; blocks release, but root cause is guard drift rather than runtime breakage.

---

## 6. Repair Lane Suggestions

### Lane: `lane/system-release-gate-reconciliation-2026-06-26`

- Bug IDs:
  - `CHV-001`
  - `CHV-002`
  - `CHV-006`
  - fc-controller hash drift subset of `P0-10`
- Why together:
  - All are current release-gate blockers and source/publication contract conflicts.
- What must NOT be mixed:
  - Content rewrites
  - Floating cluster UI redesign
  - MapEngine feature work
  - Big docs cleanup

### Lane: `lane/content-public-text-corruption-2026-06-26`

- Bug IDs:
  - `CHV-003`
  - `CHV-004`
- Why together:
  - Both are confirmed source text corruption in public/high-visibility article content.
- What must NOT be mixed:
  - MDX native migration
  - Theology/source rewrites
  - Styling changes

### Lane: `lane/mdx-concatenation-cleanup-2026-06-26`

- Bug IDs:
  - `CHV-005`
- Why together:
  - All are MDX migration-risk defects caused by the same inline-note/glossary concatenation family.
- What must NOT be mixed:
  - Production route shell changes
  - PageHead / SEO changes

---

## 7. Reverify Notes

- Bug: strict native migration status
  - Current HEAD: `02e1a0ff`
  - Result: `confirmed-current`
  - Evidence:
    ```text
    npm run native:runtime:audit:strict
    strict-native: 51 / 52 routes
    legacy-shadow-app-intentional: 1 / 52
    ✅ native runtime taxonomy completed
    ```

- Bug: migration metadata strict health
  - Current HEAD: `02e1a0ff`
  - Result: `confirmed-current`
  - Evidence:
    ```text
    npm run migration:metadata:check:strict
    ✅ Route profiles coherent with page ownership
    ✅ Route migration modes are coherent with matrix
    ✅ Content source coverage is coherent
    ```

- Bug: data/search/series consistency
  - Current HEAD: `02e1a0ff`
  - Result: `confirmed-current`
  - Evidence from earlier run in this session:
    ```text
    npm run data:consistency
    ✅ Data consistency passed
    ```

---

## 8. Notes for Verifier

1. This intake intentionally does **not** mark anything repair-ready. It provides current HEAD source evidence for verifier reconciliation.
2. The strongest immediate fixes are small and surgical:
   - FAQPage detector regex/parser in `seo-audit.js`.
   - Cache-bust update or Astro/source hash mechanism for `floating-cluster-controller.js` references.
   - `/rodosloviye/` publication-status decision.
   - Antisovetov/Hermeneutics corrupted text repairs.
   - Reconcile shipped asset list used by `audit-pro`, `cache-bust`, and `sw.js`.
3. Several older verified docs contain stale or contradictory repair directions after 26 June cleanup lanes. Please prioritize current HEAD evidence over older blanket instructions.
4. Browser verification still required for mobile tooltip / Bible reference / Gill rail persistence bugs. I did not confirm those in this intake.

---

## Files in this intake folder

- `README.md` — meta/scope
- `REPORT.md` — this report
- `evidence/current-head-evidence-2026-06-26.md` — raw command output
- `comments/` — empty in this intake
- `proposals/` — empty in this intake
- `artifacts/` — empty in this intake
