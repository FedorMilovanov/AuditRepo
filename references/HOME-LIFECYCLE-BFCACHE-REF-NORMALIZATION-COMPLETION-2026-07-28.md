# Homepage lifecycle / BFCache ref normalization completion — 2026-07-28

## Authority

This record executes:

- `references/HOME-LIFECYCLE-BFCACHE-CONTENT-DISPOSITION-2026-07-28.md`.

Target site main:

- `b40044713b9fa09e404d5f57b2016d31f4cc88c6`.

## Historical preservation

Before mutation, all accepted, staging, materializer and diagnostic states were preserved through:

- `archive/forensic-home-lifecycle-bfcache-histories-20260728` at `f79606f99045df27ba1ec8923b9c28da198a0483`;
- `archive/forensic-home-pagefind-request-proof-pr388-20260726`;
- `archive/forensic-home-browser-process-isolation-pr402-20260726`;
- `archive/forensic-webkit-bfcache-control-pr404-20260726`.

## Final exact-head verification

Immediately before mutation, all ten authorized refs still matched their disposition SHA exactly:

| Ref | Verified head |
|---|---|
| `fix/home-browser-contract-20260725` | `8d39dab12e1f999b92551f3c80293ce442887537` |
| `fix/home-browser-contract-residuals-20260725` | `6ccb3616ee810c2845a1f5bb941d658114e55843` |
| `fix/home-browser-lifecycle-final-20260725` | `00dde6324e3101d77ee9c0c74062eb4a604861d1` |
| `test/home-browser-lifecycle-clean-20260726` | `8a117ec4f157b2581f018f5f9ed4fb83e06775f6` |
| `test/home-browser-lifecycle-proof-20260726` | `2edd637d255c112fa2a4dd68b9ba86a18998dc5c` |
| `fix/home-browser-lifecycle-final-clean-20260726` | `dfb2087c9db1607a177d0416e5dee3456f032787` |
| `fix/home-browser-request-identity-final-20260726` | `32353e0eda7e321a8220f0d9de7253712063e4ee` |
| `fix/home-pagefind-request-identity-20260726` | `b6b3a2b0ab1c64fb143572b6ac818825e50210b6` |
| `temp/home388-ff613-snapshot-20260726` | `ff61367623276815bd88af1f6fa7ab1fca3324f0` |
| `fix/home-browser-capability-contract-20260726` | `88d17334ec13271c42fe4773308cbd23a4ab4d0f` |

Site main was then re-read and remained `b40044713b9fa09e404d5f57b2016d31f4cc88c6`.

## Operations

All ten authorized refs were force-moved to the target main SHA.

Results:

- successful updates: **10**;
- failed updates: **0**;
- deleted branches: **0**;
- product commits created: **0**;
- homepage/runtime changes: **0**;
- publication/deployment changes: **0**.

## Protected exclusions

The following reused refs were not touched:

- `fix/home-browser-process-isolation-20260726`;
- `temp/webkit-bfcache-control-20260726`.

Both were rechecked after the operation and still resolve to:

- `0f7cefbb20abb17c65872e53c00c733c480f2a97`.

Their original PR #402 and PR #404 heads remain available through dedicated forensic archives and the combined anchor.

## Final disposition

The mutable homepage lifecycle, request-identity, snapshot and capability refs are normalized without losing accepted product history, rejected hypotheses or environmental evidence. The two reused refs remain protected for a separate ancestry-based disposition.