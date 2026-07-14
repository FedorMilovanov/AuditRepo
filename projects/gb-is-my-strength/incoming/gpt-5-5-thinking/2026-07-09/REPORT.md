# Agent Work Report — John Gill image inventory and restoration

## Meta

- **Project:** gb-is-my-strength / gospod-bog.ru
- **Source repo:** `FedorMilovanov/gb-is-my-strength`
- **Agent:** GPT-5.5 Thinking
- **Date:** 2026-07-09
- **Audited branch:** `main`
- **Audited SHA:** `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- **Current HEAD at start:** `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- **Current HEAD at end:** `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- **Environment:** GitHub connector + production browser evidence + local image/JS inspection
- **Build mode:** source + current production; no local production-like dist build available
- **Browser/device:** production DOM/source inspection; no fresh 390/768/1440 screenshot witness for repair branch

---

## 1. New Findings

### Finding `GILL-IMG-LOSS-PART3`

- **Title:** Part III native Astro source omitted two established article illustrations
- **Severity:** P2
- **Route:** `/articles/dzhon-gill-chast-3-nasledie/`
- **Source files:**
  - `src/components/article-pilots/gill-part3/GillPart3ArticleBody.astro`
  - `src/content/articles/dzhon-gill-chast-3-nasledie.mdx`
  - `images/gill-bunhill-fields.jpg`
  - `images/gill-spurgeon-succession.jpg`
- **Observed on SHA:** `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- **Confidence:** high
- **Verification level:** L2 — direct source + asset + current-production evidence
- **Suggested repair lane:** `lane/gill-part3-image-restoration-2026-07-09`
- **Implementation:** draft PR `FedorMilovanov/gb-is-my-strength#50`
- **Do not mix with:** shared Gill rail/PremiumControls, global CSS/JS, series data, deploy-system reconciliation

#### Expected

Part III should retain the three established body illustrations represented by the content/legacy lineage:

1. transatlantic influence map;
2. Bunhill Fields burial/funeral illustration;
3. Gill-to-Spurgeon succession illustration.

The burial illustration belongs immediately after the Bunhill Fields paragraph and before the Latin epitaph. The succession illustration belongs in the section `Сперджен — наследник и независимый критик`, near the 1859 foundation-stone discussion.

#### Actual on current `main`

- `GillPart3ArticleBody.astro` retained `gill-transatlantic-map` in the America section.
- It contained no `gill-bunhill-fields` reference.
- It contained no `gill-spurgeon-succession` reference.
- Both binary originals and their `600w` / `900w` WebP variants still existed in `/images/`; this was a markup/migration omission, not binary loss.
- Current production still exposed the two older illustrations, but in the wrong later cluster near the Spurgeon material. Therefore production and current source were not the same render generation, and a future rebuild from current source could silently remove both.

#### Asset evidence

| Asset | Original dimensions | Responsive candidates confirmed | Notes |
|---|---:|---|---|
| `gill-bunhill-fields.jpg` | 1024×1536 | `600w`, `900w` WebP | portrait engraving/reconstruction; should not span full article width |
| `gill-spurgeon-succession.jpg` | 1408×768 | `600w`, `900w` WebP | generic symbolic church/pulpit scene; not documentary portrait evidence |
| `gill-transatlantic-map.webp` | 1200×630 | existing source already referenced `600w`, `900w` | remained in current Astro source |

`1200w` responsive files for Bunhill and Spurgeon were checked and do not exist. The repair intentionally does not create broken `srcset` entries.

#### Historical/semantic caption correction

The images are generated/reconstructive rather than documentary. The repair therefore avoids categorical identification:

- Bunhill: `Художественная реконструкция ...`
- Spurgeon: `Символическая иллюстрация преемственности ...`

No AI-disclosure label was added, in accordance with the source-repo contract that transparency text belongs on `/about/`, not in individual captions.

---

## 2. Full five-page image inventory

The source/content cross-check found no additional lost body illustrations beyond the two Part III omissions.

| Page | Planned inline/body images | Current main before repair | Result |
|---|---:|---:|---|
| Historical context | 8 | 8 | no loss |
| Part I — Человек | 6 | 6 | no loss |
| Part II — Учёный | 3 | 3 | no loss |
| Part III — Наследие | 3 | 1 | **2 confirmed omissions** |
| Reference / Справочник | 1 | 1, plus the same art reused as hero | no loss; duplication remains a separate UX issue |

Hero images were audited separately and are not counted in the inline/body column.

### Images confirmed present outside Part III

