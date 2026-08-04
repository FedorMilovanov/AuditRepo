# Search audit pass 2 — deeper probes

**Date:** 2026-08-04  
**Product source HEAD:** `f9d0120718569c510833dba7a3abd68ce2f6a003`  
**Parent report:** `REPORT.md`  
**Machine artifact:** `PASS2_PROBE.json`

## 1. What this pass added

This pass deepened the first audit with:

- route-by-route global search surface classification;
- Pagefind direct query matrix with 22 representative Russian/English/Greek/Hebrew queries;
- title/metadata drift scan between `data/search-manifest.json` and built HTML `<title>`/`h1`/`og:title`;
- Pagefind excerpt HTML safety scan;
- route-specific guard cross-checks for `karty`, `konfessii`, and maps;
- post-init jsdom check for routes where search assets exist but no trigger is statically present.

Additional gates run after pass 1:

```text
npm run karty:visual-parity:audit        => PASS
npm run konfessii:visual-parity:audit    => PASS
npm run maps:validate                    => PASS
```

Important interpretation: these route visual/data gates pass, but they do **not** cover whether the unified command-palette search is present on those route families.

## 2. Refined route-surface finding

Pass 1 listed 13 HTML routes with no global command palette assets. Pass 2 separated public/searchable routes from noindex/audit-holder routes.

### 2.1 Confirmed P1 subset

These routes are **indexable** and have `searchManifestPolicy=include`, but built HTML does not contain the unified global search bootstrap/assets:

```text
/karty/avraam/
/karty/ishod/
/konfessii/russkij-baptizm/
/map/
```

This is stronger than a generic visual inconsistency because Pagefind/search can return these routes as results:

```text
query "карта авраама"     => top result /karty/avraam/
query "русский баптизм"  => top result /konfessii/russkij-baptizm/
```

So the routes are searchable from elsewhere, but once the user lands there, the same global search affordance is absent. `/map/` has local atlas search, but not the global command-palette search.

**Severity remains P1.** This is a site-wide contract gap, not merely cosmetic.

### 2.2 Routes with asset but no visible/static trigger

Static scan found search assets but no static global trigger on:

```text
/hard-texts/
/karty/
/konfessii/
```

A jsdom post-init check showed:

```text
/hard-texts/   => search.js can inject 1 trigger after init
/karty/        => 0 triggers after search init
/konfessii/    => 0 triggers after search init
```

This should be treated as a **P2/P3 visual discoverability issue** for `/karty/` and `/konfessii/`: keyboard shortcut may exist if the script is loaded, but no visible search entry point is created by the shared initializer in this harness. Because no real Chromium was available in the sandbox, this needs browser witness before promotion to a canonical bug.

## 3. Query quality matrix

Direct Pagefind probe results from production-like dist:

| Query | Count | Top result |
|---|---:|---|
| `Нагорная проповедь` | 10 | `/nagornaya/seriya/` |
| `Иер 17:9` | 9 | `/articles/krajne-li-isporcheno-serdce/` |
| `Код да Винчи` | 4 | `/articles/kod-da-vinchi/` |
| `благодать` | 40 | `/articles/kak-hranit-serdce/` |
| `Павел` | 22 | `/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/` |
| `Ин 3:16` | 8 | `/articles/dzhon-gill-chast-4-ekzeget/` |
| `Мф 5:3` | 14 | `/nagornaya/chast-1/` |
| `Рим 8:28` | 2 | `/articles/serdce-pod-skorbyu/` |
| `Иоанна 3:16` | 5 | `/articles/dzhon-gill-chast-4-ekzeget/` |
| `Матфея 5:3` | 9 | `/nagornaya/chast-1/` |
| `Аввакум 3:19` | 3 | `/` |
| `Бытие 6` | 54 | `/hard-texts/angely-pod-mrakom-iuda-6-7-2-petra-2/` |
| `Genesis 6` | 10 | `/hard-texts/angely-pod-mrakom-iuda-6-7-2-petra-2/` |
| `John Gill` | 6 | `/articles/dzhon-gill-spravochnik/` |
| `Джон Гилл` | 7 | `/articles/dzhon-gill-chast-3-nasledie/` |
| `יהוה` | 1 | `/` |
| `ἐν ἀρχῇ` | 0 | none |
| `Наг-Хаммади` | 2 | `/articles/kod-da-vinchi/` |
| `никейский собор` | 2 | `/articles/kod-da-vinchi/` |
| `сердце` | 40 | `/articles/chto-bibliya-nazyvaet-serdcem/` |
| `карта авраама` | 5 | `/karty/avraam/` |
| `русский баптизм` | 9 | `/konfessii/russkij-baptizm/` |

