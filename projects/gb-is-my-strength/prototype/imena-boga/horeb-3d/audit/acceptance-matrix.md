# HOREB 3D — матрица приёмки

## Current surgical checkpoint · 2026-11-10 (Draft PR #543)

**Verified engineering HEAD before this documentation update: `ab35c6a6136f7bd03227ec3b9ecd1241dd643219`.** [QA 42865777325](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42865777325), Validate 42865777299, Preflight 42865777193: **3/3 workflows SUCCESS, 6/6 HOREB jobs SUCCESS**. Any subsequent documentation HEAD needs its own CI; historical entries below are not current sign-offs.

- **ZONE-4 ART FAIL:** 63 real first-hit camera rays at each of two screenshots: **0 hits on connected ravine-wall triangles**, all rays intercepted by normal floor or outer cave vault. Screenshot capture itself passed; source test now records `FAIL_CHASM_DEPTH_NOT_VISIBLE` in `visual-witness.json`. Geological construction and physical walking remain engineering PASS, never claim artistic acceptance.
- Short real Windows GPU witness: Chrome WebGL2 / RTX 3060 D3D11, high 1440x900 DPR1, 8/8 zones reported 60 FPS in ~2.4s samples, 27–163 draw calls, 0 context loss. No endurance, VRAM or thermal certification.
- Firefox WebDriver BiDi on Windows: 8/8 camera-switched zones, WebGL2, one canvas, reported 53–60 FPS at 1366x768, no context loss. This is NOT the physical WASD route or mobile/WebKit/screen-reader certification.
- Rejected visual experiments were rolled back. Remaining independent HOLD: cave/gallery composition, well, Gethsemane, exit, 42 source/phonology/rights approvals and genuine signed bilingual master recordings, Android/iOS, WebKit, assistive tech and sustained hardware performance.
- Dark Horeb, muted HUD, outer/inner barefoot radii 14m/6.5m and nonpublished Draft boundaries must remain unchanged.

**Исторический baseline G1–G12:** `962e674b2c2c306eab96b91d4ff254be560975dc`, [HOREB 3D QA #42642009842](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42642009842), [AuditRepo Validate #42642009840](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42642009840), [Preflight #42642009839](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42642009839) — **3/3 SUCCESS**; 135/135 source/geometry/navigation, 34/34 Chrome smoke, 42/42 E dossiers, реальный 0→7→0, 8 desktop + 3 mobile emulation + 3 detail screenshots, 0 runtime errors.

| Gate | Проверенный статус | Доказательство и оставшаяся граница |
|---|---|---|
| G1 — REAL_3D_RENDERED | PASS Chromium and short RTX 3060 + Firefox on Windows | Chrome WebGL2 RTX 3060 ANGLE/D3D11 and Firefox WebGL2 both rendered 8/8 scenes on the code HEAD; not long-duration or smartphone performance verification. |
| G2 — FULL_JOURNEY | PASS axial + 42 side exhibits (Chromium) | [QA #42685624277](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42685624277): 0→7→0 и четыре независимых side jobs 10+18+12+2; реальный keyboard/WASD/стрелки/E, возврат к центру. Доказательство именно Chromium SwiftShader, не реальный mobile/hardware. |
| G3 — SANDALS_GUARD | PASS на модели + Chrome | Ритуал управляется симуляционным временем, паузится при скрытой вкладке/модалке и не позволяет пройти радиусы 14м/6.5м вопреки запрету. |
| G4 — CONTENT_TYPE_SAFE | PASS автоматика; EDITORIAL HOLD | 42 Research ID — не 42 личных имени Бога. Unicode/type/provenance валидаторы работают, но независимой филологической/произносительной колляции и публикационного допуска нет. |
| G5 — UX_A11Y | PARTIAL, Firefox 8/8 short render PASS | Chromium keyboard and accessible reader pass. Windows Firefox 8/8 camera-only render smoke passes; Firefox physical journey, WebKit, touchscreen Android/iOS and screen-reader tests remain HOLD. |
| G6 — PERFORMANCE | Short physical RTX witness PASS; endurance/VRAM HOLD | RTX 3060 high 1440x900 DPR1: 8/8 zones reported 60 FPS in 2.4s samples, 27–163 draw calls, no lost context. No sustained VRAM/temperature or physical phone measurements. |
| G7 — RIGHTS_PROVENANCE | PASS только собственные визуальные ассеты; CONTENT HOLD | Реестр лицензий `docs/ASSET_LICENSES.md`; текст, исследовательские свидетельства и голос требуют отдельного допущения. |
| G8 — PRODUCT_ISOLATION | PASS | Изменения ограничены AuditRepo HOREB Draft PR #543; Product/Research, релиз и исходный Arena ZIP не менялись. |
| G9 — JOURNEY_AND_ART | ENGINEERING PASS; ZONE-4 ART FAIL, others HOLD | Current real camera witness reports 0/63 connected ravine-wall first hits on each of two views and explicit FAIL_CHASM_DEPTH_NOT_VISIBLE. Remaining galleries, Beersheba, Gethsemane, roof and all 42 compositions are not human art accepted. |
| G10 — LOW_POWER_SCENIC_CULL | PASS browser; DEVICE HOLD | Отсечение props/stele дальше 85м (low) /125м (high); ближние остаются, дальние не рендерятся, collider/42 E не изменены. SwiftShader evidence из #42642009842. |
| G11 — LIVE_QUALITY_REBUILD | PASS Chromium | Настоящий UI переключает low/high с новым keyed canvas, WebGL renderer, 42 atlases нужного разрешения и безопасным checkpoint/footwear. |
| G12 — REPEATED_WEBGL_LIFECYCLE | PASS Chromium; VRAM HOLD | high→low→high→low, old WebGL contexts lost, scene/listeners/zone/bush references detached, ровно один canvas. На двух последовательных low-моделях геометрии **57→57**, текстуры **15→15**; счётчики принадлежат отдельному WebGL-контексту и не являются измерением видеопамяти. |
| G13 — SIDE_PEDESTRIAN_EXHIBITS | PASS 42/42 Chromium exact code HEAD | [QA 42865777325](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42865777325): four independent side jobs (10+18+12+2) and full axial journey SUCCESS, plus 42 E dossiers. Real mobile route and art HOLD. |

## Протокол продолжения

Реальные `PASS` относятся **только** к указанному SHA и соответствующему тестовому режиму. Новый HEAD — новые проверки. Скриншоты программного рендеринга не означают художественного принятия или доказательства FPS на устройстве владельца; пользовательский ПК `DESKTOP-O3FDOA4` проверен Online 10.11.2026: короткий Chrome RTX 3060 и Firefox WebGL2 PASS; долговременная VRAM/thermal/mobile-приёмка отсутствует. Не увеличивать яркость Хорива, не менять `R_OUTER=14` и `R_INNER=6.5`, не публиковать 42 Research-досье без редакционного допуска.

Дальнейший приоритет: доказать физическую доступность боковых сюжетных объектов, доработать природность пещеры/колодца/рощи по реальным крупным кадрам, провести ручную A11y и аппаратную приёмку **только после восстановления стабильности**. Голос, права и филология — самостоятельные HOLD, не смешивать с инженерными PASS.

