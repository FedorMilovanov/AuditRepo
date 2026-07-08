# GB CI/CD — единый глубокий отчёт V10

**Статус:** исследование и архитектурный план, без изменений репозиториев  
**Дата повторной проверки:** 2026-07-08  
**Source repository:** `FedorMilovanov/gb-is-my-strength`  
**Audit repository:** `FedorMilovanov/AuditRepo`

```text
Текущий функциональный SHA:
932230d31ebe13bd219a2fe7293e512ce90719b5

Текущий финальный bot/source SHA:
47a5e899f2b6a874749fcf707140269a3f665fae

Текущий AuditRepo SHA:
55c820601d1957e85c9c925ad4b214580618bcf5
```

---

## 0. Назначение документа

Это один самостоятельный документ, который заменяет необходимость читать V1–V9 по очереди.

Он объединяет:

1. фактическую текущую топологию GitHub Actions;
2. скрытое размножение production-сборок;
3. разрыв между functional SHA, bot SHA, build artifact и live release;
4. дублирование deploy-событий;
5. ложные зелёные проверки DOM без render truth;
6. скрытые UI-состояния и пространственные коллизии;
7. Service Worker и cache-coherence;
8. новый производственный инцидент TTS/CSP/CDN redirect;
9. целевую архитектуру candidate → artifact → release → live verification;
10. точную последовательность безопасных PR;
11. критерии, при которых старые тяжёлые проверки можно переносить, а не удалять.

Документ исходит из строгого правила:

> Ускорение допустимо только через устранение повторной работы, правильную декомпозицию и точный impact selection. Ослабление утверждений, удаление известных регрессий и замена доказательства предположением ускорением не считаются.

---

# ЧАСТЬ I. ТЕКУЩИЙ ВЕРДИКТ

## 1. Главный системный вывод

Репозиторий страдает не от одного «очень долгого теста».

Корневая проблема состоит из пяти связанных дефектов:

```text
нет единственного владельца production build
+ нет единственного владельца release transaction
+ нет точной связи source → artifact → live
+ tests часто доказывают структуру, а не пользовательский результат
+ внешние зависимости проверяются не в реальной browser-policy среде
```

Отсюда возникают наблюдаемые симптомы:

- один diff строится несколько раз;
- один source change запускает несколько workflows;
- один deploy может быть отменён другим deploy;
- ранняя ошибка скрывает все следующие;
- DOM-тест проходит, хотя control невидим;
- feature fallback маскирует production outage;
- CORS может быть правильным, но CSP блокирует redirect target;
- static SW audit проходит, хотя old/new browser lifecycle не проверен;
- bot-коммит становится фактическим release source, но candidate не привязан к нему неизменяемо.

## 2. Семь видов истины

Новый pipeline должен явно различать семь разных утверждений:

```text
1. SOURCE TRUTH
   какой exact commit является входом;

2. GENERATOR TRUTH
   какие детерминированные bot/generated изменения получены;

3. BUILD TRUTH
   какое дерево было собрано;

4. POLICY TRUTH
   что браузеру разрешено CSP/CORS/Service Worker;

5. EXTERNAL DELIVERY TRUTH
   откуда реально пришли байты после redirects/CDN;

6. FEATURE TRUTH
   какой engine/control действительно получил пользователь;

7. LIVE TRUTH
   какое дерево реально обслуживается production URL.
```

Существующий pipeline частично проверяет каждый слой отдельно, но не связывает их одной цепочкой доказательств.

---

# ЧАСТЬ II. НОВЫЙ ТЕКУЩИЙ ИНЦИДЕНТ: TTS, CSP И REDIRECT TARGET

## 3. Что произошло

Свежий функциональный коммит исправил производственную блокировку Vosk TTS.

Исходная модель загружалась с URL вида:

```text
https://huggingface.co/<repo>/resolve/main/model-quant.zip
```

Этот URL не обязательно отдаёт сами байты. Для больших файлов Hugging Face использует отдельное storage/CDN-представление. В текущем инциденте browser redirect target оказался на поддомене:

```text
*.aws.cdn.hf.co
```

CSP разрешал:

```text
connect-src ... https://huggingface.co
```

но не разрешал фактический redirect target.

Результат:

```text
initial URL допустим
→ HTTP redirect
→ final CDN origin не входит в connect-src
→ браузер блокирует fetch
→ Vosk initialization падает
→ приложение тихо переключается на Web Speech
→ обычный пользователь не видит root cause
```

Коммит добавил `https://*.aws.cdn.hf.co`:

- в десятки `*PageHead.astro` / `*PageChrome.astro`;
- в fallback `DEFAULT_DIST_CSP`;
- в комментарии TTS engine.

## 4. Что доказано, а что пока нет

### Доказано текущими материалами

- browser console зафиксировал CSP block;
- первоначальный host и фактический final host различались;
- `connect-src` контролирует `fetch()`;
- current policy не содержала CDN host;
- commit исправил policy fan-out;
- приложение имело fallback на Web Speech.

