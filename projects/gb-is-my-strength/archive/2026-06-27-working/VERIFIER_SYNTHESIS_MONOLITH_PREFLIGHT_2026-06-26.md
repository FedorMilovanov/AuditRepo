# Verifier Synthesis — Monolith Preflight — 2026-06-26

## Meta
- Project: `gb-is-my-strength`
- Verifier role: AuditRepo-only synthesis / no new source branches in this step
- AuditRepo HEAD used: `6abf811` + local evidence correction for integration report
- Source repo current main: `09c2d34`
- Best integration candidate branch: `lane/integration-monolith-preflight-2026-06-26-arena`
- Best integration candidate commit: `51a0bc43`

---

## Executive verdict

The strongest current path toward the owner goal — **"единый монолит, не 100 линий"** — is to treat:

```text
lane/integration-monolith-preflight-2026-06-26-arena
```

as the **single integration candidate** for the system/SEO/runtime repair wave.

It combines the important parallel lanes, resolves the Baptisty SEO collision, and has focused evidence for:

- dist URL contract passing;
- dist JSON-LD passing;
- dist publication audit passing;
- migration metadata passing;
- Baptisty visual parity smoke passing;
- runtime sample with no duplicate tooltip ids;
- Baptisty structured data/OG image issues fixed in the integrated artifact.

This synthesis is **not** a source-code change and does not open another source branch.

---

## 1. Branch status / merge recommendation

### Recommended primary merge candidate

| Branch | Commit | Recommendation | Why |
|---|---:|---|---|
| `lane/integration-monolith-preflight-2026-06-26-arena` | `51a0bc43` | **Merge candidate / owner-integrator review** | Combines the system repair lanes and resolves duplicate Baptisty SEO work into one tested candidate. |

### Branches already represented inside the integration candidate

If the integration branch is accepted, these branches should be considered **absorbed / superseded by integration**, not merged separately afterward:

| Branch | Included in integration? | Notes |
|---|---:|---|
| `lane/system-cache-bust-astro-source-2026-06-26` | ✅ | Systemic cache-bust root-cause fix. |
| `lane/karty-ishod-jsonld-2026-06-26` | ✅ | Ishod JSON-LD source fix. |
| `lane/content-text-corruption-2026-06-26` | ✅ | Public text corruption fix; integration chose cleaner Antisovetov resolution. |
| `lane/baptisty-seo-breadcrumb-ogimage-2026-06-26` | ✅ | Minimal Baptisty SEO lane used as canonical. |
| `lane/premiumcontrols-heart-series-wiring-2026-06-26` | ✅ | Heart-series Play/Save wiring. |
| `lane/system-dist-content-hardening-2026-06-26-arena` | ✅ | Dist contract/JSON-LD/Pagefind/runtime id hardening. |
| `lane/system-migration-metadata-hardening-2026-06-26-arena` | ✅ | Migration metadata mode/profile hardening. |

### Branches NOT recommended for direct merge into current wave

| Branch | Recommendation | Reason |
|---|---|---|
| `lane/baptisty-seo-structured-og-2026-06-26-arena` | **Do not merge; duplicate/superseded** | AuditRepo conflict `C-BAPT-01`: broad duplicate of Baptisty SEO work; integration branch used the narrower lane and then completed dates/graph consolidation. |
| `lane/baptisty-content-expansion-2026-06-25` | **Do not merge in this wave** | Unrelated-history/high-risk content expansion lane; requires separate owner/editorial review. |
| `lane/audit-svg-pilot-bugs-2026-06-25` | **Do not merge in this wave** | Unrelated-history/high-risk visual/audit lane; separate review. |
| `lane/premiumcontrols-playember-semantics-2026-06-26` | **Separate feature follow-up** | PC-005 is valuable and browser-verified, but it was not part of integration candidate and merge-tree shows conflicts with the integration branch in generated/root HTML. Rebase after integration if owner wants it next. |

---

## 2. Conflict resolution: C-BAPT-01

AuditRepo conflict:

```text
verification/conflicts/CONFLICT_REGISTRY_2026-06-26-baptisty-seo.md
```

### Resolution chosen in integration branch

- Use `lane/baptisty-seo-breadcrumb-ogimage-2026-06-26` as the canonical Baptisty SEO source.
- Exclude the broader duplicate `lane/baptisty-seo-structured-og-2026-06-26-arena`.
- Add an integration commit to complete missing article dates and consolidate `BreadcrumbList` into the main `@graph`.

### Final integrated Baptisty state

Evidence file:

```text
incoming/arena-agent-integration-monolith-preflight/2026-06-26/evidence/06-baptisty-structured-pass.log
```

Result after correction:

```text
missingDates: 0
missingBL: 0
standaloneBL: 0
svg: 0
nonWebp: 0
jsonErrors: 0
```

This resolves S3-N1/S3-N2/PFV-004 in the integration candidate.

---

## 3. Evidence summary for integration branch

AuditRepo intake:

```text
incoming/arena-agent-integration-monolith-preflight/2026-06-26/
```

### Guard / metadata

