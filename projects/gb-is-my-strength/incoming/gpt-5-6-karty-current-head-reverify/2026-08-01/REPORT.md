# Agent Work Report

## Meta

- **Project:** gb-is-my-strength / gospod-bog.ru
- **Subsystem:** Karty / MapEngine
- **Agent:** GPT-5.6 Thinking
- **Date:** 2026-08-01
- **Audited starting SHA:** `be970bfc13882119e99605ba1689605af4a4af8a`
- **Current source HEAD at this checkpoint:** `65bf6c4a015c933aa3ec8d4046e587e58eabd568`
- **Mode:** free-intake / current-head reverify

## 1. Source repair completed

### GATE-P1-02 — Atlas geometry audit blind spots

- **Recommended status:** `fixed-current`
- **Source PR:** `FedorMilovanov/gb-is-my-strength#659`
- **Exact repair head:** `943c5bacef3ea2dec61eb6b0b19f05f7c8d41b69`
- **Merge:** `65bf6c4a015c933aa3ec8d4046e587e58eabd568`
- **Evidence:** both triggered workflows passed. The permanent Shared Files Guard step now imports the real geometry verifier and proves detection of exact marker overlap, label clipping and edge safe-area intrusion.
- **Boundary:** the gate is fixed; existing coordinate debt is reported rather than silently moved.

## 2. Source repair in flight

### QUAL-P1-07 — story ID schema/runtime disagreement

- **Recommended status:** `repair-ready / in-flight`
- **Source PR:** `FedorMilovanov/gb-is-my-strength#661`
- **Current exact head:** `9808237528618e9faa439c62719bfc66fad14245`
- **Current evidence:** current published routes use underscore-bearing internal story IDs (`jerusalem_church`, `peter_john`, `exile_return`, `first_love`); MapEngine supports them in filter/deep-link state, while `karty/_shared/route.schema.json` declared only hyphens.
- **Repair:** canonical story pattern becomes `^[a-z0-9_-]+$`, and the permanent map regression guard loads that exact schema pattern and checks every current map route.
- **Compatibility:** no identifiers are renamed; existing `story=` state remains stable. Public route/meta IDs remain hyphen-only.

## 3. Historical rows that require verifier downgrade or stale transition

The following matrix wording is not current at MapEngine v0.56 and should not be reimplemented from old SHAs without a new repro:

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

These remain real current-head work and were not closed by the gate/schema lanes.

### MapEngine runtime cluster

Current source still contains the following independently observable defects:

- `ENGINE-P1-21`: screen-to-SVG coordinate conversion ignores `preserveAspectRatio="meet"` letterboxing;
- `ENGINE-P1-22`: `kmBetween()` hardcodes `0.92` instead of `cfg.kmPerUnit`;
- `ENGINE-P1-23`: hover/click code targets `circle:nth-child(3)` rather than a stable marker-dot selector;
- `ENGINE-P1-28` / `QUAL-P1-04`: direct image listener opens `data-src`, then the bubbling delegated panel click can reopen `img.src` thumbnail;
- `MAP-P1-15`: two ruler controls exist, including an unwired one;
- `CSS-P1-01`: one map instance `destroy()` removes shared `#me-base-css` used by other active maps;
- `ASTRO-P1-02`: stage path palettes are finite and lack a safe authored/deterministic fallback for later stages.

A complete source file was independently recovered from immutable production candidate artifact `8802579827` and its Git blob SHA `f60246526bb21fda45d908d4ea2cea6b6d3668ce` exactly matched current source. A local bounded patch passes `node --check`, but it was not published because the available contents API does not accept a mounted file and a one-off patcher/generated writer would violate repository governance. These rows remain open, not falsely marked fixed.

### Base geography SVG cluster

Current `karty/_engine/base-geo.svg` has an empty `<defs>` while using unresolved references. Exact current analysis found 19 missing IDs, including `landG`, `seaG`, `fertileG`, `desertG`, `soft`, `waterRipple`, `hill`, `peak` and `peak-snow`.

- confirms `BASE-P1-01`;
- confirms `RIVER-P1-02` (`waterRipple` referenced four times without a definition);
- requires a separate visual/system lane because defining gradients, filters and symbols changes every map using the shared base.

## 5. Duplicate / merge recommendations

- `ENGINE-P1-28` and `QUAL-P1-04` are the same gallery bubbling/root-cause defect.
- `RIVER-P1-02` belongs inside the broader `BASE-P1-01` unresolved-defs root cause, while preserving river-specific acceptance evidence.
- `GATE-P1-02` is a verifier/gate defect, not evidence that all geometry rows are now product-fixed.

## 6. Verifier notes

1. Count source PR #659 as one fixed gate root cause, not as closure of every Karty visual defect it can now detect.
2. After source PR #661 completes, append its merge SHA and exact-head workflow evidence before moving `QUAL-P1-07` to `fixed-current`.
3. Do not re-open rows contradicted by permanent v0.56 guards without fresh current-head source/browser evidence.
4. No production/live state is claimed by this intake.
