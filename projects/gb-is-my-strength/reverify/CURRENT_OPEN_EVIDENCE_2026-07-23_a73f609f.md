# Current open evidence — exact source `a73f609f`

Date: 2026-07-23  
Source repository: `FedorMilovanov/gb-is-my-strength`  
Exact source SHA: `a73f609f3163c8021525028e805132793d5db954`  
Readiness: `29969886676` — success  
Pages: `29970303813` — success  
Live witness: AuditRepo run `29971344184`, artifact `8549786188`

Current production authority has advanced to comment-only descendant `0f5b330799292d995c62bbb7d63a83870d93318e`; see `CURRENT_HEAD_REVERIFY_2026-07-23_0f5b3307_production.md`. The open source findings below remain valid because the descendant changes no audit/runtime implementation.

This document supplies independent evidence for canonical rows that remain open after the current-truth cleanup. It does not turn historical aliases into new findings.

## `AUDIT-PRO-SITEMAP-ROOT-ONLY`

Status: **open, narrowed**.

`node scripts/audit-pro.js` passes on the exact source, but its sitemap coverage loop is based on repository HTML discovered by `walk(ROOT)` while `dist/` is explicitly skipped. The check therefore validates committed/root HTML files and cannot by itself prove coverage of Astro-only generated routes. Exact source evidence:

- `scripts/audit-pro.js:102-139` — recursive repository walk with `dist` in `skipDirs`;
- `scripts/audit-pro.js:867-880` — sitemap URLs are compared against `htmlPages` derived from that source walk.

Production safety is covered separately by the exact readiness/Pages chain and public URL/dist publication contracts. The remaining defect is audit scope/ownership, not a currently broken sitemap.

## `STRANGLER-HYGIENE`

Status: **open, narrowed to migration/reference debt**.

The exact current-source inventory proved:

- 75 production routes;
- 0 strict-native production routes with legacy runtime markers;
- 0 production routes with legacy imports;
- 52 `legacyPath` declarations retained only as parity/migration references;
- production-like build still copies the legacy publication corpus into `dist` where Astro ownership does not replace it.

The runtime is clean, but the migration/reference surface is not zero. The finding remains open until every retained legacy path has an explicit owner decision and the copy surface is reduced or frozen by policy.

Evidence: current-source legacy inventory run `29966482139`, artifact `8548013735`; exact production build on `a73f609f` in current-source forensic run `29973088988`, artifact `8550461930`.

## `TTS-DL-NO-TABLOCK`

Status: **open**.

The TTS delivery verification identifies no cross-tab ownership/lock around the large model download. Two tabs can independently initiate the same delivery work. This is separate from consent, synchronous unzip and revision pinning.

Canonical evidence remains `incoming/tts-delivery-architecture-verification-2026-07-08/REPORT.md`. No current source commit or browser witness in the 2026-07-23 forensic run proves this cross-tab race closed.

## `REG-001`

Status: **open external hosting/security-header decision**.

Live `HEAD` responses for `/` and `/karty/avraam/` on 2026-07-23 contain:

- `server: GitHub.com`;
- `strict-transport-security: max-age=31556952`;
- no response-level `Content-Security-Policy`;
- no `X-Frame-Options`;
- no `Referrer-Policy`;
- no `Permissions-Policy`.

The pages still carry their HTML/meta security policy, but GitHub Pages does not expose the additional response headers through repository configuration. Closing this finding requires an explicit hosting/proxy decision or a documented by-design acceptance.

Evidence: exact current-source forensic run `29973088988`, artifact `8550461930`, files `live-headers-root.txt` and `live-headers-avraam.txt`.

## Verified-current closures already promoted to the matrix

The same forensic run establishes the following current facts:

- `AUDIT-FORBIDDEN-JS-NAGORNAYA`: `js/nagornaya-bar-extras.js` is present in canonical `ALLOWED_JS`; `audit-pro` passes 170 checks.
- `GATE-CSS-IMPORTANT-RATCHET`: `css/site.css` has 183 `!important` declarations against a hard ceiling of 200; `css:layer:validate` and `audit-pro` pass.
- historical CSS syntax IDs `CSS-SYNTAX-001/002/003/005` and `CSS-DEAD-004`: exact patterns absent; css-tree parses all guarded engine stylesheets without errors.
- historical deploy-block IDs `DEP-BLOCK-EDITORIAL-REGISTRY`, `DEP-BLOCK-CSS-IMPORTANT-CEILING`, `DEP-BLOCK-MAPS-VALIDATE`, `DEP-BLOCK-AVRAAM-AUDIT`: exact current commands all exit 0.
- `AUDIT-ATLAS-DOC-PATH-LEAK`: PR #160 removed the two Atlas paths and PR #162 / `0f5b3307` removed the final source-comment occurrence.

## Map mobile smoke orchestration

The combined forensic workflow initially ran `smoke:maps:mobile` without its required HTTP server and received `ERR_CONNECTION_REFUSED`. The isolated witness run `29973088987`, artifact `8550488736`, started the server first and passed both production maps:

- `ishod`: overflow 0, runtime errors 0, undersized controls 0;
- `avraam`: overflow 0, runtime errors 0, undersized controls 0;
- final result: `Mobile maps clean`.

The failed first invocation is classified as test orchestration only. It does not justify a production map change or a new canonical bug row.
