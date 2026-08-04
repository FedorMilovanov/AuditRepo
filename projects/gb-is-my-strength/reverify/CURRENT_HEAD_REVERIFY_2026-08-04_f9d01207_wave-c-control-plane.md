# CURRENT HEAD REVERIFY — Control-plane / SEO supersession

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical findings: `D-8` (closed), `NEW-OG-SIZE-PARAM` (narrowed)
- Current Product anchor: `f9d0120718569c510833dba7a3abd68ce2f6a003`
- AuditRepo base: `850429a299a6118db85811602fdb661b81b2296f`
- Product mutation: **none**
- Browser/live-production claim: **none**
- TTS scope: **excluded**

## D-8 (deploy `*.md` path exclusion)

Disposition: STALE-ON-CURRENT-HEAD / FIXED (P3)

Original claim: `deploy.yml paths` does not include `*.md`, so doc-only changes do not trigger a
deploy.

Exact current witness at `f9d01207`: `.github/workflows/deploy.yml` has

```yaml
on:
  push:
    branches: [main]
    paths:
      - '**'
  workflow_dispatch: ...
```

`paths: ['**']` includes every file (including `*.md`), introduced by the build-once release PR
#370 / `cd4b7706` (a row already closed as `CI-BUILD-VALIDATION-DUPLICATION`). Under the build-once
model any push to `main` triggers readiness → candidate → Pages promotion, so doc-only `*.md`
pushes are no longer excluded. The historical exclusion claim is obsolete.

## NEW-OG-SIZE-PARAM → ⚠️ PARTIAL / NARROWED (P3)

Original claim: `seo-audit.js` hardcoded OG size check, no per-route allowlist.

Exact current witness at `f9d01207`: `scripts/seo-audit.js` validates OG image dimensions against a
shared approved-profiles allowlist via `isApprovedSocialImageDimensions`:

- `scripts/lib/sitemap-image-projection.js:7` — `APPROVED_SOCIAL_IMAGE_PROFILES = [{1200,630}, {1200,675}]`;
- `scripts/seo-audit.js:176` — `og:image dimensions are ${w}x${h}; approved profiles: ${...}`.

This mechanism was added by PR #636 / `52892a60e` (`fix(seo): project canonical images into
sitemap`). It supersedes the "single hardcoded size check" half of the claim. However, the allowlist
is **global/shared**, applied uniformly to every route, not **per-route**; the per-route
customisation residual therefore remains open under the same row.

## Re-confirmed still-open (no count change)

| ID | Exact current evidence |
|---|---|
| `D-1` | `deploy.yml` `concurrency.group: pages` vs `indexnow.yml` `metadata-indexnow-diagnostics-${{ github.ref }}` — groups still disjoint. |
| `TTS-DL-UNZIP-SYNC` | `fflate.unzipSync(u8, {...})` at `js/vosk-tts-engine.js:375` (main-thread sync unzip). |
| `TTS-DL-NO-TABLOCK` | No `navigator.locks`/`BroadcastChannel`; warm-up page-local (`warmVoskInBackground`). |
| `RIVER-P1-02` | `url(#waterRipple)` referenced 4× in `karty/_engine/base-geo.svg`, no `id="waterRipple"` def. |
| `PERF-P1-01` | `feTurbulence` ×5 in `karty/avraam/base.svg`. |
| `REG-P1-01` | No `route.regions` handling in `karty/_engine/map-engine.js`. |
| `QUAL-P1-08` | Holding cards use generic `og-karty-1200x630.webp` stub. |
| `AR-IDX-10` | Astro `HomePageHead.astro` CSP includes `cdn.jsdelivr.net` + `huggingface.co`/`*.aws.cdn.hf.co`; legacy home `index.html` CSP does not — home CSP drift confirmed. |
| `NF-GATE-IZ5-STALE` / `GATE-MARKER-DATA-DRIFT` | `premium-controls-rollout-audit.js:229/234` and `gill-v16-mobile-play-smoke.js:274/288` hardcode forbidden `Часть 1 из 5`, while `GillSeriesRail.astro:81` derives the count from `romanItems.length` (parts render `из 3`) — the guard is vacuous. |
| `NEW-SAVE-QUOTE-TIMER-RACE` | `highlights.js` `Y()` runs `setTimeout(le,500)` once; `le()` no-ops if `#selection-share-popup` absent, no retry. |
| `NG-DEAD-01` | `NagornayaChastN{ArticleBody,HeaderHero,PostContent}` (×5) have 0 import/use refs; MainShell carries inline markup. |
| `TEXT-P1-01` | `labelText.length*fontSize*0.6` monospace width calc at `map-engine.js:2179`. |
| `DATA-P1-03` | Runtime reads per-place `item.era`; route design-token `meta.era` palette remap not confirmed. |

## Canonical arithmetic for the AuditRepo transaction

- Canonical IDs: **358**
- Closed: **215 → 216**
- Open: **143 → 142**
- P0: 0
- P1: 69
- P2: 28
- P3: **39 → 38**
- Refactoring: 4
- AuditRepo: 3
- (NEW-OG-SIZE-PARAM narrowed in place, no count change)

Total remains `358 = 216 + 142`.

## Evidence boundary

- exact Product `f9d0120718569c510833dba7a3abd68ce2f6a003`;
- direct current-source inspection (deploy.yml `paths: ['**']`; seo-audit approved-profiles
  allowlist; the re-confirmed rows above);
- no Product mutation;
- no browser, computed-style, deployed-SHA or live-production claim;
- no TTS inspection or modification.
