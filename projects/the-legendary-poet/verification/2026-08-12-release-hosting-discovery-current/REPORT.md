# Current Verification — release, hosting and discovery contracts

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

The source anchor was rechecked against current `main` immediately before this wave: identical, 0 commits ahead / 0 behind.

Product mutation: **none**.

Audit purpose: verify three release-adjacent contracts without reopening already-closed runtime work:

1. whether a registry entry marked `published` is physically required to ship its actual master/artwork bytes;
2. whether the declared legacy redirect contract matches the real GitHub Pages artifact/hosting model rather than only Vite preview;
3. whether IndexNow receives change-scoped signals or a site-wide inventory after every deployment.

## 1. CONFIRMED — published audio can pass the production gate with its physical master missing

### Current wiring

`package.json` defines both:

- `validate:audio` → `tsx scripts/validate-audio-assets.ts` (strict);
- `validate:audio:available` → the same validator with `--allow-missing`.

However `check:content` invokes **`validate:audio:available`**, and `check` owns `check:content`. The Pages deploy workflow runs `npm run check` before build/prerender and does not separately invoke strict `validate:audio`.

### Exact fail-open behavior

`validate-audio-assets.ts` does real byte-level validation when files exist: MP3 signature, SHA-256, byte count and WebP signatures.

But with `--allow-missing`:

- a missing published MP3 becomes `WARN audio: <id>: master is not uploaded yet` instead of an error;
- when that master is missing, missing square/wide artwork can also be downgraded to warnings;
- the only global physical requirement is `validated !== 0`.

Therefore, once at least one older published release still has valid bytes, another registry/manifest entry can be marked `availability: 'published'`, carry internally consistent URL/hash/duration metadata, have its physical MP3 absent, and still leave `npm run check` green.

`validate-music-catalog.ts` does not close this gap: it checks lifecycle fields, URL shapes, manifest/registry equality, durations, waveform structure, hashes as metadata and other catalog invariants, but it does not open/read the referenced MP3 bytes. Physical-byte authority remains `validate-audio-assets.ts`.

### Root cause

**Publication lifecycle and physical artifact existence have different authorities.** The strict byte validator exists but the production release gate intentionally calls its warning-tolerant mode.

### Disposition

New active root: **`TLP-AUDIO-RELEASE-001` / P2**.

Terminal outcome must make a `published` lifecycle impossible to merge/deploy without strict existence+signature+SHA validation for every published master and required artwork. An explicit pre-publication/coming-soon state may remain warning-tolerant; `published` may not.

Required regression: fixture/release candidate with one valid historical master plus one new `published` manifest row whose MP3 is absent must fail the exact production gate.

### Not promoted

- Current three published releases are not claimed missing in this report; the defect is the current production gate itself.
- `publishedAt` accepts a syntactically valid future date. That is a lifecycle hardening opportunity, but no current future-dated published record was found, so it is not another active row here.

## 2. CONFIRMED — legacy redirects are certified against preview semantics that the Pages artifact does not provide

### Current declared contract

`src/routes/route-contract.json` declares five legacy mappings:

- `/articles/article-1` → `/poets/alexander-pushkin`;
- `/articles/article-2` → `/essays/yesenin-kutezhi`;
- `/articles/article-3` → `/poets/anna-akhmatova`;
- `/articles/article-main-1` → `/articles`;
- `/articles/article-main-2` → `/music`.

The React router renders those as client-side `<Navigate ... replace />` entries.

### Production artifact mismatch

`scripts/prerender-og.mjs` writes canonical essay, poet, music and static route directories plus one root `404.html`. It has no redirect-source materialization path and does not consume `routeContract.redirects`.

Thus the Pages artifact contains no `dist/articles/article-1/index.html`, etc., unless a different build step creates them. No such producer was found in this wave.

GitHub's official Pages documentation states that the custom 404 page is displayed when users request nonexistent pages. In other words, an absent legacy source path is a 404-class hosting lookup, not an HTTP redirect supplied by Pages.

Official authority:

- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site

### False-green QA

`qa/site-route-integrity.spec.mjs` runs against `QA_BASE_URL` (normally Vite preview). For each declared redirect it requires the initial `page.goto(source)` response status to be `<400`, then waits until client JavaScript changes `window.location.pathname` to the target.

