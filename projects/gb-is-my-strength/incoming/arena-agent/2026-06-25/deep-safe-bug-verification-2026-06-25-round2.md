# Deep safe bug verification — 2026-06-25 (round 2)

**Lane intent:** docs / audit / verification only.  
**No implementation fixes applied to active premium-controls lanes.**

---

## 1. Verification method

### Static scan

Performed targeted grep/python scans across:
- `src/components/article-pilots/**`
- `articles/**`
- `nagornaya/**`
- `baptisty-rossii/**`
- `dist/**` after build
- selected shared docs and runbooks

### Browser verification

Used Playwright against:
- root-like local server: `http://127.0.0.1:8090`
- `dist/` server after `npm run astro:build`
- `dist/` server after `npm run strangler:build:production-like`

### Build verification

Executed:
- `npm run astro:build`
- `npm run strangler:build:production-like`

This mattered because several route behaviors differ between raw Astro `dist` and production-like strangler artifact.

---

## 2. Confirmed bugs

## 2.1 Shared runtime bug persists across 13 production-like routes

### Symptom

`floating-cluster-controller.js` throws:

```txt
PAGE: qs is not defined
```

### Production-like routes confirmed with `QS_ERROR`

- `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- `/articles/kod-da-vinchi/`
- `/articles/20-antisovetov-pastoru/`
- `/articles/dzhon-gill-istoricheskiy-kontekst/`
- `/articles/dzhon-gill-chast-1-chelovek/`
- `/articles/dzhon-gill-chast-2-uchenyi/`
- `/articles/dzhon-gill-chast-3-nasledie/`
- `/articles/dzhon-gill-spravochnik/`
- `/nagornaya/chast-1/`
- `/nagornaya/chast-2/`
- `/nagornaya/chast-3/`
- `/nagornaya/chast-4/`
- `/nagornaya/chast-5/`

### Interpretation

This is broader than the earlier Hermeneutics/Gill-only impression. The same controller failure is confirmed on:
- single premium article pilot routes,
- Gill premium routes,
- Nagornaya routes.

---

## 2.2 Premium theme controls are visually present but functionally dead on affected routes

Browser click verification on production-like `dist` showed:

### Routes tested
- Hermeneutics
- Kod da Vinci
- 20 antisovetov
- Gill context
- Gill-related premium pages

### Result

Theme button click occurs, but:

```txt
html.dark stays false -> false
```

So the premium theme control is present but not operational where the broken controller is expected to bind behavior.

---

## 2.3 Premium save control is dead on affected routes

Browser verification on production-like `dist`:

### Routes tested
- Hermeneutics
- Kod da Vinci
- 20 antisovetov
- Gill context

### Result after click

```txt
aria-pressed: false -> false
is-saved class: false -> false
toast: false -> false
```

So the save/bookmark control is rendered but not wired.

---

## 2.4 Heart-series routes contain premium controls but do not load the premium controller at all

### Confirmed routes
- `/articles/krajne-li-isporcheno-serdce/`
- `/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/`

### Production-like verification

Both routes contain:
- `.gb-ember`
- `.gb-save`

But both routes **do not** load:
- `floating-cluster-controller.js`

### Browser click result

After clicking save + play:

```txt
savePressed stays false
emberState stays idle
toast does not appear
```

### Conclusion

This is a separate bug from `qs is not defined`.

These two heart pages are in a worse coordination state:
- premium controls are already visible in the route world,
- but the runtime controller is missing entirely,
- so the controls are inert even without a JS exception.

---

## 2.5 Hermeneutics production-like artifact still contains stray garbage tail

### Confirmed in production-like `dist`

Route:
- `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`

Check:

```txt
body.innerText includes '76e7365' -> true
```

### Source origin

- `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro`

This bug is therefore not hypothetical or source-only. It survives into the built production-like artifact.

---

## 2.6 Hermeneutics hidden read-time drift survives into production-like artifact

### Confirmed values

For `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`:

- hidden Pagefind meta: `35`
- visible byline: `50 мин`

### Conclusion

The mismatch is live in the built production-like artifact, not just in source files.

---

## 2.7 Root/legacy layer uses stale floating-cluster cache-bust hash

### Source-layer observation

Legacy/root HTML references:

```txt
floating-cluster-controller.js?v=a6bb164d
```

Count:
- **23** legacy/root pages

Production-like `dist` routes reference:

```txt
floating-cluster-controller.js?v=c78a4236
```

Count:
- **13** dist routes

### Why this matters

Even if production deploys from `dist`, the repo still treats root legacy pages as:
- rollback/source layer,
- audit/source-of-truth material,
- preview material in some manual workflows.

This means the root layer currently carries a stale cache-bust query for the shared premium-controls controller.

It is a real source-layer drift, even if not the primary production artifact bug.

---

## 3. Build / docs verification findings

## 3.1 Raw `astro:build` is not a reliable production verification command for this repo

After direct `npm run astro:build`, browser verification on `dist/` produced many 404s for legacy-dependent assets/scripts.

After `npm run strangler:build:production-like`, these 404s disappeared as a general artifact problem, while the real runtime bugs remained.

### Conclusion

For this repository, verification of the public artifact must prefer:

```txt
npm run strangler:build:production-like
```

not plain `npm run astro:build`, except for pure Astro prototype work.

---

## 3.2 Safe docs fix applied after verification

Because of the verification above, current normative docs were updated to use repo-correct commands in production/deployment contexts:

- `docs/refactor-2026/QUALITY_GATES_AND_TESTING_2026.md`
- `docs/refactor-2026/TECHNICAL_MIGRATION_RUNBOOK_2026.md`
- `docs/refactor-2026/DEPLOYMENT_SECURITY_ENV_2026.md`
- `docs/LANE_LOCK_POLICY.md` (broken local link fix)

The prototype-only Astro section in the migration runbook intentionally still uses `astro:build`.

---

## 4. Safe conclusions for non-conflicting coordination

### Highest-confidence old / non-conflicting bug buckets now verified

1. **shared premium controller runtime bug** (`qs is not defined`) affects 13 routes
2. **heart-series premium controls are rendered but unwired** on 2 routes
3. **Hermeneutics stray tail garbage** is present in production-like artifact
4. **Hermeneutics hidden read-time drift** is present in production-like artifact
5. **legacy/root cache-bust drift** exists for shared controller script
6. **production docs were partially stale** about which build command creates a real deployable artifact

### Conflict-avoidance note

No attempt was made here to fix the premium-controls implementation itself, because that overlaps with active agent work.
This round only:
- verified which bugs are real in production-like output,
- separated source-layer drift from artifact-layer bugs,
- and corrected a few old/non-conflicting docs defects.
