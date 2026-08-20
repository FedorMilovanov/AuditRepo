# MASTER BUG MATRIX — gb-is-my-strength

> SSOT for current verified necessary work only. This is not a history table or a mirror of every source-repository signal.
>
> Consolidated and current-checked against Product `main` **94b8eaad0951c6b43cf1e55fc6c54b9114329f61** (2026-08-20). The causal synthesis is grounded in merged AuditRepo evidence package #344 (`45b985737f192f709d7e1ee7324250d0e0986ca1`). Absorbed, retired and superseded rows live in `CLOSURE_LEDGER.md` and the merged `incoming/chatgpt/2026-08-19/` evidence; they are not duplicated here.

## Current state

| Field | Value |
|---|---|
| Active independent work units | **12** |
| Bounded direct defects | **3** |
| System/root work packages | **9** |
| Owner decisions | **0** |
| Absorbed/retired rows in MASTER | **0** |

> Arithmetic: 3 bounded direct defects + 9 system/root packages = 12 independent repair owners. Named manifestations such as RSS date collapse, CSP variants/gaps, nosniff meta misuse and button-count drift remain closure witnesses under their causal owner; they are not separate active rows.

## BOUNDED DIRECT DEFECTS — 3

| ID | Current problem | Closure boundary |
|---|---|---|
| `RODOSLOVIYE-OG-IMAGE` | `/rodosloviye/` still publishes the Karty OG/Twitter image identity while its alt/context describes genealogy. This is a bounded wrong-public-asset defect independent of the broader metadata-authority package. | Correct page-owned OG/Twitter image identity; source + production artifact/live witness at repair anchor. |
| `GENEALOGY-NO-ERROR-BOUNDARY` | **Narrowed:** the `GenealogyTree` `client:only="react"` interactive island has no local ErrorBoundary/fallback/recovery. Native breadcrumb/H1/summary/prose remain outside the island, so do not claim whole-page blanking. | Add island-local failure containment/recovery and a deterministic crash witness; preserve surrounding native content. |
| `APP-MASK-NO-WEBKIT-FALLBACK` | `/app/` and Map mask styling use unprefixed `mask-image` without the project-standard `-webkit-mask-image` companion. Exact-current `/app/` source at `94b8eaad` still has the unprefixed-only rule after Product #1752. | Add paired WebKit fallback at shared/current owners and prove generated CSS parity on affected surfaces. |

## SYSTEM / ROOT WORK PACKAGES — 9

| ID | Current causal problem | Absorbs / closure boundary |
|---|---|---|
| `SW-ROOT-GENERATION-AUTHORITY` | One root Service Worker is registered under five route-dependent script identities in one release; failed successor rollback is not generation-isolated; a revisioned `?v=B` miss can downgrade to bare canonical bytes from controlling generation A. | **Absorbs `SW-PWA-FRESHNESS`.** Establish one release/generation authority; isolate staging/active cache generations; prove A→B offline/update semantics with byte identity rather than only `200/nonempty`. |
| `LAZY-RUNTIME-LOADER-FAILURE-STATE` | Failed resource acquisition does not reliably transition back to a settled retryable state. Search can retain sticky `__gbSearchBootRequested=true` after `search.js` error; canonical Reader TTS can attach listeners after a preloaded Vosk script already fired its terminal error and leave shared promises pending. | Explicit `idle/loading/ready/failed` semantics; failed attempts settle and a later retry creates/observes a fresh acquisition; genuinely in-flight requests still deduplicate. |
| `TTS-SHAREDWORKER-CLIENT-LIFECYCLE` | Normal MessagePort/document lifetime end has no authoritative client-retirement transaction. A disappeared client can remain a shared model-load waiter and can leave synthesis work in the single global queue. | Disconnect/close owner atomically retires load membership and all speech jobs for that client; browser contract covers in-flight disconnect → last-live cancel and abandoned synthesis. |
| `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT` | Strict-native migration proves removal of legacy transport but not retained semantic capability completeness. Current missing-owner families include Antisovetov strategic map, Antisovetov/Krajne FAQ accordion, heading-anchor copy controls and Gill/Krajne reversible cards. | Capability manifest/cardinality invariant: `legacy transport = 0`, every retained capability has exactly one current owner, and production-like browser coverage exercises each family. |
| `SCRIPTURE-OCCURRENCE-REPRESENTATION-ORACLE` | Exact Scripture Search derives user-visible context/fragment identity through a lossy source representation: raw-source syntax can leak into snippets and `\bid=` can accept `data-note-id=` as a real `id`. Producer/dist/browser oracles share the narrower surrogate. Product #1752 only added one `/app/` occurrence (`2429 → 2430`) and did not rewrite the existing records. | Build context from visible prose/DOM semantics; parse real `id` attributes structurally; independent oracle must prove snippet cleanliness and fragment target existence. |
| `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS` | Multiple guards overstate measured corpus completeness. Historical button audit `47` becomes 49 in its declared Astro/TSX scope and at least 75 when JS-generated controls are included; asset revision audit also misses JS-internal resource constructors (536 checked independently: 534 exact / 2 stale). | **Absorbs the active `MISSING-BUTTON-TYPE` + `SITEWIDE-BTN-TYPE-AUDIT` accounting.** Define DOM/resource-producing source surfaces explicitly; deterministic committed scanners must fail on omitted classes. Typeless-button cleanup is preventive unless a behavioural submit witness appears. |
| `BROWSER-MATRIX-ZERO-WORKER-FAILOPEN` | Malformed nonempty browser-worker env values can become `NaN`, create zero runners and report vacuous `0/0 PASS`. Official workflows currently provide valid literals, so this is a latent harness fail-open rather than a claim ordinary CI is bypassed. | Strict positive-integer parsing + nonzero execution-cardinality assertion + adversarial contract for malformed/zero/negative values. |
| `METADATA-SSOT-PROLIFERATION` | Editorial/publication truth is still projected through multiple authorities. Current manifestations include `/hard-texts/` label divergence and RSS/page editorial-date divergence; route membership itself is currently consistent (sitemap 76/76, curated search manifest 75/75, RSS 58/58). | **Absorbs `EDITORIAL-LABEL-INCONSISTENCY` and `RSS-SERIES-DATE-COLLAPSE`.** One editorial authority feeds Header/page metadata/search-manifest/sitemap/feed; prove value parity and RSS ordering, not merely membership. |
| `FRAGMENTED-SECURITY-OWNERSHIP` | Security policy ownership is split across page-head CSP/meta/postbuild and transport response headers. Historical CSP variants/gaps are manifestations of the HTML/document layer; `X-Content-Type-Options: nosniff` is a response-header concern and cannot be closed by an HTML meta pragma. | **Absorbs `SECURITY-CSP-INCONSISTENCY`, `SECURITY-CSP-GAPS`, and `SECURITY-NOSNIFF-OWNER-LAYER-MISMATCH`.** Define separate authoritative document-policy and transport-header owners; prove source→artifact/live parity. Do not claim a live missing-nosniff vulnerability without response-header measurement. |

