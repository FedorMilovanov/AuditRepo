# HOREB 3D — актуальная передача разработчикам

**Единственная каноническая ветка:** `lane/horeb-3d-lab-20261108`
**Единственный Draft PR:** https://github.com/FedorMilovanov/AuditRepo/pull/543
**Путь:** `projects/gb-is-my-strength/prototype/imena-boga/horeb-3d/`
**Статус:** LAB DEVELOPMENT / EDITORIAL HOLD — НЕ Product и НЕ опубликовано.
**Неизменённый ZIP:** `original/arena-horeb-original.zip`, SHA-256 `c2267894e1369f96244f0df9b78b51acfc5ccfeb4838f25037b2ec1551b14fa9`.

## Канонизация

Выбрана более функциональная ветка Arena `arena/13fed2e7-auditrepo` (источник `7b200b39d9cfc77523db15295952607d43b9d619`): 42 уникальных ID из Research #379, 42/42 PLACEMENTS, физические тематические props, геометрические проверки и Chromium-сценарии. Перенесено в существующий PR #543 с сохранением неизменённого оригинального ZIP. Другая ветка `arena/7f74c768-auditrepo` имеет 40 записей, искусственные base/ext дубли, 15 неразмещённых в 3D; её содержимое не копировать целиком. Колодец и тамариск уже присутствуют в новой системе.

В интеграционном коммите устранены проверенные риски:
- `mergePropsGroup()` сначала пересчитывает матрицы и сохраняет все transforms, а при несовместимости геометрий оставляет originals. Добавлен bounding-box regression на все 42 сцены.
- `npm run build` и `npm run dev` запускают генерацию reader.html и шрифтов из единого typed registry. Нельзя снова оставить 25 старых карточек в HTML.
- `vite.config.ts`: вместо blanket `allowedHosts: true` допускается только явно названный `HOREB_PREVIEW_HOST`; localhost доступен по умолчанию.

## Тесты / статус приёмки

- 42 Research IDs (29+13) и 42 placements подтверждены по GitHub source; **не** 42 доказанных собственных имени Бога.
- Agent reported: 33 contract, 48 construction, 6 placement, Chromium browser tests; **не смешивать с независимым CI**. Browser стадии `tests/test.sh` могут `SKIP`, когда нет `/tmp/chromium` или запущенного dev-сервера.
- Reported Chromium SwiftShader `~1 FPS`: это НЕ performance PASS и не показатель мобильного GPU. Нужны реальный GPU, Android/iOS, браузеры Chromium/Firefox/WebKit и доказательные screenshots.
- Сначала на **точном HEAD PR #543**: `npm ci`, `npm run build`, `npx tsc --noEmit`, `sh tests/test.sh`. Проверить actual bounding-box test, props placement, collision, шрифты, 42 HTML-article, куст/обувь/RTL.
- Библейские/исторические данные и права остаются `HOLD` до внешней редакционной сверки Research #379. Каждая экспозиция — отдельный контекст, не автоматически разрешённая публикация.

## Конфликт агентов

Приступать только после `git fetch origin refs/pull/543/head`, `git rev-parse FETCH_HEAD` и сверки SHA с настоящим HEAD PR. Работать с реальным источником. Не создавать дублей, новых веток HOREB, не переносить весь код из `arena/7f74c768`, не использовать force-push/reset hard. Не изменять Product, Research, Grok, Atlas. Не merge и не deploy без владельца. Один checkpoint = этот файл; исторический экспорт и брифы сохраняются как evidence.
