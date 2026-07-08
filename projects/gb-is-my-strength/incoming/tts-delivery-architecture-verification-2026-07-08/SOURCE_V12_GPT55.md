# GB CI/CD — единый глубокий отчёт V12  
## Большая браузерная модель: OPFS, resumable delivery, multi-tab coordination, безопасная распаковка и versioned rollback

**Статус:** исследование и архитектурный план; репозитории не изменялись  
**Дата повторной проверки:** 2026-07-08  
**Source repository:** `FedorMilovanov/gb-is-my-strength`  
**Audit repository:** `FedorMilovanov/AuditRepo`

```text
Текущий main/source HEAD:
74b424a0414a78b5b60958ea723efc3ba3b5c768

Последний функциональный HEAD:
a145834ab3cb3fbedea1740547b77e91c71fdfbf

TTS production-incident anchor:
932230d31ebe13bd219a2fe7293e512ce90719b5

TTS bot/cache-bust successor:
47a5e899f2b6a874749fcf707140269a3f665fae

Текущий AuditRepo SHA:
55c820601d1957e85c9c925ad4b214580618bcf5
```

`74b424a0` — bot-коммит после функционального `a145834a`. Сравнение показывает generated
metadata/cache-bust fan-out; TTS loader и TTS controller после зафиксированного CSP-инцидента не
менялись. Поэтому V12 применим к актуальному `main`.

---

# 0. Назначение V12

V11 доказал, что внешний TTS нельзя считать рабочим, проверив только URL, CORS, SHA-256 или
наличие звука. Нужна цепочка:

```text
production CSP
→ redirect closure
→ exact provider revision
→ delivered bytes
→ cache version
→ ONNX initialization
→ фактически выбранный engine
```

V12 углубляет следующий слой:

> Как реально доставить и хранить модель около 280 МБ в браузере, не скачивать её несколько раз
> в разных вкладках, не удерживать гигантский ZIP целиком в памяти, уметь продолжать оборванную
> загрузку, безопасно обновлять версию и не превращать rollback в смесь старых и новых файлов.

Главные новые выводы:

1. текущий первый PLAY незаметно запускает фоновую загрузку около 280 МБ;
2. каждая вкладка имеет собственный `_voskWarmupStarted`, поэтому межвкладочной дедупликации нет;
3. IndexedDB сейчас используется одновременно как data plane и metadata plane;
4. текущая загрузка не возобновляется после закрытия вкладки или сетевого обрыва;
5. `resolve/main` и URL-only cache key не дают корректной version identity;
6. `response.arrayBuffer()` + `unzipSync()` создают лишнее пиковое потребление памяти;
7. Background Fetch нельзя считать production foundation из-за ограниченной поддержки;
8. лучшая текущая архитектура — **OPFS data plane + IndexedDB atomic control plane**;
9. resumability должна опираться на exact revision и chunk manifest, а не только на `If-Range`;
10. модель следует публиковать как immutable generation и делать видимой только после полного
    verification commit.

---

# ЧАСТЬ I. ФАКТИЧЕСКИЙ ТЕКУЩИЙ ПОТОК

## 1. Первый пользовательский клик

Controller делает следующее:

```text
если Vosk уже ready:
  использовать Vosk

иначе, если Web Speech доступен:
  мгновенно использовать Web Speech
  параллельно вызвать warmVoskInBackground()

иначе:
  ждать загрузку Vosk
```

Это означает:

```text
первый PLAY
→ пользователь слышит системный голос
→ браузер без отдельного подтверждения начинает загрузку модели около 280 МБ
```

В текущем коде есть только локальный флаг:

```text
_voskWarmupStarted
```

Он предотвращает повторный warm-up в одной JS-копии страницы, но не координирует:

- вторую вкладку;
- второе окно;
- другой worker;
- страницу, открытую до обновления release;
- повторный визит после аварийно оборванной загрузки.

## 2. Текущая data path

```text
fetch(MODEL_URL)
→ response.arrayBuffer()
→ SubtleCrypto.digest(full buffer)
→ fflate.unzipSync(full archive)
→ extracted Uint8Array files
→ IndexedDB.put(extracted object)
→ TextDecoder
→ VITS ONNX session
→ BERT ONNX session
```

Ключ IndexedDB:

```text
MODEL_URL
```

URL:

```text
.../resolve/main/model-quant.zip
```

## 3. Текущие failure boundaries

```text
CSP
redirect host
CORS
network
HTTP
arrayBuffer allocation
SHA-256
ZIP parsing
required file discovery
IndexedDB transaction
ORT script
ORT WASM
VITS session
BERT session
audio playback
```

Большинство ошибок сейчас заканчиваются:

```text
console.warn
analytics goal с raw reason
Web Speech fallback
```

Это сохраняет базовую озвучку, но маскирует качество внешнего engine и не создаёт корректной
download/cache state machine.

---

# ЧАСТЬ II. НОВЫЙ P0/P1: НЕЯВНАЯ ЗАГРУЗКА 280 МБ

## 4. Почему это не только performance issue

Фоновая загрузка большой модели после обычного нажатия PLAY имеет четыре разных значения:

```text
данные мобильного тарифа
длительная сеть
сотни мегабайт browser storage
нагрузка CPU/памяти на hash и unzip
```

