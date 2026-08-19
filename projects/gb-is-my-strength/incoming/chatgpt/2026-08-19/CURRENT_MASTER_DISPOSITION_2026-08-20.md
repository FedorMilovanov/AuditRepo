# Current MASTER disposition — Product `01894214765d7ab6e51a7eea1fb7f239c6591af8`

## Purpose

Verifier-oriented reduction pass over the **13 active rows** currently present in `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`.

This file does **not** mutate MASTER. Concurrent matrix/consolidation PRs exist, so this pass records current dispositions and evidence boundaries only.

Primary current Product boundary:

```text
01894214765d7ab6e51a7eea1fb7f239c6591af8
```

The current MASTER is anchored to older Product `cb3681e`. Product movement from the local/current-equivalent snapshot through `01894214...` touched notifier / dist-CSS admission / CSS-layer validator owners, not the Product owners below. Where a row historically relied on a live-production measurement, this pass does not invent a new live timestamp; it distinguishes source-currentness from the older live witness.

## Recommended compact disposition

| Current MASTER row | Recommendation | Current reason |
|---|---|---|
| `RODOSLOVIYE-OG-IMAGE` | **KEEP** | Current Rodosloviye head owner remains unchanged; the OG identity mismatch is independent of the recent CI/CSS-validator movement. Existing source/live/artifact evidence remains applicable absent owner movement. |
| `GENEALOGY-NO-ERROR-BOUNDARY` | **KEEP, NARROW** | Current tree is `client:only="react"` inside an 85vh/min-650px region with no SSR/fallback/error recovery. Native page summary/prose survives outside the island. Reword as interactive-island fault containment; do not claim whole-page blanking or a reproduced natural crash. |
| `EDITORIAL-LABEL-INCONSISTENCY` | **KEEP under metadata root** | Current Header/site metadata owners did not change. The direct label mismatch remains a concrete manifestation of `METADATA-SSOT-PROLIFERATION`; verifier may keep one named public manifestation if that is useful, but it should not become a second independent repair owner. |
| `SECURITY-CSP-INCONSISTENCY` | **REMOVE as independent direct row; ABSORB** | MASTER already says this is a named symptom of `FRAGMENTED-SECURITY-OWNERSHIP`. Operating model normally removes absorbed symptom rows. New forensic evidence also shows the current security root must distinguish CSP-meta ownership from transport `X-Content-Type-Options`; one unified HTML head cannot own both. |
| `RSS-SERIES-DATE-COLLAPSE` | **KEEP as concrete public-artifact manifestation** | It remains the strongest measurable external/public consequence of `METADATA-SSOT-PROLIFERATION`: feed date source differs from page editorial date authority. Recent Product movement did not touch these owners. Keep as one public artifact manifestation while the system root owns the repair. |
| `APP-MASK-NO-WEBKIT-FALLBACK` | **KEEP** | Recent Product movement did not touch `/app/` / MapStyles CSS owners. This is a bounded compatibility defect, independent of the new systemic findings. |
| `SECURITY-CSP-GAPS` | **REMOVE as independent direct row; ABSORB/NARROW into security root** | Current postbuild already supplies CSP to published artifacts for routes whose source head lacks it; the active issue is fragmented source→artifact security ownership, not an independently broken live CSP surface. Do not count the same root three times. |
| `SW-PWA-FRESHNESS` | **REVERIFY for absorption into broader SW lifecycle root; do not close from this pass alone** | Existing row is a latent bare-precache/unversioned-request risk. New evidence proves a stronger but distinct root-worker generation authority failure (fragmented script identity + non-isolated cache rollback). Verifier should decide whether the bare entry is another manifestation of the same SW authority package or remains an independent narrowed residual. Do not claim it is currently exercised: historical live evidence says current pages request revisioned JS. |
| `AR-IDX-JS-02-MULTIWRITER` | **RETIRE / ABSORBED BY CANONICAL COMPATIBILITY BRIDGE** | Source still has physical legacy `theme` writes, but current behavior intentionally mirrors through canonical `gb:reader-preferences:v1`, reconciles same-document legacy clicks, protects Sepia cross-tab state, and has a wired Shared Files regression. No current behavioral divergence was demonstrated. Physical old-key cleanup belongs in Work Queue. |
| `MISSING-BUTTON-TYPE` | **MOVE OUT OF active Product defects/residuals unless owner explicitly treats preventive hardening as required** | Current source does contain missing `type=` buttons, but historical live witness found zero inside forms and the risk is future/latent. Moreover the claimed exhaustive 20-file/47-instance evidence is false; the same anchor already contained two omitted TSX buttons and the declared scan now reproduces 22 files/49 hits. If fixed, use a durable scanner and zero-hit contract; do not cite 47 as complete current authority. |
| `SITEWIDE-BTN-TYPE-AUDIT` | **RETIRE active system lane; replace with durable scanner only if preventive cleanup is selected** | The lane says “full sitewide scan completed” but its exhaustive result is disproved. It is not a current runtime system defect; it is an audit-evidence-quality failure plus optional preventive cleanup. The new `SITEWIDE-BTN-TYPE-AUDIT-FALSE-COMPLETENESS` evidence belongs under `ST-AUDIT-HARNESS`. |
| `METADATA-SSOT-PROLIFERATION` | **KEEP system root** | Still explains Header label divergence, RSS/page date authority split and broader editorial projection debt. Avoid reopening dead `ArticleLayout` carriers; current owners are active metadata/series/feed/search producers. |
| `FRAGMENTED-SECURITY-OWNERSHIP` | **KEEP, REFRAME owner model** | Keep one security system root, but do not define closure as “one unified security head emits CSP + X-Content-Type-Options.” CSP can be centralized in HTML/meta/postbuild; `nosniff` requires a response-header/hosting/deploy owner. Closure must prove both layers separately and reconcile source→artifact policy. |

