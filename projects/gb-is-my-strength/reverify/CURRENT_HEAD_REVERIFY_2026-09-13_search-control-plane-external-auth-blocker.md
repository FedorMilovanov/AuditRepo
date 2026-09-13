# Current-head reverify — search control plane external-auth blocker — 2026-09-13

## Classification

- Root: `GBS-SEARCH-CONTROL-PLANE-001`
- Class: owner/control-plane decision, not a Product page-code defect.
- Product tracking: `gb-is-my-strength#1996`.
- Product current `main` at this reverify: `81b3cb63013da25cdaa096730b17fbca61023da8`.
- Prior detailed receipt: `CURRENT_HEAD_REVERIFY_2026-09-12_search-control-plane.md`.

## Current authoritative reads

### Google Search Console — URL-prefix property

Property: `https://gospod-bog.ru/`

Authoritative sitemap API result:

- submitted sitemaps: **0**

Current 90-day performance:

- clicks: **5**
- impressions: **232**
- CTR: **2.155%**
- average position: **6.664**
- settled through: **2026-09-10**

Indexing Tracker:

- total: **92**
- indexed: **36**
- not indexed: **56**
- pending: **0**
- errors: **0**
- warnings: **0**
- last check: `2026-09-12T09:44:41.611Z`

The tracker numbers are unchanged from the prior same-day control-plane pass. No fresh evidence justifies converting the 56 currently-not-indexed URLs into a bulk page-content defect.

### Google Search Console — domain property

Property: `sc-domain:gospod-bog.ru`

Current read still fails with:

```
forbidden: Search Console denied access to this property.
```

The domain-property ownership/access boundary therefore remains unresolved.

### Bing Webmaster

Property: `https://gospod-bog.ru/`

Current reads:

- traffic rows: **0**
- clicks: **0**
- impressions: **0**
- crawl rows: **0**
- submitted feeds: **0**

Bing connectivity does not satisfy the Google sitemap-submission boundary.

## Write-path census

The missing Google sitemap submission was tested against every currently available connected write surface.

### GSC Wizard

- property is connected and readable;
- `list_sitemaps` returns the authoritative empty list;
- available tool surface contains no Search Console sitemap submit/delete action;
- GSC Wizard site metadata may store sitemap URLs for reporting, but that is not a Google Search Console submission.

### Windsor.ai

Connector `searchconsole` is connected to `https://gospod-bog.ru/`.

Actual write-action enumeration returns:

```
actions: []
```

Therefore Windsor does not provide a sitemap submission path for this connector.

### Direct browser automation

A user-directed browser run opened the Google Search Console sitemap URL and attempted to submit exactly:

1. `https://gospod-bog.ru/sitemap.xml`
2. `https://gospod-bog.ru/sitemap-pastor-series.xml`

The run terminated at the authentication boundary because the browser profile had no saved Google credentials / authenticated Google session. No sitemap was submitted and no Search Console setting changed.

This was recorded back to Product tracking issue #1996 in comment `5648857116`.

## Root-cause boundary

The remaining mandatory action is external owner authentication/authorization, not repository code.

The production discovery surface itself is already present:

- live robots policy advertises the production sitemap endpoints;
- sitemap files are produced by Product;
- the URL-prefix Search Console property is readable;
- the failure is that Google has not received an explicit sitemap submission through an authenticated write surface.

## Closure boundary

1. Authenticate into Google Search Console for `https://gospod-bog.ru/`.
2. Submit:
   - `https://gospod-bog.ru/sitemap.xml`
   - `https://gospod-bog.ru/sitemap-pastor-series.xml`
3. Re-read the authoritative Search Console sitemap list and verify fetch/processing state.
4. Separately either:
   - verify `sc-domain:gospod-bog.ru` with the exact Google DNS TXT at the Cloudflare apex, or
   - explicitly retire/ignore that inaccessible domain property.
5. After recrawl, rerun URL Inspection on the same 92-URL corpus before admitting any page-specific content defect.

Until those owner actions occur, the root remains active.

## Negative boundaries

Do not count any of the following as closure:

- GSC Wizard metadata containing sitemap URLs;
- IndexNow submission;
- Bing feed/submission state;
- robots.txt advertising the sitemap;
- sitemap files being reachable on production.

