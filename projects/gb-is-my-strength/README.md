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
