# ARTICLE-INTERACTIVE-AUDIT-SCOPE-WITNESS

## Purpose

Current workflow/source evidence under `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT`. This is **not** a separate work unit.

It answers a specific verifier question: “If Krajne/Gill are already in a real production-like Playwright audit, why does that not refute the missing-capability finding?”

## The interactive workflow is real and production-like

Current `.github/workflows/interactive-audit.yml`:

- triggers the runtime audit when `src/components/article-pilots/**`, reader-platform, runtime, CSS/JS or other runtime-sensitive paths change;
- checks out the exact PR/push head;
- runs `npm ci`;
- installs Chromium + WebKit;
- runs `npm run strangler:build:production-like`;
- builds Pagefind into `dist`;
- serves `dist` from localhost;
- runs `npm run interactive-audit` against that production-like server and records durable evidence.

Therefore this is **not** a legacy-root/shadow-html false witness.

## Krajne/Gill are actually in the suite

Current `scripts/interactive-audit.js` includes Krajne and multiple Gill routes in its `SERIES_URLS`. It also uses Krajne/Gill in quiz, glossary, theme, search and media subsets.

For series pages, however, `checkSeries()` measures the shared shell/canonical chrome contract:

- GBS world / rail existence and geometry;
- current part + next navigation;
- timeline where required;
- old/legacy series UI absence;
- mobile bottom bar / part and series TOC overlays;
- open/close behavior;
- mobile overflow.

That is a legitimate and useful contract for the series engine.

The script contains no behavioral test for the retained feature markers involved in the migration root:

```text
.map-trigger / strategicMapData
.faq-accordion__q
.heading-anchor / headingAnchors
.flip-card / heart-flip-card
```

The exact-head Deploy Candidate artifact independently showed the same boundary: non-vacuous Gill layout/TTS execution, zero assertions for these capability families.

## System interpretation

The current state is therefore:

```text
production-like browser audit exists ✅
relevant series routes are exercised ✅
canonical shared chrome is exercised ✅
retained feature capability completeness is not in the matrix ❌
```

This is stronger than saying “there are no browser tests.” There are good browser tests; the missing contract dimension is **which semantic capabilities must survive a strict-native migration**.

A durable repair should extend the existing production-like browser framework with representative capability cases rather than invent a parallel testing stack.

## Boundary

- No criticism of the current series chrome assertions as false; they measure what they claim.
- No claim that every interactive element needs an exhaustive click-everything test.
- The systemic need is a capability registry/selection mechanism so retained features automatically contribute representative browser cases when their markup/config survives migration.
