# REVERIFY — GA4 property authority — 2026-09-12

## Anchor

- Product source anchor: `b216e100d51eef951fb7ef170c4e2689d89064bc`.
- Production GitHub Actions variable: `VITE_GA_ID=G-6NT4248RKK`.
- Product tracking issue: `TheLegendaryPoet#498`.

## Independent witnesses

1. Product repository configuration exposes `VITE_GA_ID` to the build.
2. The deployed production JavaScript bundle contains the same `G-6NT4248RKK` Measurement ID.
3. GSC Wizard links `sc-domain:thelegendarypoet.ru` to GA4 property `547331637`, but that property reports 0 sessions, 0 users and 0 events across the audited 180-day window.
4. Independent Windsor GA4 inspection returns no web-stream / Measurement-ID row for property `547331637`.
5. The same Windsor path correctly resolves Milovi Cake property `537251354` to production Measurement ID `G-94ZZ5B8YNY`, stream `14860814056`, hostname `milovicake.ru`.

## Classification

This is not evidence that `AnalyticsRouteTracker` is responsible for the zero analytics corpus. Route semantics remain a separate Product root. The prerequisite problem is external GA4 property/web-stream authority and is admitted as a bounded P2 control-plane root.

## Preservation boundary

Do not change `VITE_GA_ID`, consent semantics or route tracking merely to make the linked property non-zero. First establish the authoritative property/web stream that owns `G-6NT4248RKK`.

## Closure proof

1. Resolve the owning GA4 property/web stream for `G-6NT4248RKK`.
2. Align the connected analytics property/tooling with that authority, or deliberately configure property `547331637` and use its verified Measurement ID.
3. Prove a real live `page_view` reaches the intended property.
4. Only then continue route-data-quality closure for `TLP-ANALYTICS-ROUTE-001`.

Until then `TLP-ANALYTICS-PROPERTY-001` remains an active P2 control-plane root.
