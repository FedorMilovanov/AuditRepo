# Agent Audit Report — publication/data ownership pass

## Meta

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent`
- Date: `2026-07-17`
- Audited branch/ref: Product `main`
- Audited anchor: `cb3681e1a85b5f8919c9dc537f812a842bbe9235`
- Product snapshot digest: `sha256:2d4111a249c44f8b810d7b2c522c80a635f8fe055dac14df18c5153b2001223b`
- Environment: Linux; Node `v22.17.0`; npm `10.9.2`; Python `3.12.13`
- Build mode: source + production-like dist + live HTTP
- Scope: publication validation, search-manifest image ownership, workflow wiring, generated HTML integrity
- Signal class: audit-harness / control-plane with release impact
- Proof state: `FAIL` for the named gate; live assets `PASS`; remote run state `UNPROVEN`
- Claim boundary: deterministic local behavior and source/workflow topology at `cb3681e`; six live URLs at observation time
- Preservation boundary: do not refresh this report merely because Product HEAD moves
- Semantic owner: `scripts/check-data-consistency.js` local-image resolver and its declared publication owners
- Active overlap at intake: Product PR `#1722` is adjacent CI/guard topology; PR `#1721` owns dist CSS admission; neither was treated as authorization to mutate Product

---

## 1. New findings

### `DATA-CONSISTENCY-PUBLIC-ASSET-RESOLUTION`

- Title: data-consistency gate rejects valid Astro `public/` image owners
- Kind: audit-harness / control-plane defect
- Suggested impact: high operational impact; proposed `P1` pending independent checkout/remote-run confirmation
- Routes: six Genesis 6 hard-text routes listed in `evidence/live-assets.tsv`
- Owner: `scripts/check-data-consistency.js` image existence resolver
- Observed on anchor: `cb3681e1a85b5f8919c9dc537f812a842bbe9235`
- Expected: each same-origin search-manifest image resolves against every declared publication owner; committed `public/` assets pass and a truly absent file fails
- Actual: `npm run data:consistency` exits `1` with six `search-item-image-missing` errors although all six files are committed under `public/images/articles/genesis6/` and all six public URLs return `200 image/webp`
- Reproduction: see `evidence/data-consistency-output.txt`
- Evidence angles:
  - W1 direct command: deterministic exit `1` and six errors;
  - W2 source: root-only resolver at `scripts/check-data-consistency.js:116-118`;
  - W3 artifact/live: six committed `public/` files and six HTTP 200 responses;
  - W4 lifecycle: required publication aggregate is wired into deploy, candidate and dry-run workflows.
- Confidence: high for the local defect/mechanism; medium for current remote release impact because exact Actions logs were unavailable
- Limitation: source arrived as a GitHub ZIP, but this particular command does not require Git metadata and reproduced normally
- Possible mechanism: `exists(item.image.replace(/^\//, ''))` checks only repository root and omits Astro `public/` projection
- Applicability: the command, manifest, committed assets, package wiring and workflow files all come from the same exact Product snapshot
- Does not prove: that a specific authenticated Actions run failed for this reason, or that PR `#1722` has not since changed the lane

Evidence: `evidence/data-consistency-output.txt`, `evidence/source-and-topology-witness.md`, `evidence/live-assets.tsv`.

---

## 2. Confirmations and extensions

### Extension of historical gate evidence

Target: `incoming/arena-auditor-2026-07-14/2026-07-14/REPORT.md`, which recorded `npm run data:consistency` PASS at `2ca2af3b`.

Result: the old PASS is valid only at its historical anchor. At `cb3681e`, the same command is red because newer search-manifest items use Astro `public/` image ownership. This narrows the likely introduction window and shows that the failure is current drift, not evidence that the old report was wrong. Separate comment: `comments/comment-on-arena-auditor-2026-07-14-data-consistency.md`.

### Extension of the cb3681e verifier wave

Target: `incoming/bugverifikator/2026-08-19/VERIFIER_SYNTHESIS_gb-is-my-strength_2026-08-19.md`.

Result: that wave explicitly excluded local build/runtime regression. This package adds a same-anchor harness/control-plane witness without disputing its Product-row dispositions. Separate comment: `comments/comment-on-bugverifikator-2026-08-19-synthesis.md`.

---

## 3. Challenges and negative findings

