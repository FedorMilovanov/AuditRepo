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

## Round 2: independent review before merging to `main` (same day)

User asked to merge straight to `main` (explicit decision, bypassing the
normal PR/CI gate) and to "recheck everything thoroughly" first. Two
independent passes were run against commit `f7df07b`:

**Code review (general-purpose agent, adversarial)** found the items below.
All were "fixed" in follow-up commit `92f2759` before merge, but **one of
them was a false positive that a closer look (prompted by the user asking
"isn't this legacy garbage?") caught after the merge** — corrected below,
not reverted (the edit is harmless dead-code churn, just not a real bug):

- ~~26 root-level static HTML pages (`baptisty-rossii/**`,
  `nagornaya/chast-*`, `articles/*`) load `floating-cluster-controller.js`
  but are hand-authored HTML, not Astro components — the first CSP patch
  only touched `*.astro` files via a `grep --include="*.astro"`, silently
  missing all 26 on production.~~ **FALSE POSITIVE, corrected 2026-07-06
  post-merge.** Checked `migration/page-ownership.json`: all 26 routes are
  `"owner": "astro"` / `"status": "production-dist"`. Checked
  `scripts/copy-legacy-to-dist.js`: it explicitly does **not** copy legacy
  HTML over astro-owned routes into `dist/`. Checked
  `.github/workflows/deploy.yml`: GitHub Pages is deployed from `dist/`
  only (`actions/upload-pages-artifact` `path: dist`). Conclusion: these 26
  root-level files are **stale strangler-migration leftovers that are never
  served in production** — the routes are actually built from the
  `*PageHead.astro`/`*PageChrome.astro` components, which the *first* CSP
  patch (commit `f7df07b`) already correctly covered. The CSP edits applied
  to the 26 root files in `92f2759` are inert (harmless, but pointless —
  they patch files nobody reads). Left as-is rather than reverted, since
  reverting a no-op edit isn't worth another commit; flagging here so the
  next audit pass doesn't repeat the same false alarm, and doesn't count
  this as a real fix in any bug tally.
  **Housekeeping suggestion for a future pass (not done here, out of
  scope):** these 26+ orphaned root HTML files (and however many more
  exist for other already-migrated `owner: astro` routes) could be deleted
  from the repo entirely — they're dead weight, not a safety net (deploy
  never reads them).
- `pauseTts()` didn't guard against the async `resolveTtsEngine()` promise
  (fired by `startTts()`) overriding a pause that happened while Vosk was
  still loading. Fixed: the `.then()` callback now checks `ttsState.paused`
  before calling `setEmberState('playing')`/`speakNextChunk()`. Note: on
  actual reproduction attempt (headless Chromium, simulated slow model
  download), a second click during the load window was found to hit the
  `state === 'idle'` branch (not `'playing'`) and just restart the load
  rather than reach `pauseTts()` at all — so the exact reachability path
  the reviewer described may be narrower than described. The fix was kept
  anyway since it's a strictly-defensive, zero-regression guard.
- Every synthesized chunk's `URL.createObjectURL()` was never revoked —
  unbounded Blob memory leak over a long article/session. Fixed: revoke
  the previous object URL before creating the next, and on `cancel()`.
- `synthChunk()` silently dropped BERT stress disambiguation for any
  `config.model_type` outside the 3 known multistream variants, with no
  error surfaced. Fixed: one-time `console.warn` when this happens.
- **BERT row-index desync on mid-word hyphens** ("по-моему", "кто-то"):
  `g2pMultistream`'s word-splitting didn't treat a bare hyphen as its own
  token the way `BertWordPieceTokenizer`'s basic tokenizer does, so every
  word after the first hyphenated compound in a chunk got the wrong BERT
  embedding row — silent prosody/stress corruption, no error. **Verified
  empirically against the real Python `vosk_tts.synth.Synth` +
  `BertWordPieceTokenizer`** (not just asserted): this exact desync
  reproduces in upstream vosk-tts's own reference pipeline too, it is not
  a porting bug. Fixed anyway in this port (diverges from upstream on
  purpose) since correct alignment can only improve the model's stress
  cues and hyphenated words are common in Russian text. Re-verified after
  the fix that `bertWordIndex` now matches the tokenizer's real word count.
  All 47 differential tests still pass after this change.

**Web research (general-purpose agent)** on the `alphacephei.com` CORS
question: **could not get a live header check** (this sandbox's egress
proxy blocks direct access to `alphacephei.com`, same as it blocks
`huggingface.co`). Found `ccoreilly/vosk-browser` (the most-used browser
Vosk wrapper) self-hosts its model same-origin rather than fetching from
alphacephei.com live, which is a *soft* signal the ecosystem doesn't lean
on alphacephei.com's CORS headers for production — but not proof they're
absent. Counter-evidence: this session's own manual test (see chat/user
screenshot, not archived here) showed a real end-to-end `fetch()` →
`arrayBuffer()` → unzip → ONNX inference → playback cycle succeed from
`http://localhost:3000`, which is not possible if the response were
CORS-blocked (a blocked cross-origin `fetch().arrayBuffer()` throws before
the bytes are usable, it doesn't silently degrade). Since `Origin` is
per-request-value-based (not localhost-privileged), this is real evidence
`alphacephei.com` sends a permissive CORS header, at least as of this
test. **Still not verified from `gospod-bog.ru` in production.** The
existing fallback-to-Web-Speech-on-any-fetch-failure design means a wrong
guess here degrades silently (feature never activates) rather than
breaking the page, which is why the user accepted the risk instead of
self-hosting the model.

Final merge: `git merge --no-ff` of `claude/tts-russian-speech-quality-n57l5d`
into `main` at `86bec6e`, resolving 6 trivial conflicts (a concurrent
`docs(agents)` commit on `main` had bumped `article:modified_time`/cache-bust
hashes on the same files; kept `main`'s newer values, re-applied the CSP
patch on top) plus one real conflict in `floating-cluster-controller.js`
(main had independently added a `u.onboundary` handler for continuous
progress-ring updates during Web Speech playback — kept it, wired only into
the Web Speech branch, since Vosk's `<audio>`-based playback doesn't have
an equivalent yet). `npm run validate` and the full Playwright e2e suite
were re-run against the merged tree and passed before pushing.

## Open items for next pass

- **Real reachability of `alphacephei.com` from `gospod-bog.ru` in
  production is still not directly verified** (see CORS section above) —
  highest-priority thing for the next audit pass to actually check, ideally
  with `curl -I -H "Origin: https://gospod-bog.ru" https://alphacephei.com/vosk/models/vosk-model-tts-ru-0.9-multi.zip`
  from a normal (non-sandboxed) network and confirming
  `Access-Control-Allow-Origin`.
- No dedicated visual/CSS changes were made, but a full
  `validate:static-publication` run (or at least the Gill/PremiumControls
  visual-parity audits) has still not been executed against this change —
  `npm run validate` (non-strict) is not a substitute for it.
- Speaker choice is hardcoded to speaker 0 of 5; no UI was added to pick a
  voice (kept out of scope to avoid touching visual/audit surface).
- This entire change merged to `main` without the repo's normal PR/CI
  review gate. Treat it as "author-reviewed + adversarially self-reviewed
  twice" but not "independently peer-reviewed the way every other change in
  this repo's history has been" until a fresh audit pass looks at it cold.
