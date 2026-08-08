# S12 / Search-manifest / Gill disposition reconciliation — 2026-08-08

## Purpose

This report reconciles three materially changed `gb-is-my-strength` audit dispositions after Search #1209 merged. It is **not** a mirror of every Product HEAD movement. The trigger is that the active owners, the manifest authority model, and the Gill regression classification have all changed.

## Current Product state

Latest observed Product main at this reconciliation:

- `9c0ca2bcd81476e8e7a961bfbd68e9a0f589b9a1` — `fix(reader): derive mobile series Back from config (#1258)`;
- prior current-main anchors in the same chain:
  - `26e7c914e6ce7561d03a639da5fdaec2c3ef9b02` — Strangler storage-path abstraction (#1222);
  - `02ee0e35faebe6edde85db4770c0d0a78985e711` — Search truthful continuation (#1209).

Search #1209 is retired from active work. Its final head `12896c2e40b4cb359ecadedb7bbe1f84c7b3cde2` had all 29 registered exact-head workflows terminal SUCCESS before merge.

## 1. BAPT-S12-01 owner disposition changed

### Predecessor #1253

PR #1253 / head `8e65a241cdb0ca2feb254bbed3f07da9d36bbb5c` is **closed unmerged**.

It was not abandoned silently. The PR records explicit `SELECTIVE_RECOVERY`:

- PageHead source wording repair was useful;
- widened `sources:hygiene` was useful;
- exact Source Authority exposed two additional same-root S12 leaks in the Spravochnik MDX and production Body;
- predecessor ancestry became stale after #1222;
- exact useful predecessor blobs were transferred into successor #1260.

Therefore MASTER must no longer name #1253 as the current Product owner.

### Successor #1260

Current bounded S12 successor is PR **#1260**, current observed head:

`fe0eeff3fd17d31ea130fd6ff9994060be93f176`

Its semantic four-file scope is coherent:

1. `scripts/sources-hygiene.js`
2. `src/components/baptisty-rossii/BaptistyRossiiSpravochnikPageHead.astro`
3. `src/content/articles/spravochnik.mdx`
4. `src/components/baptisty-rossii/BaptistyRossiiSpravochnikBody.astro`

The source rewrite is materially good. It does **not** delete the useful historical map content. The old backstage edit queue is converted into reader-facing `Исторические связи для 3D-карты`, retaining historical nodes/dates while removing instructions to edit repository/source/build surfaces.

At `fe0eeff3...`, multiple substantive gates are already SUCCESS, including Shared Files, Visual Parity, Search Manifest Policy, Search Modal, Glossary, Metadata, Native Source, Editorial and Scripture occurrence index. Source Authority / Route / Deploy were still running at the latest observed snapshot.

### Residual guard-health blocker on #1260

Current `sources-hygiene.js` still lacks an independent forbidden witness for the historical internal build path `_app/index.html`.

The predecessor failure proved that this internal path was a real reader-facing backstage leak. Merely guarding the phrase `очередь правок 3D-карты` is insufficient: a future wording change could retain `_app/index.html` while removing the queue heading and turn CI green again.

Required before merge:

- surgical `_app/index.html` / known internal build-path forbidden class;
- independent regression fixture containing `_app/index.html` **without** the queue phrase;
- no broad `src/|data/|scripts/` regex that would collide with legitimate raw Astro source imports.

This is guard completeness, not a request to delete the repaired reader-facing historical section.

### Current ancestry

After Product #1258, current main advanced to `9c0ca2bc...`.

`compare(main@9c0ca2bc... → #1260@fe0eeff3...)` is:

- status: diverged;
- ahead: 5;
- behind: 1;
- merge-base: `26e7c914...`.

Thus all prior `behind=0` claims for #1260 are stale. Even after the `_app` guard witness is added, final exact-head CI must run after an ancestry-preserving current-main refresh.

## 2. Search-manifest existing-row owner is now real and narrower than raw #1237

### Canonical implementation owner

Product issue #1252 now has a real SYSTEM implementation owner: draft PR **#1254**.

Branch:

`agent/search-manifest-existing-row-reconciliation-20260808`

Current observed exact head:

`3adc9f6c27ec3cf0d2a0e46dd0d4973cc8204528`

Net semantic scope against live Product remains exactly three permanent control files:

- `.github/workflows/search-manifest-policy.yml`
- `scripts/search-manifest-policy-normalizer.js`
- `scripts/search-manifest-policy-normalizer-test.js`

No `data/search-manifest.json`, RSS, sitemap or Baptist source file has been written by this draft. The canonical label-gated Search Manifest autofix remains intentionally unused until clean S12 source lands.

### Root cause still valid

The canonical normalizer can construct a new manifest row, but its old migration path skipped rows already present in `data/search-manifest.json`. Closed diagnostic #1237 therefore found broad existing-row divergence.

The systemic root is valid. Direct manifest JSON hand-editing remains the wrong layer.

### Critical forensic refinement: raw 9-field PageHead model was unsafe

Before any generated-data write, #1254 proved that treating all `buildManifestItem()` fields as PageHead-owned for **existing** rows would itself create metadata regressions.

Verified ownership boundaries:

- **editor is not `<meta name=author>`**. Hermenevtika identifies Abner Chou as author and Fedor Milovanov separately as translator / JSON-LD editor. Existing manifest editor must not be overwritten with the article author.
- **section is route-policy `librarySection`**, not PageHead `article:section`. Hermenevtika is library section `Переводы`, topic/category `Герменевтика`.
- **tags are editorial/search extras** for existing rows. Hermenevtika manifest contains discovery terms not present in the article-tag set.
- **publishedTime / modifiedTime belong to A02 Editorial Metadata v3**, whose approval-gated registry intentionally separates editorial truth from technical/build observations.
- **readTime** uses canonical series authority first when a series registry owns it; otherwise explicit built runtime reading time may be used.
- **title / description / explicit image** remain reader/source derived for this existing-row reconciliation. Independent Hermenevtika MDX agrees with the newer PageHead title/description/image while the old manifest is stale.

The current existing-row writer-owned set is therefore:

1. `title`
2. `description`
3. `section` from route policy
4. explicit `image`
5. canonical `readTime`

Preserved existing-row fields include:

- `editor`
- `tags`
- `publishedTime`
- `modifiedTime`
- `author`
- `featured`
- `priority`
- `scripture`
- series extras
- `wordCount`
- unknown future keys.

The mutation suite also distinguishes `missing` from `mismatch`, proves idempotence, proves manual/future extras survive and proves canonical series read time overrides stale runtime HTML.

### Current refined parity baseline = 46 rows

On exact #1254 head `3adc9f6c...`, Search Manifest Policy run `31255887499`, job `93099049941`:

- production-like build completed successfully;
- the new read-only existing-row parity step failed closed as designed;
- **46 existing manifest rows** have at least one current writer-owned divergence.

This **46-row current owned-field baseline supersedes the raw 67/73 diagnostic count for implementation acceptance**.

The old 67/73 remains historical proof of the systemic blind spot, but it included fields later proven to belong to other authorities (editor/tags/dates and thematic-vs-library section confusion).

The refined ledger no longer contains those cross-owner fields.

### #1254 ancestry is stale and must not project yet

Against current Product main `9c0ca2bc...`, #1254 `3adc9f6c...` is:

- status: diverged;
- ahead: 7;
- behind: 2;
- merge-base: `02ee0e35...`.

Required sequence remains:

1. #1260 closes S12 source + guard health and merges;
2. #1254 performs ancestry-preserving refresh to then-current main;
3. only then run existing authorized Search Manifest autofix;
4. audit generated manifest/RSS/sitemap diff field-by-field;
5. owned-field drift target becomes 46 → 0;
6. final exact-head Search Manifest / Shared / Node / Route / Metadata / static-publication / discovery evidence must be green;
7. #1221 then absorbs clean discovery authority for catalog projection.

### Separate new-row writer defect

Issue **#1261** records a separate future writer-hardening defect: the pre-existing strict **new-row** path still maps `editor = meta author`, which is semantically unsafe for translated/authored content.

This must not be folded into #1254 existing-row projection. It needs an explicit author/editor/translator authority and dedicated adversarial fixtures.

## 3. Gill Part I manual `.gterm` regression signal reclassified

The earlier forensic signal `manual .gterm 8 → 2` was too coarse. A strict-native current-main pass located the real route authority:

`src/pages/articles/dzhon-gill-chast-1-chelovek/index.astro`
→ `GillPart1MainShell`
→ `GillPart1ArticleBody`
→ native section components.

All six previously suspicious concepts remain in current reader content:

- Particular Baptist / former «Особых баптистов»;
- Horsleydown / Southwark;
- Gin Craze / former «джиновая лихорадка»;
- Corporation Act;
- Test Acts;
- Bunhill Fields.

Therefore:

**demonstrated content loss = 0 / 6.**

Current generic glossary runtime auto-hydrates aliases in ordinary prose, so reduction in explicit `.gterm` wrappers is not itself loss of interactivity.

Current canonical glossary already covers four current spellings through generic auto-glossary:

- Particular Baptist;
- Gin Craze;
- Corporation Act;
- Test Acts.

These should be classified as **migrated to generic glossary runtime**, not restored as one-off nested inline tooltips.

Only two annotation dispositions remain:

1. `Bunhill Fields`
   - canonical Russian definition exists;
   - current English spelling lacks a confirmed alias;
   - likely bounded repair: add English alias and prove auto-hydration, if editorially desired.

2. `Horsleydown / Southwark`
   - current source retains the historical concept;
   - current canonical glossary lacks a matching definition/alias;
   - historical inline definition was recovered from legacy commit `003b0875f45eed86d2be7be91080f9846519914f`:
     `Хорслидаун, Саутварк — Южный берег Лондона у Темзы: район причалов, ремёсел, складов, кожевенного производства и диссентерских общин. Для Гилла это был не университетский квартал, а рабочая городская среда.`
   - this is a candidate for source-reviewed canonical glossary migration, not for rolling back the current strict-native prose or restoring nested `.gterm` markup.

Product issue **#1263** now owns these two annotation dispositions.

MASTER should not continue describing the six manual `.gterm` disappearances as six possible content losses.

## 4. Cross-repo context that affects conservation baselines

### TheLegendaryPoet

Latest observed main:

`e2b25ff4742ffc0152d5be572f20e9cb34670b51`

`fix(yesenin): remove Chagin photo with unresolved copyright term`

The exact-main substantive workflows are green. The current conservation baseline for Yesenin Part II must therefore be based on `e2b25ff4...` or a newer accepted main, not the older `c891559...` forensic anchor: a conservation guard must not reintroduce intentionally removed rights-uncertain media.

### Research

Latest observed authority remains:

`d52ea9d54dd2c2488223d25f5f6cefd263c23328`

The corpus rights/provenance hold remains fail-closed.

## MASTER reconciliation required

Promote these dispositions into `MASTER_BUG_MATRIX.md` after review:

- update current Product observation from the old Search anchor to the present chain only where it materially affects owner boundaries;
- replace #1253 as current `BAPT-S12-01` owner with successor #1260 and record #1253 `SELECTIVE_RECOVERY` predecessor disposition;
- record #1260 `_app/index.html` independent guard witness as a pre-merge residual;
- record #1254 as the current SYSTEM implementation owner for #1252;
- replace raw 67/73 implementation target with refined **46 current writer-owned rows → 0** while retaining 67/73 as historical diagnostic evidence;
- record the five-field existing-row authority model and cross-owner preservation boundary;
- record #1261 as separate new-row author/editor writer hardening, not a current reader regression;
- replace the six Gill manual `.gterm` suspicion with **0 content losses / 4 generic-runtime migrations / 2 annotation dispositions**, Product #1263;
- preserve #1221 as downstream catalog owner after source + discovery convergence.

## Immediate sequence

1. #1260: add independent `_app/index.html` guard class + fixture, refresh to current main, fresh exact-head CI, merge.
2. #1254: absorb then-current main, run canonical existing Search Manifest autofix, audit generated projection, require 46 → 0 owned-field drift and all applicable final-head gates.
3. #1221: absorb clean discovery authority and finish catalog projection.
4. #1263: close the two residual Gill annotation dispositions without content rollback or duplicate tooltip engine.
5. #1261: harden future new-row author/editor semantics separately.
