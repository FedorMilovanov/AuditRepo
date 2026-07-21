# Reader Platform Baseline — 2026-07-21

## Scope and evidence

This baseline combines:

1. current source inventory at `gb-is-my-strength/main` = `1a66bd8ef6c0316842deef75371db9598f7a16c6`;
2. selected source snapshot of 1,736 text/config files;
3. branch and commit history related to reader/book/series/article/mobile/theme work;
4. the owner’s Claude conversation export, especially `Визуальное оформление интерфейса Гилла` (86 messages);
5. existing source contracts and guides, including `SERIES-ENGINE-GUIDE.md`, `check-engine-contracts.js` and `engine-sweep.mjs`.

This is a current-source revalidation. Old Claude branches and mockups are evidence only; they are not merge candidates by default.

## Executive finding

The owner’s requested universal reader platform is **partly implemented but not converged**.

The correct architectural foundation already exists:

- three mobile content engines: `series`, `article`, `page`;
- one series config model;
- `shape: 'book'` inside the series engine;
- a shared `MobileChromeShell`;
- shared reader rail/settings primitives;
- engine contracts and Playwright sweep.

However, the implementation is still fragmented:

- the de facto generic series component is still named `GillSeriesChrome`;
- explicit mobile registry coverage is much smaller than actual engine usage;
- Gill and standalone readers persist identical preferences under different keys;
- Sepia is implemented as separate route-scoped modes rather than one site preference;
- 62 PageHead components duplicate early theme bootstrapping;
- ordinary pages and special/immersive routes are not fully classified by one source of truth.

Therefore the right next move is **not a rewrite** and not a new “book engine”. It is a staged convergence around shared preferences, a complete surface registry and compatibility adapters.

## Owner constraints recovered from the Claude export

The durable requirements are:

- real production integration, not a detached mockup;
- reuse the current repository’s SVGs, selectors, controllers and component boundaries;
- seamless mobile top/bottom chrome with safe areas and correct touch behavior;
- centralized Day / Night / Sepia and reading controls;
- one settings change propagates across all compatible engines;
- notes, highlights, bookmarks, glossary, playback and learning are capabilities layered onto engines;
- books, ordinary series, standalone articles and ordinary pages keep different semantics;
- implementation instructions and research must be committed to the repositories;
- mobile performance and correctness are part of “done”, not a later polish pass.

## Verified source inventory

| Finding | Count / status |
|---|---:|
| Relevant text/source files inventoried | 1,736 |
| Files matching reader concepts | 589 |
| Files matching chrome concepts | 438 |
| Files matching theme concepts | 495 |
| Storage/event related files | 153 |
| Legacy HTML files in selected snapshot | 81 |
| Astro-native files in selected snapshot | 563 |
| `GillSeriesChrome` source references | 43 |
| `*PageHead.astro` files | 62 |
| PageHead files with own theme/localStorage bootstrap | 62 |
| `MobileChromeShell` source references | 5 |
| `ReaderSettings` source references | 10 |
| `ReaderRail` source references | 4 |
| Active consumers of `ArticleLayout` / `SeriesArticleLayout` | 0 |

## Canonical engine model

### `series`

For sequenced publications.

- `flat`: ordinary independent parts;
- `book`: chapter headings + numbered articles;
- optional front matter and satellite materials.

**Book is a series shape, not a fourth engine.** This is already documented and validated in source.

### `article`

For a standalone long-form article. It may have TOC, playback, notes, settings and learning, but no series progress.

### `page`

For ordinary non-article pages and catalogs. It usually needs back/home/search/actions, not fictional article progress.

### `special`

Maps, 3D Hall and graph explorers retain their own interaction engine. They integrate shared capabilities only where meaningful: root theme, overlays, scroll-lock coordination, safe areas and navigation actions.

## Current component truth

### De facto generic series engine

`GillSeriesChrome` is already consumed by Gill plus Heart/book, Baptist and thematic series. The implementation is generic by behavior but Gill-named by history.

Migration rule: introduce a neutral façade (`SeriesReaderChrome`) that preserves the exact prop/slot and DOM contract, then migrate imports in bounded batches. Do not fork or rewrite the implementation.

### Standalone readers

Hermenevtika and Kod Da Vinci prove two different standalone compositions. Shared `ReaderRail` and `ReaderSettings` exist, but preference persistence and mobile adapters remain inconsistent.

