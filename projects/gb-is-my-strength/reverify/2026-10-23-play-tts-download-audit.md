# 2026-10-23 — PLAY, загрузка Vosk TTS и фактический звук

> Последовательные checkpoints: предыдущие числа/границы сохраняются; последний итог — в последнем продолжении, текущая очередь — MASTER.

Scope: пользовательский PLAY, реальные загрузчики/сигналы и визуал; не Product repair. Чистая база AuditRepo `267daacbc2af72c1ab9c5609bf22a941d4c398a5`, 4/4 baseline PASS. Product main повторно прочитан: `d14da74cfe9f45e9b03e383e8e622695b01f8e16`, source/lockfiles clean. Candidate #2184 продвинулся до `117df06a…`, но main не изменился; последнее продвижение касается heading hygiene, не TTS. Новые Product ветки/PR не создавались.

## 1. Что произошло после настоящего PLAY

Проверены Gill-1, Hermenevtika, Нагорная-1 и Lawson: **16 native click/tap cases** = 4 routes ×1440×900 desktop/390×844 touch ×Light/Dark. Находим реально окрашенную и hit-testable кнопку, не opacity-zero/offscreen control; при необходимости показываем chrome прокруткой. Применены reduced motion / ru-RU, изолированный cold context, SW blocked; первоначальный SW-enabled контроль дал тот же failure. Нажатия доходят до GBReaderTTS v2, это не просто неработающий обработчик кнопки.

В этом Chromium 153 системный `getVoices()` пуст. Реальный `speechSynthesis.speak` вызван по одному разу, получен **synthesis-failed**, **0 utterance onstart**, reader phase=error во всех 16 случаях. Это свойство среды, **не вывод о голосах на устройстве пользователя или поломке всех browser TTS**. Vosk в фоне падает на `importScripts` внешней fflate ещё **до** запроса model ZIP. После диагностики зависимостей оригинальный HF запрос также не завершился загрузкой в этой среде.

При этом видимый notice пишет **«Системный голос продолжает работать»**, хотя сам reader уже сообщает error. Это отдельный подтверждённый failure-state UX defect, не диагноз повреждённой модели. Source `js/vosk-tts-engine.js:showStatus` выбирает reassurance без знания фактического состояния fallback; нужен реальный start/error signal, а не наличие API.

Наличие audio/blob здесь не означает озвучку: настоящий MediaSession anchor — **2 секунды тишины, 8bit/8000Hz/16044 bytes, decoded peak=RMS=0**, не neural speech. Элемент `audio[data-gb-vosk-audio]` отсутствует во всех 16 cases. Мы не подменяли media.play, не посылали fake onstart/ready, не обходили autoplay policy. Физическую слышимость и first-audible timestamp не объявляем проверенными.

## 2. «Повторить» действительно не повторяет импорт после сбоя

Проверены **настоящий SharedWorker** (default) и **настоящий Dedicated Worker** (только capability-control без SharedWorker). В `ensureDependencies()` сохраняется отклонённый Promise; `ensureLoaded` очищает лишь loading. Документный Retry возвращается в тот же poisoned state.

- После первого реального CDN import failure временно восстановили доставку **точных** fflate 0.8.2 / onnxruntime-web 1.19.2 из npm: SRI обоих tarballs проверен, Product зависимости не обновлены. UI Retry даёт **0 новых import calls /0 model requests** в обоих workers.
- Сброс **только `state.dependencies`** в disposable worker (не ready/model/audio) и тот же UI Retry: **1 реальный import**, обе библиотеки действительно появились, начался запрос оригинального HF model URL. Он остановился на сетевой доставке, не на integrity check/инференсе.
- Это причинный A/B, не shipped fix. Ремонт должен делать failed dependency state повторяемым, сохраняя single-flight/peer lifecycle; не требовать перезагрузки или убийства всех SharedWorker клиентов. Закрытый `TTS-SHAREDWORKER-CLIENT-LIFECYCLE` не переоткрывается: это другая граница, его source contract по-прежнему PASS.