### Нельзя исторически утверждать без telemetry

Фраза «Vosk ни разу не работал в production» правдоподобна и записана в commit message, но строго доказать её за весь период невозможно без исторических outcome metrics.

Корректная формулировка:

> Найден детерминированный CSP-дефект, способный блокировать каждую cold network загрузку модели через наблюдавшийся Xet CDN redirect. Историческая доля затронутых сессий неизвестна из-за отсутствия production telemetry.

## 5. Почему предыдущие проверки дали false green

Проверялись отдельные части:

```text
URL существует
CORS первого или конечного ответа выглядит допустимым
SHA-256 модели известен
fallback работает
```

Не проверялась полная цепь:

```text
production HTML
+ production CSP
+ настоящий browser fetch
+ весь redirect chain
+ final origin
+ CORS final response
+ полный body
+ hash
+ archive
+ ONNX/VITS/BERT initialization
+ фактический selected engine
```

Это ключевой урок:

> Проверка поставщика через Node/curl не эквивалентна проверке feature через браузер, потому что Node не применяет CSP страницы.

## 6. Почему final redirect host обязан входить в policy

`connect-src` ограничивает URL, загружаемые script interfaces, включая `fetch()`, XHR, WebSocket, EventSource и beacon.

CSP Level 3 выполняет проверки не только до запроса, но и относительно response/final URL. Redirect не превращает разрешение начального host в универсальное разрешение всех целей.

Следовательно, контракт должен описывать не только entry URL:

```text
huggingface.co
```

но и допустимое redirect closure:

```text
huggingface.co
→ региональный/провайдерский CDN host
```

## 7. Почему `*.aws.cdn.hf.co` — исправление, но не конечная архитектура

Wildcard устраняет текущую блокировку, но создаёт новый класс рисков:

- provider может менять инфраструктуру;
- новые поддомены автоматически становятся разрешёнными;
- policy обновлена во множестве source-файлов;
- нет machine-readable связи между external dependency и CSP;
- нет drift detector между observed final host и approved host pattern;
- маршрут без TTS может получить лишний `connect-src` capability.

Конечная архитектура должна быть capability-based:

```text
BASE_CSP
+ analytics capability
+ maps capability
+ tts-model capability
+ optional external-image capability
```

Только маршруты с TTS получают TTS connection sources.

---

# ЧАСТЬ III. EXTERNAL DEPENDENCY CONTRACT

## 8. Канонический manifest внешней зависимости

Для каждой внешней runtime-зависимости нужен machine-readable contract.

```json
{
  "schemaVersion": 1,
  "id": "tts-model-ru-quant-v1",
  "feature": "vosk-tts",
  "requiredOnRoutes": ["capability:tts"],
  "entry": {
    "url": "https://huggingface.co/CurtMil/gb-vosk-tts-model/resolve/<FULL_REVISION>/model-quant.zip",
    "method": "GET",
    "credentials": "omit"
  },
  "revision": {
    "type": "commit",
    "value": "<FULL_HF_COMMIT_SHA>"
  },
  "redirectPolicy": {
    "maxRedirects": 5,
    "allowedHostPatterns": [
      "huggingface.co",
      "*.aws.cdn.hf.co"
    ],
    "httpsOnly": true
  },
  "response": {
    "allowedStatus": [200, 206],
    "corsOrigin": "*",
    "minimumBytes": 200000000,
    "maximumBytes": 400000000,
    "contentTypeAdvisory": [
      "application/zip",
      "application/octet-stream"
    ]
  },
  "integrity": {
    "algorithm": "SHA-256",
    "hex": "34e742ce9bb3c1ae86679d5974d2496b9fae50f0629f51bb4f5edfadc5ff3d71"
  },
  "archive": {
    "format": "zip",
    "requiredPaths": [
      "model.onnx",
      "bert.onnx"
    ]
  },
  "fallback": {
    "engine": "web-speech",
    "allowedReasons": [
      "provider-unavailable",
      "offline"
    ],
    "blockingReasons": [
      "csp-blocked",
      "unexpected-redirect-host",
      "hash-mismatch",
      "archive-invalid",
      "engine-init-failed"
    ]
  }
}
```

## 9. URL следует pin-ить на exact revision

Текущий путь использует `resolve/main`.

Даже при отдельном SHA-256 это оставляет moving reference:

```text
main изменился
→ URL тот же
→ CDN bytes изменились
→ integrity check падает
→ все cold users получают fallback
```

Hash защищает от принятия неправильных байтов, но не предотвращает outage после случайного обновления provider branch.

Предпочтительно:

```text
resolve/<FULL_HF_COMMIT_SHA>/model-quant.zip
```

Hugging Face официально поддерживает выбор конкретного revision, включая полный commit hash.

Атомарная единица изменения:

```text
MODEL_REVISION
MODEL_URL
MODEL_SHA256
EXPECTED_SIZE_RANGE
ALLOWED_REDIRECT_HOSTS
CACHE_VERSION
```

