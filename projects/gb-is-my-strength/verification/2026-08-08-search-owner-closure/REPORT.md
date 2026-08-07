# gb-is-my-strength — Search SYSTEM owner closure

Date: 2026-08-08

## Purpose

Close `AR-IDX-09` only after the current Search SYSTEM owner reached merged Product `main`, then hand the queue to the next independently current defect without carrying stale in-flight constraints forward.

## Product closure

Product PR `#1183` — `SYSTEM: centralize Search keyboard ownership (clean successor)` — was refreshed onto `main@b9734532ddd2921c1c06040b672e7d9fd6f30dfd` after merged lane-collision guard `#1194`.

Final exact candidate head:

`853b99ca9080d07e4e7f8c1b7acaddb59ac5030a`

Final comparison before merge:

- `behind=0`;
- one open Product PR only (`#1183`);
- 36 changed files;
- no temporary `search-*-once.yml` workflow remained;
- unresolved inline review threads: `0`.

The PR was marked ready only after code/review closure and merged fail-closed with the expected head SHA.

Merged Product SHA:

`67c234924e6973f9c88a22168d911b15c4c6db2a`

## What closed `AR-IDX-09`

- `js/site-utils.js` is the sole raw global Ctrl/Meta+K owner.
- The chord requires exactly one Ctrl/Meta modifier + K and rejects Alt, Shift, Ctrl+Meta, IME composition and editable/textbox targets.
- Search/Home/App consumers receive `gb:openSearch` instead of re-parsing the chord.
- The Search open path owns opening + Pagefind warm-up only; the canonical input handler owns query initiation, removing the duplicate-query WebKit loading race.
- Home shortcut browser fixture is fixed-position, uses `focus({preventScroll:true})`, asserts unchanged `scrollY` and removes itself; no force-click/sleep workaround.
- Search Modal workflow path ownership is global for `js/**`, `**/*.html`, `src/**/*.astro`, asset-version and route-authority/helper contracts rather than a list of current component families.

## Authority / forensic boundary

`buildAuditProSourceCorpus()` now separates:

- broad `sourcePages` — retained structural/forensic source evidence;
- narrow `currentRuntimePages` — current runtime/cache/G112 authority.

Mutation proof preserves both directions: reference-only bytes stay available to forensic checks but do not act as current runtime oracle; if that route is changed to canonical, the exact same stale cache/raw-key bytes re-enter runtime checks and fail.

Canonical `scripts/cache-bust.js --write` projected the final Search bytes only to mutable/current owners.

Projection evidence:

- final `js/search.js` revision: `bdb556ee`;
- `52` reference-only HTML snapshots preserved byte-stable;
- read-only cache-bust check synchronized / repository unmodified;
- legacy inventory: `53` immutable references, `52` migration-only, `1` production-required, `0` unresolved, `35` dependencies, `7` dependency blockers, `8` adversarial mutations rejected.

## Exact-head workflow evidence

All workflow runs returned terminal `SUCCESS` on `853b99ca...`, including:

- Search Modal Contract `31223124293`;
- Home SearchAction Contract `31223124270`;
- Runtime Interactive Audit `31223124258`;
- Source Authority Contract `31223124273`;
- Content Source Truth Coverage `31223124301`;
- Deploy Candidate Contract `31223124287`;
- Visual Parity Guard `31223124245`;
- Route Registry Validators `31223124241`;
- Shared Files Guard `31223124246` and post-body reconciliation `31223273580`;
- Node Toolchain, Native Source, Metadata, Glossary, Reader Projection, TTS, Gill reconciliation/submenu, Avraam baseline and the remaining registered PR workflow groups.

Notable direct witnesses:

- Home SearchAction Chromium/WebKit runtime and read-only proof: SUCCESS;
- Home Chromium/WebKit interaction, real headed lifecycle and A13 mobile WebKit accessibility matrix: SUCCESS;
- full durable interactive audit: SUCCESS;
- public surfaces in Chromium + WebKit and route semantics: SUCCESS;
- production-like deploy/offline/PWA/public-URL contract: SUCCESS.

## MASTER disposition

`AR-IDX-09` is **CLOSED** and removed from current MASTER.

Current direct defects become:

1. `S-SEC-01` — custom blacklist sanitizer in FAQ JSON-LD text path;
2. `NG-INLINE-01` — duplicated light-only `Из библиотеки` presentation owner in Nagornaya I/II/III/V.

The next bounded shared-runtime owner is `S-SEC-01`. Search/cache ownership is no longer an active collision reason.

## Strangler note

No physical legacy move/delete is authorized by this closure. Search projection evidence confirms 52 reference-only HTML snapshots remain byte-stable and the inventory still has seven dependency blockers. The existing Strangler retirement row remains active until a dedicated transaction proves `blockerTotal=0` and fresh production-like evidence.
