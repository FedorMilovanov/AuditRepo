# Джон Гилл — первичные источники, контракты и финальный статус

**Дата приёмки:** 2026-07-24  
**Проекты:** `FedorMilovanov/Research`, `FedorMilovanov/gb-is-my-strength`  
**Режим:** доказательство по точным merge-коммитам; `main` и live production не смешиваются.

---

## 1. Каноническая цепочка изменений

### Research

1. `b5382cf4601165b48e15e8d8d233dedef6e2dea8`
   - исходный большой Gill research merge;
   - тома 43–70, матрица 120+ источников, историографические и первичные проверки.

2. `6e8cb73255c232967ff71d0192e63b5aaded5ec2`
   - PR `Research#11`;
   - том 72: первичный реестр 56 доказательных A1/A2-точек;
   - шесть A3/X-узлов отделены и не выданы за прочитанные полные тексты;
   - восстановлена навигация томов 52–72.

3. `3329223dbf7db84fbf0c19e0362d706dc0f0e58f`
   - PR `Research#12`;
   - том 73: двухпроходная приёмка 60 уникальных URL исходного реестра;
   - 37 URL открылись напрямую, 23 подтверждены повторно по точному ID/названию;
   - неидентифицированных мёртвых источников — 0;
   - слабый шлюз First London Confession заменён тремя прямыми Angus Library facsimiles;
   - после укрепления реестр содержит 63 размещения и 62 уникальных URL.

### Site content

4. `c7fc89e9e82c72dcd874736dd227b0fcec4eafa3`
   - редакционная Gill-волна слита в `gb-is-my-strength/main`;
   - историческое введение, Sandeman, Whitefield, eternal justification, hyper-Calvinism, chronology, Elizabeth Gill, rabbinics, church/family и reading times.

5. `d2105b801db126c30f0db57a9414f95ccba96111`
   - удалены шесть старых MDX-тел;
   - единственный редакционный источник Gill-материалов — нативные Astro-компоненты;
   - старые MDX и legacy HTML имеют только reference-only статус.

### Shared contracts

6. `14a69b861a8b2e36a26aebc4f6afe62aed2dde03`
   - PR `gb-is-my-strength#183`;
   - универсальный glossary runtime реконструирован на актуальном `main`;
   - exact-head success: Glossary source/browser, Overlay Chromium/Firefox/WebKit, Shared Files, Route Registry, Native Source, Visual Parity.

7. `34dc51f4d68f13135b25a8d318f7b590afc9cf5f`
   - PR `gb-is-my-strength#186`;
   - `content-coverage-audit.js` больше не повышает `legacyStatus=reference-only|absent` до production oracle;
   - legacy word-multiset gate сохранён для `canonical|runtime-required`;
   - production-like source-truth workflow прошёл read-only exact-head проверку;
   - ложный Gill drift `3963/5195` закрыт системно, без route-specific allowlist.

8. `659aa227381820c6da07235b6569b21d5b57d80a`
   - PR `gb-is-my-strength#185`;
   - строгий Bible Reference Contract: 66 книг, parser/resolver, dash normalization, `full`/`excerpt`, исправленные диапазоны;
   - 300 текущих канонических записей, 0 блокирующих ошибок;
   - exact-head success: Bible Reference, Shared Files, Glossary Contract, Visual Parity.

---

## 2. Что доказательно закрыто по Гиллу

### Первичные труды

Проверены прямые доказательные точки по:

- `A Collection of Sermons and Tracts`, vols. I–III;
- `The Cause of God and Truth`;
- `Doctrinal Divinity` и `Practical Divinity`;
- Trinity, Justification, Calling, Public Ministry, Public Hearing, Faith, Church, Discipline, Husband/Wife;
- `Solomon’s Song`;
- `Exposition of the Whole Bible` и контрольным главам;
- `The Necessity of Good Works`;
- `Proselyte Baptism`;
- funeral sermon Elizabeth Gill;
- Eternal Sonship, Predestination и Declaration of Faith.

### Современники и рецепция

Проверены:

- Rippon;
- Crosby;
- шесть томов `Works of George Whitefield`;
- Gillies;
- Sandeman;
- Spurgeon.