Она меняется одним PR и одним mutation-tested contract.

## 10. Redirect closure algorithm

Browser test обязан записывать весь redirect chain.

Playwright связывает requests через:

```text
request.redirectedFrom()
request.redirectedTo()
```

Результат:

```json
{
  "entryUrl": ".../resolve/<revision>/model-quant.zip",
  "hops": [
    {
      "url": "https://huggingface.co/...",
      "status": 302,
      "host": "huggingface.co"
    },
    {
      "url": "https://us.aws.cdn.hf.co/...",
      "status": 200,
      "host": "us.aws.cdn.hf.co"
    }
  ],
  "finalHost": "us.aws.cdn.hf.co",
  "hostPolicyMatched": "*.aws.cdn.hf.co"
}
```

Failure conditions:

- redirect loop;
- too many hops;
- downgrade to HTTP;
- host outside approved suffix;
- credentials leaked across redirect;
- final status not allowed;
- browser request blocked before response;
- `securitypolicyviolation` captured;
- body/hash mismatch.

## 11. Candidate canary без 280 MB на каждом run

Полный model download нельзя выполнять на каждом unrelated candidate.

Нужны два независимых witness:

### A. Same-backend delivery canary

В том же Hugging Face repository хранится небольшой deterministic binary, но именно через тот же storage class/Xet mechanism, а не как обычный маленький Git blob.

```text
delivery-canary-xet.bin
1–5 MB
pinned revision
pinned SHA-256
```

Candidate при изменении:

- CSP;
- TTS engine;
- model URL/revision;
- network policy;
- PageHead/security policy;

открывает production-like page с настоящей CSP и загружает canary.

Проверяются:

- CSP;
- redirect chain;
- final host;
- CORS;
- exact bytes/hash;
- outcome telemetry.

### B. Full cold model cohort

Полная 280 MB загрузка запускается:

- при изменении model revision/hash;
- при изменении archive/runtime loader;
- при изменении CSP TTS capability;
- по расписанию;
- вручную перед критическим release.

Проверяются:

```text
full download
→ streaming progress
→ SHA-256
→ unzip
→ required files
→ IndexedDB/cache write
→ ONNX session
→ short synthesized phrase
→ audio output facts
```

## 12. Нельзя считать fallback зелёным success

Текущая деградация:

```text
Vosk failed
→ Web Speech plays
→ smoke слышит/видит PLAY behavior
→ release выглядит исправным
```

Feature result должен быть typed:

```json
{
  "requestedEngine": "vosk",
  "selectedEngine": "web-speech",
  "status": "degraded",
  "fallbackReason": "csp-blocked"
}
```

Candidate rules:

```text
selectedEngine = vosk                      → success
selectedEngine = fallback + provider-down → explicit degraded policy
selectedEngine = fallback + CSP/hash/init  → failure
```

Пользовательский интерфейс также может сообщать без технического шума:

```text
«Высококачественный голос сейчас недоступен — используется системный голос»
```

Это лучше молчаливого изменения качества.

---

# ЧАСТЬ IV. CSP КАК КАНОНИЧЕСКИЙ BUILD INPUT

## 13. Текущий CSP fan-out — архитектурный дефект

Свежий fix потребовал изменения примерно 37 PageHead/PageChrome компонентов и postbuild fallback.

Это означает:

```text
одна policy capability
→ десятки ручных строк
→ высокий риск частичного обновления
→ высокий review noise
→ bot/generated fan-out
```

CSP должен иметь одного владельца.

## 14. Целевая структура CSP

```text
src/security/csp-policy.ts
data/external-dependencies.json
data/route-capabilities.json
```

Пример:

```ts
const BASE = {
  defaultSrc: ["'self'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
};

const CAPABILITIES = {
  analytics: {
    scriptSrc: ["https://mc.yandex.ru", "https://*.yandex.ru"],
    connectSrc: ["https://mc.yandex.ru", "wss://*.yandex.ru"],
  },
  ttsModel: {
    connectSrc: [
      "https://huggingface.co",
      "https://*.aws.cdn.hf.co",
    ],
  },
};
```

Route profile:

```json
{
  "/articles/dzhon-gill-chast-1-chelovek/": [
    "analytics",
    "ttsModel"
  ],
  "/about/": [
    "analytics"
  ]
}
```

## 15. Build-time CSP invariants

Для каждой dist page:

1. ровно одна CSP policy;
2. policy парсится;
3. directives нормализованы;
4. routes получают только declared capabilities;
5. TTS routes включают external dependency hosts;
6. non-TTS routes не получают TTS hosts без причины;
7. source policy и postbuild policy идентичны;
8. неизвестный external host — fatal;
9. route-specific difference зарегистрирована;
10. `DEFAULT_DIST_CSP` не является независимой ручной копией.

## 16. Meta CSP и наблюдаемость

CSP через HTTP response header — предпочтительный механизм спецификации.

