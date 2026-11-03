# PDF completeness и merge-readiness — broad wave 53

**Текущий Product main:** `4577af55416ef76827184c6b117471355ea3b3d2`.  
**Полный browser/PDF corpus:** `c734ad540b526d8e76d524370c71da6a45048e06`.  
**Доказательство:** `evidence/2026-11-03-pdf-completeness-merge-readiness-wave53.jsonl`.

## Почему корпус остаётся точным для print-поверхности

После wave 52 Product main сдвинулся ровно на один commit. Diff `c734ad540… → 4577af55…` содержит только новый root-файл `yandex_d8876d66da1b4592.html` из шести строк. Не изменены print routes, Astro components/layouts, CSS, reader/print runtime, assets, route/profile data, package/lockfile или build scripts. Файл верификации не входит ни в один из 73 reader print documents и не меняет их DOM, cascade, action path или pagination. Поэтому повторять 1 425 идентичных растров ради authority-only сдвига было бы ложной работой; wave-51/52 corpus остаётся exact для проверяемых входов.

На чистом current main заново выполнены применимые checks:

- `npm ci` — успешно, lockfile не изменён;
- `check-print-geometry-contract.js` — 10/10;
- `check-engine-contracts.js` — green;
- `reader-projection-source-contract.mjs` — 70/70;
- `ci-browser-print-stability-contract-test.mjs` — green;
- production-like build — 111 Astro pages, 0 errors, 0 warnings, семь прежних hints.

## Закрытие оставшегося checklist

Waves 47–52 образуют один непрерывный PDF-аудит, а не шесть независимых выборок. Проверены следующие границы:

| Граница | Финальное доказательство | Disposition |
|---|---|---|
| Native действие и download | 73/73 trusted clicks, print ровно один раз, URL stable, download events 0 | label mismatch уже у `SYS-READER-PRINT-ACTION-LABEL-SEMANTICS` |
| Desktop/mobile, Light/Dark, motion | восемь representative routes × 4 профиля; затем все 73 mobile Dark/reduced | desktop parity здоров; mobile one-page clipping у существующего owner |
| Реальный painted output | 73 PDF / 1 425 A4 pages; все просмотрены по порядку, 88 sparse seams отдельно | полный corpus, не DOM-only witness |
| Порядок, blank/duplicate, края | duplicates 0, edge spans 0, replacement glyphs 0; один известный Gill blank tail | Gill blank имеет direct owner |
| Headings и paragraph seams | три автоматических heading-orphan кандидата визуально опровергнуты; malformed order не найден | нового owner нет |
| Atomic blocks и linked cards | declared atomics: splits 0; два необъявленных component families реально фрагментируются | принят `SYS-PRINT-LINKED-CARD-ATOMICITY` |
| Figures/images/captions | 140 image objects просмотрены, clipping 0; image-backed covers целы; 30 canonical captions физически скрыты | hidden caption/no-image geometry у parity owner |
| Tables | семь multi-page tables, десять continuation sheets, headers 10/10, split rows 0 | нового table-owner нет |
| Links и назначения | 2 020 annotations; paths/fragments/GOTO pages/points valid; outside/zero rectangles 0 | все три different-target overlaps примирены с owners |
| Terminal sections | bibliography/byline/cards/final sections сохранены; кроме owned Gill blank tail новых пропусков нет | нового terminal-owner нет |
| PDF metadata | title 73/73; author/lang/tagging/outlines отсутствуют у browser exporter | ограничение browser-export без Product owner |
| Console/network | Product page errors 0, broken images 0; Metrika/Wikimedia failures отфильтрованы как sandbox egress | не Product defect |

Обычные paragraph splits не объявляются дефектом сами по себе: они проверялись визуально на seam sheets; admission требовал потери порядка, текста, читаемости или смысловой атомарности. Реальный такой outcome найден только у linked cards и уже имеет owner.

## Owner reconciliation

Все подтверждённые PDF outcomes имеют ровно одного текущего владельца:

1. Gill blank tail — `GBS-GILL-HISTORY-PRINT-TRAILING-BLANK-PAGE`;
2. BaseLayout repeated skip-link — `GBS-BASELAYOUT-PRINT-SKIP-LINK-REPEATS`;
3. mobile lock clipping — `SYS-READER-MOBILE-PRINT-LOCK-CLIPS-DOCUMENT`;
4. misleading download labels — `SYS-READER-PRINT-ACTION-LABEL-SEMANTICS`;
5. semantic↔painted parity и 20 no-image covers — `SYS-READER-PRINT-EXCLUSION-POLICY-PARITY`;
6. Gill/Antisovetov linked cards — `SYS-PRINT-LINKED-CARD-ATOMICITY`;
7. Lot diagram microtext — `GBS-LOT-PRINT-DIAGRAM-MICROTEXT`.

Не осталось PDF-наблюдения, которое одновременно подтверждено и не имеет disposition. MASTER остаётся **63 = 30 direct + 8 improvements + 1 residual + 24 system**: wave 53 не производит строку «ради волны».

## Merge-readiness

AuditRepo PR #512 содержит waves 51–53 поверх уже merged waves 47–50. Product не изменялся и Product PR не создавался. После добавления этой closure-записи нужны только обычные AuditRepo exact-head Validate и Workflow Preflight; при зелёном head пакет готов к merge без дополнительной PDF-волны.

**Broad wave 53 завершена. PDF scope закрыт; новых непроверенных границ в заявленном checklist нет.**
