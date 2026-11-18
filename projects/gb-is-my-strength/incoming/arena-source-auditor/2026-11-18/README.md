# Контрольная редакционная вычитка gospod-bog.ru — 18.11.2026

- Project: `gb-is-my-strength`
- Agent: `arena-source-auditor`
- Date: 2026-11-18 UTC
- Audited branch/ref: Product `main` после [#2336](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2336); запись только в AuditRepo `arena/fa045b53-auditrepo`.
- Audited anchor (SHA / artifact / live snapshot): Product `381f8f9613bb968754c2432ed9648cd6e42282a9`; [Pages run 44287427833, attempt 1](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/44287427833); [immutable manifest](https://gospod-bog.ru/deployments/381f8f9613bb968754c2432ed9648cd6e42282a9/44287427833-1.json).
- Environment: Node 22.23.4 / npm 10.9.9; exact source → production-like `dist`; локальный Chromium 153.0.8010.0 (1440 и 390 CSS px); выборочное извлечение публичных страниц.

**Полный охват — инвентаризация каталога.** Вычитка прозы, колляция с изданиями и браузерные проверки — выборочные. Совпадение локальных хешей с опубликованным манифестом не подменяет загрузку и хеширование сырых live-ответов. Новый release не заменяет якорь этого прохода.

| Файл | Что в нём |
| --- | --- |
| [REPORT.md](REPORT.md) | Находки с маршрутом, локатором, свидетельством, предлагаемой правкой и пределом вывода; снятые и незакрытые пункты. |
| [evidence/catalog-inventory.tsv](evidence/catalog-inventory.tsv) | 80 карточек с их заголовками, фактическими route entrypoints, типами, RSS/sitemap и членством в реестре серий. |
| [evidence/release-and-inspections.md](evidence/release-and-inspections.md) | Release identity, рецепт сборки, результаты проверок, состав серий и контрольные способы воспроизведения. |
| [FOLLOWUP.md](FOLLOWUP.md) | Второй проход: канон и шкала, цитаты и глоссарий, Chicago [49], локаторы документов 1971 года и сверка G3 после #2337. |
| [evidence/followup-evidence.md](evidence/followup-evidence.md) | Сверка двух версий Product, источники и маршрут получения страниц, скрипт и JSON измерений Chromium. |
| [ARCHIVAL-FOLLOWUP.md](ARCHIVAL-FOLLOWUP.md) | Третий проход: текст соглашения 1945 года, раздельные документы 1971 года, расходящиеся оценки изъятого в 1974-м и поправка имени Алексеевой. |
| [evidence/archival-evidence.md](evidence/archival-evidence.md) | Читательские локусы, колляция источников и адресные запросы на недостающие листы. |
| [ARCHIVE-ROUTES.md](ARCHIVE-ROUTES.md) | Четвёртый проход: третье сообщение о весе бумаги, маршрут к приговору в Цесисе, карточка дела ГАРФ и резервные микрофиши для документов 1971 года. |
| [evidence/archive-routes-evidence.md](evidence/archive-routes-evidence.md) | Локаторы сообщений, архивных описей и каталожных записей; черновики запросов на конкретные листы. |
| [VERDICT-LEADS.md](VERDICT-LEADS.md) | Пятый проход: свидетельство о возможной сохранности приговора отдельно от дела, разные нумерации соглашения 1945 г. и точный запрос по рассылке ВСЕХБ. |
| [evidence/verdict-leads-evidence.md](evidence/verdict-leads-evidence.md) | Сопоставление версий и локаторов; черновики LVA и Lutera Akadēmija, границы проверки 1971 г. |
| [HOLDINGS-FOLLOWUP.md](HOLDINGS-FOLLOWUP.md) | Шестой проход: выставка 1996 г. и поиск учёта станка, латвийское совещание 27.08.1945 отдельно от соглашения ХВЕ, экземпляры тома 15 самиздата. |
| [evidence/collection-holdings-evidence.md](evidence/collection-holdings-evidence.md) | Прочитанные подписи, архивная опись и каталоги; непосланные запросы к музею, архивам и библиотекам. |
| [SOURCE-WITNESS-FOLLOWUP.md](SOURCE-WITNESS-FOLLOWUP.md) | Седьмой проход: прочитанные тексты 1971 года, печатные и каталожные версии соглашения 1945-го, номера газеты для проверки процесса в Цесисе. |
| [evidence/source-witness-evidence.md](evidence/source-witness-evidence.md) | Пагинация и уровень проверки, идентификаторы UETS и лист СБУ; непосланные запросы к держателям. |

Это [intake](../../README.md) по [операционной модели AuditRepo](../../../../../AUDITREPO_OPERATING_MODEL.md), не MASTER-решение, не разрешение на правку и не аудит всех внешних ссылок, прав и источников. Product, Research, активная матрица и PR не изменялись.
