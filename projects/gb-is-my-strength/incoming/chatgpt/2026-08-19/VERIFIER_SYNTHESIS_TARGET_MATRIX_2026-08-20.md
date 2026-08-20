# Verifier synthesis — target matrix — 2026-08-20

## Identity

- Project: `gb-is-my-strength`
- Audited anchor: Product `main` `b8b9029a95c08e85b7353da76c11d18f677c591b`
- Forensic evidence base: PR #344, branch `audit/gb-chatgpt-oracle-forensics-20260819`
- Product mutation: none
- MASTER mutation: none
- Role: verifier/consolidation input only

## Purpose

The current `MASTER_BUG_MATRIX.md` still carries 13 rows anchored to older Product `cb3681e`. The forensic intake in PR #344 adds eight current system-level work units, but those eight must **not** be appended mechanically to the old 13.

This synthesis applies the AuditRepo rule that symptoms, superseded residuals and duplicate verification lanes should be absorbed into the causal owner that actually needs repair and closure.

The proposed compact target is **12 independent active work units**:

- **3 bounded direct defects**;
- **9 system/root work packages**.

This is a verifier proposal, not a direct edit to MASTER.

## Proposed target matrix — 12 independent units

### Bounded direct defects — 3

| Proposed row | Disposition | Why it remains independent |
|---|---|---|
| `RODOSLOVIYE-OG-IMAGE` | **KEEP** | Current Rodosloviye head still publishes the Karty OG/Twitter image. This is a concrete wrong public asset identity and is not proved to share the same causal repair as the broader metadata date/label authority package. |
| `GENEALOGY-NO-ERROR-BOUNDARY` | **KEEP, NARROW** | Keep only as `client:only="react"` interactive-island fault containment: no local error boundary/fallback/recovery. Native breadcrumb/H1/summary/prose remain outside the island, so do not claim whole-page blanking. |
| `APP-MASK-NO-WEBKIT-FALLBACK` | **KEEP** | Bounded compatibility defect in App/Map mask styling; independent of the systemic roots below. |

### System/root work packages — 9

