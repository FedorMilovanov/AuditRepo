# Current-head Journal keyboard-bypass reverify — 2026-09-30

- Product source `HEAD`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`
- Browser: Playwright + Chromium `153.0.8010.0`
- Target: local production-like `dist` from the exact SHA above
- Live-host browser session: **not run**
- Machine evidence: [`evidence/2026-09-30-no-skip-route-triage.json`](evidence/2026-09-30-no-skip-route-triage.json)
- Coverage: `/journal/` and `/journal/dossiers/g3/`, each at `1280×900` and `390×844`; fresh page contexts, 300 ms settle, sequential Tab trace
- Product source changed / GitHub issue created: **no**

## Disposition

Admit the separate route-shell finding `GBS-JOURNAL-MISSING-SKIP-LINK` for `/journal/` and `/journal/dossiers/g3/`. Both routes expose the same Journal topbar/brand navigation, but have no recognized skip/bypass link and no ID on their `main` landmark. This is confirmed in the rendered browser and is distinct from `GBS-BASELAYOUT-MISSING-SKIP-LINK`, which covers two different page shells.

## Observed keyboard path

| Route | `main` | Desktop first sequential Tab stops | Mobile state |
|---|---|---|---|
| `/journal/` | `<main class="journal-landing">`, no ID | Journal brand → “Статьи” | Three translated-offscreen MobileChrome controls precede the Journal brand; that remains within the separate existing mobile-chrome finding. |
| `/journal/dossiers/g3/` | `<main class="dossier">`, no ID | Journal brand → “Главная” → “Журнал” | Same three translated-offscreen MobileChrome controls precede the Journal brand; not merged with this finding. |

Neither route contains a link matching the established skip-link selectors. The repeated Journal header is browser-visible and keyboard-focusable; the missing mechanism means a keyboard user must traverse its focusable header links before reaching the page-specific content. The native `main` landmark exists, so this finding does not claim landmark navigation is absent for screen-reader users.

Source cross-check: `JournalLanding.astro` and `G3Dossier.astro` each render a `header.journal-topbar` with the Journal brand and section/breadcrumb navigation, followed by a `main` without an ID. Source inspection supports—but does not replace—the browser result.

## Scope and closure boundary

Add a working bypass link before the repeated Journal topbar and a valid main-content target on both routes. Resulting-main browser proof at desktop and mobile must verify sequential focus reaches a visible-on-focus bypass before the Journal header, Enter navigates to the target, and the next Tab enters page content. Preserve the working About/Articles skip links and address MobileChrome's translated-offscreen focus stops only through their separate row.

This is local exact-SHA evidence, not a live-host browser test. No Product code or GitHub issue was changed; issue #437 was not touched.
