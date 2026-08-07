# Regression / Preservation Wave 2B — Baptists 1884 / research-locator disposition

Date: 2026-08-07

## Purpose

Resolve the 48 low-similarity candidates from the Baptists corpus without treating internal research paths, OCR locators, saved-PDF paths or historical research-dossier navigation as public reader content.

Forensic source:

`deep_audit_20260807/broad/baptisty_missing_sentence_candidates.csv`

## Result

**48 candidates reviewed as one bounded corpus → 0 confirmed current reader-content regressions → no public Product restoration required.**

The candidates split into three very different classes:

1. substantive historical claims now present/rephrased or strengthened in current native articles;
2. provenance statements superseded by stronger primary-source evidence;
3. internal research/OCR/PDF/filesystem locators deliberately absent from current reader surfaces, while their source role is preserved through public reading lists and the retained research corpus.

One separate hygiene finding remains: parts of the internal research index/dossier still describe the older B/C status of the 1960 `Инструктивное письмо`, while the current public article states that a 10-page typewritten primary copy has since been found/read. This is **research-memory drift**, not a public regression, and must be reconciled only after the exact primary artifact/provenance record is re-located.

---

## Candidate distribution

| Route | Candidates | Disposition |
|---|---:|---|
| `/baptisty-rossii/dva-sezda-1884/` | 13 | substantive claims current-present/rephrased; locator lines replaced by reader-facing source apparatus |
| `/baptisty-rossii/spravochnik/` | 12 | internal research-file navigator retired from public reference page; research corpus remains separate |
| `/baptisty-rossii/podpolnaya-pechat/` | 7 | bulletin/PDF evidence moved from local locator prose into current narrative + public source links |
| `/baptisty-rossii/iniciativnaya-gruppa/` | 4 | older B/C provenance superseded by stronger primary-source claim; one internal dossier locator retired |
| `/baptisty-rossii/yuzhnaya-shtunda/` | 4 | URL/OCR locator lines replaced by current reader-facing primary-source links |
| `/baptisty-rossii/noch-na-kure/` | 3 | URL/OCR locator lines not public canon; current article preserves source-critical historical distinctions |
| `/baptisty-rossii/goneniya-i-sovest/` | 2 | bulletin #9 evidence is integrated into current Ivan Moiseev section + source list; dossier path retired |
| `/baptisty-rossii/peterburgskaya-liniya/` | 1 | internal research dossier locator only |
| `/baptisty-rossii/sovetskaya-noch/` | 1 | internal research dossier locator only |
| `/baptisty-rossii/vsehib-1944/` | 1 | internal research dossier locator only |

---

## A. `/dva-sezda-1884/` — 13 candidates

This was the highest-risk cluster because most candidates were real historical propositions rather than path locators.

Current native article preserves the decisive distinctions:

- **1–6 April 1884, Petersburg** — Pashkov/Korf, broad interdenominational evangelical consultation, police interruption/ban;
- **30 April–1 May 1884, Novo-Vasilievka** — specifically Baptist organizational congress and formation of the Union;
- **Tiflis 1867** remains a separate confessional-history origin point rather than being conflated with either 1884 event.

Current article framing is stronger than the forensic candidate wording: the page itself is organized around the two 1884 forks and explains why they must not be merged into a single “first congress” story.

The remaining three candidate rows were source-locator/OCR/internal-research statements, not lost reader claims; current article uses a reader-facing `Источники и сверка` section instead.

**Disposition: `CURRENT_PRESENT_OR_REPHRASED / SOURCE_APPARATUS_MODERNIZED`.**

No restoration.

---

## B. `/iniciativnaya-gruppa/` — 4 candidates

The older forensic source said the 1960 `Инструктивное письмо` still needed an archival/original copy and that the public reproduction remained B/C-level evidence.

Current native article states that a **10-page typewritten primary copy has been found and read page-by-page**, and that key formulas were therefore raised to primary-source status.

Thus the old candidate is not omitted evidence; it is an obsolete weaker provenance state.

**Disposition for the three substantive rows: `SUPERSEDED_BY_STRONGER_PROVENANCE`.**

The fourth row is the internal research-dossier path and is not public reader canon.

### Separate research-memory drift

The consolidated master research dossier still contains an older checklist line saying the full `Инструктивное письмо` needs to be found/verified, and the older specialized transfer dossier contains B/C-era wording. These internal notes therefore lag behind the current article's stronger provenance claim.

Do **not** weaken the article back to the old state and do not rewrite the research files from the article alone. Re-locate the exact 10-page scan/OCR/provenance receipt, then update the research index/dossier as one bounded research-hygiene transaction.

**Classification: `RESEARCH_INDEX_DRIFT`, not Product regression.**

---

## C. `/podpolnaya-pechat/` — 7 candidates

The low-sim rows were mostly local saved-PDF/catalog/research paths for the Council of Prisoners' Relatives bulletins.