| Proposed row | Disposition | Absorbs / owns |
|---|---|---|
| `METADATA-SSOT-PROLIFERATION` | **KEEP, EXPAND CLOSURE** | Owns current editorial label divergence and RSS/page/date projection divergence. Absorb `EDITORIAL-LABEL-INCONSISTENCY` and `RSS-SERIES-DATE-COLLAPSE` as manifestations/closure witnesses instead of separate repair rows. Closure must prove one editorial authority feeding Header/page metadata/search-manifest/sitemap/feed, including current RSS ordering/date witnesses. |
| `FRAGMENTED-SECURITY-OWNERSHIP` | **KEEP, REFRAME BY ENFORCEMENT LAYER** | Absorb `SECURITY-CSP-INCONSISTENCY`, `SECURITY-CSP-GAPS`, and the new `SECURITY-NOSNIFF-OWNER-LAYER-MISMATCH`. CSP HTML/meta/postbuild ownership and transport `X-Content-Type-Options` response-header ownership are different enforcement layers and require separate witnesses under one security system package. Do not define closure as one HTML head emitting both. |
| `SCRIPTURE-OCCURRENCE-REPRESENTATION-ORACLE` | **ADMIT** | Exact Scripture Search representation boundary is wrong in two independent user-visible dimensions: raw-source context leakage and false fragment anchors where `data-note-id` is accepted as `id`. Producer/verifiers share the same narrower surrogate, so closure requires an independent HTML/visible-prose model. |
| `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS` | **ADMIT** | Replaces the false-complete button lane and owns broader audit-corpus integrity. Historical `47` becomes 49 in the declared Astro/TSX scope and at least 75 when runtime-generated JS controls are included; a separate asset-revision census also found JS-internal resource URLs outside the hard cache-bust corpus. Absorb `MISSING-BUTTON-TYPE` as preventive cleanup evidence and retire `SITEWIDE-BTN-TYPE-AUDIT` as an active system lane. |
| `SW-ROOT-GENERATION-AUTHORITY` | **ADMIT; ABSORB OLD SW RESIDUAL** | One root Service Worker has five route-dependent script identities in one release; failed successor rollback is not generation-isolated; revisioned requests can downgrade to bare canonical bytes from the controlling generation. Absorb `SW-PWA-FRESHNESS`; closure must prove one release/generation authority plus cross-generation cache correctness. |
| `BROWSER-MATRIX-ZERO-WORKER-FAILOPEN` | **ADMIT** | Separate harness execution-cardinality failure: malformed worker env values can create zero browser runners and still produce `0/0 PASS`. Different causal repair from source-surface completeness, so keep independent even though both belong to audit-harness governance. |
| `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT` | **ADMIT** | Strict-native migration proves legacy transport removal but not retained capability completeness. Current missing-owner families: strategic map, FAQ accordion, heading-copy anchors, reversible cards. Closure requires a capability manifest/cardinality invariant, not restoration of broad legacy bundles. |
| `TTS-SHAREDWORKER-CLIENT-LIFECYCLE` | **ADMIT** | Normal MessagePort disconnect lacks authoritative retirement. A disappeared client can remain a model-load waiter and can leave synthesis work in the shared queue. Closure must atomically retire load membership and speech jobs on client lifetime end. |
| `LAZY-RUNTIME-LOADER-FAILURE-STATE` | **ADMIT** | Shared invariant failure across Search and canonical TTS: resource acquisition failure does not reliably transition to a settled retryable state. Search keeps sticky `__gbSearchBootRequested`; TTS can attach listeners after an existing Vosk script already fired its terminal error and remain pending. Closure: explicit `idle/loading/ready/failed` semantics, failed attempts settle, retry creates/observes a fresh acquisition, in-flight calls still deduplicate. |

## Old MASTER row-by-row disposition

| Current MASTER row | Verifier disposition | Target owner |
|---|---|---|
| `RODOSLOVIYE-OG-IMAGE` | **KEEP** | Direct row |
| `GENEALOGY-NO-ERROR-BOUNDARY` | **KEEP, NARROW** | Direct row |
| `EDITORIAL-LABEL-INCONSISTENCY` | **ABSORB** | `METADATA-SSOT-PROLIFERATION` |
| `SECURITY-CSP-INCONSISTENCY` | **ABSORB** | `FRAGMENTED-SECURITY-OWNERSHIP` |
| `RSS-SERIES-DATE-COLLAPSE` | **ABSORB AS NAMED PUBLIC WITNESS** | `METADATA-SSOT-PROLIFERATION` |
| `APP-MASK-NO-WEBKIT-FALLBACK` | **KEEP** | Direct row |
| `SECURITY-CSP-GAPS` | **ABSORB** | `FRAGMENTED-SECURITY-OWNERSHIP` |
| `SW-PWA-FRESHNESS` | **ABSORB / SUPERSEDED** | `SW-ROOT-GENERATION-AUTHORITY` |
| `AR-IDX-JS-02-MULTIWRITER` | **RETIRE FROM ACTIVE MASTER** | Existing canonical ReaderPreferences compatibility bridge; physical legacy-key cleanup may remain Work Queue only |
| `MISSING-BUTTON-TYPE` | **REMOVE FROM ACTIVE PRODUCT DEFECTS / OPTIONAL PREVENTIVE CLEANUP** | `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS` owns audit integrity; a future zero-hit cleanup guard may own prevention |
| `SITEWIDE-BTN-TYPE-AUDIT` | **RETIRE / REPLACE** | `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS` |
| `METADATA-SSOT-PROLIFERATION` | **KEEP** | Expanded system root |
| `FRAGMENTED-SECURITY-OWNERSHIP` | **KEEP, REFRAME** | Layered security system root |

