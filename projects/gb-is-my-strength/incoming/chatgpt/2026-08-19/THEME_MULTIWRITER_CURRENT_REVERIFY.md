# AR-IDX-JS-02-MULTIWRITER — current behavioral reverify

## Disposition

**Recommended verifier disposition: retire/absorb the current MASTER residual as a behavioral conflict.**

The historical observation “`site.js` / `enhancements.js` still write the legacy `theme` key while `reader-preferences.js` owns canonical preferences” remains source-true, but current Product code intentionally models those writes as compatibility bridges and has a current fail-closed regression contract around the transition.

This file is negative/current evidence; it does **not** add a new work unit to PR #344.

- Project: `gb-is-my-strength`
- Current Product boundary: `01894214765d7ab6e51a7eea1fb7f239c6591af8`
- Product mutation: none
- MASTER mutation: none

## Canonical owner is explicit

Current `js/reader-preferences.js` declares one canonical storage owner:

```text
gb:reader-preferences:v1
```

and owns:

- first-class theme state `light | dark | sepia`;
- font scale, line height, measure, text mode and motion;
- DOM application (`data-reader-theme`, `html.dark`, CSS variables);
- persistence;
- same-document compatibility reconciliation;
- cross-tab synchronization.

`persist(state)` writes canonical JSON first, then deliberately mirrors the old binary theme key:

```js
safeSet(STORAGE_KEY, JSON.stringify(state));
safeSet('theme', state.theme === 'dark' ? 'dark' : 'light');
```

The comment is explicit: Sepia is a light color-scheme variant for legacy binary controls.

## Same-document legacy writes are reconciled back into the canonical store

The canonical runtime registers a document-level click bridge covering the current legacy control selector family, including:

```text
[data-fc-action="theme"]
[data-gbs2-theme]
.gb-theme-toggle
.gb-fc-theme
#barThemeBtn
#themeToggle
.theme-toggle
.nag-sidebar-theme-btn
```

After the complete click dispatch, it reads the **actual final `html.dark` state** and commits that state through `GBReaderPreferences`:

```text
legacy control toggles current visual state
→ canonical bridge waits until click dispatch finishes
→ derive dark/light from html.dark
→ commit canonical preference
→ persist canonical JSON + compatibility mirror
```

This specifically addresses the same-document limitation of the `storage` event: localStorage changes do not notify the same browsing context.

Current `site.js` also contains a late compatibility bridge that prefers:

```js
window.GBReaderPreferences.setTheme(theme, { source: 'legacy-site-toggle' })
```

when the canonical API is present, falling back to the old key only if the canonical owner is unavailable.

## Cross-tab compatibility protects Sepia from the binary mirror

The canonical `storage` handler owns both its canonical key and the compatibility `theme` key.

For canonical JSON changes it applies the parsed full state without re-persisting.

For a legacy `theme=dark|light` event it first reads canonical storage. It explicitly refuses to downgrade a canonical Sepia state through the compatibility `theme=light` write:

```js
if (canonical && canonical.theme === 'sepia') return;
```

Thus the expected event order from another tab:

```text
canonical JSON → sepia
compatibility theme → light
```

does not convert the receiving tab from Sepia to light.

## First-paint/load-order boundary is also owned

Current `ReaderPreferencesHead.astro` installs:

1. synchronous `reader-preferences-head.js` first-paint bootstrap;
2. shared preference CSS;
3. deferred canonical `reader-preferences.js` runtime;
4. deferred reader-state runtime.

The source regression requires every applicable Astro head to render this shared preference owner and forbids route-owned theme bootstraps.

A corrected current-equivalent import/script-carrier census finds **20 Astro routes that actually load `site.js` and/or `enhancements.js` as script tags; all 20 also resolve `ReaderPreferencesHead`**. There is no current Astro route in that set where a legacy theme writer is the only first-paint preference authority.

This is materially different from merely observing that legacy scripts still contain `localStorage.setItem('theme', ...)`.

## Durable regression contract already exists and is wired

Current `scripts/reader-preferences-regression-test.js` directly tests the behavior that would make multi-writer compatibility dangerous:

- legacy Gill/HM values migrate into one canonical first-paint state;
- canonical state wins over conflicting legacy values;
- a same-document legacy theme click is reconciled into canonical JSON;
- a modern canonical control does **not** double-commit through the compatibility bridge;
- all applicable Astro heads use the shared first-paint owner;
- old route-owned theme bootstraps are rejected;
- `site.js` must contain the canonical `GBReaderPreferences.setTheme` bridge;
- canonical runtime must cover the legacy control selectors.

Running the current-equivalent test in this forensic pass produced:

```text
✅ reader preference foundation guard passed (72 Astro heads, 54 legacy documents)
ReaderState regression: core geometry, phases, migration and single-owner contracts passed.
```

This script is not orphan evidence: `.github/workflows/shared-files-guard.yml` executes it in the required `Reader preferences regressions` step.

An additional Playwright smoke (`scripts/reader-preferences-browser-smoke.js`) contains a stronger physical matrix, including legacy migration, cross-family updates and two simultaneously open tabs where dark→sepia must remain Sepia despite the compatibility `theme=light` event. That browser smoke does not appear to be directly wired by filename in current workflows, so it is supporting design evidence rather than claimed current admission authority.

## Exact-head admission corroboration

Product PR #1735 exact head `f93567cece49530b81a7cdb4f8cbd72d97736358` differed from the primary forensic source only in `scripts/css-layer-validator.js` and reached terminal success in Shared Files Guard. The required reader-preferences regression step is part of that workflow, so current relevant source has a fresh successful admission witness in addition to the local deterministic run.

## What remains true but is not a current defect

Legacy code still contains direct writes to the compatibility `theme` key. That is maintenance/migration debt and could be cleaned up after route conversion.

But the current behavioral model is:

```text
canonical JSON owns truth
+ compatibility key mirrors binary old controls
+ legacy clicks reconcile into canonical state
+ cross-tab bridge handles canonical + old events
+ first-paint owner precedes legacy deferred scripts
+ regression guard locks the transition
```

No current reader-visible theme reversal, persistent canonical/DOM divergence, or competing first-paint owner was demonstrated in this pass.

Therefore “multiple files can write the legacy key” alone no longer satisfies the AuditRepo standard for a current residual.

## Suggested closure

- Remove `AR-IDX-JS-02-MULTIWRITER` from active MASTER unless a fresh behavioral witness demonstrates an actual divergence not covered by the compatibility contract.
- If physical retirement of old `theme` writes is desired, put it in `WORK_QUEUE.md` as cleanup/refactor, not as a current Product defect.
- Preserve the canonical compatibility regression until the last legacy control/writer is actually removed.

## Boundary / negative claims

- This does not claim there is only one physical `localStorage.setItem('theme', ...)` call; there is not.
- This does not claim the browser smoke is currently wired as a required workflow; the wired authority is the source regression in Shared Files Guard.
- This does not authorize deleting compatibility bridges before legacy controls are retired.
- No MASTER edit is made here because concurrent matrix work is owned elsewhere.
