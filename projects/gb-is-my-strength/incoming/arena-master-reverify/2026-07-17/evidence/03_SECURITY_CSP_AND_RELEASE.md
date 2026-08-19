# Evidence 03 — CSP ownership and source-to-release divergence

## W2 — literal policy inventory

A static scan of `src/**/*.astro` for literal:

```html
<meta http-equiv="Content-Security-Policy" content="…">
```

found **62** occurrences. Normalizing only whitespace produced **7** distinct full-policy strings. Extracting the `img-src` directive produced **4** distinct allowlists:

| `img-src` family | Literal source occurrences | Representative source owners |
|---|---:|---|
| Yandex + Wikimedia + `data:`/`blob:`, no explicit site origin | 45 | `ArticlesPageChrome.astro`, `AboutPageChrome.astro`, article-pilot heads |
| same + `https://gospod-bog.ru` | 2 | `PastorSeriesPageHead.astro`, `HomePageHead.astro` |
| Yandex + explicit site origin, no Wikimedia | 12 | Baptist-series heads |
| minimal Yandex family, no site origin/Wikimedia | 3 | Gill Context, Lot, Gill Spravochnik heads |

Counts are static source occurrences, not route counts or a claim that each difference causes a blocked request. Because `'self'` covers same-origin image requests, an explicit `https://gospod-bog.ru` entry does not by itself prove a functional difference.

`X-Content-Type-Options` is likewise written by individual page/head components rather than a common security owner.

## W2 — BaseLayout omission

At the selected anchor, `src/layouts/BaseLayout.astro` contains neither `Content-Security-Policy` nor `X-Content-Type-Options`.

The only direct current page importers found were:

```text
src/pages/izbrannoe/index.astro
src/pages/hard-texts/genesis-6/index.astro
```

This is meaningful source ownership evidence: a source-only route assessment cannot infer a shared security policy from `BaseLayout`.

## W4 — current live emitted documents contradict a live-gap claim

Each current live response returned HTTP 200 and includes one CSP meta tag in the `<head>`:

| Live route | HTTP CSP header | CSP meta in returned HTML |
|---|---|---|
| `https://gospod-bog.ru/hard-texts/genesis-6/` | absent | present |
| `https://gospod-bog.ru/izbrannoe/` | absent | present |

The returned documents begin with a CSP meta policy that includes a broader image allowlist (including same origin, Wikimedia, LOC/tile/NASA/Photoshelter sources) than the `BaseLayout` source itself declares—which is none.

**Bounded conclusion:** source and emitted/live identity are divergent. This confirms a release/ownership concern but *does not* establish that either current live route lacks CSP. The active `SECURITY-CSP-GAPS` wording must stay constrained to source-versus-release divergence unless a new exact live negative witness appears.

## System recommendation / closure bar

`FRAGMENTED-SECURITY-OWNERSHIP` is the appropriate common owner. A bounded system repair should:

1. define a single policy/head generator plus explicit, reviewed per-route extensions;
2. emit CSP and XCTO consistently where the deployment model permits;
3. test the source owner against a production-like emitted artifact so a source omission cannot silently be hidden by stale/generated output;
4. run selected live/negative checks for actual required remote images/scripts before narrowing permissions.

No security exploit, data disclosure, or image-loading failure was reproduced by this evidence. Such claims require adversarial/runtime witnesses beyond this source/live metadata inventory.
