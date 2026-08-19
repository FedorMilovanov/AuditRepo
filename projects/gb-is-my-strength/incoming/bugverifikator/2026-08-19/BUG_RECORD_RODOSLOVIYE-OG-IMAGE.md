# Bug Record — RODOSLOVIYE-OG-IMAGE

## Identity
- Canonical ID: RODOSLOVIYE-OG-IMAGE
- Aliases: (bugverifikator reverify 2026-08-19; surface pass 4 OG-image finding)
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Severity: medium
- Category: SEO / social-share metadata
- Status: current-local (confirmed on cb3681e and live)
- Signal class: Product
- Proof state: FAIL

## Scope
- Route(s): `/rodosloviye/`
- Source file(s): `src/components/rodosloviye/RodosloviyePageHead.astro` (L28 og:image, L38 twitter:image); page `src/pages/rodosloviye/index.astro`
- Observed on SHA: 485db8c (original MASTER anchor)
- Verified on SHA: cb3681e (2026-08-19) + live production fetch same day
- Current HEAD status: present on cb3681e; present in live HTML
- Exact tree/event when relevant: OpenGraph/Twitter card share of `/rodosloviye/`
- Claim boundary: OG/Twitter preview asset on the rodosloviye route
- Preservation boundary: source line + live rendered meta
- Semantic owner: rodosloviye page head / social-metadata owner
- Overlapping active owner/PR/branch check: no open Product branch touches RodosloviyePageHead OG image (checked: branches are antisovetov-title, biografii-heading, dist-css-parity, engine-contracts). No collision.

## Reproduction
- Build mode: source + live
- Commands: `curl -s https://gospod-bog.ru/rodosloviye/ | grep -E 'og:image|twitter:image'` ; or read `RodosloviyePageHead.astro` at cb3681e
- Expected: og:image / twitter:image point to a rodosloviye-contextual asset (e.g. `og-rodosloviye-…`), matching `og:image:alt` = "Родословие от Адама до Христа — интерактивное древо".
- Actual: both point to `https://gospod-bog.ru/images/og-karty-1200x630.webp` (the `/karty/` maps asset). Asset and alt/context disagree.

## Evidence
- Browser / console: live HTTP fetch of `https://gospod-bog.ru/rodosloviye/` returned `og:image = og-karty-1200x630.webp`, `twitter:image = og-karty-1200x630.webp`, `og:image:alt = Родословие от Адама до Христа…`.
- Artifact path: n/a (source + live)
- Screenshots / logs: source lines L28/L38 in RodosloviyePageHead.astro at cb3681e.

## Triage
- Root cause: rodosloviye head copied/reused the karty OG image instead of a rodosloviye-specific one; no SSOT mapping from route → route-contextual OG image (related to METADATA-SSOT-PROLIFERATION theme, but OG-image asset selection is its own local defect).
- Duplicate of: none
- Do not mix with: SECURITY-CSP-GAPS (rodosloviye also lacks CSP in cb3681e source, but live has CSP — separate concern; OG image is the primary current-local defect here).
- Suggested repair lane: add a route-contextual OG image for `/rodosloviye/` (e.g. `og-rodosloviye-1200x630.webp`) and reference it in RodosloviyePageHead; verify live card via a share-preview validator.
- Required exact-head checks: confirm the new asset exists and is referenced; confirm live deployment picks it up.
- Merge admission enforced: unknown (no open lane)

## Witness labels
verified-source, verified-live, current-confirmed-for-work
