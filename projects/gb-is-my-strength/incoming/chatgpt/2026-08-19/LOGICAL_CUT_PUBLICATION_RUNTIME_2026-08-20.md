# Logical cut — publication/runtime wave — 2026-08-20

## Boundary

- Product: `FedorMilovanov/gb-is-my-strength`
- Exact current Product anchor rechecked in this wave: `01894214765d7ab6e51a7eea1fb7f239c6591af8`
- Product mutation: none
- MASTER mutation: none
- Purpose: stop the current audit wave at a causal boundary rather than keep converting every static smell into a new finding.

## New synthesis added in this wave

### SW work unit 4 gains a third manifestation

`SW-ROOT-GENERATION-AUTHORITY` now covers three related lifecycle/freshness failures:

1. one root scope receives five route-dependent worker script identities in the same release;
2. failed successor install cleanup can delete a `CACHE_STATIC` namespace still owned by the active generation;
3. a revisioned static request can downgrade on network failure to the bare canonical precache entry.

The third mechanism is current source behavior:

```text
request /js/foo.js?v=B
  -> network-first
  -> exact revisioned cache miss
  -> cache.match(/js/foo.js)
```

Install precache populates bare asset URLs. Therefore when generation A still controls a document/assets from generation B, an offline/subresource network failure can turn a B revision request into canonical bytes cached by A. Existing browser/readiness contracts deliberately require canonical fallback but prove it only inside one generation; they do not compare A-vs-B body identity.

This is the stronger systemic owner for the old `SW-PWA-FRESHNESS` residual. Verifier should absorb that residual into the SW generation package rather than count it independently.

Companion evidence: `SW_REVISIONED_CANONICAL_DOWNGRADE.md`.

### Lazy runtime loader failure state is an eighth independent root

Two separate canonical/shared resource loaders violate the same retry invariant:

```text
failed acquisition -> settled failed state -> later explicit retry may start a fresh acquisition
```

#### Search manifestation

`MobileChromePage` sets both `__gbSearchLoading=true` and `__gbSearchBootRequested=true` before appending `search.js`. On `script.onerror` it clears only `__gbSearchLoading`. Every later Search action is blocked by:

```js
if (w.__gbSearchLoading || w.__gbSearchBootRequested) return;
```

while no ready `GBSearch` owner exists. `/karty/` and `/konfessii/` have this adapter as their only Search script loader in the current route graph, so a transient first script failure can leave Search non-retryable until reload.

Companion evidence: `SEARCH_LAZY_LOADER_FAILURE_STATE.md`.

#### TTS manifestation

`ReaderActionsRuntime` preloads the current revisioned `vosk-tts-engine.js`. Later `reader-tts.js::ensureVoskScript()` finds an existing script element and adds `load/error` listeners to it. If the preload already reached terminal `error` before this later call, no event is replayed and no new request is started. `engineScriptPromise` can therefore remain pending indefinitely; `warmPromise` then remains pending too, and explicit retry returns the same pending state rather than creating a new acquisition.

Companion evidence: `TTS_ENGINE_SCRIPT_FAILURE_STATE.md`.

These are different implementations but one lifecycle root: resource existence/request intent is being mistaken for a retryable/observable terminal state.

## Semantic corrections made in this wave

### SW registration census corrected by semantic ownership

An earlier static scanner said 67/85 registration routes and seven bare `/sw.js` identities. That was wrong because it missed generic runtime-array registration through `BaseLayout` and associated `SITE_CONFIG` ownership too syntactically.

Correct current semantic census:

- **70 / 85** Astro routes register the root Service Worker;
- **0 / 70** have duplicate registration owners;
- **0 / 70** resolve to bare `/sw.js`;
- there are still **five distinct script identities** in one release:
  - `1` × 25;
  - `1781282355` × 22;
  - `1778943682` × 19;
  - `20260802` × 2;
  - hash-derived `c7f8b6e9` × 2 through `BaseLayout`.

The root finding survives; only the evidence model/count was corrected. Structural AuditRepo CI passing the old report was never treated as semantic proof.

### Source-surface audits are broader than the historical scanners

The old sitewide button audit claimed an exhaustive `543 files / 47 instances` result. Reproduction of its declared Astro/TSX scope yields 49 missing-type literal buttons, and runtime HTML generators add another 26 literal missing-type buttons in `search.js`, `highlights.js` and `site.js`.

So the minimum literal DOM-producing surface is **75 missing-type buttons across 25 source files**. This remains audit-evidence integrity, not a claim of 75 submit bugs: previous live evidence did not find type-less buttons inside forms.

