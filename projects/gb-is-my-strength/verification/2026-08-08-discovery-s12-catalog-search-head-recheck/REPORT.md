# Discovery S12 / catalog / moving-owner recheck — 2026-08-08

## Scope

Fresh source/PR/CI recheck after Product `main` advanced through Baptist content-truth and then S12 body/guard work. This report records only material disposition changes for the current AuditRepo roots; it does not create new active IDs for candidate-only defects.

## Product anchor

Current Product `main`: `6d671d0e30bff8da1f7354a00191ab990f17ed12` — `fix(baptisty): keep research scaffolding out of public prose (#1218)`.

`670d82fa... -> 6d671d0e...` changes exactly:
- `scripts/sources-hygiene.js`;
- `src/components/baptisty-rossii/BaptistyRossiiPodpolnayaPechatBody.astro`.

Product `#1218` is merged. Its exact head `a70b42d352eaa422092a3e5564a93ae929bfff35` has a fresh successful run for every effective returned workflow group: Shared Files, Glossary, Scripture Occurrence Index, Deploy Candidate, Metadata, Editorial Dateline, Search Modal, Print Paper, Native Source and Visual Parity. One older Shared Files run is cancelled from head churn and is superseded by the later successful run.

Result: the `Podpolnaya Pechat` body leak and the narrow `сохранён/сохранены локально`, `в research`, working-note false-green class are closed on current main. `BAPT-S12-01` is **not** closed because the public metadata/discovery residual remains.

## BAPT-S12-01 — residual is wider than PageHead

Current `src/components/baptisty-rossii/BaptistyRossiiSpravochnikPageHead.astro` still publishes:

`research-досье и очередь правок 3D-карты`

through description / Twitter / OG / JSON-LD.

Fresh current-main source proof adds a second independent public projection: `data/search-manifest.json` contains the same wording for `/baptisty-rossii/spravochnik/` (`type: article`).

This manifest copy is not dead metadata. Current `js/search.js` fetches `/data/search-manifest.json`; manifest `description` becomes the visible result subtitle and preview excerpt, and the `articles` scope enumerates `article`/`series` manifest entries. Therefore the backstage phrase is already reader-visible through Search fallback/catalogue behavior on current main even before the PageHead residual is repaired.

The current S12 guard remains incomplete for this class after #1218:
- `sources:hygiene` walks MDX and `*Body.astro`, not `*PageHead.astro`;
- it does not inspect `data/search-manifest.json` or rendered discovery output;
- the Search policy inventory verifies manifest membership/policy and records title/section/dates, but does not compare or lint `description`;
- `search-manifest-policy-normalizer.js` builds missing manifest items from built metadata and refreshes `generatedAt`, but does not rehydrate/validate an already-existing item's description.

Required closure boundary for the existing `BAPT-S12-01` root:
1. replace the backstage Spravochnik public description at its proper metadata authority and converge PageHead + search-manifest/discovery projection;
2. add a permanent S12/discovery projection guard that can catch forbidden backstage wording in public PageHead/manifest/rendered metadata, not only article bodies;
3. reverify Search rendering and all deterministic projections on the final exact Product SHA.

No new direct-defect ID is created: this is one S12 root with a now better-defined residual.

## #1221 / CATALOG-PROJECTION-01 — candidate visual regression + S12 amplification

Canonical catalog owner remains Product `#1221`, head observed as `b603b0c9a51407d721db99d7ed1ae0364a6f7585` before #1218 merged. After current main advanced to `6d671d0e...`, compare is now `behind=1`; all earlier exact-head results are semantic evidence only until ancestry is refreshed.

The authority direction is correct: `ArticlesLibrarySection.astro` derives membership/metadata from `data/search-manifest.json` + `migration/page-ownership.json` and removes the old hand-authored publication owner.

