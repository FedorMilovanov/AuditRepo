# Runtime JS audit — 2026-06-25

Independent forensic pass focused on **runtime JavaScript behaviour**, cross-validated
against the existing `arena-agent` intake via a *different methodology* (no heavy
`dist` build — pure runtime execution in a Node DOM stub), plus source-level grep
verification of the previously-reported route-level findings.

## Meta
- Project: `gb-is-my-strength` / gospod-bog.ru
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent-2`
- Date: 2026-06-25
- Commit / branch audited: `main` (HEAD ≈ `fb8e492`, cloned fresh)
- Environment: Node 22, workspace sandbox. No `node_modules` install — runtime
  files executed directly against a hand-built DOM stub.
- Build mode: **source / root layer** (NOT production-like dist — see §6 for the
  source-vs-artifact distinction on PS-05/PS-07).

## Method

1. **Read full documentation first** — `README.md`, `package.json`, `AGENTS.md`
   contracts, `astro.config.mjs`, all template/README files in this AuditRepo.
2. **Runtime execution proof** — for the suspected crash in `floating-cluster-controller.js`,
   built a minimal DOM stub (`document`, `window`, `localStorage`, `navigator`) and
   `require()`-ed the file. This proves the crash *without* needing `npm install`
   or a Playwright browser, and is a fully independent confirmation path vs the
   Playwright + `strangler:build:production-like` method used by `arena-agent`.
3. **Source-level grep / Python scans** of `articles/**`, `nagornaya/**`,
   `js/**`, `sw.js`, `src/components/**` to verify the route-level findings
   (PS-05/PS-06/PS-07) directly in the committed source.
4. **Consistency checks** — `sitemap.xml` (43 URLs ↔ local files), `series.json`
   (keys ↔ `data-gbs2-series` ↔ folders), `manifest.json` icons, `BookmarkEngine`
   API surface.

---

## 1. CONFIRMED bugs

### CR-FCC-01 — `floating-cluster-controller.js` throws `qs is not defined` (P0)

- **Severity:** P0 — shared runtime crash
- **Route(s):** every page loading the controller AND having `[data-fc-root]`
  (8 in root: hermenevtika, kod-da-vinchi, 20-antisovetov, gill-context,
  gill-chast-1/2/3, gill-spravochnik). `arena-agent` extended this to 13 routes
  in production-like `dist` (incl. 5 Nagornaya pages) — the extra routes come from
  the dist build wiring more pages to the controller.
- **Cross-validation:** **CONFIRMED independently** of `arena-agent` PS-01.
  They used Playwright on dist; I used direct Node execution on source. Both
  agree on root cause.
- **Repro (my method):**

  ```bash
  # minimal DOM stub, readyState:'complete' → ready() runs synchronously
  node test-fcc.js   # → ReferenceError: qs is not defined
  ```

- **Root cause:** the IIFE closes at line 389 (`})();`), but three functions —
  `initTocPopups` (line 394), `initActionHandlers` (457), `initPlayExpand` (483) —
  are declared **after** it, in global scope. They reference `qs`/`qsa`, which are
  local to the IIFE (lines 32–33) and do not leak (strict mode). `ready()` runs
  synchronously under `defer`, calls `initTocPopups()` first → crash → the entire
  init callback aborts **before** `initCluster`, so cluster click-delegation,
  theme/save/sync, keyboard shortcuts, `#mobTocBtn`, TOC overlays, and
  `window.__gbCluster` are all never set up.
- **Evidence:** full Node trace + exact line numbers in `arena-agent-2` raw report
  `runtime-js-bugs-2026-06-25.md` (sibling file).
- **Status:** `confirmed` (two independent methods).

### CR-FCC-02 — Speed-select panel never created on Gill v16 pages (P1, latent)

- **Severity:** P1 — currently masked by CR-FCC-01; surfaces only after it is fixed.
- **File:** `js/floating-cluster-controller.js`, `initPlayExpand()` (~line 491).
- **Bug:**

  ```js
  qsa('.gb-ember').forEach(function(ember) {
    if (!ember.closest('.gb-floater')) return;   // ← hard filter
    ...
  });
  ```

  The speed panel (`0.75×…2×`) is only built for embers inside `.gb-floater`.
  On Gill v16 pages the embers live in `.gbs-rail-foot` / `.mobile-bottom-bar`
  (`.gb-floater` is absent from Gill markup — verified by grep). So even after
  CR-FCC-01 is fixed, the speed selector will **never appear** on Gill pages.
- **Status:** `confirmed` (source grep). **Not present in the existing matrix**
  (PS-01..PS-10) — new finding.
- **Fix:** broaden selector to `.gb-floater, .gbs-rail-foot, .mobile-bottom-bar`
  (or drive it off a data attribute on the target embers).

### CR-HERM-01 — Hermeneutics hidden readTime mismatch (P1)

- **Severity:** P1 — stale search/index metadata vs visible content.
- **Route:** `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- **Cross-validation:** **CONFIRMED in committed source** — same finding as
  `arena-agent` PS-06.

  ```html
  <span data-pagefind-meta="readTime" hidden="">35</span>
  ```
  Hidden Pagefind value = **35**, while `SITE_CONFIG.readingTime` and visible
  `⏱` both = **50**.
- **Status:** `confirmed` in root source (line 806).

### CR-SW-01 — sw-register.js toast logic error (P2)

- **Severity:** P2 — update/offline/cached notifications may never show.
- **File:** `js/sw-register.js`, function `r()`.

  ```js
  var e=document.getElementById("gb-sw-toast");
  e&&e!==a || e!==a&&document.body.appendChild(a)
  ```

  When a **different** element already holds id `gb-sw-toast`, `e&&e!==a`
  short-circuits and `appendChild` is skipped → the real toast node `a` stays
  detached → "Сайт обновлён" / "Вы офлайн" / "Статья доступна офлайн" never render.
- **Status:** `confirmed` (logic trace + truth-table check). **New finding.**
- **Fix:** `if (!e || e !== a) document.body.appendChild(a);`

### CR-SW-02 — Service Worker precache useless for `?v=`-versioned assets (P2)

- **Severity:** P2 — wasted precache + first real fetch needed to cache CSS/JS.
- **File:** `sw.js`.
- **Bug:** `PRECACHE_ASSETS` stores bare paths (`/js/site.js`), but pages request
  them with a cache-bust param (`/js/site.js?v=133dfac1`). `cacheFirst` calls
  `cache.match(request)` **without `ignoreSearch: true`** → the bare precache entry
  never matches the versioned request. HTML pages still work (SW fine), but the
  ~28 precached CSS/JS entries never satisfy a real request.
- **Status:** `confirmed` (source analysis). **New finding.**
- **Fix:** `caches.open(CACHE_STATIC).then(c => c.match(request, { ignoreSearch: true }))`
  in `cacheFirst`, or precache with the `?v=` hash that `cache-bust.js` writes.

---

## 2. Cross-validation summary vs existing `arena-agent` matrix

| Existing ID | My verdict | Basis |
|---|---|---|
| **PS-01** `qs is not defined` | ✅ **CONFIRMED** | independent Node execution (different method than Playwright/dist) |
| **PS-02** dead theme controls | ✅ **CONFIRMED** | direct consequence of PS-01 (init aborts before `initCluster` binds clicks) |
| **PS-03** dead save controls | ✅ **CONFIRMED** | same root cause — `saveCurrent` handler never wired |
| **PS-04** heart-series ownership gap | ✅ **CONFIRMED** | `krajne-li-isporcheno-serdce` & `rimlyanam-7` carry `.gb-ember`/`.gb-save` + `data-gbs2-series` but **do not load** `floating-cluster-controller.js`; meanwhile `site.js` FAB-guard suppresses legacy controls when `[data-fc-root]`/`.gb-ember` present → unwired |
| **PS-05** Hermeneutics stray hash `76e7365` | ⚠️ **NOT in source** | grep across `articles/**` + `src/**` returns 0 hits. Appears to be **dist-artifact-only** (introduced by the strangler/Astro build) or already patched in root. **Needs dist-build re-verification.** |
| **PS-06** Hermeneutics readTime 35 vs 50 | ✅ **CONFIRMED** in root | `<span data-pagefind-meta="readTime" hidden="">35</span>` line 806 |
| **PS-07** duplicate `gbsTheme`/`gbsSearch` IDs on 4 Gill pages | ⚠️ **NOT in source** | 0 hits in root `articles/**`; not in `src/components/**` either. Likely **dist/strangler-merge artifact**. **Needs dist-build re-verification.** |
| **PS-08–PS-09** interactive-audit drift | (not re-audited here — out of runtime-JS scope) | trust existing evidence |

---

## 3. Source-vs-artifact distinction (important for verifier)

The `arena-agent` pass verified against **production-like `dist`**. This pass verified
against **committed root source**. Where they disagree, it is *exactly* the
source-layer-vs-production-artifact split that `CONTRIBUTING.md` warns about:

- **PS-01, PS-02, PS-03, PS-04, PS-06** reproduce identically in **source** and in
  **dist** → real cross-layer bugs, safe to hand to implementation.
- **PS-05, PS-07** reproduce **only in dist** → either build-introduced or
  already-fixed-in-root. These must NOT be auto-escalated to `verified/` without a
  fresh dist build that reproduces them.

---

## 4. New bugs NOT in the existing matrix

- **CR-FCC-02** — `initPlayExpand` `.gb-floater` selector (P1, latent). See §1.
- **CR-SW-01** — sw-register toast logic (P2). See §1.
- **CR-SW-02** — SW precache vs `?v=` assets (P2). See §1.

---

## 5. Verified CLEAN (negative results — to save other agents time)

- **`wc -l = 0` on several JS files** (`sw.js`, `js/search.js`, etc.) is NOT a
  bug — they are single-line minified (e.g. `js/search.js` = 33 KB of real code).
- **All runtime JS** passes `node --check` (the crash is runtime, not syntax).
- **`sitemap.xml`:** 43 URLs, **0 broken** (all resolve to local files).
- **`series.json`:** keys (`dzhon-gill`, `hard-texts`, `russian-baptism`,
  `nagornaya`, `pastor-series`) match `data-gbs2-series` on pages and real folders;
  `baseUrl` values correct.
- **CI cascade fix (`update-meta.js`):** all 10 `ASTRO_PAGE_HEAD_MAP` components
  exist and contain the literal `article:modified_time` that `syncAstroPageHead()`
  rewrites → the recently-committed cascade fix is correct.
- **`manifest.json`** icons (`favicon-120.png`, `icons/icon-{192,512,512-maskable}.png`)
  all exist.
- **`BookmarkEngine`** API complete (`saveNow`, `getCurrent`, `getResumeCandidate`,
  `getInProgressArticles`, `markCompleted`, … all defined and exported).

---

## 6. Artifacts

- Sibling raw report: `runtime-js-bugs-2026-06-25.md` (exact line numbers, Node
  repro trace).
- No screenshots (methodology is deterministic Node execution, not visual).

## 7. Recommended additions to the repair order

The existing Phase A (PS-01 → PS-07 → PS-04) is correct. I suggest:

- **Add** CR-FCC-02 to **Phase A** (it is in the same file/module as PS-01 and is
  trivially fixed in the same edit — fixing PS-01 without CR-FCC-02 leaves the
  speed panel dead on Gill).
- **Add** CR-SW-01 / CR-SW-02 to **Phase D** (source-layer SW cleanup, non-urgent).
- **Gate** PS-05 / PS-07 behind a fresh dist build before moving them to `verified/`.