## Retired / absorbed by the 2026-08-20 consolidation

These IDs are intentionally absent from active arithmetic; provenance is appended to `CLOSURE_LEDGER.md` and retained in merged evidence #344.

- `EDITORIAL-LABEL-INCONSISTENCY` → manifestation of `METADATA-SSOT-PROLIFERATION`.
- `RSS-SERIES-DATE-COLLAPSE` → public-artifact witness under `METADATA-SSOT-PROLIFERATION`.
- `SECURITY-CSP-INCONSISTENCY` + `SECURITY-CSP-GAPS` → manifestations of `FRAGMENTED-SECURITY-OWNERSHIP`.
- `SW-PWA-FRESHNESS` → superseded by `SW-ROOT-GENERATION-AUTHORITY`.
- `MISSING-BUTTON-TYPE` → preventive cleanup/evidence under `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS`, not a current submit defect.
- `SITEWIDE-BTN-TYPE-AUDIT` → retired/replaced by `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS`.
- `AR-IDX-JS-02-MULTIWRITER` → retired from active MASTER: canonical `gb:reader-preferences:v1` owns truth; legacy `theme` is a coordinated compatibility mirror with regression coverage.

## Negative/current boundaries preserved

- SW semantic census: 70/85 Astro routes register the root worker, 0 duplicate registration owners, 0 bare worker URLs, five script identities.
- Literal same-page fragments: 77 checked / 0 missing targets outside the generated Scripture-parser defect.
- Literal ARIA relationships: 924 checked / 0 missing literal targets.
- Search manifest identity: 76 items / 76 unique IDs / 0 duplicate IDs.
- ReaderState: 48 series routes / 0 legacy-key collision groups.
- 380 current `_blank` source links include `noopener`.
- Telemetry graph: 53 route graphs with one Metrika init, 32 without, 0 duplicate init; no sitewide-analytics requirement was established.
- Two stale floating-controller TTS revision literals remain source-surface evidence only: all 57 real floating-controller Astro route graphs also mount canonical `ReaderActionsRuntime`.

## Evidence authority

Primary merged package:

- `../incoming/chatgpt/2026-08-19/README.md`
- `../incoming/chatgpt/2026-08-19/VERIFIER_SYNTHESIS_TARGET_MATRIX_2026-08-20.md`
- supporting forensic witnesses in the same directory
- AuditRepo evidence merge #344: `45b985737f192f709d7e1ee7324250d0e0986ca1`

Current Product boundary: `94b8eaad0951c6b43cf1e55fc6c54b9114329f61`. Product movement from the previous synthesis anchor touched aggregate engine contracts, Mini App and one generated Scripture occurrence. Exact-current reverify retained the App mask defect; the Scripture index patch added only the new `/app/` occurrence and left the existing parser-generated records untouched.

## Terminal disposition

Admit only independent necessary work. A symptom may remain an important closure witness without becoming another repair row. Remove solved, stale, duplicate, absorbed and superseded rows in the same consolidation transaction, and append their provenance to `CLOSURE_LEDGER.md`.
