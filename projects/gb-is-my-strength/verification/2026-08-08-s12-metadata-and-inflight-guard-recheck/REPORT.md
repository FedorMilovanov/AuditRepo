# GB S12 metadata + in-flight guard recheck — 2026-08-08

## Result

Current Product anchor remains:

`a068decefff4ddd0055da952c84b7a3633d7b43b`

This recheck does **not** create a new active work unit. It materially narrows the existing `BAPT-S12-01` defect and refreshes current Product owner/CI boundaries.

Key results:

- `BAPT-S12-01` is broader than the already-known «Подпольная печать» body leak: current public Spravochnik metadata still contains backstage research wording, while `sources:hygiene` categorically excludes `*PageHead.astro` from its scan. This is a current false-green mechanism under the same root.
- Product `#1214` is closed unmerged and explicitly `SUPERSEDED_VERIFIED`; `#1218` is the clean current-main successor for the body/guard portion.
- `#1218` deliberately does not claim complete `BAPT-S12-01` closure because `BaptistyRossiiSpravochnikPageHead.astro` is currently touched by Search `#1209`.
- Product `#1220` is now the active implementation lane for the first `SYS-CURRENT-GOLD-READINESS` human-reachability guard, but its current static anchor extractor can false-green hidden-ancestor/CSS-hidden links and therefore does not yet prove its stated “human-facing” invariant.
- No new Home defect was promoted: current `main` still has no Home change since the previous Home verification anchor, and the Directions/Ambient split remains optional owner-convergence work until a direct regression/false-green/promotion trigger appears.
- `astro.config.dev.mjs` remains absent on current Product `main`.

---

## 1. BAPT-S12-01 — exact current metadata residual

### Surface witness

Current file:

`src/components/baptisty-rossii/BaptistyRossiiSpravochnikPageHead.astro`

at Product `a068decefff4ddd0055da952c84b7a3633d7b43b` publishes this description:

`Живой справочник серии: люди, даты, документы, спорные факты, уровни источников, research-досье и очередь правок 3D-карты.`

The same backstage wording is projected into multiple reader/public metadata channels in that PageHead:

- normal `<meta name="description">`;
- `twitter:description`;
- `og:description`;
- JSON-LD `Article.description`.

This is not an internal comment or repository-only note; it is publication metadata and can be exposed to readers, crawlers and social previews.

### Guard false-green mechanism

Current `scripts/sources-hygiene.js` describes Charter S12 as preventing backstage research scaffolding from shipping in reader-facing article material.

The `#1218` successor correctly strengthens the forbidden patterns and adds adversarial fixtures for:

- `сохранены локально` / `сохранён локально` with `е/ё`;
- `в research`;
- `следующий шаг уже начат`;
- the existing `research-досье` marker.

But its filesystem selection remains:

```js
else if (/\.(mdx|astro)$/.test(ent.name) && /(Body|\.mdx$)/.test(ent.name)) out.push(rel);
```

Therefore every `*PageHead.astro` is excluded before the forbidden regexes run. A PageHead may contain the exact forbidden `research-досье` phrase and `sources:hygiene` can still pass.

This is a direct current false-green, not a speculative scanner improvement.

### Scope narrowing

Sampled sibling Baptist public PageHeads at the same Product anchor were clean in their public descriptions:

- `BaptistyRossiiDvaSezda1884PageHead.astro`;
- `BaptistyRossiiGoneniyaISovestPageHead.astro`;
- `BaptistyRossiiIniciativnayaGruppaPageHead.astro`;
- `BaptistyRossiiNochNaKurePageHead.astro`;
- `BaptistyRossiiPeterburgskayaLiniyaPageHead.astro`;
- `BaptistyRossiiPodpolnayaPechatPageHead.astro`;
- `BaptistyRossiiSovetskayaNochPageHead.astro`;
- `BaptistyRossiiVsehib1944PageHead.astro`;
- `BaptistyRossiiYuzhnayaShtundaPageHead.astro`;
- root `BaptistyRossiiPageHead.astro` uses a reader-facing book description.

So the current direct metadata residual is narrowed to Spravochnik among the checked Baptist PageHead family. Do not generalize this into a mass rewrite without a new witness.

### Current owner collision

Product `#1209` currently changes `BaptistyRossiiSpravochnikPageHead.astro` only for deterministic `command-palette.css` revision projection (`c174cedb → 3b88813f`). It does not repair the S12 wording.

Because the exact file is currently occupied by Search `#1209`, do not open a competing PageHead edit on top of it. Sequence the residual after Search releases/merges that file, or explicitly coordinate a clean successor.

### Closure boundary for BAPT-S12-01

The row is closed only when all of these are true on current Product:

1. the `#1218` body leak / `е/ё` / workspace-note false-green is merged and verified;
2. Spravochnik PageHead public metadata no longer exposes backstage research/working-copy language;
3. S12 enforcement covers reader-facing publication metadata (PageHead or an equivalent canonical metadata authority), not only `*Body.astro`/MDX;
4. a regression fixture proves the PageHead/metadata class cannot false-green again;
5. exact-head CI and collision checks are clean.

No second MASTER row is needed: this is one S12 publication-hygiene root.

---

## 2. Product owner refresh

### #1214 → #1218

`#1214` is now closed unmerged and explicitly records:

`SUPERSEDED_VERIFIED`

Its current-main successor is:

- PR `#1218`;
- head `d401b51810a04fb36ea87a0b8ab906f21105b20e`;
- base `main@a068decefff4ddd0055da952c84b7a3633d7b43b`;
- intended files: `scripts/sources-hygiene.js` and `BaptistyRossiiPodpolnayaPechatBody.astro` only.

