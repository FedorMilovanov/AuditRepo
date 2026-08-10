# Wave 10 — mobile navigation focus lifecycle and reduced-motion divergence

Date: 2026-08-10
Auditor: ChatGPT
Evidence class: `incoming/raw-current-evidence`

## Anchor / collision boundary

- Product repository: `FedorMilovanov/gb-is-my-strength`
- Exact Product `main`: `171daaf3fd40b92208c6e8b551acccdc00efbb6c`
- Exact-head check immediately before this wave: comparing that SHA to `main` returned `identical` (`ahead_by=0`, `behind_by=0`).
- AuditRepo base immediately before publication: `afc142ffcd252a2d82282ccc8439aa95531c8f31`
- AuditRepo compare immediately before publication: base vs `main` returned `identical`.
- Product mutation: **none**
- MASTER mutation: **none**
- WORK_QUEUE mutation: **none**

Current `AGENTS.md`, AuditRepo `README.md`, and `AUDITREPO_OPERATING_MODEL.md` were reread before the wave. This report stays in `incoming/`: it records current source mechanisms and bounded next browser witnesses without starting a competing Product repair lane.

## Environment / limitations

The execution container still cannot resolve `gospod-bog.ru`, so this wave does **not** claim a fresh local Playwright run, fresh screenshot, accessibility-tree capture, pointer interaction, or measured performance result. Historical public crawler snapshots are not used as current production truth here.

The findings below are based on exact-current Product source and deterministic focus/scroll mechanisms. Browser regression witnesses are specified explicitly where they would strengthen the final verification package.

## Executive disposition

| Finding | Current disposition |
|---|---|
| Closing the HardTexts/home-style mobile navigation with Escape while focus is on a menu link leaves focus on an element that immediately becomes `visibility:hidden` | `CONFIRMED-CURRENT / A11Y SOURCE-MECHANISM` |
| `#hScrollTop` always requests smooth scrolling even when `prefers-reduced-motion: reduce` is active, bypassing the repository's own reduced-motion-aware helper | `CONFIRMED-CURRENT / REDUCED-MOTION CONTRACT DIVERGENCE` |
| Absence of a dedicated source-test hit for `hMobileMenuBtn` / `hScrollTop` | `COVERAGE CANDIDATE`, not promoted to an audit defect without a stronger test census |
| Mobile menu has no focus trap / `aria-controls` and is a plain `div` | `NOT PROMOTED`; those facts alone are not sufficient to call the disclosure-navigation pattern invalid |

---

## 1. HardTexts mobile navigation: Escape can strand focus on hidden content

### Canonical surface

`src/components/hard-texts/HardTextsPageChrome.astro` renders:

```html
<button
  class="h-mobile-menu-btn"
  id="hMobileMenuBtn"
  aria-label="Открыть меню"
  aria-expanded="false">
  ...
</button>

<div class="h-mobile-nav" id="hMobileNav" aria-hidden="true">
  <a href="../#publikacii" data-close-nav>Публикации</a>
  <a href="../#razbor" data-close-nav>Разбор заблуждений</a>
  <a href="../biografii/" data-close-nav>Биографии</a>
  <a href="../articles/" data-close-nav>Все статьи</a>
  <a href="../about/" data-close-nav>О проекте</a>
</div>
```

At `max-width:760px`, `css/home.css` makes the closed menu non-visible and non-interactive:

```css
.h-mobile-nav {
  visibility: hidden;
  pointer-events: none;
  ...
}
.h-mobile-nav.open {
  visibility: visible;
  pointer-events: auto;
  ...
}
```

### Current close mechanism

The current `js/site.js` module owns `#hMobileMenuBtn`, `#hMobileNav` and `#hMobileBackdrop`.

When open, a document-level keydown handler invokes the close function on Escape:

```text
document.addEventListener("keydown", function(e) {
  u && SiteUtils.isEscape(e) && v()
})
```

The close function:

- removes `.open` from `#hMobileNav`;
- sets `aria-hidden="true"`;
- sets the opener `aria-expanded="false"`;
- changes its label back to `Открыть меню`;
- removes the backdrop state;
- unlocks scroll.

It does **not** move focus back to `#hMobileMenuBtn` or to any other visible control.

### Deterministic failure sequence

A keyboard user can follow the ordinary sequence:

```text
focus #hMobileMenuBtn
→ activate menu
→ Tab into a menu <a>
→ press Escape
→ v() closes #hMobileNav
→ CSS immediately changes the focused menu subtree to visibility:hidden
→ document.activeElement is still the now-hidden <a>
```

This is stronger than a generic “no focus trap” complaint. The problem is specifically the lifecycle of Escape closure while focus is inside the disclosed content.

### Relevant navigation-pattern reference

W3C APG's disclosure navigation menu example documents the corresponding keyboard behavior: when a dropdown is open, Escape closes it and sets focus on the button that controls the dropdown.

Reference:

- https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
- https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

The Product's own overlay runtime elsewhere already has explicit focus-return ownership, so this finding is also inconsistent with the stronger focus lifecycle used on other interactive surfaces.

### Scope discipline

This report confirms the mechanism on `/hard-texts/`, whose `HardTextsPageChrome.astro` explicitly renders this menu and loads `site.js`. It does not yet claim every route with `.h-navbar` is affected; a route-family census should determine whether the same chrome owner is reused elsewhere.