Важно для «уже скачанной» модели: IDB cache читается **после** `ensureDependencies`. Сохранённые веса сами по себе не устраняют отказ загрузки runtime-библиотек. Реальный warm 280MB cache здесь не создавался и не тестировался.

## 3. Архив, guards и визуал — без смешения сигналов

Публичный HF API сообщает `model-quant.zip` **280394098 bytes**, LFS SHA256 **34e742ce9bb3c1ae86679d5974d2496b9fae50f0629f51bb4f5edfadc5ff3d71**, совпадающий с expected hash worker. Это **publisher metadata**, не локальная проверка ZIP/качества речи; доказательств испорченного архива нет. Проверены original browser delivery, exact-npm dependency restore, прямой worker HF fetch, metadata API, наличие локального cache и публичных GitHub mirror/release assets; весов для настоящего inference не получили. Не имитировали их.

Source checks: consent (14 mutations), document-loader retry, engine-status architecture (16 mutations), SharedWorker client lifecycle — PASS. **Уже красный на clean main** `tts-ort-worker-path-contract.js`, exit1: mutation3 ищет assignment + четыре пробела, которых в worker нет. Первый правильный assignment не удаляется, только добавляется второй; baseline/mutant validation оба корректно возвращают []. Это **false-red negative fixture**, не доказательство неверного runtime WASM path. Не ослабляли/не переписывали тест ради зелени; отдельный necessary improvement.

Real-model fixtures действительно проверяют WAV/модель, но `tts-reader-real-model-browser-test.js` подменяет `HTMLMediaElement.play()` Promise; route/FSM fixtures также fake SpeechSynthesis. Их полезные scopes не равны настоящему воспроизведению или первому слышимому звуку. Новые probes используют реальные native signals.

Визуально просмотрены desktop/mobile Light/Dark error states и CTA, который не закрывает PLAY. **Нагорная-1, mobile390, Dark:** enabled PLAY glyph при opacity=1 проверенных button/container — `#d8b068` на фактически нарисованном `#f8f5f0`, максимальный ink/underlay contrast **1.869:1 <3:1** для функциональной нетекстовой иконки. Light control — **16.091:1**. Измерено PNG до/после скрытия только glyph с точным восстановлением style; не расчёт по воображаемому фону. Добавлено к существующему contrast batch, не новая дублирующая задача. Scoped axe button-name/ARIA/target-size на 4 representative states: violations 0, два aria-valid-attr-value incomplete сохранены; это не полный a11y PASS. Размер28px не объявлен сам по себе нарушением «обязательных44px».

Данные: [13 worker/source/provenance records](evidence/2026-10-23-tts-worker-retry.json) и [58 native/UI/pixel/axe records](evidence/2026-10-23-tts-native-play.json), exact round-trip. Scripts: `tts-native-play-recheck.mjs` (WIDTH/SCHEME split), `tts-worker-retry-recheck.mjs` (BASE8099 + MIRROR8101), `tts-play-icon-contrast.mjs` в durable harness. Для mirror распаковать pinned npm tarballs в отдельные `fflate/` и `onnxruntime-web/` вне Product/Git и отдать HTTP; это JS-delivery control, не сертификация WASM/inference/оригинального CDN. Все screenshots/dependencies/logs вне Git.

**Итог: 54 →57 =52 defects +3 necessary improvements +2 system lanes**: sticky worker retry, ложный fallback status, false-red ORT fixture. Contrast — расширение существующего owner. Ни одного Product fix этим AuditRepo diff не выполнено.

**НЕ ПРОВЕРЕНО:** локальные bytes/распаковка всего ZIP, настоящие cold/warm model sessions, нейросинтез/звучащий WAV, physical speakers, first-audible, фактические audio pause/resume/seek, пользовательский cache/OS voices, Safari/WebKit/реальные AT и независимые production bytes. Warm/playing visual state не выдаётся за работающую речь. LCP/CLS — lab/interaction samples, не field CWV. Для этих claims нужен доступный реальный model delivery, не снятие SHA guard и не fake media.

