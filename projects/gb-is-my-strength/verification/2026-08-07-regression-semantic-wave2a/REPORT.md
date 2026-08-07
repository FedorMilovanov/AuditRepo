# Regression / Preservation Wave 2A — Gill / Hermenevtika semantic disposition

Date: 2026-08-07

## Purpose

Resolve the highest-signal semantic recovery candidates from the 2026-08-07 forensic corpus without using historical word count, static annotation count, or directory-level source presence as a restoration oracle.

Boundary:

- current canonical native owners are authoritative;
- historical retained HTML is forensic evidence only;
- source-backed editorial corrections remain intentional unless current evidence proves a new loss;
- presentation markup loss is not content loss when the current runtime owns the same affordance semantically;
- no Product edit is made unless a current user-facing loss is confirmed.

## Result

**13 high-signal candidates reviewed → 0 confirmed current regressions → 0 Product edits required.**

| Candidate group | Count | Final disposition |
|---|---:|---|
| Gill Part I historical static `.gterm` candidates | 6 | 3 runtime-hydrated; 3 explanatory popup layer retired/redundant after prose rewrite |
| Hermenevtika `.bref` count drop | 3 | intentional flattening of nested Scripture controls inside footnote tooltips |
| Gill source→dist phrase probes | 4 | 1 current-present, 1 reformulated by source correction, 1 current-present with narrowed claim, 1 intentionally removed from Part IV but retained/caveated in reference article |

No candidate justifies restoring old surrounding prose or legacy markup.

---

## A. Gill Part I — six historical static `.gterm` candidates

### Current architecture

Current Part I is native Astro composition through:

- `src/components/article-pilots/gill-part1/GillPart1ArticleBody.astro`;
- its imported native section components.

The global glossary is not limited to static `.gterm` markup. `js/glossary.js` hydrates eligible plain-text aliases into `abbr.gterm` at runtime according to `data/glossary.json` + `data/glossary-policy.json`. Existing static `.gterm` nodes are intentionally excluded from re-hydration.

Therefore the forensic signal `8 static gterm → 2 static gterm` cannot be interpreted as “six definitions disappeared”. Static count is not the capability owner.

### 1. Particular Baptist / «Особые баптисты»

Current native prose retains `Particular Baptist` / the Particular Baptist concept.

The global glossary entry for `особые баптисты` includes aliases:

- `particular baptists`;
- `particular baptist`;
- related church forms.

**Disposition: `MOVED_TO_RUNTIME_HYDRATION`.**

No static wrapper restoration.

### 2. Gin Craze / «джиновая лихорадка»

Current Southwark section retains the exact English term `Gin Craze` and explains its historical setting.

The global glossary entry has aliases including `Gin Craze` and `джиновая лихорадка`.

**Disposition: `MOVED_TO_RUNTIME_HYDRATION`.**

No static wrapper restoration.

### 3. Test Acts / «Акты об испытании»

Current Southwark section retains `Corporation and Test Acts`.

The global glossary entry for the Test Acts includes English aliases matching `Test Acts`.

**Disposition: `MOVED_TO_RUNTIME_HYDRATION`.**

No static wrapper restoration.

### 4. Horsleydown / Southwark

Historical retained HTML used a local static glossary popup explaining that Horsleydown/Southwark was a working south-London riverside district.

Current native section now puts that explanation directly into the prose: Horsleydown/Southwark, industrial south London, tanneries, docks, warehouses and the social character of the congregation are explained in the paragraph itself, with an additional historical footnote.

The old popup is no longer the only carrier of that information.

**Disposition: `ANNOTATION_RETIRED_AFTER_PROSE_INTEGRATION`.**

Do not reintroduce a second owner for the same explanation merely to recover a historical `.gterm` count.

### 5. Corporation Act 1661

The global glossary still contains a canonical `корпоративный акт` definition and aliases including `corporation act`.

