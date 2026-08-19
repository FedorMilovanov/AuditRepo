# Intake — chatgpt / 2026-08-19

## Identity

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `ChatGPT GPT-5.6 Sol`
- Date: 2026-08-19
- Audited anchor: Product `main` `bcb41e57d7f9c011ac597c51a240fba19152a908`
- Freshness boundary: Product later advanced to `01894214765d7ab6e51a7eea1fb7f239c6591af8` only through `scripts/css-layer-validator.js`; the owners examined in this intake were unchanged.
- Local source snapshot: user-provided `gb-is-my-strength-main (13).zip`, equivalent to Product `d99bd866de090023eac39d1aa648feb63ff45d52` for the owners examined here; `d99bd866… → bcb41e57…` changes only `.github/workflows/notify-on-failure.yml` and `scripts/dist-css-parity-audit.js`.
- AuditRepo base: `6aae4f35a7f308d364f924bc41ea9796e99dd34f`
- Report type: `forensic-audit` / `audit-harness` / `search-representation` / `security-owner-layer` / `service-worker-lifecycle` / `runtime-migration`
- Product mutation: none
- MASTER mutation: none

## Files

| File | Role |
|---|---|
| `REPORT.md` | Evidence, root-cause synthesis, collision/currentness boundaries and verifier disposition for the Scripture-context and historical button-audit oracle failures. |
| `SCRIPTURE_OCCURRENCE_ANCHOR_FALSE_WITNESS.md` | Second manifestation under the same Scripture work unit: producer and dist verifier both mistake `data-note-id` for real `id`, so 13 current exact occurrences carry four non-existent fragment targets while the browser contract checks only index↔href agreement. Also proves the same attribute-boundary false-green adversarially in the hard `series:facade:guard`. |
| `SECURITY_NOSNIFF_OWNER_LAYER.md` | Standards-grounded challenge to treating `X-Content-Type-Options` as an HTML-head pragma; separates confirmed owner-layer defect from the still-unmeasured live response-header state. |
| `SW_SCRIPTURL_ROUTE_VERSION_CHURN.md` | SW lifecycle manifestation A: route-local `SITE_CONFIG.version` changes one root worker's script URL; corrected census: 67 SW-registering Astro routes, zero duplicate registration carriers, at least five worker identities in one release. |
| `SW_CACHE_TRANSACTION_GENERATION_GAP.md` | SW lifecycle manifestation B: failed successor install deletes `CACHE_STATIC` under a cache namespace that is not guaranteed generation-isolated; current source guard calls that shared name “staging”, while the browser rollback test proves only clean first-install failure and oldVersion→currentVersion updates. |
| `BROWSER_MATRIX_ZERO_WORKER_FAILOPEN.md` | Reproduces malformed worker-count env values collapsing both all-public-route browser matrices to zero workers and a vacuous `0/0 PASS`; distinguishes latent harness fail-open from the currently safe literal CI inputs. |
| `ANTISOVETOV_STRATEGIC_MAP_RUNTIME_ORPHAN.md` | Detailed manifestation evidence: Antisovetov retains 39 strategic-map triggers + 36 data records after the only functional owner was removed during series migration. |
| `ARTICLE_ENHANCEMENTS_PARTIAL_MIGRATION_ROOT.md` | System synthesis (filename retained for link stability; title broadened to `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT`): series-native migration removed broad legacy owners without re-homing all retained capabilities — strategic map, 17 FAQ accordions, enabled heading-anchor copy controls on at least eight series-native heads, and six reversible flip cards on Gill/Krajne surfaces. |
| `ARTICLE_CAPABILITY_CI_ARTIFACT_WITNESS.md` | Exact-head Product CI witness from `f93567ce…`: Shared Files/Source Authority/Deploy Candidate/Metadata all succeeded; Gill browser artifact executed 24/24 layout cases + TTS/play scenarios, but has zero checks for strategic-map/FAQ/heading-anchor/flip-card capabilities. |
| `ARTICLE_CAPABILITY_MIGRATION_CONTROL_PLANE_GAP.md` | Process-root evidence: strict-native taxonomy proves legacy transport removal and Gill guard correctly forbids duplicate legacy owners, but neither requires a complete semantic capability map. Closure needs `legacy transport = 0` + `retained capabilities complete` + `exactly one owner`. |
| `ARTICLE_INTERACTIVE_AUDIT_SCOPE_WITNESS.md` | Current workflow witness: production-like Playwright audit really runs for article-pilot changes and exercises Gill/Krajne series chrome, but its semantic matrix is rail/TOC/navigation/theme/search/media/quiz/glossary rather than the retained capability families above. |

## One-line outcome

Six forensic work units are recorded without opening a Product repair lane: (1) the Exact Scripture occurrence system has a shared representation/oracle root — reader contexts can expose raw source syntax, and a second common-mode bug currently stores 13 exact occurrences with four `data-note-id` values falsely accepted as HTML anchors, while producer/dist/browser checks all remain green on narrower surrogates; (2) the historical `SITEWIDE-BTN-TYPE-AUDIT` declared an exhaustive 543-file / 47-instance result even though two missing-type TSX buttons already existed at that exact anchor and were omitted from the claimed complete list; (3) the security model conflates CSP's valid HTML pragma carrier with `X-Content-Type-Options`, which is a response-header property and therefore cannot be closed by unifying page `<head>` markup; (4) the root Service Worker lacks one generation authority — route-local page versions produce at least five worker script identities across 67 SW-registering Astro routes, lifecycle UI treats any update/install as a site release, and failed successor install cleanup can delete a shared `CACHE_STATIC` cache because generation isolation is assumed rather than proved; (5) malformed nonnumeric worker env values can make both public-surface browser matrices execute zero cases and still report success because their terminal oracle checks only `failures.length`, not execution completeness; (6) the series-native migration correctly removed broad legacy owners to prevent duplicate ownership but lacked a capability-completeness contract, leaving four retained feature families without owners: Antisovetov strategic-map popovers, Antisovetov/Krajne FAQ accordions, enabled heading-anchor copy controls across series-native heads, and reversible flip cards on Gill/Krajne. Exact-head green Product CI independently proves the shared chrome/TTS scope while omitting these feature families, so green admission is compatible with the root rather than a refutation.

## Collision boundary

Current Product work includes an active `/app/` preview lane that owns `data/scripture-search-index.json`; this intake therefore records evidence only and does not regenerate or repair that generated owner. Concurrent AuditRepo PRs own MASTER/matrix consolidation, so this branch deliberately uses a unique incoming path and does not edit governance rows. No open Product PR was found for `service worker` / `sw`, `antisovetov`, or the shared legacy-capability migration at the corresponding finding boundaries. The browser-matrix finding does not claim ordinary CI is currently bypassed: the current workflow passes explicit valid literals `GB_MATRIX_WORKERS="4"` and `GB_CROSS_BROWSER_WORKERS="2"`. The nosniff evidence deliberately stops before declaring a live vulnerability: actual deployed response headers still need an external/network witness.
