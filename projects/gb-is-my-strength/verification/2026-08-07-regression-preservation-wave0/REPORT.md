# Regression / Preservation Wave 0 — forensic synthesis

Date: 2026-08-07

## Purpose

This wave converts the large regression-forensic campaign into a bounded current work model. It does **not** copy every historical candidate into `MASTER_BUG_MATRIX.md`, does not restore content automatically, and does not mutate Product.

The operating rule is:

> historical loss signal ≠ current defect; current defect requires current evidence and a named owner/boundary.

## Evidence base

The synthesis used the uploaded forensic audit bundles and the two consolidated marathon ledgers produced on 2026-08-07, plus direct current Product inspection through the GitHub connector.

The large candidate corpus is retained as evidence, not as backlog:

- 115 consolidated evidence checks;
- 27 restore/disposition rows;
- 705 Gill/Herm low-similarity candidates;
- 175 AI/coauthored critical commits in the risk corpus;
- current AuditRepo MASTER and current Product owners/PRs.

## Proven current systemic root: SYS-VALIDATOR-TRUST

Four manifestations are current and share one mechanism: a validator can report success without proving the property its name implies.

### VTRUST-01 — content coverage can finish with no exercised authoritative comparison

`scripts/content-coverage-audit.js` records `covered`, but success is controlled only by `failures`. A configuration/authority drift can therefore reduce the exercised set without automatically turning the audit red.

Repair boundary: validator health output must distinguish expected / exercised / skipped and make an unexpected zero-exercise state fail closed.

### VTRUST-02 — declared WORD MULTISET comparison is not a multiset frequency comparison

Current logic increments `missing` only when `dw.has(word)` is false. If authoritative legacy contains a word 20 times and dist contains it once, 19 missing occurrences are not counted.

Repair boundary: use a true frequency deficit (`max(legacyCount-distCount, 0)`) or replace the proxy with typed semantic content units. Mutation evidence must prove the frequency-loss case goes red.

### VTRUST-03 — Avraam's special content threshold is currently non-operative under authority resolution

`data/route-profiles/karty-avraam.json` has `legacyPath` but no `legacyStatus`. `legacy-source-authority.js` treats profiled routes as authoritative only for `canonical` or `runtime-required`, so the coverage loop skips the route before the `karty/avraam/index.html` 40% threshold can run.

This should not be 'fixed' by making strict-native legacy HTML canonical again. The correct outcome is to make authority explicit, remove/deprecate dead threshold policy, and protect Avraam's accepted static scholarly units with a positive manifest in the Avraam owner.

### VTRUST-04 — Avraam audit contains an assertion that is mathematically always true

Current `scripts/avraam-map-audit.js` contains the Shechem title assertion shaped as `condition ? true : true`. It cannot fail.

Repair boundary: replace with a real assertion and add a deliberate mutation fixture proving the guard rejects a corrupted Shechem title.

## Why these are one MASTER row

The common defect is not four unrelated Product bugs. It is validator trust: expected coverage can disappear, proxy semantics can overstate coverage, a special policy can be unreachable, and an assertion can be structurally incapable of failing.

The closure unit is therefore `SYS-VALIDATOR-TRUST`, with two bounded Product waves:

1. Wave 1A — content coverage / authority honesty;
2. Wave 1B — Avraam guard honesty + positive source apparatus manifest.

The row must be removed from MASTER once the common mechanism is fixed and representative mutations are killed.

## Current Product collision / ownership

`AR-IDX-09` remains a real current defect but is already actively owned by Product PR #1168 (`fix(search): enforce exact global Ctrl/Command+K shortcut`). AuditRepo should classify it as `fixing`, not spawn a parallel lane. Closure is allowed only after merged-current evidence.

No Product lane from this Wave 0 should collide with #1168.

## Semantic recovery shortlist — reverify, not MASTER bugs

The forensic corpus is deliberately narrowed to high-information candidates.

### Gill Part I annotation conservation

Six likely lost `.gterm` annotations:

- Особых баптистов;
- Хорслидаун / Саутварк;
- джиновая лихорадка;
- Корпоративный акт 1661 года;
- Акты об испытании;
- Банхилл-Филдс.

Disposition rule: re-read current canonical sentence. Restore **annotation only** when the current concept still benefits from glossary support. Do not restore deleted surrounding prose by word-count pressure.

### Hermenevtika Scripture-reference conservation

Current forensic parity shows `.bref` count 63 → 60 while the article text itself has very high shingle preservation and a much richer note apparatus. Resolve the exact three reference dispositions as `LOST / MOVED / REFORMATTED / INTENTIONAL`; no broad rollback.

### Gill source→dist import-graph probes

Reverify four cases where source-corpus search and dist differ:

- Benjamin Stinton;
- никкуд;
- аналогия веры;
- Мемра.

Directory-level `source=true` is not enough. Trace the canonical import graph before declaring loss.

### Baptists 1884

Treat the 48 non-Gill low-similarity candidates as a bounded Research/current-owner review package, not 48 MASTER rows.

## Explicit keep-deleted / do-not-restore classes

The following are not recovery targets without new current evidence:

