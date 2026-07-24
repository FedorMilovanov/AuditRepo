# CURRENT HEAD REVERIFY — 2026-07-24 — Reader R6 matrix closure

## Authority boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact current source `main`: `c8b47201f5b7210d69809c38808bfbda15695dcd`
- Reader R6 merge: `a43727078d0f39e541a5aad8cd250a90310181a9` — PR #191, issue #59 closed
- Exact verified R6 PR head: `2461198f45033d8cce5f2444a9492d9f8176fa01`
- Exact verified all-route cross-browser PR head: `da05253bfc37db7b57318492f5576bd929c5c140` — PR #200
- Last exact production authority remains `8a5352671375fdb01b6c30273c25ec4283a13f69`
- This document advances source/CI and canonical-matrix truth only; it does not claim a new exact Pages deployment.

This closure is additive to `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_c8b47201_home-reader-gill-webkit.md`, which already records the complete homepage/Gill/Nagornaya/Reader/WebKit merge chain and artifact digests. That immutable witness is not rewritten.

## Closed canonical row

`READER-R6-STATE-01`

PR #191 established one bounded ReaderState transaction across standalone articles, flat series, books and ordinary reading pages:

1. one scroll+rAF geometry owner;
2. article-bounded progress excluding related/footer content;
3. explicit `before-content`, `active-section` and `after-content` phases;
4. canonical active section, remaining estimate and completion;
5. one `gb:reader-state:v1:<site>:<path>` snapshot with BookmarkEngine v4 and `gb-series-pos` migration;
6. shared consumers in BookmarkEngine, Hermenevtika mobile bar, ReaderRail and series/book chrome;
7. sole publication of `--gb-read-pct` and `--gb-read-active` by ReaderState;
8. permanent engine sweep for Gill, three-level book, Hermenevtika and `/about/`.

## Exact R6 evidence

| Contract | Run | Result |
|---|---:|---|
| Shared Files Guard | `30098725861` | success |
| Gill Final Source Reconciliation | `30098725874` | success |
| Overlay Runtime Browser | `30098725895` | success |
| Glossary Contract | `30098725882` | success |
| Native Source Contract | `30098725918` | success |
| Route Registry Validators | `30098725866` | Audit Pro, ReaderState engine sweep, 75 public routes, semantics and Nagornaya UI success |
| Visual Parity Guard | `30098725897` | current INDEX progressive enhancement and route policy success |

Final R6 scope: 61 permanent files, zero temporary workflows/materializers and zero unresolved review threads.

## Existing browser row extension

`READER-PUBLIC-SURFACE-BROWSER-01` is extended, not duplicated. PR #200 added two system files on top of R6:

- `.github/workflows/route-registry-validators.yml`
- `scripts/public-surface-cross-browser-matrix.mjs`

Exact evidence:

| Contract | Run | Result |
|---|---:|---|
| Shared Files Guard | `30098798681` | success |
| Route Registry Validators | `30098798531` | success |
| Android Chromium | same Route Registry run | 75 routes, 1828/1828 PASS |
| iPhone/desktop WebKit | same Route Registry run | 75 routes, 2660/2660 PASS |

Current `main@c8b47201f5b7210d69809c38808bfbda15695dcd` is a descendant of `a43727078d0f39e541a5aad8cd250a90310181a9`. PR #200 changed no product HTML, Astro components, CSS, runtime JavaScript, content or data.

## Counter transition

- Canonical IDs: `335 → 336`
- Closed canonical rows: `143 → 144`
- Canonical open rows: unchanged at `192`
- P0/P1 open: `4`
- P1 open: `94`
- P2 open: `35`
- P3 open: `51`
- Refactoring: `4`
- AuditRepo: `4`

Reader R6 had been scheduled in the operational/system backlog outside open matrix counters, so no open severity bucket is decremented.

## Production boundary

The last exact production authority stays `8a535267`. Exact source and PR-CI evidence must not be substituted for an unobserved current readiness→Pages pair. A later deployment reconciliation may advance production only with exact SHA, readiness run, Pages run and live marker/hash witness.
