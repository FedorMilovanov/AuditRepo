# Agent Work Report

## Meta

- **Project:** gb-is-my-strength / gospod-bog.ru
- **Subsystem:** Karty / MapEngine
- **Agent:** GPT-5.6 Thinking
- **Date:** 2026-08-01
- **Audited starting SHA:** `be970bfc13882119e99605ba1689605af4a4af8a`
- **Final source HEAD for this reverify:** `424b09b25fc9d4bace3938f4d44f430be8cc7e4b`
- **Mode:** free-intake / current-head reverify

## 1. Source repairs completed

### GATE-P1-02 — Atlas geometry audit blind spots

- **Recommended status:** `fixed-current`
- **Source PR:** `FedorMilovanov/gb-is-my-strength#659`
- **Exact repair head:** `943c5bacef3ea2dec61eb6b0b19f05f7c8d41b69`
- **Merge:** `65bf6c4a015c933aa3ec8d4046e587e58eabd568`
- **Evidence:** both triggered workflows passed. The permanent Shared Files Guard step imports the real geometry verifier and proves detection of exact marker overlap, label clipping and edge safe-area intrusion.
- **Boundary:** the gate is fixed; existing coordinate debt is reported rather than silently moved.

### A11Y-P1-01 — Avraam duplicate live `<h1>` lifecycle

- **Recommended status:** `fixed-current`
- **Source PR:** `FedorMilovanov/gb-is-my-strength#665`
- **Exact repair head:** `bc8794c545ae640e8cfdb3c5d09db1cc97883ad4`
- **Merge:** `8a8ebf70d1a1e51a4f57d3d38a7ef4a97ff65e5b`
- **Repair:** the no-JS/Pagefind fallback heading remains available during loading and runtime failure, then is removed only after MapEngine reaches `data-map-state=ready`; the interactive intro becomes the sole live `<h1>`.
- **Permanent evidence:** `scripts/map-initial-state-regression-test.js` targets the exact fallback heading, readiness attribute and failure-preservation contract.
- **Exact-head CI:** Metadata & IndexNow Readiness, Search Manifest Policy, Shared Files Guard, Glossary Contract, Deploy Candidate Contract, Native Source Contract, Visual Parity and Route Registry Validators all passed.
- **Boundary:** no heading text, search content, visual styling or MapEngine implementation changed.

### QUAL-P1-07 — story ID schema/runtime disagreement

- **Recommended status:** `fixed-current`
- **Source PR:** `FedorMilovanov/gb-is-my-strength#666`
- **Exact repair head:** `12aa744e10c05c134adc951f01cb5e78ef25de65`
- **Merge:** `424b09b25fc9d4bace3938f4d44f430be8cc7e4b`
- **Confirmed cause:** current routes use underscore-bearing internal story identifiers such as `jerusalem_church`, `peter_john`, `exile_return` and `first_love`; MapEngine already supports them in filter/deep-link state, while the shared schema allowed hyphens only.
- **Repair:** the canonical story pattern is now `^[a-z0-9_-]+$`; the permanent map guard reads that exact schema pattern and validates every current `karty/*/route.json` story ID.
- **Compatibility:** no identifier or public URL was renamed; public route/meta IDs remain hyphen-only.
- **Exact-head CI:** Shared Files Guard, Metadata & IndexNow Readiness, Editorial Dateline Contract and Visual Parity passed. Goldens were not rewritten.

## 2. Lane consolidation and evidence hygiene

The repair sequence briefly had successor PRs while `main` advanced. Final disposition is explicit:

- #663 was superseded by #665 after a new base was required;
- #664 temporarily combined Avraam and story-ID work, then became stale when #665 merged;
- #666 carried only the remaining two-file story-ID diff on top of #665;
- #661, #663 and #664 were closed without force-push, reset or content loss.

One WebKit timeout on superseded #664 affected an unchanged article TOC hit target after 3736/3737 assertions passed. It is not used as final Karty evidence. The canonical Avraam and story-ID heads have their own green exact-head checks.

## 3. Historical rows that require verifier downgrade or stale transition

The following matrix wording is not current at MapEngine v0.56 and should not be reimplemented from old SHAs without a new repro.

