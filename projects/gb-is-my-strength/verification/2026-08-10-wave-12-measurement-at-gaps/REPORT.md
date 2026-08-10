# Reverification — remaining measurement and AT gaps

Date: 2026-08-10
Disposition: **MEASUREMENT-FIRST / REVERIFY-BEFORE-PROMOTION — not MASTER defects**
Product mutation: **none**

## Authority

- Current Product `main`: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- This wave re-reads the current TTS browser contract and current canonical article-tooltip owner rather than carrying candidate wording forward from an old audit.

## M12-TTS-FIRST-AUDIBLE-LATENCY — confirmed measurement gap, not Product failure

Current `scripts/tts-reader-runtime-browser-test.js` is a strong state-machine contract. It covers, among other things:

- play → pause on rapid repeated activation;
- native pause/resume without recreating the utterance;
- speech boundary tracking;
- speed change without replaying the full active chunk;
- `pagehide` cancellation;
- mobile notice pointer/geometry behavior;
- worker/Vosk synthesis progress and cancellation.

However its Web Speech fixture records only counters/state:

```js
window.__speechProbe = { speaks: [], cancels: 0, pauses: 0, resumes: 0, active: null };
```

and its mock `SpeechSynthesisUtterance` exposes boundary/end/error callbacks but no simulated/observed first-audible `onstart` timing. The assertions wait for `speaks.length === 1` or internal phase transitions; they do not record elapsed click→`speak()` or click→utterance-start latency.

Therefore the existing green TTS suite proves operational correctness but does **not** answer the owner's perceived-speed question.

### Required measurement before any Product optimization

Measure cold and warm paths separately and persist raw timings plus p50/p95/worst:

1. click → TTS UI/state transition;
2. click → `speechSynthesis.speak()` invocation;
3. click → `SpeechSynthesisUtterance.onstart` / first-audible event;
4. worker/enhanced engine request → first playback start;
5. first consent/model-load path separately from already-consented warm path;
6. Chromium + WebKit, representative desktop + mobile reader routes.

Do not invent a latency budget before collecting a baseline, and do not alter TTS runtime merely because source inspection looks asynchronous.

## M12-TOOLTIP-AT-RELATION — current semantic asymmetry, user impact still needs AX/AT witness

Current canonical `src/runtime/article-tooltips.js` owns `.gterm`, `.fn-marker`, and `.bref[data-ref]`, including body re-parenting, geometry, hover transit, mobile sheet and dismissal lifecycle.

Its current trigger preparation establishes:

- `data-gb-tooltip-ready`;
- `aria-expanded=false`;
- keyboard focusability where needed;
- `role=button` for non-native interactive triggers.

The canonical owner does **not** establish `aria-describedby` in the current source and does not assign one universal popup role/relation at this layer.

Legacy glossary hydration elsewhere is stronger for `.gterm` because it assigns an ID, `role=tooltip` and `aria-describedby`. That leaves a current source-level asymmetry between glossary and canonical footnote/scripture popup relationships.

### Why this is not promoted yet

Source semantics alone do not prove what a real accessibility tree/AT announces after runtime hydration and popup re-parenting. The correct next witness is not another source grep.

Required witness on the exact current candidate:

- one `.gterm`;
- one `.fn-marker`;
- one `.bref[data-ref]`;
- accessibility tree before open / while open / after close;
- keyboard-only focus path;
- popup role/name/description relations;
- whether explanatory content is reachable/announced after the popup moves into `<body>`;
- Chromium accessibility snapshot plus at least one real AT-equivalent/manual confirmation when feasible.

Only promote if the trigger loses meaningful access to its explanatory content or the popup becomes inaccessible/ambiguous in the actual tree. If the tree proves a valid relation through another mechanism, close the candidate instead.

## M12-SEARCH-SCOPE-TAB-SEMANTICS — reverify together with the AX pass

Current command palette still presents scope filters as `role=tablist` / `role=tab` + `aria-selected`, while the visible keyboard behavior is primarily button/filter-like and the main key handler focuses result navigation. This is a semantic candidate, not a current user-impact defect in this report.

During the same accessibility-tree pass, verify whether the scope set should:

- implement a real tab interaction model (roving tab stop + Left/Right/Home/End + associated panel semantics), or
- expose ordinary filter/toggle button semantics instead.

Do not create a separate MASTER row until that behavior is tested against the actual dialog keyboard model.

## Audit disposition

These gaps are deliberately kept out of the direct defect count. Their purpose is to prevent the final audit from falsely claiming coverage for perceived TTS latency or assistive-technology popup relations that current CI does not yet measure.
