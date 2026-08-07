# Full matrix consolidation — 2026-08-07

## Scope

- AuditRepo base at wave start: `265ab79cfd83ba805c385846b560878fb5593543`.
- Product current-check anchor: `87d1a3c26c61e474603b1c68b551fde9163f744a`.
- Product mutation: none.
- Production/live claim: none.
- Historical input: pre-cleanup `verified/MASTER_BUG_MATRIX.md`, 145 rows labelled open.
- Goal: make MASTER a compact working notebook of verified necessary work, not a lifetime history.

## Governance result

```text
raw evidence
→ verification / re-verification
→ enough independent witnesses for the risk
→ verified necessary work in MASTER
→ implementation / owner decision
→ result verification
→ remove from MASTER
→ legacy for useful retirement context
```

MASTER can contain defects, necessary implementations/improvements, system work, required migration/retirement, residuals and owner decisions. Optional/speculative improvement belongs in `WORK_QUEUE.md` until necessity is verified.

## Current MASTER result

Current active work is **21 work units**:

- **5** current defects;
- **3** verified necessary improvements;
- **2** narrowed residuals;
- **7** system verification / implementation packages;
- **4** owner decisions.

Closed/stale/duplicate/absorbed rows are not retained in active MASTER. Retirement mapping is `../../legacy/MATRIX_CLEANUP_2026-08-07.md`; the full pre-cleanup matrix remains recoverable from Git at AuditRepo `265ab79cfd83ba805c385846b560878fb5593543`.

## Current Product collision witness

At the verification anchor these SYSTEM owners are already active:

- #1093 — article tooltip runtime / Hermenevtika popup;
- #1095 — ReaderRail / ReaderSettings layout;
- #1096 — Reader Projection workflow linkage;
- #1097 — dependent tooltip/layout regression guards;
- #1092 — release/live-evidence control plane;
- #1090 — legacy-reference identity/inventory/ledger.

#1104 is already merged in the current anchor and corrected the interactive-tooltip physical-pointer audit transport. This wave therefore makes no competing Product mutation.

## Current defects retained

- `S-SEC-01` — current `js/enhancements.js` still uses a fixed blacklist/attribute-stripping HTML sanitizer design.
- `MAP-P1-11` — current MapEngine scale bar still derives pixel scale from configured map width / viewBox width rather than actual rendered canvas width.
- `SIG-P1-01` — current signature renderer still contains fixed map-unit offsets such as `origin.x - 74`.
- `ENGINE-P2-04` — current Karty story/toast notifications have no proven canonical live-region/status owner.
- `AR-IDX-09` — current global Search shortcut does not reject Alt/Shift-modified Ctrl/Command+K.

## Verified necessary improvements retained

- `MINI-P1-01` — current Karty minimap remains blank rectangle + dots + viewport and synchronizes by wrapping/reassigning `flyTo`; this is a current usability/ownership improvement, not taste-only polish.
- `SEARCH-P3-02` — Pagefind exposes only the first 10 results and fallback 12 even when the corpus has more matches; add truthful continuation/total ownership.
- `AR-IDX-05` — Home currently carries both numeric `SITE_CONFIG.version` and explicit asset `?v=` revision authorities; consolidate cache/version identity after checking the active legacy/reference owner.

## Narrowed residuals retained

- `MAP-P1-13` — original broad marker/panel a11y claim is mostly stale; only reduced-motion / remaining interaction semantics need a bounded current check.
- `MAP-P1-20` — route.json SW-cache half is stale; current `IshodMap.astro` still loads `../_engine/map-engine.js` without a revision, so the shared engine cache-bust residual remains real.

## System packages retained

### `SYS-KARTY-RUNTIME-GEOMETRY`

Major MapEngine repairs landed after the old audit, so historical line claims are not repair authority. Current-local Karty rows above are excluded; this package now exists only to classify the still-unchecked historical interaction/viewport/tour/panel/marker/LOD symptoms on representative current routes.

### `SYS-KARTY-DATA-PROJECTION`

Current route/schema/base-geo/generated-artifact ownership still needs one package-level current check after authored path rendering, archaeology projection integration, story-ID schema and route-inventory changes.

### `SYS-KARTY-VISUAL-LANGUAGE`

Historical P1 wording mixes correctness with visual-quality targets. Current screenshots + owner/value evidence must decide which improvements are genuinely necessary before Product work.

### `SYS-AUDIT-CONTROL-PLANE`

