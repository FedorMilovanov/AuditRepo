# Vosk TTS integration — 2026-07-06

## Context

User request: current TTS ("gb-ember" play button) uses browser Web Speech API
(`speechSynthesis`) via `js/floating-cluster-controller.js`. Reported quality
issues: robotic/non-Russian voice depending on OS, phoneme-eating at 2x rate
(native rate on synthetic speech, not audio time-stretch).

## Evaluation done (chat session, not archived as separate reports)

Compared free, client-side-runnable TTS engines for Russian: Silero (no ONNX
export for TTS, CC-BY-NC license — rejected), Piper/`@diffusionstudio/vits-web`
(works but medium-quality voices, inconsistent across the 4 Russian voices,
Ruslan voice has an open upstream bug on some Russian text), Supertonic v3
(rejected after deep-verify: confirmed open upstream bug on Russian word
stress, supertone-inc/supertonic#132), MMS-TTS via transformers.js (CC-BY-NC,
non-commercial), Chatterbox Multilingual (~720MB, too heavy for a public
site). **vosk-tts** (github.com/alphacep/vosk-tts, Apache 2.0, VITS + BERT
stress-disambiguation) was selected: real ONNX models, permissive license,
community reputation close to Silero on stress quality, hosted on
alphacephei.com (not blocked from the user's network, unlike huggingface.co).

## What shipped (gb-is-my-strength repo, branch `claude/tts-russian-speech-quality-n57l5d`)

- `js/vosk-tts-core.js` — pure-JS port of vosk-tts's Python text pipeline
  (g2p.py rules, dictionary lookup, WordPiece tokenizer, multistream phoneme
  assembly, Russian number-to-words, WAV encoding). Verified against the real
  Python package (installed from PyPI + GitHub master) with 47 differential
  unit tests — 100% match.
- `js/vosk-tts-engine.js` — browser wrapper: lazy-loads onnxruntime-web +
  fflate (cdn.jsdelivr.net) and the vosk-model-tts-ru-0.9-multi model
  (alphacephei.com) only on first "Слушать" click; caches the unzipped model
  files in IndexedDB so subsequent visits are instant. Exposes
  `isSupported/isReady/ensureLoaded/speak/cancel`.
- `js/floating-cluster-controller.js` — TTS state machine (`ttsState`,
  `speakNextChunk`, `startTts/pauseTts/resumeTts/stopTts`,
  `gb:tts-rate-change` handler) now engine-agnostic: tries Vosk first
  (`resolveTtsEngine()`), falls back silently to the existing Web Speech path
  on any failure (network, unsupported browser, model parse error). No UI/CSS
  changes — reuses the existing idle/playing/paused/complete ember states to
  avoid touching the site's extensive visual-parity audit suite.
- CSP (`Content-Security-Policy` meta, 37 `*PageHead.astro`/`*PageChrome.astro`
  files + `DEFAULT_DIST_CSP` fallback in `scripts/astro-cache-bust-postbuild.js`):
  added `https://cdn.jsdelivr.net` to `script-src`, `https://alphacephei.com`
  to `connect-src`. User explicitly chose "extend CSP to an external host"
  over "commit ~100-150MB model files into the repo" (the other option
  considered, rejected due to permanent repo/deploy size growth).

## Testing performed (this session, not re-run by a separate audit pass)

- `node --check` on all three JS files.
- Full headless-Chromium (Playwright) end-to-end run against the **real**
  site files (`floating-cluster-controller.js`, `vosk-tts-engine.js`) with a
  synthetic ONNX model (matching real vosk-tts input/output tensor names) and
  a real local `onnxruntime-web@1.19.2` + `fflate` build, serving from a
  throwaway local HTTP server (CDN/alphacephei.com are blocked from this
  sandbox's proxy, real reachability could not be tested end-to-end here):
  - play → playing state, real `<audio>` element with a synthesized blob URL.
  - pause → `audio.paused === true`, state stays paused, no auto-advance.
  - resume → playing again from the same chunk.
  - stop mid-flight → idle, progress bar reset.
  - replay after stop → works (state machine reusable).
  - `gb:tts-rate-change` mid-playback → no crash, playing continues.
  - simulated model-host failure (aborted fetch) → confirmed clean fallback
    to Web Speech (`console.warn('[gbx-tts] Vosk engine unavailable...')`),
    matching the existing error-handling contract (ember → idle on synth
    error) with no regression.
- `npm run validate` (non-strict): 0 errors, 2 pre-existing warnings
  (title/og:title mismatches, unrelated to this change).
- Did **not** run `npm run validate:static-publication` / full `astro:build`
  (not attempted this session — network/time constraints; flagging as an
  open item for whoever picks this up next).

## Open items for next pass

- Real reachability of `alphacephei.com` model download from production
  network conditions (residential Russia, corporate proxies, etc.) has only
  been simulated, not verified live.
- No dedicated visual/CSS changes were made, but a full
  `validate:static-publication` run (or at least the Gill/PremiumControls
  visual-parity audits) has not been executed against this change.
- Speaker choice is hardcoded to speaker 0 of 5; no UI was added to pick a
  voice (kept out of scope to avoid touching visual/audit surface).