A separate asset-revision census checked **536** current local `?v=` literals: **534 byte-exact / 2 stale**. The two stale literals are inside runtime JS, which current `cache-bust.js` does not scan as an internal URL-constructor corpus. This evidence is therefore grouped under `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS`, not promoted into a normal-path TTS outage.

## Exact-current reverify of old direct manifestations

At Product `01894214...`:

- `RODOSLOVIYE-OG-IMAGE`: still current — Rodosloviye publishes the Karty OG image.
- `EDITORIAL-LABEL-INCONSISTENCY`: still current — Header says `Разбор заблуждений`, canonical section metadata says `Трудные тексты`.
- `APP-MASK-NO-WEBKIT-FALLBACK`: still current; Map has the same bounded compatibility shape.
- BaseLayout source still has no CSP head owner; security direct rows should remain absorbed under the broader fragmented-security root rather than counted independently.
- `sw.js` still precaches bare `reader-preferences.js`; the stronger revisioned-to-canonical downgrade mechanism now provides the systemic absorption path.

## Publication/data projection negative results

A full policy-membership comparison found no new route-cardinality defect:

- 85 declarative route policies;
- sitemap membership: **76 / 76 expected**, no drift;
- curated search-manifest membership: **75 / 75 expected**, no drift;
- RSS membership: **58 / 58 expected**, no drift.

`/hard-texts/genesis-6/` being absent from curated search-manifest is intentional: its route policy says search-manifest exclude while Pagefind+sitemap remain include.

Thus the existing metadata system root is about value/authority divergence (notably dates/labels), not missing route membership.

Additional current negative controls:

- 77 literal same-page fragment references across 85 Astro route graphs: **0 missing literal targets**;
- 924 literal ARIA relationship references (`aria-controls`, `aria-labelledby`, `aria-describedby`, `label[for]`): **0 missing literal targets**;
- canonical/robots/sitemap indexability relationships: no new contradiction found;
- current Web App Manifest identity/scope/icons remain internally consistent;
- no duplicate Yandex Metrika init owner was found on a route graph (coverage itself remains a policy/observability decision, not admitted as a Product defect);
- ReaderState route identity reverify found 48 series routes and 0 legacy-key collision groups;
- current Search async result-generation cancellation did not show stale-result resurrection; the new Search finding is script acquisition failure/retry, not query-result cancellation.

## Final stale-asset candidate closed as cleanup, not another work unit

A byte-exact revision census found only two stale revision literals among 536 current local revisioned references:

```text
floating-cluster-controller.js
  /js/vosk-tts-engine.js?v=216b15fb      current asset revision f9b4905f
  /css/tts-download-notice.css?v=475abd4b current asset revision b9ef192f
```

These strings are real drift but are **not a current independent runtime owner** under present Astro composition:

- 57 Astro route graphs that actually mount `floating-cluster-controller.js` also mount `ReaderActionsRuntime`;
- canonical ReaderActionsRuntime preloads the current Vosk engine and capture-claims normal play/keyboard paths;
- the legacy controller does not autonomously start Vosk warmup on page initialization;
- its fallback status path delegates to `window.VoskTTSEngine.showStatus` when the canonical engine exists.

Disposition: Work Queue cleanup / source-surface guard evidence. Do not create a ninth Product work unit from these two strings.

This does **not** weaken the TTS manifestation in work unit 8: that finding concerns the canonical current Vosk preload itself reaching terminal error before the later loader observes it.

## Logical stopping point

The evidence package should stop at **eight forensic work units** and proceed to verifier synthesis rather than continue enumerating lower-value static smells:

1. `SCRIPTURE-OCCURRENCE-REPRESENTATION-ORACLE`;
2. `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS`;
3. `SECURITY-NOSNIFF-OWNER-LAYER-MISMATCH`;
4. `SW-ROOT-GENERATION-AUTHORITY` — three manifestations: route-dependent identity, non-isolated rollback, cross-generation canonical downgrade;
5. `BROWSER-MATRIX-ZERO-WORKER-FAILOPEN`;
6. `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT`;
7. `TTS-SHAREDWORKER-CLIENT-LIFECYCLE`;
8. `LAZY-RUNTIME-LOADER-FAILURE-STATE` — Search and canonical TTS manifestations.

The audit also contains reduction evidence for old MASTER rows. Verifier should synthesize/absorb first instead of mechanically adding eight rows to the old matrix.

This is the causal checkpoint for the next audit wave.