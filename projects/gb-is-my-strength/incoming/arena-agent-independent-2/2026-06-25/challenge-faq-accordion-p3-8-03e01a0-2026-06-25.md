# Challenge: P3-8 / Round 7 FAQ accordion “module not loaded” is not a runtime bug on current dist

## Meta
- Agent: `arena-agent-independent-2`
- Date: 2026-06-25
- Source HEAD: `03e01a0008de34d654175ea600cdf9f22b2351b4`
- Evidence: `evidence/faq-accordion-browser-03e01a0.txt`
- Method: production-like dist + Playwright browser click smoke

## Target finding

- Existing ledger: `P3-8 — Antisovetov FAQ accordion HTML present but faq-accordion.js never loaded`
- Round 7 expansion: FAQ module not loaded on 5+ article pages, therefore accordions non-functional.

## Challenge summary

The static statement “`js/modules/faq-accordion.js` is not loaded” is true, but the conclusion “FAQ accordions do not work” is false on current production-like dist.

`site.js` and `enhancements.js` still contain FAQ handlers, and a Playwright click test confirms the accordion opens on all tested FAQ routes.

Static grep:

```text
2 js/enhancements.js:faq-accordion__q
1 js/site-modules.js:faq-accordion__q
1 js/site.js:faq-accordion__q
```

Browser witness against `dist/`:

```text
/articles/20-antisovetov-pastoru/ before expanded=false/open=false → after expanded=true/open=true
/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/ before expanded=false/open=false → after expanded=true/open=true
/articles/kod-da-vinchi/ before expanded=false/open=false → after expanded=true/open=true
/articles/krajne-li-isporcheno-serdce/ before expanded=false/open=false → after expanded=true/open=true
```

`window.__gbFaqAccordion=false` simply means the standalone extracted module is not loaded. It does **not** prove missing functionality because another loaded runtime path handles the same UI.

## Recommended canonical status

- `P3-8` as originally worded (“FAQ never works”) should move to `false-positive-current` or be rewritten as a low-priority dead-code/decomposition debt.
- If kept, title should be: “Extracted `js/modules/faq-accordion.js` is unused; FAQ behavior still handled by legacy `site.js`/`enhancements.js`.”
- Do **not** create a repair order that blindly adds `faq-accordion.js` to pages; that risks double-binding with existing handlers unless the old handler path is removed first.

## Suggested follow-up

A safe cleanup lane would choose one canonical FAQ runtime:

1. keep legacy handlers and remove/ignore the unused extracted module, or
2. load `site-modules.js`/`faq-accordion.js` and delete/disable the duplicate FAQ handlers in `site.js`/`enhancements.js`.

But this is not a user-visible broken accordion bug on `03e01a0`.
