# Current Verification — reader interaction and image-kind boundaries

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

This wave is intentionally biased toward **retraction and consolidation**: several superficially suspicious reader/media patterns are already implemented correctly, while the remaining confirmed issues belong to existing systemic roots rather than new IDs.

## 1. Breadcrumb current-page semantics are correct

`Breadcrumbs.tsx` renders all ancestor destinations as links and the last/current item as text with:

```tsx
aria-current={isCurrent ? 'page' : undefined}
```

The current crumb is not redundantly linked to itself.

### Disposition

**No defect.** Do not reopen a “breadcrumbs missing aria-current” issue.

## 2. CONFIRMED manifestation — citation deep-link reveals the source but does not transfer focus

`InlineCitations` renders each citation as a real hash link:

```tsx
<a href={`#source-${id}`}>...</a>
```

`SourceLibrary` listens for the hash, clears filters, opens the matching source item and calls:

```ts
target.scrollIntoView({ behavior: 'smooth', block: 'center' })
```

The target is the source `<li id="source-...">`; it is not focusable and no focus call follows the reveal.

So keyboard/screen-reader users can activate the citation and visually reveal the exact source while DOM focus remains on the original inline citation higher in the article.

### Disposition

No new ID. Absorb into existing **`TLP-A11Y-RUNTIME-001`** as another programmatic-navigation focus manifestation.

Terminal interaction contract should make citation destination ownership explicit:

- reveal/open the correct source;
- align viewport with fixed chrome;
- move focus to a suitable destination element or heading with `preventScroll` after alignment;
- preserve Back/Forward/hash semantics.

## 3. CONFIRMED configuration-dependent manifestation — consent banner can sit above aria-modal dialogs outside the overlay stack

The shared overlay runtime is otherwise strong:

- `useDialogSurface` registers dialogs with one overlay stack;
- only the top overlay owns Escape and focus containment;
- body scroll lock is stack-counted;
- Command Palette and Immersive Player both use this runtime.

However `AnalyticsConsentBanner` is not registered as an overlay and has `z-[140]`.

Current modal layers include:

- Command Palette backdrop/dialog around `z-[120]`;
- Immersive Player around `z-[110]`.

When analytics is configured and consent is still unresolved, the banner can therefore remain physically above an `aria-modal` Command/Immersive dialog. Its buttons/link are ordinary focusable controls outside the dialog’s registered focus region.

This can let pointer interaction/focus escape the semantic modal surface even though the overlay runtime correctly traps Tab within the registered dialog.

### Evidence boundary

Browser QA builds without production analytics variables cannot witness this state. The source mechanism is confirmed; whether production currently configures GA/Yandex is deployment-side state and is not inferred here.

### Disposition

No new ID. Absorb into existing **`TLP-A11Y-RUNTIME-001`** and its environment-aware QA requirements.

Terminal overlay contract should give consent one explicit disposition while a modal is active: participate in the overlay stack, defer/hide behind modal ownership, or otherwise remain non-interactive until the modal closes.

## 4. Image lightbox uses the shared dialog runtime correctly

`ArticleImage` lightbox uses `useDialogSurface` with its opener button, dialog ref and close callback. It does not implement a second independent focus trap/body-lock system.

### Disposition

**No defect.** Do not create a “second lightbox overlay runtime” root.

## 5. Image `kind` type is fail-open, but current published mislabeling was not established

### Guard gap

`EssayImageData.kind` is optional in `src/types/essay.ts`.

`ImageMeta` in `blocks.tsx` resolves:

```ts
const kind = block.kind ?? 'archive';
```

and the archive branch displays the reader-facing badge `Архив`.

`validate-essays.ts` validates image source, alt, caption and source URL but does not require `kind`.

Therefore a future image block that omits `kind` is not treated as unknown/failure; it is silently classified as archival in the reader UI.

### Current witness check

The current image-bearing publication families sampled in this wave use explicit classification:

- Yesenin visual blocks: explicit `archive`;
- Briks visual blocks: explicit kinds;
- Mayakovsky Part II visual blocks: explicit kinds;
- Yesenin/Duncan image: explicit `archive`;
- Yesenin Part II: all three located image blocks explicitly `archive`;
- Mayakovsky Part I: seven located image blocks, explicitly classified (six `archive`, one `document`).

No current published image block was established where omitted `kind` causes an actual reconstruction/editorial image to be displayed as `Архив`.

### Disposition

**Do not promote an active mislabeling root without a current witness.**

Record the fail-open producer guard as hardening for `TLP-AUDIT-004` / future essay authoring validation:

- published image blocks should require explicit `kind`;
- unknown/missing kind should fail validation rather than default to archival truth;
- reconstruction/document/archive classifications should remain reader-visible and provenance-backed.

This guard should remain separate from the canonical-poet portrait provenance issue, which has a different model/producer path.

## 6. Additional contrast manifestations

`SourceLibrary` contains factual source metadata/counts using low-opacity normal text, including values around `/35`, `/42` and `/45` on dark surfaces. These strengthen existing **`TLP-A11Y-CONTRAST-001`**; they do not warrant a new source-library contrast ID.

## 7. Audit-harness impact

Strengthen existing **`TLP-AUDIT-004`** with:

- citation activation proof covering hash + reveal + viewport + destination focus;
- analytics-configured modal/consent overlay collision/focus test;
- essay authoring validator fixture where an image omits `kind` and must fail rather than render as archival;
- retain a positive lightbox focus/Escape/return test demonstrating the shared overlay runtime stays one authority.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| Breadcrumb current item has `aria-current=page` | correct / no defect |
| Citation reveals source but leaves focus at citation | existing `TLP-A11Y-RUNTIME-001` |
| Consent banner z140 outside modal stack | existing `TLP-A11Y-RUNTIME-001`, config-dependent |
| Article image lightbox uses shared dialog surface | correct / no defect |
| `EssayImageData.kind` optional + renderer defaults to `archive` | guard gap; strengthen `TLP-AUDIT-004`, no current mislabel root proven |
| sampled current published image blocks explicitly classified | negative evidence; prevents false promotion |
| SourceLibrary factual metadata low contrast | existing `TLP-A11Y-CONTRAST-001` |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: **0**.
- Existing roots strengthened: `TLP-A11Y-RUNTIME-001`, `TLP-A11Y-CONTRAST-001`, `TLP-AUDIT-004`.
- Explicit false positives retired: breadcrumb aria-current, independent lightbox modal runtime, current image-kind mislabeling without evidence.
