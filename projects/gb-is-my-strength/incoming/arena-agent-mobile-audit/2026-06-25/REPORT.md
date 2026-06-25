# Agent Work Report — Mobile Audit (Round 1)

## Meta
- **Project:** gb-is-my-strength
- **Source repo:** `https://github.com/FedorMilovanov/gb-is-my-strength`
- **Agent:** arena-agent-mobile-audit
- **Date:** 2026-06-25
- **Audited branch:** main
- **Audited SHA:** `03e01a0008de34d654175ea600cdf9f22b2351b4`
- **Current HEAD:** `03e01a0008de34d654175ea600cdf9f22b2351b4`
- **Mode:** mobile-focused free-intake
- **Scope:** CSS, layout, touch targets, z-index stacking, viewport, responsive breakpoints, mobile JS

**Reference materials:** `gb-floating-cluster-probe-v16.html` (v16 design intent) + `Полный план внедрения PremiumControls по всему проекту.pdf`

---

## 1. New Findings (Round 1 — 7 mobile bugs)

### M-01 — P2
- **Title:** `.gbx-tts` (TTS widget, z-index:9800) overlaps `.gbs2-bbar` (bottom bar, z-index:2000) — all bottom bar controls unreachable on mobile
- **Severity:** P2
- **Route/files:** All `baptisty-rossii/*` pages on mobile (`max-width: 63.99em`), when TTS widget is visible
- **Evidence:**
  ```
  css/site-layered.css: .gbx-tts { z-index: var(--z-toast); } → 9800
  css/site-layered.css: .gbs2-bbar { z-index: var(--z-bottom-bar); } → 2000
  .gbx-tts position:fixed bottom:max(24px, env(safe-area-inset-bottom,24px)) left:24px
  .gbs2-bbar position:fixed bottom:calc(10px + env(safe-area-inset-bottom))
  ```
  On mobile (`max-width:768px`), `.gbx-tts` extends `left:12px; right:12px`, covering the full bottom bar width.
- **Confidence:** high
- **Suggested repair lane:** z-index-coordination — lower `.gbx-tts` below `--z-bottom-bar` when bottom bar present, or gate `.gbx-tts--visible` on real audio state

### M-02 — P2
- **Title:** GBS2 mobile controls (`.gbs2-ctl`=35px, `.gbs2-mctl`=38px) undersized for touch — below 44px WCAG 2.2 minimum
- **Severity:** P2
- **Route/files:** All `gbs-world` pages (baptisty-rossii) on mobile
- **Evidence:**
  ```
  css/site.css: .gbs2-ctl { width: 35px; height: 35px; }
  css/site.css: .gbs2-mctl { width: 38px; height: 38px; }
  ```
  No `@media (pointer:coarse)` rule exists for `.gbs2-ctl` or `.gbs2-mctl`. Only `@media (hover:hover) and (pointer:fine)` hover styles are present.
- **Confidence:** high
- **Suggested repair lane:** touch-target-sizing — add `@media (pointer:coarse) { .gbs2-ctl, .gbs2-mctl { min-width: 44px; min-height: 44px; } }` to site.css

### M-03 — P2
- **Title:** `Header.astro` has NO mobile burger menu — inline nav links overflow on narrow screens
- **Severity:** P2
- **Route/files:** All pages using `BaseLayout.astro` → `Header.astro`: Gill parts (part1, part3, context), about, karty, konfessii, rodosloviye
- **Evidence:**
  ```
  Header.astro: <ul class="h-nav-links"> with 5 nav items inline — no burger, no collapse
  ```
  Mobile burger menu (`h-mobile-menu-btn` + `h-mobile-nav`) EXISTS in: HomePageChrome, ArticlesPageChrome, HardTextsPageChrome, NagornayaSeriyaPageChrome, PastorSeriesPageChrome — but is MISSING from Header.astro.
- **Confidence:** high
- **Suggested repair lane:** responsive-header — add burger menu to Header.astro matching PageChrome pattern

### M-04 — P2
- **Title:** `.gbs-rail-foot__btn` = 32px on Gill pages — undersized for touch, no `pointer:coarse` override
- **Severity:** P2
- **Route/files:** Gill Part 1, Part 3, Context (all using GillRailControls.astro)
- **Evidence:**
  ```
  GillRailControls.astro: .gbs-rail-foot__btn { width: 32px; height: 32px; }
  ```
  Only `@media (hover: hover) and (pointer: fine)` styles exist. No `pointer:coarse` media query. This is 12px below the WCAG 44px minimum. The probe design (v16) shows 32px for rail-foot buttons.