Текущий static hosting использует `<meta http-equiv="Content-Security-Policy">`.

Ограничения:

- `Content-Security-Policy-Report-Only` нельзя доставить через meta;
- полноценный report-only rollout требует response header;
- некоторые directives/reporting capabilities в meta недоступны;
- policy должна появляться достаточно рано в `<head>`.

Пока infrastructure остаётся meta-based, в browser tests и optional client diagnostics следует использовать:

```js
document.addEventListener("securitypolicyviolation", event => {
  record({
    blockedURI: event.blockedURI,
    effectiveDirective: event.effectiveDirective,
    disposition: event.disposition,
    sourceFile: event.sourceFile,
    statusCode: event.statusCode
  });
});
```

Это не заменяет server-side CSP reporting, но делает production-like test failures объяснимыми.

## 17. Security policy drift report

Build генерирует:

```json
{
  "policyDigest": "sha256:...",
  "pages": 412,
  "variants": [
    {
      "digest": "sha256:...",
      "capabilities": ["analytics", "ttsModel"],
      "routeCount": 137
    },
    {
      "digest": "sha256:...",
      "capabilities": ["analytics"],
      "routeCount": 275
    }
  ],
  "unknownHosts": [],
  "duplicatePolicies": [],
  "missingPolicies": []
}
```

---

# ЧАСТЬ V. НАКОПЛЕННЫЕ СИСТЕМНЫЕ ДЕФЕКТЫ V1–V9

## 18. Скрытое размножение production builds

Подтверждённые audit-скрипты сами вызывают build, а workflows затем строят ещё раз.

Минимальная оценка, полученная из command graph:

```text
обычная article/source правка → не менее 4 builds
ручной Dist Dry Run          → не менее 8 builds
```

Главное исправление:

```text
audit never builds
builder builds once
audits consume exact dist
```

Стандартный interface:

```text
--root dist
--base-url http://127.0.0.1:...
--routes-from-plan
--no-build
```

## 19. Один последовательный mega-job раскрывает дефекты по одному

Текущий deploy объединяет:

```text
source gates
build
Pagefind
schema
PremiumControls
Gill matrices
browser smoke
coverage
SW
Pages
IndexNow
```

Если ранний source gate падает, независимые поздние проверки не запускаются.

Целевой DAG:

```text
plan
├── source-fast
├── source-contracts
└── build-once
      ├── dist-static
      ├── browser-compact
      ├── owner-impacted
      ├── content-impacted
      └── external-delivery-impacted
             ↓
       candidate-ready
```

## 20. Event topology создаёт duplicate release paths

Для `src/**` текущая система могла запускать:

```text
direct Deploy
IndexNow/generator
Deploy после IndexNow workflow_run
Visual Parity
```

Это означает несколько builds и два deploy runs для одного функционального изменения.

Правило:

> Один functional change должен иметь один release-eligible candidate path.

## 21. Candidate и production release имеют разную concurrency policy

Candidate:

```yaml
concurrency:
  group: candidate-${{ ref }}
  cancel-in-progress: true
```

Production release:

```yaml
concurrency:
  group: pages-production
  cancel-in-progress: false
```

Сохраняется running release и только последний pending release.

## 22. Functional SHA и final bot SHA

Пока generator изменяет source:

```text
functional SHA F
→ metadata/cache-bust bot
→ final source SHA B
```

Нельзя:

- deploy checkout moving `main`;
- использовать только `workflow_run.head_sha`, если он указывает на F;
- считать B проверенным косвенно.

Переходный contract:

```json
{
  "functionalSha": "F",
  "finalSourceSha": "B",
  "generatedPaths": ["..."],
  "generatorDigest": "sha256:..."
}
```

Candidate делает checkout exact B и записывает F+B в manifest.

Конечный W2-вариант — убрать source mutation из release transaction и генерировать metadata в artifact.

## 23. Render truth

Исторический Gill incident доказал:

```text
node exists
≠
control painted
```

Пятиуровневый oracle:

```text
V1 DOM
V2 computed style
V3 geometry/hit testing
V4 behavior
V5 focused paint
```

## 24. State activation

Исторический FAB incident доказал:

```text
route loaded
≠
hidden user state activated
```

Fixture должен объявлять:

```text
localStorage
theme
viewport
motion
overlay
scroll
Service Worker state
network state
```

И отдельно доказывать, что activation действительно состоялась.

## 25. Spatial occupancy graph

Для fixed/sticky/modal surfaces проверяется не только элемент, но и отношения:

```text
FAB × bottom bar              → no intersection
backdrop × bottom bar         → backdrop must dominate
modal panel × viewport        → within bounds
selection popup × FAB         → forbidden overlap
content × persistent bar      → bounded/no overlap
```

## 26. Z-index architecture debt

Значения около `2147483xxx` показывают numeric arms race.

Нужны:

- overlay registry;
- modal owner;
- scroll-lock owner;
- conflict policy;
- top-layer pilot;
- запрет нового незарегистрированного extreme z-index.

