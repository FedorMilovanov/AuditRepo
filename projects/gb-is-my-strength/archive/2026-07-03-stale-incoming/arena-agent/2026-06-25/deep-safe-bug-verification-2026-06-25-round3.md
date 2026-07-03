# Deep safe bug verification — 2026-06-25 (round 3)

**Scope:** further verification only, no implementation fixes.  
**Artifact basis:** `npm run strangler:build:production-like` + Playwright checks against local production-like `dist`.

---

## 1. New confirmed bug: duplicate IDs on four Gill pages

### Routes affected

- `/articles/dzhon-gill-chast-1-chelovek/`
- `/articles/dzhon-gill-chast-2-uchenyi/`
- `/articles/dzhon-gill-chast-3-nasledie/`
- `/articles/dzhon-gill-spravochnik/`

### Duplicate IDs confirmed in production-like `dist`

```txt
gbsTheme  x2
gbsSearch x2
```

### Source cause

Reusable component:
- `src/components/ui/floating-cluster/GillRailControls.astro`

This component hardcodes:

```html
id="gbsTheme"
id="gbsSearch"
```

and is rendered twice on each affected page:
- once in mobile head
- once in desktop rail

### Why this matters

This is invalid HTML and creates selector ambiguity for JS / tests / accessibility tooling.
Even if the visible UI sometimes still appears correct, duplicate IDs are a real bug and can produce:
- wrong element targeting,
- flaky automation,
- stale `getElementById()` assumptions,
- inconsistent behavior between desktop/mobile contexts.

---

## 2. Important distinction: some interactive-audit findings are real route bugs, some are audit-shape drift

### 2.1 Confirmed real route bugs

These remain clearly real:

- `qs is not defined` runtime crash on premium-controller routes
- Hermeneutics stray `76e7365` tail in production-like artifact
- Hermeneutics hidden Pagefind `readTime=35` vs visible `50`
- heart routes render premium buttons without loading the controller runtime
- Gill duplicate IDs (`gbsTheme`, `gbsSearch`)

### 2.2 Findings that need careful classification

`npm run interactive-audit` reported things like:
- `mobile-theme-control-not-visible` on Hermeneutics
- `mobile-theme-control-not-visible` on Gill Part I
- `gbs-rail-not-visible` / `gbs-mobile-ui-missing` on Gill context

Manual browser verification against the production-like artifact showed:

#### Hermeneutics mobile
- `#gbFcTheme` exists
- visible at mobile viewport
- bounding box non-zero (`40x40`)

#### Gill Part I mobile
- `document.getElementById('gbsTheme')` resolves to a visible `32x32` button
- but a second zero-size duplicate also exists because of duplicated IDs

#### Gill context
- route no longer uses the old GBS2 marker shape expected by some older audits
- it uses a custom v16 shell (`gbs-rail`, `mobile-bottom-bar`, custom overlays)

### Conclusion

Not every interactive-audit failure line should be treated as a direct route bug.
Some are:

1. **true route/runtime defects**, or
2. **audit contract drift / outdated selector assumptions**, especially where route archetypes evolved.

So future implementers should separate:
- real broken behavior,
- from stale audit expectations.

---

## 3. Manual visibility verification results

### Hermeneutics mobile

Visible premium theme button confirmed:

```txt
#gbFcTheme
 display=grid
 visibility=visible
 width=40
 height=40
 x=114
 y=788
```

### Gill Part I mobile

Visible button returned by `getElementById('gbsTheme')` confirmed:

```txt
display=grid
width=32
height=32
x=76
y=527...
```

But there is also a second zero-size duplicate element with the same ID.

### Nagornaya mobile

Only old `#themeToggle` path present in the inspected route world; no premium root exists there.

---

## 4. Production-like controller coverage vs premium markup coverage

### Premium controller routes with runtime crash

Confirmed `QS_ERROR` after production-like build:
- Hermeneutics
- Kod da Vinci
- 20 antisovetov
- Gill context
- Gill part 1
- Gill part 2
- Gill part 3
- Gill spravochnik
- Nagornaya parts 1–5

### Premium markup without controller runtime

Confirmed in production-like artifact:
- `/articles/krajne-li-isporcheno-serdce/`
- `/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/`

These routes have:
- `.gb-ember`
- `.gb-save`

but no loaded `floating-cluster-controller.js`.

### Practical interpretation

The repo currently has at least **three** failure classes in the premium-controls area:

1. controller loaded and crashing;
2. controller not loaded, but premium buttons already rendered;
3. duplicate-ID markup in reused Gill controls.

---

## 5. Safe prioritization note

If another agent is fixing premium-controls implementation, the least ambiguous order is:

1. fix shared controller runtime crash;
2. remove duplicate IDs from reusable Gill controls;
3. decide whether heart routes should load the controller or stop rendering premium buttons;
4. then revisit interactive-audit selector assumptions for Gill context / other custom shells.

This report intentionally applies **no code changes** and only narrows the bug taxonomy.
