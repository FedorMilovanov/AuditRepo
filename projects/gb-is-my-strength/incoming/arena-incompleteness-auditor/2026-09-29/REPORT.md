# Incompleteness audit — series, articles and editorial roadmap (2026-09-29)

Scope requested by the owner: find what is **unfinished, suspended or abandoned** across series,
articles and the rest of the project, and admit the quality findings into the active matrices per
`AUDITREPO_OPERATING_MODEL.md`.

This pass deliberately hunts **completion gaps**, not UI defects. UI/a11y rows already admitted on
2026-09-29/30 are not repeated here.

## Identity

- Project: gb-is-my-strength
- Agent: arena-incompleteness-auditor
- Date: 2026-09-29
- Audited anchor: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`
- Evidence tier: verified-source; live surface observations have an independent proxied witness.

## Attestation

| Field | Value |
|---|---|
| `attested_at` | 2026-09-29 |
| Product `main` SHA | `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b` (`GET /git/ref/heads/main`, and `git rev-parse HEAD` of a fresh shallow clone) |
| Live domain | `gospod-bog.ru` (`CNAME` at the same SHA) |
| Open Product PRs at pass time | 4 — #2145, #2144, #2143, #2142 |
| Witness angles used | W1 surface (live `gospod-bog.ru`), W2 source (`src/**` at the SHA above), W3 artifact (`data/**`, committed `*.html` at the SHA above) |
| Local clone | shallow `--filter=blob:none` at the exact SHA; all source/artifact claims below are re-runnable greps against it |

### Evidence boundary — read before citing any row

- The sandbox in this pass had **no direct network egress** (`curl https://gospod-bog.ru/...`
  returns `000`). Live facts come from proxied page reads, not from the local clone.
- The committed `*.html` in the Product repo is a **partial** build snapshot (83 HTML files), not a
  full `dist`. It is therefore evidence about *that snapshot only*, never proof of what is or is not
  deployed. Every row below says which of the two it relies on.
- No Playwright, no local build, no `npm` script was executed. Nothing here is a runtime witness.

## What the corpus actually is (measured, not assumed)

```
src/content/articles/*.mdx                 63 files
  by series:  hard-texts 24 | russian-baptism 10 | pastor-series 8
              teen-double-life 7 | genesis-6 6 | dzhon-gill 6
  by section: articles 47 | baptisty-rossii 10 | hard-texts 6
```

Series registry `data/series.json` declares 7 series:
`nagornaya, dzhon-gill, pastor-series, hard-texts, russian-baptism, genesis-6, teen-double-life`.

Live `/articles/` reports **73 published materials** and **8 series cards**.

## REFUTED during this pass (recorded so nobody re-admits them)

Two claims that looked like defects from the rendered surface were **disproved by source** and must
not be admitted:

1. **"The heart book index under-links its corpus."** `HardTextsCardsSection.astro` carries an
   explicit design comment: *"This shelf intentionally presents the prologue, lead article of each
   chapter and the reference endpaper. Chapter extras remain available through the book reader
   navigation."* The 6-card shelf is intentional.
2. **"The 4 / 22 / 2 counters are wrong."** `HardTextsStatsSection.astro` derives them from
   `HARD_TEXTS_SERIES`: 4 chapter items + 22 article items + 2 `mark.kind === 'label'` endpapers.
   `hardTextsSeriesConfig.ts` declares exactly 4 chapters with `lead` + `extras`
   (6+6+6+4 = 22 articles) plus prologue and spravochnik — which is precisely the 24 files carrying
   `series: "hard-texts"`. The counters are correct.

Also verified as **not** defects:

- Pastor series: `data/series.json` declares 9 parts, all `status: "published"`; part 1
  (`20-antisovetov-pastoru`) is a `src/pages/articles/` page rather than an `.mdx`, which is why the
  frontmatter count reads 8. Nine parts + the Досье A card text is accurate.
- Baptists `readTime`: manifest 229 equals the summed `readingTime` of the 10 files (229). This
  equality is what makes the heart-book readTime finding below admissible rather than speculative.
- Nagornaya: 5 chapters + `seriya` + `istochniki` + `nakhodki` all exist as pages. The series content
  is complete; only its catalog duplication is a defect.

## ADMITTED — current defects

### 1. `GBS-SERIES-MANIFEST-HEART-READTIME-UNDERSTATED` — P2

`data/search-manifest.json` gives `/hard-texts/` (series «Тайны человеческого сердца»)
`readTime: 2`. The 24 files with `series: "hard-texts"` sum to **719 minutes**.

Semantics of the field are proven by a control in the same file: `/baptisty-rossii/` `readTime: 229`
equals the summed `readingTime` of its 10 members exactly. So `readTime` for a series is the member
sum, and the heart book is understated by **717 minutes** (~360×).

`/biografii/` is `readTime: 5` with `type: "series"`; treated as a hub page rather than admitted,
because its own reading time may legitimately be 5 — see next check.

**Next check:** confirm whether `readTime` is authored or generated for series rows; fix the heart
book value from the config; decide `/biografii/` separately.

### 2. `GBS-SERIES-MANIFEST-DUPLICATE-NAGORNAYA` — P3

`data/search-manifest.json` contains **two** `type: "series"` rows for one series:

| url | title | readTime | image |
|---|---|---|---|
| `/nagornaya/seriya/` | Нагорная проповедь: серия в 5 частях | 89 | `og-nagornaya-propoved.webp` |
| `/nagornaya/` | Нагорная проповедь — полная серия | 89 | `og-nagornaya-propoved.webp` |

Both surface as separate «Серия» cards on live `/articles/` (W1, 2026-09-29). Same series, same
runtime, same artwork, two catalog identities.

**Next check:** choose the canonical URL, retire the other row, and check redirects/canonical tags
before removal — this is an SEO surface, not only cosmetics.

### 3. `GBS-GILL-SLUG-PART-NUMBER-INVERSION` — P3

Source frontmatter at the exact SHA:

| slug | `title` |
|---|---|
| `dzhon-gill-chast-3-nasledie` | «Джон Гилл (1697–1771). **Часть IV**: Наследие — полемика, память, наука» |
| `dzhon-gill-chast-4-ekzeget` | «Джон Гилл (1697–1771). **Часть III**: Экзегет — экзегеза, полемика, отвержение» |

The slug ordinals are inverted against the declared part numbers in both files. Both also share an
identical `h1: "Джон Гилл (1697–1771)"`, so the on-page H1 does not distinguish parts either.

**Next check:** decide rename-with-301 versus accept; if renaming, `data/series.json` `dzhon-gill`
parts and any `canonicalOverride` must move together.

### 4. `GBS-DIOTREFY-OG-IMAGE-DUPLICATE` — P3

`data/search-manifest.json`:

```
/articles/20-antisovetov-pastoru/    → /images/pastor-series/og-20-antisovetov-pastoru.webp
/articles/diotrefy-nashego-vremeni/  → /images/pastor-series/og-20-antisovetov-pastoru.webp
```

Two different articles publish the same social artwork; «Диотрефы» has no own cover. Consistent with
an unreplaced placeholder.

### 5. `GBS-MANIFEST-TITLE-BRAND-SUFFIX-LEAK` — P3

Two manifest titles carry a raw brand suffix that reaches the reader-facing card:

- `/pastor-series/` → «Тёмная сторона кафедры — пастырская власть и подотчётность **| Господь Бог**»
- `/articles/diotrefy-nashego-vremeni/` → «Диотрефы нашего времени: власть, подотчётность и верность **| Господь Бог**»

No other catalog row does this. Article frontmatter keeps `title` (suffixed) and `h1` (clean) as
separate fields, so the suffix is authored into the manifest rather than added by the renderer. Note
the suffix itself is inconsistent with the site-wide form «| Господь Бог — Сила Моя».

### 6. `GBS-GENESIS6-MISSING-FROM-SEARCH-MANIFEST` — P2

`/hard-texts/genesis-6/` is the hub of the 6-article `series: "genesis-6"` cluster, and the route the
existing rows `GBS-HEADER-SEARCH-TRIGGER-NOT-WIRED` and `GBS-GENESIS6-THEME-TOGGLE-LOW-CONTRAST` are
filed against. It is **absent from the catalog authority**:

- `data/search-manifest.json`: `grep -o genesis-6` → **0** occurrences, while all five siblings are
  present as `type: "article"` rows.
- `migration/page-ownership.json`: **present** (`/hard-texts/genesis-6/` →
  `src/pages/hard-texts/genesis-6/index.astro`), so the page is registered and owned.
- Committed snapshot `hard-texts/index.html` (last touched at HEAD `d0e04a9`): **0** links to
  genesis-6 or to any of the other five hard-texts articles.
- Committed snapshot `articles/index.html`: **0** of the six.

So one route is owned and published but missing from the manifest that `ArticlesLibrarySection.astro`
names its authority, asymmetrically with its own five siblings.

**Next check (required before any repair):** the committed HTML is a partial snapshot and this
sandbox has no egress, so the *live* inbound-link state is **not witnessed**. Re-measure on live
`/articles/` and `/hard-texts/`, and confirm whether Pagefind indexing covers the route even though
the manifest omits it.

### 7. RETRACTED 2026-09-30 — `GBS-BAPTISTS-ROADMAP-STATUS-STALE`

The 20 `planned` chapters are an intentionally **future** five-part architecture, not the status of
the current nine published articles. `currentPublishedSurface` separately records nine articles,
one reference and four current book chapters. `principle` says that planning does not create a route;
`scripts/baptisty-roadmap-audit.js` explicitly rejects any future chapter status other than
`planned` until a dedicated publication lane promotes it. The initial analogy between published
article titles and planned future chapter titles was invalid. Removed from MASTER; the actual
publication gap stays in PROGRAM Wave 5B.

## ADMITTED — system lane

### `SYS-CONTENT-TAXONOMY-NAMESPACE-OVERLOAD`

One identifier, `hard-texts`, is doing four different jobs at this SHA:

| Use | Value | Population |
|---|---|---|
| `section:` in frontmatter | `"hard-texts"` | 6 files (1 Петра / Иуда / Енох cluster) |
| `series:` in frontmatter | `"hard-texts"` | 24 files (heart book) |
| registry key in `data/series.json` | `hard-texts` | «Тайны человеческого сердца», 6 parts |
| route family | `/hard-texts/*` | the 6-article cluster, while `/hard-texts/` index presents the heart book |

The section index `/hard-texts/` is the heart-book landing page, and the articles that actually own
`section: "hard-texts"` live under `/hard-texts/<slug>/` and are not represented on that index. One
mechanism (an overloaded namespace) explains findings 6 and the catalog/index mismatch, and a local
patch to any single file leaves the same class of risk — which meets the model's merge criteria.

## ADMITTED — owner decision

### `GBS-OPEN-CONTENT-PR-DISPOSITION`

Four Product PRs were open at pass time and none has a recorded disposition:

| PR | Subject | Opened |
|---|---|---|
| #2145 | content: add Bible-wide study of apostasy | 2026-09-28 |
| #2144 | deps(deps-dev): npm-non-major, 6 updates | 2026-09-28 |
| #2143 | data(genealogy): review first direct-name Synodal batch | 2026-09-23 |
| #2142 | research(baptists): salvage chapter 1 authority reconciliation | 2026-09-23 |

`PROGRAM_CLOSURE_MATRIX.md` still cites «Dependabot #2138 is 1 ahead / 22 behind». #2138 is not among
the open PRs; the current Dependabot PR is #2144. That PROGRAM line is `stale` and must be corrected
in the same wave, not carried forward.

## Program-level completion measured in this pass

| Programme | Measured boundary (2026-09-29) |
|---|---|
| Baptists book (Wave 5B) | 10 content files = 9 articles + 1 reference. Live `/baptisty-rossii/` shows 4 главы / 9 статей / 1 форзац and states a **17–20 article** target; Глава V (эмиграция, диаспора, возврат архивов, после 1991) is explicitly not created. Roadmap declares **20 chapters, 20 `planned`**. → 20 future chapters remain planned by design, while the current book is separately measured as 9 articles plus 1 reference. |
| Biblical maps (Wave 6) | Live `/karty/` re-measured: **1 открыта / 9 на аудите / 0 черновиков** — unchanged since 2026-09-24. Nine maps remain suspended in audit. |
| Genealogy (Wave 4) | Not re-measured. Only indirect movement witnessed: PR #2143 open. The 2825 / 139 figures are carried forward from 2026-09-24 and are **not** re-verified here. |
| Branch retirement (Wave 8) | Not re-measured. Requires `gh`/egress, unavailable in this pass. |

## Explicitly NOT verified in this pass

- Live inbound-link state for `/hard-texts/genesis-6/` (no egress; committed HTML is partial).
- Whether Pagefind covers routes absent from `search-manifest.json`.
- Any `draft: true` census — all 24 heart files and the 10 baptists files are `draft: false`, but the
  remaining ~29 files were not checked, so «there are no drafts» is **not** claimed.
- Genealogy 2825/139 counts, branch counts, and the red `Source Link Audit` gate classification.
- Anything requiring a browser or a build.