## 27. State-space compression

Полный product:

```text
route × viewport × theme × motion × storage × overlay × SW × network
```

даёт тысячи cases.

Стратегия:

```text
mandatory historical rows
+ deterministic owner rows
+ constrained pairwise
+ selective 3-way
+ ordered transition sequences
```

Ни один historical regression не удаляется ради covering array.

## 28. Service Worker cache coherence

Static audit недостаточен.

Нужен runtime cohort:

```text
old release controlled
→ new release deploy
→ new SW install/activate
→ controllerchange
→ runtime assets
→ reload
→ offline probe
→ old cache cleanup
```

Playwright позволяет:

- наблюдать Service Workers;
- ждать activation/controllerchange;
- видеть SW network events;
- определять `response.fromServiceWorker()`.

## 29. Live truth после Pages

Release не заканчивается успешным `deploy-pages`.

После deployment:

```text
fetch /.well-known/gb-build.json
→ verify sourceSha
→ verify treeDigest
→ probe impacted routes
→ verify external/runtime capability if required
→ append release ledger
→ send IndexNow
```

---

# ЧАСТЬ VI. ЦЕЛЕВАЯ АРХИТЕКТУРА

## 30. Полная схема

```text
EVENT NORMALIZATION
  exact event/source/base/trust/release eligibility
        ↓
GENERATOR TRANSITION
  functional SHA → final bot SHA + generated allowlist
        ↓
IMPACT GRAPH
  files/imports/routes
  CSS selectors
  spatial surfaces
  state machines
  external dependencies
  SW/cache
        ↓
STATE PLAN
  mandatory regressions
  owner contracts
  covering-array rows
  ordered sequences
        ↓
PARALLEL SOURCE CHECKS
        ╲
         ╲
CANONICAL BUILD — EXACTLY ONCE
  Astro
  legacy copy
  cache bust
  Pagefind
  .nojekyll
  public build identity
  CSP generation
  external dependency manifest
  SW/cache manifest
  tree digest
  canonical archive
         ╱
        ╱
PARALLEL CONSUMERS
  dist-static
  browser-compact
  owner-impacted
  state-machine
  external-delivery-canary
  SW cohort when impacted
        ↓
CANDIDATE-READY
  all planned results present
  exact source/plan/tree match
  build count = 1
  no deterministic degraded fallback
        ↓
RELEASE
  no checkout
  no npm ci
  no project scripts
  verify artifact/provenance
  deploy exact Pages artifact
        ↓
LIVE CANARY
  build identity
  route probes
  feature outcome
  SW/cache compatibility
        ↓
RELEASE LEDGER
        ↓
INDEXNOW / NOTIFICATION
```

## 31. Канонические identity fields

```text
functionalSha
generatorInputSha
finalSourceSha
planDigest
policyDigest
externalDependencyDigest
swCacheManifestDigest
distTreeDigest
canonicalArchiveDigest
transportArtifactDigest
candidateVerdictDigest
pagesDeploymentId
liveManifestDigest
```

## 32. Stable required status

Branch/ruleset видит только:

```text
candidate-ready
```

Он всегда запускается.

Для docs-only:

```text
minimal plan
explicit neutral results
candidate-ready success
```

Workflow-level path filter не должен выключать единственный required check.

---

# ЧАСТЬ VII. УРОВНИ ПРОВЕРОК

## 33. EDIT

Цель: секунды.

```text
format/parse
targeted lint
local contract
no build
no browser
no network
```

## 34. TARGETED

Цель: до 1–2 минут.

```text
changed subsystem
route-specific source contracts
static external manifest
CSP capability generation
historical mutation fixture
```

## 35. CANDIDATE

Цель: один exact-SHA candidate.

```text
one production build
compact impacted browser
protected render/state
same-backend external canary when selected
all planned result reconciliation
```

## 36. RELEASE

Цель: короткая публикация approved artifact.

```text
verify
deploy
live identity
no source execution
```

## 37. DEEP

```text
full Gill traversal
full mobile matrix
all-route visual
full 280 MB TTS cold model
old/new SW cohort
external links
deterministic dual build
broader state-space rows
```

## 38. FORENSIC

Ручной incident mode:

```text
full traces
network capture
CSP reports
provider redirect analysis
cache storage dump
all browser engines
long transition sequences
```

---

# ЧАСТЬ VIII. ТОЧНАЯ ПОСЛЕДОВАТЕЛЬНОСТЬ PR

## PR-0 — current evidence freeze

- записать `932230d3`, `47a5e899`, AuditRepo SHA;
- построить command graph;
- измерить current builds/workflows;
- зафиксировать TTS incident без переобъяснения истории;
- никаких workflow изменений.

## PR-1 — external dependency manifest

- модель, revision, URL, hash, size, hosts;
- JSON Schema;
- static validation;
- URL/hash/revision atomicity;
- negative fixtures.

## PR-2 — CSP canonical source

