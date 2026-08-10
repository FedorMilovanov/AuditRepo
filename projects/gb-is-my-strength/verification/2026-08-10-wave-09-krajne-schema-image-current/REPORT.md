# Reverification — prior Wave 09 Krajne JSON-LD image dimensions

Date: 2026-08-10
Disposition: `CONFIRMED-CURRENT / P3` local structured-data truth defect; current schema audit has a bounded coverage gap.

## Provenance

Prior raw evidence already exists in AuditRepo commit `afc142ffcd252a2d82282ccc8439aa95531c8f31`, report:

`projects/gb-is-my-strength/incoming/chatgpt/2026-08-10/wave-09-canonical-projection-pagefind-tooltip-a11y-seo.md`.

That wave recorded the Krajne JSON-LD image-dimension mismatch and the schema-audit blind spot. This package rechecks the same finding on the current published Product rather than creating a duplicate raw item.

## Current authority

- Product current main: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Exact published candidate: deploy run `31379283849`, artifact `9059689652`.
- Product open issue deduplication for Krajne image dimensions: no current owner found.
- Product mutation: none.

## V09-KRAJNE-SCHEMA-IMAGE-DIMENSIONS — CONFIRMED-CURRENT / P3

### Current false machine fact

Current `KrajnePageHead.astro` uses the same asset URL for Open Graph and Article JSON-LD:

`https://gospod-bog.ru/images/og-krajne-isporcheno.webp`

Open Graph declares:

- `og:image:width = 1200`;
- `og:image:height = 630`.

The Article JSON-LD `ImageObject` for that same URL declares:

- `width = 900`;
- `height = 600`.

The exact WebP from published artifact `9059689652` was decoded directly and is **1200×630**.

Therefore this is not a policy/completeness preference. The current JSON-LD contains objectively incorrect dimensions for a current published asset.

### Existing schema audit false-green boundary

Current `scripts/schema-rich-results-audit.js` validates that Article images exist conceptually and that string/object image URLs are absolute. It warns when Article image is absent, but it does not compare `ImageObject.width/height` against:

- the referenced local binary;
- the current OG image dimensions;
- another canonical image metadata authority.

So current schema validation can pass while a present `ImageObject` contains false dimensions.

### Required terminal outcome

A bounded Krajne/schema repair must establish:

- the Article JSON-LD dimensions for `og-krajne-isporcheno.webp` match the current published binary/canonical image metadata;
- the same URL is not allowed to carry contradictory dimensions across OG and JSON-LD projections;
- a permanent schema/media contract checks declared local `ImageObject` dimensions against actual image headers or one canonical media manifest rather than duplicating another hardcoded size table;
- mutation witness proves changing a declared width/height while retaining the same binary makes the contract fail.

## Adjacent editorial-date observation — held outside MASTER here

Current Krajne still has three different date projections:

- visible byline modified date: 4 June 2026;
- MDX `updatedAt`: 12 June 2026;
- OG/JSON-LD machine modified date: 9 July 2026.

The current editorial metadata architecture already records this route as `inconsistent-needs-review` for the rendered/search/feed/sitemap projection family. Its current observation library does not ingest MDX frontmatter, so the 12 June reference remains outside that convergence model.

Do not create a second direct defect row from that fact in this verification package without first establishing whether the MDX frontmatter is a current editorial authority or only a reference/content mirror for this strict-native route.

## Product mutation

None. This report promotes only the objectively false current JSON-LD image dimensions and keeps the editorial-authority question separate.
