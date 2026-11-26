# HOREB 3D — текущая инструкция для следующего агента (ART-FIRST)

**Один проект:** [Draft PR #543](https://github.com/FedorMilovanov/AuditRepo/pull/543), `lane/horeb-3d-lab-20261108`, корень `projects/gb-is-my-strength/prototype/imena-boga/horeb-3d/`. **Обязательное чтение**: [docs/ART_FIRST_PRODUCTION_STRATEGY.md](docs/ART_FIRST_PRODUCTION_STRATEGY.md) и [README.md](README.md). Все прежние W12E.5/G13 команды в Git-истории/71k handoff — ретроспектива, не текущий backlog.

**W17 ART-FIRST состояние:** [art-lab/house/README.md](art-lab/house/README.md) — первая *реальная* модель в Blender/GLB + 4 камеры + 390px QA, **ART HOLD**: дом и корзина ещё не уровня премиального релиза, анимированной матери пока нет. Следующему агенту не клонировать дом из кодовых кубов, а прежде всего довести художественные модели и анимацию, проверить лицевые/внутренние крупные планы и лицензии.

**W18 ART-FIRST подтверждено:** [art-lab/mother/README.md](art-lab/mother/README.md) — 53-костная female MakeHuman CC0 сетка, авторская временная льняная одежда, два настоящих NLA-клипа и Windows Chrome 1440/390. **ART HOLD:** лицо, глаза, кожа, покрой ткани и качество жеста низкие. Не подменять полноценную художественную приёмку зелёным тестом, не переносить актёра в W15. Следующий художественный цикл должен довести лицевой close-up, материалы и жест, сохранить происхождение и доказать кадрами до/после.

**W19E ART-first handoff:** Подтверждён [реальный Blender→GLB CC0-пилот](art-lab/mother-w19/README.md) с устранённой утечкой MakeHuman helper-geometries, 53 скелетными костями, двумя клипами, материалами кожи/глаз и льна. Сравнены оригинальные 1440/390 скриншоты. **Новая визуальная задача — правдоподобные глаза/рот/лицо и качественная одежда; исправить UV и facial-rig без возврата helper-полосок.** W19E ART HOLD, модель не интегрировать в основной W15, не создавать новые микро-волны камней.

## Current handoff: W29a (2026-11-26)

- W28r v3: complete local 417 gesture + 144 idle pair clearance, desktop/mobile browser pass; historical CI 8/8 at 58f46427. W28s linen and W28t conforming CC0 brow overlay are derivative ART-HOLD studies. W28t brow-only reimport and focused real Chromium: 561 samples, zero tested overlaps/desync, 53 bones, eight skinned meshes. This is not a full scene acceptance.
- W29a: bounded detail restored from the pinned original CC0 skin atlas, original geometry/animation/roughness unchanged, deterministic export. Candidate 12,567,992 bytes, SHA-256 3cd8372200534849bbdb39ccc6d48dedddce21dac0305ef3963be53a016c5e69. Local evidence: H:/HOREB_ArtPipeline/evidence/W29a-skin-20261126. Generated binary stays local. Compare exact-source frontal and blink renders; do not infer artistic acceptance from the checksum. Size increase is an optimization debt.
- Next: eyelash fit with blink morphs, skin/eye lookdev, head-cover and garment silhouette, then expressive body performance and house/interior. No canonical asset swap before full scene audit. Recover missing W28g generator or explicitly document native-source reproducibility boundary. Keep one draft PR; verify CI on exact current SHA. Older W17-W25 sections below are history, not a reset of the active baseline.

## W25 — Game architecture / single-owner vertical slice

Владелец попросил вести крупные завершённые волны одним исполнителем. Сначала надёжный embodied-interaction blockout, затем art assets/rigged performance, spatial sound, mobile walkthrough и независимая художественная приёмка; не расширять число глав до утверждённого первого hero slice. W25 не снимает ART HOLD и не разрешает интеграцию W22/W24 актёров.

W25 кандидат: один scene-owned quest transaction (revision token, precondition, elapsed, commit/cancel), один basket group с table/carry/bank ownership, staged pitch/bundle reveal, continuous transform transfer, resume/replay and duplicate-input guards. Carry attachment к камере — честный временный игровой proxy, не анимация руки. Сценарии указа и матери остаются текстовыми/условными до авторского перформанса. Действительные CI, визуальные кадры и полный desktop/touch проход ещё должны подтвердить новый HEAD.

## Цель, а не формальный чекбокс

Создать **профессиональный, исторически честно помеченный, физически играемый hero slice** Исход 1:22–2:10: интерьер семьи → человек/указ фараона (различать два царских приказа) → работа с папирусной корзиной/смолой → перенос → установка в тростнике у береговой линии → наблюдение сестры → дочь фараона. Без насилия, без фиктивных цитат или «точного дома Моисея». Природный/игровой качественный ориентир Witcher/AC Origins, но не чужие ассеты.

Нынешняя W15.5 — **работающий прототип**, НЕ финальный ART. `NileVillage3D.ts` генерирует дома из коробок и персонажей из примитивов; В исходной W15 `NileVillageJourney.tsx` увеличивал `step` при одном E; W25 заменяет это на проверяемую сценную транзакцию. Не трать следующий цикл на 20 процедурных кустов и численные seed-tuning. Не рисуй красивый макет, выдавая его за реально работающий WebGL.

## Порядок действий

1. **Безопасно сверить текущий HEAD:** `git status --short`, PR HEAD, обсуждения/новых агентов, Validate/Preflight/HOREB 6/6 на **точном** SHA, а не на предыдущей волне. Исходные архивы и незавершённую W10D не затрагивать. Работать в изолированной копии; один канонический PR, без force-push.
2. **Art LOOKDEV и asset pipeline, прежде чем менять сюжет:** шесть документированных исходных кадров (комната, мать, стол/корзина, квартал, переход к реке, папирус) и сравнимый moodboard с исторической квалификацией. Готовый в Blender минимальный набор: **один house GLB, одна rigged mother GLB + 2 animation clips, одна basket GLB**, оригинальные PBR материалы. Сохранить .blend/exports и sha256/лицензии в manifest. Никакого внешнего CDN на runtime.
3. **Показать честный в браузере 3D-пилот** с тем же ракурсом и пропорциями, что целевой от первого лица: не подменять анимированный персонаж картинкой; frame-by-frame visual review и измерение загрузки/памяти/draw calls на реальных устройствах.
4. **Только после визуальной приёмки** вводить минимальный `GLTFLoader`+animation adapters, затем один реальный жест с корзиной (`preconditions → animation/physical state → completion`) и обратимую обработку ошибок. Старый step++/примитивы сохранять как fallback до доказанного интеграционного PASS; потом удалять конкретные заменённые узлы вместе с адаптацией тестов.
5. **Проверить accessibility и GPU:** нет авто fullscreen до readiness, multi-touch не перехватывает первый палец, экран 390/360px не перекрывает цель HUD, no-WebGL/SSR доступен, Хорив/Мадиам и старый Нил не регрессировали.
6. **Отчёт:** точный SHA, один проверяемый URL локального предпросмотра, оригинальные PNG одинаковых ракурсов, короткий клип реального взаимодействия, список licensed sources, ART PASS/HOLD отдельно от CI и явные блокеры.

## Запреты и границы

Не создавать новые «большие» ветки, копии HOREB, параллельные PR, вторую матрицу, публикацию в Product, массовые удаления временных файлов/снимков. Изолированный W14 — parked исследование, не основание для автопереноса. Локальная копия W13C содержит незакоммиченные изменения и **защищена от очистки**. Временное отсутствие Blender и ~2.74GB свободного C: — фактический инфраструктурный блокер: до установки 3D-инструментов проверить безопасный рабочий диск/объём, не обещать «готовую AAA игру» без asset-производства. Все Research/rights/ART/release gate = HOLD до отдельных решений.

**Критерий успеха следующего шага:** не число выполненных тестов, а **реально более убедительный, крупноплановый, живой образ матери и домашнего пространства**, работающий из 3D-модели в браузере, плюс сохранённая физическая/библейская достоверность.
