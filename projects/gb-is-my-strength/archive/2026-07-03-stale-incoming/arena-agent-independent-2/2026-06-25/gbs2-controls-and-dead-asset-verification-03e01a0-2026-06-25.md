# GBS2 controls + dead asset verification — `03e01a0`

## Meta
- Agent: `arena-agent-independent-2`
- Date: 2026-06-25
- Source HEAD: `03e01a0008de34d654175ea600cdf9f22b2351b4`
- Method: production-like `dist/` + Playwright browser checks + static source scans
- Evidence: `evidence/gbs2-controls-and-dead-assets-03e01a0.txt`

## 1. Challenge / retire P1-14, P1-15, P1-16 as originally worded

The current ledger still contains old Baptisty GBS2 control findings:

- `P1-14`: “GBS2 controls in SeriesArticleLayout completely unwired”
- `P1-15`: “gbs2-sheet TOC pane always empty — no controller”
- `P1-16`: “Hub progress tracking elements unwired”

These are not reproducible on production-like `dist` at `03e01a0`.

### Baptisty article page witness

Route tested: `/baptisty-rossii/noch-na-kure/`

Browser evidence:

```text
hasEnh: true
hasToc: true
tocItems: 8
sheetTocText: populated with section headings
```

Controls:

```text
theme click: htmlDark false → true
font click: bodyFont 18px → 18.72px
share click: #share-dialog appears with share options
search click: .cp-backdrop display none → flex, class cp-backdrop is-open
mobile bottom bar click: gbs2Sheet aria-hidden true → false, class gbs2-sheet gbs2-open
```

### Baptisty hub witness

Route tested: `/baptisty-rossii/`

Browser evidence:

```text
hasEnh: true
tocItems: 4
count: 1 / 2
sheetTocText: 01Части серии02Исследовательская база
theme click: false → true
font click: 18px → 18.72px
mobile sheet: aria-hidden false, class gbs2-sheet gbs2-open
```

## Recommended canonical status

- `P1-14`: `fixed-current-production-like-dist` or `false-positive-current` if the claim was based only on source assumptions.
- `P1-15`: `fixed-current-production-like-dist`; sheet TOC is populated on both article and hub routes tested.
- `P1-16`: `fixed-current-production-like-dist` for the visible hub controls tested. If verifier wants a narrower residual about exact percentage semantics, it should be split and reworded; the broad “unwired” claim is false.

## 2. Confirm P1-9 — audit-pro cache-bust asset list divergence

Current source comparison:

```text
scripts/cache-bust.js ASSETS: 22
scripts/audit-pro.js CACHE_BUST_ASSETS: 24

in cache-bust but not audit-pro:
- js/glossary.js
- js/series-cards.js

in audit-pro but not cache-bust:
- js/modules/back-to-top.js
- js/modules/faq-accordion.js
- js/modules/img-loaded.js
- js/modules/theme.js
```

Recommended status: `confirmed-current-source-tooling`, likely P2/P3 depending on whether `audit-pro` uses this list as a release blocker. It is a real divergence, but not necessarily P1 after the production postbuild hash guard exists.

## 3. Confirm P2-14 — `series-cards.js` is dead but still precached

Current artifact/source scan:

```text
series-cards in dist html count: 0
data-series-cards in dist/source count: 0
sw precache occurrences root+dist: 2
js/series-cards.js size: 2642 bytes
```

This is a real low-impact cleanup issue: the file is not loaded by pages and no `data-series-cards` mounts exist, but the service worker still precaches it.

Recommended status: `confirmed-current`, severity P3/low P2. It is not a user-visible bug, but it wastes SW precache space and contributes to asset-list drift.

## 4. Notes for verifier

This report uses production-like browser evidence, so it should outrank source-only claims for P1-14/P1-15/P1-16. The broader pattern is repeated: many older findings were correct against source assumptions or older HEADs, but the current deploy path (`strangler:build:production-like` + postbuild cache bust) changes actual production behavior.
