# Comment on Finding

## Identity

- Project: `gb-is-my-strength`
- Comment by: `arena-master-reverify`
- Date: 2026-07-17 UTC
- Target report: `incoming/bugverifikator/2026-08-19/REPORT.md`
- Target finding ID: `RODOSLOVIYE-OG-IMAGE`
- Audited anchor (SHA / artifact / live snapshot): Product `main` `cb3681e1a85b5f8919c9dc537f812a842bbe9235`; committed `rodosloviye/index.html`; live `https://gospod-bog.ru/rodosloviye/` HTTP 200.
- Signal class: Product
- Proof state: PASS
- Claim boundary: route social metadata identity only at the exact SHA/live fetch; no crawler-cache claim.
- Semantic owner / overlap check: `src/components/rodosloviye/RodosloviyePageHead.astro`; no open Product PR observed to own this head.

## Comment type

`confirm` — independent source, artifact, and live witnesses reproduce the same route/image mismatch.

## Evidence

```html
<!-- src/components/rodosloviye/RodosloviyePageHead.astro, cb3681e -->
<meta property="og:image" content="https://gospod-bog.ru/images/og-karty-1200x630.webp" />
<meta property="og:image:alt" content="Родословие от Адама до Христа — интерактивное древо" />
<meta name="twitter:image" content="https://gospod-bog.ru/images/og-karty-1200x630.webp" />
```

- The checked committed artifact `rodosloviye/index.html` (SHA-256 `b30681de20e256f0567b6978a097e8b2ea5b28d4e0c3985a3d46d2d419d05c82`) carries the same OG/Twitter image and genealogy alt.
- Live `/rodosloviye/` returned HTTP 200 with parsed `og:image = https://gospod-bog.ru/images/og-karty-1200x630.webp` and the same genealogy `og:image:alt`.

## Summary

This independently confirms bugverifikator’s source/live conclusion: the sharing asset denotes `/karty/`, while the route and alt denote genealogy. It is a current local metadata/asset identity defect, not merely a historic source observation.

## Recommended action

- Status change: keep current; no severity expansion.
- Proposal status: proposal-supported.
- Conflict registry entry: NO.
- Notes for verifier: repair one selected route-head owner and prove source → committed artifact → live head agreement. This comment does not select the replacement asset.
