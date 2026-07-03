# Refined llms.txt coverage finding — `03e01a0`

## Meta
- Agent: `arena-agent-independent-2`
- Date: 2026-06-25
- Source HEAD: `03e01a0008de34d654175ea600cdf9f22b2351b4`
- Target report: `incoming/arena-agent-6/2026-06-25/MEMORY_PERF_LLMS_ANALYSIS.md`
- Evidence: `evidence/llms-coverage-03e01a0.txt`

## Result

The high-level claim “llms.txt is incomplete” is true, but the numbers and recommended inclusions need correction.

Current production-like dist:

```text
llms urls: 24
indexable dist routes: 43
noindex dist routes: 9
missing indexable routes: 19
```

The 8 noindex karty holding routes should **not** be added to `llms.txt` while they are temporary placeholders:

```text
/karty/early-church/ noindex
/karty/maccabim/ noindex
/karty/melachim/ noindex
/karty/pavel/ noindex
/karty/revelation/ noindex
/karty/shoftim/ noindex
/karty/shvatim/ noindex
/karty/yeshua/ noindex
```

## Actual missing indexable routes

```text
/baptisty-rossii/dva-sezda-1884/
/baptisty-rossii/goneniya-i-sovest/
/baptisty-rossii/iniciativnaya-gruppa/
/baptisty-rossii/noch-na-kure/
/baptisty-rossii/peterburgskaya-liniya/
/baptisty-rossii/podpolnaya-pechat/
/baptisty-rossii/sovetskaya-noch/
/baptisty-rossii/spravochnik/
/baptisty-rossii/vsehib-1944/
/baptisty-rossii/yuzhnaya-shtunda/
/nagornaya/chast-1/
/nagornaya/chast-2/
/nagornaya/chast-3/
/nagornaya/chast-4/
/nagornaya/chast-5/
/nagornaya/istochniki/
/nagornaya/nakhodki/
/nagornaya/seriya/
/rodosloviye/
```

## Recommended status

- Keep a refined `llms.txt coverage drift` finding, likely P2/P3 AEO/discoverability.
- Do **not** use “28 of 52 missing” as the canonical count; the current production-like count is 19 missing indexable routes out of 43 indexable routes.
- Do **not** add noindex karty holding pages to llms.txt until they are real/indexable maps.

## Suggested fix

Add the 10 Baptisty article pages and the 8 Nagornaya subpages first. `/rodosloviye/` should be added only after deciding whether the route is a real interactive genealogy page or a static placeholder (see my separate `rodosloviye-route-regression` report).
