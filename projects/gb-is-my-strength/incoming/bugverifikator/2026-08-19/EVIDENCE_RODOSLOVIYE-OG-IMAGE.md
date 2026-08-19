# Evidence — RODOSLOVIYE-OG-IMAGE

bugverifikator · 2026-08-19 · gb-is-my-strength · current-HEAD reverify (cb3681e + live)

## Finding
`RODOSLOVIYE-OG-IMAGE` — confirmed current-local on cb3681e and live production.

## Witness angles
- **W2 source** (`verified-source`): `src/components/rodosloviye/RodosloviyePageHead.astro` at cb3681e:
  - L28 `<meta property="og:image" content="https://gospod-bog.ru/images/og-karty-1200x630.webp" />`
  - L38 `<meta name="twitter:image" content="https://gospod-bog.ru/images/og-karty-1200x630.webp" />`
  - L32 `<meta property="og:image:alt" content="Родословие от Адама до Христа — интерактивное древо" />`
  - The OG/Twitter card asset is the `/karty/` (maps) image, while the alt describes the genealogy (`родословие`) page. Asset and context disagree.
- **W4 runtime/live** (`verified-live`): HTTP fetch of `https://gospod-bog.ru/rodosloviye/` on 2026-08-19 returned:
  - `og:image = https://gospod-bog.ru/images/og-karty-1200x630.webp`
  - `twitter:image = https://gospod-bog.ru/images/og-karty-1200x630.webp`
  - `og:image:alt = Родословие от Адама до Христа — интерактивное древо`
  - Confirms the source symptom is shipped to production.

## Mechanism
The rodosloviye page head reuses the karty OG image instead of a rodosloviye-contextual asset. There is no route→contextual-OG-image SSOT mapping; each PageHead hand-picks its OG asset (related to `METADATA-SSOT-PROLIFERATION`, but OG-image asset selection is its own local defect, not a duplicate of the series-label symptom).

## Impact
medium — social/share previews for `/rodosloviye/` show a maps image for a genealogy page.

## Owner / collision
- Semantic owner: rodosloviye page head / social-metadata owner.
- Open Product branch check (2026-08-19): no open branch touches `RodosloviyePageHead.astro` OG image. Branches present: `agent/antisovetov-title-suffix-20260818`, `fix/biografii-recent-heading-20260818`, `repair/dist-css-astro-admission-20260819`, `repair/wire-engine-contracts-20260819`. No collision.

## Proposal (for the verification/consolidation wave)
- Keep as `current-local` defect in MASTER (no wording change needed beyond the current `HEAD 485db8c` → `cb3681e` re-anchor).
- Suggested repair lane: add a route-contextual OG image for `/rodosloviye/` (e.g. `og-rodosloviye-1200x630.webp`) and reference it in `RodosloviyePageHead`; verify with a share-preview validator after deploy.
- Closure boundary: new asset exists + referenced in source; live share-preview validator shows the rodosloviye asset; row removed from MASTER.

## What this evidence does NOT prove
- That the maps image is genuinely wrong vs. an intentional editorial choice (alt text contradicts it, which strongly implies a copy-paste error, but the owner may have a reason). Flag for owner sanity-check before repair.
- Browser-rendered card preview (OpenGraph debuggers not invoked here; values are taken from live HTML meta tags directly).

## Labels
`verified-source`, `verified-live`, `current-confirmed-for-work`
