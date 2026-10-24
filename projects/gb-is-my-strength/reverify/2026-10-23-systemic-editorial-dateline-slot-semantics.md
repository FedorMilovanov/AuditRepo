# Системная проверка: семантика editorial dateline slots

Дата: 2026-10-23  
Product anchor: `caeb92c839ff4b4f2838a0ad44a582034c41c8d4`  
AuditRepo input: `b9e1238fe65632ba7a83d3b7e59ac89bf23b9dd5`  
Режим: read-only causal consolidation; Product не изменялся

## Итог

Две current строки являются проявлениями одного неполного projection contract:

- `GBS-BAPTISTS-BYLINE-PUBLICATION-DATE-DIVERGENCE`;
- `GBS-NAGORNAYA-PUBLISHED-DATELINE-CARRIES-MODIFIED-INSTANT`.

Они поглощены system lane `SYS-EDITORIAL-DATELINE-SLOT-SEMANTICS`.

Это не возврат закрытого `METADATA-SSOT-PROLIFERATION`: canonical approved exact instants уже корректно проецируются в metadata/Search/Sitemap/RSS. Новый текущий root уже и относится только к связи **visible slot semantics ↔ visible editorial label ↔ projected machine instant**.

## Общий текущий механизм

`scripts/lib/editorial-metadata-v3.js:216–235` → `projectVisibleDateline()` определяет событие по CSS-классу и позиции:

1. первый `<time>` внутри container `.article-updated` получает `editorialModifiedAt`;
2. standalone `time.article-updated` получает `editorialModifiedAt`;
3. первый `<time>` внутри `.article-byline` получает `editorialPublishedAt`.

Функция изменяет только `datetime`. Она не знает, написано ли рядом «Опубликовано» или «Обновлено», и не владеет human label.

Поэтому green projection доказывает, что approved instant записан в найденный class-shaped target, но не доказывает:

- что target представляет тот же editorial event;
- что видимая дата принадлежит этому event;
- что container с историческим CSS-именем не используется в другом семантическом slot.

## Проявление 1: Baptists

В четырёх source components единственный visible byline `<time>` содержит label `13 июня 2026`:

- `iniciativnaya-gruppa`;
- `podpolnaya-pechat`;
- `vsehib-1944`;
- `sovetskaya-noch`.

Canonical registry/approved decision при этом задаёт другие publication events. Пример `iniciativnaya-gruppa`:

- source observation `visiblePublishedAt = 2026-06-13`;
- approved `editorialPublishedAt = 2026-06-08T00:00:00+03:00`;
- approved modified instant обновлён отдельным owner decision.

Projection находит первый `<time>` в `.article-byline` и корректно меняет его `datetime` на publication instant, но оставляет видимый update-day label `13 июня`. Получается один element, в котором label и machine value сообщают разные publication dates.

Здоровые controls подтверждают, что проблема не во всём Baptists layout:

- Spravochnik был исправлен отдельно;
- Peterburg показывает два явно разделённых события (publication + update).

## Проявление 2: Nagornaya

Пять глав имеют source markup вида:

```html
<p class="article-updated">Опубликовано: <time datetime="2026-05-01">1 мая 2026</time></p>
```

Здесь visible slot явно publication, но class `.article-updated` заставляет projection записать `editorialModifiedAt`:

- parts 1/2/4: July 22 modified instant;
- part 3: July 5;
- part 5: July 22;
- publication metadata остаётся April 30 21:00Z = May 1 MSK.

Fresh browser/artifact evidence ранее подтвердило 20 failing chapter/profile states. Green metadata approval и dateline tests этот конфликт не видят, потому что fixture закрепляет class-based projection.

## Почему это один repair owner

Baptists и Nagornaya расходятся в направлении ошибки:

- Baptists: publication instant проецируется в slot с неправильным visible label;
- Nagornaya: modified instant проецируется в visibly published slot.

Но механизм один: event identity выводится из presentation class/позиции, а visible label остаётся вне approved projection contract.

Route-local замена девяти строк устранит текущие симптомы, но оставит возможность повторить оба класса ошибки. Bounded systemic repair должен дать dateline slot явную event identity и проверяемую visible-label authority.

## Необходимая граница исправления

1. Publication/modified slots маркируются семантически (`data-editorial-event`, typed component/property либо эквивалент), а не выводятся только из `.article-updated`/первого `<time>`.
2. Projection выбирает approved `editorialPublishedAt` или `editorialModifiedAt` по event identity.
3. Visible label не переписывается автоматически из UTC timestamp. Если editorial label намеренно отличается от exact instant, это остаётся owner-approved полем/решением, а не неявным исключением.
4. Guard проверяет тройку `slot event + approved visible label authority + projected datetime`; class name не считается семантическим доказательством.
5. Четыре Baptists residuals и пять Nagornaya chapters сходятся с выбранным событием.
6. Peterburg two-event byline остаётся двухсобытийным.
7. Kod-da-Vinchi control сохраняет owner-approved visible editorial date, отличную от exact modified instant; системная правка не превращается в blanket `label == UTC calendar date`.
8. Metadata/Search/Sitemap/RSS projection и approval freeze остаются неизменными и зелёными.

## Почему нельзя просто форматировать label из instant

В действующем policy уже есть approved случаи, где human editorial date и exact machine instant намеренно различаются. Например, Kod-da-Vinchi visible `9 мая 2026` сохраняется при approved modified instant в июле; текущий approval-gate test закрепляет эту форму.

Следовательно, универсальный repair — не `new Date(datetime).toLocaleDateString()`. Нужен explicit event/label contract, сохраняющий editorial decision и timezone/provenance.

## Защита сейчас: false-green boundary

Current guards полезно доказывают:

- только approved records проецируются;
- exact instants сходятся в HTML metadata, JSON-LD, Pagefind, Sitemap и RSS;
- unapproved history остаётся frozen;
- `projectVisibleDateline()` меняет ожидаемые class-shaped `datetime`.

Но они проходят на обоих current mismatch classes. Это dimension-scoped false completeness: green exact-instant projection не является green semantic-slot projection.

## Collision check

На 2026-10-23 открытые Product PR не меняют runtime/source владельцев:

- `scripts/lib/editorial-metadata-v3.js`;
- Baptists/Nagornaya body components из affected set.

PR #2179 меняет action pins в `.github/workflows/editorial-metadata-v3.yml` и `.github/workflows/nagornaya-schema-identity-contract.yml`. Это workflow collision для будущего repair, но не текущий source owner. PR #2142 касается Baptists research authority и не меняет эти body/projection файлы.

Перед Product mutation collision check требуется повторить; существующие PR нельзя закрывать или переписывать без отдельного решения.

## Что не доказано и не поглощено

- Generic `visible label != datetime` не объявляется дефектом.
- Approved owner decisions 2026-09-08 не отменяются.
- `GBS-SITEMAP-LASTMOD-UNOWNED` остаётся отдельной membership/normalizer problem.
- Series discovery drift не поглощается: это другой corpus и другой membership owner.
- Live labels в этой системной проверке заново не читались; current browser/artifact witnesses уже сохранены в исходных строках.

## Источники

- `../reverify/2026-10-23-semantic-contract-recheck.md`;
- `../reverify/evidence/2026-10-23-definition-dateline-recheck.json`;
- `../reverify/2026-09-30-release-block-and-baptist-provenance.md`;
- `../reverify/evidence/2026-10-22-header-byline-recheck.json`;
- `../reverify/2026-10-22-postclosure-current-main.md`;
- Product `scripts/lib/editorial-metadata-v3.js` and approval-gate tests at `caeb92c`.