Retained as the current harness/workflow proof-boundary package. It absorbs any remaining generic noindex/canonical guard question; it is collision-blocked by #1092/#1096/#1097.

### `SYS-NAGORNAYA-MIGRATION`

Narrowed substantially:

- all inspected Part I–V routes currently import `NagornayaChastNMainShell`;
- the 15 extracted `HeaderHero` / `ArticleBody` / `PostContent` files still exist, so the old extraction residue is real, but exact import inventory is required before deletion;
- Parts IV–V now expose `data-pagefind-meta="scripture"`, closing that old SEO symptom;
- part footers delegate to shared `NagornayaPageFooterRuntime`, so old per-part footer-version drift is stale;
- Part I `MainShell` still carries repeated inline `Из библиотеки` color/background/style ownership;
- per-chapter TOC accent differences are not assumed to be defects without an owner requirement.

Next: exact import inventory for all 15 files, then one bounded delete-or-restore-componentization decision plus shared library-block ownership.

### `SYS-SHARED-CSS-RUNTIME-HYGIENE`

Retained for a current AST/source pass after the active reader UI work. Historical duplicate/dead-owner claims alone do not authorize edits.

### `SYS-STRANGLER-RETIREMENT`

Retained and collision-owned by Product #1090. Retirement requires replacement parity/reference authority before bounded deletion.

## Owner decisions retained

- `SEARCH-P2-07` — exact Bible corpus rights/provenance/acquisition/import publication boundary.
- `GENESIS6-ACTIVATION-OWNER-GAP` — canonical Product publication/finalizer decision.
- `REG-001` — hosting/proxy response-header strategy or accepted risk.
- `NG-VIS-04` — author/editor decision on rewriting dense structured content into prose/air.

## Important retirements established by current evidence

In addition to the first cleanup batch, this wave now removes these old open formulations from MASTER:

- `BUG-SEO-001` — current IndexNow workflow is metadata/readiness diagnostics; the historical pre-CDN submit writer race no longer exists.
- `NEW-CANONICAL-IZBRANNOE-01-GAP` — `/izbrannoe/` current source has an absolute SITE canonical; any generic harness question belongs to audit control plane.
- `AR-IDX-10` — legacy/Astro CSP divergence is reference/strangler context, not an independent route defect.
- `D-1` — no independent deploy-vs-IndexNow writer race remains under the current split ownership.
- `D-19` — current `scripts/article-headline-contract.js` requires Antisovetov `<title>` with explicit site suffix plus exact canonical headline equality across OG, Twitter, Article JSON-LD and breadcrumb; current PageHead complies.
- `NEW-OG-SIZE-PARAM` — `Seo.astro` already exposes per-route image width/height while the shared social-image owner accepts 1200×630 / 1200×675 and verifies physical image metadata fail-closed; no independent per-route-allowlist defect was demonstrated.
- `QUAL-P1-09` — false-positive semantics: `currentStatus: production-dist` is artifact/runtime presence, while holding publication semantics are independently `seo.indexable:false`.
- `SEARCH-P3-03` — canonical production permalink is a truthful result of “Скопировать ссылку”; no current requirement proves current-origin copying is preferable.

See `../../legacy/MATRIX_CLEANUP_2026-08-07.md` for retirement mapping.

## Branch forensic

Live AuditRepo refs observed at wave start:

- `main`;
- `archive/forensic-pr-3-vosk-tts-report-2026-07-24`;
- `archive/legacy-diverged-heads-20260801`.

The first archive has a unique historical Vosk TTS report plus stale README changes; do not merge it wholesale. The second consists of reviewed branch-forensic ledgers/receipts. Unique evidence must be materialized into normal retained files before either ref is retired.

## Product governance note

Current Product `AGENTS.md` §4.1 still contains the older “durable registry / close rather than remove rows” wording. No active Product PR touches `AGENTS.md`, and a one-file governance branch was prepared, but the connector write was blocked by the platform safety layer before any Product change occurred. AuditRepo canonical rules in this wave implement the owner's newer directive; the Product wording remains a known governance follow-up, not silently changed.

## Next checks

1. complete exact Nagornaya import inventory;
2. classify the remaining Karty system packages against current engine/runtime;
3. inspect shared CSS/runtime hygiene after reader owners settle;
4. materialize unique archive-branch evidence into main/legacy and retire redundant refs when preservation is proved;
5. validate this AuditRepo branch with the updated compact-matrix coverage contract before merge.