# Prototype — gb-is-my-strength

Эта папка содержит **standalone визуальные/интерактивные прототипы**, не Product code.

- `assets/` — локальные шрифты/изображения (gill.webp etc.) для прототипов, без внешних зависимостей
- `book-engine/v7/` — GBS Book Prototype v7: three-level hierarchy `book → chapter → article → H2/H3`, standalone HTML `gbs-book-prototype.html` (139K), `BOOK_MODE_AUDIT_MATRIX`, `AUDIT_LOG`

Прототипы — не Product authority. Интеграция в `gb-is-my-strength` должна reuse production engine (`SeriesConfig`, `enhancements.js`, `floating-cluster-controller.js`, search, bookmarks, audio adapters) вместо копирования standalone runtime. См. `book-engine/v7/README.md`.

Хранение: прототипы остаются как candidate evidence до bounded Product PR. Не коммитить бинарные `_app` сборки.
