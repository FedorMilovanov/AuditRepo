# Evidence 02 — Gill sequence and metadata ownership

## A. `SERIES-ORDER-INDEX-MISMATCH`

### W2 — current live source owner

`src/components/article-pilots/gill-series/gillSeriesData.ts` defines the active `GILL_SERIES_ITEMS` sequence. The relevant current entries are:

```ts
{
  id: "part4",
  mark: { kind: "roman", value: "III" },
  title: "Часть III. Экзегет",
  href: "/articles/dzhon-gill-chast-4-ekzeget/"
},
{
  id: "part3",
  mark: { kind: "roman", value: "IV" },
  title: "Часть IV. Наследие",
  href: "/articles/dzhon-gill-chast-3-nasledie/"
}
```

All six Gill article routes import `GILL_PAGE_DATA` from this module. The older `SERIES_ORDER` concept in `src/data/site.ts` belongs to `SeriesArticleLayout.astro`; it is not the selected live Gill owner and must not be targeted as the repair.

### W3 — committed route artifacts

| Artifact | SHA-256 | Direct emitted evidence |
|---|---|---|
| `articles/dzhon-gill-chast-3-nasledie/index.html` | `ed79e17ffb7a12da82ca136de7bfd16ba368a8ada124b7bdb069abd8e11537bc` | next-card href `../dzhon-gill-chast-4-ekzeget/`; contains Part IV identity for the Part-3 route |
| `articles/dzhon-gill-chast-4-ekzeget/index.html` | `df4dcff401be402aed603ca37afbdbb7aed27114447d7e3a567fa60ea63382c6` | next-card href `../dzhon-gill-chast-3-nasledie/`; contains Part III identity for the Part-4 route |

### W4 — live documents

Both live route responses returned HTTP 200:

- `/articles/dzhon-gill-chast-3-nasledie/` exposes OG alt `Часть IV «Наследие»` and a `gbs2-next-card` to `../dzhon-gill-chast-4-ekzeget/`.
- `/articles/dzhon-gill-chast-4-ekzeget/` exposes the corresponding Part III identity and a next card to `../dzhon-gill-chast-3-nasledie/`.

**Bounded conclusion:** source, committed artifact, and live output agree on the inversion. Repair the one data owner, then prove emitted cards, labels, OG metadata, and sequence all agree.

## B. `EDITORIAL-LABEL-INCONSISTENCY`

Current literals:

```astro
<!-- src/components/ui/Header.astro -->
<li><a href="/hard-texts/">Разбор заблуждений</a></li>
```

```ts
// src/data/site.ts, SECTION_META
'hard-texts': { label: 'Трудные тексты', url: `${SITE.url}/hard-texts/` }
```

`BaseLayout.astro` imports `Header.astro`; live `/izbrannoe/` is a current BaseLayout carrier and returns the Header link text `Разбор заблуждений` for `/hard-texts/`.

**Bounded conclusion:** the literal divergence is current. It is a metadata authority issue, not proof that the visible Header copy is semantically wrong. The owner must either select one shared label or model intentional navigation/editorial labels separately.

## C. Challenge to `ARTICLE-AUTHOR-HARDCODED`

`src/layouts/ArticleLayout.astro` has a single-author/translation branch:

```ts
const isTranslation = data.author === 'abner-chou';
const articleAuthorName = isTranslation ? 'Абнер Чау' : SITE.authorName;
const editorialRole = isTranslation ? 'Редактор' : 'Автор-редактор';
```

However, a complete `src` import/reference scan at the exact anchor found no `ArticleLayout` reference outside `ArticleLayout.astro` itself. Current route code instead uses specialized components/pages (for example the Gill routes import `gillSeriesData`; `BaseLayout` owns the general Header carrier).

**Bounded conclusion:** this file is a historical/dead carrier at the anchor. It cannot support an active defect row until a verifier identifies an actual current source-to-emitted route path that imports it. This does not audit every author rendering surface.

## D. System boundary: `METADATA-SSOT-PROLIFERATION`

The Gill mismatch and Header/site label divergence demonstrate distinct active consumers whose data can drift. The system lane remains necessary if and only if it is scoped to active owners:

1. determine which owner is authoritative for each shared semantic concept;
2. migrate active Gill and Header consumers to it, or explicitly retain separate named fields;
3. add an emitted-route contract for sequence/label consistency.

Do not use the orphan `ArticleLayout.astro` as a reason to expand this lane.
