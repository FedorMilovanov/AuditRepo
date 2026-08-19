# SCRIPTURE-OCCURRENCE-ANCHOR-FALSE-WITNESS

## Classification

- Project: `gb-is-my-strength`
- Signal class: current Product exact-search navigation defect + audit-harness common-mode false-green
- Proof state: current-equivalent generated corpus + source producer/verifier/runtime witness
- Audited anchor: Product `main` `bcb41e57d7f9c011ac597c51a240fba19152a908`
- Freshness note: Product later advanced to `01894214765d7ab6e51a7eea1fb7f239c6591af8` only through `scripts/css-layer-validator.js`; none of the Scripture index/search owners changed.
- Product mutation: none
- MASTER mutation: none
- Disposition: detailed manifestation evidence under the existing Scripture occurrence oracle work unit, not a separate Product lane

## Finding

The exact Scripture occurrence index can persist a fragment `anchor` that is **not an HTML `id` at all**. The producer's anchor detector and the dist verifier share the same permissive regex mistake, so both accept the false anchor and remain green. The runtime then turns that stored value into a real `#fragment` navigation target.

This is a second independent common-mode failure in the same Scripture occurrence system as the dirty-context finding.

## Producer defect

`build-scripture-occurrence-index.mjs` finds the nearest explicit anchor with:

```js
const pattern = /\bid\s*=\s*["']([^"']+)["']/giu;
```

The leading `\b` does **not** assert that `id` is the whole HTML attribute name. A hyphen is a non-word character, so the pattern also matches the `id=` suffix inside attributes such as:

```html
data-note-id="hermenevtika-clowney-samson-ibid"
data-place-id="pihahiroth"
```

For `data-note-id`, the match starts at the `i` after the final hyphen because that position is a word boundary.

Therefore `nearestExplicitAnchor()` can return a data attribute value as though it were a real fragment target.

## Current corpus witness

A deterministic scan of the committed `data/scripture-search-index.json` against each occurrence's current source owner finds:

- **13 occurrence records** whose stored `anchor` is matched by the producer's loose `\bid=` regex;
- **4 unique false anchor values**;
- **12 unique Scripture reference labels**;
- all current confirmed cases are on `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`;
- for every one of those four values, the source owner contains the value only as `data-note-id="..."`, not as a standalone HTML `id="..."` attribute.

Affected stored anchors:

```text
hermenevtika-clowney-samson-ibid
hermenevtika-johnson-bribery-ibid
hermenevtika-chapell-every-text-christ
hermenevtika-chapell-paul-proclaims-christ
```

Affected exact references include:

```text
Бытие 3:15
Числа 24:17
2 Царств 12:11–14
2 Царств 23:16
Псалтирь 67:22
Псалтирь 109:5–6
Аввакум 3:13
Луки 24:27
1 Коринфянам 2:2
2 Коринфянам 4:5
Ефесянам 1:10
Колоссянам 1:28
```

No current runtime owner was found that promotes `data-note-id` into an actual DOM `id`; the attribute appears only in the article source components.

## Runtime consequence

`js/search.js` builds the exact occurrence destination directly from the stored anchor:

```js
var r = t.url + (t.anchor ? "#" + encodeURIComponent(t.anchor) : "");
...
article: { url: r, ... }
```

Selecting the exact result therefore navigates to, for example:

```text
/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/#hermenevtika-clowney-samson-ibid
```

while the page source carries only:

```text
data-note-id="hermenevtika-clowney-samson-ibid"
```

and no corresponding `id="hermenevtika-clowney-samson-ibid"`.

The URL is syntactically valid but the fragment has no target, so the exact-result navigation cannot land on the claimed occurrence anchor.

## Why the dist contract false-greens

The production-like dist verifier checks retained anchors with the same semantic mistake:

```js
if (occurrence.anchor && !new RegExp(
  `\\bid=["']${...}["']`,
  'u',
).test(witness.html)) {
  fail(`dist anchor missing ...`);
}
```

Again, `\bid=` matches the `id=` suffix in `data-note-id=`.

So the producer says:

```text
data-note-id → valid anchor
```

and the verifier independently appears to confirm:

```text
rendered data-note-id → rendered id witness
```

but both are using the same incorrect lexical surrogate.

This is common-mode verification, not an independent witness.

## Why the browser contract also misses it

The durable exact-search browser contract obtains the preview href and checks only that it belongs to the set of locations already declared by the fixture/index:

```js
const allowed = new Set((fixture.occurrences || []).map((occurrence) =>
  normalizeLocation(`${occurrence.url}${occurrence.anchor ? `#${encodeURIComponent(occurrence.anchor)}` : ''}`)
));
assert(allowed.has(normalizeLocation(previewHref)), ...);
```

That proves runtime/index agreement, not DOM-target truth.

The browser test does **not** navigate to the selected exact result and assert that:

- `document.getElementById(fragment)` exists;
- the target belongs to the occurrence's semantic section;
- the target becomes the browser's actual fragment destination.

Therefore all three layers can agree on a false fragment:

```text
producer stored it
→ dist regex "finds" it
→ browser href matches producer fixture
→ exact navigation still has no DOM target
```

## Root synthesis with the context leak

The companion `REPORT.md` already records `SCRIPTURE-OCCURRENCE-CONTEXT-ORACLE-LEAK`: visible-reference detection runs on a masked source representation, but reader-facing context is reconstructed from raw source and validated only for existence/provenance.

This anchor manifestation proves the same broader architectural defect from another dimension:

```text
source lexical surrogate
≠
rendered semantic representation
```

For context, raw-source syntax is mistaken for readable rendered prose.
For anchors, an attribute-name suffix is mistaken for a real fragment owner.

The correct verifier disposition is therefore one systemic Scripture occurrence representation/oracle package, not two independent point fixes.

## Durable closure boundary

A future owned Product repair should close both manifestations at the semantic representation boundary:

1. Parse/derive anchors as actual HTML/JSX/Astro `id` attributes, not a suffix regex.
2. Prefer a structured visible-text / rendered-structure representation for both context and anchor ownership.
3. Add adversarial fixtures containing:
   - `data-note-id`;
   - `data-place-id`;
   - other `*-id` attributes;
   - a real nearby `id` with a different value;
   - references adjacent to split markup/template expressions.
4. The source/index contract must turn red if an anchor exists only as `data-*-id`.
5. The dist contract must use a DOM/HTML parser or an exact attribute-name boundary, not the same producer regex.
6. The real browser contract should click/navigate an exact result and assert the URL fragment resolves through `document.getElementById(fragment)` to the intended visible section.
7. Preserve deterministic index generation, exact-result-first behavior, current dedupe rules and safe-anchor character restrictions.

## What this report does not claim

- No claim that all 2429 occurrence anchors are wrong; 13 current records are directly demonstrated.
- No claim that `data-note-id` itself is invalid markup; it is valid data metadata, just not a fragment target.
- No need for a separate MASTER row from the context leak; both are manifestations of one Scripture representation/oracle root.
- No unrestricted browser interaction capture is claimed; the missing target follows from stored href construction plus exact current DOM/source identity, and the browser-oracle blind spot is source-proven.
