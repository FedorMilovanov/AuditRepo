# Deep safe bug verification — 2026-06-25 (round 4, audit drift / selector mismatch)

**Scope:** verification only. No implementation fixes applied.  
**Goal:** distinguish real route bugs from stale audit assumptions so other agents do not waste time “fixing” correct markup.

---

## 1. Confirmed interactive-audit selector drift: mobile theme detection misses live premium buttons

File inspected:
- `scripts/interactive-audit.js`

Current `visibleThemeHandle()` selector list:

```txt
.gbs2-mctl[data-gbs2-theme]
.gbs2-ctl[data-gbs2-theme]
.gb-fc-theme
#barThemeBtn
#themeToggle
.theme-toggle
.nag-sidebar-theme-btn
```

### Problem

This list does **not** include the actual visible premium theme selectors used by some routes:

- `#gbFcTheme`
- `.gb-theme-toggle`
- `#gbsTheme`

### Route evidence: Hermeneutics mobile

Audit selector set sees only hidden old controls:
- `#barThemeBtn` → `visible: false`
- `#themeToggle` → `visible: false`
- `.theme-toggle` → `visible: false`

But the real premium control exists and is visible:

```txt
#gbFcTheme
visible: true
40x40
```

### Route evidence: Gill Part I mobile

Audit selector set misses the actual visible premium Gill button.
Visible premium selector:

```txt
#gbsTheme
visible: true
32x32
```

The audit therefore reports:
- `mobile-theme-control-not-visible`

not because the route has no control, but because the audit does not know the current premium selectors.

### Conclusion

`mobile-theme-control-not-visible` on at least these routes is an **audit false positive** caused by stale selectors:
- `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- `/articles/dzhon-gill-chast-1-chelovek/`

(Though Gill Part I also has a real duplicate-ID bug — see round 3.)

---

## 2. Confirmed interactive-audit selector drift: Gill context is checked as old GBS2 shell even though it is a new v16 shape

File inspected:
- `scripts/interactive-audit.js`

Current series checks assume GBS2 markers such as:
- `.gbs2-rail`
- `#gbs2Bbar, .gbs2-bbar`
- `#gbs2Sheet, .gbs2-sheet`

### Route evidence: `/articles/dzhon-gill-istoricheskiy-kontekst/`

Actual DOM shape on production-like artifact:

```txt
.gbs-rail              -> exists, large visible box
.mobile-bottom-bar     -> exists
#mobTocBtn             -> exists
#seriesTocOverlay      -> exists
#partTocOverlay        -> exists
```

Audit-expected old markers on this route:

```txt
.gbs2-rail             -> absent
#gbs2Bbar / .gbs2-bbar -> absent
#gbs2Sheet / .gbs2-sheet -> absent
```

### Resulting audit lines
This mismatch directly explains these interactive-audit findings:
- `gbs-rail-not-visible`
- `gbs-no-current-part`
- `gbs-mobile-ui-missing`

for Gill context.

### Conclusion

For `/articles/dzhon-gill-istoricheskiy-kontekst/`, those specific findings are **audit contract drift**, not proof that the route shell is missing.

Important nuance:
- this route still has a **real** runtime bug (`qs is not defined`),
- but its shell-shape findings are not all equally trustworthy.

---

## 3. Real route bug + audit false positive can coexist on the same page

This is the most important coordination lesson.

Examples:

### Hermeneutics
- **real bug:** controller runtime crash (`qs is not defined`)
- **real bug:** stray `76e7365`
- **real bug:** hidden readTime `35` vs visible `50`
- **false-positive audit symptom:** `mobile-theme-control-not-visible`

### Gill Part I
- **real bug:** controller runtime crash (`qs is not defined`)
- **real bug:** duplicate IDs `gbsTheme`, `gbsSearch`
- **false-positive audit symptom:** mobile theme control “missing” even though a visible one exists

### Gill context
- **real bug:** controller runtime crash (`qs is not defined`)
- **false-positive audit symptoms:** old GBS2 shell markers missing, despite new v16 shell being present

So future fix lanes should avoid assuming that every audit line maps 1:1 to a page bug.

---

## 4. Additional implementation insight: premium marker presence suppresses legacy TTS in `site.js`

Source inspection of `js/site.js` shows this guard:

```js
if(document.querySelector(".gb-ember,[data-fc-root]"))return;/* v16 cluster owns TTS */
```

### Implication

If a route contains premium markers such as `.gb-ember`, legacy sitewide TTS initialization exits early because the code assumes the premium cluster owns playback.

### Why this matters

This helps explain the heart-series failure mode:

- `/articles/krajne-li-isporcheno-serdce/`
- `/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/`

These routes visibly contain:
- `.gb-ember`
- `.gb-save`

but do **not** load `floating-cluster-controller.js`.

So they land in a bad middle state:

```txt
premium marker present -> legacy TTS suppressed
premium controller absent -> premium play/save dead
```

### Browser verification consistent with this

On both heart routes, after clicking:
- save remains unchanged
- ember state remains `idle`
- no toast appears

### Conclusion

This is not just “missing JS include”.
It is also a **behavioral ownership conflict** between:
- legacy `site.js` assumptions,
- and incomplete premium rollout markup.

---

## 5. Safe takeaway for implementation agents

Before fixing routes, distinguish four categories:

1. **shared runtime crash**
   - e.g. `qs is not defined`

2. **markup integrity bugs**
   - duplicate IDs
   - stray hash text
   - hidden/visible metadata drift

3. **partial rollout ownership bugs**
   - premium markup present, controller absent
   - legacy runtime suppressed because premium markers exist

4. **audit/tooling drift**
   - selectors still expect old GBS2 or old theme-button names

Without this separation, agents will waste effort trying to “repair” correct route shapes that are actually being misread by stale audits.
