# Incoming Audit Pass — Wave 4: три дефекта

## Meta

- Date: 2026-07-17
- Auditor: Arena Agent (arena.ai)
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Anchor (SHA): cb3681e1a85b5f8919c9dc537f812a842bbe9235
- Scope: `SERIES-ORDER-INDEX-MISMATCH`, `EDITORIAL-LABEL-INCONSISTENCY`, `ARTICLE-AUTHOR-HARDCODED`, `GENEALOGY-ID-INVALID-SPACE`
- Method: direct source read at anchor

---

## 1. SERIES-ORDER-INDEX-MISMATCH — CONFIRMED FAIL

**File:** `src/components/article-pilots/gill-series/gillSeriesData.ts`

**Finding:** `GILL_SERIES_ITEMS` lists entries in this order:
```
context (Введение)
part1   mark: roman "I"   title: "Часть I. Человек"
part2   mark: roman "II"  title: "Часть II. Учёный"
part4   mark: roman "III" title: "Часть III. Экзегет"   ← id=part4, roman=III
part3   mark: roman "IV"  title: "Часть IV. Наследие"   ← id=part3, roman=IV
spravochnik (Справ.)
```

`part4` has id `"part4"` (slug: `dzhon-gill-chast-4-ekzeget`) but is labelled roman `III` / title "Часть III. Экзегет".
`part3` has id `"part3"` (slug: `dzhon-gill-chast-3-nasledie`) but is labelled roman `IV` / title "Часть IV. Наследие".

The physical content (chast-3 = "Наследие", chast-4 = "Экзегет") is ambiguous without canonical editorial intent, but the array order and marks are inverted relative to the slugs. This drives the in-series «Предыдущая / Следующая» navigation to show the wrong article and the wrong roman numeral in every chrome.

**Proof state:** FAIL — source read, confirmed at cb3681e.
**Minimum closure:** Swap positions of `part4` and `part3` entries in `GILL_SERIES_ITEMS` (or correct mark values) so array order matches roman numerals matches slugs. Re-verify navigation order in rail.

---

## 2. EDITORIAL-LABEL-INCONSISTENCY — CONFIRMED FAIL

**Files:**
- `src/components/ui/Header.astro` L18
- `src/data/site.ts` L22

**Finding:**

`Header.astro`:
```html
<li><a href="/hard-texts/">Разбор заблуждений</a></li>
```

`site.ts` `SECTION_META`:
```ts
'hard-texts': {
  label: 'Трудные тексты',
  ...
}
```

Two different labels for the same section in two authoritative places. Any component consuming `SECTION_META['hard-texts'].label` will show "Трудные тексты"; the global nav shows "Разбор заблуждений". Inconsistency is user-visible in breadcrumbs, SEO structured data, and any future label consumers.

**Proof state:** FAIL — source read at cb3681e.
**Minimum closure:** Owner decides canonical label; update the other location to match. One source of truth.

---

## 3. ARTICLE-AUTHOR-HARDCODED — INVALID (dead code)

**File:** `src/layouts/ArticleLayout.astro`

**Finding:** `ArticleLayout.astro` exists at cb3681e and contains author-handling logic (`isTranslation`, `articleAuthorName`, author card). However, a scan of all 85 `src/pages/**/*.astro` files finds **zero imports** of `ArticleLayout`. The layout is orphaned — no page routes through it.

**Classification:** INVALID. The MASTER row was filed against `ArticleLayout.astro` as the live carrier. The live carrier does not exist. The row must be **removed from MASTER** in the next closure wave; no Product fix is needed for a layout no page uses.

**Proof state:** PASS (no live defect) — confirmed at cb3681e by exhaustive pages/ scan.

---

## 4. GENEALOGY-ID-INVALID-SPACE — CONFIRMED FAIL

**File:** `data/genealogy/genealogy.json`

**Exact evidence at cb3681e:**
- L1395: `"id": " lud_shem"` — leading space
- L403: `" lud_shem"` — referenced in Shem's `children` array

**Self-consistency note:** The id and the reference are both prefixed with a space, so the graph does not currently produce a broken lookup. The defect is a data-integrity invariant violation: any external tool, validator, or future Map rebuild that strips leading whitespace, or any search/filter by clean id `"lud_shem"`, silently misses this node.

**Proof state:** FAIL — confirmed at cb3681e. Classification unchanged (current defect, latent breakage).
**Minimum closure:** Rename id to `"lud_shem"` (no space) and update the matching children reference in Shem's entry.