Пользователь нажал «слушать», а не обязательно согласился загрузить большой offline model pack.

## 5. Правильный UX contract

Cold first play:

```text
PLAY
→ системный голос начинает говорить сразу
→ UI предлагает:
   «Улучшенный голос — загрузка около 280 МБ один раз»
→ действия:
   [Скачать улучшенный голос]
   [Оставить системный голос]
```

Вариант настройки:

```text
Улучшенный голос:
  Не загружен
  Загружается 43%
  Пауза
  Продолжить
  Готов
  Удалить 280 МБ
```

## 6. Save-Data и connection hints

`navigator.connection.saveData === true` — сильный сигнал не начинать автоматическую большую
загрузку.

Но Network Information API имеет ограниченную поддержку, поэтому:

```text
saveData/effectiveType = подсказка
explicit user choice   = authority
```

Нельзя:

```text
«4g» → автоматически считать сеть бесплатной/Wi-Fi
```

Браузер не даёт универсального надёжного определения тарифа.

## 7. Storage preflight

Перед пользовательским подтверждением:

```js
const estimate = await navigator.storage.estimate();
const persistent = await navigator.storage.persisted();
```

UI может показать:

```text
Размер загрузки: ~280 МБ
Доступно для сайта: оценочно ...
Хранилище: persistent / best-effort
```

Но `estimate()` возвращает оценку, а не гарантию. Запись всё равно обязана обрабатывать
`QuotaExceededError`.

## 8. Persistence request

После явного пользовательского действия можно вызвать:

```js
await navigator.storage.persist();
```

Результат может быть `false`; загрузка всё равно возможна, но UI и cache policy должны понимать,
что данные могут быть удалены браузером под storage pressure.

Нельзя запрашивать persistence скрытно на каждой странице или считать отказ fatal.

---

# ЧАСТЬ III. КООРДИНАЦИЯ НЕСКОЛЬКИХ ВКЛАДОК

## 9. Реальный риск

Две вкладки одного сайта могут одновременно решить:

```text
cache miss
→ обе начинают 280 МБ fetch
→ обе hash/unzip
→ обе пишут IndexedDB
```

Даже если IndexedDB последнюю запись сериализует, сеть, CPU и память уже были потрачены дважды.

## 10. Web Locks — единственный writer

Lock name должен включать immutable generation:

```text
gb-vosk-model:<revision>:<archiveSha256>
```

Псевдокод:

```js
await navigator.locks.request(lockName, { mode: "exclusive" }, async () => {
  // Вкладка могла ждать, пока другая уже всё завершила.
  const current = await readCommittedGeneration();
  if (current?.revision === targetRevision && current.status === "ready") {
    return current;
  }

  return downloadVerifyPublish(targetManifest);
});
```

Критическое правило:

> После получения lock всегда повторно читать committed state.

Иначе queued tab скачает модель второй раз после того, как первый writer уже закончил.

## 11. BroadcastChannel — прогресс наблюдателям

Канал:

```text
gb-vosk-model-progress:<revision>
```

Writer публикует:

```json
{
  "phase": "downloading",
  "downloadedBytes": 125829120,
  "totalBytes": 293601280,
  "percent": 42.8
}
```

Другие вкладки:

- не скачивают;
- показывают тот же прогресс;
- могут начать использовать generation после `ready`;
- не должны принимать BroadcastChannel как source of truth.

Source of truth:

```text
IndexedDB committed manifest
```

BroadcastChannel — только notification.

## 12. Почему не localStorage lock

Самодельный lock в localStorage имеет проблемы:

- race между read/write;
- stale owner после crash;
- clock skew;
- нет автоматического release;
- сложная fairness;
- нет worker coordination.

Web Locks освобождает lock после завершения task/context и координирует вкладки и workers одного
origin.

## 13. Crash recovery

Если writer/tab закрылся:

```text
Web Lock освобождается
staging files остаются
committed pointer не меняется
```

Следующий writer:

1. получает lock;
2. читает staging manifest;
3. проверяет revision, chunk bitmap и file sizes;
4. продолжает или удаляет staging;
5. никогда не объявляет staging готовым без verification commit.

---

# ЧАСТЬ IV. OPFS КАК DATA PLANE

## 14. Почему OPFS лучше для больших binary files

OPFS предназначен для origin-private storage и оптимизирован для низкоуровневого file access.
В Dedicated Worker доступны synchronous access handles с:

```text
read
write at offset
truncate
flush
getSize
close
```

Это именно тот primitive, который нужен для:

- streaming download;
- resume с offset;
- partial files;
- large binary;
- extraction output;
- отсутствие гигантских JS object graphs в IndexedDB.

## 15. Разделение data plane и control plane

### OPFS — data plane

```text
archive chunks
partial download
extracted ONNX files
dictionary
config
vocab
temporary generation
```

### IndexedDB — control plane

```text
generation manifest
download bitmap
state
failure code
current committed pointer
schema version
timestamps
compatibility
```

Почему это важно:

```text
OPFS не является общей транзакцией вместе с IndexedDB
```

Поэтому commit должен строиться так, чтобы readers видели только полностью готовую generation.

## 16. Директории

