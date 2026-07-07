# TTS voice + feature quality audit — 2026-07-07

Follow-up to `incoming/vosk-tts-integration-2026-07-06/REPORT.md` (Rounds
1–4). That work got the feature actually *working* end to end (CORS host
fix, confirmed live). This pass is a forward-looking audit of how to make
it *better* — voice quality and feature/UX quality — based on reading
`js/vosk-tts-core.js`, `js/vosk-tts-engine.js`, `js/floating-cluster-controller.js`
in full, plus real audio generated from the production ONNX model.

No code changes in this report; see the commit(s) referenced at the bottom
for what was actually applied from this list, and what was deliberately
left for later.

## Baseline (what's live right now)

- vosk-tts VITS+BERT, speaker hardcoded to `0` (`female_0`) in
  `floating-cluster-controller.js`, despite the model having 5 speakers.
- Synthesis params: `noise_level=0.8`, `duration_noise_level=0.8`, speed
  applied natively via the model's `scales` input (not post-hoc
  `playbackRate` — this is the right call, avoids phoneme-eating at 2x).
- Chunking: ~180 chars/chunk (`splitTtsChunks`), independent synthesis per
  chunk, no cross-chunk prosody.
- onnxruntime-web pinned to `numThreads = 1` (GitHub Pages can't set
  COOP/COEP, so WASM threads/cross-origin-isolation are unavailable — same
  root cause as the pre-existing REG-001 `_headers`-useless-on-Pages
  finding in `verified/MASTER_BUG_MATRIX.md`).
- Hosting: Hugging Face, 782MB zip, cached whole-file in IndexedDB keyed
  by a fixed string (`'files'`) — no version key, so a future model swap
  would not invalidate a returning visitor's stale cache.

## A. Voice / model quality

**A1 — Default speaker may not be the preferred one.** Production plays
`female_0`; the sample the user explicitly approved ("Вот хороший голос")
was `male_0` (speaker id 3). No voice picker exists; user cannot choose.
Cheapest fix in the whole audit — one constant.

**A2 — Text normalization drops or mis-reads site-specific content.**
`normalizeText()` in `vosk-tts-core.js`:
- Strips all non-Cyrillic characters, so **Roman numerals vanish
  entirely** — "XIX век" is read as "век" with the number silently gone.
  Common on the `baptisty-rossii/` pages (dates, centuries).
- No abbreviation expansion — Bible references like "Ин. 3:16" read as
  "ин три шестнадцать" instead of "Иоанна 3:16"; "т.е.", "т.д.", "см.",
  "гл." etc. are read as truncated fragments, not words.
- Decimal handling is explicitly marked `rough` in the source comment:
  "3,5" → "три и пять" instead of "три целых пять".
- Latin/non-Cyrillic words are deleted outright (documented, not a bug,
  just a hard limit of this model — no transliteration attempted).

**A3 — Chunk size (~180 chars) breaks prosody at every boundary.** Each
chunk is synthesized independently with no shared context, so long
articles have an audible "reset" every ~1-2 sentences. Vosk (unlike Web
Speech, which has a real ~32k-char utterance limit) has no such hard
ceiling — the 180 figure is a leftover from the Web Speech-only era,
inherited by `splitTtsChunks` for both engines uniformly.

**A4 — Synthesis params untuned.** `noise_level`/`duration_noise_level`
at `0.8` were never tuned by ear against alternatives; may or may not be
optimal per-speaker. Lower priority — requires blind A/B listening, no
objective metric available.

**A5 — Model weight vs. quality is separate.** BERT sub-model quantizes
654MB→156.5MB with confirmed-identical audio output (see Round 4 of the
integration report); this is a download-size win, not a voice-quality
lever, listed here only for completeness.

## B. Feature / UX quality

**B1 — The "click twice" problem (already known, tracked, explicitly
deferred).** First click always plays Web Speech; Vosk warms silently in
background; only a *later* click, if warm-up finished in time, uses Vosk.
With a 280-782MB payload, warm-up frequently does not finish before the
next click. User already flagged this in conversation; the agreed fix
(explicit loading state, "Загружаем голос…") is intentionally deferred
until the PLAY button visual redesign lands, to avoid doing the UI work
twice.