Current native reader surface preserves the actual evidence at a higher level:

- explains that a working bulletin PDF corpus was found;
- names control issues **№9, №10 (1972), №44 (1977), №84 and №88 (1980)**;
- explains what documentary classes they contain;
- integrates the evidence into the narrative about repression, psychiatry, literature confiscation, prisoners and families;
- `Источники и сверка` exposes reader-facing links to the same bulletin issues.

Internal `raw-sources/...` and research catalogue paths are implementation/provenance infrastructure and should not be copied into article prose.

**Disposition: `SOURCE_EVIDENCE_PRESERVED / INTERNAL_LOCATORS_RETIRED`.**

No restoration.

---

## D. `/yuzhnaya-shtunda/` — 4 candidates

The candidate rows are archive/OCR locators for January, February and December 1870 issues of *The Missionary Magazine* and related research notes.

Current article preserves their reader value directly:

- discusses Unger/Oncken January-February 1870 evidence;
- explicitly distinguishes what the letters do and do not prove;
- uses December 1870 Pritzkau evidence for Steinberg/Annenthal/Odessa and conferences;
- exposes public Internet Archive links to the January, February and December issues in `Источники и сверка`.

**Disposition: `PUBLIC_SOURCE_LINKS_REPLACE_INTERNAL_OCR_LOCATORS`.**

No restoration.

---

## E. `/noch-na-kure/` — 3 candidates

The three low-sim rows are research/OCR/Internet Archive locator lines, not unique narrative facts.

Current native article retains the actual source-critical work:

- Voronin's 1889 retrospective and its scan provenance;
- Kalweit's July 1869 letter as the earliest external Tiflis witness;
- explicit limitation that the Kalweit letter does **not** itself name Voronin or narrate the Kura baptism;
- differentiation between confessional memory and what the early primary document can establish.

**Disposition: `RESEARCH_LOCATOR_NOT_PUBLIC_CANON / SOURCE_CRITICISM_CURRENT`.**

No restoration.

---

## F. `/goneniya-i-sovest/` — 2 candidates

One row was the local bulletin №9 PDF locator, the other the internal research dossier path.

Current article contains a full Ivan Moiseev section and explicitly says that bulletin №9 (1972) publishes the parents' report, documents and testimony around his death. Its current reading list exposes the bulletin as a public PDF link.

**Disposition: `BULLETIN_EVIDENCE_INTEGRATED / INTERNAL_LOCATOR_RETIRED`.**

No restoration.

---

## G. `/spravochnik/` — 12 candidates

All twelve rows are the old public page enumerating internal research files such as:

- `baptist_history_research.md`;
- `00-master-source-index-glossary-map.md`;
- route-specific research dossiers;
- bulletin catalogue/OCR files.

The current public `Справочник источников` intentionally presents a reader/editorial model instead:

- source confidence levels A/B/C/D;
- people, dates, documents and open questions;
- reader-facing source criticism;
- editorial queue in human terms rather than repository filesystem paths.

The actual internal research corpus remains in `baptisty-rossii/research/**`; the master dossier explicitly describes itself as a navigator over that corpus and a living transfer checklist.

Repository-internal file names are not reader-facing canonical content.

**Disposition: `PUBLIC_IMPLEMENTATION_DETAIL_RETIRED / RESEARCH_CORPUS_RETAINED`.**

Do not restore internal paths to the public page.

---

## H. Single locator candidates

The remaining candidates for:

- `/peterburgskaya-liniya/`;
- `/sovetskaya-noch/`;
- `/vsehib-1944/`

are only internal research-dossier path references.

**Disposition: `RESEARCH_NAVIGATION_NOT_PUBLIC_CANON`.**

No restoration.

---

## Closure ledger

| Class | Rows | Product action |
|---|---:|---|
| Current-present / rephrased historical narrative | 10 | none |
| Superseded by stronger provenance | 3 | none |
| Public source apparatus replaces internal locator | 13 | none |
| Internal research navigator / filesystem implementation detail | 22 | none |
| **Total** | **48** | **0 public restorations** |

The class counts are a disposition summary, not a new regression metric.

## Wave 2B verdict

**PUBLIC REGRESSION WAVE CLOSED — 0 confirmed reader-content losses.**

The only actionable residue is separate:

`RESEARCH_INDEX_DRIFT — Initiative Group / Инструктивное письмо provenance notes`

It should be reconciled only after locating the exact primary scan/provenance receipt. It must not enter the Product MASTER as a reader bug and must not weaken the already stronger public article.

## Combined Wave 2 result

Wave 2A: 13 Gill/Herm candidates → 0 current regressions.

Wave 2B: 48 Baptists candidates → 0 current reader regressions.

Therefore the original high-signal semantic recovery shortlist now contains **no confirmed Product restoration work**. Future restoration claims require new current evidence, not replay of these forensic counters.
