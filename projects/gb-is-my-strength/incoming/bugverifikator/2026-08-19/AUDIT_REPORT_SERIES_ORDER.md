# Аудит-отчет: Глубокий разбор SERIES-ORDER-INDEX-MISMATCH

## Контекст
- **Целевой репозиторий**: `FedorMilovanov/gb-is-my-strength`
- **Анализируемый коммит**: `cb3681e1a`
- **Связанная задача**: Валидация ошибки искаженного порядка серии в статьях Джона Гилла.

## Валидация SERIES-ORDER-INDEX-MISMATCH
🔴 **Подтверждено (Source-confirmed, Root Cause Islated)**

**Анализ кода (`src/components/article-pilots/gill-series/gillSeriesData.ts`)**:
Ошибка возникает в массиве `GILL_SERIES_ITEMS` (отвечающем за глобальный порядок серии и навигацию `Next/Prev`), а также в `GILL_PAGE_DATA`. 

1. **Неправильный порядок в `GILL_SERIES_ITEMS`** (строки 81–96):
```typescript
  {
    id: "part4", // <-- ID part4
    mark: { kind: "roman", value: "III" }, // <-- Римская III
    title: "Часть III. Экзегет",
    shortTitle: "Экзегет",
    href: "/articles/dzhon-gill-chast-4-ekzeget/", // <-- URL содержит "4"
    readingTime: "71 мин",
  },
  {
    id: "part3", // <-- ID part3
    mark: { kind: "roman", value: "IV" }, // <-- Римская IV
    title: "Часть IV. Наследие",
    shortTitle: "Наследие",
    href: "/articles/dzhon-gill-chast-3-nasledie/", // <-- URL содержит "3"
    readingTime: "54 мин",
  },
```
Как видно из кода, объект для `part4` (которая является "Частью III") расположен в массиве **перед** объектом `part3` (которая является "Частью IV"). 
Кроме того, присутствует полная рассинхронизация (mismatch) ключей `ID`, римских цифр и имен файлов:
- `ID part4` ↔ `Часть III` ↔ URL `/dzhon-gill-chast-4-ekzeget/`
- `ID part3` ↔ `Часть IV` ↔ URL `/dzhon-gill-chast-3-nasledie/`

2. **Несогласованность в `GILL_PAGE_DATA`**:
Настройки `part3` (Часть IV. Наследие) описаны на строках 193-227, а `part4` (Часть III. Экзегет) на строках 228-261, что еще больше запутывает код и приводит к сломанному прогрессу чтения (`readingProgressDoneMin` и `readingProgressPartMin`).

**Вывод**:
Это классический баг копипасты/рефакторинга, когда при изменении структуры (например, разбиении одной части на две) индексы и пути не были переименованы согласованно. Ошибка подтверждена. Для её исправления нужно не только поменять объекты местами, но и выровнять ID и метаданные с реальными номерами URL-маршрутов.