### Ordinary page engine

`MobileChromePage` and a registry exist, but only a subset of page routes is explicitly registered. Existing sticky-navigation pages and special surfaces require declared opt-outs/capabilities rather than pathname guessing.

### Parallel/unused layouts

`ArticleLayout.astro` and `SeriesArticleLayout.astro` have no source consumers. They must not be forced into the migration merely because they look generic. Evaluate after current component compositions converge.

## Preference fragmentation

Canonical concepts currently live in multiple keys:

- `theme`;
- `gb:font-scale`;
- `gb:gill-reader-theme:v1`;
- `gb:gill-line-height:v1`;
- `gb:gill-measure:v1`;
- `gb:hm-reader-theme:v1`;
- `gb:hm-line-height:v1`;
- `gb:hm-measure:v1`.

Gill and standalone Sepia are scoped to different reader roots. There is no authoritative site-wide Sepia state.

## Required shared preference foundation

Proposed canonical storage:

```text
gb:reader-preferences:v1
```

Fields:

- `theme: light | dark | sepia`;
- `fontScale`;
- `lineHeight: compact | normal | relaxed`;
- `measure: narrow | normal | wide`;
- `textMode: rich | plain`;
- `motion: system | reduced`.

Browser contract:

```text
window.GBReaderPreferences
gb:reader-preferences-change
html[data-reader-theme]
html[data-reader-text-mode]
html[data-reader-motion]
```

`html.dark` is a compatibility output, not a second state source.

The service must migrate legacy keys safely, work when storage is blocked, apply before first paint and update all mounted adapters without reload.

## Global Sepia contract

- Sepia lives in the shared semantic token layer.
- Images/video/maps/3D are not globally filtered.
- Reader paper/text/control tokens change globally.
- Every special surface declares `full`, `chrome-only` or `none` theme capability.
- No new route-specific Sepia keys are permitted.

## Surface registry contract

Every public route must declare:

- route;
- engine: series/article/page/special;
- series shape where relevant;
- adapter;
- capabilities (TOC, playback, save, notes, highlights, learning, theme);
- owner;
- migration state: legacy/adapter/native.

The registry replaces pathname inference and drives browser matrices and migration reports.

## Migration waves

### R1 — global preferences + early head bootstrap

- shared schema/store;
- legacy-key migration;
- first-paint bootstrap;
- global light/dark/sepia tokens;
- cross-route persistence tests.

No chrome redesign in R1.

### R2 — existing settings adapters

- Gill settings and generic ReaderSettings use R1;
- visual/selector parity retained;
- settings changed on one surface are witnessed on another.

### R3 — generic series façade

- `SeriesReaderChrome` compatibility façade;
- mechanical imports in batches;
- existing Gill CSS/visual guard retained.

### R4 — complete surface registry

- classify every public route;
- CI rejects unclassified additions;
- special surfaces and explicit opt-outs documented.

### R5 — PageHead convergence

- replace 62 duplicated theme bootstraps with one shared include;
- metadata/JSON-LD remain page-owned;
- first-paint parity verified.

### R6 — mobile/performance sweep

- 320/360/390/430 overflow matrix;
- safe areas and 44px targets;
- focus and scroll-lock matrix;
- duplicate listener/runtime audit;
- representative desktop parity.

## Representative browser matrix

At minimum:

1. Gill flat series;
2. Heart `shape:'book'` article;
3. Baptist flat series;
4. Hermenevtika standalone article;
5. Kod Da Vinci standalone article;
6. `/articles/` page;
7. `/izbrannoe/` page with existing sticky nav;
8. biblical map special surface;
9. Hall or graph special surface.

## Guardrails

- Do not create a separate book engine.
- Do not merge old Claude branches wholesale.
- Do not combine content redesign with platform migration.
- Do not rename selectors/CSS in the preference foundation transaction.
- Do not force reader bars onto maps/3D.
- Do not weaken engine, publication, parity or ownership gates.
- Preserve real selectors and existing component contracts until browser parity proves migration safe.

## Definition of done

The platform is converged when one preference change propagates across flat series, book series, standalone article and ordinary page; every route is classified; Sepia is globally tokenized; duplicate route-owned preference stores are gone; representative mobile/desktop browser matrices are green; and special surfaces remain performant and interaction-appropriate.
