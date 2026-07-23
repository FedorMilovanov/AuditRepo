# CURRENT HEAD REVERIFY — exact `0f5b3307` production

Date: 2026-07-23  
Source repository: `FedorMilovanov/gb-is-my-strength`  
Exact source SHA: `0f5b330799292d995c62bbb7d63a83870d93318e`

## Exact deploy chain

- Metadata & IndexNow Readiness: run `29972524675` — **success** on exact `0f5b3307`.
- Deploy to GitHub Pages: run `29972909431` — **success** on the same SHA.
- All 30 deploy stages passed: static publication, Astro build, route ownership, Pagefind, visual parity, production-like audits, JSON-LD, PremiumControls, Gill browser smokes, broad runtime, content coverage, Service Worker, Pages deployment and IndexNow.

## Rendered-output boundary

Commit `0f5b3307` changes only one source comment in:

`src/components/ui/premium-controls/PremiumControlAnchor.astro`

The change replaces a workspace-specific documentation reference with explicit repository identity. It does not alter Astro markup, CSS, JavaScript, data or generated HTML. Therefore the rendered output is byte-equivalent to the previously deployed `a73f609f` source for this change class.

The prior live witness remains applicable to rendered pages and recorded:

- `nagornaya-matthew-luke-observation-matrix` present;
- `nagornaya-part4-green-model` present;
- `nagornaya-part4-thomas-model` present;
- Play controls expose `aria-haspopup="dialog"` and initial `aria-expanded="false"`;
- `/nagornaya/chast-1/` SHA-256: `d8a15ef9a83ead0dea12f29ad64b6bb0d7904397fecda7abc9de4ea33a79ffeb`;
- `/nagornaya/chast-4/` SHA-256: `45168405d3b946a8e1cae295affa75947ca668ed5941f511a5c4096f19b39c6d`.

## Current-source forensic closures

Exact source audit on `a73f609f` plus the comment-only descendant `0f5b3307` proves:

- `AUDIT-ATLAS-DOC-PATH-LEAK` — closed by PR #160 and final PR #162 cleanup;
- `AUDIT-FORBIDDEN-JS-NAGORNAYA` — canonical allowlist contains `js/nagornaya-bar-extras.js`; `audit-pro` passes 170 checks with 0 errors;
- `GATE-CSS-IMPORTANT-RATCHET` — `css/site.css` has 183 `!important` declarations against hard ceiling 200; both CSS gates pass;
- `ASTRO-P0-03` — map stats mismatches are fatal in route validation; all route checks pass;
- `ASTRO-P0-04` — Avraam HTML and route data share one canonical set of 19 non-context places; 27/27 audit assertions pass;
- historical CSS syntax signatures `CSS-SYNTAX-001/002/003/005` and `CSS-DEAD-004` are absent, and guarded stylesheets parse cleanly.

Evidence runs:

- current-source debt audit `29973088988`, artifact `8550461930`;
- map mobile HTTP witness `29973088987`, artifact `8550488736`.

## Map mobile smoke classification

The first combined forensic run invoked `smoke:maps:mobile` without starting its required local HTTP server and produced `ERR_CONNECTION_REFUSED` for `ishod` and `avraam`. This was an orchestration failure, not a map defect.

The isolated rerun started the server first and passed:

- `ishod`: no horizontal overflow, no runtime errors, no undersized controls;
- `avraam`: no horizontal overflow, no runtime errors, no undersized controls;
- final result: `Mobile maps clean`.

No production map change is required from that failed first invocation.

## Open findings preserved

The following remain open and must not be closed by aliasing or historical inference:

- `AUDIT-PRO-SITEMAP-ROOT-ONLY` — `audit-pro` still derives sitemap coverage from committed/root HTML while `dist/` is skipped; production is safe through separate registry/dist gates, but the local audit scope remains incomplete;
- `STRANGLER-HYGIENE` — runtime is legacy-clean, while migration/reference debt remains;
- `TTS-DL-NO-TABLOCK` — no current evidence closes cross-tab model-download ownership;
- `REG-001` — GitHub Pages does not provide the desired response-level security headers; requires hosting/proxy or explicit by-design decision.

## Concurrent work boundary

At this reverify point:

- source PR #161 is the active universal glossary contract and touches shared glossary/runtime/publication files;
- source PR #156 is the active Gill editorial lane;
- Research PR #7 and AuditRepo PR #27 own the Gill research corpus and its audit record.

Unrelated work must not overwrite those branches. New source work should be isolated, compared against active PR file sets, validated, and merged into `main` only after exact checks.
