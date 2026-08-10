# Current verification — Hermenevtika mobile/tablet chrome ownership

Date: 2026-08-11
Disposition: `CONFIRMED-CURRENT / P2`
Product authority: `main@be8d439aec1e18f268d247967c70a0c318b1dabd` at verification snapshot
Repair lane: Product PR #1585, head `57c4a83df2d70a0977a36633321dfd589cd5bafe`

## Current-main root

Current `HermenevtikaMobileBar.astro` declares and implements the dedicated Hermenevtika control surface below 1200px. Its top and bottom bars are visible under `max-width:1199px`, and the article body reserves space for those fixed bars.

Current `SingleArticleCluster.astro` still renders the generic standalone floating cluster for `variant="hermeneutics"` and contains no Hermenevtika-specific non-rendering rule through 1199px.

Therefore two control owners coexist in the same breakpoint window on current main:

- at <=899px, the generic cluster can fall into its generic mobile pill while Hermenevtika's dedicated bars are also active;
- at 900–1199px, the desktop-style generic floater can remain while the dedicated Hermenevtika mobile/tablet bars are active.

This is a current responsive ownership defect, not a historical title/content residual and not a mere coverage wish.

## Secondary current root in the same ownership family

The saved-quotes/highlights control is dynamically docked into Hermenevtika's fixed bottom bar. The generic floating-FAB styles can retain standalone dimensions/offset/animation behavior after docking, violating the bar's canonical 36×36 control geometry. Clean profiles normally have zero saved quotes, so this state can evade ordinary screenshots.

## Existing bounded repair

Product PR #1585 changes only:

- `src/components/ui/floating-cluster/SingleArticleCluster.astro`;
- `scripts/hermenevtika-mobile-chrome-visual-contract.mjs`;
- `.github/workflows/interactive-audit.yml`.

The Product repair:

- suppresses the hermeneutics generic floater through 1199px;
- reasserts only the docked Highlights button's existing 36×36 host geometry;
- neutralizes stale standalone offsets and the floating-FAB bump animation only while docked;
- adds a seeded dynamic saved-quote witness.

## Exact-head browser evidence

PR #1585 exact head: `57c4a83df2d70a0977a36633321dfd589cd5bafe`.

Runtime Interactive Audit run `31434712840` contains an independent job:

`Hermenevtika Chromium WebKit chrome contract` — **SUCCESS**.

Its steps passed exact source identity, dependency/browser setup, production-like build, the Hermenevtika chrome visual contract, and evidence upload.

Retained artifact previously inspected in this audit records **84/84 PASS** across:

- Chromium + WebKit;
- Hermenevtika + independent `/articles/lot-i-sodom/` control route;
- widths 390, 412, 899, 900, 1199, 1200, 1440;
- horizontal overflow;
- mobile/tablet vs desktop chrome ownership;
- seeded saved-quotes dock geometry/open-close-focus state;
- docked animation suppression.

Manual review of saved 390/900/1199/1200 screenshots found no obvious clipping or fixed-bar collision on the repaired exact head.

The workflow's broader `interactive-audit` job is red for an independent downstream/root and does not invalidate the isolated successful Hermenevtika exact-head job.

## Why this is not closed

The repair branch is still an open draft with a stale historical base. Current Product main at the verification snapshot does not contain the repair CSS. Therefore exact-head branch success proves the bounded repair, not Product closure.

## Required terminal outcome

1. Rebase/replay the exact bounded repair from fresh final main without unrelated payload.
2. Prove the generic hermeneutics floater is non-rendering through 1199 and is the sole owner again from 1200.
3. Prove seeded docked Highlights geometry remains 36×36, unshifted and non-animated while docked.
4. Keep Chromium + WebKit coverage at 390/412/899/900/1199/1200/1440 and independent control route.
5. Merge only from fresh main, then rerun the permanent proof on the resulting current main.

Residual until then: **CURRENT / OPEN**.