## New forensic work-unit disposition

| PR #344 forensic unit | Verifier disposition |
|---|---|
| `SCRIPTURE-OCCURRENCE-REPRESENTATION-ORACLE` | **ADMIT** |
| `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS` | **ADMIT** |
| `SECURITY-NOSNIFF-OWNER-LAYER-MISMATCH` | **ABSORB into existing security root** |
| `SW-ROOT-GENERATION-AUTHORITY` | **ADMIT; supersedes old SW residual** |
| `BROWSER-MATRIX-ZERO-WORKER-FAILOPEN` | **ADMIT** |
| `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT` | **ADMIT** |
| `TTS-SHAREDWORKER-CLIENT-LIFECYCLE` | **ADMIT** |
| `LAZY-RUNTIME-LOADER-FAILURE-STATE` | **ADMIT** |

Net effect: eight forensic units create **seven** new target rows because the nosniff finding strengthens the existing security root rather than becoming another countable row.

## Arithmetic

Starting from the old 13 rows:

- retain three direct rows: `RODOSLOVIYE-OG-IMAGE`, narrowed genealogy, App/Map mask;
- retain two old system roots: metadata and security;
- retire theme multiwriter;
- remove/absorb two security direct rows;
- absorb editorial-label + RSS into metadata root;
- absorb old SW residual into the new SW root;
- remove the button residual + retire its false-complete system lane from active Product work;
- admit seven genuinely new independent rows from PR #344.

Target:

```text
3 bounded direct defects
+ 2 retained/reframed old system roots
+ 7 new independent system roots
= 12 active independent work units
```

The exact arithmetic is less important than causal independence: a manifestation should remain visible in closure evidence without becoming another repair owner.

## Priority / repair order proposal

### Tier 1 — state/lifecycle correctness

1. `SW-ROOT-GENERATION-AUTHORITY`
2. `LAZY-RUNTIME-LOADER-FAILURE-STATE`
3. `TTS-SHAREDWORKER-CLIENT-LIFECYCLE`
4. `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT`

These can create stale bytes, unrecoverable runtime states, wasted shared work, or visible dead capabilities.

### Tier 2 — oracle/admission correctness

5. `SCRIPTURE-OCCURRENCE-REPRESENTATION-ORACLE`
6. `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS`
7. `BROWSER-MATRIX-ZERO-WORKER-FAILOPEN`

Repairing Product while these oracles remain false-green risks recurrence or false closure.

### Tier 3 — authority consolidation

8. `METADATA-SSOT-PROLIFERATION`
9. `FRAGMENTED-SECURITY-OWNERSHIP`

Both require owner consolidation across multiple projections/enforcement layers rather than point fixes.

### Tier 4 — bounded direct defects

10. `RODOSLOVIYE-OG-IMAGE`
11. `GENEALOGY-NO-ERROR-BOUNDARY` (narrowed)
12. `APP-MASK-NO-WEBKIT-FALLBACK`

These are valid but should not distract from the system owners above.

## Freshness

The earlier deep forensic source boundary was `01894214765d7ab6e51a7eea1fb7f239c6591af8`. Product later advanced to audited anchor `b8b9029a95c08e85b7353da76c11d18f677c591b` through three commits touching CI failure lifecycle, schema rich-results, and the Kod Da Vinci title owner. Those commits did not touch the Search/SW/TTS/Scripture/article-capability/security/button-source owners used by the eight forensic units. The causal evidence therefore remains current by owner movement at this synthesis boundary.

## Admission / mutation boundary

- This file intentionally does **not** edit `verified/MASTER_BUG_MATRIX.md`.
- It does **not** open Product repair lanes.
- It does **not** claim live transport headers that were not captured.
- It does **not** treat stale TTS compatibility revision literals as a normal-path Product outage.
- Verifier should consume the evidence files in PR #344, then perform the MASTER rewrite as one consolidation transaction with closure-ledger provenance for removed/absorbed rows.
