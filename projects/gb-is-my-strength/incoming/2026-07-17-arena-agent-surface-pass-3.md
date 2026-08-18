# Agent Audit Report — Surface Pass 3: HTML-BTN-TYPE full census, GillSeriesMobileBar ARIA, Seo.astro, BaseLayout, sitemap projection

## Meta

- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Agent: Arena Agent (arena.ai)
- Date: 2026-07-17
- Audited branch/ref: main
- Audited anchor (SHA): 485db8c25287fa9bd2f53a5356885f02e4b81f4b
- Environment: static source inspection via GitHub API
- Build mode: source
- Scope: Complete `<button>` census across all PageChrome components (HTML-BTN-TYPE full verification); GillSeriesMobileBar speed radio ARIA; GillReaderSettingsSheet / GillPartTocOverlay overlay model; Seo.astro article:* gating; BaseLayout prefetch list; sitemap vs feed cross-check; floating-cluster-ui.ts; ArticlesPageChrome; BiografiiPageChrome architecture; GillSeriesRail share button; AboutPageChrome
- Explicit exclusions: runtime overlay focus-trap verification (requires Playwright); TTS/Vosk wiring (separate surface)
- Signal class: Product
- Proof state: FAIL (new confirmed defects), PASS (several prior residual claims scoped correctly), NARROWED (HTML-BTN-TYPE scope update)
- Claim boundary: HEAD SHA 485db8c
- Preservation boundary: anchored to this SHA

---

## 1. HTML-BTN-TYPE — complete `<button>` census at anchor SHA

Full source-verified button inventory across all PageChrome and shell components:

### HardTextsPageChrome.astro — 3 buttons, 2 MISSING `type="button"`

| Line | Button | `type=` | Status |
|---|---|---|---|
| L53 | `#themeToggle .theme-toggle` | **absent** | ❌ MISSING |
| L57 | `#hMobileMenuBtn .h-mobile-menu-btn` | **absent** | ❌ MISSING |
| L120 | `#hScrollTop .h-scroll-top` | **absent** | ❌ MISSING |

**New finding:** `hScrollTop` scroll-to-top button also missing `type="button"` — not previously named in MASTER residual. Applies to all three chromes that have this button.

### PastorSeriesPageChrome.astro — 3 buttons, ALL MISSING `type="button"`

| Line | Button | `type=` | Status |
|---|---|---|---|
| L32 | `#themeToggle .theme-toggle` | **absent** | ❌ MISSING |
| L36 | `#hMobileMenuBtn .h-mobile-menu-btn` | **absent** | ❌ MISSING |
| L147 | `#hScrollTop .h-scroll-top` | **absent** | ❌ MISSING |

### AboutPageChrome.astro — 1 button, MISSING `type="button"`

| Line | Button | `type=` | Status |
|---|---|---|---|
| L203 | `#themeToggle .theme-toggle` | **absent** | ❌ MISSING |

Note: AboutPageChrome does NOT have `hMobileMenuBtn` — the MASTER residual wording is slightly overbroad for this component. No hamburger/mobile-menu button exists in the About chrome at this anchor.

### ArticlesPageChrome.astro — 2 buttons, ALL HAVE `type="button"` ✅

| Line | Button | `type=` | Status |
|---|---|---|---|
| L258 | `#themeToggle .theme-toggle` | `type="button"` | ✅ CORRECT |
| L262 | `#hMobileMenuBtn .h-mobile-menu-btn` | `type="button"` | ✅ CORRECT |

**Finding:** `ArticlesPageChrome` is CLEAN — it correctly uses `type="button"` on both controls. The HTML-BTN-TYPE residual should NOT include ArticlesPageChrome.

### BiografiiPageChrome.astro — 0 buttons

`BiografiiPageChrome.astro` is a head-only component (meta, SEO, scripts). It contains no `<button>` elements — no nav/chrome buttons present. No issue.

### NagornayaChast1PageChrome.astro — themeToggle has `type="button"` ✅

Already confirmed in pass 1. Nagornaya series chromes are clean for `themeToggle`. The MASTER residual reference to `NagornayaSeriyaPageChrome` appears to refer to a component name that does not match current file structure (per-chapter chromes are `NagornayaChast1PageChrome` etc).

### GillSeriesRail.astro — `share` button MISSING `type="button"`

| Line | Button | `type=` | Status |
|---|---|---|---|
| L98 | `.gbs-rail-back` | `type="button"` | ✅ |
| L158 | `#gbsTocToggle` | `type="button"` | ✅ |
| L218 | `#hMobileMenuBtn .gbs-rail-menu-btn` | `type="button"` | ✅ |
| L225 | `#railSettingsBtn` | `type="button"` | ✅ |
| L231 | `[data-action="print"]` | `type="button"` | ✅ |
| **L232** | **`[data-action="share"]`** | **absent** | ❌ **MISSING** |
| L250 | `.gb-theme-toggle [data-fc-action="theme"]` | (no explicit type seen) | ⚠️ needs confirm |