## Продолжение — отмена, opt-out и устаревший таймер карточки

Повторный clean baseline `9da3a6a` 4/4 PASS. Sandbox восстановил файлы на старом Git pointer: до изменения проверены все 2523 tree entries против опубликованного head, index tree совпал; восстановлен только pointer без file discard. Это ограничение среды, не дефект Product.

Source component test (неизменённые engine/CSS, valid local origin, public cancel/ensureLoaded APIs) изолировал три окна: before fade / during fade / after removal. Только в середине новое Disabled состояние переиспользует старый DOM, который старый callback удаляет через360ms. Before/after controls сохраняют новую карточку.

Затем **16 native Gill cases** = 4 сценария ×1440×900 desktop/390×844 touch ×Light/Dark; reduced motion, SW blocked. Показаны перед/во время/после fade и быстрый Enable в том же fade window. На таймингах источника (auto-hide1900ms + untracked removal360ms) не ставился fake clock. Все Play/Cancel/Enable действия — настоящие click/tap, кроме явно отмеченного cleanup.

- Рабочие части: native «Не загружать» реально прерывает pending HTTP; opt-out сохраняется после reload, повторный PLAY без разрешения не создаёт новой model request, Enable снимает opt-out и делает новый запрос; unrelated sentinel сохранён. Итого32 закрытых pending requests: **28 native cancel-button aborts +4 programmatic cleanup**, последние не считаются healthy native Cancel.
- **8 здоровых notice controls** до/после fade. **4 раза during fade** удаляется только что показанная карточка Disabled вместе с Enable; extra PLAY создаёт новую и позволяет вернуться в загрузку.
- **4 раза quick Enable during fade** успевает реально запустить новый запрос, но старая уборка удаляет уже Loading карточку и Cancel, пока HTTP остаётся open. Для безопасного завершения этих четырёх cases использован **только диагностический API cleanup**, не выданный за доступную пользователю кнопку.
- Причина: `hideNotice()` хранит только outer timer; вложенный `setTimeout360` захватывает `doomed` и не проверяет новое владение/state. `showStatus()` отменяет уже отработавший outer timer и `getNotice()` переиспользует fading element. Нужна lifecycle/generation-safe уборка, не произвольное увеличение timeout или принудительное постоянное уведомление. Новый отдельный `GBS-TTS-NOTICE-STALE-REMOVAL-TIMER`; исправление текста fallback не устраняет удаление DOM.

Транспортная граница: тест отдал **реальные pinned npm JS** и изменил у реального worker лишь3 transport URLs. Model endpoint — **настоящий открытый HTTP response без body**, проверяющий native fetch/AbortSignal, а не настоящий ZIP. Нет fake ready/PCM/media.play/speech events; original SHA guard сохранён, ready и neural audio оставались0. Это изоляция notice/cancel subsystem от известной CDN/retry ошибки, не доказательство скачанной модели, inference, аудио stop/pause/resume или production delivery. Не очищали model/favorites cache, Product source/lockfiles чистые.

[24 компактных документа](evidence/2026-10-23-tts-cancel-notice-race.json): anchors/provenance +3 component controls +16 native cases. Все записи сохранены exact round-trip, строки≤699chars; representative desktop/mobile Light/Dark screenshots просмотрены, PNG вне Git. Harness `tts-cancel-reenable-recheck.mjs`, pinned JS input directory `TTS_DEPS`; isolated HTTP fixture внутри запуска закрывается после browser. Source contracts по-прежнему4PASS/1pre-existing ORT false-red; зелёный source scope не покрывает fade/re-enable boundary.

**Последний итог: 57 →58 =53 defects +3 necessary improvements +2 system lanes.** Один новый notice lifecycle defect; здоровые cancellation/refusal controls не превращены в баги, прежние TTS findings не продублированы. Ни одного Product fix/merge, настоящая речь по-прежнему не аттестуется.
