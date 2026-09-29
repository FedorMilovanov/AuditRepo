# Current-head reverify — Avraam map heading lifecycle

Date: 2026-09-29<br>
Product under test: `FedorMilovanov/gb-is-my-strength` `main`<br>
Exact Product HEAD: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`<br>
Live `releaseSha` / `controlPlaneSha`: same SHA, read from `/deployments/current.json` on 2026-09-29<br>
Disposition: **admit one direct current regression**, `GBS-AVRAAM-MAP-HEADING-LOST-ON-READY`.

## Current-source confirmation

`src/components/karty/avraam/AvraamMap.astro` supplies a single page-level `<h1 class="sr-only" data-pagefind-body>` before the interactive map stage. In `src/pages/karty/avraam/index.astro:16–32`, an inline lifecycle observer waits for `[data-map-stage]` to reach `data-map-state="ready"`, then removes that fallback `<h1>`.

The current route's generated text projection has an `<h2>` followed by `<h3>` sections, and the current map stage is labelled as the interactive map. The runtime does not add an `<h1>`: the only page-level `<h1>` is the fallback explicitly removed by the ready-state handler. Thus the production-ready state has no level-one heading. This is not the old duplicate-heading condition; it is the opposite post-ready state.

## Same-SHA runtime witnesses (historical, not rerun)

The September 23 report records Product anchor `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`, the current Product `main` and live release SHA. In `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/maps-e2e.json`, the `/karty/avraam/` desktop and mobile entries both report `h1: null` after the map became ready. `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/crawl-summary.txt` independently records `H1=0` for desktop and mobile. The report describes the same runtime observation and isolation checks: with JavaScript disabled or `map-engine.js` blocked, the fallback heading remains; the inline ready-state observer removes it.

No fresh browser run is claimed for this specific map lifecycle issue: Chromium 153 became runnable later in the session, but this browser wave did not exercise `/karty/avraam/`. The current source is unchanged at the exact SHA that produced the archived runtime witnesses. The existing Product check `node scripts/map-initial-state-regression-test.js` passes, but inspection shows it only asserts that removal waits for `ready`; it does not assert the postcondition of exactly one page `<h1>`. This is a regression-guard coverage gap within this same defect, not a separate active work unit.

## Contract / duplicate check

This is a regression against the previously accepted Avraam heading contract in Product PR #665, merged as `8a8ebf70d1a1e51a4f57d3d38a7ef4a97ff65e5b`: retain the searchable/static fallback until the map succeeds, then leave exactly one page `<h1>`—the interactive intro heading. The current map runtime's title is an `<h2>` (and other map markup is not a replacement page `<h1>`), so the old fallback-removal lifecycle no longer satisfies that contract. `IshodMap.astro` remains a useful neighboring example that retains its page `<h1>`.

Open Product PRs #2142–#2145 do not touch the Avraam map or heading lifecycle; open-issue searches for `Abraham map heading h1 accessibility` and `karty avraam heading screen reader` returned no matches.

## Scope and closure boundary

Affected route: `/karty/avraam/`, after the map reaches ready. Readers using heading navigation lose the page-level heading and are left with section headings beginning at level 2. Search indexing is not claimed as the defect; the static projection remains in the generated document.

Close after resulting-main proof retains exactly one meaningful page `<h1>` after the ready transition, keeps a useful fallback heading with JavaScript disabled/loading/error, and confirms no duplicate `<h1>` during the cinematic intro or on desktop/mobile. The implementation choice is to restore the documented lifecycle contract—keep the hidden `<h1>` or make the runtime title the single `<h1>`—not to reopen an owner decision about whether the page needs a heading.
