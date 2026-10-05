# Proposal

## Identity

- Project: gb-is-my-strength
- Proposed by: arena-dx-ux-audit
- Date: 2026-10-06
- Target finding ID(s): `SYS-STRICT-NATIVE-PUBLICATION-COMPLETION` (class-level repair gap), plus the new authoring-DX cluster in REPORT.md §1.3
- Proposal type: systemic-root / work-queue / owner-decision

## Current understanding

The 2026-09-30/10-01 blocker is fixed: `Deploy to GitHub Pages` succeeds at
`350848145ee252a4e6ad8b86c9c8e831e2b4cb12`, Pages reports `status: built`, `scripts/audit-pro.js` exits 0, and the Lawson
route is present in `route-search-policy.json`, `search-manifest.json`, `sitemap.xml`, `feed.xml` and the articles catalog.
A staged probe at the same anchor shows the class is still live: a new article needs six hand-edited authorities
(content file, route shell, `page-ownership.json`, route profile, route policy row, search manifest row) plus two normalizer
writes, and the sanctioned writer that looks like it should do the job
(`scripts/search-manifest-policy-normalizer.js --write`) is a no-op for a new route (exit 0, empty diff).

## Proposed change

1. A scaffolder (`npm run new:article`) that emits the route shell and every registry row from one input, with the
   frontmatter/manifest vocabulary mapped once (`publishedAt`→`publishedTime`, `updatedAt`→`modifiedTime`, `readingTime`→`readTime`).
2. A fail-closed admission check: if an effective (non-draft, indexable) route exists, every discovery surface must contain it —
   otherwise the check fails and names the missing surface, instead of a far-away RSS writer error.
3. Either implement new-route registration in `search-manifest-policy-normalizer.js` or rename/limit it so it cannot look like
   the sanctioned writer for new content.
4. Either correct or retire `docs/refactor-2026/CONTENT_MODEL_AND_AUTHORING_2026.md`; it currently promises a toolchain that
   does not exist while the real standard is `docs/ARTICLE-STANDARD-CHARTER.md`.

## Evidence

```text
evidence/2026-10-06-article-add-friction-probe.txt     (full staged recipe, per-stage gate output)
evidence/2026-10-06-ci-and-release-state-main.txt      (deploy/pages/audit-pro green; red lane is only the WebKit search contract)
artifacts/probe-audit-test-article.mdx                 (the content file that produced no route on its own)
artifacts/probe-route-index.astro                      (26-line generic shell that did work)
artifacts/probe-registry-edits.txt                     (exact row shapes + field-vocabulary comparison)
```

## Value / cost / risk

- Value: highest of anything in this pass — it is the owner's stated "как по маслу" goal and it removes a class of silent
  publication drift; it also cuts CI surface for a new article (22 of 77 workflows currently match an article's path set).
- Cost: one script + one contract + doc edit; medium, additive, no route rewrites.
- Risk: a scaffolder that writes into six authorities touches shared registries; it must be reviewed for the unrelated-lane
  rewrite already observed from `editorial-metadata-registry.js --write` (5 supplement files for one article).

## Possible outcomes

fix-now (scaffolder + admission guard as one reviewed PR) / owner-decision (whether the six-authority model stays)