Current prose uses the compressed coordination `Corporation and Test Acts`, so the exact `Corporation Act` alias may not auto-hydrate in that sentence. But the same paragraph explicitly explains the legal disability and the adjacent footnote identifies `Corporation Act (1661)` and `Test Acts (1673...)`.

The explanatory capability is therefore already present without the historical static popup.

**Disposition: `ANNOTATION_REDUNDANT_IN_CURRENT_PROSE_AND_FOOTNOTE`.**

Do not rewrite the sentence or add an overbroad `Corporation` alias merely to preserve historical annotation count.

### 6. Bunhill Fields

Historical retained HTML used a local popup describing Bunhill Fields as the nonconformist cemetery and naming Bunyan, Watts and Blake.

Current native prose itself says that burial at `Bunhill Fields` placed Gill among Bunyan, Watts and Blake in the English dissenting tradition. The old tooltip definition is effectively embedded in the sentence.

**Disposition: `ANNOTATION_RETIRED_AFTER_PROSE_INTEGRATION`.**

No Product edit.

### Gill Part I conclusion

The six-count delta is a **presentation-layer migration signal**, not evidence of six lost concepts. Three concepts remain runtime-hydratable through the global dictionary; three local tooltips became redundant because their explanatory content is now in the authored prose/footnote.

**Do not restore six static `.gterm` wrappers.**

---

## B. Hermenevtika — three fewer `.bref` markers

The forensic parity signal was `63 → 60 .bref` with three low-similarity sentences in footnote 83:

1. Isaiah 53 / Messiah and death;
2. Psalm 117:22 / rejected stone = Christ;
3. Leviticus 19:18 / love of neighbour as the law's aim.

### Historical retained HTML

All three sets of Scripture references were rendered as nested interactive `<button class="bref" ...>` controls **inside the tooltip belonging to footnote 83**.

### Current native body

All three propositions and all Scripture citations remain in footnote 83, but the citations are static text rather than nested `.bref` controls.

No biblical reference content was deleted.

### Exact historical intent

Commit `e809b75d323d0409e7f5ac49e9f1ab3bd1b411da`:

`fix(hermenevtika): keep footnote Scripture references static (#438)`

explicitly repaired nested interactive Scripture controls inside footnotes 40, 72, 75, 77, 82, 83 and 107. Its contract rejects interactive descendants inside the governed static footnotes, including `button`, `a`, `[tabindex]`, `[role="button"]`, `.bref` and `[data-ref]`.

The current canonical tooltip runtime itself owns both `.fn-marker` and `.bref[data-ref]`; flattening nested Scripture controls prevents recursive/nested interaction ownership inside a footnote tooltip.

### Final disposition

All three candidates:

**`INTENTIONAL_FLATTENED_INSIDE_FOOTNOTE / ALREADY_GUARDED`.**

Do not restore `.bref` buttons inside footnote 83.

---

## C. Gill source→dist phrase probes

Directory-level `source=true` was never sufficient evidence of current publication loss. Each probe was traced to the canonical native article/import graph and editorial history.

### 1. Benjamin Stinton — Part I

Current canonical `GillPart1SectionPastor.astro` explicitly retains Benjamin Stinton in the Goat Yard / imputed-righteousness history, and the section is imported by `GillPart1ArticleBody.astro`.

**Disposition: `CURRENT_PRESENT`.**

The prior `source=true / dist=false` snapshot signal is stale/not representative of current canonical output.

### 2. никкуд — Part IV

The old phrase claimed that Gill `защищал точность масоретской огласовки (никкуд, акценты) против рационалистов`.

Final source reconciliation commit `877508fbfe42883b99922e3dcc717adfa91c33ad` explicitly puts that wording in the forbidden claim list and requires the modern textual-critical correction marker instead.

Current Part IV keeps the subject as `масоретская огласовка` with the modern text-critical caveat.

