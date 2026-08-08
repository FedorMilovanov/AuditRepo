# Marathon Direct Defects Deep — BAPT-S12 & CATALOG — 2026-08-08

**Product anchor:** `11999f6d674e64e6afef590adeb71aeaaf303b3a` (gb main, merge #1245)  
**AuditRepo base:** `8863b36` (marathon 7 commits)  
**Verification waves prior:** `post-s12-manifest-parity-search-writer` (232 lines), `discovery-s12-catalog-search-head-recheck`, `s12-metadata-and-inflight-guard-recheck`  
**Scope:** exact current verification of the 2 remaining direct defects in MASTER (15 active: 2 direct, 3 improvements, 7 system, 3 owner)

---

## BAPT-S12-01 — Spravochnik metadata residual

### What is still public

Direct read at `11999f6d` (current main) via `verification/2026-08-08-post-s12-manifest-parity-search-writer` + `s12-metadata-and-inflight-guard-recheck`:

- File: `src/components/baptisty-rossii/BaptistyRossiiSpravochnikPageHead.astro`
- Reader-facing strings: `research-досье` and `очередь правок 3D-карты`
- Surfaces: `<meta name="description">`, `<meta name="twitter:description">`, `<meta property="og:description">`, `Article` JSON-LD `description`
- `#1238` removed 5 MDX/body S12 markers (`podpolnaya-pechat.mdx`, `sovetskaya-noch.mdx`, `BaptistyRossiiSovetskayaNochBody.astro`) — fixed
- `#1245` fixed Source Authority trigger false-negative (+4 lines `src/content/articles/**` + `src/components/baptisty-rossii/**`) — trigger closed
- Remaining = Spravochnik PageHead metadata only

### Why not fixed yet

- Search #1209 (`12896c2` behind=0) touches same PageHead (hash projections `command-palette.css@3b88813f` etc.) — collision: repairing PageHead while Search holds file risks merge conflict. MASTER correctly says `after Search releases its cache-projection touch`.
- Guard `sources:hygiene` (`scripts/source-hygiene.js` or `source-registry`) categorically excludes `*PageHead.astro` from scan → false-green. Needs `е/ё` normalization for `сохранен/сохранены локально` (see `total-current-gold-audit` 1063 lines §10) + PageHead inclusion.

### Exact closure boundary

1. Wait for #1209 merge or coordinate PageHead touch
2. Edit `BaptistyRossiiSpravochnikPageHead.astro` once: remove backstage `research-досье` / `очередь правок` wording, replace with bibliographic public description (no research file wording)
3. Run `search-manifest-policy-normalizer.js::buildManifestItem()` reconciliation (see CATALOG) — Spravochnik description will then propagate to manifest
4. Regenerate `data/search-manifest.json` + `feed.xml` + sitemap via `rss-feed-normalizer.js` / `sitemap-policy-normalizer.js`
5. Verify `dist` PageHead vs manifest vs RSS vs sitemap field parity (title/description/published/modified/image)
6. Add adversarial fixture in `sources:hygiene` for `сохранены локально` + PageHead scan

### Evidence angles

- **Source:** `BaptistyRossiiSpravochnikPageHead.astro` blob at `11999f6d` (verified via `post-s12` REPORT direct read)
- **Artifact:** `dist` PageHead description (to be verified after fix, not now)
- **Lifecycle:** #1238 + #1245 merges, no new MDX/body leak
- **Guard:** false-green proof in `total-current-gold-audit` §10

---

## CATALOG-PROJECTION-01 — hand-authored `/articles/` vs derived projection

### Current owner

- PR #1221 `0c779df` behind=2, not merge-ready. Candidate renders `title`/`description`/`image` from `data/search-manifest.json`. Media guard checks local image existence + thumbnail coverage (repaired), but not field parity.

### Root cause localized (not catalog UI)

- Canonical writer `search-manifest-policy-normalizer.js::buildManifestItem()` derives correct metadata from `dist` HTML, but `migrationCandidates()` only emits missing/promoted, `applyMigration()` skips `alreadyInManifest`
- Strict inventory `search-index-policy-inventory.js --strict` checks membership/policy, not PageHead field parity → 67/73 stale rows survive green
- Downstream: `rss-feed-normalizer.js` (RSS title/description/dates), `sitemap-policy-normalizer.js` (image/title/priority) consume manifest → discovery-chain authority

### Exact inventory (diagnostic #1237 closed unmerged, evidence only)

- 73 rows, 67 divergent: 66 title, 29 description, 4 missing image, 17 image mismatch, 16 published, 25 modified
- Missing-image: `/hard-texts/`, `/karty/`, `/karty/avraam/`, `/map/` (all have route imagery)
- Stale `ArticlesPublicationsSection` → `ArticlesLibrarySection` route profile also needs convergence

### Correct repair boundary (not hand-edit manifest)

1. Build `dist` via `strangler:build:production-like`
2. Extend `search-manifest-policy-normalizer.js::applyMigration` to reconcile `alreadyInManifest` via `buildManifestItem()` while preserving extras (`featured`/`priority`/`scripture`/`series*`/`author`/`wordCount` where present) — blind replace lossy (defaults false/0.6)
3. Add 73-row reconciliation + RSS/sitemap regeneration + adversarial stale-row test in `search-manifest-policy-normalizer-test.js` + idempotence proof
4. Keep `ArticlesLibrarySection` profile convergence in same wave
5. Verify `#1221` media guard still passes after reconciled manifest

No dedicated open PR for this reconciler yet → stays active.

---

## Synthesis

Both direct defects are **narrow, localized, and collision-aware**:

- BAPT-S12 = 1 file (`SpravochnikPageHead.astro`) + hygiene guard + downstream manifest/RSS/sitemap
- CATALOG = 1 file (`search-manifest-policy-normalizer.js`) + RSS/sitemap

They share downstream `search-manifest.json` → converge BAPT-S12 first (source metadata), then CATALOG reconciler will propagate. Do not combine with Search #1209 / Strangler / Reader waves (owner collision).

Next verification: after BAPT-S12 fix + manifest reconciler, rerun `dist` + manifest + RSS/sitemap parity at exact head.

