# ReaderProjection: blanket speakable authority overwrite — current-system receipt

Date: 2026-10-23  
Product anchor: `caeb92c839ff4b4f2838a0ad44a582034c41c8d4` (`main`)  
Disposition: **admit one system verification lane** — `SYS-READER-PROJECTION-SPEAKABLE-AUTHORITY-OVERWRITE`.  
Product mutation: none.

## Question

Does the declared ReaderProjection speakable owner preserve route-authored `SpeakableSpecification.cssSelector` semantics, or does its shared runtime replace them with a generic inventory? This is separate from the admitted TTS consumer bypass: TTS ignores the projection, whereas the speakable synchronizer actively rewrites authored output.

## Current mechanism

`src/runtime/reader-projection.js` publishes one fixed list:

`h1`, `.article-lead`, `.summary-card`, `[data-speakable]`.

`markPolicy()` filters the projection API's node set through root containment and exclusion policy. But `synchronizeSpeakableJsonLd()` recursively visits every JSON-LD object carrying `speakable` and unconditionally assigns the fixed selector list. It does not compare the authored targets with projected nodes, preserve route-specific selectors, or scope generic CSS selectors to the selected reader root.

The public JSON-LD selector and `getSpeakableNodes()` can therefore describe different sets. This is an ownership contradiction, not a complaint that every route needs unique selectors.

## Rendered census

The current production-like build contains 108 HTML routes. A parse of every JSON-LD script found 42 routes with a valid `SpeakableSpecification.cssSelector`. Chromium 153 loaded all 42 without page errors:

- ReaderProjection became ready on 40;
- 38 of those 40 were already equal to the generic list and did not change;
- exactly **2** authored schemas were rewritten;
- the two routes without ReaderProjection remained unchanged.

This bounds the current output defect to two routes while proving the shared mechanism and its future overwrite capacity.

### Antisovetov

`/articles/20-antisovetov-pastoru/` authors:

`h1`, `.article-lead`, `.series-overview`, `[data-speakable]`.

After ReaderProjection initializes, JSON-LD contains:

`h1`, `.article-lead`, `.summary-card`, `[data-speakable]`.

The removed `.series-overview` exists once, lies inside the projection root and contains the authored cycle overview. The added `.summary-card` does not add a distinct target because that same summary already carries `[data-speakable]`. The mutation therefore removes an authored target rather than exchanging equivalent target sets.

### Diotrophes

`/articles/diotrefy-nashego-vremeni/` authors:

`h1`, `.summary-card`, `#pastoral-conclusion`.

The runtime replaces it with the generic list. `#pastoral-conclusion` exists once inside the reader root and is lost. The replacement `.summary-card` selector matches two elements globally, one outside the projection root, while `GBReaderProjection.getSpeakableNodes()` reports only one node because its own exclusion/root policy rejects those asides. Thus the synchronized public selector is not even a truthful serialization of the projection API's filtered set.

A 390×844 Dark + reduced-motion browser control reproduced the same two rewrites with zero page errors. This is nonvisual metadata behavior; no visual regression is claimed.

## Existing guard is false-green for preservation

The permanent ReaderProjection browser contract includes Antisovetov, but captures JSON-LD only after projection initialization and an explicit `refresh()`. Its route does not set `expectSchema`; RP-21 therefore checks only that every observed selector value is an array. It never compares rendered selectors with the authored build value.

The contract remains **144/144 PASS** while the authored `.series-overview` selector has already been erased. The source contract also passes because it pins the generic list and the existence of synchronization, not route-authority preservation or API↔JSON-LD target parity.

## Bounded closure

A durable repair needs one explicit authority rule:

1. preserve valid route-authored selectors unless the route explicitly delegates speakable ownership to ReaderProjection; or
2. generate selectors from the filtered canonical speakable nodes, using stable scoped identifiers rather than global generic classes.

Closure proof must:

- enumerate every built `SpeakableSpecification` before and after runtime initialization;
- preserve `.series-overview` and `#pastoral-conclusion`, or replace them only through an explicit reviewed route policy;
- prove that every emitted selector resolves to the same in-scope nodes represented by the canonical speakable API;
- include a negative fixture with an identically classed node outside the reader root;
- fail when an authored route-specific selector is silently replaced;
- retain the 38 already-canonical routes and the two no-runtime routes as controls.

Do not solve this by adding two selector exceptions to the fixed array. That would preserve the same global overwrite mechanism and expand its cross-route reach.

## Boundaries

- This does not claim that all 42 schemas are wrong; 38 runtime-owned routes are unchanged.
- This does not assert a particular crawler's indexing result. The verified defect is mutation and internal target-set contradiction in the rendered structured-data output.
- Search, print and geometric current-section owners were not widened from unused ReaderProjection APIs without output evidence.
- The TTS consumer bypass remains a separate lane with a separate repair direction.
- Current open Product PRs do not touch `reader-projection.js` or the two affected PageHead owners; #2179 overlaps only workflow files.

## Evidence

Compact machine-readable receipt: `evidence/2026-10-23-reader-projection-speakable-overwrite.jsonl`.
