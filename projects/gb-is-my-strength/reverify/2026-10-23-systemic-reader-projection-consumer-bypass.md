# Системная проверка: ReaderProjection consumer bypass

Дата: 2026-10-23  
Product anchor: `caeb92c839ff4b4f2838a0ad44a582034c41c8d4`  
Режим: read-only source + rendered DOM + synthetic SpeechSynthesis request capture; Product не изменялся

## Итог

Принят system lane `SYS-READER-PROJECTION-CONSUMER-BYPASS`.

`ReaderActionsRuntime.astro` и собственная документация объявляют `GBReaderProjection` семантическим владельцем представления статьи для TTS, search, print и speakable metadata. Но главный TTS consumer `reader-tts.js` не вызывает API projection. Он независимо повторяет root/block/exclusion/text extraction и поэтому читает другое DOM-представление.

Это не optional refactor: расхождение уже проявляется в production-like output как дополнительные заголовки, endnotes, accuracy prompts и related-card metadata, отправляемые в SpeechSynthesis сверх canonical projection.

## Механизм

Canonical owner:

- `reader-projection.js::readerRoot()` использует explicit reader roots и возвращает article subtree;
- `blockElements()` применяет projection policy;
- `getTtsSegments()` публикует canonical ordered elements/text;
- `ReaderActionsRuntime.astro` импортирует projection до TTS и называет его semantic owner для TTS.

Consumer bypass:

- `reader-tts.js::collectParts()` снова выполняет собственный `document.querySelector(...)`;
- selector list включает ancestor `main`, а DOM-order semantics `querySelector()` не создают приоритет по порядку selectors;
- TTS самостоятельно поддерживает `EXCLUDED_BLOCK`, `STRIP_INLINE`, nested-list/blockquote filters и text normalization;
- `GBReaderProjection.getTtsSegments()` в consumer не используется ни разу.

На большинстве article routes projection выбирает `article`, а TTS — более широкий ancestor `main`. Даже при общем root duplicated policy расходится: projection исключает note/related/auxiliary owners, которых TTS inventory не исключает.

## Rendered breadth census

Chromium 153 загрузил все 105 built routes; ошибок загрузки census — 0.

- `GBReaderProjection` установлен на 73 routes;
- root identity TTS-vs-projection расходится на 68/73;
- итоговый ordered text расходится на 53/73;
- на пяти routes root identity совпадает;
- на 15 из 68 root mismatches текст случайно остаётся одинаковым — это control, а не доказательство общего контракта.

Census сравнивал реальные rendered elements projection API с точной текущей `collectParts()` root/policy логикой. Число 53 — current output breadth, а не предположение о каждой странице.

## Actual SpeechSynthesis request capture

Для трёх разных article families установлен synthetic Russian SpeechSynthesis fixture. Он записывал каждую реально созданную `SpeechSynthesisUtterance` и немедленно вызывал `onend`, чтобы пройти всю очередь. Это доказывает submitted speech text и order; PCM/audibility этим witness не заявляются.

### Hermenevtika

- canonical projection: 114 blocks;
- TTS independent collection: 240 blocks;
- submitted utterances after 520-char splitting: 312;
- очередь после основного материала включает `Примечания`, `Нашли неточность?`, `Читайте также` и metadata related cards;
- последняя заявка — `Ред.: Фёдор Милованов · Март 2025`, тогда как projection заканчивается author/source publication block.

### Gill part 1

- canonical projection: 100 blocks;
- TTS collection: 106 blocks;
- submitted utterances: 113;
- первая заявка TTS — hero caption `Серия «Джон Гилл» · Часть I`;
- первая projection segment — series-orientation prose inside canonical article;
- TTS в конце дополнительно отправляет `Примечания` и endnote text.

### Heart-series article

- canonical projection: 77 blocks;
- TTS collection: 86 blocks;
- submitted utterances: 104;
- TTS после canonical article отправляет accuracy prompt, `Читайте также`, duplicated card label/meta strings.

Utterance count нельзя напрямую приравнивать к block count: длинные blocks разбиваются по `MAX_CHUNK=520`. Сравнение roots/elements выполнялось до splitting, а actual capture отдельно доказывает user-path request queue.

## Почему current guard зелёный

Локально выполнен exact `scripts/reader-projection-browser-contract.mjs` с единственной environment substitution — Chromium 153 executable path. Результат: **144/144 PASS**.

Guard не проверяет production parity:

- route checks требуют только non-empty projection и наличие TTS API;
- source contract закрепляет duplicated selector inventory вместо delegation;
- bridge fixture сначала ставит `data-reader-exclude` на **каждый** block внутри projection root, затем вызывает refresh;
- этим fixture искусственно подавляет и canonical blocks, и production-only auxiliary blocks, после чего один добавленный paragraph закономерно становится единственной TTS заявкой;
- guard не сравнивает `collectParts()` с `getTtsSegments()` на untouched production DOM.

Поэтому green bridge доказывает materialization `data-no-speech`, но не утверждение, что TTS потребляет canonical projection.

## Bounded closure

1. `reader-tts.js` получает ordered parts из `GBReaderProjection.getTtsSegments()` и выполняет только TTS-specific chunking/playback.
2. Если API недоступен, fallback явно bounded и использует тот же root/policy owner, а не второй silently diverging state machine.
3. Production parity guard на untouched routes сравнивает exact element/text order до chunking; Hermenevtika, Gill, ordinary article и Nagornaya controls обязательны.
4. Negative fixtures добавляют note/endnote, accuracy prompt, related cards, explicit include/exclude и nested list/blockquote; consumer не расширяет canonical projection.
5. Speech request witness подтверждает first/last submitted utterances и отсутствие auxiliary UI/metadata; actual native success/error и PCM остаются отдельными TTS playback contracts.
6. Search/print/speakable consumers проверяются на явное consumption либо documented independent owner; closure не требует насильно объединять разные projection policies.

## Collision boundary

Текущие Product PR не меняют `reader-projection.js`, `reader-tts.js`, `ReaderActionsRuntime.astro` или их browser/source contracts. #2179 меняет только два соответствующих workflow files, поэтому Product workflow mutation требует координации, но runtime/source repair сейчас не имеет file-owner collision.

## Что не доказано

- Synthetic fixture не доказывает слышимый PCM или качество голоса.
- Не все 53 divergent routes прослушивались до конца; breadth основан на exact rendered collection comparison, а full request capture выполнен на трёх families.
- Hero metadata не объявляется всегда нежелательной сама по себе. Дефект — отсутствие одного owner и фактическое нарушение заявленного canonical representation; desired inclusion должен быть выражен projection policy.
- ReaderProjection lifecycle observer и current static-document initialization этим finding не признаны defective.
- Product не изменялся.

## Evidence

- `evidence/2026-10-23-reader-projection-consumer-bypass.jsonl`;
- temporary `/tmp/root-census.json`, `/tmp/tts-divergence.json`, `/tmp/tts-actual.jsonl` (вне Git);
- current `src/runtime/reader-projection.js`;
- current `src/runtime/reader-tts.js`;
- current `src/components/reader-platform/ReaderActionsRuntime.astro`;
- current `scripts/reader-projection-source-contract.mjs`;
- current `scripts/reader-projection-browser-contract.mjs`.
