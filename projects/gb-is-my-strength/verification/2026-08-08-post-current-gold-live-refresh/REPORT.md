# Post-Current-Gold live refresh — 2026-08-08

## Anchor

- Product `main`: `1f14761a7c920e1d224e77d3ccfec8638a1d426c` (`#1220` merged).
- This wave refreshes live owner/CI state after Current-Gold landed and narrows S12, catalog, reader-controls and Strangler boundaries.
- No new active MASTER row is created for npm security: disposable `#1223` proved `npm audit --omit=dev` = **0** vulnerabilities; all 8 reported full-graph advisories are transitive dev/build dependencies.

## 1. Current-Gold first slice landed

`#1220` is merged as Product main `1f14761a...`. Its first implementation owner is no longer an active PR. The broader `SYS-CURRENT-GOLD-READINESS` root remains only for follow-up readiness convergence; the earlier regex/hidden-ancestor blocker is retired.

## 2. `BAPT-S12-01` is broader than the previous metadata-only residual

A fresh exact-head Source Authority failure on unrelated reader Back PR `#1233` exposed inherited Product S12 failures. Because `#1233` changes only the shared mobile Back component and its regression test, these failures belong to current Product state, not to the Back patch.

`source:hygiene` reports five markers across three sources:

1. `src/content/articles/podpolnaya-pechat.mdx`
   - `сохранён/сохранены локально`;
   - internal research workspace reference;
   - `следующий шаг уже начат`.
2. `src/content/articles/sovetskaya-noch.mdx`
   - internal research workspace reference.
3. `src/components/baptisty-rossii/BaptistyRossiiSovetskayaNochBody.astro`
   - internal research workspace reference.

Authority split matters:

- `/baptisty-rossii/podpolnaya-pechat/` route profile declares `hasMDX:false`, `mdxStatus:"reference-only"`, and renders the Astro-native Body. Therefore the dirty MDX is a reference twin, not the live body.
- `/baptisty-rossii/sovetskaya-noch/` also declares its MDX `reference-only`, **but its actual production Body is dirty**. The rendered source includes: `ВСЕХБ 1989 ... OCR и ссылки зафиксированы в research.` This is a real reader-facing current Product leak.

Separately, Spravochnik metadata/discovery remains dirty on `main@1f14761a...`:

- `BaptistyRossiiSpravochnikPageHead.astro` repeats `research-досье и очередь правок 3D-карты` in description, Twitter, OG and Article JSON-LD;
- `data/search-manifest.json` repeats the same wording;
- manifest dates remain `2026-06-18`, while PageHead JSON-LD publishes `2026-06-10` / modifies `2026-06-13`.

Closed `#1228` is confirmed as the wrong mutation layer: directly editing manifest description made deterministic RSS/Search policy red. Correct repair is source metadata/body authority first, then canonical discovery projection regeneration/convergence.

## 3. Catalog media guard is now useful; it exposed projection drift

`#1221` actual head observed: `0c779df113b5716a200bda023d356ef33cdade22`.

The original candidate regression (derived cards dropped thumbnails) is repaired:

- `ArticlesLibrarySection.astro` projects `item.image` into `.h-article-thumb` / `<img>`;
- `articles-visual-parity-audit.js` now requires repository-local image authority for every projected article/series and built thumbnail coverage.

The exact Source Authority failure should **not** be fixed by weakening this guard. It proves two upstream manifest-field drifts:

- `/hard-texts/` PageHead already publishes `/images/hard-texts/og-krajne-isporcheno-serdce.webp`, while existing manifest row `hard-texts-landing` has no image;
- `/karty/avraam/` `AvraamPageHead.astro` publishes `/images/og-avraam.webp`, while existing manifest row `karty-avraam` has no image.

Root in `scripts/search-manifest-policy-normalizer.js`:

- `buildManifestItem()` can derive image/title/description from built HTML;
- but `normalizeSearchManifest()` invokes it only for URLs **missing** from the manifest;
- existing rows are retained verbatim, so reader-facing title/description/image/date fields can drift indefinitely.

This is the same architectural boundary that made direct `#1228` mutation unstable. The repair must define which existing fields are derived vs intentionally editorial/manual and deterministically converge the derived subset.

Second same-root blocker: `data/route-profiles/articles.json` still lists deleted `ArticlesPublicationsSection` in `anatomy.mainContent` and `styleContract.requiredComponents`. Current strict route-profile tooling does not validate those nested component declarations, so the stale architecture contract can false-green.

Audit handoff comment posted to `#1221`: issue comment `5225133030`.

## 4. Reader-control root remains one SYSTEM package

Issue `#1224` remains the system authority. No symptom rows are split out.

Current bounded owners:

- `#1227` relation synchronization, actual head last observed `5b977f27ef856e7264f417188ff9a9917a1e9860`; it is behind current main and intentionally does not close the whole root.
- `#1233` Back-authority slice, actual head `d8cd4e4c1d5e4267e2c81c4463d1b887c7c76e1f`; compare to current main was `ahead=2`, `behind=0`.
- `#1212` all-reading-route audit-only census remains permanent-evidence work but is several Product commits behind current main; refresh ancestry before merge.

`#1233` itself is bounded correctly (`config.railBackHref` + regression test). Its only blocking Source Authority failure is inherited S12 described above. Do not absorb Baptist content repair into the Back PR and do not weaken Source Authority. Audit handoff comment: `5225133791`.

## 5. Strangler Wave A remains exact-red

`#1222` actual head last observed: `20f99634918eee2a340b6a5ef2c90fae80c97d1d`.

Multiple independent exact-head gates reproduce one compatibility root:

- current Home route profile validly stores `legacyPath:"/index.html"`;
- new `normalizeRepositoryPath()` rejects any POSIX absolute-looking path via `path.posix.isAbsolute(value)`;
- Shared Files/cache-bust, Route Registry and content-source provenance therefore fail on `/index.html`.

This is not a broad browser regression: visual/native/deploy lanes were green while authority/path lanes were red.

Required fix: preserve the established logical identity shape (canonicalize leading `/` rather than redefining it as invalid), add a root-reference adversarial fixture, and rerun the full exact-head matrix. Retirement blocker-count reductions are not authoritative while this compatibility failure exists.

Additionally, `legacy-shadow-retirement-readiness.mjs` still performs physical `root/<legacyPath>` reads and is not yet a post-move verifier. Audit comments already posted on `#1222`, including fresh exact-head comment `5225114942`.

## 6. Current owner / ancestry disposition

- `#1220`: merged; remove from active-owner list.
- `#1228`: closed unmerged as wrong mutation layer; remove from in-flight.
- `#1223`: closed unmerged disposable diagnostic; remove from in-flight.
- `#1221`: active catalog owner; blocked on source-derived discovery convergence + stale route profile + exact-head green.
- `#1222`: active Strangler owner; exact authority/path CI red.
- `#1224`: system reader-control authority.
- `#1227`: bounded relation slice; stale ancestry.
- `#1233`: bounded Back slice; current-main ancestry clean at observed head, but inherited S12 blocks Source Authority.
- `#1212`: audit-only census; stale ancestry, do not weaken findings.
- `#1209`: Search continuation owner; main has advanced beyond its body/ancestry claims, so refresh before merge. It also owns the Spravochnik PageHead touch, constraining final S12 metadata repair.

## MASTER effect

Active roots remain **13**:

- 2 direct current defects;
- 3 verified necessary improvements;
- 5 system lanes;
- 3 owner decisions.

No new row is needed. This wave changes **scope, evidence and owner disposition**, not root count.
