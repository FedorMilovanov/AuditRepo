# Системная проверка: TTS recovery/status lifecycle

Дата: 2026-10-23  
Product anchor: `caeb92c839ff4b4f2838a0ad44a582034c41c8d4`  
AuditRepo checkpoint input: `0d071a7255939169e59045477d294c9713aa778c`  
Режим: read-only causal consolidation; Product не изменялся

## Итог

Три текущие TTS-строки являются разными наблюдаемыми проявлениями одного end-to-end владельца состояния enhanced/system voice:

- `GBS-TTS-WORKER-DEPENDENCY-RETRY-STICKY-FAILURE`;
- `GBS-TTS-FALLBACK-STATUS-FALSE-SUCCESS`;
- `GBS-TTS-NOTICE-STALE-REMOVAL-TIMER`.

Они поглощены новой system lane `SYS-TTS-RECOVERY-STATUS-OWNERSHIP`. Это не группировка по слову TTS: source trace показывает одну цепочку `worker attempt → client phase → notice/status → retry/fallback`, в которой асинхронные владельцы не имеют общего attempt/generation contract.

MASTER меняется с 45 на 43 work units: три direct symptoms заменены одним system owner.

## Общий текущий механизм

### Worker dependency attempt

`js/vosk-tts-worker.js` хранит process-wide состояние:

```text
state.dependencies
state.loading
state.ready
state.phase/statusDetail
```

`ensureDependencies()` возвращает `state.dependencies`, если Promise уже существует. Promise устанавливается до `importScripts(...)`, но rejected path не очищает его. Поэтому новый `ensure` после восстановления CDN повторно получает прежний reject и не создаёт новый dependency attempt.

### Client load/retry and projected phase

`js/vosk-tts-engine.js` хранит параллельное состояние:

```text
state.loading / loadSequence / loadRequests
state.ready / worker / workerMode
state.status
state.notice / noticeTimer
```

`retryLoading()` может очистить client `state.loading`, но не сбрасывает rejected `state.dependencies` внутри живого SharedWorker/DedicatedWorker. UI Retry поэтому не означает новый end-to-end attempt.

`showStatus()` самостоятельно переводит worker/model phase в user-facing утверждение о системном голосе. Error/cancelled/loading branches пишут «Системный голос … работает/продолжает работать», хотя worker status не несёт доказательства `speechSynthesis.onstart` или audible fallback.

`hideNotice()` отслеживает только внешний timer. После его срабатывания внутренний 360 ms callback владеет удалением старого DOM node без generation check. Новый `showStatus()` переиспользует этот node, но не отменяет внутреннее удаление, поэтому более новое loading/disabled state исчезает.

## Почему это один repair owner

Во всех трёх случаях более старое или неполное состояние переживает новую пользовательскую попытку:

1. rejected worker Promise переживает Retry;
2. предположение о fallback переживает actual native synthesis error;
3. stale removal callback переживает новое notice state.

Ни один симптом не требует route-local TTS правок. Общие владельцы ограничены enhanced voice worker, client engine и уже существующим reader↔engine fallback status contract.

Repair может оставаться модульным, но обязан ввести один согласованный lifecycle invariant:

- каждая load/retry generation имеет identity;
- terminal failure освобождает retryable single-flight state на правильном owner layer;
- поздние callbacks предыдущей generation не меняют текущий phase/notice;
- user-facing fallback claim возникает только из actual native start/working evidence, а error/no-voice не превращается в reassurance;
- SharedWorker peer lifecycle и model cache не уничтожаются для восстановления одной dependency attempt.

## Свидетели проявлений

### Retry remains poisoned

Предыдущая native browser/worker проверка доказала для real SharedWorker и DedicatedWorker capability control:

- первый `importScripts` dependency failure;
- восстановление pinned fflate/ORT delivery;
- UI Retry даёт 0 новых imports и 0 model requests;
- точечный reset только failed dependency state запускает реальный новый import и запрос исходного model URL.

Это отделяет state defect от model ZIP bytes, IDB corruption и client retirement.

### False fallback success

16 native click/tap profiles дали actual synthesis failure, `phase=error`, `onstart=0`, но notice утверждал, что системный голос продолжает работать. Наличие Web Speech API, Blob либо resolved mock play не использовалось как доказательство audible speech.

Причина CDN/OS voice недоступности в среде не объявляется Product defect. Дефект — точное ложное утверждение после уже известного error.

### Stale notice removal

Browser timing boundary доказал:

- 4/4 profiles теряют новое Disabled/Enable state;
- 4/4 quick-Enable profiles теряют Loading/Cancel при открытом HTTP request;
- 8/8 before/after controls сохраняют notice;
- источник — inner 360 ms removal после outer timer, а не недостаточная задержка.

## Bounded closure

System lane закрывается только совместным resulting-main proof:

1. Failed first dependency import + restored real delivery + UI Retry создаёт новый attempt в SharedWorker и DedicatedWorker.
2. Concurrent peers сохраняют single-flight; retry одного failed attempt не требует удаления model/favorites cache и не завершает здоровых peers.
3. Native fallback проходит состояния requested/started/working/error/no-voice; UI не сообщает success до actual start и не сохраняет reassurance после error.
4. Notice callbacks generation-safe: новый disabled/loading/cancel/error/ready state нельзя удалить callback-ом предыдущего state.
5. Cancel остаётся AbortSignal-backed, persistent opt-out сохраняется, unrelated storage не очищается.
6. Model integrity guard и actual inference/audibility checks остаются отдельными обязательными доказательствами; «модель загружена» не равно «звук прозвучал».
7. Class-level deterministic fixture покрывает transition table и late-event rejection; browser proof покрывает настоящие Worker/SharedWorker/native events.

## Collision boundary

Из открытых Product PR только #2179 касается TTS по имени, но меняет исключительно `.github/workflows/tts-*.yml` в dependency bump. Текущие source owners `js/vosk-tts-engine.js` и `js/vosk-tts-worker.js` открытыми PR не изменяются.

#2179 всё равно является workflow collision для будущего Product PR: нельзя одновременно менять его action pins или закрывать/переписывать этот PR без отдельного решения. Перед mutation file-list check повторяется.

## Что не поглощено

- `SYS-TTS-ORT-PATH-CONTRACT-FALSE-RED` остаётся отдельным verification/control-plane defect: он относится к mutation fixture и shell pipeline semantics, а не runtime lifecycle.
- Ранее закрытый `TTS-SHAREDWORKER-CLIENT-LIFECYCLE` не переоткрывается: current retry defect находится в dependency-attempt reset, а не в retirement/disconnect ownership.
- Причины недоступности CDN/OS voice в sandbox не классифицируются как Product defect.
- Коррупция model archive не заявляется: bytes/integrity/inference evidence этого не доказали.

## Источники

- `../reverify/2026-10-23-play-tts-download-audit.md`;
- `../reverify/evidence/2026-10-23-tts-native-play.json`;
- `../reverify/evidence/2026-10-23-tts-worker-retry.json`;
- `../reverify/evidence/2026-10-23-tts-cancel-notice-race.json`;
- `../reverify/2026-10-23-resulting-main-c18-reconciliation.md`;
- current source `js/vosk-tts-engine.js`, `js/vosk-tts-worker.js` at Product `caeb92c`.
