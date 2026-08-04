# Search audit pass 5 — premium/native interaction audit

**Date:** 2026-08-04  
**Product source HEAD:** `f9d0120718569c510833dba7a3abd68ce2f6a003`  
**Parent reports:** `REPORT.md`, `PASS2_DEEPENING.md`, `PASS3_SCRIPTURE_SEARCH.md`, `PASS4_SEARCH_CONTRACT_A11Y.md`  
**Machine artifact:** `PASS5_PREMIUM_NATIVE_PROBE.json`

## 1. Scope and method

This pass responds specifically to the premium/native standard requirement: search must not feel like a patched-on “колхоз” widget. The audit checks whether the command palette behaves like a true native premium modal: visible, top-layer, keyboard-safe, touch-safe, theme-safe and consistent across routes.

A Node/bash harness executed **71 checks** over production-like `dist`, `js/search.js`, `css/command-palette.css`, route policy inventory, manifest, Pagefind and high-z CSS surfaces.

Result:

```json
{
  "checks": 71,
  "passed": 54,
  "failed": 16,
  "warnings": 1
}
```

Several failures are already covered by rows promoted in earlier passes (`SEARCH-P1-01`, `SEARCH-P1-03`, `SEARCH-P2-09`, `SEARCH-P2-10`). This pass promotes only new independently repairable premium/native residuals.

## 2. Positive premium/native evidence

The current search implementation is not all bad. Confirmed healthy:

- command-palette CSS and JS exist and are not tiny placeholders;
- Pagefind index and search manifest exist;
- manifest has no duplicate ids/urls and no current bad URL protocols;
- local manifest URLs resolve in dist;
- home has static search button and search assets;
- CSS has light/dark variable sets;
- reduced-motion and coarse-pointer branches exist;
- safe-area inset handling exists;
- mobile layout and preview-column hiding exist;
- overscroll containment and scroll lock exist;
- clear button and result rows meet 44px min target;
- dialog role, aria-modal and aria-label are set;
- Escape and backdrop close exist;
- Ctrl/Cmd+K and delegated trigger selectors exist;
- boot guard exists;
- no `eval`, no `new Function`, no `document.write` in `js/search.js`;
- core Pagefind queries work for `Код да Винчи`, `Иер 17:9`, `Мф 5:3`, `карта авраама`, `русский баптизм`.

## 3. Failures already owned by previous rows

| Probe failure | Existing row |
|---|---|
| Public searchable routes without global search asset: `/karty/avraam/`, `/karty/ishod/`, `/konfessii/russkij-baptizm/`, `/map/` | `SEARCH-P1-01` |
| No combobox role / no `aria-expanded` / no `aria-activedescendant` / no stable option ids | `SEARCH-P2-10` |
| SearchAction `/?q=` unimplemented | `SEARCH-P2-09` |
| `Ин 3:16` still not exact | `SEARCH-P1-03` |
| No show-more path for sliced results | UX candidate, not promoted |
| `safeUrl()` does not explicitly reject protocol-relative URLs | hardening candidate, not promoted because current corpus has none |

## 4. New premium/native findings

### SEARCH-P2-11 — Command palette is not a complete top-layer modal

**Severity:** P2  
**Type:** premium modal / a11y / clickability

Evidence from pass 5:

```text
J14 fail — base dialog has no visible close button distinct from input clear
J16 fail — Tab trapping is scoped to the input only, not the whole dialog/document
C20 fail — search overlay fallback z-index 10000 is below known floating layers:
            99999, 2147482500, 2147482600, 2147483000, 2147483100, 2147483200
```

Current facts:

- `.cp-backdrop` uses `z-index: var(--z-modal,10000)`.
- Other site overlays/tooltips use much higher z-index values in production assets.
- `search.js` handles `Tab` only inside the input keydown switch. Once focus moves to another button/link in the dialog, Tab is not trapped at dialog/document level.
- Base shared search markup has a clear-input button, but no always-visible close button. Home appears to have route-specific close augmentation, but the shared palette itself is not self-sufficient.