```text
/opfs/gb-vosk/
  staging/
    <generation-id>/
      archive.part
      model.onnx.part
      bert-model.onnx.part
      dictionary.part
      config.json.part
      vocab.txt.part
  generations/
    <revision>-<manifestDigest>/
      model.onnx
      bert/model.onnx
      dictionary
      config.json
      bert/vocab.txt
```

Не следует рассчитывать на атомарный rename directory во всех браузерах.

## 17. Atomic publish без предположения об atomic rename

Алгоритм:

```text
1. записать всё в staging generation;
2. flush каждого файла;
3. проверить размеры/hashes/structure;
4. закрыть handles;
5. записать immutable generation manifest;
6. в одной IndexedDB transaction:
   - add generation status=ready
   - set currentGeneration=<id>
7. readers используют только ID из committed pointer;
8. orphan staging чистится позднее.
```

Даже если tab падает на шагах 1–5:

```text
currentGeneration не изменён
```

Даже если cleanup не произошёл:

```text
пользователь получает предыдущую ready generation
```

## 18. Нельзя удалять текущую generation до commit новой

Update policy:

```text
old generation READY
new generation STAGING
→ new verified
→ pointer switches
→ old generation becomes RETIRED
→ cleanup later
```

Никакого:

```text
delete old
→ download new
```

Иначе временная network ошибка лишает пользователя уже работающего Vosk.

---

# ЧАСТЬ V. RESUMABLE DOWNLOAD

## 19. Exact immutable URL — обязательная основа

Resume нельзя надёжно строить поверх:

```text
resolve/main
```

Нужен:

```text
resolve/<FULL_PROVIDER_COMMIT_SHA>/model-quant.zip
```

Тогда объект логически immutable, а revision входит в manifest и storage generation.

## 20. Почему `If-Range` не является хорошей cross-origin основой

`If-Range` полезен для resume mutable URL с ETag/Last-Modified.

Но в браузерном cross-origin request:

- `Range` с одним byte range является CORS-safelisted request header;
- `If-Range` не входит в safelist и потребует preflight;
- provider/CDN может не разрешить `If-Range`;
- `ETag` и `Content-Range` не являются CORS-safelisted response headers;
- чтобы JS их прочитал, server должен выдать `Access-Control-Expose-Headers`.

Поэтому архитектура не должна зависеть от того, что чужой CDN навсегда разрешит:

```text
If-Range
ETag
Content-Range visibility
```

## 21. Безопасный минимум

Для resume требуется:

```text
exact revision URL
known expected total bytes
single Range request
status 206
expected response body length
final/chunk integrity
```

Желательно:

```text
exposed Content-Range
strong ETag
Accept-Ranges: bytes
```

Если `Content-Range` нельзя прочитать, строгая политика:

```text
не продолжать arbitrary partial file
→ удалить partial
→ начать exact generation заново
```

Более агрессивный resume возможен только через заранее проверенный chunk manifest.

## 22. Лучший вариант: trusted chunk manifest

При публикации модели генерируется:

```json
{
  "archiveSha256": "...",
  "archiveBytes": 293601280,
  "chunkSize": 8388608,
  "chunks": [
    {
      "index": 0,
      "offset": 0,
      "length": 8388608,
      "sha256": "..."
    }
  ]
}
```

Manifest:

- versioned;
- хранится в основном repository;
- привязан к provider revision;
- входит в release dependency digest.

## 23. Streaming + chunk verification

Первый download:

```text
один обычный full GET
→ Response.body stream
→ накапливать только fixed chunk, например 8 MiB
→ SHA-256 chunk через SubtleCrypto
→ сравнить manifest
→ записать chunk в OPFS at offset
→ flush/mark bitmap
→ продолжить
```

Преимущество:

- не 35 отдельных запросов при хорошем соединении;
- только один chunk в памяти;
- каждый committed chunk уже проверен;
- progress точный;
- interruption безопасна.

## 24. Resume после interruption

```text
последний verified chunk = N
offset = (N + 1) * chunkSize
Range: bytes=<offset>-
```

Response:

```text
status должен быть 206
```

Если status `200`:

```text
AbortController.abort()
не дописывать full body к partial file
начать отдельную полную загрузку после очистки
```

Stream снова режется на manifest chunks и проверяется.

## 25. Почему chunk verification заменяет giant full-memory hash

Если:

- manifest trusted;
- revision exact;
- every fixed chunk hash matched;
- chunk count/length/order exact;

то браузер доказал соответствие всего архива trusted chunk manifest без удержания 280 МБ в
одном ArrayBuffer.

Canonical full archive SHA-256 остаётся:

- в publication manifest;
- в AuditRepo;
- в full DEEP verification;
- в release evidence.

Но browser runtime не обязан вызывать `digest()` для всего 280-МБ buffer.

## 26. Content encoding

Range offsets должны относиться к тем же байтам, по которым создан chunk manifest.

Contract должен требовать:

```text
no unexpected Content-Encoding
```

Для уже сжатого ZIP CDN не должен дополнительно менять representation.

Если encoding differs:

```text
resume disabled
full delivery rejected or handled through controlled same-origin delivery
```

## 27. Parallel range chunks

Не следует сразу запускать 8–16 параллельных Range requests.

Риски:

