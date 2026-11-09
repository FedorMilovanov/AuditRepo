# HOREB 3D — матрица приёмки

**Исторический baseline G1–G12:** `962e674b2c2c306eab96b91d4ff254be560975dc`, [HOREB 3D QA #42642009842](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42642009842), [AuditRepo Validate #42642009840](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42642009840), [Preflight #42642009839](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42642009839) — **3/3 SUCCESS**; 135/135 source/geometry/navigation, 34/34 Chrome smoke, 42/42 E dossiers, реальный 0→7→0, 8 desktop + 3 mobile emulation + 3 detail screenshots, 0 runtime errors.

| Gate | Проверенный статус | Доказательство и оставшаяся граница |
|---|---|---|
| G1 — REAL_3D_RENDERED | PASS на Chromium; исторический аппаратный witness | 8 зон рендерятся в Chromium SwiftShader. Прежний краткий RTX 3060 WebGL2 ANGLE/D3D11 на другом HEAD ≠ аппаратная приёмка нынешнего. |
| G2 — FULL_JOURNEY | PASS axial + 42 side exhibits (Chromium) | [QA #42685624277](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42685624277): 0→7→0 и четыре независимых side jobs 10+18+12+2; реальный keyboard/WASD/стрелки/E, возврат к центру. Доказательство именно Chromium SwiftShader, не реальный mobile/hardware. |
| G3 — SANDALS_GUARD | PASS на модели + Chrome | Ритуал управляется симуляционным временем, паузится при скрытой вкладке/модалке и не позволяет пройти радиусы 14м/6.5м вопреки запрету. |
| G4 — CONTENT_TYPE_SAFE | PASS автоматика; EDITORIAL HOLD | 42 Research ID — не 42 личных имени Бога. Unicode/type/provenance валидаторы работают, но независимой филологической/произносительной колляции и публикационного допуска нет. |
| G5 — UX_A11Y | PARTIAL | Responsive/keyboard/HTML reader/webgl fallback и mobile emulation проверены; реальные экранные дикторы, физические touchscreen Android/iOS и WebKit/Firefox ещё не прошли. |
| G6 — PERFORMANCE | PASS измеримость/командный бюджет; HARDWARE HOLD | SwiftShader zone0 306→105 draw calls (−65.7%), 150653→120185 triangles (−20.2%). Режим low ≤30 FPS, high ≤60 FPS. Нет актуальных реальных VRAM/thermal/GPU/endurance испытаний; `low-power` не гарантирует определённый адаптер. |
| G7 — RIGHTS_PROVENANCE | PASS только собственные визуальные ассеты; CONTENT HOLD | Реестр лицензий `docs/ASSET_LICENSES.md`; текст, исследовательские свидетельства и голос требуют отдельного допущения. |
| G8 — PRODUCT_ISOLATION | PASS | Изменения ограничены AuditRepo HOREB Draft PR #543; Product/Research, релиз и исходный Arena ZIP не менялись. |
| G9 — JOURNEY_AND_ART | ENGINEERING PASS; ART HOLD | Процедурные скалы, колодец Вирсавии, источник Агари, оливы и ночной Хорив получили 8+3+3 визуальные кадры; художественная естественность, композиция и все 42 реквизита ещё не приняты человеком. |
| G10 — LOW_POWER_SCENIC_CULL | PASS browser; DEVICE HOLD | Отсечение props/stele дальше 85м (low) /125м (high); ближние остаются, дальние не рендерятся, collider/42 E не изменены. SwiftShader evidence из #42642009842. |
| G11 — LIVE_QUALITY_REBUILD | PASS Chromium | Настоящий UI переключает low/high с новым keyed canvas, WebGL renderer, 42 atlases нужного разрешения и безопасным checkpoint/footwear. |
| G12 — REPEATED_WEBGL_LIFECYCLE | PASS Chromium; VRAM HOLD | high→low→high→low, old WebGL contexts lost, scene/listeners/zone/bush references detached, ровно один canvas. На двух последовательных low-моделях геометрии **57→57**, текстуры **15→15**; счётчики принадлежат отдельному WebGL-контексту и не являются измерением видеопамяти. |
| G13 — SIDE_PEDESTRIAN_EXHIBITS | PASS 42/42 Chromium на `eaa9b90a`; новый hardening-HEAD ждёт CI | [QA #42685624277](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42685624277): 4/4 side jobs 10+18+12+2, точные 42 ID в логах и JSON, 42/42 E + независимый 0→7→0, Validate/Preflight SUCCESS. Новые test guards требуют собственного exact-HEAD прогонки. Реальные устройства и визуальное качество — HOLD. |

## Протокол продолжения

Реальные `PASS` относятся **только** к указанному SHA и соответствующему тестовому режиму. Новый HEAD — новые проверки. Скриншоты программного рендеринга не означают художественного принятия или доказательства FPS на устройстве владельца; пользовательский ПК `DESKTOP-O3FDOA4` Offline, и новая CUDA-нагрузка не запускалась. Не увеличивать яркость Хорива, не менять `R_OUTER=14` и `R_INNER=6.5`, не публиковать 42 Research-досье без редакционного допуска.

Дальнейший приоритет: доказать физическую доступность боковых сюжетных объектов, доработать природность пещеры/колодца/рощи по реальным крупным кадрам, провести ручную A11y и аппаратную приёмку **только после восстановления стабильности**. Голос, права и филология — самостоятельные HOLD, не смешивать с инженерными PASS.

