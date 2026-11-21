# HOREB 3D — библейская 3D-экспедиция и игра

> **Текущий единственный художественный маршрут:** [ART-FIRST PRODUCTION STRATEGY](docs/ART_FIRST_PRODUCTION_STRATEGY.md). Это действующая инструкция для **следующей** волны; старые W12/W13-планы и `AGENT_HANDOFF.md` ниже по истории — не текущие приказы.

## Состояние / владелец

- **Один канонический [Draft PR #543](https://github.com/FedorMilovanov/AuditRepo/pull/543)**, ветка `lane/horeb-3d-lab-20261108`. Реальный HEAD и exact-SHA CI каждый раз сверять заново. Ни один старый SUCCESS не переносить на новый коммит.
- На момент смены стратегии (21.11.2026) W15.5 реализовал **playable blockout**: от условного жилого квартала к тростнику у Нила и к встрече дочери фараона. Игровая последовательность работает в тестах, но **премиальный ART, полноценные живые персонажи, физические игровые действия, историческая/Research/rights редактура, аппаратные iOS/Android и релиз — HOLD**.
- Реальные сюжетные миры: ранний Нил, колодец Мадиама, условная семейная стоянка, Хорив/несгорающий куст. 42 исследования — отдельный архив лабораторных досье (не 42 личных имени Бога и не 42 готовых полноценных миров). Остальные главы Исхода не объявлять реализованной 3D-картой.
- Сцены — уважительная **художественная реконструкция**, не заявленная археологическая идентификация дома Моисея или горы; Бога не изображать, не искажать Исход 1–4.

## С чего начать новому агенту
1. **[docs/ART_FIRST_PRODUCTION_STRATEGY.md](docs/ART_FIRST_PRODUCTION_STRATEGY.md)** — единственная актуальная визуально-игровая стратегия, gates, ограничение scope, cleanup ledger и метод приёмки.
2. **[AGENT_NEXT_PROMPT.md](AGENT_NEXT_PROMPT.md)** — короткая текущая инструкция на следующий инженерно-художественный шаг.
3. **[AGENT_HANDOFF.md](AGENT_HANDOFF.md)** — исторический журнал многочисленных прежних волн, пригоден для forensic. **НЕ является текущим планом и не должен сам запускать W12E.5.**
4. **[SOURCE_PROVENANCE.md](SOURCE_PROVENANCE.md)**, **[IMPORT_MANIFEST.json](IMPORT_MANIFEST.json)** и `original/arena-horeb-original.zip` — нетронутый авторский исходник/архив. Оригинальные доказательства и сведения о лицензиях беречь.
5. `src/imena-boga-horeb-3d/data/nileVillageQuest.ts`, `ui/NileVillageJourney.tsx`, `engine/NileVillage3D.ts` — нынешний playable blockout. `NilePrelude.ts`, `MidianWell.ts`, `MidianHomestead.ts` — существующие независимые миры и защитная физика.
6. `tests/` — текущие regressions; `briefs/SCENE_SPEC_42.md` и `audit/` — **исторические** решения/артефакты, не указание клонировать 42 сцены.

## Инженерный запуск

```bash
cd projects/gb-is-my-strength/prototype/imena-boga/horeb-3d
npm ci
npm run build
npx tsc --noEmit
bash tests/test.sh
npm run dev -- --host 127.0.0.1
```

Для настоящего Chromium с работающим сервером: `HOREB_BASE_URL=http://127.0.0.1:5173 HOREB_BROWSER_PATH=/path/to/chrome npm run test:browser:chapters`. Используйте также source, accessibility и остальной тестовый набор по риску конкретного изменения. Переменные на Windows: `npm.cmd`, `npx.cmd`, Git Bash, `$env:HOREB_BROWSER_PATH`. Не полагаться на результат только headless SwiftShader как на FPS телефона.

Локальный Windows preview лаборатории W15: `http://127.0.0.1:5191/` (доступен **только на компьютере**, где поднят сервер). W14 эксперимент отдельно на `:5189`, не текущий ART baseline и не Product. Не считать наличие URL доказательством качества/релиза.

## Новый способ производства

**Один hero slice, а не 20 параллельных микроволн**: готовая авторская 3D-модель дома, персонаж матери со скелетом и анимациями, предметы подготовки корзины, связная улица и густой берег. Blender → glTF/GLB → лицензированный asset manifest → real-time Three.js → 6 одинаковых проверенных камер + настоящий desktop/mobile walkthrough. До ART LOOKDEV gate не развивать все остальные миры.

**Запреты:** не переписывать Product/Research, не merge/deploy, не создавать параллельные HOREB V2, PR/ветки, не делать force-push или reset чужой грязной рабочей копии W10D. Не удалять временные каталоги, исходный ZIP/Research/evidence или тесты без доказанной замены. Итоговая художественная приёмка отделена от инженерной.