- provider throttling;
- лишние presigned redirects;
- memory pressure;
- сложнее cancellation;
- mobile radio/battery;
- disorder/repair complexity.

Начать с:

```text
один stream
или максимум 2 sequential/pipelined chunks
```

Увеличивать только после измерения.

---

# ЧАСТЬ VI. BACKGROUND DOWNLOAD И PAGE LIFECYCLE

## 28. Background Fetch не является обязательной основой

Background Fetch предназначен для больших загрузок, которые должны продолжаться после закрытия
страницы, но API остаётся experimental/limited availability.

Следовательно:

```text
Background Fetch = optional progressive enhancement
OPFS resume       = обязательный portable foundation
```

## 29. Service Worker тоже не должен держать 280-МБ task

Длительная загрузка в Service Worker ненадёжна: браузер контролирует lifetime worker и может его
остановить.

Service Worker responsibilities:

```text
app shell
same-origin static assets
release identity
```

Model responsibilities:

```text
page/dedicated worker
Web Lock
OPFS
resumable manifest
```

## 30. Когда вкладка закрывается

Worker получает lifecycle termination; текущий chunk может остаться неполным.

Записывать нужно:

```text
только verified complete chunks
```

Partial current chunk:

```text
не отмечать bitmap
при resume перезаписать с chunk boundary
```

Так не нужен сложный mid-chunk cryptographic checkpoint.

## 31. Pause/cancel

UI cancel:

```text
AbortController.abort()
terminate decompression worker if active
flush only verified chunks
state = paused | cancelled
BroadcastChannel update
release Web Lock
```

`cancelled` не обязательно удаляет verified chunks. Пользователь может выбрать:

```text
Пауза
Удалить загрузку
```

---

# ЧАСТЬ VII. ZIP EXTRACTION SECURITY

## 32. Текущая проблема

Current loader использует:

```text
unzipSync(full Uint8Array)
```

Даже при filter archive может:

- заявлять неверные sizes;
- содержать duplicate logical paths;
- использовать path traversal;
- иметь огромный compression ratio;
- создавать больше output, чем ожидалось;
- блокировать main thread.

## 33. Hash не отменяет extraction limits

Pinned archive hash сильно снижает риск злонамеренной подмены.

Но limits всё равно нужны против:

- ошибочно опубликованной модели;
- повреждённого manifest;
- dependency bug;
- будущего model update;
- supply-chain compromise выше уровня archive.

## 34. Exact path allowlist

Разрешены только normalized exact paths:

```text
model.onnx
dictionary
config.json
bert/model.onnx
bert/vocab.txt
```

Не suffix match вида:

```text
evil/model.onnx
```

если он не предусмотрен manifest.

Normalization rejects:

```text
..
absolute path
backslash variants
NUL
duplicate normalized path
unexpected directory
```

## 35. Resource budgets

Manifest содержит:

```text
maxArchiveBytes
maxFileCount
maxTotalExtractedBytes
perFile min/max
allowed compression methods
```

Во время stream extraction считаются реальные output bytes.

Нельзя полагаться только на `originalSize`, потому что ZIP metadata может отсутствовать или быть
недостоверной.

## 36. Worker extraction

fflate предоставляет:

- streaming unzip;
- asynchronous APIs через Workers;
- cancellation;
- file-level filter;
- output chunks.

Целевая цепь:

```text
OPFS archive stream
→ dedicated extraction worker
→ streaming Unzip
→ exact path check
→ output byte budget
→ OPFS target files
→ per-file chunk hash/size
→ flush
```

## 37. Лучший долгосрочный вариант — отказаться от giant ZIP

Публиковать отдельно:

```text
model.onnx
bert/model.onnx
dictionary
config.json
bert/vocab.txt
```

Каждый файл:

```text
exact revision
content-addressed path
SHA-256
byte length
independent resumability
```

Преимущества:

- нет giant archive buffer;
- нет unzip;
- меньше peak memory;
- проще resume;
- проще partial update;
- проще cache repair;
- можно загружать BERT отдельно.

---

# ЧАСТЬ VIII. STAGED MODEL READINESS

## 38. Текущая модель уже допускает BERT optional

Loader проверяет наличие BERT и создаёт `bertSess`, если files присутствуют.

Это позволяет рассмотреть две явные capabilities:

```text
VOSK_CORE_READY
VOSK_ENHANCED_READY
```

Но нельзя молча назвать core-режим полным качественным Vosk.

## 39. Возможная staged delivery

### Stage 1

```text
VITS model
dictionary
config
```

Результат:

```text
улучшенный локальный голос без BERT enhancement
```

### Stage 2

```text
BERT model
vocab
```

Результат:

```text
полное качество с BERT stress/context enhancement
```

UI:

```text
Системный голос
Улучшенный голос — базовый
Улучшенный голос — полный
```

## 40. Почему это требует отдельного quality decision

Переход к core-first меняет:

- произношение;
- ударения;
- first-ready time;
- storage;
- product promise.

Поэтому это не техническая «оптимизация по умолчанию», а owner-approved product experiment с
audio A/B и известным corpus.

## 41. ONNX external data

ONNX Runtime Web поддерживает external data:

```js
InferenceSession.create(modelBlobOrUrl, {
  externalData: [
    {
      path: "./weights.data",
      data: blobOrUrl
    }
  ]
})
```