However the current candidate introduces a visible regression not protected by its named native guards:
- old `ArticlesPublicationsSection.astro` rendered `.h-article-thumb`, `<picture>` and article/series cover imagery;
- new `ArticlesLibrarySection.astro` does not include `image` in `CatalogItem` and renders no thumbnail/picture/image at all;
- `scripts/articles-visual-parity-audit.js` checks authority markers, cards/grid and absence of the old manual owner, but has no thumbnail/media invariant;
- `/articles/` is `native-contract` in `data/visual-parity-baseline.json`; legacy pixel diff is diagnostic only, and the blocking named guards are Articles audit + data consistency + generic public-surface browser matrix;
- the generic browser matrix checks status, errors/assets, overflow, IDs/ARIA, title/H1/canonical and shared surface controls, not `/articles/` card image/media coverage.

Therefore #1221 can false-green while turning the current visual catalogue into a text-only card grid. Before merge it needs explicit owner-approved media disposition: normally project existing manifest `image` into the derived card geometry and permanently guard coverage/decoding/geometry, or record an explicit redesign decision with equivalent browser evidence. Do not silently accept thumbnail deletion as a side effect of metadata de-duplication.

The same candidate also currently renders `item.description`; because current search-manifest contains the Spravochnik backstage description, #1221 would amplify `BAPT-S12-01` onto `/articles/`. Sequence/converge S12 discovery metadata before catalog merge authorization.

## #1220 / SYS-CURRENT-GOLD-READINESS

The previous hidden-ancestor false-green finding is **resolved in the candidate**. Current head `0f565aa5c5cdfe2653035035096f0e67d29b1b68` uses Chromium with JavaScript disabled and rejects hidden/ARIA-hidden/inert ancestors, CSS-hidden/opacity-zero/pointer-disabled state, zero/off-canvas geometry, nofollow and empty anchors; adversarial browser fixtures cover those classes.

Do not keep the obsolete regex-only blocker in MASTER. A more exotic clipping/occlusion gap is not promoted without a concrete current Product witness.

After #1218 merged, #1220 is now `behind=1` from Product `main@6d671d0e...`; refresh ancestry and exact CI before merge.

## #1209 / SEARCH-P3-02 moving-head reconciliation

A transient earlier actual head contained `.search-p3-merge-refresh-trigger`, but the Search lane has since self-cleaned and refreshed. Current observed PR head is `e06a1abec8a503177ff7bb6b16f94219b72dec27`; compare against `670d82fa...` showed `behind=0` and no temporary trigger file in the net diff. The PR body also names this actual candidate.

Current semantic diff remains Search runtime/command-palette/browser contract plus deterministic asset-revision projections. Fresh exact-head workflow matrix on `e06a1abe...` is still mostly queued/pending/in-progress; only Search Scripture Suggestion was terminal SUCCESS at the snapshot, with an older Shared Files run cancelled and a newer one queued.

Because #1218 then moved Product main to `6d671d0e...`, `e06a1abe...` is again `behind=1`. The old temporary-trigger finding is retired; the live merge blocker is simply refreshed ancestry + terminal exact-head CI + clear governance on the actual final SHA.

## Other owner state

- `#1212` remains audit-only; its old head is now three Product-main commits behind the current anchor. It is evidence work, not current repair authorization.
- Home bytes are unchanged by #1218 except no Home file is touched; no new Home defect or temporary `astro.config.dev.mjs` is introduced by this main advance.

## MASTER disposition

Counts remain unchanged: **12 active work units / 2 direct current defects / 3 improvements / 4 system lanes / 3 owner decisions**.

Material changes are scope/handoff only:
- `BAPT-S12-01`: partial Product closure recorded, remaining residual expanded to PageHead + search-manifest/Search public projection and guard blind spot;
- `CATALOG-PROJECTION-01`: keep active; add thumbnail/media regression false-green and S12 amplification as pre-merge blockers for #1221;
- `SYS-CURRENT-GOLD-READINESS`: retire obsolete hidden-ancestor blocker; candidate fixed it, but now needs main refresh;
- `SEARCH-P3-02`: retire obsolete temporary trigger warning; current cleaned head exists, but main moved again and final CI is not terminal.