The following signals were challenged and rejected as Product bugs:

1. `workflows:check` and one engine ownership check require Git enumeration; the ZIP snapshot has no `.git` and the sandbox had no Git executable. Environment-induced, not admitted.
2. Root-only schema audit sees stale `900×600` data in a reference-only legacy page; production `dist` owns corrected `1200×630` data and passes. Historical/reference signal, not current production work.
3. `mdx:structure:audit` warns on the quoted YAML tag `"4Q204"`; the glue regex scans frontmatter. Non-blocking harness noise with no reader defect.
4. Three BnF `ENOTFOUND` results came from sandbox DNS. Independent rendered fetches reached all three records.
5. Four Atlas checkboxes initially looked unlabelled to a simple ID/`for` scan but are nested in visible `<label>` elements. False positive.
6. Browser suites could not start because `libglib-2.0.so.0` is absent. No browser failure was attributed to Product.

---

## 4. Duplicate and root-cause merge proposals

- Merge the six `search-item-image-missing` messages into one work unit: `DATA-CONSISTENCY-PUBLIC-ASSET-RESOLUTION`.
- Do not create route-level rows and do not duplicate assets into legacy root.
- Root cluster: publication URL → physical owner resolution is fragmented between legacy root and Astro `public/`.
- Adjacent but not automatically identical: broader metadata/source-of-truth proliferation in MASTER. This finding is a concrete gate defect and should remain independently actionable unless a verifier proves an existing active system lane fully owns its repair and acceptance test.

Proposal: `proposals/proposal-promote-data-consistency-public-asset-resolution.md`.

---

## 5. Severity and value assessment

- Proposed severity: `P1 / high operational`, provisional.
- User-content impact: none shown; images are live and served.
- Operational impact: a required publication gate returns a false blocker, encouraging bypass or masking future real missing-file failures.
- Breadth: one checker, six present symptoms, three workflow entry points.
- Repair cost: low to medium; owner-aware resolution plus positive/negative regression fixtures.
- Downgrade condition: if a real Git checkout or current PR head makes the command green, classify this package stale/superseded.
- Upgrade condition: authenticated workflow evidence shows deploy/candidate runs blocked at this exact check on current main.

---

## 6. Repair-lane proposal

Bounded lane:

1. Recheck Product `main`, PR `#1722`, and current checker owner immediately before mutation.
2. Teach local image validation to resolve the declared publication owners (at minimum legacy root and Astro `public/`) without weakening external/data URL rules.
3. Add a positive fixture for a file present only under `public/`.
4. Add a negative fixture proving a genuinely absent same-origin image still fails.
5. Run direct `data:consistency`, required publication aggregate, and affected workflow contract tests.
6. Do not copy the six files into legacy root and do not change reader-facing URLs.

Proposal: `proposals/proposal-owner-aware-image-resolver-repair.md`.

---

## 7. Reverify results

Production-like artifact sequence:

1. `node scripts/astro-cli.mjs build` — PASS;
2. `node scripts/copy-legacy-to-dist.js --omit-build-only` — PASS;
3. postbuild with the exact technical build instant — PASS.

Passed checks include dist JSON-LD/SEO, production schema, page ownership, publication audit, SW readiness, content parity/coverage, article QA, readability, editorial lint, migration metadata, native runtime taxonomy, Gill claims/Pagefind and repository control-plane integrity.

A literal scan of 89 generated HTML documents found no unresolved ordinary internal route/asset/fragment, duplicate ID, missing image `alt`, or unsafe `_blank` relation. These passes do not cancel the pre-publication data-consistency failure: they prove the six assets publish correctly and therefore strengthen the false-negative diagnosis.

---

## 8. Notes for verifier

- Reproduce from a real Git checkout of exact `cb3681e` or current main.
- Inspect exact current files of Product PRs `#1721` and `#1722`; title-only overlap evidence is insufficient for mutation authority.
- Use one compact row, not six symptoms.
- Require a negative fixture before accepting a resolver expansion.
- Keep proof labels separate: local gate FAIL, live assets PASS, authenticated remote run UNPROVEN.
- Suggested disposition after independent reproduction: `current-local / audit-harness / P1`, then remove from active work in the same wave once the gate and negative fixture pass.
- Provisional synthesis: `VERIFIER_SYNTHESIS.md`.
