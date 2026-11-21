# Архив и повторная проверка #570

[ZIP с оригиналами](evidence/browser-traces.zip) · [манифест SHA‑256](evidence/browser-traces.zip.artifact.json) · [проверяющий](harness/verify-archive.py) · [ревизия](REPORT.md).

51 JSON и 17 вспомогательных PNG сохранены **без изменения байтов**. Путь члена ZIP: `projects/gb-is-my-strength/incoming/<имя секции ниже>/2026-11-18/evidence/<имя файла>`. Даже если старый SHA перестанет открываться после squash, ни он, ни отдельное хранилище для восстановления не нужны. [Исходный снимок для сверки](https://github.com/FedorMilovanov/AuditRepo/commit/3940425bb5371fa0590163686d04620d4d45dbe3).

## Проверить и восстановить

Из корня итогового checkout (или его копии без `.git`). Нужны Python 3 без зависимостей и, для примера проверки, `PRODUCT` с точной production-like сборкой `9edef94ece…`.

```bash
(
  set -euo pipefail
  I=projects/gb-is-my-strength/incoming
  AUDIT="$I/arena-quiz-draft-review/2026-11-18"
  F="$I/arena-quiz-resume-after-fragment/2026-11-18"
  SCRATCH=$(mktemp -d)
  python3 "$AUDIT/harness/verify-archive.py" --restore "$SCRATCH/tree"
  E="$SCRATCH/tree/$F/evidence"
  python3 "$F/harness/check-quiz-focus-replays.py" \
    "$E/quiz-focus-witness.json" "$E/quiz-focus-replay.json" \
    "$PRODUCT/dist" "$E/quiz-keyboard-witness.json" "$SCRATCH/focus-receipt.json"
  cmp "$SCRATCH/focus-receipt.json" "$F/evidence/quiz-focus-receipt.json"
  printf 'Восстановленные оригиналы: %s\n' "$SCRATCH/tree"
)
```

Восстановление само проверяет ZIP, имена, размеры, SHA и 48 пинов превью. Оно не пишет в checkout и не требует копировать весь `incoming`. В примере сценарий и эталон берутся из пакета, входные трассы — из распаковки. Для проверки без записи запустите `harness/verify-archive.py` из этого пакета без `--restore`.

`commands*.log` — журналы, не скрипты. Берите нужные шаги сборки/проверки, подставляйте абсолютные пути к распакованным трассам; для новых браузерных прогонов используйте раздельные чистые каталоги вывода. Для F24–F27, где сценарий использует поиск, нужны два дерева Pagefind 1.5.2 вне `dist`.

**Граница воспроизведения:** для побайтного пересчёта квитанций F22 и QNL нужны исходные B-кадры, которых нет в checkout: `before-search-390.png`, `solo-after-next-390.png` и `same-390-qe-key.png` соответственно. Их хеши остались в квитанциях. Равные байты нормализованных трасс, например F13, сами по себе также не подтверждают два запуска. Новый прогон создаёт новое свидетельство, а не байты старого.

## Ворота AuditRepo

В 29 журналах одинаковые команды приёмки заменены одной ссылкой. Индивидуальные команды сборки/браузера, точные SHA, возвратные коды и выводы остались в своих журналах. Для текущего diff ориентироваться на [Validate](../../../../../.github/workflows/auditrepo-validate.yml) и [Preflight](../../../../../.github/workflows/auditrepo-workflow-preflight.yml). В исходных блоках повторялась эта последовательность (в части журналов без отдельного workflow preflight):

```bash
AUDITREPO_CHANGED_PATHS_FILE="$CHANGED" python3 scripts/validate_audit_repo.py
python3 scripts/check_auditrepo_structure.py
python3 scripts/check_artifact_admission.py --changed-paths "$CHANGED"
python3 scripts/check_workflow_syntax.py
python3 scripts/matrix_coverage_regression_test.py
python3 scripts/check_matrix_coverage.py --project projects/gb-is-my-strength
git diff --cached --check
```

`CHANGED` — файл со строками путей проверяемого diff против его базы. Это проверки формата и состава пакета, не Product-приёмка.

## Указатель файлов

### `arena-quiz-accessibility`

- <a name="q-accessibility-keyboard-witness-json"></a>`keyboard-witness.json`

### `arena-quiz-active-playback`

- <a name="q-active-playback-active-playback-witness-json"></a>`active-playback-witness.json`

### `arena-quiz-editorial`

- <a name="q-editorial-browser-witness-json"></a>`browser-witness.json`

### `arena-quiz-home-search-focus`

- <a name="q-home-search-focus-home-search-focus-witness-replay-json"></a>`home-search-focus-witness-replay.json`
- <a name="q-home-search-focus-home-search-focus-witness-json"></a>`home-search-focus-witness.json`

### `arena-quiz-learning`

- <a name="q-learning-browser-witness-json"></a>`browser-witness.json`

### `arena-quiz-library-search-navigation`

- <a name="q-library-search-navigation-exact-link-1440-destination-png"></a>`exact-link-1440-destination.png`
- <a name="q-library-search-navigation-library-search-navigation-witness-replay-json"></a>`library-search-navigation-witness-replay.json`
- <a name="q-library-search-navigation-library-search-navigation-witness-json"></a>`library-search-navigation-witness.json`
- <a name="q-library-search-navigation-route-draft-390-back-png"></a>`route-draft-390-back.png`
- <a name="q-library-search-navigation-route-solo-390-selected-png"></a>`route-solo-390-selected.png`

### `arena-quiz-library-search-stack`

- <a name="q-library-search-stack-library-search-stack-witness-replay-json"></a>`library-search-stack-witness-replay.json`
- <a name="q-library-search-stack-library-search-stack-witness-json"></a>`library-search-stack-witness.json`
- <a name="q-library-search-stack-stacked-1440-png"></a>`stacked-1440.png`

### `arena-quiz-note-lifecycle`

- <a name="q-note-lifecycle-comment-followup-replay-json"></a>`comment-followup-replay.json`
- <a name="q-note-lifecycle-comment-followup-witness-json"></a>`comment-followup-witness.json`
- <a name="q-note-lifecycle-distinct-1440-distinct-after-reload-png"></a>`distinct-1440-distinct-after-reload.png`
- <a name="q-note-lifecycle-note-lifecycle-witness-json"></a>`note-lifecycle-witness.json`
- <a name="q-note-lifecycle-updated-note-is-absent-png"></a>`updated-note-is-absent.png`

### `arena-quiz-notes-handoff`

- <a name="q-notes-handoff-notes-witness-json"></a>`notes-witness.json`

### `arena-quiz-offline`

- <a name="q-offline-offline-witness-json"></a>`offline-witness.json`

### `arena-quiz-print-readiness`

- <a name="q-print-readiness-print-tail-witness-json"></a>`print-tail-witness.json`

### `arena-quiz-projection`

- <a name="q-projection-quiz-projection-witness-json"></a>`quiz-projection-witness.json`

### `arena-quiz-reader-adaptation`

- <a name="q-reader-adaptation-adaptation-witness-json"></a>`adaptation-witness.json`

### `arena-quiz-resume-after-fragment`

- <a name="q-resume-after-fragment-offer-variation-json"></a>`offer-variation.json`
- <a name="q-resume-after-fragment-pactum-1440-acted-png"></a>`pactum-1440-acted.png`
- <a name="q-resume-after-fragment-pactum-1440-offered-png"></a>`pactum-1440-offered.png`
- <a name="q-resume-after-fragment-quiz-focus-replay-json"></a>`quiz-focus-replay.json`
- <a name="q-resume-after-fragment-quiz-focus-witness-json"></a>`quiz-focus-witness.json`
- <a name="q-resume-after-fragment-quiz-keyboard-replay-json"></a>`quiz-keyboard-replay.json`
- <a name="q-resume-after-fragment-quiz-keyboard-witness-json"></a>`quiz-keyboard-witness.json`
- <a name="q-resume-after-fragment-quiz-push-replay-json"></a>`quiz-push-replay.json`
- <a name="q-resume-after-fragment-quiz-push-witness-json"></a>`quiz-push-witness.json`
- <a name="q-resume-after-fragment-resume-after-fragment-witness-replay-json"></a>`resume-after-fragment-witness-replay.json`
- <a name="q-resume-after-fragment-resume-after-fragment-witness-json"></a>`resume-after-fragment-witness.json`
- <a name="q-resume-after-fragment-resume-in-page-replay-json"></a>`resume-in-page-replay.json`
- <a name="q-resume-after-fragment-resume-in-page-witness-json"></a>`resume-in-page-witness.json`

### `arena-quiz-resume-focus`

- <a name="q-resume-focus-resume-focus-witness-replay-json"></a>`resume-focus-witness-replay.json`
- <a name="q-resume-focus-resume-focus-witness-json"></a>`resume-focus-witness.json`

### `arena-quiz-resume-label`

- <a name="q-resume-label-home-resume-dark-color-probe-png"></a>`home-resume-dark-color-probe.png`
- <a name="q-resume-label-resume-label-witness-replay-json"></a>`resume-label-witness-replay.json`
- <a name="q-resume-label-resume-label-witness-json"></a>`resume-label-witness.json`

### `arena-quiz-review-loop`

- <a name="q-review-loop-browser-witness-json"></a>`browser-witness.json`

### `arena-quiz-search-handoff`

- <a name="q-search-handoff-before-search-390-png"></a>`before-search-390.png`
- <a name="q-search-handoff-quiz-search-handoff-witness-replay-json"></a>`quiz-search-handoff-witness-replay.json`
- <a name="q-search-handoff-quiz-search-handoff-witness-json"></a>`quiz-search-handoff-witness.json`

### `arena-quiz-search-recent-return`

- <a name="q-search-recent-return-ab-390-manual-png"></a>`ab-390-manual.png`
- <a name="q-search-recent-return-ab-390-recovered-png"></a>`ab-390-recovered.png`
- <a name="q-search-recent-return-ba-1440-replayed-png"></a>`ba-1440-replayed.png`
- <a name="q-search-recent-return-mixed-1440-recent-png"></a>`mixed-1440-recent.png`
- <a name="q-search-recent-return-search-recent-return-witness-replay-json"></a>`search-recent-return-witness-replay.json`
- <a name="q-search-recent-return-search-recent-return-witness-json"></a>`search-recent-return-witness.json`

### `arena-quiz-search-resume-route`

- <a name="q-search-resume-route-home-390-card-png"></a>`home-390-card.png`
- <a name="q-search-resume-route-home-390-landing-png"></a>`home-390-landing.png`
- <a name="q-search-resume-route-other-preview-1440-palette-png"></a>`other-preview-1440-palette.png`
- <a name="q-search-resume-route-search-resume-route-witness-replay-json"></a>`search-resume-route-witness-replay.json`
- <a name="q-search-resume-route-search-resume-route-witness-json"></a>`search-resume-route-witness.json`

### `arena-quiz-source-follow`

- <a name="q-source-follow-source-follow-witness-replay-json"></a>`source-follow-witness-replay.json`
- <a name="q-source-follow-source-follow-witness-json"></a>`source-follow-witness.json`

### `arena-quiz-source-history`

- <a name="q-source-history-source-history-witness-replay-json"></a>`source-history-witness-replay.json`
- <a name="q-source-history-source-history-witness-json"></a>`source-history-witness.json`

### `arena-quiz-source-readerstate`

- <a name="q-source-readerstate-source-readerstate-witness-replay-json"></a>`source-readerstate-witness-replay.json`
- <a name="q-source-readerstate-source-readerstate-witness-json"></a>`source-readerstate-witness.json`

### `arena-quiz-source-resume`

- <a name="q-source-resume-source-resume-witness-replay-json"></a>`source-resume-witness-replay.json`
- <a name="q-source-resume-source-resume-witness-json"></a>`source-resume-witness.json`

### `arena-quiz-source-search`

- <a name="q-source-search-search-witness-json"></a>`search-witness.json`

### `arena-quiz-source-tabs`

- <a name="q-source-tabs-source-tabs-witness-replay-json"></a>`source-tabs-witness-replay.json`
- <a name="q-source-tabs-source-tabs-witness-json"></a>`source-tabs-witness.json`
