# gb-is-my-strength / gospod-bog.ru

**Status:** 🟢 active / repair-in-progress — прод = main, работа идёт волнами W0–W10 (см. SUPER_AUDIT).
**Last source HEAD checked:** `14a49be83ab57212c0bbd26a8249b75ac026511d` (2026-07-06, fable-super-audit; на проде — run `28794737410`).

## Quick facts

- Source: `FedorMilovanov/gb-is-my-strength`
- Production: `https://gospod-bog.ru` (GitHub Pages, деплой из `dist/` strangler-сборки)
- Tech: Astro + strangler pattern (root legacy HTML + Astro dist), Pagefind, SW PWA
- In-flight зоны владельца: PremiumControls/Gill (freeze), глоссарий + Библия-тултипы

## Порядок чтения (текущая правда)

1. `verified/MASTER_BUG_MATRIX.md` — канон точечных багов; текущие open/closed counters меняются только через verifier.
2. `working/GILL_CONTENT_RESEARCH_MATRIX_2026-07-09.md` — **новая карта content/research-аудита серии Джона Гилла**, pending verifier; 480 evidence IDs, не входит в канонические счётчики.
3. `incoming/gpt-5-5-gill-content-research-audit/2026-07-09/REPORT.md` — governed intake/handoff; пять Gill routes + `Research/Джон Гилл/00–42`.
4. `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` — канон системного бэклога: верифицированные находки (CI/даты/SW/security/Bible/семантика), опровергнутые старые формулировки (§1), план волн W0–W10 (§3).
5. `NEXT_AGENT_PROMPT.md` — handoff и правила для следующего агента.
6. `PremiumControls/README.md` — контракт in-flight зоны (owner).
7. Сырые доказательства предыдущей волны: `incoming/fable-super-audit/2026-07-06/REPORT.md`, `incoming/arena-auditor/2026-07-06/`.

## Правила проекта (сжатие)

- SHA-first; один сабсистем на PR; закрытие только с fixture+fix+gates+witness.
- Паритет Astro↔legacy ≠ правда контента; зелёный шаг workflow ≠ доказательство.
- `[skip ci]` bot-HEAD не считается проверенным сам по себе.
- Старые audit-доки (в `archive/`) — только evidence, не текущая правда.
- Gill master-аудит — mixed-status corpus: direct findings, Research-only defects, disputed interpretations и HOLD нельзя без verifier превращать в один список repair-ready багов.

## История

Прежние статус-баннеры этого README (Pass 23, REG-001/REG-002, HEAD `e458581`) устарели:
REG-волна закрыта, актуальная история — в матрице и `archive/`.

**2026-07-09 — Gill content/research intake (GPT-5.5).** Проведён cumulative source/content-аудит пяти Gill routes и отдела `FedorMilovanov/Research/Джон Гилл/00–42` на source HEAD `08d9fd1` (functional `f5e000e`) и Research HEAD `58e1ea5`. Evidence corpus: 480 IDs, из них 75 P0/P0–P1 candidates и 101 явный HOLD/needs-source item. Созданы governed intake, working matrix и proposal на umbrella-интеграцию в canonical ledger; counters `verified/MASTER_BUG_MATRIX.md` намеренно не изменены до verifier synthesis. Full-master integrity manifest: `incoming/gpt-5-5-gill-content-research-audit/2026-07-09/artifacts/MASTER_ARTIFACT_MANIFEST.md`.

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

**2026-07-08 — CSP-фикс Xet-CDN + верификация V10/V12-исследований (GPT-5.5).**
(1) Найден **детерминированный CSP-дефект**, блокировавший холодную загрузку
модели после переезда на HF: CSP `connect-src` разрешал `huggingface.co`, но
реальные байты отдаёт редирект на `*.aws.cdn.hf.co` — браузер блокировал
именно редирект-цель. **Точная историческая доля затронутых сессий неизвестна**
(нет success/selected-engine телеметрии — только `vosk_tts_failed`), поэтому
«Vosk ни разу не работал» — правдоподобно, но строго не доказуемо (поправка из
V10 §4). Fix `932230d` (`https://*.aws.cdn.hf.co` в 37 CSP-компонентов +
dist-fallback), деплой `47a5e89` зелёный. (2) Верифицированы **два** документа
GPT-5.5: **V12** (доставка модели: OPFS/resume/multi-tab/rollback) и **V10**
(широкий CI/CD: размножение сборок, functional-vs-bot SHA, release-транзакция,
render truth, SW, z-index). Факты о текущем коде в обоих подтверждены
построчно; крупная перестройка осознанно отклонена как несоразмерная. Находки
V10 `W1-CI-24…30`: TTS/CSP-часть уже закрыта (`932230d`); системные —
дубликаты матрицы (`D-1` concurrency, `D-4` z-index, SW-drift); реально новое —
typed outcome-телеметрия + пин ревизии URL. Разбор: `incoming/tts-delivery-
architecture-verification-2026-07-08/REPORT.md`. К внедрению: 1 UX-решение
владельца (неявная загрузка 280 МБ) + 2 не-дизайн улучшения.