### 3.1 Strengths confirmed

- Core Russian topical queries generally work.
- Apologetics queries (`Код да Винчи`, `Наг-Хаммади`, `никейский собор`) correctly rank the intended article first.
- `Иер 17:9`, `Мф 5:3`, `Рим 8:28` return plausible topical/thematic pages.
- Hebrew divine-name query `יהוה` finds home; English `John Gill` works due indexed Latin/English surface.

### 3.2 New/reinforced query defects

#### SEARCH-P1-02 reinforced — false precision in Scripture suggestions

`Ин 3:16` and `Иоанна 3:16` still rank Gill exegesis pages first, not a John 3:16 exact reference. Since the UI hard-codes `Ин 3:16` as a Scripture suggestion, this is the strongest example of a false promise.

Recommended stricter acceptance criterion:

```text
Every hard-coded Scripture suggestion must either:
1. resolve to exact scripture metadata/pericope, or
2. be relabelled as "материалы, где упоминается...", or
3. be removed.
```

#### SEARCH-P2-05 — Greek homepage phrase is visually present but not searchable

`ἐν ἀρχῇ` returned 0 Pagefind results, even though homepage ambient text includes Greek phrases. This may be intentional because ambient phrases are decorative/ignored, but then search should not imply original-language discovery. Hebrew `יהוה` returns the home route, while Greek phrase does not; original-language search coverage is inconsistent.

**Severity:** P2/P3 depending owner intent.

**Repair options:**

- If original-language phrases are decorative only: no repair, but do not market them as searchable content.
- If original-language study is part of search promise: add curated metadata/search-manifest tags for key Greek/Hebrew phrases.

#### SEARCH-P2-06 — Genesis 6 landing still loses top-rank ownership

`Бытие 6` and `Genesis 6` both top-rank `/hard-texts/angely-pod-mrakom-iuda-6-7-2-petra-2/`, not `/hard-texts/genesis-6/`. Combined with the pass-1 evidence that `/hard-texts/genesis-6/` is excluded from search-manifest, this confirms the landing is discoverable through Pagefind body but does not own its natural root query.

**Severity:** P2 discovery.

## 4. Metadata/title drift scan

Pass 2 compared manifest title to built route `<title>`, first `<h1>`, and `og:title`. There are 17 non-exact title drifts; most are loose/acceptable editorial variants, but three deserve attention.

### 4.1 Strong drifts

```text
/biografii/#dzhon-gill-series
manifest: Джон Гилл (1697–1771) — биографическая серия
page h1/title: Биографии служителей / Биографии служителей — христианское наследие
loose match: false
```

This is an anchored sub-entry rather than a full route, so the mismatch may be intentional. But preview cards should not look like they open a dedicated Gill page if the target is the biographies landing anchor.

```text
/about/
manifest: О редакторе и проекте
page h1/title: Фёдор Милованов / Об авторе — Фёдор Милованов
```

This is probably acceptable, but search card text and route title are not aligned.

```text
/map/
manifest: Карта связей
page h1/title: Атлас исследований
```

This is a real naming drift: result card says “Карта связей”, page says “Атлас исследований”. Since `/map/` also lacks global command palette, this route needs a unified product decision: is it “Карта связей”, “Атлас исследований”, or both with clear subtitle?

### 4.2 Loose drifts to monitor

Examples where manifest and page are close but not exact:

