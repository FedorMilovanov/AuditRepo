# Comment on arena-agent-reverify-1 Pass 3 findings N-REV1-6 / N-REV1-7

- Target report: `incoming/arena-agent-reverify-1/2026-06-25/REPORT-pass3.md`
- Target findings: `N-REV1-6` (Baptisty GBS2 controls all dead), `N-REV1-7` (double CSS)
- Comment type: challenge + confirm
- My audited SHA: `03e01a0008de34d654175ea600cdf9f22b2351b4`
- Evidence files:
  - `../evidence/gbs2-controls-and-dead-assets-03e01a0.txt`
  - `../evidence/security-performance-crosscheck-03e01a0.txt`

## Challenge N-REV1-6

The report uses static absence of `floating-cluster-controller.js` / `data-fc-action` as proof that all Baptisty GBS2 controls are dead. That inference is false on current production-like `dist`.

Baptisty GBS2 controls are handled by `enhancements.js` + `site.js`, not necessarily by `floating-cluster-controller.js`.

Playwright browser evidence from production-like `dist`:

### `/baptisty-rossii/noch-na-kure/`

```text
hasEnh: true
hasToc: true
tocItems: 8
sheetTocText: populated

theme click: htmlDark false → true
font click: bodyFont 18px → 18.72px
share click: #share-dialog appears
search click: .cp-backdrop display none → flex, class cp-backdrop is-open
mobile bottom bar click: gbs2Sheet aria-hidden true → false, class gbs2-sheet gbs2-open
```

### `/baptisty-rossii/` hub

```text
hasEnh: true
tocItems: 4
count: 1 / 2
sheetTocText: 01Части серии02Исследовательская база
theme click: false → true
font click: 18px → 18.72px
mobile sheet: aria-hidden false, class gbs2-sheet gbs2-open
```

Recommended action: reject `N-REV1-6` as written. If any residual exists, it must be re-verified as a narrow control-specific issue by browser behavior, not static absence of fc-controller.

## Confirm N-REV1-7

I independently verified the double CSS load in production-like `dist`:

```text
/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/
  ../../css/floating-cluster.css
  /_astro/FloatingCluster._SRMcKLI.css

/articles/kod-da-vinchi/
  ../../css/floating-cluster.css
  /_astro/FloatingCluster._SRMcKLI.css

/articles/20-antisovetov-pastoru/
  ../../css/floating-cluster.css
  /_astro/FloatingCluster._SRMcKLI.css
```

Gill context only has the external stylesheet:

```text
/articles/dzhon-gill-istoricheskiy-kontekst/
  ../../css/floating-cluster.css?v=ccc70580
```

Recommended status for `N-REV1-7`: `confirmed-production-like-dist`, low P2/P3 performance cleanup. It is real but not functional breakage.
