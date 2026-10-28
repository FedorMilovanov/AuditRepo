# Resulting main: reader measure closure и capacity residual — 2026-10-28

## 1. Якорь и решения

Product PR #2206 подтверждён как **MERGED**: exact PR head `fd7e4e61bd76cde2394191089efec647d05e1d87`, owner merge `0e83c2adc10c053ed25146fa191f232f2e4a9ae9`, merge time `2026-10-28T01:20:15Z`. Exact current main — `cdf994b104d7b5eaeef407bf60e341e436efe1df`; единственный промежуточный commit #2207 добавляет только `audit/BRANCH-CLEANUP-DISPOSITION-2026-10-28.md` и не меняет Product bytes. На чистом current main канонический `npm run strangler:build:production-like` прошёл: 104 Astro pages, 0 errors, 7 прежних hints; post-build asset/CSP/projection/reader guards зелёные. `reader-preferences-regression-test.js`, `check-engine-contracts.js` и `runtime-integrity-test.js` прошли.

Решения разделены, а не объединены в удобное blanket closure:

- `GBS-READER-MEASURE-DESKTOP-ALIAS-AND-BREAKPOINT-REGRESSION` → **FIXED-CURRENT**, удалить из active matrix;
- `GBS-SERIES-READER-COMPACT-DESKTOP-CAPACITY-CONFLICT` → **PARTIAL/NARROWED**, перенести из direct defects в narrowed residuals: settled capacity/rail conflict исправлен, но descendant-dependent first-paint reserve и compact edge-bar occlusion сохраняются.

Арифметика: direct 47→45, residuals 0→1, total 77→76. Машинное резюме: `evidence/2026-10-28-reader-measure-resulting-main-closure.jsonl`; raw JSON, PNG и scripts оставлены вне Git в `/tmp/wave9`.

## 2. Шесть families, Light/Dark и native actions

Проверены шесть representative families:

1. Heart — `/articles/kak-hranit-serdce/`;
2. Gill — `/articles/dzhon-gill-chast-1-chelovek/`;
3. Teen — `/articles/vzroslaya-doch-otets-brak-soglasie-granitsy-vlasti/`;
4. Pastor — `/articles/20-antisovetov-pastoru/`;
5. Hard Texts — `/hard-texts/angely-pod-mrakom-iuda-6-7-2-petra-2/`;
6. Baptist history — `/baptisty-rossii/noch-na-kure/`.

Каждая проверена в Light и Dark, reduced motion, на 390/900/1023/1024/1100/1200/1280/1366/1440/1599/1600/1920 px: 144 route/theme/width records. Выполнено 432 native клика `narrow/normal/wide`; 240 persisted reload witnesses, включая reload после каждого состояния на Heart/Gill и final-wide reload на остальных families. Ошибок attribute/storage/theme — 0.

## 3. Measure alias действительно закрыт

Settled shell geometry одинакова во всех шести families и обеих themes:

- 1023–1920: N/M/W = **624/736/760 px shell**, соответствующая prose geometry **576/688/712 px**;
- 1023→1024 и 1599→1600: отрицательный скачок отсутствует;
- каждое desktop signed state наблюдаемо отлично;
- document overflow 0/432, broken images 0/432, page errors 0.

На 900 px остаётся N/M/W shell 720/820/820 px. Это compact cap ниже заявленного desktop closure range и не отменяет исправление desktop alias; результат сохранён явно. На 390 px mobile states также проверены нативно и дали distinct constrained shells, с route scrollbar variation у wide 375/390 px.

Следовательно, прежние `normal=wide` на 1600+, Teen triple alias и breakpoint regressions больше не воспроизводятся. Отдельный measure ID закрывается.

## 4. Settled capacity и rail repair

На 1366/1440 после pointer move в prose и обычного wheel scroll до `scrollY=3500` проверены 24 family/theme profiles. Fixed rail и правый action cluster пересекают painted paragraphs в **0/24**. Горизонтального overflow нет. Прежние shared 492.7 px collapse, Teen 696.7/820 px bypass и пять боковых controls поверх prose не воспроизводятся.

То есть settled часть capacity owner исправлена #2206. Однако вся строка capacity не закрывается из-за двух independently painted остаточных проявлений ниже.

## 5. Residual A: parser-time 304 px relocation

Full matrix заметил два first-rect relocation: Gill Light 1599 wide `x=723.5→419.5`, Heart Light 1920 narrow `x=952→648`, при неизменной правильной ширине shell. Изолированный cold control повторил каждое проявление 1/3; Dark controls — 0/6. Источник layout shift — `gbs2-world`, CLS до **0.190265**.

Это не font или timeout inference. Source остаётся композиционно поздним:

- `site.css`: `@media (min-width:1024px){body.gbs-world{padding-left:304px}}`;
- `floating-cluster.css`: descendant-dependent `body.gbs-world:has(.gbs2-world[data-gill-v16]){padding-left:0}`.

До разбора descendant браузер иногда успевает покрасить legacy reserve, затем снимает его. #2206 изменил settled breakpoint/capacity, но не сделал body owner first-paint-safe. Поэтому cold extension capacity row остаётся current, теперь как narrowed residual.

## 6. Residual B: compact edge chrome поверх prose

При 1024 px rail намеренно заменён compact top/bottom chrome. Обычный scroll и реальная геометрия `main/article p` показали painted intersections в 8/12 family/theme profiles: Heart, Gill, Teen и Baptist в обеих themes. Top bar покрывает верхний paragraph fragment, bottom bar — нижний; Pastor/Hard Texts в выбранной scroll position дали 0, но тот же fixed bottom owner присутствует.

Это не прежний боковой corridor conflict, но closure boundary строки прямо требовал `no ... prose occlusion`. Поэтому overlay нельзя молча объявить допустимым. Owner должен либо зарезервировать читаемую viewport-зону/скрывать chrome по ясному scroll contract, либо явно пересмотреть acceptance contract с доказательством, что закрытый текст всегда естественно достижим без потери позиции.

## 7. Health, Axe и delivery noise

- 0 broken images, 0 horizontal overflow, 0 page errors;
- Light Axe на 1024: 0 violations во всех шести families;
- Dark Axe: по два `color-contrast` nodes на family, всего 12, те же `.mobile-btoc-section__label`/section text, уже принадлежащие `GBS-TEXT-CONTRAST-RESIDUAL-BATCH`;
- шесть одинаковых `net::ERR_CONNECTION_CLOSED` от external delivery отфильтрованы как sandbox egress noise;
- mobile/compact/rail screenshots сохранены вне Git.

Новый ID не создаётся: first-paint и chrome capacity остаются в исходном capacity owner, но строка сужена до реально воспроизводимого остатка.

## 8. Exact merge-head checks

PR #2206 exact head завершил 53 success, 8 intentional skipped и один cancelled predecessor `guard`; PR имеет state `MERGED`. На resulting owner-merge SHA `0e83c2a…` GitHub сообщает **41 success + 21 skipped, 0 failure, 0 pending**. На exact current main `cdf994b…` после docs-only #2207 — **8 success + 8 skipped, 0 failure, 0 pending**. Среди зелёных checks: production-like contract/coverage, Chromium+WebKit cold bootstrap, reader controls accessibility, semantic projection, Native owners, pixel diff и Browser contract.

## 9. Итог

Measure semantics закрыта независимо и удаляется из active matrix. Capacity row не удерживается историческими уже исправленными цифрами: она переносится в narrowed residuals и формулируется только вокруг current parser-time 304 px relocation и compact edge-chrome occlusion. Новая арифметика: **45 direct + 8 improvements + 1 residual + 22 systems = 76 active work units**.
