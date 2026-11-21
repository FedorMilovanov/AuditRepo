# Optional Work Queue — Milovi Cake

This file is not a second bug matrix.

## Wedding-page settled-data re-evaluation

- Product issue: `Milovi_Cake#84` (`open`).
- Current wedding landing page entered its present form on 2026-09-06; PR `#139` (`ea40b669`, 2026-11-04) adjusted only the prepaint theme bootstrap and explicitly did not reset the SEO observation window (2026-11-12 checkpoint).
- Early GSC data shows relevant wedding-intent demand near positions 8–20.
- **Next check:** compare settled dedicated-page impressions/CTR/rank against homepage/UTM spillover in GSC and only then decide whether snippet/visible-pricing copy needs a bounded change.

## GSC Product snippets / Merchant listings reconciliation

- Product issue: `Milovi_Cake#145` (`open`, created `2026-11-06`).
- Triggered by 2026-10-28 Google Search Console enhancement notifications (`Product` objects missing `offers`/`review`/`aggregateRating` for rich-result eligibility, and missing `availability` in `offers`).
- `tests/test_schema_contract.py` intentionally guards honest markup (per-kg custom cakes omit a fixed total `Offer`, single-item bento/meringue-roll offers omit unverified `InStock`, and external/non-visible reviews are never aggregated).
- **Next check:** read current live GSC Product snippets / Merchant listings reports (exact affected URLs and validation state) and compare deployed JSON-LD against `main`; never invent fake stock, ratings, or fixed prices to silence warnings.

## Post-deploy recrawl/indexing follow-up

- `Deploy to GitHub Pages` on `main@8c67865d37e79f2772558f90c231f3aa2d604fc5` (`2026-11-21`, run `44902091395`) succeeded and notified IndexNow after live release proof.
- **Next check:** verify URL Inspection / sitemap download state in GSC after recrawl without rewriting healthy indexable pages prematurely.