- base policy + capabilities;
- route capability map;
- generator;
- parity audit всех dist pages;
- старые строки временно сравниваются в shadow.

## PR-3 — CSP/browser external canary

- production-like page;
- actual meta CSP;
- `securitypolicyviolation` listener;
- redirect chain;
- same-Xet canary;
- final host/CORS/hash;
- remove-host mutation must fail.

## PR-4 — outcome telemetry

- requested/selected engine;
- typed fallback reason;
- candidate rejects deterministic fallback;
- user-safe degraded message;
- privacy review.

## PR-5 — full TTS DEEP cohort

- pinned full HF revision;
- full cold download;
- hash/archive;
- cache;
- ONNX init;
- short synthesis;
- warm/corrupt cache cases.

## PR-6 — no-build audit migration

- canonical build owner;
- nested-build lock;
- article/about/home/ishod/wrapper audits consume dist.

## PR-7 — single candidate entrypoint

- event normalization;
- immutable impact/state plan;
- stable candidate-ready;
- no required workflow path-filter trap.

## PR-8 — build-once artifact

- Pagefind/key/.nojekyll/policies/manifests before digest;
- canonical archive;
- tree + transport digests.

## PR-9 — parallel consumers and shadow

- dist/browser/owner/external groups;
- one Chromium install;
- soft related assertions;
- current full pipeline remains blocking shadow.

## PR-10 — same-artifact release

- split candidate/release concurrency;
- remove direct duplicate release path;
- release has no checkout/npm/build;
- environment audit.

## PR-11 — live verification

- build identity endpoint;
- route probes;
- TTS canary outcome;
- SW/cache witness;
- release ledger;
- IndexNow after live verification.

## PR-12 — heavy-check relocation

Только после:

```text
≥ 7 дней shadow
≥ 20 representative runs
0 resolver misses
0 identity mismatch
0 planned-result omissions
historical mutations caught
TTS CSP mutation caught
rollback rehearsal
```

## PR-13 — action upgrades/pinning

Отдельная wave:

- action release notes;
- current resolved SHA;
- upgrade one family;
- full commit SHA pinning;
- rollback SHA.

---

# ЧАСТЬ IX. MUTATION MATRIX

## 39. Build/release

- nested audit calls production build;
- release runs npm;
- release checks out moving main;
- artifact missing `.nojekyll`;
- result belongs to wrong tree;
- final bot SHA not verified;
- candidate build count > 1.

## 40. CSP/external delivery

- remove `*.aws.cdn.hf.co`;
- redirect to unapproved host;
- redirect downgrade;
- malformed wildcard;
- TTS route lacks capability;
- non-TTS route unexpectedly gets capability;
- duplicate differing CSP metas;
- fallback DEFAULT policy drifts;
- security violation occurs but test ignores it.

## 41. Model

- `main` moves but hash does not;
- URL changes without revision;
- revision changes without hash;
- malformed SHA-256;
- body truncated;
- correct HTTP status, wrong bytes;
- ZIP missing BERT/VITS file;
- corrupt IndexedDB cache;
- ONNX init failure;
- fallback reason misclassified as provider outage.

## 42. Render/state

- Gill ring `display:none`;
- FAB state not seeded;
- FAB overlaps bottom bar;
- backdrop below bar;
- opacity zero;
- zero bounding box;
- fixture expected active but stayed inactive.

## 43. Service Worker

- old cache survives;
- new SW controls old page with incompatible runtime asset;
- `fromServiceWorker()` unexpected;
- offline returns wrong release;
- rollback uses old HTML with new worker;
- cache manifest differs from release manifest.

---

# ЧАСТЬ X. METRICS

## 44. Speed

```text
queue latency
time to first failure
time to complete independent failure set
targeted duration
candidate critical path
release latency
time to live-verified
```

## 45. Waste

```text
workflows per functional SHA
deploy runs per live release
builds per SHA
discarded dist trees
npm ci count
Chromium install count
canceled candidate minutes
canceled release minutes
external bytes downloaded by check level
```

## 46. Correctness

```text
source mismatch
plan mismatch
tree mismatch
missing planned result
unexpected neutral/skip
fallback rate by reason
CSP violations
unexpected redirect host
external hash mismatch
live manifest mismatch
resolver miss found by DEEP
```

## 47. TTS-specific SLO

Пример внутренних целей:

```text
candidate same-backend canary pass ≥ 99%
full scheduled cold model pass ≥ 95% excluding declared provider outage
deterministic config fallback = 0
unexpected redirect hosts = 0
hash mismatch = 0
silent fallback = 0
```

---

# ЧАСТЬ XI. ПЕРВЫЕ БЕЗОПАСНЫЕ ДЕЙСТВИЯ

## 48. Можно делать немедленно без изменения release behavior

