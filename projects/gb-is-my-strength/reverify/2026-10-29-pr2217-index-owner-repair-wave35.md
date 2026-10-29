# PR #2217: точность owner-repair индекса Писания — широкая волна 35

**Дата:** 2026-10-29  
**Product PR:** #2217, exact head `ff860d39dd107997ba70470960bfb003ebc2be1a`  
**Сравниваемый head:** `c9ae14e3dfab39b9c7db23eeeda76ae7a3c97d59`  
**Граница:** detached read-only; Product-файлы, PR, labels и комментарии не изменялись.

## Что изменилось после волны 34

Владелец PR добавил один узкий repair-коммит:

```text
ff860d39 fix(scripture): regenerate occurrence index for homepage Евреям 6 mentions
```

Diff `c9ae14e3…ff860d39` затрагивает только `data/scripture-search-index.json`: 91 добавленная и одна изменённая строка. Никакой параллельной правки компонентов, workflow, scripts или editorial content в repair-коммите нет.

## Exactness против заранее вычисленного witness

В волне 34 индекс был контролируемо сгенерирован из `c9ae14e3…`, его diff сохранён вне Product checkout, после чего Product-файл был восстановлен. Этот witness предсказывал:

- `references`: 1368, без изменения;
- `occurrences`: 3468 → 3474;
- ровно шесть новых occurrence для `/`;
- четыре occurrence с owner `src/components/home/HomeSections/Publications.astro`;
- два occurrence с owner `src/components/home/HomeSections/Refutations.astro`;
- `sourceKind: astro-source` для всех шести.

Нормализованный patch owner-коммита байт-в-байт совпал с сохранённым диагностическим patch волны 34 (`diff` exit 0). Это не приблизительное совпадение количества: порядок, context, route, topics, sourceOwner и sourceKind совпали полностью.

## Локальные контракты на новом exact head

На `ff860d39…` выполнены:

```text
node scripts/build-scripture-occurrence-index.mjs --check
→ current: 1368 references, 3474 occurrences, 102 routes

node scripts/scripture-occurrence-index-contract.mjs
→ passed: 1368 references, 3474 occurrences, 149 curated text records

git diff --exit-code
→ clean
```

Следовательно, генерация идемпотентна, source-owned index актуален, а repair не оставляет скрытого post-check diff.

## Агент или система

### Что относится к ошибке агента

Первичный Home-коммит изменил два сканируемых `src/components/**` owner-файла, но не выполнил обязательную генерацию перед push. Сам checker сообщает конкретное восстановление: stale index → run with `--write`. PR path-trigger включает `src/components/**`, поэтому omission не мог пройти exact-head CI незамеченным. Владелец исправил его одним детерминированным коммитом без ручного редактирования результата.

### Что относится к системной эргономике

Корневые `AGENTS.md` и `AGENTS-REFERENCE.md`, таблица `docs/WORK_MODES.md` и package scripts не называют `build-scripture-occurrence-index.mjs`. Общий `validate`, `validate:all` и даже generic production-like build не включают его; применимый command discoverable в workflow/script failure, но не в компактном preflight router. Поэтому защита сильна на admission, но слабее до первого CI round-trip.

Это не новый независимый дефект. Наблюдение уже принадлежит активному `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`: typed publication plan должен вычислять все source-derived projections и запускать их check/write как одну транзакцию. Добавлять ещё один prose checklist или отдельную matrix-строку означало бы дублировать тот же root cause.

## Итог

1. Owner-repair технически точен и минимален.
2. Шесть новых Home occurrences полностью совпадают с независимым witness волны 34.
3. Два ранее красных check теперь должны оцениваться только на `ff860d39…`; в момент первичной проверки новой волны они были заново queued, поэтому удалённый exact-head CI ещё не объявлялся зелёным.
4. Классификация остаётся смешанной: конкретный omission — избегаемая ошибка агента; поздняя discoverability — уже учтённая системная граница atomic authoring.
5. Арифметика matrix не меняется: **56 = 28 direct + 7 improvements + 1 residual + 20 system lanes**.
6. Product lane не мутировался и owner repair не был перехвачен аудитом.

**Широкая волна 35 завершена.**
