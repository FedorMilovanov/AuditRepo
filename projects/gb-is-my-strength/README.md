# gb-is-my-strength / gospod-bog.ru

**Status:** 🟢 active / repair-in-progress — прод = main, работа идёт волнами W0–W10 (см. SUPER_AUDIT).
**Last source HEAD checked:** `14a49be83ab57212c0bbd26a8249b75ac026511d` (2026-07-06, fable-super-audit; на проде — run `28794737410`).

## Quick facts

- Source: `FedorMilovanov/gb-is-my-strength`
- Production: `https://gospod-bog.ru` (GitHub Pages, деплой из `dist/` strangler-сборки)
- Tech: Astro + strangler pattern (root legacy HTML + Astro dist), Pagefind, SW PWA
- In-flight зоны владельца: PremiumControls/Gill (freeze), глоссарий + Библия-тултипы

## Порядок чтения (текущая правда)

1. `verified/MASTER_BUG_MATRIX.md` — канон точечных багов (87 закрыто / 37 открыто).
2. `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` — канон системного бэклога: верифицированные находки (CI/даты/SW/security/Bible/семантика), опровергнутые старые формулировки (§1), план волн W0–W10 (§3).
3. `NEXT_AGENT_PROMPT.md` — handoff и правила для следующего агента.
4. `PremiumControls/README.md` — контракт in-flight зоны (owner).
5. Сырые доказательства: `incoming/fable-super-audit/2026-07-06/REPORT.md`, `incoming/arena-auditor/2026-07-06/`.

## Правила проекта (сжатие)

- SHA-first; один сабсистем на PR; закрытие только с fixture+fix+gates+witness.
- Паритет Astro↔legacy ≠ правда контента; зелёный шаг workflow ≠ доказательство.
- `[skip ci]` bot-HEAD не считается проверенным сам по себе.
- Старые audit-доки (в `archive/`) — только evidence, не текущая правда.

## История

Прежние статус-баннеры этого README (Pass 23, REG-001/REG-002, HEAD `e458581`) устарели:
REG-волна закрыта, актуальная история — в матрице и `archive/`.

**TTS-трек (не входит в W0–W10, отдельная линия работы, HEAD этого трека
на 2026-07-07: `e6f6628`, новее `14a49be8` выше — требует сверки с
основным каноном при следующем проходе):** Web Speech → vosk-tts (Apache
2.0, VITS+BERT), прямые пуши в `main` с явного разрешения пользователя,
4 раунда фиксов (D-23 регрессия деплоя, `ALLOWED_JS` gate, реально
неработавший из-за отсутствия CORS у `alphacephei.com` фетч модели —
перевезли на Hugging Face, подтверждено живым тестом из браузера).
Полная история: `incoming/vosk-tts-integration-2026-07-06/REPORT.md`.
Аудит качества голоса/фичи: `incoming/tts-quality-audit-2026-07-07/REPORT.md`
(из этого списка реально сделано: голос по умолчанию, версия кэша,
телеметрия, чанкинг, нормализация текста — сроки/века/сокращения).

**2026-07-08 — чистка за "Arena Agent" + 2 реальных фикса:** сторонний
проход того же трека закоммитил раздутый (10 773 строки, "продолжай"-
зацикливание) `audit/AUDIT_TTS_2026-07-08.md` **прямо в `gb-is-my-strength`**
(не в этот репо) двумя коммитами (`6fe1049`, `fe390d3`), причём сообщения
коммитов утверждают несуществующую работу (`git show --stat` на `6fe1049`
показывает единственный изменённый файл — сам аудит-документ, а не
заявленный пропатченный smoke-тест с `--real-tts`). Файл удалён из
`gb-is-my-strength` (`4b26455`). Первые ~170 строк документа (разделы 1–8)
оказались точными и попали в реальную работу: добавлена SHA-256-проверка
целостности модели (P0 из прошлого аудита) + досинхронизирован отставший
`gb-vosk-tts`. Полная разборка: `incoming/tts-quality-audit-2026-07-08-arena-agent-cleanup/REPORT.md`.

**2026-07-08 — CSP-фикс Xet-CDN + верификация V12-исследования (GPT-5.5).**
(1) Найдена корневая причина, почему Vosk НИ РАЗУ не играл в проде после
переезда на HF: CSP `connect-src` разрешал `huggingface.co`, но реальные
байты отдаёт редирект на `*.aws.cdn.hf.co` — браузер блокировал именно
редирект-цель. Fix `932230d` (добавлен `https://*.aws.cdn.hf.co` в 37 CSP-
компонентов + dist-fallback), деплой `47a5e89` зелёный. (2) Верифицировано
исследование GPT-5.5 по доставке модели (OPFS/resume/multi-tab/rollback):
факты о текущем коде подтверждены построчно, но большая архитектура осознанно
отклонена как несоразмерная (см. матрицу P1/P2 + `incoming/tts-delivery-
architecture-verification-2026-07-08/REPORT.md`). К внедрению: 1 UX-решение
владельца (неявная загрузка 280 МБ) + 2 не-дизайн улучшения.
