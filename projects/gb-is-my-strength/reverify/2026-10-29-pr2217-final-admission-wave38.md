# PR #2217: финальный exact-head admission — широкая волна 38

**Дата:** 2026-10-29  
**Product PR:** #2217  
**Exact head:** `ff860d39dd107997ba70470960bfb003ebc2be1a`  
**Граница:** read-only; Product PR, branch, labels, reviews, comments и files не изменялись.

## Mechanical final state

Последний exact-head re-query после завершения очереди CI:

- state: `OPEN`;
- draft: `false`;
- mergeable: `MERGEABLE`;
- merge state: `CLEAN`;
- checks: **39 success + 4 intentional skipped + 0 failure + 0 pending**;
- reviews: 0;
- comments: 0;
- review decision: empty.

PR содержит 17 commits, 60 changed files, 7,948 additions и 196 deletions. Из changed-file census:

- 6 article MDX files;
- 2 Home components;
- 1 script;
- 0 workflow files;
- 0 docs files.

Это механически merge-ready exact head. AuditRepo не является владельцем Product merge и не выполняет его.

## Что действительно исправлено на финальном head

1. Семь glossary records получили taxonomy category; общий glossary contract теперь отклоняет missing category/slug.
2. Home promotion cards работают pointer/keyboard/no-JS в desktop/mobile и ведут к правильным document identities.
3. Scripture occurrence index детерминированно обновлён на шесть Home occurrences; оба ранее красных index checks стали успешными.
4. Все 43 remote check outcomes относятся к текущему `ff860d39…`, а не к более раннему head.

Это реальные closure signals. Их нельзя обесценивать из-за отдельных semantic gaps.

## Что green CI не исправило

С `36066273b6e06f0c156a31531cf551ebfce98bf5` до финального head добавлены только два commits:

```text
c9ae14e3  Home promotion components
ff860d39  generated Scripture occurrence index
```

GitHub compare показывает только три изменённых файла в этом интервале:

- `src/components/home/HomeSections/Publications.astro`;
- `src/components/home/HomeSections/Refutations.astro`;
- `data/scripture-search-index.json`.

Следовательно, более ранние exact-head findings в series/quiz/reader owners не могли быть исправлены этими двумя commits:

- generic quiz relations/source fragments остаются fail-open и принадлежат `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`;
- обещанная bottom prev/next surface по-прежнему отсутствует на пяти новых частях и также принадлежит atomic authoring/series admission boundary;
- shared quiz-source mobile handoff остаётся current-main defect `GBS-GILL-QUIZ-SOURCE-LINK-MOBILE-NOOP`;
- print exclusion semantics остаются `SYS-READER-PRINT-EXCLUSION-POLICY-PARITY`;
- language/copy observations на новых статьях остаются PR observations до попадания в current main;
- wave 37 independently proves current-main `SYS-SCRIPTURE-EXACT-DESTINATION-REACHABILITY`; fresh index и green runtime checks не закрывают reader destination outcome.

Green exact-head CI поэтому означает: **все существующие обязательные checks прошли**, а не «все обнаруженные аудитом quality boundaries исправлены».

## Почему это не новый matrix row

Финальный admission state не создаёт новый causal mechanism. Напротив, он подтверждает уже разделённые роли:

- freshness/shape/registry gates эффективно ловят то, что они заявляют;
- semantic outcome gaps остаются у существующих direct/system owners;
- отсутствие workflow/docs изменений в крупной publication PR усиливает уже активный atomic-authoring lane, но не требует второй строки;
- отсутствие reviews/comments — факт GitHub state, а не доказательство плохого процесса само по себе.

Нельзя честно превратить «CI зелёный, а audit findings существуют» в общий новый defect: это нормальное ограничение bounded checks. Исправлять нужно конкретные доказанные owners, а не добавлять mega-gate или требовать весь repository suite для каждой статьи.

## Merge disposition

- Product PR технически готов к merge по текущей GitHub admission policy.
- AuditRepo не выдаёт owner approval за редактора и не блокирует/мержит чужую lane.
- Если Product owner выбирает merge сейчас, остающиеся current-main/system rows должны продолжить собственные closure lanes; они не должны теряться из-за зелёного PR.
- Если owner требует semantic sign-off до merge, перечисленные exact findings дают конкретный bounded список, а не абстрактное «ещё проверить всё».

## Итог

1. Final exact head полностью зелёный и `CLEAN`.
2. Stale-index omission закрыт корректно.
3. Green CI не отменяет независимо доказанные semantic outcomes.
4. Новый matrix unit не нужен.
5. Арифметика остаётся **57 = 28 direct + 7 improvements + 1 residual + 21 system lanes**.
6. Product merge, comment и mutation не выполнялись.

**Широкая волна 38 завершена.**
