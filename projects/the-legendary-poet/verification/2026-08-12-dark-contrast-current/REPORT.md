# Current Verification — dark-theme text contrast contract

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

No competing open Product issue was found for this contrast mechanism.

This wave is intentionally separate from `TLP-THEME-001`: that root concerns incomplete light-theme ownership. The defects below exist in the default/current dark theme even when theme switching is ignored.

## Accessibility authority

WCAG 2.2 Success Criterion 1.4.3 requires at least **4.5:1** contrast for normal-size text; the lower **3:1** threshold applies to large-scale text.

Official W3C references:

- https://www.w3.org/WAI/WCAG22/Techniques/general/G18
- https://www.w3.org/WAI/WCAG22/Techniques/general/G145.html

The current affected examples are 10–14 px normal text, not large-scale text.

## 1. CONFIRMED — core informational and interactive text uses opacity levels that cannot reach 4.5:1 on its dark surfaces

The strongest proof does not depend on the exact Tailwind cyan hue.

For a text color composited at 40% opacity over a near-black background, **even pure white** cannot reach the 4.5:1 normal-text threshold:

- white at 40% over `#050505` resolves around `rgb(105,105,105)` → about **3.71:1**;
- white at 35% over `#050505` → about **3.05:1**;
- white at 32% over `#050505` → about **2.73:1**;
- white at 30% over `#050505` → about **2.53:1**;
- white at 24% over `#050505` → about **2.00:1**.

Using cyan instead of white cannot improve these maxima. Similar near-black surfaces such as `#071018` / `#050b12` do not rescue opacity in the 24–40% range to 4.5:1.

### Current reader-facing examples

#### Footer

`Footer.tsx` on `bg-[#050505]` includes:

- word-of-day source attribution: `text-xs text-cyan-100/35`;
- copyright/legal lines: `text-sm text-cyan-200/40`;
- final project description: `text-[11px] text-cyan-200/25`.

These are informational text, not decorative glyphs.

#### Personal Archive

`MyArchivePage.tsx` includes:

- live result count (`aria-live`): `text-xs text-cyan-100/32`;
- poem year: `text-[10px] text-cyan-100/30`;
- saved timestamp: `text-[10px] text-white/24`;
- several explanatory/empty-state lines in the same low-opacity family.

The result count is especially clear: the app programmatically announces and visibly displays a functional search result state, but its visual presentation is intentionally below the normal-text contrast requirement.

#### Ratings

`RatingsPage.tsx` includes:

- stat labels: `text-xs ... text-cyan-100/40`;
- table headers: `text-[10px] ... text-cyan-100/40`;
- live `Найдено` result count: `text-xs text-cyan-100/35`;
- poet tag context: `text-xs text-cyan-100/35`;
- `с поправкой на выборку`: `text-[10px] text-cyan-100/30`;
- dimension leader detail: `text-xs text-cyan-100/35`.

These labels carry ranking meaning and table semantics; they are not optional visual atmosphere.

#### Community composer

`CommentComposer.tsx` includes:

- minimum-length / keyboard-shortcut help and character count: `text-[10px] ... text-cyan-100/34`;
- **unselected interactive comment-kind buttons**: `text-[10px] ... text-cyan-100/40`.

The inactive option labels are actionable control text. Making the unselected state visually subtle does not remove the requirement that readers can perceive the option names.

## 2. Root cause

**Low-contrast opacity fractions are being used as a general hierarchy token for normal text without a semantic floor for readable information/control labels.**

The pattern crosses Footer, Archive, Ratings and Community, so fixing isolated components would leave the class of defect intact.

The existing design system already distinguishes decoration from controls/reader copy in many places; the missing contract is an accessible minimum token for normal informational/interactive text on each supported surface/theme.

## 3. Disposition

New active root: **`TLP-A11Y-CONTRAST-001` / P2**.

Required terminal outcome:

- define semantic text tokens by role (primary, secondary, metadata, disabled, decorative), not arbitrary opacity percentages;
- normal informational and interactive text must meet WCAG 2.2 1.4.3 on its actual composited background in both dark and light themes;
- preserve intentionally decorative/nonessential low-contrast marks only where they are not the sole carrier of information or control identity;
- disabled text/states should remain distinguishable while following the applicable accessibility contract rather than reusing active-control low-opacity styling;
- avoid per-page hardcoded “raise from /35 to /55” patches without a shared token/validation owner.

Priority repair surfaces:

1. Community form help and unselected option labels;
2. Ratings table/stat/filter/result metadata;
3. Archive search/result and saved-item metadata;
4. Footer informational/legal/source text.

## 4. Audit-harness impact

Existing `TLP-AUDIT-004` currently certifies reduced motion, forced colors and broad reader journeys, but the permanent reader certification contract does not include computed foreground/background contrast checks.

Add representative browser computed-style assertions in both supported themes for:

- normal text on root dark surface;
- normal text on `#071018` / card surfaces;
- inactive-but-enabled controls;
- table headers/metadata;
- community help text;
- Footer information.

A class-level audit should fail when a normal functional text token resolves below 4.5:1, rather than snapshotting a fixed list of current class strings.

## 5. Explicit non-promotions

- The Archive delete button itself is not declared a target-size WCAG failure in this wave; its focus-removal problem is already owned by `TLP-A11Y-RUNTIME-001`.
- Low-opacity purely decorative lines/glows/borders are not text-contrast defects.
- This report does not treat all secondary text as required to be high-contrast white; compliant visual hierarchy can be achieved with colors that still meet the minimum.
- Light-theme contrast remains part of `TLP-THEME-001`; this new root exists independently on the default dark theme.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| Functional normal text at 24–40% opacity on near-black | new `TLP-A11Y-CONTRAST-001` / P2 |
| Same pattern across Footer/Archive/Ratings/Community | same systemic root |
| Light-theme incomplete color ownership | existing `TLP-THEME-001`, not duplicated |
| Focus/keyboard/collection mutation semantics | existing `TLP-A11Y-RUNTIME-001`, not duplicated |
| No computed contrast regression | strengthen existing `TLP-AUDIT-004` |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: 1 P2.
- Existing roots strengthened: `TLP-AUDIT-004`; separation from `TLP-THEME-001` and `TLP-A11Y-RUNTIME-001` preserved.
