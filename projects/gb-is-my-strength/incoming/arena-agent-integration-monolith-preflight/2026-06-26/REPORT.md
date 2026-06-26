# Agent Integration Report — monolith preflight branch

## Meta
- Project: `gb-is-my-strength`
- Source repo: `https://github.com/FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent-integration-monolith-preflight`
- Date: 2026-06-26
- Integration branch: `lane/integration-monolith-preflight-2026-06-26-arena`
- Source branch commit: `51a0bc43`
- Base: `origin/main` at `09c2d34`
- Build mode: local integration branch combining multiple already-pushed lanes

---

## 1. What was integrated

Merged into the integration branch:

1. `origin/lane/system-cache-bust-astro-source-2026-06-26`
   - cache-bust now rewrites `src/*.astro` too; closes systemic hash drift engine.
2. `origin/lane/karty-ishod-jsonld-2026-06-26`
   - fixes `/karty/ishod/` JSON-LD source.
3. `origin/lane/content-text-corruption-2026-06-26`
   - fixes public content corruption in Antisovetov/Hermeneutics.
4. `origin/lane/baptisty-seo-breadcrumb-ogimage-2026-06-26`
   - minimal Baptisty SEO lane: BreadcrumbList + WebP OG assets.
5. `origin/lane/premiumcontrols-heart-series-wiring-2026-06-26`
   - fixes heart-series Play/Save wiring (`data-fc-root`).
6. `origin/lane/system-dist-content-hardening-2026-06-26-arena`
   - dist contract hardening, Avraam accessible body, map Pagefind body, dist JSON-LD audit, runtime tooltip ID fix.
7. `origin/lane/system-migration-metadata-hardening-2026-06-26-arena`
   - migration mode/profile guard hardening.

Then added one integration-only commit:

```text
51a0bc43 [LANE lane/integration-monolith-preflight-2026-06-26-arena] consolidate baptisty jsonld graph dates
```

That commit resolves the Baptisty collision by keeping the minimal-scope Baptisty SEO lane but consolidating its separate `BreadcrumbList` scripts into the main `@graph` and adding `datePublished/dateModified` to article JSON-LD.

---

## 2. Conflict resolution

### Baptisty SEO collision (`C-BAPT-01`)

AuditRepo already flagged two parallel Baptisty SEO lanes:

- `lane/baptisty-seo-breadcrumb-ogimage-2026-06-26` — minimal SEO lane by session3.
- `lane/baptisty-seo-structured-og-2026-06-26-arena` — broader lane touching bodies/MDX/data/map.

Integration decision:

- Use the **minimal session3 lane** as canonical source for WebP assets + PageHead OG/Breadcrumb changes.
- Do **not** merge the broader duplicate `structured-og-arena` lane.
- Add a small integration commit to complete dates and `@graph` structure.

Result after dist build:

```text
missingDates: 0
missingBL: 0
standaloneBL: 0
svg: 0
jsonErrors: 0
```

Evidence: `evidence/06-baptisty-structured-pass.log`.

### Antisovetov content conflict

`content-text-corruption` and `system-dist-content-hardening` both edited the same corrupted paragraph.
Resolution used the cleaner content-text version:

```text
Настоящая сломленность не просит сохранить трон.
```

with the practical example preserved in the note-box below it. This avoided reintroducing mojibake from the broader lane.

---

## 3. Verification results

### Shared guard

Evidence: `evidence/01-guard-pass.log`

```text
npm run guard:shared-files ✅
```

### Migration metadata

Evidence: `evidence/02-migration-metadata-pass.log`

```text
npm run migration:metadata:check:strict ✅
```

### Dist contract / JSON-LD / publication

Evidence: `evidence/03-dist-contract-jsonld-publication-pass.log`

```text
contract:compare:dist ✅
dist:jsonld:audit ✅
dist-publication-audit --require-pagefind --forbid-dev ✅
dist:css-parity ✅
```

### Baptisty visual parity smoke

Evidence: `evidence/04-baptisty-visual-parity-pass.log`

```text
/baptisty-rossii/ desktop/mobile ✅
/baptisty-rossii/noch-na-kure/ desktop/mobile ✅
```

### Runtime sample

Evidence: `evidence/05-runtime-sample-pass.log`

Routes sampled:

- `/articles/dzhon-gill-chast-1-chelovek/`
- `/articles/krajne-li-isporcheno-serdce/`
- `/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/`
- `/baptisty-rossii/noch-na-kure/`
- `/map/`
- `/karty/avraam/`
- `/karty/ishod/`

Result:

```text
no console errors
no duplicate runtime ids in sample
heart-series controls now have fcRoot=true
Avraam pagefindWords=669
Map pagefindWords=130
```

### Baptisty structured data / OG

Evidence: `evidence/06-baptisty-structured-pass.log`

```text
missingDates: 0
missingBL: 0
standaloneBL: 0
svg: 0
jsonErrors: 0
```

---

## 4. Remaining caveats

1. The integration branch passed focused dist/runtime checks, but a final integrator should still run full CI after merge to main.
2. This preflight branch is intentionally a composition branch. Individual lanes remain useful as review units if the owner wants smaller PRs.
3. PremiumControls architecture work (`PremiumControlAnchor`, canonical CSS source) remains feature-level future work; this integration only includes heart-series wiring and runtime ID correctness.
4. Baptisty body images remain visually equivalent and parity-smoked. The SEO/social images are WebP and structured data is consolidated into `@graph`.

---

## 5. Source branch

Pushed source branch:

```text
origin/lane/integration-monolith-preflight-2026-06-26-arena
```

Current source branch commit:

```text
51a0bc43 [LANE lane/integration-monolith-preflight-2026-06-26-arena] consolidate baptisty jsonld graph dates
```

This is the current best “monolith preflight” candidate: it combines the parallel lanes, resolves the Baptisty collision, and passes the focused gates above.
