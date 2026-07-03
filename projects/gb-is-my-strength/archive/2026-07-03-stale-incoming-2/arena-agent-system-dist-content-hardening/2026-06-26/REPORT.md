# Agent Implementation Report — system dist/content hardening lane

## Meta
- Project: `gb-is-my-strength`
- Source repo: `https://github.com/FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent-system-dist-content-hardening`
- Date: 2026-06-26
- Branch: `lane/system-dist-content-hardening-2026-06-26-arena`
- Commit: `3ecc3dd` (force-updated after rebase onto `09c2d34`)
- Base/main observed before work: `7ac9188`
- Build mode: source/static + production-like dist
- Browser/device: Playwright Chromium mobile sample after hydration

---

## 1. Implemented fixes

### 1.1 `/map/` Pagefind/public body regression

- Fixed: added a visually hidden, semantic `data-pagefind-body` section to `src/components/map/MapBody.astro`.
- Added `.sr-only` utility inside `src/components/map/MapStyles.astro` so the visual SVG map remains unchanged.
- Result: `dist-publication-audit` no longer reports `map/index.html` missing from Pagefind required public body.

### 1.2 `/karty/avraam/` dist word-count contract

- Fixed: expanded the existing accessible/searchable text layer in `src/components/karty/avraam/AvraamMap.astro`.
- Result: `contract:compare:dist` passes. `/karty/avraam/` no longer drops below the baseline floor.

### 1.3 `/karty/ishod/` invalid JSON-LD

- Fixed: removed the extra `}` in `src/components/karty/ishod/IshodPageHead.astro` JSON-LD graph.
- Result: new dist JSON-LD parse audit passes.

### 1.4 Dist JSON-LD / dist contract deploy hardening

- Added `scripts/dist-jsonld-audit.js`.
- Added package script:
  ```json
  "dist:jsonld:audit": "node scripts/dist-jsonld-audit.js --root dist"
  ```
- Added `dist:jsonld:audit` into `strangler:audit:production-like` after `contract:compare:dist`.
- Added deploy workflow steps:
  - `contract:extract:dist && contract:compare:dist`
  - `dist:jsonld:audit`
- Hardened `scripts/check-workflows.js` so future workflow edits cannot drop those gates.

### 1.5 Public content corruption surgical fixes

- Fixed Antisovetov U+FFFD corruption in `AntisovetovBody.astro`.
- Fixed Hermeneutics typo/corrupt verse strings in Astro source and legacy HTML:
  - `кик говорят` → `как говорят`
  - `называемая , .Святое Святых"` → `называемая "Святое Святых"`
- Fixed selected MDX concatenation defects:
  - `баптистовОсобые`
  - `супралапсарианскойСупра...`
  - `КархемишеБитва`
  - `катехизисРеформатский`

### 1.6 Runtime duplicate `gtip-luxury-*` IDs

- Fixed `js/site.js` tooltip id generation to use a document-global monotonic counter:
  ```js
  window.__gbGtipLuxuryId = (window.__gbGtipLuxuryId || 0) + 1
  ```
- Result: Playwright sample routes no longer show hydrated duplicate tooltip IDs.

### 1.7 Cache-bust after `site.js` change

- Ran `node scripts/cache-bust.js` after modifying `js/site.js`.
- Root HTML `?v=` references updated to new `site.js` hash.

---

## 2. Verification evidence

### Source/static gate

Evidence: `evidence/01-static-publication-light-pass.log`

Result:
```text
npm run validate:static-publication:light ✅
```

### Content corruption probes

Evidence: `evidence/02-content-corruption-probes-clean.log`

Result: no remaining hits for:
- U+FFFD replacement character;
- `кик говорят`;
- `называемая , .Святое`;
- selected MDX concatenation patterns.

### Dist contract + JSON-LD + publication audit

Evidence: `evidence/03-dist-contract-jsonld-publication-pass.log`

Result:
```text
contract:compare:dist ✅
dist:jsonld:audit ✅
dist-publication-audit --require-pagefind --forbid-dev ✅
dist:css-parity ✅
```

### Workflow and lane guard

Evidence: `evidence/04-workflows-guard-pass.log`

Result:
```text
workflows:check ✅
guard:shared-files ✅
```

### Runtime duplicate-id sample

Evidence: `evidence/05-runtime-duplicate-id-sample-pass.log`

Routes sampled:
- `/articles/dzhon-gill-chast-1-chelovek/`
- `/articles/krajne-li-isporcheno-serdce/`
- `/baptisty-rossii/noch-na-kure/`
- `/map/`
- `/karty/avraam/`
- `/karty/ishod/`

Result: all sampled routes have:
```json
"dup": [], "gtipDup": []
```

---

## 3. What remains intentionally out of scope

These were verified earlier but **not fixed in this lane** to avoid conflicts with the parallel feature agent and to keep the lane focused:

1. Heart-series PremiumControls ownership/wiring:
   - `/articles/krajne-li-isporcheno-serdce/`
   - `/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/`
2. Baptisty structured data and OG image replacement:
   - 10 article pages need `BreadcrumbList` and Article dates;
   - 11 pages still use SVG OG images.
3. Migration metadata contract hardening:
   - undefined `strict-native-app` mode;
   - route-profile/matrix mismatches.
4. Full public 43-route runtime crawl after the fix was not rerun in this lane; a representative sample was verified.

---

## 4. Branch / push status

Branch pushed to source repo:

```text
origin/lane/system-dist-content-hardening-2026-06-26-arena
```

Commit:

```text
3ecc3dd [LANE lane/system-dist-content-hardening-2026-06-26-arena] harden dist contract jsonld and content
```

---

## 5. Recommended next steps

1. Merge this system lane after any parallel feature branch coordination.
2. Re-run on merged main:
   ```bash
   npm run validate:static-publication:light
   npm run strangler:audit:production-like  # under Node 22
   ```
3. Then open separate lanes for:
   - PremiumControls heart-series wiring;
   - Baptisty structured data/OG assets;
   - migration metadata hardening.