- `01-guard-pass.log` — `guard:shared-files` passed.
- `02-migration-metadata-pass.log` — `migration:metadata:check:strict` passed.

### Dist artifact

- `03-dist-contract-jsonld-publication-pass.log` confirms:
  - `contract:compare:dist` passed;
  - `dist:jsonld:audit` passed;
  - `dist-publication-audit --require-pagefind --forbid-dev` passed;
  - `dist:css-parity` passed.

### Visual smoke

- `04-baptisty-visual-parity-pass.log` confirms:
  - `/baptisty-rossii/` desktop/mobile within threshold;
  - `/baptisty-rossii/noch-na-kure/` desktop/mobile within threshold.

### Runtime sample

- `05-runtime-sample-pass.log` confirms sampled routes have:
  - no console errors;
  - no duplicate runtime `gtip-luxury-*` ids;
  - heart-series controls now have `fcRoot=true`;
  - `/map/` and `/karty/avraam/` Pagefind bodies are present.

### Baptisty structured data / OG

- `06-baptisty-structured-pass.log` confirms final integrated Baptisty state (dates, BreadcrumbList, WebP OG, no standalone BreadcrumbList, no JSON errors).

---

## 4. Canonical status recommendations

### Promote to fixed-current if integration candidate is merged

| Finding family | Suggested status after merge | Evidence |
|---|---|---|
| S3-N4 / PC-003 / P0-10 cache-bust root cause | `fixed-current` | integration includes `system-cache-bust-astro-source`; postbuild drift eliminated in source branch evidence. |
| S3-N5 / P0-02 / PFV-002 Ishod JSON-LD | `fixed-current` | dist JSON-LD audit passes in integration evidence. |
| CHV-003 / CHV-004 content corruption | `fixed-current` | content corruption lanes integrated; probes clean in source branch evidence. |
| S3-N1/S3-N2/PFV-004 Baptisty SEO/OG | `fixed-current` | final integration `06-baptisty-structured-pass.log`. |
| PC-002 heart-series Play/Save wiring | `fixed-current` | integration runtime sample shows `fcRoot=true` for Krajne/Rimlyanam. |
| PFV-005 runtime duplicate `gtip-luxury-*` ids | `fixed-current` | integration runtime sample shows no duplicate ids. |
| PFV-001 Avraam word-count dist contract | `fixed-current` | `contract:compare:dist` passes in integration evidence. |
| LHV-001 `/map/` Pagefind body loss | `fixed-current` | `dist-publication-audit` passes; runtime sample has `/map/` words. |
| PFV-007/LHV-008 migration metadata mismatch | `fixed-current` | migration strict + independent correction integrated. |
| PFV-008/LHV-009 deploy dist gate blind spot | `fixed-current` | integration includes `dist-jsonld-audit` and workflow guard hardening. |

### Keep open / future feature work

| Item | Status | Reason |
|---|---|---|
| PC-001 PremiumControlAnchor architecture | open / feature architecture | Not part of integration branch; owner-level feature decision. |
| PC-004 canonical PremiumControls CSS source | open / cleanup after feature completion | Feature-first principle; avoid CSS consolidation during integration wave. |
| PC-006 route-archetype rollout audit | open / governance | Needs separate audit script/contract. |
| `premiumcontrols-playember-semantics` PC-005 | fixed on its own branch, not integrated | Needs rebase/merge after integration if owner wants this feature polish next. |
| Baptisty content expansion | open / editorial | Separate content lane; not system repair. |
| audit-svg pilot bugs | open / separate visual/audit lane | Unrelated-history/high-risk; separate owner review. |

---

## 5. Recommended next action

### If owner wants one monolithic merge candidate

Open/merge review for:

```text
lane/integration-monolith-preflight-2026-06-26-arena
```

Then run on merged main:

```bash
npm run validate:static-publication:light
npm run workflows:check
npm run guard:shared-files
```

And under Node 22 production-like environment:

```bash
npm run strangler:audit:production-like
npm run visual:parity:screenshots -- --routes /baptisty-rossii/,/baptisty-rossii/noch-na-kure/,/map/,/karty/avraam/,/karty/ishod/ --threshold 1.0
```

### If owner wants smaller merges

Use this order:

1. `system-cache-bust-astro-source`
2. `karty-ishod-jsonld`
3. `content-text-corruption`
4. `baptisty-seo-breadcrumb-ogimage`
5. `premiumcontrols-heart-series-wiring`
6. `system-dist-content-hardening-2026-06-26-arena`
7. `system-migration-metadata-hardening-2026-06-26-arena`
8. Final integrator commit equivalent to `51a0bc43` for Baptisty graph/date consolidation.

But the preferred path is the integration branch because it already resolved the cross-branch collision.

---

## 6. Notes for future agents

- Do not merge both Baptisty SEO branches. Use integration candidate or minimal lane + integration consolidation only.
- Do not treat source/static green as enough; dist contract, dist JSON-LD, Pagefind, and runtime hydration checks must remain part of release truth.
- Avoid new repair branches unless owner asks. At this point the priority is verification, integration review, and final status synthesis.
