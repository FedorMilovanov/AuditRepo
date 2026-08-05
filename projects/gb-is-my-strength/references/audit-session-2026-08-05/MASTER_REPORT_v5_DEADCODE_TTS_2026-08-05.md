# МАСТЕР-ОТЧЁТ v5 — МЁРТВЫЙ КОД + TTS-КОНТРАКТ + 8 КОНТРАКТОВ

**Дата:** 2026-08-05 · **Source:** `007c2d3c` · **Ветка:** `arena/019fd2bb-auditrepo` (открыта)

---

## 1. Анализ «мёртвых» блоков site.js (результаты)

| Блок | Размер | Вердикт |
|---|---|---|
| `quiz-memory` | ~6 КБ | **МЁРТВ**: маркер `.quiz-memory-note` = 0 вхождений в src/ и articles/ (legacy) → блок грузится зря на каждой странице. **Кандидат на удаление** (или рантайм-проверка не срабатывает). |
| `fn-dove` | ~6 КБ | **ЖИВ**: рендерится для `.fn-marker` (сноски) — есть в legacy статьях (Гилл, Антисоветы). Нужен на статьях со сносками. |
| `backlinks` (§2.4a) | ~3 КБ | **DATA-DRIVEN**: рендерится из data, разметки в src/articles нет. Не мёртв, но кандидат на lazy. |

**Вывод:** `quiz-memory` — реальный мёртвый код (~6КБ × все страницы). Это не «ещё тест», а удаление балласта. `fn-dove`/`backlinks` — оставить, но по возможности lazy.

## 2. Контрактная система — 8 контрактов, полный прогон

| Контракт | Результат |
|---|---|
| gill-mobile-bar | PASS 3/3 |
| home-mobile-hero-hub | PASS 3/3 |
| home-sacred-scripture-bg | **FAIL 0/3** (#hScriptureBg нет) |
| karty-minimap | PASS 2/2 |
| nagornaya-mobile-bar | **FAIL 1/4** (btoc не перенесён) |
| search-command-palette-a11y | PASS 4/4 |
| baptist-3d-app | **FAIL 2/3** (app.css не внешний; app.js — inline-строка, не файл) |
| tts-lazy-chunk | PASS 3/3 (SharedWorker в vosk-tts-engine.js, searchPaths js/) |

**5 PASS / 3 FAIL** — три FAIL = три реальные проблемы, доказанные машиной.

## 3. Улучшения diff-canonical (v2.2)

- **searchPaths** теперь ДОПОЛНЯЮТ component-файлы (раньше фильтр сужал и терял SharedWorker).
- Мультифайловый поиск: tts-контракт видит `floating-cluster-controller.js` + `vosk-tts-engine.js`.

## 4. Итог ветки (5 коммитов)

1. `b02d741` — 50+ проверок + контракты
2. `e0b9aa7` — откаты + золото + junk-guard
3. `b9b90c1` — контракты v2.1, 6 фич
4. `82c5053` — bundle-план + baptist-3d
5. **этот** — мёртвый код (quiz-memory) + tts-lazy контракт + 8 контрактов

**Следующие шаги:**
1. Удалить `quiz-memory` из site.js (мёртв) — экономия ~6КБ/страница.
2. Починить home-sacred (#hScriptureBg) → PASS.
3. Решить Nagornaya btoc (1:1 или ADAPTIVE).
4. baptist-3d: распаковать (app.css внешний).
5. bundle-сплит TTS (floating-cluster 120КБ → lazy на каталогах).

---

*Документ — untracked; будет добавлен в ветку коммитом.*
