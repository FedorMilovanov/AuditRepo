# mp3telegrambot audit — wave 9 history and rollback disposition

**Source anchor:** `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`

## Scope

Full-history attribution for admitted roots, refactor-boundary comparison and final owner/collision census. Product `main` and open owners were re-read first: `main` remained exact; only stale human PR #203 and dependency PRs were open.

## Provenance result

Full history shows the admitted work is not one uniform regression attributable to the final refactor merge:

- broad SQLite `OperationalError` migration suppression dates to May 2026, with later columns preserving the same pattern;
- the HTML message limiter dates to June 2026;
- LiveDub companion send/identity ordering dates to August 2026, while the explicit missing-ID failure message was touched later;
- release workflow provenance dates to October 23;
- demand-based `/healthz` staleness dates to October 26;
- environment, CI currency and assurance gaps span documentation/control-plane boundaries rather than one runtime patch.

The exact-main refactor substantially improved strict typing, exception visibility, process ownership, media postconditions and explicit publication coordination. The audit's direct defects cross several older mechanisms and should be repaired independently with focused regression witnesses.

## Collision disposition

No current human Product repair owner overlaps these rows. PR #203 is stale and targets action-version policy; it must not be imported wholesale because the audit requires immutable, current action identities rather than broad floors. Dependabot PRs remain separate dependency lanes.

No Product branch, file, workflow, release or issue was mutated by this audit.

## Final rollback decision

**Wholesale rollback remains rejected.** History disproves a single-regression theory, while exact-head deterministic evidence demonstrates protections that rollback would remove. The bounded disposition is repair-forward against the ten active matrix rows, preserving the verified refactor improvements and requiring exact-head CI plus real-runtime evidence at each relevant closure boundary.