**B2 — No download-progress indicator.** `fetch(MODEL_URL)` awaits the
whole response with no progress feedback. A user watching devtools sees
network activity; a normal user sees nothing and cannot tell "loading"
from "broken". Fix requires streaming `response.body` with a reader loop
instead of a bare `fetch().then()` — bundled with B1 under the same
deferred UI work.

**B3 — No failure telemetry.** The alphacephei.com CORS bug (Round 4) was
found only because the user manually opened DevTools. All failure paths
(`console.warn` in `warmVoskInBackground`, `resolveTtsEngine`,
`fetchModelFiles`, `speak`'s `onerror`) are silent to analytics — no
`ym(...,'reachGoal',...)` call anywhere in the TTS code, despite the
pattern already being used elsewhere on the site (e.g.
`js/enhancements.js`'s quiz-answer tracking). Without this, a repeat of
the CORS-style failure would again be invisible until someone happens to
check the console by hand.

**B4 — No word-level highlighting for Vosk.** Web Speech's
`onboundary` drives a smooth progress ring; Vosk plays a pre-rendered
`<audio>` blob with no per-word timing surfaced, so the ring only jumps
at chunk boundaries (~every 180 chars) instead of continuously. The
better-quality engine currently has the worse "follow-along" experience.
The model's duration outputs (`floatToInt16`'s input, before quantization
to PCM) do contain per-phoneme timing that could in principle be mapped
back to word boundaries — nontrivial, not attempted in this pass.

**B5 — No cache-version key.** `idbGet('files')`/`idbSet('files', ...)`
use a fixed key. If the model file at `MODEL_URL` is ever replaced (e.g.
shipping the quantized BERT variant from Round 4), a returning visitor
with the old files cached in IndexedDB will keep using stale bytes
indefinitely — worse, a bert/main model.onnx mismatch (old main +
new-shape BERT or vice versa) could break inference outright, not just
serve stale weights.

**B6 — Single-thread WASM ceiling is structural, not a bug.** GitHub
Pages cannot serve the COOP/COEP headers WASM threading requires (see
REG-001 in the existing bug matrix — same underlying platform limit).
`ort.env.wasm.numThreads = 1` is not a mistake, it's the only option
without changing hosting/adding a headers-capable proxy in front of
Pages. Noted so a future pass doesn't "fix" this without realizing it
needs an infra change, not a code change.

**B7 — Accessibility not audited.** ARIA/screen-reader behavior of the
"Слушать" ember button while TTS is loading/playing/failing was out of
scope for this pass; flagging as an open item.

## Priority list

| # | Item | Impact | Effort | Category |
|---|------|--------|--------|----------|
| 1 | Default speaker → the one the user approved (+ optional picker) | high | low | voice |
| 2 | Explicit loading state + streamed download progress (B1+B2) | high | medium | UX — **deferred**, bundled with PLAY button visual redesign per explicit user instruction |
| 3 | Site-specific text-normalization layer: Bible-book abbreviations, safe non-inflected abbreviations, Roman numerals (non-inflected cardinal reading, not grammatically perfect ordinals), decimal wording fix | high | medium | voice |
| 4 | Ship quantized BERT model (782MB→280MB) + cache-version key (A5+B5) | medium | low (upload is a manual Hugging Face step, not automatable from this session) | weight/reliability |
| 5 | Failure telemetry via existing `ym(...,'reachGoal',...)` pattern (B3) | medium | low | reliability |
| 6 | Larger/paragraph-aware chunking (A3) | medium | medium | voice |
| 7 | Synthesis param tuning (A4), word-level highlighting for Vosk (B4) | unknown / medium | high | voice/UX |

Bottom line: the model itself is already near the ceiling of what a free
client-side runtime can deliver (user confirmed real-audio quality is
good). The highest-leverage, lowest-risk wins are **around** the model —
correct default voice, an honest loading UX, and a normalization layer
tuned to this site's actual vocabulary (Scripture references, historical
centuries, abbreviations) — not retraining or re-tuning the neural weights
themselves.

## What was applied from this list

See commit message(s) on `main` around 2026-07-07 for exactly which items
were implemented in this pass vs. left open. (Filled in retroactively —
check `git log` on `js/floating-cluster-controller.js`,
`js/vosk-tts-engine.js` around this date for the authoritative record if
this section is stale.)