## Row-count consequence before admitting any new work

If verifier accepts the strongest reductions above:

- retire `AR-IDX-JS-02-MULTIWRITER`;
- remove absorbed direct `SECURITY-CSP-INCONSISTENCY`;
- remove absorbed direct `SECURITY-CSP-GAPS`;
- move `MISSING-BUTTON-TYPE` out of active Product work unless preventive hardening is explicitly selected;
- retire the false-complete `SITEWIDE-BTN-TYPE-AUDIT` system lane;

then the old 13-row MASTER shrinks materially **before** considering the seven new forensic work units.

This is the intended AuditRepo operating model: new evidence should replace/absorb stale or duplicate work, not merely increase a backlog counter.

## Detailed reverify notes

### 1. Genealogy is a real but narrower resilience boundary

Current route composition:

```astro
<div id="genealogy-tree" style="height: 85vh; min-height: 650px; ...">
  <GenealogyTree client:only="react" ... />
</div>
```

No local React error boundary or Astro fallback was found. But `RodosloviyeBody` already renders breadcrumb, heading, summary and explanatory native prose independently. The accurate current contract is “interactive island has no failure presentation,” not “the whole page blanks.”

Companion evidence: `GENEALOGY_ISLAND_FAULT_BOUNDARY_REVERIFY.md`.

### 2. Theme multiwriter is now coordinated compatibility, not demonstrated conflict

Current canonical owner:

```text
gb:reader-preferences:v1
```

Current design explicitly mirrors the legacy binary `theme` key, reconciles legacy clicks into canonical state and handles cross-tab canonical/compatibility events. All 20 current Astro route graphs that actually load `site.js`/`enhancements.js` script carriers also resolve `ReaderPreferencesHead`; canonical first-paint bootstrap precedes the deferred compatibility writers.

Current source regression passes on the current-equivalent tree:

```text
reader preference foundation guard passed (72 Astro heads, 54 legacy documents)
ReaderState regression ... passed
```

and the regression is a required Shared Files Guard step.

Companion evidence: `THEME_MULTIWRITER_CURRENT_REVERIFY.md`.

### 3. Button count/closure authority must be corrected before repair

The current MASTER states 20 files / 47 instances and a completed exhaustive 543-file scan. Exact historical witnesses show two additional missing-type buttons in `SplitView.tsx` and `DetailPanel.tsx` at that same anchor. Re-running the declared scope/regex on source-equivalent current code yields 22 files / 49 tags.

This does not create two more user bugs. It invalidates the **completeness oracle** used by the active lane.

If owner elects preventive cleanup, closure should require a repository-owned deterministic scanner over the intended extensions and an exact zero-hit assertion, not a prose list.

### 4. Security needs two enforcement layers

Current source heavily uses:

```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
```

but `nosniff` is transport/header semantics, not an HTML meta pragma. Current postbuild has a real CSP-meta owner; an Astro endpoint such as `/js/atlas-runtime.js` demonstrates how a real `X-Content-Type-Options` response header is emitted when the application owns the Response.

No current repository admission step was found that measures deployed page response headers for nosniff, and this pass did not capture live transport headers. Therefore the system root should require a distinct hosting/response-header witness rather than pretending an HTML head component can satisfy the transport contract.

Companion evidence: `SECURITY_NOSNIFF_OWNER_LAYER.md`.

## Relationship to the seven new forensic work units

This disposition intentionally does not auto-admit the new units into MASTER. Verifier should synthesize them with existing roots first.

Likely systemic packages rather than symptom rows:

1. Scripture occurrence representation/oracle;
2. Audit exhaustive/cardinality integrity (button evidence + browser zero-worker fail-open may remain separate if owners differ materially);
3. Security policy ownership split;
4. Root Service Worker generation authority;
5. Article legacy-capability partial migration;
6. TTS SharedWorker client lifecycle;
7. any remaining local/current findings after deduplication.

The final MASTER may therefore remain compact even if the evidence package is large.

## No-edit boundary

- No MASTER counts are changed in this branch.
- No competing Product repair is opened.
- Rows relying on previous live observations are not given a fabricated new live timestamp.
- Concurrent AuditRepo matrix owners should consume this as verifier input, not overwrite it wholesale.
