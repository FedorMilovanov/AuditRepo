# Reverify — TLP-ANALYTICS-PROPERTY-001 terminal closure — 2026-09-13

## Scope

Terminal reconciliation of the external GA4 property / web-stream authority root.

- Product repair: PR #510 `fix(analytics): restore canonical gtag transport queue`.
- Exact certified head: `dfebe307c2ebd63434995b32a2b7848c567ff3dd`.
- Resulting Product main: `c7e3e3b4e4b036307f3f0d05d451109c839e5ef8`.
- Tested/resulting tree: `6cc7fddef71c002b8af011e9c839c20c4b052931` (identical).

## GA4 ownership authority

Google Analytics Admin was checked on the owner account and identified the existing TLP web stream:

- property: `547331637` — The Legendary Poet;
- stream name: `Poet`;
- stream ID: `15336366137`;
- website: `https://thelegendarypoet.ru/`;
- Measurement ID: `G-6NT4248RKK`.

This exactly matches the production GitHub variable and deployed bundle. No Measurement ID rotation and no new stream creation were required.

## Root cause repaired by Product #510

Production had the correct Measurement ID, consent lifecycle and loaded `gtag.js`, but the custom bootstrap queued plain JavaScript Arrays. Google's canonical bootstrap queues the function `Arguments` object through `dataLayer.push(arguments)`.

The prior shape looked valid to source/browser proxy assertions but did not produce Google measurement requests. #510 changed only that transport shape and hardened QA to require canonical array-like command entries.

## Exact-head proof

Product #510 exact-head workflows all completed success:

- CI `34770438254`;
- Project contracts `34770438274`;
- Site route integrity `34770438261`;
- Brand deep reference/motion `34770438262`;
- Manual Browser QA `34770438252`;
- Merge certification `34770438260`.

Local exact-head proof also showed a real `g/collect` request with `tid=G-6NT4248RKK` and `en=page_view`; that localhost hit was intercepted before reaching Google.

## Resulting-main and production collection proof

On resulting `main@c7e3e3b`:

- CI `34771503640`: success;
- Project contracts `34771503611`: success;
- Site route integrity `34771503628`: success;
- Brand deep `34771503618`: success;
- Brand raster `34771503613`: success;
- GitHub Pages `34771503602`: success;
- Manual Browser QA `34771503609`: success;
- Notify IndexNow `34771594535`: success.

Fresh normal production browser proof on `https://thelegendarypoet.ru/privacy/` used the real consent UI and observed:

- persisted analytics consent: granted;
- `ga-disable-G-6NT4248RKK = false`;
- `gtag.js?id=G-6NT4248RKK` loaded;
- `config` and `page_view` queue entries use `[object Arguments]`;
- real production `POST https://region1.google-analytics.com/g/collect`;
- collector parameters included `tid=G-6NT4248RKK` and `en=page_view`;
- Google returned HTTP `204`;
- a subsequent `user_engagement` collector request was also emitted.

This is terminal end-to-end evidence from production route + user consent + verified owning stream to Google's collector.

## Reporting-lag note

The standard GA4 reporting API may still return zero for the same calendar day because it is not a realtime endpoint. That lag does not contradict the direct collector HTTP 204 witness and does not reopen stream ownership or transport authority.

## Disposition

`TLP-ANALYTICS-PROPERTY-001` is `closed-by-authoritative-stream-and-live-collector-proof`.

Matrix movement:

- P1 stays `1`;
- P2 `1 -> 0`;
- P3 stays `0`;
- total active `2 -> 1`.

The only remaining active TLP root is the human-backed community adversarial proof `TLP-COMM-ABUSE-001`.