- **Confidence:** high
- **Suggested repair lane:** touch-target-sizing — add `@media (pointer:coarse)` for `.gbs-rail-foot__btn`

### M-05 — P2
- **Title:** `.gb-series-controls .gb-icon` = 34px on mobile (SeriesLiteCluster) — undersized for touch
- **Severity:** P2
- **Route/files:** All series pages using SeriesLiteCluster.astro on mobile (`max-width: 899px`)
- **Evidence:**
  ```
  SeriesLiteCluster.astro: .gb-series-controls .gb-icon { width: 34px !important; height: 34px !important; }
  SeriesLiteCluster.astro: .gb-series-controls .gb-ember { --ember-size: 34px !important; }
  SeriesLiteCluster.astro: .gb-series-controls .gb-save { width: 34px !important; height: 34px !important; }
  ```
  No `@media (pointer:coarse)` override exists. 34px is 10px below WCAG minimum.
- **Confidence:** high
- **Suggested repair lane:** touch-target-sizing — increase to 44px minimum on `pointer:coarse`

### M-06 — P3
- **Title:** Floating cluster buttons (`.gb-icon`=40px, `.gb-save`=40px, `.gb-ember`) have no `pointer:coarse` override in `mobile-hotfix.css` — only `.gb-fc-btn` class gets 44px
- **Severity:** P3
- **Route/files:** All non-gbs-world, non-nagornaya pages (Hermenevtika, etc.) using SingleArticleCluster
- **Evidence:**
  ```
  mobile-hotfix.css: no rule for .gb-icon, .gb-save, .gb-ember with pointer:coarse
  site-layered.css: @media (pointer:coarse){.gb-floating-controls .gb-fc-btn{min-width:44px;min-height:44px}}
  ```
  `.gb-fc-btn` is a DIFFERENT class from `.gb-icon` / `.gb-save` / `.gb-ember`. The floating cluster uses `.gb-icon` etc., NOT `.gb-fc-btn`.
- **Confidence:** medium
- **Suggested repair lane:** cascade-safety — add `@media (pointer:coarse)` for `.gb-icon, .gb-save, .gb-ember` to mobile-hotfix.css

### M-07 — P3
- **Title:** `scroll-padding-top: 72px` insufficient for GBS2 mobile sticky header (`min-height: 50px`) + regular header
- **Severity:** P3
- **Route/files:** All GBS2 mobile pages
- **Evidence:**
  ```
  css/site.css: html { scroll-padding-top: 72px; }
  css/site.css: .gbs2-mobile-head { position: sticky; top: 0; min-height: 50px; }
  ```
  Combined header + sticky nav = ~122px, but anchor scroll-margin = 72px. Anchors may be obscured.
- **Confidence:** medium
- **Suggested repair lane:** scroll-anchors — use dynamic scroll-margin-top

---

## 2. Confirmations of Existing Findings

### Confirm — arena-agent-2's TTS overlay bug (gbx-tts)
- **Target report:** `incoming/arena-agent-2/2026-06-25/gbx-tts-overlay-blocks-gbs2-theme-2026-06-25.md`
- **Target finding:** `.gbx-tts` overlay blocks `gbs2-theme` buttons on baptisty pages
- **My evidence:** Confirmed z-index conflict: 9800 (TTS) > 2000 (bottom-bar). Extends scope to ALL bottom bar controls.
- **Same bug / related / stronger root cause:** Same root cause, broader impact — blocks entire `.gbs2-bbar` not just theme buttons
- **Recommended status:** confirmed-current, merge with M-01

### Confirm — P0-10 stale hash (mobile-hotfix.css)
- **Target report:** UNIFIED_BUG_LEDGER P0-10
- **Target finding:** ALL Astro components use stale hardcoded asset hashes
- **My evidence:** `mobile-hotfix.css` loaded WITHOUT hash (`<link>` tag, no `?v=`). More vulnerable than hashed assets.
- **Same bug / related / stronger root cause:** Related to P0-10 but separate — NO-hash vs stale-hash
- **Recommended status:** confirmed-current

---

## 3. Challenges / Disputes

### Challenge — M-06 (may be false positive)
- **Target:** M-06 (floating cluster buttons without pointer:coarse)
- **Reason for challenge:** `.gb-floating-controls button` in mobile-hotfix.css might provide sufficient sizing through base button styles
- **Current HEAD evidence:** Need to verify actual rendered sizes in browser — 40px may be acceptable for some users
- **Recommended status:** disputed (pending visual verification)

---

## 4. Duplicate / Merge Proposals

