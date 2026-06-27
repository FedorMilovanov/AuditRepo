# PremiumControls — mobile visibility fix applied (2026-06-27)

**Project:** `gb-is-my-strength` / `gospod-bog.ru`  
**Date:** 2026-06-27  
**Source repo commit pushed to `main`:** `83f0acdc`  
**Commit message:** `[LANE lane/system-premiumcontrols-mobile-visibility-2026-06-27] fix(premiumcontrols): mobile fallback for hidden series controls`  
**Reason:** remote-main deep audit found mobile `.gb-ember` controls at `0×0` on several non-Gill series-rich families while desktop rollout/audit passed.

---

## 1. Bug closed

Previous Playwright mobile audit (`390×844`, touch enabled) found:

```text
/articles/krajne-li-isporcheno-serdce/                  .gb-ember.gbs2-ctl 0×0
/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/  .gb-ember.gbs2-ctl 0×0
/baptisty-rossii/noch-na-kure/                          .gb-ember.gbs2-ctl 0×0
/nagornaya/chast-1/                                     .gb-ember.nag-sidebar-ember 0×0
```

Desktop was OK, Gill v16 mobile was OK, but non-Gill series controls lived in hidden desktop rail/sidebar containers on mobile.

---

## 2. Implementation

### 2.1 Runtime fallback in `js/floating-cluster-controller.js`

Added `ensureMobileFallbackControls()` before `initPlayExpand()`.

Purpose:

- If viewport is mobile (`max-width: 899px`),
- and no `.gb-ember` has a visible/tappable `>=30×30` box,
- clone the existing scoped `[data-fc-root]` / `[data-fc-controls]` control root,
- strip duplicate IDs,
- append it to `document.body` as `.gb-mobile-fallback-controls`,
- then let the existing `initPlayExpand()` / `initCluster()` wire it normally.

Core code pattern:

```js
function hasVisibleEmber() {
  return qsa('.gb-ember').some(function (el) {
    var rect = el.getBoundingClientRect();
    return rect.width >= 30 && rect.height >= 30 &&
           window.getComputedStyle(el).visibility !== 'hidden' &&
           window.getComputedStyle(el).display !== 'none';
  });
}

function stripIds(root) {
  qsa('[id]', root).forEach(function (el) { el.removeAttribute('id'); });
}

function ensureMobileFallbackControls() {
  if (!window.matchMedia || !window.matchMedia('(max-width: 899px)').matches) return;
  if (qs('.gb-mobile-fallback-controls')) return;
  if (hasVisibleEmber()) return;

  var source = qs('[data-fc-root] .gb-ember') || qs('[data-fc-controls] .gb-ember');
  if (!source) return;
  var sourceRoot = source.closest('[data-fc-root], [data-fc-controls]');
  if (!sourceRoot) return;

  var clone = sourceRoot.cloneNode(true);
  stripIds(clone);
  clone.classList.add('gb-mobile-fallback-controls');
  clone.setAttribute('data-fc-mobile-fallback', 'true');
  clone.setAttribute('aria-label', 'Быстрые действия чтения');
  document.body.appendChild(clone);
}
```

Initialization order changed to:

```js
initEmbers();
initTocPopups();
initActionHandlers();
ensureMobileFallbackControls();
initPlayExpand();
```

This order matters: the fallback is cloned before `initPlayExpand()` wraps embers and injects the speed panel.

---

### 2.2 CSS fallback in both `floating-cluster.css` and `mobile-hotfix.css`

Why both:

- Some affected pages load `floating-cluster.css`.
- Heart series and Nagornaya variants may not load `floating-cluster.css`, but they do load `mobile-hotfix.css` / site CSS.

The fallback CSS was therefore duplicated deliberately in:

```text
css/floating-cluster.css
css/mobile-hotfix.css
```

Core CSS:

```css
.gb-mobile-fallback-controls {
  display: none;
}
@media (max-width: 899px) {
  .gb-mobile-fallback-controls {
    position: fixed !important;
    left: 50% !important;
    right: auto !important;
    bottom: calc(64px + env(safe-area-inset-bottom, 0px)) !important;
    top: auto !important;
    transform: translateX(-50%) !important;
    z-index: 2102 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 4px !important;
    width: max-content !important;
    max-width: calc(100vw - 24px) !important;
    min-height: 44px !important;
    padding: 5px 8px !important;
    border: 1px solid rgba(184,147,106,.28) !important;
    border-radius: 999px !important;
    background: rgba(253,252,249,.94) !important;
    box-shadow: 0 14px 36px rgba(0,0,0,.14) !important;
    -webkit-backdrop-filter: blur(18px) saturate(170%) !important;
    backdrop-filter: blur(18px) saturate(170%) !important;
    overflow: visible !important;
  }

  .gb-mobile-fallback-controls .gbs2-home,
  .gb-mobile-fallback-controls [data-gbs2-offline],
  .gb-mobile-fallback-controls [data-gbs2-share] {
    display: none !important;
  }

  .gb-mobile-fallback-controls .gbs2-ctl,
  .gb-mobile-fallback-controls .nag-sidebar-btn,
  .gb-mobile-fallback-controls .nag-sidebar-ember,
  .gb-mobile-fallback-controls .nag-sidebar-save,
  .gb-mobile-fallback-controls .gb-ember,
  .gb-mobile-fallback-controls .gb-save {
    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
    min-height: 36px !important;
    display: grid !important;
    place-items: center !important;
    flex: 0 0 auto !important;
  }
}
```

---

## 3. Verification

### 3.1 Build

```bash
npm run strangler:build:production-like
```

PASS.

### 3.2 PremiumControls audit

```bash
npm run audit:premium-controls
```

PASS:

```text
PremiumControls rollout audit: 39/39 passed
✅ PremiumControls rollout contract OK.
```

### 3.3 Full publication gate

```bash
npm run validate:static-publication
```

PASS.

### 3.4 Mobile Playwright smoke

Mobile viewport:

```text
390×844, touch enabled
```

Routes checked:

```text
/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/
/articles/krajne-li-isporcheno-serdce/
/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/
/articles/dzhon-gill-chast-1-chelovek/
/articles/dzhon-gill-spravochnik/
/baptisty-rossii/noch-na-kure/
/nagornaya/chast-1/
```

Final result:

```text
/articles/hermenevticheskaya... visible 36×36
/articles/krajne...             fallback visible 36×36; tap opens speed panel
/articles/rimlyanam7...         fallback visible 36×36; tap opens speed panel
/articles/dzhon-gill-chast-1... native mobile ember visible 34×34; tap opens speed panel
/articles/dzhon-gill-spravochnik native mobile ember visible 34×34; tap opens speed panel
/baptisty-rossii/noch-na-kure/  fallback visible 36×36; tap opens speed panel
/nagornaya/chast-1/             fallback visible 36×36; tap opens speed panel
```

The previous 0×0 mobile controls are now visible/tappable.

---

## 4. Notes / tradeoffs

This is a surgical runtime fallback, not a full design rewrite of every series family.

Why this approach was chosen:

- It avoids editing long generated article bodies across many route families.
- It reuses the existing scoped controls and controller wiring.
- It avoids touching Gill v16, which was already mobile-correct.
- It is safe for desktop because the clone only appears at mobile width.

Potential future improvement:

- Replace this fallback with native mobile control markup in each series-rich family once those pages are hand-normalized.
- Add this Playwright mobile visibility matrix as a permanent scripted guard.

---

## 5. Commit / push status

Pushed directly to source `main` per owner instruction not to create new branches.

```text
source commit: 83f0acdc
branch: main
```

Token was used only in the push command and not stored in git config.