Impact:

- A tooltip/floating layer can visually sit above the search modal, violating premium top-layer expectations.
- Keyboard users can escape an `aria-modal=true` dialog after focus leaves the input.
- On mobile/touch contexts without a hardware Escape key, closing can depend on backdrop tapping rather than an obvious close affordance.

Repair direction:

- Give search a governed top-layer token above all floating tooltips, or close lower overlays when search opens.
- Implement dialog-level focus trap, not input-only Tab handling.
- Add a shared visible close button in base markup, not just route-specific Home augmentation.
- Guard with a browser test: open tooltip/floating overlay, then search; search must be topmost and trap/restore focus.

---

### SEARCH-P2-12 — Premium touch/focus affordances are inconsistent

**Severity:** P2  
**Type:** premium controls / accessibility / touch

Evidence from pass 5:

```text
C13 fail — .cp-scope-chip min-height is 32px, below 44px target
C14 fail — .gb-nav-search-icon shared CSS has padding:2px and no explicit 44px min-size
C17 fail — no .cp-scope-chip:focus-visible style
C18 fail — no .cp-preview-btn:focus-visible style in shared CSS probe
```

Current facts:

- The search scope chips are interactive tab controls (`Все`, `Статьи`, `Писание`, `Авторы`) but have `min-height:32px`.
- Shared `.gb-nav-search-icon` styling is compact and relies on route-specific chrome to be adequately sized. This is fragile across route families.
- Focus-visible styling is not consistently defined for all actionable search controls.

Impact:

- Touch interaction feels cramped/non-premium on mobile.
- Focus rings/visible keyboard affordance can vary by route and control type.
- A native/premium standard should make interactive targets consistently at least 44px or deliberately justified as dense desktop-only controls.

Repair direction:

- Raise touch targets for scope chips to 44px on coarse pointers, or use a documented desktop-dense/mobile-expanded split.
- Give `.gb-nav-search-icon` a shared 44px hitbox, allowing route chrome to visually center a smaller icon inside it.
- Add explicit `:focus-visible` rules for scope chips, preview buttons and any injected search trigger.
- Add source/CSS guard for minimum target size on shared search controls.

## 5. Full failed probe list

```text
R01 fail all public searchable routes have global search asset
R02 warn all routes with search asset have visible/static trigger
C13 fail scope chips meet 44px touch min
C14 fail nav search icon has explicit 44px min in shared CSS
C17 fail scope chip focus-visible style exists
C18 fail preview button focus-visible style exists
C20 fail search overlay top-layer is above known floating tooltips
J08 fail combobox role present
J09 fail aria-expanded managed for search input/dialog
J10 fail aria-activedescendant managed
J11 fail stable option ids managed
J14 fail base dialog has visible close button distinct from clear
J16 fail Tab trapping handled at document/dialog level
J25 fail safeUrl blocks protocol-relative URLs
J26 fail SearchAction q parameter implemented by runtime
J30 fail Pagefind results expose show-more path
Q06 fail query Ин 3:16 returns exact John 3:16 occurrence
```

## 6. Matrix movement recommendation

Promote:

- `SEARCH-P2-11` — incomplete top-layer modal / focus trap / close affordance.
- `SEARCH-P2-12` — inconsistent premium touch/focus affordances.

Do not promote additionally:

- R01, J08-J11, J26, Q06 because already owned by previous search rows.
- J25 because current corpus has no protocol-relative manifest URL.
- J30 because result expansion is a P3 UX enhancement unless owner raises the standard.

## 7. Closure requirements

For `SEARCH-P2-11`:

- source/CSS top-layer z-index token contract;
- focus trap at dialog/document level;
- shared visible close button;
- browser witness over tooltip/floating overlay + search open;
- keyboard witness Tab/Shift+Tab/Escape/focus restore.

For `SEARCH-P2-12`:

- shared CSS min-size/focus-visible contract;
- route sample proving nav trigger 44px hitbox;
- coarse-pointer/mobile witness for scope chips and trigger;
- no visual regression to desktop premium density.