**Disposition: `SOURCE_CORRECTED_REFORMULATION / KEEP_OLD_WORDING_DELETED`.**

### 3. аналогия веры / `analogia fidei` — Part IV

Current canonical Part IV still contains `analogia fidei` and discusses Gill's reading of Romans 12:6.

Final source reconciliation forbids the previous broader formulation that Gill's `мера веры` is “по сути внешний догматический стандарт” and replaces it with a narrower claim: the specific Romans 12:6 passage demonstrates creedal control but does not prove that Gill's whole hermeneutic was governed by an external symbol instead of Scripture.

**Disposition: `CURRENT_PRESENT_WITH_NARROWED_CLAIM`.**

Do not restore the broader old synthesis.

### 4. Мемра — Part IV / Spravochnik

The sequence is especially important:

1. source-backed correction `c7fc89e9e82c72dcd874736dd227b0fcec4eafa3` kept Memra in Part IV but softened the strong historical claim and added a chronology caveat;
2. final source-debt commit `877508fb...` then deliberately removed the Memra example from the Part IV paragraph while further narrowing what the Judaica paragraph claims;
3. current canonical `GillSpravochnikSectionTerms.astro` still has a dedicated `Мемра (Memra)` card with the mature caveat: Gill used it as a Jewish parallel to John 1, but late Targums should not automatically be treated as immediate first-century background.

Therefore the concept is retained in the series, but no longer used as a Part IV methodological proof-example.

**Disposition: `INTENTIONAL_REMOVE_FROM_PART_IV / RETAINED_AND_CAVEATED_IN_REFERENCE`.**

Do not restore the old Part IV Memra sentence.

---

## Closure ledger

| ID | Candidate | Final disposition | Product edit |
|---|---|---|---|
| GILL-GTERM-01 | Particular Baptist | MOVED_TO_RUNTIME_HYDRATION | no |
| GILL-GTERM-02 | Horsleydown/Southwark | ANNOTATION_RETIRED_AFTER_PROSE_INTEGRATION | no |
| GILL-GTERM-03 | Gin Craze | MOVED_TO_RUNTIME_HYDRATION | no |
| GILL-GTERM-04 | Corporation Act | ANNOTATION_REDUNDANT_IN_CURRENT_PROSE_AND_FOOTNOTE | no |
| GILL-GTERM-05 | Test Acts | MOVED_TO_RUNTIME_HYDRATION | no |
| GILL-GTERM-06 | Bunhill Fields | ANNOTATION_RETIRED_AFTER_PROSE_INTEGRATION | no |
| HERM-BREF-01 | Isaiah 53 group in fn83 | INTENTIONAL_FLATTENED_INSIDE_FOOTNOTE | no |
| HERM-BREF-02 | Psalm 117 group in fn83 | INTENTIONAL_FLATTENED_INSIDE_FOOTNOTE | no |
| HERM-BREF-03 | Leviticus 19 group in fn83 | INTENTIONAL_FLATTENED_INSIDE_FOOTNOTE | no |
| GILL-PROBE-01 | Benjamin Stinton | CURRENT_PRESENT | no |
| GILL-PROBE-02 | никкуд | SOURCE_CORRECTED_REFORMULATION | no |
| GILL-PROBE-03 | аналогия веры | CURRENT_PRESENT_WITH_NARROWED_CLAIM | no |
| GILL-PROBE-04 | Мемра | INTENTIONAL_REMOVE_FROM_PART_IV / RETAINED_IN_REFERENCE | no |

## Wave 2A verdict

**CLOSED — no Product restoration lane required.**

The key lesson is methodological: static annotation counts and directory-level phrase probes are useful forensic locators, but they are not restoration oracles. Current runtime ownership, canonical import graph and source-backed editorial history must decide disposition.

Remaining Wave 2 scope is separate: the bounded Baptists 1884 low-similarity candidate package. It must not reopen these Gill/Herm candidates without new current evidence.
