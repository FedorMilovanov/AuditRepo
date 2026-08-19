# Evidence 01 — Rodosloviye metadata and genealogy data/resilience

## A. `RODOSLOVIYE-OG-IMAGE`

### W2 — exact source owner

`src/components/rodosloviye/RodosloviyePageHead.astro` at `cb3681e` contains:

```html
<meta property="og:image" content="https://gospod-bog.ru/images/og-karty-1200x630.webp" />
<meta property="og:image:alt" content="Родословие от Адама до Христа — интерактивное древо" />
<meta name="twitter:image" content="https://gospod-bog.ru/images/og-karty-1200x630.webp" />
```

The source text calls this component the native head for `/rodosloviye/`. The checked image tree contains `images/og-karty-1200x630.webp` (83 KiB) and no route-specific `og-rodosloviye-1200x630.webp` candidate. Absence of that filename is not a prescription for the replacement asset; it establishes that the image/alt semantic pairing is not self-evidently route aligned.

### W3 — committed route artifact

`rodosloviye/index.html` in the same Product tree has SHA-256:

```text
b30681de20e256f0567b6978a097e8b2ea5b28d4e0c3985a3d46d2d419d05c82
```

It repeats `og-karty-1200x630.webp` twice (OG and Twitter) and contains one `og:image:alt` for the genealogy route.

### W4 — live emitted head

`GET https://gospod-bog.ru/rodosloviye/` returned HTTP 200. Parsed live values:

| Meta property | Observed value |
|---|---|
| `og:image` | `https://gospod-bog.ru/images/og-karty-1200x630.webp` |
| `og:image:alt` | `Родословие от Адама до Христа — интерактивное древо` |

**Bounded conclusion:** the route’s sharing image and its alt/context are inconsistent across source, artifact, and live output. This evidence does not select the intended replacement image or establish crawler-cache propagation.

## B. `GENEALOGY-ID-INVALID-SPACE`

### W2 — data and exact-key consumer

The current data has the relationship value at line 403 and the target ID at line 1395:

```json
"children": [
  "arphaxad",
  "elam",
  "asshur",
  " lud_shem",
  "aram"
]
```

```json
{
  "id": " lud_shem",
  "name": { "ru": "Луд", "he": "לוּד" }
}
```

A schema scan found 156 `persons`, exactly one identifier that differs from `id.trim()`, and both relationship and ID use the same whitespace-prefixed string.

`src/pages/rodosloviye/index.astro` imports the JSON directly, casts `genealogyData.persons` to `Person[]`, and passes it to `<GenealogyTree client:only="react" … />`; there is no import-boundary normalization.

`GenealogyTree.tsx` builds exact identifier maps, for example:

```ts
const byId = new Map(persons.map(p => [p.id, p]));
// parent/child keyboard traversal calls byId.has(id) and byId.get(id)
```

Its `.trim()` calls apply to the user search string, not to data IDs.

### W4 — live serialized island

The live Rodosloviye document returns HTTP 200 and serializes the data into the `GenealogyTree` Astro-island props. Both ` lud_shem` and its unprefixed substring occur in the served document; the island normal-loads, so this is not evidence of a visible current failure.

**Bounded conclusion:** the data violates a canonical-key invariant but is currently self-consistent. The only safe repair is an atomic rename of ID and every incoming reference, backed by a validator that rejects whitespace-padded IDs.

## C. `GENEALOGY-NO-ERROR-BOUNDARY`

### W2

`GenealogyTree.tsx` imports React hooks and `@xyflow/react`, but has no `ErrorBoundary` reference. `/rodosloviye/` mounts the component as a client-only React island:

```astro
<GenealogyTree client:only="react" persons={persons} eras={eras} />
```

### W4

The live route returned HTTP 200 and emits the island and its JavaScript component URL. This proves ordinary loading, not behavior when the island throws.

**Bounded conclusion:** absence of a recovery boundary is a current source resilience risk. A controlled browser/runtime exception is required before asserting an actual blank-screen production outcome or deciding the appropriate fallback UI.
