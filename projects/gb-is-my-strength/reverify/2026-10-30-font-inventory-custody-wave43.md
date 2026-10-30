# Широкая волна 43: инвентарь, бинарная правда и custody локальных шрифтов

Дата: **2026-10-30**  
Product: exact `89bab745790a6a5c1cddf86fd65cb0c692b049d9` = current `main`; открытых Product PR на момент начала нет.  
Режим: read-only Product lane; Product не изменён. AuditRepo — единственный write lane.

## Итог

Локальная поставка действительно детерминирована по байтам, но не полностью по праву и происхождению. Текущий контроль хорошо отвечает на вопрос «не изменился ли файл», однако не отвечает на вопросы «почему разрешено его распространять», «откуда взят support TTF» и «соответствует ли физическое начертание запрошенному токену».

Нового MASTER owner не требуется: бинарные и custody-проявления расширяют действующий `GBS-CUSTOM-FONT-MATRIX-MIXED-FAMILY-RENDERING`.

## 1. Чистый exact-head baseline

До выводов прочитаны Product/AuditRepo operating rules, font scripts и CI. На чистом Product HEAD прошли:

- `font-assets-contract-test.mjs`: **28 checks**;
- alias contract: **3 fixtures**;
- `verify-font-assets.mjs`: **28 WOFF2**, три зафиксированных upstream drift;
- production-like Astro build: **111 pages**, 0 errors, 0 warnings, 7 hints;
- непосредственный `git diff --exit-code` после font gates и повторный post-build `git status`: чисто.

Следовательно, далее описана не случайная грязь checkout и не сломанная сборка.

## 2. Точный объём

| Слой | Файлы | Байты |
|---|---:|---:|
| pinned production WOFF2 | 28 | 488 980 |
| support Greek TTF | 1 | 444 064 |
| все font binaries | 29 | **933 044** |
| `fonts.css` registry | 1 | 6 574 |

TTF составляет **47.6%** всех font-binary bytes. В нормальном Chromium он не загружается: это второй `src` после рабочего Greek WOFF2. Поэтому удаление TTF уменьшило бы repository/deploy artifact на 444 064 bytes, но не нынешний успешный cold transfer. Его нельзя считать «ускорением LCP» без отдельного failure/legacy-browser обоснования.

## 3. Registry и физические таблицы

`fonts.css` содержит 28 `@font-face`; каждый использует `font-display:swap` и `unicode-range`. CSS-family registry охватывает девять имён:

- Lora;
- Source Sans 3;
- Playfair Display;
- Cormorant Garamond;
- Inter;
- Noto Sans Hebrew;
- Noto Serif Hebrew;
- Noto Sans Greek;
- Noto Serif Greek.

FontTools прочитал `name`, `OS/2` и Unicode cmap у всех 29 binaries. Существенные факты:

- Cyrillic subsets основных семейств содержат по 100 Cyrillic code points, но только 2–5 Latin-range code points: это не Latin/punctuation completion;
- Lora физически заканчивается на 600; её 600 faces имеют OS/2 weight 600 и внутреннее имя `Lora SemiBold`;
- Inter физически заканчивается на 600;
- Source Sans 3 физически заканчивается на 600 Cyrillic, а Latin существует только в 400;
- Playfair Display имеет Cyrillic 400/400 italic/600/700, но не Latin subset;
- Cormorant Garamond имеет Cyrillic 400/400 italic/500, но не 600/700 и не Latin;
- Noto Sans Greek WOFF2 содержит 121 Greek code point; Noto Serif Greek WOFF2/TTF — 354;
- Noto Serif Hebrew 400 и файл, объявленный как 500, **byte-for-byte идентичны**: одинаковый SHA-256 `b5535c…`, оба имеют OS/2 weight 400;
- Greek Serif WOFF2 и 444 064-byte TTF несут один и тот же full-family cmap на 2 965 Unicode code points; WOFF2 уже является рабочим первым source.

Таким образом, имя файла/manifest weight не является физическим доказательством веса. Текущая verifier-модель проверяет manifest against bytes/hash/structure, но не сопоставляет CSS-requested token с OS/2/cmap и реальным painted face.

## 4. Manifest, aliases и integrity

Сильная часть текущего устройства:

- каждый WOFF2 имеет canonical path, declared family/style/weight/subset, byte size и SHA-256;
- source object хранит Google Fonts CSS URL, exact `fonts.gstatic.com` URL, observed bytes/hash и drift status;
- regeneration — all-or-nothing, upstream refresh требует явного `--accept-upstream`;
- support manifest отдельно пинит `fonts.css` и Greek TTF;
- browser-facing delivery не зависит от runtime Google Fonts: binaries self-hosted.

Граница контроля:

- три текущих файла (`Noto Serif Greek 400`, `Noto Serif Hebrew 400/500`) намеренно остаются pinned при отличии upstream;
- support TTF имеет bytes/hash/family role, но **не имеет source URL/commit/license record**;
- family aliases проверяются fixture-контрактом, но route integration и requested-token completion не входят в этот gate.

## 5. Лицензии и upstream custody

В Product нет `OFL.txt`, `LICENSE` или семейного license ledger рядом с поставляемыми font binaries; единственный найденный license-файл относится к vendored `actionlint`, а не к шрифтам. Manifest хранит URL бинарника, но не license identifier/text/blob SHA.

Проверка официального `google/fonts` на immutable commit `6157dfaa640ca5738b4d1a7070fe389c3036d7fc` подтверждает OFL texts для всех задействованных upstream family directories:

| Family directory | OFL blob SHA | Bytes |
|---|---|---:|
| cormorantgaramond | `507d70f…` | 4 387 |
| inter | `21f6aff…` | 4 377 |
| lora | `d0ce7fe…` | 4 423 |
| notosans | `6843f31…` | 4 396 |
| notoserif | `6843f31…` | 4 396 |
| playfairdisplay | `1315389…` | 4 449 |
| sourcesans3 | `50ee76c…` | 4 579 |

Это подтверждает доступность OFL upstream, но **не закрывает custody в Product**: deploy artifact не несёт license texts, manifest не связывает каждый binary с immutable license blob, а происхождение support TTF отдельно не записано.

## 6. Решение

Нужен не новый шрифтовой каталог, а единый font bill of materials:

1. binary SHA/bytes + CSS alias + physical OS/2/cmap;
2. immutable upstream source identity;
3. SPDX/license identifier и vendored license text/blob identity;
4. requested route token и допустимая synthesis/fallback policy;
5. route-delivery proof.

Не следует обновлять три drifted binaries только ради совпадения с сегодняшним Google Fonts: это изменит glyph metrics и требует визуального/CLS acceptance. Не следует также держать 444 KB TTF «на всякий случай» без доказанного browser support boundary.

**Широкая волна 43 завершена.**
