# HOREB 3D — актуальная передача Arena / следующему разработчику

**Проверено 2026-11-08 при импорте.** Не цитировать этот снимок как вечную актуальность; перед работой проверить свежий head PR.

- **Source repo:** `FedorMilovanov/AuditRepo`.
- **Рабочая ветка:** `lane/horeb-3d-lab-20261108`.
- **Единственный Draft PR:** https://github.com/FedorMilovanov/AuditRepo/pull/543.
- **Папка кода:** `projects/gb-is-my-strength/prototype/imena-boga/horeb-3d/`.
- **Оригинал:** `original/arena-horeb-original.zip` (неизменённый SHA-256 `c2267894e1369f96244f0df9b78b51acfc5ccfeb4838f25037b2ec1551b14fa9`).
- **Baseline import commit:** `4d9ec9f7899ff6f6af349f404460e9137b4766b8`.
- **Original status:** `IMPORTED`. Не считать `promotion-ready`, не объявлять «42 сцены готовы», не публиковать.

## Текущий checkpoint (2026-11-08, W1–W7)

**Статус: 42-exhibit expansion — REGISTRY + CONTRACT + SCENE-PROPS engine GREEN; props wired into World; placement geometry verified; browser visual QA BLOCKED.**

Проверено в этой ветке (`lane/horeb-3d-lab-20261108`, локально, без push):

- **W0 baseline:** `npm ci` → generate-reader → `tsc --noEmit` → `vite build` → **BUILD_EXIT=0**. Свежий билд чист.
- **42-exhibit registry/contract:** `sh tests/test.sh` → **33 passed, 0 failed, TEST_EXIT=0** (E1 точно 42 ID, E2 ≥2 anchor props + уникальные signatures, E3 semantic-negative injections, nav/sandal-gate fail-closed). Hebrew surface validated (el-elyon ≅ final nun U+05DF, el-bethel hyphen допустим).
- **Scene-props engine:** `engine/exhibitProps.ts` — 40+ builders + `buildExhibitProps(e, low, px, pz)` dispatch on `environmentKey` + zone-tinted `PointLight`. Запись props-группы в `World.build()` перед каждой стелой (offset 1.2 к центру прохода). **Construction smoke:** `tests/construct.ts` (esbuild-bundle, Node) → **42 passed, 0 failed, 296 meshes high + 296 low**.
- **Placement geometry:** `tests/placement.ts` → **4 passed, 0 failed**. Все 42 стелы на твёрдой почве (стены + зона-4 уступ). Исправлен баг: правые стелы зоны-4 (chasm) теперь на уступе `x≈3.2` (оригинальный дизайн), не над провалом. Zone-7 (Хорив, outdoor) стелы на плато `x=±10`.
- **Dev server / preview:** `npx vite --host 0.0.0.0` на `0.0.0.0:5173`; `server.allowedHosts: true` (preview-host 403 исправлен). HTTP 200 и по localhost и по preview-host. Live-preview доступен.
- **Браузерная visual QA:** **NOT RUN / BLOCKED** — в sandbox нет chromium/playwright (egress блокирует `release-assets.githubusercontent.com` + Playwright CDN). `/tmp/launch-helper.js` отсутствует. Tag e2e/regression BLOCKED.

Изменённые файлы (локально): `engine/exhibitProps.ts` (new), `engine/World.ts` (wiring props + front placement), `engine/procedural.ts` (glowTexture Node-safe fallback), `engine/SceneZones.ts` (PLACEMENTS all 42 + zone-4 chasm fix), `data/exhibits.ts` (el-elyon Hebrew fix), `data/validate.ts` (HEBREW regex + hyphen), `HorebApp.tsx` + `tests/e2e.mjs` (ID refs), `ui/AccessibleReader.tsx` (meaningfulAction/caution rows + SourcesAndLimits disclosure), `tests/{construct,placement}.ts` (new), `tests/test.sh` (+esbuild construction/placement stages), `vite.config.ts` (allowedHosts).

**Known limitations / unverified (без браузера):**
- Props не в `obstacles` (decorative) — игрок проходит сквозь них; collision для props не реализован.
- Visual clipping props vs стела/свод — не проверено визуально (geometry-check проверяет только до壁/уступ; props впереди стелы, не за сводом).
- `rockTextures`/`labelTexture` (canvas) не протестированы в Node (DOM), но не менялись с working baseline.

**Следующий инженерный шаг:** визуальный audit в браузере (если появится chromium). Без browser — продлить geometry/construction проверки. Не push, не merge PR #543 без разрешения пользователя.

## Checkpoint W11 (2026-11-08): merge prop geometries — 63% draw call reduction

Commit `c051323` на `arena/13fed2e7-auditrepo`.

