# Reverify — TLP-ANALYTICS-PROPERTY-001 closure — 2026-09-13

## Scope

Terminal closure of the last GA4 property/web-stream authority and live ingestion root.

- Product repair PR: #510 `fix(analytics): restore canonical gtag transport queue`.
- Exact certified head: `dfebe307c2ebd63434995b32a2b7848c567ff3dd`.
- CAS squash/resulting main: `c7e3e3b4e4b036307f3f0d05d451109c839e5ef8`.
- Tested/resulting tree: `6cc7fddef71c002b8af011e9c839c20c4b052931` (identical).
- Product issue #498: completed.

## Authority resolution

The earlier external ambiguity is resolved by direct Google Analytics Admin inspection under the owning account:

- property: The Legendary Poet / `547331637`;
- web stream name: `Poet`;
- stream ID: `15336366137`;
- website: `https://thelegendarypoet.ru/`;
- Measurement ID: `G-6NT4248RKK`.

That Measurement ID exactly matches the production GitHub variable and live bundle. No ID rotation or new stream creation was required.

## Root cause

The production provider configuration and consent lifecycle were correct, but the local gtag bootstrap did not match Google's canonical queue contract.

Before #510:

- production loaded `gtag.js?id=G-6NT4248RKK`;
- consent could be granted and `ga-disable-G-6NT4248RKK` became false;
- semantic `page_view` commands appeared in `dataLayer`;
- nevertheless no Google Analytics collector request was emitted.

Controlled same-origin A/B proof isolated the difference:

- canonical `function gtag(){dataLayer.push(arguments)}` emitted `POST region1.google-analytics.com/g/collect`;
- the former rest-args shim `dataLayer.push(args)` queued plain Arrays and emitted zero collector requests.

## Product repair and exact-head proof

#510 changes only the Google command queue shape to Google's canonical Arguments object and updates the existing analytics QA to normalize array-like commands while explicitly asserting config/page_view use `[object Arguments]`.

No consent threshold, Measurement ID, semantic route authority or Yandex lifecycle changed.

Exact-head workflows completed success:

- CI `34770438254`;
- Project Contracts `34770438274`;
- Site Route Integrity `34770438261`;
- Brand Deep `34770438262`;
- Merge Certification `34770438260`;
- Manual Browser QA `34770438252`.

Local exact-head live-ID transport proof also generated a real `g/collect` request with `tid=G-6NT4248RKK` and `en=page_view`; that localhost hit was deliberately intercepted and aborted before reaching Google.

## Resulting-main / production proof

On `main@c7e3e3b4`:

- Project Contracts `34771503611`: success;
- CI `34771503640`: success;
- Brand Deep `34771503618`: success;
- Brand Raster `34771503613`: success;
- Site Route Integrity `34771503628`: success;
- GitHub Pages `34771503602`: success;
- IndexNow `34771594535`: success;
- resulting-main Manual Browser workflow `34771503609` completed success, including `analytics-route-qa`, WebKit HOME, premium HOME, premium iPhone and the final core browser tail.

Fresh post-deploy production ingestion proof used a clean browser context and the real privacy-page consent control:

- consent persisted as `granted`;
- production loaded the exact `G-6NT4248RKK` Google tag;
- `ga-disable-G-6NT4248RKK` was false;
- production emitted `POST https://region1.google-analytics.com/g/collect`;
- collector parameters included `tid=G-6NT4248RKK` and `en=page_view`;
- Google returned HTTP `204`;
- a subsequent `user_engagement` collector request was emitted.

This is live transport acceptance against the verified owning stream, not a mocked provider call or dashboard inference.

## Disposition

`TLP-ANALYTICS-PROPERTY-001` is retired: resulting-main Manual Browser `34771503609` completed success, including the core browser tail.

Matrix movement:

- P1 stays 1;
- P2 `1 -> 0`;
- P3 stays 0;
- total active `2 -> 1`.

The remaining active root is only `TLP-COMM-ABUSE-001`, whose human-backed Turnstile adversarial certification remains intentionally independent.
