# Sitewide browser smoke and keyboard-bypass triage — 2026-09-30

- Product source/build SHA: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`
- Browser: Playwright + Chromium `153.0.8010.0`
- Target: local production-like `dist` from that exact SHA
- Coverage: all **104 emitted `index.html` routes**, each at `1280×900` and `390×844` = **208 browser visits**
- Result: **1,872/1,872 checks passed** (nine explicit checks per visit)
- Evidence: [`evidence/2026-09-30-sitewide-browser-100-checks.json`](evidence/2026-09-30-sitewide-browser-100-checks.json)
- Route-level no-skip focus traces: [`evidence/2026-09-30-no-skip-route-triage.json`](evidence/2026-09-30-no-skip-route-triage.json)
- Live-host browser test: **not performed**
- Product files changed / GitHub issues created: **none**

## The nine checks run per route/viewport

1. HTTP response status is `200`.
2. Document title is non-empty.
3. The root HTML element declares a language.
4. A sequential `Tab` reaches a focusable element.
5. IDs are unique within the document.
6. Every same-document `a[href^="#"]` fragment points to an existing element.
7. Every link recognized as a skip link (`.skip-link`, `.map-skip-link`, `.skip`, or `[data-map-skip-link]`) has one existing target.
8. No uncaught Playwright `pageerror` occurs during the observation window.
9. The root document's `scrollWidth` does not exceed the viewport width by more than one pixel.

The result was **1,872 passes and zero failed assertions**. This is a browser smoke/structure sweep, not an axe/WCAG conformance run: it does not test screen readers, every accessible name, nested scroll-container overflow, every theme, or live-host behavior. External requests were blocked; local route/assets were served from the exact-SHA build. Focus geometry was recorded for the targeted no-skip family trace, not asserted as a universal pass criterion.

## Skip-link inventory outcome

Eighteen route paths had no link matching the site's recognized skip-link selectors at either tested viewport:

`/app/`, `/hard-texts/genesis-6/`, `/izbrannoe/`, `/journal/`, `/journal/dossiers/g3/`, `/karty/`, `/karty/early-church/`, `/karty/ishod/`, `/karty/maccabim/`, `/karty/melachim/`, `/karty/pavel/`, `/karty/revelation/`, `/karty/shoftim/`, `/karty/shvatim/`, `/karty/yeshua/`, `/konfessii/`, `/konfessii/russkij-baptizm/_app/`, and `/map/`.

Absence of a class-matched skip link alone does **not** establish 18 defects: these routes include standalone apps, an interactive-map intro state, and distinct page shells. The follow-up sequential trace documents their first eight Tab stops. Two concrete page-family findings are now bounded separately in `../verified/MASTER_BUG_MATRIX.md`:

- `GBS-BASELAYOUT-MISSING-SKIP-LINK`: `/hard-texts/genesis-6/` and `/izbrannoe/`.
- `GBS-JOURNAL-MISSING-SKIP-LINK`: `/journal/` and `/journal/dossiers/g3/`.

The remaining no-skip routes were not automatically promoted from this sweep. The known offscreen MobileChrome focus stops remain separate; on the map routes, an intro focus scope must be tested in its actual interaction state rather than treated as an ordinary static header.

## Positive controls and boundaries

- `/about/` and `/articles/` retain functional native bypass links: the focused link becomes visible after its CSS transition, Enter updates `#main-content`, and the next Tab enters page content.
- The Russian Baptist map's skip link reaches `#appframe`; the next Tab enters the iframe.
- On `/karty/avraam/`, the startup intro owns sequential focus. After Enter activates “Начать изучение”, the map skip link is reachable, visibly reveals, activates `#stage`, and the next Tab enters the map. This is not counted as a missing-link failure.
- The existing mobile offscreen-chrome finding is not widened by this route sweep; hidden focus geometry remains a separate defect and is not folded into either skip-link row.

No Product source was changed and no GitHub issue was created. The live release SHA is recorded elsewhere as deployment identity only; these 1,872 checks were local-browser checks, not live-host testing.