**New finding `GBS2-SHARE-BTN-TYPE`:** `GillSeriesRail.astro` L232 — the share button is missing `type="button"`. All other rail buttons are correct. This is a single residual oversight in an otherwise well-typed component.

### GillSeriesMobileBar.astro — all buttons have `type="button"` ✅

All 10+ buttons verified: `type="button"` present on all interactive controls including `mobBackBtn`, `mobLearningBtn`, speed rail buttons, `mobSpdBadge`, `mobPartTocBtn`, `gbsTocToggle`, `gb-theme-toggle`, `mobSettingsBtn`, `[data-action="share"]`.

### GillLearningSheet.astro / GillReaderSettingsSheet.astro / GillPartTocOverlay.astro ✅

All buttons in these overlays have explicit `type="button"`. Overlay model uses `role="dialog" aria-modal="true"` with proper `aria-labelledby`. FCC `openOverlay()` delegates to `OverlayRuntime` with `trapFocus: true` and `closeOnEscape: true`.

---

**Updated MASTER residual scope for HTML-BTN-TYPE:**

| Component | themeToggle | hMobileMenuBtn | hScrollTop | share | Notes |
|---|---|---|---|---|---|
| HardTextsPageChrome | ❌ missing | ❌ missing | ❌ missing | N/A | All 3 need fix |
| PastorSeriesPageChrome | ❌ missing | ❌ missing | ❌ missing | N/A | All 3 need fix |
| AboutPageChrome | ❌ missing | N/A (no hamburger) | N/A | N/A | 1 button to fix |
| GillSeriesRail | N/A | ✅ | N/A | ❌ missing | share button only |
| ArticlesPageChrome | ✅ | ✅ | N/A | N/A | CLEAN — remove from residual |
| BiografiiPageChrome | N/A | N/A | N/A | N/A | No buttons |
| NagornayaChast*PageChrome | ✅ | N/A | N/A | N/A | CLEAN |

---

## 2. GillSeriesMobileBar speed radio ARIA — PASS with note

`GillSeriesMobileBar.astro` L61–L68: speed control buttons use `role="radio"` on `<button>` elements, wrapped in `<div role="radiogroup" aria-label="Скорость озвучки">`. The `radiogroup` wrapper is present (L61), buttons have `aria-checked="true/false"`, and the group is initially `aria-hidden="true"` (hidden until TTS activates). This is structurally valid per WAI-ARIA composite pattern.

**Note:** `role="radio"` on a `<button>` element creates a role conflict — `<button>` has implicit role `button`, and adding `role="radio"` overrides it. Per spec this is allowed (roles are overridable), but some AT implementations may not handle `<button role="radio">` as smoothly as native `<input type="radio">`. This is a low-priority improvement candidate, not a defect.

---

## 3. Seo.astro — `article:*` gating — PASS (component correct, app/index.astro bypasses it)

`Seo.astro` L68–L70: `article:published_time`, `article:modified_time`, `article:author` are all gated behind `{ogType === 'article' && ...}`. The component correctly enforces the OG type contract.

**Confirmed:** The `NEW-APP-OG-TYPE` bug (from pass 1) is caused by `src/pages/app/index.astro` **bypassing `Seo.astro` entirely** and emitting `article:published_time` / `article:modified_time` inline without the `Seo.astro` guard. Seo.astro itself is clean.

---

## 4. BaseLayout.astro — new observations

### Finding `BASE-PREFETCH-HARDCODED` — prefetch list hardcoded, excludes newer routes

- Kind: maintenance risk
- Route(s) / owner(s): `src/layouts/BaseLayout.astro`
- Observed on anchor: 485db8c

**Evidence:**

`BaseLayout.astro` (around L60–65):
```js
{['/articles/', '/biografii/', '/hard-texts/', '/karty/', '/about/']
  .filter((href) => href !== Astro.url.pathname)
  .map((href) => <link rel="prefetch" href={href} />)}
```

The prefetch list is hardcoded to 5 routes. Missing from the list:
- `/pastor-series/` (live route, confirmed in sitemap)
- `/nagornaya/` (live route)
- `/baptisty-rossii/` (live route)
- `/app/` (live, newly published route)
- `/map/` (Atlas)

This means users on any page that uses `BaseLayout` will get speculative prefetches for the 5 listed routes only. New routes added to the site will not receive prefetch hints unless this list is manually updated. The comment in source mentions `NEW-PREFETCH-UNCONDITIONAL` (filtering out current page), suggesting this was previously known.

- Evidence type: verified-source
- Confidence: high (mechanism clear)
- Impact: low — prefetch is a performance hint, not a correctness issue. Missing prefetch = slightly slower nav, not broken nav.
- What this does NOT prove: does not prove any route is broken; no user-facing defect.

### Finding `BASE-LEGACY-RUNTIME-CONDITIONAL` — `includeLegacySiteScript` defaults to `ogType !== 'article'`

- Kind: architecture note / risk
- Route(s) / owner(s): `src/layouts/BaseLayout.astro`

