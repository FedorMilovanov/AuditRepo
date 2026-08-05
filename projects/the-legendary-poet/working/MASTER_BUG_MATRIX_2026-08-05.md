# Working master bug matrix — The Legendary Poet

**Matrix type:** working synthesis, with fixed rows backed by exact source production.  
**Initial audit baseline:** `FedorMilovanov/TheLegendaryPoet main@19598947c20cd2dd94abd232fbf6fb8a05c3575a`.  
**Current production after W0–W5 and post-W5 architecture-truth reconciliation:** `db6bc3ea8997f78d1370a05e2736cf20645c80dd`.

| ID | Sev | Working status | Root cause | Repair lane | Evidence / closure barrier |
|---|---|---|---|---|---|
| TLP-SYS-001 | P1 | fixed-current | Current technical truth was distributed across stale and live documents; after W1–W4 closure the authoritative `CURRENT_STATE` still reopened four retired debts. | W0 / source #303 + truth repair #325 | W0 production `69e5d39`; post-W5 exact truth head `c73cdcb`, production `db6bc3e`; machine open-lane parity, AuditRepo authority path and stale-claim rejection; Project contracts + CI + route + brand + Manual Browser QA 4/4 |
| TLP-SYS-002 | P1 | fixed-current | Workflow path filters were not tree-validated and referenced retired surfaces. | W0 / source #303 | live filters + dependency-free path validator on production `69e5d39`, retained by current production |
| TLP-SYS-003 | P1 | fixed-current | No one working root-cause matrix existed for open TLP architecture lanes. | AuditRepo #177 | matrix, branch ledger and wave plan merged as `9ab07e7`; closure promoted in current verification |
| TLP-RUNTIME-001 | P2 | fixed-current | Daily item epoch used local timezone/DST. | W0 / source #303 | deterministic UTC validator, CI and Manual Browser QA 4/4 on tested head |
| TLP-REPRO-001 | P1 | fixed-current | Multiple Playwright versions installed outside lockfile. | Source #302 / AuditRepo #175 | closed on production `19598947`; retained by later matrices and exact Playwright `1.61.1` |
| TLP-DISC-001 | P1 | fixed-current | CI proved regenerated sitemap/feed idempotence but did not prove committed files matched canonical data. | Inter-wave / source #305 | byte-level committed artifact validator in `check:content`; production `44a36bd`, retained in current production |
| TLP-QA-002 | P2 | fixed-current | Safari brand-source audit enumerated placements before the route-loading shell settled. | Inter-wave / source #305 | official readiness wait + real raster count; exact Manual Browser QA 4/4 |
| TLP-ARCH-001 | P1 | fixed-current | Dead Article model remained beside live Essay model. | W1 / source #308 | 5 drafts archived with SHA-256, runtime schema/export removed, redirects retained, content-model gate, production `e06bdfc` |
| TLP-ARCH-002 | P2 | fixed-current | Essay publication mutated imported authoring objects and wrote derived metadata in place. | W2 / source #311 | exact head `8eaeaa4`; clone/override/derived-read-time/deep-freeze boundary; raw-before-index snapshot validator; all required workflows and Manual Browser QA 4/4; production `a248abd` |
| TLP-COMM-001 | P1 | fixed-current | Generic startup hydrated and persisted the complete public ratings/comments corpus before target filtering or leaderboard aggregation; follow-up review found unstable pending-rating baselines, poet-detail N+1 reads and poison persisted identities. | W3 / source #316 + hardening #317 | scaling head `a810a2a9`, production `4544bb3`; hardening head `253376bd`, production `d03f091`; zero startup reads, target aggregates/cursors, bounded v3 state/outbox, stable pending baselines, passive poem navigation, user-activated panels, poison-safe recovery and multi-browser topology |
| TLP-PERF-001 | P2 | fixed-current | Entry bundle had limited margin below a broad ceiling and no explicit per-route chunk budget. | W4 / source #318 | exact head `6bd27851`; one entry + 14 lazy-route budgets, per-asset and total JS/CSS ceilings, `build-budget-report.json`, production `a11f6fa`, retained by current `db6bc3e` |
| TLP-CI-001 | P2 | fixed-current | Repeated workflow setup/build/browser primitives created drift and runner cost. | W4 / source #318 | four repository composite actions, duplicate community runner retired without losing Android/iPhone topology, workflow/browser-runtime contracts, production `a11f6fa`, retained by current `db6bc3e` |
| TLP-QA-001 | P2 | fixed-current | Strong implementation contracts lacked one production-like reader-outcome synthesis across accessibility, storage/network failure and desktop/mobile engines. | W5 / source #322 | exact head `0536547`, production `6f13600`; archive honesty/round-trip, citations/longform, keyboard focus, reduced motion, forced colors, blocked storage and queued failed writes; desktop Chromium, Android, desktop WebKit, fresh-process iPhone; full matrix + Manual Browser QA 4/4; retained by current `db6bc3e` |
| TLP-CLEAN-001 | P2 | active-current | Old branches, dormant candidates and deeply diverged research/media paths require path-level extraction and retirement classification. | W6 / source draft #324 + AuditRepo draft #185 | no wholesale merge or deletion; exact path outcomes, archive pointers, source successors, rights boundaries and authorized delete-ref capability required; current production base must be `db6bc3e` or later reconciled head |
| TLP-GOV-001 | P2 | owner-decision | Generic package identity, engine/license/release policy unresolved. | Separate governance | explicit owner decision; agents must not invent license/version |

## Matrix rules

- A source PR does not change a row to `fixed-current` until exact tested head, merge SHA and current-source presence are recorded.
- Page-specific symptoms must be linked to one matrix root cause instead of receiving duplicate canonical IDs.
- Closed source #286, #302, #303, #305, #308, #311, #316, #318, #317, #322 and #325 waves remain separately attributable even when a later production SHA contains all repairs.
- `active-current` means the root cause is confirmed on current production and owns the next isolated source lane; it does not imply partial closure.
- A W6 inventory or extraction draft is not branch-retirement closure and cannot claim deletion without an authorized delete-ref operation.
- Working statuses are synthesis decisions; canonical verified state is recorded under `verified/` and `reverify/`.
