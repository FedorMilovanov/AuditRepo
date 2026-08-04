# CURRENT HEAD REVERIFY — Nagornaya dark-theme refined browser disposition

- Date: 2026-08-04
- Product anchor: `f9d0120718569c510833dba7a3abd68ce2f6a003`
- AuditRepo base: `850429a299a6118db85811602fdb661b81b2296f`
- Browser evidence lane: AuditRepo PR #153
- Preliminary Chromium run: `30907436765`
- Refined authority run: `30908030497`
- Refined artifact: `8892026949`
- Artifact digest: `sha256:ff3896b0c208b4e385552dd2b1646149b1e441de3fb495cb7d9f08d7697c0b43`
- Canonical owner: `NG-DARK-01`
- Product mutation: **none**
- TTS scope: **excluded**
- Production claim: **none**

## Authority and method

Exact Product `f9d0120718569c510833dba7a3abd68ce2f6a003` passed the permanent nine-route native Astro contract and `strangler:build:production-like`. Chromium loaded all nine native built routes at desktop `1440×900` and mobile `390×844`, in explicit light and dark themes: **36 / 36 route-theme-viewport observations**.

The preliminary run measured all 19 source-residual tokens and reported zero meaningful browser/page/overflow errors after applying the Product repository's existing local-smoke boundary for absolute-origin CSP image noise. The refined run repeated the full matrix with a stricter semantic classifier:

- ordinary and large text use WCAG thresholds `4.5:1` and `3:1`;
- SVG and other non-text graphics use the `3:1` graphical-object boundary;
- emoji-only elements are not misclassified as CSS-coloured ordinary text;
- a background is a light island only above luminance `0.65` over a parent below `0.35`;
- decorative borders are not called broken merely because they are intentionally subtle;
- absence of a dedicated selector is never sufficient by itself.

Refined run `30908030497` recorded **36 observations, 0 meaningful errors and 184 explicitly classified local CSP-noise messages**. Artifact `8892026949` preserves the complete machine evidence (`sha256:ff3896b0c208b4e385552dd2b1646149b1e441de3fb495cb7d9f08d7697c0b43`).

## Canonical browser-confirmed residual

The native-dist source boundary was **19 tokens / 443 uses**. Refined Chromium confirms **9 tokens / 142 source uses** as actual dark-theme defects:

| Token | Source uses | Minimum observed dark contrast | Refined semantic failure evidence |
|---|---:|---:|---|
| `text-blue-600` | 41 | 3.40:1 | 8 / 10 textual samples fail; SVG/icon colour passes 3:1 |
| `text-rose-600` | 41 | 3.74:1 | 4 / 4 textual samples fail; emoji excluded from text scoring |
| `text-purple-600` | 40 | 3.27:1 | 4 / 4 textual samples fail; graphics pass 3:1 |
| `text-purple-700` | 12 | 2.52:1 | 24 / 24 textual samples fail |
| `text-teal-700` | 3 | 3.21:1 | 6 / 6 textual samples fail |
| `bg-stone-200` | 2 | 1.05:1 | 4 / 4 text samples fail and 4 light islands are present |
| `text-orange-700` | 1 | 3.40:1 | 2 / 2 textual samples fail |
| `text-red-600` | 1 | 3.64:1 | 2 / 2 textual samples fail |
| `text-rose-700` | 1 | 2.84:1 | 2 / 2 textual samples fail |

`bg-stone-200` is both a contrast failure and a confirmed light island. The other eight are text-contrast failures. This is the only accepted Product-repair boundary from this lane.

## Removed from the repair boundary

The remaining **10 tokens / 301 source uses** are browser-readable or effectively governed by the current cascade:

| Token | Source uses | Refined Chromium verdict |
|---|---:|---|
| `border-stone-100` | 167 | remapped subtle decorative border; no text/graphic failure |
| `text-amber-600` | 45 | browser-readable remap; minimum textual contrast 12.05:1 |
| `text-blue-700` | 22 | browser-readable remap; minimum textual contrast 9.75:1 |
| `text-emerald-700` | 15 | browser-readable remap; minimum textual contrast 8.92:1 |
| `text-emerald-600` | 14 | theme-static but readable; minimum contrast 4.67:1 |
| `bg-stone-100` | 13 | effective body cascade covered; dark body RGB `[14, 17, 22]` |
| `text-amber-800` | 11 | browser-readable remap; minimum contrast 12.20:1 |
| `text-amber-700` | 8 | browser-readable remap; minimum contrast 12.20:1 |
| `text-red-700` | 3 | browser-readable remap; minimum contrast 9.27:1 |
| `text-teal-600` | 3 | theme-static graphic colour; minimum contrast 4.70:1 |

The most important corrections are:

- `border-stone-100` was a false positive in the preliminary coarse classifier: refined semantics identify a theme-remapped subtle decorative border, not unreadable text or a missing structural boundary;
- `bg-stone-100` is **effective-body-cascade-covered**. Every dark fixture renders the body on the same dark surface (`rgb(14, 17, 22)`), including the three native routes whose source body class still contains `bg-stone-100`;
- `text-emerald-600` and `text-teal-600` remain theme-static but pass their applicable contrast boundaries and are not repair obligations.

## Canonical dispositions

`NG-DARK-01` remains **OPEN / CURRENT**, narrowed to **9 browser-confirmed tokens / 142 source uses**: `text-blue-600` (41×), `text-rose-600` (41×), `text-purple-600` (40×), `text-purple-700` (12×), `text-teal-700` (3×), `bg-stone-200` (2×), `text-orange-700` (1×), `text-red-600` (1×), `text-rose-700` (1×).

`NG-BODY-01` is a stale visual subset and remains closed as duplicate/merged into the root history: native source still contains three `bg-stone-100` body owners, but Chromium proves the effective dark body cascade is correct.

`NG-DARK-05` remains a closed duplicate: `bg-stone-100` is removed from the repair boundary, while `bg-stone-200` remains represented only by open root `NG-DARK-01`.

`NG-MOBILE-01` remains a closed aggregate duplicate: its body subset is browser-effective; independent `NG-TOC-01` and `NG-A11Y-01` owners remain unchanged.

## Evidence boundary

- exact source and native production-like build only;
- Chromium computed-style evidence at two viewports and two themes;
- no Product mutation;
- no deployed-SHA or live-production claim;
- no TTS inspection or modification;
- canonical arithmetic remains **358 = 213 closed + 145 open**, P1 **70**.
