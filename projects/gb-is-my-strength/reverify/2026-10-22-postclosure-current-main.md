# 2026-10-22 — сверка закрытий после AuditRepo #483

> Ниже сохранены point-in-time checkpoints. Последующие продолжения явно уточняют прежний итог; текущий счётчик принадлежит MASTER.

Scope: AuditRepo dispositions, не Product repair. Чистая база AuditRepo `7ccefa7ce519512b2284ac080b549c8ab5858172`, гейты 4/4 PASS. Исходные REPORT и receipts не переписывались.

## Свежие anchors и итог по всем 56 исходным единицам

GitHub повторно показывает Product `main` **`d14da74cfe9f45e9b03e383e8e622695b01f8e16`** от 2026-10-12. После прежнего аудита новых слитых Product repairs нет. Последний [успешный Pages deploy](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/38228491989) — тот же SHA. Это provider witness, не независимое чтение live bytes.

| Disposition | Число | Основание / граница |
|---|---:|---|
| FIXED-CURRENT | 1 | `GBS-404-RELATIVE-READER-PREFERENCES-ASSETS`: ранее пропущенный merged fix #2159, current source/build и свежие browser controls ниже. |
| Не закрывать по обещанию candidate PR | 7 | Purpose Product #2184 заявляет семь исправлений, но PR OPEN и нацелен **не в main**, а в ветку draft #2183. Оба не слиты. Это заявления owner, не наш candidate browser PASS. |
| Остальные, без нового closure witness | 48 | Тот же immutable Product anchor; прежние доказательства остаются применимы. Это проверка отсутствия новых оснований для закрытия, **не 48 свежих UI repro и не 48 новых багов**. |

Результат MASTER: **56 → 55 = 51 дефект + 2 необходимых улучшения + 2 системные линии**. Из 55 оставшихся два дефекта и одна resilience-строка дополнительно перепроверены в browser; эти измерения не добавляются к счётчику повторно.

## 404: закрывается только дефект путей

