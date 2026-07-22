# CURRENT HEAD REVERIFY — 2026-07-22 — source registry production

## Authority

- Source `main`: `6c4106aecd35a3c95b09b041332d653f581ceb92`.
- Hard Texts visual ownership: PR #151 / `0a4491184376442923270c412614392717949a18`; issue #150 closed.
- Nagornaya source-role and argument-layer registry: PR #149 / `6c4106aecd35a3c95b09b041332d653f581ceb92`; issue #142 closed.
- Next UI lane: issue #153; route semantics #146 and Reader R6 #59 remain separate.

## Exact pre-merge evidence

- PR head: `e9d23d041cf05b58a0719cfda829b44a54b0552d`.
- Shared Files Guard `29949641691`: registry/source adversarial tests and actionlint passed.
- Route Registry/browser `29949641685`: 3428/3428 contracts PASS across 75 public routes × 3 viewports.
- `/nagornaya/istochniki/`: 33/33 contracts PASS at 320, 390 and 1440; HTTP 200, no overflow/page errors/asset/a11y/native-isolation failures.
- Native Source `29949641690`: Astro check, production-like build, native output, metadata/workflow coherence and clean-tree passed.
- Visual `29949641802`: `/nagornaya/istochniki/` 0.000% desktop / 0.000% mobile.

## Registry contract

- Three verified sources: Green `tmsj12d.pdf` 49–68; Thomas `tmsj7d.pdf` 75–105; Nichols `tmsj7h.pdf` 213–239.
- Six claims: three supported author-level arguments and three unsupported institution-level attribution boundaries.
- Claims record layer, primary evidence, alternative, series position, confidence and change condition.
- Negative tests reject Thomas→Nichols object mutation, author→institution promotion, conflicting `doesNotSupport`, incomplete verified PDF metadata, unknown schema fields and native hard-coding.
- Exact registry SHA-256: `d105f6a309de866550118a4fa7dcd8c8ec9cb8c3f0f68d23dd0c944a8845b4c2`.

## Exact production evidence

- Shared Files Guard `29950458595`: success.
- Visual Parity `29950458386`: success.
- Native Source `29950458319`: success.
- Readiness `29950459817`: success for exact `6c4106aecd35a3c95b09b041332d653f581ceb92`.
- Pages `29951046722`: success for the same SHA.
- AuditRepo observer `29950695954`, artifact `8542524012`.
- Live `/nagornaya/istochniki/`: HTTP 200; 8/8 required markers; 2/2 stale markers absent.
- Live SHA-256: `b430cdc33e6245e2dc024e8c8802bb5e487bc19a862aee2601c122c72df3f561`.
- ETag: `"6a611d07-132af"`; Last-Modified: `Wed, 22 Jul 2026 19:41:59 GMT`.

## Next boundary

1. Issue #153: registry-driven neutral comparison UI with before/after screenshots and preserved confessional position.
2. Issue #146: explicit route semantics cleanup without a new engine.
3. Reader R6 / issue #59 as an independent state-platform lane.
4. Do not combine UI, route semantics and ReaderState.