At this recheck, its exact-head workflows were still queued/in-progress; Search Modal had started while the remaining returned groups had not reached terminal green. Previous `#1214` green evidence remains predecessor evidence, not merge authorization for `#1218`.

### #1217 — BAPT-CONTENT-TRUTH-01

Head remains `e1bbc4746904a5c7639c49146c4d434f74bdb038`, based on current `main`.

At recheck:

- Shared Files Guard — SUCCESS;
- Metadata & IndexNow — SUCCESS;
- Editorial Dateline — SUCCESS;
- Glossary — SUCCESS;
- Visual Parity — still in progress.

Keep the row active until exact-head terminal evidence + merge/result verification.

### #1216 — CATALOG-PROJECTION-01

Head remains `a76f98721145e76a1ffb89fed4c64cb65860cdab` and is still one commit behind current `main` (`merge-base=21b437...`, current `main=a068dece...`).

GitHub currently reports the PR mergeable, but that does not remove the stale-ancestry/CI barrier. Returned exact-head runs remain `action_required`, and the actual diff still contains broader control-plane files not described by the PR prose:

- `.github/workflows/scripture-occurrence-index-contract.yml`;
- `data/scripture-search-index.json`.

Do not treat mergeable=true as green CI or as proof that the stated scope matches the actual diff.

### #1212 — runtime census

Head `3292f4c36c0225d438e234ba3eb1b3d286c6459d` remains one commit behind current main. Shared Files, Metadata and Node Toolchain were green; Runtime Interactive was still running.

This is audit guard work, not a Product/Home repair owner.

### #1209 — SEARCH-P3-02

Current head remains `2b90612c82cf9df356c11b62d8099521700fd758`, with current-main ancestry (`behind=0`). Some exact-head groups are green (including Deploy Candidate, Scripture Occurrence Index, Shared Files and NoteRegistry), while many others remain queued/in progress. Merge remains unauthorized until the exact current head is terminal green and review/collision state is clear.

---

## 3. #1220 — CURRENT GOLD human-reachability guard audit

Product `#1220` is a new bounded implementation owner for the first `SYS-CURRENT-GOLD-READINESS` step.

Current exact head:

`9cdc79825f508a92b9e5ad10ed3c760991ef2a9e`

Base:

`a068decefff4ddd0055da952c84b7a3633d7b43b`

Actual files:

- `.github/workflows/deploy-candidate-contract.yml`;
- `scripts/human-reachability-audit.js`.

The workflow integration is bounded and reuses Deploy Candidate; no new workflow is introduced.

### Verified guard gap before merge

The PR states this invariant:

> every current reading route must have at least one real, static, human-facing inbound `<a href>` witness from another public route.

But the current extractor is a static regex over HTML. `extractAnchors()` strips scripts/styles/templates and rejects an anchor only when the **anchor tag itself** contains `hidden` or `aria-hidden=true`.

It does not prove that the anchor is human-visible when:

- an ancestor is `hidden`;
- an ancestor has `aria-hidden="true"`;
- an ancestor/anchor is CSS `display:none` or `visibility:hidden`;
- the rendered anchor has no visible/clickable geometry.

Thus a non-human link can currently satisfy `inboundCount` and produce `GOLD`, which is a false-green against the PR's own stated invariant.

This is an in-flight audit-harness defect, not a current `main` Product defect. Do **not** add another MASTER row. Before `#1220` merges, strengthen the witness model with an ancestor-aware DOM/browser proof (or equivalent deterministic representation) and add adversarial fixtures for hidden-parent/aria-hidden/CSS-hidden links.

At this recheck, all four returned exact-head workflows for `#1220` were still queued, so there is no terminal merge evidence yet.

---

## 4. Home recheck continuation

Current Product `main` still contains the same Home tree as the previous Home verification wave.

Additional source review covered:

- `Directions.astro`;
- `HomeAmbientPhrases.astro`;
- `HomeAmbientInteraction.astro`;
- `HomeResponsiveContracts.astro`;
- `HomeVisualAuditFixes.astro`;
- `Quote.astro`;
- `Refutations.astro`;
- `scripts/home-browser-contract.mjs`;
- `scripts/home-responsive-evidence-contract.mjs`.

Findings:

- Ambient geometry/disclosure still has several presentation owners, but the existing Home browser evidence explicitly verifies 1480/1600+ marginalia density, no content overlap and hover disclosure. No fresh direct regression was found.
- `Directions.astro` still declares a mobile vertical showcase owner while later `HomeVisualAuditFixes.astro` overrides the same route cards into a compact two-column visual arrangement. This remains real owner/cascade debt. The localhost visual contract checks mobile label wrapping/overflow, and existing Home browser evidence guards route count/dividers/no page overflow. Without a fresh browser failure or false-green witness for the final rendered geometry, keep this in `WORK_QUEUE.md` rather than promote a speculative `SYS-HOME-*` row.
- `Quote.astro` mirror remains decorative with the Russian quotation always available; no current accessibility defect was established.
- `Refutations.astro` keeps static hit slots, reduced-motion handling and controlled coarse-pointer pinning; no new current defect was established.
- Home refutation times sampled against current search manifest remain aligned (`Код да Винчи` 30 min; `20 антисоветов` 67 min).

Temporary `astro.config.dev.mjs` remains absent from current `main`.

---

## Matrix effect

No new work unit is added.

- active work units: **13 → 13**;
- direct current defects: **3 → 3**;
- `BAPT-S12-01` scope becomes more accurate and closure-safe;
- `SYS-CURRENT-GOLD-READINESS` gets a real current Product owner (`#1220`) plus a pre-merge guard-correctness boundary;
- `#1214` is retired from active-owner handoff in favor of `#1218`;
- Home remains optional owner-convergence work, not a synthetic defect.