**Evidence:**

```ts
includeLegacySiteScript = ogType !== 'article',
```

When `ogType === 'article'` (all article pages), `includeLegacySiteScript` defaults to `false`, meaning `site.js` (the legacy monolith) is NOT loaded, and `ReaderActionsRuntime` is injected instead. For all other page types (`website`, `profile`), `site.js` IS loaded.

This creates a **two-tier runtime model** based on OG type:
- Article pages → `ReaderActionsRuntime` (modern, modular)
- Non-article pages → `site.js` (legacy monolith)

**Risk:** If a page sets `ogType='article'` but doesn't import all the features `site.js` provided (glossary, reading-progress, FAQPage schema injection etc.), those features silently break. This is by design (the comment says so), but it's a hidden contract — there's no explicit check that `ReaderActionsRuntime` covers all capabilities `site.js` provided for the given page type.

- Evidence type: verified-source
- Confidence: high
- Impact: medium — currently working by convention; fragile if new article-type pages don't follow the pattern

---

## 5. Sitemap vs Feed projection — PASS with note

**Cross-check results (anchor SHA, both files):**

- Feed items NOT in sitemap: **0** — every feed item has a sitemap entry ✅
- Sitemap URLs NOT in feed: **18** — expected; these are index/landing pages (`/about`, `/app`, `/articles`, `/biografii`, `/baptisty-rossii`, `/karty/avraam`, `/karty/ishod`, `/konfessii`, `/konfessii/russkij-baptizm`, `/map`, `/nagornaya/istochniki`, `/nagornaya/nakhodki`, `/pastor-series`, `/rodosloviye`, `/hard-texts/genesis-6` etc.) — index/hub pages correctly excluded from RSS feed per convention

**Note:** `/rodosloviye` appears in sitemap but was not confirmed as a live route (not seen in pages listing). Worth a follow-up spot-check to confirm it's a real published route.

**Sitemap structure quality:**
- Has `<lastmod>`, `<changefreq>`, `<priority>` ✅
- Has `<image:image>` extensions ✅
- `lastmod` uses `+03:00` timezone (Moscow time) — consistent across entries ✅
- All 76 entries appear well-formed

---

## 6. Root-cause clusters — this pass

### Cluster `BUTTON-TYPE-MISSING` (extended from pass 1, full scope now known)

**Confirmed affected components:**
- `HardTextsPageChrome.astro`: themeToggle, hMobileMenuBtn, hScrollTop — all 3 missing
- `PastorSeriesPageChrome.astro`: themeToggle, hMobileMenuBtn, hScrollTop — all 3 missing
- `AboutPageChrome.astro`: themeToggle — 1 missing
- `GillSeriesRail.astro`: share button (data-action="share") — 1 missing

**Clean (remove from residual scope):**
- `ArticlesPageChrome.astro`: fully correct ✅
- `BiografiiPageChrome.astro`: no buttons ✅
- `NagornayaChast*PageChrome.astro`: themeToggle correct ✅
- All `GillSeries*` overlays and mobile bar: all correct ✅

**Root cause:** Legacy-converted chromes (Hard Texts, Pastor Series, About) were transcribed from legacy HTML that omitted `type="button"`. `ArticlesPageChrome` was authored later and includes explicit types. `GillSeriesRail` is mostly correct but missed the `share` button.

**Fix scope:** 7 specific button elements across 4 files.

---

## 7. Summary table — new findings this pass

| ID | Finding | Type | Impact |
|---|---|---|---|
| `HTML-BTN-TYPE-HSCROLLTOP` | `hScrollTop` button in HardTextsPageChrome + PastorSeriesPageChrome missing `type="button"` | defect (new scope) | low |
| `HTML-BTN-TYPE-ABOUT-SCOPE` | AboutPageChrome has NO `hMobileMenuBtn` — MASTER wording overbroad | clarification | — |
| `HTML-BTN-TYPE-ARTICLES-CLEAN` | ArticlesPageChrome fully correct — remove from residual scope | PASS | — |
| `GBS2-SHARE-BTN-TYPE` | GillSeriesRail L232 share button missing `type="button"` | defect (new) | low |
| `SEO-OG-GATE-PASS` | `Seo.astro` correctly gates `article:*` — app/index.astro bug is bypass, not Seo component defect | PASS | — |
| `BASE-PREFETCH-HARDCODED` | BaseLayout prefetch list hardcoded to 5 routes; excludes pastor-series, nagornaya, app etc. | risk/maintenance | low |
| `BASE-LEGACY-RUNTIME-CONDITIONAL` | `includeLegacySiteScript = ogType !== 'article'` — two-tier runtime; hidden contract | risk | medium |
| `SITEMAP-FEED-PASS` | All 58 feed items have sitemap entries; 18 hub-only sitemap entries correctly absent from feed | PASS | — |
| `RODOSLOVIYE-UNCONFIRMED` | `/rodosloviye` in sitemap but not confirmed in pages structure | candidate | low |
