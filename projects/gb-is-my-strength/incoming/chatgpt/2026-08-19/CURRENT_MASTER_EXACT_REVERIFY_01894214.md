# Current MASTER exact reverify — Product `01894214765d7ab6e51a7eea1fb7f239c6591af8`

## Purpose

Exact-current source reverify of the old MASTER rows whose Product owners can be adjudicated without inventing a new live-production timestamp.

This file supplements `CURRENT_MASTER_DISPOSITION_2026-08-20.md`. It does not edit MASTER.

## Exact current results

| Row / manifestation | Exact-current disposition | Witness |
|---|---|---|
| `RODOSLOVIYE-OG-IMAGE` | **KEEP** | `src/components/rodosloviye/RodosloviyePageHead.astro` still sets both `og:image` and `twitter:image` to `/images/og-karty-1200x630.webp` while `og:image:alt` describes the genealogy tree. |
| `EDITORIAL-LABEL-INCONSISTENCY` | **KEEP under metadata root** | `src/components/ui/Header.astro` still labels `/hard-texts/` as `Разбор заблуждений`; `src/data/site.ts` still declares `SECTION_META['hard-texts'].label = 'Трудные тексты'`. |
| `APP-MASK-NO-WEBKIT-FALLBACK` | **KEEP** | Current `/app/` source still contains unprefixed `mask-image` only; `src/components/map/MapStyles.astro` still contains two unprefixed `mask-image` rules and no `-webkit-mask*` declarations. |
| `SECURITY-CSP-GAPS` source manifestation | **KEEP only as evidence under `FRAGMENTED-SECURITY-OWNERSHIP`; do not count as independent root** | Current `BaseLayout.astro` has no CSP owner. `/hard-texts/genesis-6/` and `/izbrannoe/` still use BaseLayout. BaseLayout actively loads Metrika + shared runtime, so this is a real security-owner boundary, not an inert technical shell. Existing live/artifact evidence must retain its own timestamp; this source reverify does not fabricate live absence. |
| `SW-PWA-FRESHNESS` bare-precache manifestation | **CURRENT latent manifestation; candidate for absorption into `SW-ROOT-GENERATION-AUTHORITY`** | Current `sw.js` still uses `CACHE_VERSION='gb-v197-bible-legacy-authority-20260804'` and still precaches bare `/js/reader-preferences.js`. Current route pages normally use revisioned URLs, so do not relabel this as an exercised live stale-runtime failure. |

## Button row correction — audit boundary is wider than MASTER says

The old MASTER still describes a completed exhaustive scan with **47** missing-type buttons.

The corrected declared Astro/TSX source surface is already **49**:

```text
Astro 38
TSX   11
---------
49
```

A second census of runtime-generated literal button markup adds **26** missing-type controls in three runtime files:

```text
js/search.js
js/highlights.js
js/site.js
```

So the literal DOM-producing source surface is at least:

```text
560 literal <button> tags examined
75 without explicit type
25 source files

Astro       38 / 19 files
TSX         11 /  3 files
JS runtime  26 /  3 files
```

This still does **not** create 75 current submit bugs: prior live evidence found type-less rendered buttons outside forms. It proves that the active `SITEWIDE-BTN-TYPE-AUDIT` completeness claim is not a valid closure oracle.

Companion evidence: `BUTTON_RUNTIME_GENERATED_SURFACE_WITNESS.md`.

## Negative current checks from the same reverify wave

These were checked to avoid overgeneralizing the new findings:

- 85 Astro route graphs: **77** literal same-page `href="#..."` references, **0** missing literal target IDs.
- 85 Astro route graphs: **448** `aria-labelledby`, **468** `aria-controls`, **7** literal `<label for>`, **1** literal `aria-describedby`; **0** missing literal target IDs.
- `data/search-manifest.json`: **76 items / 76 unique IDs / 0 duplicate IDs**; route rows also have no non-production extras in the current-equivalent corpus.
- Current committed RSS/sitemap/search-policy source contracts pass their declared scopes; this does not refute `RSS-SERIES-DATE-COLLAPSE`, because the RSS route contract does not compare item `pubDate` against the page's independent editorial date authority.
- Local production-like Astro build attempt was **environment-only blocked** before build because the supplied snapshot has incomplete `node_modules` and cannot resolve package `astro`. No Product conclusion is drawn from that failed local build.

## Reduction consequence

This exact-current reverify supports the same compact model as the earlier disposition pass:

- keep concrete current manifestations that remain directly observable in source (`RODOSLOVIYE-OG-IMAGE`, editorial label, mask compatibility);
- retain metadata/security as **system roots**, not duplicated symptom rows;
- absorb the old SW bare-precache residual if verifier accepts one root-worker generation/freshness package;
- retire theme multiwriter as a demonstrated conflict;
- move button work from false-complete Product/system counting to a correctly scoped audit-harness/preventive-hardening decision.

No Product repair or MASTER mutation is performed here.