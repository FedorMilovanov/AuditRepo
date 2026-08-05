# Working master bug matrix — The Legendary Poet

**Matrix type:** working synthesis, with fixed rows backed by exact source production.  
**Initial audit baseline:** `FedorMilovanov/TheLegendaryPoet main@19598947c20cd2dd94abd232fbf6fb8a05c3575a`.  
**Current production after W0–W6 selective extraction and governance:** `ccbdebc5e47d275561de9ec78f181e388e4a4e1a`.

| ID | Sev | Working status | Root cause | Repair lane | Evidence / closure barrier |
|---|---|---|---|---|---|
| TLP-SYS-001 | P1 | fixed-current | Current technical truth was distributed across stale and live documents; after W1–W4 closure the authoritative `CURRENT_STATE` still reopened four retired debts. | W0 / source #303 + truth repair #325 | W0 production `69e5d39`; post-W5 exact truth head `c73cdcb`, production `db6bc3e`; machine open-lane parity, AuditRepo authority path and stale-claim rejection; retained by current production |
| TLP-SYS-002 | P1 | fixed-current | Workflow path filters were not tree-validated and referenced retired surfaces. | W0 / source #303 | live filters + dependency-free path validator on production `69e5d39`, retained by current production |
| TLP-SYS-003 | P1 | fixed-current | No one working root-cause matrix existed for open TLP architecture lanes. | AuditRepo #177 | matrix, branch ledger and wave plan merged as `9ab07e7`; retained by current truth |
| TLP-RUNTIME-001 | P2 | fixed-current | Daily item epoch used local timezone/DST. | W0 / source #303 | deterministic UTC validator, CI and browser proof retained |
| TLP-REPRO-001 | P1 | fixed-current | Multiple Playwright versions installed outside lockfile. | Source #302 / AuditRepo #175 | exact Playwright `1.61.1`, retained by current package lock and workflow contracts |
| TLP-DISC-001 | P1 | fixed-current | CI proved regenerated sitemap/feed idempotence but did not prove committed files matched canonical data. | Inter-wave / source #305 | byte-level committed artifact validator retained in current production |
| TLP-QA-002 | P2 | fixed-current | Safari brand-source audit enumerated placements before the route-loading shell settled. | Inter-wave / source #305 | official readiness wait + real raster count retained by browser matrix |
| TLP-ARCH-001 | P1 | fixed-current | Dead Article model remained beside live Essay model. | W1 / source #308 | five drafts archived with SHA-256, runtime schema/export removed, redirects retained, content-model gate |
| TLP-ARCH-002 | P2 | fixed-current | Essay publication mutated imported authoring objects and wrote derived metadata in place. | W2 / source #311 + verified media #324 | clone/override/derived-read-time/deep-freeze boundary; #324 central registry applies only two accepted decisions and leaves 28 unresolved |
| TLP-COMM-001 | P1 | fixed-current | Generic startup hydrated the public community corpus; follow-up found unstable pending baselines, detail N+1 and poison persisted identities. | W3 / source #316 + #317 | target aggregates/cursors, bounded state/outbox, stable baselines, passive navigation and poison-safe recovery with multi-browser topology |
| TLP-PERF-001 | P2 | fixed-current | Entry bundle had limited margin and no per-route budget. | W4 / source #318 | one entry + 14 lazy-route budgets, asset and total JS/CSS ceilings, persistent budget report |
| TLP-CI-001 | P2 | fixed-current | Repeated workflow setup/build/browser primitives created drift and runner cost. | W4 / source #318 | shared repository actions, duplicate runner retired, workflow/browser-runtime contracts |
| TLP-QA-001 | P2 | fixed-current | Implementation contracts lacked one production-like reader synthesis across accessibility, failures and desktop/mobile engines. | W5 / source #322 | exact head `0536547`, production `6f13600`; full source matrix and Manual Browser QA 4/4; retained by current production |
| TLP-CLEAN-001 | P2 | active-current — physical operation only | Old refs remain physically present after their durable value was classified, extracted or archived. | W6 / source #324 + AuditRepo #185 | source #324 exact head `6146e6f`, production `17d0017`, full matrix + Manual Browser 4/4; three Arena docs byte-archived; deep work history preserved at identical archive ref `909df9f`; all path families classified; manifest lists 29 source + 3 AuditRepo refs; AuditRepo #185 rebuilt from post-governance main and Validate successful. Closure still requires actual delete-ref, absence re-list and final open-lane removal. |
| TLP-GOV-001 | P2 | fixed-current | Generic package identity, supported engine, release authority and licensing disposition were absent. | Governance / source #326 | exact head `e3a1a877`, production `ccbdebc`; private `the-legendary-poet@0.0.0-private`, Node `>=22.22.0 <25`, `UNLICENSED`, SHA-based release policy, package/lock/document parity; full source matrix + Manual Browser QA 4/4 |

## Matrix rules

- A source PR changes a row to `fixed-current` only after exact tested head, merge SHA and current-source presence are recorded.
- Page-specific symptoms link to one matrix root cause instead of receiving duplicate canonical IDs.
- Closed source waves remain separately attributable even when a later production SHA retains all repairs.
- `active-current` means one real current barrier remains; it does not permit partial work to be described as closure.
- `RETIRE_READY`, archived pointers, closed PRs or force-moved refs are not physical deletion.
- Unresolved research, attribution and media-rights issues are independent editorial backlog and are not closed by infrastructure cleanup.
- Canonical verified state is recorded under `verified/` and `reverify/`.
