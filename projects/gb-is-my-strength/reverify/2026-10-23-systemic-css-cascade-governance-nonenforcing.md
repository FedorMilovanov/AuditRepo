# Системная проверка: CSS cascade governance не исполняет опубликованную цель

Дата: 2026-10-23  
Product anchor: `caeb92c839ff4b4f2838a0ad44a582034c41c8d4`  
AuditRepo input: `e25e6db989281d1a8ceea8fb88c175c6237cedcf`  
Режим: read-only CSS/guard audit; Product не изменялся

## Итог

Добавлена новая system lane `SYS-CSS-CASCADE-GOVERNANCE-NONENFORCING`.

Это не требование «переписать весь CSS». Текущая обязательная publication validation запускает validator, который объявляет layered target 80%, измеряет 10–36%, печатает `VALIDATION PASSED` и возвращает exit 0. Одновременно `!important` ratchets закреплены ровно на текущем debt level, включая 524 в одном stylesheet.

Guard защищает синтаксис и предотвращает дальнейший рост некоторых счётчиков, но не исполняет собственный опубликованный cascade-ownership contract.

## Fresh exact command

На clean Product `caeb92c`:

```bash
node scripts/css-layer-validator.js css/site.css --ceiling=200
```

Exit: 0, `✅ VALIDATION PASSED`.

Auto-discovered governed roots:

| File | Layered | Unlayered | `!important` | Ceiling |
|---|---:|---:|---:|---:|
| `css/home.css` | 36.1% | 63.9% | 52 | none |
| `css/floating-cluster.css` | 10.0% | 90.0% | 524 | 524 |
| `css/site.css` | 19.0% | 81.0% | 200 | 200 |

Для каждого файла ниже 80% результат записан только в `warnings`; errors остаётся пустым, поэтому process exit = 0.

## Current mechanism

`scripts/css-layer-validator.js` задаёт:

```text
LAYERED_TARGET_PCT = 80
```

и документирует проверку `@layer architecture`. Однако ветка coverage выполняет:

```text
if layered < 80: warnings.push(...)
```

а terminal status зависит только от `errors.length`.

`package.json` включает `npm run css:layer:validate` в обе обязательные цепочки:

- `validate:static-publication`;
- `validate:static-publication:light`.

То есть зелёная publication validation реально исполняет этот guard, но зелень означает только parse/order/ceiling, а не заявленную layered coverage target.

## Cascade-debt census

Текущие верхнеуровневые CSS owners:

- `floating-cluster.css`: 5,121 lines, около 236 KiB, 86 media blocks, 524 `!important`;
- `site.css`: 1,494 lines, около 316 KiB, 184 media blocks, 200 `!important`;
- `home.css`: 1,586 lines, около 112 KiB, 115 media blocks, 52 `!important`;
- `mobile-hotfix.css`: 140 `!important`;
- `nagornaya-mobile-toc.css`: 134 `!important`.

`audit-pro.js` прямо сохраняет long-term goals:

- floating cluster: goal 100, ceiling 524;
- mobile hotfix: goal 0, ceiling 142;
- Nagornaya mobile TOC: goal 50, ceiling 134.

Но ветка `count > goal && count <= ceiling` вызывает `R.ok`, не warning/error. Это корректный anti-growth ratchet, но не progress enforcement.

## Почему это текущая необходимая защита, а не привлекательный refactor

1. Guard входит в обязательную publication chain и называется validator.
2. Он имеет машинно заданную цель 80%, которую все три governed roots нарушают в несколько раз.
3. Нарушение не может сделать check красным даже на 10% coverage.
4. Самый сложный owner уже содержит 524 priority overrides и 90% unlayered bytes.
5. Current MASTER содержит user-visible defects в shared chrome/reader/print owners, где cascade ownership является closure dimension; дальнейшие route-local overrides увеличивают риск конфликтов.

Наличие 524 `!important` само по себе не доказывает конкретный UI bug. Дефект защиты — несоответствие machine target и exit semantics.

## Bounded closure

Не требуется одномоментно достичь 80%. Нужна честная ratcheted enforcement модель:

1. Для каждого governed root фиксируется current layered baseline как максимум допустимого unlayered regression; baseline может двигаться только к 80%.
2. Добавление unlayered bytes/нового `!important` без явного исключения делает validation red.
3. Published 80% остаётся terminal goal, а не текущим якобы выполненным pass criterion.
4. `home.css` получает `!important` ceiling; сейчас его 52 вообще не ограничены.
5. Negative fixtures доказывают exit non-zero при layered regression, превышении любого ceiling и появлении нового ungoverned layered root.
6. Existing syntax/order/brace checks сохраняются.
7. Migration выполняется owner/class slices, а не mass specificity rewrite; browser/theme/mobile/print controls обязательны для каждого slice.
8. Guard output различает `baseline protected`, `target reached` и `target not reached`; слово PASS не должно означать последнее.

## Collision check

Открытые Product PR не меняют:

- `scripts/css-layer-validator.js`;
- `css/site.css`;
- `css/home.css`;
- `css/floating-cluster.css`;
- `package.json`.

PR #2179 меняет workflows, но не validator/CSS/package source. Перед Product mutation collision check повторяется.

## Что не заявлено

- Не заявлено, что 524 declarations можно безопасно удалить автоматически.
- Не заявлено, что `!important` всегда неверен: print/no-JS/accessibility exceptions могут быть обоснованы.
- Не заявлена конкретная performance стоимость stylesheet size.
- Existing direct contrast/print/reader bugs не поглощены без доказательства одного repair mechanism.
- CSS source и CI не изменялись.

## Воспроизводимость

```bash
node scripts/css-layer-validator.js css/site.css --ceiling=200
for f in css/*.css; do grep -o '!important' "$f" | wc -l; done
wc -l css/floating-cluster.css css/site.css css/home.css
```

Подробные raw outputs оставлены вне Git; в AuditRepo сохранены exact command, anchor, counts и claim boundary.
