# ARTICLE-CAPABILITY-CI-ARTIFACT-WITNESS

## Purpose

Independent exact-head CI/artifact witness for `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT`.

This file does **not** add a new Product work unit. It records why current green admission/browser evidence is compatible with the missing-capability root: the exact-head browser suites exercise the shared Gill/series chrome, but their asserted capability set does not include the retained strategic-map, FAQ, heading-anchor or reversible-card behaviors documented in the root report.

## Exact Product boundary

Product PR #1735 (`fix(css): close layer validation over governed roots`) was based on:

```text
bcb41e57d7f9c011ac597c51a240fba19152a908
```

and its exact PR head was:

```text
f93567cece49530b81a7cdb4f8cbd72d97736358
```

The PR changed exactly one file:

```text
scripts/css-layer-validator.js
```

Therefore the article runtime/composition owners relevant to this evidence are byte-equivalent to the primary `bcb41e57...` forensic anchor.

The PR merged as Product main:

```text
01894214765d7ab6e51a7eea1fb7f239c6591af8
```

## Exact-head CI result

GitHub Actions associated with `f93567ce...` reached terminal success for:

- Shared Files Guard — run `32300597770` — `success`;
- Source Authority Contract — run `32300551527` — `success`;
- Deploy Candidate Contract — run `32300551586` — `success`;
- Metadata & IndexNow Readiness — run `32300551509` — `success`.

A previous Shared Files Guard attempt was cancelled and is not used as evidence; only the later terminal-success run is cited above.

## Deploy Candidate artifact

Deploy Candidate run `32300551586` published artifact:

```text
name: deploy-candidate-contract-32300551586
artifact id: 9383614090
size: 77,276 bytes
digest: sha256:5d684df20d66c297aebe4632ba5cb36e5489ec2a582336aefa2c630d27710727
```

The artifact was downloaded and inspected in this forensic pass.

Relevant contained reports include:

- `dist-publication-audit.json`;
- `gill-v16-mobile-play-smoke-2026-06-28/summary.json`;
- `gill-mobile-layout-audit-2026-06-29/summary.json`;
- Gill route/viewport visual diagnostic JSON.

`dist-publication-audit.json` reports `result: PASS` and no problems.

## Gill browser evidence really executed — but on a narrower capability set

The Gill mobile layout summary is not a vacuous pass:

```text
expectedCases: 24
cases: 24
failures: 0
```

The cases cover all six canonical Gill routes at mobile widths/themes and mark each case `completed: true`, `exercised: true`, `stage: complete`.

The Gill v16 play smoke also records:

- all six series routes;
- four mobile overlay capture groups;
- desktop + mobile TTS/play scenarios;
- `failures: []`.

This is useful positive evidence for the capabilities those suites actually own: Gill series route identity, chrome/layout/overlays and reader play/TTS behavior.

## What the artifact does not test

A recursive search through the downloaded artifact produced **zero** matches for the capability markers owned by the migration finding:

```text
flip-card
heart-flip
heading-anchor
faq-accordion
strategicMap
map-trigger
```

The Gill smoke summary itself shows its behavioral focus explicitly:

- series route/mark labels;
- current-card identity;
- mobile overlays;
- play/speed/pause/resume behavior.

The layout audit contains hundreds of geometry/chrome checks and diagnostics, but no assertion that a reversible card flips, a FAQ opens, an enabled heading-copy control exists, or an Antisovetov strategic-map trigger materializes its payload.

Therefore the exact-head green artifact proves:

```text
shared series chrome exercised successfully
```

but does **not** prove:

```text
all retained pre-migration page capabilities still have owners
```

That is precisely the oracle boundary described by `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT`.

## Why this matters for classification

The systemic finding is not based on “CI must be broken because source looks suspicious.” The stronger evidence chain is:

```text
current source/composition proves capability owner absent
+ origin commits show legacy owner removal
+ retained markup/config/CSS still requires behavior
+ exact-head admission/browser suites genuinely execute and stay green
+ their asserted capability matrix omits the retained feature families
```

So the green CI is **compatible evidence of a coverage gap**, not contradictory evidence against the Product mechanism.

## Boundary / non-claims

- No claim that the Gill browser suites are generally low quality; they have real case cardinality and exercise their declared chrome/TTS scope.
- No claim that `Deploy Candidate Contract` should click every interactive element on every page.
- The required systemic improvement is a capability-completeness contract for migration/shared owners, with representative behavioral witnesses for retained capabilities.
- This artifact witness is tied to exact head `f93567ce...`; later Product owners must be rechecked if relevant interaction/runtime files change.
