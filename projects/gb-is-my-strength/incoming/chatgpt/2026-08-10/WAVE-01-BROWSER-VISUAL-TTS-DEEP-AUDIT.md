# ChatGPT deep browser / visual / TTS audit — Wave 01

Date: 2026-08-10
Agent: ChatGPT
Status: **EVIDENCE / TRIAGE — no Product mutation**

## Anchors

- Product repository: `FedorMilovanov/gb-is-my-strength`
- Product `main` observed: `757946da67287354b819737813c0a47095f2d759`
- Exact browser/pixel artifact source: PR #1536 head `eb7c1a4f6efd50619abdca8b8967d44aaf7b8de8`, merged as `757946da67287354b819737813c0a47095f2d759`
- Visual Parity workflow run: `31349999432`
- Visual artifact: `visual-parity-reports`, artifact id `9048762963`, digest `sha256:ee63ab8f2108de311562fc3b9d0a858032f9ed5d31189f2cb11ce37834ab264c`
- Visual authority report generated inside that artifact: `2026-08-10T02:42:30.123Z`
- Authority: `SYSTEM-VISUAL-PARITY-AUTHORITY-2026-08-06`

The PR that produced the screenshots changed only writer-lease/governance workflow files; no page/component/CSS UI files were part of that PR. The artifact is therefore useful current-tree visual evidence for the UI surface near the merge point.

## Evidence modes used

1. Current Product source through the GitHub connector.
2. Exact-head GitHub Actions artifacts, including full-page Chromium screenshots at desktop `1280` and mobile `390`.
3. Current deployment-contract artifact from workflow run `31349999314`.
4. Public crawl/search witnesses only as secondary evidence because those can be stale.

Local outbound DNS is unavailable in the execution container, so no claim below pretends that an independent local Playwright session hit the public production origin. Exact-head CI browser artifacts are used where current browser pixels are required.

---

## W01-F01 — CONFIRMED AUDIT-HARNESS BLIND SPOT: non-home H1 can disappear from pixel evidence

**Classification:** CONFIRMED (audit/tooling root), current source.  
**Product-user regression:** not proven.  
**MASTER promotion:** not performed in this wave because legacy-vs-dist visual screenshots are explicitly diagnostic-only after the visual-authority transfer.

### What happens

`css/home.css` defines `.h-hero-title` with `opacity:0` and makes it visible through the `h-fade-up` animation. Non-home rules explicitly force the tagline, description, and rule visible, but do not give the H1 an equivalent static `opacity:1` owner.

`scripts/visual-parity-screenshots.js` later injects a global capture style:

- `animation: none !important`
- `transition: none !important`

The script has a special settled-visibility path for `/` (`primeHomeRevealObservers`, `settleHomeRevealState`, `[data-visual-parity-settled]`), but no generic equivalent for non-home hero titles before animation is disabled.

Result: the capture removes the animation that owns H1 opacity, and the element falls back to `opacity:0` during the screenshot.

### Pixel witnesses

Inside artifact `visual-parity-reports`:

- `visual-parity/hard-texts/dist-mobile.png` — breadcrumb and `АВТОРСКАЯ КНИГА СТАТЕЙ` are visible, then a large blank hero area; the expected H1 `Тайны человеческого сердца` is absent before `Коротко`.
- `visual-parity/hard-texts/legacy-mobile.png` — same capture artifact: expected H1 absent.
- `/hard-texts/` current Astro source does contain the H1 in `HardTextsPageChrome.astro`.
- The same pattern is visible in `/biografii/` mobile pixel evidence: source contains the H1, while the captured hero has the animation-dependent title missing.

Because both compared sides can be made transparent by the harness itself, pixelmatch can report parity while being blind to the actual title pixels.

### Second blind spot in the breadth browser guard

`scripts/public-surface-browser-matrix.mjs` computes `h1Visible` from:

- non-zero `getBoundingClientRect()`
- `display !== none`
- `visibility !== hidden`

It does **not** check computed opacity/content-visibility or effective painted visibility. A permanently `opacity:0` H1 can therefore satisfy this H1 guard.

### Why this matters

This is not evidence that production currently hides the title. It is evidence that the current visual/browser audit stack can fail to prove title visibility and can manufacture misleading screenshots. That materially weakens future pixel-level review, especially for the exact kind of premium/visual regression this audit is meant to catch.

### Suggested bounded repair

A future Product lane should make capture visibility generic instead of route-specific. Viable approaches:

1. Finish or settle CSS animations before capture and preserve their final computed state before applying animation freeze; or
2. Mark every proven-visible animation-owned element before freeze and force only those final properties; or
3. Refactor critical content visibility so CSS animation does not own `opacity:1` at all (animation transforms can remain enhancement-only).

Also harden `public-surface-browser-matrix.mjs` so H1 paint visibility requires at minimum computed opacity above a small threshold, non-hidden `content-visibility`, and a non-empty/intersecting paint box.

Regression witness should include at least one non-home landing with animation-owned hero title (`/hard-texts/` is a good witness) and assert the H1 is actually painted in the captured image/runtime state.

---

## W01-F02 — MOBILE PREMIUM CANDIDATE: `/biografii/` recent shelf is asymmetrically indented and titles are aggressively clamped

**Classification:** OBSERVED / OWNER-INTENT NEEDED.  
**MASTER promotion:** no.

