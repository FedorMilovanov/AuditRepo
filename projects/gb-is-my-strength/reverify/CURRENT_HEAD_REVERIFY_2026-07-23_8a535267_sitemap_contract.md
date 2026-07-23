# CURRENT HEAD REVERIFY — exact `8a535267` sitemap contract

Date: 2026-07-23  
Source repository: `FedorMilovanov/gb-is-my-strength`  
Exact source SHA: `8a5352671375fdb01b6c30273c25ec4283a13f69`  
Source PR: #163 — `fix(audit): derive sitemap coverage from canonical route registry`

## Exact production chain

- Metadata & IndexNow Readiness: run `30006414898` — **success** on exact `8a535267`.
- Deploy to GitHub Pages: run `30007024100` — **success** on the same SHA.
- Readiness event: `push`; Pages event: `workflow_run`.
- AuditRepo observer: run `30006649281` — **success**.
- Immutable observer artifact: `8563907298`, digest `sha256:4125998217615674be900fbe19b1d6a59f7a664bf41360067ec489fd94e88c90`.

The production deployment is exact: the readiness and Pages API records both contain
`head_sha=8a5352671375fdb01b6c30273c25ec4283a13f69` and completed with
`conclusion=success`.

## Source contract that landed

PR #163 removed sitemap coverage inference from committed/root HTML and replaced it
with the existing effective route registry:

- canonical ownership remains `migration/page-ownership.json` plus route profiles;
- a sitemap obligation requires `owner.status=production-dist`;
- an explicit `profile.seo.indexable=false` is the only production-route exemption;
- 66 indexable production routes are required by the current contract;
- nine production noindex routes are intentionally excluded: `/izbrannoe/` and eight
  unfinished holding maps;
- the built application asset `/konfessii/russkij-baptizm/_app/` is excluded by
  ownership status, not by a second sitemap allowlist.

`audit-pro` now treats the following as blocking errors:

- an indexable production route missing from sitemap;
- a same-origin sitemap route absent from canonical ownership;
- duplicate URL/route entries;
- foreign, invalid or non-canonical URLs.

## Permanent adversarial evidence

The new regression test proves the contract does not fall back to root HTML:

1. it discovers a real indexable production route without committed root HTML,
   removes that route's `<loc>` and requires failure;
2. it injects a synthetic Astro-only `production-dist` route and requires failure;
3. it proves only explicit `seo.indexable=false` exempts a production route;
4. it mutates duplicate, unregistered and foreign URLs.

Pre-merge exact head `5789491005a3c2a169363265f95c90e3dfe8952a` passed:

- Shared Files Guard `30005924336`, including actionlint;
- Route Registry Validators `30005924174`;
- registry, migration and content-source contracts in read-only mode;
- `audit-pro` with the canonical sitemap contract;
- production-like build;
- public-surface Chromium matrix: **3428/3428 PASS** across 75 routes and
  320/390/1440 viewports;
- route semantics: **126/126 PASS**;
- Nagornaya epistemic browser contract.

## Live sitemap witness

The observer fetched the live origin after exact Pages completion:

- HTTP request succeeded;
- `<loc>` count: **66**;
- SHA-256: `5f3fa280af1ddc73f166decce47535d48ec60718375dd7c0418ea3675f82a801`.

No rendered page, route content, CSS or browser runtime changed in PR #163. The live
witness therefore targets the publication artifact that this lane owns: `sitemap.xml`.

## Canonical status decision

`AUDIT-PRO-SITEMAP-ROOT-ONLY` is **closed** at `8a535267`.

The closure is intentionally narrow. These broader findings remain open:

- `AUDIT-PRO-ROOT-ONLY` — other `audit-pro` HTML checks still derive from the root
  publication corpus;
- `SEO-AUDIT-ROOT-ONLY` — `seo-audit.js` still excludes `dist/`;
- `STRANGLER-HYGIENE` — migration/reference debt remains even though runtime ownership
  is clean.

Closing the sitemap sub-gap must not be interpreted as closing those separate scopes.

## Concurrent-agent boundary

At this verification point source PR #161 (universal glossary) and source PR #156
(Gill editorial/research) remain active. Reader R6 and broader SEO/publication refactors
must re-check their file sets against those branches before writing shared files.
