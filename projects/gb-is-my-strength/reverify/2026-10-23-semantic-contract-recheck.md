# 2026-10-23 — сноски, определения и семантика даталайнов

Вход: чистый AuditRepo `589feb22aa6201c74350de082d80264b4124046d`, baseline 4/4 PASS; 54 active units. Product main повторно прочитан: `d14da74cfe9f45e9b03e383e8e622695b01f8e16`; build и source из предыдущей wave не менялись. Scope — проверка необходимости/критериев и текущего поведения, не Product repair. Исторические REPORT/receipts не переписываются; следующие разделы уточняют результаты по мере проверки.

## 1. Авторские номера и закрытая интерактивность — разные дефекты

Current main содержит **184 зарегистрированные сноски / 5 маршрутов**: 175 имеют видимое число, у 172 оно не совпадает с internal ordinal; 9 объяснений без числа не являются «потерянными номерами». Распределение mismatch: Hermenevtika 114, Kod-da-Vinchi 19, Krajne 39. Endnotes 184, stable note IDs/содержание связаны — это не доказательство открытия чужого текста.

Нормативный `docs/REFERENCE-TOOLTIP-CONTRACT.md`, Trigger semantics: **«Numbered Bible or academic notes preserve their visible number.»** Поэтому прежний closure «переписать все видимые номера внутренним ordinal» снят как чрезмерный. Нужно согласовать видимую авторскую метку с accessible name и endnote/backlink/print mapping, не нумеруя девять безномерных объяснений. Internal sequence может остаться технической. Для альтернативной публикационной перенумерации требуется явно согласованная policy/owner boundary, а не предположение аудитора.

На Chromium 153.0.8010.0 / axe **4.14.0** проверены все 5 note routes × 1440×900 desktop / 390×844 touch × Light/Dark, reduced motion, SW blocked. В closed state `nested-interactive`: **Krajne 7 + Gill-1 1**, на остальных трёх маршрутах 0. `label-content-name-mismatch` ровно соответствует numeric mismatch, а не обязательству включить всю citation в имя маркера.

- Парная изоляция в четырёх профилях: Krajne ordinal 1 (visible 1) имеет nested=1 / label mismatch=0; при открытии payload портируется и nested=0. Ordinal 2 (visible 27) имеет label mismatch=1 и после открытия — число не исправляется перемещением payload.
- Обратимый closed-inert A/B: Krajne nested **7→0→7**, Gill-1 **1→0→1**; Krajne numeric label mismatch остаётся 39. Следовательно, обязательное «всегда вынести payload из DOM маркера» из SYS closure убрано: корректный закрытый `inert` state — возможная альтернатива при сохранённой доступности открытого содержимого. Это диагностическая проба, не Product patch/acceptance candidate.
- Текущий interaction owner — **`src/runtime/article-tooltips.js`, `GBArticleTooltips.version=20`**, который снимает legacy controllers. Метаданные `interactionOwner=SiteUtils.makeTooltipController` не являются точным адресом текущего repair. Existing note browser fixture содержит только Hermenevtika, где nested=0: зелёный fixture не покрывает оба failing routes.

В открытом draft **Product #2183 `5c28e2e9…`** уже есть closed-inert patch и автоматическая видимая перенумерация с authored mapping. Это смежный owner, не повод создавать параллельный lane. Перед принятием numbering change нужно согласовать его с current preserve-number rule либо подтвердить owner-approved override; **человеческое одобрение не предполагается**. Candidate UI здесь не тестировался и main не исправлен.

[38 документов note evidence](evidence/2026-10-23-note-contract-recheck.json): source boundary + 5 artifact census + 20 route/profile captures + 8 isolated checks + 2 inert A/B. JSON streams round-trip exact. Native AX описания сохраняются длиной/хешем, а не повторными дампами полных citation bodies. Два resource-console сообщения на desktop Kod сохранены как неатрибутированные; новый контрольный load воспроизводит блокировку Метрики, но тождество этих двух событий не доказано. Не заявляется чистая консоль или Production PASS.

## Методика и исходные ограничения

Durable harness: `../incoming/arena-full-spectrum-audit/2026-10-14/harness/semantic-surface-recheck.mjs`; копировать в browser workspace, запускать `WIDTH=1440/390 SCHEME=light/dark OUT=... node semantic-surface-recheck.mjs`. Существующий static server отдаёт exact-SHA dist; ARIA A/B и inert пробы только в памяти disposable browser, source/lockfiles Product чистые. Измерения LCP/CLS включают программный focus/scroll-lock и не являются field CWV или самостоятельным performance verdict. WebKit/реальные AT, новые PDF pagination и независимые live bytes не проверены.