1. добавить current SHA witnesses;
2. добавить `securitypolicyviolation` capture в browser test harness;
3. создать external dependency JSON manifest;
4. pin Hugging Face revision в проектном плане;
5. построить CSP variant report;
6. добавить static test, что TTS capability содержит entry + redirect hosts;
7. сделать remove-CDN-host mutation;
8. типизировать fallback reasons;
9. измерить число CSP policy variants;
10. добавить outcome в test result, не отправляя пользовательские данные;
11. добавить same-backend canary в manual workflow;
12. записать findings в AuditRepo как current-head reverify.

## 49. Не делать немедленно

- не удалять fallback;
- не скачивать 280 MB на каждый push;
- не расширять `connect-src *`;
- не принимать любой `*.hf.co`;
- не массово переносить CSP без parity shadow;
- не переписывать все overlays;
- не смешивать CSP centralization с action major upgrades;
- не считать один successful manual fetch достаточным;
- не закрывать incident до production-like browser proof.

---

# ЧАСТЬ XII. AUDITREPO PATCH

## 50. Новые findings

### W1-CI-24 — external redirect closure отсутствовал

**Severity:** P0 feature availability / P1 security policy

Entry host был разрешён, final CDN host — нет.

### W1-CI-25 — CORS check не равен browser-policy check

**Severity:** P1 test architecture

Проверка response headers вне production page не применяла CSP.

### W1-CI-26 — silent fallback создавал false green

**Severity:** P1 product truth

Web Speech маскировал Vosk outage.

### W1-CI-27 — CSP размножен по десяткам source owners

**Severity:** P1 maintainability / P1 regression risk

Одна policy capability потребовала массового ручного fan-out.

### W1-CI-28 — model URL использует moving `main`

**Severity:** P1 availability

Hash защищает integrity, но moving revision может вызвать массовый fallback.

### W1-CI-29 — нет production external dependency telemetry

**Severity:** P1 observability

Невозможно доказать историческую долю Vosk/Web Speech.

### W1-CI-30 — нет full browser redirect/CSP/model cohort

**Severity:** P1 release evidence

Отсутствует один тест, связывающий CSP, redirects, CORS, hash и engine outcome.

## 51. Evidence paths

```text
working/ci-performance/47a5e899/external-dependency-manifest.json
working/ci-performance/47a5e899/csp-variant-report.json
working/ci-performance/47a5e899/tts-redirect-chain.json
working/ci-performance/47a5e899/tts-csp-mutation.md
working/ci-performance/47a5e899/tts-outcome-contract.json
working/ci-performance/47a5e899/full-model-cohort.md
working/ci-performance/47a5e899/live-feature-canary.md
```

---

# ЧАСТЬ XIII. ACCEPTANCE CRITERIA

## 52. Candidate architecture готова, когда

- exact final source SHA известен до build;
- production build выполняется ровно один раз;
- каждый planned check имеет result;
- CSP генерируется из одного source;
- policy variants объяснимы route capabilities;
- remove-CDN-host mutation падает;
- browser canary видит весь redirect chain;
- final host входит в approved pattern;
- no `securitypolicyviolation`;
- deterministic fallback считается failure;
- artifact/tree identities совпадают.

## 53. Release architecture готова, когда

- release не checkout source;
- release не выполняет npm/project scripts;
- running production release не отменяется;
- Pages получает exact approved artifact;
- live identity совпадает;
- impacted routes отвечают;
- TTS live canary сообщает ожидаемый engine/outcome;
- release ledger обновляется после live verification;
- IndexNow использует last-live range.

## 54. W1 можно закрыть, когда

- build count = 1;
- duplicate release paths = 0;
- moving-main checkout = 0;
- same-tree deployment доказан;
- CSP canonicalized;
- external redirect contract machine-readable;
- TTS cold cohort проходит;
- historical UI mutations ловятся;
- SW old/new cohort проходит;
- rollback rehearsal выполнен;
- p50/p95 до и после опубликованы;
- минимум 20 shadow runs без resolver misses.

---

# ЧАСТЬ XIV. КРАТКИЙ PROMPT СИСТЕМНОМУ АГЕНТУ

```text
Работай в FedorMilovanov/gb-is-my-strength и FedorMilovanov/AuditRepo.

Текущая база:
functional 932230d31ebe13bd219a2fe7293e512ce90719b5
final source 47a5e899f2b6a874749fcf707140269a3f665fae
AuditRepo 55c820601d1957e85c9c925ad4b214580618bcf5

Если HEAD изменился — сначала создай новую delta, ничего не редактируй.

Первая PR:
1. External dependency manifest для TTS.
2. Pin full Hugging Face revision.
3. CSP capability model в report-only/shadow, без удаления старых строк.
4. Browser harness ловит securitypolicyviolation.
5. Same-Xet delivery canary проверяет redirect chain, final host, CORS и hash.
6. Mutation: удалить *.aws.cdn.hf.co — тест обязан упасть.
7. Typed engine outcome: requestedEngine, selectedEngine, fallbackReason.
8. AuditRepo current-head reverify.
9. Никаких workflow topology, action upgrades и full CSP migration в этой PR.
10. Остановись после PR и представь evidence.
```

---

