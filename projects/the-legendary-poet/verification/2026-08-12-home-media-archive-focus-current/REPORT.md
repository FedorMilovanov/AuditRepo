# Current Verification — home media cost and archive mutation focus

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

The Product anchor was rechecked immediately before the wave and remains identical to current `main` (0 ahead / 0 behind).

## 1. CONFIRMED — Home eagerly transfers all six full portrait files on the first hero

`HomePage` defines exactly six hero poets:

- Sergei Yesenin;
- Mikhail Lermontov;
- Alexander Pushkin;
- Fyodor Tyutchev;
- Vladimir Mayakovsky;
- Afanasy Fet.

`HeroPoetWindow` renders every one of those portrait images with:

```tsx
priority={index < 2}
loading="eager"
fetchPriority={index < 2 ? 'high' : 'auto'}
```

Only the first two receive high fetch priority, but **all six are still eager**. The hero does not provide `srcSet`; `PoetImage`/`ResilientImage` does not synthesize responsive image variants, so the browser receives the one full JPEG path for each visible card.

### Current physical byte witness

GitHub content metadata at the exact Product anchor reports:

| Portrait | Bytes |
|---|---:|
| `yesenin.jpg` | 122,132 |
| `lermontov.jpg` | 203,325 |
| `pushkin.jpg` | 124,917 |
| `tyutchev.jpg` | 124,745 |
| `mayakovsky.jpg` | 134,597 |
| `fet.jpg` | 170,614 |
| **Total** | **880,330** |

Thus the hero declares about **0.88 MB of portrait bytes eager**, before counting application JS/CSS/fonts or other document assets.

This report does not assert a measured LCP/network time from live production. The confirmed defect is the current resource policy and its physical byte cost.

### Existing budget misses this class

`scripts/validate-build-output.ts` has useful hard budgets for:

- production entry JS;
- per-route lazy JS chunks;
- individual JS files;
- total JS;
- total CSS.

It does not include `public/` raster image transfer or route-specific initial media bytes in the budget report. Therefore portrait files can grow or additional eager hero media can be introduced while the existing bundle budget remains green.

### Root cause

**First-view media loading has no explicit responsive/priority/byte authority.** `fetchPriority` was partially optimized, but `loading="eager"` and single-source JPEG delivery still force the whole six-portrait set into initial work and CI budgets only measure code assets.

### Disposition

New active root: **`TLP-HOME-MEDIA-PERF-001` / P3**.

Required terminal outcome:

- define which hero portraits genuinely belong to the critical request set for phone and desktop viewports;
- only those images should be eager/high-priority;
- provide responsive image variants (`srcset`/picture or an equivalent deterministic build pipeline) so small rendered cards do not require one full source file;
- preserve exact aspect/crop and fallback semantics;
- add an initial-media byte/request budget for Home rather than relying only on JS/CSS chunk budgets;
- browser/network regression should prove noncritical portraits do not start as eager requests before needed, and that the intended viewport receives an appropriately sized candidate.

Do not solve this by deleting the six-poet visual concept unless the owner chooses that design change; the defect is delivery policy, not the visual composition itself.

## 2. CONFIRMED manifestation — successful Archive deletion removes the focused control without a focus handoff

`MyArchivePage` renders each saved poem as an `<article>` keyed by `poem.id`. The delete button lives inside that article and calls `handleRemoveFavorite(poem.id)`.

On a successful `removed` result, the store update removes the poem from `favorites`; the mapped article therefore disappears from the DOM. The handler only sets a reader-visible/live `archiveMessage` such as `Стихотворение удалено из архива.`

No code chooses a focus destination before/after the focused delete button is removed.

For keyboard/switch users this can leave document focus without a useful continuation point after a destructive collection mutation.

The delete control itself has a visible focus ring. Its ~32px physical box is not promoted here as a standards failure: WCAG 2.2 minimum target-size AA is 24×24 CSS pixels, and no overlapping-target evidence was established in this wave. The confirmed issue is **focus continuity after DOM removal**, not target size.

### Disposition

No new ID. Absorb into existing **`TLP-A11Y-RUNTIME-001`** as the collection-mutation focus manifestation.

Terminal behavior should define deterministic focus recovery after removal, for example:

- next surviving saved-poem control;
- previous surviving item when deleting the last visible row;
- or the stable `Сохранённые стихи` section heading/summary when the collection becomes empty.

The live status announcement remains useful but is not a substitute for focus ownership.

## 3. Root/provider ErrorBoundary placement — not promoted

`main.tsx` mounts `<App />` directly without an outer ErrorBoundary. In the current app tree, `AudioPlayerProvider` wraps the Router and route-level ErrorBoundary, so a synchronous provider-level render failure would not be caught by the current page/root boundaries below it.

However this wave did not establish a normal current input/environment path that causes `AudioPlayerProvider` to throw during render:

- session storage reads are defensive;
- corrupt session input is sanitized/recovered;
- track registry is bundled/static;
- browser feature integrations are mostly guarded/caught in effects.

Therefore “missing ultimate boundary” remains **resilience hardening, not an active defect row** without a reproducible failure witness. Do not inflate the matrix from topology alone.

## 4. Audit-harness impact

Existing **`TLP-AUDIT-004`** should gain:

- Home initial-media request classification (`high/eager` critical set versus deferred noncritical set);
- responsive candidate/byte budget proof for at least mobile and desktop hero widths;
- Archive keyboard deletion regression proving a useful focused element remains after row removal, including deleting the last visible/last overall favorite.

The root-provider boundary should only gain a regression if a concrete provider-level throw source is later established.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| All six Home hero portraits use `loading=eager` | new `TLP-HOME-MEDIA-PERF-001` / P3 |
| Six current hero portrait files total 880,330 bytes | same root |
| No responsive `srcset` for hero portraits | same root |
| Build budgets measure JS/CSS, not initial raster transfer | same root + strengthen `TLP-AUDIT-004` |
| Archive delete removes focused row/control | existing `TLP-A11Y-RUNTIME-001` |
| Archive delete has live status but no focus handoff | same existing root |
| Delete button target-size complaint | not promoted; no AA failure proven |
| AudioPlayerProvider sits outside lower ErrorBoundary | not promoted without current throw witness |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: 1 P3.
- Existing roots strengthened: `TLP-A11Y-RUNTIME-001`, `TLP-AUDIT-004`.
- Explicit non-promotion: root-provider boundary topology without a current failure witness.
