# TLP-ROUTE-REDIRECT-001 — terminal closure reverify

Date: 2026-09-11
Audit issue: #434
Product issue: FedorMilovanov/TheLegendaryPoet#490
Product PR: FedorMilovanov/TheLegendaryPoet#491

## Product closure identity

- Product base: `81b98ca045649b9f73de33c1cd850b7af932fc42`
- exact certified head: `bdb72afc38baaa773657b101963d6865ef9399f5`
- CAS squash/resulting Product main: `b216e100d51eef951fb7ef170c4e2689d89064bc`
- tested tree: `210b2311614c23b59a3c256bb11cc793385579f5`
- resulting tree: `210b2311614c23b59a3c256bb11cc793385579f5`
- Product issue #490: closed / completed

## Exact-head certification

All substantive Product workflows were terminal-success on the same certified head:

- CI #3978
- Project contracts #1089
- Site route integrity audit #1984
- Brand deep reference and motion audit #2001
- Hall web runtime proof #25
- Manual Browser QA #3037
- Ready-state Merge certification #125

Request Pages deployment #2348 was expectedly skipped.

Final Product race barrier: protected `main` remained at the PR base, candidate was `behind=0`, the diff contained exactly eight route/hosting-owned files, reviews were 0 and unresolved review threads were 0.

## Terminal outcome

`TLP-ROUTE-REDIRECT-001` is closed:

- the five legacy aliases are derived from the single `src/routes/route-contract.json` authority;
- the production build materializes explicit alias HTML documents into `dist` instead of relying on client-side SPA bootstrap as redirect authority;
- each alias document carries `noindex,follow`, canonical target, immediate meta refresh, `location.replace`, and a readable fallback link;
- the Pages-like static-host audit proves the initial source URL returns the materialized alias document before browser navigation;
- browser QA then proves final canonical target semantics;
- unknown routes keep truthful dedicated 404 behavior;
- inert Netlify-style `public/_redirects` and Vercel-only `vercel.json` configs are retired so they no longer imply false production authority.

`TLP-AUDIT-004` narrows only by removal of the redirect/hosting proxy gap. A11Y runtime, discovery, analytics consent, live community-production and analytics-route roots remain active and are not reclassified.

## Matrix disposition

With AuditRepo main observed at the authoritative 7-root state:

- P1 stays 1;
- P2 changes `5 → 4`;
- P3 stays 1;
- total active changes `7 → 6`.

This receipt becomes authoritative only after fresh exact-head AuditRepo Validate + Workflow Preflight and CAS squash merge of that exact Audit head.