### Recommended browser regression witness

At minimum:

1. viewport 390×844;
2. focus `#hMobileMenuBtn`;
3. open with Enter/Space;
4. Tab to first and then a later mobile-nav link;
5. press Escape;
6. assert:
   - menu has `aria-hidden="true"` and is not visible;
   - `document.activeElement === #hMobileMenuBtn`;
   - active element has a visible client rect;
   - scroll lock is released;
7. repeat at 760px and verify 761px does not expose the mobile interaction owner.

**Disposition:** `CONFIRMED-CURRENT / A11Y SOURCE-MECHANISM`. Suitable for a bounded current verification/repair package; not promoted to MASTER in this raw wave.

---

## 2. Scroll-to-top ignores the user's reduced-motion preference

### Repository already has a canonical reduced-motion-aware helper

The current `js/site.js` utility object contains:

```js
prefersReducedMotion: function () {
  return Boolean(window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);
},

scrollToTop: function () {
  window.scrollTo({
    top: 0,
    behavior: this.prefersReducedMotion() ? 'auto' : 'smooth'
  });
}
```

That is a clear existing Product intent: programmatic scroll-to-top should avoid smooth motion when the OS/browser requests reduced motion.

### HardTexts/home scroll-top bypasses that helper

The same current `site.js` module later binds `#hScrollTop` directly as:

```js
window.scrollTo({ top: 0, behavior: 'smooth' })
```

`HardTextsPageChrome.astro` renders the corresponding button:

```html
<button class="h-scroll-top" id="hScrollTop" aria-label="Наверх">...</button>
```

Therefore two scroll-to-top paths inside the same current runtime disagree:

1. canonical utility path → `auto` under reduced motion;
2. `#hScrollTop` click owner → always `smooth`.

This is not a speculative design preference. It is a current implementation divergence from an already-encoded repository accessibility contract.

### Standards/context

WCAG 2.2 Understanding 2.3.3 (“Animation from Interactions”) discusses disabling non-essential interaction-triggered motion for users who request it. W3C technique SCR40 describes using `prefers-reduced-motion` from JavaScript.

References:

- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://www.w3.org/WAI/WCAG22/Techniques/client-side-script/SCR40.html

The WCAG success criterion is Level AAA; the reason this is treated as a Product contract divergence rather than merely “AAA polish” is that this repository already implemented the reduced-motion-aware `SiteUtils.scrollToTop()` helper and the local button bypasses it.

### Recommended browser witness

Run two contexts on `/hard-texts/` after scrolling below the threshold where `#hScrollTop` becomes visible:

- `reducedMotion: 'no-preference'` → click should use smooth behavior;
- `reducedMotion: 'reduce'` → click should use instant/auto behavior.

A robust test can stub/spy `window.scrollTo` and assert the requested `behavior` rather than depending on animation timing.

Also verify keyboard activation, because the issue is the common click handler used by both pointer and keyboard-generated clicks.

**Disposition:** `CONFIRMED-CURRENT / REDUCED-MOTION CONTRACT DIVERGENCE`.

---

## 3. Coverage notes — deliberately not overclaimed

Repository code search for exact identifiers `hMobileMenuBtn` and `hScrollTop` returned no dedicated indexed test hit in this connector run. That suggests these exact focus/motion behaviors may not have direct regression coverage, but code search incompleteness is not enough to prove a test-suite gap.

Therefore this remains only a `COVERAGE CANDIDATE` until one of the following is done:

- inspect the relevant browser/visual audit scripts by path and confirm the behaviors are absent; or
- run the test suite with a mutation that removes focus return / forces smooth behavior and demonstrate a false-green.

No audit-defect row is warranted from the search result alone.

---

## 4. What was deliberately NOT promoted

### “No focus trap”

Disclosure navigation does not automatically require modal focus trapping. The current confirmed problem is narrower and stronger: Escape closure does not restore focus when the active element is inside the menu.

### Missing `aria-controls`

The opener currently lacks `aria-controls="hMobileNav"`. This is a semantic improvement candidate, but it is not needed to establish the hidden-focus defect and is not independently promoted here.

### Plain `div` menu container

The mobile menu container is a `div`, while the desktop sibling is a `nav`. This may reduce landmark consistency, but the links remain discoverable and no accessibility-tree witness was captured in this environment. Leave it unpromoted pending a real tree/AT check.

### Live production claim

No fresh production-browser witness was available in this environment, so this report is exact-current source evidence, not a claim that a particular production deployment SHA was interacted with live.

---

## 5. Next high-value wave

1. Establish an exact browser witness for the Escape→focus lifecycle at 390 / 760 / 761.
2. Establish `prefers-reduced-motion` behavior with a `window.scrollTo` spy.
3. Census routes that reuse the same `.h-navbar` / `site.js` navigation owner to decide local vs shared scope.
4. Inspect hard-texts/home browser tests for mutation-resistance on focus return and reduced motion.
5. Continue the prior Pagefind divergence by querying an annotation-only Krajne phrase against an exact production-like built index when an executable checkout/network witness is available.

Until those steps, keep these findings in incoming evidence; do not multiply symptom rows or infer a system root from one route family.