[Product #2159](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2159) MERGED 2026-10-04, merge `e8672532192c535dd803c29e67c16930db9848e3`: три ссылки в корневом `404.html` стали root-relative. Source и свежий production-like dist это подтверждают.

- Chromium **153.0.8010.0**, 1440×900 desktop / 390×844 touch, Light/Dark/Sepia, reduced motion. На root и двух nested 404 — **18/18**: три preference assets отвечают 200 из корня, stored theme/API/theme projection совпадают; fonts loaded, overflow и broken DOM images 0.
- **2 отрицательных контроля** возвращают старые relative URL только в памяти browser fixture: три nested asset requests дают 404, preferences API отсутствует. Сам Product не менялся.
- На обеих ширинах recovery: Enter по «На главную» → `/`; click/tap по «Все статьи» → `/articles/`. Три recovery hrefs root-relative, canonical отсутствует как в исходном документе. Desktop/mobile screenshots всех трёх тем просмотрены; PNG остаются вне Git.
- Pages-style HTML/status 404 эмулируются явно; **serviceWorkers=block** изолирует URL/bootstrap contract. Промежуточный capture с разрешённым SW оказался непригоден: SW обошёл Playwright routing и получил обычный Python error page (314 HTML chars, API undefined). Это установленная граница стенда, не Product regression и не сертификация SW.
- Console: 100 известных pinned-production-icon CSP сообщений, 14 ожидаемых document-404 и 6 отрицательных asset-404; неизвестных/page errors **0**. Axe Light/Dark — 0; в Sepia остаётся **3 contrast nodes** на каждой ширине: `#76654d/#eee3c8` **4.40:1**, 15.2–16px, включая small bold. Они присоединены к существующему contrast owner, а не объявлены исправленными вместе с URL.
- Метрики локального стенда: CLS ≤0.051650; LCP наблюдался в 17/18 positive cases, один 0 означает **не наблюдался**, а не нулевую задержку. Общего performance/production PASS нет.

Данные: [39 компактных документов, включая 28 browser/recovery/contrast records](evidence/2026-10-22-main-404-closure.json). Harness: `../incoming/arena-full-spectrum-audit/2026-10-14/harness/404-postclosure-recheck.mjs` (копировать в browser workspace; `OUT=... node 404-postclosure-recheck.mjs`).

## Повтор state-boundary проверки — не закрыто

[81 компактный документ](evidence/2026-10-22-state-boundaries-recheck.json): metadata + **все 80 capture objects**, сохранённые без потерь/усечения. Повторены прежние `browser-state-boundaries.mjs` (68 observations до индекса) и `pagefind-history-boundary.mjs` (12 после canonical Pagefind build: **95 страниц / 27 835 слов**, module/WASM 200).

- Реальная квота Chrome, без mock Storage: **4** ложных success toast при 0 записей; **4** legacy migrations удаляют старый flag без новой записи, освобождение места не восстанавливает данные. Source gate по-прежнему **65/65 PASS**: зелёная regex-проверка не заменяет этот runtime witness.
- Два реальных UI-сохранения: **4 профиля × 2 unnamed cover links**, native AX `link/name=""/ignored=false`; Home те же записи именует. Не объявляем пустой CSS-cover доказательством недоставки изображений.
- Malformed object/null history: **16** заблокированных переходов суммарно на fallback/настоящем Pagefind; **20** здоровых контролей переходят. Это остаётся необходимым resilience improvement, не баг здорового writer. Нормальные favorites/clear/migration и preferences API/reload/cross-route/cross-tab проходят; полного GUI coverage настроек нет.
- Fonts/axe/console/LCP/CLS и screenshots захвачены. Native link-name failure остаётся; в light favorites также 8 axe contrast nodes — route-wide a11y PASS не заявляется. Console CSP/analytics/ожидаемое отсутствие baseline Pagefind классифицированы отдельно; настоящие history TypeErrors сохранены.

## CI и границы незавершённого

Свежий GitHub snapshot: **11 OPEN Product PR / 2 OPEN issues**. Семь Purpose claims #2184: hidden Home scroll-top, offscreen MobileChrome focus, theme focus ring, map SVG names, heading-name pollution, favorite cover names, duplicate Home search close. Stack: **#2184 `f424992c…` → #2183 `5c28e2e9…` → main**. Не создаём конкурирующий Product lane и не закрываем их до merged-main verification.

На этом candidate head: **25 successful / 3 failed / 3 skipped checks**. Jobs/annotations API подтверждают: три failure — **установка Chromium/WebKit, exit 124**, затем отсутствие artifacts; функциональные browser assertions не выполнены. Полный ZIP log через внешний results host завершился EOF; причина самого delivery timeout не установлена. Notice Ubuntu runner migration не выдаётся за доказанную причину.

На main последний scheduled Source Link Audit [39223936321](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/39223936321) FAIL (2026-10-19); установлен лишь failed stage, не первопричина. Dependency Security последний run вообще на старом `f8d70a9a`, не d14: нового security PASS нет. Зелёный deploy не означает зелёные все gates или ноль дефектов.

Прежняя ошибка `#gbs2Pct` в верхней сводке MASTER помечена опровергнутой согласно уже имевшемуся painted witness 11.58:1; это не новое измерение контраста. Текущий Product исходный код и зависимости не менялись. Не заявляются live bytes, WebKit/реальные AT, candidate UI PASS, повтор всех 55 UI scenarios либо PRODUCT ZERO.

AuditRepo после правок: основные гейты **4/4**, regression-команды **5/5 PASS**; только 404 снят с active rows; из 55 оставшихся строк 54 побайтово прежние, одна (contrast owner) явно расширена. Старые 58 registry entries, REPORT и 61 evidence-файл сохранены. Новые stream receipts: 39/81 документов, максимум 644/629 символов в строке; round-trip проверен.

## Продолжение 1 — исправленный CSS квиза и новый независимый pointer blocker

`GBS-QUIZ-NEXT-HIDDEN-GILL-V16` **FIXED-CURRENT**: Product #2167 / `2ee584d3` уже слит 2026-10-04. В `css/floating-cluster.css:4064,4073` скрывается только `#glsQuizNext`, а не `.quiz-next` всех квизов. Прежняя blanket-строка была устаревшей; наблюдение скрытой кнопки learning sheet не доказывает скрытие обычного article quiz.

- Свежий census: 23 quiz routes, 15 под Gill wrapper / 8 controls; **92** result/restart traversals (23 × 2 widths × Light/Dark), первый вопрос/next активированы также клавиатурой. Все 92 ordinary next buttons имеют ненулевой размер. **88** mixed native pointer/keyboard flows прошли, **4** на Krajne потребовали keyboard-only diagnostic recovery и **не считаются pointer PASS**. Два мобильных обратимых negative controls возвращают старое широкое правило: ordinary next скрывается и появляется после удаления тестового style.
- Literal markup **остаётся**: на первом-option пути виден на 9 маршрутах; отсутствие его в одном пути Hermenevtika не опровергает bonus payload. Существующая строка literal markup не закрыта. В 8 sampled health profiles fonts loaded / overflow 0; axe violations сохранены, глобального a11y PASS нет. Local LCP 392–1660ms, CLS максимум 0.100401; это lab samples, не production performance claim. Screenshots actual next controls просмотрены.
- Новая самостоятельная `GBS-KRAJNE-REDUCED-MOTION-QUIZ-OCCLUSION`: при OS reduced motion оборот heart card перекрывает `#quizLaunch` на desktop/mobile и Light/Dark. Native click/tap получает interception от `.heart-flip-back-body` / `.heart-flip-back-closing`. При обычном motion оба width controls открывают квиз нормально; клавиатура также работает.
- Механизм: `css/site.css:686` делает обе faces static/visible, но `src/runtime/article-reversible-cards.js:32–67` резервирует max(face) и normal/aspect height. На desktop родитель 545px при stacked faces 501.328+545.047px; на mobile 726px при 207.188+726.219px. Обратимый CSS A/B **только в памяти** (`height:auto;aspect-ratio:auto` у card/inner с тестовым priority) резервирует 1046.375/933.406px, восстанавливает hit-test и настоящий native launch; после удаления style и reload исходная блокировка возвращается. Это proof механизма, **не рекомендованный/слитый Product patch**.

Нет искусственного уменьшения счётчика: **55 − 1 старый CSS defect + 1 новый независимый pointer defect = 55**. Последний не дублирует light-only contrast: он воспроизводится и в Dark, а исправление цвета не чинит геометрию. До Product mutation требуется проверить adjacent draft #2183/#2184 по shared CSS/runtime, не заводить конкурирующий lane.

Данные: [116 компактных документов](evidence/2026-10-22-quiz-motion-recheck.json), включая все 106 quiz capture objects и 6 motion/A-B records, exact round-trip. Harnesses: `quiz-postclosure-recheck.mjs` (`WIDTH=1440/390 SCHEME=light/dark`), `reduced-motion-card-occlusion.mjs`; копировать в browser workspace. Первый пробный progress-check ошибался из-за CSS uppercase `innerText`; исправлен именно probe на DOM `textContent`. Реальные pointer failures не удалены, `force` не применялся.
