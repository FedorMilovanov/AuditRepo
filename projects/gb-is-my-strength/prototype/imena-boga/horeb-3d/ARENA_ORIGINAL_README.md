# Имена Бога — перед Святым · 3D-экспедиция к Хориву (лабораторный прототип)
Самостоятельный прототип (React 19 + Three.js, процедурная графика). Не Product, не опубликованный контент: все карточки — `HOLD`.

## Запуск
    npm ci
    node tests/generate-reader.mjs # при изменении канонических карточек: static HTML + локальные OFL-шрифты
    npm run build                # dist/index.html + dist/reader.html + fonts (без JS для чтения)
    npx vite preview             # или открыть dist/index.html
    sh tests/test.sh             # 24 unit-теста: редакционные инварианты + маршрут/порог
    # E2E (Playwright Chromium, software WebGL):
    (cd /tmp && npm i playwright@1 && npx playwright install chromium)
    PW_PATH=/tmp/node_modules/playwright node tests/e2e.mjs   # скриншоты в audit/screens/
    PW_PATH=/tmp/node_modules/playwright node tests/regression.mjs # мобильный порог, повторный вход, порча localStorage
`#read` в URL сразу открывает React HTML-режим чтения. `reader.html` работает без JavaScript и генерируется из того же типизированного реестра. `?e2e` включает тестовый хук `window.__horeb` только для браузерных проверок.

## Управление
W A S D / стрелки — шаг и поворот · клик по сцене — обзор мышью (Esc отпускает; при запрете pointer lock — перетаскивание) · E / Enter — экспонат или «Снять обувь» · M — схема · R — сброс камеры. Сенсор: джойстик слева, обзор правой половиной, кнопка «Действие».

## Структура `src/imena-boga-horeb-3d/`
data/exhibits.ts (ExhibitRegistry), data/validate.ts · engine/nav.ts (Collision/Nav + SandalsGate), SceneZones.ts, BurningBush.ts, World.ts (PlayerController, QualityMode, жизненный цикл), audio.ts · ui/AccessibleReader.tsx, ResearchDrawer.tsx, Controls.tsx (Settings, MiniMap, Joystick) · HorebApp.tsx.

## Ограничения
Тестировалось в headless Chromium + SwiftShader (~10 fps — это программный рендер, а не реальная производительность GPU); мобильная ширина и touch-эмуляция проверены в Chromium, но реальное устройство — NOT TESTED. Firefox и WebKit: NOT TESTED. Детализация геометрии фиксируется при входе в сцену. Репозитории GitHub из брифа в этой сессии не открывались.
