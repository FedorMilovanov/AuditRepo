# Аудит-отчет: gb-is-my-strength (2026-07-17)

## Контекст
- **Целевой репозиторий**: `FedorMilovanov/gb-is-my-strength`
- **Анализируемый коммит**: `cb3681e1a` (PR #1725 — feat(app): premium Bible App integration)
- **Инструкции**: AuditRepo Operating Model, фокус на поиске root causes и валидации существующих/новых дефектов.

## 1. Валидация известных дефектов (MASTER_BUG_MATRIX)
- **`SERIES-ORDER-INDEX-MISMATCH`** — 🔴 **Подтверждено**. 
  В `src/components/article-pilots/gill-series/gillSeriesData.ts` объект `part4` (Часть III) находится перед `part3` (Часть IV), а ключи/ID перепутаны местами с их названиями и путями (`dzhon-gill-chast-4-ekzeget/` имеет ID `part4`, но mark `III`, а `dzhon-gill-chast-3-nasledie/` имеет ID `part3` и mark `IV`). Это коренная причина (root cause) поломки порядка навигации.
- **`ARTICLE-AUTHOR-HARDCODED`** — 🟡 **Кандидат на удаление (Orphaned)**. 
  Файл `src/layouts/ArticleLayout.astro` содержит захардкоженного автора (`const isTranslation = data.author === 'abner-chou';`), но глобальный поиск по проекту показал, что этот лейаут **нигде не импортируется**. Компонент является мертвым кодом (dead code) и может быть просто удален, а дефект переведен в статус `absorbed`/`invalid`.
- **`SECURITY-CSP-GAPS`** — 🔴 **Подтверждено**. 
  Новая страница `/app/index.astro` не содержит CSP заголовка, что расширяет зону отсутствия CSP, описанную в матрице багов.

## 2. Аудит нового кода (PR #1725)
Аудит интеграции Premium Bible App (`app/index.astro` и `Genesis6BibleAppChapterCta.astro`) критичных уязвимостей не выявил:
- **Ссылки и StartApp параметры**: Согласованы (v1_site_ch3__chapter3, v1_site_ch4__chapter4).
- **Стилизация**: Инкапсулирована через глобальные модификаторы (`body.home-page .h-nav-links a[href="/app/"]`).
- **Связанные роуты**: Ссылки на `/hard-texts/duhi-v-temnice-noi-kreshchenie-pobeda/` и другие маршруты корректно разрешаются в существующие директории с `index.astro`.
- **SEO/Метаданные**: В `/app/index.astro` хардкод дат (`publishedTime`, `modifiedTime`), что стандартно для статических страниц Astro без привязки к Content Collections, но требует ручного обновления в будущем.

## 3. Рекомендация по исправлениям
1. **Удалить** `ArticleLayout.astro` (вычистить мертвый код) и закрыть `ARTICLE-AUTHOR-HARDCODED` в матрице.
2. **Исправить** `gillSeriesData.ts`: поменять местами `part3` и `part4` в массиве `GILL_SERIES_ITEMS` и исправить несовпадение ID с порядковым номером.
3. **Обновить `MASTER_BUG_MATRIX.md`** по итогам проведенной проверки.