Those are corroborating discovery surfaces, not authoritative Google Search Console sitemap submission.

## MASTER consequence

Active arithmetic remains unchanged:

- 1 system verification lane;
- 2 owner decisions;
- **3 active work units total**.

No Product code mutation is required or justified by this reverify.

---

# Terminal closure update — 2026-09-13

This section supersedes the earlier active-blocker conclusion above. The prior evidence remains preserved as history.

## Authoritative Google state changed

A fresh authoritative `list_sitemaps` read for the working URL-prefix property `https://gospod-bog.ru/` now returns one real Google Search Console submission:

- path: `https://gospod-bog.ru/sitemap.xml`;
- last submitted: `2026-09-13T06:50:03.552Z`;
- last downloaded by Google: `2026-09-13T06:50:04.331Z`;
- errors: **0**;
- warnings: **0**;
- submitted web URLs: **94**.

This is Google Search Console submission state, not GSC Wizard reporting metadata, IndexNow, Bing, robots.txt, or a mere reachable sitemap file.

## Secondary sitemap requirement retired as redundant

The live `https://gospod-bog.ru/sitemap-pastor-series.xml` contains exactly these three canonical production URLs:

1. `https://gospod-bog.ru/pastor-series/`
2. `https://gospod-bog.ru/articles/20-antisovetov-pastoru/`
3. `https://gospod-bog.ru/articles/diotrefy-nashego-vremeni/`

A live read of the already-submitted primary `sitemap.xml` shows all three URLs are already present there.

Therefore the secondary sitemap adds **0 unique discovery URLs**. Requiring a second explicit GSC submission is no longer a meaningful closure boundary; it would duplicate URLs already covered by the authoritative submitted primary sitemap.

Robots may continue advertising both sitemap files. That does not create a missing-discovery defect.

## Browser-auth recheck

A fresh user-directed Search Console browser automation attempted to access the Sitemaps UI with browser profile + vault enabled.

It redirected to Google Sign-In and reported no configured Google credentials. No Search Console state was changed.

This authentication limitation no longer blocks production discovery because the primary sitemap has already been submitted through another authenticated path and Google has downloaded it successfully.

## Domain-property disposition

`sc-domain:gospod-bog.ru` still returns Google 403 for the connected account.

This is now classified as a non-blocking duplicate-property access gap rather than an active production owner:

- canonical production is `https://gospod-bog.ru/`;
- that exact URL-prefix property is readable and operational;
- its authoritative sitemap state is healthy;
- no Product code, canonical route, sitemap coverage, or indexing-control action depends on the inaccessible domain property.

Domain-property DNS verification remains optional account hygiene and may be completed later if broader subdomain aggregation is desired. It is not required for the current canonical production origin.

## Product tracking disposition

Product issue `gb-is-my-strength#1996` received final evidence in comment `5651805686` and was closed `completed` on 2026-09-13.

No Product code mutation was required.

## Terminal root disposition

`GBS-SEARCH-CONTROL-PLANE-001` is **closed**.

Closure evidence is now:

- authoritative GSC sitemap submission exists;
- Google downloaded the sitemap;
- 0 errors / 0 warnings;
- primary sitemap covers the entire secondary sitemap URL set;
- second submission requirement is redundant rather than missing coverage;
- inaccessible domain property is non-blocking for the canonical production URL-prefix property;
- Product tracking issue #1996 is closed completed.

No page-specific indexing defect is admitted by this closure. Future Google indexing-selection changes should be evaluated after recrawl against the submitted primary sitemap.

## MASTER consequence

This root should be removed from active MASTER arithmetic in the next non-conflicting MASTER update.

At the time of this receipt update, AuditRepo PR #450 independently owns the same MASTER file to retire `FRAGMENTED-SECURITY-OWNERSHIP` as accepted platform risk. This closure intentionally does **not** modify MASTER or `CLOSURE_LEDGER.md` in parallel with that active lane.

Once #450 lands, the gb-is-my-strength MASTER can be reconciled to **0 active work units** by removing `GBS-SEARCH-CONTROL-PLANE-001` only.