- Gill claims already forbidden by source reconciliation as overconfident/unsupported;
- the old Hermenevtika quiz that inverted Abner Chou's position;
- intentionally removed Gill duplicate sections;
- deep Research archive material not selected for publication;
- Lenis runtime behavior in TheLegendaryPoet;
- already repaired historical losses (Gill Part III figures, last-page anchor, Herm Scripture corruption, Antisovetov note-box, Nagornaya/series SEO, core Astro CSS, map manifest/anti-FOUC, Gill scrollspy/progress ring, tooltip CSS parser cascade, workflow YAML, Ishod basemap).

## Branch archaeology boundary

`main` is current Product truth but not guaranteed to contain every historically approved capability. The current Product remote still contains many `lane/*` refs, including reader, tooltip, Hermenevtika and release diagnostics.

Do **one bounded read-only archaeology wave**:

For every retained lane/closed-unmerged PR, derive:

- branch / PR;
- merge base;
- unique commits/material;
- declared successor if any;
- whether current main contains the capability/material;
- final disposition: `MERGED / SUPERSEDED / DIAGNOSTIC_ONLY / REJECTED / UNIQUE_REVIEW`.

Only `UNIQUE_REVIEW` receives manual semantic review or can create a new current candidate. Branch count itself is not a defect.

## Positive preservation architecture

Do not create 115 permanent tests. Converge toward a small set of positive contracts.

### Accepted Semantic Manifest

For high-value routes record typed important units instead of whole-HTML goldens:

- canonical owner/source;
- accepted baseline anchor;
- section IDs/roles/order where material;
- source/claim IDs;
- glossary/reference annotations;
- media IDs and provenance;
- reader capabilities;
- explicit deletion dispositions.

Pilot only on high-value surfaces first: Hermenevtika, Gill Part I, Avraam; TheLegendaryPoet Yesenin Part II belongs to the TLP project rather than this GB MASTER.

### Declared Surface Closure Set

For each governed entity, explicitly say which surfaces must exist (`source`, `route`, `data`, `search`, `dist`, `live`) and which are intentionally N/A. A missing expected layer must never become a vacuous PASS.

### Validator Health Contract

Blocking validators should expose at least:

- expected;
- exercised;
- skipped with reason;
- failures;
- authority source;
- mutation cases killed where applicable.

`SKIP` or unsupported execution must not be printed/aggregated as PASS.

### Mutation suite

Start from historical real disasters, not random score-chasing. Initial high-value mutations include:

- remove closing spans;
- mass-remove classes;
- duplicate id;
- inject U+FFFD;
- remove a source ID;
- remove `.gterm` / `.bref`;
- invert quiz correct answer/stance;
- remove route from search/sitemap;
- duplicate runtime owner;
- remove stylesheet import;
- make coverage expected but exercised zero;
- reduce repeated-word frequency;
- introduce an always-true assertion;
- stale runtime identity;
- geometry overlap / hidden control;
- source exists in directory but leaves canonical import graph.

The useful metric is regression-class kill evidence, not raw test count.

## Process simplification — optional improvement, not current defect

Recent Product history contains several safe but expensive successor chains where identical/near-identical payloads are repeatedly rebuilt on a newer main solely to re-earn exact-head evidence. Preserve the no-stale-green principle, but investigate a synthetic merged-candidate receipt / equivalent mechanism before turning successor PR churn into a permanent norm.

This belongs in `WORK_QUEUE.md` until a current correctness defect is proven.

## Wave sequence and closure criteria

### Wave 0 — AuditRepo synthesis

Done when:

- one `SYS-VALIDATOR-TRUST` row exists in MASTER;
- `AR-IDX-09` is marked as already owned by #1168;
- this report is merged;
- semantic candidates remain reverify evidence rather than bloating MASTER.

### Wave 1A — Coverage trust

Done when:

- expected/exercised/skipped are explicit;
- an unexpected zero-exercise condition cannot report green;
- repeated-word frequency deficit is measured honestly;
- authority state cannot silently disable a special policy;
- warnings are not also reported as ordinary OK;
- mutation fixtures prove the repaired cases.

### Wave 1B — Avraam guard trust

Done when:

- always-true Shechem assertion is gone;
- corrupt-Shechem mutation fails;
- 14-item scholarly apparatus has a positive typed manifest/IDs;
- removing one required source ID fails;
- dead coverage threshold policy is retired or made semantically reachable for a real authoritative surface.

Then remove `SYS-VALIDATOR-TRUST` from MASTER.

### Wave 2 — Semantic disposition

Done when the bounded Gill/Herm/source→dist/Baptists shortlist has no `UNKNOWN` entries. Only confirmed current losses produce Product changes.

### Wave 3 — Branch archaeology

Done when every selected retained lane has a disposition and `UNIQUE_REVIEW` is zero or converted into concrete current candidates.

### Wave 4 — Positive manifest pilots

Done when Hermenevtika, Gill Part I and Avraam each have a useful semantic/capability manifest with mutation evidence for at least one meaningful deletion/corruption class.

### Wave 5 — Guard retirement

Remove/degrade low-value proxies after the positive owners exist: magic line/byte/count floors, redundant literal grep, obsolete migration parity, duplicated guards and warnings without owner/expiry.

## Campaign closure

The 2026-08-07 regression/preservation forensic campaign can close independently of unrelated MASTER work when:

1. validator trust is repaired;
2. high-signal semantic recovery candidates have dispositions;
3. branch archaeology leaves no unexplained approved unique material;
4. positive preservation pilots protect the key high-value surfaces.

AuditRepo remains active; the campaign closes, not the repository.