```text
/nagornaya/seriya/
manifest: Нагорная проповедь — полная серия
page: Нагорная проповедь: серия в 5 частях

/articles/dzhon-gill-istoricheskiy-kontekst/
manifest: Джон Гилл: исторический контекст — диссентеры, Саутварк, книги
page: Джон Гилл: исторический контекст — мир пуритан и баптистов XVIII века

/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/
manifest: Герменевтическая оценка христоцентричной герменевтики
page: Оценка христоцентричной герменевтики
```

These should not be counted as blockers unless owner wants exact metadata parity. They do affect search-card trust/polish.

## 5. Security pass 2

### 5.1 Pagefind excerpt HTML safety

For the 22-query matrix above, pass 2 inspected returned Pagefind excerpts for HTML tags other than Pagefind `<mark>`.

```text
unsafeExcerpt = 0
```

This supports the pass-1 conclusion that current Pagefind excerpt insertion via `V(t.excerpt)` is not exposing arbitrary HTML in the sampled corpus.

### 5.2 Search bundle dangerous pattern counts

```json
{
  "eval": 0,
  "newFunction": 0,
  "documentWrite": 0,
  "innerHTML": 17,
  "localStorage": 3,
  "execCommandCopy": 1
}
```

No malware-like execution primitives were found in the search bundle. `innerHTML` remains a renderer/hardening hotspot, not a confirmed exploit in current corpus.

### 5.3 Additional hardening note — protocol-relative URLs

`safeUrl()` blocks `javascript:`, `data:`, `vbscript:`, `blob:`. Current manifest URLs are safe. However, a future `//evil.example/path` protocol-relative URL would pass a naïve “starts with slash” data check and is not explicitly blocked by `safeUrl()` as external. The current corpus has no such URL, so this is hardening, not a current vulnerability.

Recommended guard:

```js
if (/^\/\//.test(url)) reject;
if (!url.startsWith('/') && !url.startsWith('#')) reject;
```

## 6. Search architecture observations

### 6.1 Lazy bootstrap contract is fragile but intentional

`js/search.js` has a two-mode behavior:

1. If loaded without `window.__gbSearchBootRequested`, it installs a lightweight stub and returns.
2. A click/shortcut sets `__gbSearchBootRequested=true` and appends the same script again, causing the full UI path to execute.

This enables a single file to serve as both stub and full implementation. It is clever, but fragile: route-level wrappers, direct script tags, and owner-specific controls all must agree on the flag lifecycle.

Recommendation: document this as an explicit contract and add a unit/browser guard for:

```text
first direct script load => exactly one stub, no overlay
first Ctrl+K/click => exactly one overlay
repeat open/close cycles => still exactly one overlay
```

Some Home guards already cover this locally; the contract should become route-family-wide.

### 6.2 Search result limit hides corpus depth

Pagefind raw counts are often much larger than UI slices:

```text
Бытие 6    => 54 raw results
сердце     => 40 raw results
благодать  => 40 raw results
Павел      => 22 raw results
```

The UI currently shows a bounded top list without an obvious “show more” path. This is not a correctness bug, but it caps library discovery.

## 7. Updated repair priority after pass 2

1. **P1:** Add/guard global command palette on public searchable tool/app routes: `/karty/avraam/`, `/karty/ishod/`, `/konfessii/russkij-baptizm/`, `/map/`, or create explicit owner exceptions.
2. **P1:** Fix false Scripture precision (`Ин 3:16` hard-coded suggestion) by exact resolver or suggestion copy change.
3. **P2:** Decide Genesis 6 landing search ownership: include in manifest and/or boost for `Бытие 6` / `Genesis 6`.
4. **P2:** Browser-witness `/karty/` and `/konfessii/` visible search affordance; current jsdom says no trigger after shared init.
5. **P2/P3:** Align `/map/` naming: “Карта связей” vs “Атлас исследований”.
6. **P2/P3:** Clarify original-language search promise: Hebrew phrase works partly, Greek phrase returns 0.
7. **P3/security hardening:** protocol-relative URL rejection in `safeUrl`/manifest guard.
8. **P3:** Add “show more”/raw count disclosure for high-count Pagefind queries.

## 8. Evidence files

- `PASS2_PROBE.json` — raw route coverage, query matrix, title drift and security pattern counts.
- Existing pass-1 report: `REPORT.md`.