### Исповедания, Salters’ Hall и законы

Проверены первичные/факсимильные точки:

- First London Confession 1644 и 1646 — прямые Angus Library facsimiles;
- Second London Confession 1677;
- Standard Confession 1660;
- Salters’ Hall pamphlets;
- Corporation Act 1661;
- Act of Uniformity 1662;
- Conventicle Act 1664;
- Five Mile Act 1665;
- Test Act 1673;
- Toleration Act 1688/1689;
- Declaration of Breda 1660.

---

## 3. Закрытые спорные узлы

| Узел | Финальная формула |
|---|---|
| Sandeman | Линия Glas–Sandeman; не ученик и не прямой продолжатель Gill |
| Gill–Whitefield | Публикационно закрыто как сотрудничество/разногласия/спор источников; архивно не исчерпано |
| External call / duty-faith / offer | Категории разделены; preaching/external call не превращены автоматически в universal well-meant offer |
| Eternal justification | Многоуровневая схема: замысел, representation, historical accomplishment, declaration/knowledge through faith |
| Antinomianism | `Practical Divinity` и трактат о добрых делах запрещают формулу «Gill отрицал необходимость добрых дел» |
| Библиотека Gill | Подтверждён 18+[2]-страничный каталог; состав и суперлативы не вымышляются без полного facsimile |
| Раввинистика | Антианахронический метод подтверждён; тотальный 100+ concordance остаётся отдельной филологической задачей |
| Baptist decline | Линейная цепь `Gill → paralysis → Fuller → revival` не публикуется как установленный факт |

---

## 4. Старые PR, которые нельзя использовать

Закрыты как superseded:

- `gb-is-my-strength#161` — смешанный 143-файловый draft;
- `#175`, `#179`, `#180` — старые glossary-ветки;
- `#178` — старый Bible draft;
- `#184` — source-truth branch на устаревшем основании;
- `AuditRepo#27` — устаревший отчёт о 62/66 томах и draft `#156`.

Канонические преемники: `#183`, `#186`, `#185`, Research `#11` и `#12`.

---

## 5. Production boundary

Репозиторная архитектура deployment корректна:

1. каждый push в `main` входит в `Metadata & IndexNow Readiness` через catch-all `**`;
2. readiness выполняет cache-revision check, production-like build и publication gates read-only;
3. `Deploy to GitHub Pages` запускается только после successful readiness;
4. deploy checkout использует exact `workflow_run.head_sha`, а не moving `main`.

Но на момент live-проверки публичная Gill-страница ещё показывала старое значение введения `16 мин`. Поэтому этот файл **не утверждает**, что exact site SHA `659aa227…` уже опубликован.

### Статус

- `Research/main`: закрыто;
- `gb-is-my-strength/main`: закрыто по контенту и контрактам;
- exact-head CI: закрыто;
- live production witness exact SHA: **ожидает подтверждения после Pages-chain**.

Production можно перевести в `VERIFIED` только после одновременного свидетельства:

- live Gill series показывает новые canonical reading times;
- live `/data/bible/books.json` содержит новый 66-book registry;
- live glossary asset соответствует content revision из `659aa227…` или более нового `main`.

---

## 6. Честно оставленные неблокирующие долги

Не объявляются прочитанными или полученными:

- полный аукционный каталог библиотеки Gill;
- Particular Baptist Fund folios;
- Angus church books Goat Yard / Horslydown / Carter Lane;
- оригинал Spiller → Spurgeon;
- unpublished Whitefield correspondence;
- закрытые Haykin/Brill, Park, Ascol и другие неполные академические материалы;
- полный 100+ rabbinic concordance;
- Bible provenance/rights backfill для неполного разреженного корпуса.

Это evidence-triggered backlog, а не скрытый publication blocker. Новые редакционные утверждения добавляются только после получения материала, который реально меняет вывод.

---

## Вердикт

**Тема Джона Гилла закрыта редакционно, исследовательски и контрактно на доступном публичном корпусе.**  
**Она не объявляется архивно исчерпанной.**  
**Единственный незафиксированный рубеж на момент документа — live Pages witness exact SHA.**