Current source `BiografiiRecentSection.astro` applies `style="margin-left:22px"` to `.h-articles-group` without a mobile reset. Shared mobile CSS at `max-width:440px` keeps non-home article cards horizontal with a `104px × 76px` thumbnail and clamps titles to 3 lines.

At the exact-head 390px screenshot this produces a visibly one-sided recent-material shelf and several truncated Gill titles such as the Part III/IV entries. The cards remain usable and the part number is still discoverable, so this is not classified as a broken-function defect. It is a strong premium/readability review candidate because the shelf gives away scarce mobile width before the text column is laid out.

Suggested measurement before disposition: capture DOM rects for `.biography-recent .h-articles-group`, `.h-article-card`, thumbnail, and `.h-article-body` at 320/360/390/430/600; compare left/right gutters and effective text width. If owner intent is symmetric mobile cards, reset the 22px indent below the mobile breakpoint or move the visual hierarchy signal to a non-width-consuming accent.

---

## W01-F03 — TTS FIRST-INTERACTION LATENCY CANDIDATE

**Classification:** MEASUREMENT REQUIRED.  
**MASTER promotion:** no.

The shared `gbx-tts` path in `js/site.js`:

- inserts the player immediately but only adds its visible class after `1200ms`;
- on first play, if no preferred voice is already resolved and `getVoices()` initially returns empty, polls every `250ms` for up to `12` tries before proceeding (roughly a 3s ceiling for the voice-resolution wait);
- prefers a Russian Google voice, then a remote Russian voice, then the first Russian voice.

This is a source-level reason why perceived “audio opens slowly” can vary by browser/device even when there is no network audio download. The current evidence does not prove a production SLA violation because browser voice availability is device-dependent.

Required next witness: measure `navigationStart → TTS visible`, `click → speechstart`, and fallback behavior on Chromium/WebKit with (a) voices already present and (b) delayed `voiceschanged`; record p50/p95 over several reloads. The audit should also verify the newer gbs2-owned TTS path separately because the legacy/shared overlay intentionally suppresses itself on gbs2 clusters.

---

## W01-F04 — VIEWPORT COVERAGE GAP FOR PREMIUM GEOMETRY

**Classification:** AUDIT-COVERAGE OBSERVATION.  
**MASTER promotion:** no.

Current breadth guard `public-surface-browser-matrix.mjs` uses `320`, `390`, and `1440` widths across public routes. `content-mobile-smoke.js` uses an iPhone 12 profile and primarily checks horizontal overflow/page errors. There is a much stronger `standalone-reader-layout-guard.mjs` with widths `390, 768, 1199, 1200, 1280, 1366, 1440, 1920`, but it deeply measures only two standalone article witnesses: Hermenevtika and Kod Da Vinci.

Therefore the stack is strong at narrow phone + desktop and strong for two reader pilots, but it does not broadly prove intermediate-width premium geometry across every route family (e.g. 600–1024 landings, catalogs, special shells). This matters for the owner's explicit concern about unexpectedly narrow reading columns and awkward tablet/narrow-desktop states.

Recommended audit-only extension: add a sampled route-family geometry matrix at `600/768/820/1024/1199` that records content width, text measure, left/right gutters, fixed chrome overlap, touch target size, and clipping. Keep it measurement/reporting first; do not turn aesthetic thresholds into hard CI without owner approval.

---

## W01-F05 — STALE PUBLIC-CRAWL WITNESS CORRECTLY REJECTED

**Classification:** STALE.

A public search crawl exposed the internal-looking string `ДОПОЛНЕНИЕ (BUG3 из TXT): ...` for the John Gill legacy/nasledie material. Current `main` source for `src/components/article-pilots/gill-part3/GillPart3ArticleBody.astro` contains neither `BUG3` nor `ДОПОЛНЕНИЕ`.

Disposition: **STALE search-crawl evidence; do not promote to MASTER.** It may persist until external recrawl, but it is not a current source defect.

---

## Current positive controls observed

- Visual authority artifact reports 85 governed routes: 84 native Astro + 1 built-app; remaining legacy-diff owners = 0.
- Legacy root-vs-dist screenshots are explicitly diagnostic-only after authority transfer.
- Home progressive-enhancement report passes normal / no-JS / no-IntersectionObserver mobile scenarios and reports no horizontal overflow at the tested 390px width.
- Home refutations box-model report passes at 1440 and 390.
- Deploy candidate artifact reports URL contract: 75 public pages, 0 issues.
- Offline/PWA Chromium witness: 10/10 scenarios passed; static SW audit: 46 passed, 0 errors.
- Rendered human-reachability evidence reports all 56 reading routes reachable and no orphan routes in that witness.

These positives should not be interpreted as proof of premium quality at all widths; they define what is already covered so later waves can target blind spots rather than duplicate green checks.

## Next wave targets

1. Inspect remaining exact-head full-page screenshots for route-family asymmetries, clipping, fixed-control overlaps and excessive dead space.
2. Deep source review of search/Pagefind opener, query projection and zero-result/error states.
3. Tooltip interaction review: hover, keyboard focus, touch sheet, long-content overflow, Escape, outside-click, nested link behavior.
4. TTS: distinguish legacy/shared `gbx-tts` from gbs2 reader TTS and locate measurable first-play paths.
5. Reader widths beyond the two standalone-layout witnesses.
6. Special surfaces: Maps, Atlas, Confessions/Russian Baptism built app, mobile chrome transitions.
7. Re-check Product and AuditRepo heads before any later promotion.