### Merge proposal A
- **Finding A:** M-01 (TTS z-index overlap with bottom bar)
- **Finding B:** arena-agent-2's `gbx-tts-overlay-blocks-gbs2-theme`
- **Why same root cause:** Both are `.gbx-tts` overlay issues. M-01 extends scope to ALL bottom bar controls.
- **Canonical ID suggestion:** M-01 (encompasses both)

### Merge proposal B
- **Finding A:** M-02 (GBS2 controls undersized)
- **Finding B:** M-04 (Gill rail-foot buttons undersized)
- **Finding C:** M-05 (SeriesLiteCluster buttons undersized)
- **Why same root cause:** All are touch target sizing issues below WCAG 44px minimum
- **Canonical ID suggestion:** M-TOUCH-SIZE (systemic touch target issue across all control types)

---

## 5. Severity Proposals

| Bug | Current | Proposed | Evidence |
|-----|---------|----------|----------|
| M-01 | NEW | P2 | Touch-unreachable controls on 10+ baptisty pages |
| M-02 | NEW | P2 | 35px/38px vs 44px WCAG minimum |
| M-03 | NEW | P2 | Navigation broken on mobile for 5+ page types |
| M-04 | NEW | P2 | 32px vs 44px WCAG minimum on Gill pages |
| M-05 | NEW | P2 | 34px vs 44px WCAG minimum on series pages |
| M-06 | NEW | P3 | 40px vs 44px — borderline, needs visual verification |
| M-07 | NEW | P3 | Anchor offset insufficient on GBS2 mobile |

---

## 6. Repair Lane Suggestions

### Lane: touch-target-sizing (M-02, M-04, M-05, M-06)
- **Why together:** All involve adding `@media (pointer:coarse)` rules to ensure 44px minimum
- **What must NOT be mixed:** Do not mix with z-index or header fixes
- **Estimated effort:** ~2 hours CSS-only changes

### Lane: mobile-header-nav (M-03)
- **Why together:** Structural change to Header.astro
- **What must NOT be mixed:** Separate from CSS-only fixes
- **Estimated effort:** ~4 hours (HTML + CSS + JS)

### Lane: mobile-z-index (M-01, M-07)
- **Why together:** Both involve z-index coordination for fixed-position elements
- **What must NOT be mixed:** Do not merge with touch target fixes

---

## 7. Reverify Notes

| Bug | Current HEAD | Result | Evidence |
|-----|-------------|--------|----------|
| M-01 | 03e01a0 | confirmed-current | z-index: 9800 > 2000 in site-layered.css |
| M-02 | 03e01a0 | confirmed-current | .gbs2-ctl=35px, .gbs2-mctl=38px in site.css |
| M-03 | 03e01a0 | confirmed-current | No burger menu in Header.astro |
| M-04 | 03e01a0 | confirmed-current | .gbs-rail-foot__btn=32px in GillRailControls.astro |
| M-05 | 03e01a0 | confirmed-current | .gb-series-controls .gb-icon=34px in SeriesLiteCluster |
| M-06 | 03e01a0 | disputed | .gb-icon=40px, needs visual verification |
| M-07 | 03e01a0 | confirmed-current | scroll-padding-top=72px < combined header+sticky=122px |

---

## 8. Notes for Verifier

### Systemic touch target issue:
The project has a systemic touch target sizing problem. Multiple button classes are below the WCAG 2.2 minimum of 44px:
- `.gbs-rail-foot__btn` = 32px (Gill rail)
- `.gbs2-ctl` = 35px (GBS2 desktop)
- `.gbs2-mctl` = 38px (GBS2 mobile)
- `.gb-series-controls .gb-icon` = 34px (SeriesLiteCluster mobile)
- `.gb-icon` / `.gb-save` / `.gb-ember` = 40px (SingleArticleCluster desktop)

None of these have `@media (pointer:coarse)` overrides, except `.gb-fc-btn` in site-layered.css. The v16 design probe shows intentional small buttons (32px) for rail-foot, suggesting this may be a design decision rather than an oversight.

### Header navigation inconsistency:
Mobile burger menu exists in PageChrome components but NOT in Header.astro. This creates an inconsistent mobile experience: some pages have proper mobile navigation, others don't.

### Design vs implementation gap:
The v16 probe shows a clean mobile bottom-bar design with proper spacing. The current implementation achieves similar layout but with undersized touch targets. The gap is in the `pointer:coarse` media query coverage.

### M-01 (TTS overlay) extends arena-agent-2's finding:
The original finding was about TTS blocking theme buttons. This audit extends it to show TTS blocks the ENTIRE bottom bar on mobile (series navigation, progress indicator, all controls).
