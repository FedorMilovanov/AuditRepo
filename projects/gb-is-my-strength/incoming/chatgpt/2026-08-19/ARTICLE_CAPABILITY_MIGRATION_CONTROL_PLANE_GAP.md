# ARTICLE-CAPABILITY-MIGRATION-CONTROL-PLANE-GAP

## Purpose

Process/control-plane evidence under `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT`. This is not a seventh work unit.

The systemic Product regressions documented in the root report are not explained by “migration had no guards.” The stronger mechanism is that current guards measure **legacy-removal / canonical-chrome correctness**, but not **behavioral capability completeness**.

## Current strict-native taxonomy measures transport removal

Current `scripts/native-runtime-taxonomy-audit.js` classifies a production route as `strict-native` when its source closure contains no legacy head loader, raw/legacy transport or `set:html` ownership:

```js
const hasLegacyHead = any(flags, ['loadLegacyFullDocument', 'headHtml', 'bodyAttributes']);
const hasRawTransport = any(flags, ['rawImport', 'legacyPath', 'bodySegment', 'rawSection', 'importMetaGlobLegacy']);
const hasSetHtml = any(flags, ['setHtml']);

if (!hasLegacyHead && !hasRawTransport && !hasSetHtml) return 'strict-native';
```

Its own category description is:

```text
strict-native: no legacy loader/raw/set:html transport in route closure
```

and strict validation requires only that a route whose migration contract says `strict-native` land in that structural category.

This is a valid **transport-retirement invariant**. It does not model which interactive capabilities existed before migration or whether every retained marker/config/data carrier has a new behavior owner afterward.

Therefore removing a legacy script can make a route *more* strictly native even if that script was the last owner of a retained feature.

## Canonical Gill guard explicitly rewards removing one broad legacy owner

Current `scripts/gill-canonical-chrome-guard.js` correctly guards a prior duplicate-owner regression. It requires:

```text
<ReaderActionsRuntime />
```

and explicitly forbids:

```text
enhancements.js
MutationObserver cleanup patches
legacy-retired marker
```

That protects canonical theme/settings/reader controls and prevents the old broad `enhancements.js` bundle from competing with native tooltip/quiz/reader owners.

Again, the invariant is sound for the capability subset it names.

The missing dimension is:

```text
if a broad legacy owner is removed,
what other still-retained capabilities did that owner also provide?
```

The current guard has no required map such as:

```text
legacy enhancements.js capabilities
  ├─ glossary/tooltip       → native article-tooltips ✅
  ├─ quiz                   → native article-quiz ✅
  ├─ strategic map          → ?
  └─ FAQ accordion          → ?

legacy site.js capabilities
  ├─ reader/share/bookmark  → native owners ✅
  ├─ heading anchors        → ?
  └─ reversible flip cards  → ?
```

The `?` branches are exactly the current manifestations documented by the systemic root.

## Why this is a systemic process cause rather than four unrelated mistakes

The current evidence chain is now:

1. Two independent series migrations remove broad legacy scripts while retaining page-specific markup/data/config.
2. The native shared chrome correctly installs replacements for a selected subset of capabilities.
3. Strict-native taxonomy becomes green when legacy transport disappears.
4. Canonical Gill guard becomes green when the broad legacy bundle is absent and `ReaderActionsRuntime` is present.
5. Exact-head Gill browser CI genuinely executes its declared route/chrome/TTS cases and passes, but does not exercise strategic-map, FAQ, heading-anchor or reversible-card capabilities.
6. Four retained capability families therefore lose owners while all of the above contracts remain internally consistent.

This is a **migration contract omission**:

```text
script ownership was migrated
without a first-class capability inventory
```

not a random collection of event-listener mistakes.

## Correct closure boundary

Do not weaken the strict-native or no-duplicate-owner guards. They protect real architecture.

Add a complementary capability contract:

1. Define a machine-readable or code-owned capability registry for interactive article/series features.
2. For every strict-native route, derive emitted/enabled capability markers from its source/build graph.
3. Require exactly one canonical owner for every retained/enabled capability.
4. A migration that removes a broad script must either:
   - map every retained capability to a native owner, or
   - remove/disable the capability's markup/data/config deliberately.
5. Add adversarial mutations proving the guard turns red when:
   - `enhancements.js` is removed while `.faq-accordion__q` remains and no native FAQ owner exists;
   - `site.js` is removed while `headingAnchors.enabled=true` remains and no native owner exists;
   - reversible-card markup remains but no module can transition to `.flipped`;
   - strategic-map data/trigger markers remain without a consumer.
6. Keep current strict-native transport and duplicate-owner guards unchanged as independent dimensions.

The desired architecture is therefore:

```text
legacy transport = 0
AND
retained capability owners = complete
AND
owner cardinality = exactly 1
```

not merely `legacy transport = 0`.

## Boundary / non-claims

- `native-runtime-taxonomy-audit.js` is not “wrong”; it proves a narrower transport property and should keep doing so.
- `gill-canonical-chrome-guard.js` is not “wrong” to forbid `enhancements.js`; restoring the monolith would recreate known duplicate-owner regressions.
- The defect is the missing complementary capability-completeness dimension.
- This file adds process/root evidence only; it does not create new Product rows beyond the existing systemic migration work unit.
