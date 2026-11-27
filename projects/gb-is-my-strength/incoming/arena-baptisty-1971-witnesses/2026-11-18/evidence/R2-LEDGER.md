# Ledger шести редакционных пунктов R2 против текущего Product `main`

**Проверено 21.11.2026.** Предмет — не новые правки, а ответ на вопрос «что из шести пунктов R2 остаётся текущим на сегодняшнем `main` и что произойдёт, если сперва сольют живой PR». Патчи взяты из [R2-пакета](../../../arena-baptisty-editorial-r2/2026-11-18/patches/) без изменений; здесь только сверка их применимости.

- Product `main` на момент сверки: [`e733dd29f6186801eff9260365eeff8e72d4da0c`](https://github.com/FedorMilovanov/gb-is-my-strength/commit/e733dd29f6186801eff9260365eeff8e72d4da0c).
- Живой PR, который трогает те же файлы: [#2348, Draft, головка `6e41011d`](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2348).
- Метод: шесть `Body.astro` скачаны через Contents API на указанных SHA в одноразовый репозиторий, затем `git apply --check` для каждого патча; отдельно сверены сами строки «до» из ханков. Ничего не применялось и не пушилось.

## Состояние по пунктам

| Пункт | Файл | На `main` `e733dd29` | Патч к `main` | Если первым сольют #2348 | Владелец |
|---|---|---|---|---|---|
| **A3** · две развилки 1884, `#novo-vasilyevka` | `BaptistyRossiiDvaSezda1884Body.astro` | `current` — текст «до» на месте | применяется | не затронут | редактор серии A3 → Product writer |
| **A4** · Петербургская линия, вступление | `BaptistyRossiiPeterburgskayaLiniyaBody.astro` | `current` | применяется | не затронут | редактор A4 → Product writer |
| **A6** · Советская ночь, `#open-window` | `BaptistyRossiiSovetskayaNochBody.astro` | `current` | применяется | **конфликт**: строка «до» уже изменена в #2348 | редактор A6 → Product writer |
| **A7** · ВСЕХБ 1944, `#council-state` | `BaptistyRossiiVsehib1944Body.astro` | `current` | применяется | 1 из 2 ханков конфликтует, второй применим | редактор A7 → Product writer |
| **A9** · Подпольная печать, `#what-printed` | `BaptistyRossiiPodpolnayaPechatBody.astro` | `current` | применяется | 1 из 3 ханков конфликтует, два применимы | редактор A9 → Product writer |
| **A9 + Справочник** · `#christian-publisher`, `#timeline`, `#documents` | `BaptistyRossiiSpravochnikBody.astro` | `current` | применяется | все 5 ханков применимы | владелец справочника серии → Product writer |

## Сводка

- **`fixed` на `main`: ноль.** Ни один из шести пунктов не исправлен в текущем `main`; все шесть остаются актуальными.
- **`superseded`: ноль.** Ни один ханк не устарел по смыслу: строки «до» совпадают байт в байт, `git apply --check` проходит для обоих патчей целиком (13 ханков, 6 файлов).
- **`blocked`: ноль по `main`.** Блокировка появляется только в порядке слияний: на головке #2348 `6e41011d` три файла из шести уже изменены, поэтому слепой `git apply` даст `patch does not apply` в `SovetskayaNoch`, `Vsehib1944`, `PodpolnayaPechat`. Остальные три файла и десять из тринадцати ханков переносятся без правки контекста.
- **`owner`:** у каждого пункта один содержательный владелец (редактор соответствующего раздела или владелец справочника), а исполнение — только Product writer. Двух параллельных правок одного текста не предлагается.

## Что из этого следует

1. Патчи **не** надо пересобирать под `9edef94e`: на сегодняшнем `main` они применимы как есть.
2. Порядок важен. Если #2348 сольют первым, три файла придётся сверить вручную: строки «до» там уже другие, и механический перенос потеряет чужую правку.
3. Это ledger применимости, а не разрешение: применение остаётся за Product writer после повторной сверки на фактической головке, с сохранением обоих владельцев `BCH-1971-01` и без переноса сканов. Публикационные статусы, `W1_NOT_ACCEPTED / NOT_TRANSFER` и HOLD на оригиналы и права не меняются.

## Воспроизведение

```bash
MAIN=e733dd29f6186801eff9260365eeff8e72d4da0c      # Product main на 21.11.2026
PR=6e41011d34f52059077f62ecddf4c9f137a23dc7        # головка #2348
for f in $(grep -h '^diff --git' patches/*.patch | sed 's#.* b/##'); do
  mkdir -p "$(dirname "$f")"
  gh api "repos/FedorMilovanov/gb-is-my-strength/contents/$f?ref=$MAIN" --jq '.content' | base64 -d > "$f"
done
git init -q . && git add -A && git -c user.name=x -c user.email=x@y commit -qm base
git apply --check chronology-and-voronin.patch      # APPLIES
git apply --check underground-press-and-1971.patch  # APPLIES
```
