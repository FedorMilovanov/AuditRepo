# NEXT AGENT PROMPT — gb-is-my-strength

> **Только текущая операционная правда.** Статусы и счётчики багов принадлежат `verified/MASTER_BUG_MATRIX.md`; этот файл владеет точной границей source/deploy, активными владельцами и следующим порядком действий.

**Source main:** `a7b2f2b514a9745102ca88579bc0caad9a28754e`
**Exact production authority:** ✅ `a7b2f2b514a9745102ca88579bc0caad9a28754e`
**Current source deployment status:** ✅ source, release candidate, Pages/live pointer и TTS authority сходятся на одном точном SHA.
**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-31_a7b2f2b5_exact-production-home-closure.md`
**AuditRepo base used for this reconciliation:** `3213e449b41041a71c59bf581c276bb0a26d0c67`

## 1. Точная текущая граница

- source PR #551 влит как `a7b2f2b514a9745102ca88579bc0caad9a28754e`;
- Pixelmatch обновлён до `7.2.0`, загружается через контролируемый ESM-путь с `checkerboard: false`;
- Node/npm остаются закреплены на `22.23.1` / `10.9.8` во всех активных workflow и release-поверхностях;
- deploy run `30652948250`, attempt `1`, собрал один immutable candidate и продвинул те же самые байты;
- release SHA и control-plane SHA равны `a7b2f2b514a9745102ca88579bc0caad9a28754e`;
- candidate ID: `a7b2f2b514a9745102ca88579bc0caad9a28754e:30652948250-1`;
- candidate tree digest: `sha256:4b7b6e432e26ac1bdcbc62f56907309a5c3e2eb81cbd1abdafade960b6081e2f`;
- candidate files / bytes: `1150` / `81201894`;
- immutable live provenance: `/deployments/a7b2f2b514a9745102ca88579bc0caad9a28754e/30652948250-1.json`;
- candidate transport artifact: ID `8802579827`, `sha256:b4fa81fb2a95cc11b37f37fbc7655f69254f270466f221a388b13abf5f47b5ed`;
- generic live witness artifact: ID `8802590967`, `sha256:ec3dd58f7b584eb9b02763e2efdf0cf0029745c53ea25741f39b0cde6645abe0`;
- TTS live witness artifact: ID `8802591444`, `sha256:4057921a4b9da740720f5aa5466a4181ef66d0d9f0ddbb760982744885baa066`;
- source release-ledger comment: PR #551, comment `5146092545`.

## 2. Закрытие главной страницы

Премиальная нативная реализация `/` завершена в текущей ancestry. Принятая цепочка включает основной rebuild индекса, закрытие адаптивных крайних состояний, настоящее тире в H1, исправления исходных языков и ссылок, семантическую защиту буквицы и две последние поправки источников маргиналий.

PR #551 изменил только зависимость и lockfile Pixelmatch, функциональный migration-contract, контролируемый import-путь и документацию миграции. Все visual baselines сохранены; компоненты главной не переделывались и не заменялись. Не открывать MAIN INDEX заново без нового решения владельца и свежих browser/visual evidence.

## 3. Граница production evidence

```text
source main
= release SHA
= control-plane SHA
= live /deployments/current.json
= immutable run manifest
= generic live PASS
= TTS live PASS
```

Более поздний merge в source отменяет только заявление о текущем совпадении HEAD и production и требует нового reverify; он не отменяет это immutable release-свидетельство.

## 4. Активное владение — не пересекаться

Единственная оставшаяся защищённая независимая source-lane — Astro 7 phase one, PR #549. Не reset, rebase, force-push, close, delete и не поглощать её без явного handoff владельца. Эта синхронизация не владеет Astro 7.

## 5. Результат очистки

- в source `main` не осталось временных Node/Pixelmatch writer, exporter, bootstrap или transfer-файлов;
- в финальном diff AuditRepo отсутствуют временные workflow и writer;
- исторические raw intake и remote refs не удаляются молча: очистка остаётся evidence- и disposition-based;
- удаление ветки является housekeeping, а не доказательством корректности source или production.

## 6. Следующий порядок

1. Сохранять указанное exact production witness как immutable evidence.
2. Оставить Astro 7 его назначенному владельцу и после будущего merge потребовать свежий homepage parity.
3. После следующего merge в source `main` создать новый current-head reverify до заявления `source = production`.
4. Не менять счётчики матрицы из-за этой синхронизации: она согласует уже закрытый статус и текущую authority, а не создаёт новый переход класса бага.