- **mergePropsGroup():** `exhibitProps.ts` — новый export. Merge meshes по material в prop groups: applies local matrix к geometry, normalize to non-indexed (attribute compatibility), mergeGeometries per material. Fallback: keep individual meshes если attributes несовместимы. Non-mesh children (sprites, glow) preserved.
- **Wiring:** `World.build()` — `mergePropsGroup(props)` после `buildExhibitProps`, перед `scene.add(props)`.
- **Результат:** 296 prop meshes → 111 (63% reduction in draw calls).
- **Merge test:** `tests/construct.ts` — total reduction check (296→111, 63%).
- **Проверки:** tsc clean, build green (dist 1394 kB), **87 tests green** (33+48+6).
- Dev-сервер: 0.0.0.0:5173, HTTP 200, HMR.
- Изменённые файлы: `engine/exhibitProps.ts`, `engine/World.ts`, `tests/construct.ts`.
- Следующий шаг: bush quality (уже хорош), more scene variety, mobile/a11y, или browser visual audit (BLOCKED — без chromium). Не push без разрешения.

## Checkpoint W10 (2026-11-08): geometry cache — 71% reduction

Commit `9f0dbe1` на `arena/13fed2e7-auditrepo` (fast-forward merge с `lane/horeb-3d-lab-20261108`).

- **Geometry profiling:** `tests/geom_profile.ts` (new) — bundled с esbuild, headless. Просчитано: 592 mesh instances (296 high + 296 low), 584 unique geometries, 170 unique params. **71% дубликатов** — одинаковые параметры, но отдельные BufferGeometry.
- **Geometry cache:** `exhibitProps.ts` — добавлен `geoCached(type, params)` + `_geoCache Map`. `G.box/cyl/sph/cone/tor/plane/dodec` теперь возвращают shared instance по parameter-key. Unique geometries: 584→170.
- **addWell fix:** torus ring переведён с `new THREE.TorusGeometry()` на cached `G.tor()`.
- **Проверки:** tsc clean, build green (dist 1393 kB), **86 tests green** (33+47+6).
- Dev-сервер: 0.0.0.0:5173, HTTP 200, HMR.
- Изменённые файлы: `engine/exhibitProps.ts`, `tests/geom_profile.ts` (new).
- Следующий шаг: InstancedMesh для повторяющихся prop-типов (rocks, bushes) — дальнейшее сокращение draw calls. Bush quality (уже хорош). Browser visual audit BLOCKED (без chromium). Не push без разрешения.

## Checkpoint W9 (2026-11-08): props collision fail-closed

Commit `b98ca65` на `lane/horeb-3d-lab-20261108` (локально, без push).

- **props collision (fail-closed):** `World.ts` — добавлен obstacle `{x: bx, z: bz, r: 0.6}` на props-якорь (1.2m к центру от стелы). Игрок обходит сцены экспонатов вместо прохождения сквозь них. Effective radius = 0.6 + 0.35 (player) = 0.95m. Interaction trigger (d≤3.6m) — props anchor на 1.2m от стелы, player может подойти на 0.25m от стелы с центр-стороны (в пределах trigger). Safe.
- **centre-path guardrail (collision):** `tests/placement.ts` — +проверка что collision-окружения props не перекрывают центр прохода (≥0.3m). All 42 pass.
- **Research extract:** `briefs/research_42_extract.json` (32KB, 855 lines) — commit睏ан вместе с feat (оригинально untracked).
- **Проверки:** tsc clean, build green (dist 1392 kB), **86 tests green** (33 contract + 47 construction + 6 placement [solid ground + wall/ledge + centre path + collision centre path]).
- Dev-сервер жив (0.0.0.0:5173, HTTP 200, HMR). Browser visual QA BLOCKED (без chromium).
- Изменённые файлы: `engine/World.ts`, `tests/placement.ts`, `briefs/research_42_extract.json` (new).
- Следующий шаг: performance profiling (296 prop meshes high + 296 low = 592 total, manageable), bush quality (уже хорош), или browser visual audit при доступе к chromium. Не push, не merge PR #543 без разрешения пользователя.

## Checkpoint W8 (2026-11-08): no-repetitive-stone + centre-path guardrail

Commit `387df66` на `lane/horeb-3d-lab-20261108` (локально, без push).

- **no repetitive stone:** `nav.ts: steleVariation(id, zone)` — детерминировано по id: scale 0.86–1.16, tilt ±0.06 rad, labelScale 0.90–1.12, zone tint (8 цветов, warm→cool). `World.ts`: 8 zone-tinted material clones + per-exhibit stele mesh scale/tilt, label scale. 42 стелы больше не идентичны.
- **centre-path guardrail:** zone-4 правые стелы (chasm) перемещены x=3.2→3.8 — props не закрывают центр прохода (≥0.3m). `tests/placement.ts`: +center-clearance check.
- **Проверки:** tsc clean, build green, **85 tests green** (33 contract + 47 construction [42 props + 5 variation] + 5 placement [solid ground + wall/ledge + centre path]).
- Dev-сервер жив (0.0.0.0:5173, HTTP 200, HMR). Browser visual QA BLOCKED (без chromium).
- Изменённые файлы: `engine/{World,nav,SceneZones}.ts`, `tests/{construct,placement}.ts`.
- Следующий шаг: props collision (fail-closed, не в приоритетах но важно для immersion), bush quality (уже хорош), performance profiling (296 prop meshes total — manageable), или browser visual audit при доступе к chromium. (проfiler), props collision по желанию. Без browser — продлить geometry/construction проверки. Не push, не merge PR #543 без разрешения пользователя.