Это даёт официальный путь для разделения graph и weights, если модель будет перепакована.

Для текущей модели проще сначала разделить уже существующие VITS/BERT files, а не немедленно
перегенерировать ONNX external data.

---

# ЧАСТЬ IX. VERSIONED GENERATIONS И ROLLBACK

## 42. Generation identity

```text
generationId =
modelRevision
+ dependencyManifestDigest
+ archive/chunkManifestDigest
+ cacheSchema
+ ORT compatibility
```

Пример:

```text
hf-4b1f...__manifest-91a2...__schema3__ort1.19.2
```

## 43. States

```text
ABSENT
CONSENT_REQUIRED
STAGING
PAUSED
VERIFYING
EXTRACTING
INITIALIZING
READY
RETIRED
CORRUPT
FAILED
```

Только `READY` может быть current pointer.

## 44. Retention policy

Минимально:

```text
current READY generation
previous READY generation, если хватает storage
active STAGING generation
```

Cleanup order под давлением:

```text
orphan staging
old corrupt
retired older than grace period
previous ready
current ready — только по явному user delete/eviction
```

## 45. Old tabs и новая generation

Старая вкладка может уже держать ONNX sessions в памяти.

После commit новой generation:

- старый loaded session продолжает работать;
- новые sessions используют current generation;
- OPFS old generation удаляется не немедленно;
- BroadcastChannel сообщает `generation-updated`;
- forced reload не требуется.

## 46. Rollback приложения

Если новый release возвращается к старой model revision:

```text
current app manifest требует OLD
→ если OLD generation retained и READY:
     переключить pointer
→ иначе:
     download OLD exact revision
```

Нельзя связывать rollback только с «последним cache entry».

## 47. Rollback model manifest

Release ledger хранит:

```json
{
  "siteSourceSha": "...",
  "modelGeneration": "...",
  "dependencyManifestDigest": "...",
  "chunkManifestDigest": "...",
  "runtimeVersions": {
    "ort": "1.19.2",
    "fflate": "0.8.2"
  }
}
```

---

# ЧАСТЬ X. SERVICE WORKER COHERENCE

## 48. Один model owner

Не следует одновременно хранить модель:

```text
Service Worker Cache API
и
IndexedDB/OPFS
```

Это удваивает storage и создаёт две competing eviction/version policies.

Рекомендация:

```text
модель и partial chunks → OPFS
metadata/pointer        → IndexedDB
SW                      → не кэширует model/CDN responses
```

## 49. SW bypass contract

Для model/provider requests Service Worker:

```text
не cache.put
не stale-while-revalidate
не преобразует Range
не возвращает opaque cached response
```

Browser network evidence должен подтверждать, что модель не пришла из старого SW cache.

## 50. App release vs model generation

Site release и model generation связаны manifest, но обновляются раздельно:

```text
site release может измениться без 280 МБ redownload
model revision change обязан создать новую generation
```

Это предотвращает бессмысленную перезагрузку модели при каждом cache-bust сайта.

---

# ЧАСТЬ XI. БЕЗОПАСНАЯ ЦЕЛЕВАЯ АРХИТЕКТУРА

## 51. Компоненты

```text
MAIN THREAD
  UI
  consent
  selected engine
  accessibility
  outcome telemetry

MODEL COORDINATOR
  Web Lock
  BroadcastChannel
  generation selection
  cancellation

DOWNLOAD WORKER
  fetch stream
  fixed chunks
  chunk SHA-256
  OPFS offset writes
  resume

EXTRACTION WORKER
  streaming unzip
  path/size budgets
  OPFS output

INDEXEDDB CONTROL PLANE
  manifests
  state
  chunk bitmap
  current pointer
  failure ledger

OPFS DATA PLANE
  archive/staging
  immutable model files

ORT SESSION MANAGER
  core/enhanced readiness
  one active generation
```

## 52. End-to-end flow

```text
PLAY
→ Web Speech starts
→ user consents to enhanced model
→ storage preflight
→ persistence request
→ acquire generation Web Lock
→ recheck committed cache
→ download stream to OPFS
→ verify each trusted chunk
→ resume if interrupted
→ stream-extract in Worker
→ verify exact paths/sizes/hashes
→ create sessions
→ commit generation in IDB
→ BroadcastChannel READY
→ next playback selects Vosk
```

## 53. Failure policy

```text
network/provider:
  pause/resume, Web Speech remains

user cancel:
  keep verified chunks unless user chooses delete

quota:
  cleanup eligible generations, retry once

chunk mismatch:
  discard affected staging generation, fatal deterministic

archive/path/size:
  discard staging, fatal deterministic

ORT init:
  invalidate extracted generation once, retry rebuild once

unsupported OPFS:
  controlled fallback to old IDB path or Web Speech
```

---

# ЧАСТЬ XII. TEST ARCHITECTURE

## 54. Unit/state tests

- generation state transitions;
- invalid transition rejection;
- cache pointer atomicity;
- chunk bitmap;
- manifest digest;
- cleanup order;
- error classification;
- consent policy;
- Save-Data behavior.

## 55. Two-tab browser test

