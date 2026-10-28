# Широкая волна 16: системная защита и универсальные publication gates

Дата: **2026-10-28**
Product: exact `1a67c65cf2a30b06200480b7245abab873447a47` = `origin/main`; дерево чистое.
Open owner: Product PR #2215 добавляет отдельный Hard Texts материал; shared gate/workflow owners этой волны не меняет.
Машинный receipt: `evidence/2026-10-28-system-protection-universal-gates-wide.jsonl`.

## Итог

Волна проверила не отдельные страницы, а общие admission/projection owners. Ни одна из семи системных строк не получила достаточного closure proof:

- `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN`;
- `SYS-CSS-CASCADE-GOVERNANCE-NONENFORCING`;
- `SYS-DEPENDENCY-ADVISORY-LIFECYCLE`;
- `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT`;
- `SYS-PUBLICATION-MIXED-SCRIPT-SURFACE-COVERAGE`;
- `SYS-HEAD-ASSET-PROJECTION-PROLIFERATION`;
- `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`.

Матрица остаётся **54 active = 28 direct + 7 improvements + 1 residual + 18 systems**. Зелёный happy-path validation не подменял negative-fixture и ownership proof.

## 1. Полный статический admission path зелёный

`npm run validate:static-publication` завершился exit 0 и выполнил всю `&&`-цепочку, включая strict validation, SEO, owner UI, visual-parity owners, maps, page ownership, tokens, CSS validator, audit-pro, content parity/hygiene, article QA, readable/editorial gates, Gill data/claims, migration/source registries и service-worker readiness.

Ключевые размеры текущего прохода:

- 104 production Astro routes в route-profile/runtime matrix;
- 105 public surfaces;
- 70 MDX files в structure audit;
- 31 route в native article contract;
- 180 article files в `article:qa`;
- 11 map route files;
- strict source provenance для 49 published series parts.

Отдельно зелёные `article:qa`, `readable-audit`, `maps:validate` и `content:coverage:audit`. Последний честно сообщает `expected=0, exercised=0, explicit-skips=104`: это green health существующего контракта, но не доказательство атомарного authoring admission.

## 2. Typograf остаётся fail-open

`npm run typograf:dry` снова перечисляет ровно шесть файлов:

- Antisovetov;
- Gill II;
- Gill III;
- Hermenevtika;
- Kod Da Vinci;
- Krajne.

Вывод: `Would change: 6 files`, process exit **0**. Следовательно, зелёный check по-прежнему не означает отсутствие typographic drift. Строка остаётся активной; generated-only rewrite не выполнялся.

## 3. CSS cascade gate остаётся advisory

Project validator обнаруживает те же три roots и завершает каждый как `VALIDATION PASSED`, хотя target ≥80% не достигнут:

| Root | В `@layer` | `!important` |
|---|---:|---:|
| `home.css` | 35.4% | 52, ceiling отсутствует |
| `floating-cluster.css` | 9.9% | 524, ceiling = current debt |
| `site.css` | 18.8% | 200, ceiling = current debt |

Syntax/balance и anti-growth ceilings полезны, но target completion остаётся warning-only. Универсальной отрицательной фикстуры для провала coverage нет; строка не закрыта.

## 4. Dependency lifecycle остаётся незавершённым

Fresh registry audit 2026-10-28 возвращает один direct moderate package record `astro`:

- `GHSA-98hj-9722-w3j8`, moderate;
- `GHSA-mpr7-6m5w-76rw`, low;
- high/critical: 0.

`npm audit` exit 1 и `npm-security-contract.mjs` exit 1 — gate честно красный. Но `.github/workflows/dependency-security.yml` имеет только filtered PR/push и `workflow_dispatch`; `schedule` отсутствует. Для unchanged-main advisory drift нет автоматического detect event, а terminal repair/dated acceptance не зафиксирован. Строка остаётся активной.

## 5. Language of parts остаётся reader-visible

