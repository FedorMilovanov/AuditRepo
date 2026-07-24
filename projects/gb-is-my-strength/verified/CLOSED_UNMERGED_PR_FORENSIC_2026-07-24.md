# Closed-unmerged pull request forensic — 2026-07-24

## Boundary

- Repository: `FedorMilovanov/AuditRepo`
- Examined default branch: `main@a62ed7e3f73016a90123624cea737caa36784e76`
- Scope: every known AuditRepo pull request closed without merge through PR #44
- Tracking issue: `FedorMilovanov/AuditRepo#40`

This report answers a narrow recovery question: whether pushed work represented by closed-unmerged pull requests is still retrievable and whether a document or transaction result was lost when its branch was closed or removed.

It does **not** prove the existence of local commits that were never pushed, does not promote stale intake to current truth, and does not advance production authority.

## Result

Eleven closed-unmerged PR heads were identified and fetched by exact SHA. **All eleven head commits remain accessible.** No document loss was proved.

The heads divide into four dispositions:

1. completed event-only or one-shot transactions — PR #15–#18 and #42–#44;
2. explicitly superseded Gill evidence — PR #27;
3. older intake packages preserved by merged reconciliation PR #10 — PR #6 and #7;
4. Vosk implementation/report preserved by source history plus a permanent forensic ref — PR #3.

## Exact inventory

| PR | Exact head | Disposition | Recovery proof |
|---:|---|---|---|
| #44 | `b40cab0cda731da532077d6be42c699c14dfd3fb` | diagnostic verification marker | The head adds only `FINAL_VALIDATION_TRIGGER_5636.md`; it was intentionally closed after validation of cleaned `main@a62ed7e3`. |
| #43 | `4a01c7c82b06bd8ff98e6202e165e3e6f8253074` | event-only materializer trigger | The head contains only the guarded transaction marker. The matrix result landed as `f242ce3758db876dcf239d8b442c72922a9a6104`; one-shot workflows were removed through cleanup ending at `a62ed7e3`. |
| #42 | `ac3b94e48717f3a9ecd0f8575141c95e2a1c430b` | diagnostic retrigger | The only delta is a comment in `reconcile-source-boundary-5636.yml`; the final matrix transaction and cleanup are present in `main`. |
| #27 | `9bde7069254b0990c10bd2b068f10d7dae52f1e5` | superseded Gill wave | The PR body explicitly retires the stale 62-volume/pre-closure draft. Canonical replacement evidence was merged through AuditRepo PR #34 and the Research/site closure chain named there. Do not merge the old head wholesale. |
| #18 | `0a3347ff7be8fd948f4bfec8e756381a38693195` | Reader R5 trigger | The head adds only an event marker. The target SSOT reconciliation landed as `650def0a3a73e3e77dd396bc1d59c70a407e1ee0`. |
| #17 | `2ad4225efcb2b63150ded6b42a60b106546eff39` | Reader R4 trigger | The head adds only `reconcile-reader-r4.trigger`. The target result landed as `1b9ff502c2dc19be63b5f58079156f8a727bceaa`. |
| #16 | `ae227b00e859200eaa88de1ba85199dd5799d2ad` | Reader R3 trigger | The head adds only `reconcile-reader-r3.trigger`. The target result landed as `f94e196e6244a6a9e1492d5d85d0a389f11cdb6d`. |
| #15 | `c9f36b3b5778f5e51dc57242c3efaeea1037604d` | superseded one-shot implementation | Its deterministic Reader R1 transaction was executed on `main` and self-removed; landed result `d84862013e0a8839c04edd0f138a9c731bd2ffb7`. The head is implementation provenance only. |
| #7 | `21ccaaddf5aea1ecdce13187ed23ce9e3d1dc59e` | preserved Hermeneutics intake | Merged PR #10 contains the complete `incoming/gpt-5-5-hermenevtika-ui-audit/2026-07-09/` package. The representative deep-audit delta remains in current `main` at the same governed path. |
| #6 | `d4704bcf760db9063f4ada080eca9a2a3c94328a` | preserved Gill V10 intake | Merged PR #10 carries the Gill V10 `README`, `REPORT`, cumulative artifact, comments, evidence index and proposal. Volatile status text was intentionally normalized; raw/provenance material was preserved rather than promoted as current SSOT. |
| #3 | `07891373c6c9f488842a9a66e6cfde857ca74bce` | preserved Vosk implementation/report | Current site history contains the Vosk runtime and later CSP/CDN/telemetry refinements. The complete closed head is permanently anchored by `archive/forensic-pr-3-vosk-tts-report-2026-07-24` (and an equivalent shorter archive ref). It is evidence, not a merge candidate. |

## Writer and temporary-workflow closure

The 5636 source-boundary transaction is complete:

- canonical matrix update: `f242ce3758db876dcf239d8b442c72922a9a6104`;
- cleanup chain removed the materializer and reconciliation workflow;
- final examined `main`: `a62ed7e3f73016a90123624cea737caa36784e76`;
- `.github/workflows/reconcile-source-boundary-5636.yml` is absent from the final tree.

No current write-capable one-shot workflow from that transaction remains.

## Recovery rules

- Never merge any closed head wholesale merely because it is accessible.
- Trigger/materializer branches are transaction evidence only.
- Superseded intake remains provenance; current status comes from `MASTER_BUG_MATRIX.md`, current reverify documents and exact source/deployment witnesses.
- Any selective recovery begins on fresh current `main`, copies only the justified semantic delta and passes AuditRepo validation.
- The Vosk archive ref must remain outside ordinary active-lane lists.

## Remaining boundary

This report covers all known closed-unmerged PR heads. A separate machine gate is still required for an exhaustive inventory of **all remote branch refs**, including branches never associated with a PR. The source-repository implementation is being hardened in `gb-is-my-strength#212`; after its report semantics are final, the same read-only contract should be applied to AuditRepo.
