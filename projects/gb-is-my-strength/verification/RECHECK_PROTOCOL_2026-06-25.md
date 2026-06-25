# Recheck protocol — gb-is-my-strength — 2026-06-25

When reports disagree, use this order of trust:

## Trust order

1. **Browser + production-like dist** (`strangler:build:production-like`)
2. **Browser + plain dist** (`astro:build` only)
3. **Source + static grep / AST inspection**
4. **Historical statements in README / summaries**

## Why

This repo is not a pure Astro project.
Public artifact behavior can differ between:
- source HTML / Astro source,
- plain `astro:build`,
- and final production-like strangler artifact.

## Required labels in future reports

Every strong finding should say one of:

- `verified-source`
- `verified-build`
- `verified-browser`
- `verified-production-like-dist`
- `suspected`
- `needs-recheck`

## Minimum recheck set for disputed premium bugs

If a premium-controls bug is disputed, re-run on:
- `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- `/articles/kod-da-vinchi/`
- `/articles/20-antisovetov-pastoru/`
- `/articles/dzhon-gill-istoricheskiy-kontekst/`
- `/articles/dzhon-gill-chast-1-chelovek/`
- `/articles/dzhon-gill-spravochnik/`
- `/articles/krajne-li-isporcheno-serdce/`
- `/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/`
- `/nagornaya/chast-1/`

## Minimum commands

```bash
npm ci
npm run strangler:build:production-like
python3 -m http.server 8091 --bind 127.0.0.1 -d dist
AUDIT_BASE=http://127.0.0.1:8091 npm run interactive-audit
```

Then perform targeted Playwright spot checks for disputed routes.