Vite preview can serve the SPA entry for an unknown path and therefore satisfy this test. The deployed Pages artifact, however, has no source document for that path and falls through to the custom 404 mechanism.

So the test proves **client redirect behavior after a preview-server success response**, not the production hosting behavior of a direct legacy request.

### Evidence boundary

This wave did not directly observe the live custom-domain HTTP status for each legacy source URL. The defect is nevertheless source/platform-contract confirmed: the production artifact lacks source path documents while the selected static host treats nonexistent paths as 404s. Do not rewrite this as a live-response observation.

### Root cause

**Legacy route semantics are owned only by the SPA router while the production host owns the first HTTP response. Preview and production therefore have different authorities.**

### Disposition

New active root: **`TLP-ROUTE-REDIRECT-001` / P2**.

Terminal outcome must choose and certify one honest production contract:

- use hosting/edge infrastructure capable of real HTTP redirects; or
- materialize stable legacy alias documents so direct source requests are real deploy artifacts, with canonical/refresh/client replacement behavior explicitly defined and tested.

The production regression must test the built Pages artifact/served hosting semantics, including the initial source response, rather than only Vite preview navigation.

`TLP-AUDIT-004` absorbs the false-green test manifestation; it does not absorb the Product hosting root itself.

## 3. CONFIRMED manifestation — IndexNow sends the full sitemap after every successful main deployment

`.github/workflows/indexnow.yml` runs after every successful `Deploy to GitHub Pages` workflow on `main`, regenerates the sitemap and calls `npm run indexnow`.

`scripts/submit-indexnow.mjs` parses **every `<loc>` in the sitemap** and sends that complete list as one IndexNow payload. It performs no comparison against the deployed commit, previous sitemap, modification authority or changed paths.

Official IndexNow documentation defines the submitted URL as one that has been **added, updated, or deleted** and recommends automated submission when content changes. Its FAQ explicitly states that IndexNow is not designed for submitting every site URL at once for ongoing discovery; XML sitemap is the long-term inventory mechanism.

Official authority:

- https://www.indexnow.org/documentation
- https://www.indexnow.org/faq

This matters more because the current sitemap modification clock is already coarse:

- `site` routes share a site-wide max date;
- poet detail `lastmod` derives from related essay/music dates rather than an own poet-record modification clock;
- music detail `lastmod` uses `publishedAt`, so later master/artwork/editorial changes have no dedicated modified clock.

Consequently a deployment can both over-submit unchanged URLs through IndexNow and carry imprecise `lastmod` authority in the sitemap.

### Disposition

No new ID. Absorb into existing **`TLP-DISCOVERY-001`** as another change-authority manifestation.

Terminal outcome expands to: one route/change metadata authority must drive truthful sitemap `lastmod` and a changed/deleted/redirected URL set for IndexNow. Full-site submission is appropriate only for an explicit site-wide migration/rebuild event, not automatically for every successful deploy.

## 4. Audit-harness impact

Existing **`TLP-AUDIT-004`** must additionally certify:

- the exact production release command fails when any `published` audio master is physically absent, even if another master is valid;
- legacy redirect tests exercise the deployed/static-host response semantics rather than relying on Vite preview SPA fallback;
- discovery tests distinguish sitemap inventory from change-scoped IndexNow notification.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| Published entry can deploy without its physical MP3 | new `TLP-AUDIO-RELEASE-001` / P2 |
| Legacy redirect source is absent from Pages artifact while preview test expects `<400` | new `TLP-ROUTE-REDIRECT-001` / P2 |
| Full sitemap submitted to IndexNow after every main deploy | absorb into `TLP-DISCOVERY-001` |
| Production-gate/preview/discovery QA does not prove these outcomes | absorb into `TLP-AUDIT-004` |
| Future-dated `publishedAt` syntactically allowed | not promoted without current published witness |
| Live custom-domain legacy status | evidence boundary; not claimed as directly observed |

## Product owner check

Open Product issue search for audio-missing release validation, legacy redirect hosting and IndexNow/discovery ownership returned no competing implementation owner in this wave.

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: 2 P2.
- Existing roots strengthened: `TLP-DISCOVERY-001`, `TLP-AUDIT-004`.