## Что проверено, а что нет

- Исходный ZIP совпадает с SHA-256. GitHub blob SHA-1 оригинала `b20de9b1985fae87595e53d9bcb1fb9ccb822203` совпал с локальным `git hash-object`.
- **36 исходных текстовых файлов** (включая `ARENA_ORIGINAL_README.md`) свёрнуты по Git blob SHA-1; дополнительно созданы `SOURCE_PROVENANCE.md`, `IMPORT_MANIFEST.json`; источник в архиве не переписан.
- Весь проект существует на GitHub-ветке, проверены исходники `package.json`, `src/`, `tests/`, `World.ts`, `BurningBush.ts`, и ZIP.
- В изолированной среде проверки архива исполнен `node tests/run.mjs` из **архивной** `.test-build/`: **24 PASS / 0 FAIL**. Это **не** свежая компиляция TypeScript.
- `npm ci`, самостоятельный `npm run build`, `npx tsc --noEmit`, Playwright browser, WebKit, реальный мобильный GPU: **NOT RUN для GitHub exact imported head**. В sandbox нет доступа к npm registry. Первым делом повторить в агенте.
- Локальные `public/fonts/*.woff2` отсутствовали в экспортированном ZIP. Воспроизвести генерацию через `node tests/generate-reader.mjs` и проверить шрифты в финальной сборке.
- `tests/e2e.mjs`, `tests/regression.mjs`, `audit/acceptance-matrix.md` содержат исторические claims Arena, не автоматическую текущую сертификацию.

## Точный порядок чтения

1. README этой папки и этот файл.
2. Текущий HEAD PR #543 и реальные файлы (особенно если Arena создал рабочую ветку `arena/*` от `main`).
3. `ARENA_ORIGINAL_README.md`, `docs/SCENE_MAP.md`, `docs/SOURCE_AUDIT.md`, `audit/acceptance-matrix.md`, `audit/iteration-log.md`.
4. `src/imena-boga-horeb-3d/HorebApp.tsx`, `engine/{World,SceneZones,BurningBush,nav}.ts`, `data/{exhibits,validate}.ts`, `tests/`.
5. `briefs/SCENE_SPEC_42.md` и `briefs/ORIGINAL_MASTER_BRIEF_V2.md` — **исторические художественные требования**. Их старое «создай новый проект» **отменено**, действителен только `AGENT_NEXT_PROMPT.md`.
6. Research PR #379 в точном актуальном HEAD; сверить источники и `HOLD`.

## Что делать следующим

**Этап А (обязательный, до визуального редизайна).** Работай в этой ветке, не на `main`. Переустанови зависимости и получи clean build/typecheck/test (не переписывая проект), воспроизведи браузерное поведение и реальный screenshot. Почини причину отсутствующих fonts и любые реальные ошибки.

**Этап B.** Проведи технический и художественный инвентарный аудит 8 зон и 25 карточек. Создай матрицу соответствия 42 research records, *не* переименовывая все в «собственные имена Бога». Для каждой будущей сцены — контекст, источник, уникальный объект, взаимодействие, компоновка, производительность, статус редакционной проверки. Не создавай 42 тяжёлых независимых мира.

**Этап C.** Продолжай существующие сцены и геометрию, внедряй уникальные исторические окружения в пределах разумного frame budget. Особые различия: источник Агари vs псалом о Пастыре, имя места у Авраама vs жертвенники Гедеона/Моисея vs имя города Иезекииля; наружный Хорив и два ограничения у куста.

## Правила изменения

- Один рабочий source в рамках PR #543. Не создавать `horeb-new`, `horeb-v2` и параллельные сайты.
- Если Arena checkout остался на `arena/*` от `main`: явно **получить ветку PR #543**, проверить `git ls-tree`, потом продолжить на её файлах. Не «обнаружив отсутствие», генерировать с нуля. Не делать `git reset --hard`, force-push, merge PR/production или неоговорённые изменения в общем корне AuditRepo.
- На выходе каждого раунда — exact SHA, список изменённых файлов, реально запущенные проверки, браузерные скриншоты/preview, текущие blockers и следующий checkpoint (обновлять этот файл, не создавать версионные duplicates).
- Product, Research, Grok Reader, Atlas/Sozvezdie, другие PR **не трогать**.