Native Chromium повторён на Greek и Hebrew controls при 390/1280 × Light/Dark. Во всех восьми route-profile witnesses painted text наследует `lang="ru"`:

- Greek `τούτοις` и полный `τὸν ὅμοιον τρόπον τούτοις`;
- Hebrew `שָׁמִיר` в видимом reader paragraph.

Geometry положительна; это не hidden metadata. Exact-main полный census из предыдущего прохода остаётся применим к тому же SHA: 289 missing occurrences на 39 routes при 376 корректно размеченных controls. Axe не умеет выводить отсутствующий язык из текста, поэтому green Axe не является closure proof.

## 6. Mixed-script coverage остаётся фрагментарным

`article:qa` зелёный на 180 files, `readable-audit` и `maps:validate` также зелёные. При этом source authorities всё ещё содержат:

- `Чекy` с Latin U+0079 в `karty/ishod/route.json` — два reader/print значения;
- `hе` с Latin `h` + Cyrillic `е` в `karty/avraam/route.json` и legacy app projection.

То есть три независимых green gates по-прежнему пропускают single-homoglyph corruption в JSON/dynamic surfaces. Строка сохраняется; allowlist и negative fixtures не появились.

## 7. Head asset ownership остаётся распределённым

Новый узкий source recount на 576 `.astro` files находит 81 файл с **484** literal `?v=<8hex>` по строгому regex. Это не объявлено заменой более широкого исторического счётчика 493: новый regex намеренно считает только одну literal shape. Даже консервативная граница доказывает десятки ручных writers.

Тот же narrow recount находит 64 Astro files и 102 production-pinned common head refs по ограниченному набору favicon/apple-touch/manifest/feed patterns. Полного shared authority/manifest нет; один asset mutation всё ещё требует fan-out. Строка остаётся активной.

## 8. Dateline positive contracts не закрывают event identity

`editorial-dateline-contract-test.js` зелёный: 21 synchronized occurrence в 9 files. Browser visual contract зелёный: шесть desktop/mobile checks, включая print preparation.

Это подтверждает форму компонента, но не опровергает активную `SYS-EDITORIAL-DATELINE-SLOT-SEMANTICS`: тест покрывает Gill visual owner, а девять Baptist/Nagornaya residuals про publication-vs-modified event identity остаются на том же exact SHA. Строка сохранена без новой дроби.

## 9. Content authoring остаётся без атомарного negative admission

Happy path теперь широк и зелён: route profiles, migration matrix, source provenance, public surface registry и static publication chain согласованы. Но `content:coverage:audit` на current corpus упражняет **0** expected source→dist manifests и делает 104 explicit skips; это не убивает известные negative mutations publishable orphan MDX/config-only item.

В Product по-прежнему нет first-class scaffold/typed transaction, который атомарно связывает content, route, series config, ownership, discovery и generated registries. Поэтому зелёный существующий corpus не закрывает `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`.

## 10. Красные и ограничения

Честно красные:

- `npm audit`: 1 moderate direct record;
- `npm-security-contract.mjs`: FAIL/exit 1 на том же record.

Честно зелёные, но недостаточные для closure:

- typograf dry exit 0 при шести изменениях;
- CSS validator PASS при 9.9–35.4% против target 80%;
- article/readable/maps/static publication gates при сохраняющихся language/mixed-script/authoring gaps.

Первый запуск dateline visual contract без его требуемого server env получил `ERR_CONNECTION_REFUSED` на default `:4173`; корректный повтор с `DATELINE_BASE_URL=http://127.0.0.1:4321` прошёл 6/6. Это harness invocation error, не Product defect.

## Решение

Широкая волна **16** завершена. Она подтверждает, что текущий happy path стабилен, но universal protection ещё не гарантирует strict typography, cascade target, scheduled advisory lifecycle, language-of-parts, mixed-script payloads, central head projection или atomic authoring. Product не изменялся, матрица не искусственно уменьшалась, PR #2215 не пересекался.