```text
Tab A and Tab B cold
→ both request enhanced model
→ exactly one Web Lock owner
→ exactly one provider download
→ Tab B receives progress
→ one generation commit
→ both use same ready generation
```

Negative:

```text
disable Web Locks fixture
→ fallback lease path or explicit unsupported
→ never silently launch two downloads
```

## 56. Crash/resume test

```text
download 40%
→ close owner tab
→ open new tab
→ lock released
→ verified chunks detected
→ Range resumes from chunk boundary
→ no bytes appended after 200 response
→ final generation ready
```

## 57. CORS/header test

Matrix:

```text
Content-Range exposed
Content-Range hidden
ETag exposed
ETag hidden
Range 206
Range ignored with 200
416
unexpected encoding
```

Expected behavior documented for every cell.

## 58. Storage tests

- `estimate()` insufficient;
- `persist()` granted/denied;
- quota error during chunk write;
- quota error during extraction;
- eviction of whole origin;
- current generation missing after eviction;
- cleanup frees enough space;
- private browsing/ephemeral storage.

## 59. Extraction mutations

- path traversal;
- absolute path;
- duplicate normalized path;
- unexpected sixth file;
- missing BERT vocab;
- oversized model;
- total output exceeds budget;
- wrong chunk;
- truncated ZIP;
- unsupported compression;
- worker termination.

## 60. Multi-generation tests

- old READY + new STAGING;
- new failure keeps old current;
- new commit retires old;
- rollback selects retained old;
- old absent triggers exact old download;
- two app releases require same generation and do not redownload.

## 61. Performance measurements

Browser/device matrix:

```text
desktop Chromium
Android-class constrained profile
Safari/WebKit
Firefox
```

Measure:

```text
peak JS heap where available
OPFS write throughput
download throughput
hash time per chunk
extract time
long tasks
VITS init
BERT init
first system audio
first core Vosk
first enhanced Vosk
```

---

# ЧАСТЬ XIII. CI LEVELS

## 62. TARGETED

No model bytes:

```text
manifest/schema
generation ID
chunk manifest validation
storage state machine
path budgets
CSP capability
SW bypass
mutations
```

## 63. CANDIDATE

Small external traffic:

```text
production CSP
redirect chain
three Range samples
sample hashes
header exposure facts
two-tab coordination with local fixture server
crash/resume against deterministic fixture
```

## 64. DEEP TTS

Full model:

```text
exact pinned revision
full streaming download
chunk verification
OPFS
stream extraction
sessions
audio
warm cache
resume
multi-tab
quota/corrupt generation
```

## 65. LIVE

```text
site identity
model manifest identity
small Range samples
no CSP violation
no unexpected redirect host
no full 280 МБ automatic live probe
```

---

# ЧАСТЬ XIV. ТОЧНЫЙ ПОРЯДОК PR

## PR-A — evidence and consent contract

- current SHA reverify;
- document implicit 280 МБ warm-up;
- typed user consent state;
- no download architecture change;
- AuditRepo findings.

## PR-B — immutable model/chunk manifest

- full provider revision;
- full archive SHA;
- total bytes;
- fixed chunk hashes;
- JSON Schema;
- atomic-change guard.

## PR-C — multi-tab coordinator

- Web Lock;
- BroadcastChannel;
- exactly-one-writer test;
- no data-plane migration yet.

## PR-D — OPFS staging prototype

- Worker;
- partial file;
- write/read/flush;
- IndexedDB control manifest;
- crash fixture;
- shadow only.

## PR-E — streaming chunk downloader

- Response.body;
- chunk digest;
- OPFS offsets;
- pause/cancel;
- no resume yet;
- compare bytes with current loader.

## PR-F — resumability

- exact revision;
- Range from chunk boundary;
- 206/200/416 policy;
- exposed-header diagnostics;
- close-tab resume test.

## PR-G — generation commit

- immutable generation directories;
- atomic IndexedDB pointer;
- old generation retention;
- rollback tests.

## PR-H — streaming safe extraction

- fflate Worker;
- allowlist;
- budgets;
- duplicate/path rejection;
- output files in OPFS;
- compare extracted hashes.

## PR-I — runtime session from new storage

- VITS/BERT session loading;
- current generation compatibility;
- one cold/warm A/B;
- old IDB path remains rollback switch.

## PR-J — persistence/storage UX

- estimate/persist;
- Save-Data hint;
- size display;
- pause/delete;
- storage diagnostics.

## PR-K — retire URL-only IndexedDB blobs

Только после shadow:

- migration;
- old schema cleanup;
- rollback flag;
- metrics.

## PR-L — optional split-file publication

- no giant ZIP;
- independent hashes;
- staged core/BERT;
- owner audio review.

## PR-M — live/scheduled evidence

- small live Range canary;
- full scheduled cohort;
- provider drift monitor;
- release ledger integration.

---

# ЧАСТЬ XV. НОВЫЕ AUDITREPO FINDINGS

## 66. W1-CI-38 — implicit 280 МБ user download

**Severity:** P1 UX/data cost

Обычный PLAY автоматически начинает background warm-up без отдельного download consent.

## 67. W1-CI-39 — no cross-tab download lock

**Severity:** P1 performance/reliability

`_voskWarmupStarted` действует только внутри одной страницы.

