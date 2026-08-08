# Marathon Improvements & Owner Decisions Deep — 2026-08-08

**Product anchor:** `11999f6d674e64e6afef590adeb71aeaaf303b3a` (gb)  
**Research anchor:** `d52ea9d54dd2c2488223d25f5f6cefd263c23328` + `c1bab60d18c7e824605ee6397f2218a30519dc91` (Agent 06 projection queue)  
**AuditRepo base:** `7558fe6` (marathon 8 commits)  
**Scope:** 3 verified necessary improvements + 3 owner decisions (15 active: 2 direct already covered, 7 system already covered)

---

## Improvements — exact current boundaries at `11999f6d`

### SEARCH-P3-02 — One truthful continuation contract

- Owner #1209 `12896c2` behind=0 (contains `11999f6d`), transport gone per current main diff (old self-writing `search-stale-interaction-finalizer.yml` + `scripts/...finalizer.mjs` absent), but PR body stale `1f14761a`/`882d904`
- Scope: 5 semantic Search/test owners + deterministic hash projections `command-palette.css@3b88813f` `search.js@027c3f4f`, sampled PageHead/Chrome/Footer/Body consumers hash-only, Spravochnik backstage metadata unchanged
- Evidence: Search Modal SUCCESS + Search Scripture Occurrence Runtime SUCCESS + Shared Files/Node Toolchain/Metadata + multiple source/readiness gates SUCCESS at latest check; overall suite non-terminal (several workflows queued/pending)
- Repair remains: refresh PR body to actual final SHA/scope + verify remaining broad consumer touches as deterministic projections + await terminal exact-head green full suite (not just Modal)
- No mega-PR with catalog/strangler/reader — keep bounded

### AR-IDX-05 — Per-asset revision authority

- Canonical hashes exist: `src/lib/asset-version.js` owns per-asset revision, but `BaseLayout.astro` seeds `SITE_CONFIG.version` from `ASSET_VERSIONS['js/glossary.js']` (generic glossary identity)
- Consumers `js/enhancements.js` → `/css/enhancements-runtime.css?v=` + `js/highlights.js` → `/css/highlights-runtime.css?v=` use `window.SITE_CONFIG.version` (semantic mismatch: one generic value for two different CSS assets)
- `js/site.js` + `js/glossary.js` don't use generic version → problem is loader semantic, not glossary consumer
- Repair: give each runtime CSS explicit per-asset authority (via `asset-version.js` hashes) or remove generic bridge, preserve authority-aware projection rules, prove `enhancements-runtime` vs `highlights-runtime` distinct revisions

### AUDIT-JS-ESCAPER-DUP-X5 — 5 local escapers

- 5 separate `& < > "` escapers: 3× lexical helpers in `js/site.js`, 1× `js/highlights.js`, 1× `js/search.js`
- No canonical `site-utils.js` primitive yet
- Repair: add one shared HTML-escaping primitive in `site-utils.js`, migrate 5 call sites preserving loader availability + output/context semantics (especially Highlights context), add permanent regression that `site.js`/`highlights`/`search` no longer own duplicate escapers

---

## Owner decisions — fail-closed until explicit

### SEARCH-P2-07 — Bible corpus rights / policy reconciliation

- Authority: Research PR #149 merge `d52ea9d` (66-book registry) but per-record `sourceUrl`/`rights` incomplete → full-corpus publication blocked
- Candidate: CrossWire `RusSynodal` 1.9.1 institutional `Public Domain` → `CANDIDATE_ONLY` (archive not acquired/hashed/mapped in wave `verification/2026-08-06-bible-corpus-rights-wave` 31223124246 artifact)
- Blocked: `RusSynodalLIO` requires downstream permission, Cassian permission-controlled (must not expand from open-web copies)
- Research projection queue (Agent 06 `c1bab60`): 10 corpus records, `PROMOTE=0`, `REFERENCE=3`, `BLOCKED=7` (holds: EVIDENCE_HOLD, LOCATOR_HOLD, ARCHIVE_HOLD, RIGHTS_HOLD, PUBLICATION_HOLD), 7 physical-rights records, 7 already on public routes but not promoted, 0 Product writes authorized
- Policy conflict still open: Charter S9 Synodal default vs Content Quality annex NT Cassian / OT Synodal → owner must decide: default translation, grandfathering, new-verse rule, rights authority, Cassian disposition, canonical version/checksum, Charter/annex convergence
- **Disposition:** remain `owner-decision`, no permission-unproven corpus expansion, no Product mutation until `PROMOTE` record exists with route/claim boundary + SHA-256 + embedded licence + 66-book mapping + verse-level import receipt

### REG-001 — Hosting/proxy response headers

- Decision: hosting/proxy for CSP / X-Frame / Referrer / Permissions headers, or explicit `accepted-risk`
- No source change, not security defect (CSP variants already 12 unique policies with `'unsafe-inline'` per SUPER_AUDIT 14a49be8) — remains owner decision, not code fix until hosting decision

### NG-VIS-04 — Nagornaya dense material rewrite

- Author/editor decision: dense table/card material in Nagornaya (5 parts) rewritten into more prose/air
- Not engineering defect — editorial density preference. Keep as owner decision until editorial review says dense structured content stays or prose rewrite.

---

## Evidence completeness

- All 3 improvements have strong direct source witnesses (file + line) + PR owner where applicable + no closed row in MASTER
- All 3 owner decisions have Research/production authority + explicit `PROMOTE=0` or `no Product mutation` guard
- No `LEGACY-ONLY-ACTIVE` or `ORPHAN` — `matrix_coverage` evidence files 349, historical 651, PASS

Next bounded wave: SEARCH-P3-02 body refresh → AR-IDX-05 per-asset migration → AUDIT-JS escaper primitive — each separate PR, not combined.

