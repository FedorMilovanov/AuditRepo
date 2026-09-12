# Optional Work Queue — Milovi Cake

This file is not a second bug matrix.

## GA4 `generate_lead` key-event follow-up

- Product issue: `Milovi_Cake#82`.
- Production analytics emits standard `generate_lead` for contact leads after consent.
- GA4 property `537251354` is wired to production Measurement ID `G-94ZZ5B8YNY`.
- No real `generate_lead` row had appeared by the final 2026-09-12 check.
- **Next check:** after a real contact click appears in GA4 Events, mark that exact event as a Key Event and verify the resulting conversion rate.
- Do not create a synthetic/fake event merely to make the dashboard non-zero.

## Wedding-page settled-data re-evaluation

- Product issue: `Milovi_Cake#84`.
- Current wedding landing page entered its present form on 2026-09-06.
- Early GSC data shows relevant wedding-intent demand near positions 8–20, but only a few settled post-change days exist.
- **Next check:** after at least ~14 settled days, compare dedicated-page impressions/CTR/rank against homepage/UTM spillover and only then decide whether snippet/visible-pricing copy needs a bounded change.

## Post-deploy recrawl/indexing follow-up

- 2026-09-12 IndexNow submission for the full 29-URL production corpus succeeded against IndexNow, Bing and Yandex.
- Google had not yet re-fetched the corrected suburb freshness signals at audit time.
- **Next check:** compare URL Inspection / sitemap download state after recrawl. Do not rewrite technically healthy pages merely because they are still `Discovered` or `Unknown` before the new freshness signal is consumed.
