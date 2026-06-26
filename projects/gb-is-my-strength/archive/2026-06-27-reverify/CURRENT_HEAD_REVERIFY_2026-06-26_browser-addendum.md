# Current HEAD Browser Addendum — 2026-06-26

## Meta
- Project: gb-is-my-strength
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Date: 2026-06-26
- Verifier: `arena-agent`
- Method:
  - production-like `dist/` served locally on `127.0.0.1:4173`
  - Playwright Chromium browser witness after installing required system libs in Arena
  - focus: GBS2 controls, readTime truth, FAQ behavior, Avraam skip link

Evidence labels:
- `verified-browser`
- `verified-production-like-dist`
- `verified-source`

---

## Summary

This addendum strengthens the current-head reverify with browser-level evidence.

### Confirmed by browser
1. **Baptisty GBS2 theme control is present in DOM but not visible/usable** on the tested route.
2. **Hermeneutics hidden readTime drift appears fixed in current dist** for the previously reported `35 vs 50` mismatch claim.
3. **Antisovetov FAQ control bug is likely stale / needs reformulation** because the tested production-like page exposes no FAQ buttons to operate.
4. **Avraam skip-link bug is stale for current production-like dist** because neither the link nor the target exists on the tested route.
5. A new/secondary issue emerged: **local CSP blocks absolute favicon/icon image URLs when serving dist from localhost**, producing browser console noise in local verification.

---

## Browser findings

### B-2026-06-26-01 — Baptisty GBS2 theme button exists but is not visible/usable
- Maps to prior ledger: **P1-13 / P1-14 family**
- Status: `confirmed-current`
- Severity: **P1**
- Witnesses:
  - `verified-source`: `src/layouts/SeriesArticleLayout.astro` includes `data-gbs2-theme` markup.
  - `verified-browser`: on `/baptisty-rossii/`, Playwright found 1 `[data-gbs2-theme]` element, but it was not visible and force-click did not toggle `html.dark`.
- Browser evidence:
  - `hasTheme: 1`
  - `themeVisible: false`
  - `themeClicked: false`
  - `darkBefore: false`
  - `darkAfter: false`
- Interpretation:
  - the control is present but not a functioning user-visible theme toggle in the tested dist route.
- Recommendation:
  - keep the GBS2 wiring bug open as confirmed-current.

### B-2026-06-26-02 — Hermeneutics hidden readTime mismatch no longer reproduces as `35 vs 50`
- Maps to prior ledger: **PS-06**
- Status: `stale-on-current-head` for the exact prior claim
- Severity recommendation: retire or rewrite
- Witnesses:
  - `verified-production-like-dist`: page contains readTime metadata and visible reading time.
  - `verified-browser`: on `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`, hidden readTime text content is `50` and visible `50 мин` is present.
- Browser evidence:
  - `hiddenReadTime: "50"`
  - `visible50: true`
- Interpretation:
  - the previously reported exact drift `35 vs 50` does not hold on current production-like dist.
- Recommendation:
  - mark PS-06 stale/fixed-current unless another route/build mode still reproduces it.

### B-2026-06-26-03 — FAQ non-functional claim needs reformulation on Antisovetov route
- Maps to prior ledger: **P3-8**
- Status: `disputed-by-current-browser`
- Severity: **P3** if retained, but wording must change
- Witnesses:
  - `verified-production-like-dist`: HTML contains `faq-accordion` text markers.
  - `verified-browser`: on `/articles/20-antisovetov-pastoru/`, zero FAQ buttons/question controls were found with tested selectors.
- Browser evidence:
  - `faqButtons: 0`
  - `faqInteractionChanged: false`
- Interpretation:
  - this is not currently proven as “accordion present but dead button handler” on this route.
  - current truth may instead be: FAQ markup/text exists but no interactive control is rendered in the tested dist route.
- Recommendation:
  - do not keep the older exact wording without source/DOM refresh.

### B-2026-06-26-04 — Avraam skip-link bug is stale in current production-like dist
- Maps to prior ledger: **V2-3 / NEW-4**
- Status: `stale-on-current-head`
- Severity recommendation: retire current claim
- Witnesses:
  - `verified-production-like-dist`: `dist/karty/avraam/index.html` contains neither `href="#svg-map"` nor `id="svg-map"`.
  - `verified-browser`: route `/karty/avraam/` has no skip link and no `#svg-map` target.
- Browser evidence:
  - `skipCount: 0`
  - `targetCount: 0`
- Interpretation:
  - the exact prior bug claim is not current on this build.
- Recommendation:
  - move this specific claim to stale unless a different skip-link issue is identified.

### B-2026-06-26-05 — Local CSP console noise from absolute production asset URLs
- New finding
- Status: `confirmed-current` in local verification environment
- Severity: **P3**
- Witnesses:
  - `verified-browser`: multiple tested pages log CSP violations when attempting to load absolute production asset URLs such as `https://gospod-bog.ru/favicon.ico` while served locally from `127.0.0.1`.
- Example console errors:
  - favicon.ico blocked by `img-src 'self' ...`
  - apple-touch-icon.png blocked
  - favicon-48.png blocked
  - favicon-120.png blocked
  - icon-192.png blocked
- Interpretation:
  - likely not a production-site user bug on the canonical domain,
    but it does degrade local/browser verification fidelity and may indicate overly absolute icon declarations.
- Recommendation:
  - classify as low-severity verification-environment or portability issue unless reproduced on canonical host.

---

## Resulting status updates to prior findings

### Keep open
- **P1-13 / P1-14 family** — strengthened by browser witness

### Retire or rewrite
- **PS-06** exact `35 vs 50` claim → stale on current production-like dist
- **V2-3 / NEW-4** Avraam skip-link exact claim → stale on current production-like dist
- **P3-8** FAQ claim → wording must be refreshed before it remains canonical

---

## Suggested next verifier action

Open a canonical conflict/retirement note to clean the ledger for:
- PS-06
- V2-3 / NEW-4
- P3-8 exact wording

This will reduce stale baggage and improve the repair-ready set.
