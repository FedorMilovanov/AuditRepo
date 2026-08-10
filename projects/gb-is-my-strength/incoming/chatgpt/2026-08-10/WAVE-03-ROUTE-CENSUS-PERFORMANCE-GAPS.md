# ChatGPT deep audit — Wave 03: route search census + performance proof gaps

Date: 2026-08-10
Agent: ChatGPT
Status: **EVIDENCE / TRIAGE — no Product mutation**

## Fresh anchor / concurrent-main handling

Immediately before this wave, Product `main` advanced from `757946da67287354b819737813c0a47095f2d759` to:

- `171daaf3fd40b92208c6e8b551acccdc00efbb6c`

The compare is one commit and changes only:

- `package-lock.json`
- `package.json`
- `scripts/astro7-satteri-contract.mjs`

No audited route/component/search/tooltip/TTS UI source changed. Therefore Wave 01/02 UI root evidence remains current, while this wave uses the new Product anchor.

AuditRepo head observed before this write: `f8e42170a3e11ea199143a7f820fa06b2b278d81`.

---

## W03-F01 — CONFIRMED SCOPE EXPANSION: `/pastor-series/` has the same search-bootstrap root, and mobile is worse

**Classification:** CONFIRMED current Product interaction root; same family as W02-F01.

Current `/pastor-series/` source has the same shared native navbar pattern:

- desktop navigation links;
- `.mobile-controls` contains theme + burger only;
- mobile menu contains the same section links, no search trigger;
- semantic breadcrumb nav exists but has no `.breadcrumb` class;
- runtime tail installs only the lazy search wrapper, not full `search.js`.

The lazy wrapper again requires an already-existing search trigger click or `gb:openSearch`; it does not create a trigger and does not own `Ctrl/⌘+K`.

Unlike `/articles/` and `/biografii/`, `/pastor-series/` does **not** mount `MobileChromePage` at all. Therefore there is no later post-scroll mobile search button to rescue the route.

### Current behavior implied by owner chain

- desktop cold load: no visible global-search opener; full runtime never bootstraps from ordinary UI;
- mobile cold load: no search in native top controls or mobile menu, and no registry search bar later;
- `Ctrl/⌘+K` cannot be relied on before the full runtime exists because the lazy wrapper has no keyboard listener.

This confirms W02-F01 is a repeated shared-landing ownership bug, not a one-page anomaly.

### Bounded fix principle

Do not patch routes one by one. One shared owner should provide a guaranteed initial global-search entry on every route that opts into this navbar/runtime family. Regression matrix should include at least:

- `/articles/` desktop + mobile top + mobile post-scroll;
- `/biografii/` desktop + mobile top + mobile post-scroll;
- `/pastor-series/` desktop + mobile;
- `/hard-texts/` as a negative-control route because it already loads full `search.js` directly.

---

## W03-F02 — SPECIAL-SURFACE SEARCH CENSUS: do not overgeneralize the shared-landing bug

**Classification:** OWNER-INTENT / ROUTE-FAMILY NOTES, not Product bugs by themselves.

### `/hard-texts/`

Directly loads full `js/search.js`. The full runtime can create `#gbSearchBtn`; this route is not the shared lazy-bootstrap dead-end.

### `/karty/`

Standalone premium surface. It mounts `MobileChromePage` through the registry, so mobile has a global-search control in the lightweight mobile chrome. Its own main surface is intentionally minimal (`← Главная`, map-library content) rather than the shared full site navbar.

Desktop global-search absence here should not be silently classified as the same bug without an owner invariant saying every standalone special surface must expose global search. Treat as product-navigation policy question, not confirmed defect.

### `/konfessii/`

Also a dedicated standalone visual surface, with its own `На главную` header and custom animation/card runtime, plus mobile registry chrome. As with Maps, the absence of shared desktop navbar/search belongs to a special-shell policy decision, not automatically to the shared-landing search root.

This route-family distinction matters: a repair for W02/W03-F01 should target the shared navbar/lazy-search family and must not accidentally stack another search owner over special shells.