## 68. W1-CI-40 — no resumable model delivery

**Severity:** P1 availability/data cost

Закрытие вкладки или сетевой обрыв теряют незавершённую передачу.

## 69. W1-CI-41 — IndexedDB conflates data and metadata

**Severity:** P1 storage architecture

Большие extracted binaries и control state не разделены.

## 70. W1-CI-42 — no atomic generation publish

**Severity:** P1 correctness

Нет explicit staging → verify → commit generation protocol.

## 71. W1-CI-43 — cross-origin resume header assumptions undefined

**Severity:** P1 interoperability

Не определено поведение при hidden `Content-Range`, отсутствии ETag или preflight для `If-Range`.

## 72. W1-CI-44 — synchronous giant unzip

**Severity:** P1 performance

`unzipSync` работает с полным archive buffer на main thread.

## 73. W1-CI-45 — no extraction resource budgets

**Severity:** P1 security/reliability

Нет machine-readable max files/output/per-file limits и duplicate normalized-path rejection.

## 74. W1-CI-46 — model rollback generation undefined

**Severity:** P1 recovery

Site rollback не связан с retained exact model generation.

## 75. W1-CI-47 — Background Fetch cannot be portability foundation

**Severity:** P2 architecture

API остаётся limited/experimental; обязательна обычная resumability.

---

# ЧАСТЬ XVI. ACCEPTANCE CRITERIA

## 76. Consent

- размер показан;
- automatic 280 МБ download выключен;
- Save-Data уважается;
- Web Speech остаётся мгновенным;
- pause/delete доступны.

## 77. Coordination

- exactly one writer across tabs;
- observers receive progress;
- queued writer rechecks committed state;
- crash releases lock;
- no duplicate full model requests.

## 78. Storage

- large bytes in OPFS;
- metadata in IndexedDB;
- staging invisible to readers;
- pointer changes after verification;
- old generation preserved until policy cleanup;
- quota/eviction handled.

## 79. Resume

- exact revision URL;
- trusted chunk manifest;
- verified chunks survive;
- Range begins at chunk boundary;
- 200 cannot append to partial;
- hidden headers have explicit fallback;
- final every-chunk identity passes.

## 80. Extraction

- Worker;
- streaming;
- exact path allowlist;
- budgets;
- duplicate/path traversal rejection;
- no long main-thread freeze;
- file hashes/sizes match.

## 81. Runtime

- VITS and BERT compatibility recorded;
- selected engine typed;
- warm Vosk requires no network;
- corrupt generation repaired once;
- unsupported browser falls back explicitly.

## 82. Release

- site release records model generation;
- rollback selects exact generation;
- SW does not own model cache;
- live Range canary passes;
- full model remains scheduled/high-risk, not every deploy.

---

# ЧАСТЬ XVII. SYSTEM AGENT PROMPT

```text
Работай в:
FedorMilovanov/gb-is-my-strength
FedorMilovanov/AuditRepo

Текущая база:
main/source 74b424a0414a78b5b60958ea723efc3ba3b5c768
last functional a145834ab3cb3fbedea1740547b77e91c71fdfbf
TTS incident 932230d31ebe13bd219a2fe7293e512ce90719b5
AuditRepo 55c820601d1957e85c9c925ad4b214580618bcf5

Если HEAD изменился — сначала создай delta и ничего не редактируй.

Сделай только PR-A:

1. Зафиксируй current TTS download UX:
   первый PLAY,
   Web Speech,
   automatic background warm-up,
   estimated model bytes.
2. Добавь machine-readable download-consent state design, но не меняй runtime behavior.
3. Добавь findings W1-CI-38..47 в current-head reverify AuditRepo.
4. Добавь browser evidence:
   две cold вкладки сейчас способны независимо начать warm-up.
5. Измерь, но не оптимизируй:
   requests,
   transferred bytes,
   arrayBuffer,
   hash,
   unzip,
   IDB,
   ORT init.
6. Не внедряй OPFS, Web Locks, Range, Worker или packaging migration в этой PR.
7. Не меняй CSP и model URL.
8. Не удаляй Web Speech fallback.
9. Остановись после evidence PR и представь owner review.

Следующая отдельная PR:
immutable model + chunk manifest.
```

---

# ЧАСТЬ XVIII. ПЕРВИЧНЫЕ И ОФИЦИАЛЬНЫЕ ИСТОЧНИКИ

## OPFS и storage

1. MDN — Origin private file system  
   https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system

2. MDN — FileSystemSyncAccessHandle  
   https://developer.mozilla.org/en-US/docs/Web/API/FileSystemSyncAccessHandle

3. MDN — Storage quotas and eviction criteria  
   https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria

4. MDN — StorageManager.estimate  
   https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate

5. MDN — StorageManager.persist  
   https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist

6. MDN — StorageManager.persisted  
   https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persisted

7. WHATWG Storage Standard  
   https://storage.spec.whatwg.org/

8. File System Standard  
   https://fs.spec.whatwg.org/

9. Indexed Database API 3.0  
   https://w3c.github.io/IndexedDB/

## Multi-tab coordination

10. MDN — Web Locks API  
    https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API

11. Web Locks specification  
    https://w3c.github.io/web-locks/

12. MDN — Broadcast Channel API  
    https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API

