# Wide source census and Lawson authority reconciliation — 2026-09-30

Anchors: Product `main@5e76c6ec81f3c192510c70e49a3deba64fb676c2`; Research `main@d418894aca6cc84898e0ae97bbd2b3fa93827c5e`. Read-only clones and source checks. No independent browser, live deployment or deep source-claim verification.

## Published MDX corpus — 128 shell assertions plus cross-index census

For each of **64** `src/content/articles/*.mdx` files, ran two independent `bash -c` assertions: nonempty file and present `slug:` frontmatter; **128/128 passed**. Then performed a structured 64-route cross-index: parse `section`, `slug`, `draft`, `noindex`, `author`, `sourceMode`; check the expected route against `migration/page-ownership.json`, the corresponding `src/pages/<section>/<slug>/index.astro`, and `data/search-manifest.json` (64×3 = 192 route/index assertions). All **64/64** MDX routes are `production-dist`, have a route source, and carry `draft: false` / `noindex: false`. **63/64** appear in the search manifest; the only absent route is the already-admitted Steven Lawson catalog case `GBS-ARTICLES-CATALOG-STRICT-NATIVE-OMISSION` (existing Product PR #2150). Authorship fields: 63 `fedor-milovanov`, one `abner-chou`; no second missing route or duplicate defect added.

The `src/content.config.ts` schema defaults `draft`/`noindex` to false; these are source-policy checks, not a build proof. `sourceMode` is explicit `rendered` on seven files, `metadata-only` on six, omitted on 51 (schema default `rendered`). **Do not infer 51 unpublished drafts** from omitted `sourceMode` or call a manifest absence a broken direct route. The manifest is one catalog/search metadata authority, not the only publication authority. The prior 63-file census on older main is correctly dated; present corpus size is 64.

## Lawson Research authority — chronology matters

Research's `STEVEN_LAWSON_2024_2026/00_CURRENT_AUTHORITY_2026-09-27.md` and `STEVE_LAWSON/19_CURRENT_STATUS_AND_ACQUISITION_QUEUE_2026-09-28.md` explicitly warn about their dated authority. The newer `STEVE_LAWSON/CURRENT.md` names V6 (`74_ARTICLE_RU_REFINED_V6_2026-09-30.md`) canonical and its final/post-biography audits `75_`/`83_` PASS, with publication guardrails. `84_`/`85_` track **outbound external acquisition requests**, not unconditional blockers on the current article; silence is not acceptance. Product main has a published Lawson route and a biography/source-reference apparatus; its catalog omission is separately tracked. This pass did not line-by-line certify Product's claims against V6 or acquire external binaries. Therefore **no new missing Lawson article** or false hold inferred from the older V4 queue, and no source-quality closure claimed.

## Lifecycle / ownership boundary

Product #2150 remains open on head `89e767949a1d0f6f8e53c4b85db44bfdee527b06`: its proposed fallback collects published MDX entries missing from the manifest, checks ownership, and deduplicates against manifest routes. On current main only Lawson is a fallback candidate. That is an in-flight repair, not a resulting-main fix; do not rewrite its PR from this audit. Apostasy remains another agent's lane.