---

## W03-F03 — CONFIRMED AUDIT COVERAGE GAP: no exact-head user-perceived page-speed/Web-Vitals workflow found

**Classification:** CONFIRMED measurement/audit gap, not evidence that the site is slow.

The exact-head workflow census for the UI anchor includes:

- Shared Files Guard
- Metadata & IndexNow Readiness
- Writer Lease Contract
- Node Toolchain Contract
- Glossary Contract
- Scripture Occurrence Index Contract
- Deploy Candidate Contract
- Editorial Metadata
- Search Manifest Policy
- TTS Download Consent
- Route Registry Validators
- Visual Parity Guard

The inspected package/scripts and exact-head workflow family provide deep correctness evidence, but no dedicated Lighthouse/Web Vitals/navigation performance workflow was found. In particular, current evidence does not report route-level:

- cold/warm navigation → FCP/LCP;
- INP or interaction delay for menu/search/tooltip/TTS controls;
- CLS during fonts/images/animation reveal;
- time to visible global search on cold bootstrap;
- Pagefind cold-open readiness;
- TTS click → actual speech start (already detailed in Wave 02).

The deploy contract proves 75 public pages and publication/PWA integrity; it does not answer “how fast does this page feel to a reader?”

### Required performance wave

Because public-network timing is environment-sensitive, a useful audit should preserve both controlled and real-origin data:

1. Production-origin Chromium runs at mobile + desktop profiles.
2. Cold cache and warm cache separately.
3. Representative route families rather than only one page:
   - `/`
   - `/articles/`
   - `/biografii/`
   - a long reader article
   - Nagornaya reader
   - `/karty/`
   - `/konfessii/`
4. Record FCP, LCP, CLS, INP/event timings, DOMContentLoaded/load, request count, transfer size, long tasks.
5. Separately record interaction SLAs:
   - menu click → stable open;
   - search trigger → focused input;
   - search query → first results;
   - tooltip trigger → painted stable popup;
   - TTS click → speech/audio start.
6. Repeat samples and retain p50/p95; a single fastest/slowest number is not defensible.

No hard numerical threshold should be turned into Product CI until the owner approves the performance budget; first establish current baselines and outliers.

---

## W03-F04 — INTERMEDIATE-WIDTH GAP REMAINS MATERIAL TO READABILITY REVIEW

**Classification:** AUDIT-COVERAGE, carried forward with stronger route-family context.

Broad public browser coverage still clusters around narrow phone (`320/390`) and desktop (`1440`), while the strongest `390/768/1199/1200/1280/1366/1440/1920` readable-width geometry guard deeply measures only two standalone article witnesses.

The route census shows multiple materially different shells (shared landing navbar, series landing, special maps/confessions, article readers). Therefore a “reader width passed on two articles” result cannot establish comfortable geometry for the shared catalog/series pages at 600–1199px.

Owner-requested concerns such as an overly narrow reading column should be measured directly with DOM rects/effective `ch` measure at `600/768/820/1024/1199`, not inferred from 390/1440 screenshots.

---

## Concurrency / disposition discipline

- Product advanced during this audit; the UI findings were revalidated by comparing old→new main and confirming no UI source changed.
- AuditRepo also advanced concurrently; this wave is written as a unique incoming file only.
- No MASTER or Product source edit was attempted, avoiding collision with the parallel verification stream.

## Next targets

1. Find exact interaction ownership on `/rodosloviye/`, `/about/`, `/map/` and Russian Baptism built-app shell; complete search-entry census.
2. Audit mobile menu/topbar initial discoverability versus post-scroll discoverability; treat intentional hidden chrome separately from missing owners.
3. Inspect image/font preload strategy and current critical-path asset ownership by route family.
4. Find any existing accessibility-tree/axe-like evidence; if absent, build the semantic test matrix around tooltips, search scopes and overlay focus.
5. Continue screenshot review below the fold: dead space, card alignment, clipped titles, footer/feedback density, fixed-control collisions.