# ЧАСТЬ XV. ИСТОЧНИКИ И ЗОЛОТЫЕ ССЫЛКИ

Ниже — первичные и официальные источники, на которых основаны архитектурные решения.

## Web security и browser policy

1. MDN — Content-Security-Policy `connect-src`  
   https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/connect-src

2. W3C — Content Security Policy Level 3  
   https://www.w3.org/TR/CSP3/

3. MDN — Content Security Policy guide  
   https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP

4. MDN — Content-Security-Policy-Report-Only  
   https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy-Report-Only

5. MDN — Reporting-Endpoints  
   https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Reporting-Endpoints

6. MDN — SecurityPolicyViolationEvent  
   https://developer.mozilla.org/en-US/docs/Web/API/SecurityPolicyViolationEvent

7. WHATWG — Fetch Standard  
   https://fetch.spec.whatwg.org/

8. MDN — Subresource Integrity  
   https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity

9. MDN — SubtleCrypto.digest  
   https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest

10. W3C — Service Workers  
    https://w3c.github.io/ServiceWorker/

11. MDN — Using Service Workers  
    https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

12. MDN — Top layer  
    https://developer.mozilla.org/en-US/docs/Glossary/Top_layer

13. WHATWG — dialog element  
    https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element

## Hugging Face model delivery

14. Hugging Face — Xet storage backend  
    https://huggingface.co/docs/hub/xet/index

15. Hugging Face — Download files from the Hub  
    https://huggingface.co/docs/huggingface_hub/guides/download

16. Hugging Face — Hub cache system  
    https://huggingface.co/docs/huggingface_hub/guides/manage-cache

17. Hugging Face — Xet protocol specification  
    https://github.com/huggingface/xet-core/blob/main/docs/xet_protocol.md

## Playwright и browser ground truth

18. Playwright — Network  
    https://playwright.dev/docs/network

19. Playwright — Request API  
    https://playwright.dev/docs/api/class-request

20. Playwright — Response API  
    https://playwright.dev/docs/api/class-response

21. Playwright — Service Workers  
    https://playwright.dev/docs/service-workers

22. Playwright — Assertions  
    https://playwright.dev/docs/test-assertions

23. Playwright — Fixtures  
    https://playwright.dev/docs/test-fixtures

24. Playwright — Projects  
    https://playwright.dev/docs/test-projects

25. Playwright — Trace Viewer  
    https://playwright.dev/docs/trace-viewer

26. Playwright — Visual comparisons  
    https://playwright.dev/docs/test-snapshots

## GitHub Actions, Pages и provenance

27. GitHub — Events that trigger workflows  
    https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows

28. GitHub — Workflow concurrency  
    https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency

29. GitHub — Custom workflows for Pages  
    https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

30. GitHub — Workflow artifacts  
    https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts

31. GitHub — Artifact attestations  
    https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations

32. GitHub — Secure use reference  
    https://docs.github.com/en/actions/reference/security/secure-use

33. GitHub — Reusable workflows  
    https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows

34. GitHub — Matrix job variations  
    https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations

35. GitHub — Dependency caching  
    https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching

36. GitHub — Deployment environments  
    https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments

37. GitHub — Required status/ruleset troubleshooting  
    https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/troubleshooting-rules

## Test design, reproducibility и secure development

38. NIST — Automated Combinatorial Testing for Software  
    https://csrc.nist.gov/projects/automated-combinatorial-testing-for-software

39. NIST — Secure Software Development Framework SP 800-218  
    https://csrc.nist.gov/pubs/sp/800/218/final

40. Reproducible Builds — SOURCE_DATE_EPOCH  
    https://reproducible-builds.org/docs/source-date-epoch/

41. OpenSSF — GitHub configuration best practices  
    https://best.openssf.org/SCM-BestPractices/github/

42. OpenTelemetry — CI/CD semantic conventions  
    https://opentelemetry.io/docs/specs/semconv/cicd/

43. Nx — Affected  
    https://nx.dev/docs/features/ci-features/affected

44. Bazel — Remote caching  
    https://bazel.build/remote/caching

---

# ФИНАЛЬНЫЙ ВЕРДИКТ

Последний TTS/CSP incident подтверждает общий диагноз предыдущих волн:

```text
проверка отдельного файла
не равна
проверке реального пользовательского пути
```

Для этого проекта правильная конечная модель такова:

```text
один exact source
→ один детерминированный build
→ одна canonical policy
→ один approved artifact
→ browser checks настоящих состояний и redirects
→ один non-cancelable release
→ live identity и feature outcome
```

Самая первая текущая работа — не очередной большой workflow rewrite.

Самая безопасная первая работа:

```text
external dependency manifest
+ pinned provider revision
+ canonical CSP capability model
+ browser redirect/CSP canary
+ typed fallback outcome
+ mutation test
```

Она напрямую закрывает только что обнаруженный production failure и одновременно создаёт фундамент для остальной CI/CD-архитектуры.
