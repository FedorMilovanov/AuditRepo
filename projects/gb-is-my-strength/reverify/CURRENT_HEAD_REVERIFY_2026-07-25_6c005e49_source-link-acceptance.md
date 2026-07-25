# CURRENT HEAD REVERIFY — 2026-07-25 — `6c005e49` source-link acceptance

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `6c005e49deb39c55ee7aa10bd89687bd82c65c1a`
- Exact imported production authority: `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320`
- AuditRepo authority before reconciliation: `3c806841312145ff0740f934a0fb31802d09e834`
- Date: 2026-07-25

This witness advances source truth only. It does not claim readiness, Pages deployment, live publication or whole-release artifact identity for `6c005e49`.

## Accepted source chain

### Core redirect and destination policy

PR #324 merged as `e8e7c39c15642f0ab70999779b9d734c29c70f77` and added:

- explicit redirect-chain handling;
- policy validation before every hop;
- private/reserved address rejection and DNS result pinning;
- HTTPS downgrade, loop, overflow and invalid/missing Location blocking;
- final status/content usability checks;
- machine-readable chain evidence.

### Evidence secrecy and immutable workflow dependencies

PR #336 merged as `f65795b21edb568134b37deb91b2e4feca21a41a` and added:

- malformed URL evidence as `invalid-url:sha256:<fingerprint>:bytes:<n>` instead of raw malformed input;
- full-SHA pins for checkout, setup-node and upload-artifact in the source-link workflow;
- permanent source/mutation coverage for evidence redaction and workflow ownership.

The first manual post-merge run `30173878517` published artifact `8623705267` (`sha256:fd30eb2b77075da9acf41d2526877a13a291e1b5768262e5801443c194f9b36d`). It proved evidence secrecy but exposed a common-mode native adapter failure:

- 201 checked;
- 0 pass;
- 201 warning;
- 0 hard;
- 0 redirect hops;
- every request failed before HTTP with `ERR_INVALID_IP_ADDRESS`.

That run is diagnostic evidence, not acceptance.

### Native Node network acceptance

PR #346 merged as `6c005e49deb39c55ee7aa10bd89687bd82c65c1a` and fixed:

- custom DNS lookup compatibility for scalar callbacks and `options.all=true` address arrays;
- exact address/family validation before native request creation;
- `systemicTransportFailure` detection for a corpus where every URL warns before any HTTP response;
- bounded response-prefix storage instead of false `RESPONSE_TOO_LARGE` hard failures;
- warning classification for 401/403/405/418/429 and transient 5xx;
- permanent runtime fixtures and source mutations for all of those boundaries.

Clean final PR head `e30a9b24c86dd65e3ff0f27677432add70c39ead` passed:

- Source Link Audit contract `30175072859`;
- Shared Files Guard `30175072868` across fonts, workflow policy, notifier, control plane, runtime, series, shared-file policy and actionlint.

Final PR scope was exactly:

- `scripts/source-link-audit.js`;
- `scripts/source-link-audit-contract-test.cjs`;
- `scripts/source-link-audit-source-contract-test.cjs`.

No temporary workflow or materializer entered `main`.

## Real-network evidence

### Exact product-code acceptance before merge

Run `30174893767` exercised the accepted product code with a temporary never-merge evidence carrier. Artifact `8623958976`, digest `sha256:0cd45d72a94088b7ae912d2e4ded257f5f6792d13443d69b152d8ef400cd0433`:

- schema version 2;
- audit root `dist`;
- 201 checked;
- 167 pass;
- 29 warning;
- 5 hard;
- 34 redirect hops;
- `systemicTransportFailure=false`;
- no credentials, sensitive query values or URL fragments in public evidence.

### Exact post-merge main acceptance

Canonical manual run `30175242133` executed on exact `main@6c005e49`. Artifact `8624053524`, digest `sha256:d20c3b5773560d0c3453b552c538cf1f4f977dd390b6171d85a17b6909bfd3e6`:

- schema version 2;
- audit root `dist`;
- 201 checked;
- 165 pass;
- 31 warning;
- 5 hard;
- 35 redirect hops;
- `systemicTransportFailure=false`;
- no credentials, sensitive query values or URL fragments in public evidence.

Pass/warning counts vary slightly because the external network is nondeterministic. The exact hard set is stable across accepted feature and post-merge runs.

## Five genuine CONTENT/RESEARCH failures

These are not SYSTEM-auditor defects and are tracked in source issue #352.

### `dist/articles/dzhon-gill-istoricheskiy-kontekst/index.html`

1. `https://archive.org/details/confessionoffait00lond` — HTTP 404.
2. `https://archive.org/details/historyofenglish01cros` — HTTP 404.
3. Heidelberg catalog record `1055162692` — redirect chain to WorldCat, final HTTP 400.
4. Cambridge Historical Journal coffeehouse article URL — canonical redirect, final HTTP 404.

### `dist/articles/dzhon-gill-spravochnik/index.html`

5. Grace e-books library URL — `CERT_HAS_EXPIRED`.

Issue #352 requires exact source identification and authoritative stable replacements. The audit policy must not be weakened to hide those records.

## SYSTEM closure

Source issue #303 is closed `completed` after comment `5080627971` recorded the post-merge evidence. The accepted SYSTEM contract now proves:

- every redirect destination is validated before request;
- DNS is checked and pinned into the real request;
- native lookup callback shapes are compatible with current Node;
- invalid/malformed evidence does not leak source secrets;
- large valid pages are sampled through bounded prefixes;
- bot/transient statuses remain warnings while permanent/policy failures remain hard;
- vacuous all-warning network acceptance fails closed;
- diagnostic evidence uploads even when genuine hard links make the network job red.

## Deployment witness correction

AuditRepo’s previous operational text said automated replay had not been observed. Exact run `30171194731` disproves that stale statement:

- job `Record verified deployment capability witness` completed success;
- exact deploy run resolution completed success;
- trusted recorder checkout completed success;
- exact-run TTS artifact download completed success;
- artifact/report validation and repository witness projection completed success.

Historical run `30169981463` remains failure and is not rewritten. Operator comment `5080203496` remains transparent historical recovery evidence. Automated replay `30171194731` is a separate later success.

## Current ownership at capture

Open source PR owners:

- #338 — homepage Chromium/WebKit interaction contract;
- #348 — Genesis 6 Research authority provenance.

Open source CONTENT/RESEARCH issue:

- #352 — five genuine external source replacements.

Refresh owners before any future action.

## Production boundary

Exact imported production authority remains `f5e29998` only:

- readiness `30169126149`;
- deploy `30169443420`;
- Pages deployment `5603663894`;
- Pages artifact `8622641548` (`sha256:38a3a138d9f062e43c0e3ed52666113759d310cb0231e2ee388fc522b25e2b2c`);
- TTS artifact `8622642553` (`sha256:bacb0330c7a2201289eeeb7d2b9b9dc832106eec292cd890afc1c5819e1eec7f`).

No exact readiness, same-artifact Pages promotion or live witness for source `6c005e49` is imported here. Whole-release identity and build-once promotion remain #292/#295.
