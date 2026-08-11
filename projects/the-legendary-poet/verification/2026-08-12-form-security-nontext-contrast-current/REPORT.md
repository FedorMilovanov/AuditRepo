# Current Verification — form semantics, link hygiene and non-text contrast

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

This wave is primarily consolidation/negative evidence. It creates no new active ID.

## 1. Community comment form semantics are materially correct

`CommentComposer` provides:

- an accessible name for the optional author input through a visually-hidden label;
- an accessible name for the comment textarea through a visually-hidden label;
- `aria-describedby` from the textarea to the minimum-length/shortcut/character-count help block;
- native `maxLength` limits plus controlled slicing;
- a disabled submit button until the current client minimum/maximum length contract is satisfied;
- `aria-pressed` on comment-kind toggle buttons;
- visible focus rings on the controls.

The existing defect is not “form fields have no labels”.

Remote/local submit outcome messages still flow through the existing community toast/status path and remain owned by `TLP-COMM-A11Y-001`.

The low-opacity help text and unselected option labels remain owned by `TLP-A11Y-CONTRAST-001`.

## 2. RatingStars implements a proper keyboard radio model

Interactive `RatingStars` uses:

- `role="radiogroup"`;
- one `role="radio"` per score;
- `aria-checked`;
- roving `tabIndex`;
- arrow-key navigation;
- Home/End support;
- explicit focus movement after keyboard selection;
- per-radio accessible labels such as `3 из 5`.

This is a strong current implementation and should not be replaced with five ordinary ungrouped buttons merely to simplify markup.

### Negative evidence

Do not create a “rating stars are not keyboard accessible” issue from the visual star design alone.

## 3. CONFIRMED manifestation — enabled unselected rating controls have a non-text contrast risk

The same `RatingStars` implementation renders an unselected star as:

```tsx
className="... text-cyan-900"
```

inside a transparent 40×40 radio button on a dark rating-card surface around `#061018`.

There is no visible button border/background in the default unfocused state, so the star graphic is the primary visual information that tells a sighted reader:

- a rating control exists at this location;
- there are five possible choices;
- this choice is currently unselected.

WCAG 2.2 Success Criterion 1.4.11 requires visual information needed to identify enabled user-interface components and states to reach at least 3:1 against adjacent colors.

Official references:

- https://www.w3.org/TR/WCAG22/#non-text-contrast
- https://www.w3.org/WAI/WCAG22/Techniques/general/G207.html

Tailwind’s current `text-cyan-900` is a deliberately dark cyan token. The exact rendered contrast should be asserted from computed styles in the project’s actual Tailwind build rather than hardcoding a library-version hex assumption into the validator.

Given the near-black card background and the role of the dark star as the only default control marker, this belongs to the existing systemic contrast repair rather than a RatingStars-only ID.

### Disposition

Strengthen **`TLP-A11Y-CONTRAST-001`** to cover both:

- normal text under SC 1.4.3;
- meaningful enabled control/graphical-state indicators under SC 1.4.11.

The terminal contrast harness should inspect computed styles and test the actual adjacent surface.

## 4. External-link hygiene — no current generic tabnabbing root established

The shared `MagneticButton` external-href branch uses:

```tsx
<a href={href} target="_blank" rel="noopener noreferrer">
```

Reader source links inspected in `SourceLibrary` / article image metadata likewise use new-tab links with `rel="noreferrer"` / safe HTTP(S) editorial URLs.

Essay validators require source-like URLs to be HTTP(S), preventing a bundled essay image/source from using an arbitrary `javascript:` URL through the normal content model.

### Potential component API footgun not promoted

`MagneticButton` has a fallback branch that can render a clickable `<div>` when used with only `onClick` and neither `to` nor `href`. Such a branch would need native-button keyboard semantics if used for a real action.

This wave did not establish a current reader-facing onClick-only usage of that branch. Therefore it remains an API hardening concern, **not an active keyboard bug**.

Do not promote it without a concrete current call site.

## 5. Audit-harness impact

Strengthen existing **`TLP-AUDIT-004`** with:

- computed non-text contrast checks for enabled/unselected RatingStars in dark and light themes;
- retain a keyboard radio-group regression covering Arrow/Home/End and focus ownership;
- source/content validator fixtures rejecting non-HTTP(S) source URLs;
- optional lint/source-contract guard if the project chooses to forbid `MagneticButton` action-only usage rather than implement native button semantics for that branch.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| Comment inputs lack labels | false; current labels are present |
| Comment textarea lacks help relationship | false; `aria-describedby` present |
| RatingStars keyboard semantics broken | false; current radiogroup model is good |
| Unselected enabled star/control visual may fall below 3:1 | existing `TLP-A11Y-CONTRAST-001` |
| Generic external target=_blank tabnabbing issue | not established in inspected shared/source paths |
| MagneticButton onClick-only div branch | latent API footgun; not promoted without usage witness |
| missing computed control-contrast regression | strengthen `TLP-AUDIT-004` |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: **0**.
- Existing roots strengthened: `TLP-A11Y-CONTRAST-001`, `TLP-AUDIT-004`.
