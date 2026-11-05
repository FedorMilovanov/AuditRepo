# The Legendary Poet — final community P1 closure, human-backed production adversarial certification

Date: **2026-11-05**, production receipt at **2026-11-05T03:42:13.189Z**. Root: `TLP-COMM-ABUSE-001` only. AuditRepo baseline `main@53d26a19c08dd92c707c9fbf5c429a89d53abe91`, prior active matrix: **1 P1, 0 P2, 0 P3**.

## Human boundary and evidence custody

The authorized owner supplied the **sanitized terminal output** from the genuine production operator certifier on the Windows PowerShell 7.6.9 device. The operator had opened **two independent normal browser profiles** at the production site, submitted one temporary rating in each to obtain a legitimate Turnstile-backed signed actor session, and pasted only the respective `actorToken` into **hidden interactive TTY prompts**, never into the conversation, command-line arguments, environment variables, source files or an issue.

Evidence source is the operator's terminal transcript, **not a GitHub Actions job or an independently recorded video**. The certifier's `humanBoundary.freshProfiles=2` field is an operator-provided claim about how the two sessions were obtained; the Worker authentication and actor UUID inequality are separately programmatically verified. No token content, rating actor UUID or raw request authorization was retained.

Production endpoints tested: `https://the-legendary-poet-community.viktorcoy2012.workers.dev` and `https://thelegendarypoet.ru/community-targets.json`. Canonical target: `poet:alexander-pushkin`.

## Exact sanitized PASS

**Terminal final marker:** `LIVE COMMUNITY CERTIFICATION PASS`. Receipt: `schemaVersion=1`, `testedAt=2026-11-05T03:42:13.189Z`.

| Gate | Observed certifier result |
| --- | --- |
| Worker health | `ok=true`, `database=d1`, `databaseReady=true`, `targetAuthorityReady=true`, `writesReady=true` |
| Two sessions | `actorSessionsDistinct=true`, `freshProfiles=2`, `tokenMaterialLogged=false` |
| Signed-session Worker authentication / unknown target | **2 × HTTP 404** `unknown_target` |
| Concurrent identical comment | **two HTTP 200** responses |
| Replay | **HTTP 200**, `idempotent=true` |
| Public convergence | **exactly one** temporary comment row |
| Same ID with changed payload | **409** `comment_id_conflict` |
| Same ID from different authenticated actor | **409** `comment_id_conflict` |
| Remote D1 exact-row cleanup | `exactCertificationRowsDeleted=true` |
| Post-cleanup public comment query | `temporaryCommentAbsent=true` |
| Shared network-abuse authority | `networkRateBucketsPreserved=true` |

Certifier source: `scripts/operator/certify-community-live.mjs`. Original operator implementation provenance: [Product #505](https://github.com/FedorMilovanov/TheLegendaryPoet/pull/505), with later Worker contract changes accounted for by the *current production* test rather than inferred from 2026-09-12 historical checks. Windows repair and safer local token entry: [Product PR #569](https://github.com/FedorMilovanov/TheLegendaryPoet/pull/569), observed operator revision `39227d273dc0e7f6a13833ddf56e1bd586954620`. Before prompting for tokens, the operator verifies production health, target manifest membership, and read-only authenticated remote D1 access using pinned Wrangler `4.120.0`; cleanup executes exact-row deletes and retains rate buckets. These protections were validated in the actual live PASS, not claimed on syntax checks alone.

## Acceptance/disposition

[Product issue #497](https://github.com/FedorMilovanov/TheLegendaryPoet/issues/497) requires real human-backed Turnstile, unknown-target rejection, parallel duplicate convergence/idempotency, changed-body rejection, actor rotation rejection, and clean production D1 aftermath. Every listed gate passed in the supplied live receipt. [AuditRepo issue #437](https://github.com/FedorMilovanov/AuditRepo/issues/437) requires this terminal reverify, durable ledger and removal of the one P1 row. No simulated challenge, forged session, secret publication, unrelated Product code mutation or weakening of failure conditions.

**Disposition:** retire exactly `TLP-COMM-ABUSE-001` from MASTER; matrix **1 → 0**. This is the verified engineering issue matrix only. Continued security monitoring and future discovered regressions are separate from this closure. GitHub issue closure and AuditRepo PR acceptance require their ordinary GitHub evidence/CI lifecycle; no terminal-zero claim is valid until the matrix PR is validated and merged.