13. WHATWG HTML — BroadcastChannel  
    https://html.spec.whatwg.org/multipage/web-messaging.html#broadcasting-to-other-browsing-contexts

14. MDN — SharedWorker  
    https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker

## HTTP Range, resume и CORS

15. MDN — HTTP range requests  
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Range_requests

16. MDN — Range header  
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Range

17. MDN — If-Range  
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/If-Range

18. MDN — Accept-Ranges  
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Ranges

19. MDN — Content-Range  
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Range

20. MDN — ETag  
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/ETag

21. MDN — CORS-safelisted request header  
    https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_request_header

22. MDN — CORS-safelisted response header  
    https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header

23. MDN — Access-Control-Expose-Headers  
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Access-Control-Expose-Headers

24. RFC 9110 — HTTP Semantics  
    https://www.rfc-editor.org/rfc/rfc9110

25. WHATWG Fetch Standard  
    https://fetch.spec.whatwg.org/

## Streams, Workers и crypto

26. MDN — Response.body  
    https://developer.mozilla.org/en-US/docs/Web/API/Response/body

27. MDN — Streams API  
    https://developer.mozilla.org/en-US/docs/Web/API/Streams_API

28. MDN — Web Workers  
    https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API

29. MDN — Transferable objects  
    https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects

30. MDN — AbortController  
    https://developer.mozilla.org/en-US/docs/Web/API/AbortController

31. MDN — SubtleCrypto.digest  
    https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest

32. Web Cryptography API  
    https://www.w3.org/TR/WebCryptoAPI/

## Compression и ONNX

33. fflate official repository  
    https://github.com/101arrowz/fflate

34. MDN — Compression Streams API  
    https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API

35. ONNX Runtime Web — Working with Large Models  
    https://onnxruntime.ai/docs/tutorials/web/large-models.html

36. ONNX Runtime Web  
    https://onnxruntime.ai/docs/tutorials/web/

37. ONNX Runtime Web performance diagnosis  
    https://onnxruntime.ai/docs/tutorials/web/performance-diagnosis.html

38. ONNX External Data  
    https://onnx.ai/onnx/repo-docs/ExternalData.html

39. ONNX Runtime JavaScript API  
    https://onnxruntime.ai/docs/api/js/

## Background work и network hints

40. MDN — Background Fetch API  
    https://developer.mozilla.org/en-US/docs/Web/API/Background_Fetch_API

41. Background Fetch specification  
    https://wicg.github.io/background-fetch/

42. MDN — NetworkInformation.saveData  
    https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData

43. MDN — NetworkInformation.effectiveType  
    https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType

44. MDN — Navigator.connection  
    https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection

## Service Worker

45. W3C — Service Workers  
    https://w3c.github.io/ServiceWorker/

46. MDN — Using Service Workers  
    https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

47. Playwright — Service Workers  
    https://playwright.dev/docs/service-workers

## Browser testing

48. Playwright — Browser contexts  
    https://playwright.dev/docs/browser-contexts

49. Playwright — Network  
    https://playwright.dev/docs/network

50. Playwright — Request  
    https://playwright.dev/docs/api/class-request

51. Playwright — Response  
    https://playwright.dev/docs/api/class-response

52. Playwright — Fixtures  
    https://playwright.dev/docs/test-fixtures

53. Playwright — Trace Viewer  
    https://playwright.dev/docs/trace-viewer

## Secure development и CI

54. NIST — Secure Software Development Framework  
    https://csrc.nist.gov/pubs/sp/800/218/final

55. GitHub — Secure use reference  
    https://docs.github.com/en/actions/reference/security/secure-use

56. GitHub — Workflow artifacts  
    https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts

57. GitHub — Artifact attestations  
    https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations

58. OpenSSF — GitHub configuration best practices  
    https://best.openssf.org/SCM-BestPractices/github/

59. Reproducible Builds — SOURCE_DATE_EPOCH  
    https://reproducible-builds.org/docs/source-date-epoch/

---

# ФИНАЛЬНЫЙ ВЕРДИКТ

Текущая TTS-архитектура уже содержит сильные идеи:

- lazy loading;
- Web Speech fallback;
- SHA-256;
- required archive files;
- IndexedDB warm cache;
- single-threaded ORT для совместимости.

Но она всё ещё построена как один большой невозобновляемый browser operation:

```text
неявное согласие
→ один tab-local warm-up
→ 280 МБ whole buffer
→ one-shot hash
→ sync unzip
→ URL-keyed IndexedDB
→ no atomic generation
```

Следующий зрелый уровень:

```text
explicit consent
→ immutable revision
→ Web Lock
→ BroadcastChannel
→ OPFS staging
→ streaming fixed chunks
→ per-chunk integrity
→ resume
→ Worker extraction
→ atomic IDB commit
→ versioned generation
→ controlled rollback
```

Это не только ускорение. Такая схема одновременно:

- снижает расход трафика;
- предотвращает двойную загрузку;
- переживает закрытие вкладки;
- уменьшает peak memory;
- делает cache repair предсказуемым;
- отделяет site release от model generation;
- превращает fallback в честное состояние;
- позволяет глубоко тестировать модель без 280 МБ на каждом CI run.
