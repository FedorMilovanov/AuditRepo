# CURRENT HEAD REVERIFY — Nagornaya dark-theme browser/computed-style verification

- Date: 2026-08-04
- Product anchor: `f9d0120718569c510833dba7a3abd68ce2f6a003`
- AuditRepo base: `850429a299a6118db85811602fdb661b81b2296f`
- Browser evidence lane: AuditRepo PR #153
- Exact workflow run: `30907436765`
- Canonical owner: `NG-DARK-01`
- Input boundary: 19 tokens / 443 uses from native production-like dist
- Product mutation: **none**
- TTS scope: **excluded**
- Production claim: **none**

## Method

The exact Product SHA passed the permanent nine-route native Astro contract and `strangler:build:production-like`. Headless Chromium then loaded all nine built routes at desktop `1440×900` and mobile `390×844`, in explicit light and dark themes: **36 independent route/theme/viewport observations**.

For every visible element carrying one of the 19 source-residual utility tokens, the harness recorded computed foreground/background/border values, effective ancestor background, body surface, light-vs-dark property changes and WCAG contrast. Normal text used a `4.5:1` threshold; large/bold text used `3:1`. Borders were only classified as near-invisible below the deliberately conservative `1.3:1` threshold. A light background was classified as a light island only when its luminance exceeded `0.65` over a parent below `0.35`.

Missing a dedicated selector was **not** treated as a browser defect by itself.

## Harness integrity

- Observations: **36 / 36**.
- Browser/page/overflow errors: **0**.
- Verdict distribution: `browser-readable`=6, `confirmed-near-invisible-border`=1, `confirmed-text-contrast-failure`=9, `effective-body-cascade-covered`=1, `theme-static-but-readable`=2.
- Confirmed browser failures: `border-stone-100`, `text-blue-600`, `text-rose-600`, `text-purple-600`, `text-purple-700`, `text-teal-700`, `bg-stone-200`, `text-orange-700`, `text-red-600`, `text-rose-700`.
- Browser-readable/effective tokens: `text-amber-600`, `text-blue-700`, `text-emerald-700`, `text-emerald-600`, `bg-stone-100`, `text-amber-800`, `text-amber-700`, `text-red-700`, `text-teal-600`.
- Not visible in dark fixtures: none.

## Token-level results

| Token | Browser verdict | Dark visible samples | Min dark text contrast | Dark text failures | Min dark border contrast | Dark light-islands | Property changes across theme |
|---|---|---:|---:|---:|---:|---:|---|
| `border-stone-100` | confirmed-near-invisible-border | 334 | — | 0 | 1.17 | 0 | yes |
| `text-amber-600` | browser-readable | 90 | 12.05 | 0 | — | 0 | yes |
| `text-blue-600` | confirmed-text-contrast-failure | 36 | 3.40 | 34 | — | 0 | no |
| `text-rose-600` | confirmed-text-contrast-failure | 24 | 3.74 | 24 | — | 0 | no |
| `text-purple-600` | confirmed-text-contrast-failure | 34 | 3.27 | 34 | — | 0 | no |
| `text-blue-700` | browser-readable | 44 | 9.75 | 0 | — | 0 | yes |
| `text-emerald-700` | browser-readable | 30 | 8.92 | 0 | — | 0 | yes |
| `text-emerald-600` | theme-static-but-readable | 28 | 4.67 | 0 | — | 0 | no |
| `bg-stone-100` | effective-body-cascade-covered | 26 | 13.39 | 0 | — | 0 | yes |
| `text-purple-700` | confirmed-text-contrast-failure | 24 | 2.52 | 24 | — | 0 | no |
| `text-amber-800` | browser-readable | 22 | 12.20 | 0 | — | 0 | yes |
| `text-amber-700` | browser-readable | 16 | 12.20 | 0 | — | 0 | yes |
| `text-red-700` | browser-readable | 6 | 9.27 | 0 | — | 0 | yes |
| `text-teal-600` | theme-static-but-readable | 6 | 4.70 | 0 | — | 0 | no |
| `text-teal-700` | confirmed-text-contrast-failure | 6 | 3.21 | 6 | — | 0 | no |
| `bg-stone-200` | confirmed-text-contrast-failure | 4 | 1.05 | 4 | — | 4 | no |
| `text-orange-700` | confirmed-text-contrast-failure | 2 | 3.40 | 2 | — | 0 | no |
| `text-red-600` | confirmed-text-contrast-failure | 2 | 3.64 | 2 | — | 0 | no |
| `text-rose-700` | confirmed-text-contrast-failure | 2 | 2.84 | 2 | — | 0 | no |

## Dark body surfaces

| Route | Viewport | Computed background | RGB | Luminance |
|---|---|---|---|---:|
| `/nagornaya/` | desktop | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/chast-1/` | desktop | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/chast-2/` | desktop | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/chast-3/` | desktop | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/chast-4/` | desktop | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/chast-5/` | desktop | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/seriya/` | desktop | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/istochniki/` | desktop | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/nakhodki/` | desktop | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/` | mobile | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/chast-1/` | mobile | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/chast-2/` | mobile | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/chast-3/` | mobile | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/chast-4/` | mobile | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/chast-5/` | mobile | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/seriya/` | mobile | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/istochniki/` | mobile | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |
| `/nagornaya/nakhodki/` | mobile | `composite(rgb(14, 17, 22),white-fallback)` | [14, 17, 22] | 0.006 |

## Evidence boundary

This is browser/computed-style evidence on production-like native output, not a Product repair or live-production witness. The raw machine evidence is attached to workflow run `30907436765` as artifact `nagornaya-dark-browser-evidence`.

Canonical matrix and handoff are intentionally unchanged in this first pass. The next commit must manually review these measurements, distinguish confirmed failures from readable/static design choices, and only then narrow or preserve `NG-DARK-01`.