### ASTRO-P1-04 — `stories[].stages` ignored

- **Current source evidence:** `getStoryState()` accepts `story.places || story.place_ids` and `story.stages || story.stage_ids`.
- **Permanent evidence:** `map-layers-theme-regression-test.js` asserts stage membership from current `stage_ids` data.
- **Recommended status:** `fixed-current` or `stale-on-current-head`, depending on the original repair history.

### MAP-P1-06 — static archaeology list duplicates data

- **Current source evidence:** MapEngine consumes `cfg.archaeologyProjection`.
- **Permanent guard:** rejects `ARCHAEOLOGY_REFERENCES`, `_classifySource` and `_renderArchaeologyFooter` returning to the generic engine.
- **Recommended status:** `fixed-current` / stale historical wording.

### MAP-P1-08 — clearing search leaves stale opacity

- **Permanent guard:** `map-engine-p0-regression-test.js` explicitly verifies that clearing search restores the exact story opacity contract.
- **Recommended status:** `fixed-current` unless a fresh browser repro contradicts the guard.

### GATE-P1-03 — `atlas:gate` permanently red while schemas stay green

- **Current package evidence:** no current npm script named `atlas:gate`; current map validation owners are `maps:validate`, permanent map regression steps and route/publication audits.
- **Recommended status:** `stale/misnamed`; re-open only with an exact current command and log.

## 4. Confirmed current unresolved clusters

These remain real current-head work and were not closed by the geometry, heading or story-schema lanes.

### MapEngine runtime cluster

Current source still contains the following independently observable defects:

- `ENGINE-P1-21`: screen-to-SVG coordinate conversion ignores `preserveAspectRatio="meet"` letterboxing;
- `ENGINE-P1-22`: `kmBetween()` hardcodes `0.92` instead of `cfg.kmPerUnit`;
- `ENGINE-P1-23`: hover/click code targets `circle:nth-child(3)` rather than a stable marker-dot selector;
- `ENGINE-P1-28` / `QUAL-P1-04`: direct image listener opens `data-src`, then the bubbling delegated panel click can reopen `img.src` thumbnail;
- `MAP-P1-15`: two ruler controls exist, including an unwired one;
- `CSS-P1-01`: one map instance `destroy()` removes shared `#me-base-css` used by other active maps;
- `ASTRO-P1-02`: stage path palettes are finite and lack a safe authored/deterministic fallback for later stages.

A complete source file was independently recovered from immutable production candidate artifact `8802579827` and its Git blob SHA `f60246526bb21fda45d908d4ea2cea6b6d3668ce` exactly matched current source. A local bounded patch passed `node --check`, but it was not published because the available contents API did not accept a mounted file and a one-off patcher/generated writer would violate repository governance. These rows remain open, not falsely marked fixed.

### Base geography SVG cluster

Current `karty/_engine/base-geo.svg` has an empty `<defs>` while using unresolved references. Exact current analysis found 19 missing IDs, including `landG`, `seaG`, `fertileG`, `desertG`, `soft`, `waterRipple`, `hill`, `peak` and `peak-snow`.

- confirms `BASE-P1-01`;
- confirms `RIVER-P1-02` (`waterRipple` referenced four times without a definition);
- requires a separate visual/SYSTEM lane because defining gradients, filters and symbols changes every map using the shared base.

## 5. Duplicate / merge recommendations

- `ENGINE-P1-28` and `QUAL-P1-04` are the same gallery bubbling root cause.
- `RIVER-P1-02` belongs inside the broader `BASE-P1-01` unresolved-defs root cause, while preserving river-specific acceptance evidence.
- `GATE-P1-02` is a verifier/gate defect, not evidence that all geometry rows are now product-fixed.

## 6. Final disposition

For this intake at source `424b09b25fc9d4bace3938f4d44f430be8cc7e4b`:

- unique source-fixed root causes recorded: **3**;
- stale/currently contradicted rows recommended for verifier transition: **4**;
- unresolved runtime/base-SVG clusters remain explicitly open;
- canonical matrix counters remain untouched by this evidence-only PR;
- no production/live state is claimed.

A later source merge does not invalidate these immutable exact-head witnesses, but present-source or production equivalence requires a fresh current-head check.