- Historical context: Whitefield field preaching, dissenters' library, underground Puritan meeting, Clarendon acts, Clarendon persecution, Southwark sermon, Whitefield/Kennington, Kettering bookshop.
- Part I: Kettering, baptism, Horsleydown, pulpit strip, pastoral succession infographic, funeral sermon.
- Part II: scholar/rabbinic study, quill/inkwell, Wesley-era debate.
- Reference: five-volume shelf art.

Several of these have placement, caption, responsive or historical-specificity weaknesses, but they were not lost and were not modified in the restoration lane.

---

## 3. Repair evidence

### Source branch

`lane/gill-part3-image-restoration-2026-07-09`

Rollback/base SHA:

`ac26d8efa2b952df6dc46eef05908e6d65287e82`

Current repair HEAD at report time:

`507dc5b58a7c09f55aed0fbb6d3e647c52939e34`

### Changed source files

- `src/components/article-pilots/gill-part3/GillPart3MainShell.astro`
- `src/components/article-pilots/gill-part3/GillPart3RestoredFigures.astro`
- route-local lane report under `docs/refactor-2026/lanes/`

No binary asset, global CSS/JS, layout, migration, workflow, package or shared-data file was changed.

### Repair behavior

- Bunhill figure is moved after the exact paragraph containing `Его похоронили на` + `Банхилл-Филдс`.
- Spurgeon figure is moved after the second paragraph following `#sec-spurgeon-legacy`, which is the paragraph describing 16 August 1859 and the foundation stone.
- Bunhill uses `max-width: 460px` and `sizes="(max-width: 520px) 92vw, 460px"`.
- Spurgeon uses `sizes="(max-width: 640px) 92vw, 760px"`.
- Both use `loading="lazy"`, `decoding="async"`, explicit aspect-ratio dimensions and only existing WebP candidates.
- Duplicate guards remove the route-local copy automatically if the same image later appears directly inside the monolithic article body.
- If JavaScript is unavailable, both figures remain visible as fallback immediately after the article body rather than disappearing.

### Why the repair is a bridge rather than direct monolith edit

`GillPart3ArticleBody.astro` is a large monolithic file. Through the connector, updating it would require replacing the complete file; a narrow server-side patch was unavailable. Whole-file replacement would have created a material risk of overwriting newer article content. The repair therefore preserves that component byte-for-byte and adds a route-local restoration component.

A later full-checkout lane may inline the figures directly after the current PR has passed build and visual validation.

---

## 4. Checks completed

- Image originals exist — PASS.
- `600w` WebP variants exist — PASS.
- `900w` WebP variants exist — PASS.
- `1200w` variants absent and not referenced — PASS.
- PR changed-file scope — PASS.
- Inline placement-script syntax via `node --check` — PASS.
- GitHub Actions `Shared Files Guard` run `28982847390` — PASS.
- Strict shared/system file guard — PASS.
- actionlint within that workflow — PASS.
- PR conflict check — mergeable.

### Required before merge

- `npm run validate:static-publication`
- `npm run native:runtime:audit:strict`
- production-like strangler build
- screenshots at 390 / 768 / 1440
- verify image order, captions, no duplicates and no CLS regression

PR #50 intentionally remains draft until these checks are completed.

---

## 5. Confirmation of existing source↔build desynchronization theme

### Related prior evidence

`_OWNER_DOWNLOADS/README.md` already records Gill browser witness and source-vs-built desynchronization reports from 2026-06-27.

### New evidence angle

This audit adds image-level evidence:

- current source has only the map;
- current production still shows Bunhill and Spurgeon;
- production placement is stale/wrong;
- rebuilding from current source would remove them unless repaired.

Recommended verifier action: attach this report as evidence to the existing canonical source/build/deployed-SHA root cause rather than creating a duplicate system-level bug.

---

## 6. Out-of-scope findings retained for later lanes

1. Mixed-generation Gill production metadata/rail values across pages.
2. Reference page repeats the same five-volume shelf image as both hero and immediate inline figure.
3. Some existing `srcset` declarations elsewhere in the series are malformed or overfetch on mobile.
4. Several reconstruction images use captions/alts that claim more historical specificity than the pixels support.
5. Pastoral succession infographic is not legible on mobile without zoom/lightbox or HTML/SVG reconstruction.
6. Direct inlining of the restored figures into `GillPart3ArticleBody.astro` remains preferable after a full-checkout validation pass.

These were not mixed into PR #50.

---

## 7. Notes for verifier

- Do not mark `fixed-current` while PR #50 is draft and not merged.
- The finding is `confirmed-on-sha` through direct source/asset/production evidence.
- If PR #50 passes the required full and visual gates, it can become repair-ready for merge.
- After merge and deploy, reverify the deployed SHA rather than relying on source parity alone.
