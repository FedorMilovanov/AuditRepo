# ASSET-REVISION-SOURCE-SURFACE-FALSE-GREEN

## Classification

- Parent systemic work unit: `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS`
- Companion manifestation: `BUTTON_RUNTIME_GENERATED_SURFACE_WITNESS.md`
- Current Product boundary: `01894214765d7ab6e51a7eea1fb7f239c6591af8`
- Signal class: current hard-gate audit corpus incompleteness
- Product mutation: none
- MASTER mutation: none

## Finding

The repository's source asset revision gate can return success and print:

```text
Asset revisions are synchronized; repository was not modified.
```

while managed assets are still referenced by stale `?v=<hash>` URLs inside runtime JavaScript.

This is not a theoretical parser shape. An independent current-equivalent literal URL census found:

```text
536 local revisioned literal references examined
534 byte-exact against current target MD5
2 stale
0 unresolved targets
```

Both current stale references are in `js/floating-cluster-controller.js`:

```js
var VOSK_ENGINE_SRC = '/js/vosk-tts-engine.js?v=216b15fb';
var TTS_NOTICE_CSS_SRC = '/css/tts-download-notice.css?v=475abd4b';
```

Current canonical asset authority is:

```text
js/vosk-tts-engine.js       -> f9b4905f
css/tts-download-notice.css -> b9ef192f
```

The targets exist and the other 534 literal references matched, so this is not missing-file or hash-method noise.

## Exact current source witnesses

`src/lib/asset-version.js` declares:

```js
'css/tts-download-notice.css': 'b9ef192f',
'js/vosk-tts-engine.js': 'f9b4905f',
```

The stale constants are active code inside functions that can dynamically append those resources if the legacy TTS path is used:

```js
link.href = TTS_NOTICE_CSS_SRC;
...
s.src = VOSK_ENGINE_SRC;
document.head.appendChild(s);
```

So these are real source URL references, not comments or fixture strings.

## Why `cache-bust.js` remains green

Current scanner/writer corpus is explicitly narrower than the code that can create resource URLs.

It collects:

```text
root/legacy .html files (excluding src/, scripts/, docs/, migration/...)
src/**/*.astro
src/lib/asset-version.js helper
```

`collectAstro()` only admits `.astro`, and `main()` applies:

```js
inspectFile(helper, expectedAssetVersionHelper, ...)
for (htmlFiles) inspectFile(... rewriteHTML ...)
for (collectAstro(src)) inspectFile(... rewriteAstro ...)
```

There is no pass over `js/*.js` or `src/runtime/*.js` for URL literals.

Therefore the two stale current JavaScript URLs are outside the admission corpus by construction.

A local run on the current-equivalent tree returns exit code **0** and ends:

```text
✔ css/tts-download-notice.css    → ?v=b9ef192f
✔ js/vosk-tts-engine.js          → ?v=f9b4905f
...
✅ Asset revisions are synchronized; repository was not modified.
```

The script correctly hashes the target assets and correctly updates the central helper, but never compares those hashes against JS-internal consumers.

## Admission reachability

This is not an orphan utility. Current `.github/workflows/deploy.yml` runs before the production-like build:

```yaml
- name: Check source asset revisions without writing
  run: node scripts/cache-bust.js
```

So a hard deploy gate can green while runtime JavaScript contains stale managed revision URLs.

## Current Product impact boundary

The current stale constants live in retained legacy TTS code inside `floating-cluster-controller.js`. They should **not** be inflated into a current user-facing TTS defect without route ownership proof.

A semantic current-equivalent route graph census found:

```text
57 Astro route graphs with a real floating-cluster-controller script owner
57 / 57 also mount ReaderActionsRuntime
0 floating-controller production routes without ReaderActionsRuntime
```

`ReaderActionsRuntime` explicitly claims Reader TTS after the floating controller, loads current `vosk-tts-engine.js` through `assetUrl()`, and installs capture-phase click/keyboard ownership. Its current engine script URL therefore comes from the correct central revision authority.

This makes the two stale floating constants retained/dead-or-fallback compatibility debt on the normal current reader path, not evidence that users routinely fetch the stale engine URL.

The audit defect remains current regardless: the hard gate's **synchronization claim is broader than the corpus it actually checks**.

## Shared root with button completeness evidence

This has the same causal structure as the historical button audit:

```text
claimed whole/repository surface
        ↓
scanner enumerates only declarative file classes
        ↓
runtime-producing JavaScript is outside corpus
        ↓
real generated/control/resource references are omitted
        ↓
green/exhaustive claim overstates what was measured
```

Button manifestation:
- historical `src/**/*.astro|tsx` scope missed JS-generated controls;
- corrected literal DOM-producing surface is at least 75 missing-type controls, not 47.

Asset manifestation:
- HTML/Astro/helper revision scope misses JS-generated resource URLs;
- two current stale managed revision literals survive while deploy gate says synchronized.

The systemic unit should therefore be named around **source-surface/corpus completeness**, not around one particular button rule.

## Durable closure boundary

A replacement asset revision guard should:

1. Define its corpus explicitly: every source language/path allowed to construct managed local resource URLs.
2. Include JavaScript/TypeScript runtime URL literals or use a generated resource manifest that runtime code consumes instead of hand-stamped literals.
3. Assert its own census: files inspected, managed references inspected, unresolved references, stale references.
4. Include adversarial fixtures with stale managed URLs in:
   - Astro attributes;
   - root HTML;
   - plain JS string assignment (`script.src`, `link.href`);
   - runtime/template string output;
   - optionally TS/TSX when they construct URLs.
5. Fail closed if any managed asset is referenced with a literal revision different from canonical bytes/authority.
6. Keep the current reference-only HTML immutability boundary.
7. Avoid claiming `repository synchronized` when the configured corpus is intentionally narrower; report the exact measured surface.

## What this report does not claim

- No claim that the two stale floating TTS URLs are currently the normal production TTS owner.
- No request to resurrect legacy floating TTS ownership; canonical ReaderActionsRuntime remains the desired owner.
- No claim that `asset-version.js` itself has wrong hashes; its two relevant hashes match current bytes.
- No new Product repair lane is opened from this evidence-only report.